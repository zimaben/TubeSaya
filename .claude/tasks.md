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


## Backlog


## Done