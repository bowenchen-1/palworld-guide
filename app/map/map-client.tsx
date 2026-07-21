"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { MapCategory, MapLocation } from "../../data/map";
import { getContainedImageRect, MAP_CALIBRATIONS, mapCoordinateToScreenPoint, type MapView } from "./map-calibration";

const MAP_SIZE = 4096;
const CATEGORY_GROUPS = [
  { name: "Collectibles", categories: ["Lifmunk Effigies", "Rooby Effigies", "Yakumo Effigies", "Munchill Effigies", "Relaxaurus Effigies", "Herbil Effigies", "Tanzee Effigies", "Lunaris Effigies", "Depresso Effigies", "Pengullet Effigies", "Lamball Effigies", "Journals"] },
  { name: "Eggs", categories: ["Sakura Eggs", "Desert Eggs", "Frozen Eggs", "Grass Eggs", "Feybreak Eggs", "Volcano Eggs"] },
  { name: "Enemies", categories: ["Towers", "Alpha Pals", "Enemy Camps", "Anti-Air Turrets", "Incidents", "Arrogant Pal Critic", "Black Marketeers", "Supply Drops"] },
  { name: "Fishing", categories: ["Fishing Spots", "Salvage Rank 1", "Salvage Rank 2"] },
  { name: "Locations", categories: ["Fast Travel", "Settlements", "Recommended Base Spots", "Cave Entrances", "Respawn Points", "Region Labels", "Dungeons", "Treasure Map Dig Spots", "Skyland Warp Altars"] },
  { name: "Minerals", categories: ["Coal Clusters", "Ore Clusters", "Pure Quartz Clusters", "Sulfur Clusters", "Coal", "Ore", "Pure Quartz", "Sulfur", "Chromite", "Hexolite Quartz", "Crude Oil"] },
  { name: "NPCs", categories: ["NPCs", "Wandering Merchants"] },
  { name: "Oil Rigs", categories: ["Oilrig Big Chests", "Oilrig Chests"] },
  { name: "Resources", categories: ["Beautiful Flowers", "Kinship Peaches", "Ancient Lava", "Ancient Bark", "Soralite", "Junk", "Nightstar Sand", "Skill Fruit Trees", "Ancient Bone", "Heat Sources", "Elemental Chests", "Treasure Chests"] },
  { name: "Other", categories: ["Unknown"] },
] as const;

type MapPayload = { locations: MapLocation[]; categories: MapCategory[] };
type Point = { x: number; y: number };

function readableCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export default function MapClient({ initialCategories, locationCount }: { initialCategories: MapCategory[]; locationCount: number }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState<MapPayload>({ locations: [], categories: initialCategories });
  const [activeCategories, setActiveCategories] = useState(() => new Set<string>());
  const [openGroups, setOpenGroups] = useState(() => new Set(["Collectibles", "Eggs", "Enemies"]));
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<MapLocation | null>(null);
  const [mapView, setMapView] = useState<MapView>("palpagos");
  const [zoom, setZoom] = useState(0.12);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const zoomRef = useRef(zoom);
  const panRef = useRef(pan);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [iconVersion, setIconVersion] = useState(0);
  const [drag, setDrag] = useState<{ pointerId: number; start: Point; origin: Point; moved: boolean } | null>(null);
  const pointers = useRef(new Map<number, Point>());
  const iconCache = useRef(new Map<string, HTMLImageElement>());
  const pinch = useRef<{ distance: number; zoom: number; midpoint: Point } | null>(null);

  const centerMap = useCallback((nextZoom = 0.12) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const nextPan = { x: (rect.width - MAP_SIZE * nextZoom) / 2, y: (rect.height - MAP_SIZE * nextZoom) / 2 };
    panRef.current = nextPan;
    zoomRef.current = nextZoom;
    setPan(nextPan);
    setZoom(nextZoom);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/data/map-locations.json")
      .then((response) => { if (!response.ok) throw new Error("Map data unavailable"); return response.json() as Promise<MapPayload>; })
      .then((payload) => { if (!cancelled) { setData(payload); setLoading(false); } })
      .catch(() => { if (!cancelled) { setLoading(false); setError("Map data could not be loaded. Please refresh the page."); } });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    try {
      const saved = localStorage.getItem("palworld-map-state-v3");
      if (!saved) {
        requestAnimationFrame(() => centerMap());
        return;
      }
      const state = JSON.parse(saved) as { query?: string; categories?: string[]; zoom?: number; pan?: Point };
      queueMicrotask(() => {
        if (cancelled) return;
        if (state.query) setQuery(state.query);
        if (state.categories?.length) setActiveCategories(new Set(state.categories));
        if (Number.isFinite(state.zoom)) { const restoredZoom = Math.max(0.06, Math.min(0.7, state.zoom ?? 0.12)); zoomRef.current = restoredZoom; setZoom(restoredZoom); }
        if (state.pan && Number.isFinite(state.pan.x) && Number.isFinite(state.pan.y)) { panRef.current = state.pan; setPan(state.pan); }
      });
    } catch { /* Local storage is optional. */ }
    return () => { cancelled = true; };
  }, [centerMap]);

  useEffect(() => {
    try { localStorage.setItem("palworld-map-state-v3", JSON.stringify({ query, categories: [...activeCategories], zoom, pan })); } catch { /* Local storage is optional. */ }
  }, [activeCategories, pan, query, zoom]);

  const filteredLocations = useMemo(() => {
    const term = query.trim().toLowerCase();
    return data.locations.filter((location) => activeCategories.has(location.category) && (!term || `${location.name} ${location.description ?? ""} ${location.category}`.toLowerCase().includes(term)));
  }, [activeCategories, data.locations, query]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const location of data.locations) counts.set(location.category, (counts.get(location.category) ?? 0) + 1);
    return counts;
  }, [data.locations]);

  const calibration = MAP_CALIBRATIONS[mapView];
  const imageRect = useMemo(() => getContainedImageRect(calibration, MAP_SIZE, MAP_SIZE), [calibration]);
  const visibleLocations = useMemo(() => calibration.showPreparedLocations ? filteredLocations : [], [calibration.showPreparedLocations, filteredLocations]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width !== MAP_SIZE * dpr || canvas.height !== MAP_SIZE * dpr) { canvas.width = MAP_SIZE * dpr; canvas.height = MAP_SIZE * dpr; }
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, MAP_SIZE, MAP_SIZE);
    const radius = Math.max(11, 17 / Math.max(zoom, 0.08));
    for (const location of visibleLocations) {
      const { x, y } = mapCoordinateToScreenPoint(location, imageRect, calibration);
      const iconSource = location.icon || "/map-icons/Region.webp";
      let icon = iconCache.current.get(iconSource);
      if (!icon) {
        icon = new window.Image();
        icon.onload = () => setIconVersion((version) => version + 1);
        icon.src = iconSource;
        iconCache.current.set(iconSource, icon);
      }
      if (icon.complete && icon.naturalWidth > 0) {
        const iconSize = Math.max(22, 30 / Math.max(zoom, 0.08));
        context.drawImage(icon, x - iconSize / 2, y - iconSize / 2, iconSize, iconSize);
      } else {
        context.beginPath();
        context.fillStyle = location.category.includes("Alpha") ? "#f2c94c" : "#39d0c5";
        context.fillStyle = "rgba(57, 208, 197, .8)";
        context.arc(x, y, Math.max(5, radius * 0.45), 0, Math.PI * 2);
        context.fill();
      }
    }
  }, [calibration, imageRect, visibleLocations, zoom]);

  useEffect(() => { draw(); }, [draw, iconVersion]);

  const updateZoom = (nextZoom: number, anchor?: Point) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const point = anchor ?? { x: rect.width / 2, y: rect.height / 2 };
    const clamped = Math.max(0.06, Math.min(0.7, nextZoom));
    const currentZoom = zoomRef.current;
    const currentPan = panRef.current;
    const worldX = (point.x - currentPan.x) / currentZoom;
    const worldY = (point.y - currentPan.y) / currentZoom;
    const nextPan = { x: point.x - worldX * clamped, y: point.y - worldY * clamped };
    panRef.current = nextPan;
    zoomRef.current = clamped;
    setPan(nextPan);
    setZoom(clamped);
  };

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const rect = stage.getBoundingClientRect();
      updateZoom(zoomRef.current * (event.deltaY > 0 ? 0.9 : 1.1), { x: event.clientX - rect.left, y: event.clientY - rect.top });
    };
    stage.addEventListener("wheel", handleWheel, { passive: false });
    return () => stage.removeEventListener("wheel", handleWheel);
  }, [zoom]);

  const toggleCategory = (name: string) => setActiveCategories((current) => { const next = new Set(current); if (next.has(name)) next.delete(name); else next.add(name); return next; });
  const setAllCategories = (visible: boolean) => setActiveCategories(visible ? new Set(data.categories.map((category) => category.name)) : new Set());
  const categoryMap = useMemo(() => new Map(data.categories.map((category) => [category.name, category])), [data.categories]);
  const toggleGroup = (name: string) => setOpenGroups((current) => { const next = new Set(current); if (next.has(name)) next.delete(name); else next.add(name); return next; });
  const setGroupCategories = (names: readonly string[], visible: boolean) => setActiveCategories((current) => { const next = new Set(current); names.forEach((name) => visible ? next.add(name) : next.delete(name)); return next; });

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    // Controls live inside the map stage, but they must remain ordinary
    // interactive elements instead of starting a map drag.
    const target = event.target as HTMLElement;
    if (target.closest("button, input, label, form, article, a")) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const rect = stageRef.current?.getBoundingClientRect();
      const midpoint = rect ? { x: (a.x + b.x) / 2 - rect.left, y: (a.y + b.y) / 2 - rect.top } : { x: 0, y: 0 };
      pinch.current = { distance: Math.hypot(a.x - b.x, a.y - b.y), zoom, midpoint };
      setDrag(null);
    } else setDrag({ pointerId: event.pointerId, start: { x: event.clientX, y: event.clientY }, origin: panRef.current, moved: false });
  };
  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      updateZoom(pinch.current.zoom * (Math.hypot(a.x - b.x, a.y - b.y) / pinch.current.distance), pinch.current.midpoint);
      return;
    }
    if (!drag || drag.pointerId !== event.pointerId) return;
    const delta = { x: event.clientX - drag.start.x, y: event.clientY - drag.start.y };
    if (Math.hypot(delta.x, delta.y) > 4) setDrag({ ...drag, moved: true });
    const nextPan = { x: drag.origin.x + delta.x, y: drag.origin.y + delta.y };
    panRef.current = nextPan;
    setPan(nextPan);
  };
  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => { pointers.current.delete(event.pointerId); if (pointers.current.size < 2) pinch.current = null; if (drag?.pointerId === event.pointerId && !drag.moved) selectAt(event.clientX, event.clientY); setDrag(null); };
  const selectAt = (clientX: number, clientY: number) => {
    const stage = stageRef.current; if (!stage) return;
    const rect = stage.getBoundingClientRect(); const world = { x: (clientX - rect.left - panRef.current.x) / zoomRef.current, y: (clientY - rect.top - panRef.current.y) / zoomRef.current };
    let closest: MapLocation | null = null; let distance = 30 / zoom;
    for (const location of visibleLocations) { const point = mapCoordinateToScreenPoint(location, imageRect, calibration); const dx = point.x - world.x; const dy = point.y - world.y; const next = Math.hypot(dx, dy); if (next < distance) { distance = next; closest = location; } }
    setSelected(closest);
  };

  const changeMapView = (nextView: MapView) => {
    setSelected(null);
    setMapView(nextView);
  };

  return <div className={`map-tool-shell map-view-${mapView}`}>
    <div className="map-toolbar">
      <label className="map-search"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search locations..." aria-label="Search map locations" />{query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search">×</button>}</label>
      <div className="map-toolbar-actions"><button type="button" className="map-control-button" onClick={() => setAllCategories(true)}>Show all</button><button type="button" className="map-control-button" onClick={() => setAllCategories(false)}>Clear filters</button><span className="map-result-count">{readableCount(filteredLocations.length)} shown <small>of {readableCount(locationCount)}</small></span></div>
    </div>
    <div className="map-workspace">
      <aside className="map-filters" aria-label="Map categories">
        <div className="map-filter-heading"><div><span className="map-filter-eyebrow">FILTER LOCATIONS</span><h2>Categories</h2></div><span className="map-filter-total">{data.categories.length}</span></div>
        <p className="map-filter-help">Choose the locations shown on the map.</p>
        <div className="map-category-groups">
          {CATEGORY_GROUPS.map((group) => {
            const categories = group.categories.map((name) => categoryMap.get(name)).filter((category): category is MapCategory => Boolean(category));
            if (!categories.length) return null;
            const activeCount = categories.filter((category) => activeCategories.has(category.name)).length;
            const isOpen = openGroups.has(group.name);
            return <section className="map-category-group" key={group.name}><div className="map-group-heading"><button type="button" className="map-group-toggle" onClick={() => toggleGroup(group.name)} aria-expanded={isOpen}><span className={`map-group-chevron${isOpen ? " is-open" : ""}`}>⌄</span><strong>{group.name}</strong><span className="map-group-count">{activeCount}/{categories.length}</span></button><div className="map-group-actions"><button type="button" onClick={() => setGroupCategories(group.categories, true)}>All</button><button type="button" onClick={() => setGroupCategories(group.categories, false)}>Clear</button></div></div>{isOpen && <div className="map-category-list">{categories.map((category) => { const active = activeCategories.has(category.name); return <button key={category.name} type="button" className={`map-category${active ? " is-active" : ""}`} aria-pressed={active} onClick={() => toggleCategory(category.name)}><span className="map-category-checkbox" aria-hidden="true">{active ? "✓" : ""}</span><span className="map-category-icon"><Image src={category.icon} alt="" width={24} height={24} unoptimized /></span><span className="map-category-name">{category.name}</span><small className="map-category-count">{readableCount(categoryCounts.get(category.name) ?? 0)}</small></button>; })}</div>}</section>;
          })}
        </div>
      </aside>
      <div ref={stageRef} className="map-stage" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp} role="application" aria-label="Interactive Palworld map">
        <div className="map-board" style={{ transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})` }}>
          <Image key={mapView} className="map-surface-image" src={mapView === "palpagos" ? "/map/Palpagos_Islands.png" : "/map/World_Tree.png"} alt={mapView === "palpagos" ? "Palpagos Islands map" : "World Tree map"} width={calibration.sourceWidth} height={calibration.sourceHeight} priority unoptimized />
          <canvas ref={canvasRef} className="map-marker-canvas" aria-hidden="true" />
        </div>
        <div className="map-view-switcher" role="tablist" aria-label="Map area">
          <button type="button" className={mapView === "palpagos" ? "is-active" : ""} onClick={() => changeMapView("palpagos")} role="tab" aria-selected={mapView === "palpagos"}>Palpagos Islands</button>
          <button type="button" className={mapView === "world-tree" ? "is-active" : ""} onClick={() => changeMapView("world-tree")} role="tab" aria-selected={mapView === "world-tree"}>World Tree</button>
        </div>
        <div className="map-zoom-controls">
          <button type="button" onClick={() => updateZoom(zoomRef.current * 1.2)} aria-label="Zoom in">+</button>
          <button type="button" onClick={() => updateZoom(zoomRef.current / 1.2)} aria-label="Zoom out">−</button>
          <button type="button" onClick={() => centerMap()} aria-label="Reset map view">⌂</button>
        </div>
        {loading && <div className="map-status">Loading map data...</div>}
        {error && <div className="map-status map-status-error">{error}</div>}
        {!loading && !error && query.trim() && filteredLocations.length === 0 && <div className="map-empty-state"><strong>No locations found</strong><span>Try clearing the search or enabling another category.</span></div>}
        {selected && <article className="map-location-card" onPointerDown={(event) => event.stopPropagation()}><button type="button" className="map-card-close" onClick={() => setSelected(null)} aria-label="Close location details">×</button><div className="map-card-icon"><Image src={selected.icon || "/map-icons/Region.webp"} alt="" width={34} height={34} unoptimized /></div><span className="map-card-category">{selected.category}</span><h3>{selected.name}</h3>{selected.level && <p className="map-card-level">Level {selected.level}</p>}{selected.description && <p className="map-card-description">{selected.description}</p>}<p className="map-card-coordinates">Map position <b>{selected.x.toFixed(0)}, {selected.y.toFixed(0)}</b></p><button type="button" className="map-share-button" onClick={() => navigator.clipboard?.writeText(`${window.location.origin}/map#${selected.id}`)}>Copy share link</button></article>}
      </div>
    </div>
  </div>;
}
