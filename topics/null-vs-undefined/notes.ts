export const notes = {
  title: 'null vs undefined',
  sections: [
    {
      heading: '語意差異',
      content: `undefined 和 null 最核心的差異在於「誰負責、為什麼」：\n\n- **undefined**：JavaScript 引擎自動賦予，代表「變數存在，但尚未被賦值」\n- **null**：開發者主動設定，代表「這裡本來應該有值，但現在刻意為空」\n\n簡單記：undefined 是意外的空，null 是刻意的空。`,
    },
    {
      heading: '什麼時候出現 undefined',
      content: `- 宣告變數但未賦值：let x;（x 是 undefined）\n- 函式沒有 return，呼叫後得到 undefined\n- 存取物件不存在的屬性：obj.foo\n- 函式參數沒有傳入時`,
    },
    {
      heading: '什麼時候用 null',
      content: `- 主動清空一個值，例如登出後清除使用者：user = null\n- 表示「這裡本來應該有值，但現在沒有」\n- API 回傳中明確表示「無資料」（而非未定義）`,
    },
    {
      heading: '型別比較表',
      content: `| | undefined | null |\n|---|---|---|\n| typeof | "undefined" | "object"（歷史 bug） |\n| 數值轉換 | NaN | 0 |\n| 布林轉換 | false | false |\n| JSON.stringify | 屬性被省略 | "null" |`,
    },
    {
      heading: '相等比較陷阱',
      content: `null == undefined 的結果是 true（寬鬆相等互等）\nnull === undefined 的結果是 false（型別不同）\nnull == 0 的結果是 false（null 只和 null/undefined 寬鬆相等）\n\n規範明確規定 null == x 只有 x 是 null 或 undefined 才為 true，不走數值轉換。`,
    },
    {
      heading: 'typeof null 的歷史 bug',
      content: `typeof null 回傳 "object"，而不是 "null"。\n\n這是 JavaScript 初版留下的 bug：當時用低位元標記型別，null 的全零位元剛好被誤判為 object。這個 bug 至今無法修正，因為修正會破壞大量現有程式碼。\n\n正確判斷 null 要用嚴格相等：x === null`,
    },
    {
      heading: '空值合併運算子 ??',
      content: `?? 只對 null 和 undefined 觸發，不像 || 對所有 falsy 值都觸發：\n\nconst name = user.name ?? "匿名"\n// user.name 是 0 或 "" 時，|| 會取右側，?? 不會\n\n這讓 ?? 在處理「值存在但可能為 null/undefined」時比 || 更精確。`,
    },
  ],
}
