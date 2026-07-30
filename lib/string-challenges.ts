import type { MethodEntry } from './array-challenges'
import { stringChallengesPart1 } from './string-challenges-part1'
import { stringChallengesPart2 } from './string-challenges-part2'
import { stringChallengesPart3 } from './string-challenges-part3'

export const stringChallenges: MethodEntry[] = [
  ...stringChallengesPart1,
  ...stringChallengesPart2,
  ...stringChallengesPart3,
]

export function hasStringChallenge(slug: string): boolean {
  return stringChallenges.some(e => e.slug === slug)
}

export function getStringChallenge(slug: string): MethodEntry | undefined {
  return stringChallenges.find(e => e.slug === slug)
}
