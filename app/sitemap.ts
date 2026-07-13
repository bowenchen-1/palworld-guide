import type { MetadataRoute } from "next";
import { guides } from "./guides/guide-data";
import { pals } from "./lib/game-data";
import { siteUrl } from "./site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-07-14T00:00:00.000Z");

  const corePages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    { url: `${siteUrl}/breeding-calculator`, lastModified, changeFrequency: "weekly", priority: 0.95 },
    { url: `${siteUrl}/paldex`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/palworld-1-0`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/tools`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/guides`, lastModified, changeFrequency: "weekly", priority: 0.85 },
    { url: `${siteUrl}/updates`, lastModified, changeFrequency: "weekly", priority: 0.85 },
  ];

  return [
    ...corePages,
    ...guides.map((guide) => ({
      url: `${siteUrl}/guides/${guide.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...pals.map((pal) => ({
      url: `${siteUrl}/pals/${pal.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: pal.name === "Sekhmet" ? 0.85 : 0.65,
    })),
  ];
}
