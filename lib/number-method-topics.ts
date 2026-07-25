export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  answer: number      // 0-based
  explanation: string
}

export interface NumberMethodEntry {
  slug: string
  title: string
  description: string
  subCategory: string
  difficulty: 'easy' | 'medium' | 'hard'
  notes: {
    sections: { heading: string; content: string }[]
  }
  questions: QuizQuestion[]  // 5-6 題
  keyPoints: string[]        // 5-6 條
}

export const THEME = '數字方法'

export const NUMBER_SUB_CATEGORIES = [
  { name: '型別轉換', order: 1 },
  { name: '數字判斷', order: 2 },
  { name: '格式化', order: 3 },
  { name: 'Math 基礎', order: 4 },
  { name: 'Math 進階', order: 5 },
  { name: '精度問題', order: 6 },
]

export const numberMethodTopics: NumberMethodEntry[] = [
  // ─── 型別轉換 ────────────────────────────────────────────
  {
    slug: 'num-number',
    title: 'Number()',
    description: '將值轉為數字型別，空字串→0，undefined→NaN',
    subCategory: '型別轉換',
    difficulty: 'easy',
    notes: {
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`Number(value)\`

將傳入的值強制轉換為數字型別，回傳 **number**。若無法轉換則回傳 **NaN**。`,
        },
        {
          heading: '常見轉換規則',
          content: `\`\`\`js
Number('')          // 0
Number(' ')         // 0
Number('123')       // 123
Number('12.5')      // 12.5
Number('123abc')    // NaN
Number(true)        // 1
Number(false)       // 0
Number(null)        // 0
Number(undefined)   // NaN
Number([])          // 0
Number([3])         // 3
Number([1,2])       // NaN
Number({})          // NaN
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- \`Number('')\` 回傳 **0**，不是 NaN，這是常見陷阱
- \`Number(null)\` 回傳 **0**，但 \`Number(undefined)\` 回傳 **NaN**
- 與 \`parseInt\` / \`parseFloat\` 的差異：\`Number\` 不允許部分解析，字串中有非數字字元就回傳 NaN
- 單元素陣列 \`[3]\` 會先轉字串 \`"3"\` 再轉數字`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: 'Number(\'\') 的結果是？',
        options: ['NaN', '0', 'undefined', '""'],
        answer: 1,
        explanation: 'Number(\'\') 回傳 0，空字串在數字轉換中視為 0，這是常見陷阱。',
      },
      {
        id: 2,
        question: 'Number(null) 的結果是？',
        options: ['NaN', 'undefined', '0', '1'],
        answer: 2,
        explanation: 'Number(null) 回傳 0。null 在型別轉換中視為「空值」，對應數字 0。',
      },
      {
        id: 3,
        question: 'Number(undefined) 的結果是？',
        options: ['0', 'null', 'NaN', '-1'],
        answer: 2,
        explanation: 'Number(undefined) 回傳 NaN。undefined 無法轉換為有效數字。',
      },
      {
        id: 4,
        question: '以下哪個 Number() 呼叫的結果不是 NaN？',
        options: ['Number("123abc")', 'Number({})', 'Number([1,2])', 'Number([5])'],
        answer: 3,
        explanation: 'Number([5]) 回傳 5。單元素陣列會先轉為字串 "5"，再轉為數字 5。其他選項都回傳 NaN。',
      },
      {
        id: 5,
        question: 'Number(true) 和 Number(false) 分別是？',
        options: ['NaN 和 NaN', '1 和 0', '0 和 1', '"true" 和 "false"'],
        answer: 1,
        explanation: 'Number(true) 回傳 1，Number(false) 回傳 0。boolean 轉數字的規則：true→1，false→0。',
      },
      {
        id: 6,
        question: `console.log(Number('  42  ')) 的輸出是？`,
        options: ['NaN', '"  42  "', '42', '0'],
        answer: 2,
        explanation: 'Number() 會先 trim 前後空白再轉換，所以 Number("  42  ") 回傳 42。',
      },
    ],
    keyPoints: [
      'Number(\'\') 回傳 0，不是 NaN，空字串被視為數字零',
      'Number(null) 回傳 0，Number(undefined) 回傳 NaN，兩者行為不同',
      '字串中有任何非數字字元（除了前後空白）就回傳 NaN',
      '單元素陣列 [3] 會先轉字串 "3" 再轉數字，回傳 3',
      'true → 1，false → 0，是 boolean 轉數字的固定規則',
      'Number() 與 parseInt() 最大差異：Number 不接受部分解析',
    ],
  },
  {
    slug: 'num-parseint',
    title: 'parseInt()',
    description: '解析字串為整數，可指定進位制，部分解析',
    subCategory: '型別轉換',
    difficulty: 'easy',
    notes: {
      sections: [
        {
          heading: '語法與參數',
          content: `\`parseInt(string, radix)\`

- **string**：要解析的字串
- **radix**：進位制（2–36），強烈建議永遠傳入，預設行為因瀏覽器而異
- 回傳：**整數** 或 **NaN**`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
parseInt('123')        // 123
parseInt('123.99')     // 123（只取整數部分）
parseInt('123abc')     // 123（部分解析，遇到非數字停止）
parseInt('abc')        // NaN（第一個字元就無法解析）
parseInt('0xFF', 16)   // 255
parseInt('11', 2)      // 3（二進位 11 = 十進位 3）
parseInt('10', 8)      // 8（八進位 10 = 十進位 8）
parseInt('')           // NaN（空字串回傳 NaN，和 Number 不同！）
parseInt(null)         // NaN
\`\`\``,
        },
        {
          heading: '與 Number() 的差異',
          content: `| 比較 | parseInt | Number |
|------|----------|--------|
| 空字串 \`''\` | NaN | 0 |
| \`'123abc'\` | 123（部分解析）| NaN |
| 小數 \`'1.5'\` | 1（截斷）| 1.5 |
| 進位制 | 可指定 radix | 不支援 |

- parseInt **不四捨五入**，直接截斷小數
- 傳入非字串時，會先呼叫 \`.toString()\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: `parseInt('123abc') 的結果是？`,
        options: ['NaN', '123', '0', 'undefined'],
        answer: 1,
        explanation: 'parseInt 會部分解析，從字串開頭讀取直到遇到無法解析的字元為止，所以回傳 123。',
      },
      {
        id: 2,
        question: `parseInt('') 的結果是？`,
        options: ['0', 'NaN', 'undefined', '""'],
        answer: 1,
        explanation: 'parseInt(\'\') 回傳 NaN，這和 Number(\'\') 回傳 0 不同，是常見混淆點。',
      },
      {
        id: 3,
        question: `parseInt('11', 2) 的結果是？`,
        options: ['11', '2', '3', 'NaN'],
        answer: 2,
        explanation: '第二個參數指定進位制為 2（二進位），"11" 的二進位值是 1×2 + 1×1 = 3。',
      },
      {
        id: 4,
        question: `parseInt('3.9') 的結果是？`,
        options: ['4', '3', 'NaN', '3.9'],
        answer: 1,
        explanation: 'parseInt 直接截斷小數部分，不四捨五入，所以 3.9 回傳 3，不是 4。',
      },
      {
        id: 5,
        question: `parseInt('0xFF', 16) 的結果是？`,
        options: ['255', '15', 'NaN', '16'],
        answer: 0,
        explanation: '0xFF 是十六進位表示法，F=15，FF = 15×16 + 15 = 255。',
      },
      {
        id: 6,
        question: '為什麼呼叫 parseInt 時強烈建議傳入第二個參數（radix）？',
        options: [
          '不傳會拋出 TypeError',
          '不傳預設是 8（八進位），會導致錯誤',
          '不傳時行為依字串內容而異，可能誤判為八進位或十六進位',
          '不傳時效能較差',
        ],
        answer: 2,
        explanation: '不傳 radix 時，若字串以 "0x" 開頭會用十六進位，有些舊環境以 "0" 開頭會用八進位，行為不一致，建議永遠傳入 10。',
      },
    ],
    keyPoints: [
      'parseInt 是部分解析，遇到非數字字元就停止，不像 Number 整個字串都要合法',
      'parseInt(\'\') 回傳 NaN，和 Number(\'\') 回傳 0 的行為不同',
      '第二個參數 radix 是進位制，建議永遠傳入 10 避免歧義',
      'parseInt 直接截斷小數，不四捨五入',
      '字串第一個字元無法解析就回傳 NaN，例如 parseInt("abc") → NaN',
      '傳入非字串時會先呼叫 toString()，所以 parseInt([3]) 等同 parseInt("3")',
    ],
  },
  {
    slug: 'num-parsefloat',
    title: 'parseFloat()',
    description: '解析字串為浮點數，遇非數字字元停止',
    subCategory: '型別轉換',
    difficulty: 'easy',
    notes: {
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`parseFloat(string)\`

將字串解析為浮點數，從字串開頭開始讀取，遇到無法解析的字元停止。回傳 **number** 或 **NaN**。

- 不支援 radix 參數（與 parseInt 差異）
- 可解析指數表示法（如 \`"1.5e3"\`）`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
parseFloat('3.14')        // 3.14
parseFloat('3.14abc')     // 3.14（部分解析）
parseFloat('.5')          // 0.5
parseFloat('3.14.15')     // 3.14（第二個小數點停止）
parseFloat('1.5e3')       // 1500
parseFloat('')            // NaN
parseFloat('abc')         // NaN
parseFloat(null)          // NaN
parseFloat(true)          // NaN（注意：Number(true) 是 1）
\`\`\``,
        },
        {
          heading: '與 parseInt / Number 的比較',
          content: `| 輸入 | parseFloat | parseInt | Number |
|------|-----------|---------|--------|
| \`'3.14'\` | 3.14 | 3 | 3.14 |
| \`'3.14abc'\` | 3.14 | 3 | NaN |
| \`''\` | NaN | NaN | 0 |
| \`true\` | NaN | NaN | 1 |

- parseFloat 和 parseInt 都屬於「部分解析」
- parseFloat 保留小數，parseInt 截斷小數`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: `parseFloat('3.14abc') 的結果是？`,
        options: ['NaN', '3', '3.14', '3.14abc'],
        answer: 2,
        explanation: 'parseFloat 部分解析，遇到 "abc" 停止，但已成功解析 3.14，所以回傳 3.14。',
      },
      {
        id: 2,
        question: `parseFloat('3.14.15') 的結果是？`,
        options: ['3', '3.14', '3.1415', 'NaN'],
        answer: 1,
        explanation: '第二個小數點無法解析，所以在第二個點停止，回傳 3.14。',
      },
      {
        id: 3,
        question: `parseFloat(true) 的結果是？`,
        options: ['1', 'NaN', '0', 'true'],
        answer: 1,
        explanation: 'parseFloat 會先呼叫 toString()，true.toString() 是 "true"，第一個字元 "t" 無法解析，回傳 NaN。注意 Number(true) 才是 1。',
      },
      {
        id: 4,
        question: `parseFloat('1.5e3') 的結果是？`,
        options: ['1.5', '15', '1500', 'NaN'],
        answer: 2,
        explanation: 'parseFloat 支援科學記號，1.5e3 表示 1.5 × 10³ = 1500。',
      },
      {
        id: 5,
        question: `parseFloat('.5') 的結果是？`,
        options: ['NaN', '0', '0.5', '5'],
        answer: 2,
        explanation: '以小數點開頭的字串是合法的浮點數格式，parseFloat(".5") 回傳 0.5。',
      },
    ],
    keyPoints: [
      'parseFloat 是部分解析，遇到無法解析的字元就停止，不整個字串都要合法',
      '第二個小數點視為停止符號，不是錯誤，所以 "3.14.15" → 3.14',
      '不支援 radix 參數，這點和 parseInt 不同',
      'parseFloat(true) 回傳 NaN，因為 true 先轉字串 "true" 再解析',
      '支援科學記號，1.5e3 正確解析為 1500',
      '空字串回傳 NaN，和 Number(\'\') = 0 的行為不同',
    ],
  },

  // ─── 數字判斷 ────────────────────────────────────────────
  {
    slug: 'num-isnan',
    title: 'isNaN() vs Number.isNaN()',
    description: '判斷是否為 NaN，全域版會先型別轉換',
    subCategory: '數字判斷',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: '兩者的核心差異',
          content: `| 方法 | 行為 |
|------|------|
| 全域 \`isNaN(x)\` | 先將 x 轉成數字（\`Number(x)\`），再判斷是否為 NaN |
| \`Number.isNaN(x)\` | **不做型別轉換**，只有值本身是 NaN 才回傳 true |

\`Number.isNaN\` 是 ES6 新增的更嚴格版本，推薦使用。`,
        },
        {
          heading: '容易混淆的例子',
          content: `\`\`\`js
// 全域 isNaN —— 會先做 Number()
isNaN(NaN)          // true
isNaN('')           // false  ← Number('') = 0，0 不是 NaN
isNaN(' ')          // false  ← Number(' ') = 0
isNaN(null)         // false  ← Number(null) = 0
isNaN(undefined)    // true   ← Number(undefined) = NaN
isNaN('abc')        // true   ← Number('abc') = NaN
isNaN('123')        // false  ← Number('123') = 123

// Number.isNaN —— 嚴格判斷
Number.isNaN(NaN)          // true
Number.isNaN('')           // false（字串就不是 NaN）
Number.isNaN(undefined)    // false（undefined 不是 NaN）
Number.isNaN('abc')        // false（字串不是 NaN）
Number.isNaN(0 / 0)        // true（運算結果才是 NaN）
\`\`\``,
        },
        {
          heading: '如何正確偵測 NaN',
          content: `\`\`\`js
// 最可靠的方式：Number.isNaN
Number.isNaN(NaN)       // true
Number.isNaN(0 / 0)     // true

// NaN 是唯一不等於自身的值
const x = NaN
x !== x                 // true（可利用此特性）

// Object.is 也能偵測
Object.is(NaN, NaN)     // true（不同於 ===）
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: `isNaN('') 的結果是？`,
        options: ['true', 'false', 'NaN', '拋出 TypeError'],
        answer: 1,
        explanation: '全域 isNaN 會先做 Number("")，得到 0，0 不是 NaN，所以回傳 false。這是最常見的陷阱。',
      },
      {
        id: 2,
        question: `Number.isNaN('') 的結果是？`,
        options: ['true', 'false', 'NaN', '拋出 TypeError'],
        answer: 1,
        explanation: 'Number.isNaN 不做型別轉換，字串 "" 不是 NaN，回傳 false。',
      },
      {
        id: 3,
        question: `isNaN(undefined) 的結果是？`,
        options: ['false', 'true', 'NaN', 'undefined'],
        answer: 1,
        explanation: '全域 isNaN 先做 Number(undefined) = NaN，NaN 是 NaN，所以回傳 true。',
      },
      {
        id: 4,
        question: `Number.isNaN(undefined) 的結果是？`,
        options: ['true', 'false', 'NaN', 'undefined'],
        answer: 1,
        explanation: 'Number.isNaN 不做轉換，undefined 本身不是 NaN 這個值，回傳 false。',
      },
      {
        id: 5,
        question: '以下哪個敘述正確？',
        options: [
          'NaN === NaN 回傳 true',
          'Number.isNaN 會先做型別轉換再判斷',
          'NaN 是唯一不等於自身的值',
          'isNaN 和 Number.isNaN 結果永遠一樣',
        ],
        answer: 2,
        explanation: 'NaN !== NaN，NaN 是 JavaScript 中唯一不等於自身的值，可以利用 x !== x 來判斷是否為 NaN。',
      },
      {
        id: 6,
        question: `isNaN(null) 的結果是？`,
        options: ['true', 'false', 'NaN', 'null'],
        answer: 1,
        explanation: '全域 isNaN 先做 Number(null) = 0，0 不是 NaN，回傳 false。',
      },
    ],
    keyPoints: [
      '全域 isNaN 會先做 Number() 型別轉換，Number.isNaN 不做轉換',
      'isNaN(\'\') 回傳 false，因為 Number(\'\') = 0，不是 NaN',
      'NaN 是唯一不等於自身的值，x !== x 可偵測 NaN',
      '推薦使用 Number.isNaN，行為更嚴格可預測',
      'isNaN(undefined) → true，因為 Number(undefined) = NaN',
      'Object.is(NaN, NaN) 回傳 true，提供另一種可靠的比較方式',
    ],
  },
  {
    slug: 'num-isfinite',
    title: 'isFinite() vs Number.isFinite()',
    description: '判斷是否為有限數，全域版會先型別轉換',
    subCategory: '數字判斷',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: '兩者的核心差異',
          content: `| 方法 | 行為 |
|------|------|
| 全域 \`isFinite(x)\` | 先將 x 轉成數字（\`Number(x)\`），再判斷是否有限 |
| \`Number.isFinite(x)\` | **不做型別轉換**，只有數字類型的有限值才回傳 true |

有限數：不是 Infinity、-Infinity、NaN 的數字。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
// 全域 isFinite
isFinite(42)           // true
isFinite(Infinity)     // false
isFinite(-Infinity)    // false
isFinite(NaN)          // false
isFinite('')           // true  ← Number('') = 0，0 是有限數
isFinite(null)         // true  ← Number(null) = 0
isFinite(undefined)    // false ← Number(undefined) = NaN
isFinite('42')         // true  ← Number('42') = 42

// Number.isFinite（嚴格）
Number.isFinite(42)        // true
Number.isFinite(Infinity)  // false
Number.isFinite('')        // false（字串不是數字）
Number.isFinite(null)      // false（null 不是數字）
Number.isFinite('42')      // false（字串不是數字）
\`\`\``,
        },
        {
          heading: '相關常數',
          content: `\`\`\`js
Number.POSITIVE_INFINITY   // Infinity
Number.NEGATIVE_INFINITY   // -Infinity
Number.MAX_VALUE           // 最大的有限正數 ≈ 1.7976931348623157e+308
Number.MIN_VALUE           // 最小的正數 ≈ 5e-324（不是最小的負數）
Number.MAX_SAFE_INTEGER    // 2^53 - 1 = 9007199254740991
Number.MIN_SAFE_INTEGER    // -(2^53 - 1)
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: `isFinite('') 的結果是？`,
        options: ['false', 'true', 'NaN', '拋出 TypeError'],
        answer: 1,
        explanation: '全域 isFinite 先做 Number("") = 0，0 是有限數，回傳 true。',
      },
      {
        id: 2,
        question: `Number.isFinite('42') 的結果是？`,
        options: ['true', 'false', 'NaN', '42'],
        answer: 1,
        explanation: 'Number.isFinite 不做型別轉換，字串不是數字型別，直接回傳 false。',
      },
      {
        id: 3,
        question: `isFinite(1 / 0) 的結果是？`,
        options: ['true', 'false', 'NaN', '拋出 RangeError'],
        answer: 1,
        explanation: '1 / 0 在 JavaScript 中不會拋出錯誤，結果是 Infinity，Infinity 不是有限數，回傳 false。',
      },
      {
        id: 4,
        question: 'Number.MAX_SAFE_INTEGER 的值是？',
        options: ['2^31 - 1', '2^32 - 1', '2^53 - 1', '2^63 - 1'],
        answer: 2,
        explanation: 'Number.MAX_SAFE_INTEGER 是 2^53 - 1 = 9007199254740991，超過此值的整數運算可能有精度問題。',
      },
      {
        id: 5,
        question: `isFinite(null) 的結果是？`,
        options: ['false', 'true', 'null', 'NaN'],
        answer: 1,
        explanation: '全域 isFinite 先做 Number(null) = 0，0 是有限數，回傳 true。',
      },
    ],
    keyPoints: [
      '全域 isFinite 會先做型別轉換，Number.isFinite 只接受數字型別',
      'isFinite(\'\') 和 isFinite(null) 都回傳 true，因為轉換後都是 0',
      'Number.isFinite(\'\') 回傳 false，字串不是數字',
      'Infinity 和 -Infinity 都不是有限數',
      'Number.MAX_SAFE_INTEGER 是 2^53 - 1，超過此值整數運算可能失去精度',
      '1 / 0 在 JavaScript 不拋錯，結果是 Infinity',
    ],
  },
  {
    slug: 'num-isinteger',
    title: 'Number.isInteger()',
    description: '判斷是否為整數，1.0 視為整數',
    subCategory: '數字判斷',
    difficulty: 'easy',
    notes: {
      sections: [
        {
          heading: '語法與行為',
          content: `\`Number.isInteger(value)\`

判斷傳入的值是否為整數，**不做型別轉換**。回傳 boolean。

- 1.0 視為整數（整數儲存方式）
- 字串、null、undefined 都回傳 false`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
Number.isInteger(1)          // true
Number.isInteger(1.0)        // true  ← 1.0 === 1，是整數
Number.isInteger(1.5)        // false
Number.isInteger('1')        // false（字串）
Number.isInteger(null)       // false
Number.isInteger(undefined)  // false
Number.isInteger(NaN)        // false
Number.isInteger(Infinity)   // false
Number.isInteger(1e20)       // true  ← 1e20 是整數
Number.isInteger(1e300)      // true  ← 雖然超過 MAX_SAFE_INTEGER，但仍是整數
\`\`\``,
        },
        {
          heading: '自行實作判斷整數的方式',
          content: `\`\`\`js
// 傳統做法（不推薦）
function isInt(n) {
  return typeof n === 'number' && n % 1 === 0
}

// 更嚴謹：搭配安全整數範圍
Number.isSafeInteger(9007199254740991)   // true
Number.isSafeInteger(9007199254740992)   // false（超出安全範圍）
Number.isSafeInteger(1.5)                // false
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: 'Number.isInteger(1.0) 的結果是？',
        options: ['false', 'true', 'NaN', '拋出 TypeError'],
        answer: 1,
        explanation: '1.0 在 JavaScript 中等於 1，是整數，所以 Number.isInteger(1.0) 回傳 true。',
      },
      {
        id: 2,
        question: `Number.isInteger('1') 的結果是？`,
        options: ['true', 'false', '1', 'NaN'],
        answer: 1,
        explanation: 'Number.isInteger 不做型別轉換，字串 "1" 不是數字型別，回傳 false。',
      },
      {
        id: 3,
        question: 'Number.isInteger(Infinity) 的結果是？',
        options: ['true', 'false', 'NaN', '拋出 RangeError'],
        answer: 1,
        explanation: 'Infinity 雖然是 number 型別，但不是整數，Number.isInteger(Infinity) 回傳 false。',
      },
      {
        id: 4,
        question: '以下哪個方法用來判斷是否在安全整數範圍內？',
        options: [
          'Number.isInteger()',
          'Number.isSafeInteger()',
          'Number.isFinite()',
          'Number.isNaN()',
        ],
        answer: 1,
        explanation: 'Number.isSafeInteger() 用來判斷是否在 -(2^53-1) 到 2^53-1 的安全整數範圍內，超出此範圍的整數可能有精度問題。',
      },
      {
        id: 5,
        question: 'Number.isInteger(1e20) 的結果是？',
        options: ['false', 'true', 'NaN', '拋出 RangeError'],
        answer: 1,
        explanation: '1e20 是 100000000000000000000，雖然是大數但仍是整數值，回傳 true。',
      },
    ],
    keyPoints: [
      '1.0 視為整數，Number.isInteger(1.0) 回傳 true',
      '不做型別轉換，字串 "1" 回傳 false',
      'Infinity 和 NaN 都回傳 false',
      'Number.isSafeInteger() 判斷是否在安全整數範圍 -(2^53-1) 到 2^53-1',
      '超出 MAX_SAFE_INTEGER 的整數雖然 isInteger 回傳 true，但運算可能不精確',
      '傳統判斷整數方式是 typeof n === "number" && n % 1 === 0',
    ],
  },

  // ─── 格式化 ────────────────────────────────────────────
  {
    slug: 'num-tofixed',
    title: 'toFixed()',
    description: '四捨五入至指定小數位，回傳字串而非數字',
    subCategory: '格式化',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`number.toFixed(digits)\`

- **digits**：保留的小數位數（0–100），預設為 0
- 回傳：**字串**（不是數字！）
- 會進行四捨五入（但有 IEEE 754 精度問題）`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
(1.5).toFixed(0)        // "2"（字串！）
(1.23456).toFixed(2)    // "1.23"
(1.005).toFixed(2)      // "1.00"（精度問題，不是 "1.01"）
(1.255).toFixed(2)      // "1.25"（精度問題）
(0).toFixed(3)          // "0.000"
(1234.5).toFixed(0)     // "1235"

// 常見錯誤：以為回傳數字
typeof (1.5).toFixed(0)         // "string"（不是 "number"）
(1.5).toFixed(0) === 2          // false（字串 vs 數字）
(1.5).toFixed(0) === "2"        // true

// 轉回數字
Number((1.5).toFixed(0))        // 2（數字）
parseFloat((1.23).toFixed(2))   // 1.23（數字）
\`\`\``,
        },
        {
          heading: '精度問題說明',
          content: `\`toFixed\` 的四捨五入並非總是符合預期，原因是 IEEE 754 浮點數表示的精度限制：

\`\`\`js
(1.005).toFixed(2)    // "1.00" 而非 "1.01"
// 因為 1.005 實際上約為 1.00499999999999989...

// 解決方案：先乘以倍數再操作
Math.round(1.005 * 100) / 100   // 1.01（更可靠）
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: 'typeof (1.5).toFixed(0) 的結果是？',
        options: ['"number"', '"string"', '"object"', '"boolean"'],
        answer: 1,
        explanation: 'toFixed() 回傳的是字串，不是數字，typeof (1.5).toFixed(0) 是 "string"。這是最常見的陷阱。',
      },
      {
        id: 2,
        question: '(1.23456).toFixed(2) 的結果是？',
        options: ['"1.23"', '"1.24"', '1.23', 'NaN'],
        answer: 0,
        explanation: 'toFixed(2) 保留 2 位小數並四捨五入，1.23456 → "1.23"（字串）。',
      },
      {
        id: 3,
        question: '(1.005).toFixed(2) 的預期結果應為 "1.01"，但實際上是？',
        options: ['"1.01"', '"1.00"', '"1.005"', '拋出 RangeError'],
        answer: 1,
        explanation: '由於 IEEE 754 精度問題，1.005 實際上約為 1.00499...，toFixed(2) 結果是 "1.00"，而非預期的 "1.01"。',
      },
      {
        id: 4,
        question: '如何將 toFixed() 的結果轉回數字型別？',
        options: [
          '直接使用，toFixed 已回傳數字',
          '使用 Number() 或 parseFloat() 包裹',
          '使用 parseInt()',
          '使用 .toString()',
        ],
        answer: 1,
        explanation: 'toFixed 回傳字串，需要用 Number() 或 parseFloat() 轉回數字，例如 Number((1.5).toFixed(0))。',
      },
      {
        id: 5,
        question: '(0).toFixed(3) 的結果是？',
        options: ['"0"', '"0.0"', '"0.000"', '0'],
        answer: 2,
        explanation: '(0).toFixed(3) 回傳字串 "0.000"，補齊三位小數。',
      },
      {
        id: 6,
        question: '以下哪個方式能更可靠地將 1.005 四捨五入到小數第二位？',
        options: [
          '(1.005).toFixed(2)',
          'Math.round(1.005 * 100) / 100',
          'parseInt(1.005, 10)',
          'parseFloat(1.005)',
        ],
        answer: 1,
        explanation: '先乘以倍數（1.005 * 100 = 100.5），用 Math.round 四捨五入後再除回（/ 100 = 1.01），可避免 toFixed 的精度問題。',
      },
    ],
    keyPoints: [
      'toFixed() 回傳的是字串，不是數字，這是最常見的誤解',
      'typeof (1.5).toFixed(0) 是 "string"，不是 "number"',
      '比較前需先轉型：Number((x).toFixed(n)) 或 parseFloat()',
      '(1.005).toFixed(2) 可能回傳 "1.00" 而非 "1.01"，IEEE 754 精度限制',
      '更可靠的四捨五入：Math.round(n * 100) / 100',
      'digits 參數範圍是 0–100，預設 0',
    ],
  },
  {
    slug: 'num-locale',
    title: 'toLocaleString() / Intl.NumberFormat',
    description: '格式化數字為千分位或貨幣字串',
    subCategory: '格式化',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: 'toLocaleString() 基本用法',
          content: `\`number.toLocaleString([locale, options])\`

依據地區設定格式化數字，回傳字串。

\`\`\`js
(1234567.89).toLocaleString()
// 依瀏覽器地區而異，例如 "1,234,567.89"

(1234567.89).toLocaleString('zh-TW')
// "1,234,567.89"

(1234567.89).toLocaleString('de-DE')
// "1.234.567,89"（德國用點當千分位，逗號當小數點）

(0.5).toLocaleString('en-US', { style: 'percent' })
// "50%"
\`\`\``,
        },
        {
          heading: 'Intl.NumberFormat',
          content: `比 \`toLocaleString\` 更推薦的做法，效能更好（可重複使用格式化器）：

\`\`\`js
// 千分位
new Intl.NumberFormat('zh-TW').format(1234567)
// "1,234,567"

// 貨幣
new Intl.NumberFormat('zh-TW', {
  style: 'currency',
  currency: 'TWD',
}).format(1234)
// "NT$1,234"

new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
}).format(1234.5)
// "$1,234.50"

// 限制小數位數
new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format(1.5)
// "1.50"
\`\`\``,
        },
        {
          heading: '常用 options 選項',
          content: `| 選項 | 說明 |
|------|------|
| \`style\` | \`"decimal"\`（預設）/ \`"currency"\` / \`"percent"\` / \`"unit"\` |
| \`currency\` | 貨幣代碼，如 \`"TWD"\`、\`"USD"\`、\`"JPY"\` |
| \`minimumFractionDigits\` | 最少小數位數 |
| \`maximumFractionDigits\` | 最多小數位數 |
| \`useGrouping\` | 是否使用千分位分隔（預設 true）|`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: 'toLocaleString() 和 Intl.NumberFormat，哪個在需要重複格式化時效能較好？',
        options: [
          'toLocaleString，因為語法更簡單',
          'Intl.NumberFormat，可建立格式化器物件重複使用',
          '兩者效能完全相同',
          'parseInt，因為最快',
        ],
        answer: 1,
        explanation: 'Intl.NumberFormat 可以建立格式化器物件，在需要格式化多個數字時效能更好，因為不需要每次重新解析 locale 和 options。',
      },
      {
        id: 2,
        question: '以下哪個 Intl.NumberFormat 設定可以輸出貨幣格式？',
        options: [
          '{ format: "currency", code: "TWD" }',
          '{ style: "currency", currency: "TWD" }',
          '{ type: "money", region: "TW" }',
          '{ currency: "TWD" }',
        ],
        answer: 1,
        explanation: '需要設定 style: "currency" 以及 currency 貨幣代碼，兩個都要指定才能正確輸出貨幣格式。',
      },
      {
        id: 3,
        question: '(0.5).toLocaleString("en-US", { style: "percent" }) 的結果是？',
        options: ['"0.5%"', '"50%"', '"0.5"', '"50"'],
        answer: 1,
        explanation: 'style: "percent" 會將數字乘以 100 並加上 % 符號，0.5 → "50%"。',
      },
      {
        id: 4,
        question: 'toLocaleString() 回傳的型別是？',
        options: ['number', 'string', 'object', 'boolean'],
        answer: 1,
        explanation: 'toLocaleString() 和所有格式化方法一樣，回傳的是字串（string）。',
      },
      {
        id: 5,
        question: '如果要限制格式化後最多顯示 2 位小數，應使用哪個 option？',
        options: [
          'maxDecimals: 2',
          'maximumFractionDigits: 2',
          'fractionDigits: 2',
          'toFixed: 2',
        ],
        answer: 1,
        explanation: 'Intl.NumberFormat 的選項是 maximumFractionDigits，用來設定最多顯示的小數位數。',
      },
    ],
    keyPoints: [
      'toLocaleString() 依據 locale 格式化數字，回傳字串',
      'Intl.NumberFormat 更推薦，可重複使用格式化器，效能更好',
      'style: "currency" 配合 currency 選項可輸出貨幣格式',
      'style: "percent" 會自動將數字乘以 100 並加 % 符號',
      'useGrouping: false 可關閉千分位分隔符號',
      '德國等地使用點當千分位、逗號當小數點，locale 很重要',
    ],
  },

  // ─── Math 基礎 ────────────────────────────────────────────
  {
    slug: 'num-math-basic',
    title: 'Math.floor / ceil / round / abs / random',
    description: '常用 Math 基礎方法：取整、絕對值、隨機數',
    subCategory: 'Math 基礎',
    difficulty: 'easy',
    notes: {
      sections: [
        {
          heading: '取整方法比較',
          content: `| 方法 | 說明 | 範例 |
|------|------|------|
| \`Math.floor(x)\` | 向下取整（地板）| \`Math.floor(4.9)\` → 4 |
| \`Math.ceil(x)\` | 向上取整（天花板）| \`Math.ceil(4.1)\` → 5 |
| \`Math.round(x)\` | 四捨五入 | \`Math.round(4.5)\` → 5 |
| \`Math.trunc(x)\` | 截斷小數（直接去掉）| \`Math.trunc(-4.9)\` → -4 |

**負數的差異：**
\`\`\`js
Math.floor(-4.1)   // -5（更小的整數）
Math.ceil(-4.9)    // -4（更大的整數）
Math.round(-4.5)   // -4（.5 向上取整，負數往零靠近）
Math.trunc(-4.9)   // -4（直接丟掉小數）
\`\`\``,
        },
        {
          heading: 'abs 與 random',
          content: `\`\`\`js
// Math.abs — 絕對值
Math.abs(-5)     // 5
Math.abs(5)      // 5
Math.abs(-3.14)  // 3.14

// Math.random — 隨機數 [0, 1)（包含 0，不包含 1）
Math.random()    // 例如 0.7842...

// 取得 0 到 n-1 的隨機整數
Math.floor(Math.random() * n)

// 取得 min 到 max 之間（含）的隨機整數
Math.floor(Math.random() * (max - min + 1)) + min
\`\`\``,
        },
        {
          heading: '其他常用基礎方法',
          content: `\`\`\`js
Math.sign(-5)    // -1（回傳正負號：-1, 0, 1）
Math.sign(0)     // 0
Math.sign(3)     // 1

Math.PI          // 3.141592653589793
Math.E           // 2.718281828459045
Math.LN2         // 0.6931471805599453
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: 'Math.floor(-4.1) 的結果是？',
        options: ['-4', '-5', '4', '5'],
        answer: 1,
        explanation: 'Math.floor 向下取整（往負無窮方向），-4.1 向下取整是 -5，不是 -4。',
      },
      {
        id: 2,
        question: 'Math.round(4.5) 和 Math.round(-4.5) 分別是？',
        options: ['5 和 -5', '5 和 -4', '4 和 -4', '4 和 -5'],
        answer: 1,
        explanation: 'Math.round 在 .5 時向上取整（往正無窮）。4.5 → 5，-4.5 → -4（因為 -4 > -5，是往正無窮方向）。',
      },
      {
        id: 3,
        question: 'Math.random() 的回傳範圍是？',
        options: ['[0, 1]（包含 0 和 1）', '[0, 1)（包含 0，不包含 1）', '(0, 1)（不包含 0 和 1）', '(0, 1]（不包含 0，包含 1）'],
        answer: 1,
        explanation: 'Math.random() 回傳 [0, 1) 的浮點數，包含 0 但永遠不會是 1。',
      },
      {
        id: 4,
        question: '要取得 1 到 6 之間（含）的隨機整數，正確的寫法是？',
        options: [
          'Math.random() * 6',
          'Math.floor(Math.random() * 6) + 1',
          'Math.round(Math.random() * 6)',
          'Math.ceil(Math.random() * 5)',
        ],
        answer: 1,
        explanation: 'Math.floor(Math.random() * 6) + 1：random * 6 給出 [0,6)，floor 後是 0-5，+1 變成 1-6。',
      },
      {
        id: 5,
        question: 'Math.trunc(-4.9) 和 Math.floor(-4.9) 的結果分別是？',
        options: ['-4 和 -4', '-5 和 -5', '-4 和 -5', '-5 和 -4'],
        answer: 2,
        explanation: 'Math.trunc 直接截斷小數，-4.9 → -4。Math.floor 向下取整，-4.9 → -5。對負數結果不同。',
      },
    ],
    keyPoints: [
      'floor 向下取整，ceil 向上取整，負數時 floor(-4.1) = -5',
      'round(.5) 往正無窮方向，所以 round(-4.5) = -4',
      'Math.random() 回傳 [0, 1)，包含 0 不包含 1',
      '取得 1 到 n 的隨機整數：Math.floor(Math.random() * n) + 1',
      'Math.trunc 直接截斷小數，對負數和 floor 不同',
      'Math.abs 回傳絕對值，Math.sign 回傳 -1、0 或 1',
    ],
  },

  // ─── Math 進階 ────────────────────────────────────────────
  {
    slug: 'num-math-advanced',
    title: 'Math.max / min / pow / sqrt / cbrt',
    description: 'Math 進階方法：最大最小值、次方、開根號',
    subCategory: 'Math 進階',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: 'Math.max / Math.min',
          content: `\`\`\`js
Math.max(1, 3, 2)    // 3
Math.min(1, 3, 2)    // 1

// 不傳參數的特殊行為（陷阱！）
Math.max()           // -Infinity（數學意義上的最大單位元）
Math.min()           // Infinity

// 傳入陣列要用展開運算子
const arr = [1, 2, 3]
Math.max(...arr)     // 3
Math.max(arr)        // NaN（不展開直接傳陣列會是 NaN！）

// 替代寫法
Math.max.apply(null, arr)   // 3（舊寫法）
\`\`\``,
        },
        {
          heading: 'Math.pow / Math.sqrt / Math.cbrt',
          content: `\`\`\`js
// Math.pow — 次方
Math.pow(2, 10)      // 1024（2 的 10 次方）
Math.pow(9, 0.5)     // 3（等同於開平方根）
2 ** 10              // 1024（ES7 的冪運算子，更推薦）

// Math.sqrt — 平方根
Math.sqrt(9)         // 3
Math.sqrt(2)         // 1.4142135623730951
Math.sqrt(-1)        // NaN（負數沒有實數平方根）

// Math.cbrt — 立方根（ES6）
Math.cbrt(27)        // 3
Math.cbrt(-8)        // -2（立方根可以有負數）
Math.cbrt(8)         // 2
\`\`\``,
        },
        {
          heading: '其他進階方法',
          content: `\`\`\`js
Math.log(Math.E)     // 1（自然對數）
Math.log2(8)         // 3（以 2 為底的對數）
Math.log10(1000)     // 3（以 10 為底的對數）

Math.hypot(3, 4)     // 5（計算各參數平方和的平方根）
// 等同於 Math.sqrt(3*3 + 4*4) = Math.sqrt(25) = 5
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: 'Math.max() 不傳任何參數時，回傳什麼？',
        options: ['0', 'NaN', '-Infinity', 'Infinity'],
        answer: 2,
        explanation: 'Math.max() 不傳參數回傳 -Infinity，這是數學上正確的：空集合的最大值是負無窮。同理 Math.min() 回傳 Infinity。',
      },
      {
        id: 2,
        question: `Math.max([1, 2, 3]) 的結果是？`,
        options: ['3', '1', 'NaN', '-Infinity'],
        answer: 2,
        explanation: 'Math.max 接受的是逗號分隔的參數，不是陣列。傳入陣列 [1,2,3] 會先轉字串再轉數字，結果是 NaN。必須用 Math.max(...arr) 展開。',
      },
      {
        id: 3,
        question: 'Math.sqrt(-1) 的結果是？',
        options: ['-1', '1', 'NaN', '拋出 RangeError'],
        answer: 2,
        explanation: '負數在實數範圍內沒有平方根，Math.sqrt(-1) 回傳 NaN（複數需要用其他函式庫）。',
      },
      {
        id: 4,
        question: 'Math.cbrt(-8) 的結果是？',
        options: ['NaN', '2', '-2', '拋出 TypeError'],
        answer: 2,
        explanation: '立方根可以有負數，-8 的立方根是 -2（因為 (-2)³ = -8）。這點和平方根不同。',
      },
      {
        id: 5,
        question: '以下哪個方式可以正確取得陣列中的最大值？',
        options: [
          'Math.max([1, 5, 3])',
          'Math.max.apply(null, [1, 5, 3])',
          'Math.max(1, 5, 3)',
          '以上 B 和 C 都可以',
        ],
        answer: 3,
        explanation: 'Math.max.apply(null, arr) 和 Math.max(...arr)（展開）都可以正確取得陣列最大值。Math.max([1,5,3]) 不展開則回傳 NaN。',
      },
      {
        id: 6,
        question: 'Math.min() 不傳任何參數時，回傳什麼？',
        options: ['0', 'NaN', '-Infinity', 'Infinity'],
        answer: 3,
        explanation: 'Math.min() 不傳參數回傳 Infinity，數學上空集合的最小值是正無窮。這和 Math.max() 回傳 -Infinity 是對稱的。',
      },
    ],
    keyPoints: [
      'Math.max() 不傳參數回傳 -Infinity，Math.min() 回傳 Infinity',
      'Math.max([1,2,3]) 直接傳陣列回傳 NaN，必須用展開：Math.max(...arr)',
      'Math.sqrt(-1) 回傳 NaN，負數沒有實數平方根',
      'Math.cbrt(-8) 回傳 -2，立方根可以是負數',
      '次方推薦用 ** 運算子（ES7），比 Math.pow 更簡潔',
      'Math.hypot(3, 4) 計算各參數平方和的平方根，等同畢氏定理',
    ],
  },

  // ─── 精度問題 ────────────────────────────────────────────
  {
    slug: 'num-precision',
    title: '浮點數精度問題',
    description: '0.1 + 0.2 !== 0.3 的原因與正確解法',
    subCategory: '精度問題',
    difficulty: 'hard',
    notes: {
      sections: [
        {
          heading: '為什麼 0.1 + 0.2 !== 0.3？',
          content: `JavaScript 使用 **IEEE 754 雙精度浮點數**（64 位元）儲存所有數字。

大多數小數在二進位中是**無限循環小數**，無法精確表示，只能近似儲存。

\`\`\`js
0.1 + 0.2
// 0.30000000000000004（不是 0.3！）

0.1 + 0.2 === 0.3   // false
0.1 + 0.7           // 0.7999999999999999

// 查看實際儲存值
(0.1).toPrecision(20)
// "0.10000000000000000555"
\`\`\``,
        },
        {
          heading: '解決方案',
          content: `**方法一：toFixed + 字串比較**
\`\`\`js
(0.1 + 0.2).toFixed(1) === '0.3'   // true
// 但 toFixed 本身也有精度問題，需謹慎
\`\`\`

**方法二：Number.EPSILON（推薦）**
\`\`\`js
// Number.EPSILON ≈ 2.22e-16（機器精度）
Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON
// true（差值小於機器精度即視為相等）

function isEqual(a, b) {
  return Math.abs(a - b) < Number.EPSILON
}
\`\`\`

**方法三：乘以倍數再計算**
\`\`\`js
// 把小數轉為整數計算，避免精度問題
(0.1 * 10 + 0.2 * 10) / 10   // 0.3（精確）
(1 + 2) / 10                  // 0.3

// 通用函式
function add(a, b) {
  const factor = Math.pow(10, 10)
  return Math.round((a + b) * factor) / factor
}
\`\`\`

**方法四：使用第三方函式庫**
- \`decimal.js\`、\`big.js\` 等提供精確的十進位運算`,
        },
        {
          heading: 'Number.EPSILON 和安全整數',
          content: `\`\`\`js
Number.EPSILON              // 2.220446049250313e-16
// 相鄰兩個 64 位元浮點數之間的差值

Number.MAX_SAFE_INTEGER     // 9007199254740991（2^53 - 1）
Number.MIN_SAFE_INTEGER     // -9007199254740991

// 超出安全整數範圍
9007199254740992 === 9007199254740993   // true（精度丟失！）

Number.isSafeInteger(9007199254740991)  // true
Number.isSafeInteger(9007199254740992)  // false
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: '0.1 + 0.2 === 0.3 的結果是？',
        options: ['true', 'false', 'NaN', '取決於瀏覽器'],
        answer: 1,
        explanation: '由於 IEEE 754 浮點數精度問題，0.1 + 0.2 實際上是 0.30000000000000004，不等於 0.3，所以結果是 false。',
      },
      {
        id: 2,
        question: '以下哪個方式可以正確比較 0.1 + 0.2 是否等於 0.3？',
        options: [
          '0.1 + 0.2 === 0.3',
          'Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON',
          '(0.1 + 0.2).toString() === 0.3.toString()',
          '0.1 + 0.2 == 0.3',
        ],
        answer: 1,
        explanation: '使用 Number.EPSILON（機器精度）作為容差比較，差值小於 EPSILON 則視為相等，這是最推薦的方式。',
      },
      {
        id: 3,
        question: 'JavaScript 數字使用什麼格式儲存？',
        options: [
          'IEEE 754 單精度浮點數（32 位元）',
          'IEEE 754 雙精度浮點數（64 位元）',
          '十進位固定精度',
          'BigInt 格式',
        ],
        answer: 1,
        explanation: 'JavaScript 的 number 型別使用 IEEE 754 雙精度浮點數（64 位元）儲存，這是精度問題的根源。',
      },
      {
        id: 4,
        question: 'Number.MAX_SAFE_INTEGER 的值是多少，超出後會發生什麼？',
        options: [
          '2^32 - 1，超出後拋出 RangeError',
          '2^53 - 1，超出後整數運算可能失去精度',
          '2^64 - 1，超出後回傳 Infinity',
          '2^31 - 1，超出後回傳 NaN',
        ],
        answer: 1,
        explanation: 'Number.MAX_SAFE_INTEGER 是 2^53 - 1 = 9007199254740991，超出此範圍不會報錯，但整數運算可能失去精度，如 9007199254740992 === 9007199254740993 為 true。',
      },
      {
        id: 5,
        question: '用乘以倍數的方式計算 0.1 + 0.2，正確的寫法是？',
        options: [
          '(0.1 + 0.2) * 10',
          '(0.1 * 10 + 0.2 * 10) / 10',
          'Math.round(0.1 + 0.2)',
          'parseInt(0.1) + parseInt(0.2)',
        ],
        answer: 1,
        explanation: '將小數轉為整數（乘以 10）後計算，再除回（除以 10），避免在小數運算時累積誤差。結果為 (1 + 2) / 10 = 0.3。',
      },
      {
        id: 6,
        question: 'Number.EPSILON 代表什麼？',
        options: [
          '最大的有限數',
          '最小的正整數',
          '相鄰兩個雙精度浮點數之間的最小差值（機器精度）',
          '無限小的數，等同於數學中的 ε',
        ],
        answer: 2,
        explanation: 'Number.EPSILON 約為 2.22e-16，是 1 和大於 1 的最小浮點數之間的差，常用作比較浮點數時的容差閾值。',
      },
    ],
    keyPoints: [
      '0.1 + 0.2 不等於 0.3，因為 IEEE 754 雙精度浮點數無法精確表示大多數小數',
      '比較浮點數相等推薦用 Math.abs(a - b) < Number.EPSILON',
      '乘以倍數轉整數計算再除回，可避免小數精度誤差',
      'Number.MAX_SAFE_INTEGER 是 2^53 - 1，超出此範圍整數運算可能失去精度',
      'Number.EPSILON 約為 2.22e-16，是機器精度，用作浮點比較的容差',
      'toFixed 本身也有精度問題，(1.005).toFixed(2) 可能回傳 "1.00" 不是 "1.01"',
    ],
  },
]
