## Context

The Book Tracker is a greenfield project. No `package.json`, no source
files, and no database exist yet. This change creates the entire
foundation that every subsequent change will build on. The tech stack
choices are already settled via ADRs 0002–0005 and 0008; this design does
not revisit them — it specifies how to wire them together into a working,
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
- Create `src/lib/db.ts` with a `createDatabaseConnection()` factory
  that returns a `DatabaseSync` instance for use with `using` (no schema yet)
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

### Decision 3: `src/lib/db.ts` exports a factory function, not a singleton

Export a `createDatabaseConnection()` factory that returns a `DatabaseSync`
instance. Callers use the `using` declaration to guarantee the connection is
closed when the owning scope exits — even on throw.

```ts
using db = createDatabaseConnection()
const row = db.prepare('SELECT COUNT(*) AS n FROM books').get()
// db.close() fires automatically when this block exits.
```

Tables are defined in the next change when there is something to store.

**Why a factory instead of a module-level singleton?** A singleton has ambiguous
ownership — no single scope is responsible for closing it, so disposal depends
on process exit or manual cleanup. A factory + `using` makes ownership lexical
and explicit: the caller that creates the connection also disposes it,
automatically, via scope exit.

**Why not defer `db.ts` entirely?** Having the file exist verifies that
`node:sqlite` imports correctly under Node 24.13 LTS and that `DATABASE_PATH` is
resolvable. It also establishes the module boundary that all future database
code will import from, preventing ad-hoc `new DatabaseSync()` calls in route
files.

### Decision 5: Lexical ownership for all database connections

The project uses *lexical ownership* — each connection lives exactly as long as
the code block that created it. This is the simplest ownership model and the
right fit for a single-user local app with no concurrency.

Each `createServerFn` handler will independently call
`using db = createDatabaseConnection()`. No connection pooling, no shared
singletons, no container-level ownership.

**Why not a connection pool?** SQLite is an in-process database with no network
round-trip. Opening a connection is cheap (~1ms). Pooling adds complexity
(borrow/return lifecycle, idle timeouts, pool exhaustion) with no measurable
benefit for a local app. If the project ever migrates to PostgreSQL or serves
concurrent users, the ownership model would evolve to container or pool
ownership — but that decision belongs to a future change, not this one.

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

None. All technology choices are settled by ADRs 0002–0005 and 0008.
