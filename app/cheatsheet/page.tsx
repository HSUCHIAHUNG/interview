import Link from 'next/link'

type CheatsheetEntry = {
  href: string
  title: string
  description: string
  count: number
  category: string
}

const CHEATSHEETS: CheatsheetEntry[] = [
  {
    href: '/cheatsheet/array-methods',
    title: '陣列方法',
    description: '回傳值、是否改變原陣列、語法速查',
    count: 33,
    category: 'JavaScript',
  },
]

const CATEGORY_COLOR: Record<string, string> = {
  JavaScript: 'text-yellow-400 bg-yellow-900/30 border-yellow-800',
  React: 'text-blue-400 bg-blue-900/30 border-blue-800',
  TypeScript: 'text-sky-400 bg-sky-900/30 border-sky-800',
  CSS: 'text-pink-400 bg-pink-900/30 border-pink-800',
}

export default function CheatsheetIndexPage() {
  return (
    <main className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-8 text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-300 transition">首頁</Link>
          <span className="text-gray-700">/</span>
          <span className="text-gray-300">速查表</span>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-100">速查表</h1>
          <p className="text-gray-500 text-sm mt-1">各主題的方法重點整理，快速複習用</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CHEATSHEETS.map(entry => {
            const colorClass = CATEGORY_COLOR[entry.category] ?? 'text-gray-400 bg-gray-800 border-gray-700'
            return (
              <Link
                key={entry.href}
                href={entry.href}
                className="group block border border-gray-800 rounded-xl bg-gray-900/40 hover:bg-gray-800/60 hover:border-gray-700 transition p-5"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h2 className="text-gray-100 font-semibold group-hover:text-white transition">
                    {entry.title}
                  </h2>
                  <span className={`text-xs px-2 py-0.5 rounded border shrink-0 ${colorClass}`}>
                    {entry.category}
                  </span>
                </div>
                <p className="text-gray-500 text-sm">{entry.description}</p>
                <p className="text-gray-700 text-xs mt-3">{entry.count} 個方法</p>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
