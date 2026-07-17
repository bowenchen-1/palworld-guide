"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import PalMark from "../components/pal-mark";
import { BreedingData, PalData, pals } from "../lib/game-data";
import { availableOffspring, comparePals, findOffspring, findParentPairs, findRoutes, pairResults, type BreedingResult } from "./breeding/core";
import { readAvailablePals, saveAvailablePals } from "./breeding/storage";

type Mode = "parents" | "target" | "offspring" | "available-route" | "shortest" | "available";
type Slot = "a" | "b" | "target" | "parent" | "start" | "parent-filter" | "offspring-filter" | "exclude" | null;
const modes: [Mode, string][] = [["parents", "Parents → Child"], ["target", "Target → Parents"], ["offspring", "One Parent → Offspring"], ["available-route", "Available Pals → Target"], ["shortest", "Shortest Route"], ["available", "What Can I Breed Now"]];
const modeDescriptions: Record<Mode, string> = { parents: "Pick two Pals to see their offspring.", target: "Choose a Pal to reveal every direct parent pair.", offspring: "See every result a selected parent can create.", "available-route": "Reach a target using only your Available Pals.", shortest: "Find the fewest breeding steps to your target.", available: "See what your Available Pals can breed now." };
const PICKER_BATCH_SIZE = 60;

function Result({ result, usePair }: { result: BreedingResult; usePair?: () => void }) {
  return <article className="breed-row"><span><PalMark pal={result.first} small />{result.genders?.[0] && <em>{result.genders[0]}</em>}<Link href={`/pals/${result.first.slug}`}>{result.first.name}</Link></span><b>+</b><span><PalMark pal={result.second} small />{result.genders?.[1] && <em>{result.genders[1]}</em>}<Link href={`/pals/${result.second.slug}`}>{result.second.name}</Link></span><b>→</b><span><PalMark pal={result.child} small /><Link href={`/pals/${result.child.slug}`}>{result.child.name}</Link></span>{result.genders && <small>Gender-specific result</small>}{result.requiresTwo && <small>Requires two compatible individuals</small>}{usePair && <button onClick={usePair}>Use pair</button>}</article>;
}

function GenerationSelect({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const [open, setOpen] = useState(false);
  const controlRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => { if (!controlRef.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);
  return <div ref={controlRef} className="home-number-control"><span>Maximum generations</span><button type="button" className="home-generation-trigger" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)}><strong>{value}</strong><b aria-hidden="true">⌄</b></button>{open && <div className="home-generation-menu" role="listbox" aria-label="Maximum generations">{[1, 2, 3, 4, 5].map((generation) => <button type="button" role="option" aria-selected={generation === value} className={generation === value ? "selected" : ""} key={generation} onClick={() => { onChange(generation); setOpen(false); }}>{generation}</button>)}</div>}</div>;
}

