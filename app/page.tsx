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
  title: "Palworld 1.0 Release Date — Launch Guide",
  description: "The Palworld 1.0 release date was July 10, 2026. Check the launch status, then use current breeding tools, Paldeck data, and version 1.0 guides.",
  keywords: ["palworld 1.0 release date"],
  alternates: { canonical: "/" },
  openGraph: { title: "Palworld 1.0 Release Date — Launch Guide", description: "Palworld 1.0 launched July 10, 2026. Get the date, current breeding tools, Paldeck data, and practical guides.", url: "/", type: "website" },
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
  { question: "When was the Palworld 1.0 release date?", answer: "The official Palworld 1.0 release date was July 10, 2026. The full release is available now in every region." },
  { question: "What can I search on Palworld Field Guide?", answer: "Search current Pal profiles, breeding and database tools, or any of the 24 player-researched English guides." },
  { question: "Is the breeding calculator updated for Palworld 1.0?", answer: "Yes. It uses the current 300-entry breeding matrix and loads the larger result data only when you begin using the calculator." },
  { question: "Why are some combat stats not shown yet?", answer: "Version 1.0 rebalanced Pal data. We publish fields only after validating a complete current dataset instead of mixing old and new values." },
];

const popularGuides = guides.slice(0, 6);
const popularNames = ["Sekhmet", "Anubis", "Jetragon", "Shadowbeak", "Orserk", "Bastigor", "Aegidron", "Lyleen"];
const popularPals = popularNames.map((name) => pals.find((pal) => pal.name === name)).filter((pal) => pal !== undefined);

