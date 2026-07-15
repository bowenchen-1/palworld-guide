"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import PalMark from "../components/pal-mark";
import { BreedingData, PalData, pals } from "../lib/game-data";
import { availableOffspring, comparePals, findOffspring, findParentPairs, findRoutes, pairResults, type BreedingResult } from "./breeding/core";
import { readAvailablePals, saveAvailablePals } from "./breeding/storage";

type Mode = "parents" | "target" | "offspring" | "available-route" | "shortest" | "available";
type Slot = "a" | "b" | "target" | "parent" | "start" | null;
const modes: [Mode, string][] = [["parents", "Parents → Child"], ["target", "Target → Parents"], ["offspring", "One Parent → Offspring"], ["available-route", "Available Pals → Target"], ["shortest", "Shortest Route"], ["available", "What Can I Breed Now"]];
const initialParam = (name: string) => typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get(name);
const initialPal = (name: string) => pals.find((pal) => pal.id === initialParam(name));

function Result({ result, usePair }: { result: BreedingResult; usePair?: () => void }) {
  return <article className="breed-row"><span><PalMark pal={result.first} small />{result.genders?.[0] && <em>{result.genders[0]}</em>}<Link href={`/pals/${result.first.slug}`}>{result.first.name}</Link></span><b>+</b><span><PalMark pal={result.second} small />{result.genders?.[1] && <em>{result.genders[1]}</em>}<Link href={`/pals/${result.second.slug}`}>{result.second.name}</Link></span><b>→</b><span><PalMark pal={result.child} small /><Link href={`/pals/${result.child.slug}`}>{result.child.name}</Link></span>{result.genders && <small>Gender-specific result</small>}{result.requiresTwo && <small>Requires two compatible individuals</small>}{usePair && <button onClick={usePair}>Use pair</button>}</article>;
}

