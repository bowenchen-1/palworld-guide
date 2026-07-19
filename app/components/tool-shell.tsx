import Link from "next/link";
import SiteHeader from "./site-header";
import { createBreadcrumbSchema } from "../lib/seo";
import type { Locale } from "../i18n/zh";

type BreadcrumbItem = { name: string; path: string };

export default function ToolShell({ children, current, breadcrumb, locale = "en" }: { children: React.ReactNode; current: string; breadcrumb?: BreadcrumbItem[]; locale?: Locale }) {
  return (
    <main id="main-content" className="database-page">
      {breadcrumb && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(createBreadcrumbSchema(breadcrumb)) }} />}
      <div className="database-header"><SiteHeader current={current} locale={locale} /></div>
      {children}
      <footer className="database-footer"><span>{locale === "zh" ? "独立玩家资料站 · 当前数据快照：Palworld 1.0。" : "Independent fan resource · Current data snapshot: Palworld 1.0."}</span><Link href={locale === "zh" ? "/zh/" : "/"}>{locale === "zh" ? "返回攻略首页 →" : "Back to Field Guide →"}</Link></footer>
    </main>
  );
}

export function DataNotice({ children }: { children?: React.ReactNode }) {
  return <div className="data-notice"><span>1.0 DATA</span><p>{children ?? "This page uses a community dataset extracted from the Palworld 1.0 game files and cross-checked on July 14, 2026."}</p></div>;
}
