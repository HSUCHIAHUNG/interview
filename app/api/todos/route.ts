import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { userTodos } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ data: { sections: [] } })

  const rows = await db
    .select({ data: userTodos.data, updatedAt: userTodos.updatedAt })
    .from(userTodos)
    .where(eq(userTodos.userId, userId))

  if (rows.length === 0) return NextResponse.json({ data: { sections: [] }, updatedAt: null })
  return NextResponse.json(rows[0])
}

export async function PUT(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await req.json()
  if (!data || typeof data !== 'object') {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }

  const [row] = await db
    .insert(userTodos)
    .values({ userId, data })
    .onConflictDoUpdate({
      target: userTodos.userId,
      set: { data, updatedAt: new Date() },
    })
    .returning({ updatedAt: userTodos.updatedAt })

  return NextResponse.json({ updatedAt: row.updatedAt })
}
