import { describe, it, expect, afterEach } from 'vitest'
import { eq } from 'drizzle-orm'
import { db } from './index'
import { flashcardDecks, flashcardCards, flashcardFolders } from './schema'
import {
  createFolder,
  getFoldersForUser,
  getFolder,
  getFolderNamesForUser,
  getUnassignedSummary,
  deleteFolder,
  updateDeckFolder,
  createDeckWithCards,
  getDecksInFolder,
  getDeckWithCards,
} from './queries'

const TEST_USER = '__test_user_flashcards_folders__'
const OTHER_USER = '__test_user_flashcards_folders_other__'

let createdFolderIds: number[] = []
let createdDeckIds: number[] = []

afterEach(async () => {
  for (const id of createdDeckIds) {
    await db.delete(flashcardCards).where(eq(flashcardCards.deckId, id))
    await db.delete(flashcardDecks).where(eq(flashcardDecks.id, id))
  }
  for (const id of createdFolderIds) {
    await db.delete(flashcardFolders).where(eq(flashcardFolders.id, id))
  }
  createdDeckIds = []
  createdFolderIds = []
})

describe('createFolder / getFoldersForUser', () => {
  it('creates a folder and returns it with aggregate deck/card/reviewed counts, scoped to the owner', async () => {
    const folder = await createFolder(TEST_USER, 'TypeScript')
    createdFolderIds.push(folder.id)

    const deck = await createDeckWithCards(TEST_USER, 'Basics', [
      { front: 'a', back: '1' },
      { front: 'b', back: '2' },
    ], folder.id)
    createdDeckIds.push(deck.id)

    const otherFolder = await createFolder(OTHER_USER, 'Someone else\'s folder')
    createdFolderIds.push(otherFolder.id)

    const folders = await getFoldersForUser(TEST_USER)
    const found = folders.find(f => f.id === folder.id)
    expect(found).toBeDefined()
    expect(found!.name).toBe('TypeScript')
    expect(found!.deckCount).toBe(1)
    expect(found!.cardCount).toBe(2)
    expect(found!.reviewedCount).toBe(0)
    expect(folders.some(f => f.id === otherFolder.id)).toBe(false)
  })
})

describe('getUnassignedSummary', () => {
  it('counts only decks with no folder, for the calling user', async () => {
    const folder = await createFolder(TEST_USER, 'Has a folder')
    createdFolderIds.push(folder.id)
    const inFolder = await createDeckWithCards(TEST_USER, 'In folder', [{ front: 'a', back: '1' }], folder.id)
    const unassigned = await createDeckWithCards(TEST_USER, 'No folder', [{ front: 'x', back: 'y' }])
    createdDeckIds.push(inFolder.id, unassigned.id)

    const summary = await getUnassignedSummary(TEST_USER)
    expect(summary.deckCount).toBeGreaterThanOrEqual(1)

    const decks = await getDecksInFolder(null, TEST_USER)
    expect(decks.some(d => d.id === unassigned.id)).toBe(true)
    expect(decks.some(d => d.id === inFolder.id)).toBe(false)
  })
})

describe('getDecksInFolder', () => {
  it('returns only decks in the given folder', async () => {
    const folderA = await createFolder(TEST_USER, 'Folder A')
    const folderB = await createFolder(TEST_USER, 'Folder B')
    createdFolderIds.push(folderA.id, folderB.id)
    const deckA = await createDeckWithCards(TEST_USER, 'Deck A', [{ front: 'a', back: '1' }], folderA.id)
    const deckB = await createDeckWithCards(TEST_USER, 'Deck B', [{ front: 'b', back: '2' }], folderB.id)
    createdDeckIds.push(deckA.id, deckB.id)

    const decksInA = await getDecksInFolder(folderA.id, TEST_USER)
    expect(decksInA.map(d => d.id)).toEqual([deckA.id])
  })
})

