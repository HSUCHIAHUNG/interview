import type { Question } from '@/lib/topics'

export const questions: Question[] = [
  {
    id: 1,
    question: 'undefined 和 null 在語意上最核心的差異是什麼？',
    options: [
      '兩者完全相同，只是寫法不同',
      'undefined 是 JavaScript 引擎自動賦予的「尚未賦值」；null 是開發者主動設定的「刻意為空」',
      'null 是 JavaScript 引擎自動賦予的；undefined 是開發者設定的',
      'undefined 只能出現在函式回傳值，null 只能出現在變數宣告',
    ],
    answer: 1,
    explanation:
      'undefined 代表「這個變數存在，但還沒給它值」，由 JS 引擎自動產生。null 代表「這裡本來應該有值，但我現在刻意把它設為空」，是開發者有意識的行為。',
  },
  {
    id: 2,
    question: 'typeof null 的結果是什麼？',
    options: [
      '"null"',
      '"undefined"',
      '"object"',
      '"empty"',
    ],
    answer: 2,
    explanation:
      'typeof null 回傳 "object"，這是 JavaScript 初版留下的歷史 bug。當時用低位元標記型別，null 的全零位元剛好被誤判為 object。這個 bug 至今無法修正，因為修正會破壞大量現有程式碼。',
  },
  {
    id: 3,
    question: '以下哪個情況會產生 undefined？',
    options: [
      'let x = null',
      'const obj = {}; console.log(obj.name)',
      'JSON.parse("null")',
      'Number("")',
    ],
    answer: 1,
    explanation:
      '存取物件不存在的屬性會回傳 undefined。let x = null 是主動賦值為 null；JSON.parse("null") 回傳 null；Number("") 回傳 0。',
  },
  {
    id: 4,
    question: 'null == undefined 和 null === undefined 分別是什麼？',
    options: [
      '兩者都是 true',
      '兩者都是 false',
      'null == undefined 是 true；null === undefined 是 false',
      'null == undefined 是 false；null === undefined 是 true',
    ],
    answer: 2,
    explanation:
      '寬鬆相等（==）中，null 和 undefined 互相相等，但不等於其他任何值（包含 0、""、false）。嚴格相等（===）要求型別也相同，兩者型別不同（"null" vs "undefined"），所以是 false。',
  },
  {
    id: 5,
    question: 'Number(null) 和 Number(undefined) 的結果分別是什麼？',
    options: [
      '兩者都是 0',
      '兩者都是 NaN',
      'Number(null) 是 0；Number(undefined) 是 NaN',
      'Number(null) 是 NaN；Number(undefined) 是 0',
    ],
    answer: 2,
    explanation:
      'Number(null) 回傳 0，因為 null 被視為「空的數值」。Number(undefined) 回傳 NaN，因為 undefined 代表「未知的值」，無法轉換成數字。這個差異常在條件判斷或運算中造成意外。',
  },
  {
    id: 6,
    question: '函式沒有明確 return 時，呼叫它會得到什麼？',
    options: [
      'null',
      'undefined',
      '0',
      '拋出 TypeError',
    ],
    answer: 1,
    explanation:
      'JavaScript 函式若沒有 return 語句（或只有 return;），呼叫後回傳 undefined。這是 JS 引擎的預設行為，不是錯誤。',
  },
  {
    id: 7,
    question: '要正確判斷一個變數是否為 null，下列哪個寫法最可靠？',
    options: [
      'typeof x === "null"',
      'x == null（同時涵蓋 null 和 undefined）',
      'x === null',
      'x == undefined',
    ],
    answer: 2,
    explanation:
      '嚴格相等 x === null 只會在 x 真的是 null 時為 true，不會把 undefined 也算進去。typeof 無法用來判斷 null（會得到 "object"）。x == null 雖然可以，但它同時也匹配 undefined，語意較不精確。',
  },
  {
    id: 8,
    question: '以下程式碼輸出什麼？\n\nfunction getUser() {}\nconst user = getUser()\nconsole.log(user ?? "guest")',
    options: [
      '"guest"',
      'undefined',
      'null',
      '拋出 ReferenceError',
    ],
    answer: 0,
    explanation:
      '函式沒有 return，所以 user 是 undefined。空值合併運算子（??）在左側為 null 或 undefined 時回傳右側值，所以輸出 "guest"。注意 ?? 只對 null/undefined 作用，不像 || 那樣對所有 falsy 值（0、""、false）都觸發。',
  },
  {
    id: 9,
    question: 'null == 0 的結果是什麼？',
    options: [
      'true，因為 Number(null) 是 0',
      'false，null 用 == 只和 undefined 相等，不和 0 相等',
      'true，因為 null 是 falsy',
      '拋出 TypeError',
    ],
    answer: 1,
    explanation:
      'ECMAScript 規範明確規定：null == x 只有在 x 是 null 或 undefined 時才為 true，其他值（包含 0、""、false）全部是 false。即使 Number(null) === 0，寬鬆相等的規則並不走數值轉換這條路。',
  },
  {
    id: 10,
    question: '在 TypeScript 中，下列何者最能正確表達「這個值可能存在，也可能不存在」？',
    options: [
      'string | null',
      'string | undefined',
      'string | null | undefined',
      '以上都是正確的，根據語意選擇',
    ],
    answer: 3,
    explanation:
      '三者都正確，語意不同：string | undefined 常用於可選參數（沒傳就是 undefined）；string | null 常用於「有值但可能被清空」（如登出後的 user）；string | null | undefined 則同時涵蓋兩種情境。TypeScript 的 strictNullChecks 讓你明確選擇需要的語意。',
  },
]
