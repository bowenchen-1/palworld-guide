"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import PalMark from "./pal-mark";
import { BreedingData, playablePals, WorkKey, workGlyphs, workLabels } from "../lib/game-data";

export default function HomeToolBoard() {
  const [parentA, setParentA] = useState("");
  const [parentB, setParentB] = useState("");
  const [matrix, setMatrix] = useState<BreedingData>();
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [lookup, setLookup] = useState("140.0");
  const byId = useMemo(() => new Map(playablePals.map((pal) => [pal.id, pal])), []);
  const result = parentA && parentB && matrix ? byId.get(matrix[parentA]?.[parentB]) : undefined;
  const selectedPal = byId.get(lookup) ?? playablePals[0];

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

  return <div className="home-tool-board">
    <article className="home-breeding-card">
      <div className="home-tool-card-heading"><span>◉</span><div><p>Most used calculator</p><h3>Breeding Quick Start</h3></div><Link href="/breeding-calculator">Full calculator →</Link></div>
      <p className="home-tool-copy">Choose two parents to check their current Palworld 1.0 offspring without leaving the homepage.</p>
      <div className="home-breeding-inputs"><label><span>Parent A</span><select aria-label="Quick breeding parent A" value={parentA} onFocus={loadMatrix} onChange={(event) => { setParentA(event.target.value); loadMatrix(); }}><option value="">Select a Pal</option>{playablePals.map((pal) => <option key={pal.id} value={pal.id}>{pal.number} · {pal.name}</option>)}</select></label><b>+</b><label><span>Parent B</span><select aria-label="Quick breeding parent B" value={parentB} onFocus={loadMatrix} onChange={(event) => { setParentB(event.target.value); loadMatrix(); }}><option value="">Select a Pal</option>{playablePals.map((pal) => <option key={pal.id} value={pal.id}>{pal.number} · {pal.name}</option>)}</select></label></div>
      <div className={`home-breeding-result ${result ? "ready" : ""}`}><PalMark pal={result} small /><div><span>Offspring result</span><strong>{loading ? "Loading 1.0 data…" : loadError ? "Data unavailable — try again" : result?.name ?? (parentA && parentB ? "Choose a valid pair" : "Waiting for two parents")}</strong></div>{loadError ? <button type="button" onClick={loadMatrix}>Retry</button> : result && <Link href={`/pals/${result.slug}`}>View profile →</Link>}</div>
    </article>

    <article className="home-pal-lookup">
      <div className="home-tool-card-heading"><span>✦</span><div><p>Pal lookup</p><h3>Find Pal Data</h3></div></div>
      <p className="home-tool-copy">Open a current profile or preview verified breeding power and work suitability.</p>
      <label><span>Choose a Pal</span><select aria-label="Quick Pal lookup" value={lookup} onChange={(event) => setLookup(event.target.value)}>{playablePals.map((pal) => <option key={pal.id} value={pal.id}>{pal.number} · {pal.name}</option>)}</select></label>
      <div className="home-pal-preview"><PalMark pal={selectedPal} /><div><span>No. {selectedPal.number}</span><h4>{selectedPal.name}</h4><p>{Object.entries(selectedPal.work).slice(0, 3).map(([key, level]) => <b key={key}>{workGlyphs[key as WorkKey]} {workLabels[key as WorkKey]} {level}</b>)}</p><small>Breeding power {selectedPal.power}</small></div></div>
      <Link className="home-pal-open" href={`/pals/${selectedPal.slug}`}>Open {selectedPal.name} profile →</Link>
    </article>
  </div>;
}
