import Link from "next/link";

const modes = [
  ["父母 → 子代", "选择两个父母帕鲁，查询它们能够生成的子代。"],
  ["目标帕鲁 → 父母", "选择目标帕鲁，反向查询所有可用的父母组合。"],
  ["单个帕鲁 → 子代", "选择一个已有帕鲁，查看它与其他帕鲁配种时可能生成的子代。"],
  ["已有帕鲁 → 目标帕鲁", "只使用你拥有的帕鲁，查询可以配出的目标帕鲁。"],
  ["最短配种路线", "从当前帕鲁出发，计算到目标帕鲁的较短配种路线。"],
  ["我现在能配出什么", "根据你选择的已有帕鲁，列出当前可以直接配出的结果。"],
];

const faqs = [
  ["幻兽帕鲁1.0配种和旧版本有什么不同？", "当前 1.0 使用了最新的配种数据，部分父母组合和旧版本记录可能不同。查询时建议以当前配种计算器显示的结果为准。"],
  ["怎么查询一个帕鲁的父母组合？", "切换到“目标帕鲁 → 父母”模式，选择目标帕鲁后即可查看可用的父母组合。"],
  ["怎么查询两个帕鲁能生出什么？", "切换到“父母 → 子代”模式，选择两个父母帕鲁，系统会显示对应的子代结果。"],
  ["帕鲁配种路线可以只使用我拥有的帕鲁吗？", "可以。使用“已有帕鲁 → 目标帕鲁”模式，选择你拥有的帕鲁后，路线计算会根据当前选择的帕鲁范围查询目标结果。"],
  ["配种计算器会计算被动技能和个体值吗？", "不会。本工具主要查询帕鲁种类和配种组合，不计算被动技能、个体值、性别、凝聚效果或实际孵化时间。"],
  ["为什么同一个目标帕鲁会有很多父母组合？", "不同父母组合可能生成同一个目标帕鲁，因此系统会列出多个可行组合。你可以使用父母筛选和加载更多功能进一步查看。"],
];

export default function ChineseHomeSeoContent() {
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    <section className="database-seo-copy"><div><p className="database-eyebrow">使用说明</p><h2>幻兽帕鲁配种计算器怎么使用</h2><p>幻兽帕鲁 1.0 的配种组合可能与早期版本不同，因此查询父母和子代时应使用当前版本的配种数据。本工具根据当前 1.0 配种矩阵计算结果，帮助你快速找到目标帕鲁的直接父母组合，或查看两个帕鲁能够生成的子代。</p><p>选择“父母 → 子代”时，先选择两个父母帕鲁，系统会显示对应的子代结果。选择“目标帕鲁 → 父母”时，选择想要获得的目标帕鲁，系统会列出可用的父母组合。对于结果较多的帕鲁，可以使用父母筛选、搜索和加载更多功能。</p></div><div><p className="database-eyebrow">六种查询方式</p><h2>支持的帕鲁配种查询方式</h2><ul className="one-checklist">{modes.map(([name, description]) => <li key={name}><b>{name}</b><span>{description}</span></li>)}</ul></div></section>

    <section className="database-seo-copy"><div><p className="database-eyebrow">路线规划</p><h2>如何规划帕鲁配种路线</h2><p>如果你已经拥有一些帕鲁，但还没有目标帕鲁，可以使用已有帕鲁和路线功能。选择你拥有的帕鲁后，再选择目标帕鲁，系统会根据当前版本的配种数据查找可行路线。</p><p>“最短配种路线”用于查看理论上的较短路线，配种过程可能使用数据库中的其他帕鲁作为中间或合作对象。“已有帕鲁 → 目标帕鲁”则会限制可用的合作帕鲁范围，更适合按照自己的实际收藏规划。</p><p>路线结果只代表帕鲁种类之间的配种关系，不代表蛋糕、孵化时间、被动技能、个体值或性别结果。</p></div><div><p className="database-eyebrow">结果说明</p><h2>帕鲁配种结果包含什么</h2><p>配种结果会显示父母帕鲁、子代帕鲁以及相关的配种组合。结果较多时，可以通过筛选父母、搜索名称或加载更多结果来缩小范围。</p><p>父母顺序按照当前配种矩阵保留。对于部分组合，父母槽位的顺序可能影响结果，因此不要默认将所有父母组合强制合并为无方向数据。</p><p><Link href="/zh/pals">查看全部帕鲁</Link>　<Link href="/zh/">返回帕鲁配种计算器</Link></p></div></section>

    <section id="faq" className="px-5 py-24 sm:px-8 lg:px-12"><div className="mx-auto grid max-w-[1200px] gap-14 lg:grid-cols-[.72fr_1.28fr]"><div><p className="eyebrow">常见问题</p><h2 className="section-title mt-3">帕鲁配种常见问题</h2></div><div className="divide-y divide-border border-y border-border">{faqs.map(([question, answer]) => <details key={question} className="faq-item group"><summary><span>{question}</span><span className="faq-plus" aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div></section>
  </>;
}
