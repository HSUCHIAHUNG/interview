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
    slug: 'nextjs-routing-advanced',
    title: '進階路由：動態路由、Route Groups、Parallel Routes',
    description:
      '掌握動態路由（[slug]、[...slug]）、Route Groups、Parallel Routes、Intercepting Routes 的使用場景。',
    difficulty: 'hard',
    subCategory: 'App Router',
    questions: [
      {
        order: 1,
        question: '[slug]、[...slug]、[[...slug]] 三種動態路由的差異是什麼？',
        options: [
          '三者完全相同，只是命名風格不同',
          '[slug]：匹配單一路徑段（/blog/post-1）；[...slug]：Catch-all，匹配一個或多個路徑段（/blog/2024/01/post）；[[...slug]]：Optional Catch-all，同上但也匹配無參數的情況（/blog 也匹配）',
          '[...slug] 只能用在最末端的路由段',
          '[[...slug]] 不支援 App Router，只能在 Pages Router 使用',
        ],
        answer: 1,
        explanation:
          '[slug] 只匹配固定的單層路由：/blog/my-post → params.slug = "my-post"。[...slug]（Catch-all）匹配一個或多個段：/blog/2024/01/post → params.slug = ["2024", "01", "post"]；但不匹配 /blog（沒有參數）。[[...slug]]（Optional Catch-all）在 Catch-all 基礎上也匹配空情況：/blog → params.slug = undefined（或 []）。實際用途：文件網站用 [[...slug]] 讓 /docs 和 /docs/getting-started/intro 都匹配同一個頁面元件。',
      },
      {
        order: 2,
        question: 'Route Groups（(group)）的主要用途是什麼？',
        options: [
          'Route Groups 讓多個頁面共享同一個 URL 前綴',
          'Route Groups 使用 (groupName) 資料夾語法，不影響 URL 路徑，主要用途：1) 邏輯分組程式碼（如把 auth 相關頁面放在 (auth) 資料夾）；2) 為不同的路由群組套用不同的 layout（如登入頁不需要頁首，(auth)/layout.tsx）；3) 多個 Root Layout（不同語言、不同主題的 layout）',
          'Route Groups 讓路由支援 URL hash（#）',
          'Route Groups 只是 Next.js 15 新增的功能，舊版本不支援',
        ],
        answer: 1,
        explanation:
          'Route Groups 的關鍵特性：(auth) 資料夾不出現在 URL 中，/app/(auth)/login/page.tsx 的 URL 是 /login（不是 /auth/login）。常見使用場景：1) 為行銷頁面套用一套 layout，為 app 頁面套用另一套（(marketing)/layout.tsx vs (app)/layout.tsx）；2) 組織專案結構不影響路由；3) 建立多個根 layout（每個 Route Group 有自己的 layout.tsx，這些 layout 成為各自的 root layout）。注意：同一層的 Route Groups 不能產生相同的 URL。',
      },
      {
        order: 3,
        question: 'Parallel Routes（並行路由）的使用場景是什麼？如何定義？',
        options: [
          'Parallel Routes 讓兩個頁面同時回傳資料，加快載入速度',
          'Parallel Routes 在同一個 layout 中同時渲染多個頁面（slots），每個 slot 獨立載入和導覽。使用 @slotName 資料夾命名定義 slot，在 layout.tsx 中接收為 props。適合：dashboard 同時顯示數據圖表和最近活動；社群平台同時顯示側欄和主內容各自獨立路由',
          'Parallel Routes 是在同一個請求中並行執行多個資料獲取',
          'Parallel Routes 只能定義最多 2 個 slot',
        ],
        answer: 1,
        explanation:
          'Parallel Routes 語法：建立 @analytics 和 @team 資料夾，layout.tsx 自動收到 { analytics, team } props：function Layout({ analytics, team }) { return <><main>{analytics}</main><aside>{team}</aside></> }。每個 slot 可以有各自的 loading.tsx 和 error.tsx，獨立處理載入狀態。適合場景：1) 條件渲染（根據認證狀態顯示不同 slot）；2) Tab 介面（每個 tab 是獨立路由，瀏覽器歷史可回退）；3) 模態框（Intercepting Routes 搭配 Parallel Routes）。',
      },
      {
        order: 4,
        question:
          'next/navigation 中，useRouter、usePathname、useParams、useSearchParams 各自的用途是什麼？',
        options: [
          '四者完全相同，只是語法糖',
          'useRouter()：程式化導覽（router.push、router.replace、router.back）；usePathname()：取得當前路徑字串；useParams()：取得動態路由參數（如 { slug: "my-post" }）；useSearchParams()：取得 URL query string（如 ?page=2&sort=desc）',
          'useRouter 只能在 Server Component 中使用',
          'useSearchParams 不需要 Suspense 包裹',
        ],
        answer: 1,
        explanation:
          '這四個 hook 都是 Client Component only（需要 "use client"）。useRouter 的常用方法：router.push("/login")（導覽）、router.replace（不加歷史記錄）、router.prefetch（預載）、router.refresh（重新獲取 Server Component 資料）。useParams 取得動態路由段的值，對應 [slug] → { slug: string }。useSearchParams 取得 query string，注意：在 Suspense 邊界外使用 useSearchParams 會讓整個頁面退出靜態渲染（Opt out of static rendering），應用 Suspense 包裹含有 useSearchParams 的元件。',
      },
      {
        order: 5,
        question: 'Intercepting Routes 的概念是什麼？最常見的使用場景是什麼？',
        options: [
          'Intercepting Routes 讓中間層路由可以攔截並修改請求',
          'Intercepting Routes 讓你在不離開當前頁面的情況下「攔截」另一個路由並在目前頁面中顯示（如模態框）。直接訪問被攔截的 URL 仍然顯示完整頁面，但從特定上下文導覽時顯示模態框。語法：(..) 和 @ Parallel Routes 搭配使用',
          'Intercepting Routes 是 API 的中介層，不是頁面路由',
          'Intercepting Routes 讓父路由可以阻止子路由的渲染',
        ],
        answer: 1,
        explanation:
          'Intercepting Routes 的經典場景：Instagram 的照片流。從 feed 點擊照片 → 照片在模態框中顯示（URL 變成 /photos/123），feed 保持在背景；直接訪問 /photos/123 → 顯示完整的照片頁面。實作：在 (.) folder 中建立 intercepting route（..) 表示上一層、(..)(..) 表示兩層、(...) 表示根目錄。搭配 @modal Parallel Route：layout 同時渲染 {children}（feed）和 {modal}（攔截的照片），modal 在非攔截訪問時為 null（用 default.tsx 定義）。',
      },
    ],
  },

  {
    slug: 'nextjs-middleware',
    title: 'Next.js Middleware',
    description:
      '了解 Next.js Middleware 的執行時機、常見用途（認證、重定向、A/B 測試），以及 Edge Runtime 的限制。',
    difficulty: 'medium',
    subCategory: 'App Router',
    questions: [
      {
        order: 1,
        question: 'Next.js Middleware 在請求流程的哪個階段執行？它可以做什麼操作？',
        options: [
          'Middleware 在 React 渲染完成後執行，用來修改回應',
          'Middleware 在請求到達路由（頁面或 API）之前執行，可以：讀取/修改請求和回應 headers、重定向（redirect）到另一個 URL、重寫（rewrite）請求路徑（改變實際服務的路由但 URL 不變）、直接回傳回應',
          'Middleware 只在伺服器啟動時執行一次',
          'Middleware 只能在 API Routes 中使用，不能用於頁面路由',
        ],
        answer: 1,
        explanation:
          'Middleware 的執行位置：在 CDN 快取層之後、應用程式路由之前（Edge 環境）。常見用途：1) 身份驗證：檢查 cookie/session，未登入則重定向到 /login；2) 地區化（i18n）：根據 Accept-Language header 重寫到 /zh-TW/...；3) A/B 測試：隨機分配用戶到不同版本（rewrite）；4) 速率限制：計算 IP 請求次數；5) Bot 偵測；6) 修改請求 header（傳遞用戶 ID 給 Server Component）。不適合：複雜業務邏輯（Edge 限制）、需要資料庫的操作（應優先使用 Server Component 或 API Route）。',
      },
      {
        order: 2,
        question: 'Middleware 的 config.matcher 如何設定？不設定 matcher 的預設行為是什麼？',
        options: [
          '不設定 matcher 時 Middleware 不執行',
          'config.matcher 是字串或字串陣列，用 glob 語法指定 Middleware 應用於哪些路徑。不設定 matcher 時，Middleware 對「所有請求」執行（包含靜態資源），通常需要設定 matcher 排除 _next/static、_next/image、favicon.ico 等靜態路徑',
          'matcher 只支援精確路徑匹配，不支援萬用字元',
          'matcher 設定後靜態頁面會變成動態頁面',
        ],
        answer: 1,
        explanation:
          'matcher 設定範例：config = { matcher: ["/dashboard/:path*", "/api/:path*"] }。也可以用否定 lookahead 排除路徑：config = { matcher: "/((?!_next/static|_next/image|favicon.ico).*)" }。Next.js 官方建議：不需要 Middleware 的靜態資源路徑應排除，避免每次靜態文件請求都執行 Middleware（造成不必要的 Edge Function 呼叫）。也可以在 Middleware 內部用 if (request.nextUrl.pathname.startsWith("/api")) 做條件判斷。',
      },
      {
        order: 3,
        question: '如何在 Next.js Middleware 中實作認證重定向？',
        options: [
          '在 Middleware 中呼叫 getServerSession() 或 auth() 函式驗證，若未認證則 return NextResponse.redirect(new URL("/login", request.url))。注意：Middleware 不應該做複雜的資料庫查詢，JWT token 驗證（無需資料庫）是最適合的認證方式',
          'Middleware 不能做重定向，只能修改 headers',
          '在 Middleware 中呼叫 useSession() hook 驗證使用者',
          'Middleware 的認證必須在 API Route 中完成',
        ],
        answer: 0,
        explanation:
          'Middleware 認證的最佳實踐：用無狀態的 JWT 驗證（解碼 token，檢查有效期）而非 session（需要資料庫查詢）。流程：const token = await getToken({ req: request })（NextAuth.js 的 getToken）或手動解碼 JWT cookie；若 token 不存在或過期，return NextResponse.redirect(new URL("/login", request.url))；否則 return NextResponse.next()（繼續到路由）。也可以在 redirect URL 附帶 callbackUrl：/login?callbackUrl=/dashboard，登入後自動導回原頁。',
      },
      {
        order: 4,
        question: 'Middleware 執行在 Edge Runtime，有什麼限制？',
        options: [
          'Edge Runtime 和 Node.js Runtime 完全相同，沒有限制',
          'Edge Runtime 不支援完整的 Node.js API：無法使用 fs（檔案系統）、無法使用不相容 Edge 的 Node.js 內建模組、部分 npm 套件不支援。優勢：冷啟動極快（< 1ms）、全球分散部署（低延遲）。適合輕量操作：JWT 驗證、地區判斷、Header 修改',
          'Edge Runtime 不支援非同步操作（async/await）',
          'Edge Runtime 的 Middleware 無法讀取 cookies',
        ],
        answer: 1,
        explanation:
          'Edge Runtime 的技術背景：基於 V8 engine 但不是 Node.js，是精簡的 JavaScript 執行環境（類似 Service Worker），在 CDN 邊緣節點執行。限制細節：不能使用 fs、child_process、crypto（Node.js 內建）→ 用 Web Crypto API 替代；不能使用依賴 Node.js API 的 npm 套件（如部分 ORM）；執行時間限制（Vercel Edge：1.5秒；Cloudflare Workers：有 CPU 時間限制）。正確用途：Middleware 應該只做「路由層面的決策」（重定向、rewrite），不應做複雜業務邏輯。',
      },
      {
        order: 5,
        question: 'Middleware 的 NextResponse.rewrite() 和 NextResponse.redirect() 的差異是什麼？',
        options: [
          '兩者完全相同，只是命名不同',
          'redirect()：告訴瀏覽器「去另一個 URL」（HTTP 301/302），URL 改變，瀏覽器可見；rewrite()：在伺服器端「偷換」實際服務的路由，URL 保持不變，瀏覽器不知道。rewrite 常用於 A/B 測試（URL 不變但實際顯示不同版本）、i18n 路由（/ 顯示 /zh-TW/home 的內容）',
          'redirect() 只能重定向到外部 URL，rewrite() 只能用於內部路由',
          'rewrite() 需要比 redirect() 更多的執行時間',
        ],
        answer: 1,
        explanation:
          '使用場景舉例：redirect：未登入用戶訪問 /dashboard → redirect 到 /login（URL 改變，用戶知道被重定向）；rewrite：A/B 測試，50% 的用戶訪問 /landing → rewrite 到 /landing-variant-b（URL 保持 /landing，用戶不知道看到的是 B 版）；i18n：用戶語言是中文，訪問 / → rewrite 到 /zh-TW（URL 保持 /，但內容是中文版）。redirect 的 HTTP 狀態碼可設定：NextResponse.redirect(url, { status: 301 })（永久）或 302（臨時，預設）。',
      },
    ],
  },

  {
    slug: 'nextjs-server-components',
    title: 'React Server Components 原理',
    description:
      '深入了解 RSC 的渲染流程、RSC Payload、零 bundle 特性，以及 Server Component 的能力和限制。',
    difficulty: 'hard',
    subCategory: 'Server Components',
    questions: [
      {
        order: 1,
        question:
          'React Server Components（RSC）和傳統 React 元件（Client Component）最根本的差異是什麼？',
        options: [
          'RSC 只能顯示靜態文字，不能有動態內容',
          'RSC 在伺服器上執行並渲染，其 JavaScript 程式碼不會被打包發送到客戶端（零 bundle 貢獻），可以直接存取後端資源（資料庫、檔案系統）；Client Component 在客戶端執行，支援 state、event handler、瀏覽器 API',
          'RSC 是 Next.js 專有的功能，React 本身沒有這個概念',
          'RSC 和 Client Component 效能完全相同，只是執行位置不同',
        ],
        answer: 1,
        explanation:
          'RSC 的革命性之處在於「程式碼分離」：RSC 的程式碼（包含它的依賴套件）永遠不會出現在客戶端的 JavaScript bundle 中，顯著減小 bundle 大小。RSC 可以直接 import 伺服器端才有的資源：資料庫 ORM（Prisma、Drizzle）、fs（讀取本地文件）、環境變數（PRIVATE_KEY）。RSC 的限制：不能使用 useState、useEffect、event handler（onClick）、Context（createContext）、瀏覽器 API（window、localStorage）。App Router 中，所有元件預設是 Server Component，只有加 "use client" 才是 Client Component。',
      },
      {
        order: 2,
        question: 'RSC Payload 是什麼？它在 Next.js 的渲染流程中起什麼作用？',
        options: [
          'RSC Payload 是 API 請求的回應資料格式',
          'RSC Payload 是 Server Component 渲染結果的特殊序列化格式（類似 JSON 但可表示 React 樹結構），包含：Server Component 的渲染輸出、Client Component 的佔位符（placeholders）和對應 bundle 的引用、從 Server Component 傳給 Client Component 的 props。瀏覽器用它重建 React 樹並 hydrate',
          'RSC Payload 是 Next.js 的快取機制',
          'RSC Payload 只在開發模式下使用',
        ],
        answer: 1,
        explanation:
          'RSC Payload 的流程：伺服器渲染 Server Component 樹 → 遇到 Client Component 時，記錄「這裡需要 <ClientComp prop1={...} />」和對應的 JS 檔案路徑 → 將整個樹序列化為 RSC Payload（二進位的 React Server Component Format）。瀏覽器收到 RSC Payload 後：1) 用它重建 React 虛擬 DOM 樹；2) 下載 Client Component 的 JS bundle；3) Hydration（為 Client Component 附加 event handler）。RSC Payload 和 HTML Streaming 同時進行，在 Network 面板可以看到 RSC 格式的回應（有時看到 H 前綴的格式）。',
      },
      {
        order: 3,
        question:
          'Server Component 可以 import Client Component 嗎？Client Component 可以 import Server Component 嗎？',
        options: [
          '兩個方向都不可以，必須保持完全分離',
          'Server Component 可以 import 並渲染 Client Component（常見做法）；Client Component 不能直接 import Server Component（因為 Client Component 在客戶端執行，無法執行伺服器邏輯）。但可以把 Server Component 作為 children prop 傳給 Client Component',
          'Client Component 可以 import Server Component，但 Server Component 不能 import Client Component',
          '兩個方向都可以，沒有限制',
        ],
        answer: 1,
        explanation:
          '正確的組合方式：Server → Client：Server Component import 並渲染 Client Component 是標準用法，Server 傳遞 props 給 Client。Client → Server（通過 children）：Client Component 不能 import Server Component，但可以接受 Server Component 作為 children：在父層的 Server Component 中 <ClientWrapper>{serverContent}</ClientWrapper>，serverContent 仍在伺服器執行。這讓 "use client" 邊界不會把子樹的 Server Component 污染為 Client Component。React 的原則：Client Component 的 "use client" 是一道「邊界」，邊界內的所有 import 都變成 Client Component。',
      },
      {
        order: 4,
        question:
          '以下哪些操作在 Server Component 中是「可以的」？哪些是「不行的」？\n\n可以：直接 await 資料庫查詢、使用環境變數（process.env）、import 只在 Node.js 運行的套件\n不行：useState、useEffect、onClick handler、useContext、window 物件',
        options: [
          'Server Component 和 Client Component 有相同的能力，沒有限制',
          '正確。Server Component 可以：直接 async/await 資料庫查詢（無需 API Route 中介）、讀取伺服器端環境變數（包含私密 key）、使用 Node.js 專屬套件。不能使用：React Hooks（useState、useEffect、useContext）、事件處理器（onClick、onChange）、瀏覽器 API（window、document、localStorage）',
          'Server Component 可以使用 useState 但不能用 useEffect',
          'Server Component 不能 import npm 套件，只能使用 Next.js 內建 API',
        ],
        answer: 1,
        explanation:
          'Server Component 的能力對比：可以 → 直接 await prisma.user.findMany()（無需建 API endpoint）、import "fs" 讀取本地文件、使用 process.env.DATABASE_URL（私密環境變數，不會洩漏到客戶端）、import "bcrypt"（Node.js 套件，不打包到瀏覽器）。不能 → useState、useReducer（沒有客戶端狀態）、useEffect、useLayoutEffect（沒有瀏覽器生命週期）、onClick 等事件（沒有瀏覽器事件）、createContext/useContext（Client Component 特有）、localStorage、sessionStorage（瀏覽器 API）。',
      },
      {
        order: 5,
        question: 'Server Component 和 async 函式的關係是什麼？為什麼可以直接 await？',
        options: [
          'Server Component 和普通 async 函式沒有任何關係',
          'App Router 的 Server Component 可以是 async 函式元件（async function Page()），因為它在伺服器端執行，可以使用 Node.js 的非同步 I/O。這讓資料獲取直接在元件中完成，不需要 useEffect + fetch 的客戶端模式，也不需要 getServerSideProps 這樣的特殊 API',
          'async Server Component 會阻塞整個頁面渲染，因此不建議使用',
          'Server Component 不能是 async 函式，只能用 useEffect 取得資料',
        ],
        answer: 1,
        explanation:
          'Server Component 是 async function 的革命性意義：在 Pages Router 時代，資料獲取需要特殊的 getServerSideProps / getStaticProps 函式，且只能在頁面級別使用，資料必須透過 props 層層傳遞。App Router 讓任何層級的元件都可以 async：async function ProductCard({ id }: { id: string }) { const product = await db.product.findUnique({ where: { id } }); return <div>{product.name}</div> }。這讓資料獲取和使用資料的 UI 可以在同一個元件（co-location），消除 prop drilling 和 "waterfall" 問題（可以在各元件並行獲取資料）。',
      },
    ],
  },

  {
    slug: 'nextjs-server-client-boundary',
    title: 'Server / Client Component 邊界設計',
    description:
      '理解何時使用 "use client"、Client Component 邊界規則、如何最小化 Client Bundle，以及 Context 在 Server Component 中的使用。',
    difficulty: 'hard',
    subCategory: 'Server Components',
    questions: [
      {
        order: 1,
        question: '什麼情況下「必須」使用 "use client"？',
        options: [
          '所有會顯示動態資料的元件都需要 "use client"',
          '需要 "use client" 的情況：使用 React Hooks（useState、useEffect、useContext、useRef 等）；使用事件處理器（onClick、onChange、onSubmit）；使用瀏覽器 API（window、localStorage、navigator）；使用依賴 state 或 event 的第三方套件（如動畫庫 framer-motion）',
          '所有元件都需要 "use client"，否則 Next.js 無法渲染',
          '"use client" 只在處理表單時需要',
        ],
        answer: 1,
        explanation:
          '"use client" 是一個「邊界聲明」，告訴 Next.js「這個元件及其 import 的所有模組都在客戶端執行」。不需要 "use client" 的情況：純展示 UI（渲染 props 傳進來的資料）、呼叫資料庫或 API（Server Component 直接 await）、存取環境變數、讀取 cookies 或 headers（App Router 的 cookies()、headers() 函式）。設計原則：盡量讓 "use client" 的邊界往葉節點（leaf nodes）下推，讓大部分 UI 保持為 Server Component。',
      },
      {
        order: 2,
        question: '「將 Client Component 下推（Push Client Down）」策略是什麼？為什麼重要？',
        options: [
          '這是一個 CSS 佈局技術，讓元件在視窗底部渲染',
          '讓需要 "use client" 的互動邏輯盡量集中在元件樹的葉節點，而不是在父層使用 "use client" 讓整個子樹都變成 Client Component。這樣大部分父元件保持 Server Component，減少客戶端 bundle 大小，保留 Server Component 的優勢（直接存取資料庫、零 bundle 貢獻）',
          '"Push Client Down" 讓 Client Component 比 Server Component 晚渲染',
          '這只是 Next.js 的命名慣例，沒有實際效能影響',
        ],
        answer: 1,
        explanation:
          '反例（差）：在頂層 Page 加 "use client"（因為 Page 有一個按鈕需要 onClick），導致整個頁面樹都是 Client Component，無法直接存取資料庫，所有套件都進 bundle。正例（好）：Page 是 Server Component，直接獲取資料；只有含 onClick 的 <LikeButton> 加 "use client"；其他如 <ProductInfo>、<ReviewList> 保持 Server Component。結果：bundle 只包含 LikeButton 的程式碼，ProductInfo 和 ReviewList 的依賴（如資料格式化函式庫）不進 bundle。',
      },
      {
        order: 3,
        question:
          'React Context（createContext / useContext）可以在 Server Component 中使用嗎？如何在 App Router 中提供全域狀態？',
        options: [
          'Context 在 Server Component 和 Client Component 中都可以使用',
          'createContext 和 useContext 不能在 Server Component 中使用（Context 是 Client Component 的機制）。在 App Router 中提供全域狀態的方式：1) 在 "use client" 的 Provider 元件中 createContext + useState；2) 在 layout.tsx 中 import 這個 Provider（layout 本身可以是 Server Component，只需 import Client Provider）；3) 在子 Client Component 中 useContext',
          'Server Component 支援 useContext 但不支援 createContext',
          'App Router 完全不支援 Context，必須用 Redux 替代',
        ],
        answer: 1,
        explanation:
          '正確的 App Router Context 模式：建立 ThemeProvider（"use client"），內含 createContext + useState + Provider；在 app/layout.tsx（Server Component）中 import ThemeProvider：<ThemeProvider><body>{children}</body></ThemeProvider>。layout.tsx 本身保持 Server Component，只是用了一個 Client Component 作為 wrapper。子元件若需要使用 Context 值，必須是 Client Component 並呼叫 useContext。App Router 官方推薦的全域狀態方案也包含 Zustand、Jotai 等 client-side 狀態管理套件。',
      },
      {
        order: 4,
        question:
          '如何安全地將 Server Component 的資料傳遞給 Client Component？有什麼限制？',
        options: [
          'Server Component 和 Client Component 之間不能傳遞任何資料',
          'Server Component 可以將資料作為 props 傳給 Client Component，但 props 必須「可序列化」（能夠從伺服器序列化後在客戶端反序列化）：字串、數字、陣列、普通物件都可以；不能傳遞：函式（箭頭函式、class 方法）、Date 物件（需轉成 string 或 timestamp）、React 元件實例',
          'Server Component 傳給 Client Component 的 props 沒有任何限制',
          'Server Component 只能傳遞字串型別的 props',
        ],
        answer: 1,
        explanation:
          '可序列化 props 的範圍：✅ string、number、boolean、null、undefined、陣列（element 需可序列化）、普通物件（value 需可序列化）、BigInt（在 Next.js 15+）。❌ 函式（無法序列化傳到客戶端）、Date 物件（建議轉成 ISO string：date.toISOString()）、Map、Set（轉成陣列）、class 實例（轉成普通物件）。解決「傳遞函式」的需求：Server Action（函式在伺服器執行，透過 RPC 機制呼叫）；或在 Client Component 中定義函式，不從 Server 傳遞。',
      },
      {
        order: 5,
        question: '"use server" 指令的作用是什麼？它和 Server Component 的預設行為有什麼差別？',
        options: [
          '"use server" 讓一個 Client Component 在伺服器端執行',
          '"use server" 標記一個函式（或模組中所有函式）為 Server Action：這些函式可以在 Client Component 中呼叫，但實際在伺服器上執行（類似 RPC）。和 Server Component 不同：Server Component 是整個元件在伺服器渲染；"use server" 是特定函式在客戶端呼叫時被路由到伺服器執行',
          '"use server" 是 App Router 的預設行為，不需要額外宣告',
          '"use server" 讓元件的資料獲取在伺服器快取',
        ],
        answer: 1,
        explanation:
          '"use server" 的使用方式：在 Server Action 函式頂部加 "use server" 或在整個模組頂部加（讓模組中所有匯出函式都成為 Server Action）。Server Action 的典型用途：表單提交（<form action={serverAction}>）、按鈕點擊觸發資料突變（createPost、deleteUser）、搭配 useFormStatus / useActionState。和 API Route 的差別：Server Action 不需要建立獨立的 API endpoint，Next.js 自動處理序列化和網路傳輸；API Route 更適合需要從第三方呼叫的端點。',
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

  console.log('\n✅ Next.js 主題（Part 2）建立完成')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
