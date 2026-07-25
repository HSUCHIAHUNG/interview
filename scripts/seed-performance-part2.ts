import { config } from 'dotenv'
config({ path: '.env.local' })
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../lib/db/schema'

const client = neon(process.env.DATABASE_URL!)
const db = drizzle(client, { schema })

const THEME = 'Performance'

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
    slug: 'perf-core-web-vitals',
    title: 'Core Web Vitals 與效能指標',
    description: '了解 LCP、CLS、INP 三大核心指標的定義、良好標準、影響因素與改善方式。',
    difficulty: 'medium',
    subCategory: '效能測量',
    questions: [
      {
        order: 1,
        question: 'Google Core Web Vitals（核心網頁指標）的三個指標是什麼？',
        options: [
          'FCP（First Contentful Paint）、TTI（Time to Interactive）、TTFB（Time to First Byte）',
          'LCP（Largest Contentful Paint）、CLS（Cumulative Layout Shift）、INP（Interaction to Next Paint）',
          'FID（First Input Delay）、FCP、LCP',
          'Speed Index、TTFB、TBT（Total Blocking Time）',
        ],
        answer: 1,
        explanation: 'Core Web Vitals 是 Google 衡量使用者體驗的三個核心指標，直接影響 Google 搜尋排名：1) LCP（Largest Contentful Paint）：衡量載入效能，視口內最大內容元素出現的時間；2) CLS（Cumulative Layout Shift）：衡量視覺穩定性，頁面元素意外移動的程度；3) INP（Interaction to Next Paint，2024 年取代 FID）：衡量互動反應性，使用者互動到下一次頁面繪製的延遲。良好標準：LCP < 2.5s、CLS < 0.1、INP < 200ms。',
      },
      {
        order: 2,
        question: 'LCP（Largest Contentful Paint）的良好標準是什麼？哪些元素通常是 LCP 元素？',
        options: [
          '良好標準是 < 1 秒；LCP 元素是頁面上所有圖片',
          '良好標準是 < 2.5 秒；LCP 元素通常是視口內最大的圖片（<img>、CSS background-image）、影片縮圖（<video poster>）或大段文字區塊',
          '良好標準是 < 5 秒；LCP 元素是 <header> 標籤',
          '良好標準是 < 4 秒；LCP 元素是頁面的 favicon',
        ],
        answer: 1,
        explanation: 'LCP 良好：< 2.5s；需要改善：2.5s-4s；差：> 4s。常見 LCP 元素：Hero 圖片、Above the fold 的大圖、頁面主標題（若是最大元素）、影片封面。改善 LCP 的方法：1) 對 LCP 圖片使用 <link rel="preload"> 提早下載；2) 確保 LCP 圖片不使用 lazy loading；3) 使用現代格式（WebP/AVIF）減小圖片大小；4) 使用 CDN 降低 TTFB；5) 避免渲染阻塞資源延遲 LCP 元素出現。',
      },
      {
        order: 3,
        question: 'CLS（Cumulative Layout Shift）是什麼？最常見的 CLS 問題原因和修復方式是什麼？',
        options: [
          'CLS 衡量 CSS 載入的速度，用 CSS minification 改善',
          'CLS 衡量頁面元素意外移動的程度（如廣告載入後推開文字、圖片載入後撐開容器）。最常見原因：圖片/影片未設定尺寸。修復：為所有 <img> 和 <video> 設定 width 和 height 屬性，讓瀏覽器提前預留空間',
          'CLS 衡量 JavaScript 執行時的 CPU 使用量',
          'CLS 是累計的 scroll 距離，用 CSS scroll-behavior 改善',
        ],
        answer: 1,
        explanation: 'CLS 公式：位移影響面積比例 × 位移距離比例的總和。良好標準：< 0.1。常見 CLS 來源：1) 圖片沒有設定尺寸（載入後撐開空間） → 解法：設定 width/height 或 aspect-ratio；2) 動態注入的廣告/banner → 解法：為廣告預留固定高度；3) 自訂字型 FOUT（字型載入前後寬度不同） → 解法：font-display: optional 或 preload 字型；4) 動態插入的 DOM 推開既有內容 → 解法：用 transform 動畫，或插入位置不影響既有元素。',
      },
      {
        order: 4,
        question: '以下哪個工具或方式可以測量 Core Web Vitals？',
        options: [
          '只有 Google Search Console 可以測量 Core Web Vitals',
          'Chrome DevTools Lighthouse 面板、PageSpeed Insights（pagespeed.web.dev）、web-vitals JavaScript 函式庫（在真實使用者瀏覽器中收集）、Chrome User Experience Report（CrUX）',
          'VSCode 的 ESLint 外掛',
          'Firefox 開發者工具',
        ],
        answer: 1,
        explanation: 'Core Web Vitals 測量工具分兩類：1) Lab 資料（模擬環境）：Chrome DevTools Lighthouse、PageSpeed Insights、WebPageTest — 可在開發時預測；2) Field 資料（真實使用者）：web-vitals 函式庫（import { onLCP, onCLS, onINP } from "web-vitals"）、Google Analytics（整合 web-vitals）、CrUX（Chrome User Experience Report，Google 蒐集的真實使用者資料）。兩者都重要：Lab 資料用於開發除錯，Field 資料反映真實使用者體驗，Google 排名使用的是 Field 資料。',
      },
      {
        order: 5,
        question: 'INP（Interaction to Next Paint）衡量什麼？如何改善 INP 分數？',
        options: [
          'INP 衡量首次頁面繪製到使用者第一次點擊的時間',
          'INP 衡量使用者整個瀏覽過程中，所有互動（點擊、鍵盤輸入、觸控）從開始到瀏覽器完成下一次繪製的延遲，取最差的代表性值。良好標準：< 200ms。改善方式：減少長任務（Long Tasks > 50ms）、分拆大型 JS 計算、減少 state 更新觸發的不必要重渲染',
          'INP 衡量頁面從開始載入到完全互動的時間',
          'INP 衡量動畫的每秒幀數（FPS）',
        ],
        answer: 1,
        explanation: 'INP（2024 年正式取代 FID）的進化點：FID 只測量第一次互動的延遲；INP 追蹤整個頁面瀏覽過程中「所有互動」的延遲，更能反映互動密集型應用的體驗。常見 INP 問題根因：1) 點擊 handler 觸發大量同步計算（如排序、過濾大型列表） → 用 Web Worker 或分拆任務；2) state 更新導致大面積重渲染 → 精細化 state、用 memo 優化；3) 長任務阻塞主執行緒 → 用 scheduler.postTask 或 setTimeout 分批；React 18 的 useTransition 可標記非緊急更新，有效改善 INP。',
      },
    ],
  },

  {
    slug: 'perf-image',
    title: '圖片優化策略',
    description: '學習現代圖片格式（WebP/AVIF）、lazy loading、responsive images 與 srcset 的正確使用，最小化圖片對效能的影響。',
    difficulty: 'easy',
    subCategory: '資源優化',
    questions: [
      {
        order: 1,
        question: 'WebP 和 AVIF 相較於傳統 JPEG/PNG 的主要優勢是什麼？',
        options: [
          'WebP 和 AVIF 的檔案更大，但顯示品質更好',
          'WebP 比同品質 JPEG 小約 25-35%，且支援透明度（取代 PNG）；AVIF 比 WebP 再小約 20-50%，壓縮效率最高。兩者都可使用 <picture> 元素提供 JPEG/PNG 的 fallback，確保舊瀏覽器相容性',
          'AVIF 和 WebP 不支援動畫格式',
          '這些格式只在最新版 Chrome 中有效，Safari 和 Firefox 不支援',
        ],
        answer: 1,
        explanation: 'WebP（Google 開發）支援：有損壓縮（比 JPEG 小 25-35%）、無損壓縮（比 PNG 小 26%）、透明度、動畫（取代 GIF）。AVIF（基於 AV1 視頻）：更先進的壓縮演算法，比 WebP 再小 20-50%，尤其在低品質設定下仍保持良好品質。支援度：WebP 支援所有現代瀏覽器；AVIF 在 Chrome 85+、Firefox 93+、Safari 16+ 支援。使用 <picture><source type="image/avif"><source type="image/webp"><img></picture> 提供漸進式 fallback。',
      },
      {
        order: 2,
        question: '圖片的原生 lazy loading 如何實作？有什麼限制需要注意？',
        options: [
          '用 CSS opacity: 0 隱藏圖片，捲動到視口時再顯示',
          '在 <img> 標籤加上 loading="lazy" 屬性：<img loading="lazy" src="photo.jpg">，瀏覽器會延遲載入視口外的圖片，接近視口時才下載。注意：不要對 above-the-fold（首屏）圖片用 lazy，特別是 LCP 元素；進階做法可用 Intersection Observer API',
          '把圖片的 src 設為空白，用 JavaScript 監聽 scroll 事件再設定 src',
          'lazy loading 只對 PNG 有效，JPEG 不支援',
        ],
        answer: 1,
        explanation: 'loading="lazy" 是 HTML 原生屬性，現代瀏覽器廣泛支援，無需 JS。瀏覽器會在圖片進入視口前一定距離（通常是視口高度的 50-100%）才開始下載。注意事項：1) LCP 圖片絕對不能 lazy（會導致 LCP 變差）；2) 首屏以下的圖片加 lazy 才有意義；3) 要設定 width/height 避免 CLS；4) Intersection Observer 的進階用途：可精確控制預載距離、實作 low-quality placeholder（LQIP）先顯示模糊低解析度版本，完整版下載後再換。',
      },
      {
        order: 3,
        question: 'HTML <img> 的 srcset 屬性有什麼作用？',
        options: [
          '讓一張圖片顯示在多個位置',
          'srcset 提供多個不同尺寸的圖片版本，讓瀏覽器根據裝置的螢幕密度（DPR）和實際顯示大小（搭配 sizes 屬性）自動選擇最適合的版本，避免手機下載桌面版大圖浪費頻寬',
          'srcset 是 CSS 屬性，不是 HTML',
          'srcset 讓圖片以動畫形式漸進載入',
        ],
        answer: 1,
        explanation: 'srcset 有兩種用途：1) 高 DPI 螢幕（Retina）：<img srcset="img.jpg 1x, img@2x.jpg 2x"> — DPR 2 的裝置使用 2x 版本；2) 響應式（Responsive Images）：<img srcset="small.jpg 320w, medium.jpg 768w, large.jpg 1200w" sizes="(max-width: 768px) 100vw, 50vw"> — 瀏覽器根據實際顯示寬度（sizes）選擇最接近的版本。最佳實踐：提供 320w、640w、1024w、1920w 多個版本，讓手機使用小圖（節省 70-90% 頻寬），桌機使用大圖。Next.js <Image> 自動處理 srcset。',
      },
      {
        order: 4,
        question: '以下哪種情境最適合使用 CSS Sprite？',
        options: [
          '載入高解析度相片',
          '把多個小型 icon 合併成一張大圖，只需一個 HTTP 請求載入所有 icon，用 CSS background-position 顯示各個 icon。主要用於 HTTP/1.1（並行連線限制 6 個），HTTP/2 多路復用後此優勢大幅減小',
          '製作頁面背景動畫',
          '在 Retina 螢幕上顯示高清 SVG 圖示',
        ],
        answer: 1,
        explanation: 'CSS Sprite 的原理：將多個小圖片合併成一張大圖（sprite sheet），用 background-image 引用大圖，background-position 偏移到特定小圖位置。過去在 HTTP/1.1 時代很重要，因為每個資源都需要獨立的 HTTP 連線（上限 6 個），合併圖片減少請求數。HTTP/2 多路復用讓多個請求可以在同一連線並行，sprite 的必要性降低。現代替代方案：SVG sprite（<use href="#icon-name">）或 icon font（Font Awesome）或直接引用獨立 SVG（HTTP/2 下影響很小）。',
      },
      {
        order: 5,
        question: 'Next.js <Image> 元件相較於原生 <img> 標籤提供了哪些自動效能優化？',
        options: [
          '<Image> 讓圖片可以點擊放大',
          '自動格式轉換（根據瀏覽器支援度回傳 WebP 或 AVIF）、根據 width/height props 產生對應 srcset（適合各種螢幕解析度）、自動 lazy loading（首屏以下）、自動計算佔位空間防止 CLS、透過 CDN 優化傳輸',
          '<Image> 只是 <img> 的 TypeScript 語法糖，沒有效能差異',
          '<Image> 把圖片存在 localStorage 加速二次載入',
        ],
        answer: 1,
        explanation: 'Next.js <Image> 在伺服器端（Image Optimization API）處理：1) 格式轉換：自動偵測瀏覽器支援 WebP/AVIF 並轉換；2) 尺寸調整：根據 width prop 縮放圖片，不讓手機下載桌機圖；3) 生成 srcset：自動建立多個尺寸版本；4) lazy loading：自動在 below-fold 圖片加 loading="lazy"；5) 防 CLS：強制設定 width/height，預留空間；6) 透過 CDN 快取優化後的圖片。要獲得這些好處，通常需要設定 next.config.js 中的 domains 允許外部圖片來源。',
      },
    ],
  },

  {
    slug: 'perf-caching',
    title: 'HTTP 快取策略',
    description: '掌握 Cache-Control、ETag、Last-Modified 的運作機制，以及 Service Worker 快取的應用場景。',
    difficulty: 'hard',
    subCategory: '資源優化',
    questions: [
      {
        order: 1,
        question: 'HTTP Cache-Control: max-age=31536000, immutable 的含義是什麼？',
        options: [
          '快取一年，但伺服器可以隨時讓快取失效',
          'max-age=31536000 讓瀏覽器快取此資源一年（31536000 秒）；immutable 告訴瀏覽器在這段期間內不需要發送條件請求驗證（因為內容不會改變）。適合搭配 contenthash 的靜態資源：hash 不變 → 快取有效；hash 改變 → 新 URL → 瀏覽器視為新資源',
          '快取永遠不會過期，伺服器無法讓它失效',
          '每 31536000 毫秒強制重新下載一次',
        ],
        answer: 1,
        explanation: 'Cache-Control 最佳實踐分兩種策略：1) 靜態資源（JS/CSS/圖片，URL 含 contenthash）：Cache-Control: max-age=31536000, immutable — 長期快取，更新內容時 URL 改變自然失效；2) HTML 頁面（URL 固定，內容會更新）：Cache-Control: no-cache — 每次都驗證（但驗證通過可回 304 Not Modified，不重新下載）。immutable 是優化：沒有 immutable 時，部分瀏覽器在重新整理時還是會發送條件請求；加了 immutable，瀏覽器連驗證請求都不發送，更省。',
      },
      {
        order: 2,
        question: 'ETag 和 Last-Modified HTTP 標頭的作用是什麼？什麼時候回傳 304？',
        options: [
          '它們決定資源是否需要 Gzip 壓縮',
          'ETag（資源內容的 hash）和 Last-Modified（最後修改時間）是條件請求機制。瀏覽器再次請求時帶上 If-None-Match（ETag）或 If-Modified-Since（Last-Modified），若伺服器比對後資源未更新，回傳 304 Not Modified（無 body），節省頻寬；若已更新，回傳 200 + 新內容',
          '它們決定 CORS 是否允許跨域請求',
          '它們只在 HTTPS 連線中有效',
        ],
        answer: 1,
        explanation: '條件請求流程：1) 第一次請求：伺服器回傳 200 + 資源 + ETag: "abc123" 和/或 Last-Modified: Thu, 25 Jul 2024 00:00:00 GMT；2) 再次請求：瀏覽器帶上 If-None-Match: "abc123" 和/或 If-Modified-Since: Thu, 25 Jul 2024 00:00:00 GMT；3) 伺服器比對：資源未變 → 304 Not Modified（零 body，只有 header）；資源已變 → 200 + 新內容 + 新 ETag。ETag 比 Last-Modified 更精確（精度到 byte 內容，不是時間戳；同時間修改但內容不變的 ETag 相同）。',
      },
      {
        order: 3,
        question: 'Service Worker 快取和 HTTP 快取的最主要差別是什麼？',
        options: [
          'Service Worker 只能快取圖片，HTTP 快取能快取所有資源',
          'HTTP 快取由瀏覽器自動管理，開發者只能透過 response headers 設定策略；Service Worker 讓開發者用 JavaScript 完全自訂快取邏輯（Cache Storage API），可以實作離線支援、背景同步、完全自訂的 cache-first / network-first / stale-while-revalidate 策略',
          'Service Worker 快取一定比 HTTP 快取更快',
          'Service Worker 快取的資源不能在離線時使用',
        ],
        answer: 1,
        explanation: 'Service Worker 是一個在背景執行的 Web Worker，可攔截所有的 fetch 請求。常見快取策略（Workbox 函式庫提供）：1) Cache First：先查快取，沒有再網路，適合不常變的靜態資源；2) Network First：先網路，失敗再用快取，適合動態內容需要最新；3) Stale While Revalidate：立即回傳快取，同時背景更新，適合可以接受略舊的資料；4) Cache Only：純離線。Service Worker 是 PWA（Progressive Web App）的基礎，讓網頁可以完全離線運作。',
      },
      {
        order: 4,
        question: 'Cache Busting（快取清除）是什麼？最常見的實作方式是什麼？',
        options: [
          '一種讓伺服器清空所有使用者快取的技術',
          '當資源內容更新時，讓瀏覽器放棄舊快取、取得新版本的技術。最常見做法：在 URL 中加入 contenthash（如 main.abc123.js）——內容改變 → hash 改變 → 新 URL → 瀏覽器視為全新資源下載；其他方式：query string（main.js?v=2）',
          '手動刪除 localStorage 的快取資料',
          'Cache Busting 只在 CDN 上有效',
        ],
        answer: 1,
        explanation: 'Cache Busting 解決的問題：靜態資源設了長期快取（max-age=1年），但部署新版本後使用者還是看到舊版本。解法優先級：1) Contenthash（最佳）：Webpack/Vite 自動處理，URL 改變 → 瀏覽器一定下載新版本，舊資源依然有快取（舊版 HTML 引用舊 JS 仍能工作）；2) Query string（?v=123）：URL 改變也觸發重新下載，但 CDN 和 proxy 可能忽略 query string 不快取；3) 版本目錄（/v2/main.js）：清晰但需要更改所有引用。Contenthash 是現代前端的標準做法。',
      },
      {
        order: 5,
        question: 'Stale-While-Revalidate（SWR）快取策略的核心概念是什麼？',
        options: [
          '永遠使用最新資源，不使用任何快取',
          '立即回傳快取的「舊版本（Stale）」讓使用者馬上看到內容（零等待），同時在背景發網路請求驗證並更新快取（Revalidate）。使用者下次訪問就能看到更新後的版本，兼顧速度和新鮮度',
          '只有伺服器離線時才使用快取',
          '每 5 秒自動重新驗證一次，無論快取是否過期',
        ],
        answer: 1,
        explanation: 'Stale-While-Revalidate 可在兩個層面使用：1) HTTP 標頭：Cache-Control: max-age=60, stale-while-revalidate=86400 — 60 秒內直接使用快取，60s-86400s 之間使用快取但同時背景更新；2) 前端函式庫：SWR（vercel/swr）和 TanStack Query 以此模式命名，使用者看到即時的快取資料，後台重新驗證後自動更新。適合的場景：使用者資料（可接受略舊）、商品列表（不需要每次都最新）。不適合的場景：庫存量（需要精確）、金融資料（需要即時）。',
      },
    ],
  },

  {
    slug: 'perf-runtime',
    title: 'Runtime 效能與 JavaScript 優化',
    description: '了解 JavaScript 執行效能，包含避免 Layout Thrashing、requestAnimationFrame、Web Worker 的應用，以及記憶體管理與 Debounce/Throttle。',
    difficulty: 'hard',
    subCategory: 'Runtime 優化',
    questions: [
      {
        order: 1,
        question: '什麼是 Layout Thrashing（強制同步佈局）？如何避免？',
        options: [
          'CSS flexbox 排版出現跑版的視覺問題',
          '在 JavaScript 中交替「讀取 DOM 屬性」（如 offsetHeight、getBoundingClientRect）和「修改 DOM 樣式」，迫使瀏覽器反覆重新計算 Layout，大幅降低效能。避免方式：批次讀取所有 DOM 屬性、再批次寫入所有修改（讀-讀-讀，然後寫-寫-寫）',
          '頁面載入太多 CSS animation 同時播放',
          '使用過多 CSS Grid 佈局導致渲染變慢',
        ],
        answer: 1,
        explanation: 'Layout Thrashing 的根因：瀏覽器為了效率會延遲 Layout 計算（批次處理），但若 JS 讀取 offsetWidth 等「需要最新 Layout 結果」的屬性，瀏覽器被迫立即強制重算 Layout（Forced Reflow）。若讀寫交替，每次讀都觸發一次 Forced Reflow，幾百次迴圈就能造成嚴重卡頓。避免方式：1) 先批次讀取，再批次寫入；2) 使用 requestAnimationFrame 在重繪時機批次 DOM 操作；3) 使用 CSS transform/opacity 做動畫（不觸發 Layout）；4) 用 FastDOM 函式庫自動排程讀寫。',
      },
      {
        order: 2,
        question: 'requestAnimationFrame（rAF）相較於 setTimeout 用來製作動畫的優勢是什麼？',
        options: [
          'requestAnimationFrame 固定每 1ms 執行一次，比 setTimeout 更精確',
          'rAF 與瀏覽器的重繪週期同步（通常 16.67ms / 60fps）：1) 不超頻（不在非重繪時機執行無效計算）；2) 頁面不可見時（切換分頁）自動暫停，節省 CPU；3) 不受 Event Loop 阻塞影響，動畫更流暢；setTimeout(fn, 16) 可能因 Event Loop 繁忙而跳幀',
          'setTimeout 不能用來製作動畫',
          'rAF 讓動畫在 CSS 執行，不佔用 JavaScript 主執行緒',
        ],
        answer: 1,
        explanation: 'setTimeout 做動畫的問題：1) 時機不準（Event Loop 忙碌時延遲）；2) 可能在 CSS 剛繪製後立即執行（導致跳幀）；3) 頁面隱藏時仍然執行（浪費 CPU，耗電）。rAF 的優勢：1) 與瀏覽器的 vsync 信號同步，在每幀重繪前調用；2) 頁面隱藏時自動停止；3) 瀏覽器可以在最佳時機批次處理動畫更新。最佳動畫實踐：CSS transition/animation（GPU 加速）> rAF（需要 JS 控制的動畫）> setTimeout（盡量避免）。rAF 也適合批次 DOM 操作，避免 Layout Thrashing。',
      },
      {
        order: 3,
        question: 'Web Worker 解決什麼問題？有什麼限制？',
        options: [
          'Web Worker 讓 JavaScript 可以同時開多個瀏覽器視窗',
          'Web Worker 讓計算密集型任務（大型資料排序、影像處理、加密運算、JSON 解析大型資料）在獨立的背景執行緒執行，不阻塞主執行緒（UI 保持流暢可互動）。限制：不能存取 DOM（無法直接操作 document）、不能使用 window 物件；透過 postMessage 和主執行緒通訊（傳遞資料的複製）',
          'Web Worker 讓網頁可以在 Node.js 後端執行',
          'Web Worker 主要用來加速 HTTP 請求的速度',
        ],
        answer: 1,
        explanation: 'JavaScript 是單執行緒的，複雜計算會阻塞 UI（頁面凍結、無法點擊）。Web Worker 在額外的執行緒執行：const worker = new Worker("worker.js"); worker.postMessage(data); worker.onmessage = (e) => { useResult(e.data) }。使用場景：1) 大型 JSON 解析（5MB 的 JSON.parse 可能耗時 500ms）；2) 影像/視頻處理；3) 加密運算；4) 大量資料的排序/過濾。限制：無法存取 DOM（改用 postMessage 把結果傳回主執行緒）；資料傳遞有序列化成本（大型 ArrayBuffer 可用 Transferable Objects 零拷貝轉移）。',
      },
      {
        order: 4,
        question: 'JavaScript 中常見的記憶體洩漏（Memory Leak）來源有哪些？',
        options: [
          '使用 let 而非 const 宣告變數會造成記憶體洩漏',
          '1) 未清理的事件監聽器（元件 unmount 後 listener 仍然對 DOM 保持引用）；2) 未清理的 setInterval/setTimeout（callback 持有組件 state 的閉包）；3) 閉包意外持有大型物件的引用；4) 用普通 Map/Set 存放 DOM 節點（節點移除後 Map 仍引用）→ 應用 WeakMap/WeakSet',
          '使用箭頭函式代替 function 關鍵字',
          '使用 async/await 語法',
        ],
        answer: 1,
        explanation: '常見記憶體洩漏場景和修復：1) React 中：useEffect 裡 addEventListener 未在 cleanup 中 removeEventListener；setInterval 未在 cleanup 中 clearInterval；2) 全域快取：把 DOM 節點存在模組層級的 Map，節點刪除後 Map 依然引用（用 WeakMap 讓節點被 GC 自動清除）；3) 閉包陷阱：factory function 返回的函式持有外層大型陣列的引用。排查工具：Chrome DevTools Memory 面板（Heap Snapshot 比對兩個時間點）、Performance Monitor（觀察 JS Heap Size 是否持續增長）。',
      },
      {
        order: 5,
        question: 'Debounce 和 Throttle 在前端效能優化中的應用場景是什麼？',
        options: [
          '它們只用於防止 XSS 和 CSRF 安全攻擊',
          'Debounce：事件停止觸發後等待一段時間才執行（如搜尋框停止輸入 300ms 後才送 API 請求）；Throttle：確保函式在一定時間內最多執行一次（如 scroll/resize 事件中每 100ms 最多執行一次計算）。兩者都能大幅減少高頻事件中函式的執行次數',
          'Debounce 讓動畫更流暢，Throttle 讓 API 請求更快',
          'Debounce 和 Throttle 在現代瀏覽器中已不必要，事件自動節流',
        ],
        answer: 1,
        explanation: 'Debounce 使用場景：搜尋框即時搜尋（避免每個字元都發 API）、視窗 resize 後重新計算布局、表單自動儲存。Throttle 使用場景：scroll 事件（每 100ms 執行一次 lazy loading 判斷）、滑鼠移動（mousemove 計算位置）、遊戲中的按鍵連打限制。實作：lodash.debounce / lodash.throttle；或自己實作（debounce 用 clearTimeout + setTimeout；throttle 用時間戳或旗標）。React Hook 版本：useDebouncedCallback（react-use 或 use-debounce 函式庫）。',
      },
    ],
  },
]

async function seed() {
  console.log(`\n新增 ${topics.length} 個 Performance 主題及題目（Part 2）...`)
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

  console.log('\n✅ Performance 主題建立完成（Part 2）')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
