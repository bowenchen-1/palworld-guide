import Link from "next/link";
import type { PalData, PalDetail, WorkKey } from "../lib/game-data";
import type { PalDropsLocations } from "../lib/pal-drops-locations";

type Locale = "en" | "zh";

const workLabelsZh: Partial<Record<WorkKey, string>> = {
  emitflame: "生火", watering: "浇水", seeding: "播种", collection: "采集", mining: "采矿", deforest: "伐木",
  handcraft: "手工作业", cool: "冷却", generateelectricity: "发电", productmedicine: "制药", transport: "搬运", monsterfarm: "牧场",
};

export default function PalPracticalGuide({
  pal,
  detail,
  dropsLocations,
  breedingCount,
  breedingHref,
  locale = "en",
  displayName,
}: {
  pal: PalData;
  detail?: PalDetail;
  dropsLocations: PalDropsLocations;
  breedingCount: number;
  breedingHref: string;
  locale?: Locale;
  displayName?: string;
}) {
  const isZh = locale === "zh";
  const name = displayName ?? pal.name;
  const workEntries = Object.entries(pal.work) as [WorkKey, number][];
  const rankedWork = [...workEntries].sort((a, b) => b[1] - a[1]).slice(0, 3);
  const workText = rankedWork.map(([key, level]) => `${isZh ? workLabelsZh[key] ?? key : key === "monsterfarm" ? "Ranch" : key === "handcraft" ? "Handiwork" : key[0].toUpperCase() + key.slice(1)} Lv.${level}`).join(isZh ? "、" : ", ");
  const dropText = dropsLocations.drops.slice(0, 3).map((drop) => isZh ? drop.sourceName ?? drop.name : drop.name).join(isZh ? "、" : ", ");
  const locationText = dropsLocations.locations.slice(0, 2).map((location) => isZh ? location.sourceName ?? location.name : location.name).join(isZh ? "、" : ", ");
  const partnerText = pal.partnerSkill.description ?? (isZh ? `${name}的伙伴技能可以为队伍提供独特的辅助效果。` : `${name}'s Partner Skill provides a species-specific effect when deployed.`);
  const skillText = detail?.activeSkills.slice(0, 3).map((skill) => skill.name).join(isZh ? "、" : ", ");
  const ranchText = detail?.ranch[0]?.[1];
  const communityText = pal.slug === "lamball"
    ? (isZh ? "社区玩家通常把它当作前期牧场帕鲁：先稳定产 Wool，再把它当作手工和搬运的早期补位。茸茸盾牌更适合应急挡伤害，不应当当作主要输出手段。" : "Community players commonly keep Lamball as an early Ranch Pal for steady Wool, with Handiwork and Transporting as useful base backups. Treat Fluffy Shield as emergency defense rather than its main damage tool.")
    : (isZh ? `优先围绕${workText || "属性和技能"}安排${name}，再根据实际据点需求决定是否投入凝聚资源。` : `Build around ${workText || "this Pal's element and skills"} first, then decide whether further investment fits your base or team.`);

  return <section className="profile-practical-guide" aria-labelledby="practical-guide-heading">
    <p className="database-eyebrow">{isZh ? "实用攻略" : "Practical guide"}</p>
    <h2 id="practical-guide-heading">{isZh ? `${name} 使用攻略` : `${name} Practical Guide`}</h2>
    <p className="profile-guide-summary">{isZh ? `${name}的实用价值取决于获取难度、工作适应性、伙伴技能和配种用途。下面的建议只使用当前页面已整理的数据。` : `${name}'s practical value depends on how easily it is obtained, where it works, what its Partner Skill does, and how it fits into breeding. These tips use the data recorded on this page.`}</p>
    <div className="profile-guide-grid">
      <article><h3>{isZh ? "适合做什么" : "Best use"}</h3><p>{rankedWork.length ? (isZh ? `优先安排在${workText}相关工作。` : `Prioritize ${workText} when assigning this Pal at your base.`) : (isZh ? `${name}没有记录中的普通据点工作，优先根据属性和技能安排战斗用途。` : `${name} has no ordinary base work recorded, so focus on its element and combat skills.`)}</p></article>
      <article><h3>{isZh ? "获取与准备" : "Getting started"}</h3><p>{locationText ? (isZh ? `可以先在${locationText}寻找。常见掉落包括${dropText || "当前记录中的掉落物"}。` : `Look for it at ${locationText}. Recorded drops include ${dropText || "the items listed below"}.`) : (isZh ? `当前没有可靠的野外位置记录，建议使用配种查询规划获取路线。` : `No reliable wild location is recorded here, so use the breeding search to plan an alternative route.`)}</p></article>
      <article><h3>{isZh ? "基地安排" : "Base setup"}</h3><p>{rankedWork.length ? (isZh ? `把${name}分配到最需要的${workText}岗位，并预留搬运或牧场的工作空间，减少它在多个岗位之间反复切换。` : `Assign ${name} to the ${workText} role you need most, and leave room for its Transporting or Ranch work where applicable.`) : (isZh ? "如果没有据点工作记录，建议把它留在队伍中观察技能表现。" : "If no base work is recorded, keep it in the party and evaluate its combat utility instead.")}</p></article>
      <article><h3>{isZh ? "战斗与技能" : "Combat notes"}</h3><p>{skillText ? (isZh ? `当前技能记录包括${skillText}等。${name}的${pal.elements.join("、")}属性应结合敌人的属性和技能范围使用。` : `The recorded skill pool includes ${skillText}. Use ${name}'s ${pal.elements.join(" and ")} element with attention to enemy matchups and skill range.`) : (isZh ? `${name}当前没有完整主动技能记录，战斗使用前请以游戏内技能表现为准。` : `${name} does not have a complete active-skill record here; verify its in-game skill behavior before building around it.`)}</p></article>
      <article><h3>{isZh ? "配种建议" : "Breeding plan"}</h3><p>{breedingCount ? (isZh ? `当前配种矩阵记录了${breedingCount}组可生成${name}的直接组合。优先选择你已经拥有或容易捕获的父母。` : `The current matrix records ${breedingCount} direct combinations for ${name}. Start with parents you already own or can catch easily.`) : (isZh ? "当前没有记录中的直接组合，请先检查目标帕鲁和当前版本数据。" : "No direct combination is recorded here; check the target and current version data before planning a route.")}</p><Link href={breedingHref}>{isZh ? "查看父母组合 →" : "View parent combinations →"}</Link></article>
      <article><h3>{isZh ? "伙伴技能提示" : "Partner tip"}</h3><p>{partnerText}</p>{detail?.activeSkills.length ? <small>{isZh ? `技能池包含 ${detail.activeSkills.length} 个记录技能。` : `${detail.activeSkills.length} skills are listed in the current skill pool.`}</small> : null}</article>
      <article><h3>{isZh ? "牧场与凝聚" : "Ranch and upgrades"}</h3><p>{ranchText ? (isZh ? `牧场记录显示${ranchText}。如果主要为了产出物使用，先确认据点需求，再逐步投入凝聚资源。` : `The Ranch record starts at ${ranchText}. If you are using this Pal for production, confirm the resource demand before investing in condensation.`) : (isZh ? "当前没有牧场产出记录，优先考虑工作适应性、技能和战斗用途。" : "No Ranch output is recorded here, so prioritize work suitability, skills, and combat utility instead.")}</p></article>
      <article><h3>{isZh ? "实战经验" : "Practical note"}</h3><p>{communityText}</p></article>
    </div>
  </section>;
}
