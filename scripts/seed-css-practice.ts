import { config } from 'dotenv'
config({ path: '.env.local' })
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../lib/db/schema'
import { eq } from 'drizzle-orm'
import { cssLayoutChallenges } from '../lib/css-layout-challenges'

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema })

const THEME = '前端切版'

const subCategories = [
  { name: 'Flexbox',  order: 1 },
  { name: 'Grid',     order: 2 },
  { name: '置中技巧', order: 3 },
  { name: '動畫',     order: 4 },
  { name: '表單',     order: 5 },
  { name: '元件',     order: 6 },
  { name: '完整頁面', order: 7 },
]

async function seed() {
  console.log(`\n=== 前端切版 ===`)

  // 1. Upsert sub-categories
  for (const sub of subCategories) {
    await db.insert(schema.themeSubCategories)
      .values({ theme: THEME, name: sub.name, order: sub.order })
      .onConflictDoUpdate({
        target: [schema.themeSubCategories.theme, schema.themeSubCategories.name],
        set: { order: sub.order },
      })
    console.log(`  ✓ 子類別: ${sub.name}`)
  }

  // 2. Upsert topics
  for (const entry of cssLayoutChallenges) {
    const subCat = entry.category
    const subOrder = subCategories.findIndex(s => s.name === subCat) + 1

    const existing = await db.select({ id: schema.topics.id })
      .from(schema.topics)
      .where(eq(schema.topics.slug, entry.slug))
      .limit(1)

    if (existing.length > 0) {
      await db.update(schema.topics)
        .set({
          title: entry.title,
          description: entry.description,
          theme: THEME,
          subCategory: subCat,
          category: 'CSS',
          difficulty: entry.difficulty,
        })
        .where(eq(schema.topics.slug, entry.slug))
      console.log(`  ↺ 更新: ${entry.slug}`)
    } else {
      await db.insert(schema.topics).values({
        slug: entry.slug,
        title: entry.title,
        description: entry.description,
        theme: THEME,
        subCategory: subCat,
        category: 'CSS',
        difficulty: entry.difficulty,
        order: subOrder,
      })
      console.log(`  + 新增: ${entry.slug}`)
    }
  }

  console.log('\n✅ 完成')
  process.exit(0)
}

seed().catch(e => { console.error(e); process.exit(1) })
