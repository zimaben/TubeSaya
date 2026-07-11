// PROJECT/remotion/compositions/AnimateImage/AnimateImage.jsx

import { AbsoluteFill } from "remotion";
import { BounceInImage } from "./animations/BounceInImage";

const animationComponents = {
  bounceIn: BounceInImage,
  // fadeIn: FadeInImage,   ← future
  // slideInLeft: SlideInLeftImage, ← future
};

/** Fallback: plain static image, no animation. */
const NoneImage = ({ src, imgWidth, xPosition, customX, yPosition, customY }) => {
  const left =
    xPosition === "custom" ? `${customX}%` : xPosition === "left" ? "0%" : xPosition === "right" ? "100%" : "50%";
  const top =
    yPosition === "custom" ? `${customY}%` : yPosition === "top" ? "0%" : yPosition === "bottom" ? "100%" : "50%";
  const txAnchor = xPosition === "left" ? "0%" : xPosition === "right" ? "-100%" : "-50%";
  const tyAnchor = yPosition === "top" ? "0%" : yPosition === "bottom" ? "-100%" : "-50%";
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        transform: `translate(${txAnchor}, ${tyAnchor})`,
      }}
    >
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img src={src} style={{ width: imgWidth, display: "block" }} />
    </div>
  );
};

export const AnimateImage = (props) => {
  const { animation, src } = props;
  
  if (!src) {
    return null; // or render a placeholder box while no image is set
  }

  const AnimationComponent = animationComponents[animation] ?? NoneImage;
  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <AnimationComponent {...props} />
    </AbsoluteFill>
  );
};