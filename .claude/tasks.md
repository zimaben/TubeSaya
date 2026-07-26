# Tasks
- Your instructions are different depending if you are a Coder or a Librarian. The Coder writes/updates the codebase to fulfill the active task. The Librarian writes documentation, comments, markdown files, or all other context needed to maintain the knowledge base alongside the code.

- Your instructions as a Coder for all tasks are to complete them with the fewest lines of code possible, touching the fewest files possible. Think of the smallest step you could take to pass the tests.

- Your instructions as a Librarian for all tasks are to complete all tasks with the most understandable documentation with an agentic audience in mind. For "Human" comments prefix all lines with NOTE:

- If a task has no `Profile:` tag, treat it as **Coder** unless the task description is explicitly about docs/comments/markdown, in which case treat it as **Librarian**.

- `.claude/index.src.json` is a centralized, single-file index of every file in `src/` — purpose, props, dependencies, usedBy, gotchas. Once it exists: consult it first for context on a file before reading that file (or its neighbors) directly. Only fall back to reading actual source when the index is missing an entry, looks stale, or the task requires seeing exact implementation details the index wouldn't capture. Keep it updated as a Librarian task whenever Coder work adds, removes, or meaningfully changes a file in `src/`.

- When a task is complete: report completion in the console, and add any Follow-up/Note details as sub-bullets under the existing task entry in `## In Progress`. Do NOT check the `[ ]` box, do NOT move the entry to `## Done`, and do NOT remove it from `## In Progress`. Archiving is handled exclusively by `pnpm run claude:update-tasklog`, which reads the `## In Progress` block as-is — moving or checking it yourself breaks that script.

## In Progress
- [ ] Update `DashboardScreen`'s render flow to export its first and last frames as `{filename}_first.png` / `{filename}_last.png` alongside the animated video — so the graphic's pre- and post-animation states can be composited back into a static asset later.

  Register a `DashboardScreen` entry in `RENDER_PROFILES` (`remotion/render.js`) using the step pipeline already built for this — read `remotion/render-notes.md` first, it covers the step-shape contract, why steps shell out to the `remotion` CLI instead of the raw Node renderer API (config parity for `publicDir`/`pixelFormat`/`proResProfile`/`imageFormat`), and the known perf tradeoff (each step re-bundles independently). Three steps: a first-frame still (`frame: 0`, `suffix: "_first"`), the video, and a last-frame still (`frame: "last"`, `suffix: "_last"`).

  Note: `render.js` currently has a *commented-out* `DashboardScreen` example using `-start`/`-end` suffixes — that was illustrative only, not a spec. This ticket's real suffixes are `_first`/`_last` (matches this ticket's title, not the placeholder). Replace that comment with the real entry rather than leaving both namings in the file.

  Since `POST /render`'s `output` field is `outputs[0]` (the current single-file UI's success message reads only that one), consider step order carefully: `[video, first-still, last-still]` keeps `output` pointing at the video (today's behavior for every other macro) rather than surprising the existing UI with a PNG path. Not mandatory — flag whatever order is chosen and why.

  - Profile: Coder
  - Branch: feature/DashboardRenderFlow
  - Passed Test: with `DashboardScreen` active and a chosen filename, clicking Render produces exactly three files in `out/`: `{filename}.{mov|mp4}`, `{filename}_first.png`, `{filename}_last.png`.
  - Passed Test: `{filename}_first.png` matches the composition's true frame 0 (pre-animation — no counter progress, no popup).
  - Passed Test: `{filename}_last.png` matches the composition's true final frame (post-fade — popup fully transparent), not the midpoint. See the `DashboardScreen` build history in `.claude/tasklog.md` (RC/1.0.2) for the midpoint-vs-final distinction the original build already established — don't confuse the two.
  - Passed Test: rendering any other macro (e.g. `AnimateText`) is unaffected — still produces exactly one video file in `out/`, no stray PNGs.
  - Passed Test: `POST /render`'s `outputs` array contains all three relative paths, in the chosen step order; confirmed by reading the actual response, not just checking files landed on disk.
  - Out of scope (per prior conversation — flag, don't silently expand): updating `SidebarFooter.jsx`'s Render modal UI to show/link all three outputs instead of just the one `output` path. `render-notes.md` already documents this as separate, not-yet-scheduled work.
  - Done: added `RENDER_PROFILES.DashboardScreen` in `remotion/render.js` — `[{ type: "video" }, { type: "still", frame: 0, suffix: "_first" }, { type: "still", frame: "last", suffix: "_last" }]`, replacing the old `-start`/`-end` placeholder comment. Order chosen as `[video, first-still, last-still]` so `outputs[0]`/`output` keeps pointing at the video, matching every other macro's UI behavior. No engine or server changes needed — `render.js`'s step runner and `upload-server.js`'s `outputs` regex parsing already handled multi-step profiles generically.
  - Verified mechanically: temporarily flipped `Root.jsx`'s `DEV_OVERRIDE_MACRO_ID` to `"DashboardScreen"` (Root.jsx only ever registers one `<Composition>`, matching `db.json`'s `lastOpenMacro`, so a non-active macro can't otherwise be rendered) and ran the three steps standalone against a scratch dir — reverted the override immediately after, `db.json` was never touched. Got 3 files: `.mov` (ProRes, per `db.json`'s current codec), `_first.png`, `_last.png`, in that order.
  - Fixed (per follow-up request): `DashboardScreen.jsx`'s popup was visible at full opacity from frame 0 instead of gating on `leadInFrames` like `spentNow` and the `ching` SFX do. Changed `popupDragProgress`/`popupFadeProgress`'s interpolate input range from `[0, popupTotalFrames]` to `[leadInFrames, popupTotalFrames]`, and `popupOpacity` from `1 - popupFadeProgress` to `frame < leadInFrames ? 0 : 1 - popupFadeProgress` (needed because `extrapolateLeft: "clamp"` alone still resolves to progress 0 → opacity 1 before `leadInFrames`, not 0).
  - Fixed (per follow-up request): added a `START_DELAY_SECONDS = 0.05` static beat before any DashboardScreen animation begins (counter, popup, ching), so frame 0 doesn't read as already-in-motion. Implemented via `effectiveFrame = Math.max(0, frame - startDelayFrames)`, threaded through the existing `spentNow`/popup interpolates unchanged in shape; the ching `<Sequence>`'s `from` and `getDashboardDurationInFrames`'s total both shifted by `startDelayFrames` to match. Verified: frames 0 and 1 (2 frames @ 30fps) both hold the static pre-animation state, frame 17 (`startDelayFrames + leadInFrames`) shows the counter fully counted and popup just appearing, last frame unaffected.
  - Last-frame test confirmed correct: `_last.png` shows `spentNow` fully incremented and popup opacity `0` (not the midpoint) — matches the RC/1.0.2 fix already in place.
  - Other macros unaffected by inspection: `RENDER_PROFILES` fallback (`steps = RENDER_PROFILES[compositionId] ?? [{ type: "video" }]`) is unchanged for every id besides `DashboardScreen`.

## Backlog

## Done