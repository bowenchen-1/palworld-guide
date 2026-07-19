import ToolShell from "../components/tool-shell";
import { Suspense } from "react";
import { siteUrl } from "../site-config";
import { palCounts } from "../lib/game-data";
import PaldexClient from "./paldex-client";
import type { Locale } from "../i18n/zh";

export default function PaldexPageContent({ initialPage = 1, locale = "en" }: { initialPage?: number; locale?: Locale }) {
  const isZh = locale === "zh";
  const isMainPage = initialPage === 1;
  const pageSuffix = initialPage > 1 ? ` — Page ${initialPage}` : "";
  const pagePath = initialPage > 1 ? `/pals/page/${initialPage}` : "/pals";
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: isZh ? "Palworld 帕鲁图鉴｜全部 299 个帕鲁" : (isMainPage ? "Palworld Pals - Complete Pal List (All 299 Pals)" : `Palworld Paldeck Database${pageSuffix}`),
    url: `${siteUrl}${isZh ? `/zh${pagePath === "/pals" ? "/pals" : pagePath}` : pagePath}`,
    description: isZh ? "浏览全部 299 个帕鲁，按属性、工作适应性、伙伴技能和配种数据搜索与筛选。" : (isMainPage ? "Browse all 299 Palworld Pals in our complete pal list. Filter by element, work suitability, partner skill, stats, and breeding data to find any Pal quickly." : "Browse all 299 Palworld Pals with detailed profiles, elements, work suitability, breeding data, filters, and 72 new Pals and variants from Palworld 1.0."),
    numberOfItems: palCounts.pals,
    isPartOf: initialPage > 1 ? { "@type": "CollectionPage", name: "Palworld Pals Database", url: `${siteUrl}/pals` } : undefined,
  };

  const base = isZh ? "/zh" : "";
  if (isZh) return <ToolShell current="/zh/pals" locale="zh" breadcrumb={[{ name: "首页", path: "/zh/" }, { name: "帕鲁图鉴", path: "/zh/pals" }]}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <section className="database-hero paldex-hero compact-paldex-hero"><div><p className="database-eyebrow">{palCounts.pals} 个当前帕鲁</p><h1>Palworld 帕鲁图鉴：全部帕鲁</h1><p>按名称、Paldeck 编号、属性、工作适应性和配种数据浏览全部帕鲁。</p></div></section>
    <Suspense fallback={<div className="database-workspace paldex-workspace" aria-busy="true" />}><PaldexClient initialPage={initialPage} locale="zh" /></Suspense>
    <section className="database-seo-copy"><div><h2>完整帕鲁列表（共 299 个）</h2><p>这里收录当前版本的 {palCounts.pals} 个帕鲁。表格会显示英文名称、Paldeck 编号、属性、工作适应性、伙伴技能、稀有度、生命值、配种力、防御、价格、耐力、骑乘速度和奔跑速度。点击帕鲁名称可以查看详情，也可以继续进入配种计算器。</p><p>帕鲁名称保留游戏数据中的英文写法，英文搜索也能直接找到对应记录；编号、技能数值、属性数据和配种数据均保持原始值不变。</p><h2>按属性和工作适应性筛选</h2><p>使用属性筛选查找 Neutral、Fire、Water、Grass、Electric、Ice、Ground、Dark 或 Dragon 帕鲁；使用工作适应性筛选缩小基地工作范围，并可设置最低工作等级。筛选、排序和分页状态会保留在 URL 中，刷新或分享链接后仍可恢复。</p><h2>Palworld 1.0 新增帕鲁</h2><p>开启“1.0 新增”可以查看本版本加入的 {palCounts.newIn1_0} 条记录，其中包含新增帕鲁与新增变体。每条变体都有独立编号、图片和详情页，不会重复计数。</p><h2>常见问题</h2><details open><summary>可以搜索英文 Pal 名称吗？</summary><p>可以。中文页面使用自然中文界面，但帕鲁名称保留英文数据，搜索英文名称或 Paldeck 编号都能定位记录。</p></details><details><summary>如何从图鉴查找父母组合？</summary><p>点击列表中的“查找父母”，即可跳转到中文配种计算器的目标帕鲁模式。</p></details></div></section>
  </ToolShell>;
  return <ToolShell current={isZh ? "/zh/pals" : "/pals"} locale={locale} breadcrumb={[{ name: isZh ? "首页" : "Home", path: `${base}/` }, { name: isZh ? "帕鲁图鉴" : "Pals", path: `${base}/pals` }]}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <section className="database-hero paldex-hero compact-paldex-hero"><div><p className="database-eyebrow">{palCounts.pals} {isZh ? "个当前帕鲁" : "current Pals"}{initialPage > 1 ? ` · ${isZh ? "第" : "page"} ${initialPage}` : ""}</p><h1>{isZh ? "Palworld 帕鲁图鉴：全部帕鲁" : (isMainPage ? "All Palworld Pals: Complete Pal List" : "Palworld Pals Database")}</h1><p>{isZh ? "按名称、Paldeck 编号、属性、工作适应性和配种数据浏览全部帕鲁。" : "Browse all Palworld Pals by name, Paldeck number, element, work suitability, and breeding data."}</p></div></section>
    <Suspense fallback={<div className="database-workspace paldex-workspace" aria-busy="true" />}><PaldexClient initialPage={initialPage} locale={locale} /></Suspense>
    {isMainPage ? <section className="database-seo-copy"><div>
      <h2>Complete Pal List (All 299 Pals)</h2>
      <p>This complete pal list contains {palCounts.pals} current Palworld Pals in one searchable database. Each server-rendered row includes the English name, Paldeck number, Pal elements, work suitability, partner skill, rarity, HP, Breeding Power, Defense, Price, Stamina, Riding Speed, and Run Speed. Select a Pal name to open its profile or continue into the Palworld breeding calculator.</p>
      <p>Real text values remain in the table for indexing while images load. Missing values use a clear dash instead of an invented number, and the shared catalog keeps search, filters, pagination, and profile links aligned at 299 Pals.</p>

      <h2>Pals by Element and Work Suitability</h2>
      <p>Use the Pal elements filter to find Neutral, Fire, Water, Grass, Electric, Ice, Ground, Dark, or Dragon Pals. Select one element or combine several choices with the existing match rules. Work suitability covers Kindling, Watering, Planting, Gathering, Mining, Lumbering, Handiwork, Cooling, Electricity, Medicine, Transporting, and Farming. Where available, choose a minimum work level. These controls work together to narrow all Palworld Pals without losing table rows or detail links.</p>

      <h2>New Pals and Variants in Palworld 1.0</h2>
      <p>The New in 1.0 filter highlights {palCounts.newIn1_0} records from the Palworld 1.0 update inside the same {palCounts.pals}-Pal catalog. That total includes {palCounts.newPals} entirely new Pals and {palCounts.newVariants} newly added variants. A variant remains its own record, image, number, and profile, so it is not counted twice. Turn the filter on to review additions, then clear it to return to the complete pal list.</p>

      <h2>How to Use This Pal List</h2>
      <p>Start with the search field and use the controls in the order that suits your question:</p>
      <ol>
        <li>Search by an English Pal name or Paldeck number to jump directly to a known record.</li>
        <li>Choose one or more Pal elements to compare elemental groups.</li>
        <li>Choose work suitability and, when useful, a minimum work level to narrow base roles.</li>
        <li>Click New in 1.0 to show the 72 update records, including both new Pals and variants.</li>
        <li>Use the sortable table values to compare partner skills, Pal stats, movement values, rarity, and breeding data.</li>
        <li>Open any Pal row for its profile, then use the available breeding calculator entry when you want to explore parent combinations.</li>
      </ol>
      <p>Search, filtering, sorting, and pagination preserve their URL state for refreshes and sharing. This page indexes current Pal records and profile data; it does not claim to cover Pal locations or capture areas.</p>
    </div></section> : <section className="database-seo-copy"><div><p className="database-eyebrow">Current, not mixed</p><h2>A Palworld database built for 1.0</h2><p>This database contains {palCounts.pals} current Palworld Pals. Open any result for its elements, work suitability, partner skill, combat and movement stats, breeding power, and other profile data.</p><p>Use the element and work-suitability icons to narrow the list, then turn on <strong>New in 1.0</strong> to find the {palCounts.newIn1_0} additions: {palCounts.newPals} entirely new Pals and {palCounts.newVariants} new variants.</p></div><aside><h2>How to use this Paldeck</h2><details open><summary>Search and filter</summary><p>Search by English name or Paldeck number, or combine element and work-suitability filters to compare practical choices.</p></details><details><summary>New in 1.0</summary><p>The New filter keeps the catalog at {palCounts.pals} total Pals while showing the {palCounts.newIn1_0} records introduced in Palworld 1.0.</p></details></aside></section>}
  </ToolShell>;
}
