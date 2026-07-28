import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPracticeChallenge } from '@/lib/array-challenges'
import { auth } from '@clerk/nextjs/server'
import { getUserCompletedProblems, getStarredProblemIds, getTopicNavInfo, getAllStarredProblemRows } from '@/lib/db/queries'
import PracticeClient from './PracticeClient'

const DIFFICULTY_LABEL = { easy: 'Easy', medium: 'Medium', hard: 'Hard' }
const DIFFICULTY_COLOR = {
  easy: 'text-green-400 bg-green-900/30 border-green-800',
  medium: 'text-yellow-400 bg-yellow-900/30 border-yellow-800',
  hard: 'text-red-400 bg-red-900/30 border-red-800',
}

interface StarredNavItem {
  topicSlug: string
  id: string
  title: string
}

interface Props {
  params: Promise<{ slug: string; id: string }>
  searchParams: Promise<{ from?: string }>
}

export default async function ProblemPage({ params, searchParams }: Props) {
  const { slug, id } = await params
  const { from } = await searchParams
  const entry = getPracticeChallenge(slug)
  if (!entry) notFound()

  const problem = entry.problems.find(p => p.id === id)
  if (!problem) notFound()

  const problemIndex = entry.problems.findIndex(p => p.id === id)
  const prevProblem = entry.problems[problemIndex - 1] ?? null
  const nextProblem = entry.problems[problemIndex + 1] ?? null

  const { userId } = await auth()
  const [completedIds, starredIds, navInfo, allStarredRows] = await Promise.all([
    userId ? getUserCompletedProblems(userId, slug) : Promise.resolve(new Set<string>()),
    userId ? getStarredProblemIds(userId, slug) : Promise.resolve(new Set<string>()),
    getTopicNavInfo(slug),
    from === 'starred' && userId ? getAllStarredProblemRows(userId) : Promise.resolve(null),
  ])

  let starredPrev: StarredNavItem | null = null
  let starredNext: StarredNavItem | null = null
  if (allStarredRows) {
    const currentIdx = allStarredRows.findIndex(r => r.topicSlug === slug && r.problemId === id)
    if (currentIdx > 0) {
      const prev = allStarredRows[currentIdx - 1]
      const prevEntry = getPracticeChallenge(prev.topicSlug)
      const prevProblem = prevEntry?.problems.find(p => p.id === prev.problemId)
      if (prevProblem) starredPrev = { topicSlug: prev.topicSlug, id: prev.problemId, title: prevProblem.title }
    }
    if (currentIdx !== -1 && currentIdx < allStarredRows.length - 1) {
      const next = allStarredRows[currentIdx + 1]
      const nextEntry = getPracticeChallenge(next.topicSlug)
      const nextProblem = nextEntry?.problems.find(p => p.id === next.problemId)
      if (nextProblem) starredNext = { topicSlug: next.topicSlug, id: next.problemId, title: nextProblem.title }
    }
  }

  const backHref = navInfo
    ? `/?theme=${encodeURIComponent(navInfo.theme)}${navInfo.subCategory ? `&sub=${encodeURIComponent(navInfo.subCategory)}` : ''}`
    : '/'
  const backLabel = navInfo?.subCategory ?? navInfo?.theme ?? '首頁'

  const isCompleted = completedIds.has(id)
  const isStarred = starredIds.has(id)

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm flex-wrap">
          <Link href={backHref} className="text-gray-500 hover:text-gray-300 transition">{backLabel}</Link>
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
          initialStarred={isStarred}
          prevProblem={prevProblem ? { id: prevProblem.id, title: prevProblem.title } : null}
          nextProblem={nextProblem ? { id: nextProblem.id, title: nextProblem.title } : null}
          fromStarred={from === 'starred'}
          starredPrev={starredPrev}
          starredNext={starredNext}
        />
      </div>
    </main>
  )
}
