import { eq, sql, and, inArray } from 'drizzle-orm'
import { db } from './index'
import { topics, questions, userProgress, userTopicCompletions } from './schema'
import type { TopicMeta, Question } from '@/lib/topics'

export type TopicCard = {
  slug: string
  meta: TopicMeta
  questionCount: number
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

export async function getUserCompletedTopics(clerkId: string): Promise<Set<string>> {
  const rows = await db
    .select({ topicSlug: userTopicCompletions.topicSlug })
    .from(userTopicCompletions)
    .where(eq(userTopicCompletions.clerkId, clerkId))

  return new Set(rows.map(r => r.topicSlug))
}
