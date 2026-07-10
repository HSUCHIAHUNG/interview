'use client'

import { useState, useEffect, useRef } from 'react'
import type { MethodEntry, Problem } from '@/lib/array-challenges'

interface PracticeItem {
  slug: string
  methodName: string
  entry: MethodEntry
  problem: Problem
}

interface TestResult {
  label: string
  passed: boolean
  error: string | null
}

const DIFFICULTY_COLOR = {
  easy: 'bg-green-900/40 text-green-400',
  medium: 'bg-yellow-900/40 text-yellow-400',
  hard: 'bg-red-900/40 text-red-400',
}
const DIFFICULTY_LABEL = { easy: '入門', medium: '中級', hard: '進階' }

interface Props {
  problems: PracticeItem[]
  onBack: () => void
}

export default function RandomPracticeSession({ problems, onBack }: Props) {
  const [current, setCurrent] = useState(0)
  const [code, setCode] = useState(problems[0]?.problem.initialCode ?? '')
  const [results, setResults] = useState<TestResult[] | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const item = problems[current]

  useEffect(() => {
    setCode(item.problem.initialCode)
    setResults(null)
  }, [current, item.problem.initialCode])

  function runTests() {
    const testResults: TestResult[] = item.problem.testCases.map(tc => {
      try {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}\n${tc.test}`)
        const passed = fn() === true
        return { label: tc.label, passed, error: null }
      } catch (e) {
        return { label: tc.label, passed: false, error: (e as Error).message }
      }
    })
    setResults(testResults)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Tab') {
      e.preventDefault()
      const el = e.currentTarget
      const start = el.selectionStart
      const end = el.selectionEnd
      const next = code.substring(0, start) + '  ' + code.substring(end)
      setCode(next)
      requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = start + 2 })
    }
  }

  const allPassed = results !== null && results.every(r => r.passed)
  const passCount = results?.filter(r => r.passed).length ?? 0

  return (
    <div className="max-w-5xl mx-auto">
      {/* Top nav */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-gray-300 transition"
        >
          ← 回選題
        </button>
        <span className="text-sm text-gray-500">{current + 1} / {problems.length}</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
          style={{ width: `${((current + 1) / problems.length) * 100}%` }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Problem */}
        <div className="flex flex-col gap-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono text-gray-500">{item.methodName}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DIFFICULTY_COLOR[item.problem.difficulty]}`}>
                {DIFFICULTY_LABEL[item.problem.difficulty]}
              </span>
            </div>
            <h2 className="text-base font-bold text-gray-100 mb-3">{item.problem.title}</h2>
            <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">
              {item.problem.description}
            </p>

            {item.problem.examples && item.problem.examples.length > 0 && (
              <div className="mt-4 space-y-3">
                {item.problem.examples.map((ex, i) => (
                  <div key={i} className="bg-gray-950 rounded-lg p-3 text-xs font-mono">
                    <div className="text-gray-500 mb-1">範例 {i + 1}</div>
                    <div className="text-gray-400"><span className="text-gray-600">輸入：</span>{ex.input}</div>
                    <div className="text-gray-400"><span className="text-gray-600">輸出：</span>{ex.output}</div>
                    {ex.note && <div className="text-gray-500 mt-1">{ex.note}</div>}
                  </div>
                ))}
              </div>
            )}

            {item.problem.constraints && item.problem.constraints.length > 0 && (
              <div className="mt-4">
                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">限制條件</div>
                <ul className="space-y-1">
                  {item.problem.constraints.map((c, i) => (
                    <li key={i} className="text-xs text-gray-500 flex gap-1.5">
                      <span className="text-gray-700">•</span> {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Test results */}
          {results && (
            <div className={`rounded-2xl border p-4 ${allPassed ? 'bg-green-900/20 border-green-700' : 'bg-red-900/20 border-red-800'}`}>
              <p className={`text-sm font-semibold mb-3 ${allPassed ? 'text-green-400' : 'text-red-400'}`}>
                {allPassed ? '✅ 全部通過！' : `❌ 通過 ${passCount} / ${results.length}`}
              </p>
              <div className="space-y-2">
                {results.map((r, i) => (
                  <div key={i} className={`text-xs rounded-lg px-3 py-2 font-mono ${r.passed ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                    <span className="mr-2">{r.passed ? '✓' : '✗'}</span>
                    {r.label}
                    {r.error && <div className="mt-1 text-red-500 text-xs">{r.error}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Code editor */}
        <div className="flex flex-col gap-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800">
              <span className="text-xs text-gray-600 font-mono">JavaScript</span>
              <button
                onClick={() => { setCode(item.problem.initialCode); setResults(null) }}
                className="text-xs text-gray-600 hover:text-gray-400 transition"
              >
                重置
              </button>
            </div>
            <textarea
              ref={textareaRef}
              value={code}
              onChange={e => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              className="w-full bg-transparent text-sm text-gray-300 font-mono p-4 resize-none focus:outline-none leading-relaxed"
              rows={18}
            />
          </div>

          <button
            onClick={runTests}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition"
          >
            ▶ 執行測試
          </button>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setCurrent(i => i - 1)}
          disabled={current === 0}
          className="text-sm text-gray-500 hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          ← 上一題
        </button>
        {current < problems.length - 1 ? (
          <button
            onClick={() => setCurrent(i => i + 1)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-5 py-2 rounded-lg transition"
          >
            下一題 →
          </button>
        ) : (
          <button
            onClick={onBack}
            className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold px-5 py-2 rounded-lg transition"
          >
            完成練習
          </button>
        )}
      </div>
    </div>
  )
}
