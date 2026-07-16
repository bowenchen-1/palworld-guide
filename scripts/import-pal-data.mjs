import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";

const dataUrl = new URL("../public/data/pals.json", import.meta.url);
const sourceUrl = new URL("../data/sources/paldb-1.0-20260715.json", import.meta.url);
const iconManifestUrl = new URL("../data/sources/palworld-icon-manifest.json", import.meta.url);
const current = JSON.parse(await readFile(dataUrl, "utf8"));
const sourceDocument = JSON.parse(await readFile(sourceUrl, "utf8"));
const iconManifest = JSON.parse(await readFile(iconManifestUrl, "utf8"));
const source = sourceDocument.records;
assert.ok(Array.isArray(source), "PalDB source must contain records");

const elementMap = { "无": "Neutral", "火": "Fire", "水": "Water", "雷": "Electric", "草": "Grass", "暗": "Dark", "龙": "Dragon", "地": "Ground", "冰": "Ice" };
const workMap = { "生火": "emitflame", "浇水": "watering", "播种": "seeding", "发电": "generateelectricity", "手工": "handcraft", "采集": "collection", "伐木": "deforest", "采矿": "mining", "制药": "productmedicine", "冷却": "cool", "搬运": "transport", "牧场": "monsterfarm" };
const newPalNames = new Set("Pupperai,Clovee,Amione,Wispaw,Muffly,Puffolt,Elgrove,Leafan,Needoll,Moldron,Majex,Gildra,Skutlass,Pierdon,Snugloo,Carnibora,Dualith,Sekhmet,Tetroise,Bulldosu,Valentail,Snock,Souffline,Lapiron,Hoodle,Slowatt,Bakemi,Solmora,Lapure,Eidrolon,Dynamoff,Tropicaw,Flaracle,Ophydia,Dupin,Roujay,Venusa,Mycora,Loomen,Wistella,Solenne,Renjishi,Aegidron,Shaolong,Silvance,Dandilord,Panthalus".split(","));
const newVariantNames = new Set("Beakon Cryst,Celesdir Noct,Dualith Noct,Eidrolon Ignis,Elgrove Cryst,Gloopie Primo,Knocklem Ignis,Moldron Cryst,Needoll Noct,Nitemary Botan,Petallia Ignis,Pierdon Cryst,Polapup Terra,Prixter Lux,Rayhound Cryst,Sibelyx Primo,Skutlass Ignis,Smokie Cryst,Snock Lux,Solmora Lux,Starryon Primo,Tanzee Ignis,Tetroise Primo,Univolt Cryst,Woolipop Terra".split(","));
const sourceByName = new Map(source.map((pal) => [pal.name, pal]));
const partnerIconsByName = new Map(iconManifest.partnerSkills.map((entry) => [entry.pal.trim(), entry]));
assert.equal(partnerIconsByName.size, current.length, "expected a complete Partner Skill icon mapping");

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
  const newType = newPalNames.has(existing.name) ? "new-pal" : newVariantNames.has(existing.name) ? "new-variant" : null;
  const record = sourceByName.get(existing.name);
  const icon = partnerIconsByName.get(existing.name);
  assert.ok(icon, `missing Partner Skill icon mapping for ${existing.name}`);
  if (!record) {
    assert.equal(existing.name, "Gumoss (Special)", "unexpected Pal missing from the verified source snapshot");
    return { ...existing, isNewIn1_0: Boolean(newType), newType, price: existing.price ?? null, partnerSkill: { ...existing.partnerSkill, iconId: null, iconFile: icon.displayIconFile.split("/").at(-1) } };
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
    partnerSkill: { name: record.partnerSkill === "—" ? null : record.partnerSkill, description: null, iconId: record.partnerSkillIconId ?? null, iconFile: icon.displayIconFile.split("/").at(-1) },
    isNewIn1_0: Boolean(newType),
    newType,
  };
});

assert.equal(imported, 299, "expected every sourced record to import");
assert.equal(normalized.filter((pal) => pal.isNewIn1_0).length, 72, "expected 72 Palworld 1.0 additions");
assert.equal(normalized.filter((pal) => pal.newType === "new-pal").length, 47, "expected 47 new Pals");
assert.equal(normalized.filter((pal) => pal.newType === "new-variant").length, 25, "expected 25 new variants");
await writeFile(dataUrl, `${JSON.stringify(normalized, null, 2)}\n`);
console.log(`Imported 299 version-pinned PalDB records; preserved all identities, the existing Gumoss (Special) record, work suitability, and breeding power.`);
