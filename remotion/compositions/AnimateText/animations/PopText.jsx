// PROJECT/remotion/compositions/AnimateText/animations/PopText.jsx

import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { useMemo } from "react";
import { resolveFont } from "../../../fonts/fonts";
import { getFittedFontSize } from "../../../fonts/fitfont";

const POP_DAMPING = 8; // spring damping — snappy overshoot on entry
const EDGE_MARGIN_VH = 10; // gap from top/bottom frame edge when yPosition is "top"/"bottom"
const EDGE_MARGIN_PERCENT = 5; // gap from left/right edge when xPosition is "left"/"right"

export const PopText = ({
  text,
  font,
  fontSize,
  fontColor,
  outlineColor,
  outlineWidth,
  xPosition,
  customX,
  yPosition,
  customY,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const maxWidthPx = width * (1 - (2 * EDGE_MARGIN_PERCENT) / 100);
  const fittedFontSize = useMemo(
    () => getFittedFontSize({ text, font, maxFontSize: fontSize, maxWidthPx }),
    [text, font, fontSize, maxWidthPx]
  );

  // --- Position ---
  // Same resolution pattern as DanceText/TypewriterText.
  const left =
    xPosition === "custom"
      ? `${customX}%`
      : xPosition === "left"
      ? `${EDGE_MARGIN_PERCENT}%`
      : xPosition === "right"
      ? `${100 - EDGE_MARGIN_PERCENT}%`
      : "50%"; // center
  const top =
    yPosition === "custom"
      ? `${customY}%`
      : yPosition === "top"
      ? `${EDGE_MARGIN_VH}vh`
      : yPosition === "bottom"
      ? `calc(100% - ${EDGE_MARGIN_VH}vh)`
      : "50%"; // center

  const txAnchor = xPosition === "left" ? "0%" : xPosition === "right" ? "-100%" : "-50%";
  const tyAnchor = yPosition === "top" ? "0%" : yPosition === "bottom" ? "-100%" : "-50%";

  const scale = spring({ frame, fps, config: { damping: POP_DAMPING } });

  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        transform: `translate(${txAnchor}, ${tyAnchor}) scale(${scale})`,
        fontFamily: resolveFont(font),
        fontSize: fittedFontSize,
        color: fontColor,
        WebkitTextStroke:
          outlineColor && outlineColor !== "transparent" ? `${outlineWidth ?? 2}px ${outlineColor}` : "",
        whiteSpace: "pre",
      }}
    >
      {text}
    </div>
  );
};
