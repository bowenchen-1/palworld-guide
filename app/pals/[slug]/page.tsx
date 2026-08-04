import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import breedingMatrix from "../../../public/data/breeding.json";
import { findParentPairs } from "../../breeding-calculator/breeding/core";
import PalMark from "../../components/pal-mark";
import PalDropsLocationsSection from "../../components/pal-drops-locations";
import PalDetailsSections from "../../components/pal-details-sections";
import PalPracticalGuide from "../../components/pal-practical-guide";
import { ElementIcon, PartnerSkillIcon, WorkSuitabilityIcon } from "../../components/pal-icons";
import SiteHeader from "../../components/site-header";
import { catalogPals, findPal, findPalActiveSkills, findPalDescription, findPalDetail, findPalIntro, palCounts, pals, type BreedingData, WorkKey, workLabels } from "../../lib/game-data";
import { createBreadcrumbSchema, createPageMetadata } from "../../lib/seo";
import { findPalDropsLocations } from "../../lib/pal-drops-locations";
import { siteUrl } from "../../site-config";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return catalogPals.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pal = findPal(slug);
  if (!pal) return {};
  const title = `${pal.name} Palworld: Breeding, Location, Skills, Drops & Stats`;
  const description = findPalDescription(pal.slug)?.description ?? `${pal.name} Palworld 1.0 guide: Paldeck No. ${pal.number}, elements, partner skill, drops, locations, work suitability, breeding power, and parent combinations.`;
  const metadata = createPageMetadata({
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
  return {
    ...metadata,
    alternates: {
      canonical: `${siteUrl}/pals/${pal.slug}`,
      languages: {
        en: `${siteUrl}/pals/${pal.slug}`,
        zh: `${siteUrl}/zh/pals/${pal.slug}`,
        "x-default": `${siteUrl}/pals/${pal.slug}`,
      },
    },
  };
}

export default async function PalProfilePage({ params }: Props) {
  const { slug } = await params;
  const pal = findPal(slug);
  if (!pal) notFound();
  const dropsLocations = findPalDropsLocations(pal.slug);
  if (!dropsLocations) notFound();
  const activeSkills = findPalActiveSkills(pal.slug);
  const detail = findPalDetail(pal.slug);
  const intro = findPalIntro(pal.slug);
  const detailStat = (key: string) => detail?.stats[key]?.value ?? null;
  const detailMovement = (key: string) => detail?.movement[key]?.value ?? null;
  const hp = pal.stats.hp ?? detailStat("Health");
  const defense = pal.stats.defense ?? detailStat("Defense");
  const rarity = pal.rarity ?? detailStat("Rarity");
  const price = pal.price ?? detailStat("Gold Coin");
  const stamina = pal.stats.stamina ?? detailMovement("Stamina");
  const runSpeed = pal.movement.run ?? detailMovement("RunSpeed");
  const rideSpeed = pal.movement.rideSprint ?? detailMovement("RideSprintSpeed");
  const meleeAttack = pal.stats.meleeAttack ?? detailStat("MeleeAttack");
  const rangedAttack = pal.stats.rangedAttack ?? detailStat("Attack");
  const support = pal.stats.support ?? detailStat("Support");
  const craftSpeed = pal.stats.craftSpeed ?? detailStat("Work Speed");
  const breedingPairs = findParentPairs(breedingMatrix as BreedingData, new Map(pals.map((item) => [item.id, item])), pal);
  const workEntries = Object.entries(pal.work) as [WorkKey, number][];
  const related = catalogPals.filter((item) => item.id !== pal.id && item.kind === pal.kind).sort((a, b) => Math.abs(a.power - pal.power) - Math.abs(b.power - pal.power)).slice(0, 4);
  const rankedWork = [...workEntries].sort((a, b) => b[1] - a[1]);
  const strongest = rankedWork[0];
  const pageUrl = `${siteUrl}/pals/${pal.slug}`;
  const schema = { "@context": "https://schema.org", "@type": "Article", "@id": `${pageUrl}#article`, headline: `${pal.name} Palworld Guide`, name: `${pal.name} Palworld Guide`, url: pageUrl, description: `${pal.name} profile for Palworld 1.0`, image: `${pageUrl}/opengraph-image`, inLanguage: "en-US", mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl }, isPartOf: { "@type": "CollectionPage", name: "Palworld Pals Database", url: `${siteUrl}/pals` }, author: { "@type": "Organization", name: "Palworld Guide", url: siteUrl }, publisher: { "@type": "Organization", name: "Palworld Guide", url: siteUrl }, datePublished: "2026-07-14", dateModified: "2026-07-14" };
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Pals", path: "/pals" },
    { name: pal.name, path: `/pals/${pal.slug}` },
  ]);

  return <main id="main-content" className="pal-profile-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <div className="profile-nav"><SiteHeader current="/pals" /></div>
    <section className="profile-hero"><div className="profile-hero-copy"><nav className="profile-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>›</span><Link href="/pals">Pals</Link><span>›</span><b>{pal.name}</b></nav><h1>{pal.name} Palworld Guide: Breeding, Locations, Skills, Drops &amp; Stats</h1><p>{intro?.intro ?? `${pal.name} is ${pal.kind === "pal" ? "a current Pal" : "a crossover creature"} in version 1.0. This profile lists the verified work-suitability spread and breeding power used by our current Palworld tools.`}</p></div><PalMark pal={pal} showNewBadge /></section>
    <section className="profile-content"><div className="profile-main"><section><p className="database-eyebrow">Verified data</p><h2>{pal.name} 1.0 Paldeck data</h2><div className="profile-stat-strip"><span><small>Paldeck</small><strong>{pal.number}</strong></span><span><small>Breeding power</small><strong>{pal.power}</strong></span><span><small>Work roles</small><strong>{workEntries.length}</strong></span><span><small>Entry type</small><strong>{pal.kind === "pal" ? "Pal" : "Guest"}</strong></span></div><div className="profile-stat-strip profile-stat-strip-details"><span><small>HP</small><strong>{hp ?? "—"}</strong></span><span><small>Defense</small><strong>{defense ?? "—"}</strong></span><span><small>Rarity</small><strong>{rarity ?? "—"}</strong></span><span><small>Sell price</small><strong>{price ?? "—"}</strong></span><span><small>Stamina</small><strong>{stamina ?? "—"}</strong></span><span><small>Food</small><strong>{pal.foodConsumption ?? "—"}</strong></span><span><small>Run speed</small><strong>{runSpeed ?? "—"}</strong></span><span><small>Ride speed</small><strong>{rideSpeed ?? "—"}</strong></span>{meleeAttack != null && <span><small>Melee attack</small><strong>{meleeAttack}</strong></span>}{rangedAttack != null && <span><small>Ranged attack</small><strong>{rangedAttack}</strong></span>}{support != null && <span><small>Support</small><strong>{support}</strong></span>}{craftSpeed != null && <span><small>Craft speed</small><strong>{craftSpeed}</strong></span>}</div><div className="profile-elements" aria-label={`${pal.name} elements`}><span>Elements</span><div>{pal.elements.map((element) => <span className="profile-element" key={element}><ElementIcon element={element} /><b>{element}</b></span>)}</div></div></section>
      {detail && <PalDetailsSections detail={detail} />}
      <PalPracticalGuide pal={pal} detail={detail} dropsLocations={dropsLocations} breedingCount={breedingPairs.length} breedingHref={`/?mode=target&target=${encodeURIComponent(pal.id)}`} />
      <section className="profile-breeding"><p className="database-eyebrow">Breeding combinations</p><h2>{pal.name} Breeding</h2>{breedingPairs.length ? <><div className="profile-breeding-list">{breedingPairs.slice(0, 3).map((result) => <Link className="profile-breeding-pair" href={`/?mode=parents&parentA=${encodeURIComponent(result.first.id)}&parentB=${encodeURIComponent(result.second.id)}`} key={`${result.first.id}-${result.second.id}`} aria-label={`View ${result.first.name} and ${result.second.name} breeding result for ${pal.name}`}><span className="profile-breeding-parent"><PalMark pal={result.first} small /><b>{result.first.name}</b></span><span className="profile-breeding-plus" aria-hidden="true">+</span><span className="profile-breeding-parent"><PalMark pal={result.second} small /><b>{result.second.name}</b></span><span className="profile-breeding-arrow" aria-hidden="true">→</span></Link>)}</div>{breedingPairs.length > 3 && <Link className="profile-breeding-more" href={`/?mode=target&target=${encodeURIComponent(pal.id)}`}>More <span aria-hidden="true">→</span></Link>}</> : <p>No direct breeding combinations are recorded for this Pal.</p>}</section>
      <section className="profile-partner-skill"><h2>{pal.name} partner skill</h2>{pal.partnerSkill.name && pal.partnerSkill.name !== "-" ? <div className="profile-partner-skill-card"><PartnerSkillIcon file={pal.partnerSkill.iconFile} label={pal.partnerSkill.name} /><div><strong>{pal.partnerSkill.name}</strong><p>{pal.partnerSkill.description ?? `The ${pal.partnerSkill.name} partner skill is unique to ${pal.name}. It identifies the special effect this Pal provides when deployed as a partner; check the in-game skill details for its exact activation conditions and values.`}</p></div></div> : <p>No partner skill is recorded for this entry.</p>}</section>
      {activeSkills?.skills.length ? <section className="profile-active-skills"><p className="database-eyebrow">Combat data</p><h2>{pal.name} active skills</h2><p>Skills listed in this Pal&apos;s current active-skill pool. Level, power and cooldown values are shown for quick comparison.</p><div className="profile-active-skills-grid">{activeSkills.skills.map((skill) => <article key={`${skill.name}-${skill.level}`}><div className="profile-active-skill-heading"><strong>{skill.name}</strong><small>{skill.type === "远程" ? "Ranged" : "Melee"} · {skill.level}</small></div><div className="profile-active-skill-stats"><span><small>Power</small><b>{skill.power}</b></span><span><small>Cooldown</small><b>{skill.cooldown}</b></span></div><p>{skill.descriptionZh}</p></article>)}</div></section> : null}
      {pal.slug === "lamball" && <section className="profile-lucky-lamball"><p className="database-eyebrow">Lucky Lamball</p><h2>Lucky Lamball in Palworld</h2><p>Lucky Lamball is a rare, sparkling variant of Lamball that can appear in the wild. It is larger than a standard Lamball and has a visible sparkle effect, making it easier to recognize while exploring.</p><p>A Lucky Lamball comes with the Lucky passive, which grants <strong>+15% Work Speed</strong> and <strong>+15% Attack</strong>. This is separate from Lamball&apos;s Fluffy Shield partner skill and does not change the base Lamball data shown above.</p></section>}
      <PalDropsLocationsSection data={dropsLocations} />
      <section><h2>{pal.name} work suitability</h2>{workEntries.length ? <><div className="profile-work-grid">{workEntries.map(([key, level]) => <article key={key}><WorkSuitabilityIcon work={key} /><div><strong>{workLabels[key]}</strong><small>Base level {level}</small></div><b>{level}</b></article>)}</div><p>{strongest ? `${pal.name}'s highest recorded base role is ${workLabels[strongest[0]]} at level ${strongest[1]}. ` : ""}Your save can show different effective levels after condensation, applied techniques, and base-wide effects.</p></> : <p>No ordinary base work suitability is recorded for this crossover entry.</p>}</section>
      <section><h2>Plan with {pal.name}</h2><p>Use the current tools to turn this profile into a breeding or base-planning decision. These links keep the same verified 1.0 data context.</p><div className="profile-action-grid"><Link href={`/?mode=target&target=${encodeURIComponent(pal.id)}`}><span>01</span><strong>Search breeding pairs</strong><small>Use {pal.name} as a target or parent.</small></Link><Link href="/pals"><span>02</span><strong>Compare work roles</strong><small>Filter the Pal list by suitability and level.</small></Link><Link href="/guides/work-suitability-basics"><span>03</span><strong>Understand work levels</strong><small>Read the practical work-suitability guide.</small></Link></div><div className="profile-callout"><strong>Data freshness</strong><p>Game version 1.0 · community game-file snapshot updated July 12 and cross-checked July 14, 2026.</p></div></section>
    </div><aside className="profile-related"><p className="database-eyebrow">Similar breeding power</p><h2>Related Pal profiles</h2>{related.map((item) => <Link href={`/pals/${item.slug}`} key={item.id}><PalMark pal={item} small /><span><strong>{item.name}</strong><small>No. {item.number} · Power {item.power}</small></span><b>→</b></Link>)}</aside></section>
    <footer className="database-footer"><span>Independent fan-made Palworld resource.</span><Link href="/pals">Browse all {palCounts.pals} Pals →</Link></footer>
  </main>;
}
