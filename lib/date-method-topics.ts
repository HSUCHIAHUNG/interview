export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  answer: number // 0-based
  explanation: string
}

export interface DateMethodEntry {
  slug: string
  title: string
  description: string
  subCategory: string
  difficulty: 'easy' | 'medium' | 'hard'
  notes: {
    sections: { heading: string; content: string }[]
  }
  questions: QuizQuestion[]
  keyPoints: string[]
}

export const THEME = '日期時間方法'

export const DATE_SUB_CATEGORIES = [
  { name: '建立', order: 1 },
  { name: '取得資訊', order: 2 },
  { name: '格式化', order: 3 },
  { name: '運算', order: 4 },
  { name: '常見陷阱', order: 5 },
]

export const dateMethodTopics: DateMethodEntry[] = [
  // ─── 建立 ────────────────────────────────────────────────────────
  {
    slug: 'date-create',
    title: 'new Date() / Date.now()',
    description: '建立 Date 物件的各種方式，以及取得毫秒時間戳',
    subCategory: '建立',
    difficulty: 'easy',
    notes: {
      sections: [
        {
          heading: '建立 Date 物件的四種方式',
          content: `\`\`\`js
// 1. 不傳參數 → 目前時間
const now = new Date()          // Date 物件

// 2. 傳入毫秒時間戳
const d1 = new Date(0)          // 1970-01-01T00:00:00.000Z
const d2 = new Date(1705276800000)

// 3. 傳入日期字串
const d3 = new Date('2024-01-15')         // UTC midnight
const d4 = new Date('2024-01-15T08:00:00') // 本地時間

// 4. 傳入年、月、日... (月份 0-based)
const d5 = new Date(2024, 0, 15)  // 2024-01-15 本地時間
\`\`\`

**重要區別：**
- \`new Date()\` → 回傳 **Date 物件**
- \`Date.now()\` → 回傳 **number**（毫秒時間戳，不需要 new）`,
        },
        {
          heading: 'Date.now() 與時間戳',
          content: `\`\`\`js
const ts = Date.now()           // number，例如 1705276800000
const ts2 = new Date().getTime() // 同樣效果，但多一個物件建立

// 計算執行時間
const start = Date.now()
// ...做一些事...
const elapsed = Date.now() - start  // 毫秒數
\`\`\`

**Date.now() 比 new Date().getTime() 更推薦**，因為不需要建立 Date 物件，效能更好。`,
        },
        {
          heading: '字串解析的時區陷阱',
          content: `\`\`\`js
// 只有日期的 ISO 字串 → UTC midnight
new Date('2024-01-15')
// → 在 UTC+8 顯示為 2024-01-15 08:00:00

// 有時間的字串 → 視為本地時間
new Date('2024-01-15T00:00:00')
// → 在 UTC+8 顯示為 2024-01-15 00:00:00

// 明確指定 UTC
new Date('2024-01-15T00:00:00Z')
// → UTC midnight，在 UTC+8 顯示為 2024-01-15 08:00:00
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: '下列哪個方法回傳的是 number 而非 Date 物件？',
        options: [
          'new Date()',
          'Date.now()',
          'new Date(0)',
          'new Date("2024-01-15")',
        ],
        answer: 1,
        explanation:
          'Date.now() 直接回傳目前時間的毫秒時間戳（number），不需要 new 關鍵字，也不會建立 Date 物件。其他選項都使用 new Date()，回傳的是 Date 物件。',
      },
      {
        id: 2,
        question: '執行 `new Date(0)` 代表哪個時間點？',
        options: [
          '目前時間',
          '1970-01-01T00:00:00.000Z（UTC 零點）',
          '2000-01-01T00:00:00.000Z',
          '會拋出錯誤，因為 0 不是有效參數',
        ],
        answer: 1,
        explanation:
          'Unix 時間戳 0 代表 1970-01-01T00:00:00.000Z，即 Unix 紀元（Epoch）的起始點。new Date(0) 就是從這個時間點開始計算 0 毫秒後的時間。',
      },
      {
        id: 3,
        question: '`new Date(2024, 0, 15)` 中第二個參數 0 代表哪個月份？',
        options: ['沒有月份（只有年跟日）', '12 月', '1 月（月份從 0 開始）', '2 月'],
        answer: 2,
        explanation:
          '當使用多參數建立 Date 時，月份是 0-based，所以 0 代表 1 月，11 代表 12 月。new Date(2024, 0, 15) 是 2024 年 1 月 15 日。',
      },
      {
        id: 4,
        question: '下列哪種寫法效能最好，用來取得目前時間的毫秒時間戳？',
        options: [
          'new Date().getTime()',
          'new Date().valueOf()',
          'Date.now()',
          '+new Date()',
        ],
        answer: 2,
        explanation:
          'Date.now() 效能最好，因為不需要建立 Date 物件就能直接取得時間戳。其他三種方式都需要先建立 Date 物件再取值，多了一步物件建立的開銷。',
      },
      {
        id: 5,
        question: '`new Date("2024-01-15")` 在 UTC+8 時區下，getHours() 會回傳什麼？',
        options: ['0', '8', '15', '24'],
        answer: 1,
        explanation:
          '只有日期的 ISO 字串（YYYY-MM-DD）會被解析為 UTC midnight。UTC+8 的本地時間比 UTC 快 8 小時，所以 UTC 00:00 對應到 UTC+8 的 08:00，getHours() 回傳 8。',
      },
      {
        id: 6,
        question: '下列程式碼輸出為何？\n```js\nconsole.log(typeof Date.now())\n```',
        options: ['"object"', '"Date"', '"number"', '"string"'],
        answer: 2,
        explanation:
          'Date.now() 回傳的是 number 型別的毫秒時間戳，typeof Date.now() 的結果是 "number"。如果是 new Date()，typeof 才會回傳 "object"。',
      },
    ],
    keyPoints: [
      'new Date() 建立 Date 物件；Date.now() 直接回傳毫秒數字，不用 new',
      '月份參數是 0-based：new Date(2024, 0, 15) 的 0 代表 1 月',
      '只傳日期字串時（如 "2024-01-15"）會當作 UTC midnight 解析',
      'Date.now() 效能優於 new Date().getTime()，不需建立物件',
      '時間戳（timestamp）就是從 1970-01-01 UTC 到現在的毫秒數',
      'new Date(毫秒數) 可以從時間戳還原成 Date 物件',
    ],
  },

  // ─── 取得資訊 ────────────────────────────────────────────────────
  {
    slug: 'date-year-month',
    title: 'getFullYear() / getMonth()',
    description: '取得年份與月份，getMonth() 從 0 開始是最常見陷阱',
    subCategory: '取得資訊',
    difficulty: 'easy',
    notes: {
      sections: [
        {
          heading: 'getFullYear() 取得年份',
          content: `\`\`\`js
const d = new Date('2024-03-15')
d.getFullYear()  // 2024

// 注意：不要用 getYear()，它是過時方法
// getYear() 回傳的是 year - 1900，例如 2024 → 124
\`\`\`

**永遠使用 getFullYear()，不要用 getYear()**，後者已廢棄且回傳值令人困惑。`,
        },
        {
          heading: 'getMonth() 的 0-based 陷阱',
          content: `\`\`\`js
const d = new Date('2024-03-15')
d.getMonth()  // 2，不是 3！

// 月份對應關係
// 0 → 1月   1 → 2月   2 → 3月
// 3 → 4月   4 → 5月   5 → 6月
// 6 → 7月   7 → 8月   8 → 9月
// 9 → 10月  10 → 11月  11 → 12月

// 要取得「人類看得懂的月份」要 +1
const month = d.getMonth() + 1  // 3（3月）
\`\`\`

**getMonth() 是 0-based，顯示時要 +1**，這是 Date API 最常見的 bug 來源。`,
        },
        {
          heading: '實際應用：格式化日期',
          content: `\`\`\`js
function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return \`\${year}-\${month}-\${day}\`
}

formatDate(new Date('2024-03-05'))  // '2024-03-05'
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question:
          '下列程式碼輸出為何？\n```js\nnew Date("2024-03-15").getMonth()\n```',
        options: ['3', '2', '15', '2024'],
        answer: 1,
        explanation:
          'getMonth() 回傳的月份是 0-based，1 月 = 0，2 月 = 1，3 月 = 2。所以 2024-03-15 的 getMonth() 回傳 2，不是 3。',
      },
      {
        id: 2,
        question: '要取得「人類看得懂的月份數字」（例如 3 月回傳 3），應該怎麼寫？',
        options: [
          'date.getMonth()',
          'date.getMonth() + 1',
          'date.getMonth() - 1',
          'date.getMonthIndex()',
        ],
        answer: 1,
        explanation:
          'getMonth() 是 0-based（1 月 = 0），所以要加 1 才能得到「人類的月份」。這是最常見的 Date 陷阱之一。',
      },
      {
        id: 3,
        question: '下列程式碼輸出為何？\n```js\nnew Date("2024-01-01").getFullYear()\n```',
        options: ['2023', '2024', '1', '0'],
        answer: 1,
        explanation:
          'getFullYear() 直接回傳完整的西元年份，2024-01-01 的年份就是 2024。注意不要用 getYear()，那個方法已廢棄。',
      },
      {
        id: 4,
        question: '使用 `new Date(2024, 11, 25)` 建立的日期是幾月幾號？',
        options: ['11 月 25 日', '12 月 25 日', '1 月 25 日', '會拋出錯誤'],
        answer: 1,
        explanation:
          '月份參數是 0-based，11 代表 12 月（0=1月, 1=2月, ..., 11=12月）。所以 new Date(2024, 11, 25) 是 2024 年 12 月 25 日。',
      },
      {
        id: 5,
        question: '為什麼不建議使用 `date.getYear()`？',
        options: [
          '它不存在，會拋出錯誤',
          '它回傳 year - 1900，例如 2024 年回傳 124，已被廢棄',
          '它只回傳年份的後兩位，例如 2024 回傳 24',
          '它比 getFullYear() 慢很多',
        ],
        answer: 1,
        explanation:
          'getYear() 是過時的方法，回傳值是 year - 1900（例如 2024 回傳 124），非常不直觀。應永遠使用 getFullYear() 取得完整的四位數年份。',
      },
      {
        id: 6,
        question:
          '下列程式碼輸出為何？\n```js\nconst d = new Date("2024-12-31")\nconsole.log(d.getMonth())\n```',
        options: ['12', '11', '31', '0'],
        answer: 1,
        explanation:
          '12 月對應的 getMonth() 值是 11（0-based），不是 12。月份範圍是 0（1月）到 11（12月）。',
      },
    ],
    keyPoints: [
      'getMonth() 是 0-based，1 月回傳 0，12 月回傳 11',
      '顯示月份時要記得 getMonth() + 1，不然會少一個月',
      'getFullYear() 回傳完整的四位數年份，永遠用這個',
      '不要用 getYear()，它已廢棄，回傳 year - 1900',
      '使用多參數 new Date(year, month, day) 時，月份同樣是 0-based',
      '記住規律：Date API 中只有月份是 0-based，日期和年份都是正常的',
    ],
  },
  {
    slug: 'date-date-day',
    title: 'getDate() / getDay()',
    description: 'getDate() 回傳幾號，getDay() 回傳星期（0=週日）',
    subCategory: '取得資訊',
    difficulty: 'easy',
    notes: {
      sections: [
        {
          heading: 'getDate() vs getDay() 的差異',
          content: `\`\`\`js
const d = new Date('2024-03-15')  // 2024年3月15日，星期五

d.getDate()  // 15（幾號）
d.getDay()   // 5（星期五）

// 星期對應表（getDay）
// 0 → 週日  1 → 週一  2 → 週二  3 → 週三
// 4 → 週四  5 → 週五  6 → 週六
\`\`\`

**名字很像，意思差很多：**
- **getDate()** → 幾「號」（1-31）
- **getDay()** → 星「期」幾（0-6，0 是週日）`,
        },
        {
          heading: 'getDay() 的 0=週日 陷阱',
          content: `\`\`\`js
const WEEKDAYS = ['週日', '週一', '週二', '週三', '週四', '週五', '週六']

const d = new Date('2024-03-17')  // 週日
d.getDay()  // 0

WEEKDAYS[d.getDay()]  // '週日'

// 常見錯誤：以為 0 是週一
// 若要判斷是否為週末：
function isWeekend(date) {
  const day = date.getDay()
  return day === 0 || day === 6  // 週日或週六
}
\`\`\``,
        },
        {
          heading: '實際應用範例',
          content: `\`\`\`js
const d = new Date('2024-03-15')
const DAYS = ['日', '一', '二', '三', '四', '五', '六']

// 格式化輸出：2024-03-15（五）
const formatted = \`\${d.getFullYear()}-\${String(d.getMonth()+1).padStart(2,'0')}-\${String(d.getDate()).padStart(2,'0')}（\${DAYS[d.getDay()]}）\`

// 計算某月有幾天（下個月第 0 天 = 這個月最後一天）
function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}
daysInMonth(2024, 1)  // 2月 → 29（2024閏年）
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: '`getDay()` 回傳 0 代表星期幾？',
        options: ['週一', '週六', '週日', '今天的日期數字'],
        answer: 2,
        explanation:
          'getDay() 回傳 0 代表週日（Sunday），不是週一。星期範圍是 0（週日）到 6（週六），這和很多人的直覺相反。',
      },
      {
        id: 2,
        question:
          '下列程式碼輸出為何？（2024-03-15 是星期五）\n```js\nnew Date("2024-03-15").getDate()\n```',
        options: ['5（星期五）', '15（15 號）', '3（3 月）', '2024'],
        answer: 1,
        explanation:
          'getDate() 回傳的是幾「號」，不是星期幾。2024-03-15 的 getDate() 回傳 15。要取得星期幾要用 getDay()，它才會回傳 5（週五）。',
      },
      {
        id: 3,
        question: '下列哪個函式可以判斷一個日期是否為週末？',
        options: [
          'date.getDay() === 6',
          'date.getDate() === 0 || date.getDate() === 6',
          'date.getDay() === 0 || date.getDay() === 6',
          'date.getDay() === 5 || date.getDay() === 6',
        ],
        answer: 2,
        explanation:
          'getDay() 中 0 代表週日，6 代表週六。所以判斷週末的條件是 getDay() === 0 || getDay() === 6。注意不要用 getDate()，那是取得幾號。',
      },
      {
        id: 4,
        question: 'getDay() 的回傳值範圍是？',
        options: ['1 到 7', '0 到 6', '1 到 6', '0 到 7'],
        answer: 1,
        explanation:
          'getDay() 回傳 0 到 6 的整數，0 代表週日，1 代表週一，依此類推，6 代表週六。',
      },
      {
        id: 5,
        question:
          '如果 `new Date("2024-03-17").getDay()` 回傳 0，代表這天是？',
        options: ['這個月第 0 天（無效）', '週日', '週一', '沒有意義，getDay 不應該用日期字串'],
        answer: 1,
        explanation:
          'getDay() 回傳 0 代表週日（Sunday）。2024-03-17 確實是週日，所以 getDay() 回傳 0。',
      },
      {
        id: 6,
        question:
          '下列程式碼如何取得「這個月有幾天」？\n```js\nfunction daysInMonth(year, month) {\n  return new Date(year, month + 1, 0).getDate()\n}\n```\n這裡 `new Date(year, month + 1, 0)` 的第三個參數 `0` 代表什麼？',
        options: [
          '表示從第 0 毫秒開始',
          '下個月的第 0 天，相當於這個月的最後一天',
          '會建立無效日期，應該用 1',
          '月份偏移量',
        ],
        answer: 1,
        explanation:
          'Date 的日期參數支援超出範圍的值。傳入 0 代表「上一個月的最後一天」。所以 new Date(year, month+1, 0) 就是「下個月的前一天」，即這個月的最後一天，再用 getDate() 就能得到這個月的天數。',
      },
    ],
    keyPoints: [
      'getDate() 取幾號（1-31），getDay() 取星期幾（0-6）',
      'getDay() 的 0 是週日，不是週一，這是很常見的混淆點',
      '判斷週末：getDay() === 0（週日）|| getDay() === 6（週六）',
      'getDate() 和 getDay() 名字很像，功能完全不同，要注意區分',
      '可以用 new Date(year, month+1, 0).getDate() 取得該月天數',
      '建立一個星期名稱陣列，索引從 0 開始，方便對應 getDay() 的結果',
    ],
  },
  {
    slug: 'date-time',
    title: 'getHours() / getMinutes() / getSeconds()',
    description: '取得時、分、秒的方法',
    subCategory: '取得資訊',
    difficulty: 'easy',
    notes: {
      sections: [
        {
          heading: '取得時間各部分',
          content: `\`\`\`js
const d = new Date('2024-03-15T14:30:45.500')

d.getHours()        // 14（0-23）
d.getMinutes()      // 30（0-59）
d.getSeconds()      // 45（0-59）
d.getMilliseconds() // 500（0-999）
\`\`\`

所有方法都回傳本地時間的值。如果要取 UTC 時間，對應的方法是：
- \`getUTCHours()\`、\`getUTCMinutes()\`、\`getUTCSeconds()\``,
        },
        {
          heading: '格式化時間輸出',
          content: `\`\`\`js
function formatTime(date) {
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  const s = String(date.getSeconds()).padStart(2, '0')
  return \`\${h}:\${m}:\${s}\`
}

formatTime(new Date('2024-03-15T09:05:03'))  // '09:05:03'
\`\`\`

使用 \`padStart(2, '0')\` 補零，確保輸出永遠是兩位數格式。`,
        },
        {
          heading: 'UTC vs 本地時間',
          content: `\`\`\`js
// 假設在 UTC+8 時區
const d = new Date('2024-03-15T00:00:00Z')  // UTC midnight

d.getHours()    // 8（本地時間 UTC+8）
d.getUTCHours() // 0（UTC 時間）

// 如果要和後端統一使用 UTC 時間，要特別注意這個差異
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: 'getHours() 的回傳值範圍是？',
        options: ['1 到 12', '1 到 24', '0 到 23', '0 到 24'],
        answer: 2,
        explanation:
          'getHours() 回傳 0 到 23 的整數，使用 24 小時制。0 代表午夜 12 點，23 代表晚上 11 點。',
      },
      {
        id: 2,
        question:
          '下列程式碼輸出為何？\n```js\nnew Date("2024-03-15T09:05:03").getMinutes()\n```',
        options: ['9', '5', '3', '905'],
        answer: 1,
        explanation:
          'getMinutes() 取得分鐘部分，09:05:03 的分鐘是 5。注意回傳的是數字 5，不是字串 "05"。如果要輸出 "05" 需要用 padStart(2, "0") 補零。',
      },
      {
        id: 3,
        question: '如何確保時間輸出格式為 "09:05:03"（個位數補零）？',
        options: [
          'date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()',
          'String(date.getHours()).padStart(2, "0") 等方式補零',
          'date.toTimeString()',
          'date.getTime()',
        ],
        answer: 1,
        explanation:
          'get 系列方法回傳數字，個位數不會自動補零。需要用 String().padStart(2, "0") 或 String().padStart(2, "0") 來補零，才能輸出 "09:05:03" 這樣的格式。',
      },
      {
        id: 4,
        question: 'getHours() 和 getUTCHours() 的差別是什麼？',
        options: [
          '沒有差別，回傳值相同',
          'getHours() 回傳本地時間，getUTCHours() 回傳 UTC 時間',
          'getUTCHours() 不存在',
          'getHours() 回傳 12 小時制，getUTCHours() 回傳 24 小時制',
        ],
        answer: 1,
        explanation:
          'getHours() 回傳本地時區的小時，getUTCHours() 回傳 UTC 時區的小時。在 UTC+8 時區，兩者差 8 小時。例如 UTC midnight（00:00Z），getHours() 回傳 8，getUTCHours() 回傳 0。',
      },
      {
        id: 5,
        question: 'getMilliseconds() 的回傳值範圍是？',
        options: ['0 到 99', '0 到 999', '0 到 1000', '1 到 1000'],
        answer: 1,
        explanation:
          'getMilliseconds() 回傳 0 到 999 的整數，代表毫秒部分。1 秒 = 1000 毫秒，所以最大值是 999。',
      },
      {
        id: 6,
        question:
          '在 UTC+8 時區執行下列程式碼，輸出為何？\n```js\nconst d = new Date("2024-01-01T00:00:00Z")\nconsole.log(d.getHours())\n```',
        options: ['0', '8', '-8', '24'],
        answer: 1,
        explanation:
          '"2024-01-01T00:00:00Z" 是 UTC midnight（Z 代表 UTC）。在 UTC+8 時區，這個時間點的本地時間是 08:00，所以 getHours() 回傳 8。',
      },
    ],
    keyPoints: [
      'getHours() 回傳 0-23（24 小時制），getMinutes() 和 getSeconds() 回傳 0-59',
      '所有 get 方法回傳本地時間的值，對應 UTC 版本是 getUTCHours() 等',
      '回傳值是數字，不會自動補零，輸出格式化時要用 padStart(2, "0")',
      'getMilliseconds() 回傳 0-999 的毫秒部分',
      '在不同時區，getHours() 和 getUTCHours() 的值不同，要特別注意',
      '格式化時間最簡單的方式：用 padStart 對每個部分補零再串接',
    ],
  },

  // ─── 格式化 ────────────────────────────────────────────────────
  {
    slug: 'date-toisostring',
    title: 'toISOString()',
    description: '輸出 ISO 8601 格式字串，永遠是 UTC 時間',
    subCategory: '格式化',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: 'toISOString() 基本用法',
          content: `\`\`\`js
const d = new Date('2024-03-15T14:30:45.500')
d.toISOString()
// '2024-03-15T06:30:45.500Z'  ← 假設在 UTC+8，轉成 UTC 輸出

// ISO 8601 格式：YYYY-MM-DDTHH:mm:ss.sssZ
// 末尾的 Z 代表 UTC（Zero offset）
\`\`\`

**重點：toISOString() 永遠輸出 UTC 時間，末尾有 Z**。如果你在 UTC+8 時區，本地時間的 14:30 會被輸出成 06:30Z。`,
        },
        {
          heading: 'toISOString() 的用途',
          content: `\`\`\`js
// 1. 儲存到資料庫（標準化時間格式）
const timestamp = new Date().toISOString()  // '2024-03-15T06:30:45.500Z'

// 2. API 傳遞時間（JSON 序列化時自動呼叫）
JSON.stringify({ createdAt: new Date() })
// → '{"createdAt":"2024-03-15T06:30:45.500Z"}'

// 3. 取日期部分（前 10 個字元）
new Date().toISOString().slice(0, 10)  // '2024-03-15'（UTC 日期）
\`\`\``,
        },
        {
          heading: '本地日期 vs UTC 日期的差異',
          content: `\`\`\`js
// 在 UTC+8 時區，午夜 00:00（本地時間）
const d = new Date('2024-03-15T00:00:00')

d.toISOString()           // '2024-03-14T16:00:00.000Z'（UTC 時間！）
d.toISOString().slice(0,10)  // '2024-03-14'（UTC 日期，少了一天！）

// 如果要取本地日期，不能用 toISOString().slice(0,10)
// 應該用 getFullYear/getMonth/getDate 自己組合
\`\`\`

這是一個常見 bug：用 toISOString().slice(0,10) 取本地日期，在某些時區會差一天。`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: 'toISOString() 輸出的時間是哪個時區？',
        options: [
          '本地時區',
          'UTC（永遠是 UTC，末尾有 Z）',
          '取決於系統設定',
          'GMT+8',
        ],
        answer: 1,
        explanation:
          'toISOString() 永遠輸出 UTC 時間，末尾的 Z 代表 Zero offset（UTC+0）。無論在哪個時區，輸出的時間都是 UTC，不是本地時間。',
      },
      {
        id: 2,
        question: 'ISO 8601 格式字串末尾的 "Z" 代表什麼？',
        options: [
          '這是一個未知的格式標記',
          'Zero offset，代表 UTC+0 時區',
          '時區縮寫，代表某個特定地區',
          '毫秒精確度標記',
        ],
        answer: 1,
        explanation:
          'ISO 8601 中末尾的 Z 代表 "Zulu time"，即 UTC+0（Zero offset）。看到 Z 結尾的時間字串就代表它是 UTC 時間。',
      },
      {
        id: 3,
        question:
          '在 UTC+8 時區，`new Date("2024-03-15T08:00:00").toISOString()` 輸出為何？',
        options: [
          '"2024-03-15T08:00:00.000Z"',
          '"2024-03-15T00:00:00.000Z"',
          '"2024-03-15T16:00:00.000Z"',
          '"2024-03-14T24:00:00.000Z"',
        ],
        answer: 1,
        explanation:
          '本地時間 08:00（UTC+8）轉成 UTC 要減 8 小時，得到 00:00。所以 toISOString() 輸出 "2024-03-15T00:00:00.000Z"。',
      },
      {
        id: 4,
        question:
          '為什麼在 UTC+8 時區不能用 `new Date().toISOString().slice(0, 10)` 取得今天的本地日期？',
        options: [
          '因為 toISOString() 格式不是 YYYY-MM-DD',
          '因為 toISOString() 輸出 UTC 日期，在 UTC+8 凌晨 0-8 點時，UTC 日期會比本地日期少一天',
          '因為 slice 方法不能用在日期字串上',
          '其實可以，沒有問題',
        ],
        answer: 1,
        explanation:
          '在 UTC+8 凌晨 0:00 到 7:59，對應的 UTC 時間是前一天的 16:00 到 23:59，所以 toISOString().slice(0,10) 取得的是前一天的日期。要取本地日期，應用 getFullYear/getMonth/getDate 自己組合。',
      },
      {
        id: 5,
        question: 'JSON.stringify 將 Date 物件序列化時，格式是什麼？',
        options: [
          '毫秒時間戳數字',
          'ISO 8601 格式字串（與 toISOString() 相同）',
          '本地日期字串',
          '會拋出錯誤，Date 無法序列化',
        ],
        answer: 1,
        explanation:
          'JSON.stringify 對 Date 物件呼叫 toISOString()，輸出 ISO 8601 格式的 UTC 時間字串，如 "2024-03-15T06:30:45.500Z"。',
      },
      {
        id: 6,
        question:
          '`toISOString()` 的輸出格式是？',
        options: [
          'YYYY/MM/DD HH:mm:ss',
          'YYYY-MM-DDTHH:mm:ss.sssZ',
          'MM-DD-YYYY',
          'DD/MM/YYYY HH:mm',
        ],
        answer: 1,
        explanation:
          'toISOString() 的輸出符合 ISO 8601 標準：YYYY-MM-DDTHH:mm:ss.sssZ，其中 T 分隔日期和時間，sss 是毫秒，Z 代表 UTC。',
      },
    ],
    keyPoints: [
      'toISOString() 永遠輸出 UTC 時間，末尾的 Z 就是代表 UTC',
      '在 UTC+8，本地時間 14:00 用 toISOString() 會輸出 06:00Z',
      '不能用 toISOString().slice(0,10) 取本地日期，在某些時段會差一天',
      'JSON.stringify 自動對 Date 呼叫 toISOString()，序列化結果是 UTC 字串',
      '儲存到資料庫建議用 toISOString()，格式標準、時區明確',
      '看到末尾有 Z 的時間字串，就代表它是 UTC 時間，要注意與本地時間的轉換',
    ],
  },
  {
    slug: 'date-tolocale',
    title: 'toLocaleDateString() / toLocaleString()',
    description: '根據地區格式化日期時間輸出',
    subCategory: '格式化',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: 'toLocaleDateString() 基本用法',
          content: `\`\`\`js
const d = new Date('2024-03-15T14:30:00')

// 不傳參數 → 使用系統預設語系
d.toLocaleDateString()  // '2024/3/15'（依系統不同）

// 傳入語系
d.toLocaleDateString('zh-TW')  // '2024/3/15'
d.toLocaleDateString('en-US')  // '3/15/2024'
d.toLocaleDateString('ja-JP')  // '2024/3/15'
d.toLocaleDateString('de-DE')  // '15.3.2024'
\`\`\``,
        },
        {
          heading: 'toLocaleString() 與 options 參數',
          content: `\`\`\`js
const d = new Date('2024-03-15T14:30:45')

// toLocaleString 同時包含日期和時間
d.toLocaleString('zh-TW')
// '2024/3/15 下午2:30:45'

// 使用 options 精細控制格式
d.toLocaleDateString('zh-TW', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
})
// '2024年3月15日星期五'

d.toLocaleString('zh-TW', {
  hour12: false,       // 24 小時制
  hour: '2-digit',
  minute: '2-digit',
})
// '14:30'
\`\`\``,
        },
        {
          heading: 'toLocaleDateString 回傳本地時間',
          content: `\`\`\`js
// 在 UTC+8 時區
const d = new Date('2024-03-15T00:00:00Z')  // UTC midnight

d.toISOString()            // '2024-03-15T00:00:00.000Z'（UTC）
d.toLocaleDateString('zh-TW')  // '2024/3/15'（本地時間，UTC+8 = 08:00）

// 對比 toISOString() 永遠 UTC，toLocaleDateString 用本地時間
\`\`\`

**toLocaleDateString 顯示的是本地時間**，這和 toISOString() 的 UTC 不同，要注意。`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: 'toLocaleDateString() 和 toISOString() 最主要的差異是什麼？',
        options: [
          'toLocaleDateString 回傳數字，toISOString 回傳字串',
          'toLocaleDateString 使用本地時間和本地格式，toISOString 永遠是 UTC 的標準格式',
          'toISOString 比較準確',
          '兩者完全相同',
        ],
        answer: 1,
        explanation:
          'toLocaleDateString() 根據傳入的語系（locale）以本地時間輸出對應格式的日期字串。toISOString() 永遠輸出 UTC 時間的 ISO 8601 標準格式。前者適合顯示給使用者，後者適合資料傳輸和儲存。',
      },
      {
        id: 2,
        question: '`new Date("2024-03-15").toLocaleDateString("en-US")` 輸出格式為何？',
        options: [
          '"2024-03-15"',
          '"3/15/2024"',
          '"15/03/2024"',
          '"March 15, 2024"',
        ],
        answer: 1,
        explanation:
          '使用 "en-US" 語系時，toLocaleDateString() 輸出美式日期格式：月/日/年，即 "3/15/2024"。不同語系有不同的日期格式。',
      },
      {
        id: 3,
        question: '如何使用 toLocaleDateString 輸出「2024年3月15日」這種中文格式？',
        options: [
          'd.toLocaleDateString("zh-TW")',
          'd.toLocaleDateString("zh-TW", { year: "numeric", month: "long", day: "numeric" })',
          'd.toLocaleDateString("Chinese")',
          'd.toLocaleDateString({ format: "zh-TW" })',
        ],
        answer: 1,
        explanation:
          '需要傳入 options 物件，設定 month: "long" 才能顯示「3月」這樣的完整月份名稱。只傳語系 "zh-TW" 預設會輸出 "2024/3/15" 這樣的格式。',
      },
      {
        id: 4,
        question: 'toLocaleString() 和 toLocaleDateString() 的差別是什麼？',
        options: [
          '沒有差別，是同一個方法的別名',
          'toLocaleString 同時包含日期和時間，toLocaleDateString 只有日期',
          'toLocaleString 只有時間，toLocaleDateString 只有日期',
          'toLocaleString 不接受語系參數',
        ],
        answer: 1,
        explanation:
          'toLocaleString() 輸出完整的日期和時間，如 "2024/3/15 下午2:30:45"。toLocaleDateString() 只輸出日期部分，如 "2024/3/15"。對應的還有 toLocaleTimeString() 只輸出時間。',
      },
      {
        id: 5,
        question: '設定 `hour12: false` 在 options 中代表什麼？',
        options: [
          '不顯示小時',
          '使用 24 小時制（而非上午/下午的 12 小時制）',
          '只顯示 12 點之前的時間',
          '這不是有效的 option',
        ],
        answer: 1,
        explanation:
          'hour12: false 設定使用 24 小時制輸出時間，例如下午 2 點顯示為 14，而非 2（下午）。hour12: true 則使用 12 小時制，顯示上午/下午。',
      },
      {
        id: 6,
        question: '為什麼 toLocaleDateString 適合用來顯示日期給使用者，但不適合用來儲存？',
        options: [
          '因為它回傳的格式不固定，依語系和系統而異，無法可靠解析',
          '因為它很慢',
          '因為它不包含時間',
          '因為它只支援英文',
        ],
        answer: 0,
        explanation:
          '不同語系和系統環境下，toLocaleDateString() 的輸出格式不同（如 "2024/3/15" vs "3/15/2024"），難以統一解析。儲存日期時應使用 toISOString() 或毫秒時間戳，格式標準且不受環境影響。',
      },
    ],
    keyPoints: [
      'toLocaleDateString() 根據語系格式化日期，適合顯示給使用者看',
      '傳入語系字串如 "zh-TW"、"en-US" 可以控制輸出格式',
      '用 options 物件可以精細控制要顯示哪些欄位和格式',
      'toLocaleString() 同時包含日期和時間，toLocaleDateString() 只有日期',
      'toLocaleDateString 顯示的是本地時間，不是 UTC',
      '儲存和傳輸用 toISOString()，顯示給使用者用 toLocaleDateString()',
    ],
  },

  // ─── 運算 ────────────────────────────────────────────────────────
  {
    slug: 'date-calc',
    title: 'Date 運算與 setDate()',
    description: 'Date 相減得毫秒差，用 setDate 計算 N 天後',
    subCategory: '運算',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: 'Date 相減取得毫秒差',
          content: `\`\`\`js
const d1 = new Date('2024-03-15')
const d2 = new Date('2024-03-20')

const diffMs = d2 - d1   // 432000000（毫秒）

// 換算成天數
const diffDays = diffMs / (1000 * 60 * 60 * 24)  // 5

// 換算成小時
const diffHours = diffMs / (1000 * 60 * 60)  // 120
\`\`\`

Date 物件相減時，JavaScript 會自動將兩個 Date 轉為毫秒時間戳再相減。`,
        },
        {
          heading: 'setDate() 計算 N 天後',
          content: `\`\`\`js
// 取得 7 天後的日期
const today = new Date('2024-03-15')
today.setDate(today.getDate() + 7)
// today 現在是 2024-03-22

// 注意：setDate 會直接修改原始物件！
// 如果不想修改原物件，先複製：
const original = new Date('2024-03-15')
const next7 = new Date(original)  // 複製
next7.setDate(next7.getDate() + 7)
// original 不變，next7 是 7 天後
\`\`\`

**setDate 超出月份範圍時會自動進位**：例如 3 月 31 日 + 1 天 = 4 月 1 日。`,
        },
        {
          heading: 'setDate 跨月自動進位',
          content: `\`\`\`js
const d = new Date('2024-01-31')
d.setDate(d.getDate() + 1)
// 2024-02-01（自動進位到 2 月）

// 利用這個特性取月底：
// 下個月第 0 天 = 這個月最後一天
const lastDay = new Date(2024, 2, 0)  // 2月最後一天
lastDay.getDate()  // 29（2024閏年）

// 計算兩個日期差距的通用函式
function daysBetween(a, b) {
  const msPerDay = 1000 * 60 * 60 * 24
  return Math.round(Math.abs(b - a) / msPerDay)
}
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: '兩個 Date 物件相減，結果的單位是什麼？',
        options: ['秒', '分鐘', '毫秒', '天'],
        answer: 2,
        explanation:
          'Date 物件相減時，JavaScript 自動將兩者轉為毫秒時間戳再相減，結果單位是毫秒。要換算成天數要除以 1000 * 60 * 60 * 24。',
      },
      {
        id: 2,
        question: '計算兩個日期相差的天數，應除以多少毫秒？',
        options: ['1000', '1000 * 60', '1000 * 60 * 60', '1000 * 60 * 60 * 24'],
        answer: 3,
        explanation:
          '1 天 = 24 小時 = 24 * 60 分鐘 = 24 * 60 * 60 秒 = 24 * 60 * 60 * 1000 毫秒。所以毫秒差除以 1000 * 60 * 60 * 24 得到天數。',
      },
      {
        id: 3,
        question: '`setDate()` 方法的作用是什麼？',
        options: [
          '回傳日期的日部分（幾號）',
          '設定 Date 物件的日（幾號），並直接修改原物件',
          '建立新的 Date 物件',
          '設定時間戳',
        ],
        answer: 1,
        explanation:
          'setDate() 設定 Date 物件的「日」（幾號），並且是直接修改原本的 Date 物件（mutation）。如果不想修改原物件，需要先用 new Date(original) 複製一份再操作。',
      },
      {
        id: 4,
        question:
          '下列程式碼，original 的日期是什麼？\n```js\nconst original = new Date("2024-03-15")\noriginal.setDate(original.getDate() + 7)\n```',
        options: [
          '2024-03-15（setDate 不修改原物件）',
          '2024-03-22（setDate 直接修改原物件）',
          '會拋出錯誤',
          '2024-03-08',
        ],
        answer: 1,
        explanation:
          'setDate() 會直接修改原 Date 物件，所以 original 被改為 2024-03-22（15 + 7 = 22）。如果不想修改原物件，應先複製：const copy = new Date(original)。',
      },
      {
        id: 5,
        question:
          '下列程式碼輸出的月份是幾月？\n```js\nconst d = new Date("2024-01-31")\nd.setDate(d.getDate() + 1)\nconsole.log(d.getMonth() + 1)\n```',
        options: ['1（仍然是 1 月）', '2（自動進位到 2 月）', '會拋出錯誤', '0'],
        answer: 1,
        explanation:
          '1 月 31 日 + 1 天 = 2 月 1 日。setDate 超出月份範圍時會自動進位到下個月。getMonth() + 1 得到 2（2 月）。',
      },
      {
        id: 6,
        question: '如何安全地計算「7 天後的日期」，不修改原始 Date 物件？',
        options: [
          'original.setDate(original.getDate() + 7)',
          'const next = new Date(original); next.setDate(next.getDate() + 7)',
          'original.getDate() + 7',
          'new Date(original + 7 * 24 * 60 * 60)',
        ],
        answer: 1,
        explanation:
          '先用 new Date(original) 複製原物件，再對複製的物件呼叫 setDate()，這樣原物件不會被修改。直接對原物件呼叫 setDate 會改變它的值。',
      },
    ],
    keyPoints: [
      'Date 物件相減自動轉成毫秒，結果要除以 86400000（1000*60*60*24）換算成天',
      'setDate() 直接修改原本的 Date 物件，不想改動原物件要先複製',
      '複製 Date 物件的方法：new Date(original)',
      'setDate 超出當月天數會自動進位到下個月，例如 1/31 + 1 = 2/1',
      '計算 N 天後：new Date(date); copy.setDate(copy.getDate() + N)',
      '計算日期差：Math.round(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24))',
    ],
  },

  // ─── 常見陷阱 ────────────────────────────────────────────────────
  {
    slug: 'date-traps',
    title: 'Date 常見陷阱',
    description: 'getMonth 0-based、getDay 週日=0、UTC 字串時區問題',
    subCategory: '常見陷阱',
    difficulty: 'hard',
    notes: {
      sections: [
        {
          heading: '陷阱 1：getMonth() 是 0-based',
          content: `\`\`\`js
new Date('2024-03-15').getMonth()  // 2，不是 3！
new Date('2024-12-25').getMonth()  // 11，不是 12！

// 正確取得月份：
const month = new Date('2024-03-15').getMonth() + 1  // 3

// 設定月份也是 0-based：
new Date(2024, 0, 1)   // 1月1日
new Date(2024, 11, 31) // 12月31日
\`\`\``,
        },
        {
          heading: '陷阱 2：getDay() 週日 = 0',
          content: `\`\`\`js
// 很多人以為 0 是週一，但其實 0 是週日
const d = new Date('2024-03-17')  // 這天是週日
d.getDay()  // 0

// 星期對應：
// 0=週日  1=週一  2=週二  3=週三  4=週四  5=週五  6=週六

// 判斷週末要包含 0（週日）
const isWeekend = [0, 6].includes(d.getDay())
\`\`\``,
        },
        {
          heading: '陷阱 3：純日期字串解析為 UTC midnight',
          content: `\`\`\`js
// 「只有日期」的 ISO 字串 → UTC midnight
const d = new Date('2024-01-15')

// 在 UTC+8 環境：
d.toISOString()          // '2024-01-15T00:00:00.000Z'（UTC）
d.toLocaleDateString()   // '2024/1/15'（本地時間 08:00，日期相同）

// 問題出現在：
d.getHours()             // 8（不是 0！）
d.toISOString().slice(0,10)  // '2024-01-15'（OK）

// 如果在 UTC-9 環境：
// d.toLocaleDateString() → '2024/1/14'（少一天！）

// 安全的做法：如果要用特定日期的「本地 midnight」，用：
new Date('2024-01-15T00:00:00')  // 本地時間 midnight（沒有 Z）
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question:
          '下列哪個說法正確，關於 `new Date("2024-01-15")` 在 UTC+8 環境？',
        options: [
          '建立本地時間 2024-01-15 00:00:00',
          '建立 UTC midnight，在 UTC+8 顯示為 2024-01-15 08:00:00',
          '會拋出錯誤，日期字串格式不對',
          '等同於 new Date("2024-01-15T00:00:00+08:00")',
        ],
        answer: 1,
        explanation:
          '只有日期的 ISO 字串（YYYY-MM-DD）按規範解析為 UTC midnight。在 UTC+8 環境，這個時間點對應的本地時間是 08:00:00，而不是本地的 00:00:00。',
      },
      {
        id: 2,
        question:
          '`new Date("2024-03-15").getMonth()` 輸出為何？',
        options: ['3', '2', '15', '0'],
        answer: 1,
        explanation:
          'getMonth() 是 0-based，3 月對應的值是 2（0=1月, 1=2月, 2=3月）。這是最常見的 Date API 陷阱。',
      },
      {
        id: 3,
        question: '`getDay()` 回傳哪個數字代表週日？',
        options: ['7', '1', '0', '6'],
        answer: 2,
        explanation:
          'getDay() 中 0 代表週日（Sunday），這和很多程式語言或函式庫以週一為 0 的慣例不同，容易造成混淆。',
      },
      {
        id: 4,
        question:
          '在 UTC-5 時區，`new Date("2024-01-01")` 的本地日期是哪天？',
        options: [
          '2024-01-01（不受時區影響）',
          '2023-12-31（UTC midnight 在 UTC-5 是前一天 19:00）',
          '2024-01-02',
          '取決於瀏覽器',
        ],
        answer: 1,
        explanation:
          '"2024-01-01" 解析為 UTC midnight（2024-01-01T00:00:00Z）。在 UTC-5，這對應到本地時間 2023-12-31 19:00，所以 toLocaleDateString 會顯示 2023-12-31，少了一天。',
      },
      {
        id: 5,
        question:
          '如果想建立「本地時間 2024-01-15 的午夜 00:00:00」，下列哪個寫法正確？',
        options: [
          'new Date("2024-01-15")',
          'new Date("2024-01-15T00:00:00")',
          'new Date("2024-01-15T00:00:00Z")',
          '以上都一樣',
        ],
        answer: 1,
        explanation:
          '"2024-01-15"（純日期）解析為 UTC midnight，在非 UTC 時區會有時差。"2024-01-15T00:00:00"（不帶 Z）才會解析為本地時間的 midnight。帶 Z 的 "2024-01-15T00:00:00Z" 是 UTC midnight。',
      },
      {
        id: 6,
        question: '下列程式碼中，哪一行存在潛在的 bug（依賴時區）？',
        options: [
          'const d = new Date("2024-01-15T14:30:00")',
          'const month = d.getMonth() + 1',
          'const dateStr = new Date("2024-01-15").toISOString().slice(0, 10)',
          'const ts = Date.now()',
        ],
        answer: 2,
        explanation:
          '"2024-01-15" 解析為 UTC midnight，toISOString() 也是 UTC。在 UTC+0 及以東時區，取出的日期是 "2024-01-15"，但在 UTC-1 及以西，UTC midnight 的前一天也包含在內，切出來會是 "2024-01-14"。所以這行程式碼在不同時區行為不一致。',
      },
    ],
    keyPoints: [
      'getMonth() 是 0-based：1月=0, 12月=11，顯示時永遠要 +1',
      'getDay() 的 0 是週日，不是週一，這和很多人的直覺相反',
      '只有日期的字串如 "2024-01-15" 會被解析為 UTC midnight，非本地時間',
      '在 UTC+8，new Date("2024-01-15").getHours() 回傳 8，不是 0',
      '用 toISOString().slice(0,10) 取日期有時區問題，建議自己組合 getFullYear/getMonth/getDate',
      '要建立本地 midnight，用 new Date("2024-01-15T00:00:00")（不帶 Z）',
    ],
  },
]
