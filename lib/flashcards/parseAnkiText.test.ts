import { describe, it, expect } from 'vitest'
import { parseAnkiText, isValidCard } from './parseAnkiText'

describe('parseAnkiText', () => {
  it('parses a single well-formed line', () => {
    const cards = parseAnkiText('closure\ta function bundled with its lexical scope')
    expect(cards).toHaveLength(1)
    expect(cards[0].front).toBe('closure')
    expect(cards[0].back).toBe('a function bundled with its lexical scope')
    expect(cards[0].valid).toBe(true)
  })

  it('parses multiple lines in order', () => {
    const cards = parseAnkiText('a\t1\nb\t2\nc\t3')
    expect(cards.map(c => [c.front, c.back])).toEqual([
      ['a', '1'],
      ['b', '2'],
      ['c', '3'],
    ])
  })

  it('flags a line with no tab as invalid but keeps its content', () => {
    const cards = parseAnkiText('just some text with no separator')
    expect(cards).toHaveLength(1)
    expect(cards[0].valid).toBe(false)
    expect(cards[0].front).toBe('just some text with no separator')
    expect(cards[0].back).toBe('')
  })

  it('flags a line with an empty front as invalid', () => {
    const cards = parseAnkiText('\tonly a back')
    expect(cards).toHaveLength(1)
    expect(cards[0].valid).toBe(false)
    expect(cards[0].front).toBe('')
    expect(cards[0].back).toBe('only a back')
  })

  it('flags a line with an empty back as invalid', () => {
    const cards = parseAnkiText('only a front\t')
    expect(cards).toHaveLength(1)
    expect(cards[0].valid).toBe(false)
    expect(cards[0].front).toBe('only a front')
    expect(cards[0].back).toBe('')
  })

  it('drops any content past a second tab (e.g. a tags column) but stays valid', () => {
    const cards = parseAnkiText('front\tback\ttag1\ttag2')
    expect(cards).toHaveLength(1)
    expect(cards[0]).toMatchObject({ front: 'front', back: 'back', valid: true })
  })

  it('ignores blank or whitespace-only lines entirely', () => {
    const cards = parseAnkiText('a\t1\n\n   \nb\t2')
    expect(cards.map(c => [c.front, c.back])).toEqual([
      ['a', '1'],
      ['b', '2'],
    ])
  })

  it('returns an empty array for empty input', () => {
    expect(parseAnkiText('')).toEqual([])
    expect(parseAnkiText('   \n  \n')).toEqual([])
  })

  it('gives every card a unique id', () => {
    const cards = parseAnkiText('a\t1\nb\t2\nc\t3')
    const ids = new Set(cards.map(c => c.id))
    expect(ids.size).toBe(cards.length)
  })
})

describe('isValidCard', () => {
  it('is true only when both front and back have non-whitespace content', () => {
    expect(isValidCard('front', 'back')).toBe(true)
    expect(isValidCard('', 'back')).toBe(false)
    expect(isValidCard('front', '')).toBe(false)
    expect(isValidCard('   ', '   ')).toBe(false)
  })
})
