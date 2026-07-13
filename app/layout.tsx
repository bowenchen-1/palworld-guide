import type { Metadata } from "next";
import "@fontsource-variable/nunito";
import "@fontsource-variable/baloo-2";
import "./globals.css";
import "./tool-pages.css";
import { siteUrl } from "./site-config";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Palworld 1.0 Guides, Tools & Database",
  description: "Explore Palworld 1.0 guides, a current Paldeck database, and a breeding calculator built from community game data for faster, smarter planning in English.",
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "Palworld 1.0 Guides, Tools & Database",
    description: "Current Paldeck data, breeding results, and practical player-researched guides.",
    type: "website",
    images: [{ url: "/og.png", width: 1734, height: 907, alt: "Palworld Guide — Explore More. Survive Smarter." }],
  },
  twitter: { card: "summary_large_image", title: "Palworld 1.0 Guides, Tools & Database", description: "Current Paldeck data, breeding results, and practical player-researched guides.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className="antialiased">{children}</body></html>;
}
