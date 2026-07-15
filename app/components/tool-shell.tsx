import Link from "next/link";
import SiteHeader from "./site-header";
import { createBreadcrumbSchema } from "../lib/seo";

type BreadcrumbItem = { name: string; path: string };

export default function ToolShell({ children, current, breadcrumb }: { children: React.ReactNode; current: string; breadcrumb?: BreadcrumbItem[] }) {
  return (
    <main id="main-content" className="database-page">
      {breadcrumb && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(createBreadcrumbSchema(breadcrumb)) }} />}
      <div className="database-header"><SiteHeader current={current} /></div>
      {children}
      <footer className="database-footer"><span>Independent fan resource · Current data snapshot: Palworld 1.0.</span><Link href="/">Back to Field Guide →</Link></footer>
    </main>
  );
}

export function DataNotice({ children }: { children?: React.ReactNode }) {
  return <div className="data-notice"><span>1.0 DATA</span><p>{children ?? "This page uses a community dataset extracted from the Palworld 1.0 game files and cross-checked on July 14, 2026."}</p></div>;
}
