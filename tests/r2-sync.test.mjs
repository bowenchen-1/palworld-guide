import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import {
  cacheControlFor, contentTypeFor, isTemporaryPath, objectKey, readValidatedFile, remoteMatches, shouldPurgeCache, waitForFileStability,
} from '../scripts/r2-sync.mjs';

test('R2 metadata policies use short JSON cache and long immutable image cache', () => {
  assert.equal(cacheControlFor('public/data/breeding.json'), 'public, max-age=300, must-revalidate');
  assert.equal(cacheControlFor('public/pals/26.0.png'), 'public, max-age=31536000, immutable');
  assert.equal(shouldPurgeCache({ cacheControl: 'public, max-age=31536000, immutable' }), false);
  assert.equal(shouldPurgeCache({ cacheControl: 'public, max-age=300, must-revalidate' }), true);
  assert.equal(contentTypeFor('public/data/breeding.json'), 'application/json; charset=utf-8');
  assert.equal(contentTypeFor('public/items/tree.jpg'), 'image/jpeg');
});

test('temporary editor names are excluded and public paths map to R2 keys', () => {
  assert.equal(isTemporaryPath('public/data/.breeding.json.swp'), true);
  assert.equal(isTemporaryPath('public/data/breeding.json~'), true);
  assert.equal(isTemporaryPath('public/data/breeding.json'), false);
  assert.equal(objectKey('public/data/breeding.json'), 'data/breeding.json');
});

test('JSON validation rejects incomplete files before an upload can begin', () => {
  const directory = mkdtempSync(join(tmpdir(), 'r2-sync-'));
  const invalid = join(directory, 'breeding.json');
  writeFileSync(invalid, '{"partial":');
  assert.throws(() => readValidatedFile(invalid, 'public/data/breeding.json'), /invalid JSON/);
  writeFileSync(invalid, '{"complete":true}');
  const local = readValidatedFile(invalid, 'public/data/breeding.json');
  assert.equal(local.bytes.toString('utf8'), '{"complete":true}');
  assert.match(local.sha256, /^[a-f0-9]{64}$/);
  rmSync(directory, { recursive: true, force: true });
});

test('stability check detects a quiet file with two matching samples', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'r2-stable-'));
  const file = join(directory, 'asset.json');
  writeFileSync(file, '{}');
  assert.equal(await waitForFileStability(file, { debounceMs: 1, sampleMs: 5 }), true);
  rmSync(directory, { recursive: true, force: true });
});

test('stability check defers a file that changes during the sampling window', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'r2-growing-'));
  const file = join(directory, 'asset.json');
  writeFileSync(file, '{}');
  setTimeout(() => writeFileSync(file, '{"stillWriting":true}'), 3);
  assert.equal(await waitForFileStability(file, { debounceMs: 1, sampleMs: 15 }), false);
  rmSync(directory, { recursive: true, force: true });
});

test('remote validation requires status, size, type, cache policy, and an ETag', () => {
  const entry = { size: 12, contentType: 'application/json; charset=utf-8', cacheControl: 'public, max-age=300, must-revalidate' };
  const good = { status: 200, contentLength: '12', contentType: 'application/json; charset=utf-8', cacheControl: 'public, max-age=300, must-revalidate', etag: '"remote-tag"' };
  assert.equal(remoteMatches(entry, good), true);
  assert.equal(remoteMatches(entry, { ...good, etag: null }), false);
  assert.equal(remoteMatches(entry, { ...good, cacheControl: 'public, max-age=86400' }), false);
});
