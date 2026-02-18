## Context

The Book Tracker is a greenfield project. No `package.json`, no source
files, and no database exist yet. This change creates the entire
foundation that every subsequent change will build on. The tech stack
choices are already settled via ADRs 0002–0005; this design does not
revisit them — it specifies how to wire them together into a working,
runnable baseline.

The target is a single `npm run dev` that starts the app and serves a
default page, with all tooling (TypeScript, Oxlint, Oxfmt, Vitest, dotenvx)
configured and passing from the first commit.

## Goals / Non-Goals

**Goals:**
- Initialise TanStack Start with TypeScript strict mode, TanStack
  Router, and TanStack Query
- Pin Node.js via `.nvmrc` (24.13 LTS, required for `node:sqlite`)
- Configure dotenvx: encrypted `.env` committed, `.env.keys`
  gitignored, `DATABASE_PATH` set
- Create `src/lib/db.ts` with an open `node:sqlite` connection (no
  schema yet)
- Add Oxlint and Oxfmt; both passing on first run
- Add Vitest; passing on first run
- Wire `src/routes/__root.tsx` to render a minimal placeholder page
- Verify `npm run dev` serves the page without console errors

**Non-Goals:**
- No database tables or schema — that belongs in the next change
- No XState machines — no entity lifecycle to model yet
- No `createServerFn` calls — nothing to serve
- No UI components beyond the root layout placeholder
- No authentication, deployment config, or CI setup

## Decisions

### Decision 1: Use TanStack Start's official scaffold as the starting point

Use `npx create-tsrouter-app@latest` (or the equivalent TanStack Start CLI)
rather than assembling `app.config.ts` and Vinxi config by hand. The scaffold
guarantees a valid bundler setup and working file-based routing out of the box.

**Why not manual assembly?** TanStack Start's Vinxi bundler has non-obvious
configuration requirements. The scaffold handles them correctly; hand-rolling
risks subtle mis-wiring that would be hard to diagnose later. Boilerplate routes
added by the scaffold will be stripped before the first commit.

### Decision 2: Configure dotenvx before writing any database code

`DATABASE_PATH` must be readable by `src/lib/db.ts` at startup. Configuring
dotenvx first — and adding the `dotenvx run --` prefix to the `npm run dev`
script in `package.json` — ensures the env var is injected before any server
code runs, from the very first execution.

### Decision 3: `src/lib/db.ts` opens the connection but defines no tables

Export a single `db` constant (the open `node:sqlite` `Database` instance).
Tables are defined in the next change when there is something to store.

**Why not defer `db.ts` entirely?** Having the file exist verifies that
`node:sqlite` imports correctly under Node 24.13 LTS and that `DATABASE_PATH` is
resolvable. It also establishes the module boundary that all future database
code will import from, preventing ad-hoc `new Database()` calls in route files.

### Decision 4: Add a Vitest smoke test, not an empty test suite

A single trivial passing test is added so `npm test` exits 0 from the first
commit. This validates the Vitest config is wired correctly and establishes the
TDD baseline required by quality gates. Skipping would make it harder to isolate
config errors when real tests are added later.

## Risks / Trade-offs

- **`node:sqlite` stability.** Node 24.13 LTS ships `node:sqlite` as stable
  (no longer experimental). Pinning to 24.13 in `.nvmrc` ensures this is
  available; developers run `nvm use` before starting.
- **Scaffold boilerplate must be cleaned up.** The TanStack Start scaffold
  includes example routes and components that must be deleted before the first
  commit to avoid confusion. This is an explicit task in `tasks.md`.
- **dotenvx key loss is unrecoverable.** `.env.keys` must be backed up outside
  the repo. Mitigation: noted in `.gitignore` and the project README.

## Open Questions

None. All technology choices are settled by ADRs 0002–0005.
