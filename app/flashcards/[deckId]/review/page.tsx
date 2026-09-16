import { auth } from '@clerk/nextjs/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getDeckWithCards } from '@/lib/db/queries'
import { parseId } from '@/lib/flashcards/id'
import ReviewClient from './ReviewClient'

export default async function FlashcardReviewPage({
  params,
}: {
  params: Promise<{ deckId: string }>
}) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const { deckId: deckIdStr } = await params
  const deckId = parseId(deckIdStr)
  if (deckId === null) notFound()

  const result = await getDeckWithCards(deckId, userId)
  if (!result) notFound()

  return (
    <main className="min-h-screen bg-gray-950 px-6 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link href={`/flashcards/${deckId}`} className="text-sm text-gray-500 hover:text-gray-300 transition">← {result.deck.name}</Link>
          <span className="text-gray-700">/</span>
          <h1 className="text-xl font-bold text-gray-100">📖 複習</h1>
        </div>
        <ReviewClient
          deckId={deckId}
          cards={result.cards.map(c => ({ id: c.id, front: c.front, back: c.back }))}
        />
      </div>
    </main>
  )
}
