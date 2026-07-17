import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { createPageMetadata } from "../../../lib/seo";
import { catalogPals } from "../../../lib/game-data";
import { selectPalsBySlugs } from "../../../lib/paldex";
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
  const query = await searchParams;
  const selected = selectPalsBySlugs(query.ids, catalogPals);
  const hasFilters = Object.keys(query).length > 0;
  return {
    ...createPageMetadata({
      title: selected.length ? "Palworld Pals Database | All Pals & 1.0 New Pals" : `Palworld Pals Database — Page ${page} of ${pageCount} | 1.0`,
      description: `Browse Palworld Pal profiles ${((page - 1) * PALDEX_PAGE_SIZE) + 1}–${Math.min(page * PALDEX_PAGE_SIZE, catalogPals.length)} of ${catalogPals.length}, with current version 1.0 work suitability, breeding power, images, and profile links.`,
      keywords: ["palworld pals"],
      path: selected.length ? "/pals" : `/pals/page/${page}`,
    }),
    pagination: {
      previous: page === 2 ? "/pals" : `/pals/page/${page - 1}`,
      ...(page < pageCount ? { next: `/pals/page/${page + 1}` } : {}),
    },
    ...(hasFilters || selected.length ? { robots: { index: false, follow: true }, alternates: { canonical: "https://www.palworldguide.net/pals" } } : {}),
  };
}

export default async function PalsPaginationPage({ params, searchParams }: Props) {
  const page = Number.parseInt((await params).page, 10);
  if (page === 1) permanentRedirect("/pals");
  if (!Number.isInteger(page) || page < 2 || page > pageCount) notFound();
  const query = await searchParams;
  const selected = selectPalsBySlugs(query.ids, catalogPals);
  return <PaldexPageContent initialPage={selected.length ? 1 : page} />;
}
