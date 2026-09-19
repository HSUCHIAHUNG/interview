import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { createFolder } from '@/lib/db/queries'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name } = await req.json() as { name?: string }
  if (!name?.trim()) return NextResponse.json({ error: 'name is required' }, { status: 400 })

  const folder = await createFolder(userId, name.trim())
  revalidatePath('/flashcards')
  return NextResponse.json({ id: folder.id, name: folder.name })
}
