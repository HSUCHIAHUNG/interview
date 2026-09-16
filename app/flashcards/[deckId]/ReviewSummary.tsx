'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ReviewSummary({
  deckId,
  cardCount,
  initialReviewedCount,
}: {
  deckId: number
  cardCount: number
  initialReviewedCount: number
}) {
  const router = useRouter()
  const [reviewedCount, setReviewedCount] = useState(initialReviewedCount)
  const [confirming, setConfirming] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleReset() {
    setResetting(true)
    setError(null)
    try {
      const res = await fetch(`/api/flashcards/decks/${deckId}/reset`, { method: 'POST' })
      if (res.status === 404) {
        // the deck itself is gone (e.g. deleted from another tab) — nothing left to reset here
        router.push('/flashcards')
        return
      }
      if (!res.ok) throw new Error('reset failed')
      setReviewedCount(0)
      setConfirming(false)
    } catch {
      setError('重置複習進度失敗，請再試一次。')
    } finally {
      setResetting(false)
    }
  }

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-gray-400">已複習 {reviewedCount}/{cardCount}</span>

        {confirming ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-red-400">確定要把整個題組重置為待複習？</span>
            <button
              onClick={handleReset}
              disabled={resetting}
              className="text-xs bg-red-900/50 hover:bg-red-900 text-red-400 border border-red-800 px-2 py-1 rounded transition disabled:opacity-50"
            >
              {resetting ? '...' : '確定重置'}
            </button>
            <button
              onClick={() => setConfirming(false)}
              disabled={resetting}
              className="text-xs text-gray-600 hover:text-gray-400 disabled:opacity-50"
            >
              取消
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            disabled={reviewedCount === 0}
            className="text-xs px-2 py-1 rounded-md border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200 disabled:opacity-30 transition"
          >
            ↺ 重置複習進度
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}
