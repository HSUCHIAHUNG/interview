'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { ActivityCalendar } from 'react-activity-calendar'
import type { Activity, BlockElement } from 'react-activity-calendar'
import type { FocusDayEntry } from '@/app/api/focus/history/route'

const GRACE = 365

function formatMinutes(seconds: number): string {
  const m = Math.floor(seconds / 60)
  if (m === 0) return '< 1 分鐘'
  if (m < 60) return `${m} 分`
  const h = Math.floor(m / 60)
  const rem = m % 60
  return rem > 0 ? `${h}h ${rem}m` : `${h}h`
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0]
}

function getLevel(e: FocusDayEntry): 0 | 1 | 2 | 3 | 4 {
  const mins = Math.floor(e.seconds / 60)
  const q = e.questionCount
  if (mins >= 60 || q >= 20) return 4
  if (mins >= 30 || q >= 10) return 3
  if (mins >= 10 || q >= 5)  return 2
  if (mins > 0  || q > 0)   return 1
  return 0
}

export default function DailyLogClient() {
  const [entries, setEntries] = useState<FocusDayEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string>(todayStr())
  const [hovered, setHovered] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [noteSaved, setNoteSaved] = useState(false)
  const [savingNote, setSavingNote] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`/api/focus/history?days=${GRACE}`)
      .then(r => r.json())
      .then((data: FocusDayEntry[]) => { setEntries(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const loadNote = useCallback((date: string) => {
    setNote('')
    setNoteSaved(false)
    fetch(`/api/daily-notes?date=${date}`)
      .then(r => r.json())
      .then((d: { note: string }) => setNote(d.note))
      .catch(() => {})
  }, [])

  useEffect(() => { loadNote(selected) }, [selected, loadNote])

  async function saveNote() {
    setSavingNote(true)
    try {
      await fetch('/api/daily-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: selected, note }),
      })
      setNoteSaved(true)
      setTimeout(() => setNoteSaved(false), 2000)
    } finally {
      setSavingNote(false)
    }
  }

  // Build activity data for ActivityCalendar
  const startDate = new Date(Date.now() - (GRACE - 1) * 86400000).toISOString().split('T')[0]
  const endDate = todayStr()
  const entryMap = Object.fromEntries(entries.map(e => [e.date, e]))

  const activitySet = new Map<string, { count: number; level: 0 | 1 | 2 | 3 | 4 }>()
  for (const e of entries) {
    if (e.date >= startDate && e.date <= endDate) {
      activitySet.set(e.date, {
        count: Math.floor(e.seconds / 60) + e.questionCount,
        level: getLevel(e),
      })
    }
  }
  // Boundary dates required by the library to define the range
  if (!activitySet.has(startDate)) activitySet.set(startDate, { count: 0, level: 0 })
  if (!activitySet.has(endDate))   activitySet.set(endDate,   { count: 0, level: 0 })

  const activityData = [...activitySet.entries()]
    .map(([date, v]) => ({ date, ...v }))
    .sort((a, b) => a.date.localeCompare(b.date))

  const selectedEntry = entryMap[selected]
  const isToday = selected === todayStr()

  return (
    <div className="space-y-8">
      {/* Heatmap */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl px-6 py-6">
        <h2 className="text-sm font-semibold text-gray-400 mb-5">過去 {GRACE} 天學習熱圖</h2>

        <div
          ref={scrollRef}
          className="overflow-x-auto scrollbar-thin"
        >
          <div className="pr-6 pb-1">
          <ActivityCalendar
            data={activityData}
            colorScheme="dark"
            theme={{
              dark: ['#1f2937', '#1e3a8a', '#1d4ed8', '#3b82f6', '#8b5cf6'],
            }}
            blockSize={13}
            blockMargin={4}
            blockRadius={3}
            fontSize={12}
            showWeekdayLabels
            labels={{
              totalCount: '{{count}} activity records',
              legend: { less: 'Less', more: 'More' },
            }}
            renderBlock={(block: BlockElement, activity: Activity) =>
              React.cloneElement(block, {
                onClick: () => setSelected(activity.date),
                onMouseEnter: () => setHovered(activity.date),
                onMouseLeave: () => setHovered(null),
                style: {
                  cursor: 'pointer',
                  ...(activity.date === selected
                    ? { filter: 'brightness(3) saturate(0.3)' }
                    : {}),
                },
              })
            }
          />
          </div>
        </div>

        {/* Hover info bar — replaces native tooltip to avoid cutoff */}
        <div className="h-5 mt-2 text-xs text-gray-500">
          {hovered && (() => {
            const e = entryMap[hovered]
            if (!e || (e.seconds === 0 && e.questionCount === 0)) return hovered
            return `${hovered}  ·  ⏱ ${formatMinutes(e.seconds)}  ·  ✏️ ${e.questionCount} 題  ·  離開 ${e.leaveCount} 次`
          })()}
        </div>
      </div>

      {/* Selected day detail */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl px-4 sm:px-6 py-5">
        {/* Header: date + nav */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
          <h2 className="text-sm font-semibold text-gray-400 shrink-0">
            {isToday ? '今天' : selected}
            {isToday && <span className="text-gray-600 ml-2">{selected}</span>}
          </h2>
          <div className="flex gap-1">
            <button
              onClick={() => {
                const d = new Date(selected + 'T12:00:00')
                d.setDate(d.getDate() - 1)
                setSelected(d.toISOString().split('T')[0])
              }}
              className="text-xs px-2 py-1 rounded text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition"
            >← 前一天</button>
            {!isToday && (
              <button
                onClick={() => setSelected(todayStr())}
                className="text-xs px-2 py-1 rounded text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition"
              >今天</button>
            )}
            {selected < todayStr() && (
              <button
                onClick={() => {
                  const d = new Date(selected + 'T12:00:00')
                  d.setDate(d.getDate() + 1)
                  setSelected(d.toISOString().split('T')[0])
                }}
                className="text-xs px-2 py-1 rounded text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition"
              >後一天 →</button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
          <div className="bg-gray-800/50 rounded-xl px-2 sm:px-4 py-3 text-center">
            <p className="text-xl sm:text-2xl font-bold text-blue-400 truncate">
              {selectedEntry ? formatMinutes(selectedEntry.seconds) : '–'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5 whitespace-nowrap">專注時間</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl px-2 sm:px-4 py-3 text-center">
            <p className="text-xl sm:text-2xl font-bold text-gray-200">
              {selectedEntry?.questionCount ?? '–'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">答題數</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl px-2 sm:px-4 py-3 text-center">
            <p className="text-xl sm:text-2xl font-bold text-gray-400">
              {selectedEntry?.leaveCount ?? '–'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5 whitespace-nowrap">離開次數</p>
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-2">
            {isToday ? '今日心得 / 備忘' : '當日備忘'}
          </label>
          <textarea
            value={note}
            onChange={e => { setNote(e.target.value); setNoteSaved(false) }}
            rows={3}
            placeholder={isToday ? '今天學了什麼？有什麼卡關的點？' : '（無備忘）'}
            className="w-full bg-gray-800 text-gray-200 text-sm rounded-xl border border-gray-700 focus:border-gray-500 focus:outline-none px-4 py-3 resize-none"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={saveNote}
              disabled={savingNote}
              className="text-sm px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold transition"
            >
              {noteSaved ? '✓ 已儲存' : savingNote ? '儲存中...' : '儲存'}
            </button>
          </div>
        </div>
      </div>

      {/* All-time summary */}
      {!loading && entries.length > 0 && (
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl px-6 py-5">
          <h2 className="text-sm font-semibold text-gray-400 mb-4">長期統計</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="text-center">
              <p className="text-xl font-bold text-gray-200">
                {entries.filter(e => e.seconds > 0 || e.questionCount > 0).length}
              </p>
              <p className="text-xs text-gray-600">學習天數</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-blue-400">
                {formatMinutes(entries.reduce((s, e) => s + e.seconds, 0))}
              </p>
              <p className="text-xs text-gray-600">總專注時間</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gray-200">
                {entries.reduce((s, e) => s + e.questionCount, 0)}
              </p>
              <p className="text-xs text-gray-600">總答題數</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gray-400">
                {entries.reduce((s, e) => s + e.leaveCount, 0)}
              </p>
              <p className="text-xs text-gray-600">總離開次數</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
