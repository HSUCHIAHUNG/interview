export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  answer: number
  explanation: string
}

export interface StringMethodEntry {
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

export const THEME = '字串方法'

export const STRING_SUB_CATEGORIES = [
  { name: '搜尋與判斷', order: 1 },
  { name: '擷取與切割', order: 2 },
  { name: '轉換與格式化', order: 3 },
  { name: '字元存取', order: 4 },
  { name: '金額格式化', order: 5 },
]

export const stringMethodTopics: StringMethodEntry[] = [
  // ─── 搜尋與判斷 ───────────────────────────────────────────────────

  {
    slug: 'str-indexof',
    title: 'indexOf() / lastIndexOf()',
    description: '搜尋子字串位置，找不到回傳 -1',
    subCategory: '搜尋與判斷',
    difficulty: 'easy',
    notes: {
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`str.indexOf(searchValue[, fromIndex])\`
\`str.lastIndexOf(searchValue[, fromIndex])\`

- 回傳：**第一個（或最後一個）**符合子字串的起始索引；找不到回傳 **-1**。
- \`fromIndex\`：開始搜尋的位置（預設 indexOf 為 0，lastIndexOf 為 str.length - 1）。
- 區分大小寫。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const s = 'hello world hello'

s.indexOf('hello')        // 0
s.indexOf('hello', 1)     // 12
s.lastIndexOf('hello')    // 12
s.indexOf('xyz')          // -1

// 常見用法：判斷是否存在
if (s.indexOf('world') !== -1) {
  console.log('找到了')
}
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- indexOf / lastIndexOf 都是**區分大小寫**的。
- 傳入 \`fromIndex\` 超出範圍時：
  - indexOf：fromIndex >= str.length → 直接回傳 -1
  - lastIndexOf：fromIndex < 0 → 視為 0
- 現代寫法通常改用 \`includes()\`，但 indexOf 的優點是能同時拿到**位置**。`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: `以下程式碼輸出為何？\n\nconst s = 'banana'\nconsole.log(s.indexOf('a'))`,
        options: ['0', '1', '3', '-1'],
        answer: 1,
        explanation: `'banana' 中第一個 'a' 出現在索引 1（b=0, a=1）。indexOf 從左到右找第一個符合的位置。`,
      },
      {
        id: 2,
        question: `以下程式碼輸出為何？\n\nconst s = 'banana'\nconsole.log(s.lastIndexOf('a'))`,
        options: ['1', '3', '5', '-1'],
        answer: 2,
        explanation: `'banana' 共有三個 'a'，位置分別是 1、3、5。lastIndexOf 從右往左找，所以回傳最後一個 'a' 的索引 5。`,
      },
      {
        id: 3,
        question: `以下程式碼輸出為何？\n\nconst s = 'Hello World'\nconsole.log(s.indexOf('hello'))`,
        options: ['0', '6', '-1', '5'],
        answer: 2,
        explanation: `indexOf 區分大小寫，'hello'（小寫 h）和 'Hello'（大寫 H）不同，所以找不到，回傳 -1。`,
      },
      {
        id: 4,
        question: `以下程式碼輸出為何？\n\nconst s = 'abcabc'\nconsole.log(s.indexOf('bc', 3))`,
        options: ['1', '3', '4', '-1'],
        answer: 2,
        explanation: `fromIndex 為 3，從索引 3 開始搜尋。s[3]='a', s[4]='b', s[5]='c'，'bc' 出現在索引 4，所以回傳 4。`,
      },
      {
        id: 5,
        question: `要判斷字串 str 是否包含子字串 'cat'，下列哪個寫法**不正確**？`,
        options: [
          `str.indexOf('cat') !== -1`,
          `str.includes('cat')`,
          `str.indexOf('cat') >= 0`,
          `str.indexOf('cat') === true`,
        ],
        answer: 3,
        explanation: `indexOf 回傳的是數字（索引或 -1），不會回傳布林值，所以 === true 永遠為 false。正確判斷方式是 !== -1 或 >= 0，或直接用 includes()。`,
      },
      {
        id: 6,
        question: `以下程式碼輸出為何？\n\nconst s = 'abc'\nconsole.log(s.indexOf('a', 10))`,
        options: ['0', '-1', '10', 'undefined'],
        answer: 1,
        explanation: `當 fromIndex >= str.length 時，indexOf 直接回傳 -1，不會繞回去搜尋。`,
      },
    ],
    keyPoints: [
      'indexOf 從左往右找第一個符合的子字串，回傳起始索引，找不到回傳 -1。',
      'lastIndexOf 從右往左找最後一個符合的子字串，同樣找不到回傳 -1。',
      '兩者都區分大小寫，大小寫不同會視為不同字串。',
      '第二個參數 fromIndex 可以指定搜尋的起始位置。',
      '現代程式碼若只需判斷「是否存在」，建議改用 includes()，語義更清晰。',
      '如果同時需要知道「出現在哪個位置」，那還是要用 indexOf。',
    ],
  },

