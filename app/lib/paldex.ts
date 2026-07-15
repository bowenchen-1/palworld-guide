import { PalData, WorkKey } from "./game-data";

export type MatchMode = "all" | "any";
export type PaldexView = "overview" | "work" | "stats";
export type PaldexSort = "number" | "name" | "hp" | "ranged" | "defense" | "stamina" | "price" | "ride-speed" | "rarity" | "food" | "speed" | "work" | "power-low" | "power-high";
export type PaldexFilters = { q: string; elements: string[]; elementMode: MatchMode; work: WorkKey[]; workMode: MatchMode; workLevel: number; types: PalData["kind"][]; sort: PaldexSort; view: PaldexView };

export const paldexDefaults: PaldexFilters = { q: "", elements: [], elementMode: "any", work: [], workMode: "any", workLevel: 0, types: ["pal"], sort: "number", view: "overview" };
const workKeys: WorkKey[] = ["emitflame", "watering", "seeding", "generateelectricity", "handcraft", "collection", "deforest", "mining", "productmedicine", "cool", "transport", "monsterfarm"];
const validWork = new Set<WorkKey>(workKeys);
const validSort = new Set<PaldexSort>(["number", "name", "hp", "ranged", "defense", "stamina", "price", "ride-speed", "rarity", "food", "speed", "work", "power-low", "power-high"]);
const list = (value: string | null) => value?.split(",").filter(Boolean) ?? [];

export function parsePaldexFilters(params: URLSearchParams): PaldexFilters {
  const work = list(params.get("work")).filter((item): item is WorkKey => validWork.has(item as WorkKey));
  const types = list(params.get("types")).filter((item): item is PalData["kind"] => item === "pal" || item === "monster");
  const sort = params.get("sort") as PaldexSort;
  const workLevel = Number.parseInt(params.get("workLevel") ?? "0", 10);
  return { q: params.get("q") ?? "", elements: list(params.get("elements")), elementMode: params.get("elementMode") === "all" ? "all" : "any", work, workMode: params.get("workMode") === "all" ? "all" : "any", workLevel: Number.isInteger(workLevel) && workLevel >= 0 && workLevel <= 10 ? workLevel : 0, types: types.length ? types : paldexDefaults.types, sort: validSort.has(sort) ? sort : "number", view: (["overview", "work", "stats"] as string[]).includes(params.get("view") ?? "") ? params.get("view") as PaldexView : "overview" };
}

export function serializePaldexFilters(filters: PaldexFilters) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.elements.length) params.set("elements", filters.elements.join(","));
  if (filters.elementMode !== "any") params.set("elementMode", filters.elementMode);
  if (filters.work.length) params.set("work", filters.work.join(","));
  if (filters.workMode !== "any") params.set("workMode", filters.workMode);
  if (filters.workLevel) params.set("workLevel", String(filters.workLevel));
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
    const elementMatches = !filters.elements.length || (filters.elementMode === "all" ? filters.elements.every((element) => pal.elements.includes(element)) : filters.elements.some((element) => pal.elements.includes(element)));
    const matchesWork = (key: WorkKey) => (pal.work[key] ?? 0) >= Math.max(1, filters.workLevel);
    const workMatches = !filters.work.length || (filters.workMode === "all" ? filters.work.every(matchesWork) : filters.work.some(matchesWork));
    return searchable && elementMatches && workMatches && filters.types.includes(pal.kind);
  });
}

export function sortPals(records: PalData[], sort: PaldexSort) {
  const field: Partial<Record<PaldexSort, (pal: PalData) => number>> = { hp: (pal) => numberOrEmpty(pal.stats.hp), ranged: (pal) => numberOrEmpty(pal.stats.rangedAttack), defense: (pal) => numberOrEmpty(pal.stats.defense), stamina: (pal) => numberOrEmpty(pal.stats.stamina), price: (pal) => numberOrEmpty(pal.price), "ride-speed": (pal) => numberOrEmpty(pal.movement.rideSprint), rarity: (pal) => numberOrEmpty(pal.rarity), food: (pal) => numberOrEmpty(pal.foodConsumption), speed: (pal) => numberOrEmpty(pal.movement.run), work: highestWorkLevel };
  return [...records].sort((a, b) => {
    if (sort === "name") return a.name.localeCompare(b.name) || numberValue(a) - numberValue(b);
    if (sort === "power-low") return a.power - b.power || numberValue(a) - numberValue(b);
    if (sort === "power-high") return b.power - a.power || numberValue(a) - numberValue(b);
    if (sort === "number") return numberValue(a) - numberValue(b) || a.number.localeCompare(b.number);
    return (field[sort]?.(b) ?? 0) - (field[sort]?.(a) ?? 0) || numberValue(a) - numberValue(b);
  });
}
