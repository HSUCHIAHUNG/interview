import { auth } from '@clerk/nextjs/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getDeckWithCards } from '@/lib/db/queries'
import { parseId } from '@/lib/flashcards/id'
import DeckClient from './DeckClient'

export default async function FlashcardDeckPage({
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
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/flashcards" className="text-sm text-gray-500 hover:text-gray-300 transition">← 題組列表</Link>
          <span className="text-gray-700">/</span>
          <h1 className="text-xl font-bold text-gray-100">🗂️ {result.deck.name}</h1>
        </div>
        <DeckClient deckId={deckId} initialCards={result.cards} />
      </div>
    </main>
  )
}
