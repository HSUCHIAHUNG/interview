import { config } from 'dotenv'
config({ path: '.env.local' })
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { sql, eq } from 'drizzle-orm'
import * as schema from '../lib/db/schema'

const client = neon(process.env.DATABASE_URL!)
const db = drizzle(client, { schema })

const jsSubCategories = [
  { name: '型別與基礎語法', order: 1 },
  { name: '作用域與函式', order: 2 },
  { name: '物件與參考型別', order: 3 },
  { name: '陣列操作', order: 4 },
  { name: '非同步 JavaScript', order: 5 },
  { name: '瀏覽器與效能', order: 6 },
]

// slug → [subCategory, orderWithinSubCategory]
const jsTopicMap: Record<string, [string, number]> = {
  // 型別與基礎語法
  'js-primitive-types':               ['型別與基礎語法', 1],
  'null-vs-undefined':                ['型別與基礎語法', 2],
  'equality-operators':               ['型別與基礎語法', 3],
  'var-let-const':                    ['型別與基礎語法', 4],
  'hoisting':                         ['型別與基礎語法', 5],
  // 作用域與函式
  'scope':                            ['作用域與函式', 1],
  'function-declaration-vs-expression': ['作用域與函式', 2],
  'closure':                          ['作用域與函式', 3],
  'this-keyword':                     ['作用域與函式', 4],
  // 物件與參考型別
  'by-value-vs-by-reference':         ['物件與參考型別', 1],
  'reference-equality':               ['物件與參考型別', 2],
  'shallow-deep-copy':                ['物件與參考型別', 3],
  'shallow-deep-comparison':          ['物件與參考型別', 4],
  'prototype-chain':                  ['物件與參考型別', 5],
  // 陣列操作
  'array-methods':                    ['陣列操作', 1],
  'map-vs-foreach':                   ['陣列操作', 2],
  'custom-map':                       ['陣列操作', 3],
  // 非同步 JavaScript
  'event-loop':                       ['非同步 JavaScript', 1],
  'callback-function':                ['非同步 JavaScript', 2],
  'async-order':                      ['非同步 JavaScript', 3],
  'promise-purpose':                  ['非同步 JavaScript', 4],
  'promise-vs-async':                 ['非同步 JavaScript', 5],
  'recursive-async':                  ['非同步 JavaScript', 6],
  'ajax-methods':                     ['非同步 JavaScript', 7],
  // 瀏覽器與效能
  'event-bubbling':                   ['瀏覽器與效能', 1],
  'event-propagation':                ['瀏覽器與效能', 2],
  'debounce':                         ['瀏覽器與效能', 3],
  'debounce-vs-throttle':             ['瀏覽器與效能', 4],
}

async function main() {
  // 1. 新增 order 欄位
  await db.execute(sql`ALTER TABLE topics ADD COLUMN IF NOT EXISTS "order" INTEGER NOT NULL DEFAULT 0`)
  console.log('✅ topics.order 欄位確認')

  // 2. 更新 JavaScript 子類別
  console.log('\n更新 JavaScript 子類別...')
  for (const sub of jsSubCategories) {
    await db
      .insert(schema.themeSubCategories)
      .values({ theme: 'JavaScript', name: sub.name, order: sub.order })
      .onConflictDoUpdate({
        target: [schema.themeSubCategories.theme, schema.themeSubCategories.name],
        set: { order: sub.order },
      })
    console.log(`  ✓ ${sub.name} (order: ${sub.order})`)
  }

  // 3. 刪除舊的「理論題」子類別（已無主題使用）
  await db
    .delete(schema.themeSubCategories)
    .where(
      sql`theme = 'JavaScript' AND name = '理論題'`
    )
  console.log('  ✓ 舊「理論題」子類別已移除')

  // 4. 更新每個 JS 主題的 sub_category 和 order
  console.log('\n更新 JavaScript 主題分類與順序...')
  for (const [slug, [subCategory, order]] of Object.entries(jsTopicMap)) {
    const result = await db
      .update(schema.topics)
      .set({ subCategory, order })
      .where(eq(schema.topics.slug, slug))
      .returning({ slug: schema.topics.slug })

    if (result.length === 0) {
      console.log(`  ⚠ 找不到：${slug}`)
    } else {
      console.log(`  ✓ ${slug} → ${subCategory} #${order}`)
    }
  }

  console.log('\n✅ 完成')
  process.exit(0)
}

main().catch(e => { console.error(e); process.exit(1) })