export default function BreedingClient({ embedded = false }: { embedded?: boolean }) {
  const [matrix, setMatrix] = useState<BreedingData>({});
  const [error, setError] = useState(false);
  const [mode, setMode] = useState<Mode>("parents");
  const [a, setA] = useState<PalData | undefined>();
  const [b, setB] = useState<PalData | undefined>();
  const [target, setTarget] = useState<PalData | undefined>();
  const [parent, setParent] = useState<PalData | undefined>();
  const [start, setStart] = useState<PalData | undefined>();
  const [slot, setSlot] = useState<Slot>(null);
  const [query, setQuery] = useState("");
  const [pickerLimit, setPickerLimit] = useState(PICKER_BATCH_SIZE);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [available, setAvailable] = useState<string[]>([]);
  const [max, setMax] = useState(3);
  const [excluded, setExcluded] = useState<string[]>([]);
  const [parentFilter, setParentFilter] = useState<string | undefined>();
  const [offspringFilter, setOffspringFilter] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const [urlRestored, setUrlRestored] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pickerTriggerRef = useRef<HTMLButtonElement | null>(null);
  const byId = useMemo(() => new Map(pals.map((pal) => [pal.id, pal])), []);
  const availablePals = available.map((id) => byId.get(id)).filter((pal): pal is PalData => Boolean(pal));

  useEffect(() => { fetch("/data/breeding.json").then((r) => r.ok ? r.json() : Promise.reject()).then(setMatrix).catch(() => setError(true)); }, []);
  useEffect(() => { const frame = requestAnimationFrame(() => { const params = new URLSearchParams(window.location.search); const requestedMode = params.get("mode"); const palFromParam = (name: string) => pals.find((pal) => pal.id === params.get(name)); if (modes.some(([id]) => id === requestedMode)) setMode(requestedMode as Mode); setA(palFromParam("parentA")); setB(palFromParam("parentB")); setTarget(palFromParam("target")); setParent(palFromParam("parent")); setStart(palFromParam("starting")); setMax(Math.min(5, Math.max(1, Number(params.get("max")) || 3))); setAvailable(readAvailablePals()); setUrlRestored(true); }); return () => cancelAnimationFrame(frame); }, []);
  useEffect(() => { if (!urlRestored || !Object.keys(matrix).length) return; const params = new URLSearchParams(); params.set("mode", mode); if (a) params.set("parentA", a.id); if (b) params.set("parentB", b.id); if (parent) params.set("parent", parent.id); if (target) params.set("target", target.id); if (start) params.set("starting", start.id); if (max !== 3) params.set("max", String(max)); history.replaceState(null, "", `${location.pathname}?${params}`); }, [mode, a, b, parent, target, start, max, matrix, urlRestored]);
  useEffect(() => { if (urlRestored) saveAvailablePals(available); }, [available, urlRestored]);
  useEffect(() => { if (slot) requestAnimationFrame(() => searchInputRef.current?.focus()); }, [slot]);

  const childResults = useMemo(() => a && b ? pairResults(matrix, byId, a, b) : [], [matrix, byId, a, b]);
  const allPairs = useMemo(() => target ? findParentPairs(matrix, byId, target) : [], [matrix, byId, target]);
  const pairCandidates = useMemo(() => Array.from(new Map(allPairs.flatMap((result) => [result.first, result.second]).map((pal) => [pal.id, pal])).values()).sort(comparePals), [allPairs]);
  const pairs = useMemo(() => parentFilter ? allPairs.filter((result) => result.first.id === parentFilter || result.second.id === parentFilter) : allPairs, [allPairs, parentFilter]);
  const allOffspring = useMemo(() => parent ? findOffspring(matrix, byId, parent) : [], [matrix, byId, parent]);
  const offspringCandidates = useMemo(() => Array.from(new Map(allOffspring.flatMap((result) => [result.second, result.child]).map((pal) => [pal.id, pal])).values()).sort(comparePals), [allOffspring]);
  const offspring = useMemo(() => offspringFilter ? allOffspring.filter((result) => result.second.id === offspringFilter || result.child.id === offspringFilter) : allOffspring, [allOffspring, offspringFilter]);
  const now = useMemo(() => availableOffspring(matrix, byId, available), [matrix, byId, available]);
  const route = useMemo(() => target && start ? findRoutes(matrix, byId, [start], target, pals, max, new Set(excluded)) : [], [matrix, byId, target, start, max, excluded]);
  const availableRoute = useMemo(() => target ? findRoutes(matrix, byId, availablePals, target, availablePals, max) : [], [matrix, byId, target, availablePals, max]);
  const pickerCandidates = slot === "parent-filter" ? pairCandidates : slot === "offspring-filter" ? offspringCandidates : slot === "exclude" ? pals.filter((pal) => !excluded.includes(pal.id)) : pals;
  const search = useMemo(() => { const n = query.trim().toLowerCase(); return pickerCandidates.filter((pal) => !n || pal.name.toLowerCase().includes(n) || pal.number.toLowerCase().includes(n)).sort(comparePals); }, [pickerCandidates, query]);
  const visibleSearch = search.slice(0, pickerLimit);
  function openPicker(next: Exclude<Slot, null>, trigger: HTMLButtonElement) { pickerTriggerRef.current = trigger; setPickerLimit(PICKER_BATCH_SIZE); setSlot(next); }
  function loadMorePicker() { if (pickerLoading) return; setPickerLoading(true); window.setTimeout(() => { setPickerLimit((limit) => limit + PICKER_BATCH_SIZE); setPickerLoading(false); }, 180); }
  function closePicker() { setSlot(null); setQuery(""); requestAnimationFrame(() => pickerTriggerRef.current?.focus()); }
  function choose(pal: PalData) { if (slot === "a") setA(pal); if (slot === "b") setB(pal); if (slot === "target") { setTarget(pal); setParentFilter(undefined); } if (slot === "parent") { setParent(pal); setOffspringFilter(undefined); } if (slot === "start") setStart(pal); if (slot === "parent-filter") setParentFilter(pal.id); if (slot === "offspring-filter") setOffspringFilter(pal.id); if (slot === "exclude") setExcluded((current) => current.includes(pal.id) ? current : [...current, pal.id]); closePicker(); }
  function copy(text: string) { navigator.clipboard?.writeText(text); }

  const pick = (label: string, value: PalData | undefined, next: Exclude<Slot, null>) => <button className={`home-breeding-slot home-selector-card ${value ? "selected" : ""}`} onClick={(event) => openPicker(next, event.currentTarget)}><span className="slot-label">{label}</span><PalMark pal={value} /><strong>{value?.name ?? "Choose a Pal"}</strong><small>{value ? `No. ${value.number}` : "Tap to browse all Pals"}</small><i>{value ? "Change Pal" : "Choose Pal"}</i></button>;
  const homeParentPick = (label: string, value: PalData | undefined, next: Extract<Slot, "a" | "b">) => pick(label, value, next);
  const resultFilter = (label: string, value: string | undefined, candidates: PalData[], next: Extract<Slot, "parent-filter" | "offspring-filter">, clear: () => void) => <div className="home-result-filter"><span>{label}</span><button type="button" className="home-compact-picker" style={{ minHeight: 48, padding: "6px 8px" }} onClick={(event) => openPicker(next, event.currentTarget)}><PalMark pal={value ? byId.get(value) : undefined} small /><span><strong>{value ? byId.get(value)?.name : "All Pals"}</strong><em>{value ? `No. ${byId.get(value)?.number}` : `${candidates.length} available`}</em></span><b>{value ? "Change" : "Select"}</b></button>{value && <button type="button" className="home-filter-clear" onClick={clear}>Clear</button>}</div>;
  const list = (items: BreedingResult[], empty: string) => items.length ? <div className="breed-list">{items.slice(0, page * 40).map((item, i) => <Result key={`${item.first.id}-${item.second.id}-${item.child.id}-${i}`} result={item} usePair={() => { setA(item.first); setB(item.second); setMode("parents"); }} />)}{items.length > page * 40 && <button onClick={() => setPage(page + 1)}>Load more</button>}</div> : <p className="breed-empty">{empty}</p>;

  if (error) return <section className={`database-workspace${embedded ? " home-breeding-workspace" : ""}`}><p>Breeding data is unavailable. <button onClick={() => location.reload()}>Retry</button></p></section>;
  return <section className={`database-workspace breeding-workspace${embedded ? " home-breeding-workspace" : ""}`} aria-label="Palworld breeding calculator controls">
    <nav className="home-breeding-tabs" aria-label="Breeding tools">{modes.map(([id, label]) => <button key={id} className={mode === id ? "active" : ""} aria-pressed={mode === id} onClick={() => { setMode(id); setPage(1); }}>{label}</button>)}</nav>
    <p className="home-mode-description" aria-live="polite">{modeDescriptions[mode]}</p>
    <div className="home-breeding-card home-workbench"><div className="breeding-card-glow" />
      {mode === "parents" && <><div className="home-breeding-equation">{homeParentPick("Parent A", a, "a")}<b className="breeding-operator">+</b>{homeParentPick("Parent B", b, "b")}<b className="breeding-operator equals">=</b><div className={`home-breeding-slot offspring ${childResults.length ? "selected" : ""}`}><span className="slot-label">Offspring</span><PalMark pal={childResults[0]?.child} /><strong>{childResults[0]?.child.name ?? "Offspring result"}</strong><small>{childResults[0] ? `No. ${childResults[0].child.number}` : "Choose both parents to calculate"}</small><i>{childResults[0] ? "Breeding result" : "Waiting for parents"}</i></div></div>{childResults.length > 1 && <section className="home-results"><header><span>Results</span><strong>{childResults.length} outcomes</strong></header><div className="result-card-details">{childResults.map((result, index) => <Result key={`${result.child.id}-${index}`} result={result} />)}</div></section>}{a && b && !childResults.length && <p className="breed-empty">No breeding result was found.</p>}<div className="calculator-foot"><button onClick={() => { setA(b); setB(a); }}>Swap</button><button onClick={() => { setA(undefined); setB(undefined); }}>Clear</button>{childResults.length > 0 && <button onClick={() => copy(childResults.map((r) => `${r.first.name} + ${r.second.name} → ${r.child.name}`).join("\n"))}>Copy combination</button>}</div></>}
      {mode === "target" && <><div className="home-control-row">{pick("Target Pal", target, "target")}</div><section className="home-results"><header><div><span>Parent combinations</span><strong>{target ? `${pairs.length} found` : "Select a target"}</strong></div>{target && allPairs.length > 0 && resultFilter("Filter by parent", parentFilter, pairCandidates, "parent-filter", () => setParentFilter(undefined))}</header>{list(pairs, "Choose a target to see every direct parent combination.")}</section></>}
      {mode === "offspring" && <><div className="home-control-row">{pick("Selected Parent", parent, "parent")}</div><section className="home-results"><header><div><span>Possible offspring</span><strong>{parent ? `${offspring.length} found` : "Select a parent"}</strong></div>{parent && allOffspring.length > 0 && resultFilter("Filter results", offspringFilter, offspringCandidates, "offspring-filter", () => setOffspringFilter(undefined))}</header>{list(offspring, "Choose a parent to see all offspring.")}</section></>}
      {mode === "available" && <><Available pals={pals} available={available} setAvailable={setAvailable} /><section className="home-results"><header><span>Breed now</span><strong>{now.length} offspring · {available.length} selected</strong></header>{now.length ? <div className="breed-list">{now.map(({ child, combinations }) => <details key={child.id}><summary><PalMark pal={child} small />{child.name} · {combinations.length} combinations</summary>{combinations.map((r, i) => <Result key={i} result={r} />)}</details>)}</div> : <p className="breed-empty">Add available Pals to see the offspring you can breed now.</p>}</section></>}
      {(mode === "shortest" || mode === "available-route") && <><div className="home-route-controls">{mode === "shortest" ? pick("Starting Pal", start, "start") : <Available pals={pals} available={available} setAvailable={setAvailable} compact />}{pick("Target Pal", target, "target")}<GenerationSelect value={max} onChange={setMax} /></div>{mode === "shortest" && <details className="home-advanced-options"><summary>Advanced options</summary><div><span>Exclude Pals</span><button type="button" className="home-advanced-add" onClick={(event) => openPicker("exclude", event.currentTarget)}>+ Select Pals</button>{excluded.length > 0 && <button type="button" className="home-filter-clear" onClick={() => setExcluded([])}>Clear all</button>}<section className="home-excluded-tags">{excluded.map((id) => { const pal = byId.get(id); return pal ? <button type="button" key={id} onClick={() => setExcluded((current) => current.filter((entry) => entry !== id))}><PalMark pal={pal} small /><span>{pal.name} ×</span></button> : null; })}</section></div></details>}<section className="home-results"><header><span>Route results</span><strong>{target ? `Up to ${max} generations` : "Set a target"}</strong></header>{mode === "shortest" && (!start || !target) ? <p className="breed-empty">Choose a starting Pal and a target Pal to calculate a route.</p> : <Routes routes={mode === "shortest" ? route : availableRoute} copy={copy} />}</section></>}
    </div>
    {slot && <div className={`pal-picker-backdrop${embedded ? " home-picker-backdrop" : ""}`} onClick={closePicker}><section className={`pal-picker${embedded ? " home-pal-picker" : ""}`} role="dialog" aria-modal="true" aria-labelledby="pal-selector-title" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => { if (e.key === "Escape") { e.preventDefault(); closePicker(); } }}><header><h2 id="pal-selector-title">Choose a Pal</h2><button type="button" aria-label="Close Pal selector" onClick={closePicker}>×</button></header><input ref={searchInputRef} value={query} onChange={(e) => { setQuery(e.target.value); setPickerLimit(PICKER_BATCH_SIZE); }} onKeyDown={(e) => { if (e.key === "Enter" && search[0]) choose(search[0]); }} placeholder="Search name or Paldeck number…" aria-label="Search Pals by name or Paldeck number" /><p className="pal-picker-progress">Showing {visibleSearch.length} of {search.length} Pals</p><div className="pal-picker-grid">{visibleSearch.map((pal) => <button key={pal.id} onClick={() => choose(pal)}><PalMark pal={pal} small /><span><b>{pal.name}</b><small>No. {pal.number}</small></span></button>)}</div>{visibleSearch.length < search.length && <button type="button" className="pal-picker-load-more" disabled={pickerLoading} aria-busy={pickerLoading} onClick={loadMorePicker}>{pickerLoading ? "Loading…" : "Load more"}</button>}</section></div>}
  </section>;
}

