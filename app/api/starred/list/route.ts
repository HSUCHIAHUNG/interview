import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getStarredQuestions, getStarredProblemRows, getTopicThemesBySlug } from '@/lib/db/queries'
import { getPracticeChallenge } from '@/lib/array-challenges'
import type { StarredProblemItem } from '@/app/starred/types'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')

  if (type === 'questions') {
    const items = await getStarredQuestions(userId)
    return NextResponse.json({ questions: items })
  }

  if (type === 'problems') {
    const items = await getStarredProblemRows(userId)
    const slugs = [...new Set(items.map(r => r.topicSlug))]
    const themeMap = await getTopicThemesBySlug(slugs)
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
        theme: themeMap[row.topicSlug] ?? '',
      }]
    })
    return NextResponse.json({ problems })
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
}
