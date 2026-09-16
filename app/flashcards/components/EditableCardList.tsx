'use client'

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
  return (
    <div className="space-y-3">
      {cards.length === 0 && (
        <p className="text-sm text-gray-500">還沒有卡片，貼上內容或按下面的按鈕手動新增一張。</p>
      )}
      {cards.map((card, idx) => (
        <div
          key={card.id}
          className={`rounded-lg border p-3 ${
            !card.valid ? 'border-amber-700/60 bg-amber-950/20' : 'border-gray-800 bg-gray-900'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">#{idx + 1}</span>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">正面</label>
              <textarea
                value={card.front}
                onChange={e => onUpdateCard(card.id, 'front', e.target.value)}
                rows={2}
                className="w-full rounded-md bg-gray-950 border border-gray-800 px-2 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-gray-600"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">反面</label>
              <textarea
                value={card.back}
                onChange={e => onUpdateCard(card.id, 'back', e.target.value)}
                rows={2}
                className="w-full rounded-md bg-gray-950 border border-gray-800 px-2 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-gray-600"
              />
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={onAddCard}
        className="w-full rounded-lg border border-dashed border-gray-700 py-2 text-sm text-gray-400 hover:text-gray-200 hover:border-gray-500 transition"
      >
        + 手動新增一張卡片
      </button>
    </div>
  )
}
