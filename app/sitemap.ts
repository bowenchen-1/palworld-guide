import type { MetadataRoute } from "next";
import { guides } from "./guides/guide-data";
import { siteUrl } from "./site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-07-14T00:00:00.000Z");

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...guides.map((guide) => ({
      url: `${siteUrl}/guides/${guide.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}

