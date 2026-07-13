import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getStarredQuestions, getStarredProblemRows } from '@/lib/db/queries'
import { getPracticeChallenge } from '@/lib/array-challenges'
import type { StarredProblemItem } from '@/app/starred/types'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')
  const cursorParam = searchParams.get('cursor')
  const cursor = cursorParam ? parseInt(cursorParam, 10) : undefined

  if (type === 'questions') {
    const { items, nextCursor } = await getStarredQuestions(userId, cursor)
    return NextResponse.json({ questions: items, nextCursor })
  }

  if (type === 'problems') {
    const { items, nextCursor } = await getStarredProblemRows(userId, cursor)
    const problems: StarredProblemItem[] = items.flatMap(row => {
      const entry = getPracticeChallenge(row.topicSlug)
      if (!entry) return []
      const problem = entry.problems.find(p => p.id === row.problemId)
      if (!problem) return []
      return [{
        topicSlug: row.topicSlug,
        problemId: row.problemId,
        problemTitle: problem.title,
        problemDescription: problem.description,
        difficulty: problem.difficulty as 'easy' | 'medium' | 'hard',
        topicTitle: entry.title,
      }]
    })
    return NextResponse.json({ problems, nextCursor })
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
}
