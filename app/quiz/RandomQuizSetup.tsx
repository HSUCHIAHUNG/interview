'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { Question, TopicMeta } from '@/lib/topics'
import type { MethodEntry, Problem } from '@/lib/array-challenges'
import QuizClient from './[topic]/QuizClient'
import QAClient from '../qa/[topic]/QAClient'
import RandomPracticeSession from './RandomPracticeSession'

type Theme = '全部' | 'JavaScript' | '陣列方法'
type QuizType = '選擇題' | '問答練習' | '實作練習'
type Phase = 'setup' | 'quiz'

interface PracticeItem {
  slug: string
  methodName: string
  entry: MethodEntry
  problem: Problem
}

interface Props {
  jsQuestions: Question[]
  allPracticeProblems: PracticeItem[]
}

const QUIZ_SIZE = 10

const randomMeta: TopicMeta = {
  title: '隨機測驗',
  description: '',
  category: 'JavaScript',
  difficulty: 'medium',
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function RandomQuizSetup({ jsQuestions, allPracticeProblems }: Props) {
  const [phase, setPhase] = useState<Phase>('setup')
  const [selectedTheme, setSelectedTheme] = useState<Theme>('全部')
  const [selectedType, setSelectedType] = useState<QuizType>('選擇題')

  // Which types are available per theme
  const availability: Record<Theme, Record<QuizType, boolean>> = useMemo(() => ({
    '全部': {
      '選擇題': jsQuestions.length > 0,
      '問答練習': jsQuestions.length > 0,
      '實作練習': allPracticeProblems.length > 0,
    },
    'JavaScript': {
      '選擇題': jsQuestions.length > 0,
      '問答練習': jsQuestions.length > 0,
      '實作練習': false,
    },
    '陣列方法': {
      '選擇題': false,
      '問答練習': false,
      '實作練習': allPracticeProblems.length > 0,
    },
  }), [jsQuestions, allPracticeProblems])

  // Quiz state (generated on "開始")
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([])
  const [practiceItems, setPracticeItems] = useState<PracticeItem[]>([])

  function handleThemeChange(theme: Theme) {
    setSelectedTheme(theme)
    // If current type becomes unavailable, switch to first available
    if (!availability[theme][selectedType]) {
      const first = (['選擇題', '問答練習', '實作練習'] as QuizType[]).find(t => availability[theme][t])
      if (first) setSelectedType(first)
    }
  }

  function handleStart() {
    if (selectedType === '選擇題' || selectedType === '問答練習') {
      const pool = shuffle(jsQuestions)
      const picked = pool.slice(0, QUIZ_SIZE).map((q, i) => ({ ...q, id: i + 1 }))
      setQuizQuestions(picked)
    } else {
      const pool = shuffle(allPracticeProblems)
      setPracticeItems(pool.slice(0, QUIZ_SIZE))
    }
    setPhase('quiz')
  }

  function handleBack() {
    setPhase('setup')
    setQuizQuestions([])
    setPracticeItems([])
  }

  if (phase === 'quiz') {
    if (selectedType === '選擇題') {
      return (
        <div className="max-w-xl mx-auto">
          <QuizClient
            slug="random"
            meta={{ ...randomMeta, title: `隨機測驗 · 選擇題` }}
            questions={quizQuestions}
            mode="random"
            onBack={handleBack}
          />
        </div>
      )
    }
    if (selectedType === '問答練習') {
      return (
        <div className="max-w-2xl mx-auto">
          <QAClient
            slug="random"
            meta={{ ...randomMeta, title: `隨機測驗 · 問答練習` }}
            questions={quizQuestions}
            onBack={handleBack}
          />
        </div>
      )
    }
    return <RandomPracticeSession problems={practiceItems} onBack={handleBack} />
  }

  const THEMES: Theme[] = ['全部', 'JavaScript', '陣列方法']
  const TYPES: QuizType[] = ['選擇題', '問答練習', '實作練習']

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-8">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 transition">
          ← 回首頁
        </Link>
      </div>

      <div className="text-center mb-10">
        <div className="text-4xl mb-3">🎯</div>
        <h1 className="text-2xl font-bold text-gray-100">隨機測驗</h1>
        <p className="text-gray-500 mt-2 text-sm">選擇主題與題型，系統隨機抽取最多 {QUIZ_SIZE} 題</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
        {/* Theme selector */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">主題</p>
          <div className="flex gap-2 flex-wrap">
            {THEMES.map(theme => (
              <button
                key={theme}
                onClick={() => handleThemeChange(theme)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                  selectedTheme === theme
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200'
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>

        {/* Type selector */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">題型</p>
          <div className="flex gap-2 flex-wrap">
            {TYPES.map(type => {
              const enabled = availability[selectedTheme][type]
              return (
                <button
                  key={type}
                  onClick={() => enabled && setSelectedType(type)}
                  disabled={!enabled}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                    !enabled
                      ? 'border-gray-800 text-gray-700 cursor-not-allowed'
                      : selectedType === type
                      ? 'bg-violet-700 border-violet-500 text-white'
                      : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200'
                  }`}
                >
                  {type}
                  {!enabled && <span className="ml-1 text-xs opacity-60">（無題目）</span>}
                </button>
              )
            })}
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={handleStart}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition"
        >
          開始測驗 →
        </button>
      </div>
    </div>
  )
}
