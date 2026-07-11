// PROJECT/remotion/compositions/MarkerText/MarkerText.jsx

import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { MarkerCircle } from "./MarkerCircle";
import { MarkerTypewriter } from "./MarkerTypewriter";

const TEXT_GAP_FRACTION = 0.12; // gap between the text and the circle's top edge, as a fraction of the circle's diameter

// Thin orchestrator, same shape as AnimateText/AnimateImage: composes the two
// standalone pieces (circle draw-on + marker-styled text reveal) into one
// layer, same color for both (one marker, one color). Text's vertical
// position is derived from the circle's own size/position (not independently
// configurable) so it always sits above the circle with a gap, regardless of
// circleSize/circleTop — the two can never intersect. No animation-mode
// switching yet — that's macro-wiring, out of scope here (see .claude/tasks.md).
export const MarkerText = ({
  text,
  fontSize,
  color,
  skew,
  circleDuration = 1.2,
  circleSize = 0.38,
  circleTop = 58,
  circleLeft = 50,
}) => {
  const { fps, width, height } = useVideoConfig();
  // Circle draws first; text starts typing once the circle finishes, like
  // marker-on-whiteboard — circle the word, then write it in.
  const textStartFrame = Math.round(circleDuration * fps);

  const circleDiameterPx = Math.min(width, height) * circleSize;
  const gapPx = circleDiameterPx * TEXT_GAP_FRACTION;
  const textTop = Math.max(0, circleTop - ((circleDiameterPx / 2 + gapPx) / height) * 100);

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <MarkerCircle
        color={color}
        duration={circleDuration}
        size={circleSize}
        top={circleTop}
        left={circleLeft}
      />
      <Sequence from={textStartFrame} layout="none">
        <MarkerTypewriter text={text} fontSize={fontSize} color={color} skew={skew} top={textTop} />
      </Sequence>
    </AbsoluteFill>
  );
};
