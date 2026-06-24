export const notes = {
  title: 'Debounce 防抖函式',
  sections: [
    {
      heading: '核心概念',
      content: `Debounce 的核心行為是「連續觸發時重置計時器，只在最後一次觸發後的等待時間到期才執行」。\n\n每次觸發都會 clearTimeout 讓計時器重置，只有在停止觸發超過 wait 毫秒後，才真正執行一次函式。`,
    },
    {
      heading: '使用場景',
      content: `- 搜尋框輸入：等使用者停止輸入後再發 API，避免每打一個字就請求一次\n- 視窗 resize 事件：拖曳視窗時頻繁觸發，只需在停止拖曳後重新計算版面\n- 表單即時驗證：等使用者停止輸入再驗證，減少多餘的錯誤提示閃爍`,
    },
    {
      heading: '實作關鍵：為什麼要存 this？',
      content: `debounce 內部需要用 const context = this 把 this 存起來，因為進入 setTimeout 後原本的呼叫脈絡會消失。\n\nsetTimeout 的回呼執行時，原本的 call site 已不存在。若不事先儲存 this，在延遲後呼叫 func 時 this 就會是 undefined 或 window（嚴格模式下為 undefined）。`,
    },
    {
      heading: 'apply vs 展開運算子',
      content: `func.apply(context, args) 與 func(...args) 最關鍵的差異是：\n\napply 會把 context 當作 func 執行時的 this，展開運算子則不會傳遞 this。\n\n在 debounce 實作中必須用 apply，才能確保被包裝的函式在延遲後仍能以正確的 this 執行。`,
    },
    {
      heading: 'Debounce vs Throttle 的差異',
      content: `| | Debounce | Throttle |\n|---|---|---|\n| 執行時機 | 停止觸發後才執行 | 固定時間間隔內最多執行一次 |\n| 適用場景 | 搜尋框、表單驗證 | 滾動事件、按鈕防連點 |\n| 保證執行 | 不保證（可能一直被重置） | 保證每個時間窗口至少執行一次 |`,
    },
  ],
}
