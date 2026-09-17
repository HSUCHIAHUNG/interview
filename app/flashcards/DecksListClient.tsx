'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { FlashcardDeckSummary } from '@/lib/db/queries'

type DeckSummary = Pick<FlashcardDeckSummary, 'id' | 'name' | 'cardCount' | 'reviewedCount'>
type ConfirmAction = { id: number; kind: 'delete' | 'reset' } | null

export default function DecksListClient({
  initialDecks,
  newDeckHref,
}: {
  initialDecks: DeckSummary[]
  newDeckHref: string
}) {
  const [decks, setDecks] = useState(initialDecks)
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null)
  const [busyId, setBusyId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete(id: number) {
    setBusyId(id)
    setError(null)
    try {
      const res = await fetch(`/api/flashcards/decks/${id}`, { method: 'DELETE' })
      // 404 means it's already gone (e.g. deleted from another tab) — treat as success, not an error
      if (!res.ok && res.status !== 404) throw new Error('delete failed')
      setDecks(prev => prev.filter(d => d.id !== id))
      setConfirmAction(null)
    } catch {
      setError('刪除題組失敗，請再試一次。')
    } finally {
      setBusyId(null)
    }
  }

  async function handleReset(id: number) {
    setBusyId(id)
    setError(null)
    try {
      const res = await fetch(`/api/flashcards/decks/${id}/reset`, { method: 'POST' })
      if (res.status === 404) {
        // already gone (e.g. deleted from another tab)
        setDecks(prev => prev.filter(d => d.id !== id))
        setConfirmAction(null)
        return
      }
      if (!res.ok) throw new Error('reset failed')
      setDecks(prev => prev.map(d => (d.id === id ? { ...d, reviewedCount: 0 } : d)))
      setConfirmAction(null)
    } catch {
      setError('重置複習進度失敗，請再試一次。')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-4">
      <Link
        href={newDeckHref}
        className="block w-full text-center rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-500 transition"
      >
        + 建立新題組
      </Link>

      {error && <p className="text-xs text-red-400">{error}</p>}

      {decks.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">還沒有任何題組，建立第一個吧。</p>
      ) : (
        <ul className="space-y-3">
          {decks.map(deck => (
            <li
              key={deck.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-gray-800 bg-gray-900 px-4 py-3"
            >
              <Link href={`/flashcards/${deck.id}`} className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-100 truncate">{deck.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  已複習 {deck.reviewedCount}/{deck.cardCount}
                </p>
              </Link>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/flashcards/${deck.id}/review`}
                  className="text-xs px-2.5 py-1.5 rounded-md border border-emerald-800 text-emerald-400 hover:border-emerald-600 hover:text-emerald-300 transition"
                >
                  複習
                </Link>

                {confirmAction?.id === deck.id ? (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-red-400">
                      {confirmAction.kind === 'delete' ? '確定刪除？' : '確定重置？'}
                    </span>
                    <button
                      onClick={() => (confirmAction.kind === 'delete' ? handleDelete(deck.id) : handleReset(deck.id))}
                      disabled={busyId === deck.id}
                      className="text-xs bg-red-900/50 hover:bg-red-900 text-red-400 border border-red-800 px-2 py-1 rounded transition disabled:opacity-50"
                    >
                      {busyId === deck.id ? '...' : confirmAction.kind === 'delete' ? '刪除' : '重置'}
                    </button>
                    <button
                      onClick={() => setConfirmAction(null)}
                      disabled={busyId === deck.id}
                      className="text-xs text-gray-600 hover:text-gray-400 disabled:opacity-50"
                    >
                      取消
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setConfirmAction({ id: deck.id, kind: 'reset' })}
                      disabled={busyId !== null || deck.reviewedCount === 0}
                      className="text-xs px-2 py-1.5 rounded-md border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200 disabled:opacity-30 transition"
                    >
                      ↺
                    </button>
                    <button
                      onClick={() => setConfirmAction({ id: deck.id, kind: 'delete' })}
                      disabled={busyId !== null}
                      className="text-gray-700 hover:text-red-400 transition text-lg leading-none px-1 disabled:opacity-30"
                    >
                      ×
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
