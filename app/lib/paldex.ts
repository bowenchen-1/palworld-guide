import { PalData, WorkKey } from "./game-data";

export type WorkMode = "all" | "any";
export type PaldexView = "overview" | "work";
export type PaldexSort = "number" | "name" | "hp" | "melee" | "ranged" | "defense" | "craft" | "rarity" | "food" | "speed" | "work" | "power-low" | "power-high";
export type PaldexFilters = { q: string; elements: string[]; work: WorkKey[]; workMode: WorkMode; types: PalData["kind"][]; sort: PaldexSort; view: PaldexView };

export const paldexDefaults: PaldexFilters = { q: "", elements: [], work: [], workMode: "any", types: ["pal"], sort: "number", view: "overview" };
const validWork = new Set<WorkKey>(["emitflame", "watering", "seeding", "generateelectricity", "handcraft", "collection", "deforest", "mining", "productmedicine", "cool", "transport", "monsterfarm"]);
const validSort = new Set<PaldexSort>(["number", "name", "hp", "melee", "ranged", "defense", "craft", "rarity", "food", "speed", "work", "power-low", "power-high"]);
const list = (value: string | null) => value?.split(",").filter(Boolean) ?? [];

export function parsePaldexFilters(params: URLSearchParams): PaldexFilters {
  const work = list(params.get("work")).filter((item): item is WorkKey => validWork.has(item as WorkKey));
  const types = list(params.get("types")).filter((item): item is PalData["kind"] => item === "pal" || item === "monster");
  const sort = params.get("sort") as PaldexSort;
  return {
    q: params.get("q") ?? "", elements: list(params.get("elements")), work,
    workMode: params.get("workMode") === "all" ? "all" : "any",
    types: types.length ? types : paldexDefaults.types,
    sort: validSort.has(sort) ? sort : "number",
    view: params.get("view") === "work" ? "work" : "overview",
  };
}

export function serializePaldexFilters(filters: PaldexFilters) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.elements.length) params.set("elements", filters.elements.join(","));
  if (filters.work.length) params.set("work", filters.work.join(","));
  if (filters.workMode !== "any") params.set("workMode", filters.workMode);
  if (filters.types.join(",") !== paldexDefaults.types.join(",")) params.set("types", filters.types.join(","));
  if (filters.sort !== "number") params.set("sort", filters.sort);
  if (filters.view !== "overview") params.set("view", filters.view);
  return params;
}

const numberValue = (pal: PalData) => Number.parseInt(pal.number, 10);
export const highestWorkLevel = (pal: PalData) => Math.max(0, ...Object.values(pal.work));
const numberOrEmpty = (value: number | null) => value ?? -1;

export function filterPals(records: PalData[], filters: PaldexFilters) {
  const needle = filters.q.trim().toLocaleLowerCase();
  return records.filter((pal) => {
    const searchable = !needle || pal.name.toLocaleLowerCase().includes(needle) || pal.number.toLocaleLowerCase().includes(needle);
    const elementMatches = !filters.elements.length || filters.elements.some((element) => pal.elements.includes(element));
    const workMatches = !filters.work.length || (filters.workMode === "all" ? filters.work.every((key) => (pal.work[key] ?? 0) > 0) : filters.work.some((key) => (pal.work[key] ?? 0) > 0));
    return searchable && elementMatches && workMatches && filters.types.includes(pal.kind);
  });
}

export function sortPals(records: PalData[], sort: PaldexSort) {
  const field: Partial<Record<PaldexSort, (pal: PalData) => number>> = {
    hp: (pal) => numberOrEmpty(pal.stats.hp), melee: (pal) => numberOrEmpty(pal.stats.meleeAttack), ranged: (pal) => numberOrEmpty(pal.stats.rangedAttack), defense: (pal) => numberOrEmpty(pal.stats.defense), craft: (pal) => numberOrEmpty(pal.stats.craftSpeed), rarity: (pal) => numberOrEmpty(pal.rarity), food: (pal) => numberOrEmpty(pal.foodConsumption), speed: (pal) => numberOrEmpty(pal.movement.run), work: highestWorkLevel,
  };
  return [...records].sort((a, b) => {
    if (sort === "name") return a.name.localeCompare(b.name) || numberValue(a) - numberValue(b);
    if (sort === "power-low") return a.power - b.power || numberValue(a) - numberValue(b);
    if (sort === "power-high") return b.power - a.power || numberValue(a) - numberValue(b);
    if (sort === "number") return numberValue(a) - numberValue(b) || a.number.localeCompare(b.number);
    const compare = (field[sort]?.(b) ?? 0) - (field[sort]?.(a) ?? 0);
    return compare || numberValue(a) - numberValue(b);
  });
}
