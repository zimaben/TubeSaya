// remotion/render.js
//
// Render pipeline entry point for the active macro (db.json app.lastOpenMacro).
// Invoked via `pnpm run render` (npm script) or the UI's Render button
// (POST /render on server/upload-server.js).
//
// Most macros just need one video file — that's the default profile below.
// A macro with an atypical render flow (e.g. still + video + still) plugs
// in a custom step list via RENDER_PROFILES instead of changing the engine.
// See render-notes.md for the full extension guide before adding one.

import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

const db = JSON.parse(fs.readFileSync(path.join(rootDir, "db.json"), "utf-8"));
const { lastOpenMacro: compositionId, settings } = db.app;
const { codec: dbCodec, crf } = settings.render;

const codec = dbCodec === "proRes" ? "prores" : dbCodec;
const videoExt = codec === "prores" ? "mov" : "mp4";

// RENDER_FILENAME (optional) lets the caller name the output file(s)
// separately from the composition being rendered — sanitized here too,
// since this script is also runnable directly (`pnpm run render`), not
// just via the server, which does its own sanitization on the same input.
const sanitize = (name) => path.basename(name || "").replace(/[^a-zA-Z0-9_-]/g, "_");
const outputName = sanitize(process.env.RENDER_FILENAME) || compositionId;

const outDir = path.join(rootDir, "out");
fs.mkdirSync(outDir, { recursive: true });

// --- Render profiles -----------------------------------------------------
// Default: one step, one video file — covers every macro today. A macro
// keyed here overrides that with its own ordered step list instead.
// Step shapes:
//   { type: "video" }
//   { type: "still", frame: <number> | "last", suffix?: <appended to filename> }
//
// DashboardScreen needs its pre-animation and post-animation frames exported
// as PNGs (to composite back into a static graphic later) alongside the
// animated video. Video first so `outputs[0]` (surfaced today as the single
// `output` field) stays the video, matching every other macro's behavior.
const RENDER_PROFILES = {
  DashboardScreen: [
    { type: "video" },
    { type: "still", frame: 0, suffix: "_first" },
    { type: "still", frame: "last", suffix: "_last" },
  ],
};

const steps = RENDER_PROFILES[compositionId] ?? [{ type: "video" }];

const remotionBin = path.join(rootDir, "node_modules", ".bin", "remotion");

const runVideoStep = () => {
  const output = path.join(outDir, `${outputName}.${videoExt}`);
  const args = ["render", "remotion/index.jsx", compositionId, output, `--codec=${codec}`];
  // crf is only valid for non-ProRes codecs; ProRes quality is set via
  // remotion.config.ts's Config.setProResProfile instead.
  if (codec !== "prores") args.push(`--crf=${crf}`);
  execFileSync(remotionBin, args, { cwd: rootDir, stdio: "inherit" });
  return output;
};

const runStillStep = ({ frame, suffix = "" }) => {
  // The CLI accepts negative frame indices; -1 is the last frame, so "last"
  // needs no duration lookup of our own.
  const resolvedFrame = frame === "last" ? -1 : frame;
  const output = path.join(outDir, `${outputName}${suffix}.png`);
  execFileSync(
    remotionBin,
    ["still", "remotion/index.jsx", compositionId, output, `--frame=${resolvedFrame}`],
    { cwd: rootDir, stdio: "inherit" }
  );
  return output;
};

const outputs = steps.map((step) => {
  if (step.type === "video") return runVideoStep();
  if (step.type === "still") return runStillStep(step);
  throw new Error(`Unknown render step type: "${step.type}"`);
});

for (const output of outputs) {
  console.log(`Rendered "${compositionId}" -> ${output}`);
}
