import Link from 'next/link'
import { getAllTopics, hasDemoPage, hasNotesPage } from '@/lib/topics'

const DIFFICULTY_COLOR = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  hard: 'bg-red-100 text-red-700',
}

const DIFFICULTY_LABEL = {
  easy: '入門',
  medium: '中級',
  hard: '進階',
}

const CATEGORY_COLOR: Record<string, string> = {
  JavaScript: 'bg-blue-50 text-blue-700 border border-blue-200',
  React: 'bg-cyan-50 text-cyan-700 border border-cyan-200',
  'Next.js': 'bg-slate-100 text-slate-700 border border-slate-300',
  CSS: 'bg-pink-50 text-pink-700 border border-pink-200',
  TypeScript: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  Network: 'bg-orange-50 text-orange-700 border border-orange-200',
  Browser: 'bg-purple-50 text-purple-700 border border-purple-200',
}

export default async function HomePage() {
  const topics = await getAllTopics()

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">前端技術複習</h1>
          <p className="text-gray-500 text-lg">
            共 <span className="font-semibold text-gray-700">{topics.length}</span> 個技術主題 ·{' '}
            <span className="font-semibold text-gray-700">
              {topics.reduce((acc, t) => acc + t.questions.length, 0)}
            </span>{' '}
            道練習題
          </p>
        </div>

        {/* Quick action */}
        <div className="mb-10 flex justify-center">
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl shadow transition"
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
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{topic.meta.title}</h2>
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
                    className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${CATEGORY_COLOR[topic.meta.category] ?? 'bg-gray-100 text-gray-600'}`}
                  >
                    {topic.meta.category}
                  </span>
                  <span className="text-xs text-gray-400">{topic.questions.length} 道題目</span>
                </div>

                <div className="flex gap-2 mt-auto pt-2">
                  <Link
                    href={`/quiz/${topic.slug}`}
                    className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg transition"
                  >
                    開始測驗
                  </Link>
                  {hasNotes && (
                    <Link
                      href={`/notes/${topic.slug}`}
                      className="flex-1 text-center bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-sm font-semibold py-2 rounded-lg transition"
                    >
                      查看說明
                    </Link>
                  )}
                  {hasDemo ? (
                    <Link
                      href={`/demo/${topic.slug}`}
                      className="flex-1 text-center bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-sm font-semibold py-2 rounded-lg transition"
                    >
                      查看 Demo
                    </Link>
                  ) : (
                    <span className="flex-1 text-center bg-gray-50 text-gray-300 border border-gray-100 text-sm font-semibold py-2 rounded-lg cursor-not-allowed">
                      查看 Demo
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {topics.length === 0 && (
          <p className="text-center text-gray-400 mt-20">
            尚無題目，在 <code className="bg-gray-100 px-1 rounded">topics/</code> 新增資料夾即可自動出現
          </p>
        )}
      </div>
    </main>
  )
}
