'use client'

import { useEffect } from 'react'
import type { MilestoneType } from '@/lib/db/queries'

const MILESTONE_CONFIG: Record<MilestoneType, { emoji: string; title: string; desc: string }> = {
  daily_goal:  { emoji: '🎯', title: '今日目標達成！', desc: '已完成今天的練習配額，繼續保持！' },
  weekly_25:   { emoji: '🌱', title: '本週 25% 完成！', desc: '好的開始，保持節奏繼續練習。' },
  weekly_50:   { emoji: '💪', title: '本週過半！', desc: '已完成本週目標的一半，很厲害！' },
  weekly_75:   { emoji: '🚀', title: '本週 75% 完成！', desc: '快到終點了，再接再厲！' },
  weekly_100:  { emoji: '🏆', title: '本週目標全部完成！', desc: '太強了！這週的練習目標全部達成。' },
  streak_3:    { emoji: '🔥', title: '連續練習 3 天！', desc: '三天不間斷，習慣正在養成中！' },
  streak_7:    { emoji: '⚡', title: '連續練習 7 天！', desc: '整整一週不中斷，你太厲害了！' },
}

interface Props {
  milestone: MilestoneType
  onClose: () => void
}

export default function MilestonePopup({ milestone, onClose }: Props) {
  const config = MILESTONE_CONFIG[milestone]

  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pb-8 px-4 pointer-events-none">
      <div
        className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-5 max-w-sm w-full pointer-events-auto animate-slide-up"
        style={{ animation: 'slideUp 0.3s ease-out' }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-400 text-lg leading-none"
          style={{ position: 'absolute' }}
        >×</button>
        <div className="flex items-start gap-4">
          <div className="text-4xl">{config.emoji}</div>
          <div>
            <p className="font-bold text-gray-100 text-base">{config.title}</p>
            <p className="text-sm text-gray-400 mt-0.5">{config.desc}</p>
          </div>
        </div>
        <div className="mt-3 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full"
            style={{ animation: 'shrink 4s linear forwards' }}
          />
        </div>
      </div>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes shrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  )
}
