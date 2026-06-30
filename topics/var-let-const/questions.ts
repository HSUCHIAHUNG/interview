import type { Question } from '@/lib/topics'

export const questions: Question[] = [
  {
    id: 1,
    question: 'var、let、const 在作用域上最主要的差異是什麼？',
    options: [
      'var 是全域作用域，let 和 const 是函式作用域',
      'var 是函式作用域，let 和 const 是區塊作用域（block scope）',
      '三者作用域完全相同',
      'const 是全域作用域，var 和 let 是區塊作用域',
    ],
    answer: 1,
    explanation:
      'var 的作用域是最近的函式（或全域）。let 和 const 是區塊作用域，受 {} 限制，如 if、for、while 的區塊。',
  },
  {
    id: 2,
    question: '以下程式碼輸出什麼？\n\nif (true) {\n  var x = 1\n  let y = 2\n}\nconsole.log(x) // ?\nconsole.log(y) // ?',
    options: [
      '1, 2',
      '1, ReferenceError',
      'undefined, 2',
      'ReferenceError, ReferenceError',
    ],
    answer: 1,
    explanation:
      'var x 的作用域是整個函式（或全域），所以 if 區塊外仍可存取，輸出 1。let y 的作用域限於 if 區塊，外面存取會拋出 ReferenceError。',
  },
  {
    id: 3,
    question: 'Hoisting（提升）對 var 和 let/const 的影響有何不同？',
    options: [
      'var 和 let/const 都會被 hoisting 到函式頂端並初始化為 undefined',
      'var 和 let/const 都不會 hoisting',
      'var 會被 hoisting 並初始化為 undefined；let/const 也會 hoisting 但不初始化，在宣告前存取會進入 TDZ 報錯',
      '只有 const 不會 hoisting',
    ],
    answer: 2,
    explanation:
      'var 宣告提升到函式頂端並初始化為 undefined，所以宣告前存取得到 undefined。let/const 也提升，但不初始化，從區塊開始到宣告語句之間是 Temporal Dead Zone（TDZ），存取會拋 ReferenceError。',
  },
  {
    id: 4,
    question: '以下程式碼輸出什麼？\n\nconsole.log(a)\nvar a = 5',
    options: [
      '5',
      'ReferenceError',
      'undefined',
      'null',
    ],
    answer: 2,
    explanation:
      'var a 宣告被提升到函式頂端，但賦值（= 5）不提升。在 console.log 時，a 已宣告但未賦值，所以是 undefined。',
  },
  {
    id: 5,
    question: 'const 宣告的物件可以修改其屬性嗎？',
    options: [
      '不行，const 讓整個物件完全不可變',
      '可以，const 只是讓變數綁定不可重新賦值，物件內容仍可修改',
      '可以，但只能新增屬性，不能修改現有屬性',
      '不行，這會拋出 TypeError',
    ],
    answer: 1,
    explanation:
      'const 限制的是變數綁定不能被重新賦值（不能 obj = 其他值），但物件本身的屬性可以自由修改。若要讓物件完全不可變，需使用 Object.freeze()。',
  },
  {
    id: 6,
    question: 'var 在全域環境宣告時，有什麼特殊行為？',
    options: [
      '與 let/const 行為完全相同',
      '會成為 window（或 globalThis）物件的屬性',
      '會被自動 const 化，無法重新賦值',
      '只在嚴格模式下有效',
    ],
    answer: 1,
    explanation:
      '在瀏覽器的全域作用域中，var 宣告的變數會自動成為 window 物件的屬性（var x = 1 相當於 window.x = 1）。let 和 const 不會。',
  },
  {
    id: 7,
    question: '以下 for 迴圈中，let 與 var 的行為差異是什麼？\n\nfor (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0)\n}',
    options: [
      '與 var 相同，輸出 3, 3, 3',
      '因為 let 有區塊作用域，每次迭代有獨立的 i，輸出 0, 1, 2',
      '拋出錯誤，let 不能用在 for 迴圈',
      '只執行一次，輸出 0',
    ],
    answer: 1,
    explanation:
      'let 在 for 迴圈的每次迭代中都會建立一個新的 i 綁定，各自獨立，所以每個 setTimeout callback 捕捉到不同的 i，輸出 0, 1, 2。',
  },
  {
    id: 8,
    question: '以下哪種宣告方式可以重複宣告同名變數？',
    options: [
      'let',
      'const',
      'var',
      '三者皆不可',
    ],
    answer: 2,
    explanation:
      'var 允許在同一個作用域內重複宣告（第二次宣告會被忽略，但不報錯）。let 和 const 在同一作用域重複宣告會拋出 SyntaxError。',
  },
  {
    id: 9,
    question: '現代 JavaScript 開發的最佳實踐中，應該優先使用哪種宣告方式？',
    options: [
      '全部使用 var，因為相容性最好',
      '預設 const，需要重新賦值時用 let，不使用 var',
      '預設 let，不需要重新賦值時用 const',
      '全部使用 let，const 限制太多',
    ],
    answer: 1,
    explanation:
      '最佳實踐是「預設 const」：只有確定需要重新賦值時才用 let。這能讓讀者立刻知道哪些變數會改變，提升可讀性並減少意外修改。var 因為作用域問題應避免使用。',
  },
  {
    id: 10,
    question: '以下程式碼輸出什麼？\n\nlet a = 1\n{\n  console.log(a)\n  let a = 2\n}',
    options: [
      '1',
      '2',
      'undefined',
      'ReferenceError',
    ],
    answer: 3,
    explanation:
      '區塊內的 let a 宣告讓整個區塊的 a 進入 TDZ（Temporal Dead Zone）。在 let a = 2 之前存取 a 會拋出 ReferenceError，即使外層作用域有同名的 a 也無法遮蔽這個行為。',
  },
]
