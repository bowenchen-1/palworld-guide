import type { BreedingData, PalData } from "../../lib/game-data";

export type Gender = "female" | "male";
export type BreedingResult = { first: PalData; second: PalData; child: PalData; genders?: [Gender, Gender]; requiresTwo: boolean };
export type RouteStep = BreedingResult;
export type Route = { steps: RouteStep[]; generations: number };

// These are the only two directional cells in the 1.0 matrix.  The source table
// explicitly assigns the two gender arrangements, so UI code never guesses.
const genderRules: Record<string, [Gender, Gender]> = {
  "78.0|79.0": ["female", "male"],
  "79.0|78.0": ["female", "male"],
};

export function palNumber(value: string) {
  const match = /^(\d+)(?:\.(\d+))?$/.exec(value);
  return match ? [Number(match[1]), Number(match[2] ?? 0)] : [Number.MAX_SAFE_INTEGER, 0];
}
export function comparePals(a: PalData, b: PalData) { const [an, as] = palNumber(a.number); const [bn, bs] = palNumber(b.number); return an - bn || as - bs || a.name.localeCompare(b.name); }
export function getResult(matrix: BreedingData, byId: Map<string, PalData>, first: PalData, second: PalData): BreedingResult | undefined {
  const childId = matrix[first.id]?.[second.id]; const child = childId ? byId.get(childId) : undefined;
  return child ? { first, second, child, genders: genderRules[`${first.id}|${second.id}`], requiresTwo: first.id === second.id } : undefined;
}
export function pairResults(matrix: BreedingData, byId: Map<string, PalData>, first: PalData, second: PalData) {
  const forward = getResult(matrix, byId, first, second); const reverse = first.id === second.id ? undefined : getResult(matrix, byId, second, first);
  return [forward, reverse].filter((item): item is BreedingResult => Boolean(item)).filter((item, index, all) => index === 0 || item.child.id !== all[0].child.id || Boolean(item.genders));
}
export function findParentPairs(matrix: BreedingData, byId: Map<string, PalData>, target: PalData) {
  const values = [...byId.values()].sort(comparePals); const found: BreedingResult[] = [];
  for (let i = 0; i < values.length; i++) for (let j = i; j < values.length; j++) found.push(...pairResults(matrix, byId, values[i], values[j]).filter((result) => result.child.id === target.id));
  return found;
}
export function findOffspring(matrix: BreedingData, byId: Map<string, PalData>, parent: PalData) { return [...byId.values()].sort(comparePals).flatMap((partner) => pairResults(matrix, byId, parent, partner)); }
export function availableOffspring(matrix: BreedingData, byId: Map<string, PalData>, ids: string[]) {
  const values = ids.map((id) => byId.get(id)).filter((pal): pal is PalData => Boolean(pal)); const out = new Map<string, BreedingResult[]>();
  for (let i = 0; i < values.length; i++) for (let j = i; j < values.length; j++) for (const result of pairResults(matrix, byId, values[i], values[j])) out.set(result.child.id, [...(out.get(result.child.id) ?? []), result]);
  return [...out.entries()].map(([child, combinations]) => ({ child: byId.get(child)!, combinations })).sort((a, b) => comparePals(a.child, b.child));
}
function routeKey(route: Route) { return route.steps.map((step) => `${step.first.id}:${step.second.id}:${step.child.id}`).join(","); }
function sortRoutes(routes: Route[]) { return routes.sort((a, b) => a.generations - b.generations || a.steps.filter((s) => s.genders).length - b.steps.filter((s) => s.genders).length || a.steps.filter((s) => s.requiresTwo).length - b.steps.filter((s) => s.requiresTwo).length || routeKey(a).localeCompare(routeKey(b))); }
export function findRoutes(matrix: BreedingData, byId: Map<string, PalData>, starts: PalData[], target: PalData, partners: PalData[], max = 3, excluded = new Set<string>()) {
  if (starts.some((pal) => pal.id === target.id)) return [{ steps: [], generations: 0 }];
  const queue = starts.filter((pal) => !excluded.has(pal.id)).map((pal) => ({ pal, steps: [] as RouteStep[], seen: new Set([pal.id]) })); const routes: Route[] = []; let best = Infinity;
  while (queue.length) { const current = queue.shift()!; if (current.steps.length >= max || current.steps.length >= best) continue;
    for (const partner of partners) { if (excluded.has(partner.id)) continue; for (const edge of pairResults(matrix, byId, current.pal, partner)) {
      if (excluded.has(edge.child.id) || current.seen.has(edge.child.id)) continue;
      const steps = [...current.steps, edge]; if (edge.child.id === target.id) { best = steps.length; routes.push({ steps, generations: steps.length }); }
      else queue.push({ pal: edge.child, steps, seen: new Set([...current.seen, edge.child.id]) });
    }}
  }
  return sortRoutes(routes).slice(0, 3);
}
