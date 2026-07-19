import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { userDailyFocus } from '@/lib/db/schema'
import { and, eq, sql } from 'drizzle-orm'

// Client sends delta seconds (since last sync) and new leave count since last sync.
// Server accumulates them so multiple sessions in a day add up correctly.
export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json() as { secondsDelta: number; leaveCountDelta: number }
  const { secondsDelta = 0, leaveCountDelta = 0 } = body
  if (secondsDelta < 0) return Response.json({ error: 'Invalid' }, { status: 400 })

  const today = new Date().toISOString().split('T')[0]

  await db
    .insert(userDailyFocus)
    .values({ userId, date: today, seconds: secondsDelta, leaveCount: leaveCountDelta })
    .onConflictDoUpdate({
      target: [userDailyFocus.userId, userDailyFocus.date],
      set: {
        seconds: sql`${userDailyFocus.seconds} + ${secondsDelta}`,
        leaveCount: sql`${userDailyFocus.leaveCount} + ${leaveCountDelta}`,
        updatedAt: new Date(),
      },
    })

  return Response.json({ ok: true })
}

export async function GET(request: Request) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date') ?? new Date().toISOString().split('T')[0]

  const [row] = await db
    .select({ seconds: userDailyFocus.seconds, leaveCount: userDailyFocus.leaveCount })
    .from(userDailyFocus)
    .where(and(eq(userDailyFocus.userId, userId), eq(userDailyFocus.date, date)))
    .limit(1)

  return Response.json({ seconds: row?.seconds ?? 0, leaveCount: row?.leaveCount ?? 0 })
}
