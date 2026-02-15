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
