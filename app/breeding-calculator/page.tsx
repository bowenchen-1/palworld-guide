import type { Metadata } from "next";
import BreedingResultsPage from "./breeding-results-page";

type SearchParams = Record<string, string | string[] | undefined>;

export const metadata: Metadata = {
  title: "Breeding Parents | Palworld Breeding Calculator",
  description: "Find verified parent combinations for a target Pal in the Palworld 1.0 breeding matrix.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/breeding-calculator" },
};

export default async function BreedingCalculatorPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const value = (key: string) => Array.isArray(params[key]) ? params[key]?.[0] : params[key];
  return <BreedingResultsPage targetSlug={value("target")} parentSlug={value("parent")} />;
}
