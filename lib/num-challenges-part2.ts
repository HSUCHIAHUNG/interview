import type { MethodEntry } from './array-challenges'

export const numChallengesPart2: MethodEntry[] = [
  // ─── num-isfinite ─────────────────────────────────────────────────────────
  {
    slug: 'num-isfinite',
    methodName: 'isFinite() / Number.isFinite()',
    title: 'isFinite() / Number.isFinite()',
    description: '判斷一個值是否為有限數字，兩者差異在於是否進行型別強制轉換。',
    subCategory: '型別檢查',
    difficulty: 'easy',
    notes: {
      title: 'isFinite() / Number.isFinite()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`isFinite(value)\`
\`Number.isFinite(value)\`

兩者都回傳 **boolean**，差異如下：
- 全域 \`isFinite()\`：會先將傳入值**強制轉換為數字**，再判斷是否有限。
- \`Number.isFinite()\`：**不做型別轉換**，非數字型別直接回傳 \`false\`（ES6 引入，更嚴格）。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
isFinite(42)            // true
isFinite(Infinity)      // false
isFinite(-Infinity)     // false
isFinite(NaN)           // false
isFinite('42')          // true  ← 字串 '42' 被轉為 42
isFinite('')            // true  ← 空字串被轉為 0
isFinite(null)          // true  ← null 被轉為 0

Number.isFinite(42)     // true
Number.isFinite(Infinity)   // false
Number.isFinite('42')   // false ← 字串不被轉換，直接 false
Number.isFinite(null)   // false ← null 不被轉換，直接 false
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- 全域 \`isFinite\` 對字串、null 等非數字值會做隱式轉換，容易造成誤判。
- 輸入驗證時建議優先使用 \`Number.isFinite()\`，行為更可預測且語義清晰。
- \`Infinity\` 和 \`-Infinity\` 在兩個方法中都回傳 \`false\`。
- \`NaN\` 在兩個方法中都回傳 \`false\`。`,
        },
      ],
    },
    keyPoints: [
      '全域 isFinite() 會將傳入值強制轉為數字再判斷，所以 isFinite("42") 是 true，空字串和 null 也是 true。',
      'Number.isFinite() 是 ES6 引入的嚴格版本，不做型別轉換，非數字型別一律回傳 false。',
      'Infinity、-Infinity、NaN 在兩個方法中都回傳 false，只有真正有限的數字才回傳 true。',
      '實際開發中驗證表單數字輸入時，建議用 Number.isFinite() 而非全域版本，避免空字串和 null 被誤判為有效數字。',
      '兩者的差異核心在於「要不要相信隱式型別轉換」，現代最佳實踐傾向用 Number.isFinite() 明確表達意圖。',
    ],
    problems: [
      // ── basic ──
      {
        id: 'basic',
        title: '數值感測器：過濾無效讀數',
        difficulty: 'easy',
        description: `IoT 感測器回傳的讀數中可能含有 \`Infinity\`、\`-Infinity\`、\`NaN\` 等無效值。

請判斷下列四個變數，分別用 \`Number.isFinite()\` 判斷是否為有限數字，將結果存到對應的布林變數：
- \`r1 = 98.6\`
- \`r2 = Infinity\`
- \`r3 = NaN\`
- \`r4 = -273.15\``,
        examples: [
          {
            input: `r1 = 98.6, r2 = Infinity, r3 = NaN, r4 = -273.15`,
            output: `v1 = true, v2 = false, v3 = false, v4 = true`,
          },
        ],
        initialCode: `const r1 = 98.6
const r2 = Infinity
const r3 = NaN
const r4 = -273.15

// TODO: 用 Number.isFinite() 分別判斷，存到 v1~v4
let v1
let v2
let v3
let v4
`,
        testCases: [
          { label: 'v1（98.6）應為 true', test: `return v1 === true` },
          { label: 'v2（Infinity）應為 false', test: `return v2 === false` },
          { label: 'v3（NaN）應為 false', test: `return v3 === false` },
          { label: 'v4（-273.15）應為 true', test: `return v4 === true` },
        ],
      },
      // ── strict ──
      {
        id: 'strict',
        title: '嚴格模式比較：isFinite vs Number.isFinite',
        difficulty: 'medium',
        description: `請理解並驗證全域 \`isFinite()\` 和 \`Number.isFinite()\` 對**字串數字**的不同行為。

完成以下四個變數的賦值：
- \`a\`：用全域 \`isFinite('42')\` 判斷
- \`b\`：用 \`Number.isFinite('42')\` 判斷
- \`c\`：用全域 \`isFinite('')\` 判斷（空字串）
- \`d\`：用 \`Number.isFinite('')\` 判斷（空字串）

思考：為什麼結果不同？`,
        examples: [
          {
            input: `isFinite('42') vs Number.isFinite('42')`,
            output: `a = true, b = false`,
            note: `全域版本會將 '42' 強制轉為 42，Number.isFinite 不轉換`,
          },
          {
            input: `isFinite('') vs Number.isFinite('')`,
            output: `c = true, d = false`,
            note: `空字串被全域版本轉為 0（有限數字）`,
          },
        ],
        initialCode: `// 全域 isFinite vs Number.isFinite 對字串的差異

// TODO: 用全域 isFinite('42') 賦值給 a
let a

// TODO: 用 Number.isFinite('42') 賦值給 b
let b

// TODO: 用全域 isFinite('') 賦值給 c
let c

// TODO: 用 Number.isFinite('') 賦值給 d
let d
`,
        testCases: [
          { label: 'isFinite("42") 應為 true（有強制轉換）', test: `return a === true` },
          { label: 'Number.isFinite("42") 應為 false（無強制轉換）', test: `return b === false` },
          { label: 'isFinite("") 應為 true（空字串轉 0）', test: `return c === true` },
          { label: 'Number.isFinite("") 應為 false（字串直接 false）', test: `return d === false` },
          { label: 'a 和 b 應不同', test: `return a !== b` },
          { label: 'c 和 d 應不同', test: `return c !== d` },
        ],
      },
      // ── validate-input ──
      {
        id: 'validate-input',
        title: '購物車：驗證數量欄位輸入',
        difficulty: 'medium',
        description: `電商購物車的數量欄位可能收到各種使用者輸入，需要確保輸入是合法的有限數字，才能加入購物車。

請實作 \`validateQuantity(input)\` 函式：
- 先用 \`Number(input)\` 將輸入轉為數字
- 再用 \`Number.isFinite()\` 確認是否為有限數字
- 若有效，回傳 \`true\`；否則回傳 \`false\`

測試案例：
- \`'3'\` → \`true\`（有效數字字串）
- \`'abc'\` → \`false\`（非數字字串，轉為 NaN）
- \`''\` → \`false\`（不允許空字串，空字串轉 0 但在此情境視為無效）
- \`Infinity\` → \`false\`（無限大不是合法數量）

提示：\`Number('')\` 會得到 \`0\`，可以另外加上 \`input !== ''\` 的條件。`,
        examples: [
          {
            input: `validateQuantity('3')`,
            output: `true`,
          },
          {
            input: `validateQuantity('abc')`,
            output: `false`,
          },
          {
            input: `validateQuantity(Infinity)`,
            output: `false`,
          },
        ],
        constraints: [
          '必須使用 Number.isFinite() 進行有限性判斷',
          '空字串 "" 應回傳 false',
        ],
        initialCode: `function validateQuantity(input) {
  // TODO: 先將 input 轉為數字，再用 Number.isFinite 判斷
  // 注意：空字串應回傳 false
}
`,
        testCases: [
          { label: `validateQuantity('3') 應為 true`, test: `return validateQuantity('3') === true` },
          { label: `validateQuantity('3.5') 應為 true`, test: `return validateQuantity('3.5') === true` },
          { label: `validateQuantity('abc') 應為 false`, test: `return validateQuantity('abc') === false` },
          { label: `validateQuantity('') 應為 false（空字串）`, test: `return validateQuantity('') === false` },
          { label: `validateQuantity(Infinity) 應為 false`, test: `return validateQuantity(Infinity) === false` },
          { label: `validateQuantity(NaN) 應為 false`, test: `return validateQuantity(NaN) === false` },
        ],
      },
    ],
  },

  // ─── num-isinteger ────────────────────────────────────────────────────────
  {
    slug: 'num-isinteger',
    methodName: 'Number.isInteger()',
    title: 'Number.isInteger()',
    description: '嚴格判斷一個值是否為整數，不做型別強制轉換。',
    subCategory: '型別檢查',
    difficulty: 'easy',
    notes: {
      title: 'Number.isInteger()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`Number.isInteger(value)\`

回傳 **boolean**。
- 判斷傳入值是否屬於整數（數學意義上沒有小數部分）。
- **不進行型別轉換**，字串、布林等非數字型別直接回傳 \`false\`。
- ES6（ES2015）引入。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
Number.isInteger(42)      // true
Number.isInteger(42.0)    // true  ← 42.0 === 42，視為整數
Number.isInteger(42.5)    // false
Number.isInteger('42')    // false ← 字串不轉換
Number.isInteger(NaN)     // false
Number.isInteger(Infinity)// false
Number.isInteger(null)    // false
Number.isInteger(true)    // false ← 布林不轉換
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- \`42.0\` 和 \`42\` 在 JavaScript 中完全相同，因此 \`Number.isInteger(42.0)\` 回傳 \`true\`。
- 超出安全整數範圍（> \`Number.MAX_SAFE_INTEGER\`）的值，即使看起來像整數也可能有精度問題。
- 與全域 \`parseInt\` 不同，\`Number.isInteger\` 不解析字串，只做型別判斷。
- 驗證「正整數」時，需要額外加上 \`value > 0\` 的條件。`,
        },
      ],
    },
    keyPoints: [
      'Number.isInteger() 是 ES6 引入的嚴格整數判斷，不做型別轉換，字串與布林值直接回傳 false。',
      '42.0 在 JavaScript 中與 42 完全相等，因此 Number.isInteger(42.0) 回傳 true。',
      '42.5 有小數部分，回傳 false；NaN 和 Infinity 也都回傳 false。',
      '若要驗證「正整數」，需組合 Number.isInteger(n) && n > 0 兩個條件。',
      '和 parseInt 不同，Number.isInteger 只做型別判斷，不嘗試解析字串內容。',
    ],
    problems: [
      // ── basic ──
      {
        id: 'basic',
        title: '庫存管理：判斷數量是否為整數',
        difficulty: 'easy',
        description: `倉儲系統需要確認商品數量欄位是整數（不能是小數、字串或特殊值）。

請用 \`Number.isInteger()\` 分別判斷下列值，並將結果存到對應變數：
- \`q1 = 42\`
- \`q2 = 42.0\`
- \`q3 = 42.5\`
- \`q4 = '42'\`
- \`q5 = NaN\``,
        examples: [
          {
            input: `42, 42.0, 42.5, '42', NaN`,
            output: `r1=true, r2=true, r3=false, r4=false, r5=false`,
            note: `42.0 與 42 相等，視為整數`,
          },
        ],
        initialCode: `const q1 = 42
const q2 = 42.0
const q3 = 42.5
const q4 = '42'
const q5 = NaN

// TODO: 用 Number.isInteger() 分別判斷，存到 r1~r5
let r1
let r2
let r3
let r4
let r5
`,
        testCases: [
          { label: 'r1（42）應為 true', test: `return r1 === true` },
          { label: 'r2（42.0）應為 true（42.0 === 42）', test: `return r2 === true` },
          { label: 'r3（42.5）應為 false', test: `return r3 === false` },
          { label: 'r4（"42" 字串）應為 false', test: `return r4 === false` },
          { label: 'r5（NaN）應為 false', test: `return r5 === false` },
        ],
      },
      // ── paginate ──
      {
        id: 'paginate',
        title: '分頁元件：驗證頁碼合法性',
        difficulty: 'medium',
        description: `分頁元件需要確保傳入的頁碼是**正整數**，才能正確發送 API 請求。

請實作 \`validatePage(page)\` 函式：
- 使用 \`Number.isInteger(page)\` 確認是整數
- 再確認 \`page > 0\`（必須是正數）
- 兩個條件都符合才回傳 \`true\`，否則回傳 \`false\``,
        examples: [
          {
            input: `validatePage(1)`,
            output: `true`,
          },
          {
            input: `validatePage(0)`,
            output: `false（0 不是正整數）`,
          },
          {
            input: `validatePage(2.5)`,
            output: `false（非整數）`,
          },
          {
            input: `validatePage('3')`,
            output: `false（字串）`,
          },
        ],
        constraints: [
          '必須使用 Number.isInteger() 進行整數判斷',
          '頁碼必須大於 0',
        ],
        initialCode: `function validatePage(page) {
  // TODO: 確認 page 是正整數（整數且 > 0）
}
`,
        testCases: [
          { label: 'validatePage(1) 應為 true', test: `return validatePage(1) === true` },
          { label: 'validatePage(10) 應為 true', test: `return validatePage(10) === true` },
          { label: 'validatePage(0) 應為 false（非正數）', test: `return validatePage(0) === false` },
          { label: 'validatePage(-1) 應為 false（負數）', test: `return validatePage(-1) === false` },
          { label: 'validatePage(2.5) 應為 false（小數）', test: `return validatePage(2.5) === false` },
          { label: 'validatePage("3") 應為 false（字串）', test: `return validatePage('3') === false` },
        ],
      },
    ],
  },

  // ─── num-tofixed ──────────────────────────────────────────────────────────
  {
    slug: 'num-tofixed',
    methodName: 'toFixed()',
    title: 'Number.toFixed()',
    description: '將數字格式化為指定小數位數的字串，常用於金額與百分比顯示。',
    subCategory: '格式化',
    difficulty: 'easy',
    notes: {
      title: 'toFixed()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`num.toFixed(digits)\`

- \`digits\`：小數點後要保留的位數（0 ～ 100），預設為 0。
- 回傳：**字串**（string），不是數字。
- 若需要數字，需再包一層 \`Number()\` 或 \`parseFloat()\`。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const price = 19.5
price.toFixed(2)     // '19.50'  ← 字串
price.toFixed(0)     // '20'     ← 四捨五入

const pi = 3.14159
pi.toFixed(3)        // '3.142'

// 注意回傳是字串
typeof (3.14).toFixed(2)  // 'string'

// 要做數學運算需轉回數字
Number((3.14).toFixed(2)) + 1  // 4.14
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- 回傳值是**字串**，進行數值運算前必須轉型。
- 存在浮點數精度問題：\`(1.005).toFixed(2)\` 可能得到 \`'1.00'\` 而非 \`'1.01'\`。
- 更可靠的四捨五入方式：\`Math.round(num * 100) / 100\`，再搭配 \`toFixed\` 補零格式化。
- 不要用 \`toFixed\` 進行精確的財務計算，應使用專門的 Decimal 函式庫。`,
        },
      ],
    },
    keyPoints: [
      'toFixed(digits) 將數字格式化為指定小數位數，回傳值是字串而非數字，進行運算前要記得轉型。',
      '省略 digits 參數或傳入 0 時，會四捨五入到整數並回傳字串。',
      '浮點數精度問題導致 (1.005).toFixed(2) 可能得到 "1.00" 而非預期的 "1.01"。',
      '更可靠的整數四捨五入方式是 Math.round(num * 100) / 100，避開浮點數陷阱。',
      '金額顯示使用 toFixed(2) 是常見做法，但精確財務計算應考慮使用 Decimal.js 等函式庫。',
      'toFixed 傳入的位數若小於原本的小數位數，會進行四捨五入；若多於原本位數，則補零。',
    ],
    problems: [
      // ── basic ──
      {
        id: 'basic',
        title: '商品標價：格式化價格到兩位小數',
        difficulty: 'easy',
        description: `電商平台顯示商品價格時，需要統一格式化到**兩位小數**，例如 \`19.5\` 要顯示為 \`'19.50'\`，\`100\` 要顯示為 \`'100.00'\`。

請用 \`toFixed(2)\` 完成以下格式化：
- 將 \`price1 = 19.5\` 格式化後存到 \`p1\`
- 將 \`price2 = 100\` 格式化後存到 \`p2\`
- 將 \`price3 = 3.14159\` 格式化後存到 \`p3\`

注意：結果應為**字串型別**。`,
        examples: [
          {
            input: `price1 = 19.5`,
            output: `p1 = '19.50'`,
          },
          {
            input: `price2 = 100`,
            output: `p2 = '100.00'`,
          },
          {
            input: `price3 = 3.14159`,
            output: `p3 = '3.14'（四捨五入）`,
          },
        ],
        initialCode: `const price1 = 19.5
const price2 = 100
const price3 = 3.14159

// TODO: 用 toFixed(2) 格式化，分別存到 p1、p2、p3
let p1
let p2
let p3
`,
        testCases: [
          { label: 'p1 應為字串 "19.50"', test: `return p1 === '19.50'` },
          { label: 'p2 應為字串 "100.00"', test: `return p2 === '100.00'` },
          { label: 'p3 應為字串 "3.14"', test: `return p3 === '3.14'` },
          { label: 'p1 型別應為 string', test: `return typeof p1 === 'string'` },
        ],
      },
      // ── currency ──
      {
        id: 'currency',
        title: '購物車結帳：計算並格式化總金額',
        difficulty: 'easy',
        description: `購物車結帳頁面需要計算所有商品的總價，並用 \`toFixed(2)\` 格式化成適合顯示的字串。

請完成以下步驟：
1. 將 \`items\` 陣列中所有商品的 \`price * quantity\` 加總，存到 \`total\`（數字）
2. 用 \`toFixed(2)\` 將 \`total\` 格式化，存到 \`displayTotal\`（字串）`,
        examples: [
          {
            input: `items = [{price: 29.9, quantity: 2}, {price: 5.5, quantity: 3}]`,
            output: `total = 76.3, displayTotal = '76.30'`,
          },
        ],
        initialCode: `const items = [
  { name: '有機燕麥', price: 29.9, quantity: 2 },
  { name: '黑咖啡', price: 5.5, quantity: 3 },
  { name: '橄欖油', price: 189.0, quantity: 1 },
]

// TODO: 計算總金額，存到 total（number）
let total

// TODO: 用 toFixed(2) 格式化 total，存到 displayTotal（string）
let displayTotal
`,
        testCases: [
          { label: 'total 數值應正確（29.9*2 + 5.5*3 + 189）', test: `return Math.abs(total - (29.9*2 + 5.5*3 + 189.0)) < 0.001` },
          { label: 'displayTotal 應為字串', test: `return typeof displayTotal === 'string'` },
          { label: 'displayTotal 應有兩位小數', test: `return /\\.\\d{2}$/.test(displayTotal)` },
          { label: 'displayTotal 數值正確', test: `return parseFloat(displayTotal) === parseFloat((29.9*2 + 5.5*3 + 189.0).toFixed(2))` },
        ],
      },
      // ── round-trap ──
      {
        id: 'round-trap',
        title: 'toFixed 精度陷阱：實作可靠的四捨五入',
        difficulty: 'medium',
        description: `\`toFixed\` 存在浮點數精度陷阱，例如 \`(1.005).toFixed(2)\` 在大多數瀏覽器中得到 \`'1.00'\` 而非預期的 \`'1.01'\`。

請實作 \`reliableRound(num, decimals)\` 函式，使用 **乘除法搭配 Math.round** 來規避此問題：
1. 計算倍率：\`factor = Math.pow(10, decimals)\`
2. 四捨五入：\`Math.round(num * factor) / factor\`
3. 最後再用 \`toFixed(decimals)\` 格式化成字串回傳

注意：步驟 2 對 \`1.005\` 的結果應為 \`1.01\`（或非常接近），再格式化後應得到 \`'1.01'\`。`,
        examples: [
          {
            input: `reliableRound(1.005, 2)`,
            output: `'1.01'`,
            note: `原生 (1.005).toFixed(2) 可能得到 '1.00'`,
          },
          {
            input: `reliableRound(3.14159, 3)`,
            output: `'3.142'`,
          },
          {
            input: `reliableRound(2.5, 0)`,
            output: `'3'`,
          },
        ],
        constraints: [
          '必須使用 Math.round() 和乘除法進行四捨五入',
          '最後回傳值必須是字串（用 toFixed 格式化）',
        ],
        initialCode: `function reliableRound(num, decimals) {
  // TODO: 計算倍率（10 的 decimals 次方）
  // TODO: 用 Math.round(num * factor) / factor 四捨五入
  // TODO: 用 toFixed(decimals) 格式化後回傳字串
}
`,
        testCases: [
          { label: 'reliableRound(1.005, 2) 應為 "1.01"', test: `return reliableRound(1.005, 2) === '1.01'` },
          { label: 'reliableRound(3.14159, 3) 應為 "3.142"', test: `return reliableRound(3.14159, 3) === '3.142'` },
          { label: 'reliableRound(2.5, 0) 應為 "3"', test: `return reliableRound(2.5, 0) === '3'` },
          { label: 'reliableRound(100, 2) 應為 "100.00"', test: `return reliableRound(100, 2) === '100.00'` },
          { label: '回傳值應為字串型別', test: `return typeof reliableRound(1.5, 1) === 'string'` },
        ],
      },
    ],
  },

  // ─── num-locale ───────────────────────────────────────────────────────────
  {
    slug: 'num-locale',
    methodName: 'toLocaleString() / Intl.NumberFormat',
    title: 'toLocaleString() / Intl.NumberFormat',
    description: '依照地區設定格式化數字，支援千分位、幣別符號等本地化顯示。',
    subCategory: '格式化',
    difficulty: 'medium',
    notes: {
      title: 'toLocaleString() / Intl.NumberFormat',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`num.toLocaleString([locale[, options]])\`
\`new Intl.NumberFormat(locale, options).format(num)\`

兩者都回傳**格式化後的字串**。
- \`toLocaleString\`：快速方便，直接呼叫在數字上。
- \`Intl.NumberFormat\`：建立可重複使用的格式化器，效能較佳（格式化多個數字時）。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
// 千分位（預設地區）
(1234567).toLocaleString()             // '1,234,567'（依系統地區）
(1234567).toLocaleString('en-US')      // '1,234,567'

// 幣別格式化
(1500).toLocaleString('zh-TW', {
  style: 'currency',
  currency: 'TWD',
})  // 'NT$1,500.00'

(1500).toLocaleString('en-US', {
  style: 'currency',
  currency: 'USD',
})  // '$1,500.00'

// Intl.NumberFormat（可重複使用）
const fmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})
fmt.format(1500)   // '$1,500.00'
fmt.format(200)    // '$200.00'
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- \`toLocaleString()\` 不傳 locale 時，依系統環境決定格式，測試環境可能不一致。
- \`Intl.NumberFormat\` 建立格式化器有一定成本，需要格式化多個數字時，建議只建立一次再重複使用。
- 幣別符號位置（前置或後置）、千分位分隔符（逗號或點）因地區而異。
- 日圓（JPY）通常不顯示小數，\`minimumFractionDigits\` 預設為 0。
- \`maximumFractionDigits\` 和 \`minimumFractionDigits\` 可以精確控制小數位數顯示。`,
        },
      ],
    },
    keyPoints: [
      'toLocaleString() 可傳入 locale 字串（如 "en-US"、"zh-TW"）和 options 物件，將數字格式化為帶千分位或幣別的字串。',
      'Intl.NumberFormat 是更正式的 API，建立格式化器後可重複呼叫 .format()，適合批量格式化多個數字時使用。',
      '幣別格式化需要設定 style: "currency" 和 currency 代碼（如 "TWD"、"USD"、"JPY"）。',
      '不傳 locale 給 toLocaleString() 時，輸出格式依賴系統環境，在伺服器端渲染或跨環境測試時可能造成不一致。',
      '日圓（JPY）在 Intl 規範中預設不顯示小數位，而台幣（TWD）預設顯示兩位小數。',
      '需要格式化大量數字時，優先用 Intl.NumberFormat 建立一個格式化器並重複呼叫，而非每次都呼叫 toLocaleString。',
    ],
    problems: [
      // ── basic ──
      {
        id: 'basic',
        title: '數據看板：大數字加上千分位逗號',
        difficulty: 'easy',
        description: `數據看板需要將流量數字格式化，讓大數字更容易閱讀。

請用 \`toLocaleString('en-US')\` 將以下數字格式化，並存到對應變數：
- \`visits = 1234567\` → \`formattedVisits\`（應得到 \`'1,234,567'\`）
- \`revenue = 9876543\` → \`formattedRevenue\`（應得到 \`'9,876,543'\`）`,
        examples: [
          {
            input: `1234567`,
            output: `'1,234,567'`,
          },
          {
            input: `9876543`,
            output: `'9,876,543'`,
          },
        ],
        initialCode: `const visits = 1234567
const revenue = 9876543

// TODO: 用 toLocaleString('en-US') 格式化，存到 formattedVisits
let formattedVisits

// TODO: 用 toLocaleString('en-US') 格式化，存到 formattedRevenue
let formattedRevenue
`,
        testCases: [
          { label: 'formattedVisits 應為 "1,234,567"', test: `return formattedVisits === '1,234,567'` },
          { label: 'formattedRevenue 應為 "9,876,543"', test: `return formattedRevenue === '9,876,543'` },
          { label: 'formattedVisits 應為字串型別', test: `return typeof formattedVisits === 'string'` },
          { label: 'formattedVisits 應包含逗號', test: `return formattedVisits.includes(',')` },
        ],
      },
      // ── intl ──
      {
        id: 'intl',
        title: '多幣別結帳：Intl.NumberFormat 幣別格式化',
        difficulty: 'medium',
        description: `跨境電商支援多種幣別結帳，需要依據傳入的幣別代碼（\`'TWD'\`、\`'USD'\`、\`'JPY'\`）格式化金額。

請實作 \`formatCurrency(amount, currencyCode)\` 函式：
- \`'TWD'\`：使用 locale \`'zh-TW'\`，幣別 \`'TWD'\`
- \`'USD'\`：使用 locale \`'en-US'\`，幣別 \`'USD'\`
- \`'JPY'\`：使用 locale \`'ja-JP'\`，幣別 \`'JPY'\`
- 使用 \`Intl.NumberFormat\` 搭配 \`style: 'currency'\` 建立格式化器
- 回傳格式化後的字串

測試重點：確認回傳字串**包含正確的幣別符號**，例如：
- TWD 包含 \`'NT$'\` 或 \`'NT'\`
- USD 包含 \`'$'\`
- JPY 包含 \`'¥'\` 或 \`'JP¥'\``,
        examples: [
          {
            input: `formatCurrency(1500, 'TWD')`,
            output: `包含 'NT$' 的字串，如 'NT$1,500.00'`,
          },
          {
            input: `formatCurrency(1500, 'USD')`,
            output: `'$1,500.00'`,
          },
          {
            input: `formatCurrency(1500, 'JPY')`,
            output: `包含 '¥' 的字串，如 '¥1,500'`,
          },
        ],
        constraints: [
          '必須使用 Intl.NumberFormat 搭配 style: "currency"',
          '必須依幣別選擇對應的 locale',
        ],
        initialCode: `function formatCurrency(amount, currencyCode) {
  // TODO: 依 currencyCode 選擇對應的 locale
  // 'TWD' → 'zh-TW', 'USD' → 'en-US', 'JPY' → 'ja-JP'

  // TODO: 用 Intl.NumberFormat 建立格式化器，style: 'currency'
  // TODO: 回傳格式化後的字串
}
`,
        testCases: [
          {
            label: 'TWD 格式化結果應包含 NT$ 或 NT',
            test: `const r = formatCurrency(1500, 'TWD'); return r.includes('NT$') || r.includes('NT')`,
          },
          {
            label: 'USD 格式化結果應包含 $',
            test: `const r = formatCurrency(1500, 'USD'); return r.includes('$')`,
          },
          {
            label: 'JPY 格式化結果應包含 ¥ 或 JP¥',
            test: `const r = formatCurrency(1500, 'JPY'); return r.includes('¥')`,
          },
          {
            label: 'TWD 結果應為字串',
            test: `return typeof formatCurrency(100, 'TWD') === 'string'`,
          },
          {
            label: 'USD 格式化 1000 應包含千分位逗號',
            test: `const r = formatCurrency(1000, 'USD'); return r.includes(',')`,
          },
          {
            label: 'JPY 格式化應無小數點（日圓無小數）',
            test: `const r = formatCurrency(1500, 'JPY'); return !r.includes('.')`,
          },
        ],
      },
    ],
  },
]
