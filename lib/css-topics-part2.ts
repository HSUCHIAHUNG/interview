import type { CssEntry } from './css-topics-types'

export const part2Topics: CssEntry[] = [
  // ─── 排版系統 ────────────────────────────────────────────────────────────────
  {
    slug: 'css-flexbox',
    title: 'Flexbox 排版系統',
    description: '掌握 Flexbox 的 container 與 item 屬性，靈活實現一維排版',
    subCategory: '排版系統',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: 'Flex Container 核心屬性',
          content: `在父元素設定 \`display: flex\` 後，它就成為 Flex Container，子元素自動成為 Flex Item。

\`\`\`css
.container {
  display: flex;

  /* 主軸方向（預設水平，由左至右） */
  flex-direction: row;          /* row | row-reverse | column | column-reverse */

  /* 主軸對齊（水平方向） */
  justify-content: flex-start;  /* flex-start | flex-end | center | space-between | space-around | space-evenly */

  /* 交叉軸對齊（垂直方向，單行） */
  align-items: stretch;         /* stretch | flex-start | flex-end | center | baseline */

  /* 多行時的交叉軸對齊 */
  align-content: stretch;       /* stretch | flex-start | flex-end | center | space-between | space-around */

  /* 是否換行 */
  flex-wrap: nowrap;            /* nowrap | wrap | wrap-reverse */

  /* 主軸與交叉軸的間距 */
  gap: 16px;                    /* 或 row-gap + column-gap 分開設定 */
}
\`\`\`

**主軸（main axis）與交叉軸（cross axis）：**
- \`flex-direction: row\`（預設）：主軸 = 水平，交叉軸 = 垂直
- \`flex-direction: column\`：主軸 = 垂直，交叉軸 = 水平
- \`justify-content\` 控制主軸；\`align-items\` 控制交叉軸`,
        },
        {
          heading: 'Flex Item 核心屬性',
          content: `\`\`\`css
.item {
  /* 放大比例：剩餘空間如何分配 */
  flex-grow: 0;    /* 預設 0，不放大 */

  /* 縮小比例：空間不足時如何縮小 */
  flex-shrink: 1;  /* 預設 1，可縮小 */

  /* 基礎大小：在分配剩餘空間前的初始大小 */
  flex-basis: auto; /* auto | 0 | 200px 等 */

  /* 簡寫：flex-grow flex-shrink flex-basis */
  flex: 1;         /* 等同於 flex: 1 1 0% */
  flex: auto;      /* 等同於 flex: 1 1 auto */
  flex: none;      /* 等同於 flex: 0 0 auto（固定大小） */

  /* 覆蓋 align-items，單獨控制此 item 的交叉軸對齊 */
  align-self: auto; /* auto | flex-start | flex-end | center | stretch | baseline */

  /* 排列順序（數字小的排前面，預設 0） */
  order: 0;
}
\`\`\`

**\`flex: 1\` 的完整意思：**
- \`flex-grow: 1\`：有剩餘空間時，平均分配
- \`flex-shrink: 1\`：空間不足時，可縮小
- \`flex-basis: 0%\`：從零開始計算（所以所有設 flex:1 的 item 會等寬/等高）`,
        },
        {
          heading: '常見排版場景',
          content: `**場景一：等分欄位**
\`\`\`css
.container { display: flex; }
.item { flex: 1; } /* 每個 item 等分剩餘空間 */
\`\`\`

**場景二：側邊欄 + 主內容區**
\`\`\`css
.layout { display: flex; }
.sidebar { width: 240px; flex-shrink: 0; } /* 固定寬度，不縮小 */
.main { flex: 1; }                          /* 佔據剩餘空間 */
\`\`\`

**場景三：水平垂直置中**
\`\`\`css
.container {
  display: flex;
  justify-content: center; /* 主軸置中 */
  align-items: center;     /* 交叉軸置中 */
}
\`\`\`

**場景四：導覽列（左側 logo，右側選單）**
\`\`\`css
.navbar { display: flex; align-items: center; }
.logo { /* 自然大小 */ }
.spacer { flex: 1; } /* 撐開中間空間 */
.nav-links { /* 自然大小 */ }
\`\`\``,
        },
        {
          heading: 'align-items vs align-content 的差異',
          content: `這兩個屬性都控制交叉軸方向，但作用時機不同：

| 屬性 | 作用時機 | 說明 |
|------|----------|------|
| \`align-items\` | 單行（每一行內部） | 控制同一行內各 item 的交叉軸對齊方式 |
| \`align-content\` | 多行（需要 flex-wrap: wrap） | 控制多行之間在交叉軸上的分布方式 |

**只有一行時，\`align-content\` 無效。**

\`\`\`css
/* 多行 Flex，控制行與行之間的間距 */
.container {
  display: flex;
  flex-wrap: wrap;
  align-content: space-between; /* 行與行之間均分空間 */
  align-items: center;          /* 每行內部 item 垂直置中 */
}
\`\`\``,
        },
        {
          heading: 'gap 屬性與 Flexbox RWD 技巧',
          content: `**gap 屬性（現代瀏覽器支援）：**
\`\`\`css
.container {
  display: flex;
  gap: 16px;              /* row-gap 和 column-gap 都是 16px */
  gap: 16px 24px;         /* row-gap: 16px, column-gap: 24px */
  row-gap: 16px;
  column-gap: 24px;
}
\`\`\`

過去需要用 margin 模擬，gap 讓程式碼更簡潔，且不需要處理最後一個元素的 margin 問題。

**RWD 技巧：**
\`\`\`css
/* 小螢幕直排，大螢幕橫排 */
.container {
  display: flex;
  flex-direction: column; /* 預設直排 */
}

@media (min-width: 768px) {
  .container {
    flex-direction: row;  /* 大螢幕橫排 */
  }
}
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: '`flex: 1` 等同於以下哪個完整寫法？',
        options: [
          'flex-grow: 1; flex-shrink: 0; flex-basis: auto',
          'flex-grow: 1; flex-shrink: 1; flex-basis: 0%',
          'flex-grow: 0; flex-shrink: 1; flex-basis: auto',
          'flex-grow: 1; flex-shrink: 1; flex-basis: 100%',
        ],
        answer: 1,
        explanation: '`flex: 1` 是 `flex: 1 1 0%` 的簡寫，即 flex-grow: 1（有剩餘空間時均分）、flex-shrink: 1（空間不足時可縮小）、flex-basis: 0%（從零開始分配，因此多個 flex:1 的 item 會等寬）。注意與 `flex: auto`（flex: 1 1 auto）的差異：後者 flex-basis 是 auto，先以內容大小為基礎再分配剩餘空間。',
      },
      {
        id: 2,
        question: '在 `flex-direction: row` 的情況下，`justify-content` 控制的是哪個方向？',
        options: [
          '垂直方向（交叉軸）',
          '水平方向（主軸）',
          '同時控制水平和垂直',
          '只控制 item 的大小，不控制位置',
        ],
        answer: 1,
        explanation: '`justify-content` 控制主軸（main axis）上的對齊，`align-items` 控制交叉軸（cross axis）上的對齊。`flex-direction: row` 時，主軸是水平方向，所以 `justify-content` 控制水平對齊。若 `flex-direction: column`，主軸變成垂直，`justify-content` 則控制垂直對齊。',
      },
      {
        id: 3,
        question: '以下哪個屬性可以讓單一個 Flex Item 覆蓋父容器的 `align-items` 設定？',
        options: [
          'justify-self',
          'align-content',
          'align-self',
          'flex-align',
        ],
        answer: 2,
        explanation: '`align-self` 屬性設定在個別 Flex Item 上，可以覆蓋父容器的 `align-items` 設定，讓這個 item 單獨使用不同的交叉軸對齊方式。可選值與 `align-items` 相同：auto、flex-start、flex-end、center、stretch、baseline。注意：CSS Grid 才有 `justify-self`，Flexbox 沒有。',
      },
      {
        id: 4,
        question: '`align-items` 和 `align-content` 的主要差異是？',
        options: [
          '兩者功能完全相同，只是語法不同',
          '`align-items` 控制單行內部 item 的對齊；`align-content` 控制多行之間的分布（需要 flex-wrap: wrap）',
          '`align-items` 用於主軸；`align-content` 用於交叉軸',
          '`align-content` 只能用於 Grid，Flexbox 只能用 `align-items`',
        ],
        answer: 1,
        explanation: '`align-items` 控制每一行內部的 Flex Item 在交叉軸上的對齊方式，適用於單行與多行。`align-content` 只在多行（需 flex-wrap: wrap）時有效，控制多行之間在交叉軸上的空間分布（類似 justify-content 對主軸的作用）。若只有一行，`align-content` 不起作用。',
      },
      {
        id: 5,
        question: '想要實現「側邊欄固定寬度 240px、主內容區佔滿剩餘空間」的佈局，正確的 CSS 是？',
        options: [
          '.sidebar { width: 240px; } .main { width: calc(100% - 240px); }',
          '.container { display: flex; } .sidebar { width: 240px; flex-shrink: 0; } .main { flex: 1; }',
          '.container { display: flex; } .sidebar { flex-basis: 240px; flex-grow: 1; } .main { flex-grow: 2; }',
          '.container { display: grid; grid-template-columns: 240px auto; }',
        ],
        answer: 1,
        explanation: '正確做法是父容器設 `display: flex`，側邊欄設 `width: 240px; flex-shrink: 0`（防止空間不足時被壓縮），主內容區設 `flex: 1`（佔滿剩餘空間）。選項 A 用 calc 計算很脆弱，gap 或 padding 都會破壞計算。選項 D 使用 Grid 也可行，但題目問的是 Flexbox 正確寫法。',
      },
      {
        id: 6,
        question: '`order` 屬性的預設值是多少？數字越大排越前面還是越後面？',
        options: [
          '預設值為 1；數字越大排越前面',
          '預設值為 0；數字越小排越前面（數字越大排越後面）',
          '預設值為 0；數字越大排越前面',
          '預設值為 -1；數字越小排越前面',
        ],
        answer: 1,
        explanation: '`order` 屬性的預設值為 0，數字越小排越前面。可以用負數讓元素排到最前面（如 order: -1），用較大正數讓元素排到最後面。`order` 只影響視覺呈現順序，不影響 HTML 結構順序（Tab 鍵焦點仍依 DOM 順序移動），應注意無障礙性問題。',
      },
      {
        id: 7,
        question: '`flex-wrap: wrap` 的效果是？',
        options: [
          '將所有 item 的文字強制換行',
          '當 item 總寬度超過容器時，允許 item 換到下一行',
          '強制所有 item 都在同一行，超出時裁切',
          '自動縮小 item 以適應容器寬度',
        ],
        answer: 1,
        explanation: '`flex-wrap: wrap` 允許 Flex Item 在空間不足時換行（主軸為 row 時換到下一行，column 時換到下一列）。預設值 `flex-wrap: nowrap` 會將所有 item 強制排在同一行，超出容器時 item 會被縮小（flex-shrink 生效）或溢出。設定 `flex-wrap: wrap` 後，`align-content` 才能發揮控制多行分布的效果。',
      },
    ],
    keyPoints: [
      '`display: flex` 的父元素為 Flex Container，子元素為 Flex Item，排列方向由 flex-direction 控制。',
      'justify-content 控制主軸對齊；align-items 控制交叉軸（單行）；align-content 控制多行分布（需 flex-wrap: wrap）。',
      '`flex: 1` 等同於 `flex: 1 1 0%`，多個 item 設定 flex:1 時會平均分配空間。',
      'flex-grow 控制剩餘空間分配比例；flex-shrink 控制空間不足時縮小比例；flex-basis 設定初始基準大小。',
      'align-self 讓個別 item 覆蓋父容器的 align-items 設定。',
      'gap 屬性取代了以往用 margin 模擬間距的做法，更簡潔且不需要處理邊界元素的特殊 margin。',
    ],
  },

  // ─── 排版系統 ────────────────────────────────────────────────────────────────
  {
    slug: 'css-grid',
    title: 'CSS Grid 排版（含 Flex vs Grid 選擇考量）',
    description: '了解 Grid 的二維排版能力，以及何時選擇 Flex、Grid 或兩者搭配',
    subCategory: '排版系統',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: 'Grid Container 核心屬性',
          content: `\`\`\`css
.container {
  display: grid;

  /* 定義欄數與欄寬 */
  grid-template-columns: 200px 1fr 1fr;      /* 三欄：固定+彈性+彈性 */
  grid-template-columns: repeat(3, 1fr);     /* 三等分 */
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* 自動換行 RWD */

  /* 定義列數與列高 */
  grid-template-rows: auto 1fr auto;         /* header/content/footer */

  /* 欄與列之間的間距 */
  gap: 16px;                                  /* row-gap 與 column-gap 相同 */
  gap: 16px 24px;                             /* row-gap: 16px, column-gap: 24px */

  /* 具名區域排版 */
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}
\`\`\``,
        },
        {
          heading: 'Grid Item 定位屬性',
          content: `\`\`\`css
/* 方式一：grid-column / grid-row 指定起止線 */
.item {
  grid-column: 1 / 3;    /* 從第 1 條線到第 3 條線（跨 2 欄） */
  grid-row: 2 / 4;       /* 從第 2 條線到第 4 條線（跨 2 列） */

  /* 用 span 指定跨越格數 */
  grid-column: 2 / span 2;  /* 從第 2 欄開始，跨 2 欄 */
  grid-column: span 3;       /* 跨 3 欄（自動放置） */
}

/* 方式二：grid-area 搭配具名區域 */
.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
\`\`\`

Grid 的座標系：線（line）從 1 開始，n 欄的 grid 有 n+1 條垂直線，-1 代表最後一條線。`,
        },
        {
          heading: 'fr 單位、repeat() 與 minmax()',
          content: `**fr（fraction）單位：**
\`fr\` 代表「可用空間的比例份數」，與 flex-grow 概念類似。

\`\`\`css
/* 三欄，左欄固定 200px，中右欄 1:2 分配剩餘空間 */
grid-template-columns: 200px 1fr 2fr;

/* 三等分 */
grid-template-columns: 1fr 1fr 1fr;
/* 等同於 */
grid-template-columns: repeat(3, 1fr);
\`\`\`

**minmax() 函式：**
設定尺寸的最小值與最大值。

\`\`\`css
/* 每欄最小 200px，最大 1fr（均分剩餘空間） */
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
/* 這是實現 RWD 卡片排版最簡潔的方式，不需 media query */
\`\`\`

**auto-fill vs auto-fit：**
- \`auto-fill\`：填滿欄位，空欄保留（會留空格）
- \`auto-fit\`：空欄折疊，item 可以撐滿整行`,
        },
        {
          heading: 'Flex vs Grid 選擇考量',
          content: `| 面向 | Flexbox | CSS Grid |
|------|---------|----------|
| 維度 | 一維（主軸方向排列） | 二維（同時控制列與欄） |
| 適用場景 | 導覽列、按鈕群、卡片列表（一維） | 頁面整體佈局、複雜表格、卡片格狀排列 |
| 排版驅動 | 內容驅動（item 大小由內容決定） | 佈局驅動（先定義格子，再放內容） |
| 對齊控制 | justify-content / align-items | 兩個軸都有完整的對齊屬性 |
| 瀏覽器支援 | 很好 | 很好（IE 需特殊處理） |

**選擇指南：**
- **用 Flex**：排列一列或一欄的元素（導覽列、Toolbar、Tag 列表）
- **用 Grid**：整個頁面框架、需要行列同時對齊的佈局（儀表板、圖片牆）
- **兩者搭配**：Grid 做外層框架，Flex 做內層組件的微排版，是最常見的實務做法

\`\`\`css
/* 常見組合：Grid 做頁面框架 */
.page { display: grid; grid-template-areas: "nav" "main" "footer"; }

/* Flex 做 nav 內部元件排列 */
.nav { display: flex; align-items: center; justify-content: space-between; }
\`\`\``,
        },
        {
          heading: 'RWD 卡片排版實例',
          content: `\`\`\`css
/* 自適應卡片排版：不需 media query */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}
/*
  效果：
  - 視窗夠寬：每列放多張卡片（每張最小 280px）
  - 視窗縮小：自動減少每列卡片數
  - 最窄時：只剩一欄，每張卡片佔滿整行
*/

/* 使用 grid-template-areas 的頁面框架 */
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: 64px 1fr 48px;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  min-height: 100vh;
}

@media (max-width: 768px) {
  .layout {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "main"
      "footer";
  }
  .sidebar { display: none; }
}
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: '`grid-template-columns: repeat(3, 1fr)` 定義的是什麼？',
        options: [
          '三列，每列高度相等',
          '三欄，每欄平均分配可用空間',
          '三個固定寬度 1px 的欄位',
          '自動填充，每欄最小 3px',
        ],
        answer: 1,
        explanation: '`repeat(3, 1fr)` 建立三欄，`fr` 是 fraction（比例份數），`1fr 1fr 1fr` 表示三欄平均分配可用空間。`grid-template-columns` 定義欄（垂直方向的切割）；`grid-template-rows` 定義列（水平方向的切割）。若要定義三列，應使用 `grid-template-rows: repeat(3, 1fr)`。',
      },
      {
        id: 2,
        question: '`grid-column: 1 / 3` 讓 item 跨越多少欄？',
        options: [
          '1 欄',
          '2 欄',
          '3 欄',
          '取決於父容器設定',
        ],
        answer: 1,
        explanation: 'Grid 用「線（line）」定位，`grid-column: 1 / 3` 表示從第 1 條垂直線到第 3 條垂直線，中間跨越 2 欄。等同於 `grid-column: span 2`（從當前位置起跨 2 欄）。若要跨 3 欄，應寫 `grid-column: 1 / 4`。',
      },
      {
        id: 3,
        question: '`repeat(auto-fill, minmax(200px, 1fr))` 的效果是？',
        options: [
          '固定三欄，每欄最小 200px',
          '根據容器寬度自動決定欄數，每欄最小 200px、最大撐滿剩餘空間，不需 media query 就能 RWD',
          '只允許一欄，寬度在 200px 到 100% 之間',
          '自動計算出最大 200px 的欄數，超出部分隱藏',
        ],
        answer: 1,
        explanation: '`auto-fill` 讓瀏覽器自動計算能放幾欄，`minmax(200px, 1fr)` 確保每欄最小 200px、最大平均分配剩餘空間。當容器縮小時，超過 200px 限制的欄會自動移到下一行，實現不需 media query 的 RWD 效果。這是實務中最受歡迎的 Grid RWD 技巧之一。',
      },
      {
        id: 4,
        question: '以下何時應選擇 CSS Grid 而非 Flexbox？',
        options: [
          '製作水平導覽列（navbar）',
          '讓一組按鈕在同一行對齊',
          '實現整個頁面的框架佈局（header/sidebar/main/footer 同時對齊行與欄）',
          '製作一行 Tag 列表，超出時換行',
        ],
        answer: 2,
        explanation: 'CSS Grid 擅長二維佈局，即同時控制行和欄。整個頁面框架（header、sidebar、main、footer 需要在行與欄上精確對齊）是 Grid 最典型的應用場景。水平導覽列、按鈕群、Tag 列表都是一維排列，更適合用 Flexbox 處理。',
      },
      {
        id: 5,
        question: '`grid-template-areas` 語法的主要優點是？',
        options: [
          '可以省略 grid-template-columns 和 grid-template-rows 的設定',
          '用視覺化的具名區域描述佈局，程式碼易讀，RWD 調整時只需修改 areas 字串',
          '讓 Grid Item 可以自動偵測自己應該放在哪個位置',
          '只有 grid-template-areas 支援跨欄跨列的效果',
        ],
        answer: 1,
        explanation: '`grid-template-areas` 允許用字串描述佈局結構，如 `"header header" "sidebar main" "footer footer"`，視覺直觀且易維護。RWD 調整時，只需在 media query 中修改 areas 字串，不需要重設每個 item 的 grid-column/row 定位。各 item 只需設定 `grid-area: header` 等對應名稱。',
      },
      {
        id: 6,
        question: '`auto-fill` 和 `auto-fit` 的差異是？',
        options: [
          '兩者功能完全相同',
          '`auto-fill` 空欄保留佔位；`auto-fit` 空欄折疊，已有 item 可以撐滿整行',
          '`auto-fill` 只能用於欄，`auto-fit` 只能用於列',
          '`auto-fit` 固定欄數，`auto-fill` 動態計算欄數',
        ],
        answer: 1,
        explanation: '`auto-fill` 和 `auto-fit` 都會自動計算可放幾欄，差別在空欄的處理：`auto-fill` 保留空欄的佔位空間；`auto-fit` 將空欄折疊為 0，讓現有 item 可以利用 `1fr` 撐滿整行。當 item 數量剛好填滿時兩者效果相同；item 數量不足時差異才明顯。',
      },
      {
        id: 7,
        question: '以下哪個描述最準確地說明了 Flex 與 Grid 的最佳搭配使用方式？',
        options: [
          '應該選一種使用，混用會造成效能問題',
          'Grid 負責整體頁面框架（二維佈局），Flex 負責組件內部的一維排列',
          'Grid 用於 RWD，Flex 用於固定佈局',
          'Grid 處理垂直排版，Flex 處理水平排版',
        ],
        answer: 1,
        explanation: '最佳實務是兩者搭配：Grid 建立頁面的整體骨架（header、sidebar、main、footer 等二維定位），Flex 處理組件內部的排列（如 navbar 內的元素水平對齊、卡片內容的排版等）。混用不會造成效能問題，反而是現代 CSS 佈局的標準做法。',
      },
    ],
    keyPoints: [
      'CSS Grid 是二維排版工具，同時控制行（rows）和欄（columns）；Flexbox 是一維排版工具。',
      '`fr` 單位代表可用空間的比例份數，`repeat()` 避免重複，`minmax()` 設定尺寸上下限。',
      '`repeat(auto-fill, minmax(200px, 1fr))` 是不需 media query 就能 RWD 的卡片排版技巧。',
      '`grid-template-areas` 用具名區域描述佈局，直觀易讀，RWD 只需修改 areas 字串。',
      '選擇原則：一維排列用 Flex，二維佈局用 Grid；實務中常搭配使用：Grid 做頁面框架，Flex 做組件內部。',
      'Grid 定位用「線（line）」從 1 計算，`grid-column: 1 / 3` 表示從第 1 條線到第 3 條線，跨 2 欄。',
    ],
  },

  // ─── 動畫與視覺效果 ──────────────────────────────────────────────────────────
  {
    slug: 'css-animations',
    title: 'CSS 動畫（transition vs animation）',
    description: '比較 transition 與 animation 的差異，掌握 keyframes 與顏色漸變動畫的寫法',
    subCategory: '動畫與視覺效果',
    difficulty: 'medium',
    notes: {
      sections: [
        {
          heading: 'transition：狀態切換過渡效果',
          content: `\`transition\` 用於元素從一個狀態切換到另一個狀態時的過渡效果，需要觸發條件（如 hover、focus、class 切換）。

\`\`\`css
/* 完整語法：transition: property duration timing-function delay */
.button {
  background-color: blue;
  transition: background-color 0.3s ease 0s;

  /* 多個屬性 */
  transition: background-color 0.3s ease, transform 0.2s ease-out;

  /* 所有可動畫屬性 */
  transition: all 0.3s ease;
}

.button:hover {
  background-color: darkblue;
  transform: scale(1.05);
}
\`\`\`

**timing-function（緩動函數）：**
- \`ease\`：慢→快→慢（預設）
- \`linear\`：勻速
- \`ease-in\`：慢→快
- \`ease-out\`：快→慢
- \`ease-in-out\`：慢→快→慢（比 ease 更對稱）
- \`cubic-bezier(x1, y1, x2, y2)\`：自訂貝茲曲線`,
        },
        {
          heading: 'animation 與 @keyframes：自動執行的動畫',
          content: `\`animation\` 不需要觸發條件，可以自動執行、循環播放。

\`\`\`css
/* 定義動畫關鍵幀 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes colorCycle {
  0%   { background-color: #ff6b6b; }
  33%  { background-color: #4ecdc4; }
  66%  { background-color: #45b7d1; }
  100% { background-color: #ff6b6b; }
}

/* 套用動畫 */
.card {
  animation: fadeIn 0.5s ease-out forwards;
  /*         名稱   時長   緩動    fill-mode */
}

.banner {
  animation: colorCycle 3s linear infinite;
  /*         名稱       時長 緩動   循環次數 */
}
\`\`\`

**animation 完整屬性：**
\`animation: name duration timing-function delay iteration-count direction fill-mode\`

| 屬性 | 說明 | 常用值 |
|------|------|--------|
| \`iteration-count\` | 播放次數 | \`1\`（預設）、\`infinite\` |
| \`direction\` | 播放方向 | \`normal\`、\`reverse\`、\`alternate\`（來回） |
| \`fill-mode\` | 動畫結束後狀態 | \`none\`、\`forwards\`（保留結束狀態）、\`backwards\` |`,
        },
        {
          heading: '顏色漸變動畫的實作方式',
          content: `**方式一：用 animation + @keyframes 改變 background-color**
\`\`\`css
@keyframes bgPulse {
  0%, 100% { background-color: #3498db; }
  50%       { background-color: #e74c3c; }
}

.element {
  animation: bgPulse 2s ease-in-out infinite;
}
\`\`\`

**方式二：用 transition 在 hover 時改變顏色**
\`\`\`css
.button {
  background-color: #3498db;
  transition: background-color 0.3s ease;
}
.button:hover {
  background-color: #2980b9;
}
\`\`\`

**方式三：CSS 漸層背景（靜態，非動畫）**
\`\`\`css
.gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 動態漸層動畫（需要技巧，直接 animate gradient 不被支援） */
.animated-gradient {
  background: linear-gradient(270deg, #ff6b6b, #4ecdc4, #45b7d1);
  background-size: 600% 600%;
  animation: gradientShift 4s ease infinite;
}

@keyframes gradientShift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
\`\`\``,
        },
        {
          heading: 'transform 與 GPU 加速',
          content: `**優先使用 transform 和 opacity 製作動畫：**
這兩個屬性的動畫由 GPU 處理，不會觸發 layout 或 paint，效能最佳。

\`\`\`css
/* 好的做法：用 transform 移動（GPU 加速） */
.box { transition: transform 0.3s ease; }
.box:hover { transform: translateX(100px); }

/* 不好的做法：改變 left/top（觸發 layout reflow） */
.box { position: relative; transition: left 0.3s ease; }
.box:hover { left: 100px; }
\`\`\`

**transform 常用函式：**
\`\`\`css
transform: translateX(50px);    /* 水平位移 */
transform: translateY(-20px);   /* 垂直位移 */
transform: scale(1.2);          /* 等比縮放 */
transform: rotate(45deg);       /* 旋轉 */
transform: skewX(15deg);        /* 傾斜 */

/* 組合多個變換（由右到左執行） */
transform: translateX(50px) rotate(45deg) scale(1.2);
\`\`\`

**\`will-change\` 提示瀏覽器預先建立 GPU Layer：**
\`\`\`css
.animated-element {
  will-change: transform, opacity;  /* 提前告知瀏覽器，讓其優化 */
  /* 不要濫用，只在確實有動畫效能問題時使用 */
}
\`\`\``,
        },
        {
          heading: 'transition vs animation 選擇指南',
          content: `| 特性 | transition | animation |
|------|-----------|-----------|
| 觸發方式 | 需要狀態改變（hover、class 切換） | 自動執行，無需觸發 |
| 關鍵幀 | 只有起始和結束兩個狀態 | 可定義多個中間關鍵幀（0%, 25%, 50%...） |
| 循環播放 | 不支援 | 支援（\`infinite\`） |
| 來回播放 | 不支援 | 支援（\`direction: alternate\`） |
| 暫停/控制 | 無（靠 JS 移除 class） | 可用 \`animation-play-state: paused\` |
| 使用場景 | 按鈕 hover、頁面元素入場、Tab 切換 | Loading 動畫、骨架屏、無限旋轉 |

**結論：**
- 使用者互動觸發的視覺回饋 → **transition**
- 需要自動播放或循環的動畫 → **animation + @keyframes**`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: '`transition` 和 `animation` 最根本的差異是什麼？',
        options: [
          'transition 只能用於顏色變化；animation 可用於任何屬性',
          'transition 需要狀態觸發（如 hover）；animation 可以自動執行且支援多個關鍵幀',
          'transition 效能較差；animation 使用 GPU 加速',
          'transition 是 CSS3 的功能；animation 是 CSS4 的功能',
        ],
        answer: 1,
        explanation: 'transition 定義兩個狀態之間的過渡，需要觸發條件（hover、focus、JS 添加 class）才會播放，且只有起始和結束兩個狀態。animation 搭配 @keyframes 可以定義多個中間狀態，自動播放，支援循環（infinite）、來回播放（alternate）等，不需要觸發條件。',
      },
      {
        id: 2,
        question: '`animation-fill-mode: forwards` 的效果是？',
        options: [
          '動畫向前播放（正常方向）',
          '動畫結束後，元素保持在最後一個關鍵幀的狀態',
          '動畫結束後，元素回到初始狀態',
          '動畫開始前，元素就呈現第一個關鍵幀的狀態',
        ],
        answer: 1,
        explanation: '`animation-fill-mode: forwards` 讓元素在動畫播放完後保持在最後一個關鍵幀（100% / to）的樣式，而不是回到動畫開始前的狀態。這在實作入場動畫（fadeIn、slideIn）時非常重要，確保元素動畫結束後不會突然消失或回到初始位置。',
      },
      {
        id: 3,
        question: '為什麼動畫時推薦使用 `transform` 而非直接修改 `left`、`top` 等位置屬性？',
        options: [
          'transform 語法更簡潔，程式碼量少',
          'transform 的動畫由 GPU 處理，不觸發 layout reflow，效能更好',
          'left/top 屬性不支援 transition',
          'transform 可以同時在多個方向移動',
        ],
        answer: 1,
        explanation: '修改 left/top 等幾何屬性會觸發瀏覽器的 layout（重新計算元素位置和大小）和 paint（重繪），開銷很大。`transform` 和 `opacity` 的動畫只需要 composite（合成）階段，由 GPU 的獨立 layer 處理，不影響其他元素的 layout，效能顯著更好。這也是為什麼瀏覽器的動畫 DevTools 會將 transform 標為「高效能動畫」。',
      },
      {
        id: 4,
        question: '以下哪個 CSS 可以讓元素無限循環顏色動畫，在藍色和紅色之間來回切換？',
        options: [
          '.el { transition: background-color 2s ease infinite; }',
          '@keyframes c { from { background-color: blue; } to { background-color: red; } } .el { animation: c 2s ease-in-out alternate infinite; }',
          '.el { animation: background-color 2s ease alternate infinite; }',
          '.el:hover { background-color: red; transition: background-color 2s; }',
        ],
        answer: 1,
        explanation: '需要搭配 @keyframes 定義顏色變化，animation 設定：動畫名稱、時長、緩動、`alternate`（來回播放，從藍到紅再從紅到藍）、`infinite`（無限循環）。選項 A 是錯誤的，transition 不支援 infinite。選項 C 也是錯誤的，animation 的值是 keyframe 名稱，不是屬性名稱。',
      },
      {
        id: 5,
        question: '`@keyframes` 中 `from` 和 `to` 等同於哪兩個百分比值？',
        options: [
          '`from` = 0%；`to` = 50%',
          '`from` = 0%；`to` = 100%',
          '`from` = 1%；`to` = 99%',
          '`from` = 25%；`to` = 75%',
        ],
        answer: 1,
        explanation: '`@keyframes` 中，`from` 是 `0%` 的別名（動畫開始狀態），`to` 是 `100%` 的別名（動畫結束狀態）。可以混用，也可以只用百分比定義更多中間狀態：`0% { ... } 25% { ... } 75% { ... } 100% { ... }`，讓動畫在不同時間點呈現不同樣式。',
      },
      {
        id: 6,
        question: '`will-change: transform` 的作用是什麼？應該如何使用？',
        options: [
          '讓元素的 transform 值固定不變',
          '提示瀏覽器預先為該元素建立 GPU 合成層，但應謹慎使用，避免過度使用造成記憶體浪費',
          '強制所有 transform 動畫都使用 GPU',
          '禁用元素的 transform 屬性，提升渲染效能',
        ],
        answer: 1,
        explanation: '`will-change` 向瀏覽器提前聲明元素即將發生的變化，讓瀏覽器預先建立 GPU 合成層進行優化。但每個 GPU Layer 都佔用記憶體，濫用 `will-change` 會造成記憶體浪費，反而降低整體效能。應只在確實有效能問題的動畫元素上使用，且動畫結束後最好移除（用 JS 控制）。',
      },
      {
        id: 7,
        question: '`animation: fadeIn 0.5s ease-out forwards` 中，`forwards` 對應的是哪個屬性？',
        options: [
          'animation-direction',
          'animation-timing-function',
          'animation-fill-mode',
          'animation-iteration-count',
        ],
        answer: 2,
        explanation: 'animation 簡寫屬性的順序是：`name duration timing-function delay iteration-count direction fill-mode`。`forwards` 是 `animation-fill-mode` 的值，表示動畫結束後保持最後一個關鍵幀的狀態。`animation-direction` 的值是 normal/reverse/alternate；`animation-iteration-count` 的值是數字或 infinite。',
      },
    ],
    keyPoints: [
      'transition 用於狀態觸發的過渡效果（如 hover），只有起始和結束兩個狀態；animation 搭配 @keyframes 可自動循環，支援多個關鍵幀。',
      'transition 語法：`property duration timing-function delay`；animation 語法：`name duration timing-function delay iteration-count direction fill-mode`。',
      '`animation-fill-mode: forwards` 讓動畫結束後保持最終狀態，入場動畫（fadeIn）必備。',
      '優先使用 transform 和 opacity 製作動畫，避免修改 left/top/width 等觸發 layout reflow 的屬性。',
      '顏色循環動畫：用 @keyframes 改變 background-color，搭配 animation infinite 實現；`alternate` 可來回切換。',
      '`will-change: transform` 提示瀏覽器預先建立 GPU Layer，但應謹慎使用，避免過度使用浪費記憶體。',
    ],
  },

  // ─── 動畫與視覺效果 ──────────────────────────────────────────────────────────
  {
    slug: 'css-units',
    title: 'CSS 單位（rem / em / % / px / vw / vh）',
    description: '比較絕對單位與相對單位的差異，掌握 rem 與 em 的繼承計算方式',
    subCategory: '動畫與視覺效果',
    difficulty: 'easy',
    notes: {
      sections: [
        {
          heading: '各單位一覽表',
          content: `| 單位 | 類型 | 相對於 | 特點 |
|------|------|--------|------|
| \`px\` | 絕對 | 設備像素 | 固定，不隨任何設定改變 |
| \`rem\` | 相對 | 根元素（\`<html>\`）的 font-size | 全域縮放，無疊加問題 |
| \`em\` | 相對 | 父元素的 font-size | 會疊加，易造成意外效果 |
| \`%\` | 相對 | 父元素的對應屬性 | 對 font-size 是相對父元素，對 width 是相對父元素 width |
| \`vw\` | 相對 | 視窗寬度的 1% | 100vw = 整個視窗寬度 |
| \`vh\` | 相對 | 視窗高度的 1% | 100vh = 整個視窗高度 |
| \`vmin\` | 相對 | vw 和 vh 中較小的那個 | 適合響應式字體 |
| \`vmax\` | 相對 | vw 和 vh 中較大的那個 | |`,
        },
        {
          heading: 'rem：最推薦的 RWD 單位',
          content: `\`rem\` 全名 Root EM，相對於 \`<html>\` 的 \`font-size\`（預設 16px）。

\`\`\`css
/* 預設：1rem = 16px */
html { font-size: 16px; } /* 瀏覽器預設值 */

h1 { font-size: 2rem; }    /* 32px */
p  { font-size: 1rem; }    /* 16px */
.card { padding: 1.5rem; } /* 24px */

/* RWD 技巧：修改根元素字體大小，所有 rem 值自動縮放 */
@media (max-width: 768px) {
  html { font-size: 14px; }
  /* 現在 1rem = 14px，所有使用 rem 的元素自動縮小 */
}

/* 常見技巧：設定 62.5% 讓 1rem = 10px，方便計算 */
html { font-size: 62.5%; } /* 16px * 62.5% = 10px */
h1 { font-size: 3.2rem; } /* 32px */
\`\`\`

**rem 的優點：**
- 不會疊加（只看 html 的 font-size）
- 可透過修改根元素實現整站縮放
- 使用者在瀏覽器設定字體大小時，rem 會正確縮放（無障礙性友好）`,
        },
        {
          heading: 'em：會疊加的相對單位',
          content: `\`em\` 相對於「當前元素或父元素」的 font-size，會疊加造成複雜計算。

\`\`\`css
/* em 疊加問題示範 */
body { font-size: 16px; }

.parent {
  font-size: 1.5em; /* 16px × 1.5 = 24px */
}

.child {
  font-size: 1.5em; /* 24px × 1.5 = 36px（不是預期的 24px！） */
}

.grandchild {
  font-size: 1.5em; /* 36px × 1.5 = 54px（越嵌越大！） */
}
\`\`\`

**em 的適用場景：**
\`\`\`css
/* em 在 padding/margin 中相對於當前元素自身的 font-size */
/* 這讓按鈕的 padding 能隨字體大小等比縮放 */
.button {
  font-size: 1rem;    /* 16px */
  padding: 0.75em 1.5em; /* 12px 24px（相對於 button 自身的 font-size） */
}

.button--large {
  font-size: 1.25rem; /* 20px */
  /* padding 自動變為 15px 30px，無需額外設定 */
}
\`\`\``,
        },
        {
          heading: 'vw / vh：相對於視窗的單位',
          content: `\`\`\`css
/* 全螢幕 Hero 區塊 */
.hero {
  width: 100vw;
  height: 100vh;
}

/* 響應式字體大小（無需 media query） */
h1 { font-size: clamp(1.5rem, 4vw, 3rem); }
/*                最小值  理想值 最大值 */

/* 常見陷阱：100vh 在行動裝置上包含了地址列高度 */
/* 現代解法：使用 dvh（dynamic viewport height） */
.hero { height: 100dvh; } /* 排除動態 UI（地址列）的視窗高度 */
\`\`\`

**vw 的注意事項：**
- \`100vw\` 包含垂直捲軸的寬度，若頁面有捲軸會造成水平溢位
- 解法：使用 \`width: 100%\` 替代 \`width: 100vw\`（100% 不包含捲軸）`,
        },
        {
          heading: 'RWD 中各單位的設計思路',
          content: `**推薦設計策略：**

\`\`\`css
/* font-size：用 rem，確保無障礙性且不疊加 */
body { font-size: 1rem; }
h1   { font-size: 2rem; }

/* padding/margin：用 em 讓間距隨組件字體等比縮放 */
.button { padding: 0.75em 1.5em; }

/* 佈局寬度：用 % 或 fr（Grid）實現流式佈局 */
.container { max-width: 1200px; width: 90%; }

/* 視窗相關：用 vw/vh */
.hero { min-height: 100vh; }
.sidebar { width: min(240px, 30vw); }

/* 固定不變的值：用 px */
.border { border: 1px solid #eee; }
.icon   { width: 24px; height: 24px; }
\`\`\`

**clamp() 函式（現代 RWD 神器）：**
\`\`\`css
/* 自動在最小值和最大值之間響應式縮放，不需 media query */
font-size: clamp(1rem, 2.5vw, 2rem);
/* 字體至少 1rem，最大 2rem，中間根據視窗寬度自動計算 */
\`\`\``,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: '`rem` 單位是相對於哪個元素的 `font-size`？',
        options: [
          '相對於父元素的 font-size',
          '相對於根元素（`<html>`）的 font-size',
          '相對於最近的有設定 font-size 的祖先元素',
          '相對於 body 元素的 font-size',
        ],
        answer: 1,
        explanation: '`rem`（Root EM）固定相對於文件根元素 `<html>` 的 font-size。瀏覽器預設 html font-size 為 16px，因此預設 1rem = 16px。無論 DOM 嵌套多深，rem 的基準始終是 html 元素，不會疊加。這是 rem 比 em 更適合大多數場景的主要原因。',
      },
      {
        id: 2,
        question: '若 `body { font-size: 16px; }`，且有以下 CSS：`.parent { font-size: 1.5em; } .child { font-size: 1.5em; }`，那麼 `.child` 的實際字體大小是多少？',
        options: [
          '16px（不會疊加）',
          '24px（16 × 1.5）',
          '36px（16 × 1.5 × 1.5）',
          '32px（16 × 2）',
        ],
        answer: 2,
        explanation: '`em` 相對於父元素的 font-size，會逐層疊加。.parent 的 font-size 是 16px × 1.5 = 24px；.child 在 .parent 內，所以 .child 的 font-size 是 24px × 1.5 = 36px。這就是 em 疊加問題，深度嵌套時字體大小會越來越大，難以維護，這是 rem 更常被推薦的原因。',
      },
      {
        id: 3,
        question: '`vw` 和 `vh` 分別代表什麼？',
        options: [
          'vertical width 和 vertical height',
          '視窗寬度的 1% 和視窗高度的 1%',
          '可視區域的最大寬度和最大高度',
          '父元素寬度的 1% 和父元素高度的 1%',
        ],
        answer: 1,
        explanation: '`vw`（viewport width）是視窗寬度的 1%，`vh`（viewport height）是視窗高度的 1%。所以 `100vw = 整個視窗寬度`，`100vh = 整個視窗高度`。注意 `100vw` 包含垂直捲軸寬度，可能造成水平溢出；行動裝置上 `100vh` 可能包含地址列高度（可改用 `100dvh` 解決）。',
      },
      {
        id: 4,
        question: '為什麼 RWD 開發中推薦使用 `rem` 設定 `font-size`？',
        options: [
          'rem 比 px 計算速度更快',
          'rem 不會疊加，且當使用者在瀏覽器設定修改預設字體大小時，rem 會正確響應，無障礙性友好',
          'rem 是唯一支援響應式設計的單位',
          'rem 的值永遠固定，不受螢幕大小影響',
        ],
        answer: 1,
        explanation: 'rem 的優勢：不會因 DOM 嵌套而疊加（基準固定為 html 的 font-size）；當使用者在系統或瀏覽器中調整字體大小時，rem 能正確縮放（無障礙性）；可透過修改根元素 font-size 批量縮放整個設計系統（如 RWD breakpoints 修改 html font-size）。px 是固定值，無法響應使用者設定。',
      },
      {
        id: 5,
        question: '`padding: 0.75em` 設定在按鈕上，`em` 相對於哪個元素的 font-size？',
        options: [
          '相對於 html 元素的 font-size',
          '相對於父元素的 font-size',
          '相對於按鈕自身的 font-size',
          '相對於 body 元素的 font-size',
        ],
        answer: 2,
        explanation: '當 `em` 用於 padding、margin、width 等非 font-size 屬性時，它相對於「當前元素自身」的 font-size（而非父元素）。這讓按鈕的 padding 能與自身字體大小等比縮放，製作不同尺寸的按鈕時只需修改 font-size，padding 會自動調整，是設計 component 的常見技巧。',
      },
      {
        id: 6,
        question: '`clamp(1rem, 2.5vw, 2rem)` 的作用是？',
        options: [
          '設定一個在 1rem 到 2rem 之間固定的值',
          '根據視窗寬度自動縮放，最小 1rem，最大 2rem，中間值根據 2.5vw 計算',
          '建立一個 clamp（夾子）元素，限制子元素的大小',
          '設定三種不同 breakpoint 下的字體大小',
        ],
        answer: 1,
        explanation: '`clamp(min, preferred, max)` 讓值在 min 和 max 之間響應式縮放。preferred 值（2.5vw）根據視窗寬度計算：若結果小於 1rem，使用 1rem；若大於 2rem，使用 2rem；若介於兩者之間，使用 2.5vw 的計算結果。這讓字體大小隨視窗寬度自動縮放，不需 media query，是現代 RWD 的推薦做法。',
      },
      {
        id: 7,
        question: '以下哪個場景最適合使用 `px` 而非 `rem` 或 `em`？',
        options: [
          '設定標題的 font-size',
          '設定按鈕的 padding',
          '設定 border 的寬度（如 `border: 1px solid #eee`）',
          '設定 section 的 margin',
        ],
        answer: 2,
        explanation: 'Border 通常需要固定的細線效果（1px），不希望隨字體大小縮放。Icon 大小、HR 線、細微的裝飾元素通常也用 px。font-size 推薦用 rem（無障礙性）；padding/margin 可用 em（隨組件字體縮放）或 rem（全域一致）；佈局寬度用 % 或 fr。',
      },
    ],
    keyPoints: [
      '`rem` 相對於根元素（html）的 font-size，不會疊加，RWD 最推薦的字體單位。',
      '`em` 相對於父元素的 font-size，用於 font-size 時會疊加；用於 padding/margin 時相對於自身 font-size。',
      '`vw`/`vh` 相對於視窗寬/高的 1%，全螢幕佈局常用；行動裝置 100vh 可改用 100dvh 避免地址列問題。',
      '`px` 是固定值，適合 border 等不需縮放的裝飾性尺寸，但 font-size 用 px 會影響無障礙性。',
      '`clamp(min, preferred, max)` 讓值隨視窗自動縮放並限制上下限，不需 media query 的現代 RWD 技巧。',
      '設計策略：font-size 用 rem，按鈕 padding 用 em，佈局寬度用 %，視窗相關用 vw/vh，細線裝飾用 px。',
    ],
  },

  // ─── 預處理器與工具 ──────────────────────────────────────────────────────────
  {
    slug: 'sass-scss',
    title: 'SASS / SCSS 核心功能',
    description: '了解 SCSS 的變數、nesting、mixin、& 符號等核心功能，提升 CSS 維護性',
    subCategory: '預處理器與工具',
    difficulty: 'easy',
    notes: {
      sections: [
        {
          heading: 'SASS vs SCSS 語法差異',
          content: `SASS 是預處理器的名稱，有兩種語法格式：

| 特性 | SASS（縮排語法） | SCSS（Sassy CSS） |
|------|----------------|------------------|
| 副檔名 | .sass | .scss |
| 語法風格 | 縮排（無大括號、無分號） | CSS 超集（有大括號、有分號） |
| 相容性 | 不相容普通 CSS | 完全相容 CSS |
| 學習曲線 | 需要適應縮排語法 | 對 CSS 使用者友好 |

\`\`\`scss
// SCSS 語法（現在主流）
.nav {
  background-color: #333;

  &:hover {
    background-color: #555;
  }

  .nav-item {
    color: white;
  }
}
\`\`\`

\`\`\`sass
// SASS 語法（縮排，無大括號）
.nav
  background-color: #333

  &:hover
    background-color: #555

  .nav-item
    color: white
\`\`\`

現今大多數專案使用 SCSS 語法（檔名 .scss），因為它是 CSS 超集，舊有 CSS 程式碼可直接複製進去。`,
        },
        {
          heading: 'SCSS 變數 vs CSS Custom Properties',
          content: `**SCSS 變數（編譯時處理）：**
\`\`\`scss
$primary-color: #3498db;
$font-size-base: 16px;
$spacing-unit: 8px;

.button {
  background-color: $primary-color;
  font-size: $font-size-base;
  padding: $spacing-unit * 2;  // SCSS 支援數學運算
}
\`\`\`

**CSS Custom Properties（執行時處理）：**
\`\`\`css
:root {
  --primary-color: #3498db;
  --font-size-base: 16px;
}

.button {
  background-color: var(--primary-color);
  font-size: var(--font-size-base);
}

/* 可在執行時動態修改（JavaScript 可存取） */
document.documentElement.style.setProperty('--primary-color', '#e74c3c');
\`\`\`

| 特性 | SCSS 變數 | CSS Custom Properties |
|------|----------|----------------------|
| 處理時機 | 編譯時（轉成靜態 CSS） | 執行時（瀏覽器動態計算） |
| JS 可存取 | 否 | 是（getPropertyValue / setProperty） |
| 可繼承 | 否（Scope 是 SCSS 文件） | 是（CSS 繼承與層疊） |
| 可在媒體查詢內修改 | 否 | 是 |`,
        },
        {
          heading: '& 符號與 Nesting（巢狀）',
          content: `**& 符號代表父選擇器：**
\`\`\`scss
.button {
  background-color: blue;
  color: white;

  // & 代表 .button
  &:hover { background-color: darkblue; }     // .button:hover
  &:focus { outline: 2px solid blue; }        // .button:focus
  &:disabled { opacity: 0.5; cursor: not-allowed; } // .button:disabled

  // BEM 命名
  &__icon { margin-right: 8px; }              // .button__icon
  &--primary { background-color: #3498db; }   // .button--primary
  &--danger  { background-color: #e74c3c; }   // .button--danger

  // 在父元素特定狀態下
  .dark-theme & { background-color: #555; }   // .dark-theme .button
}
\`\`\`

**Nesting 避免重複前綴：**
\`\`\`scss
// SCSS
.nav {
  display: flex;

  .nav-item {
    padding: 8px 16px;

    a {
      color: white;
      &:hover { text-decoration: underline; }
    }
  }
}

// 編譯結果
// .nav { display: flex; }
// .nav .nav-item { padding: 8px 16px; }
// .nav .nav-item a { color: white; }
// .nav .nav-item a:hover { text-decoration: underline; }
\`\`\`

注意：過度巢狀（超過 3 層）會產生過於特定的選擇器，難以覆蓋，應避免。`,
        },
        {
          heading: '@mixin 與 @include：可重用樣式區塊',
          content: `**@mixin 定義，@include 使用：**
\`\`\`scss
// 無參數 mixin
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

// 有參數的 mixin（可設預設值）
@mixin button-variant($bg-color, $text-color: white) {
  background-color: $bg-color;
  color: $text-color;
  border: 2px solid darken($bg-color, 10%);

  &:hover {
    background-color: darken($bg-color, 15%);
  }
}

// 媒體查詢 mixin（避免重複寫 breakpoint）
@mixin respond-to($breakpoint) {
  @if $breakpoint == 'mobile' {
    @media (max-width: 768px) { @content; }
  } @else if $breakpoint == 'tablet' {
    @media (max-width: 1024px) { @content; }
  }
}

// 使用
.hero {
  @include flex-center;
  height: 100vh;
}

.button--primary { @include button-variant(#3498db); }
.button--danger  { @include button-variant(#e74c3c); }

.card {
  font-size: 1rem;

  @include respond-to('mobile') {
    font-size: 0.875rem;
  }
}
\`\`\``,
        },
        {
          heading: '@extend 與 %placeholder',
          content: `**@extend 讓選擇器繼承另一個選擇器的所有樣式：**
\`\`\`scss
// 基礎按鈕樣式
.button-base {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.button--primary {
  @extend .button-base;
  background-color: #3498db;
  color: white;
}

.button--secondary {
  @extend .button-base;
  background-color: transparent;
  border: 1px solid #3498db;
}
\`\`\`

**%placeholder（只在被 extend 時才生成 CSS）：**
\`\`\`scss
// 使用 % 定義 placeholder，不會直接生成 CSS
%flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero { @extend %flex-center; }  // 生成 CSS
.modal { @extend %flex-center; } // 合併選擇器

// 編譯結果：
// .hero, .modal { display: flex; justify-content: center; align-items: center; }
\`\`\`

**@extend vs @mixin 的選擇：**
- **@extend**：多個選擇器共享完全相同的樣式，無需傳參數
- **@mixin**：需要傳參數自訂樣式，或在多個位置有獨立樣式塊`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: 'SCSS 中的 `&` 符號代表什麼？',
        options: [
          '代表所有子元素',
          '代表父選擇器，用於串接偽類、偽元素或 BEM 修飾符',
          '代表根元素（html）',
          '代表全域變數的前綴',
        ],
        answer: 1,
        explanation: '`&` 在 SCSS 中代表「當前作用域的父選擇器」。例如在 `.button { &:hover { } }` 中，`&` 是 `.button`，所以編譯結果是 `.button:hover`。常用於偽類（:hover、:focus）、偽元素（::before）、BEM 命名（.button__icon、.button--primary）、以及反向繼承（.parent & 編譯為 .parent .button）。',
      },
      {
        id: 2,
        question: 'SCSS 變數（`$primary: #3498db`）和 CSS Custom Properties（`--primary: #3498db`）最主要的差異是？',
        options: [
          'SCSS 變數只能存顏色，CSS 變數可以存任何值',
          'SCSS 變數在編譯時處理，輸出靜態 CSS；CSS Custom Properties 在執行時處理，可被 JavaScript 動態修改',
          'SCSS 變數的效能比 CSS Custom Properties 差',
          '兩者功能完全相同，只是語法不同',
        ],
        answer: 1,
        explanation: 'SCSS 變數是在編譯階段（打包時）被替換成實際值，最終 CSS 中不存在變數，只有靜態值。CSS Custom Properties（CSS 變數）存在於執行時的瀏覽器中，可被 JavaScript 讀取和修改（`getComputedStyle`、`setProperty`），也可在媒體查詢中修改，支援繼承和層疊，現代主題切換（dark mode）通常用 CSS Custom Properties 實現。',
      },
      {
        id: 3,
        question: '以下 SCSS 編譯後，`.button--danger` 的選擇器是什麼？\n\n`.button { &--danger { color: red; } }`',
        options: [
          '.button .--danger',
          '.button--danger',
          '.button > --danger',
          '-- danger（無效選擇器）',
        ],
        answer: 1,
        explanation: '`&` 直接代表父選擇器並與後面的文字串接，沒有空格。`.button { &--danger { } }` 中，`&` 是 `.button`，串接 `--danger` 後得到 `.button--danger`。這是 BEM（Block Element Modifier）命名法在 SCSS 中最常見的寫法，避免重複書寫 `.button` 前綴。',
      },
      {
        id: 4,
        question: '@mixin 和 @extend 的主要差異是？何時選擇各自？',
        options: [
          '@mixin 只能定義顏色，@extend 可以定義任何樣式',
          '@mixin 可以接受參數並在每個使用處產生獨立 CSS；@extend 讓多個選擇器共享同一組 CSS，無法傳參數',
          '@extend 效能更好，應盡量使用 @extend 替代 @mixin',
          '@mixin 是 SASS 語法，@extend 是 SCSS 語法',
        ],
        answer: 1,
        explanation: '@mixin + @include 在每個使用位置都輸出一份 CSS（可傳參數自訂），適合需要客製化的可重用樣式。@extend 讓多個選擇器合併共享同一組樣式（如 `.hero, .modal { display: flex; ... }`），生成的 CSS 更精簡但不能傳參數。一般建議偏好 @mixin，因為 @extend 有時會產生意外的選擇器組合，且在媒體查詢內不能使用 @extend。',
      },
      {
        id: 5,
        question: 'SCSS 的 Nesting（巢狀）功能有什麼使用上的注意事項？',
        options: [
          '巢狀層數沒有限制，越深越好組織',
          '巢狀超過 3 層會產生過度特定的選擇器，難以覆蓋，應盡量控制在 2-3 層',
          '巢狀只能用於 class 選擇器，不能用於標籤選擇器',
          '巢狀無法搭配 & 符號使用',
        ],
        answer: 1,
        explanation: 'SCSS Nesting 雖然方便，但過度巢狀（超過 3 層）會產生高特異性（specificity）的選擇器（如 `.nav .menu .item a:hover`），後來需要覆蓋這些樣式時必須用同等或更高特異性的選擇器，造成「特異性戰爭」。良好實踐是最多巢狀 2-3 層，配合 BEM 命名減少對 HTML 結構的依賴。',
      },
      {
        id: 6,
        question: '`%placeholder` 選擇器（如 `%flex-center { ... }`）的特點是？',
        options: [
          '直接輸出到 CSS 中，像普通選擇器一樣',
          '不直接輸出 CSS，只有被 @extend 使用時才生成相應 CSS，且會合併選擇器',
          '相當於 SCSS 變數，只能存儲單一屬性',
          '是 CSS 偽元素 ::placeholder 的 SCSS 別名',
        ],
        answer: 1,
        explanation: '`%placeholder` 是 SCSS 的佔位選擇器，本身不會出現在編譯後的 CSS 中，只有在被 @extend 引用時才生成 CSS，並且會合併多個使用它的選擇器（如 `.hero, .modal { ... }`）。這比使用普通 class 的 @extend 更好，因為不會在輸出的 CSS 中產生未被使用的樣式規則。',
      },
      {
        id: 7,
        question: 'SCSS 支援數學運算，以下哪個是正確的 SCSS 用法？',
        options: [
          '$spacing: 8px; .box { padding: $spacing + 50%; }',
          '$base: 8px; .box { padding: $base * 2; margin: $base * 3; }',
          '$size: 1rem; .box { font-size: $size / 0; }',
          '.box { width: 100px * 100px; }',
        ],
        answer: 1,
        explanation: 'SCSS 支援加減乘除運算，`$base * 2` 在 $base 為 8px 時結果是 16px，`$base * 3` 結果是 24px，這是有效的數學運算。選項 A 混用了 px 和 %（不同單位相加），現代 SCSS 不允許不相容單位直接運算（應用 CSS `calc()` 處理混合單位）。選項 C 除以零無效。選項 D 面積單位（px²）沒有 CSS 意義。',
      },
    ],
    keyPoints: [
      'SCSS 是 CSS 超集，語法完全相容 CSS；SASS 使用縮排語法，現代專案主要使用 SCSS。',
      '`&` 代表父選擇器，用於串接偽類（:hover）、BEM 修飾符（--primary）和反向繼承（.parent &）。',
      'SCSS 變數（$var）在編譯時替換為靜態值；CSS Custom Properties（--var）在執行時處理，可被 JS 動態修改。',
      '@mixin 接受參數、在每個使用位置輸出 CSS；@extend 合併選擇器共享樣式、不能傳參數。',
      '%placeholder 本身不輸出 CSS，只有被 @extend 引用時才生成合併選擇器的樣式。',
      'Nesting 巢狀應控制在 2-3 層，避免產生過度特定的選擇器，造成難以覆蓋的特異性問題。',
    ],
  },

  // ─── 預處理器與工具 ──────────────────────────────────────────────────────────
  {
    slug: 'css-reset',
    title: 'CSS Reset 與 Normalize',
    description: '了解 CSS Reset 與 Normalize.css 的差異，以及現代 CSS 的預設樣式處理策略',
    subCategory: '預處理器與工具',
    difficulty: 'easy',
    notes: {
      sections: [
        {
          heading: '為什麼需要 CSS Reset / Normalize',
          content: `各瀏覽器對 HTML 元素有各自的預設樣式（User Agent Stylesheet），且各家實作不一致：

| 元素 | Chrome 預設 | Firefox 預設 |
|------|-------------|-------------|
| \`<h1>\` | margin: 0.67em 0 | margin: 0.67em 0 |
| \`<ul>\` | padding-left: 40px | padding-inline-start: 40px |
| \`<button>\` | 有預設 border/背景 | 略有不同 |
| \`<input>\` | 有特定的 padding/border | 略有不同 |

不處理這些差異，同樣的 CSS 在不同瀏覽器可能呈現不一致的外觀，尤其是 margin、padding、font-size、line-height 等屬性。

**CSS Reset 和 Normalize.css 的目標都是解決跨瀏覽器不一致問題，但策略截然不同。**`,
        },
        {
          heading: 'CSS Reset：歸零一切',
          content: `**CSS Reset（代表作：Eric Meyer Reset）策略：將所有瀏覽器預設樣式歸零，從空白開始。**

\`\`\`css
/* Eric Meyer CSS Reset 核心概念（簡化版） */
html, body, div, span, h1, h2, h3, h4, h5, h6,
p, blockquote, pre, a, abbr, address, cite, code,
ul, ol, li, dl, dt, dd, form, input, textarea, button,
table, thead, tbody, tr, th, td {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}

article, aside, details, figcaption, figure,
footer, header, hgroup, menu, nav, section {
  display: block;
}

body { line-height: 1; }

ol, ul { list-style: none; }

blockquote, q { quotes: none; }

table { border-collapse: collapse; border-spacing: 0; }
\`\`\`

**特點：**
- 激進：清除所有預設樣式，包括有用的（如 \`<ul>\` 的 list-style）
- 優點：完全掌控，不受任何瀏覽器預設影響
- 缺點：需要自己重新定義所有樣式，可能遺漏無障礙性相關的預設行為`,
        },
        {
          heading: 'Normalize.css：保留有用的預設',
          content: `**Normalize.css 策略：修正跨瀏覽器不一致，但保留有用的預設樣式，不是全部清除。**

\`\`\`css
/* Normalize.css 部分片段（展示設計哲學） */

/* 修正 Chrome/Safari 中 h1 在 section/article 內的字體大小問題 */
h1 {
  font-size: 2em;
  margin: 0.67em 0;
}

/* 修正 IE 10+ 中 template 元素顯示問題 */
[hidden] { display: none; }

/* 修正 Firefox/IE 中 hr 的 box-sizing */
hr {
  box-sizing: content-box;
  height: 0;
  overflow: visible;
}

/* 修正所有瀏覽器的 button 字體繼承 */
button, input, optgroup, select, textarea {
  font-family: inherit;
  font-size: 100%;
  line-height: 1.15;
  margin: 0;
}
\`\`\`

**特點：**
- 保守：只修正不一致，保留語意正確的預設樣式（如標題的字體大小層級）
- 優點：有詳細的文件說明每條規則的用途，保留無障礙性
- 缺點：不能完全控制所有樣式，仍有瀏覽器預設存在`,
        },
        {
          heading: 'CSS Reset vs Normalize.css 比較',
          content: `| 特性 | CSS Reset | Normalize.css |
|------|-----------|---------------|
| 策略 | 清除所有預設樣式 | 修正跨瀏覽器不一致 |
| 態度 | 激進，從零開始 | 保守，保留有用的預設 |
| margin/padding | 全部歸零 | 只修正有問題的部分 |
| list-style | 移除 | 保留 |
| 標題大小 | 全部歸一 | 保留層級（h1 > h2 > h3...） |
| 文件大小 | 較小 | 較大（含詳細註解） |
| 適用場景 | 高度客製化設計，完全控制樣式 | 需要保留語意樣式，快速開發 |

**現代建議：**
兩者可以結合使用，或使用專案框架提供的解決方案（見下節）。`,
        },
        {
          heading: '現代 CSS 預設樣式處理策略',
          content: `**Tailwind CSS 的 Preflight：**
Tailwind 使用基於 Normalize.css 的 Preflight，加上部分 Reset 策略：
\`\`\`css
/* Preflight 部分概念 */
*, ::before, ::after { box-sizing: border-box; }
img, svg, video { display: block; }
img, video { max-width: 100%; height: auto; }
/* + Normalize 的跨瀏覽器修正 */
\`\`\`

**CSS-in-JS 的 Global Styles（如 Styled Components / Emotion）：**
\`\`\`js
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle\`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body { font-family: system-ui, sans-serif; }
\`
\`\`\`

**現代手寫 Modern CSS Reset（簡潔版）：**
\`\`\`css
/* Josh Comeau 的 Modern CSS Reset 核心概念 */
*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; }
body { line-height: 1.5; -webkit-font-smoothing: antialiased; }
img, picture, video, canvas, svg { display: block; max-width: 100%; }
input, button, textarea, select { font: inherit; }
p, h1, h2, h3, h4, h5, h6 { overflow-wrap: break-word; }
\`\`\`

比起傳統 Eric Meyer Reset，現代 CSS Reset 更短小且針對現代 HTML 的常見問題。`,
        },
      ],
    },
    questions: [
      {
        id: 1,
        question: '為什麼前端專案通常需要 CSS Reset 或 Normalize.css？',
        options: [
          '因為 CSS 本身沒有任何預設樣式',
          '因為各瀏覽器對 HTML 元素有不同的預設樣式，導致同樣的 CSS 在不同瀏覽器呈現不一致',
          '因為 CSS Reset 可以提升網頁載入效能',
          '因為沒有 CSS Reset 的話，HTML 元素無法正常顯示',
        ],
        answer: 1,
        explanation: '各瀏覽器（Chrome、Firefox、Safari、Edge）對 HTML 元素有各自的預設樣式（User Agent Stylesheet），這些預設值在細節上有所不同（如 button 的 border、ul 的 padding、h1-h6 的 margin 等），導致相同的 HTML + CSS 在不同瀏覽器可能呈現差異。CSS Reset 和 Normalize.css 的目的都是解決這個跨瀏覽器不一致問題。',
      },
      {
        id: 2,
        question: 'CSS Reset（如 Eric Meyer Reset）的主要策略是什麼？',
        options: [
          '只修正瀏覽器間不一致的部分，保留有用的預設樣式',
          '將所有 HTML 元素的 margin、padding、font-size 等預設樣式歸零，從空白開始',
          '自動偵測瀏覽器類型並套用對應的 polyfill',
          '移除所有 HTML 元素，只保留 div 和 span',
        ],
        answer: 1,
        explanation: 'CSS Reset 採用激進策略：幾乎將所有常用 HTML 元素的 margin、padding、border、font-size 等重設為零或基礎值，讓開發者從一個空白的基礎開始設計，不受任何瀏覽器預設影響。缺點是連「有用的」預設樣式也一併清除（如 ul 的 list-style、h1-h6 的大小層級）。',
      },
      {
        id: 3,
        question: 'Normalize.css 和 CSS Reset 最主要的差異是？',
        options: [
          'Normalize.css 只適用於 Firefox，CSS Reset 適用所有瀏覽器',
          'Normalize.css 保留有用的瀏覽器預設樣式，只修正跨瀏覽器不一致；CSS Reset 將所有預設樣式歸零',
          'Normalize.css 的檔案更小，效能更好',
          'CSS Reset 是 CSS3 的標準，Normalize.css 是社群方案',
        ],
        answer: 1,
        explanation: 'Normalize.css 的設計哲學是「保留有用的、修正不一致的」。它不會清除 h1-h6 的字體大小層級（這是語意正確的預設），也不會移除 ul 的 list-style，而是針對各瀏覽器實作不一致的部分（如特定元素的 box-model 差異）提供修正，並有詳細的文件說明每條規則的目的。',
      },
      {
        id: 4,
        question: 'Tailwind CSS 的 Preflight 是基於哪個方案？',
        options: [
          '完全自訂的 Tailwind 獨有方案，不基於任何現有方案',
          '基於 Normalize.css，並加入部分 Reset 策略（如 box-sizing: border-box）',
          '直接使用 Eric Meyer CSS Reset 不做任何修改',
          '基於 CSS-in-JS 的 Global Styles 方案',
        ],
        answer: 1,
        explanation: 'Tailwind 的 Preflight 以 Normalize.css 為基礎，再加入 Tailwind 自己的設計決策（如設定所有元素 box-sizing: border-box、將圖片設為 display: block 以避免底部空白等）。它是一個混合方案，既修正跨瀏覽器不一致，又加入一些 Reset 風格的設定，讓使用 Tailwind 類別時能有更可預測的行為。',
      },
      {
        id: 5,
        question: '以下哪個 CSS 規則是「現代 CSS Reset」中最常見且重要的基礎設定？',
        options: [
          'body { margin: 8px; }（Chrome 預設）',
          '*, *::before, *::after { box-sizing: border-box; }',
          'html { font-size: 0; }',
          'div, span { display: block; }',
        ],
        answer: 1,
        explanation: '`*, *::before, *::after { box-sizing: border-box; }` 是現代 CSS Reset 最重要的規則之一。預設 `box-sizing: content-box` 讓 width/height 不包含 padding 和 border，設定 border-box 讓 width/height 包含 padding 和 border，計算尺寸更直觀，大幅減少佈局計算錯誤。這條規則幾乎出現在所有現代 Reset / Normalize 方案中。',
      },
      {
        id: 6,
        question: '在高度客製化的設計系統中（如完全按稿切版），應優先選擇哪種方案？',
        options: [
          'Normalize.css，因為保留語意標籤的預設樣式',
          'CSS Reset，因為從零開始，完全掌控所有樣式，不受任何預設影響',
          '不使用任何 Reset，直接覆蓋需要修改的樣式',
          '使用 JS 動態套用樣式，不需要 CSS Reset',
        ],
        answer: 1,
        explanation: '高度客製化設計（完全按設計稿切版）通常選擇 CSS Reset，因為它清除所有瀏覽器預設，讓開發者完全掌控每個元素的外觀，不必擔心遺留的預設樣式干擾設計稿的實現。Normalize.css 更適合需要保留語意樣式或快速開發的場景（如文章內容網站，標題大小層級有語意意義）。',
      },
      {
        id: 7,
        question: '以下哪個描述正確說明了現代 CSS Reset 與傳統 Eric Meyer Reset 的差異？',
        options: [
          '兩者完全相同，只是版本不同',
          '現代 CSS Reset 更短小精簡，針對現代 HTML 的常見問題（如 img 底部空白、overflow-wrap），而非列舉所有 HTML 元素',
          '現代 CSS Reset 包含更多規則，覆蓋所有已知的瀏覽器 bug',
          '現代 CSS Reset 是 W3C 的官方標準',
        ],
        answer: 1,
        explanation: '現代 CSS Reset（如 Josh Comeau 的方案）比傳統 Eric Meyer Reset 短得多，不逐一列舉所有 HTML 元素，而是針對現代開發常見的痛點：`box-sizing: border-box` 全域設定、`img` 的 `display: block`（消除底部空白）、`overflow-wrap: break-word`（防止長字串溢出）、`font: inherit` 讓表單元素繼承字體等。現代瀏覽器的一致性已大幅提升，不需要像 2007 年時那樣大規模 Reset。',
      },
    ],
    keyPoints: [
      '各瀏覽器對 HTML 元素有不同的預設樣式（User Agent Stylesheet），CSS Reset 和 Normalize.css 都是為了解決跨瀏覽器不一致問題。',
      'CSS Reset（如 Eric Meyer Reset）激進地將所有預設樣式歸零，從空白開始；適合完全客製化設計。',
      'Normalize.css 保留有用的語意預設樣式，只修正跨瀏覽器不一致；適合快速開發和保留語意樣式的場景。',
      'Tailwind 的 Preflight 以 Normalize.css 為基礎，加上 box-sizing: border-box 等現代化設定。',
      '現代 CSS Reset 比傳統方案更短小，針對現代 HTML 痛點（box-sizing、img 底部空白、overflow-wrap）。',
      '`*, *::before, *::after { box-sizing: border-box; }` 是現代開發最重要的基礎 CSS 設定之一。',
    ],
  },
]
