'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeckNameEditor({ deckId, initialName }: { deckId: number; initialName: string }) {
  const router = useRouter()
  const [name, setName] = useState(initialName)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(initialName)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function startEdit() {
    setDraft(name)
    setError(null)
    setEditing(true)
  }

  async function handleSave() {
    if (saving) return
    const trimmed = draft.trim()
    if (!trimmed) return
    if (trimmed === name) {
      setEditing(false)
      return
    }
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/flashcards/decks/${deckId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
      })
      if (!res.ok) throw new Error('rename failed')
      setName(trimmed)
      setEditing(false)
      router.refresh()
    } catch {
      setError('更新題組名稱失敗，請再試一次。')
    } finally {
      setSaving(false)
    }
  }

  if (editing) {
    return (
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <input
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleSave()
              if (e.key === 'Escape' && !saving) setEditing(false)
            }}
            disabled={saving}
            autoFocus
            className="flex-1 min-w-0 rounded-md bg-gray-900 border border-gray-700 px-2 py-1 text-xl font-bold text-gray-100 focus:outline-none focus:border-gray-500 disabled:opacity-50"
          />
          <button
            onClick={handleSave}
            disabled={saving || draft.trim() === ''}
            className="shrink-0 text-sm px-2.5 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 transition"
          >
            {saving ? '...' : '儲存'}
          </button>
          <button
            onClick={() => setEditing(false)}
            disabled={saving}
            className="shrink-0 text-sm px-1 text-gray-500 hover:text-gray-300 disabled:opacity-50 transition"
          >
            取消
          </button>
        </div>
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>
    )
  }

  return (
    <h1 className="flex-1 min-w-0 flex items-center gap-2 text-xl font-bold text-gray-100">
      <span className="truncate">🗂️ {name}</span>
      <button
        onClick={startEdit}
        className="shrink-0 text-sm text-gray-600 hover:text-gray-300 transition"
        aria-label="編輯題組名稱"
      >
        ✏️
      </button>
    </h1>
  )
}
