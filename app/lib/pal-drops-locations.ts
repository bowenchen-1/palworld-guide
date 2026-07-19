import sourceData from "../../public/data/pal-drops-locations.json";

export type PalDrop = {
  name: string;
  quantity?: string;
  chance?: string;
  condition?: string;
  sourceName?: string;
};

export type PalLocation = {
  name: string;
  level?: string;
  note?: string;
  sourceName?: string;
};

export type PalDropsLocations = {
  palSlug: string;
  drops: PalDrop[];
  locations: PalLocation[];
};

export const palDropsLocations = sourceData as PalDropsLocations[];
const bySlug = new Map(palDropsLocations.map((record) => [record.palSlug, record]));

export function findPalDropsLocations(slug: string): PalDropsLocations | undefined {
  return bySlug.get(slug);
}
