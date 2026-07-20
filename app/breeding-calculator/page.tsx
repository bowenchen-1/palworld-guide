import type { Metadata } from "next";
import BreedingResultsPage from "./breeding-results-page";

export const metadata: Metadata = {
  title: "Breeding Parents | Palworld Breeding Calculator",
  description: "Find verified parent combinations for a target Pal in the Palworld 1.0 breeding matrix.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/breeding-calculator", languages: { en: "https://www.palworldguide.net/breeding-calculator", zh: "https://www.palworldguide.net/zh/breeding-calculator", "x-default": "https://www.palworldguide.net/breeding-calculator" } },
};

export default function BreedingCalculatorPage() {
  return <BreedingResultsPage />;
}
