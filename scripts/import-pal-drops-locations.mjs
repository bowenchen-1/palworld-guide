import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";

const csvPath = process.argv[2] || "/Users/chen/Desktop/幻兽帕鲁_掉落物与捕获地点_v1.0.csv";
const csv = await readFile(csvPath, "utf8");
const pals = JSON.parse(await readFile(new URL("../public/data/pals.json", import.meta.url), "utf8"));
const namesSource = await readFile(new URL("../app/lib/pal-names-zh.ts", import.meta.url), "utf8");
const namesMatch = namesSource.match(/palNamesZh: Record<string, string> = (\{.*?\});/s);
assert.ok(namesMatch, "could not read the existing Chinese Pal name map");
const namesZh = JSON.parse(namesMatch[1]);
const chineseToEnglish = new Map(Object.entries(namesZh).map(([name, chinese]) => [chinese, name]));

const itemNames = {
  "严冬鹿的鹿肉": "Reindrix Venison", "皮革": "Leather", "角": "Horn", "结冰器官": "Ice Organ", "冰之辉石": "Ice Paldium Fragment",
  "腐朽的古代文明遗物": "Ancient Civilization Ruins", "沉眠的古代文明遗物": "Ancient Civilization Core", "漂亮的古代文明遗物": "Beautiful Flower", "发光的古代文明遗物": "Luminous Ancient Civilization Ruins", "闪耀的古代文明遗物": "Splendid Ancient Civilization Ruins",
  "金属矿石": "Metal Ore", "喷火器官": "Flame Organ", "世界树圣水": "World Tree Holy Water", "火之辉石": "Fire Paldium Fragment", "无之辉石": "Neutral Paldium Fragment", "水栖帕鲁的黏液": "Pal Fluid",
  "企丸王的羽饰": "Penking Plume", "雷之辉石": "Electric Paldium Fragment", "水之辉石": "Water Paldium Fragment", "发电器官": "Electric Organ", "优质帕鲁油": "High Quality Pal Oil", "红宝石": "Ruby", "龙之辉石": "Dragon Paldium Fragment",
  "神圣锭": "Refined Ingot", "小型帕鲁之魂": "Small Pal Soul", "骨头": "Bone", "毒腺": "Venom Gland", "中型帕鲁之魂": "Medium Pal Soul", "暗之辉石": "Dark Paldium Fragment", "蓝宝石": "Sapphire", "羊毛": "Wool", "纤维": "Fiber", "六棱晶矿": "Hexolite Ore", "绿宝石": "Emerald", "大型帕鲁之魂": "Large Pal Soul", "珊瑚矿石": "Coral Ore", "勾魂鱿的触手": "Killamari Tentacle", "蘑菇": "Mushroom", "蛋糕": "Cake", "可疑果汁": "Suspicious Juice", "怪异果汁": "Strange Juice", "消除记忆药": "Memory Wiping Medicine", "美丽花朵": "Beautiful Flower", "地之辉石": "Ground Paldium Fragment", "焦糖棉花糖": "Caramel Marshmallow", "野莓种子": "Red Berries Seeds", "叶泥泥的叶子": "Gumoss Leaf", "硬木材": "High Quality Wood", "胡萝卜种子": "Carrot Seeds", "草之辉石": "Grass Paldium Fragment", "小麦种子": "Wheat Seeds", "布": "Cloth", "不可思议的蘑菇": "Strange Mushroom", "洋葱种子": "Onion Seeds", "钻石": "Diamond", "高等技术书": "High Grade Technical Manual", "金币": "Gold Coin", "原油": "Crude Oil", "六棱晶锭": "Hexolite", "铬铁矿": "Chromite", "墨沫姬的章鱼足": "Gloopie Tentacle", "暗黑碎片": "Dark Fragment", "高品质恢复药": "High Grade Medical Supplies", "究极帕鲁之魂": "Ultimate Pal Soul", "古代文明核心": "Ancient Civilization Core", "天擒鸟的鸟肉": "Galeclaw Poultry", "雷鸣童子的云朵": "Dazzi Cloud", "蜂蜜": "Honey", "女皇蜂之杖": "Elizabee Staff", "姬小兔的发带": "Ribbuny Ribbon", "烈阳金属": "Sunscreen Metal", "纯水晶": "Pure Quartz", "土豆种薯": "Potato Seeds", "箭": "Arrow", "生菜种子": "Lettuce Seeds", "番茄种子": "Tomato Seeds", "塑钢": "Plasteel", "碳纤维": "Carbon Fiber", "革新技术书": "Innovative Technical Manual", "红色野莓": "Red Berries", "夜星砂": "Nightstar Sand", "汪汪币": "Dog Coins", "修炼之书": "Training Manual", "暗巫猫的体毛": "Katress Hair", "铜钥匙": "Copper Key", "银钥匙": "Silver Key", "朋克蜥的头冠": "Leezpunk Hood", "陨石碎片": "Meteorite Fragment", "低品质药品": "Low Grade Medical Supplies", "趴趴鲶的鱼肉": "Dumud Fish Meat", "棉悠悠的羊肉": "Lamball Mutton", "棉花糖": "Cotton Candy", "森猛犸的巨兽肉": "Mammorest Meat", "石炭": "Coal", "毛掸儿的棉毛": "Swee Hair", "水灵儿的鱼肉": "Kelpsea Fish Meat", "波霸牛的牛肉": "Mozzarina Meat", "牛奶": "Milk", "金属锭": "Ingot", "海月仙的水母伞": "Jelliette Umbrella", "海月灵的水母伞": "Jellroy Umbrella", "连理龙的恐龙肉": "Broncherry Meat", "灌木羊的香草肉": "Caprity Meat", "火药": "Gunpowder", "炸蛋鸟的羽毛": "Tocotoco Feather", "鞘刀鱼排": "Skutlass Fillet", "蛋": "Egg", "皮皮鸡的鸡肉": "Chikipi Poultry", "硫磺": "Sulfur", "超高热核心": "High-Temperature Core", "紫霞鹿的鹿肉": "Eikthyrdeer Venison", "帕鲁矿碎块": "Paldium Fragment", "优质的布": "High Quality Cloth", "肚肚鳄的鳄鱼肉": "Munchill Meat", "胡萝卜": "Carrot", "草莽猪的猪肉": "Rushoar Pork",
};

