import type { MethodEntry } from './array-challenges'
import { objChallengesPart1 } from './obj-challenges-part1'
import { objChallengesPart2 } from './obj-challenges-part2'

export const objectChallenges: MethodEntry[] = [
  ...objChallengesPart1,
  ...objChallengesPart2,
]

export function hasObjectChallenge(slug: string): boolean {
  return objectChallenges.some(e => e.slug === slug)
}

export function getObjectChallenge(slug: string): MethodEntry | undefined {
  return objectChallenges.find(e => e.slug === slug)
}
