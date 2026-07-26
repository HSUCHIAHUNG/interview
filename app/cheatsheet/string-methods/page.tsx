import Link from 'next/link'
import { getKeyPointsBySlug } from '@/lib/db/queries'
import CheatsheetClient from '../CheatsheetClient'
import type { MethodEntry } from '../types'
import { SUB_CATEGORY_ORDER } from './constants'

export const dynamic = 'force-dynamic'

const METHODS: MethodEntry[] = [
  // ── 搜尋與判斷 ──────────────────────────────────────────────
  {
    slug: 'str-indexof',
    name: 'indexOf() / lastIndexOf()',
    mutates: false,
    returns: '找到回傳 index；找不到回傳 -1',
    syntax: 'str.indexOf(sub)',
    subCategory: '搜尋與判斷',
    note: 'lastIndexOf() 從末端往前搜尋',
  },
  {
    slug: 'str-includes',
    name: 'includes()',
    mutates: false,
    returns: 'true 或 false',
    syntax: 'str.includes(sub)',
    subCategory: '搜尋與判斷',
    note: '判斷是否包含子字串，區分大小寫',
  },
  {
    slug: 'str-startswith-endswith',
    name: 'startsWith() / endsWith()',
    mutates: false,
    returns: 'true 或 false',
    syntax: 'str.startsWith(sub)',
    subCategory: '搜尋與判斷',
    note: '判斷字串開頭或結尾是否符合指定字串',
  },

  // ── 擷取與切割 ──────────────────────────────────────────────
  {
    slug: 'str-slice',
    name: 'slice()',
    mutates: false,
    returns: '擷取範圍的新字串',
    syntax: 'str.slice(start, end)',
    subCategory: '擷取與切割',
    note: '支援負數 index，不含 end',
  },
  {
    slug: 'str-substring',
    name: 'substring()',
    mutates: false,
    returns: '擷取範圍的新字串',
    syntax: 'str.substring(start, end)',
    subCategory: '擷取與切割',
    note: '不支援負數（視為 0），參數自動交換',
  },
  {
    slug: 'str-split',
    name: 'split()',
    mutates: false,
    returns: '切割後的字串陣列',
    syntax: "str.split(separator)",
    subCategory: '擷取與切割',
    note: '傳空字串可拆成每個字元',
  },

  // ── 轉換與格式化 ────────────────────────────────────────────
  {
    slug: 'str-case',
    name: 'toUpperCase() / toLowerCase()',
    mutates: false,
    returns: '轉換大小寫後的新字串',
    syntax: 'str.toUpperCase()',
    subCategory: '轉換與格式化',
    note: '字串不可變，永遠回傳新字串',
  },
  {
    slug: 'str-trim',
    name: 'trim() / trimStart() / trimEnd()',
    mutates: false,
    returns: '去除空白後的新字串',
    syntax: 'str.trim()',
    subCategory: '轉換與格式化',
    note: 'trimStart() 只去首，trimEnd() 只去尾',
  },
  {
    slug: 'str-replace',
    name: 'replace() / replaceAll()',
    mutates: false,
    returns: '替換後的新字串',
    syntax: 'str.replace(pattern, replacement)',
    subCategory: '轉換與格式化',
    note: 'replace() 只換第一個；replaceAll() 換全部',
  },
  {
    slug: 'str-pad',
    name: 'padStart() / padEnd()',
    mutates: false,
    returns: '補齊至指定長度的新字串',
    syntax: 'str.padStart(length, padStr)',
    subCategory: '轉換與格式化',
    note: '常用於數字補零，如 "5" → "05"',
  },
  {
    slug: 'str-repeat',
    name: 'repeat()',
    mutates: false,
    returns: '重複指定次數的新字串',
    syntax: 'str.repeat(count)',
    subCategory: '轉換與格式化',
    note: 'count 為 0 回傳空字串',
  },

  // ── 字元存取 ────────────────────────────────────────────────
  {
    slug: 'str-charat',
    name: 'charAt() / str[i] / at()',
    mutates: false,
    returns: '指定位置的字元；越界行為各異',
    syntax: 'str.charAt(i) / str[i] / str.at(i)',
    subCategory: '字元存取',
    note: 'at() 支援負數 index；越界時 charAt() 回傳空字串，str[i] 回傳 undefined',
  },

  // ── 金額格式化 ──────────────────────────────────────────────
  {
    slug: 'str-locale',
    name: 'toLocaleString() / Intl.NumberFormat',
    mutates: false,
    returns: '格式化後的字串',
    syntax: 'num.toLocaleString(locale, options)',
    subCategory: '金額格式化',
    note: '可格式化千分位、貨幣符號，依地區設定輸出',
  },
]

export default async function StringCheatsheetPage() {
  const keyPointsMap: Record<string, { id: number; text: string }[]> = {}
  await Promise.all(
    METHODS.map(async (m) => {
      keyPointsMap[m.slug] = await getKeyPointsBySlug(m.slug)
    }),
  )

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-8 text-sm">
          <Link href="/cheatsheet" className="text-gray-500 hover:text-gray-300 transition">速查表</Link>
          <span className="text-gray-700">/</span>
          <span className="text-gray-300">字串方法</span>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-100">字串方法速查表</h1>
          <p className="text-gray-500 text-sm mt-1">
            {METHODS.length} 個方法 · 快速複習回傳值、語法，並新增自己的重點筆記
          </p>
        </div>

        <CheatsheetClient
          methods={METHODS}
          initialKeyPointsMap={keyPointsMap}
          subCategoryOrder={SUB_CATEGORY_ORDER}
        />
      </div>
    </main>
  )
}
