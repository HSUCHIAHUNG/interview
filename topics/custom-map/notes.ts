export const notes = {
  title: '實現 myMap()',
  sections: [
    {
      heading: '為什麼可以用 [1,2,3].myMap()?',
      content: `JavaScript 中，所有陣列都繼承自 Array.prototype。

當你存取 [1,2,3].myMap 時，引擎會沿著 prototype chain 往上找：
陣列實例 → Array.prototype → Object.prototype → null

只要把 myMap 掛在 Array.prototype 上，所有陣列都能使用它。`,
    },
    {
      heading: '基本實作',
      content: `\`\`\`
Array.prototype.myMap = function(callback) {
  const result = []
  for (let i = 0; i < this.length; i++) {
    result.push(callback(this[i], i, this))
  }
  return result
}

// 使用
[1, 2, 3].myMap(x => x * 2)   // [2, 4, 6]
\`\`\`

**為什麼用 function 而不是箭頭函式？**
箭頭函式沒有自己的 this，會繼承定義時的外部 this（通常是 window 或 undefined）。
用 function 宣告，this 才能正確指向呼叫 myMap 的陣列。`,
    },
    {
      heading: 'callback 的三個參數',
      content: `原生 map 的 callback 接收三個參數，myMap 也應如此：

\`\`\`
array.myMap((element, index, array) => { ... })
\`\`\`

- **element**：當前元素值
- **index**：當前索引
- **array**：原始陣列本身

在實作中用 callback(this[i], i, this) 傳入這三個值。`,
    },
    {
      heading: '支援 thisArg 參數',
      content: `原生 map 的第二個參數可以指定 callback 的 this：

\`\`\`
Array.prototype.myMap = function(callback, thisArg) {
  const result = []
  for (let i = 0; i < this.length; i++) {
    result.push(callback.call(thisArg, this[i], i, this))
  }
  return result
}
\`\`\`

用 .call(thisArg, ...) 確保 callback 執行時的 this 是指定的值。`,
    },
    {
      heading: '擴充原生 prototype 的風險',
      content: `- **命名衝突**：若未來 JavaScript 規格加入同名方法，會互相覆蓋
- **影響全域**：所有陣列都會有這個方法，在大型專案或第三方 library 中風險高
- **Polyfill 情境除外**：為舊環境補上原生方法（如 Array.prototype.flat）是合理的

**替代方案**：把 myMap 定義為獨立函式，不掛在 prototype 上：
\`\`\`
function myMap(array, callback) {
  const result = []
  for (let i = 0; i < array.length; i++) {
    result.push(callback(array[i], i, array))
  }
  return result
}
\`\`\``,
    },
  ],
}
