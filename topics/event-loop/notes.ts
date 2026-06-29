export const notes = {
  title: 'Event Loop',
  sections: [
    {
      heading: '核心架構',
      content: `JavaScript 是單執行緒語言，只有一個 Call Stack。非同步能力來自執行環境（瀏覽器/Node.js）提供的機制：\n\n| 元件 | 負責什麼 |\n|---|---|\n| **Call Stack** | 執行同步程式碼，後進先出 |\n| **Web API** | 處理計時器、網路請求、DOM 事件等 |\n| **Macrotask Queue** | setTimeout、setInterval、I/O 事件的回呼 |\n| **Microtask Queue** | Promise.then、queueMicrotask、async/await |\n| **Event Loop** | 監控 Stack 是否為空，決定從哪個 Queue 取任務 |`,
    },
    {
      heading: 'Event Loop 的執行順序',
      content: `1. 執行所有同步程式碼（清空 Call Stack）\n2. 清空整個 **Microtask Queue**（包括執行過程中新加入的）\n3. 執行一個 **Macrotask**\n4. 回到步驟 2，重複循環\n\n**關鍵：Microtask 永遠優先於 Macrotask。**`,
    },
    {
      heading: '執行順序範例',
      content: `\`\`\`\nconsole.log("1")                          // 同步\n\nsetTimeout(() => console.log("2"), 0)     // Macrotask\n\nPromise.resolve().then(() => console.log("3"))  // Microtask\n\nconsole.log("4")                          // 同步\n\n// 輸出順序：1, 4, 3, 2\n// 同步先跑完（1, 4）→ Microtask（3）→ Macrotask（2）\`\`\``,
    },
    {
      heading: 'async / await 與 Event Loop',
      content: `await 會暫停 async 函式，把 await 之後的程式碼放入 Microtask Queue，然後把控制權還給外部。\n\`\`\`\nasync function main() {\n  console.log("A")         // 同步\n  await Promise.resolve()\n  console.log("B")         // Microtask\n}\n\nmain()\nconsole.log("C")           // 同步\n\n// 輸出：A, C, B\`\`\``,
    },
    {
      heading: '多個 Promise 鏈的順序',
      content: `\`\`\`\nPromise.resolve()\n  .then(() => console.log("P1"))  // Microtask\n  .then(() => console.log("P2"))  // 執行完 P1 後才加入 Microtask\n\nsetTimeout(() => console.log("T"), 0)  // Macrotask\n\n// 輸出：P1, P2, T\n// P1 執行完後 P2 才進入 Queue，但在 T 之前就清完了\`\`\``,
    },
    {
      heading: '為什麼不能在主執行緒做大量運算',
      content: `大量同步運算會長時間佔用 Call Stack，Event Loop 無法處理其他任何任務，頁面完全凍結。\n\n**解法一：Web Worker**（移到另一個執行緒）\n\`\`\`\nconst worker = new Worker("heavy-task.js")\nworker.postMessage({ data })\nworker.onmessage = (e) => console.log(e.data)\`\`\`\n\n**解法二：setTimeout 分批**（把大任務切小）\n\`\`\`\nfunction processChunk(items, index) {\n  const chunk = items.slice(index, index + 100)\n  chunk.forEach(process)\n  if (index + 100 < items.length) {\n    setTimeout(() => processChunk(items, index + 100), 0)\n  }\n}\`\`\``,
    },
    {
      heading: 'Macrotask vs Microtask 速查',
      content: `| Macrotask | Microtask |\n|---|---|\n| setTimeout | Promise.then / .catch / .finally |\n| setInterval | queueMicrotask() |\n| setImmediate (Node.js) | async/await（await 後的程式碼） |\n| requestAnimationFrame | MutationObserver |\n| I/O 事件、DOM 事件 | |`,
    },
  ],
}
