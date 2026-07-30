import type { MethodEntry } from './array-challenges'
import { numChallengesPart1 } from './num-challenges-part1'
import { numChallengesPart2 } from './num-challenges-part2'
import { numChallengesPart3 } from './num-challenges-part3'

export const numberChallenges: MethodEntry[] = [
  ...numChallengesPart1,
  ...numChallengesPart2,
  ...numChallengesPart3,
]

export function hasNumberChallenge(slug: string): boolean {
  return numberChallenges.some(e => e.slug === slug)
}

export function getNumberChallenge(slug: string): MethodEntry | undefined {
  return numberChallenges.find(e => e.slug === slug)
}
