import SiteHeader from "../../components/site-header";
import PaldexClient from "../../paldex/paldex-client";
import { Suspense } from "react";
import type { Metadata } from "next";
import { createBreadcrumbSchema, createPageMetadata } from "../../lib/seo";

export const metadata: Metadata = createPageMetadata({ title: "帕鲁图鉴｜全部帕鲁", description: "浏览299个帕鲁的中文名称、编号、属性、工作适应性和配种数据。", path: "/zh/pals", locale: "zh", keywords: ["帕鲁图鉴", "帕鲁中文名称", "帕鲁属性", "帕鲁配种数据"] });

export default function ChinesePalsPage() {
  const breadcrumb = createBreadcrumbSchema([{ name: "首页", path: "/zh/" }, { name: "帕鲁图鉴", path: "/zh/pals" }]);
  return <main id="main-content" className="database-page"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} /><div className="database-header"><SiteHeader current="/zh/pals" locale="zh" /></div><section className="database-hero paldex-hero compact-paldex-hero"><div><p className="database-eyebrow">找到299个帕鲁</p><h1>帕鲁图鉴</h1><p>中文名称、属性、工作适应性和配种数据查询。</p></div></section><Suspense fallback={<div className="database-workspace paldex-workspace" aria-busy="true" />}><PaldexClient locale="zh" /></Suspense></main>;
}
