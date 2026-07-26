import Link from 'next/link'
import { getKeyPointsBySlug } from '@/lib/db/queries'
import CheatsheetClient from '../CheatsheetClient'
import type { MethodEntry } from '../types'
import { SUB_CATEGORY_ORDER } from './constants'

export const dynamic = 'force-dynamic'

const METHODS: MethodEntry[] = [
  // ── 型別轉換 ────────────────────────────────────────────────
  {
    slug: 'num-number',
    name: 'Number()',
    mutates: false,
    badge: '全域',
    returns: '數字；無法轉換回傳 NaN',
    syntax: 'Number(value)',
    subCategory: '型別轉換',
    note: '空字串→0、null→0、undefined→NaN、true→1',
  },
  {
    slug: 'num-parseint',
    name: 'parseInt()',
    mutates: false,
    badge: '全域',
    returns: '整數；無法解析回傳 NaN',
    syntax: 'parseInt(str, radix)',
    subCategory: '型別轉換',
    note: '部分解析（遇非數字停止），建議一律傳第二參數進位制',
  },
  {
    slug: 'num-parsefloat',
    name: 'parseFloat()',
    mutates: false,
    badge: '全域',
    returns: '浮點數；無法解析回傳 NaN',
    syntax: 'parseFloat(str)',
    subCategory: '型別轉換',
    note: '遇非數字字元停止，不支援進位制',
  },

  // ── 數字判斷 ────────────────────────────────────────────────
  {
    slug: 'num-isnan',
    name: 'isNaN() / Number.isNaN()',
    mutates: false,
    badge: '全域/靜態',
    returns: 'true 或 false',
    syntax: 'Number.isNaN(value)',
    subCategory: '數字判斷',
    note: '全域版先做型別轉換；Number.isNaN() 不轉換，更嚴格',
  },
  {
    slug: 'num-isfinite',
    name: 'isFinite() / Number.isFinite()',
    mutates: false,
    badge: '全域/靜態',
    returns: 'true 或 false',
    syntax: 'Number.isFinite(value)',
    subCategory: '數字判斷',
    note: '全域版先做型別轉換；Number.isFinite() 非數字直接 false',
  },
  {
    slug: 'num-isinteger',
    name: 'Number.isInteger()',
    mutates: false,
    badge: '靜態',
    returns: 'true 或 false',
    syntax: 'Number.isInteger(value)',
    subCategory: '數字判斷',
    note: '1.0 視為整數；Infinity 不是整數',
  },

  // ── 格式化 ──────────────────────────────────────────────────
  {
    slug: 'num-tofixed',
    name: 'toFixed()',
    mutates: false,
    badge: '實例',
    returns: '四捨五入後的字串（非數字）',
    syntax: 'num.toFixed(digits)',
    subCategory: '格式化',
    note: '回傳字串！計算前需 Number() 或 parseFloat() 轉回',
  },
  {
    slug: 'num-locale',
    name: 'toLocaleString() / Intl.NumberFormat',
    mutates: false,
    badge: '實例/全域',
    returns: '格式化後的字串',
    syntax: 'num.toLocaleString(locale, opts)',
    subCategory: '格式化',
    note: '千分位、貨幣、百分比，依地區設定輸出',
  },

  // ── Math 基礎 ───────────────────────────────────────────────
  {
    slug: 'num-math-basic',
    name: 'Math.floor / ceil / round / abs / random',
    mutates: false,
    badge: 'Math',
    returns: '數字（random 回傳 [0, 1) 浮點數）',
    syntax: 'Math.floor(num)',
    subCategory: 'Math 基礎',
    note: 'floor 無條件捨去、ceil 無條件進位、round 四捨五入',
  },

  // ── Math 進階 ───────────────────────────────────────────────
  {
    slug: 'num-math-advanced',
    name: 'Math.max / min / pow / sqrt / cbrt',
    mutates: false,
    badge: 'Math',
    returns: '數字',
    syntax: 'Math.max(...nums)',
    subCategory: 'Math 進階',
    note: 'Math.max() 不接受陣列，需用 spread 或 apply',
  },

  // ── 精度問題 ────────────────────────────────────────────────
  {
    slug: 'num-precision',
    name: '浮點數精度問題',
    mutates: false,
    badge: '概念',
    returns: '—',
    syntax: 'Number.EPSILON',
    subCategory: '精度問題',
    note: '0.1 + 0.2 !== 0.3，解法：toFixed() / Math.round / 整數運算',
  },
]

export default async function NumberCheatsheetPage() {
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
          <span className="text-gray-300">數字方法</span>
        </div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-100">數字方法速查表</h1>
          <p className="text-gray-500 text-sm mt-1">
            {METHODS.length} 個方法 · 含 Number、parseInt、Math 系列
          </p>
        </div>
        <CheatsheetClient
          methods={METHODS}
          initialKeyPointsMap={keyPointsMap}
          subCategoryOrder={SUB_CATEGORY_ORDER}
          columnConfig={{ col2Label: '類型', col2Type: 'badge' }}
        />
      </div>
    </main>
  )
}
