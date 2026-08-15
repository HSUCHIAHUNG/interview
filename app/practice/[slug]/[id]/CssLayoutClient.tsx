'use client'

import { useState, useRef, useEffect } from 'react'
import type { CssLayoutEntry, CssProblem } from '@/lib/css-layout-challenges'

interface TestResult {
  label: string
  passed: boolean
  error: string | null
}

interface NavItem { id: string; title: string }
interface StarredNavItem { topicSlug: string; id: string; title: string }

interface Props {
  entry: CssLayoutEntry
  problem: CssProblem
  topicSlug: string
  isLoggedIn: boolean
  initialCompleted: boolean
  initialStarred?: boolean
  prevProblem: NavItem | null
  nextProblem: NavItem | null
  starredPrev?: StarredNavItem | null
  starredNext?: StarredNavItem | null
}

function buildDoc(html: string, css: string): string {
  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<script src="https://cdn.tailwindcss.com"><\/script>
<style>
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; padding: 16px; font-family: ui-sans-serif, system-ui, sans-serif; }
${css}
</style>
</head>
<body>${html}</body>
</html>`
}

export default function CssLayoutClient({
  entry,
  problem,
  topicSlug,
  isLoggedIn,
  initialCompleted,
  initialStarred = false,
  prevProblem,
  nextProblem,
  starredPrev = null,
  starredNext = null,
}: Props) {
  const [htmlCode, setHtmlCode] = useState(problem.initialHtml)
  const [cssCode, setCssCode] = useState(problem.initialCss)
  const [activeTab, setActiveTab] = useState<'html' | 'css'>('html')
  const [results, setResults] = useState<TestResult[] | null>(null)
  const [completed, setCompleted] = useState(initialCompleted)
  const [saving, setSaving] = useState(false)
  const [starred, setStarred] = useState(initialStarred)
  const [showHints, setShowHints] = useState(false)
  const [showTarget, setShowTarget] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  function writeToIframe(html: string, css: string) {
    const iframe = iframeRef.current
    if (!iframe) return
    const doc = iframe.contentDocument
    if (!doc) return
    doc.open()
    doc.write(buildDoc(html, css))
    doc.close()
  }

  useEffect(() => {
    writeToIframe(htmlCode, cssCode)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    clearTimeout(debounceRef.current)
    if (showTarget && problem.targetHtml) {
      writeToIframe(problem.targetHtml, problem.targetCss ?? '')
    } else {
      debounceRef.current = setTimeout(() => writeToIframe(htmlCode, cssCode), 400)
    }
    return () => clearTimeout(debounceRef.current)
  }, [htmlCode, cssCode, showTarget])

  async function toggleStar() {
    setStarred(s => !s)
    await fetch('/api/starred-problems', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topicSlug, problemId: problem.id }),
    })
  }

  async function runTests() {
    writeToIframe(htmlCode, cssCode)
    await new Promise(r => setTimeout(r, 300))

    const iframe = iframeRef.current
    if (!iframe?.contentDocument || !iframe?.contentWindow) return
    const doc = iframe.contentDocument
    const win = iframe.contentWindow

    const testResults: TestResult[] = problem.testCases.map(tc => {
      try {
        // eslint-disable-next-line no-new-func
        const fn = new Function('doc', 'win', tc.test)
        const passed = fn(doc, win) === true
        return { label: tc.label, passed, error: null }
      } catch (e) {
        return { label: tc.label, passed: false, error: (e as Error).message }
      }
    })

    setResults(testResults)

    const allPassed = testResults.every(r => r.passed)
    if (allPassed && !completed && isLoggedIn) {
      setSaving(true)
      await fetch('/api/practice/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicSlug, problemId: problem.id }),
      })
      setCompleted(true)
      setSaving(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== 'Tab') return
    e.preventDefault()
    const ta = e.currentTarget
    const start = ta.selectionStart
    const val = ta.value
    const newVal = val.substring(0, start) + '  ' + val.substring(ta.selectionEnd)
    if (activeTab === 'html') setHtmlCode(newVal)
    else setCssCode(newVal)
    requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = start + 2 })
  }

  const allPassed = results?.every(r => r.passed) ?? false

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
      {/* ── Left: description + editor + tests ── */}
      <div className="flex flex-col gap-4">

        {/* Description + requirements */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-sm text-gray-300 leading-relaxed mb-4">{problem.description}</p>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">需求清單</p>
          <ul className="space-y-2">
            {problem.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-gray-600 shrink-0 font-mono pt-0.5">{i + 1}.</span>
                <code className="text-blue-300 bg-gray-800 px-2 py-0.5 rounded text-xs leading-relaxed">{req}</code>
              </li>
            ))}
          </ul>
        </div>

        {/* Code editor */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex flex-col">
          <div className="flex items-center border-b border-gray-800 bg-gray-950">
            {(['html', 'css'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-xs font-semibold tracking-wide transition border-b-2 ${
                  activeTab === tab
                    ? 'text-white border-blue-500'
                    : 'text-gray-500 hover:text-gray-300 border-transparent'
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
            <div className="flex-1" />
            <span className="text-xs text-gray-700 pr-3">支援 Tailwind</span>
          </div>
          <textarea
            key={activeTab}
            value={activeTab === 'html' ? htmlCode : cssCode}
            onChange={e => activeTab === 'html' ? setHtmlCode(e.target.value) : setCssCode(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={14}
            className="w-full bg-gray-900 text-gray-200 font-mono text-sm p-4 resize-y focus:outline-none leading-6"
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={runTests}
            disabled={saving}
            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl transition text-sm"
          >
            {saving ? '儲存中...' : '執行測試'}
          </button>
          {problem.hints && (
            <button
              onClick={() => setShowHints(s => !s)}
              className={`px-4 py-2.5 text-xs rounded-xl border transition ${
                showHints
                  ? 'border-amber-700 text-amber-400 bg-amber-900/20'
                  : 'border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300'
              }`}
            >
              提示
            </button>
          )}
          <button
            onClick={toggleStar}
            title={starred ? '取消必考題' : '加入必考題'}
            className={`px-4 py-2.5 text-xl rounded-xl border transition ${
              starred
                ? 'text-yellow-400 border-yellow-800 bg-yellow-900/20'
                : 'text-gray-600 border-gray-800 hover:text-yellow-400 hover:border-yellow-800'
            }`}
          >★</button>
        </div>

        {/* Hints */}
        {showHints && problem.hints && (
          <div className="bg-amber-900/20 border border-amber-800/50 rounded-xl p-4 space-y-1.5">
            {problem.hints.map((hint, i) => (
              <p key={i} className="text-sm text-amber-300 flex gap-2">
                <span className="shrink-0">💡</span>{hint}
              </p>
            ))}
          </div>
        )}

        {/* Test results */}
        {results && (
          <div className="space-y-2">
            {allPassed && (
              <div className="bg-emerald-900/20 border border-emerald-800 rounded-xl px-4 py-3 text-sm text-emerald-300 font-semibold">
                ✓ 所有測試通過{!completed ? '，已自動標記完成！' : ''}
              </div>
            )}
            {results.map((r, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm ${
                  r.passed
                    ? 'bg-green-900/20 border-green-800/50 text-green-300'
                    : 'bg-red-900/20 border-red-800/50 text-red-300'
                }`}
              >
                <span className="shrink-0 font-bold">{r.passed ? '✓' : '✗'}</span>
                <div>
                  <p>{r.label}</p>
                  {r.error && <p className="text-xs opacity-60 mt-0.5 font-mono">{r.error}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between gap-2 pt-2 border-t border-gray-800">
          {prevProblem
            ? <a href={`/practice/${topicSlug}/${prevProblem.id}`} className="text-xs text-gray-500 hover:text-gray-300 transition">← {prevProblem.title}</a>
            : <div />}
          {nextProblem
            ? <a href={`/practice/${topicSlug}/${nextProblem.id}`} className="text-xs text-gray-500 hover:text-gray-300 transition">{nextProblem.title} →</a>
            : <div />}
        </div>
      </div>

      {/* ── Right: live preview ── */}
      <div className="lg:sticky lg:top-4 lg:self-start">
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
            <span className="text-xs font-medium text-gray-400">
              {showTarget ? '目標設計' : '即時預覽'}
            </span>
            <div className="flex items-center gap-3">
              {problem.targetHtml && (
                <button
                  onClick={() => setShowTarget(s => !s)}
                  className={`text-xs px-2.5 py-0.5 rounded border transition ${
                    showTarget
                      ? 'border-amber-700 text-amber-400 bg-amber-900/20'
                      : 'border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300'
                  }`}
                >
                  {showTarget ? '← 我的結果' : '查看目標'}
                </button>
              )}
              {completed && <span className="text-xs text-emerald-500 font-medium">✓ 已完成</span>}
              {!showTarget && <span className="text-xs text-gray-700">自動更新</span>}
            </div>
          </div>
          <iframe
            ref={iframeRef}
            className="w-full bg-white"
            style={{ height: '480px' }}
            title="CSS 切版預覽"
          />
        </div>
      </div>
    </div>
  )
}
