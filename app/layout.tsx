import type { Metadata } from "next";
import "@fontsource-variable/nunito";
import "@fontsource-variable/baloo-2";
import "./globals.css";
import "./tool-pages.css";
import { siteUrl } from "./site-config";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Palworld Tools, Calculators & Database",
  description: "Use Palworld tools, a current breeding calculator, 289 Pal profiles, and player-researched version 1.0 guides for faster planning in English.",
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "Palworld Tools, Calculators & Database",
    description: "Current Paldeck data, breeding results, and practical player-researched guides.",
    type: "website",
    images: [{ url: "/og.png", width: 1734, height: 907, alt: "Palworld Guide — Explore More. Survive Smarter." }],
  },
  twitter: { card: "summary_large_image", title: "Palworld Tools, Calculators & Database", description: "Current Paldeck data, breeding results, and practical player-researched guides.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className="antialiased">{children}</body></html>;
}
