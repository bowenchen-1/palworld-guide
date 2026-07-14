import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "./components/site-header";

export const metadata: Metadata = {
  title: "Page Not Found | Palworld Guide",
  description: "This Palworld Guide page could not be found. Return to the breeding calculator, Paldeck database, tools, or player-researched guides.",
};

export default function NotFound() {
  return <main id="main-content" className="not-found-page">
    <div className="database-header"><SiteHeader /></div>
    <section>
      <p className="terminal-kicker"><span /> Navigation signal lost</p>
      <strong>404</strong>
      <h1>Page not found</h1>
      <p>The requested field record is not in this database. Continue with one of the verified Palworld tools or guides below.</p>
      <div><Link href="/">Breeding calculator</Link><Link href="/paldex">Browse the Paldeck</Link><Link href="/guides">Open guides</Link></div>
    </section>
  </main>;
}
