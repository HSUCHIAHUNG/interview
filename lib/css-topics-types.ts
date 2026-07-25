export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  answer: number
  explanation: string
}

export interface CssEntry {
  slug: string
  title: string
  description: string
  subCategory: string
  difficulty: 'easy' | 'medium' | 'hard'
  notes: { sections: { heading: string; content: string }[] }
  questions: QuizQuestion[]
  keyPoints: string[]
}
