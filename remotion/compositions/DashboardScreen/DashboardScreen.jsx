// PROJECT/remotion/compositions/DashboardScreen/DashboardScreen.jsx

import { AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { resolveFont } from "../../fonts/fonts";
import backgroundSrc from "../../imgs/top-bar-item-base.png";
import chingSfx from "../../sfx/cash-register-ching.mp3";

const FONT = "Gluten-Bold";

const LEAD_IN_SECONDS = 0.5; // frame 0 -> midpoint: counter counts up, popup appears
const POPUP_TOTAL_SECONDS = 1.8; // frame 0 -> popup fully transparent
// Measured directly from the file (122 CBR MPEG1-L3 frames x 1152 samples /
// 44100Hz sample rate) since no ffprobe/mutagen was available to ask at build
// time — not a guess. Re-measure if the sfx file is ever swapped.
const CHING_DURATION_SECONDS = 3.186938775510204;

// fontSize as a fraction of the graphic's rendered width. 0.075 ≈ prior 0.09
// minus "5vw" of the video canvas, converted into this ratio's units at the
// default graphic_size (30%): (0.05 / 0.30) relative cut ≈ -17%. Re-tune
// directly if the on-screen result over/undershoots at your actual graphic_size.
const FONT_SCALE = 0.075;
const STROKE_SCALE = 0.08; // stroke width as a fraction of fontSize
const ROW_GAP_RATIO = 0.35; // gap between the Budget/Spent rows, as a fraction of fontSize
// Popup fontSize is its own fraction of the graphic's width, not derived from
// the main text's FONT_SCALE — tuning the main text size must never move the
// "+" popup, which is already dialed in.
const POPUP_FONT_RATIO = 0.055;
const POPUP_ROTATION_DEG = -8;
const POPUP_DRAG_RATIO = 0.09; // upward drag distance, as a fraction of the graphic's rendered width

const ICON_INSET_RATIO = 0.25; // left portion of the graphic reserved for its icon art; text is centered in the remaining space to its right
const TEXT_SHIFT_RATIO = 0.025; // Budget/Spent columns nudge left by this fraction of the video width, independent of the popup
const POPUP_RESERVE_CHARS = 7; // rough "+$X,XXX" width budget so placement math keeps the popup on-screen
const CHAR_WIDTH_EM = 0.62; // average glyph width for this font, in units of its own font-size

export const getDashboardDurationInFrames = (fps) => {
  const leadInFrames = Math.round(LEAD_IN_SECONDS * fps);
  const popupTotalFrames = Math.round(POPUP_TOTAL_SECONDS * fps);
  const chingFrames = Math.ceil(CHING_DURATION_SECONDS * fps);
  const tailFrames = Math.max(popupTotalFrames - leadInFrames, chingFrames);
  return leadInFrames + tailFrames;
};

const formatMoney = (value) => `$${Math.round(value).toLocaleString()}`;

const textStyle = (fontSizePx, strokeWidthPx) => ({
  fontFamily: resolveFont(FONT),
  fontSize: fontSizePx,
  color: "#000",
  WebkitTextStroke: `${strokeWidthPx}px #fff`,
  paintOrder: "stroke fill",
  whiteSpace: "nowrap",
});

export const DashboardScreen = ({
  graphic_size = 30,
  graphic_placement_x = "right",
  graphic_placement_y = "top",
  budget = 0,
  spent = 0,
  increment = 0,
}) => {
  const frame = useCurrentFrame();
  const { width, fps } = useVideoConfig();

  const leadInFrames = Math.round(LEAD_IN_SECONDS * fps);
  const popupTotalFrames = Math.round(POPUP_TOTAL_SECONDS * fps);

  const graphicWidthPx = width * (graphic_size / 100);
  const fontSizePx = graphicWidthPx * FONT_SCALE;
  const strokeWidthPx = fontSizePx * STROKE_SCALE;
  const popupFontSizePx = graphicWidthPx * POPUP_FONT_RATIO;
  const popupStrokeWidthPx = popupFontSizePx * STROKE_SCALE;
  const popupDragPx = graphicWidthPx * POPUP_DRAG_RATIO;
  const iconInsetPx = graphicWidthPx * ICON_INSET_RATIO;
  const textShiftPx = width * TEXT_SHIFT_RATIO;
  const popupReservePx = fontSizePx * 0.25 + popupFontSizePx * POPUP_RESERVE_CHARS * CHAR_WIDTH_EM;

  // Same anchor pattern as AnimateImage's NoneImage (position by edge, then
  // translate back by the anchored edge), but computed in px off `width` so
  // the popup's reserved space (below) can shift the anchor left without
  // fighting a mixed %/px transform. xWeight is how much the anchor pulls
  // toward the right edge — 0 at "left" (no reserve needed, plenty of room
  // to its right), 1 at "right" (full reserve, or the popup goes off-screen).
  const xWeight = graphic_placement_x === "left" ? 0 : graphic_placement_x === "right" ? 1 : 0.5;
  const leftEdgePx = graphic_placement_x === "left" ? 0 : graphic_placement_x === "right" ? width : width / 2;
  const left = `${leftEdgePx - popupReservePx * xWeight}px`;
  const top = graphic_placement_y === "top" ? "0%" : graphic_placement_y === "bottom" ? "100%" : "50%";
  const translateX = graphic_placement_x === "left" ? "0%" : graphic_placement_x === "right" ? "-100%" : "-50%";
  const translateY = graphic_placement_y === "top" ? "0%" : graphic_placement_y === "bottom" ? "-100%" : "-50%";

  const spentNow = interpolate(frame, [0, leadInFrames], [spent, spent + increment], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Position eases with a touch of overshoot (bounce); opacity fades on a
  // plain ease-out so it doesn't flicker as the overshoot settles.
  const popupDragProgress = interpolate(frame, [0, popupTotalFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.4)),
  });
  const popupFadeProgress = interpolate(frame, [0, popupTotalFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });
  const popupOpacity = 1 - popupFadeProgress;
  const popupTranslateY = -popupDragPx * popupDragProgress;

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <div style={{ position: "absolute", top, left, transform: `translate(${translateX}, ${translateY})`, width: graphicWidthPx }}>
        <Img src={backgroundSrc} style={{ width: "100%", height: "auto", display: "block" }} />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: iconInsetPx + (graphicWidthPx - iconInsetPx) / 2 - textShiftPx,
            transform: "translate(-50%, -50%)",
            display: "flex",
            flexDirection: "column",
            gap: fontSizePx * ROW_GAP_RATIO,
          }}
        >
          <div style={textStyle(fontSizePx, strokeWidthPx)}>Budget: {formatMoney(budget)}</div>
          <div style={{ position: "relative", ...textStyle(fontSizePx, strokeWidthPx) }}>
            Spent: {formatMoney(spentNow)}
            <div
              style={{
                position: "absolute",
                left: "100%",
                top: 0,
                marginLeft: fontSizePx * 0.25,
                opacity: popupOpacity,
                // Cancels the parent column's TEXT_SHIFT_RATIO nudge so the
                // popup stays exactly where it was before that shift.
                transform: `translateX(${textShiftPx}px) translateY(${popupTranslateY}px) rotate(${POPUP_ROTATION_DEG}deg)`,
                ...textStyle(popupFontSizePx, popupStrokeWidthPx),
              }}
            >
              +{formatMoney(increment)}
            </div>
          </div>
        </div>
      </div>
      <Sequence from={leadInFrames} layout="none">
        <Audio src={chingSfx} />
      </Sequence>
    </AbsoluteFill>
  );
};
