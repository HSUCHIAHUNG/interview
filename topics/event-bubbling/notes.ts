export const notes = {
  title: 'Event Bubbling',
  sections: [
    {
      heading: '什麼是 Event Bubbling？',
      content: `當你點擊一個元素，事件會從該元素開始，依序往上傳遞到父元素、祖父元素，直到 document（或 window）。

就像氣泡從水底往上浮，所以叫「冒泡」。

\`\`\`
<div id="outer">       <!-- 3. 最後 -->
  <p id="middle">      <!-- 2. 其次 -->
    <span id="inner">  <!-- 1. 先觸發 -->
      click me
    </span>
  </p>
</div>
\`\`\`

點擊 span 時，click 事件依序在 inner → middle → outer → body → html → document 上觸發。`,
    },
    {
      heading: 'target vs currentTarget',
      content: `| 屬性 | 說明 |
|---|---|
| event.target | 最初觸發事件的元素（整個冒泡過程中不變） |
| event.currentTarget | 當前正在執行監聽器的元素（隨冒泡改變） |

\`\`\`
outer.addEventListener('click', (e) => {
  console.log(e.target)         // 被點的那個元素（如 span）
  console.log(e.currentTarget)  // outer（現在在這層執行）
})
\`\`\``,
    },
    {
      heading: '阻止冒泡',
      content: `\`\`\`
element.addEventListener('click', (e) => {
  e.stopPropagation()   // 事件不再往上傳遞
})
\`\`\`

**stopPropagation vs preventDefault：**
- stopPropagation()：阻止事件繼續傳遞（冒泡/捕獲）
- preventDefault()：阻止瀏覽器的預設行為（如跟隨連結、提交表單）
- 兩者互不干擾，可以同時呼叫

**stopImmediatePropagation()**：比 stopPropagation 更強，連同一元素上後續的同類型監聽器也阻止。`,
    },
    {
      heading: '事件委派（Event Delegation）',
      content: `利用冒泡，把監聽器加在父元素上，統一處理所有子元素的事件：

\`\`\`
// ❌ 傳統做法：每個 li 都綁一個監聽器
document.querySelectorAll('li').forEach(li => {
  li.addEventListener('click', handleClick)
})

// ✅ 事件委派：只在 ul 上綁一個
document.querySelector('ul').addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    handleClick(e.target)
  }
})
\`\`\`

**優點：**
- 減少監聽器數量，節省記憶體
- 動態新增的子元素（AJAX 載入）不需要重新綁定`,
    },
    {
      heading: '哪些事件不會冒泡？',
      content: `- **focus / blur**：改用 focusin / focusout（這兩個會冒泡）
- **scroll**（元素上的 scroll）
- **mouseenter / mouseleave**：改用 mouseover / mouseout（會冒泡）
- **load / unload**

可以用 event.bubbles 屬性來確認某個事件是否會冒泡。`,
    },
  ],
}
