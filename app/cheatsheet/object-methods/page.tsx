import Link from 'next/link'
import { getKeyPointsBySlug } from '@/lib/db/queries'
import CheatsheetClient from '../CheatsheetClient'
import type { MethodEntry } from '../types'
import { SUB_CATEGORY_ORDER } from './constants'

export const dynamic = 'force-dynamic'

const METHODS: MethodEntry[] = [
  // ── 取得資訊 ────────────────────────────────────────────────
  {
    slug: 'obj-keys',
    name: 'Object.keys()',
    mutates: false,
    returns: 'key 字串陣列',
    syntax: 'Object.keys(obj)',
    subCategory: '取得資訊',
    note: '只包含自身可枚舉屬性',
  },
  {
    slug: 'obj-values',
    name: 'Object.values()',
    mutates: false,
    returns: '值陣列',
    syntax: 'Object.values(obj)',
    subCategory: '取得資訊',
    note: '順序與 Object.keys() 一致',
  },
  {
    slug: 'obj-entries',
    name: 'Object.entries()',
    mutates: false,
    returns: '[key, value] 二維陣列',
    syntax: 'Object.entries(obj)',
    subCategory: '取得資訊',
    note: '可用 for...of 搭配解構迭代',
  },

  // ── 複製 ────────────────────────────────────────────────────
  {
    slug: 'obj-assign',
    name: 'Object.assign()',
    mutates: true,
    returns: '修改後的 target 物件（同一參考）',
    syntax: 'Object.assign(target, ...sources)',
    subCategory: '複製',
    note: '淺拷貝；直接修改 target，巢狀物件仍共用參考',
  },
  {
    slug: 'obj-spread',
    name: 'Spread {...obj}',
    mutates: false,
    returns: '新物件',
    syntax: '{ ...obj, key: val }',
    subCategory: '複製',
    note: '淺拷貝；不修改原物件，常用於 immutable 更新',
  },

  // ── 保護 ────────────────────────────────────────────────────
  {
    slug: 'obj-freeze',
    name: 'Object.freeze()',
    mutates: true,
    returns: '凍結後的原物件（同一參考）',
    syntax: 'Object.freeze(obj)',
    subCategory: '保護',
    note: '禁止新增、刪除、修改屬性；僅淺層凍結',
  },
  {
    slug: 'obj-seal',
    name: 'Object.seal()',
    mutates: true,
    returns: '封印後的原物件（同一參考）',
    syntax: 'Object.seal(obj)',
    subCategory: '保護',
    note: '允許修改既有屬性值，但不可新增或刪除屬性',
  },

  // ── 建立與轉換 ──────────────────────────────────────────────
  {
    slug: 'obj-create',
    name: 'Object.create()',
    mutates: false,
    returns: '以指定原型建立的新物件',
    syntax: 'Object.create(proto)',
    subCategory: '建立與轉換',
    note: '可傳 null 建立無原型物件（純 Map 用途）',
  },
  {
    slug: 'obj-fromentries',
    name: 'Object.fromEntries()',
    mutates: false,
    returns: '新物件',
    syntax: 'Object.fromEntries(entries)',
    subCategory: '建立與轉換',
    note: '為 Object.entries() 的逆操作，也可轉換 Map',
  },

  // ── 查詢與比較 ──────────────────────────────────────────────
  {
    slug: 'obj-query',
    name: 'hasOwnProperty / in / Object.is()',
    mutates: false,
    returns: 'true 或 false',
    syntax: 'obj.hasOwnProperty(key)',
    subCategory: '查詢與比較',
    note: 'in 會查原型鏈；Object.is() 可正確比較 NaN 和 ±0',
  },
]

export default async function ObjectCheatsheetPage() {
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
          <span className="text-gray-300">物件方法</span>
        </div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-100">物件方法速查表</h1>
          <p className="text-gray-500 text-sm mt-1">
            {METHODS.length} 個方法 · freeze/seal/assign 會修改原物件
          </p>
        </div>
        <CheatsheetClient
          methods={METHODS}
          initialKeyPointsMap={keyPointsMap}
          subCategoryOrder={SUB_CATEGORY_ORDER}
          columnConfig={{ col2Label: '修改原物件', col2Type: 'boolean' }}
        />
      </div>
    </main>
  )
}
