import { NextResponse } from 'next/server'
import { list, del } from '@vercel/blob'

// DELETE /api/tts/[slug] — clears all cached audio for a method
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params

  try {
    const { blobs } = await list({ prefix: `audio/${slug}/` })
    if (blobs.length > 0) {
      await del(blobs.map(b => b.url))
    }
    return NextResponse.json({ ok: true, cleared: slug })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to clear cache', detail: String(e) }, { status: 500 })
  }
}
