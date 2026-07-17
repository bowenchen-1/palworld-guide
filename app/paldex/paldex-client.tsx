"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ElementIcon, PartnerSkillIcon, WorkSuitabilityIcon } from "../components/pal-icons";
import PalMark from "../components/pal-mark";
import { catalogPals, PalData, WorkKey, workLabels } from "../lib/game-data";
import { filterPals, MatchMode, PaldexFilters, PaldexSort, parsePaldexFilters, serializePaldexFilters, sortPals } from "../lib/paldex";
import { PALDEX_PAGE_SIZE } from "./paldex-config";

const workTypes = Object.keys(workLabels) as WorkKey[];
const elementOptions = ["Neutral", "Fire", "Water", "Grass", "Electric", "Ice", "Ground", "Dark", "Dragon"];
const sortOptions: Array<{ value: PaldexSort; label: string }> = [
  { value: "number", label: "Paldeck number" },
  { value: "name", label: "Name A–Z" },
  { value: "hp", label: "HP" },
  { value: "defense", label: "Defense" },
  { value: "stamina", label: "Stamina" },
  { value: "price", label: "Price" },
  { value: "ride-speed", label: "Riding speed" },
  { value: "rarity", label: "Rarity" },
  { value: "speed", label: "Run speed" },
  { value: "work", label: "Highest work level" },
  { value: "power-low", label: "Breeding power: low first" },
  { value: "power-high", label: "Breeding power: high first" },
];
const tableColumns = ["Pal", "Number", "Element", "Work Suitability", "Partner Skill", "Rarity", "HP", "Breeding Power", "Defense", "Price", "Stamina", "Riding Speed", "Run Speed"] as const;
type Sheet = "elements" | "work" | null;

function PaldexTableHead({ frozen = false }: { frozen?: boolean }) {
  return <thead aria-hidden={frozen || undefined}><tr>{tableColumns.map((label) => <th key={label}>{label}</th>)}</tr></thead>;
}

function ElementMarks({ pal }: { pal: PalData }) {
  return <span className="element-marks">{pal.elements.map((element) => <ElementIcon key={element} element={element} />)}</span>;
}

function WorkBadges({ pal }: { pal: PalData }) {
  const entries = Object.entries(pal.work) as [WorkKey, number][];
  return entries.length ? <p className="mini-work">{entries.map(([key, level]) => <span key={key} title={workLabels[key]}><WorkSuitabilityIcon work={key} /><b>{level}</b></span>)}</p> : <span className="muted-dash">—</span>;
}

