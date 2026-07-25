import type { MethodEntry } from './array-challenges'

export const dataOpsPart3: MethodEntry[] = [
  // ─── 1. 分組聚合 ──────────────────────────────────────────────────
  {
    slug: 'group-stats',
    methodName: '分組聚合',
    title: '分組聚合統計',
    description: '將資料依特定欄位分組，計算每組的統計指標',
    subCategory: '資料聚合與統計',
    difficulty: 'medium',
    notes: {
      title: '分組聚合統計',
      sections: [
        {
          heading: 'groupBy 基礎實作',
          content: `最常見的分組方式是用 \`reduce\` 搭配物件累計：

\`\`\`js
const grouped = data.reduce((acc, item) => {
  const key = item.groupField
  if (!acc[key]) acc[key] = []
  acc[key].push(item)
  return acc
}, {})
\`\`\`

也可以用 \`Map\` 取代純物件，當 key 不一定是字串時更安全。`,
        },
        {
          heading: 'reduce 技巧：一次計算多項統計',
          content: `在 reduce 累計時同步更新統計，避免二次迭代：

\`\`\`js
const stats = data.reduce((acc, item) => {
  const key = item.dept
  if (!acc[key]) acc[key] = { total: 0, count: 0, min: Infinity, max: -Infinity }
  acc[key].total += item.salary
  acc[key].count++
  acc[key].min = Math.min(acc[key].min, item.salary)
  acc[key].max = Math.max(acc[key].max, item.salary)
  return acc
}, {})
// 最後補算平均
Object.values(stats).forEach(s => { s.avg = s.total / s.count })
\`\`\``,
        },
        {
          heading: '多層巢狀分組',
          content: `多層分組就是在第一層 group 的每個 bucket 內再做一次 groupBy：

\`\`\`js
const nested = data.reduce((acc, item) => {
  if (!acc[item.dept]) acc[item.dept] = {}
  if (!acc[item.dept][item.role]) acc[item.dept][item.role] = []
  acc[item.dept][item.role].push(item)
  return acc
}, {})
\`\`\``,
        },
        {
          heading: '效能注意事項',
          content: `- 分組完再計算統計（兩次迭代）vs 邊分組邊統計（一次迭代）：資料量大時後者更佳
- 若 key 非常多，考慮用 \`Map\` 以避免 prototype 污染
- 樞紐表轉換本質上是特殊的分組，先分組再將子陣列壓平為物件`,
        },
      ],
    },
    keyPoints: [
      '分組聚合最常用 reduce 搭配物件作為累計器，每次迭代檢查 key 是否存在，不存在則初始化再 push。',
      '一次 reduce 中同步計算 total、count、min、max，最後再用 forEach 補算 avg，可避免多次迭代提升效能。',
      '多層分組就是遞迴地在每個 bucket 內再執行一次 groupBy，巢狀結構可以用連續的 if(!acc[k1]) acc[k1]={} 來建立。',
      '樞紐表（Pivot）是分組的一種特例：先以某欄位分組，再將子陣列的另一欄位壓平成物件的 key，值為對應數值。',
      '資料量大時建議邊分組邊統計（單次 reduce），而非先分組再二次迭代，可將時間複雜度維持在 O(n)。',
    ],
    problems: [
      {
        id: 'group-by-month-raw',
        title: '依月份分組回傳原始訂單',
        difficulty: 'easy',
        description: `將 \`orders\` 依 \`month\` 欄位分組，回傳 \`{ [month]: order[] }\` 結構，存到 \`result\`。`,
        examples: [
          {
            input: `orders = [{ month: '2024-01', amount: 100 }, { month: '2024-01', amount: 200 }, { month: '2024-02', amount: 150 }]`,
            output: `{ '2024-01': [{...}, {...}], '2024-02': [{...}] }`,
          },
        ],
        initialCode: `const orders = [
  { month: '2024-01', amount: 100 },
  { month: '2024-01', amount: 200 },
  { month: '2024-02', amount: 150 },
  { month: '2024-02', amount: 50 },
  { month: '2024-03', amount: 300 },
]

// 請將 orders 依 month 分組，結果存到 result
let result
`,
        testCases: [
          { label: 'result 應有 3 個月份', test: `return Object.keys(result).length === 3` },
          { label: '2024-01 應有 2 筆訂單', test: `return Array.isArray(result['2024-01']) && result['2024-01'].length === 2` },
          { label: '2024-02 應有 2 筆訂單', test: `return Array.isArray(result['2024-02']) && result['2024-02'].length === 2` },
          { label: '2024-03 應有 1 筆訂單', test: `return Array.isArray(result['2024-03']) && result['2024-03'].length === 1` },
        ],
      },
      {
        id: 'group-by-month-stats',
        title: '依月份分組並計算統計',
        difficulty: 'easy',
        description: `將 \`orders\` 依 \`month\` 分組，每組只回傳 \`{ month, total, count }\` 統計物件，存到 \`result\`（\`{ [month]: { month, total, count } }\`）。`,
        examples: [
          {
            input: `[{ month: '2024-01', amount: 100 }, { month: '2024-01', amount: 200 }]`,
            output: `{ '2024-01': { month: '2024-01', total: 300, count: 2 } }`,
          },
        ],
        initialCode: `const orders = [
  { month: '2024-01', amount: 100 },
  { month: '2024-01', amount: 200 },
  { month: '2024-02', amount: 150 },
  { month: '2024-02', amount: 50 },
  { month: '2024-03', amount: 300 },
]

// 請依月份分組計算統計，結果存到 result
let result
`,
        testCases: [
          { label: 'result 應有 3 個月份', test: `return Object.keys(result).length === 3` },
          { label: '2024-01 的 total 應為 300', test: `return result['2024-01'] && result['2024-01'].total === 300` },
          { label: '2024-01 的 count 應為 2', test: `return result['2024-01'] && result['2024-01'].count === 2` },
          { label: '2024-02 的 total 應為 200', test: `return result['2024-02'] && result['2024-02'].total === 200` },
          { label: '2024-03 的 total 應為 300', test: `return result['2024-03'] && result['2024-03'].total === 300` },
        ],
      },
      {
        id: 'group-employees-dept',
        title: '部門分組薪資統計',
        difficulty: 'medium',
        description: `將 \`employees\` 依 \`department\` 分組，每組計算 \`{ avgSalary, minSalary, maxSalary, count }\`，存到 \`result\`。`,
        examples: [
          {
            input: `[{ name: 'A', department: 'RD', salary: 60000 }, { name: 'B', department: 'RD', salary: 80000 }]`,
            output: `{ RD: { avgSalary: 70000, minSalary: 60000, maxSalary: 80000, count: 2 } }`,
          },
        ],
        initialCode: `const employees = [
  { name: 'Alice', department: 'RD', salary: 60000 },
  { name: 'Bob', department: 'RD', salary: 80000 },
  { name: 'Carol', department: 'HR', salary: 50000 },
  { name: 'Dave', department: 'HR', salary: 55000 },
  { name: 'Eve', department: 'RD', salary: 70000 },
]

// 請依部門分組計算薪資統計，結果存到 result
let result
`,
        testCases: [
          { label: 'result 應有 RD 和 HR 兩個部門', test: `return result && result['RD'] && result['HR']` },
          { label: 'RD 的 count 應為 3', test: `return result['RD'].count === 3` },
          { label: 'RD 的 avgSalary 應為 70000', test: `return result['RD'].avgSalary === 70000` },
          { label: 'RD 的 minSalary 應為 60000', test: `return result['RD'].minSalary === 60000` },
          { label: 'RD 的 maxSalary 應為 80000', test: `return result['RD'].maxSalary === 80000` },
          { label: 'HR 的 avgSalary 應為 52500', test: `return result['HR'].avgSalary === 52500` },
        ],
      },
      {
        id: 'nested-group',
        title: '多層巢狀分組',
        difficulty: 'medium',
        description: `將 \`employees\` 先依 \`department\` 再依 \`role\` 分組，回傳巢狀結構 \`{ [dept]: { [role]: employee[] } }\`，存到 \`result\`。`,
        examples: [
          {
            input: `[{ name: 'A', department: 'RD', role: 'engineer' }, { name: 'B', department: 'RD', role: 'manager' }]`,
            output: `{ RD: { engineer: [{...}], manager: [{...}] } }`,
          },
        ],
        initialCode: `const employees = [
  { name: 'Alice', department: 'RD', role: 'engineer' },
  { name: 'Bob', department: 'RD', role: 'manager' },
  { name: 'Carol', department: 'HR', role: 'recruiter' },
  { name: 'Dave', department: 'HR', role: 'manager' },
  { name: 'Eve', department: 'RD', role: 'engineer' },
]

// 請先依 department 再依 role 分組，結果存到 result
let result
`,
        testCases: [
          { label: 'result.RD.engineer 應有 2 人', test: `return Array.isArray(result['RD']['engineer']) && result['RD']['engineer'].length === 2` },
          { label: 'result.RD.manager 應有 1 人', test: `return Array.isArray(result['RD']['manager']) && result['RD']['manager'].length === 1` },
          { label: 'result.HR.recruiter 應有 1 人', test: `return Array.isArray(result['HR']['recruiter']) && result['HR']['recruiter'].length === 1` },
          { label: 'result.HR.manager 應有 1 人', test: `return Array.isArray(result['HR']['manager']) && result['HR']['manager'].length === 1` },
        ],
      },
      {
        id: 'pivot-table',
        title: '樞紐表（Pivot Table）',
        difficulty: 'hard',
        description: `將 \`salesData\`（\`[{ category, month, revenue }]\`）轉成樞紐表格式：\`{ [category]: { [month]: revenue } }\`，存到 \`result\`。`,
        examples: [
          {
            input: `[{ category: 'A', month: '2024-01', revenue: 100 }, { category: 'A', month: '2024-02', revenue: 200 }]`,
            output: `{ A: { '2024-01': 100, '2024-02': 200 } }`,
          },
        ],
        initialCode: `const salesData = [
  { category: 'Electronics', month: '2024-01', revenue: 50000 },
  { category: 'Electronics', month: '2024-02', revenue: 62000 },
  { category: 'Clothing', month: '2024-01', revenue: 30000 },
  { category: 'Clothing', month: '2024-02', revenue: 28000 },
  { category: 'Books', month: '2024-01', revenue: 12000 },
]

// 請將 salesData 轉成樞紐表，結果存到 result
let result
`,
        testCases: [
          { label: 'result 應有 Electronics、Clothing、Books 三個分類', test: `return result && result['Electronics'] && result['Clothing'] && result['Books']` },
          { label: 'Electronics 的 2024-01 revenue 應為 50000', test: `return result['Electronics']['2024-01'] === 50000` },
          { label: 'Electronics 的 2024-02 revenue 應為 62000', test: `return result['Electronics']['2024-02'] === 62000` },
          { label: 'Clothing 的 2024-01 revenue 應為 30000', test: `return result['Clothing']['2024-01'] === 30000` },
          { label: 'Books 只有 2024-01 一個月份', test: `return Object.keys(result['Books']).length === 1` },
        ],
      },
    ],
  },

  // ─── 2. 頻率統計 ──────────────────────────────────────────────────
  {
    slug: 'frequency-count',
    methodName: '頻率統計',
    title: '頻率統計與排行分析',
    description: '計算元素出現頻率，找出最常見或最罕見的項目',
    subCategory: '資料聚合與統計',
    difficulty: 'easy',
    notes: {
      title: '頻率統計與排行分析',
      sections: [
        {
          heading: '基礎頻率統計',
          content: `用 \`reduce\` 建立頻率 Map 是最直覺的做法：

\`\`\`js
const freq = words.reduce((acc, word) => {
  acc[word] = (acc[word] || 0) + 1
  return acc
}, {})
\`\`\`

也可以用 \`Map\` 版本：
\`\`\`js
const freq = new Map()
words.forEach(w => freq.set(w, (freq.get(w) || 0) + 1))
\`\`\``,
        },
        {
          heading: '找出 Top-N 元素',
          content: `將頻率物件轉成陣列後排序，再取前 N 個：

\`\`\`js
const topN = Object.entries(freq)
  .sort(([a, ca], [b, cb]) => cb - ca || a.localeCompare(b))
  .slice(0, N)
  .map(([word]) => word)
\`\`\`

同次數時依字母排序，使用 \`localeCompare\` 進行字串比較。`,
        },
        {
          heading: '巢狀頻率：tags 統計',
          content: `當資料欄位本身是陣列（如 tags）時，需先展開再計算：

\`\`\`js
const tagFreq = articles.reduce((acc, article) => {
  article.tags.forEach(tag => {
    acc[tag] = (acc[tag] || 0) + 1
  })
  return acc
}, {})
\`\`\``,
        },
        {
          heading: '多維度頻率統計',
          content: `同時統計數量和金額時，累計器存物件而非純數字：

\`\`\`js
const stats = orders.reduce((acc, order) => {
  if (!acc[order.productId]) {
    acc[order.productId] = { qty: 0, revenue: 0 }
  }
  acc[order.productId].qty += order.quantity
  acc[order.productId].revenue += order.quantity * order.price
  return acc
}, {})
\`\`\``,
        },
      ],
    },
    keyPoints: [
      '頻率統計的標準寫法是用 reduce，累計器初始化為空物件，每次迭代執行 acc[key] = (acc[key] || 0) + 1。',
      '當資料欄位本身是陣列（如 tags）時，需在 reduce 內部再加一層 forEach 來逐一累計每個子元素。',
      '找 Top-N 元素：先將頻率物件用 Object.entries() 轉成陣列，再 sort 排序（次數降序、同次數字母升序），最後 slice(0, N)。',
      '同次數的穩定排序可用 localeCompare 對 key 做次要排序，確保結果具有決定性（deterministic）。',
      '需要同時統計數量和金額等多個維度時，累計器的 value 改為物件，一次 reduce 即可完成所有計算。',
    ],
    problems: [
      {
        id: 'word-count',
        title: '字串陣列出現次數統計',
        difficulty: 'easy',
        description: `計算 \`words\` 中每個字的出現次數，回傳 \`{ [word]: count }\`，存到 \`result\`。`,
        examples: [
          {
            input: `['apple', 'banana', 'apple', 'cherry', 'banana', 'apple']`,
            output: `{ apple: 3, banana: 2, cherry: 1 }`,
          },
        ],
        initialCode: `const words = ['apple', 'banana', 'apple', 'cherry', 'banana', 'apple', 'date', 'cherry']

// 請計算每個字的出現次數，結果存到 result
let result
`,
        testCases: [
          { label: 'apple 出現 3 次', test: `return result['apple'] === 3` },
          { label: 'banana 出現 2 次', test: `return result['banana'] === 2` },
          { label: 'cherry 出現 2 次', test: `return result['cherry'] === 2` },
          { label: 'date 出現 1 次', test: `return result['date'] === 1` },
          { label: 'result 應有 4 個 key', test: `return Object.keys(result).length === 4` },
        ],
      },
      {
        id: 'tag-frequency',
        title: '文章 Tag 出現次數統計',
        difficulty: 'easy',
        description: `分析 \`articles\` 的 \`tags\` 陣列，統計每個 tag 出現在多少篇文章中，存到 \`result\`。`,
        examples: [
          {
            input: `[{ tags: ['js', 'react'] }, { tags: ['js', 'css'] }]`,
            output: `{ js: 2, react: 1, css: 1 }`,
          },
        ],
        initialCode: `const articles = [
  { id: 1, title: '文章一', tags: ['javascript', 'react'] },
  { id: 2, title: '文章二', tags: ['javascript', 'css', 'html'] },
  { id: 3, title: '文章三', tags: ['react', 'typescript'] },
  { id: 4, title: '文章四', tags: ['javascript', 'typescript'] },
  { id: 5, title: '文章五', tags: ['css'] },
]

// 請統計每個 tag 出現在多少篇文章中，結果存到 result
let result
`,
        testCases: [
          { label: 'javascript 應出現在 3 篇文章', test: `return result['javascript'] === 3` },
          { label: 'react 應出現在 2 篇文章', test: `return result['react'] === 2` },
          { label: 'typescript 應出現在 2 篇文章', test: `return result['typescript'] === 2` },
          { label: 'css 應出現在 2 篇文章', test: `return result['css'] === 2` },
          { label: 'html 應出現在 1 篇文章', test: `return result['html'] === 1` },
        ],
      },
      {
        id: 'top-n-elements',
        title: '找出出現最多的前 N 個元素',
        difficulty: 'medium',
        description: `計算 \`tags\` 的出現次數，找出出現最多的前 \`3\` 個 tag，同次數依字母升序排列，存到 \`result\`（字串陣列）。`,
        examples: [
          {
            input: `tags = ['js', 'css', 'js', 'react', 'css', 'js'], N = 2`,
            output: `['js', 'css']`,
          },
        ],
        initialCode: `const tags = [
  'javascript', 'react', 'javascript', 'css',
  'typescript', 'react', 'javascript', 'vue',
  'css', 'react', 'typescript', 'css',
]
const N = 3

// 請找出出現次數最多的前 N 個 tag，同次數依字母排序，結果存到 result
let result
`,
        testCases: [
          { label: 'result 應有 3 個元素', test: `return Array.isArray(result) && result.length === 3` },
          { label: '第一名應為 javascript（出現 3 次）', test: `return result[0] === 'javascript'` },
          { label: '第二名應為 css（出現 3 次，字母排序在 react 前）', test: `return result[1] === 'css'` },
          { label: '第三名應為 react（出現 3 次）', test: `return result[2] === 'react'` },
        ],
      },
      {
        id: 'product-sales-stats',
        title: '商品銷售量與營收統計',
        difficulty: 'medium',
        description: `統計 \`orders\` 中每個 \`productId\` 的總銷售量（\`totalQty\`）和總營收（\`totalRevenue\`），存到 \`result\`（\`{ [productId]: { totalQty, totalRevenue } }\`）。`,
        examples: [
          {
            input: `[{ productId: 'p1', quantity: 2, price: 100 }, { productId: 'p1', quantity: 1, price: 100 }]`,
            output: `{ p1: { totalQty: 3, totalRevenue: 300 } }`,
          },
        ],
        initialCode: `const orders = [
  { orderId: 1, productId: 'p1', quantity: 2, price: 100 },
  { orderId: 2, productId: 'p2', quantity: 1, price: 250 },
  { orderId: 3, productId: 'p1', quantity: 3, price: 100 },
  { orderId: 4, productId: 'p3', quantity: 5, price: 30 },
  { orderId: 5, productId: 'p2', quantity: 2, price: 250 },
]

// 請統計每個 productId 的總銷售量和總營收，結果存到 result
let result
`,
        testCases: [
          { label: 'p1 的 totalQty 應為 5', test: `return result['p1'] && result['p1'].totalQty === 5` },
          { label: 'p1 的 totalRevenue 應為 500', test: `return result['p1'] && result['p1'].totalRevenue === 500` },
          { label: 'p2 的 totalQty 應為 3', test: `return result['p2'] && result['p2'].totalQty === 3` },
          { label: 'p2 的 totalRevenue 應為 750', test: `return result['p2'] && result['p2'].totalRevenue === 750` },
          { label: 'p3 的 totalRevenue 應為 150', test: `return result['p3'] && result['p3'].totalRevenue === 150` },
        ],
      },
      {
        id: 'monthly-active-user',
        title: '每月最活躍使用者',
        difficulty: 'hard',
        description: `從 \`logins\`（\`[{ userId, date: 'YYYY-MM-DD' }]\`）計算每個使用者在不同月份的活躍天數（同一天算一天），找出每月活躍天數最多的使用者，存到 \`result\`（\`{ [month]: { userId, activeDays } }\`）。`,
        examples: [
          {
            input: `[{ userId: 'u1', date: '2024-01-01' }, { userId: 'u1', date: '2024-01-01' }, { userId: 'u2', date: '2024-01-02' }]`,
            output: `{ '2024-01': { userId: 'u1', activeDays: 1 } }（u1 和 u2 同為 1 天，取 userId 字母較小者）`,
          },
        ],
        initialCode: `const logins = [
  { userId: 'u1', date: '2024-01-01' },
  { userId: 'u1', date: '2024-01-02' },
  { userId: 'u1', date: '2024-01-02' },
  { userId: 'u2', date: '2024-01-03' },
  { userId: 'u2', date: '2024-01-04' },
  { userId: 'u2', date: '2024-01-05' },
  { userId: 'u1', date: '2024-02-01' },
  { userId: 'u2', date: '2024-02-01' },
  { userId: 'u2', date: '2024-02-02' },
]

// 請計算每月每使用者的活躍天數，找出每月最活躍的使用者，結果存到 result
let result
`,
        testCases: [
          { label: '2024-01 的最活躍使用者應為 u2', test: `return result['2024-01'] && result['2024-01'].userId === 'u2'` },
          { label: '2024-01 的 u2 活躍天數應為 3', test: `return result['2024-01'] && result['2024-01'].activeDays === 3` },
          { label: '2024-02 的最活躍使用者應為 u2', test: `return result['2024-02'] && result['2024-02'].userId === 'u2'` },
          { label: '2024-02 的 u2 活躍天數應為 2', test: `return result['2024-02'] && result['2024-02'].activeDays === 2` },
        ],
      },
    ],
  },

  // ─── 3. 資料摘要 ──────────────────────────────────────────────────
  {
    slug: 'data-summary',
    methodName: '資料摘要',
    title: '資料摘要計算',
    description: '從物件陣列計算各種統計摘要，包含平均、中位數、百分位數',
    subCategory: '資料聚合與統計',
    difficulty: 'medium',
    notes: {
      title: '資料摘要計算',
      sections: [
        {
          heading: '統計基礎：total、avg、min、max',
          content: `一次 \`reduce\` 即可同步計算所有基礎統計：

\`\`\`js
const summary = scores.reduce((acc, score) => {
  acc.total += score
  acc.count++
  acc.min = Math.min(acc.min, score)
  acc.max = Math.max(acc.max, score)
  return acc
}, { total: 0, count: 0, min: Infinity, max: -Infinity })
summary.avg = summary.total / summary.count
\`\`\``,
        },
        {
          heading: '中位數計算',
          content: `中位數必須先排序，再依奇偶數量取值：

\`\`\`js
function median(arr) {
  const sorted = [...arr].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 1
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2
}
\`\`\`

注意要複製陣列（\`[...arr]\`）再排序，避免修改原始資料。`,
        },
        {
          heading: '數值精度：toFixed 與浮點數陷阱',
          content: `JavaScript 浮點數計算常有精度問題：

\`\`\`js
0.1 + 0.2 // 0.30000000000000004
\`\`\`

解決方案：
- \`toFixed(2)\` 可格式化，但回傳的是**字串**，需用 \`parseFloat\` 或 \`Number\` 轉回數字
- 金融計算可乘以 100 用整數運算，最後再除以 100
- \`Math.round(val * 100) / 100\` 四捨五入到小數點後兩位`,
        },
        {
          heading: '百分位數（Percentile）',
          content: `P90 代表 90% 的資料值低於此數值，計算方式：

\`\`\`js
function percentile(arr, p) {
  const sorted = [...arr].sort((a, b) => a - b)
  const idx = Math.ceil((p / 100) * sorted.length) - 1
  return sorted[Math.max(0, idx)]
}
// percentile([1,2,3,4,5,6,7,8,9,10], 90) → 9
\`\`\``,
        },
      ],
    },
    keyPoints: [
      '基礎統計（total、count、avg、min、max）用一次 reduce 就能全部計算完畢，最後再算 avg = total / count。',
      '計算中位數前必須先排序，記得用展開運算子複製陣列再排序，避免修改原始資料。',
      '奇數個元素取中間那個，偶數個元素取中間兩個的平均值，這是中位數定義的核心差異。',
      'toFixed 回傳的是字串而非數字，若需要數值型別必須再包上 Number() 或 parseFloat()，這是常見的錯誤來源。',
      '百分位數的計算：先排序，再用 Math.ceil(p / 100 * length) - 1 取得對應索引位置。',
    ],
    problems: [
      {
        id: 'basic-summary',
        title: '基礎統計摘要',
        difficulty: 'easy',
        description: `從 \`scores\` 計算 \`{ total, count, avg, min, max }\`，存到 \`result\`。avg 保留整數（四捨五入）。`,
        examples: [
          {
            input: `[80, 90, 70, 100, 60]`,
            output: `{ total: 400, count: 5, avg: 80, min: 60, max: 100 }`,
          },
        ],
        initialCode: `const scores = [85, 92, 78, 95, 67, 88, 73, 91, 82, 79]

// 請計算統計摘要，結果存到 result
let result
`,
        testCases: [
          { label: 'total 應為 830', test: `return result && result.total === 830` },
          { label: 'count 應為 10', test: `return result && result.count === 10` },
          { label: 'avg 應為 83', test: `return result && result.avg === 83` },
          { label: 'min 應為 67', test: `return result && result.min === 67` },
          { label: 'max 應為 95', test: `return result && result.max === 95` },
        ],
      },
      {
        id: 'median',
        title: '計算中位數',
        difficulty: 'medium',
        description: `分別計算奇數長度陣列 \`oddScores\` 和偶數長度陣列 \`evenScores\` 的中位數，存到 \`medianOdd\` 和 \`medianEven\`。`,
        examples: [
          {
            input: `oddScores = [1, 3, 5], evenScores = [1, 2, 3, 4]`,
            output: `medianOdd = 3, medianEven = 2.5`,
          },
        ],
        initialCode: `const oddScores = [7, 3, 1, 9, 5]      // 奇數個
const evenScores = [8, 2, 6, 4, 10, 12] // 偶數個

// 請計算兩組資料的中位數
let medianOdd
let medianEven
`,
        testCases: [
          { label: 'oddScores 排序後為 [1,3,5,7,9]，中位數為 5', test: `return medianOdd === 5` },
          { label: 'evenScores 排序後為 [2,4,6,8,10,12]，中位數為 (6+8)/2 = 7', test: `return medianEven === 7` },
        ],
      },
      {
        id: 'income-expense-summary',
        title: '收支淨額統計',
        difficulty: 'medium',
        description: `從 \`transactions\`（有 \`type: 'income' | 'expense'\`, \`amount\`）計算 \`{ totalIncome, totalExpense, netIncome }\`，存到 \`result\`。`,
        examples: [
          {
            input: `[{ type: 'income', amount: 1000 }, { type: 'expense', amount: 300 }]`,
            output: `{ totalIncome: 1000, totalExpense: 300, netIncome: 700 }`,
          },
        ],
        initialCode: `const transactions = [
  { type: 'income', amount: 5000 },
  { type: 'expense', amount: 1200 },
  { type: 'income', amount: 3000 },
  { type: 'expense', amount: 800 },
  { type: 'income', amount: 1500 },
  { type: 'expense', amount: 2500 },
]

// 請計算收支統計，結果存到 result
let result
`,
        testCases: [
          { label: 'totalIncome 應為 9500', test: `return result && result.totalIncome === 9500` },
          { label: 'totalExpense 應為 4500', test: `return result && result.totalExpense === 4500` },
          { label: 'netIncome 應為 5000', test: `return result && result.netIncome === 5000` },
        ],
      },
      {
        id: 'percentile',
        title: '計算第 P 百分位數',
        difficulty: 'hard',
        description: `計算 \`scores\` 的第 \`90\` 百分位數（P90）和第 \`50\` 百分位數（P50），分別存到 \`p90\` 和 \`p50\`。P90 表示 90% 的值低於此數。`,
        examples: [
          {
            input: `scores = [1,2,3,4,5,6,7,8,9,10], P = 90`,
            output: `p90 = 9`,
          },
        ],
        initialCode: `const scores = [55, 70, 80, 85, 88, 90, 92, 95, 97, 100]

// 請計算 P90 和 P50
let p90
let p50
`,
        testCases: [
          { label: '排序後 P90 索引為 ceil(0.9*10)-1 = 8，scores[8]=97', test: `return p90 === 97` },
          { label: '排序後 P50 索引為 ceil(0.5*10)-1 = 4，scores[4]=88', test: `return p50 === 88` },
        ],
      },
      {
        id: 'rolling-average',
        title: '滾動平均（Rolling Average）',
        difficulty: 'hard',
        description: `計算 \`dailyData\`（\`[{ date, value }]\`）每個時間點的前 \`N\` 天平均（含當天），資料不足 \`N\` 天時用現有資料平均。結果存到 \`result\`（\`[{ date, avg }]\`），avg 四捨五入到小數點後兩位。`,
        examples: [
          {
            input: `dailyData = [{ date: '01', value: 10 }, { date: '02', value: 20 }], N = 3`,
            output: `[{ date: '01', avg: 10 }, { date: '02', avg: 15 }]`,
          },
        ],
        initialCode: `const dailyData = [
  { date: '2024-01-01', value: 10 },
  { date: '2024-01-02', value: 20 },
  { date: '2024-01-03', value: 30 },
  { date: '2024-01-04', value: 40 },
  { date: '2024-01-05', value: 50 },
]
const N = 3

// 請計算每天的前 N 天（含當天）滾動平均，結果存到 result
let result
`,
        testCases: [
          { label: 'result 應有 5 個元素', test: `return Array.isArray(result) && result.length === 5` },
          { label: '第 1 天（前 1 天）avg 應為 10', test: `return result[0] && result[0].avg === 10` },
          { label: '第 2 天（前 2 天）avg 應為 15', test: `return result[1] && result[1].avg === 15` },
          { label: '第 3 天（前 3 天）avg 應為 20', test: `return result[2] && result[2].avg === 20` },
          { label: '第 4 天（前 3 天：20+30+40）avg 應為 30', test: `return result[3] && result[3].avg === 30` },
          { label: '第 5 天（前 3 天：30+40+50）avg 應為 40', test: `return result[4] && result[4].avg === 40` },
        ],
      },
    ],
  },

  // ─── 4. 排名計分 ──────────────────────────────────────────────────
  {
    slug: 'ranking-system',
    methodName: '排名計分',
    title: '排名與計分系統',
    description: '根據多項指標計算綜合分數，處理並列排名',
    subCategory: '資料聚合與統計',
    difficulty: 'medium',
    notes: {
      title: '排名與計分系統',
      sections: [
        {
          heading: '基礎排名：勝率計算',
          content: `勝率排名只需計算 winRate 後排序：

\`\`\`js
const ranked = players
  .map(p => ({
    ...p,
    winRate: p.wins / (p.wins + p.losses),
  }))
  .sort((a, b) => b.winRate - a.winRate)
  .map((p, i) => ({ ...p, rank: i + 1 }))
\`\`\``,
        },
        {
          heading: '加權評分與穩定排序',
          content: `JavaScript 的 \`Array.sort\` 在現代引擎（V8 TimSort）已是穩定排序，同分元素保持原始相對順序：

\`\`\`js
// 分數相同時 sort 的比較函式返回 0，原始順序自動保留
const ranked = players
  .map(p => ({ ...p, score: p.wins * 3 + p.draws * 1 }))
  .sort((a, b) => b.score - a.score)
  .map((p, i) => ({ ...p, rank: i + 1 }))
\`\`\``,
        },
        {
          heading: '並列排名（Dense vs Standard Ranking）',
          content: `Standard Ranking（1, 1, 3）vs Dense Ranking（1, 1, 2）：

\`\`\`js
// Standard ranking：同分跳排名
let rank = 1
const result = sorted.map((player, i) => {
  if (i > 0 && player.score < sorted[i - 1].score) rank = i + 1
  return { ...player, rank }
})
\`\`\``,
        },
        {
          heading: '多指標標準化加權',
          content: `標準化步驟：找出每個指標的 min/max，再將各值縮放到 0~100：

\`\`\`js
const normalize = (val, min, max) =>
  max === min ? 100 : ((val - min) / (max - min)) * 100

const scored = candidates.map(c => ({
  ...c,
  finalScore:
    normalize(c.quality, minQ, maxQ) * 0.4 +
    normalize(c.speed, minS, maxS) * 0.3 +
    normalize(c.cost, minC, maxC) * 0.3,
}))
\`\`\``,
        },
      ],
    },
    keyPoints: [
      '基礎排名流程：先 map 計算衍生指標（如勝率、總分），再 sort 排序，最後 map 加上 rank 欄位，index + 1 即為名次。',
      'JavaScript 的 Array.sort 在 Node.js 11+ 及現代瀏覽器已是穩定排序（TimSort），同分元素可保持原始相對順序。',
      '標準並列排名（Standard Ranking）：同分給相同排名，下一個名次跳過，實作時追蹤前一個分數，分數變化才更新 rank 為 i+1。',
      '多指標標準化：先找各指標的 min 和 max，用 (val - min) / (max - min) * 100 將每個值縮放到 0~100，再乘以對應權重加總。',
      '動態排行榜：用 reduce 累計每人積分，再排序取 Top-N，是頻率統計與排名系統的綜合應用。',
    ],
    problems: [
      {
        id: 'win-rate-rank',
        title: '計算勝率並排名',
        difficulty: 'easy',
        description: `給 \`players\` 陣列（有 \`wins\`, \`losses\`），計算 \`winRate\`（wins/(wins+losses)），依勝率降序排名，加上 \`rank\` 欄位後存到 \`result\`。`,
        examples: [
          {
            input: `[{ name: 'A', wins: 8, losses: 2 }, { name: 'B', wins: 6, losses: 4 }]`,
            output: `[{ name: 'A', ..., winRate: 0.8, rank: 1 }, { name: 'B', ..., winRate: 0.6, rank: 2 }]`,
          },
        ],
        initialCode: `const players = [
  { name: 'Alice', wins: 7, losses: 3 },
  { name: 'Bob', wins: 9, losses: 1 },
  { name: 'Carol', wins: 5, losses: 5 },
  { name: 'Dave', wins: 8, losses: 2 },
]

// 請計算勝率並排名（降序），結果存到 result
let result
`,
        testCases: [
          { label: 'result 應有 4 個元素', test: `return Array.isArray(result) && result.length === 4` },
          { label: '第 1 名應為 Bob（勝率 0.9）', test: `return result[0] && result[0].name === 'Bob' && result[0].rank === 1` },
          { label: '第 2 名應為 Dave（勝率 0.8）', test: `return result[1] && result[1].name === 'Dave' && result[1].rank === 2` },
          { label: '第 4 名應為 Carol（勝率 0.5）', test: `return result[3] && result[3].name === 'Carol' && result[3].rank === 4` },
        ],
      },
      {
        id: 'weighted-score',
        title: '加權評分排名',
        difficulty: 'medium',
        description: `依公式 \`score = wins * 3 + draws * 1\` 計算總分，依分數降序排名，同分保持原順序（穩定排序），加上 \`score\` 和 \`rank\` 欄位後存到 \`result\`。`,
        examples: [
          {
            input: `[{ name: 'A', wins: 2, draws: 1, losses: 1 }]`,
            output: `[{ ..., score: 7, rank: 1 }]`,
          },
        ],
        initialCode: `const teams = [
  { name: 'Alpha', wins: 5, draws: 2, losses: 1 },
  { name: 'Beta', wins: 4, draws: 5, losses: 0 },
  { name: 'Gamma', wins: 6, draws: 0, losses: 2 },
  { name: 'Delta', wins: 4, draws: 5, losses: 1 },
]

// 請計算加權分數並排名，結果存到 result
let result
`,
        testCases: [
          { label: 'Gamma 的 score 應為 18 (6*3+0*1)', test: `const g = result && result.find(t => t.name === 'Gamma'); return g && g.score === 18` },
          { label: 'Gamma 應排第 1 名', test: `return result && result[0].name === 'Gamma'` },
          { label: 'Beta 的 score 應為 17 (4*3+5*1)', test: `const b = result && result.find(t => t.name === 'Beta'); return b && b.score === 17` },
          { label: 'Alpha 的 score 應為 17 (5*3+2*1)，同分時保持 Beta 在前（原始順序）', test: `const ai = result && result.findIndex(t => t.name === 'Alpha'); const bi = result && result.findIndex(t => t.name === 'Beta'); return ai > bi` },
        ],
      },
      {
        id: 'tied-ranking',
        title: '並列排名',
        difficulty: 'medium',
        description: `給 \`players\`（已有 \`score\` 欄位），計算 Standard Ranking：同分給相同 \`rank\`，下一名跳過（如 1,1,3,4,4,6），結果存到 \`result\`（加上 \`rank\` 欄位的陣列，依 score 降序）。`,
        examples: [
          {
            input: `scores = [100, 90, 90, 80]`,
            output: `ranks = [1, 2, 2, 4]`,
          },
        ],
        initialCode: `const players = [
  { name: 'A', score: 95 },
  { name: 'B', score: 87 },
  { name: 'C', score: 87 },
  { name: 'D', score: 80 },
  { name: 'E', score: 80 },
  { name: 'F', score: 70 },
]

// 請計算並列排名（Standard Ranking），結果存到 result
let result
`,
        testCases: [
          { label: 'A 的 rank 應為 1', test: `const a = result && result.find(p => p.name === 'A'); return a && a.rank === 1` },
          { label: 'B 和 C 的 rank 應都為 2', test: `const b = result && result.find(p => p.name === 'B'); const c = result && result.find(p => p.name === 'C'); return b && c && b.rank === 2 && c.rank === 2` },
          { label: 'D 和 E 的 rank 應都為 4', test: `const d = result && result.find(p => p.name === 'D'); const e = result && result.find(p => p.name === 'E'); return d && e && d.rank === 4 && e.rank === 4` },
          { label: 'F 的 rank 應為 6', test: `const f = result && result.find(p => p.name === 'F'); return f && f.rank === 6` },
        ],
      },
      {
        id: 'multi-criteria-ranking',
        title: '多指標標準化加權排名',
        difficulty: 'hard',
        description: `給 \`candidates\`（有 \`quality\`, \`speed\`, \`cost\` 欄位），依權重 \`{ quality: 0.4, speed: 0.3, cost: 0.3 }\` 加權，先將各指標標準化（0~100），再計算 \`finalScore\` 並降序排名，加上 \`rank\` 欄位後存到 \`result\`。`,
        examples: [
          {
            input: `candidates with quality/speed/cost, weights`,
            output: `result with finalScore and rank`,
          },
        ],
        initialCode: `const candidates = [
  { name: 'Vendor A', quality: 90, speed: 70, cost: 50 },
  { name: 'Vendor B', quality: 75, speed: 95, cost: 80 },
  { name: 'Vendor C', quality: 85, speed: 80, cost: 60 },
  { name: 'Vendor D', quality: 60, speed: 60, cost: 90 },
]
const weights = { quality: 0.4, speed: 0.3, cost: 0.3 }

// 請將各指標標準化後加權計算 finalScore，依分數降序排名
// 注意：cost 越高代表費用越高，需視為指標數值，直接標準化（不反轉）
let result
`,
        testCases: [
          { label: 'result 應有 4 個元素', test: `return Array.isArray(result) && result.length === 4` },
          { label: '所有元素都應有 finalScore 欄位', test: `return result && result.every(r => typeof r.finalScore === 'number')` },
          { label: '所有元素都應有 rank 欄位', test: `return result && result.every(r => typeof r.rank === 'number')` },
          { label: 'Vendor B（cost 最高 90，標準化 100，speed 最高 95，標準化 100）應排第 1', test: `return result && result[0].name === 'Vendor B'` },
          { label: 'rank 應依 finalScore 降序排列', test: `return result && result.every((r, i) => i === 0 || result[i-1].finalScore >= r.finalScore)` },
        ],
      },
      {
        id: 'dynamic-leaderboard',
        title: '動態排行榜',
        difficulty: 'hard',
        description: `從 \`events\`（\`[{ userId, event, points }]\`）累計每人積分，回傳前 \`10\` 名（依積分降序），加上 \`rank\` 和 \`totalPoints\` 欄位後存到 \`result\`。`,
        examples: [
          {
            input: `events = [{ userId: 'u1', event: 'login', points: 10 }, { userId: 'u1', event: 'purchase', points: 50 }]`,
            output: `[{ userId: 'u1', totalPoints: 60, rank: 1 }]`,
          },
        ],
        initialCode: `const events = [
  { userId: 'u1', event: 'login', points: 10 },
  { userId: 'u2', event: 'login', points: 10 },
  { userId: 'u1', event: 'purchase', points: 100 },
  { userId: 'u3', event: 'login', points: 10 },
  { userId: 'u2', event: 'purchase', points: 150 },
  { userId: 'u3', event: 'review', points: 20 },
  { userId: 'u1', event: 'review', points: 20 },
  { userId: 'u4', event: 'login', points: 10 },
  { userId: 'u4', event: 'purchase', points: 200 },
]

// 請累計每人積分，回傳前 10 名（含 rank 和 totalPoints），結果存到 result
let result
`,
        testCases: [
          { label: 'result 應有 4 個元素（共 4 位使用者）', test: `return Array.isArray(result) && result.length === 4` },
          { label: '第 1 名應為 u4（totalPoints 210）', test: `return result[0] && result[0].userId === 'u4' && result[0].totalPoints === 210` },
          { label: '第 2 名應為 u2（totalPoints 160）', test: `return result[1] && result[1].userId === 'u2' && result[1].totalPoints === 160` },
          { label: '第 3 名應為 u1（totalPoints 130）', test: `return result[2] && result[2].userId === 'u1' && result[2].totalPoints === 130` },
          { label: '第 4 名的 rank 應為 4', test: `return result[3] && result[3].rank === 4` },
        ],
      },
    ],
  },

  // ─── 5. 時間序列操作 ──────────────────────────────────────────────
  {
    slug: 'time-series',
    methodName: '時間序列操作',
    title: '時間序列資料操作',
    description: '處理含時間戳的資料：補齊缺漏日期、轉換時間粒度、計算時間差',
    subCategory: '資料聚合與統計',
    difficulty: 'hard',
    notes: {
      title: '時間序列資料操作',
      sections: [
        {
          heading: '日期操作基礎',
          content: `操作日期字串最安全的方式是使用 \`Date\` 物件或直接解析字串：

\`\`\`js
// 取得月份字串 YYYY-MM
const getMonth = dateStr => dateStr.slice(0, 7)

// 取得週一（ISO week start）
function getMonday(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  const day = d.getDay()
  const diff = (day === 0 ? -6 : 1 - day) // 週日 → -6，其他 → 1-day
  d.setDate(d.getDate() + diff)
  return d.toISOString().slice(0, 10)
}
\`\`\``,
        },
        {
          heading: 'ISO format 與時區注意事項',
          content: `- \`new Date('2024-01-01')\` 在瀏覽器解析為 **UTC 午夜**，轉換成本地時間可能差一天
- 建議在日期後加 \`T00:00:00\` 強制本地解析：\`new Date('2024-01-01T00:00:00')\`
- 或完全使用字串操作（slice、substring）避免時區問題
- \`toISOString()\` 輸出 UTC 時間，若需本地時間需加上時區偏移`,
        },
        {
          heading: '補齊缺漏日期',
          content: `補齊日期常見做法：生成日期範圍後 merge：

\`\`\`js
function fillDates(start, end, data) {
  const map = Object.fromEntries(data.map(d => [d.date, d.revenue]))
  const result = []
  const cur = new Date(start + 'T00:00:00')
  const endDate = new Date(end + 'T00:00:00')
  while (cur <= endDate) {
    const dateStr = cur.toISOString().slice(0, 10)
    result.push({ date: dateStr, revenue: map[dateStr] ?? 0 })
    cur.setDate(cur.getDate() + 1)
  }
  return result
}
\`\`\``,
        },
        {
          heading: '連續天數（Streak）計算',
          content: `計算最長連續登入天數：先排序去重，再用滑動指針：

\`\`\`js
const unique = [...new Set(dates)].sort()
let maxStreak = 1, cur = 1
for (let i = 1; i < unique.length; i++) {
  const prev = new Date(unique[i - 1] + 'T00:00:00')
  const curr = new Date(unique[i] + 'T00:00:00')
  const diff = (curr - prev) / 86400000 // ms → days
  cur = diff === 1 ? cur + 1 : 1
  maxStreak = Math.max(maxStreak, cur)
}
\`\`\``,
        },
      ],
    },
    keyPoints: [
      '日期字串加上 T00:00:00 再用 new Date() 解析，可避免瀏覽器將 YYYY-MM-DD 解析為 UTC 導致的時區偏移問題。',
      '補齊缺漏日期的標準做法：先建立原始資料的 Map，再用 while 迴圈從 start 走到 end，缺漏的日期補上預設值。',
      '月份匯總只需對日期字串做 slice(0, 7) 就能取得 YYYY-MM，不需要 Date 物件，避免時區問題。',
      '連續天數計算：先排序去重，再逐一比較相鄰日期差是否為 1 天（diff = (curr - prev) / 86400000），不連續就重置計數器。',
      '滑動視窗（Moving Average）：用 slice(Math.max(0, i - N + 1), i + 1) 取當前位置往前 N 個元素，資料不足 N 天時自動退化為現有天數平均。',
    ],
    problems: [
      {
        id: 'weekly-aggregation',
        title: '每日銷售依週匯總',
        difficulty: 'easy',
        description: `把 \`dailySales\`（\`[{ date: 'YYYY-MM-DD', revenue }]\`）依週匯總（以週一為該週起點），回傳 \`{ [weekStart: 'YYYY-MM-DD']: totalRevenue }\`，存到 \`result\`。`,
        examples: [
          {
            input: `[{ date: '2024-01-01', revenue: 100 }, { date: '2024-01-02', revenue: 200 }]（2024-01-01 是週一）`,
            output: `{ '2024-01-01': 300 }`,
          },
        ],
        initialCode: `// 2024-01-01 是週一
const dailySales = [
  { date: '2024-01-01', revenue: 1000 }, // 週一（第1週）
  { date: '2024-01-02', revenue: 800 },  // 週二（第1週）
  { date: '2024-01-03', revenue: 1200 }, // 週三（第1週）
  { date: '2024-01-08', revenue: 900 },  // 週一（第2週）
  { date: '2024-01-09', revenue: 1100 }, // 週二（第2週）
]

// 請依週（週一為起點）匯總 revenue，結果存到 result
let result
`,
        testCases: [
          { label: 'result 應有 2 個週', test: `return result && Object.keys(result).length === 2` },
          { label: '第 1 週（2024-01-01）的 revenue 應為 3000', test: `return result && result['2024-01-01'] === 3000` },
          { label: '第 2 週（2024-01-08）的 revenue 應為 2000', test: `return result && result['2024-01-08'] === 2000` },
        ],
      },
      {
        id: 'fill-missing-dates',
        title: '補齊缺漏日期',
        difficulty: 'medium',
        description: `給定 \`startDate\`、\`endDate\` 和 \`salesData\`，把缺漏的日期補上 \`{ date, revenue: 0 }\`，回傳完整日期序列（依日期升序），存到 \`result\`。`,
        examples: [
          {
            input: `start='2024-01-01', end='2024-01-03', data=[{ date:'2024-01-01', revenue:100 }]`,
            output: `[{ date:'2024-01-01', revenue:100 }, { date:'2024-01-02', revenue:0 }, { date:'2024-01-03', revenue:0 }]`,
          },
        ],
        initialCode: `const startDate = '2024-01-01'
const endDate = '2024-01-07'
const salesData = [
  { date: '2024-01-01', revenue: 500 },
  { date: '2024-01-03', revenue: 800 },
  { date: '2024-01-05', revenue: 600 },
  { date: '2024-01-07', revenue: 900 },
]

// 請補齊缺漏日期，結果存到 result
let result
`,
        testCases: [
          { label: 'result 應有 7 個元素（01-01 到 01-07）', test: `return Array.isArray(result) && result.length === 7` },
          { label: '2024-01-02 的 revenue 應為 0（補齊）', test: `const d = result && result.find(r => r.date === '2024-01-02'); return d && d.revenue === 0` },
          { label: '2024-01-03 的 revenue 應為 800（原始資料）', test: `const d = result && result.find(r => r.date === '2024-01-03'); return d && d.revenue === 800` },
          { label: '2024-01-04 的 revenue 應為 0（補齊）', test: `const d = result && result.find(r => r.date === '2024-01-04'); return d && d.revenue === 0` },
          { label: 'result 應依日期升序排列', test: `return result && result.every((r, i) => i === 0 || r.date >= result[i-1].date)` },
        ],
      },
      {
        id: 'monthly-aggregation',
        title: '時間序列依月份匯總',
        difficulty: 'medium',
        description: `把 \`dailySales\` 依月份匯總，\`date\` 轉成 \`'YYYY-MM'\`，revenue 加總，回傳 \`[{ month, totalRevenue }]\`（依月份升序），存到 \`result\`。`,
        examples: [
          {
            input: `[{ date: '2024-01-01', revenue: 100 }, { date: '2024-01-15', revenue: 200 }, { date: '2024-02-01', revenue: 150 }]`,
            output: `[{ month: '2024-01', totalRevenue: 300 }, { month: '2024-02', totalRevenue: 150 }]`,
          },
        ],
        initialCode: `const dailySales = [
  { date: '2024-01-05', revenue: 1000 },
  { date: '2024-01-15', revenue: 1500 },
  { date: '2024-01-25', revenue: 800 },
  { date: '2024-02-10', revenue: 1200 },
  { date: '2024-02-20', revenue: 900 },
  { date: '2024-03-01', revenue: 2000 },
]

// 請依月份匯總 revenue，結果存到 result（陣列格式，依月份升序）
let result
`,
        testCases: [
          { label: 'result 應有 3 個月份', test: `return Array.isArray(result) && result.length === 3` },
          { label: '2024-01 的 totalRevenue 應為 3300', test: `const m = result && result.find(r => r.month === '2024-01'); return m && m.totalRevenue === 3300` },
          { label: '2024-02 的 totalRevenue 應為 2100', test: `const m = result && result.find(r => r.month === '2024-02'); return m && m.totalRevenue === 2100` },
          { label: '2024-03 的 totalRevenue 應為 2000', test: `const m = result && result.find(r => r.month === '2024-03'); return m && m.totalRevenue === 2000` },
          { label: 'result 應依月份升序排列', test: `return result && result.every((r, i) => i === 0 || r.month >= result[i-1].month)` },
        ],
      },
      {
        id: 'login-streak',
        title: '最長連續登入天數',
        difficulty: 'hard',
        description: `給 \`loginDates\`（\`string[]\`，格式 \`'YYYY-MM-DD'\`，可能有重複），找出最長連續登入天數，存到 \`result\`（number）。`,
        examples: [
          {
            input: `['2024-01-01', '2024-01-02', '2024-01-04', '2024-01-05', '2024-01-06']`,
            output: `3（01-04 到 01-06 連續 3 天）`,
          },
        ],
        initialCode: `const loginDates = [
  '2024-01-01',
  '2024-01-02',
  '2024-01-02', // 重複
  '2024-01-03',
  '2024-01-05',
  '2024-01-06',
  '2024-01-07',
  '2024-01-07', // 重複
  '2024-01-10',
]

// 請找出最長連續登入天數，結果存到 result
let result
`,
        testCases: [
          { label: '最長連續登入為 01-01~01-03 或 01-05~01-07（均為 3 天），result 應為 4', test: `return result === 4` },
        ],
      },
      {
        id: 'moving-average',
        title: '7 天移動平均',
        difficulty: 'hard',
        description: `給 \`dailyData\`（\`[{ date, value }]\`），計算每天的「過去 7 天移動平均」（包含當天），不足 7 天時取現有天數的平均。avg 四捨五入到小數點後兩位，結果存到 \`result\`（\`[{ date, avg }]\`）。`,
        examples: [
          {
            input: `dailyData[0..6], window=7`,
            output: `result[0].avg = dailyData[0].value（只有 1 天）`,
          },
        ],
        initialCode: `const dailyData = [
  { date: '2024-01-01', value: 10 },
  { date: '2024-01-02', value: 20 },
  { date: '2024-01-03', value: 15 },
  { date: '2024-01-04', value: 25 },
  { date: '2024-01-05', value: 30 },
  { date: '2024-01-06', value: 20 },
  { date: '2024-01-07', value: 35 },
  { date: '2024-01-08', value: 40 },
  { date: '2024-01-09', value: 10 },
]
const windowSize = 7

// 請計算每天的 windowSize 天移動平均，結果存到 result
let result
`,
        testCases: [
          { label: 'result 應有 9 個元素', test: `return Array.isArray(result) && result.length === 9` },
          { label: '第 1 天（只有 1 天）avg 應為 10', test: `return result[0] && result[0].avg === 10` },
          { label: '第 3 天（前 3 天：10+20+15=45, avg=15）avg 應為 15', test: `return result[2] && result[2].avg === 15` },
          { label: '第 7 天（前 7 天：10+20+15+25+30+20+35=155, avg≈22.14）avg 應為 22.14', test: `return result[6] && result[6].avg === 22.14` },
          { label: '第 8 天（前 7 天：20+15+25+30+20+35+40=185, avg≈26.43）avg 應為 26.43', test: `return result[7] && result[7].avg === 26.43` },
        ],
      },
    ],
  },
]
