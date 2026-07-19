import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { userDailyFocus, userQuestionLog, topics } from '@/lib/db/schema'
import { eq, sql, gte } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export type FocusDayEntry = {
  date: string
  seconds: number
  leaveCount: number
  questionCount: number
}

export async function GET(request: Request) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  // Default: past 90 days
  const days = Math.min(730, parseInt(searchParams.get('days') ?? '365', 10))
  const since = new Date(Date.now() - days * 86400000).toISOString().split('T')[0]

  const [focusRows, questionRows] = await Promise.all([
    db
      .select({ date: userDailyFocus.date, seconds: userDailyFocus.seconds, leaveCount: userDailyFocus.leaveCount })
      .from(userDailyFocus)
      .where(eq(userDailyFocus.userId, userId)),

    db
      .select({
        date: sql<string>`${userQuestionLog.loggedAt}::date::text`,
        count: sql<number>`count(*)::int`,
      })
      .from(userQuestionLog)
      .where(eq(userQuestionLog.userId, userId))
      .groupBy(sql`${userQuestionLog.loggedAt}::date`),
  ])

  const questionByDate: Record<string, number> = {}
  for (const r of questionRows) questionByDate[r.date] = r.count

  // Merge and filter to requested range
  const merged: FocusDayEntry[] = focusRows
    .filter(r => r.date >= since)
    .map(r => ({
      date: r.date,
      seconds: r.seconds,
      leaveCount: r.leaveCount,
      questionCount: questionByDate[r.date] ?? 0,
    }))

  // Fill in days with questions but no focus record
  for (const [date, count] of Object.entries(questionByDate)) {
    if (date >= since && !merged.find(r => r.date === date)) {
      merged.push({ date, seconds: 0, leaveCount: 0, questionCount: count })
    }
  }

  merged.sort((a, b) => a.date.localeCompare(b.date))

  return Response.json(merged)
}
