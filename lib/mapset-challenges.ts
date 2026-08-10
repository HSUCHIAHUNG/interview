import type { MethodEntry } from './array-challenges'

export const mapsetChallenges: MethodEntry[] = [

  // ─── map-basic ────────────────────────────────────────────────────────────
  {
    slug: 'map-basic',
    methodName: 'Map',
    title: 'Map 基本操作',
    description: 'set / get / has / delete / size / clear 的使用方式與回傳值',
    subCategory: 'Map 操作',
    difficulty: 'easy',
    notes: {
      title: 'Map 基本操作',
      sections: [
        {
          heading: '語法與常用方法',
          content: `\`new Map()\` 建立空 Map；也可傳入 \`[[key, value], ...]\` 初始化。

\`\`\`js
const m = new Map()
m.set('a', 1)   // 設定 key-value，回傳 Map 本身（可鏈式呼叫）
m.get('a')      // 1
m.has('a')      // true（boolean）
m.delete('a')   // true（boolean，是否成功刪除）
m.size          // 目前的 key 數量（屬性，不是方法）
m.clear()       // 清空所有 key-value，回傳 undefined
\`\`\``,
        },
        {
          heading: 'Map vs 物件的 key 差異',
          content: `\`\`\`js
// 物件的 key 只能是 string 或 Symbol
const obj = {}
obj[1] = 'one'   // key 被轉成字串 "1"

// Map 的 key 可以是任意型別
const map = new Map()
map.set(1, 'one')     // 數字 key
map.set({}, 'obj')    // 物件 key
map.set(true, 'yes')  // boolean key
\`\`\``,
        },
      ],
    },
    keyPoints: [
      'Map 用 set/get/has/delete 操作，size 是屬性（不加括號）。',
      'delete() 回傳 boolean，表示是否成功刪除；clear() 清空整個 Map。',
      'Map 的 key 可以是任意型別，物件 key 只能是 string 或 Symbol。',
    ],
    problems: [
      {
        id: 'basic',
        title: '購物車：Map 基本的 set / get / has / size',
        difficulty: 'easy',
        description: `Map 是 key-value 結構，key 可以是任意型別，常見操作：
- \`set(key, value)\`：設定或更新值
- \`get(key)\`：取得值，key 不存在時回傳 \`undefined\`
- \`has(key)\`：檢查 key 是否存在，回傳 boolean
- \`size\`：目前有幾個 key（屬性，不加括號）

請完成以下操作：
1. 建立一個空的 Map，存到 \`cart\`。
2. 用 \`set()\` 加入兩個商品：\`'蘋果'\` 數量 \`3\`，\`'香蕉'\` 數量 \`5\`。
3. 用 \`get()\` 取得 \`'蘋果'\` 的數量，存到 \`appleCount\`。
4. 用 \`has()\` 確認 \`'葡萄'\` 是否在購物車，存到 \`hasGrape\`（boolean）。
5. 用 \`size\` 取得購物車中商品種類數，存到 \`total\`。`,
        examples: [
          {
            input: `cart 加入 '蘋果': 3、'香蕉': 5`,
            output: `appleCount === 3，hasGrape === false，total === 2`,
          },
        ],
        initialCode: `// TODO: 建立空 Map，存到 cart
let cart

// TODO: 加入 '蘋果' 數量 3，'香蕉' 數量 5

// TODO: 取得 '蘋果' 的數量，存到 appleCount
let appleCount

// TODO: 確認 '葡萄' 是否存在，存到 hasGrape
let hasGrape

// TODO: 取得 Map 的 key 數量，存到 total
let total
`,
        testCases: [
          { label: 'cart 應為 Map 實例', test: `return cart instanceof Map` },
          { label: 'appleCount 應為 3', test: `return appleCount === 3` },
          { label: "'香蕉' 的數量應為 5", test: `return cart.get('香蕉') === 5` },
          { label: 'hasGrape 應為 false', test: `return hasGrape === false` },
          { label: 'total 應為 2', test: `return total === 2` },
        ],
      },
      {
        id: 'delete',
        title: '購物車：刪除商品與清空（delete / clear）',
        difficulty: 'easy',
        description: `\`delete(key)\` 刪除特定 key，回傳 boolean（true = 成功刪除，false = key 不存在）。
\`clear()\` 清空所有 key-value，size 變為 0。

請完成：
1. 用 \`delete()\` 移除 \`'香蕉'\`，將回傳值存到 \`deleted\`（boolean）。
2. 用 \`has()\` 確認 \`'香蕉'\` 是否還在，存到 \`stillHas\`。
3. 用 \`clear()\` 清空 \`cart\`。
4. 清空後的 \`cart.size\` 存到 \`emptySize\`。`,
        examples: [
          {
            input: `cart 有 '蘋果':3, '香蕉':5, '橘子':2`,
            output: `deleted === true，stillHas === false，emptySize === 0`,
          },
        ],
        initialCode: `const cart = new Map()
cart.set('蘋果', 3)
cart.set('香蕉', 5)
cart.set('橘子', 2)

// TODO: 用 delete() 刪除 '香蕉'，將回傳值存到 deleted
let deleted

// TODO: 確認 '香蕉' 是否還在，存到 stillHas
let stillHas

// TODO: 用 clear() 清空 cart

// TODO: 清空後的 size 存到 emptySize
let emptySize
`,
        testCases: [
          { label: 'deleted 應為 true（成功刪除）', test: `return deleted === true` },
          { label: 'stillHas 應為 false（香蕉已被刪除）', test: `return stillHas === false` },
          { label: 'emptySize 應為 0', test: `return emptySize === 0` },
          { label: 'delete 不存在的 key 應回傳 false', test: `const m = new Map(); return m.delete('x') === false` },
        ],
      },
    ],
  },

  // ─── map-vs-object ────────────────────────────────────────────────────────
  {
    slug: 'map-vs-object',
    methodName: 'Map vs 物件',
    title: 'Map vs 物件',
    description: 'Map 支援任意型別 key，物件 key 只能是 string 或 Symbol',
    subCategory: 'Map 操作',
    difficulty: 'medium',
    notes: {
      title: 'Map vs 物件',
      sections: [
        {
          heading: 'key 型別差異',
          content: `| 特性 | Map | 物件 |
|------|-----|------|
| key 型別 | 任意（number、object、function...） | 只能 string 或 Symbol |
| key 轉型 | 不轉型 | 非字串 key 會被 toString() |
| 有序性 | 保留插入順序 | 不完全保證 |
| size | map.size | Object.keys(obj).length |

\`\`\`js
const map = new Map()
map.set(1, 'number key')   // key 是數字 1
map.get(1)    // 'number key'
map.get('1')  // undefined（不會轉型）

const obj = {}
obj[1] = 'number key'
obj['1']  // 'number key'（數字 key 被轉成字串）
\`\`\``,
        },
      ],
    },
    keyPoints: [
      'Map 的 key 可以是任意型別（數字、物件、函式），物件 key 只能是 string 或 Symbol。',
      '物件用數字 key 時會自動 toString()，Map 不會轉型，數字 1 和字串 "1" 是不同 key。',
      '需要用非字串當 key，或需要確保插入順序時，優先選 Map。',
    ],
    problems: [
      {
        id: 'any-key',
        title: 'Map 的 key 可以是任意型別',
        difficulty: 'medium',
        description: `物件的 key 只能是字串或 Symbol，用數字當 key 時會被自動轉成字串。
Map 的 key 可以是任意型別，數字 \`1\` 和字串 \`'1'\` 是完全不同的 key。

請完成：
1. 建立 Map，用數字 \`1\` 為 key，存入 \`'一月'\`。
2. 用物件 \`btnObj\` 為 key，存入 \`'click handler'\`。
3. 用 \`get(1)\` 取得值，存到 \`januaryVal\`。
4. 用 \`get(btnObj)\` 取得值，存到 \`handlerVal\`。`,
        examples: [
          {
            input: `key 分別為數字 1 和物件 btnObj`,
            output: `januaryVal === '一月'，handlerVal === 'click handler'`,
          },
        ],
        constraints: [
          'key 必須使用數字 1（不是字串 "1"）',
          'key 必須使用 btnObj 這個物件本身（不是字串）',
        ],
        initialCode: `const map = new Map()
const btnObj = {}

// TODO: 以數字 1 為 key，存入 '一月'

// TODO: 以 btnObj 物件為 key，存入 'click handler'

// TODO: 取得 key 為 1 的值，存到 januaryVal
let januaryVal

// TODO: 取得 key 為 btnObj 的值，存到 handlerVal
let handlerVal
`,
        testCases: [
          { label: 'januaryVal 應為 "一月"', test: `return januaryVal === '一月'` },
          { label: 'handlerVal 應為 "click handler"', test: `return handlerVal === 'click handler'` },
          { label: '用字串 "1" 取不到數字 key 的值', test: `return map.get('1') === undefined` },
          { label: 'map.size 應為 2', test: `return map.size === 2` },
        ],
      },
      {
        id: 'key-order',
        title: 'Map 保留插入順序，物件不保證',
        difficulty: 'medium',
        description: `Map 保證迭代順序與插入順序一致，物件的 key 順序不完全可靠（整數 key 會被排序）。

以下 \`scores\` Map 按插入順序存了三個成績。
請用 \`[...scores.keys()]\` 取得所有 key 的陣列，存到 \`orderedKeys\`，
驗證它保留了插入時的順序（'Carol' → 'Alice' → 'Bob'）。`,
        examples: [
          {
            input: `插入順序：Carol, Alice, Bob`,
            output: `orderedKeys === ['Carol', 'Alice', 'Bob']`,
          },
        ],
        initialCode: `const scores = new Map()
scores.set('Carol', 88)
scores.set('Alice', 92)
scores.set('Bob', 75)

// TODO: 取得所有 key 的陣列（保留插入順序），存到 orderedKeys
let orderedKeys
`,
        testCases: [
          { label: 'orderedKeys 是陣列', test: `return Array.isArray(orderedKeys)` },
          { label: 'orderedKeys[0] 應為 "Carol"（第一個插入）', test: `return orderedKeys[0] === 'Carol'` },
          { label: 'orderedKeys[1] 應為 "Alice"', test: `return orderedKeys[1] === 'Alice'` },
          { label: 'orderedKeys[2] 應為 "Bob"', test: `return orderedKeys[2] === 'Bob'` },
          { label: 'orderedKeys.length 應為 3', test: `return orderedKeys.length === 3` },
        ],
      },
    ],
  },

  // ─── map-iterate ──────────────────────────────────────────────────────────
  {
    slug: 'map-iterate',
    methodName: 'Map 迭代',
    title: 'Map 迭代與轉換',
    description: 'for...of、keys()、values()、entries()、Map 與陣列互轉',
    subCategory: 'Map 操作',
    difficulty: 'medium',
    notes: {
      title: 'Map 迭代與轉換',
      sections: [
        {
          heading: '迭代方法',
          content: `\`\`\`js
const m = new Map([['a', 1], ['b', 2]])

// for...of 解構 [key, value]
for (const [key, value] of m) { ... }

// 只迭代 key
for (const key of m.keys()) { ... }

// 只迭代 value
for (const val of m.values()) { ... }
\`\`\``,
        },
        {
          heading: 'Map 與陣列互轉',
          content: `\`\`\`js
const m = new Map([['a', 1], ['b', 2]])

// Map → 陣列
[...m]              // [['a', 1], ['b', 2]]
[...m.keys()]       // ['a', 'b']
[...m.values()]     // [1, 2]
Array.from(m)       // [['a', 1], ['b', 2]]

// 陣列 → Map
new Map([['a', 1], ['b', 2]])
\`\`\``,
        },
      ],
    },
    keyPoints: [
      'for...of 迭代 Map 時每次得到 [key, value]，可以直接解構。',
      'map.keys()、map.values()、map.entries() 都回傳迭代器，用 spread 或 Array.from 轉陣列。',
      '[...map] 等同於 [...map.entries()]，得到 [[k1,v1], [k2,v2]] 格式。',
    ],
    problems: [
      {
        id: 'for-of',
        title: 'for...of 迭代 Map，解構 [key, value]',
        difficulty: 'medium',
        description: `Map 是可迭代的（iterable），\`for...of\` 每次迭代得到 \`[key, value]\` 陣列，
可以直接解構使用。

請完成：
1. 用 \`for...of\` 搭配解構，迭代 \`scores\`。
2. 累計所有分數，存到 \`total\`。
3. 將所有名字（key）收集到 \`names\` 陣列中。`,
        examples: [
          {
            input: `scores: Alice=90, Bob=75, Carol=85`,
            output: `total === 250，names 包含所有名字`,
          },
        ],
        initialCode: `const scores = new Map([
  ['Alice', 90],
  ['Bob', 75],
  ['Carol', 85],
])

let total = 0
const names = []

// TODO: 用 for...of 解構 [name, score]，累計 total 並收集 names
`,
        testCases: [
          { label: 'total 應為 250', test: `return total === 250` },
          { label: 'names 長度應為 3', test: `return names.length === 3` },
          { label: "names 包含 'Alice'", test: `return names.includes('Alice')` },
          { label: "names 包含 'Bob'", test: `return names.includes('Bob')` },
          { label: "names 包含 'Carol'", test: `return names.includes('Carol')` },
        ],
      },
      {
        id: 'to-array',
        title: 'Map 轉陣列：keys() / values() / spread',
        difficulty: 'medium',
        description: `Map 可以透過 spread 或 \`Array.from\` 轉成陣列：
- \`[...map.keys()]\` → key 陣列
- \`[...map.values()]\` → value 陣列
- \`[...map]\` → \`[[key, value], ...]\` 陣列

請完成：
1. 取得 \`menu\` 所有 key 的陣列，存到 \`dishes\`。
2. 取得 \`menu\` 所有 value 的陣列，存到 \`prices\`。
3. 把整個 Map 轉成 \`[[key, value], ...]\` 格式，存到 \`entries\`。`,
        examples: [
          {
            input: `menu: 炒飯=80, 牛肉麵=120, 水餃=60`,
            output: `dishes=['炒飯','牛肉麵','水餃']，prices=[80,120,60]，entries=[[...],[...],[...]]`,
          },
        ],
        initialCode: `const menu = new Map([
  ['炒飯', 80],
  ['牛肉麵', 120],
  ['水餃', 60],
])

// TODO: 取得所有 key 陣列，存到 dishes
let dishes

// TODO: 取得所有 value 陣列，存到 prices
let prices

// TODO: 把整個 Map 轉成 [[key, value], ...] 陣列，存到 entries
let entries
`,
        testCases: [
          { label: "dishes 應包含 '炒飯'", test: `return Array.isArray(dishes) && dishes.includes('炒飯')` },
          { label: 'prices 應包含 120', test: `return Array.isArray(prices) && prices.includes(120)` },
          { label: 'entries 長度應為 3', test: `return Array.isArray(entries) && entries.length === 3` },
          { label: 'entries 每個元素應為 [key, value] 陣列', test: `return Array.isArray(entries[0]) && entries[0].length === 2` },
          { label: 'dishes 長度應為 3', test: `return dishes.length === 3` },
        ],
      },
    ],
  },

  // ─── set-basic ────────────────────────────────────────────────────────────
  {
    slug: 'set-basic',
    methodName: 'Set',
    title: 'Set 基本操作',
    description: 'add / has / delete / size / clear，add() 回傳 Set 本身',
    subCategory: 'Set 操作',
    difficulty: 'easy',
    notes: {
      title: 'Set 基本操作',
      sections: [
        {
          heading: '語法與常用方法',
          content: `\`\`\`js
const s = new Set()
s.add(1)      // 加入值，回傳 Set 本身（可鏈式）
s.add(1)      // 重複加入，忽略，size 不變
s.has(1)      // true（boolean）
s.delete(1)   // true（boolean，是否成功刪除）
s.size        // 目前有幾個值（屬性，不加括號）
s.clear()     // 清空

// 初始化時傳入可迭代物件
const s2 = new Set([1, 2, 2, 3])  // {1, 2, 3}（重複的 2 自動去除）
\`\`\``,
        },
        {
          heading: '不重複的機制',
          content: `Set 使用 SameValueZero 算法比較，與 \`===\` 基本相同（NaN 例外：NaN === NaN 在 Set 中成立）。

\`\`\`js
const s = new Set()
s.add(NaN)
s.add(NaN)  // 被視為重複，只保留一個
s.size      // 1

s.add({})
s.add({})  // 不同的物件參考，視為不同值
s.size      // 3
\`\`\``,
        },
      ],
    },
    keyPoints: [
      'Set 用 add/has/delete 操作，size 是屬性（不加括號）。',
      'add() 回傳 Set 本身（可鏈式），重複加入相同值會被忽略。',
      'Set 用 SameValueZero 比較，物件不同參考視為不同值。',
    ],
    problems: [
      {
        id: 'basic',
        title: '標籤系統：add / has / size / delete',
        difficulty: 'easy',
        description: `Set 是不重複值的集合，常用於標籤、權限等不允許重複的場景。

- \`add(value)\`：加入值，若已存在則忽略，回傳 Set 本身
- \`has(value)\`：檢查是否存在，回傳 boolean
- \`size\`：目前有幾個值
- \`delete(value)\`：刪除特定值，回傳 boolean

請完成：
1. 建立空 Set，存到 \`tags\`。
2. 加入三個標籤：\`'JavaScript'\`、\`'React'\`、\`'TypeScript'\`。
3. 用 \`has()\` 確認 \`'Vue'\` 是否存在，存到 \`hasVue\`。
4. 用 \`delete()\` 移除 \`'React'\`。
5. 移除後的 \`size\` 存到 \`count\`。`,
        examples: [
          {
            input: `加入 JavaScript, React, TypeScript，再刪除 React`,
            output: `hasVue === false，count === 2`,
          },
        ],
        initialCode: `// TODO: 建立空 Set，存到 tags
let tags

// TODO: 加入 'JavaScript'、'React'、'TypeScript'

// TODO: 確認 'Vue' 是否存在，存到 hasVue
let hasVue

// TODO: 移除 'React'

// TODO: 移除後的 size，存到 count
let count
`,
        testCases: [
          { label: 'tags 應為 Set 實例', test: `return tags instanceof Set` },
          { label: 'hasVue 應為 false', test: `return hasVue === false` },
          { label: 'count 應為 2（刪除 React 後）', test: `return count === 2` },
          { label: "'JavaScript' 應還在", test: `return tags.has('JavaScript')` },
          { label: "'React' 應已被移除", test: `return !tags.has('React')` },
        ],
      },
      {
        id: 'no-duplicate',
        title: 'Set 的不重複特性：重複加入 size 不變',
        difficulty: 'easy',
        description: `Set 的核心特性：相同的值只保留一份，重複 \`add()\` 不報錯，也不改變 \`size\`。

請完成：
1. 建立 Set 並把 \`nums\` 陣列的所有值加入，存到 \`numSet\`（可一行完成）。
2. 取得 \`numSet.size\`，存到 \`uniqueCount\`。`,
        examples: [
          {
            input: `nums = [1, 2, 2, 3, 3, 3, 4]`,
            output: `uniqueCount === 4（重複的 2, 3 各只保留一份）`,
          },
        ],
        initialCode: `const nums = [1, 2, 2, 3, 3, 3, 4]

// TODO: 建立 Set 並把 nums 全部加入，存到 numSet
let numSet

// TODO: 取得 numSet.size，存到 uniqueCount
let uniqueCount
`,
        testCases: [
          { label: 'numSet 應為 Set 實例', test: `return numSet instanceof Set` },
          { label: 'uniqueCount 應為 4', test: `return uniqueCount === 4` },
          { label: 'numSet.has(3) 應為 true', test: `return numSet.has(3)` },
          { label: 'numSet.has(5) 應為 false', test: `return numSet.has(5) === false` },
        ],
      },
    ],
  },

  // ─── set-dedup ────────────────────────────────────────────────────────────
  {
    slug: 'set-dedup',
    methodName: 'Set 去重',
    title: 'Set 去重特性',
    description: '[...new Set(arr)] 陣列去重；利用 Set 計算交集與聯集',
    subCategory: 'Set 操作',
    difficulty: 'medium',
    notes: {
      title: 'Set 去重特性',
      sections: [
        {
          heading: '陣列去重',
          content: `\`\`\`js
const arr = [1, 2, 2, 3, 3, 4]

// 方法一：spread
const unique = [...new Set(arr)]  // [1, 2, 3, 4]

// 方法二：Array.from
const unique2 = Array.from(new Set(arr))  // [1, 2, 3, 4]
\`\`\``,
        },
        {
          heading: '集合運算：交集與聯集',
          content: `\`\`\`js
const a = new Set([1, 2, 3, 4])
const b = new Set([3, 4, 5, 6])

// 聯集（所有不重複元素）
const union = new Set([...a, ...b])  // {1,2,3,4,5,6}

// 交集（兩者都有的元素）
const intersection = new Set([...a].filter(x => b.has(x)))  // {3,4}

// 差集（在 a 但不在 b）
const difference = new Set([...a].filter(x => !b.has(x)))  // {1,2}
\`\`\``,
        },
      ],
    },
    keyPoints: [
      '[...new Set(arr)] 是最簡潔的陣列去重寫法。',
      '聯集：new Set([...a, ...b])；交集：filter + b.has()。',
      'Set 去重只對原始型別有效，物件參考不同視為不同值。',
    ],
    problems: [
      {
        id: 'array-dedup',
        title: '陣列去重：用 Set 移除重複元素',
        difficulty: 'easy',
        description: `Set 最常見的用途：快速去重。
\`[...new Set(arr)]\` 或 \`Array.from(new Set(arr))\` 都能把陣列去重，保留第一次出現的順序。

請把以下有重複元素的陣列去重，結果存到 \`unique\`（陣列）。`,
        examples: [
          {
            input: `arr = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple']`,
            output: `unique === ['apple', 'banana', 'orange']（長度 3）`,
          },
        ],
        initialCode: `const arr = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple']

// TODO: 用 Set 去重，存到 unique（陣列）
let unique
`,
        testCases: [
          { label: 'unique 應為陣列', test: `return Array.isArray(unique)` },
          { label: 'unique.length 應為 3', test: `return unique.length === 3` },
          { label: "unique 包含 'apple'", test: `return unique.includes('apple')` },
          { label: "unique 包含 'banana'", test: `return unique.includes('banana')` },
          { label: 'unique 無重複元素', test: `return new Set(unique).size === unique.length` },
        ],
      },
      {
        id: 'intersection',
        title: '集合運算：聯集與交集',
        difficulty: 'medium',
        description: `Set 可以模擬集合運算：
- **聯集**：兩個 Set 合併（所有不重複元素）→ \`new Set([...a, ...b])\`
- **交集**：兩者都有的元素 → \`[...a].filter(x => b.has(x))\`

請完成：
1. 計算 \`setA\` 和 \`setB\` 的聯集，存到 \`union\`（Set）。
2. 計算 \`setA\` 和 \`setB\` 的交集，存到 \`intersection\`（Set）。`,
        examples: [
          {
            input: `setA = {1,2,3,4}，setB = {3,4,5,6}`,
            output: `union.size === 6，intersection.size === 2（{3,4}）`,
          },
        ],
        initialCode: `const setA = new Set([1, 2, 3, 4])
const setB = new Set([3, 4, 5, 6])

// TODO: 聯集（所有元素合併，不重複），存到 union（Set）
let union

// TODO: 交集（只保留兩者都有的元素），存到 intersection（Set）
let intersection
`,
        testCases: [
          { label: 'union 應為 Set 實例', test: `return union instanceof Set` },
          { label: 'union.size 應為 6', test: `return union.size === 6` },
          { label: 'union 包含 1 和 6', test: `return union.has(1) && union.has(6)` },
          { label: 'intersection 應為 Set 實例', test: `return intersection instanceof Set` },
          { label: 'intersection.size 應為 2', test: `return intersection.size === 2` },
          { label: 'intersection 包含 3 和 4', test: `return intersection.has(3) && intersection.has(4)` },
          { label: 'intersection 不包含 1', test: `return !intersection.has(1)` },
        ],
      },
    ],
  },

  // ─── set-vs-array ─────────────────────────────────────────────────────────
  {
    slug: 'set-vs-array',
    methodName: 'Set vs 陣列',
    title: 'Set vs 陣列',
    description: 'Set.has() 查詢效能 O(1)，Array.includes() 為 O(n)；不同情境的選擇',
    subCategory: 'Set 操作',
    difficulty: 'medium',
    notes: {
      title: 'Set vs 陣列',
      sections: [
        {
          heading: '查詢效能比較',
          content: `| 操作 | Set | Array |
|------|-----|-------|
| 查詢是否存在 | has()，O(1) | includes()，O(n) |
| 加入元素 | add()，O(1) | push()，O(1) |
| 刪除元素 | delete()，O(1) | splice()，O(n) |
| 允許重複 | ❌ | ✅ |
| 保留順序 | 插入順序 | ✅ |

當需要頻繁查詢「是否存在」且資料量大時，應將陣列轉成 Set。`,
        },
        {
          heading: '選擇時機',
          content: `\`\`\`js
// 情境 1：白名單查詢，頻繁 has，用 Set
const allowSet = new Set(['admin', 'editor', 'viewer'])
allowSet.has('admin')  // O(1)

// 情境 2：需要 index 或排序，用 Array
const items = ['apple', 'banana', 'cherry']
items[1]  // 'banana'，Set 無法用 index 取值

// 情境 3：需要去重後再操作，先 Set 再轉回 Array
const unique = [...new Set(items)]
\`\`\``,
        },
      ],
    },
    keyPoints: [
      'Set.has() 查詢效能 O(1)，Array.includes() 為 O(n)，頻繁查詢時優先用 Set。',
      'Set 不支援用 index 取值，需要有序訪問時用 Array。',
      '需要去重後再做陣列操作：先轉 Set 去重，再 spread 回 Array。',
    ],
    problems: [
      {
        id: 'has-vs-includes',
        title: '查詢效能：Set.has() vs Array.includes()',
        difficulty: 'medium',
        description: `頻繁查詢「某個值是否存在」時，\`Set.has()\` 是 O(1) 雜湊查詢，
\`Array.includes()\` 是 O(n) 線性掃描，資料量大時效能差異明顯。

請完成：
1. 把 \`allowList\` 陣列轉成 Set，存到 \`allowSet\`。
2. 用 \`allowSet.has()\` 檢查 \`'admin'\` 是否在許可清單，存到 \`isAllowedBySet\`。
3. 用 \`allowList.includes()\` 做同樣檢查，存到 \`isAllowedByArr\`。`,
        examples: [
          {
            input: `allowList 包含 'admin'`,
            output: `isAllowedBySet === true，isAllowedByArr === true`,
          },
        ],
        initialCode: `const allowList = ['user', 'admin', 'editor', 'viewer']

// TODO: 把 allowList 轉成 Set，存到 allowSet
let allowSet

// TODO: 用 Set.has() 檢查 'admin'，存到 isAllowedBySet
let isAllowedBySet

// TODO: 用 Array.includes() 檢查 'admin'，存到 isAllowedByArr
let isAllowedByArr
`,
        testCases: [
          { label: 'allowSet 應為 Set 實例', test: `return allowSet instanceof Set` },
          { label: 'isAllowedBySet 應為 true', test: `return isAllowedBySet === true` },
          { label: 'isAllowedByArr 應為 true', test: `return isAllowedByArr === true` },
          { label: '兩種查詢結果應相同', test: `return isAllowedBySet === isAllowedByArr` },
          { label: "'guest' 不在許可清單", test: `return allowSet.has('guest') === false` },
        ],
      },
      {
        id: 'filter-unique',
        title: '只出現一次的元素：Set 搭配 filter',
        difficulty: 'medium',
        description: `結合 Set 和陣列方法，找出陣列中**只出現一次**的元素。

步驟：
1. 用 \`filter\` 找出出現超過一次的值（重複值），存到 \`duplicates\`（Set）。
2. 過濾 \`arr\`，只保留**不在** \`duplicates\` 中的元素，存到 \`unique\`（陣列）。`,
        examples: [
          {
            input: `arr = [1, 2, 3, 2, 4, 3, 5]`,
            output: `duplicates = {2, 3}，unique = [1, 4, 5]`,
          },
        ],
        constraints: [
          '2 和 3 各出現兩次，屬於重複值',
          '1、4、5 各只出現一次，應保留',
        ],
        initialCode: `const arr = [1, 2, 3, 2, 4, 3, 5]

// TODO: 找出重複出現（超過一次）的值，存到 duplicates（Set）
let duplicates

// TODO: 過濾 arr，只保留只出現一次的元素，存到 unique（陣列）
let unique
`,
        testCases: [
          { label: 'duplicates 應包含 2 和 3', test: `return duplicates instanceof Set && duplicates.has(2) && duplicates.has(3)` },
          { label: 'duplicates.size 應為 2', test: `return duplicates.size === 2` },
          { label: 'unique 包含 1、4、5', test: `return unique.includes(1) && unique.includes(4) && unique.includes(5)` },
          { label: 'unique.length 應為 3', test: `return Array.isArray(unique) && unique.length === 3` },
          { label: 'unique 不包含重複值 2', test: `return !unique.includes(2)` },
        ],
      },
    ],
  },
]

export function hasMapsetChallenge(slug: string): boolean {
  return mapsetChallenges.some(e => e.slug === slug)
}

export function getMapsetChallenge(slug: string): MethodEntry | undefined {
  return mapsetChallenges.find(e => e.slug === slug)
}
