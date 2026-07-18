'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { TodoSection, TodoItem } from '@/lib/db/schema'

interface Props {
  onClose: () => void
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

function genId() {
  return Math.random().toString(36).slice(2, 10)
}

export default function TodoModal({ onClose }: Props) {
  const [sections, setSections] = useState<TodoSection[]>([])
  const [status, setStatus] = useState<SaveStatus>('idle')
  const [savedAt, setSavedAt] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)
  const [dirty, setDirty] = useState(false)
  const sectionsRef = useRef(sections)

  useEffect(() => {
    fetch('/api/todos')
      .then(r => r.json())
      .then(d => {
        const s = d.data?.sections ?? []
        setSections(s)
        sectionsRef.current = s
        if (d.updatedAt) setSavedAt(new Date(d.updatedAt))
      })
      .finally(() => setLoading(false))
  }, [])

  const save = useCallback(async () => {
    setStatus('saving')
    try {
      const r = await fetch('/api/todos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { sections: sectionsRef.current } }),
      })
      const d = await r.json()
      setSavedAt(new Date(d.updatedAt))
      setStatus('saved')
      setDirty(false)
    } catch {
      setStatus('error')
    }
  }, [])

  function update(next: TodoSection[]) {
    setSections(next)
    sectionsRef.current = next
    setDirty(true)
    setStatus('idle')
  }

  function addSection() {
    update([...sections, { id: genId(), title: '新分類', items: [] }])
  }

  function deleteSection(sId: string) {
    update(sections.filter(s => s.id !== sId))
  }

  function updateSectionTitle(sId: string, title: string) {
    update(sections.map(s => s.id === sId ? { ...s, title } : s))
  }

  function addItem(sId: string) {
    update(sections.map(s =>
      s.id === sId
        ? { ...s, items: [...s.items, { id: genId(), text: '', done: false }] }
        : s
    ))
  }

  function updateItem(sId: string, iId: string, patch: Partial<TodoItem>) {
    update(sections.map(s =>
      s.id === sId
        ? { ...s, items: s.items.map(i => i.id === iId ? { ...i, ...patch } : i) }
        : s
    ))
  }

  function deleteItem(sId: string, iId: string) {
    update(sections.map(s =>
      s.id === sId ? { ...s, items: s.items.filter(i => i.id !== iId) } : s
    ))
  }

  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose()
  }

  const statusText =
    status === 'saving' ? '儲存中...' :
    status === 'saved' ? `已儲存 ${savedAt ? formatTime(savedAt) : ''}` :
    status === 'error' ? '儲存失敗' :
    dirty ? '有未儲存的變更' :
    savedAt ? `上次儲存 ${formatTime(savedAt)}` : ''

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleBackdrop}
    >
      <div className="w-full max-w-lg bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col"
        style={{ maxHeight: '80vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">✅</span>
            <h2 className="text-gray-100 font-semibold">待辦事項</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={addSection}
              className="text-xs text-indigo-400 hover:text-indigo-300 border border-indigo-700 hover:border-indigo-500 px-2.5 py-1 rounded-lg transition"
            >
              + 新增分類
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-300 transition text-xl leading-none ml-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 min-h-0">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 rounded-lg bg-gray-800/50 animate-pulse" />
              ))}
            </div>
          ) : sections.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-gray-500 text-sm mb-4">尚無待辦分類</p>
              <button
                onClick={addSection}
                className="text-sm text-indigo-400 hover:text-indigo-300 border border-indigo-700 hover:border-indigo-500 px-4 py-2 rounded-lg transition"
              >
                + 新增第一個分類
              </button>
            </div>
          ) : (
            sections.map(section => (
              <SectionBlock
                key={section.id}
                section={section}
                onTitleChange={t => updateSectionTitle(section.id, t)}
                onDeleteSection={() => deleteSection(section.id)}
                onAddItem={() => addItem(section.id)}
                onUpdateItem={(iId, patch) => updateItem(section.id, iId, patch)}
                onDeleteItem={iId => deleteItem(section.id, iId)}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-800 flex items-center justify-between shrink-0">
          <span className={`text-xs transition ${
            status === 'saving' ? 'text-yellow-500' :
            status === 'saved' ? 'text-green-500' :
            status === 'error' ? 'text-red-400' :
            dirty ? 'text-orange-400' :
            'text-gray-600'
          }`}>
            {status === 'saving' && <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 animate-pulse mr-1.5" />}
            {statusText}
          </span>
          <button
            onClick={save}
            disabled={status === 'saving' || (!dirty && status !== 'error')}
            className="text-xs font-medium px-3 py-1.5 rounded-lg transition
              bg-indigo-600 hover:bg-indigo-500 text-white
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {status === 'saving' ? '儲存中...' : '儲存'}
          </button>
        </div>
      </div>
    </div>
  )
}

interface SectionBlockProps {
  section: TodoSection
  onTitleChange: (t: string) => void
  onDeleteSection: () => void
  onAddItem: () => void
  onUpdateItem: (iId: string, patch: Partial<TodoItem>) => void
  onDeleteItem: (iId: string) => void
}

function SectionBlock({
  section, onTitleChange, onDeleteSection, onAddItem, onUpdateItem, onDeleteItem
}: SectionBlockProps) {
  const [editingTitle, setEditingTitle] = useState(false)
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingTitle) titleRef.current?.focus()
  }, [editingTitle])

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700/60 overflow-hidden">
      {/* Section header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-800/80 border-b border-gray-700/60">
        {editingTitle ? (
          <input
            ref={titleRef}
            defaultValue={section.title}
            onBlur={e => {
              onTitleChange(e.target.value || section.title)
              setEditingTitle(false)
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === 'Escape') {
                onTitleChange((e.target as HTMLInputElement).value || section.title)
                setEditingTitle(false)
              }
            }}
            className="flex-1 bg-transparent text-gray-100 text-sm font-semibold focus:outline-none border-b border-indigo-500 pb-0.5"
          />
        ) : (
          <button
            onClick={() => setEditingTitle(true)}
            className="text-sm font-semibold text-gray-200 hover:text-white transition text-left"
          >
            {section.title}：
          </button>
        )}
        <button
          onClick={onDeleteSection}
          className="text-gray-600 hover:text-red-400 transition text-xs ml-2 shrink-0"
          title="刪除分類"
        >
          ✕
        </button>
      </div>

      {/* Items */}
      <div className="px-4 py-2 space-y-1">
        {section.items.map(item => (
          <ItemRow
            key={item.id}
            item={item}
            onUpdate={patch => onUpdateItem(item.id, patch)}
            onDelete={() => onDeleteItem(item.id)}
          />
        ))}
        <button
          onClick={onAddItem}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition py-1 w-full text-left"
        >
          <span className="text-base leading-none">+</span>
          新增項目
        </button>
      </div>
    </div>
  )
}

