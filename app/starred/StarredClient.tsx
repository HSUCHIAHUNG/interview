'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useWindowVirtualizer } from '@tanstack/react-virtual'
import type { StarredQuestion } from '@/lib/db/queries'
import type { StarredProblemItem } from './types'

type Tab = 'quiz' | 'qa' | 'practice'

// ── Flat list types ───────────────────────────────────────────────────────────

type QuestionFlatItem =
  | { kind: 'header'; topicSlug: string; topicTitle: string; theme: string; count: number }
  | { kind: 'card'; q: StarredQuestion; idx: number }

type ProblemFlatItem =
  | { kind: 'header'; topicSlug: string; topicTitle: string; count: number }
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
  const grouped: Record<string, { topicTitle: string; items: StarredProblemItem[] }> = {}
  for (const p of problems) {
    if (!grouped[p.topicSlug]) grouped[p.topicSlug] = { topicTitle: p.topicTitle, items: [] }
    grouped[p.topicSlug].items.push(p)
  }
  const flat: ProblemFlatItem[] = []
  for (const [slug, g] of Object.entries(grouped)) {
    flat.push({ kind: 'header', topicSlug: slug, topicTitle: g.topicTitle, count: g.items.length })
    g.items.forEach(p => flat.push({ kind: 'card', p }))
  }
  return flat
}

// ── Main component ────────────────────────────────────────────────────────────

export default function StarredClient() {
  const [tab, setTab] = useState<Tab>('quiz')

  const [questions, setQuestions] = useState<StarredQuestion[]>([])
  const [qCursor, setQCursor] = useState<number | null>(null)
  const [qHasMore, setQHasMore] = useState(true)
  const [qLoading, setQLoading] = useState(false)
  const qFetched = useRef(false)

  const [problems, setProblems] = useState<StarredProblemItem[]>([])
  const [pCursor, setPCursor] = useState<number | null>(null)
  const [pHasMore, setPHasMore] = useState(true)
  const [pLoading, setPLoading] = useState(false)
  const pFetched = useRef(false)

  async function loadQuestions(cursor: number | null = null) {
    if (qLoading) return
    setQLoading(true)
    try {
      const url = `/api/starred/list?type=questions${cursor != null ? `&cursor=${cursor}` : ''}`
      const res = await fetch(url)
      const data = await res.json()
      const batch: StarredQuestion[] = data.questions ?? []
      setQuestions(prev => cursor == null ? batch : [...prev, ...batch])
      setQCursor(data.nextCursor)
      setQHasMore(data.nextCursor !== null)
    } finally {
      setQLoading(false)
    }
  }

  async function loadProblems(cursor: number | null = null) {
    if (pLoading) return
    setPLoading(true)
    try {
      const url = `/api/starred/list?type=problems${cursor != null ? `&cursor=${cursor}` : ''}`
      const res = await fetch(url)
      const data = await res.json()
      const batch: StarredProblemItem[] = data.problems ?? []
      setProblems(prev => cursor == null ? batch : [...prev, ...batch])
      setPCursor(data.nextCursor)
      setPHasMore(data.nextCursor !== null)
    } finally {
      setPLoading(false)
    }
  }

  useEffect(() => {
    if (!qFetched.current) { qFetched.current = true; loadQuestions() }
    if (!pFetched.current) { pFetched.current = true; loadProblems() }
  }, [])

  function handleTabChange(t: Tab) {
    setTab(t)
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

  const quizQuestions = questions.filter(q => q.options && q.options.length > 0)
  const qaQuestions = questions

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'quiz', label: '選擇題', count: quizQuestions.length },
    { key: 'qa', label: '問答練習', count: qaQuestions.length },
    { key: 'practice', label: '實作題', count: problems.length },
  ]

  const quizFlat = buildQuestionFlat(quizQuestions)
  const qaFlat = buildQuestionFlat(qaQuestions)
  const problemFlat = buildProblemFlat(problems)

  return (
    <div>
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
          showOptions
          hasMore={qHasMore}
          loadingMore={qLoading}
          onLoadMore={() => loadQuestions(qCursor)}
        />
      )}
      {tab === 'qa' && (
        qLoading && qaFlat.length === 0 ? <LoadingState /> :
        qaFlat.length === 0 ? <EmptyState text="還沒有標記問答練習題" hint="在問答練習中點擊 ☆ 加入" /> :
        <VirtualQuestionList
          key="qa"
          flatItems={qaFlat}
          onUnstar={unstarQuestion}
          showOptions={false}
          hasMore={qHasMore}
          loadingMore={qLoading}
          onLoadMore={() => loadQuestions(qCursor)}
        />
      )}
      {tab === 'practice' && (
        pLoading && problemFlat.length === 0 ? <LoadingState /> :
        problemFlat.length === 0 ? <EmptyState text="還沒有標記實作題" hint="在實作練習中點擊 ☆ 加入" /> :
        <VirtualProblemList
          flatItems={problemFlat}
          onUnstar={unstarProblem}
          hasMore={pHasMore}
          loadingMore={pLoading}
          onLoadMore={() => loadProblems(pCursor)}
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

// ── Virtual question list (window scroll) ────────────────────────────────────

function VirtualQuestionList({ flatItems, onUnstar, showOptions, hasMore, loadingMore, onLoadMore }: {
  flatItems: QuestionFlatItem[]
  onUnstar: (id: number) => void
  showOptions: boolean
  hasMore: boolean
  loadingMore: boolean
  onLoadMore: () => void
}) {
  const listRef = useRef<HTMLDivElement>(null)
  const loadingMoreRef = useRef(false)

  const virtualizer = useWindowVirtualizer({
    count: flatItems.length,
    estimateSize: (i) => flatItems[i].kind === 'header' ? 48 : 80,
    scrollMargin: listRef.current?.offsetTop ?? 0,
    overscan: 4,
  })

  const virtualItems = virtualizer.getVirtualItems()
  useEffect(() => {
    if (!virtualItems.length || !hasMore || loadingMore || loadingMoreRef.current) return
    const lastVisible = virtualItems[virtualItems.length - 1]
    if (lastVisible.index >= flatItems.length - 5) {
      loadingMoreRef.current = true
      onLoadMore()
    }
  }, [virtualItems, flatItems.length, hasMore, loadingMore])

  useEffect(() => { loadingMoreRef.current = false }, [loadingMore])

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
                <QuestionCard q={item.q} idx={item.idx} onUnstar={onUnstar} showOptions={showOptions} />
              )}
            </div>
          )
        })}
      </div>
      {loadingMore && (
        <div className="text-center py-3 text-xs text-gray-600 animate-pulse">載入中...</div>
      )}
      {!hasMore && flatItems.length > 0 && (
        <div className="text-center py-3 text-xs text-gray-700">已顯示全部 {flatItems.filter(i => i.kind === 'card').length} 題</div>
      )}
    </div>
  )
}

