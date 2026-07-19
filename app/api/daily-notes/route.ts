import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { userDailyNotes } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'

export async function GET(request: Request) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date') ?? new Date().toISOString().split('T')[0]

  const [row] = await db
    .select({ note: userDailyNotes.note })
    .from(userDailyNotes)
    .where(and(eq(userDailyNotes.userId, userId), eq(userDailyNotes.date, date)))
    .limit(1)

  return Response.json({ note: row?.note ?? '' })
}

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { date, note } = await request.json() as { date: string; note: string }
  if (!date || typeof note !== 'string') return Response.json({ error: 'Invalid' }, { status: 400 })

  await db
    .insert(userDailyNotes)
    .values({ userId, date, note })
    .onConflictDoUpdate({
      target: [userDailyNotes.userId, userDailyNotes.date],
      set: { note, updatedAt: new Date() },
    })

  return Response.json({ ok: true })
}
