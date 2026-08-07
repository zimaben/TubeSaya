// PROJECT/remotion/compositions/Checklist/CheckBox.jsx

const VIEWBOX = 100;
const STROKE_WIDTH = 12; // viewBox units — bold marker-stroke look, scales with `size` since the whole svg scales uniformly

// Hand-drawn square: corners nudged off-grid so it doesn't read as a perfect
// geometric rectangle (same intent as MarkerCircle's bezier wobble).
const BOX_PATH = "M 6 8 L 94 3 L 97 92 L 3 96 Z";

// Checkmark: short down-stroke then long up-stroke, one continuous path so a
// single stroke-dasharray/dashoffset pair animates the whole tick at once.
const CHECK_PATH = "M 18 52 L 42 76 L 88 14";
const CHECK_LENGTH = 100; // pathLength normalizes the path's real length to this
const CHECK_SCALE = 1.5; // drawn bigger than the box, scaled from the box's own center, so its tip overflows past the box's edges
// The checkmark's visual weight sits at its bottom vertex (the point of the
// "V"), not its geometric center — after scaling from the box's center that
// vertex lands near the box's bottom edge, which reads as too low. Lifting
// it back up (applied *after* the scale, as a separate step) moves the
// vertex to just below the box's own vertical center.
const CHECK_LIFT = 20; // viewBox units, applied after CHECK_SCALE

// Hand-drawn checkbox + checkmark, drawn ourselves (no icon library) per the
// task's explicit ask. Box is always fully drawn; the checkmark's draw-on
// reveal is driven by `progress` (0-1) — same stroke-dasharray/dashoffset
// technique as MarkerText's MarkerCircle.jsx.
export const CheckBox = ({
  checked = false,
  progress, // 0-1 draw-on progress; omit for a static box (fully drawn if checked, hidden if not)
  boxColor = "#1E1E1E",
  checkColor = "#1E1E1E",
  size = 48,
}) => {
  const checkProgress = progress ?? (checked ? 1 : 0);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      // position:relative (no offset — same layout as static) makes this a
      // positioned element so it stacks correctly above sibling positioned
      // backgrounds (e.g. TornPaperBackground) by DOM order, instead of a
      // static element always painting below any positioned sibling
      // regardless of source order.
      style={{ flexShrink: 0, overflow: "visible", position: "relative" }}
    >
      <path d={BOX_PATH} fill="none" stroke={boxColor} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
      <path
        d={CHECK_PATH}
        transform={`translate(0 -${CHECK_LIFT}) translate(50 50) scale(${CHECK_SCALE}) translate(-50 -50)`}
        fill="none"
        stroke={checkColor}
        strokeWidth={STROKE_WIDTH * 1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={CHECK_LENGTH}
        strokeDasharray={CHECK_LENGTH}
        strokeDashoffset={CHECK_LENGTH - CHECK_LENGTH * checkProgress}
      />
    </svg>
  );
};
