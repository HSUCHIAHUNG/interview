import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createNoteSection, getMaxNoteSectionOrder } from '@/lib/db/queries'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug } = await params
  const { heading, content } = await req.json() as { heading?: string; content?: string }
  if (!heading?.trim() || !content?.trim()) {
    return NextResponse.json({ error: 'heading and content required' }, { status: 400 })
  }

  const maxOrder = await getMaxNoteSectionOrder(slug)
  const row = await createNoteSection(slug, heading.trim(), content.trim(), maxOrder + 1)
  return NextResponse.json({ id: row.id })
}
