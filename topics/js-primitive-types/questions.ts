import type { Question } from '@/lib/topics'

export const questions: Question[] = [
  {
    id: 1,
    question: 'JavaScript 共有幾種基本型別（Primitive Types）？',
    options: [
      '5 種',
      '6 種',
      '7 種',
      '8 種',
    ],
    answer: 2,
    explanation:
      'JavaScript 有 7 種基本型別：string（字串）、number（數字）、boolean（布林）、null（空值）、undefined（未定義）、symbol（符號，ES6 新增）、bigint（大整數，ES2020 新增）。除了這 7 種基本型別之外，其餘都是物件型別（Object）。',
  },
  {
    id: 2,
    question: '以下哪個不是 JavaScript 的基本型別？',
    options: [
      'null',
      'Symbol',
      'Array',
      'BigInt',
    ],
    answer: 2,
    explanation:
      'Array（陣列）是物件型別（Object），不是基本型別。JavaScript 的 7 種基本型別是：string、number、boolean、null、undefined、symbol、bigint。陣列、物件、函式、Date 等都是物件型別。',
  },
  {
    id: 3,
    question: 'typeof null 的回傳值是什麼？',
    options: [
      '"null"',
      '"undefined"',
      '"object"',
      '"boolean"',
    ],
    answer: 2,
    explanation:
      'typeof null 回傳 "object"，這是 JavaScript 早期設計的歷史遺留錯誤（bug）。在 JavaScript 最初實作中，值的型別 tag 用二進位儲存，物件的 tag 為 000，而 null 的二進位表示也全為 0，導致被誤判為物件。這個行為已被保留以維持向後相容性。',
  },
  {
    id: 4,
    question: '如何正確判斷一個值是否為 null？',
    options: [
      'typeof value === "null"',
      'value instanceof null',
      'value === null',
      'Object.is(value, "null")',
    ],
    answer: 2,
    explanation:
      '由於 typeof null === "object"，不能用 typeof 來判斷 null。正確方式是使用嚴格相等 value === null，因為 null 只等於自身和 undefined（用 == 時），使用 === 可以精確地只匹配 null。',
  },
  {
    id: 5,
    question: '基本型別（Primitive）的值具有什麼特性？',
    options: [
      '可以動態新增屬性',
      '是不可變的（immutable），操作基本型別會回傳新值而非修改原值',
      '儲存在記憶體的 heap 中',
      '只能透過參考（reference）傳遞',
    ],
    answer: 1,
    explanation:
      '基本型別是不可變的（immutable）。例如字串 "hello".toUpperCase() 回傳新字串 "HELLO"，原字串不變。數字、布林等也是如此。基本型別儲存在 stack 中，按值傳遞（pass by value）。相反地，物件型別是可變的，儲存在 heap 中，按參考傳遞（pass by reference）。',
  },
  {
    id: 6,
    question: 'typeof undefined 和 typeof 未宣告變數的回傳值分別是什麼？',
    options: [
      '"undefined" 和 拋出 ReferenceError',
      '兩者都是 "undefined"',
      '"null" 和 "undefined"',
      '兩者都拋出 ReferenceError',
    ],
    answer: 1,
    explanation:
      'typeof 的特殊之處在於，對未宣告的變數也不會拋出錯誤，而是回傳 "undefined"。因此 typeof undefined === "undefined" 且 typeof notDeclaredVar === "undefined" 都為 true。這讓 typeof 在檢測全域變數是否存在時非常有用。',
  },
  {
    id: 7,
    question: 'Symbol 型別的主要用途是什麼？',
    options: [
      '用來儲存大型整數',
      '建立唯一且不重複的識別符，常用來作為物件的唯一 key',
      '取代 string 型別作為更高效的字串',
      '用來定義私有類別方法',
    ],
    answer: 1,
    explanation:
      'Symbol 每次呼叫都產生唯一的值（即使描述相同，Symbol("key") !== Symbol("key")）。主要用途是作為物件的唯一屬性 key，避免命名衝突，常見於設計函式庫 API 或定義「知名符號」（Well-known Symbols）如 Symbol.iterator。',
  },
  {
    id: 8,
    question: 'BigInt 和 number 型別的主要差異是什麼？',
    options: [
      'BigInt 只能儲存負數',
      'BigInt 可以精確表示任意大的整數，number 有最大安全整數限制（2^53 - 1）',
      'BigInt 支援小數點，number 不支援',
      'BigInt 和 number 沒有差異，只是語法不同',
    ],
    answer: 1,
    explanation:
      'JavaScript 的 number 型別是 64 位元浮點數，最大安全整數為 Number.MAX_SAFE_INTEGER（2^53 - 1 = 9007199254740991），超過這個範圍的整數運算可能不精確。BigInt（以 n 結尾，如 9007199254740992n）可以精確處理任意大的整數，常用於需要高精度整數的場景（如密碼學、大數運算）。',
  },
]
