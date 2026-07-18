import type { Metadata } from "next";
import { createPageMetadata } from "../lib/seo";
import { catalogPals } from "../lib/game-data";
import { selectPalsBySlugs } from "../lib/paldex";
import PaldexPageContent from "../paldex/paldex-page-content";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const query = await searchParams;
  const ids = selectPalsBySlugs(query.ids, catalogPals);
  const hasFilters = Object.keys(query).some((key) => key !== "ids");
  return {
    ...createPageMetadata({
      title: "Palworld Pals - Complete Pal List (All 299 Pals)",
      description: "Browse all 299 Palworld Pals in our complete pal list. Filter by element, work suitability, partner skill, stats, and breeding data to find any Pal quickly.",
      keywords: ["palworld pals", "palworld all pals", "palworld new pals", "palworld 1.0 new pals"],
      path: "/pals",
    }),
    ...(hasFilters || ids.length ? { robots: { index: false, follow: true }, alternates: { canonical: "https://www.palworldguide.net/pals" } } : {}),
  };
}

export default function PalsPage() {
  return <PaldexPageContent />;
}
