# Tasks
- Your instructions are different depending if you are a Coder or a Librarian. The Coder writes/updates the codebase to fulfill the active task. The Librarian writes documentation, comments, markdown files, or all other context needed to maintain the knowledge base alongside the code.

- Your instructions as a Coder for all tasks are to complete them with the fewest lines of code possible, touching the fewest files possible. Think of the smallest step you could take to pass the tests.

- Your instructions as a Librarian for all tasks are to complete all tasks with the most understandable documentation with an agentic audience in mind. For "Human" comments prefix all lines with NOTE:

- If a task has no `Profile:` tag, treat it as **Coder** unless the task description is explicitly about docs/comments/markdown, in which case treat it as **Librarian**.

- `.claude/index.src.json` is a centralized, single-file index of every file in `src/` — purpose, props, dependencies, usedBy, gotchas. Once it exists: consult it first for context on a file before reading that file (or its neighbors) directly. Only fall back to reading actual source when the index is missing an entry, looks stale, or the task requires seeing exact implementation details the index wouldn't capture. Keep it updated as a Librarian task whenever Coder work adds, removes, or meaningfully changes a file in `src/`.

- When a task is complete: report completion in the console, and add any Follow-up/Note details as sub-bullets under the existing task entry in `## In Progress`. Do NOT check the `[ ]` box, do NOT move the entry to `## Done`, and do NOT remove it from `## In Progress`. Archiving is handled exclusively by `pnpm run claude:update-tasklog`, which reads the `## In Progress` block as-is — moving or checking it yourself breaks that script.

## In Progress
- [ ] You must fix this error first to assist with testing before any other work on this branch can proceed.

Error encountered when rendering via Remotion Studio UI:

Error: Failed to launch the browser process!
Error: Closed with 127 signal: null
    at ChildProcess.<anonymous> (/home/ben/projects/software/TubeSaya/node_modules/.pnpm/@remotion+renderer@4.0.484_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@remotion/renderer/dist/browser/BrowserRunner.js:260:32)
    at ChildProcess.emit (node:events:524:28)
    at ChildProcess._handle.onexit (node:internal/child_process:293:12)
/home/ben/projects/software/TubeSaya/node_modules/.remotion/chrome-headless-shell/linux64/chrome-headless-shell-linux64/chrome-headless-shell: error while loading shared libraries: libnspr4.so: cannot open shared object file: No such file or directory
Troubleshooting: https://remotion.dev/docs/troubleshooting/browser-launch
    at onClose (/home/ben/projects/software/TubeSaya/node_modules/.pnpm/@remotion+renderer@4.0.484_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@remotion/renderer/dist/browser/BrowserRunner.js:269:20)
    at ChildProcess.<anonymous> (/home/ben/projects/software/TubeSaya/node_modules/.pnpm/@remotion+renderer@4.0.484_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@remotion/renderer/dist/browser/BrowserRunner.js:260:24)
    at ChildProcess.emit (node:events:524:28)
    at ChildProcess._handle.onexit (node:internal/child_process:293:12)
Node.js v20.20.2

Root cause: The bundled Chrome Headless Shell (via @remotion/renderer) cannot start because the system is missing required shared libraries (NSPR/NSS and related). This is a missing OS-level dependency, not a code defect.

Fix steps:

bash
sudo apt-get update
sudo apt-get install -y libnspr4 libnss3 libatk1.0-0 libatk-bridge2.0-0 \
  libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 \
  libxfixes3 libxrandr2 libgbm1 libasound2

Or, if Playwright is present in the project:

bash
npx playwright install-deps

Verification: Re-run the Remotion Studio render and confirm the browser process launches without error.

Follow-up: If this environment is containerized/CI-driven, add the dependency install step to the Dockerfile/CI setup so this doesn't recur.

Reference: https://remotion.dev/docs/troubleshooting/browser-launch

Profile: Coder
Branch: feature/PreviewRender

## Backlog


## Done