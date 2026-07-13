import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { markProblemComplete } from '@/lib/db/queries'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { topicSlug, problemId } = body as { topicSlug?: string; problemId?: string }
  if (!topicSlug || !problemId) {
    return NextResponse.json({ error: 'Missing topicSlug or problemId' }, { status: 400 })
  }

  await markProblemComplete(userId, topicSlug, problemId)
  revalidatePath(`/practice/${topicSlug}`)
  return NextResponse.json({ ok: true })
}
