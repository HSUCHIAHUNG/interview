import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { deleteFolder, getDecksInFolder } from '@/lib/db/queries'
import { parseId } from '@/lib/flashcards/id'

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ folderId: string }> },
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { folderId: folderIdStr } = await params
  const folderId = parseId(folderIdStr)
  if (folderId === null) return NextResponse.json({ error: 'Invalid folder id' }, { status: 400 })

  // fetch before deleting: these decks move to unassigned, their own pages need revalidating too
  const affectedDecks = await getDecksInFolder(folderId, userId)

  const ok = await deleteFolder(folderId, userId)
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  revalidatePath('/flashcards')
  revalidatePath('/flashcards/unassigned')
  revalidatePath(`/flashcards/folders/${folderId}`)
  for (const deck of affectedDecks) {
    revalidatePath(`/flashcards/${deck.id}`)
  }
  return NextResponse.json({ ok: true })
}
