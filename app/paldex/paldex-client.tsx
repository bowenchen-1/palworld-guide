"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ElementIcon, PartnerSkillIcon, WorkSuitabilityIcon } from "../components/pal-icons";
import PalMark from "../components/pal-mark";
import { catalogPals, PalData, WorkKey, workLabels } from "../lib/game-data";
import { filterPals, MatchMode, PaldexFilters, PaldexSort, parsePaldexFilters, selectPalsBySlugs, serializePaldexFilters, sortPals } from "../lib/paldex";
import { PALDEX_PAGE_SIZE } from "./paldex-config";
import { zh, type Locale } from "../i18n/zh";
import { getPalNameZh } from "../lib/pal-names-zh";
import { findPalDropsLocations } from "../lib/pal-drops-locations";
import { assetUrl } from "../lib/assets";

const workTypes = Object.keys(workLabels) as WorkKey[];
const workLabelsZh: Partial<Record<WorkKey, string>> = { emitflame: "生火", watering: "浇水", seeding: "播种", collection: "采集", mining: "采矿", deforest: "伐木", handcraft: "手工作业", cool: "冷却", generateelectricity: "发电", productmedicine: "制药", transport: "搬运", monsterfarm: "牧场" };
const elementOptions = ["Neutral", "Fire", "Water", "Grass", "Electric", "Ice", "Ground", "Dark", "Dragon"];
const elementLabelsZh: Record<string, string> = { Neutral: "无属性", Fire: "火属性", Water: "水属性", Grass: "草属性", Electric: "雷属性", Ice: "冰属性", Ground: "地属性", Dark: "暗属性", Dragon: "龙属性" };
const sortOptions: Array<{ value: PaldexSort; label: string }> = [
  { value: "number", label: "Paldeck number" },
  { value: "name", label: "Name A–Z" },
  { value: "hp", label: "HP" },
  { value: "defense", label: "Defense" },
  { value: "stamina", label: "Stamina" },
  { value: "price", label: "Price" },
  { value: "ride-speed", label: "Riding speed" },
  { value: "rarity", label: "Rarity" },
  { value: "speed", label: "Run speed" },
  { value: "work", label: "Highest work level" },
  { value: "power-low", label: "Breeding power: low first" },
  { value: "power-high", label: "Breeding power: high first" },
];
const tableColumns = ["Pal", "Element", "Work Suitability", "Partner Skill", "Rarity", "HP", "Breeding Power", "Defense", "Drops", "Locations", "Breeding"] as const;
const tableColumnWidths = [110, 68, 190, 160, 52, 55, 88, 62, 130, 155, 120] as const;
type Sheet = "elements" | "work" | null;
type InfoPanel = { title: string | null; body: string };

function PalName({ pal, locale }: { pal: PalData; locale: Locale }) {
  const chineseName = getPalNameZh(pal.name);
  return <strong className="paldex-pal-name"><span>{locale === "zh" && chineseName ? chineseName : pal.name}</span>{locale === "zh" && chineseName && <small>{pal.name}</small>}</strong>;
}

const PaldexLocaleContext = createContext<Locale>("en");

function PaldexTableHead({ frozen = false }: { frozen?: boolean }) {
  const locale = useContext(PaldexLocaleContext);
  const labels = locale === "zh" ? ["帕鲁", "属性", "工作适应性", "伙伴技能", "稀有度", "生命值", "配种力", "防御", "掉落物", "出没地点", "配种"] : tableColumns;
  return <thead aria-hidden={frozen || undefined}><tr>{labels.map((label) => <th key={label}>{label}</th>)}</tr></thead>;
}

function PaldexTableColumns() {
  return <colgroup>{tableColumnWidths.map((width, index) => <col key={index} style={{ width }} />)}</colgroup>;
}

function ElementMarks({ pal }: { pal: PalData }) {
  return <span className="element-marks">{pal.elements.map((element) => <ElementIcon key={element} element={element} />)}</span>;
}

