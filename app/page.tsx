const guides = [
  {
    number: "01",
    category: "Getting Started",
    title: "Your First 7 Days in Polworld",
    description: "A practical route from your first campfire to a safe, productive base.",
    time: "8 min read",
    color: "bg-[#ff7b70]",
    accent: "from-[#ffe59a] to-[#ff9f76]",
    icon: "☀",
  },
  {
    number: "02",
    category: "Pals & Teams",
    title: "Best Early-Game Pals",
    description: "Reliable companions for gathering, travel, combat, and base work.",
    time: "6 min read",
    color: "bg-[#66c47a]",
    accent: "from-[#9be7c4] to-[#52b986]",
    icon: "✦",
  },
  {
    number: "03",
    category: "Exploration",
    title: "The Explorer's Map",
    description: "Key landmarks, fast-travel points, and resources worth marking early.",
    time: "12 min read",
    color: "bg-[#58badd]",
    accent: "from-[#a4e6f0] to-[#73bfdc]",
    icon: "⌖",
  },
  {
    number: "04",
    category: "Base Building",
    title: "Build a Better Base",
    description: "Layouts that keep production moving without wasting precious space.",
    time: "10 min read",
    color: "bg-[#f0ae54]",
    accent: "from-[#ffe2a3] to-[#e7aa58]",
    icon: "⌂",
  },
  {
    number: "05",
    category: "Resources",
    title: "Ore, Coal & Sulfur Routes",
    description: "Efficient loops to keep every crafting station fully supplied.",
    time: "7 min read",
    color: "bg-[#827ac5]",
    accent: "from-[#c8c1f1] to-[#8d83cd]",
    icon: "◆",
  },
  {
    number: "06",
    category: "Combat",
    title: "Prepare for Your First Boss",
    description: "The gear, team, and simple tactics that make the fight manageable.",
    time: "9 min read",
    color: "bg-[#ed6d62]",
    accent: "from-[#ffba9f] to-[#e86d64]",
    icon: "⚑",
  },
];

