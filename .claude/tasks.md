# Tasks
- Your instructions are different depending if you are a Coder or a Librarian. The Coder writes/updates the codebase to fulfill the active task. The Librarian writes documentation, comments, markdown files, or all other context needed to maintain the knowledge base alongside the code.

- Your instructions as a Coder for all tasks are to complete them with the fewest lines of code possible, touching the fewest files possible. Think of the smallest step you could take to pass the tests.

- Your instructions as a Librarian for all tasks are to complete all tasks with the most understandable documentation with an agentic audience in mind. For "Human" comments prefix all lines with NOTE:

- If a task has no `Profile:` tag, treat it as **Coder** unless the task description is explicitly about docs/comments/markdown, in which case treat it as **Librarian**.

- `.claude/index.src.json` is a centralized, single-file index of every file in `src/` — purpose, props, dependencies, usedBy, gotchas. Once it exists: consult it first for context on a file before reading that file (or its neighbors) directly. Only fall back to reading actual source when the index is missing an entry, looks stale, or the task requires seeing exact implementation details the index wouldn't capture. Keep it updated as a Librarian task whenever Coder work adds, removes, or meaningfully changes a file in `src/`.

- When a task is complete: report completion in the console, and add any Follow-up/Note details as sub-bullets under the existing task entry in `## In Progress`. Do NOT check the `[ ]` box, do NOT move the entry to `## Done`, and do NOT remove it from `## In Progress`. Archiving is handled exclusively by `pnpm run claude:update-tasklog`, which reads the `## In Progress` block as-is — moving or checking it yourself breaks that script.

## In Progress
- [ ] In the MarkerText macro, I would like the ability to choose between the text going above/below/left/right of the circle
  - Profile: Coder
  - Branch: feature/MarkerTextFixes
  - Done: added `textPosition` prop (`"above" | "below" | "left" | "right"`, default `"above"` to preserve existing behavior) to `remotion/compositions/MarkerText/MarkerText.jsx`. Orchestrator computes the text's anchor point off the circle's true geometry (vertical diameter for above/below, elliptical width for left/right, via `MarkerCircle`'s now-exported `WIDTH_FACTOR`) plus the existing `TEXT_GAP_FRACTION` gap, and clamps the result to stay within the frame (0–100%).
  - Done: `MarkerTypewriter.jsx` gained `left` and `align` props (`"center" | "start" | "end"`) — `align` picks the horizontal anchor-translate (`-50%`/`0%`/`-100%`) so left/right text grows away from the circle instead of into it, while above/below keep the original center-anchored behavior unchanged (`align: "center"` is still the default).
  - Done: added a "Text Position" `<select>` (Above/Below/Left/Right) to `src/components/Dashboard/screens/MarkerText.jsx`, writing `macro.textPosition` via the existing `updateField` pattern.
  - Note: for `left`/`right`, `MarkerTypewriter`'s font-fit (`getFittedFontSize`) still measures against the full frame width minus edge margins, not the actual space between the circle and the frame edge — long text could visually overlap the circle's side. Same class of approximation the original `above` case already had (gap gets you clear of the circle at typical text lengths, not guaranteed for very long strings). Not fixed here — flagging rather than expanding scope; a proper fix would need `MarkerTypewriter` to fit against a caller-supplied max width instead of deriving it from `width` internally.
  - Verified: `npx esbuild` bundle-compiles `MarkerText.jsx`/`MarkerTypewriter.jsx`/`MarkerCircle.jsx` cleanly (resolves the new `WIDTH_FACTOR` import, no syntax/type errors) and `npx vite build` succeeds for the `src/` screen edit. Same sandbox network isolation as prior MarkerText/DashboardScreen rounds prevented a live Remotion Studio render — needs a manual check: set each of the four `textPosition` values (and a couple of `circleTop`/`circleLeft`/`circleSize` combos) via `DEV_OVERRIDE_MACRO_ID` or the app UI and confirm text sits flush against the circle on the correct side with no overlap, and that `above` (the default/pre-existing behavior) looks pixel-identical to before this change.
  - Note: `.claude/index.src.json`'s entry for `src/components/Dashboard/screens/MarkerText.jsx` is now stale (macro shape doesn't list `textPosition`) — needs a Librarian pass.

## Backlog

## Done