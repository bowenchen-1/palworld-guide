"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import PalMark from "../components/pal-mark";
import { PalData, WorkKey, workGlyphs, workLabels, pals } from "../lib/game-data";
import { filterPals, PaldexFilters, PaldexSort, parsePaldexFilters, serializePaldexFilters, sortPals } from "../lib/paldex";

const workTypes = Object.keys(workLabels) as WorkKey[];
const elementOptions = ["Neutral", "Fire", "Water", "Grass", "Electric", "Ice", "Ground", "Dark", "Dragon"];
const dash = (value: string | number | null) => value ?? "—";
const labelList = (values: string[] | null) => values?.length ? values.join(", ") : "—";

function WorkBadges({ pal }: { pal: PalData }) {
  const entries = Object.entries(pal.work) as [WorkKey, number][];
  return entries.length ? <p className="mini-work">{entries.map(([key, level]) => <span key={key} title={workLabels[key]}>{workGlyphs[key]} {level}</span>)}</p> : <span className="muted-dash">—</span>;
}

export default function PaldexClient({ initialPage: _initialPage = 1 }: { initialPage?: number }) {
  void _initialPage; // legacy paginated URLs remain indexable; filters use the canonical query URL.
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = useMemo(() => parsePaldexFilters(new URLSearchParams(searchParams.toString())), [searchParams]);
  const [filterSheet, setFilterSheet] = useState(false);
  const visible = useMemo(() => sortPals(filterPals(pals, filters), filters.sort), [filters]);
  const update = (patch: Partial<PaldexFilters>) => {
    const next = { ...filters, ...patch };
    const query = serializePaldexFilters(next).toString();
    router.push(query ? `/paldex?${query}` : "/paldex", { scroll: false });
  };
  const toggle = <T extends string,>(items: T[], item: T) => items.includes(item) ? items.filter((value) => value !== item) : [...items, item];
  const hasFilters = Boolean(filters.q || filters.elements.length || filters.work.length || filters.types.join(",") !== "pal" || filters.workMode !== "any" || filters.sort !== "number");
  const strongest = (pal: PalData) => (Object.entries(pal.work) as [WorkKey, number][]).sort(([, a], [, b]) => b - a)[0];

  return <section className="database-workspace paldex-workspace paldex-wide" aria-label="Palworld Paldeck filters and results">
    <div className="paldex-control-bar">
      <label className="paldex-search"><span>⌕</span><input value={filters.q} onChange={(event) => update({ q: event.target.value })} placeholder="Search English name or Paldeck number…" aria-label="Search Paldeck" /></label>
      <button type="button" className="paldex-filter-open" onClick={() => setFilterSheet(true)}><span>Filters</span><strong>{filters.elements.length + filters.work.length + filters.types.length} selected</strong></button>
      <div className="paldex-tabs" aria-label="Paldex view"><button type="button" className={filters.view === "overview" ? "active" : ""} onClick={() => update({ view: "overview" })}>Overview</button><button type="button" className={filters.view === "work" ? "active" : ""} onClick={() => update({ view: "work" })}>Work</button></div>
    </div>
    <div className="paldex-toolbar"><p><strong>{visible.length}</strong> {visible.length === 1 ? "entry" : "entries"} found</p><div><label><span>Sort</span><select aria-label="Sort Paldeck" value={filters.sort} onChange={(event) => update({ sort: event.target.value as PaldexSort })}><option value="number">Paldeck number</option><option value="name">Name A–Z</option><option value="hp">HP</option><option value="melee">Melee attack</option><option value="ranged">Ranged attack</option><option value="defense">Defense</option><option value="craft">Craft speed</option><option value="rarity">Rarity</option><option value="food">Food consumption</option><option value="speed">Run speed</option><option value="work">Highest work level</option><option value="power-low">Breeding power: low first</option><option value="power-high">Breeding power: high first</option></select></label>{hasFilters && <button type="button" className="paldex-reset" onClick={() => update({ q: "", elements: [], work: [], workMode: "any", types: ["pal"], sort: "number" })}>Clear all</button>}</div></div>
    {hasFilters && <div className="paldex-chips" aria-label="Selected filters">{filters.elements.map((value) => <button key={value} onClick={() => update({ elements: toggle(filters.elements, value) })}>{value} ×</button>)}{filters.work.map((value) => <button key={value} onClick={() => update({ work: toggle(filters.work, value) })}>{workLabels[value]} ×</button>)}{filters.types.map((value) => <button key={value} onClick={() => update({ types: toggle(filters.types, value) || ["pal"] })}>{value === "pal" ? "Pal" : "Crossover"} ×</button>)}{filters.work.length > 1 && <span>Match {filters.workMode}</span>}</div>}
    {visible.length ? <>
      <div className="paldex-table-wrap"><table className={`paldex-table ${filters.view === "work" ? "work-view" : "overview-view"}`}><thead><tr>{filters.view === "overview" ? <><th>Pal</th><th>No.</th><th>Element</th><th>HP</th><th>Melee</th><th>Ranged</th><th>Defense</th><th>Work Suitability</th><th>Partner Skill</th><th>Rarity</th><th>Breeding Power</th></> : <><th>Pal</th><th>Work Suitability</th><th>Top level</th><th>Food</th><th>Nocturnal</th><th>Transport speed</th><th>Ranch product</th><th>Partner Skill</th></>}</tr></thead><tbody>{visible.map((pal) => { const top = strongest(pal); return <tr key={pal.id}><td><Link href={`/pals/${pal.slug}`}><PalMark pal={pal} /><span><strong>{pal.name}</strong><small>{pal.kind === "pal" ? "Pal" : "Crossover creature"}</small></span></Link></td>{filters.view === "overview" ? <><td>{pal.number}</td><td>{pal.elements.length ? pal.elements.join(" / ") : "—"}</td><td>{dash(pal.stats.hp)}</td><td>{dash(pal.stats.meleeAttack)}</td><td>{dash(pal.stats.rangedAttack)}</td><td>{dash(pal.stats.defense)}</td><td><WorkBadges pal={pal} /></td><td>{dash(pal.partnerSkill.name)}</td><td>{dash(pal.rarity)}</td><td>{pal.power}</td></> : <><td><WorkBadges pal={pal} /></td><td>{top ? `${workGlyphs[top[0]]} ${top[1]}` : "—"}</td><td>{dash(pal.foodConsumption)}</td><td>{pal.nocturnal === null ? "—" : pal.nocturnal ? "Yes" : "No"}</td><td>{dash(pal.movement.run)}</td><td>{labelList(pal.ranchProduct)}</td><td>{dash(pal.partnerSkill.name)}</td></>}</tr>; })}</tbody></table></div>
      <div className="paldex-mobile-cards">{visible.map((pal) => { const top = strongest(pal); return <Link href={`/pals/${pal.slug}`} key={pal.id}><PalMark pal={pal} /><div><small>No. {pal.number}{pal.elements.length ? ` · ${pal.elements.join(" / ")}` : ""}</small><h2>{pal.name}</h2><WorkBadges pal={pal} />{filters.view === "overview" ? <p>HP {dash(pal.stats.hp)} · DEF {dash(pal.stats.defense)} · Rarity {dash(pal.rarity)}</p> : <p>Top work {top ? `${workLabels[top[0]]} ${top[1]}` : "—"} · Food {dash(pal.foodConsumption)}</p>}</div></Link>; })}</div>
    </> : <div className="paldex-empty"><span>⌕</span><h2>No Pals found</h2><p>Try another search or clear one of the filters.</p><button type="button" onClick={() => update({ q: "", elements: [], work: [], workMode: "any", types: ["pal"], sort: "number" })}>Clear all</button></div>}
    {filterSheet && <div className="paldex-filter-backdrop" role="presentation" onClick={() => setFilterSheet(false)}><section className="paldex-filter-sheet" role="dialog" aria-modal="true" aria-label="Paldex filters" onClick={(event) => event.stopPropagation()}><header><h2>Filters</h2><button type="button" onClick={() => setFilterSheet(false)}>Done</button></header><fieldset><legend>Element</legend><div className="paldex-filter-options">{elementOptions.map((item) => <button type="button" key={item} className={filters.elements.includes(item) ? "active" : ""} onClick={() => update({ elements: toggle(filters.elements, item) })}>{item}</button>)}</div></fieldset><fieldset><legend>Work suitability</legend><div className="paldex-filter-options work-options">{workTypes.map((item) => <button type="button" key={item} className={filters.work.includes(item) ? "active" : ""} onClick={() => update({ work: toggle(filters.work, item) })}>{workGlyphs[item]} {workLabels[item]}</button>)}</div>{filters.work.length > 1 && <div className="paldex-match-mode"><button type="button" className={filters.workMode === "any" ? "active" : ""} onClick={() => update({ workMode: "any" })}>Match any</button><button type="button" className={filters.workMode === "all" ? "active" : ""} onClick={() => update({ workMode: "all" })}>Match all</button></div>}</fieldset><fieldset><legend>Entry type</legend><div className="paldex-filter-options">{(["pal", "monster"] as const).map((item) => <button type="button" key={item} className={filters.types.includes(item) ? "active" : ""} onClick={() => update({ types: toggle(filters.types, item) || ["pal"] })}>{item === "pal" ? "Pals" : "Crossover"}</button>)}</div></fieldset></section></div>}
  </section>;
}