function WorkBadges({ pal, onInfo, locale }: { pal: PalData; onInfo: (info: InfoPanel) => void; locale: Locale }) {
  const entries = Object.entries(pal.work) as [WorkKey, number][];
  return entries.length ? <p className="mini-work">{entries.map(([key, level]) => {
    const label = locale === "zh" ? workLabelsZh[key] ?? workLabels[key] : workLabels[key];
    const detail = locale === "zh" ? `${label}，工作等级 ${level}。` : `${label}, base work level ${level}.`;
    return <button type="button" className="paldex-info-trigger paldex-hover-tip" data-tooltip={`${label} · Level ${level}`} aria-label={`${label}, level ${level}`} title={`${label} · Level ${level}`} key={key} onClick={() => onInfo({ title: label, body: detail })}><WorkSuitabilityIcon work={key} /><b>{level}</b></button>;
  })}</p> : <span className="muted-dash">—</span>;
}

function DropSummary({ pal, locale, onInfo }: { pal: PalData; locale: Locale; onInfo: (info: InfoPanel) => void }) {
  const data = findPalDropsLocations(pal.slug);
  if (!data?.drops.length) return <span className="muted-dash">—</span>;
  const drops = data.drops.slice(0, 3);
  return <span className="paldex-drop-summary" aria-label={locale === "zh" ? "掉落物" : "Drops"}>
    {drops.map((drop) => {
      const detail = [drop.quantity && `${locale === "zh" ? "数量" : "Quantity"} ${drop.quantity}`, drop.chance, drop.condition].filter(Boolean).join(" · ");
      const label = `${drop.name}${detail ? ` · ${detail}` : ""}`;
      return <button type="button" className="paldex-drop-item paldex-info-trigger paldex-hover-tip" data-tooltip={label} aria-label={label} title={label} key={`${drop.name}-${drop.quantity ?? ""}`} onClick={() => onInfo({ title: drop.name, body: detail || (locale === "zh" ? "暂无更多掉落信息。" : "No additional drop details recorded.") })}>
        {drop.icon ? <Image src={assetUrl(`/icons/palworld/drops/${drop.icon}`)} alt={`${drop.name} icon`} width={26} height={26} unoptimized={Boolean(process.env.NEXT_PUBLIC_ASSET_BASE_URL)} /> : <span className="paldex-missing-icon" aria-hidden="true">◆</span>}
        <small>{drop.quantity ?? "—"}</small>
      </button>;
    })}
    {data.drops.length > drops.length && <span className="paldex-more-count">+{data.drops.length - drops.length} more</span>}
  </span>;
}

function LocationSummary({ pal, locale, onInfo }: { pal: PalData; locale: Locale; onInfo: (info: InfoPanel) => void }) {
  const data = findPalDropsLocations(pal.slug);
  if (!data?.locations.length) return <span className="muted-dash">—</span>;
  const locations = data.locations.slice(0, 2);
  return <span className="paldex-location-summary" aria-label={locale === "zh" ? "出没地点" : "Locations"}>
    {locations.map((location) => {
      const detail = [location.level && `${locale === "zh" ? "等级" : "Level"} ${location.level}`, location.note].filter(Boolean).join(" · ");
      const label = `${location.name}${detail ? ` · ${detail}` : ""}`;
      return <button type="button" className="paldex-location-item paldex-info-trigger paldex-hover-tip" data-tooltip={label} aria-label={label} title={label} key={`${location.name}-${location.level ?? ""}`} onClick={() => onInfo({ title: location.name, body: detail || (locale === "zh" ? "暂无更多地点信息。" : "No additional location details recorded.") })}>{location.name}</button>;
    })}
    {data.locations.length > locations.length && <button type="button" className="paldex-more-count" onClick={() => onInfo({ title: locale === "zh" ? "出没地点" : "Locations", body: data.locations.map((location) => [location.name, location.level && `${locale === "zh" ? "等级" : "Level"} ${location.level}`, location.note].filter(Boolean).join(" · ")).join("\n") })}>+{data.locations.length - locations.length} more</button>}
  </span>;
}

