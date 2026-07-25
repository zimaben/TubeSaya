# Tasks
- Your instructions are different depending if you are a Coder or a Librarian. The Coder writes/updates the codebase to fulfill the active task. The Librarian writes documentation, comments, markdown files, or all other context needed to maintain the knowledge base alongside the code.

- Your instructions as a Coder for all tasks are to complete them with the fewest lines of code possible, touching the fewest files possible. Think of the smallest step you could take to pass the tests.

- Your instructions as a Librarian for all tasks are to complete all tasks with the most understandable documentation with an agentic audience in mind. For "Human" comments prefix all lines with NOTE:

- If a task has no `Profile:` tag, treat it as **Coder** unless the task description is explicitly about docs/comments/markdown, in which case treat it as **Librarian**.

- `.claude/index.src.json` is a centralized, single-file index of every file in `src/` — purpose, props, dependencies, usedBy, gotchas. Once it exists: consult it first for context on a file before reading that file (or its neighbors) directly. Only fall back to reading actual source when the index is missing an entry, looks stale, or the task requires seeing exact implementation details the index wouldn't capture. Keep it updated as a Librarian task whenever Coder work adds, removes, or meaningfully changes a file in `src/`.

- When a task is complete: report completion in the console, and add any Follow-up/Note details as sub-bullets under the existing task entry in `## In Progress`. Do NOT check the `[ ]` box, do NOT move the entry to `## Done`, and do NOT remove it from `## In Progress`. Archiving is handled exclusively by `pnpm run claude:update-tasklog`, which reads the `## In Progress` block as-is — moving or checking it yourself breaks that script.

## In Progress
- [ ] Update the .claude/index.src.json entries for Dashboard.jsx and DashboardScreen.jsx to describe the new files. Previously it was a stub

  - Profile: Librarian
  - Branch: feature/AddDash
  - Done: `src/components/Dashboard/screens/DashboardScreen.jsx` entry rewritten from "Stub ... placeholder text" to describe the real form (graphic_size, graphic_placement_x, graphic_placement_y, budget, spent, increment fields matching `remotion/compositions/DashboardScreen/DashboardScreen.jsx`'s props exactly, via the standard `updateField`/`updateMacro` pattern). `relatedData` updated from "(currently {})" to the real macro shape.
  - Done: `src/components/Dashboard/Dashboard.jsx` entry's `gotchas` updated — the previously-documented "Dashboard" vs "DashboardScreen" switch-case mismatch (which made the screen unreachable) is fixed in the current code; entry now reflects that DashboardScreen is reachable via normal sidebar nav.
  - Note: new gotcha recorded on the DashboardScreen.jsx entry — `graphic_placement_x`'s option values are "left"/"center"/"right" (not "middle"), and the current db.json seed only sets budget/spent/increment, so graphic_size/placement fields rely entirely on the screen's `??` defaults until a user touches them in the UI.
  - Verified: `.claude/index.src.json` re-parses as valid JSON after the edits (`python3 -m json.load`).

## Backlog


## Done