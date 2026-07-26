# Tasks
- Your instructions are different depending if you are a Coder or a Librarian. The Coder writes/updates the codebase to fulfill the active task. The Librarian writes documentation, comments, markdown files, or all other context needed to maintain the knowledge base alongside the code.

- Your instructions as a Coder for all tasks are to complete them with the fewest lines of code possible, touching the fewest files possible. Think of the smallest step you could take to pass the tests.

- Your instructions as a Librarian for all tasks are to complete all tasks with the most understandable documentation with an agentic audience in mind. For "Human" comments prefix all lines with NOTE:

- If a task has no `Profile:` tag, treat it as **Coder** unless the task description is explicitly about docs/comments/markdown, in which case treat it as **Librarian**.

- `.claude/index.src.json` is a centralized, single-file index of every file in `src/` — purpose, props, dependencies, usedBy, gotchas. Once it exists: consult it first for context on a file before reading that file (or its neighbors) directly. Only fall back to reading actual source when the index is missing an entry, looks stale, or the task requires seeing exact implementation details the index wouldn't capture. Keep it updated as a Librarian task whenever Coder work adds, removes, or meaningfully changes a file in `src/`.

- When a task is complete: report completion in the console, and add any Follow-up/Note details as sub-bullets under the existing task entry in `## In Progress`. Do NOT check the `[ ]` box, do NOT move the entry to `## Done`, and do NOT remove it from `## In Progress`. Archiving is handled exclusively by `pnpm run claude:update-tasklog`, which reads the `## In Progress` block as-is — moving or checking it yourself breaks that script.

## In Progress

- [ ] Add Preview/Render functionality to the Sidebar "Render" button (`src/components/Sidebar/comp/SidebarFooter.jsx`), replacing the current `console.log("Render clicked")` stub.

Scope: Preview only (live Remotion Studio composition for the active macro, shown in a dismissable modal). Actual file-rendering (invoking a real render pipeline to produce an output video) is explicitly out of scope for this ticket — the `render` npm script points at `remotion/render.js`, which does not exist yet and needs its own ticket (output path, progress reporting, codec/CRF from `db.json app.settings.render`).

Behavior:
- Clicking the button opens a dismissable modal containing an `<iframe>` pointed at `http://localhost:3005/{activeMacro}` — Remotion Studio's deep-link route for a specific composition.
- `{activeMacro}` is the currently active macro key, already held in `App.jsx` state and passed to `Sidebar.jsx` as the `activeMacro` prop — thread it down to `SidebarFooter.jsx` as a new prop (`Sidebar.jsx` currently renders `<SidebarFooter />` with no props). This mirrors `db.json app.lastOpenMacro`, so no separate fetch is needed.
- No manual prop/settings wiring is needed beyond passing the macro key: `remotion/Root.jsx` already resolves `props` from `db.json app.installedMacros.{key}.macro` and `settings` (width/height/fps) from `db.json app.settings.video` when Studio loads that composition id.

Prerequisite: Remotion Studio must be running on port 3005 for the iframe to load. Add it to the `dev` script's `concurrently` list in `package.json` (reuse the existing `remotion:studio` script rather than duplicating the command) so it starts automatically with `pnpm run dev`.

Things to verify while implementing:
- Confirm Remotion Studio's dev server doesn't send `X-Frame-Options`/CSP `frame-ancestors` headers that would block iframe embedding — if it does, fall back to `window.open` for the preview instead of an iframe, and note that in this entry.
- `remotion/Root.jsx`'s `DEV_OVERRIDE_MACRO_ID` (currently `null`) substitutes a different macro's props when set — if left non-null during local tuning, the embedded preview will silently show the override macro instead of the actual active one. Not this ticket's bug to fix, just a sharp edge to be aware of when testing.
- `db.json` is imported statically in `Root.jsx` (`import db from "../db.json"`) — confirm Studio's bundler hot-reloads on `db.json` changes so the preview reflects live prop edits without a manual Studio restart; record the finding as a gotcha either way.

Verification: With `pnpm run dev` running, edit a macro's fields in the Dashboard, click Render in the sidebar, and confirm the modal opens showing that macro's live Remotion Studio preview reflecting current `db.json` state; confirm the modal dismisses cleanly.

Profile: Coder
Branch: feature/PreviewRender

## Backlog


## Done