'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import type { MethodEntry, Problem } from '@/lib/array-challenges'

interface TestResult {
  label: string
  passed: boolean
  error: string | null
}

interface NavItem {
  id: string
  title: string
}

interface Props {
  entry: MethodEntry
  problem: Problem
  topicSlug: string
  isLoggedIn: boolean
  initialCompleted: boolean
  initialStarred?: boolean
  prevProblem: NavItem | null
  nextProblem: NavItem | null
}

export default function PracticeClient({
  entry,
  problem,
  topicSlug,
  isLoggedIn,
  initialCompleted,
  initialStarred = false,
  prevProblem,
  nextProblem,
}: Props) {
  const [code, setCode] = useState(problem.initialCode)
  const [results, setResults] = useState<TestResult[] | null>(null)
  const [completed, setCompleted] = useState(initialCompleted)
  const [saving, setSaving] = useState(false)
  const [starred, setStarred] = useState(initialStarred)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  async function toggleStar() {
    const next = !starred
    setStarred(next)
    fetch('/api/starred-problems', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topicSlug, problemId: problem.id }),
    }).catch(() => {})
  }

  useEffect(() => {
    setCode(problem.initialCode)
    setResults(null)
  }, [problem.id, problem.initialCode])

  const allPassed = results !== null && results.every(r => r.passed)
  const passCount = results?.filter(r => r.passed).length ?? 0

  async function runTests() {
    const testResults: TestResult[] = problem.testCases.map(tc => {
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

    const justPassed = testResults.every(r => r.passed)
    if (justPassed && !completed && isLoggedIn) {
      setSaving(true)
      try {
        await fetch('/api/practice/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topicSlug, problemId: problem.id }),
        })
        setCompleted(true)
      } finally {
        setSaving(false)
      }
    }
  }

  function resetCode() {
    setCode(problem.initialCode)
    setResults(null)
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
          {isLoggedIn && (
            <div className="flex justify-end mb-3">
              <button
                onClick={toggleStar}
                title={starred ? '取消必考題' : '加入必考題'}
                className={`text-xl transition ${starred ? 'text-yellow-400' : 'text-gray-700 hover:text-yellow-400'}`}
              >
                {starred ? '★' : '☆'}
              </button>
            </div>
          )}
          <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">
            {problem.description}
          </p>

          {problem.examples && problem.examples.length > 0 && (
            <div className="mt-4 space-y-3">
              {problem.examples.map((ex, i) => (
                <div key={i} className="bg-gray-950 rounded-lg p-3 text-xs font-mono">
                  <div className="text-gray-500 mb-1">範例 {i + 1}</div>
                  <div className="text-gray-400"><span className="text-gray-600">輸入：</span>{ex.input}</div>
                  <div className="text-gray-400"><span className="text-gray-600">輸出：</span>{ex.output}</div>
                  {ex.note && <div className="text-gray-500 mt-1">{ex.note}</div>}
                </div>
              ))}
            </div>
          )}

          {problem.constraints && problem.constraints.length > 0 && (
            <div className="mt-4">
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">限制條件</div>
              <ul className="space-y-1">
                {problem.constraints.map((c, i) => (
                  <li key={i} className="text-xs text-gray-500 flex gap-1.5">
                    <span className="text-gray-700">•</span> {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Test cases */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">測試案例</h3>
          <ul className="space-y-2">
            {problem.testCases.map((tc, i) => {
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
                  <div className="min-w-0">
                    <span className={result == null ? 'text-gray-500' : result.passed ? 'text-green-400' : 'text-red-400'}>
                      {tc.label}
                    </span>
                    {result?.error && (
                      <p className="text-red-500 text-xs mt-0.5 font-mono break-all">{result.error}</p>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>

          {results !== null && (
            <div className={`mt-4 pt-4 border-t border-gray-800 text-sm font-semibold ${
              allPassed ? 'text-emerald-400' : 'text-yellow-400'
            }`}>
              {allPassed
                ? (completed ? '✓ 已儲存進度！' : saving ? '儲存中...' : '🎉 全部通過！')
                : `${passCount} / ${results.length} 通過`}
            </div>
          )}

          {allPassed && !isLoggedIn && (
            <p className="mt-2 text-xs text-gray-600">
              <Link href="/sign-in" className="text-blue-400 hover:text-blue-300">登入</Link>
              {' '}後可儲存進度
            </p>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {prevProblem ? (
            <Link
              href={`/practice/${topicSlug}/${prevProblem.id}`}
              className="flex-1 text-center text-sm text-gray-500 hover:text-gray-300 border border-gray-800 hover:border-gray-700 py-2.5 rounded-xl transition"
            >
              ← {prevProblem.title}
            </Link>
          ) : (
            <Link
              href={`/practice/${topicSlug}`}
              className="flex-1 text-center text-sm text-gray-500 hover:text-gray-300 border border-gray-800 hover:border-gray-700 py-2.5 rounded-xl transition"
            >
              ← 返回題目列表
            </Link>
          )}
          {nextProblem && (
            <Link
              href={`/practice/${topicSlug}/${nextProblem.id}`}
              className="flex-1 text-center text-sm text-emerald-500 hover:text-emerald-400 border border-emerald-800/50 hover:border-emerald-700 py-2.5 rounded-xl transition"
            >
              {nextProblem.title} →
            </Link>
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
