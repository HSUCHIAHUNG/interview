'use client'

import { useState } from 'react'
import GoalModal from './GoalModal'

export default function GoalButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="shrink-0 flex items-center gap-1 text-xs font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 px-2.5 py-1 rounded-lg transition"
      >
        🎯 目標
      </button>
      {open && <GoalModal onClose={() => setOpen(false)} />}
    </>
  )
}
