import { config } from 'dotenv'
config({ path: '.env.local' })
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../lib/db/schema'

const client = neon(process.env.DATABASE_URL!)
const db = drizzle(client, { schema })

const THEME = 'Next.js'

const subCategories = [
  { name: '渲染模式', order: 1 },
  { name: 'App Router', order: 2 },
  { name: 'Server Components', order: 3 },
  { name: '資料獲取與快取', order: 4 },
  { name: '進階功能', order: 5 },
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
    slug: 'nextjs-rendering-modes',
    title: 'SSR / SSG / ISR / CSR 比較',
    description: '掌握 Next.js 四種渲染模式的差異、適用場景，以及 App Router 中的靜態與動態渲染判斷規則。',
    difficulty: 'medium',
    subCategory: '渲染模式',
    questions: [
      {
        order: 1,
        question: 'SSR、SSG、ISR、CSR 四種渲染模式的核心差異是什麼？',
        options: [
          'SSR：每次請求時在伺服器產生 HTML；SSG：建置時預先產生靜態 HTML；ISR：建置時產生 + 背景定期重新生成；CSR：瀏覽器下載空殼 HTML 後用 JS 渲染',
          'SSR 和 SSG 完全相同，只是執行時機不同；ISR 是 CSR 的進階版本',
          'CSR 效能最好，SSR 效能最差；SSG 只適合文字內容',
          'ISR 是 SSR 和 CSR 的混合；SSG 必須手動觸發更新',
        ],
        answer: 0,
        explanation: '四種模式的核心差異在「HTML 何時產生」：SSR（Server-Side Rendering）每次用戶請求時伺服器即時產生 HTML，資料永遠最新但 TTFB 較高；SSG（Static Site Generation）在 build time 預先生成所有頁面 HTML，存放在 CDN，回應極快但資料可能過時；ISR（Incremental Static Regeneration）是 SSG + 背景定時重生成，兼顧速度和新鮮度；CSR（Client-Side Rendering）伺服器只送空 HTML，瀏覽器下載 JS 後才渲染，SEO 差但互動豐富。',
      },
      {
        order: 2,
        question: '以下場景應選擇哪種渲染模式？\nA. 公司官網的「關於我們」頁面\nB. 電商的即時庫存商品頁\nC. 新聞網站（每小時更新一次）\nD. 使用者登入後的個人資料頁',
        options: [
          'A: CSR；B: SSG；C: SSR；D: ISR',
          'A: SSG；B: SSR；C: ISR（revalidate: 3600）；D: SSR（含認證）',
          'A: SSR；B: ISR；C: CSR；D: SSG',
          '全部用 SSR，最簡單也最安全',
        ],
        answer: 1,
        explanation: '選擇依據：A) 關於我們頁面極少更新 → SSG（build time 產生，CDN 快取，最快）；B) 庫存即時變動 → SSR（每次請求都取最新庫存，不能用快取）；C) 每小時更新 → ISR（revalidate: 3600，背景定期重生成，使用者感受接近 SSG 的速度）；D) 個人資料因用戶而異且需要驗證 → SSR（搭配 cookies 驗證，動態生成）。全用 SSR 雖然簡單，但大量靜態頁面會造成不必要的伺服器負擔和較高 TTFB。',
      },
      {
        order: 3,
        question: 'App Router 中，一個 Server Component 在什麼情況下會從「靜態渲染」變成「動態渲染」？',
        options: [
          '只要使用了 useState 就變成動態渲染',
          '使用動態函式（cookies()、headers()、searchParams）、fetch 設定 cache: "no-store"、或路由含有動態段（[id]）且未用 generateStaticParams 預先產生時',
          '只要使用了 useEffect 就變成動態渲染',
          '所有 Server Component 預設都是動態渲染',
        ],
        answer: 1,
        explanation: 'App Router 預設嘗試靜態渲染，遇到以下情況自動切換為動態渲染（每次請求都重新執行）：1) 呼叫動態函式：cookies()、headers()、searchParams（因為這些值每個請求都不同）；2) fetch 設定 cache: "no-store" 或 revalidate: 0（明確要求不快取）；3) 動態路由段（[id]）未用 generateStaticParams 預先列舉。動態渲染等同 SSR，靜態渲染等同 SSG。',
      },
      {
        order: 4,
        question: 'Next.js Pages Router 的 getStaticProps 和 App Router Server Component 直接 fetch 的主要差異是什麼？',
        options: [
          '兩者完全相同，只是語法不同',
          'getStaticProps 是在 build time 執行的特殊函式，只適用於頁面級別；App Router Server Component 中可以直接在任何元件（包含巢狀元件）使用 async/await fetch，資料獲取更靈活，不限於頁面層級',
          'getStaticProps 支援增量靜態再生，App Router 不支援',
          'App Router 不能做靜態生成，只能做 SSR',
        ],
        answer: 1,
        explanation: 'Pages Router 的 getStaticProps 是框架特定的 API，只能在頁面元件的匯出函式中使用，資料從頁面往下透過 props 傳遞。App Router 顛覆這個模式：任何 Server Component（不論層級深淺）都可以直接 async/await 資料，不需要透過 props 傳遞。這讓資料獲取更接近使用資料的位置（co-location），減少 prop drilling。App Router 同樣支援靜態和動態渲染，用 fetch 的 cache 選項控制。',
      },
      {
        order: 5,
        question: '以下關於 CSR（Client-Side Rendering）的敘述，哪個是正確的？',
        options: [
          'CSR 是 Next.js 的預設渲染方式，所有頁面都是 CSR',
          'CSR 的 SEO 通常較差（爬蟲可能無法等待 JS 執行），首次載入需要下載並執行 JS 才顯示內容（可能有白屏）。在 Next.js 中，CSR 通常指在 Client Component 中用 useEffect + fetch 或 SWR/React Query 取得資料',
          '使用 "use client" 指令的元件一定是 CSR 渲染模式',
          'CSR 不能和 SSR 在同一個 Next.js 應用中使用',
        ],
        answer: 1,
        explanation: 'CSR 的特點：1) SEO 問題：搜尋引擎爬蟲通常不等待 JS 執行（雖然 Googlebot 已能執行 JS，但有延遲），動態內容可能無法被索引；2) 首次白屏：頁面先顯示 loading 狀態，資料到來才渲染；3) 適合場景：使用者登入後的儀表板（不需要 SEO）、即時資料（WebSocket）、高互動性的 SPA 功能。在 Next.js 中，"use client" 讓元件在客戶端執行，但初始 HTML 仍由 SSR/SSG 提供（不是完全的 CSR）。',
      },
    ],
  },

  {
    slug: 'nextjs-ssr-deep',
    title: 'Server-Side Rendering 深入解析',
    description: '深入理解 SSR 的完整流程、Hydration 機制、常見問題，以及 SSR 對 SEO 和效能的實際影響。',
    difficulty: 'medium',
    subCategory: '渲染模式',
    questions: [
      {
        order: 1,
        question: 'Next.js SSR 的完整流程是什麼？',
        options: [
          '瀏覽器下載 HTML → 執行 JS → 發送 API 請求 → 渲染內容',
          '用戶請求 → 伺服器執行資料獲取（資料庫/API）→ 產生 HTML 字串 → 回傳給瀏覽器（含完整內容）→ 瀏覽器顯示 HTML → 下載 JS → Hydration（為靜態 HTML 附加事件監聽器）',
          '用戶請求 → CDN 回傳快取 HTML → 執行 JS → 渲染',
          '伺服器送空殼 HTML → 瀏覽器執行 JS → 發 API → 渲染內容',
        ],
        answer: 1,
        explanation: 'SSR 完整流程：1) 用戶請求到達 Next.js 伺服器；2) 伺服器執行資料獲取（資料庫查詢、API 呼叫）；3) 將 React 元件渲染為 HTML 字串（renderToString / renderToPipeableStream）；4) 回傳完整 HTML（含資料）給瀏覽器；5) 瀏覽器顯示 HTML（使用者立即看到內容，FCP 快）；6) 下載 JavaScript；7) Hydration：React 接管靜態 HTML，附加事件監聽器，讓頁面可互動（TTI）。這就是為什麼 SSR 的 FCP 比 CSR 快，但 TTI 可能差不多。',
      },
      {
        order: 2,
        question: 'Hydration 是什麼？什麼是 Hydration Mismatch？',
        options: [
          'Hydration 是圖片的懶加載技術；Mismatch 是圖片尺寸不符的錯誤',
          'Hydration 是 React 將伺服器端渲染的靜態 HTML「接管」並附加事件監聽器的過程。Hydration Mismatch 發生在伺服器渲染的 HTML 和客戶端 React 渲染的結果不一致時，React 會報警告並重新渲染',
          'Hydration 是快取資料的水化過程；Mismatch 是 API 版本不符',
          'Hydration 是 TypeScript 的型別推斷機制',
        ],
        answer: 1,
        explanation: 'Hydration 讓 SSR 頁面從「靜態 HTML」變成「可互動的 React 應用」。React 遍歷伺服器送來的 DOM，將其與客戶端的 React 元件樹「對比」，附加事件監聽器。Hydration Mismatch 的常見原因：1) 使用 Date.now() 或 Math.random() 在伺服器和客戶端產生不同值；2) 使用 typeof window !== "undefined" 判斷，導致瀏覽器特有的邏輯在伺服器不執行；3) 瀏覽器插件（如廣告屏蔽器）修改 DOM。修復：確保伺服器和客戶端的渲染結果完全一致，或用 suppressHydrationWarning。',
      },
      {
        order: 3,
        question: 'SSR 對 SEO 的主要優勢是什麼？它能完全解決 SEO 問題嗎？',
        options: [
          'SSR 完全解決所有 SEO 問題，使用 SSR 的網站一定排名更高',
          'SSR 讓搜尋引擎爬蟲在不執行 JavaScript 的情況下即可獲得完整的頁面內容（HTML 已含資料），有利於索引。但 SSR 不能保證排名，還需要考慮內容品質、Core Web Vitals、連結等因素',
          'SSR 對 SEO 沒有幫助，Google 可以完整執行任何 JavaScript',
          'SSR 只對 Bing 有幫助，Google 可以完整執行 JavaScript 不需要 SSR',
        ],
        answer: 1,
        explanation: 'SSR 對 SEO 的幫助：爬蟲收到完整 HTML 可直接解析頁面內容，無需等待 JS 執行。雖然 Googlebot 能執行 JavaScript（做兩階段爬取），但 JS 渲染有排程延遲，SSR 更可靠。SSR 的 SEO 限制：1) 排名還受內容品質、Page Experience（Core Web Vitals）、反向連結等影響；2) SSR 較高的 TTFB 可能影響 LCP；3) 對於純使用者資料（儀表板），SEO 本就不是優先考量。最佳實踐：需要 SEO 的頁面用 SSG 或 ISR（TTFB 最低），只有真正需要動態資料的頁面用 SSR。',
      },
      {
        order: 4,
        question: '為什麼 SSR 頁面的 Time to First Byte（TTFB）通常比 SSG 高？',
        options: [
          '因為 SSR 使用比 SSG 更慢的伺服器',
          'SSR 每次請求都需要在伺服器執行資料獲取（資料庫查詢、API 呼叫）和 React 渲染，這些操作需要時間；SSG 的 HTML 在 build time 已預先產生，存放在 CDN，請求時直接回傳靜態檔案（幾乎無延遲）',
          'SSR 的回應需要 Gzip 壓縮，比 SSG 慢',
          'SSG 使用 HTTP/2 而 SSR 只能用 HTTP/1.1',
        ],
        answer: 1,
        explanation: 'TTFB 差異根因：SSG 的 HTML 已在 CDN 邊緣節點快取，用戶請求幾乎立即回應（< 50ms 常見）。SSR 必須：1) 請求路由到伺服器（可能跨區域）；2) 伺服器執行 getServerSideProps 或 Server Component 的資料獲取（資料庫/API 可能 50-500ms）；3) React 渲染 HTML（通常 5-50ms）；4) 回傳。因此 SSR 的 TTFB 可能達 200-1000ms。優化 SSR 的 TTFB：使用 Streaming（首字節更快）、在邊緣執行（Edge Runtime）、快取中間層（Redis）。',
      },
      {
        order: 5,
        question: 'Next.js App Router 中的 Streaming 如何改善 SSR 的使用者體驗？',
        options: [
          'Streaming 讓多個 API 請求並行執行，速度加倍',
          'Streaming 讓伺服器在完整 HTML 產生前就開始傳送已準備好的部分（如 shell），搭配 Suspense 讓慢的部分先顯示 loading placeholder，快的部分先互動，避免用戶等待整個頁面渲染完成',
          'Streaming 只適用於影片和音頻內容',
          'Streaming 讓 JavaScript bundle 分批下載',
        ],
        answer: 1,
        explanation: 'App Router 預設使用 React 18 的 renderToPipeableStream 實現 HTML Streaming。傳統 SSR 需等待所有資料獲取完成才送出 HTML（全有或全無）。Streaming 讓伺服器逐步傳送 HTML chunks：1) 先傳送頁面 shell（header、sidebar、已完成的部分）；2) 慢速的資料獲取位置用 Suspense 包裹，顯示 fallback；3) 資料準備好後，伺服器傳送對應的 HTML chunk 替換 fallback。效果：FCP 更快（用戶先看到部分內容），慢的部分不阻塞快的部分。這就是 Next.js loading.tsx 的底層機制。',
      },
    ],
  },

  {
    slug: 'nextjs-isr',
    title: 'ISR 增量靜態再生與 Revalidation',
    description: '深入了解 ISR 的 stale-while-revalidate 機制、時間型與按需型重新驗證，以及 generateStaticParams 的使用。',
    difficulty: 'hard',
    subCategory: '渲染模式',
    questions: [
      {
        order: 1,
        question: 'ISR 的 revalidate: 60 設定時，當快取過期後第一個請求的行為是什麼？',
        options: [
          '第一個請求需要等待伺服器重新生成頁面，等待完成後才回傳新頁面',
          '第一個請求立即收到「舊的快取頁面」（stale），同時觸發背景重新生成。下一個請求才會看到新頁面（stale-while-revalidate 行為）',
          '第一個請求會收到 503 錯誤，等待重新生成',
          '快取過期後所有靜態頁面都會立即刪除重建',
        ],
        answer: 1,
        explanation: 'ISR 的 stale-while-revalidate 語義：1) build time 生成靜態頁面（s-maxage: 60）；2) 60 秒內的請求：直接回傳快取（極快，CDN 命中）；3) 60 秒後的第一個請求：仍回傳舊頁面（stale），同時在背景觸發重新生成；4) 重新生成完成後，後續請求才得到新頁面。這讓 ISR 的回應永遠是快速的（不需要等待重新生成），代價是頁面可能比 revalidate 時間多過期一個請求週期。',
      },
      {
        order: 2,
        question: 'On-demand Revalidation（revalidatePath / revalidateTag）和時間型 ISR 的差異是什麼？最適合的使用場景是？',
        options: [
          '兩者完全相同，只是 API 名稱不同',
          '時間型 ISR：到達 revalidate 時間後自動重新生成，適合「更新頻率可預測」的內容（如每小時更新的新聞）；On-demand Revalidation：在特定事件觸發時（CMS 發布、資料庫更新）呼叫 revalidatePath/revalidateTag 立即使快取失效，適合「更新時機不固定」的內容（如部落格文章更新）',
          'On-demand Revalidation 只能在客戶端使用',
          '時間型 ISR 不支援 App Router，只有 Pages Router 支援',
        ],
        answer: 1,
        explanation: 'On-demand Revalidation 的工作流程：CMS 更新文章 → 呼叫 Webhook → Next.js API Route 執行 revalidatePath("/blog/my-post") 或 revalidateTag("blog") → 對應頁面的快取立即失效 → 下一個請求觸發重新生成。優勢：不必等待定時器，內容更新立即反映；不浪費伺服器資源重生成未更新的頁面。revalidateTag 搭配 fetch 的 tags 選項（next: { tags: ["blog"] }），可以同時失效多個頁面的快取。',
      },
      {
        order: 3,
        question: 'App Router 中，generateStaticParams 的作用是什麼？',
        options: [
          '用來產生頁面的靜態 CSS 樣式',
          '在動態路由（如 [slug]）中，在 build time 預先指定所有要靜態生成的路徑參數，讓這些頁面在 build time 生成靜態 HTML，未在清單中的路徑則按需生成（或 404）',
          'generateStaticParams 只在 Pages Router 中使用',
          '用來設定動態路由的型別定義',
        ],
        answer: 1,
        explanation: 'generateStaticParams 相當於 Pages Router 的 getStaticPaths。使用方式：export async function generateStaticParams() { const posts = await getPosts(); return posts.map(p => ({ slug: p.slug })) }。設定 dynamicParams：true（預設）：未在清單中的路徑按需生成並快取；false：未在清單中的路徑回傳 404。搭配 revalidate 可以做到 ISR：build time 生成清單頁面 + 新文章按需生成並快取 + 定期重新驗證。',
      },
      {
        order: 4,
        question: '以下 fetch 呼叫中，哪個設定會讓 Next.js 使用 ISR 行為（時間型重新驗證）？',
        options: [
          "fetch(url, { cache: 'no-store' })",
          "fetch(url, { next: { revalidate: 3600 } })",
          "fetch(url, { cache: 'force-cache' })",
          "fetch(url, { method: 'GET', keepalive: true })",
        ],
        answer: 1,
        explanation: "next: { revalidate: 3600 } 告訴 Next.js 的 Data Cache 每 3600 秒（1 小時）重新驗證此資料。cache: 'force-cache'（預設）永久快取直到 revalidate 或手動失效；cache: 'no-store' 每次請求都跳過快取（等同動態渲染）；revalidate: 0 等同 no-store。在頁面級別設定 export const revalidate = 3600 可以讓整個頁面所有 fetch 使用相同的 revalidate 時間。",
      },
      {
        order: 5,
        question: 'ISR 相較於 SSR 的主要優勢和限制是什麼？',
        options: [
          'ISR 只適合小型網站，大型網站必須用 SSR',
          'ISR 優勢：頁面預先生成放在 CDN（回應速度接近 SSG），伺服器負擔遠低於 SSR；限制：資料可能過時（最多過期 revalidate 時間 + 一個請求週期），不適合需要每次請求都最新的動態資料（如庫存量、使用者資料）',
          'ISR 比 SSR 和 SSG 都慢，只適合測試環境',
          'ISR 不支援資料庫查詢，只能使用靜態文字',
        ],
        answer: 1,
        explanation: 'ISR 的黃金比例：速度接近 SSG（CDN 快取）+ 資料新鮮度優於純 SSG（定期更新）+ 伺服器負擔遠低於 SSR（只在快取過期時重生成，不是每次請求）。ISR 不適用的場景：1) 庫存量（需要即時準確）；2) 個人化內容（每個用戶不同）；3) 需要 cookies/headers 的動態內容。ISR 最適合：部落格文章、產品描述、行銷頁面、頻道首頁等「有週期性更新但不需即時」的內容。',
      },
    ],
  },

  {
    slug: 'nextjs-app-router',
    title: 'App Router 核心概念',
    description: '掌握 App Router 的特殊檔案（page、layout、loading、error、not-found）、巢狀 Layout 機制，以及 Metadata API 的使用。',
    difficulty: 'medium',
    subCategory: 'App Router',
    questions: [
      {
        order: 1,
        question: 'App Router 中，以下特殊檔案各自的作用是什麼？page.tsx、layout.tsx、loading.tsx、error.tsx、not-found.tsx',
        options: [
          '全都是 React 元件，沒有特殊含義，只是慣例命名',
          'page.tsx：路由對應的頁面 UI；layout.tsx：包裹子路由的共享框架（導覽列、側欄），多次切換路由不重新 mount；loading.tsx：資料載入時的 Suspense fallback；error.tsx：捕捉該路由子樹的錯誤邊界；not-found.tsx：notFound() 觸發時的 404 UI',
          'layout.tsx 只能在根目錄使用，不能巢狀',
          'loading.tsx 只在 SSR 頁面有效，SSG 不顯示 loading',
        ],
        answer: 1,
        explanation: 'App Router 的檔案慣例（File Conventions）：page.tsx 讓路由「公開可訪問」（沒有 page.tsx 就不是路由）；layout.tsx 在路由切換時「保持存在、不重新 mount」，適合放不需要重新渲染的共享 UI（如已登入的頁首）；loading.tsx 自動用 React Suspense 包裹同目錄的 page.tsx，在 Server Component 資料獲取期間顯示 fallback；error.tsx 自動包裹為 Error Boundary，捕捉渲染錯誤（需要 "use client"）；not-found.tsx 在呼叫 notFound() 函式時顯示。',
      },
      {
        order: 2,
        question: 'layout.tsx 和 template.tsx 的差別是什麼？什麼時候應該用 template.tsx？',
        options: [
          '兩者完全相同，template.tsx 是 layout.tsx 的別名',
          'layout.tsx：在路由切換時「保持存在」，狀態不重置，不重新 mount；template.tsx：每次路由切換都「重新 mount」，狀態重置。適合用 template 的情況：需要在路由切換時觸發 CSS 進場動畫、需要重置 useEffect、需要重新執行 logging',
          'template.tsx 只能在頁面級別使用，layout.tsx 只能在根目錄',
          'template.tsx 比 layout.tsx 效能更好，應優先使用',
        ],
        answer: 1,
        explanation: 'layout.tsx 的跨路由持久性是其核心特點：在 /dashboard/settings 和 /dashboard/profile 之間切換時，dashboard 的 layout 不會重新 mount（不執行 useEffect，不重置 state）。這讓共享 UI（如側邊欄）不因路由切換而閃爍。template.tsx 則每次路由切換都重新 mount（等同卸載後重新掛載），適合：1) 需要 CSS 進場/離場動畫（每次都重新觸發）；2) 需要在頁面進入時觸發 analytics 事件；3) 需要重置下方元件的 state。',
      },
      {
        order: 3,
        question: 'loading.tsx 的底層機制是什麼？它如何與 React Suspense 配合？',
        options: [
          'loading.tsx 是一個普通的 React 元件，放在 body 之前渲染',
          'loading.tsx 自動將同目錄的 page.tsx 包在 <Suspense> 中，page.tsx 的 async Server Component 在等待資料時，React Suspense 顯示 loading.tsx 的內容作為 fallback。配合 HTML Streaming，loading 狀態可以立即顯示，不需等待所有資料',
          'loading.tsx 需要手動在 page.tsx 中 import 和使用',
          'loading.tsx 只對 CSR 頁面有效，SSR 頁面不顯示',
        ],
        answer: 1,
        explanation: 'App Router 的 loading.tsx 是語法糖：相當於自動執行 <Suspense fallback={<LoadingFile />}><Page /></Suspense>。由於 App Router 使用 HTML Streaming，流程是：1) 伺服器立即傳送 loading.tsx 的 HTML（用戶馬上看到 loading 狀態）；2) Server Component 在背景完成資料獲取；3) 資料就緒，伺服器傳送 page.tsx 的 HTML chunk，替換 loading 狀態。這讓每個路由都有即時的 loading 反饋，不需要等待整個頁面。也可以在 page.tsx 內手動放多個 Suspense 做更細粒度的 loading。',
      },
      {
        order: 4,
        question: 'error.tsx 可以捕捉哪些錯誤？有哪些情況它「不能」捕捉？',
        options: [
          'error.tsx 捕捉所有錯誤，包含 layout 和 not-found',
          'error.tsx 捕捉同目錄和子目錄的 page.tsx 在渲染或資料獲取時的錯誤。不能捕捉：同層的 layout.tsx 的錯誤（需要在上層 error.tsx 捕捉）、根目錄 layout.tsx 的錯誤（需要 global-error.tsx）、Server Action 的錯誤（需要在 Server Action 中 try/catch）',
          'error.tsx 只能捕捉網路請求錯誤',
          'error.tsx 不需要 "use client"，可以是 Server Component',
        ],
        answer: 1,
        explanation: 'error.tsx 的邊界範圍：它包裹同目錄的 page.tsx 和所有子路由，但不包裹同目錄的 layout.tsx（因為 error 在 layout 內側）。這意味著若 layout.tsx 本身有錯誤，需要上一層的 error.tsx 才能捕捉。根目錄的 layout 錯誤需要 app/global-error.tsx（它取代整個根 layout）。error.tsx 必須是 "use client"，因為它使用 React Error Boundary API（class 元件或 Next.js 轉換）。它接收 error（Error 物件）和 reset（嘗試重新渲染的函式）props。',
      },
      {
        order: 5,
        question: 'Next.js App Router 的 Metadata API 如何使用？generateMetadata 函式的用途是什麼？',
        options: [
          'Metadata 只能在 next.config.js 中設定',
          '在 layout.tsx 或 page.tsx 中 export const metadata = { title, description, ... } 設定靜態 metadata；export async function generateMetadata({ params }) 用於動態 metadata（如從資料庫取得文章標題）。Next.js 自動處理 <title>、<meta>、<og:> 等標籤，支援 metadata 繼承（子路由覆蓋父路由）',
          'Metadata 只支援 title 和 description 兩個欄位',
          'generateMetadata 必須在每個頁面都宣告，否則頁面沒有 title',
        ],
        answer: 1,
        explanation: 'Metadata API 的使用：靜態 metadata：export const metadata: Metadata = { title: "我的頁面", description: "..." }；動態 metadata：export async function generateMetadata({ params }: Props) { const post = await getPost(params.slug); return { title: post.title } }。支援 template：在根 layout 設定 title: { template: "%s | 我的網站", default: "我的網站" }，子頁面只需設定 title: "文章名稱"，自動組合為「文章名稱 | 我的網站」。也支援 openGraph、twitter、robots、icons 等 SEO 相關設定。',
      },
    ],
  },
]

async function seed() {
  console.log(`新增 Next.js 主題子類別...`)
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

  console.log(`\n新增 ${topics.length} 個 Next.js 主題及題目...`)
  for (const topic of topics) {
    const [inserted] = await db
      .insert(schema.topics)
      .values({
        slug: topic.slug,
        title: topic.title,
        description: topic.description,
        category: 'Next.js',
        difficulty: topic.difficulty,
        theme: THEME,
        subCategory: topic.subCategory,
      })
      .onConflictDoUpdate({
        target: schema.topics.slug,
        set: {
          title: topic.title,
          description: topic.description,
          category: 'Next.js',
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

  console.log('\n✅ Next.js 主題建立完成')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
