#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const projectRoot = resolve(new URL('..', import.meta.url).pathname);
const bucket = process.env.R2_BUCKET || 'palworldguide-assets';
const publicBaseUrl = (process.env.ASSET_BASE_URL || 'https://assets.palworldguide.net').replace(/\/$/, '');
const manifestPath = resolve(projectRoot, process.env.R2_MANIFEST || 'docs/r2-asset-manifest.json');
const apply = process.argv.includes('--apply');
const all = process.argv.includes('--all');

const firstTestFiles = [
  'public/items/hardwood/feybreak-region-map.png',
  'public/items/hardwood/twilight-grove.webp',
  'public/items/hardwood/trees-2.jpg',
  'public/icons/palworld/partner-skills/273_Bastigor_partner.png',
  'public/pals/26.0.png',
  'public/data/breeding.json',
];

const contentTypes = {
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.json': 'application/json; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.otf': 'font/otf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.wav': 'audio/wav',
  '.webm': 'video/webm',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function sha256(filePath) {
  return createHash('sha256').update(readFileSync(filePath)).digest('hex');
}

function cacheControl(sourcePath) {
  // Versioned/static content is safe to cache long-term. JSON is fixed in this first test,
  // but remains on a one-day cache so a later data correction is not hidden for a year.
  return extname(sourcePath).toLowerCase() === '.json'
    ? 'public, max-age=86400'
    : 'public, max-age=31536000, immutable';
}

function objectKey(sourcePath) {
  return relative(resolve(projectRoot, 'public'), resolve(projectRoot, sourcePath)).replaceAll('\\', '/');
}

function loadPreviousManifest() {
  if (!existsSync(manifestPath)) return new Map();
  try {
    const parsed = JSON.parse(readFileSync(manifestPath, 'utf8'));
    return new Map((parsed.files || []).map((entry) => [entry.sourcePath, entry]));
  } catch (error) {
    console.warn(`无法读取旧 manifest，将创建新清单：${error.message}`);
    return new Map();
  }
}

function resolveSources() {
  const requested = all ? scanPublicForMigrationCandidates() : firstTestFiles;
  return requested.filter((sourcePath) => {
    const fullPath = resolve(projectRoot, sourcePath);
    if (!existsSync(fullPath)) {
      console.warn(`跳过不存在的文件：${sourcePath}`);
      return false;
    }
    return true;
  });
}

function scanPublicForMigrationCandidates() {
  const allowed = new Set(Object.keys(contentTypes));
  const results = [];
  function walk(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const fullPath = join(directory, entry.name);
      if (entry.isDirectory()) walk(fullPath);
      else if (allowed.has(extname(entry.name).toLowerCase())) {
        const size = statSync(fullPath).size;
        const ext = extname(entry.name).toLowerCase();
        if (size > 100 * 1024 || ['.woff', '.woff2', '.ttf', '.otf', '.mp4', '.webm', '.mp3', '.wav'].includes(ext)) {
          results.push(relative(projectRoot, fullPath));
        }
      }
    }
  }
  walk(resolve(projectRoot, 'public'));
  return results.sort();
}

async function headObject(publicUrl) {
  try {
    const response = await fetch(publicUrl, { method: 'HEAD' });
    const result = {
      headStatus: response.status === 200 ? 'verified' : `http-${response.status}`,
      statusCode: response.status,
      contentLength: response.headers.get('content-length'),
      contentType: response.headers.get('content-type'),
      cacheControl: response.headers.get('cache-control'),
      etag: response.headers.get('etag'),
    };
    // Some Cloudflare responses omit Content-Length on HEAD. Record that anomaly,
    // then verify the exact byte count with GET instead of treating it as a 404.
    if (result.headStatus === 'verified' && result.contentLength === null) {
      const body = await fetch(publicUrl, { method: 'GET' });
      const bytes = await body.arrayBuffer();
      result.contentLength = String(bytes.byteLength);
      result.contentLengthSource = 'GET';
      result.headContentLengthMissing = true;
    }
    return result;
  } catch (error) {
    return { headStatus: 'failed', error: error.message };
  }
}

function upload(sourcePath, key, contentType, cache) {
  const result = spawnSync('npx', [
    'wrangler', 'r2', 'object', 'put', `${bucket}/${key}`,
    '--remote',
    '--file', resolve(projectRoot, sourcePath),
    '--content-type', contentType,
    '--cache-control', cache,
  ], { cwd: projectRoot, encoding: 'utf8', stdio: 'pipe' });
  if (result.status !== 0) {
    throw new Error((result.stderr || result.stdout || `exit ${result.status}`).trim());
  }
}

async function main() {
  const previous = loadPreviousManifest();
  const files = [];
  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const sourcePath of resolveSources()) {
    const fullPath = resolve(projectRoot, sourcePath);
    const stat = statSync(fullPath);
    const key = objectKey(sourcePath);
    const contentType = contentTypes[extname(sourcePath).toLowerCase()] || 'application/octet-stream';
    const cache = cacheControl(sourcePath);
    const entry = {
      sourcePath,
      objectKey: key,
      size: stat.size,
      contentType,
      cacheControl: cache,
      sha256: sha256(fullPath),
      publicUrl: `${publicBaseUrl}/${key}`,
      uploadStatus: apply ? 'pending' : '待上传',
      headStatus: apply ? 'pending' : '未测试',
      etag: null,
      verifiedAt: null,
    };

    if (!apply) {
      files.push(entry);
      continue;
    }

    const old = previous.get(sourcePath);
    const remoteBefore = await headObject(entry.publicUrl);
    const canSkip = old?.sha256 === entry.sha256
      && remoteBefore.headStatus === 'verified'
      && Number(remoteBefore.contentLength) === entry.size;

    try {
      if (canSkip) {
        entry.uploadStatus = 'skipped';
        skipped += 1;
      } else {
        upload(sourcePath, key, contentType, cache);
        entry.uploadStatus = 'uploaded';
        uploaded += 1;
      }
      const verified = await headObject(entry.publicUrl);
      entry.headStatus = verified.headStatus;
      entry.etag = verified.etag || null;
      entry.remoteContentLength = verified.contentLength || null;
      entry.remoteContentType = verified.contentType || null;
      entry.remoteCacheControl = verified.cacheControl || null;
      entry.contentLengthSource = verified.contentLengthSource || 'HEAD';
      entry.headContentLengthMissing = verified.headContentLengthMissing || false;
      entry.verifiedAt = new Date().toISOString();
      if (verified.headStatus !== 'verified'
        || Number(verified.contentLength) !== entry.size
        || !verified.contentType?.toLowerCase().startsWith(contentType.split(';')[0].toLowerCase())) {
        throw new Error(`HEAD 元数据校验失败：${JSON.stringify(verified)}`);
      }
    } catch (error) {
      entry.uploadStatus = 'failed';
      entry.headStatus = 'failed';
      entry.error = error.message;
      failed += 1;
    }
    files.push(entry);
  }

  mkdirSync(dirname(manifestPath), { recursive: true });
  const manifest = {
    generatedAt: new Date().toISOString(),
    bucket,
    publicBaseUrl,
    mode: apply ? 'apply' : 'dry-run',
    files,
  };
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  console.log(`模式：${manifest.mode}`);
  console.log(`清单：${manifestPath}`);
  console.log(`文件：${files.length} | 上传：${uploaded} | 跳过：${skipped} | 失败：${failed}`);
  if (!apply) console.log('这是 dry-run，未上传任何文件。确认后再运行：npm run r2:assets -- --apply');
  if (failed > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
