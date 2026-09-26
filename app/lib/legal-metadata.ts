import type { Metadata } from "next";
import { absoluteUrl, createPageMetadata } from "./seo";

export function createLegalMetadata(title: string, description: string, path: string): Metadata {
  const canonical = absoluteUrl(path);
  return {
    ...createPageMetadata({ title, description, path, keywords: [title.toLowerCase()] }),
    alternates: {
      canonical,
      languages: { en: canonical, "x-default": canonical },
    },
  };
}
