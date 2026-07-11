import type { MethodEntry } from './array-challenges'

export const tsChallenges: MethodEntry[] = [
  // ─── Type System ──────────────────────────────────────────────────────────
  {
    slug: 'ts-any-unknown',
    methodName: 'any vs unknown',
    title: 'any vs unknown',
    description: '了解 any 與 unknown 的型別安全差異，以及型別縮窄的正確用法。',
    subCategory: 'Type System',
    difficulty: 'medium',
    keyPoints: [
      'any 繞過所有型別檢查，讓你對值做任何操作，但失去型別安全保障。',
      'unknown 是 any 的安全替代品：可以接受任何值，但操作前必須先做型別縮窄。',
      '型別縮窄常見方法：typeof、instanceof、in 運算子，或自定義型別守衛函式。',
      '接收外部 API 或不確定型別的資料時，優先使用 unknown 而非 any。',
      '無法直接對 unknown 呼叫方法或做算術，編譯器會報錯，這正是它安全的地方。',
    ],
    notes: {
      title: 'any vs unknown',
      sections: [
        {
          heading: '核心差異',
          content: `| 特性 | \`any\` | \`unknown\` |
|------|--------|----------|
| 接受任何值 | ✅ | ✅ |
| 可直接操作 | ✅（繞過檢查） | ❌（需要縮窄） |
| 型別安全 | ❌ | ✅ |
| 推薦使用 | 盡量避免 | 處理不確定型別時 |`,
        },
        {
          heading: '程式碼範例',
          content: `\`\`\`ts
// any：可以直接做任何操作，但不安全
let a: any = '123'
a.toUpperCase()   // ✅ 不報錯
a.foo.bar.baz()   // ✅ 不報錯，但執行時會爆炸

// unknown：必須先縮窄才能操作
let u: unknown = '123'
u.toUpperCase()   // ❌ TypeScript 報錯

// 型別縮窄後才能使用
if (typeof u === 'string') {
  u.toUpperCase() // ✅ 現在安全了
}
\`\`\``,
        },
        {
          heading: '型別縮窄（Type Narrowing）',
          content: `\`\`\`ts
function process(val: unknown): string {
  if (typeof val === 'string') return val.toUpperCase()
  if (typeof val === 'number') return val.toFixed(2)
  if (val instanceof Date) return val.toISOString()
  return String(val)
}
\`\`\``,
        },
      ],
    },
    problems: [
      {
        id: 'any-unknown-1',
        title: '型別縮窄處理器',
        difficulty: 'easy',
        description: `實作 \`safeProcess(value)\` 函式，模擬處理 \`unknown\` 型別的安全方式：

- 如果 value 是 **字串**，回傳 \`value.toUpperCase()\`
- 如果 value 是 **數字**，回傳 \`value * 2\`
- 如果 value 是 **布林值**，回傳 \`!value\`
- 其他情況回傳 \`null\``,
        examples: [
          { input: `safeProcess('hello')`, output: `'HELLO'` },
          { input: `safeProcess(5)`, output: `10` },
          { input: `safeProcess(true)`, output: `false` },
          { input: `safeProcess({})`, output: `null` },
        ],
        initialCode: `function safeProcess(value) {
  // 用 typeof 做型別縮窄，對應 TypeScript 中處理 unknown 的模式

}`,
        testCases: [
          { label: `safeProcess('hello') 回傳 'HELLO'`, test: `return safeProcess('hello') === 'HELLO'` },
          { label: `safeProcess(5) 回傳 10`, test: `return safeProcess(5) === 10` },
          { label: `safeProcess(true) 回傳 false`, test: `return safeProcess(true) === false` },
          { label: `safeProcess(false) 回傳 true`, test: `return safeProcess(false) === true` },
          { label: `safeProcess({}) 回傳 null`, test: `return safeProcess({}) === null` },
          { label: `safeProcess(null) 回傳 null`, test: `return safeProcess(null) === null` },
        ],
      },
      {
        id: 'any-unknown-2',
        title: '安全 JSON 解析器',
        difficulty: 'medium',
        description: `實作 \`safeParseJSON(jsonStr)\` 函式，模擬使用 \`unknown\` 安全處理外部資料：

- 嘗試將 jsonStr 用 \`JSON.parse\` 解析
- 如果解析後是**物件**（且非 null、非陣列），回傳該物件
- 如果解析後是**陣列**，回傳 \`{ data: 解析結果 }\`
- 如果解析失敗或結果是基本型別，回傳 \`null\`

這模擬了在 TypeScript 中拿到 \`unknown\` 型別的 API 回應後做縮窄判斷的流程。`,
        examples: [
          { input: `safeParseJSON('{"name":"Alice"}')`, output: `{ name: 'Alice' }` },
          { input: `safeParseJSON('[1,2,3]')`, output: `{ data: [1,2,3] }` },
          { input: `safeParseJSON('"hello"')`, output: `null` },
          { input: `safeParseJSON('invalid')`, output: `null` },
        ],
        initialCode: `function safeParseJSON(jsonStr) {
  // 1. 用 try/catch 安全解析
  // 2. 用 typeof、Array.isArray 等做型別縮窄

}`,
        testCases: [
          { label: `解析物件回傳原物件`, test: `const r = safeParseJSON('{"name":"Alice"}'); return r && r.name === 'Alice'` },
          { label: `解析陣列回傳 { data: [...] }`, test: `const r = safeParseJSON('[1,2,3]'); return r && Array.isArray(r.data) && r.data.length === 3` },
          { label: `解析字串回傳 null`, test: `return safeParseJSON('"hello"') === null` },
          { label: `解析數字回傳 null`, test: `return safeParseJSON('42') === null` },
          { label: `解析失敗回傳 null`, test: `return safeParseJSON('invalid json') === null` },
          { label: `解析 null 回傳 null`, test: `return safeParseJSON('null') === null` },
        ],
      },
    ],
  },

  {
    slug: 'ts-type-interface',
    methodName: 'type vs interface',
    title: 'type vs interface',
    description: '比較 TypeScript 中 type alias 與 interface 的差異，以及各自的最佳使用場景。',
    subCategory: 'Type System',
    difficulty: 'medium',
    keyPoints: [
      'interface 只能描述物件結構；type 可以描述任何型別，包含聯合、交叉、元組、基本型別等。',
      'interface 支援宣告合併（Declaration Merging）：同名 interface 會自動合併；type 不支援。',
      'interface 和 type 都支援泛型，且都可以用 extends 做繼承或交叉。',
      '優先選擇 interface 來描述物件形狀，尤其是會被 class 實作或多處繼承的情況。',
      '需要聯合型別、元組、或描述函式簡寫時，選擇 type alias。',
    ],
    notes: {
      title: 'type vs interface',
      sections: [
        {
          heading: '主要差異對照',
          content: `| 功能 | \`interface\` | \`type\` |
|------|------------|-------|
| 描述物件 | ✅ | ✅ |
| 聯合型別 | ❌ | ✅ |
| 元組型別 | ❌ | ✅ |
| 宣告合併 | ✅ | ❌ |
| 繼承語法 | \`extends\` | \`&\` 交叉型別 |
| class 實作 | \`implements\` | \`implements\` |`,
        },
        {
          heading: '宣告合併（只有 interface）',
          content: `\`\`\`ts
interface User { name: string }
interface User { age: number }
// 自動合併為 { name: string; age: number }

// type 不行 ❌
type User = { name: string }
type User = { age: number }  // 報錯：重複識別符
\`\`\``,
        },
        {
          heading: '各自擅長的場景',
          content: `\`\`\`ts
// interface 適合物件契約
interface Repository<T> {
  findById(id: string): T | null
  save(entity: T): void
}

// type 適合聯合、元組等複雜型別
type Status = 'pending' | 'resolved' | 'rejected'
type Pair<T> = [T, T]
type EventHandler = (event: Event) => void
\`\`\``,
        },
      ],
    },
    problems: [
      {
        id: 'type-interface-1',
        title: '物件形狀驗證器',
        difficulty: 'easy',
        description: `實作 \`createUser(data)\` 函式，驗證並建立符合 User 介面形狀的物件：

User 必須有：
- \`name\`：非空字串
- \`age\`：正整數（大於 0）
- \`email\`：包含 \`@\` 的字串

如果 data 符合所有條件，回傳建立的 user 物件（只包含 name, age, email 三個欄位）；否則回傳 \`null\`。

這模擬 TypeScript 的 interface 在執行時做驗證的等效實作。`,
        examples: [
          { input: `createUser({ name: 'Alice', age: 30, email: 'alice@example.com' })`, output: `{ name: 'Alice', age: 30, email: 'alice@example.com' }` },
          { input: `createUser({ name: '', age: 30, email: 'alice@example.com' })`, output: `null` },
          { input: `createUser({ name: 'Bob', age: -1, email: 'bob@test.com' })`, output: `null` },
        ],
        initialCode: `function createUser(data) {
  // 驗證 data 是否符合 User interface 的形狀
  // name: 非空字串, age: 正整數, email: 含 @ 的字串

}`,
        testCases: [
          { label: '符合條件時回傳物件', test: `const r = createUser({ name: 'Alice', age: 30, email: 'alice@example.com' }); return r && r.name === 'Alice' && r.age === 30` },
          { label: '空 name 回傳 null', test: `return createUser({ name: '', age: 30, email: 'a@b.com' }) === null` },
          { label: '負數 age 回傳 null', test: `return createUser({ name: 'Bob', age: -1, email: 'b@c.com' }) === null` },
          { label: 'age 為 0 回傳 null', test: `return createUser({ name: 'Bob', age: 0, email: 'b@c.com' }) === null` },
          { label: 'email 無 @ 回傳 null', test: `return createUser({ name: 'Carol', age: 25, email: 'notanemail' }) === null` },
          { label: '回傳物件只含三個欄位', test: `const r = createUser({ name: 'Dave', age: 20, email: 'd@e.com', extra: 'x' }); return r && !('extra' in r) && 'name' in r && 'age' in r && 'email' in r` },
        ],
      },
      {
        id: 'type-interface-2',
        title: '介面組合（Intersection）',
        difficulty: 'medium',
        description: `實作 \`mergeShapes(a, b)\` 函式，模擬 TypeScript 的型別交叉（\`type C = A & B\`）在執行時的行為：

- 回傳一個新物件，包含 a 和 b 的所有屬性
- b 的屬性優先（如果 a 和 b 有同名屬性，取 b 的值）
- 不修改原始物件

再實作 \`pickShape(obj, keys)\`，模擬只取物件部分屬性（類似 TypeScript 的 Pick<T, K>）：
- 回傳一個只包含指定 keys 的新物件`,
        examples: [
          { input: `mergeShapes({ a: 1, b: 2 }, { b: 99, c: 3 })`, output: `{ a: 1, b: 99, c: 3 }` },
          { input: `pickShape({ name: 'Alice', age: 30, email: 'a@b.com' }, ['name', 'email'])`, output: `{ name: 'Alice', email: 'a@b.com' }` },
        ],
        initialCode: `function mergeShapes(a, b) {
  // 合併兩個物件，b 的屬性優先

}

function pickShape(obj, keys) {
  // 只取指定 keys 的屬性，回傳新物件

}`,
        testCases: [
          { label: 'mergeShapes 合併屬性', test: `const r = mergeShapes({ a: 1, b: 2 }, { b: 99, c: 3 }); return r.a === 1 && r.b === 99 && r.c === 3` },
          { label: 'mergeShapes 不修改原物件', test: `const a = { x: 1 }; mergeShapes(a, { y: 2 }); return a.y === undefined` },
          { label: 'pickShape 只取指定 keys', test: `const r = pickShape({ name: 'A', age: 30, email: 'a@b.com' }, ['name', 'email']); return 'name' in r && 'email' in r && !('age' in r)` },
          { label: 'pickShape 值正確', test: `const r = pickShape({ name: 'Alice', age: 30 }, ['name']); return r.name === 'Alice'` },
          { label: 'pickShape 回傳新物件', test: `const obj = { a: 1, b: 2 }; const r = pickShape(obj, ['a']); return r !== obj` },
        ],
      },
    ],
  },

  {
    slug: 'ts-generics',
    methodName: '泛型（Generics）',
    title: '泛型（Generics）',
    description: '學習使用泛型讓函式和型別支援多種型別，同時保持型別安全。',
    subCategory: 'Generics',
    difficulty: 'medium',
    keyPoints: [
      '泛型讓你寫出「型別參數化」的函式或類別，可以在呼叫時決定具體型別。',
      '語法：在函式名後加 <T>，T 就是型別參數，可以在參數和回傳值中使用。',
      '呼叫泛型函式時 TypeScript 通常可以自動推斷型別，不需要手動傳入 <T>。',
      'Array<T> 和 T[] 是等效的寫法，都代表元素型別為 T 的陣列。',
      '泛型解決了 any 繞過型別檢查的問題：讓函式接受任意型別的同時，保留型別資訊。',
    ],
    notes: {
      title: '泛型（Generics）',
      sections: [
        {
          heading: '基本語法',
          content: `\`\`\`ts
// 沒有泛型：失去型別資訊
function identity(x: any): any { return x }

// 有泛型：保留型別
function identity<T>(x: T): T { return x }

const s = identity('hello')  // s 是 string
const n = identity(42)       // n 是 number
\`\`\``,
        },
        {
          heading: '多個型別參數',
          content: `\`\`\`ts
function pair<A, B>(a: A, b: B): [A, B] {
  return [a, b]
}

const p = pair('name', 30)  // [string, number]
\`\`\``,
        },
        {
          heading: '泛型介面與型別',
          content: `\`\`\`ts
interface Box<T> {
  value: T
  map<U>(fn: (val: T) => U): Box<U>
}

type Result<T, E = Error> =
  | { ok: true; data: T }
  | { ok: false; error: E }
\`\`\``,
        },
      ],
    },
    problems: [
      {
        id: 'ts-generics-1',
        title: '泛型工具函式',
        difficulty: 'easy',
        description: `實作以下三個泛型風格的工具函式（JavaScript 等效實作）：

1. \`identity(x)\`：回傳原值（不改變）
2. \`swap(pair)\`：接受一個 [A, B] 的陣列，回傳 [B, A]（順序互換）
3. \`firstN(arr, n)\`：回傳陣列前 n 個元素的新陣列`,
        examples: [
          { input: `identity(42)`, output: `42` },
          { input: `swap(['hello', 99])`, output: `[99, 'hello']` },
          { input: `firstN([1,2,3,4,5], 3)`, output: `[1,2,3]` },
        ],
        initialCode: `function identity(x) {

}

function swap(pair) {
  // pair 是 [A, B]，回傳 [B, A]

}

function firstN(arr, n) {

}`,
        testCases: [
          { label: 'identity 回傳原值（數字）', test: `return identity(42) === 42` },
          { label: 'identity 回傳原值（字串）', test: `return identity('hello') === 'hello'` },
          { label: 'identity 回傳原值（物件引用）', test: `const o = {}; return identity(o) === o` },
          { label: 'swap 互換兩元素', test: `const r = swap(['hello', 99]); return r[0] === 99 && r[1] === 'hello'` },
          { label: 'swap 回傳新陣列', test: `const p = [1, 2]; return swap(p) !== p` },
          { label: 'firstN 回傳前 n 個', test: `const r = firstN([1,2,3,4,5], 3); return r.length === 3 && r[0] === 1 && r[2] === 3` },
          { label: 'firstN n 超過長度回傳全部', test: `return firstN([1,2], 10).length === 2` },
        ],
      },
      {
        id: 'ts-generics-2',
        title: '泛型容器（Box）',
        difficulty: 'medium',
        description: `實作 \`createBox(value)\` 工廠函式，回傳一個具有以下方法的 Box 物件，模擬泛型容器 \`Box<T>\`：

- \`getValue()\`：回傳儲存的值
- \`map(fn)\`：對值套用 fn，回傳一個新的 Box（不修改原 Box）
- \`flatMap(fn)\`：fn 接受值並回傳另一個 Box，flatMap 回傳該 Box（攤平一層）

最後實作 \`createResult(ok, payload)\` 建立 Result 物件：
- 若 ok 為 true：回傳 \`{ ok: true, data: payload }\`
- 若 ok 為 false：回傳 \`{ ok: false, error: payload }\``,
        examples: [
          { input: `createBox(5).getValue()`, output: `5` },
          { input: `createBox(5).map(x => x * 2).getValue()`, output: `10` },
          { input: `createBox(5).flatMap(x => createBox(x + 1)).getValue()`, output: `6` },
          { input: `createResult(true, { id: 1 })`, output: `{ ok: true, data: { id: 1 } }` },
        ],
        initialCode: `function createBox(value) {
  return {
    getValue() {

    },
    map(fn) {
      // 套用 fn，回傳新 Box
    },
    flatMap(fn) {
      // fn 回傳 Box，攤平一層
    },
  }
}

function createResult(ok, payload) {

}`,
        testCases: [
          { label: 'getValue 回傳原值', test: `return createBox(42).getValue() === 42` },
          { label: 'map 套用函式', test: `return createBox(5).map(x => x * 2).getValue() === 10` },
          { label: 'map 鏈式呼叫', test: `return createBox('a').map(s => s + 'b').map(s => s + 'c').getValue() === 'abc'` },
          { label: 'map 不修改原 Box', test: `const b = createBox(1); b.map(x => x + 1); return b.getValue() === 1` },
          { label: 'flatMap 攤平 Box', test: `return createBox(5).flatMap(x => createBox(x + 1)).getValue() === 6` },
          { label: 'createResult ok=true', test: `const r = createResult(true, 42); return r.ok === true && r.data === 42` },
          { label: 'createResult ok=false', test: `const r = createResult(false, 'err'); return r.ok === false && r.error === 'err'` },
        ],
      },
    ],
  },

  {
    slug: 'ts-generics-extends',
    methodName: 'extends 在泛型中的用途',
    title: 'extends 在泛型中的用途',
    description: '學習用 extends 為泛型加上型別約束，以及條件型別的基本概念。',
    subCategory: 'Generics',
    difficulty: 'hard',
    keyPoints: [
      '<T extends SomeType> 表示 T 必須符合 SomeType 的結構，即型別約束（Type Constraint）。',
      'keyof T 取得 T 所有屬性鍵的聯合型別；<K extends keyof T> 確保 K 是 T 的合法屬性。',
      '條件型別 T extends U ? X : Y 根據 T 是否可賦值給 U 來選擇型別。',
      'TypeScript 內建工具型別如 NonNullable<T>、ReturnType<T> 都是用條件型別實作的。',
      'extends 在泛型中用於約束；在條件型別中用於判斷；在 interface 中用於繼承——三種場合語意不同。',
    ],
    notes: {
      title: 'extends 在泛型中的用途',
      sections: [
        {
          heading: '型別約束（Type Constraint）',
          content: `\`\`\`ts
// 沒有約束：T 可以是任何東西
function log<T>(val: T) {
  console.log(val.name)  // ❌ 報錯：T 不一定有 name
}

// 有約束：確保 T 有 name 屬性
function log<T extends { name: string }>(val: T) {
  console.log(val.name)  // ✅
}
\`\`\``,
        },
        {
          heading: 'keyof 搭配 extends',
          content: `\`\`\`ts
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const user = { name: 'Alice', age: 30 }
getProperty(user, 'name')   // ✅ 回傳 string
getProperty(user, 'foo')    // ❌ 'foo' 不是 user 的屬性
\`\`\``,
        },
        {
          heading: '條件型別（Conditional Types）',
          content: `\`\`\`ts
type IsString<T> = T extends string ? 'yes' : 'no'
type A = IsString<string>   // 'yes'
type B = IsString<number>   // 'no'

// 內建工具型別的實作
type NonNullable<T> = T extends null | undefined ? never : T
type Result = NonNullable<string | null>  // string
\`\`\``,
        },
      ],
    },
    problems: [
      {
        id: 'ts-generics-extends-1',
        title: '型別約束的屬性存取',
        difficulty: 'medium',
        description: `實作以下函式，模擬 TypeScript 泛型約束（\`K extends keyof T\`）的執行時等效行為：

1. \`getProperty(obj, key)\`：安全取得物件屬性，若 key 不在 obj 中則拋出錯誤
2. \`pluck(arr, key)\`：從物件陣列中取出所有指定屬性的值，組成新陣列
3. \`hasRequiredFields(obj, fields)\`：檢查物件是否包含所有必要欄位（值不為 null/undefined），回傳布林值`,
        examples: [
          { input: `getProperty({ name: 'Alice', age: 30 }, 'name')`, output: `'Alice'` },
          { input: `pluck([{ id: 1, name: 'A' }, { id: 2, name: 'B' }], 'name')`, output: `['A', 'B']` },
          { input: `hasRequiredFields({ a: 1, b: 2 }, ['a', 'b'])`, output: `true` },
        ],
        initialCode: `function getProperty(obj, key) {
  // 若 key 不存在於 obj，拋出 Error

}

function pluck(arr, key) {
  // 從陣列每個物件取出 key 的值

}

function hasRequiredFields(obj, fields) {
  // 檢查所有 fields 在 obj 中都不是 null/undefined

}`,
        testCases: [
          { label: 'getProperty 取得現有屬性', test: `return getProperty({ name: 'Alice' }, 'name') === 'Alice'` },
          { label: 'getProperty 取得數字屬性', test: `return getProperty({ age: 30 }, 'age') === 30` },
          { label: 'getProperty 不存在的 key 拋出錯誤', test: `try { getProperty({ a: 1 }, 'b'); return false } catch(e) { return true }` },
          { label: 'pluck 取出陣列中的屬性值', test: `const r = pluck([{ id: 1, name: 'A' }, { id: 2, name: 'B' }], 'name'); return r[0] === 'A' && r[1] === 'B'` },
          { label: 'pluck 回傳正確長度', test: `return pluck([{ x: 1 }, { x: 2 }, { x: 3 }], 'x').length === 3` },
          { label: 'hasRequiredFields 全部有值', test: `return hasRequiredFields({ a: 1, b: 'x' }, ['a', 'b']) === true` },
          { label: 'hasRequiredFields 缺少欄位', test: `return hasRequiredFields({ a: 1 }, ['a', 'b']) === false` },
          { label: 'hasRequiredFields null 算缺少', test: `return hasRequiredFields({ a: null, b: 1 }, ['a', 'b']) === false` },
        ],
      },
      {
        id: 'ts-generics-extends-2',
        title: '條件邏輯過濾器',
        difficulty: 'hard',
        description: `實作模擬 TypeScript 條件型別的執行時等效函式：

1. \`filterByType(arr, type)\`：過濾陣列，只保留 \`typeof\` 等於 type 的元素（模擬條件型別過濾）
2. \`omitNullish(obj)\`：回傳去除所有 null 和 undefined 屬性的新物件（模擬 \`NonNullable<T>\`）
3. \`mapByCondition(arr, predicate, ifTrue, ifFalse)\`：對陣列每個元素，若 predicate(元素) 為 true 則套用 ifTrue，否則套用 ifFalse，回傳新陣列`,
        examples: [
          { input: `filterByType([1, 'a', 2, 'b', true], 'number')`, output: `[1, 2]` },
          { input: `omitNullish({ a: 1, b: null, c: 'x', d: undefined })`, output: `{ a: 1, c: 'x' }` },
          { input: `mapByCondition([1,2,3,4], x => x % 2 === 0, x => x * 10, x => x)`, output: `[1, 20, 3, 40]` },
        ],
        initialCode: `function filterByType(arr, type) {

}

function omitNullish(obj) {

}

function mapByCondition(arr, predicate, ifTrue, ifFalse) {

}`,
        testCases: [
          { label: 'filterByType 過濾數字', test: `const r = filterByType([1, 'a', 2, true], 'number'); return r.length === 2 && r[0] === 1 && r[1] === 2` },
          { label: 'filterByType 過濾字串', test: `const r = filterByType([1, 'a', 2, 'b'], 'string'); return r.length === 2 && r[0] === 'a'` },
          { label: 'omitNullish 移除 null', test: `const r = omitNullish({ a: 1, b: null }); return 'a' in r && !('b' in r)` },
          { label: 'omitNullish 移除 undefined', test: `const r = omitNullish({ a: 1, b: undefined }); return !('b' in r)` },
          { label: 'omitNullish 保留 0 和 false', test: `const r = omitNullish({ a: 0, b: false, c: null }); return r.a === 0 && r.b === false` },
          { label: 'mapByCondition 偶數 × 10', test: `const r = mapByCondition([1,2,3,4], x => x % 2 === 0, x => x * 10, x => x); return r[0] === 1 && r[1] === 20 && r[3] === 40` },
          { label: 'mapByCondition 奇數不變', test: `const r = mapByCondition([1,2,3], x => x > 1, x => 0, x => x); return r[0] === 1` },
        ],
      },
    ],
  },

  {
    slug: 'ts-enum-const',
    methodName: 'enum vs const',
    title: 'enum vs const',
    description: '比較 TypeScript enum 與 const 物件 + as const 的差異，了解何時各自適用。',
    subCategory: 'Type System',
    difficulty: 'medium',
    keyPoints: [
      'enum 在編譯後會產生一個 JavaScript 物件，佔用 bundle 空間；const enum 則直接內聯值，不產生物件。',
      'const 物件加上 as const 可達到類似 enum 的效果，且更接近純 JavaScript，有利於 tree-shaking。',
      '數字 enum 有一個危險：可以直接賦予任意數字而不報錯，字串 enum 則更安全。',
      'as const 讓物件的值被推斷為字面量型別（literal type），且所有屬性變成 readonly。',
      '現代 TypeScript 專案中，許多人偏好用 const 物件 + as const 取代 enum，讓程式碼更接近標準 JavaScript。',
    ],
    notes: {
      title: 'enum vs const',
      sections: [
        {
          heading: 'enum 的三種形式',
          content: `\`\`\`ts
// 數字 enum（預設）
enum Direction { Up, Down, Left, Right }  // Up=0, Down=1, ...

// 字串 enum
enum Status { Pending = 'PENDING', Done = 'DONE' }

// const enum（內聯，不產生物件）
const enum Color { Red = 'red', Blue = 'blue' }
\`\`\``,
        },
        {
          heading: 'const 物件 + as const',
          content: `\`\`\`ts
const STATUS = {
  Pending: 'PENDING',
  Done: 'DONE',
} as const

// 取得值的聯合型別
type StatusValue = typeof STATUS[keyof typeof STATUS]
// 'PENDING' | 'DONE'
\`\`\``,
        },
        {
          heading: '比較對照',
          content: `| | \`enum\` | \`const\` + \`as const\` |
|--|--------|---------------------|
| 執行時物件 | ✅ 會產生 | ✅ 普通 JS 物件 |
| Tree-shaking | ❌ 困難 | ✅ 容易 |
| 反向對映 | ✅（數字 enum） | ❌ |
| 字面量型別 | ✅ | ✅ |
| 純 JS 相容 | ❌ | ✅ |`,
        },
      ],
    },
    problems: [
      {
        id: 'ts-enum-const-1',
        title: '建立常數對映物件',
        difficulty: 'easy',
        description: `實作以下函式，模擬 TypeScript enum 與 const 物件的執行時行為：

1. \`createStatusMap()\`：回傳一個凍結的物件（\`Object.freeze\`），模擬 \`as const\` 的不可修改性，包含：
   - \`PENDING: 'pending'\`
   - \`ACTIVE: 'active'\`
   - \`INACTIVE: 'inactive'\`

2. \`isValidStatus(value)\`：檢查 value 是否是 StatusMap 中的合法值，回傳布林值

3. \`getStatusLabel(status)\`：根據 status 值回傳中文標籤：
   - \`'pending'\` → \`'待處理'\`
   - \`'active'\` → \`'進行中'\`
   - \`'inactive'\` → \`'已停用'\`
   - 其他 → \`'未知'\``,
        examples: [
          { input: `createStatusMap().PENDING`, output: `'pending'` },
          { input: `isValidStatus('active')`, output: `true` },
          { input: `isValidStatus('deleted')`, output: `false` },
          { input: `getStatusLabel('pending')`, output: `'待處理'` },
        ],
        initialCode: `function createStatusMap() {
  // 回傳凍結的物件，模擬 as const

}

function isValidStatus(value) {
  const STATUS = createStatusMap()
  // 檢查 value 是否是 STATUS 的合法值

}

function getStatusLabel(status) {

}`,
        testCases: [
          { label: 'STATUS.PENDING 是 "pending"', test: `return createStatusMap().PENDING === 'pending'` },
          { label: 'STATUS 是凍結的', test: `const s = createStatusMap(); try { s.PENDING = 'x' } catch(e) {} return s.PENDING === 'pending'` },
          { label: 'isValidStatus("active") 為 true', test: `return isValidStatus('active') === true` },
          { label: 'isValidStatus("inactive") 為 true', test: `return isValidStatus('inactive') === true` },
          { label: 'isValidStatus("deleted") 為 false', test: `return isValidStatus('deleted') === false` },
          { label: 'getStatusLabel pending 回傳待處理', test: `return getStatusLabel('pending') === '待處理'` },
          { label: 'getStatusLabel 未知回傳未知', test: `return getStatusLabel('xyz') === '未知'` },
        ],
      },
      {
        id: 'ts-enum-const-2',
        title: 'Flag 位元旗標（Bitfield）',
        difficulty: 'hard',
        description: `數字 enum 的常見用途之一是位元旗標（Bitfield），讓多個選項可以用 bitwise OR 組合在一起。

實作以下函式模擬這個模式：

1. \`createFlags()\`：回傳凍結的旗標物件：
   - \`READ: 1\`（二進位 001）
   - \`WRITE: 2\`（二進位 010）
   - \`EXECUTE: 4\`（二進位 100）

2. \`hasFlag(permissions, flag)\`：用 bitwise AND（\`&\`）檢查 permissions 是否包含 flag

3. \`combineFlags(...flags)\`：用 bitwise OR（\`|\`）合併多個旗標，回傳組合後的數字

4. \`describePermissions(permissions)\`：回傳包含所有已啟用旗標名稱的陣列，例如 \`['READ', 'WRITE']\``,
        examples: [
          { input: `hasFlag(3, 1)`, output: `true  // 3 = READ|WRITE，包含 READ` },
          { input: `hasFlag(4, 1)`, output: `false  // 4 = EXECUTE，不含 READ` },
          { input: `combineFlags(1, 4)`, output: `5  // READ|EXECUTE` },
          { input: `describePermissions(3)`, output: `['READ', 'WRITE']` },
        ],
        initialCode: `function createFlags() {

}

function hasFlag(permissions, flag) {

}

function combineFlags(...flags) {

}

function describePermissions(permissions) {
  const FLAGS = createFlags()
  // 回傳所有已啟用旗標的名稱陣列

}`,
        testCases: [
          { label: 'FLAGS.READ 是 1', test: `return createFlags().READ === 1` },
          { label: 'FLAGS.WRITE 是 2', test: `return createFlags().WRITE === 2` },
          { label: 'FLAGS.EXECUTE 是 4', test: `return createFlags().EXECUTE === 4` },
          { label: 'hasFlag(3, 1) READ in READ|WRITE', test: `return hasFlag(3, 1) === true` },
          { label: 'hasFlag(4, 1) READ not in EXECUTE', test: `return hasFlag(4, 1) === false` },
          { label: 'hasFlag(7, 4) EXECUTE in ALL', test: `return hasFlag(7, 4) === true` },
          { label: 'combineFlags(1, 4) 等於 5', test: `return combineFlags(1, 4) === 5` },
          { label: 'combineFlags(1, 2, 4) 等於 7', test: `return combineFlags(1, 2, 4) === 7` },
          { label: 'describePermissions(3) 含 READ 和 WRITE', test: `const r = describePermissions(3); return r.includes('READ') && r.includes('WRITE') && !r.includes('EXECUTE')` },
          { label: 'describePermissions(7) 含全部', test: `const r = describePermissions(7); return r.includes('READ') && r.includes('WRITE') && r.includes('EXECUTE')` },
        ],
      },
    ],
  },

  {
    slug: 'ts-function-overload',
    methodName: 'Function Overload',
    title: 'Function Overload（函式多載）',
    description: '學習 TypeScript 函式多載，讓函式根據不同參數型別回傳精確的型別。',
    subCategory: 'Function Types',
    difficulty: 'hard',
    keyPoints: [
      '函式多載讓你為同一個函式定義多個呼叫簽名，TypeScript 根據傳入參數選擇正確的型別。',
      '寫法：先列出多個簽名宣告，最後一個是實作簽名（Implementation Signature），實作必須相容所有簽名。',
      '實作簽名本身不可以從外部呼叫，外部只能用前面宣告的多載簽名。',
      '相較於聯合型別，多載可以建立「輸入 A 型別 → 輸出 X 型別、輸入 B 型別 → 輸出 Y 型別」的精確對應。',
      '如果所有多載的回傳型別相同，通常不需要多載，直接用聯合參數型別即可。',
    ],
    notes: {
      title: 'Function Overload',
      sections: [
        {
          heading: '基本語法',
          content: `\`\`\`ts
// 多載簽名宣告
function format(x: string): string
function format(x: number): string

// 實作簽名（外部不可直接呼叫此簽名）
function format(x: string | number): string {
  return typeof x === 'string' ? x.toUpperCase() : x.toFixed(2)
}

format('hello')  // ✅ 用第一個簽名
format(3.14)     // ✅ 用第二個簽名
\`\`\``,
        },
        {
          heading: '多載 vs 聯合型別',
          content: `\`\`\`ts
// 沒有多載：回傳型別是聯合，需要額外處理
function wrap(x: string | number): string[] | number[] {
  return typeof x === 'string' ? [x] : [x]
}
const r = wrap('a')  // string[] | number[] — 不精確

// 有多載：TypeScript 知道回傳什麼
function wrap(x: string): string[]
function wrap(x: number): number[]
function wrap(x: string | number): string[] | number[] {
  return typeof x === 'string' ? [x] : [x]
}
const r = wrap('a')  // string[] — 精確！
\`\`\``,
        },
        {
          heading: 'Method Overload（在 class 中）',
          content: `\`\`\`ts
class Formatter {
  format(x: string): string
  format(x: number): string
  format(x: string | number): string {
    return String(x)
  }
}
\`\`\``,
        },
      ],
    },
    problems: [
      {
        id: 'ts-function-overload-1',
        title: '多簽名格式化函式',
        difficulty: 'medium',
        description: `實作 \`smartFormat(input, option)\` 函式，根據輸入型別採用不同的格式化行為（模擬函式多載的執行時邏輯）：

- 若 input 是**字串**：
  - 若 option 是 \`'upper'\`，回傳 \`input.toUpperCase()\`
  - 若 option 是 \`'lower'\`，回傳 \`input.toLowerCase()\`
  - 若 option 是 \`'length'\`，回傳字串長度（數字）
  - 無 option：回傳 \`input.trim()\`

- 若 input 是**數字**：
  - 若 option 是 \`'round'\`，回傳 \`Math.round(input)\`
  - 若 option 是 \`'fixed'\`，回傳 \`input.toFixed(2)\`（字串）
  - 若 option 是 \`'double'\`，回傳 \`input * 2\`
  - 無 option：回傳 \`input\`

- 其他型別：回傳 \`null\``,
        examples: [
          { input: `smartFormat('  hello  ', 'upper')`, output: `'  HELLO  '` },
          { input: `smartFormat('  hello  ')`, output: `'hello'` },
          { input: `smartFormat(3.7, 'round')`, output: `4` },
          { input: `smartFormat(3.7, 'fixed')`, output: `'3.70'` },
        ],
        initialCode: `function smartFormat(input, option) {
  // 根據 input 型別和 option 選擇格式化方式

}`,
        testCases: [
          { label: 'string + upper', test: `return smartFormat('hello', 'upper') === 'HELLO'` },
          { label: 'string + lower', test: `return smartFormat('HELLO', 'lower') === 'hello'` },
          { label: 'string + length', test: `return smartFormat('hello', 'length') === 5` },
          { label: 'string 無 option 做 trim', test: `return smartFormat('  hi  ') === 'hi'` },
          { label: 'number + round', test: `return smartFormat(3.7, 'round') === 4` },
          { label: 'number + fixed 回傳字串', test: `return smartFormat(3.1, 'fixed') === '3.10'` },
          { label: 'number + double', test: `return smartFormat(5, 'double') === 10` },
          { label: 'number 無 option 回傳原值', test: `return smartFormat(42) === 42` },
          { label: '其他型別回傳 null', test: `return smartFormat(true) === null` },
        ],
      },
      {
        id: 'ts-function-overload-2',
        title: '通用事件發射器',
        difficulty: 'hard',
        description: `實作一個 \`createEmitter()\` 工廠函式，回傳一個簡易事件發射器，模擬函式多載在不同事件名稱下有不同 callback 型別的場景：

回傳物件需包含：
- \`on(event, callback)\`：註冊事件監聽器（同一事件可以有多個）
- \`emit(event, ...args)\`：觸發事件，呼叫所有該事件的監聽器，傳入 args
- \`off(event, callback)\`：移除指定的監聽器
- \`once(event, callback)\`：註冊只觸發一次的監聽器，觸發後自動移除`,
        examples: [
          { input: `const emitter = createEmitter()`, output: `` },
          { input: `emitter.on('data', (x) => console.log(x)); emitter.emit('data', 42)`, output: `// 呼叫 callback，印出 42` },
        ],
        initialCode: `function createEmitter() {
  const listeners = {}  // { eventName: [callback, ...] }

  return {
    on(event, callback) {

    },
    emit(event, ...args) {

    },
    off(event, callback) {

    },
    once(event, callback) {
      // 只觸發一次後自動移除
    },
  }
}`,
        testCases: [
          { label: 'on + emit 觸發 callback', test: `const e = createEmitter(); let r = 0; e.on('x', v => { r = v }); e.emit('x', 42); return r === 42` },
          { label: 'emit 傳入多個參數', test: `const e = createEmitter(); let sum = 0; e.on('add', (a, b) => { sum = a + b }); e.emit('add', 3, 7); return sum === 10` },
          { label: '同一事件可有多個監聽器', test: `const e = createEmitter(); let r = 0; e.on('x', () => r++); e.on('x', () => r++); e.emit('x'); return r === 2` },
          { label: 'off 移除監聽器', test: `const e = createEmitter(); let r = 0; const fn = () => r++; e.on('x', fn); e.off('x', fn); e.emit('x'); return r === 0` },
          { label: 'once 只觸發一次', test: `const e = createEmitter(); let r = 0; e.once('x', () => r++); e.emit('x'); e.emit('x'); return r === 1` },
          { label: '無監聽器的 emit 不報錯', test: `const e = createEmitter(); try { e.emit('noop'); return true } catch(err) { return false }` },
        ],
      },
    ],
  },
]

export function getTsChallenge(slug: string): MethodEntry | undefined {
  return tsChallenges.find(e => e.slug === slug)
}

export function hasTsChallenge(slug: string): boolean {
  return tsChallenges.some(e => e.slug === slug)
}
