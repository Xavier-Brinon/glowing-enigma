import { DatabaseSync } from 'node:sqlite'

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