import { afterEach, vi } from 'vitest'
import { createDatabaseConnection } from './db'

describe('database connection', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('throws if DATABASE_PATH is not set', () => {
    vi.stubEnv('DATABASE_PATH', undefined)

    expect(() => createDatabaseConnection()).toThrow('DATABASE_PATH environment variable is required')
  })

  it('creates DatabaseSync instance with DATABASE_PATH', () => {
    vi.stubEnv('DATABASE_PATH', ':memory:')

    // `using` ensures the connection is closed automatically when this
    // block exits, even if an assertion throws. DatabaseSync implements
    // Symbol.dispose natively in Node 22+.
    using connection = createDatabaseConnection()
    expect(connection).toBeDefined()
    expect(connection.constructor.name).toBe('DatabaseSync')
  })
})
