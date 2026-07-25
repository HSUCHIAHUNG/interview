import { config } from 'dotenv'
config({ path: '.env.local' })
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../lib/db/schema'
import { eq } from 'drizzle-orm'
import { THEME, NUMBER_SUB_CATEGORIES, numberMethodTopics } from '../lib/number-method-topics'

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema })

async function seed() {
  console.log(`新增主題「${THEME}」的子類別...`)

  for (const sub of NUMBER_SUB_CATEGORIES) {
    await db.insert(schema.themeSubCategories)
      .values({ theme: THEME, name: sub.name, order: sub.order })
      .onConflictDoUpdate({
        target: [schema.themeSubCategories.theme, schema.themeSubCategories.name],
        set: { order: sub.order }
      })
    console.log(`  ✓ 子類別: ${sub.name}`)
  }

  console.log(`\n新增 ${numberMethodTopics.length} 個數字方法主題...`)

  for (const entry of numberMethodTopics) {
    const [topic] = await db.insert(schema.topics)
      .values({
        slug: entry.slug,
        title: entry.title,
        description: entry.description,
        category: 'JavaScript',
        difficulty: entry.difficulty,
        theme: THEME,
        subCategory: entry.subCategory,
      })
      .onConflictDoUpdate({
        target: schema.topics.slug,
        set: {
          title: entry.title,
          description: entry.description,
          category: 'JavaScript',
          difficulty: entry.difficulty,
          theme: THEME,
          subCategory: entry.subCategory,
        }
      })
      .returning()

    // 刪除舊題目並重新插入
    await db.delete(schema.questions).where(eq(schema.questions.topicId, topic.id))
    for (const q of entry.questions) {
      await db.insert(schema.questions).values({
        topicId: topic.id,
        order: q.id,
        question: q.question,
        options: q.options,
        answer: q.answer,
        explanation: q.explanation,
      })
    }

    // 刪除舊筆記並重新插入
    await db.delete(schema.topicNoteSections).where(eq(schema.topicNoteSections.slug, entry.slug))
    for (let i = 0; i < entry.notes.sections.length; i++) {
      await db.insert(schema.topicNoteSections).values({
        slug: entry.slug,
        heading: entry.notes.sections[i].heading,
        content: entry.notes.sections[i].content,
        order: i,
      })
    }

    // 插入 keyPoints
    await db.delete(schema.methodKeyPoints).where(eq(schema.methodKeyPoints.slug, entry.slug))
    for (const text of entry.keyPoints) {
      await db.insert(schema.methodKeyPoints).values({
        slug: entry.slug,
        text,
      })
    }

    console.log(`✓ ${entry.slug}: ${entry.questions.length}題, ${entry.notes.sections.length}章節, ${entry.keyPoints.length}重點`)
  }

  console.log('\n✅ 完成')
  process.exit(0)
}

seed().catch(e => { console.error(e); process.exit(1) })
