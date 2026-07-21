export type MapLocation = {
  id: string;
  name: string;
  category: string;
  categoryKey: string;
  level?: string;
  description?: string;
  x: number;
  y: number;
  href?: string;
  icon?: string;
};

export type MapCategory = { name: string; icon: string };

export const mapAsset = "/map/Palworld_Map_Complete.png";
export const mapDataUrl = "/data/map-locations.json";
export const mapCoordinateNote = "PalDB map coordinates: original in-game X/Y values mapped with PalDB's 459-units-per-map-pixel transform.";
