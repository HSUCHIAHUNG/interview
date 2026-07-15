'use client'

import { useState, useEffect } from 'react'
import type { ThemeHistoryEntry } from '@/lib/db/queries'

function fmtDate(s: string) {
  const [, m, d] = s.split('-')
  return `${+m}/${+d}`
}

const MILESTONE_LABELS: Record<number, string> = { 25: '25%', 50: '50%', 75: '75%', 100: '100%' }

export default function WeekHistoryModal({ onClose }: { onClose: () => void }) {
  const [themes, setThemes] = useState<ThemeHistoryEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/progress/history')
      .then(r => r.json())
      .then((data: { themes: ThemeHistoryEntry[] }) => {
        setThemes(data.themes)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl flex flex-col max-h-[82vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 text-xl leading-none"
        >×</button>

        <h2 className="text-lg font-bold text-gray-100 mb-0.5">📅 主題達標歷史</h2>
        <p className="text-sm text-gray-500 mb-5">各主題累積進度與里程碑</p>

        <div className="overflow-y-auto flex-1 pr-1 space-y-3">
          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-28 bg-gray-800 rounded-xl" />
              ))}
            </div>
          ) : themes.length === 0 ? (
            <p className="text-center text-gray-600 py-10">還沒有任何練習紀錄</p>
          ) : (
            themes.map(t => {
              const hasGoal = t.targetCount > 0
              const pct = hasGoal ? Math.min(100, (t.totalDone / t.targetCount) * 100) : null
              const allDone = hasGoal && t.totalDone >= t.targetCount
              const dailyRate = hasGoal && t.targetDays && t.targetDays > 0
                ? (t.targetCount / t.targetDays).toFixed(1)
                : null

              let isOverdue = false
              if (!allDone && t.startDate && t.targetDays && t.targetDays > 0) {
                const start = new Date(t.startDate)
                const deadlineMs = start.getTime() + t.targetDays * 86400000
                isOverdue = Date.now() > deadlineMs
              }

              return (
                <div
                  key={t.theme}
                  className={`bg-gray-800 border rounded-xl p-4 space-y-3 ${isOverdue ? 'border-red-800/60' : 'border-gray-700'}`}
                >
                  {/* Theme header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-semibold text-gray-200">{t.theme}</span>
                      {dailyRate && (
                        <span className="ml-2 text-xs text-gray-500">每日 {dailyRate} 題</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">已完成 {t.totalDone} 題</span>
                      {hasGoal && (
                        <span
                          className={`text-xs font-semibold px-1.5 py-0.5 rounded-full border ${
                            allDone
                              ? 'text-green-400 bg-green-900/30 border-green-800'
                              : isOverdue
                              ? 'text-red-400 bg-red-900/20 border-red-800/60'
                              : 'text-gray-500 bg-gray-900/50 border-gray-700'
                          }`}
                        >
                          {allDone ? '✓ 達標' : isOverdue ? '⚠ 已超時' : `${Math.round(pct!)}%`}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  {hasGoal && (
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{t.totalDone}/{t.targetCount}</span>
                        {t.targetDays && (
                          <span>
                            目標 {t.targetDays} 天
                            {t.startDate && (() => {
                              const end = new Date(t.startDate)
                              end.setDate(end.getDate() + t.targetDays - 1)
                              const endStr = `${end.getMonth() + 1}/${end.getDate()}`
                              return ` (${fmtDate(t.startDate)} – ${endStr})`
                            })()}
                          </span>
                        )}
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${allDone ? 'bg-green-500' : isOverdue ? 'bg-red-500' : 'bg-blue-500'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Milestones */}
                  {hasGoal && (
                    <div className="grid grid-cols-4 gap-1.5">
                      {([25, 50, 75, 100] as const).map(p => {
                        const hit = t.milestones.find(m => m.pct === p)
                        return (
                          <div
                            key={p}
                            className={`rounded-lg px-2 py-1.5 text-center border ${
                              hit
                                ? 'border-blue-700 bg-blue-900/20'
                                : 'border-gray-700 bg-gray-900/30'
                            }`}
                          >
                            <div className={`text-xs font-semibold ${hit ? 'text-blue-400' : 'text-gray-600'}`}>
                              {MILESTONE_LABELS[p]}
                            </div>
                            <div className={`text-xs mt-0.5 ${hit ? 'text-gray-400' : 'text-gray-700'}`}>
                              {hit ? fmtDate(hit.date) : '—'}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Start date */}
                  {t.startDate && (
                    <p className="text-xs text-gray-600">開始日期：{fmtDate(t.startDate)}</p>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
