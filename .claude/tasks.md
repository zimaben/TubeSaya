# Tasks
- Your instructions are different depending if you are a Coder or a Librarian. The Coder writes/updates the codebase to fulfill the active task. The Librarian writes documentation, comments, markdown files, or all other context needed to maintain the knowledge base alongside the code.

- Your instructions as a Coder for all tasks are to complete them with the fewest lines of code possible, touching the fewest files possible. Think of the smallest step you could take to pass the tests.

- Your instructions as a Librarian for all tasks are to complete all tasks with the most understandable documentation with an agentic audience in mind. For "Human" comments prefix all lines with NOTE:

- If a task has no `Profile:` tag, treat it as **Coder** unless the task description is explicitly about docs/comments/markdown, in which case treat it as **Librarian**.

- `.claude/index.src.json` is a centralized, single-file index of every file in `src/` — purpose, props, dependencies, usedBy, gotchas. Once it exists: consult it first for context on a file before reading that file (or its neighbors) directly. Only fall back to reading actual source when the index is missing an entry, looks stale, or the task requires seeing exact implementation details the index wouldn't capture. Keep it updated as a Librarian task whenever Coder work adds, removes, or meaningfully changes a file in `src/`.

## In Progress
- [ ] Build local file-upload system to replace base64 data-encode flow for AnimateImage. Add `express`+`multer`+`dompurify`+`jsdom` deps (already present in package.json). New `server/upload-server.js` (already exists, port 3001): POST `/upload` (multipart, field `image`, 25MB cap, image types incl. SVG). SVG uploads are sanitized server-side via DOMPurify before being written to disk — never trust raw uploaded SVG markup. Writes to `public/uploads/`, returns `{ src: "uploads/<filename>" }`. Update the actual image upload UI component to POST to `http://localhost:3001/upload` and write the returned `src` into `db.json` (via json-server's REST API at `http://localhost:3000/app`, not direct file write) under `app.installedMacros.AnimateImage.macro.src`. Confirm `public/uploads/*` is in `.gitignore` (keep `.gitkeep`).
  - Profile: Coder
  - Branch: feature/AddImgUpload
  - Note: `server/upload-server.js` and CORS-related port config (json-server :3000, upload-server :3001, Remotion Studio :3005) were resolved in a prior session — verify all three still start cleanly via `pnpm dev` before beginning.
  - Passed Test: uploading a JPEG/PNG/WebP/GIF via the UI results in a new file in `public/uploads/` and an updated `src` value in `db.json` pointing to it (relative path, not a `data:` URI).
  - Passed Test: uploading an SVG results in sanitized markup on disk (no `<script>` tags or `on*` handlers survive) and the same `src`-in-`db.json` behavior as raster images.
  - Passed Test: Remotion Studio renders the uploaded image via `staticFile()` with no `<Img>` src error.
  - Passed Test: uploading an unsupported file type (e.g. `.pdf`) is rejected with a clear error, not silently accepted or crashing the server.

## Backlog


## Done
