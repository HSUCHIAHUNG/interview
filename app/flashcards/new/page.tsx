import Link from 'next/link'
import NewDeckClient from './NewDeckClient'

export default function NewFlashcardDeckPage() {
  return (
    <main className="min-h-screen bg-gray-950 px-6 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 transition">← 首頁</Link>
          <span className="text-gray-700">/</span>
          <h1 className="text-xl font-bold text-gray-100">🗂️ 建立 Flashcards 題組</h1>
        </div>
        <NewDeckClient />
      </div>
    </main>
  )
}
