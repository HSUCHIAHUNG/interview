@AGENTS.md

# 前端技術複習平台

Next.js 16 + React 19 + Tailwind CSS 4 的前端面試題練習平台。支援多選題測驗與互動 Demo。

## 開發流程串接（grill-me → to-spec → to-tickets → implement）

- 用 `/grill-me`（[mattpocock/skills](https://github.com/mattpocock/skills) 的 grilling skill）跟使用者訪談、釐清需求並取得共識，是**規劃/對齊理解**的階段，本身不寫程式、不建立 spec 或 tickets。
- 如果這次訪談的主題是要寫程式（不是純討論、規劃文件、或非程式決策），在訪談結束、frontier 清空、使用者確認理解一致之後，要接著走標準長流程，依序呼叫：
  1. `/to-spec`：不用再訪談，直接把訪談共識整理成 spec，發布到 issue tracker（見 [docs/agents/issue-tracker.md](docs/agents/issue-tracker.md)），標記 `ready-for-agent`。
  2. `/to-tickets`：把 spec 拆成垂直切片（vertical slice）的 tracer-bullet tickets，各自標明 blocking edges，跟使用者確認粒度後發布。
  3. `/implement`：依 spec/tickets 實作，在事先約定好的 seam 上用 `/tdd` 的紅燈 → 綠燈 → 重構紀律（先寫測試，看它失敗，再寫最少的程式碼讓它通過，最後才重構），完成後跑 `/code-review`，再 commit。
- 不要在 grill-me 訪談一結束就直接開始寫實作、事後才補測試；也不要跳過 `/to-spec`／`/to-tickets` 直接進 `/implement`。

> `/to-spec`、`/to-tickets`、`/implement` 跟 `/grilling`、`/tdd`、`/code-review` 一樣，都來自 mattpocock-skills 外掛，只是設了 `disable-model-invocation`（不會被自動建議，需要直接打指令呼叫）。設定已對接 `docs/agents/` 底下的 issue tracker / triage labels / domain docs。

## 核心概念

每個「主題」由 **題庫** 和 **Demo** 兩部分組成：
- **題庫**（`/quiz/<slug>`）：逐題作答的多選題，答完顯示解釋，最後統計分數
- **Demo**（`/demo/<slug>`）：互動式程式碼示範，讓使用者親眼看到概念運作

首頁（`/`）自動掃描 `topics/` 資料夾，列出所有主題卡片。

## 新增主題的步驟

### 1. 建立題庫資料

```
topics/<slug>/meta.ts       ← 主題 metadata
topics/<slug>/questions.ts  ← 題目陣列
```

**`meta.ts` 格式：**

```ts
import type { TopicMeta } from '@/lib/topics'

export const meta: TopicMeta = {
  title: '主題名稱',
  description: '一行說明',
  category: 'JavaScript',   // JavaScript | React | Next.js | CSS | TypeScript | Network | Browser
  difficulty: 'medium',     // easy | medium | hard
}
```

**`questions.ts` 格式：**

```ts
import type { Question } from '@/lib/topics'

export const questions: Question[] = [
  {
    id: 1,
    question: '問題文字（可以用 \n 換行，例如放程式碼）',
    options: ['選項A', '選項B', '選項C', '選項D'],
    answer: 1,           // 正確選項的 index（0-based）
    explanation: '答案解釋，說明為什麼正確或錯誤',
  },
]
```

### 2. 建立 Demo 頁面

```
app/demo/<slug>/page.tsx        ← Server Component，頁面框架
app/demo/<slug>/DemoClient.tsx  ← 'use client'，互動邏輯
```

參考 [app/demo/debounce/](app/demo/debounce/) 的結構來實作。

## 目前主題

| slug       | 標題      | 分類       | 難度 | 題數 |
|------------|-----------|------------|------|------|
| `debounce` | Debounce  | JavaScript | 中級 | 17題 |

## 關鍵檔案

| 路徑 | 用途 |
|------|------|
| [lib/topics.ts](lib/topics.ts) | 型別定義 + 自動掃描 topics/ 的工具函式 |
| [app/page.tsx](app/page.tsx) | 首頁，顯示所有主題卡片 |
| [app/quiz/[topic]/QuizClient.tsx](app/quiz/%5Btopic%5D/QuizClient.tsx) | 測驗互動邏輯（所有主題共用） |

## 開發指令

```bash
npm run dev    # 啟動開發伺服器
npm run build  # 建置
npm run lint   # ESLint 檢查
```

## Agent skills

### Issue tracker

Issues and specs live as GitHub issues in this repo (`gh issue` CLI). See [docs/agents/issue-tracker.md](docs/agents/issue-tracker.md)。

### Triage labels

Default five canonical labels (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`)。See [docs/agents/triage-labels.md](docs/agents/triage-labels.md)。

### Domain docs

Single-context layout: `CONTEXT.md` + `docs/adr/` at repo root（目前都還不存在，`/domain-modeling` 用到時會延遲建立）。See [docs/agents/domain.md](docs/agents/domain.md)。
