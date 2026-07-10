'use client'

import { useState, useEffect } from 'react'

interface Summary {
  todayByTheme: Record<string, number>
  weekByTheme: Record<string, number>
  streak: number
  goalMap: Record<string, number>
}

export default function DailyProgress() {
  const [data, setData] = useState<Summary | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const load = () => {
      fetch('/api/progress/summary')
        .then(r => { if (!r.ok) throw new Error(); return r.json() })
        .then((d: Summary) => setData(d))
        .catch(() => setError(true))
    }
    load()
    window.addEventListener('progress-updated', load)
    return () => window.removeEventListener('progress-updated', load)
  }, [])

  if (error) return null

  // Loading skeleton
  if (!data) {
    return (
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl px-5 py-4 mb-6 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-800 rounded-full" />
          <div className="space-y-1.5">
            <div className="h-3 w-28 bg-gray-800 rounded" />
            <div className="h-2.5 w-20 bg-gray-800 rounded" />
          </div>
        </div>
      </div>
    )
  }

  const themes = Object.keys(data.goalMap).filter(t => data.goalMap[t] > 0)

  // No goals set — show a prompt
  if (themes.length === 0 && data.streak === 0) {
    return (
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl px-5 py-3 mb-6 text-center">
        <p className="text-sm text-gray-600">點擊右上角「🎯 目標」設定每週練習目標，即可追蹤進度</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-2xl px-5 py-4 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-4">

        {/* Streak */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-2xl">{data.streak > 0 ? '🔥' : '💤'}</span>
          <div>
            <p className="text-sm font-semibold text-gray-200">
              {data.streak > 0 ? `連續 ${data.streak} 天` : '今天還沒完成主題'}
            </p>
            <p className="text-xs text-gray-600">
              {data.streak >= 7 ? '超強！繼續保持！' : data.streak >= 3 ? '很有毅力！' : '完成主題即可累積連續天數'}
            </p>
          </div>
        </div>

        {/* Per-theme progress */}
        {themes.length > 0 && (
          <div className="flex gap-6 flex-wrap flex-1 justify-end">
            {themes.map(theme => {
              const weekGoal = data.goalMap[theme]
              const weekDone = data.weekByTheme[theme] ?? 0
              const todayDone = data.todayByTheme[theme] ?? 0
              const dailyTarget = Math.ceil(weekGoal / 7)
              const weekPct = Math.min(100, (weekDone / weekGoal) * 100)
              const todayDone100 = todayDone >= dailyTarget

              return (
                <div key={theme} className="min-w-37.5">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-gray-300">{theme}</span>
                    <span className="text-gray-500">{weekDone}/{weekGoal} 本週</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${weekPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>今日 {todayDone}/{dailyTarget}</span>
                    <span className={todayDone100 ? 'text-green-400 font-medium' : ''}>
                      {todayDone100 ? '✓ 今日達標' : `本週 ${Math.round(weekPct)}%`}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
