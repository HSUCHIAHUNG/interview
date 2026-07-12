import { config } from 'dotenv'
config({ path: '.env.local' })
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { sql } from 'drizzle-orm'

const client = neon(process.env.DATABASE_URL!)
const db = drizzle(client)

async function main() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS user_starred_problems (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      topic_slug TEXT NOT NULL,
      problem_id TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      UNIQUE(user_id, topic_slug, problem_id)
    )
  `)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS usp_user_idx ON user_starred_problems(user_id)`)
  console.log('✅ user_starred_problems 建立完成')
  process.exit(0)
}
main().catch(e => { console.error(e); process.exit(1) })
