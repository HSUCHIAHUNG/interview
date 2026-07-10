import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createQuestion, getMaxQuestionOrder, getTopicIdBySlug } from '@/lib/db/queries'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug } = await params
  const body = await req.json() as {
    question?: string
    options?: string[]
    answer?: number
    explanation?: string
  }

  if (!body.question?.trim() || !body.explanation?.trim()) {
    return NextResponse.json({ error: 'question and explanation required' }, { status: 400 })
  }

  const topicId = await getTopicIdBySlug(slug)
  if (!topicId) return NextResponse.json({ error: 'Topic not found' }, { status: 404 })

  const maxOrder = await getMaxQuestionOrder(topicId)
  const row = await createQuestion(
    topicId,
    body.question.trim(),
    body.options ?? [],
    body.answer ?? 0,
    body.explanation.trim(),
    maxOrder + 1,
  )
  return NextResponse.json({ id: row.id })
}
