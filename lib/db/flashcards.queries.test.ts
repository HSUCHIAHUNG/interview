import { describe, it, expect, afterEach } from 'vitest'
import { eq } from 'drizzle-orm'
import { db } from './index'
import { flashcardDecks, flashcardCards } from './schema'
import { createDeckWithCards, getDeckWithCards, getMaxCardOrder, addCard, updateCard, deleteCard, getDecksForUser, deleteDeck, markCardReviewed } from './queries'

const TEST_USER = '__test_user_flashcards__'
const OTHER_USER = '__test_user_flashcards_other__'

let createdDeckIds: number[] = []

afterEach(async () => {
  for (const id of createdDeckIds) {
    await db.delete(flashcardCards).where(eq(flashcardCards.deckId, id))
    await db.delete(flashcardDecks).where(eq(flashcardDecks.id, id))
  }
  createdDeckIds = []
})

describe('createDeckWithCards / getDeckWithCards', () => {
  it('persists a deck and its cards in order, retrievable by id and owner', async () => {
    const deck = await createDeckWithCards(TEST_USER, 'Test Deck', [
      { front: 'a', back: '1' },
      { front: 'b', back: '2' },
    ])
    createdDeckIds.push(deck.id)

    const fetched = await getDeckWithCards(deck.id, TEST_USER)
    expect(fetched).not.toBeNull()
    expect(fetched!.deck.name).toBe('Test Deck')
    expect(fetched!.cards).toHaveLength(2)
    expect(fetched!.cards.map(c => [c.front, c.back])).toEqual([
      ['a', '1'],
      ['b', '2'],
    ])
  })

  it('returns null when the deck belongs to a different user', async () => {
    const deck = await createDeckWithCards(TEST_USER, 'Private Deck', [{ front: 'x', back: 'y' }])
    createdDeckIds.push(deck.id)

    const fetched = await getDeckWithCards(deck.id, OTHER_USER)
    expect(fetched).toBeNull()
  })

  it('returns null for a deck id that does not exist', async () => {
    const fetched = await getDeckWithCards(999_999_999, TEST_USER)
    expect(fetched).toBeNull()
  })
})

describe('getMaxCardOrder / addCard', () => {
  it('appends a new card at the next order position on an existing deck', async () => {
    const deck = await createDeckWithCards(TEST_USER, 'Deck', [{ front: 'a', back: '1' }])
    createdDeckIds.push(deck.id)

    const maxOrder = await getMaxCardOrder(deck.id)
    const result = await addCard(deck.id, TEST_USER, 'c', '3', maxOrder + 1)
    expect(result).not.toBeNull()

    const fetched = await getDeckWithCards(deck.id, TEST_USER)
    expect(fetched!.cards.map(c => c.front)).toEqual(['a', 'c'])
  })

  it('refuses to add a card to a deck owned by a different user', async () => {
    const deck = await createDeckWithCards(TEST_USER, 'Deck', [{ front: 'a', back: '1' }])
    createdDeckIds.push(deck.id)

    const result = await addCard(deck.id, OTHER_USER, 'c', '3', 1)
    expect(result).toBeNull()

    const fetched = await getDeckWithCards(deck.id, TEST_USER)
    expect(fetched!.cards).toHaveLength(1)
  })
})

