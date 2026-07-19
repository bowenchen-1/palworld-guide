import Image from "next/image";
import { assetUrl } from "../lib/assets";
import type { PalDropsLocations } from "../lib/pal-drops-locations";

const useAssetCdn = Boolean(process.env.NEXT_PUBLIC_ASSET_BASE_URL);

export default function PalDropsLocationsSection({ data }: { data: PalDropsLocations }) {
  return <section className="profile-drops-locations" aria-labelledby="drops-locations-heading">
    <h2 id="drops-locations-heading">Drops &amp; Locations</h2>
    <div className="profile-drops-grid">
      <section aria-labelledby="drops-heading">
        <h3 id="drops-heading">Drops</h3>
        <ul className="profile-drop-list">
          {data.drops.map((drop, index) => <li key={`${drop.name}-${drop.sourceName}-${index}`}>
            <span className="profile-drop-icon">{drop.icon && <Image src={assetUrl(`/icons/palworld/drops/${drop.icon}`)} alt={`${drop.name} icon`} width={34} height={34} unoptimized={useAssetCdn} />}</span>
            <span className="profile-drop-copy"><strong>{drop.name}</strong><span>{drop.quantity ? `Quantity ${drop.quantity}` : "Quantity —"}</span>{drop.chance && <span>{drop.chance}</span>}{drop.condition && <small>{drop.condition}</small>}</span>
          </li>)}
        </ul>
      </section>
      <section aria-labelledby="where-to-find-heading">
        <h3 id="where-to-find-heading">Where to Find</h3>
        <ul className="profile-location-list">
          {data.locations.map((location, index) => <li key={`${location.name}-${location.sourceName}-${index}`}>
            <strong>{location.name}</strong>
            {location.level && <span>Level {location.level}</span>}
            {location.note && <small>{location.note}</small>}
          </li>)}
        </ul>
      </section>
    </div>
  </section>;
}
