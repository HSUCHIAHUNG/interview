'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import type { Question, TopicMeta } from '@/lib/topics'

interface Props {
  slug: string
  meta: TopicMeta
  questions: Question[]
}

type Phase = 'answer' | 'feedback' | 'result'

interface QuestionResult {
  question: string
  userAnswer: string
  feedback: string
}

export default function QAClient({ slug, meta, questions }: Props) {
  const [current, setCurrent] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [phase, setPhase] = useState<Phase>('answer')
  const [results, setResults] = useState<QuestionResult[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const q = questions[current]

  async function submitAnswer() {
    if (!userAnswer.trim()) return
    setIsLoading(true)
    setFeedback('')
    setPhase('feedback')

    const res = await fetch('/api/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: q.question,
        referenceAnswer: q.explanation,
        userAnswer,
      }),
    })

    if (!res.ok || !res.body) {
      const data = await res.json().catch(() => ({}))
      setFeedback(data.error ?? '評估失敗，請稍後再試。')
      setIsLoading(false)
      return
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let accumulated = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      accumulated += decoder.decode(value, { stream: true })
      setFeedback(accumulated)
    }

    setResults(prev => [...prev, { question: q.question, userAnswer, feedback: accumulated }])
    setIsLoading(false)
  }

  function goNext() {
    if (current + 1 < questions.length) {
      setCurrent(current + 1)
      setUserAnswer('')
      setFeedback('')
      setPhase('answer')
      setTimeout(() => textareaRef.current?.focus(), 100)
    } else {
      setPhase('result')
    }
  }

  function restart() {
    setCurrent(0)
    setUserAnswer('')
    setFeedback('')
    setResults([])
    setPhase('answer')
    setTimeout(() => textareaRef.current?.focus(), 100)
  }

  if (phase === 'result') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">全部回答完畢！</h2>
          <p className="text-gray-500 mb-8">共 {questions.length} 題，以下是你的作答紀錄</p>

          <div className="text-left space-y-4 mb-8">
            {results.map((r, i) => (
              <details key={i} className="border border-gray-800 rounded-xl overflow-hidden">
                <summary className="px-4 py-3 cursor-pointer font-medium text-gray-300 hover:bg-gray-800">
                  Q{i + 1}. {r.question.slice(0, 50)}{r.question.length > 50 ? '...' : ''}
                </summary>
                <div className="px-4 pb-4 pt-2 space-y-3 border-t border-gray-800">
                  <div className="bg-blue-900/30 rounded-lg p-3">
                    <p className="text-xs font-semibold text-blue-400 mb-1">你的回答</p>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap">{r.userAnswer}</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <p className="text-xs font-semibold text-gray-500 mb-1">AI 評估</p>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap">{r.feedback}</p>
                  </div>
                </div>
              </details>
            ))}
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={restart}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-xl transition"
            >
              再練一次
            </button>
            <Link
              href="/"
              className="border border-gray-700 hover:bg-gray-800 text-gray-300 font-semibold px-6 py-2.5 rounded-xl transition"
            >
              回首頁
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>{meta.title} — 問答模式</span>
          <span>{current + 1} / {questions.length}</span>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
        <p className="text-xs font-semibold text-blue-400 uppercase tracking-wide mb-4">
          第 {current + 1} 題
        </p>
        <h2 className="text-lg font-semibold text-gray-100 mb-6 leading-relaxed whitespace-pre-wrap">
          {q.question}
        </h2>

        {/* Answer textarea */}
        <textarea
          ref={textareaRef}
          value={userAnswer}
          onChange={e => setUserAnswer(e.target.value)}
          disabled={phase === 'feedback'}
          placeholder="請用自己的話回答這個問題..."
          rows={5}
          className="w-full border border-gray-700 bg-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition disabled:bg-gray-900 disabled:text-gray-500"
        />

        {/* Submit */}
        {phase === 'answer' && (
          <button
            onClick={submitAnswer}
            disabled={!userAnswer.trim()}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:cursor-not-allowed text-white disabled:text-gray-600 font-semibold py-3 rounded-xl transition"
          >
            送出，讓 AI 評估
          </button>
        )}

        {/* AI Feedback */}
        {phase === 'feedback' && (
          <div className="mt-6 border-t border-gray-800 pt-6">
            <p className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">
              AI 評估回饋
            </p>
            {isLoading && !feedback && (
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <span className="animate-pulse">●</span>
                <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>●</span>
                <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>●</span>
                <span className="ml-1">評估中...</span>
              </div>
            )}
            {feedback && (
              <div className="bg-gray-800 rounded-xl p-4 text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                {feedback}
              </div>
            )}
            {!isLoading && feedback && (
              <button
                onClick={goNext}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition"
              >
                {current + 1 < questions.length ? '下一題 →' : '查看總結'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
