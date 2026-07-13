'use client'

import { useState } from 'react'
import WeekHistoryModal from './WeekHistoryModal'

export default function HistoryButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-gray-400 hover:text-gray-200 border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-lg transition"
      >
        📅 歷史
      </button>
      {open && <WeekHistoryModal onClose={() => setOpen(false)} />}
    </>
  )
}
