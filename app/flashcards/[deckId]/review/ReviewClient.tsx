'use client'

import { useState } from 'react'
import Link from 'next/link'
import CardMarkdown from '../../components/CardMarkdown'

type ReviewCard = {
  id: number
  front: string
  back: string
}

export default function ReviewClient({ deckId, cards }: { deckId: number; cards: ReviewCard[] }) {
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [marking, setMarking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reviewedCount, setReviewedCount] = useState(0)

  if (cards.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-500">這個題組還沒有卡片可以複習。</p>
        <Link href={`/flashcards/${deckId}`} className="text-sm text-blue-400 hover:text-blue-300">
          回題組管理頁新增卡片 →
        </Link>
      </div>
    )
  }

  if (index >= cards.length) {
    return (
      <div className="space-y-4 text-center py-12">
        <p className="text-lg text-gray-100">🎉 複習完成！</p>
        <p className="text-sm text-gray-500">這次標記了 {reviewedCount}/{cards.length} 張已複習。</p>
        <div className="flex justify-center gap-4 pt-2">
          <Link href={`/flashcards/${deckId}`} className="text-sm text-blue-400 hover:text-blue-300">
            回題組管理頁
          </Link>
          <Link href="/flashcards" className="text-sm text-gray-500 hover:text-gray-300">
            回題組列表
          </Link>
        </div>
      </div>
    )
  }

  const card = cards[index]

  function goNext() {
    setRevealed(false)
    setError(null)
    setIndex(i => i + 1)
  }

  async function handleMarkReviewed() {
    setMarking(true)
    setError(null)
    try {
      const res = await fetch(`/api/flashcards/decks/${deckId}/cards/${card.id}/review`, { method: 'POST' })
      if (!res.ok) throw new Error('mark reviewed failed')
      setReviewedCount(c => c + 1)
      goNext()
    } catch {
      setError('標記已複習失敗，請再試一次。')
    } finally {
      setMarking(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>{index + 1} / {cards.length}</span>
        <span>已標記 {reviewedCount}</span>
      </div>

      <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 min-h-[16rem] flex flex-col">
        <div className="text-xs text-gray-500 mb-3">正面</div>
        <div className="flex-1 text-base text-gray-100">
          <CardMarkdown content={card.front} />
        </div>

        {revealed ? (
          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="text-xs text-gray-500 mb-3">反面</div>
            <div className="text-base text-gray-100">
              <CardMarkdown content={card.back} />
            </div>
          </div>
        ) : (
          <button
            onClick={() => setRevealed(true)}
            className="mt-6 w-full rounded-md border border-dashed border-gray-700 py-6 text-sm text-gray-400 hover:text-gray-200 hover:border-gray-500 transition"
          >
            點擊翻牌看反面
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      {revealed && (
        <div className="flex gap-3">
          <button
            onClick={handleMarkReviewed}
            disabled={marking}
            className="flex-1 rounded-lg bg-emerald-700 py-2.5 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-50 transition"
          >
            {marking ? '標記中…' : '✓ 標記已複習'}
          </button>
          <button
            onClick={goNext}
            disabled={marking}
            className="flex-1 rounded-lg border border-gray-700 py-2.5 text-sm text-gray-300 hover:border-gray-500 disabled:opacity-50 transition"
          >
            跳過
          </button>
        </div>
      )}
    </div>
  )
}
