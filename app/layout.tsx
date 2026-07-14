import type { Metadata } from "next";
import "@fontsource-variable/nunito";
import "@fontsource-variable/baloo-2";
import "./globals.css";
import "./tool-pages.css";
import { siteUrl } from "./site-config";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Palworld Breeding Calculator - Updated 1.0 Pal Combos",
  description: "Use the Palworld breeding calculator for version 1.0 to find offspring from two parents or discover every combination for a target Pal. Start planning now.",
  keywords: ["palworld breeding calculator"],
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Palworld Breeding Calculator — Updated for 1.0",
    description: "Choose two parent Pals to find their offspring, or search current parent combinations for the Pal you want to hatch.",
    type: "website",
    images: [{ url: "/og.png", width: 1734, height: 907, alt: "Palworld Guide — Explore More. Survive Smarter." }],
  },
  twitter: { card: "summary_large_image", title: "Palworld Breeding Calculator — Updated for 1.0", description: "Choose two parent Pals to find their offspring or search current combinations for a target Pal.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className="antialiased">{children}</body></html>;
}
