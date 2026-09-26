import Link from "next/link";
import SiteHeader from "./site-header";

export type LegalSection = {
  title: string;
  paragraphs?: React.ReactNode[];
  bullets?: React.ReactNode[];
};

type LegalPageProps = {
  title: string;
  intro: React.ReactNode;
  sections: LegalSection[];
};

export default function LegalPage({ title, intro, sections }: LegalPageProps) {
  return (
    <main id="main-content" className="min-h-screen bg-canvas text-foreground">
      <div className="article-nav"><SiteHeader /></div>
      <section className="article-hero px-5 pb-20 pt-14 sm:px-8 lg:px-12 lg:pt-20">
        <div className="mx-auto max-w-[1100px]">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-extrabold text-link">← Back to Palworld Guide</Link>
          <div className="max-w-4xl">
            <p className="eyebrow">Site information</p>
            <h1 className="mt-4 font-display text-[clamp(3.4rem,7vw,6.6rem)] font-extrabold leading-[.88] tracking-[-.06em] text-foreground">{title}</h1>
            <p className="mt-7 max-w-3xl text-xl leading-8 text-muted">{intro}</p>
            <p className="mt-6 text-sm font-semibold text-muted">Last updated: 2026-09-26</p>
          </div>
        </div>
      </section>

      <div className="px-5 py-20 sm:px-8 lg:px-12">
        <article className="mx-auto max-w-[900px]">
          {sections.map((section) => (
            <section className="article-section" key={section.title}>
              <h2>{section.title}</h2>
              {section.paragraphs?.map((paragraph, index) => <p className="section-intro" key={index}>{paragraph}</p>)}
              {section.bullets && <ul className="article-bullets mt-6">{section.bullets.map((bullet, index) => <li key={index}>{bullet}</li>)}</ul>}
            </section>
          ))}
        </article>
      </div>
    </main>
  );
}
