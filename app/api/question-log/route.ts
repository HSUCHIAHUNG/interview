import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { logAndCheckMilestone } from '@/lib/db/queries'
import { db } from '@/lib/db'
import { userQuestionLog } from '@/lib/db/schema'
import { and, eq, gte } from 'drizzle-orm'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ ok: true })

  const body = await req.json() as { topicSlug?: string; mode?: string }
  if (!body.topicSlug || !body.mode) {
    return NextResponse.json({ error: 'topicSlug and mode required' }, { status: 400 })
  }

  const result = await logAndCheckMilestone(userId, body.topicSlug, body.mode)
  return NextResponse.json(result)
}

export async function DELETE(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ ok: true })

  const body = await req.json() as { topicSlug?: string }
  if (!body.topicSlug) return NextResponse.json({ error: 'topicSlug required' }, { status: 400 })

  // Only delete today's log entry — historical records are preserved
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  await db.delete(userQuestionLog).where(
    and(
      eq(userQuestionLog.userId, userId),
      eq(userQuestionLog.topicSlug, body.topicSlug),
      gte(userQuestionLog.loggedAt, todayStart),
    )
  )

  return NextResponse.json({ ok: true })
}
