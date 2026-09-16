import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { addCard, getMaxCardOrder } from '@/lib/db/queries'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ deckId: string }> },
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { deckId: deckIdStr } = await params
  if (!/^\d+$/.test(deckIdStr)) return NextResponse.json({ error: 'Invalid deck id' }, { status: 400 })
  const deckId = parseInt(deckIdStr, 10)

  const { front, back } = await req.json() as { front?: string; back?: string }

  const maxOrder = await getMaxCardOrder(deckId)
  const row = await addCard(deckId, userId, front?.trim() ?? '', back?.trim() ?? '', maxOrder + 1)
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ id: row.id })
}
