import Link from 'next/link'
import DebounceDemo from './DemoClient'

export default function DebounceDemoPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition">
            ← 回首頁
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Debounce 示範</h1>
          <p className="text-sm text-gray-500 mt-1">
            比較使用 <code className="bg-gray-100 px-1 rounded">apply</code> 與不使用時，<code className="bg-gray-100 px-1 rounded">this</code> 的傳遞差異
          </p>
        </div>
        <DebounceDemo />
      </div>
    </main>
  )
}
