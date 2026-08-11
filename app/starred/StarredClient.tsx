'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useWindowVirtualizer } from '@tanstack/react-virtual'
import type { StarredQuestion } from '@/lib/db/queries'
import type { StarredProblemItem } from './types'

type Tab = 'quiz' | 'qa' | 'practice'

// ── localStorage utilities ────────────────────────────────────────────────────

const LS_REVIEWED = 'starred_reviewed'
const LS_REVIEW_COUNTS = 'starred_review_counts'
const LS_RESET_DAYS = 'starred_review_reset_days'
const LS_PRACTICE_REVIEWED = 'starred_practice_reviewed'
const LS_PRACTICE_REVIEW_COUNTS = 'starred_practice_review_counts'

function loadReviewedMap(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(LS_REVIEWED) ?? '{}') } catch { return {} }
}
function saveReviewedMap(map: Record<string, string>) {
  localStorage.setItem(LS_REVIEWED, JSON.stringify(map))
}
function incTodayReviewCount(questionId: number, prevMap: Record<string, string>) {
  const today = new Date().toISOString().split('T')[0]
  if (prevMap[String(questionId)]?.startsWith(today)) return
  try {
    const counts: Record<string, number> = JSON.parse(localStorage.getItem(LS_REVIEW_COUNTS) ?? '{}')
    counts[today] = (counts[today] ?? 0) + 1
    localStorage.setItem(LS_REVIEW_COUNTS, JSON.stringify(counts))
  } catch {}
}

function loadPracticeReviewedMap(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(LS_PRACTICE_REVIEWED) ?? '{}') } catch { return {} }
}
function savePracticeReviewedMap(map: Record<string, string>) {
  localStorage.setItem(LS_PRACTICE_REVIEWED, JSON.stringify(map))
}
function incTodayPracticeReviewCount(key: string, prevMap: Record<string, string>) {
  const today = new Date().toISOString().split('T')[0]
  if (prevMap[key]?.startsWith(today)) return
  try {
    const counts: Record<string, number> = JSON.parse(localStorage.getItem(LS_PRACTICE_REVIEW_COUNTS) ?? '{}')
    counts[today] = (counts[today] ?? 0) + 1
    localStorage.setItem(LS_PRACTICE_REVIEW_COUNTS, JSON.stringify(counts))
  } catch {}
}

const RESET_OPTIONS = [
  { days: 1, label: '每天' },
  { days: 3, label: '3 天' },
  { days: 7, label: '每週' },
  { days: 14, label: '2 週' },
  { days: 30, label: '每月' },
  { days: 0, label: '永不重置' },
]

// ── Flat list types ───────────────────────────────────────────────────────────

type QuestionFlatItem =
  | { kind: 'header'; topicSlug: string; topicTitle: string; theme: string; count: number }
  | { kind: 'card'; q: StarredQuestion; idx: number }

type ProblemFlatItem =
  | { kind: 'header'; topicSlug: string; topicTitle: string; theme: string; count: number }
  | { kind: 'card'; p: StarredProblemItem }

function buildQuestionFlat(questions: StarredQuestion[]): QuestionFlatItem[] {
  const grouped: Record<string, { topicTitle: string; theme: string; items: StarredQuestion[] }> = {}
  for (const q of questions) {
    if (!grouped[q.topicSlug]) grouped[q.topicSlug] = { topicTitle: q.topicTitle, theme: q.theme, items: [] }
    grouped[q.topicSlug].items.push(q)
  }
  const flat: QuestionFlatItem[] = []
  for (const [slug, g] of Object.entries(grouped)) {
    flat.push({ kind: 'header', topicSlug: slug, topicTitle: g.topicTitle, theme: g.theme, count: g.items.length })
    g.items.forEach((q, idx) => flat.push({ kind: 'card', q, idx }))
  }
  return flat
}

function buildProblemFlat(problems: StarredProblemItem[]): ProblemFlatItem[] {
  const grouped: Record<string, { topicTitle: string; theme: string; items: StarredProblemItem[] }> = {}
  for (const p of problems) {
    if (!grouped[p.topicSlug]) grouped[p.topicSlug] = { topicTitle: p.topicTitle, theme: p.theme, items: [] }
    grouped[p.topicSlug].items.push(p)
  }
  const flat: ProblemFlatItem[] = []
  for (const [slug, g] of Object.entries(grouped)) {
    flat.push({ kind: 'header', topicSlug: slug, topicTitle: g.topicTitle, theme: g.theme, count: g.items.length })
    g.items.forEach(p => flat.push({ kind: 'card', p }))
  }
  return flat
}

