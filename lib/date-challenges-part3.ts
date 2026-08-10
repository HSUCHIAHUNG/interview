import type { MethodEntry } from './array-challenges'

export const dateChallengesPart3: MethodEntry[] = [

  // ─── performance-timing ───────────────────────────────────────────────────
  {
    slug: 'performance-timing',
    methodName: 'performance.now()',
    title: 'Performance 時間測量',
    description: '用高精度單調時鐘測量程式碼執行時間，比 Date.now() 更適合效能分析。',
    subCategory: '效能測量',
    difficulty: 'medium',
    notes: {
      title: 'performance.now() / performance.timeOrigin',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`performance.now()\`

- 回傳：距離**頁面載入**的毫秒數（DOMHighResTimeStamp），可含小數（sub-millisecond 精度）。
- 使用**單調時鐘**：只會向前增加，不受系統時間調整影響。
- 不是 Unix 時間戳，是相對時間。

\`performance.timeOrigin\`

- 回傳：當前頁面開始載入的 Unix 時間戳（毫秒，整數）。
- \`performance.timeOrigin + performance.now() ≈ Date.now()\`。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
// 測量執行時間
const start = performance.now()
doSomething()
const end = performance.now()
console.log(\`耗時 \${end - start} ms\`)

// 取得精確的當前絕對時間
const absoluteNow = performance.timeOrigin + performance.now()
// ≈ Date.now()，但更精確

// 與 Date.now() 比較
performance.now()   // 例：1234.56（相對頁面載入）
Date.now()          // 例：1722825600000（Unix 時間戳）
\`\`\``,
        },
        {
          heading: 'performance.now() vs Date.now()',
          content: `| 特性 | performance.now() | Date.now() |
|------|-------------------|------------|
| 時間類型 | 相對（頁面載入起） | 絕對（Unix 時間戳） |
| 精度 | sub-millisecond | 毫秒 |
| 單調性 | ✅ 只會增加 | ❌ 可能受系統校時影響 |
| 用途 | 效能測量 | 取得當前時間 |
| 回傳值大小 | 小（數秒到數小時） | 大（約 1.7 兆） |`,
        },
      ],
    },
    keyPoints: [
      'performance.now() 回傳距頁面載入的毫秒數，不是 Unix 時間戳，所以值比 Date.now() 小很多。',
      '它使用單調時鐘，不受系統時間調整影響，適合用來測量程式碼執行時間。',
      '精度可達 sub-millisecond（回傳值可能含小數），比 Date.now() 更精準。',
      'performance.timeOrigin 是頁面載入的 Unix 時間戳，加上 performance.now() 可得近似的當前絕對時間。',
      '需要測量「執行多久」用 performance.now()，需要記錄「幾點幾分」用 Date.now() 或 new Date()。',
    ],
    problems: [
      {
        id: 'basic',
        title: '效能測量：計算迴圈的執行時間',
        difficulty: 'easy',
        description: `前端效能優化時，常需要知道某段程式碼實際執行花了多少毫秒。

\`performance.now()\` 回傳距頁面載入的毫秒數（可含小數），
在執行前後各呼叫一次，相減就是執行耗時。

請完成以下步驟：
1. 用 \`performance.now()\` 記錄開始時間，存到 \`start\`。
2. 執行提供的迴圈（已寫好）。
3. 用 \`performance.now()\` 記錄結束時間，存到 \`end\`。
4. 計算耗時（毫秒），存到 \`elapsed\`。`,
        examples: [
          {
            input: `執行一段迴圈運算`,
            output: `elapsed 為 number 且 >= 0，end >= start`,
          },
        ],
        initialCode: `// TODO: 記錄開始時間
let start

// 模擬運算（不需修改）
let sum = 0
for (let i = 0; i < 100000; i++) sum += i

// TODO: 記錄結束時間
let end

// TODO: 計算耗時，存到 elapsed
let elapsed
`,
        testCases: [
          { label: 'start 應為 number 型別', test: `return typeof start === 'number'` },
          { label: 'end 應為 number 型別', test: `return typeof end === 'number'` },
          { label: 'end 應大於或等於 start（單調時鐘）', test: `return end >= start` },
          { label: 'elapsed 應為 end - start', test: `return elapsed === end - start` },
          { label: 'elapsed 應大於或等於 0', test: `return elapsed >= 0` },
        ],
      },
      {
        id: 'origin',
        title: 'timeOrigin：組合出精確的當前絕對時間',
        difficulty: 'medium',
        description: `\`performance.timeOrigin\` 是頁面開始載入的 Unix 時間戳（毫秒），
\`performance.now()\` 是距頁面載入的毫秒數。
兩者相加就能得到精確的當前絕對時間，精度優於 \`Date.now()\`。

請完成以下步驟：
1. 取得 \`performance.timeOrigin\`，存到 \`origin\`。
2. 用 \`performance.timeOrigin + performance.now()\` 計算近似當前時間，存到 \`absoluteTime\`。
3. 取得 \`Date.now()\`，存到 \`dateNow\`。
4. 計算 \`absoluteTime\` 與 \`dateNow\` 的差距（取絕對值），存到 \`diff\`。`,
        examples: [
          {
            input: `頁面已載入 5432 ms，timeOrigin = 1722825600000`,
            output: `absoluteTime ≈ 1722825605432，diff < 100（與 Date.now() 非常接近）`,
          },
        ],
        constraints: [
          'absoluteTime 必須使用 performance.timeOrigin + performance.now()',
          'diff 必須取絕對值（Math.abs）',
        ],
        initialCode: `// TODO: 取得 performance.timeOrigin，存到 origin
let origin

// TODO: 用 timeOrigin + now() 計算近似當前時間，存到 absoluteTime
let absoluteTime

// TODO: 取得 Date.now()，存到 dateNow
let dateNow

// TODO: 計算差距（取絕對值），存到 diff
let diff
`,
        testCases: [
          { label: 'origin 應為正數（Unix 時間戳）', test: `return typeof origin === 'number' && origin > 0` },
          { label: 'absoluteTime 應為 number', test: `return typeof absoluteTime === 'number'` },
          { label: 'diff 應在 100ms 以內（誤差容忍）', test: `return Math.abs(absoluteTime - Date.now()) < 200` },
          { label: 'Date.now() 應回傳整數', test: `return Number.isInteger(dateNow)` },
          { label: 'origin 應大於 1 兆（有效 Unix 時間戳）', test: `return origin > 1_000_000_000_000` },
        ],
      },
      {
        id: 'vs-date',
        title: '單調時鐘：performance.now() vs Date.now() 差異',
        difficulty: 'medium',
        description: `\`performance.now()\` 與 \`Date.now()\` 都能取得時間，但用途不同：

- **\`performance.now()\`**：相對時間（距頁面載入），值較小，精確到 sub-ms，適合**效能測量**
- **\`Date.now()\`**：Unix 時間戳（絕對時間），值約 1.7 兆，整數，適合**記錄時間點**

因為 \`performance.now()\` 是相對時間而非 Unix 時間戳，
它的值永遠遠小於 \`Date.now()\`。

請完成：
1. 取得 \`performance.now()\`，存到 \`perfNow\`。
2. 取得 \`Date.now()\`，存到 \`dateNow\`。
3. 判斷 \`perfNow\` 是否小於 \`dateNow\`，存到 \`isRelative\`（boolean）。`,
        examples: [
          {
            input: `頁面載入後約 3 秒`,
            output: `perfNow ≈ 3000，dateNow ≈ 1722825603000，isRelative === true`,
          },
        ],
        initialCode: `// TODO: 取得 performance.now()，存到 perfNow
let perfNow

// TODO: 取得 Date.now()，存到 dateNow
let dateNow

// TODO: 判斷 perfNow < dateNow，存到 isRelative
let isRelative
`,
        testCases: [
          { label: 'perfNow 應為非負 number', test: `return typeof perfNow === 'number' && perfNow >= 0` },
          { label: 'dateNow 應為整數（毫秒時間戳）', test: `return Number.isInteger(dateNow)` },
          { label: 'dateNow 應大於 1 兆（有效 Unix 時間戳）', test: `return dateNow > 1_000_000_000_000` },
          { label: 'isRelative 應為 true（perfNow 是相對時間，遠小於 dateNow）', test: `return isRelative === true` },
        ],
      },
    ],
  },

  // ─── date-dayjs ───────────────────────────────────────────────────────────
  {
    slug: 'date-dayjs',
    methodName: 'dayjs',
    title: 'dayjs vs 原生 Date',
    description: '對照 dayjs 的簡潔語法，用原生 Date API 實作相同功能，深化對兩者的理解。',
    subCategory: '工具比較',
    difficulty: 'medium',
    notes: {
      title: 'dayjs vs 原生 Date',
      sections: [
        {
          heading: 'dayjs 是什麼',
          content: `dayjs 是一個輕量（2KB）的日期處理函式庫，API 設計仿照 Moment.js，但更小更快。
主要特性：**不可變（immutable）**，每個操作都回傳新物件，不修改原始值。`,
        },
        {
          heading: '格式化對照',
          content: `\`\`\`js
// dayjs
dayjs('2024-03-15').format('YYYY-MM-DD')  // '2024-03-15'
dayjs('2024-03-15').format('YYYY/MM/DD')  // '2024/03/15'

// 原生 Date
const d = new Date('2024-03-15')
const y = d.getFullYear()
const m = String(d.getMonth() + 1).padStart(2, '0')
const day = String(d.getDate()).padStart(2, '0')
\`\${y}-\${m}-\${day}\`  // '2024-03-15'
\`\`\``,
        },
        {
          heading: '日期計算對照',
          content: `\`\`\`js
// 相差幾天
dayjs('2024-03-15').diff(dayjs('2024-01-01'), 'day')  // 74
// 原生
const ms = new Date('2024-03-15') - new Date('2024-01-01')
Math.floor(ms / (1000 * 60 * 60 * 24))  // 74

// 加 N 天（dayjs 不可變，原生 setDate 會改原物件）
dayjs('2024-01-15').add(30, 'day').format('YYYY-MM-DD')  // '2024-02-14'
// 原生（需先複製）
const copy = new Date('2024-01-15')
copy.setDate(copy.getDate() + 30)
\`\`\``,
        },
        {
          heading: '日期驗證對照',
          content: `\`\`\`js
// dayjs
dayjs('2024-13-01').isValid()   // false（13月不存在）
dayjs('2024-01-15').isValid()   // true

// 原生
!isNaN(new Date('2024-13-01').getTime())  // false
!isNaN(new Date('2024-01-15').getTime())  // true
\`\`\``,
        },
      ],
    },
    keyPoints: [
      'dayjs 的 format() 需要手動 padStart 才能用原生寫法複現，因為 getMonth() 是 0-based。',
      'dayjs 是 immutable（不可變），每次操作回傳新物件；原生 setDate() 會直接修改原物件，要先複製。',
      '日期差異計算：兩個 Date 相減得到毫秒數，再除以 86400000 得到天數。',
      'dayjs 的 isValid() 等效於原生的 !isNaN(new Date(str).getTime())。',
      'dayjs 語法更簡潔，但學會原生寫法能讓你不依賴函式庫解決問題。',
    ],
    problems: [
      {
        id: 'format',
        title: '日期格式化：用原生 Date 實作 dayjs.format()',
        difficulty: 'easy',
        description: `dayjs 可以用 \`format('YYYY-MM-DD')\` 輕鬆格式化日期，
原生 Date 則需要分別取年、月、日，並手動補零。

\`\`\`js
// dayjs 參考寫法：
dayjs('2024-03-15').format('YYYY-MM-DD')  // '2024-03-15'
\`\`\`

請用原生 Date 實作相同功能：
1. 從 \`date\` 取得年份，存到 \`year\`（number）。
2. 取得月份並補兩位數，存到 \`month\`（string，如 \`'03'\`）。
3. 取得日期並補兩位數，存到 \`day\`（string，如 \`'15'\`）。
4. 組合成 \`'YYYY-MM-DD'\` 格式，存到 \`formatted\`。`,
        examples: [
          {
            input: `date = new Date('2024-03-15')`,
            output: `year === 2024，month === '03'，day === '15'，formatted === '2024-03-15'`,
          },
        ],
        constraints: [
          '注意 getMonth() 從 0 開始，需要 +1',
          'month 和 day 必須補兩位數（padStart(2, "0")）',
        ],
        initialCode: `const date = new Date('2024-03-15')

// TODO: 取得年份，存到 year（number）
let year

// TODO: 取得月份（記得 +1）並補兩位數，存到 month（string）
let month

// TODO: 取得日期並補兩位數，存到 day（string）
let day

// TODO: 組合成 'YYYY-MM-DD'，存到 formatted
let formatted
`,
        testCases: [
          { label: 'year 應為 2024', test: `return year === 2024` },
          { label: 'month 應為 "03"（補零）', test: `return month === '03'` },
          { label: 'day 應為 "15"', test: `return day === '15'` },
          { label: 'formatted 應為 "2024-03-15"', test: `return formatted === '2024-03-15'` },
          {
            label: '單位數月份也能正確補零',
            test: `const d = new Date('2024-01-05'); const m = String(d.getMonth()+1).padStart(2,'0'); return m === '01'`,
          },
        ],
      },
      {
        id: 'diff',
        title: '日期差異：用原生 Date 實作 dayjs.diff()',
        difficulty: 'medium',
        description: `dayjs 的 \`diff()\` 可以直接計算兩個日期相差幾天，
原生 Date 相減得到的是毫秒數，需要再換算。

\`\`\`js
// dayjs 參考寫法：
dayjs('2024-03-15').diff(dayjs('2024-01-01'), 'day')  // 74
\`\`\`

請用原生 Date 實作：
1. 計算 \`end\` 與 \`start\` 相差的毫秒數，存到 \`diffMs\`。
2. 換算成天數（無條件捨去），存到 \`diffDays\`。`,
        examples: [
          {
            input: `start = new Date('2024-01-01')，end = new Date('2024-03-15')`,
            output: `diffMs === 6393600000，diffDays === 74`,
          },
        ],
        constraints: [
          '1 天 = 1000 * 60 * 60 * 24 毫秒',
          '天數使用 Math.floor() 無條件捨去',
        ],
        initialCode: `const start = new Date('2024-01-01')
const end = new Date('2024-03-15')

// TODO: 計算相差毫秒數（end - start），存到 diffMs
let diffMs

// TODO: 換算成天數（無條件捨去），存到 diffDays
let diffDays
`,
        testCases: [
          { label: 'diffMs 應為 6393600000', test: `return diffMs === 6393600000` },
          { label: 'diffDays 應為 74', test: `return diffDays === 74` },
          { label: '換算公式正確', test: `return Math.floor(6393600000 / (1000 * 60 * 60 * 24)) === 74` },
          {
            label: '閏年計算正確（2024 年 2 月有 29 天）',
            test: `const s = new Date('2024-02-01'); const e = new Date('2024-03-01'); return Math.floor((e-s)/(1000*60*60*24)) === 29`,
          },
        ],
      },
      {
        id: 'add-days',
        title: '加減日期：用原生 Date 實作 dayjs.add()（注意不可變性）',
        difficulty: 'medium',
        description: `dayjs 的 \`add()\` 是**不可變（immutable）**的，回傳新物件，原始值不變。
原生 Date 的 \`setDate()\` 則會**直接修改**原物件，使用前必須先複製。

\`\`\`js
// dayjs 參考寫法（immutable）：
dayjs('2024-01-15').add(30, 'day').format('YYYY-MM-DD')  // '2024-02-14'
// 原始物件不受影響
\`\`\`

請用原生 Date 實作，且**不得修改 original**：
1. 複製 \`original\` 為 \`copy\`（使用 \`new Date(original)\`）。
2. 在 \`copy\` 上加 30 天。
3. 格式化 \`copy\` 為 \`'YYYY-MM-DD'\`，存到 \`result\`。`,
        examples: [
          {
            input: `original = new Date('2024-01-15')`,
            output: `result === '2024-02-14'，original 不變`,
          },
        ],
        constraints: [
          'copy 必須用 new Date(original) 複製，不得直接賦值',
          'original 的時間戳不得改變',
        ],
        initialCode: `const original = new Date('2024-01-15')

// TODO: 複製 original，存到 copy
let copy

// TODO: 在 copy 上加 30 天（用 setDate）

// TODO: 格式化 copy 為 'YYYY-MM-DD'，存到 result
let result
`,
        testCases: [
          { label: 'result 應為 "2024-02-14"', test: `return result === '2024-02-14'` },
          {
            label: 'original 不得被修改',
            test: `return original.getTime() === new Date('2024-01-15').getTime()`,
          },
          {
            label: '直接賦值不是真正複製',
            test: `const a = new Date('2024-01-15'); const b = new Date(a); b.setDate(b.getDate()+30); return a.getTime() === new Date('2024-01-15').getTime()`,
          },
        ],
      },
      {
        id: 'isvalid',
        title: '日期驗證：用原生 Date 實作 dayjs.isValid()',
        difficulty: 'easy',
        description: `dayjs 的 \`isValid()\` 可以判斷一個日期字串是否合法，
原生 Date 可以用 \`!isNaN(new Date(str).getTime())\` 達成相同效果。

\`\`\`js
// dayjs 參考寫法：
dayjs('2024-13-01').isValid()  // false（13月不存在）
dayjs('2024-01-15').isValid()  // true
\`\`\`

請用原生 Date 實作：
1. 驗證 \`validInput\` 是否為有效日期，存到 \`isValidDate\`（boolean）。
2. 驗證 \`invalidInput\` 是否為有效日期，存到 \`isInvalidDate\`（boolean）。`,
        examples: [
          {
            input: `validInput = '2024-01-15'，invalidInput = '2024-13-01'`,
            output: `isValidDate === true，isInvalidDate === false`,
          },
        ],
        constraints: [
          '使用 !isNaN(new Date(str).getTime()) 判斷',
        ],
        initialCode: `const validInput = '2024-01-15'
const invalidInput = '2024-13-01'

// TODO: 驗證 validInput 是否為有效日期，存到 isValidDate（boolean）
let isValidDate

// TODO: 驗證 invalidInput 是否為有效日期，存到 isInvalidDate（boolean）
let isInvalidDate
`,
        testCases: [
          { label: 'isValidDate 應為 true', test: `return isValidDate === true` },
          { label: 'isInvalidDate 應為 false', test: `return isInvalidDate === false` },
          {
            label: 'Invalid Date 的 getTime() 回傳 NaN',
            test: `return isNaN(new Date('2024-13-01').getTime())`,
          },
          {
            label: '有效日期的 getTime() 不是 NaN',
            test: `return !isNaN(new Date('2024-01-15').getTime())`,
          },
        ],
      },
    ],
  },
]
