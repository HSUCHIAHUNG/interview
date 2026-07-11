export interface TestCase {
  label: string
  test: string // JS snippet; must end with `return <boolean expression>`
}

export interface Example {
  input: string
  output: string
  note?: string
}

export interface Problem {
  id: string
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  description: string
  constraints?: string[]
  examples?: Example[]
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
  problems: Problem[]
  keyPoints?: string[]  // oral-friendly sentences for listen mode; immutable once audio is generated
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
    keyPoints: [
      'push 方法用來在陣列的最後面加入一個或多個元素，並且會直接修改原始陣列。',
      'push 的回傳值是新的陣列長度，不是陣列本身。這是面試很常考的陷阱，一定要記住。',
      '如果你想保持原陣列不變，應該改用展開運算子：const newArr = [...arr, newItem]，這樣原本的 arr 不會被修改。',
      'push 可以一次傳入多個參數，例如 arr.push(1, 2, 3)，效果等同連續呼叫三次 push，但效能更好。',
      'push 的時間複雜度是 O(1)，因為只需要在末端新增元素，比起在開頭插入的 unshift 快很多。',
      '配合 pop 方法，push 和 pop 可以一起實作 Stack 堆疊資料結構，遵循後進先出的原則，這在面試中是很常見的考題。',
    ],
    problems: [
      {
        id: 'basic',
        title: '購物車新增商品',
        difficulty: 'easy',
        description: `你正在開發購物車功能。
請使用 \`push()\` 將以下兩個商品依序加入 \`cart\` 末端：
- \`{ id: 3, name: 'headphones', price: 299 }\`
- \`{ id: 4, name: 'keyboard', price: 129 }\`

並將 \`push()\` 最後一次呼叫的**回傳值**存到 \`newLength\`。`,
        examples: [
          { input: 'cart 初始有 2 個商品', output: 'cart.length === 4，newLength === 4' },
        ],
        initialCode: `const cart = [
  { id: 1, name: 'mouse', price: 49 },
  { id: 2, name: 'monitor', price: 399 },
]

// 在這裡用 push() 加入商品


let newLength // 將最後一次 push() 的回傳值存到這裡
`,
        testCases: [
          { label: 'cart 應有 4 個商品', test: `return cart.length === 4` },
          { label: 'cart[2].name 應為 "headphones"', test: `return cart[2] && cart[2].name === 'headphones'` },
          { label: 'cart[3].name 應為 "keyboard"', test: `return cart[3] && cart[3].name === 'keyboard'` },
          { label: 'newLength 應為 4', test: `return newLength === 4` },
        ],
      },
      {
        id: 'return-value',
        title: '回傳值是長度，不是陣列',
        difficulty: 'easy',
        description: `\`push()\` 的回傳值是**新的陣列長度**，不是陣列本身。
請將 \`push()\` 的回傳值存到 \`result\`，並驗證你了解它的型別與值。

完成後，\`result\` 應為數字 \`4\`，而非陣列。`,
        initialCode: `const arr = ['a', 'b', 'c']

// TODO: 呼叫 push('d')，將回傳值存到 result
let result
`,
        testCases: [
          { label: 'result 應為數字 4', test: `return result === 4` },
          { label: 'result 應是 number 型別', test: `return typeof result === 'number'` },
          { label: 'arr 應有 4 個元素', test: `return arr.length === 4` },
          { label: 'arr 末端應為 "d"', test: `return arr[arr.length - 1] === 'd'` },
        ],
      },
      {
        id: 'batch-push',
        title: '批次新增通知',
        difficulty: 'medium',
        description: `通知系統需要一次加入多條通知。
請**一次呼叫** \`push()\` 將三條通知依序加入 \`notifications\`：
\`'伺服器已重啟'\`、\`'備份完成'\`、\`'流量異常警報'\`

不可分三次呼叫，必須一次 \`push()\` 傳入多個參數。`,
        constraints: ['只能呼叫一次 push()', '必須一次傳入所有新通知'],
        initialCode: `const notifications = ['系統啟動']

// TODO: 一次呼叫 push()，同時加入三條通知
`,
        testCases: [
          { label: 'notifications 應有 4 個元素', test: `return notifications.length === 4` },
          { label: 'notifications[1] 應為 "伺服器已重啟"', test: `return notifications[1] === '伺服器已重啟'` },
          { label: 'notifications[2] 應為 "備份完成"', test: `return notifications[2] === '備份完成'` },
          { label: 'notifications[3] 應為 "流量異常警報"', test: `return notifications[3] === '流量異常警報'` },
        ],
      },
      {
        id: 'push-vs-spread',
        title: '合併陣列到現有陣列',
        difficulty: 'medium',
        description: `你有一個現有的標籤清單 \`tags\`，以及一批新標籤 \`newTags\`（陣列）。
請使用 \`push()\` 搭配展開運算符（spread），將 \`newTags\` 的所有元素加入 \`tags\`。

不可使用 \`concat\`，不可直接賦值。`,
        constraints: ['必須使用 push()', '必須使用展開運算符 ...'],
        examples: [
          { input: `tags = ['js'], newTags = ['ts', 'react']`, output: `tags = ['js', 'ts', 'react']` },
        ],
        initialCode: `const tags = ['javascript', 'css']
const newTags = ['typescript', 'react', 'nextjs']

// TODO: 用 push(...) 將 newTags 的元素全部加入 tags
`,
        testCases: [
          { label: 'tags 應有 5 個元素', test: `return tags.length === 5` },
          { label: 'tags 應包含 "typescript"', test: `return tags.includes('typescript')` },
          { label: 'tags 應包含 "nextjs"', test: `return tags.includes('nextjs')` },
          { label: 'newTags 原陣列不應被修改', test: `return newTags.length === 3` },
        ],
      },
      {
        id: 'stack-push',
        title: 'Stack 實作：瀏覽器上一頁',
        difficulty: 'hard',
        description: `使用陣列模擬瀏覽器的「上一頁」堆疊（back stack）。

請完成以下操作：
1. 使用者依序訪問 \`'/about'\`、\`'/products'\`、\`'/cart'\`，每次訪問都 \`push\` 到 \`backStack\`
2. 計算每次 \`push\` 後的長度，依序存到 \`lengths\` 陣列（共 3 個數字）
3. 注意：\`push\` 會修改原陣列，\`lengths\` 要記錄的是當下的長度值`,
        initialCode: `const backStack = ['/home']
const lengths = []

// TODO: 依序 push '/about', '/products', '/cart'
// 每次 push 後，將該次的回傳值（新長度）push 到 lengths
`,
        testCases: [
          { label: 'backStack 最終應有 4 個路徑', test: `return backStack.length === 4` },
          { label: 'backStack[3] 應為 "/cart"', test: `return backStack[3] === '/cart'` },
          { label: 'lengths 應為 [2, 3, 4]', test: `return JSON.stringify(lengths) === JSON.stringify([2,3,4])` },
          { label: 'lengths[0] 應為 2（push /about 後的長度）', test: `return lengths[0] === 2` },
        ],
      },
    ],
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
    problems: [
      {
        id: 'undo-stack',
        title: 'Undo 歷史記錄',
        difficulty: 'easy',
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
          { label: 'undone 應為 "save"', test: `return undone === 'save'` },
          { label: 'undone2 應為 "format"', test: `return undone2 === 'format'` },
          { label: 'history 剩下 2 個元素', test: `return history.length === 2` },
        ],
      },
      {
        id: 'empty-pop',
        title: '空陣列 pop 的回傳值',
        difficulty: 'easy',
        description: `當陣列為空時，\`pop()\` 不會拋出錯誤，而是回傳 \`undefined\`。

請對 \`emptyArr\` 呼叫 \`pop()\`，將結果存到 \`result\`，並驗證你了解它的行為。`,
        initialCode: `const emptyArr = []

// TODO: 對空陣列呼叫 pop()，將回傳值存到 result
let result
`,
        testCases: [
          { label: 'result 應為 undefined', test: `return result === undefined` },
          { label: 'emptyArr 長度仍為 0', test: `return emptyArr.length === 0` },
        ],
      },
      {
        id: 'stack-pop',
        title: 'Stack：最近瀏覽的頁面',
        difficulty: 'medium',
        description: `實作瀏覽器「上一頁」功能。
使用者目前的瀏覽堆疊存在 \`history\` 中（最後一個是當前頁面）。

請：
1. 取出當前頁面存到 \`currentPage\`（pop 掉）
2. 取出前一頁存到 \`previousPage\`（再 pop 一次）
3. 最後 \`history\` 應只剩最早的頁面`,
        examples: [
          { input: `history = ['/home', '/shop', '/cart']`, output: `currentPage='/cart', previousPage='/shop', history=['/home']` },
        ],
        initialCode: `const history = ['/home', '/shop', '/cart', '/checkout']

let currentPage   // 當前頁面（最後一個）
let previousPage  // 前一頁
`,
        testCases: [
          { label: 'currentPage 應為 "/checkout"', test: `return currentPage === '/checkout'` },
          { label: 'previousPage 應為 "/cart"', test: `return previousPage === '/cart'` },
          { label: 'history 剩下 2 個元素', test: `return history.length === 2` },
          { label: 'history[0] 仍為 "/home"', test: `return history[0] === '/home'` },
        ],
      },
      {
        id: 'drain-stack',
        title: '清空 Stack 並收集元素',
        difficulty: 'medium',
        description: `請使用迴圈搭配 \`pop()\` 將 \`stack\` 的所有元素依序取出，加入 \`popped\` 陣列。

完成後 \`stack\` 應為空，\`popped\` 應包含所有原始元素（**後進先出的順序**）。`,
        constraints: ['必須使用 pop()', '必須使用迴圈'],
        initialCode: `const stack = [1, 2, 3, 4, 5]
const popped = []

// TODO: 用迴圈 + pop() 清空 stack，將取出的元素 push 到 popped
`,
        testCases: [
          { label: 'stack 應為空', test: `return stack.length === 0` },
          { label: 'popped 應有 5 個元素', test: `return popped.length === 5` },
          { label: 'popped[0] 應為 5（最後進的先出）', test: `return popped[0] === 5` },
          { label: 'popped[4] 應為 1', test: `return popped[4] === 1` },
        ],
      },
      {
        id: 'pop-mutation-trap',
        title: '共用參考的陷阱',
        difficulty: 'hard',
        description: `以下程式碼有一個 bug：開發者以為 \`copy\` 是獨立的陣列，但實際上 \`pop\` 影響了原始資料。

請修正程式碼，使 \`original\` 在 \`pop\` 後仍保持完整的 4 個元素，同時 \`copy\` 正確地移除了最後一個元素。

關鍵：必須先建立真正的副本，再對副本 \`pop\`。`,
        examples: [
          { input: `original = [1,2,3,4]`, output: `original.length === 4，copy.length === 3` },
        ],
        initialCode: `const original = [1, 2, 3, 4]

// 這樣寫有 bug：copy 和 original 指向同一個陣列
// const copy = original  // ❌ 這不是複製！

// TODO: 建立 original 的真正副本（shallow copy），存到 copy
// 然後對 copy 執行 pop()
let copy
let poppedValue
`,
        testCases: [
          { label: 'original 仍應有 4 個元素', test: `return original.length === 4` },
          { label: 'copy 應有 3 個元素', test: `return copy && copy.length === 3` },
          { label: 'poppedValue 應為 4', test: `return poppedValue === 4` },
          { label: 'original 最後元素仍為 4', test: `return original[3] === 4` },
        ],
      },
    ],
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
    problems: [
      {
        id: 'queue-basic',
        title: '任務佇列處理',
        difficulty: 'easy',
        description: `一個任務佇列（queue）先進先出。
請使用 \`shift()\` 依序取出並處理前兩個任務：
1. 取出第一個任務，存到 \`task1\`
2. 取出下一個任務（原本的第二個），存到 \`task2\``,
        initialCode: `const queue = ['task-A', 'task-B', 'task-C', 'task-D']

let task1
let task2
`,
        testCases: [
          { label: 'task1 應為 "task-A"', test: `return task1 === 'task-A'` },
          { label: 'task2 應為 "task-B"', test: `return task2 === 'task-B'` },
          { label: 'queue 剩下 2 個任務', test: `return queue.length === 2` },
          { label: 'queue[0] 應為 "task-C"', test: `return queue[0] === 'task-C'` },
        ],
      },
      {
        id: 'shift-return',
        title: '理解 shift 的回傳值',
        difficulty: 'easy',
        description: `\`shift()\` 回傳被移除的元素，空陣列回傳 \`undefined\`。

請對 \`numbers\` 呼叫 \`shift()\` 兩次：
1. 第一次結果存到 \`first\`
2. 第二次結果存到 \`second\`
3. 對空陣列 \`empty\` 呼叫 \`shift()\`，結果存到 \`fromEmpty\``,
        initialCode: `const numbers = [10, 20, 30]
let first
let second

const empty = []
let fromEmpty
`,
        testCases: [
          { label: 'first 應為 10', test: `return first === 10` },
          { label: 'second 應為 20', test: `return second === 20` },
          { label: 'fromEmpty 應為 undefined', test: `return fromEmpty === undefined` },
          { label: 'numbers 剩下 1 個元素', test: `return numbers.length === 1` },
        ],
      },
      {
        id: 'message-queue',
        title: '訊息佇列消費',
        difficulty: 'medium',
        description: `實作一個訊息消費函式。
使用迴圈搭配 \`shift()\`，從 \`messageQueue\` 中逐一取出訊息，
將每條訊息的 \`content\` 加入 \`processed\` 陣列。

直到佇列為空為止。`,
        constraints: ['必須使用 shift()', '必須使用迴圈'],
        initialCode: `const messageQueue = [
  { id: 1, content: 'Hello' },
  { id: 2, content: 'World' },
  { id: 3, content: 'TypeScript' },
]
const processed = []

// TODO: 用迴圈 + shift() 處理佇列，將每條訊息的 content push 到 processed
`,
        testCases: [
          { label: 'messageQueue 應為空', test: `return messageQueue.length === 0` },
          { label: 'processed 應有 3 個元素', test: `return processed.length === 3` },
          { label: 'processed[0] 應為 "Hello"', test: `return processed[0] === 'Hello'` },
          { label: 'processed[2] 應為 "TypeScript"', test: `return processed[2] === 'TypeScript'` },
        ],
      },
      {
        id: 'queue-with-push',
        title: 'Queue 實作：客服排隊系統',
        difficulty: 'medium',
        description: `實作一個簡單的客服排隊系統（Queue）。

請依序執行：
1. 將 \`'王小明'\`、\`'李大華'\` 加入 \`waitingQueue\` 末端
2. 處理（取出）最前面的客戶，存到 \`servedCustomer\`
3. 將 \`'張三'\` 加入末端
4. 最後 \`waitingQueue\` 應有 2 位客戶等待`,
        initialCode: `const waitingQueue = ['陳美麗']

// Step 1: 加入王小明和李大華
// Step 2: 取出最前面的客戶，存到 servedCustomer
let servedCustomer
// Step 3: 加入張三
`,
        testCases: [
          { label: 'servedCustomer 應為 "陳美麗"', test: `return servedCustomer === '陳美麗'` },
          { label: 'waitingQueue 應有 2 位客戶', test: `return waitingQueue.length === 2` },
          { label: 'waitingQueue[0] 應為 "王小明"', test: `return waitingQueue[0] === '王小明'` },
          { label: 'waitingQueue[1] 應為 "張三"', test: `return waitingQueue[1] === '張三'` },
        ],
      },
      {
        id: 'shift-performance-trap',
        title: '效能陷阱：shift vs pop',
        difficulty: 'hard',
        description: `\`shift()\` 的時間複雜度是 **O(n)**，因為移除第一個元素後，所有剩餘元素的索引都需要更新。

以下場景中，你需要從一個大型日誌佇列取出最後 N 筆（最新的），而不是最舊的。
請用 \`pop()\` 而非 \`shift()\` 來取出最後 3 筆日誌，存到 \`recentLogs\`，並讓 \`recentLogs[0]\` 是最新的一筆。`,
        examples: [
          { input: `logs = ['log1','log2','log3','log4','log5']`, output: `recentLogs = ['log5','log4','log3']` },
        ],
        initialCode: `const logs = ['log1', 'log2', 'log3', 'log4', 'log5']
const recentLogs = []

// TODO: 用 pop() 取出最後 3 筆，加入 recentLogs
// recentLogs[0] 應為最新的 'log5'
`,
        testCases: [
          { label: 'recentLogs[0] 應為 "log5"（最新）', test: `return recentLogs[0] === 'log5'` },
          { label: 'recentLogs[1] 應為 "log4"', test: `return recentLogs[1] === 'log4'` },
          { label: 'recentLogs[2] 應為 "log3"', test: `return recentLogs[2] === 'log3'` },
          { label: 'recentLogs 應有 3 個元素', test: `return recentLogs.length === 3` },
        ],
      },
    ],
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
    problems: [
      {
        id: 'priority-notification',
        title: '通知優先佇列',
        difficulty: 'easy',
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
          { label: 'notifications[0].type 應為 "error"', test: `return notifications[0] && notifications[0].type === 'error'` },
          { label: 'notifications[1].type 應為 "warning"', test: `return notifications[1] && notifications[1].type === 'warning'` },
          { label: 'notifications 應有 4 個元素', test: `return notifications.length === 4` },
        ],
      },
      {
        id: 'unshift-return',
        title: 'unshift 的回傳值',
        difficulty: 'easy',
        description: `\`unshift()\` 和 \`push()\` 一樣，回傳的是**新的陣列長度**，不是陣列本身。

請呼叫 \`unshift('z')\`，將回傳值存到 \`newLen\`。`,
        initialCode: `const letters = ['a', 'b', 'c']

// TODO: 在開頭插入 'z'，將 unshift 的回傳值存到 newLen
let newLen
`,
        testCases: [
          { label: 'newLen 應為 4', test: `return newLen === 4` },
          { label: 'letters[0] 應為 "z"', test: `return letters[0] === 'z'` },
          { label: 'letters 應有 4 個元素', test: `return letters.length === 4` },
        ],
      },
      {
        id: 'prepend-items',
        title: '活動日程插入緊急事項',
        difficulty: 'medium',
        description: `你有一個今天的行程清單 \`agenda\`。臨時新增了兩件緊急事項需要排在最前面。

請**依序**將以下兩筆資料插入 \`agenda\` 開頭：
1. \`{ time: '08:00', task: '緊急會議' }\`
2. \`{ time: '08:30', task: '主管報告' }\`

一次呼叫 \`unshift\` 完成，最終 \`08:00\` 排在 \`08:30\` 之前。`,
        initialCode: `const agenda = [
  { time: '09:00', task: '客戶簡報' },
  { time: '11:00', task: '午餐' },
]

// TODO: 一次呼叫 unshift，插入兩件緊急事項
`,
        testCases: [
          { label: 'agenda[0].time 應為 "08:00"', test: `return agenda[0] && agenda[0].time === '08:00'` },
          { label: 'agenda[1].task 應為 "主管報告"', test: `return agenda[1] && agenda[1].task === '主管報告'` },
          { label: 'agenda 應有 4 個元素', test: `return agenda.length === 4` },
          { label: 'agenda[2].time 應仍為 "09:00"', test: `return agenda[2] && agenda[2].time === '09:00'` },
        ],
      },
      {
        id: 'multi-unshift-order',
        title: '多次 unshift 的順序差異',
        difficulty: 'medium',
        description: `多次呼叫 \`unshift\` 和一次呼叫傳多個參數，結果**不同**！

請驗證：
- \`arr1\`：一次呼叫 \`unshift(1, 2, 3)\`，結果為 \`[1, 2, 3, 0]\`
- \`arr2\`：分三次呼叫 \`unshift(1)\`、\`unshift(2)\`、\`unshift(3)\`，結果為 \`[3, 2, 1, 0]\`

分別完成兩種操作。`,
        examples: [
          { input: '一次 unshift(1,2,3)', output: '[1,2,3,0]', note: '參數順序保留' },
          { input: '三次分別 unshift', output: '[3,2,1,0]', note: '每次插到最前面，所以反序' },
        ],
        initialCode: `const arr1 = [0]
// TODO: 一次呼叫 unshift(1, 2, 3)
arr1.unshift(/* TODO */)

const arr2 = [0]
// TODO: 分三次呼叫 unshift，依序插入 1, 2, 3
`,
        testCases: [
          { label: 'arr1 應為 [1,2,3,0]', test: `return JSON.stringify(arr1) === JSON.stringify([1,2,3,0])` },
          { label: 'arr2 應為 [3,2,1,0]', test: `return JSON.stringify(arr2) === JSON.stringify([3,2,1,0])` },
        ],
      },
      {
        id: 'deque-unshift',
        title: 'Deque 雙端操作',
        difficulty: 'hard',
        description: `實作一個雙端佇列（Deque）的操作序列。

請依序執行以下操作，並記錄每步後 \`deque\` 的第一個元素：
1. \`unshift('front1')\` → 記錄 deque[0] 到 \`snapshots[0]\`
2. \`push('back1')\` → 記錄 deque[0] 到 \`snapshots[1]\`
3. \`unshift('front2')\` → 記錄 deque[0] 到 \`snapshots[2]\`
4. \`shift()\` → 記錄 deque[0] 到 \`snapshots[3]\`

初始 \`deque = ['mid']\``,
        initialCode: `const deque = ['mid']
const snapshots = []

// TODO: 依序執行 4 個操作，每次操作後記錄 deque[0]
`,
        testCases: [
          { label: 'snapshots[0] 應為 "front1"', test: `return snapshots[0] === 'front1'` },
          { label: 'snapshots[1] 應為 "front1"（push 不影響開頭）', test: `return snapshots[1] === 'front1'` },
          { label: 'snapshots[2] 應為 "front2"', test: `return snapshots[2] === 'front2'` },
          { label: 'snapshots[3] 應為 "front1"（shift 移除了 front2）', test: `return snapshots[3] === 'front1'` },
        ],
      },
    ],
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
    problems: [
      {
        id: 'todo-manage',
        title: '待辦清單管理',
        difficulty: 'easy',
        description: `一個待辦清單需要進行以下操作：
1. 刪除 index 1 的項目（\`'Buy groceries'\`），存到 \`removed\`
2. 在現在的 index 1 位置插入兩個新項目：\`'Team meeting'\` 和 \`'Code review'\`（不刪除現有項目）`,
        initialCode: `const todos = ['Email boss', 'Buy groceries', 'Fix bug', 'Write tests']

// Step 1: 刪除 index 1 的項目，存到 removed
let removed

// Step 2: 在 index 1 插入 'Team meeting' 和 'Code review'（不刪除現有項目）
`,
        testCases: [
          { label: 'removed 應為 ["Buy groceries"]', test: `return Array.isArray(removed) && removed[0] === 'Buy groceries' && removed.length === 1` },
          { label: 'todos[1] 應為 "Team meeting"', test: `return todos[1] === 'Team meeting'` },
          { label: 'todos[2] 應為 "Code review"', test: `return todos[2] === 'Code review'` },
          { label: 'todos 最終應有 5 個項目', test: `return todos.length === 5` },
        ],
      },
      {
        id: 'splice-replace',
        title: '替換商品規格',
        difficulty: 'easy',
        description: `一個規格清單需要替換中間的項目。
請用 \`splice\` 將 index 2 的 \`'XL'\` 替換成 \`'XXL'\`，並將被替換掉的元素存到 \`replaced\`。`,
        examples: [
          { input: `sizes = ['S','M','XL','2XL']`, output: `sizes = ['S','M','XXL','2XL']，replaced = ['XL']` },
        ],
        initialCode: `const sizes = ['S', 'M', 'XL', '2XL']

// TODO: 用 splice 替換 index 2 的 'XL' 為 'XXL'
let replaced  // 被移除的元素陣列
`,
        testCases: [
          { label: 'sizes[2] 應為 "XXL"', test: `return sizes[2] === 'XXL'` },
          { label: 'replaced[0] 應為 "XL"', test: `return replaced && replaced[0] === 'XL'` },
          { label: 'sizes 長度不變，仍為 4', test: `return sizes.length === 4` },
        ],
      },
      {
        id: 'splice-insert-mid',
        title: '在指定位置插入章節',
        difficulty: 'medium',
        description: `書本的章節清單需要在特定位置插入新章節（不刪除現有章節）。

請在 index 2 的位置插入 \`'Chapter 2.5: Review'\`，不刪除任何現有章節。

插入後：
- index 0~1：原本的 Chapter 1, 2
- index 2：新的 Chapter 2.5
- index 3 之後：原本的 Chapter 3, 4, 5`,
        initialCode: `const chapters = [
  'Chapter 1: Intro',
  'Chapter 2: Basics',
  'Chapter 3: Advanced',
  'Chapter 4: Patterns',
  'Chapter 5: Summary',
]

// TODO: 在 index 2 插入 'Chapter 2.5: Review'，不刪除任何章節
`,
        testCases: [
          { label: 'chapters[2] 應為新插入的章節', test: `return chapters[2] === 'Chapter 2.5: Review'` },
          { label: 'chapters[3] 應為 "Chapter 3: Advanced"', test: `return chapters[3] === 'Chapter 3: Advanced'` },
          { label: 'chapters 應有 6 個元素', test: `return chapters.length === 6` },
          { label: 'chapters[0] 不變', test: `return chapters[0] === 'Chapter 1: Intro'` },
        ],
      },
      {
        id: 'splice-negative',
        title: '從末端刪除：負數 start',
        difficulty: 'medium',
        description: `\`splice\` 支援負數 start，\`-1\` 代表最後一個元素。

請：
1. 刪除 \`arr\` 的最後一個元素，存到 \`lastRemoved\`
2. 刪除 \`arr2\` 的最後兩個元素，存到 \`lastTwo\`

兩者都使用負數 index。`,
        initialCode: `const arr = [10, 20, 30, 40, 50]
let lastRemoved  // 刪除最後一個，存移除的陣列

const arr2 = ['a', 'b', 'c', 'd']
let lastTwo  // 刪除最後兩個，存移除的陣列
`,
        testCases: [
          { label: 'lastRemoved 應為 [50]', test: `return Array.isArray(lastRemoved) && lastRemoved[0] === 50` },
          { label: 'arr 應剩 4 個元素', test: `return arr.length === 4` },
          { label: 'lastTwo 應為 ["c","d"]', test: `return Array.isArray(lastTwo) && lastTwo[0] === 'c' && lastTwo[1] === 'd'` },
          { label: 'arr2 應剩 2 個元素', test: `return arr2.length === 2` },
        ],
      },
      {
        id: 'splice-vs-slice-trap',
        title: 'splice vs slice 的陷阱',
        difficulty: 'hard',
        description: `\`splice\` 和 \`slice\` 名字相似，但行為完全不同：
- \`splice\` **修改**原陣列，回傳**被刪除**的元素
- \`slice\` **不修改**原陣列，回傳**截取**的新陣列

以下有兩個需求：
1. 使用 \`splice\` 從 \`data\` 中刪除 index 1~2（共 2 個），存結果到 \`spliceResult\`
2. 使用 \`slice\` 從 \`data2\` 中截取 index 1~2（不含 3），存到 \`sliceResult\`，\`data2\` 不能被修改

完成後，\`data\` 只剩 3 個元素，\`data2\` 仍有 5 個。`,
        initialCode: `const data = ['a', 'b', 'c', 'd', 'e']
let spliceResult  // splice 回傳被刪除的元素

const data2 = ['a', 'b', 'c', 'd', 'e']
let sliceResult  // slice 截取的新陣列，data2 不變
`,
        testCases: [
          { label: 'spliceResult 應為 ["b","c"]', test: `return Array.isArray(spliceResult) && spliceResult[0]==='b' && spliceResult[1]==='c'` },
          { label: 'data 應剩 3 個元素', test: `return data.length === 3` },
          { label: 'sliceResult 應為 ["b","c"]', test: `return Array.isArray(sliceResult) && sliceResult[0]==='b' && sliceResult[1]==='c'` },
          { label: 'data2 仍有 5 個元素（slice 不修改原陣列）', test: `return data2.length === 5` },
        ],
      },
    ],
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
    problems: [
      {
        id: 'price-sort',
        title: '商品價格排序',
        difficulty: 'easy',
        description: `請對陣列進行以下操作：
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
          { label: 'prices[0] 應為 29（最小值）', test: `return prices[0] === 29` },
          { label: 'prices 升冪排序正確', test: `return JSON.stringify(prices) === JSON.stringify([29,49,149,199,999])` },
          { label: 'products[0].name 應為 "Monitor"（最貴）', test: `return products[0] && products[0].name === 'Monitor'` },
          { label: 'products 降冪排序正確', test: `return products.map(p => p.price).join(',') === '399,149,79,29'` },
        ],
      },
      {
        id: 'string-sort',
        title: '字串排序與不區分大小寫',
        difficulty: 'easy',
        description: `請完成兩種字串排序：
1. 將 \`fruits\` 按字母升冪排序（預設行為即可）
2. 將 \`names\` 不區分大小寫地排序，存到 \`sortedNames\`（先複製，不修改原陣列）`,
        initialCode: `const fruits = ['banana', 'apple', 'cherry', 'date']
// Step 1: 直接排序 fruits（字母升冪）


const names = ['Charlie', 'alice', 'Bob', 'dave']
// Step 2: 不區分大小寫排序，存到 sortedNames（不能修改 names）
let sortedNames
`,
        testCases: [
          { label: 'fruits[0] 應為 "apple"', test: `return fruits[0] === 'apple'` },
          { label: 'fruits[3] 應為 "date"', test: `return fruits[3] === 'date'` },
          { label: 'sortedNames[0] 應為 "alice"（不區分大小寫）', test: `return sortedNames && sortedNames[0] === 'alice'` },
          { label: 'names 原陣列不被修改（第一個仍為 "Charlie"）', test: `return names[0] === 'Charlie'` },
        ],
      },
      {
        id: 'sort-immutable',
        title: '不破壞原陣列的排序',
        difficulty: 'medium',
        description: `\`sort()\` 會修改原陣列。若需要保持原陣列不變，必須先複製。

請：
1. 將 \`scores\` **複製一份**後再升冪排序，存到 \`sorted\`
2. 確認 \`scores\` 原陣列未被修改

不可修改 \`scores\`。`,
        constraints: ['不能修改 scores 原陣列'],
        initialCode: `const scores = [85, 42, 96, 71, 58]

// TODO: 複製 scores 並排序，存到 sorted
let sorted
`,
        testCases: [
          { label: 'sorted 應為升冪 [42,58,71,85,96]', test: `return JSON.stringify(sorted) === JSON.stringify([42,58,71,85,96])` },
          { label: 'scores 原陣列第一個仍為 85', test: `return scores[0] === 85` },
          { label: 'scores 原陣列未被修改', test: `return JSON.stringify(scores) === JSON.stringify([85,42,96,71,58])` },
        ],
      },
      {
        id: 'sort-by-field',
        title: '多欄位排序：先依部門再依姓名',
        difficulty: 'medium',
        description: `請將 \`employees\` 先依 \`department\` 字母升冪排序，相同部門內再依 \`name\` 字母升冪排序。`,
        examples: [
          { input: '各部門員工', output: 'Engineering 的在前，同部門內按名字排' },
        ],
        initialCode: `const employees = [
  { name: 'Zoe',   department: 'Marketing' },
  { name: 'Alice', department: 'Engineering' },
  { name: 'Mike',  department: 'Marketing' },
  { name: 'Bob',   department: 'Engineering' },
]

// TODO: 先依 department 升冪，再依 name 升冪
`,
        testCases: [
          { label: 'employees[0].name 應為 "Alice"', test: `return employees[0] && employees[0].name === 'Alice'` },
          { label: 'employees[1].name 應為 "Bob"', test: `return employees[1] && employees[1].name === 'Bob'` },
          { label: 'employees[2].department 應為 "Marketing"', test: `return employees[2] && employees[2].department === 'Marketing'` },
          { label: 'employees[3].name 應為 "Zoe"', test: `return employees[3] && employees[3].name === 'Zoe'` },
        ],
      },
      {
        id: 'sort-number-trap',
        title: '數字排序陷阱：預設 sort 的 bug',
        difficulty: 'hard',
        description: `這是最常見的面試陷阱題！

以下程式碼使用預設的 \`sort()\` 對數字排序，結果是**錯的**（因為預設按字串比較）：

\`\`\`js
[10, 9, 2, 21, 100].sort()  // [10, 100, 2, 21, 9] ← 錯！
\`\`\`

請：
1. \`buggy\` 使用預設 sort()（呈現錯誤結果）
2. \`correct\` 使用正確的數字升冪排序`,
        initialCode: `// buggy: 使用預設 sort()（結果會是錯的字串排序）
const buggy = [10, 9, 2, 21, 100].sort()

// correct: 使用正確的數字升冪排序
const correct = [10, 9, 2, 21, 100].sort(/* TODO: 填入 compareFn */)
`,
        testCases: [
          { label: 'buggy[0] 應為 10（字串排序 "10" 排在最前）', test: `return buggy[0] === 10` },
          { label: 'buggy 排序結果不是數字升冪（驗證 bug 存在）', test: `return JSON.stringify(buggy) !== JSON.stringify([2,9,10,21,100])` },
          { label: 'correct[0] 應為 2（最小值）', test: `return correct[0] === 2` },
          { label: 'correct 應為正確的數字升冪', test: `return JSON.stringify(correct) === JSON.stringify([2,9,10,21,100])` },
        ],
      },
    ],
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
    problems: [
      {
        id: 'breadcrumb-reverse',
        title: '麵包屑導航反轉',
        difficulty: 'easy',
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
          { label: 'reversed 應為反轉後的陣列', test: `return JSON.stringify(reversed) === JSON.stringify(['Phones','Electronics','Products','Home'])` },
          { label: 'path 原陣列不能被修改', test: `return path[0] === 'Home'` },
          { label: 'steps 應被就地反轉', test: `return JSON.stringify(steps) === JSON.stringify([5,4,3,2,1])` },
        ],
      },
      {
        id: 'reverse-return',
        title: 'reverse 回傳值是同一個陣列',
        difficulty: 'easy',
        description: `\`reverse()\` 回傳的是**同一個陣列的參考**，不是新陣列。

請驗證：
1. 對 \`arr\` 呼叫 \`reverse()\`，將回傳值存到 \`result\`
2. 用 \`===\` 比較 \`result\` 和 \`arr\` 是否為同一個物件，存到 \`isSame\``,
        initialCode: `const arr = [1, 2, 3]

// TODO: 呼叫 reverse()，將回傳值存到 result
let result

// TODO: 比較 result === arr，存到 isSame
let isSame
`,
        testCases: [
          { label: 'isSame 應為 true（同一個物件）', test: `return isSame === true` },
          { label: 'arr 已被反轉', test: `return JSON.stringify(arr) === JSON.stringify([3,2,1])` },
          { label: 'result 和 arr 內容相同', test: `return JSON.stringify(result) === JSON.stringify([3,2,1])` },
        ],
      },
      {
        id: 'reverse-string',
        title: '字串反轉',
        difficulty: 'medium',
        description: `JavaScript 字串沒有 \`reverse()\` 方法，但可以將字串轉成陣列後反轉再接回來。

請完成 \`reverseString\` 函式，回傳反轉後的字串。
步驟：split → reverse → join`,
        initialCode: `function reverseString(str) {
  // TODO: 將 str 轉成字元陣列，反轉，再 join 回字串
}

const result1 = reverseString('hello')
const result2 = reverseString('TypeScript')
`,
        testCases: [
          { label: 'reverseString("hello") 應為 "olleh"', test: `return result1 === 'olleh'` },
          { label: 'reverseString("TypeScript") 應為 "tpircSepyT"', test: `return result2 === 'tpircSepyT'` },
        ],
      },
      {
        id: 'reverse-then-find',
        title: '找陣列中最後一個符合條件的元素',
        difficulty: 'medium',
        description: `你想找陣列中**最後一個**符合條件的元素，一種方式是先反轉再用 \`find()\`。

請從 \`scores\` 中找出**最後一個**大於 70 的分數，存到 \`lastGood\`。

請用 \`[...scores].reverse().find()\` 的方式，不修改原陣列。`,
        constraints: ['使用 [...scores].reverse().find() 的組合'],
        initialCode: `const scores = [55, 80, 45, 90, 65, 75]

// TODO: 找出最後一個 > 70 的分數，存到 lastGood
let lastGood
`,
        testCases: [
          { label: 'lastGood 應為 75（最後一個 > 70 的）', test: `return lastGood === 75` },
          { label: 'scores 原陣列不應被修改', test: `return scores[0] === 55` },
        ],
      },
      {
        id: 'reverse-mutation-trap',
        title: '連鎖操作的 reverse 陷阱',
        difficulty: 'hard',
        description: `以下程式碼有一個隱藏的 bug：

\`\`\`js
const original = [1, 2, 3, 4, 5]
const sorted = original.sort((a, b) => a - b)
const reversed = sorted.reverse()
// original、sorted、reversed 都指向同一個陣列！
\`\`\`

請修正程式碼：
- \`originalData\` 保持 \`[5, 3, 1, 4, 2]\` 不變
- \`ascending\` 為升冪排序的新陣列 \`[1, 2, 3, 4, 5]\`
- \`descending\` 為降冪排序的新陣列 \`[5, 4, 3, 2, 1]\`

三個陣列必須互相獨立。`,
        initialCode: `const originalData = [5, 3, 1, 4, 2]

// TODO: 建立升冪陣列 ascending（不修改 originalData）
let ascending

// TODO: 建立降冪陣列 descending（不修改 originalData 和 ascending）
let descending
`,
        testCases: [
          { label: 'originalData 不變，仍為 [5,3,1,4,2]', test: `return JSON.stringify(originalData) === JSON.stringify([5,3,1,4,2])` },
          { label: 'ascending 應為 [1,2,3,4,5]', test: `return JSON.stringify(ascending) === JSON.stringify([1,2,3,4,5])` },
          { label: 'descending 應為 [5,4,3,2,1]', test: `return JSON.stringify(descending) === JSON.stringify([5,4,3,2,1])` },
          { label: '三個陣列互相獨立', test: `return ascending !== originalData && descending !== originalData && ascending !== descending` },
        ],
      },
    ],
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
    problems: [
      {
        id: 'init-board',
        title: '初始化遊戲棋盤',
        difficulty: 'easy',
        description: `請完成以下任務：
1. 建立一個長度為 5 的陣列 \`board\`，所有格子初始值為 \`0\`（使用 \`new Array\` + \`fill\`）
2. 將 \`matrix\` 中 index 2 到 4（不含）的格子設為 \`1\``,
        initialCode: `// Step 1: 建立長度 5 全為 0 的陣列
let board

// Step 2: 將 matrix index 2 到 3 設為 1
const matrix = [0, 0, 0, 0, 0, 0]
`,
        testCases: [
          { label: 'board 應有 5 個元素，全為 0', test: `return Array.isArray(board) && board.length === 5 && board.every(x => x === 0)` },
          { label: 'matrix[2] 和 matrix[3] 應為 1', test: `return matrix[2] === 1 && matrix[3] === 1` },
          { label: 'matrix[0], matrix[1], matrix[4], matrix[5] 仍應為 0', test: `return matrix[0] === 0 && matrix[1] === 0 && matrix[4] === 0 && matrix[5] === 0` },
        ],
      },
      {
        id: 'fill-reset',
        title: '重設陣列區間',
        difficulty: 'easy',
        description: `請使用 \`fill()\` 將 \`data\` 中 index 1 到 3（含 3）的元素全部設為 \`-1\`，其餘不動。

注意 \`end\` 參數是不含的，所以填充到 index 3 需要傳 \`end = 4\`。`,
        examples: [
          { input: `data = [10, 20, 30, 40, 50]`, output: `data = [10, -1, -1, -1, 50]` },
        ],
        initialCode: `const data = [10, 20, 30, 40, 50]

// TODO: 將 index 1~3 設為 -1（fill 的 end 是不含的）
`,
        testCases: [
          { label: 'data[0] 應仍為 10', test: `return data[0] === 10` },
          { label: 'data[1] 應為 -1', test: `return data[1] === -1` },
          { label: 'data[3] 應為 -1', test: `return data[3] === -1` },
          { label: 'data[4] 應仍為 50', test: `return data[4] === 50` },
        ],
      },
      {
        id: 'fill-init-array',
        title: '快速建立初始化陣列',
        difficulty: 'medium',
        description: `使用 \`new Array(n).fill(value)\` 可以快速建立固定長度的初始化陣列。

請：
1. 建立 \`zeros\`：長度 10，全為 \`0\`
2. 建立 \`flags\`：長度 5，全為 \`false\`
3. 建立 \`slots\`：長度 3，全為 \`null\``,
        initialCode: `// TODO: 用 new Array + fill 建立以下陣列
let zeros  // 長度 10，全為 0
let flags  // 長度 5，全為 false
let slots  // 長度 3，全為 null
`,
        testCases: [
          { label: 'zeros 應有 10 個 0', test: `return Array.isArray(zeros) && zeros.length === 10 && zeros.every(x => x === 0)` },
          { label: 'flags 應有 5 個 false', test: `return Array.isArray(flags) && flags.length === 5 && flags.every(x => x === false)` },
          { label: 'slots 應有 3 個 null', test: `return Array.isArray(slots) && slots.length === 3 && slots.every(x => x === null)` },
        ],
      },
      {
        id: 'fill-progress',
        title: '進度條資料初始化',
        difficulty: 'medium',
        description: `實作一個進度條資料結構。
建立長度為 10 的 \`progressBar\`，初始全為 \`'░'\`（空白格）。
然後根據 \`progress\`（值為 6），將前 \`progress\` 個格子填為 \`'█'\`（填滿格）。`,
        examples: [
          { input: 'progress = 6', output: `progressBar = ['█','█','█','█','█','█','░','░','░','░']` },
        ],
        initialCode: `const progress = 6

// TODO: 建立長度 10 的 progressBar，先全填 '░'，再將前 progress 個填為 '█'
let progressBar
`,
        testCases: [
          { label: 'progressBar 應有 10 個元素', test: `return Array.isArray(progressBar) && progressBar.length === 10` },
          { label: '前 6 個應為 "█"', test: `return progressBar.slice(0, 6).every(x => x === '█')` },
          { label: '後 4 個應為 "░"', test: `return progressBar.slice(6).every(x => x === '░')` },
        ],
      },
      {
        id: 'fill-object-trap',
        title: 'fill 物件參考陷阱',
        difficulty: 'hard',
        description: `\`fill()\` 填入物件時，所有格子共用**同一個物件參考**！修改其中一個會影響全部。

\`\`\`js
const players = new Array(3).fill({ score: 0 })
players[0].score = 100
// players[1].score 和 players[2].score 也變成 100！
\`\`\`

請修正程式碼，建立 \`players\` 陣列（3 個玩家，每人初始 \`{ score: 0, name: '' }\`），
使每個物件都是**獨立的**。修改 \`players[0].score = 100\` 後，其他玩家不受影響。

請用 \`Array.from({ length: 3 }, () => (...))\` 的方式。`,
        initialCode: `// ❌ 這樣有 bug（不要用這行）
// const players = new Array(3).fill({ score: 0, name: '' })

// TODO: 用 Array.from 建立 3 個獨立的玩家物件
let players

// 設定第一個玩家分數
if (players) players[0].score = 100
`,
        testCases: [
          { label: 'players 應有 3 個元素', test: `return Array.isArray(players) && players.length === 3` },
          { label: 'players[0].score 應為 100', test: `return players && players[0].score === 100` },
          { label: 'players[1].score 仍為 0（獨立物件）', test: `return players && players[1].score === 0` },
          { label: 'players[2].score 仍為 0（獨立物件）', test: `return players && players[2].score === 0` },
        ],
      },
    ],
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
    problems: [
      {
        id: 'tag-system',
        title: '標籤系統查詢',
        difficulty: 'easy',
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
          { label: 'tsIndex 應為 1', test: `return tsIndex === 1` },
          { label: 'hasVue 應為 false', test: `return hasVue === false` },
          { label: 'secondIdx 應為 3', test: `return secondIdx === 3` },
        ],
      },
      {
        id: 'indexof-not-found',
        title: '找不到時回傳 -1',
        difficulty: 'easy',
        description: `\`indexOf\` 找不到元素時回傳 \`-1\`，不是 \`false\` 或 \`null\`。

請：
1. 在 \`fruits\` 中找 \`'grape'\`，存到 \`grapeIdx\`
2. 在 \`fruits\` 中找 \`'mango'\`，存到 \`mangoIdx\`
3. 用 \`mangoIdx\` 判斷 mango 是否存在（\`mangoIdx !== -1\`），存到 \`hasMango\``,
        initialCode: `const fruits = ['apple', 'banana', 'grape', 'orange']

let grapeIdx   // 'grape' 的 index
let mangoIdx   // 'mango' 的 index（不存在）
let hasMango   // 根據 mangoIdx 判斷是否存在
`,
        testCases: [
          { label: 'grapeIdx 應為 2', test: `return grapeIdx === 2` },
          { label: 'mangoIdx 應為 -1', test: `return mangoIdx === -1` },
          { label: 'hasMango 應為 false', test: `return hasMango === false` },
        ],
      },
      {
        id: 'indexof-remove-item',
        title: '找到後刪除元素',
        difficulty: 'medium',
        description: `一個常見的操作：用 \`indexOf\` 找到位置，再用 \`splice\` 刪除。

請從 \`permissions\` 中移除 \`'write'\` 權限：
1. 先用 \`indexOf\` 找到 \`'write'\` 的位置，存到 \`writeIdx\`
2. 如果找到（不為 -1），用 \`splice\` 將其刪除`,
        initialCode: `const permissions = ['read', 'write', 'execute', 'admin']

let writeIdx  // 'write' 的 index

// 如果找到，用 splice 刪除
`,
        testCases: [
          { label: 'writeIdx 應為 1', test: `return writeIdx === 1` },
          { label: 'permissions 不再包含 "write"', test: `return permissions.indexOf('write') === -1` },
          { label: 'permissions 應剩 3 個元素', test: `return permissions.length === 3` },
          { label: 'permissions[0] 仍為 "read"', test: `return permissions[0] === 'read'` },
        ],
      },
      {
        id: 'indexof-dedupe',
        title: '去除重複元素',
        difficulty: 'medium',
        description: `使用 \`indexOf\` 來去除陣列中的重複元素。

遍歷 \`rawTags\`，如果某個標籤在 \`uniqueTags\` 中尚未出現（indexOf 回傳 -1），就加入。`,
        initialCode: `const rawTags = ['js', 'css', 'js', 'html', 'css', 'ts']
const uniqueTags = []

// TODO: 遍歷 rawTags，用 indexOf 去重後加入 uniqueTags
`,
        testCases: [
          { label: 'uniqueTags 應有 4 個元素', test: `return uniqueTags.length === 4` },
          { label: 'uniqueTags 包含 "js"', test: `return uniqueTags.indexOf('js') !== -1` },
          { label: 'uniqueTags 包含 "ts"', test: `return uniqueTags.indexOf('ts') !== -1` },
          { label: 'uniqueTags 中 "css" 只出現一次', test: `return uniqueTags.filter(x => x === 'css').length === 1` },
        ],
      },
      {
        id: 'indexof-nan-trap',
        title: 'indexOf 無法搜尋 NaN',
        difficulty: 'hard',
        description: `\`indexOf\` 使用嚴格相等（===）比較，而 \`NaN !== NaN\`，所以 \`indexOf(NaN)\` 永遠回傳 **-1**！

請：
1. 用 \`indexOf(NaN)\` 搜尋，存到 \`indexofResult\`（會是 -1）
2. 用 \`findIndex(x => Number.isNaN(x))\` 搜尋，存到 \`findIndexResult\`（正確結果）
3. 用 \`includes(NaN)\` 搜尋，存到 \`includesResult\`（正確 boolean）`,
        initialCode: `const data = [1, 2, NaN, 4, 5]

let indexofResult   // indexOf(NaN) 的結果
let findIndexResult // findIndex 正確找到 NaN 的 index
let includesResult  // includes(NaN) 的結果
`,
        testCases: [
          { label: 'indexofResult 應為 -1（indexOf 找不到 NaN）', test: `return indexofResult === -1` },
          { label: 'findIndexResult 應為 2（NaN 在 index 2）', test: `return findIndexResult === 2` },
          { label: 'includesResult 應為 true（includes 可以找到 NaN）', test: `return includesResult === true` },
        ],
      },
    ],
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
    problems: [
      {
        id: 'user-lookup',
        title: '使用者查詢',
        difficulty: 'easy',
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
          { label: 'user.name 應為 "Carol"', test: `return user && user.name === 'Carol'` },
          { label: 'senior.name 應為 "Bob"（第一個 age >= 30）', test: `return senior && senior.name === 'Bob'` },
          { label: 'ghost 應為 undefined', test: `return ghost === undefined` },
        ],
      },
      {
        id: 'find-returns-element',
        title: 'find 回傳元素，不是 index',
        difficulty: 'easy',
        description: `\`find()\` 和 \`indexOf()\` 的關鍵差異：find 回傳**元素本身**，indexOf 回傳 **index**。

請：
1. 用 \`find()\` 找出第一個偶數，存到 \`firstEven\`（應為數字 4，不是 index）
2. 用 \`find()\` 找出不存在的值，存到 \`notFound\`（確認是 undefined）`,
        initialCode: `const numbers = [1, 3, 4, 7, 8, 9]

let firstEven  // 第一個偶數（元素本身）
let notFound   // 找不存在的值（例如找 x > 100）
`,
        testCases: [
          { label: 'firstEven 應為 4（元素本身，不是 index 2）', test: `return firstEven === 4` },
          { label: 'notFound 應為 undefined', test: `return notFound === undefined` },
        ],
      },
      {
        id: 'find-product-by-sku',
        title: '依 SKU 查詢商品',
        difficulty: 'medium',
        description: `電商平台需要依 SKU 查詢商品，然後更新庫存。

請：
1. 用 \`find()\` 找出 \`sku\` 為 \`'PRD-002'\` 的商品，存到 \`product\`
2. 如果找到，將其 \`stock\` 減 1（直接修改，find 回傳的是原物件的參考）`,
        initialCode: `const inventory = [
  { sku: 'PRD-001', name: 'Keyboard', stock: 10 },
  { sku: 'PRD-002', name: 'Mouse', stock: 5 },
  { sku: 'PRD-003', name: 'Monitor', stock: 3 },
]

let product  // sku 為 'PRD-002' 的商品

// 找到後將 stock - 1
`,
        testCases: [
          { label: 'product.name 應為 "Mouse"', test: `return product && product.name === 'Mouse'` },
          { label: 'product.stock 應為 4（已減 1）', test: `return product && product.stock === 4` },
          { label: 'inventory 中 PRD-002 的 stock 也應為 4（同一個物件）', test: `return inventory[1].stock === 4` },
        ],
      },
      {
        id: 'find-with-complex-condition',
        title: '複雜條件查詢：多欄位組合',
        difficulty: 'medium',
        description: `使用 \`find()\` 搜尋符合多個條件的訂單。

找出第一筆「狀態為 \`'pending'\` 且金額 \`> 100\`」的訂單，存到 \`urgentOrder\`。`,
        examples: [
          { input: '多筆訂單', output: '第一筆 pending 且 amount > 100 的訂單物件' },
        ],
        initialCode: `const orders = [
  { id: 1, status: 'paid',    amount: 200 },
  { id: 2, status: 'pending', amount: 50  },
  { id: 3, status: 'pending', amount: 150 },
  { id: 4, status: 'pending', amount: 300 },
]

// TODO: 找出第一筆 pending 且 amount > 100 的訂單
let urgentOrder
`,
        testCases: [
          { label: 'urgentOrder.id 應為 3', test: `return urgentOrder && urgentOrder.id === 3` },
          { label: 'urgentOrder.status 應為 "pending"', test: `return urgentOrder && urgentOrder.status === 'pending'` },
          { label: 'urgentOrder.amount 應大於 100', test: `return urgentOrder && urgentOrder.amount > 100` },
        ],
      },
      {
        id: 'find-modifies-original',
        title: 'find 回傳的是原物件參考（陷阱）',
        difficulty: 'hard',
        description: `\`find()\` 回傳的是陣列中原始物件的**參考**，不是複本。
修改 find 回傳的物件，會同時修改陣列中的物件！

請：
1. 用 \`find()\` 找出 id 為 2 的使用者，存到 \`foundUser\`
2. 將 \`foundUser.role\` 改為 \`'admin'\`
3. 確認 \`users\` 陣列中的同一個物件也被修改了

此外，也請示範如何**安全地修改**而不影響原陣列：
用 \`find()\` 找到後，用展開運算符建立一個新物件存到 \`safeUser\`，修改其 \`role\` 為 \`'moderator'\`。`,
        initialCode: `const users = [
  { id: 1, name: 'Alice', role: 'user' },
  { id: 2, name: 'Bob',   role: 'user' },
]

// Step 1~2: 找到 id=2，修改 role 為 'admin'
let foundUser

// Step 3: 安全修改：複製後修改，不影響原物件
// 找到 id=1，複製後將 role 改為 'moderator'
let safeUser
`,
        testCases: [
          { label: 'foundUser.role 應為 "admin"', test: `return foundUser && foundUser.role === 'admin'` },
          { label: 'users[1].role 也應為 "admin"（同一個參考）', test: `return users[1].role === 'admin'` },
          { label: 'safeUser.role 應為 "moderator"', test: `return safeUser && safeUser.role === 'moderator'` },
          { label: 'users[0].role 仍為 "user"（安全修改，原物件不變）', test: `return users[0].role === 'user'` },
        ],
      },
    ],
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
    problems: [
      {
        id: 'cart-update',
        title: '更新購物車商品',
        difficulty: 'easy',
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
          { label: 'idx 應為 1', test: `return idx === 1` },
          { label: 'items[idx].quantity 應被更新為 5', test: `return items[1] && items[1].quantity === 5` },
          { label: 'notFound 應為 -1', test: `return notFound === -1` },
        ],
      },
      {
        id: 'findindex-vs-indexof',
        title: 'findIndex 與 indexOf 的適用場景',
        difficulty: 'easy',
        description: `\`indexOf\` 只能搜尋確切的值，\`findIndex\` 可以搭配條件函式。

請：
1. 用 \`indexOf\` 找 \`'banana'\`，存到 \`idx1\`
2. 用 \`findIndex\` 找第一個長度 > 5 的字串，存到 \`idx2\``,
        initialCode: `const words = ['apple', 'banana', 'cherry', 'kiwi', 'strawberry']

let idx1  // 'banana' 的 index（用 indexOf）
let idx2  // 第一個長度 > 5 的字串的 index（用 findIndex）
`,
        testCases: [
          { label: 'idx1 應為 1', test: `return idx1 === 1` },
          { label: 'idx2 應為 1（"banana" 長度 6 > 5）', test: `return idx2 === 1` },
        ],
      },
      {
        id: 'findindex-update-record',
        title: '找到後替換整筆記錄',
        difficulty: 'medium',
        description: `一個常見的資料更新模式：用 \`findIndex\` 找到位置，再用 \`splice\` 或直接賦值替換整個物件。

請找出 \`id: 2\` 的任務，並**整個替換**成 \`{ id: 2, title: 'Updated task', done: true }\`。`,
        initialCode: `const tasks = [
  { id: 1, title: 'Write tests', done: false },
  { id: 2, title: 'Fix bug',    done: false },
  { id: 3, title: 'Deploy',     done: false },
]

// TODO: 找到 id:2 的 index，整個替換成新物件
`,
        testCases: [
          { label: 'tasks[1].title 應為 "Updated task"', test: `return tasks[1] && tasks[1].title === 'Updated task'` },
          { label: 'tasks[1].done 應為 true', test: `return tasks[1] && tasks[1].done === true` },
          { label: 'tasks 仍有 3 個元素', test: `return tasks.length === 3` },
        ],
      },
      {
        id: 'findindex-immutable-update',
        title: '不可變更新（immutable update）',
        difficulty: 'medium',
        description: `React 狀態管理中常見的不可變更新模式：不修改原陣列，而是產生新陣列。

請：
1. 用 \`findIndex\` 找出 \`id: 3\` 的商品 index
2. 用 \`map\` 建立新陣列 \`updatedCart\`，其中 id:3 的商品 \`qty\` 改為 \`10\`，其他不變
3. 原始 \`cart\` 不能被修改`,
        constraints: ['不能修改 cart 原陣列', '必須使用 findIndex + map 的組合'],
        initialCode: `const cart = [
  { id: 1, name: 'Pen',    qty: 3 },
  { id: 2, name: 'Book',   qty: 1 },
  { id: 3, name: 'Ruler',  qty: 2 },
]

// TODO: 找出 id:3 的 index，用 map 建立不可變更新後的新陣列
let updatedCart
`,
        testCases: [
          { label: 'updatedCart[2].qty 應為 10', test: `return updatedCart && updatedCart[2].qty === 10` },
          { label: 'cart[2].qty 仍為 2（原陣列未被修改）', test: `return cart[2].qty === 2` },
          { label: 'updatedCart 是新陣列（不是同一個參考）', test: `return updatedCart !== cart` },
          { label: 'updatedCart[0].qty 仍為 3（其他元素不變）', test: `return updatedCart && updatedCart[0].qty === 3` },
        ],
      },
      {
        id: 'findindex-nan-find',
        title: 'findIndex 可以找到 NaN',
        difficulty: 'hard',
        description: `\`findIndex\` 使用回呼函式，可以用 \`Number.isNaN()\` 找到 NaN，而 \`indexOf\` 做不到。

請：
1. 用 \`findIndex\` 找出 \`data\` 中第一個 NaN 的位置，存到 \`nanIdx\`
2. 用 \`findIndex\` 找出第一個 \`null\` 的位置，存到 \`nullIdx\`
3. 確認 \`indexOf(NaN)\` 的結果是 -1，存到 \`indexofNan\`

這題驗證你對各方法限制的理解。`,
        initialCode: `const data = [1, null, NaN, 0, undefined, NaN]

let nanIdx      // 第一個 NaN 的 index（用 findIndex）
let nullIdx     // 第一個 null 的 index（用 findIndex）
let indexofNan  // indexOf(NaN) 的結果（會是 -1）
`,
        testCases: [
          { label: 'nanIdx 應為 2', test: `return nanIdx === 2` },
          { label: 'nullIdx 應為 1', test: `return nullIdx === 1` },
          { label: 'indexofNan 應為 -1（indexOf 找不到 NaN）', test: `return indexofNan === -1` },
        ],
      },
    ],
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
    problems: [
      {
        id: 'sum-and-format',
        title: '統計與格式化',
        difficulty: 'easy',
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
          { label: 'total 應為 439', test: `return total === 439` },
          { label: 'upperNames 應有 3 個元素', test: `return upperNames.length === 3` },
          { label: 'upperNames[0] 應為 "ALICE"', test: `return upperNames[0] === 'ALICE'` },
          { label: 'upperNames[2] 應為 "CAROL"', test: `return upperNames[2] === 'CAROL'` },
        ],
      },
      {
        id: 'foreach-returns-undefined',
        title: 'forEach 永遠回傳 undefined',
        difficulty: 'easy',
        description: `\`forEach\` 的回傳值永遠是 \`undefined\`，就算 callback 有 return 也沒用。

請：
1. 呼叫 \`forEach\` 並嘗試收集回傳值，存到 \`result\`
2. 確認 \`result\` 是 \`undefined\`

這題驗證你不會誤用 forEach 來取代 map。`,
        initialCode: `const nums = [1, 2, 3]

// TODO: 呼叫 forEach，將回傳值存到 result
let result
`,
        testCases: [
          { label: 'result 應為 undefined', test: `return result === undefined` },
        ],
      },
      {
        id: 'foreach-build-map',
        title: '用 forEach 建立 Map 物件',
        difficulty: 'medium',
        description: `使用 \`forEach\` 將使用者陣列轉換成以 \`id\` 為 key 的 Map（物件），方便 O(1) 查找。

遍歷 \`users\`，以每個使用者的 \`id\` 為 key，整個物件為 value，存到 \`userMap\`。`,
        examples: [
          { input: `users = [{id:1,name:'Alice'}]`, output: `userMap = { 1: {id:1,name:'Alice'} }` },
        ],
        initialCode: `const users = [
  { id: 1, name: 'Alice', role: 'admin' },
  { id: 2, name: 'Bob',   role: 'user'  },
  { id: 3, name: 'Carol', role: 'user'  },
]
const userMap = {}

// TODO: 用 forEach 建立 userMap，以 id 為 key
`,
        testCases: [
          { label: 'userMap[1].name 應為 "Alice"', test: `return userMap[1] && userMap[1].name === 'Alice'` },
          { label: 'userMap[2].role 應為 "user"', test: `return userMap[2] && userMap[2].role === 'user'` },
          { label: 'Object.keys(userMap) 應有 3 個 key', test: `return Object.keys(userMap).length === 3` },
        ],
      },
      {
        id: 'foreach-with-index',
        title: '使用 index 參數：加上序號',
        difficulty: 'medium',
        description: `\`forEach\` 的 callback 第二個參數是當前元素的 index，可以用來加上序號。

請用 \`forEach\` 遍歷 \`items\`，將每個項目格式化成 \`"1. Apple"\`、\`"2. Banana"\` 等（序號從 1 開始），push 到 \`numbered\`。`,
        initialCode: `const items = ['Apple', 'Banana', 'Cherry', 'Date']
const numbered = []

// TODO: 用 forEach（帶 index 參數）格式化後 push 到 numbered
`,
        testCases: [
          { label: 'numbered[0] 應為 "1. Apple"', test: `return numbered[0] === '1. Apple'` },
          { label: 'numbered[1] 應為 "2. Banana"', test: `return numbered[1] === '2. Banana'` },
          { label: 'numbered[3] 應為 "4. Date"', test: `return numbered[3] === '4. Date'` },
          { label: 'numbered 應有 4 個元素', test: `return numbered.length === 4` },
        ],
      },
      {
        id: 'foreach-no-break-trap',
        title: 'forEach 無法中斷的陷阱',
        difficulty: 'hard',
        description: `\`forEach\` 無法用 \`break\` 提早停止，\`return\` 只是跳出當次 callback，整個迴圈仍會繼續。

以下需求：找到第一個大於 50 的數字就停止，計算此前（含該數字）的累加值。

請用 \`for...of\` 搭配 \`break\` 正確實作（不要用 forEach），存到 \`sumUntilFirst\`。

同時也示範 forEach 的錯誤行為：用 forEach 嘗試 return 停止，存到 \`wrongResult\`（會把全部加完）。`,
        initialCode: `const nums = [10, 30, 60, 20, 80]

// 正確做法：用 for...of + break
let sumUntilFirst = 0
for (const n of nums) {
  // TODO: 累加 n，如果 n > 50 就 break
}

// 錯誤示範：用 forEach return（不會真正停止）
let wrongResult = 0
nums.forEach(n => {
  // TODO: 累加 n，用 return 嘗試停止（其實不會停）
})
`,
        testCases: [
          { label: 'sumUntilFirst 應為 100（10+30+60，到 60 停止）', test: `return sumUntilFirst === 100` },
          { label: 'wrongResult 應為 200（forEach 把全部加完）', test: `return wrongResult === 200` },
        ],
      },
    ],
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
    problems: [
      {
        id: 'data-transform',
        title: '資料轉換',
        difficulty: 'easy',
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
          { label: 'discounted 應為 [90, 180, 315, 72]', test: `return JSON.stringify(discounted) === JSON.stringify([90,180,315,72])` },
          { label: 'names 應為 ["Alice", "Bob", "Carol"]', test: `return JSON.stringify(names) === JSON.stringify(['Alice','Bob','Carol'])` },
          { label: 'display[0].displayName 應為 "Alice (25)"', test: `return display && display[0] && display[0].displayName === 'Alice (25)'` },
          { label: 'prices 原陣列不能被修改', test: `return prices[0] === 100` },
        ],
      },
      {
        id: 'map-with-index',
        title: '使用 index 加上排名',
        difficulty: 'easy',
        description: `\`map\` 的 callback 第二個參數是 index，可以用來加序號或排名。

請將 \`topScorers\` 轉換成含排名的物件陣列，格式為 \`{ rank: 1, name: '...', score: ... }\`（rank 從 1 開始），存到 \`ranked\`。`,
        initialCode: `const topScorers = [
  { name: 'Alice', score: 98 },
  { name: 'Bob',   score: 95 },
  { name: 'Carol', score: 92 },
]

// TODO: 用 map（搭配 index）加上 rank 欄位（從 1 開始），存到 ranked
let ranked
`,
        testCases: [
          { label: 'ranked[0].rank 應為 1', test: `return ranked && ranked[0].rank === 1` },
          { label: 'ranked[1].rank 應為 2', test: `return ranked && ranked[1].rank === 2` },
          { label: 'ranked[0].name 應為 "Alice"', test: `return ranked && ranked[0].name === 'Alice'` },
          { label: 'ranked 應有 3 個元素', test: `return ranked && ranked.length === 3` },
        ],
      },
      {
        id: 'map-normalize',
        title: '資料正規化：扁平化 API 回應',
        difficulty: 'medium',
        description: `後端 API 回應的資料格式需要轉換（正規化）才能在前端使用。

請將 \`apiResponse\` 轉換成前端需要的格式：
- \`user_name\` → \`username\`
- \`is_active\` → \`isActive\`
- 加入 \`fullLabel\`：格式為 \`"username (active)"\` 或 \`"username (inactive)"\``,
        initialCode: `const apiResponse = [
  { user_name: 'alice', is_active: true,  score: 80 },
  { user_name: 'bob',   is_active: false, score: 65 },
  { user_name: 'carol', is_active: true,  score: 90 },
]

// TODO: 用 map 轉換格式
let normalized
`,
        testCases: [
          { label: 'normalized[0].username 應為 "alice"', test: `return normalized && normalized[0].username === 'alice'` },
          { label: 'normalized[0].isActive 應為 true', test: `return normalized && normalized[0].isActive === true` },
          { label: 'normalized[0].fullLabel 應為 "alice (active)"', test: `return normalized && normalized[0].fullLabel === 'alice (active)'` },
          { label: 'normalized[1].fullLabel 應為 "bob (inactive)"', test: `return normalized && normalized[1].fullLabel === 'bob (inactive)'` },
        ],
      },
      {
        id: 'map-then-filter',
        title: 'map + filter 組合',
        difficulty: 'medium',
        description: `先用 \`map\` 轉換，再用 \`filter\` 篩選，是常見的函式組合。

請：
1. 將 \`products\` 的每個商品加入 \`discountedPrice\`（打八折），存到 \`withDiscount\`
2. 從 \`withDiscount\` 中篩選出 \`discountedPrice < 100\` 的商品，存到 \`affordable\``,
        initialCode: `const products = [
  { name: 'Pen',     price: 50  },
  { name: 'Book',    price: 120 },
  { name: 'Pencil',  price: 30  },
  { name: 'Notebook',price: 150 },
]

// Step 1: map 加入 discountedPrice（打八折）
let withDiscount

// Step 2: 從 withDiscount 篩選 discountedPrice < 100
let affordable
`,
        testCases: [
          { label: 'withDiscount[0].discountedPrice 應為 40', test: `return withDiscount && withDiscount[0].discountedPrice === 40` },
          { label: 'withDiscount[1].discountedPrice 應為 96', test: `return withDiscount && withDiscount[1].discountedPrice === 96` },
          { label: 'affordable 應有 3 個商品（40, 24, 96 都 < 100）', test: `return affordable && affordable.length === 3` },
          { label: 'affordable 不包含 Notebook', test: `return affordable && !affordable.some(p => p.name === 'Notebook')` },
        ],
      },
      {
        id: 'map-missing-return-trap',
        title: 'map callback 忘記 return 的陷阱',
        difficulty: 'hard',
        description: `\`map\` 最常見的 bug：callback 忘記 return，導致新陣列全是 \`undefined\`。

請：
1. 修正 \`buggyResult\` 的實作（目前 callback 忘記 return），讓它正確地將每個數字乘以 2
2. 寫出正確版本存到 \`correctResult\`

注意：箭頭函式如果用了 \`{}\` 大括號，就必須明確寫 \`return\`。`,
        initialCode: `const nums = [1, 2, 3, 4, 5]

// ❌ 有 bug：忘記 return
const buggyResult = nums.map(x => {
  x * 2  // 沒有 return！
})

// TODO: 修正為正確版本
const correctResult = nums.map(/* TODO */)
`,
        testCases: [
          { label: 'buggyResult[0] 應為 undefined（驗證 bug）', test: `return buggyResult[0] === undefined` },
          { label: 'correctResult[0] 應為 2', test: `return correctResult[0] === 2` },
          { label: 'correctResult 應為 [2,4,6,8,10]', test: `return JSON.stringify(correctResult) === JSON.stringify([2,4,6,8,10])` },
          { label: 'correctResult 應有 5 個元素', test: `return correctResult.length === 5` },
        ],
      },
    ],
  },
  {
    slug: 'array-filter',
    methodName: 'filter()',
    title: 'Array.filter()',
    description: '回傳所有符合條件的元素組成的新陣列，不修改原陣列。',
    subCategory: '產生新的陣列或新的值',
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
    problems: [
      {
        id: 'product-filter',
        title: '商品篩選',
        difficulty: 'easy',
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
          { label: 'cheap 應有 4 個商品', test: `return Array.isArray(cheap) && cheap.length === 4` },
          { label: 'available 應有 4 個商品', test: `return Array.isArray(available) && available.length === 4` },
          { label: 'premium 只有 Laptop', test: `return Array.isArray(premium) && premium.length === 1 && premium[0].name === 'Laptop'` },
          { label: 'products 原陣列不能被修改（仍有 6 個元素）', test: `return products.length === 6` },
        ],
      },
      {
        id: 'filter-falsy',
        title: '去除 falsy 值',
        difficulty: 'easy',
        description: `\`filter(Boolean)\` 是一個常見的技巧，可以去除陣列中所有 falsy 值（\`0\`、\`''\`、\`null\`、\`undefined\`、\`false\`、\`NaN\`）。

請：
1. 用 \`filter(Boolean)\` 去除 \`mixed\` 中的 falsy 值，存到 \`truthy\`
2. 手動篩選 \`usernames\` 中非空字串的項目，存到 \`validUsernames\``,
        initialCode: `const mixed = [0, 'hello', '', null, 42, false, 'world', undefined, NaN]
let truthy  // 去除所有 falsy 值

const usernames = ['alice', '', 'bob', null, 'carol', undefined]
let validUsernames  // 篩選非空字串
`,
        testCases: [
          { label: 'truthy 應有 3 個元素', test: `return truthy && truthy.length === 3` },
          { label: 'truthy 應為 ["hello", 42, "world"]', test: `return JSON.stringify(truthy) === JSON.stringify(['hello',42,'world'])` },
          { label: 'validUsernames 應有 3 個元素', test: `return validUsernames && validUsernames.length === 3` },
          { label: 'validUsernames 包含 "carol"', test: `return validUsernames && validUsernames.includes('carol')` },
        ],
      },
      {
        id: 'filter-search',
        title: '即時搜尋篩選',
        difficulty: 'medium',
        description: `實作一個簡單的即時搜尋功能。

使用 \`filter\` 從 \`articles\` 中篩選出 \`title\` 包含 \`keyword\` 的文章（不區分大小寫），存到 \`results\`。`,
        examples: [
          { input: `keyword = 'js'`, output: '篩選出 title 含 "js"（不區分大小寫）的文章' },
        ],
        initialCode: `const articles = [
  { id: 1, title: 'Getting Started with JavaScript' },
  { id: 2, title: 'React Hooks Tutorial' },
  { id: 3, title: 'Advanced JS Patterns' },
  { id: 4, title: 'CSS Grid Layout' },
  { id: 5, title: 'Node.js Best Practices' },
]
const keyword = 'js'

// TODO: 篩選出 title 包含 keyword 的文章（不區分大小寫）
let results
`,
        testCases: [
          { label: 'results 應有 3 個文章', test: `return results && results.length === 3` },
          { label: 'results[0].id 應為 1', test: `return results && results[0].id === 1` },
          { label: 'results 包含 "Node.js Best Practices"', test: `return results && results.some(a => a.title === 'Node.js Best Practices')` },
          { label: '不包含 "CSS Grid Layout"', test: `return results && !results.some(a => a.title === 'CSS Grid Layout')` },
        ],
      },
      {
        id: 'filter-unique',
        title: '去除重複（filter + indexOf）',
        difficulty: 'medium',
        description: `使用 \`filter\` 搭配 \`indexOf\` 去除陣列中的重複元素。

技巧：\`filter((item, index) => arr.indexOf(item) === index)\` — 只保留每個元素第一次出現的位置。`,
        constraints: ['必須使用 filter + indexOf 的組合'],
        initialCode: `const nums = [1, 2, 3, 2, 4, 1, 5, 3]

// TODO: 用 filter + indexOf 去除重複，存到 unique
let unique
`,
        testCases: [
          { label: 'unique 應有 5 個元素', test: `return unique && unique.length === 5` },
          { label: 'unique 應為 [1,2,3,4,5]', test: `return JSON.stringify(unique) === JSON.stringify([1,2,3,4,5])` },
        ],
      },
      {
        id: 'filter-vs-map-trap',
        title: 'filter 回傳長度可能不同（vs map）',
        difficulty: 'hard',
        description: `\`map\` 永遠回傳等長陣列，\`filter\` 長度可能不同。有些開發者誤用 map 來做篩選，導致陣列出現 \`undefined\`。

以下有兩種需求：
1. 篩選出 \`active\` 為 \`true\` 的使用者姓名，存到 \`activeNames\`（用 filter + map）
2. 示範錯誤做法：直接用 map 做條件判斷，存到 \`buggyNames\`（會含 undefined）`,
        initialCode: `const users = [
  { name: 'Alice', active: true  },
  { name: 'Bob',   active: false },
  { name: 'Carol', active: true  },
  { name: 'Dave',  active: false },
]

// 正確：filter 後再 map
let activeNames

// 錯誤示範：用 map 做條件（結果含 undefined）
const buggyNames = users.map(u => {
  if (u.active) return u.name
  // 沒有 else return，inactive 的會變 undefined
})
`,
        testCases: [
          { label: 'activeNames 應為 ["Alice","Carol"]', test: `return JSON.stringify(activeNames) === JSON.stringify(['Alice','Carol'])` },
          { label: 'activeNames 應有 2 個元素', test: `return activeNames && activeNames.length === 2` },
          { label: 'buggyNames 應有 4 個元素（map 等長）', test: `return buggyNames.length === 4` },
          { label: 'buggyNames[1] 應為 undefined（錯誤示範）', test: `return buggyNames[1] === undefined` },
        ],
      },
    ],
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
    problems: [
      {
        id: 'order-stats',
        title: '訂單統計',
        difficulty: 'easy',
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
          { label: 'total 應為 510', test: `return total === 510` },
          { label: 'grouped.paid 應有 2 筆訂單', test: `return grouped && Array.isArray(grouped.paid) && grouped.paid.length === 2` },
          { label: 'grouped.pending 應有 2 筆訂單', test: `return grouped && Array.isArray(grouped.pending) && grouped.pending.length === 2` },
          { label: 'max 應為 15', test: `return max === 15` },
        ],
      },
      {
        id: 'reduce-to-object',
        title: '陣列轉物件（以 id 為 key）',
        difficulty: 'easy',
        description: `一個常見的效能優化：將陣列轉成以 id 為 key 的物件，查詢從 O(n) 降為 O(1)。

請用 \`reduce\` 將 \`products\` 轉成 \`{ [id]: product }\` 的物件，存到 \`productMap\`。`,
        examples: [
          { input: `[{id:1,name:'A'}]`, output: `{ 1: {id:1,name:'A'} }` },
        ],
        initialCode: `const products = [
  { id: 1, name: 'Keyboard', price: 79 },
  { id: 2, name: 'Mouse',    price: 29 },
  { id: 3, name: 'Monitor',  price: 399 },
]

// TODO: 用 reduce 轉成 { [id]: product } 的物件
let productMap
`,
        testCases: [
          { label: 'productMap[1].name 應為 "Keyboard"', test: `return productMap && productMap[1] && productMap[1].name === 'Keyboard'` },
          { label: 'productMap[3].price 應為 399', test: `return productMap && productMap[3] && productMap[3].price === 399` },
          { label: 'Object.keys(productMap) 應有 3 個', test: `return productMap && Object.keys(productMap).length === 3` },
        ],
      },
      {
        id: 'reduce-flatten',
        title: '用 reduce 展平陣列',
        difficulty: 'medium',
        description: `\`reduce\` 非常靈活，可以用來展平（flatten）巢狀陣列。

請用 \`reduce\` 將 \`nested\` 展平一層，存到 \`flattened\`。

提示：初始值為 \`[]\`，每次迭代用 \`acc.concat(cur)\` 或展開運算符。`,
        initialCode: `const nested = [[1, 2], [3, 4], [5, 6, 7]]

// TODO: 用 reduce 展平一層，存到 flattened
let flattened
`,
        testCases: [
          { label: 'flattened 應為 [1,2,3,4,5,6,7]', test: `return JSON.stringify(flattened) === JSON.stringify([1,2,3,4,5,6,7])` },
          { label: 'flattened 應有 7 個元素', test: `return flattened && flattened.length === 7` },
        ],
      },
      {
        id: 'reduce-word-count',
        title: '詞頻統計',
        difficulty: 'medium',
        description: `使用 \`reduce\` 統計 \`words\` 陣列中每個單字出現的次數，存到 \`wordCount\`（\`{ [word]: count }\`）。`,
        examples: [
          { input: `['a','b','a','c','b','a']`, output: `{ a:3, b:2, c:1 }` },
        ],
        initialCode: `const words = ['apple', 'banana', 'apple', 'cherry', 'banana', 'apple']

// TODO: 用 reduce 統計每個單字出現次數
let wordCount
`,
        testCases: [
          { label: 'wordCount.apple 應為 3', test: `return wordCount && wordCount.apple === 3` },
          { label: 'wordCount.banana 應為 2', test: `return wordCount && wordCount.banana === 2` },
          { label: 'wordCount.cherry 應為 1', test: `return wordCount && wordCount.cherry === 1` },
        ],
      },
      {
        id: 'reduce-no-return-trap',
        title: 'reduce 忘記 return acc 的陷阱',
        difficulty: 'hard',
        description: `\`reduce\` 最常見的 bug：callback 忘記 \`return acc\`，導致 acc 在下次迭代變成 \`undefined\`！

請：
1. 修正 \`buggySum\` 的實作（目前忘記 return acc）
2. 同時注意：若陣列為空且沒有提供 initialValue，reduce 會拋出 TypeError

示範空陣列的安全寫法：對 \`emptyArr\` 用 reduce 加總，初始值為 \`0\`，存到 \`safeSum\`（應為 0）。`,
        initialCode: `const nums = [1, 2, 3, 4, 5]

// ❌ 有 bug：忘記 return acc
const buggySum = nums.reduce((acc, cur) => {
  acc + cur  // 沒有 return！
}, 0)

// TODO: 修正為正確版本
const correctSum = nums.reduce(/* TODO */)

// 安全寫法：空陣列 + initialValue
const emptyArr = []
const safeSum = emptyArr.reduce(/* TODO */, 0)
`,
        testCases: [
          { label: 'buggySum 應為 undefined（驗證 bug）', test: `return buggySum === undefined` },
          { label: 'correctSum 應為 15', test: `return correctSum === 15` },
          { label: 'safeSum 應為 0（空陣列 + initialValue）', test: `return safeSum === 0` },
        ],
      },
    ],
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
    problems: [
      {
        id: 'flatten-nested',
        title: '展平巢狀資料',
        difficulty: 'easy',
        description: `使用 \`flat()\` 完成以下操作：
1. 將 \`matrix\` 展平一層，存到 \`flat1\`
2. 將 \`nested\` 完全展平（所有層），存到 \`flatAll\`
3. 將 \`comments\` 的回覆展平，存到 \`allReplies\``,
        initialCode: `const matrix = [[1, 2], [3, 4], [5, 6]]
let flat1   // 展平一層

const nested = [1, [2, [3, [4, [5]]]]]
let flatAll  // 完全展平

const comments = [
  { text: 'Great!', replies: ['Thanks!', 'Agreed'] },
  { text: 'Nice',   replies: ['Cool'] },
]
// 只取出所有 replies，展平成一個陣列
let allReplies
`,
        testCases: [
          { label: 'flat1 應為 [1, 2, 3, 4, 5, 6]', test: `return JSON.stringify(flat1) === JSON.stringify([1,2,3,4,5,6])` },
          { label: 'flatAll 應為 [1, 2, 3, 4, 5]', test: `return JSON.stringify(flatAll) === JSON.stringify([1,2,3,4,5])` },
          { label: 'allReplies 應包含所有回覆共 3 個', test: `return Array.isArray(allReplies) && allReplies.length === 3` },
        ],
      },
      {
        id: 'flat-depth',
        title: '指定展平深度',
        difficulty: 'easy',
        description: `\`flat()\` 預設只展平一層，深層巢狀需要指定 depth。

請：
1. 對 \`arr\` 展平 1 層，存到 \`depth1\`
2. 對 \`arr\` 展平 2 層，存到 \`depth2\`
3. 對 \`arr\` 完全展平，存到 \`depthInf\``,
        examples: [
          { input: `arr = [1,[2,[3,[4]]]]`, output: `depth1=[1,2,[3,[4]]], depth2=[1,2,3,[4]], depthInf=[1,2,3,4]` },
        ],
        initialCode: `const arr = [1, [2, [3, [4]]]]

let depth1    // flat(1)
let depth2    // flat(2)
let depthInf  // flat(Infinity)
`,
        testCases: [
          { label: 'depth1 應為 [1,2,[3,[4]]]', test: `return JSON.stringify(depth1) === JSON.stringify([1,2,[3,[4]]])` },
          { label: 'depth2 應為 [1,2,3,[4]]', test: `return JSON.stringify(depth2) === JSON.stringify([1,2,3,[4]])` },
          { label: 'depthInf 應為 [1,2,3,4]', test: `return JSON.stringify(depthInf) === JSON.stringify([1,2,3,4])` },
        ],
      },
      {
        id: 'flat-api-response',
        title: '展平 API 分頁回應',
        difficulty: 'medium',
        description: `後端 API 分頁回傳的資料是二維陣列（每頁一個陣列）。
請用 \`flat()\` 將所有頁面的資料合併成一個一維陣列，存到 \`allItems\`。`,
        examples: [
          { input: '3 頁資料', output: '所有商品的一維陣列' },
        ],
        initialCode: `const pages = [
  [{ id: 1, name: 'Item A' }, { id: 2, name: 'Item B' }],
  [{ id: 3, name: 'Item C' }, { id: 4, name: 'Item D' }],
  [{ id: 5, name: 'Item E' }],
]

// TODO: 展平一層，合併所有頁面的資料
let allItems
`,
        testCases: [
          { label: 'allItems 應有 5 個元素', test: `return allItems && allItems.length === 5` },
          { label: 'allItems[0].id 應為 1', test: `return allItems && allItems[0].id === 1` },
          { label: 'allItems[4].name 應為 "Item E"', test: `return allItems && allItems[4].name === 'Item E'` },
        ],
      },
      {
        id: 'flat-removes-empty',
        title: 'flat 會移除空洞（empty slot）',
        difficulty: 'medium',
        description: `\`flat()\` 有一個副作用：它會移除陣列的**稀疏空洞**（empty slot）。

請：
1. 建立帶有空洞的陣列 \`sparse\`，然後呼叫 \`flat()\`，存到 \`dense\`
2. 說明為什麼 \`sparse.length\` 和 \`dense.length\` 不同

提示：\`[1, , 3, , 5]\` 有 2 個空洞（length 是 5，但只有 3 個實際元素）。`,
        initialCode: `const sparse = [1, , 3, , 5]  // 有空洞的稀疏陣列

// TODO: 用 flat() 展平（這裡目的不是展平巢狀，而是利用空洞移除特性）
let dense
`,
        testCases: [
          { label: 'sparse.length 應為 5', test: `return sparse.length === 5` },
          { label: 'dense 應為 [1, 3, 5]（空洞被移除）', test: `return JSON.stringify(dense) === JSON.stringify([1,3,5])` },
          { label: 'dense.length 應為 3', test: `return dense && dense.length === 3` },
        ],
      },
      {
        id: 'flat-only-one-layer-trap',
        title: 'flat 只展平一層的陷阱',
        difficulty: 'hard',
        description: `\`flat()\` 預設只展平一層！很多人誤以為它會完全展平。

請展示這個差異：
1. \`partialFlat\`：對深層嵌套陣列使用預設 \`flat()\`（只展一層，內部仍有陣列）
2. \`fullFlat\`：使用 \`flat(Infinity)\` 完全展平
3. 確認 \`partialFlat\` 仍有陣列元素（驗證只展一層）`,
        initialCode: `const deep = [1, [2, [3, [4, [5]]]]]

let partialFlat  // flat()（預設 depth=1）
let fullFlat     // flat(Infinity)
`,
        testCases: [
          { label: 'partialFlat 應還有陣列元素（未完全展平）', test: `return partialFlat && partialFlat.some(x => Array.isArray(x))` },
          { label: 'partialFlat[1] 應為 [2,[3,[4,[5]]]]', test: `return JSON.stringify(partialFlat) === JSON.stringify([1,[2,[3,[4,[5]]]]])` },
          { label: 'fullFlat 應為 [1,2,3,4,5]', test: `return JSON.stringify(fullFlat) === JSON.stringify([1,2,3,4,5])` },
          { label: 'fullFlat 沒有陣列元素（完全展平）', test: `return fullFlat && !fullFlat.some(x => Array.isArray(x))` },
        ],
      },
    ],
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
    problems: [
      {
        id: 'tokenize',
        title: '句子分詞',
        difficulty: 'easy',
        description: `使用 \`flatMap()\` 完成以下操作：
1. 將 \`sentences\` 的每個句子用空格分割成單字，展平成一個單字陣列，存到 \`words\`
2. 將 \`cart\` 中每個商品根據 \`quantity\` 展開成多筆記錄，存到 \`lineItems\``,
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
          { label: 'words 應有 8 個單字', test: `return Array.isArray(words) && words.length === 8` },
          { label: 'words[0] 應為 "Hello"', test: `return words[0] === 'Hello'` },
          { label: 'lineItems 應有 5 個元素', test: `return Array.isArray(lineItems) && lineItems.length === 5` },
          { label: 'lineItems 前 3 個應為 "Apple"', test: `return lineItems[0] === 'Apple' && lineItems[2] === 'Apple'` },
        ],
      },
      {
        id: 'flatmap-filter-map',
        title: '同時過濾和轉換',
        difficulty: 'easy',
        description: `\`flatMap\` 可以透過回傳空陣列 \`[]\` 來達到 filter 的效果，同時轉換元素。

請用 \`flatMap\` 從 \`nums\` 中：
- 偶數：乘以 10，保留
- 奇數：丟棄（回傳 []）

結果存到 \`evenTimesTen\`。`,
        examples: [
          { input: '[1,2,3,4,5]', output: '[20,40]' },
        ],
        initialCode: `const nums = [1, 2, 3, 4, 5, 6]

// TODO: 用 flatMap，偶數乘以 10 保留，奇數丟棄
let evenTimesTen
`,
        testCases: [
          { label: 'evenTimesTen 應為 [20,40,60]', test: `return JSON.stringify(evenTimesTen) === JSON.stringify([20,40,60])` },
          { label: 'evenTimesTen 應有 3 個元素', test: `return evenTimesTen && evenTimesTen.length === 3` },
        ],
      },
      {
        id: 'flatmap-expand-rows',
        title: '展開行項目',
        difficulty: 'medium',
        description: `一個訂單系統中，每個訂單有多個商品，需要將所有商品展開成一個清單。

請用 \`flatMap\` 將 \`orders\` 中每個訂單的 \`items\` 展開，並為每個商品加上 \`orderId\` 欄位，存到 \`allItems\`。`,
        examples: [
          { input: 'orders[0].items = [{name:"A"}]，orderId=1', output: 'allItems[0] = {name:"A", orderId:1}' },
        ],
        initialCode: `const orders = [
  { id: 1, items: [{ name: 'Pen', price: 5 }, { name: 'Book', price: 20 }] },
  { id: 2, items: [{ name: 'Ruler', price: 3 }] },
  { id: 3, items: [{ name: 'Eraser', price: 2 }, { name: 'Pencil', price: 1 }] },
]

// TODO: 用 flatMap 展開 items 並加上 orderId
let allItems
`,
        testCases: [
          { label: 'allItems 應有 5 個元素', test: `return allItems && allItems.length === 5` },
          { label: 'allItems[0].orderId 應為 1', test: `return allItems && allItems[0].orderId === 1` },
          { label: 'allItems[0].name 應為 "Pen"', test: `return allItems && allItems[0].name === 'Pen'` },
          { label: 'allItems[2].orderId 應為 2', test: `return allItems && allItems[2].orderId === 2` },
        ],
      },
      {
        id: 'flatmap-vs-map-flat',
        title: 'flatMap 和 map + flat 的比較',
        difficulty: 'medium',
        description: `\`flatMap\` 等同於 \`map().flat(1)\`，但效能更好（只遍歷一次）。

請用兩種方式達到相同結果：
1. \`result1\`：用 \`flatMap\` 將每個數字展開成 \`[num, num * 2]\`
2. \`result2\`：用 \`map().flat()\` 達到相同結果

兩者結果應相同。`,
        initialCode: `const nums = [1, 2, 3]

// 方法 1: flatMap
let result1

// 方法 2: map + flat
let result2
`,
        testCases: [
          { label: 'result1 應為 [1,2,2,4,3,6]', test: `return JSON.stringify(result1) === JSON.stringify([1,2,2,4,3,6])` },
          { label: 'result2 應為 [1,2,2,4,3,6]', test: `return JSON.stringify(result2) === JSON.stringify([1,2,2,4,3,6])` },
          { label: 'result1 和 result2 結果相同', test: `return JSON.stringify(result1) === JSON.stringify(result2)` },
        ],
      },
      {
        id: 'flatmap-only-one-level-trap',
        title: 'flatMap 只展平一層（深層巢狀的陷阱）',
        difficulty: 'hard',
        description: `\`flatMap\` 只展平**一層**，如果 callback 回傳的是多層巢狀陣列，內層仍然保留。

請示範這個差異：
1. \`result1\`：用 \`flatMap\` callback 回傳 \`[[x, x*2]]\`（雙層陣列），觀察結果（只展一層）
2. \`result2\`：修改 callback 使結果是你想要的 \`[1,2,2,4,3,6]\`

\`nums = [1, 2, 3]\``,
        initialCode: `const nums = [1, 2, 3]

// callback 回傳雙層陣列：[[x, x*2]]
// flatMap 只展一層，所以結果是 [[1,2],[2,4],[3,6]] 展一層後的樣子
const result1 = nums.flatMap(x => [[x, x * 2]])

// TODO: 修正為正確版本，讓 result2 = [1,2,2,4,3,6]
let result2
`,
        testCases: [
          { label: 'result1[0] 應為 [1,2]（雙層，未被展開到底）', test: `return Array.isArray(result1[0]) && result1[0][0] === 1 && result1[0][1] === 2` },
          { label: 'result2 應為 [1,2,2,4,3,6]', test: `return JSON.stringify(result2) === JSON.stringify([1,2,2,4,3,6])` },
        ],
      },
    ],
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
    problems: [
      {
        id: 'pagination',
        title: '分頁與截取',
        difficulty: 'easy',
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
          { label: 'firstThree 應為 ["a", "b", "c"]', test: `return JSON.stringify(firstThree) === JSON.stringify(['a','b','c'])` },
          { label: 'lastTwo 應為 ["f", "g"]', test: `return JSON.stringify(lastTwo) === JSON.stringify(['f','g'])` },
          { label: 'page2 應為 ["d", "e", "f"]', test: `return JSON.stringify(page2) === JSON.stringify(['d','e','f'])` },
          { label: 'items 原陣列不能被修改', test: `return items.length === 7` },
        ],
      },
      {
        id: 'slice-copy',
        title: '用 slice() 複製陣列',
        difficulty: 'easy',
        description: `\`slice()\` 不傳參數時，會回傳整個陣列的 shallow copy。

請：
1. 用 \`slice()\` 複製 \`original\` 到 \`copy\`
2. 修改 \`copy\`（push 一個新元素）
3. 確認 \`original\` 不受影響`,
        initialCode: `const original = [1, 2, 3, 4, 5]

// TODO: 用 slice() 複製 original
let copy

// 修改 copy
if (copy) copy.push(99)
`,
        testCases: [
          { label: 'copy 應有 6 個元素', test: `return copy && copy.length === 6` },
          { label: 'copy[5] 應為 99', test: `return copy && copy[5] === 99` },
          { label: 'original 仍有 5 個元素', test: `return original.length === 5` },
          { label: 'copy !== original（不同的陣列）', test: `return copy !== original` },
        ],
      },
      {
        id: 'slice-window',
        title: '滑動視窗（Sliding Window）',
        difficulty: 'medium',
        description: `使用 \`slice\` 實作一個固定大小的滑動視窗，計算每個視窗的平均值。

視窗大小為 3，請計算 \`data\` 中每個連續 3 個元素的平均值，存到 \`averages\`。

例如：\`[1,2,3,4,5]\`，視窗大小 3 → \`[avg(1,2,3), avg(2,3,4), avg(3,4,5)] = [2, 3, 4]\``,
        initialCode: `const data = [10, 20, 30, 40, 50, 60]
const windowSize = 3
const averages = []

// TODO: 用 slice 計算每個滑動視窗的平均值
`,
        testCases: [
          { label: 'averages 應有 4 個元素', test: `return averages.length === 4` },
          { label: 'averages[0] 應為 20（(10+20+30)/3）', test: `return averages[0] === 20` },
          { label: 'averages[3] 應為 50（(40+50+60)/3）', test: `return averages[3] === 50` },
        ],
      },
      {
        id: 'slice-before-sort',
        title: '排序前先複製（避免修改原陣列）',
        difficulty: 'medium',
        description: `\`sort()\` 會修改原陣列。在排序前用 \`slice()\` 複製，可以保護原陣列。

請：
1. 用 \`slice()\` 複製 \`scores\`，再排序，存到 \`sorted\`
2. 確認 \`scores\` 原陣列未被修改`,
        initialCode: `const scores = [85, 42, 96, 71, 58, 33]

// TODO: 複製 scores 後排序（升冪），存到 sorted
let sorted
`,
        testCases: [
          { label: 'sorted 應升冪排序', test: `return JSON.stringify(sorted) === JSON.stringify([33,42,58,71,85,96])` },
          { label: 'scores 第一個仍為 85（未被修改）', test: `return scores[0] === 85` },
          { label: 'sorted !== scores（不同陣列）', test: `return sorted !== scores` },
        ],
      },
      {
        id: 'slice-end-exclusive-trap',
        title: 'slice end 是不含的（邊界陷阱）',
        difficulty: 'hard',
        description: `\`slice(start, end)\` 的 end 是**不含的（exclusive）**，這是很常見的 off-by-one 錯誤。

以下情境：從 10 個題目中，取出第 3 題到第 7 題（包含兩端，即 index 2 到 6 共 5 題）。

請正確計算 start 和 end 並截取，存到 \`selectedQuestions\`。

注意：index 從 0 開始，第 3 題 = index 2，第 7 題 = index 6，要包含第 7 題需要 end = 7。`,
        examples: [
          { input: '取第 3~7 題（含）', output: 'slice(2, 7) → 5 個題目', note: 'end 要比最後的 index 多 1' },
        ],
        initialCode: `const questions = ['Q1','Q2','Q3','Q4','Q5','Q6','Q7','Q8','Q9','Q10']

// TODO: 取出第 3 題到第 7 題（包含兩端），存到 selectedQuestions
let selectedQuestions
`,
        testCases: [
          { label: 'selectedQuestions 應有 5 個題目', test: `return selectedQuestions && selectedQuestions.length === 5` },
          { label: 'selectedQuestions[0] 應為 "Q3"', test: `return selectedQuestions && selectedQuestions[0] === 'Q3'` },
          { label: 'selectedQuestions[4] 應為 "Q7"', test: `return selectedQuestions && selectedQuestions[4] === 'Q7'` },
          { label: 'questions 原陣列不被修改', test: `return questions.length === 10` },
        ],
      },
    ],
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
    problems: [
      {
        id: 'merge-sources',
        title: '合併資料來源',
        difficulty: 'easy',
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
          { label: 'all 應為 [1, 2, 3, 4, 5, 6]', test: `return JSON.stringify(all) === JSON.stringify([1,2,3,4,5,6])` },
          { label: 'merged 應為 ["x", "y", "z", "w"]', test: `return JSON.stringify(merged) === JSON.stringify(['x','y','z','w'])` },
          { label: 'withExtra 應為 [10, 20, 30, 99]', test: `return JSON.stringify(withExtra) === JSON.stringify([10,20,30,99])` },
          { label: 'nums 原陣列不能被修改', test: `return nums.length === 3` },
        ],
      },
      {
        id: 'concat-immutable',
        title: 'concat 不修改原陣列',
        difficulty: 'easy',
        description: `\`concat\` 和 \`push\` 的關鍵差異：\`concat\` 回傳新陣列，\`push\` 修改原陣列。

請：
1. 用 \`concat\` 將 \`[4, 5]\` 加到 \`arr\` 後，存到 \`newArr\`
2. 確認 \`arr\` 原陣列不被修改`,
        initialCode: `const arr = [1, 2, 3]

// TODO: 用 concat 加入 [4, 5]，存到 newArr
let newArr
`,
        testCases: [
          { label: 'newArr 應為 [1,2,3,4,5]', test: `return JSON.stringify(newArr) === JSON.stringify([1,2,3,4,5])` },
          { label: 'arr 仍為 [1,2,3]（原陣列不變）', test: `return JSON.stringify(arr) === JSON.stringify([1,2,3])` },
          { label: 'newArr !== arr（新陣列）', test: `return newArr !== arr` },
        ],
      },
      {
        id: 'concat-pagination',
        title: '累積分頁載入的資料',
        difficulty: 'medium',
        description: `「載入更多」的功能中，每次取得新的一頁資料就累加到已有的清單。

請模擬三次「載入更多」：
- 初始資料在 \`page1\`
- 依序載入 \`page2\`、\`page3\`
- 每次使用 \`concat\` 累加（不修改舊陣列），最終存到 \`allData\``,
        initialCode: `const page1 = [{ id: 1 }, { id: 2 }]
const page2 = [{ id: 3 }, { id: 4 }]
const page3 = [{ id: 5 }]

// TODO: 用 concat 依序合併三頁，存到 allData
let allData
`,
        testCases: [
          { label: 'allData 應有 5 個元素', test: `return allData && allData.length === 5` },
          { label: 'allData[0].id 應為 1', test: `return allData && allData[0].id === 1` },
          { label: 'allData[4].id 應為 5', test: `return allData && allData[4].id === 5` },
          { label: 'page1 原陣列不被修改（仍有 2 個）', test: `return page1.length === 2` },
        ],
      },
      {
        id: 'concat-non-array',
        title: 'concat 接受非陣列參數',
        difficulty: 'medium',
        description: `\`concat\` 可以接受陣列或單個值作為參數。

請：
1. 用 \`concat\` 將數字 \`10\`、陣列 \`[20, 30]\`、數字 \`40\` 合併到 \`base\`，存到 \`result\`
2. 注意 \`concat([[1, 2]])\` 和 \`concat([1, 2])\` 的差異`,
        initialCode: `const base = [0]

// TODO: concat(10, [20, 30], 40)
let result  // 應為 [0, 10, 20, 30, 40]

// 注意這個差異
const withNestedArr = base.concat([[1, 2]])  // concat 一個巢狀陣列
const withFlatArr   = base.concat([1, 2])    // concat 一個普通陣列
`,
        testCases: [
          { label: 'result 應為 [0,10,20,30,40]', test: `return JSON.stringify(result) === JSON.stringify([0,10,20,30,40])` },
          { label: 'withNestedArr[1] 應為 [1,2]（巢狀，只展一層）', test: `return Array.isArray(withNestedArr[1]) && withNestedArr[1][0]===1` },
          { label: 'withFlatArr 應為 [0,1,2]（普通陣列被展平）', test: `return JSON.stringify(withFlatArr) === JSON.stringify([0,1,2])` },
        ],
      },
      {
        id: 'concat-deep-trap',
        title: 'concat 只展平一層的陷阱',
        difficulty: 'hard',
        description: `\`concat\` 只展平一層，如果傳入的是巢狀陣列，內層仍然保留。

以下情境：你有多個分類的標籤清單（每個分類是陣列），想用 \`concat\` 合併：

\`\`\`js
const techTags = ['js', 'ts']
const designTags = ['css', 'figma']
const allTags = [].concat(techTags, designTags)  // 正確：['js','ts','css','figma']
\`\`\`

但如果不小心傳入了「陣列的陣列」：

請：
1. 正確合併 \`flat\` 版本，存到 \`correct\`
2. 錯誤示範：傳入 \`[techTags, designTags]\`（陣列的陣列），存到 \`wrong\`（結果含巢狀陣列）`,
        initialCode: `const techTags   = ['js', 'ts']
const designTags = ['css', 'figma']

// 正確：分別傳入兩個陣列
const correct = [].concat(/* TODO */)

// 錯誤：傳入陣列的陣列（只展一層，內部仍是陣列）
const wrong = [].concat([techTags, designTags])
`,
        testCases: [
          { label: 'correct 應為 ["js","ts","css","figma"]', test: `return JSON.stringify(correct) === JSON.stringify(['js','ts','css','figma'])` },
          { label: 'wrong[0] 應為 ["js","ts"]（陣列沒被完全展開）', test: `return Array.isArray(wrong[0]) && wrong[0][0] === 'js'` },
          { label: 'wrong.length 應為 2（兩個陣列，沒展開）', test: `return wrong.length === 2` },
        ],
      },
    ],
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
    problems: [
      {
        id: 'path-and-csv',
        title: '路徑與 CSV 生成',
        difficulty: 'easy',
        description: `使用 \`join()\` 完成以下操作：
1. 將 \`pathParts\` 用 \`/\` 連接成路徑字串，存到 \`urlPath\`
2. 將 \`headers\` 用 \`','\` 連接成 CSV 標頭行，存到 \`csvHeader\`
3. 將 \`words\` 用空格連接成句子，存到 \`sentence\``,
        initialCode: `const pathParts = ['api', 'users', '123', 'profile']
let urlPath  // "api/users/123/profile"

const headers = ['id', 'name', 'email', 'age']
let csvHeader  // "id,name,email,age"

const words = ['JavaScript', 'is', 'fun']
let sentence  // "JavaScript is fun"
`,
        testCases: [
          { label: 'urlPath 應為 "api/users/123/profile"', test: `return urlPath === 'api/users/123/profile'` },
          { label: 'csvHeader 應為 "id,name,email,age"', test: `return csvHeader === 'id,name,email,age'` },
          { label: 'sentence 應為 "JavaScript is fun"', test: `return sentence === 'JavaScript is fun'` },
        ],
      },
      {
        id: 'join-null-undefined',
        title: 'null 和 undefined 變成空字串',
        difficulty: 'easy',
        description: `\`join\` 會將 \`null\` 和 \`undefined\` 轉成**空字串**，不是 \`"null"\` 或 \`"undefined"\`。

請：
1. 對 \`arr\` 呼叫 \`join('-')\`，存到 \`result\`（觀察 null 和 undefined 的行為）
2. 確認結果格式正確`,
        examples: [
          { input: `[1, null, 3, undefined, 5].join('-')`, output: `'1--3--5'（null 和 undefined 是空字串）` },
        ],
        initialCode: `const arr = [1, null, 3, undefined, 5]

// TODO: join('-')，存到 result
let result
`,
        testCases: [
          { label: 'result 應為 "1--3--5"', test: `return result === '1--3--5'` },
        ],
      },
      {
        id: 'join-build-html',
        title: '產生 HTML 清單',
        difficulty: 'medium',
        description: `使用 \`map\` + \`join\` 的組合，從資料陣列產生 HTML 字串。

請將 \`items\` 轉換成 HTML 清單字串，格式為：
\`<ul><li>Apple</li><li>Banana</li><li>Cherry</li></ul>\``,
        initialCode: `const items = ['Apple', 'Banana', 'Cherry']

// TODO: 用 map 將每個 item 包成 <li>，再用 join 合併，最後包在 <ul> 中
let htmlList
`,
        testCases: [
          { label: 'htmlList 應包含 "<ul>"', test: `return htmlList && htmlList.includes('<ul>')` },
          { label: 'htmlList 應包含 "<li>Apple</li>"', test: `return htmlList && htmlList.includes('<li>Apple</li>')` },
          { label: 'htmlList 應包含 "<li>Cherry</li>"', test: `return htmlList && htmlList.includes('<li>Cherry</li>')` },
          { label: 'htmlList 應以 "</ul>" 結尾', test: `return htmlList && htmlList.endsWith('</ul>')` },
        ],
      },
      {
        id: 'join-default-separator',
        title: 'join 的預設分隔符是逗號',
        difficulty: 'medium',
        description: `\`join()\` 不傳參數時，預設使用 \`','\` 作為分隔符。

請：
1. 用 \`join()\`（不傳參數）連接 \`nums\`，存到 \`defaultJoin\`
2. 用 \`join('')\`（空字串）連接 \`digits\` 成數字字串，存到 \`numberStr\`
3. 確認 \`defaultJoin\` 使用逗號分隔`,
        initialCode: `const nums = [1, 2, 3, 4, 5]
let defaultJoin  // 不傳分隔符，使用預設 ','

const digits = [3, 1, 4, 1, 5]
let numberStr  // 用 '' 連接，結果為 '31415'
`,
        testCases: [
          { label: 'defaultJoin 應為 "1,2,3,4,5"', test: `return defaultJoin === '1,2,3,4,5'` },
          { label: 'numberStr 應為 "31415"', test: `return numberStr === '31415'` },
        ],
      },
      {
        id: 'join-split-roundtrip',
        title: 'join 和 split 的往返轉換',
        difficulty: 'hard',
        description: `\`join\` 和 \`split\` 是互逆操作。但要注意分隔符必須一致，否則往返後結果不同。

請：
1. 將 CSV 字串 \`csvLine\` 用 \`split(',').map(x => x.trim())\` 解析成陣列，存到 \`parsed\`
2. 對 \`parsed\` 修改：將第二個欄位（index 1）改為 \`'Updated'\`
3. 再用 \`join(',')\` 組回 CSV 字串，存到 \`newCsvLine\`

這是一個實際的 CSV 編輯操作。`,
        initialCode: `const csvLine = 'Alice, 30, Engineer'

// Step 1: 解析 CSV（split 後 trim 空白）
let parsed

// Step 2: 修改第二個欄位為 'Updated'（直接修改 parsed）

// Step 3: 重新組合成 CSV 字串
let newCsvLine
`,
        testCases: [
          { label: 'parsed[0] 應為 "Alice"', test: `return parsed && parsed[0] === 'Alice'` },
          { label: 'parsed[2] 應為 "Engineer"', test: `return parsed && parsed[2] === 'Engineer'` },
          { label: 'newCsvLine 應包含 "Updated"', test: `return newCsvLine && newCsvLine.includes('Updated')` },
          { label: 'newCsvLine 應為 "Alice,Updated,Engineer"', test: `return newCsvLine === 'Alice,Updated,Engineer'` },
        ],
      },
    ],
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
    problems: [
      {
        id: 'form-validation',
        title: '表單驗證',
        difficulty: 'easy',
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
          { label: 'allPassed 應為 true', test: `return allPassed === true` },
          { label: 'formValid 應為 false（bio 為空）', test: `return formValid === false` },
          { label: 'allPositive 應為 false（有 0）', test: `return allPositive === false` },
        ],
      },
      {
        id: 'every-empty-array',
        title: '空陣列的 every 行為',
        difficulty: 'easy',
        description: `空陣列對任何條件呼叫 \`every()\` 都回傳 \`true\`（這叫 vacuous truth）。

請：
1. 對 \`emptyArr\` 呼叫 \`every(x => x > 100)\`，存到 \`emptyResult\`（應為 true）
2. 對 \`nonEmpty\` 呼叫同樣條件，存到 \`nonEmptyResult\`（應為 false）`,
        initialCode: `const emptyArr = []
let emptyResult  // 空陣列的 every 結果

const nonEmpty = [1, 2, 3]
let nonEmptyResult  // [1,2,3].every(x => x > 100) 的結果
`,
        testCases: [
          { label: 'emptyResult 應為 true（空陣列 vacuous truth）', test: `return emptyResult === true` },
          { label: 'nonEmptyResult 應為 false', test: `return nonEmptyResult === false` },
        ],
      },
      {
        id: 'every-type-check',
        title: '型別一致性驗證',
        difficulty: 'medium',
        description: `使用 \`every\` 驗證 API 回應的資料格式是否符合預期。

請：
1. 確認 \`users\` 中每個元素都有 \`id\`（number）和 \`name\`（string）欄位，存到 \`isValid\`
2. 確認 \`values\` 中每個元素都是數字型別，存到 \`allNumbers\``,
        initialCode: `const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Carol' },
]
let isValid  // 所有 user 是否都有 id(number) 和 name(string)

const values = [1, 2, '3', 4]
let allNumbers  // 是否全部是 number 型別
`,
        testCases: [
          { label: 'isValid 應為 true', test: `return isValid === true` },
          { label: 'allNumbers 應為 false（"3" 是字串）', test: `return allNumbers === false` },
        ],
      },
      {
        id: 'every-short-circuit',
        title: 'every 短路行為驗證',
        difficulty: 'medium',
        description: `\`every\` 遇到第一個 falsy 就短路停止，後面的元素不再檢查。

請透過計數器驗證短路行為：
遍歷 \`[1, 2, -3, 4, 5]\`，計算 callback 被呼叫的次數，存到 \`callCount\`。

條件：\`x > 0\`（遇到 -3 就停止）。`,
        initialCode: `const arr = [1, 2, -3, 4, 5]
let callCount = 0

const result = arr.every(x => {
  callCount++
  return x > 0
})
`,
        testCases: [
          { label: 'result 應為 false', test: `return result === false` },
          { label: 'callCount 應為 3（遇到 -3 就停止）', test: `return callCount === 3` },
        ],
      },
      {
        id: 'every-permissions-check',
        title: '複雜的權限驗證組合',
        difficulty: 'hard',
        description: `一個 API 端點需要驗證：
1. 請求中所有的資源 ID 都是正整數
2. 每個資源都存在於允許清單中

請完成兩個驗證：
- \`allValidIds\`：每個 id 都是 > 0 的整數（非 0、非負數、非小數）
- \`allAllowed\`：每個 id 都在 \`allowedIds\` 清單中`,
        initialCode: `const requestIds = [3, 7, 1, 5]
const allowedIds = [1, 3, 5, 7, 9]

let allValidIds  // 每個 id 都是正整數
let allAllowed   // 每個 id 都在 allowedIds 中
`,
        testCases: [
          { label: 'allValidIds 應為 true', test: `return allValidIds === true` },
          { label: 'allAllowed 應為 true', test: `return allAllowed === true` },
          { label: '若有 id 不在允許清單，allAllowed 應為 false', test: `const test = [1,3,99].every(id => allowedIds.includes(id)); return test === false` },
        ],
      },
    ],
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
    problems: [
      {
        id: 'permission-check',
        title: '權限與庫存檢查',
        difficulty: 'easy',
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
          { label: 'isAdmin 應為 true', test: `return isAdmin === true` },
          { label: 'hasOutOfStock 應為 true', test: `return hasOutOfStock === true` },
          { label: 'anyFailed 應為 false', test: `return anyFailed === false` },
        ],
      },
      {
        id: 'some-empty-array',
        title: '空陣列的 some 行為',
        difficulty: 'easy',
        description: `空陣列對任何條件呼叫 \`some()\` 都回傳 \`false\`（和 \`every\` 相反）。

請：
1. 對 \`emptyArr\` 呼叫 \`some(x => x > 0)\`，存到 \`emptyResult\`（應為 false）
2. 對 \`nonEmpty\` 呼叫同樣條件，存到 \`nonEmptyResult\`（應為 true）`,
        initialCode: `const emptyArr = []
let emptyResult  // 空陣列的 some 結果

const nonEmpty = [1, 2, 3]
let nonEmptyResult  // [1,2,3].some(x => x > 0)
`,
        testCases: [
          { label: 'emptyResult 應為 false（空陣列的 some）', test: `return emptyResult === false` },
          { label: 'nonEmptyResult 應為 true', test: `return nonEmptyResult === true` },
        ],
      },
      {
        id: 'some-vs-find',
        title: 'some vs find 的語意差異',
        difficulty: 'medium',
        description: `\`some\` 和 \`find\` 都能找元素，但語意不同：
- \`some\` 回傳 **boolean**（只關心「有沒有」）
- \`find\` 回傳**元素本身**（需要用到該元素）

請：
1. 用 \`some\` 確認是否有 \`active\` 為 \`true\` 的使用者，存到 \`hasActiveUser\`（boolean）
2. 用 \`find\` 取得第一個 \`active\` 為 \`true\` 的使用者，存到 \`firstActive\`（物件）`,
        initialCode: `const users = [
  { id: 1, name: 'Alice', active: false },
  { id: 2, name: 'Bob',   active: true  },
  { id: 3, name: 'Carol', active: true  },
]

let hasActiveUser  // boolean
let firstActive    // 第一個 active 使用者物件
`,
        testCases: [
          { label: 'hasActiveUser 應為 true（boolean）', test: `return hasActiveUser === true` },
          { label: 'firstActive.name 應為 "Bob"', test: `return firstActive && firstActive.name === 'Bob'` },
          { label: 'typeof hasActiveUser 應為 "boolean"', test: `return typeof hasActiveUser === 'boolean'` },
        ],
      },
      {
        id: 'some-duplicate-check',
        title: '檢查是否有重複值',
        difficulty: 'medium',
        description: `使用 \`some\` 搭配 \`indexOf\` 或 \`filter\` 檢查陣列中是否有重複元素。

請：
1. 確認 \`withDup\` 是否有重複元素，存到 \`hasDuplicate1\`（應為 true）
2. 確認 \`noDup\` 是否有重複元素，存到 \`hasDuplicate2\`（應為 false）

提示：\`arr.some((item, index) => arr.indexOf(item) !== index)\` 可以判斷是否有重複。`,
        initialCode: `const withDup = [1, 2, 3, 2, 4]
const noDup   = [1, 2, 3, 4, 5]

let hasDuplicate1  // withDup 是否有重複
let hasDuplicate2  // noDup 是否有重複
`,
        testCases: [
          { label: 'hasDuplicate1 應為 true', test: `return hasDuplicate1 === true` },
          { label: 'hasDuplicate2 應為 false', test: `return hasDuplicate2 === false` },
        ],
      },
      {
        id: 'some-early-exit',
        title: 'some 的短路與 forEach 的對比',
        difficulty: 'hard',
        description: `\`some\` 遇到第一個符合條件就停止（短路），而 \`forEach\` 無法停止。
這讓 \`some\` 成為「提早退出」的好工具。

以下情境：在一個大型清單中，只要找到第一個 \`priority === 'critical'\` 的 issue 就停止搜尋。

請：
1. 用 \`some\` 找到後停止，計算 callback 呼叫次數，存到 \`callCountSome\`
2. 用 \`forEach\` 嘗試做同樣的事，計算呼叫次數，存到 \`callCountForEach\`（無法停止，會遍歷全部）`,
        initialCode: `const issues = [
  { id: 1, priority: 'low'      },
  { id: 2, priority: 'medium'   },
  { id: 3, priority: 'critical' },
  { id: 4, priority: 'low'      },
  { id: 5, priority: 'high'     },
]

let callCountSome = 0
const foundWithSome = issues.some(issue => {
  callCountSome++
  return issue.priority === 'critical'
})

let callCountForEach = 0
issues.forEach(issue => {
  callCountForEach++
  // 即使這裡 return，forEach 也不會停止
  if (issue.priority === 'critical') return
})
`,
        testCases: [
          { label: 'foundWithSome 應為 true', test: `return foundWithSome === true` },
          { label: 'callCountSome 應為 3（找到 critical 就停止）', test: `return callCountSome === 3` },
          { label: 'callCountForEach 應為 5（forEach 遍歷全部）', test: `return callCountForEach === 5` },
        ],
      },
    ],
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
    problems: [
      {
        id: 'whitelist-check',
        title: '白名單與特殊值檢查',
        difficulty: 'easy',
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
          { label: 'allowed 應為 false', test: `return allowed === false` },
          { label: 'hasNaN 應為 true', test: `return hasNaN === true` },
          { label: 'hasAppleAfter2 應為 true', test: `return hasAppleAfter2 === true` },
        ],
      },
      {
        id: 'includes-vs-indexof',
        title: 'includes vs indexOf 的差異',
        difficulty: 'easy',
        description: `\`includes\` 比 \`indexOf !== -1\` 更語意清楚，且能找到 NaN。

請用兩種方式判斷 \`'banana'\` 是否在 \`fruits\` 中：
1. \`hasBanana1\`：用 \`includes\`（較推薦）
2. \`hasBanana2\`：用 \`indexOf !== -1\`（較舊的寫法）

兩者結果應相同。`,
        initialCode: `const fruits = ['apple', 'banana', 'cherry']

let hasBanana1  // 用 includes
let hasBanana2  // 用 indexOf !== -1
`,
        testCases: [
          { label: 'hasBanana1 應為 true', test: `return hasBanana1 === true` },
          { label: 'hasBanana2 應為 true', test: `return hasBanana2 === true` },
          { label: 'hasBanana1 和 hasBanana2 相同', test: `return hasBanana1 === hasBanana2` },
        ],
      },
      {
        id: 'includes-filter-pipeline',
        title: '用 includes 過濾黑名單',
        difficulty: 'medium',
        description: `一個評論系統需要過濾包含敏感詞的評論。

請用 \`filter\` + \`some\` + \`includes\`（或 \`split\` + \`includes\`）組合，
篩選出**不包含**任何敏感詞的評論，存到 \`safeComments\`。

技巧：先將評論 split 成單字陣列，再用 some 判斷是否有任何單字在 blocklist 中。`,
        initialCode: `const comments = [
  'This is great',
  'spam link here',
  'Nice work',
  'buy cheap stuff',
  'Excellent tutorial',
]
const blocklist = ['spam', 'cheap', 'buy']

// TODO: 過濾掉包含敏感詞的評論，存到 safeComments
let safeComments
`,
        testCases: [
          { label: 'safeComments 應有 3 個評論', test: `return safeComments && safeComments.length === 3` },
          { label: 'safeComments 包含 "This is great"', test: `return safeComments && safeComments.includes('This is great')` },
          { label: 'safeComments 不包含 "spam link here"', test: `return safeComments && !safeComments.includes('spam link here')` },
        ],
      },
      {
        id: 'includes-from-index',
        title: 'fromIndex 參數的應用',
        difficulty: 'medium',
        description: `\`includes(value, fromIndex)\` 可以指定從哪個位置開始搜尋。

請：
1. 確認 \`'banana'\` 是否在 index 3 **之後**出現（第二次出現），存到 \`bananaAfter3\`
2. 使用負數 fromIndex：從倒數第 2 個開始找 \`'cherry'\`，存到 \`cherryInLast2\``,
        examples: [
          { input: `arr = ['apple','banana','cherry','banana','date']`, output: `bananaAfter3=true，cherryInLast2=false` },
        ],
        initialCode: `const arr = ['apple', 'banana', 'cherry', 'banana', 'date']

let bananaAfter3  // 從 index 3 開始，是否有 'banana'
let cherryInLast2 // 從倒數第 2 個開始，是否有 'cherry'
`,
        testCases: [
          { label: 'bananaAfter3 應為 true（index 3 有 banana）', test: `return bananaAfter3 === true` },
          { label: 'cherryInLast2 應為 false（最後 2 個是 banana,date）', test: `return cherryInLast2 === false` },
        ],
      },
      {
        id: 'includes-object-reference-trap',
        title: 'includes 對物件的陷阱',
        difficulty: 'hard',
        description: `\`includes\` 用 SameValueZero 比較，對物件是**參考比較**，不是深比較。
所以即使兩個物件內容相同，只要不是同一個參考，\`includes\` 就找不到。

請：
1. 對 \`users\` 用 \`includes(targetUser)\` 直接比較物件，存到 \`result1\`（應為 false，因為是新物件）
2. 用 \`some(u => u.id === targetUser.id)\` 改用 id 比較，存到 \`result2\`（應為 true）
3. 把 \`users[0]\` 存到 \`ref\`，對 \`users\` 用 \`includes(ref)\`，存到 \`result3\`（應為 true，因為是同一個參考）`,
        initialCode: `const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
]

const targetUser = { id: 1, name: 'Alice' }  // 內容相同但是新物件

let result1  // includes(targetUser)
let result2  // some(u => u.id === targetUser.id)
const ref = users[0]
let result3  // includes(ref)（同一個參考）
`,
        testCases: [
          { label: 'result1 應為 false（不同參考，即使內容相同）', test: `return result1 === false` },
          { label: 'result2 應為 true（用 id 比較）', test: `return result2 === true` },
          { label: 'result3 應為 true（同一個參考）', test: `return result3 === true` },
        ],
      },
    ],
  },
]

export function getMethodChallenge(slug: string): MethodEntry | undefined {
  return arrayMethodChallenges.find(e => e.slug === slug)
}

export function getAllMethodSlugs(): string[] {
  return arrayMethodChallenges.map(e => e.slug)
}

import { hasTsChallenge, getTsChallenge, tsChallenges } from './ts-challenges'

export function hasPracticeChallenge(slug: string): boolean {
  return arrayMethodChallenges.some(e => e.slug === slug) || hasTsChallenge(slug)
}

export function getPracticeChallenge(slug: string): MethodEntry | undefined {
  return arrayMethodChallenges.find(e => e.slug === slug) ?? getTsChallenge(slug)
}

export function getAllPracticeSlugs(): string[] {
  return [...arrayMethodChallenges.map(e => e.slug), ...tsChallenges.map(e => e.slug)]
}
