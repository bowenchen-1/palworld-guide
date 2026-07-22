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
export const mapCoordinateNote = "PalDB map coordinates: X/Y values mapped to the supplied 8192 x 8192 Palpagos tile set using the PalDB map-frame scale, origin, and vertical inversion.";
