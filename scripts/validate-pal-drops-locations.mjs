import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";

const pals = JSON.parse(await readFile(new URL("../public/data/pals.json", import.meta.url), "utf8"));
const records = JSON.parse(await readFile(new URL("../public/data/pal-drops-locations.json", import.meta.url), "utf8"));
const iconFiles = new Set(await readdir(new URL("../public/icons/palworld/drops/", import.meta.url)));
const catalog = pals.filter((pal) => pal.id !== "12.1");
const catalogSlugs = new Set(catalog.map((pal) => pal.slug));
assert.equal(catalog.length, 299, "catalog count changed");
assert.equal(records.length, 299, "drops/location record count changed");
assert.equal(new Set(records.map((record) => record.palSlug)).size, records.length, "duplicate drops/location slugs");
for (const record of records) {
  assert.ok(catalogSlugs.has(record.palSlug), `unknown Pal slug: ${record.palSlug}`);
  assert.ok(Array.isArray(record.drops) && record.drops.length, `missing drops: ${record.palSlug}`);
  assert.ok(Array.isArray(record.locations) && record.locations.length, `missing locations: ${record.palSlug}`);
  for (const drop of record.drops) { assert.ok(typeof drop.name === "string" && drop.name.length, `invalid drop in ${record.palSlug}`); assert.doesNotMatch(drop.name, /[\u4e00-\u9fff]/, `untranslated drop in ${record.palSlug}`); assert.ok(typeof drop.icon === "string" && iconFiles.has(drop.icon), `missing drop icon in ${record.palSlug}: ${drop.name}`); }
  for (const location of record.locations) { assert.ok(typeof location.name === "string" && location.name.length, `invalid location in ${record.palSlug}`); assert.doesNotMatch(location.name, /[\u4e00-\u9fff]/, `untranslated location in ${record.palSlug}`); }
}
assert.equal(new Set([...catalogSlugs].filter((slug) => !records.some((record) => record.palSlug === slug))).size, 0, "catalog Pal without a drops/location record");
console.log(`Validated ${records.length} drops/location records for all ${catalog.length} catalog Pals.`);
