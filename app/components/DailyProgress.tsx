'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Summary {
  todayByTheme: Record<string, number>
  totalByTheme: Record<string, number>
  startDateByTheme: Record<string, string>
  streak: number
  goalMap: Record<string, number>
  targetDaysMap: Record<string, number | null>
  todayFocusSeconds: number
  todayLeaveCount: number
}

function formatMinutes(seconds: number): string {
  const m = Math.floor(seconds / 60)
  if (m < 60) return `${m} 分鐘`
  const h = Math.floor(m / 60)
  const rem = m % 60
  return rem > 0 ? `${h} 小時 ${rem} 分` : `${h} 小時`
}

export default function DailyProgress() {
  const [data, setData] = useState<Summary | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const load = () => {
      fetch('/api/progress/summary', { cache: 'no-store' })
        .then(r => { if (!r.ok) throw new Error(); return r.json() })
        .then((d: Summary) => setData(d))
        .catch(() => setError(true))
    }
    load()
    window.addEventListener('progress-updated', load)
    return () => window.removeEventListener('progress-updated', load)
  }, [])

  if (error) return null

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
  const hasFocus = data.todayFocusSeconds > 0

  if (themes.length === 0 && data.streak === 0 && !hasFocus) {
    return (
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl px-5 py-3 mb-6 text-center">
        <p className="text-sm text-gray-600">點擊右上角「🎯 目標」設定練習目標，即可追蹤進度</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-2xl px-5 py-4 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-4">

        {/* Left: Streak + Focus (stack vertically on mobile) */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 shrink-0">
          <div className="flex items-center gap-2">
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

          {/* Focus time */}
          <Link
            href="/daily-log"
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-800/60 hover:bg-gray-800 border border-gray-700/50 hover:border-gray-600 transition group"
            title="查看學習日誌"
          >
            <span className="text-base">⏱</span>
            <div>
              <p className="text-xs font-semibold text-gray-300 group-hover:text-white transition">
                {hasFocus ? formatMinutes(data.todayFocusSeconds) : '0 分鐘'}
              </p>
              {data.todayLeaveCount > 0 && (
                <p className="text-xs text-gray-600">離開 {data.todayLeaveCount} 次</p>
              )}
            </div>
            <span className="text-gray-600 group-hover:text-gray-400 text-xs ml-0.5 transition">📓</span>
          </Link>
        </div>

        {/* Per-theme progress */}
        {themes.length > 0 && (
          <div className="flex gap-6 flex-wrap flex-1 justify-end">
            {themes.map(theme => {
              const targetCount = data.goalMap[theme]
              const targetDays = data.targetDaysMap[theme]
              const totalDone = data.totalByTheme[theme] ?? 0
              const todayDone = data.todayByTheme[theme] ?? 0
              const startDate = data.startDateByTheme[theme] ?? null
              const dailyRate = targetDays && targetDays > 0 ? targetCount / targetDays : null
              const totalPct = Math.min(100, (totalDone / targetCount) * 100)
              const dailyTarget = dailyRate ? dailyRate.toFixed(1) : null
              const todayMet = dailyRate != null && todayDone >= dailyRate
              const allDone = totalDone >= targetCount

              let isOverdue = false
              let endDateStr: string | null = null
              if (startDate && targetDays && targetDays > 0) {
                const start = new Date(startDate)
                const deadlineMs = start.getTime() + targetDays * 86400000
                if (!allDone) isOverdue = Date.now() > deadlineMs
                const endDate = new Date(deadlineMs)
                endDateStr = `${endDate.getMonth() + 1}/${endDate.getDate()}`
              }

              return (
                <div key={theme} className="min-w-37.5">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-gray-300">{theme}</span>
                    <span className={allDone ? 'text-green-400 font-medium' : isOverdue ? 'text-red-400 font-medium' : 'text-gray-500'}>
                      {totalDone}/{targetCount} 累積{allDone ? ' ✓' : ''}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${allDone ? 'bg-green-500' : isOverdue ? 'bg-red-500' : 'bg-blue-500'}`}
                      style={{ width: `${totalPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-gray-600">今日 {todayDone}{dailyTarget ? `/${dailyTarget}` : ''}</span>
                    <span className={allDone ? 'text-green-400 font-medium' : isOverdue ? 'text-red-400 font-medium' : todayMet ? 'text-green-400 font-medium' : 'text-gray-600'}>
                      {allDone ? '✓ 目標達標' : isOverdue ? '⚠ 已超時' : todayMet ? '✓ 今日達標' : `${Math.round(totalPct)}%`}
                      {!allDone && endDateStr && <span className="text-gray-700 ml-1">· {endDateStr}</span>}
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
