// PROJECT/remotion/resolveComposition.js
// Shared by Root.jsx (Studio) and the app-side Player preview (SidebarFooter.jsx)
// so composition/duration resolution logic lives in exactly one place.

import { staticFile } from "remotion";
import { AnimateText } from "./compositions/AnimateText/AnimateText.jsx";
import { AnimateImage } from "./compositions/AnimateImage/AnimateImage.jsx";
import { MarkerText } from "./compositions/MarkerText/MarkerText.jsx";
import { DashboardScreen, getDashboardDurationInFrames } from "./compositions/DashboardScreen/DashboardScreen.jsx";
import { getChecklistDurationInFrames } from "./compositions/Checklist/Checklist.jsx";

export const COMPONENT_MAP = {
  AnimateText,
  AnimateImage,
  MarkerText,
  DashboardScreen,
};

// Only resolve through staticFile() for relative paths — uploaded images
// are stored as base64 data URLs and should be used as-is.
export const resolveProps = (macro) => {
  const props = { ...(macro ?? {}) };
  if (props.src && !props.src.startsWith("data:")) {
    props.src = staticFile(props.src);
  }
  return props;
};

export const getDurationInFrames = (macroId, macro, fps) => {
  if (macroId === "DashboardScreen") {
    if (macro?.overlayType === "Checklist") return getChecklistDurationInFrames(fps);
    return getDashboardDurationInFrames(fps);
  }

  const props = macro ?? {};
  if (Array.isArray(props.sequence) && props.sequence.length > 0) {
    const totalSeconds = props.sequence.reduce(
      (sum, item) => sum + (item.duration ?? 2),
      0
    );
    return Math.round(totalSeconds * fps);
  }

  const seconds = props.duration ?? 4;
  return Math.round(seconds * fps);
};
