import type { NetworkEntry } from './network-topics-types'

export const part1Topics: NetworkEntry[] = [
  // ─── HTTP 方法總覽 ────────────────────────────────────────────────────────
  {
    slug: 'http-methods',
    title: 'HTTP 方法總覽',
    description: '認識 GET、POST、PUT、PATCH、DELETE 等 HTTP 方法的用途與語意',
    subCategory: 'HTTP 協議',
    difficulty: 'easy',
    notes: {
      sections: [
        {
          heading: '常用 HTTP 方法一覽',
          content: `| 方法 | 用途 | 冪等性 | 是否有 Body |
|------|------|--------|------------|
| \`GET\` | 讀取資源 | ✅ 冪等 | ❌ 通常無 |
| \`POST\` | 建立資源 / 觸發動作 | ❌ 非冪等 | ✅ 有 |
| \`PUT\` | 全量替換資源 | ✅ 冪等 | ✅ 有 |
| \`PATCH\` | 部分更新資源 | ❌ 通常非冪等 | ✅ 有 |
| \`DELETE\` | 刪除資源 | ✅ 冪等 | 可有可無 |
| \`HEAD\` | 和 GET 相同但只回傳 Headers | ✅ 冪等 | ❌ 無 |
| \`OPTIONS\` | 查詢伺服器支援的方法（CORS 預檢） | ✅ 冪等 | ❌ 無 |`,
        },
        {
          heading: '冪等性（Idempotent）是什麼？',
          content: `冪等性是指：**對同一個請求執行一次和執行多次，結果完全相同**。

\`\`\`
GET /users/1        → 每次都回傳相同使用者資料，不改變狀態 ✅
DELETE /users/1     → 刪除後再刪除，結果還是「不存在」，狀態不變 ✅
POST /users         → 每次都會建立一個新使用者，狀態不同 ❌
\`\`\`

冪等性很重要，因為在網路不穩定時，客戶端可能需要**重試請求**。若方法是冪等的，重試不會造成重複副作用。`,
        },
        {
          heading: 'HEAD 與 OPTIONS 的用途',
          content: `**HEAD**：和 GET 完全相同，但回應不包含 body。適合用來：
- 確認資源是否存在（只看狀態碼，不下載 body）
- 取得 Content-Length 而不下載整個檔案

**OPTIONS**：查詢伺服器對某個 URL 支援哪些 HTTP 方法。最常見的用途是 **CORS 預檢請求（Preflight）**：

\`\`\`http
OPTIONS /api/users HTTP/1.1
Origin: https://example.com
Access-Control-Request-Method: POST
\`\`\`

瀏覽器在發送跨來源的非簡單請求前，會先自動發送 OPTIONS 請求確認伺服器允許。`,
        },
        {
          heading: 'CRUD 與 HTTP 方法對應',
          content: `RESTful API 設計慣例：

| CRUD 操作 | HTTP 方法 | 範例 |
|-----------|-----------|------|
| Create（建立） | POST | \`POST /users\` |
| Read（讀取） | GET | \`GET /users/1\` |
| Update（全量更新） | PUT | \`PUT /users/1\` |
| Update（部分更新） | PATCH | \`PATCH /users/1\` |
| Delete（刪除） | DELETE | \`DELETE /users/1\` |`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: '以下哪個 HTTP 方法是冪等的（Idempotent）？',
        options: [
          'POST',
          'PATCH',
          'DELETE',
          'POST 和 PATCH',
        ],
        answer: 2,
        explanation: 'DELETE 是冪等的：刪除一個已不存在的資源，結果仍然是「不存在」，狀態不會再改變。POST 非冪等（每次呼叫都可能建立新資源）。PATCH 通常非冪等（部分更新，重複執行可能疊加效果）。',
      },
      {
        id: 2,
        question: 'HTTP 方法中，哪個通常「不包含 Request Body」？',
        options: [
          'POST',
          'PUT',
          'PATCH',
          'GET',
        ],
        answer: 3,
        explanation: 'GET 請求通常不包含 Request Body，資料通過 URL query string 傳遞（例如 /search?q=keyword）。雖然技術上 GET 可以帶 body，但大多數瀏覽器和伺服器不支援或會忽略它。POST、PUT、PATCH 都帶有 body。',
      },
      {
        id: 3,
        question: 'OPTIONS 方法最常見的使用場景是什麼？',
        options: [
          '刪除伺服器上的資源',
          '測試伺服器是否存活',
          'CORS 跨來源預檢請求（Preflight）',
          '查詢使用者的選項設定',
        ],
        answer: 2,
        explanation: 'OPTIONS 方法最常見於 CORS 預檢請求。瀏覽器在發送非簡單的跨來源請求（例如帶自訂 Header 的 POST）前，會先自動送出 OPTIONS 請求，詢問伺服器是否允許。伺服器回應中的 Access-Control-Allow-* headers 告訴瀏覽器是否可以繼續。',
      },
      {
        id: 4,
        question: 'HEAD 方法和 GET 方法的主要差異是什麼？',
        options: [
          'HEAD 用來建立資源，GET 用來讀取',
          'HEAD 只回傳 Response Headers，不回傳 Body',
          'HEAD 比 GET 更安全，不會洩漏資料',
          'HEAD 是 GET 的縮寫，兩者完全相同',
        ],
        answer: 1,
        explanation: 'HEAD 方法和 GET 完全相同，但回應不包含 body。這讓你可以確認資源是否存在、取得 Content-Type/Content-Length 等 metadata，而不需要下載整個 body，節省頻寬。',
      },
      {
        id: 5,
        question: '冪等性（Idempotency）的正確定義是？',
        options: [
          '請求速度快，可以重複呼叫',
          '對同一請求執行一次與多次，伺服器狀態的結果完全相同',
          '請求不需要驗證就可以執行',
          '請求不帶有 Body',
        ],
        answer: 1,
        explanation: '冪等性指的是：對同一操作執行一次和執行 N 次，最終的伺服器狀態相同。例如 PUT /users/1 更新同一份資料 N 次，結果都是一樣的狀態。這個特性在網路重試情境下很重要，可以安全地重試而不擔心重複副作用。',
      },
      {
        id: 6,
        question: 'RESTful API 設計中，建立新資源（Create）應使用哪個 HTTP 方法？',
        options: [
          'GET',
          'PUT',
          'POST',
          'PATCH',
        ],
        answer: 2,
        explanation: 'POST 用於建立新資源，對應 CRUD 中的 Create。例如 POST /users 建立一個新使用者。PUT 用於全量替換已知 ID 的資源，PATCH 用於部分更新，GET 用於讀取。',
      },
      {
        id: 7,
        question: '以下哪個說法正確描述了 GET 和 POST 的冪等性差異？',
        options: [
          'GET 和 POST 都是冪等的',
          'GET 和 POST 都不是冪等的',
          'GET 是冪等的，POST 不是',
          'POST 是冪等的，GET 不是',
        ],
        answer: 2,
        explanation: 'GET 是冪等的：多次讀取同一資源，伺服器狀態不改變。POST 不是冪等的：每次 POST /users 可能都會建立一個新使用者，伺服器狀態每次都不同。這也是為什麼瀏覽器在重新整理 POST 頁面時會警告使用者是否重送表單。',
      },
      {
        id: 8,
        question: '以下哪個方法適合用來「確認某個大型檔案是否存在於伺服器，但不想下載它」？',
        options: [
          'GET /file.zip',
          'POST /file.zip',
          'HEAD /file.zip',
          'OPTIONS /file.zip',
        ],
        answer: 2,
        explanation: 'HEAD 方法與 GET 相同，但回應不包含 body。發送 HEAD 請求可以讀取 Headers（如 Content-Length、Content-Type、Last-Modified），確認檔案存在並取得 metadata，而不需要下載整個大型檔案，大幅節省頻寬。',
      },
    ],
    keyPoints: [
      'GET 讀取資源、POST 建立資源、PUT 全量替換、PATCH 部分更新、DELETE 刪除資源。',
      '冪等性：GET、PUT、DELETE、HEAD、OPTIONS 是冪等的；POST、PATCH 通常不是。',
      'HEAD 和 GET 相同但不回傳 Body，適合確認資源存在或取得 metadata。',
      'OPTIONS 用於 CORS 預檢請求，瀏覽器在跨來源非簡單請求前自動發送。',
      '冪等性在網路重試時很重要：冪等方法可以安全重試，不會造成重複副作用。',
    ],
  },

  // ─── GET vs POST 差異 ─────────────────────────────────────────────────────
  {
    slug: 'get-vs-post',
    title: 'GET vs POST 差異',
    description: '比較 GET 與 POST 請求在語意、資料傳遞、快取、安全性上的差異',
    subCategory: 'HTTP 協議',
    difficulty: 'easy',
    notes: {
      sections: [
        {
          heading: 'GET 與 POST 核心差異對照表',
          content: `| 特性 | GET | POST |
|------|-----|------|
| 資料位置 | URL query string | Request Body |
| 資料長度限制 | 受 URL 長度限制（~2000 字元） | 幾乎無限制 |
| 快取 | 瀏覽器會快取 | 預設不快取 |
| 冪等性 | ✅ 冪等 | ❌ 非冪等 |
| 安全性 | 資料裸露在 URL | Body 不顯示在位址列 |
| 書籤 / 分享 | ✅ 可書籤 | ❌ 不可 |
| 瀏覽器歷史記錄 | URL 含資料，記錄在歷史中 | Body 不記錄 |`,
        },
        {
          heading: '資料傳遞位置',
          content: `\`\`\`http
# GET：資料放在 URL query string
GET /search?q=javascript&page=2 HTTP/1.1
Host: example.com

# POST：資料放在 Request Body
POST /login HTTP/1.1
Host: example.com
Content-Type: application/json

{
  "username": "alice",
  "password": "secret123"
}
\`\`\`

**重要**：GET 的資料在 URL 中是「可見」的，會出現在：
- 瀏覽器位址列
- 伺服器 access log
- 瀏覽器歷史記錄
- Referer header（導航到其他頁面時可能洩漏）

因此，敏感資料（密碼、Token）絕對不能放在 GET 的 URL 中。`,
        },
        {
          heading: '快取行為',
          content: `GET 請求會被瀏覽器快取：

\`\`\`http
# 瀏覽器快取 GET 回應
GET /api/products HTTP/1.1

# 伺服器回應
HTTP/1.1 200 OK
Cache-Control: max-age=3600
\`\`\`

POST 請求預設不被快取，因為它通常有副作用（建立資源、觸發動作）。若對同一個 POST URL 重複請求，每次都會真正發送到伺服器。

**實際影響**：點擊「上一頁」後再次進入 GET 頁面可能直接使用快取；POST 頁面則會詢問是否重新送出表單。`,
        },
        {
          heading: '使用場景',
          content: `**用 GET 的情境：**
- 搜尋（\`GET /search?q=keyword\`）
- 取得列表（\`GET /users\`）
- 取得單一資源（\`GET /users/1\`）
- 任何只讀、不改變伺服器狀態的操作

**用 POST 的情境：**
- 登入（傳遞帳密）
- 送出表單
- 建立新資源（\`POST /orders\`）
- 上傳檔案
- 任何有副作用的操作`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: 'GET 請求的資料放在哪裡？',
        options: [
          'Request Body（請求主體）',
          'Request Header（請求標頭）',
          'URL query string（URL 查詢字串）',
          'Cookie',
        ],
        answer: 2,
        explanation: 'GET 的資料放在 URL 的 query string 中，例如 /search?q=keyword&page=2。這讓 GET 請求可以被書籤收藏和分享，但也讓資料暴露在 URL 中，不適合傳遞敏感資訊。',
      },
      {
        id: 2,
        question: '為什麼登入表單（帳號密碼）應該用 POST 而不是 GET？',
        options: [
          'POST 比 GET 傳輸速度更快',
          'GET 不支援中文字元',
          'GET 的資料暴露在 URL，會被記錄在伺服器 log 和瀏覽器歷史記錄中',
          'POST 有加密，GET 沒有',
        ],
        answer: 2,
        explanation: 'GET 的資料放在 URL 中，會被記錄在：瀏覽器歷史、伺服器 access log、Referer header 等地方，密碼等敏感資料極易洩漏。POST 的資料在 Request Body 中，不顯示在 URL。注意：這不代表 POST 本身會加密，兩者都需要 HTTPS 才能保護傳輸安全。',
      },
      {
        id: 3,
        question: '關於 GET 請求的快取行為，以下哪個說法正確？',
        options: [
          'GET 請求永遠不會被快取',
          'GET 請求可以被瀏覽器快取，POST 預設不快取',
          'POST 請求可以被快取，GET 不行',
          'GET 和 POST 的快取行為完全相同',
        ],
        answer: 1,
        explanation: 'GET 請求是讀取操作，不改變伺服器狀態，所以瀏覽器和 CDN 可以快取 GET 回應。POST 有副作用（建立資源），預設不快取，每次都會發送到伺服器。這也是搜尋結果（GET）能被快取的原因。',
      },
      {
        id: 4,
        question: '以下哪個場景最適合使用 GET 請求？',
        options: [
          '使用者送出付款表單',
          '使用者上傳大型圖片',
          '瀏覽商品列表頁面',
          '使用者登入帳號',
        ],
        answer: 2,
        explanation: '瀏覽商品列表是純讀取操作，不改變伺服器狀態，完全符合 GET 的語意。URL 可以被書籤收藏、分享，也可以被快取。付款、上傳和登入都有副作用或需要保護敏感資料，應使用 POST。',
      },
      {
        id: 5,
        question: 'GET 請求有資料長度限制嗎？',
        options: [
          '沒有任何限制',
          '限制在 100 bytes',
          '受 URL 長度限制，通常約 2000 字元',
          '限制在 1MB',
        ],
        answer: 2,
        explanation: 'GET 的資料在 URL 中，而 URL 長度受瀏覽器和伺服器的限制，通常約 2000～8000 字元（視瀏覽器和伺服器設定而定）。POST 的資料在 Body 中，限制由伺服器設定，通常可以很大（幾百 MB）。這也是大量資料或檔案上傳必須用 POST 的原因。',
      },
      {
        id: 6,
        question: '以下哪個說法正確描述 GET 和 POST 的冪等性？',
        options: [
          'GET 和 POST 都是冪等的',
          'GET 是冪等的，POST 通常不是冪等的',
          'GET 不是冪等的，POST 是冪等的',
          '兩者都不是冪等的',
        ],
        answer: 1,
        explanation: 'GET 是冪等且安全的：多次執行不改變伺服器狀態。POST 非冪等：多次 POST /orders 可能建立多筆訂單。這也是瀏覽器在重新整理 POST 頁面時會彈出警告（「是否重新送出表單？」）的原因。',
      },
      {
        id: 7,
        question: '關於 GET 和 POST 的安全性，哪個說法正確？',
        options: [
          'POST 本身會加密資料，GET 不會',
          'GET 和 POST 本身都不加密，需要 HTTPS 才能保護傳輸',
          'GET 比 POST 更安全，因為 URL 是可見的',
          'POST 資料在伺服器 log 中完全不可見',
        ],
        answer: 1,
        explanation: 'GET 和 POST 本身都沒有加密能力。兩者都需要搭配 HTTPS（TLS/SSL）才能加密傳輸中的資料。POST 的資料不在 URL 中，確實比 GET 更不容易在 log 中洩漏，但在沒有 HTTPS 的情況下，Body 仍可能被中間人竊聽。',
      },
    ],
    keyPoints: [
      'GET 資料在 URL query string；POST 資料在 Request Body。',
      'GET 會被瀏覽器快取，POST 預設不快取。',
      'GET 是冪等的（重複執行不改變狀態），POST 不是。',
      '密碼等敏感資料絕對不能用 GET，因為 URL 會被記錄在 log、歷史記錄中。',
      'GET 受 URL 長度限制（約 2000 字元），POST Body 幾乎無限制。',
      'GET 和 POST 本身都不加密，需要 HTTPS 保護傳輸安全。',
    ],
  },

  // ─── PUT vs PATCH 差異 ────────────────────────────────────────────────────
  {
    slug: 'put-vs-patch',
    title: 'PUT vs PATCH 差異',
    description: '了解 PUT 全量替換與 PATCH 部分更新的差異及使用場景',
    subCategory: 'HTTP 協議',
    difficulty: 'easy',
    notes: {
      sections: [
        {
          heading: 'PUT 與 PATCH 核心差異',
          content: `| 特性 | PUT | PATCH |
|------|-----|-------|
| 更新方式 | 全量替換（整個資源） | 部分更新（只改指定欄位） |
| Request Body | 需包含完整資源 | 只需包含要更新的欄位 |
| 冪等性 | ✅ 冪等 | ❌ 通常非冪等 |
| 使用場景 | 替換整份文件 | 修改少數欄位 |`,
        },
        {
          heading: 'PUT vs PATCH 實際範例',
          content: `假設使用者資料為：
\`\`\`json
{ "id": 1, "name": "Alice", "email": "alice@example.com", "age": 25 }
\`\`\`

**PUT（全量替換）** — 必須傳完整物件：
\`\`\`http
PUT /users/1 HTTP/1.1
Content-Type: application/json

{ "name": "Alice Wu", "email": "alice@example.com", "age": 25 }
\`\`\`
若只傳 \`{ "name": "Alice Wu" }\`，其他欄位會被清空或設為 null！

**PATCH（部分更新）** — 只傳要改的欄位：
\`\`\`http
PATCH /users/1 HTTP/1.1
Content-Type: application/json

{ "name": "Alice Wu" }
\`\`\`
只有 name 被更新，email 和 age 保持不變。`,
        },
        {
          heading: 'PATCH 為什麼通常非冪等？',
          content: `PATCH 非冪等的典型例子：

\`\`\`http
# 如果 PATCH 的語意是「將年齡加 1」
PATCH /users/1 HTTP/1.1

{ "age": "+1" }
\`\`\`

執行一次 → age = 26
執行兩次 → age = 27（不同結果）

但如果 PATCH 的語意是「將年齡設為 26」，則是冪等的：

\`\`\`http
PATCH /users/1 HTTP/1.1

{ "age": 26 }
\`\`\`

**結論**：PATCH 的冪等性取決於伺服器實作。HTTP 規範將 PATCH 定義為「可能非冪等」，所以原則上視為非冪等。`,
        },
        {
          heading: '何時選用 PUT vs PATCH',
          content: `**用 PUT 的時機：**
- 替換整份文件（例如儲存完整設定檔）
- 明確知道要設定資源的所有欄位
- 希望語意清晰，「這就是完整的資源狀態」

**用 PATCH 的時機：**
- 只修改少數欄位（例如只改 email）
- 資源欄位很多，傳完整資源很浪費頻寬
- 使用者只有部分資料的存取權限

**實務上**：現代 API 多數使用 PATCH 做更新，因為傳輸效率更高，且不易誤刪其他欄位。`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: '以下哪個說法正確描述 PUT 的行為？',
        options: [
          '只更新 Request Body 中提供的欄位，其他欄位不變',
          '用 Request Body 完整替換資源，未提供的欄位會被清空',
          '建立新資源（如果不存在）',
          '刪除資源後重新建立',
        ],
        answer: 1,
        explanation: 'PUT 是全量替換（replace）。如果你只在 Body 傳 { "name": "Alice" }，而伺服器的資源有 name、email、age 三個欄位，那麼 email 和 age 可能被清空或設為 null。PUT 的語意是「這是這個資源的完整狀態」。',
      },
      {
        id: 2,
        question: '以下哪個說法正確描述 PATCH 的行為？',
        options: [
          '完整替換資源，需要傳所有欄位',
          '只更新 Body 中提供的欄位，其他欄位保持不變',
          '刪除資源',
          '讀取資源的部分欄位',
        ],
        answer: 1,
        explanation: 'PATCH 是部分更新（partial update）。只需要在 Body 中傳遞要修改的欄位，其他欄位不受影響。例如只傳 { "email": "new@example.com" }，只有 email 被更新，其他欄位維持原樣。',
      },
      {
        id: 3,
        question: 'PUT 和 PATCH 的冪等性差異是什麼？',
        options: [
          'PUT 和 PATCH 都是冪等的',
          'PUT 是冪等的，PATCH 通常非冪等',
          'PUT 不是冪等，PATCH 是冪等',
          'PUT 和 PATCH 都不是冪等的',
        ],
        answer: 1,
        explanation: 'PUT 是冪等的：多次用相同 Body 執行 PUT，資源結果都相同（都被設定為 Body 的完整狀態）。PATCH 通常非冪等，因為「部分更新」可能有累加效果（如 age + 1），重複執行結果不同。HTTP 規範將 PATCH 定義為可能非冪等。',
      },
      {
        id: 4,
        question: '假設使用者有 { name, email, age } 三個欄位，只想更新 email，應使用哪個方法？',
        options: [
          'PUT，傳入 { "email": "new@example.com" }',
          'PATCH，傳入 { "email": "new@example.com" }',
          'PUT，傳入 { "name": "Alice", "email": "new@example.com", "age": 25 }',
          'PATCH 和 PUT 都可以，只傳 email 即可',
        ],
        answer: 1,
        explanation: 'PATCH 最適合只更新部分欄位。傳入 { "email": "new@example.com" } 只更新 email，name 和 age 保持不變。若用 PUT 只傳 email，name 和 age 可能被清空。若用 PUT 傳完整資料（選項C）雖然正確但沒必要，浪費頻寬。',
      },
      {
        id: 5,
        question: '以下哪個場景最適合使用 PUT 而非 PATCH？',
        options: [
          '只修改使用者的顯示名稱',
          '只更新訂單的配送地址',
          '替換整份 JSON 設定檔（config）',
          '為文章新增一個 tag',
        ],
        answer: 2,
        explanation: 'PUT 適合「全量替換」的場景，最典型的是替換整份設定檔：客戶端傳送完整的設定物件，伺服器直接以新的替換舊的。只修改少數欄位（name、address、tag）用 PATCH 更有效率，也更安全（不會誤刪其他欄位）。',
      },
      {
        id: 6,
        question: '若使用 PUT 更新資源，但 Request Body 只傳部分欄位，可能發生什麼問題？',
        options: [
          '伺服器會自動補全缺少的欄位',
          '伺服器會拒絕請求並回傳 400',
          '未傳遞的欄位可能被清空或設為 null',
          '只有傳遞的欄位被更新，行為和 PATCH 相同',
        ],
        answer: 2,
        explanation: '這是 PUT 最常見的陷阱。PUT 的語意是「用 Body 完整替換資源」，若未提供某些欄位，根據伺服器實作，這些欄位可能被設為 null、預設值或直接刪除。這就是為什麼 PUT 需要傳遞完整資源，只更新部分欄位應使用 PATCH。',
      },
      {
        id: 7,
        question: '在 RESTful API 設計中，PATCH /users/1 和 PUT /users/1 分別代表什麼操作？',
        options: [
          'PATCH 刪除，PUT 建立',
          'PATCH 部分更新，PUT 全量替換',
          'PATCH 全量替換，PUT 部分更新',
          'PATCH 讀取，PUT 更新',
        ],
        answer: 1,
        explanation: 'RESTful 慣例：PATCH 對資源進行部分更新，只修改提供的欄位；PUT 對資源進行全量替換，用 Body 的內容完整取代現有資源。這兩者都是更新操作，但粒度和語意不同。',
      },
    ],
    keyPoints: [
      'PUT 全量替換資源，Body 需包含完整資源；未提供的欄位可能被清空。',
      'PATCH 部分更新，只需傳遞要修改的欄位，其他欄位保持不變。',
      'PUT 是冪等的（多次執行結果相同），PATCH 通常非冪等。',
      '只更新少數欄位用 PATCH 更安全、更有效率，避免誤刪其他欄位。',
      '實務上現代 API 多數用 PATCH 做更新，PUT 適合「全量替換整份文件」的場景。',
    ],
  },

  // ─── HTTP 狀態碼 ──────────────────────────────────────────────────────────
  {
    slug: 'http-status-codes',
    title: 'HTTP 狀態碼',
    description: '掌握常見 HTTP 狀態碼的意義，包含 2xx、3xx、4xx、5xx 分類與 304 特殊說明',
    subCategory: 'HTTP 協議',
    difficulty: 'easy',
    notes: {
      sections: [
        {
          heading: 'HTTP 狀態碼分類總覽',
          content: `| 分類 | 範圍 | 意義 |
|------|------|------|
| **1xx** | 100–199 | 資訊性（Informational），請求已接收，繼續處理 |
| **2xx** | 200–299 | 成功（Success），請求成功處理 |
| **3xx** | 300–399 | 重新導向（Redirection），需要進一步操作 |
| **4xx** | 400–499 | 用戶端錯誤（Client Error），請求有問題 |
| **5xx** | 500–599 | 伺服器錯誤（Server Error），伺服器無法處理 |`,
        },
        {
          heading: '2xx 成功狀態碼',
          content: `| 狀態碼 | 名稱 | 說明 |
|--------|------|------|
| **200** | OK | 請求成功，有回應 Body |
| **201** | Created | 資源建立成功（POST 後常見），回應含新資源位置 |
| **204** | No Content | 請求成功，但不回傳 Body（常用於 DELETE 或 PATCH）|

\`\`\`http
# 201 回應示例
HTTP/1.1 201 Created
Location: /users/42
Content-Type: application/json

{ "id": 42, "name": "Alice" }
\`\`\``,
        },
        {
          heading: '3xx 重新導向與 304 快取',
          content: `| 狀態碼 | 名稱 | 說明 |
|--------|------|------|
| **301** | Moved Permanently | 永久重新導向，舊 URL 已廢棄，SEO 傳遞權重 |
| **302** | Found | 暫時重新導向，舊 URL 仍有效 |
| **304** | Not Modified | 資源未變更，使用快取版本，不回傳 Body |

**304 特別說明**：
- 瀏覽器第一次請求後，後續帶著 \`If-None-Match\` 或 \`If-Modified-Since\` 詢問伺服器
- 若資源未變更，伺服器回 304，瀏覽器直接使用本地快取
- **304 越多越好**：代表快取命中率高，減少資料傳輸量，網站效能更好`,
        },
        {
          heading: '4xx 客戶端錯誤 & 5xx 伺服器錯誤',
          content: `**4xx 客戶端錯誤**（問題在請求方）：

| 狀態碼 | 名稱 | 說明 |
|--------|------|------|
| **400** | Bad Request | 請求格式錯誤（語法錯誤、缺少必填欄位） |
| **401** | Unauthorized | 未驗證（沒有登入或 Token 無效） |
| **403** | Forbidden | 已驗證但無權限（沒有存取該資源的權限） |
| **404** | Not Found | 資源不存在 |

**5xx 伺服器錯誤**（問題在伺服器）：

| 狀態碼 | 名稱 | 說明 |
|--------|------|------|
| **500** | Internal Server Error | 伺服器內部錯誤（程式碼 bug、未捕捉的例外） |
| **502** | Bad Gateway | 閘道器收到無效回應（反向代理無法聯繫到上游） |
| **503** | Service Unavailable | 服務暫時不可用（過載或維護中） |`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: 'POST /users 成功建立使用者後，最語意正確的 HTTP 狀態碼是？',
        options: [
          '200 OK',
          '201 Created',
          '204 No Content',
          '301 Moved Permanently',
        ],
        answer: 1,
        explanation: '201 Created 代表資源成功建立，是 POST 建立新資源後最語意正確的回應。通常還會附上 Location header 指向新建立資源的 URL。200 OK 雖然也常見，但語意上 201 更精確。204 No Content 表示成功但無回傳內容，通常用於 DELETE 或不需要回傳資料的 PATCH。',
      },
      {
        id: 2,
        question: '401 Unauthorized 和 403 Forbidden 的差異是什麼？',
        options: [
          '兩者完全相同，可以互換使用',
          '401 是請求格式錯誤，403 是伺服器錯誤',
          '401 是未驗證身份，403 是已驗證但無存取權限',
          '401 是資源不存在，403 是伺服器拒絕連線',
        ],
        answer: 2,
        explanation: '401 Unauthorized（語意應為 Unauthenticated）：你沒有提供身份資訊，或提供的 Token 無效，伺服器不知道你是誰。403 Forbidden：伺服器知道你是誰，但你沒有存取此資源的權限。例如：一般使用者嘗試存取管理員頁面。',
      },
      {
        id: 3,
        question: 'DELETE /users/1 成功刪除後，最適合的狀態碼是？',
        options: [
          '200 OK（附帶刪除結果）',
          '201 Created',
          '204 No Content',
          '404 Not Found',
        ],
        answer: 2,
        explanation: '204 No Content 代表操作成功但不回傳任何 Body，非常適合 DELETE 操作。資源已刪除，不需要回傳任何資料。200 OK 也可以接受（附帶刪除確認訊息），但 204 更語意正確、更簡潔。',
      },
      {
        id: 4,
        question: '304 Not Modified 代表什麼？越多越好還是越少越好？',
        options: [
          '資源找不到，頁面需要修復，越少越好',
          '伺服器發生錯誤，越少越好',
          '資源未變更，瀏覽器使用快取，越多越好（代表快取命中率高）',
          '請求被重新導向，不影響效能',
        ],
        answer: 2,
        explanation: '304 Not Modified 表示客戶端的快取版本仍然有效，資源未變更，瀏覽器直接使用本地快取，不需要重新下載。**304 越多越好**：代表快取命中率高，減少伺服器負載和網路傳輸量，網站整體效能更佳。低 304 比例可能代表快取策略設定不當。',
      },
      {
        id: 5,
        question: '500、502、503 狀態碼分別代表什麼？',
        options: [
          '500 閘道錯誤、502 服務不可用、503 內部錯誤',
          '500 內部伺服器錯誤、502 閘道錯誤、503 服務不可用',
          '500 權限錯誤、502 資源不存在、503 請求格式錯誤',
          '三者都代表相同的伺服器錯誤',
        ],
        answer: 1,
        explanation: '500 Internal Server Error：伺服器本身的程式碼錯誤（如未捕捉的例外）。502 Bad Gateway：反向代理（如 Nginx）無法從上游伺服器取得有效回應（上游掛了）。503 Service Unavailable：服務暫時不可用，通常因為過載或正在維護，有時會附帶 Retry-After header 告知何時可重試。',
      },
      {
        id: 6,
        question: '301 和 302 重新導向的差異是什麼？',
        options: [
          '301 是暫時重新導向，302 是永久重新導向',
          '301 是永久重新導向，302 是暫時重新導向',
          '301 僅用於 HTTPS，302 用於 HTTP',
          '兩者完全相同，只是數字不同',
        ],
        answer: 1,
        explanation: '301 Moved Permanently：永久重新導向，舊 URL 已廢棄，搜尋引擎會將 SEO 權重轉移到新 URL，瀏覽器會快取這個轉向。302 Found：暫時重新導向，舊 URL 仍有效，瀏覽器不應快取，適合維護模式或 A/B 測試。',
      },
      {
        id: 7,
        question: 'API 請求缺少必填欄位（如未提供 email），應回傳哪個狀態碼？',
        options: [
          '404 Not Found',
          '500 Internal Server Error',
          '401 Unauthorized',
          '400 Bad Request',
        ],
        answer: 3,
        explanation: '400 Bad Request 表示請求本身有問題，例如格式錯誤、缺少必填欄位、參數驗證失敗等。這類問題是客戶端的責任，所以用 4xx 系列。404 是資源不存在，500 是伺服器內部錯誤，401 是未驗證，都不適合此場景。',
      },
      {
        id: 8,
        question: '以下哪個狀態碼代表「已認證，但沒有存取該資源的權限」？',
        options: [
          '400 Bad Request',
          '401 Unauthorized',
          '403 Forbidden',
          '404 Not Found',
        ],
        answer: 2,
        explanation: '403 Forbidden 表示伺服器知道你的身份（已認證），但你沒有存取這個資源的授權。例如：一般使用者嘗試存取 /admin 管理頁面。401 則是身份未驗證（沒有 Token 或 Token 過期），需要先登入。',
      },
    ],
    keyPoints: [
      '2xx 成功：200 OK（通用）、201 Created（建立資源）、204 No Content（無回傳 body）。',
      '3xx 重新導向：301 永久、302 暫時、304 資源未變更使用快取。',
      '304 越多越好，代表快取命中率高，能減少伺服器負載與網路傳輸。',
      '4xx 客戶端錯誤：400 請求格式錯、401 未驗證、403 無權限、404 找不到。',
      '5xx 伺服器錯誤：500 內部錯誤、502 閘道錯誤、503 服務不可用。',
      '401 vs 403：401 是「你是誰？」（未驗證），403 是「你沒有權限」（已驗證但被拒）。',
    ],
  },

  // ─── HTTP vs HTTPS ────────────────────────────────────────────────────────
  {
    slug: 'http-vs-https',
    title: 'HTTP vs HTTPS',
    description: '了解 HTTPS 如何透過 TLS/SSL 加密保護傳輸安全',
    subCategory: 'HTTP 協議',
    difficulty: 'easy',
    notes: {
      sections: [
        {
          heading: 'HTTP 與 HTTPS 核心差異',
          content: `| 特性 | HTTP | HTTPS |
|------|------|-------|
| 全名 | HyperText Transfer Protocol | HTTP + TLS/SSL |
| 連接埠 | 80 | 443 |
| 加密 | ❌ 明文傳輸 | ✅ TLS 加密 |
| 驗證 | ❌ 無伺服器驗證 | ✅ 憑證驗證伺服器身份 |
| SEO | 較差 | ✅ Google 將 HTTPS 列為排名因素 |
| 效能 | 稍快（無加密開銷） | 現代 TLS 1.3 效能差異極小 |`,
        },
        {
          heading: 'TLS 握手流程（簡化版）',
          content: `\`\`\`
客戶端                                    伺服器
  |                                         |
  |──── ClientHello（支援的加密套件）──────→|
  |                                         |
  |←── ServerHello + 憑證（公鑰）──────────|
  |                                         |
  | 驗證憑證（由 CA 簽發、未過期、域名匹配）|
  |                                         |
  |──── 用公鑰加密，交換對稱金鑰材料 ──────→|
  |                                         |
  |←──── 握手完成，雙方用對稱金鑰通訊 ─────|
\`\`\`

TLS 混合使用兩種加密：
- **非對稱加密**（RSA / ECDH）：握手階段，安全地交換對稱金鑰
- **對稱加密**（AES）：正式資料傳輸，效能高

非對稱加密解決了「如何安全地分享金鑰」的問題，但速度慢；對稱加密速度快，負責實際資料加密。`,
        },
        {
          heading: 'SSL 憑證（Certificate）與 HSTS',
          content: `**SSL 憑證的作用：**
1. 驗證伺服器身份（防止中間人偽裝）
2. 包含公鑰，用於 TLS 握手
3. 由受信任的憑證機構（CA）簽發

**憑證類型：**
- **DV**（Domain Validation）：只驗證域名所有權，最基本
- **OV**（Organization Validation）：驗證組織資訊
- **EV**（Extended Validation）：最嚴格，瀏覽器顯示綠色組織名稱

**HSTS（HTTP Strict Transport Security）：**
\`\`\`http
Strict-Transport-Security: max-age=31536000; includeSubDomains
\`\`\`

告訴瀏覽器：未來一年內，此域名只允許 HTTPS 連線，拒絕任何 HTTP 請求，防止降級攻擊。`,
        },
        {
          heading: 'HTTPS 對 SEO 和安全性的影響',
          content: `**SEO 影響：**
- Google 自 2014 年起將 HTTPS 列為排名信號
- 2023 年，Chrome 對非 HTTPS 網站顯示「不安全」警告
- Google Search Console 優先索引 HTTPS 版本

**安全性保護：**
- **機密性（Confidentiality）**：加密傳輸，中間人無法讀取內容
- **完整性（Integrity）**：訊息驗證碼（MAC）確保資料未被篡改
- **身份驗證（Authentication）**：憑證確認伺服器身份，防止釣魚網站偽裝

**常見混合內容問題（Mixed Content）：**
HTTPS 頁面引用 HTTP 資源（如圖片、JS）時，瀏覽器會警告或封鎖，需確保所有資源都用 HTTPS。`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: 'HTTPS 和 HTTP 相比，最主要增加了什麼？',
        options: [
          '更快的傳輸速度',
          'TLS/SSL 加密層，保護傳輸安全',
          '自動壓縮資料的功能',
          '支援更多 HTTP 方法',
        ],
        answer: 1,
        explanation: 'HTTPS 是 HTTP + TLS/SSL，在 HTTP 之上加了一層 TLS 加密。這提供了三個核心安全保障：機密性（加密內容）、完整性（防篡改）、身份驗證（憑證確認伺服器身份）。速度和壓縮不是 HTTPS 的核心功能。',
      },
      {
        id: 2,
        question: 'TLS 握手過程中使用了哪兩種加密方式？各有什麼用途？',
        options: [
          '只使用非對稱加密（RSA），全程加密',
          '只使用對稱加密（AES），效能最佳',
          '非對稱加密用於握手交換金鑰，對稱加密用於實際資料傳輸',
          '握手用雜湊（Hash），資料傳輸用 XOR 加密',
        ],
        answer: 2,
        explanation: 'TLS 混合使用兩種加密：非對稱加密（RSA 或 ECDH）速度慢但能安全地讓雙方共享同一個金鑰；對稱加密（AES）速度快，用共享金鑰加密實際傳輸的資料。這種混合方式兼顧了安全性和效能。',
      },
      {
        id: 3,
        question: 'SSL 憑證（Certificate）的主要作用是什麼？',
        options: [
          '壓縮傳輸的資料以提升效能',
          '驗證伺服器身份並提供公鑰，防止中間人攻擊',
          '儲存使用者的 Session 資訊',
          '限制只有特定 IP 可以連線',
        ],
        answer: 1,
        explanation: 'SSL 憑證由受信任的憑證機構（CA）簽發，用於：1) 驗證伺服器確實是它聲稱的那個網站（防釣魚/中間人偽裝）；2) 包含公鑰，供 TLS 握手使用。瀏覽器內建 CA 清單，會驗證憑證是否由可信任 CA 簽發、是否過期、是否匹配域名。',
      },
      {
        id: 4,
        question: 'HSTS（HTTP Strict Transport Security）的作用是什麼？',
        options: [
          '加快 HTTPS 連線的握手速度',
          '強制瀏覽器未來一段時間內只使用 HTTPS，防止降級攻擊',
          '自動幫使用者申請 SSL 憑證',
          '驗證網站的 SSL 憑證是否有效',
        ],
        answer: 1,
        explanation: 'HSTS 是伺服器透過 Strict-Transport-Security header 告訴瀏覽器：在指定時間內（如一年），此域名只接受 HTTPS 連線。即使使用者輸入 http://，瀏覽器也會自動轉為 https://。主要防止「SSL 剝除攻擊」，防止中間人把 HTTPS 降級成 HTTP。',
      },
      {
        id: 5,
        question: 'HTTP 和 HTTPS 分別預設使用哪個連接埠（Port）？',
        options: [
          'HTTP 使用 443，HTTPS 使用 80',
          'HTTP 使用 8080，HTTPS 使用 8443',
          'HTTP 使用 80，HTTPS 使用 443',
          '兩者都使用 80',
        ],
        answer: 2,
        explanation: 'HTTP 預設連接埠是 80，HTTPS 預設連接埠是 443。這也是為什麼你不需要在 URL 中寫 https://example.com:443，瀏覽器會自動使用預設埠。',
      },
      {
        id: 6,
        question: '為什麼 HTTPS 對 SEO（搜尋引擎最佳化）也有影響？',
        options: [
          'HTTPS 讓頁面載入更快，間接影響 SEO',
          'Google 自 2014 年起將 HTTPS 作為搜尋排名的正面因素之一',
          'HTTPS 讓搜尋引擎爬蟲能更快索引頁面',
          'HTTPS 增加關鍵字密度，提升排名',
        ],
        answer: 1,
        explanation: 'Google 自 2014 年起將 HTTPS 列為輕量級排名信號，使用 HTTPS 的網站在搜尋結果中有輕微的排名優勢。此外，Chrome 對 HTTP 網站顯示「不安全」警告，影響使用者信任度和點擊率，間接影響 SEO 指標。',
      },
      {
        id: 7,
        question: '什麼是「混合內容（Mixed Content）」問題？',
        options: [
          'HTTPS 頁面同時使用 GET 和 POST 請求',
          'HTTPS 頁面中引用了 HTTP 資源（如圖片或 JS），瀏覽器會警告或封鎖',
          '同一頁面同時顯示中文和英文',
          'CSS 和 JavaScript 混在同一個檔案中',
        ],
        answer: 1,
        explanation: '混合內容（Mixed Content）指的是：在安全的 HTTPS 頁面中，引用了不安全的 HTTP 資源。瀏覽器會警告（被動混合內容，如圖片）或直接封鎖（主動混合內容，如 JS、CSS），因為 HTTP 資源可能被中間人篡改，破壞 HTTPS 提供的安全保障。解決方法是確保所有資源都走 HTTPS。',
      },
    ],
    keyPoints: [
      'HTTPS = HTTP + TLS，提供加密（機密性）、防篡改（完整性）、身份驗證三大保障。',
      'TLS 握手：非對稱加密安全交換金鑰，後續用對稱加密（AES）傳輸資料。',
      'SSL 憑證由 CA 簽發，驗證伺服器身份並提供公鑰。',
      'HSTS 強制瀏覽器只用 HTTPS，防止 SSL 剝除降級攻擊。',
      'HTTP 用 80 埠，HTTPS 用 443 埠。',
      'Google 將 HTTPS 列為排名因素；HTTPS 頁面引用 HTTP 資源會產生混合內容問題。',
    ],
  },

  // ─── HTTP 版本比較 ────────────────────────────────────────────────────────
  {
    slug: 'http-versions',
    title: 'HTTP/1.1 vs HTTP/2 vs HTTP/3',
    description: '比較三個 HTTP 版本的效能改進：多路復用、標頭壓縮、QUIC 協議',
    subCategory: 'HTTP 協議',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: 'HTTP 三個版本核心差異',
          content: `| 特性 | HTTP/1.1 | HTTP/2 | HTTP/3 |
|------|----------|--------|--------|
| 底層協議 | TCP | TCP | QUIC（基於 UDP）|
| 請求多工 | ❌ 隊頭阻塞 | ✅ 多路復用 | ✅ 多路復用 + 消除 TCP 隊頭阻塞 |
| Header 壓縮 | ❌ 無 | ✅ HPACK | ✅ QPACK |
| 連線建立 | TCP 3-way handshake | TCP 3-way + TLS | 0-RTT 或 1-RTT |
| 伺服器推送 | ❌ | ✅ Server Push | ✅ Server Push |
| 發布年份 | 1997 | 2015 | 2022 |`,
        },
        {
          heading: 'HTTP/1.1 的隊頭阻塞問題',
          content: `**HTTP/1.1 的限制：**

\`\`\`
TCP 連線 1: [Request A] → [Response A] → [Request B] → [Response B]
             必須等 A 完成才能送 B（隊頭阻塞）

HTTP/1.1 的「解法」：開多條 TCP 連線（瀏覽器通常開 6 條）
TCP 連線 1: [Request A]
TCP 連線 2: [Request B]
TCP 連線 3: [Request C]
... 但多條連線消耗資源，且仍有限制
\`\`\`

前端工程師的「土炮優化」：
- Domain Sharding：用多個子域名繞過每個域名 6 條連線限制
- CSS Sprites：合併圖片減少請求數
- JS/CSS Bundle：合併檔案減少請求數
（HTTP/2 後這些優化不再必要，甚至可能有反效果）`,
        },
        {
          heading: 'HTTP/2 的改進：多路復用與 HPACK',
          content: `**多路復用（Multiplexing）：**

\`\`\`
HTTP/2 單條 TCP 連線可同時處理多個請求：

TCP 連線: [Req A] [Req B] [Req C]    ← 同時發送
           ↓        ↓        ↓
          [Res A] [Res B] [Res C]    ← 亂序回傳，依 stream ID 重組
\`\`\`

**HPACK Header 壓縮：**
- HTTP/1.1：每個請求都重複傳送大量 Headers（User-Agent、Accept、Cookie 等）
- HTTP/2：HPACK 建立靜態/動態表，相同 Header 只傳差異，大幅減少 Header 體積

**注意：HTTP/2 仍有 TCP 層的隊頭阻塞！**
多個 stream 共享一條 TCP 連線，若某個 TCP 封包遺失，所有 stream 都要等待重傳。`,
        },
        {
          heading: 'HTTP/3 與 QUIC',
          content: `**HTTP/3 基於 QUIC（Quick UDP Internet Connections）：**

\`\`\`
HTTP/1.1、HTTP/2：TCP + TLS
HTTP/3：QUIC（UDP + 內建 TLS 1.3）
\`\`\`

**QUIC 的優勢：**
1. **消除隊頭阻塞**：QUIC 的 stream 彼此獨立，一個封包遺失只影響那個 stream
2. **更快的連線建立**：0-RTT 或 1-RTT（TCP 需要 3-way handshake + TLS handshake）
3. **連線遷移**：從 Wi-Fi 切換到 4G 時，QUIC 連線不會中斷（基於 Connection ID 而非 IP:Port）

**QUIC 為什麼用 UDP？**
UDP 本身無連線、無序，QUIC 在 UDP 上自己實作了可靠傳輸、擁塞控制等功能，同時保持了更大的彈性和效能空間。`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: 'HTTP/1.1 中的「隊頭阻塞（Head-of-Line Blocking）」是指什麼？',
        options: [
          'HTTP/1.1 不支援 Cookie，導致第一個請求阻塞後續',
          '同一個 TCP 連線上，後續請求必須等待前面的請求完成才能傳送',
          'DNS 解析過慢導致第一個連線被阻塞',
          '瀏覽器渲染被 JavaScript 阻塞',
        ],
        answer: 1,
        explanation: 'HTTP/1.1 在同一條 TCP 連線上，請求必須按順序送出並等待回應（request-response 輪流）。若第一個請求很慢，後面的請求都要等待，這就是隊頭阻塞。瀏覽器的解法是開多條 TCP 連線（通常 6 條/域名），但仍有限制。',
      },
      {
        id: 2,
        question: 'HTTP/2 的「多路復用（Multiplexing）」解決了什麼問題？',
        options: [
          '讓瀏覽器可以同時開啟更多 TCP 連線',
          '在單一 TCP 連線上同時傳輸多個請求和回應，消除應用層的隊頭阻塞',
          '讓伺服器可以主動推送資料給客戶端',
          '壓縮 Request Body 減少傳輸量',
        ],
        answer: 1,
        explanation: 'HTTP/2 的多路復用允許在單一 TCP 連線上同時（並行）傳輸多個請求和回應，每個請求是一個獨立的 stream，消除了 HTTP/1.1 的應用層隊頭阻塞。這也讓 HTTP/2 不再需要開多條 TCP 連線，提升效能並降低資源消耗。',
      },
      {
        id: 3,
        question: 'HTTP/2 的 HPACK 主要用途是什麼？',
        options: [
          '壓縮 Response Body（如 HTML、JSON）',
          '壓縮 HTTP Headers，減少重複傳送相同 Header 的開銷',
          '加密 HTTP 連線',
          '壓縮 URL 長度',
        ],
        answer: 1,
        explanation: 'HPACK 是 HTTP/2 的 Header 壓縮演算法。HTTP/1.1 每個請求都重複傳送相同的大型 Header（如 User-Agent、Cookie）。HPACK 建立靜態和動態 Header 表，相同的 Header 只需傳送索引而非完整內容，大幅減少 Header 的傳輸量，對有大量 Cookie 的網站特別有效。',
      },
      {
        id: 4,
        question: 'HTTP/3 基於哪個底層傳輸協議？和前兩個版本有什麼不同？',
        options: [
          'TCP，和 HTTP/1.1、HTTP/2 相同',
          'UDP，透過 QUIC 協議實現可靠傳輸',
          'WebSocket，實現全雙工通訊',
          'SCTP，解決 TCP 的限制',
        ],
        answer: 1,
        explanation: 'HTTP/3 基於 QUIC，而 QUIC 建立在 UDP 之上。HTTP/1.1 和 HTTP/2 都使用 TCP。QUIC 在 UDP 上自己實作了可靠傳輸和擁塞控制，同時解決了 TCP 層的隊頭阻塞、提供更快的連線建立（0-RTT）和連線遷移能力。',
      },
      {
        id: 5,
        question: 'HTTP/2 相比 HTTP/1.1 仍然存在哪個問題？',
        options: [
          'HTTP/2 不支援 TLS 加密',
          'HTTP/2 的 TCP 層仍有隊頭阻塞：一個 TCP 封包遺失會阻塞所有 stream',
          'HTTP/2 不支援 Server Push',
          'HTTP/2 需要更多 TCP 連線',
        ],
        answer: 1,
        explanation: 'HTTP/2 的多路復用消除了應用層的隊頭阻塞，但多個 stream 共享同一條 TCP 連線，仍存在 TCP 層的隊頭阻塞：若一個 TCP 封包遺失，TCP 必須等待重傳，導致所有 stream 都被阻塞。HTTP/3 透過 QUIC（基於 UDP）解決了這個問題，各 stream 彼此獨立。',
      },
      {
        id: 6,
        question: 'HTTP/3 基於 UDP 而不是 TCP 的主要優勢是什麼？',
        options: [
          'UDP 比 TCP 更安全，不易被駭客攻擊',
          'UDP 傳輸速度更快，不需要任何可靠性機制',
          '解除 TCP 隊頭阻塞限制，允許 QUIC 自定義更彈性的可靠傳輸機制',
          'UDP 支援更多同時連線',
        ],
        answer: 2,
        explanation: 'QUIC 選擇 UDP 是因為 UDP 本身無狀態，讓 QUIC 可以在應用層自己實作更靈活的可靠傳輸。這允許 QUIC 在一條連線中讓不同 stream 獨立處理封包遺失，不像 TCP 一個封包遺失就阻塞全部。此外，QUIC 內建 TLS 1.3，連線建立更快（0-RTT 或 1-RTT）。',
      },
      {
        id: 7,
        question: '在 HTTP/2 普及後，以下哪個 HTTP/1.1 時代的前端優化技巧變得不再必要（甚至可能有反效果）？',
        options: [
          '使用 CDN 加速靜態資源',
          '圖片懶加載（Lazy Loading）',
          '將所有 JS/CSS 打包成一個大 Bundle 以減少請求數',
          '啟用 Gzip 壓縮',
        ],
        answer: 2,
        explanation: '在 HTTP/1.1 時代，因為每條連線一次只能處理一個請求，減少請求數（合併 Bundle、CSS Sprites）是重要優化。HTTP/2 多路復用後，多個請求同時傳輸不再是問題，反而超大 Bundle 會延遲首次載入。CDN、懶加載、Gzip 壓縮在 HTTP/2 下仍然有效。',
      },
      {
        id: 8,
        question: 'QUIC 的「連線遷移（Connection Migration）」是什麼功能？',
        options: [
          '從一個伺服器自動遷移到另一個效能更好的伺服器',
          '切換網路（如 Wi-Fi 轉 4G）時，連線不中斷，因為 QUIC 連線基於 Connection ID 而非 IP:Port',
          '自動將 HTTP 連線升級到 HTTPS',
          '在多個 CDN 節點之間自動切換',
        ],
        answer: 1,
        explanation: '傳統 TCP 連線由 IP:Port 四元組（來源 IP、來源 Port、目標 IP、目標 Port）識別，換網路就等於換 IP，連線必須重新建立。QUIC 使用 Connection ID 識別連線，不依賴 IP:Port，所以手機從 Wi-Fi 切換到 4G 時，連線可以繼續使用，無縫銜接，特別適合行動裝置。',
      },
    ],
    keyPoints: [
      'HTTP/1.1 隊頭阻塞：同一連線的請求必須依序等待，瀏覽器用開多條 TCP 連線繞過。',
      'HTTP/2 多路復用：單一 TCP 連線同時處理多個 stream，消除應用層隊頭阻塞。',
      'HTTP/2 HPACK：壓縮 Header，避免重複傳送相同 Header（如 Cookie、User-Agent）。',
      'HTTP/2 仍有 TCP 層隊頭阻塞：一個封包遺失阻塞所有 stream。',
      'HTTP/3 基於 QUIC（UDP）：徹底解決隊頭阻塞、更快連線建立、支援連線遷移。',
      'HTTP/2 後，大量合併 Bundle 的必要性降低；CDN、Gzip、懶加載仍然有效。',
    ],
  },
]
