import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PalMark from "../../components/pal-mark";
import SiteHeader from "../../components/site-header";
import { findPal, pals, WorkKey, workGlyphs, workLabels } from "../../lib/game-data";
import { siteUrl } from "../../site-config";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return pals.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pal = findPal(slug);
  if (!pal) return {};
  const title = `${pal.name} Palworld Guide — 1.0 Paldeck Data`;
  const description = `${pal.name} in Palworld 1.0: Paldeck No. ${pal.number}, current work suitability, breeding power, calculator links, and related Pal profiles, updated July 2026.`;
  return { title, description, alternates: { canonical: `/pals/${pal.slug}` }, openGraph: { title, description, url: `/pals/${pal.slug}`, type: "article" } };
}

export default async function PalProfilePage({ params }: Props) {
  const { slug } = await params;
  const pal = findPal(slug);
  if (!pal) notFound();
  const workEntries = Object.entries(pal.work) as [WorkKey, number][];
  const related = pals.filter((item) => item.id !== pal.id && item.kind === pal.kind).sort((a, b) => Math.abs(a.power - pal.power) - Math.abs(b.power - pal.power)).slice(0, 4);
  const strongest = [...workEntries].sort((a, b) => b[1] - a[1])[0];
  const schema = { "@context": "https://schema.org", "@type": "WebPage", name: `${pal.name} Palworld Guide`, url: `${siteUrl}/pals/${pal.slug}`, description: `${pal.name} profile for Palworld 1.0`, isPartOf: { "@type": "CollectionPage", name: "Palworld Paldeck Database", url: `${siteUrl}/paldex` }, dateModified: "2026-07-14" };

  return <main className="pal-profile-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <div className="profile-nav"><SiteHeader current="/paldex" /></div>
    <section className="profile-hero"><div className="profile-hero-copy"><p className="database-eyebrow">Palworld 1.0 · Paldeck No. {pal.number}</p><h1>{pal.name} Palworld Guide</h1><p>{pal.name} is {pal.kind === "pal" ? "a current Pal" : "a crossover creature"} in version 1.0. This profile lists the verified work-suitability spread and breeding power used by our current Palworld tools.</p><div><Link href="/breeding-calculator">Find {pal.name} breeding pairs →</Link><Link href="/paldex">Back to Paldeck</Link></div></div><PalMark pal={pal} /></section>
    <section className="profile-content"><div className="profile-main"><section><p className="database-eyebrow">Verified data</p><h2>{pal.name} 1.0 Paldeck data</h2><div className="profile-stat-strip"><span><small>Paldeck</small><strong>{pal.number}</strong></span><span><small>Breeding power</small><strong>{pal.power}</strong></span><span><small>Work roles</small><strong>{workEntries.length}</strong></span><span><small>Entry type</small><strong>{pal.kind === "pal" ? "Pal" : "Guest"}</strong></span></div><p>Breeding power is a hidden species value used by many standard Palworld breeding outcomes. It does not describe combat strength, rarity, or catch difficulty. Use it through the calculator instead of treating a lower or higher number as a tier.</p></section>
      <section><h2>{pal.name} work suitability</h2>{workEntries.length ? <><div className="profile-work-grid">{workEntries.map(([key, level]) => <article key={key}><span>{workGlyphs[key]}</span><div><strong>{workLabels[key]}</strong><small>Base level {level}</small></div><b>{level}</b></article>)}</div><p>{strongest ? `${pal.name}'s highest recorded base role is ${workLabels[strongest[0]]} at level ${strongest[1]}. ` : ""}Your save can show different effective levels after condensation, applied techniques, and base-wide effects.</p></> : <p>No ordinary base work suitability is recorded for this crossover entry.</p>}</section>
      <section><h2>How to use this {pal.name} profile</h2><p>Open the Palworld breeding calculator to search backward from {pal.name}, or compare nearby Pal profiles below. The database intentionally keeps patch-sensitive combat values out until the current 1.0 values can be verified as a complete set.</p><div className="profile-callout"><strong>Data freshness</strong><p>Game version 1.0 · community game-file snapshot updated July 12 and cross-checked July 14, 2026.</p></div></section>
    </div><aside className="profile-related"><p className="database-eyebrow">Similar breeding power</p><h2>Related Pal profiles</h2>{related.map((item) => <Link href={`/pals/${item.slug}`} key={item.id}><PalMark pal={item} small /><span><strong>{item.name}</strong><small>No. {item.number} · Power {item.power}</small></span><b>→</b></Link>)}</aside></section>
    <footer className="database-footer"><span>Independent fan-made Palworld resource.</span><Link href="/paldex">Browse all 289 Pals →</Link></footer>
  </main>;
}
