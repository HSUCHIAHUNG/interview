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
    slug: 'perf-page-load',
    sections: [
      {
        heading: '關鍵渲染路徑（Critical Rendering Path）',
        content: `關鍵渲染路徑（CRP）是瀏覽器將 HTML、CSS、JS 轉換為螢幕像素的完整流程：

**完整步驟：**

1. **DNS 查詢** → 將域名解析為 IP
2. **TCP 連線** → 三次握手（HTTPS 還需 TLS 交握）
3. **HTTP Request / Response** → 下載 HTML
4. **DOM 建構** → 瀏覽器解析 HTML，建立 DOM Tree（遇到 \`<script>\` 停止解析）
5. **CSSOM 建構** → 解析 CSS，建立 CSSOM Tree（阻塞渲染，但不阻塞 DOM 解析）
6. **Render Tree** → 合併 DOM + CSSOM，排除 \`display:none\` 節點
7. **Layout（Reflow）** → 計算每個節點的位置和大小
8. **Paint** → 填入像素顏色
9. **Compositing** → 合成各圖層輸出至螢幕

**渲染阻塞 vs 解析阻塞：**

| 資源 | 阻塞 DOM 解析 | 阻塞渲染 |
|------|-------------|---------|
| CSS（\`<link rel="stylesheet">\`） | 否 | 是 |
| JS（\`<script>\` 無屬性） | 是 | 是 |
| JS（\`defer\`） | 否 | 否 |
| JS（\`async\`） | 短暫（執行時） | 否 |

**Speculative Parsing（預測解析）：**

現代瀏覽器在主執行緒解析 HTML 被 JS 阻塞時，會啟動「預測掃描器（preload scanner）」繼續往下掃描 HTML，提前發起 \`<link>\`、\`<img>\`、\`<script>\` 的下載請求，減少等待時間。這是為什麼把 \`<script>\` 放在 \`<body>\` 底部仍有效的底層原因。`,
      },
      {
        heading: 'DOMContentLoaded vs load vs Interactive',
        content: `三個事件的觸發時機各不相同，對應不同的頁面就緒狀態：

**觸發時機：**

| 事件 | 觸發條件 |
|------|---------|
| \`DOMContentLoaded\` | HTML 解析完成、defer script 執行完畢（不等圖片、CSS、iframe） |
| \`load\` | 所有資源（圖片、CSS、iframe、字型）全部下載完畢 |
| \`document.readyState === 'interactive'\` | HTML 解析完成，等同 DOMContentLoaded 前一刻 |

**使用場景：**

\`\`\`js
// DOMContentLoaded：初始化 DOM 操作、綁定事件（不需等圖片）
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#app').innerHTML = '<p>Ready</p>'
})

// load：需要知道圖片尺寸、執行依賴所有資源的邏輯
window.addEventListener('load', () => {
  const img = document.querySelector('img')
  console.log(img.naturalWidth) // 此時才能拿到正確尺寸
})
\`\`\`

**defer script 與 DOMContentLoaded 的關係：**

\`defer\` script 保證在 HTML 解析完成後、\`DOMContentLoaded\` 觸發前執行，且保證執行順序。

**用 performance.timing 測量時間點：**

\`\`\`js
window.addEventListener('load', () => {
  const t = performance.timing
  console.log('TTFB:', t.responseStart - t.requestStart, 'ms')
  console.log('DOM Ready:', t.domContentLoadedEventEnd - t.navigationStart, 'ms')
  console.log('Load:', t.loadEventEnd - t.navigationStart, 'ms')
})

// 現代 API（Navigation Timing Level 2）
const [nav] = performance.getEntriesByType('navigation')
console.log('TTFB:', nav.responseStart)
console.log('DOMContentLoaded:', nav.domContentLoadedEventEnd)
\`\`\``,
      },
      {
        heading: '效能指標一覽（FCP、LCP、TTI、TTFB、TBT）',
        content: `**各指標定義與良好標準：**

| 指標 | 全名 | 定義 | 良好標準 | Core Web Vital |
|------|------|------|---------|---------------|
| TTFB | Time to First Byte | 瀏覽器收到第一個位元組 | < 800ms | 否 |
| FCP | First Contentful Paint | 首次渲染任何文字或圖片 | < 1.8s | 否 |
| LCP | Largest Contentful Paint | 最大內容元素渲染完成 | < 2.5s | 是 |
| TTI | Time to Interactive | 頁面完全可互動 | < 3.8s | 否 |
| TBT | Total Blocking Time | FCP 到 TTI 間長任務阻塞總時間 | < 200ms | 否 |
| CLS | Cumulative Layout Shift | 累積版面位移 | < 0.1 | 是 |
| INP | Interaction to Next Paint | 所有互動的 P75 回應時間 | < 200ms | 是 |

**Core Web Vitals（核心網頁指標）：** LCP、INP、CLS

**preconnect 與 dns-prefetch 的使用：**

\`\`\`html
<!-- preconnect：提前完成 DNS + TCP + TLS（適合關鍵 API / CDN） -->
<link rel="preconnect" href="https://api.example.com">
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>

<!-- dns-prefetch：只做 DNS 查詢（資源耗用少，適合非關鍵第三方域名） -->
<link rel="dns-prefetch" href="https://analytics.example.com">
\`\`\`

**Chrome DevTools Network Waterfall 解讀：**

- **Queued / Stalled**：等待連線或優先級排隊
- **DNS Lookup**：域名解析
- **Initial connection**：TCP + TLS
- **TTFB（Waiting）**：等待伺服器回應
- **Content Download**：下載 response body

看到 TTFB 長 → 優化後端或 CDN；Content Download 長 → 壓縮資源大小。`,
      },
    ],
  },
  {
    slug: 'perf-resource-loading',
    sections: [
      {
        heading: 'CSS 與 JavaScript 的渲染阻塞行為',
        content: `**CSS：Render-blocking，但不阻塞 DOM 解析**

CSS 不會停止 HTML 解析器，但瀏覽器在 CSSOM 建構完成前不會渲染任何內容。此外，如果 CSSOM 尚未就緒，瀏覽器也會延後執行緊接在後的 \`<script>\`（因為 JS 可能讀取樣式）。

**JS：Parser-blocking（解析阻塞）**

遇到沒有 \`async\`/\`defer\` 的 \`<script>\`，HTML 解析器完全停止，直到 script 下載並執行完畢。

**兩者互相影響：**

\`\`\`html
<!-- 當瀏覽器遇到以下順序時： -->
<link rel="stylesheet" href="style.css"> <!-- 開始下載 CSS -->
<script src="app.js"></script>           <!-- 停止解析，等 CSS 下載完再執行 JS -->
<p>Hello</p>                             <!-- 等 JS 執行完才繼續解析 -->
\`\`\`

執行順序：下載 CSS → 下載 JS（可並行）→ 等 CSSOM 完成 → 執行 JS → 繼續解析 HTML

**最壞情況：**
CSS 在 JS 之前 → JS 必須等 CSSOM → 使 CSS 間接造成解析阻塞

**最佳實踐：**
- CSS 放 \`<head>\`（盡早開始下載）
- 重要 CSS 可 inline 或用 \`media\` query 降低優先級
- JS 加 \`defer\`/\`async\` 或移至 \`<body>\` 底部`,
      },
      {
        heading: 'defer vs async vs 一般 script',
        content: `**三種載入方式比較：**

\`\`\`
一般 script：  HTML解析 → [停] 下載 → 執行 → 繼續解析
async script： HTML解析（並行下載） → [短停] 執行 → 繼續解析
defer script： HTML解析（並行下載） → 解析完成 → 按順序執行 → DOMContentLoaded
\`\`\`

| 特性 | 一般 | async | defer |
|------|------|-------|-------|
| 阻塞 HTML 解析 | 是（下載+執行） | 否（執行時短暫） | 否 |
| 保證執行順序 | 是 | 否 | 是 |
| 執行時機 | 立即 | 下載完立即 | HTML 解析後 |
| DOMContentLoaded 前執行 | 視位置而定 | 否 | 是 |

**選擇決策樹：**

\`\`\`
有相依性（A 需要 B）？ → defer
獨立的第三方 script（廣告、分析）？ → async
需要支援老舊瀏覽器且無法修改位置？ → 放 </body> 前
\`\`\`

**程式碼範例：**

\`\`\`html
<!-- defer：main app bundle，保證順序 -->
<script defer src="vendor.js"></script>
<script defer src="app.js"></script> <!-- 保證在 vendor.js 之後執行 -->

<!-- async：獨立的第三方工具 -->
<script async src="https://analytics.example.com/tracker.js"></script>
\`\`\`

**type="module" 預設 defer：**

\`\`\`html
<!-- module script 預設是 defer，且有嚴格模式和獨立作用域 -->
<script type="module" src="app.mjs"></script>
\`\`\``,
      },
      {
        heading: 'Resource Hints：preload / prefetch / preconnect / dns-prefetch',
        content: `**四種 Resource Hint 比較：**

| 指令 | 適用時機 | 優先級 | 作用 |
|------|---------|-------|------|
| \`preload\` | 當前頁面必要資源 | 高 | 提前下載資源 |
| \`prefetch\` | 下一頁可能需要的資源 | 低（idle 時） | 提前下載資源 |
| \`preconnect\` | 當前頁面的重要第三方域名 | 高 | 只建立連線（DNS+TCP+TLS） |
| \`dns-prefetch\` | 非關鍵第三方域名 | 低 | 只做 DNS 查詢 |

**常見使用場景：**

\`\`\`html
<!-- 字型 preload：避免 FOUT，as="font" 和 crossorigin 必填 -->
<link rel="preload" href="/fonts/Inter.woff2" as="font" type="font/woff2" crossorigin>

<!-- LCP 圖片 preload：提升 LCP 分數 -->
<link rel="preload" href="/hero.webp" as="image">

<!-- API origin preconnect：減少首次 API 請求延遲 -->
<link rel="preconnect" href="https://api.example.com">

<!-- 下一頁路由 prefetch：SPA 預先下載 chunk -->
<link rel="prefetch" href="/next-page.js" as="script">

<!-- dns-prefetch：低成本，適合大量第三方域名 -->
<link rel="dns-prefetch" href="https://cdn.example.com">
\`\`\`

**HTTP Header 版本（適合伺服器動態注入）：**

\`\`\`
Link: </fonts/Inter.woff2>; rel=preload; as=font; crossorigin
Link: <https://api.example.com>; rel=preconnect
\`\`\`

**注意事項：**

- \`preload\` 的資源必須在當前頁面實際使用，否則觸發瀏覽器警告
- \`preconnect\` 最多保持連線 10 秒，只對即將使用的域名有效
- 跨域字型的 \`preload\` 必須加 \`crossorigin\`，否則會下載兩次`,
      },
    ],
  },
  {
    slug: 'perf-bundle',
    sections: [
      {
        heading: 'Code Splitting 策略',
        content: `Code Splitting 將單一大型 bundle 切分為多個小 chunk，按需載入，減少初始載入時間。

**三種主要策略：**

**1. Entry Points 分割（多入口）**

適合 MPA（多頁應用），每個頁面獨立 bundle：
\`\`\`js
// webpack.config.js
module.exports = {
  entry: {
    home: './src/home.js',
    dashboard: './src/dashboard.js',
  }
}
\`\`\`

**2. 路由層級分割（React.lazy + Suspense）**

最常見的 SPA 分割策略：
\`\`\`jsx
import { lazy, Suspense } from 'react'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Settings = lazy(() => import('./pages/Settings'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  )
}
\`\`\`

**3. 元件層級分割（重型元件）**

對圖表庫、地圖、富文字編輯器等按需載入：
\`\`\`jsx
const Chart = lazy(() => import('recharts').then(m => ({ default: m.LineChart })))
const Map = lazy(() => import('./MapComponent'))
\`\`\`

**Webpack SplitChunksPlugin（自動 vendor 分離）：**

\`\`\`js
// webpack.config.js
optimization: {
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all',
      },
    },
  },
}
\`\`\``,
      },
      {
        heading: 'Tree Shaking 與 ES Module',
        content: `Tree Shaking 是打包工具移除未使用程式碼（dead code）的技術，依賴 ESM 的靜態分析能力。

**ESM vs CJS 的關鍵差異：**

\`\`\`js
// ESM（靜態）：import 在編譯期確定，可靜態分析
import { debounce } from 'lodash-es' // ✅ 可 tree shake

// CJS（動態）：require 在執行期決定，無法靜態分析
const { debounce } = require('lodash') // ❌ 整個 lodash 都打包
\`\`\`

**package.json 的 sideEffects：**

\`\`\`json
{
  "sideEffects": false
}
// 告訴打包工具：此套件所有模組都沒有副作用，可安全移除未用的 export

// 或指定有副作用的檔案
{
  "sideEffects": ["*.css", "./src/polyfills.js"]
}
\`\`\`

**Named import vs Default import：**

\`\`\`js
// Named import：讓打包工具知道要哪個，可精確 tree shake
import { map, filter } from 'lodash-es'

// Default import：整個模組都可能被包含
import _ from 'lodash-es'
_.map([1,2,3], x => x * 2)
\`\`\`

**常見陷阱：**

\`\`\`js
// ❌ 引入整個 lodash（CJS）
import _ from 'lodash'

// ✅ 使用 lodash-es（ESM 版本）
import { debounce } from 'lodash-es'

// ✅ 或個別路徑 import
import debounce from 'lodash/debounce'
\`\`\`

CSS-in-JS、polyfill 通常有 side effect，需在 sideEffects 中標記。`,
      },
      {
        heading: 'Bundle 分析與優化工具',
        content: `找出「肥胖套件」是 bundle 優化的第一步。

**主要分析工具：**

**1. webpack-bundle-analyzer**

\`\`\`bash
npm install --save-dev webpack-bundle-analyzer

# 在 webpack config 加入：
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
plugins: [new BundleAnalyzerPlugin()]

# 或 Next.js：
npm install --save-dev @next/bundle-analyzer
\`\`\`

在瀏覽器開啟互動式 treemap，可直觀看到各模組佔用大小。

**2. source-map-explorer**

\`\`\`bash
npm install --save-dev source-map-explorer

# 分析已建置的 bundle（需要 source map）
npx source-map-explorer build/static/js/main.*.js
\`\`\`

**3. bundlephobia.com**

線上查詢 npm 套件的 bundle 大小、gzip 大小、下載時間，以及是否支援 tree shaking。

**4. Vite / Rollup 的 rollup-plugin-visualizer**

\`\`\`bash
npm install --save-dev rollup-plugin-visualizer

# vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer'
export default { plugins: [visualizer({ open: true })] }
\`\`\`

**找到肥胖套件後的處理策略：**

| 問題套件 | 替換方案 |
|---------|---------|
| \`moment\` (330KB) | \`dayjs\` (7KB) 或 \`date-fns\` |
| \`lodash\` (整包) | \`lodash-es\` + named import |
| \`axios\` | \`ky\` 或原生 \`fetch\` |
| \`react-icons\` (整包) | 只 import 需要的 icon |`,
      },
    ],
  },
  {
    slug: 'perf-large-data',
    sections: [
      {
        heading: '壓縮與傳輸優化',
        content: `**Gzip vs Brotli 比較：**

| 演算法 | 壓縮率 | CPU 成本 | 支援度 |
|--------|-------|---------|-------|
| Gzip | 基準 | 低 | 全瀏覽器 |
| Brotli | 比 Gzip 再小 20-26% | 較高（但壓縮在伺服器端） | 現代瀏覽器（IE 不支援） |

瀏覽器透過 \`Accept-Encoding\` 告知支援的格式，伺服器選擇並在 \`Content-Encoding\` 回應。

**HTTP Headers：**

\`\`\`
# Request
Accept-Encoding: gzip, deflate, br

# Response
Content-Encoding: br
Content-Type: application/json
\`\`\`

**Nginx 開啟 Gzip + Brotli：**

\`\`\`nginx
# nginx.conf
http {
  # Gzip（內建模組）
  gzip on;
  gzip_types text/plain text/css application/json application/javascript;
  gzip_min_length 1000;
  gzip_comp_level 6;

  # Brotli（需安裝 ngx_brotli 模組）
  brotli on;
  brotli_types text/plain text/css application/json application/javascript;
  brotli_comp_level 6;
}
\`\`\`

**JSON 資料瘦身：**

\`\`\`js
// ❌ 冗餘欄位
{ "user_name": "Alice", "user_age": 30, "user_email": "alice@example.com" }

// ✅ 移除前綴、縮短 key 名（需配合 API 文件）
{ "name": "Alice", "age": 30, "email": "alice@example.com" }

// ✅ 陣列資料用數字 key（columnar format）
// 原本：[{ id: 1, name: "A" }, { id: 2, name: "B" }]
// 壓縮後：{ ids: [1, 2], names: ["A", "B"] }
\`\`\`

靜態資源建議預先壓縮（pre-compressed），CDN 直接提供 .br / .gz 檔案，避免動態壓縮的 CPU 成本。`,
      },
      {
        heading: '虛擬捲動（Virtual Scrolling）原理',
        content: `虛擬捲動只渲染可視窗口內的 DOM 節點，解決大量列表（> 500 項）的渲染效能問題。

**核心算法：**

\`\`\`js
// 計算哪些項目需要顯示
function getVisibleRange(scrollTop, containerHeight, itemHeight) {
  const startIndex = Math.floor(scrollTop / itemHeight)
  const endIndex = Math.ceil((scrollTop + containerHeight) / itemHeight)
  return { startIndex, endIndex }
}

// 用 padding 製造滾動空間（避免實際渲染所有 DOM）
function getStyle(totalItems, itemHeight, startIndex) {
  return {
    paddingTop: startIndex * itemHeight,
    paddingBottom: (totalItems - endIndex) * itemHeight,
  }
}
\`\`\`

**react-window 基本使用：**

\`\`\`jsx
import { FixedSizeList } from 'react-window'

const Row = ({ index, style }) => (
  <div style={style}>Row {index}: {data[index].name}</div>
)

function VirtualList({ data }) {
  return (
    <FixedSizeList
      height={600}        // 容器高度
      itemCount={data.length}
      itemSize={50}       // 每列高度（固定）
      width="100%"
    >
      {Row}
    </FixedSizeList>
  )
}
\`\`\`

**@tanstack/virtual（更靈活，支援動態高度）：**

\`\`\`jsx
import { useVirtualizer } from '@tanstack/react-virtual'

const rowVirtualizer = useVirtualizer({
  count: data.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 50, // 估算高度
})
\`\`\`

**何時使用虛擬捲動：**

- 列表項目超過 500 個且有效能問題
- 每個項目渲染成本高（含圖片、複雜元件）
- 注意：無限滾動（intersection observer）≠ 虛擬捲動，兩者可搭配使用`,
      },
      {
        heading: 'Streaming 與漸進式載入',
        content: `**Fetch API + ReadableStream 處理大型 JSON：**

\`\`\`js
async function streamLargeData(url) {
  const response = await fetch(url)
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })

    // 處理完整的行（NDJSON 格式：每行一個 JSON 物件）
    const lines = buffer.split('\n')
    buffer = lines.pop() // 最後可能是不完整的行

    for (const line of lines) {
      if (line.trim()) {
        const item = JSON.parse(line)
        processItem(item) // 逐筆處理，不等全部下載完
      }
    }
  }
}
\`\`\`

**Server-Sent Events（伺服器推送）：**

\`\`\`js
// Client
const es = new EventSource('/api/stream')
es.onmessage = (e) => {
  const data = JSON.parse(e.data)
  updateUI(data)
}
es.onerror = () => es.close()
\`\`\`

**HTTP Transfer-Encoding vs HTTP/2：**

- **HTTP/1.1 chunked**：Transfer-Encoding: chunked，伺服器分塊傳輸，客戶端逐塊接收
- **HTTP/2 Server Push**：伺服器主動推送資源（已被主流瀏覽器棄用）
- **HTTP/2 Multiplexing**：同一連線多個 stream，不需 chunked encoding

**Next.js App Router Streaming：**

\`\`\`tsx
// app/dashboard/page.tsx
import { Suspense } from 'react'
import { SlowComponent } from './SlowComponent'

export default function Page() {
  return (
    <div>
      <h1>Dashboard</h1>
      {/* SlowComponent 獨立串流，不阻塞頁面其他內容 */}
      <Suspense fallback={<div>Loading chart...</div>}>
        <SlowComponent />
      </Suspense>
    </div>
  )
}
\`\`\`

loading.tsx 自動作為路由級別的 Suspense fallback。`,
      },
    ],
  },
  {
    slug: 'perf-core-web-vitals',
    sections: [
      {
        heading: 'LCP 優化策略',
        content: `LCP（Largest Contentful Paint）衡量最大內容元素（圖片、文字區塊、視頻封面）的渲染時間，良好標準 < 2.5s。

**識別 LCP 元素：**

\`\`\`js
new PerformanceObserver((list) => {
  const entries = list.getEntries()
  const lastEntry = entries[entries.length - 1]
  console.log('LCP element:', lastEntry.element)
  console.log('LCP time:', lastEntry.startTime)
}).observe({ entryTypes: ['largest-contentful-paint'] })
\`\`\`

**LCP 慢的常見原因：**

1. **TTFB 慢** → 伺服器回應慢、無 CDN
2. **渲染阻塞資源** → 大型 CSS 或同步 JS 在 LCP 元素之前
3. **圖片下載慢** → 圖片未壓縮、無 CDN、格式未優化
4. **客戶端渲染延遲** → LCP 元素由 JS 動態生成

**針對性優化策略：**

\`\`\`html
<!-- 1. Preload LCP 圖片（最有效的單一優化） -->
<link rel="preload" href="/hero.webp" as="image" fetchpriority="high">

<!-- 2. LCP 圖片不加 lazy loading，設高優先級 -->
<img
  src="/hero.webp"
  fetchpriority="high"
  decoding="async"
  width="1200"
  height="600"
  alt="Hero"
>
<!-- 注意：不要加 loading="lazy"，這會延遲 LCP -->

<!-- 3. preconnect 到圖片 CDN -->
<link rel="preconnect" href="https://cdn.example.com">
\`\`\`

**其他優化方向：**

- 使用 CDN 降低 TTFB
- 將 LCP 圖片轉為 WebP/AVIF
- 對 LCP 文字使用 \`font-display: swap\` 並 preload 字型
- SSR/SSG 避免 LCP 元素需要 JS 才能渲染`,
      },
      {
        heading: 'CLS 優化策略',
        content: `CLS（Cumulative Layout Shift）衡量頁面載入過程中非預期的版面位移總量，良好標準 < 0.1。

**CLS 計算公式：**

\`CLS = 影響面積比例（佔 viewport 的比例）× 位移距離比例\`

例如：元素佔 viewport 50%，向下移動 viewport 的 25% → 單次 CLS = 0.5 × 0.25 = 0.125

**常見 CLS 來源與修復：**

**1. 圖片無尺寸**

\`\`\`html
<!-- ❌ 瀏覽器不知道圖片大小，下載後撐開頁面 -->
<img src="photo.jpg" alt="photo">

<!-- ✅ 指定寬高，瀏覽器提前保留空間 -->
<img src="photo.jpg" width="800" height="600" alt="photo">

<!-- ✅ 現代做法：CSS aspect-ratio -->
<style>
  .hero-img {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
  }
</style>
\`\`\`

**2. 字型 FOUT（無樣式文字閃爍）**

\`\`\`css
/* ✅ font-display: optional：若字型無法即時載入則永遠用後備字型（零 CLS）*/
@font-face {
  font-family: 'MyFont';
  src: url('/fonts/myfont.woff2') format('woff2');
  font-display: optional;
}

/* font-display: swap 會有 CLS，但文字先顯示 */
\`\`\`

**3. 動態插入 DOM（廣告、Banner）**

\`\`\`css
/* 預留廣告空間，避免廣告載入後推擠內容 */
.ad-placeholder {
  min-height: 250px; /* 已知廣告高度 */
  width: 100%;
}
\`\`\`

**CSS transform 動畫不觸發 CLS：**

\`\`\`css
/* ❌ 會觸發 CLS 的動畫（改變 layout 屬性）*/
.bad { transition: margin-top 0.3s; }

/* ✅ 不觸發 CLS（transform 在 composite 層，不影響 layout）*/
.good { transition: transform 0.3s; }
\`\`\``,
      },
      {
        heading: 'INP 優化與長任務拆分',
        content: `INP（Interaction to Next Paint）從 2024 年取代 FID，成為 Core Web Vitals，衡量所有互動（點擊、鍵入、觸控）的 P75 回應時間，良好標準 < 200ms。

**Long Task 為什麼阻塞 INP：**

主執行緒任何 > 50ms 的任務被稱為 Long Task。瀏覽器在 Long Task 執行期間無法回應用戶輸入，導致 INP 升高。

**用 setTimeout(0) 拆分長任務：**

\`\`\`js
// ❌ 同步處理大量資料，阻塞主執行緒
function processAll(items) {
  items.forEach(item => heavyProcess(item))
}

// ✅ 分批處理，讓瀏覽器可在批次間回應輸入
async function processInChunks(items, chunkSize = 100) {
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize)
    chunk.forEach(item => heavyProcess(item))
    await new Promise(resolve => setTimeout(resolve, 0)) // yield 主執行緒
  }
}
\`\`\`

**scheduler.postTask（現代 API）：**

\`\`\`js
// 指定優先級排程任務
scheduler.postTask(() => {
  heavyComputation()
}, { priority: 'background' }) // 'user-blocking' | 'user-visible' | 'background'
\`\`\`

**React 18 的 useTransition：**

\`\`\`jsx
import { useTransition, useState } from 'react'

function SearchResults() {
  const [isPending, startTransition] = useTransition()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  const handleChange = (e) => {
    setQuery(e.target.value) // 立即更新輸入框（高優先）

    startTransition(() => {
      // 標記為低優先，不阻塞用戶輸入
      setResults(searchData(e.target.value))
    })
  }

  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending ? <Spinner /> : <ResultList results={results} />}
    </>
  )
}
\`\`\`

**PerformanceObserver 監測 INP：**

\`\`\`js
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.duration > 200) {
      console.warn('Slow interaction:', entry.name, entry.duration + 'ms')
    }
  }
}).observe({ entryTypes: ['event'] })
\`\`\``,
      },
    ],
  },
  {
    slug: 'perf-image',
    sections: [
      {
        heading: '現代圖片格式：WebP 和 AVIF',
        content: `**壓縮效率比較：**

| 格式 | 相對大小 | 支援度 | 特點 |
|------|---------|-------|------|
| JPEG | 100%（基準） | 全瀏覽器 | 有損壓縮 |
| WebP | 約 30% 更小 | 現代瀏覽器（Chrome 17+, Safari 14+） | 有損/無損 |
| AVIF | 約 50% 更小 | Chrome 85+, Safari 16+, Firefox 93+ | 基於 AV1，最佳壓縮率 |

**\`<picture>\` 漸進式 Fallback（正確寫法）：**

\`\`\`html
<picture>
  <!-- 最優先：AVIF（最小，支援度最新） -->
  <source srcset="/image.avif" type="image/avif">
  <!-- 次選：WebP -->
  <source srcset="/image.webp" type="image/webp">
  <!-- Fallback：JPEG（所有瀏覽器支援） -->
  <img src="/image.jpg" alt="Product" width="800" height="600" loading="lazy">
</picture>
\`\`\`

注意：瀏覽器從上到下選擇第一個支援的 \`<source>\`，\`<img>\` 是最後的 fallback。

**轉換工具：**

\`\`\`bash
# sharp（Node.js，批量轉換）
npm install sharp

# 轉換單張圖片
const sharp = require('sharp')
sharp('input.jpg')
  .webp({ quality: 80 })
  .toFile('output.webp')

# 批量轉換腳本
node scripts/convert-images.js
\`\`\`

**Squoosh**：https://squoosh.app/ 線上轉換，可比較不同格式和品質的視覺效果與檔案大小。

**next/image 自動格式轉換：**

next/image 會根據瀏覽器的 \`Accept\` header 自動提供最佳格式（AVIF → WebP → JPEG），無需手動管理多個格式的檔案。`,
      },
      {
        heading: 'Responsive Images：srcset 和 sizes',
        content: `Responsive Images 讓瀏覽器根據裝置寬度和 DPR 選擇最適合的圖片版本。

**srcset 兩種語法：**

\`\`\`html
<!-- 寬度描述符（w）：最常用，搭配 sizes 使用 -->
<img
  srcset="image-320w.jpg 320w,
          image-640w.jpg 640w,
          image-1024w.jpg 1024w,
          image-1920w.jpg 1920w"
  sizes="(max-width: 480px) 100vw,
         (max-width: 768px) 80vw,
         60vw"
  src="image-640w.jpg"
  alt="Responsive image"
>

<!-- 像素密度描述符（x）：適合固定大小的圖片（如 logo、icon）-->
<img
  srcset="logo.png 1x, logo@2x.png 2x, logo@3x.png 3x"
  src="logo.png"
  alt="Logo"
>
\`\`\`

**瀏覽器選擇版本的決策邏輯：**

1. 讀取 \`sizes\` 屬性，計算圖片在當前 viewport 的顯示寬度
2. 乘以裝置 DPR（Retina 螢幕 DPR = 2 或 3）
3. 從 \`srcset\` 中選擇最接近的版本

例如：viewport 768px，圖片顯示 80vw = 614px，DPR = 2 → 需要 1228px 的版本 → 選 1920w

**多裝置最佳實踐（生成 4 個版本）：**

\`\`\`bash
# 使用 sharp 生成多尺寸版本
const sizes = [320, 640, 1024, 1920]
for (const size of sizes) {
  await sharp('original.jpg')
    .resize(size)
    .webp({ quality: 80 })
    .toFile(\`image-\${size}w.webp\`)
}
\`\`\`

\`\`\`html
<!-- 完整 responsive image 最佳實踐 -->
<picture>
  <source
    srcset="image-320w.avif 320w, image-640w.avif 640w, image-1024w.avif 1024w"
    type="image/avif"
    sizes="(max-width: 600px) 100vw, 50vw"
  >
  <source
    srcset="image-320w.webp 320w, image-640w.webp 640w, image-1024w.webp 1024w"
    type="image/webp"
    sizes="(max-width: 600px) 100vw, 50vw"
  >
  <img
    src="image-640w.jpg"
    srcset="image-320w.jpg 320w, image-640w.jpg 640w, image-1024w.jpg 1024w"
    sizes="(max-width: 600px) 100vw, 50vw"
    width="1024"
    height="768"
    alt="Description"
  >
</picture>
\`\`\``,
      },
      {
        heading: 'Lazy Loading 與 CLS 防止',
        content: `**loading="lazy" vs Intersection Observer：**

\`\`\`html
<!-- loading="lazy"：瀏覽器原生，最簡單，現代瀏覽器支援 -->
<img src="photo.jpg" loading="lazy" alt="photo">

<!-- Intersection Observer：更多控制（自定義 rootMargin、threshold）-->
\`\`\`

\`\`\`js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target
      img.src = img.dataset.src // 實際載入圖片
      observer.unobserve(img)
    }
  })
}, { rootMargin: '200px' }) // 提前 200px 開始載入

document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img))
\`\`\`

**LCP 圖片不應 lazy load：**

\`\`\`html
<!-- ❌ 錯誤：LCP 圖片加 lazy loading 會嚴重延遲 LCP -->
<img src="/hero.jpg" loading="lazy" alt="Hero">

<!-- ✅ 正確：LCP 圖片要高優先，eager loading -->
<img src="/hero.jpg" loading="eager" fetchpriority="high" alt="Hero">
\`\`\`

**\`<img>\` 的 width/height 防止 CLS：**

瀏覽器在圖片下載前，根據 width/height 計算 aspect ratio 並預留空間：

\`\`\`html
<!-- 指定 width/height，瀏覽器提前保留 16:9 的空間 -->
<img src="video-thumb.jpg" width="1280" height="720" loading="lazy" alt="Video">
\`\`\`

\`\`\`css
/* 現代做法：aspect-ratio CSS 屬性（更靈活）*/
.responsive-img {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9; /* 提前保留比例空間 */
  object-fit: cover;
}
\`\`\`

**LQIP（Low Quality Image Placeholder）技術：**

\`\`\`jsx
// 先顯示模糊的低解析度版本，真圖下載完再替換
function ProgressiveImage({ src, lqip, alt }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <img src={lqip} alt="" aria-hidden style={{ filter: 'blur(20px)' }} />
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.3s' }}
      />
    </div>
  )
}
\`\`\``,
      },
    ],
  },
  {
    slug: 'perf-caching',
    sections: [
      {
        heading: 'Cache-Control 指令大全',
        content: `Cache-Control 是控制 HTTP 快取行為的核心 header。

**常用指令說明：**

| 指令 | 含義 | 適用場景 |
|------|------|---------|
| \`max-age=N\` | 快取有效期 N 秒 | 靜態資源 |
| \`no-cache\` | 每次必須向伺服器驗證（可能 304） | HTML 頁面 |
| \`no-store\` | 完全不快取，每次重新下載 | 敏感資料（登入頁、個人資料）|
| \`must-revalidate\` | 過期後必須驗證，不允許 stale | 需要準確性的內容 |
| \`private\` | 只能被瀏覽器快取，不能被 CDN 快取 | 用戶個人化內容 |
| \`public\` | 可被 CDN/Proxy 快取 | 所有人相同的公開資源 |
| \`immutable\` | 告訴瀏覽器此資源永不更新（搭配長 max-age）| contenthash 靜態資源 |
| \`stale-while-revalidate=N\` | 過期後 N 秒內可用舊快取，同時背景驗證 | API、非關鍵頁面 |

**最佳快取策略：**

\`\`\`nginx
# HTML：不快取，每次驗證（確保用戶拿到最新版本）
location / {
  add_header Cache-Control "no-cache, must-revalidate";
}

# 靜態資源（CSS/JS/字型）：長時間快取 + contenthash
# 檔名範例：app.a3b4c5d6.js（hash 改變→新 URL→自動失效）
location /static/ {
  add_header Cache-Control "public, max-age=31536000, immutable";
  # max-age=31536000 = 1 年
}

# 圖片：長快取但允許更新
location /images/ {
  add_header Cache-Control "public, max-age=86400, stale-while-revalidate=604800";
  # max-age=1天，過期後7天內仍可用舊快取
}
\`\`\`

**contenthash 策略（webpack/Vite）：**

\`\`\`js
// webpack.config.js
output: {
  filename: '[name].[contenthash:8].js',
  // 輸出：main.a3b4c5d6.js
}
// 只要檔案內容沒變，hash 不變 → 快取永遠有效
// 內容改變 → hash 改變 → 新 URL → 自動繞過快取
\`\`\``,
      },
      {
        heading: 'ETag、Last-Modified 與條件請求',
        content: `條件請求讓瀏覽器可以確認快取是否仍然有效，若有效則伺服器回 304（節省下載頻寬）。

**完整條件請求流程：**

\`\`\`
第一次請求：
  Client → GET /api/data
  Server ← 200 OK + ETag: "abc123" + Last-Modified: Wed, 01 Jan 2025 00:00:00 GMT
  Client 存入快取 + ETag + Last-Modified

快取過期後的再次請求：
  Client → GET /api/data
            + If-None-Match: "abc123"
            + If-Modified-Since: Wed, 01 Jan 2025 00:00:00 GMT
  Server（資源未變）← 304 Not Modified（無 body，節省頻寬）
  Server（資源已變）← 200 OK + 新的 ETag + 新內容
\`\`\`

**HTTP Headers 範例：**

\`\`\`
# 回應 headers
HTTP/1.1 200 OK
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d"
Last-Modified: Tue, 15 Oct 2024 12:00:00 GMT
Cache-Control: no-cache

# 條件請求 headers（瀏覽器自動附上）
GET /api/data HTTP/1.1
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d"
If-Modified-Since: Tue, 15 Oct 2024 12:00:00 GMT
\`\`\`

**ETag Strong vs Weak：**

\`\`\`
Strong ETag（預設）：完全相同的位元組
ETag: "33a64df5"

Weak ETag：語義上等效（允許微小差異，如空白）
ETag: W/"33a64df5"
\`\`\`

**為什麼 ETag 比 Last-Modified 更可靠：**

- **Last-Modified 精度只到秒**：1 秒內多次更新無法區分
- **Last-Modified 時鐘問題**：多台伺服器時鐘可能不同步
- **ETag 是內容 hash**：內容不變則 ETag 不變，精確且可靠
- 伺服器通常兩者都提供，\`If-None-Match\`（ETag）優先於 \`If-Modified-Since\``,
      },
      {
        heading: 'Service Worker 快取策略',
        content: `Service Worker 是瀏覽器和網路之間的代理，可以攔截請求並實作精細的快取策略。

**Service Worker 生命週期：**

\`\`\`js
// sw.js
const CACHE_NAME = 'v1'

// install：預快取關鍵資源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(['/index.html', '/app.js', '/styles.css'])
    )
  )
  self.skipWaiting() // 立即激活，不等舊 SW 結束
})

// activate：清除舊版本快取
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  )
  self.clients.claim() // 立即控制所有頁面
})

// fetch：攔截請求，實作快取策略
self.addEventListener('fetch', (event) => {
  event.respondWith(/* 快取策略 */)
})
\`\`\`

**五種快取策略：**

\`\`\`js
// 1. Cache First（離線優先，適合靜態資源）
async function cacheFirst(request) {
  const cached = await caches.match(request)
  return cached ?? fetch(request)
}

// 2. Network First（適合 API，優先最新資料）
async function networkFirst(request) {
  try {
    const response = await fetch(request)
    const cache = await caches.open(CACHE_NAME)
    cache.put(request, response.clone())
    return response
  } catch {
    return caches.match(request) // 離線時用快取
  }
}

// 3. Stale While Revalidate（最快回應 + 背景更新）
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME)
  const cached = await cache.match(request)
  const fetchPromise = fetch(request).then(response => {
    cache.put(request, response.clone())
    return response
  })
  return cached ?? fetchPromise
}
\`\`\`

**Workbox（Google 官方函式庫）：**

\`\`\`js
import { registerRoute } from 'workbox-routing'
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies'

// 靜態資源：Cache First
registerRoute(({ request }) => request.destination === 'image', new CacheFirst())

// API：Network First
registerRoute(({ url }) => url.pathname.startsWith('/api/'), new NetworkFirst())

// 頁面：Stale While Revalidate
registerRoute(({ request }) => request.mode === 'navigate', new StaleWhileRevalidate())
\`\`\``,
      },
    ],
  },
  {
    slug: 'perf-runtime',
    sections: [
      {
        heading: 'Layout Thrashing 與 requestAnimationFrame',
        content: `**Layout Thrashing（強制同步回流）：**

在同一個 JS 任務中交替讀取和寫入 DOM 幾何屬性，會強制瀏覽器在每次讀取前執行同步 Layout，嚴重影響效能。

**觸發 Forced Reflow 的 DOM 屬性：**

\`offsetWidth\`、\`offsetHeight\`、\`offsetTop\`、\`offsetLeft\`、\`clientWidth\`、\`clientHeight\`、\`scrollTop\`、\`getBoundingClientRect()\`、\`getComputedStyle()\` 等

**修正 Layout Thrashing：**

\`\`\`js
// ❌ 交替讀寫 → Layout Thrashing
elements.forEach(el => {
  const height = el.offsetHeight    // 讀（強制 Layout）
  el.style.height = height + 10 + 'px' // 寫
})

// ✅ 先批量讀，再批量寫
const heights = elements.map(el => el.offsetHeight) // 批量讀
elements.forEach((el, i) => {
  el.style.height = heights[i] + 10 + 'px' // 批量寫
})
\`\`\`

**FastDOM 函式庫：**

\`\`\`js
import fastdom from 'fastdom'

fastdom.measure(() => {
  const height = element.offsetHeight // 讀操作排在 rAF 前
  fastdom.mutate(() => {
    element.style.height = height + 10 + 'px' // 寫操作排在 rAF 後
  })
})
\`\`\`

**requestAnimationFrame 動畫 loop：**

\`\`\`js
function animate(timestamp) {
  const elapsed = timestamp - startTime
  element.style.transform = \`translateX(\${elapsed * 0.1}px)\`

  if (elapsed < 2000) {
    requestAnimationFrame(animate) // 繼續下一幀
  }
}
requestAnimationFrame(animate)
\`\`\`

**GPU 層提升（will-change）：**

\`\`\`css
/* 告知瀏覽器此元素將有動畫，提升為獨立 GPU 層 */
.animated {
  will-change: transform, opacity;
  /* 舊版 Hack：transform: translateZ(0) 或 translate3d(0,0,0) */
}

/* 注意：不要濫用 will-change，每個 GPU 層消耗記憶體 */
/* 動畫結束後移除：element.style.willChange = 'auto' */
\`\`\``,
      },
      {
        heading: 'Web Worker 的使用場景與通訊',
        content: `Web Worker 讓 JS 在獨立執行緒運行，避免阻塞主執行緒（UI 渲染）。適合 CPU 密集型任務：大數據排序、圖片處理、加密運算、複雜計算。

**建立 Web Worker：**

\`\`\`js
// 方法 1：獨立檔案
const worker = new Worker('/worker.js')

// 方法 2：Blob 內聯（不需要額外檔案）
const workerCode = \`
  self.onmessage = (e) => {
    const result = heavyCompute(e.data)
    self.postMessage(result)
  }
\`
const blob = new Blob([workerCode], { type: 'application/javascript' })
const worker = new Worker(URL.createObjectURL(blob))
\`\`\`

**postMessage 通訊：**

\`\`\`js
// main.js
const worker = new Worker('/worker.js')

worker.postMessage({ type: 'COMPUTE', data: largeArray })

worker.onmessage = (e) => {
  console.log('Result:', e.data)
}

// worker.js
self.onmessage = (e) => {
  if (e.data.type === 'COMPUTE') {
    const result = e.data.data.sort() // 不阻塞主執行緒
    self.postMessage(result)
  }
}
\`\`\`

**Transferable Objects（零拷貝傳輸）：**

\`\`\`js
// 預設 postMessage 會複製資料（序列化成本）
// Transferable 傳輸 ArrayBuffer 所有權，零拷貝

const buffer = new ArrayBuffer(1024 * 1024 * 100) // 100MB
// ✅ 轉移所有權，發送後 main thread 無法再使用 buffer
worker.postMessage(buffer, [buffer])
\`\`\`

**Comlink（簡化 Worker 通訊）：**

\`\`\`js
// worker.js
import { expose } from 'comlink'
const api = {
  async processData(data) {
    return heavyCompute(data)
  }
}
expose(api)

// main.js
import { wrap } from 'comlink'
const worker = new Worker('./worker.js', { type: 'module' })
const api = wrap(worker)
const result = await api.processData(largeData) // 像呼叫普通函式
\`\`\``,
      },
      {
        heading: 'Debounce、Throttle 與記憶體管理',
        content: `**Debounce 完整實作（延遲執行，重置計時器）：**

\`\`\`js
function debounce(fn, delay) {
  let timer = null
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

// 使用
const handleSearch = debounce((query) => fetchResults(query), 300)
input.addEventListener('input', (e) => handleSearch(e.target.value))
\`\`\`

**Throttle 完整實作（固定間隔執行）：**

\`\`\`js
function throttle(fn, interval) {
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTime >= interval) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}

// 使用
const handleScroll = throttle(() => updateScrollIndicator(), 100)
window.addEventListener('scroll', handleScroll)
\`\`\`

**React Hook 版本：**

\`\`\`js
function useDebounce(fn, delay) {
  const timerRef = useRef(null)
  return useCallback((...args) => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => fn(...args), delay)
  }, [fn, delay])
}
\`\`\`

**記憶體洩漏的偵測：**

Chrome DevTools Memory 面板 → Heap Snapshot → 拍多次快照 → 比較差異，找到不斷增長的物件。

**常見記憶體洩漏來源：**

\`\`\`js
// ❌ 全域變數意外引用 DOM
window.cachedNode = document.getElementById('big-list')
// 即使 DOM 被移除，cachedNode 仍持有引用

// ✅ WeakMap 不阻止 GC
const cache = new WeakMap()
cache.set(domNode, computedData)
// domNode 被移除後，WeakMap entry 自動清除

// ❌ 忘記清除 event listener
function Component() {
  useEffect(() => {
    window.addEventListener('resize', handler)
    // 忘記 cleanup → 元件卸載後 listener 仍存在
  }, [])
}

// ✅ useEffect cleanup
function Component() {
  useEffect(() => {
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler) // cleanup
  }, [])
}
\`\`\``,
      },
    ],
  },
]

async function main() {
  for (const note of notes) {
    console.log(`處理 ${note.slug}...`)

    // 清除舊資料
    await db
      .delete(schema.topicNoteSections)
      .where(eq(schema.topicNoteSections.slug, note.slug))

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

  console.log(`\n全部完成！共處理 ${notes.length} 個 Topic。`)
  process.exit(0)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
