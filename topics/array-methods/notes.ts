export const notes = {
  title: 'Array 四大方法',
  sections: [
    {
      heading: '四者比較',
      content: `| 方法 | 回傳值 | 修改原陣列 | 主要用途 |
|---|---|---|---|
| forEach | undefined | 否 | 執行副作用（side effect） |
| map | 新陣列（等長） | 否 | 轉換每個元素 |
| filter | 新陣列（≤原長度） | 否 | 篩選元素 |
| reduce | 任意值 | 否 | 聚合成單一結果 |`,
    },
    {
      heading: 'forEach',
      content: `用於執行副作用，**永遠回傳 undefined**。

\`\`\`
[1, 2, 3].forEach((x, index) => {
  console.log(index, x)
})
\`\`\`

**不能 break**：想提早結束只能用 for...of 或 some/every。
**不能** return 值出去：callback 的 return 會被丟棄。`,
    },
    {
      heading: 'map',
      content: `用於轉換，回傳**與原陣列等長的新陣列**。

\`\`\`
const doubled = [1, 2, 3].map(x => x * 2)   // [2, 4, 6]

const names = users.map(u => u.name)   // 取出特定欄位
\`\`\`

callback 必須有 return，否則新陣列的元素會是 undefined。`,
    },
    {
      heading: 'filter',
      content: `回傳**只包含 callback 回傳 truthy 的元素**的新陣列。

\`\`\`
const evens = [1, 2, 3, 4].filter(x => x % 2 === 0)   // [2, 4]

const adults = users.filter(u => u.age >= 18)
\`\`\``,
    },
    {
      heading: 'reduce',
      content: `最靈活的方法，把陣列「縮減」成單一結果（數字、物件、另一個陣列都可以）。

\`\`\`
// 加總
const sum = [1, 2, 3, 4].reduce((acc, cur) => acc + cur, 0)   // 10

// 轉成物件
const byId = users.reduce((acc, user) => {
  acc[user.id] = user
  return acc
}, {})

// 用 reduce 實作 filter
const evens = [1,2,3,4].reduce((acc, x) => x % 2 === 0 ? [...acc, x] : acc, [])
\`\`\`

**省略 initialValue 的風險**：空陣列沒有 initialValue 會拋出 TypeError，建議永遠提供初始值。`,
    },
    {
      heading: '選擇指南',
      content: `- 需要轉換每個元素 → **map**
- 需要篩選元素 → **filter**
- 需要執行副作用（如 console.log、修改外部狀態）→ **forEach**
- 需要聚合成一個值（加總、分組、壓平）→ **reduce**

**鏈接效能注意**：map().filter() 會遍歷陣列兩次，資料量大時可以用一個 reduce 一次完成。`,
    },
  ],
}
