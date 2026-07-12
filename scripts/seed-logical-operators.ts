import { config } from 'dotenv'
config({ path: '.env.local' })
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../lib/db/schema'
import { eq, gte, and } from 'drizzle-orm'

const client = neon(process.env.DATABASE_URL!)
const db = drizzle(client, { schema })

const questions = [
  {
    order: 1,
    question: '`&&` 運算子的短路求值（Short-circuit Evaluation）回傳的是什麼？\n\nconsole.log(\'hello\' && 42)\nconsole.log(null && \'hello\')',
    options: [
      '永遠回傳 true 或 false',
      '左側為 truthy 時回傳右側的值，左側為 falsy 時回傳左側的值',
      '左側為 falsy 時回傳右側的值，左側為 truthy 時回傳左側的值',
      '永遠回傳左側的值',
    ],
    answer: 1,
    explanation: '`&&` 不一定回傳布林值，而是回傳決定結果的那個運算元：左側為 falsy 時直接回傳左側（短路，右側不執行）；左側為 truthy 時才求值並回傳右側。所以 `"hello" && 42` 回傳 `42`，`null && "hello"` 回傳 `null`。',
  },
  {
    order: 2,
    question: '`||` 運算子的短路求值回傳的是什麼？\n\nconsole.log(\'\' || \'default\')\nconsole.log(\'hello\' || \'world\')',
    options: [
      '永遠回傳 true 或 false',
      '左側為 truthy 時回傳右側的值',
      '左側為 truthy 時回傳左側的值，左側為 falsy 時回傳右側的值',
      '永遠回傳右側的值',
    ],
    answer: 2,
    explanation: '`||` 回傳第一個 truthy 值：左側為 truthy 時直接回傳左側（短路）；左側為 falsy 才繼續求值並回傳右側。所以 `"" || "default"` 回傳 `"default"`（空字串是 falsy），`"hello" || "world"` 回傳 `"hello"`。常見用途：提供預設值。',
  },
  {
    order: 3,
    question: '`??`（Nullish Coalescing）和 `||` 最大的差別是什麼？\n\nconsole.log(0 || \'fallback\')   // ?\nconsole.log(0 ?? \'fallback\')   // ?',
    options: [
      '`??` 和 `||` 完全相同，只是寫法不同',
      '`??` 只在左側為 `null` 或 `undefined` 時才回傳右側；`||` 對所有 falsy 值都觸發',
      '`??` 只能用於字串，`||` 可以用於任何型別',
      '`??` 比 `||` 優先級更高',
    ],
    answer: 1,
    explanation: '`||` 對所有 falsy 值（`false`、`0`、`""`、`null`、`undefined`、`NaN`）都會觸發右側；`??` 只在左側嚴格等於 `null` 或 `undefined` 時才回傳右側。所以 `0 || "fallback"` 回傳 `"fallback"`（0 是 falsy），但 `0 ?? "fallback"` 回傳 `0`（0 不是 null/undefined）。',
  },
  {
    order: 4,
    question: 'JavaScript 中哪些值是 Falsy（會被轉換為 false）？',
    options: [
      'null、undefined、0、""、false、NaN',
      'null、undefined、false',
      'null、undefined、0、false',
      'null、undefined、0、""、false、NaN、[]、{}',
    ],
    answer: 0,
    explanation: 'JavaScript 的 6 個 falsy 值：`false`、`0`（含 `-0`、`0n`）、`""`（空字串）、`null`、`undefined`、`NaN`。注意 `[]`（空陣列）和 `{}`（空物件）都是 truthy，這是常見陷阱。其餘所有值都是 truthy。',
  },
  {
    order: 5,
    question: '`?.`（Optional Chaining）的作用是什麼？\n\nconst user = null\nconsole.log(user?.profile?.avatar)',
    options: [
      '等同於 `user.profile.avatar`，只是語法更短',
      '如果鏈中任何一個值為 `null` 或 `undefined`，立即回傳 `undefined` 而非拋出錯誤',
      '如果鏈中任何一個值為 falsy，立即回傳 `false`',
      '自動將 `null` 轉換為空物件 `{}`',
    ],
    answer: 1,
    explanation: '`?.` 讓你安全地存取深層屬性：若鏈中任何一個節點為 `null` 或 `undefined`，整個表達式直接回傳 `undefined`，不拋出 `TypeError`。沒有 `?.` 的話，`null.profile` 會直接報錯。也可以用於方法呼叫：`arr?.map(fn)`，或陣列索引：`arr?.[0]`。',
  },
  {
    order: 6,
    question: '邏輯賦值運算子 `a ||= b` 等效於哪個寫法？',
    options: [
      'a = b || a',
      'a = a || b',
      'a || (a = b)',
      'a = a ? a : b',
    ],
    answer: 1,
    explanation: '`a ||= b` 等效於 `a = a || b`（更精確地說是 `a || (a = b)`，短路時不賦值）。三個邏輯賦值運算子：`||=`（左側 falsy 才賦值）、`&&=`（左側 truthy 才賦值）、`??=`（左側 null/undefined 才賦值）。常見用途：`config.timeout ||= 3000`（設定預設值）。',
  },
  {
    order: 7,
    question: '以下程式碼的輸出結果是什麼？\n\nconst a = 0\nconst b = a ?? 10\nconst c = a || 10\nconsole.log(b, c)',
    options: [
      '0 0',
      '10 10',
      '0 10',
      '10 0',
    ],
    answer: 2,
    explanation: '`a = 0`：`??` 只對 null/undefined 觸發，0 不是 null/undefined，所以 `b = 0 ?? 10` 回傳 `0`；`||` 對所有 falsy 值觸發，0 是 falsy，所以 `c = 0 || 10` 回傳 `10`。輸出 `0 10`。這題示範了 `??` 和 `||` 在處理數字 0 時的關鍵差異。',
  },
]

