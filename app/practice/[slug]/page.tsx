import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getMethodChallenge } from '@/lib/array-challenges'
import PracticeClient from './PracticeClient'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function PracticePage({ params }: Props) {
  const { slug } = await params
  const entry = getMethodChallenge(slug)
  if (!entry) notFound()

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-300 text-sm transition"
          >
            ← 首頁
          </Link>
          <span className="text-gray-700">/</span>
          <span className="text-gray-500 text-sm">{entry.subCategory}</span>
          <span className="text-gray-700">/</span>
          <span className="text-gray-300 text-sm font-mono">{entry.methodName}</span>
        </div>

        <div className="flex items-start gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-100 font-mono">{entry.methodName}</h1>
            <p className="text-gray-500 mt-1">{entry.description}</p>
          </div>
          <span className="shrink-0 mt-1 text-xs px-2.5 py-1 rounded-full bg-gray-800 text-gray-400 border border-gray-700">
            {entry.subCategory}
          </span>
        </div>

        <PracticeClient entry={entry} />
      </div>
    </main>
  )
}
