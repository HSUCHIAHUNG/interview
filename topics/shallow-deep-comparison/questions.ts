import type { Question } from '@/lib/topics'

export const questions: Question[] = [
  {
    id: 1,
    question: '在 JavaScript 中，對兩個物件使用 === 比較時，比較的是什麼？',
    options: [
      '物件的所有屬性值是否相等',
      '物件在記憶體中的參考位址是否相同',
      '物件的 JSON 字串化結果是否相同',
      '物件的 prototype 是否相同',
    ],
    answer: 1,
    explanation:
      '對物件（包含陣列）使用 === 是「參考比較（reference equality）」，比較的是兩個變數是否指向記憶體中同一個物件，而非比較內容。例如 {} === {} 為 false，因為它們是兩個不同的物件實例。',
  },
  {
    id: 2,
    question: '以下程式碼的輸出結果為何？\n\nconst a = { x: 1 }\nconst b = a\nconst c = { x: 1 }\nconsole.log(a === b)\nconsole.log(a === c)',
    options: [
      'true, true',
      'false, false',
      'true, false',
      'false, true',
    ],
    answer: 2,
    explanation:
      'b = a 讓 b 和 a 指向同一個物件，所以 a === b 為 true。c = { x: 1 } 建立了一個全新的物件，雖然內容相同，但記憶體位址不同，所以 a === c 為 false。這就是淺比較（參考比較）的行為。',
  },
  {
    id: 3,
    question: '什麼是「淺比較（Shallow Comparison）」？',
    options: [
      '只比較基本型別的值，不比較物件',
      '比較物件第一層屬性的值，若屬性值是物件則只比較其參考',
      '完整遞迴比較物件所有層級的屬性值',
      '只比較物件的 key 名稱，不比較 value',
    ],
    answer: 1,
    explanation:
      '淺比較只比較物件的第一層屬性：若屬性值是基本型別，比較其值；若屬性值是物件或陣列，只比較其參考（記憶體位址）。React 的 PureComponent、React.memo、useMemo 依賴的都是淺比較。',
  },
  {
    id: 4,
    question: '以下哪個是使用 JSON.stringify 比較物件的限制？',
    options: [
      'JSON.stringify 無法處理字串型別',
      'JSON.stringify 會忽略值為 undefined 的屬性、函式、Symbol，且物件屬性順序不同可能導致比較失敗',
      'JSON.stringify 只能比較陣列，不能比較物件',
      'JSON.stringify 比較物件時，一定會回傳 true',
    ],
    answer: 1,
    explanation:
      'JSON.stringify 的比較限制包括：(1) undefined、函式、Symbol 類型的屬性會被忽略；(2) Date 物件會被轉為字串；(3) 含有循環參考的物件會拋出錯誤；(4) { a: 1, b: 2 } 和 { b: 2, a: 1 } 的 JSON 字串不同但語義相同。因此 JSON.stringify 不是可靠的深比較方式。',
  },
  {
    id: 5,
    question: '深比較（Deep Comparison / Deep Equal）與淺比較最大的差異是什麼？',
    options: [
      '深比較只能用於基本型別，淺比較才能用於物件',
      '深比較會遞迴比較物件所有層級的屬性值，確保內容完全相同',
      '深比較只比較物件的 prototype chain',
      '深比較比淺比較的執行速度更快',
    ],
    answer: 1,
    explanation:
      '深比較（如 Lodash 的 _.isEqual）會遞迴地比較物件的每一層屬性，確保所有嵌套結構的值都相等。缺點是時間複雜度較高，對於大型或深層物件效能較差。淺比較只看第一層，速度快但無法判斷深層巢狀物件的相等性。',
  },
  {
    id: 6,
    question: 'React.memo 使用哪種方式來決定是否重新渲染子元件？',
    options: [
      '深比較所有 props 的值',
      '淺比較 props 物件的第一層屬性',
      '直接比較 props 物件的參考位址（=== 比較）',
      '比較 props 的 JSON.stringify 結果',
    ],
    answer: 1,
    explanation:
      'React.memo 預設使用淺比較（shallow comparison）來比較前後兩次的 props。它會逐一比較 props 的每個屬性：若屬性是基本型別則比較值，若是物件/陣列則比較參考。這就是為什麼傳入新建立的物件或陣列 literal 每次都會觸發重新渲染。',
  },
  {
    id: 7,
    question: '以下程式碼中，React.memo 包裹的 Child 元件每次父元件 re-render 時都會重新渲染，原因是什麼？\n\nfunction Parent() {\n  return <Child config={{ theme: "dark" }} />\n}',
    options: [
      'React.memo 對函式元件無效',
      '每次 Parent re-render 都會建立新的 config 物件，導致淺比較發現參考改變',
      'React.memo 需要手動指定比較函式才有效',
      '物件型別的 props 永遠無法被 React.memo 快取',
    ],
    answer: 1,
    explanation:
      '每次 Parent 重新渲染，`{ theme: "dark" }` 都會建立一個全新的物件（參考不同）。React.memo 的淺比較發現 config prop 的參考改變，因此觸發 Child 重新渲染。解決方法是將 config 物件用 useMemo 包裹，或將其移到元件外部定義為常數。',
  },
]
