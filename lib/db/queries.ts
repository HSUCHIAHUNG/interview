import { eq, sql, and, inArray, gte, gt, asc } from 'drizzle-orm'
import { db } from './index'
import { topics, questions, userProgress, userTopicCompletions, themeSubCategories, userProblemCompletions, methodKeyPoints, topicNoteSections, userWeeklyGoals, userQuestionLog, userStarredQuestions, userStarredProblems, userWeekNotes } from './schema'
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
      topicOrder: topics.order,
      questionCount: sql<number>`count(${questions.id})::int`,
      subCategoryOrder: sql<number>`min(coalesce(${themeSubCategories.order}, 999))`,
    })
    .from(topics)
    .leftJoin(questions, eq(topics.id, questions.topicId))
    .leftJoin(
      themeSubCategories,
      and(
        eq(themeSubCategories.theme, topics.theme),
        eq(themeSubCategories.name, topics.subCategory!),
      ),
    )
    .groupBy(
      topics.id,
      topics.slug,
      topics.title,
      topics.description,
      topics.theme,
      topics.subCategory,
      topics.category,
      topics.difficulty,
      topics.order,
    )
    .orderBy(
      sql`min(coalesce(${themeSubCategories.order}, 999))`,
      topics.order,
      topics.slug,
    )

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

export type ThemeTopicSection = {
  slug: string
  title: string
  keyPoints: { id: number; text: string }[]
}

export async function getTopicSectionsByTheme(theme: string): Promise<ThemeTopicSection[]> {
  const themeTopics = await db
    .select({ slug: topics.slug, title: topics.title })
    .from(topics)
    .where(eq(topics.theme, theme))
    .orderBy(topics.title)

  const keyPointRows = await db
    .select({ id: methodKeyPoints.id, text: methodKeyPoints.text, slug: methodKeyPoints.slug })
    .from(methodKeyPoints)
    .where(inArray(methodKeyPoints.slug, themeTopics.map(t => t.slug)))
    .orderBy(methodKeyPoints.id)

  return themeTopics.map(t => ({
    slug: t.slug,
    title: t.title,
    keyPoints: keyPointRows.filter(k => k.slug === t.slug).map(k => ({ id: k.id, text: k.text })),
  }))
}

export async function getDistinctThemes(): Promise<string[]> {
  const rows = await db.selectDistinct({ theme: topics.theme }).from(topics)
  return rows.map(r => r.theme)
}

// ─── Note sections ──────────────────────────────────────────────────────────

export async function getSlugsWithNotes(): Promise<Set<string>> {
  const rows = await db.selectDistinct({ slug: topicNoteSections.slug }).from(topicNoteSections)
  return new Set(rows.map(r => r.slug))
}

export async function getNotesBySlug(slug: string) {
  return db
    .select({ id: topicNoteSections.id, heading: topicNoteSections.heading, content: topicNoteSections.content, order: topicNoteSections.order })
    .from(topicNoteSections)
    .where(eq(topicNoteSections.slug, slug))
    .orderBy(topicNoteSections.order, topicNoteSections.id)
}

export async function createNoteSection(slug: string, heading: string, content: string, order: number) {
  const [row] = await db.insert(topicNoteSections).values({ slug, heading, content, order }).returning({ id: topicNoteSections.id })
  return row
}

export async function updateNoteSection(id: number, heading: string, content: string) {
  await db.update(topicNoteSections).set({ heading, content }).where(eq(topicNoteSections.id, id))
}

export async function deleteNoteSection(id: number) {
  await db.delete(topicNoteSections).where(eq(topicNoteSections.id, id))
}

export async function updateNoteSectionOrder(id: number, order: number) {
  await db.update(topicNoteSections).set({ order }).where(eq(topicNoteSections.id, id))
}

// ─── Questions CRUD ──────────────────────────────────────────────────────────

export async function createQuestion(topicId: number, question: string, options: string[], answer: number, explanation: string, order: number) {
  const [row] = await db.insert(questions).values({ topicId, question, options, answer, explanation, order }).returning({ id: questions.id })
  return row
}

export async function updateQuestion(id: number, question: string, options: string[], answer: number, explanation: string) {
  await db.update(questions).set({ question, options, answer, explanation }).where(eq(questions.id, id))
}

export async function deleteQuestion(id: number) {
  await db.delete(questions).where(eq(questions.id, id))
}

