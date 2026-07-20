import type { Metadata } from "next";
import { createPageMetadata } from "../lib/seo";
import PaldexPageContent from "../paldex/paldex-page-content";

export const metadata: Metadata = createPageMetadata({
  title: "Palworld Pals - Complete Pal List (All 299 Pals)",
  description: "Browse all 299 Palworld Pals in our complete pal list. Filter by element, work suitability, partner skill, stats, and breeding data to find any Pal quickly.",
  keywords: ["palworld pals", "palworld all pals", "palworld new pals", "palworld 1.0 new pals"],
  path: "/pals",
});

export default function PalsPage() {
  return <PaldexPageContent />;
}
