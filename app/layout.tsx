import type { Metadata } from "next";
import Script from "next/script";
import "@fontsource/barlow/400.css";
import "@fontsource/barlow/600.css";
import "@fontsource/barlow/700.css";
import "@fontsource/rajdhani/600.css";
import "@fontsource/rajdhani/700.css";
import "./globals.css";
import "./hardwood-visual.css";
import "./tool-pages.css";
import "./terminal-theme.css";
import "./home-entry.css";
import "./team-builder/team-builder.css";
import "./map/map.css";
import { siteUrl } from "./site-config";
import SiteFooter from "./components/site-footer";

const GA_MEASUREMENT_ID = "G-PS0800S4YQ";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Palworld Guide",
  icons: {
    icon: [{ url: "/icon-48.png", type: "image/png", sizes: "48x48" }],
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><head><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1337366320277479" crossOrigin="anonymous" /></head><body className="antialiased"><a className="skip-link" href="#main-content">Skip to main content</a>{children}<SiteFooter />
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      strategy="afterInteractive"
    />
    <Script id="google-analytics" strategy="afterInteractive">
      {`window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
    </Script>
  </body></html>;
}
