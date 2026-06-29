export const notes = {
  title: 'Hoisting',
  sections: [
    {
      heading: '什麼是 Hoisting',
      content: `Hoisting 是 JavaScript 引擎在**執行程式碼前**，先掃描作用域並將宣告「提升」到作用域頂端的行為。\n\n重要：只有**宣告**被提升，**賦值不提升**。`,
    },
    {
      heading: '四種宣告的提升行為',
      content: `| 宣告方式 | 提升內容 | 提升後初始值 | 宣告前存取 |\n|---|---|---|---|\n| var | 宣告 | undefined | undefined |\n| let | 宣告 | — | ReferenceError (TDZ) |\n| const | 宣告 | — | ReferenceError (TDZ) |\n| function declaration | 宣告 + 本體 | 完整函式 | 可正常呼叫 |\n| function expression | 只有變數宣告 | undefined / TDZ | TypeError / ReferenceError |`,
    },
    {
      heading: 'var Hoisting',
      content: `\`\`\`\nconsole.log(x)  // undefined（宣告提升，賦值未提升）\nvar x = 5\nconsole.log(x)  // 5\n\n// 等同於：\nvar x           // 提升到頂端，值為 undefined\nconsole.log(x)  // undefined\nx = 5\nconsole.log(x)  // 5\`\`\``,
    },
    {
      heading: 'let / const 的 TDZ（暫時死區）',
      content: `let 和 const 也會被提升，但在宣告語句前處於「暫時死區（Temporal Dead Zone）」。TDZ 期間存取變數會拋出 ReferenceError。\n\`\`\`\nconsole.log(y)  // ❌ ReferenceError: Cannot access 'y' before initialization\nlet y = 10\`\`\`\n\n這比 var 的 undefined 更安全，可以在開發時提早發現問題。`,
    },
    {
      heading: 'Function Declaration 完整提升',
      content: `function declaration 整個函式（包含本體）都被提升，可以在宣告前呼叫。\n\`\`\`\ngreet()  // ✅ 輸出 "Hello"\n\nfunction greet() {\n  console.log("Hello")\n}\`\`\``,
    },
    {
      heading: 'Function Expression 只提升變數',
      content: `\`\`\`\nconsole.log(typeof foo)  // "undefined"（var 提升但未賦值）\nfoo()                    // ❌ TypeError: foo is not a function\n\nvar foo = function() {\n  console.log("foo")\n}\n\n// 用 const 更嚴謹：\nbar()  // ❌ ReferenceError（TDZ）\nconst bar = () => {}\`\`\``,
    },
    {
      heading: '函式作用域內的 var Hoisting 遮蔽',
      content: `函式內的 var 宣告提升到**函式頂端**，即使視覺上在外層同名變數之後。\n\`\`\`\nvar name = "global"\n\nfunction test() {\n  console.log(name)  // undefined（內部 var name 被提升，遮蔽外層）\n  var name = "local"\n  console.log(name)  // "local"\n}\n\ntest()\`\`\``,
    },
    {
      heading: 'class 也有 TDZ',
      content: `\`\`\`\nconst obj = new MyClass()  // ❌ ReferenceError\n\nclass MyClass {\n  constructor() { this.x = 1 }\n}\`\`\`\n\nclass 宣告和 let/const 一樣有 TDZ，必須在宣告後才能使用。`,
    },
  ],
}
