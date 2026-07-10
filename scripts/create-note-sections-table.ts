import { config } from 'dotenv'
config({ path: '.env.local' })
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { sql } from 'drizzle-orm'

const client = neon(process.env.DATABASE_URL!)
const db = drizzle(client)

async function main() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS topic_note_sections (
      id serial PRIMARY KEY,
      slug text NOT NULL,
      heading text NOT NULL,
      content text NOT NULL,
      "order" integer NOT NULL DEFAULT 0,
      created_at timestamp DEFAULT now() NOT NULL
    )
  `)
  console.log('✅ topic_note_sections 表建立完成')
  process.exit(0)
}

main().catch(e => { console.error(e); process.exit(1) })
