import Link from "next/link";
import PalMark from "./pal-mark";
import { catalogPals, palCounts } from "../lib/game-data";
import { getPalNameZh } from "../lib/pal-names-zh";

const featuredPals = catalogPals.slice(0, 4);
const popularPals = catalogPals.slice(4, 10);

const faqs = [
  ["这个配种计算器可以做什么？", "你可以选择两个父母查看子代，也可以从目标帕鲁反向查找父母组合、查看单个帕鲁能配出的子代，或规划配种路线。"],
  ["如何查找某个帕鲁的父母组合？", "在上方选择“目标帕鲁 → 父母组合”，然后选择目标帕鲁，页面会列出所有直接父母组合。"],
  ["已有帕鲁和最短配种路线有什么区别？", "“已有帕鲁 → 目标帕鲁”只使用你选择的已有帕鲁作为路线起点；“最短配种路线”用于计算理论上的最少配种步骤。"],
  ["配种结果会包含被动技能吗？", "不会。计算器只判断帕鲁种类和父母组合，被动技能、个体属性和遗传结果仍以游戏内规则为准。"],
  ["配种数据会更新吗？", "会。当前页面使用版本 1.0 的配种矩阵和帕鲁数据，数据变化后会同步更新。"],
];

export default function ChineseBreedingContent() {
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    <section className="home-paldex-feature px-5 py-20 sm:px-8 lg:px-12"><div className="mx-auto grid max-w-[1260px] gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center"><div><p className="eyebrow">帕鲁图鉴</p><h2 className="section-title mt-3">从图鉴了解每一个配种选择</h2><p className="mt-5 max-w-xl text-base leading-8 text-muted">浏览完整帕鲁列表，查看图片、编号、属性和工作适应性，再回来规划你的配种路线。</p><Link href="/zh/pals" className="btn btn-primary mt-7">浏览帕鲁图鉴 →</Link></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{featuredPals.map((pal) => <Link key={pal.id} href={`/zh/pals?ids=${encodeURIComponent(pal.slug)}`} className="rounded-[22px] border border-border bg-surface p-4 shadow-[0_12px_30px_rgba(35,84,71,.06)]"><PalMark pal={pal} small /><span className="mt-4 block text-xs font-extrabold text-subtle">编号 {pal.number}</span><strong className="mt-1 block font-display text-xl text-foreground">{getPalNameZh(pal.name) ?? pal.name}</strong><small className="mt-2 block text-xs text-muted">{pal.name}</small></Link>)}</div></div></section>

    <section className="popular-pals-section px-5 py-24 sm:px-8 lg:px-12"><div className="mx-auto max-w-[1360px]"><div className="section-heading-row"><div><p className="eyebrow">快速查找</p><h2 className="section-title mt-3">常用帕鲁</h2></div><p>打开帕鲁图鉴中的对应记录，确认编号和数据，再继续查找父母组合。</p></div><div className="popular-pal-grid">{popularPals.map((pal) => <article key={pal.id}><Link href={`/zh/pals?ids=${encodeURIComponent(pal.slug)}`}><PalMark pal={pal} /><div><span>编号 {pal.number}</span><h3>{getPalNameZh(pal.name) ?? pal.name}</h3><p>{pal.name}</p><small>配种力 {pal.power}</small></div></Link><footer><Link href={`/zh/pals?ids=${encodeURIComponent(pal.slug)}`}>查看图鉴记录</Link><Link href={`/zh/breeding-calculator?mode=target&target=${pal.id}`}>查找父母</Link></footer></article>)}</div><Link href="/zh/pals" className="section-cta">浏览全部 {palCounts.pals} 个帕鲁 →</Link></div></section>

    <section className="tool-lab-section px-5 py-24 sm:px-8 lg:px-12"><div className="mx-auto max-w-[1360px]"><div className="mb-12 grid gap-6 lg:grid-cols-[1fr_.7fr] lg:items-end"><div><p className="eyebrow">配种工具</p><h2 className="section-title mt-3">从选择帕鲁到规划路线</h2></div><p className="max-w-lg text-lg leading-8 text-muted">先查找目标帕鲁，再查看父母组合、子代和路线结果，所有操作都使用同一套配种数据。</p></div><div className="home-update-grid"><Link href="/zh/breeding-calculator?mode=parents"><span>01</span><h3>双亲 → 子代</h3><p>选择两个父母，查看它们可以配出的子代。</p></Link><Link href="/zh/breeding-calculator?mode=target"><span>02</span><h3>目标帕鲁 → 父母组合</h3><p>从目标帕鲁反向查找所有直接父母组合。</p></Link><Link href="/zh/breeding-calculator?mode=available-route"><span>03</span><h3>已有帕鲁 → 目标帕鲁</h3><p>只使用你已经拥有的帕鲁规划路线。</p></Link></div></div></section>

    <section className="data-freshness px-5 py-16 sm:px-8 lg:px-12"><div className="mx-auto max-w-[1200px]"><div><span>1.0</span><p><strong>当前数据快照</strong><small>{palCounts.pals} 个帕鲁 · 300 条配种记录</small></p></div><div><strong>数据状态</strong><span>当前版本</span></div><Link href="/zh/pals">查看帕鲁图鉴 →</Link></div></section>

    <section className="database-seo-copy"><div><p className="database-eyebrow">路线规划说明</p><h2>规划一条可靠的配种路线</h2><p>先确认目标帕鲁，再查看直接父母组合，并检查你已经拥有的帕鲁。理论上可行的组合不一定是最省时间的选择，稀有父母、捕捉位置和孵化数量都会影响实际规划。</p><p>准备好蛋糕、繁殖农场空间和孵化器后再开始配种。配种计算只判断帕鲁种类，不保证被动技能、性别或个体属性的最终结果。</p></div><div><h2>使用建议</h2><p>如果组合来自旧视频、表格或收藏记录，建议重新使用当前矩阵确认。版本更新可能改变配种值和结果，先验证路线可以避免浪费资源。</p><p><Link href="/zh/breeding-calculator">返回配种计算器 →</Link></p></div></section>

    <section id="faq" className="px-5 py-24 sm:px-8 lg:px-12"><div className="mx-auto grid max-w-[1200px] gap-14 lg:grid-cols-[.72fr_1.28fr]"><div><p className="eyebrow">常见问题</p><h2 className="section-title mt-3">配种计算器 FAQ</h2></div><div className="divide-y divide-border border-y border-border">{faqs.map(([question, answer], index) => <details key={question} className="faq-item group" open={index === 0}><summary><span>{question}</span><span className="faq-plus" aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div></section>
  </>;
}
