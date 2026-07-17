import Link from "next/link";
import ToolShell from "../components/tool-shell";
import { createPageMetadata } from "../lib/seo";
import { palCounts } from "../lib/game-data";

const officialPatchNotesUrl = "https://store.steampowered.com/news/app/1623730/view/686383649529010623";
const officialReleaseAnnouncementUrl = "https://www.pocketpair.jp/en/game-news/palworld-1-0-official-launch-trailer-unveiled/";

export const metadata = createPageMetadata({
  title: "Palworld 1.0 Release Date, Time & Patch Notes",
  description:
    "Find the Palworld 1.0 release date and time, read the latest patch notes, and see the game data and guides updated for the current version.",
  keywords: ["palworld 1.0 release date", "palworld 1.0 release time", "palworld 1.0 patch notes"],
  path: "/updates",
});

export default function UpdatesPage() {
  return (
    <ToolShell current="/updates" breadcrumb={[{ name: "Home", path: "/" }, { name: "Updates", path: "/updates" }]}>
      <section className="hub-hero updates-hub-hero">
        <p className="database-eyebrow">Official release and site update center</p>
        <h1>Palworld 1.0 Release Date, Time &amp; Patch Notes</h1>
        <p>
          Start with the confirmed launch status, then read Pocketpair&apos;s official notes
          before checking the Palworld Guide data, tools, and guides updated for 1.0.
        </p>
        <section className="updates-quick-answer" aria-labelledby="quick-answer-heading">
          <div>
            <p id="quick-answer-heading">Quick answer</p>
            <strong>Palworld 1.0 is live</strong>
          </div>
          <dl>
            <div>
              <dt>Release date</dt>
              <dd>July 10, 2026</dd>
            </div>
            <div>
              <dt>Release time</dt>
              <dd>No final exact time or time zone published in the official release announcement</dd>
            </div>
            <div>
              <dt>Version status</dt>
              <dd>Palworld 1.0 is live</dd>
            </div>
          </dl>
        </section>
      </section>

      <section className="updates-content">
        <section className="official-update-copy" aria-labelledby="release-date-heading">
          <p className="database-eyebrow">Official Palworld 1.0 game updates</p>
          <h2 id="release-date-heading">Palworld 1.0 Release Date</h2>
          <p>
            Pocketpair confirmed that Palworld 1.0 released on <strong>July 10, 2026</strong>.
            The version has since launched, ending the game&apos;s Early Access period. This date
            comes from Pocketpair&apos;s official launch announcement, not from this site&apos;s data refresh.
          </p>
          <p>
            <a href={officialReleaseAnnouncementUrl} target="_blank" rel="noreferrer">
              Read Pocketpair&apos;s launch announcement ↗
            </a>
          </p>
        </section>

        <section className="official-update-copy" aria-labelledby="release-time-heading">
          <h2 id="release-time-heading">Palworld 1.0 Release Time</h2>
          <p>
            The official release announcement confirms the July 10 date, but does not state a
            final exact launch time or a launch time zone. We therefore do not publish a clock
            time or convert one for regions. Palworld 1.0 is already available now.
          </p>
        </section>

        <section className="official-update-copy official-patch-notes" aria-labelledby="patch-notes-heading">
          <h2 id="patch-notes-heading">Palworld 1.0 Patch Notes</h2>
          <p>
            The <a href={officialPatchNotesUrl} target="_blank" rel="noreferrer">official Palworld 1.0 release changelog ↗</a>
            {" "}on Steam is the source of truth for the game update. It documents the official
            release changes, including the expanded world and story content, Pal additions and
            variants, system changes, balance work, and fixes.
          </p>
          <p>
            Those are <strong>Official Palworld 1.0 patch notes</strong>. They are separate from
            the Palworld Guide database, calculator, and article maintenance described below.
          </p>
        </section>

        <section className="official-update-copy" aria-labelledby="what-changed-heading">
          <h2 id="what-changed-heading">What Changed in Palworld 1.0</h2>
          <p>
            The official changelog describes a full-release update rather than a routine site
            refresh. It introduces new exploration and story material alongside roster, gameplay,
            balance, and technical changes. For exact mechanics, values, and the complete list of
            fixes, use the official patch notes; this page does not restate unverified details.
          </p>
        </section>

        <section className="site-updates-heading" aria-labelledby="site-updates-heading">
          <p className="database-eyebrow">Palworld Guide site data and content updates</p>
          <h2 id="site-updates-heading">Palworld Guide Data and Content Updates</h2>
          <p>
            The following items describe this independent guide&apos;s coverage of version 1.0. They
            are not official game patch notes or claims made by Pocketpair.
          </p>
        </section>

        <article className="featured-update">
          <div>
            <span>Guide snapshot</span>
            <b>1.0</b>
            <small>Cross-checked July 14, 2026</small>
          </div>
          <section>
            <p className="database-eyebrow">Current site coverage</p>
            <h2>Data, tools, and guides for 1.0</h2>
            <p>
              Our current database snapshot contains {palCounts.pals} Pals ({palCounts.standardPals} standard
              and {palCounts.crossoverCreatures} crossover). We have also refreshed breeding data,
              work-suitability information, and version-sensitive guidance for the current release.
            </p>
            <div>
              <Link href="/palworld-1-0">Read the 1.0 guide →</Link>
              <Link href="/?mode=parents">Check current breeding results</Link>
            </div>
          </section>
        </article>

        <div className="update-status-grid">
          <article>
            <span>SITE DATA</span>
            <h3>Paldeck snapshot</h3>
            <strong>{palCounts.pals} Pals indexed</strong>
            <p>
              Identity, work suitability, and breeding power checked for the current guide data release.
            </p>
            <Link href="/pals">Browse Pals →</Link>
          </article>
          <article>
            <span>SITE TOOL</span>
            <h3>Breeding matrix</h3>
            <strong>300 × 300 results</strong>
            <p>
              The calculator uses the current matrix instead of the old 137-Pal Early Access dataset.
            </p>
            <Link href="/?mode=parents">Open calculator →</Link>
          </article>
          <article>
            <span>SITE CONTENT</span>
            <h3>Guide library</h3>
            <strong>24 English guides</strong>
            <p>
              Creator-video research organized into six practical game-system categories.
            </p>
            <Link href="/guides">Browse guides →</Link>
          </article>
        </div>

        <section className="update-policy">
          <p className="database-eyebrow">Publishing policy</p>
          <h2>Current fields first. Unverified fields later.</h2>
          <p>
            We do not mix old combat stats into current profiles. HP, attack, defense, movement,
            IV calculations, and comparison tools will be published only after a complete version
            1.0 dataset and formula set have been validated.
          </p>
          <div>
            <span><b>Game snapshot</b>Palworld 1.0</span>
            <span><b>Source update</b>July 12, 2026</span>
            <span><b>Last cross-check</b>July 14, 2026</span>
          </div>
        </section>

        <section className="updates-faq" aria-labelledby="updates-faq-heading">
          <p className="database-eyebrow">FAQ</p>
          <h2 id="updates-faq-heading">Palworld 1.0 release questions</h2>
          <details open>
            <summary>When was Palworld 1.0 released?</summary>
            <p>Palworld 1.0 released on July 10, 2026, and is available now.</p>
          </details>
          <details>
            <summary>What time did Palworld 1.0 launch?</summary>
            <p>Pocketpair&apos;s official release announcement confirms the date but does not publish a final exact launch time or time zone.</p>
          </details>
          <details>
            <summary>Where can I read the Palworld 1.0 patch notes?</summary>
            <p>Use the official Steam release changelog linked above for Pocketpair&apos;s complete patch notes.</p>
          </details>
          <details>
            <summary>Is Palworld 1.0 available now?</summary>
            <p>Yes. Pocketpair announced the official version as released on July 10, 2026.</p>
          </details>
          <details>
            <summary>Which Palworld Guide pages were updated for version 1.0?</summary>
            <p>The Pal database, breeding calculator, work-suitability coverage, 1.0 guide, and guide library use the current site data snapshot or link to version-aware content.</p>
          </details>
        </section>
      </section>
    </ToolShell>
  );
}
