import SiteHeader from "../components/site-header";
import BreedingClient from "../breeding-calculator/breeding-client";
import ChineseHomeSeoContent from "../components/chinese-home-seo-content";
import type { Metadata } from "next";
import { createBreadcrumbSchema, createPageMetadata } from "../lib/seo";

export const metadata: Metadata = createPageMetadata({ title: "幻兽帕鲁配种计算器｜1.0配种公式查询", description: "使用幻兽帕鲁1.0配种计算器查询帕鲁配种组合。支持父母查子代、目标帕鲁查父母，快速找到幻兽帕鲁配种结果、配种路线和最新配种数据。", path: "/zh/", locale: "zh", keywords: ["帕鲁配种", "幻兽帕鲁配种", "帕鲁1.0配种", "幻兽帕鲁1.0配种", "帕鲁配种计算器", "幻兽帕鲁配种计算器", "帕鲁父母组合查询", "帕鲁配种表", "帕鲁配种路线", "目标帕鲁怎么配", "帕鲁父母查子代", "帕鲁子代查父母", "帕鲁配种结果"] });

export default function ChineseHome() {
  const breadcrumb = createBreadcrumbSchema([{ name: "首页", path: "/zh/" }, { name: "帕鲁配种计算器", path: "/zh/" }]);
  return <main id="main-content" className="min-h-screen bg-canvas text-foreground"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} /><section className="home-calculator-top px-5 pb-12 sm:px-8 lg:px-12"><div className="mx-auto max-w-[1320px]"><SiteHeader locale="zh" floating /><div className="home-calculator-intro"><div><p className="terminal-kicker"><span /> 数据研究 // 当前版本 1.0</p><h1>幻兽帕鲁1.0配种计算器</h1><p>使用幻兽帕鲁1.0配种计算器，快速查询帕鲁配种组合。你可以选择两个父母查看子代，也可以选择目标帕鲁反向查询父母组合，还可以根据已有帕鲁规划配种路线。</p></div></div><BreedingClient embedded locale="zh" /></div></section><ChineseHomeSeoContent /></main>;
}
