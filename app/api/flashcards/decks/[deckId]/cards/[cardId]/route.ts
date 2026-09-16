import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { updateCard, deleteCard } from '@/lib/db/queries'

function parseId(s: string): number | null {
  return /^\d+$/.test(s) ? parseInt(s, 10) : null
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ deckId: string; cardId: string }> },
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { deckId: deckIdStr, cardId: cardIdStr } = await params
  const deckId = parseId(deckIdStr)
  const cardId = parseId(cardIdStr)
  if (deckId === null || cardId === null) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const { front, back } = await req.json() as { front?: string; back?: string }

  const ok = await updateCard(cardId, deckId, userId, front?.trim() ?? '', back?.trim() ?? '')
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ ok: true })
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ deckId: string; cardId: string }> },
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { deckId: deckIdStr, cardId: cardIdStr } = await params
  const deckId = parseId(deckIdStr)
  const cardId = parseId(cardIdStr)
  if (deckId === null || cardId === null) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const ok = await deleteCard(cardId, deckId, userId)
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ ok: true })
}
