import type { MetadataRoute } from "next";
import { guides } from "./guides/guide-data";
import { catalogPals } from "./lib/game-data";
import { PALDEX_PAGE_SIZE } from "./paldex/paldex-config";
import { siteUrl } from "./site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-07-14T00:00:00.000Z");
  const paldexPageCount = Math.ceil(catalogPals.length / PALDEX_PAGE_SIZE);

  const corePages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    { url: `${siteUrl}/pals`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/zh/`, lastModified, changeFrequency: "weekly", priority: 0.95 },
    { url: `${siteUrl}/zh/breeding-calculator`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/zh/pals`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/palworld-1-0`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/tools`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/team-builder`, lastModified, changeFrequency: "weekly", priority: 0.85 },
    { url: `${siteUrl}/guides`, lastModified, changeFrequency: "weekly", priority: 0.85 },
    { url: `${siteUrl}/updates`, lastModified, changeFrequency: "weekly", priority: 0.85 },
    { url: `${siteUrl}/items/hardwood`, lastModified, changeFrequency: "monthly", priority: 0.8 },
  ];

  return [
    ...corePages,
    ...Array.from({ length: paldexPageCount - 1 }, (_, index) => ({
      url: `${siteUrl}/pals/page/${index + 2}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
    ...guides.map((guide) => ({
      url: `${siteUrl}/guides/${guide.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...catalogPals.map((pal) => ({
      url: `${siteUrl}/pals/${pal.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: pal.name === "Sekhmet" ? 0.85 : 0.65,
    })),
    ...catalogPals.map((pal) => ({
      url: `${siteUrl}/zh/pals/${pal.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
