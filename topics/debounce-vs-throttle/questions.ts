import type { Question } from '@/lib/topics'

export const questions: Question[] = [
  {
    id: 1,
    question: 'Debounce（防抖）的核心概念是什麼？',
    options: [
      '限制函式在一定時間內只能執行一次，超過時間後才能再執行',
      '在事件停止觸發後等待一段時間，若期間沒有再次觸發才執行函式',
      '讓函式每隔固定時間執行一次，不管事件觸發幾次',
      '讓函式立即執行，並忽略後續的重複呼叫',
    ],
    answer: 1,
    explanation:
      'Debounce 的核心是「重置計時器」：每次事件觸發都重新計時，只有在停止觸發超過指定時間後，才真正執行函式。常見比喻：電梯門關閉前，只要有人按按鈕就重新計時，等沒人再按了才關門。',
  },
  {
    id: 2,
    question: 'Throttle（節流）的核心概念是什麼？',
    options: [
      '在事件停止觸發後等待一段時間才執行函式',
      '讓函式立即執行，並忽略後續所有呼叫',
      '保證函式在指定時間內至多執行一次，持續觸發時按固定頻率執行',
      '將多個事件合併成一個批次處理',
    ],
    answer: 2,
    explanation:
      'Throttle 保證函式在一段時間內最多只執行一次。無論事件觸發多頻繁，函式都會以固定頻率執行。常見比喻：水龍頭節流閥，不管你轉多大，流量都被限制在一定速率。',
  },
  {
    id: 3,
    question: '搜尋框輸入建議（search autocomplete）最適合使用哪種技術？',
    options: [
      'Throttle，讓 API 每隔固定時間呼叫一次',
      'Debounce，等使用者停止輸入後才發送請求',
      '不需要任何限制，每次 keydown 都發請求',
      'setTimeout 搭配 clearInterval',
    ],
    answer: 1,
    explanation:
      '搜尋建議應使用 Debounce：等使用者停止輸入（如 300ms 後）才發送 API 請求，避免每打一個字就請求一次。若使用 Throttle，使用者快速輸入時仍會頻繁發請求，效益不如 Debounce。',
  },
  {
    id: 4,
    question: '監聽 scroll 事件並即時更新進度條（progress bar）最適合使用哪種技術？',
    options: [
      'Debounce，等滾動停止後才更新',
      'Throttle，固定頻率更新確保視覺流暢',
      '不使用任何限制，每次 scroll 都更新',
      'requestAnimationFrame 搭配 debounce',
    ],
    answer: 1,
    explanation:
      'scroll 事件更新 UI 適合使用 Throttle：確保每 16ms（約 60fps）或設定的間隔內最多更新一次，讓動畫保持流暢又不過度消耗資源。若用 Debounce，滾動中進度條完全不動，只有停下來才更新，使用者體驗很差。',
  },
  {
    id: 5,
    question: 'Debounce 的實作核心是利用什麼機制？',
    options: [
      'setInterval 固定間隔執行',
      'setTimeout + clearTimeout：每次呼叫先清除舊計時器，再設新計時器',
      'Promise 的 race 方法',
      'requestAnimationFrame 的回呼機制',
    ],
    answer: 1,
    explanation:
      'Debounce 的實作核心：用閉包儲存 timer，每次函式被呼叫時先 clearTimeout(timer) 清除舊計時器，再 setTimeout 設定新計時器。這樣只有在停止呼叫超過指定時間後，最後那個 setTimeout 的 callback 才會執行。',
  },
  {
    id: 6,
    question: '以下關於 Debounce 和 Throttle 的比較，哪個敘述正確？',
    options: [
      'Debounce 一定比 Throttle 執行更多次',
      'Throttle 在高頻觸發時會完全不執行',
      'Debounce 關注「停止後執行」，Throttle 關注「固定頻率執行」',
      'Throttle 只執行第一次，後續全部忽略',
    ],
    answer: 2,
    explanation:
      'Debounce 的關注點是「最後一次觸發後的靜止期」—— 適合「結束後才需要結果」的場景（如搜尋輸入）。Throttle 的關注點是「控制執行頻率」—— 適合「需要持續反饋但要限制次數」的場景（如滾動、resize）。',
  },
  {
    id: 7,
    question: '拖曳元素（drag）時即時更新位置，最適合使用哪種技術？',
    options: [
      'Debounce，等拖曳結束才更新位置',
      'Throttle，以固定頻率更新位置確保流暢',
      '不做任何限制，每個 mousemove 都更新',
      '只在 mouseup 時更新一次',
    ],
    answer: 1,
    explanation:
      '拖曳操作需要即時且流暢的視覺反饋，Throttle 讓位置以固定頻率（如每 16ms）更新，既保持視覺流暢又避免過於頻繁的重繪。若用 Debounce，拖曳中元素位置完全不動，只有放開滑鼠停一段時間後才跳到最終位置，體驗極差。',
  },
  {
    id: 8,
    question: '「防止按鈕被重複點擊提交表單」最適合使用哪種技術？',
    options: [
      'Throttle，限制一段時間內只能提交一次',
      'Debounce，等使用者停止點擊後才提交',
      '兩者都完全不適合，應直接 disable 按鈕',
      'Throttle 或直接 disable 按鈕都可以，視需求而定',
    ],
    answer: 3,
    explanation:
      '防止重複提交可用 Throttle（保證第一次點擊立即觸發，之後的點擊在冷卻期內被忽略）或直接 disable 按鈕（最常見且最直覺的做法）。Debounce 不適合，因為它會等停止點擊後才執行，若使用者只點一次，會有不必要的延遲。',
  },
]
