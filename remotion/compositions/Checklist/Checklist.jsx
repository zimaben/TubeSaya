// PROJECT/remotion/compositions/Checklist/Checklist.jsx

import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { resolveFont } from "../../fonts/fonts";
import { CheckBox } from "./CheckBox";
import { TornPaperBackground } from "./TornPaperBackground";

// Both styles use the same Permanent Marker font; the difference is purely
// where the torn-paper card renders — around each checkbox individually, or
// as one card behind the whole list. Keyed by style so a future style can
// register its own font here without restructuring.
const STYLE_FONTS = {
  "Whiteboard (boxes only)": "PermanentMarker-Regular",
  "Whiteboard (full background)": "PermanentMarker-Regular",
};
const DEFAULT_STYLE = "Whiteboard (boxes only)";

// Whole-list torn-paper card padding, as a fraction of the composition's own
// height/width — converted to real px below (via useVideoConfig), never raw
// CSS vh/vw (see TornPaperBackground.jsx for why: vh/vw break inside
// Remotion's scaled preview).
const BACKGROUND_PADDING_TOP_RATIO = 0.08; // of height
const BACKGROUND_PADDING_BOTTOM_RATIO = 0.08; // of height — kept equal to top
const BACKGROUND_PADDING_SIDE_RATIO = 0.06; // of width, either side

// Per-checkbox torn-paper card padding, as a fraction of the box's own size.
const BOX_BACKGROUND_PADDING_RATIO = 0.35;

const CHECK_DRAW_SECONDS = 0.4; // how long the "current" item's checkmark takes to draw on
const TAIL_SECONDS = 0.4; // static beat after the draw-on finishes, so the clip doesn't cut off mid-stroke
export const getChecklistDurationInFrames = (fps) =>
  Math.round((CHECK_DRAW_SECONDS + TAIL_SECONDS) * fps);

const ROW_GAP_RATIO = 0.5; // vertical gap between item rows, relative to boxSize
const BOX_SIZE_RATIO = 1.1; // box (and its stroke) sized relative to fontSize, so the slider drives both together
const EDGE_MARGIN_PERCENT = 6; // how far the whole list block sits from the screen edge, % of video width

// Renders the checklist as a static list of items; any item with
// `item.animate` set plays the hand-drawn checkmark draw-on (see
// CheckBox.jsx), all on the same shared draw window — every other item just
// shows its own checked/unchecked state instantly. This is what the
// video/first-frame/last-frame render steps (RENDER_PROFILES.DashboardScreen,
// shared with BudgetTracker) capture as the unchecked-box and checked-box
// stills.
export const Checklist = ({
  checklistItems = [],
  checklistPosition = "left",
  checklistStyle = DEFAULT_STYLE,
  fontSize = 44,
  checklistBoxColor = "#1E1E1E",
  checklistCheckColor = "#1E1E1E",
  checklistTextColor = "#1E1E1E",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const drawFrames = Math.max(1, Math.round(CHECK_DRAW_SECONDS * fps));
  const currentProgress = interpolate(frame, [0, drawFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const font = STYLE_FONTS[checklistStyle] ?? STYLE_FONTS[DEFAULT_STYLE];
  const hasListBackground = checklistStyle === "Whiteboard (full background)";
  const hasBoxBackground = checklistStyle === "Whiteboard (boxes only)";
  const boxSize = fontSize * BOX_SIZE_RATIO;
  const boxBackgroundPaddingPx = boxSize * BOX_BACKGROUND_PADDING_RATIO;
  const isRight = checklistPosition === "right";

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      {/* Anchored at the screen edge, vertically centered; sized to fit-content
          via normal flex layout below rather than a computed bounding box, so
          it always tracks the actual rendered width/height of the list. */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          [isRight ? "right" : "left"]: `${EDGE_MARGIN_PERCENT}%`,
          transform: "translateY(-50%)",
        }}
      >
        {hasListBackground && checklistItems.length > 0 && (
          <TornPaperBackground
            paddingTopPx={height * BACKGROUND_PADDING_TOP_RATIO}
            paddingBottomPx={height * BACKGROUND_PADDING_BOTTOM_RATIO}
            paddingLeftPx={width * BACKGROUND_PADDING_SIDE_RATIO}
            paddingRightPx={width * BACKGROUND_PADDING_SIDE_RATIO}
          />
        )}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: boxSize * ROW_GAP_RATIO,
          }}
        >
          {checklistItems.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: boxSize * 0.35,
              }}
            >
              <div style={{ position: "relative", width: boxSize, height: boxSize }}>
                {hasBoxBackground && (
                  <TornPaperBackground
                    paddingTopPx={boxBackgroundPaddingPx}
                    paddingBottomPx={boxBackgroundPaddingPx}
                    paddingLeftPx={boxBackgroundPaddingPx}
                    paddingRightPx={boxBackgroundPaddingPx}
                  />
                )}
                <CheckBox
                  checked={item.checked}
                  progress={item.animate ? currentProgress : undefined}
                  boxColor={checklistBoxColor}
                  checkColor={checklistCheckColor}
                  size={boxSize}
                />
              </div>
              <span style={{ fontFamily: resolveFont(font), fontSize, color: checklistTextColor, whiteSpace: "nowrap" }}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
