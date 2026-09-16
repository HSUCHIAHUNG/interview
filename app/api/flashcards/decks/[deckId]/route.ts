import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getDeckWithCards } from '@/lib/db/queries'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ deckId: string }> },
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { deckId: deckIdStr } = await params
  if (!/^\d+$/.test(deckIdStr)) return NextResponse.json({ error: 'Invalid deck id' }, { status: 400 })
  const deckId = parseInt(deckIdStr, 10)

  const result = await getDeckWithCards(deckId, userId)
  if (!result) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(result)
}
