# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OpenSpec is a structured AI-agent workflow methodology for building software projects. It uses four distinct agent personas (Requirements Analyst, Solution Architect, Developer, Reviewer) to replace ad-hoc "vibe coding" with a managed lifecycle.

## Workflow Phases

The project follows a four-persona loop:

1. **Analyst** (`--system-prompt-file analyst.md`) — interviews the user, produces `requirements.md`
2. **Architect** — reads requirements, produces `design.md` with phased implementation plan
3. **Developer** — executes tasks from the spec using TDD, one git branch per task
4. **Reviewer** — audits commits via `git log`/`git diff`, produces transient `comments.md`

The Developer/Reviewer loop repeats until the Reviewer is satisfied, then the branch is merged.

## OpenSpec Structure

OpenSpec lives entirely in the `openspec/` directory at the repo root:

```
openspec/
├── config.yaml          # Authoritative project context injected into every agent
├── schemas/             # JSON schemas for artifact validation
├── standards/           # Human-readable quality gates (kept in sync with config.yaml)
├── specs/               # Project-level specs (not change-specific)
└── changes/
    ├── <change-name>/   # Active change containers
    │   ├── proposal.md  # Why: motivation and high-level scope
    │   ├── specs/       # What: WHEN/THEN requirement scenarios per capability
    │   ├── design.md    # How: architecture decisions and technical plan
    │   └── tasks.md     # Checklist driving implementation
    └── archive/
        └── YYYY-MM-DD-<change-name>/  # Completed changes preserved as decision history
```

Key commands:
- Initialize: `openspec init` (select `claude-code`)
- Create a change: `openspec new change <name>`
- Check status: `openspec status`
- Apply a change: `/opsx:apply <change-name>`
- Archive when done: move change folder to `openspec/changes/archive/YYYY-MM-DD-<name>/`

Slash commands live in `.claude/commands/opsx/` and skills in `.claude/skills/`.

## Development Conventions

- **TDD**: write tests first, then make them pass
- **Small increments**: one git branch per task, smallest possible changes
- **Heavily commented code**: all code should be documented
- **Context management**: monitor token usage with `/context`; restart session if exceeding ~100,000 tokens
- **Style guide**: follow `STYLE_GUIDE.org` (adapted from TigerBeetle's TIGER_STYLE.md) — key rules:
  - Functions: pure leaf functions, push ifs up / fors down, simple return types
  - Types: strict TypeScript, no `any`, explicit function signatures
  - Errors: never swallow silently, validate at boundaries
  - Names: meaningful, never abbreviated, units as suffix (`latencyMs`)
  - Comments: explain *why*, not *what*; sentences with full stops
  - Formatting: delegated to Prettier
  - State: XState for entity lifecycles (book status), plain `useState` for trivial UI only
  - Simplicity: no premature abstractions, no duplicated state, zero technical debt

## Git & PR Policy

- **Never push to remote**: do not run `git push` unless the user explicitly requests it
- **Draft PRs as local files**: when a PR description is needed, write it to a markdown file (e.g., `openspec/changes/<name>/pr.md`) instead of opening a GitHub PR
- **One branch per change**: for every new feature or change, create a dedicated branch and a git worktree:
  ```bash
  git worktree add ../OpenSpec-<change-name> -b feature/<change-name>
  ```
  All implementation work for that change happens inside its worktree directory.
- **Never delete branches**: branches are preserved as history; do not run `git branch -d` or `git branch -D`
- **Never delete worktrees**: do not run `git worktree remove`; worktrees are kept alongside the main checkout
- **Commit after each passing test**: smallest logical unit; message format: `phase-N: describe what changed and why`
- **Do not merge**: merging is a human decision made after Reviewer approval