export async function getTopicIdBySlug(slug: string): Promise<number | null> {
  const [row] = await db.select({ id: topics.id }).from(topics).where(eq(topics.slug, slug)).limit(1)
  return row?.id ?? null
}

export async function getTopicNavInfo(slug: string): Promise<{ theme: string; subCategory: string | null } | null> {
  const [row] = await db
    .select({ theme: topics.theme, subCategory: topics.subCategory })
    .from(topics)
    .where(eq(topics.slug, slug))
    .limit(1)
  return row ?? null
}

export async function getMaxQuestionOrder(topicId: number): Promise<number> {
  const [row] = await db.select({ max: sql<number>`coalesce(max("order"), -1)` }).from(questions).where(eq(questions.topicId, topicId))
  return row?.max ?? -1
}

export async function getMaxNoteSectionOrder(slug: string): Promise<number> {
  const [row] = await db.select({ max: sql<number>`coalesce(max("order"), -1)` }).from(topicNoteSections).where(eq(topicNoteSections.slug, slug))
  return row?.max ?? -1
}

export async function getQuestionsByTheme(theme: string): Promise<Question[]> {
  const themeTopics = await db
    .select({ id: topics.id })
    .from(topics)
    .where(eq(topics.theme, theme))

  if (themeTopics.length === 0) return []

  const topicIds = themeTopics.map(t => t.id)
  const rows = await db
    .select()
    .from(questions)
    .where(inArray(questions.topicId, topicIds))
    .orderBy(questions.id)

  return rows.map(q => ({
    id: q.id,
    question: q.question,
    options: (q.options as string[]) ?? [],
    answer: q.answer ?? 0,
    explanation: q.explanation,
  }))
}

// ─── Goals ────────────────────────────────────────────────────────────────────

export async function getWeeklyGoals(userId: string): Promise<{ theme: string; weeklyGoal: number; targetDays: number | null }[]> {
  const rows = await db
    .select({ theme: userWeeklyGoals.theme, weeklyGoal: userWeeklyGoals.weeklyGoal, targetDays: userWeeklyGoals.targetDays })
    .from(userWeeklyGoals)
    .where(eq(userWeeklyGoals.userId, userId))
  return rows
}

export async function setWeeklyGoal(userId: string, theme: string, weeklyGoal: number, targetDays?: number): Promise<void> {
  await db.insert(userWeeklyGoals)
    .values({ userId, theme, weeklyGoal, targetDays: targetDays ?? null, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: [userWeeklyGoals.userId, userWeeklyGoals.theme],
      set: { weeklyGoal, targetDays: targetDays ?? null, updatedAt: new Date() },
    })
}

export async function getTopicCountByTheme(): Promise<{ theme: string; count: number }[]> {
  const rows = await db
    .select({
      theme: topics.theme,
      count: sql<number>`count(${topics.id})::int`,
    })
    .from(topics)
    .groupBy(topics.theme)
  return rows.map(r => ({ theme: r.theme, count: r.count ?? 0 }))
}

// ─── Question log ─────────────────────────────────────────────────────────────

export async function logQuestionAnswered(userId: string, topicSlug: string, mode: string): Promise<void> {
  await db.insert(userQuestionLog).values({ userId, topicSlug, mode })
}

function startOfDay(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

function startOfWeek(): Date {
  const d = startOfDay()
  const day = d.getDay()
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1)) // Monday
  return d
}

export type ProgressSummary = {
  todayByTheme: Record<string, number>
  weekByTheme: Record<string, number>
  startDateByTheme: Record<string, string>
  streak: number
}

export async function getProgressSummary(userId: string): Promise<ProgressSummary> {
  // Count all-time completions per theme, plus today's count and first log date
  const rows = await db
    .select({
      theme: topics.theme,
      totalCount: sql<number>`count(*)::int`,
      todayCount: sql<number>`count(*) filter (where ${userQuestionLog.loggedAt} >= current_date)::int`,
      startDate: sql<string>`min(${userQuestionLog.loggedAt})::date::text`,
    })
    .from(userQuestionLog)
    .innerJoin(topics, eq(userQuestionLog.topicSlug, topics.slug))
    .where(eq(userQuestionLog.userId, userId))
    .groupBy(topics.theme)

  const todayByTheme: Record<string, number> = {}
  const weekByTheme: Record<string, number> = {} // kept for compat; now holds all-time totals
  const startDateByTheme: Record<string, string> = {}
  for (const row of rows) {
    weekByTheme[row.theme] = row.totalCount
    todayByTheme[row.theme] = row.todayCount
    startDateByTheme[row.theme] = row.startDate
  }

  // Streak: distinct practice days (sort in JS to avoid SELECT DISTINCT + ORDER BY constraint)
  const dayRows = await db
    .selectDistinct({ day: sql<string>`date_trunc('day', logged_at)::date::text` })
    .from(userQuestionLog)
    .where(eq(userQuestionLog.userId, userId))

  const days = dayRows.map(r => r.day).sort().reverse()
  const streak = computeStreak(days)

  return { todayByTheme, weekByTheme, startDateByTheme, streak }
}

