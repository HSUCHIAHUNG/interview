import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { userAnswers } from '@/lib/db/schema'

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { questionId, mode, answer, isCorrect } = await request.json()

  if (!questionId || !mode || !answer) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  await db.insert(userAnswers).values({
    clerkId: userId,
    questionId,
    mode,
    answer: String(answer),
    isCorrect: isCorrect ?? null,
  })

  return Response.json({ ok: true })
}
