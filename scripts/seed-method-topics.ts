import { config } from 'dotenv'
config({ path: '.env.local' })
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../lib/db/schema'
import { arrayMethodChallenges } from '../lib/array-challenges'

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema })

const DIFFICULTY_MAP = { easy: 'easy', medium: 'medium', hard: 'hard' } as const

async function seed() {
  console.log(`新增 ${arrayMethodChallenges.length} 個陣列方法個別主題...`)

  for (const entry of arrayMethodChallenges) {
    await db
      .insert(schema.topics)
      .values({
        slug: entry.slug,
        title: entry.methodName,
        description: entry.description,
        category: 'JavaScript',
        difficulty: DIFFICULTY_MAP[entry.difficulty],
        theme: '陣列方法',
        subCategory: entry.subCategory,
      })
      .onConflictDoUpdate({
        target: schema.topics.slug,
        set: {
          title: entry.methodName,
          description: entry.description,
          category: 'JavaScript',
          difficulty: DIFFICULTY_MAP[entry.difficulty],
          theme: '陣列方法',
          subCategory: entry.subCategory,
        },
      })
    console.log(`  ✓ ${entry.slug} (${entry.subCategory})`)
  }

  console.log('\n✅ 完成')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
