export const notes = {
  title: '事件傳遞流程',
  sections: [
    {
      heading: '三個階段',
      content: `DOM 事件傳遞分三個階段：

1. **Capture Phase（捕獲）**：從 window 往下，經過每一層祖先元素，到目標元素的父元素
2. **Target Phase（目標）**：事件到達目標元素本身
3. **Bubble Phase（冒泡）**：從目標元素往上，回到 window

\`\`\`
window
  └─ document
       └─ html
            └─ body
                 └─ div#outer    ← Capture ↓ / Bubble ↑
                      └─ p#target  ← Target Phase
\`\`\``,
    },
    {
      heading: 'addEventListener 的第三個參數',
      content: `\`\`\`
// 在 bubble phase 觸發（預設）
element.addEventListener('click', handler, false)
element.addEventListener('click', handler)

// 在 capture phase 觸發
element.addEventListener('click', handler, true)

// 物件寫法（支援更多選項）
element.addEventListener('click', handler, {
  capture: true,
  once: true,      // 執行一次後自動移除
  passive: true,   // 不會呼叫 preventDefault，提升捲動效能
})
\`\`\``,
    },
    {
      heading: '執行順序範例',
      content: `\`\`\`
outer.addEventListener('click', () => console.log('outer capture'), true)
outer.addEventListener('click', () => console.log('outer bubble'), false)
inner.addEventListener('click', () => console.log('inner bubble'), false)
\`\`\`

點擊 inner 時輸出：
1. outer capture（捕獲往下）
2. inner bubble（target phase，按註冊順序）
3. outer bubble（冒泡往上）

**在 target 元素上**，capture 和 bubble 監聽器的執行順序由**註冊順序**決定，不分 capture/bubble。`,
    },
    {
      heading: 'capture phase 的實用場景',
      content: `**場景一：攔截被 stopPropagation 阻止的事件**
子元素呼叫了 stopPropagation，bubble 階段的父元素就收不到事件。改用 capture 可以在事件往下時先攔截。

**場景二：監聽不冒泡的事件**
focus/blur 不會冒泡，但可以在 capture phase 監聽：
\`\`\`
document.addEventListener('focus', handler, true)   // 統一監聽整個頁面的 focus
\`\`\``,
    },
    {
      heading: 'stopPropagation 在 capture 的效果',
      content: `在 capture phase 呼叫 stopPropagation()，事件在那個節點停止往下傳遞：

\`\`\`
outer.addEventListener('click', (e) => {
  e.stopPropagation()   // 事件在 outer 停止
}, true)   // capture phase

// inner 的監聽器不會執行
// bubble phase 也不會發生
\`\`\``,
    },
    {
      heading: 'passive 選項',
      content: `\`\`\`
window.addEventListener('scroll', handler, { passive: true })
window.addEventListener('touchstart', handler, { passive: true })
\`\`\`

告訴瀏覽器「這個監聽器不會呼叫 preventDefault()」，瀏覽器可以立即執行預設的捲動行為，不必等 JavaScript 執行完畢。

對觸控設備的滾動流暢度有顯著改善。若在 passive 監聽器中呼叫 preventDefault()，瀏覽器會忽略並顯示警告。`,
    },
  ],
}