// ── Main component ────────────────────────────────────────────────────────────

export default function StarredClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [tab, setTab] = useState<Tab>(() => {
    const t = searchParams.get('tab')
    return t === 'quiz' || t === 'qa' || t === 'practice' ? t : 'quiz'
  })

  const [problemsCount, setProblemsCount] = useState<number | null>(null)

  const [questions, setQuestions] = useState<StarredQuestion[]>([])
  const [qLoading, setQLoading] = useState(false)
  const qFetched = useRef(false)

  const [problems, setProblems] = useState<StarredProblemItem[]>([])
  const [pLoading, setPLoading] = useState(false)
  const pFetched = useRef(false)

  // Reviewed state (localStorage)
  const [reviewedMap, setReviewedMap] = useState<Record<string, string>>({})
  const [practiceReviewedMap, setPracticeReviewedMap] = useState<Record<string, string>>({})
  const [resetDays, setResetDays] = useState<number>(7)

  // Theme filter (applies to all tabs)
  const [themeFilter, setThemeFilter] = useState<string | null>(null)

  useEffect(() => {
    setReviewedMap(loadReviewedMap())
    setPracticeReviewedMap(loadPracticeReviewedMap())
    const saved = localStorage.getItem(LS_RESET_DAYS)
    if (saved !== null) setResetDays(Number(saved))
  }, [])

  function markReviewed(questionId: number) {
    const prev = reviewedMap
    incTodayReviewCount(questionId, prev)
    const next = { ...prev, [String(questionId)]: new Date().toISOString() }
    setReviewedMap(next)
    saveReviewedMap(next)
  }

  function isItemReviewed(questionId: number): boolean {
    const reviewedAt = reviewedMap[String(questionId)]
    if (!reviewedAt) return false
    if (resetDays === 0) return true
    return new Date(reviewedAt).getTime() > Date.now() - resetDays * 86400000
  }

  function isPracticeReviewed(key: string): boolean {
    const reviewedAt = practiceReviewedMap[key]
    if (!reviewedAt) return false
    if (resetDays === 0) return true
    return new Date(reviewedAt).getTime() > Date.now() - resetDays * 86400000
  }

  function markPracticeReviewed(key: string) {
    const prev = practiceReviewedMap
    incTodayPracticeReviewCount(key, prev)
    const next = { ...prev, [key]: new Date().toISOString() }
    setPracticeReviewedMap(next)
    savePracticeReviewedMap(next)
  }

  function unmarkPracticeReviewed(key: string) {
    const reviewedAt = practiceReviewedMap[key]
    const next = { ...practiceReviewedMap }
    delete next[key]
    setPracticeReviewedMap(next)
    savePracticeReviewedMap(next)
    if (reviewedAt) {
      const reviewDate = reviewedAt.split('T')[0]
      try {
        const counts: Record<string, number> = JSON.parse(localStorage.getItem(LS_PRACTICE_REVIEW_COUNTS) ?? '{}')
        if (counts[reviewDate] > 0) {
          counts[reviewDate] -= 1
          if (counts[reviewDate] === 0) delete counts[reviewDate]
          localStorage.setItem(LS_PRACTICE_REVIEW_COUNTS, JSON.stringify(counts))
        }
      } catch {}
    }
  }

  function togglePracticeReviewed(key: string) {
    if (isPracticeReviewed(key)) {
      unmarkPracticeReviewed(key)
    } else {
      markPracticeReviewed(key)
    }
  }

  function handleResetDaysChange(days: number) {
    setResetDays(days)
    localStorage.setItem(LS_RESET_DAYS, String(days))
  }

  async function loadQuestions() {
    if (qLoading) return
    setQLoading(true)
    try {
      const res = await fetch('/api/starred/list?type=questions')
      const data = await res.json()
      setQuestions(data.questions ?? [])
    } finally {
      setQLoading(false)
    }
  }

  async function loadProblems() {
    if (pLoading) return
    setPLoading(true)
    try {
      const res = await fetch('/api/starred/list?type=problems')
      const data = await res.json()
      setProblems(data.problems ?? [])
    } finally {
      setPLoading(false)
    }
  }

  useEffect(() => {
    fetch('/api/starred/count').then(r => r.json()).then((d: { problemsCount: number }) => setProblemsCount(d.problemsCount))
    if (!qFetched.current) { qFetched.current = true; loadQuestions() }
    if (!pFetched.current) { pFetched.current = true; loadProblems() }

    function refreshProblems() {
      fetch('/api/starred/count').then(r => r.json()).then((d: { problemsCount: number }) => setProblemsCount(d.problemsCount))
      loadProblems()
    }

    let bc: BroadcastChannel | null = null
    try {
      bc = new BroadcastChannel('starred-problems')
      bc.onmessage = () => refreshProblems()
    } catch { /* BroadcastChannel not supported */ }

    let visibilityTimer: ReturnType<typeof setTimeout> | null = null
    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        if (visibilityTimer) clearTimeout(visibilityTimer)
        visibilityTimer = setTimeout(refreshProblems, 500)
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      bc?.close()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (visibilityTimer) clearTimeout(visibilityTimer)
    }
  }, [])

  function handleTabChange(t: Tab) {
    setTab(t)
    router.replace(`/starred?tab=${t}`, { scroll: false })
  }

  async function unstarQuestion(questionId: number) {
    await fetch('/api/starred', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId }),
    })
    setQuestions(prev => prev.filter(q => q.questionId !== questionId))
  }

  async function unstarProblem(topicSlug: string, problemId: string) {
    await fetch('/api/starred-problems', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topicSlug, problemId }),
    })
    setProblems(prev => prev.filter(p => !(p.topicSlug === topicSlug && p.problemId === problemId)))
  }

  // All available themes from both questions and practice problems
  const allAvailableThemes = [...new Set([
    ...questions.map(q => q.theme),
    ...problems.map(p => p.theme).filter(t => t !== ''),
  ])].sort()

  // Apply theme filter
  const filteredQuestions = themeFilter
    ? questions.filter(q => q.theme === themeFilter)
    : questions

  const filteredProblems = themeFilter
    ? problems.filter(p => p.theme === themeFilter)
    : problems

  const quizQuestions = filteredQuestions.filter(q => q.options && q.options.length > 0)
  const qaQuestions = filteredQuestions

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'quiz', label: '選擇題', count: quizQuestions.length },
    { key: 'qa', label: '問答練習', count: qaQuestions.length },
    { key: 'practice', label: '實作題', count: themeFilter ? filteredProblems.length : (problemsCount ?? problems.length) },
  ]

  const quizFlat = buildQuestionFlat(quizQuestions)
  const qaFlat = buildQuestionFlat(qaQuestions)
  const problemFlat = buildProblemFlat(filteredProblems)

  const reviewedCount = filteredQuestions.filter(q => isItemReviewed(q.questionId)).length
  const totalQCount = filteredQuestions.length

  const practiceReviewedCount = filteredProblems.filter(p => isPracticeReviewed(`${p.topicSlug}-${p.problemId}`)).length
  const totalPCount = filteredProblems.length

  return (
    <div>
      {/* Reset interval setting */}
      <div className="mb-3 flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-600 shrink-0">重置週期：</span>
        {RESET_OPTIONS.map(opt => (
          <button
            key={opt.days}
            onClick={() => handleResetDaysChange(opt.days)}
            className={`text-xs px-2.5 py-1 rounded-lg border transition ${
              resetDays === opt.days
                ? 'border-blue-600 text-blue-400 bg-blue-900/20'
                : 'border-gray-800 text-gray-600 hover:border-gray-600 hover:text-gray-400'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Theme filter (all tabs) */}
      {allAvailableThemes.length > 1 && (
        <div className="mb-3 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-600 shrink-0">分類：</span>
          <button
            onClick={() => setThemeFilter(null)}
            className={`text-xs px-2.5 py-1 rounded-lg border transition ${
              themeFilter === null
                ? 'border-gray-500 text-gray-300 bg-gray-800'
                : 'border-gray-800 text-gray-600 hover:border-gray-600 hover:text-gray-400'
            }`}
          >
            全部
          </button>
          {allAvailableThemes.map(theme => (
            <button
              key={theme}
              onClick={() => setThemeFilter(theme)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                themeFilter === theme
                  ? 'border-gray-500 text-gray-300 bg-gray-800'
                  : 'border-gray-800 text-gray-600 hover:border-gray-600 hover:text-gray-400'
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      )}

      {/* Reviewed progress bar */}
      {tab !== 'practice' && totalQCount > 0 && (
        <div className="mb-4 flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all"
              style={{ width: `${(reviewedCount / totalQCount) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-600 shrink-0">
            已複習 <span className="text-emerald-600 font-medium">{reviewedCount}</span>/{totalQCount}
          </span>
        </div>
      )}
      {tab === 'practice' && totalPCount > 0 && (
        <div className="mb-4 flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all"
              style={{ width: `${(practiceReviewedCount / totalPCount) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-600 shrink-0">
            已複習 <span className="text-emerald-600 font-medium">{practiceReviewedCount}</span>/{totalPCount}
          </span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-900 border border-gray-800 rounded-xl p-1">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => handleTabChange(t.key)}
            className={`flex-1 text-sm font-medium py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
              tab === t.key ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {t.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              tab === t.key ? 'bg-gray-600 text-gray-200' : 'bg-gray-800 text-gray-600'
            }`}>{t.count}</span>
          </button>
        ))}
      </div>

      {tab === 'quiz' && (
        qLoading && quizFlat.length === 0 ? <LoadingState /> :
        quizFlat.length === 0 ? <EmptyState text="還沒有標記選擇題" hint="在選擇題練習中點擊 ☆ 加入" /> :
        <VirtualQuestionList
          key="quiz"
          flatItems={quizFlat}
          onUnstar={unstarQuestion}
          onMarkReviewed={markReviewed}
          isItemReviewed={isItemReviewed}
          showOptions
        />
      )}
      {tab === 'qa' && (
        qLoading && qaFlat.length === 0 ? <LoadingState /> :
        qaFlat.length === 0 ? <EmptyState text="還沒有標記問答練習題" hint="在問答練習中點擊 ☆ 加入" /> :
        <VirtualQuestionList
          key="qa"
          flatItems={qaFlat}
          onUnstar={unstarQuestion}
          onMarkReviewed={markReviewed}
          isItemReviewed={isItemReviewed}
          showOptions={false}
        />
      )}
      {tab === 'practice' && (
        pLoading && problemFlat.length === 0 ? <LoadingState /> :
        problemFlat.length === 0 ? <EmptyState text="還沒有標記實作題" hint="在實作練習中點擊 ☆ 加入" /> :
        <VirtualProblemList
          flatItems={problemFlat}
          onUnstar={unstarProblem}
          onToggleReviewed={togglePracticeReviewed}
          isPracticeReviewed={isPracticeReviewed}
        />
      )}
    </div>
  )
}

// ── Utility ───────────────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="space-y-2 animate-pulse">
      {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-900 border border-gray-800 rounded-xl" />)}
    </div>
  )
}

function EmptyState({ text, hint }: { text: string; hint: string }) {
  return (
    <div className="text-center py-16">
      <div className="text-4xl mb-3">⭐</div>
      <p className="text-gray-400 mb-1">{text}</p>
      <p className="text-gray-600 text-sm">{hint}</p>
    </div>
  )
}

// ── Virtual question list ─────────────────────────────────────────────────────

function VirtualQuestionList({ flatItems, onUnstar, onMarkReviewed, isItemReviewed, showOptions }: {
  flatItems: QuestionFlatItem[]
  onUnstar: (id: number) => void
  onMarkReviewed: (id: number) => void
  isItemReviewed: (id: number) => boolean
  showOptions: boolean
}) {
  const listRef = useRef<HTMLDivElement>(null)

  const virtualizer = useWindowVirtualizer({
    count: flatItems.length,
    estimateSize: (i) => flatItems[i].kind === 'header' ? 48 : 80,
    scrollMargin: listRef.current?.offsetTop ?? 0,
    overscan: 4,
  })

  const virtualItems = virtualizer.getVirtualItems()

  return (
    <div ref={listRef}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
        {virtualItems.map(vRow => {
          const item = flatItems[vRow.index]
          return (
            <div
              key={vRow.key}
              data-index={vRow.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${vRow.start - virtualizer.options.scrollMargin}px)`,
                paddingBottom: item.kind === 'card' ? 8 : 0,
              }}
            >
              {item.kind === 'header' ? (
                <div className="flex items-center gap-2 pt-4 pb-2">
                  <h2 className="text-sm font-semibold text-gray-300">{item.topicTitle}</h2>
                  <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full">{item.theme}</span>
                  <span className="text-xs text-gray-600">{item.count} 題</span>
                </div>
              ) : (
                <QuestionCard
                  q={item.q}
                  idx={item.idx}
                  onUnstar={onUnstar}
                  onMarkReviewed={onMarkReviewed}
                  isReviewed={isItemReviewed(item.q.questionId)}
                  showOptions={showOptions}
                />
              )}
            </div>
          )
        })}
      </div>
      {flatItems.length > 0 && (
        <div className="text-center py-3 text-xs text-gray-700">共 {flatItems.filter(i => i.kind === 'card').length} 題</div>
      )}
    </div>
  )
}

