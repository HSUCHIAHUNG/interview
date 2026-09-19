import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getDecksInFolder } from '@/lib/db/queries'
import DecksListClient from '../DecksListClient'

export default async function UnassignedDecksPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const decks = await getDecksInFolder(null, userId)

  return (
    <main className="min-h-screen bg-gray-950 px-6 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/flashcards" className="text-sm text-gray-500 hover:text-gray-300 transition">← 資料夾列表</Link>
          <span className="text-gray-700">/</span>
          <h1 className="text-xl font-bold text-gray-100">📄 未分類</h1>
        </div>
        <DecksListClient initialDecks={decks} newDeckHref="/flashcards/new" />
      </div>
    </main>
  )
}
