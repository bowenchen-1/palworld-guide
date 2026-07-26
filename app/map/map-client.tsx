"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { MapCategory, MapLocation } from "../../data/map";
import worldTreePayload from "../../public/data/world-tree-locations.json";
import { assetUrl } from "../lib/assets";
import { getContainedImageRect, MAP_CALIBRATIONS, mapCoordinateToScreenPoint, screenPointToMapCoordinate, type MapView } from "./map-calibration";
import { mapText, type MapLocale } from "./map-i18n";

const MAP_SIZE = 8192;
const TILE_SIZE = 512;
const MAP_MIN_ZOOM = 0.04;
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
const MAP_PREVIEWS: Record<MapView, string> = {
  palpagos: assetUrl("/map/Palpagos_Islands.png"),
  "world-tree": assetUrl("/map/World_Tree.png"),
};
const CATEGORY_GROUPS = [
  { name: "Locations", categories: ["Fast Travel", "Dungeons", "Towers", "Settlements", "Cave Entrances", "Region Labels", "Recommended Base Spots", "Respawn Points", "Skyland Warp Altars"] },
  { name: "Pals", categories: ["Alpha Pals", "Sakura Eggs", "Desert Eggs", "Frozen Eggs", "Grass Eggs", "Feybreak Eggs", "Volcano Eggs"] },
  { name: "Collectibles", categories: ["Lifmunk Effigies", "Rooby Effigies", "Yakumo Effigies", "Munchill Effigies", "Relaxaurus Effigies", "Herbil Effigies", "Tanzee Effigies", "Lunaris Effigies", "Depresso Effigies", "Pengullet Effigies", "Lamball Effigies", "Treasure Chests", "Elemental Chests", "Treasure Map Dig Spots", "Journals"] },
  { name: "Resources", categories: ["Ore", "Ore Clusters", "Coal", "Coal Clusters", "Sulfur", "Sulfur Clusters", "Pure Quartz", "Pure Quartz Clusters", "Chromite", "Hexolite Quartz", "Crude Oil", "Nightstar Sand", "Ancient Bark", "Ancient Bone", "Ancient Lava", "Skill Fruit Trees", "Beautiful Flowers", "Kinship Peaches", "Soralite", "Junk", "Heat Sources"] },
  { name: "Enemies", categories: ["Enemy Camps", "Anti-Air Turrets", "Incidents", "Supply Drops", "Arrogant Pal Critic"] },
  { name: "NPCs", categories: ["NPCs", "Wandering Merchants", "Black Marketeers"] },
  { name: "Activities", categories: ["Fishing Spots", "Salvage Rank 1", "Salvage Rank 2", "Oilrig Big Chests", "Oilrig Chests"] },
  { name: "Other", categories: ["Unknown"] },
] as const;
const QUICK_FILTERS = [
  { id: "nightstar-sand", label: "Nightstar Sand", categories: ["Nightstar Sand"], icon: assetUrl("/map-icons/Nightstar_Sand.webp"), description: "Maps to Nightstar Sand" },
  { id: "dungeons", label: "Dungeons", categories: ["Dungeons"], icon: assetUrl("/map-icons/Dungeon.webp"), description: "Maps to Dungeons" },
  { id: "chromite", label: "Chromite", categories: ["Chromite"], icon: assetUrl("/map-icons/Chromite.webp"), description: "Maps to Chromite" },
  { id: "sulfur", label: "Sulfur", categories: ["Sulfur", "Sulfur Clusters"], icon: assetUrl("/map-icons/Sulfur.webp"), description: "Maps to Sulfur and Sulfur Clusters" },
  { id: "ancient-civilization", label: "Ancient Civilization", categories: ["Ancient Bark", "Ancient Bone", "Ancient Lava"], icon: assetUrl("/map-icons/Ancient_Bark.webp"), description: "Maps to Ancient Bark, Ancient Bone, and Ancient Lava" },
  { id: "fishing-spots", label: "Fisherman's Point", categories: ["Fishing Spots"], icon: assetUrl("/map-icons/Fishing_Spot.webp"), description: "Maps to Fishing Spots" },
] as const;
type WorldTreePayload = { locations: MapLocation[]; types: string[] };
const WORLD_TREE_DATA = worldTreePayload as unknown as WorldTreePayload;
const mapIconUrl = (path?: string) => path ? assetUrl(path) : path;
const WORLD_TREE_CATEGORY_ICONS: Record<string, string> = {
  "Alpha Pal": assetUrl("/map-icons/world-tree/T_GrassGolem_icon_normal.webp"),
  NPC: assetUrl("/map-icons/NPC.webp"),
  "Lifmunk Effigy": assetUrl("/map-icons/Lifmunk_Effigy.webp"),
  "Yakumo Effigy": assetUrl("/map-icons/Yakumo_Effigy.webp"),
  "Cattiva Effigy": assetUrl("/map-icons/Cattiva_Effigy.webp"),
  "Memo Planner": assetUrl("/map-icons/Memo_Planner.webp"),
  Junk: assetUrl("/map-icons/Junk.webp"),
  "Fruit Tree": assetUrl("/map-icons/world-tree/T_itemicon_Consume_SkillCard_Dark.webp"),
  Paloxite: assetUrl("/map-icons/Paloxite.webp"),
  Journals: assetUrl("/map-icons/Journals.webp"),
  Incident: assetUrl("/map-icons/Incident.webp"),
  "Fishing Spot": assetUrl("/map-icons/Fishing_Spot.webp"),
  Tower: assetUrl("/map-icons/Tower.webp"),
  "Fast Travel": assetUrl("/map-icons/Fast_Travel.webp"),
};
const WORLD_TREE_LOCATIONS = WORLD_TREE_DATA.locations.map((location) => ({
  ...location,
  icon: mapIconUrl(location.icon) || WORLD_TREE_CATEGORY_ICONS[location.category] || assetUrl("/map-icons/Region.webp"),
}));
const WORLD_TREE_CATEGORIES: MapCategory[] = WORLD_TREE_DATA.types.map((name) => ({
  name,
  icon: WORLD_TREE_CATEGORY_ICONS[name] || WORLD_TREE_LOCATIONS.find((location) => location.category === name)?.icon || "/map-icons/Region.webp",
}));
const MAP_STATE_KEY = "palworld-map-state-v5";

