import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import StarredClient from './StarredClient'

export type { StarredProblemItem } from './types'

export default async function StarredPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  return (
    <main className="min-h-screen bg-gray-950 px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 transition block mb-2">
            ← 回首頁
          </Link>
          <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
            <span>⭐</span> 必考題
          </h1>
        </div>
        <StarredClient />
      </div>
    </main>
  )
}
