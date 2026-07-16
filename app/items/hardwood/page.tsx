import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../../components/site-header";
import { absoluteUrl, createBreadcrumbSchema } from "../../lib/seo";

const title = "Palworld Hardwood Locations – Where & How to Get Hardwood";
const description = "Discover Palworld Hardwood locations, where and how to get Hardwood, which trees to cut, farming methods, recommended tools, and crafting uses.";

export const metadata: Metadata = {
  title,
  description,
  robots: { index: true, follow: true },
  alternates: { canonical: absoluteUrl("/items/hardwood") },
  keywords: [
    "palworld hardwood",
    "palworld hardwood location",
    "where to get hardwood palworld",
    "how to get hardwood palworld",
    "palworld hardwood farm",
    "palworld 1.0 hardwood",
  ],
  openGraph: { title, description, url: absoluteUrl("/items/hardwood"), siteName: "Palworld Guide", locale: "en_US", type: "website", images: [{ url: absoluteUrl("/og.png"), width: 1734, height: 907, alt: title }] },
};

const sources = [
  { name: "Palworld Wiki (wiki.gg)", href: "https://palworld.wiki.gg/wiki/Hardwood", note: "Item description, acquisition methods, enemy drops and Logging Site II." },
  { name: "PC Gamer", href: "https://www.pcgamer.com/games/survival-crafting/palworld-hardwood/", note: "Twilight Dunes and Sakurajima route overview." },
  { name: "VGC", href: "https://www.videogameschronicle.com/guide/palworld-hardwood-location/", note: "Sakurajima grove context and 1.0 farming risk." },
];

const breadcrumbSchema = createBreadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Hardwood", path: "/items/hardwood" },
]);

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: title,
  headline: "Where and How to Get Hardwood in Palworld",
  description,
  url: absoluteUrl("/items/hardwood"),
  isAccessibleForFree: true,
  inLanguage: "en",
};

