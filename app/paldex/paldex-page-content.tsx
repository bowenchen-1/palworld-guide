import ToolShell from "../components/tool-shell";
import { Suspense } from "react";
import { siteUrl } from "../site-config";
import { palCounts } from "../lib/game-data";
import PaldexClient from "./paldex-client";

export default function PaldexPageContent({ initialPage = 1 }: { initialPage?: number }) {
  const isMainPage = initialPage === 1;
  const pageSuffix = initialPage > 1 ? ` — Page ${initialPage}` : "";
  const pagePath = initialPage > 1 ? `/pals/page/${initialPage}` : "/pals";
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: isMainPage ? "Palworld Pals - Complete Pal List (All 299 Pals)" : `Palworld Paldeck Database${pageSuffix}`,
    url: `${siteUrl}${pagePath}`,
    description: isMainPage ? "Browse all 299 Palworld Pals in our complete pal list. Filter by element, work suitability, partner skill, stats, and breeding data to find any Pal quickly." : "Browse all 299 Palworld Pals with detailed profiles, elements, work suitability, breeding data, filters, and 72 new Pals and variants from Palworld 1.0.",
    numberOfItems: palCounts.pals,
    isPartOf: initialPage > 1 ? { "@type": "CollectionPage", name: "Palworld Pals Database", url: `${siteUrl}/pals` } : undefined,
  };

  return <ToolShell current="/pals" breadcrumb={[{ name: "Home", path: "/" }, { name: "Pals", path: pagePath }]}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <section className="database-hero paldex-hero compact-paldex-hero"><div><p className="database-eyebrow">{palCounts.pals} current Pals{initialPage > 1 ? ` · page ${initialPage}` : ""}</p><h1>{isMainPage ? "All Palworld Pals: Complete Pal List" : "Palworld Pals Database"}</h1><p>Browse all Palworld Pals by name, Paldeck number, element, work suitability, and breeding data.</p></div></section>
    <Suspense fallback={<div className="database-workspace paldex-workspace" aria-busy="true" />}><PaldexClient initialPage={initialPage} /></Suspense>
    {isMainPage ? <section className="database-seo-copy"><div>
      <h2>Complete Pal List (All 299 Pals)</h2>
      <p>This complete pal list contains {palCounts.pals} current Palworld Pals in one searchable database. Each server-rendered row includes the English name, Paldeck number, Pal elements, work suitability, partner skill, rarity, HP, Breeding Power, Defense, Price, Stamina, Riding Speed, and Run Speed. Select a Pal name to open its profile or continue into the Palworld breeding calculator.</p>
      <p>Real text values remain in the table for indexing while images load. Missing values use a clear dash instead of an invented number, and the shared catalog keeps search, filters, pagination, and profile links aligned at 299 Pals.</p>

      <h2>Pals by Element and Work Suitability</h2>
      <p>Use the Pal elements filter to find Neutral, Fire, Water, Grass, Electric, Ice, Ground, Dark, or Dragon Pals. Select one element or combine several choices with the existing match rules. Work suitability covers Kindling, Watering, Planting, Gathering, Mining, Lumbering, Handiwork, Cooling, Electricity, Medicine, Transporting, and Farming. Where available, choose a minimum work level. These controls work together to narrow all Palworld Pals without losing table rows or detail links.</p>

      <h2>New Pals and Variants in Palworld 1.0</h2>
      <p>The New in 1.0 filter highlights {palCounts.newIn1_0} records from the Palworld 1.0 update inside the same {palCounts.pals}-Pal catalog. That total includes {palCounts.newPals} entirely new Pals and {palCounts.newVariants} newly added variants. A variant remains its own record, image, number, and profile, so it is not counted twice. Turn the filter on to review additions, then clear it to return to the complete pal list.</p>

      <h2>How to Use This Pal List</h2>
      <p>Start with the search field and use the controls in the order that suits your question:</p>
      <ol>
        <li>Search by an English Pal name or Paldeck number to jump directly to a known record.</li>
        <li>Choose one or more Pal elements to compare elemental groups.</li>
        <li>Choose work suitability and, when useful, a minimum work level to narrow base roles.</li>
        <li>Click New in 1.0 to show the 72 update records, including both new Pals and variants.</li>
        <li>Use the sortable table values to compare partner skills, Pal stats, movement values, rarity, and breeding data.</li>
        <li>Open any Pal row for its profile, then use the available breeding calculator entry when you want to explore parent combinations.</li>
      </ol>
      <p>Search, filtering, sorting, and pagination preserve their URL state for refreshes and sharing. This page indexes current Pal records and profile data; it does not claim to cover Pal locations or capture areas.</p>
    </div></section> : <section className="database-seo-copy"><div><p className="database-eyebrow">Current, not mixed</p><h2>A Palworld database built for 1.0</h2><p>This database contains {palCounts.pals} current Palworld Pals. Open any result for its elements, work suitability, partner skill, combat and movement stats, breeding power, and other profile data.</p><p>Use the element and work-suitability icons to narrow the list, then turn on <strong>New in 1.0</strong> to find the {palCounts.newIn1_0} additions: {palCounts.newPals} entirely new Pals and {palCounts.newVariants} new variants.</p></div><aside><h2>How to use this Paldeck</h2><details open><summary>Search and filter</summary><p>Search by English name or Paldeck number, or combine element and work-suitability filters to compare practical choices.</p></details><details><summary>New in 1.0</summary><p>The New filter keeps the catalog at {palCounts.pals} total Pals while showing the {palCounts.newIn1_0} records introduced in Palworld 1.0.</p></details></aside></section>}
  </ToolShell>;
}
