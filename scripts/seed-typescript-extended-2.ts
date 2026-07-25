import { config } from 'dotenv'
config({ path: '.env.local' })
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../lib/db/schema'

const client = neon(process.env.DATABASE_URL!)
const db = drizzle(client, { schema })

const THEME = 'TypeScript'

interface TopicSeed {
  slug: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  subCategory: string
  questions: {
    order: number
    question: string
    options: string[]
    answer: number
    explanation: string
  }[]
}

const topics: TopicSeed[] = [
  // ─── Function Types ─────────────────────────────────────────────
  {
    slug: 'ts-function-types',
    title: '函式型別基礎',
    description: '學習函式型別的兩種寫法、call signature、construct signature 及函式型別相容性規則。',
    difficulty: 'easy',
    subCategory: 'Function Types',
    questions: [
      {
        order: 1,
        question: '以下哪兩種寫法都能描述「接受 number 回傳 string」的函式型別？',
        options: [
          'type F = (x: number) => string  /  interface F { call(x: number): string }',
          'type F = (x: number) => string  /  interface F { (x: number): string }',
          'type F = function(x: number): string  /  interface F { fn(x: number): string }',
          'type F = number => string  /  interface F { [x: number]: string }',
        ],
        answer: 1,
        explanation: '函式型別有兩種寫法：1) type alias 箭頭語法：(x: number) => string；2) interface 的 call signature：{ (x: number): string }。兩者型別等效。interface 的寫法還可以在同一個 interface 中定義多個多載簽名，或同時描述函式屬性。',
      },
      {
        order: 2,
        question: 'construct signature 的用途是什麼？\n\ninterface Newable { new(name: string): MyClass }',
        options: [
          '讓 interface 可以被 class 繼承',
          '描述「可以用 new 呼叫」的型別（建構子型別）',
          '讓函式自動建立新物件',
          '只能用於 abstract class',
        ],
        answer: 1,
        explanation: 'construct signature（new 簽名）描述可以被 new 呼叫的型別。這在描述建構子、工廠函式，或接受任何可 new 的值時很有用。例如 function create<T>(ctor: new() => T): T { return new ctor() } 接受任何可以 new 的建構子。',
      },
      {
        order: 3,
        question: '以下函式型別相容性問題，哪個賦值是合法的？\n\ntype Less = (a: number) => void\ntype More = (a: number, b: string) => void',
        options: [
          '只有 More 賦值給 Less 合法（參數少的 = 參數多的）',
          '只有 Less 賦值給 More 合法（參數多的 = 參數少的）',
          '兩個方向都合法',
          '兩個方向都不合法',
        ],
        answer: 0,
        explanation: 'TypeScript 函式型別相容性採用「參數少的相容參數多的」原則（Source Compatibility）。可以把參數少的函式賦值給需要參數多的型別（忽略多餘參數是安全的）。這和 JavaScript 實際行為一致：呼叫函式時傳入多餘參數不報錯。Array.forEach 的 callback 就利用了這個特性。',
      },
      {
        order: 4,
        question: '函式回傳型別是 void 時，實際上可以回傳任何值嗎？',
        options: [
          '不行，void 回傳型別的函式必須回傳 undefined 或不 return',
          '可以，void 只代表呼叫端不應使用回傳值，函式本身可以回傳任何值',
          '只能回傳 null 或 undefined',
          '視 strict 模式設定',
        ],
        answer: 1,
        explanation: 'TypeScript 中 void 回傳型別有特殊規則：當函式型別標注為 () => void 時，實際實作可以回傳任何值，TypeScript 不會報錯。這是為了讓 Array.forEach 等可以接受 map 的 callback（map 的 callback 回傳值，但 forEach 需要 () => void）。但直接標注函式 function f(): void { return 1 } 則會報錯。',
      },
      {
        order: 5,
        question: '函式型別中，參數名稱重要嗎？\n\ntype F1 = (x: number) => void\ntype F2 = (y: number) => void\n// F1 和 F2 相容嗎？',
        options: [
          '不相容，參數名稱不同',
          '相容，TypeScript 函式型別相容性只看參數型別和回傳型別，不看參數名稱',
          '只在 strictMode 下不相容',
          '需要顯式轉型才相容',
        ],
        answer: 1,
        explanation: 'TypeScript 採用結構型別系統（Structural Typing），函式型別相容性只看參數型別、順序和回傳型別，完全不考慮參數名稱。F1 和 F2 的參數名稱不同（x vs y），但型別結構完全相同，因此互相相容、可以互換使用。',
      },
    ],
  },

  {
    slug: 'ts-optional-default-params',
    title: '可選參數與預設參數',
    description: '了解可選參數 ? 和預設參數的型別推斷、位置限制，以及 rest parameters 的型別定義。',
    difficulty: 'easy',
    subCategory: 'Function Types',
    questions: [
      {
        order: 1,
        question: '可選參數 ? 和有預設值的參數的型別有何差異？\n\nfunction f(a?: number) {}\nfunction g(a = 0) {}',
        options: [
          'a? 的型別是 number | undefined；有預設值的 a 的型別是 number',
          '兩者型別相同，都是 number | undefined',
          'a? 的型別是 number；有預設值的 a 的型別是 0',
          '有預設值的參數型別是 number | undefined，a? 是 number',
        ],
        answer: 0,
        explanation: '可選參數 a?: number 的型別在函式體內是 number | undefined，呼叫端可以不傳。有預設值 a = 0 的參數，TypeScript 推斷型別為 number（從預設值推斷），且呼叫端可以不傳。主要差別：函式體內 a? 需要處理 undefined，有預設值的 a 型別是 number（預設值保證了非 undefined）。',
      },
      {
        order: 2,
        question: '可選參數有什麼位置限制？',
        options: [
          '可選參數可以放在任何位置',
          '可選參數必須放在必填參數之後',
          '可選參數必須放在第一個',
          '可選參數只能有一個',
        ],
        answer: 1,
        explanation: '可選參數必須放在所有必填參數之後，否則 TypeScript 報錯。function f(a?: number, b: string) {} 是非法的（可選參數在必填參數前）。有預設值的參數沒有這個限制，但放在必填參數前通常沒意義（呼叫端仍需傳 undefined 跳過）。',
      },
      {
        order: 3,
        question: 'rest parameters 的型別如何標注？\n\nfunction sum(...numbers: ???) {}',
        options: [
          '...numbers: number',
          '...numbers: number[]',
          '...numbers: Array',
          '...numbers: [number]',
        ],
        answer: 1,
        explanation: 'rest parameters 必須標注為陣列型別（T[] 或 Array<T>），因為它收集的是任意數量的值放入陣列。...numbers: number[] 表示可以傳入任意數量的 number，在函式體內 numbers 是 number[] 型別。rest parameter 必須是最後一個參數，且每個函式只能有一個。',
      },
      {
        order: 4,
        question: '如何正確標注接受「展開元組」的函式？\n\nfunction foo(...args: [string, number]) {}',
        options: [
          '這是非法語法，rest parameters 只能用陣列',
          '合法，args 的型別是 [string, number] 元組，呼叫時必須傳入一個 string 和一個 number',
          '合法，但 args 在函式體內型別是 (string | number)[]',
          '只能在 TypeScript 5.0 以上使用',
        ],
        answer: 1,
        explanation: 'TypeScript 支援 rest parameters 標注為元組型別，稱為「Variadic Tuple Types」。...args: [string, number] 表示函式接受兩個參數：第一個是 string，第二個是 number。在函式體內 args 是 [string, number] 元組。這讓 rest parameters 可以有精確的位置型別，而不只是均質陣列。',
      },
      {
        order: 5,
        question: '以下哪種寫法讓函式可以接受 0 到多個字串參數？',
        options: [
          'function f(a?: string, b?: string) {}',
          'function f(...args: string[]) {}',
          'function f(args: string[]) {}',
          'function f(a: string | undefined) {}',
        ],
        answer: 1,
        explanation: 'rest parameters ...args: string[] 讓函式接受任意數量的字串，包括 0 個。f() f("a") f("a","b","c") 都合法。f(args: string[]) 需要傳入一個陣列（f(["a","b"])），呼叫方式不同。f(a?: string, b?: string) 只接受最多兩個可選參數，不能處理更多。',
      },
    ],
  },

  {
    slug: 'ts-this-parameter',
    title: 'this 參數型別',
    description: '學習 TypeScript 的 this 參數標注，以及 noImplicitThis 設定的作用和 ThisType<T> 工具型別。',
    difficulty: 'medium',
    subCategory: 'Function Types',
    questions: [
      {
        order: 1,
        question: 'TypeScript 的 this 參數是什麼？',
        options: [
          '一個普通的函式參數，用來接收呼叫端傳入的值',
          '一個假參數（fake parameter），只用於告訴 TypeScript 函式的 this 型別，編譯後會被移除',
          '只能在 class method 中使用',
          'JavaScript 已有 this，TypeScript 的 this 參數是多餘的',
        ],
        answer: 1,
        explanation: 'TypeScript 的 this 參數放在函式參數列表的第一個位置，但它是純型別標注，編譯成 JavaScript 後會被移除，不影響函式的實際參數。它告訴 TypeScript「這個函式的 this 型別必須是 T」，在錯誤的上下文呼叫時會報錯。',
      },
      {
        order: 2,
        question: 'noImplicitThis: true 設定的作用是什麼？',
        options: [
          '禁止在函式中使用 this',
          '當函式中使用 this 但 TypeScript 無法推斷其型別時，報錯而非推斷為 any',
          '讓所有函式的 this 自動綁定',
          '只在 class 中才能使用 this',
        ],
        answer: 1,
        explanation: 'noImplicitThis 開啟後，若函式使用 this 但 TypeScript 無法確定其型別（隱式 any），會報錯。這迫使開發者明確標注 this 型別（用 this 參數）或確保函式在有正確 this 的上下文中使用（如 class method）。是 strict 模式的一部分。',
      },
      {
        order: 3,
        question: '以下程式碼中，如何讓 TypeScript 知道 this 是 User 型別？\n\nfunction greet() {\n  return `Hello, ${this.name}`\n}',
        options: [
          'const greet = () => `Hello, ${this.name}`',
          'function greet(this: User) { return `Hello, ${this.name}` }',
          'function greet(self: User) { return `Hello, ${self.name}` }',
          'greet.bind(User)',
        ],
        answer: 1,
        explanation: '在函式的第一個參數位置加上 this: User，告訴 TypeScript 這個函式的 this 型別是 User。這樣在函式體內存取 this.name 不會報錯。呼叫時必須在正確的上下文（如 user.greet()）或用 .call(user) 傳入正確的 this。',
      },
      {
        order: 4,
        question: '箭頭函式可以有 this 參數嗎？',
        options: [
          '可以，語法和普通函式相同',
          '不行，箭頭函式的 this 從外部詞法作用域捕捉，不能標注 this 參數',
          '可以，但只能在 class 中使用',
          '可以，但只能是 undefined',
        ],
        answer: 1,
        explanation: '箭頭函式不能有 this 參數，因為箭頭函式的 this 是詞法綁定（從定義時的外部作用域捕捉），不能被 call/apply/bind 改變。TypeScript 不允許箭頭函式有 this 參數標注。普通函式才能用 this 參數，因為普通函式的 this 由呼叫方式決定。',
      },
      {
        order: 5,
        question: 'ThisType<T> 工具型別有什麼用途？',
        options: [
          '等同於標注 this 參數',
          '在物件字面量中設定方法內 this 的型別，常用於 mixin 和選項物件（Options API 模式）',
          '讓所有方法自動綁定 this',
          '只用於 Vue 或 React',
        ],
        answer: 1,
        explanation: 'ThisType<T> 是一個標記型別，用於物件字面量中，讓物件內所有方法的 this 型別被設定為 T。常用於 Options API 模式（類似 Vue 2）：定義一個函式接受 options 物件，並用 ThisType 讓 options 中的方法能存取正確型別的 this，不需要逐個方法標注 this 參數。',
      },
    ],
  },

  // ─── Class & OOP ────────────────────────────────────────────────
  {
    slug: 'ts-class-modifiers',
    title: '存取修飾子（Access Modifiers）',
    description: '掌握 public、private、protected、readonly 的差異，以及 TypeScript private 和 ES private field（#）的不同。',
    difficulty: 'medium',
    subCategory: 'Class & OOP',
    questions: [
      {
        order: 1,
        question: 'public、private、protected 的存取範圍差異是什麼？',
        options: [
          'public：任何地方；private：class 內和子 class；protected：只有 class 內',
          'public：任何地方；private：只有 class 內；protected：class 內和子 class',
          'public：只有 class 內；private：class 外；protected：任何地方',
          '三者存取範圍相同，只有命名慣例差別',
        ],
        answer: 1,
        explanation: 'TypeScript 存取修飾子：public（預設）任何地方可存取；private 只有定義的 class 內部可存取，子 class 也不行；protected 在定義的 class 及其子 class 中可存取，但外部不行。這些是編譯期的型別限制，編譯成 JavaScript 後不存在這些限制。',
      },
      {
        order: 2,
        question: 'TypeScript 的 private 和 JavaScript 的 # private field 有何差別？',
        options: [
          '完全相同，只是語法不同',
          'TS private 是編譯期限制（JS 中可被存取）；# 是執行時真正的私有（JS 中無法存取）',
          '# private 只能在 TypeScript 中使用',
          'TS private 效能更好',
        ],
        answer: 1,
        explanation: 'TypeScript 的 private 只存在於型別系統，編譯成 JS 後屬性依然是公開的，可以用 (obj as any).privateField 繞過。JavaScript 原生的 # private field（class Foo { #bar = 1 }）是執行時真正的私有，無法從 class 外部存取，沒有任何辦法可以繞過。TypeScript 也支援 # 語法。',
      },
      {
        order: 3,
        question: '參數屬性（Parameter Properties）是什麼？\n\nconstructor(private name: string, public age: number) {}',
        options: [
          '這是非法語法',
          '在 constructor 參數中加修飾子，同時宣告屬性並賦值（等同在 constructor 內手動 this.name = name）',
          '只是修飾參數，不自動建立屬性',
          '只能在 abstract class 中使用',
        ],
        answer: 1,
        explanation: 'Parameter Properties 是 TypeScript 的語法糖：在 constructor 參數前加 public/private/protected/readonly，等同於同時宣告 class 屬性並在 constructor 中賦值。constructor(private name: string) 等效於 private name: string 宣告 + constructor(name: string) { this.name = name }，大幅減少樣板程式碼。',
      },
      {
        order: 4,
        question: 'readonly 和 private 的主要差別是什麼？',
        options: [
          'readonly 讓屬性無法從外部存取；private 讓屬性無法修改',
          'readonly 讓屬性初始化後無法修改；private 限制存取範圍（class 內）',
          '兩者功能相同',
          'readonly 是執行時限制；private 是編譯期限制',
        ],
        answer: 1,
        explanation: 'readonly 和 private 是獨立的修飾子，解決不同問題。readonly 讓屬性只能在宣告或 constructor 中賦值，之後無法修改（任何地方都不行）。private 限制屬性只能在 class 內部存取，但在 class 內可以自由修改。可以同時使用：private readonly id: number。',
      },
      {
        order: 5,
        question: 'static 成員的特性是什麼？',
        options: [
          'static 成員只能是 readonly',
          'static 成員屬於 class 本身，不屬於實例，透過 ClassName.member 存取',
          'static 成員在所有實例間共享記憶體，但透過 this 存取',
          'static 只能用於方法，不能用於屬性',
        ],
        answer: 1,
        explanation: 'static 成員屬於 class 本身，而非 class 的實例。透過 ClassName.staticMember 存取，不能用 this.staticMember（除非在 static 方法內）。常用於工廠方法（static create()）、常數（static readonly MAX = 100）、計數器等需要 class 層面共享的值。',
      },
    ],
  },

  {
    slug: 'ts-abstract-class',
    title: '抽象類別（Abstract Class）',
    description: '理解抽象類別的用途、抽象方法的特性，以及何時選擇抽象類別而非 interface。',
    difficulty: 'medium',
    subCategory: 'Class & OOP',
    questions: [
      {
        order: 1,
        question: 'abstract class 和普通 class 的主要差別是什麼？',
        options: [
          '抽象類別不能有方法實作，只能有型別宣告',
          '抽象類別不能被直接實例化（new），必須由子 class 繼承並實作抽象成員後才能實例化',
          '抽象類別不能繼承其他 class',
          '抽象類別的所有方法都必須是 abstract',
        ],
        answer: 1,
        explanation: 'abstract class 的核心特性：1) 不能直接 new AbstractClass()，TypeScript 報錯；2) 可以有已實作的方法（提供預設行為）；3) 可以有 abstract 方法（沒有實作，子 class 必須覆寫）。它是一個「不完整的藍圖」，必須被繼承後才能使用。',
      },
      {
        order: 2,
        question: '抽象方法（abstract method）有什麼特性？',
        options: [
          '抽象方法有預設實作，子 class 可以選擇性覆寫',
          '抽象方法沒有實作，子 class 必須提供實作，否則子 class 也必須是 abstract class',
          '抽象方法只能有 void 回傳型別',
          '抽象方法不能有參數',
        ],
        answer: 1,
        explanation: 'abstract 方法只有簽名宣告，沒有實作體。繼承的子 class 必須實作所有繼承的 abstract 方法，否則子 class 必須也標注為 abstract（延遲實作）。這確保多型行為：呼叫抽象方法時，一定會執行子 class 的具體實作。',
      },
      {
        order: 3,
        question: '什麼情況下應選擇 abstract class 而非 interface？',
        options: [
          '當你需要描述物件形狀時（永遠優先選 abstract class）',
          '當你需要提供部分預設實作、共用狀態（屬性），或有建構子邏輯時',
          '只有在需要多重繼承時才用 abstract class',
          'abstract class 和 interface 功能完全相同，任選一個',
        ],
        answer: 1,
        explanation: '選擇 abstract class 的時機：1) 需要共享預設實作（子 class 可以繼承部分方法）；2) 需要在基類中有 state（屬性和建構子）；3) 需要存取修飾子（private/protected 成員）。interface 只能描述形狀，沒有實作。一個 class 只能 extends 一個 class，但可以 implements 多個 interface。',
      },
      {
        order: 4,
        question: '可以把抽象類別用作型別標注嗎？\n\nfunction render(shape: Shape) {} // Shape 是 abstract class',
        options: [
          '不行，abstract class 不能用作型別',
          '可以，abstract class 可以用作型別標注，但只能傳入非抽象的子 class 實例',
          '可以，且可以直接傳入 abstract class 的實例',
          '只能在泛型中使用 abstract class',
        ],
        answer: 1,
        explanation: 'abstract class 可以用作型別標注（型別位置）。function render(shape: Shape) 接受任何繼承 Shape 的子 class 實例。但不能直接 new Shape()——傳入的必須是具體的子 class 實例。這讓你可以寫接受任何 Shape 子型別的多型函式。',
      },
      {
        order: 5,
        question: '抽象類別可以 implements interface 嗎？',
        options: [
          '不行，abstract class 只能 extends 另一個 class',
          '可以，abstract class 可以 implements interface，並選擇實作或留給子 class 作為 abstract 方法',
          '可以，但 abstract class 必須實作 interface 的所有方法',
          '只有非 abstract 的 class 才能 implements interface',
        ],
        answer: 1,
        explanation: 'abstract class 可以 implements interface，但不必實作所有方法——未實作的方法宣告為 abstract，交由子 class 實作。這讓你設計「部分實作 interface」的抽象基類，強制子 class 補完剩餘方法，是模板方法模式（Template Method Pattern）的典型應用。',
      },
    ],
  },

  {
    slug: 'ts-implements-vs-extends',
    title: 'implements vs extends',
    description: '釐清 class implements interface 和 class extends class 的差異，以及型別繼承與實作繼承的不同含義。',
    difficulty: 'medium',
    subCategory: 'Class & OOP',
    questions: [
      {
        order: 1,
        question: 'class 使用 implements 和 extends 的核心差別是什麼？',
        options: [
          'implements 繼承實作和型別；extends 只繼承型別',
          'implements 只是型別契約（不繼承實作）；extends 繼承父 class 的實作和型別',
          'implements 只能用於 interface；extends 只能用於 class',
          '兩者功能相同，只是語法不同',
        ],
        answer: 1,
        explanation: 'extends 繼承父 class 的所有屬性、方法實作和型別，子 class 可以呼叫 super。implements 只繼承型別契約（確保 class 符合 interface 的形狀），不繼承任何實作，必須在 class 中自行提供所有成員的實作。',
      },
      {
        order: 2,
        question: 'class 可以同時 extends 一個 class 和 implements 多個 interface 嗎？',
        options: [
          '不行，TypeScript 只允許 extends 或 implements 其中一個',
          '可以：class C extends A implements B, D {}，且 implements 可以列多個',
          '可以，但只能 implements 一個 interface',
          '可以，但 extends 必須放在 implements 後面',
        ],
        answer: 1,
        explanation: 'TypeScript 允許同時使用：class Child extends Parent implements InterfaceA, InterfaceB {}。extends 只能有一個（TypeScript/JavaScript 不支援多重 class 繼承）；但 implements 可以有多個，用逗號分隔。extends 必須放在 implements 前面。',
      },
      {
        order: 3,
        question: 'implements interface 後，class 必須實作 interface 的所有成員嗎？',
        options: [
          '不必，可選成員可以不實作',
          '必須實作所有非 abstract 的成員（包含可選成員？不，可選成員可以省略）',
          '必須實作所有成員，包括可選的 ?',
          '只需實作 public 成員',
        ],
        answer: 1,
        explanation: 'class implements interface 時，必須實作 interface 中所有必填成員。interface 中的可選成員（?）class 可以選擇不實作。若 class 是 abstract class，可以將部分方法宣告為 abstract，延遲實作到子 class。所有實作的成員型別必須相容 interface 定義。',
      },
      {
        order: 4,
        question: 'interface 可以 extends 另一個 interface 嗎？',
        options: [
          '不行，只有 class 才能 extends',
          '可以，interface 可以 extends 多個 interface，繼承所有成員',
          '可以，但只能 extends 一個 interface',
          '可以，但只能 extends class，不能 extends interface',
        ],
        answer: 1,
        explanation: 'interface 可以 extends 多個 interface：interface C extends A, B {}，繼承 A 和 B 的所有成員。這不同於 class（class 只能 extends 一個）。interface extends 是純型別操作，沒有執行時行為。也可以用 type C = A & B（交叉型別）達到類似效果。',
      },
      {
        order: 5,
        question: 'implements 的型別檢查發生在什麼時候？',
        options: [
          '執行時（runtime）',
          '編譯期（compile time），class 不符合 interface 時 TypeScript 立即報錯',
          '只有在呼叫 class 的方法時才檢查',
          '只有在使用 new 建立實例時才檢查',
        ],
        answer: 1,
        explanation: 'implements 的型別檢查完全在編譯期進行。TypeScript 編譯時立即檢查 class 是否滿足 interface 的所有要求，不符合時立即在 class 宣告處報錯。這讓問題在開發階段就被發現，而非執行時。編譯後的 JavaScript 中不存在 implements 相關的執行時邏輯。',
      },
    ],
  },

  // ─── Module & Declaration ────────────────────────────────────────
  {
    slug: 'ts-declaration-files',
    title: '型別宣告與 .d.ts 文件',
    description: '了解 .d.ts 文件的用途、declare 關鍵字的使用，以及 @types/ 套件如何為 JavaScript 函式庫提供型別。',
    difficulty: 'medium',
    subCategory: 'Module & Declaration',
    questions: [
      {
        order: 1,
        question: '.d.ts 文件的主要用途是什麼？',
        options: [
          '儲存 TypeScript 的編譯設定',
          '為 JavaScript 程式碼提供型別宣告，不包含任何執行時程式碼',
          '儲存編譯後的型別資訊供除錯使用',
          '只能用於第三方套件，不能用於自己的程式碼',
        ],
        answer: 1,
        explanation: '.d.ts（Declaration File）只包含型別宣告，不包含任何執行時程式碼。它告訴 TypeScript「這個 JavaScript 模組有哪些 API 及其型別」。當你使用 npm 上沒有 TypeScript 原始碼的 JavaScript 套件時，.d.ts 提供型別資訊讓 TypeScript 能做型別檢查和自動完成。',
      },
      {
        order: 2,
        question: 'declare 關鍵字的作用是什麼？\n\ndeclare const VERSION: string\ndeclare function fetch(url: string): Promise<Response>',
        options: [
          '宣告一個新的變數或函式並執行',
          '告訴 TypeScript「這個變數/函式存在，但實作在別處（如全域環境或另一個 JS 文件）」',
          '讓變數變成全域可存取',
          '只能在 .d.ts 文件中使用',
        ],
        answer: 1,
        explanation: 'declare 關鍵字表示「這個名稱在某處已被定義，請相信我」，只做型別宣告，不產生任何 JavaScript 程式碼。常用於描述全域變數（window 上的屬性）、第三方函式庫的 API，或環境變數（如 process.env.NODE_ENV）。',
      },
      {
        order: 3,
        question: '@types/ 套件（如 @types/lodash）的作用是什麼？',
        options: [
          '替換掉 lodash，提供 TypeScript 版本的 lodash',
          '為 lodash 這個 JavaScript 套件提供型別宣告，讓 TypeScript 專案可以有型別安全地使用 lodash',
          '讓 lodash 的型別在全域自動可用，不需要 import',
          '提供 lodash 的 TypeScript 原始碼',
        ],
        answer: 1,
        explanation: '@types/lodash 是 DefinitelyTyped 社群維護的 lodash 型別宣告套件，只包含 .d.ts 文件。安裝後 TypeScript 就知道 lodash 的所有 API 型別，讓你在 import _ from "lodash" 後有完整的型別安全和自動完成，而不需要修改 lodash 的原始碼。',
      },
      {
        order: 4,
        question: '如何為一個沒有型別定義的 npm 套件（也沒有 @types/）快速添加型別？',
        options: [
          '修改 node_modules 中的檔案',
          '在專案中建立 typings/<package-name>.d.ts 或 @types/<package-name>/index.d.ts 並 declare module',
          '改用有型別的替代套件',
          '用 any 型別匯入',
        ],
        answer: 1,
        explanation: '可以在專案中建立一個 .d.ts 文件，用 declare module 宣告套件的型別：declare module "untyped-lib" { export function foo(): void }。在 tsconfig.json 的 typeRoots 或 types 設定指定位置，或放在 @types/ 目錄（TypeScript 預設查找）。快速但粗糙的方案是 declare module "untyped-lib" 讓整個套件型別為 any。',
      },
      {
        order: 5,
        question: '什麼時候 TypeScript 不需要 .d.ts 文件也能有型別資訊？',
        options: [
          '只有當套件是純 JavaScript 時',
          '當套件本身是用 TypeScript 撰寫並包含 .ts 原始碼，或在 package.json 中指定 "types" 欄位指向 .d.ts 文件時',
          '所有情況都需要 .d.ts 文件',
          '當套件有 README 說明型別時',
        ],
        answer: 1,
        explanation: '若套件本身是 TypeScript 專案，編譯時用 declaration: true 設定自動產生 .d.ts，並在 package.json 的 "types" 或 "typings" 欄位指向它。TypeScript 匯入該套件時會自動找到型別。若套件直接包含 .ts 原始碼且 tsconfig 允許，也可以直接讀取原始碼型別。',
      },
    ],
  },

  {
    slug: 'ts-module-augmentation',
    title: 'Module Augmentation',
    description: '學習如何擴充第三方套件的型別定義（如 Express Request、React），以及 Global Augmentation 的用法。',
    difficulty: 'hard',
    subCategory: 'Module & Declaration',
    questions: [
      {
        order: 1,
        question: 'Module Augmentation 的用途是什麼？',
        options: [
          '替換整個第三方套件的型別定義',
          '在不修改原始套件的情況下，為現有模組的型別添加額外的成員',
          '讓模組在多個文件中共用',
          '合併兩個不同套件的型別',
        ],
        answer: 1,
        explanation: 'Module Augmentation 讓你擴充現有模組的型別，而不是取代它。常見場景：Express 中介軟體設定 req.user 後，為 Express 的 Request 型別添加 user 屬性；Vue 的 prototype 插件需要讓 this.$router 有型別等。你只需要新增成員，原有型別不受影響。',
      },
      {
        order: 2,
        question: '擴充 Express Request 型別的正確語法是什麼？',
        options: [
          'type Request = Express.Request & { user: User }',
          'declare module "express" { interface Request { user?: User } }',
          'import "express"; Request.user = User',
          'extend module "express" { Request.user: User }',
        ],
        answer: 1,
        explanation: '在一個 .ts 或 .d.ts 文件中，使用 declare module "模組名稱" { } 包裹，內部用 interface（利用宣告合併）添加成員。TypeScript 的 interface 支援宣告合併，同名 interface 會自動合併，讓 express 的 Request interface 多了 user 屬性。',
      },
      {
        order: 3,
        question: 'Module Augmentation 和 Global Augmentation 的差別是什麼？',
        options: [
          '完全相同，只是名稱不同',
          'Module Augmentation 擴充特定模組的型別；Global Augmentation 擴充全域命名空間（如 Window、globalThis）',
          'Global Augmentation 只能在 .d.ts 文件中使用',
          'Module Augmentation 只能擴充 interface，不能擴充其他型別',
        ],
        answer: 1,
        explanation: 'Module Augmentation 針對特定模組：declare module "express" {}。Global Augmentation 針對全域：declare global { interface Window { myLib: MyLib } }，讓 window.myLib 有型別。Global Augmentation 通常在模組文件中用 declare global {} 包裹，確保它是「模組」而非「腳本」（否則宣告會自動變全域）。',
      },
      {
        order: 4,
        question: 'Module Augmentation 有什麼限制？',
        options: [
          '可以修改、覆寫現有成員的型別',
          '只能新增成員，不能覆寫或修改現有成員的型別',
          '只能在專案根目錄的文件中使用',
          '只能擴充 interface，不能擴充 class',
        ],
        answer: 1,
        explanation: 'Module Augmentation 只能新增新成員，不能覆寫現有成員的型別。如果你試圖重新宣告一個已存在的成員（如修改 Request 中已有的 body 型別），TypeScript 會報錯（型別衝突）。這確保了擴充不會破壞原有的型別定義。',
      },
      {
        order: 5,
        question: '為什麼 Module Augmentation 文件必須有至少一個 import 或 export？',
        options: [
          '這不是必需的',
          '沒有 import/export 的 .ts 文件被視為「腳本」而非「模組」，宣告會進入全域作用域而非擴充指定模組',
          '因為需要匯入要擴充的套件',
          '這是 TypeScript 的語法要求',
        ],
        answer: 1,
        explanation: 'TypeScript 區分「模組」（有 import/export 的文件）和「腳本」（沒有的文件）。若文件沒有 import/export，declare module "x" {} 的宣告行為可能不正確，或整個文件的宣告直接進入全域。確保 Module Augmentation 文件至少有 export {} 讓 TypeScript 把它當作模組。',
      },
    ],
  },

  // ─── Config & Engineering ────────────────────────────────────────
  {
    slug: 'ts-strict-mode',
    title: 'Strict Mode 各選項',
    description: '了解 strict: true 包含哪些子選項，以及 strictNullChecks、noImplicitAny 等設定的實際影響。',
    difficulty: 'medium',
    subCategory: 'Config & Engineering',
    questions: [
      {
        order: 1,
        question: 'tsconfig.json 中 "strict": true 包含哪些子選項？',
        options: [
          '只包含 strictNullChecks 和 noImplicitAny',
          'strictNullChecks、noImplicitAny、strictFunctionTypes、strictBindCallApply、strictPropertyInitialization、noImplicitThis、useUnknownInCatchVariables 等',
          '只有 strictNullChecks',
          'strict 只是一個命名慣例，不包含其他選項',
        ],
        answer: 1,
        explanation: 'strict: true 是一個快捷開關，等同於同時開啟多個嚴格選項：strictNullChecks、noImplicitAny、strictFunctionTypes、strictBindCallApply、strictPropertyInitialization、noImplicitThis、alwaysStrict（emit "use strict"），以及 TypeScript 5.x 的 useUnknownInCatchVariables。可以單獨設定這些選項覆蓋 strict 的設定。',
      },
      {
        order: 2,
        question: 'strictNullChecks 開啟後有什麼影響？',
        options: [
          '讓所有型別都不能是 null 或 undefined',
          'null 和 undefined 不再是所有型別的子型別，必須明確在型別中包含才能賦值',
          '自動在所有可能為 null 的地方加上 ? 運算子',
          '讓函式不能回傳 null',
        ],
        answer: 1,
        explanation: 'strictNullChecks 關閉時（預設），null 和 undefined 可以賦值給任何型別。開啟後，string 型別的變數不能被賦值為 null 或 undefined，必須明確宣告為 string | null。這排除了大量的 "Cannot read property of null" 執行時錯誤，是 TypeScript 最重要的嚴格選項之一。',
      },
      {
        order: 3,
        question: 'noImplicitAny 的作用是什麼？',
        options: [
          '禁止使用 any 型別',
          '當 TypeScript 無法推斷型別且會隱式推斷為 any 時，報錯要求明確標注',
          '讓所有未標注的參數自動變成 unknown',
          '禁止使用 as any 斷言',
        ],
        answer: 1,
        explanation: 'noImplicitAny 阻止 TypeScript 默默推斷為 any。例如 function f(x) {} 中 x 的型別無法推斷，不開啟時隱式為 any；開啟 noImplicitAny 後 TypeScript 報錯，要求明確標注 x: any 或其他型別。注意：明確寫 x: any 依然合法，只是「隱式」any 不被允許。',
      },
      {
        order: 4,
        question: 'strictFunctionTypes 對函式型別有什麼影響？',
        options: [
          '讓所有函式參數變成必填',
          '讓函式參數採用逆變（contravariant）型別檢查，使函式型別更安全',
          '讓函式回傳型別必須明確標注',
          '禁止函式有超過 10 個參數',
        ],
        answer: 1,
        explanation: 'strictFunctionTypes 讓函式參數型別採用逆變（contravariant）而非雙變（bivariant）檢查。實際效果：不再允許把「接受特定型別」的函式賦值給「接受更寬型別」的位置。這防止了某些不安全的函式型別賦值，提高型別安全性。注意：method 語法（obj.method: (x: T) => void）仍使用雙變，只有函式型別屬性（fn: (x: T) => void）受影響。',
      },
      {
        order: 5,
        question: 'useUnknownInCatchVariables（TypeScript 4.4+）的作用是什麼？',
        options: [
          '讓所有 catch 的變數都是 never 型別',
          '讓 catch(e) 的 e 型別預設為 unknown 而非 any，強迫開發者做型別縮窄',
          '讓 catch 子句可以捕捉特定型別',
          '禁止在 catch 中使用 e 變數',
        ],
        answer: 1,
        explanation: '以前 catch(e) 中 e 的型別隱式為 any，可以直接存取 e.message 而不報錯。useUnknownInCatchVariables（strict 模式的一部分）讓 e 的型別預設為 unknown，必須先做型別縮窄（if (e instanceof Error)）才能存取屬性，避免假設拋出的一定是 Error 物件（JavaScript 可以拋出任何值）。',
      },
    ],
  },

  {
    slug: 'ts-tsconfig',
    title: 'tsconfig.json 關鍵設定',
    description: '掌握 target、lib、moduleResolution、paths 等重要 tsconfig 選項，了解它們對編譯和型別解析的影響。',
    difficulty: 'medium',
    subCategory: 'Config & Engineering',
    questions: [
      {
        order: 1,
        question: 'tsconfig.json 中 "target" 設定的作用是什麼？',
        options: [
          '指定 TypeScript 原始碼的版本',
          '指定 TypeScript 編譯輸出的 JavaScript 版本（如 ES5、ES2020）',
          '指定 Node.js 的版本',
          '指定要使用的 TypeScript 版本',
        ],
        answer: 1,
        explanation: 'target 決定 TypeScript 將程式碼編譯輸出到哪個 JavaScript 版本。target: "ES5" 會把 async/await、箭頭函式、class 等語法編譯成 ES5 相容的程式碼。target: "ES2020" 則保留大部分現代語法。target 也影響 TypeScript 認為執行環境支援哪些 API（影響 lib 的預設值）。',
      },
      {
        order: 2,
        question: '"lib" 設定的作用是什麼？',
        options: [
          '指定要安裝的 npm 套件',
          '指定型別系統應包含哪些內建 API 的型別宣告（如 DOM、ES2020、WebWorker）',
          '指定第三方型別宣告的路徑',
          '指定 TypeScript 編譯器使用的語言',
        ],
        answer: 1,
        explanation: 'lib 設定 TypeScript 應包含哪些內建型別宣告。例如 "lib": ["ES2020", "DOM"] 讓 TypeScript 知道 Promise、Array.flat() 的型別，以及瀏覽器 API（document、window）的型別。若在 Node.js 環境，可以不需要 DOM；若在瀏覽器，需要 DOM。lib 和 target 有關聯，未設定 lib 時 TypeScript 根據 target 選擇預設 lib。',
      },
      {
        order: 3,
        question: '"moduleResolution" 設定的常見選項和差別是什麼？',
        options: [
          '"node" 和 "bundler"，前者模擬 Node.js require；後者模擬 webpack 等打包工具的解析行為',
          '"classic" 和 "modern"，前者是舊版；後者是新版',
          '"strict" 和 "loose"，決定型別解析的嚴格程度',
          '只有一個選項 "node"',
        ],
        answer: 0,
        explanation: 'moduleResolution 選項：node（Node.js CommonJS 的解析邏輯）；node16/nodenext（Node.js ESM 的解析，要求副檔名）；bundler（TypeScript 5.0+，適合 webpack、vite 等打包工具，最靈活）。現代 Next.js、Vite 專案通常用 bundler；純 Node.js 後端用 node16 或 nodenext。',
      },
      {
        order: 4,
        question: '"paths" 設定的用途是什麼？\n\n"paths": { "@/*": ["./src/*"] }',
        options: [
          '設定 TypeScript 的輸出路徑',
          '設定路徑別名，讓 TypeScript 知道 @/ 開頭的 import 對應到 ./src/ 目錄',
          '設定 tsconfig 文件的搜尋路徑',
          '設定 node_modules 的查找路徑',
        ],
        answer: 1,
        explanation: 'paths 讓 TypeScript 了解路徑別名（path aliases）的對應關係。若你在 webpack/vite 設定了 @ 對應 src 目錄，TypeScript 也需要在 tsconfig 的 paths 中告知相同的對應，否則會報「找不到模組」的錯誤。注意：paths 只影響型別解析，不影響實際執行，打包工具需要另外設定別名。',
      },
      {
        order: 5,
        question: '"include"、"exclude"、"files" 三個設定的差別是什麼？',
        options: [
          '三者功能相同，都是指定要編譯的文件',
          'include 指定要包含的 glob 模式；exclude 指定要排除的；files 精確列出要包含的文件列表（互補使用）',
          'files 是 include 的別名；exclude 只能排除 node_modules',
          'include 和 exclude 是舊版語法；新版應使用 files',
        ],
        answer: 1,
        explanation: 'include（glob 模式，如 ["src/**/*"]）指定哪些文件應被編譯；exclude（預設包含 node_modules）指定排除哪些文件；files 精確列出要包含的文件（不支援 glob）。若三者都未設定，TypeScript 編譯整個專案目錄（排除 node_modules）。通常 include + exclude 組合最常用，files 用於特殊情況。',
      },
    ],
  },

  // ─── React + TypeScript ──────────────────────────────────────────
  {
    slug: 'ts-react-props',
    title: 'React Props 型別定義',
    description: '學習定義 React 元件 Props 的各種方式，包括 FC vs 直接標注、children 型別，以及事件 handler 的型別。',
    difficulty: 'medium',
    subCategory: 'React + TypeScript',
    questions: [
      {
        order: 1,
        question: '定義 React 元件 Props 型別，FC<Props> 和直接標注有何差別？\n\nconst A: FC<Props> = ({ name }) => ...\nconst B = ({ name }: Props) => ...',
        options: [
          '完全相同，任選一個',
          'FC<Props> 隱含了 children 型別（React 18 前），且有額外的 displayName 等屬性；直接標注更精確，是目前推薦做法',
          'FC<Props> 只能用在箭頭函式；直接標注可用在所有函式',
          '直接標注不支援泛型 Props',
        ],
        answer: 1,
        explanation: '在 React 18 之前，FC<Props> 隱含加入 children?: ReactNode 型別（即使 Props 中沒定義）。這被認為是不精確的行為，React 18 的 @types/react 移除了這個隱含 children。目前官方推薦直接標注 ({ name }: Props) 或 function Component({ name }: Props)，更精確且清楚。',
      },
      {
        order: 2,
        question: '如何讓元件接受 children prop？',
        options: [
          '使用 FC<Props>，children 自動包含',
          '在 Props 中明確加入 children: React.ReactNode',
          '在 Props 中加入 children: JSX.Element',
          '用 PropsWithChildren<Props>，它等同於 Props & { children?: ReactNode }',
        ],
        answer: 2,
        explanation: 'React 18 後推薦明確在 Props 中定義 children 型別，而非依賴 FC 的隱含型別。children: React.ReactNode 接受最廣泛的 children（字串、數字、JSX、陣列、null 等）。也可用 PropsWithChildren<Props> 工具型別：type PropsWithChildren<P> = P & { children?: ReactNode }，等效但不那麼明確。',
      },
      {
        order: 3,
        question: 'React.ReactNode 和 JSX.Element 有什麼差別？',
        options: [
          '完全相同，可互換使用',
          'JSX.Element 只是 React.createElement() 的回傳值（React element）；ReactNode 更廣，包含 string、number、null、undefined、陣列等',
          'ReactNode 只能用在 children；JSX.Element 可以用在任何地方',
          'JSX.Element 是 ReactNode 的子型別',
        ],
        answer: 3,
        explanation: 'JSX.Element 是 React.createElement() 的回傳型別，是一個 React 元素物件（最窄的 JSX 型別）。React.ReactNode 更廣：包含 JSX.Element、string、number、boolean、null、undefined、陣列（ReactNode[]）等，是 children prop 最常用的型別，因為 React 可以渲染這些所有型別。JSX.Element 是 ReactNode 的子型別。',
      },
      {
        order: 4,
        question: '如何正確標注一個接受 onClick 的元件？',
        options: [
          'onClick: Function',
          'onClick: () => void',
          'onClick: (event: React.MouseEvent<HTMLButtonElement>) => void',
          'onClick: EventListener',
        ],
        answer: 2,
        explanation: 'React 事件 handler 的型別是 React.MouseEvent<HTMLElement>，而非原生 DOM 的 MouseEvent。明確標注泛型參數（如 HTMLButtonElement）讓 event.currentTarget 的型別正確。若不需要使用 event 物件，() => void 也可以接受，但標注完整型別更精確。',
      },
      {
        order: 5,
        question: '如何定義一個接受多種 HTML 元素屬性的元件 Props？\n\n例如自訂 Button 需要支援所有 <button> 的原生屬性',
        options: [
          'Props extends HTMLElement',
          'Props & React.ButtonHTMLAttributes<HTMLButtonElement>',
          'Props extends React.ButtonHTMLAttributes<HTMLButtonElement>',
          'Props & typeof HTMLButtonElement',
        ],
        answer: 1,
        explanation: '用交叉型別擴充 HTML 屬性：type ButtonProps = { variant: "primary" | "secondary" } & React.ButtonHTMLAttributes<HTMLButtonElement>。這讓自訂 Button 支援所有原生 button 屬性（disabled、type、onClick 等），同時添加自訂 prop。React 提供 HTMLAttributes、ButtonHTMLAttributes、InputHTMLAttributes 等對應各 HTML 元素。',
      },
    ],
  },

  {
    slug: 'ts-react-events',
    title: 'React 事件型別',
    description: '掌握常見的 React 合成事件型別，了解 event.target 與 event.currentTarget 的型別差異。',
    difficulty: 'easy',
    subCategory: 'React + TypeScript',
    questions: [
      {
        order: 1,
        question: '處理 input change 事件的正確型別是什麼？\n\nfunction handleChange(e: ???) { setValue(e.target.value) }',
        options: [
          'e: Event',
          'e: React.SyntheticEvent',
          'e: React.ChangeEvent<HTMLInputElement>',
          'e: React.InputEvent',
        ],
        answer: 2,
        explanation: 'React.ChangeEvent<HTMLInputElement> 是 input 元素 onChange 的正確型別。泛型參數指定 HTML 元素型別，決定 e.target 的型別。標注後 e.target.value 的型別是 string，有完整的型別安全和自動完成。若標注為 Event 或 SyntheticEvent，e.target 型別不夠精確。',
      },
      {
        order: 2,
        question: 'event.target 和 event.currentTarget 在型別上有什麼差別？',
        options: [
          '兩者型別相同，可互換使用',
          'currentTarget 型別由泛型參數決定（精確）；target 型別是 EventTarget（寬泛），需要做型別斷言才能存取特定屬性',
          'target 是 React 元素；currentTarget 是 DOM 元素',
          'target 只在冒泡中可用；currentTarget 在捕獲中可用',
        ],
        answer: 1,
        explanation: 'React.MouseEvent<HTMLButtonElement> 中，currentTarget 的型別是 HTMLButtonElement（由泛型參數決定，精確）；target 的型別是 EventTarget（最寬泛的 DOM 基礎型別），因為事件可能冒泡自子元素。通常應使用 currentTarget（綁定事件的元素），若要用 target 需要 (e.target as HTMLButtonElement)。',
      },
      {
        order: 3,
        question: '處理表單提交事件的正確型別是什麼？',
        options: [
          'e: React.ClickEvent<HTMLFormElement>',
          'e: React.FormEvent<HTMLFormElement>',
          'e: React.SubmitEvent',
          'e: React.SyntheticEvent<HTMLFormElement>',
        ],
        answer: 1,
        explanation: 'React.FormEvent<HTMLFormElement> 是 form 的 onSubmit handler 的型別。記得在 handler 中呼叫 e.preventDefault() 阻止表單預設提交行為。React.FormEvent 也用於 onChange 時（除了 ChangeEvent），但 input/select/textarea 的 onChange 更精確地用 ChangeEvent<元素型別>。',
      },
      {
        order: 4,
        question: '如何標注鍵盤事件的 handler？',
        options: [
          'e: React.KeyEvent<HTMLInputElement>',
          'e: React.KeyboardEvent<HTMLInputElement>',
          'e: React.InputKeyboardEvent',
          'e: KeyboardEvent',
        ],
        answer: 1,
        explanation: 'React.KeyboardEvent<HTMLElement> 是鍵盤事件的型別，可以存取 e.key（如 "Enter"、"Escape"）、e.keyCode、e.shiftKey、e.ctrlKey 等屬性。注意使用 e.key（字串，如 "Enter"）而非已廢棄的 e.keyCode（數字）。',
      },
      {
        order: 5,
        question: '如何在不寫完整型別的情況下讓 TypeScript 自動推斷事件型別？',
        options: [
          '不可能，必須手動標注',
          '將 handler 直接 inline 在 JSX 中，TypeScript 會從元素的 prop 型別自動推斷',
          '使用 as any',
          '使用 React.infer',
        ],
        answer: 1,
        explanation: '若 handler 直接 inline 在 JSX 中（onClick={(e) => ...}），TypeScript 會從 onClick prop 的型別自動推斷 e 的型別，不需要手動標注。但若 handler 定義在外部（const handleClick = (e) => ...），TypeScript 無法推斷，需要手動標注。Inline 寫法在簡單邏輯時更方便，複雜邏輯時抽出並手動標注型別更清晰。',
      },
    ],
  },

  {
    slug: 'ts-react-hooks',
    title: 'React Hooks 型別',
    description: '學習 useState、useRef、useReducer、useCallback 等常用 Hooks 的 TypeScript 型別定義技巧。',
    difficulty: 'medium',
    subCategory: 'React + TypeScript',
    questions: [
      {
        order: 1,
        question: '以下 useState 有型別問題嗎？\n\nconst [user, setUser] = useState(null)',
        options: [
          '沒有問題，TypeScript 自動推斷為 null',
          '有問題：user 型別被推斷為 null，setUser 只能接受 null，無法設定 User 物件',
          '有問題：useState 不接受 null',
          '沒有問題，TypeScript 推斷為 User | null',
        ],
        answer: 1,
        explanation: '傳入 null 時 TypeScript 推斷 useState<null>，之後 setUser(userObj) 會報錯。正確做法是明確標注泛型：useState<User | null>(null)，這樣 setUser 接受 User 或 null。當初始值無法推斷出最終型別時（如初始值是 null、undefined、空陣列），應明確傳入泛型參數。',
      },
      {
        order: 2,
        question: 'useRef 有幾種用法，型別如何區分？',
        options: [
          '只有一種用法，型別永遠是 RefObject<T>',
          'DOM ref（useRef<HTMLDivElement>(null)，型別 RefObject）vs 可變 ref（useRef(0)，型別 MutableRefObject）',
          '只能存放 DOM 元素，不能存放其他值',
          '型別永遠是 MutableRefObject',
        ],
        answer: 1,
        explanation: 'useRef 有兩種用途：1) DOM ref：useRef<HTMLDivElement>(null)，初始值 null，TypeScript 給 RefObject<HTMLDivElement>（current 是 readonly 的 HTMLDivElement | null）；2) 可變值 ref：useRef(0)，TypeScript 給 MutableRefObject<number>（current 可修改）。區別在於初始值是否是 null——傳 null 得到 RefObject，傳實際值得到 MutableRefObject。',
      },
      {
        order: 3,
        question: '如何正確定義 useReducer 的型別？',
        options: [
          'const [state, dispatch] = useReducer(reducer, { count: 0 })  // TypeScript 自動推斷',
          '需要定義 State type 和 Action type，並傳入 reducer 函式',
          'useReducer 不支援 TypeScript 型別定義',
          '只需要標注 State，Action 自動推斷',
        ],
        answer: 1,
        explanation: '建議明確定義 State 和 Action type：type State = { count: number }；type Action = { type: "increment" } | { type: "decrement" }。reducer 函式的型別會被推斷。TypeScript 會根據 reducer 函式的型別推斷 useReducer 的回傳型別，讓 state 和 dispatch 都有正確型別。在 switch/case 中 action.type 縮窄讓每個 case 中 action 型別精確。',
      },
      {
        order: 4,
        question: 'useCallback 的型別如何標注？',
        options: [
          'useCallback 不需要型別標注，自動推斷',
          'const fn = useCallback<(x: number) => void>((x) => {...}, [...])',
          'useCallback 需要明確的回傳型別，參數型別自動推斷',
          'useCallback 只接受無參數函式',
        ],
        answer: 0,
        explanation: 'useCallback 通常能從回調函式自動推斷型別，不需要明確傳泛型。若需要明確標注，可以直接標注回調的參數型別：useCallback((e: React.ChangeEvent<HTMLInputElement>) => {...}, [])。只在 TypeScript 無法推斷時才需要顯式傳泛型。過度標注反而降低可讀性。',
      },
      {
        order: 5,
        question: '自訂 Hook 的回傳型別該如何處理？',
        options: [
          '不需要標注，TypeScript 自動推斷',
          '若回傳陣列，需明確標注回傳型別（元組）或加 as const，避免推斷為聯合型別陣列',
          '永遠不要使用自訂 Hook 的型別推斷',
          '自訂 Hook 必須回傳物件才能有正確型別',
        ],
        answer: 1,
        explanation: '自訂 Hook 回傳陣列時（如 useState 模式），TypeScript 可能推斷為 (boolean | Dispatch<...>)[] 而非 [boolean, Dispatch<...>] 元組。解法：1) 明確標注回傳型別 ): [boolean, () => void]；2) return [...] as const。回傳物件則沒有這個問題。建議為回傳元組的自訂 Hook 明確標注回傳型別。',
      },
    ],
  },

  {
    slug: 'ts-react-generics',
    title: 'React 泛型元件',
    description: '學習如何撰寫泛型 React 元件，處理 .tsx 中箭頭函式泛型的語法衝突，以及 forwardRef 的型別定義。',
    difficulty: 'hard',
    subCategory: 'React + TypeScript',
    questions: [
      {
        order: 1,
        question: '什麼是泛型 React 元件？何時需要它？',
        options: [
          '所有 React 元件都是泛型的',
          '當元件的 Props 中某些型別需要由使用端決定時（如泛型 List、Select 元件）',
          '只有在使用 TypeScript 嚴格模式時才需要',
          '泛型元件只能用 class component 實作',
        ],
        answer: 1,
        explanation: '當元件需要保留型別資訊給使用端時需要泛型。例如 List<T> 元件接受 items: T[] 和 renderItem: (item: T) => ReactNode，使用端傳入 User[] 時，renderItem 的 item 型別自動是 User。若不用泛型，只能用 any[]，失去型別安全。常見例子：泛型 Table、Select、Autocomplete 元件。',
      },
      {
        order: 2,
        question: '.tsx 文件中，箭頭函式泛型有什麼特殊語法問題？\n\nconst identity = <T>(x: T) => x  // 在 .tsx 中可能報錯',
        options: [
          '.tsx 中箭頭函式完全不支援泛型',
          '<T> 可能被解析為 JSX 標籤，需要加逗號 <T,> 或用 extends 約束：<T extends unknown>',
          '需要改用函式宣告（function）',
          '只需要加上 as T 即可',
        ],
        answer: 1,
        explanation: '在 .tsx 文件中，<T> 可能被解析為 JSX 開頭標籤。解法：1) 加逗號：<T,>（TypeScript 友好，但看起來怪）；2) 加 extends 約束：<T extends unknown>（最常用）；3) 改用 function 關鍵字（function 宣告中 <T> 不在行首，不會被誤解）。在 .ts 文件中沒有這個問題。',
      },
      {
        order: 3,
        question: '如何正確定義泛型 React 元件的型別？',
        options: [
          'function List<T>(props: { items: T[] }) { ... }  // 直接在函式宣告中用泛型',
          'const List: React.FC<{ items: T[] }> = (props) => { ... }  // FC 中用泛型',
          'const List = (props: any) => { ... }',
          '只能用 class component：class List<T> extends React.Component<{ items: T[] }>',
        ],
        answer: 0,
        explanation: '泛型元件最清晰的寫法是 function 宣告加泛型：function List<T>({ items, renderItem }: { items: T[], renderItem: (item: T) => ReactNode }) {}。FC<Props> 難以直接添加泛型（FC 本身是泛型，但元件函式的額外泛型難以表達）。函式宣告寫法最直觀、最常用。',
      },
      {
        order: 4,
        question: 'React.forwardRef 的正確型別標注方式是什麼？',
        options: [
          'const Input = forwardRef((props, ref) => ...)  // 完全自動推斷',
          'const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => ...)',
          'const Input = forwardRef<InputProps, HTMLInputElement>((props, ref) => ...)',
          'forwardRef 不支援 TypeScript 泛型',
        ],
        answer: 1,
        explanation: 'forwardRef 需要兩個泛型參數：forwardRef<RefType, Props>。第一個是 ref 指向的 DOM 元素或實例型別（如 HTMLInputElement），第二個是元件的 Props 型別。順序容易搞混：RefType 在前，Props 在後。標注後 ref 的型別是 React.ForwardedRef<HTMLInputElement>，使用端可以傳入 useRef<HTMLInputElement>(null)。',
      },
      {
        order: 5,
        question: '如何限制泛型元件的型別參數？\n\n例如 List 元件要求每個 item 必須有 id 屬性',
        options: [
          '用 if 在執行時檢查',
          'function List<T extends { id: string | number }>({ items }: { items: T[] }) {}',
          'function List<T = { id: string }>({ items }: { items: T[] }) {}',
          'TypeScript 泛型元件不能添加型別約束',
        ],
        answer: 1,
        explanation: '用 extends 為泛型加上約束：<T extends { id: string | number }>。這確保傳入的 items 的每個元素都有 id 屬性（讓你可以安全用 item.id 作為 key）。使用端傳入 User[]（有 id 屬性）合法，傳入沒有 id 的物件陣列報錯。這結合了泛型的靈活性和型別安全的約束。',
      },
    ],
  },
]

