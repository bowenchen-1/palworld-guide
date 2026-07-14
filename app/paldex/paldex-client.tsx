"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import PalMark from "../components/pal-mark";
import { PalData, pals, WorkKey, workGlyphs, workLabels } from "../lib/game-data";
import { PALDEX_PAGE_SIZE } from "./paldex-config";

const workTypes = Object.keys(workLabels) as WorkKey[];
type SortMode = "number" | "name" | "work" | "power-low" | "power-high";
const highestWorkLevel = (pal: PalData, work: WorkKey | "all") => work === "all" ? Math.max(0, ...Object.values(pal.work)) : pal.work[work] ?? 0;
const numberValue = (pal: PalData) => Number.parseInt(pal.number, 10);

export default function PaldexClient({ initialPage = 1 }: { initialPage?: number }) {
  const [query, setQuery] = useState("");
  const [work, setWork] = useState<WorkKey | "all">("all");
  const [minimumLevel, setMinimumLevel] = useState(0);
  const [kind, setKind] = useState<"all" | PalData["kind"]>("pal");
  const [sort, setSort] = useState<SortMode>("number");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [selected, setSelected] = useState<PalData>(() => pals.filter((pal) => pal.kind === "pal")[(initialPage - 1) * PALDEX_PAGE_SIZE] ?? pals.find((pal) => pal.name === "Sekhmet") ?? pals[0]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return pals
      .filter((pal) => (!needle || pal.name.toLowerCase().includes(needle) || pal.number.toLowerCase().includes(needle)) && (kind === "all" || pal.kind === kind) && (work === "all" || pal.work[work]) && highestWorkLevel(pal, work) >= minimumLevel)
      .sort((a, b) => {
        if (sort === "name") return a.name.localeCompare(b.name);
        if (sort === "work") return highestWorkLevel(b, work) - highestWorkLevel(a, work) || numberValue(a) - numberValue(b);
        if (sort === "power-low") return a.power - b.power || numberValue(a) - numberValue(b);
        if (sort === "power-high") return b.power - a.power || numberValue(a) - numberValue(b);
        return numberValue(a) - numberValue(b) || a.number.localeCompare(b.number);
      });
  }, [query, work, minimumLevel, kind, sort]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PALDEX_PAGE_SIZE));
  const safePage = Math.min(currentPage, pageCount);
  const visiblePals = filtered.slice((safePage - 1) * PALDEX_PAGE_SIZE, safePage * PALDEX_PAGE_SIZE);

  const resetPagination = () => setCurrentPage(1);

  const resetFilters = () => {
    setQuery("");
    setWork("all");
    setMinimumLevel(0);
    setKind("pal");
    setSort("number");
    resetPagination();
  };

  return <section className="database-workspace paldex-workspace" aria-label="Palworld Paldeck filters and results">
    <div className="database-filters">
      <label className="search-field"><span>⌕</span><input value={query} onChange={(event) => { setQuery(event.target.value); resetPagination(); }} placeholder="Search Pal name or number…" aria-label="Search Paldeck" /></label>
      <label><span>Entry Type</span><select value={kind} onChange={(event) => { setKind(event.target.value as typeof kind); resetPagination(); }}><option value="pal">Pals only</option><option value="monster">Crossover creatures</option><option value="all">All entries</option></select></label>
      <label><span>Work Suitability</span><select value={work} onChange={(event) => { setWork(event.target.value as typeof work); resetPagination(); }}><option value="all">All work skills</option>{workTypes.map((item) => <option key={item} value={item}>{workLabels[item]}</option>)}</select></label>
      <label><span>Minimum Work Level</span><select value={minimumLevel} onChange={(event) => { setMinimumLevel(Number(event.target.value)); resetPagination(); }}><option value="0">Any level</option>{[1, 2, 3, 4, 5, 6, 7, 8].map((level) => <option key={level} value={level}>Level {level}+</option>)}</select></label>
    </div>
    <div className="paldex-toolbar"><p><strong>{filtered.length}</strong> entries found <span>· current version 1.0 data</span></p><div><label><span>Sort</span><select aria-label="Sort Paldeck" value={sort} onChange={(event) => { setSort(event.target.value as SortMode); resetPagination(); }}><option value="number">Paldeck number</option><option value="name">Name A–Z</option><option value="work">Highest work level</option><option value="power-low">Breeding power: low first</option><option value="power-high">Breeding power: high first</option></select></label><div className="paldex-view-toggle" aria-label="Paldeck view"><button type="button" className={view === "grid" ? "active" : ""} aria-pressed={view === "grid"} onClick={() => setView("grid")}>Grid</button><button type="button" className={view === "list" ? "active" : ""} aria-pressed={view === "list"} onClick={() => setView("list")}>List</button></div><button type="button" className="paldex-reset" onClick={resetFilters}>Reset</button></div></div>
    <div className="paldex-layout"><div>{filtered.length ? <><div className={`paldex-grid ${view === "list" ? "list-view" : ""}`}>{visiblePals.map((pal) => { const strongest = Object.entries(pal.work).sort(([, a], [, b]) => b - a)[0] as [WorkKey, number] | undefined; return <Link href={`/pals/${pal.slug}`} key={pal.id} onMouseEnter={() => setSelected(pal)} onFocus={() => setSelected(pal)} className={selected.id === pal.id ? "selected" : ""}><PalMark pal={pal} /><div className="paldex-card-copy"><strong>{pal.name}</strong><p className="mini-work">{Object.entries(pal.work).slice(0, 3).map(([key, level]) => <span key={key}>{workGlyphs[key as WorkKey]} {level}</span>)}</p><small>No. {pal.number} · Breed power {pal.power}</small></div><div className="paldex-card-meta"><span><small>Top role</small><b>{strongest ? `${workGlyphs[strongest[0]]} ${workLabels[strongest[0]]} ${strongest[1]}` : "No work role"}</b></span><span><small>Roles</small><b>{Object.keys(pal.work).length}</b></span><span><small>Power</small><b>{pal.power}</b></span></div></Link>; })}</div><nav className="paldex-pagination" aria-label="Paldeck pages">{safePage > 1 ? <Link href={safePage === 2 ? "/paldex" : `/paldex/page/${safePage - 1}`}>← Previous</Link> : <span aria-disabled="true">← Previous</span>}<div>{Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => <Link key={page} href={page === 1 ? "/paldex" : `/paldex/page/${page}`} aria-current={page === safePage ? "page" : undefined}>{page}</Link>)}</div>{safePage < pageCount ? <Link href={`/paldex/page/${safePage + 1}`}>Next →</Link> : <span aria-disabled="true">Next →</span>}</nav></> : <div className="paldex-empty"><span>⌕</span><h2>No Pals match these filters</h2><p>Try lowering the work level or clearing one of the filters.</p><button type="button" onClick={resetFilters}>Reset filters</button></div>}</div>
      <aside className="pal-detail"><header><PalMark pal={selected} /><div><p>Paldeck No. {selected.number}</p><h2>{selected.name}</h2><span className="entry-kind">{selected.kind === "pal" ? "Pal" : "Crossover creature"}</span></div></header><div className="breeding-rank"><span>Breeding power</span><strong>{selected.power}</strong><small>Current 1.0 species value used by standard breeding calculations.</small></div><h3>Work Suitability</h3><div className="work-grid">{Object.entries(selected.work).length ? Object.entries(selected.work).map(([key, level]) => <span key={key}><i>{workGlyphs[key as WorkKey]} {level}</i><b>{workLabels[key as WorkKey]}</b></span>) : <p>No base work suitability recorded.</p>}</div><div className="profile-data-note"><strong>Why no old combat stats?</strong><p>Version 1.0 rebalanced Pal data. This launch profile only shows fields verified in the current snapshot, instead of mixing in outdated HP or attack values.</p></div><Link className="full-profile-link" href={`/pals/${selected.slug}`}>Open {selected.name} profile →</Link></aside>
    </div>
  </section>;
}
