import Link from 'next/link'
import { getKeyPointsBySlug } from '@/lib/db/queries'
import CheatsheetClient from '../CheatsheetClient'
import type { MethodEntry } from '../types'
import { SUB_CATEGORY_ORDER } from './constants'

export const dynamic = 'force-dynamic'

const METHODS: MethodEntry[] = [
  // ── Map 操作 ────────────────────────────────────────────────
  {
    slug: 'map-basic',
    name: 'Map 基本操作',
    mutates: false,
    badge: 'Map',
    returns: 'set→Map 本身 / get→值或 undefined / has→boolean / delete→boolean / size→number',
    syntax: 'map.set(key, val)',
    subCategory: 'Map 操作',
    note: 'key 可為任意型別；set() 回傳 Map 本身，可鏈式呼叫',
  },
  {
    slug: 'map-vs-object',
    name: 'Map vs 物件',
    mutates: false,
    badge: 'Map',
    returns: '—（概念比較）',
    syntax: 'new Map()',
    subCategory: 'Map 操作',
    note: 'Map 保證插入順序、key 可為物件、有 size 屬性',
  },
  {
    slug: 'map-iterate',
    name: 'Map 迭代與轉換',
    mutates: false,
    badge: 'Map',
    returns: 'forEach→undefined / entries()→Iterator',
    syntax: 'map.forEach((val, key) => ...)',
    subCategory: 'Map 操作',
    note: '[...map] 或 Array.from(map) 可轉陣列',
  },

  // ── WeakMap ─────────────────────────────────────────────────
  {
    slug: 'weakmap-basic',
    name: 'WeakMap',
    mutates: false,
    badge: 'WeakMap',
    returns: 'set→WeakMap / get→值或 undefined / has→boolean',
    syntax: 'new WeakMap()',
    subCategory: 'WeakMap',
    note: 'key 只能是物件；弱引用允許 GC 回收；不可迭代',
  },

  // ── Set 操作 ────────────────────────────────────────────────
  {
    slug: 'set-basic',
    name: 'Set 基本操作',
    mutates: false,
    badge: 'Set',
    returns: 'add→Set 本身 / has→boolean / delete→boolean / size→number',
    syntax: 'set.add(val)',
    subCategory: 'Set 操作',
    note: 'add() 回傳 Set 本身，可鏈式呼叫；值唯一',
  },
  {
    slug: 'set-dedup',
    name: 'Set 去重特性',
    mutates: false,
    badge: 'Set',
    returns: '去重後的 Set',
    syntax: 'new Set([...arr])',
    subCategory: 'Set 操作',
    note: 'NaN 視為相等（只保留一個）；物件用引用比較，不去重',
  },
  {
    slug: 'set-vs-array',
    name: 'Set vs 陣列',
    mutates: false,
    badge: 'Set',
    returns: '—（概念比較）',
    syntax: 'set.has(val)',
    subCategory: 'Set 操作',
    note: 'has() O(1) vs indexOf() O(n)；Set 無法直接存取索引',
  },

  // ── WeakSet ─────────────────────────────────────────────────
  {
    slug: 'weakset-basic',
    name: 'WeakSet',
    mutates: false,
    badge: 'WeakSet',
    returns: 'add→WeakSet / has→boolean / delete→boolean',
    syntax: 'new WeakSet()',
    subCategory: 'WeakSet',
    note: '只能存物件；弱引用；不可迭代，使用場景較少',
  },
]

export default async function MapSetCheatsheetPage() {
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
          <span className="text-gray-300">Map & Set</span>
        </div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-100">Map & Set 速查表</h1>
          <p className="text-gray-500 text-sm mt-1">
            {METHODS.length} 個主題 · 含 Map、WeakMap、Set、WeakSet
          </p>
        </div>
        <CheatsheetClient
          methods={METHODS}
          initialKeyPointsMap={keyPointsMap}
          subCategoryOrder={SUB_CATEGORY_ORDER}
          columnConfig={{ col2Label: '適用', col2Type: 'badge' }}
        />
      </div>
    </main>
  )
}
