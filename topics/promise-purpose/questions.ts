import type { Question } from '@/lib/topics'

export const questions: Question[] = [
  {
    id: 1,
    question: 'Promise 主要是為了解決什麼問題而被引入的？',
    options: [
      '讓 JavaScript 支援多執行緒',
      '解決 Callback Hell（回呼地獄）帶來的巢狀結構難以閱讀和維護的問題',
      '讓同步程式碼執行更快',
      '取代 setTimeout 的功能',
    ],
    answer: 1,
    explanation:
      '在 Promise 之前，非同步操作必須層層嵌套 callback，形成所謂的 "Callback Hell"（金字塔形結構），難以閱讀、維護和處理錯誤。Promise 讓非同步流程可以用鏈式（chaining）方式表達。',
  },
  {
    id: 2,
    question: '以下是 Callback Hell 的範例，Promise 如何改善它的可讀性？\n\ngetUser(id, function(user) {\n  getOrders(user, function(orders) {\n    getDetails(orders[0], function(detail) {\n      // ...\n    })\n  })\n})',
    options: [
      '讓程式碼執行更快',
      '允許程式碼並行執行',
      '將巢狀 callback 改為扁平的 .then() 鏈，提升可讀性',
      '讓錯誤自動被捕捉',
    ],
    answer: 2,
    explanation:
      '使用 Promise 可以寫成：getUser(id).then(getOrders).then(detail => getDetails(detail[0])).catch(handleError)，從巢狀結構變成線性的、由上到下的程式碼流程，可讀性大幅提升。',
  },
  {
    id: 3,
    question: 'Promise 有哪三種狀態？',
    options: [
      'loading、success、error',
      'pending、fulfilled、rejected',
      'waiting、done、failed',
      'idle、running、complete',
    ],
    answer: 1,
    explanation:
      'Promise 的三個狀態：pending（初始狀態，尚未完成）、fulfilled（成功完成）、rejected（失敗）。狀態只能從 pending 轉換到 fulfilled 或 rejected，且轉換後不可再變更。',
  },
  {
    id: 4,
    question: '在 Callback 模式中，錯誤處理有什麼問題？',
    options: [
      '無法處理錯誤，callback 不支援錯誤',
      '每一層 callback 都需要單獨處理錯誤，容易遺漏，且重複程式碼多',
      '錯誤只能用 try/catch 處理',
      'Callback 錯誤處理比 Promise 更清楚',
    ],
    answer: 1,
    explanation:
      '傳統 callback 通常使用 Node.js 的 error-first 慣例（第一個參數是 error），但每層都要手動檢查錯誤，容易遺漏。Promise 的 .catch() 可以集中處理整條鏈中任何環節的錯誤。',
  },
  {
    id: 5,
    question: 'Promise.all() 解決了什麼問題？',
    options: [
      '讓多個 Promise 串行執行',
      '讓多個獨立的非同步操作並行執行，並在全部完成後統一處理結果',
      '讓 Promise 可以取消',
      '解決 Promise 的記憶體洩漏問題',
    ],
    answer: 1,
    explanation:
      'Promise.all([p1, p2, p3]) 讓多個 Promise 同時執行（並行），等全部 resolve 後才繼續，且任一 reject 立即 reject 整體。相比串行 callback，效率大幅提升。',
  },
  {
    id: 6,
    question: '控制反轉（Inversion of Control）是 callback 模式的哪個問題？',
    options: [
      'callback 無法回傳值',
      '當你把 callback 傳給第三方函式，你失去對 callback 被呼叫時機和次數的控制',
      'callback 不支援 async 操作',
      'callback 無法處理多個結果',
    ],
    answer: 1,
    explanation:
      '把 callback 傳給第三方後，你信任對方會正確呼叫它（一次、在正確的時機、傳入正確參數）。若對方有 bug 或惡意，你的 callback 可能被呼叫多次、不被呼叫、或傳入錯誤參數。Promise 讓控制權回到你手中。',
  },
  {
    id: 7,
    question: 'async/await 相比 Promise .then() 鏈，主要改善了什麼？',
    options: [
      '執行速度更快',
      '支援更多並行操作',
      '讓非同步程式碼可以用同步的寫法表達，更直觀、更接近同步思維',
      '能取消正在執行的非同步操作',
    ],
    answer: 2,
    explanation:
      'async/await 讓開發者可以用 try/catch 處理錯誤、用 if/for 控制流程，寫出幾乎和同步程式碼一樣的結構，大幅降低心智負擔。',
  },
  {
    id: 8,
    question: '以下關於 Promise 和 async/await 共同解決的問題，哪個說法最完整？',
    options: [
      '它們讓 JavaScript 變成同步語言',
      '它們消除了所有非同步程式設計的複雜度',
      '它們提供了結構化的非同步流程控制，解決了 callback 帶來的可讀性差、錯誤處理困難和控制反轉問題',
      '它們只解決了效能問題',
    ],
    answer: 2,
    explanation:
      'Promise 和 async/await 的核心貢獻在於：(1) 將巢狀 callback 攤平為線性流程，(2) 提供統一的錯誤處理機制（.catch/try-catch），(3) 讓非同步流程的控制權回到開發者手中。',
  },
]
