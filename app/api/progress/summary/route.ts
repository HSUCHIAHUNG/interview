import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getProgressSummary, getWeeklyGoals } from '@/lib/db/queries'

export const dynamic = 'force-dynamic'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [summary, goals] = await Promise.all([
    getProgressSummary(userId),
    getWeeklyGoals(userId),
  ])

  const goalMap: Record<string, number> = {}
  const targetDaysMap: Record<string, number | null> = {}
  for (const g of goals) {
    goalMap[g.theme] = g.weeklyGoal
    targetDaysMap[g.theme] = g.targetDays
  }

  return NextResponse.json({
    todayByTheme: summary.todayByTheme,
    totalByTheme: summary.weekByTheme, // all-time totals
    startDateByTheme: summary.startDateByTheme,
    streak: summary.streak,
    goalMap,
    targetDaysMap,
  })
}