export default function PaldexClient({ initialPage: _initialPage = 1, locale = "en" }: { initialPage?: number; locale?: Locale }) {
  const isZh = locale === "zh";
  const t = isZh ? zh.pals : undefined;
  const prefix = isZh ? "/zh" : "";
  const pageSize = PALDEX_PAGE_SIZE;
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = useMemo(() => parsePaldexFilters(new URLSearchParams(searchParams.toString())), [searchParams]);
  const selectedPals = useMemo(() => selectPalsBySlugs(searchParams.get("ids"), catalogPals), [searchParams]);
  const selectedMode = selectedPals.length > 0;
  const [sheet, setSheet] = useState<Sheet>(null);
  const [draftElements, setDraftElements] = useState<string[]>([]);
  const [draftElementMode, setDraftElementMode] = useState<MatchMode>("any");
  const [draftWork, setDraftWork] = useState<WorkKey[]>([]);
  const [draftWorkMode, setDraftWorkMode] = useState<MatchMode>("any");
  const [draftWorkLevel, setDraftWorkLevel] = useState(0);
  const [sortOpen, setSortOpen] = useState(false);
  const [activeInfo, setActiveInfo] = useState<InfoPanel | null>(null);
  const tableRegionRef = useRef<HTMLDivElement>(null);
  const tableWrapRef = useRef<HTMLDivElement>(null);
  const frozenHeaderRef = useRef<HTMLDivElement>(null);
  const frozenTableRef = useRef<HTMLTableElement>(null);
  useEffect(() => {
    const tableRegion = tableRegionRef.current;
    const tableWrap = tableWrapRef.current;
    const frozenHeader = frozenHeaderRef.current;
    const frozenTable = frozenTableRef.current;
    if (!tableRegion || !tableWrap || !frozenHeader || !frozenTable) return;
    const headerOffset = window.matchMedia("(max-width: 760px)").matches ? 58 : 68;
    let frame = 0;
    const updateFrozenHeader = () => {
      frame = 0;
      const regionRect = tableRegion.getBoundingClientRect();
      const tableHeader = tableWrap.querySelector("thead");
      const headerHeight = tableHeader?.getBoundingClientRect().height ?? 56;
      const shouldFreeze = regionRect.top <= headerOffset && regionRect.bottom > headerOffset + headerHeight;
      frozenHeader.classList.toggle("is-visible", shouldFreeze);
      if (!shouldFreeze) return;
      frozenHeader.style.left = `${regionRect.left}px`;
      frozenHeader.style.width = `${regionRect.width}px`;
      frozenHeader.style.top = `${headerOffset}px`;
      frozenTable.style.width = `${tableWrap.scrollWidth}px`;
      frozenTable.style.transform = `translateX(-${tableWrap.scrollLeft}px)`;
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateFrozenHeader);
    };
    updateFrozenHeader();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    tableWrap.addEventListener("scroll", scheduleUpdate, { passive: true });
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      tableWrap.removeEventListener("scroll", scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [searchParams]);
  const visible = useMemo(() => selectedMode ? selectedPals : sortPals(filterPals(catalogPals, filters, isZh ? (pal) => getPalNameZh(pal.name) : undefined), filters.sort), [filters, isZh, selectedMode, selectedPals]);
  const totalPages = selectedMode ? 1 : Math.max(1, Math.ceil(visible.length / pageSize));
  const currentPage = Math.min(Math.max(_initialPage, 1), totalPages);
  const pageStart = selectedMode ? 0 : (currentPage - 1) * pageSize;
  const pagePals = visible.slice(pageStart, pageStart + pageSize);

  const update = (patch: Partial<PaldexFilters>) => {
    const query = serializePaldexFilters({ ...filters, ...patch }).toString();
    const target = query ? `${prefix}/pals?${query}` : `${prefix}/pals`;
    if (typeof window !== "undefined" && window.location.pathname === `${prefix}/pals`) {
      window.history.pushState(null, "", target);
    } else {
      router.push(target, { scroll: false });
    }
  };
  const pageHref = (page: number) => {
    const query = serializePaldexFilters(filters).toString();
    const path = page <= 1 ? `${prefix}/pals` : `${prefix}/pals/page/${page}`;
    return query ? `${path}?${query}` : path;
  };
  const toggle = <T extends string,>(items: T[], item: T) => items.includes(item) ? items.filter((value) => value !== item) : [...items, item];
  const apply = () => {
    if (sheet === "elements") update({ elements: draftElements, elementMode: draftElementMode });
    else update({ work: draftWork, workMode: draftWorkMode, workLevel: draftWorkLevel });
    setSheet(null);
  };
  const clearAll = () => update({ q: "", elements: [], elementMode: "any", work: [], workMode: "any", workLevel: 0, types: ["pal", "monster"], newOnly: false, sort: "number" });
  const clearSelection = () => router.push(`${prefix}/pals`, { scroll: false });
  const hasFilters = Boolean(selectedMode || filters.q || filters.elements.length || filters.work.length || filters.workLevel || filters.newOnly || filters.types.join(",") !== "pal,monster" || filters.sort !== "number");
  const toggleElement = (element: string) => update({ elements: toggle(filters.elements, element) });
  const toggleWork = (work: WorkKey) => update({ work: toggle(filters.work, work) });

  return <PaldexLocaleContext.Provider value={locale}><section className="database-workspace paldex-workspace paldex-wide" aria-label={isZh ? "帕鲁图鉴筛选与结果" : "Palworld Paldeck filters and results"}>
    {selectedMode && <div className="paldex-selection-banner" role="status"><strong>{selectedPals.length} {t?.selected ?? "Selected Pals"}</strong><button type="button" onClick={clearSelection}>{t?.clearSelection ?? "Clear Selection"}</button></div>}
    <div className="paldex-control-bar">
      <label className="paldex-search"><span>⌕</span><input value={filters.q} onChange={(event) => update({ q: event.target.value })} placeholder={t?.search ?? "Search English name or Paldeck number…"} aria-label={t?.ariaSearch ?? "Search Paldeck"} /></label>
      <button type="button" className={`paldex-filter-open paldex-new-filter ${filters.newOnly ? "active" : ""}`} aria-label={t?.new ?? "Toggle New in Palworld 1.0 filter"} aria-pressed={filters.newOnly} onClick={() => update({ newOnly: !filters.newOnly })}><span>Palworld 1.0</span><strong>{filters.newOnly ? (t?.newOnly ?? "New only") : (t?.new ?? "New in 1.0")}</strong></button>
    </div>
    <div className="paldex-icon-filters" aria-label={isZh ? "帕鲁快速筛选" : "Quick Pal filters"}>
      <section className="paldex-icon-filter-group" aria-labelledby="paldex-elements-label"><div className="paldex-icon-filter-heading"><h2 id="paldex-elements-label">{t?.element ?? "Filter by element"}</h2>{filters.elements.length > 1 && <div className="paldex-inline-mode"><button type="button" className={filters.elementMode === "any" ? "active" : ""} onClick={() => update({ elementMode: "any" })}>{t?.any ?? "Any"}</button><button type="button" className={filters.elementMode === "all" ? "active" : ""} onClick={() => update({ elementMode: "all" })}>{t?.allMatch ?? "All"}</button></div>}</div><div className="paldex-icon-filter-list">{elementOptions.map((item) => <div className="paldex-icon-filter-item" key={item}><button type="button" className={filters.elements.includes(item) ? "active" : ""} aria-pressed={filters.elements.includes(item)} aria-label={`${t?.element ?? "Filter by"} ${isZh ? elementLabelsZh[item] ?? item : item}`} title={isZh ? elementLabelsZh[item] ?? item : item} onClick={() => toggleElement(item)}><ElementIcon element={item} /></button><span>{isZh ? elementLabelsZh[item] ?? item : item}</span></div>)}</div></section>
      <section className="paldex-icon-filter-group" aria-labelledby="paldex-work-label"><div className="paldex-icon-filter-heading"><h2 id="paldex-work-label">{t?.work ?? "Filter by work"}</h2>{filters.work.length > 1 && <div className="paldex-inline-mode"><button type="button" className={filters.workMode === "any" ? "active" : ""} onClick={() => update({ workMode: "any" })}>{t?.any ?? "Any"}</button><button type="button" className={filters.workMode === "all" ? "active" : ""} onClick={() => update({ workMode: "all" })}>{t?.allMatch ?? "All"}</button></div>}</div><div className="paldex-icon-filter-list work-list">{workTypes.map((item) => <div className="paldex-icon-filter-item" key={item}><button type="button" className={filters.work.includes(item) ? "active" : ""} aria-pressed={filters.work.includes(item)} aria-label={`${t?.work ?? "Filter by"} ${isZh ? workLabelsZh[item] ?? workLabels[item] : workLabels[item]}`} title={isZh ? workLabelsZh[item] ?? workLabels[item] : workLabels[item]} onClick={() => toggleWork(item)}><WorkSuitabilityIcon work={item} /></button><span>{isZh ? workLabelsZh[item] ?? workLabels[item] : workLabels[item]}</span></div>)}</div></section>
    </div>
    <p className="paldex-filter-status" aria-live="polite">{filters.elements.length || filters.work.length ? `${visible.length} ${t?.match ?? "Pals match the selected filters"}` : isZh ? `找到 ${visible.length} 个帕鲁` : `${visible.length} ${t?.available ?? "Pals available"}`}</p>
    <div className="paldex-toolbar" aria-live="polite">
      <p>{isZh ? `找到 ${visible.length} 个帕鲁` : <><strong>{visible.length}</strong> {filters.newOnly ? (t?.newOnly ?? "New Pals") : visible.length === 1 ? (t?.pal ?? "Pal") : (t?.pals ?? "Pals")} {t?.found ?? "found"}</>}</p>
      <div><div className="paldex-sort-menu"><span>{t?.sort ?? "Sort"}</span><button type="button" className="paldex-sort-trigger" aria-label={isZh ? "排序帕鲁" : "Sort Paldeck"} aria-haspopup="listbox" aria-expanded={sortOpen} onClick={() => setSortOpen((open) => !open)}><strong>{isZh ? ({number: "编号", name: "名称 A–Z", hp: "生命值", defense: "防御", stamina: "耐力", price: "价格", "ride-speed": "骑乘速度", rarity: "稀有度", speed: "奔跑速度", work: "最高工作等级", "power-low": "配种力：低到高", "power-high": "配种力：高到低"} as Record<PaldexSort, string>)[filters.sort] : sortOptions.find((option) => option.value === filters.sort)?.label}</strong><span aria-hidden="true">⌄</span></button>{sortOpen && <div className="paldex-sort-options" role="listbox" aria-label={isZh ? "帕鲁排序选项" : "Sort Paldeck options"}>{sortOptions.map((option) => <button type="button" role="option" aria-selected={filters.sort === option.value} className={filters.sort === option.value ? "active" : ""} key={option.value} onClick={() => { update({ sort: option.value }); setSortOpen(false); }}>{filters.sort === option.value && <span aria-hidden="true">✓</span>}{isZh ? ({number: "编号", name: "名称 A–Z", hp: "生命值", defense: "防御", stamina: "耐力", price: "价格", "ride-speed": "骑乘速度", rarity: "稀有度", speed: "奔跑速度", work: "最高工作等级", "power-low": "配种力：低到高", "power-high": "配种力：高到低"} as Record<PaldexSort, string>)[option.value] : option.label}</button>)}</div>}</div>{hasFilters && <button type="button" className="paldex-reset" onClick={clearAll}>{t?.clear ?? "Clear all"}</button>}</div>
    </div>
    {!selectedMode && hasFilters && <div className="paldex-chips">{filters.newOnly && <button onClick={() => update({ newOnly: false })}>{isZh ? "1.0 新增 ×" : "New in 1.0 ×"}</button>}{filters.elements.map((value) => <button key={value} onClick={() => update({ elements: toggle(filters.elements, value) })}>{value} ×</button>)}{filters.work.map((value) => <button key={value} onClick={() => update({ work: toggle(filters.work, value) })}>{workLabels[value]} ×</button>)}{filters.workLevel > 0 && <span>{isZh ? "工作等级" : "Work level"} {filters.workLevel}+</span>}</div>}
    {visible.length ? <><div className="paldex-result-range" aria-live="polite">{selectedMode ? `${visible.length} ${t?.selected ?? "Selected Pals"}` : `${t?.showing ?? "Showing"} ${pageStart + 1}–${Math.min(pageStart + pageSize, visible.length)}${t?.of ?? " of "}${visible.length} ${filters.newOnly ? (t?.newOnly ?? "New Pals") : (t?.pals ?? "Pals")}`}</div><div ref={tableRegionRef} className="paldex-table-region"><div ref={tableWrapRef} className="paldex-table-wrap"><table className="paldex-table paldex-complete-table"><PaldexTableColumns /><PaldexTableHead /><tbody>{pagePals.map((pal) => <tr key={pal.id}><td><Link className="paldex-pal-cell" href={`${prefix}/pals/${pal.slug}`}><span className="paldex-pal-name-wrap"><PalName pal={pal} locale={locale} /></span><PalMark pal={pal} showNewBadge /><small className="paldex-pal-number">No. {pal.number}</small><small className="paldex-pal-kind">{pal.kind === "pal" ? "Pal" : "Crossover creature"}</small></Link></td><td><ElementMarks pal={pal} /></td><td><WorkBadges pal={pal} locale={locale} onInfo={setActiveInfo} /></td><td>{pal.partnerSkill.name ? <button type="button" className="partner-skill-mark paldex-info-trigger paldex-hover-tip" data-tooltip={pal.partnerSkill.name} aria-label={`${pal.partnerSkill.name} Partner Skill`} title={pal.partnerSkill.name} onClick={() => setActiveInfo({ title: pal.partnerSkill.name, body: pal.partnerSkill.description ?? (locale === "zh" ? "暂无技能说明。" : "No skill description recorded.") })}><PartnerSkillIcon file={pal.partnerSkill.iconFile} label={pal.partnerSkill.name} /><span>{pal.partnerSkill.name}</span></button> : "—"}</td><td>{pal.rarity ?? "—"}</td><td>{pal.stats.hp ?? "—"}</td><td>{pal.power}</td><td>{pal.stats.defense ?? "—"}</td><td><DropSummary pal={pal} locale={locale} onInfo={setActiveInfo} /></td><td><LocationSummary pal={pal} locale={locale} onInfo={setActiveInfo} /></td><td><Link className="paldex-breeding-link" href={`${prefix}/?mode=target&target=${encodeURIComponent(pal.id)}`}>{t?.findParents ?? "Find Parents"}</Link></td></tr>)}</tbody></table></div><div ref={frozenHeaderRef} className="paldex-frozen-header" aria-hidden="true"><table ref={frozenTableRef} className="paldex-table paldex-complete-table paldex-frozen-table"><PaldexTableColumns /><PaldexTableHead frozen /></table></div></div>{!selectedMode && <nav className="paldex-pagination" aria-label={isZh ? "帕鲁分页" : "Pal pagination"}>{currentPage <= 1 ? <span aria-disabled="true">{t?.previous ?? "Previous"}</span> : <Link href={pageHref(currentPage - 1)}>{t?.previous ?? "Previous"}</Link>}<div className="paldex-pagination-pages">{Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => <Link href={pageHref(page)} key={page} aria-current={page === currentPage ? "page" : undefined}>{page}</Link>)}</div>{currentPage >= totalPages ? <span aria-disabled="true">{t?.next ?? "Next"}</span> : <Link href={pageHref(currentPage + 1)}>{t?.next ?? "Next"}</Link>}</nav>}</> : <div className="paldex-empty"><span>⌕</span><h2>{t?.noResults ?? "No Pals found"}</h2><p>{t?.tryAgain ?? "Try another search or clear one of the filters."}</p><button type="button" onClick={clearAll}>{t?.clear ?? "Clear all"}</button></div>}
    {sheet && <div className="paldex-filter-backdrop" role="presentation" onClick={() => setSheet(null)}><section className="paldex-filter-sheet" role="dialog" aria-modal="true" aria-label={sheet === "elements" ? (t?.element ?? "Element filters") : (t?.work ?? "Work suitability filters")} onClick={(event) => event.stopPropagation()}>
      <header><h2>{sheet === "elements" ? (t?.element ?? "Element") : (t?.work ?? "Work Suitability")}</h2><button type="button" onClick={() => setSheet(null)}>{t?.cancel ?? "Cancel"}</button></header>
      {sheet === "elements" ? <><div className="paldex-filter-options">{elementOptions.map((item) => <button type="button" key={item} className={draftElements.includes(item) ? "active" : ""} onClick={() => setDraftElements(toggle(draftElements, item))}><ElementIcon element={item} /><span>{isZh ? elementLabelsZh[item] ?? item : item}</span></button>)}</div>{draftElements.length > 1 && <div className="paldex-match-mode"><button type="button" className={draftElementMode === "any" ? "active" : ""} onClick={() => setDraftElementMode("any")}>{t?.any ?? "Match any"}</button><button type="button" className={draftElementMode === "all" ? "active" : ""} onClick={() => setDraftElementMode("all")}>{t?.allMatch ?? "Match all"}</button></div>}</> : <><div className="paldex-filter-options work-options">{workTypes.map((item) => <button type="button" key={item} className={draftWork.includes(item) ? "active" : ""} onClick={() => setDraftWork(toggle(draftWork, item))}><WorkSuitabilityIcon work={item} /><span>{isZh ? workLabelsZh[item] ?? workLabels[item] : workLabels[item]}</span></button>)}</div><label className="paldex-min-level">{t?.minimum ?? "Minimum level"}<select value={draftWorkLevel} onChange={(event) => setDraftWorkLevel(Number(event.target.value))}><option value="0">{t?.any ?? "Any"}</option>{[2, 3, 4, 5, 6, 7, 8].map((level) => <option key={level} value={level}>{level}+</option>)}</select></label>{draftWork.length > 1 && <div className="paldex-match-mode"><button type="button" className={draftWorkMode === "any" ? "active" : ""} onClick={() => setDraftWorkMode("any")}>{t?.any ?? "Match any"}</button><button type="button" className={draftWorkMode === "all" ? "active" : ""} onClick={() => setDraftWorkMode("all")}>{t?.allMatch ?? "Match all"}</button></div>}</>}
      <footer><button type="button" className="paldex-sheet-clear" onClick={() => { if (sheet === "elements") { setDraftElements([]); setDraftElementMode("any"); } else { setDraftWork([]); setDraftWorkMode("any"); setDraftWorkLevel(0); } }}>{t?.clear ?? "Clear"}</button><button type="button" className="paldex-sheet-apply" onClick={apply}>{t?.apply ?? "Apply"}</button></footer>
    </section></div>}
    {activeInfo && <div className="paldex-info-backdrop" role="presentation" onClick={() => setActiveInfo(null)}><section className="paldex-info-dialog" role="dialog" aria-modal="true" aria-label={activeInfo.title ?? (isZh ? "详细信息" : "Details")} onClick={(event) => event.stopPropagation()}><button type="button" className="paldex-info-close" aria-label={isZh ? "关闭详情" : "Close details"} onClick={() => setActiveInfo(null)}>×</button><h2>{activeInfo.title ?? (isZh ? "详细信息" : "Details")}</h2><p>{activeInfo.body}</p></section></div>}
  </section></PaldexLocaleContext.Provider>;
}
