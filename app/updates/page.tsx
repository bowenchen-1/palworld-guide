import Link from "next/link";
import ToolShell from "../components/tool-shell";
import { createPageMetadata } from "../lib/seo";

export const metadata = createPageMetadata({
  title: "Palworld 1.0 Patch Notes & Current Data Updates",
  description:
    "Track Palworld 1.0 patch notes, current database coverage, breeding-data refreshes, and which Field Guide tools have been updated for the latest version.",
  keywords: ["palworld 1.0 patch notes"],
  path: "/updates",
});

export default function UpdatesPage() {
  return (
    <ToolShell current="/updates" breadcrumb={[{ name: "Home", path: "/" }, { name: "Updates", path: "/updates" }]}>
      <section className="hub-hero updates-hub-hero">
        <p className="database-eyebrow">Version and data center</p>
        <h1>Palworld 1.0 Patch Notes</h1>
        <p>
          See which game version the tools cover, when the data was checked, and
          which current-version guides should replace old bookmarks.
        </p>
      </section>
      <section className="updates-content">
        <article className="featured-update">
          <div>
            <span>Current release</span>
            <b>1.0</b>
            <small>July 10, 2026</small>
          </div>
          <section>
            <p className="database-eyebrow">Latest major version</p>
            <h2>Palworld 1.0 is live</h2>
            <p>
              The launch changed Pal numbering, work suitability, breeding
              values, and progression advice. Our current database snapshot
              contains 289 Pals, 11 crossover creatures, and 300 breeding
              records.
            </p>
            <div>
              <Link href="/palworld-1-0">Read the 1.0 guide →</Link>
              <Link href="/?mode=parents">
                Check new breeding results
              </Link>
            </div>
          </section>
        </article>
        <div className="update-status-grid">
          <article>
            <span>DATA</span>
            <h3>Paldeck snapshot</h3>
            <strong>289 Pals indexed</strong>
            <p>
              Identity, work suitability, and breeding power checked for the
              current data release.
            </p>
            <Link href="/paldex">Browse Paldeck →</Link>
          </article>
          <article>
            <span>TOOL</span>
            <h3>Breeding matrix</h3>
            <strong>300 × 300 results</strong>
            <p>
              The calculator no longer relies on the old 137-Pal Early Access
              dataset.
            </p>
            <Link href="/?mode=parents">Open calculator →</Link>
          </article>
          <article>
            <span>CONTENT</span>
            <h3>Guide library</h3>
            <strong>24 English guides</strong>
            <p>
              Creator-video research organized into six practical game-system
              categories.
            </p>
            <Link href="/guides">Browse guides →</Link>
          </article>
        </div>
        <div className="update-policy">
          <p className="database-eyebrow">Publishing policy</p>
          <h2>Current fields first. Unverified fields later.</h2>
          <p>
            We do not mix old combat stats into current profiles. HP, attack,
            defense, movement, IV calculations, and comparison tools will be
            published only after a complete version 1.0 dataset and formula set
            have been validated.
          </p>
          <div>
            <span>
              <b>Game snapshot</b>Palworld 1.0
            </span>
            <span>
              <b>Source update</b>July 12, 2026
            </span>
            <span>
              <b>Last cross-check</b>July 14, 2026
            </span>
          </div>
        </div>
      </section>
    </ToolShell>
  );
}
