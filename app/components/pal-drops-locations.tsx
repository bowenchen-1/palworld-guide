import Image from "next/image";
import { assetUrl } from "../lib/assets";
import type { PalDropsLocations } from "../lib/pal-drops-locations";

const useAssetCdn = Boolean(process.env.NEXT_PUBLIC_ASSET_BASE_URL);

export default function PalDropsLocationsSection({ data, locale = "en" }: { data: PalDropsLocations; locale?: "en" | "zh" }) {
  const isZh = locale === "zh";
  return <section className="profile-drops-locations" aria-labelledby="drops-locations-heading">
    <h2 id="drops-locations-heading">{isZh ? "掉落物与捕获位置" : "Drops & Locations"}</h2>
    <div className="profile-drops-grid">
      <section aria-labelledby="drops-heading">
        <h3 id="drops-heading">{isZh ? "掉落物" : "Drops"}</h3>
        <ul className="profile-drop-list">
          {data.drops.map((drop, index) => <li key={`${drop.name}-${drop.sourceName}-${index}`}>
            <span className="profile-drop-icon">{drop.icon && <Image src={assetUrl(`/icons/palworld/drops/${drop.icon}`)} alt={`${drop.name} icon`} width={34} height={34} unoptimized={useAssetCdn} />}</span>
            <span className="profile-drop-copy"><strong>{isZh ? drop.sourceName ?? drop.name : drop.name}</strong>{isZh && drop.sourceName && <small>{drop.name}</small>}<span>{drop.quantity ? `${isZh ? "数量" : "Quantity"} ${drop.quantity}` : `${isZh ? "数量" : "Quantity"} —`}</span>{drop.chance && <span>{drop.chance}</span>}{drop.condition && <small>{isZh ? `条件：${drop.condition}` : drop.condition}</small>}</span>
          </li>)}
        </ul>
      </section>
      <section aria-labelledby="where-to-find-heading">
        <h3 id="where-to-find-heading">{isZh ? "捕获位置" : "Where to Find"}</h3>
        <ul className="profile-location-list">
          {data.locations.map((location, index) => <li key={`${location.name}-${location.sourceName}-${index}`}>
            <strong>{isZh ? location.sourceName?.replace(/\s+Lv\.\s*[\d\s–-]+$/, "") ?? location.name : location.name}</strong>
            {isZh && location.sourceName && <small>{location.name}</small>}
            {location.level && <span>{isZh ? "等级" : "Level"} {location.level}</span>}
            {location.note && <small>{location.note}</small>}
          </li>)}
        </ul>
      </section>
    </div>
  </section>;
}
