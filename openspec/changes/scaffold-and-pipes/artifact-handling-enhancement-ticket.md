# Feature Request: Numbered Artifact Files + Browser UI

**Project:** OpenSpec / opsx
**Repo:** https://github.com/Fission-AI/OpenSpec
**Type:** Enhancement
**Title:** Numbered artifact files and a browsable artifact explorer

---

## Summary

Two related improvements inspired by
[MADR](https://github.com/adr/madr) (Markdown Architectural Decision
Records):

1. **Numbered artifact filenames** — prefix every change artifact with
   a zero-padded sequence number so artifacts sort chronologically and
   can be referenced unambiguously by number.
2. **Artifact browser** — a lightweight tool (CLI or web UI) to list,
   filter, and read all artifacts across changes, similar to what
   [Log4brains](https://github.com/thomvaill/log4brains) or
   [adr-viewer](https://github.com/mrwilson/adr-viewer) do for ADRs.

---

## Motivation

### Problem 1 — artifacts have no stable, ordered identity

Today a completed change lives at
`openspec/changes/archive/YYYY-MM-DD-<name>/`. Inside it, artifact
files are named by role (`proposal.md`, `design.md`, `tasks.md`) but
carry no global sequence number. This means:

- You cannot say "see change #0003" in a conversation or commit
  message.
- Shell `ls` sorts alphabetically by name, not creation order.
- Cross-linking between changes ("this supersedes #0007") is not
  possible without full path quoting.
- Archive folder names already carry the date, but the date alone is
  ambiguous when multiple changes are archived on the same day.

MADR solved this for ADRs by adopting the convention
`NNNN-title-with-dashes.md` (four zero-padded digits, up to 9 999
records). The same principle applied to opsx changes would give each
change a globally unique, stable, sortable identifier.

### Problem 2 — no way to browse the artifact corpus

Once a project accumulates tens of archived changes, finding relevant
history requires `grep` or manual directory traversal. MADR's
ecosystem grew an entire family of tools to address exactly this:

- [Log4brains](https://github.com/thomvaill/log4brains) — static site
  with search, rendered from markdown on disk.
- [adr-viewer](https://github.com/mrwilson/adr-viewer) —
  single-command Python app that generates a searchable HTML page.
- [Backstage ADR
  plugin](https://github.com/backstage/community-plugins/tree/main/workspaces/adr/plugins/adr)
  — enterprise-scale search across multiple repos.
- [ADR Manager](https://adr.github.io/adr-manager/) — web UI connected to GitHub.

opsx has no equivalent. Proposals, specs, designs, and tasks are only
readable if you know the exact file path.

---

## Proposed Changes

### 1. Numbered change directories

Assign each change a zero-padded four-digit sequence number at creation time:

```
openspec/changes/
  0001-scaffold-and-pipes/
  0002-book-crud/
  0003-status-machine/
  ...
  archive/
    0001-scaffold-and-pipes/   ← number preserved on archive
    0002-book-crud/
```

The sequence counter is maintained in a single file (e.g.,
`openspec/.change-counter`) or derived by scanning existing
directories — whichever is simpler. The `openspec new change <name>`
command would assign the next number automatically and create
`NNNN-<name>/`.

Benefits:
- Stable short references: "change 0003", "#0003".
- `ls` sorts chronologically without relying on date prefixes.
- Archive preserves the number, so `0003-status-machine` remains
  `0003-status-machine` after archiving, not
  `2026-02-18-status-machine`.
- Cross-change references in `design.md` or `tasks.md` are unambiguous.

### 2. Numbered spec files within a change

Extend numbering to the artifact files themselves:

```
openspec/changes/0001-scaffold-and-pipes/
  proposal.md          ← role-named, single file, no number needed
  design.md
  tasks.md
  specs/
    0001-project-scaffold/
      spec.md
    0002-dotenvx-setup/
      spec.md
```

Spec capability folders already have names; adding a number makes
ordering explicit when multiple capabilities ship in one change.

### 3. `openspec list` command (CLI browser)

A new subcommand that renders a summary table of all changes:

```
$ openspec list

  #     Name                   Status     Artifacts   Date
  ────────────────────────────────────────────────────────
  0003  status-machine         active     3/4         2026-02-17
  0002  book-crud              archived   4/4         2026-02-10
  0001  scaffold-and-pipes     archived   4/4         2026-02-05
```

Options:
- `--active` — show only in-progress changes
- `--archived` — show only archived changes
- `--json` — machine-readable output for piping

### 4. `openspec browse` command (optional, stretch goal)

Launch a local static site (similar to Log4brains) that renders all
artifacts as navigable HTML with full-text search. Implementation
could reuse an existing tool (Log4brains, adr-viewer) or be a thin
wrapper around a markdown-to-HTML converter pointed at
`openspec/changes/`.

---

## Prior Art

| Tool | Approach | Relevance |
|------|----------|-----------|
| [MADR](https://github.com/adr/madr) | `NNNN-title.md` numbering | Direct inspiration for numbered changes |
| [Log4brains](https://github.com/thomvaill/log4brains) | CLI + static site from MADR files | Model for `openspec browse` |
| [adr-viewer](https://github.com/mrwilson/adr-viewer) | Single-command HTML generator | Simpler alternative for browse |
| [adr-log](https://github.com/adr/adr-log) | Keeps `index.md` up to date | Model for `openspec list` |
| [ADR Manager](https://adr.github.io/adr-manager/) | Web UI on GitHub | Web-based stretch goal |

---

## Open Questions

1. **Counter storage** — file-based counter (`.change-counter`) vs.
   directory scan? File is simpler; scan avoids state drift.
2. **Backward compatibility** — should existing un-numbered archives
   be retroactively renumbered, or left as-is with a migration note?
3. **Spec numbering scope** — should spec capability folders be
   numbered per-change (resetting at `0001` each time) or globally
   across all changes?
4. **Browse tooling** — build new or wrap an existing tool (Log4brains
   is MIT-licensed and could be vendored)?

---

## Acceptance Criteria

- `openspec new change <name>` assigns and displays the next sequence number.
- The created directory is named `NNNN-<name>/`.
- `openspec archive <name>` preserves the number in the archive path.
- `openspec list` outputs a table of all changes with number, name,
  status, artifact progress, and date.
- Existing projects without numbered changes continue to work
  (graceful degradation).
