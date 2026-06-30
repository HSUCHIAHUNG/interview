export const notes = {
  title: '遞迴 async/await',
  sections: [
    {
      heading: '基本結構',
      content: `遞迴 async 函式與一般遞迴相同，只是在呼叫自身時加上 await。

\`\`\`
async function recursiveTask(n) {
  if (n <= 0) return   // 終止條件
  await someAsyncWork(n)
  return recursiveTask(n - 1)   // 遞迴呼叫
}
\`\`\`

關鍵：**一定要有終止條件**，否則無限遞迴會造成 stack overflow 或無限執行。`,
    },
    {
      heading: '常見使用場景',
      content: `- **重試機制**：請求失敗時自動重試 N 次
- **分頁資料**：逐頁拉取 API，直到沒有下一頁
- **樹狀結構遍歷**：爬取有子節點的資料（目錄、分類樹）
- **輪詢**：定期查詢狀態直到完成`,
    },
    {
      heading: '重試機制範例',
      content: `\`\`\`
async function retry(fn, times = 3) {
  try {
    return await fn()
  } catch (err) {
    if (times <= 0) throw err
    console.log(\`失敗，剩餘重試次數：\${times - 1}\`)
    return retry(fn, times - 1)
  }
}

// 使用
await retry(() => fetch('/api/data'), 3)
\`\`\``,
    },
    {
      heading: '分頁抓取範例',
      content: `\`\`\`
async function fetchAllPages(url, results = []) {
  const data = await fetch(url).then(r => r.json())
  results.push(...data.items)

  if (!data.nextUrl) return results   // 沒有下一頁，終止
  return fetchAllPages(data.nextUrl, results)   // 繼續下一頁
}

const allItems = await fetchAllPages('/api/items')
\`\`\``,
    },
    {
      heading: '遞迴 vs 迴圈',
      content: `| | 遞迴 | 迴圈（for/while） |
|---|---|---|
| 可讀性 | 結構清晰，貼近問題描述 | 較冗長但直觀 |
| Stack 風險 | 深度大時有 stack overflow 風險 | 無 stack 風險 |
| 適用場景 | 深度有限、結構天然遞迴（如樹） | 深度不確定、大量迭代 |

**實務建議**：當遞迴深度可能達到數百層以上，改用 while 迴圈更安全。`,
    },
    {
      heading: '錯誤傳遞',
      content: `遞迴鏈中若沒有 catch，錯誤會透過 rejected Promise 自動往上傳遞到呼叫端。

\`\`\`
async function recursiveTask(n) {
  await riskyOperation(n)   // 若拋出錯誤
  return recursiveTask(n - 1)
}

// 最外層統一處理
try {
  await recursiveTask(5)
} catch (err) {
  console.error('發生錯誤', err)
}
\`\`\``,
    },
  ],
}
