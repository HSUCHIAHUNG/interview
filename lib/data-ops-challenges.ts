import type { MethodEntry } from './array-challenges'
export type { MethodEntry }

import { dataOpsPart1 } from './data-ops-part1'
import { dataOpsPart2 } from './data-ops-part2'
import { dataOpsPart3 } from './data-ops-part3'
import { dataOpsPart4 } from './data-ops-part4'

export const dataOpsChallenges: MethodEntry[] = [
  ...dataOpsPart1,
  ...dataOpsPart2,
  ...dataOpsPart3,
  ...dataOpsPart4,
]

export function getDataOpsChallenge(slug: string): MethodEntry | undefined {
  return dataOpsChallenges.find(e => e.slug === slug)
}

export function hasDataOpsChallenge(slug: string): boolean {
  return dataOpsChallenges.some(e => e.slug === slug)
}
