export interface CssTestCase {
  label: string
  // Function body: receives (doc: Document, win: Window) => boolean
  test: string
}

export interface CssProblem {
  id: string
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  description: string
  requirements: string[]
  initialHtml: string
  initialCss: string
  testCases: CssTestCase[]
  hints?: string[]
  targetHtml?: string
  targetCss?: string
}

export interface CssLayoutEntry {
  kind: 'css'
  slug: string
  methodName: string
  title: string
  description: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  problems: CssProblem[]
}

export function isCssEntry(entry: unknown): entry is CssLayoutEntry {
  return typeof entry === 'object' && entry !== null && 'kind' in entry && (entry as { kind: unknown }).kind === 'css'
}

export const cssLayoutChallenges: CssLayoutEntry[] = [
  {
    slug: 'css-flex-basics',
    kind: 'css',
    category: 'Flexbox',
    difficulty: 'easy',
    methodName: 'Flexbox 基礎',
    title: 'Flexbox 基礎切版',
    description: '學習 Flexbox 排版的基本用法，實現各種常見排版需求',
    problems: [
      {
        id: 'center',
        title: '水平垂直置中',
        difficulty: 'easy',
        description: '使用 Flexbox 讓 .container 內的 .box 同時達到水平與垂直置中效果。',
        requirements: [
          '.container 使用 display: flex',
          '.box 水平置中（justify-content: center）',
          '.box 垂直置中（align-items: center）',
        ],
        initialHtml:
          '<div class="container">\n  <div class="box">置中</div>\n</div>',
        initialCss:
          '.container { width: 400px; height: 300px; background-color: #1e293b; border: 2px solid #334155; /* 加入 Flexbox 讓 .box 置中 */ }\n' +
          '.box { width: 100px; height: 100px; background-color: #3b82f6; color: white; font-size: 14px; display: flex; align-items: center; justify-content: center; border-radius: 8px; }',
        hints: [
          '在 .container 加入 display: flex',
          'justify-content 控制主軸（水平）',
          'align-items 控制交叉軸（垂直）',
        ],
        testCases: [
          {
            label: '.container 必須設定 display: flex',
            test: "const el = doc.querySelector('.container'); if (!el) return false; return win.getComputedStyle(el).display === 'flex';",
          },
          {
            label: '.container 必須設定 justify-content: center',
            test: "const el = doc.querySelector('.container'); if (!el) return false; return win.getComputedStyle(el).justifyContent === 'center';",
          },
          {
            label: '.container 必須設定 align-items: center',
            test: "const el = doc.querySelector('.container'); if (!el) return false; return win.getComputedStyle(el).alignItems === 'center';",
          },
        ],
      },
      {
        id: 'navbar',
        title: '導覽列布局',
        difficulty: 'easy',
        description:
          '使用 Flexbox 實現常見導覽列：左側是品牌 Logo，右側是導覽連結水平並排。',
        requirements: [
          '.navbar 使用 display: flex 並 align-items: center',
          '.navbar 使用 justify-content: space-between',
          '.nav-links 使用 display: flex 讓連結水平排列',
        ],
        initialHtml:
          '<nav class="navbar">\n' +
          '  <div class="logo">MyBrand</div>\n' +
          '  <ul class="nav-links">\n' +
          '    <li><a href="#">首頁</a></li>\n' +
          '    <li><a href="#">關於</a></li>\n' +
          '    <li><a href="#">服務</a></li>\n' +
          '    <li><a href="#">聯絡</a></li>\n' +
          '  </ul>\n' +
          '</nav>',
        initialCss:
          '.navbar { width: 100%; padding: 0 24px; height: 60px; background-color: #0f172a; box-sizing: border-box; /* 加入 flex 屬性讓 logo 靠左、連結靠右 */ }\n' +
          '.logo { color: #60a5fa; font-size: 20px; font-weight: 700; }\n' +
          '.nav-links { list-style: none; margin: 0; padding: 0; /* 加入 flex 讓連結水平排列 */ }\n' +
          '.nav-links li { margin-left: 24px; }\n' +
          '.nav-links a { color: #cbd5e1; text-decoration: none; font-size: 14px; }\n' +
          '.nav-links a:hover { color: #f8fafc; }',
        hints: [
          '在 .navbar 加入 display: flex',
          'justify-content: space-between 讓左右元素分開',
          'align-items: center 讓連結垂直置中',
          '在 .nav-links 加入 display: flex 讓 li 水平排列',
        ],
        testCases: [
          {
            label: '.navbar 必須設定 display: flex',
            test: "const el = doc.querySelector('.navbar'); if (!el) return false; return win.getComputedStyle(el).display === 'flex';",
          },
          {
            label: '.navbar 必須設定 justify-content: space-between',
            test: "const el = doc.querySelector('.navbar'); if (!el) return false; return win.getComputedStyle(el).justifyContent === 'space-between';",
          },
          {
            label: '.nav-links 必須設定 display: flex',
            test: "const el = doc.querySelector('.nav-links'); if (!el) return false; return win.getComputedStyle(el).display === 'flex';",
          },
        ],
      },
      {
        id: 'card-wrap',
        title: '卡片換行排列',
        difficulty: 'easy',
        description:
          '使用 flex-wrap: wrap 讓卡片超出寬度時自動換行，並用 gap 控制間距。',
        requirements: [
          '.container 使用 display: flex',
          '.container 使用 flex-wrap: wrap',
          '.container 使用 gap 設定間距',
          '.card 設定適當寬度（約 30%）',
        ],
        initialHtml:
          '<div class="container">\n' +
          '  <div class="card">Card 1</div>\n' +
          '  <div class="card">Card 2</div>\n' +
          '  <div class="card">Card 3</div>\n' +
          '  <div class="card">Card 4</div>\n' +
          '  <div class="card">Card 5</div>\n' +
          '  <div class="card">Card 6</div>\n' +
          '</div>',
        initialCss:
          '.container { width: 500px; padding: 16px; background-color: #1e293b; box-sizing: border-box; /* 加入 flex、flex-wrap 與 gap */ }\n' +
          '.card { width: 30%; padding: 24px 16px; background-color: #334155; color: #f1f5f9; font-size: 14px; font-weight: 600; border-radius: 8px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; }',
        hints: [
          '在 .container 加入 display: flex',
          'flex-wrap: wrap 讓卡片超出寬度時換行',
          'gap 屬性可同時設定欄與列的間距',
        ],
        testCases: [
          {
            label: '.container 必須設定 display: flex',
            test: "const el = doc.querySelector('.container'); if (!el) return false; return win.getComputedStyle(el).display === 'flex';",
          },
          {
            label: '.container 必須設定 flex-wrap: wrap',
            test: "const el = doc.querySelector('.container'); if (!el) return false; return win.getComputedStyle(el).flexWrap === 'wrap';",
          },
          {
            label: '.container 必須設定 gap（間距不為 0px）',
            test: "const el = doc.querySelector('.container'); if (!el) return false; const style = win.getComputedStyle(el); return style.gap !== '0px' || style.rowGap !== '0px' || style.columnGap !== '0px';",
          },
          {
            label: '.card 寬度應小於 container 寬度的一半',
            test: "const container = doc.querySelector('.container'); const card = doc.querySelector('.card'); if (!container || !card) return false; return card.offsetWidth < container.offsetWidth / 2;",
          },
        ],
      },
    ],
  },
  {
    slug: 'css-flex-advanced',
    kind: 'css',
    category: 'Flexbox',
    difficulty: 'medium',
    methodName: 'Flexbox 進階',
    title: 'Flexbox 進階應用',
    description: '深入學習 flex-grow、align-self、sticky footer 等 Flexbox 進階技巧',
    problems: [
      {
        id: 'flex-grow',
        title: '彈性比例分配',
        difficulty: 'medium',
        description:
          '使用 flex-grow 讓主內容區自動佔據剩餘空間，側欄保持固定寬度。',
        requirements: [
          '.row 使用 display: flex',
          '.sidebar 固定寬度 200px',
          '.main 使用 flex-grow: 1 佔據剩餘空間',
        ],
        initialHtml:
          '<div class="row">\n' +
          '  <aside class="sidebar">側欄</aside>\n' +
          '  <main class="main">主內容區</main>\n' +
          '</div>',
        initialCss:
          '.row { width: 600px; height: 400px; background-color: #0f172a; /* 加入 display: flex */ }\n' +
          '.sidebar { width: 200px; background-color: #1e3a5f; color: #93c5fd; padding: 16px; box-sizing: border-box; font-size: 14px; }\n' +
          '.main { background-color: #1e293b; color: #e2e8f0; padding: 16px; box-sizing: border-box; font-size: 14px; /* 加入 flex-grow: 1 */ }',
        hints: [
          '在 .row 加入 display: flex',
          'flex-grow: 1 讓 .main 自動填滿剩餘空間',
          '.sidebar 已設定固定寬度，不需要加 flex-grow',
        ],
        testCases: [
          {
            label: '.row 必須設定 display: flex',
            test: "const el = doc.querySelector('.row'); if (!el) return false; return win.getComputedStyle(el).display === 'flex';",
          },
          {
            label: '.sidebar 寬度必須為 200px',
            test: "const el = doc.querySelector('.sidebar'); if (!el) return false; return win.getComputedStyle(el).width === '200px';",
          },
          {
            label: '.main 必須設定 flex-grow: 1',
            test: "const el = doc.querySelector('.main'); if (!el) return false; return win.getComputedStyle(el).flexGrow === '1';",
          },
        ],
      },
      {
        id: 'align-self',
        title: '個別交叉軸對齊',
        difficulty: 'medium',
        description:
          '使用 align-self 讓同一行中不同 box 有不同的垂直對齊方式。',
        requirements: [
          '.container 使用 display: flex，align-items: stretch（預設）',
          '.box-top 使用 align-self: flex-start',
          '.box-bottom 使用 align-self: flex-end',
        ],
        initialHtml:
          '<div class="container">\n' +
          '  <div class="box box-top">Top</div>\n' +
          '  <div class="box box-mid">Mid</div>\n' +
          '  <div class="box box-bottom">Bottom</div>\n' +
          '</div>',
        initialCss:
          '.container { width: 400px; height: 300px; background-color: #1e293b; border: 2px solid #334155; /* 加入 display: flex */ }\n' +
          '.box { width: 80px; padding: 12px; background-color: #3b82f6; color: white; font-size: 13px; font-weight: 600; border-radius: 6px; display: flex; align-items: center; justify-content: center; margin: 0 8px; }\n' +
          '.box-top { background-color: #10b981; /* 加入 align-self: flex-start */ }\n' +
          '.box-mid { background-color: #3b82f6; }\n' +
          '.box-bottom { background-color: #ef4444; /* 加入 align-self: flex-end */ }',
        hints: [
          '在 .container 加入 display: flex',
          'align-self 覆蓋父元素的 align-items 設定',
          'flex-start 對齊頂部，flex-end 對齊底部',
        ],
        testCases: [
          {
            label: '.container 必須設定 display: flex',
            test: "const el = doc.querySelector('.container'); if (!el) return false; return win.getComputedStyle(el).display === 'flex';",
          },
          {
            label: '.box-top 必須設定 align-self: flex-start',
            test: "const el = doc.querySelector('.box-top'); if (!el) return false; return win.getComputedStyle(el).alignSelf === 'flex-start';",
          },
          {
            label: '.box-bottom 必須設定 align-self: flex-end',
            test: "const el = doc.querySelector('.box-bottom'); if (!el) return false; return win.getComputedStyle(el).alignSelf === 'flex-end';",
          },
        ],
      },
      {
        id: 'sticky-footer',
        title: 'Sticky Footer 佈局',
        difficulty: 'medium',
        description:
          '使用 Flexbox 讓 footer 永遠貼底：即使內容不足，footer 仍在頁面底部。',
        requirements: [
          '.page 使用 display: flex; flex-direction: column',
          '.page 使用 min-height: 100vh',
          'main 使用 flex: 1（或 flex-grow: 1）讓主內容撐滿剩餘空間',
        ],
        initialHtml:
          '<div class="page">\n' +
          '  <header class="header">Header</header>\n' +
          '  <main class="main">內容很少，但 footer 要貼底</main>\n' +
          '  <footer class="footer">Footer</footer>\n' +
          '</div>',
        initialCss:
          '.page { background-color: #0f172a; /* 加入 display: flex; flex-direction: column; min-height: 100vh */ }\n' +
          '.header { background-color: #1e3a5f; color: #93c5fd; padding: 16px 24px; font-size: 18px; font-weight: 700; }\n' +
          '.main { background-color: #1e293b; color: #e2e8f0; padding: 24px; font-size: 14px; /* 加入 flex: 1 */ }\n' +
          '.footer { background-color: #0f172a; border-top: 1px solid #334155; color: #64748b; padding: 16px 24px; font-size: 13px; text-align: center; }',
        hints: [
          '在 .page 加入 display: flex 和 flex-direction: column',
          'min-height: 100vh 讓 .page 至少佔滿整個視窗高度',
          'flex: 1 或 flex-grow: 1 讓 main 撐滿剩餘空間',
        ],
        testCases: [
          {
            label: '.page 必須設定 display: flex',
            test: "const el = doc.querySelector('.page'); if (!el) return false; return win.getComputedStyle(el).display === 'flex';",
          },
          {
            label: '.page 必須設定 flex-direction: column',
            test: "const el = doc.querySelector('.page'); if (!el) return false; return win.getComputedStyle(el).flexDirection === 'column';",
          },
          {
            label: '.page 必須設定 min-height 包含 100vh 或 100%',
            test: "const sheets = Array.from(doc.styleSheets); const s = sheets.find(sh => !sh.href); try { const rules = Array.from(s.cssRules); for (const r of rules) { if (r.cssText && r.cssText.includes('min-height') && (r.cssText.includes('100vh') || r.cssText.includes('100%'))) return true; } } catch(e) {} return false;",
          },
          {
            label: 'main 必須設定 flex-grow: 1',
            test: "const el = doc.querySelector('.main'); if (!el) return false; return win.getComputedStyle(el).flexGrow === '1';",
          },
        ],
      },
      {
        id: 'flex-equal',
        title: '全部元素都加 flex-1（絕對均分卡片）',
        difficulty: 'easy',
        description: 'flex: 1 是 flex-grow: 1; flex-shrink: 1; flex-basis: 0% 的縮寫。讓所有卡片從 0 開始平均分配空間，不論內容多寡都完全等寬。',
        requirements: [
          '.container 使用 display: flex 和 gap',
          '每個 .card 加上 flex: 1（從 0 開始等比分配）',
          '三張卡片寬度完全相同（各佔約 1/3）',
        ],
        hints: [
          'flex: 1 等同於 flex-grow: 1; flex-shrink: 1; flex-basis: 0%',
          'flex-basis: 0% 讓每個元素從 0 開始分配，確保完全等寬',
          '若只設 flex-grow: 1 但不改 flex-basis，初始內容寬度會影響最終大小',
        ],
        initialHtml: '<div class="container">\n  <div class="card">Card A（字少）</div>\n  <div class="card">Card B（這是一串非常長的描述文字，會撐寬元素）</div>\n  <div class="card">Card C</div>\n</div>',
        initialCss: '.container {\n  display: flex;\n  gap: 12px;\n  padding: 20px;\n  background: #0f172a;\n  width: 600px;\n}\n\n.card {\n  /* TODO: 加入 flex: 1 讓三張卡片完全等寬 */\n  background: #3b82f6;\n  color: white;\n  padding: 20px 12px;\n  border-radius: 8px;\n  text-align: center;\n  font-size: 14px;\n  font-weight: 600;\n}',
        testCases: [
          {
            label: '.container 使用 display: flex',
            test: "const el = doc.querySelector('.container'); if (!el) return false; return win.getComputedStyle(el).display === 'flex';",
          },
          {
            label: '.card 的 flex-grow 為 1',
            test: "const el = doc.querySelector('.card'); if (!el) return false; return win.getComputedStyle(el).flexGrow === '1';",
          },
          {
            label: '.card 的 flex-basis 為 0%（確保完全等寬）',
            test: "const el = doc.querySelector('.card'); if (!el) return false; return win.getComputedStyle(el).flexBasis === '0%';",
          },
          {
            label: '三張卡片寬度相同',
            test: "const cards = Array.from(doc.querySelectorAll('.card')); if (cards.length < 2) return false; const widths = cards.map(c => c.getBoundingClientRect().width); return widths.every(w => Math.abs(w - widths[0]) < 2);",
          },
        ],
      },
      {
        id: 'flex-sidebar-layout',
        title: '左欄固定，右欄加 flex-1（側邊欄版型）',
        difficulty: 'easy',
        description: '最常見的管理後台版型：左側 Sidebar 固定寬度（如 192px），右側 Main Content 用 flex: 1 自動填滿剩餘空間。',
        requirements: [
          '.layout 使用 display: flex',
          '.sidebar 固定寬度 192px（不隨容器縮放）',
          '.main 使用 flex: 1 填滿剩餘空間',
          '.sidebar 使用 flex-shrink: 0 防止被壓縮',
        ],
        hints: [
          '.layout 加 display: flex',
          '.sidebar { width: 192px; flex-shrink: 0 } 固定寬度且不被壓縮',
          '.main { flex: 1 } 自動填滿剩餘空間',
        ],
        initialHtml: '<div class="layout">\n  <aside class="sidebar">Sidebar（固定 192px）</aside>\n  <main class="main">Main Content（flex-1 吃滿剩餘空間）</main>\n</div>',
        initialCss: '.layout {\n  width: 700px;\n  height: 400px;\n  background: #0f172a;\n  /* TODO: 加入 display: flex */\n}\n\n.sidebar {\n  width: 192px;\n  background: #7c3aed;\n  color: white;\n  padding: 20px 16px;\n  font-size: 14px;\n  font-weight: 600;\n  /* TODO: 加入 flex-shrink: 0 防止被壓縮 */\n}\n\n.main {\n  background: #1e293b;\n  color: #e2e8f0;\n  padding: 20px;\n  font-size: 14px;\n  /* TODO: 加入 flex: 1 填滿剩餘空間 */\n}',
        testCases: [
          {
            label: '.layout 使用 display: flex',
            test: "const el = doc.querySelector('.layout'); if (!el) return false; return win.getComputedStyle(el).display === 'flex';",
          },
          {
            label: '.sidebar 寬度固定 192px',
            test: "const el = doc.querySelector('.sidebar'); if (!el) return false; return win.getComputedStyle(el).width === '192px';",
          },
          {
            label: '.sidebar 使用 flex-shrink: 0',
            test: "const el = doc.querySelector('.sidebar'); if (!el) return false; return win.getComputedStyle(el).flexShrink === '0';",
          },
          {
            label: '.main 使用 flex-grow: 1',
            test: "const el = doc.querySelector('.main'); if (!el) return false; return win.getComputedStyle(el).flexGrow === '1';",
          },
        ],
      },
      {
        id: 'shrink-zero',
        title: '使用 shrink-0 防止 Icon / 大頭照變形',
        difficulty: 'medium',
        description: '列表項目中，左側 Avatar 搭配右側長文字是常見場景。若不加 flex-shrink: 0，Avatar 會被文字擠壓變形。右側文字區則需要 min-width: 0 才能讓 overflow: hidden 和 text-overflow: ellipsis 生效。',
        requirements: [
          '.message 使用 display: flex 和 gap，align-items: center',
          '.avatar 使用 flex-shrink: 0 防止被壓縮',
          '.text 使用 min-width: 0 讓 overflow: hidden 生效',
          '.text p 使用 overflow: hidden; text-overflow: ellipsis; white-space: nowrap',
        ],
        hints: [
          'flex 子元素預設 flex-shrink: 1，空間不足時會被壓縮',
          '.avatar { flex-shrink: 0 } 固定大頭照不變形',
          '.text { min-width: 0 } — flex 子元素預設 min-width: auto，這會阻止 overflow: hidden 生效',
        ],
        initialHtml: '<div class="list">\n  <div class="message">\n    <div class="avatar">AV</div>\n    <div class="text">\n      <strong>使用者名稱</strong>\n      <p>這是一串非常長的聊天訊息內容這是一串非常長的聊天訊息內容這是一串非常長的聊天訊息內容</p>\n    </div>\n  </div>\n  <div class="message">\n    <div class="avatar">BV</div>\n    <div class="text">\n      <strong>另一個使用者</strong>\n      <p>短訊息</p>\n    </div>\n  </div>\n</div>',
        initialCss: '.list {\n  width: 400px;\n  background: #0f172a;\n  padding: 16px;\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n\n.message {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  background: #1e293b;\n  padding: 12px;\n  border-radius: 10px;\n}\n\n.avatar {\n  width: 40px;\n  height: 40px;\n  border-radius: 50%;\n  background: #10b981;\n  color: white;\n  font-size: 12px;\n  font-weight: 700;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  /* TODO: 加入 flex-shrink: 0 防止被壓縮 */\n}\n\n.text {\n  /* TODO: 加入 min-width: 0 讓 overflow: hidden 生效 */\n}\n\n.text strong {\n  display: block;\n  color: #e2e8f0;\n  font-size: 14px;\n  margin-bottom: 2px;\n}\n\n.text p {\n  color: #94a3b8;\n  font-size: 13px;\n  /* TODO: 加入 overflow: hidden; text-overflow: ellipsis; white-space: nowrap */\n}',
        testCases: [
          {
            label: '.avatar 使用 flex-shrink: 0',
            test: "const el = doc.querySelector('.avatar'); if (!el) return false; return win.getComputedStyle(el).flexShrink === '0';",
          },
          {
            label: '.text 使用 min-width: 0',
            test: "const el = doc.querySelector('.text'); if (!el) return false; return win.getComputedStyle(el).minWidth === '0px';",
          },
          {
            label: '.text p 使用 overflow: hidden',
            test: "const el = doc.querySelector('.text p'); if (!el) return false; return win.getComputedStyle(el).overflow === 'hidden';",
          },
          {
            label: '.text p 使用 text-overflow: ellipsis',
            test: "const el = doc.querySelector('.text p'); if (!el) return false; return win.getComputedStyle(el).textOverflow === 'ellipsis';",
          },
        ],
      },
      {
        id: 'flex-shrink',
        title: 'flex-shrink：控制縮小比例',
        difficulty: 'medium',
        description: 'flex-shrink 決定空間不足時元素縮小的比例。預設值為 1（會縮小）。設為 0 表示不縮小（固定尺寸）。這道題讓你親眼看見差別。',
        requirements: [
          '.container 使用 display: flex，總寬度小於子元素之和',
          '.box-a 使用 flex-shrink: 1（預設，允許縮小）',
          '.box-b 使用 flex-shrink: 0（不縮小，保持原始寬度 200px）',
          '.box-c 使用 flex-shrink: 2（縮小速度是 .box-a 的 2 倍）',
        ],
        hints: [
          'flex-shrink 預設值是 1，所有子元素等比縮小',
          'flex-shrink: 0 讓元素不縮小，固定在 flex-basis 或 width 設定的大小',
          'flex-shrink: 2 縮小速度是 flex-shrink: 1 的兩倍',
        ],
        initialHtml: '<div class="container">\n  <div class="box box-a">A（shrink: 1）</div>\n  <div class="box box-b">B（shrink: 0，固定）</div>\n  <div class="box box-c">C（shrink: 2）</div>\n</div>',
        initialCss: '.container {\n  display: flex;\n  width: 500px;\n  gap: 8px;\n  padding: 16px;\n  background: #0f172a;\n}\n\n.box {\n  width: 200px;\n  height: 80px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: white;\n  font-size: 13px;\n  font-weight: 600;\n  border-radius: 8px;\n  text-align: center;\n  padding: 8px;\n}\n\n.box-a {\n  background: #3b82f6;\n  /* TODO: flex-shrink: 1 */\n}\n\n.box-b {\n  background: #10b981;\n  /* TODO: flex-shrink: 0（不縮小） */\n}\n\n.box-c {\n  background: #f59e0b;\n  /* TODO: flex-shrink: 2（縮小兩倍快） */\n}',
        testCases: [
          {
            label: '.box-a 的 flex-shrink 為 1',
            test: "const el = doc.querySelector('.box-a'); if (!el) return false; return win.getComputedStyle(el).flexShrink === '1';",
          },
          {
            label: '.box-b 的 flex-shrink 為 0（不縮小）',
            test: "const el = doc.querySelector('.box-b'); if (!el) return false; return win.getComputedStyle(el).flexShrink === '0';",
          },
          {
            label: '.box-c 的 flex-shrink 為 2',
            test: "const el = doc.querySelector('.box-c'); if (!el) return false; return win.getComputedStyle(el).flexShrink === '2';",
          },
          {
            label: '.box-b 寬度維持 200px（不縮小）',
            test: "const el = doc.querySelector('.box-b'); if (!el) return false; return Math.abs(el.getBoundingClientRect().width - 200) < 2;",
          },
        ],
      },
      {
        id: 'flex-basis',
        title: 'flex-basis：設定初始基準尺寸',
        difficulty: 'medium',
        description: 'flex-basis 設定 flex 子元素在分配剩餘空間前的初始大小。與 width 的差別：flex-basis 只在 flex 容器中有效，且 flex-grow/shrink 從這個值開始計算。',
        requirements: [
          '.container 使用 display: flex',
          '.item-auto 使用 flex-basis: auto（依內容決定初始寬度）',
          '.item-fixed 使用 flex-basis: 200px（固定初始寬度 200px）',
          '.item-percent 使用 flex-basis: 40%（初始佔容器 40%）',
        ],
        hints: [
          'flex-basis: auto 表示以 width 或內容寬度為基準',
          'flex-basis: 200px 設定初始寬度，之後再由 flex-grow/shrink 調整',
          'flex-basis 優先於 width（在 flex 容器中）',
        ],
        initialHtml: '<div class="container">\n  <div class="item item-auto">auto（依內容）</div>\n  <div class="item item-fixed">200px（固定基準）</div>\n  <div class="item item-percent">40%（百分比）</div>\n</div>',
        initialCss: '.container {\n  display: flex;\n  gap: 8px;\n  padding: 16px;\n  background: #0f172a;\n  width: 600px;\n}\n\n.item {\n  height: 80px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: white;\n  font-size: 13px;\n  font-weight: 600;\n  border-radius: 8px;\n  text-align: center;\n  padding: 8px;\n}\n\n.item-auto {\n  background: #6366f1;\n  /* TODO: flex-basis: auto */\n}\n\n.item-fixed {\n  background: #0891b2;\n  /* TODO: flex-basis: 200px */\n}\n\n.item-percent {\n  background: #059669;\n  /* TODO: flex-basis: 40% */\n}',
        testCases: [
          {
            label: '.item-auto 的 flex-basis 為 auto',
            test: "const el = doc.querySelector('.item-auto'); if (!el) return false; return win.getComputedStyle(el).flexBasis === 'auto';",
          },
          {
            label: '.item-fixed 的 flex-basis 為 200px',
            test: "const el = doc.querySelector('.item-fixed'); if (!el) return false; return win.getComputedStyle(el).flexBasis === '200px';",
          },
          {
            label: '.item-percent 的 flex-basis 為百分比（非 auto 也非 px）',
            test: "const el = doc.querySelector('.item-percent'); if (!el) return false; const fb = win.getComputedStyle(el).flexBasis; return fb.includes('%');",
          },
        ],
      },
      {
        id: 'align-items-vs-content',
        title: 'align-items 與 align-content 的差別',
        difficulty: 'hard',
        description: 'align-items：控制單行內每個項目在交叉軸的對齊位置。align-content：控制多行（需有 flex-wrap）整體在交叉軸的分布。兩者容易混淆，這道題讓你親眼觀察差異。',
        requirements: [
          '.container-a 使用 flex-wrap: wrap，align-items: center（每行內置中）',
          '.container-b 使用 flex-wrap: wrap，align-content: center（整體置中）',
          '兩個容器都設定足夠高度（min-height: 300px）讓差異明顯',
          '子元素有不同高度以突顯 align-items 的效果',
        ],
        hints: [
          'align-items: center 讓每行內的子元素垂直置中（每行各自計算）',
          'align-content: center 讓所有行整體相對容器垂直置中',
          '若只有一行，align-content 不起作用；align-items 才有效',
          '兩者同時設定時，align-content 優先（多行情況）',
        ],
        initialHtml: '<div class="demo">\n  <div class="label">align-items: center（每行內置中）</div>\n  <div class="container container-a">\n    <div class="box tall">高 80px</div>\n    <div class="box short">矮</div>\n    <div class="box tall">高 80px</div>\n    <div class="box short">矮</div>\n    <div class="box tall">高 80px</div>\n    <div class="box short">矮</div>\n  </div>\n\n  <div class="label">align-content: center（多行整體置中）</div>\n  <div class="container container-b">\n    <div class="box">1</div>\n    <div class="box">2</div>\n    <div class="box">3</div>\n    <div class="box">4</div>\n    <div class="box">5</div>\n    <div class="box">6</div>\n  </div>\n</div>',
        initialCss: '.demo {\n  background: #0f172a;\n  padding: 20px;\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n\n.label {\n  color: #94a3b8;\n  font-size: 13px;\n  font-weight: 600;\n}\n\n.container {\n  width: 100%;\n  min-height: 300px;\n  background: #1e293b;\n  border: 1px solid #334155;\n  border-radius: 8px;\n  padding: 12px;\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n  /* container-a: TODO 加入 align-items: center */\n  /* container-b: TODO 加入 align-content: center */\n}\n\n.box {\n  width: 80px;\n  background: #6366f1;\n  color: white;\n  font-size: 12px;\n  font-weight: 600;\n  border-radius: 6px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 40px;\n}\n\n.tall { height: 80px; background: #7c3aed; }\n\n.container-a { /* TODO: align-items: center */ }\n.container-b { /* TODO: align-content: center */ }',
        testCases: [
          {
            label: '.container 使用 flex-wrap: wrap',
            test: "const el = doc.querySelector('.container'); if (!el) return false; return win.getComputedStyle(el).flexWrap === 'wrap';",
          },
          {
            label: '.container-a 使用 align-items: center',
            test: "const el = doc.querySelector('.container-a'); if (!el) return false; return win.getComputedStyle(el).alignItems === 'center';",
          },
          {
            label: '.container-b 使用 align-content: center',
            test: "const el = doc.querySelector('.container-b'); if (!el) return false; return win.getComputedStyle(el).alignContent === 'center';",
          },
        ],
      },
    ],
  },
  {
    slug: 'css-grid-basics',
    kind: 'css',
    category: 'Grid',
    difficulty: 'easy',
    methodName: 'Grid 基礎',
    title: 'CSS Grid 基礎切版',
    description: '學習 CSS Grid 的基本用法，建立各種常見網格佈局',
    problems: [
      {
        id: 'three-col',
        title: '三欄等寬布局',
        difficulty: 'easy',
        description: '使用 CSS Grid 建立三欄等寬布局，並設定適當的間距。',
        requirements: [
          '.grid 使用 display: grid',
          '.grid 使用 grid-template-columns: repeat(3, 1fr)',
          '.grid 使用 gap 設定欄位間距',
        ],
        initialHtml:
          "<div class=\"grid\">\n  <div class=\"item\">1</div>\n  <div class=\"item\">2</div>\n  <div class=\"item\">3</div>\n  <div class=\"item\">4</div>\n  <div class=\"item\">5</div>\n  <div class=\"item\">6</div>\n</div>",
        initialCss:
          ".grid {\n  background: #1e293b;\n  padding: 16px;\n  /* 在此加入 grid 屬性 */\n}\n\n.item {\n  background: #3b82f6;\n  color: white;\n  padding: 24px;\n  text-align: center;\n  border-radius: 8px;\n  font-weight: bold;\n  font-size: 1.2rem;\n}",
        hints: [
          'display: grid 宣告網格容器',
          'repeat(3, 1fr) 建立三個等寬欄位',
          'gap 同時控制行距與欄距',
        ],
        testCases: [
          {
            label: '.grid 必須設定 display: grid',
            test: `const el = doc.querySelector('.grid')
if (!el) return false
return win.getComputedStyle(el).display === 'grid'`,
          },
          {
            label: '.grid 必須設定三欄 grid-template-columns',
            test: `const el = doc.querySelector('.grid')
if (!el) return false
const cols = win.getComputedStyle(el).gridTemplateColumns.trim().split(/\\s+/)
return cols.length === 3`,
          },
          {
            label: '.grid 必須設定 gap（間距不得為 0）',
            test: `const el = doc.querySelector('.grid')
if (!el) return false
const style = win.getComputedStyle(el)
return style.gap !== '0px' && style.columnGap !== '0px'`,
          },
        ],
      },
      {
        id: 'grid-areas',
        title: '具名網格區域',
        difficulty: 'medium',
        description:
          '使用 grid-template-areas 建立清晰易懂的頁面佈局（Header / Sidebar + Main / Footer）。',
        requirements: [
          '.layout 使用 display: grid',
          '.layout 設定 grid-template-areas 定義區域',
          '各子元素使用 grid-area 指定所在區域',
        ],
        initialHtml:
          "<div class=\"layout\">\n  <header class=\"header\">Header</header>\n  <nav class=\"sidebar\">Sidebar</nav>\n  <main class=\"main\">Main Content</main>\n  <footer class=\"footer\">Footer</footer>\n</div>",
        initialCss:
          ".layout {\n  height: 100vh;\n  background: #0f172a;\n  /* 在此加入 grid-template-areas 等屬性 */\n}\n\n.header  { background: #6366f1; color: white; padding: 16px; }\n.sidebar { background: #8b5cf6; color: white; padding: 16px; }\n.main    { background: #06b6d4; color: white; padding: 16px; }\n.footer  { background: #64748b; color: white; padding: 16px; }",
        hints: [
          '先在 .layout 定義 grid-template-areas: "header header" "sidebar main" "footer footer"',
          '每個子元素用 grid-area: header 等來對應',
        ],
        testCases: [
          {
            label: '.layout 必須設定 display: grid',
            test: `const el = doc.querySelector('.layout')
if (!el) return false
return win.getComputedStyle(el).display === 'grid'`,
          },
          {
            label: '.layout 必須設定 grid-template-areas',
            test: `const el = doc.querySelector('.layout')
if (!el) return false
return win.getComputedStyle(el).gridTemplateAreas !== 'none'`,
          },
          {
            label: '.header 必須使用 grid-area 指定所在區域',
            test: `const el = doc.querySelector('.header')
if (!el) return false
return win.getComputedStyle(el).gridArea !== 'auto'`,
          },
        ],
      },
      {
        id: 'auto-fill',
        title: '響應式自動填充',
        difficulty: 'medium',
        description:
          '使用 repeat(auto-fill, minmax()) 建立響應式網格，讓卡片數量根據容器寬度自動調整。',
        requirements: [
          '.grid 使用 display: grid',
          '.grid 使用 repeat(auto-fill, minmax(180px, 1fr))',
          '.grid 設定 gap',
        ],
        initialHtml:
          "<div class=\"grid\">\n  <div class=\"card\">Card 1</div>\n  <div class=\"card\">Card 2</div>\n  <div class=\"card\">Card 3</div>\n  <div class=\"card\">Card 4</div>\n  <div class=\"card\">Card 5</div>\n  <div class=\"card\">Card 6</div>\n  <div class=\"card\">Card 7</div>\n  <div class=\"card\">Card 8</div>\n</div>",
        initialCss:
          ".grid {\n  background: #1e293b;\n  padding: 16px;\n  /* 在此加入 auto-fill 屬性 */\n}\n\n.card {\n  background: #10b981;\n  color: white;\n  padding: 24px;\n  border-radius: 8px;\n  text-align: center;\n  font-weight: bold;\n}",
        hints: [
          'grid-template-columns: repeat(auto-fill, minmax(180px, 1fr))',
          'auto-fill 會根據容器寬度自動決定欄數',
          'minmax(min, max) 設定每欄的最小和最大寬度',
        ],
        testCases: [
          {
            label: '.grid 必須設定 display: grid',
            test: `const el = doc.querySelector('.grid')
if (!el) return false
return win.getComputedStyle(el).display === 'grid'`,
          },
          {
            label: '樣式表中必須包含 auto-fill 或 auto-fit',
            test: `const s = Array.from(doc.styleSheets).find((sh) => !sh.href)
if (!s) return false
try {
  const rules = Array.from(s.cssRules)
  return rules.some(
    (r) =>
      r.cssText &&
      (r.cssText.includes('auto-fill') || r.cssText.includes('auto-fit'))
  )
} catch (e) {
  return false
}`,
          },
          {
            label: '.grid 必須設定 gap（欄距不得為 0）',
            test: `const el = doc.querySelector('.grid')
if (!el) return false
return win.getComputedStyle(el).columnGap !== '0px'`,
          },
        ],
      },
    ],
  },
  {
    slug: 'css-grid-advanced',
    kind: 'css',
    category: 'Grid',
    difficulty: 'hard',
    methodName: 'Grid 進階',
    title: 'CSS Grid 進階應用',
    description:
      '挑戰 Grid 的進階用法：聖杯佈局、跨欄排版、儀表板設計',
    problems: [
      {
        id: 'holy-grail',
        title: '聖杯佈局',
        difficulty: 'hard',
        description:
          '使用 CSS Grid 實現經典「聖杯佈局」：頂部 Header、底部 Footer，中間三欄（左側欄 + 主內容 + 右側欄）。',
        requirements: [
          '.page 使用 display: grid',
          '定義 grid-template-rows 和 grid-template-columns',
          '.header 和 .footer 各自跨越所有欄位',
        ],
        initialHtml:
          "<div class=\"page\">\n  <header class=\"header\">Header</header>\n  <aside class=\"sidebar-left\">Left Sidebar</aside>\n  <main class=\"main\">Main Content</main>\n  <aside class=\"sidebar-right\">Right Sidebar</aside>\n  <footer class=\"footer\">Footer</footer>\n</div>",
        initialCss:
          ".page {\n  min-height: 100vh;\n  /* 在此加入 grid 屬性 */\n}\n\n.header       { background: #6366f1; color: white; padding: 16px; }\n.sidebar-left  { background: #8b5cf6; color: white; padding: 16px; }\n.main          { background: #06b6d4; color: white; padding: 16px; }\n.sidebar-right { background: #8b5cf6; color: white; padding: 16px; }\n.footer        { background: #64748b; color: white; padding: 16px; }",
        hints: [
          'grid-template-columns: 200px 1fr 200px',
          'grid-template-rows: auto 1fr auto',
          '.header 和 .footer 使用 grid-column: 1 / -1 跨全欄',
        ],
        testCases: [
          {
            label: '.page 必須設定 display: grid',
            test: `const el = doc.querySelector('.page')
if (!el) return false
return win.getComputedStyle(el).display === 'grid'`,
          },
          {
            label: ".header 必須跨越全部欄位（gridColumnStart === '1' 且 end 不為 '2'）",
            test: `const header = doc.querySelector('.header')
if (!header) return false
const style = win.getComputedStyle(header)
return style.gridColumnStart === '1' && style.gridColumnEnd !== '2'`,
          },
          {
            label: '.page 的 grid-template-columns 必須定義三欄',
            test: `const el = doc.querySelector('.page')
if (!el) return false
const cols = win.getComputedStyle(el).gridTemplateColumns.trim().split(/\\s+/)
return cols.length === 3`,
          },
        ],
      },
      {
        id: 'photo-gallery',
        title: '照片牆排版',
        difficulty: 'hard',
        description:
          '使用 grid-column 和 grid-row 的 span 讓特定照片佔據更大空間，建立雜誌感照片牆。',
        requirements: [
          '.gallery 使用 display: grid',
          '設定 grid-template-columns（4 欄）',
          '.featured 使用 grid-column: span 2 跨兩欄',
          '.featured 使用 grid-row: span 2 跨兩列',
        ],
        initialHtml:
          "<div class=\"gallery\">\n  <div class=\"photo featured\">Featured</div>\n  <div class=\"photo\">2</div>\n  <div class=\"photo\">3</div>\n  <div class=\"photo\">4</div>\n  <div class=\"photo\">5</div>\n  <div class=\"photo\">6</div>\n  <div class=\"photo\">7</div>\n  <div class=\"photo\">8</div>\n</div>",
        initialCss:
          ".gallery {\n  background: #0f172a;\n  padding: 12px;\n  /* 在此加入 grid 屬性 */\n}\n\n.photo {\n  background: #334155;\n  color: white;\n  padding: 24px;\n  text-align: center;\n  border-radius: 4px;\n  font-weight: bold;\n}\n\n.featured {\n  background: #f59e0b;\n  /* 在此加入 span 屬性 */\n}",
        hints: [
          '先設定 grid-template-columns: repeat(4, 1fr)',
          '.featured { grid-column: span 2; grid-row: span 2; }',
        ],
        testCases: [
          {
            label: '.gallery 必須設定 display: grid',
            test: `const el = doc.querySelector('.gallery')
if (!el) return false
return win.getComputedStyle(el).display === 'grid'`,
          },
          {
            label: '.gallery 的 grid-template-columns 必須定義四欄',
            test: `const el = doc.querySelector('.gallery')
if (!el) return false
const cols = win.getComputedStyle(el).gridTemplateColumns.trim().split(/\\s+/)
return cols.length === 4`,
          },
          {
            label: '.featured 的 grid-column-end 必須包含 span',
            test: `const el = doc.querySelector('.featured')
if (!el) return false
return win.getComputedStyle(el).gridColumnEnd.includes('span')`,
          },
        ],
      },
      {
        id: 'dashboard',
        title: '儀表板佈局',
        difficulty: 'hard',
        description:
          '使用 CSS Grid 建立儀表板：頂部統計卡片列、左側大圖表、右側小面板，底部全寬資料表。',
        requirements: [
          '.dashboard 使用 display: grid 和 grid-template-areas',
          '統計卡片區橫跨所有欄位',
          '.chart 使用 grid-area 跨多列',
          '.table 橫跨所有欄位',
        ],
        initialHtml:
          "<div class=\"dashboard\">\n  <div class=\"stats-row\">Stats Row</div>\n  <div class=\"chart\">Chart</div>\n  <div class=\"panels\">Side Panels</div>\n  <div class=\"table-section\">Data Table</div>\n</div>",
        initialCss:
          ".dashboard {\n  height: 100vh;\n  background: #0f172a;\n  /* 在此加入 grid-template-areas 等屬性 */\n}\n\n.stats-row    { background: #1e40af; color: white; padding: 16px; }\n.chart        { background: #065f46; color: white; padding: 16px; }\n.panels       { background: #7c3aed; color: white; padding: 16px; }\n.table-section { background: #1e293b; color: white; padding: 16px; }",
        hints: [
          'grid-template-columns: 2fr 1fr',
          'grid-template-areas: "stats stats" "chart panels" "table table"',
          '各元素用 grid-area 對應',
        ],
        testCases: [
          {
            label: '.dashboard 必須設定 display: grid',
            test: `const el = doc.querySelector('.dashboard')
if (!el) return false
return win.getComputedStyle(el).display === 'grid'`,
          },
          {
            label: '.dashboard 必須設定 grid-template-areas',
            test: `const el = doc.querySelector('.dashboard')
if (!el) return false
return win.getComputedStyle(el).gridTemplateAreas !== 'none'`,
          },
          {
            label: '.dashboard 的 grid-template-columns 必須定義兩欄',
            test: `const el = doc.querySelector('.dashboard')
if (!el) return false
const cols = win.getComputedStyle(el).gridTemplateColumns.trim().split(/\\s+/)
return cols.length === 2`,
          },
        ],
      },
    ],
  },

  {
    slug: "css-centering",
    kind: "css",
    category: "置中技巧",
    difficulty: "medium",
    methodName: "多種置中方法",
    title: "水平垂直置中的多種方法",
    description:
      "面試常考！學習用 Flexbox、Grid、Position、Margin Auto 等不同方法實現置中效果",
    problems: [
      {
        id: "flex-center",
        title: "Flexbox 置中",
        difficulty: "easy",
        description:
          "使用 Flexbox 的 justify-content 和 align-items 讓內容水平垂直置中，這是最常用的置中方法。",
        requirements: [
          ".wrapper 使用 display: flex",
          ".wrapper 使用 justify-content: center",
          ".wrapper 使用 align-items: center",
        ],
        initialHtml:
          "<div class=\"wrapper\"><div class=\"box\"><p>我在正中央</p></div></div>",
        initialCss:
          ".wrapper {\n  width: 400px;\n  height: 300px;\n  background: #1e1e2e;\n}\n\n.box {\n  width: 120px;\n  height: 80px;\n  background: #4f86f7;\n  border-radius: 8px;\n}",
        testCases: [
          {
            label: ".wrapper 的 display 應為 flex",
            test: `const el = doc.querySelector('.wrapper')
if (!el) return false
return win.getComputedStyle(el).display === 'flex'`,
          },
          {
            label: ".wrapper 的 justify-content 應為 center",
            test: `const el = doc.querySelector('.wrapper')
if (!el) return false
return win.getComputedStyle(el).justifyContent === 'center'`,
          },
          {
            label: ".wrapper 的 align-items 應為 center",
            test: `const el = doc.querySelector('.wrapper')
if (!el) return false
return win.getComputedStyle(el).alignItems === 'center'`,
          },
        ],
      },
      {
        id: "absolute-center",
        title: "絕對定位置中",
        difficulty: "medium",
        description:
          "使用 position: absolute + top/left: 50% + transform: translate(-50%, -50%) 實現置中，適合需要脫離文件流的場景。",
        requirements: [
          ".wrapper 使用 position: relative",
          ".box 使用 position: absolute",
          ".box 設定 top: 50%; left: 50%",
          ".box 使用 transform: translate(-50%, -50%)",
        ],
        initialHtml:
          "<div class=\"wrapper\"><div class=\"box\">我在正中央</div></div>",
        initialCss:
          ".wrapper {\n  width: 400px;\n  height: 300px;\n  background: #1e1e2e;\n  position: relative;\n}\n\n.box {\n  width: 120px;\n  height: 80px;\n  background: #4f86f7;\n  border-radius: 8px;\n  color: white;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}",
        hints: [
          "position: absolute 讓元素相對於最近的 position: relative 父元素定位",
          "top: 50%; left: 50% 把元素的左上角移到中心",
          "transform: translate(-50%, -50%) 往回移動自身的一半",
        ],
        testCases: [
          {
            label: ".box 的 position 應為 absolute",
            test: `const el = doc.querySelector('.box')
if (!el) return false
return win.getComputedStyle(el).position === 'absolute'`,
          },
          {
            label: ".box 的 top 應設定為 50%",
            test: `const s = Array.from(doc.styleSheets).find((sh) => !sh.href)
if (!s) return false
try {
  return Array.from(s.cssRules).some(
    (r) =>
      r.cssText &&
      r.cssText.includes('.box') &&
      r.cssText.includes('top') &&
      r.cssText.includes('50%')
  )
} catch (e) {
  return false
}`,
          },
          {
            label: ".box 的 transform 應包含 translate",
            test: `const el = doc.querySelector('.box')
if (!el) return false
return win.getComputedStyle(el).transform !== 'none'`,
          },
        ],
      },
      {
        id: "grid-center",
        title: "Grid 置中",
        difficulty: "easy",
        description:
          "使用 CSS Grid 的 place-items: center 一行實現水平垂直置中，最簡潔的現代置中方法。",
        requirements: [
          ".wrapper 使用 display: grid",
          ".wrapper 使用 place-items: center（等同於 align-items + justify-items）",
        ],
        initialHtml:
          "<div class=\"wrapper\"><div class=\"box\">Grid 置中</div></div>",
        initialCss:
          ".wrapper {\n  width: 400px;\n  height: 300px;\n  background: #1e1e2e;\n}\n\n.box {\n  width: 120px;\n  height: 80px;\n  background: #a78bfa;\n  border-radius: 8px;\n  color: white;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}",
        hints: [
          "display: grid 搭配 place-items: center 是最簡潔的置中",
          "place-items 是 align-items + justify-items 的縮寫",
        ],
        testCases: [
          {
            label: ".wrapper 的 display 應為 grid",
            test: `const el = doc.querySelector('.wrapper')
if (!el) return false
return win.getComputedStyle(el).display === 'grid'`,
          },
          {
            label: ".wrapper 的 align-items 與 justify-items 都應為 center",
            test: `const el = doc.querySelector('.wrapper')
if (!el) return false
const style = win.getComputedStyle(el)
return (
  style.alignItems === 'center' &&
  style.justifyItems === 'center'
)`,
          },
        ],
      },
      {
        id: "margin-auto",
        title: "Margin Auto 水平置中",
        difficulty: "easy",
        description:
          "使用 margin: 0 auto 讓 block 元素水平置中，需搭配明確的寬度設定。這是最傳統的水平置中方法。",
        requirements: [
          ".content 設定明確的 max-width 或 width",
          ".content 使用 margin: 0 auto（或 margin-left/right: auto）",
        ],
        initialHtml:
          "<div class=\"page-wrapper\"><div class=\"content\"><h2>文章標題</h2><p>這是一段示範文字，用來展示 margin: auto 的水平置中效果。當容器有明確寬度時，margin: 0 auto 會讓左右留白相等。</p></div></div>",
        initialCss:
          ".page-wrapper {\n  width: 100%;\n  min-height: 200px;\n  background: #f3f4f6;\n  padding: 24px 0;\n}\n\n.content {\n  background: white;\n  padding: 24px;\n  border-radius: 8px;\n  box-shadow: 0 1px 3px rgba(0,0,0,0.1);\n}",
        hints: [
          "block 元素需要 width 或 max-width，才能讓 margin: auto 生效",
          "margin: 0 auto 只能水平置中，不能垂直置中",
        ],
        testCases: [
          {
            label: ".content 應視覺上水平置中（左右邊距相等）",
            test: `const el = doc.querySelector('.content')
if (!el) return false
const p = el.parentElement
if (!p) return false
const er = el.getBoundingClientRect()
const pr = p.getBoundingClientRect()
const leftM = er.left - pr.left
const rightM = pr.right - er.right
return Math.abs(leftM - rightM) < 5`,
          },
          {
            label: ".content 應設定 max-width",
            test: `const el = doc.querySelector('.content')
if (!el) return false
return win.getComputedStyle(el).maxWidth !== 'none'`,
          },
        ],
      },
    ],
  },
  {
    slug: "css-animation",
    kind: "css",
    category: "動畫",
    difficulty: "medium",
    methodName: "CSS 動畫",
    title: "CSS Transition 與 Animation",
    description:
      "掌握 CSS transition 和 @keyframes animation 的用法，讓介面更生動",
    problems: [
      {
        id: "hover-transition",
        title: "Hover 過渡效果",
        difficulty: "easy",
        description:
          "使用 transition 為按鈕加入流暢的 hover 效果，改變背景色、縮放或陰影時有過渡動畫。",
        requirements: [
          ".btn 設定 transition 屬性（duration 至少 0.2s）",
          ".btn:hover 改變至少一個視覺屬性（background-color / transform / box-shadow）",
        ],
        initialHtml:
          "<div class=\"demo\"><button class=\"btn\">Hover 我</button></div>",
        initialCss:
          ".demo {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 200px;\n  background: #f3f4f6;\n}\n\n.btn {\n  padding: 12px 28px;\n  background: #4f86f7;\n  color: white;\n  border: none;\n  border-radius: 8px;\n  font-size: 16px;\n  cursor: pointer;\n}",
        hints: [
          "transition: all 0.3s ease 對所有屬性套用過渡",
          "transition-duration 越長過渡越慢",
          ":hover 定義滑鼠移入後的樣式",
        ],
        testCases: [
          {
            label: ".btn 應設定 transition-duration（不為 0s）",
            test: `const el = doc.querySelector('.btn')
if (!el) return false
return win.getComputedStyle(el).transitionDuration !== '0s'`,
          },
          {
            label: "樣式表中應包含 :hover 規則",
            test: `const s = Array.from(doc.styleSheets).find((sh) => !sh.href)
if (!s) return false
try {
  return Array.from(s.cssRules).some(
    (r) => r.cssText && r.cssText.includes(':hover')
  )
} catch (e) {
  return false
}`,
          },
        ],
      },
      {
        id: "spin-animation",
        title: "@keyframes 旋轉動畫",
        difficulty: "medium",
        description:
          "使用 @keyframes 建立旋轉動畫，並用 animation 屬性套用到元素上，建立載入指示器效果。",
        requirements: [
          "定義 @keyframes 旋轉動畫（0% → 360°）",
          ".spinner 設定 animation 屬性套用動畫",
          "animation 持續時間至少 0.5s，並設定 linear infinite",
        ],
        initialHtml:
          "<div class=\"demo\"><div class=\"spinner\"></div></div>",
        initialCss:
          ".demo {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 200px;\n  background: #1e1e2e;\n}\n\n.spinner {\n  width: 50px;\n  height: 50px;\n  border-radius: 50%;\n  border: 4px solid rgba(255, 255, 255, 0.2);\n  border-top-color: #4f86f7;\n  border-right-color: #4f86f7;\n  border-bottom-color: #4f86f7;\n}",
        hints: [
          "@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }",
          "animation: spin 1s linear infinite",
        ],
        testCases: [
          {
            label: ".spinner 應套用 animation（animationName 不為 none）",
            test: `const el = doc.querySelector('.spinner')
if (!el) return false
return win.getComputedStyle(el).animationName !== 'none'`,
          },
          {
            label: ".spinner 的 animation-duration 應不為 0s",
            test: `const el = doc.querySelector('.spinner')
if (!el) return false
return win.getComputedStyle(el).animationDuration !== '0s'`,
          },
          {
            label: "樣式表中應定義 @keyframes 規則",
            test: `const s = Array.from(doc.styleSheets).find((sh) => !sh.href)
if (!s) return false
try {
  return Array.from(s.cssRules).some(
    (r) =>
      r.type === CSSRule.KEYFRAMES_RULE ||
      r.constructor.name === 'CSSKeyframesRule'
  )
} catch (e) {
  return false
}`,
          },
        ],
      },
      {
        id: "pulse-animation",
        title: "脈衝呼吸動畫",
        difficulty: "medium",
        description:
          "建立通知徽章的「呼吸」脈衝效果：使用 @keyframes 讓元素週期性縮放或改變透明度，常用於吸引用戶注意。",
        requirements: [
          "定義 @keyframes 控制 transform: scale 或 opacity",
          ".badge 套用無限循環動畫",
          "動畫使用 ease-in-out 讓效果更自然",
        ],
        initialHtml:
          "<div class=\"demo\"><div class=\"badge\">NEW</div></div>",
        initialCss:
          ".demo {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 200px;\n  background: #f3f4f6;\n}\n\n.badge {\n  background: #ef4444;\n  color: white;\n  font-size: 13px;\n  font-weight: 700;\n  padding: 6px 14px;\n  border-radius: 999px;\n  letter-spacing: 0.05em;\n}",
        hints: [
          "@keyframes pulse { 0%, 100% { transform: scale(1) } 50% { transform: scale(1.15) } }",
          "animation: pulse 1.5s ease-in-out infinite",
        ],
        testCases: [
          {
            label: ".badge 應套用 animation（animationName 不為 none）",
            test: `const el = doc.querySelector('.badge')
if (!el) return false
return win.getComputedStyle(el).animationName !== 'none'`,
          },
          {
            label: ".badge 的 animation-iteration-count 應為 infinite",
            test: `const el = doc.querySelector('.badge')
if (!el) return false
return (
  win.getComputedStyle(el).animationIterationCount === 'infinite'
)`,
          },
          {
            label: "樣式表中應定義 @keyframes 規則",
            test: `const s = Array.from(doc.styleSheets).find((sh) => !sh.href)
if (!s) return false
try {
  return Array.from(s.cssRules).some(
    (r) =>
      r.type === CSSRule.KEYFRAMES_RULE ||
      r.constructor.name === 'CSSKeyframesRule'
  )
} catch (e) {
  return false
}`,
          },
        ],
      },
    ],
  },
  {
    slug: "css-form",
    kind: "css",
    category: "表單",
    difficulty: "medium",
    methodName: "表單設計",
    title: "CSS 表單切版",
    description: "用 CSS 設計美觀的表單元件：登入表單、搜尋列、聯絡表單",
    problems: [
      {
        id: "login",
        title: "登入表單",
        difficulty: "easy",
        description: "建立一個美觀的登入表單：包含標題、使用者名稱輸入框、密碼輸入框和登入按鈕，垂直排列並置中。",
        requirements: [
          ".form-card 使用 display: flex; flex-direction: column",
          "輸入框有 focus 樣式（outline 或 border 變化）",
          "登入按鈕有適當的樣式和 hover 效果",
          "整體表單水平置中",
        ],
        initialHtml: `<div class="wrapper">\n  <div class="form-card">\n    <h2 class="form-title">登入</h2>\n    <div class="input-group">\n      <label for="username">使用者名稱</label>\n      <input type="text" id="username" placeholder="請輸入使用者名稱" />\n    </div>\n    <div class="input-group">\n      <label for="password">密碼</label>\n      <input type="password" id="password" placeholder="請輸入密碼" />\n    </div>\n    <button type="submit" class="submit-btn">登入</button>\n  </div>\n</div>`,
        initialCss: `.wrapper {\n  min-height: 100vh;\n  background: #1a1a2e;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.form-card {\n  width: 360px;\n  background: #ffffff;\n  padding: 40px;\n  border-radius: 12px;\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);\n  /* TODO: 加入 flex 排版讓欄位垂直排列 */\n}\n\n.form-title {\n  text-align: center;\n  margin-bottom: 24px;\n  color: #1a1a2e;\n}\n\n.input-group {\n  margin-bottom: 4px;\n}\n\nlabel {\n  display: block;\n  margin-bottom: 6px;\n  color: #555;\n  font-size: 14px;\n}\n\ninput {\n  /* TODO: 讓輸入框填滿表單寬度並加入 focus 樣式 */\n  padding: 10px 14px;\n  border: 1px solid #ddd;\n  border-radius: 6px;\n  font-size: 14px;\n}\n\n.submit-btn {\n  margin-top: 8px;\n  padding: 12px;\n  background: #4f46e5;\n  color: white;\n  border: none;\n  border-radius: 6px;\n  font-size: 16px;\n  cursor: pointer;\n}\n\n.submit-btn:hover {\n  background: #4338ca;\n}`,
        hints: [
          "form-card 用 flex + flex-direction: column + gap 排列欄位",
          "input:focus { outline: 2px solid blue } 加入 focus 樣式",
          "width: 100% 讓輸入框填滿表單寬度",
        ],
        testCases: [
          {
            label: ".form-card 使用 display: flex",
            test: `const el = doc.querySelector(".form-card")
if (!el) return false
return win.getComputedStyle(el).display === "flex"`,
          },
          {
            label: ".form-card 使用 flex-direction: column",
            test: `const el = doc.querySelector(".form-card")
if (!el) return false
return win.getComputedStyle(el).flexDirection === "column"`,
          },
          {
            label: "輸入框寬度填滿父元素",
            test: `const inp = doc.querySelector("input")
if (!inp) return false
const w = parseFloat(win.getComputedStyle(inp).width)
const pw = parseFloat(win.getComputedStyle(inp.parentElement).width)
return w / pw > 0.8`,
          },
          {
            label: "登入按鈕存在",
            test: `const btn = doc.querySelector("button[type='submit']") || doc.querySelector("input[type='submit']") || doc.querySelector("button")
return !!btn`,
          },
        ],
      },
      {
        id: "search-bar",
        title: "搜尋列",
        difficulty: "easy",
        description: "建立一個搜尋列：輸入框和搜尋按鈕並排，輸入框佔滿剩餘空間，按鈕固定寬度。",
        requirements: [
          ".search-bar 使用 display: flex; align-items: center",
          "input 使用 flex: 1 佔滿剩餘空間",
          "button 有適當樣式，不換行",
        ],
        initialHtml: `<div class="search-wrapper">\n  <div class="search-bar">\n    <input type="search" placeholder="搜尋..." />\n    <button type="button" class="search-btn">🔍 搜尋</button>\n  </div>\n</div>`,
        initialCss: `.search-wrapper {\n  padding: 40px;\n  background: #f5f5f5;\n  min-height: 100vh;\n  display: flex;\n  align-items: flex-start;\n  justify-content: center;\n}\n\n.search-bar {\n  width: 100%;\n  max-width: 600px;\n  border: 2px solid #4f46e5;\n  border-radius: 50px;\n  overflow: hidden;\n  background: #fff;\n  /* TODO: 加入 flex 讓輸入框和按鈕並排 */\n}\n\ninput[type="search"] {\n  padding: 12px 20px;\n  border: none;\n  outline: none;\n  font-size: 16px;\n  background: transparent;\n  /* TODO: 讓輸入框佔滿剩餘空間 */\n}\n\n.search-btn {\n  padding: 12px 24px;\n  background: #4f46e5;\n  color: white;\n  border: none;\n  cursor: pointer;\n  font-size: 14px;\n  white-space: nowrap;\n}\n\n.search-btn:hover {\n  background: #4338ca;\n}`,
        hints: [
          ".search-bar 用 display: flex",
          "input 設 flex: 1 佔剩餘空間",
          "button 設固定寬度或 padding",
        ],
        testCases: [
          {
            label: ".search-bar 使用 display: flex",
            test: `const el = doc.querySelector(".search-bar")
if (!el) return false
return win.getComputedStyle(el).display === "flex"`,
          },
          {
            label: "input 使用 flex: 1 佔滿剩餘空間",
            test: `const inp = doc.querySelector("input")
if (!inp) return false
const s = win.getComputedStyle(inp)
return s.flexGrow === "1"`,
          },
          {
            label: "input 和 button 在同一行",
            test: `const inp = doc.querySelector("input")
const btn = doc.querySelector("button")
if (!inp || !btn) return false
return Math.abs((inp as HTMLElement).offsetTop - (btn as HTMLElement).offsetTop) < 10`,
          },
        ],
      },
      {
        id: "contact-form",
        title: "聯絡表單",
        difficulty: "medium",
        description: "建立完整的聯絡表單：姓名、Email、主旨（下拉選單）、訊息（textarea）和送出按鈕，使用 Grid 排版讓姓名和 Email 兩欄並排。",
        requirements: [
          ".form-grid 使用 display: grid; grid-template-columns: 1fr 1fr",
          "主旨和訊息欄位跨越兩欄（grid-column: 1 / -1）",
          "textarea 有適當高度",
        ],
        initialHtml: `<div class="page-wrapper">\n  <form class="form-grid">\n    <div class="field-group">\n      <label for="name">姓名</label>\n      <input type="text" id="name" placeholder="您的姓名" />\n    </div>\n    <div class="field-group">\n      <label for="email">Email</label>\n      <input type="email" id="email" placeholder="your@email.com" />\n    </div>\n    <div class="field-group full-width">\n      <label for="subject">主旨</label>\n      <select id="subject">\n        <option>一般詢問</option>\n        <option>技術支援</option>\n        <option>合作洽談</option>\n      </select>\n    </div>\n    <div class="field-group full-width">\n      <label for="message">訊息</label>\n      <textarea id="message" placeholder="請輸入您的訊息..."></textarea>\n    </div>\n    <button type="submit" class="full-width">送出訊息</button>\n  </form>\n</div>`,
        initialCss: `.page-wrapper {\n  padding: 40px 20px;\n  background: #f8fafc;\n  min-height: 100vh;\n}\n\n.form-grid {\n  max-width: 700px;\n  margin: 0 auto;\n  background: white;\n  padding: 40px;\n  border-radius: 12px;\n  box-shadow: 0 2px 16px rgba(0,0,0,0.08);\n  /* TODO: 加入 grid 排版，兩欄等寬 */\n}\n\n.field-group {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n\nlabel {\n  font-size: 14px;\n  font-weight: 500;\n  color: #374151;\n}\n\ninput,\nselect,\ntextarea {\n  padding: 10px 14px;\n  border: 1px solid #d1d5db;\n  border-radius: 8px;\n  font-size: 14px;\n  outline: none;\n}\n\ninput:focus,\nselect:focus,\ntextarea:focus {\n  border-color: #4f46e5;\n  box-shadow: 0 0 0 3px rgba(79,70,229,0.15);\n}\n\ntextarea {\n  height: 120px;\n  resize: vertical;\n}\n\n/* TODO: .full-width 元素跨越兩欄 */\n\nbutton[type="submit"] {\n  padding: 12px;\n  background: #4f46e5;\n  color: white;\n  border: none;\n  border-radius: 8px;\n  font-size: 16px;\n  cursor: pointer;\n}\n\nbutton[type="submit"]:hover {\n  background: #4338ca;\n}`,
        hints: [
          "form-grid: display: grid; grid-template-columns: 1fr 1fr; gap: 16px",
          "select, textarea, button: grid-column: 1 / -1",
        ],
        testCases: [
          {
            label: ".form-grid 使用 display: grid",
            test: `const el = doc.querySelector(".form-grid")
if (!el) return false
return win.getComputedStyle(el).display === "grid"`,
          },
          {
            label: "grid-template-columns 分為兩欄",
            test: `const el = doc.querySelector(".form-grid")
if (!el) return false
return win.getComputedStyle(el).gridTemplateColumns.trim().split(/\\s+/).length === 2`,
          },
          {
            label: "textarea 或 select 跨越兩欄",
            test: `const sheets = Array.from(doc.styleSheets).filter(sh => !sh.href)
for (const sheet of sheets) {
  try {
    const rules = Array.from(sheet.cssRules)
    for (const rule of rules) {
      const text = (rule as CSSRule).cssText
      if (text && text.includes("grid-column") && (text.includes("1 / -1") || text.includes("span 2"))) return true
    }
  } catch (e) {
    continue
  }
}
return false`,
          },
        ],
      },
    ],
  },

  // ── 1. css-hamburger ──────────────────────────────────────────────────────
  {
    slug: "css-hamburger",
    kind: "css",
    category: "元件",
    difficulty: "medium",
    methodName: "漢堡選單",
    title: "漢堡選單切版",
    description: "用純 CSS 和 JavaScript 兩種方式實作漢堡選單",
    problems: [
      {
        id: "css-only",
        title: "CSS 純 CSS 漢堡選單",
        difficulty: "medium",
        description: "不使用 JavaScript！利用 checkbox input 的 :checked 偽類實現漢堡選單的開關效果（Checkbox Hack）。",
        requirements: [
          "使用 input[type=\"checkbox\"] 作為開關",
          "label 顯示漢堡圖示（☰），點擊後切換選單",
          "checkbox:checked 時，.nav-menu 顯示",
          "預設 .nav-menu 隱藏",
        ],
        initialHtml: `<div class="navbar">\n  <div class="brand">MyBrand</div>\n  <input type="checkbox" id="nav-toggle" />\n  <label for="nav-toggle" class="hamburger">☰</label>\n  <nav class="nav-menu">\n    <a href="#">首頁</a>\n    <a href="#">關於</a>\n    <a href="#">服務</a>\n    <a href="#">聯絡</a>\n  </nav>\n</div>`,
        initialCss: `.navbar {\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 16px 24px;\n  background: #1a1a2e;\n  color: white;\n}\n\n.brand {\n  font-size: 20px;\n  font-weight: bold;\n  color: #a78bfa;\n}\n\ninput[type="checkbox"] {\n  display: none;\n}\n\n.hamburger {\n  font-size: 28px;\n  cursor: pointer;\n  user-select: none;\n  color: white;\n}\n\n.nav-menu {\n  display: none;\n  position: absolute;\n  top: 100%;\n  left: 0;\n  right: 0;\n  background: #16213e;\n  padding: 16px;\n  flex-direction: column;\n  gap: 8px;\n  z-index: 100;\n}\n\n.nav-menu a {\n  color: white;\n  text-decoration: none;\n  padding: 10px 16px;\n  border-radius: 6px;\n}\n\n.nav-menu a:hover {\n  background: rgba(167,139,250,0.2);\n}\n\n/* TODO: 用 :checked 偽類讓選單在勾選時顯示 */`,
        hints: [
          "input[type=\"checkbox\"] { display: none }",
          "#nav-toggle:checked ~ .nav-menu { display: flex; flex-direction: column }",
          "label 要對應 input 的 id",
        ],
        testCases: [
          {
            label: "checkbox input 存在",
            test: `return !!doc.querySelector("input[type='checkbox']")`,
          },
          {
            label: "label[for] 存在且對應 checkbox id",
            test: `const lbl = doc.querySelector("label[for]"); if (!lbl) return false; return !!doc.querySelector("#" + lbl.getAttribute("for"))`,
          },
          {
            label: "樣式表中有 :checked 規則",
            test: `const s = Array.from(doc.styleSheets).find(sh => !sh.href); if (!s) return false; try { return Array.from(s.cssRules).some((r) => r.cssText && r.cssText.includes(":checked")); } catch (e) { return false; }`,
          },
          {
            label: "點擊 label 後選單顯示",
            test: `const lbl = doc.querySelector("label"); const menu = doc.querySelector(".nav-menu"); if (!lbl || !menu) return false; lbl.click(); const visible = win.getComputedStyle(menu).display !== "none"; lbl.click(); return visible`,
          },
        ],
      },
      {
        id: "js-toggle",
        title: "JavaScript Toggle 漢堡選單",
        difficulty: "medium",
        description: "使用 JavaScript 監聽按鈕點擊事件，切換 nav 的 CSS class 來控制選單開關，這是最常見的實作方式。",
        requirements: [
          "`.hamburger-btn` 按鈕顯示漢堡圖示",
          "點擊按鈕後，`.nav-menu` 切換 open class",
          ".nav-menu 預設隱藏，.nav-menu.open 時顯示",
          "JS 使用 addEventListener 或 onclick 監聽事件",
        ],
        initialHtml: `<div class="navbar">\n  <div class="brand">MyBrand</div>\n  <button class="hamburger-btn" type="button">☰</button>\n  <nav class="nav-menu">\n    <a href="#">首頁</a>\n    <a href="#">關於</a>\n    <a href="#">服務</a>\n    <a href="#">聯絡</a>\n  </nav>\n</div>\n<script>\n  document.querySelector(".hamburger-btn").addEventListener("click", function() {\n    document.querySelector(".nav-menu").classList.toggle("open");\n  });\n</script>`,
        initialCss: `.navbar {\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 16px 24px;\n  background: #1a1a2e;\n  color: white;\n}\n\n.brand {\n  font-size: 20px;\n  font-weight: bold;\n  color: #a78bfa;\n}\n\n.hamburger-btn {\n  font-size: 28px;\n  background: none;\n  border: none;\n  cursor: pointer;\n  color: white;\n  padding: 4px 8px;\n}\n\n.nav-menu {\n  display: none;\n  position: absolute;\n  top: 100%;\n  left: 0;\n  right: 0;\n  background: #16213e;\n  padding: 16px;\n  flex-direction: column;\n  gap: 8px;\n  z-index: 100;\n}\n\n/* TODO: .nav-menu.open 時顯示選單 */\n\n.nav-menu a {\n  color: white;\n  text-decoration: none;\n  padding: 10px 16px;\n  border-radius: 6px;\n}\n\n.nav-menu a:hover {\n  background: rgba(167,139,250,0.2);\n}`,
        hints: [
          "document.querySelector(\".hamburger-btn\").addEventListener(\"click\", () => document.querySelector(\".nav-menu\").classList.toggle(\"open\"))",
          ".nav-menu.open { display: flex; flex-direction: column }",
        ],
        testCases: [
          {
            label: ".hamburger-btn 存在",
            test: `return !!doc.querySelector(".hamburger-btn")`,
          },
          {
            label: ".nav-menu 存在",
            test: `return !!doc.querySelector(".nav-menu")`,
          },
          {
            label: "樣式表中有 .open 規則",
            test: `const s = Array.from(doc.styleSheets).find(sh => !sh.href); if (!s) return false; try { return Array.from(s.cssRules).some((r) => r.cssText && r.cssText.includes(".open")); } catch (e) { return false; }`,
          },
          {
            label: "點擊按鈕後選單可見性改變",
            test: `const btn = doc.querySelector(".hamburger-btn"); const menu = doc.querySelector(".nav-menu"); if (!btn || !menu) return false; const before = win.getComputedStyle(menu).display; btn.click(); const after = win.getComputedStyle(menu).display; btn.click(); return before !== after`,
          },
        ],
      },
    ],
  },

  // ── 2. css-dialog ─────────────────────────────────────────────────────────
  {
    slug: "css-dialog",
    kind: "css",
    category: "元件",
    difficulty: "medium",
    methodName: "彈出框",
    title: "Modal 與 Drawer 切版",
    description: "用 CSS 和 JavaScript 實作 Modal 彈窗和側邊 Drawer 抽屜",
    problems: [
      {
        id: "modal",
        title: "Modal 彈出框",
        difficulty: "medium",
        description: "實作一個 Modal 彈窗：半透明遮罩層覆蓋背景，白色彈窗內容置中顯示，點擊關閉按鈕或遮罩時關閉。",
        requirements: [
          ".overlay 使用 position: fixed 覆蓋全螢幕",
          ".overlay 有半透明深色背景（rgba）",
          ".modal 使用 position: absolute 或 fixed，垂直水平置中",
          "點擊關閉按鈕可以隱藏 modal",
        ],
        initialHtml: `<div class="page">\n  <button id="open-btn" type="button">開啟 Modal</button>\n</div>\n<div class="overlay">\n  <div class="modal">\n    <h2>Modal 標題</h2>\n    <p>這是 Modal 的內容區域，可以放置任何資訊。</p>\n    <button class="close-btn" type="button">✕ 關閉</button>\n  </div>\n</div>\n<script>\n  const overlay = document.querySelector(".overlay");\n  document.getElementById("open-btn").addEventListener("click", () => {\n    overlay.style.display = "flex";\n  });\n  document.querySelector(".close-btn").addEventListener("click", () => {\n    overlay.style.display = "none";\n  });\n  overlay.addEventListener("click", (e) => {\n    if (e.target === overlay) overlay.style.display = "none";\n  });\n</script>`,
        initialCss: `.page {\n  padding: 40px;\n  min-height: 100vh;\n  background: #f5f5f5;\n  display: flex;\n  align-items: flex-start;\n  justify-content: center;\n}\n\n#open-btn {\n  padding: 12px 24px;\n  background: #4f46e5;\n  color: white;\n  border: none;\n  border-radius: 8px;\n  font-size: 16px;\n  cursor: pointer;\n}\n\n.overlay {\n  /* TODO: 加入 position: fixed 覆蓋全螢幕 */\n  inset: 0;\n  background: rgba(0, 0, 0, 0.7);\n  display: none;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000;\n}\n\n.modal {\n  background: white;\n  padding: 40px;\n  border-radius: 16px;\n  max-width: 480px;\n  width: 90%;\n  box-shadow: 0 20px 60px rgba(0,0,0,0.3);\n  position: relative;\n}\n\n.modal h2 {\n  margin-bottom: 16px;\n  color: #1a1a2e;\n}\n\n.modal p {\n  color: #555;\n  margin-bottom: 24px;\n}\n\n.close-btn {\n  padding: 10px 20px;\n  background: #ef4444;\n  color: white;\n  border: none;\n  border-radius: 6px;\n  cursor: pointer;\n}\n\n.close-btn:hover {\n  background: #dc2626;\n}`,
        hints: [
          "overlay: position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center",
          "modal 內容不需要額外定位，由 flexbox 父層置中",
        ],
        testCases: [
          {
            label: ".overlay 存在",
            test: `return !!doc.querySelector(".overlay")`,
          },
          {
            label: ".overlay 使用 position: fixed",
            test: `const el = doc.querySelector(".overlay"); if (!el) return false; return win.getComputedStyle(el).position === "fixed"`,
          },
          {
            label: "點擊觸發按鈕後 overlay 顯示",
            test: `const btn = doc.querySelector("button:not(.close-btn)") || doc.querySelector("#open-btn"); if (!btn) return false; btn.click(); const ov = doc.querySelector(".overlay"); if (!ov) return false; const vis = win.getComputedStyle(ov).display !== "none"; return vis`,
          },
          {
            label: ".modal 內有關閉按鈕",
            test: `return !!(doc.querySelector(".close-btn") || doc.querySelector(".modal button") || doc.querySelector("[data-close]"))`,
          },
        ],
      },
      {
        id: "drawer",
        title: "Drawer 側邊抽屜",
        difficulty: "hard",
        description: "實作從右側滑入的 Drawer 抽屜：預設在螢幕外，點擊按鈕後以 CSS transition 滑入畫面。",
        requirements: [
          ".drawer 使用 position: fixed; right: 0; top: 0; height: 100%",
          ".drawer 預設 transform: translateX(100%) 隱藏在右側",
          ".drawer.open 使用 transform: translateX(0) 滑入",
          "transition 讓滑動效果平滑",
        ],
        initialHtml: `<div class="page">\n  <button id="open-drawer" type="button">開啟抽屜</button>\n</div>\n<div class="overlay" id="drawer-overlay"></div>\n<div class="drawer">\n  <div class="drawer-header">\n    <h3>側邊選單</h3>\n    <button class="close-btn" type="button">✕</button>\n  </div>\n  <div class="drawer-content">\n    <nav>\n      <a href="#">首頁</a>\n      <a href="#">產品</a>\n      <a href="#">關於</a>\n      <a href="#">聯絡</a>\n    </nav>\n  </div>\n</div>\n<script>\n  const drawer = document.querySelector(".drawer");\n  const overlay = document.getElementById("drawer-overlay");\n  function openDrawer() {\n    drawer.classList.add("open");\n    overlay.classList.add("active");\n  }\n  function closeDrawer() {\n    drawer.classList.remove("open");\n    overlay.classList.remove("active");\n  }\n  document.getElementById("open-drawer").addEventListener("click", openDrawer);\n  document.querySelector(".close-btn").addEventListener("click", closeDrawer);\n  overlay.addEventListener("click", closeDrawer);\n</script>`,
        initialCss: `.page {\n  padding: 40px;\n  min-height: 100vh;\n  background: #f5f5f5;\n}\n\n#open-drawer {\n  padding: 12px 24px;\n  background: #4f46e5;\n  color: white;\n  border: none;\n  border-radius: 8px;\n  font-size: 16px;\n  cursor: pointer;\n}\n\n.overlay {\n  display: none;\n  position: fixed;\n  inset: 0;\n  background: rgba(0, 0, 0, 0.5);\n  z-index: 100;\n}\n\n.overlay.active {\n  display: block;\n}\n\n.drawer {\n  position: fixed;\n  right: 0;\n  top: 0;\n  height: 100%;\n  width: 300px;\n  background: white;\n  box-shadow: -4px 0 20px rgba(0,0,0,0.15);\n  z-index: 200;\n  /* TODO: 加入 transform 讓抽屜預設隱藏在右側 */\n  /* TODO: 加入 transition 讓滑動平滑 */\n}\n\n/* TODO: .drawer.open 時讓抽屜滑入 */\n\n.drawer-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 20px 24px;\n  border-bottom: 1px solid #eee;\n}\n\n.drawer-header h3 {\n  margin: 0;\n  color: #1a1a2e;\n}\n\n.close-btn {\n  background: none;\n  border: none;\n  font-size: 20px;\n  cursor: pointer;\n  color: #666;\n}\n\n.drawer-content {\n  padding: 24px;\n}\n\n.drawer-content nav {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n\n.drawer-content a {\n  color: #374151;\n  text-decoration: none;\n  padding: 10px 16px;\n  border-radius: 8px;\n}\n\n.drawer-content a:hover {\n  background: #f3f4f6;\n}`,
        hints: [
          "drawer 預設用 transform: translateX(100%) 移出畫面右側",
          ".drawer.open { transform: translateX(0) } 讓它滑回來",
          "transition: transform 0.3s ease 讓動畫平滑",
        ],
        testCases: [
          {
            label: ".drawer 使用 position: fixed",
            test: `const el = doc.querySelector(".drawer"); if (!el) return false; return win.getComputedStyle(el).position === "fixed"`,
          },
          {
            label: ".drawer 有 transition 動畫",
            test: `const el = doc.querySelector(".drawer"); if (!el) return false; return win.getComputedStyle(el).transitionDuration !== "0s"`,
          },
          {
            label: "樣式表中有 .drawer.open 的 translate 規則",
            test: `const s = Array.from(doc.styleSheets).find(sh => !sh.href); if (!s) return false; try { return Array.from(s.cssRules).some((r) => r.cssText && r.cssText.includes(".open") && r.cssText.includes("translate")); } catch (e) { return false; }`,
          },
          {
            label: "點擊開啟按鈕後 drawer 加上 open class",
            test: `const btn = doc.querySelector("button:not(.close-btn)") || doc.querySelector("[data-open]"); const drawer = doc.querySelector(".drawer"); if (!btn || !drawer) return false; btn.click(); const hasOpen = drawer.classList.contains("open"); btn.click(); return hasOpen`,
          },
        ],
      },
    ],
  },

  // ── 3. css-page-landing ───────────────────────────────────────────────────
  {
    kind: 'css',
    slug: 'css-page-landing',
    methodName: 'Landing Page',
    title: 'Landing Page 完整切版',
    description: '實作完整的 Landing Page：Hero 主視覺、Features 特點列、CTA 區塊',
    category: '完整頁面',
    difficulty: 'hard',
    problems: [
      {
        id: 'hero',
        title: 'Hero 主視覺區塊',
        difficulty: 'medium',
        description:
          '切出 Landing Page 的 Hero 區塊：佔滿視窗高度（100vh），深色漸層背景，大標題和副標題垂直置中，並有一個 CTA 按鈕。',
        requirements: [
          '.hero 高度設為 100vh',
          '.hero 使用漸層背景（linear-gradient）',
          '.hero 使用 Flexbox 讓內容垂直水平置中',
          '標題文字要夠大（font-size 至少 2.5rem）',
          '有一個 .cta-btn 按鈕',
        ],
        hints: [
          'height: 100vh 讓 hero 佔滿視窗高度',
          'background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          'display: flex; align-items: center; justify-content: center',
        ],
        initialHtml: `<section class="hero">
  <div class="hero-content">
    <h1>打造你的數位未來</h1>
    <p class="subtitle">我們提供最頂尖的技術解決方案，協助企業加速數位轉型。</p>
    <a href="#" class="cta-btn">立即開始</a>
  </div>
</section>`,
        initialCss: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', sans-serif;
}

.hero {
  /* TODO: 加入 height: 100vh */
  background-color: #1e1b4b;
  /* TODO: 改為 linear-gradient 漸層背景 */
  /* TODO: 加入 display: flex; align-items: center; justify-content: center */
  text-align: center;
  padding: 2rem;
}

.hero-content {
  max-width: 700px;
}

h1 {
  color: #ffffff;
  /* TODO: font-size 改為至少 2.5rem */
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.subtitle {
  color: #c7d2fe;
  font-size: 1.125rem;
  line-height: 1.7;
  margin-bottom: 2.5rem;
}

.cta-btn {
  /* TODO: 加入按鈕樣式（background、padding、border-radius 等） */
  color: #ffffff;
  text-decoration: none;
}`,
        targetHtml: `<section class="hero">
  <div class="hero-content">
    <h1>打造你的數位未來</h1>
    <p class="subtitle">我們提供最頂尖的技術解決方案，協助企業加速數位轉型。</p>
    <a href="#" class="cta-btn">立即開始</a>
  </div>
</section>`,
        targetCss: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', sans-serif;
}

.hero {
  height: 100vh;
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
}

.hero-content {
  max-width: 700px;
}

h1 {
  color: #ffffff;
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.subtitle {
  color: #c7d2fe;
  font-size: 1.125rem;
  line-height: 1.7;
  margin-bottom: 2.5rem;
}

.cta-btn {
  display: inline-block;
  background: #6366f1;
  color: #ffffff;
  text-decoration: none;
  padding: 0.875rem 2.5rem;
  border-radius: 9999px;
  font-size: 1rem;
  font-weight: 600;
  transition: background 0.2s, transform 0.2s;
}

.cta-btn:hover {
  background: #4f46e5;
  transform: translateY(-2px);
}`,
        testCases: [
          {
            label: '.hero 高度設為 100vh',
            test: `const s = Array.from(doc.styleSheets).find(sh => !sh.href)
if (!s) return false
try {
  return Array.from(s.cssRules).some(r => r.cssText && r.cssText.includes('.hero') && r.cssText.includes('vh'))
} catch (e) {
  return false
}`,
          },
          {
            label: '.hero 使用 display: flex',
            test: `const el = doc.querySelector('.hero')
if (!el) return false
return win.getComputedStyle(el).display === 'flex'`,
          },
          {
            label: '.hero 水平垂直置中（justify-content 及 align-items 為 center）',
            test: `const el = doc.querySelector('.hero')
if (!el) return false
const style = win.getComputedStyle(el)
return style.justifyContent === 'center' && style.alignItems === 'center'`,
          },
          {
            label: 'h1 的 font-size 至少 2.5rem（36px）',
            test: `const h1 = doc.querySelector('h1')
if (!h1) return false
return parseFloat(win.getComputedStyle(h1).fontSize) >= 36`,
          },
          {
            label: '頁面有 .cta-btn 按鈕',
            test: `return !!doc.querySelector('.cta-btn')`,
          },
        ],
      },

      {
        id: 'features',
        title: 'Features 特點區塊',
        difficulty: 'medium',
        description:
          '切出 Features 特點區塊：標題置中，三個特點卡片用 Grid 排列，每個卡片有 icon、標題和描述文字。',
        requirements: [
          '.features 有置中的區塊標題',
          '.features-grid 使用 CSS Grid 三欄排列',
          '每個 .feature-card 有圖示、標題、描述',
          '.feature-card 有背景色、padding 和圓角',
        ],
        hints: [
          'features-grid: display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px',
          'feature-card: background; padding; border-radius; text-align: center',
        ],
        initialHtml: `<section class="features">
  <h2 class="section-title">我們的核心優勢</h2>
  <div class="features-grid">
    <div class="feature-card">
      <div class="icon">⚡</div>
      <h3>極速效能</h3>
      <p>採用最新技術架構，確保產品以最佳效能運行，帶來極致使用者體驗。</p>
    </div>
    <div class="feature-card">
      <div class="icon">🔒</div>
      <h3>安全可靠</h3>
      <p>企業級安全防護，數據加密傳輸，讓您的資料安全有保障。</p>
    </div>
    <div class="feature-card">
      <div class="icon">📈</div>
      <h3>彈性擴展</h3>
      <p>隨業務成長自動擴展，從新創到大型企業都能完美適用。</p>
    </div>
  </div>
</section>`,
        initialCss: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', sans-serif;
}

.features {
  padding: 5rem 2rem;
  background: #f8fafc;
  text-align: center;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 3rem;
}

.features-grid {
  max-width: 1100px;
  margin: 0 auto;
  /* TODO: 加入 display: grid */
  /* TODO: 加入 grid-template-columns: repeat(3, 1fr) */
  /* TODO: 加入 gap: 2rem */
}

.feature-card {
  /* TODO: 加入背景色（background: #ffffff）*/
  /* TODO: 加入 padding: 2rem */
  /* TODO: 加入 border-radius: 12px */
}

.icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.75rem;
}

.feature-card p {
  color: #64748b;
  line-height: 1.6;
}`,
        targetHtml: `<section class="features">
  <h2 class="section-title">我們的核心優勢</h2>
  <div class="features-grid">
    <div class="feature-card">
      <div class="icon">⚡</div>
      <h3>極速效能</h3>
      <p>採用最新技術架構，確保產品以最佳效能運行，帶來極致使用者體驗。</p>
    </div>
    <div class="feature-card">
      <div class="icon">🔒</div>
      <h3>安全可靠</h3>
      <p>企業級安全防護，數據加密傳輸，讓您的資料安全有保障。</p>
    </div>
    <div class="feature-card">
      <div class="icon">📈</div>
      <h3>彈性擴展</h3>
      <p>隨業務成長自動擴展，從新創到大型企業都能完美適用。</p>
    </div>
  </div>
</section>`,
        targetCss: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', sans-serif;
}

.features {
  padding: 5rem 2rem;
  background: #f8fafc;
  text-align: center;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 3rem;
}

.features-grid {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.feature-card {
  background: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.2s, transform 0.2s;
}

.feature-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.75rem;
}

.feature-card p {
  color: #64748b;
  line-height: 1.6;
}`,
        testCases: [
          {
            label: '.features-grid 使用 display: grid',
            test: `const el = doc.querySelector('.features-grid')
if (!el) return false
return win.getComputedStyle(el).display === 'grid'`,
          },
          {
            label: '.features-grid 分為三欄',
            test: `const el = doc.querySelector('.features-grid')
if (!el) return false
const cols = win.getComputedStyle(el).gridTemplateColumns.trim().split(/\s+/)
return cols.length === 3`,
          },
          {
            label: '頁面有至少 3 個 .feature-card',
            test: `return doc.querySelectorAll('.feature-card').length >= 3`,
          },
          {
            label: '.feature-card 有設定 padding',
            test: `const card = doc.querySelector('.feature-card')
if (!card) return false
const style = win.getComputedStyle(card)
return parseFloat(style.padding) > 0 || parseFloat(style.paddingTop) > 0`,
          },
        ],
      },

      {
        id: 'landing-complete',
        title: '完整 Landing Page',
        difficulty: 'hard',
        description:
          '切出完整的 Landing Page：Navbar + Hero + Features + Footer，整合前兩題的成果，加入 Navbar 和 Footer 的設計。',
        requirements: [
          '`.navbar` 固定在頂部（position: sticky 或 fixed）',
          '`.hero` 高度 100vh，漸層背景',
          '`.features` 區塊三欄 Grid 排列',
          '`.footer` 深色背景，有版權文字',
        ],
        hints: [
          'navbar: position: sticky; top: 0; z-index: 100',
          'hero: height: 100vh; background: linear-gradient(...); display: flex',
          'features-grid: display: grid; grid-template-columns: repeat(3, 1fr)',
          'footer: background: #0f172a; color: #94a3b8; text-align: center; padding: 2rem',
        ],
        initialHtml: `<nav class="navbar">
  <div class="nav-inner">
    <span class="logo">MyBrand</span>
    <ul class="nav-links">
      <li><a href="#">功能</a></li>
      <li><a href="#">定價</a></li>
      <li><a href="#">關於我們</a></li>
    </ul>
    <a href="#" class="nav-cta">免費試用</a>
  </div>
</nav>

<section class="hero">
  <div class="hero-content">
    <h1>打造你的數位未來</h1>
    <p class="subtitle">我們提供最頂尖的技術解決方案，協助企業加速數位轉型。</p>
    <a href="#" class="cta-btn">立即開始</a>
  </div>
</section>

<section class="features">
  <h2 class="section-title">我們的核心優勢</h2>
  <div class="features-grid">
    <div class="feature-card">
      <div class="icon">⚡</div>
      <h3>極速效能</h3>
      <p>採用最新技術架構，確保產品以最佳效能運行。</p>
    </div>
    <div class="feature-card">
      <div class="icon">🔒</div>
      <h3>安全可靠</h3>
      <p>企業級安全防護，數據加密傳輸，資料安全有保障。</p>
    </div>
    <div class="feature-card">
      <div class="icon">📈</div>
      <h3>彈性擴展</h3>
      <p>隨業務成長自動擴展，從新創到大型企業都適用。</p>
    </div>
  </div>
</section>

<footer class="footer">
  <div class="footer-inner">
    <p class="footer-logo">MyBrand</p>
    <p class="copyright">© 2024 MyBrand. 保留所有權利。</p>
  </div>
</footer>`,
        initialCss: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', sans-serif;
}

/* Navbar */
.navbar {
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(8px);
  /* TODO: 加入 position: sticky; top: 0; z-index: 100 讓 navbar 固定 */
}

.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 64px;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo {
  color: #6366f1;
  font-size: 1.5rem;
  font-weight: 800;
  margin-right: auto;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: #cbd5e1;
  text-decoration: none;
  font-size: 0.9rem;
}

.nav-cta {
  background: #6366f1;
  color: white;
  text-decoration: none;
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  font-size: 0.9rem;
}

/* Hero */
.hero {
  /* TODO: height: 100vh */
  background-color: #1e1b4b;
  /* TODO: linear-gradient 漸層 */
  /* TODO: display: flex; align-items: center; justify-content: center */
  text-align: center;
  padding: 2rem;
}

.hero-content {
  max-width: 700px;
}

.hero h1 {
  color: #ffffff;
  font-size: 1.5rem; /* TODO: 改為 3rem */
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.subtitle {
  color: #c7d2fe;
  font-size: 1.125rem;
  margin-bottom: 2.5rem;
}

.cta-btn {
  color: #fff;
  text-decoration: none;
  /* TODO: 加入按鈕完整樣式 */
}

/* Features */
.features {
  padding: 5rem 2rem;
  background: #f8fafc;
  text-align: center;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 3rem;
}

.features-grid {
  max-width: 1100px;
  margin: 0 auto;
  /* TODO: display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem */
}

.feature-card {
  /* TODO: background; padding; border-radius */
}

.icon { font-size: 2.5rem; margin-bottom: 1rem; }
.feature-card h3 { font-size: 1.125rem; font-weight: 700; color: #1e293b; margin-bottom: 0.5rem; }
.feature-card p { color: #64748b; line-height: 1.6; }

/* Footer */
.footer {
  /* TODO: background: #0f172a */
  padding: 3rem 2rem;
  text-align: center;
}

.footer-logo {
  font-size: 1.5rem;
  font-weight: 800;
  color: #6366f1;
  margin-bottom: 0.5rem;
}

.copyright {
  color: #94a3b8;
  font-size: 0.875rem;
}`,
        targetHtml: `<nav class="navbar">
  <div class="nav-inner">
    <span class="logo">MyBrand</span>
    <ul class="nav-links">
      <li><a href="#">功能</a></li>
      <li><a href="#">定價</a></li>
      <li><a href="#">關於我們</a></li>
    </ul>
    <a href="#" class="nav-cta">免費試用</a>
  </div>
</nav>

<section class="hero">
  <div class="hero-content">
    <h1>打造你的數位未來</h1>
    <p class="subtitle">我們提供最頂尖的技術解決方案，協助企業加速數位轉型。</p>
    <a href="#" class="cta-btn">立即開始</a>
  </div>
</section>

<section class="features">
  <h2 class="section-title">我們的核心優勢</h2>
  <div class="features-grid">
    <div class="feature-card">
      <div class="icon">⚡</div>
      <h3>極速效能</h3>
      <p>採用最新技術架構，確保產品以最佳效能運行。</p>
    </div>
    <div class="feature-card">
      <div class="icon">🔒</div>
      <h3>安全可靠</h3>
      <p>企業級安全防護，數據加密傳輸，資料安全有保障。</p>
    </div>
    <div class="feature-card">
      <div class="icon">📈</div>
      <h3>彈性擴展</h3>
      <p>隨業務成長自動擴展，從新創到大型企業都適用。</p>
    </div>
  </div>
</section>

<footer class="footer">
  <div class="footer-inner">
    <p class="footer-logo">MyBrand</p>
    <p class="copyright">© 2024 MyBrand. 保留所有權利。</p>
  </div>
</footer>`,
        targetCss: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', sans-serif;
}

/* Navbar */
.navbar {
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(8px);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 64px;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo {
  color: #6366f1;
  font-size: 1.5rem;
  font-weight: 800;
  margin-right: auto;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: #cbd5e1;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.nav-links a:hover { color: #ffffff; }

.nav-cta {
  background: #6366f1;
  color: white;
  text-decoration: none;
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.nav-cta:hover { background: #4f46e5; }

/* Hero */
.hero {
  height: 100vh;
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
}

.hero-content { max-width: 700px; }

.hero h1 {
  color: #ffffff;
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.subtitle {
  color: #c7d2fe;
  font-size: 1.125rem;
  margin-bottom: 2.5rem;
}

.cta-btn {
  display: inline-block;
  background: #6366f1;
  color: #ffffff;
  text-decoration: none;
  padding: 0.875rem 2.5rem;
  border-radius: 9999px;
  font-size: 1rem;
  font-weight: 600;
  transition: background 0.2s, transform 0.2s;
}

.cta-btn:hover {
  background: #4f46e5;
  transform: translateY(-2px);
}

/* Features */
.features {
  padding: 5rem 2rem;
  background: #f8fafc;
  text-align: center;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 3rem;
}

.features-grid {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.feature-card {
  background: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.2s, transform 0.2s;
}

.feature-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.icon { font-size: 2.5rem; margin-bottom: 1rem; }
.feature-card h3 { font-size: 1.125rem; font-weight: 700; color: #1e293b; margin-bottom: 0.5rem; }
.feature-card p { color: #64748b; line-height: 1.6; }

/* Footer */
.footer {
  background: #0f172a;
  padding: 3rem 2rem;
  text-align: center;
}

.footer-logo {
  font-size: 1.5rem;
  font-weight: 800;
  color: #6366f1;
  margin-bottom: 0.5rem;
}

.copyright {
  color: #94a3b8;
  font-size: 0.875rem;
}`,
        testCases: [
          {
            label: 'Navbar 使用 position sticky 或 fixed',
            test: `const nav = doc.querySelector('.navbar, nav')
if (!nav) return false
const pos = win.getComputedStyle(nav).position
return pos === 'sticky' || pos === 'fixed'`,
          },
          {
            label: '.hero 使用 Flexbox 置中',
            test: `const el = doc.querySelector('.hero')
if (!el) return false
const style = win.getComputedStyle(el)
return style.display === 'flex' && style.alignItems === 'center' && style.justifyContent === 'center'`,
          },
          {
            label: '.features-grid 使用 CSS Grid',
            test: `const el = doc.querySelector('.features-grid')
if (!el) return false
return win.getComputedStyle(el).display === 'grid'`,
          },
          {
            label: 'Footer 存在於頁面中',
            test: `return !!doc.querySelector('footer, .footer')`,
          },
        ],
      },
    ],
  },

  // ── 4. css-page-blog ──────────────────────────────────────────────────────
  {
    kind: 'css',
    slug: 'css-page-blog',
    methodName: 'Blog 版型',
    title: 'Blog 版型切版',
    description: '實作 Blog 版型：文章卡片列表、側欄佈局、完整 Blog 頁面',
    category: '完整頁面',
    difficulty: 'hard',
    problems: [
      {
        id: 'blog-sidebar',
        title: 'Blog 側欄佈局',
        difficulty: 'medium',
        description:
          '用 CSS Grid 切出 Blog 的主要佈局：左側主內容（文章列表）佔 2/3，右側側欄佔 1/3。',
        requirements: [
          '.blog-layout 使用 display: grid',
          '.blog-layout 使用 grid-template-columns: 2fr 1fr',
          'gap 設定兩欄間距',
          '.sidebar 有背景色和 padding',
        ],
        hints: [
          'grid-template-columns: 2fr 1fr 讓主內容佔 2/3，側欄佔 1/3',
          'gap 設定兩欄之間的距離',
        ],
        initialHtml: `<div class="page-wrapper">
  <header class="site-header">
    <div class="header-inner">
      <span class="site-logo">DevBlog</span>
      <nav class="header-nav">
        <a href="#">首頁</a>
        <a href="#">文章</a>
        <a href="#">關於</a>
      </nav>
    </div>
  </header>

  <main class="blog-layout">
    <section class="main-content">
      <h2 class="content-title">最新文章</h2>
      <article class="article-preview">
        <h3>深入淺出 React Hooks</h3>
        <p class="article-meta">2024-01-15 · 5 分鐘閱讀</p>
        <p>探索 React Hooks 如何改變我們撰寫 React 元件的方式，從 useState 到 useEffect……</p>
        <a href="#" class="read-more">繼續閱讀 →</a>
      </article>
      <article class="article-preview">
        <h3>CSS Grid 完整指南</h3>
        <p class="article-meta">2024-01-10 · 8 分鐘閱讀</p>
        <p>CSS Grid 是現代網頁佈局的利器，本文帶你從零開始掌握 Grid 的所有核心概念……</p>
        <a href="#" class="read-more">繼續閱讀 →</a>
      </article>
      <article class="article-preview">
        <h3>TypeScript 實戰技巧</h3>
        <p class="article-meta">2024-01-05 · 6 分鐘閱讀</p>
        <p>在大型專案中善用 TypeScript 的型別系統，讓程式碼更安全、更易維護……</p>
        <a href="#" class="read-more">繼續閱讀 →</a>
      </article>
    </section>

    <aside class="sidebar">
      <div class="widget">
        <h3 class="widget-title">分類</h3>
        <ul class="category-list">
          <li><a href="#">JavaScript (12)</a></li>
          <li><a href="#">React (8)</a></li>
          <li><a href="#">CSS (6)</a></li>
          <li><a href="#">TypeScript (5)</a></li>
        </ul>
      </div>
      <div class="widget">
        <h3 class="widget-title">近期文章</h3>
        <ul class="recent-list">
          <li><a href="#">深入淺出 React Hooks</a></li>
          <li><a href="#">CSS Grid 完整指南</a></li>
          <li><a href="#">TypeScript 實戰技巧</a></li>
        </ul>
      </div>
    </aside>
  </main>
</div>`,
        initialCss: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', sans-serif;
  background: #f1f5f9;
  color: #334155;
}

.site-header {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 60px;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.site-logo {
  font-size: 1.25rem;
  font-weight: 800;
  color: #6366f1;
  margin-right: auto;
}

.header-nav { display: flex; gap: 1.5rem; }
.header-nav a { color: #475569; text-decoration: none; font-size: 0.9rem; }

.blog-layout {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
  /* TODO: 加入 display: grid */
  /* TODO: 加入 grid-template-columns: 2fr 1fr */
  /* TODO: 加入 gap: 2rem */
}

.main-content { /* 主內容自動佔 2/3 空間 */ }

.content-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
}

.article-preview {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
}

.article-preview h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.375rem;
}

.article-meta {
  font-size: 0.8rem;
  color: #94a3b8;
  margin-bottom: 0.75rem;
}

.article-preview p { color: #475569; line-height: 1.6; margin-bottom: 1rem; }

.read-more {
  color: #6366f1;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 600;
}

.sidebar {
  /* TODO: 加入 background: #ffffff */
  /* TODO: 加入 padding: 1.5rem */
  /* TODO: 加入 border-radius: 10px; border: 1px solid #e2e8f0 */
  align-self: start;
}

.widget { margin-bottom: 2rem; }

.widget-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #6366f1;
}

.category-list, .recent-list {
  list-style: none;
}

.category-list li, .recent-list li {
  padding: 0.375rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.category-list a, .recent-list a {
  color: #475569;
  text-decoration: none;
  font-size: 0.9rem;
}`,
        targetHtml: `<div class="page-wrapper">
  <header class="site-header">
    <div class="header-inner">
      <span class="site-logo">DevBlog</span>
      <nav class="header-nav">
        <a href="#">首頁</a>
        <a href="#">文章</a>
        <a href="#">關於</a>
      </nav>
    </div>
  </header>

  <main class="blog-layout">
    <section class="main-content">
      <h2 class="content-title">最新文章</h2>
      <article class="article-preview">
        <h3>深入淺出 React Hooks</h3>
        <p class="article-meta">2024-01-15 · 5 分鐘閱讀</p>
        <p>探索 React Hooks 如何改變我們撰寫 React 元件的方式，從 useState 到 useEffect……</p>
        <a href="#" class="read-more">繼續閱讀 →</a>
      </article>
      <article class="article-preview">
        <h3>CSS Grid 完整指南</h3>
        <p class="article-meta">2024-01-10 · 8 分鐘閱讀</p>
        <p>CSS Grid 是現代網頁佈局的利器，本文帶你從零開始掌握 Grid 的所有核心概念……</p>
        <a href="#" class="read-more">繼續閱讀 →</a>
      </article>
      <article class="article-preview">
        <h3>TypeScript 實戰技巧</h3>
        <p class="article-meta">2024-01-05 · 6 分鐘閱讀</p>
        <p>在大型專案中善用 TypeScript 的型別系統，讓程式碼更安全、更易維護……</p>
        <a href="#" class="read-more">繼續閱讀 →</a>
      </article>
    </section>

    <aside class="sidebar">
      <div class="widget">
        <h3 class="widget-title">分類</h3>
        <ul class="category-list">
          <li><a href="#">JavaScript (12)</a></li>
          <li><a href="#">React (8)</a></li>
          <li><a href="#">CSS (6)</a></li>
          <li><a href="#">TypeScript (5)</a></li>
        </ul>
      </div>
      <div class="widget">
        <h3 class="widget-title">近期文章</h3>
        <ul class="recent-list">
          <li><a href="#">深入淺出 React Hooks</a></li>
          <li><a href="#">CSS Grid 完整指南</a></li>
          <li><a href="#">TypeScript 實戰技巧</a></li>
        </ul>
      </div>
    </aside>
  </main>
</div>`,
        targetCss: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', sans-serif;
  background: #f1f5f9;
  color: #334155;
}

.site-header {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 60px;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.site-logo {
  font-size: 1.25rem;
  font-weight: 800;
  color: #6366f1;
  margin-right: auto;
}

.header-nav { display: flex; gap: 1.5rem; }
.header-nav a { color: #475569; text-decoration: none; font-size: 0.9rem; }
.header-nav a:hover { color: #6366f1; }

.blog-layout {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  align-items: start;
}

.content-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
}

.article-preview {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
  transition: box-shadow 0.2s;
}

.article-preview:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }

.article-preview h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.375rem;
}

.article-meta {
  font-size: 0.8rem;
  color: #94a3b8;
  margin-bottom: 0.75rem;
}

.article-preview p { color: #475569; line-height: 1.6; margin-bottom: 1rem; }

.read-more {
  color: #6366f1;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 600;
}

.sidebar {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  align-self: start;
  position: sticky;
  top: 76px;
}

.widget { margin-bottom: 2rem; }
.widget:last-child { margin-bottom: 0; }

.widget-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #6366f1;
}

.category-list, .recent-list { list-style: none; }

.category-list li, .recent-list li {
  padding: 0.375rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.category-list a, .recent-list a {
  color: #475569;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.15s;
}

.category-list a:hover, .recent-list a:hover { color: #6366f1; }`,
        testCases: [
          {
            label: '.blog-layout 使用 display: grid',
            test: `const el = doc.querySelector('.blog-layout')
if (!el) return false
return win.getComputedStyle(el).display === 'grid'`,
          },
          {
            label: '.blog-layout 分為兩欄',
            test: `const el = doc.querySelector('.blog-layout')
if (!el) return false
const cols = win.getComputedStyle(el).gridTemplateColumns.trim().split(/\s+/)
return cols.length === 2`,
          },
          {
            label: '主內容欄寬大於側欄欄寬',
            test: `const el = doc.querySelector('.blog-layout')
if (!el) return false
const cols = win.getComputedStyle(el).gridTemplateColumns.trim().split(/\s+/)
if (cols.length < 2) return false
return parseFloat(cols[0]) > parseFloat(cols[1])`,
          },
          {
            label: '.sidebar 有設定 padding',
            test: `const sidebar = doc.querySelector('.sidebar')
if (!sidebar) return false
return parseFloat(win.getComputedStyle(sidebar).paddingLeft) > 0`,
          },
        ],
      },

      {
        id: 'article-cards',
        title: '文章卡片列表',
        difficulty: 'medium',
        description:
          '切出文章卡片網格：每張卡片有封面圖（色塊代替）、發布日期、標題和摘要，用 Grid 三欄排列，hover 時卡片有上移效果。',
        requirements: [
          '.articles-grid 使用 CSS Grid（至少 2 欄）',
          '.article-card 有封面圖、標題、日期、摘要',
          '.article-card hover 時有視覺回饋（transform 或 box-shadow）',
          '.article-card 有 overflow: hidden 和 border-radius',
        ],
        hints: [
          'articles-grid: display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem',
          'article-card: border-radius: 10px; overflow: hidden; transition: transform 0.2s',
          'article-card:hover: transform: translateY(-4px); box-shadow: ...',
        ],
        initialHtml: `<section class="articles-section">
  <h2 class="section-heading">所有文章</h2>
  <div class="articles-grid">
    <div class="article-card">
      <div class="card-image" style="background: #6366f1;"></div>
      <div class="card-content">
        <span class="card-date">2024-01-15</span>
        <h3>深入淺出 React Hooks</h3>
        <p>探索 React Hooks 如何改變我們撰寫 React 元件的方式，從 useState 到自訂 Hook 的完整旅程。</p>
      </div>
    </div>
    <div class="article-card">
      <div class="card-image" style="background: #8b5cf6;"></div>
      <div class="card-content">
        <span class="card-date">2024-01-10</span>
        <h3>CSS Grid 完整指南</h3>
        <p>CSS Grid 是現代網頁佈局的利器，本文帶你從零開始掌握 Grid 的所有核心概念。</p>
      </div>
    </div>
    <div class="article-card">
      <div class="card-image" style="background: #06b6d4;"></div>
      <div class="card-content">
        <span class="card-date">2024-01-05</span>
        <h3>TypeScript 實戰技巧</h3>
        <p>在大型專案中善用 TypeScript 的型別系統，讓程式碼更安全、更易維護。</p>
      </div>
    </div>
    <div class="article-card">
      <div class="card-image" style="background: #10b981;"></div>
      <div class="card-content">
        <span class="card-date">2023-12-28</span>
        <h3>Next.js 15 新特性</h3>
        <p>深入了解 Next.js 最新版本帶來的革命性改變，包括 App Router 與 Server Actions。</p>
      </div>
    </div>
    <div class="article-card">
      <div class="card-image" style="background: #f59e0b;"></div>
      <div class="card-content">
        <span class="card-date">2023-12-20</span>
        <h3>前端效能優化指南</h3>
        <p>從 Core Web Vitals 到 Lighthouse 分數，學習提升網站效能的各種實用技巧。</p>
      </div>
    </div>
    <div class="article-card">
      <div class="card-image" style="background: #ef4444;"></div>
      <div class="card-content">
        <span class="card-date">2023-12-15</span>
        <h3>Git 工作流程最佳實踐</h3>
        <p>掌握 Git Flow、GitHub Flow 等分支策略，讓團隊協作更順暢有效率。</p>
      </div>
    </div>
  </div>
</section>`,
        initialCss: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', sans-serif;
  background: #f1f5f9;
  color: #334155;
  padding: 2rem;
}

.section-heading {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 2rem;
}

.articles-grid {
  /* TODO: display: grid */
  /* TODO: grid-template-columns: repeat(3, 1fr) */
  /* TODO: gap: 1.5rem */
}

.article-card {
  background: #ffffff;
  /* TODO: border-radius: 10px */
  /* TODO: overflow: hidden */
  border: 1px solid #e2e8f0;
  /* TODO: transition: transform 0.2s, box-shadow 0.2s */
}

/* TODO: .article-card:hover — transform: translateY(-4px); box-shadow */

.card-image {
  height: 180px;
  /* 封面圖色塊，inline style 已設定顏色 */
}

.card-content {
  padding: 1.25rem;
}

.card-date {
  display: block;
  font-size: 0.75rem;
  color: #94a3b8;
  margin-bottom: 0.5rem;
}

.article-card h3 {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.article-card p {
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.6;
}`,
        targetHtml: `<section class="articles-section">
  <h2 class="section-heading">所有文章</h2>
  <div class="articles-grid">
    <div class="article-card">
      <div class="card-image" style="background: #6366f1;"></div>
      <div class="card-content">
        <span class="card-date">2024-01-15</span>
        <h3>深入淺出 React Hooks</h3>
        <p>探索 React Hooks 如何改變我們撰寫 React 元件的方式，從 useState 到自訂 Hook 的完整旅程。</p>
      </div>
    </div>
    <div class="article-card">
      <div class="card-image" style="background: #8b5cf6;"></div>
      <div class="card-content">
        <span class="card-date">2024-01-10</span>
        <h3>CSS Grid 完整指南</h3>
        <p>CSS Grid 是現代網頁佈局的利器，本文帶你從零開始掌握 Grid 的所有核心概念。</p>
      </div>
    </div>
    <div class="article-card">
      <div class="card-image" style="background: #06b6d4;"></div>
      <div class="card-content">
        <span class="card-date">2024-01-05</span>
        <h3>TypeScript 實戰技巧</h3>
        <p>在大型專案中善用 TypeScript 的型別系統，讓程式碼更安全、更易維護。</p>
      </div>
    </div>
    <div class="article-card">
      <div class="card-image" style="background: #10b981;"></div>
      <div class="card-content">
        <span class="card-date">2023-12-28</span>
        <h3>Next.js 15 新特性</h3>
        <p>深入了解 Next.js 最新版本帶來的革命性改變，包括 App Router 與 Server Actions。</p>
      </div>
    </div>
    <div class="article-card">
      <div class="card-image" style="background: #f59e0b;"></div>
      <div class="card-content">
        <span class="card-date">2023-12-20</span>
        <h3>前端效能優化指南</h3>
        <p>從 Core Web Vitals 到 Lighthouse 分數，學習提升網站效能的各種實用技巧。</p>
      </div>
    </div>
    <div class="article-card">
      <div class="card-image" style="background: #ef4444;"></div>
      <div class="card-content">
        <span class="card-date">2023-12-15</span>
        <h3>Git 工作流程最佳實踐</h3>
        <p>掌握 Git Flow、GitHub Flow 等分支策略，讓團隊協作更順暢有效率。</p>
      </div>
    </div>
  </div>
</section>`,
        targetCss: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', sans-serif;
  background: #f1f5f9;
  color: #334155;
  padding: 2rem;
}

.section-heading {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 2rem;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.article-card {
  background: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  transition: transform 0.2s, box-shadow 0.2s;
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.card-image {
  height: 180px;
}

.card-content {
  padding: 1.25rem;
}

.card-date {
  display: block;
  font-size: 0.75rem;
  color: #94a3b8;
  margin-bottom: 0.5rem;
}

.article-card h3 {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.article-card p {
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.6;
}`,
        testCases: [
          {
            label: '.articles-grid 使用 display: grid',
            test: `const el = doc.querySelector('.articles-grid')
if (!el) return false
return win.getComputedStyle(el).display === 'grid'`,
          },
          {
            label: '.articles-grid 至少兩欄',
            test: `const el = doc.querySelector('.articles-grid')
if (!el) return false
const cols = win.getComputedStyle(el).gridTemplateColumns.trim().split(/\s+/)
return cols.length >= 2`,
          },
          {
            label: '.article-card 有設定 border-radius',
            test: `const card = doc.querySelector('.article-card')
if (!card) return false
return parseFloat(win.getComputedStyle(card).borderRadius) > 0`,
          },
          {
            label: 'Stylesheet 包含 :hover 規則',
            test: `const s = Array.from(doc.styleSheets).find(sh => !sh.href)
if (!s) return false
try {
  return Array.from(s.cssRules).some(r => r.cssText && r.cssText.includes(':hover'))
} catch (e) {
  return false
}`,
          },
          {
            label: '.article-card 有設定 transition',
            test: `const card = doc.querySelector('.article-card')
if (!card) return false
return win.getComputedStyle(card).transitionDuration !== '0s'`,
          },
        ],
      },

      {
        id: 'blog-complete',
        title: '完整 Blog 頁面',
        difficulty: 'hard',
        description:
          '切出完整的 Blog 頁面：Navbar + Hero Banner + 文章 Grid + 側欄 + Footer，整合所有 Blog 版型要素。',
        requirements: [
          'Navbar 固定在頂部',
          'Hero Banner 有標題和背景',
          '文章和側欄使用 Grid 2fr 1fr 佈局',
          '文章卡片 Grid 排列',
          'Footer 有基本資訊',
        ],
        hints: [
          'navbar: position: sticky; top: 0; z-index: 100',
          '.hero-banner: background: linear-gradient; display: flex; align-items: center',
          '.blog-layout: display: grid; grid-template-columns: 2fr 1fr; gap: 2rem',
          '.articles-grid: display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem',
          'footer: background: #1e293b; color: #94a3b8',
        ],
        initialHtml: `<nav class="navbar">
  <div class="nav-inner">
    <span class="logo">DevBlog</span>
    <div class="nav-links">
      <a href="#">首頁</a>
      <a href="#">文章</a>
      <a href="#">分類</a>
      <a href="#">關於</a>
    </div>
  </div>
</nav>

<div class="hero-banner">
  <div class="banner-content">
    <h1>歡迎來到 DevBlog</h1>
    <p>分享前端開發的知識、技巧與最新趨勢</p>
  </div>
</div>

<div class="blog-layout">
  <main class="articles">
    <h2 class="section-title">最新文章</h2>
    <div class="articles-grid">
      <div class="article-card">
        <div class="card-image" style="background: #6366f1;"></div>
        <div class="card-content">
          <span class="card-date">2024-01-15</span>
          <h3>深入淺出 React Hooks</h3>
          <p>探索 React Hooks 如何改變我們撰寫 React 元件的方式。</p>
        </div>
      </div>
      <div class="article-card">
        <div class="card-image" style="background: #8b5cf6;"></div>
        <div class="card-content">
          <span class="card-date">2024-01-10</span>
          <h3>CSS Grid 完整指南</h3>
          <p>從零開始掌握 CSS Grid 的所有核心概念與應用。</p>
        </div>
      </div>
      <div class="article-card">
        <div class="card-image" style="background: #06b6d4;"></div>
        <div class="card-content">
          <span class="card-date">2024-01-05</span>
          <h3>TypeScript 實戰技巧</h3>
          <p>善用 TypeScript 型別系統讓程式碼更安全易維護。</p>
        </div>
      </div>
      <div class="article-card">
        <div class="card-image" style="background: #10b981;"></div>
        <div class="card-content">
          <span class="card-date">2023-12-28</span>
          <h3>Next.js 15 新特性</h3>
          <p>深入了解 Next.js 最新版本帶來的革命性改變。</p>
        </div>
      </div>
    </div>
  </main>

  <aside class="sidebar">
    <div class="widget">
      <h3 class="widget-title">分類</h3>
      <ul class="category-list">
        <li><a href="#">JavaScript (12)</a></li>
        <li><a href="#">React (8)</a></li>
        <li><a href="#">CSS (6)</a></li>
        <li><a href="#">TypeScript (5)</a></li>
      </ul>
    </div>
    <div class="widget">
      <h3 class="widget-title">近期文章</h3>
      <ul class="recent-list">
        <li><a href="#">深入淺出 React Hooks</a></li>
        <li><a href="#">CSS Grid 完整指南</a></li>
        <li><a href="#">TypeScript 實戰技巧</a></li>
      </ul>
    </div>
  </aside>
</div>

<footer class="footer">
  <div class="footer-inner">
    <span class="footer-logo">DevBlog</span>
    <p class="copyright">© 2024 DevBlog. 保留所有權利。</p>
  </div>
</footer>`,
        initialCss: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', sans-serif;
  background: #f1f5f9;
  color: #334155;
}

/* Navbar */
.navbar {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  /* TODO: position: sticky; top: 0; z-index: 100 */
}

.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 60px;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo {
  font-size: 1.25rem;
  font-weight: 800;
  color: #6366f1;
  margin-right: auto;
}

.nav-links { display: flex; gap: 1.5rem; }
.nav-links a { color: #475569; text-decoration: none; font-size: 0.9rem; }

/* Hero Banner */
.hero-banner {
  background: #1e293b;
  /* TODO: 改成漸層背景 */
  padding: 4rem 2rem;
  /* TODO: display: flex; align-items: center; justify-content: center */
  text-align: center;
}

.banner-content { max-width: 700px; }

.hero-banner h1 {
  color: #ffffff;
  font-size: 2rem; /* TODO: 改大一些 */
  font-weight: 800;
  margin-bottom: 1rem;
}

.hero-banner p {
  color: #94a3b8;
  font-size: 1rem;
}

/* Blog Layout */
.blog-layout {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
  /* TODO: display: grid; grid-template-columns: 2fr 1fr; gap: 2rem */
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
}

/* Articles Grid */
.articles-grid {
  /* TODO: display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem */
}

.article-card {
  background: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.card-image { height: 160px; }
.card-content { padding: 1.25rem; }
.card-date { display: block; font-size: 0.75rem; color: #94a3b8; margin-bottom: 0.5rem; }
.article-card h3 { font-size: 1rem; font-weight: 700; color: #1e293b; margin-bottom: 0.5rem; }
.article-card p { font-size: 0.875rem; color: #64748b; line-height: 1.6; }

/* Sidebar */
.sidebar {
  /* TODO: background; padding; border-radius */
  align-self: start;
}

.widget { margin-bottom: 2rem; }

.widget-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #6366f1;
}

.category-list, .recent-list { list-style: none; }
.category-list li, .recent-list li { padding: 0.375rem 0; border-bottom: 1px solid #f1f5f9; }
.category-list a, .recent-list a { color: #475569; text-decoration: none; font-size: 0.875rem; }

/* Footer */
.footer {
  /* TODO: background: #1e293b */
  padding: 2.5rem 2rem;
  text-align: center;
  margin-top: 4rem;
}

.footer-inner { max-width: 1200px; margin: 0 auto; }

.footer-logo {
  display: block;
  font-size: 1.25rem;
  font-weight: 800;
  color: #6366f1;
  margin-bottom: 0.5rem;
}

.copyright { color: #64748b; font-size: 0.875rem; }`,
        targetHtml: `<nav class="navbar">
  <div class="nav-inner">
    <span class="logo">DevBlog</span>
    <div class="nav-links">
      <a href="#">首頁</a>
      <a href="#">文章</a>
      <a href="#">分類</a>
      <a href="#">關於</a>
    </div>
  </div>
</nav>

<div class="hero-banner">
  <div class="banner-content">
    <h1>歡迎來到 DevBlog</h1>
    <p>分享前端開發的知識、技巧與最新趨勢</p>
  </div>
</div>

<div class="blog-layout">
  <main class="articles">
    <h2 class="section-title">最新文章</h2>
    <div class="articles-grid">
      <div class="article-card">
        <div class="card-image" style="background: #6366f1;"></div>
        <div class="card-content">
          <span class="card-date">2024-01-15</span>
          <h3>深入淺出 React Hooks</h3>
          <p>探索 React Hooks 如何改變我們撰寫 React 元件的方式。</p>
        </div>
      </div>
      <div class="article-card">
        <div class="card-image" style="background: #8b5cf6;"></div>
        <div class="card-content">
          <span class="card-date">2024-01-10</span>
          <h3>CSS Grid 完整指南</h3>
          <p>從零開始掌握 CSS Grid 的所有核心概念與應用。</p>
        </div>
      </div>
      <div class="article-card">
        <div class="card-image" style="background: #06b6d4;"></div>
        <div class="card-content">
          <span class="card-date">2024-01-05</span>
          <h3>TypeScript 實戰技巧</h3>
          <p>善用 TypeScript 型別系統讓程式碼更安全易維護。</p>
        </div>
      </div>
      <div class="article-card">
        <div class="card-image" style="background: #10b981;"></div>
        <div class="card-content">
          <span class="card-date">2023-12-28</span>
          <h3>Next.js 15 新特性</h3>
          <p>深入了解 Next.js 最新版本帶來的革命性改變。</p>
        </div>
      </div>
    </div>
  </main>

  <aside class="sidebar">
    <div class="widget">
      <h3 class="widget-title">分類</h3>
      <ul class="category-list">
        <li><a href="#">JavaScript (12)</a></li>
        <li><a href="#">React (8)</a></li>
        <li><a href="#">CSS (6)</a></li>
        <li><a href="#">TypeScript (5)</a></li>
      </ul>
    </div>
    <div class="widget">
      <h3 class="widget-title">近期文章</h3>
      <ul class="recent-list">
        <li><a href="#">深入淺出 React Hooks</a></li>
        <li><a href="#">CSS Grid 完整指南</a></li>
        <li><a href="#">TypeScript 實戰技巧</a></li>
      </ul>
    </div>
  </aside>
</div>

<footer class="footer">
  <div class="footer-inner">
    <span class="footer-logo">DevBlog</span>
    <p class="copyright">© 2024 DevBlog. 保留所有權利。</p>
  </div>
</footer>`,
        targetCss: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', sans-serif;
  background: #f1f5f9;
  color: #334155;
}

/* Navbar */
.navbar {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 60px;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo {
  font-size: 1.25rem;
  font-weight: 800;
  color: #6366f1;
  margin-right: auto;
}

.nav-links { display: flex; gap: 1.5rem; }
.nav-links a { color: #475569; text-decoration: none; font-size: 0.9rem; transition: color 0.15s; }
.nav-links a:hover { color: #6366f1; }

/* Hero Banner */
.hero-banner {
  background: linear-gradient(135deg, #1e293b 0%, #312e81 100%);
  padding: 5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.banner-content { max-width: 700px; }

.hero-banner h1 {
  color: #ffffff;
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero-banner p {
  color: #94a3b8;
  font-size: 1.125rem;
}

/* Blog Layout */
.blog-layout {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  align-items: start;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
}

/* Articles Grid */
.articles-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.article-card {
  background: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  transition: transform 0.2s, box-shadow 0.2s;
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
}

.card-image { height: 160px; }
.card-content { padding: 1.25rem; }
.card-date { display: block; font-size: 0.75rem; color: #94a3b8; margin-bottom: 0.5rem; }
.article-card h3 { font-size: 1rem; font-weight: 700; color: #1e293b; margin-bottom: 0.5rem; }
.article-card p { font-size: 0.875rem; color: #64748b; line-height: 1.6; }

/* Sidebar */
.sidebar {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  align-self: start;
  position: sticky;
  top: 76px;
}

.widget { margin-bottom: 2rem; }
.widget:last-child { margin-bottom: 0; }

.widget-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #6366f1;
}

.category-list, .recent-list { list-style: none; }
.category-list li, .recent-list li { padding: 0.375rem 0; border-bottom: 1px solid #f1f5f9; }
.category-list a, .recent-list a { color: #475569; text-decoration: none; font-size: 0.875rem; transition: color 0.15s; }
.category-list a:hover, .recent-list a:hover { color: #6366f1; }

/* Footer */
.footer {
  background: #1e293b;
  padding: 2.5rem 2rem;
  text-align: center;
  margin-top: 4rem;
}

.footer-inner { max-width: 1200px; margin: 0 auto; }

.footer-logo {
  display: block;
  font-size: 1.25rem;
  font-weight: 800;
  color: #6366f1;
  margin-bottom: 0.5rem;
}

.copyright { color: #94a3b8; font-size: 0.875rem; }`,
        testCases: [
          {
            label: 'Navbar 存在於頁面中',
            test: `return !!doc.querySelector('.navbar, nav')`,
          },
          {
            label: '.blog-layout 使用 display: grid',
            test: `const el = doc.querySelector('.blog-layout')
if (!el) return false
return win.getComputedStyle(el).display === 'grid'`,
          },
          {
            label: '頁面有至少 2 個文章卡片',
            test: `return doc.querySelectorAll('.article-card, article').length >= 2`,
          },
          {
            label: '.sidebar 存在於頁面中',
            test: `return !!doc.querySelector('.sidebar, aside')`,
          },
          {
            label: 'Footer 存在於頁面中',
            test: `return !!doc.querySelector('footer, .footer')`,
          },
        ],
      },
    ],
  }
]

export function hasCssChallenge(slug: string): boolean {
  return cssLayoutChallenges.some(e => e.slug === slug)
}

export function getCssChallenge(slug: string): CssLayoutEntry | undefined {
  return cssLayoutChallenges.find(e => e.slug === slug)
}
