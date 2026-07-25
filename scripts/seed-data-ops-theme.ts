import { config } from 'dotenv'
config({ path: '.env.local' })
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../lib/db/schema'
import { eq } from 'drizzle-orm'

// 先定義資料，之後主檔案建好後會改 import
// 暫時直接在這裡定義常數
const THEME = '資料操作實作題'
const DATA_OPS_SUB_CATEGORIES = [
  { name: '資料轉換與格式化', order: 1 },
  { name: '資料過濾與搜尋', order: 2 },
  { name: '資料聚合與統計', order: 3 },
  { name: '業務場景實作', order: 4 },
]

// 20 個 topic 的 metadata（不含 problems，只有 seed 需要的欄位）
const topicMeta = [
  // 資料轉換與格式化
  { slug: 'array-to-lookup', title: '陣列轉查找表（Lookup Table）', description: '將陣列轉換為以特定欄位為 key 的物件，實現 O(1) 查找', subCategory: '資料轉換與格式化', difficulty: 'easy' },
  { slug: 'reshape-data', title: '資料結構重塑（Data Reshaping）', description: '將不同格式的資料結構互相轉換，適應不同的使用場景', subCategory: '資料轉換與格式化', difficulty: 'medium' },
  { slug: 'flatten-nested', title: '巢狀資料扁平化與樹狀還原', description: '將多層巢狀的樹狀結構扁平化，或將扁平資料還原成樹狀', subCategory: '資料轉換與格式化', difficulty: 'medium' },
  { slug: 'serialize-parse', title: '資料序列化與解析', description: '在物件陣列、CSV、Query String 等格式之間互相轉換', subCategory: '資料轉換與格式化', difficulty: 'medium' },
  { slug: 'normalize-data', title: '多來源資料標準化', description: '合併不同來源、格式不一致的資料，進行欄位重命名、型別轉換、填補預設值', subCategory: '資料轉換與格式化', difficulty: 'medium' },
  // 資料過濾與搜尋
  { slug: 'multi-filter', title: '多條件動態篩選', description: '根據多個篩選條件同時過濾複雜資料結構', subCategory: '資料過濾與搜尋', difficulty: 'medium' },
  { slug: 'fuzzy-search', title: '模糊搜尋實作', description: '在多個欄位中搜尋關鍵字，支援部分匹配與大小寫不敏感', subCategory: '資料過濾與搜尋', difficulty: 'medium' },
  { slug: 'dedup-merge', title: '資料去重與合併', description: '合併多份資料來源，處理重複項目，欄位合併策略', subCategory: '資料過濾與搜尋', difficulty: 'medium' },
  { slug: 'nested-filter', title: '巢狀資料結構過濾', description: '在巢狀物件陣列中過濾資料，保留完整的父層結構', subCategory: '資料過濾與搜尋', difficulty: 'hard' },
  { slug: 'sort-complex', title: '複合條件排序', description: '對複雜物件陣列進行多欄位、多方向的排序，處理特殊值與中文排序', subCategory: '資料過濾與搜尋', difficulty: 'medium' },
  // 資料聚合與統計
  { slug: 'group-stats', title: '分組聚合統計', description: '將資料依特定欄位分組，計算每組的統計指標', subCategory: '資料聚合與統計', difficulty: 'medium' },
  { slug: 'frequency-count', title: '頻率統計與排行分析', description: '計算元素出現頻率，找出最常見或最罕見的項目', subCategory: '資料聚合與統計', difficulty: 'easy' },
  { slug: 'data-summary', title: '資料摘要計算', description: '從物件陣列計算各種統計摘要，包含平均、中位數、百分位數', subCategory: '資料聚合與統計', difficulty: 'medium' },
  { slug: 'ranking-system', title: '排名與計分系統', description: '根據多項指標計算綜合分數，處理並列排名', subCategory: '資料聚合與統計', difficulty: 'medium' },
  { slug: 'time-series', title: '時間序列資料操作', description: '處理含時間戳的資料：補齊缺漏日期、轉換時間粒度、計算時間差', subCategory: '資料聚合與統計', difficulty: 'hard' },
  // 業務場景實作
  { slug: 'shopping-cart', title: '購物車業務邏輯實作', description: '實作真實電商購物車的資料處理：加減數量、折扣計算、優惠碼套用', subCategory: '業務場景實作', difficulty: 'medium' },
  { slug: 'permission-system', title: '使用者權限管理系統', description: '實作角色繼承、資源授權判斷的權限管理邏輯', subCategory: '業務場景實作', difficulty: 'hard' },
  { slug: 'todo-operations', title: '進階待辦事項資料操作', description: '處理含有標籤、優先級、截止日的複雜待辦清單資料', subCategory: '業務場景實作', difficulty: 'medium' },
  { slug: 'inventory-calc', title: '庫存管理計算', description: '從進出貨紀錄計算現有庫存、成本、低庫存警示', subCategory: '業務場景實作', difficulty: 'medium' },
  { slug: 'data-pipeline', title: '資料處理管線實作', description: '串接多個轉換步驟，建立可組合的資料處理流程', subCategory: '業務場景實作', difficulty: 'hard' },
]

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema })

async function seed() {
  // 1. Seed subCategories
  for (const sub of DATA_OPS_SUB_CATEGORIES) {
    await db.insert(schema.themeSubCategories)
      .values({ theme: THEME, name: sub.name, order: sub.order })
      .onConflictDoUpdate({
        target: [schema.themeSubCategories.theme, schema.themeSubCategories.name],
        set: { order: sub.order }
      })
    console.log(`  ✓ 子類別: ${sub.name}`)
  }

  // 2. Seed topics（只有 metadata，不插入 questions）
  for (const meta of topicMeta) {
    await db.insert(schema.topics)
      .values({
        slug: meta.slug,
        title: meta.title,
        description: meta.description,
        category: 'JavaScript',
        difficulty: meta.difficulty,
        theme: THEME,
        subCategory: meta.subCategory,
      })
      .onConflictDoUpdate({
        target: schema.topics.slug,
        set: {
          title: meta.title,
          description: meta.description,
          category: 'JavaScript',
          difficulty: meta.difficulty,
          theme: THEME,
          subCategory: meta.subCategory,
        }
      })
    console.log(`✓ topic: ${meta.slug}`)
  }

  console.log('\n✅ 完成')
  process.exit(0)
}

seed().catch(e => { console.error(e); process.exit(1) })
