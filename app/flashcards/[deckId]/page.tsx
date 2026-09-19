import { auth } from '@clerk/nextjs/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getDeckWithCards, getFolderNamesForUser } from '@/lib/db/queries'
import { parseId } from '@/lib/flashcards/id'
import DeckClient from './DeckClient'
import ReviewSummary from './ReviewSummary'
import DeckNameEditor from './DeckNameEditor'
import DeckFolderSelector from './DeckFolderSelector'

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

  const folderId = result.deck.folderId
  const folders = await getFolderNamesForUser(userId)
  const currentFolder = folderId !== null ? folders.find(f => f.id === folderId) ?? null : null
  const backHref = currentFolder ? `/flashcards/folders/${currentFolder.id}` : '/flashcards/unassigned'
  const backLabel = currentFolder ? `📁 ${currentFolder.name}` : '📄 未分類'

  return (
    <main className="min-h-screen bg-gray-950 px-6 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link href={backHref} className="text-sm text-gray-500 hover:text-gray-300 transition">← {backLabel}</Link>
          <span className="text-gray-700">/</span>
          <DeckNameEditor deckId={deckId} initialName={result.deck.name} />
          <Link
            href={`/flashcards/${deckId}/review`}
            className="text-sm px-3 py-1.5 rounded-md bg-emerald-700 text-white hover:bg-emerald-600 transition"
          >
            📖 開始複習
          </Link>
        </div>
        <DeckFolderSelector deckId={deckId} folders={folders} initialFolderId={folderId} />
        <ReviewSummary
          deckId={deckId}
          cardCount={result.cards.length}
          initialReviewedCount={result.cards.filter(c => c.reviewedAt !== null).length}
        />
        <DeckClient deckId={deckId} initialCards={result.cards} />
      </div>
    </main>
  )
}
