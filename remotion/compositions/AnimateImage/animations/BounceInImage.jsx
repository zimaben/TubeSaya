// PROJECT/remotion/compositions/animations/BounceInImage.jsx

import { useState } from "react";
import {
  Img,
  useCurrentFrame,
  useVideoConfig,
  delayRender,
  continueRender,
} from "remotion";

const DROP_FRAMES = 20;
const DROP_DECAY = 4.2;
const DROP_FREQUENCY = 3.2;
const SAFETY_MARGIN_PX = 40;

const POP_START_FRAME = DROP_FRAMES - 2;
const POP_FRAMES = 14;
const POP_AMPLITUDE = 0.08;
const POP_DECAY = 4.5;
const POP_FREQUENCY = 3.0;

export const BounceInImage = ({
  src,
  imgWidth,
  xPosition,
  customX,
  yPosition,
  customY,
}) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig(); // frame height — unambiguous, no collision with imgWidth

  const [handle] = useState(() => delayRender("Measuring image dimensions"));
  const [imgHeight, setImgHeight] = useState(0);

  const handleLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    setImgHeight(naturalHeight * (imgWidth / naturalWidth));
    continueRender(handle);
  };

  const leftPercent =
    xPosition === "custom" ? customX : xPosition === "left" ? 0 : xPosition === "right" ? 100 : 50;
  const topPercent =
    yPosition === "custom" ? customY : yPosition === "top" ? 0 : yPosition === "bottom" ? 100 : 50;

  const txAnchorFrac = xPosition === "left" ? 0 : xPosition === "right" ? -1 : -0.5;
  const tyAnchorFrac = yPosition === "top" ? 0 : yPosition === "bottom" ? -1 : -0.5;

  const restTopPx = (topPercent / 100) * height;
  const topEdgeAtRestPx = restTopPx + tyAnchorFrac * imgHeight;
  const dropStartPx = Math.max(topEdgeAtRestPx + imgHeight, 0) + SAFETY_MARGIN_PX;

  const dt = Math.min(frame, DROP_FRAMES) / DROP_FRAMES;
  const dropEnvelope = Math.exp(-DROP_DECAY * dt);
  const dropOscillation = Math.cos(dt * DROP_FREQUENCY * Math.PI);
  const dropOffsetPx =
    frame < DROP_FRAMES ? -dropStartPx * dropEnvelope * dropOscillation : 0;

  const pt = Math.max(0, Math.min(frame - POP_START_FRAME, POP_FRAMES)) / POP_FRAMES;
  const popEnvelope = Math.exp(-POP_DECAY * pt);
  const popOscillation = Math.sin(pt * POP_FREQUENCY * Math.PI);
  const scale =
    frame > POP_START_FRAME && frame < POP_START_FRAME + POP_FRAMES
      ? 1 + POP_AMPLITUDE * popEnvelope * popOscillation
      : 1;

  const containerStyle = {
    position: "absolute",
    top: `${topPercent}%`,
    left: `${leftPercent}%`,
    transform: `translate(${txAnchorFrac * 100}%, ${tyAnchorFrac * 100}%) translateY(${dropOffsetPx}px) scale(${scale})`,
  };

  return (
    <div style={containerStyle}>
      <Img src={src} style={{ width: imgWidth, display: "block" }} onLoad={handleLoad} />
    </div>
  );
};