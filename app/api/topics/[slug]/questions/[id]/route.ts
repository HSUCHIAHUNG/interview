import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { updateQuestion, deleteQuestion } from '@/lib/db/queries'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string; id: string }> },
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: idStr } = await params
  const id = parseInt(idStr, 10)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const body = await req.json() as {
    question?: string
    options?: string[]
    answer?: number
    explanation?: string
  }

  if (!body.question?.trim() || !body.explanation?.trim()) {
    return NextResponse.json({ error: 'question and explanation required' }, { status: 400 })
  }

  await updateQuestion(id, body.question.trim(), body.options ?? [], body.answer ?? 0, body.explanation.trim())
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

  await deleteQuestion(id)
  return NextResponse.json({ ok: true })
}
