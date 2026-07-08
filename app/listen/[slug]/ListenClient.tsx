'use client'

import { useState, useRef, useCallback } from 'react'

interface KeyPoint {
  id: number
  text: string
}

interface Props {
  slug: string
  methodName: string
  initialKeyPoints: KeyPoint[]
}

type AudioState = 'idle' | 'loading' | 'playing' | 'paused' | 'done' | 'error'
type Mode = 'player' | 'edit'

export default function ListenClient({ slug, methodName, initialKeyPoints }: Props) {
  const [mode, setMode] = useState<Mode>(initialKeyPoints.length === 0 ? 'edit' : 'player')
  const [items, setItems] = useState<KeyPoint[]>(initialKeyPoints)
  const [newText, setNewText] = useState('')
  const [adding, setAdding] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // Player state
  const [states, setStates] = useState<AudioState[]>(() => initialKeyPoints.map(() => 'idle'))
  const [playingIdx, setPlayingIdx] = useState<number | null>(null)
  const [playMode, setPlayMode] = useState<'once' | 'repeat' | 'loop'>('once')
  const [speed, setSpeed] = useState(1)
  const [clearing, setClearing] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const playModeRef = useRef(playMode)
  const speedRef = useRef(speed)
  const itemsRef = useRef(items)
  playModeRef.current = playMode
  speedRef.current = speed
  itemsRef.current = items

  function setStateAt(i: number, s: AudioState) {
    setStates(prev => { const n = [...prev]; n[i] = s; return n })
  }

  function stopCurrent() {
    abortRef.current?.abort()
    abortRef.current = null
    if (audioRef.current) {
      audioRef.current.onended = null
      audioRef.current.onerror = null
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current = null
    }
  }

  const playIndex = useCallback(async (i: number) => {
    const currentItems = itemsRef.current
    if (i < 0 || i >= currentItems.length) return
    const itemId = currentItems[i].id

    stopCurrent()
    setPlayingIdx(i)
    setStateAt(i, 'loading')
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch(`/api/tts/${slug}/${itemId}`, { signal: controller.signal })
      if (!res.ok) { setStateAt(i, 'error'); setPlayingIdx(null); return }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      audioRef.current = audio

      audio.onended = () => {
        URL.revokeObjectURL(url)
        setStateAt(i, 'done')
        setPlayingIdx(null)
        const mode = playModeRef.current
        const len = itemsRef.current.length
        if (mode === 'repeat') {
          playIndex(i)
        } else if (mode === 'loop') {
          playIndex(i + 1 < len ? i + 1 : 0)
        }
      }
      audio.onerror = () => { URL.revokeObjectURL(url); setStateAt(i, 'error'); setPlayingIdx(null) }

      audio.playbackRate = speedRef.current
      setStateAt(i, 'playing')
      await audio.play()
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') return
      setStateAt(i, 'error'); setPlayingIdx(null)
    }
  }, [slug]) // eslint-disable-line react-hooks/exhaustive-deps

  function togglePause(i: number) {
    if (!audioRef.current || playingIdx !== i) return
    if (states[i] === 'playing') { audioRef.current.pause(); setStateAt(i, 'paused') }
    else if (states[i] === 'paused') { audioRef.current.play(); setStateAt(i, 'playing') }
  }

  function changeSpeed(s: number) {
    setSpeed(s)
    if (audioRef.current) audioRef.current.playbackRate = s
  }

  async function clearCache() {
    stopCurrent(); setPlayingIdx(null); setClearing(true)
    try {
      await fetch(`/api/tts/${slug}`, { method: 'DELETE' })
      setStates(items.map(() => 'idle'))
    } finally { setClearing(false) }
  }

  // Edit mode: add item
  async function addItem() {
    const text = newText.trim()
    if (!text || adding) return
    setAdding(true)
    try {
      const res = await fetch(`/api/key-points/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) return
      const { id } = await res.json() as { id: number }
      setItems(prev => [...prev, { id, text }])
      setStates(prev => [...prev, 'idle'])
      setNewText('')
    } finally {
      setAdding(false)
    }
  }

  // Edit mode: delete item
  async function deleteItem(itemId: number) {
    setDeletingId(itemId)
    try {
      await fetch(`/api/key-points/${slug}/${itemId}`, { method: 'DELETE' })
      const idx = items.findIndex(it => it.id === itemId)
      if (playingIdx === idx) { stopCurrent(); setPlayingIdx(null) }
      setItems(prev => prev.filter(it => it.id !== itemId))
      setStates(prev => prev.filter((_, i) => i !== idx))
      setDeleteConfirm(null)
    } finally {
      setDeletingId(null)
    }
  }

  // ─── Edit mode ───────────────────────────────────────────────────
  if (mode === 'edit') {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-100 font-mono">{methodName}</h1>
            <p className="text-gray-500 text-sm mt-1">管理聆聽重點</p>
          </div>
          {items.length > 0 && (
            <button
              onClick={() => setMode('player')}
              className="text-sm text-violet-400 hover:text-violet-300 border border-violet-800 hover:border-violet-700 px-3 py-1.5 rounded-lg transition"
            >
              ← 返回播放
            </button>
          )}
        </div>

        {items.length > 0 && (
          <div className="flex items-start gap-2.5 bg-amber-950/40 border border-amber-800/50 rounded-xl p-4 mb-6 text-sm text-amber-300/80">
            <span className="shrink-0 mt-0.5">⚠</span>
            <span>刪除重點後，對應的已生成音檔也會一併清除。</span>
          </div>
        )}

        {items.length > 0 ? (
          <div className="space-y-2 mb-8">
            {items.map((item) => (
              <div key={item.id} className="flex items-start gap-3 bg-gray-900 border border-gray-800 rounded-xl p-4">
                <p className="flex-1 text-sm text-gray-300 leading-relaxed">{item.text}</p>
                {deleteConfirm === item.id ? (
                  <div className="shrink-0 flex items-center gap-2">
                    <span className="text-xs text-red-400">確定刪除？</span>
                    <button
                      onClick={() => deleteItem(item.id)}
                      disabled={deletingId === item.id}
                      className="text-xs bg-red-900/50 hover:bg-red-900 text-red-400 border border-red-800 px-2 py-1 rounded transition disabled:opacity-50"
                    >
                      {deletingId === item.id ? '刪除中...' : '確定'}
                    </button>
                    <button onClick={() => setDeleteConfirm(null)} className="text-xs text-gray-600 hover:text-gray-400 transition">
                      取消
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(item.id)}
                    className="shrink-0 text-gray-700 hover:text-red-400 transition text-lg leading-none"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 mb-8">
            <div className="text-4xl mb-3">🎧</div>
            <p className="text-gray-500">尚無聆聽重點</p>
            <p className="text-gray-600 text-sm mt-1">在下方新增第一個重點</p>
          </div>
        )}

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">
            {items.length === 0 ? '新增第一個重點' : '新增重點'}
          </h3>
          <textarea
            value={newText}
            onChange={e => setNewText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) addItem() }}
            placeholder="輸入一句口語化的重點說明..."
            className="w-full bg-gray-950 text-gray-200 text-sm rounded-xl border border-gray-800 focus:border-gray-600 focus:outline-none p-3 resize-none leading-relaxed placeholder:text-gray-700"
            rows={3}
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-700">⌘ + Enter 快速新增</span>
            <button
              onClick={addItem}
              disabled={!newText.trim() || adding}
              className="bg-violet-700 hover:bg-violet-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
            >
              {adding ? '新增中...' : '新增'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── Player mode ─────────────────────────────────────────────────
  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 font-mono">{methodName}</h1>
          <p className="text-gray-500 mt-1 text-sm">{items.length} 個重點 · 適合通勤聆聽</p>
        </div>
        <button
          onClick={() => { stopCurrent(); setPlayingIdx(null); setMode('edit') }}
          className="shrink-0 text-sm text-gray-500 hover:text-gray-300 border border-gray-800 hover:border-gray-700 px-3 py-1.5 rounded-lg transition"
        >
          編輯重點
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPlayMode(m => m === 'repeat' ? 'once' : 'repeat')}
            className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border transition ${
              playMode === 'repeat'
                ? 'bg-violet-900/30 border-violet-700 text-violet-400'
                : 'border-gray-700 text-gray-500 hover:border-gray-600'
            }`}
          >
            🔂 重複此句
          </button>
          <button
            onClick={() => setPlayMode(m => m === 'loop' ? 'once' : 'loop')}
            className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border transition ${
              playMode === 'loop'
                ? 'bg-emerald-900/30 border-emerald-700 text-emerald-400'
                : 'border-gray-700 text-gray-500 hover:border-gray-600'
            }`}
          >
            🔁 循環播放
          </button>
        </div>
        <button
          onClick={clearCache}
          disabled={clearing}
          className="text-xs text-gray-600 hover:text-red-400 transition disabled:opacity-40 shrink-0"
        >
          {clearing ? '清除中...' : '🗑 清除快取'}
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs text-gray-500 shrink-0">播放速度</span>
        {[0.75, 1, 1.25, 1.5, 2].map(s => (
          <button
            key={s}
            onClick={() => changeSpeed(s)}
            className={`text-xs px-2.5 py-1 rounded-lg border transition ${
              speed === s
                ? 'bg-blue-900/40 border-blue-700 text-blue-300'
                : 'border-gray-700 text-gray-500 hover:border-gray-600 hover:text-gray-400'
            }`}
          >
            {s}x
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {items.map((item, i) => {
          const state = states[i]
          const isPlaying = playingIdx === i && state === 'playing'
          const isPaused = playingIdx === i && state === 'paused'

          return (
            <div
              key={item.id}
              className={`flex items-start gap-4 p-4 rounded-xl border transition ${
                isPlaying ? 'bg-blue-950/40 border-blue-700/60'
                  : isPaused ? 'bg-gray-800/60 border-gray-600'
                  : state === 'done' ? 'bg-gray-900/40 border-emerald-900/40'
                  : 'bg-gray-900 border-gray-800'
              }`}
            >
              <button
                onClick={() => {
                  if (isPlaying) togglePause(i)
                  else if (isPaused) togglePause(i)
                  else playIndex(i)
                }}
                disabled={state === 'loading'}
                className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm transition ${
                  state === 'loading' ? 'bg-gray-800 text-gray-600 cursor-wait'
                    : isPlaying ? 'bg-blue-600 hover:bg-blue-500 text-white'
                    : isPaused ? 'bg-yellow-700 hover:bg-yellow-600 text-white'
                    : state === 'done' ? 'bg-emerald-900/60 hover:bg-gray-700 text-emerald-400'
                    : state === 'error' ? 'bg-red-900/60 hover:bg-red-800 text-red-400'
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-400'
                }`}
              >
                {state === 'loading' ? <span className="animate-spin text-xs">⟳</span>
                  : isPlaying ? '⏸'
                  : isPaused ? '▶'
                  : state === 'done' ? '✓'
                  : state === 'error' ? '!'
                  : '▶'}
              </button>
              <div className="flex-1 min-w-0">
                <span className="text-xs text-gray-600 mr-2 font-mono">{i + 1}</span>
                <span className={`text-sm leading-relaxed ${
                  isPlaying ? 'text-blue-200' : state === 'done' ? 'text-gray-400' : 'text-gray-300'
                }`}>
                  {item.text}
                </span>
                {state === 'error' && <p className="text-xs text-red-500 mt-1">生成失敗，點按鈕重試</p>}
              </div>
            </div>
          )
        })}
      </div>

      <button
        onClick={() => playIndex(0)}
        className="w-full mt-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition"
      >
        ▶ 從頭播放全部
      </button>
    </div>
  )
}
