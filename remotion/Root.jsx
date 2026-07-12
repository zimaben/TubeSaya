// PROJECT/remotion/Root.jsx

import { Composition, staticFile } from "remotion";
import { AnimateText } from "./compositions/AnimateText/AnimateText";
import { AnimateImage } from "./compositions/AnimateImage/AnimateImage";
import { MarkerText } from "./compositions/MarkerText/MarkerText";
import { DashboardScreen, getDashboardDurationInFrames } from "./compositions/DashboardScreen/DashboardScreen";
import "./fonts";
import db from "../db.json";

// --- Dev override (code-only, never touches db.json) ---
// While tuning a new animation/prop combo in Studio, set this to the macro
// id you're working on to substitute LOCAL_OVERRIDE_PROPS in place of the
// live db.json macro. Set to null for normal behavior (always reflect db.json).
const DEV_OVERRIDE_MACRO_ID = "DashboardScreen"; // e.g. "DashboardScreen"
const LOCAL_OVERRIDE_PROPS = {
  graphic_size: 30,
  graphic_placement_x: "right",
  graphic_placement_y: "top",
  budget: 50000,
  spent: 1200,
  increment: 350,
};

const { settings, installedMacros, lastOpenMacro } = db.app;
const { width, height, fps } = settings.video;

const COMPONENT_MAP = {
  AnimateText,
  AnimateImage,
  MarkerText,
  DashboardScreen,
};

const getProps = (macroId) => {
  if (macroId === DEV_OVERRIDE_MACRO_ID) return LOCAL_OVERRIDE_PROPS;

  const props = { ...(installedMacros[macroId]?.macro ?? {}) };
  // Only resolve through staticFile() for relative paths — uploaded images
  // are stored as base64 data URLs and should be used as-is.
  if (props.src && !props.src.startsWith("data:")) {
    props.src = staticFile(props.src);
  }
  return props;
};

const getDurationInFrames = (macroId) => {
  if (macroId === "DashboardScreen") return getDashboardDurationInFrames(fps);

  const props = getProps(macroId);
  console.log("props:", props);
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

export const Root = () => {
  const activeId = DEV_OVERRIDE_MACRO_ID ?? lastOpenMacro;
  const ActiveComponent = COMPONENT_MAP[activeId];

  if (!ActiveComponent) {
    console.warn(`No component registered for macro "${activeId}"`);
    return null;
  }

  return (
    <Composition
      id={activeId}
      component={ActiveComponent}
      width={width}
      height={height}
      fps={fps}
      durationInFrames={getDurationInFrames(activeId)}
      defaultProps={getProps(activeId)}
    />
  );
};