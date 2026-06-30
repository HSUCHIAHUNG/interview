import type { Question } from '@/lib/topics'

export const questions: Question[] = [
  {
    id: 1,
    question: '什麼是 Event Bubbling（事件冒泡）？',
    options: [
      '事件從最外層元素往內層傳遞',
      '事件從觸發的目標元素開始，依序往上傳遞到父元素、祖父元素，直到 document',
      '事件只在觸發的元素上執行，不傳遞',
      '事件同時在所有元素上觸發',
    ],
    answer: 1,
    explanation:
      '事件冒泡就像氣泡從水底往上浮。當你點擊一個 <button>，click 事件會先在 button 上觸發，再傳給它的父元素，再往上一層，直到 document（或 window）。',
  },
  {
    id: 2,
    question: '以下 HTML 結構中，點擊最內層的 <span>，事件會依照什麼順序冒泡？\n\n<div id="outer">\n  <p id="middle">\n    <span id="inner">click me</span>\n  </p>\n</div>',
    options: [
      'outer → middle → inner',
      'inner → middle → outer → body → html → document',
      'document → outer → middle → inner',
      '只在 inner 上觸發，不冒泡',
    ],
    answer: 1,
    explanation:
      '冒泡從目標（inner span）開始，依序向上：inner → middle → outer → body → html → document。',
  },
  {
    id: 3,
    question: '如何阻止事件繼續往上冒泡？',
    options: [
      'event.preventDefault()',
      'event.stopPropagation()',
      'event.cancelBubble = false',
      'return false（在所有情況下）',
    ],
    answer: 1,
    explanation:
      'event.stopPropagation() 阻止事件繼續往上（或往下）傳遞。event.preventDefault() 是阻止瀏覽器預設行為（如提交表單、跟隨連結），與冒泡無關。',
  },
  {
    id: 4,
    question: '事件委派（Event Delegation）的原理是什麼？',
    options: [
      '讓每個子元素都有獨立的事件監聽器',
      '利用冒泡機制，把事件監聽器加在父元素上，統一處理所有子元素的事件',
      '讓事件只在父元素上觸發，忽略子元素',
      '使用 shadow DOM 隔離事件',
    ],
    answer: 1,
    explanation:
      '事件委派利用冒泡：不需要給每個子元素加監聽器，只在父元素上加一個。當子元素被點擊，事件冒泡到父元素被捕捉，再用 event.target 判斷是哪個子元素觸發的。',
  },
  {
    id: 5,
    question: 'event.target 和 event.currentTarget 的差別是什麼？',
    options: [
      '兩者相同，都指向觸發事件的元素',
      'target 是觸發事件的原始元素；currentTarget 是當前正在執行監聽器的元素（可能是父元素）',
      'target 是父元素，currentTarget 是子元素',
      'currentTarget 只有在 capture phase 才有值',
    ],
    answer: 1,
    explanation:
      'target 永遠指向最初觸發事件的元素（如被點擊的 <button>），在整個冒泡過程中不變。currentTarget 在事件往上傳時，每到一層就變成那層的元素。',
  },
  {
    id: 6,
    question: '哪些事件不會冒泡？',
    options: [
      'click、mouseover、keydown',
      'focus、blur、scroll（元素上的 scroll）',
      '所有事件都會冒泡',
      'submit、change、input',
    ],
    answer: 1,
    explanation:
      'focus、blur、scroll 等事件不會冒泡（focus 和 blur 的替代方案是 focusin 和 focusout，這兩個會冒泡）。可以用 event.bubbles 屬性檢查一個事件是否會冒泡。',
  },
  {
    id: 7,
    question: 'stopImmediatePropagation() 和 stopPropagation() 有什麼差別？',
    options: [
      '兩者完全相同',
      'stopPropagation 阻止往父元素傳遞；stopImmediatePropagation 額外阻止同一元素上其他同類型的監聽器執行',
      'stopImmediatePropagation 只能在 capture phase 使用',
      'stopPropagation 效果比 stopImmediatePropagation 更強',
    ],
    answer: 1,
    explanation:
      'stopPropagation() 阻止事件冒泡到父元素，但同一元素上還有其他 click 監聽器仍會執行。stopImmediatePropagation() 更強，連同一元素上後續的監聽器也一起阻止。',
  },
  {
    id: 8,
    question: '事件委派的最大優勢是什麼？',
    options: [
      '讓事件執行速度更快',
      '減少事件監聽器數量，且動態新增的子元素無需額外綁定監聽器',
      '讓事件可以取消',
      '避免事件冒泡',
    ],
    answer: 1,
    explanation:
      '事件委派減少監聽器數量，節省記憶體。更重要的是，動態新增的子元素（如 AJAX 載入的清單項目）不需要手動綁定監聽器，因為冒泡會讓父元素的監聽器自動處理。',
  },
]
