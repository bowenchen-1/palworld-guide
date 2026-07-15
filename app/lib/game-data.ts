import palRecords from "../../public/data/pals.json";

export type WorkKey =
  | "emitflame"
  | "watering"
  | "seeding"
  | "generateelectricity"
  | "handcraft"
  | "collection"
  | "deforest"
  | "mining"
  | "productmedicine"
  | "cool"
  | "transport"
  | "monsterfarm";

export type PalData = {
  id: string;
  number: string;
  name: string;
  slug: string;
  kind: "pal" | "monster";
  power: number;
  work: Partial<Record<WorkKey, number>>;
  elements: string[];
  stats: { hp: number | null; meleeAttack: number | null; rangedAttack: number | null; defense: number | null; support: number | null; craftSpeed: number | null; stamina: number | null };
  rarity: number | null;
  price: number | null;
  foodConsumption: number | null;
  movement: { slowWalk: number | null; walk: number | null; run: number | null; rideSprint: number | null };
  nocturnal: boolean | null;
  partnerSkill: { name: string | null; description: string | null };
  activeSkills: string[] | null;
  drops: string[] | null;
  ranchProduct: string[] | null;
};

export type BreedingData = Record<string, Record<string, string>>;

export const pals = palRecords as PalData[];
export const playablePals = pals.filter((pal) => pal.kind === "pal");

export const workLabels: Record<WorkKey, string> = {
  emitflame: "Kindling",
  watering: "Watering",
  seeding: "Planting",
  generateelectricity: "Electricity",
  handcraft: "Handiwork",
  collection: "Gathering",
  deforest: "Lumbering",
  mining: "Mining",
  productmedicine: "Medicine",
  cool: "Cooling",
  transport: "Transporting",
  monsterfarm: "Farming",
};

export const workGlyphs: Record<WorkKey, string> = {
  emitflame: "✦",
  watering: "≈",
  seeding: "❧",
  generateelectricity: "ϟ",
  handcraft: "✋",
  collection: "⌁",
  deforest: "♜",
  mining: "◆",
  productmedicine: "+",
  cool: "❄",
  transport: "➜",
  monsterfarm: "◌",
};

export const toolLinks = [
  { href: "/", label: "Breeding", full: "Palworld Breeding Calculator", icon: "◉" },
  { href: "/paldex", label: "Paldeck", full: "Palworld Paldeck Database", icon: "✦" },
  { href: "/palworld-1-0", label: "1.0 Hub", full: "Palworld 1.0 Guide", icon: "1.0" },
];

export function palAccent(pal: Pick<PalData, "name" | "work">) {
  const palette = ["#ff7b70", "#e6a94d", "#56b993", "#55a9ce", "#786fbe", "#d86b9e"];
  const total = [...pal.name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return palette[total % palette.length];
}

export function palInitials(name: string) {
  return name.split(/\s+/).map((word) => word[0]).join("").slice(0, 2).toUpperCase();
}

export function findPal(slug: string) {
  return pals.find((pal) => pal.slug === slug);
}
