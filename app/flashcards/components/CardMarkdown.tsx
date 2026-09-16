'use client'

import { type ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'

const markdownComponents = {
  p: ({ children }: { children?: ReactNode }) => <p className="leading-relaxed whitespace-pre-wrap">{children}</p>,
  code: ({ children }: { children?: ReactNode }) => (
    <code className="text-blue-300 font-mono text-sm bg-blue-950/30 px-1 rounded">{children}</code>
  ),
  pre: ({ children }: { children?: ReactNode }) => (
    <pre className="bg-gray-950 text-green-300 text-sm rounded-md px-3 py-2 overflow-x-auto my-1 font-mono whitespace-pre">
      {children}
    </pre>
  ),
}

export default function CardMarkdown({ content }: { content: string }) {
  if (content.trim() === '') return <span className="text-gray-600">（空白）</span>
  return <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
}
