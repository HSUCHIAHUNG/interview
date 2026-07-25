import { config } from 'dotenv'
config({ path: '.env.local' })
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../lib/db/schema'

const client = neon(process.env.DATABASE_URL!)
const db = drizzle(client, { schema })

const THEME = 'React'

const subCategories = [
  { name: 'Core Concepts', order: 1 },
  { name: 'Hooks', order: 2 },
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
    slug: 'react-fundamentals',
    title: 'React 核心概念',
    description: '了解 Virtual DOM、單向資料流、reconciliation 和 React Fiber 的核心設計理念。',
    difficulty: 'easy',
    subCategory: 'Core Concepts',
    questions: [
      {
        order: 1,
        question: 'React 的 Virtual DOM 主要解決什麼問題？',
        options: [
          '讓瀏覽器不需要載入 CSS',
          '透過比對最小差異減少真實 DOM 操作，提升效能',
          'Virtual DOM 比真實 DOM 快，所有操作都在記憶體完成不需要真實 DOM',
          '讓 React 可以在 Node.js 環境執行',
        ],
        answer: 1,
        explanation:
          'Virtual DOM 是一個輕量的 JavaScript 物件樹，React 每次渲染時先更新 Virtual DOM，再透過 diffing 演算法（reconciliation）找出最小差異，只更新真實 DOM 中需要改變的部分。這樣可以批次合併 DOM 操作，避免不必要的 layout/reflow，提升效能。Virtual DOM 最終仍然需要更新真實 DOM。',
      },
      {
        order: 2,
        question: 'React 的「單向資料流」是什麼意思？',
        options: [
          '資料只能從子元件流向父元件',
          '資料只能從父元件透過 props 流向子元件，子元件不能直接修改 props',
          '資料在同層元件之間自動同步',
          '資料只能存在 Redux store 中',
        ],
        answer: 1,
        explanation:
          '單向資料流（One-way Data Flow）是 React 的核心設計原則：資料從父元件透過 props 傳遞給子元件，子元件不能直接修改 props。若子元件需要影響父元件的資料，必須透過父元件傳下來的 callback 函式（event handler）通知父元件更新 state。這讓資料流向清晰可預測，easier to debug。',
      },
      {
        order: 3,
        question: '什麼是 React 的 Reconciliation？',
        options: [
          'React 元件之間溝通的機制',
          'React 將新的 Virtual DOM 和上一次的 Virtual DOM 進行比對，找出最小差異並只更新真實 DOM 中變化部分的過程',
          'React 把 JSX 轉換成 JavaScript 的過程',
          'React 處理非同步資料的機制',
        ],
        answer: 1,
        explanation:
          'Reconciliation 是 React 的 diffing 演算法。每次 state 或 props 更新後，React 產生新的 Virtual DOM 樹，並和上一次的 Virtual DOM 進行比較（diff）。React 採用啟發式演算法（O(n) 而非 O(n³)）：同層比較、用 key 識別列表元素。找出差異後，只更新真實 DOM 中需要改變的節點，而非重新渲染整個頁面。',
      },
      {
        order: 4,
        question: '什麼是 React Fiber？',
        options: [
          '一個用於處理 HTTP 請求的 React 函式庫',
          'React 16 重寫的協調引擎，讓渲染工作可以被切分、暫停、繼續和設定優先順序',
          'React 的狀態管理解決方案，可以取代 Redux',
          '一個讓 React 支援 TypeScript 的工具',
        ],
        answer: 1,
        explanation:
          'React Fiber 是 React 16 完全重寫的協調（reconciliation）引擎。傳統 Stack Reconciler 是同步的，一旦開始渲染就無法中斷，可能導致畫面卡頓。Fiber 將渲染工作切分成小單元（fiber），可以在每一幀的空閒時間執行，並支援暫停、繼續、丟棄和優先化。這讓 Concurrent Features（並發模式）成為可能。',
      },
      {
        order: 5,
        question: 'JSX 中的 <Button onClick={handleClick}>送出</Button> 編譯後等同於什麼？',
        options: [
          'document.createElement("Button", { onClick: handleClick }, "送出")',
          'React.createElement(Button, { onClick: handleClick }, "送出")',
          'new Button({ onClick: handleClick, children: "送出" })',
          'React.render(Button, { onClick: handleClick })',
        ],
        answer: 1,
        explanation:
          'JSX 是 React.createElement() 的語法糖。Babel 等編譯器將 JSX 轉換為 React.createElement(type, props, ...children) 的呼叫。type 可以是字串（HTML 元素，如 "div"）或元件（大寫開頭的 React 元件）。props 是屬性物件，children 是子節點。React 17+ 使用 _jsx() 取代 React.createElement() 但語意相同。',
      },
    ],
  },

  {
    slug: 'react-lifecycle',
    title: '元件生命週期',
    description: '掌握 class 元件生命週期方法和函式元件用 useEffect 模擬生命週期的對應方式。',
    difficulty: 'medium',
    subCategory: 'Core Concepts',
    questions: [
      {
        order: 1,
        question: '函式元件中如何模擬 componentDidMount（只在 mount 時執行一次）？',
        options: [
          'useEffect(() => { ... })',
          'useEffect(() => { ... }, undefined)',
          'useEffect(() => { ... }, [])',
          'useEffect(() => { ... }, [mounted])',
        ],
        answer: 2,
        explanation:
          'useEffect 傳入空依賴陣列 [] 時，effect 只在元件 mount（第一次渲染後）執行一次，等同於 class 元件的 componentDidMount。若不傳依賴陣列，effect 在每次渲染後都執行（等同 componentDidUpdate 的無條件版本）；若不傳空陣列而傳 undefined，TypeScript 會報錯。',
      },
      {
        order: 2,
        question: '函式元件中如何模擬 componentWillUnmount（元件銷毀時清理）？',
        options: [
          'useEffect(() => { return () => { cleanup() } }, [])',
          'useEffect(() => { cleanup() }, [])',
          'useUnmount(() => { cleanup() })',
          'useEffect(() => { cleanup() }, [null])',
        ],
        answer: 0,
        explanation:
          'useEffect 的回傳函式（cleanup function）在元件 unmount 時執行，等同 componentWillUnmount。語法：useEffect(() => { // setup; return () => { // cleanup }; }, [])。cleanup 也會在下一次 effect 執行前執行（當依賴改變時），讓你清理上一次的 effect（如取消訂閱、清除 timer）。',
      },
      {
        order: 3,
        question:
          'React class 元件中，哪些生命週期方法在 React 16.3 後被標記為 UNSAFE_（不建議使用）？',
        options: [
          'componentDidMount、componentDidUpdate、componentWillUnmount',
          'componentWillMount、componentWillReceiveProps、componentWillUpdate',
          'shouldComponentUpdate、getSnapshotBeforeUpdate',
          'render、constructor',
        ],
        answer: 1,
        explanation:
          'React 16.3 將三個生命週期標記為 UNSAFE_：UNSAFE_componentWillMount、UNSAFE_componentWillReceiveProps、UNSAFE_componentWillUpdate。原因是它們在 Concurrent Mode 下可能被呼叫多次，含有副作用時行為不可預期。建議用 componentDidMount、getDerivedStateFromProps、getSnapshotBeforeUpdate 取代。',
      },
      {
        order: 4,
        question: 'React.PureComponent 和 React.Component 的差別是什麼？',
        options: [
          'PureComponent 不能有 state，Component 可以',
          'PureComponent 自動實作 shouldComponentUpdate，對 props 和 state 做淺比較，相同則跳過 re-render',
          'PureComponent 效能一定比 Component 好，所有情況都應使用',
          'PureComponent 只能在 class 元件中使用',
        ],
        answer: 1,
        explanation:
          'PureComponent 自動實作 shouldComponentUpdate，在 props 和 state 改變前做淺比較（Shallow Comparison）。若所有值相同，則跳過重新渲染，達到效能優化。注意「淺比較」：對於物件和陣列，只比較引用（reference），不比較內容。若傳入新物件（即使內容相同），PureComponent 仍會重新渲染。函式元件的對應是 React.memo。',
      },
      {
        order: 5,
        question: 'getDerivedStateFromProps 的正確用法是什麼？',
        options: [
          '用來發送 API 請求並更新 state',
          '根據 props 的變化來更新 state，它是靜態方法，不能存取 this',
          '用來在 render 前讀取 DOM 資訊',
          '替代 componentDidMount 初始化 state',
        ],
        answer: 1,
        explanation:
          'getDerivedStateFromProps(props, state) 是靜態方法（static），在每次渲染前呼叫，用來根據 props 衍生（derive）新的 state。因為是靜態方法，無法存取 this（不能有副作用）。回傳物件更新 state，或回傳 null 不做任何更新。在絕大多數情況下不需要使用，優先考慮 memoization 或 key 重置元件。',
      },
    ],
  },

  {
    slug: 'react-rerender',
    title: 'Re-render 機制與 key',
    description:
      '了解哪些情況觸發 React re-render、React key 的重要性，以及 React 18 的 Automatic Batching。',
    difficulty: 'medium',
    subCategory: 'Core Concepts',
    questions: [
      {
        order: 1,
        question: '以下哪個情況「不會」直接造成 React 元件 re-render？',
        options: [
          'useState 的 setter 被呼叫（即使值相同）',
          '父元件 re-render（子元件會跟著 re-render）',
          'useRef.current 的值被修改',
          'useContext 的 Context value 改變',
        ],
        answer: 2,
        explanation:
          'useRef.current 的值改變「不會」觸發 re-render，這是 useRef 的核心特性之一。觸發 re-render 的情況：1) state 改變（useState、useReducer）；2) 父元件 re-render（未用 memo 包裹的情況）；3) useContext 的 Context value 改變。注意：useState setter 傳入相同值時，React 18 會跳過重新渲染（Object.is 比較）。',
      },
      {
        order: 2,
        question: 'React 中 key 的主要用途是什麼？',
        options: [
          '讓 React 知道元件的 CSS 樣式',
          '幫助 React 在 reconciliation 時識別哪些列表元素被新增、移動或刪除，維持正確的元件狀態',
          '讓父元件可以直接存取子元件的 ref',
          '讓 React Router 識別不同的頁面路由',
        ],
        answer: 1,
        explanation:
          'key 讓 React 在列表重新渲染時追蹤元素的身份（identity）。沒有 key 時，React 用位置比對；有 key 時，React 用 key 比對，可以正確處理排序、新增、刪除。若 key 改變，React 會銷毀舊元件並建立新元件（重置 state）。這也是一個強制重置元件 state 的技巧：改變 key 讓元件重新 mount。',
      },
      {
        order: 3,
        question: '為什麼不建議使用陣列 index 作為 React 列表的 key？',
        options: [
          '因為 index 從 0 開始，React 無法識別',
          '當列表項目被重新排序、新增或刪除時，index 會改變，導致 React 錯誤地復用元件狀態',
          '因為 index 是數字，key 必須是字串',
          '使用 index 會讓效能變差',
        ],
        answer: 1,
        explanation:
          '使用 index 作為 key 的問題：當列表項目位置改變時（排序、在開頭插入），index 也跟著改變，React 誤以為是「同一個 key 的元素有了新值」，而非「元素移動」，可能導致輸入框值錯位、動畫異常等 bug。若列表項目有穩定的唯一 ID（如資料庫 ID），應使用 ID 作為 key。靜態且不會重新排序的列表，用 index 才是可以接受的。',
      },
      {
        order: 4,
        question: '什麼是 React 18 的 Automatic Batching？',
        options: [
          'React 18 自動壓縮所有元件的 props',
          '多個 state 更新被合併成一次 re-render。React 18 將 batching 擴展到 Promise、setTimeout、原生事件等非 React 事件中',
          'React 18 自動快取所有元件的渲染結果',
          'React 18 自動合併相鄰的 useEffect 呼叫',
        ],
        answer: 1,
        explanation:
          'Batching 是把多個 setState 合併成一次 re-render。React 17 只在 React 事件處理器（onClick 等）中自動 batch；setTimeout、Promise.then、原生事件中的多個 setState 會各自觸發 re-render。React 18 的 Automatic Batching 讓所有情況（包括 setTimeout、fetch 的 .then）都自動 batch，減少不必要的 re-render。若需要強制立即更新，可用 flushSync()。',
      },
      {
        order: 5,
        question:
          '以下程式碼在 React 18 中，點擊按鈕後會 re-render 幾次？\n\nfunction handleClick() {\n  setCount(c => c + 1)\n  setName("Bob")\n  setActive(true)\n}',
        options: [
          '3 次（每個 setState 各一次）',
          '1 次（React 18 自動 batch 合併為一次）',
          '2 次',
          '視瀏覽器而定',
        ],
        answer: 1,
        explanation:
          'React 18 的 Automatic Batching 讓同一個事件處理器中的多個 setState 合併成一次 re-render。因此三個 state 更新只觸發 1 次 re-render，而非 3 次。在 React 17 中，若這個函式是在 setTimeout 或 Promise 中呼叫，會觸發 3 次 re-render；在 onClick 中直接呼叫也是 1 次（React 17 在事件處理器中也有 batching）。',
      },
    ],
  },

  {
    slug: 'react-hooks-intro',
    title: 'React Hooks 入門',
    description: '了解 React Hooks 出現的原因、使用規則，以及常見 Hooks 的基本用途。',
    difficulty: 'easy',
    subCategory: 'Hooks',
    questions: [
      {
        order: 1,
        question: 'React Hooks 主要解決了 class 元件的哪些問題？',
        options: [
          '讓 React 支援 TypeScript',
          '解決有狀態邏輯難以在元件間複用、複雜元件難以理解（生命週期方法混合不相關邏輯）、class 帶來的學習成本和 this 問題',
          '讓 React 的渲染速度更快',
          '讓 React 可以在 Server Side 渲染',
        ],
        answer: 1,
        explanation:
          'Hooks 在 React 16.8 推出，解決三個 class 元件的問題：1) 有狀態邏輯難以複用（HOC 和 render props 導致「wrapper hell」）；2) 複雜元件難以理解（componentDidMount 混合訂閱、資料請求等不相關邏輯）；3) class 本身的問題（this 綁定、難以 minify、難以讓開發者理解）。自訂 Hook 讓有狀態邏輯可以輕鬆抽取和複用。',
      },
      {
        order: 2,
        question: '以下哪個是 React Hooks 的使用規則？',
        options: [
          '只能在 class 元件的 render 方法中呼叫',
          'Hook 只能在 React 函式元件或自訂 Hook 的頂層呼叫，不能在迴圈、條件式或巢狀函式中呼叫',
          'Hook 可以在任何 JavaScript 函式中呼叫',
          '每個元件最多只能呼叫 3 個 Hook',
        ],
        answer: 1,
        explanation:
          'React Hooks 有兩條規則（Rules of Hooks）：1) 只在頂層呼叫：不能在 if/else、for 迴圈、巢狀函式中呼叫 Hook，確保每次渲染 Hook 的呼叫順序相同（React 依賴呼叫順序來關聯 Hook 的 state）；2) 只在 React 函式中呼叫：只能在函式元件或自訂 Hook 中呼叫，不能在普通 JavaScript 函式中。',
      },
      {
        order: 3,
        question: '以下哪個程式碼違反了 React Hooks 的規則？',
        options: [
          'const [count, setCount] = useState(0)',
          'if (isLoggedIn) { const [user, setUser] = useState(null) }',
          'function useCustomHook() { const [val, setVal] = useState(0) }',
          'const doubled = useMemo(() => count * 2, [count])',
        ],
        answer: 1,
        explanation:
          '在條件式（if）中呼叫 Hook 違反了「只在頂層呼叫」的規則。React 靠 Hook 的呼叫順序來識別每個 Hook 的 state，若順序因條件不同而改變，React 會將 state 關聯到錯誤的 Hook。正確做法是把條件放在 Hook 內部，或者讓整個元件在條件不滿足時回傳 null。',
      },
      {
        order: 4,
        question: '自訂 Hook 的命名有什麼規則？',
        options: [
          '可以用任何名稱，沒有特別規定',
          '必須以 use 開頭（如 useAuth、useFetch），讓 React 知道這是 Hook 並可以在其中呼叫其他 Hook',
          '必須以 hook 結尾（如 authHook）',
          '必須是大寫開頭（如 UseAuth）',
        ],
        answer: 1,
        explanation:
          '自訂 Hook 必須以 use 開頭，這是 React 的慣例。React 的 linter（eslint-plugin-react-hooks）依靠這個命名慣例來識別哪些函式是 Hook，並對其套用 Rules of Hooks 的檢查。若不以 use 開頭，linter 不會對它做 Hook 規則的校驗，你也無法在其中呼叫其他 Hook（技術上可以執行，但不符合規範）。',
      },
      {
        order: 5,
        question: '以下 Hook 對應的用途，哪個描述是正確的？',
        options: [
          'useState：訂閱 Context；useContext：管理本地 state；useRef：執行副作用',
          'useState：管理本地 state；useEffect：執行副作用（資料請求、訂閱）；useRef：取得 DOM 元素或存放不觸發 re-render 的值',
          'useMemo：管理本地 state；useCallback：快取函式；useState：快取計算結果',
          'useReducer：只能用於簡單的計數器；useContext：只能用於主題切換',
        ],
        answer: 1,
        explanation:
          '常用 Hooks 的核心用途：useState 管理本地 state，setter 呼叫時觸發 re-render；useEffect 在渲染後執行副作用（資料請求、DOM 操作、訂閱），並可回傳 cleanup 函式；useRef 取得 DOM 元素的 reference，或存放不需要觸發 re-render 的可變值；useContext 訂閱 React Context 的值；useMemo 快取計算結果；useCallback 快取函式；useReducer 管理複雜 state 邏輯。',
      },
    ],
  },

  {
    slug: 'react-usestate',
    title: 'useState 深入解析',
    description:
      '深入了解 useState 的初始化方式、不可變更新原則、巢狀狀態的正確更新方法，以及 setState 的非同步特性。',
    difficulty: 'medium',
    subCategory: 'Hooks',
    questions: [
      {
        order: 1,
        question:
          '以下哪種 useState 的初始化方式在初始值計算耗時時較佳？\n\n// 方式 A\nconst [data, setData] = useState(expensiveComputation())\n// 方式 B\nconst [data, setData] = useState(() => expensiveComputation())',
        options: [
          '方式 A，因為語法更簡潔',
          '方式 B（Lazy Initialization），因為初始化函式只在第一次渲染時執行，後續重新渲染時不會再執行',
          '兩者效能完全相同',
          '方式 A，因為直接傳值型別更安全',
        ],
        answer: 1,
        explanation:
          '傳入函式（Lazy Initialization）是關鍵優化：useState(() => expensiveComputation()) 中，函式只在第一次渲染時被呼叫一次。而 useState(expensiveComputation()) 在「每次渲染」時都會先呼叫 expensiveComputation() 計算結果，然後 useState 才忽略這個值（因為只有第一次才用）。因此耗時計算、讀取 localStorage、解析 JSON 等情況都應使用初始函式。',
      },
      {
        order: 2,
        question:
          '更新 useState 的物件 state 時，以下哪個做法是正確的？\n\nconst [user, setUser] = useState({ name: "Alice", age: 25 })',
        options: [
          'user.name = "Bob"; setUser(user)',
          'setUser({ ...user, name: "Bob" })',
          'setUser(Object.assign(user, { name: "Bob" }))',
          'setUser(prev => { prev.name = "Bob"; return prev })',
        ],
        answer: 1,
        explanation:
          'React 的 state 必須以不可變（immutable）的方式更新。直接修改 state 物件（mutation）不會觸發 re-render，因為 React 用 Object.is 比較引用，同一個物件引用不變 → React 認為沒有更新。正確做法是建立新物件：setUser({ ...user, name: "Bob" }) 使用 spread 語法複製舊屬性並覆蓋要修改的屬性，這樣 React 收到新的物件引用，觸發 re-render。',
      },
      {
        order: 3,
        question:
          '假如 useState 存放 array of objects，要更新特定 item 的屬性，哪個做法正確？\n\nconst [items, setItems] = useState([{ id: 1, done: false }, { id: 2, done: false }])',
        options: [
          'items[0].done = true; setItems(items)',
          'setItems(items.map(item => item.id === 1 ? { ...item, done: true } : item))',
          'setItems([...items, { id: 1, done: true }])',
          'items.splice(0, 1, { id: 1, done: true }); setItems(items)',
        ],
        answer: 1,
        explanation:
          '更新陣列中特定 item 的正確做法是 map + spread：用 map 遍歷陣列，找到目標 item 時回傳新物件（{ ...item, done: true }），其餘 item 原封不動。這樣產生一個全新的陣列和全新的物件，滿足不可變更新的要求。直接 mutation（items[0].done = true 或 splice）不會觸發 re-render，因為陣列引用沒有改變。',
      },
      {
        order: 4,
        question:
          'setState 是同步還是非同步的？\n\nfunction handleClick() {\n  setCount(1)\n  console.log(count) // 印出多少？\n}',
        options: [
          '同步，console.log 立刻印出 1',
          '非同步，console.log 印出的是更新前的舊值（state 更新在渲染後才反映）',
          'setState 本身是同步的，但 re-render 是非同步的',
          '視瀏覽器版本而定',
        ],
        answer: 1,
        explanation:
          'setState 的更新是「非同步」的（批次處理）。呼叫 setCount(1) 後，state 不立刻更新，React 會等當前事件處理器執行完畢才批次處理所有 state 更新並觸發 re-render。因此 console.log(count) 印出的是舊值。若需要在 state 更新後執行某些邏輯，應使用 useEffect 並將 count 放入依賴陣列。需要基於前一個值更新 state 時，使用函式式更新：setCount(prev => prev + 1)。',
      },
      {
        order: 5,
        question:
          '使用函式式更新（setCount(prev => prev + 1)）vs 直接更新（setCount(count + 1)）的差別是什麼？',
        options: [
          '沒有差別，兩者等效',
          '函式式更新確保基於最新的 state 值更新，在連續多次呼叫或 async 情境下更安全；直接更新可能用到過時的 state（closure 問題）',
          '直接更新效能更好',
          '函式式更新只能在 class 元件中使用',
        ],
        answer: 1,
        explanation:
          '函式式更新（prev => prev + 1）確保每次都基於 React 內部最新的 state 值（prev）計算，而非 closure 捕捉到的舊值。若在 setTimeout 等非同步情境中或連續多次呼叫 setState，直接使用 count 可能因 closure 問題讀到舊值（stale closure）。例如連續呼叫 setCount(count + 1) 三次，若 count 是 0，三次都用 0 + 1 = 1；但 setCount(prev => prev + 1) 三次則分別得到 1、2、3。',
      },
    ],
  },
]

async function seed() {
  console.log(`新增 React 主題子類別...`)
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

  console.log(`\n新增 ${topics.length} 個 React 主題及題目...`)
  for (const topic of topics) {
    const [inserted] = await db
      .insert(schema.topics)
      .values({
        slug: topic.slug,
        title: topic.title,
        description: topic.description,
        category: 'React',
        difficulty: topic.difficulty,
        theme: THEME,
        subCategory: topic.subCategory,
      })
      .onConflictDoUpdate({
        target: schema.topics.slug,
        set: {
          title: topic.title,
          description: topic.description,
          category: 'React',
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

  console.log('\n✅ React Part 1 主題建立完成')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
