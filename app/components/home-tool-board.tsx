"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import PalMark from "./pal-mark";
import { BreedingData, playablePals, WorkKey, workGlyphs, workLabels } from "../lib/game-data";

type PickerSlot = "parentA" | "parentB" | "lookup" | null;

const quickRecipes = [
  { parentA: "139.0", parentB: "140.0", result: "151.0" },
  { parentA: "202.0", parentB: "186.0", result: "175.0" },
  { parentA: "189.0", parentB: "139.0", result: "176.0" },
];

export default function HomeToolBoard() {
  const [parentA, setParentA] = useState("");
  const [parentB, setParentB] = useState("");
  const [matrix, setMatrix] = useState<BreedingData>();
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [lookup, setLookup] = useState("140.0");
  const [picker, setPicker] = useState<PickerSlot>(null);
  const [pickerQuery, setPickerQuery] = useState("");
  const byId = useMemo(() => new Map(playablePals.map((pal) => [pal.id, pal])), []);
  const result = parentA && parentB && matrix ? byId.get(matrix[parentA]?.[parentB]) : undefined;
  const parentAPal = byId.get(parentA);
  const parentBPal = byId.get(parentB);
  const selectedPal = byId.get(lookup) ?? playablePals[0];
  const filteredPals = useMemo(() => {
    const needle = pickerQuery.trim().toLowerCase();
    return playablePals.filter((pal) => !needle || pal.name.toLowerCase().includes(needle) || pal.number.toLowerCase().includes(needle)).slice(0, 100);
  }, [pickerQuery]);

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
        <div><p><span /> Palworld 1.0 calculator</p><h3>Build your perfect egg.</h3><small>Pick two Pals. We will reveal the offspring instantly.</small></div>
        <Link href="/breeding-calculator">Open advanced calculator <b>↗</b></Link>
      </header>

      <div className="home-breeding-equation">
        <button className={`breeding-pal-slot ${parentAPal ? "selected" : ""}`} type="button" aria-label="Choose quick breeding parent A" onClick={() => openPicker("parentA")}>
          <span className="slot-label">Parent A</span><PalMark pal={parentAPal} /><strong>{parentAPal?.name ?? "Choose a Pal"}</strong><small>{parentAPal ? `No. ${parentAPal.number}` : "Tap to browse all Pals"}</small><i>Change</i>
        </button>
        <span className="breeding-operator" aria-hidden="true">+</span>
        <button className={`breeding-pal-slot ${parentBPal ? "selected" : ""}`} type="button" aria-label="Choose quick breeding parent B" onClick={() => openPicker("parentB")}>
          <span className="slot-label">Parent B</span><PalMark pal={parentBPal} /><strong>{parentBPal?.name ?? "Choose a Pal"}</strong><small>{parentBPal ? `No. ${parentBPal.number}` : "Tap to browse all Pals"}</small><i>Change</i>
        </button>
        <span className="breeding-operator equals" aria-hidden="true">=</span>
        <div className={`breeding-pal-slot offspring ${result ? "selected" : ""}`}>
          <span className="slot-label">Offspring</span><PalMark pal={result} /><strong>{loading ? "Calculating…" : loadError ? "Data unavailable — try again" : result?.name ?? "Your result"}</strong><small>{result ? `No. ${result.number}` : "Choose both parents"}</small>
          {loadError ? <button type="button" onClick={loadMatrix}>Retry</button> : result ? <Link href={`/pals/${result.slug}`}>View profile ↗</Link> : <i>Waiting</i>}
        </div>
      </div>

      <div className="breeding-recipe-dock">
        <div className="recipe-dock-title"><span>Popular combinations</span><small>Tap a recipe to try it</small></div>
        <div className="recipe-list">{quickRecipes.map((recipe) => {
          const first = byId.get(recipe.parentA); const second = byId.get(recipe.parentB); const child = byId.get(recipe.result);
          return <button type="button" key={`${recipe.parentA}-${recipe.parentB}`} onClick={() => chooseRecipe(recipe.parentA, recipe.parentB)} aria-label={`Try ${first?.name} and ${second?.name}`}><span><PalMark pal={first} small /><b>{first?.name}</b></span><i>+</i><span><PalMark pal={second} small /><b>{second?.name}</b></span><i>=</i><span><PalMark pal={child} small /><b>{child?.name}</b></span></button>;
        })}</div>
      </div>
    </article>

    <article className="home-pal-lookup">
      <div className="home-tool-card-heading"><span>✦</span><div><p>Pal lookup</p><h3>Find Pal Data</h3></div></div>
      <p className="home-tool-copy">Open a current profile or preview verified breeding power and work suitability.</p>
      <label><span>Choose a Pal</span><button type="button" className="home-lookup-picker" aria-label="Choose a Pal to preview" onClick={() => openPicker("lookup")}><PalMark pal={selectedPal} small /><span><b>{selectedPal.name}</b><small>No. {selectedPal.number}</small></span><em>Change</em></button></label>
      <div className="home-pal-preview"><PalMark pal={selectedPal} /><div><span>No. {selectedPal.number}</span><h4>{selectedPal.name}</h4><p>{Object.entries(selectedPal.work).slice(0, 3).map(([key, level]) => <b key={key}>{workGlyphs[key as WorkKey]} {workLabels[key as WorkKey]} {level}</b>)}</p><small>Breeding power {selectedPal.power}</small></div></div>
      <Link className="home-pal-open" href={`/pals/${selectedPal.slug}`}>Open {selectedPal.name} profile →</Link>
    </article>

    {picker && <div className="pal-picker-backdrop home-picker-backdrop" onClick={() => setPicker(null)}><section className="pal-picker home-pal-picker" role="dialog" aria-modal="true" aria-label="Choose a Pal with image" onClick={(event) => event.stopPropagation()}><header><div><p>Pictured Pal selection</p><h2>{picker === "parentA" ? "Choose Parent A" : picker === "parentB" ? "Choose Parent B" : "Choose a Pal"}</h2><small>Search or choose from the current Palworld 1.0 roster.</small></div><button type="button" onClick={() => setPicker(null)} aria-label="Close Pal selection">×</button></header><label className="home-picker-search"><span>⌕</span><input autoFocus value={pickerQuery} onChange={(event) => setPickerQuery(event.target.value)} placeholder="Search by Pal name or number…" aria-label="Search pictured Pals" /><kbd>{filteredPals.length} shown</kbd></label><div className="pal-picker-grid">{filteredPals.map((pal) => <button type="button" key={pal.id} onClick={() => choosePal(pal.id)}><PalMark pal={pal} /><span><b>{pal.name}</b><small>No. {pal.number}</small></span></button>)}</div></section></div>}
  </div>;
}
