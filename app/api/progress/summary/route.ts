import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getProgressSummary, getWeeklyGoals } from '@/lib/db/queries'
import { db } from '@/lib/db'
import { userDailyFocus } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const today = new Date().toISOString().split('T')[0]

  const [summary, goals, focusRow] = await Promise.all([
    getProgressSummary(userId),
    getWeeklyGoals(userId),
    db
      .select({ seconds: userDailyFocus.seconds, leaveCount: userDailyFocus.leaveCount })
      .from(userDailyFocus)
      .where(and(eq(userDailyFocus.userId, userId), eq(userDailyFocus.date, today)))
      .limit(1),
  ])

  const goalMap: Record<string, number> = {}
  const targetDaysMap: Record<string, number | null> = {}
  for (const g of goals) {
    goalMap[g.theme] = g.weeklyGoal
    targetDaysMap[g.theme] = g.targetDays
  }

  return NextResponse.json({
    todayByTheme: summary.todayByTheme,
    totalByTheme: summary.weekByTheme,
    startDateByTheme: summary.startDateByTheme,
    streak: summary.streak,
    goalMap,
    targetDaysMap,
    todayFocusSeconds: focusRow[0]?.seconds ?? 0,
    todayLeaveCount: focusRow[0]?.leaveCount ?? 0,
  })
}
