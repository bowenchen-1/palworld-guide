import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "../../components/site-header";
import { absoluteUrl, createBreadcrumbSchema } from "../../lib/seo";

const title = "Palworld Hardwood Locations – Where & How to Get Hardwood";
const description = "Discover Palworld Hardwood locations, where and how to get Hardwood, which trees to cut, farming methods, recommended tools, and crafting uses.";

export const metadata: Metadata = {
  title, description, robots: { index: true, follow: true }, alternates: { canonical: absoluteUrl("/items/hardwood") },
  keywords: ["palworld hardwood", "palworld hardwood location", "where to get hardwood palworld", "how to get hardwood palworld", "palworld hardwood farm", "palworld 1.0 hardwood"],
  openGraph: { title, description, url: absoluteUrl("/items/hardwood"), siteName: "Palworld Guide", locale: "en_US", type: "website", images: [{ url: absoluteUrl("/items/hardwood/feybreak-region-map.png"), width: 1254, height: 1254, alt: "Feybreak region map with approximate Hardwood tree clusters" }] },
};

const breadcrumbSchema = createBreadcrumbSchema([{ name: "Home", path: "/" }, { name: "Hardwood", path: "/items/hardwood" }]);
const pageSchema = { "@context": "https://schema.org", "@type": "WebPage", name: title, headline: "Where and How to Get Hardwood in Palworld", description, url: absoluteUrl("/items/hardwood"), isAccessibleForFree: true, inLanguage: "en" };

const locations = [
  { name: "Twilight Dunes", label: "EARLIER ACCESS", best: "First Hardwood run", travel: "Anubis Dunes", why: "Spiky desert trees are easy to spot.", caution: "Bring heat protection." },
  { name: "Sakurajima", label: "LARGER GROVES", best: "Bulk hand-farm", travel: "Moonflower Tower Entrance", why: "Dense pink Sakura groves.", caution: "Level 40–55 enemies." },
];

const faqs = [
  ["Where is the easiest Hardwood route?", "Twilight Dunes is the earlier-access route; target the twisting, spiky-leafed trees."],
  ["What do the correct trees look like?", "Sakurajima uses pink Sakura trees with red or white trunks; Twilight Dunes uses sturdy, spiky desert trees."],
  ["Do I need a special axe?", "No special axe is required. A Metal Axe is the practical baseline for the tougher trees."],
  ["Can I automate Hardwood?", "Yes. Logging Site II can produce it with a Pal that has Lumbering."],
];

