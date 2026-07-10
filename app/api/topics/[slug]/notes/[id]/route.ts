import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { updateNoteSection, deleteNoteSection, updateNoteSectionOrder } from '@/lib/db/queries'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string; id: string }> },
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: idStr } = await params
  const id = parseInt(idStr, 10)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const body = await req.json() as { heading?: string; content?: string; order?: number }

  if (body.order !== undefined) {
    await updateNoteSectionOrder(id, body.order)
  } else {
    const { heading, content } = body
    if (!heading?.trim() || !content?.trim()) {
      return NextResponse.json({ error: 'heading and content required' }, { status: 400 })
    }
    await updateNoteSection(id, heading.trim(), content.trim())
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string; id: string }> },
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: idStr } = await params
  const id = parseInt(idStr, 10)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  await deleteNoteSection(id)
  return NextResponse.json({ ok: true })
}
