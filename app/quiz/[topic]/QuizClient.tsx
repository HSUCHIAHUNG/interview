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
}

type Phase = "quiz" | "result";

export default function QuizClient({
  slug,
  meta,
  questions,
  mode = "topic",
}: Props) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );
  const [phase, setPhase] = useState<Phase>("quiz");

  const q = questions[current];
  const isAnswered = selected !== null;
  const isCorrect = selected === q.answer;

  function choose(idx: number) {
    if (isAnswered) return;
    setSelected(idx);
    const next = [...answers];
    next[current] = idx;
    setAnswers(next);
  }

  function goNext() {
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelected(answers[current + 1]);
    } else {
      setPhase("result");
    }
  }

  function goPrev() {
    if (current > 0) {
      setCurrent(current - 1);
      setSelected(answers[current - 1]);
    }
  }

  function restart() {
    if (mode === "random") {
      router.refresh();
      return;
    }
    setCurrent(0);
    setSelected(null);
    setAnswers(Array(questions.length).fill(null));
    setPhase("quiz");
  }

  const score = answers.filter((a, i) => a === questions[i].answer).length;

  if (phase === "result") {
    return (
      <div className="max-w-xl mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
          <div className="text-6xl mb-4">
            {score === questions.length
              ? "🏆"
              : score >= questions.length / 2
              ? "👍"
              : "📚"}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">測驗完成！</h2>
          <p className="text-5xl font-bold text-blue-600 my-6">
            {score} / {questions.length}
          </p>
          <p className="text-gray-500 mb-8">
            {score === questions.length
              ? "全對！你已經完全掌握這個主題。"
              : score >= questions.length / 2
              ? "不錯！繼續複習可以更熟練。"
              : "還需要加強，建議再看一遍筆記。"}
          </p>

          {/* Answer review */}
          <div className="text-left space-y-3 mb-8">
            {questions.map((q, i) => {
              const a = answers[i];
              const correct = a === q.answer;
              return (
                <div
                  key={q.id}
                  className={`p-3 rounded-lg text-sm border ${
                    correct
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <p className="font-medium text-gray-700">
                    {correct ? "✅" : "❌"} Q{i + 1}. {q.question}
                  </p>
                  {!correct && (
                    <p className="text-red-600 mt-1">
                      正確答案：{q.options[q.answer]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={restart}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl transition"
            >
              {mode === "random" ? "換一組題目" : "重新作答"}
            </button>
            <Link
              href={"/"}
              className="border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold px-6 py-2.5 rounded-xl transition"
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
          <span>
            {current + 1} / {questions.length}
          </span>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <p className="text-xs font-semibold text-blue-500 uppercase tracking-wide mb-4">
          第 {current + 1} 題
        </p>
        <h2 className="text-lg font-semibold text-gray-800 mb-6 leading-relaxed">
          {q.question}
        </h2>

        <div className="space-y-3">
          {q.options.map((opt, idx) => {
            let style =
              "w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition ";
            if (!isAnswered) {
              style +=
                "border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700 cursor-pointer";
            } else if (idx === q.answer) {
              style += "border-green-400 bg-green-50 text-green-800";
            } else if (idx === selected && idx !== q.answer) {
              style += "border-red-400 bg-red-50 text-red-800";
            } else {
              style += "border-gray-200 text-gray-400 cursor-default";
            }

            return (
              <button key={idx} className={style} onClick={() => choose(idx)}>
                <span className="mr-2 font-bold text-gray-400">
                  {String.fromCharCode(65 + idx)}.
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {isAnswered && (
          <div
            className={`mt-6 p-4 rounded-xl text-sm leading-relaxed ${
              isCorrect
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            <p className="font-semibold mb-1">
              {isCorrect ? "✅ 正確！" : "❌ 答錯了"}
            </p>
            <p>{q.explanation}</p>
          </div>
        )}

        {/* Nav */}
        <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
          <button
            onClick={goPrev}
            disabled={current === 0}
            className="text-sm text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            ← 上一題
          </button>
          {isAnswered && (
            <button
              onClick={goNext}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition"
            >
              {current + 1 < questions.length ? "下一題 →" : "查看結果"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