const locationNames = {
  "袭击": "Raid", "灵峰洞窟": "Lingfeng Cave", "火山洞窟": "Volcanic Cave", "丘陵洞窟离岛洞窟": "Hill Cave / Isolated Island Cave", "丘陵洞窟溪谷洞窟": "Hill Cave / Valley Cave", "丘陵洞窟": "Hill Cave", "天坠洞窟": "Fallen Sky Cave", "樱花洞窟": "Sakura Cave", "沙丘洞窟": "Dune Cave", "溪流洞窟": "Stream Cave", "溪谷洞窟": "Valley Cave", "腐蚀雾的源头": "Source of Corrosive Fog", "燐光孢子的源头": "Source of Luminous Spores", "天阳乡空域": "Tianyang Village Airspace", "垂钓池": "Fishing Pool", "大型垂钓池": "Large Fishing Pool", "帕鲁中介": "Pal Broker", "无野外出现地点（通常为繁育、地牢、首领或特殊获取）": "No wild spawn location (usually breeding, dungeons, bosses, or special acquisition)", "？？？": "Unknown", "幽玄魔女 贝菈露洁": "Witch Bellanoir", "幽玄魔女【极】 贝菈露洁": "Witch Bellanoir (Extreme)", "救赎之王 默世鹿": "King of Redemption Hartalis", "救赎之王【极】 默世鹿": "King of Redemption Hartalis (Extreme)", "来自宇宙的侵略者 杰诺多兰": "Alien Invader Xenolord", "来自宇宙的侵略者【极】 杰诺多兰": "Alien Invader Xenolord (Extreme)", "永炎现世 殁殃": "Eternal Flame Blazamut Ryu", "永炎現世【极】 殁殃": "Eternal Flame Blazamut Ryu (Extreme)", "狂乱淑女 贝菈诺娃": "Madame Bellanoir",
};

function parseCsvLine(line) {
  const values = [];
  let value = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"' && line[i + 1] === '"' && quoted) { value += '"'; i += 1; continue; }
    if (char === '"') { quoted = !quoted; continue; }
    if (char === "," && !quoted) { values.push(value); value = ""; continue; }
    value += char;
  }
  values.push(value);
  return values;
}

function parseCsvFile(text) {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter(Boolean);
  const headers = parseCsvLine(lines.shift());
  return lines.map((line) => Object.fromEntries(parseCsvLine(line).map((value, index) => [headers[index], value])));
}

function parsePalName(value) {
  return value.replace(/\s+-\s+.*?属性帕鲁图鉴$/, "").trim();
}

