export const notes = {
  title: '作用域 (Scope)',
  sections: [
    {
      heading: '什麼是作用域',
      content: `作用域定義了「變數在哪個範圍內可以被存取」的規則。\n\nJavaScript 採用**語彙作用域（Lexical Scope）**，也稱靜態作用域：作用域在程式碼**撰寫時**就決定，不是執行時動態計算。這代表你只需要閱讀程式碼結構，就能判斷變數的可見範圍。`,
    },
    {
      heading: '三種作用域',
      content: `| 作用域 | 範圍 | 由什麼建立 |\n|---|---|---|\n| **Global（全域）** | 整個程式都可存取 | 最外層宣告 |\n| **Function（函式）** | 函式內部，var 適用 | function 關鍵字 |\n| **Block（區塊）** | {} 內部，let/const 適用 | {} + let 或 const |`,
    },
    {
      heading: 'var vs let / const 的作用域差異',
      content: `\`\`\`\nfunction example() {\n  if (true) {\n    var x = 1    // function scope，整個函式都看得到\n    let y = 2    // block scope，只在這個 {} 內\n    const z = 3  // block scope，只在這個 {} 內\n  }\n\n  console.log(x)  // 1   ✅\n  console.log(y)  // ❌ ReferenceError\n  console.log(z)  // ❌ ReferenceError\n}\`\`\``,
    },
    {
      heading: '作用域鏈（Scope Chain）',
      content: `內層找不到變數時，會往外層一層一層查找，直到全域。外層永遠看不到內層。\n\`\`\`\nconst a = 1           // global scope\n\nfunction outer() {\n  const b = 2         // outer scope\n\n  function inner() {\n    const c = 3\n    console.log(a)    // ✅ 往外找到 global 的 a\n    console.log(b)    // ✅ 往外找到 outer 的 b\n    console.log(c)    // ✅ 自己的 c\n  }\n\n  console.log(c)      // ❌ ReferenceError，看不到 inner 的 c\n}\`\`\``,
    },
    {
      heading: 'Hoisting 與暫時死區（TDZ）',
      content: `var 宣告會被提升到作用域頂端，值是 undefined；let/const 也提升但進入**暫時死區（TDZ）**，在宣告語句前存取會拋出 ReferenceError。\n\`\`\`\nconsole.log(a)  // undefined（var 提升，值尚未賦予）\nconsole.log(b)  // ❌ ReferenceError（TDZ）\n\nvar a = 1\nlet b = 2\`\`\``,
    },
    {
      heading: 'var 在 for 迴圈的經典陷阱',
      content: `\`\`\`\n// ❌ var：三個回呼共享同一個 i，迴圈結束後 i = 3\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0)\n}\n// 輸出：3, 3, 3\n\n// ✅ let：每次迭代建立獨立的 i 綁定\nfor (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0)\n}\n// 輸出：0, 1, 2\`\`\`\n\nvar 是函式作用域，三個 setTimeout 的回呼捕獲的是同一個 i 的參考，等回呼執行時 i 已經是 3。let 的區塊作用域讓每次迭代有自己的 i，完全解決這個問題。`,
    },
    {
      heading: '變數遮蔽（Shadowing）',
      content: `內層可以宣告和外層同名的變數，內層的變數會「遮蔽」外層的，但外層不受影響。\n\`\`\`\nconst name = 'global'\n\nfunction greet() {\n  const name = 'local'   // 遮蔽外層的 name\n  console.log(name)      // 'local'\n}\n\ngreet()\nconsole.log(name)        // 'global'（外層不受影響）\`\`\`\n\n搭配 TDZ 的危險情境：函式內宣告了同名的 let，在宣告前存取會 ReferenceError，即使外層有同名變數。`,
    },
    {
      heading: '模組作用域（Module Scope）',
      content: `ES Module 的頂層宣告屬於**模組作用域**，不會污染全域 window 物件。其他模組必須透過 export / import 才能存取。\n\`\`\`\n// utils.js\nconst helper = '只有這個模組看得到'\nexport const publicHelper = '其他模組可以 import'\n\n// main.js\nimport { publicHelper } from './utils.js'\nconsole.log(helper)        // ❌ ReferenceError\nconsole.log(publicHelper)  // ✅\`\`\``,
    },
  ],
}
