import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getStarredQuestionIds, toggleStarredQuestion } from '@/lib/db/queries'

export async function GET(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ ids: [] })

  const { searchParams } = new URL(req.url)
  const topicSlug = searchParams.get('topicSlug')
  if (!topicSlug) return NextResponse.json({ ids: [] })

  const ids = await getStarredQuestionIds(userId, topicSlug)
  return NextResponse.json({ ids: [...ids] })
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { questionId } = await req.json()
  if (!questionId) return NextResponse.json({ error: 'Invalid' }, { status: 400 })

  const starred = await toggleStarredQuestion(userId, questionId)
  return NextResponse.json({ starred })
}
