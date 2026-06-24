import type { Question } from '@/lib/topics'

export const questions: Question[] = [
  {
    id: 1,
    question: 'Debounce 的核心行為是什麼？',
    options: [
      '每次觸發都立即執行函式',
      '連續觸發時重置計時器，只在最後一次觸發後的等待時間到期才執行',
      '限制函式每秒最多執行 N 次',
      '讓函式只在第一次觸發時執行',
    ],
    answer: 1,
    explanation:
      '每次觸發都會 clearTimeout 讓計時器重置，只有在停止觸發超過 wait 毫秒後，才真正執行一次。',
  },
  {
    id: 2,
    question: 'debounce 內部為什麼要用 const context = this 把 this 存起來？',
    options: [
      '因為 this 在 JavaScript 中是不可變的',
      '為了讓函式可以遞迴呼叫自己',
      '因為進入 setTimeout 後原本的呼叫脈絡會消失，this 會變成 undefined 或 window',
      '只是一種風格慣例，沒有實際作用',
    ],
    answer: 2,
    explanation:
      'setTimeout 的回呼執行時，原本的 call site 已不存在。若不事先儲存 this，在延遲後呼叫 func 時 this 就會是錯誤的值。',
  },
  {
    id: 3,
    question: 'func.apply(context, args) 與 func(...args) 在 debounce 裡最關鍵的差異是什麼？',
    options: [
      'apply 執行比較快',
      'apply 可以傳遞陣列參數，而展開運算子不行',
      'apply 會把 context 當作 func 執行時的 this，展開運算子則不會傳遞 this',
      '兩者完全相同，沒有差異',
    ],
    answer: 2,
    explanation:
      'func.apply(context, args) 第一個參數是 thisArg，強制指定 func 執行時的 this。直接用 func(...args) 則 this 會丟失，變成 undefined（strict mode）或 window。',
  },
  {
    id: 4,
    question: 'apply、call、bind 三者的主要差異為何？',
    options: [
      'apply 傳陣列立即執行；call 逐一傳參立即執行；bind 回傳新函式不立即執行',
      '三者完全相同，只是語法不同',
      'apply 只能在類別方法使用；call 只能在一般函式使用',
      'bind 會立即執行並回傳結果；apply 和 call 回傳新函式',
    ],
    answer: 0,
    explanation:
      'apply(ctx, [a,b]) 立即執行，參數用陣列傳；call(ctx, a, b) 立即執行，參數逐一傳；bind(ctx) 不立即執行，回傳一個 this 已綁定的新函式。',
  },
  {
    id: 5,
    question: 'Debounce 和 Throttle 的主要區別是什麼？',
    options: [
      'Debounce 只執行第一次，Throttle 只執行最後一次',
      'Debounce 在停止觸發後才執行（等最後一次）；Throttle 在固定間隔內最多執行一次（等第一次或定時）',
      'Debounce 是同步的，Throttle 是非同步的',
      '兩者功能完全相同',
    ],
    answer: 1,
    explanation:
      'Debounce：連續觸發只執行最後一次（用於搜尋輸入）。Throttle：固定時間內不管觸發幾次只執行一次（用於 scroll / resize）。',
  },
  {
    id: 6,
    question: '以下哪個場景最適合使用 Debounce？',
    options: [
      '監聽 scroll 事件更新進度條',
      '搜尋框輸入時即時呼叫 API',
      '每隔固定時間自動儲存草稿',
      '限制遊戲角色每秒最多移動 60 次',
    ],
    answer: 1,
    explanation:
      '搜尋框輸入時，使用者還在打字就不應該觸發 API，等停止輸入 300ms 後才發送，這正是 Debounce 的典型用途。scroll 和遊戲移動更適合 Throttle。',
  },
  {
    id: 7,
    question: 'debounce 返回的函式內，clearTimeout(timeoutId) 的作用是什麼？',
    options: [
      '清除上一次執行的結果',
      '取消上一個尚未執行的定時器，讓計時重新開始',
      '強制立即執行 func',
      '釋放記憶體',
    ],
    answer: 1,
    explanation:
      '每次觸發時先 clearTimeout 取消前一個定時器，再重新 setTimeout。這樣只要還在持續觸發，計時器就永遠被重置，func 永遠不會執行。',
  },
  {
    id: 8,
    question: 'debounceWithApply(handleSearch, 300) 執行後，args 是在哪個時間點傳入的？',
    options: [
      '呼叫 debounceWithApply(handleSearch, 300) 的當下',
      '每次 setTimeout 300ms 到期時',
      '每次呼叫 debounceWithApply 回傳的新函式時（例如 debouncedFn.call(this, e)）',
      'addEventListener 綁定事件時',
    ],
    answer: 2,
    explanation:
      'debounceWithApply 只是「設定」並回傳一個新函式。args 是在那個新函式被呼叫時（例如 debouncedFn.call(this, e)）才傳入，並暫存在閉包內，等 300ms 到期後由 func.apply(context, args) 轉交給真正的回呼。',
  },
  {
    id: 9,
    question: '以下程式碼中，handleSearchBad 內的 this 會是什麼值？（執行環境為 <script type="module">）\n\nconst debouncedBad = debounceNoApply(handleSearchBad, 300)\ninput.addEventListener("input", function(e) {\n  debouncedBad(e)\n})',
    options: [
      'input 元素',
      'window',
      'undefined',
      'Event 物件',
    ],
    answer: 2,
    explanation:
      '兩層原因：① debouncedBad(e) 是普通呼叫，沒有用 .call 傳入 this。② <script type="module"> 強制 strict mode，普通呼叫的 this 不會 fallback 到 window，直接變成 undefined。再加上 debounceNoApply 內部沒有保存與傳遞 this，所以 handleSearchBad 收到的 this 為 undefined。',
  },
  {
    id: 10,
    question: 'JavaScript 中 this 的值是在什麼時候決定的？',
    options: [
      '函式定義時決定，之後不會改變',
      '函式被呼叫時決定，取決於呼叫方式',
      '只有箭頭函式的 this 會改變，一般函式固定是 window',
      '只有在 class 內的 this 才有意義',
    ],
    answer: 1,
    explanation:
      'this 不看函式在哪裡定義，只看函式被怎麼呼叫：直接呼叫 fn() 在 strict mode 是 undefined、non-strict 是 window；透過物件呼叫 obj.fn() 是 obj；用 fn.call(target) 明確指定則是 target。箭頭函式例外——它沒有自己的 this，繼承定義時外層的 this。',
  },
  {
    id: 11,
    question: 'setTimeout 的 callback 用一般函式撰寫時，內部的 this 在 strict mode 下是什麼？',
    options: [
      '觸發事件的 DOM 元素',
      'window',
      'undefined',
      'setTimeout 本身',
    ],
    answer: 2,
    explanation:
      '進入 setTimeout 後，呼叫 callback 的是瀏覽器計時器，不是原本的 DOM 元素。strict mode 下普通呼叫的 this 不會 fallback 到 window，直接變成 undefined。',
  },
  {
    id: 12,
    question: 'debounce 裡 args 可以透過閉包帶進 setTimeout，但 this 不行，原因是？',
    options: [
      'args 是陣列，this 是物件，型別不同',
      'args 是普通變數存在閉包中，this 每次函式被呼叫時由呼叫者重新決定，不屬於閉包',
      'setTimeout 會自動清除 this 但保留其他變數',
      'this 只能在 class 內使用',
    ],
    answer: 1,
    explanation:
      'args 是宣告在函式裡的普通變數，閉包可以直接持有它的參考。this 不屬於閉包，是每次函式被呼叫時由呼叫者動態賦值的，進入 setTimeout 後呼叫者換成瀏覽器計時器，this 就跟著換掉了。',
  },
  {
    id: 13,
    question: '以下三個表達式哪個在執行時會得到 undefined？（假設在 addEventListener callback 內）',
    options: [
      'this.id',
      'event.target.id',
      'event.id',
      '以上都能正確讀到 id',
    ],
    answer: 2,
    explanation:
      'event 是 Event 物件，描述這次事件的資訊（時間、座標等），本身沒有 id 屬性。event.target 才是觸發事件的 DOM 元素，有 id。this 在 addEventListener callback 內也是那個 DOM 元素，同樣有 id。',
  },
  {
    id: 14,
    question: 'addEventListener 的 callback 內，this 自動指向什麼？',
    options: [
      'window 物件',
      'event 物件',
      '綁定該事件的 DOM 元素',
      '呼叫 addEventListener 的函式',
    ],
    answer: 2,
    explanation:
      'addEventListener 呼叫 callback 時，會自動把 this 設成綁定該事件的 DOM 元素。例如 input.addEventListener("input", fn)，fn 內的 this 就是那個 input 元素，等同於直接寫 input.id、input.value。',
  },
  {
    id: 15,
    question: 'debounce 內部 return 一個 function，這個設計模式叫做什麼？',
    options: [
      'Callback',
      'Closure（閉包）',
      'Prototype',
      'Event Delegation',
    ],
    answer: 1,
    explanation:
      '這是 Closure（閉包）。回傳的函式記住了外層 debounce 函式的變數（例如 timeoutId），即使 debounce 執行完畢，那個變數仍然活在記憶體裡供回傳的函式使用。',
  },
  {
    id: 16,
    question: 'Closure 和 Callback 最核心的差異是什麼？',
    options: [
      'Closure 只能用在箭頭函式，Callback 只能用在一般函式',
      'Closure 關注變數的記憶（活多久），Callback 關注執行的控制權（誰決定何時呼叫）',
      'Closure 是同步的，Callback 是非同步的',
      '兩者完全相同，只是說法不同',
    ],
    answer: 1,
    explanation:
      'Closure 的重點是「函式記住外層環境的變數」；Callback 的重點是「函式被當參數傳給別人，由別人決定何時執行」。debounce 裡兩者都有：return function 是 Closure（記住 timeoutId），傳給 setTimeout 的箭頭函式是 Callback。',
  },
  {
    id: 17,
    question: '以下 debounce 程式碼中，哪個部分同時體現了 Closure 和 Callback 的特性？\n\nfunction debounce(func, wait) {\n  let timeoutId = null\n  return function(...args) {\n    clearTimeout(timeoutId)\n    timeoutId = setTimeout(() => {\n      func.apply(this, args)\n    }, wait)\n  }\n}',
    options: [
      'let timeoutId = null',
      'return function(...args)：是 Closure；傳給 setTimeout 的箭頭函式：是 Callback',
      'clearTimeout(timeoutId)',
      'func.apply(this, args)',
    ],
    answer: 1,
    explanation:
      'return function 是 Closure，它記住了外層的 timeoutId，讓每次呼叫都能存取同一個計時器。傳給 setTimeout 的箭頭函式是 Callback，它被交給瀏覽器計時器，由計時器在 wait 毫秒後決定何時執行。',
  },
]
