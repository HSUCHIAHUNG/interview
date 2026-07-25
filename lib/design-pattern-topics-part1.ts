import type { DesignPatternEntry } from './design-pattern-topics-types'

export const part1Topics: DesignPatternEntry[] = [
  // ─── OOP 物件導向程式設計 ─────────────────────────────────────────────────
  {
    slug: 'oop-basics',
    title: 'OOP 物件導向程式設計',
    description: '了解封裝、繼承、多型、抽象四大核心概念，以及 OOP 的優缺點',
    subCategory: '程式設計範式',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: 'OOP 四大核心特性',
          content: `| 特性 | 英文 | 說明 |
|------|------|------|
| **封裝** | Encapsulation | 將資料與操作資料的方法包裝在一起，隱藏內部實作細節 |
| **繼承** | Inheritance | 子類別繼承父類別的屬性與方法，達到程式碼重用 |
| **多型** | Polymorphism | 相同介面，不同類別有不同的實作行為 |
| **抽象** | Abstraction | 隱藏複雜實作，只暴露必要的介面給外部使用 |

\`\`\`ts
// 封裝：私有屬性，透過公開方法存取
class BankAccount {
  private balance: number = 0  // 外部無法直接存取

  deposit(amount: number) {
    if (amount > 0) this.balance += amount
  }

  getBalance() {
    return this.balance
  }
}

// 繼承：子類別繼承父類別
class Animal {
  speak() { return '...' }
}

class Dog extends Animal {
  speak() { return '汪汪！' }  // 多型：覆寫父類別方法
}
\`\`\``,
        },
        {
          heading: 'JavaScript 中的 OOP：ES6 class 語法糖',
          content: `JavaScript 本質是**原型鏈（Prototype-based）**語言，ES6 的 \`class\` 只是語法糖：

\`\`\`js
// ES6 class 語法（語法糖）
class Person {
  constructor(name) {
    this.name = name
  }
  greet() {
    return \`我是 \${this.name}\`
  }
}

// 等價的原型寫法（實際運作方式）
function Person(name) {
  this.name = name
}
Person.prototype.greet = function() {
  return \`我是 \${this.name}\`
}
\`\`\`

**class vs prototype-based：**
- **class-based**（Java、C#）：類別是物件的藍圖，物件從類別實例化
- **prototype-based**（JavaScript）：物件直接繼承自另一個物件（原型鏈），class 是模擬

ES6 class 雖然語法接近 class-based，但底層仍是 prototype chain。\`typeof Dog === 'function'\` 就是證據。`,
        },
        {
          heading: '繼承 vs 組合（Composition over Inheritance）',
          content: `**繼承的問題：**
- 強耦合：子類別高度依賴父類別的實作
- 脆弱基底類別問題：修改父類別可能意外破壞子類別
- 繼承層次過深時難以維護

**組合（Composition）更彈性：**

\`\`\`js
// 繼承方式（限制多：Dog 只能繼承一個父類別）
class Animal { swim() {} }
class Dog extends Animal { fetch() {} }

// 組合方式（彈性高：自由組合行為）
const canSwim = (obj) => ({
  swim: () => console.log(\`\${obj.name} 游泳\`)
})
const canFetch = (obj) => ({
  fetch: () => console.log(\`\${obj.name} 撿球\`)
})

const createDog = (name) => {
  const obj = { name }
  return { ...obj, ...canSwim(obj), ...canFetch(obj) }
}
\`\`\`

**原則：優先使用組合而非繼承（Favor Composition over Inheritance）**
React 官方也鼓勵使用組合（children、props 傳入元件）而非繼承元件。`,
        },
        {
          heading: 'OOP 的優缺點',
          content: `**優點：**
- **模組化**：每個類別職責清晰，易於理解與維護
- **程式碼重用**：繼承與組合減少重複程式碼
- **封裝**：隱藏實作細節，降低模組間耦合
- **擴充性**：透過多型，新增功能只需新增類別，不需修改現有程式碼

**缺點：**
- **過度設計**：容易設計出過於複雜的繼承層次
- **共享狀態問題**：物件的可變狀態（mutable state）難以追蹤，容易造成 bug
- **效能**：物件建立和原型鏈查找有額外開銷
- **難以平行化**：共享可變狀態在多執行緒環境危險（JavaScript 單執行緒較少這問題）`,
        },
        {
          heading: '抽象類別與介面（Abstract Class & Interface）',
          content: `**抽象（Abstraction）** 的兩種實現方式：

**TypeScript 抽象類別：**
\`\`\`ts
abstract class Shape {
  abstract getArea(): number  // 子類別必須實作

  describe() {
    return \`此形狀面積為 \${this.getArea()}\`  // 共用方法
  }
}

class Circle extends Shape {
  constructor(private radius: number) { super() }
  getArea() { return Math.PI * this.radius ** 2 }
}
\`\`\`

**TypeScript 介面（Interface）：**
\`\`\`ts
interface Printable {
  print(): void
}
interface Serializable {
  serialize(): string
}

// 一個類別可以實作多個介面（解決單繼承的限制）
class Document implements Printable, Serializable {
  print() { console.log('列印文件') }
  serialize() { return JSON.stringify(this) }
}
\`\`\`

抽象類別可以有實作方法；介面只定義契約（contract），不含實作。`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: 'OOP 四大核心特性中，「封裝（Encapsulation）」的主要目的是什麼？',
        options: [
          '讓子類別繼承父類別的方法',
          '隱藏內部實作細節，只暴露必要的公開介面',
          '讓不同類別的物件可以有相同的方法名稱但不同行為',
          '定義一個抽象的藍圖讓類別實作',
        ],
        answer: 1,
        explanation: '封裝是將資料（屬性）和操作資料的方法包裝在一起，並隱藏內部實作細節（例如用 private 修飾符）。外部只能透過公開的方法（getter/setter）存取資料。這降低了模組間的耦合，讓內部實作可以自由更改，而不影響外部使用者。',
      },
      {
        id: 2,
        question: '關於 JavaScript 的 ES6 class，以下哪個說法正確？',
        options: [
          'ES6 class 是全新的物件導向實作，底層與原型鏈無關',
          'ES6 class 只是原型鏈（prototype-based）的語法糖，底層仍是 prototype',
          'ES6 class 讓 JavaScript 成為真正的 class-based 語言',
          'typeof ClassName 的結果是 "class"',
        ],
        answer: 1,
        explanation: 'ES6 class 只是語法糖，底層仍是 JavaScript 的原型鏈機制。`typeof MyClass` 回傳的是 `"function"` 而非 "class"，這就是最好的證明。class 讓 JavaScript OOP 程式碼更易讀，但並未改變語言的 prototype-based 本質。',
      },
      {
        id: 3,
        question: '多型（Polymorphism）在程式設計中的含義是什麼？',
        options: [
          '一個類別同時繼承多個父類別',
          '相同的介面或方法名稱，在不同類別中有不同的實作行為',
          '將多個函式合併成一個函式',
          '一個物件同時具有多種資料型別',
        ],
        answer: 1,
        explanation: '多型是指相同的方法名稱（或介面），在不同的類別中有不同的實作。例如 Animal 類別的 `speak()` 方法，Dog 子類別回傳「汪汪」，Cat 子類別回傳「喵喵」。對外使用者只需呼叫 `animal.speak()`，不需知道實際是哪個子類別，這讓程式碼更有彈性和可擴展性。',
      },
      {
        id: 4,
        question: '「組合優於繼承（Composition over Inheritance）」的主要原因是什麼？',
        options: [
          '組合的程式碼執行速度比繼承快很多',
          '組合比繼承更難理解，所以更有挑戰性',
          '繼承造成強耦合，修改父類別可能破壞子類別；組合更彈性且耦合度低',
          'JavaScript 不支援繼承，只支援組合',
        ],
        answer: 2,
        explanation: '繼承的主要問題是「脆弱基底類別（Fragile Base Class）問題」：父類別的任何修改都可能意外破壞子類別。而且繼承層次深時難以維護。組合（將行為以函式或物件形式混入）耦合度低、更彈性，可以自由組合不同能力，不受單繼承限制。React 官方文件也推薦使用組合而非繼承。',
      },
      {
        id: 5,
        question: '以下哪個是 OOP「抽象（Abstraction）」的正確描述？',
        options: [
          '將所有的方法都設定為 private，外部無法存取',
          '讓子類別繼承父類別的所有屬性',
          '隱藏複雜的實作細節，只暴露必要的介面，使用者不需要知道內部如何運作',
          '讓同一個方法在不同類別有不同行為',
        ],
        answer: 2,
        explanation: '抽象是指將複雜的實作細節隱藏起來，只暴露必要的介面。例如你使用 `fetch()` 發送 HTTP 請求，不需要知道底層如何建立 TCP 連線、解析 DNS 等細節。在程式碼中，抽象類別（abstract class）和介面（interface）都是實現抽象的工具。',
      },
      {
        id: 6,
        question: 'TypeScript 中，抽象類別（abstract class）和介面（interface）的主要差異是什麼？',
        options: [
          '兩者完全相同，可以互換使用',
          '抽象類別可以包含有實作的方法；介面只定義方法簽名（契約），不含實作',
          '介面可以包含實作；抽象類別只能定義方法簽名',
          '一個類別可以繼承多個抽象類別，但只能實作一個介面',
        ],
        answer: 1,
        explanation: '抽象類別可以同時包含「已實作的方法」和「抽象方法（子類別必須實作）」，子類別只需實作抽象方法。介面只定義方法簽名（契約），不含任何實作，類別必須實作所有介面方法。一個類別只能繼承一個抽象類別，但可以實作多個介面（這解決了單繼承的限制）。',
      },
      {
        id: 7,
        question: '關於 OOP 的缺點，以下哪個說法正確？',
        options: [
          'OOP 完全沒有缺點，是最優秀的程式設計範式',
          '過深的繼承層次和共享可變狀態是 OOP 常見的設計問題',
          'OOP 程式碼永遠比函式式程式碼慢',
          'OOP 只適合小型專案，無法用於大型系統',
        ],
        answer: 1,
        explanation: 'OOP 的主要缺點包括：1) 繼承層次過深時難以維護（脆弱基底類別問題）；2) 物件的可變狀態（mutable state）難以追蹤，容易造成難以重現的 bug；3) 容易過度設計，創建出比實際需求更複雜的類別層次。函式式程式設計（FP）透過不可變性和純函式來解決可變狀態的問題。',
      },
      {
        id: 8,
        question: '以下 JavaScript 程式碼中，`Dog` 繼承了 `Animal`。請問 `dog.speak()` 呼叫的是哪個 `speak` 方法？\n\n```js\nclass Animal {\n  speak() { return "..." }\n}\nclass Dog extends Animal {\n  speak() { return "汪汪！" }\n}\nconst dog = new Dog()\ndog.speak()\n```',
        options: [
          'Animal 的 speak()，因為父類別優先',
          'Dog 的 speak()，因為子類別的方法覆寫（Override）了父類別',
          '兩個 speak() 都會被呼叫',
          '會拋出錯誤，因為方法名稱重複',
        ],
        answer: 1,
        explanation: '這是多型中的「方法覆寫（Method Overriding）」。當子類別定義了與父類別相同名稱的方法時，呼叫子類別實例的該方法會執行子類別的版本。JavaScript 的原型鏈查找順序是：先找實例本身 → 子類別 prototype → 父類別 prototype。Dog 的 speak() 遮蔽了 Animal 的 speak()，所以 `dog.speak()` 回傳 "汪汪！"。若要呼叫父類別方法，可使用 `super.speak()`。',
      },
    ],
    keyPoints: [
      'OOP 四大特性：封裝（隱藏實作）、繼承（程式碼重用）、多型（相同介面不同行為）、抽象（隱藏複雜細節）。',
      'JavaScript 的 class 是語法糖，底層仍是 prototype-based，typeof 類別回傳 "function"。',
      '多型透過方法覆寫（Override）實現；子類別方法遮蔽父類別同名方法，super 可呼叫父類別版本。',
      '組合優於繼承（Composition over Inheritance）：繼承強耦合，組合更彈性且耦合度低。',
      'OOP 缺點：繼承層次過深難以維護，共享可變狀態難以追蹤，容易過度設計。',
    ],
  },

  // ─── 函式式程式設計（FP） ──────────────────────────────────────────────────
  {
    slug: 'functional-programming',
    title: '函式式程式設計（FP）',
    description: '理解純函式、不可變性、高階函式、函式組合等 FP 核心概念與 JavaScript 實踐',
    subCategory: '程式設計範式',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: '純函式（Pure Function）',
          content: `純函式需同時滿足兩個條件：
1. **相同輸入永遠回傳相同輸出**（Deterministic）
2. **無副作用（No Side Effects）**：不修改外部狀態、不操作 DOM、不發 API 請求

\`\`\`js
// ✅ 純函式
function add(a, b) {
  return a + b  // 相同輸入永遠相同輸出，無副作用
}

// ❌ 非純函式（依賴外部變數）
let count = 0
function increment() {
  count += 1  // 副作用：修改外部狀態
  return count
}

// ❌ 非純函式（相同輸入不同輸出）
function getRandom(n) {
  return Math.random() * n  // 每次結果不同
}
\`\`\`

**純函式的好處：**可預測、易測試、易快取（Memoization）、天然支援並行。`,
        },
        {
          heading: '高階函式（Higher-Order Function）',
          content: `**高階函式**是指「接受函式作為參數」或「回傳函式」的函式。

\`\`\`js
// map：將陣列每個元素轉換
[1, 2, 3].map(x => x * 2)        // [2, 4, 6]

// filter：篩選符合條件的元素
[1, 2, 3, 4].filter(x => x % 2 === 0)  // [2, 4]

// reduce：將陣列「摺疊」成單一值
[1, 2, 3, 4].reduce((acc, x) => acc + x, 0)  // 10

// 回傳函式的高階函式（工廠函式）
function multiplier(factor) {
  return (n) => n * factor  // 回傳新函式
}
const double = multiplier(2)
const triple = multiplier(3)
double(5)  // 10
triple(5)  // 15
\`\`\`

\`map\`、\`filter\`、\`reduce\` 是 FP 三大主力，它們都是純函式（不修改原陣列）。`,
        },
        {
          heading: '柯里化（Currying）與函式組合（Composition）',
          content: `**柯里化：**將多參數函式轉換為一連串單參數函式

\`\`\`js
// 普通函式
const add = (a, b) => a + b

// 柯里化版本
const curriedAdd = (a) => (b) => a + b

curriedAdd(1)(2)   // 3
const add5 = curriedAdd(5)  // 部分應用（Partial Application）
add5(3)  // 8
\`\`\`

**函式組合（Composition）：** 將多個函式串接，前一個函式的輸出是下一個的輸入

\`\`\`js
// compose：從右到左執行
const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x)

// pipe：從左到右執行（更直觀）
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x)

const double = x => x * 2
const addOne = x => x + 1
const square = x => x * x

const transform = pipe(double, addOne, square)
transform(3)  // square(addOne(double(3))) = square(7) = 49
\`\`\``,
        },
        {
          heading: 'FP vs OOP 差異與適用場景',
          content: `| 特性 | 函式式（FP） | 物件導向（OOP） |
|------|-------------|----------------|
| 核心單位 | 函式 | 物件（類別） |
| 狀態 | 不可變（Immutable） | 可變物件狀態 |
| 副作用 | 盡量避免 | 物件方法常有副作用 |
| 資料轉換 | 輸入 → 輸出管道 | 物件接收訊息並改變狀態 |
| 並行安全 | 天然安全（無共享狀態） | 需要額外處理 |
| 學習曲線 | 較高（抽象概念多） | 較低（貼近現實世界建模） |

**適用場景：**
- **FP 適合**：資料轉換管道（ETL）、前端狀態管理（Redux）、需要高度可測試性
- **OOP 適合**：複雜領域模型（如電商：訂單、使用者、商品）、UI 元件系統

**現代開發多為混合使用：** React 本身是 OOP（Component 類別），但 Hooks 讓它更貼近 FP；Redux 是純 FP 的狀態管理。`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: '以下哪個函式是「純函式（Pure Function）」？',
        options: [
          'function getRandom() { return Math.random() }',
          'function add(a, b) { return a + b }',
          'function updateUser(user) { user.name = "Alice"; return user }',
          'function fetchData() { return fetch("/api/data") }',
        ],
        answer: 1,
        explanation: '`add(a, b)` 是純函式：相同的 a、b 輸入永遠回傳相同的加總結果，且不修改任何外部狀態（無副作用）。getRandom 每次輸出不同（非確定性）；updateUser 直接修改傳入的物件（副作用：mutation）；fetchData 是 I/O 操作，有副作用。',
      },
      {
        id: 2,
        question: '純函式（Pure Function）必須滿足哪兩個條件？',
        options: [
          '執行速度快、程式碼簡短',
          '相同輸入永遠回傳相同輸出、無副作用',
          '必須是箭頭函式、不能有參數',
          '只能使用 const 宣告、不能呼叫其他函式',
        ],
        answer: 1,
        explanation: '純函式的兩個核心條件：1) 確定性（Determinism）：相同輸入永遠產生相同輸出，不依賴外部隨機性或可變狀態；2) 無副作用（No Side Effects）：不修改外部變數、不操作 DOM、不發送網路請求、不修改傳入的參數。這兩個特性讓純函式易於測試、預測和快取。',
      },
      {
        id: 3,
        question: '以下哪個是「高階函式（Higher-Order Function）」的正確描述？',
        options: [
          '程式碼行數超過 100 行的函式',
          '使用 class 語法定義的靜態方法',
          '接受函式作為參數，或回傳一個函式的函式',
          '執行時間超過 1 秒的非同步函式',
        ],
        answer: 2,
        explanation: '高階函式是函式式程式設計的核心概念，定義是：「接受一個或多個函式作為參數」或「回傳一個函式」的函式。JavaScript 內建的 `map`、`filter`、`reduce`、`forEach` 都是高階函式（接受回呼函式作為參數）。`setTimeout` 也是高階函式。',
      },
      {
        id: 4,
        question: '`[1, 2, 3, 4, 5].filter(x => x % 2 === 0)` 的結果是？',
        options: [
          '[1, 3, 5]',
          '[2, 4]',
          '[true, false, true, false, true]',
          '[1, 2, 3, 4, 5]（filter 不會修改陣列）',
        ],
        answer: 1,
        explanation: '`filter` 回傳一個新陣列，只包含讓回呼函式回傳 `true` 的元素。`x % 2 === 0` 判斷是否為偶數，所以 2 和 4 通過篩選，結果是 `[2, 4]`。注意：`filter` 不修改原陣列（符合 FP 不可變性原則），而是回傳一個新陣列。',
      },
      {
        id: 5,
        question: '柯里化（Currying）的主要目的是什麼？',
        options: [
          '讓函式執行更快',
          '將多參數函式轉換為一連串單參數函式，支援部分應用（Partial Application）',
          '將函式轉換成物件方法',
          '消除函式中的所有副作用',
        ],
        answer: 1,
        explanation: '柯里化將 `f(a, b, c)` 轉換為 `f(a)(b)(c)` 的形式。好處是支援「部分應用」：先傳入部分參數，得到一個新函式，稍後再傳入剩餘參數。例如 `const add5 = curriedAdd(5)` 建立一個「加5」的函式，可複用於不同場景。這讓函式組合更靈活。',
      },
      {
        id: 6,
        question: '`pipe(double, addOne, square)(3)` 的執行順序是什麼？（double: x*2, addOne: x+1, square: x*x）',
        options: [
          'square(3) → addOne(9) → double(10) = 20',
          'double(3) → addOne(6) → square(7) = 49',
          '三個函式同時執行，結果合併',
          '從右到左：square(3) → addOne(9) → double(10)',
        ],
        answer: 1,
        explanation: '`pipe` 是從左到右執行（如同 Unix 管道 `|`）。所以執行順序是：double(3) = 6 → addOne(6) = 7 → square(7) = 49。`compose` 則是從右到左，`compose(square, addOne, double)(3)` 的結果相同，但讀取順序相反。pipe 通常比 compose 更直觀，因為符合程式碼從上到下的閱讀習慣。',
      },
      {
        id: 7,
        question: 'FP 和 OOP 相比，以下哪個說法正確描述了 FP 的特點？',
        options: [
          'FP 完全無法和 OOP 混合使用',
          'FP 強調不可變狀態和純函式，天然適合並行運算，OOP 強調物件和可變狀態',
          'FP 比 OOP 執行速度快 10 倍以上',
          'FP 只適合函數式語言（如 Haskell），JavaScript 無法實踐',
        ],
        answer: 1,
        explanation: 'FP 的核心是不可變資料和純函式，因為沒有共享可變狀態，天然適合並行運算。OOP 強調用物件封裝狀態和行為，物件的可變狀態在並行環境下需要額外保護。JavaScript 完全支援 FP（map、filter、reduce 等），現代開發常混合兩者：React Hooks 就是 FP 風格，Redux 是純 FP。',
      },
      {
        id: 8,
        question: '`[1, 2, 3].reduce((acc, x) => acc + x, 0)` 的結果是什麼？',
        options: [
          '[1, 2, 3]（reduce 不改變陣列）',
          '6',
          '123（字串串接）',
          '0（初始值不變）',
        ],
        answer: 1,
        explanation: '`reduce` 從左到右依序處理陣列，將累加器（acc）與當前元素（x）結合，回傳最終的單一值。初始值為 0，執行過程：acc=0, x=1 → 1；acc=1, x=2 → 3；acc=3, x=3 → 6。最終結果為 6。reduce 非常強大，map 和 filter 都可以用 reduce 實作。',
      },
    ],
    keyPoints: [
      '純函式：相同輸入永遠相同輸出 + 無副作用，可預測、易測試、易快取。',
      '高階函式：接受函式為參數或回傳函式，map、filter、reduce 是最常用的三個。',
      'map 轉換每個元素、filter 篩選元素、reduce 將陣列摺疊成單一值，三者都不修改原陣列。',
      '柯里化（Currying）支援部分應用，pipe 從左到右組合函式，compose 從右到左。',
      'FP 強調不可變性與純函式，OOP 強調物件封裝；現代 JavaScript 開發常混合兩者。',
    ],
  },

  // ─── Immutable / Immutability 不可變性 ────────────────────────────────────
  {
    slug: 'immutability',
    title: 'Immutable / Immutability 不可變性',
    description: '了解不可變性的概念、JavaScript 中的實踐方式，以及在 React 狀態管理中的重要性',
    subCategory: '程式設計範式',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: '什麼是不可變性（Immutability）',
          content: `**不可變性**是指值一旦建立就不能被修改。要「更新」資料，不是修改原值，而是**建立一個包含新值的全新物件/陣列**。

\`\`\`js
// 可變（Mutable）：直接修改原物件
const user = { name: 'Alice', age: 25 }
user.age = 26  // ❌ 直接修改原物件

// 不可變（Immutable）：回傳新物件
const updatedUser = { ...user, age: 26 }  // ✅ 建立新物件
console.log(user.age)        // 25（原物件不變）
console.log(updatedUser.age) // 26（新物件）
\`\`\`

**不可變性的好處：**
- 狀態可預測，易於追蹤
- 避免意外副作用
- 支援時間旅行除錯（Time-travel debugging）
- 易於比較狀態變化（只需比較參考，而非深度比較）`,
        },
        {
          heading: 'JavaScript 原始型別 vs 物件的可變性',
          content: `**原始型別（Primitive）天然不可變：**
\`\`\`js
let str = 'hello'
str.toUpperCase()  // 回傳新字串 'HELLO'
console.log(str)   // 'hello'（原字串不變）

let num = 5
// 所有對 num 的「修改」都是建立新值
num = num + 1  // 實際上 num 指向新的值 6
\`\`\`

**物件和陣列是可變的（Mutable）：**
\`\`\`js
const arr = [1, 2, 3]
arr.push(4)        // ❌ 直接修改原陣列
arr[0] = 99        // ❌ 直接修改元素

// 不可變的陣列操作
const newArr = [...arr, 4]           // 新增
const filtered = arr.filter(x => x !== 2)  // 刪除
const mapped = arr.map(x => x * 2)  // 修改每個元素
\`\`\`

原始型別（string、number、boolean、null、undefined、symbol、bigint）在記憶體中是值傳遞，天然不可變；物件和陣列是參考傳遞，可以被修改。`,
        },
        {
          heading: 'const 不等於不可變！',
          content: `\`const\` 只是讓**變數綁定**不可重新賦值，並非讓值本身不可變：

\`\`\`js
const user = { name: 'Alice' }
user = { name: 'Bob' }    // ❌ TypeError：不能重新賦值（const 的限制）
user.name = 'Bob'         // ✅ 合法！物件內容可以被修改

const arr = [1, 2, 3]
arr = [4, 5, 6]           // ❌ TypeError
arr.push(4)               // ✅ 合法！陣列內容可以被修改
\`\`\`

**要真正不可變，需要使用：**
- \`Object.freeze()\`（淺層凍結）
- 展開語法（Spread）建立新物件
- Immer.js 等不可變性函式庫

\`\`\`js
const frozen = Object.freeze({ x: 1, y: { z: 2 } })
frozen.x = 99      // 靜默失敗（嚴格模式下拋出錯誤）
frozen.y.z = 99    // ⚠️ 成功！freeze 只是淺層凍結，巢狀物件不受保護
\`\`\``,
        },
        {
          heading: '淺拷貝 vs 深拷貝',
          content: `**淺拷貝（Shallow Copy）：** 只複製第一層，巢狀物件仍是同一個參考

\`\`\`js
const original = { name: 'Alice', address: { city: 'Taipei' } }

// 淺拷貝方法
const shallow1 = { ...original }           // spread
const shallow2 = Object.assign({}, original)

shallow1.name = 'Bob'        // ✅ 不影響 original
shallow1.address.city = '台北'  // ❌ 影響 original！（同一個 address 參考）
\`\`\`

**深拷貝（Deep Copy）：** 複製所有層次，完全獨立

\`\`\`js
// JSON 方法（無法處理 undefined、function、循環參考）
const deep1 = JSON.parse(JSON.stringify(original))

// 現代瀏覽器原生方法（推薦）
const deep2 = structuredClone(original)  // ES2022，處理大多數情況

deep2.address.city = '台南'  // ✅ 完全不影響 original
\`\`\`

React 的 setState 推薦淺拷貝，因為 React 只需第一層的參考改變就能偵測到更新。`,
        },
        {
          heading: 'React 狀態管理中的不可變性 & Immer.js',
          content: `**為什麼 React 需要不可變性？**

React 使用**淺比較（Shallow Comparison）**判斷狀態是否改變，決定是否重新渲染：

\`\`\`js
// ❌ 錯誤：直接修改狀態，React 偵測不到變化（state 參考未改變）
const [user, setUser] = useState({ name: 'Alice', age: 25 })
user.age = 26    // 直接修改，React 不會重新渲染
setUser(user)    // 傳入同一個參考，React 認為沒有變化

// ✅ 正確：建立新物件，React 偵測到新參考
setUser({ ...user, age: 26 })  // 新物件，新參考，觸發重新渲染
\`\`\`

**Immer.js：** 讓你用「可變語法」寫出不可變更新

\`\`\`js
import produce from 'immer'

const nextState = produce(state, draft => {
  // 看起來像直接修改，但 Immer 在背後建立新物件
  draft.users[0].name = 'Bob'
  draft.users.push({ name: 'Charlie' })
})
// state 不變，nextState 是包含修改的新物件
\`\`\`

Immer.js 常用於 Redux Toolkit（RTK），RTK 的 \`createSlice\` 內部就使用 Immer，讓 reducer 可以用「可變語法」撰寫。`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: '在 JavaScript 中，以下哪個型別是「天然不可變（Immutable）」的？',
        options: [
          'Object（物件）',
          'Array（陣列）',
          'String（字串）',
          'Map',
        ],
        answer: 2,
        explanation: 'JavaScript 的原始型別（Primitive Types）天然不可變：string、number、boolean、null、undefined、symbol、bigint。字串的所有操作（如 toUpperCase()）都回傳新字串，不修改原字串。物件、陣列、Map 是引用型別（Reference Types），內容可以被直接修改。',
      },
      {
        id: 2,
        question: '以下程式碼的執行結果是什麼？\n\n```js\nconst obj = { name: "Alice" }\nobj.name = "Bob"\nconsole.log(obj.name)\n```',
        options: [
          '拋出 TypeError：const 宣告的變數不能修改',
          '"Alice"（const 保護物件內容）',
          '"Bob"（const 只阻止重新賦值，不阻止修改物件屬性）',
          'undefined',
        ],
        answer: 2,
        explanation: '`const` 只阻止「變數重新賦值」，例如 `obj = {}` 會拋出 TypeError。但 `const` 不阻止修改物件的屬性，因為變數 `obj` 本身的值（物件的記憶體位址）沒有改變，只是物件內容被修改了。所以 `obj.name = "Bob"` 完全合法，輸出 "Bob"。',
      },
      {
        id: 3,
        question: '淺拷貝（Shallow Copy）和深拷貝（Deep Copy）的差異是什麼？',
        options: [
          '淺拷貝速度快，深拷貝速度慢，功能完全相同',
          '淺拷貝只複製第一層，巢狀物件仍共用同一參考；深拷貝完全複製所有層次',
          '淺拷貝用 JSON 方法，深拷貝用 spread operator',
          '淺拷貝複製全部，深拷貝只複製部分',
        ],
        answer: 1,
        explanation: '淺拷貝（`{ ...obj }` 或 `Object.assign()`）只複製物件的第一層屬性，若屬性值是物件或陣列，則複製的是同一個記憶體參考。修改巢狀物件會影響原物件。深拷貝（`structuredClone()` 或 `JSON.parse(JSON.stringify())`）建立完全獨立的副本，修改不影響原物件。',
      },
      {
        id: 4,
        question: '為什麼 React 的狀態更新需要不可變性？',
        options: [
          'React 規定如此，沒有技術上的原因',
          'React 使用淺比較偵測狀態變化，直接修改物件不改變參考，React 無法偵測到變化',
          'React 會對狀態做深比較，不可變性讓深比較更快',
          '不可變性讓 React 可以在 Worker 執行緒中更新狀態',
        ],
        answer: 1,
        explanation: 'React 使用淺比較（shallow comparison）判斷狀態是否改變：它比較新舊 state 的物件參考（記憶體位址）。若直接修改物件（mutation），物件的參考不變，React 認為 state 沒有改變，不觸發重新渲染。正確做法是建立新物件（`{ ...state, key: newValue }`），新的物件參考讓 React 偵測到變化並重新渲染。',
      },
      {
        id: 5,
        question: '以下哪種方法是「不可變」地在陣列末尾新增元素的正確方式？',
        options: [
          'arr.push(newItem)',
          'arr[arr.length] = newItem',
          '[...arr, newItem]',
          'arr.append(newItem)',
        ],
        answer: 2,
        explanation: '`[...arr, newItem]` 使用展開語法建立一個新陣列，包含 arr 的所有元素加上 newItem，原陣列 arr 不被修改，符合不可變性原則。`push` 和直接賦值 `arr[index]` 都是直接修改原陣列（mutation）。`append` 不是 JavaScript 陣列的方法。',
      },
      {
        id: 6,
        question: '以下關於 `Object.freeze()` 的說法，哪個正確？',
        options: [
          'Object.freeze() 提供深層凍結，所有巢狀物件都無法修改',
          'Object.freeze() 只提供淺層凍結，巢狀物件的屬性仍可被修改',
          'Object.freeze() 和 const 功能完全相同',
          'Object.freeze() 會拋出 TypeError 來禁止任何修改嘗試',
        ],
        answer: 1,
        explanation: '`Object.freeze()` 只凍結物件的第一層屬性，對於巢狀物件，凍結的是「指向巢狀物件的參考」，而不是巢狀物件本身。所以 `frozen.x = 1` 會失敗（嚴格模式下拋出 TypeError，否則靜默忽略），但 `frozen.nested.y = 1` 仍然成功。需要深層凍結要自行遞迴呼叫 Object.freeze。',
      },
      {
        id: 7,
        question: 'Immer.js 的主要用途是什麼？',
        options: [
          '讓 React 元件強制使用 class-based 語法',
          '讓開發者用「可變語法」撰寫不可變的狀態更新，Immer 在背後自動建立新物件',
          '提供深拷貝功能，取代 structuredClone',
          '讓 JavaScript 物件完全不可變，所有修改都會拋出錯誤',
        ],
        answer: 1,
        explanation: 'Immer.js 讓你在 `produce` 的回呼中用看起來像「直接修改」的語法撰寫狀態更新（例如 `draft.count += 1`），但 Immer 在背後使用 Proxy 攔截這些修改，並自動產生一個包含修改的新物件（不可變更新）。Redux Toolkit 的 `createSlice` 內建 Immer，讓 reducer 撰寫更直觀。',
      },
      {
        id: 8,
        question: '`structuredClone()` 和 `JSON.parse(JSON.stringify())` 的主要差異是什麼？',
        options: [
          '兩者完全相同，可以互換使用',
          '`structuredClone` 可以處理 Date、undefined、循環參考等 JSON 無法序列化的值',
          '`JSON.parse(JSON.stringify())` 速度更快',
          '`structuredClone` 只能複製第一層（淺拷貝）',
        ],
        answer: 1,
        explanation: '`JSON.parse(JSON.stringify())` 的限制：`undefined` 會遺失、`Date` 變成字串、`function` 消失、循環參考拋出錯誤、`Set`/`Map`/`RegExp` 處理不正確。`structuredClone()`（ES2022）是瀏覽器原生的深拷貝方法，正確處理這些情況（除了 function 外），且效能更好。',
      },
    ],
    keyPoints: [
      '不可變性：值不被修改，而是回傳包含新值的全新物件或陣列。',
      'const 只阻止變數重新賦值，不阻止修改物件屬性，不等於不可變。',
      '原始型別（string、number 等）天然不可變；物件和陣列可變，需手動維持不可變性。',
      '淺拷貝（spread、Object.assign）只複製第一層；深拷貝（structuredClone）完全獨立。',
      'React 用淺比較偵測狀態變化，直接 mutation 不改變參考，React 無法偵測，必須建立新物件。',
      'Immer.js 讓你用可變語法寫不可變更新，Redux Toolkit 內建使用 Immer。',
    ],
  },

  // ─── MVC 架構模式 ─────────────────────────────────────────────────────────
  {
    slug: 'mvc-pattern',
    title: 'MVC 架構模式',
    description: '理解 Model-View-Controller 的職責分離原則，以及衍生的 MVVM、MVP 模式',
    subCategory: '架構模式',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: 'MVC 三個角色的職責',
          content: `**MVC（Model-View-Controller）** 是將應用程式分成三個職責明確的層次：

| 角色 | 職責 | 範例 |
|------|------|------|
| **Model（模型）** | 管理資料和業務邏輯，與資料庫或 API 互動 | User 類別、資料驗證規則 |
| **View（視圖）** | 負責 UI 呈現，從 Model 取得資料並顯示 | HTML 模板、React Component |
| **Controller（控制器）** | 接收使用者輸入，協調 Model 和 View | 處理表單提交、路由邏輯 |

\`\`\`
使用者 → Controller（接收輸入）
           ↓
        Model（更新資料）
           ↓
        View（更新畫面）
           ↓
        使用者（看到結果）
\`\`\`

**關鍵原則：** 每個角色只做自己該做的事，View 不直接操作資料，Model 不知道 UI 長什麼樣。`,
        },
        {
          heading: 'MVVM 模式（Model-View-ViewModel）',
          content: `**MVVM** 是 MVC 的衍生模式，主要改進是引入 **ViewModel** 和**雙向資料綁定**：

| 角色 | 職責 |
|------|------|
| **Model** | 資料和業務邏輯（同 MVC） |
| **View** | UI 呈現（同 MVC），透過資料綁定自動更新 |
| **ViewModel** | 將 Model 的資料轉換為 View 易於使用的格式；接收 View 的輸入並更新 Model |

\`\`\`
View ←→ ViewModel（雙向綁定） ←→ Model
\`\`\`

**雙向綁定（Two-way binding）：**
- View 更新 → ViewModel 自動同步
- Model 更新 → View 自動重新渲染
- 開發者不需要手動操作 DOM

**Vue.js 採用 MVVM 模式：**
\`\`\`vue
<template>
  <!-- View -->
  <input v-model="username" />  <!-- 雙向綁定 -->
  <p>{{ username }}</p>
</template>

<script>
export default {
  data() {
    return { username: '' }  // ViewModel 的資料
  }
}
</script>
\`\`\``,
        },
        {
          heading: 'MVC vs MVVM 比較',
          content: `| 特性 | MVC | MVVM |
|------|-----|------|
| 資料綁定 | 手動（Controller 協調） | 自動雙向綁定 |
| View 與邏輯耦合 | 中等（透過 Controller） | 低（透過 ViewModel 分離） |
| 測試難度 | View 較難測試 | ViewModel 是純邏輯，易測試 |
| 代表框架 | Django（Python）、Rails（Ruby）、Spring（Java） | Vue.js、Angular、Knockout.js |
| 適用場景 | 後端 Web 框架、傳統 MPA | 前端 SPA、表單密集的應用 |

**MVVM 的主要優勢：**
ViewModel 是純 JavaScript 邏輯，不依賴 DOM，可以獨立進行單元測試。View 透過宣告式（declarative）綁定更新，減少手動 DOM 操作。`,
        },
        {
          heading: '前端框架的架構定位',
          content: `**React 的架構定位：**
React 官方定位自己為 **「UI 層（View Layer）」**，本身不強制 MVC 架構。
- Component 可以看作是 View
- 搭配 Redux/Zustand 才有完整的 Model/Store
- 搭配 Router 才有類似 Controller 的路由控制

**Angular 較完整的 MVC：**
Angular 是更完整的框架，內建：
- Component（View + Controller）
- Service（Model/業務邏輯）
- Module、DI（Dependency Injection）系統

**Vue.js 的 MVVM：**
Vue 的 Options API 是典型 MVVM：
- template → View
- data/computed → ViewModel（資料和轉換）
- methods → ViewModel（行為）
- store（Vuex/Pinia）→ Model`,
        },
        {
          heading: '關注點分離（Separation of Concerns）原則',
          content: `MVC / MVVM 的核心哲學是**關注點分離（SoC）**：讓每個模組只負責一件事，降低耦合度。

**SoC 在前端的體現：**
\`\`\`
❌ 反模式（混在一起）：
<button onclick="
  fetch('/api/users').then(r=>r.json()).then(data=>{
    document.getElementById('list').innerHTML =
      data.map(u => \`<li>\${u.name}</li>\`).join('')
  })
">載入使用者</button>

✅ 關注點分離：
// API 層（Model）
async function fetchUsers() { return fetch('/api/users').then(r=>r.json()) }

// Controller / 邏輯層
async function handleLoad() {
  const users = await fetchUsers()
  renderUsers(users)
}

// View 層
function renderUsers(users) {
  document.getElementById('list').innerHTML =
    users.map(u => \`<li>\${u.name}</li>\`).join('')
}
\`\`\`

**SoC 的好處：** 各層可獨立修改、獨立測試，新人只需理解自己負責的部分，不必理解整個系統。`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: 'MVC 中，Controller（控制器）的主要職責是什麼？',
        options: [
          '負責 UI 的視覺呈現和排版',
          '管理資料庫和業務邏輯',
          '接收使用者輸入，協調 Model 和 View 的互動',
          '處理 CSS 樣式和動畫',
        ],
        answer: 2,
        explanation: 'Controller 是 MVC 的協調中心，負責：1) 接收使用者的輸入（如表單提交、按鈕點擊）；2) 呼叫 Model 進行資料操作；3) 決定要顯示哪個 View，並傳遞資料給它。Controller 本身不處理 UI 渲染（View 的工作）也不直接操作資料庫（Model 的工作）。',
      },
      {
        id: 2,
        question: 'MVVM 模式中，ViewModel 的主要作用是什麼？',
        options: [
          'ViewModel 就是 View 的另一個名稱，功能完全相同',
          '將 Model 資料轉換成 View 易用的格式，並透過雙向綁定和 View 同步',
          'ViewModel 負責直接操作資料庫',
          'ViewModel 是 MVC 中 Controller 的縮寫',
        ],
        answer: 1,
        explanation: 'ViewModel 是 MVVM 的核心：它是介於 Model 和 View 之間的橋梁，負責：1) 將 Model 的原始資料轉換為 View 容易顯示的格式；2) 透過雙向資料綁定與 View 保持同步（View 的輸入自動反映到 ViewModel，ViewModel 的資料變化自動更新 View）；3) 包含 View 的邏輯（如表單驗證），但不依賴 DOM。',
      },
      {
        id: 3,
        question: 'Vue.js 採用哪種架構模式？',
        options: [
          'MVC（Model-View-Controller）',
          'MVP（Model-View-Presenter）',
          'MVVM（Model-View-ViewModel）',
          'Flux（單向資料流）',
        ],
        answer: 2,
        explanation: 'Vue.js 採用 MVVM 模式。在 Vue 中：`<template>` 是 View、`data/computed` 是 ViewModel 的資料層、`v-model` 實現雙向資料綁定（View ↔ ViewModel）。Vue 的響應式系統（reactive system）讓 ViewModel 的資料改變時，View 自動重新渲染，無需手動操作 DOM。',
      },
      {
        id: 4,
        question: 'React 官方如何定位自己在前端架構中的角色？',
        options: [
          'React 是一個完整的 MVC 框架',
          'React 是專注於 UI 的函式庫（View 層），不強制整體架構',
          'React 是 MVVM 框架，提供完整的雙向綁定',
          'React 是後端框架，偶爾用於前端',
        ],
        answer: 1,
        explanation: 'React 官方定位自己為「用於構建 UI 的 JavaScript 函式庫」，主要負責 View 層。React 本身不提供 Model（需搭配 Redux、Zustand、React Query 等）、不提供路由（需搭配 React Router 等）。這種彈性讓 React 可以搭配不同工具組成不同架構（Flux、Redux、MVC 等）。',
      },
      {
        id: 5,
        question: '「關注點分離（Separation of Concerns）」原則在 MVC 中的體現是什麼？',
        options: [
          '所有程式碼都放在同一個檔案中，方便管理',
          'View 負責取得資料、Model 負責顯示 UI、Controller 負責驗證',
          'Model 只處理資料邏輯，View 只負責顯示，Controller 只負責協調，各自職責清晰',
          '前端和後端的程式碼完全分離',
        ],
        answer: 2,
        explanation: '關注點分離是 MVC 的核心哲學：每個層只做自己的事。Model 不知道 UI 長什麼樣、只管資料邏輯；View 不直接操作資料、只管顯示；Controller 不包含業務邏輯或 UI 程式碼、只管協調。這讓各層可以獨立修改和測試，降低耦合度，提高可維護性。',
      },
      {
        id: 6,
        question: 'MVC 和 MVVM 最主要的差異是什麼？',
        options: [
          'MVC 只用於後端，MVVM 只用於前端',
          'MVVM 引入了雙向資料綁定，ViewModel 自動同步 View 和 Model 的狀態',
          'MVC 比 MVVM 更現代，效能更好',
          'MVVM 沒有 Model 層，資料直接存在 View 中',
        ],
        answer: 1,
        explanation: 'MVC 和 MVVM 的核心差異在於「資料綁定方式」。MVC 需要 Controller 手動更新 View（命令式）；MVVM 透過雙向資料綁定，當 Model 或 ViewModel 資料改變時，View 自動更新（宣告式）。這讓 MVVM 的開發更直觀，減少手動 DOM 操作，但也引入了雙向綁定的複雜性。',
      },
      {
        id: 7,
        question: 'Angular 和 React 在架構設計上最主要的差異是什麼？',
        options: [
          '兩者架構完全相同，只是語法不同',
          'Angular 是一個「框架」，內建完整 MVC（Component、Service、DI）；React 是「函式庫」，只專注於 View',
          'React 提供完整的 MVC 架構；Angular 只提供 View 層',
          'Angular 只用於移動端開發；React 只用於桌面端',
        ],
        answer: 1,
        explanation: 'Angular 是一個「全功能框架（opinionated framework）」，內建 Component（View）、Service（Model/業務邏輯）、Dependency Injection（DI）、Routing、Forms、HTTP 等完整功能，更接近完整的 MVC 架構。React 是「函式庫（library）」，只負責 UI 層，開發者需要自行選擇其他工具組合完整架構，靈活度更高。',
      },
      {
        id: 8,
        question: '在 MVC 架構中，以下哪個做法違反了「關注點分離」原則？',
        options: [
          '將資料驗證邏輯寫在 Model 中',
          'View 只從 Controller 傳入的資料渲染畫面，不直接呼叫 API',
          '在 HTML 模板（View）中直接寫 SQL 查詢取得資料',
          'Controller 接收 HTTP 請求後，呼叫 Model 取得資料，再傳給 View 渲染',
        ],
        answer: 2,
        explanation: '在 View（HTML 模板）中直接寫 SQL 查詢嚴重違反關注點分離：View 應只負責顯示，資料取得是 Model 的職責。這種「混合」讓程式碼難以維護（改 UI 要看 SQL、改 SQL 要找到 HTML）、難以測試（View 和資料層緊耦合）、難以重用（同樣的資料邏輯無法在其他地方使用）。',
      },
    ],
    keyPoints: [
      'MVC 三層：Model（資料邏輯）、View（UI 呈現）、Controller（協調），各司其職。',
      'MVVM 引入 ViewModel，透過雙向資料綁定讓 View 和資料自動同步，Vue.js 採用此模式。',
      'MVC vs MVVM：MVC 手動更新（Controller 協調），MVVM 自動雙向綁定（宣告式）。',
      'React 定位為 View 層函式庫；Angular 是含完整 MVC 的框架；Vue.js 是 MVVM 框架。',
      '關注點分離（SoC）：每個模組只做一件事，View 不取資料，Model 不管 UI，降低耦合。',
    ],
  },
]
