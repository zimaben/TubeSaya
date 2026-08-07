// PROJECT/remotion/compositions/Checklist/TornPaperBackground.jsx

import { useId } from "react";

// Procedural torn-paper card (no texture asset): a jagged closed path run
// through an feTurbulence/feDisplacementMap filter for rough, fibrous-edge
// distortion. Fallback if this doesn't read as "torn paper": source/generate
// a real torn-paper texture image and tile it at the border instead — see
// project memory (checklist_torn_paper_background).
const TORN_JAG_PERCENT = 1.2; // max perpendicular jitter per edge segment, as % of the card's own local 0-100 space
const TORN_SEGMENTS_PER_SIDE = 8;

// Cheap deterministic pseudo-random (same seed sequence every time) so the
// torn edge is stable across renders/instances instead of shimmering.
const pseudoRandom = (seed) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const buildTornPath = () => {
  const points = [];
  let seed = 0;
  const addEdge = (x0, y0, x1, y1) => {
    const isHorizontal = y0 === y1;
    for (let i = 0; i <= TORN_SEGMENTS_PER_SIDE; i++) {
      const t = i / TORN_SEGMENTS_PER_SIDE;
      const jag = (pseudoRandom(seed++) - 0.5) * 2 * TORN_JAG_PERCENT;
      const x = x0 + (x1 - x0) * t + (isHorizontal ? 0 : jag);
      const y = y0 + (y1 - y0) * t + (isHorizontal ? jag : 0);
      points.push(`${x.toFixed(2)} ${y.toFixed(2)}`);
    }
  };
  addEdge(0, 0, 100, 0); // top
  addEdge(100, 0, 100, 100); // right
  addEdge(100, 100, 0, 100); // bottom
  addEdge(0, 100, 0, 0); // left
  return `M ${points.join(" L ")} Z`;
};

const TORN_PATH = buildTornPath();

// Fills its positioned ancestor's box exactly, then bleeds outward by the
// padding props, given in real px. (Deliberately NOT vh/vw — those resolve
// against the browser's actual viewport, which is correct for a real file
// render but wrong inside Remotion Studio/Player, where the composition is
// visually scaled down via CSS transform without vh/vw scaling along with
// it — the padding would look correct-ish on export but balloon in preview.
// Callers should compute px from useVideoConfig()'s width/height instead,
// same convention as the rest of this composition tree, e.g. MarkerCircle.jsx.)
// The ancestor is expected to be a fit-content-sized wrapper around the real
// content, so the card's size always tracks actual rendered content
// width/height instead of an approximated bounding box. Top/bottom are
// independently tunable.
// `preserveAspectRatio="none"` stretches the 0-100 local path independently
// per axis, so it fits any aspect ratio card without distortion math here.
export const TornPaperBackground = ({ paddingTopPx, paddingBottomPx, paddingLeftPx, paddingRightPx }) => {
  const filterId = useId().replace(/:/g, ""); // colons in useId() output break url(#...) references in some browsers

  return (
    // <svg> is a replaced element (like <img>) — CSS does NOT solve its auto
    // width/height from top+bottom/left+right insets the way it does for an
    // ordinary <div>; it falls back to intrinsic/default sizing instead,
    // which is why the inset math needs to live on a plain div wrapper. The
    // svg then just fills that (correctly-sized) div at 100%/100%.
    <div
      style={{
        position: "absolute",
        top: `-${paddingTopPx}px`,
        bottom: `-${paddingBottomPx}px`,
        left: `-${paddingLeftPx}px`,
        right: `-${paddingRightPx}px`,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ width: "100%", height: "100%", display: "block", overflow: "visible" }}
      >
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="7" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <path d={TORN_PATH} fill="#FFFFFF" filter={`url(#${filterId})`} />
      </svg>
    </div>
  );
};
