import type { MethodEntry } from './array-challenges'

export const numChallengesPart1: MethodEntry[] = [
  // ─── num-number ───────────────────────────────────────────────────────────
  {
    slug: 'num-number',
    methodName: 'Number()',
    title: 'Number()',
    description: '將各種型別的值轉換成數字，是 JavaScript 最基礎的型別轉換函式。',
    subCategory: '型別轉換',
    difficulty: 'easy',
    notes: {
      title: 'Number()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`Number(value)\`

- 回傳：**number**。
- 若無法轉換，回傳 \`NaN\`（Not a Number）。
- 常見轉換規則：
  - \`Number('42')\` → \`42\`
  - \`Number('3.14')\` → \`3.14\`
  - \`Number('')\` → \`0\`
  - \`Number(true)\` → \`1\`，\`Number(false)\` → \`0\`
  - \`Number(null)\` → \`0\`
  - \`Number(undefined)\` → \`NaN\`
  - \`Number('abc')\` → \`NaN\``,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
Number('42')        // 42
Number('3.14')      // 3.14
Number('')          // 0
Number(true)        // 1
Number(false)       // 0
Number(null)        // 0
Number(undefined)   // NaN
Number('123abc')    // NaN

// 表單處理常見用法
const input = '100'
const price = Number(input)
console.log(price + 50)  // 150（數字相加，不是字串串接）
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- \`Number(null)\` 是 \`0\`，但 \`Number(undefined)\` 是 \`NaN\`，兩者不同。
- 空字串 \`''\` 轉換結果是 \`0\`，不是 \`NaN\`。
- 含有任何非數字字元（如 \`'123px'\`）就會得到 \`NaN\`，這點與 \`parseInt\` 不同。
- 建議用 \`isNaN()\` 或 \`Number.isNaN()\` 驗證轉換結果是否有效。`,
        },
      ],
    },
    keyPoints: [
      'Number() 把各種型別強制轉換成數字，成功就回傳數字，無法轉換就回傳 NaN。',
      'null 轉換結果是 0，undefined 轉換結果是 NaN，這是兩個最常被搞混的邊界情況。',
      '空字串 "" 轉換是 0，布林 true 是 1，false 是 0。',
      '只要字串含有任何非數字字元（例如 "42px"），Number() 就直接回傳 NaN，不像 parseInt 那樣解析開頭部分。',
      '表單 input 的 value 永遠是字串，提交前記得用 Number() 轉換再做計算，否則會變成字串串接。',
      '轉換後記得用 isNaN() 或 Number.isNaN() 驗證結果，確保資料有效再繼續處理。',
    ],
    problems: [
      // ── basic ──
      {
        id: 'basic',
        title: '型別轉換基礎：認識 Number() 的轉換規則',
        difficulty: 'easy',
        description: `\`Number()\` 可以把字串、布林、null 等型別轉成數字。

請依序完成以下轉換，並將結果存到對應的變數：
1. 把字串 \`'42'\` 轉成數字，存到 \`fromString\`
2. 把布林 \`true\` 轉成數字，存到 \`fromTrue\`
3. 把布林 \`false\` 轉成數字，存到 \`fromFalse\`
4. 把 \`null\` 轉成數字，存到 \`fromNull\``,
        examples: [
          {
            input: `Number('42')、Number(true)、Number(false)、Number(null)`,
            output: `42、1、0、0`,
          },
        ],
        initialCode: `// TODO: 把字串 '42' 轉成數字
let fromString

// TODO: 把布林 true 轉成數字
let fromTrue

// TODO: 把布林 false 轉成數字
let fromFalse

// TODO: 把 null 轉成數字
let fromNull
`,
        testCases: [
          { label: 'fromString 應為 42', test: `return fromString === 42` },
          { label: 'fromTrue 應為 1', test: `return fromTrue === 1` },
          { label: 'fromFalse 應為 0', test: `return fromFalse === 0` },
          { label: 'fromNull 應為 0', test: `return fromNull === 0` },
          { label: '所有結果型別應為 number', test: `return typeof fromString === 'number' && typeof fromTrue === 'number' && typeof fromFalse === 'number' && typeof fromNull === 'number'` },
        ],
      },
      // ── edge ──
      {
        id: 'edge',
        title: 'NaN 邊界情境：哪些轉換會失敗？',
        difficulty: 'easy',
        description: `並非所有值都能順利轉換成數字，無法轉換時 \`Number()\` 會回傳 \`NaN\`。

請把以下三個值分別用 \`Number()\` 轉換，再用 \`isNaN()\` 判斷是否為 NaN，將布林結果存到對應變數：
1. 轉換 \`'123abc'\`，存到 \`nanFromStr\`（用 isNaN 判斷）
2. 轉換 \`undefined\`，存到 \`nanFromUndef\`（用 isNaN 判斷）
3. 轉換 \`''\`（空字串），存到 \`nanFromEmpty\`（用 isNaN 判斷）

**提示**：空字串 \`''\` 轉換結果是 \`0\`，不是 \`NaN\`！`,
        examples: [
          {
            input: `isNaN(Number('123abc'))`,
            output: `true（無法轉換，得到 NaN）`,
          },
          {
            input: `isNaN(Number(''))`,
            output: `false（空字串轉換結果是 0）`,
          },
        ],
        initialCode: `// TODO: 用 Number() 轉換 '123abc'，再用 isNaN() 判斷，存到 nanFromStr
let nanFromStr

// TODO: 用 Number() 轉換 undefined，再用 isNaN() 判斷，存到 nanFromUndef
let nanFromUndef

// TODO: 用 Number() 轉換 ''（空字串），再用 isNaN() 判斷，存到 nanFromEmpty
let nanFromEmpty
`,
        testCases: [
          { label: 'nanFromStr 應為 true（"123abc" 得到 NaN）', test: `return nanFromStr === true` },
          { label: 'nanFromUndef 應為 true（undefined 得到 NaN）', test: `return nanFromUndef === true` },
          { label: 'nanFromEmpty 應為 false（空字串得到 0，不是 NaN）', test: `return nanFromEmpty === false` },
          { label: '所有結果應為 boolean 型別', test: `return typeof nanFromStr === 'boolean' && typeof nanFromUndef === 'boolean' && typeof nanFromEmpty === 'boolean'` },
        ],
      },
      // ── form-parse ──
      {
        id: 'form-parse',
        title: '表單輸入處理：字串陣列轉有效數字陣列',
        difficulty: 'medium',
        description: `電商結帳頁面的折扣碼輸入框允許使用者輸入多個折扣點數，以逗號分隔。
後端傳回的原始資料是字串陣列，需要轉成數字陣列，並過濾掉無效值（NaN）。

已知 \`rawInputs\` 為使用者輸入的字串陣列，請完成以下步驟：
1. 將每個元素用 \`Number()\` 轉換成數字
2. 用 \`Array.filter()\` 搭配 \`isNaN()\` 過濾掉轉換失敗的項目（NaN）
3. 將最終結果存到 \`validNumbers\``,
        examples: [
          {
            input: `rawInputs = ['10', '20', 'abc', '30', '']`,
            output: `validNumbers = [10, 20, 30]`,
            note: `'abc' 轉換為 NaN 被過濾；'' 轉換為 0，0 不是 NaN，所以保留`,
          },
        ],
        constraints: [
          '必須使用 Number() 做型別轉換',
          '必須使用 Array.filter() 搭配 isNaN() 過濾',
        ],
        initialCode: `const rawInputs = ['10', '20', 'abc', '30', '']

// TODO: 先用 map 把每個元素轉成數字，再用 filter + isNaN 過濾掉 NaN
// 將結果存到 validNumbers
let validNumbers
`,
        testCases: [
          { label: 'validNumbers 應為陣列', test: `return Array.isArray(validNumbers)` },
          { label: 'validNumbers 長度應為 4（含 0）', test: `return validNumbers.length === 4` },
          { label: 'validNumbers 應包含 10、20、30、0', test: `return validNumbers[0] === 10 && validNumbers[1] === 20 && validNumbers[2] === 30 && validNumbers[3] === 0` },
          { label: '所有元素應為 number 型別', test: `return validNumbers.every(n => typeof n === 'number')` },
          {
            label: '另一組含多個無效值也能正確過濾',
            test: `const r = ['5', 'x', '', '15', 'nope']; const v = r.map(Number).filter(n => !isNaN(n)); return v.length === 3 && v[0] === 5 && v[1] === 0 && v[2] === 15`,
          },
        ],
      },
    ],
  },

  // ─── num-parseint ─────────────────────────────────────────────────────────
  {
    slug: 'num-parseint',
    methodName: 'parseInt()',
    title: 'parseInt()',
    description: '從字串開頭解析整數，遇到第一個無效字元就停止，支援進位系統轉換。',
    subCategory: '型別轉換',
    difficulty: 'easy',
    notes: {
      title: 'parseInt()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`parseInt(string[, radix])\`

- 回傳：**整數**（number）；無法解析時回傳 \`NaN\`。
- \`radix\`：進位系統（2～36），**強烈建議每次都明確傳入**，預設行為視瀏覽器而定。
- 解析規則：從字串開頭掃描，遇到第一個不合法字元就**停止**，回傳目前已解析的整數。
  - \`'42px'\` → \`42\`
  - \`'px42'\` → \`NaN\`（第一個字元就無效）
  - \`'3.14'\` → \`3\`（只取整數部分）`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
parseInt('42px', 10)      // 42  ← 遇到 p 停止
parseInt('px42', 10)      // NaN ← 第一個字元就不合法
parseInt('3.14', 10)      // 3   ← 捨棄小數
parseInt('  8  ', 10)     // 8   ← 自動去除前後空白

// 進位轉換
parseInt('ff', 16)        // 255 ← 16 進位轉 10 進位
parseInt('101', 2)        // 5   ← 2 進位轉 10 進位
parseInt('17', 8)         // 15  ← 8 進位轉 10 進位
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- **一定要傳第二個參數 radix**（通常是 10），否則 \`'08'\` 在舊版瀏覽器可能被視為 8 進位。
- \`parseInt\` 只取整數，想保留小數請用 \`parseFloat\`。
- 空字串 \`''\` 回傳 \`NaN\`（與 \`Number('')\` 的 0 不同）。
- \`parseInt\` vs \`Number\`：前者容錯性高（取開頭合法部分），後者必須整個字串都合法。`,
        },
      ],
    },
    keyPoints: [
      'parseInt 從字串開頭開始解析，遇到第一個不合法的字元就停止，回傳截至目前的整數。',
      '第二個參數 radix 代表進位系統，強烈建議每次都明確寫上 10，避免舊環境解析行為不一致。',
      'parseInt("ff", 16) 可以把 16 進位字串轉成 10 進位整數 255，這是顏色值處理的常見技巧。',
      'parseInt 只回傳整數，"3.14" 會得到 3，想保留小數要改用 parseFloat。',
      '與 Number() 最大的差異：Number("42px") 是 NaN，但 parseInt("42px", 10) 是 42。',
      '空字串 "" 傳給 parseInt 得到 NaN，這和 Number("") 得到 0 是不同的行為。',
    ],
    problems: [
      // ── basic ──
      {
        id: 'basic',
        title: 'CSS 值解析：從帶單位字串取出整數',
        difficulty: 'easy',
        description: `前端在操作 DOM 樣式時，常常需要從帶單位的字串（如 \`'24px'\`、\`'100%'\`）中取出純數字做計算。

請用 \`parseInt()\` 把以下三個帶單位的字串解析成整數，存到對應變數：
1. 解析 \`'24px'\`，存到 \`fontSize\`
2. 解析 \`'1.5rem'\`，存到 \`lineHeight\`（取整數部分）
3. 解析 \`'750ms'\`，存到 \`duration\`

**記得傳入 radix 10。**`,
        examples: [
          {
            input: `parseInt('24px', 10)`,
            output: `24`,
            note: `遇到 'p' 停止解析，回傳前面的整數`,
          },
          {
            input: `parseInt('1.5rem', 10)`,
            output: `1`,
            note: `遇到 '.' 停止解析，只取整數部分`,
          },
        ],
        initialCode: `// TODO: 用 parseInt 解析 '24px'，存到 fontSize
let fontSize

// TODO: 用 parseInt 解析 '1.5rem'，存到 lineHeight（只取整數）
let lineHeight

// TODO: 用 parseInt 解析 '750ms'，存到 duration
let duration
`,
        testCases: [
          { label: 'fontSize 應為 24', test: `return fontSize === 24` },
          { label: 'lineHeight 應為 1', test: `return lineHeight === 1` },
          { label: 'duration 應為 750', test: `return duration === 750` },
          { label: '所有結果應為 number 型別', test: `return typeof fontSize === 'number' && typeof lineHeight === 'number' && typeof duration === 'number'` },
        ],
      },
      // ── radix ──
      {
        id: 'radix',
        title: '進位轉換：16 進位與 2 進位解析',
        difficulty: 'medium',
        description: `\`parseInt()\` 的第二個參數 \`radix\` 讓你可以把不同進位的字串轉成十進位整數。

這在處理顏色代碼（16 進位）或二元旗標（2 進位）時非常有用。

請完成以下三個進位轉換：
1. 把 16 進位字串 \`'ff'\` 轉成十進位，存到 \`fromHex\`
2. 把 2 進位字串 \`'101'\` 轉成十進位，存到 \`fromBinary\`
3. 把 16 進位字串 \`'1a'\` 轉成十進位，存到 \`fromHex2\``,
        examples: [
          {
            input: `parseInt('ff', 16)`,
            output: `255`,
            note: `f=15，ff = 15×16 + 15 = 255`,
          },
          {
            input: `parseInt('101', 2)`,
            output: `5`,
            note: `1×4 + 0×2 + 1×1 = 5`,
          },
        ],
        initialCode: `// TODO: 把 16 進位 'ff' 轉成十進位整數，存到 fromHex
let fromHex

// TODO: 把 2 進位 '101' 轉成十進位整數，存到 fromBinary
let fromBinary

// TODO: 把 16 進位 '1a' 轉成十進位整數，存到 fromHex2
let fromHex2
`,
        testCases: [
          { label: 'fromHex 應為 255', test: `return fromHex === 255` },
          { label: 'fromBinary 應為 5', test: `return fromBinary === 5` },
          { label: 'fromHex2 應為 26', test: `return fromHex2 === 26` },
          {
            label: '8 進位 "17" 也能正確轉換',
            test: `return parseInt('17', 8) === 15`,
          },
        ],
      },
      // ── vs-number ──
      {
        id: 'vs-number',
        title: 'parseInt vs Number：看見兩者的差異',
        difficulty: 'medium',
        description: `\`parseInt()\` 和 \`Number()\` 都能把字串轉成數字，但行為上有關鍵差異：
- \`parseInt\` 容錯性高，會從字串開頭解析合法的整數部分
- \`Number\` 要求整個字串都合法，否則回傳 NaN

請對以下三個字串，分別用兩種方法轉換，觀察差異：

| 字串 | parseInt 結果 | Number 結果 |
|------|-------------|-------------|
| \`'42px'\` | \`42\` | \`NaN\` |
| \`'3.14'\` | \`3\` | \`3.14\` |
| \`''\`（空字串） | \`NaN\` | \`0\` |

請把 \`'42px'\` 分別用兩種方法轉換的結果存到 \`parseIntResult\` 和 \`numberResult\`，
再用 \`isNaN()\` 分別判斷是否為 NaN，存到 \`parseIntIsNaN\` 和 \`numberIsNaN\`。`,
        examples: [
          {
            input: `'42px'`,
            output: `parseInt: 42（非 NaN）；Number: NaN`,
          },
        ],
        initialCode: `const str = '42px'

// TODO: 用 parseInt(str, 10) 轉換，存到 parseIntResult
let parseIntResult

// TODO: 用 Number(str) 轉換，存到 numberResult
let numberResult

// TODO: 用 isNaN() 判斷 parseIntResult 是否為 NaN，存到 parseIntIsNaN
let parseIntIsNaN

// TODO: 用 isNaN() 判斷 numberResult 是否為 NaN，存到 numberIsNaN
let numberIsNaN
`,
        testCases: [
          { label: 'parseIntResult 應為 42', test: `return parseIntResult === 42` },
          { label: 'numberResult 應為 NaN', test: `return isNaN(numberResult)` },
          { label: 'parseIntIsNaN 應為 false（42 不是 NaN）', test: `return parseIntIsNaN === false` },
          { label: 'numberIsNaN 應為 true（NaN 是 NaN）', test: `return numberIsNaN === true` },
          {
            label: '空字串：parseInt 得 NaN，Number 得 0',
            test: `return isNaN(parseInt('', 10)) === true && Number('') === 0`,
          },
        ],
      },
    ],
  },

  // ─── num-parsefloat ───────────────────────────────────────────────────────
  {
    slug: 'num-parsefloat',
    methodName: 'parseFloat()',
    title: 'parseFloat()',
    description: '從字串開頭解析浮點數（含小數點），遇到第一個無效字元就停止。',
    subCategory: '型別轉換',
    difficulty: 'easy',
    notes: {
      title: 'parseFloat()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`parseFloat(string)\`

- 回傳：**浮點數**（number）；無法解析時回傳 \`NaN\`。
- 無第二個參數（不支援 radix），永遠以十進位解析。
- 解析規則：從字串開頭掃描，遇到第一個不合法字元就**停止**，保留小數點。
  - \`'3.14rem'\` → \`3.14\`
  - \`'1.5e2'\` → \`150\`（支援科學記號）
  - \`'.5'\` → \`0.5\`
  - \`'abc'\` → \`NaN\``,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
parseFloat('3.14rem')    // 3.14  ← 遇到 r 停止
parseFloat('1.5em')      // 1.5
parseFloat('.5')         // 0.5
parseFloat('1.5e2')      // 150  ← 支援科學記號
parseFloat('  8.8  ')    // 8.8  ← 自動去除前後空白
parseFloat('abc')        // NaN  ← 第一個字元就不合法

// CSS 動畫時間解析
const duration = parseFloat('0.3s')   // 0.3
const ms = duration * 1000             // 300
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- \`parseFloat\` 與 \`parseInt\` 最大的差異是**保留小數點**，適合解析有小數的值。
- 不支援進位系統（radix），\`'0xff'\` 會被解析成 \`0\`（遇到 x 就停止）。
- 與 \`Number()\` 的差異：\`parseFloat('3.14rem')\` 是 \`3.14\`，\`Number('3.14rem')\` 是 \`NaN\`。
- 解析後若要做比較，注意浮點數精度問題（如 \`0.1 + 0.2 !== 0.3\`）。`,
        },
      ],
    },
    keyPoints: [
      'parseFloat 從字串開頭解析，保留小數點，遇到第一個不合法字元就停止。',
      '與 parseInt 的差異是 parseFloat 保留小數，"3.14rem" 得到 3.14 而不是 3。',
      '不支援 radix 參數，永遠以十進位解析，這和 parseInt 不同。',
      'CSS 值（如 "1.5rem"、"0.3s"）很適合用 parseFloat 解析出數字再做計算。',
      '與 Number() 的差異：parseFloat("3.14px") 是 3.14，但 Number("3.14px") 是 NaN。',
    ],
    problems: [
      // ── basic ──
      {
        id: 'basic',
        title: 'CSS 值解析：保留小數的單位字串處理',
        difficulty: 'easy',
        description: `在讀取 DOM 元素的計算樣式（computed style）時，會拿到帶單位的字串，
需要取出數字部分才能做計算或比較。

請用 \`parseFloat()\` 解析以下三個 CSS 值，存到對應變數：
1. 解析 \`'3.14rem'\`，存到 \`remValue\`
2. 解析 \`'1.5em'\`，存到 \`emValue\`
3. 解析 \`'0.3s'\`（動畫時間），存到 \`seconds\`，再乘以 1000 轉成毫秒存到 \`milliseconds\``,
        examples: [
          {
            input: `parseFloat('3.14rem')`,
            output: `3.14`,
            note: `遇到 'r' 停止，保留小數`,
          },
        ],
        initialCode: `// TODO: 用 parseFloat 解析 '3.14rem'，存到 remValue
let remValue

// TODO: 用 parseFloat 解析 '1.5em'，存到 emValue
let emValue

// TODO: 用 parseFloat 解析 '0.3s'，存到 seconds
let seconds

// TODO: 把 seconds 乘以 1000，存到 milliseconds
let milliseconds
`,
        testCases: [
          { label: 'remValue 應為 3.14', test: `return remValue === 3.14` },
          { label: 'emValue 應為 1.5', test: `return emValue === 1.5` },
          { label: 'seconds 應為 0.3', test: `return seconds === 0.3` },
          { label: 'milliseconds 應為 300', test: `return milliseconds === 300` },
          { label: '所有解析結果應為 number 型別', test: `return typeof remValue === 'number' && typeof emValue === 'number' && typeof seconds === 'number'` },
        ],
      },
      // ── price-parse ──
      {
        id: 'price-parse',
        title: '電商價格解析：清除格式符號再轉數字',
        difficulty: 'medium',
        description: `電商平台從後端拿到的商品價格可能帶有貨幣符號和千分位逗號，
例如 \`'$1,299.99'\`，需要先清除格式字元再轉成數字。

請完成以下步驟：
1. 對 \`priceStr\` 先用 \`replace\` 移除 \`$\` 符號（替換成空字串 \`''\`）
2. 再用 \`replace\` 移除千分位逗號 \`','\`（使用正規表達式 \`/,/g\` 替換成 \`''\`）
3. 最後用 \`parseFloat\` 解析出數字，存到 \`price\`
4. 計算含稅價格（稅率 0.05），存到 \`priceWithTax\`（可用 \`Math.round\` 四捨五入到整數）`,
        examples: [
          {
            input: `priceStr = '$1,299.99'`,
            output: `price = 1299.99，priceWithTax = 1365（四捨五入）`,
          },
        ],
        constraints: [
          '必須使用 replace() 清除符號',
          '必須使用 parseFloat() 轉換數字',
        ],
        initialCode: `const priceStr = '$1,299.99'

// TODO: 用 replace 移除 '$'，再用 replace(/,/g, '') 移除千分位逗號
// 最後用 parseFloat 解析出數字，存到 price
let price

// TODO: 計算含稅價格（稅率 5%），四捨五入到整數，存到 priceWithTax
let priceWithTax
`,
        testCases: [
          { label: 'price 應為 1299.99', test: `return price === 1299.99` },
          { label: 'price 應為 number 型別', test: `return typeof price === 'number'` },
          { label: 'priceWithTax 應為 1365', test: `return priceWithTax === 1365` },
          {
            label: '另一個價格 "$2,500.00" 也能正確解析',
            test: `const s = '$2,500.00'; const p = parseFloat(s.replace('$', '').replace(/,/g, '')); return p === 2500`,
          },
        ],
      },
    ],
  },

  // ─── num-isnan ────────────────────────────────────────────────────────────
  {
    slug: 'num-isnan',
    methodName: 'isNaN() / Number.isNaN()',
    title: 'isNaN() / Number.isNaN()',
    description: '判斷一個值是否為 NaN，兩者差異在於是否先進行型別強制轉換。',
    subCategory: '型別檢查',
    difficulty: 'easy',
    notes: {
      title: 'isNaN() / Number.isNaN()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`isNaN(value)\`
\`Number.isNaN(value)\`

- 兩者都回傳 **boolean**。
- **\`isNaN(value)\`**（全域函式）：先把 \`value\` 用 \`Number()\` 強制轉型，再判斷是否為 NaN。
  - \`isNaN('hello')\` → \`true\`（因為 Number('hello') 是 NaN）
  - \`isNaN(undefined)\` → \`true\`（因為 Number(undefined) 是 NaN）
- **\`Number.isNaN(value)\`**（ES2015）：**不做型別轉換**，只有值本身就是 NaN 才回傳 true。
  - \`Number.isNaN('hello')\` → \`false\`（字串不是 NaN，即使轉換後會是）
  - \`Number.isNaN(NaN)\` → \`true\``,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
// isNaN（有型別轉換）
isNaN(NaN)          // true
isNaN('hello')      // true  ← Number('hello') = NaN
isNaN(undefined)    // true  ← Number(undefined) = NaN
isNaN('')           // false ← Number('') = 0
isNaN(null)         // false ← Number(null) = 0
isNaN(42)           // false

// Number.isNaN（無型別轉換，更嚴格）
Number.isNaN(NaN)          // true
Number.isNaN('hello')      // false ← 字串不是 NaN 本身
Number.isNaN(undefined)    // false ← undefined 不是 NaN 本身
Number.isNaN(42)           // false
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- **推薦使用 \`Number.isNaN\`** 做精確判斷，行為可預期不會因隱含轉換造成誤判。
- 全域 \`isNaN\` 會先轉型，容易造成 \`isNaN('hello')\` 是 true 這種「字串被當成 NaN」的混淆。
- NaN 的特殊性：NaN 是 JavaScript 中**唯一**一個不等於自身的值（\`NaN !== NaN\`）。
- 可以利用 \`isFinite()\` 搭配使用：\`isFinite(n)\` 同時排除 \`NaN\`、\`Infinity\`、\`-Infinity\`。`,
        },
      ],
    },
    keyPoints: [
      'isNaN 是全域函式，會先把傳入值用 Number() 強制轉型再判斷，所以 isNaN("hello") 是 true。',
      'Number.isNaN 是 ES2015 新增的靜態方法，不做型別轉換，只有值本身是 NaN 才回傳 true。',
      '兩者最大的差異：isNaN("hello") 是 true，Number.isNaN("hello") 是 false。',
      'NaN 是 JavaScript 唯一一個不等於自己的值，所以 NaN !== NaN 是 true，要用 isNaN 判斷。',
      '生產程式碼建議優先使用 Number.isNaN，行為更精確，不會因為隱含型別轉換造成誤判。',
      '可以搭配 isFinite() 做更嚴格的數字驗證，isFinite 同時排除 NaN、Infinity 和 -Infinity。',
    ],
    problems: [
      // ── basic ──
      {
        id: 'basic',
        title: 'NaN 辨別：哪些值是 NaN？',
        difficulty: 'easy',
        description: `\`NaN\`（Not a Number）是一個特殊的數字值，代表「無效的數學運算結果」。

請對以下五個值分別使用 \`isNaN()\` 判斷，將布林結果存到對應變數：
1. \`isNaN(NaN)\` → 存到 \`r1\`
2. \`isNaN(42)\` → 存到 \`r2\`
3. \`isNaN(undefined)\` → 存到 \`r3\`
4. \`isNaN(null)\` → 存到 \`r4\`
5. \`isNaN('hello')\` → 存到 \`r5\``,
        examples: [
          {
            input: `isNaN(NaN)`,
            output: `true`,
          },
          {
            input: `isNaN(null)`,
            output: `false（null 轉換為 0，0 不是 NaN）`,
          },
        ],
        initialCode: `// TODO: 用 isNaN() 判斷以下值，存到對應變數
let r1  // isNaN(NaN)
let r2  // isNaN(42)
let r3  // isNaN(undefined)
let r4  // isNaN(null)
let r5  // isNaN('hello')
`,
        testCases: [
          { label: 'r1 應為 true（NaN 是 NaN）', test: `return r1 === true` },
          { label: 'r2 應為 false（42 不是 NaN）', test: `return r2 === false` },
          { label: 'r3 應為 true（undefined 轉換後是 NaN）', test: `return r3 === true` },
          { label: 'r4 應為 false（null 轉換為 0）', test: `return r4 === false` },
          { label: 'r5 應為 true（"hello" 轉換後是 NaN）', test: `return r5 === true` },
          { label: '所有結果應為 boolean 型別', test: `return [r1, r2, r3, r4, r5].every(v => typeof v === 'boolean')` },
        ],
      },
      // ── strict ──
      {
        id: 'strict',
        title: 'isNaN vs Number.isNaN：型別轉換的影響',
        difficulty: 'medium',
        description: `全域 \`isNaN()\` 和 \`Number.isNaN()\` 看起來功能相似，但有關鍵差異：
- \`isNaN()\`：先用 \`Number()\` 強制轉型，再判斷
- \`Number.isNaN()\`：**不轉型**，只有值本身是 NaN 才回傳 true

請對以下三個值，分別用兩種方法判斷，將結果存到對應變數：
- 對 \`'hello'\`：\`isNaN\` 結果存到 \`globalNaN1\`，\`Number.isNaN\` 結果存到 \`strictNaN1\`
- 對 \`undefined\`：\`isNaN\` 結果存到 \`globalNaN2\`，\`Number.isNaN\` 結果存到 \`strictNaN2\`
- 對 \`NaN\` 本身：\`isNaN\` 結果存到 \`globalNaN3\`，\`Number.isNaN\` 結果存到 \`strictNaN3\``,
        examples: [
          {
            input: `isNaN('hello') vs Number.isNaN('hello')`,
            output: `true vs false`,
            note: `isNaN 先把 "hello" 轉成 NaN 再判斷；Number.isNaN 認為字串本身不是 NaN`,
          },
        ],
        initialCode: `// 對 'hello' 分別用兩種方法
let globalNaN1   // isNaN('hello')
let strictNaN1   // Number.isNaN('hello')

// 對 undefined 分別用兩種方法
let globalNaN2   // isNaN(undefined)
let strictNaN2   // Number.isNaN(undefined)

// 對 NaN 本身分別用兩種方法
let globalNaN3   // isNaN(NaN)
let strictNaN3   // Number.isNaN(NaN)
`,
        testCases: [
          { label: 'globalNaN1 應為 true（isNaN 轉型後判斷）', test: `return globalNaN1 === true` },
          { label: 'strictNaN1 應為 false（Number.isNaN 不轉型）', test: `return strictNaN1 === false` },
          { label: 'globalNaN2 應為 true（undefined 轉型為 NaN）', test: `return globalNaN2 === true` },
          { label: 'strictNaN2 應為 false（undefined 本身不是 NaN）', test: `return strictNaN2 === false` },
          { label: 'globalNaN3 應為 true（NaN 是 NaN）', test: `return globalNaN3 === true` },
          { label: 'strictNaN3 應為 true（NaN 本身就是 NaN）', test: `return strictNaN3 === true` },
        ],
      },
      // ── safe-calc ──
      {
        id: 'safe-calc',
        title: '安全計算函式：除法前先驗證輸入',
        difficulty: 'medium',
        description: `在做除法運算時，若輸入不合法（NaN）或除數為零（得到 Infinity），會讓程式產生預期外的結果。

請實作一個 \`safeDivide(a, b)\` 函式：
- 若 \`a\` 或 \`b\` 是 NaN（用 \`Number.isNaN\` 檢查），回傳 \`null\`
- 若 \`b\` 為 0（除數為零），或結果不是有限數（用 \`isFinite\` 檢查），回傳 \`null\`
- 其他情況回傳 \`a / b\` 的計算結果

驗證：
- \`safeDivide(10, 2)\` → \`5\`
- \`safeDivide(10, 0)\` → \`null\`
- \`safeDivide(NaN, 2)\` → \`null\`
- \`safeDivide(10, NaN)\` → \`null\``,
        examples: [
          {
            input: `safeDivide(10, 2)`,
            output: `5`,
          },
          {
            input: `safeDivide(10, 0)`,
            output: `null（除以零得到 Infinity，不是有限數）`,
          },
        ],
        constraints: [
          '必須使用 Number.isNaN() 檢查 NaN',
          '必須使用 isFinite() 驗證結果',
        ],
        initialCode: `function safeDivide(a, b) {
  // TODO: 若 a 或 b 是 NaN，回傳 null
  // TODO: 若 b 為 0，回傳 null
  // TODO: 否則回傳 a / b（但若結果不是有限數也回傳 null）
}
`,
        testCases: [
          { label: 'safeDivide(10, 2) 應為 5', test: `return safeDivide(10, 2) === 5` },
          { label: 'safeDivide(10, 0) 應為 null', test: `return safeDivide(10, 0) === null` },
          { label: 'safeDivide(NaN, 2) 應為 null', test: `return safeDivide(NaN, 2) === null` },
          { label: 'safeDivide(10, NaN) 應為 null', test: `return safeDivide(10, NaN) === null` },
          { label: 'safeDivide(9, 3) 應為 3', test: `return safeDivide(9, 3) === 3` },
          { label: 'safeDivide(7, 2) 應為 3.5', test: `return safeDivide(7, 2) === 3.5` },
        ],
      },
    ],
  },
]
