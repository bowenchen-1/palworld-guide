"use client";
/* eslint-disable @next/next/no-img-element -- game UI textures are local, fixed-size assets. */

import { useState } from "react";
import { WorkKey, workLabels } from "../lib/game-data";
import { assetUrl } from "../lib/assets";

const elementFiles: Record<string, string> = {
  Neutral: "T_Icon_element_s_00.png",
  Fire: "T_Icon_element_s_01.png",
  Water: "T_Icon_element_s_02.png",
  Electric: "T_Icon_element_s_03.png",
  Grass: "T_Icon_element_s_04.png",
  Dark: "T_Icon_element_s_05.png",
  Dragon: "T_Icon_element_s_06.png",
  Ground: "T_Icon_element_s_07.png",
  Ice: "T_Icon_element_s_08.png",
};

const workFiles: Record<WorkKey, string> = {
  emitflame: "T_icon_palwork_00.png",
  watering: "T_icon_palwork_01.png",
  seeding: "T_icon_palwork_02.png",
  generateelectricity: "T_icon_palwork_03.png",
  handcraft: "T_icon_palwork_04.png",
  collection: "T_icon_palwork_05.png",
  deforest: "T_icon_palwork_06.png",
  mining: "T_icon_palwork_07.png",
  productmedicine: "T_icon_palwork_08.png",
  cool: "T_icon_palwork_10.png",
  transport: "T_icon_palwork_11.png",
  monsterfarm: "T_icon_palwork_12.png",
};

function PalworldIcon({ src, label, fallback, className }: { src: string; label: string; fallback: string; className: string }) {
  const [failed, setFailed] = useState(false);
  return <span className={`palworld-icon ${className}`} role="img" aria-label={label} title={label}>{failed ? <span className="palworld-icon-fallback">{fallback}</span> : <img src={src} alt="" width="32" height="32" loading="eager" decoding="sync" onError={() => setFailed(true)} />}</span>;
}

export function ElementIcon({ element }: { element: string }) {
  const file = elementFiles[element];
  return <PalworldIcon src={assetUrl(`/icons/palworld/elements/${file ?? ""}`)} label={element} fallback={element.slice(0, 2)} className="element-icon" />;
}

export function WorkSuitabilityIcon({ work }: { work: WorkKey }) {
  const label = workLabels[work];
  return <PalworldIcon src={assetUrl(`/icons/palworld/work-suitability/${workFiles[work]}`)} label={label} fallback={label.slice(0, 2)} className="work-suitability-icon" />;
}

export function PartnerSkillIcon({ file, label }: { file: string | null; label: string | null }) {
  return <PalworldIcon src={assetUrl(`/icons/palworld/partner-skills/${file ?? ""}`)} label={`${label ?? "Partner"} Partner Skill`} fallback="PS" className="partner-skill-icon" />;
}
