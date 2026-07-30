import type { MethodEntry } from './array-challenges'
import { dateChallengesPart1 } from './date-challenges-part1'
import { dateChallengesPart2 } from './date-challenges-part2'

export const dateChallenges: MethodEntry[] = [
  ...dateChallengesPart1,
  ...dateChallengesPart2,
]

export function hasDateChallenge(slug: string): boolean {
  return dateChallenges.some(e => e.slug === slug)
}

export function getDateChallenge(slug: string): MethodEntry | undefined {
  return dateChallenges.find(e => e.slug === slug)
}
