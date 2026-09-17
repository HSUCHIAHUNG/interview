'use client'

import { useState } from 'react'

type FolderOption = { id: number; name: string }

export default function DeckFolderSelector({
  deckId,
  folders,
  initialFolderId,
}: {
  deckId: number
  folders: FolderOption[]
  initialFolderId: number | null
}) {
  const [folderId, setFolderId] = useState<number | null>(initialFolderId)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleChange(value: string) {
    const next = value === '' ? null : parseInt(value, 10)
    const previous = folderId
    setFolderId(next)
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/flashcards/decks/${deckId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderId: next }),
      })
      if (!res.ok) throw new Error('move failed')
    } catch {
      setFolderId(previous)
      setError('移動題組失敗，請再試一次。')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-500">資料夾</span>
        <select
          value={folderId ?? ''}
          onChange={e => handleChange(e.target.value)}
          disabled={saving}
          className="rounded-md bg-gray-900 border border-gray-700 px-2 py-1 text-sm text-gray-100 focus:outline-none focus:border-gray-500 disabled:opacity-50"
        >
          <option value="">📄 未分類</option>
          {folders.map(f => (
            <option key={f.id} value={f.id}>📁 {f.name}</option>
          ))}
        </select>
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}
