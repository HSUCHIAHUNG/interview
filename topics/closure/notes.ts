export const notes = {
  title: '閉包 Closure',
  sections: [
    {
      heading: '什麼是閉包？',
      content: `閉包是「一個函式能夠記住並存取其定義時所在的詞法作用域，即使該函式在作用域外執行」。

簡單說：內部函式保有對外部函式變數的參考，即使外部函式已經執行完畢。

\`\`\`
function outer() {
  const msg = 'hello'
  return function inner() {
    console.log(msg) // 仍可存取 msg
  }
}
const fn = outer()
fn() // 'hello'
\`\`\``,
    },
    {
      heading: '閉包的常見用途',
      content: `- **資料封裝**：把私有狀態藏在函式作用域內，只暴露公開 API（模組模式）
- **計數器 / 累加器**：讓狀態在多次呼叫間持久存在
- **Curry 化**：把多參數函式拆成一連串單一參數函式
- **Memoization**：用閉包保存快取物件，避免重複計算
- **事件處理**：在監聽器中捕捉迴圈的當次 index 值`,
    },
    {
      heading: '計數器範例',
      content: `\`\`\`
function makeCounter() {
  let count = 0
  return {
    increment() { count++ },
    decrement() { count-- },
    value() { return count },
  }
}
const c = makeCounter()
c.increment()
c.increment()
console.log(c.value()) // 2
\`\`\`

count 被封裝在閉包內，外部無法直接讀寫，只能透過暴露的方法操作。`,
    },
    {
      heading: '經典陷阱：var + 迴圈',
      content: `\`\`\`
// 錯誤：三個 callback 共享同一個 i
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0)
}
// 輸出：3, 3, 3

// 修法一：改用 let（各自獨立的 i）
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0)
}
// 輸出：0, 1, 2

// 修法二：用 IIFE 建立新作用域
for (var i = 0; i < 3; i++) {
  ;(function(j) {
    setTimeout(() => console.log(j), 0)
  })(i)
}
// 輸出：0, 1, 2
\`\`\``,
    },
    {
      heading: '記憶體注意事項',
      content: `閉包讓外部變數的生命週期延長，只要閉包存在，被捕捉的變數就無法被 GC 回收。

**容易造成記憶體洩漏的情境：**
- 把閉包存在全域變數
- 在 DOM 元素上綁定事件監聽器，且監聽器透過閉包持有大型資料結構
- Timer（setInterval）的 callback 捕捉到大物件，且 Timer 未被清除`,
    },
  ],
}
