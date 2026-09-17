'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { FlashcardFolderSummary } from '@/lib/db/queries'

type FolderSummary = Pick<FlashcardFolderSummary, 'id' | 'name' | 'deckCount' | 'cardCount' | 'reviewedCount'>
type UnassignedSummary = { deckCount: number; cardCount: number; reviewedCount: number }

export default function FoldersListClient({
  initialFolders,
  unassigned,
}: {
  initialFolders: FolderSummary[]
  unassigned: UnassignedSummary
}) {
  const router = useRouter()
  const [folders, setFolders] = useState(initialFolders)
  const [unassignedSummary, setUnassignedSummary] = useState(unassigned)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [saving, setSaving] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  const [busyId, setBusyId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleCreate() {
    const name = newName.trim()
    if (!name || saving) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/flashcards/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (!res.ok) throw new Error('create failed')
      const { id } = await res.json() as { id: number }
      setFolders(prev => [{ id, name, deckCount: 0, cardCount: 0, reviewedCount: 0 }, ...prev])
      setNewName('')
      setCreating(false)
      router.refresh()
    } catch {
      setError('建立資料夾失敗，請再試一次。')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    setBusyId(id)
    setError(null)
    try {
      const res = await fetch(`/api/flashcards/folders/${id}`, { method: 'DELETE' })
      if (!res.ok && res.status !== 404) throw new Error('delete failed')
      // its decks move to unassigned server-side — fold their counts in here too
      const deleted = folders.find(f => f.id === id)
      if (deleted) {
        setUnassignedSummary(prev => ({
          deckCount: prev.deckCount + deleted.deckCount,
          cardCount: prev.cardCount + deleted.cardCount,
          reviewedCount: prev.reviewedCount + deleted.reviewedCount,
        }))
      }
      setFolders(prev => prev.filter(f => f.id !== id))
      setConfirmDeleteId(null)
      router.refresh()
    } catch {
      setError('刪除資料夾失敗，請再試一次。')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-4">
      {creating ? (
        <div className="flex items-center gap-2">
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleCreate()
              if (e.key === 'Escape' && !saving) setCreating(false)
            }}
            placeholder="資料夾名稱"
            autoFocus
            disabled={saving}
            className="flex-1 rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-gray-500 disabled:opacity-50"
          />
          <button
            onClick={handleCreate}
            disabled={saving || newName.trim() === ''}
            className="shrink-0 text-sm px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 transition"
          >
            {saving ? '...' : '建立'}
          </button>
          <button
            onClick={() => setCreating(false)}
            disabled={saving}
            className="shrink-0 text-sm text-gray-500 hover:text-gray-300 disabled:opacity-50 px-1"
          >
            取消
          </button>
        </div>
      ) : (
        <button
          onClick={() => setCreating(true)}
          className="block w-full text-center rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-500 transition"
        >
          + 建立新資料夾
        </button>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}

      <ul className="space-y-3">
        <li>
          <Link
            href="/flashcards/unassigned"
            className="flex items-center justify-between gap-3 rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 hover:border-gray-700 transition"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-300">📄 未分類</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {unassignedSummary.deckCount} 個題組・已複習 {unassignedSummary.reviewedCount}/{unassignedSummary.cardCount}
              </p>
            </div>
          </Link>
        </li>

        {folders.map(folder => (
          <li
            key={folder.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-gray-800 bg-gray-900 px-4 py-3"
          >
            <Link href={`/flashcards/folders/${folder.id}`} className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-100 truncate">📁 {folder.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {folder.deckCount} 個題組・已複習 {folder.reviewedCount}/{folder.cardCount}
              </p>
            </Link>

            {confirmDeleteId === folder.id ? (
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-xs text-red-400">確定刪除？</span>
                <button
                  onClick={() => handleDelete(folder.id)}
                  disabled={busyId === folder.id}
                  className="text-xs bg-red-900/50 hover:bg-red-900 text-red-400 border border-red-800 px-2 py-1 rounded transition disabled:opacity-50"
                >
                  {busyId === folder.id ? '...' : '刪除'}
                </button>
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  disabled={busyId === folder.id}
                  className="text-xs text-gray-600 hover:text-gray-400 disabled:opacity-50"
                >
                  取消
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDeleteId(folder.id)}
                disabled={busyId !== null}
                className="shrink-0 text-gray-700 hover:text-red-400 transition text-lg leading-none px-1 disabled:opacity-30"
              >
                ×
              </button>
            )}
          </li>
        ))}
      </ul>
      <p className="text-xs text-gray-600 text-center py-2">
        刪除資料夾不會刪掉裡面的題組，題組會回到「未分類」。
      </p>
    </div>
  )
}
