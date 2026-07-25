import { config } from 'dotenv'
config({ path: '.env.local' })
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../lib/db/schema'

const client = neon(process.env.DATABASE_URL!)
const db = drizzle(client, { schema })

const THEME = 'TypeScript'

const newSubCategories = [
  { name: 'Type Narrowing', order: 4 },
  { name: 'Advanced Types', order: 5 },
  { name: 'Class & OOP', order: 6 },
  { name: 'Module & Declaration', order: 7 },
  { name: 'Config & Engineering', order: 8 },
  { name: 'React + TypeScript', order: 9 },
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
  // ─── Type System ───────────────────────────────────────────────
  {
    slug: 'ts-basic-types',
    title: '基本型別一覽',
    description: '認識 void、never、null、undefined 的差異，以及 TypeScript 獨有的型別概念。',
    difficulty: 'easy',
    subCategory: 'Type System',
    questions: [
      {
        order: 1,
        question: 'TypeScript 中 void 和 undefined 的差別是什麼？',
        options: [
          'void 和 undefined 完全相同，可互換使用',
          'void 表示函式不回傳有意義的值，undefined 是一個具體的值型別',
          'void 只能用在函式參數，undefined 只能用在回傳型別',
          'void 是 undefined 的父型別，兩者不能互換',
        ],
        answer: 1,
        explanation: 'void 通常用於標示「函式沒有回傳值」，是一種意圖表達。undefined 是一個具體的型別/值。函式標注 void 回傳型別時，呼叫端不應依賴其回傳值；但標注 undefined 時，函式必須明確 return undefined。',
      },
      {
        order: 2,
        question: '以下哪個敘述正確描述了 never 型別？',
        options: [
          'never 和 void 相同，都代表沒有回傳值',
          'never 代表「永遠不會發生」的型別，是所有型別的子型別（Bottom Type）',
          'never 只能用於錯誤處理函式',
          'never 是 any 的相反，代表空物件型別',
        ],
        answer: 1,
        explanation: 'never 是 TypeScript 的 Bottom Type，代表永遠不可能有值的狀態。常見場景：永遠拋出錯誤的函式、無窮迴圈函式、窮舉檢查中的剩餘分支。作為底型別，never 可以賦值給任何型別，但沒有任何型別（除了 never 本身）能賦值給 never。',
      },
      {
        order: 3,
        question: '在 strictNullChecks 開啟的情況下，以下哪個賦值會報錯？',
        options: [
          'let x: string | null = null',
          'let y: undefined = undefined',
          'let z: string = null',
          'let w: null = null',
        ],
        answer: 2,
        explanation: '開啟 strictNullChecks 後，null 和 undefined 不再是所有型別的子型別。因此 let z: string = null 會報錯，因為 null 無法賦值給 string。若要允許 null，需明確宣告為 string | null。',
      },
      {
        order: 4,
        question: '以下函式回傳型別應該是什麼？\n\nfunction throwError(msg: string) {\n  throw new Error(msg)\n}',
        options: [
          'void',
          'undefined',
          'never',
          'Error',
        ],
        answer: 2,
        explanation: '永遠拋出錯誤的函式回傳型別應標注為 never，因為它永遠不會正常結束並回傳值。void 表示函式有結束但沒有回傳值；never 表示函式根本不會正常結束（拋出錯誤或無窮迴圈）。',
      },
      {
        order: 5,
        question: 'TypeScript 中哪個型別是所有型別的父型別（Top Type）？',
        options: [
          'any',
          'object',
          'unknown',
          'any 和 unknown 都是',
        ],
        answer: 3,
        explanation: 'any 和 unknown 都是 TypeScript 的 Top Type（頂型別），任何型別的值都可以賦值給它們。主要差別在於使用：any 完全繞過型別檢查；unknown 在操作前必須做型別縮窄。相較之下，never 是 Bottom Type（底型別）。',
      },
    ],
  },

  {
    slug: 'ts-type-assertion',
    title: '型別斷言（Type Assertion）',
    description: '學習 as 和非空斷言 ! 的用途、風險，以及何時該用型別守衛取代斷言。',
    difficulty: 'medium',
    subCategory: 'Type System',
    questions: [
      {
        order: 1,
        question: '型別斷言（Type Assertion）的主要作用是什麼？',
        options: [
          '在執行時將值轉換為另一種型別（如 Java 的 casting）',
          '告訴 TypeScript 編譯器「我比你更清楚這個值的型別」，跳過型別檢查',
          '自動縮窄聯合型別',
          '讓 null 值變成非 null',
        ],
        answer: 1,
        explanation: '型別斷言是純編譯期行為，不做任何執行時轉換。它只是告訴 TypeScript「把這個值當作指定型別處理」。不同於 Java/C# 的 casting，TypeScript 的斷言不會改變值本身，也不會在執行時拋出錯誤（但若斷言錯誤，執行時可能出現預期外的行為）。',
      },
      {
        order: 2,
        question: '非空斷言運算子 ! 的用途是什麼？\n\nconst el = document.getElementById("app")!',
        options: [
          '確保 el 在執行時一定不是 null，如果是 null 會自動拋出錯誤',
          '告訴 TypeScript el 的型別不包含 null 或 undefined，移除這兩個型別',
          '將 el 的型別從 HTMLElement | null 轉換為 any',
          '與 !! 相同，強制轉換為 boolean',
        ],
        answer: 1,
        explanation: '非空斷言 ! 只在型別層面告訴 TypeScript「這個值不會是 null 或 undefined」。它不做執行時檢查——如果值實際上是 null，依然會在執行時出錯。因此應謹慎使用，確定值不會為 null 時才用，或改用 if 判斷做安全處理。',
      },
      {
        order: 3,
        question: '什麼情況下需要使用雙重斷言（Double Assertion）？\n\nconst x = foo as unknown as Bar',
        options: [
          '當你想讓斷言更安全時',
          '當兩個型別沒有足夠交集，無法直接用 as 互轉時',
          '當值是 any 型別時',
          '雙重斷言是不合法的 TypeScript 語法',
        ],
        answer: 1,
        explanation: 'TypeScript 要求型別斷言的兩個型別之間必須有足夠的交集。若 A 和 B 型別差異太大（完全無關），直接 A as B 會報錯。解法是先 as unknown（unknown 是頂型別，和任何型別都相容），再 as B。這樣可以強制轉型，但風險更高，應謹慎使用。',
      },
      {
        order: 4,
        question: 'as const 和 as SomeType 的主要差別是什麼？',
        options: [
          '兩者相同，都是型別斷言',
          'as const 將值的型別縮窄為最窄的字面量型別且 readonly；as SomeType 是斷言為指定型別',
          'as const 只能用在物件，as SomeType 可用在任何值',
          'as const 是執行時操作，as SomeType 是編譯期操作',
        ],
        answer: 1,
        explanation: 'as const 是一個特殊的 const 斷言：它將值的所有內容縮窄為最窄的字面量型別，且所有屬性變成 readonly。例如 { a: 1 } as const 的型別是 { readonly a: 1 } 而非 { a: number }。as SomeType 則是把值斷言為指定型別，可能放寬也可能縮窄型別。',
      },
      {
        order: 5,
        question: '以下哪個做法比型別斷言更安全？',
        options: [
          '使用 any 型別',
          '使用雙重斷言 as unknown as T',
          '使用型別守衛（Type Guard）搭配 if 判斷做型別縮窄',
          '使用 @ts-ignore 忽略錯誤',
        ],
        answer: 2,
        explanation: '型別守衛（Type Guard）在執行時做真正的型別檢查，不只是告訴編譯器「相信我」。例如 if (typeof x === "string") 在執行時確認型別，縮窄後的型別在該分支中是安全的。型別斷言是跳過檢查，型別守衛是做真正的驗證，後者更安全。',
      },
    ],
  },

  {
    slug: 'ts-union-intersection',
    title: '聯合型別 vs 交叉型別',
    description: '掌握 | 和 & 的語意差別，以及在物件型別和基本型別上的不同行為。',
    difficulty: 'medium',
    subCategory: 'Type System',
    questions: [
      {
        order: 1,
        question: '聯合型別 A | B 表示什麼？',
        options: [
          '同時具有 A 和 B 的所有屬性',
          '值可以是 A 型別或 B 型別（其中之一）',
          'A 繼承 B 的所有屬性',
          'A 和 B 的公共屬性',
        ],
        answer: 1,
        explanation: '聯合型別 A | B 表示值可以是 A 或 B 其中之一，類似「或」的關係。使用聯合型別的值時，TypeScript 只允許存取 A 和 B 共同擁有的屬性（因為無法確定值是哪一個），除非先做型別縮窄。',
      },
      {
        order: 2,
        question: '交叉型別 A & B 表示什麼？',
        options: [
          '值只能是 A 和 B 的交集（共有部分）',
          '值同時具有 A 和 B 的所有屬性（合併）',
          '值可以是 A 或 B',
          'A 和 B 的差集',
        ],
        answer: 1,
        explanation: '交叉型別 A & B 類似「且」的關係，結果型別同時擁有 A 和 B 的所有屬性。常用於 Mixin 模式或組合多個 interface：type AdminUser = User & Admin。對於基本型別，A & B 通常得到 never（例如 string & number = never）。',
      },
      {
        order: 3,
        question: '以下程式碼中，可以存取哪些屬性而不報錯？\n\ntype A = { x: number; y: string }\ntype B = { y: string; z: boolean }\nfunction f(val: A | B) { ... }',
        options: [
          'val.x、val.y、val.z 都可以',
          '只有 val.y（A 和 B 的共同屬性）',
          '只有 val.x',
          '沒有屬性可以直接存取',
        ],
        answer: 1,
        explanation: '聯合型別的值只能安全存取兩個型別的「交集屬性」（兩者都有的屬性）。A | B 中，只有 y 是 A 和 B 共同擁有的屬性，因此只有 val.y 不會報錯。存取 val.x 或 val.z 會報錯，因為 TypeScript 無法確定 val 是 A 還是 B。',
      },
      {
        order: 4,
        question: 'type C = A & B 後，C 型別包含哪些屬性？\n\ntype A = { x: number; y: string }\ntype B = { y: string; z: boolean }',
        options: [
          '只有 y（交集）',
          'x、y、z 全部（聯集）',
          '只有 x 和 z（差集）',
          'never（無法同時滿足）',
        ],
        answer: 1,
        explanation: '交叉型別 A & B 產生的型別必須同時滿足 A 和 B，因此包含兩者所有屬性：{ x: number; y: string; z: boolean }。若同名屬性型別不同（如 A 有 y: string，B 有 y: number），則該屬性會是 string & number = never，導致整個型別實際上不可能建立。',
      },
      {
        order: 5,
        question: '什麼場景最適合用交叉型別（&）？',
        options: [
          '表示多個狀態之一（如載入中、成功、失敗）',
          '組合多個 interface 的功能（Mixin 模式）',
          '縮窄函式參數的型別範圍',
          '處理可為 null 的值',
        ],
        answer: 1,
        explanation: '交叉型別最常用於 Mixin 模式：將多個 interface 的屬性合併成一個型別。例如 type SerializableUser = User & Serializable & Loggable，讓 SerializableUser 同時具備三個 interface 的所有屬性。聯合型別則適合表示「多選一」的狀態。',
      },
    ],
  },

  {
    slug: 'ts-literal-types',
    title: '字面量型別（Literal Types）',
    description: '了解字面量型別的推斷規則、as const 的作用，以及 Template Literal Types 的基礎。',
    difficulty: 'medium',
    subCategory: 'Type System',
    questions: [
      {
        order: 1,
        question: '以下兩個宣告，a 和 b 的型別分別是什麼？\n\nconst a = "hello"\nlet b = "hello"',
        options: [
          'a: string，b: string',
          'a: "hello"，b: string',
          'a: "hello"，b: "hello"',
          'a: string，b: "hello"',
        ],
        answer: 1,
        explanation: 'const 宣告的變數不能被重新賦值，TypeScript 會推斷為最窄的字面量型別 "hello"。let 宣告的變數可以被重新賦值為任何字串，TypeScript 推斷為較寬的 string 型別。這是字面量型別縮窄的基本規則。',
      },
      {
        order: 2,
        question: '字面量型別的聯合（Union of Literals）最常見的用途是什麼？',
        options: [
          '取代所有 string 型別的使用',
          '限制變數只能是特定幾個值之一（類似 Enum）',
          '讓字串可以被任意修改',
          '定義函式的泛型約束',
        ],
        answer: 1,
        explanation: 'type Direction = "left" | "right" | "up" | "down" 這樣的字面量聯合型別非常常見，用於限制值只能是指定的幾個選項。這比 string 型別更安全，TypeScript 會在你傳入錯誤值時報錯。比 enum 更輕量，是許多人的首選替代方案。',
      },
      {
        order: 3,
        question: 'satisfies 運算子（TypeScript 4.9+）的主要用途是什麼？',
        options: [
          '和 as 相同，是型別斷言的另一種寫法',
          '驗證值符合某個型別，但保留推斷出的最窄型別',
          '讓值變成 readonly',
          '只能用在常數（const）宣告',
        ],
        answer: 1,
        explanation: 'satisfies 讓你驗證值符合某個型別，同時保留 TypeScript 推斷出的最窄型別。例如 const palette = { red: [255, 0, 0] } satisfies Record<string, number[]>：TypeScript 驗證 palette 符合 Record 結構，但 palette.red 的型別仍是 number[]（而非 number[]，即保留陣列細節）。用 as 則會失去細節。',
      },
      {
        order: 4,
        question: '以下物件中，加了 as const 後 status 的型別是什麼？\n\nconst config = { status: "active" } as const',
        options: [
          'string',
          '"active"',
          'readonly string',
          'const string',
        ],
        answer: 1,
        explanation: 'as const 將所有值縮窄為最窄的字面量型別，並使屬性變為 readonly。因此 config.status 的型別是字面量 "active"，而非 string。整個 config 的型別是 { readonly status: "active" }，嘗試修改 config.status 會在型別層面報錯。',
      },
      {
        order: 5,
        question: 'Template Literal Types 的語法是什麼？\n\n讓型別 EventName 自動產生 "onClick" | "onChange" | "onFocus"',
        options: [
          'type EventName = "on" + ("Click" | "Change" | "Focus")',
          'type EventName = `on${\"Click\" | \"Change\" | \"Focus\"}`',
          'type EventName = concat<"on", "Click" | "Change" | "Focus">',
          'type EventName = "on" & ("Click" | "Change" | "Focus")',
        ],
        answer: 1,
        explanation: 'Template Literal Types 使用反引號語法，和 JavaScript 模板字串相同：`on${\"Click\" | \"Change\" | \"Focus\"}` 會自動展開成 "onClick" | "onChange" | "onFocus"。TypeScript 會對聯合型別中的每個成員做笛卡爾積展開，這在產生事件名稱、API 路徑等場景非常有用。',
      },
    ],
  },

  {
    slug: 'ts-optional-readonly',
    title: '可選屬性 ? 與 readonly',
    description: '理解可選屬性和唯讀屬性的行為差異，以及它們在實務開發中的正確使用方式。',
    difficulty: 'easy',
    subCategory: 'Type System',
    questions: [
      {
        order: 1,
        question: '可選屬性 ? 代表什麼？\n\ninterface User { name: string; age?: number }',
        options: [
          'age 只能是 number，不能是其他型別',
          'age 屬性可以不存在，若存在則型別為 number',
          'age 的型別是 number | null',
          'age 的值必須大於 0',
        ],
        answer: 1,
        explanation: '可選屬性 ? 讓該屬性的型別等同於 number | undefined，且屬性本身可以不存在於物件中。{ name: "Alice" } 和 { name: "Alice", age: 30 } 都符合 User 型別。注意：可選屬性 age? 和 age: number | undefined 有細微差別——前者屬性可以完全不存在，後者屬性必須存在但值可以是 undefined。',
      },
      {
        order: 2,
        question: 'readonly 修飾符的作用是什麼？\n\ninterface Point { readonly x: number; readonly y: number }',
        options: [
          '讓屬性在執行時無法被修改（Object.freeze）',
          '讓屬性在型別層面無法重新賦值（只是編譯期限制）',
          '讓屬性變成私有，外部無法存取',
          '讓屬性的型別自動變成字面量型別',
        ],
        answer: 1,
        explanation: 'readonly 只是編譯期的型別限制，不影響執行時行為。TypeScript 會阻止你在型別層面修改 readonly 屬性，但編譯後的 JavaScript 中屬性依然可以被修改。若要真正的執行時不可變，需要 Object.freeze()。',
      },
      {
        order: 3,
        question: 'Readonly<T> utility type 和手動加 readonly 有什麼差別？',
        options: [
          '完全相同，只是語法不同',
          'Readonly<T> 將 T 的所有屬性一次加上 readonly，手動只能一個個加',
          'Readonly<T> 是深層 readonly，手動是淺層',
          'Readonly<T> 只能用於 interface，不能用於 type',
        ],
        answer: 1,
        explanation: 'Readonly<T> 是一個映射型別，將 T 的所有屬性一次性加上 readonly。手動加 readonly 需要逐個屬性處理。注意：Readonly<T> 是淺層的（Shallow），不會遞迴處理巢狀物件的屬性。若需要深層 readonly，需要自行實作 DeepReadonly<T>。',
      },
      {
        order: 4,
        question: '可選屬性 age? 和 age: number | undefined 有什麼實際差別？',
        options: [
          '完全相同，可以互換使用',
          '可選屬性 age? 允許屬性完全不存在；age: number | undefined 屬性必須存在但值可為 undefined',
          '只有 age? 可以在解構時給預設值',
          'age: number | undefined 更嚴格，優先使用',
        ],
        answer: 1,
        explanation: '在 exactOptionalPropertyTypes 設定開啟時差別明顯：age? 允許屬性鍵完全不出現在物件中；age: number | undefined 要求屬性鍵必須存在，但值可以是 undefined。例如 {} 符合 { age? }，但不符合 { age: number | undefined }（缺少 age 鍵）。',
      },
      {
        order: 5,
        question: 'readonly 陣列（ReadonlyArray<T> 或 readonly T[]）有什麼限制？',
        options: [
          '無法讀取陣列元素',
          '無法使用會修改陣列的方法（如 push、pop、splice）',
          '陣列長度固定，無法改變',
          '陣列元素必須是基本型別',
        ],
        answer: 1,
        explanation: 'readonly T[] 讓陣列的變動方法（push、pop、splice、sort 等）在型別層面無法呼叫。但讀取方法（map、filter、slice、forEach 等）仍可使用。這常用於函式參數，表示「我不會修改這個陣列」的意圖，比傳入普通陣列更安全。',
      },
    ],
  },

  {
    slug: 'ts-index-signature',
    title: '索引簽名（Index Signature）',
    description: '學習索引簽名的語法、限制，以及與 Record<K, V> 的比較。',
    difficulty: 'medium',
    subCategory: 'Type System',
    questions: [
      {
        order: 1,
        question: '以下索引簽名的意思是什麼？\n\ninterface StringMap { [key: string]: string }',
        options: [
          '只有一個屬性，鍵名是 "key"，值是 string',
          '可以有任意數量的屬性，鍵名是 string，值必須是 string',
          '這是語法錯誤',
          '所有屬性的值都是 string，但鍵名必須是數字',
        ],
        answer: 1,
        explanation: '索引簽名 [key: string]: string 表示這個物件可以有任意數量的屬性，只要鍵名是 string，值必須是 string 型別。key 只是參數名稱，可以命名為任何名字。這讓物件可以動態新增屬性，但犧牲了明確屬性的型別安全。',
      },
      {
        order: 2,
        question: '索引簽名有什麼重要限制？\n\ninterface Mixed {\n  [key: string]: string\n  count: number  // ← 這行會報錯嗎？\n}',
        options: [
          '不會報錯，一切正常',
          '會報錯：明確屬性（count: number）必須與索引簽名的值型別（string）相容',
          '會報錯：不能同時有索引簽名和明確屬性',
          '只有在 strict 模式下才會報錯',
        ],
        answer: 1,
        explanation: '當 interface 同時有索引簽名和明確屬性時，明確屬性的值型別必須是索引簽名值型別的子型別。[key: string]: string 限制所有值為 string，但 count: number 的值是 number，不是 string 的子型別，因此報錯。解法是改為 [key: string]: string | number。',
      },
      {
        order: 3,
        question: 'Record<string, string> 和 { [key: string]: string } 有何不同？',
        options: [
          '完全相同，只是語法不同',
          'Record 不允許明確屬性，索引簽名允許',
          '行為上基本相同；Record 更簡潔，索引簽名可以在 interface 中擴充',
          'Record 在執行時有類型檢查，索引簽名沒有',
        ],
        answer: 2,
        explanation: 'Record<string, string> 和 { [key: string]: string } 在型別上幾乎等效。主要差別在使用情境：Record 是 Utility Type，通常用於 type alias；索引簽名可以在 interface 中使用並搭配明確屬性擴充。兩者都是純編譯期型別，沒有執行時差異。',
      },
      {
        order: 4,
        question: '以下存取是否安全？為什麼？\n\nconst map: { [key: string]: number } = {}\nconst val = map["nonexistent"]',
        options: [
          '安全，val 的型別是 number，存取不存在的鍵回傳 undefined',
          '不安全：val 的型別被推斷為 number，但實際上是 undefined（型別與執行時不符）',
          '安全，TypeScript 會自動縮窄型別為 number | undefined',
          '這會在執行時拋出 KeyError',
        ],
        answer: 1,
        explanation: '這是索引簽名的已知型別安全問題。TypeScript 預設將 map["nonexistent"] 推斷為 number，但執行時實際上是 undefined。開啟 noUncheckedIndexedAccess 設定可以讓 TypeScript 自動把索引結果型別改為 number | undefined，強迫你處理不存在的情況。',
      },
      {
        order: 5,
        question: '什麼場景最適合使用索引簽名？',
        options: [
          '屬性名稱和數量在撰寫程式時已知',
          '屬性名稱在執行時才確定（如 API 回應、動態字典）',
          '需要嚴格限制特定屬性名稱的情況',
          '需要讓所有屬性變為 readonly',
        ],
        answer: 1,
        explanation: '索引簽名適合屬性名稱在編譯時未知、執行時動態決定的場景，例如：解析任意 JSON 物件、建立字典（dictionary）或快取（cache）物件、處理動態 API 回應。若屬性名稱已知，應改用明確屬性定義，型別更安全。',
      },
    ],
  },

  {
    slug: 'ts-tuple',
    title: '元組型別（Tuple）',
    description: '認識元組的特性、具名元組語法，以及元組在函式回傳值中的應用。',
    difficulty: 'medium',
    subCategory: 'Type System',
    questions: [
      {
        order: 1,
        question: '元組（Tuple）和陣列（Array）的主要差別是什麼？',
        options: [
          '元組只能放基本型別，陣列可以放任何型別',
          '元組的長度和每個位置的型別是固定的；陣列長度不固定，每個元素型別相同',
          '元組是 readonly 的，陣列是 mutable 的',
          '元組不能使用 spread 運算子',
        ],
        answer: 1,
        explanation: '元組是一個長度固定、每個位置有明確型別的陣列。例如 [string, number] 表示第一個元素必須是 string，第二個必須是 number，且只有兩個元素。陣列 string[] 表示任意數量的 string 元素。元組提供更精確的位置型別資訊。',
      },
      {
        order: 2,
        question: '以下哪個是具名元組（Named Tuple）的正確語法？',
        options: [
          'type Point = { x: number, y: number }[]',
          'type Point = [x: number, y: number]',
          'type Point = (x: number, y: number)',
          'type Point = <x: number, y: number>',
        ],
        answer: 1,
        explanation: '具名元組（Named Tuple）在 TypeScript 4.0+ 支援，語法是 [name: type, ...]。這讓元組的每個位置有明確的名稱，提升可讀性（hover 時會顯示名稱）。例如 type RGB = [red: number, green: number, blue: number]。具名只是文件用途，不影響型別結構。',
      },
      {
        order: 3,
        question: 'React 的 useState hook 為什麼回傳元組而非物件？\n\nconst [count, setCount] = useState(0)',
        options: [
          '因為物件不能解構',
          '因為元組允許使用者自由命名，比固定屬性名稱的物件更靈活',
          '因為元組比物件效能更好',
          '因為 TypeScript 不支援解構物件',
        ],
        answer: 1,
        explanation: '回傳元組讓呼叫端可以自由命名：const [count, setCount] = useState(0) 或 const [name, setName] = useState("")。若回傳物件（如 { value, setValue }），使用者就得用固定的屬性名稱或解構重新命名，較不靈活。這是自訂 Hook 回傳元組的主要理由。',
      },
      {
        order: 4,
        question: '元組中可以使用 rest elements 嗎？\n\ntype StringsAndNumber = [...string[], number]',
        options: [
          '不行，元組長度必須固定',
          '可以，rest element 可以放在元組的開頭或中間或結尾',
          '可以，但 rest element 只能放在最後',
          '可以，但 rest element 只能放在最前',
        ],
        answer: 1,
        explanation: 'TypeScript 4.2+ 支援元組的 leading rest elements 和 middle rest elements。[...string[], number] 表示末尾是 number，前面是任意數量的 string。[string, ...number[], boolean] 也合法。這讓元組可以表達更複雜的固定結構。',
      },
      {
        order: 5,
        question: '如何正確標注回傳元組的自訂 Hook？\n\nfunction useToggle(init: boolean) {\n  const [on, setOn] = useState(init)\n  return [on, setOn]\n}',
        options: [
          '不需要標注，TypeScript 會自動推斷',
          '回傳型別會被推斷為 (boolean | Dispatch<...>)[]，需明確標注為 [boolean, Dispatch<...>] 或加 as const',
          '需要改用物件回傳才能有型別安全',
          'TypeScript 無法推斷 Hook 的回傳型別',
        ],
        answer: 1,
        explanation: 'TypeScript 會把 [on, setOn] 推斷為陣列型別 (boolean | Dispatch<SetStateAction<boolean>>)[]，而非精確的元組。解法有兩個：1) 明確標注回傳型別 ): [boolean, Dispatch<...>]；2) 在 return 後加 as const 讓 TypeScript 推斷為元組。建議明確標注，更清楚。',
      },
    ],
  },

  {
    slug: 'ts-keyof-typeof',
    title: 'keyof 與 typeof 操作符',
    description: '掌握 keyof 取得物件鍵聯合型別、typeof 取得值的型別，以及兩者結合的常見模式。',
    difficulty: 'medium',
    subCategory: 'Type System',
    questions: [
      {
        order: 1,
        question: 'keyof T 的結果是什麼？\n\ntype User = { id: number; name: string; email: string }\ntype UserKeys = keyof User',
        options: [
          '{ id: number; name: string; email: string }',
          '"id" | "name" | "email"',
          'number | string',
          'string[]',
        ],
        answer: 1,
        explanation: 'keyof T 取得型別 T 所有屬性鍵的聯合型別（Union of Keys）。keyof User 結果為字面量聯合型別 "id" | "name" | "email"。常與泛型搭配使用，例如 K extends keyof T 確保 K 是 T 的合法鍵名。',
      },
      {
        order: 2,
        question: '在型別位置使用 typeof 有什麼作用？\n\nconst config = { host: "localhost", port: 3000 }\ntype Config = typeof config',
        options: [
          '等同於 JavaScript 的 typeof，回傳 "object"',
          '取得 config 這個值的 TypeScript 型別，結果為 { host: string; port: number }',
          '讓 Config 成為 config 的別名',
          '只能在 .d.ts 檔案中使用',
        ],
        answer: 1,
        explanation: 'typeof 在型別位置（type alias 或型別標注中）是 TypeScript 的型別操作符，取得值的型別。typeof config 結果為 { host: string; port: number }。這和 JavaScript 執行時的 typeof 不同（JS 的 typeof 回傳字串如 "object"）。常用於從現有值自動推斷型別。',
      },
      {
        order: 3,
        question: '如何取得函式的回傳型別？',
        options: [
          'type R = typeof myFunc.returnType',
          'type R = ReturnType<typeof myFunc>',
          'type R = myFunc extends () => infer R ? R : never',
          'type R = keyof typeof myFunc',
        ],
        answer: 1,
        explanation: 'ReturnType<T> 是內建 Utility Type，結合 typeof 可取得函式的回傳型別：ReturnType<typeof myFunc>。先用 typeof 取得函式的型別，再用 ReturnType 提取回傳型別。這在需要根據函式推斷型別，而不想手動寫死型別時非常有用。',
      },
      {
        order: 4,
        question: '索引存取型別（Indexed Access Type）的語法是什麼？\n\n取得 User 型別中 name 屬性的型別',
        options: [
          'User.name',
          'User["name"]',
          'User[name]',
          'keyof User["name"]',
        ],
        answer: 1,
        explanation: '索引存取型別使用方括號語法 T["key"]，和 JavaScript 物件存取相似但在型別層面操作。User["name"] 取得 User 的 name 屬性型別（string）。也可以用聯合型別：User["name" | "email"] 得到 string | string = string。',
      },
      {
        order: 5,
        question: 'typeof STATUS[keyof typeof STATUS] 這個模式的用途是什麼？\n\nconst STATUS = { active: "active", inactive: "inactive" } as const',
        options: [
          '取得 STATUS 物件所有鍵的聯合型別',
          '取得 STATUS 物件所有值的聯合型別',
          '讓 STATUS 變成 readonly',
          '檢查 STATUS 是否符合特定型別',
        ],
        answer: 1,
        explanation: '這是從 const 物件取得值聯合型別的標準模式：typeof STATUS 取得物件型別；keyof typeof STATUS 取得 "active" | "inactive"；typeof STATUS[keyof typeof STATUS] 取得對應值 "active" | "inactive"。等效於 enum 的成員值聯合，是取代 enum 的常用模式。',
      },
    ],
  },

  // ─── Type Narrowing ─────────────────────────────────────────────
  {
    slug: 'ts-type-narrowing',
    title: '型別縮窄（Type Narrowing）',
    description: '學習用 typeof、instanceof、in 和控制流分析縮窄聯合型別，寫出型別安全的程式碼。',
    difficulty: 'medium',
    subCategory: 'Type Narrowing',
    questions: [
      {
        order: 1,
        question: 'typeof 型別守衛能縮窄哪些型別？',
        options: [
          '所有 TypeScript 型別',
          '基本型別：string、number、boolean、bigint、symbol、undefined、function、object',
          '只有 string 和 number',
          '所有 class 型別',
        ],
        answer: 1,
        explanation: 'typeof 的結果只有這幾種字串："string"、"number"、"boolean"、"bigint"、"symbol"、"undefined"、"function"、"object"。注意 typeof null === "object"（JavaScript 歷史遺留問題），因此 typeof 無法區分 null 和一般物件，需要另外用 === null 判斷。',
      },
      {
        order: 2,
        question: 'instanceof 型別守衛適合用在哪種情況？',
        options: [
          '縮窄基本型別（string、number）',
          '縮窄 class 實例的型別（檢查是否由某個建構子建立）',
          '縮窄 interface 型別',
          '縮窄聯合型別中的字面量型別',
        ],
        answer: 1,
        explanation: 'instanceof 檢查值是否由特定建構子建立，適合 class 型別。例如 if (err instanceof Error) 縮窄後 err 的型別為 Error。注意：instanceof 不適用於 interface（interface 在執行時不存在），需要用 in 或自訂型別守衛處理 interface。',
      },
      {
        order: 3,
        question: 'in 運算子型別守衛的作用是什麼？\n\nif ("swim" in animal) { ... }',
        options: [
          '檢查 animal 陣列是否包含 "swim"',
          '檢查 animal 物件是否有 swim 屬性，並縮窄型別',
          '只能用於 class，不能用於 interface',
          '相當於 typeof animal.swim !== "undefined"',
        ],
        answer: 1,
        explanation: 'in 運算子檢查屬性是否存在於物件中，TypeScript 用它縮窄聯合型別。若 Fish 有 swim 屬性、Bird 有 fly 屬性，if ("swim" in animal) 分支內 animal 型別被縮窄為 Fish。這是處理有不同屬性的聯合型別時的常用方式。',
      },
      {
        order: 4,
        question: '自訂型別守衛（Custom Type Guard）的語法是什麼？',
        options: [
          'function isString(x: unknown): x is string { return typeof x === "string" }',
          'function isString(x: unknown): boolean { return typeof x === "string" }',
          'function isString(x: unknown): asserts string { return typeof x === "string" }',
          'function isString(x: unknown) { if (typeof x !== "string") throw Error() }',
        ],
        answer: 0,
        explanation: '自訂型別守衛使用 x is Type 回傳型別語法。當函式回傳 true 時，TypeScript 將 x 的型別縮窄為 Type。回傳普通 boolean 的函式不會觸發型別縮窄。asserts 則是另一個功能（Assertion Functions），表示「如果函式正常結束，則斷言成立」。',
      },
      {
        order: 5,
        question: '什麼是控制流分析（Control Flow Analysis）？',
        options: [
          '一個需要手動呼叫的 TypeScript API',
          'TypeScript 根據程式控制流（if/else、return、throw）自動縮窄型別',
          '只在 strictMode 下才啟用的功能',
          '分析程式效能的工具',
        ],
        answer: 1,
        explanation: 'TypeScript 自動分析控制流，根據 if/else、switch、return、throw 等語句自動縮窄型別。例如 if (x === null) return 之後的程式碼，TypeScript 知道 x 不可能是 null，會自動移除 null 型別。這讓你在很多情況下不需要手動型別斷言。',
      },
    ],
  },

  {
    slug: 'ts-discriminated-union',
    title: '判別聯合型別（Discriminated Union）',
    description: '掌握 Discriminated Union 模式，用共同的判別屬性讓 TypeScript 精確縮窄複雜的聯合型別。',
    difficulty: 'medium',
    subCategory: 'Type Narrowing',
    questions: [
      {
        order: 1,
        question: '什麼是 Discriminated Union（判別聯合型別）？',
        options: [
          '只包含基本型別的聯合型別',
          '每個成員都有一個共同的「判別屬性」（字面量型別），可用來縮窄型別',
          '可以被 TypeScript 自動合併的 interface',
          '用 | 連接超過三個型別的聯合型別',
        ],
        answer: 1,
        explanation: 'Discriminated Union 是一個模式：聯合型別的每個成員都有一個共同屬性（discriminant），且每個成員的該屬性是唯一的字面量型別。例如 type Shape = Circle | Square，其中 Circle 有 kind: "circle"，Square 有 kind: "square"。透過判斷 kind 屬性，TypeScript 能精確縮窄型別。',
      },
      {
        order: 2,
        question: '以下型別中，最好的判別屬性（discriminant）應該是哪個？\n\ntype Success = { status: "success"; data: string }\ntype Error = { status: "error"; message: string }',
        options: [
          'data（只有 Success 有）',
          'status（兩者都有，且值是不同的字面量型別）',
          'message（只有 Error 有）',
          '沒有合適的判別屬性',
        ],
        answer: 1,
        explanation: '判別屬性需要兩個條件：1) 每個聯合成員都有這個屬性；2) 每個成員的屬性值是不同的字面量型別。status 符合這兩個條件：Success 的 status 是 "success"，Error 的 status 是 "error"。用 if (result.status === "success") 就能讓 TypeScript 縮窄型別。',
      },
      {
        order: 3,
        question: 'switch 配合 Discriminated Union 的主要優點是什麼？',
        options: [
          '執行速度比 if/else 更快',
          'TypeScript 可以在每個 case 分支中精確縮窄型別，且 default 分支可做窮舉檢查',
          '只有 switch 能使用 Discriminated Union',
          '可以省略型別標注',
        ],
        answer: 1,
        explanation: 'switch (shape.kind) 中，每個 case 分支 TypeScript 會自動縮窄型別：case "circle" 分支中 shape 型別為 Circle，case "square" 中為 Square。且 default 分支中若所有成員都已處理，TypeScript 會推斷型別為 never，可用來做窮舉檢查，確保沒有漏掉的 case。',
      },
      {
        order: 4,
        question: 'Redux Action 使用 Discriminated Union 的好處是什麼？',
        options: [
          '讓 reducer 執行速度更快',
          '每個 action type 在 reducer 的對應 case 中，payload 型別會被自動縮窄，無需型別斷言',
          '可以省略 action creator 函式',
          '讓 action 可以在不同 reducer 之間共享',
        ],
        answer: 1,
        explanation: 'Redux 中定義 type Action = IncrementAction | DecrementAction | ResetAction，每個 Action 有唯一的 type 字面量。在 reducer 的 switch case 中，TypeScript 自動縮窄：case "INCREMENT" 分支內 action 型別為 IncrementAction，可安全存取其特定 payload，不需要 as 斷言。',
      },
      {
        order: 5,
        question: '如果新增了一個聯合型別成員但忘記在 switch 中處理，如何讓 TypeScript 報錯？',
        options: [
          'TypeScript 會自動報錯，不需要額外設定',
          '在 default 分支中用 never 做窮舉檢查：const _exhaustive: never = action',
          '設定 noImplicitReturns: true',
          '改用 if/else 鏈代替 switch',
        ],
        answer: 1,
        explanation: '窮舉檢查（Exhaustive Check）模式：在 switch default 分支中把值賦給 never 型別的變數。若所有聯合成員都在 switch 中被處理，default 分支的值型別就是 never，賦值合法；若有漏掉的成員，default 分支的值型別不是 never，賦值報錯，強迫你補上漏掉的 case。',
      },
    ],
  },

  {
    slug: 'ts-never-exhaustive',
    title: 'never 型別與窮舉檢查',
    description: '深入了解 never 作為 Bottom Type 的特性，以及如何用它實現編譯期的窮舉安全。',
    difficulty: 'hard',
    subCategory: 'Type Narrowing',
    questions: [
      {
        order: 1,
        question: 'never 作為「Bottom Type」是什麼意思？',
        options: [
          'never 是所有型別的父型別（Top Type）',
          'never 是所有型別的子型別，可以賦值給任何型別，但沒有任何值能賦值給 never',
          'never 表示值為 null 或 undefined',
          'never 只在條件型別中使用',
        ],
        answer: 1,
        explanation: 'Bottom Type（底型別）是型別系統中最低層的型別，是所有型別的子型別。never 可以賦值給任何型別（因為底型別是任何型別的子集），但沒有任何普通值能賦值給 never（因為 never 代表「不可能存在的值的型別」）。這個特性讓它在窮舉檢查中非常有用。',
      },
      {
        order: 2,
        question: '以下 union 化簡後的結果是什麼？\n\ntype Result = string | never',
        options: [
          'never',
          'string',
          'string | never',
          '編譯錯誤',
        ],
        answer: 1,
        explanation: 'never 是所有型別的子型別（Bottom Type）。在聯合型別中，never 是「加法的零元素」——string | never = string，因為 never 集合是空集合，加上空集合不改變結果。類似地，交叉型別中 string & never = never（空集合的交集還是空集合）。',
      },
      {
        order: 3,
        question: 'assertNever 函式如何實現窮舉安全？\n\nfunction assertNever(x: never): never {\n  throw new Error("Unexpected value: " + x)\n}',
        options: [
          '它在執行時自動檢查所有可能的值',
          '在 switch default 分支呼叫 assertNever(value)，若有未處理的聯合成員，編譯時 value 型別不是 never，TypeScript 報錯',
          '它讓所有聯合成員都繼承自 never',
          '它只在開發模式下有效',
        ],
        answer: 1,
        explanation: 'assertNever 的參數是 never 型別。在 switch 的 default 分支中呼叫 assertNever(shape)：若所有 case 都已處理，default 分支的 shape 型別確實是 never，傳入合法；若新增了聯合成員但忘記加 case，default 的 shape 有剩餘型別，不是 never，TypeScript 在編譯時報錯。',
      },
      {
        order: 4,
        question: '在條件型別中，never 有什麼特殊行為？\n\ntype Exclude<T, U> = T extends U ? never : T',
        options: [
          '當 T 是聯合型別時，never 分支會讓整個結果變成 never',
          '條件型別分配到聯合型別的每個成員，never 分支被過濾掉，只保留非 never 的結果',
          'never 在條件型別中無效，必須用 undefined 代替',
          'Exclude 的結果永遠是 never',
        ],
        answer: 1,
        explanation: '條件型別有「分配律」：對聯合型別的每個成員個別應用條件型別，再把結果做聯合。在最終聯合中，never 分支被自動過濾掉（因為 X | never = X）。這就是 Exclude<string | number, string> = number 的原理：string extends string → never（過濾）；number extends string → number（保留）。',
      },
      {
        order: 5,
        question: '以下函式的回傳型別應標注為什麼？\n\nfunction infiniteLoop(): ??? {\n  while (true) {}\n}',
        options: [
          'void',
          'undefined',
          'never',
          'any',
        ],
        answer: 2,
        explanation: '無窮迴圈的函式永遠不會正常結束並回傳值，因此回傳型別應標注為 never（而非 void）。void 表示「函式有結束，但不回傳有意義的值」；never 表示「函式根本不會結束」。TypeScript 在很多情況下可以自動推斷出 never，但明確標注可以讓意圖更清晰。',
      },
    ],
  },

  // ─── Advanced Types ─────────────────────────────────────────────
  {
    slug: 'ts-utility-types',
    title: '內建 Utility Types',
    description: '熟練使用 Partial、Required、Pick、Omit、Record、Exclude、Extract 等常用工具型別。',
    difficulty: 'medium',
    subCategory: 'Advanced Types',
    questions: [
      {
        order: 1,
        question: 'Partial<T> 的作用是什麼？',
        options: [
          '讓 T 的所有屬性變成 readonly',
          '讓 T 的所有屬性變成可選（?）',
          '只保留 T 的部分屬性',
          '讓 T 的所有屬性變成 required',
        ],
        answer: 1,
        explanation: 'Partial<T> 將型別 T 的所有屬性都加上 ?，使它們全部變成可選。常見用途：更新操作的 patch 參數（只需要傳部分欄位）、測試假資料（不需要填寫所有欄位）。實作原理：{ [K in keyof T]?: T[K] }。',
      },
      {
        order: 2,
        question: 'Pick<T, K> 和 Omit<T, K> 的差別是什麼？',
        options: [
          '完全相同，只是參數順序不同',
          'Pick 選取指定屬性；Omit 排除指定屬性（保留其餘屬性）',
          'Pick 只能用於 interface；Omit 只能用於 type',
          'Pick 是 Omit 的反向操作，只能選一個使用',
        ],
        answer: 1,
        explanation: 'Pick<User, "name" | "email"> 建立只含 name 和 email 的新型別（選取）。Omit<User, "password"> 建立排除 password 的新型別（排除）。當需要保留的屬性少時用 Pick；需要排除的屬性少時用 Omit。兩者都可以達到相同效果，選擇哪個取決於哪個更簡潔。',
      },
      {
        order: 3,
        question: 'Exclude<T, U> 和 Extract<T, U> 各做什麼？',
        options: [
          'Exclude 提取 T 中可賦值給 U 的型別；Extract 排除這些型別',
          'Exclude 從 T 中移除可賦值給 U 的型別；Extract 保留可賦值給 U 的型別',
          '兩者都是物件型別操作，不適用於聯合型別',
          'Exclude 和 Omit 相同；Extract 和 Pick 相同',
        ],
        answer: 1,
        explanation: 'Exclude<string | number | boolean, string> = number | boolean（從聯合中移除 string）。Extract<string | number | boolean, string | number> = string | number（保留聯合中屬於 string | number 的部分）。兩者都作用於聯合型別成員，而 Pick/Omit 作用於物件屬性。',
      },
      {
        order: 4,
        question: 'Record<K, V> 最適合用於什麼場景？',
        options: [
          '定義陣列型別',
          '建立鍵型別為 K、值型別為 V 的物件型別（字典/映射）',
          '替代 Map 資料結構',
          '定義函式的參數型別',
        ],
        answer: 1,
        explanation: 'Record<K, V> 建立鍵為 K（必須是 string、number、symbol 或其字面量聯合）、值為 V 的物件型別。常見用途：Record<string, number>（任意字串鍵對應數字值）；Record<"north" | "south" | "east" | "west", number>（固定四個方向的距離）。比索引簽名更簡潔，且鍵可以限制為字面量聯合。',
      },
      {
        order: 5,
        question: 'Required<T> 和 NonNullable<T> 的差別是什麼？',
        options: [
          '兩者相同，都是移除 undefined 和 null',
          'Required<T> 移除所有 ? 可選標記；NonNullable<T> 從型別中移除 null 和 undefined',
          'Required<T> 適用於物件型別；NonNullable<T> 適用於聯合型別',
          'Required<T> 是 Partial<T> 的相反',
        ],
        answer: 1,
        explanation: 'Required<T> 移除 T 所有屬性的 ? 可選標記，讓所有屬性都變成必填。NonNullable<T> 從型別 T 中移除 null 和 undefined（用於聯合型別）。例如 NonNullable<string | null | undefined> = string。兩者解決不同問題：Required 處理可選屬性，NonNullable 處理可空型別。',
      },
    ],
  },

  {
    slug: 'ts-mapped-types',
    title: 'Mapped Types（映射型別）',
    description: '學習用 keyof 和 in 遍歷型別屬性，用 -? 和 -readonly 修改修飾符，以及 as 重命名鍵。',
    difficulty: 'hard',
    subCategory: 'Advanced Types',
    questions: [
      {
        order: 1,
        question: '以下映射型別的作用是什麼？\n\ntype MyPartial<T> = { [K in keyof T]?: T[K] }',
        options: [
          '讓 T 的所有屬性變成 readonly',
          '遍歷 T 的所有鍵，為每個鍵加上 ? 可選標記，值型別保持不變（實現 Partial）',
          '讓 T 的所有值型別變成 any',
          '複製 T 的型別（等效於 T 本身）',
        ],
        answer: 1,
        explanation: '[K in keyof T] 遍歷 T 的每個鍵 K，?: T[K] 表示該屬性是可選的，值型別為 T[K]（索引存取取得原本的值型別）。這就是 Partial<T> 的底層實作。映射型別是許多 Utility Types 的基礎，理解它可以讓你自訂各種型別轉換。',
      },
      {
        order: 2,
        question: '-? 和 -readonly 修飾符的作用是什麼？',
        options: [
          '-? 表示可選；-readonly 表示唯讀',
          '-? 移除可選（讓屬性變必填）；-readonly 移除 readonly（讓屬性可寫）',
          '-? 和 ? 相同；-readonly 和 readonly 相同',
          '這兩個語法不合法',
        ],
        answer: 1,
        explanation: '在映射型別中，前綴 - 表示「移除」修飾符。-? 移除 ? 可選標記（讓屬性變必填），這是 Required<T> 的實作原理：{ [K in keyof T]-?: T[K] }。-readonly 移除 readonly 標記（讓屬性可寫）：{ -readonly [K in keyof T]: T[K] }。相反地，加 + 是加上修飾符（預設行為）。',
      },
      {
        order: 3,
        question: '映射型別中 as 子句的用途是什麼？\n\ntype Getters<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] }',
        options: [
          '型別斷言，確保值符合型別',
          '重命名映射後的鍵名（Key Remapping）',
          '過濾不需要的屬性',
          '讓映射型別支援泛型',
        ],
        answer: 1,
        explanation: 'as 子句在映射型別中用於重命名鍵（Key Remapping，TypeScript 4.1+）。例如把 name 映射為 getName。在 as 子句中可以用 Template Literal Types 轉換鍵名，或用條件型別過濾（返回 never 的鍵會被移除）。這讓映射型別更加靈活。',
      },
      {
        order: 4,
        question: '如何用映射型別過濾掉值為函式的屬性？',
        options: [
          '{ [K in keyof T]: T[K] extends Function ? K : never }',
          '{ [K in keyof T as T[K] extends Function ? never : K]: T[K] }',
          '{ [K in keyof T]: T[K] extends Function ? never : T[K] }',
          '{ [K in Exclude<keyof T, Function>]: T[K] }',
        ],
        answer: 1,
        explanation: '在 as 子句中用條件型別：as T[K] extends Function ? never : K。當屬性值型別是 Function 時，鍵被映射為 never（在映射型別中，never 鍵會被自動移除）；其他屬性保持原鍵名。這實現了「只保留非函式屬性」的效果。',
      },
      {
        order: 5,
        question: '深層 Readonly（DeepReadonly）和 Readonly<T> 的差別是什麼？',
        options: [
          '完全相同，Readonly<T> 就是深層的',
          'Readonly<T> 只讓第一層屬性 readonly；DeepReadonly 遞迴讓所有巢狀屬性都 readonly',
          'DeepReadonly 是 TypeScript 內建的，Readonly<T> 需要手動實作',
          'DeepReadonly 只適用於陣列型別',
        ],
        answer: 1,
        explanation: 'Readonly<T> 是淺層的：只讓 T 的直接屬性變為 readonly，巢狀物件的屬性仍可修改。DeepReadonly 需要手動實作，使用遞迴映射型別：type DeepReadonly<T> = { readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K] }。TypeScript 沒有內建 DeepReadonly。',
      },
    ],
  },

  {
    slug: 'ts-conditional-types',
    title: '條件型別（Conditional Types）',
    description: '學習條件型別的語法、分配律（Distributive）行為，以及結合 infer 的進階用法。',
    difficulty: 'hard',
    subCategory: 'Advanced Types',
    questions: [
      {
        order: 1,
        question: '條件型別的基本語法和意義是什麼？\n\ntype IsString<T> = T extends string ? "yes" : "no"',
        options: [
          '在執行時檢查 T 是否是字串',
          '在型別層面判斷：若 T 可賦值給 string，結果為 "yes"，否則為 "no"',
          '只能用 string 作為條件',
          '條件型別只能在 class 內使用',
        ],
        answer: 1,
        explanation: '條件型別 T extends U ? X : Y 是型別系統的三元運算子。在編譯期判斷 T 是否可賦值給 U（即 T 是否是 U 的子型別）。若是，結果型別為 X；否則為 Y。這是純型別層面的邏輯，不影響執行時。',
      },
      {
        order: 2,
        question: 'Distributive（分配）條件型別的行為是什麼？\n\ntype ToArray<T> = T extends any ? T[] : never\ntype Result = ToArray<string | number>',
        options: [
          'Result 是 (string | number)[]',
          'Result 是 string[] | number[]（聯合型別被分配到每個成員）',
          'Result 是 never',
          'Result 是 any[]',
        ],
        answer: 1,
        explanation: '當條件型別的 T 是裸型別參數（naked type parameter）且傳入聯合型別時，TypeScript 會「分配」到每個成員：ToArray<string | number> = ToArray<string> | ToArray<number> = string[] | number[]。若不想要分配行為，可以用 [T] extends [any] ? T[] : never 包裹 T。',
      },
      {
        order: 3,
        question: '如何阻止條件型別的分配行為？',
        options: [
          '使用 strict: false 設定',
          '將型別參數用方括號包裹：[T] extends [U] ? X : Y',
          '使用 & 代替 extends',
          '分配行為無法阻止',
        ],
        answer: 1,
        explanation: '用方括號包裹 T 讓它不再是裸型別參數：[T] extends [U] ? X : Y。這樣傳入聯合型別時不會觸發分配，T 被視為整體。例如 type IsNever<T> = [T] extends [never] ? true : false，若不加方括號，IsNever<never> 會因分配得到 never 而非 true。',
      },
      {
        order: 4,
        question: '內建的 Exclude<T, U> 是如何實作的？',
        options: [
          'type Exclude<T, U> = T & U',
          'type Exclude<T, U> = T extends U ? never : T',
          'type Exclude<T, U> = T | U',
          'type Exclude<T, U> = Omit<T, keyof U>',
        ],
        answer: 1,
        explanation: 'Exclude<T, U> = T extends U ? never : T 利用條件型別的分配律：對 T 的每個聯合成員，若它可賦值給 U，則結果為 never（被過濾掉）；否則保留。Exclude<string | number | boolean, string> = (string → never) | (number → number) | (boolean → boolean) = number | boolean。',
      },
      {
        order: 5,
        question: '巢狀條件型別（Nested Conditional Types）有什麼注意事項？',
        options: [
          'TypeScript 不支援巢狀條件型別',
          '多層巢狀會讓型別計算複雜度指數上升，應考慮用映射型別或其他方式重構',
          '巢狀層數不能超過 3 層',
          '巢狀條件型別只能在泛型函式中使用',
        ],
        answer: 1,
        explanation: '巢狀條件型別雖然合法，但多層巢狀會讓型別推斷複雜度急劇上升，TypeScript 可能報 "Type instantiation is excessively deep" 錯誤。建議拆分成多個輔助型別（type alias）、使用映射型別，或配合 infer 簡化邏輯。',
      },
    ],
  },

  {
    slug: 'ts-infer',
    title: 'infer 關鍵字',
    description: '學習在條件型別中用 infer 捕捉並提取型別，實作 ReturnType、Awaited 等進階型別工具。',
    difficulty: 'hard',
    subCategory: 'Advanced Types',
    questions: [
      {
        order: 1,
        question: 'infer 關鍵字只能在哪裡使用？',
        options: [
          '只能在泛型函式的參數中',
          '只能在條件型別（T extends ... ? ... : ...）的 extends 子句中',
          '可以在任何型別標注中使用',
          '只能在映射型別（Mapped Types）中使用',
        ],
        answer: 1,
        explanation: 'infer 是條件型別專屬語法，只能出現在 T extends SomeType<infer U> ? ... : ... 的 extends 部分。它讓 TypeScript 在型別匹配時「推斷」並捕捉某個型別位置的實際型別，賦予名稱（如 U）供後續使用。',
      },
      {
        order: 2,
        question: 'ReturnType<T> 是如何用 infer 實作的？',
        options: [
          'type ReturnType<T> = T extends (...args: any[]) => any ? T : never',
          'type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never',
          'type ReturnType<T> = typeof T extends Function ? T() : never',
          'type ReturnType<T> = T["return"]',
        ],
        answer: 1,
        explanation: 'T extends (...args: any[]) => infer R ? R : never：若 T 是函式型別，TypeScript 在匹配時推斷回傳型別並賦給 R，然後在 true 分支中回傳 R。若 T 不是函式型別，結果為 never。infer R 的位置就是我們想捕捉的型別所在位置。',
      },
      {
        order: 3,
        question: '如何提取 Promise<T> 的內層型別 T？',
        options: [
          'type Awaited<T> = T["value"]',
          'type Awaited<T> = T extends Promise<infer U> ? U : T',
          'type Awaited<T> = T extends Promise<any> ? any : T',
          'type Awaited<T> = ReturnType<T>',
        ],
        answer: 1,
        explanation: 'T extends Promise<infer U> ? U : T：若 T 是 Promise<U>，infer U 捕捉泛型參數型別，回傳 U；若 T 不是 Promise，直接回傳 T。TypeScript 內建的 Awaited<T> 是遞迴版本，能處理 Promise<Promise<string>> 等多層 Promise。',
      },
      {
        order: 4,
        question: '如何用 infer 提取函式的第一個參數型別？',
        options: [
          'type FirstArg<T> = T extends (first: infer F, ...rest: any[]) => any ? F : never',
          'type FirstArg<T> = T extends (...args: infer A) => any ? A[0] : never',
          '以上兩種都正確',
          '以上兩種都錯誤',
        ],
        answer: 2,
        explanation: '兩種方法都正確：第一種直接在第一個參數位置用 infer F 捕捉。第二種先用 infer A 捕捉所有參數的元組型別，再用 A[0] 取第一個元素。第一種更直接；第二種更靈活（可以取任意位置的參數）。',
      },
      {
        order: 5,
        question: '在條件型別的 false 分支中可以使用 infer 捕捉的型別嗎？',
        options: [
          '可以，infer 捕捉的型別在整個條件型別中都可用',
          '不行，infer 捕捉的型別只在 true 分支中可用',
          '可以，但需要加上 ?',
          '視 TypeScript 版本而定',
        ],
        answer: 1,
        explanation: 'infer 捕捉的型別（如 infer R）只在條件型別的 true 分支中可用。false 分支無法存取 infer 宣告的型別，因為在 false 分支中匹配並未成功，型別未被推斷。若需要在 false 分支使用，需要另外設計條件型別。',
      },
    ],
  },

  {
    slug: 'ts-template-literal-types',
    title: 'Template Literal Types',
    description: '掌握模板字面量型別的語法，學習 Uppercase、Capitalize 等內建字串型別工具，以及聯合型別的笛卡爾積展開。',
    difficulty: 'hard',
    subCategory: 'Advanced Types',
    questions: [
      {
        order: 1,
        question: 'Template Literal Types 的基本語法是什麼？',
        options: [
          '使用 + 連接字串型別：type T = "hello" + "world"',
          '使用反引號和 ${}：type T = `hello${"world"}`',
          '使用 concat<> 泛型',
          '使用 string & "prefix"',
        ],
        answer: 1,
        explanation: 'Template Literal Types 和 JavaScript 模板字串完全相同的語法，但在型別層面操作：`prefix${T}`。T 可以是任何型別（string、number、boolean、bigint、null、undefined），TypeScript 會自動將非字串型別轉換為字串表示。',
      },
      {
        order: 2,
        question: '以下型別的結果是什麼？\n\ntype Color = "red" | "blue"\ntype Size = "sm" | "lg"\ntype Variant = `${Color}-${Size}`',
        options: [
          '"red-sm" | "blue-lg"（只有對角組合）',
          '"red-sm" | "red-lg" | "blue-sm" | "blue-lg"（完整笛卡爾積）',
          '"red" | "blue" | "sm" | "lg"（聯合合併）',
          '"red-blue-sm-lg"（所有值串接）',
        ],
        answer: 1,
        explanation: '當 Template Literal Types 中包含聯合型別時，TypeScript 自動計算笛卡爾積：每個位置的每個成員都與其他位置的成員組合。2 個顏色 × 2 個尺寸 = 4 個組合。這在產生事件名稱、CSS class 名稱、API 路徑等場景非常強大。',
      },
      {
        order: 3,
        question: 'TypeScript 內建哪些字串操作 Utility Types？',
        options: [
          'ToUpper<T>、ToLower<T>、Trim<T>',
          'Uppercase<T>、Lowercase<T>、Capitalize<T>、Uncapitalize<T>',
          'StringUpper<T>、StringLower<T>',
          '沒有內建，需要自己用條件型別實作',
        ],
        answer: 1,
        explanation: 'TypeScript 內建四個字串 Utility Types：Uppercase<T> 轉全大寫、Lowercase<T> 轉全小寫、Capitalize<T> 首字大寫、Uncapitalize<T> 首字小寫。這些在 Template Literal Types 中很常用，例如產生 getter 名稱：`get${Capitalize<K>}` 把 name 轉為 getName。',
      },
      {
        order: 4,
        question: 'Template Literal Types 結合 infer 可以做什麼？',
        options: [
          '只能拼接字串，無法解析',
          '可以解構字串型別，提取特定格式字串的片段',
          '讓字串在執行時自動轉換型別',
          'infer 不能在 Template Literal Types 中使用',
        ],
        answer: 1,
        explanation: 'Template Literal Types 結合 infer 可以解析字串格式。例如 type GetRoute<T> = T extends `/api/${infer Route}` ? Route : never，可以從 "/api/users" 提取出 "users"。這讓你可以做型別層面的字串解析，在路由型別、i18n 鍵名等場景很有用。',
      },
      {
        order: 5,
        question: 'Template Literal Types 最適合哪種實際應用場景？',
        options: [
          '替代所有字串型別',
          '產生事件名稱（如 "onChange"、"onClick"）、CSS class 變體、API 路徑的精確型別',
          '替代 enum 的所有使用場景',
          '只用於產生型別文件',
        ],
        answer: 1,
        explanation: 'Template Literal Types 最有價值的場景：1) DOM 事件名稱 `on${Capitalize<K>}`；2) CSS class 變體（`btn-${Size}-${Variant}`）；3) 物件方法名稱 getter/setter（`get${Capitalize<K>}`）；4) API 路徑格式驗證；5) i18n 翻譯鍵的自動完成。它讓這些原本只能是 string 的場景有了精確的型別約束。',
      },
    ],
  },
]

async function seed() {
  console.log('新增 TypeScript 子類別...')
  for (const sub of newSubCategories) {
    await db
      .insert(schema.themeSubCategories)
      .values({ theme: THEME, name: sub.name, order: sub.order })
      .onConflictDoUpdate({
        target: [schema.themeSubCategories.theme, schema.themeSubCategories.name],
        set: { order: sub.order },
      })
    console.log(`  ✓ ${sub.name}`)
  }

  console.log(`\n新增 ${topics.length} 個主題...`)
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

  console.log('\n✅ 第一批完成（主題 1–15）')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
