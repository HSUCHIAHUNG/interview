import type { CssEntry } from './css-topics-types'

export const part1Topics: CssEntry[] = [
  // ─── CSS Box Model 盒模型 ──────────────────────────────────────────────────
  {
    slug: 'css-box-model',
    title: 'CSS Box Model 盒模型',
    description: '理解 content / padding / border / margin 四層結構，掌握 box-sizing 的差異與預設值',
    subCategory: '盒模型與佈局',
    difficulty: 'easy',
    notes: {
      sections: [
        {
          heading: 'Box Model 四層結構',
          content: `CSS Box Model 是每個 HTML 元素的佈局基礎，由內到外共四層：

\`\`\`
┌──────────────────────────────────┐
│            margin                │
│  ┌────────────────────────────┐  │
│  │         border             │  │
│  │  ┌──────────────────────┐  │  │
│  │  │       padding        │  │  │
│  │  │  ┌────────────────┐  │  │  │
│  │  │  │    content     │  │  │  │
│  │  │  └────────────────┘  │  │  │
│  │  └──────────────────────┘  │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
\`\`\`

| 層次 | 說明 |
|------|------|
| **content** | 實際內容區域（文字、圖片等），由 width/height 控制 |
| **padding** | 內距，內容與 border 之間的空間，背景色會填充 padding 區域 |
| **border** | 邊框，包圍 padding 和 content |
| **margin** | 外距，元素與其他元素之間的空間，透明不顯示背景色 |`,
        },
        {
          heading: 'box-sizing：content-box vs border-box',
          content: `\`box-sizing\` 決定 \`width\` 和 \`height\` 的計算範圍：

**content-box（預設值）：**
\`\`\`css
.box {
  box-sizing: content-box; /* 預設 */
  width: 200px;
  padding: 20px;
  border: 5px solid;
}
/* 實際佔用寬度 = 200 + 20*2 + 5*2 = 250px */
\`\`\`

**border-box（推薦）：**
\`\`\`css
.box {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  border: 5px solid;
}
/* 實際佔用寬度 = 200px（width 已包含 padding 和 border）*/
/* content 寬度 = 200 - 20*2 - 5*2 = 150px */
\`\`\`

現代開發通常在 CSS reset 中加入：
\`\`\`css
*, *::before, *::after {
  box-sizing: border-box;
}
\`\`\``,
        },
        {
          heading: 'margin collapse（外邊距折疊）',
          content: `**垂直方向**的 margin 在特定情況下會發生折疊，取兩者中較大的值而非相加：

\`\`\`css
.a { margin-bottom: 30px; }
.b { margin-top: 20px; }
/* 兩者間距是 30px，而非 50px */
\`\`\`

**觸發 margin collapse 的條件：**
1. **相鄰兄弟元素**：上方元素的 \`margin-bottom\` 與下方元素的 \`margin-top\`
2. **父子元素**：父元素沒有 border/padding 隔離時，子元素的 margin 會和父元素的 margin 合併
3. **空元素**：自身的 \`margin-top\` 和 \`margin-bottom\` 也可能折疊

**注意：margin collapse 只發生在垂直方向（block 流），水平方向不會折疊。**

**解決 margin collapse 的方法：**
- 父元素加 \`overflow: hidden\` 建立 BFC
- 父元素加 \`padding\` 或 \`border\`
- 父元素設為 flex/grid container`,
        },
        {
          heading: 'padding vs margin 使用時機',
          content: `| 情境 | 使用 padding | 使用 margin |
|------|-------------|-------------|
| 位置 | 框的「內部」空間 | 框的「外部」空間 |
| 背景色 | 背景色會延伸到 padding 區域 | margin 區域透明 |
| 點擊區域 | padding 內可觸發點擊事件 | margin 區域無法點擊 |
| 元素間距 | 不適用（是元素內部空間） | 用於控制元素與元素之間的距離 |
| 按鈕內距 | ✅ 用 padding 增加按鈕點擊範圍 | ❌ 不宜用 margin |
| 段落間距 | ❌ 不宜用 padding | ✅ 用 margin 控制段落間距 |`,
        },
        {
          heading: 'outline 不佔空間的特性',
          content: `\`outline\` 和 \`border\` 視覺上相似，但有重要差異：

\`\`\`css
.focused {
  outline: 2px solid blue;
  /* outline 不影響元素佔用的空間，不會推擠其他元素 */
}

.bordered {
  border: 2px solid blue;
  /* border 佔用空間，影響 box model 計算 */
}
\`\`\`

**outline 的特點：**
- **不佔空間**：outline 繪製在 border 外層，但不影響佈局
- **不能設定各邊不同**：無法像 \`border-top\`、\`border-right\` 那樣分別設定
- **常用於 focus 樣式**：按鈕、連結的鍵盤 focus 指示
- **outline-offset**：可設定 outline 與元素邊緣的距離`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: '在預設的 box-sizing: content-box 下，一個元素設定 width: 100px、padding: 10px、border: 5px，實際佔用的寬度是多少？',
        options: [
          '100px',
          '120px',
          '130px',
          '110px',
        ],
        answer: 2,
        explanation: 'content-box 是預設值，width 只代表 content 的寬度。實際佔用寬度 = content(100) + padding*2(20) + border*2(10) = 130px。若要讓 width 涵蓋 padding 和 border，需改用 box-sizing: border-box。',
      },
      {
        id: 2,
        question: '以下關於 box-sizing: border-box 的說法，哪個正確？',
        options: [
          'width 只代表 content 的寬度，不含 padding 和 border',
          'width 代表 content + padding + border 的總寬度',
          'width 代表 content + margin 的總寬度',
          'border-box 是 box-sizing 的預設值',
        ],
        answer: 1,
        explanation: 'border-box 讓 width 涵蓋 content + padding + border，使佈局計算更直觀。例如 width: 200px、padding: 20px、border: 5px，content 實際寬度為 200 - 40 - 10 = 150px，整個元素佔用 200px（不含 margin）。content-box 才是預設值。',
      },
      {
        id: 3,
        question: '什麼是 margin collapse（外邊距折疊）？',
        options: [
          '水平方向的 margin 相加',
          '垂直方向的相鄰元素 margin 取較大值而非相加',
          'margin 設為 0 時消失的現象',
          'padding 和 margin 互相覆蓋的現象',
        ],
        answer: 1,
        explanation: 'margin collapse 指的是垂直方向的相鄰 block 元素，其間距取兩者 margin 的較大值而非相加。例如上方元素 margin-bottom: 30px、下方元素 margin-top: 20px，實際間距是 30px 而非 50px。margin collapse 只發生在垂直方向，水平方向不折疊。',
      },
      {
        id: 4,
        question: '背景色（background-color）會填充到哪些區域？',
        options: [
          '只填充 content 區域',
          '填充 content 和 padding 區域',
          '填充 content、padding 和 border 區域',
          '填充 content、padding、border 和 margin 區域',
        ],
        answer: 1,
        explanation: '背景色（background-color）會填充 content 和 padding 區域。border 區域取決於 border 樣式（如虛線 border 可透過縫隙看到背景色）。margin 是透明的，不顯示背景色。這也是為什麼增加 padding 可以讓按鈕的點擊區域更大，因為 padding 區域也能接收點擊事件。',
      },
      {
        id: 5,
        question: 'outline 和 border 最主要的差異是什麼？',
        options: [
          'outline 可以設定顏色，border 不行',
          'outline 不佔空間，不影響佈局；border 佔空間影響佈局',
          'outline 只能用在 focus 狀態',
          'border 不支援虛線樣式，outline 支援',
        ],
        answer: 1,
        explanation: 'outline 繪製在元素的 border 外側，但不佔用任何空間，不會影響周圍元素的佈局或觸發回流（reflow）。border 是 box model 的一部分，佔用空間。因此 outline 常用於 focus 指示器（如鍵盤導航），加上 outline 不會讓其他元素移位。',
      },
      {
        id: 6,
        question: '以下哪種方式可以解決父子元素之間的 margin collapse 問題？',
        options: [
          '給子元素加 margin: auto',
          '給父元素加 overflow: hidden（建立 BFC）',
          '給子元素加 display: inline',
          '給父元素加 margin: 0',
        ],
        answer: 1,
        explanation: '當父元素沒有 border 或 padding 隔離時，子元素的 margin-top 會和父元素的 margin-top 合併。給父元素加 overflow: hidden 可建立 BFC（Block Formatting Context），隔離內部佈局，阻止 margin collapse。也可以用 padding 或 border 隔離，或讓父元素成為 flex/grid container。',
      },
      {
        id: 7,
        question: '一個元素設定 box-sizing: border-box、width: 300px、padding: 30px、border: 10px，content 的實際寬度是多少？',
        options: [
          '300px',
          '220px',
          '260px',
          '240px',
        ],
        answer: 1,
        explanation: 'border-box 讓 width 涵蓋 content + padding + border。content 寬度 = 300 - padding*2(60) - border*2(20) = 220px。整個元素仍佔用 300px（不含 margin）。這是 border-box 的優勢：可以直接指定元素的視覺寬度，而不需要考慮 padding 和 border 的額外計算。',
      },
    ],
    keyPoints: [
      'Box Model 由內到外：content → padding → border → margin。',
      'content-box（預設）：width 只算 content；border-box：width 包含 content + padding + border。',
      'margin collapse：垂直相鄰元素的 margin 取較大值而非相加，只發生在垂直方向。',
      '背景色填充 content 和 padding，margin 是透明的。',
      'outline 不佔空間、不影響佈局，常用於 focus 樣式；border 佔空間影響 box model。',
    ],
  },

  // ─── 水平垂直置中的多種方法 ──────────────────────────────────────────────────
  {
    slug: 'css-centering',
    title: '水平垂直置中的多種方法',
    description: '掌握 Flexbox、Grid、absolute+transform 等多種置中技巧與適用場景',
    subCategory: '盒模型與佈局',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: 'Flexbox 置中',
          content: `最常用的置中方法，適合父元素控制子元素位置：

\`\`\`css
.parent {
  display: flex;
  justify-content: center; /* 水平置中（主軸方向）*/
  align-items: center;     /* 垂直置中（交叉軸方向）*/
}
\`\`\`

**優點：**
- 語法直觀，可讀性高
- 不需要知道子元素的寬高
- 可同時對多個子元素置中

**注意：** \`justify-content\` 和 \`align-items\` 的方向取決於 \`flex-direction\`：
- \`flex-direction: row\`（預設）：justify 水平、align 垂直
- \`flex-direction: column\`：justify 垂直、align 水平`,
        },
        {
          heading: 'Grid 置中',
          content: `Grid 提供更簡潔的置中語法：

\`\`\`css
/* 方法一：place-items 簡寫 */
.parent {
  display: grid;
  place-items: center; /* 同時設定 align-items + justify-items */
}

/* 方法二：展開寫法 */
.parent {
  display: grid;
  align-items: center;
  justify-items: center;
}

/* 方法三：子元素自行置中 */
.parent {
  display: grid;
}
.child {
  place-self: center;
}
\`\`\`

\`place-items: center\` 是最簡潔的置中方式之一，一行搞定。`,
        },
        {
          heading: 'absolute + transform 置中',
          content: `不依賴父元素 display 的置中方式，適合彈出層、Modal：

\`\`\`css
.parent {
  position: relative; /* 建立定位基準 */
}

.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* top/left 50% 讓元素左上角移到父元素中心 */
  /* translate(-50%, -50%) 再向左/上移動自身寬高的 50%，達成真正置中 */
}
\`\`\`

**為什麼需要 transform？**
- \`top: 50%; left: 50%\` 只把元素的「左上角」定位到父元素中央
- \`transform: translate(-50%, -50%)\` 讓元素向左移動自身寬度的 50%，向上移動自身高度的 50%
- 不需要知道子元素的具體寬高，動態尺寸也適用`,
        },
        {
          heading: 'absolute + margin auto 置中',
          content: `需要已知寬高的置中方式：

\`\`\`css
.parent {
  position: relative;
}

.child {
  position: absolute;
  inset: 0; /* 等同於 top: 0; right: 0; bottom: 0; left: 0; */
  margin: auto;
  width: 200px;  /* 必須設定 */
  height: 100px; /* 必須設定 */
}
\`\`\`

**原理：** \`inset: 0\` 讓四邊距都為 0，\`margin: auto\` 自動平均分配剩餘空間，達成置中。
**限制：** 必須知道子元素的 width 和 height。

**其他方法比較：**
| 方法 | 需知道尺寸 | 適用場景 |
|------|-----------|---------|
| Flexbox | ❌ 不需要 | 一般佈局 |
| Grid place-items | ❌ 不需要 | 單一元素置中 |
| absolute + transform | ❌ 不需要 | Modal、懸浮層 |
| absolute + margin auto | ✅ 需要 | 已知尺寸的覆蓋層 |`,
        },
        {
          heading: 'text-align: center 的適用範圍',
          content: `\`text-align: center\` 只對 inline 和 inline-block 元素有效：

\`\`\`css
/* ✅ 有效：置中 inline 文字 */
.container {
  text-align: center;
}
.container span { /* inline 元素 */ }

/* ✅ 有效：置中 inline-block 元素 */
.container {
  text-align: center;
}
.container .btn {
  display: inline-block;
}

/* ❌ 無效：無法置中 block 元素 */
.container {
  text-align: center;
}
.container div { /* block 元素，text-align 無效 */ }
\`\`\`

**水平置中 block 元素的正確方式：**
\`\`\`css
.block {
  width: 200px;
  margin: 0 auto; /* 左右 margin 各佔剩餘空間的一半 */
}
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: '使用 Flexbox 做水平垂直置中，需要設定哪些屬性？',
        options: [
          'display: flex; text-align: center; vertical-align: middle',
          'display: flex; justify-content: center; align-items: center',
          'display: flex; align-content: center; justify-items: center',
          'display: flex; margin: auto',
        ],
        answer: 1,
        explanation: 'Flexbox 置中需要在父元素設定：display: flex（啟用 flex 容器）、justify-content: center（主軸方向置中，預設水平）、align-items: center（交叉軸方向置中，預設垂直）。這三個屬性組合是最常用的置中寫法。',
      },
      {
        id: 2,
        question: 'Grid 中最簡潔的水平垂直置中寫法是？',
        options: [
          'display: grid; justify-content: center; align-content: center',
          'display: grid; margin: auto',
          'display: grid; place-items: center',
          'display: grid; place-content: center',
        ],
        answer: 2,
        explanation: 'place-items: center 是 align-items 和 justify-items 的簡寫，一行就能達成水平垂直置中，是最簡潔的 Grid 置中方式。place-content 是 align-content 和 justify-content 的簡寫，適合多行內容的置中，行為略有不同。',
      },
      {
        id: 3,
        question: '使用 absolute + transform 置中時，為什麼需要 transform: translate(-50%, -50%)？',
        options: [
          '讓元素旋轉到正確角度',
          'top: 50%; left: 50% 只把元素左上角定位到父元素中心，translate 再往左上移動自身尺寸的一半達成真正置中',
          '解決元素超出父容器邊界的問題',
          'translate 可以讓元素置中而不需要 top 和 left',
        ],
        answer: 1,
        explanation: 'top: 50%; left: 50% 會把元素的左上角移到父元素的中心點，但元素本身向右下延伸，所以還沒有真正置中。transform: translate(-50%, -50%) 讓元素向左移動自身寬度的 50%、向上移動自身高度的 50%，將元素的中心點對準父元素中心。這個方法不需要知道元素的具體寬高，很靈活。',
      },
      {
        id: 4,
        question: '使用 position: absolute; inset: 0; margin: auto 置中的限制是什麼？',
        options: [
          '只能在 flex 容器中使用',
          '必須設定子元素的 width 和 height，否則元素會撐滿父容器',
          '只適用於圖片元素',
          '不支援百分比的 width 和 height',
        ],
        answer: 1,
        explanation: 'absolute + margin auto 的原理是讓四邊距都為 0，再由 margin: auto 平均分配剩餘空間。若不設定 width 和 height，元素會撐滿父容器（inset: 0 讓四個方向都拉伸至父容器邊界），無法置中。因此這個方法必須明確指定元素尺寸。',
      },
      {
        id: 5,
        question: 'text-align: center 對以下哪種元素「沒有」置中效果？',
        options: [
          'span（inline 元素）',
          'display: inline-block 的元素',
          'div（block 元素）',
          '文字內容',
        ],
        answer: 2,
        explanation: 'text-align: center 只對 inline 和 inline-block 元素有效（置中它們在父容器中的水平位置）。div 是 block 元素，block 元素會佔滿整行寬度，text-align: center 對它的位置沒有影響。要水平置中 block 元素，應使用 margin: 0 auto 或 Flexbox/Grid。',
      },
      {
        id: 6,
        question: '在 flex-direction: column 的 Flex 容器中，justify-content: center 會讓子元素在哪個方向置中？',
        options: [
          '水平方向',
          '垂直方向',
          '同時水平和垂直方向',
          'justify-content 在 column 方向無效',
        ],
        answer: 1,
        explanation: 'justify-content 控制「主軸」方向的對齊，align-items 控制「交叉軸」方向。當 flex-direction: column 時，主軸是垂直方向，交叉軸是水平方向。因此 justify-content: center 在 column 方向是垂直置中，align-items: center 是水平置中。這和 row 方向（預設）剛好相反。',
      },
      {
        id: 7,
        question: '以下哪種置中方法「不需要」知道子元素的寬高？',
        options: [
          'position: absolute; inset: 0; margin: auto',
          'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)',
          'width: 200px; margin: 0 auto',
          '以上都需要',
        ],
        answer: 1,
        explanation: 'absolute + transform 的方法不需要知道子元素的尺寸，因為 transform: translate(-50%, -50%) 使用的是元素「自身」尺寸的百分比，瀏覽器會在運行時計算。absolute + margin auto 需要設定具體寬高，margin: 0 auto 需要設定 width。因此 absolute + transform 最靈活，適合動態尺寸的元素（如 Modal）。',
      },
      {
        id: 8,
        question: '要對一個已知寬高（200px × 100px）的 block 元素做水平置中，以下哪個方法正確？',
        options: [
          'text-align: center（設在父元素）',
          'margin: 0 auto（設在元素本身）',
          'display: inline; margin: 0 auto',
          'position: static; left: 50%',
        ],
        answer: 1,
        explanation: 'margin: 0 auto 設在 block 元素本身可實現水平置中：左右 margin 各自佔據剩餘空間的一半。前提是元素必須是 block 且有明確的 width。text-align: center 對 block 元素無效，inline 元素的 margin 水平方向無法用 auto。',
      },
    ],
    keyPoints: [
      'Flexbox 置中：父元素 display: flex + justify-content: center + align-items: center。',
      'Grid 置中：display: grid + place-items: center，是最簡潔的置中寫法。',
      'absolute + transform：top: 50%; left: 50%; transform: translate(-50%, -50%)，不需知道尺寸。',
      'absolute + margin auto：inset: 0; margin: auto，必須設定 width 和 height。',
      'text-align: center 只對 inline/inline-block 有效，block 元素用 margin: 0 auto。',
    ],
  },

  // ─── display 屬性差異 ──────────────────────────────────────────────────────
  {
    slug: 'css-display',
    title: 'display 屬性差異',
    description: '比較 inline、block、inline-block、flex、grid、none 的行為差異',
    subCategory: '盒模型與佈局',
    difficulty: 'easy',
    notes: {
      sections: [
        {
          heading: 'block vs inline vs inline-block 比較',
          content: `| 特性 | block | inline | inline-block |
|------|-------|--------|--------------|
| 是否換行 | ✅ 獨佔一行 | ❌ 不換行 | ❌ 不換行 |
| 可設 width/height | ✅ 可以 | ❌ 不可 | ✅ 可以 |
| 可設上下 margin | ✅ 可以 | ❌ 無效 | ✅ 可以 |
| 預設 width | 佔滿父容器 | 由內容決定 | 由內容決定 |
| 常見元素 | div, p, h1-h6, ul | span, a, strong, em | img, button（部分） |

**inline 的限制：**
\`\`\`css
span {
  width: 200px;   /* ❌ 無效 */
  height: 100px;  /* ❌ 無效 */
  margin-top: 20px;    /* ❌ 無效 */
  margin-bottom: 20px; /* ❌ 無效 */
  margin-left: 10px;   /* ✅ 有效 */
  margin-right: 10px;  /* ✅ 有效 */
  padding: 10px;  /* ✅ 有效，但上下 padding 可能覆蓋其他行 */
}
\`\`\``,
        },
        {
          heading: 'display: none vs visibility: hidden',
          content: `| 特性 | display: none | visibility: hidden |
|------|--------------|-------------------|
| 是否隱藏元素 | ✅ 完全隱藏 | ✅ 視覺隱藏 |
| 是否佔空間 | ❌ 不佔空間，其他元素填補 | ✅ 仍佔原本空間 |
| 子元素是否受影響 | ✅ 全部隱藏 | 子元素可用 visibility: visible 顯示 |
| 是否觸發重排（reflow） | ✅ 觸發（改變佈局） | ❌ 不觸發（只觸發重繪） |
| 動畫過渡 | ❌ 無法做 transition | ✅ 可以做 transition |

\`\`\`css
/* 常見誤用 */
.hidden { display: none; }     /* 完全移除，不佔空間 */
.invisible { visibility: hidden; } /* 透明但仍佔空間 */
.transparent { opacity: 0; }   /* 透明，仍佔空間，仍接收事件 */
\`\`\``,
        },
        {
          heading: 'display: flex 和 display: grid',
          content: `**flex** 和 **grid** 都建立新的 formatting context，子元素行為改變：

\`\`\`css
/* flex 容器 */
.flex-container {
  display: flex;
  /* 子元素自動變成 flex item，可以設定 flex 相關屬性 */
}

/* grid 容器 */
.grid-container {
  display: grid;
  /* 子元素自動變成 grid item */
}
\`\`\`

**重要：** flex/grid 容器的直接子元素的 \`float\`、\`clear\` 屬性會失效，因為已進入新的 formatting context。

\`\`\`css
/* inline-flex 和 inline-grid：容器本身是 inline，但內部是 flex/grid */
.inline-flex {
  display: inline-flex; /* 容器不換行，內部走 flex 佈局 */
}
\`\`\``,
        },
        {
          heading: '常見 display 值速查',
          content: `\`\`\`
block        → 佔整行，可設寬高（div, p, h1）
inline       → 不換行，不可設寬高（span, a）
inline-block → 不換行，可設寬高（img, button）
flex         → 建立 flex 容器
inline-flex  → inline + flex 容器
grid         → 建立 grid 容器
inline-grid  → inline + grid 容器
none         → 完全隱藏，不佔空間
contents     → 元素本身消失，子元素直接參與父容器佈局
table        → 表現如 <table>
\`\`\`

**display: contents 的特殊用途：**
\`\`\`css
/* 讓包裝元素「消失」，子元素直接繼承外層佈局 */
.wrapper {
  display: contents; /* wrapper 不產生盒子，子元素直接成為 flex item */
}
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: '以下哪個說法正確描述 inline 元素的行為？',
        options: [
          'inline 元素獨佔一行，可以設定 width 和 height',
          'inline 元素不換行，可以設定 width 但不能設定 height',
          'inline 元素不換行，width 和 height 設定無效，由內容決定大小',
          'inline 元素不換行，可以設定所有 margin',
        ],
        answer: 2,
        explanation: 'inline 元素（如 span、a）不會換行，寬高由內容決定，無法用 width 和 height 強制設定。上下 margin 對 inline 元素無效，只有左右 margin 有效。若需要讓 inline 元素可以設定寬高，改用 inline-block 或 block。',
      },
      {
        id: 2,
        question: 'display: none 和 visibility: hidden 的最主要差異是什麼？',
        options: [
          'display: none 可以做過渡動畫，visibility: hidden 不行',
          'display: none 讓元素完全消失不佔空間；visibility: hidden 隱藏元素但仍佔原來的空間',
          'display: none 只隱藏視覺，visibility: hidden 移除 DOM',
          '兩者完全相同，只是語法不同',
        ],
        answer: 1,
        explanation: 'display: none 讓元素從佈局中完全移除，其他元素會填補這個空間，並觸發 reflow。visibility: hidden 只是讓元素透明不可見，但仍佔據原有的空間，其他元素不會移動，只觸發 repaint（效能較好）。子元素可以用 visibility: visible 覆蓋顯示，這是 display: none 做不到的。',
      },
      {
        id: 3,
        question: 'inline-block 相比 inline 的額外能力是什麼？',
        options: [
          'inline-block 會獨佔一行，inline 不會',
          'inline-block 可以設定 width、height 和上下 margin，inline 不行',
          'inline-block 支援 float，inline 不支援',
          'inline-block 可以包含 block 元素，inline 不行',
        ],
        answer: 1,
        explanation: 'inline-block 結合了 inline 的「不換行」特性和 block 的「可設寬高」特性。相比 inline，inline-block 可以設定 width、height 和上下 margin/padding，不像 inline 那樣受到限制。常見用途：按鈕、導航連結等需要精確控制尺寸但又不要換行的元素。',
      },
      {
        id: 4,
        question: '以下哪些是 block 元素的預設行為？',
        options: [
          '不換行，寬度由內容決定',
          '獨佔一行，寬度預設撐滿父容器，可設寬高',
          '不換行，可設寬高',
          '獨佔一行，寬度由內容決定',
        ],
        answer: 1,
        explanation: 'block 元素（如 div、p、h1）的預設行為：1) 獨佔一行（前後自動換行）；2) 寬度預設撐滿父容器（width: auto）；3) 可以設定 width、height、margin、padding。常見 block 元素包含 div、p、h1-h6、ul、ol、li、section、article。',
      },
      {
        id: 5,
        question: '在 display: flex 的容器中，子元素的 float 屬性會怎樣？',
        options: [
          '正常運作，可以讓子元素浮動',
          'float 失效，因為 flex 建立了新的 formatting context',
          'float 只在某些瀏覽器中失效',
          'float 會讓子元素脫離 flex 佈局',
        ],
        answer: 1,
        explanation: 'flex 容器建立了新的 Flex Formatting Context（FFC），在這個上下文中，float、clear 等傳統佈局屬性對直接子元素（flex item）失效。flex item 的位置由 flex 規則（justify-content、align-items、flex 等）決定，而非 float。這也是 flex 佈局比 float 佈局更可預測的原因。',
      },
      {
        id: 6,
        question: '以下哪個 display 值可以讓元素「視覺上消失」但「仍佔空間」且「仍可接收滑鼠事件」？',
        options: [
          'display: none',
          'visibility: hidden',
          'opacity: 0',
          'display: contents',
        ],
        answer: 2,
        explanation: 'opacity: 0 讓元素完全透明，但它仍然存在於佈局中、仍佔空間，且仍可以接收滑鼠事件（hover、click 等）。這和 visibility: hidden（仍佔空間但不接收事件）、display: none（不佔空間不接收事件）都不同。如果要隱藏元素但需要它在特定互動時仍可響應，可搭配 pointer-events 控制。',
      },
      {
        id: 7,
        question: 'img 元素預設的 display 值是什麼？',
        options: [
          'block',
          'inline',
          'inline-block',
          'flex',
        ],
        answer: 2,
        explanation: 'img 元素的預設 display 是 inline-block（replaced inline element）。這讓 img 不換行，但可以設定 width 和 height。由於 img 是 inline 元素，它放在文字中時會和文字的 baseline 對齊，有時會在底部產生意外的間距，常見解法是設定 display: block 或 vertical-align: bottom。',
      },
    ],
    keyPoints: [
      'block：獨佔一行，撐滿父容器，可設寬高（div, p, h1）。',
      'inline：不換行，寬高由內容決定，不可設 width/height 和上下 margin（span, a）。',
      'inline-block：不換行，可設寬高和上下 margin（img, button）。',
      'display: none 不佔空間觸發 reflow；visibility: hidden 佔空間只觸發 repaint。',
      'flex/grid 容器讓子元素進入新的 formatting context，float 等傳統屬性對子元素失效。',
    ],
  },

  // ─── Block Formatting Context (BFC) ──────────────────────────────────────
  {
    slug: 'css-bfc',
    title: 'Block Formatting Context (BFC)',
    description: '了解 BFC 的觸發條件、隔離特性，以及解決 margin collapse 和 float 塌陷的應用',
    subCategory: '盒模型與佈局',
    difficulty: 'hard',
    notes: {
      sections: [
        {
          heading: '什麼是 BFC？',
          content: `BFC（Block Formatting Context，塊格式化上下文）是一個**獨立的渲染區域**，內部的佈局不會影響外部，外部也不會影響內部。

可以把 BFC 想像成一個「隔離箱」：
- 箱子內的 float 不影響箱子外的元素
- 箱子內的 margin collapse 不會延伸到箱子外
- 箱子本身不會和相鄰的 float 元素重疊

**BFC 的特性：**
1. 內部的 block 元素垂直排列
2. 同一個 BFC 中，垂直相鄰的 block 元素 margin 可能折疊（collapse）
3. BFC 的範圍包含內部所有的 float 元素（解決 float 塌陷）
4. BFC 不會和相鄰的 float 元素重疊
5. 不同 BFC 中的元素 margin 不會折疊`,
        },
        {
          heading: '觸發 BFC 的方式',
          content: `以下任一條件都可觸發元素形成 BFC：

| 屬性 | 值 |
|------|-----|
| \`overflow\` | \`hidden\`、\`auto\`、\`scroll\`（非 visible） |
| \`display\` | \`flex\`、\`inline-flex\`、\`grid\`、\`inline-grid\`、\`inline-block\`、\`table\`、\`table-cell\`、\`flow-root\` |
| \`position\` | \`absolute\`、\`fixed\` |
| \`float\` | 非 \`none\` |
| \`contain\` | \`layout\`、\`content\`、\`paint\` |

**最推薦的方式：**
\`\`\`css
/* display: flow-root 是專門設計用來建立 BFC 的現代方法 */
.bfc-container {
  display: flow-root;
}
\`\`\`

\`display: flow-root\` 沒有副作用，不像 \`overflow: hidden\` 可能裁切內容。`,
        },
        {
          heading: 'BFC 解決 margin collapse',
          content: `父子元素的 margin 折疊問題及解決方案：

\`\`\`html
<div class="parent">
  <div class="child">子元素</div>
</div>
\`\`\`

\`\`\`css
/* 問題：子元素的 margin-top 穿透到父元素外 */
.parent { background: lightblue; }
.child { margin-top: 50px; } /* 這個 margin 會作用在 parent 上！*/

/* 解決方案一：父元素建立 BFC */
.parent {
  overflow: hidden;  /* 或 display: flow-root */
}

/* 解決方案二：父元素加 padding 或 border 隔離 */
.parent {
  padding-top: 1px;
  /* 或 border-top: 1px solid transparent; */
}
\`\`\`

**不同 BFC 中的元素 margin 不會折疊**，這是 BFC 解決 margin collapse 的根本原理。`,
        },
        {
          heading: 'BFC 解決 float 塌陷',
          content: `Float 元素脫離文件流，父容器高度塌陷問題：

\`\`\`css
/* 問題：float 子元素導致父容器高度為 0 */
.parent {
  background: lightblue;
  /* 高度塌陷，看不見背景色 */
}
.child {
  float: left;
  height: 100px;
}

/* 解決方案一：父元素建立 BFC */
.parent {
  overflow: hidden; /* BFC 會包含內部 float 元素 */
}

/* 解決方案二：clearfix（傳統方法）*/
.parent::after {
  content: '';
  display: table; /* 或 block */
  clear: both;
}

/* 解決方案三：現代方法 */
.parent {
  display: flow-root; /* 專門設計來包含 float */
}
\`\`\``,
        },
        {
          heading: 'BFC 防止元素被 float 覆蓋',
          content: `Float 元素旁邊的非 float 元素可能被覆蓋：

\`\`\`html
<div class="container">
  <div class="float">浮動元素</div>
  <div class="content">被浮動元素遮蓋的內容</div>
</div>
\`\`\`

\`\`\`css
.float { float: left; width: 100px; height: 100px; }

/* 問題：.content 可能和 .float 重疊 */
.content { background: pink; }

/* 解決方案：讓 .content 建立 BFC */
.content {
  overflow: hidden; /* BFC 區域不與 float 重疊 */
  background: pink;
}
\`\`\`

這個特性常用於建立「float 左側 + BFC 右側」的兩欄佈局，類似現代 Grid/Flex 佈局的效果。`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: '以下哪個 CSS 屬性值「不會」觸發 BFC？',
        options: [
          'overflow: hidden',
          'position: absolute',
          'display: block',
          'float: left',
        ],
        answer: 2,
        explanation: 'display: block 是一般的 block 元素，不會觸發 BFC。觸發 BFC 的方式包含：overflow（非 visible）、position（absolute 或 fixed）、float（非 none）、display: flex/grid/inline-block/flow-root 等。普通的 block 元素屬於正常文件流，不形成獨立的格式化上下文。',
      },
      {
        id: 2,
        question: 'BFC 的最重要特性是什麼？',
        options: [
          '讓元素可以設定 width 和 height',
          '讓元素浮動（float）',
          '建立獨立的渲染區域，內部佈局不影響外部，外部不影響內部',
          '讓元素垂直置中',
        ],
        answer: 2,
        explanation: 'BFC 的核心特性是「獨立性」：建立一個隔離的格式化上下文，內部的 float、margin collapse 等不會洩漏到外部，外部的也不會影響內部。這個特性讓 BFC 成為解決 margin collapse、float 塌陷、元素重疊等問題的有效工具。',
      },
      {
        id: 3,
        question: '父元素沒有設定 padding/border，子元素的 margin-top 發生「穿透」，最根本的解決方式是？',
        options: [
          '給子元素加 position: absolute',
          '給父元素建立 BFC（如 overflow: hidden 或 display: flow-root）',
          '給子元素加 display: flex',
          '把子元素的 margin-top 改成 padding-top',
        ],
        answer: 1,
        explanation: '父子 margin collapse 的原因是父元素和子元素在同一個 BFC 中。建立 BFC 後，父元素形成獨立的格式化上下文，子元素的 margin 不再洩漏到父元素外。overflow: hidden 或 display: flow-root 都可以觸發 BFC，其中 flow-root 沒有副作用，是更推薦的做法。',
      },
      {
        id: 4,
        question: '為什麼 float 元素會讓父容器高度塌陷？BFC 如何解決？',
        options: [
          'float 元素佔據了父容器的空間，BFC 可以清除 float',
          'float 元素脫離文件流，父容器無法感知其高度；BFC 的規範要求容器必須包含其內部的 float 元素',
          'float 元素的 margin 折疊導致塌陷，BFC 阻止 margin 折疊',
          'float 讓元素 display 變成 none，BFC 恢復 display',
        ],
        answer: 1,
        explanation: 'float 元素脫離文件流（normal flow），父容器在計算高度時不把 float 子元素計算在內，導致父容器高度塌陷。當父容器建立 BFC 後，根據 BFC 的規範：「BFC 的高度計算必須包含其內部的 float 元素」，因此 BFC 容器能夠正確包含 float 子元素，解決塌陷問題。',
      },
      {
        id: 5,
        question: '以下哪個方式觸發 BFC 沒有副作用，是最推薦的現代做法？',
        options: [
          'overflow: hidden（可能裁切超出的內容）',
          'float: left（讓容器本身也浮動，影響佈局）',
          'display: flow-root（專門設計，無副作用）',
          'position: absolute（脫離文件流，影響其他元素）',
        ],
        answer: 2,
        explanation: 'display: flow-root 是 CSS Display Level 3 中專門設計來建立 BFC 的值，沒有任何視覺副作用。overflow: hidden 可能裁切超出容器的內容；float 讓元素本身也浮動；position: absolute 讓元素脫離文件流。flow-root 是最乾淨的 BFC 觸發方式。',
      },
      {
        id: 6,
        question: '兩個相鄰 div，div.a 的 margin-bottom: 40px，div.b 的 margin-top: 20px，兩者之間的實際距離是多少？',
        options: [
          '60px（40 + 20）',
          '40px（取較大值）',
          '20px（取較小值）',
          '0px（互相抵消）',
        ],
        answer: 1,
        explanation: 'margin collapse 在垂直相鄰的 block 元素之間取較大值而非相加。div.a 的 margin-bottom 是 40px，div.b 的 margin-top 是 20px，兩者折疊後取較大值 40px。若兩者在不同 BFC 中，則不會折疊，距離為 60px。',
      },
      {
        id: 7,
        question: '以下哪個 CSS 屬性設定可以讓某個 block 元素「不被相鄰的 float 元素覆蓋」？',
        options: [
          '設定 clear: both',
          '設定 overflow: hidden 建立 BFC',
          '設定 position: static',
          '設定 display: block（它本來就是 block）',
        ],
        answer: 1,
        explanation: 'BFC 的特性之一：BFC 區域不與相鄰的 float 元素重疊。給 block 元素設定 overflow: hidden（或其他觸發 BFC 的方式），它會自動避開相鄰的 float 元素，形成「旁邊有 float 左欄、這邊是 BFC 右欄」的兩欄佈局。clear: both 是在 float 元素「後面」清除浮動影響，作用不同。',
      },
      {
        id: 8,
        question: '以下哪個 CSS 屬性值「不會」觸發 BFC？',
        options: [
          'display: inline-block',
          'overflow: scroll',
          'position: fixed',
          'position: relative',
        ],
        answer: 3,
        explanation: 'position: relative 只是讓元素相對於自身原始位置偏移，不會觸發 BFC，元素仍在普通文件流中。觸發 BFC 需要 position: absolute 或 position: fixed。display: inline-block、overflow: scroll（非 visible）、position: fixed 都會觸發 BFC。',
      },
    ],
    keyPoints: [
      'BFC 是獨立的渲染區域，內部佈局不影響外部，可解決 margin collapse 和 float 塌陷。',
      '觸發 BFC：overflow（非 visible）、display: flex/grid/inline-block/flow-root、position: absolute/fixed、float（非 none）。',
      'display: flow-root 是最推薦的 BFC 觸發方式，無副作用。',
      'BFC 解決 float 塌陷：BFC 容器的高度計算包含其內部的 float 元素。',
      'BFC 防止元素被 float 覆蓋：可用於建立傳統兩欄佈局。',
    ],
  },

  // ─── CSS 選擇器種類與差異 ──────────────────────────────────────────────────
  {
    slug: 'css-selectors',
    title: 'CSS 選擇器種類與差異',
    description: '掌握基本選擇器、組合選擇器（後代/子代/相鄰/同層）的行為差異',
    subCategory: '選擇器與優先級',
    difficulty: 'easy',
    notes: {
      sections: [
        {
          heading: '基本選擇器',
          content: `| 選擇器 | 語法 | 說明 |
|--------|------|------|
| 類型選擇器 | \`div\` | 選取所有該標籤元素 |
| class 選擇器 | \`.classname\` | 選取有該 class 的元素，可複用 |
| id 選擇器 | \`#idname\` | 選取該 id 的元素，頁面唯一 |
| 通用選擇器 | \`*\` | 選取所有元素 |
| 屬性選擇器 | \`[type="text"]\` | 選取有指定屬性的元素 |

**class vs id 的差異：**
\`\`\`css
/* class 可以複用，多個元素可以有同一個 class */
.btn { color: blue; }

/* id 在頁面中應唯一，只有一個元素應有該 id */
#header { position: fixed; }

/* 一個元素可以有多個 class */
<div class="btn btn-primary btn-large">...</div>
\`\`\``,
        },
        {
          heading: '組合選擇器：後代 vs 子代',
          content: `\`\`\`css
/* 後代選擇器（空格）：選取所有後代，不論深度 */
div section {
  /* 選取 div 內所有的 section，包含多層巢狀的 */
}

/* 子代選擇器（>）：只選取「直接子元素」*/
div > section {
  /* 只選取 div 的直接子元素 section，不含孫子層以下 */
}
\`\`\`

\`\`\`html
<div>
  <section>✅ 後代 ✅ 子代</section>
  <article>
    <section>✅ 後代 ❌ 子代（是 article 的子元素，不是 div 的）</section>
  </article>
</div>
\`\`\`

**效能考量：** 後代選擇器（空格）因為需要往上追溯所有祖先，效能比子代選擇器（>）差。建議在巢狀元素較深時使用子代選擇器。`,
        },
        {
          heading: '組合選擇器：相鄰兄弟 vs 一般兄弟',
          content: `\`\`\`css
/* 相鄰兄弟選擇器（+）：緊接在後的相鄰兄弟元素 */
div + section {
  /* 選取「緊接在 div 之後」的 section */
}

/* 一般兄弟選擇器（~）：之後所有的同層兄弟 */
div ~ section {
  /* 選取「在 div 之後」的所有同層 section */
}
\`\`\`

\`\`\`html
<div></div>     <!-- 參考元素 -->
<section></section>  <!-- ✅ + 和 ~ 都選 -->
<p></p>
<section></section>  <!-- ❌ + 不選（不是緊鄰），✅ ~ 選 -->
\`\`\`

**實用場景：**
\`\`\`css
/* label 後面緊跟著的 input 加樣式 */
label + input { border-color: blue; }

/* checkbox 選取後，同層所有 label 改色（CSS-only Toggle）*/
input:checked ~ label { color: green; }
\`\`\``,
        },
        {
          heading: '屬性選擇器',
          content: `\`\`\`css
[type]              /* 有 type 屬性的元素 */
[type="text"]       /* type 屬性值等於 "text" */
[href^="https"]     /* href 屬性值以 "https" 開頭 */
[href$=".pdf"]      /* href 屬性值以 ".pdf" 結尾 */
[class*="btn"]      /* class 屬性值包含 "btn" 字串 */
[lang|="zh"]        /* lang 屬性值等於 "zh" 或以 "zh-" 開頭 */
[class~="active"]   /* class 屬性值中有 "active"（以空格分隔的詞）*/
\`\`\`

**實用範例：**
\`\`\`css
/* 讓所有外部連結顯示小圖示 */
a[href^="https://"][target="_blank"]::after {
  content: ' ↗';
}

/* PDF 下載連結 */
a[href$=".pdf"] {
  background-image: url(pdf-icon.svg);
}
\`\`\``,
        },
        {
          heading: 'class 多重選擇器',
          content: `\`\`\`css
/* 同時有 .a 和 .b 兩個 class（無空格）*/
.a.b { }
/* 選取 <div class="a b"> */

/* 後代選擇器（有空格）*/
.a .b { }
/* 選取「有 .a class 的元素內部」有 .b class 的元素 */

/* 標籤 + class（無空格）*/
div.a.b { }
/* 選取同時有 .a 和 .b 的 div 元素 */
\`\`\`

**常見混淆面試題：**
\`\`\`css
/* 這選的是什麼？*/
div.container .item > span + p { }

/* 解析：
  div.container  → 同時是 div 且有 class="container" 的元素
  （空格） .item  → 其後代中有 class="item" 的元素
  > span          → .item 的直接子元素 span
  + p             → 緊接在 span 之後的 p 元素
*/
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: '以下哪個選擇器可以選取「div 下任意深度的所有 section 元素」？',
        options: [
          'div > section',
          'div + section',
          'div section',
          'div ~ section',
        ],
        answer: 2,
        explanation: 'div section（空格）是後代選擇器，選取 div 內所有的 section，包含直接子元素、孫子、曾孫等任意深度。div > section 只選直接子元素（子代選擇器）；div + section 選緊接在 div 後的相鄰兄弟 section；div ~ section 選 div 之後所有同層的 section。',
      },
      {
        id: 2,
        question: 'div > section 和 div section 的差異是什麼？',
        options: [
          '兩者完全相同，只是語法不同',
          'div > section 只選 div 的直接子元素 section；div section 選所有後代 section',
          'div > section 選所有後代；div section 只選直接子元素',
          'div > section 選擇相鄰兄弟元素',
        ],
        answer: 1,
        explanation: '> 是子代選擇器，只選取直接子元素（第一層子元素）。空格是後代選擇器，選取任意深度的子孫元素。例如 div > section 不選 <div><p><section>...</section></p></div> 裡的 section（因為 section 是 p 的子元素，不是 div 的直接子元素），但 div section 會選取它。',
      },
      {
        id: 3,
        question: 'div + section 和 div ~ section 的差異是什麼？',
        options: [
          '兩者都選取所有兄弟 section',
          'div + section 選緊接在後的一個 section；div ~ section 選之後所有的 section',
          'div + section 選之前的 section；div ~ section 選之後的',
          '+ 選後代，~ 選兄弟',
        ],
        answer: 1,
        explanation: '+ 是相鄰兄弟選擇器，只選緊接在目標元素「正後方」的一個兄弟元素。~ 是一般兄弟選擇器，選目標元素之後所有符合的兄弟元素（不限緊接）。若 div 和 section 之間有其他元素，+ 就選不到，但 ~ 仍可選到後面的 section。',
      },
      {
        id: 4,
        question: '選擇器 .a.b（無空格）代表什麼？',
        options: [
          '選取有 .a class 的元素的子元素中有 .b 的元素',
          '選取同時有 .a 和 .b 兩個 class 的元素',
          '選取 .a 或 .b 其中一個 class 的元素',
          '選取 .a 元素的相鄰兄弟 .b 元素',
        ],
        answer: 1,
        explanation: '.a.b（直接連寫，無空格）選取同時擁有 class="a" 和 class="b" 的元素，例如 <div class="a b">。.a .b（有空格）則是後代選擇器，選取有 .a class 的元素內部有 .b class 的元素。這個差異很常見於面試考題。',
      },
      {
        id: 5,
        question: '屬性選擇器 [href^="https"] 的作用是什麼？',
        options: [
          '選取 href 屬性值包含 "https" 的元素',
          '選取 href 屬性值以 "https" 開頭的元素',
          '選取 href 屬性值以 "https" 結尾的元素',
          '選取 href 屬性值等於 "https" 的元素',
        ],
        answer: 1,
        explanation: '屬性選擇器的各種匹配方式：^ 表示「開頭」，$ 表示「結尾」，* 表示「包含」，= 表示「完全等於」。因此 [href^="https"] 選取 href 開頭為 "https" 的元素（即 HTTPS 連結）；[href$=".pdf"] 選 PDF 連結；[href*="example"] 選 href 中包含 "example" 的元素。',
      },
      {
        id: 6,
        question: 'id 選擇器（#id）和 class 選擇器（.class）最主要的使用差異是什麼？',
        options: [
          'id 選擇器效能較差，應避免使用',
          'id 在頁面中應唯一（只能用一次），class 可複用於多個元素',
          'id 只能用在 JavaScript，class 只能用在 CSS',
          '兩者完全相同，只是命名慣例不同',
        ],
        answer: 1,
        explanation: 'id 的設計語意是頁面唯一標識符，每個頁面上一個 id 值只應出現一次（雖然技術上可以重複，但違反 HTML 規範）。class 可以在多個元素上使用，也可以在一個元素上設多個 class。CSS 開發通常偏向使用 class 做樣式（更靈活可複用），id 保留給 JavaScript 操作或頁面錨點（#section）。',
      },
      {
        id: 7,
        question: '以下選擇器 input:checked ~ label 的作用是什麼？',
        options: [
          '選取 input 元素內部的 label',
          '選取緊接在 input 之後的 label',
          '選取在「被選取的 input」之後所有同層的 label',
          '選取所有有 checked 屬性的 label',
        ],
        answer: 2,
        explanation: ':checked 是偽類，在 checkbox 或 radio button 被選取時生效。~ 是一般兄弟選擇器，選取之後所有同層兄弟元素。因此 input:checked ~ label 的意思是：當 input 處於選取狀態時，選取其後所有同層的 label 元素。這個技巧常用於實作 CSS-only 的 toggle 開關效果。',
      },
    ],
    keyPoints: [
      '後代選擇器（空格）：選取任意深度的後代；子代選擇器（>）：只選直接子元素。',
      '相鄰兄弟（+）：緊接在後的一個兄弟；一般兄弟（~）：之後所有的兄弟元素。',
      '.a.b（無空格）：同時有兩個 class；.a .b（有空格）：後代選擇器。',
      '屬性選擇器：^= 開頭、$= 結尾、*= 包含、= 等於。',
      'id 頁面唯一，class 可複用；CSS 開發推薦主要用 class。',
    ],
  },

  // ─── CSS 權重（Specificity）────────────────────────────────────────────────
  {
    slug: 'css-specificity',
    title: 'CSS 權重（Specificity）',
    description: '理解 CSS 優先級計算規則（inline style > id > class > element），解決樣式衝突',
    subCategory: '選擇器與優先級',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: '權重計算規則',
          content: `CSS 優先級使用四位數計算（從高到低）：

| 類型 | 權重 | 範例 |
|------|------|------|
| \`!important\` | 最高（覆蓋所有） | \`color: red !important\` |
| Inline style | (1,0,0,0) | \`style="color: red"\` |
| ID 選擇器 | (0,1,0,0) | \`#header\` |
| Class / 偽類 / 屬性選擇器 | (0,0,1,0) | \`.btn\`, \`:hover\`, \`[type]\` |
| 元素 / 偽元素 | (0,0,0,1) | \`div\`, \`::before\` |
| 通用選擇器 / 組合符 | (0,0,0,0) | \`*\`, \`>\`, \`+\`, \`~\` |

**計算範例：**
\`\`\`css
div                   /* (0,0,0,1) */
.btn                  /* (0,0,1,0) */
div.btn               /* (0,0,1,1) */
#header               /* (0,1,0,0) */
#header .nav a:hover  /* (0,1,1,1) */
style=""              /* (1,0,0,0) */
\`\`\``,
        },
        {
          heading: '相同權重：後面覆蓋前面',
          content: `當兩個選擇器權重相同，後定義的樣式覆蓋先定義的：

\`\`\`css
/* 兩者權重相同 (0,0,1,0) */
.btn { color: blue; }
.btn { color: red; }  /* ← 這個生效，因為在後面 */

/* 載入順序也很重要 */
/* style.css */
.btn { color: blue; }

/* theme.css（後載入）*/
.btn { color: red; } /* ← 這個生效 */
\`\`\`

**實務影響：** CSS Modules、CSS-in-JS、Tailwind 等工具的樣式衝突問題，很多時候都是載入順序造成的。`,
        },
        {
          heading: '!important 的作用與危險性',
          content: `\`!important\` 可以覆蓋所有正常的優先級規則：

\`\`\`css
.btn { color: blue !important; }
#header .btn { color: red; } /* 就算 id 選擇器權重更高，仍被 !important 覆蓋 */
\`\`\`

**!important 的問題：**
1. **可維護性差**：打破了正常的優先級規則，難以追蹤
2. **滾雪球效應**：一旦使用，往往需要更多 !important 才能覆蓋
3. **偵錯困難**：難以找出樣式為何不生效

**可接受的使用場景：**
- 公用 CSS 框架的 utility class（如 Tailwind 的 !text-red-500）
- 強制覆蓋第三方元件庫的樣式
- \`display: none !important\`（確保元素隱藏不被覆蓋）`,
        },
        {
          heading: ':is() 和 :not() 的權重計算',
          content: `\`:is()\` 和 \`:not()\` 的權重等同於括號內「最高權重的選擇器」：

\`\`\`css
/* :is() 的權重 */
:is(div, .btn, #header) p {
  /* 括號內最高權重是 #header (0,1,0,0) */
  /* 整體權重 = (0,1,0,1)，不是 (0,0,0,2) */
}

/* :not() 的權重 */
a:not(#special) {
  /* :not 括號內最高是 #special (0,1,0,0) */
  /* 整體權重 = (0,1,0,1) */
}

/* :where() 的權重永遠是 0 */
:where(div, .btn, #header) p {
  /* 整體權重 = (0,0,0,1)，括號內不計入 */
}
\`\`\`

**:where() vs :is() 的選擇：** 當你想要選取元素但不增加優先級時，使用 \`:where()\`。`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: '以下選擇器的權重從高到低排列，哪個順序正確？',
        options: [
          '#id > .class > div > *',
          '.class > #id > div > *',
          'div > .class > #id > *',
          '#id = .class > div > *',
        ],
        answer: 0,
        explanation: 'CSS 優先級由高到低：ID 選擇器(0,1,0,0) > class/偽類/屬性選擇器(0,0,1,0) > 元素選擇器(0,0,0,1) > 通用選擇器/組合符(0,0,0,0)。因此 #id > .class > div > * 是正確順序。Inline style 和 !important 比 ID 還高。',
      },
      {
        id: 2,
        question: '選擇器 #header .nav a:hover 的權重是多少？',
        options: [
          '(0,0,0,4)',
          '(0,1,1,1)',
          '(0,1,2,1)',
          '(1,0,0,0)',
        ],
        answer: 1,
        explanation: '逐一計算：#header 是 ID 選擇器 (0,1,0,0)；.nav 是 class 選擇器 (0,0,1,0)；a 是元素選擇器 (0,0,0,1)；:hover 是偽類 (0,0,1,0)。總計：(0, 1, 1+1, 1) = (0,1,2,1)。',
      },
      {
        id: 3,
        question: '以下哪個說法正確描述 !important 的問題？',
        options: [
          '!important 只能用於 inline style',
          '!important 會打破正常的優先級規則，造成維護困難和「滾雪球效應」',
          '!important 可以提升選擇器的 specificity 值',
          '!important 只在同一個 CSS 檔案中有效',
        ],
        answer: 1,
        explanation: '!important 覆蓋所有正常的 specificity 規則，這會導致：1）難以理解為什麼某個樣式沒有生效；2）要覆蓋 !important 只能用另一個 !important，形成滾雪球效應；3）測試和維護困難。最佳實踐是盡量避免使用，若必要才用在工具 class 或覆蓋第三方庫。',
      },
      {
        id: 4,
        question: '以下兩個選擇器都指向同一個元素，哪個樣式最終生效？',
        options: [
          '.nav-link { color: red; }（先定義）',
          'a.nav-link { color: blue; }（後定義）',
          '兩者權重相同，後定義的 blue 生效',
          '取決於 HTML 中的屬性',
        ],
        answer: 1,
        explanation: '.nav-link 的權重是 (0,0,1,0)；a.nav-link 的權重是 (0,0,1,1)（class + element），權重更高。因此無論定義順序，a.nav-link 的 color: blue 會覆蓋 .nav-link 的 color: red。當權重不同時，由高到低決定，後定義只在「相同權重」時才有決定作用。',
      },
      {
        id: 5,
        question: '以下兩個規則同時套用在同一個元素，哪個生效？',
        options: [
          '.active { color: green; }（權重較低）',
          '#app .active { color: blue; }（權重較高）',
          '後定義的生效',
          '前定義的生效',
        ],
        answer: 1,
        explanation: '.active 的權重是 (0,0,1,0)；#app .active 的權重是 (0,1,1,0)（ID + class），明顯高於前者。因此 color: blue 生效。這是 ID 選擇器被認為「太強」的原因：一個 #id 可以輕易壓過很多個 class 的組合，BEM 等命名方法論就是為了避免使用 ID 選擇器做樣式。',
      },
      {
        id: 6,
        question: ':is() 和 :where() 在權重計算上有什麼差異？',
        options: [
          '兩者完全相同，都不計入權重',
          ':is() 的權重等同括號內最高的選擇器；:where() 的權重永遠是 0',
          ':where() 的權重等同括號內最高的選擇器；:is() 的權重永遠是 0',
          '兩者都計入括號內最高選擇器的權重',
        ],
        answer: 1,
        explanation: ':is() 的優先級等同括號內最高的選擇器，例如 :is(#id, .class) 的權重是 (0,1,0,0)（因為 #id 最高）。:where() 是「零優先級」的選擇器，括號內的選擇器不影響整體 specificity，永遠為 0。:where() 適合寫低優先級的基礎樣式，便於後續覆蓋。',
      },
      {
        id: 7,
        question: '以下哪個場景「較合理地」使用 !important？',
        options: [
          '我想讓自己的 class 比其他 class 優先',
          '強制覆蓋第三方 UI 元件庫難以修改的預設樣式',
          '解決所有 CSS 優先級衝突',
          '在每個 CSS 屬性後面加 !important 確保一致性',
        ],
        answer: 1,
        explanation: '!important 合理的使用場景包含：1）強制覆蓋第三方庫（無法修改源碼）的特定樣式；2）utility class（如 .hidden { display: none !important; }）確保不被意外覆蓋；3）確保某些 accessibility 相關樣式生效。用於解決「我的 class 不夠高」的一般問題是錯誤的，應該優化選擇器結構。',
      },
      {
        id: 8,
        question: '以下哪個選擇器的組合權重最高？',
        options: [
          '.a.b.c（三個 class）',
          'div > span + p（三個元素）',
          '#main（一個 ID）',
          '.a.b.c.d.e.f.g.h.i.j（十個 class）',
        ],
        answer: 2,
        explanation: '#main 是 ID 選擇器，權重 (0,1,0,0)。.a.b.c 是三個 class，權重 (0,0,3,0)。十個 class 是 (0,0,10,0)。一個 ID 的權重是 (0,1,0,0)，換算成十進位是 100，而十個 class 的 (0,0,10,0) 只有 10。在四位數系統中，只要更高位的數字大於 0，低位無論多大都無法超越。一個 ID 比任意多個 class 組合的權重都高。',
      },
    ],
    keyPoints: [
      '優先級由高到低：!important > inline style(1,0,0,0) > ID(0,1,0,0) > class/偽類(0,0,1,0) > element(0,0,0,1)。',
      '相同權重時，後定義的樣式覆蓋先定義的。',
      '!important 破壞優先級系統，應盡量避免，只在覆蓋第三方庫等必要情況使用。',
      ':is() 的權重等同括號內最高的選擇器；:where() 的權重永遠為 0。',
      '一個 ID 選擇器的權重高於任意多個 class 組合，這是避免在元件樣式中用 ID 的原因。',
    ],
  },

  // ─── 偽元素與偽類別 ────────────────────────────────────────────────────────
  {
    slug: 'css-pseudo-elements',
    title: '偽元素與偽類別',
    description: '區分 ::before / ::after 偽元素與 :hover / :nth-child 等偽類別的用法',
    subCategory: '選擇器與優先級',
    difficulty: 'easy',
    notes: {
      sections: [
        {
          heading: '偽元素（Pseudo-element）',
          content: `偽元素用雙冒號 \`::\` 表示（CSS3 後規範，但單冒號 : 舊語法仍可用於向後相容）。

偽元素選取元素的「特定部分」或「插入虛擬內容」：

| 偽元素 | 說明 |
|--------|------|
| \`::before\` | 在元素內容「之前」插入虛擬內容，需設 content 屬性 |
| \`::after\` | 在元素內容「之後」插入虛擬內容，需設 content 屬性 |
| \`::placeholder\` | 選取 input 的 placeholder 文字 |
| \`::first-line\` | 選取區塊元素的第一行文字 |
| \`::first-letter\` | 選取區塊元素的第一個字母 |
| \`::selection\` | 選取使用者用滑鼠反白的文字 |

**重要：** \`::before\` 和 \`::after\` 必須設定 \`content\` 屬性才會顯示（可以是空字串 \`content: ""\`）。`,
        },
        {
          heading: '::before 和 ::after 的用法',
          content: `\`\`\`css
/* 基本用法：插入文字內容 */
.required::after {
  content: " *";
  color: red;
}

/* 純裝飾：content 設為空字串 */
.btn::before {
  content: "";
  display: block;
  width: 20px;
  height: 20px;
  background-color: blue;
}

/* clearfix：用 ::after 清除 float */
.clearfix::after {
  content: "";
  display: table;
  clear: both;
}

/* 計數器 */
.list-item::before {
  content: counter(item) ". ";
  counter-increment: item;
}
\`\`\`

**注意：** 替換元素（img、input、br）不支援 \`::before\` 和 \`::after\`，因為它們沒有「內容」可以插入。`,
        },
        {
          heading: '偽類別（Pseudo-class）',
          content: `偽類別用單冒號 \`:\` 表示，選取元素的特定「狀態」或「位置」：

**狀態類：**
\`\`\`css
:hover    /* 滑鼠懸停 */
:focus    /* 元素獲得焦點（鍵盤 Tab 或點擊） */
:active   /* 元素被點擊的瞬間 */
:checked  /* checkbox/radio 被選取 */
:disabled /* 表單元素被停用 */
:valid    /* 表單驗證通過 */
:invalid  /* 表單驗證失敗 */
\`\`\`

**位置類：**
\`\`\`css
:first-child   /* 父元素的第一個子元素 */
:last-child    /* 父元素的最後一個子元素 */
:nth-child(n)  /* 父元素的第 n 個子元素 */
:first-of-type /* 父元素中同類型的第一個 */
:not(selector) /* 不符合選擇器的元素 */
:is(...)       /* 符合任一選擇器的元素 */
\`\`\``,
        },
        {
          heading: ':nth-child() 語法詳解',
          content: `\`:nth-child()\` 的參數可以是數字、關鍵字或公式：

\`\`\`css
:nth-child(1)      /* 第 1 個元素 */
:nth-child(3)      /* 第 3 個元素 */
:nth-child(odd)    /* 奇數元素（1, 3, 5...）等同 2n+1 */
:nth-child(even)   /* 偶數元素（2, 4, 6...）等同 2n */
:nth-child(2n)     /* 偶數元素（2, 4, 6...）*/
:nth-child(2n+1)   /* 奇數元素（1, 3, 5...）*/
:nth-child(3n)     /* 每第 3 個（3, 6, 9...）*/
:nth-child(n+3)    /* 從第 3 個開始的所有元素 */
:nth-child(-n+3)   /* 前 3 個元素（1, 2, 3）*/

/* 表格隔行變色 */
tr:nth-child(odd) { background: #f5f5f5; }
tr:nth-child(even) { background: white; }
\`\`\`

**:nth-child vs :nth-of-type：**
- \`:nth-child(2)\`：父元素中第 2 個子元素（不限類型）
- \`:nth-of-type(2)\`：父元素中同類型的第 2 個元素`,
        },
        {
          heading: '偽元素 vs 偽類別的區分',
          content: `**記憶方式：**
- **偽類別（:）**：選取元素的「狀態」或「在文件中的位置」（元素是真實存在的）
- **偽元素（::）**：選取元素的「某個部分」或「插入新的虛擬元素」（非真實 DOM 節點）

\`\`\`css
/* 偽類別：選取真實存在、處於特定狀態的元素 */
a:hover { color: red; }          /* a 元素在 hover 狀態 */
li:first-child { font-weight: bold; } /* 第一個 li 元素 */

/* 偽元素：選取部分或插入虛擬內容 */
p::first-letter { font-size: 2em; }  /* p 的第一個字母 */
.card::before { content: "NEW"; }    /* 插入 "NEW" 文字 */
\`\`\`

**偽元素插入的內容不在 DOM 中**，JavaScript 無法直接存取 \`::before\`/\`::after\` 插入的內容，但可以透過 \`getComputedStyle\` 讀取 content 屬性值。`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: '使用 ::before 或 ::after 偽元素時，哪個屬性是「必須設定」的？',
        options: [
          'display 屬性',
          'position 屬性',
          'content 屬性',
          'width 和 height 屬性',
        ],
        answer: 2,
        explanation: '::before 和 ::after 偽元素必須設定 content 屬性才會出現在頁面上。content 可以是文字字串 content: "★"、空字串 content: ""（用於純裝飾）、URL content: url(icon.png) 等。沒有 content 屬性，偽元素不會被渲染。',
      },
      {
        id: 2,
        question: '以下哪個屬於「偽元素」而非「偽類別」？',
        options: [
          ':hover',
          ':nth-child()',
          '::placeholder',
          ':focus',
        ],
        answer: 2,
        explanation: '偽元素使用雙冒號（::），選取元素的特定部分：::before、::after、::placeholder、::first-line、::first-letter、::selection 等。偽類別使用單冒號（:），選取元素的特定狀態或位置：:hover、:focus、:nth-child()、:not() 等。',
      },
      {
        id: 3,
        question: ':nth-child(2n+1) 選取的是哪些元素？',
        options: [
          '每第 2 個元素（2, 4, 6...）',
          '奇數位置的元素（1, 3, 5...）',
          '偶數位置的元素（2, 4, 6...）',
          '第 3 個之後的所有元素',
        ],
        answer: 1,
        explanation: ':nth-child(2n+1) 選取奇數位置的元素（1, 3, 5, 7...）。公式 An+B 中，n 從 0 開始：n=0 → 1，n=1 → 3，n=2 → 5，依此類推。odd 和 2n+1 等效，even 和 2n 等效。:nth-child(n+3) 選從第 3 個開始的所有元素；:nth-child(-n+3) 選前 3 個元素。',
      },
      {
        id: 4,
        question: '以下哪種 HTML 元素「不支援」::before 和 ::after 偽元素？',
        options: [
          'div 元素',
          'p 元素',
          'img 元素',
          'span 元素',
        ],
        answer: 2,
        explanation: 'img、input、br 等「替換元素（replaced element）」不支援 ::before 和 ::after，因為它們的內容來自外部（圖片、使用者輸入等），沒有「元素內容」可以讓偽元素插入。div、p、span 等一般元素都支援偽元素。這也是為什麼 CSS 純圖示（icon font）通常用 span 而非 img。',
      },
      {
        id: 5,
        question: ':first-child 和 :first-of-type 的差異是什麼？',
        options: [
          '兩者完全相同',
          ':first-child 選父元素的第一個子元素（不論類型）；:first-of-type 選同類型的第一個',
          ':first-child 選同類型的第一個；:first-of-type 選父元素的第一個子元素',
          ':first-child 只選 block 元素；:first-of-type 只選 inline 元素',
        ],
        answer: 1,
        explanation: ':first-child 選父元素的第一個子元素，不論它是什麼類型。例如 p:first-child 選「既是 p 元素，又是父元素的第一個子元素」的元素；若第一個子元素是 div，則 p:first-child 選不到任何元素。:first-of-type 選父元素中同類型（標籤相同）的第一個，更常是你想要的行為。',
      },
      {
        id: 6,
        question: '以下 CSS 使用 ::after 實作 clearfix，哪個關鍵屬性確保了 float 清除效果？',
        options: [
          'content: ""（空字串）',
          'display: table',
          'clear: both',
          'visibility: hidden',
        ],
        answer: 2,
        explanation: 'clearfix 的關鍵是 clear: both，它讓偽元素強制排在所有 float 元素之後，進而撐開父容器的高度。content: "" 讓偽元素存在（必要條件）；display: table 或 display: block 讓 clear: both 生效（clear 只對 block 元素有效）。三者缺一不可，但 clear: both 是解決 float 塌陷的核心。',
      },
      {
        id: 7,
        question: '以下哪個說法正確？',
        options: [
          '偽元素 ::before 插入的內容會出現在 DOM 中，可以用 JavaScript querySelector 選取',
          '偽元素 ::before 插入的內容「不在」DOM 中，但可用 getComputedStyle 讀取 content 值',
          '偽類別 :hover 會在 DOM 中建立新節點',
          '偽元素和偽類別都不影響 DOM 結構',
        ],
        answer: 1,
        explanation: '::before 和 ::after 插入的虛擬內容不是真正的 DOM 節點，無法用 JavaScript 的 querySelector 或 getElementById 選取。但可以透過 window.getComputedStyle(element, "::before").content 讀取偽元素的 content 屬性值。這也是為什麼偽元素插入的文字無法被搜尋引擎索引或無障礙技術讀取（部分輔助技術可能會讀取）。',
      },
      {
        id: 8,
        question: ':nth-child(odd) 和 :nth-child(2n+1) 的關係是？',
        options: [
          '完全不同，選取的元素不重疊',
          '兩者等效，都選取奇數位置的元素',
          ':nth-child(odd) 選取奇數，:nth-child(2n+1) 選取偶數',
          ':nth-child(odd) 選 1,3,5；:nth-child(2n+1) 選 3,5,7（從第 3 個開始的奇數）',
        ],
        answer: 1,
        explanation: 'odd 是 2n+1 的別名，兩者完全等效，都選取奇數位置的子元素（1, 3, 5, 7...）。同樣地，even 和 2n 等效，選取偶數位置（2, 4, 6, 8...）。CSS 提供 odd/even 關鍵字是為了讓程式碼更易讀，常用於表格隔行換色（zebra striping）。',
      },
    ],
    keyPoints: [
      '偽元素（::）選取元素的特定部分或插入虛擬內容：::before、::after、::placeholder、::first-line。',
      '偽類別（:）選取元素的特定狀態或位置：:hover、:focus、:nth-child()、:not()。',
      '::before 和 ::after 必須設定 content 屬性才會顯示，img 等替換元素不支援偽元素。',
      ':nth-child(odd) = :nth-child(2n+1)（奇數）；:nth-child(even) = :nth-child(2n)（偶數）。',
      '偽元素插入的內容不在 DOM 中，JavaScript 無法直接選取，但可用 getComputedStyle 讀取。',
    ],
  },
]
