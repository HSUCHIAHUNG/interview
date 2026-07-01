import { integer, jsonb, pgTable, serial, text, timestamp, boolean, unique } from 'drizzle-orm/pg-core'

export const topics = pgTable('topics', {
  id: serial('id').primaryKey(),
  slug: text('slug').unique().notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  difficulty: text('difficulty').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const questions = pgTable('questions', {
  id: serial('id').primaryKey(),
  topicId: integer('topic_id').references(() => topics.id).notNull(),
  order: integer('order').notNull(),
  question: text('question').notNull(),
  options: jsonb('options').$type<string[]>(),
  answer: integer('answer'),
  explanation: text('explanation').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const userAnswers = pgTable('user_answers', {
  id: serial('id').primaryKey(),
  clerkId: text('clerk_id').notNull(),
  questionId: integer('question_id').references(() => questions.id).notNull(),
  mode: text('mode').notNull(),
  answer: text('answer').notNull(),
  isCorrect: boolean('is_correct'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const userProgress = pgTable('user_progress', {
  id: serial('id').primaryKey(),
  clerkId: text('clerk_id').notNull(),
  topicSlug: text('topic_slug').notNull(),
  mode: text('mode').notNull(),
  currentQuestion: integer('current_question').notNull().default(0),
  quizAnswers: jsonb('quiz_answers').$type<(number | null)[]>(),
  completedIds: jsonb('completed_ids').$type<number[]>().default([]),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => [
  unique('user_progress_uniq').on(t.clerkId, t.topicSlug, t.mode),
])

export const userTopicCompletions = pgTable('user_topic_completions', {
  id: serial('id').primaryKey(),
  clerkId: text('clerk_id').notNull(),
  topicSlug: text('topic_slug').notNull(),
  completedAt: timestamp('completed_at').defaultNow().notNull(),
}, (t) => [
  unique('user_topic_completion_uniq').on(t.clerkId, t.topicSlug),
])

export type Topic = typeof topics.$inferSelect
export type Question = typeof questions.$inferSelect
export type UserAnswer = typeof userAnswers.$inferSelect
export type UserProgress = typeof userProgress.$inferSelect
