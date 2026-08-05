import type { MethodEntry } from './array-challenges'

export const stringChallengesPart1: MethodEntry[] = [
  // ─── str-indexof ──────────────────────────────────────────────────────────
  {
    slug: 'str-indexof',
    methodName: 'indexOf() / lastIndexOf()',
    title: 'String.indexOf() / lastIndexOf()',
    description: '搜尋子字串在字串中的位置，找不到時回傳 -1。',
    subCategory: '搜尋與判斷',
    difficulty: 'easy',
    notes: {
      title: 'indexOf() / lastIndexOf()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`str.indexOf(searchValue[, fromIndex])\`
\`str.lastIndexOf(searchValue[, fromIndex])\`

- 回傳：符合子字串的**起始索引**（number）；找不到回傳 **-1**。
- \`indexOf\`：從左到右，找到**第一個**符合的位置。
- \`lastIndexOf\`：從右到左，找到**最後一個**符合的位置。
- \`fromIndex\`：指定開始搜尋的位置（選填）。
- 兩者皆**區分大小寫**。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const s = 'hello world hello'

s.indexOf('hello')        // 0
s.indexOf('hello', 1)     // 12  (從索引 1 開始找)
s.lastIndexOf('hello')    // 12  (最後一個出現的位置)
s.indexOf('xyz')          // -1  (找不到)

// 判斷是否存在
if (s.indexOf('world') !== -1) {
  console.log('找到了')
}

// 配合 slice 截取最後一個分隔符之後的內容
const path = '/user/profile/edit'
const last = path.lastIndexOf('/')
path.slice(last + 1)  // 'edit'
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- 回傳值是**數字**，不是布林，不可直接 \`if (str.indexOf(x))\`（索引 0 會被視為 falsy）。
- 正確的判斷方式：\`str.indexOf(x) !== -1\` 或 \`str.indexOf(x) >= 0\`。
- 若只需判斷「是否存在」，現代寫法建議改用 \`includes()\`，語義更清晰。
- \`fromIndex\` 若大於等於字串長度，\`indexOf\` 直接回傳 -1；\`lastIndexOf\` 若小於 0，視為 0。`,
        },
      ],
    },
    keyPoints: [
      'indexOf 從左往右找第一個符合的子字串，回傳起始索引，找不到回傳 -1，注意回傳值是數字不是布林。',
      'lastIndexOf 從右往左找最後一個符合的子字串，同樣找不到回傳 -1。',
      '兩者都區分大小寫，大寫 H 和小寫 h 會被視為不同字元。',
      '判斷是否存在時，不能直接 if(str.indexOf(x))，因為索引 0 是 falsy，要寫成 !== -1 或 >= 0。',
      'lastIndexOf 常見用途是找到路徑或 URL 中最後一個斜線的位置，再配合 slice 截取檔名或路由片段。',
      '若只需要知道「存不存在」而不需要位置，優先使用 includes()，語義更直觀。',
    ],
    problems: [
      {
        id: 'basic',
        title: '訂單追蹤：找出關鍵字位置',
        difficulty: 'easy',
        description: `電商後台需要分析使用者的搜尋紀錄，找出關鍵字在搜尋字串中的位置。

請使用 \`indexOf()\` 在 \`searchLog\` 中找出 \`'退款'\` 第一次出現的索引，存到 \`pos\`。
接著判斷是否找到（\`pos !== -1\`），將結果（boolean）存到 \`found\`。`,
        examples: [
          {
            input: `searchLog = '用戶申請退款，原因：商品損壞，請確認退款流程'`,
            output: `pos === 4，found === true`,
          },
        ],
        initialCode: `const searchLog = '用戶申請退款，原因：商品損壞，請確認退款流程'

// TODO: 用 indexOf() 找出 '退款' 第一次出現的索引
let pos

// TODO: 判斷是否找到，存到 found（boolean）
let found
`,
        testCases: [
          { label: 'pos 應為 4', test: `return pos === 4` },
          { label: 'found 應為 true', test: `return found === true` },
          { label: 'found 應是 boolean 型別', test: `return typeof found === 'boolean'` },
        ],
      },
      {
        id: 'not-found',
        title: '帳號安全：偵測非法字元',
        difficulty: 'easy',
        description: `帳號驗證系統需要確認使用者名稱中**不包含**特殊字元 \`'@'\` 與 \`'#'\`。

請使用 \`indexOf()\` 分別搜尋 \`username\` 中的 \`'@'\` 和 \`'#'\`，
- 將 \`'@'\` 的搜尋結果存到 \`atPos\`
- 將 \`'#'\` 的搜尋結果存到 \`hashPos\`
- 若兩者**都**找不到（都是 -1），則將 \`isValid\` 設為 \`true\`，否則設為 \`false\`。`,
        examples: [
          {
            input: `username = 'john_doe_99'`,
            output: `atPos === -1，hashPos === -1，isValid === true`,
          },
          {
            input: `username = 'bad@user'`,
            output: `atPos === 3，isValid === false`,
          },
        ],
        initialCode: `const username = 'john_doe_99'

// TODO: 用 indexOf() 分別找 '@' 和 '#' 的位置
let atPos
let hashPos

// TODO: 若兩者都是 -1，isValid = true，否則 false
let isValid
`,
        testCases: [
          { label: 'atPos 應為 -1', test: `return atPos === -1` },
          { label: 'hashPos 應為 -1', test: `return hashPos === -1` },
          { label: 'isValid 應為 true', test: `return isValid === true` },
          {
            label: '含有 @ 時 isValid 應為 false',
            test: `const u = 'bad@user'; const a = u.indexOf('@'); const h = u.indexOf('#'); const v = a === -1 && h === -1; return v === false`,
          },
        ],
      },
      {
        id: 'lastindexof',
        title: '路由解析：取得最後一段路徑',
        difficulty: 'medium',
        description: `前端路由器需要從完整 URL 路徑中取得**最後一段**路徑名稱。

例如 \`'/admin/users/profile'\` → 取出 \`'profile'\`。

請完成以下步驟：
1. 使用 \`lastIndexOf('/')\` 找出 \`urlPath\` 中最後一個 \`'/'\` 的索引，存到 \`lastSlash\`。
2. 使用 \`slice()\` 截取最後一段，存到 \`segment\`（不包含斜線本身）。`,
        examples: [
          {
            input: `urlPath = '/admin/users/profile'`,
            output: `lastSlash === 12，segment === 'profile'`,
          },
        ],
        constraints: [
          '必須使用 lastIndexOf() 找位置',
          '必須使用 slice() 截取結果',
        ],
        initialCode: `const urlPath = '/admin/users/profile'

// TODO: 用 lastIndexOf('/') 找最後一個斜線的索引
let lastSlash

// TODO: 用 slice() 截取最後一段路徑，存到 segment
let segment
`,
        testCases: [
          { label: 'lastSlash 應為 12', test: `return lastSlash === 12` },
          { label: 'segment 應為 "profile"', test: `return segment === 'profile'` },
          {
            label: '深層路徑也能正確截取',
            test: `const p = '/a/b/c/d/page'; const ls = p.lastIndexOf('/'); const seg = p.slice(ls + 1); return seg === 'page'`,
          },
        ],
      },
      {
        id: 'from-index',
        title: '重複搜尋：找出第二次出現的位置',
        difficulty: 'medium',
        description: `文字編輯器的「全部取代」功能需要逐一找出關鍵字的每次出現位置。

給定字串 \`text\`，請：
1. 用 \`indexOf('apple')\` 找到第一次出現的位置，存到 \`first\`。
2. 以 \`first + 1\` 作為第二參數，再次呼叫 \`indexOf('apple', first + 1)\` 找第二次出現的位置，存到 \`second\`。`,
        examples: [
          {
            input: `text = 'apple, orange, apple, grape'`,
            output: `first === 0，second === 15`,
          },
        ],
        constraints: [
          '必須使用 indexOf 的第二個參數找第二次出現位置',
        ],
        initialCode: `const text = 'apple, orange, apple, grape'

// TODO: 找第一次出現 'apple' 的位置
let first

// TODO: 從 first + 1 開始，找第二次出現的位置
let second
`,
        testCases: [
          { label: 'first 應為 0', test: `return first === 0` },
          { label: 'second 應為 15', test: `return second === 15` },
          {
            label: '若只出現一次，第二次應為 -1',
            test: `const s = 'apple, orange, grape'; const f = s.indexOf('apple'); return s.indexOf('apple', f + 1) === -1`,
          },
        ],
      },
    ],
  },

  // ─── str-includes ─────────────────────────────────────────────────────────
  {
    slug: 'str-includes',
    methodName: 'includes()',
    title: 'String.includes()',
    description: '判斷字串是否包含指定子字串，回傳 boolean。',
    subCategory: '搜尋與判斷',
    difficulty: 'easy',
    notes: {
      title: 'includes()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`str.includes(searchString[, position])\`

- 回傳：**boolean**（\`true\` / \`false\`）。
- \`position\`：從哪個索引開始搜尋，預設為 0（選填）。
- 區分大小寫。
- ES2015（ES6）引入。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const s = 'Hello, World!'

s.includes('World')       // true
s.includes('world')       // false（區分大小寫）
s.includes('Hello')       // true
s.includes('xyz')         // false
s.includes('o', 9)        // false（從索引 9 開始找，找不到）

// 搭配陣列過濾
const words = ['apple', 'pineapple', 'orange']
words.filter(w => w.includes('apple'))
// ['apple', 'pineapple']
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- 回傳值是**布林**，可以直接用在 if 條件式中。
- 與 \`indexOf() !== -1\` 等效，但語義更清晰。
- 只需要「是否存在」時優先用 \`includes()\`；需要「位置」時用 \`indexOf()\`。
- 不支援正規表達式（RegExp），若需要，改用 \`test()\` 或 \`match()\`。`,
        },
      ],
    },
    keyPoints: [
      'includes 回傳 true 或 false，直接告訴你字串中有沒有包含指定的子字串。',
      '它是 ES6 引入的新方法，語義比 indexOf !== -1 更清晰，是現代 JavaScript 的推薦寫法。',
      'includes 也區分大小寫，大寫 A 和小寫 a 是不同的字元。',
      '第二個參數 position 可以指定從哪個索引開始搜尋，預設從 0 開始。',
      '當你需要知道子字串「存不存在」時用 includes，需要知道「在哪個位置」時才用 indexOf。',
      'includes 不接受正規表達式，若需要更複雜的搜尋邏輯，要改用 RegExp 的 test 方法。',
    ],
    problems: [
      {
        id: 'basic',
        title: '商品搜尋：判斷名稱是否含關鍵字',
        difficulty: 'easy',
        description: `電商平台的商品搜尋功能需要判斷商品名稱是否包含使用者輸入的關鍵字。

請使用 \`includes()\` 判斷 \`productName\` 是否包含 \`keyword\`，
將結果（boolean）存到 \`isMatch\`。`,
        examples: [
          {
            input: `productName = 'Apple AirPods Pro 第三代'，keyword = 'AirPods'`,
            output: `isMatch === true`,
          },
          {
            input: `productName = 'Samsung Galaxy S24'，keyword = 'iPhone'`,
            output: `isMatch === false`,
          },
        ],
        initialCode: `const productName = 'Apple AirPods Pro 第三代'
const keyword = 'AirPods'

// TODO: 用 includes() 判斷 productName 是否包含 keyword，結果存到 isMatch
let isMatch
`,
        testCases: [
          { label: 'isMatch 應為 true', test: `return isMatch === true` },
          { label: 'isMatch 應是 boolean 型別', test: `return typeof isMatch === 'boolean'` },
          {
            label: '關鍵字不存在時應回傳 false',
            test: `const p = 'Samsung Galaxy S24'; const k = 'iPhone'; const r = p.includes(k); return r === false`,
          },
          {
            label: '區分大小寫：大小寫不同應回傳 false',
            test: `const p = 'Apple AirPods Pro'; const r = p.includes('airpods'); return r === false`,
          },
        ],
      },
      {
        id: 'filter',
        title: '標籤過濾：找出含特定技術的職缺',
        difficulty: 'easy',
        description: `人力銀行平台需要從職缺列表中，篩選出描述包含指定技術關鍵字的職缺。

請使用 \`Array.filter()\` 搭配字串的 \`includes()\`，
從 \`jobListings\` 中篩選出 \`description\` 包含 \`'React'\` 的職缺，
將結果存到 \`reactJobs\`。`,
        examples: [
          {
            input: `jobListings 有 4 筆，其中 2 筆描述含 'React'`,
            output: `reactJobs.length === 2`,
          },
        ],
        initialCode: `const jobListings = [
  { id: 1, title: '前端工程師', description: '需熟悉 React 與 TypeScript' },
  { id: 2, title: '後端工程師', description: '使用 Node.js 與 Express 開發 API' },
  { id: 3, title: 'UI 工程師', description: '使用 React 與 CSS Modules 開發元件' },
  { id: 4, title: '全端工程師', description: '使用 Vue.js 與 Laravel 全端開發' },
]

// TODO: 用 filter() + includes() 篩選出 description 含 'React' 的職缺
let reactJobs
`,
        testCases: [
          { label: 'reactJobs 應有 2 筆', test: `return reactJobs.length === 2` },
          { label: 'reactJobs 每筆描述都應包含 "React"', test: `return reactJobs.every(j => j.description.includes('React'))` },
          { label: 'id 為 2 的後端職缺不應在結果中', test: `return reactJobs.every(j => j.id !== 2)` },
          { label: 'id 為 4 的 Vue 職缺不應在結果中', test: `return reactJobs.every(j => j.id !== 4)` },
        ],
      },
      {
        id: 'validate',
        title: '表單驗證：密碼強度檢查',
        difficulty: 'medium',
        description: `註冊頁面需要驗證密碼強度，規則如下：
- 必須包含至少一個數字（\`'0'\` 到 \`'9'\` 任一）
- 必須包含特殊字元（\`'!'\`、\`'@'\`、\`'#'\` 任一）
- 長度必須大於等於 8

請完成 \`checkPassword\` 函式，回傳一個物件：
\`\`\`
{ hasNumber: boolean, hasSpecial: boolean, isLongEnough: boolean, isValid: boolean }
\`\`\`
其中 \`isValid\` 為三個條件全部符合時才為 \`true\`。

**提示**：用 \`includes()\` 逐一檢查每個字元是否存在。`,
        examples: [
          {
            input: `password = 'MyPass1!'`,
            output: `{ hasNumber: true, hasSpecial: true, isLongEnough: true, isValid: true }`,
          },
          {
            input: `password = 'password'`,
            output: `{ hasNumber: false, hasSpecial: false, isLongEnough: true, isValid: false }`,
          },
        ],
        initialCode: `function checkPassword(password) {
  // TODO: 判斷是否包含數字（'0'~'9' 任一）
  const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  let hasNumber

  // TODO: 判斷是否包含特殊字元（'!'、'@'、'#' 任一）
  const specials = ['!', '@', '#']
  let hasSpecial

  // TODO: 判斷長度是否 >= 8
  let isLongEnough

  // TODO: 三個條件都符合才是 true
  let isValid

  return { hasNumber, hasSpecial, isLongEnough, isValid }
}
`,
        testCases: [
          {
            label: '"MyPass1!" 應全部通過驗證',
            test: `const r = checkPassword('MyPass1!'); return r.hasNumber === true && r.hasSpecial === true && r.isLongEnough === true && r.isValid === true`,
          },
          {
            label: '"password" 缺少數字與特殊字元',
            test: `const r = checkPassword('password'); return r.hasNumber === false && r.hasSpecial === false && r.isLongEnough === true && r.isValid === false`,
          },
          {
            label: '"Ab1!" 長度不足',
            test: `const r = checkPassword('Ab1!'); return r.isLongEnough === false && r.isValid === false`,
          },
          {
            label: '"Hello@World9" 應全部通過',
            test: `const r = checkPassword('Hello@World9'); return r.isValid === true`,
          },
        ],
      },
      {
        id: 'from-index',
        title: '搜尋紀錄分析：跳過已處理區段',
        difficulty: 'medium',
        description: `日誌分析系統每次只處理後半段的新日誌，需要從指定位置開始搜尋是否還有錯誤。

給定日誌字串 \`log\`，
1. 使用 \`includes('ERROR', 22)\` 判斷從索引 22 開始是否還有 \`'ERROR'\`，存到 \`hasMore\`。
2. 使用 \`includes('ERROR', 45)\` 判斷從索引 45 開始是否還有 \`'ERROR'\`，存到 \`noMore\`。`,
        examples: [
          {
            input: `log = 'ERROR: 404, INFO: ok, ERROR: 500, INFO: done'`,
            output: `hasMore === true，noMore === false`,
          },
        ],
        initialCode: `const log = 'ERROR: 404, INFO: ok, ERROR: 500, INFO: done'

// TODO: 從索引 22 開始判斷是否有 'ERROR'，存到 hasMore
let hasMore

// TODO: 從索引 45 開始判斷是否有 'ERROR'，存到 noMore
let noMore
`,
        testCases: [
          { label: 'hasMore 應為 true', test: `return hasMore === true` },
          { label: 'noMore 應為 false', test: `return noMore === false` },
          { label: 'hasMore 應是 boolean', test: `return typeof hasMore === 'boolean'` },
          {
            label: '從索引 5 開始仍能找到 ERROR',
            test: `const s = 'ERROR: 404, INFO: ok, ERROR: 500'; return s.includes('ERROR', 5) === true`,
          },
        ],
      },
      {
        id: 'case-sensitive',
        title: '帳號驗證：大小寫敏感比對',
        difficulty: 'medium',
        description: `使用者認證系統的帳號比對**嚴格區分大小寫**，\`'Admin'\` 和 \`'admin'\` 是完全不同的字串。

給定帳號 \`account\`，
1. 用 \`includes()\` 判斷是否包含 \`'Admin'\`（大寫 A），存到 \`hasAdmin\`。
2. 用 \`includes()\` 判斷是否包含 \`'admin'\`（小寫 a），存到 \`hasLower\`。`,
        examples: [
          {
            input: `account = 'AdminUser'`,
            output: `hasAdmin === true，hasLower === false`,
          },
        ],
        initialCode: `const account = 'AdminUser'

// TODO: 判斷是否包含 'Admin'（大寫 A），存到 hasAdmin
let hasAdmin

// TODO: 判斷是否包含 'admin'（小寫 a），存到 hasLower
let hasLower
`,
        testCases: [
          { label: 'hasAdmin 應為 true', test: `return hasAdmin === true` },
          { label: 'hasLower 應為 false', test: `return hasLower === false` },
          { label: 'hasAdmin 應是 boolean', test: `return typeof hasAdmin === 'boolean'` },
          {
            label: '小寫開頭無法找到',
            test: `return 'AdminUser'.includes('admin') === false`,
          },
        ],
      },
    ],
  },

  // ─── str-startswith-endswith ───────────────────────────────────────────────
  {
    slug: 'str-startswith-endswith',
    methodName: 'startsWith() / endsWith()',
    title: 'String.startsWith() / endsWith()',
    description: '判斷字串是否以指定子字串開頭或結尾，回傳 boolean。',
    subCategory: '搜尋與判斷',
    difficulty: 'easy',
    notes: {
      title: 'startsWith() / endsWith()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`str.startsWith(searchString[, position])\`
\`str.endsWith(searchString[, length])\`

- 回傳：**boolean**（\`true\` / \`false\`）。
- \`startsWith\` 的 \`position\`：從哪個索引開始判斷，預設 0。
- \`endsWith\` 的 \`length\`：視字串長度為多少來判斷結尾，預設為 \`str.length\`。
- 兩者皆**區分大小寫**。
- ES2015（ES6）引入。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const url = 'https://example.com/api/users'

url.startsWith('https://')   // true
url.startsWith('http://')    // false
url.endsWith('/users')       // true
url.endsWith('.json')        // false

const file = 'report_2024.pdf'
file.endsWith('.pdf')        // true
file.endsWith('.PDF')        // false（區分大小寫）

// 使用 position 參數
'Hello World'.startsWith('World', 6)  // true
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- 兩者都是**區分大小寫**的，\`.PDF\` 和 \`.pdf\` 不同。
- \`endsWith\` 的第二個參數 \`length\` 是指「把字串視為前 length 個字元」，不是索引。
- 常見用途：驗證 URL 協定、判斷副檔名、分類訊息前綴。
- 比 \`slice()\` + \`===\` 的寫法更直觀易讀。`,
        },
      ],
    },
    keyPoints: [
      'startsWith 判斷字串是否以某個子字串開頭，endsWith 判斷是否以某個子字串結尾，兩者都回傳布林值。',
      '兩個方法都是 ES6 引入的，都區分大小寫，.pdf 和 .PDF 會被視為不同。',
      'startsWith 的第二個參數 position 可以指定從第幾個索引開始比對，預設從 0 開始。',
      'endsWith 的第二個參數 length 讓你把字串視為只有前幾個字元，然後再判斷結尾。',
      '常見應用場景：驗證 URL 是否用 https、判斷副檔名、辨識字串前綴或後綴。',
      '比起 str.slice(0, n) === prefix 的寫法，startsWith 和 endsWith 語義更清晰，是面試中常見的最佳實踐寫法。',
    ],
    problems: [
      {
        id: 'basic',
        title: 'URL 安全檢查：確認是否使用 HTTPS',
        difficulty: 'easy',
        description: `瀏覽器外掛需要判斷使用者當前瀏覽的 URL 是否使用安全連線（HTTPS）。

請使用 \`startsWith()\` 判斷 \`url\` 是否以 \`'https://'\` 開頭，
將結果存到 \`isSecure\`（boolean）。`,
        examples: [
          {
            input: `url = 'https://www.google.com'`,
            output: `isSecure === true`,
          },
          {
            input: `url = 'http://old-site.com'`,
            output: `isSecure === false`,
          },
        ],
        initialCode: `const url = 'https://www.google.com/search?q=javascript'

// TODO: 用 startsWith() 判斷 url 是否以 'https://' 開頭，結果存到 isSecure
let isSecure
`,
        testCases: [
          { label: 'isSecure 應為 true', test: `return isSecure === true` },
          { label: 'isSecure 應是 boolean 型別', test: `return typeof isSecure === 'boolean'` },
          {
            label: 'http:// 開頭的 URL 應回傳 false',
            test: `const u = 'http://old-site.com'; const r = u.startsWith('https://'); return r === false`,
          },
          {
            label: '無協定的 URL 應回傳 false',
            test: `const u = 'www.example.com'; const r = u.startsWith('https://'); return r === false`,
          },
        ],
      },
      {
        id: 'file-type',
        title: '檔案管理：依副檔名分類',
        difficulty: 'easy',
        description: `雲端儲存平台需要根據副檔名判斷檔案類型。

請完成以下判斷，所有結果皆為 boolean：
- \`isImage\`：\`fileName\` 是否以 \`'.jpg'\`、\`'.png'\` 或 \`'.gif'\` 結尾
- \`isDocument\`：\`fileName\` 是否以 \`'.pdf'\` 或 \`'.docx'\` 結尾
- \`isVideo\`：\`fileName\` 是否以 \`'.mp4'\` 或 \`'.mov'\` 結尾

請使用 \`endsWith()\` 進行判斷。`,
        examples: [
          {
            input: `fileName = 'vacation_photo.jpg'`,
            output: `isImage === true，isDocument === false，isVideo === false`,
          },
        ],
        initialCode: `const fileName = 'vacation_photo.jpg'

// TODO: 用 endsWith() 判斷各種副檔名，結果存到對應變數
let isImage
let isDocument
let isVideo
`,
        testCases: [
          { label: 'isImage 應為 true（.jpg 檔）', test: `return isImage === true` },
          { label: 'isDocument 應為 false', test: `return isDocument === false` },
          { label: 'isVideo 應為 false', test: `return isVideo === false` },
          {
            label: '.pdf 檔案的 isDocument 應為 true',
            test: `const f = 'report.pdf'; const r = f.endsWith('.pdf') || f.endsWith('.docx'); return r === true`,
          },
          {
            label: '.mp4 檔案的 isVideo 應為 true',
            test: `const f = 'clip.mp4'; const r = f.endsWith('.mp4') || f.endsWith('.mov'); return r === true`,
          },
        ],
      },
      {
        id: 'classify',
        title: '客服訊息分類：辨識訊息類型',
        difficulty: 'medium',
        description: `客服系統收到的訊息會有固定前綴和後綴格式，需要自動分類：
- **緊急訊息**：以 \`'[緊急]'\` 開頭
- **已解決訊息**：以 \`'[已解決]'\` 開頭，且以 \`'#close'\` 結尾
- **一般詢問**：不符合以上兩種

請完成 \`classifyMessage\` 函式，接收一個字串 \`msg\`，
回傳 \`'urgent'\`、\`'resolved'\` 或 \`'general'\`。`,
        examples: [
          {
            input: `msg = '[緊急] 付款頁面無法載入'`,
            output: `'urgent'`,
          },
          {
            input: `msg = '[已解決] 訂單已成功取消 #close'`,
            output: `'resolved'`,
          },
          {
            input: `msg = '請問如何修改收件地址？'`,
            output: `'general'`,
          },
        ],
        initialCode: `function classifyMessage(msg) {
  // TODO: 用 startsWith() 判斷是否為緊急訊息（以 '[緊急]' 開頭）

  // TODO: 用 startsWith() + endsWith() 判斷是否為已解決訊息

  // TODO: 回傳 'urgent'、'resolved' 或 'general'
}
`,
        testCases: [
          {
            label: '緊急訊息應回傳 "urgent"',
            test: `return classifyMessage('[緊急] 付款頁面無法載入') === 'urgent'`,
          },
          {
            label: '已解決訊息應回傳 "resolved"',
            test: `return classifyMessage('[已解決] 訂單已成功取消 #close') === 'resolved'`,
          },
          {
            label: '一般詢問應回傳 "general"',
            test: `return classifyMessage('請問如何修改收件地址？') === 'general'`,
          },
          {
            label: '有 [已解決] 但無 #close 結尾，應回傳 "general"',
            test: `return classifyMessage('[已解決] 問題還沒完全處理') === 'general'`,
          },
          {
            label: '緊急優先級高於已解決',
            test: `return classifyMessage('[緊急] 請確認') === 'urgent'`,
          },
        ],
      },
      {
        id: 'startswith-position',
        title: '路由解析：從指定位置判斷路徑前綴',
        difficulty: 'medium',
        description: `API 路由器需要確認去掉統一前綴 \`'/api'\`（4個字元）後，剩餘路徑是否以 \`'/users'\` 開頭。

給定路徑 \`apiPath\`，使用 \`startsWith('/users', 4)\` 從索引 4 開始判斷，將結果存到 \`isUsersRoute\`。

接著用 \`startsWith('/admin', 4)\` 判斷是否為 admin 路由，存到 \`isAdminRoute\`。`,
        examples: [
          {
            input: `apiPath = '/api/users/profile'`,
            output: `isUsersRoute === true，isAdminRoute === false`,
          },
        ],
        initialCode: `const apiPath = '/api/users/profile'

// TODO: 從索引 4 開始判斷是否以 '/users' 開頭，存到 isUsersRoute
let isUsersRoute

// TODO: 從索引 4 開始判斷是否以 '/admin' 開頭，存到 isAdminRoute
let isAdminRoute
`,
        testCases: [
          { label: 'isUsersRoute 應為 true', test: `return isUsersRoute === true` },
          { label: 'isAdminRoute 應為 false', test: `return isAdminRoute === false` },
          {
            label: '若不用第二參數，整個字串不以 /users 開頭',
            test: `return '/api/users/profile'.startsWith('/users') === false`,
          },
          {
            label: '第二參數讓搜尋從正確位置開始',
            test: `return '/api/admin/settings'.startsWith('/admin', 4) === true`,
          },
        ],
      },
      {
        id: 'endswith-length',
        title: '版本號驗證：只看主版本部分的結尾',
        difficulty: 'medium',
        description: `版本號格式為 \`'v2.3.1-beta'\`，需要確認**去掉後綴標籤前**（只看前 6 個字元 \`'v2.3.1'\`）是否以 \`'.1'\` 結尾。

給定版本字串 \`version\`，
1. 使用 \`endsWith('.1', 6)\` 只看前 6 個字元，判斷是否以 \`'.1'\` 結尾，存到 \`isPatch1\`。
2. 直接呼叫 \`endsWith('.1')\` 判斷完整字串是否以 \`'.1'\` 結尾，存到 \`fullEnds\`。`,
        examples: [
          {
            input: `version = 'v2.3.1-beta'`,
            output: `isPatch1 === true，fullEnds === false`,
          },
        ],
        initialCode: `const version = 'v2.3.1-beta'

// TODO: 只看前 6 個字元，判斷是否以 '.1' 結尾，存到 isPatch1
let isPatch1

// TODO: 完整字串是否以 '.1' 結尾，存到 fullEnds
let fullEnds
`,
        testCases: [
          { label: 'isPatch1 應為 true', test: `return isPatch1 === true` },
          { label: 'fullEnds 應為 false', test: `return fullEnds === false` },
          {
            label: '第二參數限制了搜尋範圍',
            test: `return 'v2.3.1-beta'.endsWith('.1', 6) === true`,
          },
          {
            label: '完整字串以 -beta 結尾',
            test: `return 'v2.3.1-beta'.endsWith('-beta') === true`,
          },
        ],
      },
    ],
  },

  // ─── str-slice ────────────────────────────────────────────────────────────
  {
    slug: 'str-slice',
    methodName: 'slice()',
    title: 'String.slice()',
    description: '擷取字串的指定範圍，回傳新字串，不修改原字串。',
    subCategory: '擷取與切割',
    difficulty: 'easy',
    notes: {
      title: 'slice()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`str.slice(beginIndex[, endIndex])\`

- 回傳：擷取出來的**新字串**（不修改原字串）。
- \`beginIndex\`：擷取起始索引（包含此位置）。
- \`endIndex\`：擷取結束索引（**不包含**此位置），省略則取到字串末端。
- 兩個參數皆可為**負數**，負數代表從字串末端往回數。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const s = 'Hello, World!'

s.slice(7)         // 'World!'   (從索引 7 取到末端)
s.slice(7, 12)     // 'World'    (索引 7 到 11，不含 12)
s.slice(-6)        // 'orld!'    (從倒數第 6 個字元到末端)
s.slice(-6, -1)    // 'orld'     (倒數第 6 到倒數第 2，不含最後一個)
s.slice(0, 5)      // 'Hello'

// 擷取文章摘要
const article = '今天天氣很好，適合出去走走。'
article.slice(0, 6) + '...'  // '今天天氣很好...'
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- \`slice()\` **不修改**原字串，回傳的是新字串。
- \`endIndex\` 是**不包含**的（exclusive），這是常見的 off-by-one 錯誤來源。
- 負數索引：\`-1\` 是最後一個字元，\`-2\` 是倒數第二個，以此類推。
- 若 \`beginIndex >= endIndex\`（正數情況），回傳空字串 \`''\`。
- 與 \`substring()\` 的差別：\`slice()\` 支援負數，\`substring()\` 不支援（負數視為 0）。`,
        },
      ],
    },
    keyPoints: [
      'slice 用來擷取字串的某個範圍，第一個參數是起始索引（包含），第二個是結束索引（不包含）。',
      'slice 不會修改原字串，而是回傳一個新字串，這是不可變操作的典型範例。',
      '省略第二個參數時，會從起始索引一直截取到字串末端。',
      '負數索引非常實用，-1 代表最後一個字元，-2 代表倒數第二個，讓你不用計算字串長度也能從後面截取。',
      '常見的截斷功能寫法：先判斷 str.length > maxLen，超過才用 slice(0, maxLen) 加上省略號。',
      'slice 和 substring 功能相似，但 slice 支援負數索引，是更靈活的選擇，面試通常推薦使用 slice。',
    ],
    problems: [
      {
        id: 'basic',
        title: '文章列表：擷取摘要預覽',
        difficulty: 'easy',
        description: `部落格平台的文章列表需要顯示每篇文章的預覽摘要，固定取前 20 個字元。

請使用 \`slice()\` 擷取 \`articleContent\` 的前 20 個字元，存到 \`preview\`。`,
        examples: [
          {
            input: `articleContent = '今天我們來聊聊 JavaScript 的非同步機制，包含 Promise 和 async/await...'`,
            output: `preview === '今天我們來聊聊 JavaScript'（前 20 字元）`,
          },
        ],
        initialCode: `const articleContent = '今天我們來聊聊 JavaScript 的非同步機制，包含 Promise 和 async/await 的使用方式。'

// TODO: 用 slice() 取前 20 個字元，存到 preview
let preview
`,
        testCases: [
          { label: 'preview 長度應為 20', test: `return preview.length === 20` },
          { label: 'preview 應為字串型別', test: `return typeof preview === 'string'` },
          { label: 'preview 開頭應為 "今天我們來聊聊"', test: `return preview.startsWith('今天我們來聊聊')` },
          { label: '原字串不應被修改', test: `return articleContent.length > 20` },
        ],
      },
      {
        id: 'negative',
        title: '卡號遮罩：顯示末四碼',
        difficulty: 'medium',
        description: `金融系統需要在顯示信用卡號時進行遮罩，只顯示最後四碼。

請使用**負數索引**的 \`slice()\` 取得 \`cardNumber\` 的最後 4 個字元，存到 \`lastFour\`。
接著組合出格式為 \`'**** **** **** XXXX'\` 的遮罩字串，存到 \`maskedCard\`。`,
        examples: [
          {
            input: `cardNumber = '4532015112830366'`,
            output: `lastFour === '0366'，maskedCard === '**** **** **** 0366'`,
          },
        ],
        initialCode: `const cardNumber = '4532015112830366'

// TODO: 用負數 index 的 slice() 取最後 4 碼，存到 lastFour
let lastFour

// TODO: 組合出 '**** **** **** XXXX' 格式，存到 maskedCard
let maskedCard
`,
        testCases: [
          { label: 'lastFour 應為 "0366"', test: `return lastFour === '0366'` },
          { label: 'maskedCard 應為 "**** **** **** 0366"', test: `return maskedCard === '**** **** **** 0366'` },
          {
            label: '負數 slice 可正確取出末四碼',
            test: `const c = '1234567890123456'; const l = c.slice(-4); return l === '3456'`,
          },
          {
            label: 'lastFour 應是 string 型別',
            test: `return typeof lastFour === 'string'`,
          },
        ],
      },
      {
        id: 'truncate',
        title: '社群貼文：智慧截斷長文字',
        difficulty: 'medium',
        description: `社群平台的貼文預覽需要智慧截斷功能：
- 若文字長度**超過** \`maxLen\`，截取前 \`maxLen\` 個字元並加上 \`'...'\`
- 若文字長度**未超過** \`maxLen\`，直接回傳原文字

請完成 \`truncate\` 函式，接收 \`text\`（字串）和 \`maxLen\`（數字），回傳截斷後的結果。`,
        examples: [
          {
            input: `text = '今天在台北信義區發現一家超棒的咖啡廳！', maxLen = 10`,
            output: `'今天在台北信義區發現...'`,
          },
          {
            input: `text = '短文字', maxLen = 10`,
            output: `'短文字'`,
          },
        ],
        constraints: [
          '必須使用 slice() 進行截取',
          '超過才截斷，等於長度時不截斷',
        ],
        initialCode: `function truncate(text, maxLen) {
  // TODO: 如果 text.length > maxLen，用 slice() 截取並加 '...'
  // TODO: 否則直接回傳原本的 text
}
`,
        testCases: [
          {
            label: '超過長度時應截斷並加 "..."',
            test: `return truncate('今天在台北信義區發現一家超棒的咖啡廳！', 10) === '今天在台北信義區發現...'`,
          },
          {
            label: '未超過長度時應回傳原文字',
            test: `return truncate('短文字', 10) === '短文字'`,
          },
          {
            label: '剛好等於長度時不應截斷',
            test: `return truncate('1234567890', 10) === '1234567890'`,
          },
          {
            label: '截斷結果長度應為 maxLen + 3（含省略號）',
            test: `const r = truncate('abcdefghijklmn', 5); return r.length === 8 && r.endsWith('...')`,
          },
          {
            label: '空字串應直接回傳空字串',
            test: `return truncate('', 10) === ''`,
          },
        ],
      },
      {
        id: 'start-greater',
        title: 'slice vs substring：start 大於 end 的差異',
        difficulty: 'medium',
        description: `\`slice()\` 和 \`substring()\` 在 start 大於 end 時行為**完全不同**：
- \`slice(start, end)\`：start > end 時回傳**空字串** \`''\`
- \`substring(start, end)\`：start > end 時會**自動交換**兩個參數

給定字串 \`str\`，
1. 呼叫 \`str.slice(7, 2)\`，存到 \`sliceResult\`。
2. 呼叫 \`str.substring(7, 2)\`，存到 \`substringResult\`。`,
        examples: [
          {
            input: `str = 'Hello, World!'`,
            output: `sliceResult === ''（空字串）`,
          },
          {
            input: `str = 'Hello, World!'`,
            output: `substringResult === 'llo, '（等同 substring(2, 7)）`,
          },
        ],
        initialCode: `const str = 'Hello, World!'

// TODO: 呼叫 slice(7, 2)，存到 sliceResult
let sliceResult

// TODO: 呼叫 substring(7, 2)，存到 substringResult
let substringResult
`,
        testCases: [
          { label: 'sliceResult 應為空字串', test: `return sliceResult === ''` },
          { label: 'substringResult 應為 "llo, "', test: `return substringResult === 'llo, '` },
          {
            label: 'slice start > end 永遠回傳空字串',
            test: `return 'abcdef'.slice(4, 1) === ''`,
          },
          {
            label: 'substring 自動交換參數',
            test: `return 'abcdef'.substring(4, 1) === 'bcd'`,
          },
        ],
      },
    ],
  },
]
