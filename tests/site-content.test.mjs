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
  assert.match(page, /BreedingClient embedded/);
  assert.match(page, /Find the Pal behind every breeding choice/);
  assert.match(page, /Palworld Breeding Calculator FAQ/);
  assert.match(page, /Plan a Reliable Breeding Route/);
  assert.match(page, /"@type": "WebApplication"/);
  assert.match(gameData, /href: "\/"/);
  assert.match(gameData, /\/paldex/);
  assert.match(gameData, /\/palworld-1-0/);
  assert.doesNotMatch(page, /HomeToolBoard/);
  assert.match(page, /home-calculator-top/);
  assert.match(page, /Updated for Palworld 1\.0/);
  assert.match(page, /home-calculator-intro/);
  assert.match(page, /const standardPalCount = pals\.filter\(\(pal\) => pal\.kind === "pal"\)\.length/);
  assert.match(page, /const crossoverCreatureCount = pals\.filter\(\(pal\) => pal\.kind === "monster"\)\.length/);
  assert.match(page, /Total Pal entries/);
  assert.match(page, /standard Pals · \{crossoverCreatureCount\} crossover creatures · \{totalPalEntryCount\} total Pal entries/);
  assert.doesNotMatch(page, /300 breeding records|Pal records|Browse all 289 Pals/);
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
    ["../app/paldex/page.tsx", "palworld paldeck"],
    ["../app/tools/page.tsx", "palworld tools"],
    ["../app/guides/page.tsx", "palworld guides"],
    ["../app/updates/page.tsx", "palworld 1.0 patch notes"],
    ["../app/team-builder/page.tsx", "palworld team builder"],
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

