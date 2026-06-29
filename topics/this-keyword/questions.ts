import type { Question } from '@/lib/topics'

export const questions: Question[] = [
  {
    id: 1,
    question: 'JavaScript 中 this 的值由什麼決定？',
    options: [
      '函式定義的位置',
      '函式被呼叫的方式',
      '變數的作用域',
      '檔案的名稱',
    ],
    answer: 1,
    explanation:
      '一般函式的 this 是動態決定的，由函式被呼叫的方式決定，不是定義的位置。主要規則：直接呼叫 → global/undefined、方法呼叫 → 該物件、new 呼叫 → 新物件、call/apply/bind → 指定的對象。箭頭函式例外，this 由定義位置的語彙環境決定。',
  },
  {
    id: 2,
    question: '在瀏覽器的全域環境中，直接呼叫一般函式，this 是什麼？\n\nfunction foo() { console.log(this) }\nfoo()',
    options: [
      'undefined',
      'null',
      'window 物件（非嚴格模式）或 undefined（嚴格模式）',
      '{}（空物件）',
    ],
    answer: 2,
    explanation:
      '非嚴格模式：直接呼叫函式，this 是全域物件（瀏覽器是 window，Node.js 是 global）。嚴格模式（"use strict" 或 ES Module）：this 是 undefined。這是為什麼在嚴格模式下意外使用 this 會拋出 TypeError。',
  },
  {
    id: 3,
    question: '以下程式碼 this 指向什麼？\n\nconst obj = {\n  name: "Alice",\n  greet() {\n    console.log(this.name)\n  }\n}\nobj.greet()',
    options: [
      'window',
      'undefined',
      'obj（呼叫點左側的物件）',
      '"Alice"',
    ],
    answer: 2,
    explanation:
      '以「物件.方法()」方式呼叫時，this 是該物件（呼叫點左側的物件）。所以 this 是 obj，this.name 是 "Alice"。',
  },
  {
    id: 4,
    question: '以下程式碼輸出什麼？\n\nconst obj = {\n  name: "Alice",\n  greet() { console.log(this.name) }\n}\nconst fn = obj.greet\nfn()',
    options: [
      '"Alice"',
      'undefined 或拋出 TypeError',
      'window.name',
      'ReferenceError',
    ],
    answer: 1,
    explanation:
      '將 obj.greet 賦值給 fn 後，fn 只是一個普通函式，失去了與 obj 的關聯。呼叫 fn() 是直接呼叫，this 是 window（非嚴格）或 undefined（嚴格）。window.name 通常是 ""，嚴格模式下存取 undefined.name 會拋出 TypeError。',
  },
  {
    id: 5,
    question: '箭頭函式中的 this 是什麼？',
    options: [
      '呼叫時動態決定，和一般函式相同',
      '永遠是 undefined',
      '繼承自定義時所在的外層語彙作用域',
      '永遠是 window',
    ],
    answer: 2,
    explanation:
      '箭頭函式沒有自己的 this，this 在定義時就固定為外層作用域的 this，不受呼叫方式影響。這讓箭頭函式特別適合用在 callback 中，避免 this 遺失的問題。',
  },
  {
    id: 6,
    question: 'call、apply、bind 的共同目的是什麼？',
    options: [
      '讓函式可以遞迴呼叫自己',
      '明確指定函式執行時的 this 值',
      '讓函式非同步執行',
      '讓函式只能執行一次',
    ],
    answer: 1,
    explanation:
      'call、apply、bind 都用來手動指定函式執行時的 this。差別：call(thisArg, arg1, arg2) 立即執行，參數逐個傳；apply(thisArg, [args]) 立即執行，參數用陣列傳；bind(thisArg) 回傳新函式，稍後執行。',
  },
  {
    id: 7,
    question: '以下程式碼輸出什麼？\n\nconst obj = { name: "Bob" }\nfunction greet() { return this.name }\nconsole.log(greet.call(obj))',
    options: [
      'undefined',
      '"Bob"',
      'ReferenceError',
      'window.name',
    ],
    answer: 1,
    explanation:
      'greet.call(obj) 呼叫 greet 並明確將 this 設為 obj。所以 this.name 是 obj.name，回傳 "Bob"。',
  },
  {
    id: 8,
    question: '使用 new 呼叫函式時，this 指向什麼？\n\nfunction Person(name) {\n  this.name = name\n}\nconst p = new Person("Alice")',
    options: [
      'window',
      'Person 函式本身',
      '新建立的物件（p）',
      'undefined',
    ],
    answer: 2,
    explanation:
      '用 new 呼叫函式時，JavaScript 自動建立一個新的空物件，並將 this 指向這個新物件。函式執行完後（如果沒有明確 return 物件）會自動回傳這個新物件。所以 this 就是 p。',
  },
  {
    id: 9,
    question: '以下 class 的方法作為事件 handler 傳入時，this 指向什麼？\n\nclass Counter {\n  count = 0\n  increment() { this.count++ }\n}\nconst c = new Counter()\ndocument.addEventListener("click", c.increment)',
    options: [
      'c（Counter 實例）',
      'document 元素',
      'window',
      'undefined（嚴格模式）或 window（非嚴格）',
    ],
    answer: 3,
    explanation:
      'c.increment 被賦值給 addEventListener，呼叫時脫離了 c 的上下文。class 內部預設是嚴格模式，所以 this 是 undefined，存取 this.count 會拋出 TypeError。解法：在 constructor 中 this.increment = this.increment.bind(this)，或改用箭頭函式 increment = () => { this.count++ }。',
  },
  {
    id: 10,
    question: '以下程式碼輸出什麼？\n\nconst obj = {\n  val: 42,\n  getVal: () => this.val\n}\nconsole.log(obj.getVal())',
    options: [
      '42',
      'undefined',
      'ReferenceError',
      'window.val（通常是 undefined）',
    ],
    answer: 3,
    explanation:
      '箭頭函式的 this 繼承自定義時的外層作用域。obj 的物件字面量本身不形成新的 this 上下文，所以 getVal 的 this 是外層（全域）的 this，也就是 window。window.val 是 undefined。這是物件方法不該使用箭頭函式的原因。',
  },
]
