import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/site-header";
import MapClient from "./map-client";
import { absoluteUrl, createBreadcrumbSchema } from "../lib/seo";
import { mapDataUrl, mapCoordinateNote, type MapCategory } from "../../data/map";
import mapData from "../../public/data/map-locations.json";

const title = "Palworld Map 1.0 – Interactive Map, Locations & Resources";
const description = "Explore the Palworld Map 1.0 to find Alpha Pals, fast travel points, dungeons, resources, treasure chests, Pal eggs, merchants, towers, settlements, and other important locations.";

export const metadata: Metadata = {
  title,
  description,
  robots: { index: true, follow: true },
  alternates: { canonical: absoluteUrl("/map") },
  openGraph: {
    title,
    description,
    url: absoluteUrl("/map"),
    siteName: "Palworld Guide",
    type: "website",
    images: [{ url: absoluteUrl("/map/Palworld_Map_Complete.png"), width: 4096, height: 4096, alt: "Complete Palworld Map 1.0" }],
  },
};

const breadcrumbSchema = createBreadcrumbSchema([{ name: "Home", path: "/" }, { name: "Map", path: "/map" }]);
const pageSchema = { "@context": "https://schema.org", "@type": "WebPage", name: title, headline: "Palworld Map 1.0", description, url: absoluteUrl("/map"), isAccessibleForFree: true, inLanguage: "en" };
const categories = (mapData.categories as MapCategory[]).map((category) => ({ name: category.name, icon: category.icon }));

