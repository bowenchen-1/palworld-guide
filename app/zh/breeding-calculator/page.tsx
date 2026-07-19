import SiteHeader from "../../components/site-header";
import BreedingClient from "../../breeding-calculator/breeding-client";
import type { Metadata } from "next";
import { createBreadcrumbSchema, createPageMetadata } from "../../lib/seo";

export const metadata: Metadata = createPageMetadata({ title: "帕鲁配种计算器｜父母组合与配种路线", description: "查询帕鲁子代、父母组合与配种路线。", path: "/zh/breeding-calculator", locale: "zh", keywords: ["帕鲁配种计算器", "父母组合", "配种路线"] });

export default function ChineseBreedingPage() {
  const breadcrumb = createBreadcrumbSchema([{ name: "首页", path: "/zh/" }, { name: "配种计算器", path: "/zh/breeding-calculator" }]);
  return <main id="main-content" className="database-page home-calculator-top"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} /><div className="database-header"><SiteHeader current="/zh/breeding-calculator" locale="zh" /></div><section className="database-hero"><div><p className="database-eyebrow">当前版本 1.0 · 配种工具</p><h1>帕鲁配种计算器</h1><p>查询父母组合、子代和配种路线。</p></div></section><BreedingClient locale="zh" /></main>;
}
