import type { Question } from '@/lib/topics'

export const questions: Question[] = [
  {
    id: 1,
    question: '作用域（Scope）的定義是什麼？',
    options: [
      '變數的資料型別',
      '變數在哪裡可以被存取的規則',
      '函式執行時的 this 指向',
      '變數在記憶體中佔用的空間大小',
    ],
    answer: 1,
    explanation:
      '作用域定義了「變數在哪個範圍內可以被存取」。JavaScript 採用語彙作用域（Lexical Scope），作用域在程式碼撰寫時就決定，不是執行時動態決定。',
  },
  {
    id: 2,
    question: '以下程式碼執行後，console.log(x) 輸出什麼？\n\nfunction test() {\n  if (true) {\n    var x = 10\n  }\n  console.log(x)\n}\ntest()',
    options: [
      'ReferenceError，x 在 if 區塊外不可存取',
      '10，var 是函式作用域，整個函式內都可存取',
      'undefined，var 提升但值不提升',
      'null',
    ],
    answer: 1,
    explanation:
      'var 是函式作用域（Function Scope），不受 {} 區塊限制。宣告在 if 區塊內的 var x，在整個 test 函式內都可以存取，所以輸出 10。',
  },
  {
    id: 3,
    question: '以下程式碼執行後，console.log(y) 輸出什麼？\n\nfunction test() {\n  if (true) {\n    let y = 20\n  }\n  console.log(y)\n}\ntest()',
    options: [
      '20',
      'undefined',
      'ReferenceError，let 是區塊作用域，if 外無法存取',
      'null',
    ],
    answer: 2,
    explanation:
      'let 是區塊作用域（Block Scope），只在宣告它的 {} 內有效。y 宣告在 if 的 {} 內，出了這個區塊就不存在，所以拋出 ReferenceError。',
  },
  {
    id: 4,
    question: 'JavaScript 的語彙作用域（Lexical Scope）是什麼意思？',
    options: [
      '作用域由函式的呼叫位置決定',
      '作用域由程式碼的撰寫位置（定義位置）決定',
      '作用域由變數的型別決定',
      '作用域在執行時動態計算',
    ],
    answer: 1,
    explanation:
      '語彙作用域（又稱靜態作用域）代表作用域在程式碼撰寫時就固定了，由函式定義的位置決定，而不是由呼叫的位置決定。這讓我們可以透過閱讀程式碼就知道變數的存取範圍。',
  },
  {
    id: 5,
    question: '以下程式碼輸出什麼？\n\nconst x = \'global\'\n\nfunction outer() {\n  const x = \'outer\'\n  function inner() {\n    console.log(x)\n  }\n  inner()\n}\nouter()',
    options: [
      '"global"',
      '"outer"',
      'undefined',
      'ReferenceError',
    ],
    answer: 1,
    explanation:
      'inner 函式內沒有宣告 x，往外層（outer）的作用域查找，找到 const x = "outer"，所以輸出 "outer"。這就是作用域鏈（Scope Chain）：內層找不到就往外找，直到全域。',
  },
  {
    id: 6,
    question: '關於作用域鏈（Scope Chain），下列何者正確？',
    options: [
      '外層可以存取內層的變數',
      '內層可以存取外層的變數，外層不能存取內層的變數',
      '同層之間的函式可以互相存取彼此的變數',
      '作用域鏈只在 class 中有效',
    ],
    answer: 1,
    explanation:
      '作用域鏈是單向向外查找：內層找不到變數時會往外層找，但外層永遠看不到內層。兩個平行的函式也無法存取彼此的變數，因為它們的作用域是獨立的。',
  },
  {
    id: 7,
    question: 'console.log(a) 在 var a = 1 之前執行，輸出什麼？',
    options: [
      '1',
      'ReferenceError',
      'undefined',
      'null',
    ],
    answer: 2,
    explanation:
      'var 宣告會被 Hoisting（提升）到作用域頂端，但賦值不會。所以在 var a = 1 前存取 a，會得到 undefined 而不是 ReferenceError。這等同於 var a 被移到最上方，只是還沒賦值。',
  },
  {
    id: 8,
    question: 'console.log(b) 在 let b = 1 之前執行，輸出什麼？',
    options: [
      '1',
      'undefined',
      'ReferenceError，let 存在暫時死區（TDZ）',
      'null',
    ],
    answer: 2,
    explanation:
      'let 和 const 也會被提升，但它們進入「暫時死區（Temporal Dead Zone, TDZ）」。從作用域開始到宣告語句之間，存取這個變數會拋出 ReferenceError。這是 let/const 比 var 更安全的原因之一。',
  },
  {
    id: 9,
    question: '以下 for 迴圈使用 var，setTimeout 的回呼會輸出什麼？\n\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0)\n}',
    options: [
      '0, 1, 2',
      '3, 3, 3',
      'undefined, undefined, undefined',
      '0, 0, 0',
    ],
    answer: 1,
    explanation:
      'var 是函式作用域，迴圈的三個 setTimeout 共享同一個 i。等 setTimeout 的回呼執行時，迴圈早已跑完，i 已經是 3，所以三次都輸出 3。改用 let 可以解決這個問題，因為 let 是區塊作用域，每次迭代都有自己獨立的 i。',
  },
  {
    id: 10,
    question: '把上題的 var 改成 let，setTimeout 的回呼會輸出什麼？\n\nfor (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0)\n}',
    options: [
      '3, 3, 3',
      'undefined, undefined, undefined',
      '0, 1, 2',
      '0, 0, 0',
    ],
    answer: 2,
    explanation:
      'let 是區塊作用域，for 迴圈每次迭代都會建立一個新的 i 綁定。三個 setTimeout 的回呼各自捕獲了當次迭代的 i 值（0、1、2），所以正確輸出 0, 1, 2。這是 let 解決 var 經典陷阱的最佳範例。',
  },
  {
    id: 11,
    question: '以下程式碼輸出什麼？\n\nlet x = \'global\'\n\nfunction foo() {\n  console.log(x)\n  let x = \'local\'\n}\nfoo()',
    options: [
      '"global"',
      '"local"',
      'undefined',
      'ReferenceError，x 在 TDZ 中',
    ],
    answer: 3,
    explanation:
      '雖然外層有 let x = "global"，但 foo 函式內部也宣告了 let x，所以整個 foo 的作用域內 x 都指向內部的 x。在 let x = "local" 之前存取 x 會觸發 TDZ，拋出 ReferenceError。這個現象稱為「遮蔽（Shadowing）」加上 TDZ。',
  },
  {
    id: 12,
    question: '模組（ES Module）中宣告的頂層變數是什麼作用域？',
    options: [
      '全域作用域，其他檔案可以直接存取',
      '模組作用域，只在該模組內有效，不會污染全域',
      '函式作用域',
      '區塊作用域',
    ],
    answer: 1,
    explanation:
      'ES Module 的頂層宣告屬於模組作用域，不會掛到 window（全域）物件上。其他模組必須透過 export/import 才能存取，這是模組化的核心優點之一——避免全域變數污染。',
  },
]
