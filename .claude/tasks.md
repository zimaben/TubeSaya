# Tasks
- Your instructions are different depending if you are a Coder or a Librarian. The Coder writes/updates the codebase to fulfill the active task. The Librarian writes documentation, comments, markdown files, or all other context needed to maintain the knowledge base alongside the code.

- Your instructions as a Coder for all tasks are to complete them with the fewest lines of code possible, touching the fewest files possible. Think of the smallest step you could take to pass the tests.

- Your instructions as a Librarian for all tasks are to complete all tasks with the most understandable documentation with an agentic audience in mind. For "Human" comments prefix all lines with NOTE:

- If a task has no `Profile:` tag, treat it as **Coder** unless the task description is explicitly about docs/comments/markdown, in which case treat it as **Librarian**.

- `.claude/index.src.json` is a centralized, single-file index of every file in `src/` — purpose, props, dependencies, usedBy, gotchas. Once it exists: consult it first for context on a file before reading that file (or its neighbors) directly. Only fall back to reading actual source when the index is missing an entry, looks stale, or the task requires seeing exact implementation details the index wouldn't capture. Keep it updated as a Librarian task whenever Coder work adds, removes, or meaningfully changes a file in `src/`.

- When a task is complete: report completion in the console, and add any Follow-up/Note details as sub-bullets under the existing task entry in `## In Progress`. Do NOT check the `[ ]` box, do NOT move the entry to `## Done`, and do NOT remove it from `## In Progress`. Archiving is handled exclusively by `pnpm run claude:update-tasklog`, which reads the `## In Progress` block as-is — moving or checking it yourself breaks that script.

## In Progress
- [ ] Add `KenBurnsPan` as a new AnimateImage animation option — slow zoom + pan effect on a static image over its display duration. Two coordinated changes:
  1. New `remotion/compositions/AnimateImage/animations/KenBurnsPan.jsx`. Mirror `BounceInImage.jsx`'s prop contract exactly (check `.claude/index.src.json` for its documented props before writing — don't guess the interface). Register it in `AnimateImage.jsx`'s `animationComponents` map under the key `kenBurnsPan`. Use Remotion's `useCurrentFrame`/`interpolate` (same pattern as `BounceInImage`, whatever that turns out to be) to drive a subtle scale (e.g. 1.0 → 1.15) and pan (e.g. 5-10% translate) over the clip's full duration — ease, don't linear-interpolate, motion should read as smooth not mechanical.
  2. Update the animation selector in the App UI (`src/` — locate via `.claude/index.src.json`, likely the AnimateImage macro editor/form component) to add a `kenBurnsPan` option alongside the existing `bounceIn` entry, labeled "Ken Burns Pan" for display.
  The string value used in the UI dropdown (`kenBurnsPan`) and the key in `animationComponents` must match exactly — this is the single point of failure between the two halves of this task; a mismatch fails silently (falls through to `NoneImage`, no error thrown), not loudly, so don't rely on visual testing alone to catch a typo here.
  - Profile: Coder
  - Branch: feature/AddKenBurnsPan
  - Passed Test: selecting "Ken Burns Pan" in the App UI, then opening Remotion Studio, renders the image with visible zoom+pan motion over the macro's duration — not a static frame, not the `bounceIn` animation, not `NoneImage`'s static positioning.
  - Passed Test: `animationComponents["kenBurnsPan"]` and the UI's dropdown `value="kenBurnsPan"` string-match exactly — confirmed by reading both, not just visually testing the happy path.
  - Passed Test: switching between `bounceIn`, `kenBurnsPan`, and no-animation-selected (falls to `NoneImage`) all work without console errors.
  - Passed Test: existing `bounceIn` behavior is unchanged — this task adds a map entry and a dropdown option, it does not refactor `AnimateImage.jsx`'s dispatch logic.
  - Follow-up: Initial version implemented `remotion/compositions/AnimateImage/animations/KenBurnsPan.jsx` (scale 1.0→1.15, pan up to 8%/4% x/y, mirroring `BounceInImage`'s anchor-based prop contract), registered as `kenBurnsPan` in `AnimateImage.jsx`'s `animationComponents` map, and added a `{ value: "kenBurnsPan", label: "Ken Burns Pan" }` option in `src/components/Dashboard/screens/AnimateImage.jsx` right after `bounceIn`. User confirmed this worked, then asked for a refinement (see below).
  - Follow-up: Revised `KenBurnsPan.jsx` per user feedback to a CSS-`cover`-style fit instead of the `imgWidth`/anchor system: measures the image's natural dimensions (delayRender/onLoad, same pattern as `BounceInImage`), computes `coverScale = max(canvasWidth/naturalWidth, canvasHeight/naturalHeight)`, and animates zoom from `1.2 * coverScale` down to `1.0 * coverScale` (eased via `Easing.inOut(Easing.ease)` over `useVideoConfig().durationInFrames`) while panning from a top-left-biased crop to dead-center — pan offset is always derived from the *current* frame's slack (`renderedSize - canvasSize`), so the image can never expose a gap on either axis, landing perfectly centered and exactly cover-fit at the end. As a result `imgWidth`/`xPosition`/`customX`/`yPosition`/`customY` are no longer read by this component (parent still spreads all macro props; unused ones are harmless) — full-bleed cover fit supersedes the fixed-width anchor placement those props expressed for `bounceIn`/`NoneImage`. Zoom direction (120%→100%, i.e. zoom *out* to the cover baseline) and pan direction (top-left → center) were the two ambiguous choices in the user's request; flagged to user, not yet re-confirmed visually.
  - Follow-up: Did not touch the pre-existing `kenBurns`/`panLR`/`panRL` dropdown stub options — they still have no matching `animationComponents` entries and fall through to `NoneImage` as before; out of scope for this task.
  - Follow-up: Sandbox network isolation prevented verifying in a live browser/Remotion Studio session (see project memory) — visual confirmation of the revised cover/zoom/pan behavior and the no-console-error checks across `bounceIn`/`kenBurnsPan`/none-selected still need a human pass in the app.
  - Follow-up: User confirmed in-browser that the cover-fit version is "doing exactly what I want" — zoom-out (120%→100% of cover baseline) and top-left→center pan direction are both correct as implemented, no further changes requested.


## Backlog


## Done