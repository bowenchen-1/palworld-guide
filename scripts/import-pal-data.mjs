import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";

const dataUrl = new URL("../public/data/pals.json", import.meta.url);
const sourceUrl = new URL("../data/sources/atlas-24181105.json", import.meta.url);
const current = JSON.parse(await readFile(dataUrl, "utf8"));
const sourceDocument = JSON.parse(await readFile(sourceUrl, "utf8"));
const source = sourceDocument.records;
assert.ok(Array.isArray(source), "Atlas source must contain records");
const elementMap = { Normal: "Neutral", Leaf: "Grass", Thunder: "Electric", Earth: "Ground", Ice: "Ice", Fire: "Fire", Water: "Water", Dark: "Dark", Dragon: "Dragon" };
const workMap = { EmitFlame: "emitflame", Watering: "watering", Seeding: "seeding", GenerateElectricity: "generateelectricity", Handcraft: "handcraft", Collection: "collection", Deforest: "deforest", Mining: "mining", ProductMedicine: "productmedicine", Cool: "cool", Transport: "transport", MonsterFarm: "monsterfarm" };
const sourceByName = new Map(source.map((pal) => [pal.name, pal]));
const specialSource = source.find((pal) => pal.id === "PlantSlime_Flower");
let imported = 0;
const normalized = current.map((existing) => {
  if (existing.kind !== "pal") return { ...existing, stats: { ...existing.stats, stamina: existing.stats.stamina ?? null } };
  const atlas = existing.name === "Gumoss (Special)" ? specialSource : sourceByName.get(existing.name);
  assert.ok(atlas, `missing Atlas record for ${existing.name}`);
  const mappedWork = Object.fromEntries(Object.entries(atlas.workSuitability).map(([key, value]) => [workMap[key], value]));
  assert.deepEqual(mappedWork, existing.work, `work-suitability conflict for ${existing.name}`);
  assert.equal(atlas.breedingRank, existing.power, `breeding-power conflict for ${existing.name}`);
  imported += 1;
  return {
    ...existing,
    elements: atlas.elements.map((element) => elementMap[element] ?? element),
    stats: { ...existing.stats, hp: atlas.hp, rangedAttack: atlas.attack, defense: atlas.defense, stamina: atlas.stamina >= 0 ? atlas.stamina : null },
    rarity: atlas.rarity,
    foodConsumption: atlas.food,
    movement: { ...existing.movement, run: atlas.runSpeed >= 0 ? atlas.runSpeed : null },
    nocturnal: atlas.nocturnal,
  };
});
assert.equal(imported, 289, "expected every Palworld Pal to import");
await writeFile(dataUrl, `${JSON.stringify(normalized, null, 2)}\n`);
console.log(`Imported verified Atlas fields for ${imported} Pals without changing IDs, slugs, numbers, images, work, or breeding power.`);
