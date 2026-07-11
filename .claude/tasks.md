# Tasks
- Your instructions are different depending if you are a Coder or a Librarian. The Coder writes/updates the codebase to fulfill the active task. The Librarian writes documentation, comments, markdown files, or all other context needed to maintain the knowledge base alongside the code.

- Your instructions as a Coder for all tasks are to complete them with the fewest lines of code possible, touching the fewest files possible. Think of the smallest step you could take to pass the tests.

- Your instructions as a Librarian for all tasks are to complete all tasks with the most understandable documentation with an agentic audience in mind. For "Human" comments prefix all lines with NOTE:

- If a task has no `Profile:` tag, treat it as **Coder** unless the task description is explicitly about docs/comments/markdown, in which case treat it as **Librarian**.

- `.claude/index.src.json` is a centralized, single-file index of every file in `src/` — purpose, props, dependencies, usedBy, gotchas. Once it exists: consult it first for context on a file before reading that file (or its neighbors) directly. Only fall back to reading actual source when the index is missing an entry, looks stale, or the task requires seeing exact implementation details the index wouldn't capture. Keep it updated as a Librarian task whenever Coder work adds, removes, or meaningfully changes a file in `src/`.

- When a task is complete: report completion in the console, and add any Follow-up/Note details as sub-bullets under the existing task entry in `## In Progress`. Do NOT check the `[ ]` box, do NOT move the entry to `## Done`, and do NOT remove it from `## In Progress`. Archiving is handled exclusively by `pnpm run claude:update-tasklog`, which reads the `## In Progress` block as-is — moving or checking it yourself breaks that script.

## In Progress
- [ ] Build core MarkerText animation components (no macro wiring yet — standalone, testable via DEV_OVERRIDE_MACRO_ID in Root.jsx). Two pieces:
  1. `remotion/compositions/MarkerText/MarkerCircle.jsx` — hand-drawn SVG circle (permanent-marker-brush style stroke, not a perfect geometric circle), sized to video dimensions from settings, animated as a "draw-on" using stroke-dasharray/stroke-dashoffset over a configurable duration (frames from `useCurrentFrame`).
  2. `remotion/compositions/MarkerText/MarkerTypewriter.jsx` — text reveal styled to feel "markered in" rather than a typed cursor. Check `.claude/index.src.json` for `AnimateText`'s existing typewriter implementation first — reuse its frame-reveal logic rather than reimplementing character-reveal timing from scratch, but this component owns its own visual style (no blinking cursor, whatever "marker" styling reads as handwritten vs typed). Supports: `skew` prop (deg, CSS transform, subtle handwritten tilt), auto-fit sizing via the project's existing fit-text utility (locate via index — do not assume `@remotion/layout-utils` vs custom without checking).
  - Profile: Coder
  - Branch: feature/AddMarkerText
  - Passed Test: both components render correctly when swapped in via `DEV_OVERRIDE_MACRO_ID` in Root.jsx, independent of any macro/UI wiring.
  - Passed Test: MarkerCircle's draw-on animates over its full duration (not instant, not looping oddly) and is sized relative to `settings.video.width/height`, not hardcoded pixels.
  - Passed Test: text with `skew` applied doesn't clip/overflow its fit-to-box sizing — skew is applied without breaking the fit calculation.
  - Follow-up (2026-07-12): scope extended past the original "no macro wiring yet" — components are now finalized (circle uses a true circular-arc bezier construction with a uniform spiral drift + slight overshoot at the close; see MarkerCircle.jsx) and macro-wired: `src/components/Dashboard/screens/MarkerText.jsx` added (editor screen), wired into `Dashboard.jsx`, `remotion/Root.jsx`'s `DEV_OVERRIDE_MACRO_ID` reset to `null` (tuning done, `MarkerText` stays registered in `COMPONENT_MAP`), `CLAUDE.md` macro table and `.claude/index.src.json` updated.
  - Follow-up (2026-07-12): per standing instruction not to write `db.json` directly, the `installedMacros.MarkerText` entry was NOT added by Claude — user needs to add it themselves (snippet given in chat) before the macro will appear in the Sidebar or be reachable in the app.


## Backlog


## Done