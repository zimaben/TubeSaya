# Tasks
- Your instructions are different depending if you are a Coder or a Librarian. The Coder writes/updates the codebase to fulfill the active task. The Librarian writes documentation, comments, markdown files, or all other context needed to maintain the knowledge base alongside the code.

- Your instructions as a Coder for all tasks are to complete them with the fewest lines of code possible, touching the fewest files possible. Think of the smallest step you could take to pass the tests.

- Your instructions as a Librarian for all tasks are to complete all tasks with the most understandable documentation with an agentic audience in mind. For "Human" comments prefix all lines with NOTE:

- If a task has no `Profile:` tag, treat it as **Coder** unless the task description is explicitly about docs/comments/markdown, in which case treat it as **Librarian**.

- `.claude/index.src.json` is a centralized, single-file index of every file in `src/` — purpose, props, dependencies, usedBy, gotchas. Once it exists: consult it first for context on a file before reading that file (or its neighbors) directly. Only fall back to reading actual source when the index is missing an entry, looks stale, or the task requires seeing exact implementation details the index wouldn't capture. Keep it updated as a Librarian task whenever Coder work adds, removes, or meaningfully changes a file in `src/`.

- When a task is complete: report completion in the console, and add any Follow-up/Note details as sub-bullets under the existing task entry in `## In Progress`. Do NOT check the `[ ]` box, do NOT move the entry to `## Done`, and do NOT remove it from `## In Progress`. Archiving is handled exclusively by `pnpm run claude:update-tasklog`, which reads the `## In Progress` block as-is — moving or checking it yourself breaks that script.

## In Progress
- [ ] Fix uploaded images not resolving in Remotion Studio (`AnimateImage`) by consolidating Remotion's public directory with Vite's. Symptom: `staticFile()` builds a URL like `http://localhost:3005/static-<hash>/uploads/TitleCard-fixed.png` that 404s, even though the same file renders fine in the main app UI via Vite. Root cause: Remotion's configured public/static directory is currently `src/assets` (seen in Studio's served HTML as `window.remotion_publicFolderExists`), while `server/upload-server.js` writes uploads to project-root `public/uploads/`, and Vite already defaults to serving `public/`. `src/assets` currently only holds a handful of unused canned SFX `.mp3` files — no other code references it. Fix: reconfigure Remotion's `publicDir` (in `remotion.config.ts` or equivalent — locate the actual `Config.setPublicDir`/equivalent call) to point at project-root `public/`, matching Vite. Move the SFX files from `src/assets` to `public/sfx/`. Do not touch font loading — confirmed to use a separate import flow, unrelated to this change. Do not change `AnimateImage.jsx`'s src-resolution logic — the fix is config-level only.
  - Profile: Coder
  - Branch: fix/RemotionStaticUploads
  - Passed Test: `remotion.config.ts` (or equivalent) publicDir now points at project-root `public/`, confirmed by reading the file after the change, not just assumed.
  - Passed Test: an image uploaded via the UI renders correctly inside Remotion Studio's preview without restarting any dev server beyond what's already required.
  - Passed Test: SFX `.mp3` files relocated to `public/sfx/`, `src/assets` left empty (or removed if empty and nothing else references it — confirm via a quick grep before deleting).
  - Passed Test: font loading still works unchanged — spot check by opening any composition that renders text.
## Backlog


## Done