import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getStarredProblemIds, toggleStarredProblem } from '@/lib/db/queries'

export async function GET(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ ids: [] })

  const { searchParams } = new URL(req.url)
  const topicSlug = searchParams.get('topicSlug')
  if (!topicSlug) return NextResponse.json({ ids: [] })

  const ids = await getStarredProblemIds(userId, topicSlug)
  return NextResponse.json({ ids: [...ids] })
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { topicSlug, problemId } = await req.json()
  if (!topicSlug || !problemId) return NextResponse.json({ error: 'Invalid' }, { status: 400 })

  const starred = await toggleStarredProblem(userId, topicSlug, problemId)
  return NextResponse.json({ starred })
}
