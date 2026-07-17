"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import PalMark from "../components/pal-mark";
import SiteHeader from "../components/site-header";
import { BreedingData, catalogPals, findPal, PalData, pals } from "../lib/game-data";
import { comparePals, findParentPairs, type BreedingResult } from "./breeding/core";

const PAGE_SIZE = 50;

function ResultPair({ result }: { result: BreedingResult }) {
  return <article className="breeding-result-pair"><Link href={`/pals/${result.first.slug}`} className="breeding-result-pal"><PalMark pal={result.first} small /><span><strong>{result.first.name}</strong><small>Parent Slot 1 · No. {result.first.number}</small></span></Link><b className="breeding-result-operator">+</b><Link href={`/pals/${result.second.slug}`} className="breeding-result-pal"><PalMark pal={result.second} small /><span><strong>{result.second.name}</strong><small>Parent Slot 2 · No. {result.second.number}</small></span></Link></article>;
}

function ParentFilter({ candidates, value, onChange }: { candidates: PalData[]; value?: PalData; onChange: (pal?: PalData) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const matches = useMemo(() => { const needle = query.trim().toLowerCase(); return candidates.filter((pal) => !needle || pal.name.toLowerCase().includes(needle) || pal.number.includes(needle)); }, [candidates, query]);
  return <div className="breeding-parent-filter"><span>Filter by Parent Pal</span><div className="breeding-parent-filter-control"><button type="button" className="breeding-parent-filter-trigger" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)}>{value ? <><PalMark pal={value} small /><span>{value.name}<small>No. {value.number}</small></span></> : <span>Select a Pal from these results</span>}<b aria-hidden="true">⌄</b></button>{open && <div className="breeding-parent-filter-menu" role="listbox"><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search parent Pals…" aria-label="Search parent Pals" />{value && <button type="button" className="breeding-parent-filter-option clear" onClick={() => { onChange(undefined); setOpen(false); setQuery(""); }}>Clear Filter</button>}{matches.map((pal) => <button type="button" role="option" aria-selected={value?.id === pal.id} className="breeding-parent-filter-option" key={pal.id} onClick={() => { onChange(pal); setOpen(false); setQuery(""); }}><PalMark pal={pal} small /><span><strong>{pal.name}</strong><small>No. {pal.number}</small></span></button>)}{!matches.length && <p className="breeding-parent-filter-empty">No matching parent Pals.</p>}</div>}</div></div>;
}

