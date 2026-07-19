import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";

const sourceUrl = new URL("../data/sources/partner-skills-accuracy-v1.0.md", import.meta.url);
const dataUrl = new URL("../public/data/pals.json", import.meta.url);
const sourceText = await readFile(sourceUrl, "utf8");
const pals = JSON.parse(await readFile(dataUrl, "utf8"));

const normalizeIdentity = (value) => value.toLowerCase().replace(/[()_\s-]+/g, "");
const rows = sourceText.split(/\r?\n/)
  .filter((line) => line.startsWith("| ") && !line.startsWith("|---") && !line.includes("帕鲁标识"))
  .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()));

assert.equal(rows.length, 298, "partner-skill source must contain 298 verified rows");
const sourceByIdentity = new Map();
for (const cells of rows) {
  assert.ok(cells.length >= 7, `invalid partner-skill row: ${cells[0] ?? "unknown"}`);
  const [identity, , , , paldbDescription] = cells;
  const key = normalizeIdentity(identity);
  assert.ok(!sourceByIdentity.has(key), `duplicate partner-skill source row: ${identity}`);
  sourceByIdentity.set(key, {
    identity,
    description: paldbDescription
      .replace(/\s+/g, " ")
      .replace(/\s+Technology\s+\d+\s*$/, "")
      .replace(/\s+([,.;:!?])/g, "$1")
      .replace(/\(\s+/g, "(")
      .replace(/\s+\)/g, ")")
      .trim(),
  });
}

const unmatchedSource = [...sourceByIdentity.values()].filter(({ identity }) =>
  !pals.some((pal) => normalizeIdentity(pal.id) === normalizeIdentity(identity) || normalizeIdentity(pal.name) === normalizeIdentity(identity)),
);
assert.deepEqual(unmatchedSource, [], `unmatched source rows: ${unmatchedSource.map(({ identity }) => identity).join(", ")}`);

let imported = 0;
const normalized = pals.map((pal) => {
  const source = sourceByIdentity.get(normalizeIdentity(pal.id)) ?? sourceByIdentity.get(normalizeIdentity(pal.name));
  if (!source) return pal;
  imported += 1;
  return {
    ...pal,
    partnerSkill: {
      ...pal.partnerSkill,
      description: source.description === "—" ? null : source.description,
    },
  };
});

assert.equal(imported, 298, "expected 298 source rows to match the Pal database");
assert.equal(normalized.filter((pal) => pal.partnerSkill.description).length, 298, "expected 298 partner-skill descriptions");
await writeFile(dataUrl, `${JSON.stringify(normalized, null, 2)}\n`);
console.log(`Imported ${imported} verified Partner Skill descriptions; preserved unmatched special records without guessing.`);