function computeStreak(days: string[]): number {
  if (days.length === 0) return 0
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  if (days[0] !== today && days[0] !== yesterday) return 0
  let streak = 1
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1])
    const curr = new Date(days[i])
    if ((prev.getTime() - curr.getTime()) / 86400000 === 1) streak++
    else break
  }
  return streak
}

export type MilestoneType =
  | 'daily_goal'
  | 'weekly_25' | 'weekly_50' | 'weekly_75' | 'weekly_100'
  | 'streak_3' | 'streak_7'

export async function logAndCheckMilestone(
  userId: string,
  topicSlug: string,
  mode: string,
): Promise<{ todayCount: number; weekCount: number; streak: number; milestone: MilestoneType | null }> {
  // Log the answer
  await logQuestionAnswered(userId, topicSlug, mode)

  // Get topic theme
  const [topicRow] = await db.select({ theme: topics.theme }).from(topics).where(eq(topics.slug, topicSlug)).limit(1)
  if (!topicRow) return { todayCount: 0, weekCount: 0, streak: 0, milestone: null }
  const theme = topicRow.theme

  // Current counts
  const summary = await getProgressSummary(userId)
  const todayCount = summary.todayByTheme[theme] ?? 0
  const weekCount = summary.weekByTheme[theme] ?? 0
  const { streak } = summary

  // Get goal
  const [goalRow] = await db.select({ weeklyGoal: userWeeklyGoals.weeklyGoal, targetDays: userWeeklyGoals.targetDays })
    .from(userWeeklyGoals)
    .where(and(eq(userWeeklyGoals.userId, userId), eq(userWeeklyGoals.theme, theme)))
    .limit(1)
  const targetCount = goalRow?.weeklyGoal ?? 0
  const targetDays = goalRow?.targetDays ?? null
  // weekCount holds all-time total for this theme
  const totalCount = weekCount

  let milestone: MilestoneType | null = null

  if (targetCount > 0) {
    const dailyTarget = targetDays && targetDays > 0 ? targetCount / targetDays : null
    const pct = (totalCount / targetCount) * 100
    const prevPct = ((totalCount - 1) / targetCount) * 100

    if (dailyTarget && todayCount === Math.ceil(dailyTarget) && todayCount - 1 < Math.ceil(dailyTarget)) {
      milestone = 'daily_goal'
    } else if (pct >= 100 && prevPct < 100) {
      milestone = 'weekly_100'
    } else if (pct >= 75 && prevPct < 75) {
      milestone = 'weekly_75'
    } else if (pct >= 50 && prevPct < 50) {
      milestone = 'weekly_50'
    } else if (pct >= 25 && prevPct < 25) {
      milestone = 'weekly_25'
    }
  }

  if (!milestone) {
    if (streak === 7) milestone = 'streak_7'
    else if (streak === 3) milestone = 'streak_3'
  }

  return { todayCount, weekCount, streak, milestone }
}

export async function getStarredQuestionIds(userId: string, topicSlug: string): Promise<Set<number>> {
  const topicRow = await db.select({ id: topics.id }).from(topics).where(eq(topics.slug, topicSlug)).limit(1)
  if (!topicRow[0]) return new Set()

  const rows = await db
    .select({ questionId: userStarredQuestions.questionId })
    .from(userStarredQuestions)
    .innerJoin(questions, eq(questions.id, userStarredQuestions.questionId))
    .where(and(eq(userStarredQuestions.userId, userId), eq(questions.topicId, topicRow[0].id)))

  return new Set(rows.map(r => r.questionId))
}

export type StarredQuestion = {
  questionId: number
  question: string
  options: string[]
  answer: number
  explanation: string
  topicSlug: string
  topicTitle: string
  theme: string
  subCategory: string | null
}

