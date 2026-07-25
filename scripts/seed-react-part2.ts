import { config } from 'dotenv'
config({ path: '.env.local' })
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../lib/db/schema'

const client = neon(process.env.DATABASE_URL!)
const db = drizzle(client, { schema })

const THEME = 'React'

const subCategories = [
  { name: 'Performance Optimization', order: 3 },
  { name: 'State Management', order: 4 },
  { name: 'Patterns', order: 5 },
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
    slug: 'react-useeffect',
    title: 'useEffect 深入解析',
    description: '掌握 useEffect 的依賴陣列規則、cleanup 機制、物件比較陷阱，以及 useLayoutEffect 的使用時機。',
    difficulty: 'medium',
    subCategory: 'Hooks',
    questions: [
      {
        order: 1,
        question: '以下三種 useEffect 寫法的執行時機各是什麼？\n\nA: useEffect(() => {})\nB: useEffect(() => {}, [])\nC: useEffect(() => {}, [count])',
        options: [
          'A: 只執行一次；B: 每次渲染都執行；C: count 改變時執行',
          'A: 每次渲染後執行；B: 只在 mount 時執行一次；C: mount 時 + count 改變時執行',
          'A: 只在 unmount 時執行；B: 每次渲染後執行；C: 只執行一次',
          'A: 每次渲染前執行；B: 只在 mount 時執行一次；C: 每次渲染後執行',
        ],
        answer: 1,
        explanation: 'useEffect 的執行時機由第二個參數決定：A) 不傳依賴陣列 → 每次渲染後都執行（mount + 每次 update）；B) 傳空陣列 [] → 只在 mount 後執行一次（等同 componentDidMount）；C) 傳 [count] → mount 後執行一次，之後每次 count 改變（React.is 比較不同）後都再執行。這三種是 useEffect 的核心用法。',
      },
      {
        order: 2,
        question: 'useEffect 的 cleanup function（回傳的函式）會在什麼時候執行？',
        options: [
          '只在元件 unmount 時執行一次',
          '在元件 unmount 前，以及每次下一個 effect 執行前（依賴改變時）',
          '在每次 effect 執行後立即執行',
          '只在 count 改變時執行，unmount 時不執行',
        ],
        answer: 1,
        explanation: 'cleanup function 有兩個執行時機：1) 元件 unmount 時（等同 componentWillUnmount）；2) 下一次 effect 執行之前（當依賴改變，需要先清理上一次的 effect）。這讓你可以正確清理訂閱、timer、event listener 等。例如：每次 userId 改變時先取消前一次的訂閱，再建立新的訂閱。',
      },
      {
        order: 3,
        question: '假如 useEffect 的 dependency array 放了一個物件或陣列，會有什麼問題？\n\nuseEffect(() => { fetchData() }, [options]) // options 是物件',
        options: [
          '沒有問題，物件會被深比較',
          '每次元件 re-render 時，即使 options 的內容沒有改變，useEffect 也可能重複執行，因為每次渲染都建立新的物件引用',
          '只有 options 的 key 改變才會重新執行',
          '物件不能放入 dependency array，TypeScript 會報錯',
        ],
        answer: 1,
        explanation: 'React 用 Object.is 比較依賴陣列的每個值。對於物件和陣列，Object.is 比較的是「引用」而非「內容」。每次 re-render 時，即使 { timeout: 5000 } 的內容相同，也是全新的物件（新引用），導致 useEffect 每次都觸發。解法：1) 把物件的具體屬性放進依賴陣列（[options.timeout]）；2) 用 useMemo 快取物件；3) 把物件移到元件外（如果是常數）。',
      },
      {
        order: 4,
        question: 'useLayoutEffect 和 useEffect 的主要差別是什麼？',
        options: [
          'useLayoutEffect 只能用於伺服器端渲染',
          'useLayoutEffect 在 DOM 更新後、瀏覽器繪製前同步執行；useEffect 在瀏覽器繪製後非同步執行',
          'useLayoutEffect 執行次數比 useEffect 少',
          'useLayoutEffect 不支援 cleanup function',
        ],
        answer: 1,
        explanation: 'useLayoutEffect 在 DOM 更新後、瀏覽器繪製（paint）前「同步」執行，等同 class 元件的 componentDidMount/componentDidUpdate 的原始執行時機。useEffect 在瀏覽器繪製後「非同步」執行，不阻塞渲染。使用 useLayoutEffect 的時機：需要在使用者看到畫面前讀取 DOM 佈局（getBoundingClientRect）並立即做 DOM 修改，避免畫面閃爍。大多數情況優先使用 useEffect，避免阻塞渲染。',
      },
      {
        order: 5,
        question: '以下在 useEffect 中使用 async/await 的寫法，哪個是正確的？',
        options: [
          'useEffect(async () => { const data = await fetch(url); setData(data) }, [url])',
          'useEffect(() => { const fetchData = async () => { const data = await fetch(url); setData(data) }; fetchData() }, [url])',
          'useEffect(() => { fetch(url).then(setData) }, [url])  // 只有這種才合法',
          'useEffect 不支援非同步操作',
        ],
        answer: 1,
        explanation: 'useEffect 的回調函式不能直接是 async 函式，因為 async 函式回傳 Promise，但 useEffect 期望回傳的是 cleanup function 或 undefined。正確做法：在 useEffect 內定義並立即呼叫 async 函式。也可以使用 Promise.then。另外要注意 race condition：若 url 快速改變，需要在 cleanup 中取消前一次的請求（AbortController）或用 ignore flag。',
      },
    ],
  },

  {
    slug: 'react-useref',
    title: 'useRef 使用與陷阱',
    description: '學習 useRef 和 useState 的核心差異、useRef 在依賴陣列中的行為，以及模組外變數和 useRef 的選擇時機。',
    difficulty: 'medium',
    subCategory: 'Hooks',
    questions: [
      {
        order: 1,
        question: 'useRef 和 useState 最核心的差別是什麼？',
        options: [
          'useRef 只能存放 DOM 元素，useState 可以存放任何值',
          'useRef 的值改變不觸發 re-render；useState 的值改變會觸發 re-render。useRef 在 re-render 之間保持同一個 ref 物件',
          'useRef 比 useState 效能更好，應優先使用',
          'useRef 不能在函式元件中使用',
        ],
        answer: 1,
        explanation: 'useRef 和 useState 的根本差別：1) re-render：修改 ref.current 不觸發 re-render；修改 state 會觸發 re-render；2) 持久性：useRef 回傳的 ref 物件在整個元件生命週期中是同一個物件；3) 用途：useRef 適合存放「需要跨渲染保存但不需要顯示在 UI 上」的值，如 timer ID、DOM 元素、上一次的值等。若需要顯示在 UI 上的資料，用 useState。',
      },
      {
        order: 2,
        question: '如果把 useRef 物件放入 useEffect 的 dependency array，元件 re-render 時 useEffect 會觸發嗎？',
        options: [
          '會，因為 useRef 物件是新的引用',
          '不會，useRef 回傳的 ref 物件在整個生命週期中是同一個物件（相同引用），Object.is 比較相同，不觸發 useEffect',
          '只有在 ref.current 改變時才會觸發',
          '視 ref.current 的型別而定',
        ],
        answer: 1,
        explanation: 'useRef() 回傳的是一個 { current: ... } 物件，而且在元件整個生命週期中「始終是同一個物件」（同一個引用）。因此把 ref 放入 dependency array，Object.is 比較永遠為 true（相同），useEffect 不會因為 ref 物件本身而重新執行。注意：ref.current 的值改變也不觸發 useEffect，因為 React 不追蹤 ref.current 的變化。',
      },
      {
        order: 3,
        question: 'useRef 的值（ref.current）改變，會觸發 useEffect 嗎？',
        options: [
          '會，React 會追蹤 ref.current 的變化',
          '不會，React 不追蹤 ref.current 的變化。即使把 ref.current 放入 dependency array，改變時也不觸發 useEffect',
          '只有在下一次 re-render 後才觸發',
          '只有 DOM ref 改變時才觸發',
        ],
        answer: 1,
        explanation: 'React 不追蹤 ref.current 的變化。即使把 ref.current 放入 dependency array，當 ref.current 改變時，React 不知道它改變了，因此不觸發 useEffect。這是設計上的刻意決定：ref 的用途就是存放「不需要 React 追蹤的可變值」。若需要在值改變時執行邏輯，應使用 useState（會觸發 re-render 和 useEffect）。',
      },
      {
        order: 4,
        question: '把變數宣告在 component 函式之外（模組層級）和放在 useRef 裡有什麼差別？',
        options: [
          '完全相同，可以互換使用',
          '模組層級變數被所有元件實例共享（全域）；useRef 的值屬於每個元件實例私有。多個同元件實例時，模組層級變數會互相干擾',
          '模組層級變數的效能比 useRef 好',
          'useRef 比模組層級變數更容易被 GC 回收',
        ],
        answer: 1,
        explanation: '核心差別是「範圍」：模組層級變數是全域的，該模組中所有元件實例共享同一個值，互相干擾。useRef 的值屬於每個元件實例私有，每個元件實例有自己的 ref。例如：計時器 ID 若用模組變數，多個元件實例只有一個 timer ID，清除時只清除最後一個；用 useRef 每個實例有自己的 timer ID，各自獨立。',
      },
      {
        order: 5,
        question: '以下哪個情境最適合使用 useRef 而非 useState？',
        options: [
          '顯示一個計數器的當前值在畫面上',
          '追蹤 input 是否已被 focus 過，用來決定是否顯示錯誤訊息（此值不需要直接顯示在 UI）',
          '管理一個下拉選單的開啟/關閉狀態',
          '儲存從 API 取得的使用者列表',
        ],
        answer: 1,
        explanation: '「追蹤 input 是否已被 focus 過」這個值不需要顯示在 UI，只是用來判斷邏輯，最適合 useRef（hasFocused.current）。改變時不需要 re-render。其他選項都需要顯示在 UI 或觸發 re-render：計數器需要顯示 → useState；下拉開關需要顯示 → useState；API 資料需要顯示 → useState。',
      },
    ],
  },

  {
    slug: 'react-performance',
    title: '效能優化（memo / useMemo / useCallback）',
    description: '學習 React.memo、useMemo、useCallback 的正確使用場景，以及過度優化的問題。',
    difficulty: 'medium',
    subCategory: 'Performance Optimization',
    questions: [
      {
        order: 1,
        question: 'React.memo 的作用是什麼？',
        options: [
          '讓元件的 state 被快取，不會因重新渲染而重置',
          '對函式元件進行 props 淺比較，若 props 沒有改變則跳過重新渲染（memorize 渲染結果）',
          '讓元件的所有計算都被快取',
          '等同於 useMemo，只是語法不同',
        ],
        answer: 1,
        explanation: 'React.memo 是一個高階元件（HOC），包裹函式元件後，在父元件 re-render 時會對新舊 props 做淺比較（Shallow Comparison），若所有 props 相同（Object.is），則跳過重新渲染，復用上一次的渲染結果。注意：若 props 包含物件或函式，每次父元件渲染都會建立新引用，memo 無效。此時需要搭配 useMemo 和 useCallback。',
      },
      {
        order: 2,
        question: 'useMemo 和 useCallback 最主要的差別是什麼？',
        options: [
          'useMemo 用於函式元件，useCallback 用於 class 元件',
          'useMemo 快取計算「值」（回傳值的結果）；useCallback 快取「函式本身」（回傳函式的引用）',
          'useMemo 的效能比 useCallback 好',
          'useMemo 只能快取數字，useCallback 可以快取任何值',
        ],
        answer: 1,
        explanation: 'useMemo(() => compute(), [deps]) 執行函式並快取「回傳的值」，當依賴沒有改變時，跳過重新計算直接回傳快取的值。useCallback(fn, [deps]) 快取「函式本身的引用」，當依賴沒有改變時，回傳同一個函式引用（不重新建立函式物件）。useCallback(fn, deps) 等同於 useMemo(() => fn, deps)。',
      },
      {
        order: 3,
        question: '把所有變數都用 useMemo 包起來是否推薦？為什麼？',
        options: [
          '推薦，useMemo 永遠讓程式更快',
          '不推薦。useMemo 本身有額外的記憶體和計算成本，只有當計算「確實昂貴」且「依賴不頻繁改變」時才值得使用。過度使用反而讓程式更慢且難以維護',
          '推薦，這樣可以完全避免不必要的重新計算',
          '只有在 TypeScript 中才不推薦',
        ],
        answer: 1,
        explanation: 'useMemo 的成本：1) 記憶體：需要存放快取的值和依賴陣列；2) 計算：每次渲染都要比較依賴陣列；3) 程式複雜度增加。若被快取的計算本身很輕量（如 arr.filter），useMemo 的成本可能比省下的計算還高。React 官方建議：先不優化，遇到效能問題時用 React DevTools Profiler 找瓶頸，再針對性地加 useMemo。',
      },
      {
        order: 4,
        question: '以下哪個是 useCallback 最適合的使用場景？',
        options: [
          '快取一個複雜的排序演算法的結果',
          '把函式傳給用 React.memo 包裹的子元件，避免因函式引用每次改變導致子元件不必要地重新渲染',
          '替代所有普通的函式宣告',
          '讓函式可以在 useEffect 的 dependency array 中使用',
        ],
        answer: 1,
        explanation: 'useCallback 最有價值的場景：把函式傳給以 React.memo 包裹的子元件。若不用 useCallback，父元件每次渲染都建立新的函式引用，即使子元件用了 memo 也會重新渲染（因為函式 prop 是新引用）。用 useCallback 確保函式引用穩定，讓 memo 真正生效。另一個常見場景：函式被放入 useEffect 的 dependency array 時，用 useCallback 避免無限迴圈。',
      },
      {
        order: 5,
        question: '以下程式碼中，Child 元件是否會因為 Parent re-render 而不必要地重新渲染？\n\nconst Child = React.memo(({ onClick }) => <button onClick={onClick}>Click</button>)\nfunction Parent() {\n  const handleClick = () => console.log("clicked")\n  return <Child onClick={handleClick} />\n}',
        options: [
          '不會，React.memo 會阻止所有 re-render',
          '會，因為 handleClick 在每次 Parent 渲染時都是新的函式引用，React.memo 的淺比較發現不同，所以重新渲染',
          '不會，函式引用的比較在 React.memo 中被忽略',
          '視瀏覽器而定',
        ],
        answer: 1,
        explanation: '這是 React.memo 的常見陷阱。handleClick 在 Parent 每次渲染時都是全新的函式物件（新引用），React.memo 的淺比較發現 onClick prop 改變（新引用 !== 舊引用），因此 Child 仍然重新渲染，memo 失效。解法：用 useCallback 包裹 handleClick：const handleClick = useCallback(() => console.log("clicked"), [])，確保函式引用穩定。',
      },
    ],
  },

  {
    slug: 'react-state-management',
    title: '狀態管理與資料流',
    description: '理解狀態提升、prop drilling 問題、Context vs Redux 的選擇，以及 useReducer 的適用場景。',
    difficulty: 'medium',
    subCategory: 'State Management',
    questions: [
      {
        order: 1,
        question: '下層元件的 state 需要讓上層元件使用，應該怎麼做？',
        options: [
          '使用 useRef 在下層元件和上層元件之間共享值',
          '將 state 提升（Lift State Up）到共同的最近父元件，再透過 props 傳遞給需要的子元件',
          '直接修改父元件的 state（從子元件存取父元件的 state）',
          '把 state 放到瀏覽器的 localStorage 讓所有元件存取',
        ],
        answer: 1,
        explanation: 'State Lifting（狀態提升）是 React 的核心模式：當多個元件需要共享 state 時，將 state 移到它們共同的最近父元件，父元件透過 props 把 state 和 setter 傳給需要的子元件。這維持了單向資料流。若層級很深，可以考慮 useContext 或 Redux 避免 prop drilling。',
      },
      {
        order: 2,
        question: '什麼是 prop drilling？為什麼它是個問題？',
        options: [
          'Props 的型別檢查機制',
          '將 props 從上層元件逐層傳遞到深層元件，中間層的元件只是轉傳而不使用這些 props，導致程式碼難以維護',
          '用來最佳化 props 傳遞效能的技術',
          'React 的一種設計模式，建議在所有情況下使用',
        ],
        answer: 1,
        explanation: 'Prop drilling 發生在需要從高層元件傳遞資料到深層元件時，中間層的元件只負責「轉傳」props，但自己並不使用。問題：1) 中間層元件的 props 介面膨脹，難以閱讀；2) 需要修改資料型別時，所有中間層都要改；3) 難以重構和移動元件。解法：useContext、Redux、Zustand 等狀態管理方案，或元件組合（Component Composition）。',
      },
      {
        order: 3,
        question: 'Context 和 Redux 最主要的差別是什麼？什麼情況下選 Redux？',
        options: [
          'Context 比 Redux 慢，Redux 比 Context 快，所有情況都用 Redux',
          'Context 是 React 內建用於避免 prop drilling 的方案；Redux 是獨立的狀態管理函式庫，提供 middleware（處理非同步）、DevTools（時間旅行除錯）、更精細的效能優化。大型複雜應用選 Redux',
          'Context 只能存放字串，Redux 可以存放任何資料',
          'Redux 只能在 class 元件中使用',
        ],
        answer: 1,
        explanation: 'Context 適合：主題切換、使用者資訊、語系設定等「不頻繁更新的全域資料」。Context 的效能問題：所有消費該 Context 的元件，只要 Context value 改變都會 re-render。Redux 適合：大型應用、需要 middleware（redux-thunk、redux-saga 處理複雜非同步邏輯）、需要 DevTools（時間旅行、action 記錄）、需要精細效能控制（useSelector 只訂閱需要的 state）的場景。',
      },
      {
        order: 4,
        question: 'useReducer 最適合用在哪種場景？',
        options: [
          '任何用到 useState 的地方都應換成 useReducer',
          '當 state 邏輯複雜（多個子值、下一個 state 依賴多個條件）或有多個相關聯的 state 時，useReducer 讓更新邏輯集中在 reducer 函式中，更容易測試和維護',
          '只有在需要 Redux 但不想安裝第三方套件時才使用',
          'useReducer 只能管理數字型別的 state',
        ],
        answer: 1,
        explanation: 'useReducer 的優勢：1) 把所有 state 更新邏輯集中在 reducer 函式，組件本身只負責「發出 action」，邏輯更清晰；2) reducer 是純函式，容易獨立測試；3) 適合 state 有多個子值且更新規則複雜的場景（如表單狀態、購物車、多步驟流程）。useReducer + Context 可以模擬輕量的 Redux 架構。',
      },
      {
        order: 5,
        question: '使用 Context 時，哪個做法可以有效避免不必要的 re-render？',
        options: [
          '把所有 state 放在一個大的 Context 中',
          '將 Context 的值拆分：把「頻繁更新的 state」和「不常更新的 state」分成不同的 Context，讓元件只訂閱需要的 Context',
          '使用 useContext 替代所有的 props',
          '把 Context Provider 放到 document.body 層級',
        ],
        answer: 1,
        explanation: 'Context 的效能問題：任何訂閱該 Context 的元件，只要 Provider 的 value 改變就會重新渲染。拆分 Context 是一個有效的優化：把更新頻率不同的資料分成多個 Context（如 UserContext、ThemeContext、NotificationContext），元件只訂閱需要的，其他 Context 更新時不受影響。也可以搭配 useMemo 快取 Context value，或使用 Context + useReducer 模式。',
      },
    ],
  },

  {
    slug: 'react-patterns',
    title: 'React 開發模式與最佳實踐',
    description: '了解 Controlled 和 Uncontrolled Component 的差異、useReducer 應用、React 18 新特性，以及寫出好維護 React code 的原則。',
    difficulty: 'medium',
    subCategory: 'Patterns',
    questions: [
      {
        order: 1,
        question: 'Controlled Component 和 Uncontrolled Component 的差別是什麼？',
        options: [
          'Controlled 只能用在 class 元件；Uncontrolled 只能用在函式元件',
          'Controlled：表單元素的值由 React state 控制（onChange + value）；Uncontrolled：表單元素的值由 DOM 自己管理，用 ref 讀取值',
          'Controlled 效能比 Uncontrolled 好，應優先使用',
          'Controlled 和 Uncontrolled 功能完全相同，只是寫法不同',
        ],
        answer: 1,
        explanation: 'Controlled Component：input 的 value 屬性由 React state 控制，每次輸入都觸發 onChange 更新 state，React 是「唯一的資料來源（single source of truth）」。可以輕鬆做驗證、格式化、條件禁用。Uncontrolled Component：DOM 自己管理值，需要時用 useRef + ref.current.value 讀取。優點是程式碼簡潔，缺點是無法即時驗證。React 官方推薦 Controlled Component。',
      },
      {
        order: 2,
        question: 'React 18 相較於 React 17，最主要引入了哪些新特性？',
        options: [
          '加入了 class 元件支援，之前只有函式元件',
          'Automatic Batching（所有情況自動批次更新）、Concurrent Features（並發模式，如 useTransition、useDeferredValue）、Suspense for Data Fetching 改進、createRoot API',
          '移除了所有 class 元件的 API',
          '只有修復了若干 bug，沒有新特性',
        ],
        answer: 1,
        explanation: 'React 18 的主要新特性：1) Automatic Batching：所有情況（setTimeout、Promise、原生事件）都自動批次 state 更新；2) Concurrent Features：useTransition（標記非緊急更新，保持 UI 響應）、useDeferredValue（延遲更新）；3) Suspense 改進：支援 SSR Streaming；4) createRoot API 取代 ReactDOM.render；5) useId、useSyncExternalStore、useInsertionEffect 等新 Hooks。',
      },
      {
        order: 3,
        question: '以下哪個做法符合好的 React code 原則？',
        options: [
          '把所有 state 放在最頂層元件，用 props 傳遞所有資料',
          '元件單一職責（每個元件只做一件事）、state 盡量靠近使用它的元件（State Co-location）、避免過早優化、使用自訂 Hook 抽取可複用邏輯',
          '把所有邏輯都放在一個大的元件中，避免過多元件切割',
          '避免使用 TypeScript，讓程式碼更簡潔',
        ],
        answer: 1,
        explanation: '好的 React code 原則：1) 單一職責：每個元件只做一件事，方便測試和複用；2) State Co-location：state 放在最靠近使用它的元件，只有需要共享時才提升；3) 避免過早優化：先讓程式正確，再用 Profiler 找瓶頸；4) 自訂 Hook：抽取可複用的有狀態邏輯；5) 組合優於繼承；6) 保持元件的 props 介面簡潔；7) 使用 TypeScript 增加型別安全。',
      },
      {
        order: 4,
        question: '在 Controlled Component 中，input 的值如何管理？',
        options: [
          '直接操作 DOM：document.getElementById("input").value = newValue',
          '用 React state 管理：設定 value={state} 和 onChange={(e) => setState(e.target.value)}，React 完全控制 input 的值',
          '用 useRef 在 onChange 中更新值：ref.current.value = e.target.value',
          '不需要任何處理，React 自動同步 input 和 state',
        ],
        answer: 1,
        explanation: 'Controlled Component 的標準寫法：<input value={name} onChange={(e) => setName(e.target.value)} />。value 屬性使 input 的顯示值始終等於 state；每次按鍵都觸發 onChange 更新 state；React re-render 後 input 顯示新的 state 值。這形成「React → DOM → React」的迴圈，React 是唯一的資料來源。若只設 value 不設 onChange，input 會變成唯讀（React 警告）。',
      },
      {
        order: 5,
        question: '什麼是 React Concurrent Mode（並發模式）的核心概念？',
        options: [
          '讓 React 可以同時運行多個 React 應用',
          'React 可以中斷、暫停、繼續渲染工作，優先處理緊急更新（如使用者輸入），延遲低優先的更新（如背景資料載入），讓 UI 保持響應',
          '讓 React 在多個 CPU 核心上平行計算',
          'Concurrent Mode 讓 React 不再需要 Virtual DOM',
        ],
        answer: 1,
        explanation: 'Concurrent Mode 是 React Fiber 帶來的核心能力：React 可以把渲染工作切分，讓高優先的更新（使用者點擊、輸入）中斷低優先的更新（背景資料渲染）。API 層面：useTransition 讓你標記某個 state 更新為「非緊急」，React 會先處理緊急更新讓 UI 保持響應；useDeferredValue 讓某個值的更新延遲，避免阻塞重要的渲染。',
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

  console.log('\n✅ React 主題建立完成')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
