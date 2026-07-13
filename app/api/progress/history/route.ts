import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getWeeklyHistory, saveWeekNote } from '@/lib/db/queries'

export const dynamic = 'force-dynamic'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const weeks = await getWeeklyHistory(userId)
  return NextResponse.json({ weeks })
}

export async function PUT(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { weekStart, note } = await req.json() as { weekStart: string; note: string }
  if (!weekStart || typeof note !== 'string') {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  await saveWeekNote(userId, weekStart, note)
  return NextResponse.json({ ok: true })
}
