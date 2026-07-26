import type { Metadata } from "next";
import { createPageMetadata } from "../lib/seo";
import PaldexPageContent from "../paldex/paldex-page-content";
import { serializeInitialPaldexQuery, type PaldexSearchParams } from "../paldex/paldex-search-params";

export const metadata: Metadata = createPageMetadata({
  title: "All 299 Palworld Pals — Complete Pal List",
  description: "Browse all 299 Palworld Pals in our complete pal list. Filter by element, work suitability, partner skill, stats, and breeding data to find any Pal quickly.",
  keywords: ["palworld pals", "palworld all pals", "palworld new pals", "palworld 1.0 new pals"],
  path: "/pals",
});

export default async function PalsPage({ searchParams }: { searchParams: Promise<PaldexSearchParams> }) {
  return <PaldexPageContent initialQuery={serializeInitialPaldexQuery(await searchParams)} />;
}
