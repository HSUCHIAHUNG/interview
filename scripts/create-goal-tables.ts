import { config } from 'dotenv'
config({ path: '.env.local' })
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { sql } from 'drizzle-orm'

const client = neon(process.env.DATABASE_URL!)
const db = drizzle(client)

async function main() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS user_weekly_goals (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      theme TEXT NOT NULL,
      weekly_goal INTEGER NOT NULL DEFAULT 0,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
      UNIQUE(user_id, theme)
    )
  `)
  console.log('✅ user_weekly_goals 建立完成')

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS user_question_log (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      topic_slug TEXT NOT NULL,
      mode TEXT NOT NULL,
      logged_at TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS uql_user_idx ON user_question_log(user_id)`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS uql_logged_at_idx ON user_question_log(logged_at)`)
  console.log('✅ user_question_log 建立完成')

  process.exit(0)
}

main().catch(e => { console.error(e); process.exit(1) })
