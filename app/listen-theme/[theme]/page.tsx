import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTopicSectionsByTheme, getDistinctThemes } from '@/lib/db/queries'
import ListenThemeClient from './ListenThemeClient'

interface Props {
  params: Promise<{ theme: string }>
}

export default async function ListenThemePage({ params }: Props) {
  const { theme: encodedTheme } = await params
  const theme = decodeURIComponent(encodedTheme)

  const validThemes = await getDistinctThemes()
  if (!validThemes.includes(theme)) notFound()

  const sections = await getTopicSectionsByTheme(theme)

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-8 text-sm flex-wrap">
          <Link href="/" className="text-gray-500 hover:text-gray-300 transition">首頁</Link>
          <span className="text-gray-700">/</span>
          <Link href="/listen-theme" className="text-gray-500 hover:text-gray-300 transition">彙整聆聽</Link>
          <span className="text-gray-700">/</span>
          <span className="text-gray-300">{theme}</span>
        </div>

        <ListenThemeClient theme={theme} initialSections={sections} />
      </div>
    </main>
  )
}
