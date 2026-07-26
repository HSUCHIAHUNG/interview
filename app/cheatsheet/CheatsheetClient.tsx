'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { MethodEntry, ColumnConfig } from './types'

interface KeyPoint {
  id: number
  text: string
}

interface Props {
  methods: MethodEntry[]
  initialKeyPointsMap: Record<string, KeyPoint[]>
  subCategoryOrder: string[]
  columnConfig?: ColumnConfig
}

const DEFAULT_COLUMN_CONFIG: ColumnConfig = {
  col2Label: '改變原始值',
  col2Type: 'boolean',
}

function Col2Cell({ m, config }: { m: MethodEntry; config: ColumnConfig }) {
  if (config.col2Type === 'badge') {
    return (
      <span className="text-xs px-2 py-0.5 rounded border border-gray-700 text-gray-400 bg-gray-800/60 whitespace-nowrap">
        {m.badge ?? '—'}
      </span>
    )
  }
  return <span className="text-base">{m.mutates ? '✅' : '❌'}</span>
}

function KeyPointsSection({ slug, initial }: { slug: string; initial: KeyPoint[] }) {
  const [items, setItems] = useState<KeyPoint[]>(initial)
  const [input, setInput] = useState('')
  const [adding, setAdding] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  async function handleAdd() {
    const text = input.trim()
    if (!text) return
    setAdding(true)
    try {
      const res = await fetch(`/api/key-points/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (res.ok) {
        const { id } = await res.json() as { id: number }
        setItems(prev => [...prev, { id, text }])
        setInput('')
      }
    } finally {
      setAdding(false)
    }
  }

  async function handleDelete(id: number) {
    setDeletingId(id)
    try {
      await fetch(`/api/key-points/${slug}/${id}`, { method: 'DELETE' })
      setItems(prev => prev.filter(k => k.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="mt-3 space-y-2">
      {items.length > 0 && (
        <ul className="space-y-1.5">
          {items.map(kp => (
            <li key={kp.id} className="flex items-start gap-2 group">
              <span className="text-blue-400 mt-0.5 shrink-0">•</span>
              <span className="text-gray-300 text-sm flex-1">{kp.text}</span>
              <button
                onClick={() => handleDelete(kp.id)}
                disabled={deletingId === kp.id}
                className="text-gray-700 hover:text-red-400 transition text-xs shrink-0 opacity-0 group-hover:opacity-100 mt-0.5"
              >
                {deletingId === kp.id ? '...' : '✕'}
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2 pt-1">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="新增重點筆記..."
          className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-1.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-gray-500 transition"
        />
        <button
          onClick={handleAdd}
          disabled={adding || !input.trim()}
          className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed text-gray-300 text-sm rounded-md transition"
        >
          {adding ? '...' : '+ 新增'}
        </button>
      </div>
    </div>
  )
}

function MethodRow({
  m,
  isOpen,
  keyPoints,
  config,
  onToggle,
}: {
  m: MethodEntry
  isOpen: boolean
  keyPoints: KeyPoint[]
  config: ColumnConfig
  onToggle: () => void
}) {
  return (
    <div className="border border-gray-800 rounded-lg overflow-hidden bg-gray-900/40">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3.5 text-left hover:bg-gray-800/40 transition"
      >
        {/* Mobile layout */}
        <div className="md:hidden">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-gray-100 font-medium">{m.name}</span>
                <Link
                  href={`/notes/${m.slug}`}
                  onClick={e => e.stopPropagation()}
                  className="text-gray-600 hover:text-blue-400 transition text-xs"
                >
                  查看說明
                </Link>
              </div>
              {m.note && <p className="text-gray-500 text-xs mt-0.5">{m.note}</p>}
            </div>
            <span className="text-gray-600 text-xs shrink-0 mt-1">{isOpen ? '▲' : '▼'}</span>
          </div>
          <div className="mt-2.5 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-xs w-16 shrink-0">{config.col2Label}</span>
              <Col2Cell m={m} config={config} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-gray-600 text-xs w-16 shrink-0">回傳值</span>
              <p className="text-gray-400 text-sm leading-relaxed">{m.returns}</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gray-600 text-xs w-16 shrink-0 mt-0.5">語法</span>
              <code className="text-blue-300 text-xs font-mono bg-blue-950/30 px-1.5 py-0.5 rounded">{m.syntax}</code>
            </div>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden md:grid grid-cols-[1fr_100px_2fr_1.2fr] gap-4 items-start">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-gray-100 font-medium">{m.name}</span>
              <Link
                href={`/notes/${m.slug}`}
                onClick={e => e.stopPropagation()}
                className="text-gray-600 hover:text-blue-400 transition text-xs"
              >
                查看說明
              </Link>
            </div>
            {m.note && <p className="text-xs text-gray-500 mt-0.5">{m.note}</p>}
          </div>
          <div className="flex justify-center pt-0.5">
            <Col2Cell m={m} config={config} />
          </div>
          <span className="text-gray-400 text-sm leading-relaxed">{m.returns}</span>
          <div className="flex items-center justify-between gap-2">
            <code className="text-blue-300 text-sm font-mono bg-blue-950/30 px-2 py-0.5 rounded break-all">{m.syntax}</code>
            <span className="text-gray-700 text-xs shrink-0">{isOpen ? '▲' : '▼'}</span>
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 border-t border-gray-800/60 bg-gray-900/60">
          <p className="text-xs text-gray-600 uppercase tracking-wider pt-3 mb-1">自訂重點</p>
          <KeyPointsSection slug={m.slug} initial={keyPoints} />
        </div>
      )}
    </div>
  )
}

export default function CheatsheetClient({ methods, initialKeyPointsMap, subCategoryOrder, columnConfig }: Props) {
  const [expanded, setExpanded] = useState<string | null>(methods[0]?.slug ?? null)
  const config = columnConfig ?? DEFAULT_COLUMN_CONFIG

  const groupMap = methods.reduce<Record<string, MethodEntry[]>>((acc, m) => {
    if (!acc[m.subCategory]) acc[m.subCategory] = []
    acc[m.subCategory].push(m)
    return acc
  }, {})

  const groups = subCategoryOrder
    .filter(cat => groupMap[cat])
    .map(cat => [cat, groupMap[cat]] as [string, MethodEntry[]])

  return (
    <div className="space-y-8">
      {groups.map(([subCategory, groupMethods]) => (
        <section key={subCategory}>
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-800">
            <h2 className="text-sm font-semibold text-gray-300">{subCategory}</h2>
            <span className="text-xs text-gray-700">{groupMethods.length}</span>
          </div>

          <div className="space-y-2">
            <div className="hidden md:grid grid-cols-[1fr_100px_2fr_1.2fr] gap-4 px-4 py-2 text-xs text-gray-600 uppercase tracking-wider">
              <span>方法</span>
              <span className="text-center">{config.col2Label}</span>
              <span>回傳值</span>
              <span>語法</span>
            </div>

            {groupMethods.map(m => (
              <MethodRow
                key={m.slug}
                m={m}
                isOpen={expanded === m.slug}
                keyPoints={initialKeyPointsMap[m.slug] ?? []}
                config={config}
                onToggle={() => setExpanded(prev => prev === m.slug ? null : m.slug)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
