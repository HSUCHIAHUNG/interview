export const notes = {
  title: '參考型別與相等比較',
  sections: [
    {
      heading: '值型別 vs 參考型別',
      content: `JavaScript 的資料分兩種，比較方式完全不同：\n\n| 型別 | 種類 | 比較方式 |\n|---|---|---|\n| **Primitive（值型別）** | number、string、boolean、null、undefined、symbol | 比較值本身 |\n| **Reference（參考型別）** | object、array、function | 比較記憶體位址 |`,
    },
    {
      heading: '為什麼 [] === [] 是 false',
      content: `每次寫 [] 都會在記憶體建立一個全新的陣列物件，兩個 [] 住在不同的記憶體位址。\n\n=== 比較的是位址，不是內容，所以永遠是 false。\n\n要讓比較為 true，必須讓兩個變數指向同一個物件：\n\nconst a = []\nconst b = a   // b 和 a 指向同一個位址\nconsole.log(a === b)  // true`,
    },
    {
      heading: '== 和 === 對參考型別沒差別',
      content: `對兩個參考型別互相比較時，== 和 === 結果完全相同，都是比較記憶體位址。\n\n差別只在「參考型別 vs 原始型別」時，== 會觸發型別轉換，=== 不會。`,
    },
    {
      heading: '[] == false 的陷阱',
      content: `[] == false 的結果是 true，過程如下：\n\n1. [] 是物件，呼叫 valueOf() → [] 還是物件\n2. 再呼叫 toString() → ""\n3. "" 轉數字 → 0\n4. false 轉數字 → 0\n5. 0 == 0 → true\n\n這是 == 最危險的陷阱，實務上應永遠用 ===。`,
    },
    {
      heading: '如何比較陣列或物件內容',
      content: `JavaScript 沒有內建深度比較，常見做法：\n\n- 簡易：JSON.stringify(a) === JSON.stringify(b)\n  缺點：無法處理 undefined、函式、循環參考，鍵順序不同會誤判\n\n- 嚴謹：使用 lodash 的 _.isEqual(a, b)\n\n不要用 == 或 === 比較兩個不同的物件或陣列是否「內容相等」。`,
    },
    {
      heading: 'React 中的參考比較',
      content: `React 用 === 比較前後兩次 state 的參考位址。位址沒變 → 跳過渲染；位址變了 → 觸發重新渲染。\n\n**陣列操作範例**\n\`\`\`\nimport { useState } from 'react'\n\nfunction TodoList() {\n  const [items, setItems] = useState(['買牛奶', '寫作業'])\n\n  // ❌ 錯誤：直接 push，items 的記憶體位址不變\n  //    React 認為 state 沒有改變，畫面不會更新\n  function addWrong(text) {\n    items.push(text)\n    setItems(items)  // 傳入同一個陣列參考\n  }\n\n  // ✅ 正確：展開成新陣列，產生新位址\n  function addCorrect(text) {\n    setItems(prev => [...prev, text])\n  }\n\n  // ✅ 正確：刪除某個元素\n  function remove(index) {\n    setItems(prev => prev.filter((_, i) => i !== index))\n  }\n\n  // ✅ 正確：修改某個元素\n  function update(index, newText) {\n    setItems(prev => prev.map((item, i) => i === index ? newText : item))\n  }\n\n  return (\n    <ul>\n      {items.map((item, i) => (\n        <li key={i}>\n          {item}\n          <button onClick={() => remove(i)}>刪除</button>\n        </li>\n      ))}\n      <button onClick={() => addCorrect('新項目')}>新增</button>\n    </ul>\n  )\n}\`\`\`\n\n**物件操作範例**\n\`\`\`\nfunction UserProfile() {\n  const [user, setUser] = useState({ name: 'Alice', age: 25 })\n\n  // ❌ 錯誤：直接修改物件屬性，位址不變\n  function updateWrong() {\n    user.name = 'Bob'\n    setUser(user)  // 同一個物件參考，不會重新渲染\n  }\n\n  // ✅ 正確：展開成新物件，再覆蓋要改的欄位\n  function updateCorrect() {\n    setUser(prev => ({ ...prev, name: 'Bob' }))\n  }\n\n  return <p>{user.name}, {user.age} 歲</p>\n}\`\`\`\n\n**巢狀物件要注意**\n\`\`\`\n// ❌ 淺拷貝無法解決巢狀問題\nconst next = { ...user }\nnext.address.city = '台北'  // address 還是同一個參考！\n\n// ✅ 每一層都要展開\nsetUser(prev => ({\n  ...prev,\n  address: { ...prev.address, city: '台北' }\n}))\`\`\``,
    },
    {
      heading: '判斷是否為陣列用 Array.isArray()',
      content: `typeof [] 回傳 "object"，無法區分陣列和物件。\n\n正確判斷陣列應使用：\n\nArray.isArray([])   // true\nArray.isArray({})   // false\nArray.isArray(null) // false`,
    },
  ],
}
