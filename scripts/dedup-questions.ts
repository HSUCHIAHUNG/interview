import { config } from 'dotenv'
config({ path: '.env.local' })
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { sql } from 'drizzle-orm'

const client = neon(process.env.DATABASE_URL!)
const db = drizzle(client)

async function dedup() {
  // Delete duplicate rows, keeping the lowest id per (topicId, order)
  const deleted = await db.execute(sql`
    DELETE FROM questions
    WHERE id NOT IN (
      SELECT MIN(id)
      FROM questions
      GROUP BY topic_id, "order"
    )
  `)
  console.log('刪除重複題目完成', deleted)

  // Add unique constraint if not exists
  await db.execute(sql`
    ALTER TABLE questions
    ADD CONSTRAINT questions_topic_id_order_uniq UNIQUE (topic_id, "order")
  `).catch((e: Error) => {
    if (e.message.includes('already exists')) {
      console.log('unique constraint 已存在，跳過')
    } else {
      throw e
    }
  })

  console.log('✅ 完成')
  process.exit(0)
}

dedup().catch((err) => {
  console.error(err)
  process.exit(1)
})
