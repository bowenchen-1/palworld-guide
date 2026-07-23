import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { createPageMetadata } from "../../../../lib/seo";
import { catalogPals } from "../../../../lib/game-data";
import { PALDEX_PAGE_SIZE } from "../../../../paldex/paldex-config";
import PaldexPageContent from "../../../../paldex/paldex-page-content";

type Props = { params: Promise<{ page: string }> };
const pageCount = Math.ceil(catalogPals.length / PALDEX_PAGE_SIZE);

export function generateStaticParams() {
  return Array.from({ length: pageCount - 1 }, (_, index) => ({ page: String(index + 2) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = Number.parseInt((await params).page, 10);
  if (!Number.isInteger(page) || page < 2 || page > pageCount) return {};

  return {
    ...createPageMetadata({
      title: `幻兽帕鲁图鉴｜第 ${page} 页｜1.0 帕鲁资料`,
      description: `浏览幻兽帕鲁图鉴第 ${page} 页，查询第 ${((page - 1) * PALDEX_PAGE_SIZE) + 1}–${Math.min(page * PALDEX_PAGE_SIZE, catalogPals.length)} 个帕鲁的属性、工作适应性、伙伴技能和配种数据。`,
      keywords: ["幻兽帕鲁图鉴", "帕鲁资料", "帕鲁属性"],
      path: `/zh/pals/page/${page}`,
      locale: "zh",
    }),
    pagination: {
      previous: page === 2 ? "/zh/pals" : `/zh/pals/page/${page - 1}`,
      ...(page < pageCount ? { next: `/zh/pals/page/${page + 1}` } : {}),
    },
  };
}

export default async function ChinesePalsPaginationPage({ params }: Props) {
  const page = Number.parseInt((await params).page, 10);
  if (page === 1) permanentRedirect("/zh/pals");
  if (!Number.isInteger(page) || page < 2 || page > pageCount) notFound();
  return <PaldexPageContent initialPage={page} locale="zh" />;
}
