import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PalMark from "../../components/pal-mark";
import SiteHeader from "../../components/site-header";
import { catalogPals, findPal, palCounts, WorkKey, workGlyphs, workLabels } from "../../lib/game-data";
import { createBreadcrumbSchema, createPageMetadata, fitMetaTitle } from "../../lib/seo";
import { siteUrl } from "../../site-config";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return catalogPals.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pal = findPal(slug);
  if (!pal) return {};
  const title = fitMetaTitle(`${pal.name} Palworld Guide — 1.0 Paldeck Data`);
  const description = `${pal.name} in Palworld 1.0: Paldeck No. ${pal.number}, current work suitability, breeding power, calculator links, and related Pal profiles, updated July 2026.`;
  return createPageMetadata({
    title,
    description,
    path: `/pals/${pal.slug}`,
    keywords: [`${pal.name.toLowerCase()} palworld`],
    type: "article",
    image: `/pals/${pal.slug}/opengraph-image`,
    imageWidth: 1200,
    imageHeight: 630,
    publishedTime: "2026-07-14",
    modifiedTime: "2026-07-14",
  });
}

export default async function PalProfilePage({ params }: Props) {
  const { slug } = await params;
  const pal = findPal(slug);
  if (!pal) notFound();
  const workEntries = Object.entries(pal.work) as [WorkKey, number][];
  const related = catalogPals.filter((item) => item.id !== pal.id && item.kind === pal.kind).sort((a, b) => Math.abs(a.power - pal.power) - Math.abs(b.power - pal.power)).slice(0, 4);
  const rankedWork = [...workEntries].sort((a, b) => b[1] - a[1]);
  const strongest = rankedWork[0];
  const secondary = rankedWork[1];
  const schema = { "@context": "https://schema.org", "@type": "WebPage", name: `${pal.name} Palworld Guide`, url: `${siteUrl}/pals/${pal.slug}`, description: `${pal.name} profile for Palworld 1.0`, isPartOf: { "@type": "CollectionPage", name: "Palworld Pals Database", url: `${siteUrl}/pals` }, dateModified: "2026-07-14" };
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Pals", path: "/pals" },
    { name: pal.name, path: `/pals/${pal.slug}` },
  ]);

  return <main id="main-content" className="pal-profile-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <div className="profile-nav"><SiteHeader current="/pals" /></div>
    <section className="profile-hero"><div className="profile-hero-copy"><nav className="profile-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>›</span><Link href="/pals">Pals</Link><span>›</span><b>{pal.name}</b></nav><p className="database-eyebrow">Palworld 1.0 · Paldeck No. {pal.number}</p><h1>{pal.name} Palworld Guide</h1><p>{pal.name} is {pal.kind === "pal" ? "a current Pal" : "a crossover creature"} in version 1.0. This profile lists the verified work-suitability spread and breeding power used by our current Palworld tools.</p><div><Link href={`/?mode=target&target=${pal.id}`}>Find {pal.name} breeding pairs →</Link><Link href="/pals">Back to Pals</Link></div></div><PalMark pal={pal} showNewBadge /></section>
    <section className="profile-content"><div className="profile-main"><section><p className="database-eyebrow">Verified data</p><h2>{pal.name} 1.0 Paldeck data</h2><div className="profile-stat-strip"><span><small>Paldeck</small><strong>{pal.number}</strong></span><span><small>Breeding power</small><strong>{pal.power}</strong></span><span><small>Work roles</small><strong>{workEntries.length}</strong></span><span><small>Entry type</small><strong>{pal.kind === "pal" ? "Pal" : "Guest"}</strong></span></div><div className="profile-role-summary"><article><span>Primary work role</span><strong>{strongest ? `${workGlyphs[strongest[0]]} ${workLabels[strongest[0]]}` : "No base role"}</strong><small>{strongest ? `Base level ${strongest[1]}` : "No ordinary suitability recorded"}</small></article><article><span>Secondary role</span><strong>{secondary ? `${workGlyphs[secondary[0]]} ${workLabels[secondary[0]]}` : "Specialist profile"}</strong><small>{secondary ? `Base level ${secondary[1]}` : "One or zero recorded roles"}</small></article><article><span>Data coverage</span><strong>Current 1.0 snapshot</strong><small>Identity, work suitability, and breeding power verified</small></article></div><p>Breeding power is a hidden species value used by many standard Palworld breeding outcomes. It does not describe combat strength, rarity, or catch difficulty. Use it through the calculator instead of treating a lower or higher number as a tier.</p></section>
      <section><h2>{pal.name} work suitability</h2>{workEntries.length ? <><div className="profile-work-grid">{workEntries.map(([key, level]) => <article key={key}><span>{workGlyphs[key]}</span><div><strong>{workLabels[key]}</strong><small>Base level {level}</small></div><b>{level}</b></article>)}</div><p>{strongest ? `${pal.name}'s highest recorded base role is ${workLabels[strongest[0]]} at level ${strongest[1]}. ` : ""}Your save can show different effective levels after condensation, applied techniques, and base-wide effects.</p></> : <p>No ordinary base work suitability is recorded for this crossover entry.</p>}</section>
      <section><h2>Plan with {pal.name}</h2><p>Use the current tools to turn this profile into a breeding or base-planning decision. These links keep the same verified 1.0 data context.</p><div className="profile-action-grid"><Link href={`/?mode=target&target=${pal.id}`}><span>01</span><strong>Search breeding pairs</strong><small>Use {pal.name} as a target or parent.</small></Link><Link href="/pals"><span>02</span><strong>Compare work roles</strong><small>Filter the Pal list by suitability and level.</small></Link><Link href="/guides/work-suitability-basics"><span>03</span><strong>Understand work levels</strong><small>Read the practical work-suitability guide.</small></Link></div><div className="profile-callout"><strong>Data freshness</strong><p>Game version 1.0 · community game-file snapshot updated July 12 and cross-checked July 14, 2026.</p></div></section>
    </div><aside className="profile-related"><p className="database-eyebrow">Similar breeding power</p><h2>Related Pal profiles</h2>{related.map((item) => <Link href={`/pals/${item.slug}`} key={item.id}><PalMark pal={item} small /><span><strong>{item.name}</strong><small>No. {item.number} · Power {item.power}</small></span><b>→</b></Link>)}</aside></section>
    <footer className="database-footer"><span>Independent fan-made Palworld resource.</span><Link href="/pals">Browse all {palCounts.pals} Pals →</Link></footer>
  </main>;
}
