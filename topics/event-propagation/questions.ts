import type { Question } from '@/lib/topics'

export const questions: Question[] = [
  {
    id: 1,
    question: 'DOM 事件傳遞有幾個階段？依序是什麼？',
    options: [
      '2 個：bubble phase、target phase',
      '3 個：capture phase（捕獲）→ target phase（目標）→ bubble phase（冒泡）',
      '3 個：bubble phase → target phase → capture phase',
      '1 個：只有 bubble phase',
    ],
    answer: 1,
    explanation:
      '事件傳遞分三個階段：(1) Capture Phase：從 window 往下到目標元素的父元素；(2) Target Phase：在目標元素上觸發；(3) Bubble Phase：從目標元素往上冒泡回 window。',
  },
  {
    id: 2,
    question: 'addEventListener 的第三個參數 useCapture 代表什麼？',
    options: [
      '是否允許被 stopPropagation 阻止',
      'true 代表在 capture phase 觸發，false（預設）代表在 bubble phase 觸發',
      'true 代表只執行一次',
      '是否阻止預設行為',
    ],
    answer: 1,
    explanation:
      'addEventListener(type, listener, useCapture)：useCapture 為 true 時，監聽器在事件往下的 capture phase 觸發；為 false（預設值）時，在往上的 bubble phase 觸發。',
  },
  {
    id: 3,
    question: '以下程式碼中，點擊 inner div 時，哪個監聽器先觸發？\n\nouter.addEventListener("click", fn1, true)   // capture\nouter.addEventListener("click", fn2, false)  // bubble\ninner.addEventListener("click", fn3, false)  // bubble',
    options: [
      'fn3 → fn2 → fn1',
      'fn1 → fn3 → fn2',
      'fn2 → fn3 → fn1',
      'fn1 → fn2 → fn3',
    ],
    answer: 1,
    explanation:
      'capture phase 先：fn1（outer capture）。target phase：fn3（inner bubble，在 target 元素上，capture 和 bubble 按照註冊順序）。bubble phase：fn2（outer bubble）。結果：fn1 → fn3 → fn2。',
  },
  {
    id: 4,
    question: '什麼情況下需要使用 capture phase 監聽？',
    options: [
      '永遠不需要，bubble 已足夠',
      '當你需要在事件到達目標元素之前就攔截它，或當目標元素使用了 stopPropagation',
      '只有在 Safari 才需要',
      '只有 focus 事件需要',
    ],
    answer: 1,
    explanation:
      '若子元素的監聽器呼叫了 stopPropagation，bubble phase 的父元素監聽器就無法收到事件。改用 capture phase 可以在事件往下傳時先攔截。此外，focus/blur 不冒泡，但可以在 capture phase 監聽。',
  },
  {
    id: 5,
    question: '在 target 元素上同時有 capture 和 bubble 監聽器，執行順序是什麼？',
    options: [
      'capture 永遠先於 bubble',
      'bubble 永遠先於 capture',
      '按照 addEventListener 的呼叫順序執行',
      '兩者同時執行',
    ],
    answer: 2,
    explanation:
      '在 target 元素上（target phase），事件並不區分 capture 和 bubble，而是按照監聽器的註冊順序執行。只有在非 target 元素上，capture 才保證先於 bubble。',
  },
  {
    id: 6,
    question: 'stopPropagation() 在 capture phase 中呼叫，效果是什麼？',
    options: [
      '沒有效果，stopPropagation 只在 bubble phase 有效',
      '阻止事件繼續往下傳遞到子元素，且 bubble phase 也不會發生',
      '只阻止 bubble，capture 繼續',
      '讓事件直接跳到 target phase',
    ],
    answer: 1,
    explanation:
      '在 capture phase 的監聽器中呼叫 stopPropagation()，事件會在那個元素上停止向下傳遞。目標元素和 bubble phase 的所有監聽器都不會執行。',
  },
  {
    id: 7,
    question: 'addEventListener 的 { passive: true } 選項有什麼作用？',
    options: [
      '讓監聽器只執行一次',
      '讓監聽器不能呼叫 stopPropagation',
      '承諾不會呼叫 preventDefault()，讓瀏覽器可以不等待監聽器就先執行滾動，提升效能',
      '讓監聽器在 Web Worker 中執行',
    ],
    answer: 2,
    explanation:
      'passive: true 告訴瀏覽器這個監聽器不會呼叫 preventDefault()，瀏覽器可以立即執行預設滾動行為而不必等待 JavaScript，大幅改善觸控設備的滾動流暢度。',
  },
  {
    id: 8,
    question: 'addEventListener 的 { once: true } 選項有什麼作用？',
    options: [
      '讓監聽器在 capture 和 bubble 都只觸發一次',
      '監聽器執行一次後自動移除，等同於執行後呼叫 removeEventListener',
      '讓事件只能被同一個元素監聽一次',
      '阻止事件冒泡超過一層',
    ],
    answer: 1,
    explanation:
      '{ once: true } 讓監聽器在第一次觸發後自動移除，等同於：function handler() { el.removeEventListener(\'click\', handler); doSomething() }。非常適合「只需要處理一次」的場景。',
  },
  {
    id: 9,
    question: '事件委派與 capture phase 搭配，最常用來解決什麼問題？',
    options: [
      '讓事件更快執行',
      '監聽 focus/blur 等不會冒泡的事件，透過 capture 在父元素上集中處理',
      '阻止第三方函式庫的事件監聽器',
      '讓事件跨 iframe 傳遞',
    ],
    answer: 1,
    explanation:
      'focus 和 blur 不會冒泡，無法用一般的事件委派。但可以用 addEventListener("focus", handler, true) 在父元素的 capture phase 統一處理，達到委派的效果。focusin/focusout 是會冒泡的替代方案。',
  },
  {
    id: 10,
    question: '以下關於事件傳遞的說法，哪個是錯的？',
    options: [
      'capture phase 從 window 開始向下傳遞',
      'bubble phase 從目標元素向上傳遞到 window',
      '所有事件都會經過三個完整的傳遞階段',
      '在 target 元素上，capture 和 bubble 監聽器的執行順序由註冊順序決定',
    ],
    answer: 2,
    explanation:
      '並非所有事件都有冒泡階段。focus、blur、scroll（元素）等事件不會冒泡（event.bubbles === false），所以不會經過 bubble phase。選項 C 說「所有事件都有三個完整階段」是錯誤的。',
  },
]
