export const dynamic = 'force-dynamic'

import { getQuestionsByTheme } from '@/lib/db/queries'
import { arrayMethodChallenges } from '@/lib/array-challenges'
import RandomQuizSetup from './RandomQuizSetup'

export default async function QuizPage() {
  const [jsQuestions, arrayMethodChallengesData] = await Promise.all([
    getQuestionsByTheme('JavaScript'),
    Promise.resolve(arrayMethodChallenges),
  ])

  // Flatten all practice problems from all array methods
  const allPracticeProblems = arrayMethodChallengesData.flatMap(entry =>
    entry.problems.map(problem => ({
      slug: entry.slug,
      methodName: entry.methodName,
      entry,
      problem,
    }))
  )

  return (
    <main className="min-h-screen bg-gray-950 px-6 py-12">
      <RandomQuizSetup
        jsQuestions={jsQuestions}
        allPracticeProblems={allPracticeProblems}
      />
    </main>
  )
}
