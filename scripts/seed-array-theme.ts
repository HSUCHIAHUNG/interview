import { config } from 'dotenv'
config({ path: '.env.local' })
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../lib/db/schema'

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema })

const THEME = '陣列方法'

const subCategories = [
  { name: '會改變原始陣列', order: 1 },
  { name: '回傳陣列元素資訊或索引值', order: 2 },
  { name: '針對每個元素處理', order: 3 },
  { name: '產生新的陣列或新的值', order: 4 },
  { name: '判斷並回傳布林值', order: 5 },
  { name: '其他用法', order: 6 },
]

async function seed() {
  console.log(`新增主題「${THEME}」的子類別...`)

  for (const sub of subCategories) {
    await db
      .insert(schema.themeSubCategories)
      .values({ theme: THEME, name: sub.name, order: sub.order })
      .onConflictDoUpdate({
        target: [schema.themeSubCategories.theme, schema.themeSubCategories.name],
        set: { order: sub.order },
      })
    console.log(`  ✓ ${sub.name}`)
  }

  console.log('\n✅ 完成')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
