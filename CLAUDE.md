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

- `specs/` — contains `requirements.md` (or `proposal.md`) and `design.md`
- `changes/` — individual change specs created via `openspec new-change <name>`
- `tasks.md` — tracks implementation progress
- Initialize with: `openspec init` (select `claude-code`)
- Apply a change with: `/opsx apply <change-name>`

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
