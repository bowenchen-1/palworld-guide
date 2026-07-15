import type { PalData, WorkKey } from "../lib/game-data";

export const TEAM_SIZE = 5;
export type TeamSlots = (string | null)[];

export function emptyTeam(): TeamSlots {
  return Array.from({ length: TEAM_SIZE }, () => null);
}

export function normalizeTeam(values: unknown, validIds: ReadonlySet<string>): TeamSlots {
  if (!Array.isArray(values)) return emptyTeam();
  return Array.from({ length: TEAM_SIZE }, (_, index) => {
    const value = values[index];
    return typeof value === "string" && validIds.has(value) ? value : null;
  });
}

export function parseTeamParam(value: string | null, validIds: ReadonlySet<string>): TeamSlots {
  if (!value) return emptyTeam();
  return normalizeTeam(value.split(",").map((entry) => entry.trim() || null), validIds);
}

export function serializeTeam(team: TeamSlots): string {
  return Array.from({ length: TEAM_SIZE }, (_, index) => team[index] ?? "").join(",").replace(/,+$/, "");
}

export function duplicateIds(team: TeamSlots): Set<string> {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const id of team) {
    if (!id) continue;
    if (seen.has(id)) duplicates.add(id);
    seen.add(id);
  }
  return duplicates;
}

export function elementCoverage(team: PalData[]) {
  const counts = new Map<string, number>();
  for (const pal of team) for (const element of pal.elements) counts.set(element, (counts.get(element) ?? 0) + 1);
  return [...counts.entries()].map(([element, count]) => ({ element, count })).sort((a, b) => b.count - a.count || a.element.localeCompare(b.element));
}

export function workCoverage(team: PalData[]) {
  const summary = new Map<WorkKey, { level: number; members: number }>();
  for (const pal of team) {
    for (const [work, level] of Object.entries(pal.work) as [WorkKey, number][]) {
      const current = summary.get(work);
      summary.set(work, { level: Math.max(current?.level ?? 0, level), members: (current?.members ?? 0) + 1 });
    }
  }
  return [...summary.entries()].map(([work, value]) => ({ work, ...value })).sort((a, b) => b.level - a.level || b.members - a.members || a.work.localeCompare(b.work));
}

export function average(values: (number | null)[]) {
  const available = values.filter((value): value is number => value !== null);
  return available.length ? Math.round(available.reduce((sum, value) => sum + value, 0) / available.length) : null;
}
