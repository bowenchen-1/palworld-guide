import Image from "next/image";
import { palAccent, PalData, palInitials } from "../lib/game-data";

export default function PalMark({ pal, small = false }: { pal?: PalData; small?: boolean }) {
  if (!pal) return <span className={`pal-mark empty ${small ? "small" : ""}`}>+</span>;
  return (
    <span className={`pal-mark ${small ? "small" : ""}`} style={{ "--pal-accent": palAccent(pal) } as React.CSSProperties} aria-hidden="true">
      <i>{palInitials(pal.name)}</i><Image className="pal-mark-image" src={`/pals/${pal.id}.png`} alt="" width={128} height={128} sizes={small ? "54px" : "(max-width: 760px) 90px, 118px"} unoptimized /><b>{pal.number}</b>
    </span>
  );
}
