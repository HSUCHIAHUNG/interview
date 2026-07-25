import type { DesignPatternEntry } from './design-pattern-topics-types'
export type { DesignPatternEntry }
export type { QuizQuestion } from './design-pattern-topics-types'

import { part1Topics } from './design-pattern-topics-part1'
import { part2Topics } from './design-pattern-topics-part2'

export const THEME = '設計方法／設計模式類'

export const DESIGN_PATTERN_SUB_CATEGORIES = [
  { name: '程式設計範式', order: 1 },
  { name: '架構模式', order: 2 },
  { name: '設計原則', order: 3 },
  { name: '常見設計模式', order: 4 },
]

export const designPatternTopics: DesignPatternEntry[] = [
  ...part1Topics,
  ...part2Topics,
]
