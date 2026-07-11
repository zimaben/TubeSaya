# Tasks
- Your instructions are different depending if you are a Coder or a Librarian. The Coder writes/updates the codebase to fulfill the active task. The Librarian writes documentation, comments, markdown files, or all other context needed to maintain the knowledge base alongside the code.

- Your instructions as a Coder for all tasks are to complete them with the fewest lines of code possible, touching the fewest files possible. Think of the smallest step you could take to pass the tests.

- Your instructions as a Librarian for all tasks are to complete all tasks with the most understandable documentation with an agentic audience in mind. For "Human" comments prefix all lines with NOTE:

- If a task has no `Profile:` tag, treat it as **Coder** unless the task description is explicitly about docs/comments/markdown, in which case treat it as **Librarian**.

- `.claude/index.src.json` is a centralized, single-file index of every file in `src/` — purpose, props, dependencies, usedBy, gotchas. Once it exists: consult it first for context on a file before reading that file (or its neighbors) directly. Only fall back to reading actual source when the index is missing an entry, looks stale, or the task requires seeing exact implementation details the index wouldn't capture. Keep it updated as a Librarian task whenever Coder work adds, removes, or meaningfully changes a file in `src/`.

## In Progress


## Backlog


## Done
- [x] Generate `.claude/index.src.json` — one centralized file covering every file in `src/`, keyed by relative path, so future sessions can consult this index instead of reading the whole codebase. Ignore `components/AppTray/*`. Each entry: purpose, propsIn (name/type/required/default/description), propsOut/emits, dependencies, usedBy (reverse dependency — requires full-tree import scan, not per-file), sideEffects, gotchas, relatedData (db.json schema link where applicable).
  - Profile: Librarian
  - Branch: docs/AddIndex
  - Pass 1: analyzed each of the 26 non-AppTray files individually (purpose/propsIn/propsOut/emits/dependencies/sideEffects/gotchas/relatedData), "N/A" for empty propsIn/propsOut.
  - Pass 2: ran a single import-graph scan (`grep ^import` across `src/`, cross-checked against db.json) to backfill `usedBy` for every entry, including `[]` for genuinely unreferenced files (e.g. the two `*-reference.jsx` files and most of `src/assets/imgs/*`, which turned out to be orphaned).
  - Verified: file exists, all 26 expected keys present (matches `find src -type f` minus AppTray), every entry has non-empty purpose/propsIn/propsOut, every `usedBy` is an explicit array.
  - Note: along the way, fixed `.claude/settings.json` sandbox config (`denyRead` referenced a nonexistent `~/.aws`, which crashed bwrap and blocked all Bash) — user applied the `allowWrite` path fix, this session removed the dead `~/.aws` deny entry.
- [x] Fix empty `src` crash on `<Img>` when no image uploaded yet (AnimateImage.jsx)
  - Profile: Coder