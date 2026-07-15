import assert from "node:assert/strict";
import test from "node:test";
import pals from "../public/data/pals.json" with { type: "json" };
import { average, duplicateIds, elementCoverage, emptyTeam, normalizeTeam, parseTeamParam, serializeTeam, workCoverage } from "../app/team-builder/core.ts";

const validIds = new Set(pals.map((pal) => pal.id));
const pal = (name) => pals.find((item) => item.name === name);

test("team URL state preserves five ordered slots and rejects unknown ids", () => {
  const parsed = parseTeamParam("1.0,,2.0,bad-id,3.0", validIds);
  assert.deepEqual(parsed, ["1.0", null, "2.0", null, "3.0"]);
  assert.equal(serializeTeam(parsed), "1.0,,2.0,,3.0");
  assert.deepEqual(normalizeTeam("not-an-array", validIds), emptyTeam());
});

test("duplicate species are reported without altering the selected slots", () => {
  const team = ["1.0", "2.0", "1.0", null, null];
  assert.deepEqual([...duplicateIds(team)], ["1.0"]);
  assert.deepEqual(team, ["1.0", "2.0", "1.0", null, null]);
});

test("team summaries report element counts, strongest work levels, and safe averages", () => {
  const team = [pal("Lamball"), pal("Cattiva"), pal("Anubis")];
  assert.ok(elementCoverage(team).some((entry) => entry.element === "Neutral" && entry.count === 2));
  const handiwork = workCoverage(team).find((entry) => entry.work === "handcraft");
  assert.equal(handiwork.level, 6);
  assert.equal(handiwork.members, 3);
  assert.equal(average([70, null, 80]), 75);
  assert.equal(average([null, null]), null);
});
