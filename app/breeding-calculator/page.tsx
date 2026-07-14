import type { Metadata } from "next";
import ToolShell, { DataNotice } from "../components/tool-shell";
import { siteUrl } from "../site-config";
import BreedingClient from "./breeding-client";

export const metadata: Metadata = {
  title: "Palworld Breeding Calculator (1.0) | Field Guide",
  description: "Use the Palworld breeding calculator for version 1.0. Pick two parents to find the child or choose a target Pal to reveal matching parent pairs online.",
  keywords: ["palworld breeding calculator"],
  alternates: { canonical: "/breeding-calculator" },
  openGraph: { title: "Palworld Breeding Calculator — Updated for 1.0", description: "Calculate parent-to-child results and reverse-search parent pairs using current Palworld 1.0 data.", url: "/breeding-calculator", type: "website" },
};

const faqs = [
  ["Is this Palworld breeding calculator updated for 1.0?", "Yes. The calculator uses a community dataset extracted from the 1.0 game files and refreshed after the July 10, 2026 release."],
  ["How do I find parents for a specific Pal?", "Switch to Target → Parents, select the Pal you want, and the calculator will scan the current breeding matrix for matching parent pairs."],
  ["Why did my old breeding combination change?", "Palworld 1.0 reworked breeding power values and special combinations. A pair that worked during Early Access may now produce a different child."],
];

export default function BreedingCalculatorPage() {
  const schema = { "@context": "https://schema.org", "@type": "WebApplication", name: "Palworld Breeding Calculator", url: `${siteUrl}/breeding-calculator`, applicationCategory: "GameApplication", operatingSystem: "Any", description: metadata.description, isAccessibleForFree: true };
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) };
  return <ToolShell current="/breeding-calculator">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    <section className="database-hero breeding-hero"><div><p className="database-eyebrow">Updated for version 1.0</p><h1>Palworld Breeding Calculator</h1><p>Choose two parent Pals to calculate their child, or begin with the Pal you want and find possible parent pairs.</p></div><div className="egg-visual" aria-hidden="true"><span /><i>?</i></div></section>
    <DataNotice>Current snapshot: 289 Pals, 11 crossover creatures, and the complete Palworld 1.0 breeding matrix. Last cross-checked July 14, 2026.</DataNotice>
    <BreedingClient />
    <section className="database-seo-copy"><div><p className="database-eyebrow">How it works</p><h2>Plan a Palworld 1.0 breeding route</h2><p>The calculator reads the current result for every parent pair. Use Parents → Child when you already own two candidates. Use Target → Parents when you are planning backward from a Pal such as Sekhmet, Anubis, or Jetragon.</p><p>Breeding outcomes are species-level results. Passive skills, gender, Potential values, mutations, and inherited traits still depend on the parents and the game&apos;s normal breeding rules.</p></div><aside><h2>Breeding calculator FAQ</h2>{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</aside></section>
  </ToolShell>;
}
