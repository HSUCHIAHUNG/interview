'use client'

import { useState, useRef } from 'react'
import type { MethodEntry } from '@/lib/array-challenges'

interface TestResult {
  label: string
  passed: boolean
  error: string | null
}

interface Props {
  entry: MethodEntry
}

export default function PracticeClient({ entry }: Props) {
  const { challenge } = entry
  const [code, setCode] = useState(challenge.initialCode)
  const [results, setResults] = useState<TestResult[] | null>(null)
  const [runtimeError, setRuntimeError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const allPassed = results !== null && results.every(r => r.passed)
  const passCount = results?.filter(r => r.passed).length ?? 0

  function runTests() {
    setRuntimeError(null)
    const testResults: TestResult[] = challenge.testCases.map(tc => {
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

  function resetCode() {
    setCode(challenge.initialCode)
    setResults(null)
    setRuntimeError(null)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Tab') {
      e.preventDefault()
      const el = e.currentTarget
      const start = el.selectionStart
      const end = el.selectionEnd
      const next = code.substring(0, start) + '  ' + code.substring(end)
      setCode(next)
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 2
      })
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Problem description */}
      <div className="flex flex-col gap-4">
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <h2 className="text-lg font-bold text-gray-100 mb-3">{challenge.title}</h2>
          <div className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">
            {challenge.description}
          </div>
        </div>

        {/* Test cases preview */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">測試項目</h3>
          <ul className="space-y-2">
            {challenge.testCases.map((tc, i) => {
              const result = results?.[i]
              return (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <span className={`shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    result == null
                      ? 'bg-gray-800 text-gray-600'
                      : result.passed
                        ? 'bg-green-900/60 text-green-400'
                        : 'bg-red-900/60 text-red-400'
                  }`}>
                    {result == null ? i + 1 : result.passed ? '✓' : '✗'}
                  </span>
                  <div>
                    <span className={result == null ? 'text-gray-500' : result.passed ? 'text-green-400' : 'text-red-400'}>
                      {tc.label}
                    </span>
                    {result?.error && (
                      <p className="text-red-500 text-xs mt-0.5 font-mono">{result.error}</p>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>

          {results !== null && (
            <div className={`mt-4 pt-4 border-t border-gray-800 text-sm font-semibold ${
              allPassed ? 'text-green-400' : 'text-yellow-400'
            }`}>
              {allPassed
                ? '🎉 全部通過！'
                : `${passCount} / ${results.length} 通過`}
            </div>
          )}
        </div>
      </div>

      {/* Right: Code editor */}
      <div className="flex flex-col gap-4">
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800">
            <span className="text-xs text-gray-500 font-mono">JavaScript</span>
            <button
              onClick={resetCode}
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
            className="w-full bg-transparent text-gray-200 font-mono text-sm p-4 resize-none focus:outline-none leading-relaxed"
            style={{ minHeight: '420px', tabSize: 2 }}
          />
        </div>

        {runtimeError && (
          <div className="bg-red-950/40 border border-red-800 rounded-xl p-3 text-sm text-red-400 font-mono">
            {runtimeError}
          </div>
        )}

        <button
          onClick={runTests}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition"
        >
          執行測試
        </button>
      </div>
    </div>
  )
}
