import type { Metadata } from "next";
import "@fontsource-variable/nunito";
import "@fontsource-variable/baloo-2";
import "./globals.css";
import "./tool-pages.css";
import { siteUrl } from "./site-config";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Palworld 1.0 Release Date — Launch Guide",
  description: "The Palworld 1.0 release date was July 10, 2026. Check the launch status and use current Palworld tools, Paldeck data, and version 1.0 guides.",
  keywords: ["palworld 1.0 release date"],
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "Palworld 1.0 Release Date — Launch Guide",
    description: "Palworld 1.0 launched July 10, 2026. Check the date and use current tools, data, and guides.",
    type: "website",
    images: [{ url: "/og.png", width: 1734, height: 907, alt: "Palworld Guide — Explore More. Survive Smarter." }],
  },
  twitter: { card: "summary_large_image", title: "Palworld 1.0 Release Date — Launch Guide", description: "Palworld 1.0 launched July 10, 2026. Check the date and use current tools, data, and guides.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className="antialiased">{children}</body></html>;
}
