import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getMethodChallenge } from '@/lib/array-challenges'
import { auth } from '@clerk/nextjs/server'
import { getUserCompletedProblems } from '@/lib/db/queries'
import PracticeClient from './PracticeClient'

const DIFFICULTY_LABEL = { easy: 'Easy', medium: 'Medium', hard: 'Hard' }
const DIFFICULTY_COLOR = {
  easy: 'text-green-400 bg-green-900/30 border-green-800',
  medium: 'text-yellow-400 bg-yellow-900/30 border-yellow-800',
  hard: 'text-red-400 bg-red-900/30 border-red-800',
}

interface Props {
  params: Promise<{ slug: string; id: string }>
}

export default async function ProblemPage({ params }: Props) {
  const { slug, id } = await params
  const entry = getMethodChallenge(slug)
  if (!entry) notFound()

  const problem = entry.problems.find(p => p.id === id)
  if (!problem) notFound()

  const problemIndex = entry.problems.findIndex(p => p.id === id)
  const prevProblem = entry.problems[problemIndex - 1] ?? null
  const nextProblem = entry.problems[problemIndex + 1] ?? null

  const { userId } = await auth()
  const completedIds = userId
    ? await getUserCompletedProblems(userId, slug)
    : new Set<string>()

  const isCompleted = completedIds.has(id)

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm flex-wrap">
          <Link href="/" className="text-gray-500 hover:text-gray-300 transition">首頁</Link>
          <span className="text-gray-700">/</span>
          <Link href={`/practice/${slug}`} className="text-gray-500 hover:text-gray-300 transition font-mono">
            {entry.methodName}
          </Link>
          <span className="text-gray-700">/</span>
          <span className="text-gray-400">{problem.title}</span>
        </div>

        {/* Problem header */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <h1 className="text-xl font-bold text-gray-100">{problem.title}</h1>
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${DIFFICULTY_COLOR[problem.difficulty]}`}>
            {DIFFICULTY_LABEL[problem.difficulty]}
          </span>
          {isCompleted && (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full text-emerald-400 bg-emerald-900/30 border border-emerald-800">
              ✓ 已完成
            </span>
          )}
        </div>

        <PracticeClient
          entry={entry}
          problem={problem}
          topicSlug={slug}
          isLoggedIn={!!userId}
          initialCompleted={isCompleted}
          prevProblem={prevProblem ? { id: prevProblem.id, title: prevProblem.title } : null}
          nextProblem={nextProblem ? { id: nextProblem.id, title: nextProblem.title } : null}
        />
      </div>
    </main>
  )
}