function parseDrop(value) {
  const match = value.match(/^(.*?)[（(](.*)[）)]$/);
  if (!match) return { name: itemNames[value] || value, sourceName: value };
  const [, sourceName, details] = match;
  const parts = details.split(/[，,]/).map((part) => part.trim()).filter(Boolean);
  const quantity = parts.shift() || undefined;
  const rest = parts.join(" · ");
  const chanceMatch = rest.match(/(\d+(?:\.\d+)?)%/);
  const chance = chanceMatch ? `${chanceMatch[1]}%` : undefined;
  const condition = rest.replace(/\s*\d+(?:\.\d+)?%\s*/, "").trim() || undefined;
  return { name: itemNames[sourceName] || sourceName, quantity, chance, condition, sourceName };
}

function translateLocation(value) {
  const levelMatch = value.match(/\s*Lv\.\s*(\d+)\s*-\s*(\d+)\s*$/);
  const noLevelMatch = value.match(/\s*Lv\.\s*-\s*$/);
  const withoutLevel = (levelMatch ? value.slice(0, levelMatch.index) : noLevelMatch ? value.slice(0, noLevelMatch.index) : value).trim();
  const level = levelMatch ? `${levelMatch[1]}–${levelMatch[2]}` : noLevelMatch ? "—" : undefined;
  let name = withoutLevel;
  let note;
  const percentMatch = withoutLevel.match(/^(.*?)(\d+(?:\.\d+)?%)$/);
  if (percentMatch) { name = percentMatch[1].trim(); note = `Listed chance: ${percentMatch[2]}`; }
  const brokerMatch = name.match(/^帕鲁中介\s+(.+)$/);
  if (brokerMatch) { name = `Pal Broker · ${brokerMatch[1]}`; }
  const mapKey = name.replace(/^(垂钓池|大型垂钓池)(Small|Medium|Big)$/, "$1");
  name = locationNames[mapKey] || locationNames[name] || name;
  if (mapKey === "垂钓池") name += ` (${withoutLevel.includes("Small") ? "Small" : withoutLevel.includes("Medium") ? "Medium" : "Large"})`;
  if (name.startsWith("袭击")) name = name.replace(/^袭击/, "Raid");
  if (name.startsWith("Raid ")) note = note || "Raid encounter";
  return { name, level, note, sourceName: value };
}

const rows = parseCsvFile(csv);
assert.equal(rows.length, 299, `expected 299 CSV rows, received ${rows.length}`);
const duplicateNames = rows.map((row) => row["名称"]).filter((name, index, all) => all.indexOf(name) !== index);
assert.deepEqual(duplicateNames, [], "duplicate CSV Pal names");
const byName = new Map(pals.filter((pal) => pal.id !== "12.1").map((pal) => [pal.name.replace(/ /g, "_"), pal]));
const records = [];
const unmatched = [];
const used = new Set();
for (const row of rows) {
  const sourceName = row["名称"];
  const chineseName = parsePalName(sourceName);
  const englishName = chineseToEnglish.get(chineseName);
  const pal = englishName ? byName.get(englishName) : undefined;
  if (!pal || used.has(pal.id)) { unmatched.push({ sourceName, chineseName, englishName: englishName || null }); continue; }
  used.add(pal.id);
  records.push({
    palSlug: pal.slug,
    drops: row["掉落物（数量/概率）"].split("；").filter(Boolean).map(parseDrop),
    locations: row["容易捕获地点（低等级优先）"].split("；").filter(Boolean).map(translateLocation),
  });
}
assert.deepEqual(unmatched, [], `unmatched or duplicate records: ${JSON.stringify(unmatched)}`);
assert.equal(records.length, 299);
assert.equal(new Set(records.map((record) => record.palSlug)).size, 299, "duplicate output slugs");
assert.equal(records.filter((record) => !record.drops.length || !record.locations.length).length, 0, "empty drops or locations");
const unknownItems = [...new Set(rows.flatMap((row) => row["掉落物（数量/概率）"].split("；").map((value) => value.replace(/（.*$/, "")).filter((name) => !itemNames[name])))];
assert.deepEqual(unknownItems, [], `untranslated item names: ${unknownItems.join(", ")}`);
await writeFile(new URL("../public/data/pal-drops-locations.json", import.meta.url), `${JSON.stringify(records, null, 2)}\n`);
console.log(`Imported ${records.length} Pal drops/location records from ${csvPath}. Matched every visible catalog slug with no duplicates.`);