// ── Virtual problem list ──────────────────────────────────────────────────────

function VirtualProblemList({ flatItems, onUnstar, onToggleReviewed, isPracticeReviewed }: {
  flatItems: ProblemFlatItem[]
  onUnstar: (topicSlug: string, problemId: string) => void
  onToggleReviewed: (key: string) => void
  isPracticeReviewed: (key: string) => boolean
}) {
  const listRef = useRef<HTMLDivElement>(null)

  const virtualizer = useWindowVirtualizer({
    count: flatItems.length,
    estimateSize: (i) => flatItems[i].kind === 'header' ? 48 : 110,
    scrollMargin: listRef.current?.offsetTop ?? 0,
    overscan: 4,
  })

  const virtualItems = virtualizer.getVirtualItems()

  return (
    <div ref={listRef}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
        {virtualItems.map(vRow => {
          const item = flatItems[vRow.index]
          return (
            <div
              key={vRow.key}
              data-index={vRow.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${vRow.start - virtualizer.options.scrollMargin}px)`,
                paddingBottom: item.kind === 'card' ? 8 : 0,
              }}
            >
              {item.kind === 'header' ? (
                <div className="flex items-center gap-2 pt-4 pb-2">
                  <h2 className="text-sm font-semibold text-gray-300">{item.topicTitle}</h2>
                  {item.theme && <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full">{item.theme}</span>}
                  <span className="text-xs text-gray-600">{item.count} 題</span>
                </div>
              ) : (
                <ProblemCard
                  p={item.p}
                  onUnstar={onUnstar}
                  onToggleReviewed={onToggleReviewed}
                  isReviewed={isPracticeReviewed(`${item.p.topicSlug}-${item.p.problemId}`)}
                />
              )}
            </div>
          )
        })}
      </div>
      <div className="text-center py-3 text-xs text-gray-700">
        共 {flatItems.filter(i => i.kind === 'card').length} 題
      </div>
    </div>
  )
}

// ── Question card ─────────────────────────────────────────────────────────────

function QuestionCard({ q, idx, onUnstar, onMarkReviewed, isReviewed, showOptions }: {
  q: StarredQuestion; idx: number
  onUnstar: (id: number) => void
  onMarkReviewed: (id: number) => void
  isReviewed: boolean
  showOptions: boolean
}) {
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [userAnswer, setUserAnswer] = useState('')
  const [unstarring, setUnstarring] = useState(false)

  const answered = showOptions ? selected !== null : revealed
  const isCorrect = selected === q.answer

  const answeredRef = useRef(false)
  useEffect(() => {
    if (!answered) { answeredRef.current = false; return }
    if (!answeredRef.current) {
      answeredRef.current = true
      onMarkReviewed(q.questionId)
    }
  }, [answered])

  async function handleUnstar() {
    setUnstarring(true)
    await onUnstar(q.questionId)
  }

  function reset() {
    setSelected(null)
    setRevealed(false)
    setUserAnswer('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Tab') {
      e.preventDefault()
    }
  }

  return (
    <div className={`bg-gray-900 border rounded-xl overflow-hidden transition ${
      isReviewed && !answered ? 'border-emerald-900/50 opacity-60' : isReviewed ? 'border-emerald-900/50' : 'border-gray-800'
    }`}>
      <div className="flex items-start gap-3 p-4">
        <span className="shrink-0 text-xs font-bold text-gray-600 mt-0.5 w-5">{idx + 1}.</span>
        <p className="flex-1 text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">{q.question}</p>
        <div className="flex items-center gap-2 shrink-0">
          {isReviewed && (
            <span className="text-xs text-emerald-600 font-medium">✓ 已複習</span>
          )}
          <button
            onClick={handleUnstar}
            disabled={unstarring}
            title="取消必考題"
            className="text-yellow-400 hover:text-gray-500 transition disabled:opacity-40 text-base"
          >★</button>
        </div>
      </div>

      <div className="border-t border-gray-800 px-4 pb-4 pt-3 space-y-3">
        {showOptions && q.options && q.options.length > 0 && (
          <div className="space-y-1.5">
            {q.options.map((opt, i) => {
              let cls = 'text-gray-400 border border-gray-800 hover:border-gray-600 hover:text-gray-200 cursor-pointer'
              if (answered) {
                if (i === q.answer) cls = 'bg-green-900/40 border border-green-700 text-green-300'
                else if (i === selected) cls = 'bg-red-900/30 border border-red-800 text-red-400'
                else cls = 'text-gray-600 border border-gray-800'
              }
              return (
                <button
                  key={i}
                  disabled={answered}
                  onClick={() => setSelected(i)}
                  className={`w-full flex items-start gap-2 text-sm px-3 py-2 rounded-lg text-left transition ${cls}`}
                >
                  <span className="font-bold shrink-0">{String.fromCharCode(65 + i)}.</span>
                  <span>{opt}</span>
                  {answered && i === q.answer && <span className="ml-auto shrink-0 text-xs text-green-500">✓ 正確</span>}
                  {answered && i === selected && i !== q.answer && <span className="ml-auto shrink-0 text-xs text-red-400">✗</span>}
                </button>
              )
            })}
          </div>
        )}

        {!showOptions && (
          <>
            <textarea
              value={userAnswer}
              onChange={e => setUserAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={revealed}
              placeholder="寫下你的答案..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-gray-500 transition disabled:opacity-60"
              rows={4}
            />
            {!revealed && (
              <button
                onClick={() => setRevealed(true)}
                className="w-full py-2 text-sm text-gray-500 border border-gray-700 rounded-lg hover:border-gray-500 hover:text-gray-300 transition"
              >
                查看參考答案
              </button>
            )}
          </>
        )}

        {answered && (
          <>
            {showOptions && (
              <p className={`text-xs font-semibold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrect ? '答對了！' : `答錯了，正確答案是 ${String.fromCharCode(65 + q.answer)}`}
              </p>
            )}
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-xs font-semibold text-gray-500 mb-1">
                {showOptions ? '解析' : '參考答案'}
              </p>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{q.explanation}</p>
            </div>
            <button onClick={reset} className="text-xs text-gray-600 hover:text-gray-400 transition">
              重新作答
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ── Problem card ──────────────────────────────────────────────────────────────

const DIFFICULTY_COLOR = {
  easy: 'text-green-400 bg-green-900/30 border-green-800',
  medium: 'text-yellow-400 bg-yellow-900/30 border-yellow-800',
  hard: 'text-red-400 bg-red-900/30 border-red-800',
}
const DIFFICULTY_LABEL = { easy: 'Easy', medium: 'Medium', hard: 'Hard' }

function ProblemCard({ p, onUnstar, onToggleReviewed, isReviewed }: {
  p: StarredProblemItem
  onUnstar: (s: string, id: string) => void
  onToggleReviewed: (key: string) => void
  isReviewed: boolean
}) {
  const [unstarring, setUnstarring] = useState(false)
  const key = `${p.topicSlug}-${p.problemId}`

  return (
    <div className={`bg-gray-900 border rounded-xl p-4 transition ${
      isReviewed ? 'border-emerald-900/50 opacity-60' : 'border-gray-800'
    }`}>
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-sm font-medium text-gray-200">{p.problemTitle}</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${DIFFICULTY_COLOR[p.difficulty]}`}>
              {DIFFICULTY_LABEL[p.difficulty]}
            </span>
            {isReviewed && (
              <span className="text-xs text-emerald-600 font-medium">✓ 已複習</span>
            )}
          </div>
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{p.problemDescription}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onToggleReviewed(key)}
            className={`text-xs px-2.5 py-1.5 rounded-lg border transition ${
              isReviewed
                ? 'border-emerald-800 text-emerald-600 hover:border-red-800 hover:text-red-500'
                : 'border-gray-700 text-gray-500 hover:border-emerald-700 hover:text-emerald-600'
            }`}
          >
            {isReviewed ? '取消複習' : '標記複習'}
          </button>
          <Link
            href={`/practice/${p.topicSlug}/${p.problemId}?from=starred`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:text-blue-300 border border-blue-800 hover:border-blue-600 px-2.5 py-1.5 rounded-lg transition"
          >
            前往練習
          </Link>
          <button
            onClick={async () => { setUnstarring(true); await onUnstar(p.topicSlug, p.problemId) }}
            disabled={unstarring}
            title="取消必考題"
            className="text-yellow-400 hover:text-gray-500 transition disabled:opacity-40 text-xl"
          >★</button>
        </div>
      </div>
    </div>
  )
}
