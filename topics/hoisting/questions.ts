import type { Question } from '@/lib/topics'

export const questions: Question[] = [
  {
    id: 1,
    question: 'Hoisting 是什麼？',
    options: [
      '將函式放到另一個函式內部的技術',
      'JavaScript 引擎在執行前將宣告移到作用域頂端的行為',
      '變數被垃圾回收的機制',
      '非同步程式碼的執行順序',
    ],
    answer: 1,
    explanation:
      'Hoisting 是 JavaScript 引擎在執行程式碼前，先掃描作用域並將 var 宣告和 function 宣告「提升」到作用域頂端的行為。注意：只有宣告被提升，賦值不會。',
  },
  {
    id: 2,
    question: '以下程式碼輸出什麼？\n\nconsole.log(x)\nvar x = 5',
    options: [
      '5',
      'ReferenceError',
      'undefined',
      'null',
    ],
    answer: 2,
    explanation:
      'var x 的宣告被提升到頂端，但賦值 = 5 不會提升。等同於先執行 var x（此時 x 是 undefined），然後 console.log(x) 輸出 undefined，最後才賦值 x = 5。',
  },
  {
    id: 3,
    question: '以下程式碼輸出什麼？\n\nconsole.log(y)\nlet y = 5',
    options: [
      '5',
      'undefined',
      'ReferenceError，let 存在暫時死區（TDZ）',
      'null',
    ],
    answer: 2,
    explanation:
      'let 宣告雖然也會被提升，但在宣告語句前它處於「暫時死區（Temporal Dead Zone, TDZ）」。在 TDZ 期間存取變數會拋出 ReferenceError，而非回傳 undefined。',
  },
  {
    id: 4,
    question: '以下程式碼能正常執行嗎？\n\ngreet()\nfunction greet() {\n  console.log("Hello")\n}',
    options: [
      '不行，函式必須在呼叫前定義',
      '可以，function declaration 整個（包含函式本體）都會被提升',
      '可以，但輸出 undefined',
      '不行，拋出 ReferenceError',
    ],
    answer: 1,
    explanation:
      'function declaration（函式宣告式）整個函式，包含函式本體，都會被提升到作用域頂端。所以可以在宣告前呼叫。這與 var 只提升宣告不同。',
  },
  {
    id: 5,
    question: '以下程式碼輸出什麼？\n\nconsole.log(typeof foo)\nvar foo = function() {}',
    options: [
      '"function"',
      '"undefined"',
      'ReferenceError',
      '"object"',
    ],
    answer: 1,
    explanation:
      'var foo 宣告被提升，但賦值不提升。提升後 foo 的值是 undefined，typeof undefined 是 "undefined"。注意這裡是 function expression（函式表達式），不是 function declaration，所以不會把函式本體一起提升。',
  },
  {
    id: 6,
    question: '以下程式碼輸出什麼？\n\nvar x = 1\nfunction foo() {\n  console.log(x)\n  var x = 2\n}\nfoo()',
    options: [
      '1',
      '2',
      'undefined',
      'ReferenceError',
    ],
    answer: 2,
    explanation:
      'foo 函式內部的 var x 宣告被提升到 foo 頂端，遮蔽了外層的 x。等同於 foo 開頭有 var x，此時 x 是 undefined，所以 console.log 輸出 undefined。這稱為「區域變數的 hoisting 遮蔽」。',
  },
  {
    id: 7,
    question: '以下程式碼輸出什麼順序？\n\nfoo()\nbar()\n\nfunction foo() { console.log("foo") }\nvar bar = function() { console.log("bar") }',
    options: [
      '"foo" 然後 "bar"',
      '"bar" 然後 "foo"',
      '"foo" 然後 TypeError: bar is not a function',
      '兩個都拋出 ReferenceError',
    ],
    answer: 2,
    explanation:
      'foo 是 function declaration，整個函式被提升，可以正常執行。bar 是 var 宣告的 function expression，var bar 被提升但值是 undefined，呼叫 undefined() 會拋出 TypeError: bar is not a function。',
  },
  {
    id: 8,
    question: '以下關於 TDZ（暫時死區）的描述，何者正確？',
    options: [
      'TDZ 只有 const 有，let 沒有',
      'let 和 const 宣告的變數在進入作用域到宣告語句之間都處於 TDZ',
      'TDZ 中的變數值為 undefined',
      'TDZ 是 var 的特有行為',
    ],
    answer: 1,
    explanation:
      'let 和 const 都有 TDZ。從作用域（如函式或區塊）開始，一直到宣告語句為止，這段期間就是 TDZ。在 TDZ 中存取變數會拋出 ReferenceError，而不是回傳 undefined。',
  },
  {
    id: 9,
    question: 'class 宣告是否也有 Hoisting？',
    options: [
      '沒有，class 不受 hoisting 影響',
      '有，和 function declaration 一樣，宣告前就可以使用',
      '有，但和 let/const 一樣有 TDZ，宣告前存取會拋出 ReferenceError',
      '有，宣告前存取會得到 undefined',
    ],
    answer: 2,
    explanation:
      'class 宣告會被提升，但和 let/const 一樣存在 TDZ。在 class 宣告前嘗試使用該 class 會拋出 ReferenceError。這是為了避免在類別定義完成前就被使用。',
  },
  {
    id: 10,
    question: '以下程式碼輸出什麼？\n\nconst result = double(4)\nconsole.log(result)\n\nfunction double(n) { return n * 2 }',
    options: [
      'TypeError: double is not a function',
      'ReferenceError',
      '8',
      'undefined',
    ],
    answer: 2,
    explanation:
      'function declaration 的整個函式（包含本體）都會被提升，所以在宣告前呼叫 double(4) 完全合法，回傳 8。如果 double 是 const double = ... 的 function expression，就會因為 TDZ 而拋出 ReferenceError。',
  },
]
