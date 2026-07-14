import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("homepage is a tool-first Palworld hub with one focused H1", async () => {
  const page = await read("../app/page.tsx");
  const layout = await read("../app/layout.tsx");
  const gameData = await read("../app/lib/game-data.ts");
  assert.match(page, /<h1[^>]*>Palworld Tools,[\s\S]*Calculators & Database\./);
  assert.equal((page.match(/<h1/g) ?? []).length, 1);
  assert.match(gameData, /\/breeding-calculator/);
  assert.match(gameData, /\/paldex/);
  assert.match(gameData, /\/palworld-1-0/);
  assert.match(page, /GlobalSearch/);
  assert.match(page, /HomeToolBoard/);
  assert.match(page, /Popular Pals/);
  assert.match(layout, /Palworld Tools, Calculators & Database/);
  assert.doesNotMatch(page, /Coming Soon|href="\/map"/);
  assert.doesNotMatch(page, /Polworld|POLWORLD/);
});

test("homepage calculator lazily loads current breeding data and handles errors", async () => {
  const board = await read("../app/components/home-tool-board.tsx");
  assert.match(board, /onFocus={loadMatrix}/);
  assert.match(board, /fetch\("\/data\/breeding\.json"\)/);
  assert.match(board, /Data unavailable — try again/);
  assert.match(board, />Retry</);
});

test("guide library contains 24 complete English guides in six categories", async () => {
  const data = await read("../app/guides/guide-data.ts");
  const article = await read("../app/guides/[slug]/page.tsx");
  const index = await read("../app/guides/page.tsx");
  assert.equal((data.match(/slug: "/g) ?? []).length, 24);
  assert.equal((data.match(/id: "(getting-started|pals-breeding|base-building|resources-crafting|exploration|combat)"/g) ?? []).length, 6);
  assert.match(data, /Your First 7 Days in Palworld/);
  assert.match(article, /Video research/);
  assert.match(index, /Palworld Guides/);
  assert.match(index, /guideCategories\.map/);
  assert.ok((data.match(/https:\/\/www\.youtube\.com\/watch\?v=/g) ?? []).length >= 6);
  assert.doesNotMatch(data, /steamcommunity\.com|palworld\.wiki\.gg|Official Palworld/);
});

test("current 1.0 dataset contains 289 Pals and Sekhmet", async () => {
  const pals = JSON.parse(await read("../public/data/pals.json"));
  const version = JSON.parse(await read("../public/data/data-version.json"));
  const matrix = JSON.parse(await read("../public/data/breeding.json"));
  assert.equal(pals.length, 300);
  assert.equal(pals.filter((pal) => pal.kind === "pal").length, 289);
  assert.equal(version.gameVersion, "1.0");
  assert.equal(pals.find((pal) => pal.name === "Sekhmet")?.number, "140");
  assert.equal(Object.keys(matrix).length, 300);
});

test("breeding calculator supports forward and reverse searches", async () => {
  const page = await read("../app/breeding-calculator/page.tsx");
  const client = await read("../app/breeding-calculator/breeding-client.tsx");
  assert.equal((page.match(/<h1/g) ?? []).length, 1);
  assert.match(page, /Palworld Breeding Calculator/);
  assert.match(page, /WebApplication/);
  assert.match(client, /Parents → Child/);
  assert.match(client, /Target → Parents/);
  assert.match(client, /matrix\[first\.id\]\?\.\[second\.id\]/);
});

test("Paldeck has current filters and indexable profile pages", async () => {
  const page = await read("../app/paldex/page.tsx");
  const client = await read("../app/paldex/paldex-client.tsx");
  const profile = await read("../app/pals/[slug]/page.tsx");
  assert.equal((page.match(/<h1/g) ?? []).length, 1);
  assert.match(page, /Palworld Paldeck Database/);
  assert.match(client, /Work Suitability/);
  assert.match(client, /Minimum Work Level/);
  assert.match(client, /Highest work level/);
  assert.match(client, /paldex-view-toggle/);
  assert.match(client, /Reset filters/);
  assert.match(client, /Breeding power/);
  assert.match(profile, /generateStaticParams/);
  assert.match(profile, /Palworld Guide/);
  assert.match(profile, /Primary work role/);
  assert.match(profile, /Plan with/);
  assert.match(profile, /\/guides\/work-suitability-basics/);
  assert.match(profile, /does not describe combat strength, rarity, or catch difficulty/);
});

test("1.0 hub answers release-date intent above the fold", async () => {
  const page = await read("../app/palworld-1-0/page.tsx");
  assert.equal((page.match(/<h1/g) ?? []).length, 1);
  assert.match(page, /Palworld 1\.0 was released on July 10, 2026/);
  assert.match(page, /Palworld 1\.0 release date/);
  assert.match(page, /FAQPage/);
});

test("sitemap exposes tools, guides, and every Pal profile", async () => {
  const sitemap = await read("../app/sitemap.ts");
  const robots = await read("../app/robots.ts");
  assert.match(sitemap, /breeding-calculator/);
  assert.match(sitemap, /palworld-1-0/);
  assert.match(sitemap, /\$\{siteUrl\}\/tools/);
  assert.match(sitemap, /\$\{siteUrl\}\/guides/);
  assert.match(sitemap, /\$\{siteUrl\}\/updates/);
  assert.match(sitemap, /pals\.map/);
  assert.match(sitemap, /priority: 1/);
  assert.match(robots, /sitemap\.xml/);
  assert.match(robots, /allow: "\/"/);
});
