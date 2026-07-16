import ToolShell from "../components/tool-shell";
import { Suspense } from "react";
import { siteUrl } from "../site-config";
import { palCounts } from "../lib/game-data";
import PaldexClient from "./paldex-client";

export default function PaldexPageContent({ initialPage = 1 }: { initialPage?: number }) {
  const pageSuffix = initialPage > 1 ? ` — Page ${initialPage}` : "";
  const pagePath = initialPage > 1 ? `/paldex/page/${initialPage}` : "/paldex";
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Palworld Paldeck Database${pageSuffix}`,
    url: `${siteUrl}${pagePath}`,
    description: "Browse all 299 Palworld Pals with detailed profiles, elements, work suitability, breeding data, filters, and 72 new Pals and variants from Palworld 1.0.",
    numberOfItems: palCounts.pals,
    isPartOf: initialPage > 1 ? { "@type": "CollectionPage", name: "Palworld Paldeck Database", url: `${siteUrl}/paldex` } : undefined,
  };

  return <ToolShell current="/paldex" breadcrumb={[{ name: "Home", path: "/" }, { name: "Paldeck", path: pagePath }]}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <section className="database-hero paldex-hero compact-paldex-hero"><div><p className="database-eyebrow">{palCounts.pals} current Pals{initialPage > 1 ? ` · page ${initialPage}` : ""}</p><h1>Palworld Pals Database</h1><p>Browse all Palworld Pals by name, Paldeck number, element, work suitability, and breeding data.</p></div></section>
    <Suspense fallback={<div className="database-workspace paldex-workspace" aria-busy="true" />}><PaldexClient initialPage={initialPage} /></Suspense>
    <section className="database-seo-copy"><div><p className="database-eyebrow">Current, not mixed</p><h2>A Palworld database built for 1.0</h2><p>This database contains {palCounts.pals} current Palworld Pals. Open any result for its elements, work suitability, partner skill, combat and movement stats, breeding power, drops, and other profile data.</p><p>Use the element and work-suitability icons to narrow the list, then turn on <strong>New in 1.0</strong> to find the {palCounts.newIn1_0} additions: {palCounts.newPals} entirely new Pals and {palCounts.newVariants} new variants. Every result links to an indexable Pal profile and the breeding calculator.</p></div><aside><h2>How to use this Paldeck</h2><details open><summary>Search and filter</summary><p>Search by English name or Paldeck number, or combine element and work-suitability filters to compare practical choices.</p></details><details><summary>New in 1.0</summary><p>The New filter keeps the catalog at {palCounts.pals} total Pals while showing the {palCounts.newIn1_0} records introduced in Palworld 1.0.</p></details><details><summary>Breeding power</summary><p>A hidden species value used to determine many standard breeding outcomes. It is not a combat rating.</p></details></aside></section>
  </ToolShell>;
}
