import Link from 'next/link'
import { getKeyPointsBySlug } from '@/lib/db/queries'
import CheatsheetClient from '../CheatsheetClient'
import type { MethodEntry } from '../types'
import { SUB_CATEGORY_ORDER } from './constants'

export const dynamic = 'force-dynamic'

const METHODS: MethodEntry[] = [
  // ── 建立 ────────────────────────────────────────────────────
  {
    slug: 'date-create',
    name: 'new Date() / Date.now()',
    mutates: false,
    returns: 'Date 實例 / 毫秒時間戳（number）',
    syntax: 'new Date() / Date.now()',
    subCategory: '建立',
    note: 'Date.now() 最輕量；new Date(str) 注意時區問題',
  },

  // ── 取得資訊 ────────────────────────────────────────────────
  {
    slug: 'date-year-month',
    name: 'getFullYear() / getMonth()',
    mutates: false,
    returns: '數字（月份 0-based，0=1月）',
    syntax: 'date.getFullYear()',
    subCategory: '取得資訊',
    note: 'getMonth() 回傳 0~11，+1 才是真實月份',
  },
  {
    slug: 'date-date-day',
    name: 'getDate() / getDay()',
    mutates: false,
    returns: '數字（getDate: 1-31 / getDay: 0-6）',
    syntax: 'date.getDate()',
    subCategory: '取得資訊',
    note: 'getDay() 0=週日、6=週六，容易搞混',
  },
  {
    slug: 'date-time',
    name: 'getHours() / getMinutes() / getSeconds()',
    mutates: false,
    returns: '數字（時: 0-23 / 分秒: 0-59）',
    syntax: 'date.getHours()',
    subCategory: '取得資訊',
    note: '對應 setter：setHours() / setMinutes() / setSeconds()',
  },

  // ── 格式化 ──────────────────────────────────────────────────
  {
    slug: 'date-toisostring',
    name: 'toISOString()',
    mutates: false,
    returns: 'ISO 8601 字串（永遠是 UTC）',
    syntax: 'date.toISOString()',
    subCategory: '格式化',
    note: '輸出如 "2024-01-15T08:00:00.000Z"，與本地時區無關',
  },
  {
    slug: 'date-tolocale',
    name: 'toLocaleDateString() / toLocaleString()',
    mutates: false,
    returns: '依地區格式化的字串',
    syntax: 'date.toLocaleDateString(locale)',
    subCategory: '格式化',
    note: '可傳 "zh-TW"、"en-US" 等 locale 控制輸出格式',
  },

  // ── 運算 ────────────────────────────────────────────────────
  {
    slug: 'date-calc',
    name: 'Date 運算 / setDate()',
    mutates: true,
    returns: '時間差（number）/ setDate 回傳毫秒時間戳',
    syntax: 'date.setDate(date.getDate() + N)',
    subCategory: '運算',
    note: 'Date 相減得毫秒差；setDate() 直接修改原 Date 物件',
  },

  // ── 常見陷阱 ────────────────────────────────────────────────
  {
    slug: 'date-traps',
    name: 'Date 常見陷阱',
    mutates: false,
    returns: '—',
    syntax: '—',
    subCategory: '常見陷阱',
    note: 'getMonth 0-based、getDay 週日=0、ISO 字串含 T 當 UTC 解析',
  },
]

export default async function DateCheatsheetPage() {
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
          <span className="text-gray-300">日期時間方法</span>
        </div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-100">日期時間速查表</h1>
          <p className="text-gray-500 text-sm mt-1">
            {METHODS.length} 個主題 · setter 方法會修改原 Date 物件
          </p>
        </div>
        <CheatsheetClient
          methods={METHODS}
          initialKeyPointsMap={keyPointsMap}
          subCategoryOrder={SUB_CATEGORY_ORDER}
          columnConfig={{ col2Label: '修改 Date', col2Type: 'boolean' }}
        />
      </div>
    </main>
  )
}
