import { config } from 'dotenv'
config({ path: '.env.local' })
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../lib/db/schema'
import { eq } from 'drizzle-orm'

const client = neon(process.env.DATABASE_URL!)
const db = drizzle(client, { schema })

interface NoteSeed {
  slug: string
  sections: { heading: string; content: string }[]
}

const notes: NoteSeed[] = [
  // ────────────────────────────────────────────────────────────────
  // Type System
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'ts-basic-types',
    sections: [
      {
        heading: 'TypeScript 獨有的型別：any / unknown / never / void',
        content: `JavaScript 沒有這四個型別，它們是 TypeScript 型別系統的核心。

| 型別 | 定義 | 能賦值給... | 能被...賦值 |
|------|------|------------|------------|
| \`any\` | 關閉型別檢查 | 任何型別 | 任何型別 |
| \`unknown\` | 安全的 any（Top Type） | 只有 any/unknown | 任何型別 |
| \`never\` | 永遠不存在的值（Bottom Type） | 任何型別 | 只有 never |
| \`void\` | 函式無意義回傳值 | 只有 undefined/void | undefined |

\`\`\`ts
let a: unknown = "hello"
// a.toUpperCase() ❌ 需要先縮窄
if (typeof a === "string") a.toUpperCase() // ✅

function fail(): never { throw new Error() }
function noReturn(): void { /* 不需要 return */ }
\`\`\``,
      },
      {
        heading: 'void vs undefined vs never 的差異',
        content: `三者容易混淆，但用途完全不同：

\`\`\`ts
// void：函式「沒有有意義的回傳值」，不代表型別是 undefined
function log(msg: string): void {
  console.log(msg)
  // 可以不寫 return，或寫 return undefined
}

// undefined：明確的 undefined 值型別
function getUndefined(): undefined {
  return undefined // 必須明確 return undefined
}

// never：函式「根本不會結束」
function throwError(msg: string): never {
  throw new Error(msg)
  // 這行之後的程式碼是 unreachable code
}
function infiniteLoop(): never {
  while (true) {}
}
\`\`\`

**選擇原則：**
- 函式不回傳值 → \`void\`
- 函式永遠拋出錯誤或無窮迴圈 → \`never\`
- 明確需要 undefined 值 → \`undefined\``,
      },
      {
        heading: 'null 和 undefined 在 strictNullChecks 下',
        content: `**關閉 strictNullChecks（不建議）：**
\`\`\`ts
let x: string = null      // ✅ null 是任何型別的子型別
let y: number = undefined // ✅
\`\`\`

**開啟 strictNullChecks（推薦）：**
\`\`\`ts
let x: string = null      // ❌ Type 'null' is not assignable to type 'string'
let y: string | null = null  // ✅ 明確宣告

// 使用前必須處理 null
function greet(name: string | null) {
  // name.toUpperCase() ❌
  if (name !== null) {
    name.toUpperCase() // ✅ 型別縮窄為 string
  }
  return name?.toUpperCase() ?? "Guest" // ✅ optional chaining + nullish
}
\`\`\``,
      },
      {
        heading: 'Top Type 和 Bottom Type',
        content: `**Top Type（頂型別）** — 任何值都可以賦值給它：
\`\`\`ts
let a: any = 1
let b: any = "hello"
let c: unknown = true
let d: unknown = { x: 1 }

// 差別：any 可以直接使用；unknown 需要先縮窄
let x: any = "hi"
x.toUpperCase() // ✅ any 不檢查

let y: unknown = "hi"
// y.toUpperCase() ❌
if (typeof y === "string") y.toUpperCase() // ✅
\`\`\`

**Bottom Type（底型別）** — 不可能有值：
\`\`\`ts
// never 可以賦值給任何型別（空集合是任何集合的子集）
function fail(): never { throw new Error() }
let n: string = fail() // ✅ never 可賦值給 string（理論上）

// 但沒有任何值能賦值給 never
let x: never = "hello" // ❌
let y: never = undefined // ❌
\`\`\``,
      },
    ],
  },

  {
    slug: 'ts-type-assertion',
    sections: [
      {
        heading: 'as 型別斷言的基本用法',
        content: `型別斷言告訴 TypeScript「我比你更清楚這個型別」，是純編譯期操作，不影響執行時。

\`\`\`ts
// 從 DOM 取得元素
const canvas = document.getElementById("canvas") as HTMLCanvasElement
// 沒有斷言的話，型別是 HTMLElement | null，無法存取 .getContext()
const ctx = canvas.getContext("2d")

// API 回應的型別
const data = response.json() as Promise<User[]>

// 角括號語法（在 .tsx 中不能用，會被誤解為 JSX）
const x = <string>someValue // ❌ 在 .tsx 中
const y = someValue as string // ✅ 在 .tsx 中
\`\`\`

**重要：型別斷言不做執行時轉換**
\`\`\`ts
const num = "hello" as unknown as number
// 型別是 number，但執行時值仍然是字串 "hello"
console.log(num + 1) // "hello1"（字串串接，不是加法）
\`\`\``,
      },
      {
        heading: '非空斷言 ! 和雙重斷言',
        content: `**非空斷言 !**
\`\`\`ts
// 告訴 TypeScript「這個值一定不是 null 或 undefined」
const el = document.getElementById("app")! // HTMLElement（移除 null）

// 鏈式使用
const name = user!.profile!.name

// ⚠️ 風險：如果值實際上是 null，執行時會拋出錯誤
// 使用前確保你真的知道值不會是 null/undefined
\`\`\`

**雙重斷言（繞過型別相容性限制）**
\`\`\`ts
// TypeScript 要求斷言的兩個型別有交集
// 若完全無關，直接斷言會報錯
const x = "hello" as number // ❌ 無交集

// 解法：先斷言為 unknown（頂型別，與任何型別相容），再斷言目標型別
const y = "hello" as unknown as number // ✅ 但非常危險

// 另一種寫法
const z = ("hello" as any) as number // ✅ 也是雙重斷言
\`\`\``,
      },
      {
        heading: 'as const 和 satisfies',
        content: `**as const — 縮窄為最窄的字面量型別**
\`\`\`ts
// 沒有 as const
const config = { env: "production", port: 3000 }
// type: { env: string; port: number }（寬泛）
config.env = "development" // ✅ 可修改

// 加上 as const
const config = { env: "production", port: 3000 } as const
// type: { readonly env: "production"; readonly port: 3000 }（最窄）
// config.env = "development" ❌ readonly

// 陣列也適用
const dirs = ["up", "down", "left", "right"] as const
// type: readonly ["up", "down", "left", "right"]
\`\`\`

**satisfies — 驗證型別但保留推斷的精確型別**
\`\`\`ts
type Colors = Record<string, string | number[]>

// 用 as 會失去精確型別
const palette = { red: [255, 0, 0] } as Colors
palette.red.map(x => x) // ❌ red 型別是 string | number[]，不能呼叫 .map

// 用 satisfies 驗證型別，但保留推斷的精確型別
const palette = { red: [255, 0, 0] } satisfies Colors
palette.red.map(x => x) // ✅ red 型別仍是 number[]
\`\`\``,
      },
      {
        heading: '何時用型別守衛取代斷言',
        content: `型別斷言是「相信我」；型別守衛是「真正檢查」。

\`\`\`ts
// ❌ 不安全的做法：直接斷言
function processInput(input: unknown) {
  const str = input as string
  return str.toUpperCase() // 如果 input 不是字串，執行時崩潰
}

// ✅ 安全的做法：型別守衛
function processInput(input: unknown) {
  if (typeof input === "string") {
    return input.toUpperCase() // 型別縮窄為 string，安全
  }
  throw new Error("Expected string")
}

// ✅ 自訂型別守衛
interface User { name: string; age: number }
function isUser(val: unknown): val is User {
  return typeof val === "object" && val !== null &&
    "name" in val && "age" in val
}
if (isUser(data)) {
  console.log(data.name) // ✅ 型別縮窄為 User
}
\`\`\`

**使用斷言的合理時機：**
- 處理 DOM API（getElementById 回傳值確定是特定元素時）
- 已做過執行時驗證但 TypeScript 無法推斷時
- 開發期快速原型，稍後補充型別守衛`,
      },
    ],
  },

  {
    slug: 'ts-union-intersection',
    sections: [
      {
        heading: '聯合型別 | 的語意與使用',
        content: `聯合型別表示值可以是多個型別之一（OR 關係）。

\`\`\`ts
// 基本用法
type ID = string | number
let id: ID = "abc" // ✅
id = 123           // ✅
id = true          // ❌

// 函式參數
function format(value: string | number) {
  // 只能使用 string 和 number 共有的方法
  value.toString() // ✅ 兩者都有
  // value.toUpperCase() ❌ 只有 string 有

  // 需要先縮窄
  if (typeof value === "string") {
    return value.toUpperCase()
  }
  return value.toFixed(2)
}

// 聯合型別的存取限制：只能用共有屬性
type A = { x: number; name: string }
type B = { y: number; name: string }
function f(val: A | B) {
  val.name // ✅ A 和 B 都有
  // val.x ❌ 只有 A 有
}
\`\`\``,
      },
      {
        heading: '交叉型別 & 的語意與使用',
        content: `交叉型別合併多個型別的所有成員（AND 關係）。

\`\`\`ts
// 基本用法
type A = { x: number; name: string }
type B = { y: number; age: number }
type C = A & B
// C 等同於 { x: number; name: string; y: number; age: number }

const obj: C = { x: 1, name: "Alice", y: 2, age: 30 } // ✅

// Mixin 模式：組合多個 interface
interface Serializable { serialize(): string }
interface Loggable { log(): void }
type SerializableUser = User & Serializable & Loggable

// 基本型別的交叉通常是 never
type Impossible = string & number // never
\`\`\`

**同名屬性型別衝突：**
\`\`\`ts
type X = { name: string }
type Y = { name: number }
type Z = X & Y
// Z.name 的型別是 string & number = never
// Z 型別可以宣告，但永遠無法建立符合的值

const z: Z = { name: ??? } // ❌ 任何值都不符合 never
\`\`\``,
      },
      {
        heading: '聯合 vs 交叉的選擇原則',
        content: `**選 | 聯合型別的情況：**
\`\`\`ts
// 表示多個狀態之一
type Status = "loading" | "success" | "error"

// 可接受多種輸入型別
function render(input: string | string[] | null) { ... }

// 可空型別
type Nullable<T> = T | null
type Optional<T> = T | undefined
\`\`\`

**選 & 交叉型別的情況：**
\`\`\`ts
// Mixin：物件需要同時符合多個介面
type AdminUser = User & Admin & AuditLog

// 擴充現有型別（不修改原型別）
type ExtendedRequest = Express.Request & { user: User; requestId: string }

// 精確型別（縮窄某個屬性）
type SpecificUser = User & { role: "admin" } // role 必須是 "admin"
\`\`\`

**記憶口訣：**
- \`|\` OR → 值是其中一個
- \`&\` AND → 值同時符合全部`,
      },
    ],
  },

  {
    slug: 'ts-literal-types',
    sections: [
      {
        heading: '字面量型別推斷：const vs let',
        content: `TypeScript 根據宣告方式決定型別的寬窄。

\`\`\`ts
// const：值不可變 → 推斷為最窄的字面量型別
const a = "hello"   // type: "hello"（字面量）
const b = 42        // type: 42
const c = true      // type: true

// let：值可變 → 推斷為較寬的基本型別
let x = "hello"     // type: string
let y = 42          // type: number
let z = true        // type: boolean

// 影響：
function greet(greeting: "hello" | "hi") { ... }
const g = "hello"
greet(g) // ✅ g 的型別是 "hello"，符合

let h = "hello"
greet(h) // ❌ h 的型別是 string，太寬，不符合
greet(h as "hello") // ✅ 用斷言，但不優雅
\`\`\``,
      },
      {
        heading: '字面量聯合型別取代 enum',
        content: `字面量聯合型別是替代 enum 的輕量方案。

\`\`\`ts
// enum 寫法（會產生執行時物件）
enum Direction { Up, Down, Left, Right }

// 字面量聯合寫法（純型別，無執行時開銷）
type Direction = "up" | "down" | "left" | "right"

function move(dir: Direction) {
  // TypeScript 知道 dir 只能是這四個值
  switch (dir) {
    case "up": ...
    case "down": ...
    // 若漏掉某個 case，default 分支會觸發
  }
}

// 常數物件 + as const（有執行時值，可以迭代）
const DIRECTIONS = ["up", "down", "left", "right"] as const
type Direction = typeof DIRECTIONS[number]
// 或
const STATUS = { Active: "active", Inactive: "inactive" } as const
type Status = typeof STATUS[keyof typeof STATUS] // "active" | "inactive"
\`\`\``,
      },
      {
        heading: 'as const 深度解析',
        content: `\`as const\` 將整個值凍結為最窄的字面量型別。

\`\`\`ts
// 物件
const config = {
  host: "localhost",
  port: 3000,
  options: { debug: true }
} as const
// type: {
//   readonly host: "localhost";
//   readonly port: 3000;
//   readonly options: { readonly debug: true };
// }

// 陣列 → 元組
const roles = ["admin", "user", "guest"] as const
// type: readonly ["admin", "user", "guest"]
type Role = typeof roles[number] // "admin" | "user" | "guest"

// 函式回傳值
function getConfig() {
  return { theme: "dark", lang: "zh" } as const
}
type Config = ReturnType<typeof getConfig>
// { readonly theme: "dark"; readonly lang: "zh" }

// 什麼時候用 as const？
// - 常數定義（替代 enum）
// - 設定物件（確保不被修改）
// - 需要字面量聯合型別時
\`\`\``,
      },
      {
        heading: 'Template Literal Types 基礎',
        content: `TypeScript 4.1+ 支援型別層面的模板字串。

\`\`\`ts
// 基本語法
type Greeting = \`Hello, \${string}\`
let g: Greeting = "Hello, World" // ✅
let h: Greeting = "Hi, World"    // ❌

// 聯合型別展開（笛卡爾積）
type Size = "sm" | "md" | "lg"
type Color = "red" | "blue"
type ClassName = \`btn-\${Size}-\${Color}\`
// "btn-sm-red" | "btn-sm-blue" | "btn-md-red" | "btn-md-blue" | "btn-lg-red" | "btn-lg-blue"

// 事件名稱生成
type EventName<T extends string> = \`on\${Capitalize<T>}\`
type ClickEvent = EventName<"click">  // "onClick"
type ChangeEvent = EventName<"change"> // "onChange"

// Getter 生成
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K]
}
type UserGetters = Getters<{ name: string; age: number }>
// { getName: () => string; getAge: () => number }
\`\`\``,
      },
    ],
  },

  {
    slug: 'ts-optional-readonly',
    sections: [
      {
        heading: '可選屬性 ? 的語意',
        content: `可選屬性讓屬性可以存在也可以不存在。

\`\`\`ts
interface Config {
  host: string    // 必填
  port?: number   // 可選：可以不存在
}

const c1: Config = { host: "localhost" }         // ✅ 沒有 port
const c2: Config = { host: "localhost", port: 3000 } // ✅ 有 port

// 可選屬性的型別：number | undefined
function setup(config: Config) {
  // config.port 的型別是 number | undefined
  const port = config.port ?? 3000 // 需要提供預設值
  const doubled = config.port * 2  // ❌ 可能是 undefined
}
\`\`\`

**可選屬性 vs 明確的 | undefined：**
\`\`\`ts
// 差別在「屬性是否必須存在」
interface A { name?: string }          // name 可以不存在
interface B { name: string | undefined } // name 必須存在（值可以是 undefined）

const a: A = {}                     // ✅
const b: B = {}                     // ❌ 缺少 name 屬性
const c: B = { name: undefined }    // ✅
\`\`\``,
      },
      {
        heading: 'readonly 的用途與限制',
        content: `readonly 是型別層面的限制，不影響執行時。

\`\`\`ts
interface Point {
  readonly x: number
  readonly y: number
}
const p: Point = { x: 1, y: 2 }
// p.x = 3 // ❌ 型別錯誤

// 但執行時可以繞過（這是已知的 TypeScript 限制）
(p as any).x = 3 // ✅ 執行時成功（因為 readonly 只是型別標注）

// 若需要真正的執行時不可變，使用 Object.freeze()
const p2 = Object.freeze({ x: 1, y: 2 })
// p2.x = 3 // 執行時靜默失敗（非 strict mode）或拋錯

// readonly 在 class 中：只能在宣告或 constructor 中賦值
class Circle {
  readonly radius: number
  constructor(r: number) {
    this.radius = r // ✅
  }
  setRadius(r: number) {
    // this.radius = r // ❌
  }
}
\`\`\``,
      },
      {
        heading: 'Readonly<T> 和 readonly 陣列',
        content: `**Readonly<T> Utility Type：**
\`\`\`ts
interface User { name: string; age: number }
type ReadonlyUser = Readonly<User>
// { readonly name: string; readonly age: number }

// 注意：Readonly<T> 是淺層的
interface Nested { user: User }
type ReadonlyNested = Readonly<Nested>
// { readonly user: User }（user 屬性 readonly，但 User 內部屬性仍可修改）

// 自訂深層 Readonly
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
}
\`\`\`

**readonly 陣列：**
\`\`\`ts
// 兩種寫法等效
const arr1: readonly number[] = [1, 2, 3]
const arr2: ReadonlyArray<number> = [1, 2, 3]

// 不能使用變動方法
// arr1.push(4)   ❌
// arr1.pop()     ❌
// arr1.sort()    ❌

// 可以使用非變動方法
arr1.map(x => x * 2)    // ✅
arr1.filter(x => x > 1) // ✅
arr1.slice(0, 2)         // ✅

// 函式接受 readonly 陣列，表示「我不會修改這個陣列」
function sum(nums: readonly number[]): number {
  return nums.reduce((a, b) => a + b, 0)
}
\`\`\``,
      },
    ],
  },

  {
    slug: 'ts-index-signature',
    sections: [
      {
        heading: '索引簽名的語法與用途',
        content: `索引簽名讓物件可以有任意鍵名（在型別層面）。

\`\`\`ts
// 字串索引
interface StringMap { [key: string]: string }
const map: StringMap = {}
map["foo"] = "bar"   // ✅
map["baz"] = 42      // ❌ number 不是 string

// 數字索引
interface NumberedList { [index: number]: string }
const list: NumberedList = ["a", "b", "c"]

// 常見用途
interface Cache<T> { [key: string]: T }
interface Headers { [name: string]: string | string[] }
\`\`\`

**與明確屬性同時使用（限制）：**
\`\`\`ts
interface Mixed {
  [key: string]: string | number // 所有值必須是 string | number
  name: string                    // ✅ string 是子型別
  count: number                   // ✅ number 是子型別
  active: boolean                 // ❌ boolean 不是 string | number 的子型別
}
\`\`\``,
      },
      {
        heading: 'Record<K, V> vs 索引簽名',
        content: `兩者在功能上相似，各有適用場景。

\`\`\`ts
// 索引簽名：鍵可以是任意 string
interface StringMap { [key: string]: number }

// Record<K, V>：鍵可以限制為特定字面量聯合
type ScoreMap = Record<"alice" | "bob" | "carol", number>
// 等同於 { alice: number; bob: number; carol: number }
// 若漏掉任何一個鍵，TypeScript 報錯

// Record 的底層實作（Mapped Type）
type Record<K extends string | number | symbol, V> = { [P in K]: V }

// 選擇原則：
// - 鍵在編譯時已知且固定 → Record<"a"|"b"|"c", V>
// - 鍵在執行時動態決定 → [key: string]: V 或 Record<string, V>
\`\`\`

**noUncheckedIndexedAccess 設定：**
\`\`\`ts
// 預設（關閉）：TypeScript 假設索引存取一定成功
const map: { [key: string]: number } = {}
const val = map["missing"] // 型別：number（但執行時是 undefined）

// 開啟 noUncheckedIndexedAccess：
const val2 = map["missing"] // 型別：number | undefined
val2.toFixed() // ❌ 必須先處理 undefined
\`\`\``,
      },
    ],
  },

  {
    slug: 'ts-tuple',
    sections: [
      {
        heading: '元組的基本語法與特性',
        content: `元組是「長度固定、每個位置有明確型別」的特殊陣列。

\`\`\`ts
// 基本宣告
type StringNumber = [string, number]
const pair: StringNumber = ["hello", 42]  // ✅
const bad: StringNumber = [42, "hello"]   // ❌ 型別順序錯誤
const short: StringNumber = ["hello"]     // ❌ 缺少第二個元素

// 解構
const [name, age] = pair
// name: string, age: number

// 具名元組（TypeScript 4.0+）
type RGB = [red: number, green: number, blue: number]
const red: RGB = [255, 0, 0]
// hover 時顯示名稱，更易讀

// 可選元組元素
type WithOptional = [string, number?]
const t1: WithOptional = ["hello"]        // ✅
const t2: WithOptional = ["hello", 42]    // ✅

// Rest elements
type StringsThenNumber = [...string[], number]
const t3: StringsThenNumber = [1]             // ✅
const t4: StringsThenNumber = ["a", "b", 1]  // ✅
\`\`\``,
      },
      {
        heading: '元組 vs 陣列，以及在 Hook 中的應用',
        content: `**元組 vs 陣列的核心差別：**
\`\`\`ts
// 陣列：均質（homogeneous），所有元素型別相同，長度不限
const arr: string[] = ["a", "b", "c", "d"]

// 元組：異質（heterogeneous），每個位置型別不同，長度固定
const tuple: [string, number, boolean] = ["hello", 42, true]

// TypeScript 的陣列方法在元組上依然有效
const [first, ...rest] = tuple
// first: string, rest: [number, boolean]
\`\`\`

**自訂 Hook 回傳元組的最佳實踐：**
\`\`\`ts
// ❌ 問題：TypeScript 推斷為陣列聯合型別
function useToggle(init: boolean) {
  const [on, setOn] = useState(init)
  return [on, setOn]
  // 推斷為 (boolean | Dispatch<SetStateAction<boolean>>)[]
  // setOn 的型別是 boolean | Dispatch<...>，無法正確使用
}

// ✅ 解法 1：明確標注回傳型別
function useToggle(init: boolean): [boolean, () => void] {
  const [on, setOn] = useState(init)
  const toggle = () => setOn(v => !v)
  return [on, toggle]
}

// ✅ 解法 2：as const
function useToggle(init: boolean) {
  const [on, setOn] = useState(init)
  return [on, () => setOn(v => !v)] as const
}
\`\`\``,
      },
    ],
  },

  {
    slug: 'ts-keyof-typeof',
    sections: [
      {
        heading: 'keyof：取得物件型別的所有鍵',
        content: `\`keyof T\` 取得型別 T 所有屬性鍵的聯合型別。

\`\`\`ts
interface User {
  id: number
  name: string
  email: string
}
type UserKey = keyof User // "id" | "name" | "email"

// 最常見的用法：配合泛型確保鍵名合法
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
const user: User = { id: 1, name: "Alice", email: "alice@example.com" }
getProperty(user, "name")   // ✅ 回傳型別 string
getProperty(user, "id")     // ✅ 回傳型別 number
getProperty(user, "phone")  // ❌ "phone" 不在 keyof User 中

// keyof 在索引簽名上：
interface NumberMap { [key: string]: number }
type K = keyof NumberMap // string | number（JS 允許數字索引）
\`\`\``,
      },
      {
        heading: 'typeof：取得值的型別',
        content: `\`typeof\` 在型別位置取得值的 TypeScript 型別（不是 JS 的 typeof）。

\`\`\`ts
// 從常數推斷型別
const config = { host: "localhost", port: 3000 }
type Config = typeof config // { host: string; port: number }

// 搭配 as const 得到精確型別
const config2 = { host: "localhost", port: 3000 } as const
type Config2 = typeof config2 // { readonly host: "localhost"; readonly port: 3000 }

// 從函式推斷型別
function createUser(name: string, age: number) {
  return { name, age, createdAt: new Date() }
}
type User = ReturnType<typeof createUser>
// { name: string; age: number; createdAt: Date }

// 從模組推斷型別
import * as utils from "./utils"
type Utils = typeof utils
\`\`\``,
      },
      {
        heading: 'keyof typeof 組合模式',
        content: `兩者組合是 TypeScript 中非常常見的模式。

\`\`\`ts
// 從常數物件取得鍵的聯合型別
const HTTP_STATUS = {
  OK: 200,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const

type StatusCode = typeof HTTP_STATUS[keyof typeof HTTP_STATUS]
// 200 | 404 | 500

type StatusKey = keyof typeof HTTP_STATUS
// "OK" | "NOT_FOUND" | "SERVER_ERROR"

// 實際應用：函式只接受合法的 status key
function getStatus(key: keyof typeof HTTP_STATUS) {
  return HTTP_STATUS[key]
}
getStatus("OK")       // ✅ 回傳 200
getStatus("INVALID")  // ❌ TypeScript 報錯

// 索引存取型別（Indexed Access Type）
type UserName = User["name"]  // string
type UserAge = User["age"]    // number
type UserNameOrAge = User["name" | "age"] // string | number
\`\`\``,
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // Type Narrowing
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'ts-type-narrowing',
    sections: [
      {
        heading: '常見的型別縮窄方式',
        content: `型別縮窄（Type Narrowing）讓 TypeScript 在特定分支中知道更精確的型別。

**typeof 縮窄（基本型別）：**
\`\`\`ts
function process(val: string | number | null) {
  if (typeof val === "string") {
    val.toUpperCase() // ✅ string
  } else if (typeof val === "number") {
    val.toFixed(2)    // ✅ number
  } else {
    val               // null
  }
}
// 注意：typeof null === "object"，無法用 typeof 區分 null 和物件
\`\`\`

**instanceof 縮窄（class 實例）：**
\`\`\`ts
function handleError(err: unknown) {
  if (err instanceof Error) {
    console.log(err.message) // ✅ Error 型別
  } else if (err instanceof TypeError) {
    console.log(err.stack)   // ✅ TypeError 型別
  }
}
\`\`\`

**in operator 縮窄（物件屬性）：**
\`\`\`ts
interface Fish { swim(): void }
interface Bird { fly(): void }

function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    animal.swim() // ✅ Fish 型別
  } else {
    animal.fly()  // ✅ Bird 型別
  }
}
\`\`\``,
      },
      {
        heading: '自訂型別守衛（Custom Type Guard）',
        content: `當內建縮窄方式不夠用時，自訂型別守衛讓你完全控制縮窄邏輯。

\`\`\`ts
// x is T 回傳型別語法
function isString(x: unknown): x is string {
  return typeof x === "string"
}

// 複雜物件的型別守衛
interface User { id: number; name: string }
function isUser(val: unknown): val is User {
  return (
    typeof val === "object" &&
    val !== null &&
    "id" in val && typeof (val as any).id === "number" &&
    "name" in val && typeof (val as any).name === "string"
  )
}

// 使用
const data: unknown = fetchUserData()
if (isUser(data)) {
  console.log(data.name) // ✅ User 型別，有自動完成
}

// Assertion Functions（TypeScript 3.7+）
function assert(condition: boolean, msg: string): asserts condition {
  if (!condition) throw new Error(msg)
}
function assertIsString(val: unknown): asserts val is string {
  if (typeof val !== "string") throw new Error("Not a string")
}

assertIsString(value)
value.toUpperCase() // ✅ value 縮窄為 string（函式正常返回即代表斷言成立）
\`\`\``,
      },
      {
        heading: '控制流分析（Control Flow Analysis）',
        content: `TypeScript 自動追蹤程式流，在不同分支中縮窄型別。

\`\`\`ts
function process(value: string | null) {
  // 早期 return 後，TypeScript 知道後續 value 不是 null
  if (value === null) return "default"

  value.toUpperCase() // ✅ value 縮窄為 string
}

// 賦值縮窄
let x: string | number = Math.random() > 0.5 ? "hello" : 42

if (typeof x === "string") {
  x = x.toUpperCase() // x 縮窄為 string
  // 賦值後 x 依然是 string
}
// 這裡 x 又回到 string | number

// 型別謂詞（多重縮窄）
function isNonEmpty<T>(arr: T[]): arr is [T, ...T[]] {
  return arr.length > 0
}

const items: string[] = getItems()
if (isNonEmpty(items)) {
  items[0].toUpperCase() // ✅ 縮窄為至少有一個元素的陣列
}
\`\`\``,
      },
    ],
  },

  {
    slug: 'ts-discriminated-union',
    sections: [
      {
        heading: '什麼是 Discriminated Union（判別聯合型別）',
        content: `讓 TypeScript 能精確縮窄複雜聯合型別的模式。

**三個條件：**
1. 每個成員都有「共同屬性」（discriminant）
2. 該屬性在每個成員中是不同的**字面量型別**
3. 透過判斷 discriminant 屬性，TypeScript 自動縮窄型別

\`\`\`ts
// Shape 例子（經典）
interface Circle {
  kind: "circle"  // discriminant
  radius: number
}
interface Rectangle {
  kind: "rectangle"  // discriminant
  width: number
  height: number
}
interface Triangle {
  kind: "triangle"  // discriminant
  base: number
  height: number
}
type Shape = Circle | Rectangle | Triangle

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2  // shape: Circle
    case "rectangle":
      return shape.width * shape.height   // shape: Rectangle
    case "triangle":
      return (shape.base * shape.height) / 2  // shape: Triangle
  }
}
\`\`\``,
      },
      {
        heading: 'Redux Action 的 Discriminated Union 應用',
        content: `Discriminated Union 是 Redux 型別安全的核心。

\`\`\`ts
// 定義 Action 型別
type Action =
  | { type: "INCREMENT"; payload: number }
  | { type: "DECREMENT"; payload: number }
  | { type: "RESET" }
  | { type: "SET_USER"; payload: User }

// Reducer 中每個 case 的型別自動縮窄
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "INCREMENT":
      // action: { type: "INCREMENT"; payload: number }
      return { ...state, count: state.count + action.payload }
    case "RESET":
      // action: { type: "RESET" }（沒有 payload）
      return initialState
    case "SET_USER":
      // action: { type: "SET_USER"; payload: User }
      return { ...state, user: action.payload }
    default:
      return state
  }
}

// Action Creator
const increment = (amount: number): Action => ({ type: "INCREMENT", payload: amount })
const reset = (): Action => ({ type: "RESET" })
\`\`\``,
      },
      {
        heading: '非同步狀態管理的 Discriminated Union',
        content: `\`\`\`ts
// 常見的三狀態非同步模式
type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string }

// 在 React 中使用
function UserProfile({ state }: { state: AsyncState<User> }) {
  switch (state.status) {
    case "idle":
      return <button>載入使用者</button>
    case "loading":
      return <Spinner />
    case "success":
      return <div>{state.data.name}</div>  // state.data: User ✅
    case "error":
      return <div>錯誤：{state.error}</div>  // state.error: string ✅
  }
}

// 型別守衛搭配 Discriminated Union
function isSuccess<T>(state: AsyncState<T>): state is Extract<AsyncState<T>, { status: "success" }> {
  return state.status === "success"
}
\`\`\``,
      },
    ],
  },

  {
    slug: 'ts-never-exhaustive',
    sections: [
      {
        heading: 'never 的特性：Bottom Type',
        content: `never 是型別系統中的「空集合」，是所有型別的子型別。

\`\`\`ts
// 1. 永遠拋出錯誤的函式
function fail(msg: string): never {
  throw new Error(msg)
}

// 2. 無窮迴圈
function loop(): never {
  while (true) {}
}

// 3. 無法到達的程式碼
function f(x: never) {
  // 這裡的程式碼永遠不會執行
}

// never 在型別運算中
type A = string | never      // string（never 是加法零元素）
type B = string & never      // never（never 是乘法零元素）
type C = never extends string ? true : false  // true（空集合是任何集合的子集）

// never 作為函式回傳型別的語意：
// void：函式有結束，但沒有有意義的回傳值
// never：函式根本不會正常結束
\`\`\``,
      },
      {
        heading: '窮舉檢查（Exhaustive Check）',
        content: `用 never 確保 switch/if-else 涵蓋所有可能情況。

\`\`\`ts
type Shape = "circle" | "square" | "triangle"

// assertNever 函式
function assertNever(x: never): never {
  throw new Error("Unexpected value: " + JSON.stringify(x))
}

function getArea(shape: Shape, size: number): number {
  switch (shape) {
    case "circle":
      return Math.PI * size ** 2
    case "square":
      return size ** 2
    case "triangle":
      return (size * size) / 2
    default:
      return assertNever(shape) // ✅ shape 型別是 never，編譯通過
  }
}

// 若新增 "hexagon" 到 Shape 但忘記加 case：
type Shape = "circle" | "square" | "triangle" | "hexagon"
// default 分支中 shape 型別是 "hexagon"，不是 never
// assertNever(shape) ❌ TypeScript 報錯！強迫你處理新 case
\`\`\``,
      },
      {
        heading: 'never 在條件型別和 Utility Types 中的應用',
        content: `\`\`\`ts
// Exclude 利用 never 過濾聯合型別
type Exclude<T, U> = T extends U ? never : T
// Exclude<string | number | boolean, string>
// = (string → never) | (number → number) | (boolean → boolean)
// = never | number | boolean
// = number | boolean

// NonNullable 利用 never 移除 null/undefined
type NonNullable<T> = T extends null | undefined ? never : T

// 過濾物件屬性（利用 never 鍵會被移除）
type OnlyFunctions<T> = {
  [K in keyof T as T[K] extends Function ? K : never]: T[K]
}
interface Obj {
  name: string
  greet: () => void
  age: number
  run: () => void
}
type FunctionKeys = OnlyFunctions<Obj>
// { greet: () => void; run: () => void }

// never 在型別守衛中
function processString(val: string | number | boolean) {
  if (typeof val === "string") {
    // val: string
  } else if (typeof val === "number") {
    // val: number
  } else if (typeof val === "boolean") {
    // val: boolean
  } else {
    const _exhaustive: never = val // ✅ 所有情況都處理了
  }
}
\`\`\``,
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // Advanced Types
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'ts-utility-types',
    sections: [
      {
        heading: 'Partial、Required、Readonly',
        content: `**Partial<T> — 所有屬性變可選**
\`\`\`ts
interface User { id: number; name: string; email: string }
type PartialUser = Partial<User>
// { id?: number; name?: string; email?: string }

// 常見用途：更新操作
function updateUser(id: number, patch: Partial<User>) { ... }
updateUser(1, { name: "Bob" }) // 只更新 name，不需要提供所有欄位
\`\`\`

**Required<T> — 所有屬性變必填（移除 ?）**
\`\`\`ts
interface Options { color?: string; size?: number }
type RequiredOptions = Required<Options>
// { color: string; size: number }
\`\`\`

**Readonly<T> — 所有屬性變唯讀**
\`\`\`ts
type ImmutableUser = Readonly<User>
// { readonly id: number; readonly name: string; readonly email: string }
\`\`\`

**底層實作（映射型別）：**
\`\`\`ts
type Partial<T> = { [K in keyof T]?: T[K] }
type Required<T> = { [K in keyof T]-?: T[K] }
type Readonly<T> = { readonly [K in keyof T]: T[K] }
\`\`\``,
      },
      {
        heading: 'Pick、Omit、Record',
        content: `**Pick<T, K> — 選取特定屬性**
\`\`\`ts
interface User { id: number; name: string; email: string; password: string }
type PublicUser = Pick<User, "id" | "name" | "email">
// { id: number; name: string; email: string }

// 底層實作
type Pick<T, K extends keyof T> = { [P in K]: T[P] }
\`\`\`

**Omit<T, K> — 排除特定屬性**
\`\`\`ts
type SafeUser = Omit<User, "password">
// { id: number; name: string; email: string }

// 底層實作（用 Pick + Exclude）
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
\`\`\`

**Record<K, V> — 建立字典型別**
\`\`\`ts
type RolePermission = Record<"admin" | "user" | "guest", string[]>
// { admin: string[]; user: string[]; guest: string[] }

const permissions: RolePermission = {
  admin: ["read", "write", "delete"],
  user: ["read", "write"],
  guest: ["read"],
}

// 動態字典
type Cache = Record<string, unknown>
const cache: Cache = {}
\`\`\``,
      },
      {
        heading: 'Exclude、Extract、NonNullable、ReturnType',
        content: `**Exclude<T, U> — 從 T 中移除可賦值給 U 的型別**
\`\`\`ts
type T = Exclude<string | number | boolean, string>
// number | boolean

type NoNull = Exclude<string | null | undefined, null | undefined>
// string
\`\`\`

**Extract<T, U> — 保留 T 中可賦值給 U 的型別**
\`\`\`ts
type T = Extract<string | number | boolean, string | number>
// string | number
\`\`\`

**NonNullable<T> — 移除 null 和 undefined**
\`\`\`ts
type T = NonNullable<string | null | undefined>
// string
// 底層：type NonNullable<T> = T extends null | undefined ? never : T
\`\`\`

**ReturnType<T> 和 Parameters<T>：**
\`\`\`ts
function createUser(name: string, age: number) {
  return { name, age, createdAt: new Date() }
}
type User = ReturnType<typeof createUser>
// { name: string; age: number; createdAt: Date }

type Params = Parameters<typeof createUser>
// [name: string, age: number]

// 其他常用的函式相關 Utility Types
type F = (x: string) => number
type R = ReturnType<F>      // number
type P = Parameters<F>      // [x: string]

// ConstructorParameters、InstanceType（用於 class）
type InstanceType<T extends new (...args: any) => any> = T extends new (...args: any) => infer R ? R : any
\`\`\``,
      },
    ],
  },

  {
    slug: 'ts-mapped-types',
    sections: [
      {
        heading: 'Mapped Types 基本語法',
        content: `映射型別透過遍歷現有型別的鍵來建立新型別。

\`\`\`ts
// 基本語法：[K in keyof T]
type Stringify<T> = {
  [K in keyof T]: string  // 所有屬性值都變成 string
}

interface User { id: number; name: string; active: boolean }
type StringUser = Stringify<User>
// { id: string; name: string; active: string }

// 保留原始值型別（複製型別）
type Copy<T> = {
  [K in keyof T]: T[K]  // T[K] 是索引存取型別
}

// 加上修飾符
type MyPartial<T> = { [K in keyof T]?: T[K] }       // 加可選
type MyReadonly<T> = { readonly [K in keyof T]: T[K] } // 加 readonly

// 移除修飾符
type MyRequired<T> = { [K in keyof T]-?: T[K] }           // 移除可選
type MyMutable<T> = { -readonly [K in keyof T]: T[K] }    // 移除 readonly
\`\`\``,
      },
      {
        heading: 'Key Remapping（as 子句）',
        content: `TypeScript 4.1+ 允許在映射型別中重命名鍵。

\`\`\`ts
// as 子句重命名鍵
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K]
}
type UserGetters = Getters<{ name: string; age: number }>
// { getName: () => string; getAge: () => number }

// as 結合條件型別過濾屬性（never 鍵會被移除）
type StringOnly<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K]
}
interface Mixed { name: string; age: number; email: string; active: boolean }
type StringProps = StringOnly<Mixed>
// { name: string; email: string }

// 自訂 Omit（使用 Key Remapping）
type MyOmit<T, Keys extends keyof T> = {
  [K in keyof T as K extends Keys ? never : K]: T[K]
}
\`\`\``,
      },
    ],
  },

  {
    slug: 'ts-conditional-types',
    sections: [
      {
        heading: '條件型別基本語法與應用',
        content: `條件型別在型別層面實現「如果...則...否則...」的邏輯。

\`\`\`ts
// 基本語法：T extends U ? X : Y
type IsString<T> = T extends string ? true : false
type A = IsString<string>  // true
type B = IsString<number>  // false

// 實際應用：Flatten（取得陣列元素型別）
type Flatten<T> = T extends Array<infer U> ? U : T
type F1 = Flatten<string[]>  // string
type F2 = Flatten<number>    // number（不是陣列，直接回傳）

// 內建 Utility Types 的實作
type NonNullable<T> = T extends null | undefined ? never : T
type Exclude<T, U> = T extends U ? never : T
type Extract<T, U> = T extends U ? T : never
\`\`\``,
      },
      {
        heading: '分配律（Distributive Conditional Types）',
        content: `當 T 是裸型別參數且傳入聯合型別時，條件型別自動分配。

\`\`\`ts
// 分配行為
type ToArray<T> = T extends any ? T[] : never
type A = ToArray<string | number>
// ToArray<string> | ToArray<number>
// = string[] | number[]

// 阻止分配：用方括號包裹
type ToArrayNoDist<T> = [T] extends [any] ? T[] : never
type B = ToArrayNoDist<string | number>
// (string | number)[]（把聯合當成整體）

// 為什麼需要阻止分配？
type IsNever<T> = T extends never ? true : false
type Test = IsNever<never>  // never（分配到每個 never 成員，結果是 never）

type IsNeverFixed<T> = [T] extends [never] ? true : false
type Test2 = IsNeverFixed<never>  // true ✅
\`\`\``,
      },
    ],
  },

  {
    slug: 'ts-infer',
    sections: [
      {
        heading: 'infer 的基本語法與用途',
        content: `\`infer\` 在條件型別中捕捉並命名某個型別位置的型別。

\`\`\`ts
// 基本語法：T extends SomeType<infer U> ? U : never
// infer U 在匹配成功時捕捉對應位置的型別

// ReturnType 的實作
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never
type Num = ReturnType<() => number>    // number
type Str = ReturnType<() => string[]>  // string[]

// Parameters 的實作
type Parameters<T> = T extends (...args: infer P) => any ? P : never
type P = Parameters<(x: string, y: number) => void>  // [x: string, y: number]

// PromiseType：取得 Promise 內層型別
type Awaited<T> = T extends Promise<infer U> ? U : T
type A = Awaited<Promise<string>>           // string
type B = Awaited<Promise<Promise<number>>>  // Promise<number>（非遞迴）

// 遞迴版本
type DeepAwaited<T> = T extends Promise<infer U> ? DeepAwaited<U> : T
type C = DeepAwaited<Promise<Promise<string>>>  // string
\`\`\``,
      },
      {
        heading: '進階 infer 用法',
        content: `\`\`\`ts
// 提取函式第一個參數
type FirstArg<T> = T extends (first: infer F, ...rest: any[]) => any ? F : never
type F = FirstArg<(x: string, y: number) => void>  // string

// 提取陣列第一個元素型別
type Head<T> = T extends [infer H, ...any[]] ? H : never
type H = Head<[string, number, boolean]>  // string

// 提取陣列其餘元素
type Tail<T> = T extends [any, ...infer Rest] ? Rest : never
type T = Tail<[string, number, boolean]>  // [number, boolean]

// Class 建構子的實例型別
type InstanceType<T extends new (...args: any[]) => any> =
  T extends new (...args: any[]) => infer R ? R : any

class MyClass { value = 42 }
type Instance = InstanceType<typeof MyClass>  // MyClass

// infer 只在 true 分支中可用
type Wrong<T> = T extends string ? number : infer U  // ❌ U 只能在 true 分支
type Correct<T> = T extends Promise<infer U> ? U : T  // ✅ U 在 true 分支
\`\`\``,
      },
    ],
  },

  {
    slug: 'ts-template-literal-types',
    sections: [
      {
        heading: 'Template Literal Types 語法',
        content: `\`\`\`ts
// 基本語法（和 JS 模板字串相同，但在型別層面）
type EventName = \`on\${"click" | "change" | "focus"}\`
// "onclick" | "onchange" | "onfocus"

// 笛卡爾積展開
type Axis = "x" | "y" | "z"
type Padding = "top" | "right" | "bottom" | "left"

type CSSPadding = \`padding-\${Padding}\`
// "padding-top" | "padding-right" | "padding-bottom" | "padding-left"

// 結合 keyof 生成 getter 名稱
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K]
}
type UserGetters = Getters<{ name: string; age: number }>
// { getName: () => string; getAge: () => number }

// 內建字串 Utility Types
type U = Uppercase<"hello">    // "HELLO"
type L = Lowercase<"HELLO">    // "hello"
type C = Capitalize<"hello">   // "Hello"
type NC = Uncapitalize<"Hello"> // "hello"
\`\`\``,
      },
      {
        heading: '結合 infer 解析字串型別',
        content: `\`\`\`ts
// 解析路由參數
type ExtractRouteParams<T extends string> =
  T extends \`\${infer _Start}:\${infer Param}/\${infer Rest}\`
    ? Param | ExtractRouteParams<Rest>
    : T extends \`\${infer _Start}:\${infer Param}\`
    ? Param
    : never

type Params = ExtractRouteParams<"/users/:id/posts/:postId">
// "id" | "postId"

// 解析 API 路徑
type GetAPIPath<T extends string> = T extends \`/api/\${infer Path}\` ? Path : never
type Path = GetAPIPath<"/api/users">  // "users"

// 事件名稱系統
type PropEventSource<T> = {
  on<K extends string & keyof T>(
    eventName: \`\${K}Changed\`,
    callback: (newValue: T[K]) => void
  ): void
}

declare function makeWatchedObject<T>(obj: T): T & PropEventSource<T>

const person = makeWatchedObject({ name: "Alice", age: 30 })
person.on("nameChanged", newName => {
  // newName: string（TypeScript 自動推斷）
})
\`\`\``,
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // Function Types
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'ts-function-types',
    sections: [
      {
        heading: '函式型別的兩種寫法',
        content: `\`\`\`ts
// 1. type alias 箭頭語法
type Add = (a: number, b: number) => number

// 2. interface call signature（可以定義多個多載）
interface Add {
  (a: number, b: number): number
  // 可以加其他屬性
  description: string
}

// 兩者的差別：
// type alias 更簡潔，適合簡單函式型別
// interface 可以同時有多個呼叫簽名（多載）和屬性

// Call Signature 範例
interface Formatter {
  (value: string): string
  locale: string  // 函式也可以有屬性
}

// Construct Signature（可以 new 的函式）
interface Constructor {
  new(name: string): MyClass
  new(name: string, age: number): MyClass  // 多個建構子簽名
}

// 使用 Construct Signature
function create<T>(ctor: new() => T): T {
  return new ctor()
}
\`\`\``,
      },
      {
        heading: '函式型別相容性（Structural Subtyping）',
        content: `TypeScript 的函式型別相容性規則可能出乎意料。

\`\`\`ts
// 參數數量：參數少的相容參數多的（可以忽略多餘參數）
type One = (x: number) => void
type Two = (x: number, y: string) => void

let f1: One = (x) => {}
let f2: Two = (x, y) => {}

f1 = f2  // ❌ Two 需要兩個參數，不能用在需要 One 的地方
f2 = f1  // ✅ One 只需要一個參數，可以用在需要 Two 的地方（忽略 y）

// 這就是為什麼 Array.forEach 的 callback 可以忽略參數：
[1, 2, 3].forEach((item) => console.log(item))      // ✅ 忽略 index, array
[1, 2, 3].forEach((item, index) => console.log(item, index)) // ✅

// 回傳型別：協變（covariant）— 子型別相容父型別
type GetAnimal = () => Animal
type GetDog = () => Dog  // Dog extends Animal

let getAnimal: GetAnimal = () => new Animal()
let getDog: GetDog = () => new Dog()

getAnimal = getDog  // ✅ Dog 是 Animal 的子型別
getDog = getAnimal  // ❌ Animal 不一定是 Dog
\`\`\``,
      },
    ],
  },

  {
    slug: 'ts-optional-default-params',
    sections: [
      {
        heading: '可選參數 vs 預設參數',
        content: `\`\`\`ts
// 可選參數：型別是 T | undefined，呼叫端可以省略
function greet(name: string, greeting?: string) {
  // greeting 的型別是 string | undefined
  const g = greeting ?? "Hello"  // 需要提供預設值
  return \`\${g}, \${name}!\`
}
greet("Alice")           // ✅
greet("Alice", "Hi")     // ✅
greet("Alice", undefined) // ✅

// 預設參數：有預設值，型別從預設值推斷（通常是 T，不包含 undefined）
function greet2(name: string, greeting = "Hello") {
  // greeting 的型別是 string（有預設值保證）
  return \`\${greeting}, \${name}!\`
}
greet2("Alice")             // ✅ greeting = "Hello"
greet2("Alice", "Hi")       // ✅
greet2("Alice", undefined)  // ✅ 也接受 undefined（使用預設值）

// 位置限制：可選參數必須在必填參數後
function f(a?: number, b: string) {}  // ❌
function g(a: number, b?: string) {}  // ✅
\`\`\``,
      },
      {
        heading: 'Rest Parameters 和 Variadic Tuple Types',
        content: `\`\`\`ts
// Rest parameters
function sum(...numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0)
}
sum()          // ✅ 0 個參數
sum(1, 2, 3)  // ✅ 多個參數

// Spread 呼叫
const nums = [1, 2, 3] as const
sum(...nums)  // ✅

// Variadic Tuple Types（TypeScript 4.0+）
function concat<T extends unknown[], U extends unknown[]>(
  a: T, b: U
): [...T, ...U] {
  return [...a, ...b]
}
const result = concat([1, 2], ["a", "b"])
// 型別：[number, number, string, string]

// Rest 放在元組中間
type Middle = [string, ...number[], boolean]
const m1: Middle = ["hi", true]         // ✅
const m2: Middle = ["hi", 1, 2, 3, true] // ✅

// 函式的 rest 參數標注為元組
function foo(...args: [string, number]) {}
foo("hello", 42)   // ✅
foo("hello")       // ❌ 需要兩個參數
\`\`\``,
      },
    ],
  },

  {
    slug: 'ts-this-parameter',
    sections: [
      {
        heading: 'this 參數的語法與用途',
        content: `TypeScript 允許在函式參數列表第一個位置宣告 this 的型別。

\`\`\`ts
// 沒有 this 參數（開啟 noImplicitThis 時報錯）
function greet() {
  return \`Hello, \${this.name}\`  // ❌ 'this' implicitly has type 'any'
}

// 有 this 參數
interface User { name: string; age: number }
function greet(this: User) {
  return \`Hello, \${this.name}\`  // ✅
}

// 使用時必須在正確的上下文
const user: User = { name: "Alice", age: 30 }
const boundGreet = greet.bind(user)
boundGreet()              // ✅
user.greet = greet
user.greet()              // ✅
greet()                   // ❌ this 不是 User

// this 參數在編譯後會被移除（不影響實際參數）
// TypeScript: function greet(this: User, msg: string) {}
// JavaScript: function greet(msg) {}
\`\`\``,
      },
      {
        heading: 'noImplicitThis 和 ThisType<T>',
        content: `\`\`\`ts
// noImplicitThis 設定（strict 的一部分）
// 開啟後，若函式使用 this 但無法推斷型別，TypeScript 報錯

// 箭頭函式：詞法 this，不能有 this 參數
const obj = {
  value: 42,
  arrow: () => {
    // this 是外層作用域的 this，不是 obj
    // 不能宣告 this 參數
  },
  method() {
    // this 是 obj，可以使用 this
    return this.value
  }
}

// ThisType<T>：讓物件字面量中的方法知道 this 的型別
type ObjectDescriptor<D, M> = {
  data?: D
  methods?: M & ThisType<D & M>  // this 型別 = D & M
}

function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
  const data = desc.data ?? {} as D
  const methods = desc.methods ?? {} as M
  return { ...data, ...methods }
}

const obj2 = makeObject({
  data: { name: "Alice" },
  methods: {
    greet() {
      return \`Hello, \${this.name}\` // ✅ this.name 有型別（string）
    }
  }
})
\`\`\``,
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // Class & OOP
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'ts-class-modifiers',
    sections: [
      {
        heading: '存取修飾子：public / private / protected',
        content: `\`\`\`ts
class BankAccount {
  public owner: string          // 任何地方可存取（預設）
  private balance: number       // 只有 BankAccount 內部
  protected accountNumber: string  // BankAccount 和子 class

  constructor(owner: string, balance: number) {
    this.owner = owner
    this.balance = balance
    this.accountNumber = this.generateAccountNumber()
  }

  private generateAccountNumber(): string {
    return Math.random().toString(36).slice(2)
  }

  protected getBalance() { return this.balance }

  public deposit(amount: number) {
    this.balance += amount  // ✅ 在 class 內部
  }
}

class SavingsAccount extends BankAccount {
  constructor(owner: string, balance: number) {
    super(owner, balance)
    // this.balance ❌ private，子 class 不能存取
    this.getBalance()          // ✅ protected，子 class 可以
    this.accountNumber        // ✅ protected
  }
}

const acc = new BankAccount("Alice", 1000)
acc.owner     // ✅ public
// acc.balance ❌ private
// acc.accountNumber ❌ protected（外部不能存取）
\`\`\``,
      },
      {
        heading: 'TypeScript private vs JavaScript # private field',
        content: `兩種私有語法的本質差別。

\`\`\`ts
class A {
  private tsPrivate = 1         // TypeScript private（編譯期限制）
  #jsPrivate = 2                // JavaScript private field（執行時限制）
}

const a = new A()
// a.tsPrivate   ❌ 型別錯誤
;(a as any).tsPrivate  // ✅ 執行時可以存取（繞過型別系統）

// a.#jsPrivate   ❌ 語法錯誤（連 as any 也無法存取）

// TS private 和 JS private field 不能互換：
class B {
  #value = 1
  getValue(): number { return this.#value }
}

// 子 class 和 TS private：
class Parent { private x = 1 }
class Child extends Parent {
  // this.x ❌ private 子 class 不能存取
}

// JS private field 不被繼承（更嚴格）
class Parent2 { #x = 1 }
class Child2 extends Parent2 {
  // 無法存取 #x（即使同名也是不同欄位）
}
\`\`\``,
      },
      {
        heading: 'Parameter Properties 和 Static',
        content: `**Parameter Properties（建構子簡寫）：**
\`\`\`ts
// 傳統寫法（冗長）
class User {
  public name: string
  private age: number
  readonly id: number

  constructor(name: string, age: number, id: number) {
    this.name = name
    this.age = age
    this.id = id
  }
}

// Parameter Properties（簡潔）
class User {
  constructor(
    public name: string,
    private age: number,
    readonly id: number
  ) {}
  // 自動宣告屬性並賦值！
}

// 可以和普通參數混用
class Product {
  constructor(
    public name: string,
    public price: number,
    currency: string  // 沒有修飾子，只是普通參數，不創建屬性
  ) {
    this.name = \`\${name} (\${currency})\`  // 普通用法
  }
}
\`\`\`

**Static 靜態成員：**
\`\`\`ts
class Config {
  static readonly VERSION = "1.0.0"
  static defaultTimeout = 5000

  static create(): Config { return new Config() }

  private constructor() {}  // 私有建構子，只能用 Config.create()
}

Config.VERSION    // "1.0.0"
Config.create()   // Config 實例
new Config()      // ❌ 建構子是 private
\`\`\``,
      },
    ],
  },

  {
    slug: 'ts-abstract-class',
    sections: [
      {
        heading: '抽象類別的定義與特性',
        content: `\`\`\`ts
abstract class Animal {
  // 抽象屬性（子 class 必須提供）
  abstract readonly species: string

  // 抽象方法（子 class 必須實作）
  abstract makeSound(): string

  // 具體方法（子 class 繼承，可以選擇覆寫）
  move(distance = 0) {
    console.log(\`\${this.species} moved \${distance}m\`)
  }

  // 具體屬性
  protected energy = 100
}

// ❌ 不能直接 new 抽象類別
// const a = new Animal()

// ✅ 必須繼承並實作所有抽象成員
class Dog extends Animal {
  readonly species = "Canis lupus familiaris"

  makeSound() {
    return "Woof!"
  }
  // move() 繼承自 Animal，不需要重新實作
}

class Cat extends Animal {
  readonly species = "Felis catus"
  makeSound() { return "Meow!" }
  // 可以覆寫 move
  move(distance = 0) {
    console.log(\`Cat sneaked \${distance}m\`)
  }
}
\`\`\``,
      },
      {
        heading: 'abstract class vs interface 的選擇',
        content: `\`\`\`ts
// Interface：純型別契約，無實作，class 可以 implements 多個
interface Serializable {
  serialize(): string
}
interface Printable {
  print(): void
}
class Document implements Serializable, Printable {
  serialize() { return JSON.stringify(this) }
  print() { console.log(this) }
}

// Abstract Class：有部分實作，class 只能 extends 一個
abstract class BaseRepository<T> {
  abstract findById(id: number): Promise<T | null>
  abstract save(entity: T): Promise<void>

  // 共用實作
  async findOrThrow(id: number): Promise<T> {
    const entity = await this.findById(id)
    if (!entity) throw new Error(\`Entity \${id} not found\`)
    return entity
  }
}

class UserRepository extends BaseRepository<User> {
  async findById(id: number) { /* 資料庫查詢 */ }
  async save(user: User) { /* 資料庫儲存 */ }
}

// 選擇原則：
// 需要共用實作 → abstract class
// 需要多重繼承 → interface（可以 implements 多個）
// 純描述形狀 → interface
// 需要建構子邏輯或 private 成員 → abstract class
\`\`\``,
      },
    ],
  },

  {
    slug: 'ts-implements-vs-extends',
    sections: [
      {
        heading: 'implements vs extends 核心差別',
        content: `\`\`\`ts
// extends：繼承實作 + 型別（class 只能 extends 一個）
class Animal {
  eat() { console.log("eating") }
  breathe() { console.log("breathing") }
}

class Dog extends Animal {
  bark() { console.log("woof") }
  // 繼承 eat() 和 breathe()，不需要重新實作
}

const dog = new Dog()
dog.eat()    // ✅ 繼承自 Animal
dog.bark()   // ✅ Dog 自己的方法

// implements：只繼承型別契約（class 必須自行實作所有方法）
interface Swimmer { swim(): void }
interface Flyer { fly(): void }

class Duck implements Swimmer, Flyer {
  swim() { console.log("swimming") }  // 必須實作
  fly() { console.log("flying") }     // 必須實作
  // 不繼承任何實作
}

// 同時使用
class FlyingDog extends Animal implements Flyer {
  fly() { console.log("flying dog!") }
  // eat() 和 breathe() 繼承自 Animal
}
\`\`\``,
      },
      {
        heading: 'interface extends interface',
        content: `\`\`\`ts
// interface 可以 extends 多個 interface
interface Animal {
  name: string
  eat(): void
}
interface Pet {
  owner: string
  play(): void
}

// 繼承多個 interface
interface PetAnimal extends Animal, Pet {
  vaccinated: boolean
}

// 實作必須提供所有繼承的屬性和方法
class Dog implements PetAnimal {
  name = "Rex"
  owner = "Alice"
  vaccinated = true
  eat() { }
  play() { }
}

// interface 也可以 extends class（罕見但合法）
class Control {
  private state: boolean = false
}
interface SelectableControl extends Control {
  select(): void
}
// 注意：extends class 會繼承 class 的所有成員型別，包括 private
// 只有 Control 的子 class 才能 implements SelectableControl

// type 用 & 達到類似效果（但不是繼承）
type PetAnimal2 = Animal & Pet & { vaccinated: boolean }
\`\`\``,
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // Module & Declaration
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'ts-declaration-files',
    sections: [
      {
        heading: '.d.ts 文件的結構與用途',
        content: `.d.ts 文件只包含型別宣告，沒有任何執行時程式碼。

\`\`\`ts
// mylib.d.ts（為 mylib.js 提供型別）

// 宣告模組
declare module "mylib" {
  export function greet(name: string): string
  export class MyClass {
    constructor(value: number)
    getValue(): number
  }
  export interface Options {
    timeout?: number
    retries?: number
  }
  export const VERSION: string
  export default function(): void
}

// 宣告全域變數（影響整個 TypeScript 專案）
declare const __DEV__: boolean
declare function require(path: string): any
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test"
    DATABASE_URL: string
  }
}

// 宣告擴充現有模組
declare module "express" {
  interface Request {
    user?: { id: string; role: string }
  }
}
\`\`\``,
      },
      {
        heading: '@types/ 套件和 TypeScript 的型別查找',
        content: `**TypeScript 查找型別的順序：**

1. 套件的 \`package.json\` 中 \`"types"\` 或 \`"typings"\` 欄位
2. 套件目錄中的 \`index.d.ts\`
3. 在 \`@types/\` 目錄下查找（如 \`@types/react\`）

\`\`\`bash
# 安裝型別宣告套件
npm install --save-dev @types/lodash
npm install --save-dev @types/node
npm install --save-dev @types/react @types/react-dom
\`\`\`

**為沒有型別的套件手動添加：**
\`\`\`ts
// 方法 1：在 src/types/ 目錄建立 .d.ts 文件
// src/types/untyped-lib.d.ts
declare module "untyped-lib" {
  export function doSomething(x: string): number
  export interface Config { debug?: boolean }
}

// 方法 2：快速但粗糙（讓整個套件型別是 any）
declare module "untyped-lib"

// tsconfig.json 需要設定 typeRoots（若不在預設位置）
{
  "compilerOptions": {
    "typeRoots": ["./node_modules/@types", "./src/types"]
  }
}
\`\`\``,
      },
    ],
  },

  {
    slug: 'ts-module-augmentation',
    sections: [
      {
        heading: 'Module Augmentation 語法',
        content: `在不修改原始套件的情況下擴充其型別定義。

\`\`\`ts
// src/types/express.d.ts
import "express"  // ⚠️ 必須 import，讓此文件成為「模組」而非「腳本」

declare module "express" {
  interface Request {
    user?: {
      id: string
      role: "admin" | "user"
    }
    requestId: string
  }
}

// 使用後，express 的 Request 型別自動包含 user 和 requestId
import { Request, Response } from "express"

app.get("/profile", (req: Request, res: Response) => {
  if (req.user) {
    res.json({ userId: req.user.id }) // ✅ TypeScript 知道 user 的型別
  }
})
\`\`\``,
      },
      {
        heading: 'Global Augmentation 擴充全域型別',
        content: `\`\`\`ts
// 擴充 Window 型別（瀏覽器全域）
declare global {
  interface Window {
    myAnalytics: {
      track(event: string, data?: object): void
    }
    __REDUX_DEVTOOLS_EXTENSION__?: () => any
  }
}

// 使用
window.myAnalytics.track("page_view") // ✅

// 擴充 Array prototype（謹慎使用）
declare global {
  interface Array<T> {
    unique(): T[]
    groupBy<K extends string>(keyFn: (item: T) => K): Record<K, T[]>
  }
}
// 宣告後，TypeScript 知道 [].unique() 的型別
// 但仍需要在執行時實際添加這些方法！

// Vue 2：擴充 Vue 實例型別
declare module "vue/types/vue" {
  interface Vue {
    $http: AxiosInstance
    $toast: ToastPlugin
  }
}
// 使用後 this.$http 有型別
\`\`\`

**注意事項：**
- Module Augmentation 只能**新增**成員，不能**修改**或**刪除**現有成員
- 文件必須有至少一個 \`import\` 或 \`export\`，否則是腳本（宣告進入全域）
- 使用 \`declare global { }\` 在模組文件中做全域擴充`,
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // Config & Engineering
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'ts-strict-mode',
    sections: [
      {
        heading: 'strict: true 包含的所有選項',
        content: `\`strict: true\` 是一個快捷鍵，等同於同時開啟多個選項：

\`\`\`json
{
  "compilerOptions": {
    "strict": true
    // 等同於：
    // "strictNullChecks": true,
    // "noImplicitAny": true,
    // "strictFunctionTypes": true,
    // "strictBindCallApply": true,
    // "strictPropertyInitialization": true,
    // "noImplicitThis": true,
    // "alwaysStrict": true,
    // "useUnknownInCatchVariables": true（TypeScript 4.4+）
  }
}
\`\`\`

**各選項的作用：**

| 選項 | 效果 |
|------|------|
| \`strictNullChecks\` | null/undefined 不再是所有型別的子型別 |
| \`noImplicitAny\` | 隱式 any 報錯 |
| \`strictFunctionTypes\` | 函式參數逆變型別檢查 |
| \`strictBindCallApply\` | bind/call/apply 的型別安全 |
| \`strictPropertyInitialization\` | class 屬性必須在建構子中初始化 |
| \`noImplicitThis\` | 隱式 any 的 this 報錯 |
| \`useUnknownInCatchVariables\` | catch 變數型別為 unknown |`,
      },
      {
        heading: '常見 strict 問題與解法',
        content: `**strictPropertyInitialization：**
\`\`\`ts
// ❌ 屬性未在建構子初始化
class UserService {
  private db: Database  // ❌ 必須初始化

  // 解法 1：在宣告時初始化
  private db: Database = new Database()

  // 解法 2：在建構子中初始化
  constructor(db: Database) {
    this.db = db
  }

  // 解法 3：若確定在使用前會初始化（不推薦）
  private db!: Database  // 非空斷言讓 TypeScript 不報錯
}
\`\`\`

**useUnknownInCatchVariables：**
\`\`\`ts
// 以前
try { ... } catch (e) {
  console.log(e.message) // ✅（e 是 any）
}

// 現在（useUnknownInCatchVariables）
try { ... } catch (e) {
  // e 是 unknown，必須縮窄
  if (e instanceof Error) {
    console.log(e.message) // ✅
  } else {
    console.log(String(e)) // ✅
  }
}
\`\`\`

**逐步啟用 strict 的策略：**
先單獨啟用影響最大的選項，逐步修正問題：
\`\`\`json
{ "noImplicitAny": true }    // 第一步
{ "strictNullChecks": true } // 第二步
{ "strict": true }           // 最終目標
\`\`\``,
      },
    ],
  },

  {
    slug: 'ts-tsconfig',
    sections: [
      {
        heading: 'tsconfig.json 核心選項',
        content: `\`\`\`json
{
  "compilerOptions": {
    // 編譯輸出目標 JavaScript 版本
    "target": "ES2020",

    // 包含的內建型別宣告（不影響 target）
    "lib": ["ES2020", "DOM", "DOM.Iterable"],

    // 模組系統
    "module": "ESNext",

    // 模組解析策略
    "moduleResolution": "bundler",  // 推薦：Vite、Next.js
    // "moduleResolution": "node16",  // Node.js ESM 專案
    // "moduleResolution": "node",    // 舊版 Node.js

    // 輸出目錄
    "outDir": "./dist",
    "rootDir": "./src",

    // 嚴格模式
    "strict": true,

    // 允許匯入 .json 文件
    "resolveJsonModule": true,

    // 讓每個文件都是獨立模組（避免全域污染）
    "isolatedModules": true,

    // 產生型別宣告文件
    "declaration": true,
    "declarationMap": true,

    // Source Map
    "sourceMap": true
  }
}
\`\`\``,
      },
      {
        heading: 'paths 路徑別名和 include/exclude',
        content: `**paths 別名：**
\`\`\`json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@utils/*": ["./src/utils/*"],
      "@types/*": ["./src/types/*"]
    }
  }
}
\`\`\`

\`\`\`ts
// 使用後可以這樣 import
import { Button } from "@components/Button"
import { formatDate } from "@utils/date"
// 而不是 ../../components/Button
\`\`\`

**注意：paths 只影響 TypeScript 型別解析，打包工具需另外設定別名（webpack alias、Vite resolve.alias）**

**include / exclude / files：**
\`\`\`json
{
  "include": ["src/**/*", "tests/**/*"],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.spec.ts"
  ],
  // files 精確列出（不支援 glob，通常用於特殊情況）
  "files": ["src/main.ts", "src/global.d.ts"]
}
\`\`\`

**extends：繼承另一個 tsconfig**
\`\`\`json
{
  "extends": "@tsconfig/node20/tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist"
  }
}
\`\`\``,
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // React + TypeScript
  // ────────────────────────────────────────────────────────────────
  {
    slug: 'ts-react-props',
    sections: [
      {
        heading: 'Props 型別定義的最佳實踐',
        content: `\`\`\`tsx
// ✅ 推薦：直接在函式參數標注型別
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: "primary" | "secondary" | "danger"
  disabled?: boolean
}

function Button({ label, onClick, variant = "primary", disabled = false }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={\`btn-\${variant}\`}
    >
      {label}
    </button>
  )
}

// ⚠️ React.FC 的注意事項（React 18 後）
const Button2: React.FC<ButtonProps> = ({ label, onClick }) => {
  // React 18 前：FC<Props> 隱含 children?: ReactNode
  // React 18 後：FC<Props> 不隱含 children，更精確
  return <button onClick={onClick}>{label}</button>
}
\`\`\``,
      },
      {
        heading: 'children 型別和 HTML 屬性擴充',
        content: `**children 型別：**
\`\`\`tsx
interface CardProps {
  title: string
  // children 型別選項：
  children: React.ReactNode      // 最寬：任何可渲染的東西
  // children: React.ReactElement  // 只接受 React 元素（不接受字串）
  // children: string              // 只接受字串
  // children?: React.ReactNode    // 可選 children
}

function Card({ title, children }: CardProps) {
  return (
    <div>
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  )
}
\`\`\`

**擴充 HTML 元素屬性：**
\`\`\`tsx
// 繼承 button 的所有原生屬性
interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "primary" | "secondary"
  loading?: boolean
}

function CustomButton({ variant, loading, children, ...rest }: CustomButtonProps) {
  return (
    <button
      {...rest}  // 傳遞所有原生 button 屬性（onClick, disabled, type 等）
      className={\`btn-\${variant} \${loading ? "loading" : ""}\`}
    >
      {loading ? <Spinner /> : children}
    </button>
  )
}

// 使用：可以用任何原生 button 屬性
<CustomButton variant="primary" type="submit" disabled={isLoading}>
  送出
</CustomButton>
\`\`\``,
      },
    ],
  },

  {
    slug: 'ts-react-events',
    sections: [
      {
        heading: '常見 React 事件型別',
        content: `\`\`\`tsx
// 常見事件型別對照表
// onChange（input/select/textarea）
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value)
}
const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
  setOption(e.target.value)
}

// onClick（button/div 等）
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault()
  console.log(e.clientX, e.clientY)
}

// onSubmit（form）
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  // 處理表單
}

// onKeyDown/onKeyUp
const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter") { /* 送出 */ }
  if (e.key === "Escape") { /* 取消 */ }
}

// onFocus/onBlur
const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  console.log("focused:", e.target.value)
}

// 滑鼠懸停
const handleHover = (e: React.MouseEvent<HTMLDivElement>) => {
  console.log("hovering over:", e.currentTarget)
}
\`\`\``,
      },
      {
        heading: 'event.target vs event.currentTarget',
        content: `\`\`\`tsx
// currentTarget：綁定事件的元素（精確型別）
// target：實際觸發事件的元素（可能是子元素）

function Form() {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // currentTarget：事件綁定的 div（精確：HTMLDivElement）
    console.log(e.currentTarget.className)

    // target：實際被點擊的元素（寬泛：EventTarget）
    // 可能是 div 內的任何子元素
    const target = e.target as HTMLElement  // 需要斷言
    console.log(target.tagName)
  }

  return (
    <div onClick={handleClick}>
      <button>按鈕</button>  {/* 點擊按鈕時，target 是 button */}
      <span>文字</span>       {/* 點擊文字時，target 是 span */}
    </div>
  )
}

// Inline handler 讓 TypeScript 自動推斷
function Input() {
  return (
    <input
      onChange={(e) => {
        // e 自動推斷為 React.ChangeEvent<HTMLInputElement>
        console.log(e.target.value)
      }}
    />
  )
}
\`\`\``,
      },
    ],
  },

  {
    slug: 'ts-react-hooks',
    sections: [
      {
        heading: 'useState 和 useRef 的型別',
        content: `**useState：**
\`\`\`ts
// 初始值可推斷型別時不需要泛型
const [count, setCount] = useState(0)          // number
const [name, setName] = useState("")           // string
const [active, setActive] = useState(false)    // boolean

// 需要明確傳泛型的情況：
const [user, setUser] = useState<User | null>(null)  // 初始值是 null
const [items, setItems] = useState<string[]>([])     // 空陣列，需指定元素型別
const [data, setData] = useState<ApiResponse>()      // undefined 初始值

// setUser 的型別
setUser(null)                    // ✅
setUser({ id: 1, name: "Alice" }) // ✅
setUser(prev => prev ? { ...prev, name: "Bob" } : null) // ✅ 函式更新
\`\`\`

**useRef：**
\`\`\`ts
// DOM ref：初始值 null，TypeScript 推斷為 RefObject<T>
const inputRef = useRef<HTMLInputElement>(null)
const divRef = useRef<HTMLDivElement>(null)

// 使用時需要處理 null（輸入可能未 mount）
function focusInput() {
  inputRef.current?.focus()  // optional chaining
  // 或
  if (inputRef.current) inputRef.current.focus()
}

// 可變值 ref：存放不觸發重渲染的值
const timerRef = useRef<ReturnType<typeof setTimeout>>()
const prevValueRef = useRef<string>()
const countRef = useRef(0)  // MutableRefObject<number>

useEffect(() => {
  countRef.current++  // 直接修改，不觸發重渲染
}, [])
\`\`\``,
      },
      {
        heading: 'useReducer 和自訂 Hook 的型別',
        content: `**useReducer：**
\`\`\`ts
// 定義 State 和 Action 型別
interface State {
  count: number
  loading: boolean
  error: string | null
}

type Action =
  | { type: "INCREMENT" }
  | { type: "DECREMENT" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, count: state.count + 1 }
    case "SET_LOADING":
      return { ...state, loading: action.payload }  // payload: boolean ✅
    // TypeScript 確保你處理所有 case
    default:
      return state
  }
}

const [state, dispatch] = useReducer(reducer, { count: 0, loading: false, error: null })
dispatch({ type: "INCREMENT" })              // ✅
dispatch({ type: "SET_LOADING", payload: true }) // ✅
\`\`\`

**自訂 Hook 回傳元組：**
\`\`\`ts
// ✅ 明確標注回傳型別（推薦）
function useToggle(initial: boolean): [boolean, () => void, (v: boolean) => void] {
  const [value, setValue] = useState(initial)
  const toggle = () => setValue(v => !v)
  return [value, toggle, setValue]
}

// ✅ 或使用 as const
function useToggle(initial: boolean) {
  const [value, setValue] = useState(initial)
  return [value, () => setValue(v => !v), setValue] as const
}

const [isDark, toggleDark, setDark] = useToggle(false)
// isDark: boolean, toggleDark: () => void, setDark: Dispatch<...>
\`\`\``,
      },
    ],
  },

  {
    slug: 'ts-react-generics',
    sections: [
      {
        heading: '泛型 React 元件的寫法',
        content: `\`\`\`tsx
// 基本泛型元件（用 function 宣告）
interface ListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  keyExtractor: (item: T) => string | number
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={keyExtractor(item)}>
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  )
}

// 使用：TypeScript 自動推斷 T
interface User { id: number; name: string }
const users: User[] = [...]

<List
  items={users}
  keyExtractor={(user) => user.id}  // user: User ✅
  renderItem={(user) => <span>{user.name}</span>}  // user: User ✅
/>

// 帶約束的泛型元件
interface SelectProps<T extends { id: string | number; label: string }> {
  options: T[]
  value: T | null
  onChange: (option: T) => void
}

function Select<T extends { id: string | number; label: string }>({
  options, value, onChange
}: SelectProps<T>) {
  return (
    <select onChange={(e) => {
      const selected = options.find(o => String(o.id) === e.target.value)
      if (selected) onChange(selected)
    }}>
      {options.map(opt => (
        <option key={opt.id} value={String(opt.id)}>{opt.label}</option>
      ))}
    </select>
  )
}
\`\`\``,
      },
      {
        heading: '.tsx 中的泛型語法和 forwardRef',
        content: `**.tsx 中箭頭函式泛型的問題：**
\`\`\`tsx
// ❌ .tsx 中 <T> 被誤解為 JSX 開頭標籤
const identity = <T>(x: T) => x

// ✅ 解法 1：加逗號（告訴 TS 是泛型，不是 JSX）
const identity = <T,>(x: T) => x

// ✅ 解法 2：加 extends 約束
const identity = <T extends unknown>(x: T) => x

// ✅ 解法 3（推薦）：用 function 宣告
function identity<T>(x: T) { return x }
\`\`\`

**forwardRef 的型別：**
\`\`\`tsx
import { forwardRef, useImperativeHandle } from "react"

interface InputProps {
  label: string
  placeholder?: string
}

// 注意：第一個泛型是 ref 型別，第二個是 Props 型別
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, placeholder }, ref) => {
    return (
      <div>
        <label>{label}</label>
        <input ref={ref} placeholder={placeholder} />
      </div>
    )
  }
)

// 使用
const inputRef = useRef<HTMLInputElement>(null)
<Input ref={inputRef} label="姓名" />

// 暴露自訂方法（useImperativeHandle）
interface InputHandle {
  focus(): void
  clear(): void
}
const FancyInput = forwardRef<InputHandle, InputProps>(({ label }, ref) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    clear: () => { if (inputRef.current) inputRef.current.value = "" }
  }))

  return <input ref={inputRef} />
})
\`\`\``,
      },
    ],
  },
]

async function seed() {
  console.log(`新增 ${notes.length} 個主題的說明內容...\n`)

  for (const note of notes) {
    const existing = await db
      .select({ id: schema.topicNoteSections.id })
      .from(schema.topicNoteSections)
      .where(eq(schema.topicNoteSections.slug, note.slug))

    if (existing.length > 0) {
      // 刪除舊的再重新插入
      await db
        .delete(schema.topicNoteSections)
        .where(eq(schema.topicNoteSections.slug, note.slug))
    }

    for (let i = 0; i < note.sections.length; i++) {
      await db.insert(schema.topicNoteSections).values({
        slug: note.slug,
        heading: note.sections[i].heading,
        content: note.sections[i].content,
        order: i,
      })
    }
    console.log(`  ✓ ${note.slug}: ${note.sections.length} 個章節`)
  }

  console.log('\n✅ TypeScript 說明內容建立完成')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
