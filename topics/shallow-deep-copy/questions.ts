import type { Question } from '@/lib/topics'

export const questions: Question[] = [
  {
    id: 1,
    question: '什麼是淺拷貝（Shallow Copy）？',
    options: [
      '完全複製物件及其所有巢狀屬性，兩者完全獨立',
      '複製物件的第一層屬性，若屬性值是物件則複製其參考而非建立新物件',
      '只複製物件的 key，不複製 value',
      '使用 JSON 序列化再反序列化的複製方式',
    ],
    answer: 1,
    explanation:
      '淺拷貝建立一個新物件，並複製原物件的第一層屬性。若第一層屬性的值是基本型別（字串、數字等），則複製其值；若是物件或陣列，則複製參考（指向同一記憶體位址）。因此修改巢狀物件時，原物件也會受影響。',
  },
  {
    id: 2,
    question: '什麼是深拷貝（Deep Copy）？',
    options: [
      '只複製物件最深層的屬性',
      '複製物件的參考，讓兩個變數指向同一物件',
      '遞迴複製物件所有層級的屬性，使新舊物件完全獨立互不影響',
      '使用 Object.assign 合併多個物件的方式',
    ],
    answer: 2,
    explanation:
      '深拷貝會遞迴地複製物件所有層級的屬性，建立完全獨立的新物件。修改深拷貝後的物件不會影響原物件，反之亦然。常見方法有 structuredClone()、JSON.parse(JSON.stringify(obj))、Lodash 的 _.cloneDeep() 等。',
  },
  {
    id: 3,
    question: 'Object.assign({}, source) 是淺拷貝還是深拷貝？',
    options: [
      '深拷貝，因為它建立了一個全新的物件',
      '淺拷貝，第一層的基本型別屬性被複製，但巢狀物件只複製參考',
      '根據物件結構決定，單層物件是深拷貝，多層物件是淺拷貝',
      '既不是淺拷貝也不是深拷貝，它只是合併物件',
    ],
    answer: 1,
    explanation:
      'Object.assign 是淺拷貝。雖然它建立一個新物件並複製第一層屬性，但若屬性值是巢狀物件（如 { nested: { a: 1 } }），只會複製參考。修改 result.nested.a 仍會影響原物件的 source.nested.a。',
  },
  {
    id: 4,
    question: '展開運算子（spread operator）{ ...obj } 是淺拷貝還是深拷貝？',
    options: [
      '深拷貝，因為使用了新的語法',
      '淺拷貝，與 Object.assign 行為相同',
      '根據屬性數量決定',
      '深拷貝，但只支援 JSON 可序列化的型別',
    ],
    answer: 1,
    explanation:
      '展開運算子 { ...obj } 和 Object.assign({}, obj) 行為相同，都是淺拷貝。它只複製第一層的屬性，巢狀物件依然共享參考。同樣地，陣列的展開 [...arr] 也是淺拷貝。',
  },
  {
    id: 5,
    question: 'structuredClone() 函式有什麼特點？',
    options: [
      '是淺拷貝的原生實作',
      '是深拷貝的原生實作，支援 Date、RegExp、Map、Set 等型別，但不支援函式',
      '功能與 JSON.parse(JSON.stringify()) 完全相同',
      '只能複製陣列，不能複製普通物件',
    ],
    answer: 1,
    explanation:
      'structuredClone() 是 JavaScript 原生的深拷貝 API（Node.js 17+ / 主流瀏覽器皆支援）。相比 JSON 方法，它支援更多型別如 Date、RegExp、Map、Set、ArrayBuffer 等，且能正確處理循環參考。但它無法複製函式和 Symbol。',
  },
  {
    id: 6,
    question: '使用 JSON.parse(JSON.stringify(obj)) 進行深拷貝，有什麼潛在問題？',
    options: [
      '無法複製陣列，只能複製純物件',
      'undefined 值、函式、Symbol、Date 物件等會遺失或被錯誤轉換',
      '執行速度過慢，不建議在任何情況下使用',
      '會改變原始物件的屬性',
    ],
    answer: 1,
    explanation:
      'JSON.parse(JSON.stringify()) 的限制：(1) 值為 undefined 的屬性會被移除；(2) 函式和 Symbol 會被忽略；(3) Date 物件會變成字串；(4) 含有循環參考的物件會拋錯；(5) Map、Set 等型別無法正確序列化。對於簡單的 JSON 可序列化物件，這個方法簡單有效，但需注意上述限制。',
  },
  {
    id: 7,
    question: '以下程式碼執行後，original.address.city 的值是什麼？\n\nconst original = { name: "Alice", address: { city: "Taipei" } }\nconst copy = { ...original }\ncopy.address.city = "Tokyo"\nconsole.log(original.address.city)',
    options: [
      '"Taipei"（不受影響，因為已建立副本）',
      '"Tokyo"（因為展開運算子是淺拷貝，address 共享參考）',
      'undefined（屬性被刪除）',
      '拋出 TypeError 錯誤',
    ],
    answer: 1,
    explanation:
      '展開運算子 { ...original } 是淺拷貝，address 屬性複製的是參考，copy.address 和 original.address 指向同一個物件。因此修改 copy.address.city 也會改變 original.address.city，輸出 "Tokyo"。若要避免此問題，應使用 structuredClone(original) 或 JSON.parse(JSON.stringify(original))。',
  },
  {
    id: 8,
    question: '陣列的哪個方法是淺拷貝？',
    options: [
      'arr.map(x => x)（如果元素是物件）',
      'arr.slice()',
      '[...arr]',
      '以上皆是淺拷貝（若陣列元素是物件）',
    ],
    answer: 3,
    explanation:
      'arr.slice()、[...arr]、arr.map(x => x)、Array.from(arr) 都是陣列的淺拷貝方法，它們建立新陣列但若元素是物件，只複製參考。例如 arr.slice() 後修改新陣列中物件元素的屬性，原陣列對應元素也會改變。若要深拷貝陣列中的物件元素，需使用 structuredClone() 或手動深拷貝。',
  },
]
