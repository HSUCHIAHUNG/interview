import { notFound } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { getTopicFromDB, getTopicSlugsFromDB, getNotesBySlug } from '@/lib/db/queries'
import { hasPracticeChallenge } from '@/lib/array-challenges'
import NotesClient from './NotesClient'

export async function generateStaticParams() {
  const slugs = await getTopicSlugsFromDB()
  return slugs.map(slug => ({ topic: slug }))
}

export const dynamic = 'force-dynamic'

export default async function NotesPage({
  params,
}: {
  params: Promise<{ topic: string }>
}) {
  const { topic } = await params
  const [data, sections, { userId }] = await Promise.all([
    getTopicFromDB(topic),
    getNotesBySlug(topic),
    auth(),
  ])

  if (!data) notFound()
  if (sections.length === 0 && !hasPracticeChallenge(topic)) notFound()

  const isPractice = hasPracticeChallenge(topic)

  return (
    <main className="min-h-screen bg-gray-950 px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 transition">
          ← 回首頁
        </Link>

        <div className="mt-6 mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-100">{data.meta.title}</h1>
            <p className="text-gray-500 mt-2 text-sm">
              {data.meta.category} · {data.meta.description}
            </p>
          </div>
        </div>

        <NotesClient
          slug={topic}
          initialSections={sections}
          isLoggedIn={!!userId}
          isPractice={isPractice}
        />

        <div className="mt-8 flex gap-3">
          {isPractice ? (
            <Link
              href={`/practice/${topic}`}
              className="flex-1 text-center bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold py-3 rounded-xl transition"
            >
              實作練習
            </Link>
          ) : (
            <Link
              href={`/quiz/${topic}`}
              className="flex-1 text-center bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-3 rounded-xl transition"
            >
              開始測驗
            </Link>
          )}
          <Link
            href="/"
            className="flex-1 text-center bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-200 text-sm font-semibold py-3 rounded-xl transition"
          >
            回首頁
          </Link>
        </div>
      </div>
    </main>
  )
}
