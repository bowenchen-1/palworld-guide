#!/usr/bin/env node

import { createHash } from 'node:crypto';
import {
  existsSync, mkdirSync, readFileSync, renameSync, statSync, unlinkSync, watch, writeFileSync,
} from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, extname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const configPath = resolve(projectRoot, process.env.R2_ASSETS_CONFIG || 'config/r2-assets.json');
const manifestPath = resolve(projectRoot, process.env.R2_MANIFEST || 'docs/r2-asset-manifest.json');
const STABILITY_DEBOUNCE_MS = 1200;
const STABILITY_SAMPLE_MS = 500;

const contentTypes = {
  '.avif': 'image/avif', '.gif': 'image/gif', '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg',
  '.json': 'application/json; charset=utf-8', '.mp3': 'audio/mpeg', '.mp4': 'video/mp4',
  '.otf': 'font/otf', '.png': 'image/png', '.svg': 'image/svg+xml', '.ttf': 'font/ttf',
  '.wav': 'audio/wav', '.webm': 'video/webm', '.webp': 'image/webp', '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const temporaryName = /(^|\/)(\.|~\$)|(~$|\.tmp$|\.temp$|\.sw[px]$|\.bak$|\.crdownload$)/i;
const sleep = (ms) => new Promise((resolveSleep) => setTimeout(resolveSleep, ms));

function loadConfig() {
  const config = JSON.parse(readFileSync(configPath, 'utf8'));
  if (!Array.isArray(config.files) || config.files.length === 0) throw new Error('R2 resource config must contain a non-empty files array.');
  return {
    bucket: process.env.R2_BUCKET || config.bucket || 'palworldguide-assets',
    assetBaseUrl: (process.env.ASSET_BASE_URL || config.assetBaseUrl || 'https://assets.palworldguide.net').replace(/\/$/, ''),
    files: [...new Set(config.files)].sort(),
  };
}

function isTemporaryPath(sourcePath) {
  return temporaryName.test(sourcePath.replaceAll('\\', '/'));
}

function objectKey(sourcePath) {
  const key = relative(resolve(projectRoot, 'public'), resolve(projectRoot, sourcePath)).replaceAll('\\', '/');
  if (key.startsWith('../') || key === '') throw new Error(`R2 resource must be inside public/: ${sourcePath}`);
  return key;
}

function contentTypeFor(sourcePath) {
  return contentTypes[extname(sourcePath).toLowerCase()] || 'application/octet-stream';
}

function cacheControlFor(sourcePath) {
  return extname(sourcePath).toLowerCase() === '.json'
    ? 'public, max-age=300, must-revalidate'
    : 'public, max-age=31536000, immutable';
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

function sameStat(a, b) {
  return a.size === b.size && a.mtimeMs === b.mtimeMs;
}

async function waitForFileStability(fullPath, { debounceMs = STABILITY_DEBOUNCE_MS, sampleMs = STABILITY_SAMPLE_MS } = {}) {
  await sleep(debounceMs);
  if (!existsSync(fullPath)) throw new Error('file no longer exists');
  const first = statSync(fullPath);
  await sleep(sampleMs);
  if (!existsSync(fullPath)) throw new Error('file no longer exists');
  const second = statSync(fullPath);
  if (!sameStat(first, second)) return false;
  return true;
}

function readValidatedFile(fullPath, sourcePath) {
  if (!existsSync(fullPath)) throw new Error('file does not exist');
  const before = statSync(fullPath);
  if (!before.isFile() || before.size < 0) throw new Error('not a readable regular file');
  const bytes = readFileSync(fullPath);
  const after = statSync(fullPath);
  if (!sameStat(before, after) || bytes.length !== before.size) throw new Error('file changed while it was being read');
  if (extname(sourcePath).toLowerCase() === '.json') {
    try { JSON.parse(bytes.toString('utf8')); } catch (error) { throw new Error(`invalid JSON: ${error.message}`); }
  }
  return { bytes, stat: after, sha256: sha256(bytes) };
}

function loadManifest() {
  if (!existsSync(manifestPath)) return new Map();
  try {
    const parsed = JSON.parse(readFileSync(manifestPath, 'utf8'));
    return new Map((parsed.files || []).map((entry) => [entry.sourcePath, entry]));
  } catch (error) {
    console.warn(`manifest unreadable; remote objects will be re-uploaded: ${error.message}`);
    return new Map();
  }
}

function writeManifestAtomic(config, entries) {
  mkdirSync(dirname(manifestPath), { recursive: true });
  const output = `${JSON.stringify({
    generatedAt: new Date().toISOString(),
    bucket: config.bucket,
    publicBaseUrl: config.assetBaseUrl,
    files: entries,
  }, null, 2)}\n`;
  const tempPath = `${manifestPath}.${process.pid}.${Date.now()}.tmp`;
  try { writeFileSync(tempPath, output, { mode: 0o644 }); renameSync(tempPath, manifestPath); }
  finally { if (existsSync(tempPath)) unlinkSync(tempPath); }
}

async function headPublicUrl(publicUrl) {
  try {
    const response = await fetch(publicUrl, { method: 'HEAD', cache: 'no-store' });
    const result = {
      status: response.status,
      contentLength: response.headers.get('content-length'),
      contentType: response.headers.get('content-type'),
      cacheControl: response.headers.get('cache-control'),
      etag: response.headers.get('etag'),
    };
    if (response.status === 200 && result.contentLength === null) {
      const body = await fetch(publicUrl, { method: 'GET', cache: 'no-store' });
      result.contentLength = String((await body.arrayBuffer()).byteLength);
      result.contentLengthSource = 'GET';
    }
    return result;
  } catch (error) { return { status: 0, error: error.message }; }
}

function remoteMatches(entry, remote) {
  return remote.status === 200
    && Number(remote.contentLength) === entry.size
    && remote.contentType?.toLowerCase().startsWith(entry.contentType.split(';')[0].toLowerCase())
    && remote.cacheControl?.toLowerCase() === entry.cacheControl.toLowerCase()
    && Boolean(remote.etag);
}

function upload(config, entry) {
  const result = spawnSync('npx', ['--yes', 'wrangler@4.112.0', 'r2', 'object', 'put', `${config.bucket}/${entry.objectKey}`, '--remote',
    '--file', entry.fullPath, '--content-type', entry.contentType, '--cache-control', entry.cacheControl],
  { cwd: projectRoot, encoding: 'utf8', stdio: 'pipe' });
  if (result.status !== 0) throw new Error((result.stderr || result.stdout || `wrangler exited ${result.status}`).trim());
}

async function purgeCache(publicUrl) {
  const zoneId = process.env.CLOUDFLARE_ZONE_ID;
  const token = process.env.CLOUDFLARE_CACHE_PURGE_TOKEN;
  if (!zoneId || !token) throw new Error('CLOUDFLARE_ZONE_ID and CLOUDFLARE_CACHE_PURGE_TOKEN are required to purge cache.');
  const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${encodeURIComponent(zoneId)}/purge_cache`, {
    method: 'POST', headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify({ files: [publicUrl] }),
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.success) throw new Error(`Cloudflare cache purge failed (HTTP ${response.status}).`);
}

function makeEntry(config, sourcePath, local) {
  const objectKeyValue = objectKey(sourcePath);
  return {
    sourcePath, objectKey: objectKeyValue, fullPath: resolve(projectRoot, sourcePath), size: local.stat.size,
    contentType: contentTypeFor(sourcePath), cacheControl: cacheControlFor(sourcePath), sha256: local.sha256,
    publicUrl: `${config.assetBaseUrl}/${objectKeyValue}`,
  };
}

async function syncOne(config, sourcePath, previous, { dryRun = false, stable = true, stabilityOptions } = {}) {
  const fullPath = resolve(projectRoot, sourcePath);
  if (isTemporaryPath(sourcePath)) return { sourcePath, status: 'ignored', reason: 'temporary editor file' };
  if (stable && !await waitForFileStability(fullPath, stabilityOptions)) return { sourcePath, status: 'deferred', reason: 'file is still changing' };
  let local;
  try { local = readValidatedFile(fullPath, sourcePath); } catch (error) { return { sourcePath, status: 'failed', error: error.message }; }
  const entry = makeEntry(config, sourcePath, local);
  delete entry.fullPath;
  if (dryRun) return { ...entry, status: 'dry-run' };

  const old = previous.get(sourcePath);
  const remoteBefore = await headPublicUrl(entry.publicUrl);
  if (old?.sha256 === entry.sha256 && remoteMatches(entry, remoteBefore)) {
    return { ...entry, uploadStatus: 'skipped', headStatus: 'verified', etag: remoteBefore.etag, verifiedAt: new Date().toISOString() };
  }
  console.log(`${sourcePath} uploading...`);
  try {
    upload(config, { ...entry, fullPath });
    const remoteAfter = await headPublicUrl(entry.publicUrl);
    if (!remoteMatches(entry, remoteAfter)) throw new Error(`upload verification failed: ${JSON.stringify(remoteAfter)}`);
    console.log(`${sourcePath} upload verified`);
    await purgeCache(entry.publicUrl);
    console.log(`${sourcePath} cache purged`);
    return { ...entry, uploadStatus: 'uploaded', headStatus: 'verified', etag: remoteAfter.etag, verifiedAt: new Date().toISOString() };
  } catch (error) {
    return { ...entry, uploadStatus: 'failed', headStatus: 'failed', error: error.message };
  }
}

async function sync(config, sourcePaths, options = {}) {
  const previous = loadManifest();
  const results = [];
  for (const sourcePath of sourcePaths) {
    const label = relative(projectRoot, resolve(projectRoot, sourcePath));
    if (!options.dryRun && options.announce !== false) console.log(`${label} changed`);
    if (!options.dryRun && options.announce !== false) console.log(`${label} waiting for file stability...`);
    const result = await syncOne(config, sourcePath, previous, options);
    if (result.status === 'deferred') console.log(`${label} is still changing; deferred`);
    else if (result.uploadStatus === 'uploaded') console.log(`${label} sync complete`);
    else if (result.uploadStatus === 'skipped') console.log(`${label} unchanged; remote verification passed`);
    else if (result.status === 'failed' || result.uploadStatus === 'failed') console.error(`${label} sync failed: ${result.error}`);
    results.push(result);
  }
  if (!options.dryRun) {
    const existing = new Map(loadManifest());
    for (const result of results) if (result.uploadStatus === 'uploaded' || result.uploadStatus === 'skipped') existing.set(result.sourcePath, result);
    writeManifestAtomic(config, [...existing.values()].filter((entry) => config.files.includes(entry.sourcePath)));
  }
  return results;
}

function printDryRun(result) {
  console.log(JSON.stringify({ sourcePath: result.sourcePath, objectKey: result.objectKey, size: result.size, sha256: result.sha256, uploadUrl: result.publicUrl }, null, 2));
}

function startWatcher(config) {
  const configured = new Set(config.files.map((sourcePath) => resolve(projectRoot, sourcePath)));
  const directories = [...new Set([...configured].map((path) => dirname(path)))];
  const timers = new Map();
  const schedule = (fullPath) => {
    if (!configured.has(fullPath)) return;
    const sourcePath = relative(projectRoot, fullPath).replaceAll('\\', '/');
    clearTimeout(timers.get(fullPath));
    console.log(`${sourcePath} changed`);
    console.log(`${sourcePath} waiting for file stability...`);
    timers.set(fullPath, setTimeout(async () => {
      timers.delete(fullPath);
      await sync(config, [sourcePath], { announce: false, stabilityOptions: { debounceMs: 0, sampleMs: STABILITY_SAMPLE_MS } });
    }, STABILITY_DEBOUNCE_MS));
  };
  const watchers = directories.map((directory) => watch(directory, (eventType, filename) => {
    if (!filename || isTemporaryPath(filename)) return;
    schedule(resolve(directory, filename.toString()));
  }));
  console.log(`Watching ${config.files.length} configured R2 resources. Press Ctrl+C to stop.`);
  const stop = () => { for (const timer of timers.values()) clearTimeout(timer); for (const watcher of watchers) watcher.close(); console.log('R2 watcher stopped.'); process.exit(0); };
  process.once('SIGINT', stop); process.once('SIGTERM', stop);
}

async function main() {
  const config = loadConfig();
  const watchMode = process.argv.includes('--watch');
  const dryRun = process.argv.includes('--dry-run');
  if (watchMode && dryRun) throw new Error('--dry-run cannot be used with --watch.');
  if (watchMode) { startWatcher(config); return; }
  const results = await sync(config, config.files, { dryRun });
  if (dryRun) results.filter((result) => result.status === 'dry-run').forEach(printDryRun);
  if (results.some((result) => result.status === 'failed' || result.uploadStatus === 'failed')) process.exitCode = 1;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main().catch((error) => { console.error(`R2 sync failed: ${error.message}`); process.exitCode = 1; });

export { cacheControlFor, contentTypeFor, isTemporaryPath, objectKey, readValidatedFile, remoteMatches, sameStat, waitForFileStability };
