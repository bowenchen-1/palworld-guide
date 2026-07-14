"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import PalMark from "./pal-mark";
import { BreedingData, PalData, pals, WorkKey, workGlyphs, workLabels } from "../lib/game-data";

type PickerSlot = "parentA" | "parentB" | "lookup" | "target" | null;
type CalculatorMode = "parents" | "target";

const HOME_PAIR_LIMIT = 12;

const quickRecipes = [
  { parentA: "139.0", parentB: "140.0", result: "151.0" },
  { parentA: "202.0", parentB: "186.0", result: "175.0" },
  { parentA: "189.0", parentB: "139.0", result: "176.0" },
];

export default function HomeToolBoard({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const [mode, setMode] = useState<CalculatorMode>("parents");
  const [parentA, setParentA] = useState("");
  const [parentB, setParentB] = useState("");
  const [target, setTarget] = useState<PalData>();
  const [matrix, setMatrix] = useState<BreedingData>();
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [lookup, setLookup] = useState("140.0");
  const [picker, setPicker] = useState<PickerSlot>(null);
  const [pickerQuery, setPickerQuery] = useState("");
  const byId = useMemo(() => new Map(pals.map((pal) => [pal.id, pal])), []);
  const result = parentA && parentB && matrix ? byId.get(matrix[parentA]?.[parentB]) : undefined;
  const parentAPal = byId.get(parentA);
  const parentBPal = byId.get(parentB);
  const selectedPal = byId.get(lookup) ?? pals[0];
  const filteredPals = useMemo(() => {
    const needle = pickerQuery.trim().toLowerCase();
    return pals.filter((pal) => !needle || pal.name.toLowerCase().includes(needle) || pal.number.toLowerCase().includes(needle)).slice(0, 100);
  }, [pickerQuery]);
  const pairSummary = useMemo(() => {
    const matches: [PalData, PalData][] = [];
    let total = 0;
    if (!target || !matrix) return { matches, total };

    for (let firstIndex = 0; firstIndex < pals.length; firstIndex += 1) {
      const first = pals[firstIndex];
      for (let secondIndex = firstIndex; secondIndex < pals.length; secondIndex += 1) {
        const second = pals[secondIndex];
        if (matrix[first.id]?.[second.id] !== target.id) continue;
        total += 1;
        if (matches.length < HOME_PAIR_LIMIT) matches.push([first, second]);
      }
    }
    return { matches, total };
  }, [target, matrix]);

  async function loadMatrix() {
    if (matrix || loading) return;
    setLoading(true);
    setLoadError(false);
    try {
      const response = await fetch("/data/breeding.json");
      if (!response.ok) throw new Error("Breeding data could not be loaded");
      setMatrix(await response.json());
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }

  function openPicker(slot: Exclude<PickerSlot, null>) {
    setPicker(slot);
    setPickerQuery("");
    if (slot !== "lookup") loadMatrix();
  }

  function choosePal(id: string) {
    if (picker === "parentA") setParentA(id);
    if (picker === "parentB") setParentB(id);
    if (picker === "lookup") setLookup(id);
    if (picker === "target") {
      setTarget(byId.get(id));
      setMode("target");
    }
    setPicker(null);
    setPickerQuery("");
  }

  function chooseRecipe(first: string, second: string) {
    setParentA(first);
    setParentB(second);
    loadMatrix();
  }

  return <div className="home-tool-board">
    <article id="quick-breeding" className="home-breeding-card">
      <div className="breeding-card-glow" aria-hidden="true" />
      <header className="breeding-stage-header">
        <div><p><span /> Palworld 1.0 calculator</p>{headingLevel === 2 ? <h2>Palworld Breeding Calculator</h2> : <h3>Palworld Breeding Calculator</h3>}<small>{mode === "parents" ? "Pick two Pals to reveal the offspring instantly." : "Direct parent combinations for your chosen Pal."}</small></div>
        <Link href="/breeding-calculator">Find all combinations <b>↗</b></Link>
      </header>

      {mode === "parents" ? <><div className="home-breeding-equation">
        <button className={`breeding-pal-slot ${parentAPal ? "selected" : ""}`} type="button" aria-label="Choose quick breeding parent A" onClick={() => openPicker("parentA")}>
          <span className="slot-label">Parent A</span><PalMark pal={parentAPal} /><strong>{parentAPal?.name ?? "Choose a Pal"}</strong><small>{parentAPal ? `No. ${parentAPal.number}` : "Tap to browse all Pals"}</small><i>Change</i>
        </button>
        <span className="breeding-operator" aria-hidden="true">+</span>
        <button className={`breeding-pal-slot ${parentBPal ? "selected" : ""}`} type="button" aria-label="Choose quick breeding parent B" onClick={() => openPicker("parentB")}>
          <span className="slot-label">Parent B</span><PalMark pal={parentBPal} /><strong>{parentBPal?.name ?? "Choose a Pal"}</strong><small>{parentBPal ? `No. ${parentBPal.number}` : "Tap to browse all Pals"}</small><i>Change</i>
        </button>
        <span className="breeding-operator equals" aria-hidden="true">=</span>
        <button className={`breeding-pal-slot offspring ${result ? "selected" : ""}`} type="button" aria-label="Choose a Pal and find its parent combinations" onClick={() => openPicker("target")}>
          <span className="slot-label">Offspring</span><PalMark pal={result} /><strong>{loading ? "Calculating…" : loadError ? "Choose a target Pal" : result?.name ?? "Find Parent Pairs"}</strong><small>{result ? `No. ${result.number} · tap to find its parents` : "Tap to choose any Pal directly"}</small><i>Choose Pal</i>
        </button>
      </div>

      <div className="breeding-recipe-dock">
        <div className="recipe-dock-title"><span>Popular combinations</span><small>Tap a recipe to try it</small></div>
        <div className="recipe-list">{quickRecipes.map((recipe) => {
          const first = byId.get(recipe.parentA); const second = byId.get(recipe.parentB); const child = byId.get(recipe.result);
          return <button type="button" key={`${recipe.parentA}-${recipe.parentB}`} onClick={() => chooseRecipe(recipe.parentA, recipe.parentB)} aria-label={`Try ${first?.name} and ${second?.name}`}><span><PalMark pal={first} small /><b>{first?.name}</b></span><i>+</i><span><PalMark pal={second} small /><b>{second?.name}</b></span><i>=</i><span><PalMark pal={child} small /><b>{child?.name}</b></span></button>;
        })}</div>
      </div>
      </> : <div className="home-target-inline" aria-live="polite">
        <button type="button" className="target-return" onClick={() => setMode("parents")}>← Parents → Result</button>
        <button type="button" className="home-target-picker" onClick={() => openPicker("target")} aria-label="Choose the target Pal">
          <PalMark pal={target} />
          <span><small>Target Pal</small><strong>{target?.name ?? "Choose a Pal"}</strong><em>{target ? `No. ${target.number}` : "Search the current Pal roster"}</em></span>
          <b>Change</b>
        </button>
        {target && loading && <div className="home-target-empty"><span className="home-target-spinner" /><strong>Loading current combinations…</strong></div>}
        {target && loadError && <div className="home-target-empty"><span>!</span><strong>Breeding data is unavailable.</strong><button type="button" onClick={loadMatrix}>Retry</button></div>}
        {target && matrix && !pairSummary.total && <div className="home-target-empty"><span>0</span><strong>No direct parent pairs found for {target.name}.</strong></div>}
        {target && matrix && pairSummary.total > 0 && <>
          <div className="home-target-result-heading"><div><PalMark pal={target} small /><p><strong>{target.name}</strong><span>{pairSummary.total} direct parent {pairSummary.total === 1 ? "pair" : "pairs"} found</span></p></div><small>{pairSummary.total > HOME_PAIR_LIMIT ? `Showing the first ${HOME_PAIR_LIMIT}` : "All direct pairs shown"}</small></div>
          <div className="home-target-pair-grid">{pairSummary.matches.map(([first, second], index) => <article key={`${first.id}-${second.id}`}>
            <span className="home-target-pair-number">{String(index + 1).padStart(2, "0")}</span>
            <div><PalMark pal={first} small /><strong>{first.name}</strong></div><b>+</b><div><PalMark pal={second} small /><strong>{second.name}</strong></div>
          </article>)}</div>
        </>}
      </div>}
    </article>

    <article className="home-pal-lookup">
      <div className="home-tool-card-heading"><span>✦</span><div><p>Pal lookup</p><h3>Find Pal Data</h3></div></div>
      <p className="home-tool-copy">Open a current profile or preview verified breeding power and work suitability.</p>
      <label><span>Choose a Pal</span><button type="button" className="home-lookup-picker" aria-label="Choose a Pal to preview" onClick={() => openPicker("lookup")}><PalMark pal={selectedPal} small /><span><b>{selectedPal.name}</b><small>No. {selectedPal.number}</small></span><em>Change</em></button></label>
      <div className="home-pal-preview"><PalMark pal={selectedPal} /><div><span>No. {selectedPal.number}</span><h4>{selectedPal.name}</h4><p>{Object.entries(selectedPal.work).slice(0, 3).map(([key, level]) => <b key={key}>{workGlyphs[key as WorkKey]} {workLabels[key as WorkKey]} {level}</b>)}</p><small>Breeding power {selectedPal.power}</small></div></div>
      <Link className="home-pal-open" href={`/pals/${selectedPal.slug}`}>Open {selectedPal.name} profile →</Link>
    </article>

    {picker && typeof document !== "undefined" && createPortal(<div className="pal-picker-backdrop home-picker-backdrop" onClick={() => setPicker(null)}><section className="pal-picker home-pal-picker" role="dialog" aria-modal="true" aria-label="Choose a Pal with image" onClick={(event) => event.stopPropagation()}><header><div><p>Pictured Pal selection</p><h2>{picker === "parentA" ? "Choose Parent A" : picker === "parentB" ? "Choose Parent B" : picker === "target" ? "Choose Your Target Pal" : "Choose a Pal"}</h2><small>Search or choose from the current Palworld 1.0 roster.</small></div><button type="button" onClick={() => setPicker(null)} aria-label="Close Pal selection">×</button></header><label className="home-picker-search"><span>⌕</span><input autoFocus value={pickerQuery} onChange={(event) => setPickerQuery(event.target.value)} placeholder="Search by Pal name or number…" aria-label="Search pictured Pals" /><kbd>{filteredPals.length} shown</kbd></label><div className="pal-picker-grid">{filteredPals.map((pal) => <button type="button" key={pal.id} onClick={() => choosePal(pal.id)}><PalMark pal={pal} /><span><b>{pal.name}</b><small>No. {pal.number}</small></span></button>)}</div></section></div>, document.body)}
  </div>;
}
