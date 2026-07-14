import type { Metadata } from "next";
import Link from "next/link";
import GlobalSearch from "./components/global-search";
import HomeToolBoard from "./components/home-tool-board";
import PalMark from "./components/pal-mark";
import SiteHeader from "./components/site-header";
import ToolLab from "./components/tool-lab";
import { guides } from "./guides/guide-data";
import { pals, WorkKey, workGlyphs, workLabels } from "./lib/game-data";

export const metadata: Metadata = {
  title: "Palworld Breeding Calculator - Updated 1.0 Pal Combos",
  description: "Use the Palworld breeding calculator for version 1.0 to find offspring from two parents or discover every combination for a target Pal. Start planning now.",
  keywords: ["palworld breeding calculator"],
  alternates: { canonical: "/" },
  openGraph: { title: "Palworld Breeding Calculator — Updated for 1.0", description: "Choose two parent Pals to find their offspring, or search current parent combinations for the Pal you want to hatch.", url: "/", type: "website" },
};

const popularStyles = [
  { color: "bg-[#ff7b70]", accent: "from-[#ffe59a] to-[#ff9f76]", icon: "☀" },
  { color: "bg-[#66c47a]", accent: "from-[#9be7c4] to-[#52b986]", icon: "✦" },
  { color: "bg-[#58badd]", accent: "from-[#a4e6f0] to-[#73bfdc]", icon: "⌖" },
  { color: "bg-[#f0ae54]", accent: "from-[#ffe2a3] to-[#e7aa58]", icon: "⌂" },
  { color: "bg-[#827ac5]", accent: "from-[#c8c1f1] to-[#8d83cd]", icon: "◆" },
  { color: "bg-[#ed6d62]", accent: "from-[#ffba9f] to-[#e86d64]", icon: "⚑" },
];

const faqs = [
  { question: "What does this breeding calculator do?", answer: "Choose two parent Pals to see their offspring, or open the complete combinations tool and work backward from the Pal you want to hatch." },
  { question: "Is this calculator updated for Palworld 1.0?", answer: "Yes. It uses the current 300-entry breeding matrix prepared for version 1.0 and loads the result data only when you begin using the calculator." },
  { question: "How do I find parents for a specific Pal?", answer: "Open Find All Combinations, switch to Target → Parents, and choose your target Pal to see the available parent pairs." },
  { question: "Why did an old Palworld breeding combination change?", answer: "Palworld 1.0 revised breeding values and combinations, so routes remembered from Early Access may now produce a different offspring." },
  { question: "Does the calculator predict passive skills or mutations?", answer: "No. It identifies the offspring species and parent combinations. Passive skills, mutations, gender, and individual stats still follow the in-game breeding rules." },
];

const popularGuides = guides.slice(0, 6);
const popularNames = ["Sekhmet", "Anubis", "Jetragon", "Shadowbeak", "Orserk", "Bastigor", "Aegidron", "Lyleen"];
const popularPals = popularNames.map((name) => pals.find((pal) => pal.name === name)).filter((pal) => pal !== undefined);

