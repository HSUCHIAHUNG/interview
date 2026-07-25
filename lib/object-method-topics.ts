export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  answer: number      // 0-based
  explanation: string
}

export interface ObjectMethodEntry {
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

export const THEME = '物件方法'

export const OBJECT_SUB_CATEGORIES = [
  { name: '取得資訊', order: 1 },
  { name: '複製', order: 2 },
  { name: '保護', order: 3 },
  { name: '建立與轉換', order: 4 },
  { name: '查詢與比較', order: 5 },
]

export const objectMethodTopics: ObjectMethodEntry[] = [
  // ─── 取得資訊 ────────────────────────────────────────────────────
  {
    slug: 'obj-keys',
    title: 'Object.keys()',
    description: '取得物件自身可枚舉屬性的 key 陣列',
    subCategory: '取得資訊',
    difficulty: 'easy',
    notes: {
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`Object.keys(obj)\`

回傳：字串陣列，包含物件**自身**（不含原型鏈）**可枚舉**（enumerable）屬性的 key。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const obj = { a: 1, b: 2, c: 3 }
Object.keys(obj)   // ['a', 'b', 'c']

// 繼承屬性不包含在內
function Person(name) { this.name = name }
Person.prototype.greet = function() {}
const p = new Person('Alice')
Object.keys(p)     // ['name']  ← 不含 greet

// 不可枚舉屬性不包含
const obj2 = {}
Object.defineProperty(obj2, 'hidden', { value: 42, enumerable: false })
Object.keys(obj2)  // []
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- 只回傳**自身**屬性，不含原型鏈
- 只回傳**可枚舉**屬性（enumerable: true）
- 整數 key 會依數值大小排序，其他 key 按插入順序
- 搭配 \`forEach\`、\`map\` 可快速迭代物件`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: '以下程式碼輸出什麼？\n\n```js\nconst obj = { b: 2, a: 1, c: 3 }\nconsole.log(Object.keys(obj))\n```',
        options: [
          "['a', 'b', 'c']",
          "['b', 'a', 'c']",
          "['b', 'a', 'c'] 或 ['a', 'b', 'c']（不保證順序）",
          '拋出 TypeError',
        ],
        answer: 1,
        explanation: "Object.keys() 對於非整數 key，依照屬性插入順序回傳，所以結果是 ['b', 'a', 'c']。",
      },
      {
        id: 2,
        question: '以下程式碼輸出什麼？\n\n```js\nfunction Animal(type) { this.type = type }\nAnimal.prototype.sound = \'...\'\nconst dog = new Animal(\'dog\')\nconsole.log(Object.keys(dog))\n```',
        options: [
          "['type']",
          "['type', 'sound']",
          "['sound']",
          '[]',
        ],
        answer: 0,
        explanation: "Object.keys() 只回傳物件自身（own）屬性，不包含原型鏈上的 sound，所以結果是 ['type']。",
      },
      {
        id: 3,
        question: '以下程式碼輸出什麼？\n\n```js\nconst obj = {}\nObject.defineProperty(obj, \'secret\', { value: 99, enumerable: false })\nconsole.log(Object.keys(obj))\n```',
        options: [
          "['secret']",
          '[]',
          "['secret': 99]",
          '拋出 TypeError',
        ],
        answer: 1,
        explanation: 'Object.keys() 只回傳可枚舉（enumerable: true）的屬性，secret 的 enumerable 設為 false，所以結果為空陣列。',
      },
      {
        id: 4,
        question: '以下程式碼輸出什麼？\n\n```js\nconst obj = { 2: \'b\', 0: \'a\', 1: \'c\' }\nconsole.log(Object.keys(obj))\n```',
        options: [
          "['2', '0', '1']",
          "['0', '1', '2']",
          "[0, 1, 2]",
          "['2', '0', '1']（依插入順序）",
        ],
        answer: 1,
        explanation: "整數索引 key 會自動依數值大小排序，所以結果是 ['0', '1', '2']，且 key 以字串形式回傳。",
      },
      {
        id: 5,
        question: 'Object.keys() 與 for...in 的主要差異是什麼？',
        options: [
          'for...in 只遍歷自身屬性，Object.keys() 包含原型鏈',
          'Object.keys() 只回傳自身可枚舉屬性；for...in 也會遍歷原型鏈的可枚舉屬性',
          '兩者完全相同，沒有差異',
          'Object.keys() 包含不可枚舉屬性，for...in 不包含',
        ],
        answer: 1,
        explanation: 'Object.keys() 只回傳物件自身的可枚舉屬性。for...in 除了自身屬性外，還會遍歷原型鏈上的可枚舉屬性，因此通常搭配 hasOwnProperty 過濾。',
      },
      {
        id: 6,
        question: '以下程式碼輸出什麼？\n\n```js\nconsole.log(Object.keys(\'hello\'))\n```',
        options: [
          "拋出 TypeError：不能對字串使用 Object.keys()",
          "['h', 'e', 'l', 'l', 'o']",
          "['0', '1', '2', '3', '4']",
          '[]',
        ],
        answer: 2,
        explanation: "字串在 ES2015+ 中會被視為類陣列物件，Object.keys('hello') 回傳索引字串陣列 ['0', '1', '2', '3', '4']。",
      },
    ],
    keyPoints: [
      'Object.keys() 只回傳物件自身的可枚舉屬性 key，不含原型鏈',
      '整數 key 會依數值大小排序，其他 key 按插入順序排列',
      'enumerable: false 的屬性不會出現在結果中',
      '對字串使用時，回傳索引字串陣列（\'0\'、\'1\'...）',
      '與 for...in 的關鍵差異：for...in 還會遍歷原型鏈上的可枚舉屬性',
    ],
  },

