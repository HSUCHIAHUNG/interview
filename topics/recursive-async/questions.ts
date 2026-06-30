import type { Question } from '@/lib/topics'

export const questions: Question[] = [
  {
    id: 1,
    question: '以下遞迴 async 函式的作用是什麼？\n\nasync function retry(fn, times) {\n  try {\n    return await fn()\n  } catch (e) {\n    if (times <= 0) throw e\n    return retry(fn, times - 1)\n  }\n}',
    options: [
      '讓函式並行執行多次',
      '在失敗時最多重試 times 次，若仍失敗則拋出最後一個錯誤',
      '限制函式執行時間',
      '緩存函式的執行結果',
    ],
    answer: 1,
    explanation:
      '這是遞迴重試模式：呼叫 fn()，若成功則回傳結果；若失敗且還有剩餘次數，遞迴呼叫 retry 並減少 times；直到 times 為 0 時拋出錯誤。',
  },
  {
    id: 2,
    question: '以下程式碼用遞迴方式逐頁抓取 API，第 3 行的 return 有什麼作用？\n\nasync function fetchAllPages(url, results = []) {\n  const data = await fetch(url).then(r => r.json())\n  results.push(...data.items)\n  if (!data.nextUrl) return results\n  return fetchAllPages(data.nextUrl, results)\n}',
    options: [
      '沒有實際作用',
      '在沒有下一頁時終止遞迴，回傳累積的結果',
      '只回傳最後一頁的資料',
      '讓函式並行執行所有頁面',
    ],
    answer: 1,
    explanation:
      '這是遞迴的終止條件。當 API 回應沒有 nextUrl 時，遞迴停止並回傳完整的 results 陣列。沒有這個終止條件，函式會無限遞迴。',
  },
  {
    id: 3,
    question: '遞迴 async/await 相比 while 迴圈有什麼主要風險？',
    options: [
      '遞迴無法處理 async 錯誤',
      '遞迴每次呼叫都會新增一個 call stack frame，層數過深可能造成 stack overflow',
      '遞迴無法使用 await',
      '遞迴比迴圈慢 10 倍以上',
    ],
    answer: 1,
    explanation:
      '每次遞迴呼叫都會在 call stack 上新增一個 frame。若遞迴層數極深（如數萬層），可能超過 JavaScript 引擎的 stack 限制而崩潰。對於深度不確定的情況，while 迴圈更安全。',
  },
  {
    id: 4,
    question: '以下兩種實作方式，哪個在遞迴深度很大時更安全？\n\n// A：遞迴\nasync function processAll(items) {\n  if (!items.length) return\n  await process(items[0])\n  return processAll(items.slice(1))\n}\n\n// B：迴圈\nasync function processAll(items) {\n  for (const item of items) {\n    await process(item)\n  }\n}',
    options: [
      'A 更安全，因為遞迴可以提早退出',
      'B 更安全，for...of 迴圈不會增加 call stack',
      '兩者完全相同',
      'A 更安全，因為 await 會自動清空 stack',
    ],
    answer: 1,
    explanation:
      'B（迴圈）更安全。for...of 搭配 await 會串行執行，但不會增加 call stack 深度。當 items 有數千個元素時，A 會遞迴數千層，有 stack overflow 的風險。',
  },
  {
    id: 5,
    question: '以下遞迴函式用來爬取樹狀結構，有什麼問題？\n\nasync function crawl(node) {\n  const result = await fetchNode(node.id)\n  const children = await Promise.all(\n    node.children.map(child => crawl(child))\n  )\n  return { ...result, children }\n}',
    options: [
      '遞迴不能搭配 Promise.all',
      '若樹很深或很寬，可能同時發出大量 HTTP 請求，造成速率限制或記憶體問題',
      'children 陣列無法正確收集結果',
      '這段程式碼語法錯誤',
    ],
    answer: 1,
    explanation:
      '以 Promise.all 遞迴展開整棵樹，會同時發出所有節點的請求，若節點數量龐大，可能觸發 API 速率限制、消耗大量記憶體。實務上需要加入並發控制。',
  },
  {
    id: 6,
    question: '在遞迴 async 函式中，正確的錯誤傳遞方式是什麼？',
    options: [
      '每層都要單獨 try/catch，不能讓錯誤往上傳',
      '不用處理，async 函式錯誤會自動消失',
      '若不 catch，rejected Promise 會透過遞迴鏈自動往上傳遞到呼叫端',
      '要在每層加 console.error 才能捕捉',
    ],
    answer: 2,
    explanation:
      '當 await 的 Promise reject 且沒有被 catch，async 函式本身會 reject，這個 rejected Promise 會繼續往上傳遞，最終由呼叫端的 .catch() 或 try/catch 捕捉。',
  },
  {
    id: 7,
    question: '以下程式碼中，await 放在 return 前有什麼差異？\n\n// A\nasync function foo() {\n  return await bar()\n}\n\n// B\nasync function foo() {\n  return bar()\n}',
    options: [
      '完全相同，沒有任何差異',
      'A 中若 bar() 拋出錯誤，try/catch 在 foo() 內可以捕捉；B 中錯誤會直接傳遞，foo() 內的 try/catch 無法捕捉',
      'B 比 A 執行快一倍',
      'B 無法正確回傳 bar() 的值',
    ],
    answer: 1,
    explanation:
      '加上 return await 讓 foo() 內的 try/catch 有機會攔截 bar() 的錯誤。若只是 return bar()，foo() 回傳 bar() 的 Promise，foo() 自己的 try/catch 在 resolve 前就已完成，無法捕捉 bar() 的錯誤。',
  },
  {
    id: 8,
    question: '以下遞迴函式用來找到符合條件的第一個項目，哪個實作正確？',
    options: [
      'async function find(items, predicate) {\n  for (const item of items) {\n    if (await predicate(item)) return item\n  }\n}',
      'async function find(items, predicate) {\n  return Promise.all(items.map(predicate))\n}',
      'async function find(items, predicate) {\n  return items.filter(predicate)\n}',
      'async function find(items) {\n  return items[0]\n}',
    ],
    answer: 0,
    explanation:
      '選項 A 正確：用 for...of 逐一 await predicate(item)，找到第一個符合的就提早 return。Promise.all 會並行執行所有項目而非找到第一個就停止；filter 不支援 async predicate。',
  },
]
