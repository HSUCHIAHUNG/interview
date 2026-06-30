export const notes = {
  title: 'var / let / const',
  sections: [
    {
      heading: '三者差異總覽',
      content: `| | var | let | const |
|---|---|---|---|
| 作用域 | 函式作用域 | 區塊作用域 | 區塊作用域 |
| Hoisting | 提升並初始化為 undefined | 提升但不初始化（TDZ） | 提升但不初始化（TDZ） |
| 重複宣告 | 允許 | 不允許 | 不允許 |
| 重新賦值 | 允許 | 允許 | 不允許 |
| 全域物件屬性 | 會成為 window 屬性 | 不會 | 不會 |`,
    },
    {
      heading: '作用域差異',
      content: `\`\`\`
if (true) {
  var x = 1   // 函式（全域）作用域
  let y = 2   // 區塊作用域
}
console.log(x)   // 1
console.log(y)   // ReferenceError
\`\`\`

var 的作用域只受函式邊界限制，if、for、while 的大括號對 var 沒有隔離效果。`,
    },
    {
      heading: 'Hoisting（提升）',
      content: `\`\`\`
console.log(a)   // undefined（var 提升並初始化為 undefined）
var a = 5

console.log(b)   // ReferenceError（TDZ）
let b = 5
\`\`\`

var 宣告提升到函式頂端並初始化為 undefined，所以提前存取得到 undefined 而非報錯。
let/const 也提升，但不初始化，在宣告前的區間稱為 **TDZ（Temporal Dead Zone）**，存取會拋出 ReferenceError。`,
    },
    {
      heading: 'for 迴圈中的差異',
      content: `\`\`\`
// var：所有 callback 共享同一個 i
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0)
}
// 輸出：3, 3, 3

// let：每次迭代都是獨立的 i
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0)
}
// 輸出：0, 1, 2
\`\`\``,
    },
    {
      heading: 'const 的細節',
      content: `const 限制的是**變數綁定**不可重新賦值，不是物件的內容不可修改。

\`\`\`
const obj = { a: 1 }
obj.a = 2       // ✅ 修改屬性 OK
obj = {}        // ❌ TypeError：重新賦值

const arr = [1, 2]
arr.push(3)     // ✅ 修改陣列 OK
arr = []        // ❌ TypeError

// 若要讓物件完全不可變，需用 Object.freeze()
const frozen = Object.freeze({ x: 1 })
frozen.x = 99   // 靜默失敗（嚴格模式下報錯）
\`\`\``,
    },
    {
      heading: '最佳實踐',
      content: `**預設用 const，需要重新賦值再換成 let，不使用 var。**

- const 讓讀者立刻知道「這個變數不會被重新賦值」，減少認知負擔
- let 明確標示「這個變數的值會改變」
- var 的函式作用域和 Hoisting 行為容易造成難以察覺的 bug，現代專案應避免`,
    },
  ],
}
