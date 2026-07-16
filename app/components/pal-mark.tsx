"use client";

import Image from "next/image";
import { palAccent, PalData, palInitials } from "../lib/game-data";

export default function PalMark({ pal, small = false, eager = false, showNewBadge = false }: { pal?: PalData; small?: boolean; eager?: boolean; showNewBadge?: boolean }) {
  if (!pal) return <span className={`pal-mark empty ${small ? "small" : ""}`}>+</span>;
  return (
    <span className={`pal-mark ${small ? "small" : ""}`} style={{ "--pal-accent": palAccent(pal) } as React.CSSProperties}>
      <i aria-hidden="true">{palInitials(pal.name)}</i><Image className="pal-mark-image" src={`/pals/${pal.id}.webp`} alt={`${pal.name} Palworld Paldeck image`} width={128} height={128} sizes={small ? "54px" : "(max-width: 760px) 90px, 118px"} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "auto"} onError={(event) => { event.currentTarget.style.display = "none"; }} unoptimized /><b aria-hidden="true">{pal.number}</b>{showNewBadge && pal.isNewIn1_0 && <em className={`pal-new-badge ${pal.newType === "new-variant" ? "variant" : ""}`}>{pal.newType === "new-variant" ? "NEW VARIANT" : "NEW"}</em>}
    </span>
  );
}