  {
    slug: 'obj-values',
    title: 'Object.values()',
    description: '取得物件自身可枚舉屬性的值陣列',
    subCategory: '取得資訊',
    difficulty: 'easy',
    notes: {
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`Object.values(obj)\`

回傳：包含物件**自身可枚舉**屬性**值**的陣列，順序與 \`Object.keys()\` 對應。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const obj = { a: 1, b: 'hello', c: true }
Object.values(obj)   // [1, 'hello', true]

// 巢狀物件的值是引用
const nested = { x: { n: 10 } }
Object.values(nested)  // [{ n: 10 }]

// 搭配 reduce 計算總和
const scores = { math: 90, english: 85, science: 95 }
const total = Object.values(scores).reduce((acc, v) => acc + v, 0)
// total = 270
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- 只回傳自身可枚舉屬性的值，不含原型鏈
- 值的順序與 \`Object.keys()\` 一致
- 巢狀物件的值是引用，不是深拷貝
- ES2017 新增，IE 不支援`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: '以下程式碼輸出什麼？\n\n```js\nconst obj = { x: 10, y: 20, z: 30 }\nconsole.log(Object.values(obj))\n```',
        options: [
          '[10, 20, 30]',
          "['x', 'y', 'z']",
          "[['x', 10], ['y', 20], ['z', 30]]",
          '{ 0: 10, 1: 20, 2: 30 }',
        ],
        answer: 0,
        explanation: 'Object.values() 回傳屬性值組成的陣列，結果為 [10, 20, 30]。',
      },
      {
        id: 2,
        question: '以下程式碼輸出什麼？\n\n```js\nconst obj = {}\nObject.defineProperty(obj, \'hidden\', { value: 42, enumerable: false })\nobj.visible = 99\nconsole.log(Object.values(obj))\n```',
        options: [
          '[42, 99]',
          '[99]',
          '[42]',
          '[]',
        ],
        answer: 1,
        explanation: 'Object.values() 只回傳可枚舉屬性的值。hidden 的 enumerable 為 false，只有 visible 符合條件，結果為 [99]。',
      },
      {
        id: 3,
        question: '使用 Object.values() 搭配哪個方法可以最快計算物件所有數值屬性的總和？',
        options: [
          'Object.values(obj).forEach()',
          'Object.values(obj).reduce((acc, v) => acc + v, 0)',
          'Object.keys(obj).map()',
          'Object.entries(obj).filter()',
        ],
        answer: 1,
        explanation: 'Object.values() 取得所有值後，搭配 reduce() 從初始值 0 開始累加，是最簡潔的計算總和方式。',
      },
      {
        id: 4,
        question: '以下程式碼中，vals[0].n 修改後，nested.x.n 的值是？\n\n```js\nconst nested = { x: { n: 10 } }\nconst vals = Object.values(nested)\nvals[0].n = 99\nconsole.log(nested.x.n)\n```',
        options: [
          '10（Object.values 深拷貝了物件）',
          '99（引用相同物件）',
          'undefined',
          '拋出 TypeError',
        ],
        answer: 1,
        explanation: 'Object.values() 回傳的是值的引用，不是深拷貝。巢狀物件 { n: 10 } 的引用與 nested.x 相同，修改 vals[0].n 也等於修改 nested.x.n，結果為 99。',
      },
      {
        id: 5,
        question: 'Object.values() 與 Object.keys() 回傳的陣列，其元素順序關係是？',
        options: [
          '完全無關，順序可能不同',
          '兩者順序完全一致，index 互相對應',
          'Object.values() 依值大小排序，Object.keys() 依插入順序',
          '只有整數 key 的情況才保證順序一致',
        ],
        answer: 1,
        explanation: 'Object.values() 的順序與 Object.keys() 完全一致，所以 Object.keys(obj)[i] 和 Object.values(obj)[i] 永遠對應同一個屬性，這也是 Object.entries() 的基礎。',
      },
    ],
    keyPoints: [
      'Object.values() 回傳物件自身可枚舉屬性的值陣列',
      '值的順序與 Object.keys() 完全對應',
      '巢狀物件的值是引用，修改會影響原物件',
      '搭配 reduce 可快速計算總和或其他聚合運算',
      '不可枚舉屬性（enumerable: false）的值不會出現在結果中',
    ],
  },

  {
    slug: 'obj-entries',
    title: 'Object.entries()',
    description: '取得物件自身可枚舉屬性的 [key, value] 二維陣列',
    subCategory: '取得資訊',
    difficulty: 'easy',
    notes: {
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`Object.entries(obj)\`

回傳：\`[[key1, val1], [key2, val2], ...]\` 的二維陣列，每個子陣列都是 \`[key, value]\` 對。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const obj = { a: 1, b: 2 }
Object.entries(obj)  // [['a', 1], ['b', 2]]

// 解構搭配 for...of 迭代
for (const [key, value] of Object.entries(obj)) {
  console.log(key, value)  // 'a' 1, 'b' 2
}

// 轉換：過濾值 > 1 的屬性
const filtered = Object.fromEntries(
  Object.entries(obj).filter(([, v]) => v > 1)
)
// filtered = { b: 2 }
\`\`\``,
        },
        {
          heading: '與 keys / values 的對比',
          content: `| 方法 | 回傳 |
|---|---|
| \`Object.keys(obj)\` | \`['a', 'b']\` |
| \`Object.values(obj)\` | \`[1, 2]\` |
| \`Object.entries(obj)\` | \`[['a', 1], ['b', 2]]\` |

\`Object.entries()\` 搭配 \`Object.fromEntries()\` 可以進行物件的映射或過濾，是最靈活的組合。`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: '以下程式碼輸出什麼？\n\n```js\nconst obj = { name: \'Alice\', age: 30 }\nconsole.log(Object.entries(obj))\n```',
        options: [
          "[['name', 'Alice'], ['age', 30]]",
          "['name', 'Alice', 'age', 30]",
          "{ name: 'Alice', age: 30 }",
          "[{key: 'name', value: 'Alice'}, {key: 'age', value: 30}]",
        ],
        answer: 0,
        explanation: "Object.entries() 回傳二維陣列，每個子陣列為 [key, value] 對，結果為 [['name', 'Alice'], ['age', 30]]。",
      },
      {
        id: 2,
        question: '下列哪種方式可以正確地用 for...of 遍歷物件的 key 和 value？',
        options: [
          'for (const kv of obj) { console.log(kv) }',
          'for (const [key, value] of Object.entries(obj)) { console.log(key, value) }',
          'for (const key in Object.values(obj)) { console.log(key) }',
          'Object.keys(obj).forEach(([k, v]) => console.log(k, v))',
        ],
        answer: 1,
        explanation: 'Object.entries() 回傳可迭代的 [key, value] 陣列，搭配 for...of 解構是遍歷物件最現代的方式。直接 for...of 物件會拋錯，因為普通物件不是可迭代的。',
      },
      {
        id: 3,
        question: '以下程式碼，filtered 的結果是什麼？\n\n```js\nconst prices = { apple: 20, banana: 5, cherry: 15 }\nconst filtered = Object.fromEntries(\n  Object.entries(prices).filter(([, v]) => v >= 15)\n)\n```',
        options: [
          "{ apple: 20, cherry: 15 }",
          "{ banana: 5 }",
          "[['apple', 20], ['cherry', 15]]",
          "{ apple: 20, banana: 5, cherry: 15 }",
        ],
        answer: 0,
        explanation: "Object.entries() 取出所有 [key, value] 對，filter 保留值 >= 15 的項目（apple: 20, cherry: 15），再用 Object.fromEntries() 轉回物件，結果為 { apple: 20, cherry: 15 }。",
      },
      {
        id: 4,
        question: 'Object.entries() 的回傳值中，key 的類型是什麼？',
        options: [
          '與原始屬性名稱的類型相同（可能是 number 或 string）',
          '永遠是 string',
          '永遠是 number',
          '依屬性的可枚舉性而定',
        ],
        answer: 1,
        explanation: 'JavaScript 物件的屬性名稱（key）在底層都是字串（或 Symbol），Object.entries() 回傳的 key 永遠是 string 類型，即使原本看起來是數字。',
      },
      {
        id: 5,
        question: '以下程式碼輸出什麼？\n\n```js\nconst obj = { 3: \'c\', 1: \'a\', 2: \'b\' }\nconsole.log(Object.entries(obj).map(([k]) => k))\n```',
        options: [
          "['3', '1', '2']（插入順序）",
          "['1', '2', '3']（數值排序）",
          "[1, 2, 3]（數值類型）",
          "['3', '1', '2'] 或 ['1', '2', '3']（不保證）",
        ],
        answer: 1,
        explanation: "整數 key 會依數值大小排序，且 key 以字串回傳，所以結果是 ['1', '2', '3']。",
      },
      {
        id: 6,
        question: '要將 Map 轉換成物件，最簡潔的方式是？',
        options: [
          'JSON.parse(JSON.stringify(map))',
          'Object.fromEntries(map)',
          'Object.entries(map)',
          'Array.from(map).reduce()',
        ],
        answer: 1,
        explanation: 'Map 本身是可迭代的，其迭代器產生 [key, value] 對，Object.fromEntries(map) 可直接將 Map 轉換成普通物件，是最簡潔的方式。',
      },
    ],
    keyPoints: [
      'Object.entries() 回傳 [[key, value], ...] 的二維陣列，方便同時取得 key 和 value',
      'key 永遠以字串形式回傳，即使原本是數字',
      '搭配 Object.fromEntries() 可對物件做映射或過濾操作',
      '搭配 for...of 解構是現代迭代物件最清晰的寫法',
      '只包含自身可枚舉屬性，不含原型鏈',
      'Map 可直接傳入 Object.fromEntries() 轉為普通物件',
    ],
  },

  // ─── 複製 ─────────────────────────────────────────────────────
  {
    slug: 'obj-assign',
    title: 'Object.assign()',
    description: '淺拷貝：將來源物件屬性複製到目標物件',
    subCategory: '複製',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`Object.assign(target, ...sources)\`

回傳：**target 物件本身**（已修改）。來源物件的可枚舉自身屬性會被複製到 target。`,
        },
        {
          heading: '淺拷貝陷阱：巢狀物件',
          content: `\`\`\`js
const source = { a: 1, nested: { b: 2 } }
const clone = Object.assign({}, source)

// 修改基本型別屬性 → 互不影響
clone.a = 99
console.log(source.a)  // 1 ✓

// 修改巢狀物件屬性 → 影響原物件！
clone.nested.b = 99
console.log(source.nested.b)  // 99 ← 淺拷貝的陷阱
\`\`\`

巢狀物件只複製引用（reference），兩個物件共享同一個巢狀物件。`,
        },
        {
          heading: '合併多個物件',
          content: `\`\`\`js
const target = { a: 1 }
const src1   = { b: 2 }
const src2   = { c: 3, a: 99 }  // 後面的 source 覆蓋前面的

const result = Object.assign(target, src1, src2)
// target === result → true（同一個物件）
// result = { a: 99, b: 2, c: 3 }

// 不想修改 target，用空物件作為第一個參數
const merged = Object.assign({}, target, src1, src2)
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: '以下程式碼輸出什麼？\n\n```js\nconst a = { x: 1 }\nconst b = Object.assign(a, { y: 2 })\nconsole.log(a === b)\n```',
        options: [
          'false（assign 建立新物件）',
          'true（assign 回傳 target 本身）',
          'undefined',
          '拋出 TypeError',
        ],
        answer: 1,
        explanation: 'Object.assign() 修改並回傳 target 物件本身，不建立新物件。所以 a === b 為 true。',
      },
      {
        id: 2,
        question: '以下程式碼，source.info.age 最終是？\n\n```js\nconst source = { name: \'Alice\', info: { age: 25 } }\nconst clone = Object.assign({}, source)\nclone.info.age = 99\nconsole.log(source.info.age)\n```',
        options: [
          '25（Object.assign 深拷貝了所有屬性）',
          '99（淺拷貝，巢狀物件共享引用）',
          'undefined',
          '拋出 TypeError',
        ],
        answer: 1,
        explanation: 'Object.assign() 是淺拷貝，巢狀物件 info 只複製引用，clone.info 和 source.info 指向同一個物件。修改 clone.info.age 也會改變 source.info.age，結果為 99。',
      },
      {
        id: 3,
        question: '以下程式碼輸出什麼？\n\n```js\nconst result = Object.assign({ a: 1 }, { a: 2, b: 3 }, { b: 99 })\nconsole.log(result)\n```',
        options: [
          '{ a: 1, b: 3 }（target 優先）',
          '{ a: 2, b: 99 }（後面的 source 覆蓋前面）',
          '{ a: 1, a: 2, b: 3, b: 99 }',
          '拋出 TypeError（屬性衝突）',
        ],
        answer: 1,
        explanation: '當多個 source 有相同 key 時，後面的 source 會覆蓋前面的。結果為 { a: 2, b: 99 }。',
      },
      {
        id: 4,
        question: 'Object.assign() 會複製哪些屬性？',
        options: [
          '所有屬性，包含原型鏈和不可枚舉屬性',
          '只複製來源物件自身的可枚舉屬性',
          '只複製可枚舉屬性，包含原型鏈',
          '所有自身屬性，包含不可枚舉屬性',
        ],
        answer: 1,
        explanation: 'Object.assign() 只複製來源物件（source）自身的（own）可枚舉（enumerable）屬性，不複製原型鏈屬性，也不複製 enumerable: false 的屬性。',
      },
      {
        id: 5,
        question: '以下哪種方式能夠避免 Object.assign() 修改原本的 target？',
        options: [
          'Object.assign(source, {})',
          'Object.assign({}, source)',
          'Object.assign(null, source)',
          'Object.assign(source)',
        ],
        answer: 1,
        explanation: '將空物件 {} 作為第一個參數（target），來源屬性都複製到這個新物件上，原本的 source 不會被修改。這是最常見的淺拷貝模式。',
      },
      {
        id: 6,
        question: '以下程式碼，clone.name 修改後，source.name 是？\n\n```js\nconst source = { name: \'Alice\', info: { age: 25 } }\nconst clone = Object.assign({}, source)\nclone.name = \'Bob\'\nconsole.log(source.name)\n```',
        options: [
          "'Bob'（淺拷貝共享引用）",
          "'Alice'（基本型別值已複製，互不影響）",
          'undefined',
          '拋出 TypeError',
        ],
        answer: 1,
        explanation: '字串是基本型別（primitive），Object.assign() 複製的是值本身，不是引用。clone.name 與 source.name 是獨立的，修改 clone.name 不影響 source.name，仍為 \'Alice\'。',
      },
    ],
    keyPoints: [
      'Object.assign() 是淺拷貝，巢狀物件只複製引用，修改會影響原物件',
      '基本型別屬性（string、number）複製的是值，互不影響',
      'Object.assign() 回傳 target 本身，不建立新物件',
      '後面的 source 屬性會覆蓋前面相同 key 的屬性',
      '只複製來源物件自身的可枚舉屬性',
      '用 Object.assign({}, obj) 建立淺拷貝，避免修改原物件',
    ],
  },

  {
    slug: 'obj-spread',
    title: 'Spread {...obj}',
    description: '展開運算子建立新物件，與 assign 的差異',
    subCategory: '複製',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: '基本語法',
          content: `\`\`\`js
const original = { a: 1, b: 2 }

// Spread 建立新物件
const copy = { ...original }
console.log(copy === original)  // false（新物件）

// 合併多個物件
const merged = { ...obj1, ...obj2, extra: 99 }

// 覆蓋屬性
const updated = { ...original, b: 99 }
// { a: 1, b: 99 }
\`\`\``,
        },
        {
          heading: 'Spread vs Object.assign()',
          content: `| 比較 | \`{...obj}\` | \`Object.assign({}, obj)\` |
|---|---|---|
| 修改原物件？ | 否（建立新物件） | 否（target 是 {}） |
| 修改 target | 不適用 | 修改 target |
| 可覆蓋屬性 | 是 | 是（後面 source 覆蓋） |
| getter 行為 | 求值後複製結果 | 求值後複製結果 |

\`\`\`js
// Spread 不修改原物件
const obj = { a: 1 }
const copy = { ...obj }  // 建立全新物件

// Object.assign 修改 target
const target = { a: 1 }
Object.assign(target, { b: 2 })  // target 被修改！
\`\`\`

兩者都是**淺拷貝**，巢狀物件的引用行為相同。`,
        },
        {
          heading: '注意事項',
          content: `- Spread 只複製自身可枚舉屬性，與 Object.assign() 相同
- 兩者都是**淺拷貝**，巢狀物件共享引用
- Spread 語法更簡潔，在覆蓋屬性時更直觀
- Spread 不能展開 null 或 undefined（會靜默忽略）`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: '以下程式碼輸出什麼？\n\n```js\nconst obj = { a: 1 }\nconst copy = { ...obj }\nconsole.log(copy === obj)\n```',
        options: [
          'true（Spread 複製引用）',
          'false（Spread 建立新物件）',
          'undefined',
          '拋出 TypeError',
        ],
        answer: 1,
        explanation: 'Spread 語法 {...obj} 會建立一個全新的物件，不是原物件的引用，所以 copy === obj 為 false。',
      },
      {
        id: 2,
        question: '以下程式碼，source.nested.x 最終是？\n\n```js\nconst source = { name: \'A\', nested: { x: 1 } }\nconst copy = { ...source }\ncopy.nested.x = 99\nconsole.log(source.nested.x)\n```',
        options: [
          '1（Spread 深拷貝所有屬性）',
          '99（Spread 也是淺拷貝，巢狀物件共享引用）',
          'undefined',
          '拋出 TypeError',
        ],
        answer: 1,
        explanation: 'Spread {...obj} 也是淺拷貝，巢狀物件 nested 只複製引用，copy.nested 和 source.nested 指向同一物件，修改 copy.nested.x 也會影響 source.nested.x，結果為 99。',
      },
      {
        id: 3,
        question: 'Spread 語法與 Object.assign({}, obj) 的關鍵差異是什麼？',
        options: [
          'Spread 是深拷貝，Object.assign() 是淺拷貝',
          'Object.assign() 修改 target，Spread 建立新物件；巢狀物件的淺拷貝行為相同',
          'Spread 可複製原型鏈屬性，Object.assign() 不行',
          'Object.assign() 較新，Spread 是舊語法',
        ],
        answer: 1,
        explanation: '關鍵差異在於：Object.assign(target, src) 修改 target；Spread 建立全新物件。但兩者對於巢狀物件都是淺拷貝，行為相同。',
      },
      {
        id: 4,
        question: '以下程式碼，result 的內容是？\n\n```js\nconst defaults = { color: \'red\', size: \'medium\' }\nconst custom   = { size: \'large\', weight: 1 }\nconst result   = { ...defaults, ...custom }\n```',
        options: [
          "{ color: 'red', size: 'medium', weight: 1 }（defaults 優先）",
          "{ color: 'red', size: 'large', weight: 1 }（後面的覆蓋前面）",
          "{ color: 'red', size: 'large', size: 'medium', weight: 1 }",
          '拋出 TypeError（size 衝突）',
        ],
        answer: 1,
        explanation: 'Spread 合併物件時，後面展開的屬性會覆蓋前面的同名屬性。custom 的 size: \'large\' 覆蓋 defaults 的 size: \'medium\'，結果為 { color: \'red\', size: \'large\', weight: 1 }。',
      },
      {
        id: 5,
        question: '以下程式碼輸出什麼？\n\n```js\nconst val = null\nconst obj = { ...val, a: 1 }\nconsole.log(obj)\n```',
        options: [
          '拋出 TypeError：不能展開 null',
          '{ a: 1 }（null 被靜默忽略）',
          '{ null: null, a: 1 }',
          '{ a: 1, null: undefined }',
        ],
        answer: 1,
        explanation: 'Spread 展開 null 或 undefined 時不會拋出錯誤，會靜默忽略，等同於 { a: 1 }。這與陣列展開 [...null] 不同（陣列展開 null 會拋錯）。',
      },
      {
        id: 6,
        question: '要不修改原始物件，又要更新某個屬性，以下哪種寫法正確？',
        options: [
          'Object.assign(original, { key: newValue })',
          'const updated = { ...original, key: newValue }',
          'original.key = newValue',
          'Object.freeze({ ...original, key: newValue })',
        ],
        answer: 1,
        explanation: 'const updated = { ...original, key: newValue } 用 Spread 建立新物件，並在後面用 key: newValue 覆蓋舊值，不會修改原始物件，是 React 狀態更新的常見模式。',
      },
    ],
    keyPoints: [
      'Spread {...obj} 建立全新物件，不修改原物件',
      'Spread 和 Object.assign() 都是淺拷貝，巢狀物件共享引用',
      '後面展開的屬性覆蓋前面的同名屬性，可用於設定預設值',
      '展開 null 或 undefined 會靜默忽略，不拋錯',
      'Object.assign(target, src) 會修改 target，Spread 不會',
      'const updated = { ...state, field: newValue } 是 React 更新狀態的標準寫法',
    ],
  },

  // ─── 保護 ─────────────────────────────────────────────────────
  {
    slug: 'obj-freeze',
    title: 'Object.freeze()',
    description: '完全凍結物件，禁止新增、刪除、修改屬性',
    subCategory: '保護',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: '語法與行為',
          content: `\`Object.freeze(obj)\`

回傳：被凍結的物件本身（同一個引用）。

凍結後禁止：
- **新增**屬性
- **刪除**屬性
- **修改**屬性值
- 修改屬性描述符（writable、configurable）`,
        },
        {
          heading: 'Strict mode vs Non-strict mode',
          content: `\`\`\`js
const obj = Object.freeze({ x: 1 })

// Non-strict mode：靜默失敗，不拋錯
obj.x = 99
console.log(obj.x)  // 1（修改無效）

// Strict mode：拋出 TypeError
'use strict'
const obj2 = Object.freeze({ x: 1 })
obj2.x = 99  // TypeError: Cannot assign to read only property
\`\`\``,
        },
        {
          heading: '淺凍結陷阱',
          content: `\`\`\`js
const obj = Object.freeze({ nested: { y: 2 } })

// 修改 nested 物件的屬性 → 成功！freeze 只凍結第一層
obj.nested.y = 99
console.log(obj.nested.y)  // 99

// 要深凍結需遞迴處理
function deepFreeze(o) {
  Object.keys(o).forEach(k => {
    if (typeof o[k] === 'object' && o[k] !== null) deepFreeze(o[k])
  })
  return Object.freeze(o)
}
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: '以下程式碼在 non-strict mode 下輸出什麼？\n\n```js\nconst obj = Object.freeze({ a: 1 })\nobj.a = 99\nconsole.log(obj.a)\n```',
        options: [
          '99（freeze 無效）',
          '1（靜默失敗，修改無效）',
          '拋出 TypeError',
          'undefined',
        ],
        answer: 1,
        explanation: 'Non-strict mode 下，對凍結物件的修改操作會靜默失敗，不拋出錯誤，屬性值維持原本的 1。',
      },
      {
        id: 2,
        question: '在 strict mode 下，對凍結物件的屬性賦值會發生什麼？\n\n```js\n\'use strict\'\nconst obj = Object.freeze({ x: 10 })\nobj.x = 20\n```',
        options: [
          '靜默失敗，obj.x 仍為 10',
          '拋出 TypeError',
          '拋出 RangeError',
          'obj.x 變為 20',
        ],
        answer: 1,
        explanation: 'Strict mode 下，對凍結物件的屬性賦值、新增或刪除操作都會拋出 TypeError，而非靜默失敗。',
      },
      {
        id: 3,
        question: '以下程式碼輸出什麼？\n\n```js\nconst obj = Object.freeze({ nested: { count: 0 } })\nobj.nested.count = 99\nconsole.log(obj.nested.count)\n```',
        options: [
          '0（freeze 凍結所有層級）',
          '99（freeze 只凍結第一層，巢狀物件未凍結）',
          '拋出 TypeError',
          'undefined',
        ],
        answer: 1,
        explanation: 'Object.freeze() 只凍結物件的第一層（淺凍結），巢狀物件 nested 沒有被凍結，所以 nested.count 可以被修改，結果為 99。',
      },
      {
        id: 4,
        question: 'Object.freeze() 回傳的是？',
        options: [
          '一個新的凍結物件',
          '原物件本身（已凍結）',
          'true 或 false，表示是否成功凍結',
          'undefined',
        ],
        answer: 1,
        explanation: 'Object.freeze() 凍結傳入的物件並回傳**同一個物件**的引用，不是建立新物件。',
      },
      {
        id: 5,
        question: '如何判斷一個物件是否已被凍結？',
        options: [
          'obj.frozen === true',
          'Object.isFrozen(obj)',
          'typeof obj === \'frozen\'',
          'obj instanceof Frozen',
        ],
        answer: 1,
        explanation: 'Object.isFrozen(obj) 是判斷物件是否被凍結的正確方法，回傳 boolean 值。',
      },
      {
        id: 6,
        question: '以下哪個操作對凍結物件是允許的？',
        options: [
          'obj.newProp = \'value\'（新增屬性）',
          'delete obj.existingProp（刪除屬性）',
          'const copy = { ...obj }（展開複製）',
          'obj.existingProp = \'new\'（修改值）',
        ],
        answer: 2,
        explanation: '凍結只影響物件本身的可變性，不影響讀取操作。展開運算子讀取物件屬性並建立新物件是允許的，且建立的 copy 本身是未凍結的物件。',
      },
    ],
    keyPoints: [
      'Object.freeze() 凍結後不能新增、刪除、修改屬性',
      'Non-strict mode 下修改凍結物件會靜默失敗，不拋錯',
      'Strict mode 下修改凍結物件會拋出 TypeError',
      'freeze 只凍結第一層（淺凍結），巢狀物件仍可修改',
      '深凍結需要遞迴處理所有巢狀物件',
      'Object.isFrozen() 可用來檢查物件是否已被凍結',
    ],
  },

  {
    slug: 'obj-seal',
    title: 'Object.seal()',
    description: '封印物件，允許修改既有屬性但不可新增或刪除',
    subCategory: '保護',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: '語法與行為',
          content: `\`Object.seal(obj)\`

回傳：被封印的物件本身。

封印後：
- ❌ 不能**新增**屬性
- ❌ 不能**刪除**屬性
- ✅ 可以**修改**既有屬性的值（前提是該屬性 writable: true）`,
        },
        {
          heading: 'seal vs freeze 對比',
          content: `| 操作 | \`Object.seal()\` | \`Object.freeze()\` |
|---|---|---|
| 新增屬性 | ❌ 禁止 | ❌ 禁止 |
| 刪除屬性 | ❌ 禁止 | ❌ 禁止 |
| 修改屬性值 | ✅ 允許 | ❌ 禁止 |

\`\`\`js
const obj = Object.seal({ x: 1 })
obj.x = 99   // ✅ 成功
obj.y = 2    // ❌ 無效（non-strict: 靜默失敗）
delete obj.x // ❌ 無效（non-strict: 靜默失敗）
console.log(obj)  // { x: 99 }
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- 與 freeze 相同，non-strict mode 靜默失敗，strict mode 拋 TypeError
- Object.isSealed() 可以檢查是否封印
- 一個 frozen 物件也是 sealed（freeze 是更嚴格的 seal）
- seal 只影響第一層，巢狀物件不受影響`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: '以下程式碼在 non-strict mode 下輸出什麼？\n\n```js\nconst obj = Object.seal({ a: 1, b: 2 })\nobj.a = 99\nobj.c = 3\nconsole.log(obj)\n```',
        options: [
          '{ a: 99, b: 2, c: 3 }',
          '{ a: 99, b: 2 }（新增屬性靜默失敗）',
          '{ a: 1, b: 2 }（所有修改都失敗）',
          '拋出 TypeError',
        ],
        answer: 1,
        explanation: 'Object.seal() 允許修改現有屬性值（a: 99 成功），但禁止新增屬性（obj.c = 3 靜默失敗）。結果為 { a: 99, b: 2 }。',
      },
      {
        id: 2,
        question: 'Object.seal() 和 Object.freeze() 的主要差異是？',
        options: [
          'seal 禁止修改屬性值，freeze 允許',
          'seal 允許修改屬性值，freeze 禁止',
          'seal 允許新增屬性，freeze 禁止',
          '兩者完全相同',
        ],
        answer: 1,
        explanation: 'Object.seal() 封印物件後允許修改**既有**屬性的值，但不能新增或刪除屬性。Object.freeze() 則連修改屬性值都禁止。',
      },
      {
        id: 3,
        question: '以下程式碼，delete obj.x 的結果是？\n\n```js\nconst obj = Object.seal({ x: 10 })\ndelete obj.x\nconsole.log(obj.x)\n```',
        options: [
          'undefined（刪除成功）',
          '10（刪除被靜默忽略，non-strict mode）',
          '拋出 TypeError',
          '0',
        ],
        answer: 1,
        explanation: 'Object.seal() 禁止刪除屬性，在 non-strict mode 下 delete 操作靜默失敗，obj.x 仍為 10。',
      },
      {
        id: 4,
        question: '一個 Object.freeze() 的物件，Object.isSealed() 回傳什麼？',
        options: [
          'false（sealed 和 frozen 是不同狀態）',
          'true（frozen 物件也是 sealed）',
          '拋出 TypeError',
          'undefined',
        ],
        answer: 1,
        explanation: 'Frozen 物件是比 sealed 更嚴格的狀態，一個 frozen 物件同時也是 sealed。Object.isSealed(frozenObj) 回傳 true。',
      },
      {
        id: 5,
        question: '以下程式碼輸出什麼？\n\n```js\nconst obj = Object.seal({ data: { count: 0 } })\nobj.data.count = 99\nconsole.log(obj.data.count)\n```',
        options: [
          '0（seal 凍結所有層級）',
          '99（seal 只封印第一層，巢狀物件不受影響）',
          '拋出 TypeError',
          'undefined',
        ],
        answer: 1,
        explanation: '與 Object.freeze() 一樣，Object.seal() 只封印物件的第一層，巢狀物件 data 沒有被封印，其屬性可以正常修改，結果為 99。',
      },
      {
        id: 6,
        question: '以下哪個選項最能描述 Object.seal() 的使用場景？',
        options: [
          '希望物件結構固定（不增減屬性），但允許更新屬性值',
          '希望物件完全不可變，用作常數',
          '希望物件可以自由新增屬性，但不能刪除',
          '希望複製物件而不修改原物件',
        ],
        answer: 0,
        explanation: 'Object.seal() 的使用場景是：確保物件的結構（屬性名稱集合）不被意外改變，但仍需要更新屬性值。例如配置物件，結構固定但值可能需要更新。',
      },
    ],
    keyPoints: [
      'Object.seal() 允許修改既有屬性值，但禁止新增或刪除屬性',
      '與 freeze 的差異：seal 可修改值，freeze 不行',
      'Non-strict mode 下違規操作靜默失敗，strict mode 拋 TypeError',
      'Frozen 物件也是 sealed（freeze 是更嚴格的版本）',
      'seal 只封印第一層，巢狀物件不受影響',
      'Object.isSealed() 可檢查物件是否已被封印',
    ],
  },

  // ─── 建立與轉換 ──────────────────────────────────────────────
  {
    slug: 'obj-create',
    title: 'Object.create()',
    description: '以指定物件為原型建立新物件',
    subCategory: '建立與轉換',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: '語法與行為',
          content: `\`Object.create(proto[, propertiesObject])\`

建立一個新物件，並將 \`proto\` 設為其原型（\`[[Prototype]]\`）。

\`\`\`js
const animal = { speak() { return 'sound' } }
const dog = Object.create(animal)
dog.name = 'Rex'

console.log(dog.speak())            // 'sound'（繼承自 animal）
console.log(dog.hasOwnProperty('name'))   // true
console.log(dog.hasOwnProperty('speak'))  // false（speak 在原型上）
\`\`\``,
        },
        {
          heading: 'Object.create(null)：無原型物件',
          content: `\`\`\`js
const dict = Object.create(null)
dict.key = 'value'

// 沒有原型鏈，toString、hasOwnProperty 等方法都不存在
console.log(dict.toString)        // undefined
console.log(dict.hasOwnProperty) // undefined

// 用途：純粹的鍵值對映射，避免原型污染
// 判斷屬性要用 Object.prototype.hasOwnProperty.call(dict, 'key')
\`\`\``,
        },
        {
          heading: '與 new、字面量的比較',
          content: `\`\`\`js
// 字面量 {} 等同於 Object.create(Object.prototype)
const obj1 = {}
const obj2 = Object.create(Object.prototype)
// obj1 和 obj2 的原型都是 Object.prototype

// 自訂原型鏈
const base = { greet() { return 'hello' } }
const child = Object.create(base)
// child.__proto__ === base → true
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: '以下程式碼輸出什麼？\n\n```js\nconst proto = { greet() { return \'hello\' } }\nconst obj = Object.create(proto)\nconsole.log(obj.greet())\n```',
        options: [
          '拋出 TypeError：obj 沒有 greet 方法',
          "'hello'（從原型繼承 greet）",
          'undefined',
          "'hello'，但 obj 自身擁有 greet",
        ],
        answer: 1,
        explanation: "Object.create(proto) 建立的新物件以 proto 為原型，greet 在原型鏈上，所以 obj.greet() 能找到並執行，輸出 'hello'。",
      },
      {
        id: 2,
        question: '以下程式碼輸出什麼？\n\n```js\nconst dict = Object.create(null)\ndict.name = \'Alice\'\nconsole.log(dict.hasOwnProperty(\'name\'))\n```',
        options: [
          'true',
          'false',
          '拋出 TypeError：dict.hasOwnProperty is not a function',
          'undefined',
        ],
        answer: 2,
        explanation: 'Object.create(null) 建立的物件沒有任何原型，因此沒有繼承 Object.prototype 上的 hasOwnProperty 方法，呼叫 dict.hasOwnProperty() 會拋出 TypeError。',
      },
      {
        id: 3,
        question: 'Object.create(null) 建立的物件有什麼特點？',
        options: [
          '和普通物件完全相同',
          '沒有原型鏈，toString、hasOwnProperty 等方法都不存在',
          '是不可變的（frozen）',
          '繼承自 null.prototype',
        ],
        answer: 1,
        explanation: 'Object.create(null) 建立的物件原型為 null（即沒有原型鏈），因此不繼承 Object.prototype 上的任何方法（toString、hasOwnProperty、valueOf 等）。這使它成為純粹的字典/映射，不會受原型污染影響。',
      },
      {
        id: 4,
        question: '以下程式碼，child.hasOwnProperty(\'x\') 的輸出是？\n\n```js\nconst parent = { x: 1 }\nconst child = Object.create(parent)\nconsole.log(child.hasOwnProperty(\'x\'))\n```',
        options: [
          'true（child 可以存取 x，所以 x 是自身屬性）',
          'false（x 在原型 parent 上，不是 child 自身屬性）',
          'undefined',
          '拋出 TypeError',
        ],
        answer: 1,
        explanation: 'child 是透過原型鏈繼承 x，x 本身在 parent 上，不是 child 的自身屬性，所以 child.hasOwnProperty(\'x\') 回傳 false。',
      },
      {
        id: 5,
        question: '以下哪個陳述正確？',
        options: [
          'const obj = {} 等同於 Object.create(null)',
          'const obj = {} 等同於 Object.create(Object.prototype)',
          'Object.create() 必須傳入一個物件，不能傳 null',
          'Object.create() 建立的物件不能新增屬性',
        ],
        answer: 1,
        explanation: '物件字面量 {} 建立的物件，其原型是 Object.prototype，這等同於 Object.create(Object.prototype)。Object.create(null) 則建立無原型物件，兩者不同。',
      },
      {
        id: 6,
        question: 'Object.create(null) 最適合的使用場景是？',
        options: [
          '建立不可變的常數物件',
          '建立純粹的鍵值對映射，避免原型屬性名稱衝突（如 toString、constructor）',
          '建立有繼承關係的物件',
          '建立可凍結的物件',
        ],
        answer: 1,
        explanation: "Object.create(null) 建立沒有原型的物件，適合用作純粹的鍵值對映射（字典）。如果 key 可能是 'toString'、'constructor' 等字串，普通物件會與原型方法衝突，而 Object.create(null) 不會。",
      },
    ],
    keyPoints: [
      'Object.create(proto) 建立新物件，並以 proto 作為其原型',
      'Object.create(null) 建立無原型物件，沒有 toString、hasOwnProperty 等繼承方法',
      '物件字面量 {} 等同於 Object.create(Object.prototype)',
      '繼承的屬性不是物件自身屬性，hasOwnProperty 回傳 false',
      'Object.create(null) 適合用作純字典，避免原型屬性名稱衝突',
      '需要對 create(null) 物件使用 hasOwnProperty，需用 Object.prototype.hasOwnProperty.call(obj, key)',
    ],
  },

  {
    slug: 'obj-fromentries',
    title: 'Object.fromEntries()',
    description: '將 [key, value] 陣列轉為物件',
    subCategory: '建立與轉換',
    difficulty: 'easy',
    notes: {
      sections: [
        {
          heading: '語法與行為',
          content: `\`Object.fromEntries(iterable)\`

接受一個可迭代物件（通常是 \`[key, value]\` 陣列的陣列），轉換成普通物件。

是 \`Object.entries()\` 的**逆操作**。`,
        },
        {
          heading: '常見用法',
          content: `\`\`\`js
// 1. 陣列轉物件
const entries = [['a', 1], ['b', 2]]
Object.fromEntries(entries)  // { a: 1, b: 2 }

// 2. Map 轉物件
const map = new Map([['x', 10], ['y', 20]])
Object.fromEntries(map)  // { x: 10, y: 20 }

// 3. 物件映射（filter / map）
const prices = { apple: 20, banana: 5, cherry: 15 }
const discounted = Object.fromEntries(
  Object.entries(prices).map(([k, v]) => [k, v * 0.9])
)
// { apple: 18, banana: 4.5, cherry: 13.5 }
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- ES2019 新增，較新
- key 必須是字串或 Symbol
- 重複 key 時，後面的值覆蓋前面
- 搭配 \`Object.entries()\` + \`map()\` / \`filter()\` 實現物件轉換，是最慣用的模式`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: '以下程式碼輸出什麼？\n\n```js\nconst entries = [[\'name\', \'Alice\'], [\'age\', 30]]\nconsole.log(Object.fromEntries(entries))\n```',
        options: [
          "[['name', 'Alice'], ['age', 30]]",
          "{ name: 'Alice', age: 30 }",
          "{ 0: ['name', 'Alice'], 1: ['age', 30] }",
          '拋出 TypeError',
        ],
        answer: 1,
        explanation: "Object.fromEntries() 將 [key, value] 二維陣列轉換為物件，結果為 { name: 'Alice', age: 30 }。",
      },
      {
        id: 2,
        question: 'Object.fromEntries() 和 Object.entries() 的關係是？',
        options: [
          '兩者功能相同',
          'Object.fromEntries() 是 Object.entries() 的逆操作',
          'Object.fromEntries() 只能處理 Map',
          'Object.entries() 是 Object.fromEntries() 的逆操作，但不完全對稱',
        ],
        answer: 1,
        explanation: 'Object.fromEntries() 是 Object.entries() 的逆操作。Object.entries(obj) 將物件轉為 [[key, value]] 陣列；Object.fromEntries([[key, value]]) 將陣列轉回物件。',
      },
      {
        id: 3,
        question: '以下程式碼，result 的內容是什麼？\n\n```js\nconst map = new Map([[\'a\', 1], [\'b\', 2]])\nconst result = Object.fromEntries(map)\n```',
        options: [
          'Map { a: 1, b: 2 }',
          '{ a: 1, b: 2 }',
          "[['a', 1], ['b', 2]]",
          '拋出 TypeError：Map 不能傳入 fromEntries',
        ],
        answer: 1,
        explanation: 'Object.fromEntries() 接受任何可迭代物件，Map 迭代時產生 [key, value] 對，所以可以直接用 Object.fromEntries(map) 轉換成普通物件 { a: 1, b: 2 }。',
      },
      {
        id: 4,
        question: '以下程式碼，discounted 的 apple 值是？\n\n```js\nconst prices = { apple: 100, banana: 50 }\nconst discounted = Object.fromEntries(\n  Object.entries(prices).map(([k, v]) => [k, v * 0.8])\n)\n```',
        options: [
          '100',
          '80',
          '0.8',
          '拋出 TypeError',
        ],
        answer: 1,
        explanation: 'Object.entries(prices) 取出 [key, value] 對，.map() 將每個值乘以 0.8，Object.fromEntries() 組合回物件。apple 的值 100 * 0.8 = 80。',
      },
      {
        id: 5,
        question: '以下程式碼輸出什麼？\n\n```js\nconst arr = [[\'a\', 1], [\'a\', 2], [\'b\', 3]]\nconsole.log(Object.fromEntries(arr))\n```',
        options: [
          '{ a: 1, b: 3 }（第一個 a 優先）',
          '{ a: 2, b: 3 }（後面的 a 覆蓋前面）',
          '{ a: [1, 2], b: 3 }（重複 key 合併為陣列）',
          '拋出 TypeError（重複 key）',
        ],
        answer: 1,
        explanation: '當輸入有重複 key 時，後面的值會覆蓋前面的值，結果為 { a: 2, b: 3 }。',
      },
      {
        id: 6,
        question: '以下哪個操作是使用 Object.entries() + Object.fromEntries() 的經典模式？',
        options: [
          '深拷貝物件',
          '過濾或映射物件的屬性，建立新物件',
          '凍結物件',
          '比較兩個物件是否相等',
        ],
        answer: 1,
        explanation: 'Object.entries() + filter/map + Object.fromEntries() 是對物件進行類似陣列操作（過濾、映射）的標準模式，可以建立符合條件的新物件，不修改原物件。',
      },
    ],
    keyPoints: [
      'Object.fromEntries() 是 Object.entries() 的逆操作，將 [[key, value]] 陣列轉為物件',
      '接受任何可迭代物件，包含 Map',
      '重複 key 時，後面的值覆蓋前面',
      '搭配 Object.entries() + map/filter 可對物件做映射或過濾操作',
      'ES2019 新增，較現代的瀏覽器才支援',
    ],
  },

  // ─── 查詢與比較 ─────────────────────────────────────────────
  {
    slug: 'obj-query',
    title: 'hasOwnProperty / in / Object.is',
    description: '屬性查詢方法比較，以及 Object.is() 的特殊行為',
    subCategory: '查詢與比較',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: 'hasOwnProperty vs in 運算子',
          content: `\`\`\`js
const parent = { x: 1 }
const child = Object.create(parent)
child.y = 2

// in 運算子：查詢自身 + 原型鏈
console.log('x' in child)  // true（x 在原型上）
console.log('y' in child)  // true（y 是自身屬性）

// hasOwnProperty：只查自身屬性
console.log(child.hasOwnProperty('x'))  // false（x 在原型上）
console.log(child.hasOwnProperty('y'))  // true
\`\`\`

使用 Object.create(null) 的物件沒有 hasOwnProperty，需改用：
\`Object.prototype.hasOwnProperty.call(obj, key)\``,
        },
        {
          heading: 'Object.hasOwn()（ES2022）',
          content: `\`\`\`js
// ES2022 引入，比 hasOwnProperty 更安全
Object.hasOwn(obj, 'key')

// 等同於
Object.prototype.hasOwnProperty.call(obj, 'key')

// 優點：對 Object.create(null) 的物件也能正確運作
const dict = Object.create(null)
dict.a = 1
Object.hasOwn(dict, 'a')  // true ✓
\`\`\``,
        },
        {
          heading: 'Object.is() 的特殊行為',
          content: `\`Object.is(val1, val2)\` 嚴格相等比較，但修正了 \`===\` 的兩個特殊案例：

\`\`\`js
// NaN 的比較
NaN === NaN          // false（=== 的反直覺行為）
Object.is(NaN, NaN)  // true ✓

// 正零與負零
0 === -0             // true（=== 不區分）
Object.is(0, -0)     // false ✓

// 其他情況與 === 相同
Object.is(1, 1)      // true
Object.is('a', 'a')  // true
Object.is({}, {})    // false（不同引用）
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: '以下程式碼輸出什麼？\n\n```js\nconst parent = { x: 1 }\nconst child = Object.create(parent)\nchild.y = 2\nconsole.log(\'x\' in child)\nconsole.log(child.hasOwnProperty(\'x\'))\n```',
        options: [
          'true, true',
          'false, false',
          'true, false',
          'false, true',
        ],
        answer: 2,
        explanation: "'x' in child 會查詢原型鏈，x 在 parent（原型）上，所以回傳 true。child.hasOwnProperty('x') 只查自身屬性，x 不在 child 自身，回傳 false。",
      },
      {
        id: 2,
        question: 'Object.is(NaN, NaN) 的結果是？',
        options: [
          'false（NaN 不等於任何值，包含自己）',
          'true（Object.is 修正了 NaN 的比較）',
          '拋出 TypeError',
          'undefined',
        ],
        answer: 1,
        explanation: '=== 運算子中 NaN !== NaN，這是 IEEE 754 浮點數標準的特殊行為。Object.is() 修正了這個問題，Object.is(NaN, NaN) 回傳 true，符合直覺。',
      },
      {
        id: 3,
        question: 'Object.is(0, -0) 的結果是？',
        options: [
          'true（0 和 -0 在數值上相等）',
          'false（Object.is 區分正零和負零）',
          '拋出 RangeError',
          '和 0 === -0 結果相同',
        ],
        answer: 1,
        explanation: '=== 認為 0 === -0 為 true，但 Object.is(0, -0) 回傳 false，Object.is 能夠區分正零和負零，這是它與 === 的第二個差異。',
      },
      {
        id: 4,
        question: '以下程式碼輸出什麼？\n\n```js\nconst dict = Object.create(null)\ndict.key = \'value\'\nconsole.log(dict.hasOwnProperty(\'key\'))\n```',
        options: [
          'true',
          'false',
          '拋出 TypeError：dict.hasOwnProperty is not a function',
          'undefined',
        ],
        answer: 2,
        explanation: 'Object.create(null) 建立的物件沒有原型，因此沒有繼承 hasOwnProperty 方法，呼叫時會拋出 TypeError。應改用 Object.prototype.hasOwnProperty.call(dict, \'key\') 或 ES2022 的 Object.hasOwn(dict, \'key\')。',
      },
      {
        id: 5,
        question: '以下哪個選項能正確判斷 key 是否為物件自身屬性，且對 Object.create(null) 的物件也適用？',
        options: [
          "key in obj",
          "obj.hasOwnProperty(key)",
          "Object.hasOwn(obj, key)",
          "Object.keys(obj).includes(key)",
        ],
        answer: 2,
        explanation: 'Object.hasOwn(obj, key) 是 ES2022 引入的靜態方法，等同於 Object.prototype.hasOwnProperty.call(obj, key)，對 Object.create(null) 的物件也能正確運作，是最安全的選項。Object.keys().includes() 雖然也可以，但效能較差（O(n)）。',
      },
      {
        id: 6,
        question: 'in 運算子和 hasOwnProperty 的關鍵差異是？',
        options: [
          'in 只查自身屬性，hasOwnProperty 查原型鏈',
          'in 查自身 + 原型鏈；hasOwnProperty 只查自身屬性',
          '兩者完全相同',
          'in 只適用於陣列，hasOwnProperty 適用於物件',
        ],
        answer: 1,
        explanation: 'in 運算子會遍歷整個原型鏈來查詢屬性；hasOwnProperty 只查物件自身的屬性，不查原型鏈。這是判斷屬性來源時最重要的差異。',
      },
    ],
    keyPoints: [
      'in 運算子查詢自身屬性 + 整個原型鏈',
      'hasOwnProperty 只查物件自身屬性，不查原型鏈',
      'Object.create(null) 的物件沒有 hasOwnProperty，需用 Object.prototype.hasOwnProperty.call()',
      'ES2022 的 Object.hasOwn() 是 hasOwnProperty 的安全替代，對無原型物件也適用',
      'Object.is(NaN, NaN) 回傳 true，修正了 === 的 NaN 比較問題',
      'Object.is(0, -0) 回傳 false，能區分正零與負零',
    ],
  },
]