describe('updateCard', () => {
  it('updates only the targeted card, leaving others in the deck untouched', async () => {
    const deck = await createDeckWithCards(TEST_USER, 'Deck', [
      { front: 'a', back: '1' },
      { front: 'b', back: '2' },
    ])
    createdDeckIds.push(deck.id)
    const before = await getDeckWithCards(deck.id, TEST_USER)
    const [first, second] = before!.cards

    const ok = await updateCard(first.id, deck.id, TEST_USER, 'a-edited', '1-edited')
    expect(ok).toBe(true)

    const after = await getDeckWithCards(deck.id, TEST_USER)
    const updated = after!.cards.find(c => c.id === first.id)!
    const untouched = after!.cards.find(c => c.id === second.id)!
    expect(updated.front).toBe('a-edited')
    expect(updated.back).toBe('1-edited')
    expect(untouched.front).toBe('b')
    expect(untouched.back).toBe('2')
  })

  it('refuses to update a card in a deck owned by a different user', async () => {
    const deck = await createDeckWithCards(TEST_USER, 'Deck', [{ front: 'a', back: '1' }])
    createdDeckIds.push(deck.id)
    const before = await getDeckWithCards(deck.id, TEST_USER)
    const [first] = before!.cards

    const ok = await updateCard(first.id, deck.id, OTHER_USER, 'hacked', 'hacked')
    expect(ok).toBe(false)

    const after = await getDeckWithCards(deck.id, TEST_USER)
    expect(after!.cards[0].front).toBe('a')
  })

  it('refuses to update a card when the given deckId does not match the card\'s actual deck', async () => {
    const deckA = await createDeckWithCards(TEST_USER, 'Deck A', [{ front: 'a', back: '1' }])
    const deckB = await createDeckWithCards(TEST_USER, 'Deck B', [{ front: 'x', back: 'y' }])
    createdDeckIds.push(deckA.id, deckB.id)
    const cardInA = (await getDeckWithCards(deckA.id, TEST_USER))!.cards[0]

    const ok = await updateCard(cardInA.id, deckB.id, TEST_USER, 'wrong-deck-edit', 'wrong-deck-edit')
    expect(ok).toBe(false)

    const after = await getDeckWithCards(deckA.id, TEST_USER)
    expect(after!.cards[0].front).toBe('a')
  })
})

describe('deleteCard', () => {
  it('deletes only the targeted card', async () => {
    const deck = await createDeckWithCards(TEST_USER, 'Deck', [
      { front: 'a', back: '1' },
      { front: 'b', back: '2' },
    ])
    createdDeckIds.push(deck.id)
    const before = await getDeckWithCards(deck.id, TEST_USER)
    const [first, second] = before!.cards

    const ok = await deleteCard(first.id, deck.id, TEST_USER)
    expect(ok).toBe(true)

    const after = await getDeckWithCards(deck.id, TEST_USER)
    expect(after!.cards.map(c => c.id)).toEqual([second.id])
  })

  it('refuses to delete a card in a deck owned by a different user', async () => {
    const deck = await createDeckWithCards(TEST_USER, 'Deck', [{ front: 'a', back: '1' }])
    createdDeckIds.push(deck.id)
    const before = await getDeckWithCards(deck.id, TEST_USER)
    const [first] = before!.cards

    const ok = await deleteCard(first.id, deck.id, OTHER_USER)
    expect(ok).toBe(false)

    const after = await getDeckWithCards(deck.id, TEST_USER)
    expect(after!.cards).toHaveLength(1)
  })

  it('refuses to delete a card when the given deckId does not match the card\'s actual deck', async () => {
    const deckA = await createDeckWithCards(TEST_USER, 'Deck A', [{ front: 'a', back: '1' }])
    const deckB = await createDeckWithCards(TEST_USER, 'Deck B', [{ front: 'x', back: 'y' }])
    createdDeckIds.push(deckA.id, deckB.id)
    const cardInA = (await getDeckWithCards(deckA.id, TEST_USER))!.cards[0]

    const ok = await deleteCard(cardInA.id, deckB.id, TEST_USER)
    expect(ok).toBe(false)

    const after = await getDeckWithCards(deckA.id, TEST_USER)
    expect(after!.cards).toHaveLength(1)
  })
})

describe('getDecksForUser', () => {
  it('returns only the calling user\'s decks with correct card and reviewed counts', async () => {
    const deckA = await createDeckWithCards(TEST_USER, 'Deck A', [
      { front: 'a', back: '1' },
      { front: 'b', back: '2' },
    ])
    const deckB = await createDeckWithCards(OTHER_USER, 'Deck B', [{ front: 'x', back: 'y' }])
    createdDeckIds.push(deckA.id, deckB.id)

    const withCards = await getDeckWithCards(deckA.id, TEST_USER)
    await db.update(flashcardCards).set({ reviewedAt: new Date() }).where(eq(flashcardCards.id, withCards!.cards[0].id))

    const decks = await getDecksForUser(TEST_USER)
    const found = decks.find(d => d.id === deckA.id)
    expect(found).toBeDefined()
    expect(found!.name).toBe('Deck A')
    expect(found!.cardCount).toBe(2)
    expect(found!.reviewedCount).toBe(1)
    expect(decks.some(d => d.id === deckB.id)).toBe(false)
  })

  it('does not include another user\'s deck', async () => {
    const deck = await createDeckWithCards(OTHER_USER, 'Other', [{ front: 'x', back: 'y' }])
    createdDeckIds.push(deck.id)

    const decks = await getDecksForUser(TEST_USER)
    expect(decks.some(d => d.id === deck.id)).toBe(false)
  })
})

