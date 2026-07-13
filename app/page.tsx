import Link from "next/link";
import ToolLab from "./components/tool-lab";
import { guideCategories, guides } from "./guides/guide-data";

const popularStyles = [
  { color: "bg-[#ff7b70]", accent: "from-[#ffe59a] to-[#ff9f76]", icon: "☀" },
  { color: "bg-[#66c47a]", accent: "from-[#9be7c4] to-[#52b986]", icon: "✦" },
  { color: "bg-[#58badd]", accent: "from-[#a4e6f0] to-[#73bfdc]", icon: "⌖" },
  { color: "bg-[#f0ae54]", accent: "from-[#ffe2a3] to-[#e7aa58]", icon: "⌂" },
  { color: "bg-[#827ac5]", accent: "from-[#c8c1f1] to-[#8d83cd]", icon: "◆" },
  { color: "bg-[#ed6d62]", accent: "from-[#ffba9f] to-[#e86d64]", icon: "⚑" },
];

const faqs = [
  { question: "What is Palworld Field Guide?", answer: "An independent, player-made knowledge hub with practical articles, route checklists and simple planning tools for every stage of a Palworld save." },
  { question: "Where should a new player begin?", answer: "Start with Your First 7 Days, then open the Getting Started category. The popular section is intentionally ordered around the questions most fresh saves run into first." },
  { question: "How are these guides researched?", answer: "We review current non-official creator videos, compare the routes and systems demonstrated on screen, and rewrite the useful findings in clear English. Each article links to its YouTube research." },
  { question: "Are the calculators exact?", answer: "They are planning tools. Enter the values shown in your own save because world settings, server rules and later patches can change timers, yields and worker limits." },
];

