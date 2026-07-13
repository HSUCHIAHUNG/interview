'use client'

import { useState, useEffect } from 'react'
import type { WeekHistoryEntry } from '@/lib/db/queries'

function fmtDate(s: string) {
  const [, m, d] = s.split('-')
  return `${+m}/${+d}`
}

export default function WeekHistoryModal({ onClose }: { onClose: () => void }) {
  const [weeks, setWeeks] = useState<WeekHistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetch('/api/progress/history')
      .then(r => r.json())
      .then((data: { weeks: WeekHistoryEntry[] }) => {
        setWeeks(data.weeks)
        const init: Record<string, string> = {}
        for (const w of data.weeks) init[w.weekStart] = w.note
        setNotes(init)
      })
      .finally(() => setLoading(false))
  }, [])

  async function saveNote(weekStart: string) {
    setSaving(s => ({ ...s, [weekStart]: true }))
    await fetch('/api/progress/history', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weekStart, note: notes[weekStart] ?? '' }),
    })
    setSaving(s => ({ ...s, [weekStart]: false }))
    setSaved(s => ({ ...s, [weekStart]: true }))
    setTimeout(() => setSaved(s => ({ ...s, [weekStart]: false })), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl flex flex-col max-h-[82vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 text-xl leading-none"
        >×</button>

        <h2 className="text-lg font-bold text-gray-100 mb-0.5">📅 週達標歷史</h2>
        <p className="text-sm text-gray-500 mb-5">每週練習紀錄，可加入備注說明當週情況</p>

        <div className="overflow-y-auto flex-1 pr-1 space-y-3">
          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-28 bg-gray-800 rounded-xl" />
              ))}
            </div>
          ) : weeks.length === 0 ? (
            <p className="text-center text-gray-600 py-10">還沒有任何練習紀錄</p>
          ) : (
            weeks.map(w => {
              const goalsWithTarget = w.themes.filter(t => t.goal > 0)
              const anyGoal = goalsWithTarget.length > 0
              const allMet = anyGoal && goalsWithTarget.every(t => t.done >= t.goal)
              const overallPct = anyGoal
                ? Math.round(
                    goalsWithTarget.reduce((s, t) => s + Math.min(1, t.done / t.goal), 0) /
                    goalsWithTarget.length * 100,
                  )
                : null

              return (
                <div
                  key={w.weekStart}
                  className="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-3"
                >
                  {/* Week header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-200">
                        {fmtDate(w.weekStart)} – {fmtDate(w.weekEnd)}
                      </span>
                      {w.isCurrentWeek && (
                        <span className="text-xs bg-blue-900/50 text-blue-400 border border-blue-800 px-1.5 py-0.5 rounded-full">
                          本週
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">共 {w.totalDone} 題</span>
                      {anyGoal && (
                        <span
                          className={`text-xs font-semibold px-1.5 py-0.5 rounded-full border ${
                            allMet
                              ? 'text-green-400 bg-green-900/30 border-green-800'
                              : 'text-gray-500 bg-gray-900/50 border-gray-700'
                          }`}
                        >
                          {allMet ? '✓ 達標' : `${overallPct}%`}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Theme breakdown */}
                  <div className="space-y-2">
                    {w.themes.map(t => {
                      const pct = t.goal > 0 ? Math.min(100, (t.done / t.goal) * 100) : null
                      const met = t.goal > 0 && t.done >= t.goal
                      return (
                        <div key={t.theme}>
                          <div className="flex justify-between text-xs mb-0.5">
                            <span className="text-gray-400">{t.theme}</span>
                            <span className={met ? 'text-green-400' : 'text-gray-500'}>
                              {t.done}{t.goal > 0 ? `/${t.goal}` : ' 題'}
                              {met && ' ✓'}
                            </span>
                          </div>
                          {pct !== null && (
                            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${met ? 'bg-green-500' : 'bg-blue-500'}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Note */}
                  <div>
                    <textarea
                      value={notes[w.weekStart] ?? ''}
                      onChange={e => setNotes(n => ({ ...n, [w.weekStart]: e.target.value }))}
                      placeholder="記錄當週的狀況、心得、需要加強的地方..."
                      rows={2}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 placeholder-gray-600 resize-none focus:outline-none focus:border-gray-500 transition"
                    />
                    <div className="flex justify-end mt-1">
                      <button
                        onClick={() => saveNote(w.weekStart)}
                        disabled={saving[w.weekStart]}
                        className="text-xs text-gray-500 hover:text-gray-300 border border-gray-700 hover:border-gray-500 px-2.5 py-1 rounded-lg transition disabled:opacity-50"
                      >
                        {saving[w.weekStart] ? '儲存中...' : saved[w.weekStart] ? '✓ 已儲存' : '儲存備注'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
