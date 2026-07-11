import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { userNotes } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ content: '' })

  const rows = await db
    .select({ content: userNotes.content, updatedAt: userNotes.updatedAt })
    .from(userNotes)
    .where(eq(userNotes.userId, userId))

  if (rows.length === 0) return NextResponse.json({ content: '', updatedAt: null })
  return NextResponse.json(rows[0])
}

export async function PUT(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { content } = await req.json()
  if (typeof content !== 'string') {
    return NextResponse.json({ error: 'Invalid content' }, { status: 400 })
  }

  const [row] = await db
    .insert(userNotes)
    .values({ userId, content })
    .onConflictDoUpdate({
      target: userNotes.userId,
      set: { content, updatedAt: new Date() },
    })
    .returning({ updatedAt: userNotes.updatedAt })

  return NextResponse.json({ updatedAt: row.updatedAt })
}
