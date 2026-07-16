import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { createPageMetadata } from "../../../lib/seo";
import { catalogPals } from "../../../lib/game-data";
import { PALDEX_PAGE_SIZE } from "../../paldex-config";
import PaldexPageContent from "../../paldex-page-content";

type Props = { params: Promise<{ page: string }> };

const palCount = catalogPals.length;
const pageCount = Math.ceil(palCount / PALDEX_PAGE_SIZE);

export function generateStaticParams() {
  return Array.from({ length: pageCount - 1 }, (_, index) => ({ page: String(index + 2) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = Number.parseInt((await params).page, 10);
  if (!Number.isInteger(page) || page < 2 || page > pageCount) return {};
  return {
    ...createPageMetadata({
    title: `Palworld Paldeck Database — Page ${page} of ${pageCount} | 1.0`,
    description: `Browse Palworld Paldeck profiles ${((page - 1) * PALDEX_PAGE_SIZE) + 1}–${Math.min(page * PALDEX_PAGE_SIZE, palCount)} of ${palCount}, with current version 1.0 work suitability, breeding power, images, and profile links for focused research.`,
    keywords: ["palworld paldeck"],
    path: `/paldex/page/${page}`,
    }),
    pagination: {
      previous: page === 2 ? "/paldex" : `/paldex/page/${page - 1}`,
      ...(page < pageCount ? { next: `/paldex/page/${page + 1}` } : {}),
    },
  };
}

export default async function PaldexPaginationPage({ params }: Props) {
  const page = Number.parseInt((await params).page, 10);
  if (page === 1) permanentRedirect("/paldex");
  if (!Number.isInteger(page) || page < 2 || page > pageCount) notFound();
  return <PaldexPageContent initialPage={page} />;
}
