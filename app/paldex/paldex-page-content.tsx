import ToolShell from "../components/tool-shell";
import { Suspense } from "react";
import { siteUrl } from "../site-config";
import { palCounts } from "../lib/game-data";
import PaldexClient from "./paldex-client";
import type { Locale } from "../i18n/zh";
import { ElementIcon, WorkSuitabilityIcon } from "../components/pal-icons";

export default function PaldexPageContent({ initialPage = 1, locale = "en" }: { initialPage?: number; locale?: Locale }) {
  const isZh = locale === "zh";
  const isMainPage = initialPage === 1;
  const pageSuffix = initialPage > 1 ? ` — Page ${initialPage}` : "";
  const pagePath = initialPage > 1 ? `/pals/page/${initialPage}` : "/pals";
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: isZh ? "Palworld 帕鲁图鉴｜全部 299 个帕鲁" : (isMainPage ? "All 299 Palworld Pals — Complete Pal List" : `Palworld Paldeck Database${pageSuffix}`),
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
    <section className="database-seo-copy paldex-seo-copy"><div><h2>完整帕鲁列表（共 299 个）</h2><p>这里收录当前版本的 {palCounts.pals} 个帕鲁。表格会显示英文名称、Paldeck 编号、属性、工作适应性、伙伴技能、稀有度、生命值、配种力、防御、价格、耐力、骑乘速度和奔跑速度。点击帕鲁名称可以查看详情，也可以继续进入配种计算器。</p><p>帕鲁名称保留游戏数据中的英文写法，英文搜索也能直接找到对应记录；编号、技能数值、属性数据和配种数据均保持原始值不变。</p><h2>按属性和工作适应性筛选</h2><p>使用属性筛选查找 Neutral、Fire、Water、Grass、Electric、Ice、Ground、Dark 或 Dragon 帕鲁；使用工作适应性筛选缩小基地工作范围，并可设置最低工作等级。筛选、排序和分页状态会保留在 URL 中，刷新或分享链接后仍可恢复。</p><h2>Palworld 1.0 新增帕鲁</h2><p>开启“1.0 新增”可以查看本版本加入的 {palCounts.newIn1_0} 条记录，其中包含新增帕鲁与新增变体。每条变体都有独立编号、图片和详情页，不会重复计数。</p><h2>常见问题</h2><details open><summary>可以搜索英文 Pal 名称吗？</summary><p>可以。中文页面使用自然中文界面，但帕鲁名称保留英文数据，搜索英文名称或 Paldeck 编号都能定位记录。</p></details><details><summary>如何从图鉴查找父母组合？</summary><p>点击列表中的“查找父母”，即可跳转到中文配种计算器的目标帕鲁模式。</p></details></div></section>
  </ToolShell>;
  return <ToolShell current={isZh ? "/zh/pals" : "/pals"} locale={locale} breadcrumb={[{ name: isZh ? "首页" : "Home", path: `${base}/` }, { name: isZh ? "帕鲁图鉴" : "Pals", path: `${base}/pals` }]}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <section className="database-hero paldex-hero compact-paldex-hero"><div><p className="database-eyebrow">{palCounts.pals} {isZh ? "个当前帕鲁" : "current Pals"}{initialPage > 1 ? ` · ${isZh ? "第" : "page"} ${initialPage}` : ""}</p><h1>{isZh ? "Palworld 帕鲁图鉴：全部帕鲁" : (isMainPage ? "All Palworld Pals: Complete Pal List" : "Palworld Pals Database")}</h1><p>{isZh ? "按名称、Paldeck 编号、属性、工作适应性和配种数据浏览全部帕鲁。" : "Browse all Palworld Pals by name, Paldeck number, element, work suitability, and breeding data."}</p></div></section>
    <Suspense fallback={<div className="database-workspace paldex-workspace" aria-busy="true" />}><PaldexClient initialPage={initialPage} locale={locale} /></Suspense>
    {isMainPage ? <section className="database-seo-copy paldex-seo-copy"><div>
      <h2><span className="paldex-copy-heading-icon"><ElementIcon element="Neutral" /></span>Complete Pal List (All 299 Pals)</h2>
      <p>This complete pal list contains {palCounts.pals} current Palworld Pals in one searchable database. Each server-rendered row includes the English name, Paldeck number, Pal elements, work suitability, partner skill, rarity, HP, Breeding Power, Defense, Price, Stamina, Riding Speed, and Run Speed. Select a Pal name to open its profile or continue into the Palworld breeding calculator.</p>
      <p>Real text values remain in the table for indexing while images load. Missing values use a clear dash instead of an invented number, and the shared catalog keeps search, filters, pagination, and profile links aligned at 299 Pals.</p>

      <h2><span className="paldex-copy-heading-icon"><ElementIcon element="Fire" /><WorkSuitabilityIcon work="collection" /></span>Pals by Element and Work Suitability</h2>
      <p>Use the Pal elements filter to find Neutral, Fire, Water, Grass, Electric, Ice, Ground, Dark, or Dragon Pals. Select one element or combine several choices with the existing match rules. Work suitability covers Kindling, Watering, Planting, Gathering, Mining, Lumbering, Handiwork, Cooling, Electricity, Medicine, Transporting, and Farming. Where available, choose a minimum work level. These controls work together to narrow all Palworld Pals without losing table rows or detail links.</p>

      <h2><span className="paldex-copy-heading-icon"><ElementIcon element="Ice" /></span>New Pals and Variants in Palworld 1.0</h2>
      <p>The New in 1.0 filter highlights {palCounts.newIn1_0} records from the Palworld 1.0 update inside the same {palCounts.pals}-Pal catalog. That total includes {palCounts.newPals} entirely new Pals and {palCounts.newVariants} newly added variants. A variant remains its own record, image, number, and profile, so it is not counted twice. Turn the filter on to review additions, then clear it to return to the complete pal list.</p>

      <h2><span className="paldex-copy-heading-icon"><WorkSuitabilityIcon work="handcraft" /></span>How to Use This Pal List</h2>
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

      <h2><span className="paldex-copy-heading-icon"><ElementIcon element="Water" /></span>Reading the Pal Database</h2>
      <p>The table is designed for quick comparison rather than a single “best” answer. The Pal column keeps the name, image, and Paldeck number together so you can confirm that you are comparing the exact record you intended. Element icons show a Pal’s current elemental typing, including dual-element combinations. Work Suitability icons show the base roles recorded for that Pal and place the work level directly beside each icon. This compact format lets you scan a full row without opening every profile.</p>
      <p>Every row links to a dedicated Pal profile. The profile is the place to read the longer partner skill explanation, inspect movement and combat values, review drops and recorded locations, and follow the Find Parents entry when you want to use the Palworld breeding calculator. The list remains useful when you already know the answer you need: search by name or number, compare a few columns, and open only the profiles that require more detail.</p>

      <h2><span className="paldex-copy-heading-icon"><ElementIcon element="Electric" /></span>Understanding Pal Stats and Breeding Data</h2>
      <p>HP and Defense provide a quick view of a Pal’s recorded defensive baseline. Rarity helps separate common entries from less frequently encountered records, while Breeding Power is shown as a database value used by the breeding calculator. Breeding Power is not a combat tier, a catch difficulty rating, or a recommendation score. It should be read together with the rest of the profile and used for breeding calculations, not as a shortcut for choosing a fighter.</p>
      <p>The table also keeps useful comparison fields in one place: partner skill, HP, Defense, and Breeding Power are visible without opening a second tool. Values that are not recorded are shown as a dash instead of a guessed zero. This matters when comparing variants or newly added records, because an empty field should not be mistaken for a low statistic. If you need Price, Stamina, Riding Speed, or Run Speed, open the Pal profile where those movement and economy fields remain available.</p>

      <h2><span className="paldex-copy-heading-icon"><WorkSuitabilityIcon work="collection" /></span>Choosing Work Suitability for a Base</h2>
      <p>Work Suitability is most useful when you start with a base task instead of a Pal name. Use the work filter to find Pals that can perform Kindling, Watering, Planting, Gathering, Mining, Lumbering, Handiwork, Cooling, Electricity, Medicine, Transporting, or Farming. When several work types are selected, the match controls let you decide whether a Pal must satisfy every selected role or only one of them. A minimum level can narrow the results further when a level-one worker is not enough for your setup.</p>
      <p>Work levels describe suitability for a listed base role; they do not guarantee a particular production rate in every situation. The icons are intentionally compact, but each one can be focused or opened for a short explanation. On a phone, tap the work item to read the same information without relying on hover. This makes the list practical for planning a small starter base as well as comparing specialized workers for a larger production line.</p>

      <h2><span className="paldex-copy-heading-icon"><ElementIcon element="Dark" /></span>Partner Skills in Context</h2>
      <p>A Partner Skill is a Pal-specific effect that can influence how that Pal supports the player or the party. The list keeps the skill name visible beside its icon, while hover or keyboard focus reveals the recorded description. Touch users can tap the same item to open the detail panel. Reading the description is important because similarly named skills can have different conditions, percentages, or stacking rules.</p>
      <p>Partner Skills should be evaluated alongside the Pal’s elements, work roles, and stats. A skill that helps carrying, gliding, gathering, or combat may be valuable in one activity and less relevant in another. The database does not turn these descriptions into an invented ranking. Instead, it gives you the underlying record so you can decide which Pal fits your party, base, or current objective.</p>

      <h2><span className="paldex-copy-heading-icon"><ElementIcon element="Grass" /></span>Drops and Recorded Locations</h2>
      <p>Where the data includes drops, the table shows compact item icons and quantities. Select or focus an item to read its name and any recorded quantity, chance, or condition. If there are more items than fit in the compact row, use the “more” control to expand the complete recorded list. The associated profile provides a larger Drops section for reading several items comfortably.</p>
      <p>Locations are displayed as recorded text rather than as a promise of complete map coverage. A location entry may include a level range or note when that information exists in the project data. Long entries are shortened in the table so they do not push important columns off screen; focus, tap, or open the profile to inspect the full text. An absent entry means that this database currently has no location record for that Pal, not that the Pal has no possible encounter location in the game.</p>

      <h2><span className="paldex-copy-heading-icon"><ElementIcon element="Dragon" /></span>Using the List with the Palworld Breeding Calculator</h2>
      <p>The Pals list and the Palworld breeding calculator serve different jobs. Use this page to identify a Pal from its name, number, element, work role, or profile data. When you want parent combinations, use Find Parents in the last column or the matching action on the Pal profile. That link returns to the calculator with the selected Pal passed through the existing target protocol, so the calculator can keep its normal Target and Parents workflow.</p>
      <p>Changing a filter does not change the underlying catalog. The URL keeps the search, element, work, New in 1.0, sort, and page state so a result can be refreshed or shared. Clear the filters to return to all 299 records. If you are comparing a small group, a selected-Pals URL can show only the valid records you passed in while keeping their ordinary profile links intact.</p>

      <h2><span className="paldex-copy-heading-icon"><WorkSuitabilityIcon work="transport" /></span>Frequently Asked Questions</h2>
      <details open><summary>How many Palworld Pals are in this list?</summary><p>The current catalog contains 299 Pal records. The New in 1.0 filter is a subset of that same catalog: 72 records made up of 47 entirely new Pals and 25 added variants. Variants have their own numbers, images, and profile records, but they are not added a second time to the total.</p></details>
      <details><summary>Can I search by Paldeck number?</summary><p>Yes. Enter an English Pal name or Paldeck number in the search field. Number searches are useful when a variant has a similar name to another record, because the Paldeck number confirms which entry you want before you open its profile.</p></details>
      <details><summary>What does a dash mean in the table?</summary><p>A dash means the field is not recorded for that Pal in the current data. It is not a score of zero and it is not a claim that the value does not exist in the game. Open the profile for the complete set of fields that are available for that record.</p></details>
      <details><summary>How do I find a Pal for a base job?</summary><p>Open Work Suitability, select one or more work types, choose Match any or Match all when multiple roles are selected, and set a minimum level if needed. The result count updates with the filters, and each row keeps the work icons and levels visible for comparison.</p></details>
      <details><summary>Where can I read a Partner Skill description?</summary><p>Hover over or keyboard-focus the Partner Skill in the table on desktop. On touch devices, tap the skill item. The detail profile also contains the partner skill name and its recorded explanation, together with the Pal’s other profile fields.</p></details>
    </div></section> : <section className="database-seo-copy paldex-seo-copy"><div><p className="database-eyebrow">Current, not mixed</p><h2>A Palworld database built for 1.0</h2><p>This database contains {palCounts.pals} current Palworld Pals. Open any result for its elements, work suitability, partner skill, combat and movement stats, breeding power, and other profile data.</p><p>Use the element and work-suitability icons to narrow the list, then turn on <strong>New in 1.0</strong> to find the {palCounts.newIn1_0} additions: {palCounts.newPals} entirely new Pals and {palCounts.newVariants} new variants.</p></div><aside><h2>How to use this Paldeck</h2><details open><summary>Search and filter</summary><p>Search by English name or Paldeck number, or combine element and work-suitability filters to compare practical choices.</p></details><details><summary>New in 1.0</summary><p>The New filter keeps the catalog at {palCounts.pals} total Pals while showing the {palCounts.newIn1_0} records introduced in Palworld 1.0.</p></details></aside></section>}
  </ToolShell>;
}
