'use client'

import { useState, useEffect, useCallback } from 'react'

interface GoalData {
  goals: { theme: string; weeklyGoal: number }[]
  maxByTheme: { theme: string; count: number }[]
}

interface Props {
  onClose: () => void
}

export default function GoalModal({ onClose }: Props) {
  const [data, setData] = useState<GoalData | null>(null)
  const [inputs, setInputs] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState<Record<string, boolean>>({})

  const load = useCallback(async () => {
    const res = await fetch('/api/goals')
    const json = await res.json() as GoalData
    setData(json)
    const init: Record<string, string> = {}
    for (const g of json.goals) init[g.theme] = String(g.weeklyGoal)
    setInputs(init)
  }, [])

  useEffect(() => { void load() }, [load])

  async function save(theme: string) {
    const val = parseInt(inputs[theme] ?? '0', 10)
    if (isNaN(val) || val < 0) {
      setErrors(e => ({ ...e, [theme]: '請輸入有效數字' }))
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
      body: JSON.stringify({ theme, weeklyGoal: val }),
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
        <h2 className="text-lg font-bold text-gray-100 mb-1">🎯 每週練習目標</h2>
        <p className="text-sm text-gray-500 mb-6">設定每週想完成的題數，每天建議量 = 週目標 ÷ 7</p>

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
                <div className="flex justify-between mt-1">
                  <div className="h-3 w-4 bg-gray-800 rounded" />
                  <div className="h-3 w-20 bg-gray-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-5">
            {themes.map(theme => {
              const max = data.maxByTheme.find(m => m.theme === theme)?.count ?? 0
              const current = data.goals.find(g => g.theme === theme)?.weeklyGoal ?? 0
              const dailyTarget = current > 0 ? Math.ceil(current / 7) : null
              const val = parseInt(inputs[theme] ?? '0', 10)
              const inputMax = max

              return (
                <div key={theme}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-200">{theme}</p>
                      <p className="text-xs text-gray-600">現有 {max} 道主題{dailyTarget ? `・每日建議 ${dailyTarget} 題` : ''}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        max={inputMax}
                        value={inputs[theme] ?? '0'}
                        onChange={e => {
                          setInputs(i => ({ ...i, [theme]: e.target.value }))
                          setErrors(err => ({ ...err, [theme]: '' }))
                          setSaved(s => ({ ...s, [theme]: false }))
                        }}
                        className="w-20 bg-gray-800 border border-gray-700 text-gray-100 text-sm rounded-lg px-3 py-1.5 text-center focus:outline-none focus:border-blue-500"
                      />
                      <button
                        onClick={() => save(theme)}
                        disabled={saving[theme]}
                        className="text-sm bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold px-3 py-1.5 rounded-lg transition"
                      >
                        {saving[theme] ? '...' : saved[theme] ? '✓' : '儲存'}
                      </button>
                    </div>
                  </div>
                  {/* Range hint */}
                  <input
                    type="range"
                    min={0}
                    max={inputMax}
                    value={isNaN(val) ? 0 : Math.min(val, inputMax)}
                    onChange={e => {
                      setInputs(i => ({ ...i, [theme]: e.target.value }))
                      setErrors(err => ({ ...err, [theme]: '' }))
                      setSaved(s => ({ ...s, [theme]: false }))
                    }}
                    className="w-full accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-gray-700 mt-0.5">
                    <span>0</span>
                    <span>{max} 道主題（上限）</span>
                  </div>
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
