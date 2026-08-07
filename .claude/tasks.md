# Tasks
- Your instructions are different depending if you are a Coder or a Librarian. The Coder writes/updates the codebase to fulfill the active task. The Librarian writes documentation, comments, markdown files, or all other context needed to maintain the knowledge base alongside the code.

- Your instructions as a Coder for all tasks are to complete them with the fewest lines of code possible, touching the fewest files possible. Think of the smallest step you could take to pass the tests.

- Your instructions as a Librarian for all tasks are to complete all tasks with the most understandable documentation with an agentic audience in mind. For "Human" comments prefix all lines with NOTE:

- If a task has no `Profile:` tag, treat it as **Coder** unless the task description is explicitly about docs/comments/markdown, in which case treat it as **Librarian**.

- `.claude/index.src.json` is a centralized, single-file index of every file in `src/` — purpose, props, dependencies, usedBy, gotchas. Once it exists: consult it first for context on a file before reading that file (or its neighbors) directly. Only fall back to reading actual source when the index is missing an entry, looks stale, or the task requires seeing exact implementation details the index wouldn't capture. Keep it updated as a Librarian task whenever Coder work adds, removes, or meaningfully changes a file in `src/`.

- When a task is complete: report completion in the console, and add any Follow-up/Note details as sub-bullets under the existing task entry in `## In Progress`. Do NOT check the `[ ]` box, do NOT move the entry to `## Done`, and do NOT remove it from `## In Progress`. Archiving is handled exclusively by `pnpm run claude:update-tasklog`, which reads the `## In Progress` block as-is — moving or checking it yourself breaks that script.

## In Progress
- [ ] There is a menu item called "Dashboard" and I want to change it from Dashboard to Overlays. Inside the overlays there should be buttons to choose your overlay and the first one will be "BudgetTracker" which is the current "Dashboard". I also want to make a "Checklist" in addition to the BudgetTracker. The first phase of the task will just set up the stubs correctly. 
  - Profile: Coder
  - Branch: feature/AddChecklist
  - Phase 1 complete (revised per user correction — no macro gets a sidebar submenu, not even `AnimateText` which has many animation types; the choice happens *inside* the panel via a field, same as `AnimateText`'s `animation` dropdown). Sidebar keeps one flat "Overlays" item (`DashboardScreen` macro id unchanged, label relabeled "Dashboard" → "Overlays" — no changes needed to `remotion/resolveComposition.js`/`COMPONENT_MAP`). Inside that screen, `src/components/Dashboard/screens/DashboardScreen.jsx` now has an "Overlay Type" `<select>` (`macro.overlayType`, default `"BudgetTracker"`) that swaps the panel content: "BudgetTracker" shows the existing budget/spent/increment fields, "Checklist" renders the new `src/components/Dashboard/screens/Checklist.jsx` stub.
  - `db.json` (gitignored, local-only): `DashboardScreen.label` → `"Overlays"`; added `macro.overlayType: "BudgetTracker"` default. Also fixed `src/components/Dashboard/comp/dashheader.jsx`, which was hardcoding "Dashboard" for the eyebrow label and deriving "Dashboard Screen" from the macro id for the h2 title — both now special-case `activeDash === "DashboardScreen"` to show "Overlays" instead (other macros' headers untouched).
  - Updated the `DashboardScreen` row in `CLAUDE.md`'s macro table to describe the type-selector pattern and correct its stale "Stub" status (it's actually Built).
  - Gotcha hit this task: a direct `db.json` edit was silently reverted between turns (running app's browser session PUTs its stale in-memory `data` back on any interaction). Resolved once the user refreshed the app tab — confirmed live in `db.json` (`label: "Overlays"`, and `overlayType` now reflects the user's own click on "Checklist" in the new selector). Direct `db.json` schema edits need a browser refresh to take effect and stop being clobbered.
  - Follow-up (Phase 2, not done): give the "Checklist" overlay type real fields in `Checklist.jsx` + corresponding `macro` schema, and only then a `remotion/compositions/` component + `COMPONENT_MAP` entry if it needs to render (same as `AnimateMap`/`SyncText`/`VFX`, which remain true unimplemented stubs).
  - Follow-up (Librarian): `.claude/index.src.json` needs entries/updates for `DashboardScreen.jsx` and the new `Checklist.jsx` per the project's indexing convention — not done here since that's explicitly a Librarian task.
  
## Backlog
- [ ] Populate the "Checklist" overlay type (currently a stub — see `src/components/Dashboard/screens/Checklist.jsx` and the `overlayType` selector in `DashboardScreen.jsx`) with real fields and a working macro, following the item-list pattern `AnimateText` uses for its `sequence[]` (staging field + "Add to Sequence" + reorder/remove).
  - Profile: Coder
  - Left/right toggle for checklist position.
  - "Style" dropdown; only option for now is "Whiteboard" (schema should allow adding more styles later).
  - Add checklist items the same way `AnimateText` builds `sequence[]`: a staging field + "Add" button, with each added item keeping its own state (not just text).
  - Each item has a checked/unchecked state, plus a way to pick which single item is "current" (i.e. gets the checked-off animation when the video plays through it) — analogous to how `AnimateText`'s sequence advances through timed lines.
  - "Whiteboard" style renders text in Permanent Marker font (`PermanentMarker-Regular`, already used by `MarkerText` — see `remotion/compositions/MarkerText/`).
  - Confirmed with user: the checkmark is a hand-drawn SVG with an animated stroke draw-on reveal, same technique as `MarkerText`'s `MarkerCircle.jsx` (see `remotion/compositions/MarkerText/`) — draw the checkbox + checkmark SVG assets ourselves, don't pull from an icon library.
  - Rendering combines two existing concepts: (1) the MarkerCircle-style draw-on stroke animation, and (2) `DashboardScreen`'s multi-artifact render — `remotion/render.js`'s `RENDER_PROFILES` registry, which for `DashboardScreen` renders the video *plus* a "before" PNG (`frame: 0`) and "after" PNG (`frame: "last"`) still. Checklist needs its own `RENDER_PROFILES.Checklist` entry (`[{ type: "video" }, { type: "still", frame: 0, suffix: "_first" }, { type: "still", frame: "last", suffix: "_last" }]`) so the unchecked-box and checked-box states export as stills alongside the MP4/MOV of the checkmark being drawn on. `remotion/render-notes.md` is the existing extension guide for this mechanism — follow it, and update it if the pattern needs adjusting for Checklist's list-of-items shape (vs. DashboardScreen's single graphic).
  - Once the macro/screen fields are real, add the matching `remotion/compositions/Checklist/` component (with its own hand-drawn checkmark component, analogous to `MarkerCircle.jsx`) and register it in `COMPONENT_MAP` (`remotion/resolveComposition.js`) — Checklist has no render component yet, same as `AnimateMap`/`SyncText`/`VFX`.

## Done