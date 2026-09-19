import { auth } from '@clerk/nextjs/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getFolder, getDecksInFolder } from '@/lib/db/queries'
import { parseId } from '@/lib/flashcards/id'
import DecksListClient from '../../DecksListClient'

export default async function FlashcardFolderPage({
  params,
}: {
  params: Promise<{ folderId: string }>
}) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const { folderId: folderIdStr } = await params
  const folderId = parseId(folderIdStr)
  if (folderId === null) notFound()

  const folder = await getFolder(folderId, userId)
  if (!folder) notFound()

  const decks = await getDecksInFolder(folderId, userId)

  return (
    <main className="min-h-screen bg-gray-950 px-6 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/flashcards" className="text-sm text-gray-500 hover:text-gray-300 transition">← 資料夾列表</Link>
          <span className="text-gray-700">/</span>
          <h1 className="text-xl font-bold text-gray-100">📁 {folder.name}</h1>
        </div>
        <DecksListClient initialDecks={decks} newDeckHref={`/flashcards/new?folderId=${folderId}`} />
      </div>
    </main>
  )
}