const faqs = [
  {
    question: "What is Polworld Guide?",
    answer: "Polworld Guide is an independent, player-made knowledge hub built to turn long searches into clear next steps. Every guide focuses on practical routes, useful checklists, and advice you can apply immediately.",
  },
  {
    question: "Are these guides beginner-friendly?",
    answer: "Yes. Every beginner guide explains the essentials first and avoids assuming that you already know the game's systems. More advanced tips are clearly separated so you can learn at your own pace.",
  },
  {
    question: "How often are guides updated?",
    answer: "Core guides are reviewed after major game updates. When balance changes affect a recommendation, the guide's update date and relevant sections will be refreshed.",
  },
  {
    question: "Can I suggest a guide or correction?",
    answer: "Absolutely. Community suggestions, route improvements, and corrections are welcome. A simple contribution form will be added in the next version of the site.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fffdf6] text-[#173b38]">
      <section className="hero-sky relative min-h-[760px] px-5 pb-28 pt-5 sm:px-8 lg:px-12">
        <div className="sun-orb" aria-hidden="true" />
        <div className="cloud cloud-one" aria-hidden="true" />
        <div className="cloud cloud-two" aria-hidden="true" />
        <div className="mx-auto max-w-[1360px]">
          <header className="relative z-30 flex items-center justify-between rounded-[24px] border border-white/70 bg-white/60 px-5 py-4 shadow-[0_10px_35px_rgba(40,105,104,.08)] backdrop-blur-xl sm:px-7">
            <a href="#top" className="flex items-center gap-3" aria-label="Polworld Guide home">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#1e7756] text-xl text-white shadow-[inset_0_-4px_0_rgba(0,0,0,.12)]">P</span>
              <span className="leading-none">
                <strong className="block font-[var(--font-display)] text-xl tracking-[-.03em]">POLWORLD</strong>
                <span className="text-[10px] font-bold tracking-[.24em] text-[#568079]">FIELD GUIDE</span>
              </span>
            </a>
            <nav className="hidden items-center gap-9 text-sm font-bold text-[#315e58] md:flex" aria-label="Main navigation">
              <a className="nav-link" href="#about">The Game</a>
              <a className="nav-link" href="#guides">Guides</a>
              <a className="nav-link" href="#faq">FAQ</a>
            </nav>
            <a href="#guides" className="rounded-full bg-[#173f38] px-5 py-3 text-sm font-bold text-white shadow-[0_6px_0_#0f2d28] transition hover:-translate-y-0.5 hover:bg-[#215d50]">Browse Guides</a>
          </header>

          <div id="top" className="relative z-10 grid items-center gap-14 pb-12 pt-20 lg:grid-cols-[1.05fr_.95fr] lg:pt-24">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#287a68]/15 bg-white/65 px-4 py-2 text-xs font-extrabold uppercase tracking-[.17em] text-[#287a68] shadow-sm backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-[#ff7b70]" /> Player-made knowledge hub
              </div>
              <h1 className="font-[var(--font-display)] text-[clamp(4rem,8vw,7.7rem)] font-extrabold leading-[.83] tracking-[-.065em] text-[#173f38]">
                Explore More.<br />
                <span className="relative inline-block text-[#fffdf6] [text-shadow:0_4px_0_#2a8067]">Survive Smarter.<span className="title-swoop" aria-hidden="true" /></span>
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-8 text-[#456c68] sm:text-xl">Clear routes, clever builds, and field-tested strategies for every stage of your Polworld adventure.</p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a href="#guides" className="rounded-2xl bg-[#ff786e] px-7 py-4 font-extrabold text-white shadow-[0_7px_0_#ce514b] transition hover:-translate-y-1">Start Exploring <span aria-hidden="true">→</span></a>
                <a href="#about" className="rounded-2xl border-2 border-[#287a68]/20 bg-white/55 px-7 py-4 font-extrabold text-[#215f53] backdrop-blur transition hover:bg-white">Discover the Game</a>
              </div>
              <div className="mt-10 flex flex-wrap gap-7 text-sm font-bold text-[#416d66]">
                <span>✓ Beginner friendly</span><span>✓ Practical routes</span><span>✓ Easy to scan</span>
              </div>
            </div>

            <div className="hero-art relative mx-auto h-[430px] w-full max-w-[570px] lg:h-[520px]" aria-label="A playful illustrated island landscape">
              <div className="floating-badge badge-top"><span className="text-xl">✦</span><div><b>120+</b><small>Field notes</small></div></div>
              <div className="floating-badge badge-bottom"><span className="text-xl">⌖</span><div><b>Map ready</b><small>Routes & resources</small></div></div>
              <div className="island island-back" />
              <div className="island island-main">
                <span className="tree tree-a" /><span className="tree tree-b" /><span className="tree tree-c" />
                <span className="path" />
                <div className="pal" aria-hidden="true"><span className="pal-ear left" /><span className="pal-ear right" /><span className="pal-face"><i /><i /></span><span className="pal-pack" /></div>
              </div>
              <div className="island island-small" />
            </div>
          </div>
        </div>
        <div className="hill hill-back" aria-hidden="true" />
        <div className="hill hill-front" aria-hidden="true" />
      </section>

      <section id="about" className="relative px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1260px] gap-14 lg:grid-cols-[.82fr_1.18fr] lg:items-center">
          <div>
            <p className="eyebrow">Welcome, Explorer</p>
            <h2 className="section-title mt-4">A wild world.<br />Your own story.</h2>
            <p className="mt-7 max-w-lg text-lg leading-8 text-[#5a7470]">Polworld blends open-world exploration, creature companionship, crafting, and survival. Build a home, grow a capable team, and choose your own path through a landscape full of surprises.</p>
            <a href="#guides" className="mt-8 inline-flex items-center gap-3 font-extrabold text-[#24775d]">Find your next objective <span className="grid h-9 w-9 place-items-center rounded-full bg-[#dff3db]">→</span></a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <article className="overview-card sm:translate-y-8"><span className="overview-icon bg-[#e1f4d9] text-[#39915a]">⌁</span><h3>Explore Freely</h3><p>Cross forests, coastlines, ruins, and hidden corners at your own pace.</p></article>
            <article className="overview-card"><span className="overview-icon bg-[#dff4f6] text-[#2786a0]">✦</span><h3>Meet Your Team</h3><p>Discover unique companions and build a group that fits your play style.</p></article>
            <article className="overview-card sm:translate-y-8"><span className="overview-icon bg-[#ffebd5] text-[#d1774e]">⌂</span><h3>Build a Home</h3><p>Create a practical base that grows from a camp into a thriving workshop.</p></article>
            <article className="overview-card"><span className="overview-icon bg-[#eee7fb] text-[#7864b5]">◆</span><h3>Master the Systems</h3><p>Turn complex crafting and combat mechanics into confident decisions.</p></article>
          </div>
        </div>
      </section>

      <section id="guides" className="px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1360px] rounded-[42px] bg-[#eef7eb] px-5 py-16 shadow-[inset_0_1px_0_white] sm:px-10 lg:px-14">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div><p className="eyebrow">The Field Library</p><h2 className="section-title mt-3">Latest Guides</h2></div>
            <p className="max-w-md text-base leading-7 text-[#607973]">Start with the essentials, then follow your curiosity. Each guide is written to answer one clear question.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {guides.map((guide) => (
              <article key={guide.number} className="guide-card group">
                <div className={`guide-art bg-gradient-to-br ${guide.accent}`}>
                  <span className="guide-number">{guide.number}</span>
                  <span className="guide-symbol" aria-hidden="true">{guide.icon}</span>
                  <span className="guide-land" />
                </div>
                <div className="p-6">
                  <div className="mb-3 flex items-center justify-between gap-3"><span className={`rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[.1em] text-white ${guide.color}`}>{guide.category}</span><span className="text-xs font-bold text-[#82948f]">{guide.time}</span></div>
                  <h3 className="font-[var(--font-display)] text-2xl font-extrabold leading-tight tracking-[-.03em] text-[#193e39]">{guide.title}</h3>
                  <p className="mt-3 leading-7 text-[#627a75]">{guide.description}</p>
                  <a href="#guide-note" className="mt-5 inline-flex items-center gap-2 font-extrabold text-[#2b795f]">Read guide <span className="transition group-hover:translate-x-1">→</span></a>
                </div>
              </article>
            ))}
          </div>
          <p id="guide-note" className="mt-8 text-center text-sm font-semibold text-[#6f8781]">Detailed guide pages are coming in the next release.</p>
        </div>
      </section>

      <section id="faq" className="px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1200px] gap-14 lg:grid-cols-[.62fr_1.38fr]">
          <div><p className="eyebrow">Before You Set Out</p><h2 className="section-title mt-3">Questions,<br />answered.</h2><p className="mt-5 max-w-sm leading-7 text-[#617a75]">Everything you need to know about the guide and how it is maintained.</p></div>
          <div className="divide-y divide-[#cfe0d9] border-y border-[#cfe0d9]">
            {faqs.map((faq, index) => (
              <details key={faq.question} className="faq-item group" open={index === 0}>
                <summary><span>{faq.question}</span><span className="faq-plus" aria-hidden="true">+</span></summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-5 pb-8 pt-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1360px] overflow-hidden rounded-[38px] bg-[#173f38] px-7 py-10 text-[#eaf7ea] sm:px-10">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div><p className="font-[var(--font-display)] text-3xl font-extrabold tracking-[-.04em]">Ready for the next adventure?</p><p className="mt-2 text-[#afd0c4]">Bookmark the guide and never lose the trail.</p></div>
            <a href="#top" className="w-fit rounded-2xl bg-[#ff786e] px-6 py-4 font-extrabold text-white shadow-[0_6px_0_#a83f3b]">Back to the top ↑</a>
          </div>
          <div className="mt-10 flex flex-col justify-between gap-3 border-t border-white/15 pt-7 text-xs text-[#91b8ac] sm:flex-row"><span>© 2026 Polworld Guide. Made by players, for players.</span><span>Independent fan-made resource · Not affiliated with the game publisher.</span></div>
        </div>
      </footer>
    </main>
  );
}
