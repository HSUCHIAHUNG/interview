'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface Props {
  onClose: () => void
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export default function MemoModal({ onClose }: Props) {
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<SaveStatus>('idle')
  const [savedAt, setSavedAt] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestContent = useRef(content)

  useEffect(() => {
    fetch('/api/memo')
      .then(r => r.json())
      .then(d => {
        setContent(d.content ?? '')
        if (d.updatedAt) setSavedAt(new Date(d.updatedAt))
      })
      .finally(() => setLoading(false))
  }, [])

  const save = useCallback(async (text: string) => {
    setStatus('saving')
    try {
      const r = await fetch('/api/memo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text }),
      })
      const d = await r.json()
      setSavedAt(new Date(d.updatedAt))
      setStatus('saved')
    } catch {
      setStatus('error')
    }
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value
    setContent(val)
    latestContent.current = val
    setStatus('idle')
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      save(latestContent.current)
    }, 1000)
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose()
  }

  const statusText =
    status === 'saving' ? '儲存中...' :
    status === 'saved' ? `已儲存 ${savedAt ? formatTime(savedAt) : ''}` :
    status === 'error' ? '儲存失敗' :
    savedAt ? `上次儲存 ${formatTime(savedAt)}` : ''

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleBackdrop}
    >
      <div className="w-full max-w-lg bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col"
        style={{ height: '520px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <span className="text-lg">📝</span>
            <h2 className="text-gray-100 font-semibold">待辦筆記</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 transition text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Textarea */}
        <div className="flex-1 min-h-0 p-4">
          {loading ? (
            <div className="h-full rounded-lg bg-gray-800/50 animate-pulse" />
          ) : (
            <textarea
              autoFocus
              value={content}
              onChange={handleChange}
              placeholder={'記錄待新增的題目、主題或想法...\n\n例如：\n- [ ] TypeScript utility types 再加 5 題\n- [ ] React 18 concurrent features\n- [ ] CSS grid layout'}
              className="w-full h-full resize-none bg-transparent text-gray-200 placeholder-gray-600 text-sm leading-relaxed focus:outline-none"
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-800 flex items-center justify-between">
          <span className={`text-xs transition ${
            status === 'saving' ? 'text-yellow-500' :
            status === 'saved' ? 'text-green-500' :
            status === 'error' ? 'text-red-400' :
            'text-gray-600'
          }`}>
            {status === 'saving' && <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 animate-pulse mr-1.5" />}
            {statusText}
          </span>
          <span className="text-xs text-gray-700">停止輸入後自動儲存</span>
        </div>
      </div>
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
