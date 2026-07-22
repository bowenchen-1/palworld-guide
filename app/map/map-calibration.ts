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

// PalDB's map renderer places its exported map coordinates in an image frame that is
// not identical to the game's raw landscape bounds. These constants are the renderer's
// calibrated scale and origins, normalized to the supplied Palpagos tile canvas.
const PALDB_COORDINATE_SCALE = 3156.4270152505446;
const PALDB_HORIZONTAL_OFFSET = 1922.4400871459695;
const PALDB_VERTICAL_OFFSET = 2125.2984749455336;

export const MAP_CALIBRATIONS: Record<MapView, MapCalibration> = {
  palpagos: {
    sourceWidth: 8192,
    sourceHeight: 8192,
    coordinateScale: PALDB_COORDINATE_SCALE,
    horizontalOffset: PALDB_HORIZONTAL_OFFSET,
    verticalOffset: PALDB_VERTICAL_OFFSET,
    invertVertical: true,
    showPreparedLocations: true,
  },
  "world-tree": {
    // paldb.cn/treemap publishes World Tree `ipos` coordinates in its own
    // 8192px frame. These values are kept separate from the Palpagos frame.
    sourceWidth: 8192,
    sourceHeight: 8192,
    coordinateScale: 1335.9375,
    horizontalOffset: 645,
    verticalOffset: -128,
    invertVertical: true,
    showPreparedLocations: true,
  },
};

export function getContainedImageRect(calibration: MapCalibration, displayWidth: number, displayHeight: number): ImageRect {
  const scale = Math.min(displayWidth / calibration.sourceWidth, displayHeight / calibration.sourceHeight);
  const width = calibration.sourceWidth * scale;
  const height = calibration.sourceHeight * scale;
  return { left: (displayWidth - width) / 2, top: (displayHeight - height) / 2, width, height };
}

export function mapCoordinateToScreenPoint(location: Pick<MapLocation, "x" | "y">, imageRect: ImageRect, calibration: MapCalibration) {
  const xRatio = (location.x + calibration.horizontalOffset) / calibration.coordinateScale;
  const yRatio = calibration.invertVertical
    ? 1 - (location.y + calibration.verticalOffset) / calibration.coordinateScale
    : (location.y + calibration.verticalOffset) / calibration.coordinateScale;
  return {
    x: imageRect.left + Math.max(0, Math.min(1, xRatio)) * imageRect.width,
    y: imageRect.top + Math.max(0, Math.min(1, yRatio)) * imageRect.height,
  };
}
