export const notes = {
  title: '原型鏈 (Prototype Chain)',
  sections: [
    {
      heading: '什麼是原型鏈',
      content: `每個 JavaScript 物件都有一個 __proto__ 屬性，指向它的原型物件。存取屬性時：\n\n1. 先在物件本身找\n2. 找不到 → 往 __proto__ 找\n3. 還找不到 → 往 __proto__.__proto__ 找\n4. 直到 null 為止（Object.prototype.__proto__ === null）\n\n這條查找路徑就是**原型鏈**。`,
    },
    {
      heading: 'prototype vs __proto__',
      content: `| | prototype | __proto__ |\n|---|---|---|\n| 存在於 | 函式（建構函式）上 | 每個物件上 |\n| 用途 | 定義實例共享的方法 | 指向上層原型，形成原型鏈 |\n| 關係 | new 建立物件時，物件的 __proto__ = 建構函式.prototype ||\n\n\`\`\`\nfunction Animal(name) { this.name = name }\nAnimal.prototype.speak = function() { return this.name + " 叫" }\n\nconst dog = new Animal("旺財")\nconsole.log(dog.__proto__ === Animal.prototype)  // true\`\`\``,
    },
    {
      heading: '原型鏈查找示意',
      content: `\`\`\`\nconst dog = { name: "旺財" }\n\n// dog 本身沒有 toString\n// dog.__proto__ = Object.prototype\n// Object.prototype 有 toString ✅\nconsole.log(dog.toString())  // "[object Object]"\n\n// 查找路徑：\n// dog → Object.prototype → null\`\`\``,
    },
    {
      heading: 'class 與原型鏈',
      content: `class 是語法糖，底層仍然使用 prototype。\n\`\`\`\nclass Animal {\n  constructor(name) { this.name = name }\n  speak() { return this.name + " 叫" }\n}\n\nclass Dog extends Animal {\n  fetch() { return this.name + " 撿球" }\n}\n\nconst d = new Dog("旺財")\n\n// 原型鏈：\n// d → Dog.prototype → Animal.prototype → Object.prototype → null\n\nconsole.log(d.speak())   // "旺財 叫"（繼承自 Animal.prototype）\nconsole.log(d.fetch())   // "旺財 撿球"（Dog.prototype）\nconsole.log(d.toString()) // "[object Object]"（Object.prototype）\`\`\``,
    },
    {
      heading: 'hasOwnProperty 與 for...in',
      content: `\`\`\`\nconst obj = { a: 1 }\n// toString 是繼承自 Object.prototype，不是自己的屬性\n\nobj.hasOwnProperty("a")         // true\nobj.hasOwnProperty("toString")  // false\n\n// for...in 會遍歷原型鏈上的可列舉屬性\nfor (const key in obj) {\n  if (obj.hasOwnProperty(key)) {\n    // 只處理自己的屬性\n  }\n}\n\n// 更現代的做法：\nObject.keys(obj)    // 只回傳自身可列舉屬性\nObject.hasOwn(obj, "a")  // ES2022+\`\`\``,
    },
    {
      heading: 'Object.create() 控制原型',
      content: `\`\`\`\n// 指定原型\nconst animal = { speak() { return "..." } }\nconst dog = Object.create(animal)\ndog.name = "旺財"\nconsole.log(dog.speak())  // "..."（繼承自 animal）\n\n// 純粹字典，沒有任何繼承\nconst dict = Object.create(null)\ndict.key = "value"\n// dict 沒有 toString、hasOwnProperty 等方法\`\`\``,
    },
    {
      heading: 'prototype 方法 vs 實例方法（記憶體）',
      content: `\`\`\`\n// ❌ 每個實例都有獨立的 greet 副本，浪費記憶體\nfunction Person(name) {\n  this.name = name\n  this.greet = function() { return "Hi, " + this.name }\n}\n\n// ✅ 所有實例共享 prototype 上的 greet，只有一份\nfunction Person(name) {\n  this.name = name\n}\nPerson.prototype.greet = function() { return "Hi, " + this.name }\n\n// class 語法中，方法自動定義在 prototype 上\nclass Person {\n  constructor(name) { this.name = name }\n  greet() { return "Hi, " + this.name }  // → Person.prototype.greet\n}\`\`\``,
    },
  ],
}
