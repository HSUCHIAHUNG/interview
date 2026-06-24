@AGENTS.md

# 前端技術複習平台

Next.js 16 + React 19 + Tailwind CSS 4 的前端面試題練習平台。支援多選題測驗與互動 Demo。

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
