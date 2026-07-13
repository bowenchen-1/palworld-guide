import type { Metadata } from "next";
import { Nunito, Baloo_2 } from "next/font/google";
import "./globals.css";

const nunito = Nunito({ variable: "--font-body", subsets: ["latin"] });
const baloo = Baloo_2({ variable: "--font-display", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Polworld Guide — Explore More. Survive Smarter.",
  description: "Clear routes, clever builds, and field-tested strategies for every stage of your Polworld adventure.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "Polworld Guide",
    description: "Explore More. Survive Smarter.",
    type: "website",
    images: [{ url: "/og.png", width: 1734, height: 907, alt: "Polworld Guide — Explore More. Survive Smarter." }],
  },
  twitter: { card: "summary_large_image", title: "Polworld Guide", description: "Explore More. Survive Smarter.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${nunito.variable} ${baloo.variable} antialiased`}>{children}</body></html>;
}
