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
  for (const g of goals) goalMap[g.theme] = g.weeklyGoal

  // Compute ISO week range (Monday–Sunday) in UTC to match DB date_trunc('week')
  const now = new Date()
  const dayOfWeek = now.getUTCDay() // 0=Sun
  const mondayOffset = (dayOfWeek + 6) % 7
  const weekStart = new Date(now)
  weekStart.setUTCDate(now.getUTCDate() - mondayOffset)
  weekStart.setUTCHours(0, 0, 0, 0)
  const weekEnd = new Date(weekStart)
  weekEnd.setUTCDate(weekStart.getUTCDate() + 6)

  return NextResponse.json({
    todayByTheme: summary.todayByTheme,
    weekByTheme: summary.weekByTheme,
    streak: summary.streak,
    goalMap,
    weekStart: weekStart.toISOString().split('T')[0],
    weekEnd: weekEnd.toISOString().split('T')[0],
  })
}
