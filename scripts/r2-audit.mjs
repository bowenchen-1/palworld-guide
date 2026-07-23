#!/usr/bin/env node

import { appendFileSync, existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(new URL('..', import.meta.url).pathname);
const publicRoot = resolve(projectRoot, 'public');
const configDefinitions = [
  ['assets', 'config/r2-assets.json', 'docs/r2-asset-manifest.json'],
  ['map', 'config/r2-map-assets.json', 'docs/r2-map-asset-manifest.json'],
  ['pals', 'config/r2-pal-assets.json', 'docs/r2-pal-asset-manifest.json'],
];

function walkFiles(directory, result = []) {
  for (const name of readDir(directory)) {
    const fullPath = resolve(directory, name);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) walkFiles(fullPath, result);
    else if (stat.isFile()) result.push(relative(publicRoot, fullPath).replaceAll('\\', '/'));
  }
  return result;
}

function readDir(directory) {
  return readdirSync(directory).sort();
}

function loadConfig(name, configPath, manifestPath) {
  const fullPath = resolve(projectRoot, configPath);
  const parsed = JSON.parse(readFileSync(fullPath, 'utf8'));
  if (!Array.isArray(parsed.files) || parsed.files.length === 0) {
    throw new Error(`${configPath} must contain a non-empty files array.`);
  }
  return { name, configPath, manifestPath, parsed, files: [...new Set(parsed.files)].sort() };
}

function normalizePublicPath(sourcePath) {
  const normalized = sourcePath.replaceAll('\\', '/');
  if (!normalized.startsWith('public/') || normalized.includes('/../') || normalized.endsWith('/..')) {
    throw new Error(`R2 source must be a file inside public/: ${sourcePath}`);
  }
  return normalized.slice('public/'.length);
}

function audit() {
  const publicFiles = walkFiles(publicRoot);
  const configs = configDefinitions.map(([name, configPath, manifestPath]) => loadConfig(name, configPath, manifestPath));
  const entries = new Map();
  const errors = [];
  const warnings = [];

  for (const config of configs) {
    for (const sourcePath of config.files) {
      let publicPath;
      try { publicPath = normalizePublicPath(sourcePath); }
      catch (error) { errors.push(error.message); continue; }
      const fullPath = resolve(projectRoot, sourcePath);
      if (!existsSync(fullPath) || !statSync(fullPath).isFile()) {
        errors.push(`${config.configPath}: missing local file ${sourcePath}`);
        continue;
      }
      const previous = entries.get(publicPath);
      if (previous) warnings.push(`duplicate allowlist entry ${publicPath} (${previous} and ${config.name})`);
      else entries.set(publicPath, config.name);
    }
  }

  const allowlisted = new Set(entries.keys());
  const unlisted = publicFiles.filter((file) => !allowlisted.has(file));
  const bytes = (files) => files.reduce((total, file) => total + statSync(resolve(publicRoot, file)).size, 0);
  const byExtension = (files) => Object.fromEntries([...files.reduce((counts, file) => {
    const extension = extname(file).toLowerCase() || '[none]';
    counts.set(extension, (counts.get(extension) || 0) + 1);
    return counts;
  }, new Map())].sort(([a], [b]) => a.localeCompare(b)));

  for (const config of configs) {
    if (!existsSync(resolve(projectRoot, config.manifestPath))) {
      warnings.push(`${config.manifestPath}: manifest is missing`);
      continue;
    }
    const manifest = JSON.parse(readFileSync(resolve(projectRoot, config.manifestPath), 'utf8'));
    const manifestFiles = new Set((manifest.files || []).map((entry) => entry.sourcePath));
    if (manifestFiles.size !== config.files.length) {
      warnings.push(`${config.manifestPath}: ${manifestFiles.size} manifest entries for ${config.files.length} allowlisted files`);
    }
  }

  const summary = {
    public: { files: publicFiles.length, bytes: bytes(publicFiles), byExtension: byExtension(publicFiles) },
    allowlisted: { files: allowlisted.size, bytes: bytes([...allowlisted]) },
    unlisted: { files: unlisted.length, bytes: bytes(unlisted), paths: unlisted },
    configs: Object.fromEntries(configs.map((config) => [config.name, {
      path: config.configPath,
      files: config.files.length,
      bytes: bytes(config.files.map((file) => normalizePublicPath(file)).filter((file) => allowlisted.has(file))),
      assetBaseUrl: config.parsed.assetBaseUrl,
    }])),
    warnings,
    errors,
  };

  return summary;
}

function printSummary(summary) {
  console.log(`public: ${summary.public.files} files, ${summary.public.bytes} bytes`);
  console.log(`allowlisted: ${summary.allowlisted.files} files, ${summary.allowlisted.bytes} bytes`);
  console.log(`unlisted: ${summary.unlisted.files} files, ${summary.unlisted.bytes} bytes`);
  for (const [name, config] of Object.entries(summary.configs)) {
    console.log(`${name}: ${config.files} files, ${config.bytes} bytes -> ${config.assetBaseUrl}`);
  }
  for (const warning of summary.warnings) console.warn(`warning: ${warning}`);
  for (const error of summary.errors) console.error(`error: ${error}`);
}

function writeGithubSummary(summary) {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryPath) return;
  const lines = [
    '## R2 asset audit',
    '',
    `- public: ${summary.public.files} files / ${summary.public.bytes} bytes`,
    `- allowlisted: ${summary.allowlisted.files} files / ${summary.allowlisted.bytes} bytes`,
    `- intentionally unlisted: ${summary.unlisted.files} files / ${summary.unlisted.bytes} bytes`,
    '',
    '| Config | Files | Bytes | Domain |',
    '|---|---:|---:|---|',
    ...Object.entries(summary.configs).map(([name, config]) => `| ${name} | ${config.files} | ${config.bytes} | ${config.assetBaseUrl} |`),
  ];
  if (summary.warnings.length) lines.push('', ...summary.warnings.map((warning) => `> Warning: ${warning}`));
  appendFileSync(summaryPath, `${lines.join('\n')}\n`);
}

const summary = audit();
if (resolve(process.argv[1] || '') === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--json')) console.log(JSON.stringify(summary, null, 2));
  else printSummary(summary);
  writeGithubSummary(summary);
  if (summary.errors.length) process.exitCode = 1;
}

export { audit, normalizePublicPath };
