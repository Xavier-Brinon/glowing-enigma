# Reviewer Checklist

Distilled from `personas/reviewer.md`.
**Human reference only.** The full content of this checklist is inlined
into `openspec/config.yaml` under `context:` and is injected into every
agent automatically. Edit this file and config.yaml in sync.

The Reviewer's job is to verify — not to rewrite. Point out issues with
evidence and specific line references. Be objective and constructive.

## Review Workflow

```bash
# 1. Check out the branch
git checkout <branch>
git log --oneline -10
git diff main...HEAD

# 2. Run quality checks
npm run typecheck
npm run lint

# 3. Test manually
npm run dev
# Walk through: add book → list → edit → delete → status toggle

# 4. Read source files for the changed paths
```

Document findings in the change's `comments.md` with:

- Overall assessment (one paragraph)
- Issues list (severity: critical / important / nice-to-have)
- Specific file:line references where applicable
- Recommendation: approve or request changes

## Approval Criteria

The implementation is approved when **all** of the following are true:

### Functionality

- [ ] Books can be added with title, author, how-heard, expectations
- [ ] Books can be listed and filtered/grouped by status
- [ ] Books can be edited
- [ ] Books can be deleted (with confirmation)
- [ ] Status can be toggled (to-read → reading → done)
- [ ] All data persists correctly across sessions

### Code Quality

- [ ] No `any` types — strict TypeScript throughout
- [ ] No empty `catch` blocks — errors are surfaced, not swallowed
- [ ] No commented-out code
- [ ] No magic strings or numbers — constants used for status values
- [ ] No premature abstractions — every abstraction used in 3+ places
- [ ] No duplicated state — computed values are derived, not cached
- [ ] Naming: meaningful, never abbreviated, units as suffix
- [ ] Comments explain _why_, not _what_; full sentences with full stops
- [ ] Formatting is Prettier-clean

### Testing

- [ ] Tests exist for core functionality (CRUD operations, status transitions)
- [ ] All tests pass (`npm test`)
- [ ] Edge cases covered (empty list, invalid input, missing fields)
- [ ] Server functions tested via route loaders

### Architecture

- [ ] `createServerFn` used for all server logic — no Express, no ad-hoc fetch
- [ ] `inputValidator` present on every `createServerFn`
- [ ] TanStack Query used for client-side data fetching
- [ ] XState machine drives all book status transitions (not direct string assignment)
- [ ] `useState` used only for trivial UI state (modals, toggles)
- [ ] All database access isolated in `src/lib/db.ts`
- [ ] Database connections created via `using db = createDatabaseConnection()` — no leaked or singleton connections
- [ ] Server functions colocated with the route files that use them
- [ ] Parameterized queries only — no SQL injection risk

### Security

- [ ] No plaintext secrets in code or config
- [ ] `.env` encrypted via dotenvx; `.env.keys` gitignored
- [ ] Input validated at all `createServerFn` boundaries

### Documentation

- [ ] Key decisions have comments explaining _why_
- [ ] Component intent is clear without needing to trace the full call stack
- [ ] `tasks.md` is fully checked off

## Feedback Style

- Issue per item, each standalone
- Priority label first: `[critical]`, `[important]`, `[nice-to-have]`
- File and line reference where applicable: `src/lib/db.ts:42`
- Suggest a fix, don't just flag the problem
- Approve explicitly in `comments.md` when satisfied: `## ✓ Approved`