export async function getStarredQuestions(
  userId: string,
  cursor?: number,
  limit = 30,
): Promise<{ items: StarredQuestion[]; nextCursor: number | null }> {
  const rows = await db
    .select({
      starredId: userStarredQuestions.id,
      questionId: questions.id,
      question: questions.question,
      options: questions.options,
      answer: questions.answer,
      explanation: questions.explanation,
      topicSlug: topics.slug,
      topicTitle: topics.title,
      theme: topics.theme,
      subCategory: topics.subCategory,
    })
    .from(userStarredQuestions)
    .innerJoin(questions, eq(questions.id, userStarredQuestions.questionId))
    .innerJoin(topics, eq(topics.id, questions.topicId))
    .where(and(
      eq(userStarredQuestions.userId, userId),
      cursor ? gt(userStarredQuestions.id, cursor) : undefined,
    ))
    .orderBy(asc(userStarredQuestions.id))
    .limit(limit + 1)

  const hasMore = rows.length > limit
  const batch = hasMore ? rows.slice(0, limit) : rows
  const nextCursor = hasMore ? batch[batch.length - 1].starredId : null

  return {
    items: batch.map(r => ({
      questionId: r.questionId,
      question: r.question,
      options: (r.options ?? []) as string[],
      answer: r.answer ?? 0,
      explanation: r.explanation,
      topicSlug: r.topicSlug,
      topicTitle: r.topicTitle,
      theme: r.theme,
      subCategory: r.subCategory,
    })),
    nextCursor,
  }
}

export async function toggleStarredQuestion(userId: string, questionId: number): Promise<boolean> {
  const existing = await db
    .select({ id: userStarredQuestions.id })
    .from(userStarredQuestions)
    .where(and(eq(userStarredQuestions.userId, userId), eq(userStarredQuestions.questionId, questionId)))
    .limit(1)

  if (existing.length > 0) {
    await db.delete(userStarredQuestions).where(
      and(eq(userStarredQuestions.userId, userId), eq(userStarredQuestions.questionId, questionId))
    )
    return false
  } else {
    await db.insert(userStarredQuestions).values({ userId, questionId })
    return true
  }
}

// ── Starred Problems (實作題) ──────────────────────────────────────────────

export async function getStarredProblemIds(userId: string, topicSlug: string): Promise<Set<string>> {
  const rows = await db
    .select({ problemId: userStarredProblems.problemId })
    .from(userStarredProblems)
    .where(and(eq(userStarredProblems.userId, userId), eq(userStarredProblems.topicSlug, topicSlug)))
  return new Set(rows.map(r => r.problemId))
}

export type StarredProblemRow = { topicSlug: string; problemId: string }

export async function getStarredProblemRows(
  userId: string,
  cursor?: number,
  limit = 30,
): Promise<{ items: StarredProblemRow[]; nextCursor: number | null }> {
  const rows = await db
    .select({
      starredId: userStarredProblems.id,
      topicSlug: userStarredProblems.topicSlug,
      problemId: userStarredProblems.problemId,
    })
    .from(userStarredProblems)
    .where(and(
      eq(userStarredProblems.userId, userId),
      cursor ? gt(userStarredProblems.id, cursor) : undefined,
    ))
    .orderBy(asc(userStarredProblems.id))
    .limit(limit + 1)

  const hasMore = rows.length > limit
  const batch = hasMore ? rows.slice(0, limit) : rows
  const nextCursor = hasMore ? batch[batch.length - 1].starredId : null

  return {
    items: batch.map(r => ({ topicSlug: r.topicSlug, problemId: r.problemId })),
    nextCursor,
  }
}

export async function getStarredCounts(userId: string): Promise<{
  questionsCount: number
  quizCount: number
  problemsCount: number
}> {
  const [qResult, pResult] = await Promise.all([
    db
      .select({
        total: sql<number>`count(*)::int`,
        withOptions: sql<number>`count(*) filter (where jsonb_array_length(${questions.options}) > 0)::int`,
      })
      .from(userStarredQuestions)
      .innerJoin(questions, eq(questions.id, userStarredQuestions.questionId))
      .where(eq(userStarredQuestions.userId, userId)),
    db
      .select({ total: sql<number>`count(*)::int` })
      .from(userStarredProblems)
      .where(eq(userStarredProblems.userId, userId)),
  ])

  return {
    questionsCount: qResult[0]?.total ?? 0,
    quizCount: qResult[0]?.withOptions ?? 0,
    problemsCount: pResult[0]?.total ?? 0,
  }
}

