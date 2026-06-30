import type { Question } from '@/lib/topics'

export const questions: Question[] = [
  {
    id: 1,
    question: '以下關於閉包（closure）的定義，哪個最正確？',
    options: [
      '一個立即執行的函式（IIFE）',
      '一個函式能夠記住並存取其定義時所在的詞法作用域，即使該函式在作用域外執行',
      '一個沒有名稱的匿名函式',
      '一個只能被呼叫一次的函式',
    ],
    answer: 1,
    explanation:
      '閉包是函式與其定義時的詞法環境的組合。即使外部函式已經回傳，內部函式仍然保有對外部作用域變數的參考，這就是閉包。',
  },
  {
    id: 2,
    question: '下列程式碼會輸出什麼？\n\nfunction makeCounter() {\n  let count = 0\n  return function() {\n    count++\n    return count\n  }\n}\nconst counter = makeCounter()\nconsole.log(counter()) // ?\nconsole.log(counter()) // ?',
    options: [
      '1, 1',
      '0, 1',
      '1, 2',
      '拋出錯誤，count 已超出作用域',
    ],
    answer: 2,
    explanation:
      '每次呼叫 counter() 時，內部函式透過閉包存取同一個 count 變數，所以 count 會持續累加，第一次回傳 1，第二次回傳 2。',
  },
  {
    id: 3,
    question: '以下程式碼會輸出什麼？\n\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0)\n}',
    options: [
      '0, 1, 2',
      '3, 3, 3',
      '0, 0, 0',
      'undefined, undefined, undefined',
    ],
    answer: 1,
    explanation:
      'var 沒有區塊作用域，三個 setTimeout 的 callback 共享同一個 i。迴圈結束後 i 已變成 3，所以三個 callback 都輸出 3。',
  },
  {
    id: 4,
    question: '要讓上一題的迴圈正確輸出 0, 1, 2，最簡單的修法是什麼？',
    options: [
      '把 setTimeout 改成 setInterval',
      '把 var 改成 let',
      '在 console.log 外面加 try/catch',
      '把箭頭函式改成一般函式',
    ],
    answer: 1,
    explanation:
      'let 有區塊作用域，每次迭代會產生一個新的 i 綁定，各自的 closure 捕捉到不同的 i，所以能正確輸出 0, 1, 2。',
  },
  {
    id: 5,
    question: '閉包最常被用來實現哪種設計模式，讓變數無法被外部直接存取？',
    options: [
      '觀察者模式（Observer）',
      '模組模式（Module Pattern）',
      '工廠模式（Factory）',
      '單例模式（Singleton）',
    ],
    answer: 1,
    explanation:
      '模組模式利用閉包把私有狀態藏在函式作用域內，只暴露特定的公開 API，達到封裝的效果。',
  },
  {
    id: 6,
    question: '下列哪個場景最適合使用閉包？',
    options: [
      '一次性地格式化日期字串',
      '建立一個帶有私有計數器的工廠函式，每個實例計數器獨立',
      '解析 JSON 字串',
      '排序陣列',
    ],
    answer: 1,
    explanation:
      '閉包可以讓每個工廠函式的呼叫結果擁有獨立的私有狀態，這是閉包最典型的應用場景之一。',
  },
  {
    id: 7,
    question: 'Memoization（記憶化）技術依賴哪個 JavaScript 特性？',
    options: [
      'Prototype chain',
      'Event loop',
      'Closure',
      'Hoisting',
    ],
    answer: 2,
    explanation:
      'Memoization 利用閉包將快取物件保存在函式作用域內，讓包裝後的函式可以在多次呼叫間共享這份快取，避免重複計算。',
  },
  {
    id: 8,
    question: '以下程式碼中，內部函式能存取哪些變數？\n\nconst x = 1\nfunction outer() {\n  const y = 2\n  function inner() {\n    const z = 3\n    // 這裡可以存取哪些？\n  }\n}',
    options: [
      '只有 z',
      'z 和 y',
      'z、y 和 x',
      '只有 x（全域變數）',
    ],
    answer: 2,
    explanation:
      '閉包依照詞法作用域鏈運作：inner 可以存取自己的 z、外層 outer 的 y，以及全域的 x。',
  },
  {
    id: 9,
    question: '關於閉包與記憶體，以下哪個說法正確？',
    options: [
      '閉包不會佔用額外記憶體',
      '閉包的外部變數在外部函式執行結束後會立即被 GC 回收',
      '只要閉包存在，它所參照的外部變數就無法被 GC 回收，可能造成記憶體洩漏',
      '閉包只能捕捉基本型別（number、string），無法捕捉物件',
    ],
    answer: 2,
    explanation:
      '閉包持有外部變數的參考，只要閉包本身還被使用，這些變數就不會被垃圾回收。若不小心讓閉包長期存活（如全域變數、事件監聽），可能造成記憶體洩漏。',
  },
  {
    id: 10,
    question: '下列 curry 函式用到了哪個核心概念？\n\nfunction add(a) {\n  return function(b) {\n    return a + b\n  }\n}\nconst add5 = add(5)\nconsole.log(add5(3)) // 8',
    options: [
      'Prototype 繼承',
      '閉包（Closure）',
      '非同步程式設計',
      'Symbol',
    ],
    answer: 1,
    explanation:
      'add5 是一個閉包，它記住了 a = 5 這個詞法環境。之後呼叫 add5(3) 時，內部函式存取閉包中的 a，計算出 5 + 3 = 8。',
  },
]
