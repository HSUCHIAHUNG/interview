export const notes = {
  title: '非同步輸出順序',
  sections: [
    {
      heading: 'Event Loop 基礎',
      content: `JavaScript 是單執行緒的，靠 Event Loop 處理非同步。

執行優先順序：
1. **Call Stack**（同步程式碼）— 最先執行
2. **Microtask Queue**（Promise .then、queueMicrotask）— call stack 清空後立即執行，全部清完才進下一步
3. **Macrotask Queue**（setTimeout、setInterval、I/O）— microtask 清空後才取一個執行`,
    },
    {
      heading: 'Microtask vs Macrotask',
      content: `| 類型 | 常見 API |
|---|---|
| Microtask | Promise .then()、.catch()、.finally()、queueMicrotask()、MutationObserver |
| Macrotask | setTimeout、setInterval、setImmediate、I/O、UI rendering |

關鍵規則：每執行完一個 macrotask，就會把 microtask queue 完全清空，才執行下一個 macrotask。`,
    },
    {
      heading: '基礎範例',
      content: `\`\`\`
console.log('A')
setTimeout(() => console.log('B'), 0)
Promise.resolve().then(() => console.log('C'))
console.log('D')
// 輸出：A → D → C → B
\`\`\`

步驟：
1. A（同步）
2. setTimeout 排入 macrotask queue
3. Promise.then 排入 microtask queue
4. D（同步）
5. call stack 空了 → 清 microtask → C
6. 取下一個 macrotask → B`,
    },
    {
      heading: 'Promise 鏈的交錯執行',
      content: `\`\`\`
Promise.resolve().then(() => console.log('1')).then(() => console.log('2'))
Promise.resolve().then(() => console.log('3')).then(() => console.log('4'))
// 輸出：1 → 3 → 2 → 4
\`\`\`

兩個 Promise chain 交替排入 microtask queue，不是先跑完一整條再跑另一條。`,
    },
    {
      heading: 'async/await 的執行時機',
      content: `\`\`\`
async function foo() {
  console.log('B')   // 同步執行
  await Promise.resolve()
  console.log('D')   // microtask 執行
}
console.log('A')
foo()
console.log('C')
// 輸出：A → B → C → D
\`\`\`

await 之後的程式碼等同放進 Promise.then()，會在當前同步程式碼（call stack）都執行完後才繼續。`,
    },
  ],
}
