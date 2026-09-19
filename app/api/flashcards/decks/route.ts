import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { createDeckWithCards } from '@/lib/db/queries'
import { todayStr } from '@/lib/flashcards/date'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json() as { name?: string; cards?: { front?: string; back?: string }[]; folderId?: number }
  const name = body.name?.trim() || todayStr()
  const cards = (body.cards ?? [])
    .map(c => ({ front: c.front?.trim() ?? '', back: c.back?.trim() ?? '' }))
    .filter(c => c.front !== '' || c.back !== '')
  const folderId = typeof body.folderId === 'number' ? body.folderId : null

  if (cards.length === 0) {
    return NextResponse.json({ error: 'At least one card is required' }, { status: 400 })
  }

  const deck = await createDeckWithCards(userId, name, cards, folderId)
  revalidatePath('/flashcards')
  if (folderId !== null) revalidatePath(`/flashcards/folders/${folderId}`)
  else revalidatePath('/flashcards/unassigned')
  return NextResponse.json({ id: deck.id })
}
