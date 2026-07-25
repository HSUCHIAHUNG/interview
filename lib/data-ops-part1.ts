import type { MethodEntry } from './array-challenges'

export const dataOpsPart1: MethodEntry[] = [
  // ─── 資料轉換與格式化 ────────────────────────────────────────────

  {
    slug: 'array-to-lookup',
    methodName: '陣列轉查找表',
    title: '陣列轉查找表（Lookup Table）',
    description: '將陣列轉換為以特定欄位為 key 的物件，實現 O(1) 查找',
    subCategory: '資料轉換與格式化',
    difficulty: 'easy',
    notes: {
      title: '陣列轉查找表（Lookup Table）',
      sections: [
        {
          heading: '什麼是查找表？',
          content: `查找表（Lookup Table）是一種將陣列轉成物件的技巧，讓你可以用 O(1) 的時間複雜度直接透過 key 取得資料，而不需要每次都遍歷整個陣列（O(n)）。

常見場景：
- 後端回傳使用者列表，前端需要頻繁依 id 查找某位使用者
- 商品 slug → 商品資料的快速對應
- 路由 path → 設定物件的映射`,
        },
        {
          heading: '建立查找表的方式',
          content: `\`\`\`js
// 方法一：reduce（最常用）
const byId = users.reduce((acc, user) => {
  acc[user.id] = user
  return acc
}, {})

// 方法二：Object.fromEntries + map
const byId = Object.fromEntries(users.map(u => [u.id, u]))
\`\`\`

兩種方式都很常見，reduce 彈性最高，fromEntries 較簡潔。`,
        },
        {
          heading: '效能比較',
          content: `| 操作 | 陣列 | 查找表（物件）|
|------|------|--------------|
| 依 id 查找 | O(n) | O(1) |
| 遍歷所有 | O(n) | O(n) |
| 新增 | O(1) | O(1) |

若同一個 id 需要查找多次（如渲染列表、關聯查詢），一次建立查找表，往後每次查找都是 O(1)，整體效能大幅提升。`,
        },
        {
          heading: '從查找表還原陣列',
          content: `\`\`\`js
// Object.values 取所有值
const usersArray = Object.values(byId)

// Object.entries 取 [key, value] 對
const entries = Object.entries(byId)  // [['1', user1], ['2', user2]]
\`\`\`

注意：物件的 key 一律是字串，所以 \`byId[1]\` 等同 \`byId['1']\`，還原後型別要留意。`,
        },
      ],
    },
    keyPoints: [
      '查找表（Lookup Table）是把陣列轉成以特定欄位為 key 的物件，讓查找時間從 O(n) 降到 O(1)。',
      '最常用的建法是 reduce：users.reduce((acc, u) => { acc[u.id] = u; return acc }, {})。',
      '物件的 key 一律是字串，所以數字 id 存進去後變成 "1"、"2"，取用時要注意型別轉換。',
      '可以同時建立多個查找表（如 byId 和 byEmail），讓同一份資料支援多種查詢維度。',
      '用 Object.values(lookup) 可以把查找表還原回陣列，用 Object.entries 可以取得 [key, value] 對。',
    ],
    problems: [
      {
        id: 'users-by-id',
        title: '使用者陣列轉 id 查找表',
        difficulty: 'easy',
        description: `給定一個使用者陣列 \`users\`，每個元素有 \`id\`、\`name\`、\`email\` 欄位。
請將其轉換成以 \`id\` 為 key 的查找表，存到 \`result\`。

轉換後 \`result[1]\` 應直接回傳 id 為 1 的使用者物件。`,
        examples: [
          {
            input: `[{ id: 1, name: 'Alice', email: 'alice@example.com' }, ...]`,
            output: `{ 1: { id: 1, name: 'Alice', email: 'alice@example.com' }, ... }`,
          },
        ],
        initialCode: `const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Carol', email: 'carol@example.com' },
]

// 請將 users 轉成以 id 為 key 的查找表，存到 result
let result
`,
        testCases: [
          { label: 'result 應為物件', test: `return typeof result === 'object' && result !== null && !Array.isArray(result)` },
          { label: 'result[1].name 應為 "Alice"', test: `return result[1] && result[1].name === 'Alice'` },
          { label: 'result[2].name 應為 "Bob"', test: `return result[2] && result[2].name === 'Bob'` },
          { label: 'result[3].email 應為 "carol@example.com"', test: `return result[3] && result[3].email === 'carol@example.com'` },
          { label: 'result 應只有 3 個 key', test: `return Object.keys(result).length === 3` },
        ],
      },
      {
        id: 'products-by-slug',
        title: '商品陣列轉 slug 查找表',
        difficulty: 'easy',
        description: `給定 \`products\` 陣列，每個商品有 \`slug\`、\`name\`、\`price\` 欄位。
請轉換成以 \`slug\` 為 key 的查找表，存到 \`result\`。

例如 \`result['macbook-pro']\` 應回傳對應的商品物件。`,
        examples: [
          {
            input: `[{ slug: 'macbook-pro', name: 'MacBook Pro', price: 1999 }, ...]`,
            output: `{ 'macbook-pro': { slug: 'macbook-pro', name: 'MacBook Pro', price: 1999 }, ... }`,
          },
        ],
        initialCode: `const products = [
  { slug: 'macbook-pro', name: 'MacBook Pro', price: 1999 },
  { slug: 'ipad-air', name: 'iPad Air', price: 599 },
  { slug: 'airpods-pro', name: 'AirPods Pro', price: 249 },
]

// 請將 products 轉成以 slug 為 key 的查找表，存到 result
let result
`,
        testCases: [
          { label: 'result 應為物件', test: `return typeof result === 'object' && result !== null && !Array.isArray(result)` },
          { label: `result['macbook-pro'].price 應為 1999`, test: `return result['macbook-pro'] && result['macbook-pro'].price === 1999` },
          { label: `result['ipad-air'].name 應為 "iPad Air"`, test: `return result['ipad-air'] && result['ipad-air'].name === 'iPad Air'` },
          { label: `result['airpods-pro'].slug 應為 "airpods-pro"`, test: `return result['airpods-pro'] && result['airpods-pro'].slug === 'airpods-pro'` },
          { label: 'result 應有 3 個 key', test: `return Object.keys(result).length === 3` },
        ],
      },
      {
        id: 'partial-lookup',
        title: '轉換時只保留特定欄位',
        difficulty: 'medium',
        description: `給定 \`products\` 陣列（有 slug、name、price、stock、category 欄位），
請建立以 \`slug\` 為 key 的查找表，但每個值**只保留 \`name\` 和 \`price\`**，其餘欄位不要包含。

存到 \`result\`。`,
        examples: [
          {
            input: `{ slug: 'macbook', name: 'MacBook', price: 1999, stock: 10, category: 'laptop' }`,
            output: `{ 'macbook': { name: 'MacBook', price: 1999 } }`,
          },
        ],
        initialCode: `const products = [
  { slug: 'macbook', name: 'MacBook Pro', price: 1999, stock: 10, category: 'laptop' },
  { slug: 'ipad', name: 'iPad Air', price: 599, stock: 25, category: 'tablet' },
  { slug: 'airpods', name: 'AirPods Pro', price: 249, stock: 50, category: 'audio' },
]

// 請建立 slug 為 key 的查找表，每個 value 只保留 name 和 price
let result
`,
        testCases: [
          { label: `result['macbook'] 應存在`, test: `return result && result['macbook'] != null` },
          { label: `result['macbook'] 只有 name 和 price 兩個 key`, test: `return result['macbook'] && Object.keys(result['macbook']).length === 2` },
          { label: `result['macbook'].name 應為 "MacBook Pro"`, test: `return result['macbook'] && result['macbook'].name === 'MacBook Pro'` },
          { label: `result['ipad'].price 應為 599`, test: `return result['ipad'] && result['ipad'].price === 599` },
          { label: `result['airpods'] 不應有 stock 欄位`, test: `return result['airpods'] && result['airpods'].stock === undefined` },
        ],
      },
      {
        id: 'lookup-to-array',
        title: '查找表還原成陣列',
        difficulty: 'medium',
        description: `給定一個查找表 \`userMap\`（\`Record<string, User>\`），
請將其還原成使用者物件陣列，存到 \`result\`。

結果陣列中每個元素應與原本的使用者物件完全相同。`,
        examples: [
          {
            input: `{ '1': { id: 1, name: 'Alice' }, '2': { id: 2, name: 'Bob' } }`,
            output: `[{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]`,
          },
        ],
        initialCode: `const userMap = {
  '1': { id: 1, name: 'Alice', email: 'alice@example.com' },
  '2': { id: 2, name: 'Bob', email: 'bob@example.com' },
  '3': { id: 3, name: 'Carol', email: 'carol@example.com' },
}

// 請將 userMap 還原成物件陣列，存到 result
let result
`,
        testCases: [
          { label: 'result 應為陣列', test: `return Array.isArray(result)` },
          { label: 'result 應有 3 個元素', test: `return result.length === 3` },
          { label: 'result 包含 name 為 "Alice" 的元素', test: `return result.some(u => u.name === 'Alice')` },
          { label: 'result 包含 name 為 "Bob" 的元素', test: `return result.some(u => u.name === 'Bob')` },
          { label: 'result 包含 name 為 "Carol" 的元素', test: `return result.some(u => u.name === 'Carol')` },
        ],
      },
      {
        id: 'bidirectional-lookup',
        title: '建立雙向查找表',
        difficulty: 'hard',
        description: `給定 \`users\` 陣列（有 id、name、email 欄位），
請同時建立兩個查找表：
- \`byId\`：以 \`id\` 為 key
- \`byEmail\`：以 \`email\` 為 key

兩個查找表的 value 都是完整的使用者物件。`,
        examples: [
          {
            input: `[{ id: 1, name: 'Alice', email: 'alice@example.com' }]`,
            output: `byId[1] === { id:1, name:'Alice', ... }，byEmail['alice@example.com'] === { id:1, ... }`,
          },
        ],
        initialCode: `const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Carol', email: 'carol@example.com' },
]

// 請建立 byId（以 id 為 key）和 byEmail（以 email 為 key）兩個查找表
let byId
let byEmail
`,
        testCases: [
          { label: 'byId[1].name 應為 "Alice"', test: `return byId && byId[1] && byId[1].name === 'Alice'` },
          { label: 'byId[3].email 應為 "carol@example.com"', test: `return byId && byId[3] && byId[3].email === 'carol@example.com'` },
          { label: `byEmail['bob@example.com'].name 應為 "Bob"`, test: `return byEmail && byEmail['bob@example.com'] && byEmail['bob@example.com'].name === 'Bob'` },
          { label: `byEmail['alice@example.com'].id 應為 1`, test: `return byEmail && byEmail['alice@example.com'] && byEmail['alice@example.com'].id === 1` },
          { label: 'byId 和 byEmail 各有 3 個 key', test: `return Object.keys(byId).length === 3 && Object.keys(byEmail).length === 3` },
        ],
      },
    ],
  },

  {
    slug: 'reshape-data',
    methodName: '資料結構重塑',
    title: '資料結構重塑（Data Reshaping）',
    description: '將不同格式的資料結構互相轉換，適應不同的使用場景',
    subCategory: '資料轉換與格式化',
    difficulty: 'medium',
    notes: {
      title: '資料結構重塑（Data Reshaping）',
      sections: [
        {
          heading: '什麼是資料重塑？',
          content: `資料重塑是指在不改變資料內容的前提下，改變其結構形式，讓資料符合下游使用方的需求。

常見的重塑場景：
- 後端回傳 \`[{ key, value }]\` 格式，前端需要普通物件 \`{ key: value }\`
- 表格資料以二維陣列儲存，需要轉成物件陣列才能渲染
- API 回傳的巢狀結構需要攤平給元件使用`,
        },
        {
          heading: 'key-value 格式互轉',
          content: `\`\`\`js
// [{ key, value }] → 物件
const obj = pairs.reduce((acc, { key, value }) => {
  acc[key] = value
  return acc
}, {})

// 物件 → [{ key, value }]
const pairs = Object.entries(obj).map(([key, value]) => ({ key, value }))
\`\`\``,
        },
        {
          heading: '二維陣列與物件陣列互轉',
          content: `\`\`\`js
// 二維陣列（第一列是 headers）→ 物件陣列
const [headers, ...rows] = matrix
const objects = rows.map(row =>
  Object.fromEntries(headers.map((h, i) => [h, row[i]]))
)

// 物件陣列 → 二維陣列
const headers = Object.keys(objects[0])
const matrix = [headers, ...objects.map(o => headers.map(h => o[h]))]
\`\`\``,
        },
        {
          heading: 'API 回應重塑',
          content: `實際開發中，後端 API 格式經常不符合前端期望。重塑時要注意：

- 確認欄位名稱的對應關係
- 處理可能缺漏的欄位（設預設值）
- 型別轉換（字串 vs 數字）
- 避免意外修改原始資料（使用解構或展開）

\`\`\`js
const reshaped = {
  data: raw.users,
  total: raw.meta.total_count,
  page: raw.meta.current_page,
}
\`\`\``,
        },
      ],
    },
    keyPoints: [
      '資料重塑是在不改變內容的情況下改變結構，讓資料符合不同場景的使用需求。',
      'key-value 陣列轉物件最常用 reduce，物件轉 key-value 陣列則用 Object.entries + map。',
      '二維陣列轉物件陣列時，通常第一列是欄位名稱（headers），後續列是資料列。',
      'API 回應重塑要特別注意欄位命名差異（如 total_count vs total）和型別一致性。',
      'Object.fromEntries 搭配 Map 或 entries 陣列，是建立物件最簡潔的現代寫法。',
    ],
    problems: [
      {
        id: 'pairs-to-object',
        title: 'key-value 陣列轉物件',
        difficulty: 'easy',
        description: `給定 \`pairs\` 陣列，格式為 \`[{ key: string, value: any }]\`。
請將其轉成一般物件，存到 \`result\`。

例如 \`[{ key: 'name', value: 'Alice' }]\` → \`{ name: 'Alice' }\``,
        examples: [
          { input: `[{ key: 'name', value: 'Alice' }, { key: 'age', value: 25 }]`, output: `{ name: 'Alice', age: 25 }` },
        ],
        initialCode: `const pairs = [
  { key: 'name', value: 'Alice' },
  { key: 'age', value: 25 },
  { key: 'active', value: true },
  { key: 'city', value: 'Taipei' },
]

// 請將 pairs 轉成物件，存到 result
let result
`,
        testCases: [
          { label: 'result 應為物件', test: `return typeof result === 'object' && result !== null && !Array.isArray(result)` },
          { label: 'result.name 應為 "Alice"', test: `return result.name === 'Alice'` },
          { label: 'result.age 應為 25', test: `return result.age === 25` },
          { label: 'result.active 應為 true', test: `return result.active === true` },
          { label: 'result.city 應為 "Taipei"', test: `return result.city === 'Taipei'` },
        ],
      },
      {
        id: 'object-to-pairs',
        title: '物件轉 key-value 陣列',
        difficulty: 'easy',
        description: `給定物件 \`profile\`，請將其轉成 \`[{ key, value }]\` 格式的陣列，存到 \`result\`。

每個元素應有 \`key\` 和 \`value\` 兩個欄位，順序與 Object.entries 一致即可。`,
        examples: [
          { input: `{ name: 'Alice', age: 25 }`, output: `[{ key: 'name', value: 'Alice' }, { key: 'age', value: 25 }]` },
        ],
        initialCode: `const profile = {
  name: 'Alice',
  age: 25,
  city: 'Taipei',
  active: true,
}

// 請將 profile 轉成 [{ key, value }] 陣列，存到 result
let result
`,
        testCases: [
          { label: 'result 應為陣列', test: `return Array.isArray(result)` },
          { label: 'result 應有 4 個元素', test: `return result.length === 4` },
          { label: '每個元素都有 key 和 value 欄位', test: `return result.every(item => 'key' in item && 'value' in item)` },
          { label: '應包含 { key: "name", value: "Alice" }', test: `return result.some(item => item.key === 'name' && item.value === 'Alice')` },
          { label: '應包含 { key: "age", value: 25 }', test: `return result.some(item => item.key === 'age' && item.value === 25)` },
        ],
      },
      {
        id: 'matrix-to-objects',
        title: '二維陣列轉物件陣列',
        difficulty: 'medium',
        description: `給定二維陣列 \`matrix\`，第一列是欄位名稱（headers），後續列是資料。
請轉換成物件陣列，存到 \`result\`。

每個物件的 key 是 headers，value 是對應列的值。`,
        examples: [
          {
            input: `[['name', 'age'], ['Alice', 25], ['Bob', 30]]`,
            output: `[{ name: 'Alice', age: 25 }, { name: 'Bob', age: 30 }]`,
          },
        ],
        initialCode: `const matrix = [
  ['id', 'name', 'price', 'inStock'],
  [1, 'MacBook Pro', 1999, true],
  [2, 'iPad Air', 599, true],
  [3, 'AirPods Pro', 249, false],
]

// 請將 matrix 轉成物件陣列，存到 result（第一列為 headers）
let result
`,
        testCases: [
          { label: 'result 應為陣列', test: `return Array.isArray(result)` },
          { label: 'result 應有 3 個元素（不含 header 列）', test: `return result.length === 3` },
          { label: 'result[0].name 應為 "MacBook Pro"', test: `return result[0] && result[0].name === 'MacBook Pro'` },
          { label: 'result[1].price 應為 599', test: `return result[1] && result[1].price === 599` },
          { label: 'result[2].inStock 應為 false', test: `return result[2] && result[2].inStock === false` },
        ],
      },
      {
        id: 'objects-to-matrix',
        title: '物件陣列轉二維陣列',
        difficulty: 'medium',
        description: `給定 \`products\` 物件陣列，請轉換成二維陣列，存到 \`result\`。
第一列應為欄位名稱（headers），後續列為各商品的值，順序與 headers 一致。

Headers 順序依照第一個物件的 key 順序。`,
        examples: [
          {
            input: `[{ name: 'A', price: 10 }, { name: 'B', price: 20 }]`,
            output: `[['name', 'price'], ['A', 10], ['B', 20]]`,
          },
        ],
        initialCode: `const products = [
  { id: 1, name: 'MacBook Pro', price: 1999 },
  { id: 2, name: 'iPad Air', price: 599 },
  { id: 3, name: 'AirPods Pro', price: 249 },
]

// 請將 products 轉成二維陣列，存到 result（第一列為 headers）
let result
`,
        testCases: [
          { label: 'result 應為陣列', test: `return Array.isArray(result)` },
          { label: 'result 應有 4 列（1 header + 3 資料）', test: `return result.length === 4` },
          { label: 'result[0] 應為 headers 陣列', test: `return Array.isArray(result[0]) && result[0].includes('id') && result[0].includes('name') && result[0].includes('price')` },
          { label: 'result[1] 應包含 "MacBook Pro"', test: `return Array.isArray(result[1]) && result[1].includes('MacBook Pro')` },
          { label: 'result[3] 應包含 249', test: `return Array.isArray(result[3]) && result[3].includes(249)` },
        ],
      },
      {
        id: 'api-response-reshape',
        title: 'API 回應結構重塑',
        difficulty: 'hard',
        description: `後端 API 回傳的格式如下：
\`\`\`js
{ users: [...], meta: { total_count, current_page, per_page } }
\`\`\`
請將其重塑成前端期望的格式，存到 \`result\`：
\`\`\`js
{ data: [...], total: number, page: number, pageSize: number }
\`\`\`

其中 \`data\` 對應 \`users\`，\`total\` 對應 \`total_count\`，\`page\` 對應 \`current_page\`，\`pageSize\` 對應 \`per_page\`。`,
        examples: [
          {
            input: `{ users: [{...}], meta: { total_count: 100, current_page: 2, per_page: 10 } }`,
            output: `{ data: [{...}], total: 100, page: 2, pageSize: 10 }`,
          },
        ],
        initialCode: `const apiResponse = {
  users: [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
  ],
  meta: {
    total_count: 50,
    current_page: 3,
    per_page: 2,
  },
}

// 請將 apiResponse 重塑成 { data, total, page, pageSize } 格式，存到 result
let result
`,
        testCases: [
          { label: 'result.data 應為陣列', test: `return result && Array.isArray(result.data)` },
          { label: 'result.data 應有 2 個元素', test: `return result && result.data.length === 2` },
          { label: 'result.total 應為 50', test: `return result && result.total === 50` },
          { label: 'result.page 應為 3', test: `return result && result.page === 3` },
          { label: 'result.pageSize 應為 2', test: `return result && result.pageSize === 2` },
        ],
      },
    ],
  },

  {
    slug: 'flatten-nested',
    methodName: '巢狀資料扁平化',
    title: '巢狀資料扁平化與樹狀還原',
    description: '將多層巢狀的樹狀結構扁平化，或將扁平資料還原成樹狀',
    subCategory: '資料轉換與格式化',
    difficulty: 'medium',
    notes: {
      title: '巢狀資料扁平化與樹狀還原',
      sections: [
        {
          heading: '樹狀結構與扁平化的應用場景',
          content: `樹狀結構（Tree）廣泛存在於：
- 評論與回覆（children 巢狀）
- 組織架構圖（部門層級）
- 檔案系統（資料夾）
- 選單導覽（多層下拉）

扁平化的目的通常是：
- 方便遍歷和渲染
- 存入資料庫（關聯式 DB 不易存樹）
- 搜尋和過濾操作`,
        },
        {
          heading: 'DFS vs BFS 扁平化',
          content: `\`\`\`js
// DFS（深度優先）— 使用遞迴或 stack
function flattenDFS(nodes, result = []) {
  for (const node of nodes) {
    result.push(node)
    if (node.children?.length) flattenDFS(node.children, result)
  }
  return result
}

// BFS（廣度優先）— 使用 queue
function flattenBFS(roots) {
  const result = []
  const queue = [...roots]
  while (queue.length) {
    const node = queue.shift()
    result.push(node)
    if (node.children?.length) queue.push(...node.children)
  }
  return result
}
\`\`\``,
        },
        {
          heading: 'Dot Notation 扁平化',
          content: `將巢狀物件扁平化成 dot notation 格式（\`'a.b.c': value\`），常見於設定檔處理、i18n 翻譯 key：

\`\`\`js
function flattenObject(obj, prefix = '') {
  return Object.entries(obj).reduce((acc, [key, val]) => {
    const fullKey = prefix ? \`\${prefix}.\${key}\` : key
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      Object.assign(acc, flattenObject(val, fullKey))
    } else {
      acc[fullKey] = val
    }
    return acc
  }, {})
}
\`\`\``,
        },
        {
          heading: '從扁平陣列還原樹狀結構',
          content: `利用查找表可以有效率地還原樹：

\`\`\`js
function buildTree(flatList) {
  const map = {}
  const roots = []
  for (const item of flatList) {
    map[item.id] = { ...item, children: [] }
  }
  for (const item of flatList) {
    if (item.parentId == null) {
      roots.push(map[item.id])
    } else {
      map[item.parentId].children.push(map[item.id])
    }
  }
  return roots
}
\`\`\`

時間複雜度 O(n)，遠優於遞迴查找的 O(n²)。`,
        },
      ],
    },
    keyPoints: [
      '樹狀結構扁平化有 DFS（深度優先）和 BFS（廣度優先）兩種方式，DFS 用遞迴或 stack，BFS 用 queue。',
      '扁平化時可以加上 depth（層級）和 parentId（父節點 id）欄位，方便後續還原或渲染縮排。',
      'Dot notation 扁平化（{ "a.b.c": value }）常用於設定檔和 i18n 翻譯 key 的處理。',
      '從扁平陣列還原樹狀結構，最有效率的做法是先建立 id → node 查找表，再設定 parent-child 關係，時間複雜度 O(n)。',
      '處理巢狀結構時要注意無限遞迴的風險，可以追蹤已訪問節點或限制遞迴深度。',
    ],
    problems: [
      {
        id: 'flatten-tree-bfs',
        title: '評論樹扁平化（BFS/DFS）',
        difficulty: 'easy',
        description: `給定有 \`children[]\` 的評論樹 \`comments\`，請將其扁平化成一維陣列，存到 \`result\`。

扁平化後的陣列應包含所有節點（包含巢狀的子評論），不需保留 children 欄位。
順序不限（DFS 或 BFS 均可）。`,
        examples: [
          {
            input: `[{ id: 1, text: 'A', children: [{ id: 2, text: 'B', children: [] }] }]`,
            output: `[{ id: 1, text: 'A', ... }, { id: 2, text: 'B', ... }]（共 2 個元素）`,
          },
        ],
        initialCode: `const comments = [
  {
    id: 1, text: '第一則評論', children: [
      { id: 3, text: '回覆 1-1', children: [
        { id: 5, text: '回覆 1-1-1', children: [] }
      ]},
      { id: 4, text: '回覆 1-2', children: [] },
    ]
  },
  {
    id: 2, text: '第二則評論', children: [
      { id: 6, text: '回覆 2-1', children: [] }
    ]
  },
]

// 請將 comments 樹狀結構扁平化成一維陣列，存到 result
let result
`,
        testCases: [
          { label: 'result 應為陣列', test: `return Array.isArray(result)` },
          { label: 'result 應有 6 個元素（所有節點）', test: `return result.length === 6` },
          { label: '應包含 id 為 1 的節點', test: `return result.some(n => n.id === 1)` },
          { label: '應包含 id 為 5 的最深層節點', test: `return result.some(n => n.id === 5)` },
          { label: '應包含 id 為 6 的節點', test: `return result.some(n => n.id === 6)` },
        ],
      },
      {
        id: 'flatten-with-depth',
        title: '扁平化並加上 depth 和 parentId',
        difficulty: 'medium',
        description: `給定評論樹 \`comments\`，請扁平化並在每個節點加上：
- \`depth\`：層級深度（根節點為 0，子節點依此遞增）
- \`parentId\`：父節點的 id（根節點為 \`null\`）

將結果存到 \`result\`，children 欄位可保留也可移除。`,
        examples: [
          {
            input: `根節點 id:1，子節點 id:2`,
            output: `[{ id:1, depth:0, parentId:null }, { id:2, depth:1, parentId:1 }]`,
          },
        ],
        initialCode: `const comments = [
  {
    id: 1, text: '根留言 A', children: [
      { id: 3, text: '回覆 A-1', children: [
        { id: 5, text: '回覆 A-1-1', children: [] }
      ]},
    ]
  },
  {
    id: 2, text: '根留言 B', children: [
      { id: 4, text: '回覆 B-1', children: [] }
    ]
  },
]

// 請扁平化並為每個節點加上 depth 和 parentId，存到 result
let result
`,
        testCases: [
          { label: 'result 應有 5 個元素', test: `return Array.isArray(result) && result.length === 5` },
          { label: 'id 為 1 的節點 depth 應為 0，parentId 應為 null', test: `const n = result.find(n => n.id === 1); return n && n.depth === 0 && n.parentId === null` },
          { label: 'id 為 3 的節點 depth 應為 1，parentId 應為 1', test: `const n = result.find(n => n.id === 3); return n && n.depth === 1 && n.parentId === 1` },
          { label: 'id 為 5 的節點 depth 應為 2', test: `const n = result.find(n => n.id === 5); return n && n.depth === 2` },
          { label: 'id 為 4 的節點 parentId 應為 2', test: `const n = result.find(n => n.id === 4); return n && n.parentId === 2` },
        ],
      },
      {
        id: 'flatten-dot-notation',
        title: '巢狀物件扁平化為 dot notation',
        difficulty: 'medium',
        description: `給定巢狀物件 \`config\`，請將其扁平化成 dot notation 格式，存到 \`result\`。

例如 \`{ a: { b: { c: 1 } } }\` → \`{ 'a.b.c': 1 }\`

只需處理普通物件（不需處理陣列值，遇到陣列直接作為值保留）。`,
        examples: [
          {
            input: `{ db: { host: 'localhost', port: 5432 } }`,
            output: `{ 'db.host': 'localhost', 'db.port': 5432 }`,
          },
        ],
        initialCode: `const config = {
  db: {
    host: 'localhost',
    port: 5432,
    credentials: {
      user: 'admin',
      password: 'secret',
    },
  },
  app: {
    name: 'MyApp',
    debug: false,
  },
}

// 請將 config 扁平化為 dot notation 物件，存到 result
let result
`,
        testCases: [
          { label: `result['db.host'] 應為 'localhost'`, test: `return result && result['db.host'] === 'localhost'` },
          { label: `result['db.port'] 應為 5432`, test: `return result && result['db.port'] === 5432` },
          { label: `result['db.credentials.user'] 應為 'admin'`, test: `return result && result['db.credentials.user'] === 'admin'` },
          { label: `result['app.name'] 應為 'MyApp'`, test: `return result && result['app.name'] === 'MyApp'` },
          { label: `result['app.debug'] 應為 false`, test: `return result && result['app.debug'] === false` },
        ],
      },
      {
        id: 'unflatten-dot-notation',
        title: '還原 dot notation 為巢狀物件',
        difficulty: 'hard',
        description: `給定 dot notation 格式的扁平物件 \`flat\`，請還原成巢狀物件，存到 \`result\`。

例如 \`{ 'a.b.c': 1 }\` → \`{ a: { b: { c: 1 } } }\``,
        examples: [
          {
            input: `{ 'db.host': 'localhost', 'db.port': 5432 }`,
            output: `{ db: { host: 'localhost', port: 5432 } }`,
          },
        ],
        initialCode: `const flat = {
  'db.host': 'localhost',
  'db.port': 5432,
  'db.credentials.user': 'admin',
  'app.name': 'MyApp',
  'app.debug': false,
}

// 請將 flat 還原成巢狀物件，存到 result
let result
`,
        testCases: [
          { label: 'result.db 應為物件', test: `return result && typeof result.db === 'object'` },
          { label: 'result.db.host 應為 "localhost"', test: `return result && result.db && result.db.host === 'localhost'` },
          { label: 'result.db.port 應為 5432', test: `return result && result.db && result.db.port === 5432` },
          { label: 'result.db.credentials.user 應為 "admin"', test: `return result && result.db && result.db.credentials && result.db.credentials.user === 'admin'` },
          { label: 'result.app.name 應為 "MyApp"', test: `return result && result.app && result.app.name === 'MyApp'` },
        ],
      },
      {
        id: 'flat-to-tree',
        title: '扁平陣列還原成樹狀結構',
        difficulty: 'hard',
        description: `給定含有 \`parentId\` 欄位的扁平陣列 \`nodes\`，請還原成樹狀結構，存到 \`result\`。

\`result\` 應為根節點陣列（parentId 為 null 的節點），每個節點有 \`children\` 陣列包含子節點。`,
        examples: [
          {
            input: `[{ id:1, parentId:null }, { id:2, parentId:1 }]`,
            output: `[{ id:1, children:[{ id:2, children:[] }] }]`,
          },
        ],
        initialCode: `const nodes = [
  { id: 1, name: '根節點 A', parentId: null },
  { id: 2, name: '根節點 B', parentId: null },
  { id: 3, name: 'A 的子節點 1', parentId: 1 },
  { id: 4, name: 'A 的子節點 2', parentId: 1 },
  { id: 5, name: 'A-1 的子節點', parentId: 3 },
  { id: 6, name: 'B 的子節點', parentId: 2 },
]

// 請將扁平陣列還原成樹狀結構，存到 result（根節點陣列）
let result
`,
        testCases: [
          { label: 'result 應為陣列', test: `return Array.isArray(result)` },
          { label: 'result 應有 2 個根節點', test: `return result.length === 2` },
          { label: 'id 為 1 的根節點應有 2 個子節點', test: `const r1 = result.find(n => n.id === 1); return r1 && Array.isArray(r1.children) && r1.children.length === 2` },
          { label: 'id 為 3 的節點下應有 id 為 5 的子節點', test: `const r1 = result.find(n => n.id === 1); const n3 = r1 && r1.children.find(n => n.id === 3); return n3 && n3.children.some(n => n.id === 5)` },
          { label: 'id 為 2 的根節點應有 1 個子節點', test: `const r2 = result.find(n => n.id === 2); return r2 && Array.isArray(r2.children) && r2.children.length === 1` },
        ],
      },
    ],
  },

  {
    slug: 'serialize-parse',
    methodName: '序列化與解析',
    title: '資料序列化與解析',
    description: '在物件陣列、CSV、Query String 等格式之間互相轉換',
    subCategory: '資料轉換與格式化',
    difficulty: 'medium',
    notes: {
      title: '資料序列化與解析',
      sections: [
        {
          heading: '序列化與解析的概念',
          content: `**序列化（Serialize）**：將資料結構轉換成可傳輸或儲存的字串格式。
**解析（Parse）**：將字串格式轉換回程式可使用的資料結構。

常見格式：
| 格式 | 用途 |
|------|------|
| JSON | API 溝通、設定檔 |
| Query String | URL 參數 |
| CSV | 試算表匯出、批次資料 |
| Base64 | 圖片、二進位資料 |`,
        },
        {
          heading: 'Query String 處理',
          content: `\`\`\`js
// 解析（原生）
const params = new URLSearchParams('name=Alice&age=25')
params.get('name')  // 'Alice'（字串！）

// 手動解析（處理型別轉換）
function parseQS(qs) {
  return Object.fromEntries(
    qs.split('&').map(pair => {
      const [k, v] = pair.split('=')
      return [decodeURIComponent(k), autoType(decodeURIComponent(v))]
    })
  )
}

// 陣列參數：tags=js&tags=react → { tags: ['js', 'react'] }
\`\`\``,
        },
        {
          heading: 'CSV 處理注意事項',
          content: `CSV 格式看似簡單，但有幾個陷阱：

1. **逗號在值中**：值本身包含逗號時，需用引號包裹：\`"New York, NY"\`
2. **引號在值中**：引號要用兩個引號跳脫：\`"She said ""hello"""\`
3. **換行符**：Windows 是 \`\\r\\n\`，Unix 是 \`\\n\`
4. **編碼**：Excel 預設 UTF-8 with BOM

\`\`\`js
// 簡單版（不處理引號跳脫）
const csv = [headers, ...rows].join('\\n')

// 安全版（處理含逗號的值）
const escape = val => String(val).includes(',') ? \`"\${val}"\` : val
\`\`\``,
        },
        {
          heading: 'JSON 自訂序列化',
          content: `\`JSON.stringify\` 支援 \`replacer\` 函式，可自訂序列化行為：

\`\`\`js
// 過濾敏感欄位
JSON.stringify(user, (key, value) => {
  if (key === 'password') return undefined
  return value
})

// 自訂數字格式
JSON.stringify(data, (key, value) => {
  if (typeof value === 'number') return Math.round(value * 100) / 100
  return value
})

// reviver 做型別還原
JSON.parse(str, (key, value) => {
  if (key === 'date') return new Date(value)
  return value
})
\`\`\``,
        },
      ],
    },
    keyPoints: [
      'Query String 解析時，所有值預設都是字串，需要手動轉換數字（Number 或 parseInt）和布林值（=== "true"）。',
      '物件轉 Query String 時，陣列值要展開成多個同名參數（如 tags=js&tags=react）或用逗號分隔。',
      'CSV 格式中，如果值本身包含逗號，要用雙引號包裹；如果值包含雙引號，要用兩個雙引號跳脫。',
      'JSON.stringify 的第二個參數 replacer 可以是函式或陣列，用來控制哪些欄位要序列化、如何序列化。',
      'JSON.parse 的第二個參數 reviver 可以在解析後做型別還原，例如把日期字串轉回 Date 物件。',
    ],
    problems: [
      {
        id: 'parse-query-string',
        title: '解析 Query String',
        difficulty: 'easy',
        description: `給定 Query String \`qs\`，請將其解析成物件，存到 \`result\`。

需做型別轉換：
- 純數字字串 → 數字（如 \`'25'\` → \`25\`）
- \`'true'\`/\`'false'\` → 布林值
- 其他 → 保留字串`,
        examples: [
          { input: `'name=Alice&age=25&active=true'`, output: `{ name: 'Alice', age: 25, active: true }` },
        ],
        initialCode: `const qs = 'name=Alice&age=25&active=true&city=Taipei'

// 請解析 qs 為物件（含型別轉換），存到 result
let result
`,
        testCases: [
          { label: 'result.name 應為字串 "Alice"', test: `return result && result.name === 'Alice'` },
          { label: 'result.age 應為數字 25', test: `return result && result.age === 25 && typeof result.age === 'number'` },
          { label: 'result.active 應為布林值 true', test: `return result && result.active === true && typeof result.active === 'boolean'` },
          { label: 'result.city 應為字串 "Taipei"', test: `return result && result.city === 'Taipei'` },
          { label: 'result 應有 4 個 key', test: `return result && Object.keys(result).length === 4` },
        ],
      },
      {
        id: 'object-to-query-string',
        title: '物件轉 Query String',
        difficulty: 'easy',
        description: `給定物件 \`params\`（含陣列欄位），請轉成 Query String，存到 \`result\`。

陣列欄位（如 \`tags\`）需展開成多個同名參數：\`tags=js&tags=react\`。

非陣列欄位直接轉成 \`key=value\`。`,
        examples: [
          {
            input: `{ name: 'Alice', tags: ['js', 'react'] }`,
            output: `'name=Alice&tags=js&tags=react'（順序以物件 key 順序為準）`,
          },
        ],
        initialCode: `const params = {
  name: 'Alice',
  age: 25,
  tags: ['javascript', 'react', 'nextjs'],
  active: true,
}

// 請將 params 轉成 Query String（陣列展開為多個同名參數），存到 result
let result
`,
        testCases: [
          { label: 'result 應為字串', test: `return typeof result === 'string'` },
          { label: 'result 應包含 "name=Alice"', test: `return result.includes('name=Alice')` },
          { label: 'result 應包含 "age=25"', test: `return result.includes('age=25')` },
          { label: 'result 應包含三個 tags 參數', test: `return (result.match(/tags=/g) || []).length === 3` },
          { label: 'result 應包含 "tags=javascript"', test: `return result.includes('tags=javascript')` },
        ],
      },
      {
        id: 'objects-to-csv',
        title: '物件陣列轉 CSV 字串',
        difficulty: 'medium',
        description: `給定 \`records\` 物件陣列，請轉成 CSV 字串，存到 \`result\`。

規則：
- 第一列為欄位名稱（headers）
- 若值包含逗號，該值需用雙引號包裹
- 列之間用 \`\\n\` 分隔`,
        examples: [
          {
            input: `[{ name: 'Alice', city: 'New York, NY' }]`,
            output: `'name,city\\nAlice,"New York, NY"'`,
          },
        ],
        initialCode: `const records = [
  { id: 1, name: 'Alice', city: 'Taipei' },
  { id: 2, name: 'Bob', city: 'New York, NY' },
  { id: 3, name: 'Carol', city: 'London' },
]

// 請將 records 轉成 CSV 字串（含逗號的值用雙引號包裹），存到 result
let result
`,
        testCases: [
          { label: 'result 應為字串', test: `return typeof result === 'string'` },
          { label: '第一列應為 headers', test: `return result.split('\\n')[0].includes('id') && result.split('\\n')[0].includes('name') && result.split('\\n')[0].includes('city')` },
          { label: 'result 應有 4 列（header + 3 資料）', test: `return result.split('\\n').length === 4` },
          { label: '"New York, NY" 應被雙引號包裹', test: `return result.includes('"New York, NY"')` },
          { label: '"Taipei" 不需要雙引號', test: `return result.includes('Taipei') && !result.includes('"Taipei"')` },
        ],
      },
      {
        id: 'csv-to-objects',
        title: 'CSV 字串解析成物件陣列',
        difficulty: 'medium',
        description: `給定 CSV 字串 \`csv\`（第一列是 headers），請解析成物件陣列，存到 \`result\`。

暫不需處理引號跳脫，但需以第一列 headers 作為 key。`,
        examples: [
          {
            input: `'id,name,price\\n1,MacBook,1999\\n2,iPad,599'`,
            output: `[{ id: '1', name: 'MacBook', price: '1999' }, ...]（值為字串即可）`,
          },
        ],
        initialCode: `const csv = \`id,name,price,inStock
1,MacBook Pro,1999,true
2,iPad Air,599,true
3,AirPods Pro,249,false\`

// 請將 csv 解析成物件陣列，存到 result（值保留字串型別即可）
let result
`,
        testCases: [
          { label: 'result 應為陣列', test: `return Array.isArray(result)` },
          { label: 'result 應有 3 個元素', test: `return result.length === 3` },
          { label: 'result[0].name 應為 "MacBook Pro"', test: `return result[0] && result[0].name === 'MacBook Pro'` },
          { label: 'result[1].id 應為 "2" 或 2', test: `return result[1] && (result[1].id === '2' || result[1].id === 2)` },
          { label: 'result[2].price 應為 "249" 或 249', test: `return result[2] && (result[2].price === '249' || result[2].price === 249)` },
        ],
      },
      {
        id: 'custom-json-replacer',
        title: '自訂 JSON 序列化（replacer）',
        difficulty: 'hard',
        description: `給定物件 \`data\`，請使用 \`JSON.stringify\` 搭配自訂 \`replacer\` 進行序列化，存到 \`result\`。

replacer 規則：
- 過濾掉 key 為 \`'password'\` 或 \`'secret'\` 的欄位（回傳 undefined）
- 將 \`Date\` 物件轉成 ISO 字串（\`toISOString()\`）
- 其他值維持原樣

\`result\` 為序列化後的 JSON 字串，解析後不應含有 password 和 secret 欄位。`,
        examples: [
          {
            input: `{ name: 'Alice', password: '123', createdAt: new Date('2024-01-01') }`,
            output: `'{"name":"Alice","createdAt":"2024-01-01T00:00:00.000Z"}'`,
          },
        ],
        initialCode: `const data = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  password: 'super-secret-123',
  role: 'admin',
  secret: 'token-abc',
  createdAt: new Date('2024-06-15'),
  tags: ['js', 'react'],
}

// 請使用帶有自訂 replacer 的 JSON.stringify 序列化 data，存到 result
let result
`,
        testCases: [
          { label: 'result 應為字串', test: `return typeof result === 'string'` },
          { label: 'result 解析後不含 password 欄位', test: `const parsed = JSON.parse(result); return !('password' in parsed)` },
          { label: 'result 解析後不含 secret 欄位', test: `const parsed = JSON.parse(result); return !('secret' in parsed)` },
          { label: 'result 解析後 name 應為 "Alice"', test: `const parsed = JSON.parse(result); return parsed.name === 'Alice'` },
          { label: 'result 解析後 tags 應為陣列', test: `const parsed = JSON.parse(result); return Array.isArray(parsed.tags)` },
        ],
      },
    ],
  },

  {
    slug: 'normalize-data',
    methodName: '資料標準化',
    title: '多來源資料標準化',
    description: '合併不同來源、格式不一致的資料，進行欄位重命名、型別轉換、填補預設值',
    subCategory: '資料轉換與格式化',
    difficulty: 'medium',
    notes: {
      title: '多來源資料標準化',
      sections: [
        {
          heading: '資料標準化的需求',
          content: `真實專案中，資料來自多個來源（不同 API、資料庫、第三方服務），格式往往不一致：

- 欄位命名：snake_case vs camelCase vs PascalCase
- 型別不一致：數字存成字串、布林存成 0/1
- 缺漏欄位：部分資料沒有某些欄位
- 無效資料：空字串、null、型別錯誤

標準化的目標：無論輸入格式如何，輸出一定符合預期的統一格式。`,
        },
        {
          heading: '欄位命名轉換',
          content: `\`\`\`js
// snake_case → camelCase
const toCamelCase = str =>
  str.replace(/_([a-z])/g, (_, c) => c.toUpperCase())

// 轉換物件所有 key
const convertKeys = obj =>
  Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [toCamelCase(k), v])
  )
\`\`\``,
        },
        {
          heading: '填補預設值',
          content: `\`\`\`js
// 方法一：展開 + 預設物件
const withDefaults = (item, defaults) => ({ ...defaults, ...item })

// 方法二：nullish coalescing（處理 null/undefined）
const normalize = raw => ({
  name: raw.name ?? '匿名',
  role: raw.role ?? 'user',
  active: raw.active ?? true,
})
\`\`\`

注意：\`??\` 只處理 null 和 undefined，\`||\` 還會把 0、false、'' 也替換掉，要小心選用。`,
        },
        {
          heading: '資料轉換管線（Pipeline）',
          content: `將多個轉換步驟串接成管線，每一步接受並回傳陣列：

\`\`\`js
const pipeline = [
  convertKeys,   // 1. 重命名欄位
  convertTypes,  // 2. 型別轉換
  fillDefaults,  // 3. 填補預設值
  filterInvalid, // 4. 過濾無效
]

const result = pipeline.reduce((data, fn) => fn(data), rawData)
\`\`\`

這種 pipeline 設計讓每個步驟獨立可測，易於維護和擴充。`,
        },
      ],
    },
    keyPoints: [
      'snake_case 轉 camelCase 可用正則 replace：str.replace(/_([a-z])/g, (_, c) => c.toUpperCase())。',
      '填補預設值時，用 ?? (nullish coalescing) 比 || 更精確，因為 ?? 只替換 null 和 undefined，不會誤換 0 或 false。',
      '合併多來源資料時，要先統一欄位名稱，再以共同 key（如 id）做 join，避免欄位衝突。',
      '過濾無效資料要明確定義「無效」的條件，如必填欄位為 null/undefined、型別錯誤等。',
      '資料轉換管線（pipeline）是將多個轉換函式串接的模式，讓每個步驟單一職責，便於測試和維護。',
    ],
    problems: [
      {
        id: 'snake-to-camel',
        title: 'snake_case 欄位轉 camelCase',
        difficulty: 'easy',
        description: `給定 \`users\` 陣列，每個使用者的欄位名稱是 snake_case（如 \`user_name\`、\`created_at\`）。
請將所有欄位名稱轉換成 camelCase（如 \`userName\`、\`createdAt\`），存到 \`result\`。

只需轉換一層欄位名稱，不需遞迴處理巢狀物件。`,
        examples: [
          {
            input: `[{ user_name: 'Alice', created_at: '2024-01-01' }]`,
            output: `[{ userName: 'Alice', createdAt: '2024-01-01' }]`,
          },
        ],
        initialCode: `const users = [
  { user_id: 1, user_name: 'Alice', email_address: 'alice@example.com', created_at: '2024-01-01' },
  { user_id: 2, user_name: 'Bob', email_address: 'bob@example.com', created_at: '2024-02-15' },
  { user_id: 3, user_name: 'Carol', email_address: 'carol@example.com', created_at: '2024-03-20' },
]

// 請將 users 每個物件的 key 從 snake_case 轉成 camelCase，存到 result
let result
`,
        testCases: [
          { label: 'result 應為陣列', test: `return Array.isArray(result)` },
          { label: 'result[0] 應有 userName 欄位', test: `return result[0] && 'userName' in result[0]` },
          { label: 'result[0].userName 應為 "Alice"', test: `return result[0] && result[0].userName === 'Alice'` },
          { label: 'result[0] 不應有 user_name 欄位', test: `return result[0] && !('user_name' in result[0])` },
          { label: 'result[1].emailAddress 應為 "bob@example.com"', test: `return result[1] && result[1].emailAddress === 'bob@example.com'` },
        ],
      },
      {
        id: 'fill-defaults',
        title: '填補缺漏欄位預設值',
        difficulty: 'easy',
        description: `給定 \`items\` 陣列，部分物件缺少某些欄位（欄位值為 \`undefined\` 或 \`null\`）。
請補上預設值，存到 \`result\`：
- \`role\` 預設為 \`'user'\`
- \`active\` 預設為 \`true\`
- \`score\` 預設為 \`0\`

若欄位已有值（包含 \`false\` 和 \`0\`），不應被覆蓋。`,
        examples: [
          {
            input: `{ name: 'Alice', role: null, active: undefined }`,
            output: `{ name: 'Alice', role: 'user', active: true, score: 0 }`,
          },
        ],
        initialCode: `const items = [
  { name: 'Alice', role: 'admin', active: true, score: 95 },
  { name: 'Bob', role: null, active: undefined, score: undefined },
  { name: 'Carol', role: undefined, active: false, score: 0 },
]

// 請補上預設值（role: 'user'、active: true、score: 0），存到 result
let result
`,
        testCases: [
          { label: 'result 應為陣列', test: `return Array.isArray(result)` },
          { label: 'Alice 的 role 不應被改變（仍為 "admin"）', test: `return result[0] && result[0].role === 'admin'` },
          { label: 'Bob 的 role 應填補為 "user"', test: `return result[1] && result[1].role === 'user'` },
          { label: 'Carol 的 active 應保留 false（不被覆蓋）', test: `return result[2] && result[2].active === false` },
          { label: 'Carol 的 score 應保留 0（不被覆蓋）', test: `return result[2] && result[2].score === 0` },
        ],
      },
      {
        id: 'merge-sources',
        title: '合併兩個來源的使用者資料',
        difficulty: 'medium',
        description: `有兩個資料來源：
- \`sourceA\`：\`{ userId, name, email }\`
- \`sourceB\`：\`{ id, fullName, phone }\`

兩者都描述同一批使用者，用 userId（A）對應 id（B）。
請合併成統一格式 \`{ id, name, email, phone }\`，存到 \`result\`。

若某個使用者只在一個來源有資料，phone 或 email 填 \`null\`。`,
        examples: [
          {
            input: `A: { userId:1, name:'Alice', email:'a@b.com' } + B: { id:1, fullName:'Alice Wu', phone:'0912' }`,
            output: `{ id: 1, name: 'Alice', email: 'a@b.com', phone: '0912' }`,
            note: 'name 以 sourceA 為主',
          },
        ],
        initialCode: `const sourceA = [
  { userId: 1, name: 'Alice', email: 'alice@example.com' },
  { userId: 2, name: 'Bob', email: 'bob@example.com' },
  { userId: 3, name: 'Carol', email: 'carol@example.com' },
]

const sourceB = [
  { id: 1, fullName: 'Alice Wu', phone: '0912-111-111' },
  { id: 2, fullName: 'Bob Chen', phone: '0923-222-222' },
  { id: 4, fullName: 'David Lin', phone: '0934-333-333' },
]

// 請合併兩個來源，統一格式為 { id, name, email, phone }，存到 result
let result
`,
        testCases: [
          { label: 'result 應為陣列', test: `return Array.isArray(result)` },
          { label: 'Alice（id:1）應有 email 和 phone', test: `const a = result.find(u => u.id === 1); return a && a.email === 'alice@example.com' && a.phone === '0912-111-111'` },
          { label: 'Bob（id:2）的 name 應以 sourceA 為主（"Bob"）', test: `const b = result.find(u => u.id === 2); return b && b.name === 'Bob'` },
          { label: 'Carol（id:3）的 phone 應為 null（sourceB 無資料）', test: `const c = result.find(u => u.id === 3); return c && c.phone === null` },
          { label: 'result 應包含 Carol（id:3）', test: `return result.some(u => u.id === 3)` },
        ],
      },
      {
        id: 'filter-invalid',
        title: '移除無效資料',
        difficulty: 'medium',
        description: `給定 \`rawData\` 陣列，請過濾掉無效的物件，將有效的存到 \`result\`。

無效條件（任一滿足即無效）：
- \`id\` 不是正整數（undefined、null、0、負數、非數字）
- \`name\` 不是非空字串（undefined、null、空字串、非字串）
- \`email\` 不包含 \`'@'\`（或非字串）`,
        examples: [
          {
            input: `[{ id: 1, name: 'Alice', email: 'a@b.com' }, { id: 0, name: 'Bob', email: 'b@c.com' }]`,
            output: `[{ id: 1, name: 'Alice', email: 'a@b.com' }]（id:0 無效）`,
          },
        ],
        initialCode: `const rawData = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 0, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: '', email: 'carol@example.com' },
  { id: 4, name: 'David', email: 'not-an-email' },
  { id: 5, name: 'Eve', email: 'eve@example.com' },
  { id: null, name: 'Frank', email: 'frank@example.com' },
  { id: 7, name: null, email: 'grace@example.com' },
]

// 請過濾掉無效資料，將有效的存到 result
let result
`,
        testCases: [
          { label: 'result 應為陣列', test: `return Array.isArray(result)` },
          { label: 'result 應有 2 個有效元素', test: `return result.length === 2` },
          { label: 'Alice（id:1）應在 result 中', test: `return result.some(u => u.id === 1 && u.name === 'Alice')` },
          { label: 'Eve（id:5）應在 result 中', test: `return result.some(u => u.id === 5 && u.name === 'Eve')` },
          { label: 'id:0、空 name、無 @ email 等無效資料不應在 result 中', test: `return !result.some(u => u.id === 0 || u.id === null || u.name === '' || u.name === null || !u.email.includes('@'))` },
        ],
      },
      {
        id: 'full-pipeline',
        title: '完整資料轉換管線',
        difficulty: 'hard',
        description: `給定 \`rawUsers\` 原始資料（snake_case、有缺漏、有無效值），
請依序套用以下步驟，將結果存到 \`result\`：

1. **重命名**：\`user_id\` → \`id\`，\`user_name\` → \`name\`，\`email_address\` → \`email\`
2. **型別轉換**：確保 \`id\` 為數字（用 Number() 轉換）
3. **填補預設**：\`role\` 缺漏時填 \`'user'\`，\`active\` 缺漏時填 \`true\`
4. **過濾無效**：移除 \`id\` 不是正整數，或 \`name\` 為空/null/undefined 的記錄

最終 \`result\` 是符合 \`{ id, name, email, role, active }\` 格式的有效使用者陣列。`,
        examples: [
          {
            input: `{ user_id: '1', user_name: 'Alice', email_address: 'a@b.com', role: null }`,
            output: `{ id: 1, name: 'Alice', email: 'a@b.com', role: 'user', active: true }`,
          },
        ],
        initialCode: `const rawUsers = [
  { user_id: '1', user_name: 'Alice', email_address: 'alice@example.com', role: 'admin', active: true },
  { user_id: '2', user_name: 'Bob', email_address: 'bob@example.com', role: null, active: undefined },
  { user_id: '0', user_name: 'Invalid', email_address: 'invalid@example.com' },
  { user_id: '4', user_name: '', email_address: 'empty@example.com', role: 'user' },
  { user_id: '5', user_name: 'Eve', email_address: 'eve@example.com', active: false },
]

// 請依序執行：重命名 → 型別轉換 → 填補預設 → 過濾無效，將結果存到 result
let result
`,
        testCases: [
          { label: 'result 應為陣列', test: `return Array.isArray(result)` },
          { label: 'result 應有 3 個有效元素（id:0 和空 name 被過濾）', test: `return result.length === 3` },
          { label: 'Alice（id:1）的 role 應為 "admin"（保留原值）', test: `const a = result.find(u => u.id === 1); return a && a.role === 'admin'` },
          { label: 'Bob（id:2）的 role 應填補為 "user"', test: `const b = result.find(u => u.id === 2); return b && b.role === 'user'` },
          { label: 'Eve（id:5）的 active 應保留 false（不被預設值覆蓋）', test: `const e = result.find(u => u.id === 5); return e && e.active === false` },
        ],
      },
    ],
  },
]
