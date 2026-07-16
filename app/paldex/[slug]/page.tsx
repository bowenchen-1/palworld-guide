import { findPal } from "../../lib/game-data";
import { notFound, permanentRedirect } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export default async function LegacyPaldexProfileRedirect({ params }: Props) {
  const { slug } = await params;
  if (!findPal(slug)) notFound();
  permanentRedirect(`/pals/${slug}`);
}
