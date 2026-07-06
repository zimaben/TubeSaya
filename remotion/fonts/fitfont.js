// PROJECT/remotion/fonts/fitfont.js

import { resolveFont } from "./fonts.js";

let measureCanvas;
const getMeasureContext = () => {
  if (!measureCanvas) measureCanvas = document.createElement("canvas");
  return measureCanvas.getContext("2d");
};

/**
 * Returns the largest font size <= maxFontSize such that `text`, rendered
 * in `font`, fits within `maxWidthPx`.
 *
 * Canvas text metrics scale linearly with font size, so we scale down
 * proportionally in one shot, then step down 1px at a time as a safety
 * check (rounding from the proportional step can occasionally leave it
 * a hair over the edge).
 */
export const getFittedFontSize = ({ text, font, maxFontSize, maxWidthPx }) => {
  if (!text) return maxFontSize;

  const ctx = getMeasureContext();
  ctx.font = `${maxFontSize}px ${resolveFont(font)}`;
  const widthAtMax = ctx.measureText(text).width;

  if (widthAtMax <= maxWidthPx) return maxFontSize;

  let fitted = Math.floor(maxFontSize * (maxWidthPx / widthAtMax));
  ctx.font = `${fitted}px ${resolveFont(font)}`;
  while (ctx.measureText(text).width > maxWidthPx && fitted > 1) {
    fitted -= 1;
    ctx.font = `${fitted}px ${resolveFont(font)}`;
  }
  return fitted;
};