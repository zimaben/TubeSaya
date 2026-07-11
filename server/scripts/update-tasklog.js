#!/usr/bin/env node
// Archives the current In Progress task from tasks.md into tasklog.md
// under the given RC group, then walks you through defining what's next.

import fs from "fs";
import readline from "readline";

const TASKS_PATH = ".claude/tasks.md";
const TASKLOG_PATH = ".claude/tasklog.md";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, res));

function readFile(path) {
  return fs.readFileSync(path, "utf8");
}

function extractInProgressBlock(tasksMd) {
  const match = tasksMd.match(/## In Progress\n([\s\S]*?)\n## Backlog/);
  if (!match || !match[1].trim()) {
    console.error("No In Progress task found in tasks.md.");
    process.exit(1);
  }
  return match[1].trim();
}

function toArchiveEntry(block) {
  // Convert "- [ ] Title" (or "[x]") into "### Title", keep sub-bullets as-is.
  const lines = block.split("\n");
  const titleLine = lines[0].replace(/^- \[[ x]\]\s*/, "");
  const rest = lines.slice(1).join("\n");
  return `### ${titleLine}\n${rest}`.trim();
}

function appendToTasklog(entry, rcTag) {
  let log = readFile(TASKLOG_PATH);
  const rcHeader = `## ${rcTag}`;

  if (log.includes(rcHeader)) {
    // Insert at the end of the existing RC section (before the next "## " or EOF)
    const sectionRegex = new RegExp(`(${rcHeader}\\n)([\\s\\S]*?)(\\n## |$)`);
    log = log.replace(sectionRegex, (m, head, body, tail) => {
      return `${head}${body.trimEnd()}\n\n${entry}\n${tail}`;
    });
  } else {
    log = `${log.trimEnd()}\n\n${rcHeader}\n\n${entry}\n`;
  }

  fs.writeFileSync(TASKLOG_PATH, log);
}

function clearInProgress(tasksMd) {
  return tasksMd.replace(/## In Progress\n[\s\S]*?\n## Backlog/, "## In Progress\n\n\n## Backlog");
}

async function buildNextTask() {
  console.log("\n--- What's next? ---");
  const title = await ask("Task description: ");
  const profile = (await ask("Profile (Coder/Librarian) [Coder]: ")) || "Coder";
  const branch = await ask("Branch: ");

  const tests = [];
  console.log("Enter Passed Test conditions, one per line. Blank line to finish.");
  while (true) {
    const t = await ask(`  Passed Test ${tests.length + 1}: `);
    if (!t.trim()) break;
    tests.push(t.trim());
  }

  let block = `- [ ] ${title}\n  - Profile: ${profile}\n  - Branch: ${branch}\n`;
  for (const t of tests) {
    block += `  - Passed Test: ${t}\n`;
  }
  return block.trimEnd();
}

async function main() {
  const tasksMd = readFile(TASKS_PATH);
  const block = extractInProgressBlock(tasksMd);

  console.log("--- Current In Progress task ---\n");
  console.log(block);
  const confirm = await ask("\nArchive this as complete? (y/n): ");
  if (confirm.toLowerCase() !== "y") {
    console.log("Aborted — nothing changed.");
    rl.close();
    return;
  }

  const rcTag = await ask("RC tag for archive (e.g. RC/1.0.2): ");
  const entry = toArchiveEntry(block);
  appendToTasklog(entry, rcTag);

  let updatedTasks = clearInProgress(tasksMd);

  const addNext = await ask("\nDefine the next In Progress task now? (y/n): ");
  if (addNext.toLowerCase() === "y") {
    const nextBlock = await buildNextTask();
    updatedTasks = updatedTasks.replace(
      "## In Progress\n\n\n## Backlog",
      `## In Progress\n${nextBlock}\n\n## Backlog`
    );
  }

  fs.writeFileSync(TASKS_PATH, updatedTasks);
  console.log(`\nDone. Archived to ${TASKLOG_PATH} under ${rcTag}, tasks.md updated.`);
  rl.close();
}

main();