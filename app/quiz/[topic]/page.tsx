import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTopicSlugs, getTopic } from '@/lib/topics'
import QuizClient from './QuizClient'

export async function generateStaticParams() {
  return getTopicSlugs().map((slug) => ({ topic: slug }))
}

export default async function QuizTopicPage({
  params,
}: {
  params: Promise<{ topic: string }>
}) {
  const { topic } = await params
  const slugs = getTopicSlugs()
  if (!slugs.includes(topic)) notFound()

  const data = await getTopic(topic)

  return (
    <main className="min-h-screen bg-gray-950 px-6 py-12">
      <div className="max-w-xl mx-auto mb-8">
        <Link href="/quiz" className="text-sm text-gray-500 hover:text-gray-300 transition">
          ← 回題庫
        </Link>
      </div>
      <QuizClient slug={topic} meta={data.meta} questions={data.questions} />
    </main>
  )
}
