import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPracticeChallenge } from '@/lib/array-challenges'
import { auth } from '@clerk/nextjs/server'
import { getUserCompletedProblems, getTopicNavInfo } from '@/lib/db/queries'

const DIFFICULTY_LABEL = { easy: 'Easy', medium: 'Medium', hard: 'Hard' }
const DIFFICULTY_COLOR = {
  easy: 'text-green-400 bg-green-900/30 border-green-800',
  medium: 'text-yellow-400 bg-yellow-900/30 border-yellow-800',
  hard: 'text-red-400 bg-red-900/30 border-red-800',
}

interface Props {
  params: Promise<{ slug: string }>
}

export default async function PracticeListPage({ params }: Props) {
  const { slug } = await params
  const entry = getPracticeChallenge(slug)
  if (!entry) notFound()

  const { userId } = await auth()
  const [completedIds, navInfo] = await Promise.all([
    userId ? getUserCompletedProblems(userId, slug) : Promise.resolve(new Set<string>()),
    getTopicNavInfo(slug),
  ])

  const backHref = navInfo
    ? `/?theme=${encodeURIComponent(navInfo.theme)}${navInfo.subCategory ? `&sub=${encodeURIComponent(navInfo.subCategory)}` : ''}`
    : '/'
  const backLabel = navInfo?.subCategory ?? navInfo?.theme ?? '首頁'

  const completedCount = entry.problems.filter(p => completedIds.has(p.id)).length
  const total = entry.problems.length

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link href={backHref} className="text-gray-500 hover:text-gray-300 transition">{backLabel}</Link>
          <span className="text-gray-700">/</span>
          <span className="text-gray-500">{entry.subCategory}</span>
          <span className="text-gray-700">/</span>
          <span className="text-gray-300 font-mono">{entry.methodName}</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-100 font-mono">{entry.methodName}</h1>
            <p className="text-gray-500 mt-1">{entry.description}</p>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-2xl font-bold text-gray-100">
              {completedCount}<span className="text-gray-600">/{total}</span>
            </div>
            <div className="text-xs text-gray-500 mt-0.5">已完成</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-gray-800 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all"
            style={{ width: total > 0 ? `${(completedCount / total) * 100}%` : '0%' }}
          />
        </div>

        {/* Problem list */}
        <div className="space-y-3">
          {entry.problems.map((problem, i) => {
            const done = completedIds.has(problem.id)
            return (
              <Link
                key={problem.id}
                href={`/practice/${slug}/${problem.id}`}
                className={`flex items-center gap-4 p-4 rounded-xl border transition group ${
                  done
                    ? 'bg-gray-900/50 border-emerald-800/50 hover:border-emerald-700'
                    : 'bg-gray-900 border-gray-800 hover:border-gray-700'
                }`}
              >
                {/* Index / Check */}
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  done
                    ? 'bg-emerald-900/60 text-emerald-400'
                    : 'bg-gray-800 text-gray-500'
                }`}>
                  {done ? '✓' : i + 1}
                </div>

                {/* Title */}
                <div className="flex-1 min-w-0">
                  <div className="text-gray-200 font-medium group-hover:text-white transition truncate">
                    {problem.title}
                  </div>
                </div>

                {/* Difficulty */}
                <span className={`shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${DIFFICULTY_COLOR[problem.difficulty]}`}>
                  {DIFFICULTY_LABEL[problem.difficulty]}
                </span>

                {/* Arrow */}
                <span className="shrink-0 text-gray-600 group-hover:text-gray-400 transition">→</span>
              </Link>
            )
          })}
        </div>

        {!userId && (
          <p className="mt-6 text-center text-sm text-gray-600">
            <Link href="/sign-in" className="text-blue-400 hover:text-blue-300">登入</Link>
            {' '}後可儲存解題進度
          </p>
        )}

        <div className="mt-8">
          <Link
            href={`/notes/${slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition"
          >
            ← 查看 {entry.methodName} 說明筆記
          </Link>
        </div>
      </div>
    </main>
  )
}