interface ItemRowProps {
  item: TodoItem
  onUpdate: (patch: Partial<TodoItem>) => void
  onDelete: () => void
}

function ItemRow({ item, onUpdate, onDelete }: ItemRowProps) {
  const [editing, setEditing] = useState(!item.text)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  return (
    <div className="flex items-center gap-2 group py-0.5">
      <button
        onClick={() => onUpdate({ done: !item.done })}
        className={`shrink-0 w-4 h-4 rounded border flex items-center justify-center transition ${
          item.done
            ? 'bg-indigo-600 border-indigo-600 text-white'
            : 'border-gray-600 hover:border-indigo-500'
        }`}
      >
        {item.done && <span className="text-[10px] leading-none">✓</span>}
      </button>

      {editing ? (
        <input
          ref={inputRef}
          defaultValue={item.text}
          placeholder="輸入待辦項目..."
          onBlur={e => {
            const val = e.target.value.trim()
            if (!val) { onDelete(); return }
            onUpdate({ text: val })
            setEditing(false)
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              const val = (e.target as HTMLInputElement).value.trim()
              if (!val) { onDelete(); return }
              onUpdate({ text: val })
              setEditing(false)
            }
            if (e.key === 'Escape') {
              if (!item.text) { onDelete(); return }
              setEditing(false)
            }
          }}
          className="flex-1 bg-transparent text-sm text-gray-200 focus:outline-none border-b border-indigo-500 pb-0.5"
        />
      ) : (
        <span
          onDoubleClick={() => setEditing(true)}
          className={`flex-1 text-sm leading-relaxed cursor-default select-none ${
            item.done ? 'line-through text-gray-500' : 'text-gray-300'
          }`}
        >
          {item.text}
        </span>
      )}

      <button
        onClick={onDelete}
        className="shrink-0 text-gray-700 hover:text-red-400 transition text-xs opacity-0 group-hover:opacity-100"
      >
        ✕
      </button>
    </div>
  )
}

function formatTime(date: Date): string {
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (diff < 5) return '剛剛'
  if (diff < 60) return `${diff} 秒前`
  if (diff < 3600) return `${Math.floor(diff / 60)} 分鐘前`
  return date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
}
