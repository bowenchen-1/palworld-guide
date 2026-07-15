"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ElementIcon, PartnerSkillIcon, WorkSuitabilityIcon } from "../components/pal-icons";
import PalMark from "../components/pal-mark";
import { PalData, pals, workLabels } from "../lib/game-data";
import { average, duplicateIds, elementCoverage, emptyTeam, normalizeTeam, parseTeamParam, serializeTeam, TeamSlots, workCoverage } from "./core";

const STORAGE_KEY = "palworld-team-builder-v1";
const PICKER_BATCH_SIZE = 60;
const allElements = ["Neutral", "Fire", "Water", "Grass", "Electric", "Ice", "Ground", "Dark", "Dragon"];

function readStoredTeam(validIds: ReadonlySet<string>) {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value ? normalizeTeam(JSON.parse(value), validIds) : emptyTeam();
  } catch {
    return emptyTeam();
  }
}

export default function TeamBuilderClient() {
  const byId = useMemo(() => new Map(pals.map((pal) => [pal.id, pal])), []);
  const validIds = useMemo(() => new Set(pals.map((pal) => pal.id)), []);
  const [team, setTeam] = useState<TeamSlots>(() => emptyTeam());
  const [restored, setRestored] = useState(false);
  const [pickerSlot, setPickerSlot] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [element, setElement] = useState<string | null>(null);
  const [limit, setLimit] = useState(PICKER_BATCH_SIZE);
  const [notice, setNotice] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const params = new URLSearchParams(window.location.search);
      const fromUrl = params.get("team");
      setTeam(fromUrl ? parseTeamParam(fromUrl, validIds) : readStoredTeam(validIds));
      setRestored(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [validIds]);

  useEffect(() => {
    if (!restored) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(team)); } catch { /* Storage can be blocked without breaking the builder. */ }
    const params = new URLSearchParams(window.location.search);
    const serialized = serializeTeam(team);
    if (serialized) params.set("team", serialized); else params.delete("team");
    const next = `${window.location.pathname}${params.size ? `?${params}` : ""}`;
    window.history.replaceState(null, "", next);
  }, [restored, team]);

  useEffect(() => {
    if (pickerSlot !== null) requestAnimationFrame(() => searchRef.current?.focus());
  }, [pickerSlot]);

  const selectedEntries = team.flatMap((id, slot) => {
    const pal = id ? byId.get(id) : undefined;
    return pal ? [{ pal, slot }] : [];
  });
  const selected = selectedEntries.map(({ pal }) => pal);
  const duplicates = duplicateIds(team);
  const elements = elementCoverage(selected);
  const work = workCoverage(selected);
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return pals.filter((pal) => (!element || pal.elements.includes(element)) && (!term || pal.name.toLowerCase().includes(term) || pal.number.toLowerCase().includes(term))).sort((a, b) => a.number.localeCompare(b.number, undefined, { numeric: true }) || a.name.localeCompare(b.name));
  }, [element, query]);
  const shown = filtered.slice(0, limit);

  function openPicker(index: number) {
    setQuery("");
    setElement(null);
    setLimit(PICKER_BATCH_SIZE);
    setPickerSlot(index);
  }

  function closePicker() {
    const index = pickerSlot;
    setPickerSlot(null);
    if (index !== null) requestAnimationFrame(() => triggerRefs.current[index]?.focus());
  }

  function choose(pal: PalData) {
    if (pickerSlot === null) return;
    const slot = pickerSlot;
    setTeam((current) => current.map((id, index) => index === slot ? pal.id : id));
    closePicker();
    setNotice(`${pal.name} added to slot ${slot + 1}.`);
  }

  function remove(index: number) {
    const pal = team[index] ? byId.get(team[index] as string) : undefined;
    setTeam((current) => current.map((id, slot) => slot === index ? null : id));
    setNotice(pal ? `${pal.name} removed from the team.` : "Slot cleared.");
  }

  function saveTeam() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(team));
      setNotice("Team saved on this device.");
    } catch {
      setNotice("This browser blocked local saving. The share link still works.");
    }
  }

  async function copyShareLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setNotice("Share link copied.");
    } catch {
      setNotice("Could not copy automatically. Copy the address from your browser.");
    }
  }

  return <section className="team-builder" aria-label="Palworld team builder">
    <div className="team-builder-statusbar">
      <p><span>Party status</span><strong>{selected.length}/5 positions filled</strong></p>
      <div><button type="button" onClick={saveTeam}>Save team</button><button type="button" onClick={copyShareLink} disabled={!selected.length}>Copy share link</button><button type="button" className="danger" onClick={() => { setTeam(emptyTeam()); setNotice("Team cleared."); }} disabled={!selected.length}>Clear</button></div>
    </div>

    <div className="team-slots">
      {team.map((id, index) => {
        const pal = id ? byId.get(id) : undefined;
        const duplicate = Boolean(id && duplicates.has(id));
        return <article key={index} className={`team-slot${pal ? " filled" : ""}${duplicate ? " duplicate" : ""}`}>
          <span className="team-slot-number">0{index + 1}</span>
          <button type="button" ref={(node) => { triggerRefs.current[index] = node; }} onClick={() => openPicker(index)} aria-label={pal ? `Change slot ${index + 1}, currently ${pal.name}` : `Choose Pal for slot ${index + 1}`}>
            <PalMark pal={pal} />
            <span><small>{pal ? `No. ${pal.number}` : "Empty position"}</small><strong>{pal?.name ?? "Choose a Pal"}</strong><em>{pal ? pal.elements.join(" · ") : "Search all current entries"}</em></span>
          </button>
          {pal && <footer><Link href={`/pals/${pal.slug}`}>Profile</Link><Link href={`/?mode=target&target=${pal.id}`}>How to breed</Link><button type="button" onClick={() => remove(index)} aria-label={`Remove ${pal.name} from slot ${index + 1}`}>Remove</button></footer>}
          {duplicate && <p>Duplicate species</p>}
        </article>;
      })}
    </div>

    <p className="team-builder-notice" aria-live="polite">{notice || "Your team is saved locally as you edit it."}</p>

    <div className="team-analysis">
      <section className="team-analysis-panel element-panel"><header><span>01</span><div><p>Element coverage</p><h2>{elements.length ? `${elements.length} elements represented` : "Build your coverage"}</h2></div></header>{elements.length ? <div className="team-element-list">{elements.map(({ element: value, count }) => <div key={value}><ElementIcon element={value} /><span><strong>{value}</strong><small>{count} team {count === 1 ? "member" : "members"}</small></span></div>)}</div> : <EmptyAnalysis text="Choose a Pal to start mapping the team's elements." />}</section>
      <section className="team-analysis-panel work-panel"><header><span>02</span><div><p>Work coverage</p><h2>{work.length ? `${work.length} jobs covered` : "No jobs mapped yet"}</h2></div></header>{work.length ? <div className="team-work-list">{work.map(({ work: key, level, members }) => <div key={key}><WorkSuitabilityIcon work={key} /><span><strong>{workLabels[key]}</strong><small>{members} {members === 1 ? "member" : "members"}</small></span><b>Lv. {level}</b></div>)}</div> : <EmptyAnalysis text="Work suitability appears here when the first Pal joins." />}</section>
      <section className="team-analysis-panel skill-panel"><header><span>03</span><div><p>Partner skills</p><h2>{selected.length ? `${selected.filter((pal) => pal.partnerSkill.name).length} skills on deck` : "No skills selected"}</h2></div></header>{selected.length ? <div className="team-skill-list">{selectedEntries.map(({ pal, slot }) => <div key={`${pal.id}-${slot}`}><PartnerSkillIcon file={pal.partnerSkill.iconFile} label={pal.partnerSkill.name ?? `${pal.name} skill`} /><span><strong>{pal.partnerSkill.name ?? "Skill data unavailable"}</strong><small>{pal.name}</small></span></div>)}</div> : <EmptyAnalysis text="The selected Pals' current partner skill names will appear here." />}</section>
    </div>

    <section className="team-stat-strip" aria-label="Team average stats"><div><span>Average HP</span><strong>{average(selected.map((pal) => pal.stats.hp)) ?? "—"}</strong></div><div><span>Average defense</span><strong>{average(selected.map((pal) => pal.stats.defense)) ?? "—"}</strong></div><div><span>Average stamina</span><strong>{average(selected.map((pal) => pal.stats.stamina)) ?? "—"}</strong></div><div><span>Average run speed</span><strong>{average(selected.map((pal) => pal.movement.run)) ?? "—"}</strong></div></section>

    {pickerSlot !== null && <div className="team-picker-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closePicker(); }} onKeyDown={(event) => { if (event.key === "Escape") closePicker(); }}><section className="team-picker" role="dialog" aria-modal="true" aria-labelledby="team-picker-title">
      <header><div><p>Expedition slot 0{pickerSlot + 1}</p><h2 id="team-picker-title">Choose a Pal</h2></div><button type="button" aria-label="Close Pal selector" onClick={closePicker}>×</button></header>
      <label className="team-picker-search"><span>⌕</span><input ref={searchRef} value={query} onChange={(event) => { setQuery(event.target.value); setLimit(PICKER_BATCH_SIZE); }} onKeyDown={(event) => { if (event.key === "Enter" && filtered[0]) choose(filtered[0]); }} placeholder="Search name or Paldeck number…" aria-label="Search Pals" /></label>
      <div className="team-picker-elements" aria-label="Filter team candidates by element"><button type="button" className={!element ? "active" : ""} aria-pressed={!element} onClick={() => { setElement(null); setLimit(PICKER_BATCH_SIZE); }}>All</button>{allElements.map((value) => <button type="button" key={value} className={element === value ? "active" : ""} aria-pressed={element === value} aria-label={`Filter by ${value}`} title={value} onClick={() => { setElement(element === value ? null : value); setLimit(PICKER_BATCH_SIZE); }}><ElementIcon element={value} /></button>)}</div>
      <p className="team-picker-count">Showing {shown.length} of {filtered.length} entries</p>
      {shown.length ? <div className="team-picker-grid">{shown.map((pal) => <button type="button" key={pal.id} onClick={() => choose(pal)}><PalMark pal={pal} small /><span><strong>{pal.name}</strong><small>No. {pal.number} · {pal.elements.join(" / ")}</small></span></button>)}</div> : <EmptyAnalysis text="No Pal matches this search and element filter." />}
      {shown.length < filtered.length && <button type="button" className="team-picker-more" onClick={() => setLimit((current) => current + PICKER_BATCH_SIZE)}>Load more</button>}
    </section></div>}
  </section>;
}

function EmptyAnalysis({ text }: { text: string }) {
  return <div className="team-empty-analysis"><span>+</span><p>{text}</p></div>;
}
