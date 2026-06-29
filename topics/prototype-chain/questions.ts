import type { Question } from '@/lib/topics'

export const questions: Question[] = [
  {
    id: 1,
    question: '什麼是原型鏈（Prototype Chain）？',
    options: [
      'CSS 選擇器的繼承機制',
      '存取物件屬性時，若找不到就往 __proto__ 指向的上層物件查找，直到 null 為止',
      '函式的呼叫鏈',
      '模組的 import 路徑',
    ],
    answer: 1,
    explanation:
      '每個 JavaScript 物件都有一個 __proto__ 屬性指向它的原型物件。存取屬性時，先在物件本身找，找不到就往 __proto__ 找，再找不到就往 __proto__.__proto__ 找，直到 null（Object.prototype.__proto__）為止。這個查找路徑就是原型鏈。',
  },
  {
    id: 2,
    question: '函式的 prototype 和物件的 __proto__ 有什麼關係？',
    options: [
      '兩者完全相同，只是不同名稱',
      'new 建立物件時，物件的 __proto__ 會被設為建構函式的 prototype',
      'prototype 是唯讀的，__proto__ 可以修改',
      '只有陣列有 __proto__',
    ],
    answer: 1,
    explanation:
      '函式（建構函式）有 prototype 屬性。用 new 建立物件時，新物件的 __proto__ 會自動指向建構函式的 prototype。所以方法定義在 Constructor.prototype 上，所有實例都能透過原型鏈共享。',
  },
  {
    id: 3,
    question: '以下程式碼，dog.toString() 來自哪裡？\n\nconst dog = { name: "旺財" }',
    options: [
      'dog 物件本身',
      'Object.prototype（所有物件的最頂層原型）',
      'Function.prototype',
      '瀏覽器自動注入',
    ],
    answer: 1,
    explanation:
      'dog 本身沒有 toString，往 __proto__（也就是 Object.prototype）查找，找到了。Object.prototype 是原型鏈的終點（再往上 __proto__ 是 null），它定義了 toString、hasOwnProperty、valueOf 等所有物件共用的方法。',
  },
  {
    id: 4,
    question: '如何確認一個屬性是物件「自己的」，而非繼承自原型鏈的？',
    options: [
      'typeof obj.prop',
      'obj.prop !== undefined',
      'obj.hasOwnProperty("prop")',
      'obj.prop === obj.__proto__.prop',
    ],
    answer: 2,
    explanation:
      'hasOwnProperty() 只在屬性是物件自身直接擁有（不是繼承的）時回傳 true。在 for...in 迴圈中常搭配使用：if (obj.hasOwnProperty(key)) 來過濾掉繼承的屬性。也可以用 Object.hasOwn(obj, "prop")（較新的 API）。',
  },
  {
    id: 5,
    question: 'class 語法和原型鏈的關係是什麼？',
    options: [
      'class 完全取代了原型鏈，是全新的繼承機制',
      'class 是原型鏈的語法糖，底層仍然使用 prototype 實現',
      'class 只能在 TypeScript 中使用',
      'class 中的方法不在 prototype 上，每個實例都有獨立的副本',
    ],
    answer: 1,
    explanation:
      'class 語法是 ES6 引入的語法糖，讓原型繼承的寫法更清晰。底層仍然使用 prototype：class 中定義的方法掛在 ClassName.prototype 上，用 extends 則設定原型鏈。透過 babel 編譯後可以看到它轉換成傳統的建構函式寫法。',
  },
  {
    id: 6,
    question: '以下程式碼，animal.speak() 能成功執行嗎？\n\nfunction Animal(name) {\n  this.name = name\n}\nAnimal.prototype.speak = function() {\n  return this.name + " 叫了"\n}\nconst animal = new Animal("狗")',
    options: [
      '不行，方法必須定義在建構函式內部',
      '可以，animal.__proto__ 指向 Animal.prototype，可以找到 speak',
      '可以，但 this.name 是 undefined',
      '不行，prototype 上的方法無法存取 this',
    ],
    answer: 1,
    explanation:
      'new Animal("狗") 建立的 animal，其 __proto__ 指向 Animal.prototype。呼叫 animal.speak() 時，先在 animal 上找不到，往 Animal.prototype 找到 speak，以 animal 作為 this 執行，所以 this.name 是 "狗"。',
  },
  {
    id: 7,
    question: '以下程式碼中，cat.__proto__ 指向什麼？\n\nclass Animal {}\nclass Cat extends Animal {}\nconst cat = new Cat()',
    options: [
      'Animal.prototype',
      'Cat.prototype',
      'Object.prototype',
      'Function.prototype',
    ],
    answer: 1,
    explanation:
      'cat 是 Cat 的實例，cat.__proto__ 指向 Cat.prototype。而 Cat.prototype.__proto__ 指向 Animal.prototype，Animal.prototype.__proto__ 指向 Object.prototype。這就是繼承鏈：cat → Cat.prototype → Animal.prototype → Object.prototype → null。',
  },
  {
    id: 8,
    question: 'Object.create(null) 建立的物件有什麼特點？',
    options: [
      '和 {} 完全一樣',
      '__proto__ 是 null，沒有繼承任何原型，沒有 toString 等方法',
      '無法新增屬性',
      '是 Object.prototype 的直接實例',
    ],
    answer: 1,
    explanation:
      'Object.create(null) 建立一個完全乾淨的物件，沒有原型（__proto__ 是 null），不繼承任何方法（如 toString、hasOwnProperty）。常用來建立純粹的 key-value 字典，避免原型鏈上的屬性干擾。',
  },
  {
    id: 9,
    question: '為什麼把方法定義在 prototype 上，而不是在建構函式裡（this.method = ...）？',
    options: [
      '定義在 prototype 的方法比較快',
      '定義在 prototype 的方法所有實例共享，節省記憶體；定義在 this 上每個實例都有獨立副本',
      'this.method 無法存取 this',
      '兩者完全一樣，只是風格差異',
    ],
    answer: 1,
    explanation:
      '在建構函式內 this.method = function(){} 會讓每個實例都有一份獨立的函式副本，浪費記憶體。定義在 prototype 上的方法由所有實例共享，只有一份。class 語法中定義的方法自動放在 prototype 上，這也是為什麼要避免用 class 的箭頭函式屬性定義頻繁建立的實例方法。',
  },
  {
    id: 10,
    question: '以下程式碼中，son.greet() 輸出什麼？\n\nclass Person {\n  constructor(name) { this.name = name }\n  greet() { return `Hi, I\'m ${this.name}` }\n}\nclass Student extends Person {\n  constructor(name, school) {\n    super(name)\n    this.school = school\n  }\n}\nconst son = new Student("Alice", "MIT")',
    options: [
      'ReferenceError，Student 沒有定義 greet',
      '"Hi, I\'m Alice"（透過原型鏈繼承 Person 的 greet）',
      '"Hi, I\'m undefined"',
      'TypeError',
    ],
    answer: 1,
    explanation:
      'son.greet() 在 son 上找不到，往 Student.prototype 找也沒有，繼續往 Person.prototype 找到 greet。執行時 this 是 son，this.name 是 "Alice"（super(name) 設定的）。輸出 "Hi, I\'m Alice"。',
  },
]
