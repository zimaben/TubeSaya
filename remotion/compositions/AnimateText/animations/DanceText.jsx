import { useCurrentFrame, useVideoConfig } from "remotion";
import { useMemo } from "react";
import { resolveFont } from "../../../fonts/fonts";
import { getFittedFontSize } from "../../../fonts/fitfont";;

const BOUNCE_AMPLITUDE = 3; // px
const ROTATION_MAX = 2;     // deg
const CYCLE_FRAMES = 40;    // frames per full bounce cycle — fixed, independent of duration
const PHASE_OFFSET_FRAMES = 5; // stagger between letters
const EDGE_MARGIN_VH = 10; // gap from bottom frame edge when yPosition is "top/bottom"
const EDGE_MARGIN_PERCENT = 5; //gap from left/right edge when xPosition is "left/right"

export const DanceText = ({
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
  const { fps, durationInFrames, width } = useVideoConfig();
  const letters = [...text];

  const maxWidthPx = width * (1 - (2 * EDGE_MARGIN_PERCENT) / 100);
  const fittedFontSize = useMemo(
    () => getFittedFontSize({ text, font, maxFontSize: fontSize, maxWidthPx }),
    [text, font, fontSize, maxWidthPx]
  );

  // --- Position ---
  // Resolve each axis independently. "custom" uses the % value, everything
  // else uses flex alignment on the AbsoluteFill wrapper (handled in
  // AnimateText). Here we just position the letter-row itself.
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
      ? `${EDGE_MARGIN_VH}vh`
      : yPosition === "bottom"
      ? `calc(100% - ${EDGE_MARGIN_VH}vh)`
      : "50%"; // center

  // translateX/Y to anchor the row at the resolved point
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
  // Cycle length is fixed at CYCLE_FRAMES regardless of durationInFrames, so
  // bounce speed stays consistent whether the composition is a 2-second or
  // 4-second sentence. Number of cycles the animation runs (for reference,
  // not used in the math below) = durationInFrames / CYCLE_FRAMES.
  const cycleFrames = CYCLE_FRAMES;

  return (
    <div style={containerStyle}>
      {letters.map((char, i) => {
        const isEven = i % 2 === 0;
        const phaseOffset = i * PHASE_OFFSET_FRAMES;
        // Normalised position within the current cycle [0, 1]
        const cyclePos = ((frame + phaseOffset) % cycleFrames) / cycleFrames;
        // Sine goes 0 → 1 → 0 over one full cycle — starts and ends at rest
        const sine = Math.sin(cyclePos * Math.PI * 2);
        // Soften with a spring-like curve: keep the sign, square the magnitude
        // for a snappier peak and longer rest near zero
        // const driven = Math.sign(sine) * Math.pow(Math.abs(sine), 0.7); //This one is "swingy" - bouncing off the top/bottom
        const driven = Math.sign(sine) * Math.pow(Math.abs(sine), .9); //A 1 value is a steady linear animation, no bounce
        //const driven = Math.sign(sine) * Math.pow(Math.abs(sine), 1.2); //This one is a "sticky" - slowing down in the middle
        const translateY = isEven
          ? -BOUNCE_AMPLITUDE * driven
          : BOUNCE_AMPLITUDE * driven;
        const rotate = isEven
          ? ROTATION_MAX * driven
          : -ROTATION_MAX * driven;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              fontFamily: resolveFont(font),
              fontSize: fittedFontSize,
              color: fontColor,
              WebkitTextStroke:
                outlineColor && outlineColor !== "transparent"
                  ? `2px ${outlineColor}`
                  : "",
              transform: `translateY(${translateY}px) rotate(${rotate}deg)`,
              whiteSpace: "pre",
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};