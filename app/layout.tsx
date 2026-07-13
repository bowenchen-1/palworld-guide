import type { Metadata } from "next";
import "@fontsource-variable/nunito";
import "@fontsource-variable/baloo-2";
import "./globals.css";

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Palworld Guide — Explore More. Survive Smarter.",
  description: "Clear routes, clever builds, and field-tested strategies for every stage of your Palworld adventure.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "Palworld Guide",
    description: "Explore More. Survive Smarter.",
    type: "website",
    images: [{ url: "/og.png", width: 1734, height: 907, alt: "Palworld Guide — Explore More. Survive Smarter." }],
  },
  twitter: { card: "summary_large_image", title: "Palworld Guide", description: "Explore More. Survive Smarter.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className="antialiased">{children}</body></html>;
}
