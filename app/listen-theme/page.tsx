import Link from 'next/link'
import { getDistinctThemes } from '@/lib/db/queries'

const THEME_LABEL: Record<string, string> = {
  JavaScript: 'JavaScript',
  '陣列方法': '陣列方法',
}

const THEME_DESC: Record<string, string> = {
  JavaScript: '閉包、Event Loop、Promise、Prototype 等核心觀念',
  '陣列方法': 'map、filter、reduce、concat 等所有陣列方法',
}

const THEME_ICON: Record<string, string> = {
  JavaScript: '🟨',
  '陣列方法': '📦',
}

export default async function ListenThemePage() {
  const themes = await getDistinctThemes()

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-2 mb-8 text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-300 transition">首頁</Link>
          <span className="text-gray-700">/</span>
          <span className="text-gray-400">彙整聆聽</span>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-100">彙整聆聽</h1>
          <p className="text-gray-500 mt-1 text-sm">選擇主題，一次播放該主題下所有子項目的聆聽重點</p>
        </div>

        <div className="space-y-3">
          {themes.map(theme => (
            <Link
              key={theme}
              href={`/listen-theme/${encodeURIComponent(theme)}`}
              className="flex items-center gap-4 bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-2xl p-5 transition group"
            >
              <span className="text-3xl">{THEME_ICON[theme] ?? '🎧'}</span>
              <div className="flex-1">
                <p className="text-base font-semibold text-gray-100 group-hover:text-white transition">
                  {THEME_LABEL[theme] ?? theme}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">{THEME_DESC[theme] ?? ''}</p>
              </div>
              <span className="text-gray-600 group-hover:text-gray-400 transition text-lg">→</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