describe('deleteFolder', () => {
  it('deletes the folder and moves its decks to unassigned rather than deleting them', async () => {
    const folder = await createFolder(TEST_USER, 'To delete')
    createdFolderIds.push(folder.id)
    const deck = await createDeckWithCards(TEST_USER, 'Orphaned deck', [{ front: 'a', back: '1' }], folder.id)
    createdDeckIds.push(deck.id)

    const ok = await deleteFolder(folder.id, TEST_USER)
    expect(ok).toBe(true)

    const folders = await getFoldersForUser(TEST_USER)
    expect(folders.some(f => f.id === folder.id)).toBe(false)

    const stillThere = await getDeckWithCards(deck.id, TEST_USER)
    expect(stillThere).not.toBeNull()

    const unassigned = await getDecksInFolder(null, TEST_USER)
    expect(unassigned.some(d => d.id === deck.id)).toBe(true)
  })

  it('refuses to delete a folder owned by a different user', async () => {
    const folder = await createFolder(TEST_USER, 'Protected')
    createdFolderIds.push(folder.id)

    const ok = await deleteFolder(folder.id, OTHER_USER)
    expect(ok).toBe(false)

    const folders = await getFoldersForUser(TEST_USER)
    expect(folders.some(f => f.id === folder.id)).toBe(true)
  })
})

describe('updateDeckFolder', () => {
  it('moves a deck into a folder owned by the same user', async () => {
    const folder = await createFolder(TEST_USER, 'Destination')
    createdFolderIds.push(folder.id)
    const deck = await createDeckWithCards(TEST_USER, 'Movable deck', [{ front: 'a', back: '1' }])
    createdDeckIds.push(deck.id)

    const ok = await updateDeckFolder(deck.id, TEST_USER, folder.id)
    expect(ok).toBe(true)

    const decksInFolder = await getDecksInFolder(folder.id, TEST_USER)
    expect(decksInFolder.some(d => d.id === deck.id)).toBe(true)
  })

  it('moves a deck back to unassigned when given null', async () => {
    const folder = await createFolder(TEST_USER, 'Origin')
    createdFolderIds.push(folder.id)
    const deck = await createDeckWithCards(TEST_USER, 'Deck', [{ front: 'a', back: '1' }], folder.id)
    createdDeckIds.push(deck.id)

    const ok = await updateDeckFolder(deck.id, TEST_USER, null)
    expect(ok).toBe(true)

    const unassigned = await getDecksInFolder(null, TEST_USER)
    expect(unassigned.some(d => d.id === deck.id)).toBe(true)
  })

  it('refuses to move a deck into a folder owned by a different user', async () => {
    const otherFolder = await createFolder(OTHER_USER, 'Not yours')
    createdFolderIds.push(otherFolder.id)
    const deck = await createDeckWithCards(TEST_USER, 'Deck', [{ front: 'a', back: '1' }])
    createdDeckIds.push(deck.id)

    const ok = await updateDeckFolder(deck.id, TEST_USER, otherFolder.id)
    expect(ok).toBe(false)

    const unassigned = await getDecksInFolder(null, TEST_USER)
    expect(unassigned.some(d => d.id === deck.id)).toBe(true)
  })

  it('refuses to move a deck owned by a different user', async () => {
    const folder = await createFolder(TEST_USER, 'Destination')
    createdFolderIds.push(folder.id)
    const deck = await createDeckWithCards(OTHER_USER, 'Not yours', [{ front: 'a', back: '1' }])
    createdDeckIds.push(deck.id)

    const ok = await updateDeckFolder(deck.id, TEST_USER, folder.id)
    expect(ok).toBe(false)
  })
})

describe('getFolder', () => {
  it('returns the folder for its owner', async () => {
    const folder = await createFolder(TEST_USER, 'My Folder')
    createdFolderIds.push(folder.id)

    const fetched = await getFolder(folder.id, TEST_USER)
    expect(fetched).not.toBeNull()
    expect(fetched!.name).toBe('My Folder')
  })

  it('returns null when the folder belongs to a different user', async () => {
    const folder = await createFolder(TEST_USER, 'Private')
    createdFolderIds.push(folder.id)

    const fetched = await getFolder(folder.id, OTHER_USER)
    expect(fetched).toBeNull()
  })

  it('returns null for a folder id that does not exist', async () => {
    const fetched = await getFolder(999_999_999, TEST_USER)
    expect(fetched).toBeNull()
  })
})

describe('getFolderNamesForUser', () => {
  it('returns id/name pairs for only the calling user\'s folders', async () => {
    const folder = await createFolder(TEST_USER, 'Mine')
    const otherFolder = await createFolder(OTHER_USER, 'Not mine')
    createdFolderIds.push(folder.id, otherFolder.id)

    const names = await getFolderNamesForUser(TEST_USER)
    expect(names.some(f => f.id === folder.id && f.name === 'Mine')).toBe(true)
    expect(names.some(f => f.id === otherFolder.id)).toBe(false)
  })
})
