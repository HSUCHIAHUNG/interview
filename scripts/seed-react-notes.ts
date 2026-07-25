import { config } from 'dotenv'
config({ path: '.env.local' })
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../lib/db/schema'
import { eq } from 'drizzle-orm'

const client = neon(process.env.DATABASE_URL!)
const db = drizzle(client, { schema })

const notes: { slug: string; sections: { heading: string; content: string }[] }[] = [
  {
    slug: 'react-fundamentals',
    sections: [
      {
        heading: 'Virtual DOM 與 Reconciliation',
        content: `Virtual DOM 是 React 在記憶體中維護的 JavaScript 物件樹，用來描述 UI 的結構。每次 state 或 props 改變，React 先更新 Virtual DOM，再與前一次的快照做 diff，最後只把真正有差異的部分更新到真實 DOM。

**為什麼需要 Virtual DOM？**
- 直接操作 DOM 昂貴（layout、reflow、repaint）
- 批次計算最小化操作，減少不必要的 DOM 讀寫
- 讓程式碼保持聲明式（描述「要什麼」，而非「怎麼做」）

**Reconciliation（diffing 演算法）**

React 的 diff 遵循兩個假設來達到 O(n) 效能：
1. 不同類型的元素會產生不同的樹（直接替換，不嘗試複用）
2. \`key\` prop 讓開發者標記哪些子元素在不同渲染間是「同一個」

\`\`\`jsx
// key 幫助 React 識別列表元素，避免整列重建
const items = ['Apple', 'Banana', 'Cherry']
return (
  <ul>
    {items.map((item) => (
      <li key={item}>{item}</li>  // key 讓 diff 只更新真正改變的項目
    ))}
  </ul>
)
\`\`\`

**同層比較規則：**
- 同層不同類型（\`<div>\` → \`<span>\`）：銷毀整棵子樹，重新建立
- 同類型元素：比較 attributes，只更新有變化的屬性
- 列表：用 \`key\` 識別身份，決定是移動、更新或銷毀`,
      },
      {
        heading: 'React Fiber 架構',
        content: `React 16 完整重寫了協調引擎，從舊的 **Stack Reconciler** 改為 **Fiber Reconciler**。

**為什麼需要 Fiber？**

舊的 Stack Reconciler 以遞迴方式同步處理整棵元件樹，一旦開始就無法中斷。當應用龐大時，JS 執行佔用主執行緒過久，導致：
- 動畫掉幀（Frame drop）
- 用戶輸入無回應
- 整體體感卡頓

**Fiber 的核心概念**

每個元件對應一個 **Fiber 節點**（工作單元），整棵樹形成 Fiber Tree。React 將渲染拆成兩個階段：

| 階段 | 說明 | 可中斷？ |
|------|------|----------|
| Render Phase | 計算 diff，找出哪些需要更新 | ✅ 可中斷、恢復、丟棄 |
| Commit Phase | 將變更真正寫入 DOM | ❌ 同步，不可中斷 |

**優先級排程**

Fiber 引入優先級（Priority）概念：
- 高優先級（用戶輸入、動畫）可以插隊
- 低優先級（資料更新、背景渲染）可以延後

\`\`\`js
// React 18 的 useTransition 正是利用 Fiber 優先級
const [isPending, startTransition] = useTransition()

startTransition(() => {
  // 標記為低優先級更新，不阻塞用戶輸入
  setSearchResults(filterData(input))
})
\`\`\`

**Concurrent Mode 的基礎**

Fiber 是 Concurrent Features（並行特性）的基礎，讓 React 能夠在渲染過程中響應更高優先級的工作。`,
      },
      {
        heading: 'React 核心設計原則',
        content: `**1. 聲明式（Declarative）**

不需要手動操作 DOM，只需描述「UI 在某個狀態下應該長什麼樣」，React 負責把 UI 更新到那個狀態。

\`\`\`jsx
// 命令式（jQuery 思維）：告訴電腦「怎麼做」
$('#counter').text(count + 1)
$('#btn').addClass('active')

// 聲明式（React 思維）：描述「要什麼樣子」
return <div>{count}</div>  // React 自動處理 DOM 更新
\`\`\`

**2. 組件化（Component-Based）**

UI 由獨立、可複用的組件組成，每個組件管理自己的 state，組合成複雜 UI。

**3. 單向資料流（One-way Data Flow）**

資料從父元件流向子元件（透過 props），子元件無法直接修改父元件的 state，只能透過回呼函式通知父元件。

\`\`\`jsx
// 父元件控制資料，子元件只能「請求」變更
function Parent() {
  const [count, setCount] = useState(0)
  return <Child count={count} onIncrement={() => setCount(c => c + 1)} />
}

function Child({ count, onIncrement }) {
  return <button onClick={onIncrement}>{count}</button>
}
\`\`\`

**4. JSX 的本質**

JSX 只是語法糖，編譯後變成 \`React.createElement\` 呼叫：

\`\`\`jsx
// JSX
const element = <h1 className="title">Hello</h1>

// 編譯後（React 17+ 使用新的 JSX Transform，不需要 import React）
const element = React.createElement('h1', { className: 'title' }, 'Hello')
// 回傳：{ type: 'h1', props: { className: 'title', children: 'Hello' } }
\`\`\``,
      },
    ],
  },
  {
    slug: 'react-lifecycle',
    sections: [
      {
        heading: '函式元件的生命週期（useEffect 對應）',
        content: `函式元件沒有生命週期方法，但 \`useEffect\` 可以模擬所有主要生命週期行為。

**掛載（Mount）→ componentDidMount**
\`\`\`jsx
useEffect(() => {
  // 只在元件掛載後執行一次
  console.log('元件已掛載')
  fetchData()
}, [])  // 空陣列 = 只執行一次
\`\`\`

**卸載（Unmount）→ componentWillUnmount**
\`\`\`jsx
useEffect(() => {
  const timer = setInterval(() => tick(), 1000)

  return () => {
    // cleanup function：元件卸載時執行
    clearInterval(timer)
    console.log('元件已卸載，清理計時器')
  }
}, [])
\`\`\`

**更新（Update）→ componentDidUpdate**
\`\`\`jsx
useEffect(() => {
  // userId 改變時重新執行
  fetchUserData(userId)
}, [userId])  // 依賴陣列中的值改變時執行
\`\`\`

**完整對應表**

| Class 生命週期 | useEffect 寫法 |
|--------------|--------------|
| \`componentDidMount\` | \`useEffect(() => {}, [])\` |
| \`componentWillUnmount\` | \`useEffect(() => { return cleanup }, [])\` |
| \`componentDidUpdate(prevProps, prevState)\` | \`useEffect(() => {}, [deps])\` |
| 每次渲染後 | \`useEffect(() => {})\`（無第二個參數）|`,
      },
      {
        heading: 'Class 元件生命週期方法',
        content: `**掛載階段（Mounting）**

\`\`\`jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props)
    // 初始化 state、綁定 this
    this.state = { count: 0 }
  }

  static getDerivedStateFromProps(props, state) {
    // 靜態方法，根據 props 計算 state（少用）
    // 回傳 null 表示不更新 state
    return null
  }

  render() {
    // 唯一必須實作的方法，必須是純函式
    return <div>{this.state.count}</div>
  }

  componentDidMount() {
    // DOM 已掛載，可以發 API、操作 DOM、訂閱事件
    fetchData().then(data => this.setState({ data }))
  }
}
\`\`\`

**更新階段（Updating）**

\`\`\`jsx
shouldComponentUpdate(nextProps, nextState) {
  // 回傳 false 可跳過渲染（PureComponent 自動做淺比較）
  return nextProps.id !== this.props.id
}

getSnapshotBeforeUpdate(prevProps, prevState) {
  // DOM 更新前捕捉資訊（如捲軸位置），回傳值傳給 componentDidUpdate
  return this.listRef.scrollHeight
}

componentDidUpdate(prevProps, prevState, snapshot) {
  // 更新後執行，snapshot 來自 getSnapshotBeforeUpdate
  if (prevProps.userId !== this.props.userId) {
    fetchUser(this.props.userId)
  }
}
\`\`\`

**卸載階段（Unmounting）**

\`\`\`jsx
componentWillUnmount() {
  // 清理：取消訂閱、清除 timer、取消 API 請求
  this.subscription.unsubscribe()
  clearTimeout(this.timer)
}
\`\`\`

**⚠️ 已標為 UNSAFE_ 的方法（不建議使用）**
- \`UNSAFE_componentWillMount\`（原 \`componentWillMount\`）
- \`UNSAFE_componentWillReceiveProps\`（原 \`componentWillReceiveProps\`）
- \`UNSAFE_componentWillUpdate\`（原 \`componentWillUpdate\`）

這些方法在 Concurrent Mode 下可能被多次呼叫，容易造成 bug。`,
      },
      {
        heading: 'PureComponent 與 shouldComponentUpdate',
        content: `**PureComponent 的淺比較機制**

\`React.PureComponent\` 自動實作 \`shouldComponentUpdate\`，對 props 和 state 做**淺比較（shallow comparison）**：

\`\`\`jsx
// 普通 Component：每次父元件 re-render 都會重新渲染
class Normal extends React.Component {
  render() { return <div>{this.props.name}</div> }
}

// PureComponent：props 淺比較相等則跳過渲染
class Pure extends React.PureComponent {
  render() { return <div>{this.props.name}</div> }
}
\`\`\`

**淺比較的限制：物件和陣列**

\`\`\`jsx
// ❌ PureComponent 無法正確優化這種情況
class Parent extends React.Component {
  render() {
    // 每次渲染都建立新陣列，淺比較認為 props 改變了
    return <Pure items={[1, 2, 3]} />
  }
}

// ✅ 把陣列提到 state 或 useMemo
class Parent extends React.Component {
  state = { items: [1, 2, 3] }
  render() {
    return <Pure items={this.state.items} />  // 引用不變，淺比較通過
  }
}
\`\`\`

**函式元件的對應：React.memo**

\`\`\`jsx
// React.memo 對函式元件做同樣的淺比較
const MyComponent = React.memo(function MyComponent({ name, count }) {
  return <div>{name}: {count}</div>
})

// 也可以傳入自訂比較函式
const MyComponent = React.memo(MyComp, (prevProps, nextProps) => {
  // 回傳 true 表示 props 相同（跳過渲染）
  return prevProps.id === nextProps.id
})
\`\`\``,
      },
    ],
  },
  {
    slug: 'react-rerender',
    sections: [
      {
        heading: '造成 React Re-render 的情況',
        content: `**觸發 Re-render 的 4 種情況**

**1. State 改變**
\`\`\`jsx
const [count, setCount] = useState(0)
// 呼叫 setCount 觸發 re-render
<button onClick={() => setCount(c => c + 1)}>+</button>
\`\`\`

**2. Props 改變**
\`\`\`jsx
// 父元件傳入新的 props 值，子元件 re-render
function Child({ name }) {
  console.log('Child re-render')
  return <div>{name}</div>
}
\`\`\`

**3. 父元件 Re-render**
\`\`\`jsx
// ⚠️ 最常被忽略！父元件 re-render 時，所有子元件預設都會 re-render
// 即使子元件的 props 沒有改變
function Parent() {
  const [count, setCount] = useState(0)
  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <Child name="Alice" />  {/* Parent re-render 時這裡也會 re-render */}
    </>
  )
}
\`\`\`

**4. useContext 的 value 改變**
\`\`\`jsx
const ThemeContext = createContext('light')
// Context value 改變時，所有使用 useContext(ThemeContext) 的元件都 re-render
function ThemedButton() {
  const theme = useContext(ThemeContext)  // theme 改變 → re-render
  return <button className={theme}>Click</button>
}
\`\`\`

**不會觸發 Re-render 的情況**

\`\`\`jsx
const ref = useRef(0)
// ✅ 改變 ref.current 不觸發 re-render
ref.current += 1
console.log(ref.current)  // 值改變了，但 UI 不更新
\`\`\``,
      },
      {
        heading: 'React key 的作用與最佳實踐',
        content: `**key 讓 React 識別元素身份（Identity）**

key 告訴 React「這個元素是誰」，讓 diff 演算法能夠判斷元素是移動了、更新了，還是被銷毀和新建了。

\`\`\`jsx
// ✅ 使用穩定唯一 ID 作為 key
const items = [
  { id: 'a1', name: 'Apple' },
  { id: 'b2', name: 'Banana' },
]
return items.map(item => <li key={item.id}>{item.name}</li>)
\`\`\`

**key 改變 = 元件銷毀重建**

\`\`\`jsx
// key 改變時，React 會完全銷毀舊元件，建立新元件（包含重置 state）
<input key={userId} defaultValue="" />
// userId 改變 → input 重建 → defaultValue 重置 ✅
\`\`\`

**index 作為 key 的問題**

\`\`\`jsx
// ❌ 用 index 作為 key：排序或插入時 state 錯位
const [items, setItems] = useState(['Apple', 'Banana', 'Cherry'])

// 在開頭插入 'Grape'
setItems(['Grape', 'Apple', 'Banana', 'Cherry'])
// index 0 的 key 還是 0，React 認為是「更新」而非「插入新元素」
// 若子元件有內部 state，會錯誤保留在新位置

// ✅ 使用穩定 ID
const [items, setItems] = useState([
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
])
\`\`\`

**什麼時候 index 作為 key 可以接受？**
- 列表是靜態的，不會重新排序
- 列表不會被過濾
- 列表項目沒有內部 state

**強制重置元件的技巧**

\`\`\`jsx
// 想讓元件「重新初始化」，改變 key 即可
<ProfileEditor key={selectedUserId} userId={selectedUserId} />
// selectedUserId 改變 → 整個 ProfileEditor 重建 → 所有 state 重置
\`\`\``,
      },
      {
        heading: 'Batch Update 與 React 18',
        content: `**Batching（批次更新）**

React 會把同一個事件處理器中的多個 setState 合併成一次 re-render，提高效能。

**React 17：只在合成事件中 batch**

\`\`\`jsx
// React 17：事件處理器中的多個 setState 被 batch → 只 re-render 一次
function handleClick() {
  setCount(c => c + 1)  // 不立即 re-render
  setFlag(f => !f)       // 不立即 re-render
  // 函式結束後才 re-render 一次
}

// ❌ React 17：Promise 和 setTimeout 中不 batch → re-render 兩次
setTimeout(() => {
  setCount(c => c + 1)  // 立即 re-render 一次
  setFlag(f => !f)       // 再 re-render 一次
}, 0)
\`\`\`

**React 18：Automatic Batching（自動批次更新）**

\`\`\`jsx
// ✅ React 18：所有情況都自動 batch
setTimeout(() => {
  setCount(c => c + 1)  // 不立即 re-render
  setFlag(f => !f)       // 不立即 re-render
  // setTimeout 結束後才 re-render 一次
}, 0)

// Promise.then 也 batch
fetch('/api/data').then(() => {
  setData(newData)     // 不立即 re-render
  setLoading(false)    // 不立即 re-render
  // then 結束後才 re-render 一次
})
\`\`\`

**flushSync：強制立即更新（跳出 batch）**

\`\`\`jsx
import { flushSync } from 'react-dom'

function handleClick() {
  flushSync(() => {
    setCount(c => c + 1)  // 立即同步更新 DOM
  })
  // 這裡 DOM 已經更新，可以安全讀取
  console.log(document.getElementById('counter').textContent)

  setFlag(f => !f)  // 正常 batch
}
\`\`\``,
      },
    ],
  },
  {
    slug: 'react-hooks-intro',
    sections: [
      {
        heading: 'React Hooks 的動機',
        content: `React 16.8（2019）引入 Hooks，解決 Class 元件的三個核心問題：

**問題 1：有狀態邏輯難以複用**

之前的解法（HOC 和 render props）會造成 wrapper hell：

\`\`\`jsx
// ❌ HOC 疊加導致巢狀地獄
export default withRouter(
  withTheme(
    withAuth(
      withData(MyComponent)
    )
  )
)
// DevTools 中看到深達 5-6 層的 wrapper

// ✅ 自訂 Hook：邏輯抽取，乾淨複用
function MyComponent() {
  const router = useRouter()
  const theme = useTheme()
  const { user } = useAuth()
  const data = useData()
  return <div>...</div>
}
\`\`\`

**問題 2：複雜元件難以理解**

Class 元件常把不相關的邏輯塞進同一個生命週期方法：

\`\`\`jsx
// ❌ componentDidMount 做了太多不相關的事
componentDidMount() {
  fetchUserData()        // 資料獲取
  initAnalytics()        // 分析初始化
  window.addEventListener('resize', this.handleResize)  // 事件監聽
  startTimer()           // 計時器
}

// ✅ useEffect 讓相關邏輯放在一起
useEffect(() => { fetchUserData() }, [userId])
useEffect(() => { initAnalytics() }, [])
useEffect(() => {
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])
\`\`\`

**問題 3：Class 本身的問題**

\`\`\`jsx
// ❌ this 綁定問題
class MyComponent extends React.Component {
  handleClick = () => {  // 需要用箭頭函式或 bind 解決 this 問題
    console.log(this.state.count)
  }
}

// ✅ 函式元件 + Hooks：沒有 this 問題
function MyComponent() {
  const [count, setCount] = useState(0)
  const handleClick = () => console.log(count)  // 直接捕捉 count
}
\`\`\``,
      },
      {
        heading: 'Rules of Hooks（Hooks 的規則）',
        content: `**規則 1：只在頂層呼叫 Hook**

不能在 \`if\`、\`for\`、巢狀函式中呼叫 Hook。

\`\`\`jsx
// ❌ 違反規則：條件式呼叫
function MyComponent({ isLoggedIn }) {
  if (isLoggedIn) {
    const [user, setUser] = useState(null)  // 錯誤！
  }

  // ❌ 違反規則：迴圈中呼叫
  for (let i = 0; i < 3; i++) {
    useEffect(() => {})  // 錯誤！
  }
}

// ✅ 正確：Hook 永遠在頂層
function MyComponent({ isLoggedIn }) {
  const [user, setUser] = useState(null)  // 永遠呼叫

  useEffect(() => {
    if (isLoggedIn) {  // 條件放在 Hook 內部
      fetchUser()
    }
  }, [isLoggedIn])
}
\`\`\`

**為什麼不能在條件式中呼叫？**

React 靠**呼叫順序**來對應每個 Hook 和它的 state：

\`\`\`
// 第一次渲染（isLoggedIn = true）
useState(null)   → Hook #1: state = null
useEffect(...)   → Hook #2: effect
useState(0)      → Hook #3: state = 0

// 第二次渲染（isLoggedIn = false，跳過第一個 if）
// useState(null) 被跳過！
useEffect(...)   → Hook #1（錯位了！）
useState(0)      → Hook #2（錯位了！）
// React 認為 #1 還是原來的 useState，state 亂掉
\`\`\`

**規則 2：只在 React 函式中呼叫**

- ✅ React 函式元件
- ✅ 自訂 Hook（函式名稱以 \`use\` 開頭）
- ❌ 一般 JavaScript 函式
- ❌ Class 元件

**eslint-plugin-react-hooks**

\`\`\`bash
npm install eslint-plugin-react-hooks --save-dev
\`\`\`

自動檢查兩條規則違反，並警告 \`useEffect\` 依賴陣列遺漏的依賴。`,
      },
      {
        heading: '常用 Hooks 一覽',
        content: `**基礎 Hooks**

| Hook | 用途 |
|------|------|
| \`useState\` | 管理元件內部 state，state 改變觸發 re-render |
| \`useEffect\` | 處理副作用（API 請求、訂閱、DOM 操作）|
| \`useContext\` | 消費 Context 的值，跳過 prop drilling |

**進階 Hooks**

| Hook | 用途 |
|------|------|
| \`useRef\` | 存放 DOM 引用或跨渲染的可變值（不觸發 re-render）|
| \`useMemo\` | 快取計算結果，deps 不變時跳過重算 |
| \`useCallback\` | 快取函式引用，搭配 React.memo 避免無效 re-render |
| \`useReducer\` | 複雜 state 邏輯，類似 Redux 的 dispatch/reducer 模式 |
| \`useLayoutEffect\` | 在 DOM 更新後、瀏覽器繪製前同步執行（適合讀取 layout）|

**React 18 新增 Hooks**

| Hook | 用途 |
|------|------|
| \`useId\` | 生成唯一 ID，用於 SSR/CSR 一致的 accessibility 屬性 |
| \`useTransition\` | 標記 state 更新為低優先級，保持 UI 響應 |
| \`useDeferredValue\` | 延遲特定值的更新，類似 debounce 但由 React 調度 |
| \`useSyncExternalStore\` | 訂閱外部 store（Redux、Zustand 等使用）|
| \`useInsertionEffect\` | CSS-in-JS 函式庫使用，在 DOM 插入前注入樣式 |

**自訂 Hook 範例**

\`\`\`jsx
// 抽取視窗大小邏輯
function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight })

  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return size
}

// 在任何元件中複用
function MyComponent() {
  const { width, height } = useWindowSize()
  return <div>{width} x {height}</div>
}
\`\`\``,
      },
    ],
  },
  {
    slug: 'react-usestate',
    sections: [
      {
        heading: 'useState 基本用法與注意事項',
        content: `**基本語法**

\`\`\`jsx
const [state, setState] = useState(initialValue)
// state：當前值
// setState：更新函式，呼叫後觸發 re-render
// initialValue：初始值（只在第一次渲染使用）
\`\`\`

**setState 是非同步的**

\`\`\`jsx
function Counter() {
  const [count, setCount] = useState(0)

  const handleClick = () => {
    setCount(count + 1)
    console.log(count)  // 仍然是舊值！state 在下次渲染才更新
  }

  // ✅ 想要在 setState 後立即知道新值，直接計算
  const handleClick2 = () => {
    const newCount = count + 1
    setCount(newCount)
    console.log(newCount)  // 正確的新值
  }
}
\`\`\`

**函式式更新：解決 Stale Closure 問題**

\`\`\`jsx
// ❌ 閉包捕捉舊的 count，連續呼叫時結果不如預期
function badExample() {
  setCount(count + 1)  // count 是捕捉到的舊值
  setCount(count + 1)  // 同樣的舊值！最終只加了 1
}

// ✅ 函式式更新：React 傳入最新的 state 值
function goodExample() {
  setCount(prev => prev + 1)  // 最新值 + 1
  setCount(prev => prev + 1)  // 再 + 1，正確地加了 2
}

// 常見場景：在 useEffect 或 setTimeout 中更新 state
useEffect(() => {
  const timer = setInterval(() => {
    setCount(prev => prev + 1)  // ✅ 永遠基於最新值
    // setCount(count + 1)  // ❌ count 被 closure 捕捉，永遠是初始值 0
  }, 1000)
  return () => clearInterval(timer)
}, [])  // 空依賴，但 setCount 的函式式更新仍然正確
\`\`\`

**React 會跳過相同值的更新**

\`\`\`jsx
const [count, setCount] = useState(0)
setCount(0)  // 值沒變（Object.is(0, 0) = true），React 跳過 re-render
\`\`\``,
      },
      {
        heading: 'Lazy Initialization（初始函式）',
        content: `**兩種初始化方式的差別**

\`\`\`jsx
// ❌ 每次渲染都呼叫 expensiveCalculation()，但只有第一次的值被用到
const [value, setValue] = useState(expensiveCalculation())

// ✅ 傳入函式：只在第一次渲染時呼叫
const [value, setValue] = useState(() => expensiveCalculation())
\`\`\`

**適合使用 Lazy Initialization 的場景**

\`\`\`jsx
// 場景 1：耗時計算
const [data, setData] = useState(() => {
  return processLargeDataset(rawData)  // 只計算一次
})

// 場景 2：讀取 localStorage
const [theme, setTheme] = useState(() => {
  try {
    return localStorage.getItem('theme') ?? 'light'
  } catch {
    return 'light'  // SSR 環境沒有 localStorage，需要 try-catch
  }
})

// 場景 3：複雜的初始結構
const [config, setConfig] = useState(() => ({
  items: Array.from({ length: 100 }, (_, i) => ({ id: i, value: i * 2 })),
  metadata: buildMetadata(),
}))
\`\`\`

**驗證效能差異**

\`\`\`jsx
function slow() {
  console.log('slow 被呼叫了')  // 每次 re-render 都印
  return 0
}

function Component() {
  const [a, setA] = useState(slow())    // 每次渲染都呼叫 slow
  const [b, setB] = useState(() => slow())  // 只有第一次呼叫 slow

  return <button onClick={() => setA(a + 1)}>count: {a}</button>
  // 點擊按鈕：a 的版本每次都印 log；b 的版本只印一次
}
\`\`\``,
      },
      {
        heading: '不可變更新（Immutable Update）',
        content: `**為什麼要不可變更新？**

React 用 \`Object.is\` 比較新舊 state，如果直接修改物件/陣列（mutation），引用沒有改變，React 認為 state 沒變，不觸發 re-render。

\`\`\`jsx
const [user, setUser] = useState({ name: 'Alice', age: 25 })

// ❌ 直接 mutation：引用沒變，React 不知道 state 更新了
user.name = 'Bob'
setUser(user)  // Object.is(user, user) = true，跳過 re-render

// ✅ 建立新物件：引用改變，React 偵測到更新
setUser({ ...user, name: 'Bob' })
\`\`\`

**物件更新**

\`\`\`jsx
const [user, setUser] = useState({ name: 'Alice', age: 25, address: { city: 'Taipei' } })

// 更新頂層屬性
setUser(prev => ({ ...prev, name: 'Bob' }))

// 更新巢狀物件（需要展開每一層）
setUser(prev => ({
  ...prev,
  address: { ...prev.address, city: 'Tainan' }
}))
\`\`\`

**陣列更新**

\`\`\`jsx
const [items, setItems] = useState([1, 2, 3])

// 新增元素
setItems(prev => [...prev, 4])
setItems(prev => [0, ...prev])  // 開頭新增

// 刪除元素
setItems(prev => prev.filter(item => item !== 2))

// 更新特定元素
setItems(prev => prev.map(item => item === 2 ? 20 : item))

// Array of objects 更新
const [todos, setTodos] = useState([
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Read book', done: false },
])

// 標記 id=1 為完成
setTodos(prev =>
  prev.map(todo =>
    todo.id === 1 ? { ...todo, done: true } : todo
  )
)
\`\`\`

**複雜巢狀 state 的建議**

考慮使用 \`useReducer\` 或 [Immer](https://immerjs.github.io/immer/) 來簡化不可變更新：

\`\`\`jsx
import { useImmer } from 'use-immer'

const [user, updateUser] = useImmer({ name: 'Alice', address: { city: 'Taipei' } })

// 可以直接 mutation（Immer 在背後建立新物件）
updateUser(draft => {
  draft.address.city = 'Tainan'
})
\`\`\``,
      },
    ],
  },
  {
    slug: 'react-useeffect',
    sections: [
      {
        heading: 'useEffect 的 dependency array',
        content: `**三種寫法的執行時機**

\`\`\`jsx
// 1. 無依賴陣列：每次渲染後都執行
useEffect(() => {
  console.log('每次渲染後執行')
})

// 2. 空陣列：只在掛載時執行一次
useEffect(() => {
  console.log('只執行一次（相當於 componentDidMount）')
}, [])

// 3. 有依賴：deps 中任何一個值改變時執行
useEffect(() => {
  console.log(\`userId 改變了：\${userId}\`)
  fetchUser(userId)
}, [userId])  // 只有 userId 改變時才重新執行
\`\`\`

**React 如何比較依賴？**

React 用 \`Object.is\` 比較每個依賴，等效於 \`===\`（但正確處理 NaN 和 +0/-0）。

\`\`\`jsx
// ❌ 物件和函式每次 re-render 都是新引用，導致 effect 無限執行
function MyComponent({ userId }) {
  const options = { id: userId }  // 每次渲染建立新物件

  useEffect(() => {
    fetchUser(options)
  }, [options])  // Object.is(newOptions, oldOptions) = false → 每次都執行
}

// ✅ 解法 1：把物件拆成基本型別
useEffect(() => {
  fetchUser({ id: userId })
}, [userId])  // 基本型別的比較正確

// ✅ 解法 2：用 useMemo 穩定物件引用
const options = useMemo(() => ({ id: userId }), [userId])
useEffect(() => {
  fetchUser(options)
}, [options])
\`\`\`

**常見錯誤：遺漏依賴**

\`\`\`jsx
// ❌ ESLint 會警告：count 應該要在依賴陣列中
useEffect(() => {
  const timer = setInterval(() => {
    console.log(count)  // 捕捉到初始的 count，永遠印 0
  }, 1000)
  return () => clearInterval(timer)
}, [])  // count 被遺漏

// ✅ 使用函式式更新，就不需要依賴 count
useEffect(() => {
  const timer = setInterval(() => {
    setCount(prev => prev + 1)  // 不需要讀取 count
  }, 1000)
  return () => clearInterval(timer)
}, [])
\`\`\``,
      },
      {
        heading: 'Cleanup Function 清理機制',
        content: `**Cleanup Function 的執行時機**

1. 元件**卸載（unmount）**時
2. **下一次 effect 執行前**（deps 改變，re-run 前先清理上一次的 effect）

\`\`\`jsx
useEffect(() => {
  console.log('effect 執行')

  return () => {
    console.log('cleanup 執行')  // 下次 effect 前或卸載時
  }
}, [deps])

// 執行順序範例（deps 改變兩次）：
// 掛載：effect 執行
// deps 改變：cleanup 執行 → effect 執行
// 再改變：cleanup 執行 → effect 執行
// 卸載：cleanup 執行
\`\`\`

**常見需要 Cleanup 的場景**

**1. 計時器**
\`\`\`jsx
useEffect(() => {
  const timer = setTimeout(() => setVisible(false), 3000)
  return () => clearTimeout(timer)
}, [])
\`\`\`

**2. 事件監聽**
\`\`\`jsx
useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose()
  }
  document.addEventListener('keydown', handleKeyDown)
  return () => document.removeEventListener('keydown', handleKeyDown)
}, [onClose])
\`\`\`

**3. 訂閱（WebSocket、EventEmitter）**
\`\`\`jsx
useEffect(() => {
  const subscription = store.subscribe(userId, handleUpdate)
  return () => subscription.unsubscribe()
}, [userId])
\`\`\`

**4. AbortController（取消 fetch）**
\`\`\`jsx
useEffect(() => {
  const controller = new AbortController()

  fetch(\`/api/user/\${userId}\`, { signal: controller.signal })
    .then(res => res.json())
    .then(data => setUser(data))
    .catch(err => {
      if (err.name !== 'AbortError') {
        setError(err)
      }
    })

  return () => controller.abort()  // 元件卸載或 userId 改變時取消請求
}, [userId])
\`\`\`

**為什麼 React 18 Strict Mode 在開發環境 effect 執行兩次？**

React 18 Strict Mode 刻意模擬「掛載 → 卸載 → 重新掛載」，確保你的 cleanup 正確實作。如果 effect 執行兩次會造成問題，代表 cleanup 不完整。`,
      },
      {
        heading: 'useLayoutEffect vs useEffect',
        content: `**執行時機差異**

\`\`\`
瀏覽器繪製流程：
React render → 更新 DOM → useLayoutEffect → 瀏覽器 Paint → useEffect
\`\`\`

| | useEffect | useLayoutEffect |
|--|-----------|-----------------|
| 執行時機 | 瀏覽器 paint **後** | 瀏覽器 paint **前** |
| 是否阻塞 paint | 否 | 是 |
| 適合場景 | 大多數副作用 | 需要讀取 DOM 並立即修改 |
| SSR | 正常（有警告） | ⚠️ 不支援（會警告）|

**useLayoutEffect 的適用場景**

\`\`\`jsx
// 場景：讀取 DOM 尺寸並根據結果修改樣式
// 如果用 useEffect，用戶會先看到初始位置，然後閃一下跳到正確位置

function Tooltip({ targetRef, children }) {
  const tooltipRef = useRef(null)

  useLayoutEffect(() => {
    const targetRect = targetRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()

    // 計算 tooltip 應該出現在哪裡，避免超出視窗
    const top = targetRect.bottom + window.scrollY
    const left = Math.min(
      targetRect.left,
      window.innerWidth - tooltipRect.width
    )

    tooltipRef.current.style.top = \`\${top}px\`
    tooltipRef.current.style.left = \`\${left}px\`
    // 用 useLayoutEffect：在 paint 前完成，用戶不會看到閃爍
  })

  return <div ref={tooltipRef} className="tooltip">{children}</div>
}
\`\`\`

**原則：優先使用 useEffect**

大多數情況下，\`useEffect\` 的非同步特性是優點（不阻塞 paint，用戶更快看到 UI）。只有在需要「讀取 DOM → 立即修改防止閃爍」的場景才使用 \`useLayoutEffect\`。`,
      },
    ],
  },
  {
    slug: 'react-useref',
    sections: [
      {
        heading: 'useRef 的兩種用途',
        content: `\`useRef\` 回傳一個 \`{ current: initialValue }\` 物件，該物件在整個元件生命週期中保持同一個引用。

**用途 1：存放 DOM 元素引用**

\`\`\`jsx
function TextInput() {
  const inputRef = useRef(null)

  const focusInput = () => {
    inputRef.current.focus()  // 直接操作 DOM 元素
  }

  const scrollToTop = () => {
    inputRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  const getHeight = () => {
    console.log(inputRef.current.getBoundingClientRect().height)
  }

  return (
    <>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>聚焦</button>
    </>
  )
}
\`\`\`

**用途 2：存放跨渲染的可變值（不觸發 re-render）**

\`\`\`jsx
function Timer() {
  const [seconds, setSeconds] = useState(0)
  const timerIdRef = useRef(null)  // 存放 timer ID

  const start = () => {
    timerIdRef.current = setInterval(() => {
      setSeconds(s => s + 1)
    }, 1000)
  }

  const stop = () => {
    clearInterval(timerIdRef.current)  // 在任何時候都能取到正確的 timer ID
  }

  return (
    <>
      <div>{seconds}s</div>
      <button onClick={start}>開始</button>
      <button onClick={stop}>停止</button>
    </>
  )
}
\`\`\`

**其他常見用途：記錄前一個值**

\`\`\`jsx
function usePrevious(value) {
  const prevRef = useRef(undefined)

  useEffect(() => {
    prevRef.current = value  // 每次渲染後更新 ref
  })

  return prevRef.current  // 回傳本次渲染前的值
}

function MyComponent({ count }) {
  const prevCount = usePrevious(count)
  return <div>現在: {count}，之前: {prevCount}</div>
}
\`\`\``,
      },
      {
        heading: 'useRef vs useState vs 模組外變數',
        content: `**三種方式的比較**

| | useRef | useState | 模組外變數 |
|--|--------|----------|-----------|
| 觸發 re-render | ❌ 不觸發 | ✅ 觸發 | ❌ 不觸發 |
| 元件私有 | ✅ 每個實例獨立 | ✅ 每個實例獨立 | ❌ 所有實例共用 |
| 跨渲染保持 | ✅ 保持 | ✅ 保持 | ✅ 保持 |
| 初始值 | 第一次渲染設定 | 第一次渲染設定 | 模組載入時設定 |

**useRef：元件私有，不觸發 re-render**

\`\`\`jsx
function Counter() {
  const countRef = useRef(0)

  const increment = () => {
    countRef.current += 1
    console.log(countRef.current)  // 值正確更新，但 UI 不刷新
  }

  return <button onClick={increment}>點擊（UI 不更新）</button>
}

// 每個 Counter 實例有自己的 countRef
<Counter />  // 各自獨立的 ref
<Counter />
\`\`\`

**useState：元件私有，觸發 re-render**

\`\`\`jsx
function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
  // count 改變 → re-render → UI 更新
}
\`\`\`

**模組外變數：全域共用，不觸發 re-render**

\`\`\`jsx
let sharedCount = 0  // 模組層級，所有元件實例共用

function Counter() {
  const increment = () => {
    sharedCount += 1
    console.log(sharedCount)  // 所有 Counter 實例共用同一個值
  }
  return <button onClick={increment}>點擊</button>
}

// ⚠️ 兩個 Counter 操作同一個 sharedCount
<Counter />  // 點擊增加的是同一個 sharedCount
<Counter />
\`\`\`

**適用場景總結**

- **useRef**：需要跨渲染保持、不需要 UI 反映的值（timer ID、前一個值、DOM 引用）
- **useState**：需要 UI 反映的值
- **模組外變數**：真正的全域狀態（如設定、快取）；但通常應用應用 Context 或狀態管理`,
      },
    ],
  },
  {
    slug: 'react-performance',
    sections: [
      {
        heading: 'React.memo 與 props 淺比較',
        content: `**React.memo 的作用**

用 \`React.memo\` 包裹函式元件後，父元件 re-render 時，如果傳入的 props 淺比較相等，則跳過子元件的重新渲染。

\`\`\`jsx
// 沒有 memo：Parent re-render 時，Child 每次都 re-render
function Child({ name, count }) {
  console.log('Child render')
  return <div>{name}: {count}</div>
}

// 有 memo：只有 name 或 count 真的改變時才 re-render
const Child = React.memo(function Child({ name, count }) {
  console.log('Child render')
  return <div>{name}: {count}</div>
})
\`\`\`

**淺比較的限制：物件和函式**

\`\`\`jsx
function Parent() {
  const [count, setCount] = useState(0)

  // ❌ 每次 Parent re-render，這些都是新引用
  const style = { color: 'red' }      // 新物件
  const handleClick = () => doSomething()  // 新函式

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>re-render Parent</button>
      {/* memo 無效：style 和 handleClick 每次都是新引用 */}
      <MemoChild style={style} onClick={handleClick} />
    </>
  )
}

// ✅ 搭配 useMemo 和 useCallback
function Parent() {
  const [count, setCount] = useState(0)
  const style = useMemo(() => ({ color: 'red' }), [])  // 穩定引用
  const handleClick = useCallback(() => doSomething(), [])  // 穩定引用

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>re-render Parent</button>
      <MemoChild style={style} onClick={handleClick} />  {/* 現在 memo 有效 */}
    </>
  )
}
\`\`\``,
      },
      {
        heading: 'useMemo 和 useCallback 的選擇',
        content: `**useMemo：快取計算結果**

\`\`\`jsx
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b)  // 只有 a 或 b 改變時重新計算
}, [a, b])

// 常見範例：過濾大量資料
const filteredItems = useMemo(() => {
  return items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
}, [items, searchQuery])  // items 或 searchQuery 改變時才重新過濾
\`\`\`

**useCallback：快取函式引用**

\`\`\`jsx
const handleSubmit = useCallback((data) => {
  submitForm(data, userId)  // userId 改變時建立新函式，否則重用
}, [userId])

// 等效的 useMemo 寫法
const handleSubmit = useMemo(() => {
  return (data) => submitForm(data, userId)
}, [userId])
// useCallback(fn, deps) 等於 useMemo(() => fn, deps)
\`\`\`

**何時使用？**

\`\`\`jsx
// ✅ 適合使用 useMemo 的場景
const data = useMemo(() => processLargeArray(rawData), [rawData])
// 1. 計算確實昂貴（>1ms）
// 2. 需要穩定引用給 memo 子元件

// ✅ 適合使用 useCallback 的場景
const fetchUser = useCallback(() => {
  return api.getUser(userId)
}, [userId])
// 1. 傳給 React.memo 包裹的子元件
// 2. 作為 useEffect 的依賴

// ❌ 不需要的場景：計算很快
const double = useMemo(() => count * 2, [count])  // 過度優化，乘法非常快
const handleClick = useCallback(() => setCount(c => c + 1), [])  // 沒有傳給 memo 子元件
\`\`\``,
      },
      {
        heading: '過度優化的問題與 Profiler',
        content: `**useMemo/useCallback 的成本**

這些 Hook 本身有成本，不是免費的：
- **記憶體**：需要儲存快取的值和依賴陣列
- **比較成本**：每次渲染都需要比較依賴陣列
- **程式碼複雜度**：增加閱讀和維護難度

\`\`\`jsx
// 過度優化的例子：每次都 memo，但組件其實很便宜
const MyComponent = React.memo(function MyComponent({ text }) {
  const formattedText = useMemo(() => text.toUpperCase(), [text])  // 完全不必要
  const handleClick = useCallback(() => console.log(text), [text])  // 完全不必要

  return <button onClick={handleClick}>{formattedText}</button>
})
// 這樣的程式碼更難讀，但效能不一定更好
\`\`\`

**正確的優化流程**

1. **先不優化**：寫出正確且可讀的程式碼
2. **用 Profiler 找瓶頸**：找出真正慢的地方
3. **針對性優化**：只優化真正需要的地方

**React DevTools Profiler 使用方式**

\`\`\`
1. 安裝 React DevTools 瀏覽器擴充套件
2. 開啟 DevTools → Profiler 分頁
3. 點擊錄製（Record）按鈕
4. 執行你想分析的操作
5. 停止錄製，查看：
   - 哪些元件花了最多時間
   - 哪些元件不必要地 re-render
   - 每次 render 的原因（why did this render?）
\`\`\`

**程式碼層面的效能優先事項**

\`\`\`jsx
// 優先考慮這些，而不是 memo：
// 1. 減少 state 提升層級（state co-location）
function Parent() {
  // ❌ 把只有 Child 需要的 state 放在 Parent
  const [childState, setChildState] = useState(0)
  return <Child state={childState} onChange={setChildState} />
}

// ✅ 把 state 放在需要它的元件中
function Child() {
  const [state, setState] = useState(0)  // state 下移，Parent 不受影響
}

// 2. 避免在 render 中建立複雜物件（改用 state 或模組常數）
const STABLE_CONFIG = { timeout: 3000, retries: 3 }  // 模組常數，引用穩定

function MyComponent() {
  // ❌ const config = { timeout: 3000 }  // 每次渲染新建
  return <Child config={STABLE_CONFIG} />
}
\`\`\``,
      },
    ],
  },
  {
    slug: 'react-state-management',
    sections: [
      {
        heading: 'State Lifting 與 Prop Drilling',
        content: `**何時需要提升 State（State Lifting）**

當多個元件需要共享同一份 state 時，把 state 提升到它們的最近共同父元件。

\`\`\`jsx
// ❌ 兩個兄弟元件各自有 state，無法同步
function ComponentA() {
  const [value, setValue] = useState('')
  return <input value={value} onChange={e => setValue(e.target.value)} />
}

function ComponentB() {
  // 無法取得 ComponentA 的 value
  return <div>???</div>
}

// ✅ 提升 state 到共同父元件
function Parent() {
  const [value, setValue] = useState('')  // state 提升到這裡

  return (
    <>
      <ComponentA value={value} onChange={setValue} />
      <ComponentB value={value} />  {/* 兩個元件共用同一份 state */}
    </>
  )
}
\`\`\`

**Prop Drilling 的問題**

\`\`\`jsx
// 中間層只是轉傳 props，與資料無關卻不得不接收
function App() {
  const [user, setUser] = useState({ name: 'Alice' })
  return <Page user={user} />
}

function Page({ user }) {  // Page 不需要 user，但必須接收並傳遞
  return <Header user={user} />
}

function Header({ user }) {  // Header 也只是轉傳
  return <Avatar user={user} />
}

function Avatar({ user }) {  // 終於用到了
  return <img alt={user.name} />
}
\`\`\`

**解決 Prop Drilling 的方案**

1. **Context**：適合低頻更新的全域資料（主題、語言、用戶資訊）
2. **組合模式（Children Prop）**：重新思考元件結構

\`\`\`jsx
// 組合模式：把元件作為 children 傳入，跳過中間層
function App() {
  const [user, setUser] = useState({ name: 'Alice' })
  return (
    <Page>
      <Header>
        <Avatar user={user} />  {/* 直接傳到需要的地方 */}
      </Header>
    </Page>
  )
}

function Page({ children }) { return <div>{children}</div> }  // 不需要 user
function Header({ children }) { return <header>{children}</header> }  // 不需要 user
\`\`\``,
      },
      {
        heading: 'Context 的用法與效能',
        content: `**建立和使用 Context**

\`\`\`jsx
// 1. 建立 Context
const ThemeContext = createContext('light')  // 'light' 是預設值（無 Provider 時使用）

// 2. 提供 Context（Provider）
function App() {
  const [theme, setTheme] = useState('light')

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <MainLayout />
    </ThemeContext.Provider>
  )
}

// 3. 消費 Context（跳過中間所有層）
function DeepButton() {
  const { theme, setTheme } = useContext(ThemeContext)
  return (
    <button
      className={theme}
      onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
    >
      切換主題
    </button>
  )
}
\`\`\`

**Context 的效能問題**

\`\`\`jsx
// ❌ Context value 改變時，所有 consumer 都 re-render
function App() {
  const [user, setUser] = useState({ name: 'Alice' })
  const [theme, setTheme] = useState('light')

  // theme 改變時，userContext 的所有消費者也會 re-render（因為 value 物件是新的）
  return (
    <AppContext.Provider value={{ user, setUser, theme, setTheme }}>
      <App />
    </AppContext.Provider>
  )
}

// ✅ 拆分 Context：各自獨立更新
const UserContext = createContext(null)
const ThemeContext = createContext('light')

function App() {
  const [user, setUser] = useState({ name: 'Alice' })
  const [theme, setTheme] = useState('light')

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <MainLayout />
      </ThemeContext.Provider>
    </UserContext.Provider>
  )
}
// 現在 theme 改變不影響 UserContext 的消費者
\`\`\`

**封裝 Context 的最佳實踐**

\`\`\`jsx
// 建議：把 Context 邏輯封裝成自訂 Hook
const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')
  const value = useMemo(() => ({ theme, setTheme }), [theme])  // 穩定化 value

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme 必須在 ThemeProvider 內使用')
  return ctx
}
\`\`\``,
      },
      {
        heading: 'Context vs Redux vs useReducer',
        content: `**useReducer：複雜本地 State**

\`\`\`jsx
// 當 state 有複雜的更新邏輯，useReducer 比 useState 更清晰
const initialState = { count: 0, step: 1, history: [] }

function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        count: state.count + state.step,
        history: [...state.history, state.count + state.step],
      }
    case 'SET_STEP':
      return { ...state, step: action.payload }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <>
      <div>Count: {state.count}</div>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </>
  )
}
\`\`\`

**useReducer + Context：輕量級 Redux 模式**

\`\`\`jsx
const StoreContext = createContext(null)

function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const value = useMemo(() => ({ state, dispatch }), [state])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

function useStore() {
  return useContext(StoreContext)
}

// 在任何深度的子元件中使用
function TodoItem({ id }) {
  const { state, dispatch } = useStore()
  const todo = state.todos.find(t => t.id === id)

  return (
    <li onClick={() => dispatch({ type: 'TOGGLE_TODO', payload: id })}>
      {todo.text}
    </li>
  )
}
\`\`\`

**三者比較與選擇建議**

| | Context | useReducer | Redux/Zustand |
|--|---------|-----------|---------------|
| 適合規模 | 小到中 | 小到中 | 中到大 |
| 學習成本 | 低 | 低 | 中到高 |
| DevTools | ❌ | ❌ | ✅ |
| Middleware | ❌ | ❌ | ✅ |
| 效能優化 | 手動 | 手動 | 內建 |
| 適合場景 | 主題、語言、用戶資訊 | 表單、複雜本地 state | 大型應用、跨頁面 state |

**決策建議：**
- 只有少數頁面需要共享 → \`useState\` + Lifting
- 多個元件共享且更新頻繁 → \`useReducer\` + Context
- 大型應用、需要 DevTools → Zustand（簡單）或 Redux Toolkit（功能完整）`,
      },
    ],
  },
  {
    slug: 'react-patterns',
    sections: [
      {
        heading: 'Controlled vs Uncontrolled Component',
        content: `**Controlled Component（受控元件）**

表單元素的值由 React state 控制，每次鍵入都觸發 re-render。

\`\`\`jsx
function ControlledForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleNameChange = (e) => {
    const value = e.target.value
    setName(value)
    // 即時驗證
    setError(value.length < 2 ? '名稱至少 2 個字' : '')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // 直接使用 state 中的值
    submitForm({ name, email })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={handleNameChange} />
      {error && <span className="error">{error}</span>}
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <button type="submit">送出</button>
    </form>
  )
}
\`\`\`

**Uncontrolled Component（非受控元件）**

表單值由 DOM 自己管理，需要時用 \`ref\` 讀取。

\`\`\`jsx
function UncontrolledForm() {
  const nameRef = useRef(null)
  const emailRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    // 提交時才讀取 DOM 值
    submitForm({
      name: nameRef.current.value,
      email: emailRef.current.value,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input ref={nameRef} defaultValue="" />  {/* defaultValue 而非 value */}
      <input ref={emailRef} defaultValue="" />
      <button type="submit">送出</button>
    </form>
  )
}
\`\`\`

**比較與選擇**

| | Controlled | Uncontrolled |
|--|-----------|--------------|
| 即時驗證 | ✅ 容易 | ❌ 困難 |
| 格式化輸入 | ✅ 容易 | ❌ 困難 |
| 動態禁用按鈕 | ✅ 容易 | ❌ 困難 |
| 程式碼量 | 較多 | 較少 |
| Re-render | 每次鍵入 | 只在提交時 |
| React 官方推薦 | ✅ | （特殊情況）|`,
      },
      {
        heading: 'React 18 主要新特性',
        content: `**1. createRoot API（新的渲染方式）**

\`\`\`jsx
// React 17 舊方式
import ReactDOM from 'react-dom'
ReactDOM.render(<App />, document.getElementById('root'))

// React 18 新方式（必須改用 createRoot 才能使用 Concurrent Features）
import { createRoot } from 'react-dom/client'
const root = createRoot(document.getElementById('root'))
root.render(<App />)
\`\`\`

**2. Automatic Batching（自動批次更新）**

所有情況（包含 setTimeout、Promise、原生事件）都自動 batch，詳見 Batch Update 章節。

**3. Concurrent Features（並行特性）**

\`\`\`jsx
// useTransition：標記低優先級更新
function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isPending, startTransition] = useTransition()

  const handleSearch = (e) => {
    setQuery(e.target.value)  // 高優先級：立即更新輸入框

    startTransition(() => {
      setResults(searchData(e.target.value))  // 低優先級：不阻塞輸入
    })
  }

  return (
    <>
      <input value={query} onChange={handleSearch} />
      {isPending && <Spinner />}
      <ResultsList results={results} />
    </>
  )
}

// useDeferredValue：延遲特定值
function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query)
  // deferredQuery 是 query 的「延遲版本」
  // 當 query 快速改變時，deferredQuery 用舊值渲染（不阻塞輸入）
  const results = useMemo(() => searchData(deferredQuery), [deferredQuery])
  return <ResultsList results={results} />
}
\`\`\`

**4. 新 Hooks**

\`\`\`jsx
// useId：生成 SSR/CSR 一致的唯一 ID
function FormField({ label }) {
  const id = useId()  // 生成如 ":r0:" 的穩定 ID
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </>
  )
}
\`\`\`

**5. Suspense 改進**

React 18 中 Suspense 支援 SSR streaming，配合 \`React.lazy\` 實現更好的程式碼分割。`,
      },
      {
        heading: '好的 React Code 原則',
        content: `**1. 單一職責（Single Responsibility）**

每個元件只做一件事，超過 200 行代表可能需要拆分。

**2. State Co-location（狀態就近原則）**

\`\`\`jsx
// ❌ 把 state 放太高（導致不必要的 re-render 擴散）
function App() {
  const [isOpen, setIsOpen] = useState(false)  // 只有 Modal 需要
  return <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} />
}

// ✅ state 放在需要它的最近元件
function Modal() {
  const [isOpen, setIsOpen] = useState(false)  // 封裝在內部
  return isOpen ? <div>...</div> : null
}
\`\`\`

**3. 組合優於繼承**

\`\`\`jsx
// ✅ 用 children 實現組合
function Card({ children, className }) {
  return <div className={\`card \${className}\`}>{children}</div>
}

function ProfileCard({ user }) {
  return (
    <Card className="profile">
      <Avatar src={user.avatar} />
      <h2>{user.name}</h2>
    </Card>
  )
}
\`\`\`

**4. 自訂 Hook 抽取邏輯**

\`\`\`jsx
// ✅ 把可複用的邏輯抽成 Custom Hook
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(key) ?? 'null') ?? initialValue
    } catch {
      return initialValue
    }
  })

  const setValueAndStore = useCallback((newValue) => {
    setValue(newValue)
    localStorage.setItem(key, JSON.stringify(newValue))
  }, [key])

  return [value, setValueAndStore]
}

// 在多個元件中複用
const [theme, setTheme] = useLocalStorage('theme', 'light')
const [language, setLanguage] = useLocalStorage('lang', 'zh')
\`\`\`

**5. 元件拆分的判斷標準**

- 可以獨立複用？ → 拆分
- 有自己的 state 邏輯？ → 拆分
- JSX 超過 50 行？ → 考慮拆分
- 僅僅為了「看起來更小」→ 不要拆分（過早優化）

**6. TypeScript 增加可靠性**

\`\`\`tsx
interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
  onClick?: () => void
  disabled?: boolean
}

function Button({ children, variant = 'primary', onClick, disabled }: ButtonProps) {
  return (
    <button
      className={\`btn btn-\${variant}\`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
\`\`\``,
      },
    ],
  },
]

async function main() {
  console.log('開始建立 React 主題筆記...')

  for (const note of notes) {
    console.log(`處理 ${note.slug}...`)

    // 刪除舊資料
    await db.delete(schema.topicNoteSections).where(eq(schema.topicNoteSections.slug, note.slug))

    // 插入新資料
    for (let i = 0; i < note.sections.length; i++) {
      await db.insert(schema.topicNoteSections).values({
        slug: note.slug,
        heading: note.sections[i].heading,
        content: note.sections[i].content,
        order: i,
      })
    }

    console.log(`✅ ${note.slug} 完成（${note.sections.length} 個章節）`)
  }

  console.log(`\n✅ 全部完成！共處理 ${notes.length} 個主題`)
  process.exit(0)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
