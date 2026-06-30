import type { Question } from '@/lib/topics'

export const questions: Question[] = [
  {
    id: 1,
    question: 'async/await 與 Promise 的關係是什麼？',
    options: [
      'async/await 是全新的非同步機制，與 Promise 無關',
      'async/await 是 Promise 的語法糖，底層仍然使用 Promise',
      'Promise 是 async/await 的語法糖',
      'async/await 只能搭配 fetch 使用',
    ],
    answer: 1,
    explanation:
      'async/await 是建立在 Promise 之上的語法糖。async 函式永遠回傳 Promise，而 await 就是在等待一個 Promise resolve。',
  },
  {
    id: 2,
    question: '以下兩段程式碼，行為是否相同？\n\n// A\nfetch(url).then(r => r.json()).then(data => console.log(data))\n\n// B\nasync function get() {\n  const r = await fetch(url)\n  const data = await r.json()\n  console.log(data)\n}',
    options: [
      '完全相同，只是寫法不同',
      'A 是並行，B 是串行',
      'A 比 B 執行更快',
      'B 無法處理錯誤，A 才能用 .catch()',
    ],
    answer: 0,
    explanation:
      '兩段程式碼行為等價，都是先 fetch，再解析 JSON，再 console.log。async/await 只是讓非同步程式碼看起來像同步。',
  },
  {
    id: 3,
    question: '錯誤處理方面，Promise 使用 .catch()，async/await 使用什麼？',
    options: [
      'try/catch',
      'error event listener',
      'window.onerror',
      '.error()',
    ],
    answer: 0,
    explanation:
      'async/await 的錯誤處理使用 try/catch，當 await 的 Promise 被 reject 時，錯誤會被 catch 捕捉。也可以在 await 後面鏈接 .catch()。',
  },
  {
    id: 4,
    question: '哪種情況只有 Promise API 能做到，async/await 單獨無法替代？',
    options: [
      '循序執行多個非同步操作',
      '使用 Promise.all() 並行等待多個 Promise',
      '捕捉非同步錯誤',
      'return 一個非同步結果',
    ],
    answer: 1,
    explanation:
      'Promise.all()、Promise.race()、Promise.allSettled() 等靜態方法是 Promise 獨有的。雖然 async/await 可以搭配這些方法使用，但如果不透過 Promise API 本身，單靠 await 無法原生並行等待多個 Promise。',
  },
  {
    id: 5,
    question: '以下程式碼有什麼問題？\n\nasync function loadAll() {\n  const a = await fetchA()\n  const b = await fetchB()\n  const c = await fetchC()\n  return [a, b, c]\n}',
    options: [
      '語法錯誤，await 不能連續使用',
      '三個請求是串行執行的，若彼此無依賴，效率較差',
      '只有最後一個 await 會被執行',
      'return 陣列會讓 Promise resolve 失敗',
    ],
    answer: 1,
    explanation:
      '三個 fetch 互不依賴卻串行執行，總時間 = A + B + C。應改用 Promise.all([fetchA(), fetchB(), fetchC()]) 並行執行，總時間 = max(A, B, C)。',
  },
  {
    id: 6,
    question: 'async function 沒有明確 return 值時，它回傳什麼？',
    options: [
      'undefined',
      'null',
      'Promise.resolve(undefined)',
      '拋出錯誤',
    ],
    answer: 2,
    explanation:
      '所有 async function 都回傳一個 Promise。若沒有 return，等同於 return undefined，所以回傳 Promise.resolve(undefined)。',
  },
  {
    id: 7,
    question: 'await 只能用在哪裡？',
    options: [
      '任何地方',
      '只能在 async function 或模組的最外層',
      '只能在 Promise 的 .then() callback 內',
      '只能在 class 方法中',
    ],
    answer: 1,
    explanation:
      'await 必須在 async function 內使用。ES Modules（.mjs 或 <script type="module">）的最外層也支援 Top-Level Await。',
  },
  {
    id: 8,
    question: '以下 Promise 鏈中，.catch() 能捕捉哪些錯誤？\n\nfetchData()\n  .then(process)\n  .then(save)\n  .catch(handleError)',
    options: [
      '只捕捉 fetchData 的錯誤',
      '只捕捉 save 的錯誤',
      '捕捉 fetchData、process、save 任一環節拋出的錯誤',
      '.catch() 只捕捉網路錯誤',
    ],
    answer: 2,
    explanation:
      'Promise 鏈中任何環節 reject 或 throw，都會跳過後續 .then()，直到第一個 .catch()。所以這個 .catch() 能捕捉整條鏈的錯誤。',
  },
  {
    id: 9,
    question: '以下關於 async/await 的說法，哪個是錯的？',
    options: [
      'await 讓程式碼看起來像同步，但實際上不阻塞 event loop',
      'async function 內部可以混用 .then() 和 await',
      'await 只能等待 Promise，不能等待普通值',
      'async/await 改善了錯誤處理的可讀性',
    ],
    answer: 2,
    explanation:
      'await 可以接受任何值。若 await 後面跟的不是 Promise，它會被包成 Promise.resolve(value)，然後立即 resolve。',
  },
  {
    id: 10,
    question: 'Promise .then() 可以回傳一個值或另一個 Promise，這有什麼效果？',
    options: [
      '回傳普通值會導致 Promise 被 reject',
      '只有回傳 Promise 才能繼續鏈接 .then()',
      '回傳普通值時，下一個 .then() 收到該值；回傳 Promise 時，等該 Promise resolve 後下一個 .then() 才執行',
      '兩種情況下一個 .then() 都立即執行',
    ],
    answer: 2,
    explanation:
      '.then() 的 callback 若 return 普通值，下一個 .then() 的參數就是該值；若 return 一個 Promise，Promise 鏈會等待它 resolve 後再繼續，這是 Promise 鏈能處理非同步操作的關鍵。',
  },
]
