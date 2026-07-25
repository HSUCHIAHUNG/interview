import { config } from 'dotenv'
config({ path: '.env.local' })
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../lib/db/schema'

const client = neon(process.env.DATABASE_URL!)
const db = drizzle(client, { schema })

const THEME = 'Next.js'

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
    slug: 'nextjs-data-fetching',
    title: 'Server Component 資料獲取模式',
    description: '掌握 Server Component 中的資料獲取、並行請求、Request Memoization，以及 Client Component 的最佳資料獲取實踐。',
    difficulty: 'medium',
    subCategory: '資料獲取與快取',
    questions: [
      {
        order: 1,
        question: 'Next.js App Router 中，在 Server Component 使用 fetch 有什麼特殊行為？',
        options: [
          'fetch 在 Server Component 中和在瀏覽器中完全相同',
          'Next.js 擴充了原生 fetch：1) 自動快取：fetch 回應預設被 Data Cache 快取（等同 ISR）；2) 去重（Deduplication）：同一個請求週期內相同 URL+選項的 fetch 只執行一次（Request Memoization）；3) 支援 next: { revalidate, tags } 選項控制快取行為',
          'Server Component 中不能使用 fetch，必須用 axios',
          'fetch 在 Server Component 中不會自動處理 JSON 解析',
        ],
        answer: 1,
        explanation: 'Next.js 對 fetch 的擴充行為（僅在 Server Component）：1) 預設快取：fetch(url) 等同 fetch(url, { cache: "force-cache" })，回應被 Data Cache 永久快取（直到 revalidate 或手動失效）。注意：Next.js 15 後預設改為 no-store；2) Deduplication：在同一次渲染中，多個元件 fetch 相同 URL，實際只發送一次網路請求；3) 新選項：next: { revalidate: 3600 }（ISR）和 next: { tags: ["user-1"] }（用於 revalidateTag）。第三方 API 呼叫（如 axios）不受 Next.js 的快取管理。',
      },
      {
        order: 2,
        question: '如何避免 Server Component 中的 Waterfall（串行資料請求）問題？',
        options: [
          'Waterfall 在 Server Component 中無法避免',
          '使用 Promise.all() 或 Promise.allSettled() 並行發送多個請求：const [user, posts] = await Promise.all([getUser(id), getPosts(id)])。避免在一個 await 完成後才開始下一個請求（串行）。Next.js 的 Request Memoization 讓分散在元件樹各處的相同請求自動去重，無需手動傳遞資料',
          '每個 fetch 都加上 cache: "no-store" 避免 Waterfall',
          '使用 useEffect 改成客戶端請求解決 Waterfall',
        ],
        answer: 1,
        explanation: 'Waterfall 問題：// 差：串行（總時間 = A + B + C）const user = await getUser(id); const posts = await getPosts(id); const followers = await getFollowers(id)。// 好：並行（總時間 = max(A, B, C)）const [user, posts, followers] = await Promise.all([getUser(id), getPosts(id), getFollowers(id)])。進一步優化：在元件樹中，把互相獨立的資料獲取分散到各自的元件，用 Suspense 包裹，讓它們在渲染時並行進行，而不是在父元件串行獲取後透過 props 傳遞。',
      },
      {
        order: 3,
        question: 'Request Memoization 是什麼？和 Data Cache 的差別是什麼？',
        options: [
          'Request Memoization 和 Data Cache 是相同的東西',
          'Request Memoization：同一次伺服器請求週期中（單次頁面渲染），相同的 fetch 呼叫自動去重，只執行一次網路請求；Data Cache：跨多次請求的持久化快取（類似 CDN 快取），可以設定過期時間（revalidate）。Memoization 是記憶體中的暫時去重；Data Cache 是持久化的跨請求快取',
          'Request Memoization 需要手動配置 Redis',
          'Data Cache 是 Request Memoization 的子集',
        ],
        answer: 1,
        explanation: '兩者的生命週期不同：Request Memoization 只在一次伺服器請求（一次頁面渲染）的生命週期內有效，渲染結束後清空。它讓你可以在多個 Server Component 中安全地 fetch 相同的 URL，不必擔心重複的網路請求。Data Cache 是持久化的，存活跨多次請求，直到 revalidate 時間到期或手動呼叫 revalidatePath/revalidateTag 失效。Memoization 適用於所有 fetch（包含 no-store）；Data Cache 只對 force-cache 或設定 revalidate 的 fetch 有效。',
      },
      {
        order: 4,
        question: 'Client Component 中最佳的資料獲取方式是什麼？為什麼不推薦直接用 useEffect + fetch？',
        options: [
          'useEffect + fetch 是 Client Component 的唯一資料獲取方式',
          '推薦使用 SWR 或 TanStack Query（React Query）。理由：相較 useEffect + fetch，這些函式庫提供：自動快取和去重、重新聚焦時重新驗證、請求競態條件（Race Condition）處理、載入/錯誤狀態管理、樂觀更新（Optimistic Update）、分頁和無限捲動。useEffect + fetch 容易有 Race Condition 和記憶體洩漏問題',
          'Client Component 不應該獲取資料，所有資料應在 Server Component 獲取後傳遞',
          'Client Component 必須透過 API Route 獲取資料，不能直接 fetch',
        ],
        answer: 1,
        explanation: 'useEffect + fetch 的問題：1) Race Condition：快速切換路由時，舊請求的回應可能在新請求之後回來，覆蓋新資料（需要 ignore flag 或 AbortController）；2) 無快取：每次 mount 都重新請求；3) 載入狀態需要手動管理（isLoading、error state）；4) 記憶體洩漏：元件 unmount 後仍嘗試 setState。SWR 和 React Query 自動處理這些問題，提供宣告式的 const { data, error, isLoading } = useSWR(url, fetcher)。App Router 的最佳實踐：能在 Server Component 獲取就在 Server Component 獲取；需要客戶端實時性的才用 SWR/React Query。',
      },
      {
        order: 5,
        question: '如何在 Next.js 中實作「使用者登入後才能存取的頁面資料」（Protected Data Fetching）？',
        options: [
          '在 Client Component 中用 useEffect 檢查 localStorage 的 token',
          '在 Server Component 中：用 cookies() 取得 session cookie 或 JWT token 驗證用戶身份；若未認證呼叫 redirect("/login")；已認證則直接 await 帶用戶 ID 的資料查詢。或用 Middleware 統一攔截受保護路由',
          '在每個頁面的 <head> 標籤中加入驗證 script',
          'Protected Data 必須透過 API Route 處理，不能在 Server Component 直接查詢',
        ],
        answer: 1,
        explanation: '安全的 Protected Data Fetching 模式（Server Component）：import { cookies } from "next/headers"; const session = await auth(); // NextAuth.js v5 的方式 if (!session) redirect("/login"); const userData = await db.user.findUnique({ where: { id: session.userId } })。優勢：1) 伺服器端驗證比客戶端更安全；2) 敏感資料不需要先送到客戶端再驗證；3) 可以直接查詢資料庫，不需要額外的 API endpoint；4) 未認證的請求在伺服器端就被重定向，不洩漏任何頁面資料。',
      },
    ],
  },

  {
    slug: 'nextjs-caching',
    title: 'Next.js 四層快取機制',
    description: '深入理解 Next.js App Router 的四層快取（Request Memoization、Data Cache、Full Route Cache、Router Cache）及其互動關係。',
    difficulty: 'hard',
    subCategory: '資料獲取與快取',
    questions: [
      {
        order: 1,
        question: 'Next.js App Router 的四層快取分別是什麼？',
        options: [
          'Cookie Cache、Session Cache、API Cache、Page Cache',
          'Request Memoization（單次請求內 fetch 去重）、Data Cache（跨請求的 fetch 結果持久化）、Full Route Cache（build time 生成的靜態路由 HTML/RSC Payload）、Router Cache（瀏覽器端的路由快取）',
          'HTTP Cache、CDN Cache、Server Cache、Browser Cache',
          'SSR Cache、SSG Cache、ISR Cache、CSR Cache',
        ],
        answer: 1,
        explanation: '四層快取的位置和生命週期：1) Request Memoization：伺服器記憶體，單次請求生命週期；2) Data Cache：伺服器持久化（類似 Redis），直到 revalidate 或手動失效；3) Full Route Cache：伺服器（CDN 可分發），靜態頁面在 build time 生成直到 revalidate；4) Router Cache：客戶端記憶體，使用者 session 期間（30s/5min 後過期）。這四層是理解 Next.js 快取行為的關鍵，也是面試常考的進階題。',
      },
      {
        order: 2,
        question: 'Data Cache 的 cache: "force-cache"、cache: "no-store"、revalidate: N 各自的行為是什麼？',
        options: [
          '三者效果完全相同，只是語法不同',
          'force-cache（或不設定，Next.js 14 預設）：永久快取到 Data Cache，直到手動 revalidate；no-store：完全不快取，每次請求都重新獲取；revalidate: N：快取 N 秒（ISR 行為），N 秒後第一個請求背景重新驗證',
          'no-store 讓所有請求都改成客戶端 fetch',
          'force-cache 只在靜態頁面有效，動態頁面自動忽略',
        ],
        answer: 1,
        explanation: '快取設定的影響鏈：fetch 的 cache 設定影響 Data Cache → Data Cache 影響 Full Route Cache（頁面中有 no-store 的 fetch，整個路由自動成動態渲染，不進 Full Route Cache）。Next.js 15 修改了預設值：fetch 預設改為 no-store（不快取），改變了 Next.js 14 預設 force-cache 的行為。實務建議：明確設定快取行為，不依賴預設值（因版本可能改變）。',
      },
      {
        order: 3,
        question: 'Full Route Cache 是什麼？什麼情況下路由不會被 Full Route Cache？',
        options: [
          'Full Route Cache 只對 API Route 有效',
          'Full Route Cache 在 build time 將靜態路由渲染成 HTML 和 RSC Payload 並快取在伺服器，類似 CDN 邊緣快取。以下情況路由不會進 Full Route Cache（成為動態路由）：使用動態函式（cookies()、headers()、searchParams）、fetch 設定 no-store、使用動態路由且未用 generateStaticParams 預先生成',
          'Full Route Cache 只在生產環境有效，開發模式不快取',
          'Full Route Cache 和 Data Cache 是相同的東西',
        ],
        answer: 1,
        explanation: 'Full Route Cache 的工作流程：next build 時 → 分析路由 → 靜態路由渲染為 HTML + RSC Payload → 儲存在伺服器 → 用戶請求時直接回傳（極快）。什麼讓路由「變動態」（退出 Full Route Cache）：呼叫 cookies() → 每個用戶的 cookie 不同，無法預先渲染；呼叫 headers() → 類似；searchParams 動態讀取（page.tsx 的 props.searchParams）；fetch({ cache: "no-store" })。export const dynamic = "force-dynamic" 強制整個路由動態渲染。',
      },
      {
        order: 4,
        question: 'Router Cache（客戶端路由快取）是什麼？它如何影響頁面導覽？',
        options: [
          'Router Cache 是伺服器端的快取機制',
          'Router Cache 是瀏覽器端記憶體快取，儲存已訪問過的路由的 RSC Payload。效果：在導覽間前進/後退時，不需要重新向伺服器請求，直接使用快取的 RSC Payload（導覽瞬間完成）。過期時間：靜態路由 5 分鐘，動態路由 30 秒。router.refresh() 可以強制清除並重新獲取當前路由的資料',
          'Router Cache 是 Next.js 內建的 Redis 快取',
          'Router Cache 讓所有頁面在導覽時都顯示舊資料，無法禁用',
        ],
        answer: 1,
        explanation: 'Router Cache 的體驗影響：使用者在 /products 和 /products/123 之間切換，第一次訪問各頁面後，Router Cache 儲存 RSC Payload，之後的切換幾乎瞬間完成（無網路請求）。但資料可能過時：如果在 /products/123 更新了產品資料，然後回到 /products，產品列表可能仍顯示舊資料（直到 Router Cache 過期）。解法：在 Server Action 中呼叫 revalidatePath("/products") 或 router.refresh()，強制讓客戶端路由快取失效。',
      },
      {
        order: 5,
        question: 'revalidatePath 和 revalidateTag 在快取失效中各自的用途是什麼？',
        options: [
          '兩者功能完全相同，可以互換使用',
          'revalidatePath(path)：讓指定路徑（及其相關的 Data Cache 和 Full Route Cache）失效，適合「更新特定頁面」；revalidateTag(tag)：讓帶有特定 tag 的所有 fetch 快取失效，適合「跨多個頁面失效相同類型的資料」',
          'revalidatePath 只對 Data Cache 有效；revalidateTag 只對 Full Route Cache 有效',
          'revalidateTag 需要在 next.config.js 中預先註冊所有 tag',
        ],
        answer: 1,
        explanation: '使用場景舉例：revalidatePath：更新 /blog/my-post 這篇文章 → revalidatePath("/blog/my-post")，讓這個頁面重新生成；也可以用 revalidatePath("/blog", "layout") 失效整個 layout 下的所有頁面。revalidateTag：多個頁面（產品列表頁、產品詳情頁、搜尋頁）都 fetch({ next: { tags: ["products"] } }) → 更新產品資料庫後執行 revalidateTag("products")，一次失效所有相關頁面的快取。結合 Webhook：CMS 發布新文章 → 呼叫 /api/revalidate → 執行 revalidateTag("blog-posts")。',
      },
    ],
  },

  {
    slug: 'nextjs-server-actions',
    title: 'Server Actions 原理與最佳實踐',
    description: '了解 Server Actions 的工作機制、與 API Route 的比較、表單整合，以及安全性注意事項。',
    difficulty: 'hard',
    subCategory: '進階功能',
    questions: [
      {
        order: 1,
        question: 'Server Actions 是什麼？它的底層工作機制是什麼？',
        options: [
          'Server Actions 是 API Route 的語法糖，完全相同',
          'Server Actions 是標記 "use server" 的非同步函式，可以在 Client Component 中呼叫但實際在伺服器執行。底層機制：Next.js 自動為每個 Server Action 建立一個 POST endpoint；客戶端呼叫 Server Action 時，框架序列化參數、發送 POST 請求到該 endpoint、反序列化回傳值。對開發者而言像是呼叫普通函式',
          'Server Actions 只能在 Server Component 中呼叫',
          'Server Actions 不支援非同步操作，只能做同步計算',
        ],
        answer: 1,
        explanation: 'Server Actions 的開發體驗革命：過去需要建立 API Route（POST /api/create-post）然後在客戶端 fetch + 序列化。Server Actions 讓你直接 "use server" 函式，框架自動處理 RPC 機制。使用方式：async function createPost(data: FormData) { "use server"; await db.posts.create({ data: { title: data.get("title") } }); revalidatePath("/blog") }。這個函式可以直接傳給 <form action={createPost}> 或在 onClick 中呼叫。Next.js 自動處理序列化、網路傳輸、錯誤處理。',
      },
      {
        order: 2,
        question: 'Server Actions 和 API Route 相比，各自的優缺點是什麼？',
        options: [
          'Server Actions 完全取代 API Route，API Route 已過時',
          'Server Actions 優點：不需要建立獨立 endpoint，型別安全（直接呼叫函式，無需手動定義 request/response 型別），與 React 整合（useActionState、useFormStatus）；缺點：只能從 Next.js 應用呼叫，第三方無法使用。API Route 優點：可供第三方服務呼叫（Webhook、Mobile App、第三方整合），支援 GET 請求，可明確設定 HTTP 方法和 headers',
          'Server Actions 只能做讀取操作，API Route 才能做寫入操作',
          'API Route 已被 Server Actions 取代，不再更新',
        ],
        answer: 1,
        explanation: '選擇依據：用 Server Actions → 表單提交、使用者互動觸發的資料突變（create、update、delete），只在 Next.js 應用中使用的操作，需要與 useFormStatus/useActionState 整合的場景。用 API Route → 需要被第三方呼叫（Stripe Webhook、GitHub Webhook）、需要支援 GET 請求（RESTful API）、需要精確控制 HTTP 狀態碼和 headers、行動應用 API。兩者可以共存，根據使用場景選擇。',
      },
      {
        order: 3,
        question: 'useActionState（原 useFormState）和 useFormStatus 各自的用途是什麼？',
        options: [
          '兩者完全相同，useFormStatus 是 useActionState 的別名',
          'useActionState：管理 Server Action 的執行狀態和回傳值（action 的結果、執行中狀態）；useFormStatus：取得「最近的父 <form> 元素」的送出狀態（pending：是否正在提交），讓 submit button 在提交中時顯示 loading 狀態',
          'useFormStatus 只能在 class 元件中使用',
          'useActionState 需要 Redux 整合才能使用',
        ],
        answer: 1,
        explanation: 'useActionState 使用方式：const [state, action, isPending] = useActionState(serverAction, initialState)。state 包含 Server Action 的回傳值（如 { error: "郵箱已存在" }），action 是包裝後的 action function。useFormStatus 的特殊之處：必須在 <form> 的「子元件」中使用（不能在 form 元件本身）：function SubmitButton() { const { pending } = useFormStatus(); return <button disabled={pending}>{pending ? "送出中..." : "送出"}</button> }。兩者搭配使用：useActionState 處理伺服器回傳的業務錯誤，useFormStatus 處理提交中的 UI 狀態。',
      },
      {
        order: 4,
        question: 'Server Actions 的安全性注意事項有哪些？',
        options: [
          'Server Actions 自動處理所有安全問題，無需額外考慮',
          'Server Actions 的安全性注意：1) 任何人都可以呼叫 Server Action（即使 UI 上沒有顯示），必須在函式內部驗證用戶身份和權限；2) 輸入驗證不可省略（用 zod 等函式庫驗證）；3) 避免直接使用用戶輸入當 SQL 查詢參數；4) Server Actions 的 endpoint 是自動生成的 POST 請求，可能被 CSRF 利用，Next.js 對 Origin header 有額外保護',
          'Server Actions 只能被已登入的用戶呼叫，無需額外驗證',
          'Server Actions 不能接受用戶輸入，只能使用伺服器端資料',
        ],
        answer: 1,
        explanation: '安全性最佳實踐範例：async function deletePost(id: string) { "use server"; const session = await auth(); if (!session) throw new Error("未登入"); // 驗證用戶是否為文章作者 const post = await db.post.findUnique({ where: { id } }); if (post.authorId !== session.userId) throw new Error("無權限"); await db.post.delete({ where: { id } }); }。重點：1) 永遠在 Server Action 內驗證，不依賴 UI 層的限制；2) Next.js 會驗證 Origin header 防止 CSRF（只允許來自同域名的請求）；3) 使用 zod 驗證輸入型別和範圍。',
      },
      {
        order: 5,
        question: 'Server Action 執行後如何更新 UI 顯示最新資料？',
        options: [
          'Server Action 執行後 UI 永遠不會自動更新，必須重新整理頁面',
          '主要方式：1) revalidatePath 或 revalidateTag：讓 Full Route Cache 和 Data Cache 失效，下次訪問頁面會重新獲取資料；2) router.refresh()（在 Client Component 中）：重新向伺服器請求當前路由的最新資料，不重載整個頁面；3) useOptimistic：在 Server Action 完成前樂觀地更新 UI，提升體驗',
          'Server Action 執行後必須呼叫 window.location.reload() 才能看到更新',
          'Server Action 只能更新資料庫，無法觸發 UI 更新',
        ],
        answer: 1,
        explanation: '三種更新 UI 策略：1) revalidatePath（最常用）：在 Server Action 末尾呼叫，Next.js 在客戶端導覽到該路徑時自動更新；2) useOptimistic（最佳 UX）：const [optimisticLikes, addOptimisticLike] = useOptimistic(likes); 點擊時先 addOptimisticLike(+1) 立即顯示，Server Action 完成後（revalidate 觸發）顯示真實值；3) 表單的 action 搭配 redirect()：Server Action 完成後直接跳轉到更新後的頁面（如建立文章後跳到文章頁）。',
      },
    ],
  },

  {
    slug: 'nextjs-optimization',
    title: 'Next.js 內建效能優化',
    description: '了解 next/image、next/font、next/link、next/script 提供的自動效能優化，以及 Next.js 專案的 bundle 優化策略。',
    difficulty: 'easy',
    subCategory: '進階功能',
    questions: [
      {
        order: 1,
        question: 'next/image 的 <Image> 元件相較於原生 <img> 有哪些自動效能優化？',
        options: [
          '<Image> 只是 <img> 的 TypeScript 封裝，沒有效能差異',
          '自動格式轉換（根據瀏覽器支援度提供 WebP 或 AVIF）、根據 width prop 縮放至正確尺寸（避免手機下載桌機大圖）、自動生成 srcset、below-fold 圖片自動 lazy loading、強制設定 width/height 防止 CLS、透過 Next.js Image Optimization API 處理（可搭配 CDN）',
          '<Image> 讓圖片可以點擊並顯示放大效果',
          '<Image> 把圖片存在 localStorage 加速二次載入',
        ],
        answer: 1,
        explanation: 'next/image 的技術細節：1) 格式轉換：Next.js 伺服器（或 CDN）在請求時根據 Accept 標頭動態轉換格式；2) 尺寸調整：<Image width={400} height={300}> 讓伺服器生成 400px 寬的版本，不讓手機下載 2000px 的原圖；3) 自動 srcset：生成多個尺寸（0.5x, 1x, 2x）讓瀏覽器選最適合的；4) LCP 優化：可設定 priority 屬性讓 LCP 圖片優先下載（加 preload link）；5) 外部圖片需要在 next.config.js 設定 remotePatterns 白名單。',
      },
      {
        order: 2,
        question: 'next/font 如何消除字型相關的 CLS（Cumulative Layout Shift）和 FOUT（Flash of Unstyled Text）？',
        options: [
          'next/font 讓字型在 HTML 渲染之前就下載完成',
          'next/font 在 build time 自動下載 Google Font（或本地字型），在伺服器端設定 CSS 變數，並使用 size-adjust、ascent-override 等 CSS Font Metrics 覆蓋，讓 fallback 字型的大小和間距接近自訂字型，消除字型替換時的版面位移（FOUT/CLS）。字型直接從自己的域名提供，不需要向 Google 發送請求（隱私優化）',
          'next/font 讓字型以 Base64 內嵌在 CSS 中',
          'next/font 只支援英文字型，中文字型無效',
        ],
        answer: 1,
        explanation: 'next/font 解決了前端字型的兩大痛點：1) CLS：字型從 fallback（如 Arial）切換到自訂字型時，字型度量不同導致版面跳動。next/font 用 size-adjust 讓 fallback 字型在視覺上接近目標字型，切換幾乎無感；2) 隱私/速度：使用 Google Fonts 時瀏覽器需向 Google 發請求（GDPR 問題，RTT 延遲）。next/font 在 build time 下載字型，從自己的域名提供（無額外 DNS 解析）。使用方式：const inter = Inter({ subsets: ["latin"] }); 然後 className={inter.className}。',
      },
      {
        order: 3,
        question: 'next/link 的 <Link> 元件預設做哪些效能優化？',
        options: [
          '<Link> 只是 <a> 的語法糖，沒有效能差異',
          '<Link> 在視口（Viewport）中可見時自動預載（Prefetch）目標路由的 RSC Payload 和 JavaScript bundle。點擊時從快取直接顯示，導覽瞬間完成（無感知）。可設定 prefetch={false} 禁用。在開發模式下 prefetch 不啟用，只在生產環境有效',
          '<Link> 預載所有頁面上出現的連結，不管是否可見',
          '<Link> 的 prefetch 只在用戶 hover 時才觸發',
        ],
        answer: 1,
        explanation: 'next/link Prefetch 的工作原理：Intersection Observer 監測 <Link> 進入視口 → 自動向 Next.js 伺服器請求目標路由的 RSC Payload（靜態路由也預載對應的 JS chunk）→ 儲存在 Router Cache。效果：用戶點擊連結時，資料已在瀏覽器記憶體中，路由切換幾乎瞬間完成。注意：prefetch 在生產環境才有效（開發模式關閉避免過多請求）；動態路由的 prefetch 行為和靜態路由不同（只預載 loading.tsx 的 fallback）；大量列表頁面的所有 <Link> 都 prefetch 可能造成大量 network 請求，需評估是否適合設定 prefetch={false}。',
      },
      {
        order: 4,
        question: 'next/script 的 strategy 屬性有哪些選項？各自的執行時機是什麼？',
        options: [
          'next/script 只有一種載入方式，沒有 strategy 選項',
          'beforeInteractive：在 hydration 前執行（適合 polyfill 等必須最先載入的 script）；afterInteractive（預設）：hydration 後立即執行（適合 tag manager、analytics）；lazyOnload：頁面完全空閒後才載入（適合聊天外掛、廣告等低優先度 script）；worker：在 Web Worker 中執行（實驗性，避免阻塞主執行緒）',
          'strategy 只接受 "async" 和 "defer" 兩個值',
          'next/script 不支援外部 CDN 連結，只能載入本地檔案',
        ],
        answer: 1,
        explanation: 'next/script strategy 使用場景：beforeInteractive → 用於需要在任何 hydration 前就必須就位的 script（如 consent manager 需在第一個互動前就設置好 cookie 偏好）；afterInteractive → Google Analytics、Tag Manager（不需要阻塞 hydration，但應盡早啟動）；lazyOnload → Intercom 聊天泡泡、Facebook Pixel（對使用者體驗不關鍵，可延後）；worker → 把第三方 script（如 analytics）移到 Web Worker，避免阻塞主執行緒影響 INP（需要 Partytown 整合，實驗性）。',
      },
      {
        order: 5,
        question: 'Next.js 應用的 bundle 大小優化，有哪些最有效的策略？',
        options: [
          '直接把所有 npm 套件標記為 externals，讓瀏覽器從 CDN 載入',
          '1) 使用 next/dynamic 對非首屏元件做 Code Splitting（如富文字編輯器、圖表庫）；2) 在 bundle-analyzer 中找出過重的套件；3) 選用輕量替代套件（date-fns 取代 moment.js、clsx 取代 classnames）；4) 確保 Tree Shaking 有效（使用 ESM 套件，named import）；5) 伺服器端套件僅在 Server Component 使用（不進 client bundle）',
          'Next.js 自動優化所有 bundle，不需要手動介入',
          '把所有頁面合併成一個頁面，消除路由切換的 bundle 分割',
        ],
        answer: 1,
        explanation: 'Bundle 優化實戰：1) next/dynamic：const Chart = dynamic(() => import("recharts"), { ssr: false })，圖表庫只在需要時載入（節省首屏 300KB+）；2) @next/bundle-analyzer：在 package.json 加 "analyze": "ANALYZE=true next build"，生成視覺化的 bundle treemap；3) Server Component 的套件不進 client bundle：若 markdown 解析（marked、remark）只在 Server Component 使用，這些套件不計入 client bundle 大小，是 App Router 的一大優勢；4) import 優化：import { format } from "date-fns/format"（只引入需要的函式）。',
      },
    ],
  },
]

async function seed() {
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

  console.log('\n✅ Next.js Part 3 主題建立完成')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
