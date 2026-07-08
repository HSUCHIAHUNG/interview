import { NextResponse } from 'next/server'
import { createKeyPoint } from '@/lib/db/queries'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const body = await req.json() as { text?: string }
  const text = body.text?.trim()
  if (!text) return NextResponse.json({ error: 'text is required' }, { status: 400 })

  const { id } = await createKeyPoint(slug, text)
  return NextResponse.json({ id })
}
