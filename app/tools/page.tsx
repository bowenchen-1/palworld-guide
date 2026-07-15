import Link from "next/link";
import ToolLab from "../components/tool-lab";
import ToolShell from "../components/tool-shell";
import { createPageMetadata } from "../lib/seo";

export const metadata = createPageMetadata({
  title: "Palworld Tools & Calculators (1.0) | Field Guide",
  description:
    "Use current Palworld tools for version 1.0: breeding results, Pal lookup, work suitability, resource planning, incubation time, and base roster planning.",
  keywords: ["palworld tools"],
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <ToolShell current="/tools" breadcrumb={[{ name: "Home", path: "/" }, { name: "Tools", path: "/tools" }]}>
      <section className="hub-hero tools-hub-hero">
        <p className="database-eyebrow">Current, useful, focused</p>
        <h1>Palworld Tools & Calculators</h1>
        <p>
          Start a breeding check, search current Pal data, or use a lightweight
          planning calculator. Every published tool works now—there are no empty
          coming-soon pages.
        </p>
      </section>
      <section className="hub-content">
        <div className="hub-section-heading">
          <div>
            <p className="database-eyebrow">Core tools</p>
            <h2>Search and calculate</h2>
          </div>
          <p>
          The complete breeding workspace lives on the homepage; use this hub
          to discover the other focused tools.
          </p>
        </div>
        <div className="hub-tool-links">
          <Link href="/team-builder">
            <span>05</span>
            <div>
              <h3>Team Builder</h3>
              <p>
                Assemble five Pals, review team coverage, save the roster, and
                share it with one link.
              </p>
            </div>
            <b>Open →</b>
          </Link>
          <Link href="/?mode=parents">
            <span>◉</span>
            <div>
              <h3>Full Breeding Calculator</h3>
              <p>
                Six modes: parents, target, offspring, available Pals, and
                route planning.
              </p>
            </div>
            <b>Open →</b>
          </Link>
          <Link href="/paldex">
            <span>✦</span>
            <div>
              <h3>Paldeck Database</h3>
              <p>Filter 289 Pals by name, number, and work suitability.</p>
            </div>
            <b>Open →</b>
          </Link>
        </div>
        <div className="hub-section-heading planner-heading">
          <div>
            <p className="database-eyebrow">Save-based planning</p>
            <h2>Quick calculators</h2>
          </div>
          <p>Use values shown in your own world settings.</p>
        </div>
        <div className="tools-hub-lab">
          <ToolLab />
        </div>
      </section>
    </ToolShell>
  );
}
