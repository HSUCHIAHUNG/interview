import { config } from 'dotenv'
config({ path: '.env.local' })
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../lib/db/schema'
import { inArray } from 'drizzle-orm'

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema })

const CATEGORY_SLUGS = [
  'array-mutating',
  'array-info',
  'array-iteration',
  'array-transform',
  'array-boolean',
  'array-other',
]

async function remove() {
  // Step 1: 找出這些 topic 的 id
  const topicRows = await db
    .select({ id: schema.topics.id, slug: schema.topics.slug })
    .from(schema.topics)
    .where(inArray(schema.topics.slug, CATEGORY_SLUGS))

  const topicIds = topicRows.map(r => r.id)
  console.log(`找到 ${topicIds.length} 個主題`)

  if (topicIds.length === 0) {
    console.log('無需刪除')
    process.exit(0)
  }

  // Step 2: 刪除關聯的 questions
  const qResult = await db
    .delete(schema.questions)
    .where(inArray(schema.questions.topicId, topicIds))
    .returning({ id: schema.questions.id })
  console.log(`已刪除 ${qResult.length} 個題目`)

  // Step 3: 刪除 topics
  const tResult = await db
    .delete(schema.topics)
    .where(inArray(schema.topics.slug, CATEGORY_SLUGS))
    .returning({ slug: schema.topics.slug })
  tResult.forEach(r => console.log(`  ✓ 已刪除主題：${r.slug}`))

  console.log(`\n✅ 完成`)
  process.exit(0)
}

remove().catch((err) => {
  console.error(err)
  process.exit(1)
})
