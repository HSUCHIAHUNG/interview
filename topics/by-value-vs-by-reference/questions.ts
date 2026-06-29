import type { Question } from '@/lib/topics'

export const questions: Question[] = [
  {
    id: 1,
    question: '「傳值（Pass by Value）」是什麼意思？',
    options: [
      '傳遞變數的記憶體位址',
      '傳遞值的副本，函式內修改不影響原始變數',
      '傳遞物件的參考',
      '傳遞函式本身',
    ],
    answer: 1,
    explanation:
      '傳值代表把值複製一份傳給函式。函式拿到的是副本，在函式內修改不會影響外部的原始變數。JavaScript 中所有原始型別（string、number、boolean、null、undefined、symbol）都是傳值。',
  },
  {
    id: 2,
    question: '以下程式碼執行後，外部的 num 是多少？\n\nfunction addOne(n) {\n  n = n + 1\n}\nlet num = 5\naddOne(num)\nconsole.log(num)',
    options: [
      '6',
      '5',
      'undefined',
      'NaN',
    ],
    answer: 1,
    explanation:
      'num 是 number，屬於原始型別，傳入函式時傳的是值的副本。函式內對 n 的修改不影響外部的 num，所以 num 仍然是 5。',
  },
  {
    id: 3,
    question: '以下程式碼執行後，外部的 user.age 是多少？\n\nfunction birthday(obj) {\n  obj.age = obj.age + 1\n}\nconst user = { age: 25 }\nbirthday(user)\nconsole.log(user.age)',
    options: [
      '25',
      '26',
      'undefined',
      'ReferenceError',
    ],
    answer: 1,
    explanation:
      '物件傳入函式時，傳的是「記憶體位址的副本」（call by sharing）。obj 和 user 指向同一個物件，所以透過 obj.age = ... 修改物件的屬性，外部的 user 也看得到，user.age 變成 26。',
  },
  {
    id: 4,
    question: '以下程式碼執行後，外部的 user 是什麼？\n\nfunction reset(obj) {\n  obj = { age: 0 }\n}\nconst user = { age: 25 }\nreset(user)\nconsole.log(user.age)',
    options: [
      '0',
      '25',
      'undefined',
      'null',
    ],
    answer: 1,
    explanation:
      '傳入的是位址的副本。函式內 obj = { age: 0 } 是讓 obj 這個局部變數指向一個新物件，並不改變外部 user 指向的位址。user 仍然指向原本的 { age: 25 }，所以輸出 25。',
  },
  {
    id: 5,
    question: 'JavaScript 的物件傳遞方式，最精確的描述是哪個？',
    options: [
      '純粹的傳值（Pass by Value）',
      '純粹的傳參考（Pass by Reference）',
      '傳參考的副本（Call by Sharing / Pass by Value of Reference）',
      '依物件大小動態決定',
    ],
    answer: 2,
    explanation:
      'JavaScript 傳遞物件時，複製的是「參考位址」這個值，而不是直接傳遞參考本身。所以透過參考修改物件內部屬性有效，但重新賦值（讓參考指向新物件）不會影響外部。這通常稱為 Call by Sharing 或 Pass by Value of Reference。',
  },
  {
    id: 6,
    question: '以下程式碼執行後，arr 的值是什麼？\n\nfunction addItem(array) {\n  array.push(4)\n}\nconst arr = [1, 2, 3]\naddItem(arr)\nconsole.log(arr)',
    options: [
      '[1, 2, 3]',
      '[1, 2, 3, 4]',
      '[4]',
      'undefined',
    ],
    answer: 1,
    explanation:
      '陣列是物件，傳入函式的是位址副本。array.push(4) 透過位址修改了原始陣列的內容，所以外部的 arr 也受影響，變成 [1, 2, 3, 4]。',
  },
  {
    id: 7,
    question: '要避免函式修改到外部的物件，最常見的做法是什麼？',
    options: [
      '使用 const 宣告物件',
      '傳入前先用展開運算子建立淺拷貝：foo({ ...obj })',
      '將物件轉成字串再傳入',
      '使用 Object.freeze()',
    ],
    answer: 1,
    explanation:
      '展開運算子 { ...obj } 建立一個新物件（淺拷貝），傳入函式的是新物件的位址，修改不影響原始物件。注意：這只是「淺拷貝」，巢狀物件仍然共用參考。const 只防止變數重新賦值，無法防止屬性被修改。',
  },
  {
    id: 8,
    question: '淺拷貝（Shallow Copy）和深拷貝（Deep Copy）的差異是什麼？',
    options: [
      '淺拷貝只複製第一層，巢狀的物件/陣列仍共用參考；深拷貝遞迴複製所有層',
      '淺拷貝是傳值；深拷貝是傳參考',
      '淺拷貝比深拷貝佔用更多記憶體',
      '兩者沒有差異',
    ],
    answer: 0,
    explanation:
      '淺拷貝（如 {...obj} 或 Object.assign）只複製第一層的屬性。如果屬性的值是物件或陣列，複製的是它們的參考，修改仍會影響原始資料。深拷貝（如 structuredClone() 或 JSON.parse(JSON.stringify())）遞迴複製所有層，完全獨立。',
  },
  {
    id: 9,
    question: '以下哪個是 JavaScript 內建的深拷貝方法？',
    options: [
      'Object.assign()',
      '{ ...obj }（展開運算子）',
      'structuredClone()',
      'Array.from()',
    ],
    answer: 2,
    explanation:
      'structuredClone() 是現代瀏覽器和 Node.js 18+ 內建的深拷貝 API，可以正確處理巢狀結構、Date、Map、Set 等。JSON.parse(JSON.stringify()) 也能深拷貝，但無法處理 undefined、function、Date（會變成字串）。',
  },
  {
    id: 10,
    question: '以下程式碼執行後，b.address.city 是什麼？\n\nconst a = { address: { city: "台北" } }\nconst b = { ...a }\nb.address.city = "高雄"\nconsole.log(a.address.city)',
    options: [
      '"台北"（淺拷貝，b 和 a 獨立）',
      '"高雄"（淺拷貝只複製一層，address 仍是共用參考）',
      'undefined',
      'ReferenceError',
    ],
    answer: 1,
    explanation:
      '{ ...a } 是淺拷貝，只複製第一層。b.address 和 a.address 指向同一個物件。修改 b.address.city 也就修改了 a.address.city。輸出 "高雄"。要避免這個問題需要深拷貝：const b = structuredClone(a)。',
  },
]