async function seed() {
  console.log(`新增 ${topics.length} 個主題...`)
  for (const topic of topics) {
    const [inserted] = await db
      .insert(schema.topics)
      .values({
        slug: topic.slug,
        title: topic.title,
        description: topic.description,
        category: 'TypeScript',
        difficulty: topic.difficulty,
        theme: THEME,
        subCategory: topic.subCategory,
      })
      .onConflictDoUpdate({
        target: schema.topics.slug,
        set: {
          title: topic.title,
          description: topic.description,
          category: 'TypeScript',
          difficulty: topic.difficulty,
          theme: THEME,
          subCategory: topic.subCategory,
        },
      })
      .returning({ id: schema.topics.id })

    const topicId = inserted.id
    console.log(`  ✓ ${topic.slug} (id: ${topicId})`)

    for (const q of topic.questions) {
      await db
        .insert(schema.questions)
        .values({
          topicId,
          order: q.order,
          question: q.question,
          options: q.options,
          answer: q.answer,
          explanation: q.explanation,
        })
        .onConflictDoUpdate({
          target: [schema.questions.topicId, schema.questions.order],
          set: {
            question: q.question,
            options: q.options,
            answer: q.answer,
            explanation: q.explanation,
          },
        })
    }
    console.log(`    → ${topic.questions.length} 道題目`)
  }

  console.log('\n✅ 第二批完成（主題 16–30）')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
