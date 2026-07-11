import Link from 'next/link'
import { Suspense } from 'react'
import { UserButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { getAllTopicsFromDB, getUserCompletedTopics, getSubCategoriesByTheme, getUserPracticeProgress, getSlugsWithNotes } from '@/lib/db/queries'
import { hasDemoPage, hasPracticePage } from '@/lib/topics'
import { getMethodChallenge } from '@/lib/array-challenges'
import ThemeFilter from '@/app/components/ThemeFilter'
import DailyProgress from '@/app/components/DailyProgress'
import GoalButton from '@/app/components/GoalButton'
import MemoButton from '@/app/components/MemoButton'

export default async function HomePage() {
  const { userId } = await auth()
  const [topics, slugsWithNotes] = await Promise.all([getAllTopicsFromDB(), getSlugsWithNotes()])
  const totalQuestions = topics.reduce((acc, t) => acc + t.questionCount, 0)
  const completedSlugs = userId
    ? await getUserCompletedTopics(userId)
    : new Set<string>()

  const practiceProgressMap = userId
    ? await getUserPracticeProgress(userId)
    : new Map<string, number>()

  const themes = [...new Set(topics.map(t => t.theme))].sort()

  // Fetch subcategories for each theme from DB
  const subCategoriesByTheme: Record<string, string[]> = {}
  await Promise.all(
    themes.map(async theme => {
      subCategoriesByTheme[theme] = await getSubCategoriesByTheme(theme)
    })
  )

  return (
    <main className="min-h-screen bg-gray-950 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-end items-center gap-3 mb-6">
          {userId && <MemoButton />}
          {userId && <GoalButton />}
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
        <div className="mb-10 flex justify-center gap-3 flex-wrap">
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-xl shadow transition"
          >
            <span>🎯</span> 開始隨機測驗
          </Link>
          <Link
            href="/listen-theme"
            className="inline-flex items-center gap-2 bg-violet-700 hover:bg-violet-600 text-white font-semibold px-8 py-3 rounded-xl shadow transition"
          >
            <span>🎧</span> 彙整聆聽
          </Link>
        </div>

        {/* Daily progress strip (only when logged in) */}
        {userId && <DailyProgress />}

        {/* Theme filter + topic cards */}
        <Suspense fallback={null}>
          <ThemeFilter
            themes={themes}
            subCategoriesByTheme={subCategoriesByTheme}
            topics={topics.map(topic => ({
              slug: topic.slug,
              meta: topic.meta,
              questionCount: topic.questionCount,
              hasDemo: hasDemoPage(topic.slug),
              hasNotes: slugsWithNotes.has(topic.slug),
              hasPractice: hasPracticePage(topic.slug),
              initialCompleted: completedSlugs.has(topic.slug),
              isLoggedIn: !!userId,
              theme: topic.theme,
              subCategory: topic.subCategory,
              practiceProgress: hasPracticePage(topic.slug)
                ? {
                    completed: practiceProgressMap.get(topic.slug) ?? 0,
                    total: getMethodChallenge(topic.slug)?.problems?.length ?? 5,
                  }
                : undefined,
            }))}
          />
        </Suspense>

        {topics.length === 0 && (
          <p className="text-center text-gray-600 mt-20">尚無題目</p>
        )}
      </div>
    </main>
  )
}
