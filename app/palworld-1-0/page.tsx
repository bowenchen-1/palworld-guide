import Link from "next/link";
import ToolShell from "../components/tool-shell";
import { createPageMetadata } from "../lib/seo";
import { siteUrl } from "../site-config";

export const metadata = createPageMetadata({
  title: "Palworld 1.0 Guide — Release Date, Pals & Tools",
  description: "Palworld 1.0 launched July 10, 2026. See the release-date answer, major gameplay changes, current Pal data, breeding tools, and next steps in one launch hub.",
  keywords: ["palworld 1.0"],
  path: "/palworld-1-0",
  type: "article",
  publishedTime: "2026-07-10",
  modifiedTime: "2026-07-14",
});

const faqs = [
  ["When did Palworld 1.0 come out?", "Palworld 1.0 was released on July 10, 2026. It is available now, so players no longer need to convert a regional release time."],
  ["How many Pals are in the current database?", "Our version 1.0 snapshot contains 289 Pals plus 11 crossover creatures, for 300 searchable breeding records."],
  ["Did Palworld 1.0 change breeding?", "Yes. Breeding power values and many results were revised, which is why an Early Access calculator can return the wrong child."],
  ["Are old Palworld mods compatible with 1.0?", "Do not assume so. Check each mod author's current release notes and back up your save before loading a mod built for an older game version."],
];

const changes = [
  ["Pal roster", "The Paldeck expanded and numbering changed. Search the current database instead of relying on an old 137-entry list.", "/paldex", "Open the 1.0 Paldeck"],
  ["Breeding results", "Species power values and combinations were reworked, so old parent pairs can produce a different egg.", "/?mode=parents", "Use the 1.0 calculator"],
  ["Work suitability", "Base work now uses a broader progression, with current innate values reaching level 8 before player upgrades.", "/paldex", "Compare base workers"],
  ["World progression", "The launch update adds new regions, endgame progression, systems, and balance changes that make old route advice patch-sensitive.", "/#popular", "Browse current guides"],
];

export default function PalworldOnePage() {
  const articleSchema = { "@context": "https://schema.org", "@type": "Article", headline: "Palworld 1.0 Guide — Release Date, Pals and Tools", datePublished: "2026-07-10", dateModified: "2026-07-14", mainEntityOfPage: `${siteUrl}/palworld-1-0`, author: { "@type": "Organization", name: "Palworld Field Guide" } };
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) };
  return <ToolShell current="/palworld-1-0" breadcrumb={[{ name: "Home", path: "/" }, { name: "Palworld 1.0", path: "/palworld-1-0" }]}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    <section className="database-hero one-hero"><div><p className="database-eyebrow">Launch status · live now</p><h1>Palworld 1.0 Guide</h1><p>Palworld 1.0 was released on July 10, 2026. Start here for the clear release-date answer, current Pal data, revised breeding results, and practical tools.</p></div><div className="version-orbit" aria-hidden="true"><span>1.0</span><i>JUL 10</i></div></section>
    <section className="release-answer"><p className="database-eyebrow">The short answer</p><h2>Palworld 1.0 is out now.</h2><p>The Palworld 1.0 release date was <strong>July 10, 2026</strong>. Searches for “Palworld 1.0 release time” now have a simpler answer: the launch has already happened in every region.</p><div><span><b>July 10, 2026</b>Global release date</span><span><b>289</b>Current Pals indexed</span><span><b>300</b>Breeding records</span></div></section>
    <section className="one-changes"><div className="one-heading"><p className="database-eyebrow">What changed</p><h2>Your old bookmarks need a version check.</h2><p>Version 1.0 changes enough core data that Early Access breeding charts, work rankings, and some progression advice can be misleading.</p></div><div className="one-change-grid">{changes.map(([title, body, href, cta], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{body}</p><Link href={href}>{cta} →</Link></article>)}</div></section>
    <section className="database-seo-copy"><div><p className="database-eyebrow">Patch-aware workflow</p><h2>What to do after the version 1.0 update</h2><ol className="one-checklist"><li><b>Back up important saves</b><span>Make a copy before testing old mods or changing a long-running server.</span></li><li><b>Recheck breeding projects</b><span>Confirm both parents in the current calculator before spending cake.</span></li><li><b>Audit base workers</b><span>Use current work-suitability levels instead of an Early Access tier list.</span></li><li><b>Update mods individually</b><span>Read the author&apos;s compatibility note; a game launch does not make every mod safe automatically.</span></li></ol></div><aside><h2>Palworld 1.0 FAQ</h2>{faqs.map(([question, answer], index) => <details key={question} open={index === 0}><summary>{question}</summary><p>{answer}</p></details>)}</aside></section>
  </ToolShell>;
}