// ── Virtual problem list (window scroll) ─────────────────────────────────────

function VirtualProblemList({ flatItems, onUnstar, hasMore, loadingMore, onLoadMore }: {
  flatItems: ProblemFlatItem[]
  onUnstar: (topicSlug: string, problemId: string) => void
  hasMore: boolean
  loadingMore: boolean
  onLoadMore: () => void
}) {
  const listRef = useRef<HTMLDivElement>(null)
  const loadingMoreRef = useRef(false)

  const virtualizer = useWindowVirtualizer({
    count: flatItems.length,
    estimateSize: (i) => flatItems[i].kind === 'header' ? 48 : 100,
    scrollMargin: listRef.current?.offsetTop ?? 0,
    overscan: 4,
  })

  const virtualItems = virtualizer.getVirtualItems()
  useEffect(() => {
    if (!virtualItems.length || !hasMore || loadingMore || loadingMoreRef.current) return
    const lastVisible = virtualItems[virtualItems.length - 1]
    if (lastVisible.index >= flatItems.length - 5) {
      loadingMoreRef.current = true
      onLoadMore()
    }
  }, [virtualItems, flatItems.length, hasMore, loadingMore])

  useEffect(() => { loadingMoreRef.current = false }, [loadingMore])

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
                  <span className="text-xs text-gray-600">{item.count} 題</span>
                </div>
              ) : (
                <ProblemCard p={item.p} onUnstar={onUnstar} />
              )}
            </div>
          )
        })}
      </div>
      {loadingMore && (
        <div className="text-center py-3 text-xs text-gray-600 animate-pulse">載入中...</div>
      )}
      {!hasMore && flatItems.length > 0 && (
        <div className="text-center py-3 text-xs text-gray-700">已顯示全部 {flatItems.filter(i => i.kind === 'card').length} 題</div>
      )}
    </div>
  )
}

// ── Question card ─────────────────────────────────────────────────────────────

function QuestionCard({ q, idx, onUnstar, showOptions }: {
  q: StarredQuestion; idx: number
  onUnstar: (id: number) => void
  showOptions: boolean
}) {
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [userAnswer, setUserAnswer] = useState('')
  const [unstarring, setUnstarring] = useState(false)

  const answered = showOptions ? selected !== null : revealed
  const isCorrect = selected === q.answer

  async function handleUnstar() {
    setUnstarring(true)
    await onUnstar(q.questionId)
  }

  function reset() {
    setSelected(null)
    setRevealed(false)
    setUserAnswer('')
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="flex items-start gap-3 p-4">
        <span className="shrink-0 text-xs font-bold text-gray-600 mt-0.5 w-5">{idx + 1}.</span>
        <p className="flex-1 text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">{q.question}</p>
        <button
          onClick={handleUnstar}
          disabled={unstarring}
          title="取消必考題"
          className="shrink-0 text-yellow-400 hover:text-gray-500 transition disabled:opacity-40 text-base"
        >★</button>
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

function ProblemCard({ p, onUnstar }: { p: StarredProblemItem; onUnstar: (s: string, id: string) => void }) {
  const [unstarring, setUnstarring] = useState(false)

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-start gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-gray-200">{p.problemTitle}</span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${DIFFICULTY_COLOR[p.difficulty]}`}>
            {DIFFICULTY_LABEL[p.difficulty]}
          </span>
        </div>
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{p.problemDescription}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Link
          href={`/practice/${p.topicSlug}/${p.problemId}`}
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
  )
}