function Available({ pals, available, setAvailable, compact = false }: { pals: PalData[]; available: string[]; setAvailable: (ids: string[]) => void; compact?: boolean }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [limit, setLimit] = useState(compact ? 40 : 60);
  const [loadingMore, setLoadingMore] = useState(false);
  const batchSize = compact ? 40 : 60;
  const matches = useMemo(() => pals.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.number.includes(q)).sort(comparePals), [pals, q]);
  const shown = matches.slice(0, limit);
  const updateQuery = (value: string) => { setQ(value); setLimit(batchSize); };
  function loadMore() { if (loadingMore) return; setLoadingMore(true); window.setTimeout(() => { setLimit((value) => value + batchSize); setLoadingMore(false); }, 180); }
  return <section className={`home-breeding-slot home-available-control${compact ? " compact" : ""}`}><span className="slot-label">Available Pals</span><PalMark /><strong>{available.length ? `${available.length} selected` : "Choose available Pals"}</strong><small>{available.length ? "Your saved breeding roster" : "Add the Pals you can breed with"}</small><div className="home-selector-actions"><button type="button" onClick={() => setOpen(!open)}>{open ? "Close list" : "Choose Pal"}</button>{available.length > 0 && <button type="button" onClick={() => setAvailable([])}>Clear</button>}</div>{open && <div className="home-available-list"><input value={q} onChange={(e) => updateQuery(e.target.value)} placeholder="Search and add a Pal…" /><p className="home-available-progress">Showing {shown.length} of {matches.length} Pals</p><div>{shown.map((pal) => <button key={pal.id} className={available.includes(pal.id) ? "selected" : ""} onClick={() => setAvailable(available.includes(pal.id) ? available.filter((id) => id !== pal.id) : [...available, pal.id])}><PalMark pal={pal} small /><span><strong>{pal.name}</strong><small>No. {pal.number}</small></span></button>)}</div>{shown.length < matches.length && <button type="button" className="home-available-load-more" disabled={loadingMore} aria-busy={loadingMore} onClick={loadMore}>{loadingMore ? "Loading…" : "Load more"}</button>}</div>}</section>;
}

function Routes({ routes, copy }: { routes: ReturnType<typeof findRoutes>; copy: (value: string) => void }) {
  if (!routes.length) return <p className="breed-empty">No route found within this generation limit. Adjust the available Pals or maximum generations.</p>;
  return <div className="route-list">{routes.map((route, i) => <article key={i}><header><strong>{route.generations} generations</strong><button onClick={() => copy(route.steps.map((s, n) => `Step ${n + 1}: ${s.first.name} + ${s.second.name} → ${s.child.name}`).join("\n"))}>Copy Route</button><button onClick={() => copy(location.href)}>Copy Link</button></header>{route.generations === 0 ? <p>Target already available · 0 generations</p> : route.steps.map((step, n) => <div key={n}><b>Step {n + 1}</b><Result result={step} /></div>)}</article>)}</div>;
}
