import { config } from 'dotenv'
config({ path: '.env.local' })
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../lib/db/schema'

const client = neon(process.env.DATABASE_URL!)
const db = drizzle(client, { schema })

const THEME = 'Performance'

const subCategories = [
  { name: '載入優化', order: 1 },
  { name: '效能測量', order: 2 },
  { name: '資源優化', order: 3 },
  { name: 'Runtime 優化', order: 4 },
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
    slug: 'perf-page-load',
    title: '頁面載入效能基礎',
    description: '了解關鍵渲染路徑、DOMContentLoaded vs load 事件差異，以及 FCP、LCP、TTFB 等效能指標。',
    difficulty: 'medium',
    subCategory: '載入優化',
    questions: [
      {
        order: 1,
        question: '瀏覽器渲染頁面的「關鍵渲染路徑（Critical Rendering Path）」正確順序是什麼？',
        options: [
          '下載 HTML → 解析 HTML → 執行 JavaScript → Paint',
          '解析 HTML 建構 DOM → 解析 CSS 建構 CSSOM → 合成 Render Tree → Layout → Paint',
          'DNS → TCP → 下載所有資源 → 一次性渲染',
          'JavaScript 執行 → DOM 建構 → CSSOM → Paint',
        ],
        answer: 1,
        explanation: '關鍵渲染路徑（CRP）是瀏覽器從收到 HTML 到顯示像素的完整流程：1) 解析 HTML 建構 DOM Tree；2) 解析 CSS 建構 CSSOM Tree；3) 合併 DOM + CSSOM 為 Render Tree（只含可見元素）；4) Layout（計算每個元素的位置和大小）；5) Paint（將像素繪製到螢幕）。CSS 和 JavaScript 都可能阻塞此流程，是效能優化的主要目標。',
      },
      {
        order: 2,
        question: 'DOMContentLoaded 和 load 事件的差別是什麼？',
        options: [
          '兩者相同，只是觸發時機相差幾毫秒',
          'DOMContentLoaded：HTML 解析完成、DOM 建構完畢（不需等圖片和 CSS 載入）；load：所有資源（圖片、CSS、字型）全部載入完成',
          'DOMContentLoaded：所有資源載入完成；load：只有 DOM 建構完畢',
          'DOMContentLoaded 只在現代瀏覽器中觸發',
        ],
        answer: 1,
        explanation: 'DOMContentLoaded 在 HTML 完全解析、DOM 建構完成後立即觸發，不等待圖片、CSS 和其他資源下載完成（但會等待同步 JS 執行完畢）。load 事件在頁面所有資源（圖片、CSS、字型、iframe）全部載入後才觸發。實務上，大多數 JS 初始化邏輯監聽 DOMContentLoaded 就夠了，等 load 太慢；analytics 工具有時監聽 load 確保所有資源都統計到。',
      },
      {
        order: 3,
        question: 'FCP（First Contentful Paint）和 LCP（Largest Contentful Paint）分別衡量什麼？',
        options: [
          'FCP：頁面完全載入的時間；LCP：最小元素出現的時間',
          'FCP：任何文字或圖片第一次出現在畫面的時間；LCP：視口內最大的內容元素（圖片、影片縮圖或大段文字）出現的時間',
          'FCP 和 LCP 衡量相同的事情，只是計算方式不同',
          'FCP：JavaScript 執行完成的時間；LCP：CSS 載入完成的時間',
        ],
        answer: 1,
        explanation: 'FCP（First Contentful Paint）測量使用者看到「第一個任何內容」的時間，包含文字、圖片、SVG 等。LCP（Largest Contentful Paint）是 Core Web Vitals 之一，測量視口內「最大內容元素」渲染完成的時間，代表使用者感知頁面「主要內容載入完成」的時刻。良好標準：LCP < 2.5 秒。LCP 元素通常是 hero 圖片或主標題文字。',
      },
      {
        order: 4,
        question: 'TTFB（Time to First Byte）是什麼？哪些因素影響它？',
        options: [
          '第一個 JavaScript 檔案開始執行的時間',
          '從瀏覽器發出 HTTP 請求到收到伺服器第一個回應位元組的時間，反映伺服器回應速度。影響因素：伺服器處理時間、資料庫查詢速度、網路延遲（RTT）、CDN 距離',
          'DNS 解析完成的時間',
          '第一個 DOM 節點建立的時間',
        ],
        answer: 1,
        explanation: 'TTFB（Time to First Byte）衡量網路延遲 + 伺服器處理時間：從瀏覽器發送請求到收到第一個 byte 的時間。良好標準：< 800ms。影響 TTFB 的因素：1) 伺服器端處理時間（資料庫查詢、SSR 渲染）；2) 網路往返時間（RTT），距離越遠越慢；3) CDN 可以大幅降低 TTFB（就近提供快取內容）；4) HTTP/2 或 HTTP/3 改善多路復用。',
      },
      {
        order: 5,
        question: '以下哪個 HTML 標籤用途是「提示瀏覽器提前建立 TCP 連線和 DNS 解析，但不下載資源」？',
        options: [
          '<link rel="preload">',
          '<link rel="prefetch">',
          '<link rel="preconnect"> 和 <link rel="dns-prefetch">',
          '<script defer>',
        ],
        answer: 2,
        explanation: 'preconnect 告訴瀏覽器「我等一下會請求這個 origin 的資源」，立即進行 DNS 解析、TCP 握手和 TLS 協商，當真正請求時連線已就緒。dns-prefetch 只做 DNS 解析（較低成本），適合不確定是否一定用到的 origin。preload 是下載當前頁面需要的特定資源（如字型）；prefetch 是低優先度預下載下個頁面可能需要的資源。常用：<link rel="preconnect" href="https://api.example.com"> 為 API 請求預建連線。',
      },
    ],
  },

  {
    slug: 'perf-resource-loading',
    title: '資源載入策略（CSS / JS 順序）',
    description: '掌握 CSS 放前面、JS 放後面的原理，defer vs async 的差異，以及 preload、prefetch 和 CDN 的使用時機。',
    difficulty: 'medium',
    subCategory: '載入優化',
    questions: [
      {
        order: 1,
        question: '為什麼 CSS <link> 要放在 <head> 最前面？',
        options: [
          'CSS 不影響渲染順序，放哪裡都一樣',
          'CSS 是「渲染阻塞」資源：瀏覽器必須建構完 CSSOM 才能建立 Render Tree 並渲染頁面。CSS 放 head 能讓瀏覽器儘早下載，避免頁面先以無樣式狀態顯示再套用樣式（FOUC：Flash of Unstyled Content）',
          'CSS 放 head 可以減少 HTTP 請求',
          '這只是慣例，現代瀏覽器沒有這個限制',
        ],
        answer: 1,
        explanation: 'CSS 是渲染阻塞資源（Render-blocking resource）：瀏覽器在 CSSOM 建構完成前不會渲染任何內容（避免使用者看到閃爍的無樣式頁面）。把 CSS 放在 <head> 讓瀏覽器儘早開始下載 CSS，與 HTML 解析並行進行。若 CSS 放在 body 末尾，使用者會先看到無樣式的 HTML（FOUC），體驗很差。注意：CSS 不阻塞 DOM 解析，只阻塞渲染。',
      },
      {
        order: 2,
        question: '為什麼傳統上建議把 <script> 放在 </body> 之前？',
        options: [
          'JavaScript 在 body 底部執行速度更快',
          '<script> 是「解析阻塞」資源：瀏覽器遇到 <script> 時暫停 HTML 解析、下載並執行完 JS 才繼續。放 body 底部讓 DOM 先建構完成，使用者更快看到頁面內容，且 JS 可以直接操作已存在的 DOM',
          '瀏覽器無法在 <head> 載入 JavaScript',
          '這只是舊習慣，現代瀏覽器已沒有這個問題',
        ],
        answer: 1,
        explanation: '傳統 <script> 標籤（不含 async/defer）是解析阻塞（Parser-blocking）資源：瀏覽器遇到 <script> 時立即停止 HTML 解析，下載 + 執行完 JS 後才繼續。原因：JS 可能呼叫 document.write() 修改 DOM，瀏覽器必須先執行才知道後面的 HTML 是什麼。放在 </body> 前讓整個 DOM 先建構完成，使用者更快看到頁面。現代做法則是用 defer 屬性，效果更好。',
      },
      {
        order: 3,
        question: '<script defer> 和 <script async> 的主要差別是什麼？',
        options: [
          '兩者完全相同，只是命名不同',
          'defer：非同步下載（不阻塞解析），在 DOMContentLoaded 前、按文件順序執行；async：非同步下載（不阻塞解析），下載完立即執行（不保證順序）。defer 適合有相依性的 script；async 適合獨立 script（如 Google Analytics）',
          'async 讓 script 在 load 事件後執行',
          'defer 只在 Chrome 支援，async 才是標準',
        ],
        answer: 1,
        explanation: 'defer 和 async 都讓 script 非同步下載（不阻塞 HTML 解析）。差別在執行時機：defer 在 HTML 解析完成後、DOMContentLoaded 觸發前執行，且多個 defer script 保持文件順序。async 在下載完成後「立即」執行，打斷當前解析，多個 async 誰先下載完誰先執行（順序不定）。選擇原則：有相依其他 script 或需要操作 DOM → defer；完全獨立（如 analytics）→ async。',
      },
      {
        order: 4,
        question: '本機（self-hosted）載入 JS 和使用 CDN 載入的主要優勢差異是什麼？',
        options: [
          'CDN 只是備份伺服器，速度沒有差異',
          'CDN（Content Delivery Network）的優勢：1) 透過地理上靠近使用者的 Edge Server 降低延遲；2) CDN 有獨立的 HTTP 連線池，不佔用主站的並行連線數；3) 強大的快取和壓縮。本機自托管的優勢：完全控制快取策略（contenthash）、不依賴第三方、隱私資料不外傳',
          '本機載入一定比 CDN 快，因為沒有額外的 DNS 解析',
          'CDN 和本機在現代 HTTP/2 下沒有速度差異',
        ],
        answer: 1,
        explanation: 'CDN 將靜態資源複製到全球多個 Edge Server，使用者從最近的節點取得資源，大幅降低網路延遲（特別是跨洲際的使用者）。CDN 也通常有更好的 peering 和頻寬。缺點：依賴第三方服務（CDN 掛掉會影響你的網站）、第三方 CDN 共享快取的優勢在 Chrome 86+ 後因隔離快取（Partitioned Cache）而消失。自托管可搭配 contenthash 實現精確的長期快取控制，是現代前端的推薦方式。',
      },
      {
        order: 5,
        question: '<link rel="preload"> 和 <link rel="prefetch"> 的差別是什麼？',
        options: [
          '兩者功能完全相同，只是語法不同',
          'preload：告訴瀏覽器「當前頁面即將需要」這個資源，高優先度立即下載（不阻塞解析）；prefetch：告訴瀏覽器「下一個頁面可能需要」這個資源，低優先度在瀏覽器空閒時下載',
          'preload 用於圖片，prefetch 只用於 JavaScript',
          'prefetch 的優先度比 preload 更高',
        ],
        answer: 1,
        explanation: 'preload 用 as 屬性告訴瀏覽器資源的類型（as="font"、as="image"），讓瀏覽器提早發現並高優先度下載當前頁面需要的資源（如字型、hero 圖片、critical JS）。常見用途：<link rel="preload" href="font.woff2" as="font" crossorigin>。prefetch 是暗示瀏覽器「預備未來可能需要的資源」，低優先度在空閒時下載，適合預載下一個路由的 bundle。兩者都不阻塞渲染，只是優先度和時機不同。',
      },
    ],
  },

  {
    slug: 'perf-bundle',
    title: 'Bundle 打包與 Code Splitting',
    description: '了解 Webpack 打包原理、Code Splitting、Tree Shaking 與 Lazy Loading 對初始載入效能的影響。',
    difficulty: 'medium',
    subCategory: '載入優化',
    questions: [
      {
        order: 1,
        question: '將所有 JavaScript 打包成一個大 bundle vs 使用 Code Splitting 分成多個 chunk，主要效能差異是什麼？',
        options: [
          '單一 bundle 永遠比 Code Splitting 快，HTTP 請求數更少',
          'Code Splitting 讓瀏覽器只下載當前頁面需要的 JS，大幅減少初始載入大小；單一 bundle 需要下載整個應用的所有程式碼（包含使用者從未訪問的頁面）才能執行',
          'Code Splitting 只在伺服器端渲染中有效',
          '兩種方式在效能上完全相同，只是組織程式碼的風格不同',
        ],
        answer: 1,
        explanation: 'Code Splitting 是現代前端效能優化的核心策略。若打包成單一 bundle，使用者訪問首頁時需要下載整個應用（包含設定頁、管理後台、所有路由）的程式碼，初始 JS 可能達數 MB。Code Splitting 把 bundle 切分為多個 chunk，首頁只下載首頁需要的程式碼，其他路由按需下載。React Router + React.lazy、Next.js 自動 per-page splitting 都是常見實作。HTTP/2 的多路復用讓多個小 chunk 的 overhead 大幅降低。',
      },
      {
        order: 2,
        question: 'Tree Shaking 是什麼？它需要什麼前提才能生效？',
        options: [
          '透過 Virtual DOM diffing 移除不必要的 DOM 渲染',
          'Tree Shaking 在打包時靜態分析移除「未被使用的程式碼（Dead Code）」，縮小 bundle 大小。前提：必須使用 ES Module（import/export）語法，讓 bundler 可以靜態分析依賴關係；CommonJS（require）是動態的，無法靜態分析，tree shaking 無效',
          'Tree Shaking 是執行時動態移除未使用程式碼的技術',
          'Tree Shaking 只在 TypeScript 中有效，純 JavaScript 無法使用',
        ],
        answer: 1,
        explanation: 'Tree Shaking 源自「搖掉枯死的葉子」的比喻：bundler（Webpack、Rollup）靜態分析 ES Module 的 import/export 關係，找出哪些 export 從未被任何地方 import，在打包時移除這些程式碼。前提：1) 使用 ES Module（import { xxx } from ...）；2) 被 import 的函式庫也要以 ESM 發布（package.json 的 module 欄位）；3) 沒有 side effects（或正確設定 sideEffects 欄位）。Webpack production mode 預設開啟 tree shaking。',
      },
      {
        order: 3,
        question: 'React 中使用 React.lazy + dynamic import 的主要目的是什麼？',
        options: [
          '讓元件可以在 Node.js 後端渲染',
          '將元件的 JS 程式碼分割成獨立的 chunk（Code Splitting），只在元件真正需要渲染時才動態下載對應的 JS 檔案，減少首次載入的 bundle 大小',
          'React.lazy 讓元件可以在多個分頁間共享狀態',
          'dynamic import 是普通 import 的語法糖，沒有效能差異',
        ],
        answer: 1,
        explanation: '使用方式：const MyPage = React.lazy(() => import("./MyPage"))，搭配 <Suspense fallback={<Loading />}>。Webpack 看到 dynamic import 會自動建立獨立的 chunk 檔案，瀏覽器只在渲染到 Suspense 邊界內的元件時才下載對應 chunk。常見應用：路由層級的 code splitting（每個頁面獨立 chunk）、重型元件（圖表庫、編輯器）按需載入。Next.js 的 next/dynamic 是相同概念的封裝。',
      },
      {
        order: 4,
        question: 'Webpack 打包輸出的 filename 中加入 [contenthash] 的目的是什麼？',
        options: [
          '讓每次 build 的檔名都不同，避免同名衝突',
          '根據檔案「內容」產生 hash：內容沒變 → hash 不變 → 瀏覽器持續使用長期快取；內容改變 → hash 改變 → 瀏覽器視為新資源立即下載。這讓靜態資源可以設定 Cache-Control: max-age=31536000（一年）的長期快取，同時部署新版本時使用者自動取得最新檔案',
          'contenthash 是安全機制，防止未授權修改',
          'contenthash 讓多個 JS 檔案合併成一個',
        ],
        answer: 1,
        explanation: 'contenthash 是現代前端快取策略的關鍵：main.abc123.js → 內容不變，瀏覽器使用快取（零網路請求）；修改程式碼後 → main.def456.js → 新 URL，瀏覽器下載新版本。這讓你可以大膽設定極長的 Cache-Control 過期時間（如一年），又不擔心使用者看到舊版本。注意：vendor bundle（第三方套件）通常變動頻率低於應用程式碼，應分開打包各自的 contenthash，讓 vendor bundle 長期快取而不因應用更新失效。',
      },
      {
        order: 5,
        question: '以下哪個組合可以最有效地減小 JavaScript bundle 大小？',
        options: [
          '改用 TypeScript 撰寫程式碼',
          'Minification（移除空白、縮短變數名）+ Gzip/Brotli 壓縮傳輸 + 選用輕量替代函式庫（如 day.js 取代 moment.js，僅 2KB vs 67KB）+ 避免 import 整個函式庫只用一個函式（如 import { debounce } from "lodash" vs import _ from "lodash"）',
          '把所有程式碼寫在單一函式中',
          '使用更多 console.log 幫助 tree shaking 識別未使用的程式碼',
        ],
        answer: 1,
        explanation: '最有效的 bundle 減小策略：1) Minification：Terser 移除空白和縮短名稱，通常可減小 30-50%；2) Gzip/Brotli 傳輸壓縮：JS 文字可再減小 70-90%；3) 依賴審計：用 bundlephobia.com 檢查每個套件大小，moment.js（67KB gzipped）→ day.js（2KB）；4) 具名 import（Named Import）讓 tree shaking 有效（import { debounce } from "lodash-es" 比 import _ from "lodash" 小很多）；5) Dynamic Import 按需載入。',
      },
    ],
  },

  {
    slug: 'perf-large-data',
    title: '大量資料處理策略',
    description: '應對 5MB+ 大型資料的前端處理方案，包含資料壓縮、分頁、虛擬捲動與串流載入。',
    difficulty: 'hard',
    subCategory: '載入優化',
    questions: [
      {
        order: 1,
        question: '後端回傳 5MB 的 JSON 文字資料，哪個策略「最能直接縮短使用者等待時間」？',
        options: [
          '換一個效能更好的前端框架',
          '要求後端開啟 Gzip 或 Brotli 壓縮：JSON 文字通常可以壓縮 70-90%，5MB 可能變成 300KB-1MB 傳輸；同時考慮 API 分頁或只回傳當前需要的欄位（GraphQL 或後端 projection），從根本減少資料量',
          '把資料存在 localStorage 讓使用者第二次開啟更快',
          '用 Web Worker 在背景下載，讓 UI 不阻塞',
        ],
        answer: 1,
        explanation: '縮短 5MB 資料等待時間的策略，優先順序：1) 傳輸壓縮（Gzip/Brotli）：最直接，後端設定，前端零改動，效果最大（5MB → ~0.5MB）；2) API 設計優化：分頁（Pagination）只回傳當前頁、GraphQL 只請求需要的欄位、後端 JSON 精簡（移除冗餘欄位）；3) 快取：同樣的查詢結果用 HTTP Cache 或 IndexedDB 快取；4) 串流（Streaming）：讓使用者更快看到第一筆資料。Web Worker 不減少下載時間，只讓 UI 不被解析 JSON 阻塞。',
      },
      {
        order: 2,
        question: '需要在前端渲染 10,000 筆資料列表，哪個技術可以避免建立 10,000 個 DOM 節點導致的效能問題？',
        options: [
          '用 display: none 隱藏不可見的項目，只顯示可見的',
          '虛擬捲動（Virtual Scrolling / Windowing）：只渲染可視區域內的少量 DOM 節點（如 20-50 個），使用者捲動時動態替換內容，DOM 節點數始終維持在少量，記憶體和渲染效能大幅提升',
          '用 setTimeout 分批渲染，每批插入 100 個節點',
          '把 10,000 筆資料存在 JavaScript 陣列，需要時再 render',
        ],
        answer: 1,
        explanation: '建立 10,000 個 DOM 節點的問題：每個 DOM 節點佔用記憶體、每次 layout 重算、scroll 事件處理都極慢，滾動會卡頓。虛擬捲動的核心思路：用一個「容器」設定總高度（模擬所有項目存在），只在容器的可視區域渲染少量真實 DOM，捲動時根據 scrollTop 計算應該顯示哪些項目並更新。常用函式庫：react-window（輕量）、react-virtualized（功能豐富）、@tanstack/virtual（最新）。顯示 1000+ 項目時應考慮使用。',
      },
      {
        order: 3,
        question: '「分頁（Pagination）」和「無限捲動（Infinite Scroll）」各有什麼主要差異？',
        options: [
          '分頁和無限捲動的效能完全相同，只是 UI 呈現不同',
          '分頁：每次載入固定數量，使用者明確切換頁面；優點：可直接跳頁、footer 可見、DOM 節點固定；缺點：需主動點擊。無限捲動：捲到底部自動載入更多；優點：體驗流暢；缺點：DOM 節點累積（需配合虛擬捲動）、難以跳到特定位置、SEO 較差、footer 難以到達',
          '無限捲動永遠比分頁的效能好',
          '分頁只適合桌機，無限捲動只適合手機',
        ],
        answer: 1,
        explanation: '選擇分頁 vs 無限捲動的考量：資料型態（有序、需要定位 → 分頁；串流型如社群動態 → 無限捲動）；SEO 需求（分頁每頁有獨立 URL，搜尋引擎可索引；無限捲動 SEO 較差）；UX 情境（電商搜尋結果 → 分頁；新聞 feed → 無限捲動）。無限捲動若不配合虛擬捲動，大量捲動後頁面 DOM 節點暴增會導致效能下降。現代的「載入更多」按鈕是兩者的折衷方案。',
      },
      {
        order: 4,
        question: '使用 HTTP Streaming（Fetch API ReadableStream 或 Server-Sent Events）處理大量資料的主要優勢是什麼？',
        options: [
          'Streaming 讓資料傳輸更安全',
          '不需要等待所有資料下載完才開始處理：資料分批到達，前端可以逐步渲染，使用者更快看到第一筆資料；特別適合 AI 生成內容（逐字輸出）、大型報表（邊下載邊顯示）、實時資料',
          'Streaming 自動對資料做 Gzip 壓縮',
          'Streaming 只適合影片，不適合 JSON 文字資料',
        ],
        answer: 1,
        explanation: '傳統 fetch → 等待全部 → 解析 → 渲染，使用者等待整個過程結束。Streaming 讓資料流式傳輸：const response = await fetch(url); const reader = response.body.getReader()，逐塊（chunk）讀取並處理。應用場景：1) AI 聊天（ChatGPT 式逐字輸出）；2) 大型 CSV/JSON 報表逐行解析；3) 實時 log 串流。Server-Sent Events（EventSource）適合伺服器主動推送的場景。對於 5MB JSON，Streaming 讓使用者在資料還在下載時就能看到部分結果。',
      },
      {
        order: 5,
        question: '同一份大量資料需要多次存取，哪個快取方案最適合「避免重複的網路請求」？',
        options: [
          '每次都重新從伺服器下載確保最新資料',
          'SWR（Stale-While-Revalidate）模式：立即回傳快取的舊資料（使用者馬上看到內容），同時在背景發請求驗證並更新快取。搭配 HTTP Cache-Control 設定適當過期時間，不常變動的資料用 IndexedDB 長期儲存',
          '把所有資料存在 React state（父元件）透過 props 傳遞',
          '用 URL query string 傳遞已下載的資料給其他頁面',
        ],
        answer: 1,
        explanation: '避免重複請求的快取層次：1) HTTP Cache（Cache-Control: max-age）：對靜態或不常變動的 API 最有效，瀏覽器自動處理；2) SWR/React Query 的記憶體快取：同一個 key 在組件間共享請求結果，去除重複請求；3) IndexedDB：持久化跨頁面、跨 session 的大量資料；4) Service Worker Cache：離線支援和完全自訂的快取策略。SWR 的 stale-while-revalidate 策略特別適合「資料不是每秒都在變但也需要保持一定新鮮度」的場景。',
      },
    ],
  },
]

async function seed() {
  console.log(`新增 Performance 主題子類別...`)
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

  console.log(`\n新增 ${topics.length} 個 Performance 主題及題目...`)
  for (const topic of topics) {
    const [inserted] = await db
      .insert(schema.topics)
      .values({
        slug: topic.slug,
        title: topic.title,
        description: topic.description,
        category: 'Performance',
        difficulty: topic.difficulty,
        theme: THEME,
        subCategory: topic.subCategory,
      })
      .onConflictDoUpdate({
        target: schema.topics.slug,
        set: {
          title: topic.title,
          description: topic.description,
          category: 'Performance',
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

  console.log('\n✅ Performance 主題建立完成')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
