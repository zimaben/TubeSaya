// PROJECT/remotion/compositions/AnimateImage/animations/KenBurnsPan.jsx

import { useState } from "react";
import {
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  delayRender,
  continueRender,
} from "remotion";

// Zoom is expressed as a multiple of the CSS `cover`-fit scale (the scale at
// which the image exactly covers the canvas on its tighter axis) — 1.0 always
// means "fully covers, no gap on either axis", so animating between these two
// factors can never expose canvas edges.
const ZOOM_START_FACTOR = 1.2;
const ZOOM_END_FACTOR = 1.0;

// Pan settles from a top-left-biased crop to dead-center as the zoom eases
// down to the cover baseline, where slack (and therefore offset) hits zero.
const PAN_FRACTION_X = -1;
const PAN_FRACTION_Y = -1;

export const KenBurnsPan = ({ src }) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  const [handle] = useState(() => delayRender("Measuring image dimensions"));
  const [naturalSize, setNaturalSize] = useState(null);

  const handleLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    setNaturalSize({ naturalWidth, naturalHeight });
    continueRender(handle);
  };

  const progress = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });

  const zoomFactor = ZOOM_START_FACTOR + (ZOOM_END_FACTOR - ZOOM_START_FACTOR) * progress;

  let renderedWidth = width;
  let renderedHeight = height;
  let offsetX = 0;
  let offsetY = 0;

  if (naturalSize) {
    const coverScale = Math.max(
      width / naturalSize.naturalWidth,
      height / naturalSize.naturalHeight
    );
    const scale = coverScale * zoomFactor;
    renderedWidth = naturalSize.naturalWidth * scale;
    renderedHeight = naturalSize.naturalHeight * scale;

    const slackX = renderedWidth - width;
    const slackY = renderedHeight - height;
    offsetX = (slackX / 2) * PAN_FRACTION_X;
    offsetY = (slackY / 2) * PAN_FRACTION_Y;
  }

  return (
    <div style={{ position: "absolute", top: 0, left: 0, width, height, overflow: "hidden" }}>
      <Img
        src={src}
        onLoad={handleLoad}
        style={{
          position: "absolute",
          top: `calc(50% + ${offsetY}px)`,
          left: `calc(50% + ${offsetX}px)`,
          width: renderedWidth,
          height: renderedHeight,
          transform: "translate(-50%, -50%)",
          display: "block",
        }}
      />
    </div>
  );
};
