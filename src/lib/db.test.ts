import db from './db'

describe('database connection', () => {
  it('throws if DATABASE_PATH is not set', () => {
    const originalPath = process.env.DATABASE_PATH
    delete process.env.DATABASE_PATH

    try {
      expect(() => db()).toThrow(
        'DATABASE_PATH environment variable is required'
      )
    } finally {
      process.env.DATABASE_PATH = originalPath
    }
  })

  it('creates DatabaseSync instance with DATABASE_PATH', () => {
    const originalPath = process.env.DATABASE_PATH
    process.env.DATABASE_PATH = './test.db'

    try {
      const connection = db()
      expect(connection).toBeDefined()
      expect(connection.constructor.name).toBe('DatabaseSync')
    } finally {
      process.env.DATABASE_PATH = originalPath
    }
  })
})