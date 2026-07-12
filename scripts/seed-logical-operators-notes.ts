import { config } from 'dotenv'
config({ path: '.env.local' })
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../lib/db/schema'
import { eq } from 'drizzle-orm'

const client = neon(process.env.DATABASE_URL!)
const db = drizzle(client, { schema })

const SLUG = 'logical-operators'

const sections = [
  {
    heading: '短路求值（Short-circuit Evaluation）',
    content: `\`&&\` 和 \`||\` 不一定回傳布林值，而是回傳「決定結果的那個運算元」。

\`\`\`js
// && ：左側 truthy → 回傳右側；左側 falsy → 回傳左側（短路）
'hello' && 42      // 42
null && 'hello'    // null
false && doWork()  // false，doWork() 不執行

// || ：左側 truthy → 回傳左側（短路）；左側 falsy → 回傳右側
'hello' || 'world' // 'hello'
'' || 'default'    // 'default'
0 || 42            // 42
\`\`\`

常見用途：
\`\`\`js
// && 用於條件執行
isLoggedIn && renderDashboard()

// || 用於提供預設值（注意 0、'' 也會觸發）
const name = input || 'Guest'
\`\`\``,
  },
  {
    heading: '?? Nullish Coalescing（空值合併）',
    content: `\`??\` 只在左側為 \`null\` 或 \`undefined\` 時才回傳右側，不受其他 falsy 值影響。

\`\`\`js
0 || 'fallback'   // 'fallback'（0 是 falsy，|| 觸發）
0 ?? 'fallback'   // 0        （0 不是 null/undefined，?? 不觸發）

'' || 'fallback'  // 'fallback'
'' ?? 'fallback'  // ''

null ?? 'default'      // 'default'
undefined ?? 'default' // 'default'
\`\`\`

**選擇原則：**
- 想過濾所有 falsy → 用 \`||\`
- 只想過濾 null/undefined，保留 0 和 \`""\` → 用 \`??\``,
  },
  {
    heading: '?. Optional Chaining 與邏輯賦值運算子',
    content: `**Optional Chaining \`?.\`**

安全地存取深層屬性，遇到 \`null\` 或 \`undefined\` 時直接回傳 \`undefined\` 而不拋出錯誤。

\`\`\`js
const user = null
user.profile.name    // ❌ TypeError
user?.profile?.name  // ✅ undefined

// 也可用於方法呼叫和陣列
arr?.map(fn)   // arr 為 null/undefined 時回傳 undefined
obj?.['key']   // 動態屬性
\`\`\`

**邏輯賦值運算子（ES2021）**

\`\`\`js
a ||= b   // 等效 a = a || b   → a 為 falsy 時才賦值
a &&= b   // 等效 a = a && b   → a 為 truthy 時才賦值
a ??= b   // 等效 a = a ?? b   → a 為 null/undefined 時才賦值

// 常見用途：設定預設值
config.timeout ??= 3000
options.debug ||= false
\`\`\`

**Falsy 值（共 6 個）**

\`false\`、\`0\`（含 \`-0\`、\`0n\`）、\`""\`（空字串）、\`null\`、\`undefined\`、\`NaN\`

注意：\`[]\` 和 \`{}\` 都是 **truthy**。`,
  },
]

async function main() {
  // 清除舊資料（避免重複）
  await db.delete(schema.topicNoteSections).where(eq(schema.topicNoteSections.slug, SLUG))

  for (let i = 0; i < sections.length; i++) {
    await db.insert(schema.topicNoteSections).values({
      slug: SLUG,
      heading: sections[i].heading,
      content: sections[i].content,
      order: i,
    })
  }

  console.log(`✅ ${SLUG} 筆記新增完成（${sections.length} 個章節）`)
  process.exit(0)
}

main().catch(e => { console.error(e); process.exit(1) })
