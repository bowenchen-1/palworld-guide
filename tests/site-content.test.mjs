import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("homepage keeps the English Palworld brand and all guide links", async () => {
  const page = await read("../app/page.tsx");
  assert.match(page, /PALWORLD/);
  assert.match(page, /Every Answer\./);
  assert.match(page, /Popular Guides/);
  assert.match(page, /What is Palworld Field Guide\?/);
  assert.match(page, /\/guides\/\$\{guide\.slug\}/);
  assert.doesNotMatch(page, /Polworld|POLWORLD/);
});

test("guide library contains 24 complete English guides in six categories", async () => {
  const data = await read("../app/guides/guide-data.ts");
  const article = await read("../app/guides/[slug]/page.tsx");
  assert.equal((data.match(/slug: "/g) ?? []).length, 24);
  assert.equal((data.match(/id: "(getting-started|pals-breeding|base-building|resources-crafting|exploration|combat)"/g) ?? []).length, 6);
  assert.match(data, /Your First 7 Days in Palworld/);
  assert.match(data, /Best Early-Game Pals/);
  assert.match(data, /Prepare for Your First Tower Boss/);
  assert.match(data, /Advanced Combat Habits for the Mid-Game/);
  assert.match(article, /The short version/);
  assert.match(article, /Related guides/);
});

test("every guide is researched from non-official creator videos", async () => {
  const data = await read("../app/guides/guide-data.ts");
  const article = await read("../app/guides/[slug]/page.tsx");

  assert.equal((data.match(/videoResearch: \[/g) ?? []).length + (data.match(/videos: \[/g) ?? []).length, 24);
  assert.ok((data.match(/https:\/\/www\.youtube\.com\/watch\?v=/g) ?? []).length >= 6);
  assert.match(data, /RageGamingVideos/);
  assert.match(data, /Chaos Bear Gaming/);
  assert.match(data, /KhrazeGaming/);
  assert.doesNotMatch(data, /steamcommunity\.com|palworld\.wiki\.gg|Official Palworld/);

  assert.match(article, /Video research/);
  assert.match(article, /Watch on YouTube/);
  assert.doesNotMatch(article, /primary or community reference material/);
});

test("homepage explains the player-video research policy", async () => {
  const page = await read("../app/page.tsx");
  assert.match(page, /How are these guides researched\?/);
  assert.match(page, /creator videos/);
});

test("homepage exposes interactive tools and category navigation", async () => {
  const page = await read("../app/page.tsx");
  const tools = await read("../app/components/tool-lab.tsx");
  assert.match(page, /Interactive Tools/);
  assert.match(page, /Browse by Category/);
  assert.match(page, /category-jump-grid/);
  assert.match(tools, /Trip Yield Planner/);
  assert.match(tools, /Batch Time Planner/);
  assert.match(tools, /Worker Slot Planner/);
  assert.ok((tools.match(/type="number"/g) ?? []).length >= 1);
});

test("sitemap and robots expose the production domain and every guide", async () => {
  const sitemap = await read("../app/sitemap.ts");
  const robots = await read("../app/robots.ts");
  const config = await read("../app/site-config.ts");
  assert.match(config, /https:\/\/www\.palworldguide\.net/);
  assert.match(sitemap, /guides\.map/);
  assert.match(sitemap, /priority: 1/);
  assert.match(robots, /sitemap\.xml/);
  assert.match(robots, /allow: "\/"/);
});
