import { createPageMetadata } from "../lib/seo";
import PaldexPageContent from "./paldex-page-content";

export const metadata = createPageMetadata({
  title: "Palworld Pals Database | All Pals & 1.0 New Pals",
  description: "Browse all 299 Palworld Pals with detailed profiles, elements, work suitability, breeding data, filters, and 72 new Pals and variants from Palworld 1.0.",
  keywords: ["palworld pals", "palworld all pals", "palworld new pals", "palworld 1.0 new pals"],
  path: "/paldex",
});

export default function PaldexPage() {
  return <PaldexPageContent />;
}
