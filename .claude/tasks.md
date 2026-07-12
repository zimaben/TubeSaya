# Tasks
- Your instructions are different depending if you are a Coder or a Librarian. The Coder writes/updates the codebase to fulfill the active task. The Librarian writes documentation, comments, markdown files, or all other context needed to maintain the knowledge base alongside the code.

- Your instructions as a Coder for all tasks are to complete them with the fewest lines of code possible, touching the fewest files possible. Think of the smallest step you could take to pass the tests.

- Your instructions as a Librarian for all tasks are to complete all tasks with the most understandable documentation with an agentic audience in mind. For "Human" comments prefix all lines with NOTE:

- If a task has no `Profile:` tag, treat it as **Coder** unless the task description is explicitly about docs/comments/markdown, in which case treat it as **Librarian**.

- `.claude/index.src.json` is a centralized, single-file index of every file in `src/` — purpose, props, dependencies, usedBy, gotchas. Once it exists: consult it first for context on a file before reading that file (or its neighbors) directly. Only fall back to reading actual source when the index is missing an entry, looks stale, or the task requires seeing exact implementation details the index wouldn't capture. Keep it updated as a Librarian task whenever Coder work adds, removes, or meaningfully changes a file in `src/`.

- When a task is complete: report completion in the console, and add any Follow-up/Note details as sub-bullets under the existing task entry in `## In Progress`. Do NOT check the `[ ]` box, do NOT move the entry to `## Done`, and do NOT remove it from `## In Progress`. Archiving is handled exclusively by `pnpm run claude:update-tasklog`, which reads the `## In Progress` block as-is — moving or checking it yourself breaks that script.

## In Progress
- [ ] Create a Screen in src/components/Dashboard/Screens for DashboardScreen.jsx that correspondes to the remotion/compositions/DashboardScreen.jsx props. The props should save to db.json the same way all the other Macros do
  - Profile: Coder
  - Branch: feature/AddDash
  - Passed Test: The App updates db.json.app.installedMacros.DashboardScreen on screen update of the props.
  - Passed Test: Setting the ActiveMacro to DashboardScreen with correct props causes localhost:3005/DashboardScreen to load in Remotion Studio with no errors
  - Follow-up: `Dashboard.jsx`'s routeActiveScreen switch matched on the literal string `"Dashboard"` instead of `"DashboardScreen"`, so the screen was unreachable via sidebar nav — fixed as part of this task (1-line change).
  - Follow-up: Built out `src/components/Dashboard/screens/DashboardScreen.jsx` (was a placeholder) with fields for graphic_size, graphic_placement_x, graphic_placement_y, budget, spent, increment — matching `remotion/compositions/DashboardScreen/DashboardScreen.jsx` prop names, following the existing updateField/updateMacro pattern from AnimateImage.jsx/MarkerText.jsx.
  - Follow-up: `db.json` was intentionally left untouched (macro stays `{}` until the app itself writes through the new form) per the no-direct-db.json-writes rule.
  - Follow-up: Verified with `npx vite build` (succeeds). Could not verify Remotion Studio load directly — sandbox network blocks `remotion.media` (Chrome headless download); needs a manual check in the user's browser at localhost:3005/DashboardScreen.
  - Follow-up: `.claude/index.src.json` entries for `Dashboard.jsx` and `DashboardScreen.jsx` (screens) are now stale (still describe the old bug/stub) — needs a Librarian pass.

## Backlog


## Done