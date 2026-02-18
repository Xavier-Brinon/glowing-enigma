## ADDED Requirements

### Requirement: App builds and serves a default page

The system SHALL initialise as a TanStack Start application with TypeScript
strict mode enabled. Running `npm run dev` SHALL start the development server
and serve a default placeholder page at `http://localhost:3000` without
console errors.

#### Scenario: Development server starts cleanly

- **WHEN** the developer runs `npm run dev` in the project root
- **THEN** the Vinxi dev server starts without errors
- **AND** the browser can load `http://localhost:3000` and displays a page

#### Scenario: TypeScript build passes

- **WHEN** the developer runs `npm run typecheck`
- **THEN** the command exits with code 0 and reports zero TypeScript errors

### Requirement: Node.js version is pinned

The project SHALL declare the required Node.js version in `.nvmrc` so that
any contributor can run `nvm use` to activate the correct version.

#### Scenario: Correct Node version in .nvmrc

- **WHEN** a developer reads `.nvmrc`
- **THEN** it contains `24.13` or a higher LTS version string

### Requirement: Environment variables are managed via dotenvx

The project SHALL use dotenvx to manage environment variables. The encrypted
`.env` file MUST be committed to git. The `.env.keys` decryption file MUST
be listed in `.gitignore` and MUST NOT be committed.

#### Scenario: DATABASE_PATH is set via dotenvx

- **WHEN** the developer runs `npx dotenvx set DATABASE_PATH ./data/books.db`
- **THEN** the `.env` file is updated with an encrypted value for `DATABASE_PATH`
- **AND** the plaintext value is NOT visible in the committed `.env` file

#### Scenario: .env.keys is not tracked by git

- **WHEN** the developer runs `git status` after dotenvx initialisation
- **THEN** `.env.keys` does not appear in tracked or untracked files

#### Scenario: npm run dev reads DATABASE_PATH

- **WHEN** the developer runs `npm run dev`
- **THEN** the `dotenvx run --` prefix in `package.json` decrypts and injects
  `DATABASE_PATH` into the process environment before the app starts

### Requirement: Database connection module exists

The project SHALL provide `src/lib/db.ts` that opens a `node:sqlite`
`Database` connection using the `DATABASE_PATH` environment variable and
exports it as the default export. No tables are created at this stage.

#### Scenario: db module imports without error

- **WHEN** a test imports `src/lib/db.ts`
- **THEN** no exception is thrown and the exported value is a `node:sqlite`
  `Database` instance

#### Scenario: DATABASE_PATH is required

- **WHEN** `DATABASE_PATH` is not set in the environment
- **THEN** `src/lib/db.ts` throws an error at import time rather than
  silently opening a database at an undefined path

### Requirement: Vitest is configured and a smoke test passes

The project SHALL include Vitest as the test runner. At least one smoke test
MUST exist and MUST pass when `npm test` is run, confirming the test
infrastructure is correctly wired.

#### Scenario: npm test passes on fresh install

- **WHEN** the developer runs `npm test` on a clean install
- **THEN** the command exits with code 0 and reports at least one passing test

### Requirement: Prettier is configured and code is formatted

The project SHALL include Prettier. All committed source files MUST be
Prettier-clean. Running `npm run format:check` SHALL exit with code 0.

#### Scenario: Format check passes on committed files

- **WHEN** the developer runs `npm run format:check`
- **THEN** the command exits with code 0, indicating no formatting violations
