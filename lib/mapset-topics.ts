export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  answer: number      // 0-based
  explanation: string
}

export interface MapSetEntry {
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

export const THEME = 'Map & Set'

export const MAPSET_SUB_CATEGORIES = [
  { name: 'Map 操作', order: 1 },
  { name: 'WeakMap', order: 2 },
  { name: 'Set 操作', order: 3 },
  { name: 'WeakSet', order: 4 },
]

export const mapSetTopics: MapSetEntry[] = [
  // ─── Map 操作 ─────────────────────────────────────────────────────────────
  {
    slug: 'map-basic',
    title: 'Map 基本操作',
    description: 'set / get / has / delete / size / clear 的使用方式與回傳值',
    subCategory: 'Map 操作',
    difficulty: 'easy',
    notes: {
      sections: [
        {
          heading: 'Map 常用 API 一覽',
          content: `| 方法 / 屬性 | 說明 | 回傳值 |
|-------------|------|--------|
| \`map.set(key, value)\` | 設定 key-value | Map 本身 |
| \`map.get(key)\` | 取得 key 對應的值 | 值 或 \`undefined\` |
| \`map.has(key)\` | 判斷 key 是否存在 | \`boolean\` |
| \`map.delete(key)\` | 刪除 key | \`boolean\`（是否刪除成功） |
| \`map.size\` | 目前元素數量 | \`number\`（屬性，非方法） |
| \`map.clear()\` | 清空所有元素 | \`undefined\` |`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const map = new Map()

// set() 回傳 Map 本身，可鏈式呼叫
map.set('a', 1).set('b', 2).set('c', 3)

// get() 找不到 key 回傳 undefined
console.log(map.get('a'))   // 1
console.log(map.get('z'))   // undefined

// has() 判斷 key 是否存在
console.log(map.has('b'))   // true
console.log(map.has('z'))   // false

// size 是屬性不是方法
console.log(map.size)       // 3
// console.log(map.size())  // TypeError: map.size is not a function

// delete() 回傳是否刪除成功的布林值
console.log(map.delete('b'))  // true
console.log(map.delete('z'))  // false
console.log(map.size)         // 2

// clear() 清空所有元素
map.clear()
console.log(map.size)         // 0
\`\`\``,
        },
        {
          heading: '常見陷阱',
          content: `\`\`\`js
const map = new Map()
map.set('key', undefined)

// has() 和 get() 的區別
console.log(map.has('key'))  // true（key 存在）
console.log(map.get('key'))  // undefined（值本身就是 undefined）
console.log(map.get('nope')) // undefined（key 不存在）

// 無法只靠 get() 判斷 key 是否存在，要用 has()
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: 'Map 的 set() 方法回傳什麼？\n\nconst m = new Map()\nconst result = m.set(\'a\', 1)',
        options: [
          '回傳插入的值（1）',
          '回傳 Map 本身（m）',
          '回傳 true 表示插入成功',
          '回傳 undefined',
        ],
        answer: 1,
        explanation: 'set() 回傳 Map 本身，因此可以進行鏈式呼叫：map.set("a", 1).set("b", 2).set("c", 3)。這和陣列的 push() 回傳新長度不同。',
      },
      {
        id: 2,
        question: '以下程式碼的輸出是什麼？\n\nconst m = new Map()\nm.set(\'x\', 10)\nconsole.log(m.get(\'y\'))',
        options: [
          '拋出 ReferenceError',
          'null',
          '0',
          'undefined',
        ],
        answer: 3,
        explanation: 'get() 找不到對應 key 時回傳 undefined，不會拋出錯誤。這和 JavaScript 存取物件不存在的屬性行為相同。',
      },
      {
        id: 3,
        question: 'map.size 的使用方式正確的是？',
        options: [
          'map.size() — 呼叫為方法',
          'map.size — 直接存取為屬性',
          'map.length — 和陣列相同',
          'map.count() — 呼叫為方法',
        ],
        answer: 1,
        explanation: 'size 是 Map 的屬性（property），不是方法。用 map.size 直接存取，而不是 map.size()。呼叫 map.size() 會拋出 TypeError。Map 沒有 length 屬性。',
      },
      {
        id: 4,
        question: 'map.delete(key) 回傳什麼？\n\nconst m = new Map([["a", 1]])\nconsole.log(m.delete("a"))  // ?\nconsole.log(m.delete("b"))  // ?',
        options: [
          '兩個都是 true',
          '兩個都是 undefined',
          'true 和 false',
          'undefined 和 false',
        ],
        answer: 2,
        explanation: 'delete() 回傳布林值：成功刪除存在的 key 回傳 true，嘗試刪除不存在的 key 回傳 false。',
      },
      {
        id: 5,
        question: '如何正確判斷 Map 中某個 key 是否存在，且值可能是 undefined？\n\nconst m = new Map([["key", undefined]])',
        options: [
          'if (m.get("key") !== undefined)',
          'if (m.get("key"))',
          'if (m.has("key"))',
          'if ("key" in m)',
        ],
        answer: 2,
        explanation: '應該使用 has() 判斷 key 是否存在。因為值本身可能是 undefined，所以 get() === undefined 無法區分「key 不存在」和「key 存在但值為 undefined」。"key" in m 是物件的語法，Map 不適用。',
      },
      {
        id: 6,
        question: '以下程式碼執行後，map.size 是多少？\n\nconst map = new Map()\nmap.set(\'a\', 1)\nmap.set(\'a\', 2)\nmap.set(\'b\', 3)',
        options: [
          '1',
          '2',
          '3',
          '拋出錯誤',
        ],
        answer: 1,
        explanation: 'Map 不允許重複的 key。對同一個 key 呼叫 set() 多次，只會更新值，不會增加元素數量。所以 "a" 最終值是 2，加上 "b"，共 2 個元素，size 為 2。',
      },
    ],
    keyPoints: [
      'set() 回傳 Map 本身，所以可以鏈式呼叫 map.set("a", 1).set("b", 2)。',
      'get() 找不到 key 時回傳 undefined，不會拋出錯誤。',
      'size 是屬性不是方法，要寫 map.size 而不是 map.size()。',
      'delete() 回傳布林值，成功刪除回傳 true，key 不存在回傳 false。',
      '判斷 key 是否存在要用 has()，不能只靠 get() !== undefined（值本身可能是 undefined）。',
      '重複 set() 同一個 key 只會更新值，不會增加 size。',
    ],
  },

  {
    slug: 'map-vs-object',
    title: 'Map vs 物件',
    description: 'Map 的 key 可為任意型別，保證插入順序，有 size 屬性',
    subCategory: 'Map 操作',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: 'Map 與物件的核心差異',
          content: `| 特性 | 物件（Object） | Map |
|------|---------------|-----|
| key 的型別 | 只能是字串或 Symbol | 任意型別（物件、函式、數字…） |
| 插入順序 | 整數 key 會被排序 | 完全保證插入順序 |
| 大小 | 需手動計算 | \`map.size\` 屬性 |
| 預設 key | 有原型鏈上的屬性 | 無（純淨） |
| JSON 序列化 | 直接支援 | 需先轉換 |`,
        },
        {
          heading: '任意型別 key 的範例',
          content: `\`\`\`js
const map = new Map()

// 物件當 key
const objKey = { id: 1 }
map.set(objKey, '物件作為 key')
console.log(map.get(objKey))  // '物件作為 key'

// 注意：不同引用即使內容相同，也是不同 key
const anotherObj = { id: 1 }
console.log(map.get(anotherObj))  // undefined（不是同一個引用）

// 函式當 key
function fn() {}
map.set(fn, '函式作為 key')

// 數字當 key（在物件中數字 key 會被排序）
const obj = {}
obj[2] = 'b'
obj[1] = 'a'
console.log(Object.keys(obj))  // ['1', '2']（被排序！）

const m = new Map()
m.set(2, 'b')
m.set(1, 'a')
console.log([...m.keys()])      // [2, 1]（保留插入順序）
\`\`\``,
        },
        {
          heading: '何時選用 Map vs 物件',
          content: `\`\`\`js
// 用 Map 的時機：
// 1. key 是非字串型別（物件、DOM 元素等）
// 2. 需要高頻新增/刪除
// 3. 需要保證插入順序
// 4. 需要快速取得大小

// 用物件的時機：
// 1. 表示有固定結構的資料（像 JSON）
// 2. 需要 JSON 序列化
// 3. 配合解構賦值使用
// 4. 原型繼承

// 陷阱：物件 key 型別轉換
const obj = {}
obj[1] = 'number key'
console.log(typeof Object.keys(obj)[0])  // 'string'（數字被轉成字串）
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: '物件（Object）的 key 可以是哪些型別？',
        options: [
          '任意型別，包含物件和函式',
          '只能是字串',
          '只能是字串或 Symbol',
          '字串、數字或 Symbol',
        ],
        answer: 2,
        explanation: '物件的 key 只能是字串或 Symbol。數字 key 雖然看起來合法，但 JavaScript 會自動將它轉換為字串。Map 才能接受任意型別（包含物件、函式、數字等）作為 key。',
      },
      {
        id: 2,
        question: '以下程式碼的輸出是什麼？\n\nconst map = new Map()\nconst key1 = { id: 1 }\nconst key2 = { id: 1 }\nmap.set(key1, "value1")\nconsole.log(map.get(key2))',
        options: [
          '"value1"',
          'undefined',
          '拋出 TypeError',
          'null',
        ],
        answer: 1,
        explanation: 'Map 使用引用（reference）來比較物件 key，即使兩個物件內容相同，只要是不同引用就是不同 key。key1 和 key2 雖然內容相同（{ id: 1 }），但是不同物件，所以 map.get(key2) 回傳 undefined。',
      },
      {
        id: 3,
        question: '以下程式碼，Object.keys(obj) 的輸出順序是？\n\nconst obj = {}\nobj["b"] = 1\nobj[2] = 2\nobj["a"] = 3\nobj[1] = 4\nconsole.log(Object.keys(obj))',
        options: [
          '["b", "2", "a", "1"]（插入順序）',
          '["1", "2", "b", "a"]（整數 key 優先排序）',
          '["a", "b", "1", "2"]（字母排序後數字排序）',
          '["1", "a", "2", "b"]（交替順序）',
        ],
        answer: 1,
        explanation: '物件的 key 排序規則：整數索引（可轉為非負整數的字串）會先按數值排序，其餘字串 key 按插入順序排列。所以整數 key "1"、"2" 先出現，然後才是字串 key "b"、"a"。',
      },
      {
        id: 4,
        question: 'Map 的 size 和物件的 key 計算，哪個說法正確？',
        options: [
          '兩者都有 .size 屬性',
          'Map 用 .size 屬性，物件需要 Object.keys(obj).length',
          '兩者都需要呼叫 .length()',
          '物件用 .size，Map 用 .length',
        ],
        answer: 1,
        explanation: 'Map 有 .size 屬性可直接取得元素數量（O(1)）。物件沒有 size 屬性，需要用 Object.keys(obj).length 來計算，這會建立一個 key 陣列（O(n)）。',
      },
      {
        id: 5,
        question: '以下哪個場景最適合使用 Map 而非物件？',
        options: [
          '儲存使用者資料（name、age、email）',
          '用 DOM 節點作為 key 儲存對應資料',
          '建立一個可以 JSON.stringify 的資料結構',
          '使用解構賦值快速取出屬性',
        ],
        answer: 1,
        explanation: '用 DOM 節點（物件型別）作為 key 是 Map 的典型使用場景。物件只能用字串或 Symbol 作為 key，DOM 節點作為 key 時會被轉成 "[object HTMLElement]" 字串，導致所有 DOM 節點映射到同一個 key。Map 可以用物件引用作為 key，完美解決此問題。',
      },
      {
        id: 6,
        question: '以下程式碼的輸出是什麼？\n\nconst obj = {}\nobj[1] = "one"\nobj[2] = "two"\nconsole.log(typeof Object.keys(obj)[0])',
        options: [
          '"number"',
          '"string"',
          '"integer"',
          '"object"',
        ],
        answer: 1,
        explanation: '物件的 key 永遠是字串型別。即使你用數字 1 設定 key，JavaScript 會自動將它轉換成字串 "1"。所以 Object.keys(obj)[0] 是字串 "1"，typeof 結果是 "string"。',
      },
    ],
    keyPoints: [
      '物件 key 只能是字串或 Symbol，Map key 可以是任意型別（物件、函式、數字都行）。',
      'Map 用物件當 key 時，比的是引用（reference），不同引用即使內容相同也是不同 key。',
      '物件的數字 key 會按數值排序排在前面，Map 完全保證插入順序。',
      'Map 有 .size 屬性直接取得元素數量，物件需要 Object.keys(obj).length。',
      '需要 JSON 序列化就用物件；需要物件當 key 或保證順序就用 Map。',
      '物件的數字 key 底層都是字串，typeof Object.keys({1:"a"})[0] 是 "string"。',
    ],
  },

  {
    slug: 'map-iterate',
    title: 'Map 迭代與轉換',
    description: 'forEach / entries / keys / values，Map 轉陣列的格式',
    subCategory: 'Map 操作',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: 'Map 的迭代方式',
          content: `\`\`\`js
const map = new Map([['a', 1], ['b', 2], ['c', 3]])

// forEach：注意參數順序是 (value, key)，和物件的 for...in 相反
map.forEach((value, key) => {
  console.log(key, value)  // a 1, b 2, c 3
})

// for...of 搭配 entries()（預設迭代器）
for (const [key, value] of map) {
  console.log(key, value)
}

// 只迭代 key
for (const key of map.keys()) { ... }

// 只迭代 value
for (const value of map.values()) { ... }

// 取得所有 entries（key-value 對）
for (const [key, value] of map.entries()) { ... }
\`\`\``,
        },
        {
          heading: 'Map 與陣列的互轉',
          content: `\`\`\`js
const map = new Map([['a', 1], ['b', 2]])

// Map → 二維陣列（最常用）
const arr1 = [...map]             // [['a', 1], ['b', 2]]
const arr2 = Array.from(map)      // [['a', 1], ['b', 2]]
const arr3 = [...map.entries()]   // [['a', 1], ['b', 2]]

// 只要 key 陣列
const keys = [...map.keys()]      // ['a', 'b']

// 只要 value 陣列
const values = [...map.values()]  // [1, 2]

// 陣列 → Map
const entries = [['x', 10], ['y', 20]]
const newMap = new Map(entries)

// 物件 → Map
const obj = { a: 1, b: 2 }
const mapFromObj = new Map(Object.entries(obj))

// Map → 物件
const objFromMap = Object.fromEntries(map)  // { a: 1, b: 2 }
\`\`\``,
        },
        {
          heading: '常見陷阱：forEach 參數順序',
          content: `\`\`\`js
// 陷阱：Map 的 forEach 參數順序是 (value, key)
// 和普通陣列 forEach((item, index) => ...) 不同

const map = new Map([['name', 'Alice'], ['age', 30]])

// 正確
map.forEach((value, key) => {
  console.log(\`\${key}: \${value}\`)
})
// 輸出：name: Alice  /  age: 30

// 錯誤（key 和 value 搞反了）
map.forEach((key, value) => {
  // 這裡 key 其實是 value，value 其實是 key
})
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: 'Map 的 forEach 回呼函式的參數順序是？\n\nmap.forEach(/* 參數順序 */ => ...)',
        options: [
          '(key, value)',
          '(value, key)',
          '(index, value)',
          '(entry, index)',
        ],
        answer: 1,
        explanation: 'Map 的 forEach 回呼函式參數順序是 (value, key)，這和物件的迭代習慣相反，容易搞混。陣列的 forEach 是 (item, index)，而 Map 是 (value, key)。這是 JavaScript 設計的一個小坑。',
      },
      {
        id: 2,
        question: '以下程式碼輸出什麼？\n\nconst map = new Map([[\'a\', 1], [\'b\', 2]])\nconst arr = [...map]\nconsole.log(arr)',
        options: [
          '["a", "b"]',
          '[1, 2]',
          '[["a", 1], ["b", 2]]',
          '{"a": 1, "b": 2}',
        ],
        answer: 2,
        explanation: 'spread 展開 Map 會得到二維陣列，每個元素是 [key, value] 的陣列。所以 [...map] 結果是 [["a", 1], ["b", 2]]。這和 map.entries() 的結果相同。',
      },
      {
        id: 3,
        question: '如何將 Map 轉換為普通物件？\n\nconst map = new Map([[\'a\', 1], [\'b\', 2]])',
        options: [
          'Object.fromEntries(map)',
          'Object.fromMap(map)',
          'map.toObject()',
          'JSON.parse(JSON.stringify(map))',
        ],
        answer: 0,
        explanation: 'Object.fromEntries() 可以接受任何可迭代的 [key, value] 對，包括 Map。因為 Map 的迭代器會回傳 [key, value] 陣列，剛好符合 Object.fromEntries() 的格式。JSON.stringify(map) 會得到 "{}"（空物件），因為 Map 不是普通可序列化物件。',
      },
      {
        id: 4,
        question: '如何將一個物件 { a: 1, b: 2 } 轉換為 Map？',
        options: [
          'new Map({ a: 1, b: 2 })',
          'new Map(Object.entries({ a: 1, b: 2 }))',
          'Map.from({ a: 1, b: 2 })',
          'Object.toMap({ a: 1, b: 2 })',
        ],
        answer: 1,
        explanation: 'Map 建構函式接受一個可迭代的 [key, value] 對。Object.entries() 會將物件轉換成 [["a", 1], ["b", 2]] 格式，再傳給 new Map() 即可完成轉換。new Map({ a: 1, b: 2 }) 會拋出 TypeError，因為普通物件不是可迭代的 entries 集合。',
      },
      {
        id: 5,
        question: '以下哪個方式可以取得 Map 中所有 key 的陣列？',
        options: [
          'map.keys()（直接是陣列）',
          '[...map.keys()]',
          'map.getKeys()',
          'Object.keys(map)',
        ],
        answer: 1,
        explanation: 'map.keys() 回傳的是 MapIterator（迭代器），不是陣列。需要用 [...map.keys()] 或 Array.from(map.keys()) 轉換成陣列。Object.keys(map) 對 Map 無效，只適用於普通物件。',
      },
      {
        id: 6,
        question: '以下程式碼的輸出是什麼？\n\nconst map = new Map([[\'x\', 10], [\'y\', 20]])\nconst keys = [...map.keys()]\nconst values = [...map.values()]\nconsole.log(keys, values)',
        options: [
          '[10, 20] ["x", "y"]',
          '["x", "y"] [10, 20]',
          '[["x", 10], ["y", 20]] undefined',
          'undefined undefined',
        ],
        answer: 1,
        explanation: 'map.keys() 回傳所有 key 的迭代器，spread 後得到 ["x", "y"]；map.values() 回傳所有 value 的迭代器，spread 後得到 [10, 20]。兩者都保持插入順序。',
      },
    ],
    keyPoints: [
      'Map 的 forEach 參數順序是 (value, key)，和一般印象相反，容易搞混。',
      '[...map] 展開得到二維陣列 [[key, val], ...]，不是 key 陣列也不是 value 陣列。',
      'map.keys() 和 map.values() 回傳的是迭代器，要加 [...] 或 Array.from() 才能變陣列。',
      'Object.fromEntries(map) 可以把 Map 轉成物件；Object.entries(obj) 搭配 new Map() 可以把物件轉成 Map。',
      'for...of 直接迭代 Map 等同於迭代 map.entries()，每次拿到的是 [key, value]。',
      'JSON.stringify(map) 會得到 "{}"，Map 不能直接序列化，要先轉成物件或陣列。',
    ],
  },

  // ─── WeakMap ──────────────────────────────────────────────────────────────
  {
    slug: 'weakmap-basic',
    title: 'WeakMap',
    description: 'WeakMap key 只能是物件，弱引用允許 GC 回收，不可迭代',
    subCategory: 'WeakMap',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: 'WeakMap 與 Map 的核心差異',
          content: `| 特性 | Map | WeakMap |
|------|-----|---------|
| key 型別 | 任意型別 | 只能是物件（或 Symbol） |
| 引用強度 | 強引用（防止 GC） | 弱引用（不防止 GC） |
| 可迭代 | ✅ | ❌（無 forEach / keys / values） |
| size 屬性 | ✅ | ❌ |
| 使用場景 | 通用 key-value 儲存 | 私有資料、DOM 快取 |`,
        },
        {
          heading: '弱引用與 GC 的概念',
          content: `\`\`\`js
let obj = { name: 'Alice' }
const weakMap = new WeakMap()
weakMap.set(obj, '相關資料')

// obj 是唯一持有該物件的強引用
// 當 obj 設為 null，物件不再有強引用
obj = null

// 此時 GC 可以在任何時機回收 { name: 'Alice' }
// weakMap 中對應的 entry 也會自動消失
// （所以 WeakMap 無法被迭代，大小未知）
\`\`\``,
        },
        {
          heading: '典型使用場景',
          content: `\`\`\`js
// 1. 儲存私有資料（避免外洩）
const _private = new WeakMap()

class Person {
  constructor(name, age) {
    _private.set(this, { name, age })
  }
  getName() {
    return _private.get(this).name
  }
}

// 2. DOM 節點快取（節點移除後自動 GC）
const cache = new WeakMap()

function processNode(node) {
  if (cache.has(node)) return cache.get(node)
  const result = heavyComputation(node)
  cache.set(node, result)
  return result
}
// 當 DOM 節點從頁面移除並無其他引用時
// WeakMap 中的快取自動被 GC 回收，不會記憶體洩漏

// 3. 標記物件狀態（不侵入物件本身）
const initialized = new WeakMap()
function init(obj) {
  if (initialized.has(obj)) return
  // 初始化邏輯...
  initialized.set(obj, true)
}
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: 'WeakMap 的 key 可以是什麼型別？',
        options: [
          '任意型別，和 Map 相同',
          '只能是字串或 Symbol',
          '只能是物件（Object 或 Symbol）',
          '只能是物件，不能是 primitive',
        ],
        answer: 3,
        explanation: 'WeakMap 的 key 只能是物件（object）或 Symbol，不能是 primitive（字串、數字、布林等）。這是因為弱引用需要追蹤物件的記憶體位址，primitive 是值型別，無法追蹤引用。',
      },
      {
        id: 2,
        question: 'WeakMap 的「弱引用」是什麼意思？',
        options: [
          'WeakMap 存取速度比 Map 慢（弱效能）',
          'WeakMap 的 key 物件不會被計入引用計數，GC 可以回收它',
          'WeakMap 的值（value）會自動變為 null',
          'WeakMap 的 key 必須是弱型別（any）',
        ],
        answer: 1,
        explanation: '弱引用意味著 WeakMap 不會阻止 GC 回收 key 物件。當 key 物件在其他地方沒有強引用時，GC 可以隨時回收它，WeakMap 中對應的 entry 也會自動消失。這防止了記憶體洩漏。',
      },
      {
        id: 3,
        question: '以下哪個操作在 WeakMap 上會拋出錯誤？',
        options: [
          'weakMap.set(obj, "value")',
          'weakMap.get(obj)',
          'weakMap.has(obj)',
          'weakMap.forEach((v, k) => {})',
        ],
        answer: 3,
        explanation: 'WeakMap 不可迭代，沒有 forEach、keys()、values()、entries() 等方法，也沒有 size 屬性。WeakMap 只有 set()、get()、has()、delete() 四個方法。不可迭代是因為弱引用的不確定性，GC 可能隨時回收 key，導致大小不確定。',
      },
      {
        id: 4,
        question: '以下程式碼中，WeakMap 主要解決了什麼問題？\n\nconst cache = new WeakMap()\nfunction process(domNode) {\n  if (!cache.has(domNode)) {\n    cache.set(domNode, compute(domNode))\n  }\n  return cache.get(domNode)\n}',
        options: [
          '讓存取速度比普通物件更快',
          '防止 DOM 節點移除後快取造成記憶體洩漏',
          '允許在 key 上儲存多個值',
          '自動序列化 DOM 節點為字串',
        ],
        answer: 1,
        explanation: '若用普通 Map 快取 DOM 節點，即使節點從頁面移除，Map 仍持有強引用，節點無法被 GC 回收，造成記憶體洩漏。WeakMap 的弱引用讓 DOM 節點在頁面移除且無其他引用時，可被 GC 自動回收，快取 entry 也隨之消失。',
      },
      {
        id: 5,
        question: '以下程式碼，weakMap.has(key) 最終回傳什麼（GC 執行後）？\n\nlet key = {}\nconst weakMap = new WeakMap()\nweakMap.set(key, "data")\nkey = null\n// 假設 GC 已執行',
        options: [
          '永遠是 true，WeakMap 會保留資料',
          '永遠是 false，設為 null 後立即清除',
          'GC 執行後變為 false，時機不確定',
          '拋出 ReferenceError',
        ],
        answer: 2,
        explanation: 'key = null 之後，原本的物件沒有任何強引用。GC 執行後，物件被回收，WeakMap 中的 entry 也消失，has() 回傳 false。但 GC 執行時機不確定，所以嚴格來說在 GC 執行前可能還是 true。這也是為何 WeakMap 不能被迭代。',
      },
      {
        id: 6,
        question: '以下哪個是 WeakMap 的有效使用場景？',
        options: [
          '需要遍歷所有 key 來做統計分析',
          '需要知道目前儲存了幾個元素',
          '為類別的實例儲存私有資料，避免外部存取',
          '需要將資料序列化為 JSON 傳送',
        ],
        answer: 2,
        explanation: 'WeakMap 適合儲存私有資料，因為外部程式碼無法取得 key（this 物件），就無法存取值。WeakMap 不可迭代、沒有 size，所以無法遍歷或統計。也不支援 JSON 序列化。',
      },
    ],
    keyPoints: [
      'WeakMap 的 key 只能是物件，不能是字串、數字等 primitive。',
      '弱引用不阻止 GC，key 物件沒有其他強引用時，GC 可以回收它，entry 也消失。',
      'WeakMap 不可迭代，沒有 forEach、size、keys()、values()，只有 set/get/has/delete。',
      '典型場景：DOM 節點快取（避免記憶體洩漏）、儲存類別私有資料。',
      '不可迭代的根本原因是弱引用不確定性，GC 隨時可能回收，所以 size 永遠是未知的。',
      '和 Map 的最大差別：Map 是強引用，WeakMap 是弱引用；Map 可迭代，WeakMap 不行。',
    ],
  },

  // ─── Set 操作 ─────────────────────────────────────────────────────────────
  {
    slug: 'set-basic',
    title: 'Set 基本操作',
    description: 'add / has / delete / size / clear，add() 回傳 Set 本身',
    subCategory: 'Set 操作',
    difficulty: 'easy',
    notes: {
      sections: [
        {
          heading: 'Set 常用 API 一覽',
          content: `| 方法 / 屬性 | 說明 | 回傳值 |
|-------------|------|--------|
| \`set.add(value)\` | 新增元素 | Set 本身（可鏈式） |
| \`set.has(value)\` | 判斷元素是否存在 | \`boolean\` |
| \`set.delete(value)\` | 刪除元素 | \`boolean\`（是否刪除成功） |
| \`set.size\` | 目前元素數量 | \`number\`（屬性，非方法） |
| \`set.clear()\` | 清空所有元素 | \`undefined\` |`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const set = new Set()

// add() 回傳 Set 本身，可鏈式呼叫
set.add(1).add(2).add(3)

// 重複 add 不會增加元素
set.add(1)
console.log(set.size)  // 仍然是 3

// has() 判斷是否存在
console.log(set.has(2))  // true
console.log(set.has(5))  // false

// size 是屬性不是方法
console.log(set.size)    // 3
// set.size()  // TypeError

// delete() 回傳是否刪除成功
console.log(set.delete(2))  // true
console.log(set.delete(9))  // false
console.log(set.size)       // 2

// clear() 清空
set.clear()
console.log(set.size)  // 0
\`\`\``,
        },
        {
          heading: '初始化 Set 的方式',
          content: `\`\`\`js
// 從空 Set 開始
const s1 = new Set()

// 從陣列初始化（自動去重）
const s2 = new Set([1, 2, 2, 3, 3])
console.log([...s2])  // [1, 2, 3]

// 從字串初始化（每個字元為一個元素）
const s3 = new Set('hello')
console.log([...s3])  // ['h', 'e', 'l', 'o']
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: 'Set 的 add() 方法回傳什麼？\n\nconst s = new Set()\nconst result = s.add(1)',
        options: [
          '回傳插入的值（1）',
          '回傳 Set 本身',
          '回傳 true 表示插入成功',
          '回傳 undefined',
        ],
        answer: 1,
        explanation: 'add() 回傳 Set 本身，因此可以鏈式呼叫：set.add(1).add(2).add(3)。這和 Map 的 set() 回傳 Map 本身一樣，都支援鏈式操作。',
      },
      {
        id: 2,
        question: '以下程式碼執行後，set.size 是多少？\n\nconst set = new Set()\nset.add(1)\nset.add(2)\nset.add(1)\nset.add(3)',
        options: [
          '4',
          '3',
          '2',
          '1',
        ],
        answer: 1,
        explanation: 'Set 不允許重複值。第三次 add(1) 因為 1 已存在，所以不會增加元素。最終有 1、2、3 三個元素，size 為 3。',
      },
      {
        id: 3,
        question: 'set.size 的正確用法是？',
        options: [
          'set.size() — 呼叫為方法',
          'set.size — 直接存取為屬性',
          'set.length — 和陣列相同',
          'set.count',
        ],
        answer: 1,
        explanation: 'size 是 Set 的屬性，不是方法。應直接存取 set.size，呼叫 set.size() 會拋出 TypeError。Set 沒有 length 屬性（那是陣列的屬性）。',
      },
      {
        id: 4,
        question: 'set.delete(value) 回傳什麼？\n\nconst s = new Set([1, 2, 3])\nconsole.log(s.delete(2))  // ?\nconsole.log(s.delete(9))  // ?',
        options: [
          '兩個都是 true',
          'true 和 false',
          '兩個都是 undefined',
          '2 和 undefined',
        ],
        answer: 1,
        explanation: 'delete() 回傳布林值：成功刪除存在的元素回傳 true，嘗試刪除不存在的元素回傳 false。',
      },
      {
        id: 5,
        question: '以下哪種方式可以從陣列建立 Set？\n\nconst arr = [1, 2, 2, 3]',
        options: [
          'Set.from(arr)',
          'new Set(arr)',
          'arr.toSet()',
          'Set.of(...arr)',
        ],
        answer: 1,
        explanation: 'new Set(iterable) 建構函式接受任何可迭代物件，包括陣列。這同時會自動去除重複值。Set.from() 和 arr.toSet() 不是有效方法。',
      },
      {
        id: 6,
        question: '以下程式碼的輸出是什麼？\n\nconst s = new Set(\'aabbc\')\nconsole.log(s.size)',
        options: [
          '5（字串長度）',
          '3（去重後的字元數）',
          '2（重複字元數）',
          '拋出 TypeError',
        ],
        answer: 1,
        explanation: 'new Set(string) 將字串視為可迭代物件，每個字元成為一個元素。"aabbc" 的字元是 a, a, b, b, c，去重後剩 a, b, c 三個，所以 size 是 3。',
      },
    ],
    keyPoints: [
      'add() 回傳 Set 本身，支援鏈式呼叫 set.add(1).add(2).add(3)。',
      '重複 add 同一個值不會增加元素，Set 永遠只保留唯一值。',
      'size 是屬性不是方法，寫 set.size 而不是 set.size()。',
      'delete() 回傳布林值，成功回傳 true，元素不存在回傳 false。',
      'new Set(iterable) 可以接受陣列或字串，自動去重建立 Set。',
      'Set 沒有 length 屬性，取元素數量用 set.size。',
    ],
  },

  {
    slug: 'set-dedup',
    title: 'Set 去重特性',
    description: 'SameValueZero 演算法，NaN 視為相等，物件引用不去重',
    subCategory: 'Set 操作',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: 'SameValueZero 演算法',
          content: `Set 使用「SameValueZero」演算法判斷值是否重複，與 \`===\` 非常接近，但有一個例外：

| 比較 | === | Set（SameValueZero） |
|------|-----|---------------------|
| \`1 === 1\` | true | 視為相同 ✓ |
| \`NaN === NaN\` | **false** | **視為相同 ✓** |
| \`+0 === -0\` | true | 視為相同 ✓ |
| \`{} === {}\` | false | 視為不同 ✓ |

最關鍵的差別：NaN 在 \`===\` 中不等於自身，但在 Set 中被視為相同值。`,
        },
        {
          heading: 'NaN 去重與物件不去重',
          content: `\`\`\`js
// NaN：Set 視為相同，只保留一個
const s1 = new Set([NaN, NaN, NaN])
console.log(s1.size)     // 1
console.log(s1.has(NaN)) // true

// 物件：不同引用即使內容相同，視為不同元素
const s2 = new Set([{}, {}, {}])
console.log(s2.size)  // 3（三個不同的物件引用）

// 但同一個引用會去重
const obj = {}
const s3 = new Set([obj, obj, obj])
console.log(s3.size)  // 1（同一個引用）

// +0 和 -0 視為相同
const s4 = new Set([+0, -0])
console.log(s4.size)  // 1
\`\`\``,
        },
        {
          heading: '實用去重技巧',
          content: `\`\`\`js
// 陣列數字去重（最常用）
const nums = [1, 2, 2, 3, 3, 3]
const unique = [...new Set(nums)]  // [1, 2, 3]

// 字串陣列去重
const tags = ['js', 'css', 'js', 'html']
const uniqueTags = [...new Set(tags)]  // ['js', 'css', 'html']

// 注意：物件陣列無法用 Set 去重（引用不同）
const users = [{ id: 1 }, { id: 1 }]
const uniqueUsers = [...new Set(users)]  // 仍然有 2 個元素！

// 物件去重需要用其他方式
const uniqueById = [...new Map(users.map(u => [u.id, u])).values()]
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: '以下程式碼的輸出是什麼？\n\nconst s = new Set([NaN, NaN, 1, 1, \'a\', \'a\'])\nconsole.log(s.size)',
        options: [
          '6',
          '3',
          '2',
          '1',
        ],
        answer: 1,
        explanation: 'Set 使用 SameValueZero 演算法，NaN 被視為等於 NaN（這和 === 不同，=== 中 NaN !== NaN）。所以 NaN 只保留一個，1 只保留一個，"a" 只保留一個，共 3 個元素。',
      },
      {
        id: 2,
        question: '以下程式碼的輸出是什麼？\n\nconst s = new Set([{}, {}, {}])\nconsole.log(s.size)',
        options: [
          '1（內容相同視為重複）',
          '3（不同引用視為不同元素）',
          '0（物件不能加入 Set）',
          '拋出 TypeError',
        ],
        answer: 1,
        explanation: '每個 {} 都是新建立的物件，儘管內容相同，它們的引用不同。Set 比較物件時比的是引用（reference equality），所以三個 {} 都是不同元素，size 為 3。',
      },
      {
        id: 3,
        question: '以下程式碼的輸出是什麼？\n\nconsole.log(NaN === NaN)          // ?\nconsole.log(new Set([NaN]).has(NaN)) // ?',
        options: [
          'true 和 true',
          'false 和 false',
          'true 和 false',
          'false 和 true',
        ],
        answer: 3,
        explanation: 'NaN === NaN 在 JavaScript 中是 false，這是 NaN 特有的行為（NaN 不等於任何值，包括自身）。但 Set 使用 SameValueZero 演算法，將 NaN 視為等於 NaN，所以 set.has(NaN) 回傳 true。',
      },
      {
        id: 4,
        question: '如何用 Set 去除陣列中的重複數字？\n\nconst arr = [1, 2, 2, 3, 3, 3]',
        options: [
          'arr.unique()',
          '[...new Set(arr)]',
          'new Set(arr).toArray()',
          'Set.dedupe(arr)',
        ],
        answer: 1,
        explanation: '[...new Set(arr)] 是最常用的去重寫法。new Set(arr) 自動去重，spread 展開再轉回陣列。也可以寫成 Array.from(new Set(arr))，效果相同。',
      },
      {
        id: 5,
        question: '以下程式碼的輸出是什麼？\n\nconst s = new Set([+0, -0, 0])\nconsole.log(s.size)',
        options: [
          '3',
          '2',
          '1',
          '0',
        ],
        answer: 2,
        explanation: 'SameValueZero 演算法將 +0、-0、0 全部視為相同的值。所以三個看似不同的「零」在 Set 中只保留一個，size 為 1。',
      },
      {
        id: 6,
        question: '有一個物件陣列 [{id:1}, {id:1}, {id:2}]，用 new Set() 後 size 是多少？',
        options: [
          '2（按 id 去重）',
          '3（每個物件是不同引用）',
          '1（所有物件合併）',
          '拋出錯誤',
        ],
        answer: 1,
        explanation: 'Set 對物件比較的是引用，不是內容。三個物件字面量 {} 各自是不同引用，即使 id 相同也無法去重。若要根據 id 去重，需要用 Map：[...new Map(arr.map(u => [u.id, u])).values()]。',
      },
    ],
    keyPoints: [
      'Set 使用 SameValueZero 演算法判斷重複，和 === 幾乎相同，但 NaN 視為等於 NaN。',
      'NaN 在 === 中不等於自身，但在 Set 中只保留一個 NaN（視為相同）。',
      '物件比較的是引用，{} === {} 是 false，所以三個 {} 各自是不同的 Set 元素。',
      '[...new Set(arr)] 是去重陣列最簡潔的寫法。',
      '+0、-0、0 在 Set 中視為相同值，只保留一個。',
      '物件陣列無法用 Set 根據內容去重，需要搭配 Map 和自訂 key 才能做到。',
    ],
  },

  {
    slug: 'set-vs-array',
    title: 'Set vs 陣列',
    description: 'has() O(1) vs indexOf() O(n)，Set 無法直接存取索引',
    subCategory: 'Set 操作',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: 'Set vs 陣列的核心差異',
          content: `| 特性 | 陣列（Array） | Set |
|------|--------------|-----|
| 存取元素 | \`arr[index]\`（O(1)） | 無法用索引存取 |
| 查詢是否存在 | \`indexOf()\` O(n) | \`has()\` O(1) |
| 允許重複 | ✅ | ❌ |
| 保持順序 | ✅ | ✅（插入順序） |
| 大小 | \`arr.length\` | \`set.size\` |
| 轉換方式 | — | \`[...set]\` 或 \`Array.from(set)\` |`,
        },
        {
          heading: 'has() O(1) vs indexOf/includes O(n)',
          content: `\`\`\`js
// 陣列：indexOf 和 includes 是 O(n) — 需要逐一掃描
const arr = [1, 2, 3, 4, 5]
console.log(arr.indexOf(3))    // 2（找到回傳索引）
console.log(arr.indexOf(9))    // -1（找不到）
console.log(arr.includes(3))   // true

// Set：has 是 O(1) — 雜湊查詢，不論大小都一樣快
const set = new Set([1, 2, 3, 4, 5])
console.log(set.has(3))   // true
console.log(set.has(9))   // false

// 效能差異在大型資料集才明顯
// 例如：需要頻繁查詢一個 10 萬元素集合是否包含某值
// 用 Set 遠比陣列快
\`\`\``,
        },
        {
          heading: 'Set 轉陣列與何時選用 Set',
          content: `\`\`\`js
const set = new Set([3, 1, 4, 1, 5, 9])

// Set 轉陣列
const arr1 = [...set]          // [3, 1, 4, 5, 9]
const arr2 = Array.from(set)   // [3, 1, 4, 5, 9]

// Set 無法用索引存取（需要先轉陣列）
// set[0]  // undefined（不是 Set 的操作方式）

// 何時用 Set：
// 1. 需要去重
// 2. 高頻查詢某值是否存在（has() O(1)）
// 3. 需要快速刪除（delete() O(1)，陣列 splice 是 O(n)）

// 何時用陣列：
// 1. 需要索引存取（arr[i]）
// 2. 需要 map/filter/reduce 等函數式操作
// 3. 允許重複值
// 4. 需要 JSON 序列化
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: 'Set 的 has() 和陣列的 includes() 在時間複雜度上有何差異？',
        options: [
          '兩者都是 O(n)',
          '兩者都是 O(1)',
          'has() 是 O(1)，includes() 是 O(n)',
          'has() 是 O(n)，includes() 是 O(1)',
        ],
        answer: 2,
        explanation: 'Set 的 has() 使用雜湊表（hash table）實作，查詢是 O(1)，不論 Set 大小查詢時間都一樣。陣列的 includes()（和 indexOf()）需要從頭逐一掃描，時間複雜度是 O(n)，陣列越大越慢。',
      },
      {
        id: 2,
        question: '如何存取 Set 中的第一個元素？',
        options: [
          'set[0]',
          'set.first()',
          'set.get(0)',
          '[...set][0]',
        ],
        answer: 3,
        explanation: 'Set 不支援索引存取，set[0] 回傳 undefined（不是第一個元素）。需要先將 Set 轉換為陣列，再用索引存取：[...set][0] 或 Array.from(set)[0]。',
      },
      {
        id: 3,
        question: '以下程式碼的輸出是什麼？\n\nconst set = new Set([10, 20, 30])\nconsole.log(set[0])',
        options: [
          '10',
          '0',
          'undefined',
          '拋出 TypeError',
        ],
        answer: 2,
        explanation: 'Set 不是陣列，不支援數字索引存取。set[0] 嘗試存取 Set 物件的屬性 "0"，這個屬性不存在，所以回傳 undefined。若要存取第一個元素，需要 [...set][0]。',
      },
      {
        id: 4,
        question: '在以下哪個場景中，使用 Set 比使用陣列更有優勢？',
        options: [
          '需要用 map() 轉換每個元素',
          '有 100 萬個 ID，需要頻繁查詢某 ID 是否在集合中',
          '需要存取第 500 個元素',
          '需要將資料 JSON.stringify 後傳送',
        ],
        answer: 1,
        explanation: '高頻查詢是否存在（has()）是 Set 的最大優勢。100 萬個元素的陣列用 includes() 查詢是 O(n)，最壞情況需要掃描 100 萬次；Set 的 has() 是 O(1)，不論大小都幾乎是即時回應。',
      },
      {
        id: 5,
        question: '如何將 Set 轉換為陣列？（選出所有正確方式）\n\nconst set = new Set([1, 2, 3])',
        options: [
          'set.toArray()',
          '[...set] 或 Array.from(set)',
          'set.map(x => x)',
          'JSON.parse(JSON.stringify(set))',
        ],
        answer: 1,
        explanation: '[...set] 和 Array.from(set) 都是將 Set 轉換為陣列的正確方式，兩者等效。set.toArray() 不是有效方法。set.map() 不存在（Map 方法才有，而且 Map.prototype 也沒有 map()）。JSON.stringify(set) 會得到 "{}"，無法正確序列化。',
      },
      {
        id: 6,
        question: '如果需要儲存一組不重複的使用者 ID 並頻繁查詢，哪個資料結構更適合？',
        options: [
          '陣列，因為支援 indexOf()',
          'Set，因為 has() 是 O(1) 且自動去重',
          '兩者效能完全相同',
          '物件，因為屬性查詢是 O(1)',
        ],
        answer: 1,
        explanation: 'Set 在此場景有兩個優勢：1) has() 是 O(1) 雜湊查詢，比陣列的 indexOf() O(n) 快；2) 自動去重，不用手動維護唯一性。物件也能做 O(1) 查詢（obj[id] 或 id in obj），但需要處理型別轉換等問題，Set 語意更清晰。',
      },
    ],
    keyPoints: [
      'Set 的 has() 時間複雜度是 O(1)，陣列的 includes()/indexOf() 是 O(n)。',
      'Set 無法用數字索引存取元素，set[0] 回傳 undefined，需先轉為陣列。',
      'Set 轉陣列用 [...set] 或 Array.from(set)，兩者等效。',
      '需要去重或高頻查詢存在性就用 Set；需要索引存取或函數式操作就用陣列。',
      'Set 刪除元素（delete）是 O(1)，陣列的 splice/filter 是 O(n)。',
      'JSON.stringify(set) 得到 "{}"，Set 不能直接序列化，需先轉陣列。',
    ],
  },

  // ─── WeakSet ──────────────────────────────────────────────────────────────
  {
    slug: 'weakset-basic',
    title: 'WeakSet',
    description: 'WeakSet 只能存物件，弱引用，不可迭代，使用場景有限',
    subCategory: 'WeakSet',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: 'WeakSet 與 Set 的核心差異',
          content: `| 特性 | Set | WeakSet |
|------|-----|---------|
| 元素型別 | 任意型別 | 只能是物件 |
| 引用強度 | 強引用 | 弱引用 |
| 可迭代 | ✅ | ❌ |
| size 屬性 | ✅ | ❌ |
| 方法 | add/has/delete/clear/forEach/... | 只有 add/has/delete |

WeakSet 的核心概念和 WeakMap 相同：弱引用、不可迭代、允許 GC 回收。`,
        },
        {
          heading: 'WeakSet 基本操作',
          content: `\`\`\`js
const ws = new WeakSet()

const obj1 = { name: 'Alice' }
const obj2 = { name: 'Bob' }

// 只能 add 物件
ws.add(obj1)
ws.add(obj2)

// 檢查是否存在
console.log(ws.has(obj1))  // true
console.log(ws.has({}))    // false（不同引用）

// 刪除
ws.delete(obj1)
console.log(ws.has(obj1))  // false

// 不能 add primitive（會拋出 TypeError）
// ws.add(1)       // TypeError
// ws.add('hello') // TypeError
// ws.add(null)    // TypeError

// 不可迭代，沒有 size、forEach、keys、values
// ws.size      // undefined
// ws.forEach() // TypeError
\`\`\``,
        },
        {
          heading: '典型使用場景：標記已訪問的 DOM 節點',
          content: `\`\`\`js
// 使用場景：標記已初始化或已訪問的物件
const visited = new WeakSet()

function processNode(node) {
  if (visited.has(node)) {
    console.log('已訪問，跳過')
    return
  }
  visited.add(node)
  // 執行初始化邏輯...
  node.classList.add('processed')
}

// 好處：當 DOM 節點從頁面移除後
// WeakSet 中的引用自動被 GC 回收，不會記憶體洩漏

// 另一個場景：防止循環引用問題（圖的 DFS）
const seen = new WeakSet()
function deepClone(obj) {
  if (seen.has(obj)) return '[Circular]'
  seen.add(obj)
  // 繼續深度複製...
}
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: 'WeakSet 可以儲存哪些型別的值？',
        options: [
          '任意型別，和 Set 相同',
          '只能是字串或數字',
          '只能是物件，不能是 primitive',
          '只能是函式',
        ],
        answer: 2,
        explanation: 'WeakSet 只能儲存物件（objects），不能存放 primitive 型別（字串、數字、布林、null、undefined、Symbol）。嘗試 add primitive 會拋出 TypeError。',
      },
      {
        id: 2,
        question: '以下哪行程式碼會拋出 TypeError？\n\nconst ws = new WeakSet()',
        options: [
          'ws.add({})',
          'ws.add([])',
          'ws.add(function(){})',
          'ws.add(42)',
        ],
        answer: 3,
        explanation: 'ws.add(42) 嘗試新增數字（primitive），WeakSet 不允許存放 primitive，會拋出 TypeError。{}、[]（陣列也是物件）、function(){} 都是物件，可以正常加入。',
      },
      {
        id: 3,
        question: 'WeakSet 不可迭代的根本原因是什麼？',
        options: [
          '設計者懶得實作迭代功能',
          '弱引用的不確定性：GC 隨時可能回收元素，使集合大小不確定',
          'WeakSet 的效能比 Set 差，迭代會很慢',
          'WeakSet 只支援原始型別，原始型別無法迭代',
        ],
        answer: 1,
        explanation: '弱引用的本質是不阻止 GC 回收。由於 GC 可能在任何時刻回收 WeakSet 中的元素，集合的大小和內容在不同時間點可能不同，因此無法提供穩定的迭代結果，所以不實作迭代功能。',
      },
      {
        id: 4,
        question: '以下程式碼正確使用 WeakSet 的場景是哪個？',
        options: [
          '儲存所有使用者的 ID（數字）以便查詢',
          '標記已處理的 DOM 節點，節點移除後自動 GC',
          '需要遍歷所有元素並統計數量',
          '需要序列化為 JSON 後傳送',
        ],
        answer: 1,
        explanation: '標記 DOM 節點是 WeakSet 的典型使用場景。當節點從頁面移除且無其他強引用時，WeakSet 中的引用自動被 GC 回收，不會造成記憶體洩漏。儲存數字（primitive）會拋出錯誤；WeakSet 不可迭代無法統計；也無法序列化。',
      },
      {
        id: 5,
        question: 'WeakSet 有哪些方法？',
        options: [
          'add / has / delete / clear / forEach / size',
          'add / has / delete（僅這三個）',
          'set / get / has / delete',
          'push / includes / remove',
        ],
        answer: 1,
        explanation: 'WeakSet 只有三個方法：add()、has()、delete()。沒有 clear()（Set 有）、forEach()（Set 有）、size 屬性（Set 有）。所有與迭代或大小相關的操作都不支援。',
      },
      {
        id: 6,
        question: '以下程式碼中，WeakSet 和 Set 的行為有何不同？\n\nlet node = document.createElement("div")\nconst ws = new WeakSet()\nconst s = new Set()\nws.add(node)\ns.add(node)\nnode = null\n// 假設 GC 已執行',
        options: [
          '兩者的 node 引用都被回收',
          'WeakSet 中的 node 可被 GC 回收；Set 中的 node 因強引用不會被回收',
          '兩者都不會被回收，因為我們仍可呼叫 ws.has() 和 s.has()',
          'WeakSet 和 Set 對 GC 的影響完全相同',
        ],
        answer: 1,
        explanation: '這正是 Weak 的核心意義。node = null 後，Set 仍持有對 node 的強引用，阻止 GC 回收，可能造成記憶體洩漏。WeakSet 是弱引用，不阻止 GC，node 可以被回收，WeakSet 中的 entry 也隨之消失。',
      },
    ],
    keyPoints: [
      'WeakSet 只能存物件，嘗試 add 字串、數字等 primitive 會拋出 TypeError。',
      'WeakSet 是弱引用，不阻止 GC 回收元素，物件被回收後 entry 自動消失。',
      'WeakSet 不可迭代，沒有 size、forEach、keys 等，只有 add/has/delete 三個方法。',
      '典型場景：標記已訪問/已初始化的 DOM 節點，節點移除後不造成記憶體洩漏。',
      '不可迭代的根本原因：GC 可能隨時回收元素，集合大小不確定，迭代結果不穩定。',
      'WeakSet 和 Set 的最大差別：弱引用 vs 強引用；不可迭代 vs 可迭代。',
    ],
  },
]
