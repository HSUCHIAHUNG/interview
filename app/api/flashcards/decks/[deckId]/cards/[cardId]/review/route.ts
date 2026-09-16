import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { markCardReviewed } from '@/lib/db/queries'
import { parseId } from '@/lib/flashcards/id'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ deckId: string; cardId: string }> },
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { deckId: deckIdStr, cardId: cardIdStr } = await params
  const deckId = parseId(deckIdStr)
  const cardId = parseId(cardIdStr)
  if (deckId === null || cardId === null) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const ok = await markCardReviewed(cardId, deckId, userId)
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ ok: true })
}