// ── Weekly history ────────────────────────────────────────────────────────────

// ── Theme milestone history ────────────────────────────────────────────────────

export type ThemeMilestone = {
  pct: 25 | 50 | 75 | 100
  date: string // YYYY-MM-DD
  count: number
}

export type ThemeHistoryEntry = {
  theme: string
  targetCount: number
  targetDays: number | null
  totalDone: number
  startDate: string | null  // date of first log
  milestones: ThemeMilestone[]
  note: string
}

export async function getThemeHistory(userId: string): Promise<ThemeHistoryEntry[]> {
  // All logs grouped by theme + date, ordered ascending
  const logRows = await db
    .select({
      theme: topics.theme,
      date: sql<string>`${userQuestionLog.loggedAt}::date::text`,
      cnt: sql<number>`count(*)::int`,
    })
    .from(userQuestionLog)
    .innerJoin(topics, eq(userQuestionLog.topicSlug, topics.slug))
    .where(eq(userQuestionLog.userId, userId))
    .groupBy(topics.theme, sql`${userQuestionLog.loggedAt}::date`)
    .orderBy(topics.theme, sql`${userQuestionLog.loggedAt}::date`)

  const goals = await getWeeklyGoals(userId)
  const goalMap: Record<string, { targetCount: number; targetDays: number | null }> = {}
  for (const g of goals) goalMap[g.theme] = { targetCount: g.weeklyGoal, targetDays: g.targetDays }

  const noteRows = await db
    .select({ weekStart: userWeekNotes.weekStart, note: userWeekNotes.note })
    .from(userWeekNotes)
    .where(eq(userWeekNotes.userId, userId))
  // Use most recent note per theme (stored in userWeekNotes for now)
  const noteMap: Record<string, string> = {}
  for (const n of noteRows) noteMap[n.weekStart] = n.note

  // Build per-theme data
  const themeMap: Record<string, { dates: { date: string; cnt: number }[] }> = {}
  for (const row of logRows) {
    if (!themeMap[row.theme]) themeMap[row.theme] = { dates: [] }
    themeMap[row.theme].dates.push({ date: row.date, cnt: row.cnt })
  }

  // Themes to show: those with activity OR those with a goal set
  const goalThemes = Object.keys(goalMap).filter(t => goalMap[t].targetCount > 0)
  const allThemes = new Set([...Object.keys(themeMap), ...goalThemes])

  return [...allThemes].map(theme => {
    const { targetCount = 0, targetDays = null } = goalMap[theme] ?? {}
    const dates = themeMap[theme]?.dates ?? []
    const totalDone = dates.reduce((s, d) => s + d.cnt, 0)
    const startDate = dates[0]?.date ?? null

    // Find milestone crossing dates via cumulative sum
    const milestones: ThemeMilestone[] = []
    if (targetCount > 0) {
      let cumulative = 0
      const thresholds: (25 | 50 | 75 | 100)[] = [25, 50, 75, 100]
      for (const { date, cnt } of dates) {
        cumulative += cnt
        for (const pct of thresholds) {
          if (!milestones.find(m => m.pct === pct) && cumulative >= targetCount * pct / 100) {
            milestones.push({ pct, date, count: cumulative })
          }
        }
      }
    }

    // Use most recent userWeekNotes entry as theme note (best-effort)
    const themeNoteKey = Object.keys(noteMap).sort().reverse()[0] ?? ''
    void themeNoteKey

    return { theme, targetCount, targetDays, totalDone, startDate, milestones, note: '' }
  }).sort((a, b) => a.theme.localeCompare(b.theme, 'zh'))
}

export async function toggleStarredProblem(userId: string, topicSlug: string, problemId: string): Promise<boolean> {
  const existing = await db
    .select({ id: userStarredProblems.id })
    .from(userStarredProblems)
    .where(and(
      eq(userStarredProblems.userId, userId),
      eq(userStarredProblems.topicSlug, topicSlug),
      eq(userStarredProblems.problemId, problemId),
    ))
    .limit(1)

  if (existing.length > 0) {
    await db.delete(userStarredProblems).where(
      and(
        eq(userStarredProblems.userId, userId),
        eq(userStarredProblems.topicSlug, topicSlug),
        eq(userStarredProblems.problemId, problemId),
      )
    )
    return false
  } else {
    await db.insert(userStarredProblems).values({ userId, topicSlug, problemId })
    return true
  }
}
