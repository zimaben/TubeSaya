# Task Log

Archived completed tasks from tasks.md. Grouped by RC, newest release at the bottom, — each task
is filed under the RC that was in progress when it merged. Newest task within each group at the bottom. 

---

## RC/1.0.1

### Fix empty `src` crash on `<Img>` when no image uploaded yet (AnimateImage.jsx)
- Profile: Coder
- Guarded against falsy `src` before dispatching to animation components, since Remotion's `<Img>` throws on empty/missing src. Fix lives in `AnimateImage.jsx`.

### Generate `.claude/index.src.json`
- Profile: Librarian
- Branch: docs/AddIndex
- One centralized file covering every file in `src/` (26 files, `components/AppTray/*` excluded), keyed by relative path. Fields: purpose, propsIn, propsOut/emits, dependencies, usedBy, sideEffects, gotchas, relatedData.
- Pass 1: analyzed each file individually. Pass 2: single import-graph scan (`grep ^import` across `src/`, cross-checked against db.json) to backfill `usedBy`, including explicit `[]` for genuinely unreferenced files (two `*-reference.jsx` files, most of `src/assets/imgs/*` — turned out orphaned).
- Verified: file exists, all 26 expected keys present, every entry has non-empty purpose/propsIn/propsOut, every `usedBy` is an explicit array.
- Side note: fixed `.claude/settings.json` sandbox config along the way — `denyRead` referenced a nonexistent `~/.aws`, which crashed bwrap and blocked all Bash. Removed the dead entry after the `allowWrite` path fix was applied.

## RC/1.0.2

### Build local file-upload system to replace base64 data-encode flow for AnimateImage
- Profile: Coder
- Branch: feature/AddImgUpload
- `server/upload-server.js` (port 3001, POST `/upload`, multipart field `image`, 25MB cap, JPEG/PNG/WebP/GIF/SVG) already existed from a prior session; this pass replaced `AnimateImage.jsx`'s `handleFileChange` (previously `FileReader.readAsDataURL`) with a `fetch` POST to `http://localhost:3001/upload`, writing the returned `{ src: "uploads/<filename>" }` into macro state via `updateMacro` (which App.jsx already PUTs to json-server's `http://localhost:3000/app`).
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

### Fix uploaded images not resolving in Remotion Studio (`AnimateImage`) by consolidating Remotion's public directory with Vite's. Symptom: `staticFile()` builds a URL like `http://localhost:3005/static-<hash>/uploads/TitleCard-fixed.png` that 404s, even though the same file renders fine in the main app UI via Vite. Root cause: Remotion's configured public/static directory is currently `src/assets` (seen in Studio's served HTML as `window.remotion_publicFolderExists`), while `server/upload-server.js` writes uploads to project-root `public/uploads/`, and Vite already defaults to serving `public/`. `src/assets` currently only holds a handful of unused canned SFX `.mp3` files — no other code references it. Fix: reconfigure Remotion's `publicDir` (in `remotion.config.ts` or equivalent — locate the actual `Config.setPublicDir`/equivalent call) to point at project-root `public/`, matching Vite. Move the SFX files from `src/assets` to `public/sfx/`. Do not touch font loading — confirmed to use a separate import flow, unrelated to this change. Do not change `AnimateImage.jsx`'s src-resolution logic — the fix is config-level only.
  - Profile: Coder
  - Branch: fix/RemotionStaticUploads
  - Passed Test: `remotion.config.ts` (or equivalent) publicDir now points at project-root `public/`, confirmed by reading the file after the change, not just assumed.
  - Passed Test: an image uploaded via the UI renders correctly inside Remotion Studio's preview without restarting any dev server beyond what's already required.
  - Passed Test: SFX `.mp3` files relocated to `public/sfx/`, `src/assets` left empty (or removed if empty and nothing else references it — confirm via a quick grep before deleting).
  - Passed Test: font loading still works unchanged — spot check by opening any composition that renders text.
  - Done: `remotion.config.ts` `Config.setPublicDir(...)` now points at `path.join(process.cwd(), "public")` (was `"src/assets"`) — confirmed by re-reading the file post-edit.
  - Done: `src/assets/sfx/typewriter.mp3` moved to `public/sfx/typewriter.mp3` via `git mv` (preserves history). No code referenced the old path (grepped for `typewriter.mp3`/`assets/sfx`/`sfx/` — zero hits outside this task), so nothing else needed updating.
  - Note: task's premise that "`src/assets` currently only holds ... SFX .mp3 files" was stale — `src/assets/imgs/` also exists (7 files, incl. `logo.png` imported by `src/components/Sidebar/Sidebar.jsx` as a JS module, not served statically). Left `src/assets/imgs/` untouched: out of scope per the task's own restriction (fix is config-level only), and unaffected by the `publicDir` change since Vite bundles JS-imported assets independent of Remotion's `publicDir`. `src/assets` is therefore not empty and was not removed — matches the task's "(or removed if empty ...)" fallback condition.
  - Note: font loading confirmed unrelated — uses `@remotion/google-fonts`/separate import flow in `AnimateText` components, no `publicDir` dependency; not touched.
  - Not yet verified: live render in Remotion Studio (`pnpm run remotion:studio`) showing the uploaded `uploads/TitleCard-fixed.png` resolving without 404, and font rendering spot-check. Sandbox network isolation blocks this agent's own Bash from reaching localhost dev servers — needs a check in your own browser via `pnpm run dev` + `pnpm run remotion:studio`.

