import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTopicFromDB, getKeyPointsBySlug, getTopicNavInfo } from '@/lib/db/queries'
import ListenClient from './ListenClient'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ListenPage({ params }: Props) {
  const { slug } = await params
  const [topic, keyPoints, navInfo] = await Promise.all([
    getTopicFromDB(slug),
    getKeyPointsBySlug(slug),
    getTopicNavInfo(slug),
  ])
  if (!topic) notFound()

  const backHref = navInfo
    ? `/?theme=${encodeURIComponent(navInfo.theme)}${navInfo.subCategory ? `&sub=${encodeURIComponent(navInfo.subCategory)}` : ''}`
    : '/'
  const backLabel = navInfo?.subCategory ?? navInfo?.theme ?? '首頁'

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-8 text-sm">
          <Link href={backHref} className="text-gray-500 hover:text-gray-300 transition">{backLabel}</Link>
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
