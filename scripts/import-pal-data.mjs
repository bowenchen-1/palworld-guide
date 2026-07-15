import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";

const dataUrl = new URL("../public/data/pals.json", import.meta.url);
const sourceUrl = new URL("../data/sources/paldb-1.0-20260715.json", import.meta.url);
const current = JSON.parse(await readFile(dataUrl, "utf8"));
const sourceDocument = JSON.parse(await readFile(sourceUrl, "utf8"));
const source = sourceDocument.records;
assert.ok(Array.isArray(source), "PalDB source must contain records");

const elementMap = { "无": "Neutral", "火": "Fire", "水": "Water", "雷": "Electric", "草": "Grass", "暗": "Dark", "龙": "Dragon", "地": "Ground", "冰": "Ice" };
const workMap = { "生火": "emitflame", "浇水": "watering", "播种": "seeding", "发电": "generateelectricity", "手工": "handcraft", "采集": "collection", "伐木": "deforest", "采矿": "mining", "制药": "productmedicine", "冷却": "cool", "搬运": "transport", "牧场": "monsterfarm" };
const sourceByName = new Map(source.map((pal) => [pal.name, pal]));

function mappedElements(value) {
  if (!value) return null;
  return value.split(/\s*\/\s*/).map((element) => elementMap[element]).filter(Boolean);
}

function mappedWork(value) {
  if (value === "—") return {};
  return Object.fromEntries([...value.matchAll(/([^；]+?)\s+Lv\.(\d+)/g)].map(([, name, level]) => [workMap[name], Number(level)]));
}

function numberOrNull(value) {
  return typeof value === "number" && value >= 0 ? value : null;
}

let imported = 0;
const normalized = current.map((existing) => {
  const record = sourceByName.get(existing.name);
  if (!record) {
    assert.equal(existing.name, "Gumoss (Special)", "unexpected Pal missing from the verified source snapshot");
    return { ...existing, price: existing.price ?? null };
  }

  assert.deepEqual(mappedWork(record.work), existing.work, `work-suitability conflict for ${existing.name}`);
  assert.equal(record.breedingPower, existing.power, `breeding-power conflict for ${existing.name}`);
  imported += 1;
  const elements = mappedElements(record.elements);
  return {
    ...existing,
    elements: elements ?? existing.elements,
    stats: {
      ...existing.stats,
      hp: numberOrNull(record.hp),
      defense: numberOrNull(record.defense),
      stamina: numberOrNull(record.stamina),
    },
    price: numberOrNull(record.price),
    rarity: numberOrNull(record.rarity),
    movement: {
      ...existing.movement,
      run: numberOrNull(record.run),
      rideSprint: numberOrNull(record.rideSprint),
    },
    partnerSkill: { name: record.partnerSkill === "—" ? null : record.partnerSkill, description: null },
  };
});

assert.equal(imported, 299, "expected every sourced record to import");
await writeFile(dataUrl, `${JSON.stringify(normalized, null, 2)}\n`);
console.log(`Imported 299 version-pinned PalDB records; preserved all identities, the existing Gumoss (Special) record, work suitability, and breeding power.`);
