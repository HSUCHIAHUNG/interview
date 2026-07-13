import { config } from 'dotenv'
config({ path: '.env.local' })

import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { sql } from 'drizzle-orm'

const client = neon(process.env.DATABASE_URL!)
const db = drizzle(client)

async function main() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS user_week_notes (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      week_start TEXT NOT NULL,
      note TEXT NOT NULL DEFAULT '',
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
      UNIQUE (user_id, week_start)
    )
  `)
  console.log('✓ user_week_notes table created (or already exists)')
}

main().catch(console.error)
