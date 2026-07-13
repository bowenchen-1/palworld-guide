"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import PalMark from "../components/pal-mark";
import { BreedingData, PalData, pals } from "../lib/game-data";

type PickerSlot = "parent1" | "parent2" | "target" | null;

export default function BreedingClient() {
  const [matrix, setMatrix] = useState<BreedingData>({});
  const [mode, setMode] = useState<"parents" | "target">("parents");
  const [parent1, setParent1] = useState<PalData>();
  const [parent2, setParent2] = useState<PalData>();
  const [target, setTarget] = useState<PalData>();
  const [picker, setPicker] = useState<PickerSlot>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/data/breeding.json").then((response) => response.json()).then(setMatrix);
  }, []);

  const byId = useMemo(() => new Map(pals.map((pal) => [pal.id, pal])), []);
  const result = parent1 && parent2 ? byId.get(matrix[parent1.id]?.[parent2.id]) : undefined;
  const filteredPals = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return pals.filter((pal) => !needle || pal.name.toLowerCase().includes(needle) || pal.number.toLowerCase().includes(needle)).slice(0, 100);
  }, [query]);
  const targetPairs = useMemo(() => {
    if (!target || !Object.keys(matrix).length) return [];
    const pairs: [PalData, PalData][] = [];
    for (let firstIndex = 0; firstIndex < pals.length; firstIndex += 1) {
      const first = pals[firstIndex];
      for (let secondIndex = firstIndex; secondIndex < pals.length; secondIndex += 1) {
        const second = pals[secondIndex];
        if (matrix[first.id]?.[second.id] === target.id) pairs.push([first, second]);
        if (pairs.length === 120) return pairs;
      }
    }
    return pairs;
  }, [target, matrix]);

  function choose(pal: PalData) {
    if (picker === "parent1") setParent1(pal);
    if (picker === "parent2") setParent2(pal);
    if (picker === "target") setTarget(pal);
    setPicker(null);
    setQuery("");
  }

  return (
    <section className="database-workspace breeding-workspace" aria-label="Palworld breeding calculator controls">
      <div className="mode-switch" role="tablist" aria-label="Calculator mode">
        <button className={mode === "parents" ? "active" : ""} onClick={() => setMode("parents")}>Parents → Child</button>
        <button className={mode === "target" ? "active" : ""} onClick={() => setMode("target")}>Target → Parents</button>
      </div>

      {mode === "parents" ? <>
        <div className="breeding-equation">
          <button className="pal-select-card" onClick={() => setPicker("parent1")}><PalMark pal={parent1} /><span>Parent 1</span><strong>{parent1?.name ?? "Choose a Pal"}</strong></button>
          <span className="equation-mark">+</span>
          <button className="pal-select-card" onClick={() => setPicker("parent2")}><PalMark pal={parent2} /><span>Parent 2</span><strong>{parent2?.name ?? "Choose a Pal"}</strong></button>
          <span className="equation-mark">=</span>
          <div className={`pal-select-card result ${result ? "ready" : ""}`}><PalMark pal={result} /><span>Egg Result</span><strong>{result?.name ?? (parent1 && parent2 ? "Loading 1.0 result…" : "Waiting for parents")}</strong>{result && <Link href={`/pals/${result.slug}`}>View Pal profile →</Link>}</div>
        </div>
        <div className="calculator-foot"><p>Results use the full 1.0 breeding matrix, including revised standard and special combinations.</p><button onClick={() => { setParent1(undefined); setParent2(undefined); }}>Reset selection</button></div>
      </> : <>
        <div className="target-picker"><div><p>Target Pal</p><h2>{target?.name ?? "Which Pal do you want?"}</h2><span>Choose a child to find matching parent combinations in version 1.0.</span></div><button onClick={() => setPicker("target")}><PalMark pal={target} /><b>{target ? "Change target" : "Choose target"}</b></button></div>
        {target && <div className="breeding-pair-list"><div className="result-count"><strong>{targetPairs.length}</strong><span>{targetPairs.length === 120 ? "parent pairs shown (first 120)" : "parent pairs found"}</span></div>{targetPairs.map(([first, second]) => <article key={`${first.id}-${second.id}`}><div><PalMark pal={first} small /><span>{first.name}</span></div><b>+</b><div><PalMark pal={second} small /><span>{second.name}</span></div><button onClick={() => { setParent1(first); setParent2(second); setMode("parents"); }}>Use pair →</button></article>)}</div>}
      </>}

      {picker && <div className="pal-picker-backdrop" onClick={() => setPicker(null)}><section className="pal-picker" onClick={(event) => event.stopPropagation()}><header><div><p>Pal selection</p><h2>{picker === "target" ? "Choose Target Pal" : picker === "parent1" ? "Choose Parent 1" : "Choose Parent 2"}</h2></div><button onClick={() => setPicker(null)} aria-label="Close selection">×</button></header><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by Pal name or number…" aria-label="Search Pals" /><div className="pal-picker-grid">{filteredPals.map((pal) => <button key={pal.id} onClick={() => choose(pal)}><PalMark pal={pal} small /><span><b>{pal.name}</b><small>No. {pal.number} · Power {pal.power}</small></span></button>)}</div></section></div>}
    </section>
  );
}
