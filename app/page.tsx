import Link from "next/link";
import Image from "next/image";
import PalMark from "./components/pal-mark";
import SiteHeader from "./components/site-header";
import ToolLab from "./components/tool-lab";
import BreedingClient from "./breeding-calculator/breeding-client";
import { guides } from "./guides/guide-data";
import { catalogPals, palCounts, WorkKey, workGlyphs, workLabels } from "./lib/game-data";
import { createPageMetadata } from "./lib/seo";
import { siteUrl } from "./site-config";

export const metadata = createPageMetadata({
  title: "Palworld Breeding Calculator - Updated 1.0 Pal Combos",
  description: "Use the Palworld breeding calculator for version 1.0 to find offspring from two parents or discover every combination for a target Pal. Start planning now.",
  keywords: [
    "palworld breeding calculator",
    "Palworld Breeding Calculator 1.0",
    "palworld 1.0 breeding calculator",
    "breeding calculator palworld",
    "breeding calculator palworld 1.0",
    "palworld calculator breeding",
  ],
  path: "/",
});

const popularStyles = [
  { color: "bg-primary-700", accent: "from-surface-muted to-primary-700", image: "/pals/2.0.webp" },
  { color: "bg-secondary-600", accent: "from-[#bfe8de] to-secondary-700", image: "/pals/22.0.webp" },
  { color: "bg-secondary-800", accent: "from-[#b9e4e2] to-secondary-600", image: "/pals/33.0.webp" },
  { color: "bg-primary-900", accent: "from-[#dbe9d8] to-primary-700", image: "/pals/18.0.webp" },
  { color: "bg-danger", accent: "from-[#f7d8cf] to-danger", image: "/pals/29.0.webp" },
  { color: "bg-secondary-700", accent: "from-[#c2e4df] to-secondary-800", image: "/pals/185.0.webp" },
];

const faqs = [
  { question: "What does this breeding calculator do?", answer: "Choose two parents, work backward from a target, explore one parent's offspring, check what your available species can produce, or calculate a shortest Palworld breeding route." },
  { question: "Is this calculator updated for Palworld 1.0?", answer: "Yes. This Palworld calculator uses the current 300-record breeding matrix prepared for version 1.0 and the 299-Pal visible catalog." },
  { question: "How do I find parents for a specific Pal?", answer: "Use Target → Parents at the top of this page, then choose your target Pal to see every direct parent pair." },
  { question: "How do Owned Pals and the two route modes differ?", answer: "What Can I Breed Now lists immediate children from your available species. Available Pals → Target limits partners to that same saved roster, while Shortest Route can use any Pal as a theoretical partner." },
  { question: "Why did an old Palworld breeding combination change?", answer: "Palworld 1.0 revised breeding values and combinations, so routes remembered from Early Access may now produce a different offspring." },
  { question: "Does the calculator predict passive skills or mutations?", answer: "No. It identifies the offspring species and parent combinations. Passive skills, mutations, gender, and individual stats still follow the in-game breeding rules." },
];

const popularGuides = guides.slice(0, 6);
const popularNames = ["Sekhmet", "Anubis", "Jetragon", "Shadowbeak", "Orserk", "Bastigor", "Aegidron", "Lyleen"];
const popularPals = popularNames.map((name) => catalogPals.find((pal) => pal.name === name)).filter((pal) => pal !== undefined);
const standardPalCount = palCounts.standardPals;
const crossoverCreatureCount = palCounts.crossoverCreatures;
const totalPalEntryCount = palCounts.pals;

