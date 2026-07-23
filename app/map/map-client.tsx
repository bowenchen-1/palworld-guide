"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { MapCategory, MapLocation } from "../../data/map";
import worldTreePayload from "../../public/data/world-tree-locations.json";
import { assetUrl } from "../lib/assets";
import { getContainedImageRect, MAP_CALIBRATIONS, mapCoordinateToScreenPoint, type MapView } from "./map-calibration";

const MAP_SIZE = 8192;
const TILE_SIZE = 512;
const MAP_MIN_ZOOM = 0.08;
const MAP_MAX_ZOOM = 2;
const PALPAGOS_TILES = Array.from({ length: 16 * 16 }, (_, index) => ({
  x: index % 16,
  y: Math.floor(index / 16),
  src: assetUrl(`/map/palpagos-z4/z4x${index % 16}y${Math.floor(index / 16)}.webp`),
}));
const WORLD_TREE_TILE_SIZE = 256;
const WORLD_TREE_TILES = Array.from({ length: 8 * 8 }, (_, index) => ({
  x: index % 8,
  y: Math.floor(index / 8),
  src: assetUrl(`/map/world-tree-z3/${index % 8}/${Math.floor(index / 8)}.png`),
}));
const CATEGORY_GROUPS = [
  { name: "Effigies", categories: ["Lifmunk Effigies", "Rooby Effigies", "Yakumo Effigies", "Munchill Effigies", "Relaxaurus Effigies", "Herbil Effigies", "Tanzee Effigies", "Lunaris Effigies", "Depresso Effigies", "Pengullet Effigies", "Lamball Effigies", "Journals"] },
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
const QUICK_FILTERS = [
  { id: "nightstar-sand", label: "Nightstar Sand", categories: ["Nightstar Sand"], icon: "/map-icons/Nightstar_Sand.webp", description: "Maps to Nightstar Sand" },
  { id: "dungeons", label: "Dungeons", categories: ["Dungeons"], icon: "/map-icons/Dungeon.webp", description: "Maps to Dungeons" },
  { id: "chromite", label: "Chromite", categories: ["Chromite"], icon: "/map-icons/Chromite.webp", description: "Maps to Chromite" },
  { id: "sulfur", label: "Sulfur", categories: ["Sulfur", "Sulfur Clusters"], icon: "/map-icons/Sulfur.webp", description: "Maps to Sulfur and Sulfur Clusters" },
  { id: "ancient-civilization", label: "Ancient Civilization", categories: ["Ancient Bark", "Ancient Bone", "Ancient Lava"], icon: "/map-icons/Ancient_Bark.webp", description: "Maps to Ancient Bark, Ancient Bone, and Ancient Lava" },
  { id: "fishing-spots", label: "Fisherman's Point", categories: ["Fishing Spots"], icon: "/map-icons/Fishing_Spot.webp", description: "Maps to Fishing Spots" },
] as const;
type WorldTreePayload = { locations: MapLocation[]; types: string[] };
const WORLD_TREE_DATA = worldTreePayload as unknown as WorldTreePayload;
const WORLD_TREE_CATEGORY_ICONS: Record<string, string> = {
  "Alpha Pal": "/map-icons/world-tree/T_GrassGolem_icon_normal.webp",
  NPC: "/map-icons/NPC.webp",
  "Lifmunk Effigy": "/map-icons/Lifmunk_Effigy.webp",
  "Yakumo Effigy": "/map-icons/Yakumo_Effigy.webp",
  "Cattiva Effigy": "/map-icons/Cattiva_Effigy.webp",
  "Memo Planner": "/map-icons/Memo_Planner.webp",
  Junk: "/map-icons/Junk.webp",
  "Fruit Tree": "/map-icons/world-tree/T_itemicon_Consume_SkillCard_Dark.webp",
  Paloxite: "/map-icons/Paloxite.webp",
  Journals: "/map-icons/Journals.webp",
  Incident: "/map-icons/Incident.webp",
  "Fishing Spot": "/map-icons/Fishing_Spot.webp",
  Tower: "/map-icons/Tower.webp",
  "Fast Travel": "/map-icons/Fast_Travel.webp",
};
const WORLD_TREE_LOCATIONS = WORLD_TREE_DATA.locations.map((location) => ({
  ...location,
  icon: location.icon || WORLD_TREE_CATEGORY_ICONS[location.category] || "/map-icons/Region.webp",
}));
const WORLD_TREE_CATEGORIES: MapCategory[] = WORLD_TREE_DATA.types.map((name) => ({
  name,
  icon: WORLD_TREE_CATEGORY_ICONS[name] || WORLD_TREE_LOCATIONS.find((location) => location.category === name)?.icon || "/map-icons/Region.webp",
}));
const MAP_STATE_KEY = "palworld-map-state-v4";

type MapPayload = { locations: MapLocation[]; categories: MapCategory[] };
type Point = { x: number; y: number };
type LevelRange = "all" | "1-20" | "21-40" | "41-60" | "61-80";

function readableCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export default function MapClient({ initialCategories, locationCount }: { initialCategories: MapCategory[]; locationCount: number }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState<MapPayload>({ locations: [], categories: initialCategories });
  const [activeCategories, setActiveCategories] = useState(() => new Set<string>());
  const [openGroups, setOpenGroups] = useState(() => new Set(["Effigies", "Eggs", "Enemies"]));
  const [query, setQuery] = useState("");
  const [levelRange, setLevelRange] = useState<LevelRange>("all");
  const [selected, setSelected] = useState<MapLocation | null>(null);
  const [mapView, setMapView] = useState<MapView>("palpagos");
  const [zoom, setZoom] = useState(0.12);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [tileStatus, setTileStatus] = useState<Record<string, "loaded" | "error">>({});
  const [tileRetry, setTileRetry] = useState(0);
  const zoomRef = useRef(zoom);
  const panRef = useRef(pan);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [iconVersion, setIconVersion] = useState(0);
  const [drag, setDrag] = useState<{ pointerId: number; start: Point; origin: Point; moved: boolean } | null>(null);
  const pointers = useRef(new Map<number, Point>());
  const iconCache = useRef(new Map<string, HTMLImageElement>());
  const pinch = useRef<{ distance: number; zoom: number; midpoint: Point } | null>(null);
  const viewFilters = useRef<Record<MapView, Set<string>>>({ palpagos: new Set(), "world-tree": new Set() });

  const getMinimumZoom = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return MAP_MIN_ZOOM;
    return Math.max(MAP_MIN_ZOOM, stage.clientWidth / MAP_SIZE, stage.clientHeight / MAP_SIZE);
  }, []);

  const clampPan = useCallback((nextPan: Point, nextZoom: number, width = stageRef.current?.clientWidth ?? 0, height = stageRef.current?.clientHeight ?? 0) => ({
    x: MAP_SIZE * nextZoom <= width ? (width - MAP_SIZE * nextZoom) / 2 : Math.min(0, Math.max(width - MAP_SIZE * nextZoom, nextPan.x)),
    y: MAP_SIZE * nextZoom <= height ? (height - MAP_SIZE * nextZoom) / 2 : Math.min(0, Math.max(height - MAP_SIZE * nextZoom, nextPan.y)),
  }), []);

  const centerMap = useCallback((nextZoom = 0.12) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const clampedZoom = Math.max(getMinimumZoom(), Math.min(MAP_MAX_ZOOM, nextZoom));
    const nextPan = clampPan({ x: (rect.width - MAP_SIZE * clampedZoom) / 2, y: (rect.height - MAP_SIZE * clampedZoom) / 2 }, clampedZoom, rect.width, rect.height);
    panRef.current = nextPan;
    zoomRef.current = clampedZoom;
    setPan(nextPan);
    setZoom(clampedZoom);
  }, [clampPan, getMinimumZoom]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const updateViewport = () => setViewport({ width: stage.clientWidth, height: stage.clientHeight });
    updateViewport();
    const observer = new ResizeObserver(updateViewport);
    observer.observe(stage);
    return () => observer.disconnect();
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
      localStorage.removeItem("palworld-map-state-v3");
      const saved = localStorage.getItem(MAP_STATE_KEY);
      if (!saved) {
        requestAnimationFrame(() => centerMap());
        return;
      }
      const state = JSON.parse(saved) as { query?: string; categories?: string[]; levelRange?: LevelRange; zoom?: number; pan?: Point };
      queueMicrotask(() => {
        if (cancelled) return;
        if (state.query) setQuery(state.query);
        if (["all", "1-20", "21-40", "41-60", "61-80"].includes(state.levelRange ?? "")) setLevelRange(state.levelRange ?? "all");
        if (state.categories?.length) setActiveCategories(new Set(state.categories));
        if (Number.isFinite(state.zoom)) { const restoredZoom = Math.max(getMinimumZoom(), Math.min(MAP_MAX_ZOOM, state.zoom ?? 0.12)); zoomRef.current = restoredZoom; setZoom(restoredZoom); }
        if (state.pan && Number.isFinite(state.pan.x) && Number.isFinite(state.pan.y)) { const restoredPan = clampPan(state.pan, zoomRef.current); panRef.current = restoredPan; setPan(restoredPan); }
      });
    } catch { /* Local storage is optional. */ }
    return () => { cancelled = true; };
  }, [centerMap, clampPan, getMinimumZoom]);

  useEffect(() => {
    if (!viewport.width || !viewport.height) return;
    const nextPan = clampPan(panRef.current, zoomRef.current, viewport.width, viewport.height);
    if (nextPan.x !== panRef.current.x || nextPan.y !== panRef.current.y) {
      panRef.current = nextPan;
      setPan(nextPan);
    }
  }, [clampPan, viewport]);

  useEffect(() => {
    try { localStorage.setItem(MAP_STATE_KEY, JSON.stringify({ query, categories: [...activeCategories], levelRange, zoom, pan })); } catch { /* Local storage is optional. */ }
  }, [activeCategories, levelRange, pan, query, zoom]);

  const filteredLocations = useMemo(() => {
    const term = query.trim().toLowerCase();
    const locations = mapView === "world-tree" ? WORLD_TREE_LOCATIONS : data.locations;
    return locations.filter((location) => {
      const locationLevel = Number(location.level);
      const matchesLevel = levelRange === "all"
        || (Number.isFinite(locationLevel) && ((levelRange === "1-20" && locationLevel <= 20) || (levelRange === "21-40" && locationLevel >= 21 && locationLevel <= 40) || (levelRange === "41-60" && locationLevel >= 41 && locationLevel <= 60) || (levelRange === "61-80" && locationLevel >= 61 && locationLevel <= 80)));
      return activeCategories.has(location.category) && matchesLevel && (!term || `${location.name} ${location.description ?? ""} ${location.category}`.toLowerCase().includes(term));
    });
  }, [activeCategories, data.locations, levelRange, mapView, query]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    const locations = mapView === "world-tree" ? WORLD_TREE_LOCATIONS : data.locations;
    for (const location of locations) counts.set(location.category, (counts.get(location.category) ?? 0) + 1);
    return counts;
  }, [data.locations, mapView]);

  const currentCategories = mapView === "world-tree" ? WORLD_TREE_CATEGORIES : data.categories;

  const calibration = MAP_CALIBRATIONS[mapView];
  const imageRect = useMemo(() => getContainedImageRect(calibration, MAP_SIZE, MAP_SIZE), [calibration]);
  const visibleTiles = useMemo(() => {
    if (!viewport.width || !viewport.height) return [];
    const isWorldTree = mapView === "world-tree";
    const gridSize = isWorldTree ? 8 : 16;
    const tileWorldSize = isWorldTree ? MAP_SIZE / gridSize : TILE_SIZE;
    const left = Math.max(0, Math.floor(((0 - pan.x) / zoom) / tileWorldSize) - 1);
    const top = Math.max(0, Math.floor(((0 - pan.y) / zoom) / tileWorldSize) - 1);
    const right = Math.min(gridSize - 1, Math.ceil(((viewport.width - pan.x) / zoom) / tileWorldSize) + 1);
    const bottom = Math.min(gridSize - 1, Math.ceil(((viewport.height - pan.y) / zoom) / tileWorldSize) + 1);
    const sourceTiles = isWorldTree ? WORLD_TREE_TILES : PALPAGOS_TILES;
    return sourceTiles.filter((tile) => tile.x >= left && tile.x <= right && tile.y >= top && tile.y <= bottom);
  }, [mapView, pan, viewport, zoom]);
  const focusMapLocation = useCallback((location: MapLocation, nextView: MapView) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const nextCalibration = MAP_CALIBRATIONS[nextView];
    const nextImageRect = getContainedImageRect(nextCalibration, MAP_SIZE, MAP_SIZE);
    const point = mapCoordinateToScreenPoint(location, nextImageRect, nextCalibration);
    const currentZoom = zoomRef.current;
    const nextPan = clampPan({ x: rect.width / 2 - point.x * currentZoom, y: rect.height / 2 - point.y * currentZoom }, currentZoom, rect.width, rect.height);
    panRef.current = nextPan;
    setPan(nextPan);
  }, [clampPan]);
  const visibleLocations = useMemo(() => {
    if (!calibration.showPreparedLocations) return [];
    return filteredLocations;
  }, [calibration.showPreparedLocations, filteredLocations]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width !== MAP_SIZE * dpr || canvas.height !== MAP_SIZE * dpr) { canvas.width = MAP_SIZE * dpr; canvas.height = MAP_SIZE * dpr; }
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, MAP_SIZE, MAP_SIZE);
    const radius = Math.max(8, 10 / Math.max(zoom, 0.08));
    const stage = stageRef.current;
    const stageWidth = stage?.clientWidth ?? 0;
    const stageHeight = stage?.clientHeight ?? 0;
    const visibleLeft = (-pan.x - TILE_SIZE) / Math.max(zoom, MAP_MIN_ZOOM);
    const visibleTop = (-pan.y - TILE_SIZE) / Math.max(zoom, MAP_MIN_ZOOM);
    const visibleRight = (stageWidth - pan.x + TILE_SIZE) / Math.max(zoom, MAP_MIN_ZOOM);
    const visibleBottom = (stageHeight - pan.y + TILE_SIZE) / Math.max(zoom, MAP_MIN_ZOOM);
    for (const location of visibleLocations) {
      const { x, y } = mapCoordinateToScreenPoint(location, imageRect, calibration);
      if (x < visibleLeft || x > visibleRight || y < visibleTop || y > visibleBottom) continue;
      const iconSource = location.icon || "/map-icons/Region.webp";
      let icon = iconCache.current.get(iconSource);
      if (!icon) {
        icon = new window.Image();
        icon.onload = () => setIconVersion((version) => version + 1);
        icon.src = iconSource;
        iconCache.current.set(iconSource, icon);
      }
      if (icon.complete && icon.naturalWidth > 0) {
        const iconSize = Math.max(14, 18 / Math.max(zoom, 0.08));
        context.drawImage(icon, x - iconSize / 2, y - iconSize / 2, iconSize, iconSize);
      } else {
        context.beginPath();
        context.fillStyle = location.category.includes("Alpha") ? "#f2c94c" : "#39d0c5";
        context.fillStyle = "rgba(57, 208, 197, .8)";
        context.arc(x, y, Math.max(5, radius * 0.45), 0, Math.PI * 2);
        context.fill();
      }
    }
  }, [calibration, imageRect, pan, visibleLocations, zoom]);

  useEffect(() => { draw(); }, [draw, iconVersion]);

  const updateZoom = useCallback((nextZoom: number, anchor?: Point) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const point = anchor ?? { x: rect.width / 2, y: rect.height / 2 };
    const clamped = Math.max(getMinimumZoom(), Math.min(MAP_MAX_ZOOM, nextZoom));
    const currentZoom = zoomRef.current;
    const currentPan = panRef.current;
    const worldX = (point.x - currentPan.x) / currentZoom;
    const worldY = (point.y - currentPan.y) / currentZoom;
    const nextPan = clampPan({ x: point.x - worldX * clamped, y: point.y - worldY * clamped }, clamped, rect.width, rect.height);
    panRef.current = nextPan;
    zoomRef.current = clamped;
    setPan(nextPan);
    setZoom(clamped);
  }, [clampPan, getMinimumZoom]);

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
  }, [updateZoom]);

  const toggleCategory = (name: string) => setActiveCategories((current) => { const next = new Set(current); if (next.has(name)) next.delete(name); else next.add(name); return next; });
  const setAllCategories = (visible: boolean) => {
    setActiveCategories(visible ? new Set(currentCategories.map((category) => category.name)) : new Set());
    setQuery("");
    setLevelRange("all");
  };
  const categoryMap = useMemo(() => new Map(currentCategories.map((category) => [category.name, category])), [currentCategories]);
  const toggleGroup = (name: string) => setOpenGroups((current) => { const next = new Set(current); if (next.has(name)) next.delete(name); else next.add(name); return next; });
  const setGroupCategories = (names: readonly string[], visible: boolean) => setActiveCategories((current) => { const next = new Set(current); names.forEach((name) => visible ? next.add(name) : next.delete(name)); return next; });
  const applyQuickFilter = (categories: readonly string[]) => { setQuery(""); setLevelRange("all"); setActiveCategories(new Set(categories)); };
  const changeLevelRange = (nextLevelRange: LevelRange) => {
    setLevelRange(nextLevelRange);
    // The page intentionally starts with no categories selected. Interacting with the
    // level control is an explicit request for results, so enable all categories only
    // when the user has not already chosen a narrower category set.
    if (activeCategories.size === 0) setActiveCategories(new Set(currentCategories.map((category) => category.name)));
  };
  const activeQuickFilter = useMemo(() => QUICK_FILTERS.find((filter) => filter.categories.length === activeCategories.size && filter.categories.every((category) => activeCategories.has(category))), [activeCategories]);

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
    const stage = stageRef.current;
    const nextPan = clampPan({ x: drag.origin.x + delta.x, y: drag.origin.y + delta.y }, zoomRef.current, stage?.clientWidth ?? 0, stage?.clientHeight ?? 0);
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
    if (nextView === mapView) return;
    viewFilters.current[mapView] = new Set(activeCategories);
    const rememberedFilters = viewFilters.current[nextView];
    let nextCategories = new Set(rememberedFilters);
    if (nextView === "world-tree") {
      const worldTreeCategoryNames = new Set(WORLD_TREE_CATEGORIES.map((category) => category.name));
      nextCategories = new Set([...nextCategories].filter((category) => worldTreeCategoryNames.has(category)));
      if (nextCategories.size === 0) nextCategories = worldTreeCategoryNames;
    }
    setSelected(null);
    setTileStatus({});
    setTileRetry((value) => value + 1);
    setActiveCategories(nextCategories);
    setMapView(nextView);
    if (nextView === "world-tree" && WORLD_TREE_LOCATIONS[0]) requestAnimationFrame(() => focusMapLocation(WORLD_TREE_LOCATIONS[0], nextView));
  };
  const displayedLocationCount = mapView === "world-tree" ? visibleLocations.length : filteredLocations.length;
  const displayedLocationTotal = mapView === "world-tree" ? WORLD_TREE_LOCATIONS.length : locationCount;
  const tileLoading = viewport.width > 0 && visibleTiles.some((tile) => tileStatus[`${mapView}:${tile.src}`] !== "loaded");
  const tileErrors = visibleTiles.filter((tile) => tileStatus[`${mapView}:${tile.src}`] === "error");
  const retryTiles = () => {
    setTileStatus((current) => {
      const next = { ...current };
      visibleTiles.forEach((tile) => { delete next[`${mapView}:${tile.src}`]; });
      return next;
    });
    setTileRetry((value) => value + 1);
  };
  const groupsForView = mapView === "world-tree"
    ? [{ name: "World Tree", categories: WORLD_TREE_CATEGORIES.map((category) => category.name) }]
    : CATEGORY_GROUPS;

  return <div className={`map-tool-shell map-view-${mapView}`}>
    <div className="map-toolbar">
      <div className="map-toolbar-search" aria-label="Search">
        <span className="map-toolbar-label">Search</span>
        <label className="map-search"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search locations..." aria-label="Search map locations" />{query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search">×</button>}</label>
      </div>
      <div className="map-toolbar-row">
        <div className="map-toolbar-section map-quick-filters" aria-label="Quick Filters">
          <span className="map-toolbar-label">Quick Filters <span className="map-quick-filter-heading-flame" aria-hidden="true">🔥</span></span>
          <div className="map-quick-filter-track">
            {QUICK_FILTERS.map((filter) => {
              const active = activeQuickFilter?.id === filter.id;
              const icon = categoryMap.get(filter.categories[0])?.icon || filter.icon;
              return <button key={filter.id} type="button" className={`map-quick-filter map-quick-filter-${filter.id}${active ? " is-active" : ""}`} onClick={() => applyQuickFilter(filter.categories)} aria-pressed={active} aria-label={`Quick filter: ${filter.label}. ${filter.description}`} title={filter.description}><span>{filter.label}</span><Image className="map-quick-filter-icon" src={icon} alt="" width={18} height={18} unoptimized style={{ filter: "none", opacity: 1 }} /></button>;
            })}
          </div>
        </div>
        <div className="map-toolbar-section map-map-controls" aria-label="Map Controls">
          <span className="map-toolbar-label">Map Controls</span>
          <div className="map-map-control-actions"><select className="map-level-filter" value={levelRange} onChange={(event) => changeLevelRange(event.target.value as LevelRange)} aria-label="Filter locations by level"><option value="all">All levels</option><option value="1-20">Levels 1–20</option><option value="21-40">Levels 21–40</option><option value="41-60">Levels 41–60</option><option value="61-80">Levels 61–80</option></select><button type="button" className="map-control-button" onClick={() => setAllCategories(true)} aria-label="Show all map categories">Show all</button><button type="button" className="map-control-button" onClick={() => setAllCategories(false)} aria-label="Clear all map filters">Clear filters</button><span className="map-result-count">{readableCount(displayedLocationCount)} shown <small>of {readableCount(displayedLocationTotal)}</small></span></div>
        </div>
      </div>
    </div>
    <div className="map-workspace">
      <aside className="map-filters" aria-label="Map categories">
        <div className="map-filter-heading"><div><span className="map-filter-eyebrow">FILTER LOCATIONS</span><h2>Categories</h2></div><span className="map-filter-total">{currentCategories.length}</span></div>
        <p className="map-filter-help">Choose the locations shown on the map.</p>
        <div className="map-category-groups">
          {groupsForView.map((group) => {
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
          <div className="map-tile-layer" aria-label={mapView === "palpagos" ? "Palpagos Islands map" : "World Tree map"}>
            {visibleTiles.map((tile) => {
              const isWorldTree = mapView === "world-tree";
              const tileWorldSize = isWorldTree ? MAP_SIZE / 8 : TILE_SIZE;
              const tileKey = `${mapView}:${tile.src}`;
              return <Image key={`${tileKey}:${tileRetry}`} className={`map-tile${isWorldTree ? " map-world-tree-tile" : ""}`} src={tile.src} alt="" width={isWorldTree ? WORLD_TREE_TILE_SIZE : TILE_SIZE} height={isWorldTree ? WORLD_TREE_TILE_SIZE : TILE_SIZE} loading="eager" decoding="async" unoptimized style={{ left: tile.x * tileWorldSize, top: tile.y * tileWorldSize, width: tileWorldSize, height: tileWorldSize }} onLoad={() => setTileStatus((current) => ({ ...current, [tileKey]: "loaded" }))} onError={() => setTileStatus((current) => ({ ...current, [tileKey]: "error" }))} />;
            })}
          </div>
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
        {!loading && tileLoading && !tileErrors.length && <div className="map-status">Loading map tiles...</div>}
        {!loading && tileErrors.length > 0 && <div className="map-status map-status-error"><span>{tileErrors.length} map tile{tileErrors.length === 1 ? "" : "s"} failed to load.</span><button type="button" className="map-control-button" onClick={retryTiles}>Retry tiles</button></div>}
        {error && <div className="map-status map-status-error">{error}</div>}
        {!loading && !error && mapView === "world-tree" && visibleLocations.length === 0 && (WORLD_TREE_LOCATIONS.length === 0 || activeCategories.size > 0) && <div className="map-empty-state"><strong>World Tree markers unavailable</strong><span>{WORLD_TREE_LOCATIONS.length === 0 ? "World Tree location markers are not available yet." : "No World Tree markers match the current filters."}</span></div>}
        {!loading && !error && query.trim() && filteredLocations.length === 0 && <div className="map-empty-state"><strong>No locations found</strong><span>Try clearing the search or enabling another category.</span></div>}
        {selected && <article className="map-location-card" onPointerDown={(event) => event.stopPropagation()}><button type="button" className="map-card-close" onClick={() => setSelected(null)} aria-label="Close location details">×</button><div className="map-card-icon"><Image src={selected.icon || "/map-icons/Region.webp"} alt="" width={34} height={34} unoptimized /></div><span className="map-card-category">{selected.category}</span><h3>{selected.name}</h3>{selected.level && <p className="map-card-level">Level {selected.level}</p>}{selected.description && <p className="map-card-description">{selected.description}</p>}<p className="map-card-coordinates">Map position <b>{selected.x.toFixed(0)}, {selected.y.toFixed(0)}</b></p><button type="button" className="map-share-button" onClick={() => navigator.clipboard?.writeText(`${window.location.origin}/map#${selected.id}`)}>Copy share link</button></article>}
      </div>
    </div>
  </div>;
}
