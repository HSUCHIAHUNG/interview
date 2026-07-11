import { config } from 'dotenv'
config({ path: '.env.local' })
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../lib/db/schema'

const client = neon(process.env.DATABASE_URL!)
const db = drizzle(client, { schema })

const THEME = 'TypeScript'

const subCategories = [
  { name: 'Type System', order: 1 },
  { name: 'Generics', order: 2 },
  { name: 'Function Types', order: 3 },
]

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
  {
    slug: 'ts-any-unknown',
    title: 'any vs unknown',
    description: '了解 any 與 unknown 的型別安全差異，以及型別縮窄的正確用法。',
    difficulty: 'medium',
    subCategory: 'Type System',
    questions: [
      {
        order: 1,
        question: 'TypeScript 中，關於 any 和 unknown 哪個敘述正確？',
        options: [
          'any 比 unknown 更安全',
          'unknown 比 any 更安全',
          '兩者完全相同，只是命名不同',
          'unknown 不能被任何值賦值',
        ],
        answer: 1,
        explanation: 'unknown 比 any 更安全。any 完全繞過型別系統，可以對其做任何操作；unknown 雖然也能接受任何值，但在操作之前必須先做型別縮窄（如 typeof 檢查），因此能保持型別安全。',
      },
      {
        order: 2,
        question: '以下程式碼哪個操作在 TypeScript 中會報錯？\n\nlet b: unknown = "world"',
        options: [
          'let x: unknown = b',
          'let y: any = b',
          'b.toUpperCase()',
          'console.log(b)',
        ],
        answer: 2,
        explanation: '對 unknown 型別的值直接呼叫方法（如 .toUpperCase()）會報錯，因為 TypeScript 不確定 b 是否真的是字串。必須先用 if (typeof b === "string") 做型別縮窄後才能呼叫。',
      },
      {
        order: 3,
        question: 'any 和 unknown 最大的差別是什麼？',
        options: [
          'any 只能放字串，unknown 可以放任何值',
          '操作 unknown 前必須做型別縮窄（Type Narrowing），操作 any 不需要',
          'unknown 是 any 的子型別',
          'unknown 不能被 undefined 或 null 賦值',
        ],
        answer: 1,
        explanation: '最大差別在於「型別縮窄」。any 繞過所有型別檢查，可以直接做任何操作；unknown 在做操作（如呼叫方法、算術）前，必須先透過 typeof、instanceof 等縮窄確認型別，否則 TypeScript 會報錯。',
      },
      {
        order: 4,
        question: '什麼情況下應該使用 unknown 而非 any？',
        options: [
          '當你確定不需要型別安全時',
          '當你處理來自外部 API 或不確定型別的值，且想保持型別安全時',
          '當你想完全繞過 TypeScript 的型別系統時',
          '當你需要讓程式碼相容純 JavaScript 時',
        ],
        answer: 1,
        explanation: '當資料來源不確定（例如外部 API 回應、localStorage、動態 JSON 解析），應使用 unknown。它讓你接受任意型別的值，同時強迫你在使用前進行型別縮窄，避免 any 帶來的不安全操作。',
      },
      {
        order: 5,
        question: '以下程式碼中，型別縮窄的正確寫法是哪個？\n\nfunction handle(val: unknown) { ... }',
        options: [
          'val.toString()',
          '(val as string).toUpperCase()',
          'if (typeof val === "string") { val.toUpperCase() }',
          'val!.toUpperCase()',
        ],
        answer: 2,
        explanation: '正確做法是用 typeof 做型別縮窄。使用 as 強制轉型（類型斷言）繞過型別檢查，實際上和 any 一樣不安全。非空斷言 (!) 也無法解決型別問題。typeof 是最常見且安全的縮窄方式。',
      },
    ],
  },

  {
    slug: 'ts-type-interface',
    title: 'type vs interface',
    description: '比較 type alias 與 interface 的差異，了解各自的最佳使用場景。',
    difficulty: 'medium',
    subCategory: 'Type System',
    questions: [
      {
        order: 1,
        question: 'TypeScript 中，interface 與 type 最主要的差別是什麼？',
        options: [
          'interface 只能描述物件結構；type 可以描述任何型別（聯合、元組、基本型別等）',
          'type 的執行效能比 interface 更好',
          'interface 不支援泛型，type 才支援',
          'type 不能繼承其他型別',
        ],
        answer: 0,
        explanation: 'interface 只能描述物件的形狀（包含方法和屬性）；type 更靈活，可以描述聯合型別（A | B）、元組（[string, number]）、基本型別別名（type ID = string）等任何型別。這是兩者最核心的差異。',
      },
      {
        order: 2,
        question: '以下哪個功能只有 interface 有，type 沒有？',
        options: [
          '泛型（Generics）',
          '宣告合併（Declaration Merging）',
          '聯合型別（Union Type）',
          '交叉型別（Intersection Type）',
        ],
        answer: 1,
        explanation: '宣告合併是 interface 獨有的：同名 interface 在同一作用域中會自動合併為一個型別。type 不支援，重複宣告會報錯。這個特性常見於擴充第三方套件的型別定義（如擴充 Express 的 Request 型別）。',
      },
      {
        order: 3,
        question: 'interface 繼承多個介面的正確語法是什麼？',
        options: [
          'interface C extends A implements B {}',
          'interface C extends A, B {}',
          'interface C extends A & B {}',
          'interface C extends [A, B] {}',
        ],
        answer: 1,
        explanation: 'interface 可以用 extends 繼承多個介面，語法是逗號分隔：interface C extends A, B {}。class 才用 implements；& 是 type 的交叉型別語法，不是 interface 的繼承語法。',
      },
      {
        order: 4,
        question: 'type Status = "pending" | "done" | "error" 這樣的聯合型別，用 interface 能達到嗎？',
        options: [
          '可以，interface Status extends "pending" | "done" {}',
          '不行，interface 無法直接宣告聯合型別',
          '可以，interface Status { value: "pending" | "done" | "error" }',
          '可以，interface Status = "pending" | "done" | "error" {}',
        ],
        answer: 1,
        explanation: 'interface 無法直接宣告聯合型別（Union Type）。這是 type 的專屬功能。想要 type Status = "pending" | "done" | "error" 這樣的聯合型別，只能用 type alias，不能用 interface。',
      },
      {
        order: 5,
        question: '哪個場景最適合使用 interface 而非 type？',
        options: [
          '定義字串或數字的聯合型別',
          '定義 Tuple 型別',
          '定義一個會被多個 class 實作，或多處繼承的物件契約',
          '定義函式型別的簡短別名',
        ],
        answer: 2,
        explanation: 'interface 最適合用來定義「物件契約（Object Contract）」，尤其是會被 class 實作（implements）或被其他 interface 繼承的情況。這讓程式碼的物件導向結構更清晰。聯合型別、Tuple、函式別名都更適合 type。',
      },
    ],
  },

  {
    slug: 'ts-generics',
    title: '泛型（Generics）',
    description: '學習使用泛型讓函式和型別支援多種型別，同時保持型別安全。',
    difficulty: 'medium',
    subCategory: 'Generics',
    questions: [
      {
        order: 1,
        question: '以下哪個是正確的泛型函式語法？',
        options: [
          'function identity(x: T): T { return x }',
          'function identity<T>(x: T): T { return x }',
          'function identity[T](x: T): T { return x }',
          'function<T> identity(x: T): T { return x }',
        ],
        answer: 1,
        explanation: '泛型函式的型別參數 <T> 放在函式名稱後、括號前：function identity<T>(x: T): T。第一個選項少了 <T> 宣告會報錯（T 未定義）；方括號 [] 是陣列語法不是泛型；第四個位置錯誤。',
      },
      {
        order: 2,
        question: '泛型的主要用途是什麼？',
        options: [
          '讓程式碼執行速度更快',
          '讓函式或型別能處理多種型別，同時保持型別安全和型別資訊',
          '完全取代所有 any 的使用',
          '讓程式碼更短更簡潔',
        ],
        answer: 1,
        explanation: '泛型（Generics）讓你寫出「型別參數化」的程式碼，可在呼叫時決定具體型別。它解決了 any 的問題：any 接受任何型別但丟失型別資訊；泛型接受任何型別但保留型別資訊，讓 TypeScript 能做精確的型別推斷。',
      },
      {
        order: 3,
        question: 'Array<T> 和 T[] 的關係是什麼？',
        options: [
          '完全不同的型別，不可互換',
          'Array<T> 是 T[] 的父型別',
          '兩者等效，都表示元素型別為 T 的陣列',
          'T[] 只能用於基本型別（string、number）',
        ],
        answer: 2,
        explanation: 'Array<T> 和 T[] 完全等效，只是不同的寫法。Array<number> 和 number[] 是同一個型別。實務上兩種都常見：T[] 比較簡短，Array<T> 在泛型嵌套時較清晰（如 Array<Array<number>>）。',
      },
      {
        order: 4,
        question: '以下程式碼呼叫時，T 會被推斷為什麼型別？\n\nfunction first<T>(arr: T[]): T { return arr[0] }\nfirst([1, 2, 3])',
        options: [
          'any',
          'number[]',
          'number',
          'T（保持不變）',
        ],
        answer: 2,
        explanation: 'TypeScript 會從傳入的引數 [1, 2, 3]（型別為 number[]）推斷 T 為 number。因此 first([1, 2, 3]) 的回傳型別被推斷為 number，不需要手動傳入 first<number>([1, 2, 3])。這是型別推斷（Type Inference）的自動功能。',
      },
      {
        order: 5,
        question: '泛型型別參數可以有預設值，以下哪個語法正確？',
        options: [
          'function wrap<T = string>(val: T) {}',
          'function wrap<T: string>(val: T) {}',
          'function wrap<T defaults string>(val: T) {}',
          'function wrap<T | string>(val: T) {}',
        ],
        answer: 0,
        explanation: '泛型預設型別的語法是 <T = DefaultType>，和 JavaScript 函式預設參數類似。例如 function wrap<T = string>(val: T) {} 表示若呼叫時不指定型別，T 預設為 string。冒號語法 T: string 是 extends 約束，不是預設值。',
      },
    ],
  },

  {
    slug: 'ts-generics-extends',
    title: 'extends 在泛型中的用途',
    description: '學習用 extends 為泛型加上型別約束，以及條件型別的基本概念。',
    difficulty: 'hard',
    subCategory: 'Generics',
    questions: [
      {
        order: 1,
        question: '<T extends string> 的意思是什麼？',
        options: [
          'T 必須在執行時繼承 string 類別',
          'T 的型別必須是 string 或其子型別（型別約束）',
          'T 只能是字面量 "string" 這個值',
          'T 是可選的，若省略則預設為 string',
        ],
        answer: 1,
        explanation: '<T extends string> 是型別約束（Type Constraint），表示傳入的型別 T 必須可以賦值給 string。這不是 JavaScript 的繼承，而是 TypeScript 的結構性子型別（Structural Subtyping）。例如字面量型別 "hello" 符合 extends string，但 number 不符合。',
      },
      {
        order: 2,
        question: '以下函式定義中，哪個呼叫會報 TypeScript 錯誤？\n\nfunction log<T extends { name: string }>(obj: T) {\n  console.log(obj.name)\n}',
        options: [
          'log({ name: "Alice", age: 30 })',
          'log({ name: "Bob" })',
          'log({ age: 30 })',
          'log({ name: "Carol", active: true })',
        ],
        answer: 2,
        explanation: 'T extends { name: string } 要求傳入的物件必須包含 name 屬性（字串）。{ age: 30 } 沒有 name 屬性，不符合約束，TypeScript 會報錯。其他三個選項都有 name: string，都符合約束（多餘屬性是允許的）。',
      },
      {
        order: 3,
        question: '<K extends keyof T> 的作用是什麼？',
        options: [
          'K 必須是 T 的子類別',
          'K 必須是 T 的合法屬性鍵名',
          'K 和 T 的型別必須完全相同',
          'K 只能是 string 型別',
        ],
        answer: 1,
        explanation: 'keyof T 取得物件型別 T 所有屬性鍵的聯合型別。K extends keyof T 確保 K 必須是 T 的某個屬性鍵名。常見用法：function getProperty<T, K extends keyof T>(obj: T, key: K): T[K]，這確保你只能傳入物件實際存在的屬性名稱。',
      },
      {
        order: 4,
        question: '條件型別中的 extends 是什麼意思？\n\ntype IsString<T> = T extends string ? "yes" : "no"',
        options: [
          'T 在執行時必須繼承 string 類別',
          '如果 T 可以賦值給 string，則結果為 "yes"，否則為 "no"',
          'T 等於 string',
          'T 不能是 string',
        ],
        answer: 1,
        explanation: '條件型別（Conditional Types）中的 T extends U ? X : Y 是一個型別層面的三元運算：如果 T 可以賦值給（兼容）U，結果為 X，否則為 Y。例如 IsString<string> 結果為 "yes"，IsString<number> 結果為 "no"。',
      },
      {
        order: 5,
        question: '以下程式碼的 Result 型別是什麼？\n\ntype NonNullable<T> = T extends null | undefined ? never : T\ntype Result = NonNullable<string | null | undefined>',
        options: [
          'string | null | undefined',
          'never',
          'string',
          'string | never',
        ],
        answer: 2,
        explanation: 'TypeScript 的條件型別會分配到聯合型別的每個成員（Distributive Conditional Types）。string extends null|undefined → string；null extends null|undefined → never；undefined extends null|undefined → never。結果 string | never | never 化簡為 string。',
      },
    ],
  },

  {
    slug: 'ts-enum-const',
    title: 'enum vs const',
    description: '比較 TypeScript enum 與 const 物件 + as const 的差異，了解各自的適用場景。',
    difficulty: 'medium',
    subCategory: 'Type System',
    questions: [
      {
        order: 1,
        question: 'TypeScript 的 enum 和加了 as const 的 const 物件最主要的差別是什麼？',
        options: [
          'enum 只能放數字，const 物件可以放任何值',
          'enum 在執行時會產生 JavaScript 物件；const enum 會被內聯取代，不產生物件',
          'const 物件不能搭配 as const 使用',
          '兩者完全相同，只是語法不同',
        ],
        answer: 1,
        explanation: '一般 enum 編譯後會在執行時產生一個真實的 JavaScript 物件，佔用 bundle 空間。const enum 則在編譯時把所有使用的地方直接替換成對應的值（內聯），不產生物件，效能和 bundle 大小更優。const 物件加 as const 則完全是普通 JavaScript，有利於 tree-shaking。',
      },
      {
        order: 2,
        question: '使用 as const 宣告物件有什麼效果？',
        options: [
          '物件的值可以在執行時修改',
          '所有屬性鍵會被推斷為 string 型別',
          '所有值被推斷為字面量型別（literal type），且屬性為 readonly',
          '無法用於 switch/case 語句',
        ],
        answer: 2,
        explanation: 'as const 讓物件的所有值被推斷為最窄的字面量型別。例如 { status: "pending" } as const，status 的型別是 "pending" 而非 string；且所有屬性變成 readonly，在型別層面無法修改。這和 enum 成員的行為類似，但完全是 JavaScript 原生語法。',
      },
      {
        order: 3,
        question: '數字 enum 有什麼型別安全問題？',
        options: [
          '數字 enum 不能用於 switch/case',
          '數字 enum 可以直接賦予任意數字而不報錯，型別不夠安全',
          '數字 enum 無法進行反向對映',
          '數字 enum 不支援 const enum',
        ],
        answer: 1,
        explanation: '數字 enum 有一個著名的型別漏洞：function f(x: Direction) {} 可以接受 f(999) 而不報錯，因為所有 number 都可以賦值給數字 enum。字串 enum 沒有這個問題，只有 enum 內定義的值才能通過型別檢查。這是很多人偏好字串 enum 或 const 物件的原因之一。',
      },
      {
        order: 4,
        question: '如何取得 const 物件（加 as const）所有值的聯合型別？',
        options: [
          'typeof STATUS',
          'keyof STATUS',
          'typeof STATUS[keyof typeof STATUS]',
          'STATUS[keyof STATUS]',
        ],
        answer: 2,
        explanation: '取得 const 物件所有值的聯合型別：typeof STATUS 取得物件型別；keyof typeof STATUS 取得所有鍵的聯合；typeof STATUS[keyof typeof STATUS] 取得所有值的聯合型別。這個模式很常用，等效於 enum 中每個成員值的聯合。',
      },
      {
        order: 5,
        question: '哪個場景最適合用 const 物件 + as const 取代 enum？',
        options: [
          '需要數字自動遞增的情況（如 0, 1, 2, 3）',
          '需要反向對映（通過值查找鍵名）',
          '要在 JavaScript 和 TypeScript 環境共用，且希望 tree-shaking 能移除未用到的常數',
          '在 .d.ts 型別宣告文件中定義常數',
        ],
        answer: 2,
        explanation: 'const 物件 + as const 完全是普通 JavaScript，不需要 TypeScript 編譯器特殊處理，可以在 JS/TS 混用環境共享。同時打包工具（如 webpack、rollup）能對 const 物件進行 tree-shaking，移除未使用的常數；enum 則通常會整個保留在 bundle 中。',
      },
    ],
  },

  {
    slug: 'ts-function-overload',
    title: 'Function Overload（函式多載）',
    description: '學習 TypeScript 函式多載，讓函式根據不同參數型別給出精確的型別推斷。',
    difficulty: 'hard',
    subCategory: 'Function Types',
    questions: [
      {
        order: 1,
        question: 'TypeScript 的函式多載（Function Overload）是什麼？',
        options: [
          '在執行時根據參數數量自動選擇不同的實作（像 JavaScript 的 arguments）',
          '為同一個函式定義多個呼叫簽名，讓 TypeScript 根據傳入參數推斷精確的回傳型別',
          '定義多個同名函式，各有完整的獨立實作',
          '讓函式可以被繼承和覆寫',
        ],
        answer: 1,
        explanation: 'TypeScript 的函式多載是一個純型別層面的功能：你為同一個函式定義多個「簽名宣告」（只有型別，沒有實作），然後寫一個包含實作的「實作簽名」。TypeScript 根據你傳入的引數型別選擇最匹配的簽名，給出精確的回傳型別。執行時仍然只有一個函式。',
      },
      {
        order: 2,
        question: '函式多載的正確寫法是哪個？',
        options: [
          '寫多個完整的同名函式，各自有實作',
          '先列出多個簽名宣告，最後寫一個實作簽名（Implementation Signature）',
          '用 | 連接所有參數型別就夠了，不需要多載',
          '用泛型 <T> 完全取代多載',
        ],
        answer: 1,
        explanation: 'TypeScript 函式多載的標準寫法是：先列出多個「宣告簽名」（只有型別，無實作），最後寫一個「實作簽名」包含實際邏輯。實作簽名的參數型別必須相容所有宣告簽名。注意：TypeScript 和 C++/Java 的多載不同，不能有多個完整的同名函式。',
      },
      {
        order: 3,
        question: '以下多載中，實作簽名（最後一個函式）可以從外部直接用 format(3) 呼叫嗎？\n\nfunction format(x: string): string\nfunction format(x: number): string\nfunction format(x: string | number): string { return String(x) }',
        options: [
          '可以，它是最後定義的簽名，優先權最高',
          '不行，實作簽名是內部使用的，外部呼叫只能匹配宣告簽名',
          '只能在同一個 .ts 檔案內呼叫',
          '視 strictMode 設定而定',
        ],
        answer: 1,
        explanation: '實作簽名（Implementation Signature）對外不可見，只用於定義實際的函式邏輯。外部呼叫只會匹配前面的宣告簽名。這個設計的目的是讓實作簽名可以用寬鬆的聯合型別，而對外暴露精確的型別映射。',
      },
      {
        order: 4,
        question: '函式多載相較於直接使用聯合型別（如 x: string | number），主要優勢是什麼？',
        options: [
          '執行效能更好',
          '可以根據輸入型別精確推斷輸出型別，而非回傳聯合型別',
          '程式碼更短',
          '可以定義更多的參數',
        ],
        answer: 1,
        explanation: '用聯合型別時，不管傳入什麼，回傳型別永遠是聯合型別，呼叫端需要再做斷言。用多載則可以精確映射：傳入 string → 回傳 string[]；傳入 number → 回傳 number[]。呼叫端直接得到精確型別，不需要額外處理。',
      },
      {
        order: 5,
        question: '哪個情況最適合使用函式多載？',
        options: [
          '所有情況的參數和回傳型別都相同',
          '函式行為根據參數型別不同而不同，且希望有精確的型別推斷',
          '需要使用預設參數值',
          '需要使用 rest parameters (...args)',
        ],
        answer: 1,
        explanation: '函式多載最適合「根據輸入型別，輸出型別也不同」的情況。例如：傳入 string 回傳 string[]、傳入 number 回傳 number[]。如果回傳型別都相同，通常直接用聯合型別參數就夠了，不需要多載。預設參數和 rest parameters 本身有各自的語法，不需要多載。',
      },
    ],
  },
]

async function seed() {
  console.log(`新增 TypeScript 主題子類別...`)
  for (const sub of subCategories) {
    await db
      .insert(schema.themeSubCategories)
      .values({ theme: THEME, name: sub.name, order: sub.order })
      .onConflictDoUpdate({
        target: [schema.themeSubCategories.theme, schema.themeSubCategories.name],
        set: { order: sub.order },
      })
    console.log(`  ✓ ${sub.name}`)
  }

  console.log(`\n新增 ${topics.length} 個 TypeScript 主題及題目...`)
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

  console.log('\n✅ TypeScript 主題建立完成')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
