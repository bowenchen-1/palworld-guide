import { readFile } from "node:fs/promises";

const pals = JSON.parse(await readFile(new URL("../public/data/pals.json", import.meta.url), "utf8"));
const fields = {
  image: () => true, id: (pal) => pal.id, number: (pal) => pal.number, name: (pal) => pal.name, element: (pal) => pal.elements, workSuitability: (pal) => Object.keys(pal.work).length, breedingPower: (pal) => pal.power,
  hp: (pal) => pal.stats.hp, meleeAttack: (pal) => pal.stats.meleeAttack, rangedAttack: (pal) => pal.stats.rangedAttack, defense: (pal) => pal.stats.defense, support: (pal) => pal.stats.support, craftSpeed: (pal) => pal.stats.craftSpeed, stamina: (pal) => pal.stats.stamina,
  rarity: (pal) => pal.rarity, price: (pal) => pal.price, foodConsumption: (pal) => pal.foodConsumption, slowWalk: (pal) => pal.movement.slowWalk, walk: (pal) => pal.movement.walk, run: (pal) => pal.movement.run, rideSprint: (pal) => pal.movement.rideSprint, nocturnal: (pal) => pal.nocturnal, partnerSkill: (pal) => pal.partnerSkill.name, activeSkills: (pal) => pal.activeSkills, drops: (pal) => pal.drops, ranchProduct: (pal) => pal.ranchProduct,
};
for (const [field, value] of Object.entries(fields)) { const count = pals.filter((pal) => { const result = value(pal); return Array.isArray(result) ? result.length > 0 : result !== null && result !== undefined && result !== ""; }).length; console.log(`${field}: ${count} / ${pals.length} / ${(count / pals.length * 100).toFixed(1)}%`); }
