import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTopicFromDB } from '@/lib/db/queries'
import { getKeyPointsBySlug } from '@/lib/db/queries'
import ListenClient from './ListenClient'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ListenPage({ params }: Props) {
  const { slug } = await params
  const [topic, keyPoints] = await Promise.all([
    getTopicFromDB(slug),
    getKeyPointsBySlug(slug),
  ])
  if (!topic) notFound()

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-8 text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-300 transition">首頁</Link>
          <span className="text-gray-700">/</span>
          <span className="text-gray-500">聆聽模式</span>
          <span className="text-gray-700">/</span>
          <span className="text-gray-300 font-mono">{topic.meta.title}</span>
        </div>

        <ListenClient
          slug={slug}
          methodName={topic.meta.title}
          initialKeyPoints={keyPoints}
        />
      </div>
    </main>
  )
}
