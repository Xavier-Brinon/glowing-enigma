import { DatabaseSync } from 'node:sqlite'

/**
 * Opens a synchronous SQLite database connection using the path declared in
 * the `DATABASE_PATH` environment variable.
 *
 * The variable is injected at runtime by `dotenvx run --` (see `package.json`
 * dev script). Call this function once per request or test scope and dispose
 * of the returned connection with `using` to guarantee it is closed on exit.
 *
 * @throws {Error} When `DATABASE_PATH` is not set in the environment.
 * @returns A `DatabaseSync` instance ready for queries.
 *
 * @example
 * ```ts
 * using db = createDatabaseConnection()
 * const row = db.prepare('SELECT COUNT(*) AS n FROM books').get()
 * ```
 */
export function createDatabaseConnection(): DatabaseSync {
  const databasePath = process.env.DATABASE_PATH

  if (!databasePath) {
    throw new Error(
      'DATABASE_PATH environment variable is required. ' +
        'Please set it using: npx dotenvx set DATABASE_PATH ./data/books.db'
    )
  }

  const connection = new DatabaseSync(databasePath)

  return connection
}