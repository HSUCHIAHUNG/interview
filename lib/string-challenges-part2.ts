import type { MethodEntry } from './array-challenges'

export const stringChallengesPart2: MethodEntry[] = [
  // ─── str-substring ────────────────────────────────────────────────────────
  {
    slug: 'str-substring',
    methodName: 'substring()',
    title: 'String.substring()',
    description: '擷取字串中指定範圍的子字串，負數參數會被視為 0。',
    subCategory: '擷取與切割',
    difficulty: 'easy',
    notes: {
      title: 'String.substring()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`str.substring(indexStart[, indexEnd])\`

- 回傳：從 \`indexStart\` 到 \`indexEnd\`（不含）的子字串。
- 若省略 \`indexEnd\`，則擷取到字串結尾。
- 若 \`indexStart > indexEnd\`，兩者會**自動對調**。
- **負數**參數一律視為 \`0\`。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const str = 'Hello, World!'

str.substring(0, 5)   // 'Hello'
str.substring(7)      // 'World!'
str.substring(7, 12)  // 'World'

// 負數視為 0
str.substring(-3, 5)  // 'Hello'（等同 substring(0, 5)）

// start > end → 自動對調
str.substring(5, 0)   // 'Hello'（等同 substring(0, 5)）
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- \`substring\` 與 \`slice\` 最大差異：**負數處理方式不同**。
  - \`slice(-3)\` → 從倒數第 3 個字元開始
  - \`substring(-3)\` → 視為 \`substring(0)\`
- 若需要負數索引，請使用 \`slice()\`。
- \`substring\` 不接受負數的設計有時會造成難以察覺的 Bug，要特別留意。`,
        },
      ],
    },
    keyPoints: [
      'substring 用來擷取字串中某個範圍的子字串，第一個參數是起始索引，第二個是結束索引（不含）。',
      '最重要的特性是：substring 遇到負數參數時，會自動把它當成 0，這和 slice 的行為完全不同。',
      '如果起始索引比結束索引大，substring 會自動把兩者對調，而 slice 在這種情況下會回傳空字串。',
      '常見用法是搭配 indexOf 找到分隔符的位置，再用 substring 切出想要的部分，例如從 email 取出 username。',
      '當你需要用負數索引從字串結尾往回算時，要選用 slice 而不是 substring。',
    ],
    problems: [
      {
        id: 'basic',
        title: '從 Email 取出使用者名稱',
        difficulty: 'easy',
        description: `使用者註冊後，系統要從 Email 地址中擷取 \`@\` 前的使用者名稱，用於顯示歡迎訊息。

請使用 \`indexOf()\` 找出 \`@\` 的位置，再用 \`substring()\` 擷取使用者名稱，存到 \`username\`。`,
        examples: [
          { input: `'john.doe@example.com'`, output: `'john.doe'` },
        ],
        initialCode: `const email = 'john.doe@example.com'

// 步驟 1：用 indexOf 找出 '@' 的位置
// 步驟 2：用 substring 擷取 '@' 前的部分
let username
`,
        testCases: [
          { label: 'username 應為 "john.doe"', test: `return username === 'john.doe'` },
          { label: 'username 不應包含 "@"', test: `return typeof username === 'string' && !username.includes('@')` },
          { label: 'username 長度應為 8', test: `return username.length === 8` },
        ],
      },
      {
        id: 'vs-slice',
        title: '觀察負數參數行為差異',
        difficulty: 'medium',
        description: `\`substring()\` 和 \`slice()\` 對**負數參數**的處理方式不同：
- \`substring(-3, 5)\` → 負數視為 \`0\`，等同 \`substring(0, 5)\`
- \`slice(-3)\` → 從倒數第 3 個字元開始

請根據以下字串，分別使用 \`substring\` 和 \`slice\` 擷取指定範圍：

1. 使用 \`substring(-4, 5)\` 擷取 \`str\`，存到 \`resultSub\`
2. 使用 \`slice(-4)\` 擷取 \`str\`，存到 \`resultSlice\`

觀察兩者結果的差異。`,
        examples: [
          {
            input: `str = 'frontend'`,
            output: `resultSub = 'front'，resultSlice = 'tend'`,
            note: 'substring 把 -4 當 0；slice -4 從倒數第 4 個字元開始',
          },
        ],
        initialCode: `const str = 'frontend'

// 步驟 1：使用 substring(-4, 5)，負數視為 0
let resultSub

// 步驟 2：使用 slice(-4)，從倒數第 4 個字元開始
let resultSlice
`,
        testCases: [
          { label: 'resultSub 應為 "front"（substring 把 -4 當 0）', test: `return resultSub === 'front'` },
          { label: 'resultSlice 應為 "tend"（slice 從倒數第 4 個字元）', test: `return resultSlice === 'tend'` },
          { label: 'resultSub 與 resultSlice 應不同', test: `return resultSub !== resultSlice` },
        ],
      },
      {
        id: 'domain',
        title: '從 URL 擷取域名',
        difficulty: 'medium',
        description: `後端 API 回傳完整 URL，前端需要擷取域名部分（不含協定與路徑），用於顯示來源網站。

請使用 \`indexOf()\` 搭配 \`substring()\` 完成：
1. 找出 \`'//'\` 的結束位置（即域名起始位置）
2. 找出域名後第一個 \`'/'\` 的位置（即域名結束位置）
3. 擷取中間的域名，存到 \`domain\``,
        examples: [
          {
            input: `'https://www.example.com/products/123'`,
            output: `'www.example.com'`,
          },
        ],
        initialCode: `const url = 'https://www.example.com/products/123'

// 步驟 1：找出 '//' 之後的起始位置（'//' 的 index + 2）
// 步驟 2：從起始位置開始，找到下一個 '/' 的位置
// 步驟 3：使用 substring 擷取域名
let domain
`,
        testCases: [
          { label: 'domain 應為 "www.example.com"', test: `return domain === 'www.example.com'` },
          { label: 'domain 不應包含 "https://"', test: `return typeof domain === 'string' && !domain.includes('://')` },
          { label: 'domain 不應包含路徑（"/"）', test: `return typeof domain === 'string' && !domain.includes('/')` },
          { label: 'domain 長度應為 15', test: `return domain.length === 15` },
        ],
      },
    ],
  },

  // ─── str-split ────────────────────────────────────────────────────────────
  {
    slug: 'str-split',
    methodName: 'split()',
    title: 'String.split()',
    description: '依照分隔符將字串切割成陣列，是字串轉陣列的核心方法。',
    subCategory: '擷取與切割',
    difficulty: 'easy',
    notes: {
      title: 'String.split()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`str.split([separator[, limit]])\`

- 回傳：**字串陣列**（Array of strings）。
- 若省略 \`separator\`，回傳包含整個字串的陣列 \`[str]\`。
- 若 \`separator\` 為空字串 \`''\`，則切成逐字元陣列。
- \`limit\`（選填）：限制回傳的陣列長度。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
'a,b,c'.split(',')       // ['a', 'b', 'c']
'hello'.split('')        // ['h', 'e', 'l', 'l', 'o']
'one two three'.split(' ')  // ['one', 'two', 'three']

// 限制筆數
'a,b,c,d'.split(',', 2)  // ['a', 'b']

// 常見組合：split + reverse + join 反轉字串
'hello'.split('').reverse().join('')  // 'olleh'
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- \`split()\` **不修改原字串**，回傳新陣列。
- 以正規表達式作為分隔符時更有彈性：\`'a1b2c'.split(/\\d/)\` → \`['a', 'b', 'c']\`
- 若字串以分隔符開頭或結尾，陣列會出現空字串：\`',a,'.split(',')\` → \`['', 'a', '']\`
- 反轉句子的慣用寫法：\`str.split(' ').reverse().join(' ')\``,
        },
      ],
    },
    keyPoints: [
      'split 方法依照指定的分隔符，把字串切割成一個字串陣列，是字串轉陣列最常用的方式。',
      '傳入空字串 split("") 會把字串切成逐字元的陣列，常用於需要處理每個字元的場景。',
      'split 不會修改原字串，它會回傳一個全新的陣列。',
      '搭配 reverse 和 join 是反轉單詞順序或字元順序的經典組合，面試常考。',
      '如果分隔符出現在字串開頭或結尾，回傳的陣列會包含空字串，處理時要注意過濾。',
      '可以傳入第二個參數 limit 來限制回傳的陣列長度，超過的部分會被截掉。',
    ],
    problems: [
      {
        id: 'basic',
        title: 'CSV 資料解析',
        difficulty: 'easy',
        description: `後端回傳 CSV 格式的商品標籤字串，前端需要將其解析成陣列，以便渲染標籤列表。

請使用 \`split()\` 將 \`csvLine\` 以逗號 \`','\` 分割，存到 \`tags\`。`,
        examples: [
          {
            input: `'javascript,typescript,react,nextjs'`,
            output: `['javascript', 'typescript', 'react', 'nextjs']`,
          },
        ],
        initialCode: `const csvLine = 'javascript,typescript,react,nextjs'

// 使用 split 將 csvLine 以逗號分割成陣列
let tags
`,
        testCases: [
          { label: 'tags 應為陣列', test: `return Array.isArray(tags)` },
          { label: 'tags 應有 4 個元素', test: `return tags.length === 4` },
          { label: 'tags[0] 應為 "javascript"', test: `return tags[0] === 'javascript'` },
          { label: 'tags[3] 應為 "nextjs"', test: `return tags[3] === 'nextjs'` },
        ],
      },
      {
        id: 'words',
        title: '統計文章單詞數量',
        difficulty: 'easy',
        description: `部落格平台要在文章編輯器中顯示「已輸入幾個單詞」。

請使用 \`split()\` 以空格切割 \`sentence\`，統計單詞數量，存到 \`wordCount\`。`,
        examples: [
          {
            input: `'The quick brown fox jumps'`,
            output: `5`,
          },
        ],
        initialCode: `const sentence = 'The quick brown fox jumps over the lazy dog'

// 使用 split 分割後取 length，存到 wordCount
let wordCount
`,
        testCases: [
          { label: 'wordCount 應為 9', test: `return wordCount === 9` },
          { label: 'wordCount 應為 number 型別', test: `return typeof wordCount === 'number'` },
        ],
      },
      {
        id: 'reverse-words',
        title: '反轉句子中的單詞順序',
        difficulty: 'medium',
        description: `文字處理工具需要一個功能：把句子中的單詞順序**完全反轉**（不是反轉字元，而是反轉每個單詞的位置）。

請使用 \`split()\`、\`reverse()\`、\`join()\` 的組合，將 \`original\` 的單詞順序反轉，存到 \`reversed\`。`,
        examples: [
          {
            input: `'Hello World from Taiwan'`,
            output: `'Taiwan from World Hello'`,
          },
        ],
        constraints: ['必須使用 split + reverse + join 組合', '原始字串不應被修改'],
        initialCode: `const original = 'Hello World from Taiwan'

// 步驟 1：split 以空格切割
// 步驟 2：reverse 反轉陣列
// 步驟 3：join 以空格重新組合
let reversed
`,
        testCases: [
          { label: 'reversed 應為 "Taiwan from World Hello"', test: `return reversed === 'Taiwan from World Hello'` },
          { label: 'original 不應被修改', test: `return original === 'Hello World from Taiwan'` },
          { label: 'reversed 應為字串', test: `return typeof reversed === 'string'` },
          { label: 'reversed 單詞數應與原句相同', test: `return reversed.split(' ').length === original.split(' ').length` },
        ],
      },
    ],
  },

  // ─── str-case ─────────────────────────────────────────────────────────────
  {
    slug: 'str-case',
    methodName: 'toUpperCase() / toLowerCase()',
    title: 'toUpperCase() / toLowerCase()',
    description: '將字串轉換為全大寫或全小寫，常用於大小寫不敏感的比對與格式化。',
    subCategory: '轉換與格式化',
    difficulty: 'easy',
    notes: {
      title: 'toUpperCase() / toLowerCase()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`str.toUpperCase()\`
\`str.toLowerCase()\`

- 回傳：**新字串**，原字串不受影響。
- \`toUpperCase()\`：將所有字母轉為大寫。
- \`toLowerCase()\`：將所有字母轉為小寫。
- 非字母字元（數字、符號）不受影響。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
'Hello World'.toUpperCase()  // 'HELLO WORLD'
'Hello World'.toLowerCase()  // 'hello world'

// 大小寫不敏感比對
const a = 'JavaScript'
const b = 'javascript'
a.toLowerCase() === b.toLowerCase()  // true

// 首字母大寫
const word = 'hello'
word.charAt(0).toUpperCase() + word.slice(1)  // 'Hello'
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- 兩個方法都**不修改原字串**，回傳新字串。
- 首字母大寫的慣用寫法：\`word.charAt(0).toUpperCase() + word.slice(1)\`
- Title Case（每個單詞首字母大寫）需搭配 \`split + map + join\`。
- 在比對使用者輸入時，統一轉為小寫再比對，可避免大小寫造成的誤判。`,
        },
      ],
    },
    keyPoints: [
      'toUpperCase 和 toLowerCase 分別把字串所有字母轉成大寫或小寫，都不修改原字串。',
      '最常見的用途是大小寫不敏感的字串比對：把兩個字串都轉成小寫後再比較，確保結果不受輸入格式影響。',
      '用於標準化使用者輸入，例如把 Email 統一轉小寫存入資料庫，避免同一個信箱因大小寫不同被視為兩個帳號。',
      '首字母大寫的慣用技巧是 charAt(0).toUpperCase() 加上 slice(1) 取剩餘部分。',
      'Title Case 需要把字串先 split 成單詞陣列，再用 map 對每個單詞做首字母大寫，最後 join 回來。',
    ],
    problems: [
      {
        id: 'basic',
        title: '標準化 Email 輸入',
        difficulty: 'easy',
        description: `使用者在表單輸入 Email 時，可能會混用大小寫（例如 \`John.Doe@Example.COM\`）。
為了確保資料庫的一致性，系統需要在儲存前將 Email 統一轉為**小寫**。

請使用 \`toLowerCase()\` 將 \`rawEmail\` 轉換，存到 \`normalizedEmail\`。`,
        examples: [
          { input: `'John.Doe@Example.COM'`, output: `'john.doe@example.com'` },
        ],
        initialCode: `const rawEmail = 'John.Doe@Example.COM'

// 將 rawEmail 統一轉為小寫，存到 normalizedEmail
let normalizedEmail
`,
        testCases: [
          { label: 'normalizedEmail 應為全小寫', test: `return normalizedEmail === 'john.doe@example.com'` },
          { label: 'normalizedEmail 應不含大寫字母', test: `return normalizedEmail === normalizedEmail.toLowerCase()` },
          { label: 'rawEmail 原值不應被修改', test: `return rawEmail === 'John.Doe@Example.COM'` },
        ],
      },
      {
        id: 'compare',
        title: '大小寫不敏感的搜尋比對',
        difficulty: 'easy',
        description: `電商平台的搜尋功能需要忽略大小寫，讓使用者輸入 \`'REACT'\`、\`'React'\` 或 \`'react'\` 都能找到同一個商品。

請比較 \`userInput\` 與 \`productName\` 是否**大小寫不敏感地相等**，將結果（\`true\` 或 \`false\`）存到 \`isMatch\`。`,
        examples: [
          { input: `userInput = 'TYPESCRIPT', productName = 'TypeScript'`, output: `true` },
        ],
        initialCode: `const userInput = 'TYPESCRIPT'
const productName = 'TypeScript'

// 忽略大小寫，判斷兩者是否相等，存到 isMatch
let isMatch
`,
        testCases: [
          { label: 'isMatch 應為 true', test: `return isMatch === true` },
          { label: 'isMatch 應為 boolean 型別', test: `return typeof isMatch === 'boolean'` },
          { label: '不同單詞比對應為 false', test: `return 'React'.toLowerCase() !== 'Vue'.toLowerCase()` },
        ],
      },
      {
        id: 'capitalize',
        title: '實作 Title Case 標題格式化',
        difficulty: 'medium',
        description: `部落格系統要將文章標題格式化成 Title Case（每個單詞首字母大寫、其餘小寫），確保顯示風格一致。

例如：\`'the quick brown fox'\` → \`'The Quick Brown Fox'\`

請使用 \`split()\`、\`map()\`、\`charAt()\`、\`toUpperCase()\`、\`slice()\`、\`join()\` 組合完成，結果存到 \`titleCase\`。`,
        examples: [
          { input: `'the quick brown fox'`, output: `'The Quick Brown Fox'` },
          { input: `'hello world from taiwan'`, output: `'Hello World From Taiwan'` },
        ],
        constraints: ['每個單詞的首字母大寫，其餘字母小寫', '單詞之間的空格保持不變'],
        initialCode: `const title = 'the quick brown fox jumps over the lazy dog'

// 步驟 1：split 以空格切割成單詞陣列
// 步驟 2：map 每個單詞 → 首字母 toUpperCase + 其餘 toLowerCase
// 步驟 3：join 以空格組合回字串
let titleCase
`,
        testCases: [
          {
            label: 'titleCase 應為正確的 Title Case',
            test: `return titleCase === 'The Quick Brown Fox Jumps Over The Lazy Dog'`,
          },
          {
            label: '每個單詞首字母應為大寫',
            test: `return titleCase.split(' ').every(w => w[0] === w[0].toUpperCase())`,
          },
          {
            label: '每個單詞非首字母應為小寫',
            test: `return titleCase.split(' ').every(w => w.slice(1) === w.slice(1).toLowerCase())`,
          },
          { label: 'titleCase 應為字串', test: `return typeof titleCase === 'string'` },
        ],
      },
    ],
  },

  // ─── str-trim ─────────────────────────────────────────────────────────────
  {
    slug: 'str-trim',
    methodName: 'trim() / trimStart() / trimEnd()',
    title: 'trim() / trimStart() / trimEnd()',
    description: '移除字串開頭和/或結尾的空白字元，是表單驗證和資料清理的常用工具。',
    subCategory: '轉換與格式化',
    difficulty: 'easy',
    notes: {
      title: 'trim() / trimStart() / trimEnd()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`str.trim()\`        → 移除**前後**所有空白
\`str.trimStart()\`   → 只移除**開頭**空白（又稱 \`trimLeft()\`）
\`str.trimEnd()\`     → 只移除**結尾**空白（又稱 \`trimRight()\`）

- 回傳：**新字串**，原字串不受影響。
- 空白包含：空格、Tab（\`\\t\`）、換行（\`\\n\`）、回車（\`\\r\`）等。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const str = '  Hello World  '

str.trim()       // 'Hello World'
str.trimStart()  // 'Hello World  '（保留尾部空白）
str.trimEnd()    // '  Hello World'（保留開頭空白）

// 表單驗證常見寫法
const input = '  '
input.trim().length === 0  // true → 判斷為空輸入

// 多行 log 清理
const log = '  [INFO] Server started  '
log.trimStart().trimEnd()  // '[INFO] Server started'
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- 三個方法都**不修改原字串**，回傳新字串。
- \`trim()\` 等同 \`trimStart().trimEnd()\`，通常直接用 \`trim()\` 即可。
- 只清除首尾空白，**字串中間**的空白不受影響。
- 表單送出前建議先 trim 再驗證，避免使用者「只輸入空格」通過驗證。
- \`trimLeft\` / \`trimRight\` 是舊版別名，現代程式碼建議用 \`trimStart\` / \`trimEnd\`。`,
        },
      ],
    },
    keyPoints: [
      'trim 方法移除字串開頭和結尾的所有空白字元，包括空格、Tab 和換行，但不影響中間的空白。',
      'trimStart 只移除開頭的空白，trimEnd 只移除結尾的空白，在格式化輸出時很有用。',
      '三個方法都不修改原字串，而是回傳新字串。',
      '表單驗證最常見的用法是 input.trim().length === 0 來判斷使用者是否只輸入了空白。',
      '處理多行文字時，常搭配 split 按行切割，再對每行分別 trimStart 或 trimEnd，最後 join 回來。',
      'trimLeft 和 trimRight 是 trimStart 和 trimEnd 的舊版別名，現代開發建議使用新名稱。',
    ],
    problems: [
      {
        id: 'basic',
        title: '清除表單輸入的前後空白',
        difficulty: 'easy',
        description: `使用者在登入表單輸入帳號時，常不小心在前後多打空白（例如複製貼上時）。
後端比對帳號前，前端需要先清理輸入值。

請使用 \`trim()\` 清除 \`rawUsername\` 的前後空白，存到 \`cleanUsername\`。`,
        examples: [
          { input: `'  alice_wonder  '`, output: `'alice_wonder'` },
        ],
        initialCode: `const rawUsername = '  alice_wonder  '

// 使用 trim() 清除前後空白，存到 cleanUsername
let cleanUsername
`,
        testCases: [
          { label: 'cleanUsername 應為 "alice_wonder"', test: `return cleanUsername === 'alice_wonder'` },
          { label: 'cleanUsername 不應有前導空白', test: `return cleanUsername[0] !== ' '` },
          { label: 'cleanUsername 不應有尾部空白', test: `return cleanUsername[cleanUsername.length - 1] !== ' '` },
          { label: 'rawUsername 原值不應被修改', test: `return rawUsername === '  alice_wonder  '` },
        ],
      },
      {
        id: 'validate',
        title: '驗證輸入欄位不得為空白',
        difficulty: 'easy',
        description: `評論表單需要驗證使用者輸入是否有效：輸入只有空白字元應視為無效（等同空輸入）。

請使用 \`trim()\` 判斷 \`commentInput\` 是否為有效輸入（trim 後 length > 0），
將結果存到 \`isValid\`（\`true\` 代表有效，\`false\` 代表無效）。`,
        examples: [
          { input: `'   '`, output: `false（只有空白，視為無效）` },
          { input: `'  Great post!  '`, output: `true（有實際內容）` },
        ],
        initialCode: `const commentInput = '   '

// 使用 trim() 後判斷 length，若 > 0 則為有效輸入
let isValid
`,
        testCases: [
          { label: 'isValid 應為 false（輸入只有空白）', test: `return isValid === false` },
          { label: 'isValid 應為 boolean 型別', test: `return typeof isValid === 'boolean'` },
          {
            label: '有實際內容的輸入應為 true',
            test: `const input2 = '  Great post!  '; return input2.trim().length > 0 === true`,
          },
        ],
      },
      {
        id: 'format-log',
        title: '格式化多行 Log 訊息',
        difficulty: 'medium',
        description: `伺服器日誌系統收到的 Log 字串，每行前可能有縮排空白（來自不同模組的格式），行尾也可能有多餘空格。
需要清理每一行的前後空白，讓 Log 儲存前保持整齊格式。

請使用 \`split('\n')\` 將多行 \`rawLog\` 分割，對每行使用 \`trimStart()\` 去掉縮排、\`trimEnd()\` 去掉行尾空白，
最後用 \`join('\n')\` 組合，存到 \`cleanLog\`。`,
        examples: [
          {
            input: `'  [INFO] App started  \\n    [WARN] Memory high  \\n  [ERROR] Timeout  '`,
            output: `'[INFO] App started\\n[WARN] Memory high\\n[ERROR] Timeout'`,
          },
        ],
        constraints: ['每行都需要同時 trimStart 和 trimEnd', '使用 split + map + join 組合'],
        initialCode: `const rawLog = '  [INFO] App started  \n    [WARN] Memory high  \n  [ERROR] Timeout  '

// 步驟 1：split('\n') 切成行陣列
// 步驟 2：map 每行 → trimStart() 去縮排，trimEnd() 去行尾空白
// 步驟 3：join('\n') 組合回多行字串
let cleanLog
`,
        testCases: [
          {
            label: 'cleanLog 第一行應為 "[INFO] App started"',
            test: `return cleanLog.split('\\n')[0] === '[INFO] App started'`,
          },
          {
            label: 'cleanLog 第二行應為 "[WARN] Memory high"',
            test: `return cleanLog.split('\\n')[1] === '[WARN] Memory high'`,
          },
          {
            label: 'cleanLog 第三行應為 "[ERROR] Timeout"',
            test: `return cleanLog.split('\\n')[2] === '[ERROR] Timeout'`,
          },
          {
            label: 'cleanLog 應有 3 行',
            test: `return cleanLog.split('\\n').length === 3`,
          },
        ],
      },
    ],
  },
]
