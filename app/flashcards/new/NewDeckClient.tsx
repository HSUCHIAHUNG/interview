'use client'

import { useRef, useState, type ClipboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import { parseAnkiText, genId, isValidCard, type ParsedCard } from '@/lib/flashcards/parseAnkiText'
import { todayStr } from '@/lib/flashcards/date'
import EditableCardList from '../components/EditableCardList'

export default function NewDeckClient({ folderId }: { folderId: number | null }) {
  const router = useRouter()
  const [rawText, setRawText] = useState('')
  const [cards, setCards] = useState<ParsedCard[]>([])
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [deckName, setDeckName] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validCards = cards.filter(c => c.valid)

  function appendParsedCards(text: string) {
    const parsed = parseAnkiText(text)
    if (parsed.length > 0) setCards(prev => [...prev, ...parsed])
  }

  function handlePaste(e: ClipboardEvent<HTMLTextAreaElement>) {
    const text = e.clipboardData.getData('text')
    if (text.trim() === '') return
    e.preventDefault()
    appendParsedCards(text)
    setRawText('')
  }

  function handleParseClick() {
    if (rawText.trim() === '') return
    appendParsedCards(rawText)
    setRawText('')
  }

  function handleFileUpload(file: File) {
    setUploadError(null)
    const reader = new FileReader()
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : ''
      appendParsedCards(text)
    }
    reader.onerror = () => setUploadError('讀取檔案失敗，請再試一次。')
    reader.readAsText(file)
  }

  function handleUpdateCard(id: string, field: 'front' | 'back', value: string) {
    setCards(prev =>
      prev.map(c => {
        if (c.id !== id) return c
        const next = { ...c, [field]: value }
        return { ...next, valid: isValidCard(next.front, next.back) }
      })
    )
  }

  function handleDeleteCard(id: string) {
    setCards(prev => prev.filter(c => c.id !== id))
  }

  function handleAddCard() {
    setCards(prev => [...prev, { id: genId(), front: '', back: '', valid: false }])
  }

  async function handleSave() {
    if (validCards.length === 0 || saving) return
    setSaving(true)
    setSaveError(null)
    try {
      const res = await fetch('/api/flashcards/decks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: deckName.trim() || todayStr(),
          cards: validCards.map(c => ({ front: c.front, back: c.back })),
          folderId,
        }),
      })
      if (!res.ok) throw new Error('save failed')
      const { id } = await res.json() as { id: number }
      router.push(`/flashcards/${id}`)
    } catch {
      setSaveError('儲存失敗，請再試一次。')
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm text-gray-300 block mb-2">
          貼上 Anki 格式內容（每行「正面」與「反面」用 Tab 鍵分隔，貼上後會立即加入下方列表）
        </label>
        <textarea
          value={rawText}
          onChange={e => setRawText(e.target.value)}
          onPaste={handlePaste}
          rows={6}
          placeholder={'closure	一個函式綁定了它建立時的詞法作用域\nhoisting	宣告會被提升到作用域頂端'}
          className="w-full rounded-lg bg-gray-900 border border-gray-800 px-3 py-2 text-sm text-gray-100 font-mono focus:outline-none focus:border-gray-600"
        />
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={handleParseClick}
            className="text-sm px-3 py-1.5 rounded-md border border-gray-700 text-gray-300 hover:border-gray-500 transition"
          >
            解析並加入列表
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-sm px-3 py-1.5 rounded-md border border-gray-700 text-gray-300 hover:border-gray-500 transition"
          >
            或上傳 .txt / .csv 檔案
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.csv,text/plain,text/csv"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) handleFileUpload(file)
              e.target.value = ''
            }}
          />
        </div>
        <p className="mt-1 text-xs text-gray-600">檔案內容需為 Tab 分隔的「正面/反面」，不是逗號分隔的 CSV。</p>
        {uploadError && <p className="mt-1 text-xs text-red-400">{uploadError}</p>}
      </div>

      <div>
        <h2 className="text-sm text-gray-300 mb-3">預覽（{cards.length} 張卡片）</h2>
        <EditableCardList
          cards={cards}
          onUpdateCard={handleUpdateCard}
          onDeleteCard={handleDeleteCard}
          onAddCard={handleAddCard}
        />
      </div>

      <div className="border-t border-gray-800 pt-6 space-y-3">
        <div>
          <label className="text-sm text-gray-300 block mb-2">題組名稱（留空會用今天日期）</label>
          <input
            type="text"
            value={deckName}
            onChange={e => setDeckName(e.target.value)}
            placeholder={todayStr()}
            className="w-full rounded-md bg-gray-900 border border-gray-800 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-gray-600"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={validCards.length === 0 || saving}
          className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 transition"
        >
          {saving ? '儲存中…' : `建立題組（${validCards.length} 張有效卡片）`}
        </button>
        {validCards.length === 0 && cards.length > 0 && (
          <p className="text-xs text-amber-500">目前沒有正反面都有內容的卡片，無法儲存。</p>
        )}
        {saveError && <p className="text-xs text-red-400">{saveError}</p>}
      </div>
    </div>
  )
}
