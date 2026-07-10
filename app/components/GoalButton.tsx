'use client'

import { useState } from 'react'
import GoalModal from './GoalModal'

export default function GoalButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-gray-400 hover:text-gray-200 border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-lg transition"
      >
        🎯 目標
      </button>
      {open && <GoalModal onClose={() => setOpen(false)} />}
    </>
  )
}
