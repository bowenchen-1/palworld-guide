"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import PalMark from "../components/pal-mark";
import { PalData, pals, WorkKey, workGlyphs, workLabels } from "../lib/game-data";

const workTypes = Object.keys(workLabels) as WorkKey[];

export default function PaldexClient() {
  const [query, setQuery] = useState("");
  const [work, setWork] = useState<WorkKey | "all">("all");
  const [kind, setKind] = useState<"all" | PalData["kind"]>("pal");
  const [selected, setSelected] = useState<PalData>(pals.find((pal) => pal.name === "Sekhmet") ?? pals[0]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return pals.filter((pal) => (!needle || pal.name.toLowerCase().includes(needle) || pal.number.toLowerCase().includes(needle)) && (kind === "all" || pal.kind === kind) && (work === "all" || pal.work[work]));
  }, [query, work, kind]);

  return <section className="database-workspace paldex-workspace" aria-label="Palworld Paldeck filters and results">
    <div className="database-filters">
      <label className="search-field"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Pal name or number…" aria-label="Search Paldeck" /></label>
      <label><span>Entry Type</span><select value={kind} onChange={(event) => setKind(event.target.value as typeof kind)}><option value="pal">Pals only</option><option value="monster">Crossover creatures</option><option value="all">All entries</option></select></label>
      <label><span>Work Suitability</span><select value={work} onChange={(event) => setWork(event.target.value as typeof work)}><option value="all">All work skills</option>{workTypes.map((item) => <option key={item} value={item}>{workLabels[item]}</option>)}</select></label>
    </div>
    <div className="paldex-layout"><div><div className="database-list-heading"><p><strong>{filtered.length}</strong> entries found</p><span>Select a card for its 1.0 profile</span></div><div className="paldex-grid">{filtered.map((pal) => <button key={pal.id} onClick={() => setSelected(pal)} className={selected.id === pal.id ? "selected" : ""}><PalMark pal={pal} /><div><strong>{pal.name}</strong><p className="mini-work">{Object.entries(pal.work).slice(0, 3).map(([key, level]) => <span key={key}>{workGlyphs[key as WorkKey]} {level}</span>)}</p><small>No. {pal.number} · Breed power {pal.power}</small></div></button>)}</div></div>
      <aside className="pal-detail"><header><PalMark pal={selected} /><div><p>Paldeck No. {selected.number}</p><h2>{selected.name}</h2><span className="entry-kind">{selected.kind === "pal" ? "Pal" : "Crossover creature"}</span></div></header><div className="breeding-rank"><span>Breeding power</span><strong>{selected.power}</strong><small>Current 1.0 species value used by standard breeding calculations.</small></div><h3>Work Suitability</h3><div className="work-grid">{Object.entries(selected.work).length ? Object.entries(selected.work).map(([key, level]) => <span key={key}><i>{workGlyphs[key as WorkKey]} {level}</i><b>{workLabels[key as WorkKey]}</b></span>) : <p>No base work suitability recorded.</p>}</div><div className="profile-data-note"><strong>Why no old combat stats?</strong><p>Version 1.0 rebalanced Pal data. This launch profile only shows fields verified in the current snapshot, instead of mixing in outdated HP or attack values.</p></div><Link className="full-profile-link" href={`/pals/${selected.slug}`}>Open {selected.name} profile →</Link></aside>
    </div>
  </section>;
}
