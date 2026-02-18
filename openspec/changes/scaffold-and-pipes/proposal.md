## Why

The Book Tracker project has no code yet. Before any feature work can
begin, the tech stack must be installed and wired together so every
subsequent change has a working foundation to build on. Without a
runnable scaffold, nothing else can be verified end-to-end.

## What Changes

- Initialise a new TanStack Start project with TypeScript strict mode
- Pin Node.js version via `.nvmrc` (24.13 LTS)
- Configure dotenvx for encrypted environment variables; set
  `DATABASE_PATH`
- Initialise `node:sqlite` database connection in `src/lib/db.ts`
  (schema-less at this stage — just the connection)
- Add Vitest for unit testing
- Add Oxlint for linting (replaces ESLint)
- Add Oxfmt for formatting (replaces Prettier)
- Wire a single root route (`src/routes/__root.tsx`) that renders a
  default placeholder page
- Confirm the app starts with `npm run dev` and displays that page in
  the browser

## Capabilities

### New Capabilities

- `project-scaffold`: TanStack Start app initialised with TypeScript,
  TanStack Router, TanStack Query, Vitest, Oxlint, Oxfmt, dotenvx, and
  node:sqlite — builds cleanly and serves a default page

### Modified Capabilities

<!-- None — this is a greenfield change. No existing specs to delta. -->

## Impact

- Creates the entire project directory structure (`src/`,
  `app.config.ts`, `package.json`, `.nvmrc`, `.env`, `.gitignore`,
  etc.)
- No existing code is modified — this is a net-new scaffold
- All subsequent changes depend on this foundation
