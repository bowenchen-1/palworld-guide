import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import palRecords from "../public/data/pals.json" with { type: "json" };
import { palNamesZh } from "../app/lib/pal-names-zh.ts";

const summaryPath = process.argv[2];
const skillsPath = process.argv[3];
const outputPath = process.argv[4] || new URL("../public/data/pal-active-skills.json", import.meta.url);
if (!summaryPath || !skillsPath) throw new Error("Usage: node --experimental-strip-types scripts/import-pal-active-skills.mjs <summary.csv> <skills.csv> [output.json]");

function parseCsvLine(line) {
  const cells = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"' && line[index + 1] === '"' && quoted) {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      cells.push(cell);
      cell = "";
    } else {
      cell += char;
    }
  }
  cells.push(cell);
  return cells;
}

function parseCsv(text) {
  const lines = text.replace(/^\uFEFF/, "").trim().split(/\r?\n/);
  const headers = parseCsvLine(lines.shift());
  return lines.map((line) => Object.fromEntries(parseCsvLine(line).map((value, index) => [headers[index], value])));
}

function englishSkillName(url) {
  const slug = url.split("/").at(-1) ?? "";
  return decodeURIComponent(slug).replaceAll("_", " ");
}

const summaryRows = parseCsv(await readFile(summaryPath, "utf8"));
const skillRows = parseCsv(await readFile(skillsPath, "utf8"));
const palByNameZh = new Map(Object.entries(palNamesZh).map(([name, nameZh]) => [nameZh, name]));
const currentByNormalizedName = new Map(palRecords.map((pal) => [pal.name.replaceAll(" ", "_"), pal]));
const grouped = new Map();

for (const row of summaryRows) {
  const englishName = palByNameZh.get(row["帕鲁"]);
  const pal = englishName ? currentByNormalizedName.get(englishName) : null;
  assert.ok(englishName && pal, `missing English Pal mapping for ${row["帕鲁"]}`);
  const palUrl = row["帕鲁详情页"];
  grouped.set(pal.name, { palSlug: pal.slug, name: pal.name, nameZh: row["帕鲁"], sourceUrl: palUrl, skills: [] });
}

for (const row of skillRows) {
  const englishName = palByNameZh.get(row["帕鲁"]);
  const pal = englishName ? currentByNormalizedName.get(englishName) : null;
  assert.ok(pal && grouped.has(pal.name), `skill row has no Pal summary: ${row["帕鲁"]}`);
  grouped.get(pal.name).skills.push({
    name: englishSkillName(row["技能详情页"]),
    nameZh: row["技能名称"],
    type: row["属性/类型"],
    level: row["等级"],
    power: Number(row["威力"]),
    cooldown: row["冷却时间"],
    descriptionZh: row["技能说明"],
    sourceUrl: row["技能详情页"],
  });
}

assert.equal(grouped.size, summaryRows.length, "summary rows must map one-to-one to Pals");
assert.equal(skillRows.length, 2380, "unexpected active skill row count");
await writeFile(outputPath, `${JSON.stringify([...grouped.values()], null, 2)}\n`);
console.log(`Imported ${grouped.size} Pals and ${skillRows.length} active skill records.`);
