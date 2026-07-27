# Tasks
- Your instructions are different depending if you are a Coder or a Librarian. The Coder writes/updates the codebase to fulfill the active task. The Librarian writes documentation, comments, markdown files, or all other context needed to maintain the knowledge base alongside the code.

- Your instructions as a Coder for all tasks are to complete them with the fewest lines of code possible, touching the fewest files possible. Think of the smallest step you could take to pass the tests.

- Your instructions as a Librarian for all tasks are to complete all tasks with the most understandable documentation with an agentic audience in mind. For "Human" comments prefix all lines with NOTE:

- If a task has no `Profile:` tag, treat it as **Coder** unless the task description is explicitly about docs/comments/markdown, in which case treat it as **Librarian**.

- `.claude/index.src.json` is a centralized, single-file index of every file in `src/` — purpose, props, dependencies, usedBy, gotchas. Once it exists: consult it first for context on a file before reading that file (or its neighbors) directly. Only fall back to reading actual source when the index is missing an entry, looks stale, or the task requires seeing exact implementation details the index wouldn't capture. Keep it updated as a Librarian task whenever Coder work adds, removes, or meaningfully changes a file in `src/`.

- When a task is complete: report completion in the console, and add any Follow-up/Note details as sub-bullets under the existing task entry in `## In Progress`. Do NOT check the `[ ]` box, do NOT move the entry to `## Done`, and do NOT remove it from `## In Progress`. Archiving is handled exclusively by `pnpm run claude:update-tasklog`, which reads the `## In Progress` block as-is — moving or checking it yourself breaks that script.

## In Progress
- [ ] AnimateText needs all of the animations to work, as well as padding. The compositions/AnimateText/animations has DanceText and TypewriterText components using EDGE_MARGIN_PERCENT and EDGE_MARGIN_VH constants. However the "none" option doesn't have a similar edge margin, and the FadeIn, Pop, Slide, etc. animations don't have animation files. For this task we need to update the "none" for margins and then add the missing animations
  - Profile: Coder
  - Branch: feature/AnimateTextFeatures
  - Done: Added `FadeInText.jsx`, `PopText.jsx`, `SlideText.jsx` (exports `SlideUpText`/`SlideDownText`/`SlideLeftText`/`SlideRightText` from one shared base) under `remotion/compositions/AnimateText/animations/`, following the DanceText/TypewriterText position-resolution + `getFittedFontSize` pattern. Registered all six in `animationComponents` in `AnimateText.jsx`, matching every option in the dropdown (`src/components/Dashboard/screens/AnimateText.jsx`). Slide directions/travel distances match the (previously unused) definitions in `remotion/animations/index.js` for naming consistency.
  - Done: `NoneText` in `AnimateText.jsx` now applies `EDGE_MARGIN_PERCENT`-based left/right padding (mirroring the existing top/bottom `EDGE_MARGIN_VH` padding) when `xPosition` is "left"/"right". Bumped `EDGE_MARGIN_VH` from 4 → 10 to match the value already used by DanceText/TypewriterText, so margins are visually consistent across animation types.
  - Note: Verified all four new/changed files bundle cleanly via `esbuild` (JSX-only syntax check); did not run the full Remotion Studio preview in-browser — recommend a visual check of each animation option before merging.
  - Fix (user-reported): `EDGE_MARGIN_PERCENT` was only used for font-fit width, never applied to the actual left/right anchor — `xPosition: "right"` resolved `left` to `"100%"` (flush against the edge, no margin). Fixed in all six animation files (`DanceText`, `TypewriterText`, `TypewriterTextCursor`, `FadeInText`, `PopText`, `SlideText`) by insetting `left` to `${EDGE_MARGIN_PERCENT}%` / `${100 - EDGE_MARGIN_PERCENT}%` for left/right instead of `0%`/`100%`. Pre-existing bug in DanceText/TypewriterText, not introduced by this task, but same duplicated block so fixed everywhere for consistency. No pnpm/studio restart was needed — was a logic bug, not a caching issue.

## Backlog

## Done