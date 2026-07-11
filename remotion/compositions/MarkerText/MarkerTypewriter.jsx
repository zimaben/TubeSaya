// PROJECT/remotion/compositions/MarkerText/MarkerTypewriter.jsx

import { useCurrentFrame, useVideoConfig } from "remotion";
import { useMemo } from "react";
import { resolveFont } from "../../fonts/fonts";
import { getFittedFontSize } from "../../fonts/fitfont";

// Same reveal-timing model as AnimateText's TypewriterText (fixed
// chars-per-second, independent of durationInFrames) — see
// remotion/compositions/AnimateText/animations/TypewriterText.jsx.
const TYPING_WPM = 90;
const AVG_CHARS_PER_WORD = 9;
const CHARS_PER_SECOND = (TYPING_WPM / 60) * AVG_CHARS_PER_WORD;
const EDGE_MARGIN_PERCENT = 5;

const MARKER_FONT = "PermanentMarker-Regular"; // this component's visual identity is fixed to the marker font, not user-selectable

export const MarkerTypewriter = ({ text, fontSize = 120, color = "#1E1E1E", skew = -6, top = 50 }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const letters = [...text];

  // skewX(deg) shifts the line's top edge horizontally by fontSize * tan(skew);
  // subtract that allowance before fitting so the skewed text still stays
  // inside the frame instead of overflowing past the fitted width.
  const skewAllowancePx = Math.abs(fontSize * Math.tan((skew * Math.PI) / 180));
  const maxWidthPx = width * (1 - (2 * EDGE_MARGIN_PERCENT) / 100) - skewAllowancePx;

  const fittedFontSize = useMemo(
    () => getFittedFontSize({ text, font: MARKER_FONT, maxFontSize: fontSize, maxWidthPx }),
    [text, fontSize, maxWidthPx]
  );

  const framesPerChar = fps / CHARS_PER_SECOND;
  const visibleCount = Math.min(letters.length, Math.floor(frame / framesPerChar) + 1);

  return (
    <div
      style={{
        position: "absolute",
        top: `${top}%`,
        left: "50%",
        transform: `translate(-50%, -50%) skewX(${skew}deg)`,
        display: "flex",
        flexWrap: "nowrap",
      }}
    >
      {letters.map((char, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            fontFamily: resolveFont(MARKER_FONT),
            fontSize: fittedFontSize,
            color,
            whiteSpace: "pre",
            opacity: i < visibleCount ? 1 : 0,
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
};