export default function BreedingResultsPage({ targetSlug, parentSlug }: { targetSlug?: string; parentSlug?: string }) {
  const [matrix, setMatrix] = useState<BreedingData>({});
  const [matrixError, setMatrixError] = useState(false);
  const [selectedParentSlug, setSelectedParentSlug] = useState(parentSlug);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const resultRef = useRef<HTMLElement>(null);
  const target = targetSlug ? findPal(targetSlug) : undefined;
  const byId = useMemo(() => new Map(pals.map((pal) => [pal.id, pal])), []);
  const allPairs = useMemo(() => target && Object.keys(matrix).length ? findParentPairs(matrix, byId, target) : [], [target, matrix, byId]);
  const parentCandidates = useMemo(() => Array.from(new Map(allPairs.flatMap((result) => [result.first, result.second]).map((pal) => [pal.slug, pal])).values()).sort(comparePals), [allPairs]);
  const selectedParent = selectedParentSlug ? parentCandidates.find((pal) => pal.slug === selectedParentSlug) : undefined;
  const filteredPairs = useMemo(() => selectedParent ? allPairs.filter((result) => result.first.id === selectedParent.id || result.second.id === selectedParent.id) : allPairs, [allPairs, selectedParent]);
  const visiblePairs = filteredPairs.slice(0, visibleCount);
  const parentSlugs = Array.from(new Set(filteredPairs.flatMap((result) => [result.first.slug, result.second.slug]).filter((slug) => catalogPals.some((pal) => pal.slug === slug))));
  const matrixReady = Object.keys(matrix).length > 0;

  useEffect(() => { fetch("/data/breeding.json").then((response) => response.ok ? response.json() : Promise.reject()).then(setMatrix).catch(() => setMatrixError(true)); }, []);
  function updateParent(pal?: PalData) {
    setSelectedParentSlug(pal?.slug);
    setVisibleCount(PAGE_SIZE);
    const query = new URLSearchParams();
    if (target) query.set("target", target.slug);
    if (pal) query.set("parent", pal.slug);
    history.pushState(null, "", `/breeding-calculator?${query}`);
    requestAnimationFrame(() => resultRef.current?.scrollIntoView({ block: "start", behavior: "smooth" }));
  }
  useEffect(() => { const onPopState = () => { const params = new URLSearchParams(location.search); const nextTarget = params.get("target"); const nextParent = params.get("parent"); if (nextTarget !== targetSlug) location.reload(); else { setSelectedParentSlug(parentCandidates.some((pal) => pal.slug === nextParent) ? nextParent ?? undefined : undefined); setVisibleCount(PAGE_SIZE); requestAnimationFrame(() => resultRef.current?.scrollIntoView({ block: "start", behavior: "smooth" })); } }; window.addEventListener("popstate", onPopState); return () => window.removeEventListener("popstate", onPopState); }, [targetSlug, parentCandidates]);

  const resultContent = matrixError ? <p className="breeding-results-none">Breeding data is unavailable right now. Please try again.</p> : !matrixReady ? <p className="breeding-results-loading" aria-busy="true">Loading parent combinations…</p> : <><div className="breeding-results-summary"><div><strong>{filteredPairs.length.toLocaleString()} Possible Parent Combinations</strong><span>{selectedParent ? `Combinations Using ${selectedParent.name}` : "All parent combinations"}</span></div><ParentFilter candidates={parentCandidates} value={selectedParent} onChange={updateParent} /></div>{selectedParent && <div className="breeding-results-filter-status"><strong>Combinations Using {selectedParent.name}</strong><span>Showing {filteredPairs.length.toLocaleString()} combinations</span><button type="button" onClick={() => updateParent()}>Clear Filter</button></div>}{filteredPairs.length ? <><p className="breeding-results-count">Showing 1–{Math.min(visibleCount, filteredPairs.length)} of {filteredPairs.length.toLocaleString()} combinations</p><div className="breeding-results-list">{visiblePairs.map((result, index) => <ResultPair key={`${result.first.id}-${result.second.id}-${index}`} result={result} />)}</div>{visibleCount < filteredPairs.length ? <button type="button" className="breeding-results-load" onClick={() => setVisibleCount((count) => Math.min(count + PAGE_SIZE, filteredPairs.length))}>Load {Math.min(PAGE_SIZE, filteredPairs.length - visibleCount)} More</button> : <p className="breeding-results-all">All {filteredPairs.length.toLocaleString()} combinations shown</p>}<div className="breeding-results-database"><Link href={`/pals?ids=${parentSlugs.join(",")}`}>View Parent Pals in Database</Link></div></> : <p className="breeding-results-none">No parent combinations found for this Pal.</p>}</>;
  return <main className="breeding-results-page"><div className="breeding-results-shell"><SiteHeader /><Link className="breeding-results-back" href="/?mode=target#breeding-calculator">Choose Another Target Pal</Link>{!targetSlug ? <section className="breeding-results-empty"><h1>Select a target Pal to find parent combinations.</h1><Link className="breeding-results-cta" href="/?mode=target#breeding-calculator">Choose a Target Pal</Link></section> : !target ? <section className="breeding-results-empty"><h1>Pal not found</h1><Link className="breeding-results-cta" href="/?mode=target#breeding-calculator">Choose a Target Pal</Link></section> : <><header className="breeding-results-heading"><div><p className="database-eyebrow">Target Pal · Paldeck No. {target.number}</p><h1>Breeding Parents for {target.name}</h1><p className="breeding-results-target-link"><Link href={`/pals/${target.slug}`}><PalMark pal={target} /><span>{target.name}<small>View Pal Details</small></span></Link></p></div></header><section ref={resultRef} className="breeding-results-content">{resultContent}</section></>}</div></main>;
}
