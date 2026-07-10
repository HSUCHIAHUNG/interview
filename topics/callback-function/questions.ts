import type { Question } from '@/lib/topics'

export const questions: Question[] = [
  {
    id: 1,
    question: '什麼是 callback function（回呼函式）？',
    options: [
      '一個立即執行的匿名函式',
      '一個被當作參數傳入另一個函式，並在適當時機被呼叫的函式',
      '一個專門用來處理 Promise 的函式',
      '一個在頁面載入完成後自動執行的函式',
    ],
    answer: 1,
    explanation:
      'Callback function 是指將一個函式作為參數傳遞給另一個函式，由接收方在適當時機（如非同步操作完成後）來呼叫它。這是 JavaScript 處理非同步操作最基本的方式。',
  },
  {
    id: 2,
    question: '以下哪個是「同步 callback」的例子？',
    options: [
      'setTimeout(() => console.log("hi"), 1000)',
      'fetch(url).then(res => res.json())',
      '[1, 2, 3].forEach(n => console.log(n))',
      'fs.readFile("file.txt", callback)',
    ],
    answer: 2,
    explanation:
      'Array.prototype.forEach 傳入的 callback 是同步執行的，每個元素都會在當前 call stack 內立即呼叫。setTimeout 與 fetch().then 的 callback 是非同步的，fs.readFile 的 callback 也是非同步的。',
  },
  {
    id: 3,
    question: '以下程式碼的輸出結果為何？\n\nconsole.log("A")\nsetTimeout(() => console.log("B"), 0)\nconsole.log("C")',
    options: [
      'A, B, C',
      'A, C, B',
      'B, A, C',
      'C, A, B',
    ],
    answer: 1,
    explanation:
      'setTimeout 的 callback 是非同步的，即使 delay 為 0ms，也會被排入 macrotask queue，等當前同步程式碼（A 和 C）執行完後才執行。所以輸出順序是 A, C, B。',
  },
  {
    id: 4,
    question: '什麼是「Callback Hell（回呼地獄）」？',
    options: [
      '使用太多 callback 導致記憶體洩漏的問題',
      '多個非同步操作嵌套 callback 導致程式碼深度縮排、難以維護的情況',
      '同步 callback 造成主執行緒阻塞的問題',
      'callback 函式拋出錯誤時無法被 try/catch 捕捉的問題',
    ],
    answer: 1,
    explanation:
      'Callback Hell 是指當多個非同步操作需要依序執行時，不斷地在 callback 內嵌套下一個 callback，造成程式碼呈現金字塔形狀（pyramid of doom），難以閱讀、測試和維護。Promise 和 async/await 是解決此問題的方案。',
  },
  {
    id: 5,
    question: '下列哪個情境最適合使用 callback function？',
    options: [
      '宣告一個全域變數',
      '進行數學運算並立即回傳結果',
      '為按鈕綁定點擊事件，等使用者點擊時再執行邏輯',
      '定義一個 class',
    ],
    answer: 2,
    explanation:
      'Callback 最適合用在事件驅動（event-driven）的場景，例如 addEventListener 綁定事件。當使用者點擊按鈕時，瀏覽器才會呼叫傳入的 callback function，而不是馬上執行。',
  },
  {
    id: 6,
    question: 'Array 的哪些方法接受 callback function 作為參數？（選出最完整的答案）',
    options: [
      '只有 forEach',
      'forEach、map、filter、reduce',
      '只有 map 和 filter',
      'forEach、map、filter、reduce、find、every、some',
    ],
    answer: 3,
    explanation:
      'JavaScript Array 有許多高階函式（higher-order functions）都接受 callback：forEach（迭代）、map（轉換）、filter（過濾）、reduce（累加）、find（查找）、every（全部符合）、some（任一符合）等，這些都是同步 callback 的常見應用。',
  },
  {
    id: 7,
    question: 'Callback function 相比 Promise/async-await 最主要的缺點是什麼？',
    options: [
      'Callback 的執行速度比 Promise 慢',
      'Callback 無法處理非同步操作',
      '多層嵌套的 callback 難以閱讀和維護，且錯誤處理分散不集中',
      'Callback 不支援在瀏覽器環境使用',
    ],
    answer: 2,
    explanation:
      'Callback 最大的缺點是巢狀結構（callback hell）導致可讀性差，且每個 callback 都需要自行處理錯誤（通常透過第一個參數傳入 error），容易漏掉錯誤處理。Promise 的 .catch() 和 async/await 的 try/catch 提供更集中的錯誤處理方式。',
  },
  {
    id: 8,
    question: '以下程式碼中，哪個是 callback function？\n\nfunction greet(name, callback) {\n  const message = "Hello, " + name\n  callback(message)\n}\n\ngreet("Alice", (msg) => console.log(msg))',
    options: [
      'greet 函式',
      '"Alice" 字串',
      '(msg) => console.log(msg)',
      'message 變數',
    ],
    answer: 2,
    explanation:
      '(msg) => console.log(msg) 是 callback function，它被當作第二個參數傳入 greet 函式，並在 greet 函式內部透過 callback(message) 被呼叫。這是 callback 最典型的使用方式：定義一個函式並傳遞給別人來呼叫。',
  },
]
