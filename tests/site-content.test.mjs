import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("homepage keeps the English Palworld brand and all guide links", async () => {
  const page = await read("../app/page.tsx");
  assert.match(page, /PALWORLD/);
  assert.match(page, /Explore More\./);
  assert.match(page, /Latest Guides/);
  assert.match(page, /What is Palworld Guide\?/);
  assert.match(page, /\/guides\/\$\{guide\.slug\}/);
  assert.doesNotMatch(page, /Polworld|POLWORLD/);
});

test("guide library contains six complete English guides", async () => {
  const data = await read("../app/guides/guide-data.ts");
  const article = await read("../app/guides/[slug]/page.tsx");
  assert.equal((data.match(/slug: "/g) ?? []).length, 6);
  assert.match(data, /Your First 7 Days in Palworld/);
  assert.match(data, /Best Early-Game Pals/);
  assert.match(data, /Prepare for Your First Tower Boss/);
  assert.match(article, /The short version/);
  assert.match(article, /Related guides/);
});
