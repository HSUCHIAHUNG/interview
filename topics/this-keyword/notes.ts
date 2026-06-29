export const notes = {
  title: 'this 的指向',
  sections: [
    {
      heading: 'this 的決定規則',
      content: `一般函式的 this 是**動態**的，由呼叫方式決定；箭頭函式的 this 是**語彙**的，由定義位置決定。\n\n| 呼叫方式 | this 的值 |\n|---|---|\n| 直接呼叫 foo() | window（非嚴格）/ undefined（嚴格） |\n| 方法呼叫 obj.foo() | obj |\n| new 呼叫 new Foo() | 新建立的物件 |\n| call/apply/bind | 第一個參數指定的物件 |\n| 箭頭函式 | 外層語彙作用域的 this |`,
    },
    {
      heading: '方法呼叫 vs 直接呼叫',
      content: `\`\`\`\nconst obj = {\n  name: "Alice",\n  greet() { return this.name }\n}\n\nobj.greet()         // "Alice"（this = obj）\n\nconst fn = obj.greet\nfn()                // undefined（this = window/undefined）\`\`\`\n\n把方法賦值給變數後，呼叫時失去了 obj 的上下文，這是最常見的 this 失蹤問題。`,
    },
    {
      heading: '箭頭函式的語彙 this',
      content: `\`\`\`\nconst obj = {\n  name: "Alice",\n\n  // ✅ 箭頭函式繼承 setTimeout 外層的 this（obj）\n  greetLater() {\n    setTimeout(() => {\n      console.log(this.name)  // "Alice"\n    }, 1000)\n  },\n\n  // ❌ 物件方法不能用箭頭函式\n  greetWrong: () => {\n    console.log(this?.name)  // undefined（this 是全域）\n  }\n}\`\`\``,
    },
    {
      heading: 'call / apply / bind',
      content: `\`\`\`\nfunction greet(greeting) {\n  return \`\${greeting}, \${this.name}\`\n}\n\nconst alice = { name: "Alice" }\nconst bob   = { name: "Bob" }\n\n// call：立即執行，參數逐個傳\ngreet.call(alice, "Hi")       // "Hi, Alice"\n\n// apply：立即執行，參數用陣列傳\ngreet.apply(bob, ["Hello"])   // "Hello, Bob"\n\n// bind：回傳新函式，稍後執行\nconst greetAlice = greet.bind(alice)\ngreetAlice("Hey")             // "Hey, Alice"\`\`\``,
    },
    {
      heading: 'class 中的 this',
      content: `\`\`\`\nclass Counter {\n  count = 0\n\n  // ❌ 一般方法作為 callback 時 this 會丟失\n  increment() {\n    this.count++\n  }\n\n  // ✅ 方法一：constructor 中 bind\n  constructor() {\n    this.increment = this.increment.bind(this)\n  }\n}\n\n// ✅ 方法二：用箭頭函式屬性（推薦）\nclass Counter {\n  count = 0\n  increment = () => { this.count++ }  // 箭頭函式，this 永遠是實例\n}\n\nconst c = new Counter()\ndocument.addEventListener("click", c.increment)  // ✅ this 正確\`\`\``,
    },
    {
      heading: 'new 呼叫時 this 的過程',
      content: `用 new 呼叫函式時，JavaScript 自動：\n1. 建立一個新的空物件 {}\n2. 將 this 指向這個新物件\n3. 設定新物件的 __proto__ 為建構函式的 prototype\n4. 執行建構函式（this.xxx 在新物件上設定屬性）\n5. 自動回傳 this（除非函式明確 return 另一個物件）\n\`\`\`\nfunction Person(name) {\n  this.name = name  // this 是新建的物件\n}\n\nconst p = new Person("Alice")\nconsole.log(p.name)  // "Alice"\`\`\``,
    },
  ],
}
