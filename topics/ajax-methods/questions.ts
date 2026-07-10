import type { Question } from '@/lib/topics'

export const questions: Question[] = [
  {
    id: 1,
    question: 'AJAX 的全名是什麼？其核心用途為何？',
    options: [
      'Asynchronous JavaScript And XML，在不重新整理頁面的情況下與伺服器交換資料',
      'Advanced JavaScript And XHTML，用於製作動畫效果',
      'Asynchronous Java And XML，需要搭配 Java 後端才能使用',
      'Automated JSON And XHTML，自動格式化 JSON 資料',
    ],
    answer: 0,
    explanation:
      'AJAX 全名是 Asynchronous JavaScript And XML，雖然現今多使用 JSON 而非 XML，但名稱沿用至今。其核心概念是讓網頁在不重新載入整個頁面的情況下，非同步地與伺服器溝通並更新部分內容，提升使用者體驗。',
  },
  {
    id: 2,
    question: 'XMLHttpRequest（XHR）是 AJAX 最早的實作方式，以下關於 XHR 的描述何者正確？',
    options: [
      'XHR 使用 Promise 作為回傳值',
      'XHR 透過事件回呼（onload、onerror）處理請求結果，API 較為繁瑣',
      'XHR 只能傳送 XML 格式的資料',
      'XHR 是 ES6 之後才引入的 API',
    ],
    answer: 1,
    explanation:
      'XMLHttpRequest 是傳統的 AJAX API，使用事件驅動的方式：設定 onload、onerror、onreadystatechange 等回呼函式，並手動呼叫 open() 和 send() 方法。API 較為繁瑣，需要大量樣板程式碼。現代開發多已使用 fetch API 或 axios 替代。',
  },
  {
    id: 3,
    question: '以下關於 fetch API 的描述，哪個是正確的？',
    options: [
      'fetch 遇到 4xx 或 5xx HTTP 狀態碼時，會自動 reject Promise',
      'fetch 回傳 Promise，但只有在網路錯誤時才 reject，4xx/5xx 不會 reject',
      'fetch 只能用於 GET 請求',
      'fetch 無法設定請求 headers',
    ],
    answer: 1,
    explanation:
      'fetch 的一個重要特性是：即使伺服器回傳 404 或 500 等錯誤狀態碼，fetch 的 Promise 仍然會 resolve（不會 reject）。只有在網路中斷等真正的網路錯誤才會 reject。因此需要手動檢查 response.ok 或 response.status 來判斷請求是否成功。這是 fetch 與 axios 的重要差異。',
  },
  {
    id: 4,
    question: 'axios 相比原生 fetch API 有哪些優勢？',
    options: [
      'axios 執行速度比 fetch 快 10 倍',
      'axios 自動轉換 JSON、對 4xx/5xx 自動 reject、支援請求攔截器和取消請求',
      'axios 是 W3C 標準，fetch 是非標準',
      'axios 不需要安裝任何套件即可使用',
    ],
    answer: 1,
    explanation:
      'axios 相比 fetch 的優勢：(1) 自動解析 JSON 回應，不需要手動呼叫 response.json()；(2) HTTP 錯誤狀態（4xx/5xx）會自動 reject Promise；(3) 支援請求和回應攔截器（interceptors）；(4) 支援取消請求（AbortController）；(5) 在舊瀏覽器和 Node.js 環境都可使用。',
  },
  {
    id: 5,
    question: '使用 async/await 搭配 fetch 發送 GET 請求並解析 JSON 的正確寫法是？',
    options: [
      'const data = await fetch(url)',
      'const res = await fetch(url)\nconst data = await res.json()',
      'const data = fetch(url).json()',
      'const data = await fetch(url).parse()',
    ],
    answer: 1,
    explanation:
      '使用 fetch 需要兩個 await：第一個 await fetch(url) 等待 HTTP 回應標頭（得到 Response 物件），第二個 await res.json() 等待回應 body 被讀取並解析為 JSON。因為 fetch 是串流（stream）設計，response body 的讀取也是非同步的。',
  },
  {
    id: 6,
    question: '什麼是 CORS（跨來源資源共用）？在 AJAX 中何時會遇到？',
    options: [
      'CORS 是一種加密傳輸協定，讓 AJAX 請求更安全',
      '瀏覽器的安全機制，當網頁向不同來源（協定/域名/埠）發送請求時觸發，需要伺服器設定允許的來源',
      'CORS 是 Node.js 的中介軟體，用於壓縮回應資料',
      'CORS 只在 POST 請求時發生，GET 請求不受影響',
    ],
    answer: 1,
    explanation:
      'CORS（Cross-Origin Resource Sharing）是瀏覽器的同源政策（Same-Origin Policy）延伸機制。當 AJAX 請求的目標 URL 與當前頁面的協定、域名或埠號不同時，就會發生跨來源請求。瀏覽器會先發送 OPTIONS 預檢請求（preflight），確認伺服器設定了正確的 Access-Control-Allow-Origin 等 headers 才允許請求。CORS 錯誤需要在伺服器端解決，不能在前端繞過。',
  },
  {
    id: 7,
    question: '以下關於 fetch 的敘述，哪個是錯誤的？',
    options: [
      'fetch 原生支援 Promise，可搭配 async/await 使用',
      'fetch 回應 body 只能被讀取一次',
      'fetch 在所有 HTTP 錯誤（包含 404、500）時都會 reject Promise',
      'fetch 可以透過 AbortController 取消請求',
    ],
    answer: 2,
    explanation:
      'fetch 在 404、500 等 HTTP 錯誤狀態時並不會 reject Promise，這是 fetch 的設計決策（只有網路錯誤才 reject）。其他選項都是正確的：fetch 原生支援 Promise，response body 是 ReadableStream 只能讀取一次，以及可透過 AbortController 取消請求。',
  },
]