export default function BreedingClient({ embedded = false }: { embedded?: boolean }) {
  const [matrix, setMatrix] = useState<BreedingData>({});
  const [error, setError] = useState(false);
  const [mode, setMode] = useState<Mode>(() => { const value = initialParam("mode"); return modes.some(([id]) => id === value) ? value as Mode : "parents"; });
  const [a, setA] = useState<PalData | undefined>(() => initialPal("parentA"));
  const [b, setB] = useState<PalData | undefined>(() => initialPal("parentB"));
  const [target, setTarget] = useState<PalData | undefined>(() => initialPal("target"));
  const [parent, setParent] = useState<PalData | undefined>(() => initialPal("parent"));
  const [start, setStart] = useState<PalData | undefined>(() => initialPal("starting"));
  const [slot, setSlot] = useState<Slot>(null);
  const [query, setQuery] = useState("");
  const [available, setAvailable] = useState<string[]>(() => typeof window === "undefined" ? [] : readAvailablePals());
  const [max, setMax] = useState(() => Math.min(5, Math.max(1, Number(initialParam("max")) || 3)));
  const [excluded, setExcluded] = useState<string[]>([]);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const byId = useMemo(() => new Map(pals.map((pal) => [pal.id, pal])), []);
  const availablePals = available.map((id) => byId.get(id)).filter((pal): pal is PalData => Boolean(pal));

  useEffect(() => { fetch("/data/breeding.json").then((r) => r.ok ? r.json() : Promise.reject()).then(setMatrix).catch(() => setError(true)); }, []);
  useEffect(() => { if (!Object.keys(matrix).length) return; const params = new URLSearchParams(); params.set("mode", mode); if (a) params.set("parentA", a.id); if (b) params.set("parentB", b.id); if (parent) params.set("parent", parent.id); if (target) params.set("target", target.id); if (start) params.set("starting", start.id); if (max !== 3) params.set("max", String(max)); history.replaceState(null, "", `${location.pathname}?${params}`); }, [mode, a, b, parent, target, start, max, matrix]);
  useEffect(() => saveAvailablePals(available), [available]);

  const search = useMemo(() => { const n = query.trim().toLowerCase(); return pals.filter((pal) => !n || pal.name.toLowerCase().includes(n) || pal.number.toLowerCase().includes(n)).sort(comparePals).slice(0, 60); }, [query]);
  const childResults = useMemo(() => a && b ? pairResults(matrix, byId, a, b) : [], [matrix, byId, a, b]);
  const pairs = useMemo(() => target ? findParentPairs(matrix, byId, target).filter((r) => !filter || `${r.first.name} ${r.second.name}`.toLowerCase().includes(filter.toLowerCase())) : [], [matrix, byId, target, filter]);
  const offspring = useMemo(() => parent ? findOffspring(matrix, byId, parent).filter((r) => !filter || `${r.second.name} ${r.child.name}`.toLowerCase().includes(filter.toLowerCase())) : [], [matrix, byId, parent, filter]);
  const now = useMemo(() => availableOffspring(matrix, byId, available), [matrix, byId, available]);
  const route = useMemo(() => target && start ? findRoutes(matrix, byId, [start], target, pals, max, new Set(excluded)) : [], [matrix, byId, target, start, max, excluded]);
  const availableRoute = useMemo(() => target ? findRoutes(matrix, byId, availablePals, target, availablePals, max) : [], [matrix, byId, target, availablePals, max]);
  function choose(pal: PalData) { if (slot === "a") setA(pal); if (slot === "b") setB(pal); if (slot === "target") setTarget(pal); if (slot === "parent") setParent(pal); if (slot === "start") setStart(pal); setSlot(null); setQuery(""); }
  function copy(text: string) { navigator.clipboard?.writeText(text); }

  const pick = (label: string, value: PalData | undefined, next: Slot) => <button className="home-compact-picker" onClick={() => setSlot(next)}><PalMark pal={value} small /><span><small>{label}</small><strong>{value?.name ?? "Search and select a Pal"}</strong>{value && <em>No. {value.number}</em>}</span><b>{value ? "Change" : "Select"}</b></button>;
  const homeParentPick = (label: string, value: PalData | undefined, next: Extract<Slot, "a" | "b">) => <button className={`home-breeding-slot ${value ? "selected" : ""}`} onClick={() => setSlot(next)}><span className="slot-label">{label}</span><PalMark pal={value} /><strong>{value?.name ?? "Choose a Pal"}</strong><small>{value ? `No. ${value.number}` : "Tap to browse all Pals"}</small><i>{value ? "Change Pal" : "Choose Pal"}</i></button>;
  const list = (items: BreedingResult[], empty: string) => items.length ? <div className="breed-list">{items.slice(0, page * 40).map((item, i) => <Result key={`${item.first.id}-${item.second.id}-${item.child.id}-${i}`} result={item} usePair={() => { setA(item.first); setB(item.second); setMode("parents"); }} />)}{items.length > page * 40 && <button onClick={() => setPage(page + 1)}>Load more</button>}</div> : <p className="breed-empty">{empty}</p>;

  if (error) return <section className={`database-workspace${embedded ? " home-breeding-workspace" : ""}`}><p>Breeding data is unavailable. <button onClick={() => location.reload()}>Retry</button></p></section>;
  return <section className={`database-workspace breeding-workspace${embedded ? " home-breeding-workspace" : ""}`} aria-label="Palworld breeding calculator controls">
    <nav className="home-breeding-tabs" aria-label="Breeding tools">{modes.map(([id, label]) => <button key={id} className={mode === id ? "active" : ""} aria-pressed={mode === id} onClick={() => { setMode(id); setPage(1); }}>{label}</button>)}</nav>
    <div className="home-breeding-card home-workbench"><div className="breeding-card-glow" />
      {mode === "parents" && <><div className="home-breeding-equation">{homeParentPick("Parent A", a, "a")}<b className="breeding-operator">+</b>{homeParentPick("Parent B", b, "b")}<b className="breeding-operator equals">=</b><div className={`home-breeding-slot offspring ${childResults.length ? "selected" : ""}`}><span className="slot-label">Offspring</span><PalMark pal={childResults[0]?.child} /><strong>{childResults[0]?.child.name ?? "Offspring result"}</strong><small>{childResults[0] ? `No. ${childResults[0].child.number}` : "Choose both parents to calculate"}</small><i>{childResults[0] ? "Breeding result" : "Waiting for parents"}</i></div></div>{childResults.length > 1 && <section className="home-results"><header><span>Results</span><strong>{childResults.length} outcomes</strong></header><div className="result-card-details">{childResults.map((result, index) => <Result key={`${result.child.id}-${index}`} result={result} />)}</div></section>}{a && b && !childResults.length && <p className="breed-empty">No breeding result was found.</p>}<div className="calculator-foot"><button onClick={() => { setA(b); setB(a); }}>Swap</button><button onClick={() => { setA(undefined); setB(undefined); }}>Clear</button>{childResults.length > 0 && <button onClick={() => copy(childResults.map((r) => `${r.first.name} + ${r.second.name} → ${r.child.name}`).join("\n"))}>Copy combination</button>}</div></>}
      {mode === "target" && <><div className="home-control-row">{pick("Target Pal", target, "target")}<label className="home-filter"><span>Filter results</span><input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search parents…" /></label></div><section className="home-results"><header><span>Parent combinations</span><strong>{target ? `${pairs.length} found` : "Select a target"}</strong></header>{list(pairs, "Choose a target to see every direct parent combination.")}</section></>}
      {mode === "offspring" && <><div className="home-control-row">{pick("Selected Parent", parent, "parent")}<label className="home-filter"><span>Filter results</span><input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search partner or offspring…" /></label></div><section className="home-results"><header><span>Possible offspring</span><strong>{parent ? `${offspring.length} found` : "Select a parent"}</strong></header>{list(offspring, "Choose a parent to see all offspring.")}</section></>}
      {mode === "available" && <><Available pals={pals} available={available} setAvailable={setAvailable} /><section className="home-results"><header><span>Breed now</span><strong>{now.length} offspring · {available.length} selected</strong></header>{now.length ? <div className="breed-list">{now.map(({ child, combinations }) => <details key={child.id}><summary><PalMark pal={child} small />{child.name} · {combinations.length} combinations</summary>{combinations.map((r, i) => <Result key={i} result={r} />)}</details>)}</div> : <p className="breed-empty">Add available Pals to see the offspring you can breed now.</p>}</section></>}
      {(mode === "shortest" || mode === "available-route") && <><div className="home-route-controls">{mode === "shortest" ? pick("Starting Pal", start, "start") : <Available pals={pals} available={available} setAvailable={setAvailable} compact />}{pick("Target Pal", target, "target")}<label className="home-number-control"><span>Maximum generations</span><select value={max} onChange={(e) => setMax(Number(e.target.value))}>{[1,2,3,4,5].map((n) => <option key={n}>{n}</option>)}</select></label>{mode === "shortest" && <label className="home-filter home-exclude"><span>Exclude Pal IDs</span><input value={excluded.join(",")} onChange={(e) => setExcluded(e.target.value.split(",").filter((id) => byId.has(id)))} placeholder="Comma-separated IDs" /></label>}</div><section className="home-results"><header><span>Route results</span><strong>{target ? `Up to ${max} generations` : "Set a target"}</strong></header><Routes routes={mode === "shortest" ? route : availableRoute} copy={copy} /></section></>}
    </div>
    {slot && <div className={`pal-picker-backdrop${embedded ? " home-picker-backdrop" : ""}`} onClick={() => setSlot(null)}><section className={`pal-picker${embedded ? " home-pal-picker" : ""}`} onClick={(e) => e.stopPropagation()}><header><h2>Choose a Pal</h2><button onClick={() => setSlot(null)}>×</button></header><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Escape") setSlot(null); if (e.key === "Enter" && search[0]) choose(search[0]); }} placeholder="Search name or Paldeck number…" /><div className="pal-picker-grid">{search.map((pal) => <button key={pal.id} onClick={() => choose(pal)}><PalMark pal={pal} small /><span><b>{pal.name}</b><small>No. {pal.number}</small></span></button>)}</div></section></div>}
  </section>;
}

function Available({ pals, available, setAvailable, compact = false }: { pals: PalData[]; available: string[]; setAvailable: (ids: string[]) => void; compact?: boolean }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const shown = pals.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.number.includes(q)).sort(comparePals).slice(0, compact ? 20 : 60);
  return <section className={`home-available-control${compact ? " compact" : ""}`}><header><span><small>Available Pals</small><strong>{available.length} selected</strong></span><div><button type="button" onClick={() => setOpen(!open)}>{open ? "Close list" : "Add Pals"}</button>{available.length > 0 && <button type="button" onClick={() => setAvailable([])}>Clear</button>}</div></header>{open && <div className="home-available-list"><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search and add a Pal…" /><div>{shown.map((pal) => <button key={pal.id} className={available.includes(pal.id) ? "selected" : ""} onClick={() => setAvailable(available.includes(pal.id) ? available.filter((id) => id !== pal.id) : [...available, pal.id])}><PalMark pal={pal} small /><span><strong>{pal.name}</strong><small>No. {pal.number}</small></span></button>)}</div></div>}</section>;
}

function Routes({ routes, copy }: { routes: ReturnType<typeof findRoutes>; copy: (value: string) => void }) {
  if (!routes.length) return <p className="breed-empty">No route found within this generation limit. Adjust the available Pals or maximum generations.</p>;
  return <div className="route-list">{routes.map((route, i) => <article key={i}><header><strong>{route.generations} generations</strong><button onClick={() => copy(route.steps.map((s, n) => `Step ${n + 1}: ${s.first.name} + ${s.second.name} → ${s.child.name}`).join("\n"))}>Copy Route</button><button onClick={() => copy(location.href)}>Copy Link</button></header>{route.generations === 0 ? <p>Target already available · 0 generations</p> : route.steps.map((step, n) => <div key={n}><b>Step {n + 1}</b><Result result={step} /></div>)}</article>)}</div>;
}
