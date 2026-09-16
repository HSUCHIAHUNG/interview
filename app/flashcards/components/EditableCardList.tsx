'use client'

import { useEffect, useRef, useState } from 'react'

export type EditableCard = {
  id: string
  front: string
  back: string
  valid: boolean
}

interface Props {
  cards: EditableCard[]
  onUpdateCard: (id: string, field: 'front' | 'back', value: string) => void
  onDeleteCard: (id: string) => void
  onAddCard: () => void
}

export default function EditableCardList({ cards, onUpdateCard, onDeleteCard, onAddCard }: Props) {
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const prevLengthRef = useRef(cards.length)

  useEffect(() => {
    const prevLength = prevLengthRef.current
    if (cards.length > prevLength) {
      // one or more cards were just added (paste/upload/manual add) — jump to the first new one
      setIndex(prevLength)
      setRevealed(false)
    } else if (index > cards.length - 1) {
      // the current card (or one after it) was deleted — clamp back into range
      setIndex(Math.max(0, cards.length - 1))
      setRevealed(false)
    }
    prevLengthRef.current = cards.length
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards.length])

  function goTo(next: number) {
    setIndex(Math.max(0, Math.min(cards.length - 1, next)))
    setRevealed(false)
  }

  if (cards.length === 0) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-gray-500">還沒有卡片，貼上內容或按下面的按鈕手動新增一張。</p>
        <button
          onClick={onAddCard}
          className="w-full rounded-lg border border-dashed border-gray-700 py-2 text-sm text-gray-400 hover:text-gray-200 hover:border-gray-500 transition"
        >
          + 手動新增一張卡片
        </button>
      </div>
    )
  }

  const card = cards[index]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-gray-400">
        <button
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className="px-2 py-1 rounded-md hover:text-gray-200 disabled:opacity-30 disabled:hover:text-gray-400 transition"
        >
          ← 上一張
        </button>
        <span>{index + 1} / {cards.length}</span>
        <button
          onClick={() => goTo(index + 1)}
          disabled={index === cards.length - 1}
          className="px-2 py-1 rounded-md hover:text-gray-200 disabled:opacity-30 disabled:hover:text-gray-400 transition"
        >
          下一張 →
        </button>
      </div>

      <div
        key={card.id}
        className={`rounded-xl border p-5 ${
          !card.valid ? 'border-amber-700/60 bg-amber-950/20' : 'border-gray-800 bg-gray-900'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-500">#{index + 1}</span>
          {!card.valid && (
            <span className="text-xs text-amber-500 font-medium">⚠ 待修正：正面或反面是空的</span>
          )}
          <button
            onClick={() => onDeleteCard(card.id)}
            className="text-xs text-gray-600 hover:text-red-400 transition"
          >
            刪除
          </button>
        </div>

        <div className="mb-4">
          <label className="text-xs text-gray-500 block mb-1">正面</label>
          <textarea
            value={card.front}
            onChange={e => onUpdateCard(card.id, 'front', e.target.value)}
            rows={6}
            className="w-full rounded-md bg-gray-950 border border-gray-800 px-3 py-3 text-base leading-relaxed text-gray-100 focus:outline-none focus:border-gray-600"
          />
        </div>

        {revealed ? (
          <div>
            <label className="text-xs text-gray-500 block mb-1">反面</label>
            <textarea
              value={card.back}
              onChange={e => onUpdateCard(card.id, 'back', e.target.value)}
              rows={6}
              className="w-full rounded-md bg-gray-950 border border-gray-800 px-3 py-3 text-base leading-relaxed text-gray-100 focus:outline-none focus:border-gray-600"
            />
          </div>
        ) : (
          <button
            onClick={() => setRevealed(true)}
            className="w-full rounded-md border border-dashed border-gray-700 py-10 text-sm text-gray-400 hover:text-gray-200 hover:border-gray-500 transition"
          >
            點擊顯示反面
          </button>
        )}
      </div>

      <button
        onClick={onAddCard}
        className="w-full rounded-lg border border-dashed border-gray-700 py-2 text-sm text-gray-400 hover:text-gray-200 hover:border-gray-500 transition"
      >
        + 手動新增一張卡片
      </button>
    </div>
  )
}
