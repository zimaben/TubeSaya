// PROJECT/remotion/Root.jsx

import { Composition } from "remotion";
import { COMPONENT_MAP, resolveProps, getDurationInFrames } from "./resolveComposition";
import "./fonts";
import db from "../db.json";

// --- Dev override (code-only, never touches db.json) ---
// While tuning a new animation/prop combo in Studio, set this to the macro
// id you're working on to substitute LOCAL_OVERRIDE_PROPS in place of the
// live db.json macro. Set to null for normal behavior (always reflect db.json).
const DEV_OVERRIDE_MACRO_ID = null; // e.g. "DashboardScreen"
const LOCAL_OVERRIDE_PROPS = {
  graphic_size: 30,
  graphic_placement_x: "left",
  graphic_placement_y: "top",
  budget: 50000,
  spent: 1200,
  increment: 350,
};

const { settings, installedMacros, lastOpenMacro } = db.app;
const { width, height, fps } = settings.video;

const getRawMacro = (macroId) =>
  macroId === DEV_OVERRIDE_MACRO_ID ? LOCAL_OVERRIDE_PROPS : installedMacros[macroId]?.macro;

export const Root = () => {
  const activeId = DEV_OVERRIDE_MACRO_ID ?? lastOpenMacro;
  const ActiveComponent = COMPONENT_MAP[activeId];

  if (!ActiveComponent) {
    console.warn(`No component registered for macro "${activeId}"`);
    return null;
  }

  const rawMacro = getRawMacro(activeId);

  return (
    <Composition
      id={activeId}
      component={ActiveComponent}
      width={width}
      height={height}
      fps={fps}
      durationInFrames={getDurationInFrames(activeId, rawMacro, fps)}
      defaultProps={resolveProps(rawMacro)}
    />
  );
};