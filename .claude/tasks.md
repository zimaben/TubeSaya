# Tasks
- Your instructions are different depending if you are a Coder or a Librarian. The Coder writes/updates the codebase to fulfill the active task. The Librarian writes documentation, comments, markdown files, or all other context needed to maintain the knowledge base alongside the code.

- Your instructions as a Coder for all tasks are to complete them with the fewest lines of code possible, touching the fewest files possible. Think of the smallest step you could take to pass the tests.

- Your instructions as a Librarian for all tasks are to complete all tasks with the most understandable documentation with an agentic audience in mind. For "Human" comments prefix all lines with NOTE:

- If a task has no `Profile:` tag, treat it as **Coder** unless the task description is explicitly about docs/comments/markdown, in which case treat it as **Librarian**.

- `.claude/index.src.json` is a centralized, single-file index of every file in `src/` — purpose, props, dependencies, usedBy, gotchas. Once it exists: consult it first for context on a file before reading that file (or its neighbors) directly. Only fall back to reading actual source when the index is missing an entry, looks stale, or the task requires seeing exact implementation details the index wouldn't capture. Keep it updated as a Librarian task whenever Coder work adds, removes, or meaningfully changes a file in `src/`.

## In Progress

## Backlog


## Done
- [x] Build local file-upload system to replace base64 data-encode flow for AnimateImage. `server/upload-server.js` (port 3001, POST `/upload`, multipart field `image`, 25MB cap, JPEG/PNG/WebP/GIF/SVG) already existed from a prior session; this pass replaced `AnimateImage.jsx`'s `handleFileChange` (previously `FileReader.readAsDataURL`) with a `fetch` POST to `http://localhost:3001/upload`, writing the returned `{ src: "uploads/<filename>" }` into macro state via `updateMacro` (which App.jsx already PUTs to json-server's `http://localhost:3000/app`).
  - Profile: Coder
  - Branch: feature/AddImgUpload
  - Verified: `pnpm dev` starts vite (:5173), json-server (:3000), and upload-server (:3001) cleanly together.
  - Verified via direct `curl` to `/upload`: PNG upload → 200, file written to `public/uploads/`, `src` returned as relative path (no `data:` URI). SVG upload → 200, sanitized on disk (`<script>`, `onload`, `onclick` all stripped by DOMPurify). PDF upload → 400 `{"error":"Unsupported file type"}`, server did not crash.
  - `remotion/Root.jsx`'s `staticFile()` branch (`props.src.startsWith("data:")`) was left untouched as instructed — it already resolves relative `uploads/...` paths correctly since the server never returns `data:` URIs.
  - `public/uploads/*` confirmed gitignored with `.gitkeep` preserved; no change needed.
  - Note: app has no router and is served at `/`, so the plain `<img src={macro.src}>` preview in the UI also resolves the relative `uploads/...` path correctly — no leading-slash fix needed.
  - Follow-up: `upload-server.js`'s multer `filename` fn changed from a random `timestamp-rand.ext` name to preserving the original uploaded filename (basename-only, non-alphanumeric chars replaced with `_`, guards path traversal e.g. `../../evil.png` → `evil.png`), with a `-1`/`-2`/... suffix appended on collision instead of overwriting. Verified via curl: plain upload keeps sanitized original name, repeat upload of the same name gets `-1` suffix, traversal attempt is neutralized to a safe basename.
  - Follow-up: root cause found for "upload does nothing to db.json" — `upload-server.js` sent no CORS headers, so the browser's `fetch()` POST in `AnimateImage.jsx` rejected client-side (the file still wrote to disk server-side, but the JS promise threw before reaching `updateField`, silently, since there was no `.catch`). Confirmed by checking response headers with an `Origin: http://localhost:5173` header via curl — no `Access-Control-Allow-*` headers were present. Fixed by adding a CORS middleware (`Access-Control-Allow-Origin: *`, handles `OPTIONS` preflight) to `upload-server.js`. Verified headers now present on POST responses via curl.
  - Follow-up: added `DELETE /upload/:filename` to `upload-server.js` (path-traversal-safe via `path.basename`) and wired `AnimateImage.jsx`'s `handleFileChange` to (1) clear `macro.src` immediately when replacing an existing image, before the new upload starts, and (2) delete the previous file from `public/uploads/` after a successful re-upload — so a macro never accumulates more than one live image on disk. Verified via curl: upload #1, upload #2, confirm #1 removed via the new DELETE route.
  - Note: the small `<img>` preview next to the upload control (`w-16 h-16`, conditional on `macro.src`) was already present in the component; it wasn't rendering because the CORS bug above prevented `updateField("src", ...)` from ever being reached. No separate preview code was needed once CORS was fixed.
  - Confirmed by user in a real browser after restarting `pnpm dev` (upload-server.js requires a restart to pick up code changes, no hot-reload): upload persists to `db.json`, preview renders, and replacing an image deletes/replaces the old file as intended. Feature is tested and complete.
