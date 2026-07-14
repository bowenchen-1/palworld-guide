import { ImageResponse } from "next/og";
import { findPal } from "../../lib/game-data";
import { siteUrl } from "../../site-config";

export const alt = "Palworld Guide Pal profile";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string }> };

export default async function PalOpenGraphImage({ params }: Props) {
  const pal = findPal((await params).slug);
  const name = pal?.name ?? "Pal Profile";
  const number = pal?.number ?? "—";
  const imageUrl = pal ? `${siteUrl}/pals/${pal.id}.png` : `${siteUrl}/og.png`;

  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", position: "relative", overflow: "hidden", background: "#08191f", color: "#f4faf9", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", position: "absolute", inset: 0, opacity: 0.18, backgroundImage: "linear-gradient(#39d0c5 1px, transparent 1px), linear-gradient(90deg, #39d0c5 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
      <div style={{ display: "flex", position: "absolute", width: 520, height: 520, right: -110, top: -120, border: "2px solid #39d0c5", borderRadius: 260, opacity: 0.16 }} />
      <div style={{ display: "flex", width: "100%", margin: 44, padding: 54, alignItems: "center", justifyContent: "space-between", gap: 52, border: "2px solid #28545d", borderRadius: 28, background: "rgba(16,44,52,.94)" }}>
        <div style={{ display: "flex", flexDirection: "column", width: 680 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, color: "#39d0c5", fontSize: 24, fontWeight: 700, letterSpacing: 4 }}>
            <span style={{ display: "flex", width: 13, height: 13, borderRadius: 7, background: "#f2c94c" }} />
            PAL RESEARCH DATABASE
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 74, lineHeight: 1.02, fontWeight: 800 }}>{name}</div>
          <div style={{ display: "flex", marginTop: 20, color: "#a9c4c5", fontSize: 30 }}>Palworld 1.0 Paldeck profile</div>
          <div style={{ display: "flex", marginTop: 48, alignItems: "center", gap: 18 }}>
            <span style={{ display: "flex", borderRadius: 12, background: "#39d0c5", padding: "13px 18px", color: "#08191f", fontSize: 25, fontWeight: 800 }}>NO. {number}</span>
            <span style={{ display: "flex", color: "#f2c94c", fontSize: 23, fontWeight: 700 }}>WORK · BREEDING · PROFILE</span>
          </div>
        </div>
        <div style={{ display: "flex", width: 300, height: 350, alignItems: "center", justifyContent: "center", border: "2px solid #39d0c5", borderRadius: 28, background: "#0d252c" }}>
          <img src={imageUrl} alt="" width={270} height={270} style={{ objectFit: "contain", imageRendering: "auto" }} />
        </div>
      </div>
    </div>,
    size,
  );
}
