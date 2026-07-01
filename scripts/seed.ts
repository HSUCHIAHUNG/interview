import { config } from 'dotenv'
config({ path: '.env.local' })
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../lib/db/schema'
import { getTopicSlugs, getTopicMeta, getTopicQuestions } from '../lib/topics'

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema })

async function seed() {
  const slugs = getTopicSlugs()
  console.log(`找到 ${slugs.length} 個主題`)

  for (const slug of slugs) {
    const meta = await getTopicMeta(slug)
    const questions = await getTopicQuestions(slug)

    const [topic] = await db
      .insert(schema.topics)
      .values({
        slug,
        title: meta.title,
        description: meta.description,
        category: meta.category,
        difficulty: meta.difficulty,
      })
      .onConflictDoUpdate({
        target: schema.topics.slug,
        set: {
          title: meta.title,
          description: meta.description,
          category: meta.category,
          difficulty: meta.difficulty,
        },
      })
      .returning()

    console.log(`✓ 主題：${slug} (id: ${topic.id})`)

    for (const q of questions) {
      await db
        .insert(schema.questions)
        .values({
          topicId: topic.id,
          order: q.id,
          question: q.question,
          options: q.options ?? null,
          answer: q.answer ?? null,
          explanation: q.explanation,
        })
        .onConflictDoNothing()
    }

    console.log(`  └ ${questions.length} 題已匯入`)
  }

  console.log('\n✅ Seed 完成')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