export default function Home() {
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) };
  return <main className="min-h-screen overflow-hidden bg-[#fffdf6] text-[#173b38]">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

    <section className="hero-sky relative min-h-[720px] px-5 pb-28 pt-5 sm:px-8 lg:px-12">
      <div className="sun-orb" aria-hidden="true" />
      <div className="cloud cloud-one" aria-hidden="true" />
      <div className="cloud cloud-two" aria-hidden="true" />
      <div className="mx-auto max-w-[1360px]"><SiteHeader floating />
        <div id="top" className="relative z-10 grid items-center gap-14 pb-10 pt-20 lg:grid-cols-[1.08fr_.92fr] lg:pt-24">
          <div className="hero-copy max-w-3xl"><div className="hero-status mb-6 inline-flex items-center gap-2 rounded-full border border-[#287a68]/15 bg-white/65 px-4 py-2 text-xs font-extrabold uppercase tracking-[.17em] text-[#287a68] shadow-sm backdrop-blur"><span className="h-2 w-2 rounded-full bg-[#ff7b70]" /> Released July 10, 2026</div>
            <h1 className="font-[var(--font-display)] text-[clamp(3.25rem,6.7vw,6.5rem)] font-extrabold leading-[.86] tracking-[-.065em] text-[#173f38]">Palworld 1.0<br /><span className="relative inline-block text-[#fffdf6] [text-shadow:0_4px_0_#2a8067]">Release Date.<span className="title-swoop" aria-hidden="true" /></span></h1>
            <p className="hero-description mt-8 max-w-2xl text-lg leading-8 text-[#456c68] sm:text-xl">The Palworld 1.0 release date was <strong>July 10, 2026</strong>. Use current tools, calculators, Paldeck data, and player-researched guides for the full release.</p>
            <div className="hero-actions mt-9 flex flex-wrap items-center gap-4"><Link href="/breeding-calculator" className="rounded-2xl bg-[#ff786e] px-7 py-4 font-extrabold text-white shadow-[0_7px_0_#ce514b] transition hover:-translate-y-1">Breeding Calculator →</Link><Link href="/paldex" className="rounded-2xl border-2 border-[#287a68]/20 bg-white/55 px-7 py-4 font-extrabold text-[#215f53] backdrop-blur transition hover:bg-white">Browse All Pals</Link></div>
            <div id="site-search" className="hero-search-wrap"><GlobalSearch /></div>
          </div>
          <div className="hero-core-tool" aria-label="Quick Palworld breeding calculator"><HomeToolBoard /></div>
        </div>
      </div>
      <div className="hill hill-back" aria-hidden="true" />
      <div className="hill hill-front" aria-hidden="true" />
    </section>

    <section id="tools" className="tool-lab-section px-5 py-24 sm:px-8 lg:px-12"><div className="mx-auto max-w-[1360px]"><div className="mb-12 grid gap-6 lg:grid-cols-[1fr_.7fr] lg:items-end"><div><p className="eyebrow">More Palworld Tools</p><h2 className="section-title mt-3">Plan the next move.</h2></div><p className="max-w-lg text-lg leading-8 text-[#55736d]">The core breeding check now lives above the fold. Use these focused planners for resource runs, incubation time, and base workers.</p></div><div className="mini-tool-heading"><span>Quick planning calculators</span><Link href="/tools">View every tool →</Link></div><ToolLab /></div></section>

    <section className="popular-pals-section px-5 py-24 sm:px-8 lg:px-12"><div className="mx-auto max-w-[1360px]"><div className="section-heading-row"><div><p className="eyebrow">Fast Pal Lookup</p><h2 className="section-title mt-3">Popular Pals</h2></div><p>Open a focused profile, review current work levels, or continue into the full breeding calculator.</p></div><div className="popular-pal-grid">{popularPals.map((pal) => <article key={pal.id}><Link href={`/pals/${pal.slug}`}><PalMark pal={pal} /><div><span>No. {pal.number}</span><h3>{pal.name}</h3><p>{Object.entries(pal.work).slice(0, 2).map(([key, level]) => <b key={key}>{workGlyphs[key as WorkKey]} {workLabels[key as WorkKey]} {level}</b>)}</p><small>Breeding power {pal.power}</small></div></Link><footer><Link href={`/pals/${pal.slug}`}>Profile</Link><Link href="/breeding-calculator">Breeding</Link></footer></article>)}</div><Link href="/paldex" className="section-cta">Browse all 289 Pals →</Link></div></section>

    <section className="home-update-section px-5 py-20 sm:px-8 lg:px-12"><div className="mx-auto grid max-w-[1260px] gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Latest Game Version</p><h2 className="section-title mt-3">Palworld 1.0</h2><p>Released July 10, 2026. Old breeding charts and work rankings need a current-version check.</p><Link href="/updates">View update center →</Link></div><div className="home-update-grid"><Link href="/palworld-1-0"><span>01</span><h3>Version 1.0 Guide</h3><p>Release date, core changes, and practical next steps.</p></Link><Link href="/paldex"><span>02</span><h3>Current Paldeck</h3><p>Search the expanded 1.0 Pal roster and work suitability.</p></Link><Link href="/breeding-calculator"><span>03</span><h3>New Breeding Results</h3><p>Replace Early Access pair charts with the current matrix.</p></Link></div></div></section>

    <section id="popular" className="px-5 py-24 sm:px-8 lg:px-12"><div className="mx-auto max-w-[1360px] rounded-[42px] bg-[#eef7eb] px-5 py-16 shadow-[inset_0_1px_0_white] sm:px-10 lg:px-14"><div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="eyebrow">Selected Reading</p><h2 className="section-title mt-3">Popular Guides</h2></div><div><p className="max-w-md text-base leading-7 text-[#607973]">Six useful starting points. The complete 24-guide library now has its own page.</p><Link href="/guides" className="mt-3 inline-block font-extrabold text-[#2b795f]">View all guides →</Link></div></div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{popularGuides.map((guide, index) => { const style = popularStyles[index]; return <article key={guide.slug} className="guide-card group"><div className={`guide-art bg-gradient-to-br ${style.accent}`}><span className="guide-number">POPULAR {guide.number}</span><span className="guide-symbol" aria-hidden="true">{style.icon}</span><span className="guide-land" /></div><div className="p-6"><div className="mb-3 flex items-center justify-between gap-3"><span className={`rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[.1em] text-white ${style.color}`}>{guide.category}</span><span className="text-xs font-bold text-[#82948f]">{guide.readTime}</span></div><h3 className="font-[var(--font-display)] text-2xl font-extrabold leading-tight tracking-[-.03em] text-[#193e39]">{guide.title}</h3><p className="mt-3 leading-7 text-[#627a75]">{guide.description}</p><Link href={`/guides/${guide.slug}`} className="mt-5 inline-flex items-center gap-2 font-extrabold text-[#2b795f]">Read guide <span className="transition group-hover:translate-x-1">→</span></Link></div></article>; })}</div></div></section>

    <section className="data-freshness px-5 py-16 sm:px-8 lg:px-12"><div className="mx-auto max-w-[1200px]"><div><span>1.0</span><p><strong>Current data snapshot</strong><small>289 Pals · 11 crossover creatures · 300 breeding records</small></p></div><div><strong>Last data check</strong><span>July 14, 2026</span></div><Link href="/updates">Read the update notes →</Link></div></section>

    <section id="faq" className="px-5 py-24 sm:px-8 lg:px-12"><div className="mx-auto grid max-w-[1200px] gap-14 lg:grid-cols-[.62fr_1.38fr]"><div><p className="eyebrow">Using the Site</p><h2 className="section-title mt-3">Quick<br />answers.</h2></div><div className="divide-y divide-[#cfe0d9] border-y border-[#cfe0d9]">{faqs.map((faq, index) => <details key={faq.question} className="faq-item group" open={index === 0}><summary><span>{faq.question}</span><span className="faq-plus" aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}</div></div></section>

    <footer className="px-5 pb-8 pt-10 sm:px-8 lg:px-12"><div className="mx-auto max-w-[1360px] overflow-hidden rounded-[38px] bg-[#173f38] px-7 py-10 text-[#eaf7ea] sm:px-10"><div className="flex flex-col justify-between gap-8 md:flex-row md:items-center"><div><p className="font-[var(--font-display)] text-3xl font-extrabold tracking-[-.04em]">Your next answer is one search away.</p><p className="mt-2 text-[#afd0c4]">Use a tool, open a Pal profile, or browse the complete guide library.</p></div><a href="#top" className="w-fit rounded-2xl bg-[#ff786e] px-6 py-4 font-extrabold text-white shadow-[0_6px_0_#a83f3b]">Back to the top ↑</a></div><div className="mt-10 flex flex-col justify-between gap-3 border-t border-white/15 pt-7 text-xs text-[#91b8ac] sm:flex-row"><span>© 2026 Palworld Guide. Made by players, for players.</span><span>Independent fan-made resource · Not affiliated with the game publisher.</span></div></div></footer>
  </main>;
}
