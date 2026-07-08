import { eq, sql, and, inArray } from 'drizzle-orm'
import { db } from './index'
import { topics, questions, userProgress, userTopicCompletions, themeSubCategories, userProblemCompletions, methodKeyPoints } from './schema'
import type { TopicMeta, Question } from '@/lib/topics'

export type TopicCard = {
  slug: string
  meta: TopicMeta
  questionCount: number
  theme: string
  subCategory: string | null
}

export type TopicWithQuestions = {
  slug: string
  meta: TopicMeta
  questions: Question[]
}

export async function getAllTopicsFromDB(): Promise<TopicCard[]> {
  const rows = await db
    .select({
      slug: topics.slug,
      title: topics.title,
      description: topics.description,
      theme: topics.theme,
      subCategory: topics.subCategory,
      category: topics.category,
      difficulty: topics.difficulty,
      questionCount: sql<number>`count(${questions.id})::int`,
    })
    .from(topics)
    .leftJoin(questions, eq(topics.id, questions.topicId))
    .groupBy(
      topics.id,
      topics.slug,
      topics.title,
      topics.description,
      topics.theme,
      topics.subCategory,
      topics.category,
      topics.difficulty,
    )
    .orderBy(topics.slug)

  return rows.map(r => ({
    slug: r.slug,
    meta: {
      title: r.title,
      description: r.description,
      category: r.category as TopicMeta['category'],
      difficulty: r.difficulty as TopicMeta['difficulty'],
    },
    questionCount: r.questionCount ?? 0,
    theme: r.theme,
    subCategory: r.subCategory,
  }))
}

export async function getTopicFromDB(slug: string): Promise<TopicWithQuestions | null> {
  const [topic] = await db
    .select()
    .from(topics)
    .where(eq(topics.slug, slug))
    .limit(1)

  if (!topic) return null

  const qs = await db
    .select()
    .from(questions)
    .where(eq(questions.topicId, topic.id))
    .orderBy(questions.order)

  return {
    slug: topic.slug,
    meta: {
      title: topic.title,
      description: topic.description,
      category: topic.category as TopicMeta['category'],
      difficulty: topic.difficulty as TopicMeta['difficulty'],
    },
    questions: qs.map(q => ({
      id: q.id,
      question: q.question,
      options: (q.options as string[]) ?? [],
      answer: q.answer ?? 0,
      explanation: q.explanation,
    })),
  }
}

export async function getTopicSlugsFromDB(): Promise<string[]> {
  const rows = await db.select({ slug: topics.slug }).from(topics).orderBy(topics.slug)
  return rows.map(r => r.slug)
}

export async function getUserProgress(
  clerkId: string,
  topicSlug: string,
  mode: string,
): Promise<{ currentQuestion: number; quizAnswers: (number | null)[] | null; qaAnswers: (string | null)[] | null }> {
  const [row] = await db
    .select()
    .from(userProgress)
    .where(
      and(
        eq(userProgress.clerkId, clerkId),
        eq(userProgress.topicSlug, topicSlug),
        eq(userProgress.mode, mode),
      ),
    )
    .limit(1)

  return {
    currentQuestion: row?.currentQuestion ?? 0,
    quizAnswers: (row?.quizAnswers as (number | null)[] | null) ?? null,
    qaAnswers: (row?.qaAnswers as (string | null)[] | null) ?? null,
  }
}

export async function getSubCategoriesByTheme(theme: string): Promise<string[]> {
  const rows = await db
    .select({ name: themeSubCategories.name })
    .from(themeSubCategories)
    .where(eq(themeSubCategories.theme, theme))
    .orderBy(themeSubCategories.order)
  return rows.map(r => r.name)
}

export async function getUserCompletedTopics(clerkId: string): Promise<Set<string>> {
  const rows = await db
    .select({ topicSlug: userTopicCompletions.topicSlug })
    .from(userTopicCompletions)
    .where(eq(userTopicCompletions.clerkId, clerkId))

  return new Set(rows.map(r => r.topicSlug))
}

export async function getUserCompletedProblems(clerkId: string, topicSlug: string): Promise<Set<string>> {
  const rows = await db
    .select({ problemId: userProblemCompletions.problemId })
    .from(userProblemCompletions)
    .where(and(
      eq(userProblemCompletions.clerkId, clerkId),
      eq(userProblemCompletions.topicSlug, topicSlug),
    ))
  return new Set(rows.map(r => r.problemId))
}

export async function getUserPracticeProgress(clerkId: string): Promise<Map<string, number>> {
  const rows = await db
    .select({
      topicSlug: userProblemCompletions.topicSlug,
      count: sql<number>`count(*)::int`,
    })
    .from(userProblemCompletions)
    .where(eq(userProblemCompletions.clerkId, clerkId))
    .groupBy(userProblemCompletions.topicSlug)
  return new Map(rows.map(r => [r.topicSlug, r.count]))
}

export async function markProblemComplete(clerkId: string, topicSlug: string, problemId: string): Promise<void> {
  await db
    .insert(userProblemCompletions)
    .values({ clerkId, topicSlug, problemId })
    .onConflictDoNothing()
}

export async function getKeyPointsBySlug(slug: string): Promise<{ id: number; text: string }[]> {
  const rows = await db
    .select({ id: methodKeyPoints.id, text: methodKeyPoints.text })
    .from(methodKeyPoints)
    .where(eq(methodKeyPoints.slug, slug))
    .orderBy(methodKeyPoints.id)
  return rows
}

export async function getKeyPointById(id: number): Promise<{ slug: string; text: string } | null> {
  const [row] = await db
    .select({ slug: methodKeyPoints.slug, text: methodKeyPoints.text })
    .from(methodKeyPoints)
    .where(eq(methodKeyPoints.id, id))
    .limit(1)
  return row ?? null
}

export async function createKeyPoint(slug: string, text: string): Promise<{ id: number }> {
  const [row] = await db
    .insert(methodKeyPoints)
    .values({ slug, text })
    .returning({ id: methodKeyPoints.id })
  return row
}

export async function deleteKeyPoint(id: number): Promise<void> {
  await db.delete(methodKeyPoints).where(eq(methodKeyPoints.id, id))
}