export default function HardwoodPage() {
  return (
    <main id="main-content" className="hardwood-page min-h-screen bg-canvas text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="hardwood-nav"><SiteHeader /></div>

      <div className="hardwood-wrap">
        <nav className="hardwood-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">›</span><span>Hardwood</span></nav>

        <section className="hardwood-quick-answer" aria-labelledby="quick-answer-title">
          <div className="hardwood-quick-copy">
            <p className="hardwood-kicker">Resource field note · Palworld 1.0</p>
            <h1>Where and How to Get Hardwood in Palworld</h1>
            <p className="hardwood-answer-lead">Look for the sturdier, biome-specific trees in <strong>Twilight Dunes</strong> or the broad sakura groves on <strong>Sakurajima</strong>. Chop those trees with a logging tool, or let a base Pal with <strong>Lumbering</strong> handle them. Sakurajima has more trees but is a high-level area; Twilight Dunes is easier to reach and more limited.</p>
            <div className="hardwood-actions"><a className="hardwood-button" href="#locations">See locations ↓</a><a className="hardwood-text-link" href="#how-to-get">Jump to farming steps</a></div>
          </div>
          <div className="hardwood-mark" aria-label="Hardwood material icon"><span className="hardwood-ring" /><span className="hardwood-log">▰</span><small>HARDWOOD<br /><b>MATERIAL</b></small></div>
        </section>

        <section className="hardwood-summary-grid" aria-labelledby="quick-answer-title">
          <article><span className="hardwood-stat-label">Item type</span><strong>Material</strong><p>1.0 resource, rarer than ordinary Wood.</p></article>
          <article><span className="hardwood-stat-label">Primary target</span><strong>Sturdy trees</strong><p>Biome-specific trees in harsher regions.</p></article>
          <article><span className="hardwood-stat-label">Automation</span><strong>Logging Site II</strong><p>Available as a later base-production route.</p></article>
        </section>

        <section id="locations" className="hardwood-section hardwood-location-section scroll-mt-8">
          <div className="hardwood-section-heading"><p className="hardwood-kicker">01 · Locations</p><h2>Where to find Hardwood</h2><p>Start with the route that matches your progression. The two locations below are the clearest confirmed gathering areas in current 1.0 guides.</p></div>
          <div className="hardwood-location-grid">
            <article className="hardwood-location-card hardwood-location-early"><div className="hardwood-location-top"><span className="hardwood-location-number">A</span><span className="hardwood-tag">Earlier access</span></div><h3>Twilight Dunes</h3><p>Search the desert’s sturdier trees. This is a practical first stop for a fresh 1.0 save, but the supply is more limited than the sakura groves.</p><div className="hardwood-location-meta"><span>Northwest of the starting island</span><span>Desert hazards</span></div></article>
            <article className="hardwood-location-card hardwood-location-late"><div className="hardwood-location-top"><span className="hardwood-location-number">B</span><span className="hardwood-tag hardwood-tag-gold">Larger groves</span></div><h3>Sakurajima</h3><p>Look around the sakura trees near the Moonflower Tower area. The groves are widespread and suited to a larger manual run or a dedicated base.</p><div className="hardwood-location-meta"><span>High-level island</span><span>Moonflower Tower vicinity</span></div></article>
          </div>
          <div className="hardwood-caution"><b>Route check</b><span>High-level Pals and enemy bases make Sakurajima a poor first trip if you are not ready for its fights. Exact tree counts, respawn timers and a single “best” coordinate are not shown because current sources do not agree on them.</span></div>
        </section>

        <section className="hardwood-section" id="recognize"><div className="hardwood-two-col"><div><p className="hardwood-kicker">02 · Target</p><h2>Recognize the right trees</h2></div><div><p className="hardwood-body-large">Hardwood does not come from every starter-area tree. The reliable visual clue is the setting: look for the tougher trees that belong to the desert, sakura and other harsher biomes rather than the ordinary Wood trees around the opening hills.</p><div className="hardwood-check-list"><div><span>✓</span><p><b>Harvest the sturdy tree model</b><br />If a tree only gives regular Wood, move on to the biome-specific trees.</p></div><div><span>✓</span><p><b>Bring a Pal with Lumbering</b><br />A worker Pal can gather when assigned to the base’s logging production.</p></div></div></div></div></section>

        <section className="hardwood-section" id="how-to-get"><div className="hardwood-two-col"><div><p className="hardwood-kicker">03 · Method</p><h2>How to get Hardwood</h2></div><div className="hardwood-step-list"><div><span>01</span><div><h3>Travel to a confirmed biome</h3><p>Use Twilight Dunes for the earlier route, or travel to Sakurajima once your party can handle the island.</p></div></div><div><span>02</span><div><h3>Chop the sturdy trees</h3><p>Use the logging tool you already carry and collect the drops. The exact yield varies by tree and is intentionally not promised here.</p></div></div><div><span>03</span><div><h3>Switch to base production</h3><p>Once unlocked, Logging Site II provides a repeatable production route; assign a Pal with Lumbering and keep transport covered.</p></div></div></div></div></section>

        <section className="hardwood-section hardwood-uses-section" id="uses"><div className="hardwood-two-col"><div><p className="hardwood-kicker">04 · Uses</p><h2>What Hardwood is for</h2></div><div><p className="hardwood-body-large">Hardwood is the higher-tier wood material introduced with Palworld 1.0. It appears in later technology and base-building progression, where ordinary Wood is no longer enough.</p><div className="hardwood-use-note"><span>◆</span><p><b>Recipe note</b><br />The current public references do not agree on a complete recipe list, so this page does not invent item names or quantities. Check the in-game Technology and build menus for the exact requirement on your world version.</p></div></div></div></section>

        <section className="hardwood-section" id="tips"><div className="hardwood-two-col"><div><p className="hardwood-kicker">05 · Farming tips</p><h2>Make the gathering loop smoother</h2></div><ul className="hardwood-tip-list"><li><b>Carry space matters.</b> Hardwood is heavy enough to make a long run feel worse when your inventory is full; return to storage before the route becomes a weight problem.</li><li><b>Separate risk from volume.</b> Twilight Dunes is the safer early target, while Sakurajima is the larger-grove option once your party and travel gear are ready.</li><li><b>Automate the repeat.</b> If you need a steady supply for building, Logging Site II is more consistent than repeatedly clearing wild trees.</li></ul></div></section>

        <section className="hardwood-section hardwood-sources" id="sources"><div className="hardwood-section-heading"><p className="hardwood-kicker">Research notes</p><h2>Sources used for this page</h2><p>We compared the current 1.0 item reference with two independent location guides. The page keeps only claims that can be stated without guessing.</p></div><div className="hardwood-source-grid">{sources.map((source) => <a key={source.href} href={source.href} target="_blank" rel="noreferrer"><strong>{source.name} ↗</strong><span>{source.note}</span></a>)}</div></section>
      </div>
      <footer className="hardwood-footer">Independent fan-made resource · Palworld is a trademark of its respective owner.</footer>
    </main>
  );
}
