'use client'

import { useState } from 'react'

interface NoteSection {
  id: number
  heading: string
  content: string
  order: number
}

interface Props {
  slug: string
  initialSections: NoteSection[]
  isLoggedIn: boolean
  isPractice: boolean
}

// ─── Content renderer ────────────────────────────────────────────────────────

function renderContent(content: string) {
  const lines = content.split('\n')
  const result: React.ReactNode[] = []
  let tableLines: string[] = []
  let inCodeBlock = false
  let codeBlockLines: string[] = []
  let codeBlockIdx = 0

  const flushTable = (key: string) => {
    if (tableLines.length < 2) return
    const headers = tableLines[0].split('|').slice(1, -1).map(c => c.trim())
    const rows = tableLines.slice(2).map(row => row.split('|').slice(1, -1).map(c => c.trim()))
    result.push(
      <div key={key} className="overflow-x-auto my-3">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-800">
              {headers.map((h, i) => (
                <th key={i} className="border border-gray-700 px-3 py-2 text-left font-semibold text-gray-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800/50'}>
                {row.map((cell, j) => (
                  <td key={j} className="border border-gray-700 px-3 py-2 text-gray-400">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
    tableLines = []
  }

  lines.forEach((line, i) => {
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        if (tableLines.length > 0) flushTable(`table-${i}`)
        inCodeBlock = true; codeBlockLines = []; codeBlockIdx = i
      } else {
        inCodeBlock = false
        result.push(
          <pre key={`code-${codeBlockIdx}`} className="bg-gray-900 text-green-300 text-sm rounded-lg px-4 py-3 overflow-x-auto my-2 font-mono whitespace-pre">
            {codeBlockLines.join('\n')}
          </pre>
        )
        codeBlockLines = []
      }
      return
    }
    if (inCodeBlock) {
      if (line.endsWith('```')) {
        const c = line.slice(0, -3).trimEnd()
        if (c) codeBlockLines.push(c)
        inCodeBlock = false
        result.push(
          <pre key={`code-${codeBlockIdx}`} className="bg-gray-900 text-green-300 text-sm rounded-lg px-4 py-3 overflow-x-auto my-2 font-mono whitespace-pre">
            {codeBlockLines.join('\n')}
          </pre>
        )
        codeBlockLines = []
      } else { codeBlockLines.push(line) }
      return
    }
    if (line.startsWith('|')) { tableLines.push(line); return }
    if (tableLines.length > 0) flushTable(`table-${i}`)
    if (line.startsWith('- ')) {
      result.push(<li key={i} className="ml-4 text-gray-400 list-disc list-inside">{line.slice(2).replace(/\*\*(.*?)\*\*/g, '$1')}</li>)
    } else if (line.trim() === '') {
      result.push(<div key={i} className="h-2" />)
    } else {
      result.push(
        <p key={i} className="text-gray-400 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
        />
      )
    }
  })

  if (tableLines.length > 0) flushTable('table-end')
  return result
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function NotesClient({ slug, initialSections, isLoggedIn }: Props) {
  const [sections, setSections] = useState<NoteSection[]>(initialSections)
  const [editMode, setEditMode] = useState(false)

  // Editing existing section
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editHeading, setEditHeading] = useState('')
  const [editContent, setEditContent] = useState('')
  const [saving, setSaving] = useState(false)

  // Delete confirm
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)

  // New section form
  const [showAddForm, setShowAddForm] = useState(false)
  const [newHeading, setNewHeading] = useState('')
  const [newContent, setNewContent] = useState('')
  const [adding, setAdding] = useState(false)

  function startEdit(s: NoteSection) {
    setEditingId(s.id)
    setEditHeading(s.heading)
    setEditContent(s.content)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditHeading('')
    setEditContent('')
  }

  async function saveEdit(id: number) {
    if (!editHeading.trim() || !editContent.trim()) return
    setSaving(true)
    try {
      await fetch(`/api/topics/${slug}/notes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heading: editHeading, content: editContent }),
      })
      setSections(prev => prev.map(s => s.id === id ? { ...s, heading: editHeading, content: editContent } : s))
      cancelEdit()
    } finally { setSaving(false) }
  }

  async function deleteSection(id: number) {
    setDeleting(id)
    try {
      await fetch(`/api/topics/${slug}/notes/${id}`, { method: 'DELETE' })
      setSections(prev => prev.filter(s => s.id !== id))
      setDeleteConfirm(null)
    } finally { setDeleting(null) }
  }

  async function moveSection(id: number, direction: 'up' | 'down') {
    const idx = sections.findIndex(s => s.id === id)
    if (direction === 'up' && idx === 0) return
    if (direction === 'down' && idx === sections.length - 1) return
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    const updated = [...sections]
    const tempOrder = updated[idx].order
    updated[idx] = { ...updated[idx], order: updated[swapIdx].order }
    updated[swapIdx] = { ...updated[swapIdx], order: tempOrder }
    ;[updated[idx], updated[swapIdx]] = [updated[swapIdx], updated[idx]]
    setSections(updated)
    await Promise.all([
      fetch(`/api/topics/${slug}/notes/${updated[idx].id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: updated[idx].order }),
      }),
      fetch(`/api/topics/${slug}/notes/${updated[swapIdx].id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: updated[swapIdx].order }),
      }),
    ])
  }

  async function addSection() {
    if (!newHeading.trim() || !newContent.trim() || adding) return
    setAdding(true)
    try {
      const res = await fetch(`/api/topics/${slug}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heading: newHeading, content: newContent }),
      })
      const { id } = await res.json() as { id: number }
      const maxOrder = sections.length > 0 ? Math.max(...sections.map(s => s.order)) : -1
      setSections(prev => [...prev, { id, heading: newHeading, content: newContent, order: maxOrder + 1 }])
      setNewHeading(''); setNewContent(''); setShowAddForm(false)
    } finally { setAdding(false) }
  }

  return (
    <div>
      {/* Edit toggle */}
      {isLoggedIn && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => { setEditMode(m => !m); setEditingId(null); setShowAddForm(false) }}
            className={`text-sm px-4 py-1.5 rounded-lg border transition ${
              editMode
                ? 'bg-gray-700 border-gray-600 text-gray-200'
                : 'border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300'
            }`}
          >
            {editMode ? '完成編輯' : '✏️ 編輯說明'}
          </button>
        </div>
      )}

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section, idx) => (
          <div key={section.id} className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
            {editingId === section.id ? (
              /* Inline edit form */
              <div className="space-y-3">
                <input
                  value={editHeading}
                  onChange={e => setEditHeading(e.target.value)}
                  placeholder="章節標題"
                  className="w-full bg-gray-800 text-gray-100 font-semibold text-lg rounded-lg border border-gray-700 focus:border-gray-500 focus:outline-none px-3 py-2"
                />
                <textarea
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  rows={10}
                  className="w-full bg-gray-800 text-gray-300 text-sm rounded-lg border border-gray-700 focus:border-gray-500 focus:outline-none px-3 py-2 font-mono resize-y leading-relaxed"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(section.id)}
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                  >
                    {saving ? '儲存中...' : '儲存'}
                  </button>
                  <button onClick={cancelEdit} className="text-sm text-gray-500 hover:text-gray-300 transition px-3">
                    取消
                  </button>
                </div>
              </div>
            ) : (
              /* Display mode */
              <>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h2 className="text-lg font-semibold text-gray-100">{section.heading}</h2>
                  {editMode && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => moveSection(section.id, 'up')} disabled={idx === 0}
                        className="text-gray-600 hover:text-gray-300 disabled:opacity-30 px-1.5 py-1 rounded transition text-sm">↑</button>
                      <button onClick={() => moveSection(section.id, 'down')} disabled={idx === sections.length - 1}
                        className="text-gray-600 hover:text-gray-300 disabled:opacity-30 px-1.5 py-1 rounded transition text-sm">↓</button>
                      <button onClick={() => startEdit(section)}
                        className="text-xs text-blue-400 hover:text-blue-300 border border-blue-800 hover:border-blue-600 px-2 py-1 rounded-lg transition">
                        編輯
                      </button>
                      {deleteConfirm === section.id ? (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-red-400">確定？</span>
                          <button onClick={() => deleteSection(section.id)} disabled={deleting === section.id}
                            className="text-xs bg-red-900/50 hover:bg-red-900 text-red-400 border border-red-800 px-2 py-1 rounded transition disabled:opacity-50">
                            {deleting === section.id ? '...' : '刪除'}
                          </button>
                          <button onClick={() => setDeleteConfirm(null)} className="text-xs text-gray-600 hover:text-gray-400">取消</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(section.id)}
                          className="text-gray-700 hover:text-red-400 transition text-lg leading-none px-1">×</button>
                      )}
                    </div>
                  )}
                </div>
                <div className="space-y-1">{renderContent(section.content)}</div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Add section */}
      {editMode && (
        <div className="mt-4">
          {showAddForm ? (
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-gray-400">新增章節</h3>
              <input
                value={newHeading}
                onChange={e => setNewHeading(e.target.value)}
                placeholder="章節標題"
                className="w-full bg-gray-800 text-gray-100 rounded-lg border border-gray-700 focus:border-gray-500 focus:outline-none px-3 py-2 text-sm"
              />
              <textarea
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                rows={8}
                placeholder="內容（支援 markdown：**粗體**、```程式碼區塊```、| 表格 |）"
                className="w-full bg-gray-800 text-gray-300 text-sm rounded-lg border border-gray-700 focus:border-gray-500 focus:outline-none px-3 py-2 font-mono resize-y leading-relaxed"
              />
              <div className="flex gap-2">
                <button
                  onClick={addSection}
                  disabled={!newHeading.trim() || !newContent.trim() || adding}
                  className="bg-violet-700 hover:bg-violet-600 disabled:opacity-40 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                >
                  {adding ? '新增中...' : '新增'}
                </button>
                <button onClick={() => { setShowAddForm(false); setNewHeading(''); setNewContent('') }}
                  className="text-sm text-gray-500 hover:text-gray-300 px-3">
                  取消
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-3 border border-dashed border-gray-700 hover:border-gray-500 text-gray-500 hover:text-gray-300 text-sm rounded-2xl transition"
            >
              ＋ 新增章節
            </button>
          )}
        </div>
      )}
    </div>
  )
}
