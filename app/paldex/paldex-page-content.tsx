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
    description: "Search 289 current Palworld 1.0 Pal profiles by number, name, work suitability, and breeding power.",
    numberOfItems: palCounts.palForms,
    isPartOf: initialPage > 1 ? { "@type": "CollectionPage", name: "Palworld Paldeck Database", url: `${siteUrl}/paldex` } : undefined,
  };

  return <ToolShell current="/paldex">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <section className="database-hero paldex-hero compact-paldex-hero"><div><p className="database-eyebrow">{palCounts.paldeckNumbers} Paldeck numbers · {palCounts.palForms} Pal forms{initialPage > 1 ? ` · page ${initialPage}` : ""}</p><h1>Palworld Paldeck Database{pageSuffix}</h1><p>Search current Pal profiles by name, number, work suitability, and breeding power.</p></div></section>
    <Suspense fallback={<div className="database-workspace paldex-workspace" aria-busy="true" />}><PaldexClient initialPage={initialPage} /></Suspense>
    <section className="database-seo-copy"><div><p className="database-eyebrow">Current, not mixed</p><h2>A Palworld database built for 1.0</h2><p>Palworld 1.0 changed Pal numbering, breeding power, and base work levels. This database separates 289 Pals from 11 crossover creatures and lets you filter the twelve work-suitability roles.</p><p>Every result links to an indexable Pal profile, so you can bookmark a worker or move directly into the breeding calculator when planning a route.</p></div><aside><h2>What the fields mean</h2><details open><summary>Paldeck number</summary><p>The current species number. Variant entries use a letter suffix where appropriate.</p></details><details><summary>Work suitability</summary><p>The innate 1.0 work levels recorded for that species before your own upgrades and base effects.</p></details><details><summary>Breeding power</summary><p>A hidden species value used to determine many standard breeding outcomes. It is not a combat rating.</p></details></aside></section>
  </ToolShell>;
}
