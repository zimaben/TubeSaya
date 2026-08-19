// PROJECT/remotion/compositions/MarkerText/MarkerText.jsx

import { AbsoluteFill, Sequence, useVideoConfig, getRemotionEnvironment } from "remotion";
import { MarkerCircle, WIDTH_FACTOR } from "./MarkerCircle";
import { MarkerTypewriter } from "./MarkerTypewriter";

const TEXT_GAP_FRACTION = 0.12; // gap between the text and the circle's near edge, as a fraction of the circle's dimension along that axis

// Thin orchestrator, same shape as AnimateText/AnimateImage: composes the two
// standalone pieces (circle draw-on + marker-styled text reveal) into one
// layer, same color for both (one marker, one color). Text's position is
// derived from the circle's own size/position plus `textPosition` (not
// independently draggable) so it always sits flush against the circle with a
// gap, regardless of circleSize/circleTop/circleLeft — the two can never
// intersect. No animation-mode switching yet — that's macro-wiring, out of
// scope here (see .claude/tasks.md).
export const MarkerText = ({
  text,
  fontSize,
  color,
  skew,
  bgSrc, // placement-reference photo; preview only, never rendered to the final video
  useRefPhoto = false, // screen-side toggle; photo stays on the macro even when this is off
  circleDuration = 1.2,
  circleSize = 0.38,
  circleTop = 58, // % of video height, anchored at the circle's center — matches MarkerCircle's own contract
  circleLeft = 50, // % of video width, anchored at the circle's center — matches MarkerCircle's own contract
  textPosition = "above", // "above" | "below" | "left" | "right", relative to the circle
}) => {
  const { fps, width, height } = useVideoConfig();
  // Circle draws first; text starts typing once the circle finishes, like
  // marker-on-whiteboard — circle the word, then write it in.
  const textStartFrame = Math.round(circleDuration * fps);

  // circleTop/circleLeft are the circle's CENTER (matches MarkerCircle's own
  // coordinate contract) — derive its four edges from there, all in % of
  // video dimensions, to anchor text just outside whichever edge it faces.
  const circleDiameterPx = Math.min(width, height) * circleSize; // vertical extent
  const circleWidthPx = circleDiameterPx * WIDTH_FACTOR; // horizontal extent (ellipse)
  const circleHeightPct = (circleDiameterPx / height) * 100;
  const circleWidthPct = (circleWidthPx / width) * 100;
  const circleTopEdge = circleTop - circleHeightPct / 2;
  const circleBottom = circleTop + circleHeightPct / 2;
  const circleLeftEdge = circleLeft - circleWidthPct / 2;
  const circleRight = circleLeft + circleWidthPct / 2;
  const vGapPct = (circleDiameterPx * TEXT_GAP_FRACTION / height) * 100;
  const hGapPct = (circleWidthPx * TEXT_GAP_FRACTION / width) * 100;

  // top/left is the point the text anchors from; alignX/alignY pick which
  // corner of the text box sits at that point, so text always grows away
  // from the circle rather than into it.
  let textTop = circleTop;
  let textLeft = circleLeft;
  let alignX = "center";
  let alignY = "center";

  if (textPosition === "below") {
    textTop = circleBottom + vGapPct;
    alignY = "start";
  } else if (textPosition === "left") {
    textLeft = circleLeftEdge - hGapPct;
    alignX = "end";
  } else if (textPosition === "right") {
    textLeft = circleRight + hGapPct;
    alignX = "start";
  } else {
    textTop = circleTopEdge - vGapPct;
    alignY = "end";
  }

  const showBg = Boolean(bgSrc) && useRefPhoto && !getRemotionEnvironment().isRendering;

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      {showBg && (
        // eslint-disable-next-line jsx-a11y/alt-text
        <img
          src={bgSrc}
          style={{ width, height, objectFit: "cover", opacity: 0.5 }}
        />
      )}
      <MarkerCircle
        color={color}
        duration={circleDuration}
        size={circleSize}
        top={circleTop}
        left={circleLeft}
      />
      <Sequence from={textStartFrame} layout="none">
        <MarkerTypewriter
          text={text}
          fontSize={fontSize}
          color={color}
          skew={skew}
          top={textTop}
          left={textLeft}
          alignX={alignX}
          alignY={alignY}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
