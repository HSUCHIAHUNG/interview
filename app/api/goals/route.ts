import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getWeeklyGoals, setWeeklyGoal, getTopicCountByTheme } from '@/lib/db/queries'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [goals, maxByTheme] = await Promise.all([
    getWeeklyGoals(userId),
    getTopicCountByTheme(),
  ])

  return NextResponse.json({ goals, maxByTheme })
}

export async function PUT(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json() as { theme?: string; weeklyGoal?: number }
  if (!body.theme || body.weeklyGoal === undefined) {
    return NextResponse.json({ error: 'theme and weeklyGoal required' }, { status: 400 })
  }

  const goal = Math.max(0, Math.floor(body.weeklyGoal))

  // Validate against total topic count for theme
  const maxByTheme = await getTopicCountByTheme()
  const max = maxByTheme.find(m => m.theme === body.theme)?.count ?? 0
  if (goal > max) {
    return NextResponse.json({ error: `目標不能超過該主題現有題數（${max} 題）` }, { status: 400 })
  }

  await setWeeklyGoal(userId, body.theme, goal)
  return NextResponse.json({ ok: true })
}