async function main() {
  console.log('插入 logical-operators 主題...')

  // 把 var-let-const(4) 和 hoisting(5) 的 order 各往後推一位，空出 order=4 給新主題
  await db
    .update(schema.topics)
    .set({ order: 6 })
    .where(and(eq(schema.topics.slug, 'hoisting')))
  await db
    .update(schema.topics)
    .set({ order: 5 })
    .where(and(eq(schema.topics.slug, 'var-let-const')))
  console.log('  ✓ hoisting → order 6, var-let-const → order 5')

  // 新增主題
  const [topic] = await db
    .insert(schema.topics)
    .values({
      slug: 'logical-operators',
      title: '邏輯運算子',
      description: '&&、||、??、?.、以及短路求值的原理與常見應用場景。',
      category: 'JavaScript',
      difficulty: 'medium',
      theme: 'JavaScript',
      subCategory: '型別與基礎語法',
      order: 4,
    })
    .onConflictDoUpdate({
      target: schema.topics.slug,
      set: {
        title: '邏輯運算子',
        description: '&&、||、??、?.、以及短路求值的原理與常見應用場景。',
        subCategory: '型別與基礎語法',
        order: 4,
      },
    })
    .returning({ id: schema.topics.id })

  const topicId = topic.id
  console.log(`  ✓ logical-operators 建立完成 (id: ${topicId})`)

  // 新增題目
  for (const q of questions) {
    await db
      .insert(schema.questions)
      .values({
        topicId,
        order: q.order,
        question: q.question,
        options: q.options,
        answer: q.answer,
        explanation: q.explanation,
      })
      .onConflictDoUpdate({
        target: [schema.questions.topicId, schema.questions.order],
        set: {
          question: q.question,
          options: q.options,
          answer: q.answer,
          explanation: q.explanation,
        },
      })
  }
  console.log(`  ✓ ${questions.length} 道題目新增完成`)

  console.log('\n✅ 完成')
  process.exit(0)
}

main().catch(e => { console.error(e); process.exit(1) })
