import type { DesignPatternEntry } from './design-pattern-topics-types'

export const part2Topics: DesignPatternEntry[] = [
  // ─── 設計原則 ────────────────────────────────────────────────────────────────
  {
    slug: 'solid-principles',
    title: 'SOLID 設計原則',
    description: '掌握五個物件導向設計原則，寫出可維護、可擴展的程式碼',
    subCategory: '設計原則',
    difficulty: 'hard',
    notes: {
      sections: [
        {
          heading: 'S — 單一職責原則（Single Responsibility Principle）',
          content: `一個類別或模組只應該有**一個改變的理由**，也就是說只負責一件事。

\`\`\`ts
// ❌ 違反 SRP：User 類別同時負責資料管理與 Email 發送
class User {
  constructor(public name: string, public email: string) {}
  save() { /* 存資料庫 */ }
  sendWelcomeEmail() { /* 發送 Email */ }
}

// ✅ 遵守 SRP：拆分職責
class User {
  constructor(public name: string, public email: string) {}
}
class UserRepository {
  save(user: User) { /* 存資料庫 */ }
}
class EmailService {
  sendWelcomeEmail(user: User) { /* 發送 Email */ }
}
\`\`\`

**好處：** 修改 Email 邏輯時不需動到 User 的資料結構，降低耦合、便於測試。`,
        },
        {
          heading: 'O — 開放封閉原則（Open/Closed Principle）',
          content: `軟體實體（類別、函式）應該**對擴展開放，對修改封閉**。新增功能時透過擴展而非修改現有程式碼。

\`\`\`ts
// ❌ 違反 OCP：每新增一種折扣都要修改 calculatePrice
function calculatePrice(type: string, price: number) {
  if (type === 'VIP') return price * 0.8
  if (type === 'Student') return price * 0.9
  // 新增 Senior 又要改這裡...
  return price
}

// ✅ 遵守 OCP：透過策略模式擴展
interface DiscountStrategy {
  apply(price: number): number
}
class VIPDiscount implements DiscountStrategy {
  apply(price: number) { return price * 0.8 }
}
class StudentDiscount implements DiscountStrategy {
  apply(price: number) { return price * 0.9 }
}
// 新增 SeniorDiscount 只需新增一個 class，不需修改現有程式碼
function calculatePrice(strategy: DiscountStrategy, price: number) {
  return strategy.apply(price)
}
\`\`\``,
        },
        {
          heading: 'L — 里氏替換原則（Liskov Substitution Principle）',
          content: `子類別必須能夠**替換父類別**而不破壞程式的正確性。也就是說，繼承要符合「is-a」的語意。

\`\`\`ts
// ❌ 違反 LSP：正方形繼承長方形，但行為不一致
class Rectangle {
  setWidth(w: number) { this.width = w }
  setHeight(h: number) { this.height = h }
  area() { return this.width * this.height }
  protected width = 0
  protected height = 0
}
class Square extends Rectangle {
  // 正方形強制 width === height，破壞了父類別的預期行為
  setWidth(w: number) { this.width = this.height = w }
  setHeight(h: number) { this.width = this.height = h }
}
// 使用 Rectangle 的程式碼，傳入 Square 會出錯
function resize(rect: Rectangle) {
  rect.setWidth(5)
  rect.setHeight(10)
  console.log(rect.area()) // 期望 50，Square 會印出 100
}

// ✅ 遵守 LSP：讓 Square 和 Rectangle 各自實作 Shape 介面
interface Shape { area(): number }
class Rectangle implements Shape { /* ... */ }
class Square implements Shape { /* ... */ }
\`\`\``,
        },
        {
          heading: 'I — 介面隔離原則（Interface Segregation Principle）',
          content: `不應該強迫客戶端依賴它**不需要的介面**。應將大型介面拆分成多個專注的小介面。

\`\`\`ts
// ❌ 違反 ISP：Printer 介面太胖，並非所有印表機都有傳真功能
interface Printer {
  print(doc: string): void
  scan(doc: string): void
  fax(doc: string): void   // 傳真
}
class SimplePrinter implements Printer {
  print(doc: string) { /* ... */ }
  scan(doc: string) { /* ... */ }
  fax(doc: string) { throw new Error('不支援傳真') } // 被迫實作不需要的方法
}

// ✅ 遵守 ISP：拆分介面
interface Printable { print(doc: string): void }
interface Scannable { scan(doc: string): void }
interface Faxable   { fax(doc: string): void }

class SimplePrinter implements Printable, Scannable {
  print(doc: string) { /* ... */ }
  scan(doc: string) { /* ... */ }
}
class AllInOnePrinter implements Printable, Scannable, Faxable {
  print(doc: string) { /* ... */ }
  scan(doc: string) { /* ... */ }
  fax(doc: string) { /* ... */ }
}
\`\`\``,
        },
        {
          heading: 'D — 依賴反轉原則（Dependency Inversion Principle）',
          content: `高層模組不應該依賴低層模組，兩者都應依賴**抽象（介面）**；抽象不應依賴細節，細節應依賴抽象。

\`\`\`ts
// ❌ 違反 DIP：OrderService 直接依賴具體的 MySQLDatabase
class MySQLDatabase {
  save(order: object) { /* 存入 MySQL */ }
}
class OrderService {
  private db = new MySQLDatabase() // 緊耦合，難以替換或測試
  createOrder(order: object) { this.db.save(order) }
}

// ✅ 遵守 DIP：依賴抽象介面，透過依賴注入
interface Database {
  save(data: object): void
}
class MySQLDatabase implements Database {
  save(data: object) { /* 存入 MySQL */ }
}
class MongoDatabase implements Database {
  save(data: object) { /* 存入 MongoDB */ }
}
class OrderService {
  constructor(private db: Database) {} // 依賴介面，外部注入
  createOrder(order: object) { this.db.save(order) }
}

// 使用時：
const service = new OrderService(new MySQLDatabase())
// 測試時：
const testService = new OrderService(new MockDatabase())
\`\`\`

**DIP 是 IoC（控制反轉）和依賴注入（DI）的理論基礎，也是框架（Angular、NestJS）的核心概念。**`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: '單一職責原則（SRP）的核心概念是什麼？',
        options: [
          '一個類別只能有一個方法',
          '一個類別應該只有一個改變的理由，即只負責一件事',
          '所有職責都應該集中在同一個類別中，方便管理',
          '一個模組最多只能依賴一個其他模組',
        ],
        answer: 1,
        explanation: 'SRP 的定義是「一個類別應該只有一個改變的理由」，意味著一個類別只負責一個職責。若一個類別同時負責資料存取、Email 通知、日誌記錄等，那麼任何一項需求改變都會影響到這個類別，導致難以維護和測試。拆分後每個類別只有一個改變原因，職責清晰。',
      },
      {
        id: 2,
        question: '開放封閉原則（OCP）的「對擴展開放，對修改封閉」是什麼意思？',
        options: [
          '程式碼必須開放原始碼，但禁止他人修改',
          '新增功能時，透過新增程式碼（如新的子類別或策略）實現，而非修改已有的程式碼',
          '所有類別都必須是 abstract，不能直接實例化',
          '函式的參數可以擴展，但回傳值不能修改',
        ],
        answer: 1,
        explanation: 'OCP 要求：增加新功能時透過「擴展」（如新增子類別、實作新的策略物件）而非修改已存在的程式碼。這樣可以確保既有程式碼的穩定性，不會因為新功能的引入而引發 regression。常見的實作模式包括策略模式、模板方法模式、多型等。',
      },
      {
        id: 3,
        question: '以下哪個場景是違反里氏替換原則（LSP）的典型例子？',
        options: [
          '子類別 Dog 繼承父類別 Animal，並覆寫 makeSound() 方法發出狗叫聲',
          '子類別 Square 繼承 Rectangle，但覆寫 setWidth/setHeight 使兩者強制相等，導致面積計算不符預期',
          '子類別 AdminUser 繼承 User，並新增 deleteUser() 方法',
          '子類別 ElectricCar 繼承 Car，並覆寫 refuel() 改為 charge()',
        ],
        answer: 1,
        explanation: '正方形繼承長方形是 LSP 的經典反例。Rectangle 的語意是 width 和 height 可以獨立設定，但 Square 強制兩者相等，當程式碼預期 Rectangle 的行為（如 setWidth(5); setHeight(10); 期望 area()=50）卻傳入 Square 時，結果會是 100，破壞了程式的正確性。LSP 的核心：子類別必須能完全替換父類別且不改變程式正確性。',
      },
      {
        id: 4,
        question: '介面隔離原則（ISP）建議如何設計介面？',
        options: [
          '所有類別應實作一個大而全的通用介面',
          '介面方法越多越好，以確保擴展性',
          '將大型介面拆分成多個專注的小介面，讓類別只需實作它真正需要的方法',
          '每個類別只能實作一個介面',
        ],
        answer: 2,
        explanation: 'ISP 要求避免「胖介面」。若介面包含太多方法，實作它的類別可能被迫提供空實作或拋出錯誤（如 throw new Error("不支援")）。拆分成多個小介面後，每個類別只實作自己需要的介面，避免依賴不需要的功能，降低耦合度。',
      },
      {
        id: 5,
        question: '依賴反轉原則（DIP）中，正確的依賴方向是？',
        options: [
          '高層模組直接依賴低層模組的具體實作',
          '低層模組依賴高層模組的具體實作',
          '高層模組和低層模組都依賴抽象介面，而非具體實作',
          '所有模組互相依賴，形成緊密耦合',
        ],
        answer: 2,
        explanation: 'DIP 要求高層模組（業務邏輯）和低層模組（資料庫、網路）都依賴抽象介面，而非具體實作。例如 OrderService 依賴 Database 介面，而非 MySQLDatabase 類別。這樣可以輕鬆替換實作（MySQL 換 MongoDB），也方便測試時注入 Mock 物件。',
      },
      {
        id: 6,
        question: '以下哪個設計最能同時體現 DIP 和 ISP 的精神？',
        options: [
          '所有服務都繼承同一個 BaseService 抽象類別，並共用同一組方法',
          '直接在建構子中 new 出所需的依賴物件',
          '定義細粒度的介面，透過建構子注入（Constructor Injection）傳入實作，不依賴具體類別',
          '使用全域變數共享所有模組的狀態',
        ],
        answer: 2,
        explanation: '定義細粒度介面（ISP：避免胖介面）+ 建構子注入具體實作（DIP：依賴抽象，由外部注入）是最佳實踐。直接在建構子中 new 依賴物件違反 DIP（高層依賴低層具體實作）。繼承 BaseService 可能違反 ISP（不需要的方法也被繼承）。全域變數造成隱藏依賴，完全違反 DIP。',
      },
      {
        id: 7,
        question: '下列哪個行為違反了開放封閉原則？',
        options: [
          '新增一個實作 PaymentStrategy 介面的 CryptoPayment 類別',
          '每次新增付款方式時，都直接修改 processPayment 函式的 if-else 判斷邏輯',
          '透過繼承擴展父類別的行為',
          '使用多型讓不同子類別各自實作 calculate() 方法',
        ],
        answer: 1,
        explanation: '每次新增功能都直接修改 processPayment 函式中的 if-else 判斷，這是典型的 OCP 違反。每次修改都可能引入 bug，也使函式越來越複雜難以維護。遵守 OCP 的做法是：定義 PaymentStrategy 介面，每種付款方式實作各自的策略類別，processPayment 只依賴介面，新增付款方式時只需新增新類別即可。',
      },
      {
        id: 8,
        question: '在前端 React 開發中，哪個實踐最符合 SOLID 精神？',
        options: [
          '將所有業務邏輯、API 呼叫、UI 渲染都寫在同一個大型 Component 中',
          '將邏輯分離到 Custom Hook，UI Component 只負責渲染；API 呼叫透過 props 或 context 注入',
          '所有 Component 都繼承同一個 BaseComponent 類別',
          '使用全域變數在所有 Component 之間共享狀態',
        ],
        answer: 1,
        explanation: 'Custom Hook 分離邏輯（SRP）、Component 只負責渲染（SRP）、透過 props/context 注入依賴（DIP）是 React 中最接近 SOLID 精神的實踐。大型 Component 違反 SRP；過度繼承可能違反 LSP；全域變數造成隱藏依賴違反 DIP。Custom Hook 也便於測試和複用，符合開放封閉原則（擴展 Hook 功能而非修改 Component）。',
      },
    ],
    keyPoints: [
      'S（單一職責）：一個類別只有一個改變的理由，只負責一件事，降低耦合便於測試。',
      'O（開放封閉）：對擴展開放、對修改封閉，新增功能透過新增程式碼而非修改現有程式碼。',
      'L（里氏替換）：子類別必須能完全替換父類別且不破壞程式正確性，繼承要符合 is-a 語意。',
      'I（介面隔離）：避免胖介面，將大介面拆分成多個細粒度介面，讓類別只依賴它需要的方法。',
      'D（依賴反轉）：高層與低層模組都依賴抽象介面，透過依賴注入（DI）解耦，便於替換和測試。',
    ],
  },

  // ─── 設計原則 ────────────────────────────────────────────────────────────────
  {
    slug: 'design-principles',
    title: 'DRY / KISS / YAGNI 原則',
    description: '了解三個常見的程式設計原則，避免重複、保持簡單、不過度設計',
    subCategory: '設計原則',
    difficulty: 'easy',
    notes: {
      sections: [
        {
          heading: 'DRY — Don\'t Repeat Yourself（不要重複自己）',
          content: `「每一項知識在系統中都應該有一個單一、明確、權威的表示」。重複的程式碼是維護噩夢的來源。

\`\`\`ts
// ❌ 違反 DRY：相同的驗證邏輯在多處重複
function registerUser(name: string, email: string) {
  if (!email.includes('@')) throw new Error('無效 Email')
  // ... 註冊邏輯
}
function updateEmail(userId: string, email: string) {
  if (!email.includes('@')) throw new Error('無效 Email')
  // ... 更新邏輯
}

// ✅ 遵守 DRY：提取共用函式
function validateEmail(email: string) {
  if (!email.includes('@')) throw new Error('無效 Email')
}
function registerUser(name: string, email: string) {
  validateEmail(email)
  // ... 註冊邏輯
}
function updateEmail(userId: string, email: string) {
  validateEmail(email)
  // ... 更新邏輯
}
\`\`\`

**注意：** DRY 不是「不能寫相似程式碼」，而是「避免相同知識的重複」。強行消除所有看起來相似的程式碼可能導致過度抽象（Premature Abstraction）。`,
        },
        {
          heading: 'KISS — Keep It Simple, Stupid（保持簡單）',
          content: `大多數系統在保持簡單而非複雜的情況下，運作效果最好。簡單是設計的美德。

\`\`\`ts
// ❌ 違反 KISS：過度複雜的寫法
function isEven(n: number): boolean {
  return n % 2 === 0
    ? true
    : n % 2 === 1
    ? false
    : Boolean(Number(!Boolean(n & 1)))
}

// ✅ 遵守 KISS：直接、清晰
function isEven(n: number): boolean {
  return n % 2 === 0
}

// ❌ 違反 KISS：過早引入複雜架構
// 一個只有 2 個頁面的小網站，卻引入 Redux + Saga + 複雜的狀態機...

// ✅ 遵守 KISS：根據實際需求選擇適當的解決方案
// 2 個頁面：useState + useContext 就夠了
\`\`\`

**KISS 的實踐建議：**
- 優先選擇最簡單能解決問題的方案
- 寫程式碼給「未來的自己和同事」讀，而非展示技術
- 避免「聰明」的寫法，清晰優於巧妙`,
        },
        {
          heading: 'YAGNI — You Aren\'t Gonna Need It（你不會需要它的）',
          content: `不要實作「現在不需要，但未來可能需要」的功能。只在確實需要時才加入功能。

\`\`\`ts
// ❌ 違反 YAGNI：預先為「未來需求」設計複雜架構
class UserService {
  // 現在只需要 email 登入，卻預先支援 10 種登入方式...
  loginWithEmail() {}
  loginWithGoogle() {}     // 現在不需要
  loginWithFacebook() {}   // 現在不需要
  loginWithApple() {}      // 現在不需要
  loginWithPhoneOTP() {}   // 現在不需要
  // 每個都要測試、維護，但沒有人用
}

// ✅ 遵守 YAGNI：只實作現在需要的
class UserService {
  loginWithEmail() {}
  // 等到真的需要其他登入方式時，再加入
}
\`\`\`

**YAGNI 的重要性：**
- 「預測」的需求往往與實際需求不同，白費心力
- 過多不用的程式碼增加維護成本和理解複雜度
- 與敏捷開發理念一致：從簡單開始，按需迭代`,
        },
        {
          heading: '三個原則的平衡與適用場景',
          content: `三個原則有時會產生張力，需要根據情境判斷：

| 場景 | 適用原則 | 說明 |
|------|----------|------|
| 多處相同邏輯 | DRY | 提取共用函式或 Hook |
| 解決方案複雜難懂 | KISS | 重構為更簡單的寫法 |
| 為「可能的」需求預先設計 | YAGNI | 先實作當前需求，後續再擴展 |
| 真的會複用的抽象 | DRY > YAGNI | 預期複用有足夠理由時可打破 YAGNI |

**常見誤用：**
- 過度套用 DRY → 強行合併只是長得像但概念不同的程式碼（Wrong Abstraction）
- 過度套用 YAGNI → 連合理的通用設計也不做，導致日後大規模重構
- 過度套用 KISS → 迴避所有複雜性，包括必要的複雜性（如安全機制、錯誤處理）`,
        },
        {
          heading: '在 React 前端開發中的應用',
          content: `\`\`\`tsx
// DRY：提取重複的 UI 邏輯成 Custom Hook
// ❌ 在多個 Component 各自寫 fetch 邏輯
// ✅ 提取成 useFetch(url) Hook 共用

// DRY：提取重複的 UI 成 Component
// ❌ 在多個頁面重複寫相同的 Loading Spinner JSX
// ✅ 建立 <LoadingSpinner /> Component 共用

// KISS：避免過度設計狀態管理
// ❌ 一個表單用 Redux + Normalizer + Selector
// ✅ 用 useState + React Hook Form 就夠了

// YAGNI：不要預先建立「可能用到的」通用元件
// ❌ 建立支援 10 種變體的超級 Button Component（現在只用到 2 種）
// ✅ 先建立能滿足當前需求的 Button，之後有需求再擴展
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: 'DRY 原則（Don\'t Repeat Yourself）的主要目的是什麼？',
        options: [
          '讓程式碼行數盡可能少',
          '避免相同知識或邏輯在多處重複，確保改動只需在一處進行',
          '禁止複製貼上任何程式碼',
          '讓每個函式都只有一行',
        ],
        answer: 1,
        explanation: 'DRY 的核心是「每一項知識在系統中應只有一個權威表示」。當相同的邏輯重複出現，一旦需要修改就必須在所有地方改，容易遺漏且不一致。提取共用函式或 Component 後，只需在一處修改即可。注意 DRY 不是單純追求「減少程式碼行數」，而是消除「知識的重複」。',
      },
      {
        id: 2,
        question: '以下哪個做法最能體現 KISS 原則？',
        options: [
          '為一個只需要列表顯示的頁面，引入 Redux + Saga + 複雜的正規化狀態結構',
          '使用位元運算和嵌套三元運算子，讓一行程式碼完成複雜判斷以展示技術能力',
          '用 useState 和直接的 fetch 呼叫實作一個簡單的列表頁面',
          '為未來可能的擴展預先設計插件架構',
        ],
        answer: 2,
        explanation: 'KISS 要求選擇最簡單能解決問題的方案。對一個簡單列表頁面使用 useState + fetch 已經足夠，引入複雜的狀態管理架構會增加不必要的認知負擔和維護成本。程式碼是寫給人讀的，清晰的程式碼優於「聰明」的一行解法。',
      },
      {
        id: 3,
        question: 'YAGNI 原則（You Aren\'t Gonna Need It）在什麼時候最重要？',
        options: [
          '當需求明確且已確定要實作某功能時',
          '當需要為「未來可能的需求」預先設計功能或架構時，應先克制衝動',
          '當現有功能有 bug 需要修復時',
          '當撰寫單元測試時',
        ],
        answer: 1,
        explanation: 'YAGNI 最適用於「預防性設計」的場景：當開發者想著「以後可能會需要這個功能，所以現在就先做」時，YAGNI 提醒我們：未來的需求往往和預測的不同，預先實作的功能可能從未被使用，卻需要持續維護和測試。應等到真正需要時再實作，以保持程式碼庫的精簡。',
      },
      {
        id: 4,
        question: '過度套用 DRY 原則可能造成什麼問題？',
        options: [
          '程式碼行數會增加',
          '強行抽象看起來相似但概念不同的程式碼，造成不適當的耦合（Wrong Abstraction）',
          '單元測試會更難寫',
          '效能會下降',
        ],
        answer: 1,
        explanation: '「Wrong Abstraction」是過度套用 DRY 的常見陷阱：兩段程式碼現在長得像，但未來可能因為不同原因演化出差異。強行合併後，一個改動會意外影響另一個場景。有時「少量重複」比「錯誤的抽象」更容易維護。DRY 的判斷標準應是「相同的知識/概念」，而非「相似的程式碼外觀」。',
      },
      {
        id: 5,
        question: '在 React 開發中，以下哪個行為符合 DRY 原則？',
        options: [
          '在每個需要資料的 Component 中各自寫 useEffect + fetch 邏輯',
          '將重複的 API 請求邏輯封裝成 Custom Hook（如 useUsers()），在多個 Component 中共用',
          '為每個頁面建立獨立的樣式，不共用任何 CSS 類別',
          '把所有狀態放在最頂層的 Component 中統一管理',
        ],
        answer: 1,
        explanation: 'Custom Hook 是 React 中實踐 DRY 的重要工具。將 fetch 邏輯、狀態管理、副作用封裝在 Custom Hook 中，多個 Component 可以共用同一邏輯，修改只需在一處進行。這避免了在各個 Component 中重複相同的 useEffect + fetch + 錯誤處理邏輯。',
      },
      {
        id: 6,
        question: 'KISS 和 YAGNI 最主要的共同點是什麼？',
        options: [
          '兩者都強調禁止使用設計模式',
          '兩者都反對寫測試',
          '兩者都鼓勵避免不必要的複雜性，保持程式碼精簡、聚焦於當前真實需求',
          '兩者都要求程式碼行數盡可能短',
        ],
        answer: 2,
        explanation: 'KISS（保持簡單，不要過度設計）和 YAGNI（不要實作不需要的功能）都指向同一個方向：避免不必要的複雜性。KISS 關注的是「當前解法的複雜度」，YAGNI 關注的是「不必要的功能」。兩者都與敏捷開發的「從簡單開始，按需迭代」理念一致。',
      },
      {
        id: 7,
        question: '以下哪個描述最準確地說明 DRY、KISS、YAGNI 三者的關係？',
        options: [
          '三者完全獨立，沒有任何關聯',
          'KISS 包含了 DRY 和 YAGNI，後兩者是前者的子集',
          '三者都是降低不必要複雜度的原則，互相補充但各有側重：DRY 關注避免重複、KISS 關注簡單性、YAGNI 關注只做當前需要的',
          'DRY 和 YAGNI 經常衝突，不能同時遵守',
        ],
        answer: 2,
        explanation: '三個原則互補：DRY 說「不要重複知識」；KISS 說「解法要保持簡單、可讀」；YAGNI 說「只實作當前需要的功能」。它們可以同時遵守：不重複邏輯（DRY）、用最簡單的方式寫（KISS）、只做需要的功能（YAGNI）。偶爾三者也會產生張力，需要根據具體情境做出判斷和取捨。',
      },
    ],
    keyPoints: [
      'DRY：相同知識只應在一處表示，避免重複邏輯。但不要強行合併「看起來像」但概念不同的程式碼（Wrong Abstraction）。',
      'KISS：優先選最簡單能解決問題的方案，程式碼是給人讀的，清晰優於巧妙。',
      'YAGNI：不要預先實作「可能」需要的功能，等到真正需要時再加入，保持程式碼庫精簡。',
      '三者互補：DRY 防重複、KISS 促簡單、YAGNI 抑過設計，都是降低不必要複雜度的手段。',
      'React 實踐：Custom Hook 體現 DRY；避免過度引入狀態管理體現 KISS；不預先建立用不到的通用元件體現 YAGNI。',
    ],
  },

  // ─── 常見設計模式 ────────────────────────────────────────────────────────────
  {
    slug: 'observer-pattern',
    title: '觀察者模式／發布訂閱模式',
    description: '理解 Observer 與 Pub/Sub 的一對多通知機制，及其在 JavaScript 事件系統中的應用',
    subCategory: '常見設計模式',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: '觀察者模式（Observer Pattern）',
          content: `Observer Pattern 定義了物件間的一對多依賴關係。當 Subject（被觀察者）狀態改變時，自動通知所有 Observer（觀察者）。

\`\`\`ts
// Subject 維護 Observer 列表
interface Observer {
  update(data: unknown): void
}

class EventStore {
  private observers: Observer[] = []

  subscribe(observer: Observer) {
    this.observers.push(observer)
  }
  unsubscribe(observer: Observer) {
    this.observers = this.observers.filter(o => o !== observer)
  }
  private notify(data: unknown) {
    this.observers.forEach(o => o.update(data))
  }

  // 狀態改變時通知所有 Observer
  setState(newState: unknown) {
    this.notify(newState)
  }
}

class Logger implements Observer {
  update(data: unknown) {
    console.log('Logger 收到:', data)
  }
}
class UIRenderer implements Observer {
  update(data: unknown) {
    console.log('UI 更新:', data)
  }
}

const store = new EventStore()
store.subscribe(new Logger())
store.subscribe(new UIRenderer())
store.setState({ user: 'Alice' }) // 兩個 Observer 都會收到通知
\`\`\`

**特點：** Subject 直接持有 Observer 的引用，兩者**互相認識**（耦合度較高）。`,
        },
        {
          heading: '發布訂閱模式（Pub/Sub Pattern）',
          content: `Pub/Sub 是 Observer 的變體，引入了 Event Bus（事件匯流排）作為中間層，讓 Publisher 和 Subscriber **互不認識**，進一步降低耦合。

\`\`\`ts
// Event Bus 作為中間人
class EventBus {
  private listeners: Map<string, Function[]> = new Map()

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(callback)
  }

  off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event) ?? []
    this.listeners.set(event, callbacks.filter(cb => cb !== callback))
  }

  emit(event: string, data?: unknown) {
    (this.listeners.get(event) ?? []).forEach(cb => cb(data))
  }
}

const bus = new EventBus()

// Publisher 只知道 EventBus，不認識任何 Subscriber
bus.emit('user:login', { name: 'Alice' })

// Subscriber 只知道 EventBus，不認識 Publisher
bus.on('user:login', (data) => {
  console.log('記錄登入:', data)
})
\`\`\``,
        },
        {
          heading: 'Observer vs Pub/Sub 的差異',
          content: `| 特性 | Observer Pattern | Pub/Sub Pattern |
|------|-----------------|-----------------|
| 耦合度 | Subject 持有 Observer 引用，互相認識 | Publisher 和 Subscriber 互不認識，透過 Event Bus 溝通 |
| 中間層 | 無 | 有（Event Bus / Message Broker） |
| 同步/非同步 | 通常同步 | 可以是非同步 |
| 使用場景 | 單一應用內的元件通訊 | 跨系統、微服務、複雜事件流 |
| 難以取消訂閱 | 需要保留 Observer 引用 | 透過事件名稱取消訂閱 |

**記憶口訣：** Observer 是「直播」（Subject 直接通知）；Pub/Sub 是「廣播電台」（透過電台中介，聽眾不知道主播是誰）。`,
        },
        {
          heading: 'JavaScript 中的實際應用',
          content: `**1. DOM 事件系統（Observer 概念）**
\`\`\`js
// addEventListener 就是一種 Observer Pattern
button.addEventListener('click', handler)   // subscribe
button.removeEventListener('click', handler) // unsubscribe
\`\`\`

**2. Node.js EventEmitter（Pub/Sub 概念）**
\`\`\`js
const EventEmitter = require('events')
const emitter = new EventEmitter()
emitter.on('data', (chunk) => console.log(chunk))  // subscribe
emitter.emit('data', 'Hello')                       // publish
\`\`\`

**3. Vue 3 響應式系統（Observer Pattern）**
\`\`\`js
// ref/reactive 底層就是 Observer Pattern
// 當響應式資料改變，依賴它的 effect（如渲染函式）自動重新執行
const count = ref(0)
watchEffect(() => {
  console.log(count.value) // 自動追蹤依賴，count 改變時重新執行
})
\`\`\`

**4. RxJS Observable（擴展的 Observer Pattern）**
\`\`\`js
import { fromEvent } from 'rxjs'
const clicks$ = fromEvent(button, 'click')
const subscription = clicks$.subscribe(e => console.log('clicked'))
subscription.unsubscribe() // 取消訂閱
\`\`\``,
        },
        {
          heading: '注意事項：記憶體洩漏與取消訂閱',
          content: `Observer / Pub/Sub 最常見的陷阱是**忘記取消訂閱**導致記憶體洩漏。

\`\`\`tsx
// React 範例：記得在 useEffect cleanup 中移除監聽
useEffect(() => {
  const handleResize = () => setWidth(window.innerWidth)
  window.addEventListener('resize', handleResize)

  return () => {
    // cleanup：Component 卸載時移除監聽，避免記憶體洩漏
    window.removeEventListener('resize', handleResize)
  }
}, [])

// RxJS 範例
useEffect(() => {
  const sub = someObservable$.subscribe(handler)
  return () => sub.unsubscribe()
}, [])
\`\`\`

**常見問題：**
- Observer 持有 Subject 引用 → Subject 無法被 GC（垃圾回收）
- React Component 卸載後事件監聽仍存在 → 觸發時在已卸載的 Component 中更新狀態
- EventBus 的 listener 未清除 → 記憶體洩漏，事件多次觸發`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: 'Observer Pattern 中，Subject 和 Observer 的關係是？',
        options: [
          'Subject 和 Observer 完全獨立，透過中間人溝通',
          'Subject 直接持有 Observer 的引用，狀態改變時主動通知所有 Observer',
          'Observer 主動定期輪詢 Subject 以取得最新狀態',
          'Subject 和 Observer 的關係是一對一，每個 Subject 只能有一個 Observer',
        ],
        answer: 1,
        explanation: 'Observer Pattern 中，Subject 維護一個 Observer 列表，當自身狀態改變時，直接呼叫每個 Observer 的 update() 方法通知它們。這是「推送（Push）」模型，Subject 和 Observer 互相認識，耦合度比 Pub/Sub 高。Observer Pattern 是一對多的關係，一個 Subject 可以有多個 Observer。',
      },
      {
        id: 2,
        question: 'Pub/Sub Pattern 與 Observer Pattern 最主要的差異是？',
        options: [
          'Pub/Sub 只能用在伺服器端，Observer 只能用在前端',
          'Pub/Sub 透過 Event Bus 作為中間層，Publisher 和 Subscriber 互不認識，耦合度更低',
          'Pub/Sub 只支援同步通知，Observer 支援非同步',
          'Pub/Sub 的效能比 Observer 差',
        ],
        answer: 1,
        explanation: 'Pub/Sub 的核心差異是引入了 Event Bus（事件匯流排）作為中介。Publisher 只負責發出事件到 Event Bus，Subscriber 只從 Event Bus 訂閱事件，雙方互不認識。Observer 中 Subject 直接持有 Observer 引用，兩者互相知道對方的存在。Pub/Sub 的耦合度更低，更適合複雜、分散式的事件系統。',
      },
      {
        id: 3,
        question: 'JavaScript 的 addEventListener 體現了哪種設計模式的概念？',
        options: [
          '工廠模式（Factory Pattern）',
          '觀察者模式（Observer Pattern）',
          '單例模式（Singleton Pattern）',
          '代理模式（Proxy Pattern）',
        ],
        answer: 1,
        explanation: 'addEventListener 是 Observer Pattern 的典型應用。DOM 元素（Button、Window 等）相當於 Subject，事件處理函式（callback）相當於 Observer。addEventListener 是 subscribe（訂閱），removeEventListener 是 unsubscribe（取消訂閱），當事件發生時（如 click），瀏覽器通知所有已註冊的 handler，這正是 Observer Pattern 的一對多通知機制。',
      },
      {
        id: 4,
        question: '在 React 的 useEffect 中使用 addEventListener 後，為什麼必須在 cleanup 函式中呼叫 removeEventListener？',
        options: [
          '因為 React 的效能優化要求這樣做',
          '若不移除，Component 卸載後監聽仍存在，可能造成記憶體洩漏或在已卸載的 Component 中更新狀態',
          '因為每次 render 都會重新新增監聽，若不移除會重複觸發',
          '以上兩者都是正確原因',
        ],
        answer: 3,
        explanation: '兩個原因都正確：(1) 若 useEffect 的 deps 改變，舊的 effect cleanup 會被呼叫，然後新的 effect 執行——若不移除舊監聽，事件監聽會不斷累積；(2) Component 卸載後若監聽仍存在，事件觸發時可能嘗試更新已卸載 Component 的狀態，導致 React warning 或 memory leak。cleanup 函式是 React 管理副作用生命週期的關鍵機制。',
      },
      {
        id: 5,
        question: 'Vue 3 的 watchEffect 或 computed 底層利用了哪種設計模式的概念？',
        options: [
          '工廠模式：每次計算都建立新的物件',
          '觀察者模式：響應式資料（Subject）在改變時自動通知依賴它的 effect（Observer）',
          '策略模式：根據不同資料選擇不同計算策略',
          '代理模式：透過 Proxy 攔截讀取操作',
        ],
        answer: 1,
        explanation: 'Vue 3 響應式系統的核心是 Observer Pattern：ref/reactive 建立的響應式資料相當於 Subject，watchEffect / computed 中的函式相當於 Observer。當響應式資料改變時，自動通知所有依賴它的 effect 重新執行（重新渲染、重新計算等）。Vue 3 底層使用 ES6 Proxy 來攔截讀取（追蹤依賴）和寫入（觸發通知）操作，實現這個機制。',
      },
      {
        id: 6,
        question: '以下哪個場景最適合使用 Pub/Sub 而非直接的 Observer Pattern？',
        options: [
          '父元件監聽子元件的一個 click 事件',
          '多個微服務之間的事件通訊，各服務不應直接依賴彼此',
          '一個類別的方法呼叫另一個類別的方法',
          'React Component 中監聽 window.resize 事件',
        ],
        answer: 1,
        explanation: '微服務之間的事件通訊是 Pub/Sub 的典型應用場景：各服務只知道 Event Bus（如 Kafka、RabbitMQ），發出或訂閱特定事件，互不認識。若用 Observer Pattern，服務 A 需要直接持有服務 B 的引用，造成緊耦合，任何一個服務的改動都可能影響其他服務。Pub/Sub 的中介層讓各服務獨立部署和擴展。',
      },
      {
        id: 7,
        question: 'Node.js EventEmitter 的 on() 和 emit() 分別對應 Pub/Sub 中的哪個概念？',
        options: [
          'on() 是 publish（發布）；emit() 是 subscribe（訂閱）',
          'on() 是 subscribe（訂閱）；emit() 是 publish（發布）',
          '兩者都是 subscribe，需要用 off() 來 publish',
          'on() 和 emit() 都是 publish，off() 才是 subscribe',
        ],
        answer: 1,
        explanation: 'EventEmitter 中：on(event, callback) 是 subscribe（訂閱）——告訴 EventBus「我要監聽這個事件，有事件時呼叫這個 callback」；emit(event, data) 是 publish（發布）——告訴 EventBus「這個事件發生了，通知所有訂閱者」。off() 則是 unsubscribe（取消訂閱）。',
      },
    ],
    keyPoints: [
      'Observer Pattern：Subject 維護 Observer 列表，狀態改變時直接通知，雙方互相認識（耦合較高）。',
      'Pub/Sub Pattern：透過 Event Bus 中介，Publisher 和 Subscriber 互不認識，耦合度更低，適合複雜系統。',
      'JavaScript 應用：addEventListener（Observer）、EventEmitter（Pub/Sub）、Vue 3 響應式系統（Observer）、RxJS（擴展 Observer）。',
      '記憶體洩漏陷阱：忘記取消訂閱（removeEventListener/unsubscribe）是 Observer 模式最常見的問題。',
      'React useEffect：必須在 cleanup 函式中移除事件監聽，防止記憶體洩漏和操作已卸載 Component 的狀態。',
    ],
  },

  // ─── 常見設計模式 ────────────────────────────────────────────────────────────
  {
    slug: 'singleton-pattern',
    title: '單例模式（Singleton）',
    description: '確保一個 class 只有一個實例，並提供全域存取點，適用於全域狀態管理',
    subCategory: '常見設計模式',
    difficulty: 'easy',
    notes: {
      sections: [
        {
          heading: 'Singleton 核心概念',
          content: `Singleton 模式確保一個類別**只有一個實例**，並提供一個全域存取點。

\`\`\`ts
// 傳統 OOP Singleton 實作
class Database {
  private static instance: Database | null = null
  private connection: string

  private constructor() {
    // private 建構子，防止外部 new Database()
    this.connection = '建立資料庫連線...'
    console.log('資料庫連線已建立')
  }

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }

  query(sql: string) {
    return \`執行: \${sql}\`
  }
}

// 使用
const db1 = Database.getInstance()
const db2 = Database.getInstance()
console.log(db1 === db2) // true，同一個實例
\`\`\``,
        },
        {
          heading: 'JavaScript 中的 Singleton 實作方式',
          content: `**方式一：ES6 Module（天然 Singleton）**
\`\`\`ts
// logger.ts
class Logger {
  private logs: string[] = []
  log(message: string) {
    this.logs.push(message)
    console.log(message)
  }
}
// ES6 Module 保證每次 import 都取得同一個實例
export const logger = new Logger()

// 使用
import { logger } from './logger'
logger.log('Hello') // 所有地方 import 的都是同一個 logger
\`\`\`

**方式二：閉包（Closure）**
\`\`\`ts
const createConfig = (() => {
  let instance: Record<string, string> | null = null
  return {
    getInstance() {
      if (!instance) {
        instance = { apiUrl: 'https://api.example.com', version: 'v1' }
      }
      return instance
    }
  }
})()

const config1 = createConfig.getInstance()
const config2 = createConfig.getInstance()
console.log(config1 === config2) // true
\`\`\`

**方式三：物件字面量（最簡單）**
\`\`\`ts
// 物件字面量本身就是 Singleton——每次 import 得到同一個物件引用
export const AppConfig = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
}
\`\`\``,
        },
        {
          heading: '使用場景',
          content: `| 使用場景 | 說明 |
|----------|------|
| Logger（日誌系統） | 整個應用只需一個 Logger 實例，統一管理日誌 |
| Config（設定檔） | 全域設定值只需載入一次 |
| 資料庫連線池 | 昂貴資源，避免重複建立 |
| Redux Store | 全域唯一的狀態容器 |
| 購物車（部分場景） | 整個應用共用同一個購物車狀態 |

\`\`\`ts
// Redux Store 就是一個 Singleton 概念的應用
import { configureStore } from '@reduxjs/toolkit'

// 整個應用只建立一個 Store
export const store = configureStore({
  reducer: { /* ... */ }
})

// 所有地方 import 的都是同一個 store
import { store } from './store'
store.dispatch(someAction())
\`\`\``,
        },
        {
          heading: 'Singleton 的缺點與注意事項',
          content: `Singleton 雖然方便，但也有明顯的缺點：

**1. 難以測試（Testability）**
\`\`\`ts
// 測試時難以重置 Singleton 的狀態
// 測試 A 修改了 Singleton，可能影響測試 B
const db = Database.getInstance()
// 無法輕易替換成 MockDatabase 進行單元測試
\`\`\`

**2. 隱藏依賴（Hidden Dependencies）**
\`\`\`ts
// 模組直接存取全域 Singleton，依賴關係不透明
function processOrder(order) {
  Database.getInstance().save(order) // 隱藏了對 Database 的依賴
  Logger.getInstance().log('Order saved') // 又有一個隱藏依賴
}
// 比較：明確依賴注入更好
function processOrder(order, db, logger) { /* 依賴清晰可見 */ }
\`\`\`

**3. 全域狀態問題**
- Singleton 本質上是全域狀態，任何地方都可以修改，難以追蹤改動來源
- 在多執行緒環境（Node.js Worker Threads、Web Workers）可能有競態條件

**4. 違反 SRP 和 DIP**
- Singleton 強迫使用者依賴具體實作，而非介面（違反 DIP）`,
        },
        {
          heading: 'Singleton vs 全域變數',
          content: `| 特性 | Singleton | 全域變數 |
|------|-----------|---------|
| 封裝性 | 高（透過方法存取） | 低（直接存取） |
| 延遲初始化 | 支援（getInstance 時才建立） | 不支援（宣告即初始化） |
| 控制建立邏輯 | 可在建構子放初始化邏輯 | 不行 |
| 防止多重實例 | 有機制保證 | 沒有 |
| 測試難度 | 同樣難以 Mock | 同樣難以 Mock |

**ES6 Module 的 Singleton 效果：** 在現代 JavaScript 中，直接 export 一個實例（\`export const logger = new Logger()\`）是最慣用且簡潔的 Singleton 實作，利用 Module 快取機制保證唯一性。`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: 'Singleton 模式的核心目的是什麼？',
        options: [
          '讓一個類別可以建立無限多個實例',
          '確保一個類別只有一個實例，並提供全域存取點',
          '讓不同類別之間可以共用方法',
          '自動管理物件的記憶體釋放',
        ],
        answer: 1,
        explanation: 'Singleton Pattern 的核心是「確保一個類別只有一個實例」，並透過靜態方法（如 getInstance()）提供全域存取點。適用於需要全域共享的資源，如資料庫連線、Logger、設定檔等，避免重複建立昂貴資源或導致不一致的全域狀態。',
      },
      {
        id: 2,
        question: 'ES6 Module 系統如何自然實現 Singleton 效果？',
        options: [
          '需要使用 static 關鍵字宣告類別',
          'ES6 Module 會快取模組，第一次 import 後建立的實例在後續 import 中會取得同一份快取',
          '需要使用 Object.freeze() 防止修改',
          'ES6 Module 本身不支援 Singleton，必須手動實作',
        ],
        answer: 1,
        explanation: 'ES6 Module 系統有模組快取機制：第一次 import 一個模組時執行並快取結果，後續所有 import 取得同一份快取，不會重複執行。因此 `export const logger = new Logger()` 這種寫法天然是 Singleton——無論在多少個地方 import，都取得同一個 logger 實例，是現代 JS 中最慣用的 Singleton 實作。',
      },
      {
        id: 3,
        question: '傳統 OOP Singleton 中，為什麼建構子要設為 private？',
        options: [
          '讓類別效能更好',
          '防止外部程式碼直接 new 建立新實例，強制使用 getInstance() 來確保唯一性',
          '讓類別無法被繼承',
          '防止類別的屬性被外部存取',
        ],
        answer: 1,
        explanation: 'private 建構子是 Singleton 的關鍵設計：外部程式碼無法 `new Database()` 建立新實例，只能透過 `Database.getInstance()` 存取。getInstance() 內部控制邏輯：若實例不存在才建立，否則回傳既有實例，從而確保整個應用只有一個實例。',
      },
      {
        id: 4,
        question: 'Singleton 模式最主要的缺點是什麼？',
        options: [
          '效能比直接 new 物件差很多',
          '難以測試（難以替換成 Mock）、隱藏依賴、引入全域狀態',
          'Singleton 無法儲存任何狀態',
          'Singleton 每次 getInstance() 都會建立新實例',
        ],
        answer: 1,
        explanation: 'Singleton 的主要缺點：(1) 難以測試——無法輕易將 Singleton 替換成 Mock 物件進行單元測試，且測試間共享狀態可能互相干擾；(2) 隱藏依賴——模組直接透過 getInstance() 使用 Singleton，依賴關係不透明；(3) 全域狀態問題——任何地方都可以修改，難以追蹤和控制。',
      },
      {
        id: 5,
        question: 'Redux Store 為何符合 Singleton 模式的概念？',
        options: [
          'Redux 使用了 private 建構子',
          'Redux Store 在整個應用中只有一個實例，作為全域唯一的狀態容器，所有元件共用',
          'Redux 的每個 Reducer 都是一個 Singleton',
          'Redux 使用了閉包來實作 Singleton',
        ],
        answer: 1,
        explanation: 'Redux Store 完全符合 Singleton 的概念：整個應用只建立一個 Store（通常在入口點建立），所有元件透過 Provider 存取同一個 Store 實例，共享全域唯一的狀態。這正是 Singleton 的核心——全域唯一的存取點。React Context 也是類似的概念，一個 Context 值在整個 Provider 樹中共享。',
      },
      {
        id: 6,
        question: 'Singleton 與全域變數最主要的差異是？',
        options: [
          '全域變數效能比 Singleton 好',
          'Singleton 提供封裝性、可延遲初始化，並控制實例的建立邏輯；全域變數直接暴露',
          '全域變數比 Singleton 更容易測試',
          '兩者完全相同，只是名稱不同',
        ],
        answer: 1,
        explanation: 'Singleton 比全域變數有幾個優勢：(1) 封裝性——透過方法存取，而非直接暴露內部狀態；(2) 延遲初始化——getInstance() 時才建立，節省資源；(3) 控制建立邏輯——建構子可以放複雜的初始化邏輯；(4) 防止多重實例——有機制確保唯一性。但兩者都有難以測試和全域狀態的共同缺點。',
      },
      {
        id: 7,
        question: '以下哪個場景最適合使用 Singleton 模式？',
        options: [
          '需要根據輸入建立不同類型物件的工廠邏輯',
          '需要全域共享的 Logger、設定檔、資料庫連線池等昂貴或需要全局一致的資源',
          '需要一個物件代理另一個物件的存取',
          '需要在不改變介面的情況下動態新增物件行為',
        ],
        answer: 1,
        explanation: 'Singleton 最適合需要「全域唯一且共享」的資源：Logger（統一日誌）、設定檔（全域設定值只需一份）、資料庫連線池（避免重複建立昂貴連線）、快取管理器等。工廠邏輯→工廠模式；代理→代理模式；動態新增行為→裝飾器模式。',
      },
    ],
    keyPoints: [
      'Singleton 確保一個類別只有一個實例，透過靜態方法 getInstance() 提供全域存取點。',
      'ES6 Module 天然具有 Singleton 效果：模組快取機制使同一份 export 在所有 import 處共享。',
      '傳統 OOP 實作：private 建構子防止外部 new，getInstance() 控制唯一實例的建立。',
      '使用場景：Logger、Config、資料庫連線池、Redux Store 等需要全域共享的資源。',
      '缺點：難以測試（無法替換成 Mock）、隱藏依賴、引入全域狀態，使用時應謹慎評估是否真的需要。',
    ],
  },

  // ─── 常見設計模式 ────────────────────────────────────────────────────────────
  {
    slug: 'proxy-pattern',
    title: '代理模式（Proxy）',
    description: '透過代理物件控制對目標物件的存取，JavaScript ES6 Proxy 的實際應用',
    subCategory: '常見設計模式',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: 'Proxy Pattern 核心概念',
          content: `代理模式提供一個「替代品」或「佔位符」來控制對目標物件的存取。所有對目標物件的操作都先經過代理。

\`\`\`
Client → Proxy → RealSubject（目標物件）
\`\`\`

代理可以：
- 在存取前後執行額外邏輯（如日誌、驗證、快取）
- 控制存取權限（如存取控制）
- 延遲建立昂貴物件（Virtual Proxy）
- 記錄所有操作（Logging Proxy）`,
        },
        {
          heading: 'JavaScript ES6 Proxy',
          content: `ES6 的 \`Proxy\` 物件讓我們能夠攔截並自定義對物件的基本操作。

\`\`\`ts
const handler = {
  // 攔截屬性讀取
  get(target, prop, receiver) {
    console.log(\`讀取: \${String(prop)}\`)
    return Reflect.get(target, prop, receiver)
  },
  // 攔截屬性設定
  set(target, prop, value, receiver) {
    console.log(\`設定: \${String(prop)} = \${value}\`)
    return Reflect.set(target, prop, value, receiver)
  },
  // 攔截 in 運算符
  has(target, prop) {
    return Reflect.has(target, prop)
  },
  // 攔截 delete
  deleteProperty(target, prop) {
    console.log(\`刪除: \${String(prop)}\`)
    return Reflect.deleteProperty(target, prop)
  },
}

const target = { name: 'Alice', age: 30 }
const proxy = new Proxy(target, handler)

proxy.name          // 觸發 get trap
proxy.email = 'a@b.com' // 觸發 set trap
delete proxy.age    // 觸發 deleteProperty trap
\`\`\``,
        },
        {
          heading: 'Reflect API 與 Proxy 搭配',
          content: `\`Reflect\` 是 ES6 提供的 API，與 Proxy 的 trap 一一對應，用於執行「預設行為」。

\`\`\`ts
// Reflect 的核心方法對應 Proxy traps：
Reflect.get(target, prop)        // 等同 target[prop]
Reflect.set(target, prop, val)   // 等同 target[prop] = val
Reflect.has(target, prop)        // 等同 prop in target
Reflect.deleteProperty(target, prop) // 等同 delete target[prop]

// 為什麼用 Reflect 而非直接操作 target？
const handler = {
  get(target, prop, receiver) {
    // ✅ 用 Reflect：正確處理繼承鏈和 getter 中的 this
    return Reflect.get(target, prop, receiver)
    // ❌ 直接 return target[prop]：可能在繼承場景出錯
  }
}
\`\`\`

**搭配原則：** Proxy trap 中總是用對應的 Reflect 方法執行預設行為，再在前後加入自訂邏輯。`,
        },
        {
          heading: '實際應用場景',
          content: `**1. 資料驗證（Validation Proxy）**
\`\`\`ts
function createValidatedUser(user: Record<string, unknown>) {
  return new Proxy(user, {
    set(target, prop, value) {
      if (prop === 'age' && (typeof value !== 'number' || value < 0)) {
        throw new TypeError('age 必須是非負整數')
      }
      if (prop === 'email' && !String(value).includes('@')) {
        throw new TypeError('email 格式不正確')
      }
      return Reflect.set(target, prop, value)
    }
  })
}
const user = createValidatedUser({})
user.age = -1 // TypeError: age 必須是非負整數
\`\`\`

**2. Vue 3 的響應式系統（reactive）**
\`\`\`ts
// Vue 3 用 Proxy 替代了 Vue 2 的 Object.defineProperty
// 攔截 get → 追蹤依賴（track）
// 攔截 set → 觸發更新（trigger）
// 優點：可以攔截新增屬性、陣列 index 操作（Vue 2 的痛點）
\`\`\`

**3. 日誌記錄 / 效能監控**
\`\`\`ts
function createLoggedAPI(api: Record<string, Function>) {
  return new Proxy(api, {
    get(target, prop) {
      const fn = Reflect.get(target, prop)
      return (...args: unknown[]) => {
        console.time(String(prop))
        const result = fn.apply(target, args)
        console.timeEnd(String(prop))
        return result
      }
    }
  })
}
\`\`\``,
        },
        {
          heading: 'Virtual Proxy 與 Protection Proxy',
          content: `**Virtual Proxy（虛擬代理 / 延遲載入）**
\`\`\`ts
// 大圖片的延遲載入代理：只在真正需要時才建立昂貴物件
class HeavyImage {
  constructor(private src: string) {
    // 模擬昂貴的圖片處理
    console.log(\`載入大圖片: \${src}\`)
  }
  display() { console.log(\`顯示: \${this.src}\`) }
}

class LazyImageProxy {
  private realImage: HeavyImage | null = null
  constructor(private src: string) {}

  display() {
    // 只在 display() 被呼叫時才建立真正的物件
    if (!this.realImage) {
      this.realImage = new HeavyImage(this.src)
    }
    this.realImage.display()
  }
}
\`\`\`

**Protection Proxy（保護代理 / 存取控制）**
\`\`\`ts
// 根據使用者角色控制存取
function createProtectedAPI(api: object, role: string) {
  return new Proxy(api, {
    get(target, prop) {
      if (prop === 'deleteUser' && role !== 'admin') {
        throw new Error('無權限：只有 admin 可以刪除使用者')
      }
      return Reflect.get(target, prop)
    }
  })
}
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: 'Proxy Pattern 的核心功能是什麼？',
        options: [
          '讓一個物件可以建立多個副本',
          '透過代理物件攔截並控制對目標物件的操作，在存取前後執行額外邏輯',
          '自動同步兩個物件的狀態',
          '讓多個物件共用同一個介面',
        ],
        answer: 1,
        explanation: 'Proxy Pattern 的核心是「控制存取」：在 Client 和真實物件之間插入一個代理，所有操作先經過代理。代理可以在操作前後加入驗證、日誌、快取、存取控制等邏輯，也可以延遲建立昂貴物件（Virtual Proxy）。JavaScript 的 ES6 Proxy 直接在語言層面提供了這個能力。',
      },
      {
        id: 2,
        question: 'JavaScript ES6 Proxy 的 `get` trap 在什麼時候被觸發？',
        options: [
          '只在使用 Object.get() 方法時觸發',
          '當存取代理物件的屬性時觸發（如 proxy.name 或 proxy["name"]）',
          '只在使用 Object.keys() 列舉屬性時觸發',
          '只在呼叫物件的方法時觸發',
        ],
        answer: 1,
        explanation: 'Proxy 的 `get` trap 在任何讀取屬性的操作時觸發，包括：`proxy.name`（點記法）、`proxy["name"]`（括號記法）、解構賦值（`const { name } = proxy`）等。這使得 `get` trap 是攔截所有屬性讀取的關鍵入口，Vue 3 就利用這個 trap 來追蹤哪些響應式資料被讀取（依賴追蹤）。',
      },
      {
        id: 3,
        question: '為什麼在 Proxy 的 trap 中應該使用 Reflect.get() 而非直接 return target[prop]？',
        options: [
          '因為 Reflect.get() 速度比 target[prop] 快',
          '因為 Reflect.get() 接受 receiver 參數，能正確處理繼承鏈中 getter 的 this 指向',
          '因為 target[prop] 無法讀取深層巢狀屬性',
          '兩者完全相同，只是風格不同',
        ],
        answer: 1,
        explanation: 'Reflect.get(target, prop, receiver) 的第三個參數 receiver 是關鍵：當 target 有 getter 方法時，getter 中的 this 會指向 receiver（即代理物件），而非 target。若直接用 target[prop]，getter 中的 this 指向 target，可能導致繼承場景下 this 指向錯誤的問題。使用 Reflect 確保行為與直接屬性存取一致。',
      },
      {
        id: 4,
        question: 'Vue 3 為什麼用 ES6 Proxy 取代 Vue 2 的 Object.defineProperty 來實作響應式？',
        options: [
          '因為 Proxy 效能比 Object.defineProperty 好 100 倍',
          'Proxy 可以攔截整個物件的操作（包括新增屬性、陣列 index 賦值），而 Object.defineProperty 只能攔截已存在的屬性',
          '因為 Object.defineProperty 只能在 Node.js 使用',
          'Proxy 語法更簡短，減少程式碼量',
        ],
        answer: 1,
        explanation: 'Vue 2 使用 Object.defineProperty 的限制：(1) 無法偵測新增/刪除屬性（需要 Vue.set/Vue.delete）；(2) 無法偵測陣列的 index 直接賦值（arr[0] = value）。Vue 3 的 Proxy 可以攔截整個物件的所有操作，包括新增屬性和陣列 index 操作，解決了 Vue 2 的響應式痛點，不再需要 $set 等特殊 API。',
      },
      {
        id: 5,
        question: '以下哪個是 Virtual Proxy（虛擬代理）的典型應用場景？',
        options: [
          '根據使用者角色限制 API 存取',
          '記錄所有 API 呼叫的時間',
          '延遲建立昂貴物件（如大圖片），只在真正需要時才初始化',
          '驗證設定物件的屬性值是否合法',
        ],
        answer: 2,
        explanation: 'Virtual Proxy（虛擬代理）的核心是「延遲初始化（Lazy Initialization）」：為昂貴物件建立一個輕量的代理，代理和真實物件有相同的介面，但真實物件只在第一次實際需要時才建立。常見應用：延遲載入大圖片、延遲建立資料庫連線、懶載入模組。根據角色限制存取→Protection Proxy；記錄時間→Logging Proxy；驗證屬性→Validation Proxy。',
      },
      {
        id: 6,
        question: '以下程式碼使用 Proxy 達到什麼效果？\n\nnew Proxy(user, { set(t, k, v) { if (k === "age" && v < 0) throw new Error("無效"); return Reflect.set(t, k, v) } })',
        options: [
          '讓 user 物件變成不可變（immutable）',
          '在設定屬性時進行資料驗證，age 不能為負數，否則拋出錯誤',
          '自動將所有屬性轉成字串',
          '記錄所有屬性的修改歷史',
        ],
        answer: 1,
        explanation: '這段程式碼建立了一個「驗證代理（Validation Proxy）」。Proxy 的 set trap 在每次屬性賦值時觸發，程式碼中攔截了對 age 的設定，若值小於 0 則拋出 Error，否則用 Reflect.set() 執行實際的賦值。這是 Proxy 最常見的應用之一：在不修改原始物件的情況下，為其加入驗證邏輯。',
      },
      {
        id: 7,
        question: 'Proxy Pattern 與 Decorator Pattern（裝飾器模式）最主要的差異是？',
        options: [
          '兩者完全相同，只是在不同語言中的叫法不同',
          'Proxy 控制對目標物件的「存取」（通常客戶端不直接持有目標物件）；Decorator 動態新增功能（客戶端可以持有真實物件）',
          'Decorator 只能在編譯期使用，Proxy 只能在執行期使用',
          'Proxy 只能用於函式，Decorator 只能用於類別',
        ],
        answer: 1,
        explanation: 'Proxy 和 Decorator 都是在原物件外包裝一層，但意圖不同：Proxy 側重「存取控制」，代理和真實物件對客戶端來說通常是透明的，客戶端可能不知道在和代理互動（如 Vue 3 的響應式物件）；Decorator 側重「動態新增功能」，通常客戶端知道在使用裝飾後的物件，且裝飾器可以堆疊。',
      },
    ],
    keyPoints: [
      'Proxy Pattern 在 Client 和目標物件之間插入代理，攔截並控制所有對目標的操作。',
      'ES6 Proxy 提供 get/set/has/deleteProperty 等 trap，讓我們在語言層面攔截物件操作。',
      'Reflect API 與 Proxy trap 一一對應，在 trap 中用 Reflect 執行預設行為，確保繼承鏈正確處理。',
      'Vue 3 用 ES6 Proxy 實作響應式，解決了 Vue 2（Object.defineProperty）無法偵測新增屬性的問題。',
      'Virtual Proxy：延遲建立昂貴物件；Protection Proxy：存取控制；Validation Proxy：資料驗證。',
    ],
  },

  // ─── 常見設計模式 ────────────────────────────────────────────────────────────
  {
    slug: 'factory-pattern',
    title: '工廠模式（Factory）',
    description: '透過工廠函式封裝物件建立邏輯，解耦呼叫端與具體實作',
    subCategory: '常見設計模式',
    difficulty: 'easy',
    notes: {
      sections: [
        {
          heading: 'Factory Function（工廠函式）',
          content: `最簡單的工廠形式：用函式建立並回傳物件，封裝建立邏輯，避免呼叫端直接 \`new\`。

\`\`\`ts
// 工廠函式：封裝物件建立邏輯
function createButton(type: 'primary' | 'danger' | 'ghost') {
  const baseStyle = 'px-4 py-2 rounded font-medium'
  const styleMap = {
    primary: \`\${baseStyle} bg-blue-500 text-white\`,
    danger:  \`\${baseStyle} bg-red-500 text-white\`,
    ghost:   \`\${baseStyle} border border-gray-300 text-gray-700\`,
  }
  return {
    className: styleMap[type],
    onClick: () => console.log(\`\${type} button clicked\`),
  }
}

// 呼叫端只需知道「要什麼」，不需知道「怎麼建立」
const btn = createButton('primary')
const dangerBtn = createButton('danger')
\`\`\`

**工廠函式的好處：**
- 封裝複雜的建立邏輯
- 根據參數動態決定建立哪種物件
- 便於替換實作，無需修改呼叫端`,
        },
        {
          heading: 'Simple Factory vs Factory Method vs Abstract Factory',
          content: `| 模式 | 說明 | 適用場景 |
|------|------|---------|
| Simple Factory | 一個函式/類別根據參數建立不同物件 | 物件種類少且固定 |
| Factory Method | 定義建立物件的介面，子類別決定實例化哪個類別 | 需要延伸建立邏輯，不同子類別有不同建立方式 |
| Abstract Factory | 建立一系列相關物件的工廠（工廠的工廠） | 需要建立一整套相互配合的物件族 |

\`\`\`ts
// Factory Method Pattern
abstract class Dialog {
  // 工廠方法：子類別決定建立哪種 Button
  abstract createButton(): Button

  render() {
    const button = this.createButton() // 呼叫工廠方法
    button.render()
  }
}

class WindowsDialog extends Dialog {
  createButton(): Button { return new WindowsButton() }
}
class MacDialog extends Dialog {
  createButton(): Button { return new MacButton() }
}

// Abstract Factory
interface UIFactory {
  createButton(): Button
  createCheckbox(): Checkbox
}
class WindowsUIFactory implements UIFactory {
  createButton() { return new WindowsButton() }
  createCheckbox() { return new WindowsCheckbox() }
}
\`\`\``,
        },
        {
          heading: 'JavaScript 中的工廠模式應用',
          content: `**React.createElement — 最廣為人知的工廠函式**
\`\`\`ts
// JSX 在 Babel 編譯後變成 React.createElement 呼叫
// <Button color="primary">Click</Button>
// 等同於：
React.createElement(Button, { color: 'primary' }, 'Click')

// React.createElement 根據第一個參數決定建立哪種元素
// 字串 → DOM 元素；函式/類別 → React Component
\`\`\`

**document.createElement — DOM 的工廠方法**
\`\`\`ts
// 不需要知道各種 HTML 元素的建構子，統一透過工廠建立
const div = document.createElement('div')
const input = document.createElement('input')
const canvas = document.createElement('canvas')
\`\`\`

**自訂工廠函式範例：根據環境建立不同的 API 客戶端**
\`\`\`ts
interface APIClient {
  get(url: string): Promise<unknown>
  post(url: string, data: unknown): Promise<unknown>
}
function createAPIClient(env: 'production' | 'test'): APIClient {
  if (env === 'test') {
    return { // Mock 客戶端
      get: async (url) => ({ data: 'mock data for ' + url }),
      post: async (url, data) => ({ success: true }),
    }
  }
  return { // 真實 HTTP 客戶端
    get: (url) => fetch(url).then(r => r.json()),
    post: (url, data) => fetch(url, { method: 'POST', body: JSON.stringify(data) }).then(r => r.json()),
  }
}
\`\`\``,
        },
        {
          heading: '工廠模式的優點',
          content: `**1. 解耦（Decoupling）**
\`\`\`ts
// ❌ 沒有工廠：呼叫端依賴具體類別
import { MySQLRepository } from './MySQLRepository'
const repo = new MySQLRepository(config)

// ✅ 有工廠：呼叫端只依賴介面
const repo = RepositoryFactory.create('mysql', config)
// 改換 MongoDB 只需改工廠，呼叫端不需修改
\`\`\`

**2. 封裝複雜的建立邏輯**
\`\`\`ts
// 工廠可以封裝很多初始化步驟
function createUserService(config: AppConfig) {
  const db = new DatabasePool(config.dbUrl, { maxConnections: 10 })
  const cache = new RedisCache(config.redisUrl)
  const logger = new Logger({ level: config.logLevel })
  return new UserService(db, cache, logger) // 注入所有依賴
}
\`\`\`

**3. 開放封閉原則（OCP）**
- 新增物件類型只需在工廠中新增一個 case，不需修改呼叫端
- 與策略模式結合使用效果更佳`,
        },
        {
          heading: '與建構子模式（Constructor Pattern）的差異',
          content: `| 特性 | Factory Function | Constructor Pattern（new） |
|------|-----------------|--------------------------|
| 建立方式 | 函式回傳物件 | 用 new 呼叫類別/建構子 |
| 繼承支援 | 通常不支援（或用組合替代） | 支援原型鏈繼承 |
| instanceof 檢查 | 不可用 | 可用（obj instanceof MyClass） |
| 封裝性 | 高（可隱藏建立細節） | 較低（呼叫端知道具體類別） |
| 靈活性 | 高（可回傳不同類型物件） | 固定回傳同一類別的實例 |
| 適合場景 | 需要封裝複雜邏輯或多型建立 | 需要明確類型和繼承關係 |

\`\`\`ts
// Factory Function（利用閉包實現私有狀態）
function createCounter() {
  let count = 0              // 私有，外部無法直接存取
  return {
    increment() { count++ },
    decrement() { count-- },
    getCount() { return count },
  }
}

// Constructor Pattern（需要 new，count 是公開的或用 WeakMap 私有化）
class Counter {
  private count = 0
  increment() { this.count++ }
  getCount() { return this.count }
}
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: '工廠模式（Factory Pattern）的主要目的是什麼？',
        options: [
          '讓一個類別只能有一個實例',
          '封裝物件的建立邏輯，讓呼叫端不需知道具體的建立細節，解耦呼叫端與具體實作',
          '讓物件在執行期動態新增方法',
          '確保多執行緒安全地存取共享資源',
        ],
        answer: 1,
        explanation: '工廠模式的核心是「封裝建立邏輯」，讓呼叫端只需告訴工廠「我要什麼」，不需知道「怎麼建立」，也不需要 import 具體的類別。這樣當實作需要替換時（如 MySQL 換 MongoDB），只需修改工廠，所有使用工廠的呼叫端都不需要改動，實現了對擴展開放、對修改封閉。',
      },
      {
        id: 2,
        question: 'React.createElement 是工廠模式的應用，它的工廠行為是指什麼？',
        options: [
          'React.createElement 確保每個 Component 只有一個實例',
          'React.createElement 根據傳入的類型（字串或 Component）建立對應的 React 元素物件，呼叫端不需直接操作底層 DOM',
          'React.createElement 讓 Component 可以繼承另一個 Component',
          'React.createElement 攔截所有屬性存取',
        ],
        answer: 1,
        explanation: 'React.createElement 是典型的工廠函式：根據第一個參數（字串如 "div" 或 React Component 函式）建立對應的 React 元素描述物件（Virtual DOM 節點）。我們寫的 JSX 最終都會被 Babel 編譯成 React.createElement 呼叫，呼叫端（我們的 JSX 程式碼）不需要知道 DOM 元素的具體建立細節。',
      },
      {
        id: 3,
        question: 'Simple Factory、Factory Method、Abstract Factory 三者最主要的差異是？',
        options: [
          '三者效能不同，Simple Factory 最快',
          'Simple Factory 在一個地方建立物件；Factory Method 讓子類別決定建立哪種物件；Abstract Factory 建立一整套相關物件族',
          '只有 Abstract Factory 支援多型',
          '三者完全相同，只是命名不同',
        ],
        answer: 1,
        explanation: 'Simple Factory：一個類別/函式根據參數建立不同物件，最簡單但不夠彈性；Factory Method：定義建立介面，子類別覆寫決定建立哪種物件，遵守 OCP；Abstract Factory：提供建立一系列相關物件的介面（如 WindowsUIFactory 同時建立 WindowsButton、WindowsCheckbox），確保物件族的一致性。',
      },
      {
        id: 4,
        question: '工廠模式與直接使用 new 建立物件相比，主要優勢是什麼？',
        options: [
          '工廠模式效能比 new 快 10 倍',
          '呼叫端不需 import 具體類別，便於替換實作；可封裝複雜的初始化邏輯；支援多型建立（同一介面回傳不同類型物件）',
          '工廠模式建立的物件有自動垃圾回收機制',
          '工廠模式強制物件只有一個實例',
        ],
        answer: 1,
        explanation: '工廠模式的主要優勢：(1) 解耦——呼叫端只依賴工廠介面，不依賴具體類別，替換實作（如換資料庫）只需改工廠；(2) 封裝——複雜的初始化、依賴注入邏輯集中在工廠中，呼叫端看到的是乾淨的建立介面；(3) 多型建立——同一個工廠可以根據條件回傳不同子類別的實例。',
      },
      {
        id: 5,
        question: '在 JavaScript 中，Factory Function 比起 Class（Constructor Pattern）在哪個方面更有優勢？',
        options: [
          'Factory Function 建立的物件支援 instanceof 檢查',
          'Factory Function 可透過閉包實現真正的私有狀態，且不需要 new 關鍵字，更靈活',
          'Factory Function 效能比 Class 好',
          'Factory Function 支援繼承，Class 不支援',
        ],
        answer: 1,
        explanation: 'Factory Function 的優勢：(1) 閉包私有狀態——變數天然是私有的，外部無法存取（不需要 private 關鍵字或 WeakMap 技巧）；(2) 不需要 new 關鍵字——減少忘記 new 的 bug；(3) 可回傳完全不同類型的物件——比 Class 更靈活。缺點是不支援 instanceof 和原型鏈繼承，記憶體使用可能較高（每個實例都有獨立的方法副本）。',
      },
      {
        id: 6,
        question: '以下哪個 React 場景是工廠模式概念的應用？',
        options: [
          '使用 useState 管理元件內部狀態',
          '根據 type prop 在工廠函式中回傳不同的 UI 元件（如根據 role 回傳不同的 Dashboard 元件）',
          '使用 useEffect 處理副作用',
          '透過 CSS className 切換樣式',
        ],
        answer: 1,
        explanation: '根據 props（如 type 或 role）在工廠函式中決定回傳哪種 Component 或 JSX，是 React 中工廠模式的典型應用。呼叫端不需知道具體用哪個 Component，只需傳入類型，工廠負責建立正確的 UI 元素。這遵守了 OCP：新增類型只需更新工廠，不需修改呼叫端。',
      },
      {
        id: 7,
        question: '工廠模式如何幫助單元測試？',
        options: [
          '工廠模式讓所有物件都自動可以被測試',
          '工廠可以根據環境（production/test）回傳真實實作或 Mock 物件，讓測試無需依賴外部資源',
          '工廠模式自動生成測試案例',
          '工廠模式讓 Mock 物件不需要實作介面',
        ],
        answer: 1,
        explanation: '工廠模式對測試非常友好：可以建立一個「測試工廠」，在測試環境下回傳 Mock 物件（如 MockDatabase、MockEmailService），而非真實的外部依賴。測試程式碼透過工廠取得依賴，不需直接 new 具體類別，只需替換工廠的實作即可切換真實/Mock 物件。這也是依賴注入（DI）的常見實踐方式。',
      },
      {
        id: 8,
        question: '下列哪個描述最準確地說明工廠模式與建構子模式（new）的適用時機？',
        options: [
          '只要是建立物件就用工廠模式，從不用 new',
          '工廠模式適合需要封裝複雜邏輯或多型建立的場景；建構子（new）適合建立邏輯簡單、需要明確類型和繼承的場景',
          '只有在需要 Singleton 時才用工廠模式',
          'new 永遠比工廠模式好，因為效能更高',
        ],
        answer: 1,
        explanation: '工廠模式最適合：需要根據條件動態決定建立哪種物件、建立邏輯複雜（多個依賴注入）、需要解耦呼叫端與具體類別的場景。直接 new 最適合：建立邏輯簡單直接、需要 instanceof 類型檢查、需要繼承關係的場景。實務上兩者常常結合使用，不需強求只用一種。',
      },
    ],
    keyPoints: [
      '工廠模式封裝物件建立邏輯，呼叫端只需告訴工廠「要什麼」，不需知道「怎麼建立」或依賴具體類別。',
      '三種工廠層次：Simple Factory（單一函式根據參數建立）、Factory Method（子類別決定建立）、Abstract Factory（建立物件族）。',
      'JavaScript 應用：React.createElement、document.createElement 都是工廠函式的實際例子。',
      'Factory Function vs Class：工廠函式可用閉包實現真正私有狀態，更靈活；Class 支援繼承和 instanceof。',
      '工廠模式與測試：工廠可根據環境回傳真實實作或 Mock 物件，大幅提高可測試性。',
    ],
  },
]
