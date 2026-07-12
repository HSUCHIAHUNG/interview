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
  order: integer('order').notNull().default(0),
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
}, (t) => [
  unique('questions_topic_id_order_uniq').on(t.topicId, t.order),
])

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

export const topicNoteSections = pgTable('topic_note_sections', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull(),
  heading: text('heading').notNull(),
  content: text('content').notNull(),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const methodKeyPoints = pgTable('method_key_points', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull(),
  text: text('text').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const userProblemCompletions = pgTable('user_problem_completions', {
  id: serial('id').primaryKey(),
  clerkId: text('clerk_id').notNull(),
  topicSlug: text('topic_slug').notNull(),
  problemId: text('problem_id').notNull(),
  completedAt: timestamp('completed_at').defaultNow().notNull(),
}, (t) => [
  unique('user_problem_completion_uniq').on(t.clerkId, t.topicSlug, t.problemId),
])

export const userWeeklyGoals = pgTable('user_weekly_goals', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  theme: text('theme').notNull(),
  weeklyGoal: integer('weekly_goal').notNull().default(0),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => [
  unique('user_weekly_goals_uniq').on(t.userId, t.theme),
])

export const userQuestionLog = pgTable('user_question_log', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  topicSlug: text('topic_slug').notNull(),
  mode: text('mode').notNull(),
  loggedAt: timestamp('logged_at').defaultNow().notNull(),
})

export const userStarredProblems = pgTable('user_starred_problems', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  topicSlug: text('topic_slug').notNull(),
  problemId: text('problem_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => [
  unique('user_starred_problem_uniq').on(t.userId, t.topicSlug, t.problemId),
])

export const userStarredQuestions = pgTable('user_starred_questions', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  questionId: integer('question_id').references(() => questions.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => [
  unique('user_starred_q_uniq').on(t.userId, t.questionId),
])

export const userNotes = pgTable('user_notes', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().unique(),
  content: text('content').notNull().default(''),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type Topic = typeof topics.$inferSelect
export type Question = typeof questions.$inferSelect
export type UserAnswer = typeof userAnswers.$inferSelect
export type UserProgress = typeof userProgress.$inferSelect
