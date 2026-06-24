import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTopicSlugs, getTopic, hasNotesPage } from '@/lib/topics'

export async function generateStaticParams() {
  return getTopicSlugs().map((slug) => ({ topic: slug }))
}

function renderContent(content: string) {
  const lines = content.split('\n')
  const result: React.ReactNode[] = []
  let tableLines: string[] = []

  const flushTable = (key: string) => {
    if (tableLines.length < 2) return
    const headers = tableLines[0].split('|').slice(1, -1).map((c) => c.trim())
    const rows = tableLines.slice(2).map((row) =>
      row.split('|').slice(1, -1).map((c) => c.trim())
    )
    result.push(
      <div key={key} className="overflow-x-auto my-3">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {headers.map((h, i) => (
                <th key={i} className="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {row.map((cell, j) => (
                  <td key={j} className="border border-gray-200 px-3 py-2 text-gray-600">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
    tableLines = []
  }

  lines.forEach((line, i) => {
    if (line.startsWith('|')) {
      tableLines.push(line)
      return
    }
    if (tableLines.length > 0) {
      flushTable(`table-${i}`)
    }
    if (line.startsWith('- ')) {
      result.push(
        <li key={i} className="ml-4 text-gray-600 list-disc list-inside">
          {line.slice(2).replace(/\*\*(.*?)\*\*/g, '$1')}
        </li>
      )
    } else if (line.trim() === '') {
      result.push(<div key={i} className="h-2" />)
    } else {
      const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      const isCode = line.includes('\n') || line.match(/^(const|let|var|\/\/|\.|\[)/)
      if (isCode || line.includes('(') && line.includes(')') && line.includes('=>')) {
        result.push(
          <pre key={i} className="bg-gray-900 text-green-300 text-sm rounded-lg px-4 py-3 overflow-x-auto my-2 font-mono">
            {line}
          </pre>
        )
      } else {
        result.push(
          <p key={i} className="text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }} />
        )
      }
    }
  })

  if (tableLines.length > 0) {
    flushTable('table-end')
  }

  return result
}

export default async function NotesPage({
  params,
}: {
  params: Promise<{ topic: string }>
}) {
  const { topic } = await params
  const slugs = getTopicSlugs()
  if (!slugs.includes(topic) || !hasNotesPage(topic)) notFound()

  const data = await getTopic(topic)
  const { notes } = await import(`@/topics/${topic}/notes`)

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition">
          ← 回首頁
        </Link>

        <div className="mt-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{notes.title}</h1>
          <p className="text-gray-400 mt-2 text-sm">{data.meta.category} · {data.meta.description}</p>
        </div>

        <div className="space-y-6">
          {notes.sections.map((section: { heading: string; content: string }, i: number) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">{section.heading}</h2>
              <div className="space-y-1">{renderContent(section.content)}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-3">
          <Link
            href={`/quiz/${topic}`}
            className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-3 rounded-xl transition"
          >
            開始測驗
          </Link>
          <Link
            href="/"
            className="flex-1 text-center bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold py-3 rounded-xl transition"
          >
            回首頁
          </Link>
        </div>
      </div>
    </main>
  )
}
