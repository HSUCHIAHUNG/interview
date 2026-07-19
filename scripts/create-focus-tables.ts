import { config } from 'dotenv'
config({ path: '.env.local' })
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { sql } from 'drizzle-orm'

const client = neon(process.env.DATABASE_URL!)
const db = drizzle(client)

async function main() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS user_daily_focus (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      date TEXT NOT NULL,
      seconds INTEGER NOT NULL DEFAULT 0,
      leave_count INTEGER NOT NULL DEFAULT 0,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
      CONSTRAINT user_daily_focus_uniq UNIQUE (user_id, date)
    )
  `)
  console.log('✅ user_daily_focus 建立完成')

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS user_daily_notes (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      date TEXT NOT NULL,
      note TEXT NOT NULL DEFAULT '',
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
      CONSTRAINT user_daily_notes_uniq UNIQUE (user_id, date)
    )
  `)
  console.log('✅ user_daily_notes 建立完成')

  process.exit(0)
}

main().catch(e => { console.error(e); process.exit(1) })
