import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("homepage targets Palworld breeding calculator with one focused H1", async () => {
  const page = await read("../app/page.tsx");
  const layout = await read("../app/layout.tsx");
  const gameData = await read("../app/lib/game-data.ts");
  const title = page.match(/title: "([^"]+)"/)?.[1] ?? "";
  const description = page.match(/description: "([^"]+)"/)?.[1] ?? "";
  assert.match(page, /<h1[^>]*>Palworld Breeding Calculator<\/h1>/);
  assert.equal((page.match(/<h1/g) ?? []).length, 1);
  assert.ok(title.length >= 50 && title.length <= 60, `homepage title should be 50-60 characters, got ${title.length}`);
  assert.ok(description.length >= 150 && description.length <= 160, `homepage description should be 150-160 characters, got ${description.length}`);
  assert.match(page, /keywords: \["palworld breeding calculator"\]/);
  assert.match(page, /title: "Palworld Breeding Calculator - Updated 1\.0 Pal Combos"/);
  assert.match(page, /How the Pal Breeding Tool Works/);
  assert.match(page, /Palworld Breeding Calculator FAQ/);
  assert.match(page, /"@type": "WebApplication"/);
  assert.match(gameData, /\/breeding-calculator/);
  assert.match(gameData, /\/paldex/);
  assert.match(gameData, /\/palworld-1-0/);
  assert.match(page, /GlobalSearch/);
  assert.match(page, /HomeToolBoard/);
  assert.match(page, /home-scene-hero/);
  assert.match(page, /Updated for Palworld 1\.0/);
  assert.match(page, /Popular Pals/);
  assert.match(layout, /Palworld Breeding Calculator - Updated 1\.0 Pal Combos/);
  assert.match(layout, /\/favicon\.ico/);
  assert.match(layout, /\/icon-192\.png/);
  assert.match(layout, /\/apple-touch-icon\.png/);
  assert.match(layout, /\/site\.webmanifest/);
  assert.doesNotMatch(page, /Coming Soon|href="\/map"/);
  assert.doesNotMatch(page, /Polworld|POLWORLD/);
});

test("each indexable page targets one distinct primary keyword", async () => {
  const files = [
    ["../app/page.tsx", "palworld breeding calculator"],
    ["../app/palworld-1-0/page.tsx", "palworld 1.0"],
    ["../app/breeding-calculator/page.tsx", "palworld breeding combinations"],
    ["../app/paldex/page.tsx", "palworld paldeck"],
    ["../app/tools/page.tsx", "palworld tools"],
    ["../app/guides/page.tsx", "palworld guides"],
    ["../app/updates/page.tsx", "palworld 1.0 patch notes"],
  ];
  const keywords = [];
  for (const [path, keyword] of files) {
    const source = await read(path);
    assert.ok(source.includes(`keywords: ["${keyword}"]`), `${path} should target only ${keyword}`);
    keywords.push(keyword);
  }
  assert.equal(new Set(keywords).size, keywords.length);
  const guides = await read("../app/guides/[slug]/page.tsx");
  const pals = await read("../app/pals/[slug]/page.tsx");
  assert.match(guides, /keywords: \[guide\.title\.toLowerCase\(\)\]/);
  assert.match(pals, /keywords: \[`\$\{pal\.name\.toLowerCase\(\)\} palworld`\]/);
});

test("homepage calculator lazily loads current breeding data and handles errors", async () => {
  const board = await read("../app/components/home-tool-board.tsx");
  assert.match(board, /Choose quick breeding parent A/);
  assert.match(board, /Pictured Pal selection/);
  assert.match(board, /PalMark pal={parentAPal}/);
  assert.match(board, /if \(slot !== "lookup"\) loadMatrix\(\)/);
  assert.match(board, /fetch\("\/data\/breeding\.json"\)/);
  assert.match(board, /Data unavailable — try again/);
  assert.match(board, />Retry</);
});

test("homepage can reverse-search parent combinations for a target Pal", async () => {
  const page = await read("../app/page.tsx");
  const targetSearch = await read("../app/components/home-target-breeding.tsx");
  assert.match(page, /HomeTargetBreeding/);
  assert.match(targetSearch, /Target → Parents/);
  assert.match(targetSearch, /Find Parent Combinations for Any Pal/);
  assert.match(targetSearch, /fetch\("\/data\/breeding\.json"\)/);
  assert.match(targetSearch, /matrix\[first\.id\]\?\.\[second\.id\] !== target\.id/);
  assert.match(targetSearch, /HOME_PAIR_LIMIT = 12/);
  assert.match(targetSearch, /PalMark pal={first}/);
  assert.match(targetSearch, /PalMark pal={second}/);
  assert.match(targetSearch, /Breeding data is unavailable/);
  assert.match(targetSearch, />Retry</);
});

test("every current Pal entry has a local image used by the shared Pal component", async () => {
  const pals = JSON.parse(await read("../public/data/pals.json"));
  const images = await readdir(new URL("../public/pals/", import.meta.url));
  const mark = await read("../app/components/pal-mark.tsx");
  assert.equal(images.filter((file) => file.endsWith(".png")).length, pals.length);
  for (const pal of pals) assert.ok(images.includes(`${pal.id}.png`), `missing image for ${pal.name}`);
  assert.match(mark, /src={`\/pals\/\$\{pal\.id\}\.png`}/);
  assert.match(mark, /pal-mark-image/);
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
  assert.match(page, /Palworld Breeding Combinations/);
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
