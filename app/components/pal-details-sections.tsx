import type { PalDetail, PalDetailStat } from "../lib/game-data";

type Locale = "en" | "zh";

const labels: Record<string, [string, string]> = {
  Size: ["Size", "体型"],
  Rarity: ["Rarity", "稀有度"],
  Health: ["Health", "生命值"],
  Food: ["Food", "食物消耗"],
  MeleeAttack: ["Melee attack", "近战攻击"],
  Attack: ["Attack", "攻击"],
  Defense: ["Defense", "防御"],
  "Work Speed": ["Work speed", "工作速度"],
  Support: ["Support", "辅助"],
  CaptureRateCorrect: ["Capture rate", "捕获倍率"],
  MaleProbability: ["Male probability", "雄性概率"],
  CombiRank: ["Breeding power", "配种能力"],
  "Gold Coin": ["Sell price", "售价"],
  Egg: ["Egg", "蛋类型"],
  Code: ["Internal code", "内部代码"],
  SlowWalkSpeed: ["Slow walk speed", "慢走速度"],
  WalkSpeed: ["Walk speed", "步行速度"],
  RunSpeed: ["Run speed", "奔跑速度"],
  RideSprintSpeed: ["Ride sprint speed", "骑乘冲刺速度"],
  TransportSpeed: ["Transport speed", "搬运速度"],
  SwimSpeed: ["Swim speed", "游泳速度"],
  SwimDashSpeed: ["Swim dash speed", "游泳冲刺速度"],
  Stamina: ["Stamina", "耐力"],
};

function labelFor(key: string, locale: Locale) {
  return labels[key]?.[locale === "zh" ? 1 : 0] ?? key;
}

function StatGrid({ values, locale }: { values: Record<string, PalDetailStat>; locale: Locale }) {
  return <div className="profile-detail-stat-grid">{Object.entries(values).map(([key, stat]) => <div className="profile-detail-stat" key={key}><small>{labelFor(key, locale)}</small><strong>{stat.display || "—"}</strong>{stat.range && <span>{locale === "zh" ? `范围 ${stat.range}` : `Range ${stat.range}`}</span>}</div>)}</div>;
}

export default function PalDetailsSections({ detail, locale = "en", displayName }: { detail: PalDetail; locale?: Locale; displayName?: string }) {
  const isZh = locale === "zh";
  const headingName = displayName ?? detail.name;
  const movement = Object.fromEntries(Object.entries(detail.movement).filter(([key]) => key !== "Stamina"));
  const advancedStats = Object.fromEntries(Object.entries(detail.stats).filter(([key]) => !["Health", "Defense", "Rarity", "Food"].includes(key)));
  return <>
    <section className="profile-expanded-details">
      <p className="database-eyebrow">{isZh ? "完整属性" : "Extended data"}</p>
      <h2>{isZh ? `${headingName} 完整属性` : `${headingName} extended stats`}</h2>
      <div className="profile-detail-facts"><span><small>{isZh ? "体型" : "Size"}</small><strong>{detail.size ?? "—"}</strong></span><span><small>{isZh ? "捕获倍率" : "Capture rate"}</small><strong>{detail.captureRate ?? "—"}</strong></span><span><small>{isZh ? "雄性概率" : "Male probability"}</small><strong>{detail.maleProbability != null ? `${detail.maleProbability}%` : "—"}</strong></span><span><small>{isZh ? "蛋类型" : "Egg"}</small><strong>{detail.egg ?? "—"}</strong></span><span><small>{isZh ? "内部代码" : "Internal code"}</small><strong>{detail.code ?? "—"}</strong></span></div>
      <h3>{isZh ? "基础与隐藏属性" : "Base and hidden stats"}</h3>
      <StatGrid values={advancedStats} locale={locale} />
      <h3>{isZh ? "移动属性" : "Movement"}</h3>
      <StatGrid values={movement} locale={locale} />
      {detail.level80 && Object.keys(detail.level80).length > 0 && <><h3>{isZh ? "等级 80 属性" : "Level 80 stats"}</h3><StatGrid values={detail.level80} locale={locale} /></>}
    </section>
  </>;
}