export default function Home() {
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) };
  const appSchema = { "@context": "https://schema.org", "@type": "WebApplication", name: "Palworld Breeding Calculator", url: "https://www.palworldguide.net", applicationCategory: "GameApplication", operatingSystem: "Any", description: metadata.description, isAccessibleForFree: true };
  return <main className="min-h-screen overflow-hidden bg-[#fffdf6] text-[#173b38]">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />

    <section id="top" className="home-scene-hero">
      <div className="home-scene-shade" aria-hidden="true" />
      <div className="home-scene-inner">
        <SiteHeader floating />
        <div className="home-scene-grid">
          <div className="home-release-panel">
            <div className="home-release-status"><span /> Updated for Palworld 1.0</div>
            <h1>Palworld Breeding Calculator</h1>
            <strong>300 Pal records</strong>
            <p>Use this Palworld breeding calculator to choose two parent Pals and see their offspring instantly. Start with a target Pal to discover every current parent combination.</p>
            <div><Link href="/breeding-calculator">Find every combination →</Link><Link href="/paldex">Browse all Pals</Link></div>
          </div>
          <div className="hero-core-tool" aria-label="Quick Palworld breeding calculator"><HomeToolBoard headingLevel={2} /></div>
        </div>
      </div>
    </section>

    <section id="site-search" className="home-search-section"><div><p><strong>Search the full field guide.</strong><span>Find a Pal, tool, or player-researched guide.</span></p><GlobalSearch /></div></section>

    <section className="px-5 py-20 sm:px-8 lg:px-12"><div className="mx-auto max-w-[1260px]"><div className="mb-10 grid gap-5 lg:grid-cols-[1fr_.7fr] lg:items-end"><div><p className="eyebrow">Three quick steps</p><h2 className="section-title mt-3">How the Pal Breeding Tool Works</h2></div><p className="max-w-lg text-base leading-7 text-[#607973]">Start with the Pals in your Palbox or work backward from the offspring you want. The calculator uses the current version 1.0 combination data.</p></div><div className="grid gap-4 md:grid-cols-3"><article className="overview-card"><span className="overview-icon bg-[#ffe3a3] text-[#9a5a22]">1</span><h3>Choose Two Parent Pals</h3><p>Select Parent A and Parent B from the pictured Pal list. Parent order does not change the offspring species.</p></article><article className="overview-card"><span className="overview-icon bg-[#d8f2e0] text-[#277058]">2</span><h3>Read the Offspring Result</h3><p>The child appears as soon as both parents are selected. Open its profile to review work suitability and breeding power.</p></article><article className="overview-card"><span className="overview-icon bg-[#dceff8] text-[#27647d]">3</span><h3>Find Parent Combinations</h3><p>Need a specific Pal? Open the complete combinations search and use Target → Parents to compare every direct pair.</p></article></div></div></section>

    <section id="tools" className="tool-lab-section px-5 py-24 sm:px-8 lg:px-12"><div className="mx-auto max-w-[1360px]"><div className="mb-12 grid gap-6 lg:grid-cols-[1fr_.7fr] lg:items-end"><div><p className="eyebrow">More Palworld Tools</p><h2 className="section-title mt-3">Plan Beyond the Next Egg</h2></div><p className="max-w-lg text-lg leading-8 text-[#55736d]">After checking a breeding result, estimate incubation time, plan a resource circuit, or balance the worker slots at your base.</p></div><div className="mini-tool-heading"><span>Quick planning calculators</span><Link href="/tools">View every tool →</Link></div><ToolLab /></div></section>

    <section className="popular-pals-section px-5 py-24 sm:px-8 lg:px-12"><div className="mx-auto max-w-[1360px]"><div className="section-heading-row"><div><p className="eyebrow">Fast Pal Lookup</p><h2 className="section-title mt-3">Popular Pals for Breeding</h2></div><p>Open a focused profile, review current work levels, or search every direct breeding combination for the Pal you want.</p></div><div className="popular-pal-grid">{popularPals.map((pal) => <article key={pal.id}><Link href={`/pals/${pal.slug}`}><PalMark pal={pal} /><div><span>No. {pal.number}</span><h3>{pal.name}</h3><p>{Object.entries(pal.work).slice(0, 2).map(([key, level]) => <b key={key}>{workGlyphs[key as WorkKey]} {workLabels[key as WorkKey]} {level}</b>)}</p><small>Breeding power {pal.power}</small></div></Link><footer><Link href={`/pals/${pal.slug}`}>Profile</Link><Link href="/breeding-calculator">Combinations</Link></footer></article>)}</div><Link href="/paldex" className="section-cta">Browse all 289 Pals →</Link></div></section>

    <section className="home-update-section px-5 py-20 sm:px-8 lg:px-12"><div className="mx-auto grid max-w-[1260px] gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Latest Game Version</p><h2 className="section-title mt-3">Palworld 1.0 Breeding Data</h2><p>The version 1.0 release revised breeding combinations. Check old routes against the current matrix before spending Cake and incubation time.</p><Link href="/updates">View data updates →</Link></div><div className="home-update-grid"><Link href="/breeding-calculator"><span>01</span><h3>All Parent Combinations</h3><p>Start with a target Pal and compare every direct parent pair.</p></Link><Link href="/paldex"><span>02</span><h3>Current Paldeck</h3><p>Search the expanded 1.0 Pal roster and work suitability.</p></Link><Link href="/palworld-1-0"><span>03</span><h3>Version 1.0 Guide</h3><p>Review the release date, core changes, and practical next steps.</p></Link></div></div></section>

    <section id="popular" className="px-5 py-24 sm:px-8 lg:px-12"><div className="mx-auto max-w-[1360px] rounded-[42px] bg-[#eef7eb] px-5 py-16 shadow-[inset_0_1px_0_white] sm:px-10 lg:px-14"><div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="eyebrow">Selected Reading</p><h2 className="section-title mt-3">Popular Guides</h2></div><div><p className="max-w-md text-base leading-7 text-[#607973]">Six useful starting points. The complete 24-guide library now has its own page.</p><Link href="/guides" className="mt-3 inline-block font-extrabold text-[#2b795f]">View all guides →</Link></div></div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{popularGuides.map((guide, index) => { const style = popularStyles[index]; return <article key={guide.slug} className="guide-card group"><div className={`guide-art bg-gradient-to-br ${style.accent}`}><span className="guide-number">POPULAR {guide.number}</span><span className="guide-symbol" aria-hidden="true">{style.icon}</span><span className="guide-land" /></div><div className="p-6"><div className="mb-3 flex items-center justify-between gap-3"><span className={`rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[.1em] text-white ${style.color}`}>{guide.category}</span><span className="text-xs font-bold text-[#82948f]">{guide.readTime}</span></div><h3 className="font-[var(--font-display)] text-2xl font-extrabold leading-tight tracking-[-.03em] text-[#193e39]">{guide.title}</h3><p className="mt-3 leading-7 text-[#627a75]">{guide.description}</p><Link href={`/guides/${guide.slug}`} className="mt-5 inline-flex items-center gap-2 font-extrabold text-[#2b795f]">Read guide <span className="transition group-hover:translate-x-1">→</span></Link></div></article>; })}</div></div></section>

    <section className="data-freshness px-5 py-16 sm:px-8 lg:px-12"><div className="mx-auto max-w-[1200px]"><div><span>1.0</span><p><strong>Current data snapshot</strong><small>289 Pals · 11 crossover creatures · 300 breeding records</small></p></div><div><strong>Last data check</strong><span>July 14, 2026</span></div><Link href="/updates">Read the update notes →</Link></div></section>

    <section id="faq" className="px-5 py-24 sm:px-8 lg:px-12"><div className="mx-auto grid max-w-[1200px] gap-14 lg:grid-cols-[.72fr_1.28fr]"><div><p className="eyebrow">Quick answers</p><h2 className="section-title mt-3">Palworld Breeding Calculator FAQ</h2></div><div className="divide-y divide-[#cfe0d9] border-y border-[#cfe0d9]">{faqs.map((faq, index) => <details key={faq.question} className="faq-item group" open={index === 0}><summary><span>{faq.question}</span><span className="faq-plus" aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}</div></div></section>

    <footer className="px-5 pb-8 pt-10 sm:px-8 lg:px-12"><div className="mx-auto max-w-[1360px] overflow-hidden rounded-[38px] bg-[#173f38] px-7 py-10 text-[#eaf7ea] sm:px-10"><div className="flex flex-col justify-between gap-8 md:flex-row md:items-center"><div><p className="font-[var(--font-display)] text-3xl font-extrabold tracking-[-.04em]">Your next answer is one search away.</p><p className="mt-2 text-[#afd0c4]">Use a tool, open a Pal profile, or browse the complete guide library.</p></div><a href="#top" className="w-fit rounded-2xl bg-[#ff786e] px-6 py-4 font-extrabold text-white shadow-[0_6px_0_#a83f3b]">Back to the top ↑</a></div><div className="mt-10 flex flex-col justify-between gap-3 border-t border-white/15 pt-7 text-xs text-[#91b8ac] sm:flex-row"><span>© 2026 Palworld Guide. Made by players, for players.</span><span>Independent fan-made resource · Not affiliated with the game publisher.</span></div></div></footer>
  </main>;
}
