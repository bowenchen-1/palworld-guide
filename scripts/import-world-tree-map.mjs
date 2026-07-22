import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const SOURCE_URL = "https://paldb.cn/treemap";
const OUTPUT_PATH = "public/data/world-tree-locations.json";
const ICON_DIRECTORY = "public/map-icons/world-tree";

function extractMapData(html) {
  const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map((match) => match[1]);
  const script = scripts.find((value) => value.includes("mapData"));
  if (!script) throw new Error("Could not find mapData in the source page.");

  const outer = JSON.parse(script.slice(script.indexOf("[1,"), script.lastIndexOf("])" ) + 1));
  const serialized = outer[1];
  const start = serialized.indexOf("{\"iconLookup\"");
  if (start < 0) throw new Error("Could not find the mapData object.");

  let depth = 0;
  let inString = false;
  let escaped = false;
  let end = -1;
  for (let index = start; index < serialized.length; index += 1) {
    const character = serialized[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === '"') inString = false;
      continue;
    }
    if (character === '"') inString = true;
    else if (character === "{") depth += 1;
    else if (character === "}" && --depth === 0) {
      end = index + 1;
      break;
    }
  }
  if (end < 0) throw new Error("Could not finish parsing mapData.");
  return JSON.parse(serialized.slice(start, end));
}

const response = await fetch(SOURCE_URL);
if (!response.ok) throw new Error(`Source request failed: ${response.status}`);
const mapData = extractMapData(await response.text());

const iconSources = [...new Set(mapData.fixedDungeon.map((record) => record.fixed_icon).filter(Boolean))];
const iconPaths = new Map(iconSources.map((source) => [source, `/map-icons/world-tree/${path.basename(source)}`]));

await mkdir(ICON_DIRECTORY, { recursive: true });
await Promise.all(iconSources.map(async (source) => {
  const response = await fetch(new URL(source, "https://paldb.cn/"));
  if (!response.ok) throw new Error(`Icon request failed for ${source}: ${response.status}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  await writeFile(path.join(ICON_DIRECTORY, path.basename(source)), bytes);
}));

const locations = mapData.fixedDungeon.map((record, index) => ({
  id: `world-tree-${record.id || record.type}-${record.ipos?.X ?? "x"}-${record.ipos?.Y ?? "y"}-${index}`,
  name: record.item || record.comment || record.type,
  category: record.type,
  categoryKey: record.type,
  level: record.lv == null ? undefined : String(record.lv),
  description: record.comment,
  x: record.ipos?.X,
  y: record.ipos?.Y,
  href: record.href,
  icon: record.fixed_icon ? iconPaths.get(record.fixed_icon) : undefined,
  sourceIcon: record.fixed_icon ? new URL(record.fixed_icon, "https://paldb.cn/").toString() : undefined,
  sourceId: record.id,
  sourceType: record.type,
  sourceClass: record.class,
  sourceBoss: record.boss,
}));

const payload = {
  source: SOURCE_URL,
  sourceUpdated: "2026-07-11",
  coordinateSystem: {
    mapWidth: mapData.mapConfig.minMapTextureBlockSize.X,
    mapHeight: mapData.mapConfig.minMapTextureBlockSize.Y,
    perPixel: mapData.coordConfig.perPixel,
    ingameXStart: mapData.coordConfig.ingameXStart,
    ingameYStart: mapData.coordConfig.ingameYStart,
    invertY: false,
    tileDirectory: mapData.tileDir,
    landscapeMin: mapData.mapConfig.landScapeRealPositionMin,
    landscapeMax: mapData.mapConfig.landScapeRealPositionMax,
  },
  types: [...new Set(locations.map((location) => location.category))],
  locations,
};

await writeFile(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`Imported ${locations.length} World Tree locations into ${OUTPUT_PATH}`);
