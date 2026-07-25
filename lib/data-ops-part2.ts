import type { MethodEntry } from './array-challenges'

export const dataOpsPart2: MethodEntry[] = [
  // ─── 1. 多條件動態篩選 ─────────────────────────────────────────────
  {
    slug: 'multi-filter',
    methodName: '多條件篩選',
    title: '多條件動態篩選',
    description: '根據多個篩選條件同時過濾複雜資料結構',
    subCategory: '資料過濾與搜尋',
    difficulty: 'medium',
    notes: {
      title: '多條件動態篩選',
      sections: [
        {
          heading: 'AND 邏輯 vs OR 邏輯',
          content: `多條件篩選最核心的問題是條件之間的關係：
- **AND 邏輯**：所有條件都必須符合，用 \`&&\` 或 \`.every()\` 實作
- **OR 邏輯**：只要任一條件符合，用 \`||\` 或 \`.some()\` 實作

\`\`\`js
// AND：同時符合 category 和 inStock
const result = products.filter(p => p.category === 'electronics' && p.inStock)

// OR：符合任一 category
const result = products.filter(p => ['electronics', 'clothing'].some(c => c === p.category))
\`\`\``,
        },
        {
          heading: '動態篩選物件',
          content: `當篩選條件不固定時，可以把條件包成物件，再用 \`Object.entries\` 遍歷：

\`\`\`js
function dynamicFilter(items, filters) {
  return items.filter(item =>
    Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null) return true
      return item[key] === value
    })
  )
}
\`\`\`

這種方式的優點是呼叫端只需傳入有意義的欄位，不需要針對每個欄位寫 if。`,
        },
        {
          heading: '函式陣列條件（Predicate Array）',
          content: `更彈性的做法是把每個條件寫成函式（predicate），再用 \`.every()\` 確保全部通過：

\`\`\`js
const conditions = [
  user => user.age >= 18,
  user => user.isActive,
  user => user.role !== 'banned',
]

const result = users.filter(user => conditions.every(fn => fn(user)))
\`\`\`

這種模式可以動態增刪條件，也方便單元測試每個條件函式。`,
        },
        {
          heading: '效能考量',
          content: `- 把最嚴格（過濾掉最多筆）的條件放在最前面，善用短路求值（short-circuit）
- 避免在 filter callback 內重複計算，可先預處理成 Set 加速查找
- 大資料量時考慮分頁或 Web Worker，避免阻塞主執行緒

\`\`\`js
// 預先建立 Set 加速 includes 查詢
const validCategories = new Set(['electronics', 'clothing'])
const result = products.filter(p => validCategories.has(p.category))
\`\`\``,
        },
      ],
    },
    keyPoints: [
      '多條件篩選的核心是 AND（所有條件都成立）vs OR（任一條件成立）的邏輯選擇，用 every() 實作 AND、用 some() 實作 OR。',
      '動態篩選可以將條件包成物件，再用 Object.entries().every() 遍歷，如此呼叫端只需傳入有意義的欄位，未定義的欄位直接跳過。',
      '把條件寫成 predicate 函式陣列，再搭配 filter + every 使用，可以讓條件易於新增、刪除與測試。',
      '效能優化上，應將過濾率最高的條件放在最前面，並善用 Set 取代 includes 來加速大量元素的查找。',
      '處理 undefined/null 條件時要有明確的預設行為，通常是「無值即不篩選（視為通過）」。',
    ],
    problems: [
      {
        id: 'category-and-stock',
        title: '篩選商品：類別與庫存',
        difficulty: 'easy',
        description: `你有一個商品清單，請同時過濾 \`category\`（字串）和 \`inStock\`（布林）兩個條件。
只保留 \`category === 'electronics'\` **且** \`inStock === true\` 的商品，將結果存到 \`result\`。`,
        examples: [
          {
            input: `category = 'electronics', inStock = true`,
            output: `[{ id: 1, name: 'Laptop', ... }, { id: 3, name: 'Phone', ... }]`,
          },
        ],
        initialCode: `const products = [
  { id: 1, name: 'Laptop', category: 'electronics', price: 999, inStock: true },
  { id: 2, name: 'Shirt', category: 'clothing', price: 29, inStock: false },
  { id: 3, name: 'Phone', category: 'electronics', price: 699, inStock: true },
  { id: 4, name: 'Tablet', category: 'electronics', price: 499, inStock: false },
  { id: 5, name: 'Pants', category: 'clothing', price: 59, inStock: true },
]

// 同時篩選 category === 'electronics' 且 inStock === true
let result
`,
        testCases: [
          { label: 'result 應有 2 筆', test: `return Array.isArray(result) && result.length === 2` },
          { label: '全部都是 electronics', test: `return result.every(p => p.category === 'electronics')` },
          { label: '全部都有庫存', test: `return result.every(p => p.inStock === true)` },
          { label: '包含 Laptop', test: `return result.some(p => p.name === 'Laptop')` },
          { label: '包含 Phone', test: `return result.some(p => p.name === 'Phone')` },
        ],
      },
      {
        id: 'price-range',
        title: '篩選商品：價格範圍',
        difficulty: 'easy',
        description: `請依照 \`minPrice\` 和 \`maxPrice\` 過濾商品，\`undefined\` 表示無限制（沒有下限或上限）。
將篩選結果存到 \`result\`。

目前條件：\`minPrice = 100\`，\`maxPrice = undefined\`（只有下限，無上限）。`,
        examples: [
          { input: `minPrice = 100, maxPrice = undefined`, output: `price >= 100 的所有商品` },
          { input: `minPrice = undefined, maxPrice = 500`, output: `price <= 500 的所有商品` },
        ],
        initialCode: `const products = [
  { id: 1, name: 'Laptop', price: 999 },
  { id: 2, name: 'Shirt', price: 29 },
  { id: 3, name: 'Phone', price: 699 },
  { id: 4, name: 'Headphones', price: 149 },
  { id: 5, name: 'Cable', price: 9 },
]

const minPrice = 100
const maxPrice = undefined

// 根據 minPrice 和 maxPrice 過濾（undefined 表示無限制）
let result
`,
        testCases: [
          { label: 'result 應有 3 筆', test: `return Array.isArray(result) && result.length === 3` },
          { label: '全部 price >= 100', test: `return result.every(p => p.price >= 100)` },
          { label: '包含 Laptop(999)', test: `return result.some(p => p.name === 'Laptop')` },
          { label: '包含 Phone(699)', test: `return result.some(p => p.name === 'Phone')` },
          { label: '包含 Headphones(149)', test: `return result.some(p => p.name === 'Headphones')` },
        ],
      },
      {
        id: 'dynamic-object-filter',
        title: '動態篩選物件',
        difficulty: 'medium',
        description: `請實作 \`dynamicFilter(items, filters)\` 函式。
\`filters\` 是一個物件，只有有值的 key 才要過濾，值為 \`undefined\` 或 \`null\` 的 key 視為不篩選。

將 \`dynamicFilter(products, { category: 'electronics', inStock: true, brand: undefined })\` 的結果存到 \`result\`。`,
        examples: [
          {
            input: `filters = { category: 'electronics', brand: undefined }`,
            output: `只過濾 category，忽略 brand`,
          },
        ],
        initialCode: `const products = [
  { id: 1, name: 'Laptop', category: 'electronics', brand: 'Dell', inStock: true },
  { id: 2, name: 'Shirt', category: 'clothing', brand: 'Nike', inStock: true },
  { id: 3, name: 'Phone', category: 'electronics', brand: 'Apple', inStock: false },
  { id: 4, name: 'Tablet', category: 'electronics', brand: 'Samsung', inStock: true },
]

function dynamicFilter(items, filters) {
  // 請在此實作：遍歷 filters 的 key，值為 undefined/null 則跳過
}

let result = dynamicFilter(products, { category: 'electronics', inStock: true, brand: undefined })
`,
        testCases: [
          { label: 'result 應有 2 筆', test: `return Array.isArray(result) && result.length === 2` },
          { label: '全部都是 electronics', test: `return result.every(p => p.category === 'electronics')` },
          { label: '全部都有庫存', test: `return result.every(p => p.inStock === true)` },
          { label: 'brand undefined 不影響篩選', test: `return result.some(p => p.brand === 'Dell') && result.some(p => p.brand === 'Samsung')` },
        ],
      },
      {
        id: 'predicate-array',
        title: '篩選使用者：條件函式陣列',
        difficulty: 'medium',
        description: `請使用 \`conditions\` 陣列中的條件函式（每個都是函式）篩選 \`users\`，所有條件都要符合（AND 邏輯）。
將結果存到 \`result\`。`,
        examples: [
          {
            input: `conditions = [u => u.age >= 18, u => u.isActive]`,
            output: `同時符合所有條件的使用者`,
          },
        ],
        initialCode: `const users = [
  { id: 1, name: 'Alice', age: 25, isActive: true, role: 'admin' },
  { id: 2, name: 'Bob', age: 17, isActive: true, role: 'user' },
  { id: 3, name: 'Carol', age: 30, isActive: false, role: 'user' },
  { id: 4, name: 'Dave', age: 22, isActive: true, role: 'user' },
  { id: 5, name: 'Eve', age: 15, isActive: false, role: 'admin' },
]

const conditions = [
  u => u.age >= 18,
  u => u.isActive === true,
  u => u.role !== 'admin',
]

// 用 filter + every 讓所有 conditions 都通過
let result
`,
        testCases: [
          { label: 'result 應有 1 筆', test: `return Array.isArray(result) && result.length === 1` },
          { label: '包含 Dave', test: `return result.some(u => u.name === 'Dave')` },
          { label: '全部 age >= 18', test: `return result.every(u => u.age >= 18)` },
          { label: '全部 isActive', test: `return result.every(u => u.isActive === true)` },
          { label: '全部 role !== admin', test: `return result.every(u => u.role !== 'admin')` },
        ],
      },
      {
        id: 'full-product-search',
        title: '完整商品搜尋',
        difficulty: 'hard',
        description: `請實作完整的商品搜尋函式 \`searchProducts(products, options)\`，同時處理：
- \`keyword\`：搜尋 \`name\` 和 \`description\`（不分大小寫，包含即符合）
- \`categories\`：多選類別陣列（空陣列表示不限）
- \`priceRange\`：\`{ min, max }\`（undefined 表示無限制）
- \`inStockOnly\`：布林，true 時只顯示有庫存商品
- \`sortBy\`：\`'price-asc' | 'price-desc' | 'name'\`

將 \`searchProducts(products, searchOptions)\` 的結果存到 \`result\`。`,
        initialCode: `const products = [
  { id: 1, name: 'Laptop Pro', description: 'High performance laptop', category: 'electronics', price: 1299, inStock: true },
  { id: 2, name: 'Basic Laptop', description: 'Affordable laptop for students', category: 'electronics', price: 499, inStock: false },
  { id: 3, name: 'Running Shoes', description: 'Lightweight sport shoes', category: 'sports', price: 89, inStock: true },
  { id: 4, name: 'Yoga Mat', description: 'Non-slip mat for exercise', category: 'sports', price: 35, inStock: true },
  { id: 5, name: 'Wireless Mouse', description: 'Ergonomic wireless mouse', category: 'electronics', price: 59, inStock: true },
]

const searchOptions = {
  keyword: 'laptop',
  categories: ['electronics'],
  priceRange: { min: 100, max: undefined },
  inStockOnly: true,
  sortBy: 'price-asc',
}

function searchProducts(products, options) {
  // 請在此實作完整搜尋邏輯
}

let result = searchProducts(products, searchOptions)
`,
        testCases: [
          { label: 'result 應有 1 筆', test: `return Array.isArray(result) && result.length === 1` },
          { label: '包含 Laptop Pro', test: `return result[0] && result[0].name === 'Laptop Pro'` },
          { label: '全部 inStock', test: `return result.every(p => p.inStock === true)` },
          { label: '全部 price >= 100', test: `return result.every(p => p.price >= 100)` },
          { label: '全部都是 electronics', test: `return result.every(p => p.category === 'electronics')` },
        ],
      },
    ],
  },

  // ─── 2. 模糊搜尋實作 ──────────────────────────────────────────────
  {
    slug: 'fuzzy-search',
    methodName: '模糊搜尋',
    title: '模糊搜尋實作',
    description: '在多個欄位中搜尋關鍵字，支援部分匹配與大小寫不敏感',
    subCategory: '資料過濾與搜尋',
    difficulty: 'medium',
    notes: {
      title: '模糊搜尋實作',
      sections: [
        {
          heading: '大小寫不敏感搜尋',
          content: `最基本的模糊搜尋是「包含即符合」加上大小寫不敏感：

\`\`\`js
function fuzzyMatch(text, keyword) {
  return text.toLowerCase().includes(keyword.toLowerCase())
}
\`\`\`

若需要支援 Unicode（如中文、日文），可改用 \`localeCompare\` 或正規表達式搭配 \`i\` flag：
\`\`\`js
const regex = new RegExp(keyword, 'i')
return regex.test(text)
\`\`\``,
        },
        {
          heading: '多欄位搜尋與 matchedFields',
          content: `搜尋多個欄位時，需要記錄哪些欄位符合：

\`\`\`js
function searchArticle(article, keyword) {
  const matchedFields = []
  const kw = keyword.toLowerCase()

  if (article.title.toLowerCase().includes(kw)) matchedFields.push('title')
  if (article.content.toLowerCase().includes(kw)) matchedFields.push('content')
  if (article.tags.some(t => t.toLowerCase().includes(kw))) matchedFields.push('tags')

  return matchedFields.length > 0
    ? { ...article, matchedFields }
    : null
}
\`\`\``,
        },
        {
          heading: '搜尋結果高亮',
          content: `高亮（highlight）是在原文中標記符合的片段，常見方式是加上 HTML tag 或特殊符號：

\`\`\`js
function highlight(text, keyword) {
  if (!keyword) return text
  const regex = new RegExp(\`(\${keyword})\`, 'gi')
  return text.replace(regex, '**$1**')
}

highlight('Hello World', 'world')
// => 'Hello **World**'
\`\`\`

注意：若 keyword 含有正規表達式特殊字元，需先用 \`escapeRegExp\` 處理。`,
        },
        {
          heading: '相關度排序',
          content: `搜尋結果的排序通常依相關度（relevance score）決定：

\`\`\`js
function calcScore(item, keyword) {
  let score = 0
  if (item.title === keyword) score += 100         // 完全符合
  else if (item.title.includes(keyword)) score += 50  // 標題包含
  if (item.content.includes(keyword)) score += 10     // 內容包含
  if (item.tags.includes(keyword)) score += 20        // tag 符合
  return score
}

results.sort((a, b) => calcScore(b, kw) - calcScore(a, kw))
\`\`\``,
        },
      ],
    },
    keyPoints: [
      '模糊搜尋最基本的做法是用 toLowerCase() + includes() 來實現大小寫不敏感的部分匹配。',
      '多欄位搜尋時，可以記錄哪些欄位（matchedFields）符合，讓前端可以做出更好的搜尋結果呈現。',
      '搜尋結果高亮通常用正規表達式的 replace 搭配 $1 back-reference 來替換符合的文字。',
      '多關鍵字 AND 邏輯是：每個關鍵字都必須在至少一個欄位中出現，用 keywords.every() 包裹多欄位搜尋來實作。',
      '相關度排序可以依照「完全符合」、「標題符合」、「其他欄位符合」給予不同分數，再以分數降序排列。',
    ],
    problems: [
      {
        id: 'basic-user-search',
        title: '搜尋使用者姓名與 Email',
        difficulty: 'easy',
        description: `請在 \`users[].name\` 和 \`users[].email\` 中搜尋關鍵字 \`keyword\`（不分大小寫，包含即符合）。
只要 name 或 email 其中一個包含關鍵字就保留，將結果存到 \`result\`。`,
        examples: [
          { input: `keyword = 'alice'`, output: `name 或 email 含 'alice' 的使用者` },
        ],
        initialCode: `const users = [
  { id: 1, name: 'Alice Chen', email: 'alice@example.com' },
  { id: 2, name: 'Bob Wang', email: 'bob.wang@gmail.com' },
  { id: 3, name: 'Carol Alice', email: 'carol@company.com' },
  { id: 4, name: 'Dave Lee', email: 'dave@alice-corp.com' },
  { id: 5, name: 'Eve Wu', email: 'eve@example.com' },
]

const keyword = 'alice'

// 搜尋 name 或 email 中包含 keyword（不分大小寫）
let result
`,
        testCases: [
          { label: 'result 應有 3 筆', test: `return Array.isArray(result) && result.length === 3` },
          { label: '包含 Alice Chen（name 符合）', test: `return result.some(u => u.name === 'Alice Chen')` },
          { label: '包含 Carol Alice（name 符合）', test: `return result.some(u => u.name === 'Carol Alice')` },
          { label: '包含 Dave Lee（email 符合）', test: `return result.some(u => u.name === 'Dave Lee')` },
          { label: '不包含 Eve Wu', test: `return !result.some(u => u.name === 'Eve Wu')` },
        ],
      },
      {
        id: 'article-search-matched-fields',
        title: '文章搜尋並記錄符合欄位',
        difficulty: 'easy',
        description: `請在 \`articles[].title\`、\`articles[].content\`、\`articles[].tags[]\` 中搜尋關鍵字 \`keyword\`。
符合的文章要加上 \`matchedFields\` 陣列，記錄哪些欄位有符合（如 \`['title', 'tags']\`）。
不符合的文章則不包含在結果中，將結果存到 \`result\`。`,
        initialCode: `const articles = [
  { id: 1, title: 'JavaScript Tips', content: 'Learn closures and promises', tags: ['js', 'frontend'] },
  { id: 2, title: 'React Hooks', content: 'useState and useEffect guide', tags: ['react', 'js'] },
  { id: 3, title: 'CSS Grid', content: 'Layout with modern CSS', tags: ['css', 'layout'] },
  { id: 4, title: 'Node.js Basics', content: 'JavaScript on the server side', tags: ['nodejs', 'backend'] },
]

const keyword = 'js'

// 搜尋並加上 matchedFields
let result
`,
        testCases: [
          { label: 'result 應有 3 筆', test: `return Array.isArray(result) && result.length === 3` },
          { label: '每筆都有 matchedFields 陣列', test: `return result.every(a => Array.isArray(a.matchedFields) && a.matchedFields.length > 0)` },
          { label: 'JavaScript Tips 的 matchedFields 含 title', test: `return result.find(a => a.id === 1)?.matchedFields.includes('title')` },
          { label: 'React Hooks 的 matchedFields 含 tags', test: `return result.find(a => a.id === 2)?.matchedFields.includes('tags')` },
          { label: 'CSS Grid 不在結果中', test: `return !result.some(a => a.id === 3)` },
        ],
      },
      {
        id: 'highlight-search',
        title: '高亮搜尋結果',
        difficulty: 'medium',
        description: `請實作 \`highlight(text, keyword)\` 函式，把 \`text\` 中符合 \`keyword\` 的部分（不分大小寫）加上 \`**\` 標記。
例如：\`highlight('Hello World', 'world')\` → \`'Hello **World**'\`

再用此函式處理 \`articles\` 的 \`title\`，將高亮後的結果存到 \`result\`（每筆是 \`{ ...article, title: highlightedTitle }\`）。`,
        examples: [
          { input: `highlight('Hello World', 'world')`, output: `'Hello **World**'` },
          { input: `highlight('JavaScript is great', 'java')`, output: `'**Java**Script is great'` },
        ],
        initialCode: `const articles = [
  { id: 1, title: 'JavaScript Basics' },
  { id: 2, title: 'Advanced JavaScript' },
  { id: 3, title: 'TypeScript Guide' },
]

const keyword = 'JavaScript'

function highlight(text, keyword) {
  // 把符合的部分加上 ** 標記（不分大小寫）
}

// 用 highlight 處理每篇文章的 title
let result
`,
        testCases: [
          { label: 'result 應有 3 筆', test: `return Array.isArray(result) && result.length === 3` },
          { label: 'id=1 的 title 含 **JavaScript**', test: `return result.find(a => a.id === 1)?.title === '**JavaScript** Basics'` },
          { label: 'id=2 的 title 含 **JavaScript**', test: `return result.find(a => a.id === 2)?.title === 'Advanced **JavaScript**'` },
          { label: 'id=3 的 title 不變（無符合）', test: `return result.find(a => a.id === 3)?.title === 'TypeScript Guide'` },
        ],
      },
      {
        id: 'multi-keyword-search',
        title: '多關鍵字搜尋（AND 邏輯）',
        difficulty: 'medium',
        description: `關鍵字以空格分隔，每個關鍵字都要出現在至少一個欄位中（AND 邏輯）。
搜尋欄位為 \`title\` 和 \`content\`（不分大小寫）。
將搜尋 \`keywordStr\` 的結果存到 \`result\`。`,
        examples: [
          {
            input: `keywordStr = 'react hooks'`,
            output: `title 或 content 同時含 'react' AND 含 'hooks' 的文章`,
          },
        ],
        initialCode: `const articles = [
  { id: 1, title: 'React Hooks Guide', content: 'Learn useState and useEffect in React' },
  { id: 2, title: 'React Basics', content: 'Introduction to React components' },
  { id: 3, title: 'JavaScript Hooks Pattern', content: 'Custom hooks are reusable functions' },
  { id: 4, title: 'Vue Composition API', content: 'Similar to React hooks but for Vue' },
]

const keywordStr = 'react hooks'

// 以空格分隔 keywordStr，每個關鍵字都要在 title 或 content 中出現（AND）
let result
`,
        testCases: [
          { label: 'result 應有 2 筆', test: `return Array.isArray(result) && result.length === 2` },
          { label: '包含 id=1（React Hooks Guide）', test: `return result.some(a => a.id === 1)` },
          { label: '包含 id=4（Vue，content 含 react hooks）', test: `return result.some(a => a.id === 4)` },
          { label: '不包含 id=2（只有 react，沒有 hooks）', test: `return !result.some(a => a.id === 2)` },
          { label: '不包含 id=3（只有 hooks，沒有 react）', test: `return !result.some(a => a.id === 3)` },
        ],
      },
      {
        id: 'relevance-sort',
        title: '搜尋結果依相關度排序',
        difficulty: 'hard',
        description: `搜尋文章的 \`title\` 和 \`content\`，並依相關度排序：
1. 標題完全符合（score +100）
2. 標題包含關鍵字（score +50）
3. content 包含關鍵字（score +10）

相關度相同時，維持原始順序（穩定排序）。
將搜尋 \`keyword\` 的文章依相關度降序排列，結果存到 \`result\`。`,
        initialCode: `const articles = [
  { id: 1, title: 'React', content: 'React is a UI library' },
  { id: 2, title: 'Advanced React Patterns', content: 'Design patterns in React apps' },
  { id: 3, title: 'Vue vs React', content: 'Comparing frontend frameworks' },
  { id: 4, title: 'JavaScript Guide', content: 'React is mentioned briefly here' },
]

const keyword = 'React'

// 計算每篇文章的相關度分數後排序
let result
`,
        testCases: [
          { label: 'result 應有 4 筆', test: `return Array.isArray(result) && result.length === 4` },
          { label: '第一筆是 id=1（標題完全符合）', test: `return result[0] && result[0].id === 1` },
          { label: '第二筆是 id=2 或 id=3（標題包含）', test: `return result[1] && (result[1].id === 2 || result[1].id === 3)` },
          { label: '最後一筆是 id=4（只有 content 符合）', test: `return result[result.length - 1] && result[result.length - 1].id === 4` },
          { label: 'result 每筆都有相關度（title 或 content 含 React）', test: `return result.every(a => a.title.toLowerCase().includes('react') || a.content.toLowerCase().includes('react'))` },
        ],
      },
    ],
  },

  // ─── 3. 資料去重與合併 ─────────────────────────────────────────────
  {
    slug: 'dedup-merge',
    methodName: '去重與合併',
    title: '資料去重與合併',
    description: '合併多份資料來源，處理重複項目，欄位合併策略',
    subCategory: '資料過濾與搜尋',
    difficulty: 'medium',
    notes: {
      title: '資料去重與合併',
      sections: [
        {
          heading: '基本去重策略',
          content: `去重最常用的工具是 \`Map\`，以唯一 key 為索引：

\`\`\`js
// 保留第一筆
function dedupKeepFirst(arr, keyField) {
  const seen = new Map()
  arr.forEach(item => {
    if (!seen.has(item[keyField])) seen.set(item[keyField], item)
  })
  return [...seen.values()]
}

// 保留最後筆（後蓋前）
function dedupKeepLast(arr, keyField) {
  const map = new Map()
  arr.forEach(item => map.set(item[keyField], item))
  return [...map.values()]
}
\`\`\``,
        },
        {
          heading: '欄位合併策略（Deep Merge）',
          content: `合併相同 id 的物件時，可能需要把兩筆的欄位合併（而非直接取代）：

\`\`\`js
function mergeById(arr1, arr2) {
  const map = new Map(arr1.map(item => [item.id, { ...item }]))
  arr2.forEach(item => {
    if (map.has(item.id)) {
      // 合併：後者覆蓋前者
      map.set(item.id, { ...map.get(item.id), ...item })
    } else {
      map.set(item.id, { ...item })
    }
  })
  return [...map.values()]
}
\`\`\``,
        },
        {
          heading: '出現次數計數再去重',
          content: `若要保留出現最多次的那筆，需要先計數再選取：

\`\`\`js
function dedupKeepMostFrequent(arr, keyField) {
  const countMap = new Map()
  const dataMap = new Map()

  arr.forEach(item => {
    const key = item[keyField]
    countMap.set(key, (countMap.get(key) || 0) + 1)
    if (!dataMap.has(key) || countMap.get(key) === 1) {
      dataMap.set(key, item)
    }
  })

  // 選取出現最多次的那筆
  // （此例假設每個 key 只保留一筆代表值）
  return [...dataMap.values()]
}
\`\`\``,
        },
        {
          heading: '多來源 id 欄位不一致',
          content: `真實場景中不同 API 可能用不同欄位名稱表示 id：

\`\`\`js
function normalizeId(item) {
  return {
    ...item,
    id: item.id ?? item.userId ?? item.user_id,
  }
}

const unified = [...source1, ...source2, ...source3].map(normalizeId)
// 再依 id 去重
\`\`\`

這種 normalize → deduplicate 的兩步驟流程是處理多來源資料的標準做法。`,
        },
      ],
    },
    keyPoints: [
      '去重最常用 Map 以唯一 key 索引，forEach 遍歷後取 values() 即可，保留第一筆或最後筆只差在是否覆蓋。',
      '欄位合併（merge）策略是：用 Map 存第一份資料，再遍歷第二份資料，遇到相同 id 則用展開運算子合併兩個物件。',
      '保留出現次數最多的那筆需要先計數再選取，通常用兩個 Map 分別記錄次數與資料本身。',
      '多來源 id 欄位不一致時，先做 normalize（統一欄位名稱），再做去重合併，是標準的兩步驟流程。',
      'Map 的插入順序是有序的，因此 [...map.values()] 可以保持原始的相對順序，適合需要穩定去重的場景。',
    ],
    problems: [
      {
        id: 'dedup-keep-first',
        title: '合併陣列：保留第一筆',
        difficulty: 'easy',
        description: `將 \`users1\` 和 \`users2\` 合併，依 \`id\` 去重，**保留第一份資料**的值（相同 id 時，\`users1\` 的值優先）。
將結果存到 \`result\`。`,
        examples: [
          {
            input: `users1 有 id=1（name: 'Alice'），users2 也有 id=1（name: 'Alex'）`,
            output: `保留 name: 'Alice'`,
          },
        ],
        initialCode: `const users1 = [
  { id: 1, name: 'Alice', role: 'admin' },
  { id: 2, name: 'Bob', role: 'user' },
  { id: 3, name: 'Carol', role: 'user' },
]

const users2 = [
  { id: 1, name: 'Alex', role: 'moderator' },
  { id: 4, name: 'Dave', role: 'user' },
  { id: 5, name: 'Eve', role: 'admin' },
]

// 合併並依 id 去重，相同 id 保留 users1 的值
let result
`,
        testCases: [
          { label: 'result 應有 5 筆', test: `return Array.isArray(result) && result.length === 5` },
          { label: 'id=1 的 name 應為 Alice（非 Alex）', test: `return result.find(u => u.id === 1)?.name === 'Alice'` },
          { label: '包含 Dave（id=4）', test: `return result.some(u => u.id === 4)` },
          { label: '包含 Eve（id=5）', test: `return result.some(u => u.id === 5)` },
        ],
      },
      {
        id: 'dedup-keep-last',
        title: '合併陣列：後者覆蓋前者',
        difficulty: 'easy',
        description: `將 \`users1\` 和 \`users2\` 合併，依 \`id\` 去重，**後來的資料覆蓋前面**（相同 id 時，\`users2\` 的值優先）。
將結果存到 \`result\`。`,
        initialCode: `const users1 = [
  { id: 1, name: 'Alice', score: 80 },
  { id: 2, name: 'Bob', score: 70 },
  { id: 3, name: 'Carol', score: 90 },
]

const users2 = [
  { id: 1, name: 'Alice', score: 95 },
  { id: 4, name: 'Dave', score: 60 },
]

// 合併並依 id 去重，相同 id 保留 users2 的值（後蓋前）
let result
`,
        testCases: [
          { label: 'result 應有 4 筆', test: `return Array.isArray(result) && result.length === 4` },
          { label: 'id=1 的 score 應為 95（users2 覆蓋）', test: `return result.find(u => u.id === 1)?.score === 95` },
          { label: 'id=2 的 score 應為 70（未被覆蓋）', test: `return result.find(u => u.id === 2)?.score === 70` },
          { label: '包含 Dave（id=4）', test: `return result.some(u => u.id === 4)` },
        ],
      },
      {
        id: 'field-merge',
        title: '合併相同 id 的欄位',
        difficulty: 'medium',
        description: `合併 \`profiles\` 和 \`settings\`，相同 \`id\` 的物件需要把欄位合併（兩邊都有的欄位取後者的值）。
將結果存到 \`result\`（每筆都是完整合併後的物件）。`,
        examples: [
          {
            input: `profiles id=1: { name, avatar }；settings id=1: { theme, avatar }`,
            output: `{ id: 1, name, avatar（取 settings 的值）, theme }`,
          },
        ],
        initialCode: `const profiles = [
  { id: 1, name: 'Alice', avatar: 'alice.png', bio: 'Developer' },
  { id: 2, name: 'Bob', avatar: 'bob.png', bio: 'Designer' },
  { id: 3, name: 'Carol', avatar: 'carol.png', bio: 'PM' },
]

const settings = [
  { id: 1, theme: 'dark', avatar: 'alice-new.png', notifications: true },
  { id: 2, theme: 'light', notifications: false },
  { id: 4, theme: 'dark', notifications: true },
]

// 合併：相同 id 的欄位合併（後者覆蓋前者），settings 無對應的 profile 也要加入
let result
`,
        testCases: [
          { label: 'result 應有 4 筆', test: `return Array.isArray(result) && result.length === 4` },
          { label: 'id=1 的 avatar 應為 alice-new.png（settings 覆蓋）', test: `return result.find(u => u.id === 1)?.avatar === 'alice-new.png'` },
          { label: 'id=1 保留 bio 欄位', test: `return result.find(u => u.id === 1)?.bio === 'Developer'` },
          { label: 'id=1 有 theme 和 notifications', test: `const u = result.find(u => u.id === 1); return u && u.theme === 'dark' && u.notifications === true` },
          { label: 'id=4（僅在 settings）也在結果中', test: `return result.some(u => u.id === 4)` },
        ],
      },
      {
        id: 'dedup-most-frequent',
        title: '去重：保留出現最多次的那筆',
        difficulty: 'medium',
        description: `\`records\` 中同一個 \`name\` 可能有多筆，每筆的 \`score\` 不同。
請去重後，每個 \`name\` 只保留出現次數最多的那個 \`score\`（若次數相同，保留第一個出現的）。
將結果存到 \`result\`（每筆是 \`{ name, score, count }\`，count 為該 name 出現的次數）。`,
        initialCode: `const records = [
  { name: 'Alice', score: 90 },
  { name: 'Bob', score: 70 },
  { name: 'Alice', score: 85 },
  { name: 'Bob', score: 70 },
  { name: 'Alice', score: 90 },
  { name: 'Bob', score: 80 },
  { name: 'Carol', score: 95 },
]

// Alice: score 90 出現 2 次，score 85 出現 1 次 → 保留 score 90
// Bob: score 70 出現 2 次，score 80 出現 1 次 → 保留 score 70
let result
`,
        testCases: [
          { label: 'result 應有 3 筆', test: `return Array.isArray(result) && result.length === 3` },
          { label: 'Alice 的 score 應為 90（最多次）', test: `return result.find(r => r.name === 'Alice')?.score === 90` },
          { label: 'Bob 的 score 應為 70（最多次）', test: `return result.find(r => r.name === 'Bob')?.score === 70` },
          { label: 'Alice 的 count 應為 3', test: `return result.find(r => r.name === 'Alice')?.count === 3` },
          { label: 'Carol 的 count 應為 1', test: `return result.find(r => r.name === 'Carol')?.count === 1` },
        ],
      },
      {
        id: 'multi-source-merge',
        title: '三份來源合併：統一 id 欄位名稱',
        difficulty: 'hard',
        description: `三份資料來源的 id 欄位名稱不一致：
- \`source1\` 用 \`id\`
- \`source2\` 用 \`userId\`
- \`source3\` 用 \`user_id\`

請先將三份來源統一正規化（都用 \`id\` 欄位），再合併並依 \`id\` 去重（後者覆蓋前者），將結果存到 \`result\`。
結果中每筆都應該只有 \`id\` 欄位（不含 \`userId\` 或 \`user_id\`）。`,
        initialCode: `const source1 = [
  { id: 1, name: 'Alice', source: 'db1' },
  { id: 2, name: 'Bob', source: 'db1' },
]

const source2 = [
  { userId: 2, name: 'Robert', source: 'db2' },
  { userId: 3, name: 'Carol', source: 'db2' },
]

const source3 = [
  { user_id: 3, name: 'Caroline', source: 'db3' },
  { user_id: 4, name: 'Dave', source: 'db3' },
]

// 正規化 → 合併 → 去重
let result
`,
        testCases: [
          { label: 'result 應有 4 筆', test: `return Array.isArray(result) && result.length === 4` },
          { label: 'id=2 的 name 應為 Robert（source2 覆蓋）', test: `return result.find(u => u.id === 2)?.name === 'Robert'` },
          { label: 'id=3 的 name 應為 Caroline（source3 覆蓋）', test: `return result.find(u => u.id === 3)?.name === 'Caroline'` },
          { label: '結果中沒有 userId 欄位', test: `return result.every(u => !('userId' in u))` },
          { label: '結果中沒有 user_id 欄位', test: `return result.every(u => !('user_id' in u))` },
        ],
      },
    ],
  },

  // ─── 4. 巢狀資料結構過濾 ──────────────────────────────────────────
  {
    slug: 'nested-filter',
    methodName: '巢狀資料過濾',
    title: '巢狀資料結構過濾',
    description: '在巢狀物件陣列中過濾資料，保留完整的父層結構',
    subCategory: '資料過濾與搜尋',
    difficulty: 'hard',
    notes: {
      title: '巢狀資料結構過濾',
      sections: [
        {
          heading: '保留父層 vs 過濾子陣列',
          content: `巢狀過濾有兩種常見需求，策略完全不同：

1. **保留完整父層**：只要父層符合條件（或其子節點符合），就保留整個父層物件
\`\`\`js
// 保留含有指定 productId 的完整訂單
orders.filter(order => order.items.some(item => item.productId === targetId))
\`\`\`

2. **同時過濾子陣列**：保留父層，但只保留符合條件的子項目
\`\`\`js
// 過濾訂單，同時只保留符合條件的 items
orders
  .map(order => ({ ...order, items: order.items.filter(item => item.qty > 1) }))
  .filter(order => order.items.length > 0)
\`\`\``,
        },
        {
          heading: '樹狀過濾（Tree Filter）',
          content: `選單、組織圖、目錄等常以樹狀結構存在，過濾時需要保留符合節點的所有祖先節點：

\`\`\`js
function filterTree(nodes, predicate) {
  return nodes.reduce((acc, node) => {
    const filteredChildren = node.children
      ? filterTree(node.children, predicate)
      : []

    if (predicate(node) || filteredChildren.length > 0) {
      acc.push({ ...node, children: filteredChildren })
    }
    return acc
  }, [])
}
\`\`\`

關鍵邏輯：**只要子節點有符合，父節點就要保留**。`,
        },
        {
          heading: '遞迴過濾與剪枝',
          content: `移除不符合條件的葉節點，並連帶移除因此變空的父節點（剪枝）：

\`\`\`js
function pruneTree(nodes, predicate) {
  return nodes.reduce((acc, node) => {
    if (node.children && node.children.length > 0) {
      const prunedChildren = pruneTree(node.children, predicate)
      if (prunedChildren.length > 0) {
        acc.push({ ...node, children: prunedChildren })
      }
    } else if (predicate(node)) {
      // 葉節點：直接判斷條件
      acc.push(node)
    }
    return acc
  }, [])
}
\`\`\``,
        },
        {
          heading: '多層巢狀搜尋與路徑回傳',
          content: `在多層巢狀結構中找到目標並回傳完整路徑：

\`\`\`js
function findWithPath(departments, predicate) {
  const results = []
  departments.forEach(dept => {
    dept.teams.forEach(team => {
      team.members.forEach(member => {
        if (predicate(member)) {
          results.push({
            department: dept.name,
            team: team.name,
            member,
          })
        }
      })
    })
  })
  return results
}
\`\`\``,
        },
      ],
    },
    keyPoints: [
      '巢狀過濾有兩種需求：保留完整父層（用 some() 判斷子陣列）vs 同時過濾子陣列（用 map + filter 組合）。',
      '樹狀過濾的核心邏輯是：只要有任何子孫節點符合條件，父節點就必須保留，需要用遞迴實作。',
      '剪枝（pruning）是樹狀過濾的進階版：移除不符合的葉節點後，若父節點的子節點全部被移除，父節點也要移除。',
      '多層巢狀搜尋回傳路徑時，通常用三層 forEach 或遞迴，將路徑資訊累積到結果物件中。',
      '處理巢狀結構時，一定要用展開運算子（...）複製物件，避免直接修改原始資料。',
    ],
    problems: [
      {
        id: 'filter-orders-by-product',
        title: '過濾含特定商品的訂單',
        difficulty: 'easy',
        description: `請過濾 \`orders\`，只保留 \`items[]\` 中含有 \`productId === targetProductId\` 的訂單（保留完整訂單）。
將結果存到 \`result\`。`,
        examples: [
          {
            input: `targetProductId = 'P002'`,
            output: `包含 P002 商品的完整訂單`,
          },
        ],
        initialCode: `const orders = [
  { orderId: 'O001', customer: 'Alice', items: [{ productId: 'P001', qty: 2 }, { productId: 'P002', qty: 1 }] },
  { orderId: 'O002', customer: 'Bob', items: [{ productId: 'P003', qty: 3 }] },
  { orderId: 'O003', customer: 'Carol', items: [{ productId: 'P002', qty: 1 }, { productId: 'P004', qty: 2 }] },
  { orderId: 'O004', customer: 'Dave', items: [{ productId: 'P001', qty: 1 }] },
]

const targetProductId = 'P002'

// 只保留 items 中含有 targetProductId 的完整訂單
let result
`,
        testCases: [
          { label: 'result 應有 2 筆', test: `return Array.isArray(result) && result.length === 2` },
          { label: '包含 O001（含 P002）', test: `return result.some(o => o.orderId === 'O001')` },
          { label: '包含 O003（含 P002）', test: `return result.some(o => o.orderId === 'O003')` },
          { label: '每筆都保留完整 items', test: `return result.every(o => Array.isArray(o.items) && o.items.length > 0)` },
          { label: '不包含 O002', test: `return !result.some(o => o.orderId === 'O002')` },
        ],
      },
      {
        id: 'filter-orders-and-items',
        title: '過濾訂單並同時過濾子項目',
        difficulty: 'medium',
        description: `請過濾訂單，只保留 \`status === 'paid'\` 的訂單，同時每筆訂單的 \`items[]\` 也只保留 \`qty >= 2\` 的項目。
若過濾後 items 為空，則該訂單不包含在結果中。將結果存到 \`result\`。`,
        initialCode: `const orders = [
  {
    orderId: 'O001', status: 'paid',
    items: [{ productId: 'P001', qty: 3 }, { productId: 'P002', qty: 1 }],
  },
  {
    orderId: 'O002', status: 'pending',
    items: [{ productId: 'P003', qty: 2 }],
  },
  {
    orderId: 'O003', status: 'paid',
    items: [{ productId: 'P004', qty: 1 }],
  },
  {
    orderId: 'O004', status: 'paid',
    items: [{ productId: 'P005', qty: 2 }, { productId: 'P006', qty: 3 }],
  },
]

// 只保留 status=paid 的訂單，且 items 只保留 qty>=2 的項目，items 為空則捨棄
let result
`,
        testCases: [
          { label: 'result 應有 2 筆', test: `return Array.isArray(result) && result.length === 2` },
          { label: '包含 O001', test: `return result.some(o => o.orderId === 'O001')` },
          { label: 'O001 只保留 qty>=2 的 items', test: `return result.find(o => o.orderId === 'O001')?.items.every(i => i.qty >= 2)` },
          { label: '不包含 O002（status=pending）', test: `return !result.some(o => o.orderId === 'O002')` },
          { label: '不包含 O003（items 過濾後為空）', test: `return !result.some(o => o.orderId === 'O003')` },
        ],
      },
      {
        id: 'tree-keyword-filter',
        title: '樹狀選單過濾：保留父節點',
        difficulty: 'medium',
        description: `請過濾 \`menu\` 樹狀結構，保留 \`label\` 含有 \`keyword\` 的節點，**父節點也要保留**（不論父節點本身是否符合）。
不符合且沒有符合子節點的節點則移除。將結果存到 \`result\`。`,
        initialCode: `const menu = [
  {
    id: 1, label: '產品管理',
    children: [
      { id: 2, label: '新增產品', children: [] },
      { id: 3, label: '產品列表', children: [] },
    ],
  },
  {
    id: 4, label: '訂單管理',
    children: [
      { id: 5, label: '訂單列表', children: [] },
      { id: 6, label: '訂單統計', children: [] },
    ],
  },
  {
    id: 7, label: '系統設定',
    children: [
      { id: 8, label: '使用者管理', children: [] },
    ],
  },
]

const keyword = '列表'

// 過濾出含 keyword 的節點，父節點也要保留
let result
`,
        testCases: [
          { label: 'result 應有 2 筆（父節點）', test: `return Array.isArray(result) && result.length === 2` },
          { label: '包含「產品管理」', test: `return result.some(n => n.label === '產品管理')` },
          { label: '包含「訂單管理」', test: `return result.some(n => n.label === '訂單管理')` },
          { label: '「產品管理」下只有「產品列表」', test: `const pm = result.find(n => n.label === '產品管理'); return pm && pm.children.length === 1 && pm.children[0].label === '產品列表'` },
          { label: '不包含「系統設定」', test: `return !result.some(n => n.label === '系統設定')` },
        ],
      },
      {
        id: 'prune-tree',
        title: '遞迴剪枝：移除不符合的葉節點',
        difficulty: 'hard',
        description: `請遞迴過濾 \`tree\` 結構，移除所有 \`active === false\` 的**葉節點**（沒有 children 或 children 為空的節點）。
若父節點的 children 過濾後變空，該父節點也要移除（遞迴剪枝）。
將結果存到 \`result\`。`,
        initialCode: `const tree = [
  {
    id: 1, name: '部門A', active: true,
    children: [
      { id: 2, name: '組A1', active: true, children: [] },
      { id: 3, name: '組A2', active: false, children: [] },
    ],
  },
  {
    id: 4, name: '部門B', active: true,
    children: [
      { id: 5, name: '組B1', active: false, children: [] },
      { id: 6, name: '組B2', active: false, children: [] },
    ],
  },
  {
    id: 7, name: '部門C', active: false, children: [] ,
  },
]

// 遞迴移除 active=false 的葉節點，並連帶移除因此變空的父節點
let result
`,
        testCases: [
          { label: 'result 應有 1 筆（頂層）', test: `return Array.isArray(result) && result.length === 1` },
          { label: '保留「部門A」', test: `return result[0] && result[0].name === '部門A'` },
          { label: '「部門A」下只有「組A1」', test: `return result[0]?.children.length === 1 && result[0].children[0].name === '組A1'` },
          { label: '「部門B」被移除（子節點全不 active）', test: `return !result.some(n => n.name === '部門B')` },
          { label: '「部門C」被移除（自身不 active）', test: `return !result.some(n => n.name === '部門C')` },
        ],
      },
      {
        id: 'nested-path-search',
        title: '多層巢狀搜尋並回傳完整路徑',
        difficulty: 'hard',
        description: `在 \`departments[].teams[].members[]\` 中找到所有 \`role === 'lead'\` 的成員，回傳包含完整路徑的結果。
每筆結果格式：\`{ departmentName, teamName, member }\`，將結果存到 \`result\`。`,
        initialCode: `const departments = [
  {
    name: '工程部',
    teams: [
      {
        name: '前端組',
        members: [
          { id: 1, name: 'Alice', role: 'lead' },
          { id: 2, name: 'Bob', role: 'engineer' },
        ],
      },
      {
        name: '後端組',
        members: [
          { id: 3, name: 'Carol', role: 'engineer' },
          { id: 4, name: 'Dave', role: 'lead' },
        ],
      },
    ],
  },
  {
    name: '設計部',
    teams: [
      {
        name: 'UI組',
        members: [
          { id: 5, name: 'Eve', role: 'lead' },
          { id: 6, name: 'Frank', role: 'designer' },
        ],
      },
    ],
  },
]

// 找出所有 role === 'lead' 的成員，回傳含路徑的結果
let result
`,
        testCases: [
          { label: 'result 應有 3 筆', test: `return Array.isArray(result) && result.length === 3` },
          { label: '每筆都有 departmentName、teamName、member', test: `return result.every(r => r.departmentName && r.teamName && r.member)` },
          { label: '包含 Alice 的路徑', test: `return result.some(r => r.member.name === 'Alice' && r.departmentName === '工程部' && r.teamName === '前端組')` },
          { label: '包含 Dave 的路徑', test: `return result.some(r => r.member.name === 'Dave' && r.teamName === '後端組')` },
          { label: '包含 Eve 的路徑（設計部）', test: `return result.some(r => r.member.name === 'Eve' && r.departmentName === '設計部')` },
        ],
      },
    ],
  },

  // ─── 5. 複合條件排序 ───────────────────────────────────────────────
  {
    slug: 'sort-complex',
    methodName: '複合條件排序',
    title: '複合條件排序',
    description: '對複雜物件陣列進行多欄位、多方向的排序，處理特殊值與中文排序',
    subCategory: '資料過濾與搜尋',
    difficulty: 'medium',
    notes: {
      title: '複合條件排序',
      sections: [
        {
          heading: '多欄位排序基礎',
          content: `多欄位排序的核心是：**主要條件相等時，才看次要條件**，使用 \`||\` 串接：

\`\`\`js
employees.sort((a, b) => {
  // 先依部門升序
  const deptOrder = a.department.localeCompare(b.department)
  if (deptOrder !== 0) return deptOrder

  // 同部門再依薪資降序
  return b.salary - a.salary
})
\`\`\`

也可以寫成簡潔的一行：
\`\`\`js
arr.sort((a, b) =>
  a.dept.localeCompare(b.dept) || b.salary - a.salary
)
\`\`\``,
        },
        {
          heading: '自訂順序排序',
          content: `當排序順序不是字母順序（如 high > medium > low），需要自訂優先序：

\`\`\`js
const priorityOrder = { high: 0, medium: 1, low: 2 }

tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
\`\`\`

這個技巧把字串對應到數字，再用數字排序，非常靈活。`,
        },
        {
          heading: '動態多欄位排序',
          content: `接收 sortConfig 陣列，動態決定排序欄位與方向：

\`\`\`js
function multiSort(arr, sortConfig) {
  return [...arr].sort((a, b) => {
    for (const { key, direction } of sortConfig) {
      const valA = a[key]
      const valB = b[key]
      let cmp = 0

      if (typeof valA === 'string') {
        cmp = valA.localeCompare(valB)
      } else {
        cmp = valA - valB
      }

      if (cmp !== 0) return direction === 'asc' ? cmp : -cmp
    }
    return 0
  })
}
\`\`\``,
        },
        {
          heading: 'null/undefined 處理與中文排序',
          content: `**null/undefined 放到最後：**
\`\`\`js
arr.sort((a, b) => {
  if (a.value == null) return 1   // a 是 null，放後面
  if (b.value == null) return -1  // b 是 null，放後面
  return a.value - b.value
})
\`\`\`

**中文排序（使用 localeCompare）：**
\`\`\`js
arr.sort((a, b) =>
  a.name.localeCompare(b.name, 'zh-TW', { sensitivity: 'base' })
)
\`\`\`
\`localeCompare\` 的第二個參數指定語系，\`'zh-TW'\` 會依注音/筆劃排序。`,
        },
      ],
    },
    keyPoints: [
      '多欄位排序的關鍵是：主要條件不相等就回傳，相等時才繼續比較次要條件，可用 || 短路運算子簡潔表達。',
      '自訂順序排序（如 high > medium > low）最常見的做法是建立一個優先序物件，把字串對應到數字，再做數字排序。',
      '動態排序接收 sortConfig 陣列，用 for...of 依序比較每個欄位，一旦某欄位不相等就回傳，遍歷完才代表完全相等。',
      '排序時把 null/undefined 放到最後的做法：遇到 null 的那邊回傳 1（代表排後面），另一邊回傳 -1（代表排前面）。',
      '中文排序應使用 localeCompare 並指定 zh-TW 語系，這樣可以正確依注音或筆劃排序，純字母排序無法處理中文。',
    ],
    problems: [
      {
        id: 'dept-salary-sort',
        title: '依部門升序、同部門依薪資降序',
        difficulty: 'easy',
        description: `請對 \`employees\` 陣列排序：先依 \`department\` 字母升序，同部門內再依 \`salary\` 降序。
將排序結果存到 \`result\`（不要修改原始陣列）。`,
        examples: [
          {
            input: `[{dept: 'HR', salary: 50}, {dept: 'Eng', salary: 80}, {dept: 'HR', salary: 70}]`,
            output: `[{dept: 'Eng', salary: 80}, {dept: 'HR', salary: 70}, {dept: 'HR', salary: 50}]`,
          },
        ],
        initialCode: `const employees = [
  { id: 1, name: 'Alice', department: 'Engineering', salary: 90000 },
  { id: 2, name: 'Bob', department: 'Marketing', salary: 60000 },
  { id: 3, name: 'Carol', department: 'Engineering', salary: 75000 },
  { id: 4, name: 'Dave', department: 'Marketing', salary: 80000 },
  { id: 5, name: 'Eve', department: 'Engineering', salary: 95000 },
]

// 不修改原始陣列，部門升序，同部門薪資降序
let result
`,
        testCases: [
          { label: 'result 應有 5 筆', test: `return Array.isArray(result) && result.length === 5` },
          { label: '前三筆是 Engineering', test: `return result[0].department === 'Engineering' && result[1].department === 'Engineering' && result[2].department === 'Engineering'` },
          { label: 'Engineering 中第一筆是 Eve（薪資最高 95000）', test: `return result[0].name === 'Eve'` },
          { label: 'Engineering 中第二筆是 Alice（90000）', test: `return result[1].name === 'Alice'` },
          { label: 'Marketing 中第一筆是 Dave（薪資最高 80000）', test: `return result[3].name === 'Dave'` },
        ],
      },
      {
        id: 'priority-sort',
        title: '依優先級排序（high > medium > low）',
        difficulty: 'easy',
        description: `請對 \`tasks\` 依 \`priority\` 排序：\`high\` 最前面，\`medium\` 居中，\`low\` 最後面。
這不是字母順序，需要自訂優先序。將結果存到 \`result\`（不修改原始陣列）。`,
        initialCode: `const tasks = [
  { id: 1, title: '修復登入 bug', priority: 'high' },
  { id: 2, title: '更新文件', priority: 'low' },
  { id: 3, title: '重構組件', priority: 'medium' },
  { id: 4, title: '部署上線', priority: 'high' },
  { id: 5, title: '優化效能', priority: 'medium' },
]

// 依 priority 排序：high > medium > low
let result
`,
        testCases: [
          { label: 'result 應有 5 筆', test: `return Array.isArray(result) && result.length === 5` },
          { label: '前兩筆都是 high', test: `return result[0].priority === 'high' && result[1].priority === 'high'` },
          { label: '第三、四筆都是 medium', test: `return result[2].priority === 'medium' && result[3].priority === 'medium'` },
          { label: '最後一筆是 low', test: `return result[4].priority === 'low'` },
          { label: '原始陣列未被修改', test: `return tasks[0].priority === 'high' && tasks[1].priority === 'low'` },
        ],
      },
      {
        id: 'dynamic-sort-config',
        title: '動態多欄位排序',
        difficulty: 'medium',
        description: `請實作 \`multiSort(arr, sortConfig)\` 函式，\`sortConfig\` 是排序配置陣列，每個元素有 \`key\` 和 \`direction\`（\`'asc'\` 或 \`'desc'\`）。
將 \`multiSort(employees, sortConfig)\` 的結果存到 \`result\`。`,
        examples: [
          {
            input: `sortConfig = [{ key: 'department', direction: 'asc' }, { key: 'salary', direction: 'desc' }]`,
            output: `先依部門升序，同部門依薪資降序`,
          },
        ],
        initialCode: `const employees = [
  { id: 1, name: 'Alice', department: 'Engineering', salary: 90000 },
  { id: 2, name: 'Bob', department: 'Marketing', salary: 60000 },
  { id: 3, name: 'Carol', department: 'Engineering', salary: 75000 },
  { id: 4, name: 'Dave', department: 'Marketing', salary: 80000 },
  { id: 5, name: 'Eve', department: 'HR', salary: 55000 },
]

const sortConfig = [
  { key: 'department', direction: 'asc' },
  { key: 'salary', direction: 'desc' },
]

function multiSort(arr, sortConfig) {
  // 請在此實作動態多欄位排序
}

let result = multiSort(employees, sortConfig)
`,
        testCases: [
          { label: 'result 應有 5 筆', test: `return Array.isArray(result) && result.length === 5` },
          { label: '第一筆是 Engineering 最高薪（Alice）', test: `return result[0].name === 'Alice'` },
          { label: '第二筆是 Engineering Carol', test: `return result[1].name === 'Carol'` },
          { label: '第三筆是 HR Eve', test: `return result[2].name === 'Eve'` },
          { label: 'Marketing 中 Dave 在 Bob 前面', test: `const daveIdx = result.findIndex(e => e.name === 'Dave'); const bobIdx = result.findIndex(e => e.name === 'Bob'); return daveIdx < bobIdx` },
        ],
      },
      {
        id: 'sort-null-last',
        title: '排序時把 null/undefined 值放到最後',
        difficulty: 'medium',
        description: `請對 \`products\` 依 \`rating\` 降序排序，但 \`rating\` 為 \`null\` 或 \`undefined\` 的項目放到最後。
將結果存到 \`result\`（不修改原始陣列）。`,
        initialCode: `const products = [
  { id: 1, name: 'Laptop', rating: 4.5 },
  { id: 2, name: 'Mouse', rating: null },
  { id: 3, name: 'Keyboard', rating: 4.8 },
  { id: 4, name: 'Monitor', rating: undefined },
  { id: 5, name: 'Headphones', rating: 4.2 },
]

// rating 降序，null/undefined 放最後
let result
`,
        testCases: [
          { label: 'result 應有 5 筆', test: `return Array.isArray(result) && result.length === 5` },
          { label: '第一筆是 Keyboard（rating 4.8）', test: `return result[0].name === 'Keyboard'` },
          { label: '第二筆是 Laptop（rating 4.5）', test: `return result[1].name === 'Laptop'` },
          { label: '第三筆是 Headphones（rating 4.2）', test: `return result[2].name === 'Headphones'` },
          { label: '最後兩筆的 rating 為 null 或 undefined', test: `return result[3].rating == null && result[4].rating == null` },
        ],
      },
      {
        id: 'chinese-locale-sort',
        title: '中文姓名排序（localeCompare）',
        difficulty: 'hard',
        description: `請對 \`users\` 依 \`name\`（中文姓名）使用 \`localeCompare\` 排序（語系 \`'zh-TW'\`，依注音/筆劃）。
同時確保是穩定排序（相同姓名時保持原始相對順序），將結果存到 \`result\`（不修改原始陣列）。`,
        examples: [
          { input: `['王小明', '李大華', '陳美玲']`, output: `依中文排序順序排列` },
        ],
        initialCode: `const users = [
  { id: 1, name: '王小明', age: 25 },
  { id: 2, name: '李大華', age: 30 },
  { id: 3, name: '陳美玲', age: 28 },
  { id: 4, name: '張偉', age: 22 },
  { id: 5, name: '林雅婷', age: 27 },
]

// 用 localeCompare 依中文排序（'zh-TW'）
let result
`,
        testCases: [
          { label: 'result 應有 5 筆', test: `return Array.isArray(result) && result.length === 5` },
          { label: '結果是依 zh-TW localeCompare 排序的', test: `const names = result.map(u => u.name); const sorted = [...names].sort((a, b) => a.localeCompare(b, 'zh-TW', { sensitivity: 'base' })); return JSON.stringify(names) === JSON.stringify(sorted)` },
          { label: '原始陣列未被修改', test: `return users[0].name === '王小明' && users[1].name === '李大華'` },
          { label: 'result 包含所有 5 位使用者', test: `return ['王小明', '李大華', '陳美玲', '張偉', '林雅婷'].every(n => result.some(u => u.name === n))` },
        ],
      },
    ],
  },
]