export default function MapPage() {
  return (
    <main id="main-content" className="map-page min-h-screen bg-canvas text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SiteHeader current="/map" />
      <div className="map-page-wrap">
        <nav className="map-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">›</span><span>Map</span></nav>
        <header className="map-page-header">
          <div>
            <p className="map-kicker">Palworld 1.0 · Field atlas</p>
            <h1>Palworld Map 1.0</h1>
            <p>Explore the latest Palworld interactive map for version 1.0. Search and filter Alpha Pals, fast travel points, dungeons, resources, treasure chests, Pal eggs, merchants, towers, settlements, and other important locations across the full Palworld map.</p>
          </div>
          <div className="map-header-stat"><strong>{new Intl.NumberFormat("en-US").format(mapData.locations.length)}</strong><span>locations indexed</span><small>Palpagos map · 1.0 data</small></div>
        </header>

        <MapClient initialCategories={categories} locationCount={mapData.locations.length} />

        <section className="map-seo-content">
          <h2>Palworld Interactive Map</h2>
          <p>This Palworld Map 1.0 is designed as a practical field guide for players who want to plan an expedition instead of browsing a long list of disconnected coordinates. The interactive map combines the supplied Palpagos Islands artwork, location records, category icons, search, and map controls in one place. It covers the central islands, remote islands, resource regions, caves, dungeons, towers, settlements, and the important areas that become useful as a save file progresses from the early game into late-game exploration.</p>
          <p>Every visible marker is connected to the prepared map dataset. That means the map can be used for a quick answer, such as finding nearby sulfur, locating a dungeon entrance, checking a fast travel point, or planning a route through a region with several resource types. The goal is clarity: select only the layer you need, read the map without unnecessary marker noise, and open a marker for its name, category, coordinates, and available details.</p>

          <h2>Palworld Map Locations</h2>
          <p>The current snapshot indexes {new Intl.NumberFormat("en-US").format(mapData.locations.length)} location records. These records include Alpha Pals, fast travel points, settlements, towers, dungeons, cave entrances, treasure chests, Pal eggs, resource nodes, oil rig locations, fishing spots, NPCs, wandering merchants, enemy camps, supply drops, and other useful points of interest. The count shown in the map toolbar reflects the selected layers, so it changes when a player enables a category or applies a search.</p>
          <p>Location names and categories come from the project data rather than being generated from a visual guess. This is important for resources that are easy to confuse in screenshots. Sulfur and Sulfur Clusters are separate records, for example, while Chromite is maintained as its own resource layer. The same approach makes it possible to distinguish a dungeon from a cave entrance, a tower from a settlement, and a fast travel point from a general region label.</p>

          <h2>Palworld Map Categories</h2>
          <p>Use the left filter panel to open a group and select individual layers. Collectibles includes Lifmunk Effigies and other effigy records. Eggs covers Sakura, Desert, Frozen, Grass, Feybreak, and Volcano Eggs. Locations includes Fast Travel, Settlements, Cave Entrances, Dungeons, Treasure Map Dig Spots, and Region Labels. Enemies includes Alpha Pals, Towers, Enemy Camps, Anti-Air Turrets, Incidents, and Supply Drops.</p>
          <p>The resource groups are especially useful when planning a crafting trip. Minerals includes Ore, Coal, Pure Quartz, Sulfur, Chromite, Hexolite Quartz, and their cluster variants. Resources includes Nightstar Sand, Ancient Bark, Ancient Bone, Ancient Lava, Soralite, Skill Fruit Trees, Treasure Chests, Elemental Chests, and other gathering points. The toolbar also provides popular shortcuts for Nightstar Sand, Dungeons, Chromite, Sulfur, and the Ancient Civilization material group, so common searches do not require opening several nested panels.</p>

          <h2>Chromite, Sulfur, and Nightstar Sand Locations</h2>
          <p>Chromite is one of the most useful late-game resource searches in the map. Select the Chromite shortcut to isolate its recorded points and remove unrelated markers from the map. The dedicated layer currently contains 257 Chromite locations. Once the layer is active, zoom in with the wheel or the plus button, drag the map to inspect a route, and click a marker to open its location card. This makes it easier to compare nearby nodes before travelling, especially when the same region contains other minerals or hostile points.</p>
          <p>Sulfur can be searched from the shortcut as a combined view of Sulfur and Sulfur Clusters. The prepared dataset contains 286 related records across those two layers. Nightstar Sand has its own shortcut and 271 recorded locations. These quick filters are intentionally direct: they clear the search text, activate only the relevant resource layers, and keep the current map view ready for inspection. If you need a wider route, use Show all and then clear individual categories from the left panel.</p>

          <h2>Ancient Civilization Resources and Exploration</h2>
          <p>Players looking for an Ancient Civilization theme will often need to connect several related resource searches rather than rely on one literal map label. In this map snapshot, the Ancient Civilization shortcut groups Ancient Bark, Ancient Bone, and Ancient Lava. It does not invent a new location type; it simply combines the existing records that use the ancient material naming in the supplied data. This gives the shortcut a useful exploration purpose while keeping the individual categories available for more precise filtering.</p>
          <p>Ancient material searches work best when combined with movement planning. Start with the shortcut, inspect the broad distribution at the default zoom, then zoom into one region and use the map drag gesture to follow the coastline, island edge, or nearby route. The marker card can be opened without changing the map, allowing the player to compare coordinates and return to the same view. If a resource is not present in the prepared dataset, the page leaves it unmarked instead of placing an approximate icon in an empty area.</p>

          <h2>Orserk, Coralum, and Data Scope</h2>
          <p>Orserk is a Pal reference term in the project’s broader Palworld data, but it is not currently a dedicated location category in this map snapshot. Coralum is also not present as a separate map location layer in the supplied records. These terms may be useful when searching the wider Palworld Guide, but they should not be represented by invented map pins. The map page keeps location data and Pal data separate so that a Pal name is not mistaken for a confirmed resource coordinate.</p>
          <p>For Pal-specific information, use the project’s <Link href="/pals">Pals database</Link> and <Link href="/paldex">PalDex</Link>. For confirmed map resources, use the category list and the quick filters above. This separation protects the accuracy of the interactive map: a keyword can be discussed in the guide without claiming that a matching map location exists. When a future verified location export adds an Orserk or Coralum layer, it can be added as a real category with its own count and icon.</p>

          <h2>How to Use the Palworld Map</h2>
          <p>Begin by choosing a popular shortcut or opening a category group in the left panel. The search field filters the active locations by name, description, or category. Search can be combined with a selected layer, which is useful when a category contains several related records. Click Show all to display every prepared category, or use Clear filters to return to an uncluttered map before starting a new search.</p>
          <p>On desktop, use the mouse wheel over the map to zoom toward the pointer position. Hold the left mouse button and drag to pan. The plus, minus, and home controls remain available for users who prefer buttons. On mobile, use one finger to drag and two fingers to zoom. The map keeps the bottom image and marker canvas in the same coordinate frame, so the markers and click targets move together when the map is zoomed, dragged, or reset.</p>

          <h2>What Is New in the Palworld 1.0 Map?</h2>
          <p>The current map data is the prepared Palworld 1.0 map snapshot used by this project. {mapCoordinateNote} The page uses the supplied high-resolution map assets, category-specific icons, verified location fields, and a separate calibration for the map artwork. The Palpagos Islands and World Tree views use their corresponding image resources, while Palpagos location markers are not incorrectly copied onto the separate World Tree artwork.</p>
          <p>Map coverage will continue to improve as verified records are added. Until then, the page prioritizes transparent data boundaries, stable coordinate rendering, and useful filtering over filling empty areas with guesses. This makes the map suitable for route planning, resource collection, dungeon preparation, and checking a location before returning to the game.</p>
          <p className="map-data-note">Map data endpoint: <code>{mapDataUrl}</code></p>
        </section>
      </div>
      <footer className="map-footer">Independent fan-made resource · Palworld is a trademark of its respective owner.</footer>
    </main>
  );
}