type MapPayload = { locations: MapLocation[]; categories: MapCategory[] };
type Point = { x: number; y: number };
type LevelRange = "all" | "1-20" | "21-40" | "41-60" | "61-80";
type DisplayFilterItem = { name: string; names: string[]; icon: string; count: number };

function readableCount(value: number, locale: MapLocale) {
  return new Intl.NumberFormat(locale === "zh" ? "zh-CN" : "en-US").format(value);
}

export default function MapClient({ initialCategories, locationCount, locale = "en" }: { initialCategories: MapCategory[]; locationCount: number; locale?: MapLocale }) {
  const text = mapText(locale);
  const getLocationName = useCallback((location: MapLocation) => {
    if (locale === "zh" || !/[\u3400-\u9fff]/.test(location.name)) return location.name;
    if (location.href) return location.href.replace(/[_-]+/g, " ");
    return text.category(location.category);
  }, [locale, text]);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState<MapPayload>({ locations: [], categories: initialCategories.map((category) => ({ ...category, icon: mapIconUrl(category.icon) ?? assetUrl("/map-icons/Region.webp") })) });
  const [activeCategories, setActiveCategories] = useState(() => new Set<string>());
  const [openGroups, setOpenGroups] = useState(() => new Set(["Locations", "Pals", "Collectibles", "Resources"]));
  const [query, setQuery] = useState("");
  const [levelRange, setLevelRange] = useState<LevelRange>("all");
  const [selected, setSelected] = useState<MapLocation | null>(null);
  const [hovered, setHovered] = useState<MapLocation | null>(null);
  const [cursorCoordinate, setCursorCoordinate] = useState<Point | null>(null);
  const [mapView, setMapView] = useState<MapView>("palpagos");
  const [zoom, setZoom] = useState(MAP_MIN_ZOOM);
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
    return MAP_MIN_ZOOM;
  }, []);

  const getFitZoom = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return MAP_MIN_ZOOM;
    return Math.min(MAP_MAX_ZOOM, Math.max(MAP_MIN_ZOOM, Math.min(stage.clientWidth / MAP_SIZE, stage.clientHeight / MAP_SIZE)));
  }, []);

  const clampPan = useCallback((nextPan: Point, nextZoom: number, width = stageRef.current?.clientWidth ?? 0, height = stageRef.current?.clientHeight ?? 0) => ({
    x: MAP_SIZE * nextZoom <= width ? (width - MAP_SIZE * nextZoom) / 2 : Math.min(0, Math.max(width - MAP_SIZE * nextZoom, nextPan.x)),
    y: MAP_SIZE * nextZoom <= height ? (height - MAP_SIZE * nextZoom) / 2 : Math.min(0, Math.max(height - MAP_SIZE * nextZoom, nextPan.y)),
  }), []);

  const centerMap = useCallback((nextZoom = getFitZoom()) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const clampedZoom = Math.max(getMinimumZoom(), Math.min(MAP_MAX_ZOOM, nextZoom));
    const nextPan = clampPan({ x: (rect.width - MAP_SIZE * clampedZoom) / 2, y: (rect.height - MAP_SIZE * clampedZoom) / 2 }, clampedZoom, rect.width, rect.height);
    panRef.current = nextPan;
    zoomRef.current = clampedZoom;
    setPan(nextPan);
    setZoom(clampedZoom);
  }, [clampPan, getFitZoom, getMinimumZoom]);

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
      .then((payload) => { if (!cancelled) { setData({ ...payload, locations: payload.locations.map((location) => ({ ...location, icon: mapIconUrl(location.icon) })), categories: payload.categories.map((category) => ({ ...category, icon: mapIconUrl(category.icon) ?? assetUrl("/map-icons/Region.webp") })) }); setLoading(false); } })
      .catch(() => { if (!cancelled) { setLoading(false); setError(text.dataError); } });
    return () => { cancelled = true; };
  }, [text.dataError]);

  useEffect(() => {
    let cancelled = false;
    try {
      localStorage.removeItem("palworld-map-state-v3");
      const saved = localStorage.getItem(MAP_STATE_KEY);
      if (!saved) { requestAnimationFrame(() => centerMap()); return; }
      const state = JSON.parse(saved) as { query?: string; categories?: string[]; levelRange?: LevelRange; zoom?: number; pan?: Point };
      queueMicrotask(() => {
        if (cancelled) return;
        if (state.query) setQuery(state.query);
        if (["all", "1-20", "21-40", "41-60", "61-80"].includes(state.levelRange ?? "")) setLevelRange(state.levelRange ?? "all");
        if (state.categories?.length) setActiveCategories(new Set(state.categories));
        requestAnimationFrame(() => centerMap());
      });
    } catch { /* Local storage is optional. */ }
    return () => { cancelled = true; };
  }, [centerMap]);

  useEffect(() => {
    if (!viewport.width || !viewport.height) return;
    const nextPan = clampPan(panRef.current, zoomRef.current, viewport.width, viewport.height);
    if (nextPan.x !== panRef.current.x || nextPan.y !== panRef.current.y) {
      panRef.current = nextPan;
      setPan(nextPan);
    }
  }, [clampPan, viewport]);

  useEffect(() => {
    try { localStorage.setItem(MAP_STATE_KEY, JSON.stringify({ query, categories: [...activeCategories], levelRange })); } catch { /* Local storage is optional. */ }
  }, [activeCategories, levelRange, query]);

  const filteredLocations = useMemo(() => {
    const term = query.trim().toLowerCase();
    const labels = mapText(locale);
    const locations = mapView === "world-tree" ? WORLD_TREE_LOCATIONS : data.locations;
    return locations.filter((location) => {
      const locationLevel = Number(location.level);
      const matchesLevel = levelRange === "all"
        || (Number.isFinite(locationLevel) && ((levelRange === "1-20" && locationLevel <= 20) || (levelRange === "21-40" && locationLevel >= 21 && locationLevel <= 40) || (levelRange === "41-60" && locationLevel >= 41 && locationLevel <= 60) || (levelRange === "61-80" && locationLevel >= 61 && locationLevel <= 80)));
      return activeCategories.has(location.category) && matchesLevel && (!term || `${getLocationName(location)} ${location.name} ${location.description ?? ""} ${location.category} ${labels.category(location.category)}`.toLowerCase().includes(term));
    });
  }, [activeCategories, data.locations, getLocationName, levelRange, locale, mapView, query]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    const locations = mapView === "world-tree" ? WORLD_TREE_LOCATIONS : data.locations;
    for (const location of locations) counts.set(location.category, (counts.get(location.category) ?? 0) + 1);
    return counts;
  }, [data.locations, mapView]);

  const currentCategories = mapView === "world-tree" ? WORLD_TREE_CATEGORIES : data.categories;

  const calibration = MAP_CALIBRATIONS[mapView];
  const imageRect = useMemo(() => getContainedImageRect(calibration, MAP_SIZE, MAP_SIZE), [calibration]);
  const hoveredPoint = useMemo(() => hovered ? mapCoordinateToScreenPoint(hovered, imageRect, calibration) : null, [calibration, hovered, imageRect]);
  const visibleTiles = useMemo(() => {
    if (!viewport.width || !viewport.height) return [];
    const isWorldTree = mapView === "world-tree";
    const gridSize = isWorldTree ? 8 : 16;
    const tileWorldSize = isWorldTree ? MAP_SIZE / gridSize : TILE_SIZE;
    const left = Math.max(0, Math.floor(((0 - pan.x) / zoom) / tileWorldSize) - 2);
    const top = Math.max(0, Math.floor(((0 - pan.y) / zoom) / tileWorldSize) - 2);
    const right = Math.min(gridSize - 1, Math.ceil(((viewport.width - pan.x) / zoom) / tileWorldSize) + 2);
    const bottom = Math.min(gridSize - 1, Math.ceil(((viewport.height - pan.y) / zoom) / tileWorldSize) + 2);
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
      const iconSource = location.icon || assetUrl("/map-icons/Region.webp");
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

  const setAllCategories = (visible: boolean) => {
    setActiveCategories(visible ? new Set(currentCategories.map((category) => category.name)) : new Set());
    setQuery("");
    setLevelRange("all");
  };
  const categoryMap = useMemo(() => new Map(currentCategories.map((category) => [category.name, category])), [currentCategories]);
  const displayItemsForGroup = useCallback((group: { name: string; categories: readonly string[] }) => {
    const categories = group.categories.map((name) => categoryMap.get(name)).filter((category): category is MapCategory => Boolean(category));
    const makeItem = (name: string, names: string[], fallback?: MapCategory): DisplayFilterItem => ({ name, names, icon: fallback?.icon || categories[0]?.icon || assetUrl("/map-icons/Region.webp"), count: names.reduce((total, categoryName) => total + (categoryCounts.get(categoryName) ?? 0), 0) });
    if (group.name === "Pals") {
      const eggs = categories.filter((category) => category.name.endsWith("Eggs"));
      return [
        ...categories.filter((category) => !category.name.endsWith("Eggs")).map((category) => makeItem(category.name, [category.name], category)),
        ...(eggs.length ? [makeItem("Pal Eggs", eggs.map((category) => category.name), eggs[0])] : []),
      ];
    }
    if (group.name === "Collectibles") {
      const effigies = categories.filter((category) => category.name.endsWith("Effigies"));
      return [
        ...(effigies.length ? [makeItem("Effigies", effigies.map((category) => category.name), effigies[0])] : []),
        ...categories.filter((category) => !category.name.endsWith("Effigies")).map((category) => makeItem(category.name, [category.name], category)),
      ];
    }
    return categories.map((category) => makeItem(category.name, [category.name], category));
  }, [categoryCounts, categoryMap]);
  const toggleGroup = (name: string) => setOpenGroups((current) => { const next = new Set(current); if (next.has(name)) next.delete(name); else next.add(name); return next; });
  const setGroupCategories = (names: readonly string[], visible: boolean) => setActiveCategories((current) => { const next = new Set(current); names.forEach((name) => visible ? next.add(name) : next.delete(name)); return next; });
  const toggleDisplayItem = (item: DisplayFilterItem) => setActiveCategories((current) => { const next = new Set(current); const isActive = item.names.every((name) => current.has(name)); item.names.forEach((name) => isActive ? next.delete(name) : next.add(name)); return next; });
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
    const pointerStage = stageRef.current;
    if (pointerStage && event.pointerType === "mouse") {
      const rect = pointerStage.getBoundingClientRect();
      const worldPoint = { x: (event.clientX - rect.left - panRef.current.x) / zoomRef.current, y: (event.clientY - rect.top - panRef.current.y) / zoomRef.current };
      setCursorCoordinate(screenPointToMapCoordinate(worldPoint, imageRect, calibration));
      let closest: MapLocation | null = null;
      let closestDistance = 28 / Math.max(zoomRef.current, 0.08);
      for (const location of visibleLocations) {
        const point = mapCoordinateToScreenPoint(location, imageRect, calibration);
        const distance = Math.hypot(point.x - worldPoint.x, point.y - worldPoint.y);
        if (distance < closestDistance) { closestDistance = distance; closest = location; }
      }
      setHovered(closest);
    }
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
    setHovered(null);
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
      <div className="map-toolbar-search" aria-label={text.search}>
        <span className="map-toolbar-label">{text.search}</span>
        <label className="map-search"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={text.search} aria-label={text.searchLabel} />{query && <button type="button" onClick={() => setQuery("")} aria-label={text.clearSearch}>×</button>}</label>
      </div>
      <div className="map-toolbar-row">
        <div className="map-toolbar-section map-quick-filters" aria-label={text.quickFilters}>
          <span className="map-toolbar-label">{text.quickFilters} <span className="map-quick-filter-heading-flame" aria-hidden="true">🔥</span></span>
          <div className="map-quick-filter-track">
            {QUICK_FILTERS.map((filter) => {
              const active = activeQuickFilter?.id === filter.id;
              const icon = categoryMap.get(filter.categories[0])?.icon || filter.icon;
              const quick = text.quick(filter.id, filter);
              return <button key={filter.id} type="button" className={`map-quick-filter map-quick-filter-${filter.id}${active ? " is-active" : ""}`} onClick={() => applyQuickFilter(filter.categories)} aria-pressed={active} aria-label={`${quick.label}：${quick.description}`} title={quick.description}><span>{quick.label}</span><Image className="map-quick-filter-icon" src={icon} alt="" width={18} height={18} unoptimized style={{ filter: "none", opacity: 1 }} /></button>;
            })}
          </div>
        </div>
        <div className="map-toolbar-section map-map-controls" aria-label={text.mapControls}>
          <span className="map-toolbar-label">{text.mapControls}</span>
          <div className="map-map-control-actions"><select className="map-level-filter" value={levelRange} onChange={(event) => changeLevelRange(event.target.value as LevelRange)} aria-label={locale === "zh" ? "按等级筛选地点" : "Filter locations by level"}><option value="all">{text.allLevels}</option><option value="1-20">{text.level("1–20")}</option><option value="21-40">{text.level("21–40")}</option><option value="41-60">{text.level("41–60")}</option><option value="61-80">{text.level("61–80")}</option></select><button type="button" className="map-control-button" onClick={() => setAllCategories(true)} aria-label={text.showAll}>{text.showAll}</button><button type="button" className="map-control-button" onClick={() => setAllCategories(false)} aria-label={text.clearFilters}>{text.clearFilters}</button><span className="map-result-count">{readableCount(displayedLocationCount, locale)} {text.shown} <small>{text.of} {readableCount(displayedLocationTotal, locale)}</small></span></div>
        </div>
      </div>
    </div>
    <div className="map-workspace">
      <aside className="map-filters" aria-label={locale === "zh" ? "地图分类" : "Map categories"}>
        <div className="map-filter-heading"><div><span className="map-filter-eyebrow">{text.filterLocations}</span><h2>{text.mapFilters}</h2></div><span className="map-filter-total">{currentCategories.length}</span></div>
        <p className="map-filter-help">{text.chooseLocations}</p>
        <div className="map-category-groups">
          {groupsForView.map((group) => {
            const categories = group.categories.map((name) => categoryMap.get(name)).filter((category): category is MapCategory => Boolean(category));
            if (!categories.length) return null;
            const items = displayItemsForGroup(group);
            const activeCount = items.filter((item) => item.names.some((name) => activeCategories.has(name))).length;
            const isOpen = openGroups.has(group.name);
            return <section className="map-category-group" key={group.name}><div className="map-group-heading"><button type="button" className="map-group-toggle" onClick={() => toggleGroup(group.name)} aria-expanded={isOpen}><span className={`map-group-chevron${isOpen ? " is-open" : ""}`}>⌄</span><strong>{text.group(group.name)}</strong><span className="map-group-count">{activeCount}/{items.length}</span></button><div className="map-group-actions"><button type="button" onClick={() => setGroupCategories(group.categories, true)}>{text.all}</button><button type="button" onClick={() => setGroupCategories(group.categories, false)}>{text.clear}</button></div></div>{isOpen && <div className="map-category-list">{items.map((item) => { const active = item.names.some((name) => activeCategories.has(name)); return <button key={item.name} type="button" className={`map-category${active ? " is-active" : ""}`} aria-pressed={active} onClick={() => toggleDisplayItem(item)}><span className="map-category-checkbox" aria-hidden="true">{active ? "✓" : ""}</span><span className="map-category-icon"><Image src={item.icon} alt="" width={24} height={24} unoptimized /></span><span className="map-category-label"><span className="map-category-name">{text.category(item.name)}</span><small className="map-category-count">{readableCount(item.count, locale)}</small></span></button>; })}</div>}</section>;
          })}
        </div>
      </aside>
      <div ref={stageRef} className="map-stage" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp} onPointerLeave={() => { setCursorCoordinate(null); setHovered(null); }} role="application" aria-label={locale === "zh" ? "互动式帕鲁地图" : "Interactive Palworld map"}>
        <div className="map-board" style={{ transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})` }}>
          <div className="map-tile-layer" aria-label={mapView === "palpagos" ? text.palpagos : text.worldTree}>
            <Image className="map-preview-layer" src={MAP_PREVIEWS[mapView]} alt="" width={MAP_SIZE} height={MAP_SIZE} priority={mapView === "palpagos"} unoptimized />
            {visibleTiles.map((tile) => {
              const isWorldTree = mapView === "world-tree";
              const tileWorldSize = isWorldTree ? MAP_SIZE / 8 : TILE_SIZE;
              const tileKey = `${mapView}:${tile.src}`;
              return <Image key={`${tileKey}:${tileRetry}`} className={`map-tile${isWorldTree ? " map-world-tree-tile" : ""}`} src={tile.src} alt="" width={isWorldTree ? WORLD_TREE_TILE_SIZE : TILE_SIZE} height={isWorldTree ? WORLD_TREE_TILE_SIZE : TILE_SIZE} loading="eager" decoding="async" unoptimized style={{ left: tile.x * tileWorldSize, top: tile.y * tileWorldSize, width: tileWorldSize, height: tileWorldSize }} onLoad={() => setTileStatus((current) => ({ ...current, [tileKey]: "loaded" }))} onError={() => setTileStatus((current) => ({ ...current, [tileKey]: "error" }))} />;
            })}
          </div>
          <canvas ref={canvasRef} className="map-marker-canvas" aria-hidden="true" />
        </div>
        {hovered && hoveredPoint && <div className="map-hover-label" style={{ left: hoveredPoint.x * zoom + pan.x, top: hoveredPoint.y * zoom + pan.y }} role="status">{getLocationName(hovered)}</div>}
        <div className="map-view-switcher" role="tablist" aria-label={text.mapArea}>
          <button type="button" className={mapView === "palpagos" ? "is-active" : ""} onClick={() => changeMapView("palpagos")} role="tab" aria-selected={mapView === "palpagos"}>{text.palpagos}</button>
          <button type="button" className={mapView === "world-tree" ? "is-active" : ""} onClick={() => changeMapView("world-tree")} role="tab" aria-selected={mapView === "world-tree"}>{text.worldTree}</button>
        </div>
        <div className="map-zoom-controls">
          <div className="map-coordinate-readout" aria-label={text.coordinates}><span>X <b>{cursorCoordinate ? Math.round(cursorCoordinate.x) : "—"}</b></span><span>Y <b>{cursorCoordinate ? Math.round(cursorCoordinate.y) : "—"}</b></span></div>
          <button type="button" onClick={() => updateZoom(zoomRef.current * 1.2)} aria-label={text.zoomIn}>+</button>
          <button type="button" onClick={() => updateZoom(zoomRef.current / 1.2)} aria-label={text.zoomOut}>−</button>
        </div>
        {loading && <div className="map-status">{text.loadingData}</div>}
        {!loading && tileLoading && !tileErrors.length && <div className="map-status">{text.loadingTiles}</div>}
        {!loading && tileErrors.length > 0 && <div className="map-status map-status-error"><span>{text.tileFailed(tileErrors.length)}</span><button type="button" className="map-control-button" onClick={retryTiles}>{text.retryTiles}</button></div>}
        {error && <div className="map-status map-status-error">{error}</div>}
        {!loading && !error && mapView === "world-tree" && visibleLocations.length === 0 && (WORLD_TREE_LOCATIONS.length === 0 || activeCategories.size > 0) && <div className="map-empty-state"><strong>{text.worldTreeUnavailable}</strong><span>{WORLD_TREE_LOCATIONS.length === 0 ? text.worldTreeNotReady : text.noWorldTreeMatch}</span></div>}
        {!loading && !error && query.trim() && filteredLocations.length === 0 && <div className="map-empty-state"><strong>{text.noLocations}</strong><span>{text.tryAnother}</span></div>}
        {selected && <article className="map-location-card" onPointerDown={(event) => event.stopPropagation()}><button type="button" className="map-card-close" onClick={() => setSelected(null)} aria-label={text.closeDetails}>×</button><div className="map-card-icon"><Image src={selected.icon || assetUrl("/map-icons/Region.webp")} alt="" width={34} height={34} unoptimized /></div><span className="map-card-category">{text.category(selected.category)}</span><h3>{getLocationName(selected)}</h3>{selected.level && <p className="map-card-level">{text.levelLabel} {selected.level}</p>}{selected.description && <p className="map-card-description">{selected.description}</p>}<p className="map-card-coordinates">{text.mapPosition} <b>{selected.x.toFixed(0)}, {selected.y.toFixed(0)}</b></p><button type="button" className="map-share-button" onClick={() => navigator.clipboard?.writeText(`${window.location.origin}${locale === "zh" ? "/zh/map" : "/map"}#${selected.id}`)}>{text.copyLink}</button></article>}
      </div>
    </div>
  </div>;
}
