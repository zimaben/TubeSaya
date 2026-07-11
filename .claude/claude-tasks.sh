#!/bin/bash
set -e

branch=$(git branch --show-current 2>/dev/null)

if [ -z "$branch" ]; then
  echo "Not inside a git repo — no branch to match against."
  exit 1
fi

if ! grep -q "Branch: $branch" .claude/tasks.md 2>/dev/null; then
  echo "No task found for the current branch: $branch"
  exit 1
fi

claude "Read .claude/tasks.md and .claude/CLAUDE.md. Find the In Progress task tagged 'Branch: $branch', take on its matching Profile, and continue/update it. Follow any Pass 1/Pass 2 structure exactly as written. Ignore tasks tagged for other branches."