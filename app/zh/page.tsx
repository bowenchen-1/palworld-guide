import Link from "next/link";
import SiteHeader from "../components/site-header";
import BreedingClient from "../breeding-calculator/breeding-client";
import type { Metadata } from "next";
import { createBreadcrumbSchema, createPageMetadata } from "../lib/seo";

export const metadata: Metadata = createPageMetadata({ title: "帕鲁配种计算器", description: "查询帕鲁子代、父母组合，并根据已有帕鲁规划配种路线。", path: "/zh/", locale: "zh", keywords: ["帕鲁配种", "配种计算器", "帕鲁父母组合"] });

export default function ChineseHome() {
  const breadcrumb = createBreadcrumbSchema([{ name: "首页", path: "/zh/" }, { name: "帕鲁配种计算器", path: "/zh/" }]);
  return <main id="main-content" className="min-h-screen bg-canvas text-foreground"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} /><section className="home-calculator-top px-5 pb-12 sm:px-8 lg:px-12"><div className="mx-auto max-w-[1320px]"><SiteHeader locale="zh" floating /><div className="home-calculator-intro"><div><p className="terminal-kicker"><span /> 数据研究 // 当前版本 1.0</p><h1>帕鲁配种计算器</h1><p>查询子代、父母组合，并根据已有帕鲁规划配种路线。</p></div></div><BreedingClient embedded locale="zh" /></div></section><section className="database-seo-copy"><div><h2>帕鲁配种工具</h2><p>选择两个父母查询子代，也可以从目标帕鲁反向查找父母组合。配种数据与路线计算沿用现有游戏数据。</p><p><Link href="/zh/pals">浏览帕鲁图鉴 →</Link></p></div></section></main>;
}
