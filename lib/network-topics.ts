import type { NetworkEntry } from './network-topics-types'
export type { NetworkEntry }
export type { QuizQuestion } from './network-topics-types'

import { part1Topics } from './network-topics-part1'
import { part2Topics } from './network-topics-part2'
import { part3Topics } from './network-topics-part3'

export const THEME = '網路類'

export const NETWORK_SUB_CATEGORIES = [
  { name: 'HTTP 協議', order: 1 },
  { name: '瀏覽器儲存', order: 2 },
  { name: '安全與跨域', order: 3 },
  { name: '效能與快取', order: 4 },
  { name: '認證與授權', order: 5 },
]

export const networkTopics: NetworkEntry[] = [
  ...part1Topics,
  ...part2Topics,
  ...part3Topics,
]
