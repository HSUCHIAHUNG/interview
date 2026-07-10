'use client'

import { useState, useRef, useCallback } from 'react'
import type { ThemeTopicSection } from '@/lib/db/queries'

interface FlatItem {
  id: number
  text: string
  slug: string
  topicTitle: string
  sectionIdx: number
}

type AudioState = 'idle' | 'loading' | 'playing' | 'paused' | 'done' | 'error'

interface Props {
  theme: string
  initialSections: ThemeTopicSection[]
}

const SPEEDS = [0.75, 1, 1.25, 1.5, 2]

export default function ListenThemeClient({ theme, initialSections }: Props) {
  const [sections, setSections] = useState<ThemeTopicSection[]>(initialSections)
  const [newTexts, setNewTexts] = useState<Record<string, string>>({})
  const [addingSlug, setAddingSlug] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [expandedSlugs, setExpandedSlugs] = useState<Set<string>>(
    () => new Set(initialSections.filter(s => s.keyPoints.length > 0).map(s => s.slug))
  )

  // Flatten all key points for the player
  const flatItems: FlatItem[] = sections.flatMap((s, si) =>
    s.keyPoints.map(kp => ({ id: kp.id, text: kp.text, slug: s.slug, topicTitle: s.title, sectionIdx: si }))
  )
  const flatRef = useRef(flatItems)
  flatRef.current = flatItems

  // Player state
  const [audioStates, setAudioStates] = useState<Record<number, AudioState>>({})
  const [playingId, setPlayingId] = useState<number | null>(null)
  const [playMode, setPlayMode] = useState<'once' | 'repeat' | 'loop'>('once')
  const [speed, setSpeed] = useState(1)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const playModeRef = useRef(playMode)
  const speedRef = useRef(speed)
  playModeRef.current = playMode
  speedRef.current = speed

  function setAudioState(id: number, s: AudioState) {
    setAudioStates(prev => ({ ...prev, [id]: s }))
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

  function changeSpeed(s: number) {
    setSpeed(s)
    if (audioRef.current) audioRef.current.playbackRate = s
  }

  const playById = useCallback(async (id: number) => {
    const items = flatRef.current
    const idx = items.findIndex(it => it.id === id)
    if (idx === -1) return
    const item = items[idx]

    stopCurrent()
    setPlayingId(id)
    setAudioState(id, 'loading')
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch(`/api/tts/${item.slug}/${id}`, { signal: controller.signal })
      if (!res.ok) { setAudioState(id, 'error'); setPlayingId(null); return }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      audioRef.current = audio
      audio.playbackRate = speedRef.current

      audio.onended = () => {
        URL.revokeObjectURL(url)
        setAudioState(id, 'done')
        setPlayingId(null)
        const mode = playModeRef.current
        const len = flatRef.current.length
        const curIdx = flatRef.current.findIndex(it => it.id === id)
        if (mode === 'repeat') {
          playById(id)
        } else if (mode === 'loop') {
          const nextItem = flatRef.current[curIdx + 1 < len ? curIdx + 1 : 0]
          if (nextItem) playById(nextItem.id)
        }
      }
      audio.onerror = () => { URL.revokeObjectURL(url); setAudioState(id, 'error'); setPlayingId(null) }

      setAudioState(id, 'playing')
      await audio.play()
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') return
      setAudioState(id, 'error'); setPlayingId(null)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function togglePause(id: number) {
    if (!audioRef.current || playingId !== id) return
    const state = audioStates[id]
    if (state === 'playing') { audioRef.current.pause(); setAudioState(id, 'paused') }
    else if (state === 'paused') { audioRef.current.play(); setAudioState(id, 'playing') }
  }

  // Edit: add key point to a section
  async function addKeyPoint(slug: string) {
    const text = (newTexts[slug] ?? '').trim()
    if (!text || addingSlug === slug) return
    setAddingSlug(slug)
    try {
      const res = await fetch(`/api/key-points/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) return
      const { id } = await res.json() as { id: number }
      setSections(prev => prev.map(s =>
        s.slug === slug ? { ...s, keyPoints: [...s.keyPoints, { id, text }] } : s
      ))
      setNewTexts(prev => ({ ...prev, [slug]: '' }))
    } finally {
      setAddingSlug(null)
    }
  }

  // Edit: delete key point
  async function deleteKeyPoint(id: number, slug: string) {
    setDeletingId(id)
    try {
      await fetch(`/api/key-points/${slug}/${id}`, { method: 'DELETE' })
      if (playingId === id) { stopCurrent(); setPlayingId(null) }
      setSections(prev => prev.map(s =>
        s.slug === slug ? { ...s, keyPoints: s.keyPoints.filter(k => k.id !== id) } : s
      ))
      setDeleteConfirm(null)
    } finally {
      setDeletingId(null)
    }
  }

  function toggleExpand(slug: string) {
    setExpandedSlugs(prev => {
      const next = new Set(prev)
      next.has(slug) ? next.delete(slug) : next.add(slug)
      return next
    })
  }

  const totalKeyPoints = flatItems.length

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">{theme}</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {sections.length} 個子主題 · {totalKeyPoints} 個聆聽重點
          </p>
        </div>
      </div>

      {totalKeyPoints > 0 && (
        <>
          {/* Play controls */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
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

          {/* Speed */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xs text-gray-500 shrink-0">播放速度</span>
            {SPEEDS.map(s => (
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

          {/* Play all button */}
          <button
            onClick={() => { stopCurrent(); if (flatItems[0]) playById(flatItems[0].id) }}
            className="w-full mb-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition"
          >
            ▶ 從頭播放全部 ({totalKeyPoints} 個重點)
          </button>
        </>
      )}

      {/* Sections */}
      <div className="space-y-4">
        {sections.map(section => {
          const expanded = expandedSlugs.has(section.slug)
          return (
            <div key={section.slug} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              {/* Section header */}
              <button
                onClick={() => toggleExpand(section.slug)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-800/50 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-200 text-sm">{section.title}</span>
                  <span className="text-xs text-gray-600">
                    {section.keyPoints.length > 0 ? `${section.keyPoints.length} 個重點` : '尚無重點'}
                  </span>
                </div>
                <span className={`text-gray-600 text-sm transition-transform ${expanded ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {expanded && (
                <div className="border-t border-gray-800">
                  {/* Key points list */}
                  {section.keyPoints.length > 0 && (
                    <div className="px-4 pt-3 space-y-2">
                      {section.keyPoints.map(kp => {
                        const state = audioStates[kp.id] ?? 'idle'
                        const isPlaying = playingId === kp.id && state === 'playing'
                        const isPaused = playingId === kp.id && state === 'paused'

                        return (
                          <div
                            key={kp.id}
                            className={`flex items-start gap-3 p-3 rounded-xl border transition ${
                              isPlaying ? 'bg-blue-950/40 border-blue-700/60'
                                : isPaused ? 'bg-gray-800/60 border-gray-600'
                                : state === 'done' ? 'bg-gray-900/40 border-emerald-900/40'
                                : 'bg-gray-800/30 border-gray-700/50'
                            }`}
                          >
                            <button
                              onClick={() => {
                                if (isPlaying) togglePause(kp.id)
                                else if (isPaused) togglePause(kp.id)
                                else playById(kp.id)
                              }}
                              disabled={state === 'loading'}
                              className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs transition ${
                                state === 'loading' ? 'bg-gray-800 text-gray-600 cursor-wait'
                                  : isPlaying ? 'bg-blue-600 hover:bg-blue-500 text-white'
                                  : isPaused ? 'bg-yellow-700 hover:bg-yellow-600 text-white'
                                  : state === 'done' ? 'bg-emerald-900/60 hover:bg-gray-700 text-emerald-400'
                                  : state === 'error' ? 'bg-red-900/60 hover:bg-red-800 text-red-400'
                                  : 'bg-gray-700 hover:bg-gray-600 text-gray-400'
                              }`}
                            >
                              {state === 'loading' ? <span className="animate-spin">⟳</span>
                                : isPlaying ? '⏸'
                                : isPaused ? '▶'
                                : state === 'done' ? '✓'
                                : state === 'error' ? '!'
                                : '▶'}
                            </button>

                            <p className={`flex-1 text-sm leading-relaxed ${
                              isPlaying ? 'text-blue-200' : state === 'done' ? 'text-gray-500' : 'text-gray-300'
                            }`}>
                              {kp.text}
                            </p>

                            {deleteConfirm === kp.id ? (
                              <div className="shrink-0 flex items-center gap-2">
                                <span className="text-xs text-red-400">確定刪除？</span>
                                <button
                                  onClick={() => deleteKeyPoint(kp.id, section.slug)}
                                  disabled={deletingId === kp.id}
                                  className="text-xs bg-red-900/50 hover:bg-red-900 text-red-400 border border-red-800 px-2 py-1 rounded transition disabled:opacity-50"
                                >
                                  {deletingId === kp.id ? '刪除中...' : '確定'}
                                </button>
                                <button onClick={() => setDeleteConfirm(null)} className="text-xs text-gray-600 hover:text-gray-400">取消</button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirm(kp.id)}
                                className="shrink-0 text-gray-700 hover:text-red-400 transition text-lg leading-none"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Add key point */}
                  <div className="px-4 py-4">
                    <div className="flex gap-2">
                      <textarea
                        value={newTexts[section.slug] ?? ''}
                        onChange={e => setNewTexts(prev => ({ ...prev, [section.slug]: e.target.value }))}
                        onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) addKeyPoint(section.slug) }}
                        placeholder="新增重點..."
                        rows={2}
                        className="flex-1 bg-gray-950 text-gray-200 text-sm rounded-xl border border-gray-700 focus:border-gray-500 focus:outline-none px-3 py-2 resize-none leading-relaxed placeholder:text-gray-700"
                      />
                      <button
                        onClick={() => addKeyPoint(section.slug)}
                        disabled={!(newTexts[section.slug] ?? '').trim() || addingSlug === section.slug}
                        className="shrink-0 bg-violet-700 hover:bg-violet-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 rounded-xl transition"
                      >
                        {addingSlug === section.slug ? '...' : '新增'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
