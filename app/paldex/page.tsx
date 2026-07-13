import type { Metadata } from "next";
import ToolShell, { DataNotice } from "../components/tool-shell";
import { siteUrl } from "../site-config";
import PaldexClient from "./paldex-client";

export const metadata: Metadata = {
  title: "Palworld Paldeck Database (1.0) | Field Guide",
  description: "Search the Palworld Paldeck database for version 1.0. Filter 289 Pals by work suitability and compare current breeding power values in one current index.",
  alternates: { canonical: "/paldex" },
  openGraph: { title: "Palworld Paldeck Database — Version 1.0", description: "Search 289 current Pals by name, number, work suitability, and breeding power.", url: "/paldex", type: "website" },
};

export default function PaldexPage() {
  const schema = { "@context": "https://schema.org", "@type": "CollectionPage", name: "Palworld Paldeck Database", url: `${siteUrl}/paldex`, description: metadata.description, numberOfItems: 289 };
  return <ToolShell current="/paldex">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <section className="database-hero paldex-hero"><div><p className="database-eyebrow">289 current Pal profiles</p><h1>Palworld Paldeck Database</h1><p>Search the version 1.0 Paldeck by name, number, or work suitability, then open a focused profile for each Pal.</p></div><div className="paldex-stack" aria-hidden="true"><span>001</span><span>140</span><span>204</span></div></section>
    <DataNotice>The Paldeck currently exposes verified 1.0 identity, work suitability, and breeding data. Rebalanced combat-stat fields will be added only after they pass the same validation.</DataNotice>
    <PaldexClient />
    <section className="database-seo-copy"><div><p className="database-eyebrow">Current, not mixed</p><h2>A Palworld database built for 1.0</h2><p>Palworld 1.0 changed Pal numbering, breeding power, and base work levels. This database separates 289 Pals from 11 crossover creatures and lets you filter the twelve work-suitability roles.</p><p>Every result links to an indexable Pal profile, so you can bookmark a worker or move directly into the breeding calculator when planning a route.</p></div><aside><h2>What the fields mean</h2><details open><summary>Paldeck number</summary><p>The current species number. Variant entries use a letter suffix where appropriate.</p></details><details><summary>Work suitability</summary><p>The innate 1.0 work levels recorded for that species before your own upgrades and base effects.</p></details><details><summary>Breeding power</summary><p>A hidden species value used to determine many standard breeding outcomes. It is not a combat rating.</p></details></aside></section>
  </ToolShell>;
}
