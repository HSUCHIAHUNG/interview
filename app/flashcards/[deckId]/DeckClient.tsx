'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import EditableCardList, { type EditableCard } from '../components/EditableCardList'
import { isValidCard } from '@/lib/flashcards/parseAnkiText'

type ServerCard = {
  id: number
  front: string
  back: string
}

function toEditableCard(c: ServerCard): EditableCard {
  return { id: String(c.id), front: c.front, back: c.back, valid: isValidCard(c.front, c.back) }
}

export default function DeckClient({ deckId, initialCards }: { deckId: number; initialCards: ServerCard[] }) {
  const router = useRouter()
  const [cards, setCards] = useState<EditableCard[]>(initialCards.map(toEditableCard))
  const [error, setError] = useState<string | null>(null)
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  // chains PATCH requests per card so an older, slower request can never land after a newer one
  const inFlight = useRef<Record<string, Promise<void>>>({})
  const addingRef = useRef(false)

  useEffect(() => {
    const timers = debounceTimers.current
    return () => {
      Object.values(timers).forEach(clearTimeout)
    }
  }, [])

  function persistCard(id: string, front: string, back: string) {
    const previous = inFlight.current[id] ?? Promise.resolve()
    const run = previous.then(async () => {
      try {
        const res = await fetch(`/api/flashcards/decks/${deckId}/cards/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ front, back }),
        })
        // 404 means the card is already gone (e.g. deleted from another tab) — nothing to report
        if (!res.ok && res.status !== 404) throw new Error('update failed')
      } catch {
        setError('更新卡片失敗，請重新整理頁面再試一次。')
      }
    })
    inFlight.current[id] = run
  }

  function handleUpdateCard(id: string, field: 'front' | 'back', value: string) {
    const current = cards.find(c => c.id === id)
    const front = field === 'front' ? value : current?.front ?? ''
    const back = field === 'back' ? value : current?.back ?? ''

    setCards(prev => prev.map(c => (c.id === id ? { ...c, front, back, valid: isValidCard(front, back) } : c)))

    if (debounceTimers.current[id]) clearTimeout(debounceTimers.current[id])
    debounceTimers.current[id] = setTimeout(() => {
      persistCard(id, front, back)
    }, 500)
  }

  async function handleDeleteCard(id: string) {
    setError(null)
    // a pending edit for this card is now moot — don't let it fire (and 404) after deletion
    if (debounceTimers.current[id]) {
      clearTimeout(debounceTimers.current[id])
      delete debounceTimers.current[id]
    }
    const prevCards = cards
    setCards(prev => prev.filter(c => c.id !== id))
    try {
      const res = await fetch(`/api/flashcards/decks/${deckId}/cards/${id}`, { method: 'DELETE' })
      // 404 means it was already gone (e.g. deleted from another tab) — the optimistic removal above was correct
      if (!res.ok && res.status !== 404) throw new Error('delete failed')
      router.refresh()
    } catch {
      setCards(prevCards)
      setError('刪除卡片失敗，請再試一次。')
    }
  }

  async function handleAddCard() {
    if (addingRef.current) return
    addingRef.current = true
    setError(null)
    try {
      const res = await fetch(`/api/flashcards/decks/${deckId}/cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ front: '', back: '' }),
      })
      if (!res.ok) throw new Error('add failed')
      const { id } = await res.json() as { id: number }
      setCards(prev => [...prev, { id: String(id), front: '', back: '', valid: false }])
      router.refresh()
    } catch {
      setError('新增卡片失敗，請再試一次。')
    } finally {
      addingRef.current = false
    }
  }

  return (
    <div className="space-y-4">
      <EditableCardList
        cards={cards}
        onUpdateCard={handleUpdateCard}
        onDeleteCard={handleDeleteCard}
        onAddCard={handleAddCard}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
