import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { resetDeckReviewed } from '@/lib/db/queries'
import { parseId } from '@/lib/flashcards/id'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ deckId: string }> },
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { deckId: deckIdStr } = await params
  const deckId = parseId(deckIdStr)
  if (deckId === null) return NextResponse.json({ error: 'Invalid deck id' }, { status: 400 })

  const ok = await resetDeckReviewed(deckId, userId)
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  revalidatePath('/flashcards')
  revalidatePath(`/flashcards/${deckId}`)
  return NextResponse.json({ ok: true })
}
