'use client'

import { useState, useEffect, useCallback } from 'react'

interface GoalData {
  goals: { theme: string; weeklyGoal: number; targetDays: number | null }[]
  maxByTheme: { theme: string; count: number }[]
}

interface Props {
  onClose: () => void
}

export default function GoalModal({ onClose }: Props) {
  const [data, setData] = useState<GoalData | null>(null)
  const [counts, setCounts] = useState<Record<string, string>>({})
  const [days, setDays] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState<Record<string, boolean>>({})

  const load = useCallback(async () => {
    const res = await fetch('/api/goals')
    const json = await res.json() as GoalData
    setData(json)
    const initCounts: Record<string, string> = {}
    const initDays: Record<string, string> = {}
    for (const g of json.goals) {
      initCounts[g.theme] = String(g.weeklyGoal)
      initDays[g.theme] = g.targetDays != null ? String(g.targetDays) : ''
    }
    setCounts(initCounts)
    setDays(initDays)
  }, [])

  useEffect(() => { void load() }, [load])

  async function save(theme: string) {
    const val = parseInt(counts[theme] ?? '0', 10)
    const daysVal = days[theme] ? parseInt(days[theme], 10) : undefined

    if (isNaN(val) || val < 0) {
      setErrors(e => ({ ...e, [theme]: '請輸入有效題數' }))
      return
    }
    if (daysVal !== undefined && (isNaN(daysVal) || daysVal < 1)) {
      setErrors(e => ({ ...e, [theme]: '目標天數至少為 1' }))
      return
    }
    const max = data?.maxByTheme.find(m => m.theme === theme)?.count ?? 0
    if (val > max) {
      setErrors(e => ({ ...e, [theme]: `不能超過現有主題數（${max} 道）` }))
      return
    }
    setErrors(e => ({ ...e, [theme]: '' }))
    setSaving(s => ({ ...s, [theme]: true }))
    const res = await fetch('/api/goals', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme, weeklyGoal: val, targetDays: daysVal }),
    })
    const json = await res.json() as { ok?: boolean; error?: string }
    setSaving(s => ({ ...s, [theme]: false }))
    if (json.error) {
      setErrors(e => ({ ...e, [theme]: json.error! }))
    } else {
      setSaved(s => ({ ...s, [theme]: true }))
      setTimeout(() => setSaved(s => ({ ...s, [theme]: false })), 2000)
      window.dispatchEvent(new Event('progress-updated'))
    }
  }

  const themes = data?.maxByTheme.map(m => m.theme) ?? []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 text-xl leading-none">×</button>
        <h2 className="text-lg font-bold text-gray-100 mb-1">🎯 練習目標設定</h2>
        <p className="text-sm text-gray-500 mb-6">設定想完成的題數與目標天數，每日建議量 = 目標題數 ÷ 天數</p>

        {!data ? (
          <div className="space-y-5 animate-pulse">
            {[0, 1].map(i => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <div className="space-y-1.5">
                    <div className="h-4 w-20 bg-gray-800 rounded" />
                    <div className="h-3 w-36 bg-gray-800 rounded" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-9 bg-gray-800 rounded-lg" />
                    <div className="w-14 h-9 bg-gray-800 rounded-lg" />
                  </div>
                </div>
                <div className="h-2 bg-gray-800 rounded-full mt-3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {themes.map(theme => {
              const max = data.maxByTheme.find(m => m.theme === theme)?.count ?? 0
              const countVal = parseInt(counts[theme] ?? '0', 10)
              const daysVal = days[theme] ? parseInt(days[theme], 10) : null
              const dailyRate = (!isNaN(countVal) && countVal > 0 && daysVal && daysVal > 0)
                ? (countVal / daysVal).toFixed(1)
                : null

              return (
                <div key={theme}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-gray-200">{theme}</p>
                    <p className="text-xs text-gray-600">現有 {max} 道主題</p>
                  </div>

                  {/* Count + Days inputs */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 mb-1 block">目標題數</label>
                      <input
                        type="number"
                        min={0}
                        max={max}
                        value={counts[theme] ?? '0'}
                        onChange={e => {
                          setCounts(i => ({ ...i, [theme]: e.target.value }))
                          setErrors(err => ({ ...err, [theme]: '' }))
                          setSaved(s => ({ ...s, [theme]: false }))
                        }}
                        className="w-full bg-gray-800 border border-gray-700 text-gray-100 text-sm rounded-lg px-3 py-1.5 text-center focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 mb-1 block">目標天數</label>
                      <input
                        type="number"
                        min={1}
                        value={days[theme] ?? ''}
                        placeholder="天"
                        onChange={e => {
                          setDays(d => ({ ...d, [theme]: e.target.value }))
                          setErrors(err => ({ ...err, [theme]: '' }))
                          setSaved(s => ({ ...s, [theme]: false }))
                        }}
                        className="w-full bg-gray-800 border border-gray-700 text-gray-100 text-sm rounded-lg px-3 py-1.5 text-center focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="self-end">
                      <button
                        onClick={() => save(theme)}
                        disabled={saving[theme]}
                        className="text-sm bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold px-3 py-1.5 rounded-lg transition"
                      >
                        {saving[theme] ? '...' : saved[theme] ? '✓' : '儲存'}
                      </button>
                    </div>
                  </div>

                  {/* Slider for count */}
                  <input
                    type="range"
                    min={0}
                    max={max}
                    value={isNaN(countVal) ? 0 : Math.min(countVal, max)}
                    onChange={e => {
                      setCounts(i => ({ ...i, [theme]: e.target.value }))
                      setErrors(err => ({ ...err, [theme]: '' }))
                      setSaved(s => ({ ...s, [theme]: false }))
                    }}
                    className="w-full accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-gray-700 mt-0.5 mb-1">
                    <span>0</span>
                    <span>{max} 道（上限）</span>
                  </div>

                  {dailyRate && (
                    <p className="text-xs text-blue-400">每日建議 {dailyRate} 題</p>
                  )}
                  {errors[theme] && (
                    <p className="text-xs text-red-400 mt-1">{errors[theme]}</p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
