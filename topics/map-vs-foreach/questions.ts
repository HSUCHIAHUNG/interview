import type { Question } from '@/lib/topics'

export const questions: Question[] = [
  {
    id: 1,
    question: 'map() 和 forEach() 最根本的差異是什麼？',
    options: [
      '兩者都回傳新陣列，只是語法不同',
      'map() 回傳新陣列；forEach() 回傳 undefined',
      'forEach() 比 map() 快，所以優先使用 forEach()',
      'map() 會修改原陣列；forEach() 不會',
    ],
    answer: 1,
    explanation:
      'map() 的核心價值就是「轉換並回傳新陣列」。forEach() 永遠回傳 undefined，設計上就是拿來執行副作用（side effect），不是用來產生新資料的。',
  },
  {
    id: 2,
    question: '以下哪個是 map() 的正確使用場景？',
    options: [
      '把每個使用者的 email 印到 console',
      '把數字陣列 [1, 2, 3] 轉換成 [2, 4, 6]',
      '對每個購物車品項發送 API 請求',
      '把陣列中的特定元素刪除',
    ],
    answer: 1,
    explanation:
      'map() 適合「一對一轉換」：把每個元素變成另一個值，組成新陣列。印 console、發 API 都是副作用，該用 forEach()；刪除元素則用 filter()。',
  },
  {
    id: 3,
    question: '下面這段程式碼有什麼問題？\n\nconst result = [1, 2, 3].map(n => {\n  console.log(n)\n})',
    options: [
      '沒有問題，result 會是 [1, 2, 3]',
      'result 會是 [undefined, undefined, undefined]，且誤用了 map()',
      '這段程式碼會拋出 TypeError',
      'console.log 在 map() 裡面不能用',
    ],
    answer: 1,
    explanation:
      '回呼函式沒有 return 任何值，所以每個元素都對應到 undefined，result 會是 [undefined, undefined, undefined]。當你只是要執行副作用（印出值）而不需要回傳值時，應該用 forEach()。',
  },
  {
    id: 4,
    question: '為什麼說「把 map() 的結果丟掉不用」是一種誤用？',
    options: [
      '因為 map() 執行後會清空原陣列',
      '因為 map() 比 forEach() 慢，浪費效能在不必要的新陣列分配上',
      '因為 map() 只能用在數字陣列',
      '因為 map() 裡不能寫副作用',
    ],
    answer: 1,
    explanation:
      'map() 每次執行都會分配一塊新的記憶體來儲存回傳陣列。如果只是要跑迴圈做事、完全不在意回傳值，這份記憶體是純粹的浪費。此時應改用 forEach()。',
  },
  {
    id: 5,
    question: '以下哪種情況應該用 forEach() 而非 map()？',
    options: [
      '把物件陣列的每個 name 屬性取出，組成字串陣列',
      '把價格陣列每個值乘以 1.05 算出含稅價',
      '遍歷 DOM 節點清單，對每個節點加上 CSS class',
      '把巢狀陣列壓平成單層陣列',
    ],
    answer: 2,
    explanation:
      '對 DOM 節點加 class 是純粹的副作用，不需要產生新陣列，forEach() 語意更清楚。其他選項都需要「把每個元素轉換成新值並收集起來」，應使用 map()。',
  },
  {
    id: 6,
    question: 'forEach() 可以用在鏈式呼叫嗎？例如 arr.forEach(...).filter(...)\n',
    options: [
      '可以，和 map() 完全一樣',
      '不行，因為 forEach() 回傳 undefined，對 undefined 呼叫 .filter() 會拋出 TypeError',
      '可以，但只能接在最後一個方法',
      '不行，但可以用 for...of 取代',
    ],
    answer: 1,
    explanation:
      'forEach() 永遠回傳 undefined。對 undefined 呼叫任何方法都會拋出 TypeError: Cannot read properties of undefined。只有 map()、filter()、reduce() 等回傳陣列的方法才能串鏈。',
  },
  {
    id: 7,
    question: '下面哪個寫法能正確把 [1, 2, 3] 轉成 [\'1\', \'2\', \'3\']？',
    options: [
      '[1, 2, 3].forEach(n => String(n))',
      'const result = [1, 2, 3].forEach(n => String(n))',
      'const result = [1, 2, 3].map(n => String(n))',
      '[1, 2, 3].map(n => { String(n) })',
    ],
    answer: 2,
    explanation:
      '選項 A、B 用 forEach() 回傳的是 undefined。選項 D 用了大括號但沒有 return，每個元素回傳 undefined。只有選項 C：map() 加上隱式回傳（箭頭函式不加大括號）才能正確產生新陣列。',
  },
  {
    id: 8,
    question: 'map() 的回呼函式可以接收哪些參數（依序）？',
    options: [
      '只有當前元素 (element)',
      '當前元素 (element)、索引 (index)',
      '當前元素 (element)、索引 (index)、原陣列 (array)',
      '當前元素 (element)、索引 (index)、原陣列 (array)、新陣列 (result)',
    ],
    answer: 2,
    explanation:
      'map(callback) 中，callback 接收三個參數：element（當前值）、index（索引，從 0 開始）、array（呼叫 map 的原始陣列）。forEach() 的回呼參數完全相同。',
  },
  {
    id: 9,
    question: '要把 [3, 1, 4, 1, 5] 中大於 3 的數字取出並乘以 2，最語意化的寫法是？',
    options: [
      '[3,1,4,1,5].map(n => n > 3 ? n * 2 : null).filter(n => n !== null)',
      '[3,1,4,1,5].forEach(n => n > 3 && console.log(n * 2))',
      '[3,1,4,1,5].filter(n => n > 3).map(n => n * 2)',
      '[3,1,4,1,5].reduce((acc, n) => { if (n > 3) acc.push(n * 2); return acc }, [])',
    ],
    answer: 2,
    explanation:
      'filter() 先過濾出符合條件的元素，map() 再做轉換，兩步驟職責分明、最易讀。選項 A 雖然能運作但引入了 null 值再清掉，過於迂迴；reduce() 可以做到但語意較不直觀。',
  },
  {
    id: 10,
    question: 'forEach() 無法被 break 中斷，下列哪個方法可以在找到第一個符合條件的元素後立即停止遍歷？',
    options: [
      'map()',
      'filter()',
      'find()',
      'reduce()',
    ],
    answer: 2,
    explanation:
      'find() 找到第一個符合條件的元素後立即停止遍歷並回傳該元素，效率更高。forEach() 和 map() 都會跑完整個陣列。如果只需要知道「有沒有」而不需要元素本身，可以用 some()。',
  },
]
