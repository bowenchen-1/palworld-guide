import ToolShell from "../components/tool-shell";
import { createPageMetadata } from "../lib/seo";
import TeamBuilderClient from "./team-builder-client";

export const metadata = createPageMetadata({
  title: "Palworld Team Builder - Plan a 5 Pal Party",
  description: "Build a five-Pal party for Palworld 1.0, review element and work coverage, compare partner skills, save your team locally, and share the plan.",
  keywords: ["palworld team builder"],
  path: "/team-builder",
});

export default function TeamBuilderPage() {
  const schema = { "@context": "https://schema.org", "@type": "WebApplication", name: "Palworld Team Builder", applicationCategory: "GameApplication", operatingSystem: "Any", isAccessibleForFree: true };
  return <ToolShell current="/team-builder">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <section className="team-builder-hero">
      <div><p className="database-eyebrow">Expedition planning // 5 slots</p><h1>Palworld Team Builder</h1><p>Assemble a five-Pal party, see what the roster covers, and keep every profile and breeding route one click away.</p></div>
      <aside><span>1.0 DATA</span><strong>5</strong><small>party positions</small></aside>
    </section>
    <TeamBuilderClient />
    <section className="team-builder-notes"><div><p className="database-eyebrow">How to use this planner</p><h2>Build around coverage, not a mystery score</h2></div><div><p>Start with the Pal you most want to use, then fill gaps in elements, partner skills, or utility. Duplicate species are allowed, but the planner marks them so you can decide whether repeating one role is intentional.</p><p>The summaries use the current Palworld 1.0 records in this site. They describe the selected species and do not predict passive traits, individual stats, or a universally “best” team.</p></div></section>
  </ToolShell>;
}
