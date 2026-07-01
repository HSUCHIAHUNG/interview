import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { getAllTopicsFromDB, getUserCompletedTopics } from '@/lib/db/queries'
import { hasDemoPage, hasNotesPage } from '@/lib/topics'
import TopicCard from '@/app/components/TopicCard'

export default async function HomePage() {
  const { userId } = await auth()
  const topics = await getAllTopicsFromDB()
  const totalQuestions = topics.reduce((acc, t) => acc + t.questionCount, 0)
  const completedSlugs = userId
    ? await getUserCompletedTopics(userId)
    : new Set<string>()

  return (
    <main className="min-h-screen bg-gray-950 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-end mb-6">
          {userId ? (
            <UserButton />
          ) : (
            <Link
              href="/sign-in"
              className="text-sm text-gray-400 hover:text-gray-200 border border-gray-700 hover:border-gray-500 px-4 py-1.5 rounded-lg transition"
            >
              登入
            </Link>
          )}
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-100 mb-3">前端技術複習</h1>
          <p className="text-gray-500 text-lg">
            共 <span className="font-semibold text-gray-300">{topics.length}</span> 個技術主題 ·{' '}
            <span className="font-semibold text-gray-300">{totalQuestions}</span>{' '}
            道練習題
          </p>
        </div>

        {/* Quick action */}
        <div className="mb-10 flex justify-center">
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-xl shadow transition"
          >
            <span>🎯</span> 開始隨機測驗
          </Link>
        </div>

        {/* Topic cards */}
        <div className="grid gap-5 sm:grid-cols-2">
          {topics.map((topic) => (
            <TopicCard
              key={topic.slug}
              slug={topic.slug}
              meta={topic.meta}
              questionCount={topic.questionCount}
              hasDemo={hasDemoPage(topic.slug)}
              hasNotes={hasNotesPage(topic.slug)}
              initialCompleted={completedSlugs.has(topic.slug)}
              isLoggedIn={!!userId}
            />
          ))}
        </div>

        {topics.length === 0 && (
          <p className="text-center text-gray-600 mt-20">尚無題目</p>
        )}
      </div>
    </main>
  )
}
