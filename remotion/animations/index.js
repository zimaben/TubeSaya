// remotion/animations/index.js

import { interpolate, spring } from "remotion";

export const animationMap = {
  none: (frame, fps) => ({
    opacity: 1,
    transform: "translate(0, 0) scale(1)",
  }),

  fadeIn: (frame, fps) => ({
    opacity: interpolate(frame, [0, 30], [0, 1], {
      extrapolateRight: "clamp",
    }),
    transform: "translate(0, 0)",
  }),

  slideUp: (frame, fps) => ({
    opacity: interpolate(frame, [0, 20], [0, 1]),
    transform: `translateY(${interpolate(
      frame,
      [0, 20],
      [100, 0]
    )}px)`,
  }),

  slideDown: (frame, fps) => ({
    opacity: interpolate(frame, [0, 20], [0, 1]),
    transform: `translateY(${interpolate(
      frame,
      [0, 20],
      [-100, 0]
    )}px)`,
  }),

  slideLeft: (frame, fps) => ({
    opacity: interpolate(frame, [0, 20], [0, 1]),
    transform: `translateX(${interpolate(
      frame,
      [0, 20],
      [300, 0]
    )}px)`,
  }),

  slideRight: (frame, fps) => ({
    opacity: interpolate(frame, [0, 20], [0, 1]),
    transform: `translateX(${interpolate(
      frame,
      [0, 20],
      [-300, 0]
    )}px)`,
  }),

  pop: (frame, fps) => {
    const scale = spring({
      frame,
      fps,
      config: {
        damping: 8,
      },
    });

    return {
      opacity: 1,
      transform: `scale(${scale})`,
    };
  },

  typewriter: (frame, fps, text) => ({
    visibleChars: Math.floor(frame / 3),
  }),

  dance: (frame, fps) => ({
    opacity: 1,
    transform: `
      rotate(${Math.sin(frame / 10) * 10}deg)
      translateY(${Math.sin(frame / 5) * 10}px)
    `,
  }),
};