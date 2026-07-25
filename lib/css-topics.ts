import type { CssEntry } from './css-topics-types'
export type { CssEntry }
export type { QuizQuestion } from './css-topics-types'

import { part1Topics } from './css-topics-part1'
import { part2Topics } from './css-topics-part2'

export const THEME = 'CSS'

export const CSS_SUB_CATEGORIES = [
  { name: '盒模型與佈局', order: 1 },
  { name: '選擇器與優先級', order: 2 },
  { name: '排版系統', order: 3 },
  { name: '動畫與視覺效果', order: 4 },
  { name: '預處理器與工具', order: 5 },
]

export const cssTopics: CssEntry[] = [
  ...part1Topics,
  ...part2Topics,
]
