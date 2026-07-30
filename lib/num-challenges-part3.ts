import type { MethodEntry } from './array-challenges'

export const numChallengesPart3: MethodEntry[] = [
  // ─── num-math-basic ───────────────────────────────────────────────────────
  {
    slug: 'num-math-basic',
    methodName: 'Math.floor / ceil / round / abs',
    title: 'Math 基礎：floor / ceil / round / abs',
    description: '最常用的 Math 方法：無條件捨去、無條件進位、四捨五入、絕對值。',
    subCategory: 'Math 物件',
    difficulty: 'easy',
    notes: {
      title: 'Math.floor / ceil / round / abs',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`Math.floor(x)\` — 無條件捨去（向下取整），回傳 **≤ x 的最大整數**
\`Math.ceil(x)\` — 無條件進位（向上取整），回傳 **≥ x 的最小整數**
\`Math.round(x)\` — 四捨五入，回傳**最接近的整數**
\`Math.abs(x)\` — 絕對值，回傳 **|x|**（非負數）`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
Math.floor(4.9)   // 4
Math.floor(-4.1)  // -5（注意負數！）
Math.ceil(4.1)    // 5
Math.ceil(-4.9)   // -4
Math.round(4.5)   // 5
Math.round(4.4)   // 4
Math.abs(-42)     // 42
Math.abs(42)      // 42
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- \`Math.floor\` 負數時行為常讓人意外：\`Math.floor(-4.1)\` 是 \`-5\`，不是 \`-4\`
- \`Math.round\` 對 .5 永遠進位：\`Math.round(0.5)\` 是 \`1\`，\`Math.round(-0.5)\` 是 \`0\`
- 要隨機整數：\`Math.floor(Math.random() * n)\` 產生 0 到 n-1 的整數`,
        },
      ],
    },
    keyPoints: [
      'Math.floor 是無條件捨去，往負無限大方向取整，負數時 -4.1 會變成 -5 而不是 -4。',
      'Math.ceil 是無條件進位，往正無限大方向取整，和 floor 方向相反。',
      'Math.round 是四捨五入，0.5 永遠進位，所以 Math.round(0.5) 是 1，Math.round(-0.5) 是 0。',
      'Math.abs 回傳絕對值，負數變正數，正數不變，常用來計算兩個數字的差距。',
      '產生隨機整數的標準寫法是 Math.floor(Math.random() * n) + min，可以產生指定範圍內的隨機整數。',
    ],
    problems: [
      {
        id: 'basic',
        title: '商品評分顯示：取整處理',
        difficulty: 'easy',
        description: `電商平台的商品評分需要以不同方式取整顯示。

給定評分 \`rating = 4.6\`，請完成：
- \`floorStar\`：無條件捨去（顯示已完整的星星數）
- \`ceilStar\`：無條件進位（預留空間用）
- \`roundStar\`：四捨五入（顯示最接近的星星數）
- \`priceDiff\`：計算 \`priceA = 299\` 和 \`priceB = 450\` 的差額絕對值`,
        examples: [
          {
            input: `rating = 4.6，priceA = 299，priceB = 450`,
            output: `floorStar === 4，ceilStar === 5，roundStar === 5，priceDiff === 151`,
          },
        ],
        initialCode: `const rating = 4.6
const priceA = 299
const priceB = 450

// TODO: 無條件捨去
let floorStar

// TODO: 無條件進位
let ceilStar

// TODO: 四捨五入
let roundStar

// TODO: 兩個價格的差額絕對值
let priceDiff
`,
        testCases: [
          { label: 'floorStar 應為 4', test: `return floorStar === 4` },
          { label: 'ceilStar 應為 5', test: `return ceilStar === 5` },
          { label: 'roundStar 應為 5', test: `return roundStar === 5` },
          { label: 'priceDiff 應為 151', test: `return priceDiff === 151` },
          { label: 'priceDiff 應是非負數', test: `return priceDiff >= 0` },
        ],
      },
      {
        id: 'discount',
        title: '折扣計算：四捨五入到整數',
        difficulty: 'easy',
        description: `電商促銷活動需要計算打折後的價格，並四捨五入到整數（元）。

給定 \`originalPrice = 1299\` 和折扣率 \`discountRate = 0.75\`（七五折），
請計算折扣後的整數價格存到 \`discountedPrice\`。

再用 \`Math.abs\` 計算節省了多少錢，存到 \`savings\`。`,
        examples: [
          {
            input: `originalPrice = 1299，discountRate = 0.75`,
            output: `discountedPrice === 974，savings === 325`,
          },
        ],
        initialCode: `const originalPrice = 1299
const discountRate = 0.75

// TODO: 計算折後價（四捨五入），存到 discountedPrice
let discountedPrice

// TODO: 計算省了多少錢（絕對值），存到 savings
let savings
`,
        testCases: [
          { label: 'discountedPrice 應為 974', test: `return discountedPrice === 974` },
          { label: 'discountedPrice 應是整數', test: `return Number.isInteger(discountedPrice)` },
          { label: 'savings 應為 325', test: `return savings === 325` },
          { label: 'savings 應是非負數', test: `return savings >= 0` },
        ],
      },
      {
        id: 'dice',
        title: '骰子模擬：驗證隨機範圍',
        difficulty: 'medium',
        description: `請實作 \`rollDice()\` 函式，模擬一個六面骰子的投擲。

要求：
- 回傳 **1 到 6 之間的整數**（包含 1 和 6）
- 使用 \`Math.floor(Math.random() * 6) + 1\` 實作

測試會連續呼叫 100 次，驗證所有結果都在合法範圍內且都是整數。`,
        constraints: [
          '必須使用 Math.floor 和 Math.random',
          '回傳值必須是 1-6 之間的整數',
        ],
        initialCode: `function rollDice() {
  // TODO: 回傳 1-6 的隨機整數
}
`,
        testCases: [
          {
            label: '單次呼叫結果在 1-6 之間',
            test: `const r = rollDice(); return r >= 1 && r <= 6`,
          },
          {
            label: '回傳值是整數',
            test: `const r = rollDice(); return Number.isInteger(r)`,
          },
          {
            label: '100 次呼叫都在 1-6 之間',
            test: `const results = Array.from({length: 100}, () => rollDice()); return results.every(r => r >= 1 && r <= 6)`,
          },
          {
            label: '100 次呼叫都是整數',
            test: `const results = Array.from({length: 100}, () => rollDice()); return results.every(r => Number.isInteger(r))`,
          },
        ],
      },
    ],
  },

  // ─── num-math-advanced ────────────────────────────────────────────────────
  {
    slug: 'num-math-advanced',
    methodName: 'Math.max / min / pow / sqrt',
    title: 'Math 進階：max / min / pow / sqrt',
    description: '找最大最小值、次方、開根號，以及實作 clamp 函式。',
    subCategory: 'Math 物件',
    difficulty: 'medium',
    notes: {
      title: 'Math.max / min / pow / sqrt',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`Math.max(a, b, ...)\` — 回傳所有參數中的**最大值**
\`Math.min(a, b, ...)\` — 回傳所有參數中的**最小值**
\`Math.pow(base, exp)\` — 回傳 \`base\` 的 \`exp\` 次方（等同 \`base ** exp\`）
\`Math.sqrt(x)\` — 回傳 \`x\` 的平方根`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
Math.max(1, 3, 2)      // 3
Math.min(1, 3, 2)      // 1

// 展開陣列
const arr = [5, 2, 8, 1]
Math.max(...arr)        // 8
Math.min(...arr)        // 1

Math.pow(2, 10)         // 1024
Math.sqrt(16)           // 4
Math.sqrt(2)            // 1.4142135623730951

// clamp 函式（限制範圍）
const clamp = (v, min, max) => Math.max(min, Math.min(max, v))
clamp(150, 0, 100)      // 100
clamp(-10, 0, 100)      // 0
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- \`Math.max()\` 不傳參數時回傳 \`-Infinity\`，\`Math.min()\` 不傳參數時回傳 \`Infinity\`
- 陣列需用展開運算子 \`...\` 或 \`apply\`：\`Math.max(...arr)\` 或 \`Math.max.apply(null, arr)\`
- \`Math.pow(x, 0.5)\` 等同 \`Math.sqrt(x)\``,
        },
      ],
    },
    keyPoints: [
      'Math.max 和 Math.min 接受多個獨立參數，不接受陣列，要把陣列展開成 Math.max(...arr) 才能正確使用。',
      'Math.max() 無參數時回傳 -Infinity，Math.min() 無參數時回傳 Infinity，這是設計上的對稱性。',
      'clamp(value, min, max) 是很常見的 UI 工具函式，把值限制在範圍內，實作是 Math.max(min, Math.min(max, value))。',
      'Math.pow(base, exp) 在 ES2016 後可以用 ** 運算子替代：2 ** 10 === Math.pow(2, 10)。',
      'Math.sqrt 計算平方根，負數傳入會回傳 NaN，這是因為實數不存在負數的平方根。',
    ],
    problems: [
      {
        id: 'minmax',
        title: '商品價格分析：找最高最低價',
        difficulty: 'easy',
        description: `電商後台需要分析商品價格，找出最高價和最低價。

請使用 \`Math.max(...prices)\` 和 \`Math.min(...prices)\` 找出：
- \`maxPrice\`：最高價
- \`minPrice\`：最低價
- \`priceRange\`：價格差距（最高 - 最低）`,
        examples: [
          {
            input: `prices = [299, 1299, 99, 599, 799]`,
            output: `maxPrice === 1299，minPrice === 99，priceRange === 1200`,
          },
        ],
        initialCode: `const prices = [299, 1299, 99, 599, 799]

// TODO: 找最高價
let maxPrice

// TODO: 找最低價
let minPrice

// TODO: 計算價格差距
let priceRange
`,
        testCases: [
          { label: 'maxPrice 應為 1299', test: `return maxPrice === 1299` },
          { label: 'minPrice 應為 99', test: `return minPrice === 99` },
          { label: 'priceRange 應為 1200', test: `return priceRange === 1200` },
          {
            label: '用不同陣列也能正確找到 max',
            test: `const p = [10, 50, 30]; return Math.max(...p) === 50`,
          },
        ],
      },
      {
        id: 'power',
        title: '幾何計算：面積與邊長換算',
        difficulty: 'medium',
        description: `幾何計算工具需要計算正方形的面積，以及從面積反推邊長。

給定 \`side = 12\`（邊長）：
1. 用 \`Math.pow(side, 2)\` 計算面積，存到 \`area\`
2. 用 \`Math.sqrt(area)\` 從面積反推邊長，存到 \`recoveredSide\`
3. 驗證 \`recoveredSide === side\`，存到 \`isCorrect\``,
        examples: [
          {
            input: `side = 12`,
            output: `area === 144，recoveredSide === 12，isCorrect === true`,
          },
        ],
        initialCode: `const side = 12

// TODO: 計算面積（邊長的平方）
let area

// TODO: 從面積反推邊長（開根號）
let recoveredSide

// TODO: 驗證反推的邊長等於原始邊長
let isCorrect
`,
        testCases: [
          { label: 'area 應為 144', test: `return area === 144` },
          { label: 'recoveredSide 應為 12', test: `return recoveredSide === 12` },
          { label: 'isCorrect 應為 true', test: `return isCorrect === true` },
          {
            label: 'Math.sqrt(Math.pow(5,2)) 應等於 5',
            test: `return Math.sqrt(Math.pow(5, 2)) === 5`,
          },
        ],
      },
      {
        id: 'clamp',
        title: '進度條元件：實作 clamp 函式',
        difficulty: 'medium',
        description: `前端進度條元件需要將進度值限制在 0-100 之間，防止超出範圍。

請實作 \`clamp(value, min, max)\` 函式：
- 若 \`value < min\`，回傳 \`min\`
- 若 \`value > max\`，回傳 \`max\`
- 否則回傳 \`value\`

使用 \`Math.max\` 和 \`Math.min\` 組合實作（一行）。`,
        examples: [
          {
            input: `clamp(150, 0, 100)`,
            output: `100`,
          },
          {
            input: `clamp(-10, 0, 100)`,
            output: `0`,
          },
          {
            input: `clamp(50, 0, 100)`,
            output: `50`,
          },
        ],
        constraints: ['必須使用 Math.max 和 Math.min'],
        initialCode: `function clamp(value, min, max) {
  // TODO: 把 value 限制在 [min, max] 範圍內
}
`,
        testCases: [
          { label: '超過最大值時回傳 max', test: `return clamp(150, 0, 100) === 100` },
          { label: '低於最小值時回傳 min', test: `return clamp(-10, 0, 100) === 0` },
          { label: '在範圍內時回傳原值', test: `return clamp(50, 0, 100) === 50` },
          { label: '等於邊界值時回傳邊界值', test: `return clamp(0, 0, 100) === 0 && clamp(100, 0, 100) === 100` },
          { label: '可用於不同範圍', test: `return clamp(5, 1, 10) === 5 && clamp(0, 1, 10) === 1` },
        ],
      },
    ],
  },

  // ─── num-precision ────────────────────────────────────────────────────────
  {
    slug: 'num-precision',
    methodName: '浮點數精度',
    title: '浮點數精度問題',
    description: '了解 JavaScript 的浮點數精度陷阱，以及如何安全處理金額計算。',
    subCategory: '精度處理',
    difficulty: 'medium',
    notes: {
      title: '浮點數精度問題',
      sections: [
        {
          heading: '問題根源',
          content: `JavaScript 使用 **IEEE 754 雙精度浮點數**，某些小數無法被精確表示。

\`\`\`js
0.1 + 0.2          // 0.30000000000000004（不是 0.3！）
0.1 + 0.2 === 0.3  // false
\`\`\`

這不是 JavaScript 的 bug，而是二進位浮點數的固有特性，所有使用 IEEE 754 的語言都有這個問題。`,
        },
        {
          heading: '解決方案',
          content: `\`\`\`js
// 方法一：Number.EPSILON 比較（用於判斷是否相等）
function isEqual(a, b) {
  return Math.abs(a - b) < Number.EPSILON
}
isEqual(0.1 + 0.2, 0.3)  // true

// 方法二：整數計算（用於金額）
// 把金額乘以 100 轉成分，計算後再除回來
function addMoney(a, b) {
  return (Math.round(a * 100) + Math.round(b * 100)) / 100
}
addMoney(0.1, 0.2)  // 0.3（精確）

// 方法三：toFixed（用於顯示）
(0.1 + 0.2).toFixed(1)  // '0.3'（字串）
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- \`Number.EPSILON\` 是 JavaScript 能表示的最小差值，約 \`2.22e-16\`
- \`toFixed\` 回傳字串，不是數字，不能直接用於計算
- 金融應用建議用整數計算（分為單位）或使用專門的 Decimal 函式庫`,
        },
      ],
    },
    keyPoints: [
      '0.1 + 0.2 在 JavaScript 不等於 0.3，這是 IEEE 754 浮點數的固有問題，不是 bug。',
      '判斷兩個浮點數是否相等，要用 Math.abs(a - b) < Number.EPSILON，而不是直接用 ===。',
      'Number.EPSILON 是 JavaScript 能表示的最小浮點差值，約等於 2.22e-16。',
      '金額計算的安全做法是乘以 100 轉成整數（分）計算，再除以 100 轉回元，避免浮點誤差。',
      'toFixed() 可以控制小數位數顯示，但它回傳的是字串，不能直接拿來做數學運算。',
    ],
    problems: [
      {
        id: 'basic',
        title: '觀察浮點數精度問題',
        difficulty: 'easy',
        description: `JavaScript 中 \`0.1 + 0.2\` 的結果並不是我們預期的 \`0.3\`，這是浮點數精度問題。

請完成：
1. 計算 \`0.1 + 0.2\`，存到 \`sum\`
2. 驗證 \`sum !== 0.3\`（應為 \`true\`），存到 \`isNotEqual\`
3. 用 \`sum.toFixed(1)\` 取小數點後一位字串，存到 \`fixed\``,
        examples: [
          {
            input: `0.1 + 0.2`,
            output: `sum 約為 0.30000000000000004，isNotEqual === true，fixed === '0.3'`,
          },
        ],
        initialCode: `// TODO: 計算 0.1 + 0.2
let sum

// TODO: 驗證 sum !== 0.3，存到 isNotEqual（boolean）
let isNotEqual

// TODO: 用 toFixed(1) 取字串，存到 fixed
let fixed
`,
        testCases: [
          { label: 'sum 不等於 0.3', test: `return sum !== 0.3` },
          { label: 'isNotEqual 應為 true', test: `return isNotEqual === true` },
          { label: 'fixed 應為字串 "0.3"', test: `return fixed === '0.3'` },
          { label: 'fixed 是字串型別', test: `return typeof fixed === 'string'` },
        ],
      },
      {
        id: 'epsilon',
        title: '浮點數相等比較：用 EPSILON',
        difficulty: 'medium',
        description: `請實作 \`isFloatEqual(a, b)\` 函式，使用 \`Number.EPSILON\` 判斷兩個浮點數是否「實質相等」。

邏輯：\`Math.abs(a - b) < Number.EPSILON\`

這樣可以正確判斷 \`0.1 + 0.2\` 與 \`0.3\` 為相等。`,
        examples: [
          {
            input: `isFloatEqual(0.1 + 0.2, 0.3)`,
            output: `true`,
          },
          {
            input: `isFloatEqual(0.1, 0.2)`,
            output: `false`,
          },
        ],
        initialCode: `function isFloatEqual(a, b) {
  // TODO: 用 Math.abs 和 Number.EPSILON 實作
}
`,
        testCases: [
          {
            label: 'isFloatEqual(0.1 + 0.2, 0.3) 應為 true',
            test: `return isFloatEqual(0.1 + 0.2, 0.3) === true`,
          },
          {
            label: 'isFloatEqual(0.1, 0.2) 應為 false',
            test: `return isFloatEqual(0.1, 0.2) === false`,
          },
          {
            label: 'isFloatEqual(1, 1) 應為 true',
            test: `return isFloatEqual(1, 1) === true`,
          },
          {
            label: 'isFloatEqual(0.2 + 0.4, 0.6) 應為 true',
            test: `return isFloatEqual(0.2 + 0.4, 0.6) === true`,
          },
        ],
      },
      {
        id: 'money-calc',
        title: '購物車金額計算：避免精度問題',
        difficulty: 'medium',
        description: `電商購物車需要精確計算商品金額，直接相加會有浮點精度問題。

請實作 \`addMoney(a, b)\` 函式，透過先乘以 100 轉成整數再計算的方式，避免浮點誤差：

\`\`\`
(Math.round(a * 100) + Math.round(b * 100)) / 100
\`\`\``,
        examples: [
          {
            input: `addMoney(0.1, 0.2)`,
            output: `0.3（精確，不是 0.30000000000000004）`,
          },
          {
            input: `addMoney(1.05, 2.95)`,
            output: `4`,
          },
        ],
        initialCode: `function addMoney(a, b) {
  // TODO: 乘以 100 轉成整數計算，再除以 100 轉回來
}
`,
        testCases: [
          {
            label: 'addMoney(0.1, 0.2) 應精確等於 0.3',
            test: `return addMoney(0.1, 0.2) === 0.3`,
          },
          {
            label: 'addMoney(1.05, 2.95) 應為 4',
            test: `return addMoney(1.05, 2.95) === 4`,
          },
          {
            label: 'addMoney(0.5, 0.5) 應為 1',
            test: `return addMoney(0.5, 0.5) === 1`,
          },
          {
            label: '回傳值是 number 型別',
            test: `return typeof addMoney(0.1, 0.2) === 'number'`,
          },
        ],
      },
    ],
  },
]
