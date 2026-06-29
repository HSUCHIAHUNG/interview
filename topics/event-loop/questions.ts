import type { Question } from '@/lib/topics'

export const questions: Question[] = [
  {
    id: 1,
    question: 'JavaScript 是單執行緒語言，但可以處理非同步操作，這是因為什麼機制？',
    options: [
      '多執行緒支援',
      'Event Loop 搭配 Web API 和任務佇列',
      '編譯器最佳化',
      'JavaScript 引擎內建並行處理',
    ],
    answer: 1,
    explanation:
      'JavaScript 本身是單執行緒的，只有一個 Call Stack。非同步能力來自瀏覽器（或 Node.js）提供的 Web API，完成後把回呼放入任務佇列，Event Loop 負責在 Call Stack 為空時把任務搬進來執行。',
  },
  {
    id: 2,
    question: 'Call Stack（呼叫堆疊）的作用是什麼？',
    options: [
      '儲存非同步回呼函式',
      '追蹤目前執行到哪個函式，管理函式的呼叫與返回',
      '儲存 Promise 的結果',
      '管理 setTimeout 的計時',
    ],
    answer: 1,
    explanation:
      'Call Stack 是後進先出（LIFO）的資料結構。每呼叫一個函式就推入（push）一個 frame，函式執行完就彈出（pop）。Stack overflow 就是因為遞迴太深或無限遞迴讓 Stack 溢出。',
  },
  {
    id: 3,
    question: 'setTimeout(fn, 0) 的回呼會在什麼時候執行？',
    options: [
      '立即執行，等同於直接呼叫 fn()',
      '在目前同步程式碼和所有 Microtask 執行完後，才從 Macrotask Queue 取出執行',
      '在下一個 setTimeout 之前執行',
      '在 Promise 之前執行',
    ],
    answer: 1,
    explanation:
      'setTimeout 是 Macrotask（宏任務）。即使設定 0ms，回呼也要等：1) 目前同步程式碼執行完，2) Call Stack 清空，3) 所有 Microtask（Promise.then）執行完，4) Event Loop 才從 Macrotask Queue 取出執行。',
  },
  {
    id: 4,
    question: '以下程式碼的輸出順序是什麼？\n\nconsole.log("1")\nsetTimeout(() => console.log("2"), 0)\nPromise.resolve().then(() => console.log("3"))\nconsole.log("4")',
    options: [
      '1, 2, 3, 4',
      '1, 4, 2, 3',
      '1, 4, 3, 2',
      '1, 3, 4, 2',
    ],
    answer: 2,
    explanation:
      '同步程式碼先執行：1 → 4。Promise.then 進入 Microtask Queue，setTimeout 進入 Macrotask Queue。同步完成後先清空 Microtask Queue：3。最後執行 Macrotask：2。所以輸出 1, 4, 3, 2。',
  },
  {
    id: 5,
    question: 'Microtask Queue 和 Macrotask Queue 的優先順序是什麼？',
    options: [
      '兩者優先順序相同，先進先出',
      'Macrotask 優先於 Microtask',
      '每執行完一個 Macrotask，就清空所有 Microtask，再執行下一個 Macrotask',
      'Microtask 只在瀏覽器空閒時執行',
    ],
    answer: 2,
    explanation:
      'Event Loop 的規則：執行一個 Macrotask → 清空所有 Microtask（包括執行 Microtask 過程中新增的）→ 執行下一個 Macrotask。所以 Promise.then 永遠比 setTimeout 更早執行。',
  },
  {
    id: 6,
    question: '下列哪個屬於 Microtask（微任務）？',
    options: [
      'setTimeout',
      'setInterval',
      'Promise.then / async await',
      'requestAnimationFrame',
    ],
    answer: 2,
    explanation:
      'Promise.then、Promise.catch、Promise.finally、queueMicrotask() 和 async/await（await 後面的程式碼）都屬於 Microtask。setTimeout、setInterval、requestAnimationFrame、I/O 事件都屬於 Macrotask。',
  },
  {
    id: 7,
    question: '以下程式碼的輸出順序是什麼？\n\nasync function main() {\n  console.log("A")\n  await Promise.resolve()\n  console.log("B")\n}\nmain()\nconsole.log("C")',
    options: [
      'A, B, C',
      'A, C, B',
      'C, A, B',
      'A, B 同時, C',
    ],
    answer: 1,
    explanation:
      'main() 開始執行，印出 A。遇到 await，暫停 main，把 await 後面的程式碼（印 B）放入 Microtask Queue。控制權回到主程式，印出 C。同步程式碼結束，清空 Microtask，執行印 B。輸出：A, C, B。',
  },
  {
    id: 8,
    question: '為什麼不應該在主執行緒跑大量運算（例如迴圈計算 1 億次）？',
    options: [
      '因為 JavaScript 不支援數學運算',
      '因為 Call Stack 被佔用，Event Loop 無法處理任何事件，UI 會凍結',
      '因為會造成記憶體洩漏',
      '因為 JavaScript 只能處理 10000 次迭代',
    ],
    answer: 1,
    explanation:
      '大量同步運算會長時間佔用 Call Stack，Event Loop 無法執行任何其他任務（包括使用者的點擊、滾動、Timer 回呼等），導致頁面完全無響應（UI 凍結）。解法：使用 Web Worker 把運算移到另一個執行緒，或用 setTimeout 分批執行。',
  },
  {
    id: 9,
    question: '以下程式碼輸出什麼？\n\nPromise.resolve()\n  .then(() => console.log("P1"))\n  .then(() => console.log("P2"))\n\nsetTimeout(() => console.log("T"), 0)',
    options: [
      'T, P1, P2',
      'P1, T, P2',
      'P1, P2, T',
      'T, P1, P2 同時',
    ],
    answer: 2,
    explanation:
      'P1 的 .then 先進入 Microtask Queue。同步程式碼結束後，執行 P1，P1 結束後 P2 的 .then 進入 Microtask Queue，立即執行 P2。所有 Microtask 清空後，才執行 Macrotask T。輸出：P1, P2, T。',
  },
  {
    id: 10,
    question: 'Web API 是誰提供的？',
    options: [
      'JavaScript 引擎（V8）',
      '瀏覽器或 Node.js 執行環境',
      'ECMAScript 規範',
      'npm 套件',
    ],
    answer: 1,
    explanation:
      'setTimeout、fetch、DOM 事件、requestAnimationFrame 等 Web API 是由瀏覽器環境（或 Node.js 的 libuv）提供的，不是 JavaScript 語言本身的一部分。這就是為什麼這些 API 在不同環境（瀏覽器 vs Node.js）可能行為不同。',
  },
]
