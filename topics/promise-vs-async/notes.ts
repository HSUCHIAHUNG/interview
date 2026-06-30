export const notes = {
  title: 'Promise vs async/await',
  sections: [
    {
      heading: '關係',
      content: `async/await 是 Promise 的語法糖，底層完全基於 Promise。

- async function 永遠回傳一個 Promise
- await 就是在等一個 Promise resolve，等同於 .then()
- 兩者可以混用，互相搭配`,
    },
    {
      heading: '寫法對比',
      content: `\`\`\`
// Promise 鏈
function getUser() {
  return fetch('/api/user')
    .then(r => r.json())
    .then(user => user.name)
    .catch(err => console.error(err))
}

// async/await
async function getUser() {
  try {
    const r = await fetch('/api/user')
    const user = await r.json()
    return user.name
  } catch (err) {
    console.error(err)
  }
}
\`\`\`

行為完全相同，async/await 讓程式碼更接近同步的閱讀習慣。`,
    },
    {
      heading: '錯誤處理',
      content: `| | Promise | async/await |
|---|---|---|
| 寫法 | .catch(fn) | try / catch |
| 多層共用 | 鏈尾一個 .catch 搞定 | 需要包一層 try/catch |
| 可讀性 | 嵌套多時較難追蹤 | 更接近同步程式碼直覺 |`,
    },
    {
      heading: '並行執行',
      content: `\`\`\`
// 錯誤：串行，總時間 = A + B + C
async function slow() {
  const a = await fetchA()
  const b = await fetchB()
  const c = await fetchC()
}

// 正確：並行，總時間 = max(A, B, C)
async function fast() {
  const [a, b, c] = await Promise.all([fetchA(), fetchB(), fetchC()])
}
\`\`\`

當多個非同步操作彼此無依賴時，應用 Promise.all 並行執行。`,
    },
    {
      heading: 'Promise 獨有的能力',
      content: `- **Promise.all**：全部成功才繼續，任一失敗就 reject
- **Promise.race**：取最快 resolve/reject 的那個
- **Promise.allSettled**：等全部結束，不管成功或失敗
- **Promise.any**：取第一個成功的，全部失敗才 reject

async/await 可以搭配這些方法，但這些靜態方法本身是 Promise 獨有的。`,
    },
    {
      heading: 'await 的細節',
      content: `\`\`\`
// await 可以接受非 Promise 值（會包成 Promise.resolve）
const x = await 42   // x = 42

// return await 與 return 的差異
async function foo() {
  try {
    return await bar()   // foo 的 catch 可以捕捉 bar 的錯誤
  } catch (e) { ... }
}

async function foo() {
  return bar()   // bar 的錯誤直接傳出，foo 的 catch 無法捕捉
}
\`\`\``,
    },
  ],
}
