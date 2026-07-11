import { config } from 'dotenv'
config({ path: '.env.local' })
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { sql } from 'drizzle-orm'

const client = neon(process.env.DATABASE_URL!)
const db = drizzle(client)

async function main() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS user_notes (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE,
      content TEXT NOT NULL DEFAULT '',
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `)
  console.log('✅ user_notes 建立完成')
  process.exit(0)
}

main().catch(e => { console.error(e); process.exit(1) })