export default function Home() {
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) };
  const appSchema = { "@context": "https://schema.org", "@type": "WebApplication", name: "Palworld Breeding Calculator", url: siteUrl, applicationCategory: "GameApplication", operatingSystem: "Any", description: metadata.description, isAccessibleForFree: true };
  return <main id="main-content" className="min-h-screen overflow-hidden bg-canvas text-foreground">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />

    <section id="breeding-calculator" className="home-calculator-top px-5 pb-12 sm:px-8 lg:px-12"><div className="mx-auto max-w-[1320px]"><SiteHeader floating /><div className="home-calculator-intro"><div><p className="terminal-kicker"><span /> Field Research // Updated for Palworld 1.0</p><h1>Palworld Breeding Calculator</h1><p>Use this Palworld breeding calculator to find offspring, reverse-search parents, and plan routes from your available Pal species with the current 1.0 breeding matrix.</p></div><div className="home-hero-stats" aria-label="Calculator data status"><p><strong>1.0</strong><span>Data version</span></p><p><strong>{totalPalEntryCount}</strong><span>Pals indexed</span></p></div></div><BreedingClient embedded /></div></section>

    <section className="home-paldex-feature px-5 py-20 sm:px-8 lg:px-12"><div className="mx-auto grid max-w-[1260px] gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center"><div><p className="eyebrow">Pals database</p><h2 className="section-title mt-3">Find the Palworld Pal behind every breeding choice</h2><p className="mt-5 max-w-xl text-base leading-8 text-muted">Browse the complete current Palworld roster, inspect images and Paldeck numbers, then filter by element and work suitability before you plan a breeding route.</p><Link href="/pals" className="btn btn-primary mt-7">Browse All Pals →</Link></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{popularPals.slice(0, 4).map((pal) => <Link key={pal.id} href={`/pals/${pal.slug}`} className="rounded-[22px] border border-border bg-surface p-4 shadow-[0_12px_30px_rgba(35,84,71,.06)]"><PalMark pal={pal} small /><span className="mt-4 block text-xs font-extrabold text-subtle">No. {pal.number}</span><strong className="mt-1 block font-display text-xl text-foreground">{pal.name}</strong><small className="mt-2 block text-xs text-muted">{pal.elements.join(" · ")}</small></Link>)}</div></div></section>

    <section className="popular-pals-section px-5 py-24 sm:px-8 lg:px-12"><div className="mx-auto max-w-[1360px]"><div className="section-heading-row"><div><p className="eyebrow">Fast Pal Lookup</p><h2 className="section-title mt-3">Popular Pals for Breeding</h2></div><p>Open a focused profile, review current work levels, or search every direct breeding combination for the Pal you want.</p></div><div className="popular-pal-grid">{popularPals.map((pal) => <article key={pal.id}><Link href={`/pals/${pal.slug}`}><PalMark pal={pal} /><div><span>No. {pal.number}</span><h3>{pal.name}</h3><p>{Object.entries(pal.work).slice(0, 2).map(([key, level]) => <b key={key}>{workGlyphs[key as WorkKey]} {workLabels[key as WorkKey]} {level}</b>)}</p><small>Breeding power {pal.power}</small></div></Link><footer><Link href={`/pals/${pal.slug}`}>Profile</Link><Link href={`/breeding-calculator?target=${pal.slug}`}>Combinations</Link></footer></article>)}</div><Link href="/pals" className="section-cta">Browse {standardPalCount} standard Pals →</Link></div></section>

    <section id="tools" className="tool-lab-section px-5 py-24 sm:px-8 lg:px-12"><div className="mx-auto max-w-[1360px]"><div className="mb-12 grid gap-6 lg:grid-cols-[1fr_.7fr] lg:items-end"><div><p className="eyebrow">More Palworld Tools</p><h2 className="section-title mt-3">Plan Beyond the Next Palworld Egg</h2></div><p className="max-w-lg text-lg leading-8 text-muted">After checking a Palworld breeding result, estimate incubation time, plan a resource circuit, or balance the worker slots at your base.</p></div><Link href="/team-builder" className="home-team-builder-entry"><span>05</span><div><small>New planning workspace</small><strong>Team Builder</strong><p>Assemble five Pals, review element and work coverage, then save or share the roster.</p></div><b>Open Team Builder →</b></Link><div className="mini-tool-heading"><span>Quick planning calculators</span></div><ToolLab /></div></section>

    <section className="home-update-section px-5 py-20 sm:px-8 lg:px-12"><div className="mx-auto grid max-w-[1260px] gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Latest Game Version</p><h2 className="section-title mt-3">Palworld 1.0 Breeding Data</h2><p>The Palworld 1.0 release revised breeding combinations. Check old routes against the current matrix before spending Cake and incubation time.</p><Link href="/updates">View data updates →</Link></div><div className="home-update-grid"><Link href="/?mode=target"><span>01</span><h3>All Parent Combinations</h3><p>Start with a target Pal and compare every direct parent pair.</p></Link><Link href="/pals"><span>02</span><h3>Current Pals</h3><p>Search the expanded 1.0 Pal roster and work suitability.</p></Link><Link href="/palworld-1-0"><span>03</span><h3>Version 1.0 Guide</h3><p>Review the release date, core changes, and practical next steps.</p></Link></div></div></section>

    <section id="popular" className="px-5 py-24 sm:px-8 lg:px-12"><div className="mx-auto max-w-[1360px] rounded-[42px] bg-surface-muted px-5 py-16 shadow-[inset_0_1px_0_white] sm:px-10 lg:px-14"><div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="eyebrow">Selected Reading</p><h2 className="section-title mt-3">Popular Guides</h2></div><div><p className="max-w-md text-base leading-7 text-muted">Six useful starting points. The complete 24-guide library now has its own page.</p><Link href="/guides" className="mt-3 inline-block font-extrabold text-link">View all guides →</Link></div></div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{popularGuides.map((guide, index) => { const style = popularStyles[index]; return <article key={guide.slug} className="guide-card group"><div className={`guide-art bg-gradient-to-br ${style.accent}`}><span className="guide-number">POPULAR {guide.number}</span><Image className="guide-art-image" src={style.image} alt="" fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" /><span className="guide-land" /></div><div className="p-6"><div className="mb-3 flex items-center justify-between gap-3"><span className={`rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[.1em] text-white ${style.color}`}>{guide.category}</span><span className="text-xs font-bold text-subtle">{guide.readTime}</span></div><h3 className="font-display text-2xl font-extrabold leading-tight tracking-[-.03em] text-foreground">{guide.title}</h3><p className="mt-3 leading-7 text-muted">{guide.description}</p><Link href={`/guides/${guide.slug}`} className="mt-5 inline-flex items-center gap-2 font-extrabold text-link">Read guide <span className="transition group-hover:translate-x-1">→</span></Link></div></article>; })}</div></div></section>

    <section className="data-freshness px-5 py-16 sm:px-8 lg:px-12"><div className="mx-auto max-w-[1200px]"><div><span>1.0</span><p><strong>Current data snapshot</strong><small>{totalPalEntryCount} Pals · {standardPalCount} standard · {crossoverCreatureCount} crossover · 300 breeding records</small></p></div><div><strong>Last data check</strong><span>July 14, 2026</span></div><Link href="/updates">Read the update notes →</Link></div></section>

    <section className="px-5 py-20 sm:px-8 lg:px-12"><div className="mx-auto grid max-w-[1200px] gap-10 border-y border-border py-14 lg:grid-cols-[.72fr_1.28fr]"><div><p className="eyebrow">Route planning notes</p><h2 className="section-title mt-3">Plan a Reliable Palworld Breeding Route</h2></div><div className="space-y-5 text-base leading-8 text-muted"><p>A Palworld species result is only the first step in a useful breeding plan. Check which parents you already own, compare direct pairs, and choose a route that avoids unnecessary captures or long incubation chains. A theoretically valid pair may still be inconvenient if one parent is rare, difficult to reach, or needed elsewhere at your base.</p><p>After choosing a pair, prepare Cake, free space in the Breeding Farm, and enough incubators for the number of eggs you expect to hatch. Keep valuable passive skills in mind when selecting individual parents, because the species calculation does not guarantee which traits will pass to the child. Saving several suitable parents gives you more chances to improve the final result without changing the combination.</p><p>Version changes can revise hidden species values and outcomes. If a combination comes from an older video, spreadsheet, or saved note, verify it against the current 1.0 data before committing resources. The update log explains when the dataset was checked and which fields are intentionally excluded until they can be validated.</p></div></div></section>

    <section id="faq" className="px-5 py-24 sm:px-8 lg:px-12"><div className="mx-auto grid max-w-[1200px] gap-14 lg:grid-cols-[.72fr_1.28fr]"><div><p className="eyebrow">Quick answers</p><h2 className="section-title mt-3">Palworld Breeding Calculator FAQ</h2></div><div className="divide-y divide-border border-y border-border">{faqs.map((faq, index) => <details key={faq.question} className="faq-item group" open={index === 0}><summary><span>{faq.question}</span><span className="faq-plus" aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}</div></div></section>

    <footer className="px-5 pb-8 pt-10 sm:px-8 lg:px-12"><div className="mx-auto max-w-[1360px] overflow-hidden rounded-[38px] bg-primary-900 px-7 py-10 text-inverse sm:px-10"><div className="flex flex-col justify-between gap-8 md:flex-row md:items-center"><div><p className="font-display text-3xl font-extrabold tracking-[-.04em]">Your next answer is one search away.</p><p className="mt-2 text-[#afd0c4]">Use a tool, open a Pal profile, or browse the complete guide library.</p></div><a href="#top" className="btn btn-accent w-fit">Back to the top ↑</a></div><div className="mt-10 flex flex-col justify-between gap-3 border-t border-white/15 pt-7 text-xs text-[#91b8ac] sm:flex-row"><span>© 2026 Palworld Guide. Made by players, for players.</span><span>Independent fan-made resource · Not affiliated with the game publisher.</span></div></div></footer>
  </main>;
}
