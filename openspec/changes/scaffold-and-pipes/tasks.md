## 0. Git Setup

- [x] 0.1 Run `git fetch origin` to get the latest remote state
- [x] 0.2 Create worktree and branch from origin/main:
      `git worktree add ../OpenSpec-scaffold-and-pipes -b feature/scaffold-and-pipes origin/main`
- [x] 0.3 Confirm worktree is active and on the correct branch
- [x] 0.4 Switch into the worktree directory for all subsequent work:
      `cd ../OpenSpec-scaffold-and-pipes`

## 1. Project Scaffold

- [x] 1.0 Run pwd to confirm you are in ../OpenSpec-scaffold-and-pipes; cd into it if not
- [x] 1.1 Run the scaffold command inside the worktree (--no-git prevents a nested git repo):
        `npx @tanstack/cli@latest create book-tracker --framework React --no-examples --no-toolchain --no-git --package-manager npm --target-dir . --force`
- [x] 1.2 Delete scaffold boilerplate routes and components not needed for this change
- [x] 1.3 Verify TypeScript strict mode is enabled in `tsconfig.json` (`"strict": true`)
- [x] 1.4 Create `.nvmrc` with `24.13`
- [x] 1.5 Run `nvm use` and confirm the correct Node version is active
- [x] 1.6 Run `npm run typecheck` — zero errors
- [x] 1.R Reviewer sign-off → Review-phase1-project-scaffold.md

## 2. Oxlint + Oxfmt

- [x] 2.0 Run pwd to confirm you are in ../OpenSpec-scaffold-and-pipes; cd into it if not
- [x] 2.1 Install `oxlint` and `oxfmt` as devDependencies
- [x] 2.2 Add `npm run lint` script: `oxlint .`
- [x] 2.3 Add `npm run format` script: `oxfmt --write .`
- [x] 2.4 Add `npm run format:check` script: `oxfmt --check .`
- [x] 2.5 Run `npm run lint` — zero violations
- [x] 2.6 Run `npm run format` then `npm run format:check` — exits 0
- [x] 2.R Reviewer sign-off → Review-phase2-oxlint-oxfmt.md

## 3. dotenvx

- [x] 3.0 Run pwd to confirm you are in ../OpenSpec-scaffold-and-pipes; cd into it if not
- [x] 3.1 Install `dotenvx` and prefix the `npm run dev` script with `dotenvx run --`
- [x] 3.2 Run `npx dotenvx set DATABASE_PATH ./data/books.db` to create the encrypted `.env`
- [x] 3.3 Confirm `.env` is committed-safe (encrypted value visible, plaintext not)
- [x] 3.4 Add `.env.keys` to `.gitignore` and confirm it does not appear in `git status`
- [x] 3.5 Back up `.env.keys` outside the repository
- [x] 3.R Reviewer sign-off → Review-phase3-dotenvx.org

## 4. Database Connection

- [x] 4.0 Run pwd to confirm you are in ../OpenSpec-scaffold-and-pipes; cd into it if not
- [x] 4.1 Write failing test: `src/lib/db.ts` exports a `node:sqlite` `Database` instance
- [x] 4.2 Create `src/lib/db.ts` — open connection using `DATABASE_PATH`, throw if env var is missing
- [x] 4.3 Run `npm test` — db test passes
- [x] 4.4 Commit: `phase-1: add node:sqlite connection module with DATABASE_PATH guard`
- [x] 4.R Reviewer sign-off → Review-phase4-database-connection.md

## 5. Vitest Smoke Test

- [ ] 5.0 Run pwd to confirm you are in ../OpenSpec-scaffold-and-pipes; cd into it if not
- [ ] 5.1 Confirm Vitest is installed and `npm test` is wired up
- [ ] 5.2 Ensure at least one smoke test exists and passes (db test from 4.1 qualifies)
- [ ] 5.3 Run `npm test` — exits 0
- [ ] 5.R Reviewer sign-off → Review-phase5-vitest-smoke-test.md

## 6. Default Page

- [ ] 6.0 Run pwd to confirm you are in ../OpenSpec-scaffold-and-pipes; cd into it if not
- [ ] 6.1 Wire `src/routes/__root.tsx` to render a minimal placeholder page (title + "Book Tracker" heading)
- [ ] 6.2 Run `npm run dev` — server starts without console errors
- [ ] 6.3 Open `http://localhost:3000` in the browser — page renders
- [ ] 6.R Reviewer sign-off → Review-phase6-default-page.md

## 7. Pre-Commit Verification

- [ ] 7.0 Run pwd to confirm you are in ../OpenSpec-scaffold-and-pipes; cd into it if not
- [ ] 7.1 Run `npm run typecheck` — zero TypeScript errors
- [ ] 7.2 Run `npm run lint` — zero Oxlint errors
- [ ] 7.3 Run `npm run format:check` — Oxfmt clean
- [ ] 7.4 Run `npm test` — all tests pass
- [ ] 7.5 Commit everything: `phase-1: scaffold TanStack Start with Oxlint, Oxfmt, dotenvx, node:sqlite`
- [ ] 7.R Reviewer sign-off → Review-phase7-pre-commit-verification.md
