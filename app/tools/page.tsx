import type { Metadata } from "next";
import Link from "next/link";
import HomeToolBoard from "../components/home-tool-board";
import ToolLab from "../components/tool-lab";
import ToolShell from "../components/tool-shell";

export const metadata: Metadata = {
  title: "Palworld Tools & Calculators (1.0) | Field Guide",
  description:
    "Use current Palworld tools for version 1.0: breeding results, Pal lookup, work suitability, resource planning, incubation time, and base roster planning.",
  keywords: ["palworld tools"],
  alternates: { canonical: "/tools" },
};

export default function ToolsPage() {
  return (
    <ToolShell current="/tools">
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
            Quick inputs live here; complete workflows stay on their dedicated
            pages.
          </p>
        </div>
        <HomeToolBoard />
        <div className="hub-tool-links">
          <Link href="/breeding-calculator">
            <span>◉</span>
            <div>
              <h3>Full Breeding Calculator</h3>
              <p>
                Parents → child, target → parents, and complete current
                combinations.
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
