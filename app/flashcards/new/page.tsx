import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getFolder } from '@/lib/db/queries'
import { parseId } from '@/lib/flashcards/id'
import NewDeckClient from './NewDeckClient'

export default async function NewFlashcardDeckPage({
  searchParams,
}: {
  searchParams: Promise<{ folderId?: string }>
}) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const { folderId: folderIdStr } = await searchParams
  const requestedFolderId = folderIdStr ? parseId(folderIdStr) : null
  const folder = requestedFolderId !== null ? await getFolder(requestedFolderId, userId) : null
  const folderId = folder?.id ?? null

  const backHref = folderId !== null ? `/flashcards/folders/${folderId}` : '/flashcards/unassigned'
  const backLabel = folder ? `📁 ${folder.name}` : '📄 未分類'

  return (
    <main className="min-h-screen bg-gray-950 px-6 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link href={backHref} className="text-sm text-gray-500 hover:text-gray-300 transition">← {backLabel}</Link>
          <span className="text-gray-700">/</span>
          <h1 className="text-xl font-bold text-gray-100">🗂️ 建立 Flashcards 題組</h1>
        </div>
        <NewDeckClient folderId={folderId} />
      </div>
    </main>
  )
}
