import type { MapLocation } from "../../data/map";

export type MapView = "palpagos" | "world-tree";

export type MapCalibration = {
  sourceWidth: number;
  sourceHeight: number;
  coordinateScale: number;
  horizontalOffset: number;
  verticalOffset: number;
  invertVertical: boolean;
  showPreparedLocations: boolean;
};

export type ImageRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

// PalDB's map renderer does not stretch the smallest/largest location values to the image
// edges. It converts the original in-game coordinates using the map's real-world bounds and
// 459 units per map pixel. These are the resulting normalized-map constants from that exact
// transform. Keeping this here makes the image, marker canvas, and hit testing use one frame.
const PALDB_COORDINATE_SCALE = 3156.4270152505446;
const PALDB_HORIZONTAL_OFFSET = 1922.4400871459695;
const PALDB_VERTICAL_OFFSET = 2125.2984749455336;

export const MAP_CALIBRATIONS: Record<MapView, MapCalibration> = {
  palpagos: {
    sourceWidth: 1254,
    sourceHeight: 1254,
    coordinateScale: PALDB_COORDINATE_SCALE,
    horizontalOffset: PALDB_HORIZONTAL_OFFSET,
    verticalOffset: PALDB_VERTICAL_OFFSET,
    invertVertical: true,
    showPreparedLocations: true,
  },
  "world-tree": {
    sourceWidth: 948,
    sourceHeight: 1660,
    coordinateScale: PALDB_COORDINATE_SCALE,
    horizontalOffset: PALDB_HORIZONTAL_OFFSET,
    verticalOffset: PALDB_VERTICAL_OFFSET,
    invertVertical: true,
    // The supplied location export is for Palpagos Islands. Do not paint those points on
    // the separate World Tree artwork until a World Tree-specific export is available.
    showPreparedLocations: false,
  },
};

export function getContainedImageRect(calibration: MapCalibration, displayWidth: number, displayHeight: number): ImageRect {
  const scale = Math.min(displayWidth / calibration.sourceWidth, displayHeight / calibration.sourceHeight);
  const width = calibration.sourceWidth * scale;
  const height = calibration.sourceHeight * scale;
  return { left: (displayWidth - width) / 2, top: (displayHeight - height) / 2, width, height };
}

export function mapCoordinateToScreenPoint(location: Pick<MapLocation, "x" | "y">, imageRect: ImageRect, calibration: MapCalibration) {
  // PalDB's transform is intentionally asymmetric in naming: X controls the horizontal
  // screen axis and Y controls the vertical screen axis after the map's vertical flip.
  const xRatio = (location.x + calibration.horizontalOffset) / calibration.coordinateScale;
  const yRatio = calibration.invertVertical
    ? 1 - (location.y + calibration.verticalOffset) / calibration.coordinateScale
    : (location.y + calibration.verticalOffset) / calibration.coordinateScale;
  return {
    x: imageRect.left + Math.max(0, Math.min(1, xRatio)) * imageRect.width,
    y: imageRect.top + Math.max(0, Math.min(1, yRatio)) * imageRect.height,
  };
}
