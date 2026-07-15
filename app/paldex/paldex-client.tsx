"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import PalMark from "../components/pal-mark";
import { PalData, pals, WorkKey, workGlyphs, workLabels } from "../lib/game-data";
import { PALDEX_PAGE_SIZE } from "./paldex-config";

const workTypes = Object.keys(workLabels) as WorkKey[];
type SortMode = "number" | "name" | "work" | "power-low" | "power-high";
type FilterSheet = "kind" | "work" | null;
const highestWorkLevel = (pal: PalData, work: WorkKey | "all") => work === "all" ? Math.max(0, ...Object.values(pal.work)) : pal.work[work] ?? 0;
const numberValue = (pal: PalData) => Number.parseInt(pal.number, 10);

export default function PaldexClient({ initialPage = 1 }: { initialPage?: number }) {
  const [query, setQuery] = useState("");
  const [work, setWork] = useState<WorkKey | "all">("all");
  const [minimumLevel, setMinimumLevel] = useState(0);
  const [kind, setKind] = useState<"all" | PalData["kind"]>("pal");
  const [sort, setSort] = useState<SortMode>("number");
  const [filterSheet, setFilterSheet] = useState<FilterSheet>(null);
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

  const kindLabel = kind === "pal" ? "Pals only" : kind === "monster" ? "Crossover" : "All entries";
  const workLabel = work === "all" ? "All work skills" : workLabels[work];

  return <section className="database-workspace paldex-workspace" aria-label="Palworld Paldeck filters and results">
    <div className="paldex-control-bar">
      <label className="paldex-search"><span>⌕</span><input value={query} onChange={(event) => { setQuery(event.target.value); resetPagination(); }} placeholder="Search Pal name or number…" aria-label="Search Paldeck" /></label>
      <button type="button" onClick={() => setFilterSheet("kind")}><span>Entry</span><strong>{kindLabel}</strong></button>
      <button type="button" onClick={() => setFilterSheet("work")}><span>Work Skill</span><strong>{workLabel}</strong></button>
    </div>
    <div className="paldex-toolbar"><p><strong>{filtered.length}</strong> entries found <span>· page {safePage} of {pageCount}</span></p><div><label><span>Sort</span><select aria-label="Sort Paldeck" value={sort} onChange={(event) => { setSort(event.target.value as SortMode); resetPagination(); }}><option value="number">Paldeck number</option><option value="name">Name A-Z</option><option value="work">Highest work level</option><option value="power-low">Breeding power: low first</option><option value="power-high">Breeding power: high first</option></select></label><label><span>Level</span><select value={minimumLevel} onChange={(event) => { setMinimumLevel(Number(event.target.value)); resetPagination(); }}><option value="0">Any level</option>{[1, 2, 3, 4, 5, 6, 7, 8].map((level) => <option key={level} value={level}>Level {level}+</option>)}</select></label><button type="button" className="paldex-reset" onClick={resetFilters}>Reset</button></div></div>
    <div className="paldex-layout"><div>{filtered.length ? <><div className="paldex-table-wrap"><table className="paldex-table"><thead><tr><th>Pal</th><th>No.</th><th>Work Suitability</th><th>Top Role</th><th>Roles</th><th>Breeding Power</th></tr></thead><tbody>{visiblePals.map((pal) => { const strongest = Object.entries(pal.work).sort(([, a], [, b]) => b - a)[0] as [WorkKey, number] | undefined; return <tr key={pal.id} className={selected.id === pal.id ? "selected" : undefined} onMouseEnter={() => setSelected(pal)} onFocus={() => setSelected(pal)}><td><Link href={`/pals/${pal.slug}`}><PalMark pal={pal} /><span><strong>{pal.name}</strong><small>{pal.kind === "pal" ? "Pal" : "Crossover creature"}</small></span></Link></td><td>{pal.number}</td><td><p className="mini-work">{Object.entries(pal.work).length ? Object.entries(pal.work).slice(0, 5).map(([key, level]) => <span key={key} title={workLabels[key as WorkKey]}>{workGlyphs[key as WorkKey]} {level}</span>) : <span>No work</span>}</p></td><td>{strongest ? <span className="top-work">{workGlyphs[strongest[0]]} {workLabels[strongest[0]]} {strongest[1]}</span> : "None"}</td><td>{Object.keys(pal.work).length}</td><td>{pal.power}</td></tr>; })}</tbody></table></div><nav className="paldex-pagination" aria-label="Paldeck pages">{safePage > 1 ? <Link href={safePage === 2 ? "/paldex" : `/paldex/page/${safePage - 1}`}>← Previous</Link> : <span aria-disabled="true">← Previous</span>}<div className="paldex-pagination-pages">{Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => <Link key={page} href={page === 1 ? "/paldex" : `/paldex/page/${page}`} aria-current={page === safePage ? "page" : undefined}>{page}</Link>)}</div>{safePage < pageCount ? <Link href={`/paldex/page/${safePage + 1}`}>Next →</Link> : <span aria-disabled="true">Next →</span>}</nav></> : <div className="paldex-empty"><span>⌕</span><h2>No Pals match these filters</h2><p>Try another search or clear one of the filters.</p><button type="button" onClick={resetFilters}>Reset filters</button></div>}</div>
      <aside className="pal-detail"><header><PalMark pal={selected} /><div><p>Paldeck No. {selected.number}</p><h2>{selected.name}</h2><span className="entry-kind">{selected.kind === "pal" ? "Pal" : "Crossover creature"}</span></div></header><div className="breeding-rank"><span>Breeding power</span><strong>{selected.power}</strong><small>Current 1.0 species value used by standard breeding calculations.</small></div><h3>Work Suitability</h3><div className="work-grid">{Object.entries(selected.work).length ? Object.entries(selected.work).map(([key, level]) => <span key={key}><i>{workGlyphs[key as WorkKey]} {level}</i><b>{workLabels[key as WorkKey]}</b></span>) : <p>No base work suitability recorded.</p>}</div><div className="profile-data-note"><strong>Why no old combat stats?</strong><p>Version 1.0 rebalanced Pal data. This launch profile only shows fields verified in the current snapshot, instead of mixing in outdated HP or attack values.</p></div><Link className="full-profile-link" href={`/pals/${selected.slug}`}>Open {selected.name} profile →</Link></aside>
    </div>
    {filterSheet ? <div className="paldex-filter-backdrop" role="presentation" onClick={() => setFilterSheet(null)}><section className="paldex-filter-sheet" role="dialog" aria-modal="true" aria-label={filterSheet === "kind" ? "Choose entry type" : "Choose work skill"} onClick={(event) => event.stopPropagation()}><h2>{filterSheet === "kind" ? "Entry Type" : "Work Skill"}</h2>{filterSheet === "kind" ? <div className="paldex-filter-options"><button type="button" className={kind === "pal" ? "active" : ""} onClick={() => { setKind("pal"); resetPagination(); setFilterSheet(null); }}>Pals only</button><button type="button" className={kind === "monster" ? "active" : ""} onClick={() => { setKind("monster"); resetPagination(); setFilterSheet(null); }}>Crossover creatures</button><button type="button" className={kind === "all" ? "active" : ""} onClick={() => { setKind("all"); resetPagination(); setFilterSheet(null); }}>All entries</button></div> : <div className="paldex-filter-options work-options"><button type="button" className={work === "all" ? "active" : ""} onClick={() => { setWork("all"); resetPagination(); setFilterSheet(null); }}>All work skills</button>{workTypes.map((item) => <button type="button" key={item} className={work === item ? "active" : ""} onClick={() => { setWork(item); resetPagination(); setFilterSheet(null); }}>{workGlyphs[item]} {workLabels[item]}</button>)}</div>}<div className="paldex-filter-actions"><button type="button" onClick={() => setFilterSheet(null)}>Cancel</button></div></section></div> : null}
  </section>;
}
