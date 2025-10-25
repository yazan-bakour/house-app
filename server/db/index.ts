import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as schema from './schema'

let db: ReturnType<typeof drizzle> | null = null

export function useDB() {
  if (db) return db

  const config = useRuntimeConfig()

  const client = createClient({
    url: config.tursoDbUrl,
    authToken: config.tursoAuthToken,
  })

  db = drizzle(client, { schema })
  return db
}

export { schema }
