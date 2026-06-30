import Link from 'next/link'
import { getAllTopics, hasDemoPage, hasNotesPage } from '@/lib/topics'

const DIFFICULTY_COLOR = {
  easy: 'bg-green-900/40 text-green-400',
  medium: 'bg-yellow-900/40 text-yellow-400',
  hard: 'bg-red-900/40 text-red-400',
}

const DIFFICULTY_LABEL = {
  easy: '入門',
  medium: '中級',
  hard: '進階',
}

const CATEGORY_COLOR: Record<string, string> = {
  JavaScript: 'bg-blue-900/40 text-blue-300 border border-blue-800',
  React: 'bg-cyan-900/40 text-cyan-300 border border-cyan-800',
  'Next.js': 'bg-slate-800 text-slate-300 border border-slate-600',
  CSS: 'bg-pink-900/40 text-pink-300 border border-pink-800',
  TypeScript: 'bg-indigo-900/40 text-indigo-300 border border-indigo-800',
  Network: 'bg-orange-900/40 text-orange-300 border border-orange-800',
  Browser: 'bg-purple-900/40 text-purple-300 border border-purple-800',
}

export default async function HomePage() {
  const topics = await getAllTopics()

  return (
    <main className="min-h-screen bg-gray-950 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-100 mb-3">前端技術複習</h1>
          <p className="text-gray-500 text-lg">
            共 <span className="font-semibold text-gray-300">{topics.length}</span> 個技術主題 ·{' '}
            <span className="font-semibold text-gray-300">
              {topics.reduce((acc, t) => acc + t.questions.length, 0)}
            </span>{' '}
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
          {topics.map((topic) => {
            const hasDemo = hasDemoPage(topic.slug)
            const hasNotes = hasNotesPage(topic.slug)
            return (
              <div
                key={topic.slug}
                className="bg-gray-900 rounded-2xl border border-gray-800 p-6 flex flex-col gap-4 hover:border-gray-700 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-xl font-bold text-gray-100">{topic.meta.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">{topic.meta.description}</p>
                  </div>
                  <span
                    className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${DIFFICULTY_COLOR[topic.meta.difficulty]}`}
                  >
                    {DIFFICULTY_LABEL[topic.meta.difficulty]}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${CATEGORY_COLOR[topic.meta.category] ?? 'bg-gray-800 text-gray-400'}`}
                  >
                    {topic.meta.category}
                  </span>
                  <span className="text-xs text-gray-600">{topic.questions.length} 道題目</span>
                </div>

                <div className="flex gap-2 mt-auto pt-2 flex-wrap">
                  <Link
                    href={`/quiz/${topic.slug}`}
                    className="flex-1 text-center bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-2 rounded-lg transition"
                  >
                    選擇題
                  </Link>
                  <Link
                    href={`/qa/${topic.slug}`}
                    className="flex-1 text-center bg-purple-700 hover:bg-purple-600 text-white text-sm font-semibold py-2 rounded-lg transition"
                  >
                    問答練習
                  </Link>
                  {hasNotes && (
                    <Link
                      href={`/notes/${topic.slug}`}
                      className="flex-1 text-center bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 text-sm font-semibold py-2 rounded-lg transition"
                    >
                      查看說明
                    </Link>
                  )}
                  {hasDemo ? (
                    <Link
                      href={`/demo/${topic.slug}`}
                      className="flex-1 text-center bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 text-sm font-semibold py-2 rounded-lg transition"
                    >
                      查看 Demo
                    </Link>
                  ) : (
                    <span className="flex-1 text-center bg-gray-900 text-gray-700 border border-gray-800 text-sm font-semibold py-2 rounded-lg cursor-not-allowed">
                      查看 Demo
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {topics.length === 0 && (
          <p className="text-center text-gray-600 mt-20">
            尚無題目，在 <code className="bg-gray-800 px-1 rounded text-gray-300">topics/</code> 新增資料夾即可自動出現
          </p>
        )}
      </div>
    </main>
  )
}
