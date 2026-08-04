import { readFile } from "node:fs/promises";

const pals = JSON.parse(await readFile(new URL("../public/data/pals.json", import.meta.url), "utf8"));
const details = JSON.parse(await readFile(new URL("../public/data/pal-details.json", import.meta.url), "utf8"));
const catalog = pals.filter((pal) => pal.id !== "12.1");
const slugs = new Set(catalog.map((pal) => pal.slug));
const detailSlugs = new Set(details.map((record) => record.palSlug));
if (details.length !== 299) throw new Error(`Expected 299 detail records, found ${details.length}`);
if (detailSlugs.size !== details.length) throw new Error("Duplicate supplemental Pal slugs found");
for (const slug of slugs) if (!detailSlugs.has(slug)) throw new Error(`Missing supplemental detail record: ${slug}`);
for (const record of details) {
  if (!record.sourceUrl || !record.name) throw new Error(`Incomplete identity for ${record.palSlug}`);
  if (!Array.isArray(record.spawner) || !Array.isArray(record.ranch) || !Array.isArray(record.activeSkills)) throw new Error(`Incomplete arrays for ${record.palSlug}`);
}
console.log(`Validated ${details.length} supplemental Pal detail records.`);
