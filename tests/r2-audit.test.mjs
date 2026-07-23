import assert from 'node:assert/strict';
import test from 'node:test';
import { audit, normalizePublicPath } from '../scripts/r2-audit.mjs';

test('R2 audit accepts only files inside public/', () => {
  assert.equal(normalizePublicPath('public/data/breeding.json'), 'data/breeding.json');
  assert.throws(() => normalizePublicPath('../secret.txt'), /inside public/);
  assert.throws(() => normalizePublicPath('public/../secret.txt'), /inside public/);
});

test('current R2 allowlists are locally complete and do not duplicate entries', () => {
  const summary = audit();
  assert.deepEqual(summary.errors, []);
  assert.equal(summary.warnings.length, 1);
  assert.match(summary.warnings[0], /docs\/r2-asset-manifest\.json/);
  assert.equal(summary.public.files, 1468);
  assert.equal(summary.allowlisted.files, 1046);
  assert.equal(summary.unlisted.files, 422);
});
