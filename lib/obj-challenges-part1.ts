import type { MethodEntry } from './array-challenges'

export const objChallengesPart1: MethodEntry[] = [
  // ─── obj-keys ─────────────────────────────────────────────────────────────
  {
    slug: 'obj-keys',
    methodName: 'Object.keys()',
    title: 'Object.keys()',
    description: '回傳物件自身可列舉屬性名稱（key）組成的陣列。',
    subCategory: '物件遍歷',
    difficulty: 'easy',
    notes: {
      title: 'Object.keys()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`Object.keys(obj)\`

- 回傳：**字串陣列**，包含物件所有自身可列舉屬性的名稱。
- 不包含繼承自原型鏈的屬性。
- 屬性順序：整數 key 由小到大排前，其餘依插入順序。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const product = { name: '耳機', price: 1200, stock: 50 }

Object.keys(product)
// ['name', 'price', 'stock']

// 常見用法：過濾特定 key
const allowed = ['name', 'price']
const filtered = Object.keys(product)
  .filter(k => allowed.includes(k))
  .reduce((acc, k) => {
    acc[k] = product[k]
    return acc
  }, {})
// { name: '耳機', price: 1200 }
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- 只返回**自身**屬性，不含原型上的屬性（與 \`for...in\` 不同）。
- 若傳入的不是物件（如 null/undefined），會拋出 TypeError。
- 回傳的是**快照**，之後新增的 key 不會影響已取得的陣列。
- 與 \`Object.getOwnPropertyNames()\` 的差異：後者也會返回不可列舉屬性。`,
        },
      ],
    },
    keyPoints: [
      'Object.keys() 回傳一個字串陣列，包含物件所有自身可列舉屬性的名稱，不包含繼承自原型鏈的屬性。',
      '屬性順序規則：整數型 key（如 "1", "2"）會依數值大小排在最前，其餘依插入順序排列。',
      '與 for...in 不同，Object.keys() 不會遍歷原型鏈上的屬性，是更安全的做法。',
      '常見模式：Object.keys + filter + reduce 可以快速建立只含特定欄位的新物件，常用於 API 資料清洗。',
      '傳入 null 或 undefined 會拋出 TypeError，使用前需確認物件存在。',
      '回傳值是快照，建立後不會因後續修改物件而自動更新。',
    ],
    problems: [
      {
        id: 'basic',
        title: '取得商品物件的所有欄位名稱',
        difficulty: 'easy',
        description: `倉儲系統需要列出商品資料的所有欄位名稱，以便動態產生表頭。

請使用 \`Object.keys()\` 取得 \`product\` 物件的所有 key，儲存到變數 \`keys\`。
接著驗證：
1. \`keys\` 是陣列
2. 長度為 4
3. 包含 \`'sku'\` 這個 key`,
        examples: [
          {
            input: `product = { sku: 'P001', name: '藍牙耳機', price: 1500, stock: 30 }`,
            output: `keys = ['sku', 'name', 'price', 'stock']，長度 4，含 'sku'`,
          },
        ],
        initialCode: `const product = { sku: 'P001', name: '藍牙耳機', price: 1500, stock: 30 }

// 使用 Object.keys() 取得所有 key
const keys = Object.keys(product)
`,
        testCases: [
          {
            label: 'keys 是陣列',
            test: `const product = { sku: 'P001', name: '藍牙耳機', price: 1500, stock: 30 }
const keys = Object.keys(product)
return Array.isArray(keys)`,
          },
          {
            label: '長度為 4',
            test: `const product = { sku: 'P001', name: '藍牙耳機', price: 1500, stock: 30 }
const keys = Object.keys(product)
return keys.length === 4`,
          },
          {
            label: '包含 "sku" 這個 key',
            test: `const product = { sku: 'P001', name: '藍牙耳機', price: 1500, stock: 30 }
const keys = Object.keys(product)
return keys.includes('sku')`,
          },
        ],
      },
      {
        id: 'filter-keys',
        title: '過濾商品物件：只保留公開欄位',
        difficulty: 'medium',
        description: `API 回應中的商品物件包含敏感的內部欄位，需要過濾後才能回傳給前端。

請使用 \`Object.keys()\`、\`Array.filter()\`、\`Array.reduce()\` 建立 \`publicProduct\`，
只保留 \`allowedKeys\` 陣列中的欄位。`,
        examples: [
          {
            input: `product = { name: '鍵盤', price: 2200, cost: 1000, stock: 15, internalNote: '待補貨' }
allowedKeys = ['name', 'price', 'stock']`,
            output: `publicProduct = { name: '鍵盤', price: 2200, stock: 15 }`,
          },
        ],
        initialCode: `const product = { name: '鍵盤', price: 2200, cost: 1000, stock: 15, internalNote: '待補貨' }
const allowedKeys = ['name', 'price', 'stock']

// 使用 Object.keys + filter + reduce 建立只含 allowedKeys 的物件
const publicProduct = Object.keys(product)
  .filter(k => allowedKeys.includes(k))
  .reduce((acc, k) => {
    acc[k] = product[k]
    return acc
  }, {})
`,
        testCases: [
          {
            label: 'publicProduct 只有 3 個 key',
            test: `const product = { name: '鍵盤', price: 2200, cost: 1000, stock: 15, internalNote: '待補貨' }
const allowedKeys = ['name', 'price', 'stock']
const publicProduct = Object.keys(product)
  .filter(k => allowedKeys.includes(k))
  .reduce((acc, k) => { acc[k] = product[k]; return acc }, {})
return Object.keys(publicProduct).length === 3`,
          },
          {
            label: '不含 cost 和 internalNote',
            test: `const product = { name: '鍵盤', price: 2200, cost: 1000, stock: 15, internalNote: '待補貨' }
const allowedKeys = ['name', 'price', 'stock']
const publicProduct = Object.keys(product)
  .filter(k => allowedKeys.includes(k))
  .reduce((acc, k) => { acc[k] = product[k]; return acc }, {})
return !('cost' in publicProduct) && !('internalNote' in publicProduct)`,
          },
          {
            label: '正確保留 name、price、stock 的值',
            test: `const product = { name: '鍵盤', price: 2200, cost: 1000, stock: 15, internalNote: '待補貨' }
const allowedKeys = ['name', 'price', 'stock']
const publicProduct = Object.keys(product)
  .filter(k => allowedKeys.includes(k))
  .reduce((acc, k) => { acc[k] = product[k]; return acc }, {})
return publicProduct.name === '鍵盤' && publicProduct.price === 2200 && publicProduct.stock === 15`,
          },
        ],
      },
      {
        id: 'count-props',
        title: '統計各分類商品數量並找出最多的分類',
        difficulty: 'medium',
        description: `庫存系統需要知道哪個商品分類的數量最多。

給定 \`inventory\` 物件，每個 key 是分類名稱，value 是該分類商品數量。
請：
1. 將 \`inventory\` 的屬性總數存到 \`totalCategories\`
2. 使用 \`Object.keys()\`、\`Math.max()\`、\`reduce()\` 找出數量最多的分類名稱，存到 \`topCategory\``,
        examples: [
          {
            input: `inventory = { 電腦: 45, 耳機: 120, 鍵盤: 80, 滑鼠: 95 }`,
            output: `totalCategories = 4，topCategory = '耳機'`,
          },
        ],
        initialCode: `const inventory = { 電腦: 45, 耳機: 120, 鍵盤: 80, 滑鼠: 95 }

// 1. 屬性總數
const totalCategories = Object.keys(inventory).length

// 2. 找出數量最多的分類
const maxCount = Math.max(...Object.values(inventory))
const topCategory = Object.keys(inventory).find(k => inventory[k] === maxCount)
`,
        testCases: [
          {
            label: 'totalCategories 為 4',
            test: `const inventory = { 電腦: 45, 耳機: 120, 鍵盤: 80, 滑鼠: 95 }
const totalCategories = Object.keys(inventory).length
return totalCategories === 4`,
          },
          {
            label: 'topCategory 為 "耳機"',
            test: `const inventory = { 電腦: 45, 耳機: 120, 鍵盤: 80, 滑鼠: 95 }
const maxCount = Math.max(...Object.values(inventory))
const topCategory = Object.keys(inventory).find(k => inventory[k] === maxCount)
return topCategory === '耳機'`,
          },
          {
            label: '換不同資料仍正確找出最大值 key',
            test: `const inventory = { A類: 10, B類: 55, C類: 30 }
const maxCount = Math.max(...Object.values(inventory))
const topCategory = Object.keys(inventory).find(k => inventory[k] === maxCount)
return topCategory === 'B類'`,
          },
        ],
      },
    ],
  },

  // ─── obj-values ───────────────────────────────────────────────────────────
  {
    slug: 'obj-values',
    methodName: 'Object.values()',
    title: 'Object.values()',
    description: '回傳物件自身可列舉屬性值組成的陣列。',
    subCategory: '物件遍歷',
    difficulty: 'easy',
    notes: {
      title: 'Object.values()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`Object.values(obj)\`

- 回傳：物件所有自身可列舉屬性的**值**組成的陣列。
- 值的順序與 \`Object.keys()\` 對應的順序相同。
- 值可以是任意型別：字串、數字、物件、陣列等。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const prices = { apple: 30, banana: 15, mango: 60 }

Object.values(prices)
// [30, 15, 60]

// 計算總和
const total = Object.values(prices).reduce((sum, v) => sum + v, 0)
// 105

// 找最大值
const max = Math.max(...Object.values(prices))
// 60
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- 只返回**自身可列舉**屬性的值，不含原型鏈上的值。
- 與 \`Object.keys()\` 搭配使用，前者取名稱，後者取值。
- 若要同時取 key 和 value，改用 \`Object.entries()\` 更方便。
- 展開運算子 \`Math.max(...Object.values(obj))\` 是找最大值的慣用寫法。`,
        },
      ],
    },
    keyPoints: [
      'Object.values() 回傳物件所有自身可列舉屬性值的陣列，值的型別不限，可以是任意 JavaScript 值。',
      '值的順序與 Object.keys() 相同，整數 key 優先，其餘依插入順序。',
      '配合 reduce 可快速計算數值型屬性的總和或平均，是處理統計資料的常用模式。',
      '配合展開運算子 Math.max(...Object.values(obj)) 可找出物件中最大的數值，簡潔且易讀。',
      '若需同時操作 key 和 value，優先考慮 Object.entries()，避免分別呼叫 keys 和 values。',
    ],
    problems: [
      {
        id: 'basic',
        title: '計算購物車商品總金額與平均單價',
        difficulty: 'easy',
        description: `電商結帳頁面需要計算購物車中所有商品的總金額與平均單價。

給定 \`cart\` 物件，key 為商品名稱，value 為單價（數字）。
請使用 \`Object.values()\` 取出所有價格，計算：
1. 總金額 \`total\`（所有價格的總和）
2. 平均單價 \`average\`（總金額 / 商品數量，用 \`Math.round\` 四捨五入）`,
        examples: [
          {
            input: `cart = { 耳機: 1200, 鍵盤: 800, 滑鼠: 400, 螢幕: 8000 }`,
            output: `total = 10400，average = 2600`,
          },
        ],
        initialCode: `const cart = { 耳機: 1200, 鍵盤: 800, 滑鼠: 400, 螢幕: 8000 }

// 使用 Object.values() 取出所有價格
const prices = Object.values(cart)
const total = prices.reduce((sum, v) => sum + v, 0)
const average = Math.round(total / prices.length)
`,
        testCases: [
          {
            label: 'total 為 10400',
            test: `const cart = { 耳機: 1200, 鍵盤: 800, 滑鼠: 400, 螢幕: 8000 }
const prices = Object.values(cart)
const total = prices.reduce((sum, v) => sum + v, 0)
return total === 10400`,
          },
          {
            label: 'average 為 2600',
            test: `const cart = { 耳機: 1200, 鍵盤: 800, 滑鼠: 400, 螢幕: 8000 }
const prices = Object.values(cart)
const total = prices.reduce((sum, v) => sum + v, 0)
const average = Math.round(total / prices.length)
return average === 2600`,
          },
          {
            label: 'prices 是長度為 4 的陣列',
            test: `const cart = { 耳機: 1200, 鍵盤: 800, 滑鼠: 400, 螢幕: 8000 }
const prices = Object.values(cart)
return Array.isArray(prices) && prices.length === 4`,
          },
        ],
      },
      {
        id: 'max-value',
        title: '找出庫存中數量最多的商品數值',
        difficulty: 'easy',
        description: `倉庫管理員想快速得知目前庫存中，哪個商品的數量最多（只需要數量，不需要名稱）。

給定 \`stock\` 物件，請使用 \`Object.values()\` 搭配 \`Math.max()\` 找出最大庫存數量，存到 \`maxStock\`。`,
        examples: [
          {
            input: `stock = { 筆電: 12, 平板: 45, 手機: 78, 相機: 23 }`,
            output: `maxStock = 78`,
          },
        ],
        initialCode: `const stock = { 筆電: 12, 平板: 45, 手機: 78, 相機: 23 }

// 使用 Object.values() + Math.max() 找出最大值
const maxStock = Math.max(...Object.values(stock))
`,
        testCases: [
          {
            label: 'maxStock 為 78',
            test: `const stock = { 筆電: 12, 平板: 45, 手機: 78, 相機: 23 }
const maxStock = Math.max(...Object.values(stock))
return maxStock === 78`,
          },
          {
            label: '換資料仍正確',
            test: `const stock = { A: 5, B: 200, C: 99 }
const maxStock = Math.max(...Object.values(stock))
return maxStock === 200`,
          },
          {
            label: '單一屬性時也能正確運作',
            test: `const stock = { 唯一商品: 42 }
const maxStock = Math.max(...Object.values(stock))
return maxStock === 42`,
          },
        ],
      },
      {
        id: 'transform',
        title: '計算含稅後的商品價格陣列',
        difficulty: 'medium',
        description: `結帳系統需要將所有商品價格加上稅率，產生含稅價格的陣列。

給定 \`prices\` 物件（key 為商品名，value 為未稅價格）與稅率 \`taxRate\`，
請使用 \`Object.values()\` + \`map()\` 計算每個商品的含稅價格（原價 × (1 + taxRate)，用 \`Math.round\` 四捨五入），
結果存到 \`taxedPrices\` 陣列。`,
        examples: [
          {
            input: `prices = { 咖啡: 80, 蛋糕: 120, 果汁: 60 }，taxRate = 0.1`,
            output: `taxedPrices = [88, 132, 66]`,
          },
        ],
        initialCode: `const prices = { 咖啡: 80, 蛋糕: 120, 果汁: 60 }
const taxRate = 0.1

// 使用 Object.values() + map() 計算含稅價格
const taxedPrices = Object.values(prices).map(p => Math.round(p * (1 + taxRate)))
`,
        testCases: [
          {
            label: 'taxedPrices 是長度為 3 的陣列',
            test: `const prices = { 咖啡: 80, 蛋糕: 120, 果汁: 60 }
const taxRate = 0.1
const taxedPrices = Object.values(prices).map(p => Math.round(p * (1 + taxRate)))
return Array.isArray(taxedPrices) && taxedPrices.length === 3`,
          },
          {
            label: '第一項咖啡含稅價為 88',
            test: `const prices = { 咖啡: 80, 蛋糕: 120, 果汁: 60 }
const taxRate = 0.1
const taxedPrices = Object.values(prices).map(p => Math.round(p * (1 + taxRate)))
return taxedPrices[0] === 88`,
          },
          {
            label: '第二項蛋糕含稅價為 132',
            test: `const prices = { 咖啡: 80, 蛋糕: 120, 果汁: 60 }
const taxRate = 0.1
const taxedPrices = Object.values(prices).map(p => Math.round(p * (1 + taxRate)))
return taxedPrices[1] === 132`,
          },
        ],
      },
    ],
  },

  // ─── obj-entries ──────────────────────────────────────────────────────────
  {
    slug: 'obj-entries',
    methodName: 'Object.entries()',
    title: 'Object.entries()',
    description: '回傳物件自身可列舉屬性的 [key, value] 陣列。',
    subCategory: '物件遍歷',
    difficulty: 'easy',
    notes: {
      title: 'Object.entries()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`Object.entries(obj)\`

- 回傳：二維陣列，每個元素為 \`[key, value]\` 的配對。
- 順序與 \`Object.keys()\` 相同。
- 常與解構賦值 \`const [k, v] = entry\` 搭配使用。
- 是 \`Object.fromEntries()\` 的逆操作。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const user = { name: '小明', age: 25, role: 'admin' }

Object.entries(user)
// [['name', '小明'], ['age', 25], ['role', 'admin']]

// 遍歷 key-value
Object.entries(user).forEach(([key, value]) => {
  console.log(\`\${key}: \${value}\`)
})

// 翻倍所有數字值，轉回物件
const doubled = Object.fromEntries(
  Object.entries({ a: 1, b: 2 }).map(([k, v]) => [k, v * 2])
)
// { a: 2, b: 4 }
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- 回傳的是快照，不會隨物件變動而更新。
- 配合 \`Object.fromEntries()\` 可實現「物件 → 轉換 → 物件」的管道。
- 是 \`Map\` 建構子的好朋友：\`new Map(Object.entries(obj))\` 可快速轉成 Map。
- 與 \`for...in\` 不同，不會遍歷原型鏈屬性。`,
        },
      ],
    },
    keyPoints: [
      'Object.entries() 回傳 [key, value] 組成的二維陣列，讓你同時取得 key 和 value，避免重複查找。',
      '常與解構賦值搭配：forEach(([k, v]) => ...) 讓程式碼更清晰易讀。',
      'entries → map → fromEntries 是常見的物件轉換管道，適合對物件所有值做批次操作。',
      '可用 new Map(Object.entries(obj)) 快速把普通物件轉為 Map。',
      '與 Object.fromEntries() 互為逆操作，兩者組合是物件資料轉換的核心工具。',
      '不遍歷原型鏈，比 for...in 更安全，適合處理 plain object 資料。',
    ],
    problems: [
      {
        id: 'basic',
        title: '把使用者設定物件轉成 [key, value] 陣列',
        difficulty: 'easy',
        description: `系統需要將使用者設定物件序列化，轉成 \`[key, value]\` 格式的二維陣列，方便後端儲存。

請使用 \`Object.entries()\` 把 \`userSettings\` 轉成二維陣列 \`entries\`，並驗證：
1. \`entries\` 是陣列
2. 長度為 3
3. 第一個元素是 \`['theme', 'dark']\``,
        examples: [
          {
            input: `userSettings = { theme: 'dark', language: 'zh-TW', notifications: true }`,
            output: `entries = [['theme', 'dark'], ['language', 'zh-TW'], ['notifications', true]]`,
          },
        ],
        initialCode: `const userSettings = { theme: 'dark', language: 'zh-TW', notifications: true }

// 使用 Object.entries() 轉換
const entries = Object.entries(userSettings)
`,
        testCases: [
          {
            label: 'entries 是陣列',
            test: `const userSettings = { theme: 'dark', language: 'zh-TW', notifications: true }
const entries = Object.entries(userSettings)
return Array.isArray(entries)`,
          },
          {
            label: '長度為 3',
            test: `const userSettings = { theme: 'dark', language: 'zh-TW', notifications: true }
const entries = Object.entries(userSettings)
return entries.length === 3`,
          },
          {
            label: '第一個元素為 ["theme", "dark"]',
            test: `const userSettings = { theme: 'dark', language: 'zh-TW', notifications: true }
const entries = Object.entries(userSettings)
return entries[0][0] === 'theme' && entries[0][1] === 'dark'`,
          },
        ],
      },
      {
        id: 'map-object',
        title: '商品定價全面調漲：批次將所有價格乘以倍率',
        difficulty: 'medium',
        description: `電商平台調整定價策略，需要將所有商品價格乘以調漲倍率，並回傳新的定價物件。

請使用 \`Object.entries()\`、\`map()\`、\`Object.fromEntries()\` 把 \`originalPrices\` 物件中每個價格乘以 \`multiplier\`，
產生新物件 \`updatedPrices\`（原物件不變）。`,
        examples: [
          {
            input: `originalPrices = { 美式咖啡: 60, 拿鐵: 80, 卡布奇諾: 85 }，multiplier = 1.2`,
            output: `updatedPrices = { 美式咖啡: 72, 拿鐵: 96, 卡布奇諾: 102 }`,
          },
        ],
        initialCode: `const originalPrices = { 美式咖啡: 60, 拿鐵: 80, 卡布奇諾: 85 }
const multiplier = 1.2

// 使用 Object.entries + map + Object.fromEntries
const updatedPrices = Object.fromEntries(
  Object.entries(originalPrices).map(([k, v]) => [k, Math.round(v * multiplier)])
)
`,
        testCases: [
          {
            label: '美式咖啡價格更新為 72',
            test: `const originalPrices = { 美式咖啡: 60, 拿鐵: 80, 卡布奇諾: 85 }
const multiplier = 1.2
const updatedPrices = Object.fromEntries(
  Object.entries(originalPrices).map(([k, v]) => [k, Math.round(v * multiplier)])
)
return updatedPrices['美式咖啡'] === 72`,
          },
          {
            label: '拿鐵價格更新為 96',
            test: `const originalPrices = { 美式咖啡: 60, 拿鐵: 80, 卡布奇諾: 85 }
const multiplier = 1.2
const updatedPrices = Object.fromEntries(
  Object.entries(originalPrices).map(([k, v]) => [k, Math.round(v * multiplier)])
)
return updatedPrices['拿鐵'] === 96`,
          },
          {
            label: '原物件 originalPrices 未被修改',
            test: `const originalPrices = { 美式咖啡: 60, 拿鐵: 80, 卡布奇諾: 85 }
const multiplier = 1.2
const updatedPrices = Object.fromEntries(
  Object.entries(originalPrices).map(([k, v]) => [k, Math.round(v * multiplier)])
)
return originalPrices['美式咖啡'] === 60`,
          },
        ],
      },
      {
        id: 'invert',
        title: '建立國碼對照表：key 與 value 互換',
        difficulty: 'medium',
        description: `系統有一份「國碼 → 國名」的對照物件，需要產生反向的「國名 → 國碼」查找表。

請使用 \`Object.entries()\` 搭配 \`Object.fromEntries()\` 把 \`codeToName\` 的 key 和 value 互換，
產生新物件 \`nameToCode\`。`,
        examples: [
          {
            input: `codeToName = { TW: '台灣', JP: '日本', US: '美國', KR: '韓國' }`,
            output: `nameToCode = { 台灣: 'TW', 日本: 'JP', 美國: 'US', 韓國: 'KR' }`,
          },
        ],
        initialCode: `const codeToName = { TW: '台灣', JP: '日本', US: '美國', KR: '韓國' }

// 使用 Object.entries + Object.fromEntries 互換 key/value
const nameToCode = Object.fromEntries(
  Object.entries(codeToName).map(([k, v]) => [v, k])
)
`,
        testCases: [
          {
            label: 'nameToCode["台灣"] 為 "TW"',
            test: `const codeToName = { TW: '台灣', JP: '日本', US: '美國', KR: '韓國' }
const nameToCode = Object.fromEntries(
  Object.entries(codeToName).map(([k, v]) => [v, k])
)
return nameToCode['台灣'] === 'TW'`,
          },
          {
            label: 'nameToCode["日本"] 為 "JP"',
            test: `const codeToName = { TW: '台灣', JP: '日本', US: '美國', KR: '韓國' }
const nameToCode = Object.fromEntries(
  Object.entries(codeToName).map(([k, v]) => [v, k])
)
return nameToCode['日本'] === 'JP'`,
          },
          {
            label: '結果物件共有 4 個 key',
            test: `const codeToName = { TW: '台灣', JP: '日本', US: '美國', KR: '韓國' }
const nameToCode = Object.fromEntries(
  Object.entries(codeToName).map(([k, v]) => [v, k])
)
return Object.keys(nameToCode).length === 4`,
          },
        ],
      },
    ],
  },

  // ─── obj-fromentries ──────────────────────────────────────────────────────
  {
    slug: 'obj-fromentries',
    methodName: 'Object.fromEntries()',
    title: 'Object.fromEntries()',
    description: '把 [key, value] 可迭代物件（陣列或 Map）轉換成普通物件。',
    subCategory: '物件遍歷',
    difficulty: 'medium',
    notes: {
      title: 'Object.fromEntries()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`Object.fromEntries(iterable)\`

- 接受任何可迭代物件，每個元素須為 \`[key, value]\` 格式。
- 回傳：一個新的**普通物件**（plain object）。
- 是 \`Object.entries()\` 的逆操作。
- ES2019（ES10）新增，現代瀏覽器皆支援。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
// 1. 從二維陣列建立物件
const pairs = [['name', 'Alice'], ['age', 30]]
Object.fromEntries(pairs)
// { name: 'Alice', age: 30 }

// 2. 從 Map 建立物件
const map = new Map([['x', 10], ['y', 20]])
Object.fromEntries(map)
// { x: 10, y: 20 }

// 3. 物件轉換管道（entries → filter → fromEntries）
const scores = { 數學: 90, 英文: 55, 科學: 75 }
const passed = Object.fromEntries(
  Object.entries(scores).filter(([, v]) => v >= 60)
)
// { 數學: 90, 科學: 75 }
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- 每個元素至少要有兩個成員（index 0 為 key，index 1 為 value），多餘的忽略。
- key 會被強制轉成字串（Symbol 除外）。
- 若有重複的 key，後面的 value 會覆蓋前面的。
- 不支援 IE，需要確認目標環境或使用 polyfill。`,
        },
      ],
    },
    keyPoints: [
      'Object.fromEntries() 接受可迭代物件，將每個 [key, value] 元素轉成物件屬性，是 Object.entries() 的逆操作。',
      '最常見的輸入來源有兩種：[key, value] 二維陣列，以及 Map 物件。',
      '與 Object.entries()、filter、map 組合，可建立物件資料轉換的完整管道，無需中間暫存變數。',
      '若有重複的 key，後者會覆蓋前者，使用前需注意資料來源是否有重複鍵。',
      'ES2019 新增，現代瀏覽器與 Node.js 12+ 皆支援，不支援 IE。',
    ],
    problems: [
      {
        id: 'basic',
        title: '從鍵值對陣列重建商品物件',
        difficulty: 'easy',
        description: `後端 API 有時會以 \`[key, value]\` 陣列格式傳回資料，前端需要將其轉回普通物件方便存取。

請使用 \`Object.fromEntries()\` 把 \`productPairs\` 二維陣列轉成物件 \`product\`，並驗證：
1. \`product.name\` 為 \`'無線滑鼠'\`
2. \`product.price\` 為 \`650\`
3. \`product.inStock\` 為 \`true\``,
        examples: [
          {
            input: `productPairs = [['name', '無線滑鼠'], ['price', 650], ['inStock', true]]`,
            output: `product = { name: '無線滑鼠', price: 650, inStock: true }`,
          },
        ],
        initialCode: `const productPairs = [['name', '無線滑鼠'], ['price', 650], ['inStock', true]]

// 使用 Object.fromEntries() 轉換
const product = Object.fromEntries(productPairs)
`,
        testCases: [
          {
            label: 'product.name 為 "無線滑鼠"',
            test: `const productPairs = [['name', '無線滑鼠'], ['price', 650], ['inStock', true]]
const product = Object.fromEntries(productPairs)
return product.name === '無線滑鼠'`,
          },
          {
            label: 'product.price 為 650',
            test: `const productPairs = [['name', '無線滑鼠'], ['price', 650], ['inStock', true]]
const product = Object.fromEntries(productPairs)
return product.price === 650`,
          },
          {
            label: 'product.inStock 為 true',
            test: `const productPairs = [['name', '無線滑鼠'], ['price', 650], ['inStock', true]]
const product = Object.fromEntries(productPairs)
return product.inStock === true`,
          },
        ],
      },
      {
        id: 'from-map',
        title: '把購物車 Map 轉成普通物件以供 JSON 序列化',
        difficulty: 'medium',
        description: `購物車邏輯使用 \`Map\` 結構儲存商品與數量，但 \`JSON.stringify\` 無法直接序列化 Map，需先轉成普通物件。

請使用 \`Object.fromEntries()\` 把 \`cartMap\` 轉成普通物件 \`cartObj\`。`,
        examples: [
          {
            input: `cartMap = new Map([['筆電', 1], ['滑鼠', 2], ['鍵盤', 1]])`,
            output: `cartObj = { 筆電: 1, 滑鼠: 2, 鍵盤: 1 }`,
          },
        ],
        initialCode: `const cartMap = new Map([['筆電', 1], ['滑鼠', 2], ['鍵盤', 1]])

// 使用 Object.fromEntries() 把 Map 轉成物件
const cartObj = Object.fromEntries(cartMap)
`,
        testCases: [
          {
            label: 'cartObj.筆電 為 1',
            test: `const cartMap = new Map([['筆電', 1], ['滑鼠', 2], ['鍵盤', 1]])
const cartObj = Object.fromEntries(cartMap)
return cartObj['筆電'] === 1`,
          },
          {
            label: 'cartObj.滑鼠 為 2',
            test: `const cartMap = new Map([['筆電', 1], ['滑鼠', 2], ['鍵盤', 1]])
const cartObj = Object.fromEntries(cartMap)
return cartObj['滑鼠'] === 2`,
          },
          {
            label: 'cartObj 共有 3 個屬性',
            test: `const cartMap = new Map([['筆電', 1], ['滑鼠', 2], ['鍵盤', 1]])
const cartObj = Object.fromEntries(cartMap)
return Object.keys(cartObj).length === 3`,
          },
        ],
      },
      {
        id: 'pipeline',
        title: '過濾高庫存商品：entries → filter → fromEntries',
        difficulty: 'medium',
        description: `庫存系統需要找出庫存量超過門檻值的商品，並以物件格式回傳，方便後續處理。

請使用 \`Object.entries()\`、\`filter()\`、\`Object.fromEntries()\` 完整管道，
從 \`inventory\` 物件中過濾出庫存量**大於** \`threshold\` 的商品，存到 \`highStock\`。`,
        examples: [
          {
            input: `inventory = { 耳機: 150, 充電線: 30, 保護殼: 200, 螢幕貼: 18, 鍵盤: 85 }，threshold = 50`,
            output: `highStock = { 耳機: 150, 保護殼: 200, 鍵盤: 85 }`,
          },
        ],
        initialCode: `const inventory = { 耳機: 150, 充電線: 30, 保護殼: 200, 螢幕貼: 18, 鍵盤: 85 }
const threshold = 50

// 使用 Object.entries → filter → Object.fromEntries
const highStock = Object.fromEntries(
  Object.entries(inventory).filter(([, v]) => v > threshold)
)
`,
        testCases: [
          {
            label: 'highStock 包含 "耳機": 150',
            test: `const inventory = { 耳機: 150, 充電線: 30, 保護殼: 200, 螢幕貼: 18, 鍵盤: 85 }
const threshold = 50
const highStock = Object.fromEntries(
  Object.entries(inventory).filter(([, v]) => v > threshold)
)
return highStock['耳機'] === 150`,
          },
          {
            label: 'highStock 不含 "充電線" 和 "螢幕貼"',
            test: `const inventory = { 耳機: 150, 充電線: 30, 保護殼: 200, 螢幕貼: 18, 鍵盤: 85 }
const threshold = 50
const highStock = Object.fromEntries(
  Object.entries(inventory).filter(([, v]) => v > threshold)
)
return !('充電線' in highStock) && !('螢幕貼' in highStock)`,
          },
          {
            label: 'highStock 共有 3 個屬性',
            test: `const inventory = { 耳機: 150, 充電線: 30, 保護殼: 200, 螢幕貼: 18, 鍵盤: 85 }
const threshold = 50
const highStock = Object.fromEntries(
  Object.entries(inventory).filter(([, v]) => v > threshold)
)
return Object.keys(highStock).length === 3`,
          },
        ],
      },
    ],
  },
]
