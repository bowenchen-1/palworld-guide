import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("homepage targets Palworld breeding calculator with one focused H1", async () => {
  const page = await read("../app/page.tsx");
  const layout = await read("../app/layout.tsx");
  const terminalTheme = await read("../app/terminal-theme.css");
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
  assert.match(page, /Plan a Reliable Breeding Route/);
  assert.match(page, /"@type": "WebApplication"/);
  assert.match(gameData, /\/breeding-calculator/);
  assert.match(gameData, /\/paldex/);
  assert.match(gameData, /\/palworld-1-0/);
  assert.match(page, /GlobalSearch/);
  assert.match(page, /HomeToolBoard/);
  assert.match(page, /home-scene-hero/);
  assert.match(page, /Updated for Palworld 1\.0/);
  assert.match(page, /home-terminal-intro/);
  assert.doesNotMatch(page, /home-release-panel/);
  assert.match(page, /Popular Pals/);
  assert.doesNotMatch(layout, /Palworld Breeding Calculator - Updated 1\.0 Pal Combos/);
  assert.match(layout, /\/favicon\.ico/);
  assert.match(layout, /\/icon-192\.png/);
  assert.match(layout, /\/apple-touch-icon\.png/);
  assert.match(layout, /\/site\.webmanifest/);
  assert.doesNotMatch(page, /Coming Soon|href="\/map"/);
  assert.doesNotMatch(page, /Polworld|POLWORLD/);
  assert.match(layout, /@fontsource\/barlow/);
  assert.match(layout, /@fontsource\/rajdhani/);
  assert.match(terminalTheme, /Pal Expedition Terminal/);
  assert.match(terminalTheme, /--terminal-mint: #39d0c5/);
});

test("every page inherits one semantic Tailwind theme", async () => {
  const globals = await read("../app/globals.css");
  const theme = await read("../app/theme.css");
  assert.match(globals, /@import "\.\/theme\.css"/);
  for (const token of ["primary-900", "secondary-700", "accent", "canvas", "background", "surface", "foreground", "muted", "link", "border"]) {
    assert.match(theme, new RegExp(`--color-${token}:`));
  }
  for (const heading of ["h1", "h2", "h3", "h4", "h5", "h6"]) {
    assert.match(theme, new RegExp(`--heading-${heading}-size:`));
  }
  for (const variant of ["btn-primary", "btn-secondary", "btn-accent", "btn-outline"]) {
    assert.match(theme, new RegExp(`\\.${variant}`));
  }
  assert.match(theme, /body\s*\{[\s\S]*background: var\(--theme-canvas\)/);
  const terminalTheme = await read("../app/terminal-theme.css");
  assert.match(terminalTheme, /\.database-page,[\s\S]*background: var\(--terminal-canvas\)/);
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
  assert.match(board, /setLoadError\(true\)/);
  assert.match(board, /Breeding data is unavailable/);
  assert.match(board, />Retry</);
});

test("homepage can reverse-search parent combinations for a target Pal", async () => {
  const board = await read("../app/components/home-tool-board.tsx");
  assert.match(board, /Target → Parents/);
  assert.match(board, /Parents → Result/);
  assert.match(board, /matrix\[first\.id\]\?\.\[second\.id\] !== target\.id/);
  assert.match(board, /HOME_PAIR_LIMIT = 12/);
  assert.match(board, /PalMark pal={first}/);
  assert.match(board, /PalMark pal={second}/);
  assert.match(board, /Choose a Pal and find its parent combinations/);
  assert.match(board, /openPicker\("target"\)/);
  assert.match(board, /Breeding data is unavailable/);
  assert.match(board, />Retry</);
});

test("homepage Pal picker renders above the page stacking contexts", async () => {
  const board = await read("../app/components/home-tool-board.tsx");
  const styles = await read("../app/tool-pages.css");
  assert.match(board, /createPortal/);
  assert.match(board, /document\.body/);
  assert.match(styles, /\.pal-picker-backdrop\{position:fixed;z-index:1000/);
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
  const content = await read("../app/paldex/paldex-page-content.tsx");
  const client = await read("../app/paldex/paldex-client.tsx");
  const profile = await read("../app/pals/[slug]/page.tsx");
  assert.equal((content.match(/<h1/g) ?? []).length, 1);
  assert.match(page, /PaldexPageContent/);
  assert.match(content, /Palworld Paldeck Database/);
  assert.match(client, /Work Suitability/);
  assert.match(client, /Minimum Work Level/);
  assert.match(client, /Highest work level/);
  assert.match(client, /paldex-view-toggle/);
  assert.match(client, /Reset filters/);
  assert.match(client, /Breeding power/);
  assert.match(client, /PALDEX_PAGE_SIZE/);
  assert.match(client, /filtered\.slice\(\(safePage - 1\) \* PALDEX_PAGE_SIZE/);
  assert.match(client, /href={`\/pals\/\$\{pal\.slug\}`}/);
  assert.match(client, /paldex-pagination/);
  assert.match(client, /`\/paldex\/page\/\$\{page\}`/);
  assert.doesNotMatch(client, /return <button type="button" aria-pressed=\{selected\.id === pal\.id\}/);
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
  assert.match(sitemap, /paldex\/page\/\$\{index \+ 2\}/);
  assert.match(sitemap, /priority: 1/);
  assert.match(robots, /sitemap\.xml/);
  assert.match(robots, /allow: "\/"/);
});

test("pages own their canonical and social metadata without inheriting homepage SEO", async () => {
  const layout = await read("../app/layout.tsx");
  const home = await read("../app/page.tsx");
  const seo = await read("../app/lib/seo.ts");
  const notFound = await read("../app/not-found.tsx");
  const topLevelPages = [
    "../app/page.tsx",
    "../app/paldex/page.tsx",
    "../app/breeding-calculator/page.tsx",
    "../app/tools/page.tsx",
    "../app/guides/page.tsx",
    "../app/updates/page.tsx",
    "../app/palworld-1-0/page.tsx",
  ];

  assert.doesNotMatch(layout, /alternates:/);
  assert.doesNotMatch(layout, /openGraph:/);
  assert.doesNotMatch(layout, /twitter:/);
  assert.match(home, /path: "\/"/);
  assert.match(seo, /alternates: \{ canonical: url \}/);
  assert.match(seo, /twitter: \{ card: "summary_large_image", title, description/);
  for (const path of topLevelPages) assert.match(await read(path), /createPageMetadata/);
  assert.doesNotMatch(notFound, /robots:/);
  assert.match(notFound, /Page Not Found \| Palworld Guide/);
});

test("Paldeck pagination exposes every initial Pal card to crawlers", async () => {
  const pagination = await read("../app/paldex/page/[page]/page.tsx");
  const content = await read("../app/paldex/paldex-page-content.tsx");
  assert.match(pagination, /generateStaticParams/);
  assert.match(pagination, /permanentRedirect\("\/paldex"\)/);
  assert.match(pagination, /path: `\/paldex\/page\/\$\{page\}`/);
  assert.match(content, /<PaldexClient initialPage=\{initialPage\}/);
});

test("social metadata declares locale, dimensions, and Pal sharing cards", async () => {
  const seo = await read("../app/lib/seo.ts");
  const palPage = await read("../app/pals/[slug]/page.tsx");
  const palImage = await read("../app/pals/[slug]/opengraph-image.tsx");
  assert.match(seo, /locale: "en_US"/);
  assert.match(seo, /width: imageWidth, height: imageHeight/);
  assert.match(palPage, /image: `\/pals\/\$\{pal\.slug\}\/opengraph-image`/);
  assert.match(palPage, /imageWidth: 1200/);
  assert.match(palPage, /imageHeight: 630/);
  assert.match(palImage, /width: 1200, height: 630/);
  assert.match(palImage, /new ImageResponse/);
});

test("deep content exposes Article and BreadcrumbList structured data", async () => {
  const guide = await read("../app/guides/[slug]/page.tsx");
  const pal = await read("../app/pals/[slug]/page.tsx");
  assert.match(guide, /"@type": "Article"/);
  assert.match(guide, /createBreadcrumbSchema/);
  assert.match(guide, /Home/);
  assert.match(guide, /Guides/);
  assert.match(pal, /createBreadcrumbSchema/);
  assert.match(pal, /Paldeck/);
});

test("keyboard users can skip repeated navigation", async () => {
  const layout = await read("../app/layout.tsx");
  const toolShell = await read("../app/components/tool-shell.tsx");
  const theme = await read("../app/terminal-theme.css");
  assert.match(layout, /className="skip-link" href="#main-content"/);
  assert.match(toolShell, /<main id="main-content"/);
  assert.match(theme, /\.skip-link:focus/);
});
