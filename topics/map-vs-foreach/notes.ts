export const notes = {
  title: 'map() vs forEach() 使用時機',
  sections: [
    {
      heading: '核心差異',
      content: `map() 和 forEach() 最根本的差異在於回傳值：\n\n- map() 回傳一個**新陣列**（每個元素對應回呼的回傳值）\n- forEach() 永遠回傳 **undefined**\n\n這個差異決定了兩者的使用場景完全不同。`,
    },
    {
      heading: '比較表',
      content: `| | map() | forEach() |\n|---|---|---|\n| 回傳值 | 新陣列 | undefined |\n| 用途 | 轉換資料，產生新陣列 | 執行副作用（log、DOM 操作、API 呼叫） |\n| 鏈式呼叫 | 可以 .map().filter().reduce() | 不能（回傳 undefined） |\n| 原陣列 | 不修改 | 不修改（但回呼裡可以） |\n| 效能 | 稍慢（需分配新陣列記憶體） | 稍快（不產生新陣列） |`,
    },
    {
      heading: '選擇原則',
      content: `- 需要結果陣列 → 用 map()\n- 只需要跑過去做事（副作用） → 用 forEach()\n- 把 map() 的結果丟掉不用 = 誤用，該換成 forEach()\n\n把 map() 結果丟掉是一種常見誤用：map() 每次都會分配新的記憶體，如果完全不在意回傳值，這份記憶體是純粹的浪費。`,
    },
    {
      heading: '常見陷阱：忘記 return',
      content: `以下這段程式碼有問題：\n\nconst result = [1, 2, 3].map(n => {\n  console.log(n)\n})\n// result 是 [undefined, undefined, undefined]\n\n回呼函式使用大括號但沒有 return，每個元素都對應到 undefined。當只需要印出值時，應改用 forEach()。`,
    },
    {
      heading: '鏈式呼叫',
      content: `map() 支援鏈式呼叫，因為它回傳陣列：\n\n[3, 1, 4, 1, 5]\n  .filter(n => n > 3)   // 過濾\n  .map(n => n * 2)      // 轉換\n\nforEach() 永遠回傳 undefined，對 undefined 呼叫任何方法都會拋出 TypeError。`,
    },
    {
      heading: '不能 break 時用 find()',
      content: `forEach() 無法被 break 中斷，會跑完整個陣列。如果只需要找到第一個符合條件的元素，改用 find()：\n\n// forEach 無法提早停止\nconst found = arr.find(n => n > 3)  // 找到後立即停止\n\n如果只需要確認「有沒有」，用 some() 同樣可以提早停止。`,
    },
  ],
}