describe('deleteDeck', () => {
  it('deletes a deck and cascades to its cards, for the owning user', async () => {
    const deck = await createDeckWithCards(TEST_USER, 'To delete', [{ front: 'a', back: '1' }])
    createdDeckIds.push(deck.id)

    const ok = await deleteDeck(deck.id, TEST_USER)
    expect(ok).toBe(true)

    const fetched = await getDeckWithCards(deck.id, TEST_USER)
    expect(fetched).toBeNull()

    const remainingCards = await db.select().from(flashcardCards).where(eq(flashcardCards.deckId, deck.id))
    expect(remainingCards).toHaveLength(0)
  })

  it('refuses to delete a deck owned by a different user, leaving it and its cards intact', async () => {
    const deck = await createDeckWithCards(TEST_USER, 'Protected', [{ front: 'a', back: '1' }])
    createdDeckIds.push(deck.id)

    const ok = await deleteDeck(deck.id, OTHER_USER)
    expect(ok).toBe(false)

    const fetched = await getDeckWithCards(deck.id, TEST_USER)
    expect(fetched).not.toBeNull()
    expect(fetched!.cards).toHaveLength(1)
  })
})

describe('markCardReviewed', () => {
  it('sets a timestamp on only the targeted card', async () => {
    const deck = await createDeckWithCards(TEST_USER, 'Deck', [
      { front: 'a', back: '1' },
      { front: 'b', back: '2' },
    ])
    createdDeckIds.push(deck.id)
    const before = await getDeckWithCards(deck.id, TEST_USER)
    const [first, second] = before!.cards
    expect(first.reviewedAt).toBeNull()

    const ok = await markCardReviewed(first.id, deck.id, TEST_USER)
    expect(ok).toBe(true)

    const after = await getDeckWithCards(deck.id, TEST_USER)
    const updated = after!.cards.find(c => c.id === first.id)!
    const untouched = after!.cards.find(c => c.id === second.id)!
    expect(updated.reviewedAt).not.toBeNull()
    expect(untouched.reviewedAt).toBeNull()
  })

  it('refuses to mark a card reviewed in a deck owned by a different user', async () => {
    const deck = await createDeckWithCards(TEST_USER, 'Deck', [{ front: 'a', back: '1' }])
    createdDeckIds.push(deck.id)
    const before = await getDeckWithCards(deck.id, TEST_USER)
    const [first] = before!.cards

    const ok = await markCardReviewed(first.id, deck.id, OTHER_USER)
    expect(ok).toBe(false)

    const after = await getDeckWithCards(deck.id, TEST_USER)
    expect(after!.cards[0].reviewedAt).toBeNull()
  })

  it('refuses to mark a card reviewed when the given deckId does not match the card\'s actual deck', async () => {
    const deckA = await createDeckWithCards(TEST_USER, 'Deck A', [{ front: 'a', back: '1' }])
    const deckB = await createDeckWithCards(TEST_USER, 'Deck B', [{ front: 'x', back: 'y' }])
    createdDeckIds.push(deckA.id, deckB.id)
    const cardInA = (await getDeckWithCards(deckA.id, TEST_USER))!.cards[0]

    const ok = await markCardReviewed(cardInA.id, deckB.id, TEST_USER)
    expect(ok).toBe(false)

    const after = await getDeckWithCards(deckA.id, TEST_USER)
    expect(after!.cards[0].reviewedAt).toBeNull()
  })
})
