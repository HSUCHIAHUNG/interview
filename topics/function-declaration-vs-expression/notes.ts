export const notes = {
  title: 'Function Declaration vs Expression',
  sections: [
    {
      heading: '語法比較',
      content: `\`\`\`\n// Function Declaration（宣告式）\nfunction add(a, b) {\n  return a + b\n}\n\n// Function Expression（表達式）\nconst add = function(a, b) {\n  return a + b\n}\n\n// Arrow Function（箭頭函式）\nconst add = (a, b) => a + b\`\`\``,
    },
    {
      heading: '核心差異比較表',
      content: `| | Declaration | Expression | Arrow Function |\n|---|---|---|---|\n| Hoisting | 整個函式提升 | 只有變數提升 | 只有變數提升 |\n| this | 動態（呼叫方式） | 動態（呼叫方式） | 語彙（定義位置） |\n| arguments | ✅ | ✅ | ❌ |\n| new 建構 | ✅ | ✅ | ❌ |\n| 具名 | 必須具名 | 可選 | 不能具名 |`,
    },
    {
      heading: 'Hoisting 的差異',
      content: `\`\`\`\n// ✅ Declaration 可以在宣告前呼叫\nconsole.log(add(2, 3))  // 5\nfunction add(a, b) { return a + b }\n\n// ❌ Expression 不行\nconsole.log(multiply(2, 3))  // ReferenceError（TDZ）\nconst multiply = (a, b) => a * b\`\`\``,
    },
    {
      heading: '箭頭函式的語彙 this',
      content: `箭頭函式沒有自己的 this，繼承自定義時的外層作用域，不受呼叫方式影響。\n\`\`\`\nconst obj = {\n  name: "Alice",\n\n  // ❌ 箭頭函式：this 是外層（全域），不是 obj\n  greetArrow: () => console.log(this?.name),\n\n  // ✅ 一般函式：this 由呼叫方式決定\n  greetNormal() { console.log(this.name) },\n\n  // ✅ 箭頭函式在 callback 中很好用\n  delayGreet() {\n    setTimeout(() => {\n      console.log(this.name)  // 繼承 delayGreet 的 this（obj）\n    }, 1000)\n  }\n}\n\nobj.greetNormal()  // "Alice"\nobj.greetArrow()   // undefined\nobj.delayGreet()   // "Alice"\`\`\``,
    },
    {
      heading: '箭頭函式的限制',
      content: `\`\`\`\n// ❌ 不能用 new\nconst Foo = () => {}\nnew Foo()  // TypeError: Foo is not a constructor\n\n// ❌ 沒有 arguments 物件\nconst fn = () => console.log(arguments)  // ReferenceError\n// 改用 rest 參數\nconst fn2 = (...args) => console.log(args)  // ✅\n\n// ❌ 不能當物件方法（this 指向錯誤）\nconst obj = {\n  val: 42,\n  get: () => this.val  // this 是全域，不是 obj\n}\`\`\``,
    },
    {
      heading: 'IIFE（立即執行函式）',
      content: `IIFE 是定義後立即執行的函式表達式，常用於建立獨立的作用域。\n\`\`\`\n// 傳統 IIFE\n(function() {\n  const private = "外面看不到我"\n  console.log(private)\n})()\n\n// 箭頭函式版\n(() => {\n  const private = "外面看不到我"\n})()\n\n// 現代做法：直接用 {} + let/const 或 ES Module\`\`\``,
    },
    {
      heading: '具名函式表達式的優點',
      content: `\`\`\`\n// 匿名函式：stack trace 顯示 anonymous\nconst factorial = function(n) {\n  return n <= 1 ? 1 : n * factorial(n - 1)\n}\n\n// 具名函式表達式：更好的 stack trace + 安全的遞迴\nconst factorial = function calc(n) {\n  return n <= 1 ? 1 : n * calc(n - 1)\n  // calc 只在函式內部可見，外部仍用 factorial\n}\`\`\``,
    },
  ],
}
