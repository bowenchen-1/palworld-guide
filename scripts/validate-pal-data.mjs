import { readFile, readdir } from "node:fs/promises";
import assert from "node:assert/strict";

const pals = JSON.parse(await readFile(new URL("../public/data/pals.json", import.meta.url), "utf8"));
const version = JSON.parse(await readFile(new URL("../public/data/data-version.json", import.meta.url), "utf8"));
const images = new Set(await readdir(new URL("../public/pals/", import.meta.url)));
const workKeys = new Set(["emitflame", "watering", "seeding", "generateelectricity", "handcraft", "collection", "deforest", "mining", "productmedicine", "cool", "transport", "monsterfarm"]);
assert.equal(version.gameVersion, "1.0");
assert.equal(pals.length, version.records);
assert.equal(new Set(pals.map((pal) => pal.id)).size, pals.length, "duplicate Pal ids");
assert.equal(new Set(pals.map((pal) => pal.slug)).size, pals.length, "duplicate Pal slugs");
assert.equal(new Set(pals.map((pal) => pal.number)).size, pals.length, "duplicate Paldeck numbers");
for (const pal of pals) {
  assert.match(pal.id, /^(M\d+|\d+\.\d+)$/);
  assert.match(pal.slug, /^[a-z0-9-]+$/);
  assert.ok(images.has(`${pal.id}.webp`), `missing image for ${pal.name}`);
  assert.ok(Array.isArray(pal.elements));
  assert.ok(pal.stats && pal.movement && pal.partnerSkill && "activeSkills" in pal && "drops" in pal && "ranchProduct" in pal);
  for (const [key, level] of Object.entries(pal.work)) { assert.ok(workKeys.has(key), `unknown work key ${key}`); assert.ok(Number.isInteger(level) && level >= 1 && level <= 8, `invalid work level for ${pal.name}`); }
  for (const field of [pal.stats.hp, pal.stats.meleeAttack, pal.stats.rangedAttack, pal.stats.defense, pal.stats.support, pal.stats.craftSpeed, pal.stats.stamina, pal.rarity, pal.foodConsumption, pal.movement.slowWalk, pal.movement.walk, pal.movement.run, pal.movement.rideSprint]) assert.ok(field === null || (typeof field === "number" && field >= 0), `invalid numeric field for ${pal.name}`);
  assert.ok(pal.nocturnal === null || typeof pal.nocturnal === "boolean");
}
const coverage = {
  elements: pals.filter((pal) => pal.elements.length > 0).length,
  hp: pals.filter((pal) => pal.stats.hp !== null).length,
  meleeAttack: pals.filter((pal) => pal.stats.meleeAttack !== null).length,
  rangedAttack: pals.filter((pal) => pal.stats.rangedAttack !== null).length,
  defense: pals.filter((pal) => pal.stats.defense !== null).length,
  support: pals.filter((pal) => pal.stats.support !== null).length,
  craftSpeed: pals.filter((pal) => pal.stats.craftSpeed !== null).length,
  stamina: pals.filter((pal) => pal.stats.stamina !== null).length,
  rarity: pals.filter((pal) => pal.rarity !== null).length,
  foodConsumption: pals.filter((pal) => pal.foodConsumption !== null).length,
  runSpeed: pals.filter((pal) => pal.movement.run !== null).length,
  nocturnal: pals.filter((pal) => pal.nocturnal !== null).length,
  partnerSkill: pals.filter((pal) => pal.partnerSkill.name !== null).length,
  activeSkills: pals.filter((pal) => pal.activeSkills !== null).length,
  drops: pals.filter((pal) => pal.drops !== null).length,
  ranchProduct: pals.filter((pal) => pal.ranchProduct !== null).length,
};
assert.deepEqual(coverage, version.coverage, "coverage manifest is stale");
console.log(`Validated ${pals.length} Pal records, ${images.size} images, and Palworld ${version.gameVersion} metadata. Coverage: ${JSON.stringify(coverage)}.`);