export default function PaldexClient({ initialPage: _initialPage = 1 }: { initialPage?: number }) {
  const pageSize = PALDEX_PAGE_SIZE;
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = useMemo(() => parsePaldexFilters(new URLSearchParams(searchParams.toString())), [searchParams]);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [draftElements, setDraftElements] = useState<string[]>([]);
  const [draftElementMode, setDraftElementMode] = useState<MatchMode>("any");
  const [draftWork, setDraftWork] = useState<WorkKey[]>([]);
  const [draftWorkMode, setDraftWorkMode] = useState<MatchMode>("any");
  const [draftWorkLevel, setDraftWorkLevel] = useState(0);
  const [sortOpen, setSortOpen] = useState(false);
  const tableRegionRef = useRef<HTMLDivElement>(null);
  const tableWrapRef = useRef<HTMLDivElement>(null);
  const frozenHeaderRef = useRef<HTMLDivElement>(null);
  const frozenTableRef = useRef<HTMLTableElement>(null);
  useEffect(() => {
    const tableRegion = tableRegionRef.current;
    const tableWrap = tableWrapRef.current;
    const frozenHeader = frozenHeaderRef.current;
    const frozenTable = frozenTableRef.current;
    if (!tableRegion || !tableWrap || !frozenHeader || !frozenTable) return;
    const headerOffset = window.matchMedia("(max-width: 760px)").matches ? 58 : 68;
    let frame = 0;
    const updateFrozenHeader = () => {
      frame = 0;
      const regionRect = tableRegion.getBoundingClientRect();
      const tableHeader = tableWrap.querySelector("thead");
      const headerHeight = tableHeader?.getBoundingClientRect().height ?? 56;
      const shouldFreeze = regionRect.top <= headerOffset && regionRect.bottom > headerOffset + headerHeight;
      frozenHeader.classList.toggle("is-visible", shouldFreeze);
      if (!shouldFreeze) return;
      frozenHeader.style.left = `${regionRect.left}px`;
      frozenHeader.style.width = `${regionRect.width}px`;
      frozenHeader.style.top = `${headerOffset}px`;
      frozenTable.style.width = `${tableWrap.scrollWidth}px`;
      frozenTable.style.transform = `translateX(-${tableWrap.scrollLeft}px)`;
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateFrozenHeader);
    };
    updateFrozenHeader();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    tableWrap.addEventListener("scroll", scheduleUpdate, { passive: true });
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      tableWrap.removeEventListener("scroll", scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [searchParams]);
  const visible = useMemo(() => sortPals(filterPals(catalogPals, filters), filters.sort), [filters]);
  const totalPages = Math.max(1, Math.ceil(visible.length / pageSize));
  const currentPage = Math.min(Math.max(_initialPage, 1), totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const pagePals = visible.slice(pageStart, pageStart + pageSize);

  const update = (patch: Partial<PaldexFilters>) => {
    const query = serializePaldexFilters({ ...filters, ...patch }).toString();
    const target = query ? `/pals?${query}` : "/pals";
    if (typeof window !== "undefined" && window.location.pathname === "/pals") {
      window.history.pushState(null, "", target);
    } else {
      router.push(target, { scroll: false });
    }
  };
  const pageHref = (page: number) => {
    const query = serializePaldexFilters(filters).toString();
    const path = page <= 1 ? "/pals" : `/pals/page/${page}`;
    return query ? `${path}?${query}` : path;
  };
  const toggle = <T extends string,>(items: T[], item: T) => items.includes(item) ? items.filter((value) => value !== item) : [...items, item];
  const apply = () => {
    if (sheet === "elements") update({ elements: draftElements, elementMode: draftElementMode });
    else update({ work: draftWork, workMode: draftWorkMode, workLevel: draftWorkLevel });
    setSheet(null);
  };
  const clearAll = () => update({ q: "", elements: [], elementMode: "any", work: [], workMode: "any", workLevel: 0, types: ["pal", "monster"], newOnly: false, sort: "number" });
  const hasFilters = Boolean(filters.q || filters.elements.length || filters.work.length || filters.workLevel || filters.newOnly || filters.types.join(",") !== "pal,monster" || filters.sort !== "number");
  const toggleElement = (element: string) => update({ elements: toggle(filters.elements, element) });
  const toggleWork = (work: WorkKey) => update({ work: toggle(filters.work, work) });

  return <section className="database-workspace paldex-workspace paldex-wide" aria-label="Palworld Paldeck filters and results">
    <div className="paldex-control-bar">
      <label className="paldex-search"><span>⌕</span><input value={filters.q} onChange={(event) => update({ q: event.target.value })} placeholder="Search English name or Paldeck number…" aria-label="Search Paldeck" /></label>
      <button type="button" className={`paldex-filter-open paldex-new-filter ${filters.newOnly ? "active" : ""}`} aria-label="Toggle New in Palworld 1.0 filter" aria-pressed={filters.newOnly} onClick={() => update({ newOnly: !filters.newOnly })}><span>Palworld 1.0</span><strong>{filters.newOnly ? "New only" : "New in 1.0"}</strong></button>
    </div>
    <div className="paldex-icon-filters" aria-label="Quick Pal filters">
      <section className="paldex-icon-filter-group" aria-labelledby="paldex-elements-label"><div className="paldex-icon-filter-heading"><h2 id="paldex-elements-label">Filter by element</h2>{filters.elements.length > 1 && <div className="paldex-inline-mode"><button type="button" className={filters.elementMode === "any" ? "active" : ""} onClick={() => update({ elementMode: "any" })}>Any</button><button type="button" className={filters.elementMode === "all" ? "active" : ""} onClick={() => update({ elementMode: "all" })}>All</button></div>}</div><div className="paldex-icon-filter-list">{elementOptions.map((item) => <div className="paldex-icon-filter-item" key={item}><button type="button" className={filters.elements.includes(item) ? "active" : ""} aria-pressed={filters.elements.includes(item)} aria-label={`Filter by ${item}`} title={item} onClick={() => toggleElement(item)}><ElementIcon element={item} /></button><span>{item}</span></div>)}</div></section>
      <section className="paldex-icon-filter-group" aria-labelledby="paldex-work-label"><div className="paldex-icon-filter-heading"><h2 id="paldex-work-label">Filter by work</h2>{filters.work.length > 1 && <div className="paldex-inline-mode"><button type="button" className={filters.workMode === "any" ? "active" : ""} onClick={() => update({ workMode: "any" })}>Any</button><button type="button" className={filters.workMode === "all" ? "active" : ""} onClick={() => update({ workMode: "all" })}>All</button></div>}</div><div className="paldex-icon-filter-list work-list">{workTypes.map((item) => <div className="paldex-icon-filter-item" key={item}><button type="button" className={filters.work.includes(item) ? "active" : ""} aria-pressed={filters.work.includes(item)} aria-label={`Filter by ${workLabels[item]}`} title={workLabels[item]} onClick={() => toggleWork(item)}><WorkSuitabilityIcon work={item} /></button><span>{workLabels[item]}</span></div>)}</div></section>
    </div>
    <p className="paldex-filter-status" aria-live="polite">{filters.elements.length || filters.work.length ? `${visible.length} Pals match the selected filters` : `${visible.length} Pals available`}</p>
    <div className="paldex-toolbar" aria-live="polite">
      <p><strong>{visible.length}</strong> {filters.newOnly ? "New Pals" : visible.length === 1 ? "Pal" : "Pals"} found</p>
      <div><div className="paldex-sort-menu"><span>Sort</span><button type="button" className="paldex-sort-trigger" aria-label="Sort Paldeck" aria-haspopup="listbox" aria-expanded={sortOpen} onClick={() => setSortOpen((open) => !open)}><strong>{sortOptions.find((option) => option.value === filters.sort)?.label}</strong><span aria-hidden="true">⌄</span></button>{sortOpen && <div className="paldex-sort-options" role="listbox" aria-label="Sort Paldeck options">{sortOptions.map((option) => <button type="button" role="option" aria-selected={filters.sort === option.value} className={filters.sort === option.value ? "active" : ""} key={option.value} onClick={() => { update({ sort: option.value }); setSortOpen(false); }}>{filters.sort === option.value && <span aria-hidden="true">✓</span>}{option.label}</button>)}</div>}</div>{hasFilters && <button type="button" className="paldex-reset" onClick={clearAll}>Clear all</button>}</div>
    </div>
    {hasFilters && <div className="paldex-chips">{filters.newOnly && <button onClick={() => update({ newOnly: false })}>New in 1.0 ×</button>}{filters.elements.map((value) => <button key={value} onClick={() => update({ elements: toggle(filters.elements, value) })}>{value} ×</button>)}{filters.work.map((value) => <button key={value} onClick={() => update({ work: toggle(filters.work, value) })}>{workLabels[value]} ×</button>)}{filters.workLevel > 0 && <span>Work level {filters.workLevel}+</span>}</div>}
    {visible.length ? <><div className="paldex-result-range" aria-live="polite">Showing {pageStart + 1}–{Math.min(pageStart + pageSize, visible.length)} of {visible.length} {filters.newOnly ? "New Pals in Palworld 1.0" : "Pals"}</div><div ref={tableRegionRef} className="paldex-table-region"><div ref={tableWrapRef} className="paldex-table-wrap"><table className="paldex-table paldex-complete-table"><PaldexTableHead /><tbody>{pagePals.map((pal) => <tr key={pal.id}><td><Link href={`/pals/${pal.slug}`}><PalMark pal={pal} showNewBadge /><span><strong>{pal.name}</strong><small>{pal.kind === "pal" ? "Pal" : "Crossover creature"}</small></span></Link></td><td>{pal.number}</td><td><ElementMarks pal={pal} /></td><td><WorkBadges pal={pal} /></td><td>{pal.partnerSkill.name ? <span className="partner-skill-mark"><PartnerSkillIcon file={pal.partnerSkill.iconFile} label={pal.partnerSkill.name} /><span>{pal.partnerSkill.name}</span></span> : "—"}</td><td>{pal.rarity ?? "—"}</td><td>{pal.stats.hp ?? "—"}</td><td>{pal.power}</td><td>{pal.stats.defense ?? "—"}</td><td>{pal.price ?? "—"}</td><td>{pal.stats.stamina ?? "—"}</td><td>{pal.movement.rideSprint ?? "—"}</td><td>{pal.movement.run ?? "—"}</td></tr>)}</tbody></table></div><div ref={frozenHeaderRef} className="paldex-frozen-header" aria-hidden="true"><table ref={frozenTableRef} className="paldex-table paldex-complete-table paldex-frozen-table"><PaldexTableHead frozen /></table></div></div><nav className="paldex-pagination" aria-label="Pal pagination">{currentPage <= 1 ? <span aria-disabled="true">Previous</span> : <Link href={pageHref(currentPage - 1)}>Previous</Link>}<div className="paldex-pagination-pages">{Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => <Link href={pageHref(page)} key={page} aria-current={page === currentPage ? "page" : undefined}>{page}</Link>)}</div>{currentPage >= totalPages ? <span aria-disabled="true">Next</span> : <Link href={pageHref(currentPage + 1)}>Next</Link>}</nav></> : <div className="paldex-empty"><span>⌕</span><h2>No Pals found</h2><p>Try another search or clear one of the filters.</p><button type="button" onClick={clearAll}>Clear all</button></div>}
    {sheet && <div className="paldex-filter-backdrop" role="presentation" onClick={() => setSheet(null)}><section className="paldex-filter-sheet" role="dialog" aria-modal="true" aria-label={sheet === "elements" ? "Element filters" : "Work suitability filters"} onClick={(event) => event.stopPropagation()}>
      <header><h2>{sheet === "elements" ? "Element" : "Work Suitability"}</h2><button type="button" onClick={() => setSheet(null)}>Cancel</button></header>
      {sheet === "elements" ? <><div className="paldex-filter-options">{elementOptions.map((item) => <button type="button" key={item} className={draftElements.includes(item) ? "active" : ""} onClick={() => setDraftElements(toggle(draftElements, item))}><ElementIcon element={item} /><span>{item}</span></button>)}</div>{draftElements.length > 1 && <div className="paldex-match-mode"><button type="button" className={draftElementMode === "any" ? "active" : ""} onClick={() => setDraftElementMode("any")}>Match any</button><button type="button" className={draftElementMode === "all" ? "active" : ""} onClick={() => setDraftElementMode("all")}>Match all</button></div>}</> : <><div className="paldex-filter-options work-options">{workTypes.map((item) => <button type="button" key={item} className={draftWork.includes(item) ? "active" : ""} onClick={() => setDraftWork(toggle(draftWork, item))}><WorkSuitabilityIcon work={item} /><span>{workLabels[item]}</span></button>)}</div><label className="paldex-min-level">Minimum level<select value={draftWorkLevel} onChange={(event) => setDraftWorkLevel(Number(event.target.value))}><option value="0">Any</option>{[2, 3, 4, 5, 6, 7, 8].map((level) => <option key={level} value={level}>{level}+</option>)}</select></label>{draftWork.length > 1 && <div className="paldex-match-mode"><button type="button" className={draftWorkMode === "any" ? "active" : ""} onClick={() => setDraftWorkMode("any")}>Match any</button><button type="button" className={draftWorkMode === "all" ? "active" : ""} onClick={() => setDraftWorkMode("all")}>Match all</button></div>}</>}
      <footer><button type="button" className="paldex-sheet-clear" onClick={() => { if (sheet === "elements") { setDraftElements([]); setDraftElementMode("any"); } else { setDraftWork([]); setDraftWorkMode("any"); setDraftWorkLevel(0); } }}>Clear</button><button type="button" className="paldex-sheet-apply" onClick={apply}>Apply</button></footer>
    </section></div>}
  </section>;
}
