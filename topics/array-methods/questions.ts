import type { Question } from '@/lib/topics'

export const questions: Question[] = [
  {
    id: 1,
    question: 'forEach 和 map 最根本的差異是什麼？',
    options: [
      'forEach 只能處理字串，map 只能處理數字',
      'forEach 不回傳值（undefined），map 回傳新陣列',
      'forEach 會修改原陣列，map 不會',
      'map 比 forEach 執行速度快',
    ],
    answer: 1,
    explanation:
      'forEach 用於執行副作用（side effect），永遠回傳 undefined。map 用於轉換資料，回傳一個與原陣列等長的新陣列。兩者都不修改原陣列。',
  },
  {
    id: 2,
    question: '以下程式碼中，result 的值是什麼？\n\nconst result = [1, 2, 3].forEach(x => x * 2)',
    options: [
      '[2, 4, 6]',
      '[1, 2, 3]',
      'undefined',
      '6',
    ],
    answer: 2,
    explanation:
      'forEach 永遠回傳 undefined，不管 callback 回傳什麼值都被丟棄。若要轉換陣列，應使用 map。',
  },
  {
    id: 3,
    question: 'filter 的回傳值是什麼？',
    options: [
      'true 或 false',
      '符合條件的元素個數',
      '只包含 callback 回傳 truthy 值的元素的新陣列',
      '修改後的原陣列',
    ],
    answer: 2,
    explanation:
      'filter 建立並回傳一個新陣列，只包含 callback 回傳 truthy 值的元素。原陣列不被修改。',
  },
  {
    id: 4,
    question: 'reduce 的第二個參數（initialValue）有什麼作用？',
    options: [
      '設定最大迭代次數',
      '決定從哪個 index 開始',
      '設定累積器（accumulator）的初始值，省略時使用陣列第一個元素',
      '沒有作用，只是為了相容舊版本',
    ],
    answer: 2,
    explanation:
      '若提供 initialValue，accumulator 從該值開始，從 index 0 遍歷。若省略，accumulator 為陣列第一個元素，從 index 1 開始。對空陣列省略 initialValue 會拋出 TypeError。',
  },
  {
    id: 5,
    question: '以下程式碼的結果是什麼？\n\nconst sum = [1, 2, 3, 4].reduce((acc, cur) => acc + cur, 0)',
    options: [
      '0',
      '10',
      '[1, 2, 3, 4]',
      'NaN',
    ],
    answer: 1,
    explanation:
      'reduce 累加：0+1=1, 1+2=3, 3+3=6, 6+4=10。initialValue 為 0，最終回傳 10。',
  },
  {
    id: 6,
    question: 'forEach 中可以使用 break 提早結束迴圈嗎？',
    options: [
      '可以，和 for 迴圈一樣',
      '不行，在 forEach 的 callback 中使用 break 會拋出 SyntaxError',
      '可以，但要配合 return',
      '不行，可以用 return 跳過當次迭代，但無法提早結束整個迭代',
    ],
    answer: 1,
    explanation:
      'forEach 內部使用 callback，break 只能用在實際的迴圈（for/while）中，在 callback 內使用會拋出 SyntaxError。若需要提早退出，應改用 for...of 或 some/every。',
  },
  {
    id: 7,
    question: '應該用 map 還是 forEach 來建立一個數字加倍的新陣列？\n\nconst nums = [1, 2, 3]',
    options: [
      'forEach，因為它比較快',
      'map，因為它設計用來轉換陣列並回傳新陣列',
      '兩者都可以，效果完全相同',
      'filter，因為它能過濾出加倍的值',
    ],
    answer: 1,
    explanation:
      '需要建立新陣列時，應使用 map。用 forEach 的話需要自己建立空陣列再 push，既冗長又不符合語意。map 就是為轉換陣列而設計的。',
  },
  {
    id: 8,
    question: '用 reduce 實作 filter 功能，以下哪個實作正確？',
    options: [
      '[1,2,3,4].reduce((acc, cur) => cur > 2 ? acc + cur : acc, 0)',
      '[1,2,3,4].reduce((acc, cur) => cur > 2 ? [...acc, cur] : acc, [])',
      '[1,2,3,4].reduce((acc, cur) => acc.push(cur > 2), [])',
      '[1,2,3,4].reduce((acc, cur) => [acc, cur], [])',
    ],
    answer: 1,
    explanation:
      '選項 B 正確：以 [] 為初始值，當 cur > 2 時展開 acc 並加入 cur，否則直接回傳 acc。結果是 [3, 4]，等同於 filter(x => x > 2)。',
  },
  {
    id: 9,
    question: '以下哪個方法會修改原陣列？',
    options: [
      'map',
      'filter',
      'reduce',
      '以上三者都不會修改原陣列',
    ],
    answer: 3,
    explanation:
      'map、filter、reduce 都是非破壞性方法（non-mutating），它們回傳新陣列或新值，不修改原陣列。相比之下，push、pop、splice、sort 等方法會修改原陣列。',
  },
  {
    id: 10,
    question: '用 reduce 將陣列轉換成物件，以下哪個寫法正確？\n\n// 目標：將 ["a","b","c"] 轉成 {a:true, b:true, c:true}',
    options: [
      '["a","b","c"].reduce((acc, key) => { acc[key] = true; return acc }, {})',
      '["a","b","c"].reduce((acc, key) => acc[key] = true, {})',
      '["a","b","c"].reduce((acc, key) => acc.push({[key]: true}), [])',
      '["a","b","c"].reduce({}, (acc, key) => acc[key] = true)',
    ],
    answer: 0,
    explanation:
      '選項 A 正確：以 {} 為初始值，每次迭代設定 acc[key] = true 後必須 return acc，否則下一次迭代的 acc 會是 undefined。',
  },
  {
    id: 11,
    question: '以下哪個場景最適合使用 reduce？',
    options: [
      '對陣列每個元素執行 API 請求（副作用）',
      '從陣列中過濾出特定條件的元素',
      '將陣列扁平化成一個值，如加總、物件聚合、巢狀陣列壓平',
      '將陣列每個元素轉換成另一個值',
    ],
    answer: 2,
    explanation:
      'reduce 最適合把陣列「縮減」成單一結果，不論是數字（加總）、物件（分組）或另一個陣列（壓平）。副作用用 forEach，過濾用 filter，轉換用 map。',
  },
  {
    id: 12,
    question: 'map、filter、reduce 三者鏈接使用（chaining）時，有什麼效能考量？',
    options: [
      '鏈接不影響效能，JavaScript 引擎會自動優化',
      '每次鏈接都會建立一個新的中間陣列，遍歷整個陣列一次，大資料量時可以考慮改用 reduce 一次完成',
      '鏈接越多，速度越快，因為每步處理的元素越來越少',
      '只有 reduce 在鏈接時有效能問題',
    ],
    answer: 1,
    explanation:
      '每個 map/filter 都會遍歷陣列一遍並建立新陣列。若資料量大，可以用一個 reduce 同時完成過濾和轉換，減少遍歷次數和中間陣列的建立。對於小型陣列，可讀性比效能更重要。',
  },
]
