export const notes = {
  title: 'Promise 解決的問題',
  sections: [
    {
      heading: 'Callback Hell（回呼地獄）',
      content: `在 Promise 之前，非同步操作全靠 callback：

\`\`\`
getUser(id, function(user) {
  getOrders(user, function(orders) {
    getDetail(orders[0], function(detail) {
      saveResult(detail, function(result) {
        // 越來越深...
      })
    })
  })
})
\`\`\`

這種金字塔形結構（Pyramid of Doom）的問題：
- 程式碼橫向無限延伸，難以閱讀
- 每層都要單獨處理錯誤，容易遺漏
- 難以複用和測試`,
    },
    {
      heading: 'Promise 如何解決',
      content: `\`\`\`
getUser(id)
  .then(user => getOrders(user))
  .then(orders => getDetail(orders[0]))
  .then(detail => saveResult(detail))
  .catch(err => handleError(err))   // 統一錯誤處理
\`\`\`

- 巢狀結構變成**線性、由上到下**的流程
- **一個 .catch** 就能處理整條鏈的錯誤
- 更容易複用、測試各步驟`,
    },
    {
      heading: 'Promise 的三種狀態',
      content: `| 狀態 | 說明 |
|---|---|
| pending | 初始狀態，等待中 |
| fulfilled | 成功完成，有結果值 |
| rejected | 失敗，有錯誤原因 |

狀態只能從 pending 單向轉換到 fulfilled 或 rejected，一旦轉換就不可再改變。`,
    },
    {
      heading: '控制反轉問題（Inversion of Control）',
      content: `傳統 callback 把控制權交給第三方：

\`\`\`
thirdPartyLib.doSomething(myCallback)
// 你信任對方會：
// - 只呼叫 callback 一次
// - 在正確時機呼叫
// - 傳入正確的參數
\`\`\`

若第三方有 bug，你的 callback 可能被呼叫多次、不被呼叫、或傳入錯誤參數。

Promise 讓控制權回到你手中：你決定在 .then() 裡做什麼，Promise 只負責通知「完成了」。`,
    },
    {
      heading: 'async/await 進一步改善',
      content: `\`\`\`
async function loadData() {
  try {
    const user = await getUser(id)
    const orders = await getOrders(user)
    const detail = await getDetail(orders[0])
    return await saveResult(detail)
  } catch (err) {
    handleError(err)
  }
}
\`\`\`

async/await 讓非同步程式碼可以用**同步的寫法**表達：
- 可以用 if / for / while 控制流程
- 用熟悉的 try/catch 處理錯誤
- 更容易 debug（stack trace 更清楚）`,
    },
  ],
}
