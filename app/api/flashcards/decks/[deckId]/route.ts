import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getDeckWithCards, deleteDeck } from '@/lib/db/queries'
import { parseId } from '@/lib/flashcards/id'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ deckId: string }> },
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { deckId: deckIdStr } = await params
  const deckId = parseId(deckIdStr)
  if (deckId === null) return NextResponse.json({ error: 'Invalid deck id' }, { status: 400 })

  const result = await getDeckWithCards(deckId, userId)
  if (!result) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(result)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ deckId: string }> },
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { deckId: deckIdStr } = await params
  const deckId = parseId(deckIdStr)
  if (deckId === null) return NextResponse.json({ error: 'Invalid deck id' }, { status: 400 })

  const ok = await deleteDeck(deckId, userId)
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ ok: true })
}
