import type { Metadata } from "next";
import { createPageMetadata } from "../lib/seo";
import PaldexPageContent from "../paldex/paldex-page-content";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const hasFilters = Object.keys(await searchParams).length > 0;
  return {
    ...createPageMetadata({
      title: "Palworld Pals Database | All Pals & 1.0 New Pals",
      description: "Browse all 299 Palworld Pals with detailed profiles, elements, work suitability, breeding data, filters, and 72 new Pals and variants from Palworld 1.0.",
      keywords: ["palworld pals", "palworld all pals", "palworld new pals", "palworld 1.0 new pals"],
      path: "/pals",
    }),
    ...(hasFilters ? { robots: { index: false, follow: true } } : {}),
  };
}

export default function PalsPage() {
  return <PaldexPageContent />;
}
