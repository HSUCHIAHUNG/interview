import { NextResponse } from 'next/server'
import { del } from '@vercel/blob'
import { deleteKeyPoint } from '@/lib/db/queries'

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string; id: string }> },
) {
  const { slug, id: idStr } = await params
  const id = parseInt(idStr, 10)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  await deleteKeyPoint(id)

  // Delete cached audio blob (non-fatal if missing)
  await del(`audio/${slug}/${id}.wav`).catch(() => {})

  return NextResponse.json({ ok: true })
}
