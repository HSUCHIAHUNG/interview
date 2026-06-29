import type { Question } from '@/lib/topics'

export const questions: Question[] = [
  {
    id: 1,
    question: '[] === [] 的結果是什麼？',
    options: [
      'true，因為兩個陣列內容相同（都是空陣列）',
      'false，因為每個 [] 都是記憶體中不同的新物件',
      'true，因為 [] 是 falsy，兩個 falsy 值嚴格相等',
      '拋出 TypeError',
    ],
    answer: 1,
    explanation:
      '陣列是參考型別，每次 [] 都會在記憶體建立全新的物件。嚴格相等（===）比較的是記憶體位址，兩個不同位址的陣列永遠不相等，即使內容完全一樣。',
  },
  {
    id: 2,
    question: '[] == [] 的結果是什麼？',
    options: [
      'true，因為寬鬆相等會比較內容',
      'false，對參考型別 == 和 === 結果相同，都比較記憶體位址',
      'true，因為兩個都是 falsy',
      'true，因為兩個都會轉成空字串 ""',
    ],
    answer: 1,
    explanation:
      '對於兩個參考型別之間的比較，== 和 === 結果完全相同，都是比較記憶體位址，不會轉換型別。兩個不同的陣列物件位址不同，所以是 false。',
  },
  {
    id: 3,
    question: '以下哪個比較結果是 true？\n\nconst a = []\nconst b = []\nconst c = a',
    options: [
      'a === b',
      'a == b',
      'a === c',
      'b === c',
    ],
    answer: 2,
    explanation:
      'c = a 不是複製陣列，而是讓 c 和 a 指向同一個記憶體位址。所以 a === c 是 true。a 和 b 是不同的物件，無論 == 或 === 都是 false。',
  },
  {
    id: 4,
    question: '下列哪個是「值型別（Primitive）」？',
    options: [
      '陣列 []',
      '物件 {}',
      '字串 "hello"',
      '函式 function() {}',
    ],
    answer: 2,
    explanation:
      '字串是原始型別（Primitive），比較時比較值本身。陣列、物件、函式都是參考型別（Reference Type），比較時比較記憶體位址。',
  },
  {
    id: 5,
    question: '[] == false 的結果是什麼？',
    options: [
      'false，[] 是物件，不能和 boolean 比較',
      'false，[] 是 truthy，false 是 falsy',
      'true，[] 轉換過程：[] → "" → 0，false → 0，0 == 0',
      'true，因為兩者都是 falsy',
    ],
    answer: 2,
    explanation:
      '寬鬆相等遇到物件和 primitive 比較，會呼叫物件的 valueOf() 再 toString()，[] 轉成 ""，再轉成 0；false 也轉成 0，最後 0 == 0 是 true。這是 == 最危險的陷阱之一，這也是為什麼應該用 ===。',
  },
  {
    id: 6,
    question: '"hello" === "hello" 是 true 還是 false？',
    options: [
      'false，字串也是物件，比較的是記憶體位址',
      'true，字串是原始型別，比較的是值本身',
      '取決於字串長度',
      '取決於字串是否用 new String() 建立',
    ],
    answer: 1,
    explanation:
      '字串是 Primitive，比較時比較值本身，所以兩個內容相同的字串字面量 === 是 true。但用 new String("hello") 建立的是物件，new String("hello") === new String("hello") 就會是 false。',
  },
  {
    id: 7,
    question: '要比較兩個陣列內容是否相同，應該用什麼方法？',
    options: [
      'arr1 === arr2',
      'arr1 == arr2',
      'JSON.stringify(arr1) === JSON.stringify(arr2)',
      'arr1.equals(arr2)',
    ],
    answer: 2,
    explanation:
      'JavaScript 沒有內建的陣列深度比較方法，也沒有 .equals()。最常見的簡易做法是 JSON.stringify 比較序列化後的字串，但它無法處理 undefined、函式、循環參考。需要嚴謹比較時應使用 lodash 的 _.isEqual() 或自己實作遞迴比較。',
  },
  {
    id: 8,
    question: '以下程式碼中，哪個 console.log 會輸出 true？\n\nconst obj1 = { x: 1 }\nconst obj2 = { x: 1 }\nconst obj3 = obj1',
    options: [
      'console.log(obj1 === obj2)',
      'console.log(obj1 === obj3)',
      'console.log(obj1.x === obj2)',
      'console.log(obj2 === obj3)',
    ],
    answer: 1,
    explanation:
      'obj3 = obj1 是參考賦值，obj3 和 obj1 指向同一個記憶體位址，所以 obj1 === obj3 是 true。obj1 和 obj2 內容相同但是不同物件，=== 是 false。',
  },
  {
    id: 9,
    question: '為什麼 React 中使用 useState 儲存陣列，修改時要用 [...arr] 而不是直接 push？',
    options: [
      '因為 push 比較慢',
      '因為 push 會改變原陣列，React 比較的是參考位址，同一個位址不會觸發重新渲染',
      '因為 React 不支援陣列的 push 方法',
      '因為 [...arr] 會自動排序',
    ],
    answer: 1,
    explanation:
      'React 用參考比較（===）判斷狀態是否改變。直接 push 修改的是同一個陣列物件，參考位址沒變，React 認為狀態沒更新，不會重新渲染。用 [...arr, newItem] 建立新陣列，新位址讓 React 偵測到變化並觸發渲染。',
  },
  {
    id: 10,
    question: '以下程式碼輸出什麼？\n\nconsole.log(typeof [] === typeof {})',
    options: [
      'false，陣列是 "array"，物件是 "object"',
      'true，陣列和物件的 typeof 都是 "object"',
      'false，因為陣列和物件是不同型別',
      '拋出 TypeError',
    ],
    answer: 1,
    explanation:
      'typeof [] 和 typeof {} 都回傳 "object"，因此兩者嚴格相等，輸出 true。要正確判斷一個值是否為陣列，應使用 Array.isArray(value) 而不是 typeof。',
  },
]
