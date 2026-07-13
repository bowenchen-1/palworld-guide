import { palAccent, PalData, palInitials } from "../lib/game-data";

export default function PalMark({ pal, small = false }: { pal?: PalData; small?: boolean }) {
  if (!pal) return <span className={`pal-mark empty ${small ? "small" : ""}`}>+</span>;
  return (
    <span className={`pal-mark ${small ? "small" : ""}`} style={{ "--pal-accent": palAccent(pal) } as React.CSSProperties} aria-hidden="true">
      <i>{palInitials(pal.name)}</i><b>{pal.number}</b>
    </span>
  );
}
