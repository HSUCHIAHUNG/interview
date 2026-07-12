import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getStarredQuestions, getStarredProblemRows } from '@/lib/db/queries'
import { getPracticeChallenge } from '@/lib/array-challenges'
import StarredClient from './StarredClient'

export type StarredProblemItem = {
  topicSlug: string
  problemId: string
  problemTitle: string
  problemDescription: string
  difficulty: 'easy' | 'medium' | 'hard'
  topicTitle: string
}

export default async function StarredPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const [questions, problemRows] = await Promise.all([
    getStarredQuestions(userId),
    getStarredProblemRows(userId),
  ])

  const problems: StarredProblemItem[] = problemRows.flatMap(row => {
    const entry = getPracticeChallenge(row.topicSlug)
    if (!entry) return []
    const problem = entry.problems.find(p => p.id === row.problemId)
    if (!problem) return []
    return [{
      topicSlug: row.topicSlug,
      problemId: row.problemId,
      problemTitle: problem.title,
      problemDescription: problem.description,
      difficulty: problem.difficulty,
      topicTitle: entry.title,
    }]
  })

  const totalCount = questions.length + problems.length
  const topicSlugs = new Set([
    ...questions.map(q => q.topicSlug),
    ...problems.map(p => p.topicSlug),
  ])

  return (
    <main className="min-h-screen bg-gray-950 px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 transition block mb-2">
              ← 回首頁
            </Link>
            <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
              <span>⭐</span> 必考題
            </h1>
            {totalCount > 0 && (
              <p className="text-gray-500 text-sm mt-1">共 {totalCount} 道題目，來自 {topicSlugs.size} 個主題</p>
            )}
          </div>
        </div>

        <StarredClient initialQuestions={questions} initialProblems={problems} />
      </div>
    </main>
  )
}
