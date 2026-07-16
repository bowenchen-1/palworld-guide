import { createPageMetadata } from "../lib/seo";
import { palCounts } from "../lib/game-data";
import PaldexPageContent from "./paldex-page-content";

export const metadata = createPageMetadata({
  title: "Palworld Paldeck Database (1.0) | Breeding Data",
  description: `Search the Palworld Paldeck database for version 1.0. Filter ${palCounts.pals} Pals by name, number, element, work suitability, and breeding power, then open profiles.`,
  keywords: ["palworld paldeck"],
  path: "/paldex",
});

export default function PaldexPage() {
  return <PaldexPageContent />;
}
