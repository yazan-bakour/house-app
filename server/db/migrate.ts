import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/libsql'
import { migrate } from 'drizzle-orm/libsql/migrator'
import { createClient } from '@libsql/client'

// Load environment variables from .env file
config()

// Validate environment variables
if (!process.env.TURSO_DB_URL) {
  console.error('❌ Error: TURSO_DB_URL is not set in .env file')
  process.exit(1)
}

if (!process.env.TURSO_AUTH_TOKEN) {
  console.error('❌ Error: TURSO_AUTH_TOKEN is not set in .env file')
  process.exit(1)
}

const client = createClient({
  url: process.env.TURSO_DB_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

const db = drizzle(client)

async function runMigrations() {
  console.log('🔄 Running database migrations...')

  try {
    await migrate(db, { migrationsFolder: './server/db/migrations' })
    console.log('✅ Migrations completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

runMigrations()
