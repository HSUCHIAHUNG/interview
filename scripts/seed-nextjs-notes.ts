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
    slug: 'nextjs-rendering-modes',
    sections: [
      {
        heading: '四種渲染模式比較',
        content: `| 模式 | HTML 產生時機 | TTFB | SEO | 資料新鮮度 | 適用場景 |
|------|--------------|------|-----|-----------|---------|
| SSR | 每次請求，伺服器即時渲染 | 較高（等資料） | 極佳 | 即時 | 個人化頁面、需要用戶 cookie |
| SSG | Build time 靜態生成 | 最低（CDN 直接回應） | 極佳 | Build 時 | 官網、文件、部落格 |
| ISR | Build time + 定期背景重生成 | 低（快取命中） | 極佳 | 可控（revalidate 間隔） | 電商產品頁、新聞 |
| CSR | 瀏覽器執行 JS 後動態渲染 | 最低（空 HTML） | 差 | 即時 | 儀表板、高互動 SPA |

**選擇決策樹：**

1. 資料是否為個人化或需要 cookie？→ **SSR**
2. 資料是否幾乎不變（文件、部落格）？→ **SSG**
3. 資料會更新但不需要即時？→ **ISR**（設定合適的 revalidate 間隔）
4. 頁面高互動、SEO 不重要？→ **CSR**
5. 以上混合？→ 同一個 Next.js 應用中多種模式共存`,
      },
      {
        heading: 'App Router 中的靜態與動態渲染',
        content: `App Router **預設嘗試靜態渲染**，遇到以下情況自動切換為動態渲染：

- 呼叫動態函式：\`cookies()\`、\`headers()\`、\`searchParams\`
- fetch 設定 \`cache: 'no-store'\`

**\`export const dynamic\` 選項：**

\`\`\`ts
// app/dashboard/page.tsx

// 強制動態渲染（每次請求重新渲染）
export const dynamic = 'force-dynamic'

// 強制靜態渲染（build time，若有動態函式則報錯）
export const dynamic = 'force-static'

// 有動態函式時報錯，強制靜態（適合確保頁面不會意外變動態）
export const dynamic = 'error'

// 預設值：自動判斷
export const dynamic = 'auto'
\`\`\`

\`\`\`ts
// 動態函式觸發動態渲染示例
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies() // 觸發動態渲染
  const theme = cookieStore.get('theme')
  return <div>Theme: {theme?.value}</div>
}
\`\`\``,
      },
      {
        heading: '各渲染模式適用場景決策指南',
        content: `**SSG 最適合：**
- 行銷官網、Landing Page
- 技術文件、說明頁面
- 部落格文章（內容固定）
- 每次 build 才更新的內容

**ISR 最適合：**
- 電商產品頁（庫存/價格定期更新）
- 新聞文章（發佈後偶爾修改）
- 大型資料集的靜態化（不可能全部在 build time 產生）

**SSR 最適合：**
- 個人化內容（用戶特定的推薦、購物車）
- 需要讀取 cookie 或 authorization header
- 即時資料（股票、體育賽事）

**CSR 最適合：**
- 登入後的儀表板（SEO 不重要）
- 高互動 SPA 功能（即時協作、圖表）
- 第三方 widget

**在同一個 Next.js 應用中共存：**

\`\`\`
app/
├── page.tsx          ← SSG（首頁，靜態）
├── blog/
│   └── [slug]/
│       └── page.tsx  ← ISR（revalidate: 3600）
├── products/
│   └── [id]/
│       └── page.tsx  ← ISR（revalidate: 300）
├── dashboard/
│   └── page.tsx      ← SSR（需要 cookie）
└── editor/
    └── page.tsx      ← CSR（高互動，use client）
\`\`\``,
      },
    ],
  },
  {
    slug: 'nextjs-ssr-deep',
    sections: [
      {
        heading: 'SSR 完整渲染流程與 Hydration',
        content: `**SSR 完整步驟：**

1. 用戶發出請求
2. 伺服器執行 Server Component，獲取資料（DB、API）
3. React 呼叫 \`renderToPipeableStream\` 生成 HTML 字串
4. HTML 傳送到瀏覽器，用戶看到畫面（FCP）
5. 瀏覽器下載 JavaScript bundle
6. React 執行 Hydration（將事件監聽器附加到現有 DOM）
7. 頁面可互動（TTI）

**Hydration Mismatch 常見原因與修復：**

\`\`\`tsx
// ❌ 問題：Date.now() 在伺服器和客戶端不同
export default function Page() {
  return <div>Time: {Date.now()}</div>
}

// ✅ 修復：在 Client Component 中用 useEffect 處理
'use client'
import { useState, useEffect } from 'react'

export default function ClientTime() {
  const [time, setTime] = useState<number | null>(null)
  useEffect(() => {
    setTime(Date.now())
  }, [])
  return <div>Time: {time ?? 'Loading...'}</div>
}
\`\`\`

**其他常見 Mismatch 原因：**
- \`Math.random()\` 伺服器/客戶端值不同
- 瀏覽器外掛修改 DOM（廣告攔截器、翻譯工具）
- 時區不一致導致日期格式差異`,
      },
      {
        heading: 'SSR 與 SEO、效能指標',
        content: `**SSR 對 SEO 的好處：**
- 爬蟲（Googlebot）可立即獲得完整 HTML，無需執行 JS
- 社群媒體爬蟲（Open Graph）正確讀取 meta tags
- 內容可被即時索引，不需等待 JS 執行

**SSR 的效能限制：**
- TTFB（Time to First Byte）較高，因為需要等伺服器資料獲取完畢
- 伺服器負載較大，每次請求都需要渲染

**FCP vs TTI 在不同渲染方式的表現：**

| 指標 | SSR | CSR |
|------|-----|-----|
| FCP（First Contentful Paint） | 快（HTML 直接渲染） | 慢（需等 JS 執行） |
| TTI（Time to Interactive） | 需等 Hydration | JS 載入後即可互動 |
| TTFB | 較高（等伺服器） | 低（空 HTML 即返回） |

**優化 SSR TTFB 的方法：**

1. **Streaming**：使用 \`Suspense\` 逐步傳送 HTML
2. **Edge Runtime**：將渲染移至離用戶更近的邊緣節點

\`\`\`ts
// 使用 Edge Runtime
export const runtime = 'edge'
\`\`\`

3. **資料快取**：減少重複的資料庫/API 呼叫
4. **並行資料獲取**：避免串行 waterfall`,
      },
      {
        heading: 'HTML Streaming 與 Suspense',
        content: `React 18 的 \`renderToPipeableStream\` 讓伺服器**逐步傳送 HTML chunks**，不需等所有資料準備好才回應。

**Suspense 讓慢的部分先顯示 fallback：**

\`\`\`tsx
// app/page.tsx
import { Suspense } from 'react'
import FastComponent from './FastComponent'
import SlowComponent from './SlowComponent'

export default function Page() {
  return (
    <div>
      <FastComponent />  {/* 立即渲染 */}
      <Suspense fallback={<div>Loading slow content...</div>}>
        <SlowComponent />  {/* 資料準備好才替換 fallback */}
      </Suspense>
    </div>
  )
}
\`\`\`

**\`loading.tsx\` 的底層機制：**

\`loading.tsx\` 是 Next.js 自動將 \`page.tsx\` 包裹在 \`<Suspense>\` 中的語法糖：

\`\`\`
app/dashboard/
├── loading.tsx   ← 自動成為 Suspense fallback
└── page.tsx      ← 被 Suspense 包裹
\`\`\`

**巢狀 Suspense 範例：**

\`\`\`tsx
export default function Dashboard() {
  return (
    <div>
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      <div className="grid grid-cols-2">
        <Suspense fallback={<CardSkeleton />}>
          <RevenueCard />
        </Suspense>
        <Suspense fallback={<CardSkeleton />}>
          <UserCard />
        </Suspense>
      </div>
    </div>
  )
}
\`\`\`

各 Suspense 邊界獨立解析，互不阻塞，實現最佳的漸進式渲染。`,
      },
    ],
  },
  {
    slug: 'nextjs-isr',
    sections: [
      {
        heading: 'ISR 的 stale-while-revalidate 機制',
        content: `ISR（Incremental Static Regeneration）結合了 SSG 的速度和資料更新能力。

**快取過期後的行為（stale-while-revalidate）：**

\`\`\`
時間軸：

0s     → 頁面生成並快取（新鮮）
60s    → revalidate 時間到，快取「過期」但仍存在

第一個請求（60s 後）：
  ├── 用戶收到：舊的快取頁面（stale）⚡ 快
  └── 背景觸發：重新生成新頁面

第二個請求（生成完成後）：
  └── 用戶收到：新生成的頁面 ✅
\`\`\`

**\`export const revalidate\` 的使用：**

\`\`\`ts
// app/products/[id]/page.tsx

// 設定整個路由每 60 秒重新驗證一次
export const revalidate = 60

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await fetch(\`https://api.example.com/products/\${params.id}\`, {
    next: { revalidate: 60 } // 也可以在 fetch 層級設定
  }).then(r => r.json())

  return <ProductDetail product={product} />
}
\`\`\`

**注意：** \`revalidate: 0\` 等同於 SSR，\`revalidate: false\`（或不設定）等同於永久快取（SSG）。`,
      },
      {
        heading: 'On-demand Revalidation',
        content: `按需重新驗證讓你在 CMS 更新時**立即**使相關快取失效，不需等 revalidate 時間到。

**CMS Webhook 完整工作流程：**

\`\`\`
CMS 更新文章
    ↓
CMS 觸發 Webhook → POST /api/revalidate
    ↓
API Route 呼叫 revalidateTag('articles')
    ↓
所有帶 articles tag 的 fetch 快取失效
    ↓
下一次請求時重新獲取新資料
\`\`\`

**fetch 中設定 tags：**

\`\`\`ts
// 在 fetch 中加入 tag
const articles = await fetch('https://api.example.com/articles', {
  next: { tags: ['articles'] }
}).then(r => r.json())

// 特定文章
const article = await fetch(\`https://api.example.com/articles/\${id}\`, {
  next: { tags: ['articles', \`article-\${id}\`] }
}).then(r => r.json())
\`\`\`

**API Route 處理 Webhook：**

\`\`\`ts
// app/api/revalidate/route.ts
import { revalidateTag, revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-webhook-secret')

  // 驗證 Webhook 來源
  if (secret !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { tag, path } = await request.json()

  if (tag) revalidateTag(tag)          // 讓所有帶此 tag 的 fetch 失效
  if (path) revalidatePath(path)       // 讓特定路徑失效

  return NextResponse.json({ revalidated: true, now: Date.now() })
}
\`\`\``,
      },
      {
        heading: 'generateStaticParams 與動態路由靜態化',
        content: `\`generateStaticParams\` 在 **build time** 預先列舉動態路由參數，Next.js 提前生成對應的靜態頁面。

\`\`\`ts
// app/blog/[slug]/page.tsx

export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json())

  // 回傳所有可能的 slug
  return posts.map((post: { slug: string }) => ({
    slug: post.slug,
  }))
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await fetch(\`https://api.example.com/posts/\${params.slug}\`).then(r => r.json())
  return <article>{post.content}</article>
}
\`\`\`

**\`dynamicParams\` 控制未列舉的路由：**

\`\`\`ts
// true（預設）：未在 generateStaticParams 中的路由，按需生成並快取
export const dynamicParams = true

// false：未列舉的路由直接回傳 404
export const dynamicParams = false
\`\`\`

**搭配 ISR 的最佳實踐：**

\`\`\`ts
// Build time 生成熱門產品頁，新產品按需生成
export const revalidate = 3600 // 每小時重新驗證

export async function generateStaticParams() {
  // 只預先生成最熱門的 100 個產品
  const topProducts = await getTopProducts(100)
  return topProducts.map(p => ({ id: p.id }))
}

// dynamicParams = true（預設）
// 新產品：首次請求時生成並快取，之後每小時重新驗證
\`\`\``,
      },
    ],
  },
  {
    slug: 'nextjs-app-router',
    sections: [
      {
        heading: 'App Router 特殊檔案慣例',
        content: `App Router 使用**檔案慣例（File Conventions）**定義路由行為：

| 檔案 | 用途 | 使用時機 |
|------|------|---------|
| \`page.tsx\` | 路由的主要 UI，使路由可公開訪問 | 每個路由必須有 |
| \`layout.tsx\` | 跨路由共享的 UI，不在導覽時重新 mount | 共享導覽列、側邊欄 |
| \`template.tsx\` | 類似 layout，但每次導覽**重新 mount** | 需要重置狀態的框架 |
| \`loading.tsx\` | Suspense fallback，路由渲染前顯示 | 顯示骨架屏、載入動畫 |
| \`error.tsx\` | Error Boundary，捕捉子路由錯誤 | 路由級錯誤處理 |
| \`not-found.tsx\` | 404 頁面，\`notFound()\` 觸發 | 資源不存在 |
| \`route.ts\` | API endpoint，替代 pages/api | 建立 REST API |
| \`default.tsx\` | Parallel Routes 的預設 UI | @slot 的 fallback |

**layout vs template 的選擇：**

\`\`\`
layout.tsx  → 狀態保持，不重新 mount（scroll 位置保留、動畫不重播）
template.tsx → 每次導覽重新 mount（適合需要 mount 動畫、重置表單狀態）
\`\`\`

**資料夾結構示意：**

\`\`\`
app/
├── layout.tsx          ← Root Layout（必須）
├── page.tsx            ← 首頁 /
├── loading.tsx         ← 首頁載入狀態
├── dashboard/
│   ├── layout.tsx      ← Dashboard 共享 layout
│   ├── page.tsx        ← /dashboard
│   ├── error.tsx       ← Dashboard 錯誤邊界
│   └── settings/
│       └── page.tsx    ← /dashboard/settings
└── api/
    └── users/
        └── route.ts    ← GET/POST /api/users
\`\`\``,
      },
      {
        heading: '巢狀 Layout 與 metadata API',
        content: `**巢狀 Layout 繼承結構：**

\`\`\`tsx
// app/layout.tsx（Root Layout，必須包含 html 和 body）
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body>
        <nav>全域導覽列</nav>
        {children}
      </body>
    </html>
  )
}

// app/dashboard/layout.tsx（巢狀 Layout）
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <aside>側邊欄</aside>
      <main>{children}</main>
    </div>
  )
}
\`\`\`

**Metadata API：**

\`\`\`ts
// 靜態 metadata
export const metadata: Metadata = {
  title: {
    template: '%s | My App',  // %s 會被子路由的 title 替換
    default: 'My App',
  },
  description: '我的應用程式',
}

// 動態 metadata（根據路由參數生成）
export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const product = await getProduct(params.id)
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      images: [product.image],
    },
  }
}
\`\`\`

**Title Template 繼承：**

\`\`\`
Root Layout: title.template = '%s | My App'
  ↓
Product Page: title = 'iPhone 15'
  ↓
最終渲染：<title>iPhone 15 | My App</title>
\`\`\``,
      },
      {
        heading: 'error.tsx 與 not-found.tsx 的邊界設計',
        content: `**error.tsx 的作用範圍：**

\`error.tsx\` 作為 React Error Boundary，捕捉**子路由的渲染錯誤**：
- 不捕捉**同層 layout.tsx** 的錯誤（需要父層的 error.tsx）
- 必須是 **Client Component**（\`"use client"\`）
- 提供 \`reset\` 函式讓用戶重試

\`\`\`tsx
// app/dashboard/error.tsx
'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>發生錯誤</h2>
      <button onClick={() => reset()}>重試</button>
    </div>
  )
}
\`\`\`

**global-error.tsx：**

\`\`\`tsx
// app/global-error.tsx
// 捕捉 Root Layout 的錯誤，必須包含 html 和 body
'use client'

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html>
      <body>
        <h2>嚴重錯誤</h2>
        <button onClick={() => reset()}>重試</button>
      </body>
    </html>
  )
}
\`\`\`

**notFound() 的使用：**

\`\`\`ts
// app/products/[id]/page.tsx
import { notFound } from 'next/navigation'

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound() // 觸發最近的 not-found.tsx
  }

  return <ProductDetail product={product} />
}
\`\`\``,
      },
    ],
  },
  {
    slug: 'nextjs-routing-advanced',
    sections: [
      {
        heading: '動態路由與 Catch-all 路由',
        content: `**三種動態路由語法對比：**

| 語法 | 匹配範例 | params 型別 |
|------|---------|------------|
| \`[slug]\` | \`/blog/hello\` | \`{ slug: string }\` |
| \`[...slug]\` | \`/blog/2024/01/hello\` | \`{ slug: string[] }\` |
| \`[[...slug]]\` | \`/blog\` 或 \`/blog/hello\` | \`{ slug?: string[] }\` |

\`\`\`tsx
// app/blog/[...slug]/page.tsx
export default function BlogPost({
  params,
}: {
  params: { slug: string[] }
}) {
  // /blog/2024/01/hello → slug: ['2024', '01', 'hello']
  const path = params.slug.join('/')
  return <div>Path: {path}</div>
}

// generateStaticParams 搭配動態路由
export async function generateStaticParams() {
  return [
    { slug: ['2024', '01', 'post-1'] },
    { slug: ['2024', '02', 'post-2'] },
  ]
}
\`\`\`

**useParams 在 Client Component 中使用：**

\`\`\`tsx
'use client'
import { useParams } from 'next/navigation'

export default function ProductDetails() {
  const params = useParams<{ id: string }>()
  return <div>Product ID: {params.id}</div>
}
\`\`\``,
      },
      {
        heading: 'Route Groups 與多 Layout 架構',
        content: `Route Groups 用 \`(group)\` 語法建立，**不影響 URL 結構**，純粹用於組織程式碼和套用不同 layout。

**資料夾結構：**

\`\`\`
app/
├── (marketing)/          ← URL 透明，/about 而非 /marketing/about
│   ├── layout.tsx        ← 行銷頁面專用 layout（大圖、全寬）
│   ├── about/
│   │   └── page.tsx      ← /about
│   └── pricing/
│       └── page.tsx      ← /pricing
│
├── (app)/                ← URL 透明，/dashboard 而非 /app/dashboard
│   ├── layout.tsx        ← 應用程式 layout（側邊欄、需要登入）
│   ├── dashboard/
│   │   └── page.tsx      ← /dashboard
│   └── settings/
│       └── page.tsx      ← /settings
│
└── layout.tsx            ← Root Layout（共享）
\`\`\`

**多個 Root Layout：**

如果兩個 Route Group **都有** \`layout.tsx\` 且**都沒有**共同的父層 \`layout.tsx\`，可以各自成為 Root Layout（需要各自包含 \`<html>\` 和 \`<body>\`）：

\`\`\`
app/
├── (marketing)/
│   ├── layout.tsx  ← 包含 <html><body>，行銷頁的 Root Layout
│   └── ...
└── (app)/
    ├── layout.tsx  ← 包含 <html><body>，應用頁的 Root Layout
    └── ...
\`\`\`

這樣可以讓不同群組有完全不同的 \`<head>\` 設定和樣式。`,
      },
      {
        heading: 'Parallel Routes 與 Intercepting Routes',
        content: `**Parallel Routes（\`@slot\` 語法）：**

在同一個 layout 中**同時渲染多個頁面**：

\`\`\`
app/dashboard/
├── layout.tsx        ← 使用 @team 和 @analytics slots
├── page.tsx          ← /dashboard 主頁
├── @team/
│   └── page.tsx      ← 團隊面板
└── @analytics/
    └── page.tsx      ← 分析面板
\`\`\`

\`\`\`tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  team,
  analytics,
}: {
  children: React.ReactNode
  team: React.ReactNode
  analytics: React.ReactNode
}) {
  return (
    <div>
      {children}
      <div className="grid grid-cols-2">
        {team}
        {analytics}
      </div>
    </div>
  )
}
\`\`\`

**\`default.tsx\`** 是 slot 的 fallback，當該 slot 沒有匹配的 page 時顯示。

**Intercepting Routes：**

攔截路由讓你在保持 URL 的同時用**模態框**顯示內容（例如相片圖庫）：

| 語法 | 攔截範圍 |
|------|---------|
| \`(.)slug\` | 同層路由 |
| \`(..)slug\` | 上一層路由 |
| \`(...)slug\` | 從 root 開始 |

\`\`\`
app/
├── @modal/
│   └── (.)photos/[id]/
│       └── page.tsx   ← 攔截 /photos/[id]，顯示模態框
├── photos/
│   └── [id]/
│       └── page.tsx   ← 直接訪問時的完整頁面
└── layout.tsx
\`\`\``,
      },
    ],
  },
  {
    slug: 'nextjs-middleware',
    sections: [
      {
        heading: 'Middleware 執行流程與能力',
        content: `Middleware 在請求管線中的位置：

\`\`\`
用戶請求
    ↓
CDN（快取命中直接回傳）
    ↓
Middleware（在路由前執行）← 在這裡
    ↓
路由處理（layout、page、route handler）
\`\`\`

**Middleware 可執行的操作：**
- \`redirect()\`：重新導向到不同 URL
- \`rewrite()\`：透明替換路由（URL 不變）
- 修改 request/response headers
- 直接回傳 Response（短路，不進入路由）

**\`middleware.ts\` 完整框架：**

\`\`\`ts
// middleware.ts（放在專案根目錄）
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 你的邏輯
  return NextResponse.next()
}

// matcher 設定：只對匹配的路徑執行 middleware
export const config = {
  matcher: [
    // 排除靜態資源和 Next.js 內部路由
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
\`\`\`

**matcher 語法：**
\`\`\`ts
matcher: [
  '/dashboard/:path*',        // 匹配 /dashboard 及所有子路由
  '/api/:path*',              // 匹配所有 API 路由
  '/((?!public).*)',          // 排除 /public 開頭的路徑
]
\`\`\``,
      },
      {
        heading: 'Middleware 常見使用場景',
        content: `**1. 認證保護（JWT 驗證 + redirect）：**

\`\`\`ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*'],
}
\`\`\`

**2. 地區化路由（Accept-Language → rewrite）：**

\`\`\`ts
export function middleware(request: NextRequest) {
  const acceptLanguage = request.headers.get('accept-language') ?? 'en'
  const locale = acceptLanguage.startsWith('zh') ? 'zh' : 'en'

  const { pathname } = request.nextUrl
  // 將 /about 改寫為 /zh/about 或 /en/about
  return NextResponse.rewrite(new URL(\`/\${locale}\${pathname}\`, request.url))
}
\`\`\`

**3. A/B 測試（隨機分組 + rewrite）：**

\`\`\`ts
export function middleware(request: NextRequest) {
  const bucket = request.cookies.get('ab-bucket')?.value
    ?? (Math.random() > 0.5 ? 'b' : 'a')

  const response = NextResponse.rewrite(
    new URL(\`/landing-\${bucket}\`, request.url)
  )

  // 將分組記錄在 cookie 中，保持一致性
  response.cookies.set('ab-bucket', bucket, { maxAge: 60 * 60 * 24 * 7 })
  return response
}
\`\`\``,
      },
      {
        heading: 'Edge Runtime 與 redirect vs rewrite',
        content: `**Edge Runtime 的特點：**

優勢：
- 低延遲（在離用戶最近的邊緣節點執行）
- 全球部署，冷啟動時間極短（< 1ms）
- 適合輕量的請求處理邏輯

限制：
- 無法使用 Node.js 原生 API（\`fs\`、\`path\`、\`crypto\` 等）
- 無法使用依賴 Node.js 的 npm 套件
- 記憶體限制較小（128MB）

**Middleware 預設在 Edge Runtime 執行**，不需要額外設定。

---

**redirect vs rewrite 的核心差異：**

| | redirect | rewrite |
|-|----------|---------|
| URL 變化 | 瀏覽器 URL 改變 | URL 不變 |
| HTTP 狀態碼 | 301/302/307/308 | 無（透明） |
| 瀏覽器可見 | 是 | 否 |
| 適用場景 | 舊 URL 遷移、登入後跳轉 | A/B 測試、地區化、功能開關 |

\`\`\`ts
// redirect：URL 改變，瀏覽器可見
NextResponse.redirect(new URL('/new-page', request.url))
// 用戶的瀏覽器 URL 從 /old-page 變成 /new-page

// rewrite：URL 不變，透明替換
NextResponse.rewrite(new URL('/internal-page', request.url))
// 用戶的瀏覽器 URL 依然是 /old-page，但實際渲染 /internal-page

// 指定 redirect 狀態碼
NextResponse.redirect(new URL('/login', request.url), { status: 307 })
// 307：暫時重新導向（保留 HTTP 方法）
// 308：永久重新導向（保留 HTTP 方法）
\`\`\``,
      },
    ],
  },
  {
    slug: 'nextjs-server-components',
    sections: [
      {
        heading: 'RSC 的核心能力與限制',
        content: `**React Server Components（RSC）可以：**

| 能力 | 說明 |
|------|------|
| \`async/await\` 直接查詢資料 | 在 Component 內直接 \`await\` DB 或 API |
| import Node.js 套件 | 如 \`fs\`、\`crypto\`、\`sharp\`、ORM 等 |
| 存取環境變數 | \`process.env.SECRET_KEY\`（不會洩漏到客戶端） |
| 零 bundle 貢獻 | RSC 的程式碼**不進入** client JS bundle |

**RSC 不能：**

| 限制 | 原因 |
|------|------|
| \`useState\`、\`useReducer\` | Hook 只在客戶端有意義 |
| \`useEffect\`、\`useLayoutEffect\` | 無瀏覽器生命週期 |
| \`onClick\`、\`onChange\` 等事件 | 無 DOM 事件系統 |
| \`window\`、\`document\`、\`localStorage\` | 無瀏覽器 API |

**預設 Server Component 和 \`"use client"\` 邊界：**

\`\`\`tsx
// app/page.tsx（預設是 Server Component）
import InteractiveButton from './InteractiveButton'

export default async function Page() {
  const data = await fetch('https://api.example.com/data').then(r => r.json())

  return (
    <div>
      <h1>{data.title}</h1>
      {/* Server Component 可以 import Client Component */}
      <InteractiveButton label="Click me" />
    </div>
  )
}
\`\`\`

\`\`\`tsx
// app/InteractiveButton.tsx
'use client' // ← 宣告 Client Component 邊界

import { useState } from 'react'

export default function InteractiveButton({ label }: { label: string }) {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{label}: {count}</button>
}
\`\`\``,
      },
      {
        heading: 'RSC Payload 與渲染流程',
        content: `**RSC Payload 是什麼？**

RSC Payload 是 React 樹的**序列化格式**，包含：
- Server Component 的渲染結果（HTML 結構）
- Client Component 的**佔位符**和 JS 引用
- 從 Server 傳到 Client 的 props

**RSC 完整渲染流程：**

\`\`\`
1. 伺服器渲染 Server Components
       ↓
2. 生成 RSC Payload（序列化的 React 樹）
   Server Component → 完整渲染結果
   Client Component → 佔位符 + JS 檔案引用
       ↓
3. 同時生成 HTML（用於 SSR）
       ↓
4. HTML + RSC Payload 傳到瀏覽器
       ↓
5. 瀏覽器用 RSC Payload 重建 React 樹（不需要重新渲染 Server Component）
       ↓
6. 下載 Client Component 的 JS bundle
       ↓
7. Hydration（Client Component 變為可互動）
\`\`\`

**為什麼 RSC 的套件不進 client bundle？**

\`\`\`ts
// 這個 import 在 Server Component 中使用
import { marked } from 'marked'        // 重型 Markdown 解析器
import { highlight } from 'highlight.js' // 程式碼高亮

export default async function BlogPost({ slug }: { slug: string }) {
  const content = await getPostContent(slug)
  const html = marked(content)           // 在伺服器執行
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
// marked 和 highlight.js 完全不進入客戶端 bundle！
\`\`\``,
      },
      {
        heading: 'Server 與 Client Component 的組合模式',
        content: `**正確的組合模式：**

**模式 1：Server import Client（標準）**
\`\`\`tsx
// Server Component 直接 import Client Component
import LikeButton from './LikeButton' // 'use client' component

export default async function Post({ id }: { id: string }) {
  const post = await getPost(id)
  return (
    <article>
      <h1>{post.title}</h1>
      <LikeButton postId={id} initialLikes={post.likes} />
    </article>
  )
}
\`\`\`

**模式 2：Client 接受 Server 作為 children（進階技巧）**
\`\`\`tsx
// Client Component 通過 children 接受 Server Component
'use client'
import { useState } from 'react'

export function Accordion({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button onClick={() => setOpen(o => !o)}>Toggle</button>
      {open && children}
    </div>
  )
}
\`\`\`

\`\`\`tsx
// Server Component 使用 Client Accordion
import { Accordion } from './Accordion' // 'use client'
import { ServerContent } from './ServerContent' // Server Component

export default function Page() {
  return (
    <Accordion>
      <ServerContent /> {/* Server Component 作為 children 傳入 */}
    </Accordion>
  )
}
\`\`\`

**錯誤模式：**
\`\`\`tsx
'use client'
// ❌ Client Component 不能 import Server Component
import ServerOnlyComponent from './ServerOnlyComponent'
// 這會讓 ServerOnlyComponent 被當作 Client Component 處理
\`\`\`

**\`"use client"\` 的傳染性：**

\`"use client"\` 標記一個**邊界**，邊界內所有 \`import\` 都自動成為 Client Component，無需再次宣告。`,
      },
    ],
  },
  {
    slug: 'nextjs-server-client-boundary',
    sections: [
      {
        heading: '何時使用 "use client"',
        content: `**必須使用 \`"use client"\` 的情況：**

- React Hooks（\`useState\`、\`useEffect\`、\`useRef\`、\`useContext\`…）
- 事件處理器（\`onClick\`、\`onChange\`、\`onSubmit\`…）
- 瀏覽器 API（\`window\`、\`localStorage\`、\`navigator\`…）
- 依賴 state/effect 的第三方套件（如動畫庫、拖拉庫）

**不需要 \`"use client"\` 的情況：**

- 純展示 UI（沒有事件、沒有 state）
- 直接在 Component 中獲取資料
- 讀取 cookies 或 headers（用 \`next/headers\`）
- 靜態頁面內容

**Push Client Down（向下推 Client）策略：**

\`\`\`tsx
// ❌ 差的設計：整個大元件都是 Client Component
'use client'
export default function ProductPage({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>      {/* 靜態，不需要 client */}
      <img src={product.image} />       {/* 靜態，不需要 client */}
      <input value={quantity} onChange={e => setQuantity(+e.target.value)} />
    </div>
  )
}

// ✅ 好的設計：只讓互動部分是 Client Component
// ProductPage.tsx（Server Component）
import { QuantitySelector } from './QuantitySelector'

export default function ProductPage({ product }: { product: Product }) {
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <img src={product.image} />
      <QuantitySelector /> {/* 只有這個是 Client Component */}
    </div>
  )
}

// QuantitySelector.tsx
'use client'
export function QuantitySelector() {
  const [quantity, setQuantity] = useState(1)
  return <input value={quantity} onChange={e => setQuantity(+e.target.value)} />
}
\`\`\``,
      },
      {
        heading: 'Context 在 App Router 中的使用',
        content: `\`createContext\` / \`useContext\` 是 React Hook，**不能在 Server Component 中使用**。

**正確的全域狀態模式：**

**步驟 1：建立 Client Provider**

\`\`\`tsx
// app/providers/ThemeProvider.tsx
'use client'

import { createContext, useContext, useState } from 'react'

type Theme = 'light' | 'dark'
const ThemeContext = createContext<{
  theme: Theme
  toggleTheme: () => void
} | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
\`\`\`

**步驟 2：在 Root Layout（Server Component）中引入 Provider**

\`\`\`tsx
// app/layout.tsx（Server Component）
import { ThemeProvider } from './providers/ThemeProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body>
        <ThemeProvider>  {/* Provider 是 Client Component */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
\`\`\`

**步驟 3：在子 Client Component 中使用**

\`\`\`tsx
'use client'
import { useTheme } from '../providers/ThemeProvider'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return <button onClick={toggleTheme}>{theme === 'light' ? '🌙' : '☀️'}</button>
}
\`\`\``,
      },
      {
        heading: 'Server / Client Props 傳遞與序列化規則',
        content: `Server Component 傳遞 props 給 Client Component 時，**props 必須可序列化**（因為需要跨越網路邊界）。

**可序列化的類型：**
- 字串、數字、布林值
- \`null\`、\`undefined\`
- 陣列（元素也必須可序列化）
- 普通物件（值也必須可序列化）

**不可序列化的類型與解法：**

| 類型 | 問題 | 解法 |
|------|------|------|
| \`Date\` | 序列化後變字串，失去方法 | 傳 ISO string，在 Client 轉換 |
| 函式 | 不可序列化 | 用 Server Action 或在 Client 定義 |
| \`Map\` / \`Set\` | 不支援 JSON 序列化 | 轉為陣列或普通物件 |
| Class 實例 | 方法不可序列化 | 傳普通物件（DTO 模式） |

**程式碼範例：**

\`\`\`tsx
// ❌ 錯誤：傳遞函式給 Client Component
export default function Page() {
  const handleClick = () => console.log('clicked')
  return <ClientButton onClick={handleClick} />
  // Error: Functions cannot be passed directly to Client Components
}

// ✅ 解法 1：用 Server Action
// actions.ts
'use server'
export async function handleClick() {
  console.log('clicked on server')
}

// page.tsx
import { handleClick } from './actions'
export default function Page() {
  return <ClientButton onClick={handleClick} /> // Server Action 可以傳遞
}

// ✅ 解法 2：Date 轉 ISO string
export default async function Page() {
  const post = await getPost()
  return (
    <ClientComponent
      title={post.title}
      createdAt={post.createdAt.toISOString()} // Date → string
    />
  )
}
\`\`\``,
      },
    ],
  },
  {
    slug: 'nextjs-data-fetching',
    sections: [
      {
        heading: 'Server Component 中的 fetch 擴充',
        content: `Next.js 對原生 \`fetch\` API 進行擴充，整合了**資料快取**和**請求記憶化**。

**Cache 選項：**

\`\`\`ts
// 永久快取（SSG 行為），Next.js 15 之前的預設值
const data = await fetch('https://api.example.com/static', {
  cache: 'force-cache'
})

// 不快取（SSR 行為），Next.js 15 的新預設值
const data = await fetch('https://api.example.com/dynamic', {
  cache: 'no-store'
})

// ISR：快取並在指定秒數後重新驗證
const data = await fetch('https://api.example.com/articles', {
  next: { revalidate: 3600 }
})

// 帶 tag 的快取（用於 On-demand Revalidation）
const data = await fetch('https://api.example.com/articles', {
  next: {
    revalidate: 3600,
    tags: ['articles', 'homepage']
  }
})
\`\`\`

**Request Memoization（自動去重）：**

\`\`\`ts
// 在同一次渲染（同一個請求）中，相同 URL 的 fetch 只執行一次
// 這兩個 Component 各自 fetch，但 Next.js 自動合併為一次實際請求
async function Header() {
  const user = await fetch('/api/user').then(r => r.json()) // 第一次：實際請求
  return <div>{user.name}</div>
}

async function Sidebar() {
  const user = await fetch('/api/user').then(r => r.json()) // 自動使用快取結果
  return <div>Welcome, {user.name}</div>
}
\`\`\`

**Next.js 15 的重要變化：**
- \`fetch\` 預設值從 \`force-cache\` 改為 \`no-store\`
- 需要快取需明確設定 \`cache: 'force-cache'\` 或 \`next.revalidate\``,
      },
      {
        heading: '並行資料獲取與避免 Waterfall',
        content: `**串行（Waterfall）vs 並行（Promise.all）：**

\`\`\`ts
// ❌ 串行（Waterfall）：總耗時 = A + B + C
async function SlowPage() {
  const user = await fetchUser()           // 100ms
  const orders = await fetchOrders()       // 150ms
  const recommendations = await fetchRecs() // 200ms
  // 總耗時：450ms
}

// ✅ 並行：總耗時 = max(A, B, C)
async function FastPage() {
  const [user, orders, recommendations] = await Promise.all([
    fetchUser(),           // 100ms ┐
    fetchOrders(),         // 150ms ├─ 並行執行
    fetchRecs(),           // 200ms ┘
  ])
  // 總耗時：200ms
}
\`\`\`

**元件層級並行（推薦）：**

\`\`\`tsx
// 各元件各自負責自己的資料，Suspense 讓它們並行
import { Suspense } from 'react'

export default function Dashboard() {
  return (
    <div>
      <Suspense fallback={<Skeleton />}>
        <UserProfile />    {/* 內部 fetch /api/user */}
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <OrderList />      {/* 內部 fetch /api/orders */}
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <Recommendations /> {/* 內部 fetch /api/recs */}
      </Suspense>
    </div>
  )
}
// 三個 fetch 同時觸發，互不等待，Request Memoization 防止重複請求
\`\`\`

**父元件統一 fetch 的適用時機：**

當資料之間有依賴關係（B 需要 A 的結果），或需要避免多個 Suspense 邊界閃爍時，在父元件用 \`Promise.all\` 統一獲取。`,
      },
      {
        heading: 'Client Component 資料獲取最佳實踐',
        content: `**\`useEffect\` + \`fetch\` 的問題：**

\`\`\`tsx
// ❌ 不推薦的做法
'use client'
export function UserData({ userId }: { userId: string }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(\`/api/users/\${userId}\`)
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false))
    // 問題：userId 改變時有 Race Condition
    // 問題：無快取，每次 mount 重新請求
    // 問題：需要手動管理 loading、error、data 狀態
  }, [userId])
}
\`\`\`

**SWR（推薦）：**

\`\`\`tsx
'use client'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function UserData({ userId }: { userId: string }) {
  const { data, error, isLoading } = useSWR(\`/api/users/\${userId}\`, fetcher, {
    revalidateOnFocus: true,   // 視窗重新獲焦時重新獲取
    dedupingInterval: 2000,    // 2 秒內相同請求去重
  })

  if (isLoading) return <Skeleton />
  if (error) return <ErrorMessage />
  return <div>{data.name}</div>
}
\`\`\`

**Protected Data 的安全做法（Server Component）：**

\`\`\`tsx
// ✅ 在 Server Component 中安全地獲取需要驗證的資料
import { cookies } from 'next/headers'

export default async function ProtectedPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value

  if (!token) {
    redirect('/login')
  }

  // 在伺服器端驗證 token 並查詢資料，不暴露給客戶端
  const data = await db.query.users.findFirst({
    where: eq(users.sessionToken, token)
  })

  return <Dashboard data={data} />
}
\`\`\``,
      },
    ],
  },
  {
    slug: 'nextjs-caching',
    sections: [
      {
        heading: 'Next.js 四層快取架構',
        content: `Next.js 有四層快取，從記憶體到 CDN，各有不同的生命週期：

\`\`\`
層級 1：Request Memoization（記憶體）
  ├── 範圍：單次伺服器請求內
  ├── 生命週期：請求結束後清空
  ├── 目的：同次渲染中相同 fetch 去重
  └── 自動運作，無需設定

層級 2：Data Cache（持久化）
  ├── 範圍：跨請求、跨部署（持久化到磁碟/Redis）
  ├── 生命週期：revalidate 時間 / 手動清除
  ├── 目的：快取 fetch 結果，減少對外部 API 的請求
  └── 控制：fetch cache 選項、revalidate、tags

層級 3：Full Route Cache（伺服器/CDN）
  ├── 範圍：伺服器和 CDN 邊緣節點
  ├── 生命週期：靜態路由永久 / 動態路由不快取
  ├── 目的：快取整個路由的 HTML + RSC Payload
  └── 控制：fetch no-store、dynamic 函式、export const dynamic

層級 4：Router Cache（瀏覽器記憶體）
  ├── 範圍：用戶 session（瀏覽器記憶體）
  ├── 生命週期：動態路由 30s / 靜態路由 5min
  ├── 目的：客戶端導覽快取，避免重複向伺服器請求
  └── 控制：router.refresh()、revalidatePath/Tag 失效後下次請求
\`\`\``,
      },
      {
        heading: 'Data Cache 與 Full Route Cache 控制',
        content: `**fetch 選項對 Data Cache 的影響：**

\`\`\`ts
// 永久快取（進入 Data Cache，直到手動 revalidate）
fetch(url, { cache: 'force-cache' })

// 不快取（跳過 Data Cache，每次請求都向外部 API 獲取）
fetch(url, { cache: 'no-store' })

// ISR：快取並設定過期時間
fetch(url, { next: { revalidate: 60 } }) // 60 秒後標記為 stale
\`\`\`

**Data Cache → Full Route Cache 的影響：**

\`\`\`ts
// 頁面中有任何一個 no-store fetch → 整個路由變為動態（不進 Full Route Cache）
const data = await fetch('/api/user', { cache: 'no-store' })

// 所有 fetch 都有快取 → 路由可以靜態化（進入 Full Route Cache）
const data = await fetch('/api/articles', { next: { revalidate: 3600 } })
\`\`\`

**頁面層級控制：**

\`\`\`ts
// app/dashboard/page.tsx

// 頁面級 revalidate（覆蓋所有 fetch 的 revalidate）
export const revalidate = 60

// 強制整個路由動態渲染
export const dynamic = 'force-dynamic'

// 強制靜態（如有動態函式則 build 時報錯）
export const dynamic = 'force-static'
\`\`\`

**快取失效優先級（最短的 revalidate 生效）：**

如果頁面 \`revalidate = 3600\`，但某個 fetch 設定 \`revalidate = 60\`，整個頁面每 60 秒重新驗證。`,
      },
      {
        heading: 'Router Cache 與 revalidatePath / revalidateTag',
        content: `**Router Cache 的生命週期：**

| 路由類型 | 快取時間 |
|---------|---------|
| 動態路由（有動態函式） | 30 秒 |
| 靜態路由 | 5 分鐘 |

**手動清除 Router Cache：**

\`\`\`tsx
'use client'
import { useRouter } from 'next/navigation'

export function RefreshButton() {
  const router = useRouter()
  return (
    <button onClick={() => router.refresh()}>
      重新整理（清除 Router Cache 並重新從伺服器獲取）
    </button>
  )
}
\`\`\`

**revalidatePath vs revalidateTag：**

\`\`\`ts
import { revalidatePath, revalidateTag } from 'next/cache'

// revalidatePath：讓特定路徑失效（Data Cache + Full Route Cache）
revalidatePath('/blog')              // 只有 /blog
revalidatePath('/blog', 'page')      // 只有 /blog 頁面
revalidatePath('/blog', 'layout')    // /blog 及其所有子路由

// revalidateTag：讓所有帶此 tag 的 fetch 失效
revalidateTag('articles')            // 所有 next: { tags: ['articles'] } 的 fetch
\`\`\`

**CMS Webhook 完整流程：**

\`\`\`ts
// app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache'

export async function POST(request: Request) {
  const { secret, tag } = await request.json()

  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: 'Invalid secret' }, { status: 401 })
  }

  revalidateTag(tag)
  // 1. Data Cache 中帶此 tag 的 fetch 失效
  // 2. Full Route Cache 中依賴這些 fetch 的頁面失效
  // 3. 下次請求時重新生成並快取

  return Response.json({ revalidated: true, now: Date.now() })
}
\`\`\``,
      },
    ],
  },
  {
    slug: 'nextjs-server-actions',
    sections: [
      {
        heading: 'Server Actions 基礎與運作機制',
        content: `Server Actions 讓你在**Client Component 中直接呼叫伺服器端函式**，無需手動建立 API Route。

**\`"use server"\` 宣告方式：**

\`\`\`ts
// actions.ts（模組級宣告，整個檔案都是 Server Actions）
'use server'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  await db.insert(posts).values({ title })
}

// 或在函式內宣告（混合檔案中使用）
export async function deletePost(id: string) {
  'use server'
  await db.delete(posts).where(eq(posts.id, id))
}
\`\`\`

**底層 RPC 機制：**

Next.js 自動為每個 Server Action 建立**唯一的 POST endpoint**。Client 呼叫 Server Action 時，實際上是發送一個 POST 請求（附上加密的 action ID）。

**與 API Route 的比較：**

| | Server Action | API Route |
|-|--------------|-----------|
| 型別安全 | 全端型別安全 | 需手動定義 |
| 第三方可訪問 | 否（Next.js 內部） | 是（公開 endpoint） |
| 適用場景 | 表單提交、用戶操作 | 公開 API、Webhook |

**表單整合（原生 HTML form）：**

\`\`\`tsx
import { createPost } from './actions'

export default function CreatePostForm() {
  return (
    <form action={createPost}>  {/* 直接傳入 Server Action */}
      <input name="title" placeholder="文章標題" />
      <button type="submit">建立</button>
    </form>
  )
}
\`\`\``,
      },
      {
        heading: 'useActionState 與 useFormStatus',
        content: `**\`useActionState\`（React 19）：**

管理 Server Action 的狀態和回傳值：

\`\`\`tsx
'use client'
import { useActionState } from 'react'
import { createPost } from './actions'

type State = { error?: string; success?: boolean }

export default function CreatePostForm() {
  const [state, action, isPending] = useActionState<State, FormData>(
    createPost,
    { error: undefined, success: false } // 初始狀態
  )

  return (
    <form action={action}>
      <input name="title" placeholder="文章標題" />
      {state.error && <p className="text-red-500">{state.error}</p>}
      {state.success && <p className="text-green-500">建立成功！</p>}
      <button type="submit" disabled={isPending}>
        {isPending ? '處理中...' : '建立'}
      </button>
    </form>
  )
}
\`\`\`

\`\`\`ts
// actions.ts
'use server'
import { z } from 'zod'

const schema = z.object({ title: z.string().min(1) })

export async function createPost(prevState: State, formData: FormData): Promise<State> {
  const result = schema.safeParse({ title: formData.get('title') })
  if (!result.success) return { error: '標題不能為空' }

  await db.insert(posts).values({ title: result.data.title })
  return { success: true }
}
\`\`\`

**\`useFormStatus\`：**

在**子元件**中取得父層 form 的 pending 狀態，無需 prop drilling：

\`\`\`tsx
'use client'
import { useFormStatus } from 'react-dom'

// 這個元件必須是 form 的子元件
export function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending}>
      {pending ? '送出中...' : label}
    </button>
  )
}
\`\`\``,
      },
      {
        heading: 'Server Actions 安全性與 UI 更新',
        content: `**Server Action 安全注意事項：**

\`\`\`ts
'use server'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(10),
})

export async function updatePost(postId: string, formData: FormData) {
  // 1. 驗證身份（不要相信 Client 傳來的 userId）
  const session = await auth()
  if (!session) throw new Error('Unauthorized')

  // 2. 驗證權限（確認用戶有權限修改這篇文章）
  const post = await db.query.posts.findFirst({ where: eq(posts.id, postId) })
  if (post?.authorId !== session.user.id) throw new Error('Forbidden')

  // 3. 輸入驗證（使用 zod 防止惡意輸入）
  const result = schema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  })
  if (!result.success) return { error: result.error.flatten() }

  await db.update(posts).set(result.data).where(eq(posts.id, postId))
  // CSRF 保護：Next.js 內建，Server Action 自動驗證 Origin header
}
\`\`\`

**執行後更新 UI 的三種方式：**

\`\`\`ts
// 方式 1：revalidatePath（重新生成頁面快取）
import { revalidatePath } from 'next/cache'
revalidatePath('/posts')

// 方式 2：router.refresh()（Client 端重新請求）
// 在 useActionState 的成功回調中呼叫

// 方式 3：useOptimistic（樂觀更新）
'use client'
import { useOptimistic } from 'react'

export function LikeButton({ post }: { post: Post }) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    post.likes,
    (currentLikes, _) => currentLikes + 1
  )

  async function handleLike() {
    addOptimisticLike(null) // 立即更新 UI
    await likePost(post.id)  // Server Action（在背景執行）
  }

  return (
    <button onClick={handleLike}>
      ❤️ {optimisticLikes}
    </button>
  )
}
\`\`\``,
      },
    ],
  },
  {
    slug: 'nextjs-optimization',
    sections: [
      {
        heading: 'next/image 與 next/font 優化',
        content: `**\`next/image\` 的自動優化：**

| 功能 | 說明 |
|------|------|
| 格式轉換 | 自動轉為 WebP/AVIF（瀏覽器支援時） |
| 尺寸縮放 | 根據 \`sizes\` 和設備 DPR 提供最適尺寸 |
| \`srcset\` 自動生成 | 響應式圖片，瀏覽器選擇最佳尺寸 |
| Lazy Loading | 預設只在進入 viewport 時載入 |
| 防 CLS | 預設佔位，避免 Layout Shift |

\`\`\`tsx
import Image from 'next/image'

// 本地圖片（自動取得尺寸）
import heroImage from './hero.jpg'
<Image src={heroImage} alt="Hero" priority /> // priority 用於 LCP 圖片

// 遠端圖片（需要設定 remotePatterns）
<Image
  src="https://cdn.example.com/photo.jpg"
  alt="Photo"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
\`\`\`

\`\`\`ts
// next.config.ts（設定允許的遠端圖片來源）
const config: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.example.com', pathname: '/**' }
    ]
  }
}
\`\`\`

**\`next/font\` 消除 FOUT/CLS：**

\`\`\`ts
import { Inter, Noto_Sans_TC } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',    // 字體載入前先顯示 fallback，載入後切換
  variable: '--font-inter',
})

// next/font 機制：
// 1. Build time 下載字體到伺服器
// 2. 從自己的域名提供字體（無外部請求，無隱私問題）
// 3. 自動設定 size-adjust，讓 fallback 字體大小接近目標字體，減少 CLS
// 4. 自動注入 preload link
\`\`\``,
      },
      {
        heading: 'next/link prefetch 與 next/script strategy',
        content: `**\`next/link\` 的 Prefetch 機制：**

\`next/link\` 使用 **Intersection Observer API** 監聽連結是否進入 viewport：

\`\`\`tsx
import Link from 'next/link'

// 預設行為：連結進入 viewport → 自動 prefetch RSC Payload
<Link href="/about">關於我們</Link>

// 靜態路由：prefetch 完整頁面資料
// 動態路由：只 prefetch loading.tsx 的 UI（避免過多請求）

// 停用 prefetch（高流量頁面、付費資源）
<Link href="/expensive-page" prefetch={false}>付費內容</Link>
\`\`\`

**\`next/script\` 的四種 strategy：**

| Strategy | 執行時機 | 適用場景 |
|----------|---------|---------|
| \`beforeInteractive\` | HTML 解析前，阻塞渲染 | 關鍵 polyfill、同意管理工具 |
| \`afterInteractive\` | Hydration 後 | GA、Tag Manager（預設） |
| \`lazyOnload\` | 所有資源載入後（idle） | 聊天 widget、低優先功能 |
| \`worker\` | Web Worker（實驗性） | 不阻塞主執行緒的重型腳本 |

\`\`\`tsx
import Script from 'next/script'

// Google Analytics（不阻塞頁面，Hydration 後執行）
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX"
  strategy="afterInteractive"
/>

// 聊天 widget（等頁面完全載入後才載入）
<Script
  src="https://cdn.chat.example.com/widget.js"
  strategy="lazyOnload"
/>

// inline script + onLoad callback
<Script
  id="analytics-init"
  strategy="afterInteractive"
  onLoad={() => console.log('Analytics loaded')}
>
  {\'window.dataLayer = window.dataLayer || []\'}
</Script>
\`\`\``,
      },
      {
        heading: 'Bundle 優化與 next/dynamic',
        content: `**\`next/dynamic\` Code Splitting：**

將大型元件拆分為獨立的 chunk，只在需要時載入：

\`\`\`tsx
import dynamic from 'next/dynamic'

// 基本用法
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <div>圖表載入中...</div>,
  ssr: false, // 禁用 SSR（避免 window is not defined 錯誤）
})

// 條件載入：只有用戶點擊後才下載 JS
const VideoPlayer = dynamic(() => import('./VideoPlayer'), { ssr: false })

export default function Page() {
  const [showPlayer, setShowPlayer] = useState(false)
  return (
    <div>
      <button onClick={() => setShowPlayer(true)}>播放影片</button>
      {showPlayer && <VideoPlayer />}
    </div>
  )
}
\`\`\`

**Server Component 的 Bundle 優勢：**

\`\`\`tsx
// 這些套件在 Server Component 中使用，完全不進 client bundle
import { PDFDocument } from 'pdf-lib'       // 1.5MB
import { marked } from 'marked'             // 500KB
import { createCanvas } from '@napi-rs/canvas' // 大型 native 套件

export default async function ReportPage() {
  const pdf = await generatePDF() // 在伺服器執行
  return <DownloadLink data={pdf} />
}
// client bundle 減少數 MB！
\`\`\`

**\`@next/bundle-analyzer\` 設定：**

\`\`\`ts
// next.config.ts
import withBundleAnalyzer from '@next/bundle-analyzer'

const config: NextConfig = {
  // 你的設定
}

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(config)
\`\`\`

\`\`\`bash
# 分析 bundle 大小
ANALYZE=true npm run build
# 自動開啟瀏覽器，顯示互動式 treemap
\`\`\`

**選擇輕量替代套件：**
- \`moment\` → \`date-fns\` 或 \`dayjs\`（體積小 10 倍以上）
- \`lodash\` → 按需 import \`lodash-es\`
- \`axios\` → 原生 \`fetch\`（Next.js 環境已支援）`,
      },
    ],
  },
]

async function seed() {
  for (const note of notes) {
    console.log(`處理 ${note.slug}...`)

    // 刪除舊資料
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
}

async function main() {
  console.log('開始 seed Next.js 筆記...')
  await seed()
  console.log('✅ 所有 Next.js 筆記 seed 完成！')
  process.exit(0)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
