'use client'

import { useState } from 'react'
import TopicCard from './TopicCard'
import type { TopicMeta } from '@/lib/topics'

interface TopicItem {
  slug: string
  meta: TopicMeta
  questionCount: number
  hasDemo: boolean
  hasNotes: boolean
  hasPractice: boolean
  initialCompleted: boolean
  isLoggedIn: boolean
  theme: string
  subCategory: string | null
}

interface Props {
  themes: string[]
  subCategoriesByTheme: Record<string, string[]>
  topics: TopicItem[]
}

export default function ThemeFilter({ themes, subCategoriesByTheme, topics }: Props) {
  const [activeTheme, setActiveTheme] = useState<string>(themes[0] ?? '')
  const [activeSubCategory, setActiveSubCategory] = useState<string>('all')

  const subCategories = subCategoriesByTheme[activeTheme] ?? []

  const filtered = topics.filter(t => {
    if (t.theme !== activeTheme) return false
    if (activeSubCategory === 'all') return true
    return t.subCategory === activeSubCategory
  })

  function handleThemeChange(theme: string) {
    setActiveTheme(theme)
    setActiveSubCategory('all')
  }

  return (
    <div>
      {/* Theme tabs — only show if more than one theme */}
      {themes.length > 1 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {themes.map(theme => (
            <button
              key={theme}
              onClick={() => handleThemeChange(theme)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition border ${
                activeTheme === theme
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200'
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      )}

      {/* Subcategory tabs */}
      {subCategories.length > 0 && (
        <div className="flex gap-2 mb-8 flex-wrap">
          <button
            onClick={() => setActiveSubCategory('all')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition border ${
              activeSubCategory === 'all'
                ? 'bg-gray-700 border-gray-600 text-gray-100'
                : 'border-gray-800 text-gray-500 hover:border-gray-700 hover:text-gray-300'
            }`}
          >
            全部
          </button>
          {subCategories.map(sub => {
            const count = topics.filter(t => t.theme === activeTheme && t.subCategory === sub).length
            return (
              <button
                key={sub}
                onClick={() => setActiveSubCategory(sub)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition border ${
                  activeSubCategory === sub
                    ? 'bg-gray-700 border-gray-600 text-gray-100'
                    : 'border-gray-800 text-gray-500 hover:border-gray-700 hover:text-gray-300'
                }`}
              >
                {sub}
                {count > 0 && (
                  <span className="ml-1.5 text-xs opacity-60">{count}</span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Topic cards */}
      <div className="grid gap-5 sm:grid-cols-2">
        {filtered.map(topic => (
          <TopicCard
            key={topic.slug}
            slug={topic.slug}
            meta={topic.meta}
            questionCount={topic.questionCount}
            hasDemo={topic.hasDemo}
            hasNotes={topic.hasNotes}
            hasPractice={topic.hasPractice}
            initialCompleted={topic.initialCompleted}
            isLoggedIn={topic.isLoggedIn}
            subCategory={topic.subCategory}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-600 py-16">此子類別尚無題目</p>
      )}
    </div>
  )
}
