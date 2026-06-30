import type { Question } from '@/lib/topics'

export const questions: Question[] = [
  {
    id: 1,
    question: '若要讓 [1,2,3].myMap(fn) 語法可以運作，myMap 應該定義在哪裡？',
    options: [
      '定義為全域函式',
      '定義在 Array.prototype 上',
      '定義為 Array 類別的靜態方法',
      '定義在個別陣列實例上',
    ],
    answer: 1,
    explanation:
      '要讓所有陣列實例都能使用 .myMap()，必須將它加到 Array.prototype 上。JavaScript 的方法查找會沿著 prototype chain，找到 Array.prototype.myMap 並執行。',
  },
  {
    id: 2,
    question: '以下是 myMap 的骨架，空格處的 this 代表什麼？\n\nArray.prototype.myMap = function(callback) {\n  const result = []\n  for (let i = 0; i < this.length; i++) {\n    result.push(callback(this[i], i, this))\n  }\n  return result\n}',
    options: [
      'Array 建構函式本身',
      '呼叫 myMap 的陣列實例',
      'callback 函式',
      'window 物件',
    ],
    answer: 1,
    explanation:
      '在 function 宣告（非箭頭函式）中，this 指向呼叫該方法的物件。[1,2,3].myMap(fn) 呼叫時，this 就是 [1,2,3]。這是為什麼實作 prototype 方法時必須使用 function 而非箭頭函式。',
  },
  {
    id: 3,
    question: '原生 map 的 callback 會接收哪三個參數？',
    options: [
      '(element, array)',
      '(index, element)',
      '(element, index, array)',
      '(element, key, value)',
    ],
    answer: 2,
    explanation:
      '原生 map（及 forEach、filter）的 callback 接收三個參數：當前元素（element）、當前索引（index）、以及原始陣列（array）。myMap 若要與原生行為一致，也應傳入這三個參數。',
  },
  {
    id: 4,
    question: '為什麼 myMap 的實作應該使用 function() {} 而不是箭頭函式 () => {}？',
    options: [
      '箭頭函式在 prototype 上無法運作',
      '箭頭函式沒有自己的 this，無法正確取得呼叫 myMap 的陣列',
      '箭頭函式不能有 return 值',
      '只是慣例，兩者功能相同',
    ],
    answer: 1,
    explanation:
      '箭頭函式沒有自己的 this，它繼承定義時外部作用域的 this（通常是 window 或 undefined）。若用箭頭函式定義 myMap，this 無法正確指向呼叫的陣列，會導致錯誤。',
  },
  {
    id: 5,
    question: '原生 map 的 callback 可以接收第二個參數 thisArg，用來指定 callback 執行時的 this。myMap 要支援這個功能，應該怎麼呼叫 callback？',
    options: [
      'callback(element, index, array)',
      'callback.call(thisArg, element, index, array)',
      'callback.bind(thisArg)(element, index, array)',
      'thisArg.callback(element, index, array)',
    ],
    answer: 1,
    explanation:
      '使用 callback.call(thisArg, element, index, array) 可以指定 callback 執行時的 this 為 thisArg。若 thisArg 未傳入，call 的第一個參數傳 undefined 即可，行為與原生一致。',
  },
  {
    id: 6,
    question: '以下哪個 myMap 的測試案例能驗證它與原生 map 行為一致？',
    options: [
      '[1,2,3].myMap(x => x) === [1,2,3]',
      'JSON.stringify([1,2,3].myMap(x => x * 2)) === JSON.stringify([2,4,6])',
      '[1,2,3].myMap(x => x * 2) == [2,4,6]',
      'typeof [1,2,3].myMap(x => x)',
    ],
    answer: 1,
    explanation:
      '陣列無法用 === 或 == 直接比較（比的是參考）。用 JSON.stringify 序列化後再比較字串，是驗證陣列內容是否相同的簡單方式。',
  },
  {
    id: 7,
    question: '擴充原生物件的 prototype（如 Array.prototype）有什麼風險？',
    options: [
      '沒有任何風險，這是推薦的最佳實踐',
      '可能與未來原生 API 或第三方函式庫的同名方法產生衝突，造成難以追蹤的 bug',
      '只有在嚴格模式下才有風險',
      '效能會大幅下降',
    ],
    answer: 1,
    explanation:
      '若你新增的方法名稱與未來 JS 規格新增的方法相同（如以前的 Array.prototype.flatten），可能覆蓋原生方法或被覆蓋，導致行為異常。在 library 中尤其危險。',
  },
  {
    id: 8,
    question: '以下哪個 myMap 實作在 callback 拋出錯誤時行為最正確？\n\n// A\nArray.prototype.myMap = function(callback) {\n  const result = []\n  for (let i = 0; i < this.length; i++) {\n    try {\n      result.push(callback(this[i], i, this))\n    } catch(e) { result.push(undefined) }\n  }\n  return result\n}\n\n// B\nArray.prototype.myMap = function(callback) {\n  const result = []\n  for (let i = 0; i < this.length; i++) {\n    result.push(callback(this[i], i, this))\n  }\n  return result\n}',
    options: [
      'A 較正確，因為有錯誤處理',
      'B 較正確，讓錯誤自然往上拋，與原生 map 行為一致',
      '兩者相同',
      'A 較正確，因為 undefined 比拋出錯誤安全',
    ],
    answer: 1,
    explanation:
      '原生 map 在 callback 拋出錯誤時，錯誤會直接往上傳遞，終止執行。B 的行為與原生一致。A 靜默吞掉錯誤並放入 undefined，是不正確的行為，會導致難以追蹤的 bug。',
  },
]