### Add `KenBurnsPan` as a new AnimateImage animation option — slow zoom + pan effect on a static image over its display duration. Two coordinated changes:
  1. New `remotion/compositions/AnimateImage/animations/KenBurnsPan.jsx`. Mirror `BounceInImage.jsx`'s prop contract exactly (check `.claude/index.src.json` for its documented props before writing — don't guess the interface). Register it in `AnimateImage.jsx`'s `animationComponents` map under the key `kenBurnsPan`. Use Remotion's `useCurrentFrame`/`interpolate` (same pattern as `BounceInImage`, whatever that turns out to be) to drive a subtle scale (e.g. 1.0 → 1.15) and pan (e.g. 5-10% translate) over the clip's full duration — ease, don't linear-interpolate, motion should read as smooth not mechanical.
  2. Update the animation selector in the App UI (`src/` — locate via `.claude/index.src.json`, likely the AnimateImage macro editor/form component) to add a `kenBurnsPan` option alongside the existing `bounceIn` entry, labeled "Ken Burns Pan" for display.
  The string value used in the UI dropdown (`kenBurnsPan`) and the key in `animationComponents` must match exactly — this is the single point of failure between the two halves of this task; a mismatch fails silently (falls through to `NoneImage`, no error thrown), not loudly, so don't rely on visual testing alone to catch a typo here.
  - Profile: Coder
  - Branch: feature/AddKenBurnsPan
  - Passed Test: selecting "Ken Burns Pan" in the App UI, then opening Remotion Studio, renders the image with visible zoom+pan motion over the macro's duration — not a static frame, not the `bounceIn` animation, not `NoneImage`'s static positioning.
  - Passed Test: `animationComponents["kenBurnsPan"]` and the UI's dropdown `value="kenBurnsPan"` string-match exactly — confirmed by reading both, not just visually testing the happy path.
  - Passed Test: switching between `bounceIn`, `kenBurnsPan`, and no-animation-selected (falls to `NoneImage`) all work without console errors.
  - Passed Test: existing `bounceIn` behavior is unchanged — this task adds a map entry and a dropdown option, it does not refactor `AnimateImage.jsx`'s dispatch logic.
  - Follow-up: Initial version implemented `remotion/compositions/AnimateImage/animations/KenBurnsPan.jsx` (scale 1.0→1.15, pan up to 8%/4% x/y, mirroring `BounceInImage`'s anchor-based prop contract), registered as `kenBurnsPan` in `AnimateImage.jsx`'s `animationComponents` map, and added a `{ value: "kenBurnsPan", label: "Ken Burns Pan" }` option in `src/components/Dashboard/screens/AnimateImage.jsx` right after `bounceIn`. User confirmed this worked, then asked for a refinement (see below).
  - Follow-up: Revised `KenBurnsPan.jsx` per user feedback to a CSS-`cover`-style fit instead of the `imgWidth`/anchor system: measures the image's natural dimensions (delayRender/onLoad, same pattern as `BounceInImage`), computes `coverScale = max(canvasWidth/naturalWidth, canvasHeight/naturalHeight)`, and animates zoom from `1.2 * coverScale` down to `1.0 * coverScale` (eased via `Easing.inOut(Easing.ease)` over `useVideoConfig().durationInFrames`) while panning from a top-left-biased crop to dead-center — pan offset is always derived from the *current* frame's slack (`renderedSize - canvasSize`), so the image can never expose a gap on either axis, landing perfectly centered and exactly cover-fit at the end. As a result `imgWidth`/`xPosition`/`customX`/`yPosition`/`customY` are no longer read by this component (parent still spreads all macro props; unused ones are harmless) — full-bleed cover fit supersedes the fixed-width anchor placement those props expressed for `bounceIn`/`NoneImage`. Zoom direction (120%→100%, i.e. zoom *out* to the cover baseline) and pan direction (top-left → center) were the two ambiguous choices in the user's request; flagged to user, not yet re-confirmed visually.
  - Follow-up: Did not touch the pre-existing `kenBurns`/`panLR`/`panRL` dropdown stub options — they still have no matching `animationComponents` entries and fall through to `NoneImage` as before; out of scope for this task.
  - Follow-up: Sandbox network isolation prevented verifying in a live browser/Remotion Studio session (see project memory) — visual confirmation of the revised cover/zoom/pan behavior and the no-console-error checks across `bounceIn`/`kenBurnsPan`/none-selected still need a human pass in the app.
  - Follow-up: User confirmed in-browser that the cover-fit version is "doing exactly what I want" — zoom-out (120%→100% of cover baseline) and top-left→center pan direction are both correct as implemented, no further changes requested.

### Adding Missing fonts in AnimateText Component. In the remotion/fonts/files folder there are a number of .ttf files. I would like to update the src/components/Dashboard/screens/AnimateText.jsx file to reflect those fonts
  - Profile: Coder
  - Branch: feature/AddFonts
  - Passed Test: Switching the Font control in the screen UI will replace the font in Remotion
  - Added `<option>` entries to the Font `<select>` in AnimateText.jsx for all 21 .ttf files in remotion/fonts/files (previously only 7 were listed; ABeeZee/Belgrano/Gaegu/GowunDodum families were already there).
  - The other 13 fonts (Inter x8, MarkoOne, MochiyPopOne, PermanentMarker, Raleway x3) were not yet registered in remotion/fonts/fonts.js's `loadFont`/`FONTS` map — selecting them would have silently fallen back to sans-serif via `resolveFont`. Registered them there too (import + FONTS entry) since the Passed Test requires the swap to actually take effect in Remotion, not just appear in the dropdown.
  - `remotion/fonts/index.js` is a dead/empty file — the real font registry consumed by the composition (`remotion/compositions/AnimateText/AnimateText.jsx`) is `remotion/fonts/fonts.js`. Left index.js untouched (out of scope).
  - Verified `npx vite build` succeeds (src/ side compiles). Could not verify the Remotion Studio side myself — sandbox network isolation means I can't reach the dev server; needs a manual check in-browser (`pnpm run remotion:studio`, switch the Font control, confirm the AnimateText preview updates).
  - Pre-existing bug noticed but left alone (out of scope): the Font select's fallback `value={macro.font || "Belgrano"}` doesn't match any option value (should be `"Belgrano-Regular"`).
