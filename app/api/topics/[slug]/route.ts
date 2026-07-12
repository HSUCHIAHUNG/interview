import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { topics } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug } = await params
  const { title } = await req.json()
  if (!title || typeof title !== 'string' || !title.trim()) {
    return NextResponse.json({ error: 'Invalid title' }, { status: 400 })
  }

  await db.update(topics).set({ title: title.trim() }).where(eq(topics.slug, slug))
  return NextResponse.json({ ok: true })
}
