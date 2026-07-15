import type { Metadata } from "next";
import { siteUrl } from "../site-config";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  type?: "website" | "article";
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  publishedTime?: string;
  modifiedTime?: string;
};

export function fitMetaTitle(title: string): string {
  const compact = `${title} | Palworld 1.0`;
  const expanded = `${title} | Palworld 1.0 Field Guide`;
  if (compact.length >= 50 && compact.length <= 60) return compact;
  if (expanded.length <= 60) return expanded;
  return compact.length <= 60 ? compact : `${compact.slice(0, 57).trimEnd()}...`;
}

export function fitMetaDescription(description: string): string {
  const expanded = `${description.trim()} Follow this Palworld 1.0 guide for practical steps, checks, and route decisions you can use in your next run.`;
  if (expanded.length <= 160) return expanded;
  return `${expanded.slice(0, 157).trimEnd()}...`;
}

export const absoluteUrl = (path: string) => path === "/" ? siteUrl : `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;

export function createPageMetadata({
  title,
  description,
  path,
  keywords,
  type = "website",
  image = "/og.png",
  imageWidth = 1734,
  imageHeight = 907,
  publishedTime,
  modifiedTime,
}: PageMetadataOptions): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);
  const openGraph: Metadata["openGraph"] = type === "article"
    ? { title, description, url, siteName: "Palworld Guide", locale: "en_US", type: "article", publishedTime, modifiedTime, images: [{ url: imageUrl, width: imageWidth, height: imageHeight, type: "image/png", alt: title }] }
    : { title, description, url, siteName: "Palworld Guide", locale: "en_US", type: "website", images: [{ url: imageUrl, width: imageWidth, height: imageHeight, type: "image/png", alt: title }] };

  return {
    title,
    description,
    robots: { index: true, follow: true },
    keywords,
    alternates: { canonical: url },
    openGraph,
    twitter: { card: "summary_large_image", title, description, images: [imageUrl] },
  };
}

export function createBreadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
