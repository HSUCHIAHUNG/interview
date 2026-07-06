export interface TestCase {
  label: string
  test: string // function body, must end with `return <boolean expression>`
}

export interface CodingChallenge {
  title: string
  description: string
  initialCode: string
  testCases: TestCase[]
}

export interface NotesSection {
  heading: string
  content: string
}

export interface MethodNotes {
  title: string
  sections: NotesSection[]
}

export interface MethodEntry {
  slug: string
  methodName: string
  title: string
  description: string
  subCategory: string
  difficulty: 'easy' | 'medium' | 'hard'
  notes: MethodNotes
  challenge: CodingChallenge
}

export const arrayMethodChallenges: MethodEntry[] = [
  // ─── 會改變原始陣列 ────────────────────────────────────────────
  {
    slug: 'array-push',
    methodName: 'push()',
    title: 'Array.push()',
    description: '在陣列末端加入一個或多個元素，回傳新的陣列長度。',
    subCategory: '會改變原始陣列',
    difficulty: 'easy',
    notes: {
      title: 'Array.push()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`arr.push(element1[, element2, ...])\`

回傳：**新的陣列長度**（number），不是陣列本身。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const arr = [1, 2, 3]
const newLen = arr.push(4, 5)
console.log(newLen)  // 5
console.log(arr)     // [1, 2, 3, 4, 5]

// 一次新增多個元素
arr.push('a', 'b')   // 回傳 7
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- 會**修改原陣列**（mutating）
- 回傳的是「新長度」，不是陣列本身，要注意別誤寫成 \`arr = arr.push(x)\`
- 效能 O(1)，操作末端比 unshift（操作開頭）快`,
        },
      ],
    },
    challenge: {
      title: '購物車新增商品',
      description: `你正在開發購物車功能。
請使用 \`push()\` 將以下兩個商品依序加入 \`cart\` 末端：
- \`{ id: 3, name: 'headphones', price: 299 }\`
- \`{ id: 4, name: 'keyboard', price: 129 }\`

並將 \`push()\` 最後一次呼叫的**回傳值**存到 \`newLength\`。`,
      initialCode: `const cart = [
  { id: 1, name: 'mouse', price: 49 },
  { id: 2, name: 'monitor', price: 399 },
]

// 在這裡用 push() 加入商品


let newLength // 將最後一次 push() 的回傳值存到這裡
`,
      testCases: [
        {
          label: 'cart 應有 4 個商品',
          test: `return cart.length === 4`,
        },
        {
          label: 'cart[2].name 應為 "headphones"',
          test: `return cart[2] && cart[2].name === 'headphones'`,
        },
        {
          label: 'cart[3].name 應為 "keyboard"',
          test: `return cart[3] && cart[3].name === 'keyboard'`,
        },
        {
          label: 'newLength 應為 4',
          test: `return newLength === 4`,
        },
      ],
    },
  },
  {
    slug: 'array-pop',
    methodName: 'pop()',
    title: 'Array.pop()',
    description: '移除並回傳陣列的最後一個元素。',
    subCategory: '會改變原始陣列',
    difficulty: 'easy',
    notes: {
      title: 'Array.pop()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`arr.pop()\`

回傳：**被移除的元素**；若陣列為空，回傳 \`undefined\`。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const arr = ['a', 'b', 'c']
const last = arr.pop()
console.log(last)  // 'c'
console.log(arr)   // ['a', 'b']

// 空陣列不會拋錯
[].pop()  // undefined
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- 會**修改原陣列**（mutating）
- 效能 O(1)，只操作末端
- 搭配 push 可以實作 **Stack（後進先出）** 結構`,
        },
      ],
    },
    challenge: {
      title: 'Undo 歷史記錄',
      description: `一個編輯器使用陣列儲存操作歷史。
請使用 \`pop()\` 執行「復原」（undo）：
1. 從 \`history\` 移除最後一個操作，存到 \`undone\`
2. 再移除一次，存到 \`undone2\``,
      initialCode: `const history = ['open', 'edit', 'format', 'save']

// 執行兩次 undo（pop），分別存到 undone 和 undone2
let undone
let undone2
`,
      testCases: [
        {
          label: 'undone 應為 "save"（最後一個操作）',
          test: `return undone === 'save'`,
        },
        {
          label: 'undone2 應為 "format"',
          test: `return undone2 === 'format'`,
        },
        {
          label: 'history 剩下 2 個元素',
          test: `return history.length === 2`,
        },
      ],
    },
  },
  {
    slug: 'array-shift',
    methodName: 'shift()',
    title: 'Array.shift()',
    description: '移除並回傳陣列的第一個元素。',
    subCategory: '會改變原始陣列',
    difficulty: 'easy',
    notes: {
      title: 'Array.shift()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`arr.shift()\`

回傳：**被移除的第一個元素**；若陣列為空，回傳 \`undefined\`。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const queue = ['task1', 'task2', 'task3']
const first = queue.shift()
console.log(first)  // 'task1'
console.log(queue)  // ['task2', 'task3']
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- 會**修改原陣列**（mutating）
- 效能 **O(n)**：移除後所有元素索引都要更新，比 pop() 慢
- 搭配 push 可以實作 **Queue（先進先出）** 結構`,
        },
      ],
    },
    challenge: {
      title: '任務佇列處理',
      description: `一個任務佇列（queue）先進先出。
請使用 \`shift()\` 依序取出並處理前兩個任務：
1. 取出第一個任務，存到 \`task1\`
2. 取出下一個任務（原本的第二個），存到 \`task2\``,
      initialCode: `const queue = ['task-A', 'task-B', 'task-C', 'task-D']

// 依序取出前兩個任務
let task1
let task2
`,
      testCases: [
        {
          label: 'task1 應為 "task-A"',
          test: `return task1 === 'task-A'`,
        },
        {
          label: 'task2 應為 "task-B"',
          test: `return task2 === 'task-B'`,
        },
        {
          label: 'queue 剩下 2 個任務',
          test: `return queue.length === 2`,
        },
        {
          label: 'queue[0] 應為 "task-C"',
          test: `return queue[0] === 'task-C'`,
        },
      ],
    },
  },
  {
    slug: 'array-unshift',
    methodName: 'unshift()',
    title: 'Array.unshift()',
    description: '在陣列開頭加入一個或多個元素，回傳新的陣列長度。',
    subCategory: '會改變原始陣列',
    difficulty: 'easy',
    notes: {
      title: 'Array.unshift()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`arr.unshift(element1[, element2, ...])\`

回傳：**新的陣列長度**（number）。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const arr = [3, 4, 5]
arr.unshift(1, 2)
console.log(arr)  // [1, 2, 3, 4, 5]

// 一次傳多個時，保持參數順序（1 在最前面）
arr.unshift('a', 'b')  // ['a', 'b', 1, 2, 3, 4, 5]
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- 會**修改原陣列**（mutating）
- 效能 **O(n)**：插入後所有元素索引都要更新，比 push 慢
- 一次傳多個參數比多次呼叫 unshift 效率高`,
        },
      ],
    },
    challenge: {
      title: '通知優先佇列',
      description: `通知系統中，緊急通知要插到最前面。
請使用 \`unshift()\` 將緊急通知 \`{ type: 'error', msg: 'Server down' }\` 和 \`{ type: 'warning', msg: 'CPU high' }\` **依序**插到 \`notifications\` 開頭。
（兩者一次呼叫 unshift 完成，error 要在最前面）`,
      initialCode: `const notifications = [
  { type: 'info', msg: 'Deployment done' },
  { type: 'info', msg: 'New user registered' },
]

// 一次呼叫 unshift()，將 error 和 warning 插到開頭
// 最終順序：error, warning, info, info
`,
      testCases: [
        {
          label: 'notifications[0].type 應為 "error"',
          test: `return notifications[0] && notifications[0].type === 'error'`,
        },
        {
          label: 'notifications[1].type 應為 "warning"',
          test: `return notifications[1] && notifications[1].type === 'warning'`,
        },
        {
          label: 'notifications 應有 4 個元素',
          test: `return notifications.length === 4`,
        },
      ],
    },
  },
  {
    slug: 'array-splice',
    methodName: 'splice()',
    title: 'Array.splice()',
    description: '從指定位置刪除或插入元素，會修改原陣列並回傳被刪除的元素。',
    subCategory: '會改變原始陣列',
    difficulty: 'medium',
    notes: {
      title: 'Array.splice()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`arr.splice(start, deleteCount[, item1, item2, ...])\`

- **start**：從哪個 index 開始，負數從末端算
- **deleteCount**：刪除幾個元素，0 表示只插入不刪除
- **item1, item2...**：要插入的新元素（可選）

回傳：**被刪除元素組成的陣列**（可能是空陣列）。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const arr = ['a', 'b', 'c', 'd', 'e']

// 刪除：從 index 1 刪 2 個
arr.splice(1, 2)       // 回傳 ['b', 'c']，arr = ['a', 'd', 'e']

// 插入：從 index 1 刪 0 個，插入 'x', 'y'
arr.splice(1, 0, 'x', 'y')  // 回傳 []，arr = ['a', 'x', 'y', 'd', 'e']

// 替換：從 index 1 刪 1 個，插入 'z'
arr.splice(1, 1, 'z')  // 回傳 ['x']，arr = ['a', 'z', 'y', 'd', 'e']
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- 會**修改原陣列**（mutating）
- 和 \`slice\` 很像但完全不同：splice 會修改，slice 不會
- deleteCount 省略時，從 start 到末端全刪
- 負數 start：-1 代表最後一個元素`,
        },
      ],
    },
    challenge: {
      title: '待辦清單管理',
      description: `一個待辦清單需要進行以下操作：
1. 刪除 index 1 的項目（\`'Buy groceries'\`），存到 \`removed\`
2. 在現在的 index 1 位置插入兩個新項目：\`'Team meeting'\` 和 \`'Code review'\`（不刪除現有項目）`,
      initialCode: `const todos = ['Email boss', 'Buy groceries', 'Fix bug', 'Write tests']

// Step 1: 刪除 index 1 的項目，存到 removed
let removed

// Step 2: 在 index 1 插入 'Team meeting' 和 'Code review'（不刪除現有項目）
`,
      testCases: [
        {
          label: 'removed 應為 ["Buy groceries"]',
          test: `return Array.isArray(removed) && removed[0] === 'Buy groceries' && removed.length === 1`,
        },
        {
          label: 'todos[1] 應為 "Team meeting"',
          test: `return todos[1] === 'Team meeting'`,
        },
        {
          label: 'todos[2] 應為 "Code review"',
          test: `return todos[2] === 'Code review'`,
        },
        {
          label: 'todos 最終應有 5 個項目',
          test: `return todos.length === 5`,
        },
      ],
    },
  },
  {
    slug: 'array-sort',
    methodName: 'sort()',
    title: 'Array.sort()',
    description: '對陣列元素排序（預設為字串排序），可傳入比較函式自訂排序邏輯。',
    subCategory: '會改變原始陣列',
    difficulty: 'medium',
    notes: {
      title: 'Array.sort()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`arr.sort([compareFn])\`

回傳：**同一個陣列**（已被修改）。compareFn(a, b)：
- 回傳**負數** → a 排在 b 前面
- 回傳**正數** → b 排在 a 前面
- 回傳 **0** → 順序不變`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
// ❌ 預設字串排序（數字會出錯）
[10, 1, 21, 2].sort()           // [1, 10, 2, 21]

// ✅ 數字升冪
[10, 1, 21, 2].sort((a, b) => a - b)  // [1, 2, 10, 21]

// ✅ 數字降冪
[10, 1, 21, 2].sort((a, b) => b - a)  // [21, 10, 2, 1]

// ✅ 字串字母排序
['banana', 'apple', 'cherry'].sort()  // ['apple', 'banana', 'cherry']

// ✅ 物件依欄位排序
users.sort((a, b) => a.age - b.age)
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- 會**修改原陣列**（mutating），若要保留原陣列先複製：\`[...arr].sort()\`
- 數字**一定要傳 compareFn**，否則按字串比較（10 < 2 就是典型 bug）
- ES2019 後保證是穩定排序（stable sort）`,
        },
      ],
    },
    challenge: {
      title: '商品價格排序',
      description: `請對 \`products\` 陣列進行以下操作：
1. 將 \`prices\` 陣列以**數字升冪**排序（最低到最高）
2. 將 \`products\` 陣列依 \`price\` 欄位**降冪**排序（最高到最低）`,
      initialCode: `const prices = [199, 49, 999, 29, 149]

// Step 1: 將 prices 升冪排序（注意：不能用預設 sort！）


const products = [
  { name: 'Keyboard', price: 79 },
  { name: 'Monitor', price: 399 },
  { name: 'Mouse', price: 29 },
  { name: 'Headphones', price: 149 },
]

// Step 2: 將 products 依 price 降冪排序
`,
      testCases: [
        {
          label: 'prices[0] 應為 29（最小值）',
          test: `return prices[0] === 29`,
        },
        {
          label: 'prices 升冪排序正確',
          test: `return JSON.stringify(prices) === JSON.stringify([29, 49, 149, 199, 999])`,
        },
        {
          label: 'products[0].name 應為 "Monitor"（最貴）',
          test: `return products[0] && products[0].name === 'Monitor'`,
        },
        {
          label: 'products 降冪排序正確',
          test: `return products.map(p => p.price).join(',') === '399,149,79,29'`,
        },
      ],
    },
  },
  {
    slug: 'array-reverse',
    methodName: 'reverse()',
    title: 'Array.reverse()',
    description: '反轉陣列元素的順序，會修改原陣列。',
    subCategory: '會改變原始陣列',
    difficulty: 'easy',
    notes: {
      title: 'Array.reverse()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`arr.reverse()\`

回傳：**同一個陣列的參考**（已被反轉），不是新陣列。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const arr = [1, 2, 3, 4, 5]
arr.reverse()
console.log(arr)          // [5, 4, 3, 2, 1]

// arr 和 result 是同一個物件
const result = arr.reverse()
console.log(result === arr)  // true

// 保留原陣列：先複製再反轉
const original = [1, 2, 3]
const reversed = [...original].reverse()
console.log(original)  // [1, 2, 3]（不變）
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- 會**修改原陣列**（mutating）
- 回傳的是同一個陣列，不是新陣列，別誤以為不影響原陣列
- 若要不修改原陣列：\`[...arr].reverse()\` 或 \`arr.toReversed()\`（ES2023）`,
        },
      ],
    },
    challenge: {
      title: '麵包屑導航反轉',
      description: `一個麵包屑（breadcrumb）導航系統需要你：
1. 建立 \`path\` 的**反轉副本**存到 \`reversed\`（不能修改 \`path\`）
2. 直接反轉 \`steps\` 陣列`,
      initialCode: `const path = ['Home', 'Products', 'Electronics', 'Phones']

// Step 1: 建立反轉副本存到 reversed（path 本身不能被修改）
let reversed

// Step 2: 直接反轉 steps
const steps = [1, 2, 3, 4, 5]
`,
      testCases: [
        {
          label: 'reversed 應為反轉後的陣列',
          test: `return JSON.stringify(reversed) === JSON.stringify(['Phones', 'Electronics', 'Products', 'Home'])`,
        },
        {
          label: 'path 原陣列不能被修改',
          test: `return path[0] === 'Home'`,
        },
        {
          label: 'steps 應被就地反轉',
          test: `return JSON.stringify(steps) === JSON.stringify([5, 4, 3, 2, 1])`,
        },
      ],
    },
  },
  {
    slug: 'array-fill',
    methodName: 'fill()',
    title: 'Array.fill()',
    description: '用指定值填充陣列的一段範圍，會修改原陣列。',
    subCategory: '會改變原始陣列',
    difficulty: 'easy',
    notes: {
      title: 'Array.fill()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`arr.fill(value[, start[, end]])\`

- **value**：填入的值
- **start**：開始 index（含），預設 0
- **end**：結束 index（**不含**），預設 arr.length

回傳：**同一個陣列**（已被修改）。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
[1, 2, 3, 4, 5].fill(0)          // [0, 0, 0, 0, 0]
[1, 2, 3, 4, 5].fill(0, 2)       // [1, 2, 0, 0, 0]
[1, 2, 3, 4, 5].fill(0, 2, 4)    // [1, 2, 0, 0, 5]（index 2~3）

// 常見用途：建立初始化陣列
new Array(5).fill(0)              // [0, 0, 0, 0, 0]
new Array(3).fill(null)           // [null, null, null]
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- end 是**不包含**的（exclusive），fill(0, 2, 4) 填充 index 2 和 3
- 填入物件時，所有位置指向**同一個物件參考**，修改一個會影響全部
\`\`\`js
// ❌ 危險：填入物件
new Array(3).fill({})  // 三個位置共用同一個 {}
// ✅ 正確：每個位置獨立物件
Array.from({ length: 3 }, () => ({}))
\`\`\``,
        },
      ],
    },
    challenge: {
      title: '初始化遊戲棋盤',
      description: `請完成以下任務：
1. 建立一個長度為 5 的陣列 \`board\`，所有格子初始值為 \`0\`（使用 \`new Array\` + \`fill\`）
2. 將 \`matrix\` 中 index 2 到 4（不含）的格子設為 \`1\``,
      initialCode: `// Step 1: 建立長度 5 全為 0 的陣列
let board

// Step 2: 將 matrix index 2 到 3 設為 1
const matrix = [0, 0, 0, 0, 0, 0]
`,
      testCases: [
        {
          label: 'board 應有 5 個元素，全為 0',
          test: `return Array.isArray(board) && board.length === 5 && board.every(x => x === 0)`,
        },
        {
          label: 'matrix[2] 和 matrix[3] 應為 1',
          test: `return matrix[2] === 1 && matrix[3] === 1`,
        },
        {
          label: 'matrix[0], matrix[1], matrix[4], matrix[5] 仍應為 0',
          test: `return matrix[0] === 0 && matrix[1] === 0 && matrix[4] === 0 && matrix[5] === 0`,
        },
      ],
    },
  },

  // ─── 回傳陣列元素資訊或索引值 ──────────────────────────────────
  {
    slug: 'array-indexof',
    methodName: 'indexOf()',
    title: 'Array.indexOf()',
    description: '回傳指定值第一次出現的索引，找不到回傳 -1。',
    subCategory: '回傳陣列元素資訊或索引值',
    difficulty: 'easy',
    notes: {
      title: 'Array.indexOf()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`arr.indexOf(searchValue[, fromIndex])\`

- **searchValue**：要搜尋的值
- **fromIndex**：從哪個 index 開始搜尋（可選）

回傳：第一次出現的 **index**；找不到回傳 **-1**。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const arr = [1, 2, 3, 2, 1]
arr.indexOf(2)         // 1
arr.indexOf(99)        // -1
arr.indexOf(2, 2)      // 3（從 index 2 開始找）

// 判斷存在
if (arr.indexOf('admin') !== -1) { ... }
// 更推薦使用 includes()
if (arr.includes('admin')) { ... }
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- 使用**嚴格相等（===）**比較
- **無法搜尋 NaN**（NaN !== NaN），請改用 \`findIndex(x => Number.isNaN(x))\` 或 \`includes(NaN)\`
- 只能搜尋確切的值，複雜條件改用 \`findIndex\``,
        },
      ],
    },
    challenge: {
      title: '標籤系統',
      description: `一個標籤系統需要：
1. 找出 \`'TypeScript'\` 在 \`tags\` 中的位置，存到 \`tsIndex\`
2. 判斷 \`'Vue'\` 是否存在於 \`tags\`（回傳 boolean），存到 \`hasVue\`
3. 找出 \`2\` 在 \`nums\` 中**第二次**出現的位置，存到 \`secondIdx\`（提示：使用 indexOf 的第二個參數）`,
      initialCode: `const tags = ['React', 'TypeScript', 'Node.js', 'CSS', 'TypeScript']
const nums = [1, 2, 3, 2, 4, 2]

let tsIndex    // 'TypeScript' 第一次出現的 index
let hasVue     // 'Vue' 是否存在（boolean）
let secondIdx  // 數字 2 第二次出現的 index
`,
      testCases: [
        {
          label: 'tsIndex 應為 1',
          test: `return tsIndex === 1`,
        },
        {
          label: 'hasVue 應為 false',
          test: `return hasVue === false`,
        },
        {
          label: 'secondIdx 應為 3',
          test: `return secondIdx === 3`,
        },
      ],
    },
  },
  {
    slug: 'array-find',
    methodName: 'find()',
    title: 'Array.find()',
    description: '回傳第一個符合條件的元素，找不到回傳 undefined。',
    subCategory: '回傳陣列元素資訊或索引值',
    difficulty: 'easy',
    notes: {
      title: 'Array.find()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`arr.find(callback(element[, index[, array]]))\`

回傳：第一個使 callback 回傳 truthy 的**元素本身**；找不到回傳 **undefined**。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
]

users.find(u => u.id === 2)     // { id: 2, name: 'Bob' }
users.find(u => u.id === 99)    // undefined

// 可以搜尋 NaN（indexOf 做不到）
[1, NaN, 3].find(x => Number.isNaN(x))  // NaN
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- 回傳**元素本身**（不是 index），要 index 用 \`findIndex\`
- 找不到回傳 **undefined**（不是 -1 或 null）
- 遇到第一個符合條件的就停止（短路行為），效能比 filter 好`,
        },
      ],
    },
    challenge: {
      title: '使用者查詢',
      description: `使用 \`find()\` 完成以下查詢：
1. 找出 \`id\` 為 \`3\` 的使用者，存到 \`user\`
2. 找出第一個 \`age >= 30\` 的使用者，存到 \`senior\`
3. 嘗試找出 \`id\` 為 \`99\` 的使用者，存到 \`ghost\``,
      initialCode: `const users = [
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 32 },
  { id: 3, name: 'Carol', age: 28 },
  { id: 4, name: 'Dave', age: 35 },
]

let user    // id 為 3 的使用者
let senior  // 第一個 age >= 30 的使用者
let ghost   // id 為 99（不存在）
`,
      testCases: [
        {
          label: 'user.name 應為 "Carol"',
          test: `return user && user.name === 'Carol'`,
        },
        {
          label: 'senior.name 應為 "Bob"（第一個 age >= 30）',
          test: `return senior && senior.name === 'Bob'`,
        },
        {
          label: 'ghost 應為 undefined',
          test: `return ghost === undefined`,
        },
      ],
    },
  },
  {
    slug: 'array-findindex',
    methodName: 'findIndex()',
    title: 'Array.findIndex()',
    description: '回傳第一個符合條件元素的索引，找不到回傳 -1。',
    subCategory: '回傳陣列元素資訊或索引值',
    difficulty: 'easy',
    notes: {
      title: 'Array.findIndex()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`arr.findIndex(callback(element[, index[, array]]))\`

回傳：第一個使 callback 回傳 truthy 的元素的 **index**；找不到回傳 **-1**。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const arr = [5, 12, 8, 130, 44]
arr.findIndex(x => x > 10)     // 1（12 在 index 1）
arr.findIndex(x => x > 1000)   // -1

// 常見應用：找到後更新陣列
const users = [{ id: 1 }, { id: 2 }, { id: 3 }]
const idx = users.findIndex(u => u.id === 2)
if (idx !== -1) {
  users[idx] = { id: 2, name: 'Updated' }
}
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- 回傳 **index**（不是元素本身），和 \`find()\` 的差異
- 找不到回傳 **-1**（不是 undefined）
- 用途：找到位置後想直接更新該位置的元素`,
        },
      ],
    },
    challenge: {
      title: '更新購物車商品',
      description: `使用 \`findIndex()\` 找到商品位置，再更新它：
1. 找出 \`id\` 為 \`2\` 的商品 index，存到 \`idx\`
2. 利用 \`idx\` 將該商品的 \`quantity\` 更新為 \`5\`
3. 找出不存在的 \`id: 99\` 的 index，存到 \`notFound\``,
      initialCode: `const items = [
  { id: 1, name: 'Apple', quantity: 2 },
  { id: 2, name: 'Banana', quantity: 1 },
  { id: 3, name: 'Cherry', quantity: 3 },
]

let idx       // id 為 2 的商品的 index
let notFound  // id 為 99 的 index（不存在）

// 使用 idx 更新 id:2 的商品 quantity 為 5
`,
      testCases: [
        {
          label: 'idx 應為 1',
          test: `return idx === 1`,
        },
        {
          label: 'items[idx].quantity 應被更新為 5',
          test: `return items[1] && items[1].quantity === 5`,
        },
        {
          label: 'notFound 應為 -1',
          test: `return notFound === -1`,
        },
      ],
    },
  },
  {
    slug: 'array-filter',
    methodName: 'filter()',
    title: 'Array.filter()',
    description: '回傳所有符合條件的元素組成的新陣列，不修改原陣列。',
    subCategory: '回傳陣列元素資訊或索引值',
    difficulty: 'easy',
    notes: {
      title: 'Array.filter()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`arr.filter(callback(element[, index[, array]]))\`

回傳：包含所有使 callback 回傳 truthy 的元素的**新陣列**；若無符合，回傳**空陣列 []**。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
[1, 2, 3, 4, 5].filter(x => x % 2 === 0)   // [2, 4]
[1, 2, 3].filter(x => x > 10)              // []

// 去除 falsy 值（0, '', null, undefined, false, NaN）
[0, 1, '', 'hi', null].filter(Boolean)     // [1, 'hi']

// 篩選物件
users.filter(u => u.age >= 18 && u.active)
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- **不修改原陣列**，回傳新陣列
- 找不到時回傳 **[]**，不是 null 或 undefined（鏈接操作安全）
- vs \`find\`：find 找第一個元素，filter 找所有元素`,
        },
      ],
    },
    challenge: {
      title: '商品篩選',
      description: `使用 \`filter()\` 完成以下篩選（都不能修改 \`products\`）：
1. 篩選出 \`price < 100\` 的商品，存到 \`cheap\`
2. 篩選出 \`inStock === true\` 的商品，存到 \`available\`
3. 篩選出 \`price >= 100\` **且** \`inStock === true\` 的商品，存到 \`premium\``,
      initialCode: `const products = [
  { name: 'Pencil',    price: 2,   inStock: true  },
  { name: 'Notebook',  price: 15,  inStock: false },
  { name: 'Laptop',    price: 999, inStock: true  },
  { name: 'Mouse',     price: 49,  inStock: true  },
  { name: 'Monitor',   price: 399, inStock: false },
  { name: 'Keyboard',  price: 79,  inStock: true  },
]

let cheap      // price < 100
let available  // inStock === true
let premium    // price >= 100 且 inStock === true
`,
      testCases: [
        {
          label: 'cheap 應有 4 個商品',
          test: `return Array.isArray(cheap) && cheap.length === 4`,
        },
        {
          label: 'available 應有 4 個商品',
          test: `return Array.isArray(available) && available.length === 4`,
        },
        {
          label: 'premium 只有 Laptop',
          test: `return Array.isArray(premium) && premium.length === 1 && premium[0].name === 'Laptop'`,
        },
        {
          label: 'products 原陣列不能被修改（仍有 6 個元素）',
          test: `return products.length === 6`,
        },
      ],
    },
  },

  // ─── 針對每個元素處理 ────────────────────────────────────────
  {
    slug: 'array-foreach',
    methodName: 'forEach()',
    title: 'Array.forEach()',
    description: '對每個元素執行一次 callback，回傳 undefined，適合執行副作用。',
    subCategory: '針對每個元素處理',
    difficulty: 'easy',
    notes: {
      title: 'Array.forEach()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`arr.forEach(callback(element[, index[, array]]))\`

回傳：永遠是 **undefined**，不管 callback 回傳什麼都被丟棄。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
[1, 2, 3].forEach((num, idx) => {
  console.log(idx, num)  // 0 1, 1 2, 2 3
})

// ❌ 回傳值沒有意義
const result = [1, 2, 3].forEach(x => x * 2)
console.log(result)  // undefined

// ❌ 不等待 async callback
[1, 2, 3].forEach(async x => { await fetch('/api/' + x) })
// ✅ 用 for...of 或 Promise.all + map
for (const x of [1, 2, 3]) { await fetch('/api/' + x) }
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- 無法用 **break** 提早結束（需改用 for...of 或 some）
- 不等待 **async callback**（需改用 for...of 或 Promise.all + map）
- 適合執行**副作用**（console.log、DOM 操作）；需要回傳值用 map`,
        },
      ],
    },
    challenge: {
      title: '統計與格式化',
      description: `使用 \`forEach()\` 完成以下任務：
1. 遍歷 \`scores\`，計算所有分數的總和，存到 \`total\`
2. 遍歷 \`users\`，將每個 \`name\` 轉成大寫並 push 到 \`upperNames\``,
      initialCode: `const scores = [85, 92, 78, 96, 88]
let total = 0

// Step 1: 用 forEach 計算 total
scores.forEach(/* 在這裡實作 */)

const users = [{ name: 'alice' }, { name: 'bob' }, { name: 'carol' }]
const upperNames = []

// Step 2: 用 forEach 將名字轉大寫 push 到 upperNames
users.forEach(/* 在這裡實作 */)
`,
      testCases: [
        {
          label: 'total 應為 439',
          test: `return total === 439`,
        },
        {
          label: 'upperNames 應有 3 個元素',
          test: `return upperNames.length === 3`,
        },
        {
          label: 'upperNames[0] 應為 "ALICE"',
          test: `return upperNames[0] === 'ALICE'`,
        },
        {
          label: 'upperNames[2] 應為 "CAROL"',
          test: `return upperNames[2] === 'CAROL'`,
        },
      ],
    },
  },

  // ─── 產生新的陣列或新的值 ────────────────────────────────────
  {
    slug: 'array-map',
    methodName: 'map()',
    title: 'Array.map()',
    description: '對每個元素轉換，回傳等長的新陣列，不修改原陣列。',
    subCategory: '產生新的陣列或新的值',
    difficulty: 'easy',
    notes: {
      title: 'Array.map()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`arr.map(callback(element[, index[, array]]))\`

回傳：與原陣列**等長的新陣列**，每個元素是 callback 的回傳值。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
[1, 2, 3].map(x => x * 2)                // [2, 4, 6]
users.map(u => u.name)                    // ['Alice', 'Bob', ...]
users.map(u => ({ ...u, active: true }))  // 新增欄位

// 搭配 index
['a', 'b', 'c'].map((x, i) => \`\${i}:\${x}\`)  // ['0:a', '1:b', '2:c']
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- **不修改原陣列**，回傳新陣列
- callback 必須有 **return**，否則新陣列的元素會是 undefined
- 回傳陣列長度永遠和原陣列相同（要改變長度用 filter）`,
        },
      ],
    },
    challenge: {
      title: '資料轉換',
      description: `使用 \`map()\` 完成以下轉換（不能修改原陣列）：
1. 將 \`prices\` 每個價格打九折，存到 \`discounted\`
2. 從 \`users\` 中取出所有 \`name\`，存到 \`names\`
3. 將 \`users\` 轉成包含 \`displayName\`（格式：\`"名字 (年齡)"\`）的新陣列，存到 \`display\``,
      initialCode: `const prices = [100, 200, 350, 80]
let discounted  // 每個價格打九折

const users = [
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 30 },
  { id: 3, name: 'Carol', age: 28 },
]
let names    // 取出所有 name
let display  // 格式：[{ displayName: 'Alice (25)' }, ...]
`,
      testCases: [
        {
          label: 'discounted 應為 [90, 180, 315, 72]',
          test: `return JSON.stringify(discounted) === JSON.stringify([90, 180, 315, 72])`,
        },
        {
          label: 'names 應為 ["Alice", "Bob", "Carol"]',
          test: `return JSON.stringify(names) === JSON.stringify(['Alice', 'Bob', 'Carol'])`,
        },
        {
          label: 'display[0].displayName 應為 "Alice (25)"',
          test: `return display && display[0] && display[0].displayName === 'Alice (25)'`,
        },
        {
          label: 'prices 原陣列不能被修改',
          test: `return prices[0] === 100`,
        },
      ],
    },
  },
  {
    slug: 'array-reduce',
    methodName: 'reduce()',
    title: 'Array.reduce()',
    description: '將陣列聚合成單一值，可以是數字、物件或另一個陣列。',
    subCategory: '產生新的陣列或新的值',
    difficulty: 'medium',
    notes: {
      title: 'Array.reduce()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`arr.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue])\`

- **accumulator**：累積值，每次迭代後更新
- **initialValue**：accumulator 的初始值（強烈建議提供）

回傳：最終的 accumulator 值（可以是任意類型）。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
// 加總
[1, 2, 3, 4].reduce((acc, cur) => acc + cur, 0)   // 10

// 最大值
[3, 1, 4, 1, 5].reduce((max, x) => x > max ? x : max, -Infinity)  // 5

// 轉成物件（以 id 為 key）
users.reduce((acc, user) => {
  acc[user.id] = user
  return acc  // ⚠️ 一定要 return acc！
}, {})

// 分組
orders.reduce((groups, order) => {
  const key = order.status
  groups[key] = groups[key] || []
  groups[key].push(order)
  return groups
}, {})
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- **一定要 return acc**，否則下次迭代的 acc 會是 undefined
- 空陣列且沒有 initialValue 會拋出 **TypeError**，建議永遠提供初始值
- 不修改原陣列`,
        },
      ],
    },
    challenge: {
      title: '訂單統計',
      description: `使用 \`reduce()\` 完成以下統計：
1. 計算 \`orders\` 中所有 \`amount\` 的總和，存到 \`total\`
2. 將 \`orders\` 依 \`status\` 分組成物件，存到 \`grouped\`（格式：\`{ pending: [...], paid: [...] }\`）
3. 找出 \`items\` 中的最大值，存到 \`max\``,
      initialCode: `const orders = [
  { id: 1, amount: 150, status: 'paid'    },
  { id: 2, amount: 80,  status: 'pending' },
  { id: 3, amount: 220, status: 'paid'    },
  { id: 4, amount: 60,  status: 'pending' },
]

let total    // 所有 amount 的總和
let grouped  // 依 status 分組

const items = [3, 7, 2, 15, 9, 4]
let max      // 最大值
`,
      testCases: [
        {
          label: 'total 應為 510',
          test: `return total === 510`,
        },
        {
          label: 'grouped.paid 應有 2 筆訂單',
          test: `return grouped && Array.isArray(grouped.paid) && grouped.paid.length === 2`,
        },
        {
          label: 'grouped.pending 應有 2 筆訂單',
          test: `return grouped && Array.isArray(grouped.pending) && grouped.pending.length === 2`,
        },
        {
          label: 'max 應為 15',
          test: `return max === 15`,
        },
      ],
    },
  },
  {
    slug: 'array-flat',
    methodName: 'flat()',
    title: 'Array.flat()',
    description: '展平巢狀陣列，預設展平一層，可指定深度。',
    subCategory: '產生新的陣列或新的值',
    difficulty: 'medium',
    notes: {
      title: 'Array.flat()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`arr.flat([depth])\`

- **depth**：展平的層數，預設為 **1**，\`Infinity\` 表示完全展平

回傳：展平後的**新陣列**，不修改原陣列。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
[1, [2, 3], [4, 5]].flat()          // [1, 2, 3, 4, 5]（預設一層）
[1, [2, [3, [4]]]].flat()           // [1, 2, [3, [4]]]（只展一層）
[1, [2, [3, [4]]]].flat(2)          // [1, 2, 3, [4]]
[1, [2, [3, [4]]]].flat(Infinity)   // [1, 2, 3, 4]（完全展平）
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- **不修改原陣列**
- flat(1) 只展平一層，巢狀更深需要指定 depth 或用 Infinity
- 空洞（empty slot）會被移除：\`[1, , 3].flat()\` → \`[1, 3]\``,
        },
      ],
    },
    challenge: {
      title: '展平巢狀資料',
      description: `使用 \`flat()\` 完成以下操作：
1. 將 \`matrix\` 展平一層，存到 \`flat1\`
2. 將 \`nested\` 完全展平（所有層），存到 \`flatAll\`
3. 將 \`comments\` 展平取出所有回覆，存到 \`allComments\``,
      initialCode: `const matrix = [[1, 2], [3, 4], [5, 6]]
let flat1   // 展平一層

const nested = [1, [2, [3, [4, [5]]]]]
let flatAll  // 完全展平

const comments = [
  { text: 'Great!', replies: ['Thanks!', 'Agreed'] },
  { text: 'Nice',   replies: ['Cool'] },
]
// 只取出所有 replies，展平成一個陣列
let allComments
`,
      testCases: [
        {
          label: 'flat1 應為 [1, 2, 3, 4, 5, 6]',
          test: `return JSON.stringify(flat1) === JSON.stringify([1,2,3,4,5,6])`,
        },
        {
          label: 'flatAll 應為 [1, 2, 3, 4, 5]',
          test: `return JSON.stringify(flatAll) === JSON.stringify([1,2,3,4,5])`,
        },
        {
          label: 'allComments 應包含所有回覆共 3 個',
          test: `return Array.isArray(allComments) && allComments.length === 3`,
        },
      ],
    },
  },
  {
    slug: 'array-flatmap',
    methodName: 'flatMap()',
    title: 'Array.flatMap()',
    description: '相當於 map() 後 flat(1)，先轉換再展平一層，效率比分開寫更高。',
    subCategory: '產生新的陣列或新的值',
    difficulty: 'medium',
    notes: {
      title: 'Array.flatMap()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`arr.flatMap(callback(element[, index[, array]]))\`

等同於 \`arr.map(...).flat(1)\`，但只遍歷一次，效能較好。
回傳：展平一層後的**新陣列**。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
// 句子分詞
['Hello World', 'foo bar'].flatMap(s => s.split(' '))
// ['Hello', 'World', 'foo', 'bar']

// 展開數量
[{ name: 'A', qty: 2 }, { name: 'B', qty: 3 }]
  .flatMap(item => Array(item.qty).fill(item.name))
// ['A', 'A', 'B', 'B', 'B']

// 可以利用回傳空陣列來「過濾並轉換」
[1, 2, 3, 4].flatMap(x => x % 2 === 0 ? [x * 10] : [])
// [20, 40]
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- 只展平**一層**，等同 flat(1)，不是完全展平
- 可以用來同時做 filter + map（回傳空陣列相當於過濾）
- 不修改原陣列`,
        },
      ],
    },
    challenge: {
      title: '句子分詞',
      description: `使用 \`flatMap()\` 完成以下操作：
1. 將 \`sentences\` 的每個句子用空格分割成單字，展平成一個單字陣列，存到 \`words\`
2. 將 \`cart\` 中每個商品根據 \`quantity\` 展開成多筆記錄，存到 \`lineItems\`（每個 item 重複 quantity 次）`,
      initialCode: `const sentences = ['Hello World', 'foo bar baz', 'TypeScript is great']
let words  // 所有單字展平成一維陣列

const cart = [
  { name: 'Apple',  quantity: 3 },
  { name: 'Banana', quantity: 2 },
]
// 展開成 ['Apple', 'Apple', 'Apple', 'Banana', 'Banana']
let lineItems
`,
      testCases: [
        {
          label: 'words 應有 8 個單字',
          test: `return Array.isArray(words) && words.length === 8`,
        },
        {
          label: 'words[0] 應為 "Hello"',
          test: `return words[0] === 'Hello'`,
        },
        {
          label: 'lineItems 應有 5 個元素',
          test: `return Array.isArray(lineItems) && lineItems.length === 5`,
        },
        {
          label: 'lineItems 前 3 個應為 "Apple"',
          test: `return lineItems[0] === 'Apple' && lineItems[2] === 'Apple'`,
        },
      ],
    },
  },
  {
    slug: 'array-slice',
    methodName: 'slice()',
    title: 'Array.slice()',
    description: '截取陣列的一段，回傳新陣列，不修改原陣列。',
    subCategory: '產生新的陣列或新的值',
    difficulty: 'easy',
    notes: {
      title: 'Array.slice()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`arr.slice([start[, end]])\`

- **start**：開始 index（含），負數從末端算，預設 0
- **end**：結束 index（**不含**），預設 arr.length

回傳：截取範圍的**新陣列**。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
const arr = [1, 2, 3, 4, 5]
arr.slice(1, 3)    // [2, 3]（index 1~2，不含 3）
arr.slice(2)       // [3, 4, 5]（從 index 2 到末端）
arr.slice(-2)      // [4, 5]（末端兩個）
arr.slice()        // [1, 2, 3, 4, 5]（複製整個陣列）

// 分頁實作
const page = 2, size = 3
arr.slice((page - 1) * size, page * size)  // 第 2 頁
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- **不修改原陣列**（vs splice 會修改）
- end 是**不包含**的
- \`slice()\` 不傳參數可以快速複製整個陣列（但注意是 shallow copy）`,
        },
      ],
    },
    challenge: {
      title: '分頁與截取',
      description: `使用 \`slice()\` 完成以下操作：
1. 取出 \`items\` 的前 3 個，存到 \`firstThree\`
2. 取出 \`items\` 的最後 2 個，存到 \`lastTwo\`（使用負數 index）
3. 實作分頁：每頁 3 個，取出第 2 頁的資料，存到 \`page2\``,
      initialCode: `const items = ['a', 'b', 'c', 'd', 'e', 'f', 'g']

let firstThree  // 前 3 個
let lastTwo     // 最後 2 個（用負數 index）

const pageSize = 3
const pageNum = 2  // 第 2 頁（從 1 開始）
let page2  // 第 2 頁的資料（'d', 'e', 'f'）
`,
      testCases: [
        {
          label: 'firstThree 應為 ["a", "b", "c"]',
          test: `return JSON.stringify(firstThree) === JSON.stringify(['a','b','c'])`,
        },
        {
          label: 'lastTwo 應為 ["f", "g"]',
          test: `return JSON.stringify(lastTwo) === JSON.stringify(['f','g'])`,
        },
        {
          label: 'page2 應為 ["d", "e", "f"]',
          test: `return JSON.stringify(page2) === JSON.stringify(['d','e','f'])`,
        },
        {
          label: 'items 原陣列不能被修改',
          test: `return items.length === 7`,
        },
      ],
    },
  },
  {
    slug: 'array-concat',
    methodName: 'concat()',
    title: 'Array.concat()',
    description: '合併兩個或多個陣列，回傳新陣列，不修改原陣列。',
    subCategory: '產生新的陣列或新的值',
    difficulty: 'easy',
    notes: {
      title: 'Array.concat()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`arr.concat(value1[, value2, ...])\`

- 參數可以是**陣列或非陣列值**，都會被加入
- 回傳：合併後的**新陣列**。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
[1, 2].concat([3, 4])          // [1, 2, 3, 4]
[1, 2].concat([3, 4], [5, 6])  // [1, 2, 3, 4, 5, 6]
[1, 2].concat(3, 4)            // [1, 2, 3, 4]（非陣列也可以）

// 等同展開運算符
[...[1, 2], ...[3, 4]]         // [1, 2, 3, 4]
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- **不修改原陣列**
- 只展平一層：\`[1].concat([[2, 3]])\` → \`[1, [2, 3]]\`
- 現代寫法更常用展開運算符 \`[...a, ...b]\`，可讀性更高`,
        },
      ],
    },
    challenge: {
      title: '合併資料來源',
      description: `使用 \`concat()\` 完成以下操作：
1. 合併 \`local\` 和 \`remote\` 成一個陣列，存到 \`all\`
2. 依序合併 \`a\`、\`b\`、\`c\` 三個陣列，存到 \`merged\`
3. 將單一元素 \`99\` 加入 \`nums\` 末端（用 concat，不用 push），存到 \`withExtra\``,
      initialCode: `const local  = [1, 2, 3]
const remote = [4, 5, 6]
let all  // 合併 local 和 remote

const a = ['x'], b = ['y', 'z'], c = ['w']
let merged  // 依序合併 a, b, c

const nums = [10, 20, 30]
let withExtra  // nums 加上 99
`,
      testCases: [
        {
          label: 'all 應為 [1, 2, 3, 4, 5, 6]',
          test: `return JSON.stringify(all) === JSON.stringify([1,2,3,4,5,6])`,
        },
        {
          label: 'merged 應為 ["x", "y", "z", "w"]',
          test: `return JSON.stringify(merged) === JSON.stringify(['x','y','z','w'])`,
        },
        {
          label: 'withExtra 應為 [10, 20, 30, 99]',
          test: `return JSON.stringify(withExtra) === JSON.stringify([10,20,30,99])`,
        },
        {
          label: 'nums 原陣列不能被修改',
          test: `return nums.length === 3`,
        },
      ],
    },
  },
  {
    slug: 'array-join',
    methodName: 'join()',
    title: 'Array.join()',
    description: '將陣列所有元素用指定分隔符連接成字串。',
    subCategory: '產生新的陣列或新的值',
    difficulty: 'easy',
    notes: {
      title: 'Array.join()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`arr.join([separator])\`

- **separator**：分隔符，預設是 \`','\`

回傳：所有元素連接而成的**字串**。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
['a', 'b', 'c'].join('-')     // 'a-b-c'
['a', 'b', 'c'].join('')      // 'abc'
['a', 'b', 'c'].join()        // 'a,b,c'（預設逗號）

// 應用
['api', 'users', '123'].join('/')   // 'api/users/123'
['id', 'name', 'email'].join(',')   // 'id,name,email'（CSV header）
words.join(' ')                     // 連接成句子
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- **不修改原陣列**
- null 和 undefined 會被轉為空字串：\`[1, null, 3].join('-')\` → \`'1--3'\`
- 反向操作是 \`String.split(separator)\``,
        },
      ],
    },
    challenge: {
      title: '路徑與 CSV 生成',
      description: `使用 \`join()\` 完成以下操作：
1. 將 \`pathParts\` 用 \`/\` 連接成路徑字串，存到 \`urlPath\`
2. 將 \`headers\` 用 \`',')\` 連接成 CSV 標頭行，存到 \`csvHeader\`
3. 將 \`words\` 用空格連接成句子，存到 \`sentence\``,
      initialCode: `const pathParts = ['api', 'users', '123', 'profile']
let urlPath  // "api/users/123/profile"

const headers = ['id', 'name', 'email', 'age']
let csvHeader  // "id,name,email,age"

const words = ['JavaScript', 'is', 'fun']
let sentence  // "JavaScript is fun"
`,
      testCases: [
        {
          label: 'urlPath 應為 "api/users/123/profile"',
          test: `return urlPath === 'api/users/123/profile'`,
        },
        {
          label: 'csvHeader 應為 "id,name,email,age"',
          test: `return csvHeader === 'id,name,email,age'`,
        },
        {
          label: 'sentence 應為 "JavaScript is fun"',
          test: `return sentence === 'JavaScript is fun'`,
        },
      ],
    },
  },

  // ─── 判斷並回傳布林值 ────────────────────────────────────────
  {
    slug: 'array-every',
    methodName: 'every()',
    title: 'Array.every()',
    description: '若所有元素都通過條件回傳 true，否則回傳 false。',
    subCategory: '判斷並回傳布林值',
    difficulty: 'easy',
    notes: {
      title: 'Array.every()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`arr.every(callback(element[, index[, array]]))\`

回傳：**boolean**。所有元素都使 callback 回傳 truthy 才回傳 \`true\`，否則 \`false\`。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
[2, 4, 6].every(x => x % 2 === 0)   // true（全偶數）
[2, 3, 6].every(x => x % 2 === 0)   // false（3 不是偶數，短路停止）

// 表單驗證：所有欄位都有值
fields.every(f => f.value.trim() !== '')

// 空陣列 every 永遠回傳 true
[].every(x => x > 100)  // true（空集合滿足任何條件）
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- 遇到第一個 falsy 就**短路停止**，不繼續遍歷
- 空陣列回傳 **true**（vacuous truth）
- 邏輯上等同 AND：全部符合才 true`,
        },
      ],
    },
    challenge: {
      title: '表單驗證',
      description: `使用 \`every()\` 完成以下驗證：
1. 確認 \`scores\` 中所有分數都 \`>= 60\`（及格），存到 \`allPassed\`
2. 確認 \`fields\` 中所有欄位都有值（\`value\` 不為空字串），存到 \`formValid\`
3. 確認 \`prices\` 全部是正數，存到 \`allPositive\``,
      initialCode: `const scores = [75, 88, 62, 95, 71]
let allPassed  // 是否全部 >= 60

const fields = [
  { name: 'username', value: 'alice' },
  { name: 'email',    value: 'alice@example.com' },
  { name: 'bio',      value: '' },
]
let formValid  // 是否所有欄位都有值

const prices = [9.99, 24.50, 0, 15.00]
let allPositive  // 是否全部 > 0
`,
      testCases: [
        {
          label: 'allPassed 應為 true',
          test: `return allPassed === true`,
        },
        {
          label: 'formValid 應為 false（bio 為空）',
          test: `return formValid === false`,
        },
        {
          label: 'allPositive 應為 false（有 0）',
          test: `return allPositive === false`,
        },
      ],
    },
  },
  {
    slug: 'array-some',
    methodName: 'some()',
    title: 'Array.some()',
    description: '若至少一個元素通過條件回傳 true，否則回傳 false。',
    subCategory: '判斷並回傳布林值',
    difficulty: 'easy',
    notes: {
      title: 'Array.some()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`arr.some(callback(element[, index[, array]]))\`

回傳：**boolean**。至少有一個元素使 callback 回傳 truthy 就回傳 \`true\`。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
[1, 2, 3].some(x => x > 2)    // true（3 > 2）
[1, 2, 3].some(x => x > 10)   // false

// 判斷角色是否存在
roles.some(r => r === 'admin')

// 判斷是否有缺貨
inventory.some(item => item.stock === 0)

// 空陣列 some 永遠回傳 false
[].some(x => x > 0)  // false
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- 遇到第一個 truthy 就**短路停止**，不繼續遍歷
- 空陣列回傳 **false**
- 邏輯上等同 OR：任一符合就 true
- 比 \`find()\` 語意更明確（只關心「是否存在」，不需要元素本身）`,
        },
      ],
    },
    challenge: {
      title: '權限與庫存檢查',
      description: `使用 \`some()\` 完成以下檢查：
1. 確認 \`roles\` 中是否有 \`'admin'\`，存到 \`isAdmin\`
2. 確認 \`inventory\` 中是否有任何商品的 \`stock\` 為 \`0\`（缺貨），存到 \`hasOutOfStock\`
3. 確認 \`scores\` 中是否有不及格（\`< 60\`）的分數，存到 \`anyFailed\``,
      initialCode: `const roles = ['user', 'editor', 'admin']
let isAdmin  // 是否有 admin 角色

const inventory = [
  { name: 'Apple',  stock: 50 },
  { name: 'Banana', stock: 0  },
  { name: 'Cherry', stock: 30 },
]
let hasOutOfStock  // 是否有缺貨商品

const scores = [85, 72, 90, 68]
let anyFailed  // 是否有不及格
`,
      testCases: [
        {
          label: 'isAdmin 應為 true',
          test: `return isAdmin === true`,
        },
        {
          label: 'hasOutOfStock 應為 true',
          test: `return hasOutOfStock === true`,
        },
        {
          label: 'anyFailed 應為 false',
          test: `return anyFailed === false`,
        },
      ],
    },
  },
  {
    slug: 'array-includes',
    methodName: 'includes()',
    title: 'Array.includes()',
    description: '判斷陣列是否包含指定值，回傳 boolean（可處理 NaN）。',
    subCategory: '判斷並回傳布林值',
    difficulty: 'easy',
    notes: {
      title: 'Array.includes()',
      sections: [
        {
          heading: '語法與回傳值',
          content: `\`arr.includes(searchValue[, fromIndex])\`

- **fromIndex**：從哪個 index 開始搜尋，可為負數

回傳：**boolean**，包含回傳 \`true\`，否則 \`false\`。`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`js
[1, 2, 3].includes(2)        // true
[1, 2, 3].includes(4)        // false
[1, NaN, 3].includes(NaN)    // true（✅ 能找到 NaN）

// 從指定位置開始
[1, 2, 3, 2].includes(2, 2)  // true（從 index 2 開始找）

// 比 indexOf 更語意清楚
if (arr.includes('admin')) { ... }         // ✅ 清楚
if (arr.indexOf('admin') !== -1) { ... }  // 比較囉嗦
\`\`\``,
        },
        {
          heading: '注意事項',
          content: `- 使用 **SameValueZero** 比較（類似 === 但能找到 NaN）
- \`indexOf\` 無法搜尋 NaN，\`includes\` 可以
- 只能搜尋確切的值，複雜條件改用 \`some()\``,
        },
      ],
    },
    challenge: {
      title: '白名單與特殊值檢查',
      description: `使用 \`includes()\` 完成以下判斷：
1. 確認 \`allowedRoles\` 是否包含 \`userRole\`，存到 \`allowed\`
2. 確認 \`data\` 中是否包含 \`NaN\`，存到 \`hasNaN\`（提示：includes 可以找 NaN，indexOf 不行）
3. 確認 \`fruits\` 從 index \`2\` 開始是否包含 \`'apple'\`，存到 \`hasAppleAfter2\``,
      initialCode: `const allowedRoles = ['admin', 'editor', 'moderator']
const userRole = 'viewer'
let allowed  // userRole 是否在白名單中

const data = [1, 2, NaN, 4, 5]
let hasNaN  // 是否包含 NaN

const fruits = ['mango', 'banana', 'apple', 'grape']
let hasAppleAfter2  // 從 index 2 開始是否有 'apple'
`,
      testCases: [
        {
          label: 'allowed 應為 false',
          test: `return allowed === false`,
        },
        {
          label: 'hasNaN 應為 true',
          test: `return hasNaN === true`,
        },
        {
          label: 'hasAppleAfter2 應為 true',
          test: `return hasAppleAfter2 === true`,
        },
      ],
    },
  },
]

export function getMethodChallenge(slug: string): MethodEntry | undefined {
  return arrayMethodChallenges.find(m => m.slug === slug)
}

export function getAllMethodSlugs(): string[] {
  return arrayMethodChallenges.map(m => m.slug)
}

export function hasPracticeChallenge(slug: string): boolean {
  return arrayMethodChallenges.some(m => m.slug === slug)
}
