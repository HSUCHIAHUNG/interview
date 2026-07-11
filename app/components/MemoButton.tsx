'use client'

import { useState } from 'react'
import MemoModal from './MemoModal'

export default function MemoButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 px-3 py-1.5 rounded-lg transition"
      >
        📝 筆記
      </button>
      {open && <MemoModal onClose={() => setOpen(false)} />}
    </>
  )
}
