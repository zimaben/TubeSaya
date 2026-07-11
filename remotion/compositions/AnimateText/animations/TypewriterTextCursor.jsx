// PROJECT/remotion/compositions/animations/TypewriterTextwCursor.jsx

import { useCurrentFrame, useVideoConfig } from "remotion";
import { useMemo } from "react";
import { resolveFont } from "../../../fonts/fonts";
import { getFittedFontSize } from "../../../fonts/fitfont";

const TYPING_WPM = 90;          // target typing speed — "fast professional" baseline
const AVG_CHARS_PER_WORD = 9;   // standard typing-speed convention (includes space)
const CHARS_PER_SECOND = (TYPING_WPM / 60) * AVG_CHARS_PER_WORD;

const CURSOR_BLINK_FRAMES = 15;      // full on/off cycle length for the cursor
const CURSOR_CHAR = "|";
const HOLD_CURSOR_AFTER_DONE = true; // keep blinking cursor after text fully typed
const EDGE_MARGIN_VH = 10; // gap from bottom frame edge when yPosition is "bottom"
const EDGE_MARGIN_PERCENT = 5; //gap from left/right edge when xPosition is "left/right"

export const TypewriterTextCursor = ({
  text,
  font,
  fontSize,
  fontColor,
  outlineColor,
  xPosition,
  customX,
  yPosition,
  customY,
}) => {
    const frame = useCurrentFrame();
    const { fps, width } = useVideoConfig();
    const letters = [...text];

    const maxWidthPx = width * (1 - (2 * EDGE_MARGIN_PERCENT) / 100);
    const fittedFontSize = useMemo(
        () => getFittedFontSize({ text, font, maxFontSize: fontSize, maxWidthPx }),
        [text, font, fontSize, maxWidthPx]
    );

  // --- Position ---
  const left =
    xPosition === "custom"
      ? `${customX}%`
      : xPosition === "left"
      ? "0%"
      : xPosition === "right"
      ? "100%"
      : "50%"; // center
  const top =
    yPosition === "custom"
      ? `${customY}%`
      : yPosition === "top"
      ? "0%"
      : yPosition === "bottom"
      ? `calc(100% - ${EDGE_MARGIN_VH}vh)`
      : "50%"; // center

  const txAnchor = xPosition === "left" ? "0%" : xPosition === "right" ? "-100%" : "-50%";
  const tyAnchor = yPosition === "top" ? "0%" : yPosition === "bottom" ? "-100%" : "-50%";

  const containerStyle = {
    position: "absolute",
    top,
    left,
    transform: `translate(${txAnchor}, ${tyAnchor})`,
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
  };

  // --- Timing ---
  // Fixed chars-per-second (from TYPING_WPM), independent of durationInFrames.
  // Character 0 reveals at frame 0 (the "+1" below), so the reveal schedule
  // for N characters needs only (N-1) * framesPerChar frames total — the
  // remaining duration just holds the finished static text (cursor still
  // blinking, per HOLD_CURSOR_AFTER_DONE).
  const framesPerChar = fps / CHARS_PER_SECOND;
  const visibleCount = Math.min(letters.length, Math.floor(frame / framesPerChar) + 1);
  const isDoneTyping = visibleCount >= letters.length;

  const cursorOn =
    !isDoneTyping || HOLD_CURSOR_AFTER_DONE
      ? Math.floor(frame / (CURSOR_BLINK_FRAMES / 2)) % 2 === 0
      : false;

  const charStyle = {
    display: "inline-block",
    fontFamily: resolveFont(font),
    fontSize: fittedFontSize,
    color: fontColor,
    WebkitTextStroke:
      outlineColor && outlineColor !== "transparent" ? `2px ${outlineColor}` : "",
    whiteSpace: "pre",
  };

  return (
    <div style={containerStyle}>
      {letters.map((char, i) => (
        <span key={i} style={{ ...charStyle, opacity: i < visibleCount ? 1 : 0 }}>
          {char}
        </span>
      ))}
      <span style={{ ...charStyle, opacity: cursorOn ? 1 : 0 }}>{CURSOR_CHAR}</span>
    </div>
  );
};