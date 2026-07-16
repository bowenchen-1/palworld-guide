import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { createPageMetadata } from "../../../lib/seo";
import { catalogPals } from "../../../lib/game-data";
import { PALDEX_PAGE_SIZE } from "../../../paldex/paldex-config";
import PaldexPageContent from "../../../paldex/paldex-page-content";

type Props = { params: Promise<{ page: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };
const pageCount = Math.ceil(catalogPals.length / PALDEX_PAGE_SIZE);

export function generateStaticParams() {
  return Array.from({ length: pageCount - 1 }, (_, index) => ({ page: String(index + 2) }));
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const page = Number.parseInt((await params).page, 10);
  if (!Number.isInteger(page) || page < 2 || page > pageCount) return {};
  const hasFilters = Object.keys(await searchParams).length > 0;
  return {
    ...createPageMetadata({
      title: `Palworld Pals Database — Page ${page} of ${pageCount} | 1.0`,
      description: `Browse Palworld Pal profiles ${((page - 1) * PALDEX_PAGE_SIZE) + 1}–${Math.min(page * PALDEX_PAGE_SIZE, catalogPals.length)} of ${catalogPals.length}, with current version 1.0 work suitability, breeding power, images, and profile links.`,
      keywords: ["palworld pals"],
      path: `/pals/page/${page}`,
    }),
    pagination: {
      previous: page === 2 ? "/pals" : `/pals/page/${page - 1}`,
      ...(page < pageCount ? { next: `/pals/page/${page + 1}` } : {}),
    },
    ...(hasFilters ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function PalsPaginationPage({ params }: Props) {
  const page = Number.parseInt((await params).page, 10);
  if (page === 1) permanentRedirect("/pals");
  if (!Number.isInteger(page) || page < 2 || page > pageCount) notFound();
  return <PaldexPageContent initialPage={page} />;
}
