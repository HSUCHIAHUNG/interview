"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Question, TopicMeta } from "@/lib/topics";

interface Props {
  slug: string;
  meta: TopicMeta;
  questions: Question[];
  mode?: "topic" | "random";
  initialCurrent?: number;
  initialAnswers?: (number | null)[] | null;
}

type Phase = "quiz" | "result";

export default function QuizClient({
  slug,
  meta,
  questions,
  mode = "topic",
  initialCurrent = 0,
  initialAnswers = null,
}: Props) {
  const router = useRouter();
  const resolvedAnswers = initialAnswers ?? (Array(questions.length).fill(null) as (number | null)[]);
  const [current, setCurrent] = useState(initialCurrent);
  const [selected, setSelected] = useState<number | null>(resolvedAnswers[initialCurrent] ?? null);
  const [answers, setAnswers] = useState<(number | null)[]>(resolvedAnswers);
  const [phase, setPhase] = useState<Phase>("quiz");

  const q = questions[current];
  const isAnswered = selected !== null;
  const isCorrect = selected === q.answer;

  function saveProgress(nextIdx: number, nextAnswers: (number | null)[]) {
    if (mode !== "topic") return;
    fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topicSlug: slug,
        mode: "quiz",
        currentQuestion: nextIdx,
        quizAnswers: nextAnswers,
      }),
    }).catch(() => {});
  }

  function choose(idx: number) {
    if (isAnswered) return;
    setSelected(idx);
    const next = [...answers];
    next[current] = idx;
    setAnswers(next);
    saveProgress(current, next);
  }

  function goNext() {
    if (current + 1 < questions.length) {
      const nextIdx = current + 1;
      saveProgress(nextIdx, answers);
      setCurrent(nextIdx);
      setSelected(answers[nextIdx] ?? null);
    } else {
      saveProgress(0, answers);
      setPhase("result");
    }
  }

  function goPrev() {
    if (current > 0) {
      const prevIdx = current - 1;
      saveProgress(prevIdx, answers);
      setCurrent(prevIdx);
      setSelected(answers[prevIdx] ?? null);
    }
  }

  function restart() {
    if (mode === "random") {
      router.refresh();
      return;
    }
    saveProgress(0, Array(questions.length).fill(null));
    setCurrent(0);
    setSelected(null);
    setAnswers(Array(questions.length).fill(null));
    setPhase("quiz");
  }

  const score = answers.filter((a, i) => a === questions[i].answer).length;

  if (phase === "result") {
    return (
      <div className="max-w-xl mx-auto text-center">
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-10">
          <div className="text-6xl mb-4">
            {score === questions.length ? "🏆" : score >= questions.length / 2 ? "👍" : "📚"}
          </div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">測驗完成！</h2>
          <p className="text-5xl font-bold text-blue-400 my-6">{score} / {questions.length}</p>
          <p className="text-gray-400 mb-8">
            {score === questions.length
              ? "全對！你已經完全掌握這個主題。"
              : score >= questions.length / 2
              ? "不錯！繼續複習可以更熟練。"
              : "還需要加強，建議再看一遍筆記。"}
          </p>

          <div className="text-left space-y-3 mb-8">
            {questions.map((q, i) => {
              const a = answers[i];
              const correct = a === q.answer;
              return (
                <div
                  key={q.id}
                  className={`p-3 rounded-lg text-sm border ${correct ? "border-green-800 bg-green-900/30" : "border-red-800 bg-red-900/30"}`}
                >
                  <p className={`font-medium ${correct ? "text-green-300" : "text-red-300"}`}>
                    {correct ? "✅" : "❌"} Q{i + 1}. {q.question}
                  </p>
                  {!correct && (
                    <p className="text-red-400 mt-1">正確答案：{q.options[q.answer]}</p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={restart}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-xl transition"
            >
              {mode === "random" ? "換一組題目" : "重新作答"}
            </button>
            <Link
              href="/"
              className="border border-gray-700 hover:bg-gray-800 text-gray-300 font-semibold px-6 py-2.5 rounded-xl transition"
            >
              {mode === "random" ? "回首頁" : "選其他主題"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>{meta.title}</span>
          <span>{current + 1} / {questions.length}</span>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-wide">
            第 {current + 1} 題
          </p>
        </div>
        <h2 className="text-lg font-semibold text-gray-100 mb-6 leading-relaxed whitespace-pre-wrap">
          {q.question}
        </h2>

        <div className="space-y-3">
          {q.options.map((opt, idx) => {
            let style = "w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition ";
            if (!isAnswered) {
              style += "border-gray-700 hover:border-blue-500 hover:bg-blue-900/20 text-gray-200 cursor-pointer";
            } else if (idx === q.answer) {
              style += "border-green-600 bg-green-900/30 text-green-300";
            } else if (idx === selected && idx !== q.answer) {
              style += "border-red-600 bg-red-900/30 text-red-300";
            } else {
              style += "border-gray-800 text-gray-600 cursor-default";
            }
            return (
              <button key={idx} className={style} onClick={() => choose(idx)}>
                <span className="mr-2 font-bold text-gray-600">{String.fromCharCode(65 + idx)}.</span>
                {opt}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className={`mt-6 p-4 rounded-xl text-sm leading-relaxed ${isCorrect ? "bg-green-900/30 border border-green-800 text-green-300" : "bg-red-900/30 border border-red-800 text-red-300"}`}>
            <p className="font-semibold mb-1">{isCorrect ? "✅ 正確！" : "❌ 答錯了"}</p>
            <p>{q.explanation}</p>
          </div>
        )}

        {/* Nav */}
        <div className="flex justify-between mt-6 pt-4 border-t border-gray-800">
          <button
            onClick={goPrev}
            disabled={current === 0}
            className="text-sm text-gray-500 hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            ← 上一題
          </button>
          {isAnswered && (
            <button
              onClick={goNext}
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2 rounded-lg transition"
            >
              {current + 1 < questions.length ? "下一題 →" : "查看結果"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
