import type { MethodEntry } from './array-challenges'

export const dateChallengesPart1: MethodEntry[] = [
  // ─── date-create ──────────────────────────────────────────────────────────
  {
    slug: 'date-create',
    methodName: 'new Date() / Date.now()',
    title: 'new Date() / Date.now()',
    description: '建立日期物件或取得當前毫秒時間戳，是操作日期的第一步。',
    subCategory: '建立日期',
    difficulty: 'easy',
    notes: {
      title: 'new Date() / Date.now()',
      sections: [
        {
          heading: '建立方式',
          content: `JavaScript 建立日期物件有多種方式：

- \`new Date()\`：使用當前時間建立日期物件
- \`new Date('2024-03-15')\`：解析日期字串
- \`new Date(2024, 2, 15)\`：年、月（0-based）、日
- \`new Date(timestamp)\`：從毫秒時間戳建立
- \`Date.now()\`：直接取得當前毫秒時間戳（數字，不是物件）`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
// 建立固定日期
const d = new Date('2024-03-15')
d instanceof Date   // true
isNaN(d)            // false（有效日期）

// 時間戳
const ts = Date.now()          // 例如 1710460800000
typeof ts                       // 'number'
ts > 0                          // true

// 計算兩日期相差天數
const d1 = new Date('2024-01-01')
const d2 = new Date('2024-03-15')
const days = (d2 - d1) / 86400000   // 74
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- \`new Date('2024-02-30')\` 這類無效日期，\`isNaN(d)\` 會回傳 \`true\`。
- \`Date.now()\` 回傳的是**數字**，不是 Date 物件；若需要 Date 物件，用 \`new Date(Date.now())\`。
- 兩個 Date 物件相減，得到的是**毫秒差**（number），除以 86400000 即可轉換成天數。
- 日期字串解析行為因瀏覽器而異，建議使用 ISO 8601 格式（\`YYYY-MM-DD\`）以確保一致性。`,
        },
      ],
    },
    keyPoints: [
      'new Date() 建立的是一個 Date 物件，可以用 instanceof Date 驗證型別，用 isNaN 判斷是否為有效日期。',
      'Date.now() 回傳當前時間的毫秒時間戳，型別是 number，與 new Date().getTime() 的回傳值相同。',
      '兩個 Date 物件相減會自動轉換為毫秒數，除以 86400000（24 * 60 * 60 * 1000）即可得到天數差。',
      '解析日期字串時，建議使用 ISO 8601 格式 YYYY-MM-DD，可以確保跨瀏覽器行為一致。',
      '無效的日期字串（如 "abc"）建立的 Date 物件，isNaN(d) 會回傳 true，可用來做輸入驗證。',
    ],
    problems: [
      {
        id: 'basic',
        title: '建立與驗證日期物件',
        difficulty: 'easy',
        description: `請建立一個固定日期物件，並驗證其有效性。

步驟：
1. 使用 \`new Date('2024-03-15')\` 建立日期物件，存到 \`d\`。
2. 將 \`d instanceof Date\` 的結果存到 \`isDateObj\`（boolean）。
3. 將 \`isNaN(d)\` 的結果存到 \`isInvalid\`（boolean）。`,
        examples: [
          {
            input: `new Date('2024-03-15')`,
            output: `isDateObj === true，isInvalid === false`,
            note: '有效日期的 isNaN 應為 false',
          },
        ],
        initialCode: `// TODO: 用 new Date('2024-03-15') 建立日期物件，存到 d
let d

// TODO: 用 instanceof Date 確認是否為 Date 物件，存到 isDateObj
let isDateObj

// TODO: 用 isNaN(d) 確認是否為無效日期，存到 isInvalid
let isInvalid
`,
        testCases: [
          { label: 'd 應是 Date 物件', test: `return d instanceof Date` },
          { label: 'isDateObj 應為 true', test: `return isDateObj === true` },
          { label: 'isInvalid 應為 false（有效日期）', test: `return isInvalid === false` },
          {
            label: '無效日期字串的 isNaN 應為 true',
            test: `const bad = new Date('not-a-date'); return isNaN(bad) === true`,
          },
        ],
      },
      {
        id: 'timestamp',
        title: '取得毫秒時間戳',
        difficulty: 'easy',
        description: `時間戳是 Unix Epoch 以來的毫秒數，常用於計時與排序。

步驟：
1. 使用 \`new Date('2024-01-15').getTime()\` 取得固定日期的時間戳，存到 \`ts1\`。
2. 確認 \`ts1\` 的型別是 \`'number'\`，存到 \`isNumber\`（boolean）。
3. 確認 \`ts1\` 大於 \`0\`，存到 \`isPositive\`（boolean）。`,
        examples: [
          {
            input: `new Date('2024-01-15').getTime()`,
            output: `ts1 === 1705276800000，isNumber === true，isPositive === true`,
          },
        ],
        initialCode: `// TODO: 用 new Date('2024-01-15').getTime() 取得時間戳，存到 ts1
let ts1

// TODO: 確認 ts1 的型別是 'number'，存到 isNumber
let isNumber

// TODO: 確認 ts1 > 0，存到 isPositive
let isPositive
`,
        testCases: [
          { label: 'ts1 應是 number 型別', test: `return typeof ts1 === 'number'` },
          { label: 'isNumber 應為 true', test: `return isNumber === true` },
          { label: 'isPositive 應為 true', test: `return isPositive === true` },
          { label: 'ts1 應大於 0', test: `return ts1 > 0` },
          {
            label: 'getTime() 與直接相減結果型別相同',
            test: `const a = new Date('2024-01-15'); const b = new Date('2024-06-01'); return typeof (b - a) === 'number'`,
          },
        ],
      },
      {
        id: 'parse',
        title: '計算兩個日期之間相差幾天',
        difficulty: 'medium',
        description: `電商系統需要計算訂單從下單到預計到貨的天數差。

步驟：
1. 建立起始日期 \`start = new Date('2024-03-01')\`。
2. 建立結束日期 \`end = new Date('2024-03-16')\`。
3. 將兩者相減除以 \`86400000\` 取得天數差，存到 \`diffDays\`（number）。`,
        examples: [
          {
            input: `start = new Date('2024-03-01')，end = new Date('2024-03-16')`,
            output: `diffDays === 15`,
            note: '86400000 = 24 * 60 * 60 * 1000（一天的毫秒數）',
          },
        ],
        constraints: [
          '必須用時間戳相減的方式計算天數（不可直接寫數字 15）',
          '結果必須是 number 型別',
        ],
        initialCode: `// TODO: 建立起始日期 2024-03-01
let start

// TODO: 建立結束日期 2024-03-16
let end

// TODO: 計算兩個日期相差幾天（毫秒差除以 86400000），存到 diffDays
let diffDays
`,
        testCases: [
          { label: 'start 應是 Date 物件', test: `return start instanceof Date` },
          { label: 'end 應是 Date 物件', test: `return end instanceof Date` },
          { label: 'diffDays 應為 15', test: `return diffDays === 15` },
          { label: 'diffDays 應是 number 型別', test: `return typeof diffDays === 'number'` },
          {
            label: '其他日期組合也能正確計算',
            test: `const a = new Date('2024-01-01'); const b = new Date('2024-01-31'); return (b - a) / 86400000 === 30`,
          },
        ],
      },
    ],
  },

  // ─── date-year-month ──────────────────────────────────────────────────────
  {
    slug: 'date-year-month',
    methodName: 'getFullYear() / getMonth()',
    title: 'getFullYear() / getMonth()',
    description: '取得日期的年份與月份，特別注意 getMonth() 回傳的是 0-based 索引。',
    subCategory: '取得日期資訊',
    difficulty: 'easy',
    notes: {
      title: 'getFullYear() / getMonth()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`date.getFullYear()\` → 完整年份（例如 \`2024\`）
\`date.getMonth()\` → 月份索引，**0-based**（0 = 1月，11 = 12月）

常見月份對照：
| getMonth() | 實際月份 |
|-----------|---------|
| 0 | 1月 |
| 6 | **7月** |
| 11 | 12月 |`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const d = new Date('2024-07-15')

d.getFullYear()   // 2024
d.getMonth()      // 6（不是 7！）
d.getMonth() + 1  // 7（人類可讀的月份）

// 建立指定年月的日期（月份也是 0-based）
const july = new Date(2024, 6, 1)   // 2024年7月1日
july.getMonth()   // 6
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- \`getMonth()\` 回傳 \`0\` 到 \`11\`，**不是** \`1\` 到 \`12\`，這是最常見的月份陷阱。
- 若要顯示人類可讀的月份，永遠記得 \`getMonth() + 1\`。
- \`getYear()\` 已棄用，請一律使用 \`getFullYear()\`。
- \`new Date(year, month, day)\` 建立日期時，\`month\` 同樣是 0-based。`,
        },
      ],
    },
    keyPoints: [
      'getFullYear() 回傳完整的四位數年份，不要使用已棄用的 getYear()。',
      'getMonth() 回傳 0 到 11，0 代表 1 月，11 代表 12 月，這是 JavaScript Date 最著名的陷阱之一。',
      '若要得到人類可讀的月份數字（1-12），必須在 getMonth() 的結果上加 1。',
      '用 new Date(year, month, day) 建立日期時，month 參數同樣是 0-based，7 月要傳入 6。',
      'getFullYear() 和 getMonth() 回傳的都是本地時間，若需要 UTC 時間，改用 getUTCFullYear() 和 getUTCMonth()。',
    ],
    problems: [
      {
        id: 'basic',
        title: '從日期物件取得年份與月份',
        difficulty: 'easy',
        description: `請從固定日期取得年份與月份索引，並理解 0-based 的設計。

步驟：
1. 從 \`new Date('2024-07-15')\` 取得年份，存到 \`year\`。
2. 取得月份索引（0-based），存到 \`monthIndex\`。
3. 計算人類可讀的月份（1-based），存到 \`monthHuman\`。`,
        examples: [
          {
            input: `new Date('2024-07-15')`,
            output: `year === 2024，monthIndex === 6，monthHuman === 7`,
            note: '7月在 getMonth() 中是 6，因為從 0 開始計算',
          },
        ],
        initialCode: `const d = new Date('2024-07-15')

// TODO: 取得年份，存到 year
let year

// TODO: 取得月份索引（0-based），存到 monthIndex
let monthIndex

// TODO: 計算人類可讀的月份（monthIndex + 1），存到 monthHuman
let monthHuman
`,
        testCases: [
          { label: 'year 應為 2024', test: `return year === 2024` },
          { label: 'monthIndex 應為 6（7月的 0-based 索引）', test: `return monthIndex === 6` },
          { label: 'monthHuman 應為 7', test: `return monthHuman === 7` },
          {
            label: '12月的 monthIndex 應為 11',
            test: `const dec = new Date('2024-12-25'); return dec.getMonth() === 11`,
          },
        ],
      },
      {
        id: 'trap',
        title: '月份陷阱：正確顯示月份數字',
        difficulty: 'easy',
        description: `系統需要將日期格式化成「YYYY年MM月」的形式。

請完成 \`formatYearMonth\` 函式，接收一個 Date 物件，
回傳格式為 \`'2024年3月'\` 的字串（月份使用人類可讀的 1-based 數字）。`,
        examples: [
          {
            input: `new Date('2024-03-15')`,
            output: `'2024年3月'`,
          },
          {
            input: `new Date('2024-12-01')`,
            output: `'2024年12月'`,
          },
        ],
        initialCode: `function formatYearMonth(date) {
  // TODO: 取得年份
  const year = date.getFullYear()

  // TODO: 取得人類可讀的月份（記得 +1）
  let month

  // TODO: 回傳 'YYYY年M月' 格式的字串
}
`,
        testCases: [
          {
            label: '2024-03-15 應回傳 "2024年3月"',
            test: `return formatYearMonth(new Date('2024-03-15')) === '2024年3月'`,
          },
          {
            label: '2024-12-01 應回傳 "2024年12月"',
            test: `return formatYearMonth(new Date('2024-12-01')) === '2024年12月'`,
          },
          {
            label: '2024-01-20 應回傳 "2024年1月"',
            test: `return formatYearMonth(new Date('2024-01-20')) === '2024年1月'`,
          },
          {
            label: '回傳值應為 string 型別',
            test: `return typeof formatYearMonth(new Date('2024-07-15')) === 'string'`,
          },
        ],
      },
      {
        id: 'birthday',
        title: '計算今年生日是第幾天',
        difficulty: 'medium',
        description: `請計算給定的生日（月份和日期）在 2024 年是一年中的第幾天。

步驟：
1. 建立目標日期 \`birthday = new Date(2024, 2, 20)\`（2024年3月20日，注意月份 0-based）。
2. 建立當年 1 月 1 日 \`yearStart = new Date(2024, 0, 1)\`。
3. 計算 \`birthday\` 距離 \`yearStart\` 相差幾天（時間戳相減除以 86400000），再加 1，存到 \`dayOfYear\`。`,
        examples: [
          {
            input: `2024年3月20日`,
            output: `dayOfYear === 80`,
            note: '2024 年是閏年，1月31天、2月29天，所以3月20日是第 31+29+20=80 天',
          },
        ],
        constraints: [
          '必須使用 new Date(year, month, day) 建立日期（month 為 0-based）',
          '用時間戳相減除以 86400000 計算天數差',
        ],
        initialCode: `// TODO: 建立 2024年3月20日（注意 month 是 0-based，3月傳 2）
let birthday

// TODO: 建立 2024年1月1日（yearStart）
let yearStart

// TODO: 計算相差天數並加 1，存到 dayOfYear
let dayOfYear
`,
        testCases: [
          { label: 'birthday 應是 Date 物件', test: `return birthday instanceof Date` },
          { label: 'yearStart 應是 Date 物件', test: `return yearStart instanceof Date` },
          { label: 'dayOfYear 應為 80', test: `return dayOfYear === 80` },
          {
            label: '2024年1月1日應是第 1 天',
            test: `const bd = new Date(2024, 0, 1); const ys = new Date(2024, 0, 1); return (bd - ys) / 86400000 + 1 === 1`,
          },
          {
            label: '2024年12月31日應是第 366 天（閏年）',
            test: `const bd = new Date(2024, 11, 31); const ys = new Date(2024, 0, 1); return (bd - ys) / 86400000 + 1 === 366`,
          },
        ],
      },
    ],
  },

  // ─── date-date-day ────────────────────────────────────────────────────────
  {
    slug: 'date-date-day',
    methodName: 'getDate() / getDay()',
    title: 'getDate() / getDay()',
    description: '取得當月日期（幾號）和星期幾，特別注意 getDay() 0 代表星期日。',
    subCategory: '取得日期資訊',
    difficulty: 'easy',
    notes: {
      title: 'getDate() / getDay()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`date.getDate()\` → 當月幾號（1 到 31）
\`date.getDay()\` → 星期幾（0 到 6，**0 = 週日**）

星期對照表：
| getDay() | 中文 |
|---------|------|
| 0 | 週日 |
| 1 | 週一 |
| 2 | 週二 |
| 3 | 週三 |
| 4 | 週四 |
| 5 | 週五 |
| 6 | 週六 |`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const d = new Date('2024-07-15')  // 2024年7月15日，星期一

d.getDate()   // 15
d.getDay()    // 1（週一）

// 用陣列映射星期
const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六']
weekdays[d.getDay()]   // '週一'

// 判斷是否為工作日
const day = d.getDay()
const isWorkday = day !== 0 && day !== 6   // true
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- \`getDate()\` 回傳 1-based 的日期（幾號），與 \`getMonth()\` 的 0-based 不同，容易混淆。
- \`getDay()\` 回傳 0 到 6，**0 是週日**，不是週一，這是另一個常見陷阱。
- 判斷工作日：\`getDay() !== 0 && getDay() !== 6\`（排除週日 0 和週六 6）。
- 若要顯示中文星期，用 \`['週日','週一','週二','週三','週四','週五','週六'][d.getDay()]\` 的陣列映射方式最簡潔。`,
        },
      ],
    },
    keyPoints: [
      'getDate() 回傳當月幾號，範圍是 1 到 31，是 1-based 的（與 getMonth() 的 0-based 不同）。',
      'getDay() 回傳星期幾，範圍是 0 到 6，而且 0 代表週日，不是週一，這是常見的混淆點。',
      '中文星期名稱映射最佳實踐：建立陣列 ["週日","週一",...,"週六"]，用 getDay() 作為索引取值。',
      '判斷工作日的條件：getDay() !== 0（非週日）且 getDay() !== 6（非週六）。',
      'getDate() 和 getDay() 都是基於本地時間，若需要 UTC，改用 getUTCDate() 和 getUTCDay()。',
    ],
    problems: [
      {
        id: 'basic',
        title: '取得幾號與星期幾',
        difficulty: 'easy',
        description: `請從固定日期取得「幾號」和「星期幾」的數字。

步驟：
1. 從 \`new Date('2024-07-15')\` 取得當月日期（幾號），存到 \`dateNum\`。
2. 取得星期幾的數字（0-6），存到 \`dayNum\`。`,
        examples: [
          {
            input: `new Date('2024-07-15')`,
            output: `dateNum === 15，dayNum === 1`,
            note: '2024年7月15日是星期一，getDay() 回傳 1',
          },
        ],
        initialCode: `const d = new Date('2024-07-15')

// TODO: 取得當月幾號，存到 dateNum
let dateNum

// TODO: 取得星期幾（0=週日, 1=週一, ...），存到 dayNum
let dayNum
`,
        testCases: [
          { label: 'dateNum 應為 15', test: `return dateNum === 15` },
          { label: 'dayNum 應為 1（週一）', test: `return dayNum === 1` },
          {
            label: '2024-07-14（週日）的 dayNum 應為 0',
            test: `const sun = new Date('2024-07-14'); return sun.getDay() === 0`,
          },
          {
            label: '2024-07-20（週六）的 dayNum 應為 6',
            test: `const sat = new Date('2024-07-20'); return sat.getDay() === 6`,
          },
        ],
      },
      {
        id: 'weekday',
        title: '星期幾轉中文名稱',
        difficulty: 'easy',
        description: `行事曆應用需要將日期顯示成「週一」、「週日」等中文格式。

請完成 \`getWeekdayName\` 函式，接收一個 Date 物件，
回傳對應的中文星期名稱（從 \`'週日'\` 到 \`'週六'\`）。

提示：用陣列 \`['週日','週一','週二','週三','週四','週五','週六']\` 搭配 \`getDay()\` 取值。`,
        examples: [
          {
            input: `new Date('2024-07-15')`,
            output: `'週一'`,
          },
          {
            input: `new Date('2024-07-14')`,
            output: `'週日'`,
          },
        ],
        initialCode: `function getWeekdayName(date) {
  const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六']

  // TODO: 用 getDay() 取得索引，回傳對應的中文星期名稱
}
`,
        testCases: [
          {
            label: '2024-07-15（週一）應回傳 "週一"',
            test: `return getWeekdayName(new Date('2024-07-15')) === '週一'`,
          },
          {
            label: '2024-07-14（週日）應回傳 "週日"',
            test: `return getWeekdayName(new Date('2024-07-14')) === '週日'`,
          },
          {
            label: '2024-07-20（週六）應回傳 "週六"',
            test: `return getWeekdayName(new Date('2024-07-20')) === '週六'`,
          },
          {
            label: '回傳值應為 string 型別',
            test: `return typeof getWeekdayName(new Date('2024-07-15')) === 'string'`,
          },
          {
            label: '2024-07-19（週五）應回傳 "週五"',
            test: `return getWeekdayName(new Date('2024-07-19')) === '週五'`,
          },
        ],
      },
      {
        id: 'workday',
        title: '判斷是否為工作日',
        difficulty: 'medium',
        description: `排班系統需要判斷指定日期是否為工作日（週一到週五）。

請完成 \`isWorkday\` 函式，接收一個 Date 物件，
回傳 \`true\`（工作日）或 \`false\`（週末）。

規則：\`getDay()\` 回傳 \`0\`（週日）或 \`6\`（週六）時為週末，其餘為工作日。`,
        examples: [
          {
            input: `new Date('2024-07-15')（週一）`,
            output: `true`,
          },
          {
            input: `new Date('2024-07-14')（週日）`,
            output: `false`,
          },
          {
            input: `new Date('2024-07-20')（週六）`,
            output: `false`,
          },
        ],
        constraints: [
          '必須使用 getDay() 進行判斷',
          '回傳值必須是 boolean',
        ],
        initialCode: `function isWorkday(date) {
  // TODO: 用 getDay() 取得星期幾（0=週日, 6=週六 為週末）
  // TODO: 回傳 true（工作日）或 false（週末）
}
`,
        testCases: [
          {
            label: '2024-07-15（週一）應回傳 true',
            test: `return isWorkday(new Date('2024-07-15')) === true`,
          },
          {
            label: '2024-07-14（週日）應回傳 false',
            test: `return isWorkday(new Date('2024-07-14')) === false`,
          },
          {
            label: '2024-07-20（週六）應回傳 false',
            test: `return isWorkday(new Date('2024-07-20')) === false`,
          },
          {
            label: '2024-07-19（週五）應回傳 true',
            test: `return isWorkday(new Date('2024-07-19')) === true`,
          },
          {
            label: '回傳值應為 boolean 型別',
            test: `return typeof isWorkday(new Date('2024-07-15')) === 'boolean'`,
          },
        ],
      },
    ],
  },

  // ─── date-time ────────────────────────────────────────────────────────────
  {
    slug: 'date-time',
    methodName: 'getHours() / getMinutes() / getSeconds()',
    title: 'getHours() / getMinutes() / getSeconds()',
    description: '取得日期物件的小時、分鐘、秒數，常用於時間格式化與時段判斷。',
    subCategory: '取得時間資訊',
    difficulty: 'easy',
    notes: {
      title: 'getHours() / getMinutes() / getSeconds()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`date.getHours()\` → 小時（0 到 23）
\`date.getMinutes()\` → 分鐘（0 到 59）
\`date.getSeconds()\` → 秒數（0 到 59）
\`date.getMilliseconds()\` → 毫秒（0 到 999）

使用 ISO 8601 格式建立含時間的日期：
\`new Date('2024-01-15T14:30:45')\``,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const d = new Date('2024-01-15T14:30:45')

d.getHours()     // 14
d.getMinutes()   // 30
d.getSeconds()   // 45

// 格式化成 HH:MM:SS
const h = String(d.getHours()).padStart(2, '0')    // '14'
const m = String(d.getMinutes()).padStart(2, '0')  // '30'
const s = String(d.getSeconds()).padStart(2, '0')  // '45'
const timeStr = \`\${h}:\${m}:\${s}\`                  // '14:30:45'

// 判斷時段
const hour = d.getHours()
if (hour >= 6 && hour < 12)       console.log('早上')
else if (hour >= 12 && hour < 18) console.log('下午')
else if (hour >= 18 && hour < 22) console.log('晚上')
else                               console.log('深夜')
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- 三個方法回傳的都是**數字**，格式化時需要轉成字串並用 \`padStart(2, '0')\` 補零。
- 小時使用 24 小時制（0-23），14 代表下午 2 點。
- 這些方法都是基於**本地時間**，若需要 UTC，改用 \`getUTCHours()\` 等。
- 建立含時間的日期字串時，用 ISO 8601 格式：\`'YYYY-MM-DDTHH:MM:SS'\`。`,
        },
      ],
    },
    keyPoints: [
      'getHours() 回傳 0 到 23 的小時數（24 小時制），getMinutes() 回傳 0 到 59，getSeconds() 同樣 0 到 59。',
      '格式化時間時，要用 String(...).padStart(2, "0") 在個位數前面補零，確保輸出如 "09:05:03"。',
      '判斷時段可以用 getHours() 搭配範圍條件，例如 0-5 深夜、6-11 早上、12-17 下午、18-23 晚上。',
      '建立含時間的 Date 物件，使用 ISO 8601 格式："YYYY-MM-DDTHH:MM:SS"。',
      '所有取得時間的方法都基於本地時區，若需要 UTC 時間，使用對應的 getUTCHours()、getUTCMinutes() 等方法。',
    ],
    problems: [
      {
        id: 'basic',
        title: '從日期物件取得時、分、秒',
        difficulty: 'easy',
        description: `請從固定日期時間取得小時、分鐘、秒數。

步驟：
1. 從 \`new Date('2024-01-15T14:30:45')\` 取得小時，存到 \`hours\`。
2. 取得分鐘，存到 \`minutes\`。
3. 取得秒數，存到 \`seconds\`。`,
        examples: [
          {
            input: `new Date('2024-01-15T14:30:45')`,
            output: `hours === 14，minutes === 30，seconds === 45`,
          },
        ],
        initialCode: `const d = new Date('2024-01-15T14:30:45')

// TODO: 取得小時（24小時制），存到 hours
let hours

// TODO: 取得分鐘，存到 minutes
let minutes

// TODO: 取得秒數，存到 seconds
let seconds
`,
        testCases: [
          { label: 'hours 應為 14', test: `return hours === 14` },
          { label: 'minutes 應為 30', test: `return minutes === 30` },
          { label: 'seconds 應為 45', test: `return seconds === 45` },
          {
            label: '凌晨 00:05:03 的小時應為 0',
            test: `const d2 = new Date('2024-01-15T00:05:03'); return d2.getHours() === 0`,
          },
        ],
      },
      {
        id: 'format',
        title: '格式化時間為 HH:MM:SS',
        difficulty: 'easy',
        description: `計時器元件需要將時間格式化成補零的 "HH:MM:SS" 格式。

請完成 \`formatTime\` 函式，接收一個 Date 物件，
回傳 \`'HH:MM:SS'\` 格式的字串，個位數需要補零。

提示：使用 \`String(n).padStart(2, '0')\` 補零。`,
        examples: [
          {
            input: `new Date('2024-01-15T14:30:45')`,
            output: `'14:30:45'`,
          },
          {
            input: `new Date('2024-01-15T09:05:03')`,
            output: `'09:05:03'`,
            note: '個位數小時、分鐘、秒數都需要補零',
          },
        ],
        initialCode: `function formatTime(date) {
  // TODO: 取得小時、分鐘、秒數，並用 padStart(2, '0') 補零
  const h = String(date.getHours()).padStart(2, '0')
  let m
  let s

  // TODO: 回傳 'HH:MM:SS' 格式的字串
}
`,
        testCases: [
          {
            label: '14:30:45 應回傳 "14:30:45"',
            test: `return formatTime(new Date('2024-01-15T14:30:45')) === '14:30:45'`,
          },
          {
            label: '09:05:03 應回傳 "09:05:03"（有補零）',
            test: `return formatTime(new Date('2024-01-15T09:05:03')) === '09:05:03'`,
          },
          {
            label: '00:00:00 應回傳 "00:00:00"',
            test: `return formatTime(new Date('2024-01-15T00:00:00')) === '00:00:00'`,
          },
          {
            label: '回傳值長度應為 8（HH:MM:SS）',
            test: `return formatTime(new Date('2024-01-15T14:30:45')).length === 8`,
          },
        ],
      },
      {
        id: 'period',
        title: '根據小時判斷時段',
        difficulty: 'medium',
        description: `智慧家居系統需要根據當前時間判斷時段，以調整燈光和溫度。

請完成 \`getTimePeriod\` 函式，接收一個 Date 物件，
依照 \`getHours()\` 回傳以下分類：

| 小時範圍 | 時段 |
|---------|------|
| 0 到 5 | \`'深夜'\` |
| 6 到 11 | \`'早上'\` |
| 12 到 17 | \`'下午'\` |
| 18 到 23 | \`'晚上'\` |`,
        examples: [
          {
            input: `new Date('2024-01-15T14:30:00')`,
            output: `'下午'`,
          },
          {
            input: `new Date('2024-01-15T03:00:00')`,
            output: `'深夜'`,
          },
          {
            input: `new Date('2024-01-15T08:00:00')`,
            output: `'早上'`,
          },
          {
            input: `new Date('2024-01-15T20:00:00')`,
            output: `'晚上'`,
          },
        ],
        constraints: [
          '必須使用 getHours() 進行判斷',
          '回傳值必須是 string',
        ],
        initialCode: `function getTimePeriod(date) {
  // TODO: 用 getHours() 取得小時
  const hour = date.getHours()

  // TODO: 依範圍回傳 '深夜'（0-5）、'早上'（6-11）、'下午'（12-17）、'晚上'（18-23）
}
`,
        testCases: [
          {
            label: '14:30（小時 14）應回傳 "下午"',
            test: `return getTimePeriod(new Date('2024-01-15T14:30:00')) === '下午'`,
          },
          {
            label: '03:00（小時 3）應回傳 "深夜"',
            test: `return getTimePeriod(new Date('2024-01-15T03:00:00')) === '深夜'`,
          },
          {
            label: '08:00（小時 8）應回傳 "早上"',
            test: `return getTimePeriod(new Date('2024-01-15T08:00:00')) === '早上'`,
          },
          {
            label: '20:00（小時 20）應回傳 "晚上"',
            test: `return getTimePeriod(new Date('2024-01-15T20:00:00')) === '晚上'`,
          },
          {
            label: '00:00（小時 0）應回傳 "深夜"',
            test: `return getTimePeriod(new Date('2024-01-15T00:00:00')) === '深夜'`,
          },
          {
            label: '回傳值應為 string 型別',
            test: `return typeof getTimePeriod(new Date('2024-01-15T14:30:00')) === 'string'`,
          },
        ],
      },
    ],
  },
]
