import SiteHeader from "../../components/site-header";
import Link from "next/link";
import PaldexClient from "../../paldex/paldex-client";
import { Suspense } from "react";
import type { Metadata } from "next";
import { createBreadcrumbSchema, createPageMetadata } from "../../lib/seo";
import { palCounts } from "../../lib/game-data";
import { siteUrl } from "../../site-config";

export const metadata: Metadata = createPageMetadata({
  title: "幻兽帕鲁图鉴｜全帕鲁属性技能资料查询",
  description: "幻兽帕鲁图鉴收录299只帕鲁资料，查询属性、工作适应性、伙伴技能、掉落物、捕获位置、配种数据和1.0新增帕鲁。支持名称、编号、属性与工作技能筛选。",
  path: "/zh/pals",
  locale: "zh",
  keywords: ["幻兽帕鲁图鉴", "帕鲁属性", "帕鲁伙伴技能", "帕鲁掉落物", "帕鲁捕获位置", "帕鲁配种", "1.0新增帕鲁"],
});

export default function ChinesePalsPage() {
  const breadcrumb = createBreadcrumbSchema([{ name: "首页", path: "/zh/" }, { name: "帕鲁图鉴", path: "/zh/pals" }]);
  const collectionSchema = { "@context": "https://schema.org", "@type": "CollectionPage", name: "幻兽帕鲁图鉴｜全帕鲁属性技能资料查询", url: `${siteUrl}/zh/pals`, description: "幻兽帕鲁图鉴收录299只帕鲁资料，查询属性、工作适应性、伙伴技能、掉落物、捕获位置、配种数据和1.0新增帕鲁。", numberOfItems: palCounts.pals, inLanguage: "zh-CN" };
  return <main id="main-content" className="database-page zh-paldex-page"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} /><div className="database-header"><SiteHeader current="/zh/pals" locale="zh" /></div><section className="database-hero paldex-hero compact-paldex-hero"><div><p className="database-eyebrow">找到{palCounts.pals}个帕鲁</p><h1>幻兽帕鲁图鉴：全帕鲁属性、技能、位置与掉落资料</h1><p>幻兽帕鲁图鉴收录当前版本的299只帕鲁资料，包括属性、工作适应性、伙伴技能、掉落物、捕获位置、配种数据和1.0新增帕鲁。你可以按名称、编号、属性或工作适应性搜索和筛选帕鲁，并进入详情页查看完整信息。</p></div></section><Suspense fallback={<div className="database-workspace paldex-workspace" aria-busy="true" />}><PaldexClient locale="zh" /></Suspense><section className="database-seo-copy"><div><h2>全部幻兽帕鲁资料</h2><p>幻兽帕鲁图鉴提供当前版本的完整 Palworld 帕鲁资料。每个条目包含帕鲁编号、属性、工作适应性、伙伴技能、基础数据和配种相关信息。你可以使用搜索框快速查找某个帕鲁，也可以通过属性和工作适应性筛选符合条件的帕鲁。</p><p>帕鲁名称会以中文名称为主，并保留英文名称作为搜索和核对信息。编号、属性、技能数值和配种数据沿用当前资料，不会因为页面语言切换而改变。</p><h2>帕鲁属性与工作适应性</h2><p>不同帕鲁拥有不同的属性和工作适应性。使用属性筛选可以查找火、水、草、雷、冰、地、暗、龙或无属性帕鲁；使用工作适应性筛选可以查看适合生火、浇水、播种、发电、手工作业、采集、伐木、采矿、制药、冷却、搬运和牧场工作的帕鲁。</p><p>当你同时选择多个属性或工作类型时，可以根据筛选器提供的匹配方式缩小结果范围。工作等级筛选适合快速寻找更适合据点分工的帕鲁，但实际效率还会受到技能、凝聚和据点环境影响。</p><h2>Palworld 1.0 新增帕鲁</h2><p>本图鉴包含 Palworld 1.0 版本中的新增帕鲁和新增变体。点击“1.0 新增”筛选，可以只查看当前版本新增的帕鲁条目，再进入详情页查看它们的属性、伙伴技能和配种数据。</p><p>新增变体会按照自己的编号、图片和数据单独列出，方便你区分同一基础帕鲁的不同版本。清除筛选后即可回到完整的299条帕鲁记录。</p><h2>帕鲁掉落物与捕获位置</h2><p>进入任意帕鲁详情页，可以查看该帕鲁的掉落物、数量或概率信息，以及已整理的捕获位置和等级范围。地点数据应与当前版本资料保持一致；如果某个帕鲁暂时没有可靠的位置数据，不要编造地点。</p><p>详情页还会保留掉落物图标、条件和地点的英文名称，便于与游戏内文本或其他资料进行核对。掉落物和位置资料用于查询和规划，不代表每次探索都一定会获得相同数量。</p><h2>帕鲁配种数据</h2><p>帕鲁详情入口会关联配种相关查询，帮助你进入配种计算器，查询目标帕鲁的父母组合、可生成的子代或配种路线。配种结果以当前 Palworld 1.0 配种数据为准。你也可以<Link href="/zh/">进入帕鲁配种计算器</Link>。</p><p>如果你已经知道目标帕鲁，可以直接从详情页进入父母组合查询；如果还在比较候选帕鲁，则可以先用属性、工作适应性或配种力筛选，再决定下一步路线。</p><h2>如何使用幻兽帕鲁图鉴</h2><ol><li>输入帕鲁名称或 Paldeck 编号搜索。</li><li>使用属性筛选查找指定属性的帕鲁。</li><li>使用工作适应性筛选查找适合基地工作的帕鲁。</li><li>使用“1.0 新增”查看当前版本新增条目。</li><li>点击帕鲁名称或图片进入对应的中文详情页。</li><li>在详情页查看技能、基础资料、掉落物、捕获位置和配种信息。</li></ol><p>搜索、筛选和分页状态会同步到 URL，刷新页面或分享查询链接时可以恢复当前结果。需要重新开始时，使用清除筛选即可回到完整帕鲁列表。</p></div></section></main>;
}
