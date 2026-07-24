import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../../components/site-header";
import MapClient from "../../map/map-client";
import { absoluteUrl, createBreadcrumbSchema } from "../../lib/seo";
import { mapDataUrl, type MapCategory } from "../../../data/map";
import mapData from "../../../public/data/map-locations.json";

const title = "幻兽帕鲁地图｜1.0互动地图与地点资源查询";
const description = "使用幻兽帕鲁1.0互动地图查询首领帕鲁、快速旅行点、地下城、资源、宝箱、帕鲁蛋、商人和其他重要地点。支持分类筛选、搜索、等级筛选、坐标查看和世界树地图。";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["幻兽帕鲁地图", "帕鲁地图", "帕鲁资源地图", "帕鲁地点", "幻兽帕鲁1.0地图"],
  robots: { index: true, follow: true },
  alternates: {
    canonical: absoluteUrl("/zh/map"),
    languages: { en: absoluteUrl("/map"), zh: absoluteUrl("/zh/map"), "x-default": absoluteUrl("/map") },
  },
  openGraph: { title, description, url: absoluteUrl("/zh/map"), siteName: "Palworld Guide", locale: "zh_CN", type: "website", images: [{ url: absoluteUrl("/map/Palworld_Map_Complete.png"), width: 4096, height: 4096, alt: "幻兽帕鲁1.0互动地图" }] },
};

const breadcrumbSchema = createBreadcrumbSchema([{ name: "首页", path: "/zh/" }, { name: "帕鲁地图", path: "/zh/map" }]);
const pageSchema = { "@context": "https://schema.org", "@type": "WebPage", name: title, headline: "幻兽帕鲁1.0地图", description, url: absoluteUrl("/zh/map"), isAccessibleForFree: true, inLanguage: "zh-CN" };
const categories = (mapData.categories as MapCategory[]).map((category) => ({ name: category.name, icon: category.icon }));

export default function ChineseMapPage() {
  const chineseMapCoordinateNote =
    "地图坐标按照 PalDB 地图坐标系映射到提供的 8192 × 8192 帕尔帕戈斯瓦片图，使用对应的比例、原点和垂直翻转规则。";

  return (
    <main id="main-content" className="map-page min-h-screen bg-canvas text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SiteHeader current="/zh/map" locale="zh" />
      <div className="map-page-wrap">
        <nav className="map-breadcrumb" aria-label="面包屑导航"><Link href="/zh/">首页</Link><span aria-hidden="true">›</span><span>帕鲁地图</span></nav>
        <header className="map-page-header">
          <div>
            <p className="map-kicker">幻兽帕鲁 1.0 · 地图图鉴</p>
            <h1>幻兽帕鲁地图 1.0</h1>
            <p>使用最新版本的幻兽帕鲁互动地图，搜索和筛选首领帕鲁、快速旅行点、地下城、资源、宝箱、帕鲁蛋、商人、高塔、聚落以及其他重要地点。</p>
          </div>
          <div className="map-header-stat"><strong>{new Intl.NumberFormat("zh-CN").format(mapData.locations.length)}</strong><span>个地点已收录</span><small>帕尔帕戈斯群岛 · 1.0 数据</small></div>
        </header>

        <MapClient initialCategories={categories} locationCount={mapData.locations.length} locale="zh" />

        <section className="map-seo-content">
          <h2>幻兽帕鲁互动地图</h2>
          <p>这张幻兽帕鲁 1.0 地图适合用来规划探索路线、寻找资源和确认地点。地图将帕尔帕戈斯群岛的地图瓦片、地点数据、分类图标、搜索功能和地图控制集中在一起，覆盖主要岛屿、偏远区域、资源点、洞穴、地下城、高塔、聚落以及冒险过程中经常需要查找的地点。</p>
          <p>地图上的标记来自当前项目整理的地点数据。你可以查找硫磺、铬铁矿、夜星砂，确认地下城入口和快速旅行点，也可以点击标记查看名称、分类、坐标和已有说明。通过只打开需要的分类，可以减少地图上的标记干扰。</p>

          <h2>帕鲁地图地点与分类</h2>
          <p>当前地图收录 {new Intl.NumberFormat("zh-CN").format(mapData.locations.length)} 个地点记录，包括首领帕鲁、快速旅行点、聚落、高塔、地下城、洞穴入口、宝箱、帕鲁蛋、资源节点、石油钻井平台、钓鱼点、NPC、流浪商人、敌方营地和补给空投等。工具栏中的数量会根据当前地图区域、分类选择和搜索条件实时变化。</p>
          <p>左侧分类面板按地点、帕鲁与蛋、收集品、资源、敌人与事件、NPC 和活动进行整理。打开分类后，可以单独启用或清除某一类标记；等级筛选则可以帮助你缩小符合等级范围的地点。</p>

          <h2>资源、地下城与快速筛选</h2>
          <p>地图提供夜星砂、地下城、铬铁矿、硫磺、古代文明材料和钓鱼点等快捷筛选。硫磺筛选会同时显示硫磺和硫磺矿脉，古代文明材料筛选会组合古代文明树皮、骨头和熔岩。快捷筛选会清除搜索文字并只保留相关分类，适合快速开始一次资源搜寻。</p>

          <h2>如何使用幻兽帕鲁地图</h2>
          <ol>
            <li>使用搜索框输入地点、资源或分类名称。</li>
            <li>通过快捷筛选直接查看常用资源和地点。</li>
            <li>打开左侧分类，选择需要显示的地图标记。</li>
            <li>使用等级筛选缩小地点范围，或点击“显示全部”查看所有分类。</li>
            <li>在地图上拖动、缩放并点击标记，查看地点详情和坐标。</li>
            <li>切换帕尔帕戈斯群岛和世界树地图，分别查看对应区域的数据。</li>
          </ol>

          <h2>地图数据范围</h2>
          <p>当前地图使用项目提供的幻兽帕鲁 1.0 地点快照、地图资源和分类图标。{chineseMapCoordinateNote}如果某个资源或帕鲁没有可靠的地点记录，页面不会在地图上编造标记。地图适合用于路线规划、资源收集、地下城准备和出发前确认地点，具体游戏内容仍可能随着版本更新而变化。</p>
          <p className="map-data-note">地图数据接口：<code>{mapDataUrl}</code></p>
        </section>
      </div>
      <footer className="map-footer">独立玩家资料站 · Palworld 为其各自所有者的商标</footer>
    </main>
  );
}