export default function HardwoodPage() {
  return <main id="main-content" className="hardwood-page min-h-screen bg-canvas text-foreground">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <div className="hardwood-nav"><SiteHeader /></div>
    <div className="hardwood-wrap">
      <nav className="hardwood-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">›</span><span>Hardwood</span></nav>

      <section className="hardwood-quick-answer hardwood-visual-hero">
        <div className="hardwood-quick-copy"><p className="hardwood-kicker">Resource field note · Palworld 1.0</p><h1>Where and How to Get Hardwood in Palworld</h1><p className="hardwood-answer-lead">Chop the sturdy trees in <strong>Twilight Dunes</strong> or <strong>Sakurajima</strong>. Use a Lumbering Pal and Logging Site II when you want a passive supply.</p><div className="hardwood-actions"><a className="hardwood-button" href="#locations">See the map ↓</a><a className="hardwood-text-link" href="#how-to-get">3 quick steps</a></div></div>
        <div className="hardwood-mark" aria-label="Hardwood material icon"><span className="hardwood-ring" /><span className="hardwood-log">▰</span><small>HARDWOOD<br /><b>MATERIAL</b></small></div>
      </section>
      <section className="hardwood-summary-grid"><article><span className="hardwood-stat-label">Target</span><strong>Sturdy trees</strong><p>Not ordinary starter trees.</p></article><article><span className="hardwood-stat-label">Best visual clue</span><strong>Biome tree model</strong><p>Pink Sakura or spiky desert.</p></article><article><span className="hardwood-stat-label">Automation</span><strong>Logging Site II</strong><p>Assign Lumbering.</p></article></section>

      <section id="locations" className="hardwood-section hardwood-location-section scroll-mt-8"><div className="hardwood-section-heading"><p className="hardwood-kicker">01 · Feybreak visual route</p><h2>Hardwood tree areas</h2><p>Use the markers as area references, not exact tree coordinates. Current guides confirm rough/red-leaf Hardwood trees on Feybreak, but do not publish a verified per-tree coordinate list.</p></div><figure className="hardwood-map-frame hardwood-map-annotated"><div className="hardwood-map-image"><Image src="/items/hardwood/feybreak-region-map.png" alt="Feybreak region map with three approximate Hardwood rough-tree cluster markers" width={1254} height={1254} priority /><span className="hardwood-map-marker marker-one"><b>1</b><small>rough-tree<br />cluster</small></span><span className="hardwood-map-marker marker-two"><b>2</b><small>rough-tree<br />cluster</small></span><span className="hardwood-map-marker marker-three"><b>3</b><small>rough-tree<br />cluster</small></span></div><figcaption><strong>Feybreak rough-tree areas · approximate</strong><span>Markers show likely gathering areas on the supplied map; they are not guaranteed individual tree pins.</span></figcaption></figure><div className="hardwood-map-legend"><span><i className="legend-dot" /> Approximate rough-tree area</span><span><i className="legend-island" /> Feybreak island</span></div><div className="hardwood-location-grid">{locations.map((location) => <article className="hardwood-location-card" key={location.name}><div className="hardwood-location-top"><span className="hardwood-location-number">{location.name === "Twilight Dunes" ? "A" : "B"}</span><span className="hardwood-tag">{location.label}</span></div><h3>{location.name}</h3><div className="hardwood-fact-row"><span><b>Best for</b>{location.best}</span><span><b>Fast travel</b>{location.travel}</span><span><b>Why go</b>{location.why}</span></div><p className="hardwood-caution-short">⚠ {location.caution}</p></article>)}</div></section>

      <section className="hardwood-section hardwood-tree-section" id="recognize"><div className="hardwood-section-heading"><p className="hardwood-kicker">02 · Spot the right tree</p><h2>Tree identification</h2><p>Use the image first. The short notes are only there to confirm what you are seeing.</p></div><div className="hardwood-tree-grid"><figure className="hardwood-tree-card"><Image src="/items/hardwood/twilight-grove.webp" alt="Sturdy spiky desert trees in Twilight Dunes used for Hardwood" width={1920} height={1080} /><figcaption><strong>Twilight Dunes</strong><span>Twisting trunks · spiky leaf crowns · sandy biome</span></figcaption></figure><figure className="hardwood-tree-card"><Image src="/items/hardwood/trees-2.jpg" alt="Pink Sakura tree being chopped for Hardwood on Sakurajima" width={480} height={270} /><figcaption><strong>Sakurajima Sakura</strong><span>Pink canopy · red or white trunk · Hardwood drop shown in-game</span></figcaption></figure></div><div className="hardwood-visual-note">If the tree only gives regular Wood, leave it and look for the biome-specific model.</div></section>

      <section className="hardwood-section" id="how-to-get"><div className="hardwood-two-col"><div><p className="hardwood-kicker">03 · Get it</p><h2>Three quick steps</h2></div><div className="hardwood-step-list"><div><span>01</span><div><h3>Pick a route</h3><p>Twilight Dunes first; Sakurajima for larger groves.</p></div></div><div><span>02</span><div><h3>Chop the visual match</h3><p>Use your axe on the sturdy tree model in the images above.</p></div></div><div><span>03</span><div><h3>Automate the repeat</h3><p>Unlock Logging Site II and assign Lumbering.</p></div></div></div></div></section>

      <section className="hardwood-section" id="tips"><div className="hardwood-section-heading"><p className="hardwood-kicker">04 · Farm smarter</p><h2>Three field tips</h2></div><div className="hardwood-tip-cards"><article><span>01</span><h3>Carry space</h3><p>Empty your inventory before a long grove run.</p></article><article><span>02</span><h3>Pick the right route</h3><p>Use Twilight Dunes earlier; save Sakurajima for bulk.</p></article><article><span>03</span><h3>Use base production</h3><p>Let a Lumbering Pal handle repeat supply.</p></article></div></section>

      <section className="hardwood-section hardwood-uses-section" id="uses"><div className="hardwood-section-heading"><p className="hardwood-kicker">05 · Spend it</p><h2>What Hardwood unlocks</h2></div><div className="hardwood-use-cards"><article><span>▰</span><h3>High Quality Wooden Board</h3><p>Core mid/late-game material sink.</p></article><article><span>◎</span><h3>High-tier Pal Spheres</h3><p>Used in later capture progression.</p></article><article><span>⌂</span><h3>Weapons & building</h3><p>Appears across 1.0 weapons and Japanese-style structures.</p></article></div></section>

      <section className="hardwood-section hardwood-faq" id="faq"><div className="hardwood-two-col"><div><p className="hardwood-kicker">Quick answers</p><h2>Hardwood FAQ</h2></div><div className="hardwood-faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></div></section>

      <section className="hardwood-section hardwood-sources" id="sources"><div className="hardwood-section-heading"><p className="hardwood-kicker">Research notes</p><h2>Image & fact sources</h2></div><div className="hardwood-source-grid"><a href="https://drawpie.com/blog/palworld-1-0-hardwood-guide/" target="_blank" rel="noreferrer"><strong>Drawpie ↗</strong><span>Location map and 1.0 source comparison.</span></a><a href="https://games.gg/news/palworld-hardwood-locations/" target="_blank" rel="noreferrer"><strong>GAMES.GG ↗</strong><span>Twilight Dunes tree visual and route facts.</span></a><a href="https://www.jeuxvideo.com/news/2093310/bois-robuste-palworld-ou-le-trouver-et-a-quoi-sert-il.htm" target="_blank" rel="noreferrer"><strong>Jeuxvideo.com ↗</strong><span>Sakurajima tree screenshots and Hardwood context.</span></a></div></section>
    </div>
    <footer className="hardwood-footer">Independent fan-made resource · Palworld is a trademark of its respective owner.</footer>
  </main>;
}
