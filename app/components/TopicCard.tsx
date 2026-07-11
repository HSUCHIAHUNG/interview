"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { TopicMeta } from "@/lib/topics";
import { toggleTopicCompletion } from "@/app/actions/topic-completion";
import MilestonePopup from "./MilestonePopup";
import type { MilestoneType } from "@/lib/db/queries";

const DIFFICULTY_COLOR = {
  easy: "bg-green-900/40 text-green-400",
  medium: "bg-yellow-900/40 text-yellow-400",
  hard: "bg-red-900/40 text-red-400",
};

const DIFFICULTY_LABEL = {
  easy: "入門",
  medium: "中級",
  hard: "進階",
};

const CATEGORY_COLOR: Record<string, string> = {
  JavaScript: "bg-blue-900/40 text-blue-300 border border-blue-800",
  React: "bg-cyan-900/40 text-cyan-300 border border-cyan-800",
  "Next.js": "bg-slate-800 text-slate-300 border border-slate-600",
  CSS: "bg-pink-900/40 text-pink-300 border border-pink-800",
  TypeScript: "bg-indigo-900/40 text-indigo-300 border border-indigo-800",
  Network: "bg-orange-900/40 text-orange-300 border border-orange-800",
  Browser: "bg-purple-900/40 text-purple-300 border border-purple-800",
};

interface Props {
  slug: string;
  meta: TopicMeta;
  questionCount: number;
  hasDemo: boolean;
  hasNotes: boolean;
  hasPractice: boolean;
  initialCompleted: boolean;
  isLoggedIn: boolean;
  subCategory?: string | null;
  practiceProgress?: { completed: number; total: number };
}

export default function TopicCard({
  slug,
  meta,
  questionCount,
  hasDemo,
  hasNotes,
  hasPractice,
  initialCompleted,
  isLoggedIn,
  subCategory,
  practiceProgress,
}: Props) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [isPending, startTransition] = useTransition();
  const [milestone, setMilestone] = useState<MilestoneType | null>(null);

  function handleToggle() {
    if (!isLoggedIn) return;
    const next = !completed;
    setCompleted(next);
    if (next) {
      fetch("/api/question-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicSlug: slug, mode: "completion" }),
      })
        .then(r => r.json())
        .then((d: { milestone?: MilestoneType }) => {
          if (d.milestone) setMilestone(d.milestone)
          window.dispatchEvent(new Event("progress-updated"))
        })
        .catch(() => {});
    } else {
      // Only deletes today's log; past days are preserved
      fetch("/api/question-log", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicSlug: slug }),
      })
        .then(() => window.dispatchEvent(new Event("progress-updated")))
        .catch(() => {});
    }
    startTransition(async () => {
      const result = await toggleTopicCompletion(slug);
      setCompleted(result);
    });
  }

  return (
    <div
      className={`bg-gray-900 rounded-2xl border p-6 flex flex-col gap-4 transition ${
        completed ? "border-green-700" : "border-gray-800 hover:border-gray-700"
      }`}
    >
      {milestone && <MilestonePopup milestone={milestone} onClose={() => setMilestone(null)} />}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-gray-100">{meta.title}</h2>
          <p className="text-sm text-gray-500 mt-1">{meta.description}</p>
        </div>
        <span
          className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${
            DIFFICULTY_COLOR[meta.difficulty]
          }`}
        >
          {DIFFICULTY_LABEL[meta.difficulty]}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
            CATEGORY_COLOR[meta.category] ?? "bg-gray-800 text-gray-400"
          }`}
        >
          {meta.category}
        </span>
        {subCategory && (
          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700">
            {subCategory}
          </span>
        )}
        <span className="text-xs text-gray-600">{questionCount} 道題目</span>
        {completed && (
          <span className="text-xs text-green-500 font-medium">✓ 已完成</span>
        )}
      </div>

      <div className="flex gap-2 mt-auto pt-2 flex-wrap">
        {/* 實作練習（有 practice challenge 的主題） */}
        {hasPractice && (
          <Link
            href={`/practice/${slug}`}
            className="flex-1 text-center bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
          >
            實作練習
            {practiceProgress && (
              <span className="text-xs opacity-75 font-normal">
                {practiceProgress.completed}/{practiceProgress.total}
              </span>
            )}
          </Link>
        )}

        {/* 選擇題 + 問答（有題目的主題，無論是否有實作練習） */}
        {questionCount > 0 && (
          <>
            <Link
              href={`/quiz/${slug}`}
              className="w-22 shrink-0 whitespace-nowrap text-center bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-2 rounded-lg transition"
            >
              選擇題
            </Link>
            <Link
              href={`/qa/${slug}`}
              className="w-22 shrink-0 whitespace-nowrap text-center bg-purple-700 hover:bg-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
            >
              問答練習
            </Link>
          </>
        )}

        {/* 查看說明 */}
        {hasNotes && (
          <Link
            href={`/notes/${slug}`}
            className="w-22 shrink-0 whitespace-nowrap text-center bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            查看說明
          </Link>
        )}

        {/* Demo（只有非實作練習主題才有） */}
        {!hasPractice && (
          hasDemo ? (
            <Link
              href={`/demo/${slug}`}
              className="w-22 shrink-0 whitespace-nowrap text-center bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 text-sm font-semibold px-4 py-2 rounded-lg transition"
            >
              Demo
            </Link>
          ) : (
            <span className="w-22 shrink-0 whitespace-nowrap text-center bg-gray-900 text-gray-700 border border-gray-800 text-sm font-semibold px-4 py-2 rounded-lg cursor-not-allowed">
              Demo
            </span>
          )
        )}

        {/* 聆聽 */}
        <Link
          href={`/listen/${slug}`}
          className="w-22 shrink-0 whitespace-nowrap text-center bg-violet-900/40 hover:bg-violet-900/70 text-violet-300 border border-violet-800 text-sm font-semibold px-4 py-2 rounded-lg transition"
        >
          🎧 聆聽
        </Link>
      </div>

      {isLoggedIn && (
        <button
          onClick={handleToggle}
          disabled={isPending}
          className={`w-full text-sm py-2 rounded-xl transition border disabled:opacity-60 ${
            completed
              ? "border-green-700 bg-green-900/30 text-green-400 hover:bg-green-900/50"
              : "border-gray-700 text-gray-500 hover:bg-gray-800"
          }`}
        >
          {completed ? "✓ 標記為已完成" : "標記為已完成"}
        </button>
      )}
    </div>
  );
}
