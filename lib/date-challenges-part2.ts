import type { MethodEntry } from './array-challenges'

export const dateChallengesPart2: MethodEntry[] = [
  // ─── date-toisostring ─────────────────────────────────────────────────────
  {
    slug: 'date-toisostring',
    methodName: 'toISOString()',
    title: 'Date.toISOString()',
    description: '將 Date 物件轉成 ISO 8601 格式的字串，適合 API 傳輸和資料儲存。',
    subCategory: '格式化輸出',
    difficulty: 'easy',
    notes: {
      title: 'toISOString()',
      sections: [
        {
          heading: '說明',
          content: `\`date.toISOString()\` 回傳 **ISO 8601** 格式的字串，例如 \`'2024-01-15T08:30:00.000Z'\`。

格式固定為：\`YYYY-MM-DDTHH:mm:ss.sssZ\`
- \`T\`：分隔日期和時間
- \`Z\`：代表 UTC（協調世界時）

回傳值一律是 UTC 時間，不受本地時區影響。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const d = new Date('2024-01-15T08:30:00')
d.toISOString()
// '2024-01-15T00:30:00.000Z'（若本地是 UTC+8，會減 8 小時）

// 常見 API 用法
const payload = {
  orderId: 'ORD-001',
  createdAt: new Date('2024-03-20').toISOString(),
}

// 安全取日期字串（避免時區問題）
new Date('2024-01-15').toISOString().slice(0, 10)
// '2024-01-15'
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- 結果一律是 **UTC 時間**，若本地是 UTC+8，顯示時間會比本地少 8 小時
- 要取日期部分可用 \`.slice(0, 10)\` 截取 \`'YYYY-MM-DD'\`
- 是 API 傳輸和資料庫儲存的標準格式，後端通常期望這個格式`,
        },
      ],
    },
    keyPoints: [
      'toISOString 回傳 ISO 8601 格式字串，結尾的 Z 代表 UTC 時間。',
      '格式固定為 YYYY-MM-DDTHH:mm:ss.sssZ，T 分隔日期和時間，Z 代表 UTC。',
      '結果一律是 UTC，若你在 UTC+8 時區，本地時間的 08:00 轉成 ISO 字串會顯示為 00:00Z。',
      '取出純日期字串的安全做法是 toISOString().slice(0, 10)，避免時區造成日期差一天的問題。',
      'API 傳遞日期時，toISOString() 是標準格式，後端和前端之間溝通日期時間的最佳實踐。',
    ],
    problems: [
      {
        id: 'basic',
        title: '驗證 ISO 字串格式',
        difficulty: 'easy',
        description: `對固定日期 \`new Date('2024-03-15T12:00:00.000Z')\` 呼叫 \`toISOString()\`，驗證輸出格式。

請完成：
1. 呼叫 \`toISOString()\` 存到 \`isoStr\`
2. 驗證結果包含 \`'T'\`，存到 \`hasT\`
3. 驗證結果以 \`'Z'\` 結尾，存到 \`endsWithZ\`
4. 驗證結果以 \`'2024'\` 開頭，存到 \`starts2024\``,
        examples: [
          {
            input: `new Date('2024-03-15T12:00:00.000Z')`,
            output: `isoStr === '2024-03-15T12:00:00.000Z'`,
          },
        ],
        initialCode: `const d = new Date('2024-03-15T12:00:00.000Z')

// TODO: 呼叫 toISOString()
let isoStr

// TODO: 是否包含 'T'
let hasT

// TODO: 是否以 'Z' 結尾
let endsWithZ

// TODO: 是否以 '2024' 開頭
let starts2024
`,
        testCases: [
          { label: 'isoStr 應為字串', test: `return typeof isoStr === 'string'` },
          { label: 'hasT 應為 true', test: `return hasT === true` },
          { label: 'endsWithZ 應為 true', test: `return endsWithZ === true` },
          { label: 'starts2024 應為 true', test: `return starts2024 === true` },
          { label: 'isoStr 長度應為 24', test: `return isoStr.length === 24` },
        ],
      },
      {
        id: 'api-payload',
        title: 'API Payload：建立訂單時間戳',
        difficulty: 'easy',
        description: `電商系統建立訂單時，需要在 payload 中加入 ISO 格式的建立時間。

請建立訂單物件 \`order\`，包含：
- \`orderId: 'ORD-2024-001'\`
- \`createdAt\`：使用 \`new Date('2024-06-15T09:30:00.000Z').toISOString()\`
- \`amount: 1299\``,
        examples: [
          {
            input: `使用固定日期 new Date('2024-06-15T09:30:00.000Z')`,
            output: `order.createdAt 是字串，包含 'T' 和 'Z'`,
          },
        ],
        initialCode: `// TODO: 建立 order 物件，createdAt 用 toISOString()
let order
`,
        testCases: [
          { label: 'order 應是物件', test: `return typeof order === 'object' && order !== null` },
          { label: 'order.orderId 應為 "ORD-2024-001"', test: `return order.orderId === 'ORD-2024-001'` },
          { label: 'order.createdAt 應是字串', test: `return typeof order.createdAt === 'string'` },
          { label: 'order.createdAt 應包含 "T"', test: `return order.createdAt.includes('T')` },
          { label: 'order.createdAt 應以 "Z" 結尾', test: `return order.createdAt.endsWith('Z')` },
          { label: 'order.amount 應為 1299', test: `return order.amount === 1299` },
        ],
      },
      {
        id: 'parse-back',
        title: '雙向轉換：ISO 字串轉回 Date',
        difficulty: 'medium',
        description: `驗證 Date → ISO 字串 → Date 的雙向轉換，確保時間戳不失真。

請完成：
1. 建立 \`original = new Date('2024-08-20T15:45:30.000Z')\`
2. 用 \`toISOString()\` 轉成字串，存到 \`isoStr\`
3. 用 \`new Date(isoStr)\` 還原成 Date，存到 \`restored\`
4. 用 \`getTime()\` 比較兩個 Date 的時間戳，存到 \`isSame\``,
        examples: [
          {
            input: `new Date('2024-08-20T15:45:30.000Z')`,
            output: `isSame === true（original.getTime() === restored.getTime()）`,
          },
        ],
        initialCode: `const original = new Date('2024-08-20T15:45:30.000Z')

// TODO: 轉成 ISO 字串
let isoStr

// TODO: 從 ISO 字串還原成 Date
let restored

// TODO: 比較兩個 getTime()，存到 isSame（boolean）
let isSame
`,
        testCases: [
          { label: 'isoStr 應是字串', test: `return typeof isoStr === 'string'` },
          { label: 'restored 應是 Date 物件', test: `return restored instanceof Date` },
          { label: 'isSame 應為 true', test: `return isSame === true` },
          {
            label: 'getTime() 值應相等',
            test: `const o = new Date('2024-08-20T15:45:30.000Z'); const s = o.toISOString(); const r = new Date(s); return o.getTime() === r.getTime()`,
          },
        ],
      },
    ],
  },

  // ─── date-tolocale ────────────────────────────────────────────────────────
  {
    slug: 'date-tolocale',
    methodName: 'toLocaleDateString()',
    title: 'Date.toLocaleDateString()',
    description: '依照地區設定格式化日期，適合對使用者顯示本地化的日期。',
    subCategory: '格式化輸出',
    difficulty: 'easy',
    notes: {
      title: 'toLocaleDateString()',
      sections: [
        {
          heading: '說明',
          content: `\`date.toLocaleDateString(locale, options)\`

- \`locale\`：地區代碼，如 \`'zh-TW'\`、\`'en-US'\`、\`'ja-JP'\`
- \`options\`：格式設定物件（選填）
- 回傳：格式化後的**日期字串**`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const d = new Date('2024-01-15')

d.toLocaleDateString('zh-TW')
// '2024/1/15'

d.toLocaleDateString('en-US')
// '1/15/2024'

// 使用 options 指定格式
d.toLocaleDateString('zh-TW', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})
// '2024年1月15日'

d.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
})
// 'Jan 15, 2024'
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- 輸出格式依瀏覽器和作業系統的語系設定而異，不適合用在需要固定格式的情境
- 若需要固定格式（如 YYYY-MM-DD），使用 \`toISOString().slice(0, 10)\` 更可靠
- \`month: 'long'\` 在 zh-TW 是「一月」、「二月」，在 en-US 是 「January」`,
        },
      ],
    },
    keyPoints: [
      'toLocaleDateString 依照地區代碼格式化日期，zh-TW 預設輸出 2024/1/15 這種格式。',
      '第二個 options 參數可以精確控制輸出格式，year/month/day 可分別設定 numeric、2-digit、long、short。',
      '輸出結果依瀏覽器和 OS 語系而異，不適合用在需要固定格式的場景，那種情況要用 toISOString。',
      '常用於前端 UI 顯示日期給使用者看，比硬刻字串格式更符合國際化需求。',
    ],
    problems: [
      {
        id: 'basic',
        title: '本地化日期顯示：台灣格式',
        difficulty: 'easy',
        description: `活動頁面需要以台灣習慣的格式顯示日期。

對 \`new Date('2024-07-20')\` 呼叫 \`toLocaleDateString('zh-TW')\`，
存到 \`formatted\`。

再驗證輸出包含 \`'2024'\`，存到 \`hasYear\`。`,
        examples: [
          {
            input: `new Date('2024-07-20')`,
            output: `formatted 包含 '2024'，hasYear === true`,
          },
        ],
        initialCode: `const d = new Date('2024-07-20')

// TODO: 用 toLocaleDateString('zh-TW') 格式化
let formatted

// TODO: 驗證包含 '2024'
let hasYear
`,
        testCases: [
          { label: 'formatted 應是字串', test: `return typeof formatted === 'string'` },
          { label: 'formatted 應包含 "2024"', test: `return formatted.includes('2024')` },
          { label: 'hasYear 應為 true', test: `return hasYear === true` },
          {
            label: '格式化後應包含月份數字',
            test: `const d2 = new Date('2024-07-20'); const s = d2.toLocaleDateString('zh-TW'); return s.includes('7')`,
          },
        ],
      },
      {
        id: 'format-options',
        title: '事件顯示：完整中文日期格式',
        difficulty: 'medium',
        description: `會議系統需要顯示完整的中文日期格式，例如「2024年1月15日」。

對 \`new Date('2024-01-15')\` 使用 options 物件格式化：
\`\`\`js
{ year: 'numeric', month: 'long', day: 'numeric' }
\`\`\`
以 \`'zh-TW'\` locale 格式化，存到 \`fullDate\`。

再驗證 \`fullDate\` 包含 \`'2024'\`，存到 \`hasYear\`。`,
        examples: [
          {
            input: `new Date('2024-01-15')`,
            output: `fullDate 包含 '2024' 和月份文字`,
          },
        ],
        initialCode: `const d = new Date('2024-01-15')
const options = { year: 'numeric', month: 'long', day: 'numeric' }

// TODO: 用 toLocaleDateString('zh-TW', options) 格式化，存到 fullDate
let fullDate

// TODO: 驗證包含 '2024'，存到 hasYear
let hasYear
`,
        testCases: [
          { label: 'fullDate 應是字串', test: `return typeof fullDate === 'string'` },
          { label: 'fullDate 應包含 "2024"', test: `return fullDate.includes('2024')` },
          { label: 'hasYear 應為 true', test: `return hasYear === true` },
          {
            label: '同樣的邏輯用 en-US 應包含 January',
            test: `const d2 = new Date('2024-01-15'); const s = d2.toLocaleDateString('en-US', {year:'numeric',month:'long',day:'numeric'}); return s.includes('January')`,
          },
        ],
      },
    ],
  },

  // ─── date-calc ────────────────────────────────────────────────────────────
  {
    slug: 'date-calc',
    methodName: 'Date 運算 / setDate()',
    title: 'Date 運算與 setDate()',
    description: '計算日期差距、加減天數，以及 setDate 的自動進位特性。',
    subCategory: '日期運算',
    difficulty: 'medium',
    notes: {
      title: 'Date 運算',
      sections: [
        {
          heading: '說明',
          content: `Date 物件可以透過 \`getTime()\` 取得毫秒時間戳來進行運算：

\`\`\`
1 天 = 24 × 60 × 60 × 1000 = 86,400,000 毫秒
\`\`\`

**計算天數差：**
\`Math.floor((d2.getTime() - d1.getTime()) / 86400000)\`

**N 天後（setDate）：**
\`\`\`js
const future = new Date(d)  // 先複製！
future.setDate(future.getDate() + n)
\`\`\``,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
// 計算天數差
const d1 = new Date('2024-01-01')
const d2 = new Date('2024-01-16')
const days = (d2.getTime() - d1.getTime()) / 86400000
// 15

// setDate 自動進位（1月31日 + 1天 = 2月1日）
const jan31 = new Date('2024-01-31')
jan31.setDate(jan31.getDate() + 1)
jan31.toISOString().slice(0, 10)  // '2024-02-01'

// 到期判斷
const created = new Date('2024-01-01')
const expiry = new Date(created)
expiry.setDate(expiry.getDate() + 30)  // 30 天有效期
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- \`setDate\` 會**直接修改原物件**，要先 \`new Date(original)\` 複製再操作
- \`setDate\` 數值超過月份上限時自動進位到下個月（非常方便）
- 計算天數差時，若有夏令時間切換，毫秒計算可能有誤差，需 \`Math.round\` 而非 \`Math.floor\``,
        },
      ],
    },
    keyPoints: [
      'Date 物件相減需要先用 getTime() 取毫秒時間戳，然後除以 86400000 換算成天數。',
      'setDate 可以自動處理月份進位，例如 1月31日加1天會自動變成2月1日，不需要手動處理。',
      'setDate 會直接修改原始 Date 物件，計算 N 天後一定要先用 new Date(original) 複製，避免汙染原來的日期。',
      '計算差距天數時，若有夏令時間，建議用 Math.round 而非 Math.floor 避免誤差。',
    ],
    problems: [
      {
        id: 'diff',
        title: '計算兩日期相差天數',
        difficulty: 'easy',
        description: `訂單系統需要計算訂單從建立到送達花了幾天。

計算 \`new Date('2024-03-01')\` 到 \`new Date('2024-03-16')\` 相差幾天，存到 \`diffDays\`。

公式：\`(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)\``,
        examples: [
          {
            input: `startDate = '2024-03-01'，endDate = '2024-03-16'`,
            output: `diffDays === 15`,
          },
        ],
        initialCode: `const startDate = new Date('2024-03-01')
const endDate = new Date('2024-03-16')

// TODO: 計算相差天數，存到 diffDays
let diffDays
`,
        testCases: [
          { label: 'diffDays 應為 15', test: `return diffDays === 15` },
          { label: 'diffDays 應是 number', test: `return typeof diffDays === 'number'` },
          {
            label: '其他日期也能正確計算',
            test: `const d1 = new Date('2024-01-01'); const d2 = new Date('2024-01-31'); const diff = (d2.getTime() - d1.getTime()) / 86400000; return diff === 30`,
          },
        ],
      },
      {
        id: 'add-days',
        title: '計算 N 天後的日期',
        difficulty: 'medium',
        description: `請實作 \`addDays(date, n)\` 函式，回傳指定日期加上 n 天後的 Date 物件。

注意：
- 必須先**複製** Date 物件（\`new Date(date)\`），再 \`setDate\`，不能修改原物件
- \`setDate\` 會自動處理月份進位

測試 \`addDays(new Date('2024-01-29'), 5)\` 應得到 2月3日。`,
        examples: [
          {
            input: `addDays(new Date('2024-01-29'), 5)`,
            output: `2024-02-03（自動進位到2月）`,
          },
        ],
        constraints: ['必須複製 Date 物件，不能修改原物件'],
        initialCode: `function addDays(date, n) {
  // TODO: 複製 date，再 setDate(getDate() + n)，回傳新 Date
}
`,
        testCases: [
          {
            label: '跨月份進位：1/29 + 5天 = 2/3',
            test: `const r = addDays(new Date('2024-01-29'), 5); return r.toISOString().slice(0,10) === '2024-02-03'`,
          },
          {
            label: '不修改原物件',
            test: `const orig = new Date('2024-01-15'); addDays(orig, 10); return orig.toISOString().slice(0,10) === '2024-01-15'`,
          },
          {
            label: '普通加天數',
            test: `const r = addDays(new Date('2024-06-10'), 7); return r.toISOString().slice(0,10) === '2024-06-17'`,
          },
        ],
      },
      {
        id: 'expire',
        title: '優惠券到期判斷',
        difficulty: 'medium',
        description: `優惠券系統需要判斷優惠券是否已過期。

已知：
- 建立日期：\`new Date('2024-04-01')\`
- 有效天數：\`validDays = 60\`（60天有效）
- 今天（固定）：\`new Date('2024-06-01')\`

請計算到期日 \`expiryDate\`，再判斷今天是否已超過到期日，存到 \`isExpired\`。`,
        examples: [
          {
            input: `建立 2024-04-01，有效 60 天，今天 2024-06-01`,
            output: `expiryDate 為 2024-05-31，isExpired === true（已超過）`,
          },
        ],
        initialCode: `const createdDate = new Date('2024-04-01')
const validDays = 60
const today = new Date('2024-06-01')

// TODO: 計算到期日（複製 createdDate 後 setDate）
let expiryDate

// TODO: 判斷今天是否超過到期日，存到 isExpired（boolean）
let isExpired
`,
        testCases: [
          { label: 'expiryDate 應是 Date 物件', test: `return expiryDate instanceof Date` },
          {
            label: '到期日應為 2024-05-31',
            test: `return expiryDate.toISOString().slice(0,10) === '2024-05-31'`,
          },
          { label: 'isExpired 應為 true', test: `return isExpired === true` },
          { label: 'isExpired 是 boolean', test: `return typeof isExpired === 'boolean'` },
        ],
      },
    ],
  },

  // ─── date-traps ───────────────────────────────────────────────────────────
  {
    slug: 'date-traps',
    methodName: 'Date 常見陷阱',
    title: 'Date 常見陷阱',
    description: '月份從 0 開始、setDate 修改原物件、時區影響日期解析等常見坑。',
    subCategory: '常見陷阱',
    difficulty: 'medium',
    notes: {
      title: 'Date 常見陷阱',
      sections: [
        {
          heading: '陷阱一：月份從 0 開始',
          content: `\`new Date(year, month, day)\` 建構函式中，\`month\` 是 **0-based**：
- \`0\` = 一月
- \`11\` = 十二月

\`\`\`js
new Date(2024, 0, 1)   // 2024 年 1 月 1 日（不是 0 月！）
new Date(2024, 11, 31) // 2024 年 12 月 31 日

// 但字串解析不受影響
new Date('2024-01-15') // 正常的 1 月 15 日
\`\`\``,
        },
        {
          heading: '陷阱二：setDate 修改原物件',
          content: `\`setDate\`、\`setMonth\`、\`setFullYear\` 等 setter 都會**直接修改原物件**：

\`\`\`js
// 錯誤寫法：修改了 original！
const original = new Date('2024-01-15')
original.setDate(original.getDate() + 10)  // original 被改了

// 正確寫法：先複製
const copy = new Date(original)
copy.setDate(copy.getDate() + 10)  // original 不受影響
\`\`\``,
        },
        {
          heading: '陷阱三：時區影響日期解析',
          content: `\`new Date('2024-01-15')\`（純日期字串）在不同時區的 \`getDate()\` 可能不同：

\`\`\`js
// 純日期字串 → 解析為 UTC 00:00
new Date('2024-01-15').getDate()
// UTC+8 時區：可能得到 14（前一天！）

// 安全的取日期方式
new Date('2024-01-15').toISOString().slice(0, 10)
// '2024-01-15'（永遠正確）
\`\`\``,
        },
      ],
    },
    keyPoints: [
      'Date 建構函式的月份參數是 0-based：0 代表一月，11 代表十二月，這是最常見的 Date 陷阱之一。',
      '用字串建立 Date（如 new Date("2024-01-15")）月份不受影響，0-based 只在 new Date(year, month, day) 格式有效。',
      'setDate 等 setter 方法會直接修改原 Date 物件，計算新日期前務必用 new Date(original) 先複製。',
      '純日期字串（如 "2024-01-15"）在 JavaScript 被解析為 UTC 00:00，在 UTC+8 的環境用 getDate() 可能得到前一天的日期。',
      '安全取日期字串的方式是 toISOString().slice(0, 10)，不受時區影響，永遠回傳正確的 YYYY-MM-DD。',
    ],
    problems: [
      {
        id: 'month-zero',
        title: '月份陷阱：0 代表幾月？',
        difficulty: 'easy',
        description: `\`new Date(year, month, day)\` 建構函式的月份是 0-based。

建立 \`new Date(2024, 0, 1)\`，然後：
- 將 \`getFullYear()\` 存到 \`year\`
- 將 \`getMonth()\` 存到 \`monthIndex\`（應為 0，不是 1！）
- 計算實際月份（monthIndex + 1），存到 \`actualMonth\``,
        examples: [
          {
            input: `new Date(2024, 0, 1)`,
            output: `year === 2024，monthIndex === 0，actualMonth === 1（代表一月）`,
          },
        ],
        initialCode: `const d = new Date(2024, 0, 1)

// TODO: 取得年份
let year

// TODO: 取得月份 index（0-based）
let monthIndex

// TODO: 計算實際月份（人類看的）
let actualMonth
`,
        testCases: [
          { label: 'year 應為 2024', test: `return year === 2024` },
          { label: 'monthIndex 應為 0', test: `return monthIndex === 0` },
          { label: 'actualMonth 應為 1', test: `return actualMonth === 1` },
          {
            label: 'new Date(2024, 11, 31) 的月份是 12 月',
            test: `const d2 = new Date(2024, 11, 31); return d2.getMonth() === 11 && d2.getMonth() + 1 === 12`,
          },
        ],
      },
      {
        id: 'mutation',
        title: 'setDate 修改原物件陷阱',
        difficulty: 'medium',
        description: `\`setDate\` 會直接修改原 Date 物件，這是常見的 bug 來源。

請示範正確的做法：
1. \`original = new Date('2024-03-10')\`
2. 建立複製 \`copied = new Date(original)\`
3. 對 \`copied\` 執行 \`setDate(copied.getDate() + 20)\`（往後20天）
4. 驗證 \`original\` 的日期**沒有改變**，存到 \`originalUnchanged\``,
        examples: [
          {
            input: `original = 2024-03-10，copied + 20 天`,
            output: `copied 變成 2024-03-30，original 仍是 2024-03-10`,
          },
        ],
        constraints: ['必須先複製 Date 物件再 setDate'],
        initialCode: `const original = new Date('2024-03-10')

// TODO: 複製 original
let copied

// TODO: 對 copied 加 20 天

// TODO: 驗證 original 仍是 2024-03-10，存到 originalUnchanged（boolean）
let originalUnchanged
`,
        testCases: [
          {
            label: 'copied 應是 2024-03-30',
            test: `return copied instanceof Date && copied.toISOString().slice(0,10) === '2024-03-30'`,
          },
          { label: 'originalUnchanged 應為 true', test: `return originalUnchanged === true` },
          {
            label: 'original 的日期應仍為 10',
            test: `return original.toISOString().slice(0,10) === '2024-03-10'`,
          },
        ],
      },
      {
        id: 'timezone',
        title: '安全取得日期字串（時區安全）',
        difficulty: 'medium',
        description: `直接對 \`new Date('2024-01-15')\` 呼叫 \`getDate()\`，在 UTC+8 的環境可能得到 14（前一天）。

請示範**安全的做法**：
1. 建立 \`d = new Date('2024-01-15T00:00:00.000Z')\`
2. 用 **\`toISOString().slice(0, 10)\`** 安全取出日期字串，存到 \`safeDateStr\`
3. 驗證 \`safeDateStr === '2024-01-15'\`，存到 \`isCorrect\``,
        examples: [
          {
            input: `new Date('2024-01-15T00:00:00.000Z')`,
            output: `safeDateStr === '2024-01-15'，isCorrect === true`,
          },
        ],
        initialCode: `const d = new Date('2024-01-15T00:00:00.000Z')

// TODO: 用 toISOString().slice(0, 10) 安全取日期字串
let safeDateStr

// TODO: 驗證等於 '2024-01-15'
let isCorrect
`,
        testCases: [
          { label: 'safeDateStr 應為 "2024-01-15"', test: `return safeDateStr === '2024-01-15'` },
          { label: 'isCorrect 應為 true', test: `return isCorrect === true` },
          { label: 'safeDateStr 是字串', test: `return typeof safeDateStr === 'string'` },
          {
            label: 'slice(0,10) 從 ISO 字串取日期部分',
            test: `const d2 = new Date('2024-06-15T00:00:00.000Z'); return d2.toISOString().slice(0,10) === '2024-06-15'`,
          },
        ],
      },
    ],
  },
]
