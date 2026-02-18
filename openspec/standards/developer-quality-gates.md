# Developer Quality Gates

Distilled from `personas/developer.md`.
**Human reference only.** The full content of this file is inlined into
`openspec/config.yaml` under `context:` and is injected into every agent
automatically. Edit this file and config.yaml in sync.

## TDD Pattern — Mandatory for Every Task

1. Write a failing test that describes the expected behaviour
2. Implement the minimum code to make the test pass
3. Verify the test passes (`npm test`)
4. Refactor if needed — do not change behaviour, only structure
5. Commit with a descriptive message

Never implement a feature before writing its test. The test is the
specification made executable.

## Git Workflow

```bash
# One branch per change (OPSX change name maps to branch name)
git checkout -b feature/<change-name>

# Commit after each passing test — smallest logical unit
git add .
git commit -m "<phase>: <what changed and why>"

# Do not push to remote until the Reviewer approves
# Do not merge multiple changes into one branch
```

Commit message format: `phase-N: describe what changed and why in one line`

## Pre-Commit Gates

Run these before every commit. Do not commit if any fail.

```bash
npm run typecheck   # zero TypeScript errors
npm run lint        # zero linting errors
npm test            # all tests pass
```

Also verify manually:

- The app starts with `npm run dev` without console errors
- The changed user flow works end-to-end in the browser

## Implementation Rules

### TypeScript

- Strict mode — no exceptions
- No `any` types — use `unknown` + type guards when type is truly unknown
- Explicit types on all function signatures (parameters and return type)
- Let TypeScript infer local variables where inference is obvious

### Server Functions

- All CRUD operations go through `createServerFn` — no Express, no raw fetch
- Every `createServerFn` has an `inputValidator`
- Server functions live in the route file that uses them
- Database calls go through `src/lib/db.ts` only

### State Management

- Book lifecycle transitions go through `send({ type: 'EVENT' })` on the XState machine
- Never assign `book.status = '...'` directly anywhere
- `useMachine` / `useActor` from `@xstate/react` for component integration
- `useState` only for trivial UI state (modal open/closed, toggle, form focus)

### Error Handling

- Never swallow errors — no empty `catch` blocks
- Server functions return structured error responses
- UI shows error states to the user
- Database operations wrapped in try/catch with meaningful messages

### Environment Variables

- Use `npx dotenvx set KEY value` — never edit `.env` by hand
- `.env` is committed (encrypted); `.env.keys` is gitignored (never committed)
- Access server-side vars via `process.env`; client-side via `import.meta.env.VITE_*`

### Code Style

- No magic strings — define constants for all status values
- No commented-out code
- Comments explain _why_, not _what_; full sentences with full stops
- Prettier handles formatting — run it and commit; never fight it

## Phase Sequence

Implement in this order. Each phase must be complete and tested before
starting the next.

| Phase | Scope                                                         | Branch                         |
| ----- | ------------------------------------------------------------- | ------------------------------ |
| 1     | Project scaffolding, dotenvx setup, `.nvmrc`                  | `feature/<change>-setup`       |
| 2     | `src/lib/db.ts` schema, `createServerFn` CRUD, XState machine | `feature/<change>-data`        |
| 3     | Book list page, `useQuery`, `BookCard` component              | `feature/<change>-list`        |
| 4     | Add book form, `BookForm`, POST mutation                      | `feature/<change>-create`      |
| 5     | Edit page, delete with confirmation, mutations                | `feature/<change>-edit-delete` |
| 6     | Status toggle on list, basic styling, empty state             | `feature/<change>-polish`      |

## Quality Checklist Before Requesting Review

- [ ] All tasks in `tasks.md` are checked off
- [ ] `npm run typecheck` — zero errors
- [ ] `npm run lint` — zero errors
- [ ] `npm test` — all pass
- [ ] Manual walkthrough: add → list → edit → delete → status toggle
- [ ] Data persists after restarting `npm run dev`
- [ ] No `any` types, no empty `catch` blocks, no direct status assignment
- [ ] All `createServerFn` calls have `inputValidator`
- [ ] `.env.keys` is in `.gitignore` and not committed
