# Render pipeline notes

How `remotion/render.js` works, and how to extend it for a macro whose
render flow isn't "one composition in, one video file out." Read this
before touching `render.js` for a new macro's render needs.

## How it's wired today

`remotion/render.js` is a standalone Node script, run two ways:

- `pnpm run render` (npm script) — runs it directly.
- The sidebar's "Render Video" button — `POST http://localhost:3001/render`
  on `server/upload-server.js`, which spawns `node remotion/render.js` and
  forwards the modal's filename field as the `RENDER_FILENAME` env var.

It always renders **the currently active macro** — `db.json`'s
`app.lastOpenMacro` — using `app.settings.render` (codec, crf) for encode
settings. There's no way to render a macro other than the active one; that
matches how the Preview modal already works (same `activeMacro`).

## Why it shells out to the `remotion` CLI instead of the Node API

`render.js` calls `node_modules/.bin/remotion render` / `... still` via
`execFileSync`, rather than calling `@remotion/bundler` + `@remotion/renderer`
directly. This is deliberate, not incidental:

**`remotion.config.ts`'s settings — `Config.setPublicDir`,
`Config.setPixelFormat`, `Config.setProResProfile`,
`Config.setVideoImageFormat` — are only auto-applied by the CLI's config
loader.** The programmatic `bundle()`/`renderMedia()`/`renderStill()` APIs do
**not** read `remotion.config.ts` on their own; each of those settings would
have to be re-passed explicitly as function arguments, duplicating what's
already declared in one place.

This matters concretely: `Config.setPublicDir` is what makes uploaded images
(`staticFile()` in `Root.jsx`) resolve correctly — see the "Fix uploaded
images not resolving" entry in `.claude/tasklog.md` for the bug this fixed
once already, in Remotion Studio specifically. Switching `render.js` to the
raw Node API without deliberately re-threading `publicDir` (and
`pixelFormat`/`proResProfile`/`imageFormat`) would silently reintroduce that
same class of bug, this time in actual rendered output rather than just the
Studio preview — worse, because a render can succeed with a broken image
instead of failing loudly.

**If a future task needs the Node API anyway** (see perf tradeoff below),
carry all four settings over explicitly rather than assuming defaults match.

## Extending: render profiles for atypical macros

Not every macro is "render the whole composition to one video." Example:
`DashboardScreen` behaves like a sports-graphic overlay — it needs its
starting frame exported as a PNG, the full animated MOV, *and* its final
frame exported as a PNG, so the ending state can be composited back into a
static graphic later. That's three output files from one render click, not
one.

`render.js` has a `RENDER_PROFILES` registry for exactly this, keyed by
composition id (i.e. the macro name, matching `db.json`'s
`installedMacros` keys / `COMPONENT_MAP` in `Root.jsx`):

```js
const RENDER_PROFILES = {
  DashboardScreen: [
    { type: "still", frame: 0, suffix: "-start" },
    { type: "video" },
    { type: "still", frame: "last", suffix: "-end" },
  ],
};
```

A macro with no entry falls back to the default: `[{ type: "video" }]` —
today's behavior, unchanged.

**Step shapes:**
- `{ type: "video" }` — full render via `remotion render`, output named
  `<outputName>.<mov|mp4>` (extension from `db.json`'s codec).
- `{ type: "still", frame: <number> | "last", suffix?: <string> }` — single
  frame via `remotion still`, output named `<outputName><suffix>.png`.
  `frame: "last"` maps to the CLI's `--frame=-1`, so no duration lookup is
  needed — Remotion resolves "last frame" itself.

`outputName` is the user-editable filename from the Render modal (falls back
to the macro id if left blank) — it names the *output files*, and is
completely separate from `compositionId`, which always stays the real macro
id so the right composition renders regardless of what the user typed.

**Adding a profile is the only change needed** — the engine (bundling,
sanitization, output-path construction, logging) is shared across every
step type and every macro. Don't fork `render.js` per macro; add a
`RENDER_PROFILES` entry.

## Server response shape

`POST /render` returns:

```json
{ "ok": true, "log": "...", "output": "out/Foo.mov", "outputs": ["out/Foo.mov"] }
```

`outputs` is the ordered list of every file the active profile's steps
produced (one per step, in step order). `output` is just `outputs[0]`, kept
because the current Render modal UI only surfaces a single "Rendered to
..." line. **A macro with a multi-step profile will populate `outputs` with
all of its files today even though the UI only shows the first one** — the
UI work to show/link all of them is a separate, not-yet-scheduled task.

## Known limitation: each step re-bundles

Every CLI invocation (`remotion render` or `remotion still`) bundles the
composition and launches a fresh headless Chrome from scratch — there's no
bundle reuse across steps. A 3-step profile costs roughly 3x a single
video's bundle-and-launch overhead, on top of the render time itself.

This hasn't mattered yet because no macro uses more than one step. If a
multi-step profile's bundling overhead becomes a real bottleneck, the fix is
bundling once via `@remotion/bundler`'s `bundle()` and reusing that
`serveUrl` across all of a profile's steps with `renderMedia`/`renderStill`
— but see the CLI-vs-Node-API section above first: that path requires
explicitly re-threading `publicDir`/`pixelFormat`/`proResProfile`/
`imageFormat` from `remotion.config.ts`, not just swapping the API calls.
