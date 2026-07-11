// PROJECT/remotion/compositions/MarkerText/MarkerCircle.jsx

import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

const VIEWBOX = 100; // normalized path coordinate space; the <svg> stretches it to actual (elliptical) render size via width/height + preserveAspectRatio="none"
const STROKE_WIDTH = 4; // viewBox units — scales proportionally with the rendered SVG size, never a fixed pixel value
const WIDTH_FACTOR = 1.35; // ellipse: rendered wider than tall

const CENTER = 50;
const RADIUS = 46;
const START_ANGLE_DEGREES = -60; // rotated 30° clockwise from the top (12 o'clock), toward 2 o'clock
const CHUNK_DEGREES = 90; // max degrees per bezier chunk — keeps the circular-arc approximation accurate
const DROP_DISTANCE = 7; // viewBox units the loop has sunk by, by the time it's swept all the way back around

const toRadians = (degrees) => (degrees * Math.PI) / 180;
// How far the loop has drifted downward at a given point in the sweep —
// linear in swept angle, so the drift is spread evenly across the whole
// curve instead of happening at one point.
const driftAt = (sweptDegrees) => (DROP_DISTANCE * sweptDegrees) / 360;

// Constant radius throughout (every chunk uses the same circular-arc-to
// -bezier construction as a true circle, so it's still uniformly round),
// but the center itself sinks a little further with every degree swept. By
// 360° it's sunk the full DROP_DISTANCE, so the curve ends directly below
// where it started.
const arcChunks = [];
for (let swept = 0; swept < 360; swept += CHUNK_DEGREES) {
  const chunkDegrees = Math.min(CHUNK_DEGREES, 360 - swept);
  const phi0 = toRadians(START_ANGLE_DEGREES + swept);
  const phi1 = toRadians(START_ANGLE_DEGREES + swept + chunkDegrees);
  const drift0 = driftAt(swept);
  const drift1 = driftAt(swept + chunkDegrees);
  const kappa = (4 / 3) * Math.tan(toRadians(chunkDegrees) / 4);

  const p1x = CENTER + RADIUS * Math.cos(phi1);
  const p1y = CENTER + drift1 + RADIUS * Math.sin(phi1);
  const cp1x = CENTER + RADIUS * Math.cos(phi0) - kappa * RADIUS * Math.sin(phi0);
  const cp1y = CENTER + drift0 + RADIUS * Math.sin(phi0) + kappa * RADIUS * Math.cos(phi0);
  const cp2x = p1x + kappa * RADIUS * Math.sin(phi1);
  const cp2y = p1y - kappa * RADIUS * Math.cos(phi1);

  arcChunks.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1x} ${p1y}`);
}

const startX = CENTER + RADIUS * Math.cos(toRadians(START_ANGLE_DEGREES));
const startY = CENTER + RADIUS * Math.sin(toRadians(START_ANGLE_DEGREES));

const CIRCLE_PATH = `M ${startX} ${startY} ` + arcChunks.join(" ");

export const MarkerCircle = ({
  color = "#1E1E1E",
  duration = 1.2,
  size = 0.38, // vertical diameter, as a fraction of the video's shorter side (width stretches out from there via WIDTH_FACTOR)
  top = 50, // % of video height, anchored at the circle's center
  left = 50, // % of video width, anchored at the circle's center
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const shortSide = Math.min(width, height) * size;

  const drawFrames = Math.max(1, Math.round(duration * fps));
  const progress = interpolate(frame, [0, drawFrames], [0, VIEWBOX], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <svg
      width={shortSide * WIDTH_FACTOR}
      height={shortSide}
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      preserveAspectRatio="none"
      style={{
        position: "absolute",
        top: `${top}%`,
        left: `${left}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <path
        d={CIRCLE_PATH}
        fill="none"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={VIEWBOX}
        strokeDasharray={VIEWBOX}
        strokeDashoffset={VIEWBOX - progress}
        opacity={0.9}
      />
    </svg>
  );
};
