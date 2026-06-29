export const notes = {
  title: 'By Value vs By Reference',
  sections: [
    {
      heading: '傳值 vs 傳參考',
      content: `| | 傳值（By Value） | 傳參考（By Reference） |\n|---|---|---|\n| 適用型別 | Primitive（string、number、boolean、null、undefined、symbol） | Object、Array、Function |\n| 傳遞內容 | 值的副本 | 記憶體位址的副本 |\n| 函式內修改 | 不影響外部變數 | 影響原始物件的屬性 |\n| 重新賦值 | 不影響外部 | 不影響外部（只改變局部參考） |`,
    },
    {
      heading: 'Primitive 傳值',
      content: `\`\`\`\nfunction addOne(n) {\n  n = n + 1\n  console.log(n)  // 6\n}\n\nlet num = 5\naddOne(num)\nconsole.log(num)  // 5（外部不受影響）\`\`\`\n\n傳入的是 5 這個值的副本，函式內修改 n 不影響外部的 num。`,
    },
    {
      heading: '物件傳參考副本',
      content: `\`\`\`\nfunction birthday(obj) {\n  obj.age++             // 修改屬性：影響原始物件\n}\n\nfunction replace(obj) {\n  obj = { age: 0 }      // 重新賦值：只改局部參考，不影響外部\n}\n\nconst user = { age: 25 }\nbirthday(user)\nconsole.log(user.age)  // 26（屬性被修改）\n\nreplace(user)\nconsole.log(user.age)  // 26（外部 user 不受影響）\`\`\``,
    },
    {
      heading: '淺拷貝 vs 深拷貝',
      content: `\`\`\`\nconst original = { a: 1, nested: { b: 2 } }\n\n// 淺拷貝：第一層獨立，巢狀仍共用\nconst shallow = { ...original }\nshallow.a = 99           // 不影響 original.a\nshallow.nested.b = 99    // ❌ 影響 original.nested.b！\n\n// 深拷貝：完全獨立\nconst deep = structuredClone(original)\ndeep.nested.b = 99       // ✅ 不影響 original.nested.b\`\`\``,
    },
    {
      heading: '常用拷貝方式比較',
      content: `| 方式 | 深度 | 支援 Date/Map/Set | 支援 undefined/函式 |\n|---|---|---|---|\n| { ...obj } | 淺 | ✅（保留參考） | ✅ |\n| Object.assign() | 淺 | ✅（保留參考） | ✅ |\n| JSON.parse(JSON.stringify()) | 深 | ❌（Date 變字串） | ❌ |\n| structuredClone() | 深 | ✅ | ❌（函式不支援） |\n| lodash _.cloneDeep() | 深 | ✅ | ✅ |`,
    },
    {
      heading: 'React 中的實際應用',
      content: `React 用 === 比較 state，所以更新物件/陣列必須建立新的參考。\n\`\`\`\n// ❌ 直接修改：位址沒變，不觸發重新渲染\nsetUser(prev => {\n  prev.name = "Bob"\n  return prev\n})\n\n// ✅ 建立新物件\nsetUser(prev => ({ ...prev, name: "Bob" }))\n\n// ✅ 陣列新增\nsetItems(prev => [...prev, newItem])\n\n// ✅ 陣列刪除\nsetItems(prev => prev.filter(item => item.id !== id))\n\n// ✅ 陣列修改\nsetItems(prev => prev.map(item =>\n  item.id === id ? { ...item, done: true } : item\n))\`\`\``,
    },
  ],
}
