import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getProgressSummary, getWeeklyGoals } from '@/lib/db/queries'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [summary, goals] = await Promise.all([
    getProgressSummary(userId),
    getWeeklyGoals(userId),
  ])

  const goalMap: Record<string, number> = {}
  for (const g of goals) goalMap[g.theme] = g.weeklyGoal

  return NextResponse.json({
    todayByTheme: summary.todayByTheme,
    weekByTheme: summary.weekByTheme,
    streak: summary.streak,
    goalMap,
  })
}
