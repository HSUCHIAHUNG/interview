import type { Question } from '@/lib/topics'

export const questions: Question[] = [
  {
    id: 1,
    question: '=== （嚴格相等）和 ==（抽象相等）最根本的差異是什麼？',
    options: [
      '=== 只能比較物件，== 只能比較基本型別',
      '=== 比較值和型別，不做型別轉換；== 若型別不同則會先做強制型別轉換再比較',
      '=== 速度比 == 慢，因為需要多檢查一個條件',
      '=== 和 == 在所有情況下的結果完全相同',
    ],
    answer: 1,
    explanation:
      '=== 是嚴格相等：型別不同直接回傳 false，不做任何轉換。== 是抽象相等：若兩邊型別不同，JavaScript 會依照複雜的強制型別轉換規則（Type Coercion）將值轉換後再比較。因此建議在日常開發中優先使用 === 以避免意外行為。',
  },
  {
    id: 2,
    question: '以下哪個表達式的結果為 true？',
    options: [
      '1 === "1"',
      'null === undefined',
      'null == undefined',
      '0 === false',
    ],
    answer: 2,
    explanation:
      '只有 null == undefined 為 true。這是 JavaScript 規範的特殊規則：null 和 undefined 用 == 比較時互為相等，且它們不等於任何其他值（null == 0 為 false，undefined == "" 為 false）。但 null === undefined 為 false，因為型別不同。',
  },
  {
    id: 3,
    question: '0 == false 的結果是什麼？為什麼？',
    options: [
      'false，因為 0 是數字，false 是布林，型別不同',
      'true，因為 == 會將 false 轉換為數字 0，再比較 0 == 0',
      'true，因為 0 在 JavaScript 中被視為 null',
      'false，因為 == 不能比較布林值和數字',
    ],
    answer: 1,
    explanation:
      '0 == false 為 true。根據 == 的型別轉換規則：當一方是布林值時，先將布林值轉為數字（false → 0，true → 1），再比較。所以 false 被轉為 0，最終比較 0 == 0，結果為 true。這是 == 常見的陷阱之一。',
  },
  {
    id: 4,
    question: '"" == false 的結果是什麼？',
    options: [
      'false',
      'true',
      'undefined',
      '拋出 TypeError',
    ],
    answer: 1,
    explanation:
      '"" == false 為 true。型別轉換過程：(1) false 轉為數字 0；(2) 空字串 "" 轉為數字 0；(3) 比較 0 == 0，為 true。這說明空字串和 false 在 == 比較下是相等的，這種行為常讓人困惑，因此建議使用 ===。',
  },
  {
    id: 5,
    question: '以下程式碼的輸出結果為何？\n\nconsole.log(null == 0)\nconsole.log(null == "")\nconsole.log(null == false)',
    options: [
      'true, true, true',
      'false, false, false',
      'true, false, true',
      'false, true, false',
    ],
    answer: 1,
    explanation:
      'null 只等於 undefined（在 == 比較下），不等於 0、""、false 等任何其他 falsy 值。因此 null == 0、null == ""、null == false 全部為 false。這是 JavaScript 中 null 的特殊規則，需要特別記憶。',
  },
  {
    id: 6,
    question: '為什麼業界最佳實踐建議優先使用 === 而非 ==？',
    options: [
      '因為 === 比 == 執行速度快 10 倍',
      '因為 == 的型別轉換規則複雜且反直覺，容易造成難以發現的 bug',
      '因為 == 在 ES6 之後已被棄用',
      '因為 === 支援更多的型別比較',
    ],
    answer: 1,
    explanation:
      '使用 === 的原因：(1) 行為可預測，不做隱式型別轉換；(2) 程式碼意圖明確，閱讀者不需了解複雜的轉換規則；(3) 避免像 0 == false、"" == false 等反直覺的結果；(4) 大多數 linter（如 ESLint 的 eqeqeq 規則）都強制要求使用 ===。只有在需要同時判斷 null 和 undefined 時，才考慮使用 == null。',
  },
  {
    id: 7,
    question: '以下程式碼的輸出結果為何？\n\nconst x = null\nconsole.log(x == null)\nconsole.log(x == undefined)',
    options: [
      'true, false',
      'false, true',
      'true, true',
      'false, false',
    ],
    answer: 2,
    explanation:
      'null == null 為 true（自身相等），null == undefined 也為 true（特殊規則）。利用這個特性，開發者常用 value == null 來同時判斷一個值是 null 或 undefined，這是 == 少數被認為合理使用的場景。',
  },
]
