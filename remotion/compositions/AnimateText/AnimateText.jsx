// PROJECT/remotion/compositions/AnimateText/AnimateText.jsx

import { AbsoluteFill, Series, useVideoConfig } from "remotion";
import { DanceText } from "./animations/DanceText";
import { TypewriterText } from "./animations/TypewriterText";
import { TypewriterTextCursor } from "./animations/TypewriterTextCursor";

const EDGE_MARGIN_VH = 4; // gap from top/bottom frame edge when yPosition is "top"/"bottom"
const DEFAULT_LINE_DURATION = 2; // seconds, fallback if a sequence item has no duration

const animationComponents = {
  dance: DanceText,
  typewriter: TypewriterText,
  typewriterCursor: TypewriterTextCursor,
};

/** Fallback: plain centred text, no animation. */
const NoneText = ({
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
  const resolveFont =
    typeof window !== "undefined"
      ? require("../../fonts/fonts").resolveFont
      : (f) => f;
  const hAlign =
    xPosition === "center" ? "center" : xPosition === "left" ? "flex-start" : "flex-end";
  const vAlign =
    yPosition === "center" ? "center" : yPosition === "top" ? "flex-start" : "flex-end";
  return (
    <AbsoluteFill
      style={{
        justifyContent: hAlign,
        alignItems: vAlign,
        paddingTop: yPosition === "top" ? `${EDGE_MARGIN_VH}vh` : 0,
        paddingBottom: yPosition === "bottom" ? `${EDGE_MARGIN_VH}vh` : 0,
        backgroundColor: "transparent",
      }}
    >
      <div
        style={{
          fontFamily: resolveFont(font),
          fontSize,
          color: fontColor,
          WebkitTextStroke:
            outlineColor && outlineColor !== "transparent"
              ? `2px ${outlineColor}`
              : "",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

export const AnimateText = (props) => {
  const { animation, sequence, ...lockedProps } = props;
  const { fps } = useVideoConfig();
  const AnimationComponent = animationComponents[animation] ?? NoneText;

  // Sequence mode: array of { text, duration }. Locked/shared style props
  // (font, color, position, animation, etc.) are spread onto every item;
  // text/duration come from each item and override the staged values.
  console.log("AnimateText sequence:", sequence);
  if (Array.isArray(sequence) && sequence.length > 0) {
    return (
      <AbsoluteFill style={{ backgroundColor: "transparent" }}>
        <Series>
          {sequence.map((item, i) => (
            <Series.Sequence
              key={i}
              durationInFrames={Math.round((item.duration ?? DEFAULT_LINE_DURATION) * fps)}
            >
              <AnimationComponent {...lockedProps} {...item} />
            </Series.Sequence>
          ))}
        </Series>
      </AbsoluteFill>
    );
  }

  // Single-shot mode (unchanged behavior).
  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <AnimationComponent {...lockedProps} />
    </AbsoluteFill>
  );
};