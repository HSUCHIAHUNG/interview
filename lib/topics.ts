import fs from 'fs'
import path from 'path'

export function hasDemoPage(slug: string): boolean {
  return fs.existsSync(path.join(process.cwd(), 'app', 'demo', slug, 'page.tsx'))
}

export function hasNotesPage(slug: string): boolean {
  return fs.existsSync(path.join(process.cwd(), 'topics', slug, 'notes.ts'))
}

export type Difficulty = 'easy' | 'medium' | 'hard'
export type Category = 'JavaScript' | 'React' | 'Next.js' | 'CSS' | 'TypeScript' | 'Network' | 'Browser'

export interface TopicMeta {
  title: string
  description: string
  category: Category
  difficulty: Difficulty
}

export interface Question {
  id: number
  question: string
  options: string[]
  answer: number       // index of correct option
  explanation: string
}

export interface Topic {
  slug: string
  meta: TopicMeta
  questions: Question[]
}

const TOPICS_DIR = path.join(process.cwd(), 'topics')

// 掃描 topics/ 資料夾，自動發現所有技術
export function getTopicSlugs(): string[] {
  if (!fs.existsSync(TOPICS_DIR)) return []
  return fs
    .readdirSync(TOPICS_DIR)
    .filter((f) => fs.statSync(path.join(TOPICS_DIR, f)).isDirectory())
}

export async function getTopicMeta(slug: string): Promise<TopicMeta> {
  const mod = await import(`@/topics/${slug}/meta`)
  return mod.meta as TopicMeta
}

export async function getTopicQuestions(slug: string): Promise<Question[]> {
  const mod = await import(`@/topics/${slug}/questions`)
  return mod.questions as Question[]
}

export async function getAllTopics(): Promise<Topic[]> {
  const slugs = getTopicSlugs()
  return Promise.all(
    slugs.map(async (slug) => ({
      slug,
      meta: await getTopicMeta(slug),
      questions: await getTopicQuestions(slug),
    }))
  )
}

export async function getTopic(slug: string): Promise<Topic> {
  return {
    slug,
    meta: await getTopicMeta(slug),
    questions: await getTopicQuestions(slug),
  }
}
