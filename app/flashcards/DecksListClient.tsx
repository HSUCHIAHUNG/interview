'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { FlashcardDeckSummary } from '@/lib/db/queries'

type DeckSummary = Pick<FlashcardDeckSummary, 'id' | 'name' | 'cardCount' | 'reviewedCount'>

export default function DecksListClient({ initialDecks }: { initialDecks: DeckSummary[] }) {
  const [decks, setDecks] = useState(initialDecks)
  const [confirmId, setConfirmId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete(id: number) {
    setDeletingId(id)
    setError(null)
    try {
      const res = await fetch(`/api/flashcards/decks/${id}`, { method: 'DELETE' })
      // 404 means it's already gone (e.g. deleted from another tab) — treat as success, not an error
      if (!res.ok && res.status !== 404) throw new Error('delete failed')
      setDecks(prev => prev.filter(d => d.id !== id))
      setConfirmId(null)
    } catch {
      setError('刪除題組失敗，請再試一次。')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <Link
        href="/flashcards/new"
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

              <Link
                href={`/flashcards/${deck.id}/review`}
                className="shrink-0 text-xs px-2.5 py-1.5 rounded-md border border-emerald-800 text-emerald-400 hover:border-emerald-600 hover:text-emerald-300 transition"
              >
                複習
              </Link>

              {confirmId === deck.id ? (
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-xs text-red-400">確定？</span>
                  <button
                    onClick={() => handleDelete(deck.id)}
                    disabled={deletingId === deck.id}
                    className="text-xs bg-red-900/50 hover:bg-red-900 text-red-400 border border-red-800 px-2 py-1 rounded transition disabled:opacity-50"
                  >
                    {deletingId === deck.id ? '...' : '刪除'}
                  </button>
                  <button
                    onClick={() => setConfirmId(null)}
                    disabled={deletingId === deck.id}
                    className="text-xs text-gray-600 hover:text-gray-400 disabled:opacity-50"
                  >
                    取消
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmId(deck.id)}
                  disabled={deletingId !== null}
                  className="shrink-0 text-gray-700 hover:text-red-400 transition text-lg leading-none px-1 disabled:opacity-30"
                >
                  ×
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
