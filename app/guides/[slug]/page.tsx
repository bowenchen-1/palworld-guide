import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGuide, guides } from "../guide-data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return guides.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return { title: `${guide.title} — Palworld Guide`, description: guide.description };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();
  const related = guides.filter((item) => item.slug !== slug).slice(0, 3);

  return (
    <main className="min-h-screen bg-[#fffdf6] text-[#173b38]">
      <header className="article-nav px-5 py-5 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-5">
          <a href="/" className="flex items-center gap-3" aria-label="Palworld Guide home">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#1e7756] font-extrabold text-white">P</span>
            <span className="font-[var(--font-display)] text-lg font-extrabold tracking-[-.03em]">PALWORLD <span className="hidden text-[#6c8a84] sm:inline">FIELD GUIDE</span></span>
          </a>
          <a href="/#guides" className="rounded-full border border-[#2b6f5b]/15 bg-white/70 px-5 py-3 text-sm font-extrabold text-[#286552]">All Guides</a>
        </div>
      </header>

      <section className="article-hero px-5 pb-20 pt-14 sm:px-8 lg:px-12 lg:pt-20">
        <div className="mx-auto max-w-[1100px]">
          <a href="/#guides" className="mb-8 inline-flex items-center gap-2 text-sm font-extrabold text-[#397563]">← Back to the Field Library</a>
          <div className="grid gap-10 lg:grid-cols-[1fr_300px] lg:items-end">
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-3 text-xs font-extrabold uppercase tracking-[.14em] text-[#e45f58]"><span>{guide.category}</span><span className="h-1 w-1 rounded-full bg-[#e45f58]" /><span>Palworld 1.0</span></div>
              <h1 className="font-[var(--font-display)] text-[clamp(3.4rem,7vw,6.6rem)] font-extrabold leading-[.88] tracking-[-.06em] text-[#173f38]">{guide.title}</h1>
              <p className="mt-7 max-w-3xl text-xl leading-8 text-[#52726c]">{guide.description}</p>
            </div>
            <div className="rounded-[26px] border border-white/70 bg-white/65 p-6 shadow-[0_16px_40px_rgba(34,90,74,.08)] backdrop-blur">
              <div className="grid grid-cols-2 gap-5 text-sm"><div><span className="block text-xs font-bold uppercase tracking-wider text-[#8aa099]">Difficulty</span><b className="mt-1 block">{guide.difficulty}</b></div><div><span className="block text-xs font-bold uppercase tracking-wider text-[#8aa099]">Reading</span><b className="mt-1 block">{guide.readTime}</b></div></div>
              <p className="mt-5 border-t border-[#dfe9e3] pt-4 text-xs font-semibold text-[#6d8981]">Last updated {guide.updated}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <p className="text-xs font-extrabold uppercase tracking-[.17em] text-[#e0645c]">In this guide</p>
            <nav className="mt-5 border-l border-[#ceded7]" aria-label="Table of contents">
              {guide.sections.map((section, index) => <a key={section.id} href={`#${section.id}`} className="toc-link"><span>{String(index + 1).padStart(2, "0")}</span>{section.title}</a>)}
            </nav>
          </aside>

          <article className="min-w-0">
            <section className="takeaway-box">
              <p className="text-xs font-extrabold uppercase tracking-[.17em] text-[#2d765d]">The short version</p>
              <p className="mt-3 font-[var(--font-display)] text-2xl font-bold leading-9 text-[#1b4b40]">{guide.takeaway}</p>
            </section>

            <section className="article-section">
              <h2>Before you begin</h2>
              <div className="check-grid">{guide.checklist.map((item) => <div key={item} className="check-item"><span>✓</span>{item}</div>)}</div>
            </section>

            {guide.sections.map((section) => (
              <section id={section.id} key={section.id} className="article-section scroll-mt-8">
                <h2>{section.title}</h2>
                {section.intro && <p className="section-intro">{section.intro}</p>}
                {section.steps && <div className="step-list">{section.steps.map((step, index) => <div className="article-step" key={step.title}><span>{index + 1}</span><div><h3>{step.title}</h3><p>{step.body}</p></div></div>)}</div>}
                {section.bullets && <ul className="article-bullets">{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
                {section.tip && <div className="field-tip"><b>Field note</b><p>{section.tip}</p></div>}
              </section>
            ))}

            <section className="source-box">
              <div><p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#769089]">Verification & further reading</p><p className="mt-2 text-sm leading-6 text-[#657d77]">Palworld changes over time. This guide prioritizes current 1.0 systems and links to primary or community reference material for deeper checking.</p></div>
              <div className="mt-5 flex flex-wrap gap-3">{guide.sources.map((source) => <a key={source.href} href={source.href} target="_blank" rel="noreferrer" className="source-link">{source.label} ↗</a>)}</div>
            </section>
          </article>
        </div>
      </div>

      <section className="bg-[#eef7eb] px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1200px]"><p className="eyebrow">Keep exploring</p><h2 className="mt-3 font-[var(--font-display)] text-5xl font-extrabold tracking-[-.05em]">Related guides</h2><div className="mt-9 grid gap-5 md:grid-cols-3">{related.map((item) => <a key={item.slug} href={`/guides/${item.slug}`} className="related-card"><span>{item.category}</span><h3>{item.title}</h3><p>{item.description}</p><b>Read guide →</b></a>)}</div></div>
      </section>

      <footer className="bg-[#173f38] px-5 py-8 text-center text-xs text-[#a7c9be]">Independent fan-made resource · Palworld is a trademark of its respective owner.</footer>
    </main>
  );
}
