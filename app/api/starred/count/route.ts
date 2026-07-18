import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getStarredCounts } from '@/lib/db/queries'

export const dynamic = 'force-dynamic'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const counts = await getStarredCounts(userId)
  return NextResponse.json(counts)
}
