import assert from "node:assert/strict";
import test from "node:test";
import pals from "../public/data/pals.json" with { type: "json" };
import matrix from "../public/data/breeding.json" with { type: "json" };
import { availableOffspring, comparePals, findOffspring, findParentPairs, findRoutes, pairResults } from "../app/breeding-calculator/breeding/core.ts";

const byId = new Map(pals.map((pal) => [pal.id, pal]));
const pal = (name) => pals.find((item) => item.name === name);

test("normal pairs merge their symmetric result, while Wixen and Katress retain both gender rules", () => {
  const lamball = pal("Lamball"), cattiva = pal("Cattiva");
  assert.equal(pairResults(matrix, byId, lamball, cattiva).length, 1);
  const wixenKatress = pairResults(matrix, byId, pal("Wixen"), pal("Katress"));
  assert.equal(wixenKatress.length, 2);
  assert.deepEqual(wixenKatress.map((result) => [result.child.name, result.genders]), [["Wixen Noct", ["female", "male"]], ["Katress Ignis", ["female", "male"]]]);
});

test("reverse parent and offspring lookups include directional cells and self-pairs", () => {
  const wixen = pal("Wixen"), katress = pal("Katress");
  assert.ok(findParentPairs(matrix, byId, pal("Wixen Noct")).some((result) => result.first.id === wixen.id && result.second.id === katress.id));
  assert.deepEqual(findOffspring(matrix, byId, wixen).filter((result) => result.first.id === wixen.id || result.second.id === wixen.id).filter((result) => result.first.id === katress.id || result.second.id === katress.id).map((result) => result.child.name).sort(), ["Katress Ignis", "Wixen Noct"]);
  assert.equal(pairResults(matrix, byId, wixen, wixen)[0].requiresTwo, true);
});

test("available results preserve self-pair requirements and Paldeck suffix ordering", () => {
  const results = availableOffspring(matrix, byId, [pal("Wixen").id, pal("Katress").id]);
  assert.ok(results.find((result) => result.child.name === "Wixen Noct"));
  assert.ok(results.find((result) => result.child.name === "Katress Ignis"));
  assert.ok(comparePals({ number: "001.1", name: "B" }, { number: "002", name: "A" }) < 0);
});

test("route search is bounded, cycle-safe, honors exclusions, and returns at most three shortest alternatives", () => {
  const wixen = pal("Wixen"), katress = pal("Katress"), target = pal("Wixen Noct");
  const routes = findRoutes(matrix, byId, [wixen], target, [katress], 1);
  assert.equal(routes[0].generations, 1);
  assert.ok(routes.length <= 3);
  assert.equal(findRoutes(matrix, byId, [wixen], target, [katress], 0).length, 0);
  assert.equal(findRoutes(matrix, byId, [wixen], target, [katress], 1, new Set([katress.id])).length, 0);
  assert.deepEqual(findRoutes(matrix, byId, [target], target, [katress], 3)[0], { steps: [], generations: 0 });
});
