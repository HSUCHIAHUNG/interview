import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTopicSlugs, getTopic } from '@/lib/topics'
import QAClient from './QAClient'

export async function generateStaticParams() {
  return getTopicSlugs().map((slug) => ({ topic: slug }))
}

export default async function QAPage({
  params,
}: {
  params: Promise<{ topic: string }>
}) {
  const { topic } = await params
  const slugs = getTopicSlugs()
  if (!slugs.includes(topic)) notFound()

  const data = await getTopic(topic)

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-2xl mx-auto mb-8">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition">
          ← 回首頁
        </Link>
      </div>
      <QAClient slug={topic} meta={data.meta} questions={data.questions} />
    </main>
  )
}
