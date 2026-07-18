"use client";

import { useMemo, useState } from "react";
import { BreedingData, PalData, pals } from "../lib/game-data";
import { assetUrl } from "../lib/assets";
import PalMark from "./pal-mark";

const HOME_PAIR_LIMIT = 12;

export default function HomeTargetBreeding() {
  const [target, setTarget] = useState<PalData>();
  const [matrix, setMatrix] = useState<BreedingData>();
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filteredPals = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return pals
      .filter((pal) => !needle || pal.name.toLowerCase().includes(needle) || pal.number.toLowerCase().includes(needle))
      .slice(0, 100);
  }, [query]);

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
      const response = await fetch(assetUrl("/data/breeding.json"));
      if (!response.ok) throw new Error("Breeding data could not be loaded");
      setMatrix(await response.json());
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }

  function openPicker() {
    setQuery("");
    setPickerOpen(true);
    loadMatrix();
  }

  function chooseTarget(pal: PalData) {
    setTarget(pal);
    setPickerOpen(false);
    setQuery("");
  }

  return (
    <section className="home-target-section" aria-labelledby="target-breeding-title">
      <div className="home-target-panel">
        <header>
          <div>
            <p className="eyebrow">Target → Parents</p>
            <h2 id="target-breeding-title">Find Parent Combinations for Any Pal</h2>
            <span>Choose the Pal you want. We will search the current version 1.0 matrix for direct parent pairs.</span>
          </div>
          <button type="button" className="home-target-picker" onClick={openPicker} aria-label="Choose the target Pal">
            <PalMark pal={target} />
            <span><small>Target Pal</small><strong>{target?.name ?? "Choose a Pal"}</strong></span>
            <b>Change</b>
          </button>
        </header>

        <div className="home-target-results" aria-live="polite">
          {!target && <div className="home-target-empty"><span>✦</span><strong>Choose the Pal you want to breed.</strong><p>Search by name or Paldeck number, then compare the parent combinations shown here.</p></div>}
          {target && loading && <div className="home-target-empty"><span className="home-target-spinner" /><strong>Loading current combinations…</strong></div>}
          {target && loadError && <div className="home-target-empty"><span>!</span><strong>Breeding data is unavailable.</strong><button type="button" onClick={loadMatrix}>Retry</button></div>}
          {target && matrix && !pairSummary.total && <div className="home-target-empty"><span>0</span><strong>No direct parent pairs found for {target.name}.</strong></div>}
          {target && matrix && pairSummary.total > 0 && <>
            <div className="home-target-result-heading"><div><PalMark pal={target} small /><p><strong>{target.name}</strong><span>{pairSummary.total} direct parent {pairSummary.total === 1 ? "pair" : "pairs"} found</span></p></div><small>{pairSummary.total > HOME_PAIR_LIMIT ? `Showing the first ${HOME_PAIR_LIMIT}` : "All direct pairs shown"}</small></div>
            <div className="home-target-pair-grid">{pairSummary.matches.map(([first, second], index) => <article key={`${first.id}-${second.id}`}>
              <span className="home-target-pair-number">{String(index + 1).padStart(2, "0")}</span>
              <div><PalMark pal={first} small /><strong>{first.name}</strong></div>
              <b>+</b>
              <div><PalMark pal={second} small /><strong>{second.name}</strong></div>
            </article>)}</div>
          </>}
        </div>
      </div>

      {pickerOpen && <div className="pal-picker-backdrop home-picker-backdrop" onClick={() => setPickerOpen(false)}>
        <section className="pal-picker home-pal-picker" role="dialog" aria-modal="true" aria-label="Choose a target Pal with image" onClick={(event) => event.stopPropagation()}>
          <header><div><p>Pictured Pal selection</p><h2>Choose the Pal You Want</h2><small>Search the current Palworld 1.0 roster by name or number.</small></div><button type="button" onClick={() => setPickerOpen(false)} aria-label="Close target Pal selection">×</button></header>
          <label className="home-picker-search"><span>⌕</span><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by Pal name or number…" aria-label="Search target Pals" /><kbd>{filteredPals.length} shown</kbd></label>
          <div className="pal-picker-grid">{filteredPals.map((pal) => <button type="button" key={pal.id} onClick={() => chooseTarget(pal)}><PalMark pal={pal} /><span><b>{pal.name}</b><small>No. {pal.number}</small></span></button>)}</div>
        </section>
      </div>}
    </section>
  );
}
