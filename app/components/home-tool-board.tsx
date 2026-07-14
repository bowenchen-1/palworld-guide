"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import PalMark from "./pal-mark";
import { BreedingData, playablePals, WorkKey, workGlyphs, workLabels } from "../lib/game-data";

type PickerSlot = "parentA" | "parentB" | "lookup" | null;

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

  return <div className="home-tool-board">
    <article className="home-breeding-card">
      <div className="home-tool-card-heading"><span>◉</span><div><p>Calculate on the homepage</p><h3>Breeding Calculator</h3></div><Link href="/breeding-calculator">Advanced modes →</Link></div>
      <p className="home-tool-copy">Choose two pictured parents and see their current Palworld 1.0 offspring instantly, without leaving the homepage.</p>
      <div className="home-breeding-inputs"><label><span>Parent A</span><button type="button" aria-label="Choose quick breeding parent A" onClick={() => openPicker("parentA")}><PalMark pal={parentAPal} small /><span><b>{parentAPal?.name ?? "Select a Pal"}</b><small>{parentAPal ? `No. ${parentAPal.number}` : "Open pictured Pal list"}</small></span><em>⌄</em></button></label><b>+</b><label><span>Parent B</span><button type="button" aria-label="Choose quick breeding parent B" onClick={() => openPicker("parentB")}><PalMark pal={parentBPal} small /><span><b>{parentBPal?.name ?? "Select a Pal"}</b><small>{parentBPal ? `No. ${parentBPal.number}` : "Open pictured Pal list"}</small></span><em>⌄</em></button></label></div>
      <div className={`home-breeding-result ${result ? "ready" : ""}`}><PalMark pal={result} small /><div><span>Offspring result</span><strong>{loading ? "Loading 1.0 data…" : loadError ? "Data unavailable — try again" : result?.name ?? (parentA && parentB ? "Choose a valid pair" : "Waiting for two parents")}</strong></div>{loadError ? <button type="button" onClick={loadMatrix}>Retry</button> : result && <Link href={`/pals/${result.slug}`}>View profile →</Link>}</div>
    </article>

    <article className="home-pal-lookup">
      <div className="home-tool-card-heading"><span>✦</span><div><p>Pal lookup</p><h3>Find Pal Data</h3></div></div>
      <p className="home-tool-copy">Open a current profile or preview verified breeding power and work suitability.</p>
      <label><span>Choose a Pal</span><button type="button" className="home-lookup-picker" aria-label="Choose a Pal to preview" onClick={() => openPicker("lookup")}><PalMark pal={selectedPal} small /><span><b>{selectedPal.name}</b><small>No. {selectedPal.number}</small></span><em>Change</em></button></label>
      <div className="home-pal-preview"><PalMark pal={selectedPal} /><div><span>No. {selectedPal.number}</span><h4>{selectedPal.name}</h4><p>{Object.entries(selectedPal.work).slice(0, 3).map(([key, level]) => <b key={key}>{workGlyphs[key as WorkKey]} {workLabels[key as WorkKey]} {level}</b>)}</p><small>Breeding power {selectedPal.power}</small></div></div>
      <Link className="home-pal-open" href={`/pals/${selectedPal.slug}`}>Open {selectedPal.name} profile →</Link>
    </article>

    {picker && <div className="pal-picker-backdrop home-picker-backdrop" onClick={() => setPicker(null)}><section className="pal-picker home-pal-picker" role="dialog" aria-modal="true" aria-label="Choose a Pal with image" onClick={(event) => event.stopPropagation()}><header><div><p>Pictured Pal selection</p><h2>{picker === "parentA" ? "Choose Parent A" : picker === "parentB" ? "Choose Parent B" : "Choose a Pal"}</h2></div><button type="button" onClick={() => setPicker(null)} aria-label="Close Pal selection">×</button></header><input autoFocus value={pickerQuery} onChange={(event) => setPickerQuery(event.target.value)} placeholder="Search by Pal name or number…" aria-label="Search pictured Pals" /><div className="pal-picker-grid">{filteredPals.map((pal) => <button type="button" key={pal.id} onClick={() => choosePal(pal.id)}><PalMark pal={pal} small /><span><b>{pal.name}</b><small>No. {pal.number} · Power {pal.power}</small></span></button>)}</div></section></div>}
  </div>;
}
