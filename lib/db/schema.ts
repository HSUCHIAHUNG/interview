import { integer, jsonb, pgTable, serial, text, timestamp, boolean, unique } from 'drizzle-orm/pg-core'

export const topics = pgTable('topics', {
  id: serial('id').primaryKey(),
  slug: text('slug').unique().notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  theme: text('theme').notNull().default('JavaScript'),
  subCategory: text('sub_category'),
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
  qaAnswers: jsonb('qa_answers').$type<(string | null)[]>(),
  completedIds: jsonb('completed_ids').$type<number[]>().default([]),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => [
  unique('user_progress_uniq').on(t.clerkId, t.topicSlug, t.mode),
])

export const themeSubCategories = pgTable('theme_sub_categories', {
  id: serial('id').primaryKey(),
  theme: text('theme').notNull(),
  name: text('name').notNull(),
  order: integer('order').notNull().default(0),
}, (t) => [
  unique('theme_sub_category_uniq').on(t.theme, t.name),
])

export const userTopicCompletions = pgTable('user_topic_completions', {
  id: serial('id').primaryKey(),
  clerkId: text('clerk_id').notNull(),
  topicSlug: text('topic_slug').notNull(),
  completedAt: timestamp('completed_at').defaultNow().notNull(),
}, (t) => [
  unique('user_topic_completion_uniq').on(t.clerkId, t.topicSlug),
])

export const userProblemCompletions = pgTable('user_problem_completions', {
  id: serial('id').primaryKey(),
  clerkId: text('clerk_id').notNull(),
  topicSlug: text('topic_slug').notNull(),
  problemId: text('problem_id').notNull(),
  completedAt: timestamp('completed_at').defaultNow().notNull(),
}, (t) => [
  unique('user_problem_completion_uniq').on(t.clerkId, t.topicSlug, t.problemId),
])

export type Topic = typeof topics.$inferSelect
export type Question = typeof questions.$inferSelect
export type UserAnswer = typeof userAnswers.$inferSelect
export type UserProgress = typeof userProgress.$inferSelect