test("homepage hosts all six calculator modes with shared URL and local storage state", async () => {
  const page = await read("../app/page.tsx");
  const client = await read("../app/breeding-calculator/breeding-client.tsx");
  assert.match(page, /BreedingClient embedded/);
  for (const feature of ["Parents → Child", "Target → Parents", "One Parent → Offspring", "Available Pals → Target", "Shortest Route", "What Can I Breed Now"]) assert.match(client, new RegExp(feature));
  assert.match(client, /fetch\("\/data\/breeding\.json"\)/);
  assert.match(client, /readAvailablePals/);
  assert.match(client, /saveAvailablePals/);
  assert.match(client, /history\.replaceState/);
  assert.match(client, /pal-picker-backdrop/);
  assert.match(client, /home-breeding-equation/);
  assert.match(client, /home-breeding-slot offspring/);
  assert.match(client, /homeParentPick\("Parent A"/);
  assert.match(client, /homeParentPick\("Parent B"/);
  assert.match(client, /pairCandidates/);
  assert.match(client, /result\.first\.id === parentFilter \|\| result\.second\.id === parentFilter/);
  assert.match(client, /offspringCandidates/);
  assert.match(client, /result\.second\.id === offspringFilter \|\| result\.child\.id === offspringFilter/);
  assert.match(client, /Advanced options/);
  assert.match(client, /setExcluded\(\(current\) => current\.filter/);
  assert.doesNotMatch(client, /Search parents…|Search partner or offspring…|Comma-separated IDs/);
  assert.match(client, /const PICKER_BATCH_SIZE = 60/);
  assert.match(client, /const visibleSearch = search\.slice\(0, pickerLimit\)/);
  assert.match(client, /Showing \{visibleSearch\.length\} of \{search\.length\} Pals/);
  assert.match(client, /setPickerLimit\(\(limit\) => limit \+ PICKER_BATCH_SIZE\)/);
  assert.match(client, /const matches = useMemo/);
  assert.match(client, /Showing \{shown\.length\} of \{matches\.length\} Pals/);
  assert.match(client, /setLimit\(\(value\) => value \+ batchSize\)/);
  assert.doesNotMatch(client, /sort\(comparePals\)\.slice\(0, 60\)|compact \? 20 : 60/);
  assert.match(client, /const modeDescriptions: Record<Mode, string>/);
  assert.match(client, /home-mode-description/);
  assert.match(client, /const \[mode, setMode\] = useState<Mode>\("parents"\)/);
  assert.doesNotMatch(client, /initialParam|initialPal|suppressHydrationWarning/);
  assert.match(client, /requestAnimationFrame\(\(\) => \{ const params = new URLSearchParams\(window\.location\.search\)/);
  assert.match(client, /if \(!urlRestored \|\| !Object\.keys\(matrix\)\.length\) return/);
  assert.match(client, /Choose a starting Pal and a target Pal to calculate a route\./);
  assert.match(client, /role="dialog" aria-modal="true" aria-labelledby="pal-selector-title"/);
  assert.match(client, /aria-label="Close Pal selector"/);
  assert.match(client, /searchInputRef\.current\?\.focus/);
  assert.match(client, /pickerTriggerRef\.current\?\.focus/);
});

test("every current Pal entry has a local image used by the shared Pal component", async () => {
  const pals = JSON.parse(await read("../public/data/pals.json"));
  const images = await readdir(new URL("../public/pals/", import.meta.url));
  const mark = await read("../app/components/pal-mark.tsx");
  assert.equal(images.filter((file) => file.endsWith(".webp")).length, pals.length);
  for (const pal of pals) assert.ok(images.includes(`${pal.id}.webp`), `missing image for ${pal.name}`);
  assert.match(mark, /src={`\/pals\/\$\{pal\.id\}\.webp`}/);
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

test("current 1.0 dataset distinguishes Paldeck numbers, Pal forms, and crossover entries", async () => {
  const pals = JSON.parse(await read("../public/data/pals.json"));
  const version = JSON.parse(await read("../public/data/data-version.json"));
  const matrix = JSON.parse(await read("../public/data/breeding.json"));
  assert.equal(pals.length, 300);
  assert.equal(pals.filter((pal) => pal.kind === "pal").length, 289);
  assert.equal(new Set(pals.filter((pal) => pal.kind === "pal").map((pal) => pal.number.replace(/[A-Z]+$/, ""))).size, 204);
  assert.equal(pals.filter((pal) => pal.kind === "monster").length, 11);
  assert.equal(version.gameVersion, "1.0");
  assert.equal(pals.find((pal) => pal.name === "Sekhmet")?.number, "140");
  assert.equal(Object.keys(matrix).length, 300);
});

test("legacy breeding calculator URL redirects to homepage while preserving query state", async () => {
  const page = await read("../app/breeding-calculator/page.tsx");
  const client = await read("../app/breeding-calculator/breeding-client.tsx");
  assert.match(page, /permanentRedirect/);
  assert.match(page, /searchParams/);
  assert.match(page, /URLSearchParams/);
  assert.match(client, /Parents → Child/);
  assert.match(client, /Target → Parents/);
  const breedingCore = await read("../app/breeding-calculator/breeding/core.ts");
  assert.match(client, /findParentPairs/);
  assert.match(breedingCore, /matrix\[first\.id\]\?\.\[second\.id\]/);
});

test("Paldeck has URL-backed filters, one comparative table, and indexable profile pages", async () => {
  const page = await read("../app/paldex/page.tsx");
  const content = await read("../app/paldex/paldex-page-content.tsx");
  const client = await read("../app/paldex/paldex-client.tsx");
  const profile = await read("../app/pals/[slug]/page.tsx");
  assert.equal((content.match(/<h1/g) ?? []).length, 1);
  assert.match(page, /PaldexPageContent/);
  assert.match(content, /Palworld Paldeck Database/);
  assert.match(client, /Work Suitability/);
  assert.match(client, /Work suitability/);
  assert.match(client, /Match any/);
  assert.match(client, /Match all/);
  assert.match(client, /Minimum level/);
  assert.match(client, /elementMode/);
  assert.match(client, /workLevel/);
  assert.match(client, /Highest work level/);
  assert.match(client, /paldex-control-bar/);
  assert.match(client, /Clear all/);
  assert.match(client, /Breeding power/);
  assert.match(client, /serializePaldexFilters/);
  assert.match(client, /useSearchParams/);
  assert.match(client, /href={`\/pals\/\$\{pal\.slug\}`}/);
  assert.match(client, /paldex-complete-table/);
  assert.doesNotMatch(client, /paldex-mobile-cards/);
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
  assert.doesNotMatch(sitemap, /breeding-calculator/);
  assert.match(sitemap, /palworld-1-0/);
  assert.match(sitemap, /\$\{siteUrl\}\/tools/);
  assert.match(sitemap, /\$\{siteUrl\}\/team-builder/);
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
    "../app/tools/page.tsx",
    "../app/guides/page.tsx",
    "../app/updates/page.tsx",
    "../app/palworld-1-0/page.tsx",
    "../app/team-builder/page.tsx",
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
  assert.match(content, /<Suspense/);
  assert.match(content, /<PaldexClient initialPage=\{initialPage\}/);
});

test("Paldeck uses one responsive searchable comparison table", async () => {
  const pageContent = await read("../app/paldex/paldex-page-content.tsx");
  const client = await read("../app/paldex/paldex-client.tsx");
  const styles = await read("../app/tool-pages.css");
  assert.match(pageContent, /compact-paldex-hero/);
  assert.doesNotMatch(pageContent, /<DataNotice/);
  assert.match(client, /className="paldex-search"/);
  assert.match(client, /className="paldex-table paldex-complete-table"/);
  assert.match(client, /className="paldex-filter-sheet"/);
  assert.match(client, /className="paldex-icon-filters"/);
  assert.match(client, /aria-label={`Filter by \$\{item\}`}/);
  assert.match(client, /toggleElement/);
  assert.match(client, /toggleWork/);
  assert.doesNotMatch(client, /paldex-mobile-cards/);
  assert.match(styles, /\.paldex-complete-table th:first-child,.paldex-complete-table td:first-child\{position:sticky/);
  assert.match(styles, /\.paldex-mobile-cards\{display:none!important\}/);
});

test("team builder exposes five slots, objective summaries, persistence, and shareable state", async () => {
  const page = await read("../app/team-builder/page.tsx");
  const client = await read("../app/team-builder/team-builder-client.tsx");
  const tools = await read("../app/tools/page.tsx");
  assert.match(page, /<h1>Palworld Team Builder<\/h1>/);
  assert.match(page, /TeamBuilderClient/);
  assert.match(client, /palworld-team-builder-v1/);
  assert.match(client, /Copy share link/);
  assert.match(client, /How to breed/);
  assert.match(client, /Element coverage/);
  assert.match(client, /Work coverage/);
  assert.match(client, /Partner skills/);
  assert.match(client, /role="dialog" aria-modal="true"/);
  assert.match(client, /parseTeamParam/);
  assert.match(tools, /href="\/team-builder"/);
  assert.match(await read("../app/lib/game-data.ts"), /href: "\/team-builder"/);
});

test("Pal data schema and repeatable import safeguards cover the 1.0 snapshot", async () => {
  const data = JSON.parse(await read("../public/data/pals.json"));
  const type = await read("../app/lib/game-data.ts");
  const filters = await read("../app/lib/paldex.ts");
  const importer = await read("../scripts/import-pal-data.mjs");
  const validator = await read("../scripts/validate-pal-data.mjs");
  assert.equal(data.length, 300);
  for (const pal of data) {
    assert.ok("stats" in pal && "movement" in pal && "partnerSkill" in pal && "activeSkills" in pal && "drops" in pal && "ranchProduct" in pal);
  }
  assert.equal(data.filter((pal) => pal.stats.hp !== null).length, 300);
  assert.equal(data.filter((pal) => pal.stats.stamina !== null).length, 300);
  assert.equal(data.filter((pal) => pal.elements.length).length, 300);
  assert.equal(data.filter((pal) => pal.price !== null).length, 299);
  assert.equal(data.filter((pal) => pal.movement.rideSprint !== null).length, 298);
  assert.equal(data.filter((pal) => pal.movement.run !== null).length, 299);
  assert.equal(data.filter((pal) => pal.partnerSkill.name !== null).length, 299);
  assert.equal(data.filter((pal) => pal.partnerSkill.iconId !== null).length, 202);
  assert.equal(data.filter((pal) => pal.partnerSkill.iconFile !== null).length, 300);
  assert.equal(data.find((pal) => pal.name === "Gumoss (Special)")?.price, null);
  assert.match(type, /foodConsumption: number \| null/);
  assert.match(type, /price: number \| null/);
  assert.match(type, /iconId: string \| null; iconFile: string \| null/);
  assert.match(filters, /parsePaldexFilters/);
  assert.match(filters, /filterPals/);
  assert.match(filters, /sortPals/);
  assert.match(importer, /paldb-1\.0-20260715/);
  assert.match(importer, /work-suitability conflict/);
  assert.match(validator, /duplicate Pal ids/);
  assert.match(validator, /missing image/);
  assert.match(validator, /missing Partner Skill icon/);
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
