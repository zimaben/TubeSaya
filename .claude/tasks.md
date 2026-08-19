# Tasks
- Your instructions are different depending if you are a Coder or a Librarian. The Coder writes/updates the codebase to fulfill the active task. The Librarian writes documentation, comments, markdown files, or all other context needed to maintain the knowledge base alongside the code.

- Your instructions as a Coder for all tasks are to complete them with the fewest lines of code possible, touching the fewest files possible. Think of the smallest step you could take to pass the tests.

- Your instructions as a Librarian for all tasks are to complete all tasks with the most understandable documentation with an agentic audience in mind. For "Human" comments prefix all lines with NOTE:

- If a task has no `Profile:` tag, treat it as **Coder** unless the task description is explicitly about docs/comments/markdown, in which case treat it as **Librarian**.

- `.claude/index.src.json` is a centralized, single-file index of every file in `src/` — purpose, props, dependencies, usedBy, gotchas. Once it exists: consult it first for context on a file before reading that file (or its neighbors) directly. Only fall back to reading actual source when the index is missing an entry, looks stale, or the task requires seeing exact implementation details the index wouldn't capture. Keep it updated as a Librarian task whenever Coder work adds, removes, or meaningfully changes a file in `src/`.

- When a task is complete: report completion in the console, and add any Follow-up/Note details as sub-bullets under the existing task entry in `## In Progress`. Do NOT check the `[ ]` box, do NOT move the entry to `## Done`, and do NOT remove it from `## In Progress`. Archiving is handled exclusively by `pnpm run claude:update-tasklog`, which reads the `## In Progress` block as-is — moving or checking it yourself breaks that script.

## In Progress
- [ ] There is a temp photo upload for the AnimateImage macro. I would like to put a similar flow for MarkerText macro that saves in a folder dedicated to that macro and adds a background on the REMOTION PREVIEW ONLY (not the actual render) of a 50% opacity render of that photo to see where the marker animation will land on the frame. There will be additional steps but lets get this going
  - Profile: Coder
  - Branch: feature/BGMarker
  - Passed Test: MarkerText previews with test image visible
  - Passed Test: MarkerText renders with no image visible
  - Done: `server/upload-server.js`'s multer storage now accepts an optional `folder` text field (sent before the `image` field in the FormData) that scopes an upload into `public/uploads/<folder>/` instead of the shared root — sanitized to `[a-zA-Z0-9_-]`, directory created on demand. Response `src` is computed as the real relative path from `public/` (so it naturally includes the folder segment) instead of the old hardcoded `uploads/${filename}`. Added `DELETE /upload/:folder/:filename` alongside the existing `DELETE /upload/:filename` — both coexist without conflict since Express routes by segment count, and `AnimateImage.jsx`'s existing delete calls (no folder, single segment) are untouched.
  - Done: `src/components/Dashboard/screens/MarkerText.jsx` — added a "Placement Reference Photo (preview only)" upload control, same pattern as `AnimateImage.jsx`'s `handleFileChange` (upload → `updateField("bgSrc", ...)`, delete previous file on replace), but posts `folder: "markertext"` so uploads land in `public/uploads/markertext/` rather than the shared AnimateImage folder. New macro field: `bgSrc`.
  - Done: `remotion/resolveComposition.js`'s `resolveProps` now resolves both `src` and `bgSrc` through `staticFile()` (was `src`-only) so the uploaded reference photo's relative path works the same way AnimateImage's does.
  - Done: `remotion/compositions/MarkerText/MarkerText.jsx` takes a new `bgSrc` prop and renders it as a full-bleed `<img>` at 50% opacity behind the circle/text, gated on `Boolean(bgSrc) && !getRemotionEnvironment().isRendering` — `isRendering` is false in both Remotion Studio and the in-app `@remotion/player` preview (`PreviewPlayer.jsx`) and true only during an actual CLI render (`remotion/render.js`), so the photo shows in every preview surface but is guaranteed absent from rendered output regardless of whether `bgSrc` is set.
  - Verified: `node --check server/upload-server.js` passes. `npx esbuild` bundle-checks `MarkerText.jsx` (composition), `resolveComposition.js`, and `Dashboard.jsx` together (with `.ttf`/`.png`/`.mp3` file loaders) — no resolution/syntax errors. `npx vite build` succeeds; `dist/` restored to its committed state afterward via `git checkout -- dist/` + `git clean -fd dist/`.
  - Not verified: live upload → preview → render round trip in a real browser — sandbox network isolation blocks this agent's own Bash from reaching the user's dev server (see project memory). Needs a manual pass: `pnpm run dev`, open the MarkerText screen, upload a reference photo, confirm it shows at 50% opacity in both the in-app Player preview and Remotion Studio (`localhost:3005/MarkerText`), then run an actual render and confirm the photo is absent from the output file.
  - Note: per the "no direct `db.json` writes" rule, no `bgSrc` seed was added to `db.json`'s `MarkerText` macro entry — it starts undefined (no background shown) until the user uploads a photo through the new UI control, which PUTs it through the app the same way every other macro field does.

## Backlog


## Done