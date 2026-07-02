import { auth } from '@clerk/nextjs/server'
import { and, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { userProgress } from '@/lib/db/schema'

export async function GET(request: Request) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const topic = searchParams.get('topic')
  const mode = searchParams.get('mode')
  if (!topic || !mode) return Response.json({ error: 'Missing params' }, { status: 400 })

  const [row] = await db
    .select()
    .from(userProgress)
    .where(
      and(
        eq(userProgress.clerkId, userId),
        eq(userProgress.topicSlug, topic),
        eq(userProgress.mode, mode),
      ),
    )
    .limit(1)

  return Response.json({
    currentQuestion: row?.currentQuestion ?? 0,
    quizAnswers: row?.quizAnswers ?? null,
    qaAnswers: row?.qaAnswers ?? null,
  })
}

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { topicSlug, mode, currentQuestion, quizAnswers, qaAnswers } = await request.json()
  if (!topicSlug || !mode) return Response.json({ error: 'Missing params' }, { status: 400 })

  await db
    .insert(userProgress)
    .values({
      clerkId: userId,
      topicSlug,
      mode,
      currentQuestion: currentQuestion ?? 0,
      quizAnswers: quizAnswers ?? null,
      qaAnswers: qaAnswers ?? null,
    })
    .onConflictDoUpdate({
      target: [userProgress.clerkId, userProgress.topicSlug, userProgress.mode],
      set: {
        currentQuestion: currentQuestion ?? 0,
        quizAnswers: quizAnswers ?? null,
        qaAnswers: qaAnswers ?? null,
        updatedAt: new Date(),
      },
    })

  return Response.json({ ok: true })
}
