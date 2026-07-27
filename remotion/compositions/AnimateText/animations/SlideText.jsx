// PROJECT/remotion/compositions/AnimateText/animations/SlideText.jsx
// Four directional slide-in variants (slideUp/slideDown/slideLeft/slideRight)
// sharing one base — direction only changes which axis/sign the entry offset
// comes from, matching the travel distances in remotion/animations/index.js.

import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useMemo } from "react";
import { resolveFont } from "../../../fonts/fonts";
import { getFittedFontSize } from "../../../fonts/fitfont";

const SLIDE_FRAMES = 20; // frames to settle into position
const SLIDE_DISTANCE_H = 300; // px, left/right entry travel distance
const SLIDE_DISTANCE_V = 100; // px, up/down entry travel distance
const EDGE_MARGIN_VH = 10; // gap from top/bottom frame edge when yPosition is "top"/"bottom"
const EDGE_MARGIN_PERCENT = 5; // gap from left/right edge when xPosition is "left"/"right"

const SlideTextBase = ({
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
  fromX = 0,
  fromY = 0,
}) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

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

  const opacity = interpolate(frame, [0, SLIDE_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dx = interpolate(frame, [0, SLIDE_FRAMES], [fromX, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dy = interpolate(frame, [0, SLIDE_FRAMES], [fromY, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        transform: `translate(${txAnchor}, ${tyAnchor}) translate(${dx}px, ${dy}px)`,
        opacity,
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

export const SlideUpText = (props) => <SlideTextBase {...props} fromY={SLIDE_DISTANCE_V} />;
export const SlideDownText = (props) => <SlideTextBase {...props} fromY={-SLIDE_DISTANCE_V} />;
export const SlideLeftText = (props) => <SlideTextBase {...props} fromX={SLIDE_DISTANCE_H} />;
export const SlideRightText = (props) => <SlideTextBase {...props} fromX={-SLIDE_DISTANCE_H} />;
