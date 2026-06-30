import type { Question } from '@/lib/topics'

export const questions: Question[] = [
  {
    id: 1,
    question: 'JavaScript 的 Event Loop 中，哪種任務會優先於 setTimeout callback 執行？',
    options: [
      'DOM 事件 callback',
      'Promise .then() callback（microtask）',
      'setInterval callback',
      'requestAnimationFrame callback',
    ],
    answer: 1,
    explanation:
      'Promise .then() 屬於 microtask，每次 call stack 清空後會先清空 microtask queue，再取下一個 macrotask（如 setTimeout）。所以 Promise .then() 永遠比 setTimeout 先執行。',
  },
  {
    id: 2,
    question: '以下程式碼的輸出順序是什麼？\n\nconsole.log("A")\nsetTimeout(() => console.log("B"), 0)\nPromise.resolve().then(() => console.log("C"))\nconsole.log("D")',
    options: [
      'A, B, C, D',
      'A, D, B, C',
      'A, D, C, B',
      'A, C, D, B',
    ],
    answer: 2,
    explanation:
      '同步程式碼先執行：A → D。接著清空 microtask queue：C。最後執行 macrotask：B。所以結果是 A, D, C, B。',
  },
  {
    id: 3,
    question: 'setTimeout(fn, 0) 的實際行為是什麼？',
    options: [
      '立即同步執行 fn',
      '延遲 0 毫秒後立即執行，插入到目前同步程式碼之前',
      '將 fn 排入 macrotask queue，等當前 call stack 清空且所有 microtask 執行完後才執行',
      '與 Promise.resolve().then() 的執行時機完全相同',
    ],
    answer: 2,
    explanation:
      'setTimeout 是 macrotask，即使延遲 0ms，也要等 call stack 空了、microtask queue 也清空後，才會執行。',
  },
  {
    id: 4,
    question: '以下程式碼輸出什麼？\n\nPromise.resolve()\n  .then(() => console.log("1"))\n  .then(() => console.log("2"))\n\nPromise.resolve()\n  .then(() => console.log("3"))\n  .then(() => console.log("4"))',
    options: [
      '1, 2, 3, 4',
      '1, 3, 2, 4',
      '3, 4, 1, 2',
      '1, 2, 4, 3',
    ],
    answer: 1,
    explanation:
      '兩個 Promise chain 交替執行 microtask。第一輪 microtask：1 和 3（兩個 .then 都在 queue 中）。第二輪：2 和 4。所以輸出 1, 3, 2, 4。',
  },
  {
    id: 5,
    question: '以下程式碼輸出什麼？\n\nasync function foo() {\n  console.log("B")\n  await Promise.resolve()\n  console.log("D")\n}\n\nconsole.log("A")\nfoo()\nconsole.log("C")',
    options: [
      'A, B, C, D',
      'A, B, D, C',
      'A, D, B, C',
      'B, A, C, D',
    ],
    answer: 0,
    explanation:
      'A 先同步執行。foo() 被呼叫，同步印出 B，遇到 await 暫停，控制權回到外部。C 同步執行。最後 await 完成，D 在 microtask 中執行。結果：A, B, C, D。',
  },
  {
    id: 6,
    question: '哪種方式可以將程式碼排入 microtask queue？',
    options: [
      'setTimeout(fn, 0)',
      'setImmediate(fn)',
      'queueMicrotask(fn)',
      'requestIdleCallback(fn)',
    ],
    answer: 2,
    explanation:
      'queueMicrotask() 是專門用來將 callback 加入 microtask queue 的 API，行為與 Promise.resolve().then() 相同。',
  },
  {
    id: 7,
    question: '以下程式碼輸出什麼？\n\nconsole.log("1")\nsetTimeout(() => {\n  console.log("2")\n  Promise.resolve().then(() => console.log("3"))\n}, 0)\nPromise.resolve().then(() => console.log("4"))\nconsole.log("5")',
    options: [
      '1, 5, 4, 2, 3',
      '1, 5, 2, 3, 4',
      '1, 2, 3, 4, 5',
      '1, 5, 2, 4, 3',
    ],
    answer: 0,
    explanation:
      '同步：1, 5。microtask：4。macrotask（setTimeout）：2，setTimeout 內部觸發 Promise → microtask：3。最終：1, 5, 4, 2, 3。',
  },
  {
    id: 8,
    question: 'async function 中，await 之後的程式碼等同於放在哪裡？',
    options: [
      'setTimeout(fn, 0) 的 callback',
      'Promise.resolve().then() 的 callback',
      '同步執行，緊接在 await 之後',
      'setImmediate 的 callback',
    ],
    answer: 1,
    explanation:
      'await 實際上是 Promise .then() 的語法糖。await 之後的程式碼會被排入 microtask queue，等待當前同步程式碼執行完後才繼續。',
  },
  {
    id: 9,
    question: '以下程式碼輸出什麼？\n\nasync function a() {\n  await b()\n  console.log("A done")\n}\nasync function b() {\n  console.log("B")\n}\nconsole.log("Start")\na()\nconsole.log("End")',
    options: [
      'Start, B, A done, End',
      'Start, End, B, A done',
      'Start, B, End, A done',
      'B, Start, End, A done',
    ],
    answer: 2,
    explanation:
      '同步：Start。a() 呼叫 b()，同步執行 B，b() 回傳 resolved Promise，await 暫停 a()。同步：End。microtask：A done。結果：Start, B, End, A done。',
  },
  {
    id: 10,
    question: '以下程式碼輸出什麼？\n\nconsole.log("1")\nsetTimeout(() => console.log("2"), 100)\nsetTimeout(() => console.log("3"), 0)\nPromise.resolve().then(() => console.log("4"))\nconsole.log("5")',
    options: [
      '1, 5, 4, 3, 2',
      '1, 4, 5, 3, 2',
      '1, 5, 2, 3, 4',
      '1, 5, 3, 4, 2',
    ],
    answer: 0,
    explanation:
      '同步：1, 5。microtask：4。macrotask（0ms timeout）：3。macrotask（100ms timeout）：2。結果：1, 5, 4, 3, 2。',
  },
]
