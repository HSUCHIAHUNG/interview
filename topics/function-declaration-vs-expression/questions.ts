import type { Question } from '@/lib/topics'

export const questions: Question[] = [
  {
    id: 1,
    question: 'function declaration 和 function expression 最主要的差異是什麼？',
    options: [
      '兩者語法完全不同，不能互換',
      'function declaration 整個函式會被 hoisting；function expression 只有變數宣告被提升',
      'function expression 比 function declaration 執行速度快',
      'function declaration 只能在全域使用',
    ],
    answer: 1,
    explanation:
      'function declaration 在編譯階段整個函式（包含本體）都被提升，可以在宣告前呼叫。function expression 只有變數宣告被提升（var 的話是 undefined，let/const 是 TDZ），在賦值前呼叫會報錯。',
  },
  {
    id: 2,
    question: '以下哪個是 function declaration？',
    options: [
      'const foo = function() {}',
      'const foo = () => {}',
      'function foo() {}',
      'const foo = new Function()',
    ],
    answer: 2,
    explanation:
      'function declaration 的特徵：以 function 關鍵字**開頭**，後面跟著函式名稱。其他三個都是 function expression（將函式賦值給變數）。',
  },
  {
    id: 3,
    question: '箭頭函式（Arrow Function）和一般函式最關鍵的差異是什麼？',
    options: [
      '箭頭函式不能有參數',
      '箭頭函式沒有自己的 this，this 繼承自外層的語彙環境',
      '箭頭函式比一般函式執行更快',
      '箭頭函式只能有一行程式碼',
    ],
    answer: 1,
    explanation:
      '箭頭函式沒有自己的 this 綁定，this 的值繼承自定義時所在的外層作用域（語彙 this）。一般函式的 this 由呼叫方式決定（動態 this）。這讓箭頭函式在 callback 中特別好用，不需要 const self = this 或 .bind(this)。',
  },
  {
    id: 4,
    question: '以下程式碼輸出什麼？\n\nconst obj = {\n  name: "Alice",\n  greet: function() {\n    setTimeout(function() {\n      console.log(this.name)\n    }, 0)\n  }\n}\nobj.greet()',
    options: [
      '"Alice"',
      'undefined',
      'ReferenceError',
      '"" 或 undefined（取決於環境）',
    ],
    answer: 3,
    explanation:
      'setTimeout 的回呼是一般函式，this 由呼叫方式決定。在非嚴格模式下，setTimeout 回呼中的 this 是 window（瀏覽器）或 global（Node.js），不是 obj。window.name 通常是 "" 或 undefined。改用箭頭函式可解決此問題。',
  },
  {
    id: 5,
    question: '把上題的 setTimeout 回呼改成箭頭函式，輸出什麼？\n\nconst obj = {\n  name: "Alice",\n  greet: function() {\n    setTimeout(() => {\n      console.log(this.name)\n    }, 0)\n  }\n}\nobj.greet()',
    options: [
      'undefined',
      '"Alice"',
      'ReferenceError',
      'window.name 的值',
    ],
    answer: 1,
    explanation:
      '箭頭函式的 this 繼承自外層（greet 函式）的 this。greet 是以 obj.greet() 方式呼叫，所以 greet 的 this 是 obj。箭頭函式繼承了這個 this，所以 this.name 是 "Alice"。',
  },
  {
    id: 6,
    question: '箭頭函式可以用 new 來建立物件嗎？',
    options: [
      '可以，和一般函式行為相同',
      '不行，箭頭函式沒有 prototype，不能作為建構函式',
      '可以，但 this 指向不同',
      '只有具名箭頭函式可以',
    ],
    answer: 1,
    explanation:
      '箭頭函式沒有 prototype 屬性，也沒有自己的 this 和 arguments，因此不能用 new 呼叫。嘗試 new (() => {}) 會拋出 TypeError: (arrow function) is not a constructor。',
  },
  {
    id: 7,
    question: 'IIFE（立即執行函式）是什麼？下列哪個是正確的 IIFE？',
    options: [
      'function() {}()',
      '(function() {})()',
      'new function() {}',
      'function(){}',
    ],
    answer: 1,
    explanation:
      'IIFE（Immediately Invoked Function Expression）是定義後立即執行的函式表達式。必須用括號包住整個 function，讓它成為表達式而非宣告，才能在後面加 () 執行。常用於建立獨立的作用域，避免污染全域變數。',
  },
  {
    id: 8,
    question: '具名函式表達式（Named Function Expression）有什麼優點？\n\nconst factorial = function calc(n) {\n  return n <= 1 ? 1 : n * calc(n - 1)\n}',
    options: [
      '可以在函式外部用 calc 這個名稱呼叫',
      '函式名稱只在函式內部可見，可用於遞迴，且在 stack trace 中有更好的可讀性',
      '和匿名函式完全一樣，沒有實質差異',
      '讓函式可以被 hoisting',
    ],
    answer: 1,
    explanation:
      '具名函式表達式的名稱（calc）只在函式內部可見，外部只能用 factorial 呼叫。好處：1) 遞迴時可用自己的名稱，不依賴外部變數；2) 錯誤的 stack trace 會顯示函式名稱而非 anonymous，更容易偵錯。',
  },
  {
    id: 9,
    question: '以下哪個情況最適合使用 function declaration 而非 arrow function？',
    options: [
      '作為物件方法，需要正確的 this 綁定',
      '作為陣列的 map callback',
      '在 setTimeout 中的回呼',
      '需要保持外層 this 的 callback',
    ],
    answer: 0,
    explanation:
      '當函式需要動態的 this（例如作為物件方法）時，應使用一般函式（function declaration 或 function expression）。箭頭函式的 this 是固定的語彙 this，作為物件方法時 this 不會指向物件本身。',
  },
  {
    id: 10,
    question: '以下程式碼輸出什麼？\n\nconsole.log(add(2, 3))\nconsole.log(multiply(2, 3))\n\nfunction add(a, b) { return a + b }\nconst multiply = (a, b) => a * b',
    options: [
      '5, 6',
      'undefined, 6',
      '5, ReferenceError（multiply 在 TDZ 中）',
      '兩個都是 undefined',
    ],
    answer: 2,
    explanation:
      'add 是 function declaration，整個函式被提升，可以在宣告前呼叫，回傳 5。multiply 是 const 宣告的 arrow function expression，在宣告前處於 TDZ，存取時拋出 ReferenceError。',
  },
]
