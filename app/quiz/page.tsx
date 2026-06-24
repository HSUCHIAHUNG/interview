export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { getAllTopics } from '@/lib/topics'
import type { Question, TopicMeta } from '@/lib/topics'
import QuizClient from './[topic]/QuizClient'

const QUIZ_SIZE = 10

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const randomMeta: TopicMeta = {
  title: '隨機測驗',
  description: '混合所有主題，每次隨機抽取 10 題',
  category: 'JavaScript',
  difficulty: 'medium',
}

export default async function QuizPage() {
  const topics = await getAllTopics()
  const allQuestions: Question[] = topics.flatMap((t) => t.questions)
  const questions = shuffle(allQuestions)
    .slice(0, QUIZ_SIZE)
    .map((q, i) => ({ ...q, id: i + 1 }))

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-xl mx-auto mb-8">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition">
          ← 回首頁
        </Link>
      </div>
      <QuizClient slug="random" meta={randomMeta} questions={questions} mode="random" />
    </main>
  )
}
