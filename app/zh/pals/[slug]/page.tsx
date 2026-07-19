import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PalMark from "../../../components/pal-mark";
import { ElementIcon, PartnerSkillIcon, WorkSuitabilityIcon } from "../../../components/pal-icons";
import SiteHeader from "../../../components/site-header";
import { catalogPals, findPal, WorkKey, workLabels } from "../../../lib/game-data";
import { getPalNameZh } from "../../../lib/pal-names-zh";
import { createBreadcrumbSchema, createPageMetadata } from "../../../lib/seo";
import { siteUrl } from "../../../site-config";

type Props = { params: Promise<{ slug: string }> };

const workLabelsZh: Partial<Record<WorkKey, string>> = { emitflame: "生火", watering: "浇水", seeding: "播种", collection: "采集", mining: "采矿", deforest: "伐木", handcraft: "手工作业", cool: "冷却", generateelectricity: "发电", productmedicine: "制药", transport: "搬运", monsterfarm: "牧场" };

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return catalogPals.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pal = findPal((await params).slug);
  if (!pal) return {};
  const nameZh = getPalNameZh(pal.name) ?? pal.name;
  return createPageMetadata({ title: `${nameZh}｜帕鲁图鉴`, description: `查看${nameZh}的编号、属性、工作适应性、伙伴技能和配种力数据，并查询相关父母组合。`, path: `/zh/pals/${pal.slug}`, locale: "zh", keywords: [nameZh, pal.name, "帕鲁图鉴", "帕鲁配种"] });
}

export default async function ChinesePalProfilePage({ params }: Props) {
  const pal = findPal((await params).slug);
  if (!pal) notFound();
  const nameZh = getPalNameZh(pal.name) ?? pal.name;
  const workEntries = Object.entries(pal.work) as [WorkKey, number][];
  const strongest = [...workEntries].sort((a, b) => b[1] - a[1])[0];
  const schema = { "@context": "https://schema.org", "@type": "WebPage", name: `${nameZh}｜帕鲁图鉴`, url: `${siteUrl}/zh/pals/${pal.slug}`, description: `${nameZh}的帕鲁编号、属性、工作适应性、伙伴技能和配种数据。`, isPartOf: { "@type": "CollectionPage", name: "帕鲁图鉴", url: `${siteUrl}/zh/pals` } };
  const breadcrumb = createBreadcrumbSchema([{ name: "首页", path: "/zh/" }, { name: "帕鲁图鉴", path: "/zh/pals" }, { name: nameZh, path: `/zh/pals/${pal.slug}` }]);

  return <main id="main-content" className="pal-profile-page"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} /><div className="profile-nav"><SiteHeader current="/zh/pals" locale="zh" /></div>
    <section className="profile-hero"><div className="profile-hero-copy"><nav className="profile-breadcrumb" aria-label="面包屑导航"><Link href="/zh/">首页</Link><span>›</span><Link href="/zh/pals">帕鲁图鉴</Link><span>›</span><b>{nameZh}</b></nav><p className="database-eyebrow">当前版本 1.0 · 编号 {pal.number}</p><h1>{nameZh}｜帕鲁详情</h1><p>{nameZh}（{pal.name}）的属性、工作适应性、伙伴技能和配种数据。</p><div><Link href={`/zh/?mode=target&target=${encodeURIComponent(pal.id)}`}>查找{ nameZh }父母组合 →</Link><Link href="/zh/pals">返回帕鲁图鉴</Link></div></div><PalMark pal={pal} showNewBadge /></section>
    <section className="profile-content"><div className="profile-main"><section><p className="database-eyebrow">数据详情</p><h2>{nameZh}的帕鲁数据</h2><div className="profile-stat-strip"><span><small>帕鲁编号</small><strong>{pal.number}</strong></span><span><small>配种力</small><strong>{pal.power}</strong></span><span><small>工作类型</small><strong>{workEntries.length}</strong></span><span><small>记录类型</small><strong>{pal.kind === "pal" ? "帕鲁" : "其他生物"}</strong></span></div><div className="profile-elements" aria-label={`${nameZh}属性`}><span>属性</span><div>{pal.elements.map((element) => <span className="profile-element" key={element}><ElementIcon element={element} /><b>{element}</b></span>)}</div></div><p>配种力是用于计算帕鲁配种结果的物种数据，不代表战斗强度、稀有度或捕捉难度。请通过配种计算器查询实际组合。</p></section>
      <section className="profile-partner-skill"><h2>{nameZh}的伙伴技能</h2>{pal.partnerSkill.name ? <div className="profile-partner-skill-card"><PartnerSkillIcon file={pal.partnerSkill.iconFile} label={pal.partnerSkill.name} /><div><strong>{pal.partnerSkill.name}</strong><p>{pal.partnerSkill.description ?? `这是${nameZh}的专属伙伴技能。具体触发条件和数值请以游戏内说明为准。`}</p></div></div> : <p>当前记录没有伙伴技能数据。</p>}</section>
      <section><h2>{nameZh}的工作适应性</h2>{workEntries.length ? <><div className="profile-work-grid">{workEntries.map(([key, level]) => <article key={key}><WorkSuitabilityIcon work={key} /><div><strong>{workLabelsZh[key] ?? workLabels[key]}</strong><small>基础等级 {level}</small></div><b>{level}</b></article>)}</div><p>{strongest ? `${nameZh}最高的基础工作适应性是${workLabelsZh[strongest[0]] ?? workLabels[strongest[0]]}，等级为 ${strongest[1]}。` : ""}实际工作效率还会受到凝聚、技能和据点效果影响。</p></> : <p>当前记录没有普通据点工作适应性。</p>}</section>
      <section><h2>使用{nameZh}规划配种</h2><p>你可以将{nameZh}设为目标帕鲁，查看当前版本中可用的父母组合。</p><div className="profile-action-grid"><Link href={`/zh/?mode=target&target=${encodeURIComponent(pal.id)}`}><span>01</span><strong>查找父母组合</strong><small>查看可以配出{nameZh}的父母。</small></Link><Link href="/zh/breeding-calculator?mode=offspring"><span>02</span><strong>查看子代结果</strong><small>选择一个父母查看可能的子代。</small></Link><Link href="/zh/pals"><span>03</span><strong>浏览全部帕鲁</strong><small>返回图鉴继续搜索和筛选。</small></Link></div></section>
    </div><aside className="profile-related"><p className="database-eyebrow">继续查询</p><h2>相关入口</h2><Link href={`/zh/?mode=target&target=${encodeURIComponent(pal.id)}`}><PalMark pal={pal} small /><span><strong>查找父母组合</strong><small>以{nameZh}为目标帕鲁</small></span><b>→</b></Link><Link href="/zh/pals"><span><strong>返回帕鲁图鉴</strong><small>搜索其他帕鲁</small></span><b>→</b></Link></aside></section>
    <footer className="database-footer"><span>独立玩家资料站 · 当前数据快照：1.0。</span><Link href="/zh/pals">查看全部帕鲁 →</Link></footer>
  </main>;
}