  {
    slug: 'str-includes',
    title: 'includes()',
    description: '判斷字串是否包含指定子字串，回傳 boolean',
    subCategory: '搜尋與判斷',
    difficulty: 'easy',
    notes: {
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`str.includes(searchString[, position])\`

- 回傳：**boolean**（true / false）。
- \`position\`：從哪個索引開始搜尋，預設為 0。
- 區分大小寫。
- ES2015（ES6）引入。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const s = 'Hello, World!'

s.includes('World')    // true
s.includes('world')    // false（區分大小寫）
s.includes('Hello')    // true
s.includes('Hello', 1) // false（從索引 1 開始，跳過 H）

// 陣列的 includes 也類似，但這裡是字串版本
const arr = ['a', 'b', 'c']
arr.includes('b')      // true（陣列方法，概念相同）
\`\`\``,
        },
        {
          heading: '與 indexOf 的比較',
          content: `| | includes() | indexOf() |
|---|---|---|
| 回傳值 | boolean | number（索引） |
| 語意 | 是否存在 | 在哪個位置 |
| 可讀性 | 較高 | 較低 |
| 支援 NaN | 否 | 否 |

- 只需判斷「有沒有」→ 用 \`includes()\`
- 需要知道「在哪裡」→ 用 \`indexOf()\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: `以下程式碼輸出為何？\n\nconst s = 'TypeScript'\nconsole.log(s.includes('Script'))`,
        options: ['true', 'false', '6', '-1'],
        answer: 0,
        explanation: `'TypeScript' 包含 'Script'（注意大小寫），所以 includes 回傳 true。`,
      },
      {
        id: 2,
        question: `以下程式碼輸出為何？\n\nconst s = 'TypeScript'\nconsole.log(s.includes('script'))`,
        options: ['true', 'false', '6', 'undefined'],
        answer: 1,
        explanation: `includes 區分大小寫，'script'（小寫 s）和 'Script'（大寫 S）不同，所以回傳 false。`,
      },
      {
        id: 3,
        question: `以下程式碼輸出為何？\n\nconst s = 'abcdef'\nconsole.log(s.includes('cd', 3))`,
        options: ['true', 'false', '2', '-1'],
        answer: 1,
        explanation: `第二個參數 3 表示從索引 3 開始搜尋，s[3]='d', s[4]='e', s[5]='f'。從這個位置往後已看不到完整的 'cd'，所以回傳 false。`,
      },
      {
        id: 4,
        question: `includes() 是在哪個 ES 版本引入的？`,
        options: ['ES5', 'ES2015（ES6）', 'ES2017', 'ES2020'],
        answer: 1,
        explanation: `String.prototype.includes() 是在 ES2015（ES6）正式引入的，用來取代繁瑣的 indexOf() !== -1 寫法。`,
      },
      {
        id: 5,
        question: `下列哪個選項能正確判斷字串 email 結尾是否有 '@gmail.com'？`,
        options: [
          `email.includes('@gmail.com')`,
          `email.endsWith('@gmail.com')`,
          `email.indexOf('@gmail.com') === 0`,
          `email.startsWith('@gmail.com')`,
        ],
        answer: 1,
        explanation: `判斷結尾應用 endsWith()。includes() 只判斷是否「包含」，無法確保是「結尾」。indexOf === 0 是判斷開頭。`,
      },
    ],
    keyPoints: [
      'includes() 回傳 boolean，語義比 indexOf() !== -1 更清晰。',
      '第二個參數 position 可指定從哪個索引開始搜尋。',
      '同樣區分大小寫，這是初學者常犯的錯誤。',
      '只需判斷「有沒有」時優先用 includes()，需要「位置」才用 indexOf()。',
      'ES2015（ES6）引入，不支援 IE 舊版瀏覽器（若需要需 polyfill）。',
    ],
  },

  {
    slug: 'str-startswith-endswith',
    title: 'startsWith() / endsWith()',
    description: '判斷字串的開頭或結尾是否符合指定字串',
    subCategory: '搜尋與判斷',
    difficulty: 'easy',
    notes: {
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`str.startsWith(searchString[, position])\`
\`str.endsWith(searchString[, length])\`

- 兩者都回傳 **boolean**。
- startsWith 的 \`position\`：從哪個索引開始比對，預設 0。
- endsWith 的 \`length\`：把字串視為只有前 length 個字元，預設 str.length。
- 區分大小寫。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const url = 'https://example.com'

url.startsWith('https')       // true
url.startsWith('http', 0)     // true（'https' 開頭是 'http'）
url.startsWith('https', 1)    // false（從索引 1 開始是 'ttps'）

url.endsWith('.com')          // true
url.endsWith('.com', 18)      // true（取前 18 字元再判斷結尾）
url.endsWith('example', 15)   // true（前 15 字元是 'https://example'）

// 常見用法：判斷檔案類型
const filename = 'photo.jpg'
filename.endsWith('.jpg') || filename.endsWith('.png')  // true
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- 兩者皆為 ES2015（ES6）引入。
- startsWith 的 position 是「從哪裡開始比對」；endsWith 的 length 是「把字串截短到幾個字元再比對結尾」，兩個第二參數**語義不同**，容易搞混。
- 若需要不分大小寫判斷：先 toLowerCase() 再比對。`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: `以下程式碼輸出為何？\n\nconst s = 'Hello World'\nconsole.log(s.startsWith('Hello'))`,
        options: ['true', 'false', '0', 'undefined'],
        answer: 0,
        explanation: `'Hello World' 的開頭是 'Hello'，startsWith 回傳 true。`,
      },
      {
        id: 2,
        question: `以下程式碼輸出為何？\n\nconst s = 'Hello World'\nconsole.log(s.endsWith('world'))`,
        options: ['true', 'false', '-1', 'undefined'],
        answer: 1,
        explanation: `endsWith 區分大小寫，'World'（大寫 W）和 'world'（小寫 w）不同，所以回傳 false。`,
      },
      {
        id: 3,
        question: `以下程式碼輸出為何？\n\nconst s = 'Hello World'\nconsole.log(s.startsWith('World', 6))`,
        options: ['true', 'false', '6', '-1'],
        answer: 0,
        explanation: `startsWith 的第二個參數 6 表示從索引 6 開始比對，s.slice(6) 是 'World'，開頭是 'World'，所以回傳 true。`,
      },
      {
        id: 4,
        question: `以下程式碼輸出為何？\n\nconst s = 'Hello World'\nconsole.log(s.endsWith('Hello', 5))`,
        options: ['true', 'false', '5', 'undefined'],
        answer: 0,
        explanation: `endsWith 的第二個參數 5 表示只看前 5 個字元，即 'Hello'，它的結尾是 'Hello'，所以回傳 true。`,
      },
      {
        id: 5,
        question: `下列哪個選項能正確判斷 url 是否以 'https' 開頭且以 '.com' 結尾？`,
        options: [
          `url.startsWith('https') && url.endsWith('.com')`,
          `url.includes('https') && url.includes('.com')`,
          `url.startsWith('https') || url.endsWith('.com')`,
          `url.indexOf('https') && url.indexOf('.com')`,
        ],
        answer: 0,
        explanation: `要同時符合開頭和結尾兩個條件，需用 && 連接 startsWith 和 endsWith。includes 無法限定位置，|| 只需其一為真，indexOf 回傳數字（0 為 falsy）。`,
      },
      {
        id: 6,
        question: `startsWith() 和 endsWith() 的第二個參數語義有何不同？`,
        options: [
          '兩者都表示「從哪個索引開始比對」',
          'startsWith 是起始索引，endsWith 是把字串視為只有前 N 個字元',
          '兩者都表示「結束比對的索引」',
          'startsWith 是字串長度，endsWith 是起始索引',
        ],
        answer: 1,
        explanation: `startsWith 的第二參數是「從哪個 position 開始比對」；endsWith 的第二參數是「length，把字串視為只有前 N 個字元後再比對結尾」，兩個語義完全不同，是常見的混淆點。`,
      },
    ],
    keyPoints: [
      'startsWith 判斷開頭，endsWith 判斷結尾，兩者都回傳 boolean。',
      '兩者都區分大小寫，必要時先 toLowerCase() 再比對。',
      'startsWith 第二參數是「起始索引」，endsWith 第二參數是「視字串只有前 N 個字元」，語義不同。',
      '常見用途：判斷 URL 協議（startsWith）、判斷副檔名（endsWith）。',
      '兩者都是 ES2015（ES6）引入，現代瀏覽器全部支援。',
    ],
  },

  // ─── 擷取與切割 ───────────────────────────────────────────────────

  {
    slug: 'str-slice',
    title: 'slice()',
    description: '擷取字串指定範圍，支援負數 index',
    subCategory: '擷取與切割',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`str.slice(beginIndex[, endIndex])\`

- 回傳：**新字串**（不修改原字串）。
- 擷取範圍：\`[beginIndex, endIndex)\`（包含 begin，不包含 end）。
- **支援負數**：負數從字串尾端往前算，-1 代表最後一個字元。
- 若省略 endIndex，擷取到字串結尾。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const s = 'Hello World'
//         0123456789...

s.slice(0, 5)    // 'Hello'
s.slice(6)       // 'World'（省略 end → 到結尾）
s.slice(-5)      // 'World'（負數從尾端算）
s.slice(-5, -1)  // 'Worl'
s.slice(3, 1)    // ''（begin > end 回傳空字串）

// 常見用途：去掉最後一個字元
const str = 'Hello!'
str.slice(0, -1)  // 'Hello'
\`\`\``,
        },
        {
          heading: '與 substring 的差異',
          content: `| | slice() | substring() |
|---|---|---|
| 負數 index | 從尾端計算 | 視為 0 |
| begin > end | 回傳空字串 | 自動交換兩個參數 |
| 推薦程度 | 較常用 | 較少用 |

一般情況下優先使用 \`slice()\`，因為支援負數更靈活。`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: `以下程式碼輸出為何？\n\nconst s = 'JavaScript'\nconsole.log(s.slice(0, 4))`,
        options: [`'Java'`, `'javaS'`, `'JavaS'`, `'java'`],
        answer: 0,
        explanation: `slice(0, 4) 擷取索引 0 到 3（不含 4），即 'J','a','v','a' → 'Java'。`,
      },
      {
        id: 2,
        question: `以下程式碼輸出為何？\n\nconst s = 'JavaScript'\nconsole.log(s.slice(-6))`,
        options: [`'Script'`, `'avaScr'`, `'JavaSc'`, `'script'`],
        answer: 0,
        explanation: `'JavaScript' 有 10 個字元，-6 從尾端算起第 6 個（索引 4），s[4] 開始是 'Script'。`,
      },
      {
        id: 3,
        question: `以下程式碼輸出為何？\n\nconst s = 'Hello'\nconsole.log(s.slice(3, 1))`,
        options: [`'ell'`, `'llo'`, `''`, `'el'`],
        answer: 2,
        explanation: `當 beginIndex > endIndex 時，slice 回傳空字串 ''，不會自動交換（這是和 substring 的主要差異）。`,
      },
      {
        id: 4,
        question: `以下程式碼輸出為何？\n\nconst s = 'Hello World'\nconsole.log(s.slice(-5, -1))`,
        options: [`'Worl'`, `'World'`, `'orld'`, `'rld'`],
        answer: 0,
        explanation: `-5 對應索引 6（'W'），-1 對應索引 10（'d'，不含）。所以取 s[6..9] = 'Worl'。`,
      },
      {
        id: 5,
        question: `如果要取得字串最後 3 個字元，下列哪個寫法最簡潔正確？`,
        options: [
          `str.slice(str.length - 3)`,
          `str.slice(-3)`,
          `str.substring(str.length - 3)`,
          `以上 A 和 B 都正確`,
        ],
        answer: 3,
        explanation: `A（str.length - 3）和 B（-3）都能正確取得最後 3 個字元。slice 支援負數，-3 更簡潔；但兩種寫法結果相同。`,
      },
    ],
    keyPoints: [
      'slice(begin, end) 擷取 [begin, end) 範圍，不含 end，不修改原字串。',
      '支援負數索引，-1 代表最後一個字元，-2 代表倒數第二個，以此類推。',
      '省略第二參數則擷取到字串結尾。',
      '當 begin > end 時，slice 回傳空字串（不像 substring 會自動交換）。',
      '要去掉最後 N 個字元，用 slice(0, -N) 最簡潔。',
      '一般優先用 slice，因為負數支援讓程式碼更靈活。',
    ],
  },

  {
    slug: 'str-substring',
    title: 'substring()',
    description: '擷取字串指定範圍，不支援負數（視為 0）',
    subCategory: '擷取與切割',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`str.substring(indexStart[, indexEnd])\`

- 回傳：**新字串**（不修改原字串）。
- 擷取範圍：\`[indexStart, indexEnd)\`（包含 start，不包含 end）。
- **不支援負數**：負數或 NaN 會被視為 0。
- 若 indexStart > indexEnd，兩個參數會**自動交換**。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const s = 'Hello World'

s.substring(0, 5)   // 'Hello'
s.substring(6)      // 'World'
s.substring(3, 1)   // 'el'（自動交換為 substring(1, 3)）
s.substring(-3)     // 'Hello World'（-3 視為 0，即整個字串）

// 陷阱：負數不如預期
const s2 = 'abcde'
s2.substring(-2)    // 'abcde'（-2 → 0）
s2.slice(-2)        // 'de'（slice 支援負數）
\`\`\``,
        },
        {
          heading: '與 slice 的差異',
          content: `| | substring() | slice() |
|---|---|---|
| 負數 | 視為 0 | 從尾端計算 |
| start > end | 自動交換 | 回傳空字串 |
| 推薦程度 | 較少用 | 較常用 |

- 若不需要負數索引，兩者結果相同。
- 現代開發中 \`slice()\` 更常見，因為行為更直覺。`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: `以下程式碼輸出為何？\n\nconst s = 'Hello World'\nconsole.log(s.substring(0, 5))`,
        options: [`'Hello'`, `'Hello '`, `'World'`, `'Hell'`],
        answer: 0,
        explanation: `substring(0, 5) 取索引 0 到 4（不含 5），即 'Hello'。`,
      },
      {
        id: 2,
        question: `以下程式碼輸出為何？\n\nconst s = 'Hello'\nconsole.log(s.substring(3, 1))`,
        options: [`''`, `'llo'`, `'el'`, `'He'`],
        answer: 2,
        explanation: `substring 當 start > end 時會自動交換，變成 substring(1, 3)，取索引 1 到 2 → 'el'。這是和 slice 的關鍵差異，slice 遇到此情況回傳空字串。`,
      },
      {
        id: 3,
        question: `以下程式碼輸出為何？\n\nconst s = 'abcde'\nconsole.log(s.substring(-2))`,
        options: [`'de'`, `'abcde'`, `''`, `'abc'`],
        answer: 1,
        explanation: `substring 不支援負數，-2 會被視為 0，等同 substring(0)，取整個字串 'abcde'。`,
      },
      {
        id: 4,
        question: `下列哪個敘述正確描述 substring 和 slice 的差異？`,
        options: [
          'substring 支援負數，slice 不支援',
          'slice 當 start > end 時自動交換，substring 回傳空字串',
          'substring 當 start > end 時自動交換，slice 回傳空字串',
          '兩者行為完全相同',
        ],
        answer: 2,
        explanation: `substring 遇到 start > end 會自動交換兩個參數再擷取；slice 遇到此情況直接回傳空字串。且 substring 不支援負數（視為 0），slice 支援負數。`,
      },
      {
        id: 5,
        question: `以下程式碼輸出為何？\n\nconst s = 'JavaScript'\nconsole.log(s.substring(4, 4))`,
        options: [`'S'`, `''`, `'Script'`, `undefined`],
        answer: 1,
        explanation: `start 和 end 相同時，擷取範圍為空，回傳空字串 ''。`,
      },
    ],
    keyPoints: [
      'substring(start, end) 擷取 [start, end) 範圍，不修改原字串。',
      '不支援負數索引，傳入負數會被當成 0 處理，這是常見陷阱。',
      '當 start > end 時自動交換兩個參數，行為與 slice 不同。',
      '現代開發中 slice 比 substring 更常用，因為支援負數更靈活。',
      '若只使用非負整數且 start <= end，兩者行為完全相同。',
    ],
  },

  {
    slug: 'str-split',
    title: 'split()',
    description: '依分隔符切割字串為陣列',
    subCategory: '擷取與切割',
    difficulty: 'easy',
    notes: {
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`str.split([separator[, limit]])\`

- 回傳：**字串陣列**。
- \`separator\`：分隔符，可以是字串或正規表達式。
  - 省略 separator：回傳包含整個字串的陣列 \`[str]\`。
  - 空字串 \`''\`：每個字元拆成一個元素。
- \`limit\`：限制回傳陣列最多幾個元素。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
'a,b,c'.split(',')        // ['a', 'b', 'c']
'hello'.split('')         // ['h', 'e', 'l', 'l', 'o']
'hello'.split()           // ['hello']（沒有分隔符）
'a,b,c'.split(',', 2)     // ['a', 'b']（limit 限制 2 個）

// 用正規表達式分割
'one1two2three'.split(/\d/) // ['one', 'two', 'three']

// 與 join 搭配使用
const words = 'hello world'.split(' ')
words.join('-')           // 'hello-world'

// 反轉字串（經典面試題）
'hello'.split('').reverse().join('') // 'olleh'
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- 分隔符本身不會出現在結果陣列中。
- 連續分隔符會產生空字串元素：\`'a,,b'.split(',') → ['a', '', 'b']\`。
- 字串開頭或結尾有分隔符也會產生空字串：\`',a,'.split(',') → ['', 'a', '']\`。
- 想把字串轉成字元陣列，推薦用展開運算子 \`[...str]\` 以正確處理 Unicode（emoji 等）。`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: `以下程式碼輸出為何？\n\n'a,b,,c'.split(',')`,
        options: [
          `['a', 'b', 'c']`,
          `['a', 'b', '', 'c']`,
          `['a', 'b', 'c', '']`,
          `['a,b,,c']`,
        ],
        answer: 1,
        explanation: `連續兩個逗號 ',,' 之間沒有內容，split 會產生一個空字串 ''，所以結果是 ['a', 'b', '', 'c']。`,
      },
      {
        id: 2,
        question: `以下程式碼輸出為何？\n\n'hello'.split()`,
        options: [
          `['h', 'e', 'l', 'l', 'o']`,
          `['hello']`,
          `[]`,
          `['h', 'e', 'l', 'o']`,
        ],
        answer: 1,
        explanation: `省略 separator 時，split 回傳包含整個字串的陣列 ['hello']，不會切割。`,
      },
      {
        id: 3,
        question: `以下程式碼輸出為何？\n\n'a,b,c,d'.split(',', 2)`,
        options: [
          `['a', 'b', 'c', 'd']`,
          `['a', 'b']`,
          `['a', 'b', 'c']`,
          `['c', 'd']`,
        ],
        answer: 1,
        explanation: `第二個參數 limit 限制結果陣列最多 2 個元素，所以只取前兩個 ['a', 'b']。`,
      },
      {
        id: 4,
        question: `要把字串 'hello' 反轉為 'olleh'，下列哪個方式正確？`,
        options: [
          `'hello'.reverse()`,
          `'hello'.split('').reverse().join('')`,
          `'hello'.split().reverse().join('')`,
          `Array.from('hello').sort().join('')`,
        ],
        answer: 1,
        explanation: `字串沒有 reverse 方法，需先用 split('') 轉成字元陣列，再用陣列的 reverse()，最後用 join('') 合回字串。split() 不帶參數不會拆字元，sort() 是排序不是反轉。`,
      },
      {
        id: 5,
        question: `下列哪個寫法能把字串中的所有空白分割，且正確處理多個連續空白？`,
        options: [
          `str.split(' ')`,
          `str.split(/\s+/)`,
          `str.split('')`,
          `str.split('  ')`,
        ],
        answer: 1,
        explanation: `用正規表達式 /\\s+/ 可以匹配一個或多個連續空白（包含空格、tab、換行），是處理不規則空白的最佳方式。split(' ') 只分割單一空格，多個連續空格會產生空字串元素。`,
      },
    ],
    keyPoints: [
      'split(separator) 依分隔符切割字串，回傳字串陣列。',
      '省略 separator 回傳 [整個字串]，傳入空字串 "" 則每個字元各自成一個元素。',
      '連續分隔符或字串頭尾的分隔符會產生空字串元素，要注意。',
      '第二個參數 limit 可限制結果陣列的最大長度。',
      '反轉字串的經典方式：split("").reverse().join("")。',
      '處理 emoji 等 Unicode 字元時，建議用展開運算子 [...str] 取代 split("")。',
    ],
  },

  // ─── 轉換與格式化 ────────────────────────────────────────────────

  {
    slug: 'str-case',
    title: 'toUpperCase() / toLowerCase()',
    description: '字串大小寫轉換，不修改原字串',
    subCategory: '轉換與格式化',
    difficulty: 'easy',
    notes: {
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`str.toUpperCase()\`
\`str.toLowerCase()\`

- 回傳：**新字串**，所有英文字母轉為大寫或小寫。
- **不修改原字串**（字串是不可變的）。
- 數字、符號、中文等非字母字元不受影響。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
'Hello World'.toUpperCase()  // 'HELLO WORLD'
'Hello World'.toLowerCase()  // 'hello world'

// 不影響非字母字元
'abc123!'.toUpperCase()  // 'ABC123!'

// 不修改原字串
const s = 'Hello'
const upper = s.toUpperCase()
console.log(s)     // 'Hello'（原字串不變）
console.log(upper) // 'HELLO'

// 常見用途：不分大小寫的比較
const input = 'JavaScript'
input.toLowerCase() === 'javascript'  // true
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- 字串是**不可變的（immutable）**，所有字串方法都回傳新字串，不修改原本的變數。
- \`toLocaleUpperCase() / toLocaleLowerCase()\`：考慮語系規則（如土耳其語的 i/İ 特殊轉換），一般情況不需要。
- 做不分大小寫比較時，兩邊都要轉換：\`a.toLowerCase() === b.toLowerCase()\`。`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: `以下程式碼輸出為何？\n\nconst s = 'Hello'\ns.toUpperCase()\nconsole.log(s)`,
        options: [`'HELLO'`, `'hello'`, `'Hello'`, `undefined`],
        answer: 2,
        explanation: `toUpperCase() 回傳新字串，不修改原字串。s 的值依然是 'Hello'。要保留轉換結果需用 const upper = s.toUpperCase()。`,
      },
      {
        id: 2,
        question: `以下程式碼輸出為何？\n\nconsole.log('abc123!'.toUpperCase())`,
        options: [`'ABC123!'`, `'ABC!!!'`, `'abc123!'`, `'ABC'`],
        answer: 0,
        explanation: `toUpperCase 只轉換英文字母，數字和符號不受影響。'abc' → 'ABC'，'123!' 不變，結果是 'ABC123!'。`,
      },
      {
        id: 3,
        question: `要不分大小寫比較兩個字串 a 和 b，下列哪個寫法正確？`,
        options: [
          `a.toLowerCase() === b`,
          `a === b.toLowerCase()`,
          `a.toLowerCase() === b.toLowerCase()`,
          `a.toUpperCase() && b.toLowerCase()`,
        ],
        answer: 2,
        explanation: `必須兩邊都轉成同一種大小寫再比較，只轉一邊的話，另一邊若有大寫字母就會比較失敗。`,
      },
      {
        id: 4,
        question: `以下程式碼輸出為何？\n\nconsole.log('中文ABC'.toLowerCase())`,
        options: [`'中文abc'`, `'中文ABC'`, `'abc'`, `'中文'`],
        answer: 0,
        explanation: `toLowerCase 只影響英文字母，中文字元不受影響，ABC 轉為 abc，結果是 '中文abc'。`,
      },
      {
        id: 5,
        question: `以下程式碼輸出為何？\n\nconst result = 'Hello'.toUpperCase().toLowerCase()\nconsole.log(result)`,
        options: [`'HELLO'`, `'Hello'`, `'hello'`, `undefined`],
        answer: 2,
        explanation: `鏈式呼叫：先 toUpperCase() 得到 'HELLO'，再 toLowerCase() 得到 'hello'。字串方法可以鏈式呼叫因為每次都回傳新字串。`,
      },
    ],
    keyPoints: [
      'toUpperCase 轉大寫，toLowerCase 轉小寫，兩者都回傳新字串。',
      '字串是不可變的，所有字串方法都不修改原字串，必須接收回傳值。',
      '只影響英文字母，數字、符號、中文等字元不受影響。',
      '做不分大小寫的字串比較時，兩邊都要 toLowerCase() 再比較。',
      '如果需要考慮語系（如土耳其語），改用 toLocaleLowerCase()。',
    ],
  },

  {
    slug: 'str-trim',
    title: 'trim() / trimStart() / trimEnd()',
    description: '去除字串首尾空白字元',
    subCategory: '轉換與格式化',
    difficulty: 'easy',
    notes: {
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`str.trim()\`         → 去除**首尾**所有空白
\`str.trimStart()\`    → 去除**開頭**空白（ES2019）
\`str.trimEnd()\`      → 去除**結尾**空白（ES2019）

- 空白包含：空格 \` \`、tab \`\\t\`、換行 \`\\n\`、\`\\r\` 等。
- 回傳**新字串**，不修改原字串。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const s = '  Hello World  '

s.trim()       // 'Hello World'
s.trimStart()  // 'Hello World  '（保留結尾空白）
s.trimEnd()    // '  Hello World'（保留開頭空白）

// 處理換行和 tab
'\\t Hello\\n'.trim()  // 'Hello'

// 常見用途：表單輸入驗證
const input = '  user@email.com  '
const clean = input.trim()
// 'user@email.com'
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- trim 只去除**首尾**，不去除字串中間的空白。
- 若需去除中間空白，用 \`replace(/\\s+/g, ' ')\` 或 \`replace(/\\s/g, '')\`。
- 舊名稱：\`trimLeft()\`（= trimStart）、\`trimRight()\`（= trimEnd），已被列為非標準，建議用新名稱。`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: `以下程式碼輸出為何？\n\nconsole.log('  hello  '.trim())`,
        options: [`'hello'`, `'  hello  '`, `'hello  '`, `'  hello'`],
        answer: 0,
        explanation: `trim() 去除字串首尾的空白，結果是 'hello'。`,
      },
      {
        id: 2,
        question: `以下程式碼輸出為何？\n\nconsole.log('  hello  '.trimStart())`,
        options: [`'hello'`, `'  hello  '`, `'hello  '`, `'  hello'`],
        answer: 2,
        explanation: `trimStart() 只去除開頭的空白，結尾的空白保留，結果是 'hello  '。`,
      },
      {
        id: 3,
        question: `以下程式碼輸出為何？\n\nconsole.log('  hello world  '.trim().length)`,
        options: ['11', '15', '13', '9'],
        answer: 0,
        explanation: `trim() 後得到 'hello world'，長度為 11（含中間一個空格）。trim 只去除首尾空白，中間空格保留。`,
      },
      {
        id: 4,
        question: `trim() 能去除字串中的哪些「空白」字元？`,
        options: [
          '只有空格（space）',
          '空格和 tab',
          '空格、tab、換行（\\n）、回車（\\r）等所有空白字元',
          '只有換行（\\n）',
        ],
        answer: 2,
        explanation: `trim() 去除的是所有 Unicode 定義的空白字元，包含空格、tab（\\t）、換行（\\n）、回車（\\r）等，不只是空格。`,
      },
      {
        id: 5,
        question: `下列哪個方法在 ES2019 之後才引入？`,
        options: [
          'trim()',
          'trimStart() 和 trimEnd()',
          'trimLeft() 和 trimRight()',
          'trimAll()',
        ],
        answer: 1,
        explanation: `trimStart() 和 trimEnd() 是 ES2019 正式引入的標準方法。trim() 早在 ES5 就有了。trimLeft() 和 trimRight() 是非標準的舊別名，trimAll() 不存在。`,
      },
    ],
    keyPoints: [
      'trim() 去除首尾空白，trimStart() 只去開頭，trimEnd() 只去結尾。',
      '去除的空白包含空格、tab、換行等所有空白字元，不只是空格。',
      'trim 不影響字串中間的空白，只處理首尾。',
      '三個方法都回傳新字串，不修改原字串。',
      'trimStart 和 trimEnd 是 ES2019 引入的，舊名 trimLeft / trimRight 不建議使用。',
      '表單輸入驗證前通常要先 trim() 再進行其他處理。',
    ],
  },

  {
    slug: 'str-replace',
    title: 'replace() / replaceAll()',
    description: '替換字串中的子字串，replace 只換第一個',
    subCategory: '轉換與格式化',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`str.replace(pattern, replacement)\`
\`str.replaceAll(pattern, replacement)\`（ES2021）

- 回傳：**新字串**，不修改原字串。
- \`pattern\`：可以是字串或正規表達式。
- \`replacement\`：可以是字串或函式。
- **replace 只替換第一個**符合的子字串；replaceAll 替換所有。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const s = 'hello hello world'

s.replace('hello', 'hi')     // 'hi hello world'（只換第一個）
s.replaceAll('hello', 'hi')  // 'hi hi world'（全部替換）

// 用正規表達式替換所有（ES2021 之前的做法）
s.replace(/hello/g, 'hi')    // 'hi hi world'

// replacement 使用函式
'hello world'.replace(/\w+/g, word => word.toUpperCase())
// 'HELLO WORLD'

// 特殊替換符
'abc'.replace('b', '[$&]')   // 'a[b]c'（$& 代表符合的子字串）
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- replace 傳入字串只換第一個，要換全部需傳正規表達式加 \`g\` flag 或用 replaceAll。
- replaceAll 若傳入正規表達式，**必須加 \`g\` flag**，否則拋出 TypeError。
- replacement 字串中的特殊符號：
  - \`$&\`：符合的子字串本身
  - \`$1\`, \`$2\`：正規表達式的第 1、2 個捕獲組
  - \`$$\`：代表字面量 \`$\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: `以下程式碼輸出為何？\n\nconst s = 'cat and cat'\nconsole.log(s.replace('cat', 'dog'))`,
        options: [`'dog and dog'`, `'dog and cat'`, `'cat and dog'`, `'dog'`],
        answer: 1,
        explanation: `replace 傳入字串時只替換第一個符合的，所以第一個 'cat' 換成 'dog'，第二個保留，結果是 'dog and cat'。`,
      },
      {
        id: 2,
        question: `以下程式碼輸出為何？\n\nconst s = 'cat and cat'\nconsole.log(s.replaceAll('cat', 'dog'))`,
        options: [`'dog and dog'`, `'dog and cat'`, `'cat and dog'`, `'dog'`],
        answer: 0,
        explanation: `replaceAll 替換所有符合的子字串，兩個 'cat' 都換成 'dog'，結果是 'dog and dog'。`,
      },
      {
        id: 3,
        question: `以下程式碼輸出為何？\n\nconst s = 'cat and cat'\nconsole.log(s.replace(/cat/g, 'dog'))`,
        options: [`'dog and dog'`, `'dog and cat'`, `'cat and dog'`, `'cat and cat'`],
        answer: 0,
        explanation: `正規表達式加 g（global）flag，replace 會替換所有符合的子字串，效果等同 replaceAll，結果是 'dog and dog'。`,
      },
      {
        id: 4,
        question: `以下程式碼會發生什麼？\n\nconst s = 'cat and cat'\ns.replaceAll(/cat/, 'dog')`,
        options: [
          `回傳 'dog and dog'`,
          `回傳 'dog and cat'`,
          `拋出 TypeError`,
          `回傳 'cat and cat'`,
        ],
        answer: 2,
        explanation: `replaceAll 若傳入正規表達式，必須加 g flag。沒有 g flag 的正規表達式傳給 replaceAll 會拋出 TypeError。`,
      },
      {
        id: 5,
        question: `以下程式碼輸出為何？\n\n'hello'.replace('l', '[$&]')`,
        options: [`'he[l]lo'`, `'he[l][l]o'`, `'he[][]o'`, `'[hello]'`],
        answer: 0,
        explanation: `$& 在 replacement 字串中代表「符合的子字串本身」，即 'l'。replace 只換第一個 'l'，結果是 'he[l]lo'。`,
      },
      {
        id: 6,
        question: `要把字串中所有空格替換成連字號 '-'，下列哪個選項**不能**達成？`,
        options: [
          `str.replace(/ /g, '-')`,
          `str.replaceAll(' ', '-')`,
          `str.replace(' ', '-')`,
          `str.split(' ').join('-')`,
        ],
        answer: 2,
        explanation: `str.replace(' ', '-') 傳入的是字串而非正規表達式，只會替換第一個空格，無法替換全部。其他三種方式都能替換所有空格。`,
      },
    ],
    keyPoints: [
      'replace 只替換第一個符合的，replaceAll 替換全部（ES2021）。',
      '要用 replace 替換所有，需傳入帶 g flag 的正規表達式。',
      'replaceAll 傳入正規表達式時必須加 g flag，否則拋 TypeError。',
      'replacement 可以是函式，讓每個符合的子字串動態決定替換內容。',
      '$& 在 replacement 字串中代表符合的子字串本身。',
      '兩個方法都不修改原字串，回傳新字串。',
    ],
  },

  {
    slug: 'str-pad',
    title: 'padStart() / padEnd()',
    description: '補字元至指定長度，常用於數字補零',
    subCategory: '轉換與格式化',
    difficulty: 'easy',
    notes: {
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`str.padStart(targetLength[, padString])\`
\`str.padEnd(targetLength[, padString])\`

- 回傳：**新字串**，長度至少為 targetLength。
- \`padString\`：用來補充的字串，預設是空格 \`' '\`。
- 若字串已達到或超過 targetLength，直接回傳原字串（不截短）。
- padStart 在**開頭**補，padEnd 在**結尾**補。
- ES2017 引入。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
// 數字補零（常見用途）
'5'.padStart(3, '0')     // '005'
'42'.padStart(3, '0')    // '042'
'100'.padStart(3, '0')   // '100'（已達長度，不變）
'1000'.padStart(3, '0')  // '1000'（超過長度，不截短）

// 補多個字元
'hi'.padEnd(8, '!')       // 'hi!!!!!!'
'hello'.padStart(10, 'ab') // 'ababahello'（padString 會循環）

// 預設補空格
'5'.padStart(3)  // '  5'

// 時間格式化
const h = 9, m = 5, s = 3
\`\${String(h).padStart(2,'0')}:\${String(m).padStart(2,'0')}:\${String(s).padStart(2,'0')}\`
// '09:05:03'
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- targetLength 是**最終字串的總長度**，不是補充的數量。
- 若原字串已經夠長，不會截短字串。
- padString 若為多個字元，會循環補充直到達到目標長度（多餘的部分被截掉）。
- 數字要先轉成字串才能使用：\`String(num).padStart(3, '0')\` 或 \`\`\${num}\`.padStart(3, '0')\`。`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: `以下程式碼輸出為何？\n\nconsole.log('5'.padStart(3, '0'))`,
        options: [`'005'`, `'500'`, `'050'`, `'555'`],
        answer: 0,
        explanation: `padStart 在字串開頭補充字元直到長度為 3，'5' 長度是 1，需補 2 個 '0' 在前面，結果是 '005'。`,
      },
      {
        id: 2,
        question: `以下程式碼輸出為何？\n\nconsole.log('hello'.padStart(3, '0'))`,
        options: [`'000hello'`, `'hello'`, `'hel'`, `'00hello'`],
        answer: 1,
        explanation: `'hello' 長度是 5，已超過目標長度 3，padStart 不會截短字串，直接回傳原字串 'hello'。`,
      },
      {
        id: 3,
        question: `以下程式碼輸出為何？\n\nconsole.log('hi'.padEnd(8, 'ab'))`,
        options: [`'hiababab'`, `'hiabababab'`, `'hiababababab'`, `'abababhiab'`],
        answer: 0,
        explanation: `padEnd 在結尾補充，目標長度 8，'hi' 已有 2 個，需補 6 個字元。padString 'ab' 循環補充：'ababab'，結果 'hiababab'。`,
      },
      {
        id: 4,
        question: `以下程式碼輸出為何？\n\nconsole.log('5'.padStart(3))`,
        options: [`'005'`, `'5'`, `'  5'`, `'5  '`],
        answer: 2,
        explanation: `padStart 的 padString 預設是空格，沒有傳第二個參數時用空格補充，結果是 '  5'（兩個空格加 '5'）。`,
      },
      {
        id: 5,
        question: `要把數字 9 格式化成 '09'，下列哪個寫法正確？`,
        options: [
          `9..padStart(2, '0')`,
          `String(9).padStart(2, '0')`,
          `(9).padStart(2, '0')`,
          `9.padStart(2, '0')`,
        ],
        answer: 1,
        explanation: `padStart 是字串方法，數字沒有這個方法。需先用 String(9) 或模板字串 \`\${9}\` 轉成字串再呼叫 padStart。`,
      },
    ],
    keyPoints: [
      'padStart 在開頭補字元，padEnd 在結尾補字元，直到達到指定長度。',
      '第一個參數是最終字串的「總長度」，不是補充的字元數量。',
      '若原字串已達到或超過目標長度，直接回傳原字串，不截短。',
      'padString 預設是空格，也可以指定多個字元，會循環補充。',
      '數字要先 String() 轉換才能使用，是常見的使用場景（時間補零、流水號）。',
      'ES2017 引入，現代瀏覽器全部支援。',
    ],
  },

  {
    slug: 'str-repeat',
    title: 'repeat()',
    description: '重複字串指定次數，回傳新字串',
    subCategory: '轉換與格式化',
    difficulty: 'easy',
    notes: {
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`str.repeat(count)\`

- 回傳：**新字串**，將原字串重複 count 次。
- \`count\`：整數，必須 >= 0。
  - count = 0：回傳空字串 \`''\`
  - count 為負數或 Infinity：拋出 **RangeError**
- ES2015（ES6）引入。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
'ha'.repeat(3)     // 'hahaha'
'-'.repeat(5)      // '-----'
'abc'.repeat(0)    // ''（空字串）
'hi'.repeat(1)     // 'hi'

// 拋出 RangeError 的情況
'a'.repeat(-1)        // RangeError
'a'.repeat(Infinity)  // RangeError

// 常見用途：產生分隔線
const line = '-'.repeat(20)  // '--------------------'

// 建立縮排
const indent = level => '  '.repeat(level)
indent(3)  // '      '（6 個空格）
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- count 若為小數，會被自動**無條件捨去（floor）**：\`'a'.repeat(2.9)\` → \`'aa'\`。
- count 若為 NaN，視為 0，回傳空字串。
- 不修改原字串，回傳全新的字串。`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: `以下程式碼輸出為何？\n\nconsole.log('ha'.repeat(3))`,
        options: [`'ha3'`, `'hahaha'`, `'hahaHA'`, `'hhh'`],
        answer: 1,
        explanation: `repeat(3) 將 'ha' 重複 3 次，結果是 'hahaha'。`,
      },
      {
        id: 2,
        question: `以下程式碼輸出為何？\n\nconsole.log('abc'.repeat(0))`,
        options: [`'abc'`, `0`, `''`, `undefined`],
        answer: 2,
        explanation: `count = 0 時，repeat 回傳空字串 ''。`,
      },
      {
        id: 3,
        question: `以下程式碼會發生什麼？\n\n'a'.repeat(-1)`,
        options: [
          `回傳 ''`,
          `回傳 'a'`,
          `拋出 RangeError`,
          `回傳 undefined`,
        ],
        answer: 2,
        explanation: `count 為負數時，repeat 拋出 RangeError，因為重複負次數沒有意義。`,
      },
      {
        id: 4,
        question: `以下程式碼輸出為何？\n\nconsole.log('ab'.repeat(2.9))`,
        options: [`'ababab'`, `'abab'`, `'ab'`, `拋出 RangeError`],
        answer: 1,
        explanation: `count 為小數時，repeat 先做無條件捨去（floor），2.9 → 2，所以重複 2 次，結果是 'abab'。`,
      },
      {
        id: 5,
        question: `以下程式碼輸出為何？\n\nconsole.log('x'.repeat(NaN))`,
        options: [`拋出 TypeError`, `拋出 RangeError`, `'x'`, `''`],
        answer: 3,
        explanation: `NaN 會被視為 0，repeat(0) 回傳空字串 ''。`,
      },
    ],
    keyPoints: [
      'repeat(count) 將字串重複 count 次，回傳新字串。',
      'count = 0 回傳空字串，count 為負數或 Infinity 拋出 RangeError。',
      'count 為小數時自動無條件捨去，NaN 視為 0。',
      '不修改原字串，每次都回傳全新的字串。',
      '常見用途：產生分隔線、建立縮排、重複符號。',
      'ES2015（ES6）引入。',
    ],
  },

  // ─── 字元存取 ─────────────────────────────────────────────────────

  {
    slug: 'str-charat',
    title: 'charAt() / str[i] / at()',
    description: '存取字串中指定位置的字元，越界行為不同',
    subCategory: '字元存取',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: '三種方式比較',
          content: `| 方式 | 越界回傳 | 支援負數 | 說明 |
|---|---|---|---|
| \`str.charAt(i)\` | \`''\`（空字串） | 否（視為 0） | ES1，最舊 |
| \`str[i]\` | \`undefined\` | 否 | 類陣列存取 |
| \`str.at(i)\` | \`undefined\` | **是** | ES2022，最新 |

- 三種方式在索引有效時行為相同，都回傳單一字元的字串。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const s = 'Hello'

// 正常存取
s.charAt(1)  // 'e'
s[1]         // 'e'
s.at(1)      // 'e'

// 越界
s.charAt(10)  // ''（空字串）
s[10]         // undefined
s.at(10)      // undefined

// 負數索引（只有 at 支援）
s.at(-1)     // 'o'（最後一個）
s.at(-2)     // 'l'（倒數第二個）
s.charAt(-1) // ''（負數視為越界，回傳空字串）
s[-1]        // undefined（不支援負數）

// 取最後一個字元的方式
s[s.length - 1]  // 'o'
s.at(-1)         // 'o'（更簡潔）
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- \`str.at()\` 是 ES2022 引入，舊瀏覽器可能不支援（需確認相容性）。
- 判斷越界時，\`charAt\` 回傳 \`''\`（空字串，truthy 為 false，但 \`!== undefined\` 為 true），容易造成混淆；建議用 \`at()\` 或 \`str[i]\`，越界回傳 \`undefined\` 更直覺。
- 陣列的 \`at()\` 方法也同樣支援負數，行為一致。`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: `以下程式碼輸出為何？\n\nconst s = 'Hello'\nconsole.log(s.charAt(10))`,
        options: [`undefined`, `''`, `null`, `'o'`],
        answer: 1,
        explanation: `charAt 越界回傳空字串 ''（不是 undefined）。這是 charAt 和 str[i]、at() 的主要差異之一。`,
      },
      {
        id: 2,
        question: `以下程式碼輸出為何？\n\nconst s = 'Hello'\nconsole.log(s[10])`,
        options: [`''`, `'H'`, `undefined`, `null`],
        answer: 2,
        explanation: `用陣列方式存取越界索引，回傳 undefined（與一般物件存取不存在的屬性相同）。`,
      },
      {
        id: 3,
        question: `以下程式碼輸出為何？\n\nconst s = 'Hello'\nconsole.log(s.at(-1))`,
        options: [`'H'`, `'o'`, `undefined`, `''`],
        answer: 1,
        explanation: `at() 支援負數索引，-1 代表最後一個字元，'Hello' 最後一個字元是 'o'。`,
      },
      {
        id: 4,
        question: `以下程式碼輸出為何？\n\nconst s = 'Hello'\nconsole.log(s.charAt(-1))`,
        options: [`'H'`, `'o'`, `undefined`, `''`],
        answer: 3,
        explanation: `charAt 不支援負數，負數索引視為無效，回傳空字串 ''。這和 at(-1) 回傳 'o' 不同。`,
      },
      {
        id: 5,
        question: `要取得字串最後一個字元，下列哪個是最現代且最簡潔的寫法？`,
        options: [
          `str.charAt(str.length - 1)`,
          `str[str.length - 1]`,
          `str.at(-1)`,
          `str.slice(-1)`,
        ],
        answer: 2,
        explanation: `str.at(-1) 是 ES2022 引入的最簡潔寫法，直接用負數表示倒數第幾個字元，不需要計算長度。`,
      },
      {
        id: 6,
        question: `三種字元存取方式中，哪一個越界時回傳空字串而非 undefined？`,
        options: [
          'str[i]',
          'str.at(i)',
          'str.charAt(i)',
          '三種都回傳 undefined',
        ],
        answer: 2,
        explanation: `charAt(i) 越界時回傳空字串 ''，str[i] 和 at(i) 越界時都回傳 undefined。`,
      },
    ],
    keyPoints: [
      'charAt(i) 越界回傳空字串，str[i] 和 at(i) 越界回傳 undefined。',
      'at() 是 ES2022 引入，支援負數索引，at(-1) 取最後一個字元最簡潔。',
      'charAt 和 str[i] 不支援負數索引（charAt 把負數視為無效，str[i] 回傳 undefined）。',
      '取最後一個字元，現代寫法是 str.at(-1)，舊寫法是 str[str.length - 1]。',
      '三種方式在正常索引範圍內行為相同，差異只在越界和負數。',
    ],
  },

  // ─── 金額格式化 ───────────────────────────────────────────────────

  {
    slug: 'str-locale',
    title: 'toLocaleString() / Intl.NumberFormat',
    description: '將數字格式化為千分位或貨幣金額字串',
    subCategory: '金額格式化',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: 'toLocaleString 基本用法',
          content: `\`number.toLocaleString([locales[, options]])\`

- 將數字依照語系格式化為字串。
- \`locales\`：語系代碼，如 \`'zh-TW'\`、\`'en-US'\`、\`'ja-JP'\`。
- \`options\`：格式化選項物件。

\`\`\`js
const n = 1234567.89

// 千分位格式
n.toLocaleString('zh-TW')  // '1,234,567.89'
n.toLocaleString('de-DE')  // '1.234.567,89'（德國用點分千位）

// 貨幣格式
n.toLocaleString('zh-TW', {
  style: 'currency',
  currency: 'TWD',
})
// 'NT$1,234,568'

n.toLocaleString('en-US', {
  style: 'currency',
  currency: 'USD',
})
// '$1,234,567.89'
\`\`\``,
        },
        {
          heading: 'Intl.NumberFormat（推薦用法）',
          content: `\`new Intl.NumberFormat(locales, options).format(number)\`

- 比 toLocaleString 更**穩定、可預期**，推薦在生產環境使用。
- 可以重複使用同一個 formatter 物件，效能較好。

\`\`\`js
// 千分位
const formatter = new Intl.NumberFormat('zh-TW')
formatter.format(1234567)   // '1,234,567'
formatter.format(9876543)   // '9,876,543'

// 貨幣
const currencyFmt = new Intl.NumberFormat('zh-TW', {
  style: 'currency',
  currency: 'TWD',
  minimumFractionDigits: 0,  // 不顯示小數點
})
currencyFmt.format(1234567)  // 'NT$1,234,567'

// 百分比
const pctFmt = new Intl.NumberFormat('zh-TW', { style: 'percent' })
pctFmt.format(0.75)  // '75%'
\`\`\``,
        },
        {
          heading: '實務應用',
          content: `\`\`\`js
// 常見的金額格式化 utility
function formatCurrency(amount, currency = 'TWD', locale = 'zh-TW') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

formatCurrency(50000)          // 'NT$50,000'
formatCurrency(50000, 'USD', 'en-US')  // '$50,000'
formatCurrency(50000, 'JPY', 'ja-JP')  // '￥50,000'

// 若只需千分位（不需貨幣符號）
function formatNumber(n) {
  return new Intl.NumberFormat('zh-TW').format(n)
}
formatNumber(1234567)  // '1,234,567'
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: `以下程式碼輸出為何？\n\nconsole.log((1234567).toLocaleString('zh-TW'))`,
        options: [`'1234567'`, `'1,234,567'`, `'NT$1,234,567'`, `'1.234.567'`],
        answer: 1,
        explanation: `toLocaleString('zh-TW') 依照台灣語系格式化，使用逗號作千分位分隔符，沒有指定 currency 就不會加貨幣符號，結果是 '1,234,567'。`,
      },
      {
        id: 2,
        question: `以下程式碼輸出為何？\n\n(1234567).toLocaleString('zh-TW', { style: 'currency', currency: 'TWD' })`,
        options: [
          `'1,234,567'`,
          `'TWD 1,234,567'`,
          `'NT$1,234,567' 或 'NT$1,234,568'（四捨五入）`,
          `'$1,234,567'`,
        ],
        answer: 2,
        explanation: `台灣貨幣格式通常以 'NT$' 開頭，預設會顯示到整數（TWD 沒有小數）。實際輸出可能是 'NT$1,234,567'，依瀏覽器實作有細微差異。`,
      },
      {
        id: 3,
        question: `Intl.NumberFormat 相比 toLocaleString，主要優勢是什麼？`,
        options: [
          '支援更多語系',
          '可重複使用 formatter 物件，效能較好且行為更可預期',
          '可以格式化字串而非數字',
          '回傳值包含 HTML 標籤',
        ],
        answer: 1,
        explanation: `Intl.NumberFormat 創建一次 formatter 物件後可多次呼叫 format()，效能較好。且它的行為比 toLocaleString 更一致、可預期，適合生產環境使用。`,
      },
      {
        id: 4,
        question: `以下程式碼輸出為何？\n\nnew Intl.NumberFormat('zh-TW', { style: 'percent' }).format(0.75)`,
        options: [`'0.75%'`, `'75%'`, `'75'`, `'0.75'`],
        answer: 1,
        explanation: `style: 'percent' 會將數字乘以 100 並加上百分比符號，0.75 → '75%'。`,
      },
      {
        id: 5,
        question: `要格式化數字為千分位（如 1,234,567），且不加貨幣符號，下列哪個方式正確？`,
        options: [
          `(1234567).toLocaleString('zh-TW', { style: 'currency' })`,
          `new Intl.NumberFormat('zh-TW').format(1234567)`,
          `(1234567).toFixed(3)`,
          `String(1234567).replace(/\B(?=(\d{3})+(?!\d))/g, ',')`,
        ],
        answer: 1,
        explanation: `不指定 style 時，Intl.NumberFormat 預設格式化為千分位數字，不加貨幣符號，是最正確且標準的方式。選項 D 雖然也能達到效果但是手動 regex 不推薦。`,
      },
      {
        id: 6,
        question: `以下程式碼輸出為何？\n\nnew Intl.NumberFormat('en-US', {\n  style: 'currency',\n  currency: 'USD',\n  minimumFractionDigits: 2,\n}).format(1000)`,
        options: [`'$1,000'`, `'$1,000.00'`, `'USD 1,000.00'`, `'1000.00'`],
        answer: 1,
        explanation: `en-US 美元格式以 $ 開頭，千分位逗號，minimumFractionDigits: 2 確保顯示兩位小數，結果是 '$1,000.00'。`,
      },
    ],
    keyPoints: [
      'toLocaleString(locale, options) 依語系格式化數字，可輸出千分位或貨幣格式。',
      'Intl.NumberFormat 是更正式的標準 API，行為更穩定，適合生產環境。',
      'style: "currency" 需搭配 currency 屬性（如 "TWD"、"USD"），才會加貨幣符號。',
      'style: "percent" 會將數字乘以 100 並加上 % 符號，注意 0.75 → 75%。',
      '可重複使用同一個 Intl.NumberFormat 物件，對大量格式化效能更好。',
      'minimumFractionDigits / maximumFractionDigits 可控制小數位數。',
    ],
  },
]
