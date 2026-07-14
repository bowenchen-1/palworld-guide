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
