import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getThemeHistory } from '@/lib/db/queries'

export const dynamic = 'force-dynamic'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const themes = await getThemeHistory(userId)
  return NextResponse.json({ themes })
}
