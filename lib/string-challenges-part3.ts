import type { MethodEntry } from './array-challenges'

export const stringChallengesPart3: MethodEntry[] = [
  // ─── replace() / replaceAll() ────────────────────────────────────────────
  {
    slug: 'str-replace',
    methodName: 'replace() / replaceAll()',
    title: 'replace() / replaceAll()',
    description: '取代字串中的字元或子字串，支援正規表達式與全域取代',
    subCategory: '轉換與格式化',
    difficulty: 'easy',
    notes: {
      title: 'replace() / replaceAll()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`str.replace(searchValue, replaceValue)\`
\`str.replaceAll(searchValue, replaceValue)\`

- \`replace\`：預設只取代**第一個**符合的子字串；若傳入帶有 \`g\` 旗標的正規表達式，則全部取代。
- \`replaceAll\`（ES2021）：直接取代**所有**符合的子字串，等同於 \`/pattern/g\`。
- 回傳：**新字串**，原字串不變。
- \`replaceValue\` 可以是字串或函式（function）。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const s = 'foo bar foo'

// replace 只換第一個
s.replace('foo', 'baz')        // 'baz bar foo'

// replace + 全域 regex 換全部
s.replace(/foo/g, 'baz')       // 'baz bar baz'

// replaceAll 換全部（字串模式）
s.replaceAll('foo', 'baz')     // 'baz bar baz'

// 用函式動態決定替換值
'hello world'.replace(/\\w+/g, w => w.toUpperCase())
// 'HELLO WORLD'
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- \`replace\` 和 \`replaceAll\` 都**不修改原字串**，要記得接收回傳值。
- \`replaceAll\` 傳入正規表達式時**必須帶 \`g\` 旗標**，否則拋出 TypeError。
- \`replace\` 的第二個參數若為字串，可使用特殊替換模式：\`$$\`（插入 $）、\`$&\`（符合的子字串）、\`$\`\`\`（符合前的字串）、\`$'\`（符合後的字串）。
- 取代多個不同字元時，可以鏈式呼叫 \`.replace().replace()\`，但次數多時效能較差，可考慮用 \`reduce\`。`,
        },
      ],
    },
    keyPoints: [
      'replace 預設只取代第一個符合的子字串，若要取代所有，需要用帶 g 旗標的正規表達式，或改用 replaceAll。',
      'replaceAll 是 ES2021 的新方法，可以直接用字串作為 searchValue 來取代所有符合的位置。',
      'replace 和 replaceAll 都不會修改原字串，會回傳一個新的字串，一定要記得接收回傳值。',
      'replaceAll 傳入正規表達式時，必須帶 g 旗標，否則會拋出 TypeError，這是容易踩到的陷阱。',
      '第二個參數可以是函式，函式的第一個參數是符合的子字串，適合動態決定替換值的場景。',
      '若需要同時取代多種不同字元，可以鏈式呼叫 replace，但更優雅的方式是用 reduce 搭配一個替換表。',
    ],
    problems: [
      {
        id: 'basic',
        title: '清理電話號碼格式',
        difficulty: 'easy',
        description: `客服系統收到的電話號碼格式不統一，有的用 \`-\`，有的用 \` \`，有的用 \`.\` 作為分隔符。
請用 \`replace\` 搭配正規表達式，把 \`phone\` 中所有的 \`-\`、\` \`、\`.\` 移除，只保留數字，存到 \`result\`。`,
        constraints: [
          '必須使用 replace() 搭配正規表達式',
          '結果只能包含數字字元',
        ],
        examples: [
          {
            input: `phone = '0912-345 678.90'`,
            output: `'091234567890'`,
          },
        ],
        initialCode: `const phone = '0912-345 678.90'

// 請用 replace + 正規表達式移除所有 -、空格、. 符號
// 提示：字元集 [class] 可以一次匹配多種字元
let result
`,
        testCases: [
          {
            label: '基本電話號碼 "0912-345 678.90" 應回傳 "091234567890"',
            test: `return result === '091234567890'`,
          },
          {
            label: 'result 只包含數字',
            test: `return /^\\d+$/.test(result)`,
          },
          {
            label: 'result 長度應為 12',
            test: `return result.length === 12`,
          },
        ],
      },
      {
        id: 'template',
        title: '樣板字串替換',
        difficulty: 'easy',
        description: `行銷系統有一個通知樣板，內含 \`{{name}}\`、\`{{product}}\`、\`{{price}}\` 等佔位符。
請用 \`replace\` 把樣板 \`template\` 中的佔位符替換成對應值，不可使用 \`replaceAll\`。
結果存到 \`result\`。

提示：可以對同一個字串鏈式呼叫多次 \`replace\`，或使用帶 \`g\` 旗標的正規表達式。`,
        constraints: [
          '不能使用 replaceAll()',
          '每個佔位符需正確替換',
        ],
        examples: [
          {
            input: `template = '親愛的 {{name}}，您訂購的 {{product}} 金額為 {{price}} 元'`,
            output: `'親愛的 小明，您訂購的 AirPods Pro 金額為 5990 元'`,
          },
        ],
        initialCode: `const template = '親愛的 {{name}}，您訂購的 {{product}} 金額為 {{price}} 元'
const data = { name: '小明', product: 'AirPods Pro', price: '5990' }

// 請用 replace（不可用 replaceAll）把樣板中的佔位符替換成 data 中的值
// 提示 1：可以鏈式呼叫多次 replace
// 提示 2：也可以用 replace + /{{\\w+}}/g 搭配函式一次完成
let result
`,
        testCases: [
          {
            label: 'result 應包含 "小明"',
            test: `return result.includes('小明')`,
          },
          {
            label: 'result 應包含 "AirPods Pro"',
            test: `return result.includes('AirPods Pro')`,
          },
          {
            label: 'result 應包含 "5990"',
            test: `return result.includes('5990')`,
          },
          {
            label: 'result 不應包含任何 {{}}',
            test: `return !result.includes('{{')`,
          },
        ],
      },
      {
        id: 'replaceall',
        title: '用 replaceAll 清理 CSV 資料',
        difficulty: 'medium',
        description: `從外部匯入的 CSV 字串中，每個欄位值前後可能有多餘的空格，導致資料不一致。
請用 \`replaceAll\` 把 \`csvRow\` 中每個逗號旁邊的多餘空格（\`" , "\`、\`", "\`、\`" ,"\`）統一整理，
讓輸出符合標準 CSV：欄位之間只有一個逗號，前後無空格。

也就是說，需要移除每個欄位值的**首尾空格**。

請將結果存到 \`result\`（一個乾淨的字串陣列，每個元素為 trim 後的欄位值）。`,
        constraints: [
          '必須使用 replaceAll() 或結合 split/map',
          '每個欄位值不得有前後空格',
        ],
        examples: [
          {
            input: `csvRow = 'Alice , alice@example.com , 28 , 台北'`,
            output: `['Alice', 'alice@example.com', '28', '台北']`,
          },
        ],
        initialCode: `const csvRow = 'Alice , alice@example.com , 28 , 台北'

// 目標：把 csvRow 轉成乾淨的字串陣列，每個欄位值已 trim
// 方法一：先 replaceAll 移除逗號旁邊的空格，再 split
// 方法二：split 後用 map + trim
// 請選一種實作，結果存到 result（string[]）
let result
`,
        testCases: [
          {
            label: 'result 應為長度 4 的陣列',
            test: `return Array.isArray(result) && result.length === 4`,
          },
          {
            label: 'result[0] 應為 "Alice"（無空格）',
            test: `return result[0] === 'Alice'`,
          },
          {
            label: 'result[1] 應為 "alice@example.com"',
            test: `return result[1] === 'alice@example.com'`,
          },
          {
            label: 'result[3] 應為 "台北"（無空格）',
            test: `return result[3] === '台北'`,
          },
        ],
      },
      {
        id: 'first-only',
        title: 'replace vs replaceAll：只換第一個的差異',
        difficulty: 'easy',
        description: `\`replace()\` **只替換第一次**出現的子字串，\`replaceAll()\` 替換**所有**出現。

給定字串 \`sentence\`（含有多個 \`'cat'\`），
1. 用 \`replace('cat', 'dog')\` 只替換第一個，存到 \`firstOnly\`。
2. 用 \`replaceAll('cat', 'dog')\` 替換全部，存到 \`allReplaced\`。`,
        examples: [
          {
            input: `sentence = 'I have a cat. The cat is cute. My cat is orange.'`,
            output: `firstOnly === 'I have a dog. The cat is cute. My cat is orange.'`,
          },
          {
            input: `sentence = 'I have a cat. The cat is cute. My cat is orange.'`,
            output: `allReplaced === 'I have a dog. The dog is cute. My dog is orange.'`,
          },
        ],
        initialCode: `const sentence = 'I have a cat. The cat is cute. My cat is orange.'

// TODO: 只替換第一個 'cat'，存到 firstOnly
let firstOnly

// TODO: 替換全部 'cat'，存到 allReplaced
let allReplaced
`,
        testCases: [
          { label: 'firstOnly 應只換第一個 cat', test: `return firstOnly === 'I have a dog. The cat is cute. My cat is orange.'` },
          { label: 'allReplaced 應換掉所有 cat', test: `return allReplaced === 'I have a dog. The dog is cute. My dog is orange.'` },
          { label: 'replace 不改原字串', test: `const s = 'cat cat'; s.replace('cat', 'dog'); return s === 'cat cat'` },
        ],
      },
      {
        id: 'delete-char',
        title: '字元刪除：用空字串取代來移除指定字元',
        difficulty: 'easy',
        description: `將替換目標改成空字串 \`''\`，就能達到**刪除**的效果。

給定貨幣字串 \`price\`（含有 \`$\` 與 \`,\`），
1. 用 \`replaceAll('$', '')\` 移除所有貨幣符號，存到 \`noSign\`。
2. 再用 \`replaceAll(',', '')\` 移除所有千分位逗號，存到 \`cleaned\`（純數字字串）。`,
        examples: [
          {
            input: `price = '$1,234,567'`,
            output: `noSign === '1,234,567'，cleaned === '1234567'`,
          },
        ],
        initialCode: `const price = '$1,234,567'

// TODO: 移除 $ 符號，存到 noSign
let noSign

// TODO: 在 noSign 基礎上再移除所有 , 存到 cleaned
let cleaned
`,
        testCases: [
          { label: 'noSign 應為 "1,234,567"', test: `return noSign === '1,234,567'` },
          { label: 'cleaned 應為 "1234567"', test: `return cleaned === '1234567'` },
          { label: 'cleaned 轉數字應為 1234567', test: `return Number(cleaned) === 1234567` },
        ],
      },
      {
        id: 'word-swap',
        title: '文案替換：多欄位樣板內容更新',
        difficulty: 'easy',
        description: `電商平台在促銷活動結束後，需要把所有文案中的 \`'特價'\` 換成 \`'原價'\`，\`'立即搶購'\` 換成 \`'瀏覽商品'\`。

給定文案 \`banner\`，
1. 用 \`replaceAll('特價', '原價')\` 換掉所有「特價」，存到 \`step1\`。
2. 在 \`step1\` 上再用 \`replaceAll('立即搶購', '瀏覽商品')\`，存到 \`updated\`。`,
        examples: [
          {
            input: `banner = '特價商品！特價限時優惠，立即搶購！立即搶購不後悔'`,
            output: `updated === '原價商品！原價限時優惠，瀏覽商品！瀏覽商品不後悔'`,
          },
        ],
        initialCode: `const banner = '特價商品！特價限時優惠，立即搶購！立即搶購不後悔'

// TODO: 將所有 '特價' 換成 '原價'，存到 step1
let step1

// TODO: 在 step1 上將 '立即搶購' 換成 '瀏覽商品'，存到 updated
let updated
`,
        testCases: [
          { label: 'step1 應替換所有特價', test: `return step1 === '原價商品！原價限時優惠，立即搶購！立即搶購不後悔'` },
          { label: 'updated 應同時替換兩者', test: `return updated === '原價商品！原價限時優惠，瀏覽商品！瀏覽商品不後悔'` },
          { label: 'replaceAll 才能換掉全部', test: `return '特價 特價'.replaceAll('特價', '原價') === '原價 原價'` },
        ],
      },
    ],
  },

  // ─── padStart() / padEnd() ───────────────────────────────────────────────
  {
    slug: 'str-pad',
    methodName: 'padStart() / padEnd()',
    title: 'padStart() / padEnd()',
    description: '在字串前端或後端填充字元，使字串達到指定長度',
    subCategory: '轉換與格式化',
    difficulty: 'easy',
    notes: {
      title: 'padStart() / padEnd()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`str.padStart(targetLength[, padString])\`
\`str.padEnd(targetLength[, padString])\`

- \`targetLength\`：目標字串長度。若原字串已達或超過此長度，**直接回傳原字串**，不截短。
- \`padString\`：填充字元（預設為空格 \`' '\`）。若填充字元長度超出所需，會**截斷**填充字元。
- 回傳：**新字串**，原字串不變。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
// 補零：訂單編號固定 4 位
String(42).padStart(4, '0')    // '0042'
String(1234).padStart(4, '0')  // '1234'（已夠長，不填充）

// padEnd：在右側填充
'5'.padEnd(3, '0')             // '500'
'abc'.padEnd(5, '.')           // 'abc..'

// 填充字元超出時自動截斷
'x'.padStart(5, 'abc')         // 'abcax'（填充字元循環截斷）
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- \`padStart\` / \`padEnd\` 都**不修改原字串**。
- 輸入必須是**字串**，數字要先用 \`String()\` 或 \`.toString()\` 轉換。
- 若 \`targetLength\` 小於原字串長度，回傳原字串本身，不報錯也不截短。
- 填充字元可以是多字元字串，會循環填充，最終再截到需要的長度。`,
        },
      ],
    },
    keyPoints: [
      'padStart 在字串左邊填充字元，padEnd 在右邊填充，讓字串達到指定的目標長度。',
      '最常見的用途是補零，例如把數字 7 格式化成 "007"：String(7).padStart(3, "0")。',
      '如果原字串長度已經大於或等於目標長度，padStart 和 padEnd 會直接回傳原字串，不會截短。',
      '填充字元預設是空格，也可以傳入任意字元或多字元字串，超出所需長度時會自動截斷。',
      '處理數字前記得先轉成字串，可以用 String(n) 或 n.toString() 或樣板字串 `${n}`。',
    ],
    problems: [
      {
        id: 'basic',
        title: '訂單編號補零格式化',
        difficulty: 'easy',
        description: `電商後台的訂單編號需要固定顯示為 **6 位數**，不足 6 位的在前面補零。
請用 \`padStart\` 把 \`orders\` 陣列中每筆訂單的 \`id\` 轉成 6 位數字串，存到 \`result\`（字串陣列）。`,
        examples: [
          { input: `orders = [{ id: 1 }, { id: 42 }, { id: 99999 }]`, output: `['000001', '000042', '099999']` },
        ],
        initialCode: `const orders = [
  { id: 1 },
  { id: 42 },
  { id: 1234 },
  { id: 99999 },
  { id: 100000 },
]

// 請用 padStart 把每筆訂單的 id 格式化為 6 位數字串
// 提示：數字要先轉成字串才能使用 padStart
let result
`,
        testCases: [
          {
            label: 'result 應為長度 5 的陣列',
            test: `return Array.isArray(result) && result.length === 5`,
          },
          {
            label: 'id=1 應格式化為 "000001"',
            test: `return result[0] === '000001'`,
          },
          {
            label: 'id=42 應格式化為 "000042"',
            test: `return result[1] === '000042'`,
          },
          {
            label: 'id=100000 已達 6 位，應維持 "100000"',
            test: `return result[4] === '100000'`,
          },
        ],
      },
      {
        id: 'time-format',
        title: '時間格式化：時分秒補兩位數',
        difficulty: 'easy',
        description: `倒數計時器需要把時、分、秒統一顯示為兩位數格式，例如 \`9\` 秒應顯示為 \`"09"\`。
請實作函式 \`formatTime(hours, minutes, seconds)\`，回傳格式為 \`"HH:MM:SS"\` 的字串。`,
        examples: [
          { input: `formatTime(1, 5, 3)`, output: `'01:05:03'` },
          { input: `formatTime(12, 30, 0)`, output: `'12:30:00'` },
        ],
        initialCode: `// 請實作 formatTime 函式
// 傳入時、分、秒，回傳 "HH:MM:SS" 格式的字串
// 每個部分都要補成兩位數，不足補零
function formatTime(hours, minutes, seconds) {
  // 在這裡撰寫你的程式碼
}
`,
        testCases: [
          {
            label: 'formatTime(1, 5, 3) 應回傳 "01:05:03"',
            test: `return formatTime(1, 5, 3) === '01:05:03'`,
          },
          {
            label: 'formatTime(12, 30, 0) 應回傳 "12:30:00"',
            test: `return formatTime(12, 30, 0) === '12:30:00'`,
          },
          {
            label: 'formatTime(0, 0, 9) 應回傳 "00:00:09"',
            test: `return formatTime(0, 0, 9) === '00:00:09'`,
          },
          {
            label: 'formatTime(23, 59, 59) 應回傳 "23:59:59"',
            test: `return formatTime(23, 59, 59) === '23:59:59'`,
          },
        ],
      },
      {
        id: 'mask',
        title: '信用卡號遮罩顯示',
        difficulty: 'medium',
        description: `支付頁面需要把信用卡號遮罩處理：只顯示最後 4 位，前面全部用 \`*\` 填充，且總長度固定為 16 位。
請實作函式 \`maskCard(cardNumber)\`，\`cardNumber\` 是純數字字串（16 位），
回傳遮罩後的字串，例如 \`"************1234"\`。

提示：可以結合 \`slice\` 擷取後 4 位，再用 \`padStart\` 在前面補 \`*\`。`,
        constraints: [
          '回傳字串長度固定為 16',
          '後 4 位保持原始數字',
          '前 12 位全部為 "*"',
        ],
        examples: [
          { input: `maskCard('4539578763621486')`, output: `'************1486'` },
          { input: `maskCard('1234567890001234')`, output: `'************1234'` },
        ],
        initialCode: `// 請實作 maskCard 函式
// 傳入 16 位數字字串，回傳前 12 位遮罩、後 4 位明碼的字串
// 提示：slice(-4) 可以取得最後 4 個字元
function maskCard(cardNumber) {
  // 在這裡撰寫你的程式碼
}
`,
        testCases: [
          {
            label: 'maskCard("4539578763621486") 應回傳 "************1486"',
            test: `return maskCard('4539578763621486') === '************1486'`,
          },
          {
            label: 'maskCard("1234567890001234") 應回傳 "************1234"',
            test: `return maskCard('1234567890001234') === '************1234'`,
          },
          {
            label: '回傳字串長度應為 16',
            test: `return maskCard('4539578763621486').length === 16`,
          },
          {
            label: '前 12 位應全為 "*"',
            test: `return maskCard('4539578763621486').slice(0, 12) === '************'`,
          },
        ],
      },
      {
        id: 'default-space',
        title: '文字對齊：不傳 fillString 預設補空格',
        difficulty: 'medium',
        description: `\`padStart()\` 和 \`padEnd()\` 的第二個參數 \`fillString\` 是**選填**的，
若省略不傳，預設補**空格** \`' '\`（而非 '0' 或其他字元）。

給定品項名稱 \`item\` 和價格 \`price\`，
1. 用 \`item.padEnd(20)\`（只傳長度，不傳 fillString）將名稱補到 20 個字元，存到 \`paddedItem\`。
2. 用 \`price.padStart(8)\`（只傳長度）將價格補到 8 個字元，存到 \`paddedPrice\`。

這樣可以在純文字環境（如 console、log）中做出對齊效果。`,
        examples: [
          {
            input: `item = 'Apple'，price = '99'`,
            output: `paddedItem === 'Apple               '（長度 20，右側補空格）`,
          },
          {
            input: `item = 'Apple'，price = '99'`,
            output: `paddedPrice === '      99'（長度 8，左側補空格）`,
          },
        ],
        initialCode: `const item = 'Apple'
const price = '99'

// TODO: 用 padEnd(20) 將 item 補到 20 個字元（不傳 fillString）
let paddedItem

// TODO: 用 padStart(8) 將 price 補到 8 個字元（不傳 fillString）
let paddedPrice
`,
        testCases: [
          { label: 'paddedItem 長度應為 20', test: `return paddedItem.length === 20` },
          { label: 'paddedItem 應以空格填充右側', test: `return paddedItem === 'Apple               '` },
          { label: 'paddedPrice 長度應為 8', test: `return paddedPrice.length === 8` },
          { label: 'paddedPrice 應以空格填充左側', test: `return paddedPrice === '      99'` },
        ],
      },
    ],
  },

  // ─── repeat() ────────────────────────────────────────────────────────────
  {
    slug: 'str-repeat',
    methodName: 'repeat()',
    title: 'repeat()',
    description: '將字串重複指定次數，回傳新字串',
    subCategory: '轉換與格式化',
    difficulty: 'easy',
    notes: {
      title: 'repeat()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`str.repeat(count)\`

- \`count\`：重複次數，必須是非負整數（≥ 0）。
- \`count = 0\`：回傳空字串 \`''\`。
- 回傳：**新字串**，原字串不變。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
'─'.repeat(20)         // '────────────────────'
'abc'.repeat(3)        // 'abcabcabc'
'ha'.repeat(0)         // ''

// 建立縮排
const indent = (n) => ' '.repeat(n * 2)
indent(3)              // '      '（6 個空格）

// 視覺化進度條
const bar = (progress, total) =>
  '█'.repeat(progress) + '░'.repeat(total - progress)
bar(3, 5)              // '███░░'
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- \`count\` 若為負數或 \`Infinity\` 會拋出 \`RangeError\`。
- \`count\` 若為小數，會自動無條件捨去（floor）：\`'a'.repeat(2.9)\` → \`'aa'\`。
- 可以和字串串接（\`+\`）或樣板字串組合，快速產生視覺化字元序列。`,
        },
      ],
    },
    keyPoints: [
      'repeat(n) 把字串重複 n 次後回傳新字串，原字串不會被修改。',
      '傳入 0 會回傳空字串，傳入負數或 Infinity 會拋出 RangeError。',
      '傳入小數時會自動無條件捨去，例如 repeat(2.9) 等同於 repeat(2)。',
      '常見用途包括建立分隔線、縮排空格、視覺化進度條或星星評分等 UI 元素。',
    ],
    problems: [
      {
        id: 'basic',
        title: '建立分隔線',
        difficulty: 'easy',
        description: `CLI 工具需要在章節標題上下各印一條分隔線。
請用 \`repeat\` 實作函式 \`makeSeparator(char, length)\`，
回傳由 \`char\` 字元重複 \`length\` 次組成的字串。`,
        examples: [
          { input: `makeSeparator('─', 20)`, output: `'────────────────────'` },
          { input: `makeSeparator('=', 10)`, output: `'=========='` },
        ],
        initialCode: `// 請實作 makeSeparator 函式
// 傳入一個字元和長度，回傳由該字元重複指定次數組成的字串
function makeSeparator(char, length) {
  // 在這裡撰寫你的程式碼
}
`,
        testCases: [
          {
            label: 'makeSeparator("─", 20) 應回傳 20 個 "─"',
            test: `return makeSeparator('─', 20) === '─'.repeat(20)`,
          },
          {
            label: 'makeSeparator("=", 10) 應回傳 "=========="',
            test: `return makeSeparator('=', 10) === '=========='`,
          },
          {
            label: 'makeSeparator("*", 5) 長度應為 5',
            test: `return makeSeparator('*', 5).length === 5`,
          },
          {
            label: 'makeSeparator("-", 0) 應回傳空字串',
            test: `return makeSeparator('-', 0) === ''`,
          },
        ],
      },
      {
        id: 'rating',
        title: '視覺化星星評分',
        difficulty: 'medium',
        description: `商品評論頁面需要把數字評分（1–5）轉成視覺化星星。
請實作函式 \`renderStars(score)\`：
- \`score\` 為整數（1 到 5）
- 回傳 \`score\` 個 \`"★"\` 加上 \`(5 - score)\` 個 \`"☆"\`

例如評分 3 → \`"★★★☆☆"\`。`,
        constraints: [
          'score 保證為 1 到 5 的整數',
          '回傳字串總長度固定為 5',
        ],
        examples: [
          { input: `renderStars(1)`, output: `'★☆☆☆☆'` },
          { input: `renderStars(5)`, output: `'★★★★★'` },
          { input: `renderStars(3)`, output: `'★★★☆☆'` },
        ],
        initialCode: `// 請實作 renderStars 函式
// 傳入 1~5 的評分，回傳對應的星星字串
// 例如：renderStars(3) → '★★★☆☆'
function renderStars(score) {
  // 在這裡撰寫你的程式碼
}
`,
        testCases: [
          {
            label: 'renderStars(1) 應回傳 "★☆☆☆☆"',
            test: `return renderStars(1) === '★☆☆☆☆'`,
          },
          {
            label: 'renderStars(3) 應回傳 "★★★☆☆"',
            test: `return renderStars(3) === '★★★☆☆'`,
          },
          {
            label: 'renderStars(5) 應回傳 "★★★★★"',
            test: `return renderStars(5) === '★★★★★'`,
          },
          {
            label: '回傳字串長度應固定為 5',
            test: `return renderStars(2).length === 5`,
          },
        ],
      },
      {
        id: 'decimal-floor',
        title: 'repeat 小數參數：自動無條件捨去',
        difficulty: 'medium',
        description: `\`repeat(count)\` 的 \`count\` 若為**小數**，會自動**無條件捨去（floor）**，不會四捨五入，也不會報錯。

例如：
- \`'a'.repeat(2.9)\` → \`'aa'\`（floor(2.9) = 2）
- \`'a'.repeat(2.1)\` → \`'aa'\`（floor(2.1) = 2）

給定字串 \`char\`，
1. 呼叫 \`char.repeat(3.7)\`，存到 \`result1\`。
2. 呼叫 \`char.repeat(1.1)\`，存到 \`result2\`。`,
        examples: [
          {
            input: `char = '★'`,
            output: `result1 === '★★★'（floor(3.7) = 3）`,
          },
          {
            input: `char = '★'`,
            output: `result2 === '★'（floor(1.1) = 1）`,
          },
        ],
        initialCode: `const char = '★'

// TODO: repeat(3.7)，存到 result1
let result1

// TODO: repeat(1.1)，存到 result2
let result2
`,
        testCases: [
          { label: 'result1 應為 "★★★"（小數自動 floor）', test: `return result1 === '★★★'` },
          { label: 'result2 應為 "★"', test: `return result2 === '★'` },
          { label: '驗證 2.9 不會四捨五入成 3 次', test: `return 'a'.repeat(2.9) === 'aa'` },
          { label: '驗證 2.1 等同 2', test: `return 'a'.repeat(2.1) === 'aa'` },
        ],
      },
      {
        id: 'nan-zero',
        title: 'repeat 特殊值：NaN 視為 0，回傳空字串',
        difficulty: 'medium',
        description: `\`repeat()\` 對特殊 \`count\` 值的行為：
- \`count\` 為 **NaN** → 視為 **0**，回傳空字串 \`''\`
- \`count\` 為 **0** → 回傳空字串 \`''\`
- \`count\` 為**負數**或 **Infinity** → 拋出 \`RangeError\`

給定字串 \`str\`，
1. 呼叫 \`str.repeat(NaN)\`，存到 \`fromNaN\`。
2. 呼叫 \`str.repeat(0)\`，存到 \`fromZero\`。
3. 判斷兩者是否相等（boolean），存到 \`areSame\`。`,
        examples: [
          {
            input: `str = 'hello'`,
            output: `fromNaN === ''，fromZero === ''，areSame === true`,
          },
        ],
        initialCode: `const str = 'hello'

// TODO: repeat(NaN)，存到 fromNaN
let fromNaN

// TODO: repeat(0)，存到 fromZero
let fromZero

// TODO: 判斷兩者是否相等，存到 areSame（boolean）
let areSame
`,
        testCases: [
          { label: 'fromNaN 應為空字串', test: `return fromNaN === ''` },
          { label: 'fromZero 應為空字串', test: `return fromZero === ''` },
          { label: 'areSame 應為 true', test: `return areSame === true` },
          { label: '驗證 NaN 行為', test: `return 'abc'.repeat(NaN) === ''` },
        ],
      },
    ],
  },

  // ─── charAt() / str[i] / at() ────────────────────────────────────────────
  {
    slug: 'str-charat',
    methodName: 'charAt() / str[i] / at()',
    title: 'charAt() / str[i] / at()',
    description: '取得字串中指定位置的字元，at() 支援負數索引',
    subCategory: '字元存取',
    difficulty: 'easy',
    notes: {
      title: 'charAt() / str[i] / at()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`str.charAt(index)\`
\`str[index]\`
\`str.at(index)\`

| 方法 | 負數索引 | 超出範圍回傳 |
|------|----------|------------|
| \`charAt(i)\` | 不支援（視為 0） | \`''\`（空字串） |
| \`str[i]\` | 不支援 | \`undefined\` |
| \`at(i)\` | **支援**（-1 為最後一個） | \`undefined\` |

- \`at(-1)\`：最後一個字元；\`at(-2)\`：倒數第二個，以此類推。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const s = 'hello'

// 取第一個字元
s.charAt(0)   // 'h'
s[0]          // 'h'
s.at(0)       // 'h'

// 取最後一個字元
s.charAt(s.length - 1)  // 'o'
s[s.length - 1]         // 'o'
s.at(-1)                // 'o'  ← 最簡潔

// 超出範圍
s.charAt(99)  // ''
s[99]         // undefined
s.at(-99)     // undefined
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- \`at()\` 是 ES2022 的新方法，語意最清楚，推薦用來取得倒數位置的字元。
- \`str[i]\` 等同 bracket notation，與 \`charAt\` 的主要差異在於超出範圍時一個回傳空字串，一個回傳 \`undefined\`。
- 字串是不可變的（immutable），這三種方式只能**讀取**，不能用來賦值（\`str[0] = 'x'\` 在非嚴格模式下靜默失敗）。
- \`charAt\` 傳入非整數或 NaN 時，視為索引 0。`,
        },
      ],
    },
    keyPoints: [
      'charAt(i) 和 str[i] 都可以取得指定索引的字元，差異在於超出範圍時 charAt 回傳空字串，str[i] 回傳 undefined。',
      'at() 是 ES2022 新增的方法，最大的優點是支援負數索引，at(-1) 直接取得最後一個字元，不需要寫 str[str.length - 1]。',
      '三種方法都只能讀取字元，不能修改，因為字串是不可變的。',
      '面試中常用 charAt 或 at 搭配迴圈逐字元遍歷字串，例如驗證密碼格式或計算特定字元出現次數。',
    ],
    problems: [
      {
        id: 'basic',
        title: '取得字串的首尾字元',
        difficulty: 'easy',
        description: `請分別使用 \`charAt\`、\`str[i]\` 和 \`at()\` 三種方式，取得字串 \`word\` 的第一個字元和最後一個字元。

- 用 \`charAt(0)\` 存到 \`firstByCharAt\`
- 用 \`word[0]\` 存到 \`firstByBracket\`
- 用 \`at(0)\` 存到 \`firstByAt\`
- 用 \`at(-1)\` 存到 \`lastByAt\`
- 用 \`charAt(word.length - 1)\` 存到 \`lastByCharAt\``,
        examples: [
          { input: `word = 'JavaScript'`, output: `first = 'J', last = 't'` },
        ],
        initialCode: `const word = 'JavaScript'

// 請用三種方式分別取得首字元
const firstByCharAt = word.charAt(0)
const firstByBracket = word[0]
const firstByAt = word.at(0)

// 請用兩種方式取得末字元
// 提示：at() 支援負數索引
let lastByAt
let lastByCharAt
`,
        testCases: [
          {
            label: 'firstByCharAt 應為 "J"',
            test: `return firstByCharAt === 'J'`,
          },
          {
            label: 'firstByBracket 應為 "J"',
            test: `return firstByBracket === 'J'`,
          },
          {
            label: 'firstByAt 應為 "J"',
            test: `return firstByAt === 'J'`,
          },
          {
            label: 'lastByAt 應為 "t"（使用 at(-1)）',
            test: `return lastByAt === 't'`,
          },
          {
            label: 'lastByCharAt 應為 "t"',
            test: `return lastByCharAt === 't'`,
          },
        ],
      },
      {
        id: 'initials',
        title: '取姓名縮寫',
        difficulty: 'easy',
        description: `員工名牌系統需要顯示每個人的英文名縮寫（Initials）。
請實作函式 \`getInitials(fullName)\`，從全名中取出每個單詞的首字母，組成大寫縮寫字串。

例如 \`"John Michael Doe"\` → \`"JMD"\`。

提示：結合 \`split(' ')\`、\`map\` 和 \`charAt(0)\`（或 \`at(0)\`）。`,
        examples: [
          { input: `getInitials('John Michael Doe')`, output: `'JMD'` },
          { input: `getInitials('Alice Wang')`, output: `'AW'` },
        ],
        initialCode: `// 請實作 getInitials 函式
// 傳入英文全名，回傳每個單詞首字母組成的大寫縮寫
// 例如：getInitials('John Michael Doe') → 'JMD'
function getInitials(fullName) {
  // 提示：先用 split(' ') 切割，再取每個單詞的 charAt(0) 或 at(0)
}
`,
        testCases: [
          {
            label: 'getInitials("John Michael Doe") 應回傳 "JMD"',
            test: `return getInitials('John Michael Doe') === 'JMD'`,
          },
          {
            label: 'getInitials("Alice Wang") 應回傳 "AW"',
            test: `return getInitials('Alice Wang') === 'AW'`,
          },
          {
            label: 'getInitials("Bruce Lee") 應回傳 "BL"',
            test: `return getInitials('Bruce Lee') === 'BL'`,
          },
          {
            label: '縮寫應為大寫',
            test: `return getInitials('john doe') === 'JD'`,
          },
        ],
      },
      {
        id: 'validate-char',
        title: '驗證密碼包含大寫字母',
        difficulty: 'medium',
        description: `密碼強度檢查器需要確認密碼中至少包含一個大寫英文字母（A–Z）。
請實作函式 \`hasUpperCase(password)\`，若密碼中含有大寫字母則回傳 \`true\`，否則回傳 \`false\`。

請用 \`charAt\` 或 \`at\` 搭配迴圈（或 \`split\` + \`some\`）逐字元檢查。`,
        examples: [
          { input: `hasUpperCase('hello123')`, output: `false` },
          { input: `hasUpperCase('Hello123')`, output: `true` },
          { input: `hasUpperCase('UPPER')`, output: `true` },
        ],
        initialCode: `// 請實作 hasUpperCase 函式
// 傳入密碼字串，判斷是否包含至少一個大寫英文字母（A-Z）
// 方法一：for 迴圈 + charAt 逐字元比較
// 方法二：split('') + some 搭配條件判斷
function hasUpperCase(password) {
  // 在這裡撰寫你的程式碼
}
`,
        testCases: [
          {
            label: '"hello123" 不含大寫，應回傳 false',
            test: `return hasUpperCase('hello123') === false`,
          },
          {
            label: '"Hello123" 含大寫 H，應回傳 true',
            test: `return hasUpperCase('Hello123') === true`,
          },
          {
            label: '"UPPER" 全大寫，應回傳 true',
            test: `return hasUpperCase('UPPER') === true`,
          },
          {
            label: '"abc!@#" 不含大寫，應回傳 false',
            test: `return hasUpperCase('abc!@#') === false`,
          },
        ],
      },
    ],
  },

  // ─── toLocaleString() / Intl.NumberFormat ────────────────────────────────
  {
    slug: 'str-locale',
    methodName: 'toLocaleString() / Intl.NumberFormat',
    title: 'toLocaleString() / Intl.NumberFormat',
    description: '依地區設定格式化數字與金額，支援千分位、幣別符號等',
    subCategory: '金額格式化',
    difficulty: 'medium',
    notes: {
      title: 'toLocaleString() / Intl.NumberFormat',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`number.toLocaleString([locale[, options]])\`
\`new Intl.NumberFormat(locale, options).format(number)\`

- \`locale\`：語系標籤，例如 \`'zh-TW'\`（繁體中文台灣）、\`'en-US'\`、\`'ja-JP'\`。
- \`options\`：格式設定物件，常用屬性：
  - \`style\`：\`'decimal'\` / \`'currency'\` / \`'percent'\`
  - \`currency\`：幣別代碼，如 \`'TWD'\`、\`'USD'\`、\`'JPY'\`
  - \`minimumFractionDigits\` / \`maximumFractionDigits\`：小數位數
  - \`currencyDisplay\`：\`'symbol'\`（$）/ \`'code'\`（USD）/ \`'name'\`（US dollars）
- 回傳：**格式化後的字串**。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const n = 1234567.89

// 千分位格式（自動依瀏覽器語系）
n.toLocaleString()              // '1,234,567.89'（en-US）

// 指定語系
n.toLocaleString('zh-TW')       // '1,234,567.89'

// 台幣格式
n.toLocaleString('zh-TW', {
  style: 'currency',
  currency: 'TWD',
  maximumFractionDigits: 0,
})  // 'NT$1,234,568'

// Intl.NumberFormat（建議用法，可重複使用格式器）
const fmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})
fmt.format(1234.5)  // '$1,234.50'
fmt.format(99)      // '$99.00'
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- \`toLocaleString\` 的輸出依瀏覽器與作業系統的語系設定，在不同環境可能不同；若需穩定輸出，一定要明確傳入 \`locale\`。
- \`Intl.NumberFormat\` 建議在需要多次格式化同一設定時使用，可以先建立格式器再重複呼叫 \`.format()\`，效能較好。
- JPY（日圓）預設無小數位；TWD（台幣）預設有 2 位小數，常需手動設 \`maximumFractionDigits: 0\`。
- \`currencyDisplay\` 預設為 \`'symbol'\`，台幣符號為 \`NT$\`，美元為 \`$\`。`,
        },
      ],
    },
    keyPoints: [
      'toLocaleString 可以直接在數字上呼叫，傳入語系和選項來格式化成千分位或幣別格式。',
      'Intl.NumberFormat 是更正式的 API，適合需要重複格式化同種格式的場景，先建立格式器再呼叫 format。',
      '一定要明確傳入 locale 字串，例如 zh-TW 或 en-US，否則輸出會依瀏覽器環境而異，在測試中不穩定。',
      'currency 選項需要搭配 style: "currency" 才有效，幣別代碼用 ISO 4217 標準，例如 TWD、USD、JPY。',
      '日圓（JPY）預設不顯示小數，台幣（TWD）預設顯示兩位小數，可用 maximumFractionDigits 調整。',
      '面試中常考的應用場景是電商金額顯示，要能根據不同幣別切換格式，這時 Intl.NumberFormat 是最適合的工具。',
    ],
    problems: [
      {
        id: 'basic',
        title: '格式化數字為千分位顯示',
        difficulty: 'easy',
        description: `報表系統需要把大數字格式化成易讀的千分位格式。
請用 \`toLocaleString\` 把 \`amount\` 格式化：

1. \`formatted\`：使用 \`'en-US'\` 語系，保留兩位小數 → \`"1,234,567.89"\`
2. \`formattedTW\`：使用 \`'zh-TW'\` 語系，不顯示小數 → \`"1,234,568"\``,
        examples: [
          { input: `amount = 1234567.89`, output: `formatted = '1,234,567.89'`, note: 'en-US，2 位小數' },
          { input: `amount = 1234567.89`, output: `formattedTW = '1,234,568'`, note: 'zh-TW，0 位小數' },
        ],
        initialCode: `const amount = 1234567.89

// 1. 用 en-US 語系格式化，保留兩位小數
// 提示：toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
let formatted

// 2. 用 zh-TW 語系格式化，不顯示小數
// 提示：maximumFractionDigits: 0
let formattedTW
`,
        testCases: [
          {
            label: 'formatted 應為 "1,234,567.89"',
            test: `return formatted === '1,234,567.89'`,
          },
          {
            label: 'formattedTW 應為 "1,234,568"',
            test: `return formattedTW === '1,234,568'`,
          },
          {
            label: 'formatted 包含千分位逗號',
            test: `return formatted.includes(',')`,
          },
        ],
      },
      {
        id: 'currency',
        title: '電商多幣別金額格式化',
        difficulty: 'medium',
        description: `跨境電商需要依幣別顯示不同格式的金額。
請實作函式 \`formatCurrency(amount, currency)\`，使用 \`Intl.NumberFormat\` 格式化金額：

- \`'TWD'\`：使用 \`'zh-TW'\` 語系，最多 0 位小數 → \`"NT$1,234"\`
- \`'USD'\`：使用 \`'en-US'\` 語系，固定 2 位小數 → \`"$1,234.00"\`
- \`'JPY'\`：使用 \`'ja-JP'\` 語系，最多 0 位小數 → \`"￥1,234"\``,
        constraints: [
          'currency 只會傳入 "TWD"、"USD"、"JPY" 其中之一',
          '必須使用 Intl.NumberFormat',
          'TWD 和 JPY 不顯示小數，USD 顯示 2 位小數',
        ],
        examples: [
          { input: `formatCurrency(1234, 'TWD')`, output: `'NT$1,234'` },
          { input: `formatCurrency(1234, 'USD')`, output: `'$1,234.00'` },
          { input: `formatCurrency(1234, 'JPY')`, output: `'￥1,234'` },
        ],
        initialCode: `// 請實作 formatCurrency 函式
// 傳入金額和幣別代碼，回傳對應格式的字串
// 幣別：TWD (zh-TW, 0 小數) | USD (en-US, 2 小數) | JPY (ja-JP, 0 小數)
function formatCurrency(amount, currency) {
  // 提示：用物件或 if/switch 依幣別設定 locale 和 options
  // 再用 new Intl.NumberFormat(locale, { style: 'currency', currency, ... }).format(amount)
}
`,
        testCases: [
          {
            label: 'formatCurrency(1234, "TWD") 應回傳 "NT$1,234"',
            test: `return formatCurrency(1234, 'TWD') === 'NT$1,234'`,
          },
          {
            label: 'formatCurrency(1234, "USD") 應回傳 "$1,234.00"',
            test: `return formatCurrency(1234, 'USD') === '$1,234.00'`,
          },
          {
            label: 'formatCurrency(1234, "JPY") 應回傳 "￥1,234"',
            test: `return formatCurrency(1234, 'JPY') === '￥1,234'`,
          },
          {
            label: 'formatCurrency(0, "USD") 應回傳 "$0.00"',
            test: `return formatCurrency(0, 'USD') === '$0.00'`,
          },
        ],
      },
    ],
  },

  // ─── lastIndexOf() ───────────────────────────────────────────────────────
  {
    slug: 'str-lastindexof',
    methodName: 'lastIndexOf()',
    title: 'String.lastIndexOf()',
    description: '從字串末尾往前搜尋，找出子字串最後一次出現的索引。',
    subCategory: '搜尋與判斷',
    difficulty: 'medium',
    notes: {
      title: 'lastIndexOf()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`str.lastIndexOf(searchValue[, fromIndex])\`

- 回傳：找到時回傳**索引**（number），找不到回傳 **-1**。
- \`fromIndex\`：從這個位置**往前**搜尋，預設為 \`str.length - 1\`（從最後開始）。
- 區分大小寫。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const s = 'abcabc'

s.lastIndexOf('a')      // 3（最後一次出現）
s.lastIndexOf('a', 2)   // 0（從索引 2 往前找）
s.lastIndexOf('a', 0)   // 0
s.lastIndexOf('x')      // -1（找不到）

// 常見用途：取路徑最後一個 / 之後的部分
const path = '/users/admin/profile'
const last = path.lastIndexOf('/')  // 12
path.slice(last + 1)                // 'profile'
\`\`\``,
        },
        {
          heading: '與 indexOf 的比較',
          content: `- \`indexOf\`：從頭往後找，回傳**第一次**出現的位置。
- \`lastIndexOf\`：從尾往前找，回傳**最後一次**出現的位置。
- \`fromIndex\` 在 \`lastIndexOf\` 中是往前搜尋的起點，與 \`indexOf\` 的往後搜尋方向**相反**。`,
        },
      ],
    },
    keyPoints: [
      'lastIndexOf 從字串末尾往前找，回傳最後一次出現的索引，找不到回傳 -1。',
      '第二個參數 fromIndex 指定從哪個索引位置「往前」搜尋，預設從字串末尾開始。',
      '與 indexOf 的差異：lastIndexOf 找最後一次，indexOf 找第一次。',
      '常用於從路徑字串取得最後一個斜線之後的段落。',
      '同樣區分大小寫，搜尋時大小寫必須完全一致。',
    ],
    problems: [
      {
        id: 'basic',
        title: '版本紀錄：找出最後一次發布的版本號',
        difficulty: 'easy',
        description: `部署日誌記錄了多次版本發布，需要找出**最後一次**發布版本號的起始位置。

給定日誌字串 \`deployLog\`，
1. 使用 \`lastIndexOf('v')\` 找出最後一個版本號前綴 \`'v'\` 的索引，存到 \`lastV\`。
2. 使用 \`slice(lastV)\` 截取最後一個版本號到字串結尾，存到 \`lastVersion\`。`,
        examples: [
          {
            input: `deployLog = 'deployed v1.0.0, patched v1.0.1, upgraded v2.0.0'`,
            output: `lastV === 48，lastVersion === 'v2.0.0'`,
          },
        ],
        initialCode: `const deployLog = 'deployed v1.0.0, patched v1.0.1, upgraded v2.0.0'

// TODO: 找出最後一個 'v' 的索引，存到 lastV
let lastV

// TODO: 用 slice 截取最後一個版本號，存到 lastVersion
let lastVersion
`,
        testCases: [
          { label: 'lastV 應為 48', test: `return lastV === 48` },
          { label: 'lastVersion 應為 "v2.0.0"', test: `return lastVersion === 'v2.0.0'` },
          {
            label: '能正確處理只有一個版本的情況',
            test: `const s = 'deployed v1.0.0'; const lv = s.lastIndexOf('v'); return s.slice(lv) === 'v1.0.0'`,
          },
        ],
      },
      {
        id: 'from-index',
        title: '日誌分析：只搜尋前段紀錄的最後一筆錯誤',
        difficulty: 'medium',
        description: `錯誤分析工具需要在**只看前 N 個字元**的範圍內，找出最後一筆 \`'ERROR'\` 的位置。

\`lastIndexOf(searchValue, fromIndex)\` 的第二參數指定從哪個索引**往前**搜尋，
所以 \`log.lastIndexOf('ERROR', 30)\` 等於「在前 31 個字元內，找最後一次出現的 ERROR」。

給定日誌 \`log\`，
1. 用 \`lastIndexOf('ERROR', 30)\` 在前 31 個字元內找最後一個 \`'ERROR'\`，存到 \`lastInRange\`。
2. 用 \`lastIndexOf('ERROR')\`（不限範圍）找整體最後一個，存到 \`lastOverall\`。`,
        examples: [
          {
            input: `log = 'ERROR: 404, INFO: ok, ERROR: 500, INFO: done'`,
            output: `lastInRange === 0，lastOverall === 22`,
          },
        ],
        constraints: [
          'lastInRange 必須使用 lastIndexOf 的第二個參數',
        ],
        initialCode: `const log = 'ERROR: 404, INFO: ok, ERROR: 500, INFO: done'

// TODO: 在前 31 個字元內找最後一個 'ERROR'，存到 lastInRange
let lastInRange

// TODO: 不限範圍，找整體最後一個 'ERROR'，存到 lastOverall
let lastOverall
`,
        testCases: [
          { label: 'lastInRange 應為 0', test: `return lastInRange === 0` },
          { label: 'lastOverall 應為 22', test: `return lastOverall === 22` },
          {
            label: 'fromIndex 限縮了搜尋範圍',
            test: `const s = 'ERROR: 404, INFO: ok, ERROR: 500'; return s.lastIndexOf('ERROR', 10) === 0`,
          },
          {
            label: '超出範圍後找不到回傳 -1',
            test: `return 'INFO: ok'.lastIndexOf('ERROR', 10) === -1`,
          },
        ],
      },
    ],
  },
]