const popularGuides = guides.slice(0, 6);

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fffdf6] text-[#173b38]">
      <section className="hero-sky relative min-h-[720px] px-5 pb-28 pt-5 sm:px-8 lg:px-12">
        <div className="sun-orb" aria-hidden="true" /><div className="cloud cloud-one" aria-hidden="true" /><div className="cloud cloud-two" aria-hidden="true" />
        <div className="mx-auto max-w-[1360px]">
          <header className="relative z-30 flex items-center justify-between rounded-[24px] border border-white/70 bg-white/60 px-5 py-4 shadow-[0_10px_35px_rgba(40,105,104,.08)] backdrop-blur-xl sm:px-7">
            <a href="#top" className="flex items-center gap-3" aria-label="Palworld Guide home">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#1e7756] text-xl text-white shadow-[inset_0_-4px_0_rgba(0,0,0,.12)]">P</span>
              <span className="leading-none"><strong className="block font-[var(--font-display)] text-xl tracking-[-.03em]">PALWORLD</strong><span className="text-[10px] font-bold tracking-[.24em] text-[#568079]">FIELD GUIDE</span></span>
            </a>
            <nav className="hidden items-center gap-8 text-sm font-bold text-[#315e58] lg:flex" aria-label="Main navigation">
              <a className="nav-link" href="#popular">Popular</a><a className="nav-link" href="#tools">Tools</a><a className="nav-link" href="#categories">Categories</a><a className="nav-link" href="#faq">FAQ</a>
            </nav>
            <a href="#categories" className="rounded-full bg-[#173f38] px-5 py-3 text-sm font-bold text-white shadow-[0_6px_0_#0f2d28] transition hover:-translate-y-0.5 hover:bg-[#215d50]">Explore Library</a>
          </header>

          <div id="top" className="relative z-10 grid items-center gap-14 pb-10 pt-20 lg:grid-cols-[1.05fr_.95fr] lg:pt-24">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#287a68]/15 bg-white/65 px-4 py-2 text-xs font-extrabold uppercase tracking-[.17em] text-[#287a68] shadow-sm backdrop-blur"><span className="h-2 w-2 rounded-full bg-[#ff7b70]" /> 24 field guides · 3 planning tools</div>
              <h1 className="font-[var(--font-display)] text-[clamp(4rem,8vw,7.5rem)] font-extrabold leading-[.83] tracking-[-.065em] text-[#173f38]">Every Answer.<br /><span className="relative inline-block text-[#fffdf6] [text-shadow:0_4px_0_#2a8067]">One Field Guide.<span className="title-swoop" aria-hidden="true" /></span></h1>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-[#456c68] sm:text-xl">Popular routes, focused how-to guides, and quick calculators for Pals, bases, resources, exploration and combat.</p>
              <div className="mt-9 flex flex-wrap items-center gap-4"><a href="#popular" className="rounded-2xl bg-[#ff786e] px-7 py-4 font-extrabold text-white shadow-[0_7px_0_#ce514b] transition hover:-translate-y-1">Start with Popular Guides →</a><a href="#tools" className="rounded-2xl border-2 border-[#287a68]/20 bg-white/55 px-7 py-4 font-extrabold text-[#215f53] backdrop-blur transition hover:bg-white">Open the Tool Lab</a></div>
            </div>
            <div className="hero-art relative mx-auto h-[420px] w-full max-w-[570px] lg:h-[500px]" aria-label="A playful illustrated island landscape">
              <div className="floating-badge badge-top"><span className="text-xl">✦</span><div><b>6 categories</b><small>Browse by system</small></div></div>
              <div className="floating-badge badge-bottom"><span className="text-xl">⌖</span><div><b>Player researched</b><small>Clear, useful answers</small></div></div>
              <div className="island island-back" /><div className="island island-main"><span className="tree tree-a" /><span className="tree tree-b" /><span className="tree tree-c" /><span className="path" /><div className="pal" aria-hidden="true"><span className="pal-ear left" /><span className="pal-ear right" /><span className="pal-face"><i /><i /></span><span className="pal-pack" /></div></div><div className="island island-small" />
            </div>
          </div>
        </div>
        <div className="hill hill-back" aria-hidden="true" /><div className="hill hill-front" aria-hidden="true" />
      </section>

      <section className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1260px] gap-12 lg:grid-cols-[.75fr_1.25fr] lg:items-center">
          <div><p className="eyebrow">Welcome, Explorer</p><h2 className="section-title mt-4">Less searching.<br />More playing.</h2></div>
          <div className="grid gap-4 sm:grid-cols-3"><div className="stat-card"><strong>24</strong><span>complete English guides</span></div><div className="stat-card"><strong>6</strong><span>clear game categories</span></div><div className="stat-card"><strong>3</strong><span>interactive planners</span></div></div>
        </div>
      </section>

      <section id="popular" className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1360px] rounded-[42px] bg-[#eef7eb] px-5 py-16 shadow-[inset_0_1px_0_white] sm:px-10 lg:px-14">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="eyebrow">Most Used</p><h2 className="section-title mt-3">Popular Guides</h2></div><p className="max-w-md text-base leading-7 text-[#607973]">The questions most players ask first—kept at the front of the library for quick access.</p></div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {popularGuides.map((guide, index) => { const style = popularStyles[index]; return (
              <article key={guide.slug} className="guide-card group">
                <div className={`guide-art bg-gradient-to-br ${style.accent}`}><span className="guide-number">POPULAR {guide.number}</span><span className="guide-symbol" aria-hidden="true">{style.icon}</span><span className="guide-land" /></div>
                <div className="p-6"><div className="mb-3 flex items-center justify-between gap-3"><span className={`rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[.1em] text-white ${style.color}`}>{guide.category}</span><span className="text-xs font-bold text-[#82948f]">{guide.readTime}</span></div><h3 className="font-[var(--font-display)] text-2xl font-extrabold leading-tight tracking-[-.03em] text-[#193e39]">{guide.title}</h3><p className="mt-3 leading-7 text-[#627a75]">{guide.description}</p><Link href={`/guides/${guide.slug}`} className="mt-5 inline-flex items-center gap-2 font-extrabold text-[#2b795f]">Read guide <span className="transition group-hover:translate-x-1">→</span></Link></div>
              </article>
            ); })}
          </div>
        </div>
      </section>

      <section id="tools" className="tool-lab-section px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1360px]"><div className="mb-12 grid gap-6 lg:grid-cols-[1fr_.7fr] lg:items-end"><div><p className="eyebrow">Interactive Tools</p><h2 className="section-title mt-3 text-white">Plan before<br />you leave base.</h2></div><p className="max-w-lg text-lg leading-8 text-[#b9d8ce]">Use values from your own world settings. Every calculator updates instantly and keeps the math out of your next session.</p></div><ToolLab /></div>
      </section>

      <section id="categories" className="px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1360px]">
          <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><p className="eyebrow">The Complete Library</p><h2 className="section-title mt-3">Browse by Category</h2></div><p className="max-w-lg leading-7 text-[#617a75]">Choose a system, then open any guide directly. Each category contains four complete articles.</p></div>
          <div className="category-jump-grid">
            {guideCategories.map((category) => <a key={category.id} href={`#category-${category.id}`} className="category-jump" style={{ "--category-accent": category.accent, "--category-soft": category.soft } as React.CSSProperties}><span>{category.icon}</span><div><strong>{category.name}</strong><small>{guides.filter((guide) => guide.category === category.name).length} guides</small></div><b>↓</b></a>)}
          </div>

          <div className="category-shelves">
            {guideCategories.map((category) => {
              const categoryGuides = guides.filter((guide) => guide.category === category.name);
              return (
                <section id={`category-${category.id}`} key={category.id} className="category-shelf scroll-mt-8" style={{ "--category-accent": category.accent, "--category-soft": category.soft } as React.CSSProperties}>
                  <div className="category-shelf-intro"><span>{category.icon}</span><p>Category</p><h3>{category.name}</h3><div>{category.description}</div></div>
                  <div className="category-guide-list">
                    {categoryGuides.map((guide) => <Link key={guide.slug} href={`/guides/${guide.slug}`} className="category-guide-row"><span>{guide.number}</span><div><strong>{guide.title}</strong><small>{guide.description}</small></div><b>{guide.readTime} →</b></Link>)}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      <section id="faq" className="px-5 py-24 sm:px-8 lg:px-12"><div className="mx-auto grid max-w-[1200px] gap-14 lg:grid-cols-[.62fr_1.38fr]"><div><p className="eyebrow">Before You Set Out</p><h2 className="section-title mt-3">Questions,<br />answered.</h2><p className="mt-5 max-w-sm leading-7 text-[#617a75]">How to use the library, tools and creator-video research.</p></div><div className="divide-y divide-[#cfe0d9] border-y border-[#cfe0d9]">{faqs.map((faq, index) => <details key={faq.question} className="faq-item group" open={index === 0}><summary><span>{faq.question}</span><span className="faq-plus" aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}</div></div></section>

      <footer className="px-5 pb-8 pt-16 sm:px-8 lg:px-12"><div className="mx-auto max-w-[1360px] overflow-hidden rounded-[38px] bg-[#173f38] px-7 py-10 text-[#eaf7ea] sm:px-10"><div className="flex flex-col justify-between gap-8 md:flex-row md:items-center"><div><p className="font-[var(--font-display)] text-3xl font-extrabold tracking-[-.04em]">Your next answer is already mapped.</p><p className="mt-2 text-[#afd0c4]">Bookmark the field guide and return whenever the next bottleneck appears.</p></div><a href="#top" className="w-fit rounded-2xl bg-[#ff786e] px-6 py-4 font-extrabold text-white shadow-[0_6px_0_#a83f3b]">Back to the top ↑</a></div><div className="mt-10 flex flex-col justify-between gap-3 border-t border-white/15 pt-7 text-xs text-[#91b8ac] sm:flex-row"><span>© 2026 Palworld Guide. Made by players, for players.</span><span>Independent fan-made resource · Not affiliated with the game publisher.</span></div></div></footer>
    </main>
  );
}
