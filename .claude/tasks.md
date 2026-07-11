# Tasks
- Your instructions are different depending if you are a Coder or a Librarian. The Coder writes/updates the codebase to fulfill the active task. The Librarian writes documentation, comments, markdown files, or all other context needed to maintain the knowledge base alongside the code.

- Your instructions as a Coder for all tasks are to complete them with the fewest lines of code possible, touching the fewest files possible. Think of the smallest step you could take to pass the tests.

- Your instructions as a Librarian for all tasks are to complete all tasks with the most understandable documentation with an agentic audience in mind. For "Human" comments prefix all lines with NOTE:

- If a task has no `Profile:` tag, treat it as **Coder** unless the task description is explicitly about docs/comments/markdown, in which case treat it as **Librarian**.

- `.claude/index.src.json` is a centralized, single-file index of every file in `src/` — purpose, props, dependencies, usedBy, gotchas. Once it exists: consult it first for context on a file before reading that file (or its neighbors) directly. Only fall back to reading actual source when the index is missing an entry, looks stale, or the task requires seeing exact implementation details the index wouldn't capture. Keep it updated as a Librarian task whenever Coder work adds, removes, or meaningfully changes a file in `src/`.

## In Progress
- [ ] Generate `.claude/index.src.json` — one centralized file covering every file in `src/`, keyed by relative path, so future sessions can consult this index instead of reading the whole codebase. Ignore `components/AppTray/*`. Each entry: purpose, propsIn (name/type/required/default/description), propsOut/emits, dependencies, usedBy (reverse dependency — requires full-tree import scan, not per-file), sideEffects, gotchas, relatedData (db.json schema link where applicable).
  - Profile: Librarian
  - Branch: docs/AddIndex
  - Pass 1: analyze one file at a time, write purpose/propsIn/propsOut/emits/dependencies/sideEffects/gotchas/relatedData per file. Use "N/A" for empty propsIn/propsOut.
  - Pass 2: after all files are analyzed, do one import-graph scan across `src/` to backfill `usedBy` for every entry. Don't infer usedBy per-file in pass 1.
  - Passed Test: `.claude/index.src.json` file exists and has a matching key for every file except the ignore list.
  - Passed Test: each item has non-empty purpose, propsIn, propsOut ("N/A" allowed).
  - Passed Test: each item's `usedBy` is either a non-empty array or explicitly `[]` if genuinely unreferenced — not omitted.

## Backlog


## Done
- [x] Fix empty `src` crash on `<Img>` when no image uploaded yet (AnimateImage.jsx)
  - Profile: Coder