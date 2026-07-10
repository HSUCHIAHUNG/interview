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
  onBack?: () => void;
  isLoggedIn?: boolean;
}

type Phase = "quiz" | "result";

interface QForm {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export default function QuizClient({
  slug,
  meta,
  questions,
  mode = "topic",
  initialCurrent = 0,
  initialAnswers = null,
  onBack,
  isLoggedIn,
}: Props) {
  const router = useRouter();

  // Local questions state for management
  const [localQs, setLocalQs] = useState<Question[]>(questions);

  // Quiz state
  const resolvedAnswers = initialAnswers ?? (Array(questions.length).fill(null) as (number | null)[]);
  const [current, setCurrent] = useState(initialCurrent);
  const [selected, setSelected] = useState<number | null>(resolvedAnswers[initialCurrent] ?? null);
  const [answers, setAnswers] = useState<(number | null)[]>(resolvedAnswers);
  const [phase, setPhase] = useState<Phase>("quiz");

  // Management state
  const [manageMode, setManageMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<QForm>({ question: "", options: ["", "", "", ""], answer: 0, explanation: "" });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState<QForm>({ question: "", options: ["", "", "", ""], answer: 0, explanation: "" });
  const [adding, setAdding] = useState(false);

  function exitManage() {
    setManageMode(false);
    setEditingId(null);
    setShowAdd(false);
    setCurrent(0);
    setSelected(null);
    setAnswers(Array(localQs.length).fill(null));
    setPhase("quiz");
  }

  function startEdit(q: Question) {
    const opts = [...q.options];
    while (opts.length < 4) opts.push("");
    setEditingId(q.id);
    setEditForm({ question: q.question, options: opts, answer: q.answer, explanation: q.explanation });
  }

  async function saveEdit(id: number) {
    if (!editForm.question.trim() || !editForm.explanation.trim()) return;
    setSaving(true);
    try {
      await fetch(`/api/topics/${slug}/questions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: editForm.question,
          options: editForm.options.map(o => o.trim()).filter(Boolean),
          answer: editForm.answer,
          explanation: editForm.explanation,
        }),
      });
      setLocalQs(prev => prev.map(q => q.id === id ? {
        ...q,
        question: editForm.question,
        options: editForm.options.filter(o => o.trim()),
        answer: editForm.answer,
        explanation: editForm.explanation,
      } : q));
      setEditingId(null);
    } finally { setSaving(false); }
  }

  async function deleteQ(id: number) {
    setDeleting(id);
    try {
      await fetch(`/api/topics/${slug}/questions/${id}`, { method: "DELETE" });
      setLocalQs(prev => prev.filter(q => q.id !== id));
      setDeleteConfirm(null);
    } finally { setDeleting(null); }
  }

  async function addQ() {
    if (!addForm.question.trim() || !addForm.explanation.trim() || adding) return;
    setAdding(true);
    try {
      const res = await fetch(`/api/topics/${slug}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: addForm.question,
          options: addForm.options.map(o => o.trim()).filter(Boolean),
          answer: addForm.answer,
          explanation: addForm.explanation,
        }),
      });
      const { id } = await res.json() as { id: number };
      setLocalQs(prev => [...prev, {
        id,
        question: addForm.question,
        options: addForm.options.filter(o => o.trim()),
        answer: addForm.answer,
        explanation: addForm.explanation,
      }]);
      setAddForm({ question: "", options: ["", "", "", ""], answer: 0, explanation: "" });
      setShowAdd(false);
    } finally { setAdding(false); }
  }

  // ── Management panel ──────────────────────────────────────────────────────
  if (manageMode) {
    return (
      <div className="max-w-xl mx-auto">
        <button onClick={exitManage} className="text-sm text-gray-500 hover:text-gray-300 transition mb-6 block">
          ← 回到測驗
        </button>
        <h2 className="text-lg font-semibold text-gray-100 mb-4">管理選擇題（{localQs.length} 題）</h2>

        <div className="space-y-3">
          {localQs.map((q, idx) => (
            <div key={q.id} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              {editingId === q.id ? (
                <div className="space-y-3">
                  <textarea
                    value={editForm.question}
                    onChange={e => setEditForm(f => ({ ...f, question: e.target.value }))}
                    rows={3}
                    placeholder="問題"
                    className="w-full bg-gray-800 text-gray-100 text-sm rounded-lg border border-gray-700 focus:border-gray-500 focus:outline-none px-3 py-2 font-mono resize-y"
                  />
                  {["A", "B", "C", "D"].map((lbl, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-500 w-4">{lbl}</span>
                      <input
                        value={editForm.options[i] ?? ""}
                        onChange={e => {
                          const opts = [...editForm.options];
                          opts[i] = e.target.value;
                          setEditForm(f => ({ ...f, options: opts }));
                        }}
                        placeholder={`選項 ${lbl}`}
                        className="flex-1 bg-gray-800 text-gray-200 text-sm rounded-lg border border-gray-700 focus:border-gray-500 focus:outline-none px-3 py-1.5"
                      />
                      <input
                        type="radio"
                        name={`answer-${q.id}`}
                        checked={editForm.answer === i}
                        onChange={() => setEditForm(f => ({ ...f, answer: i }))}
                        className="w-4 h-4 accent-blue-500"
                      />
                    </div>
                  ))}
                  <p className="text-xs text-gray-600">← Radio 選正確答案</p>
                  <textarea
                    value={editForm.explanation}
                    onChange={e => setEditForm(f => ({ ...f, explanation: e.target.value }))}
                    rows={4}
                    placeholder="解析"
                    className="w-full bg-gray-800 text-gray-300 text-sm rounded-lg border border-gray-700 focus:border-gray-500 focus:outline-none px-3 py-2 font-mono resize-y"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => saveEdit(q.id)} disabled={saving}
                      className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
                      {saving ? "儲存中..." : "儲存"}
                    </button>
                    <button onClick={() => setEditingId(null)} className="text-sm text-gray-500 hover:text-gray-300 px-3">取消</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200">
                      Q{idx + 1}. {q.question.length > 60 ? q.question.slice(0, 60) + "…" : q.question}
                    </p>
                    {q.options.length > 0 && (
                      <p className="text-xs text-gray-600 mt-0.5">
                        正確: {String.fromCharCode(65 + q.answer)}. {q.options[q.answer]?.slice(0, 30)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => startEdit(q)}
                      className="text-xs text-blue-400 hover:text-blue-300 border border-blue-800 hover:border-blue-600 px-2 py-1 rounded-lg transition">
                      編輯
                    </button>
                    {deleteConfirm === q.id ? (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-red-400">確定？</span>
                        <button onClick={() => deleteQ(q.id)} disabled={deleting === q.id}
                          className="text-xs bg-red-900/50 hover:bg-red-900 text-red-400 border border-red-800 px-2 py-1 rounded transition disabled:opacity-50">
                          {deleting === q.id ? "..." : "刪除"}
                        </button>
                        <button onClick={() => setDeleteConfirm(null)} className="text-xs text-gray-600 hover:text-gray-400">取消</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirm(q.id)}
                        className="text-gray-700 hover:text-red-400 transition text-lg leading-none px-1">×</button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4">
          {showAdd ? (
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-400">新增題目</h3>
              <textarea
                value={addForm.question}
                onChange={e => setAddForm(f => ({ ...f, question: e.target.value }))}
                rows={3}
                placeholder="問題"
                className="w-full bg-gray-800 text-gray-100 text-sm rounded-lg border border-gray-700 focus:border-gray-500 focus:outline-none px-3 py-2 font-mono resize-y"
              />
              {["A", "B", "C", "D"].map((lbl, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500 w-4">{lbl}</span>
                  <input
                    value={addForm.options[i] ?? ""}
                    onChange={e => {
                      const opts = [...addForm.options];
                      opts[i] = e.target.value;
                      setAddForm(f => ({ ...f, options: opts }));
                    }}
                    placeholder={`選項 ${lbl}`}
                    className="flex-1 bg-gray-800 text-gray-200 text-sm rounded-lg border border-gray-700 focus:border-gray-500 focus:outline-none px-3 py-1.5"
                  />
                  <input
                    type="radio"
                    name="new-answer"
                    checked={addForm.answer === i}
                    onChange={() => setAddForm(f => ({ ...f, answer: i }))}
                    className="w-4 h-4 accent-blue-500"
                  />
                </div>
              ))}
              <p className="text-xs text-gray-600">← Radio 選正確答案</p>
              <textarea
                value={addForm.explanation}
                onChange={e => setAddForm(f => ({ ...f, explanation: e.target.value }))}
                rows={4}
                placeholder="解析"
                className="w-full bg-gray-800 text-gray-300 text-sm rounded-lg border border-gray-700 focus:border-gray-500 focus:outline-none px-3 py-2 font-mono resize-y"
              />
              <div className="flex gap-2">
                <button onClick={addQ}
                  disabled={!addForm.question.trim() || !addForm.explanation.trim() || adding}
                  className="bg-violet-700 hover:bg-violet-600 disabled:opacity-40 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
                  {adding ? "新增中..." : "新增"}
                </button>
                <button onClick={() => { setShowAdd(false); setAddForm({ question: "", options: ["", "", "", ""], answer: 0, explanation: "" }); }}
                  className="text-sm text-gray-500 hover:text-gray-300 px-3">取消</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowAdd(true)}
              className="w-full py-3 border border-dashed border-gray-700 hover:border-gray-500 text-gray-500 hover:text-gray-300 text-sm rounded-xl transition">
              ＋ 新增題目
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Quiz logic ────────────────────────────────────────────────────────────
  const q = localQs[current];
  const isAnswered = selected !== null;
  const isCorrect = selected === q?.answer;

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
    if (current + 1 < localQs.length) {
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

  function goFirst() {
    saveProgress(0, answers);
    setCurrent(0);
    setSelected(answers[0] ?? null);
  }

  function restart() {
    if (mode === "random") {
      if (onBack) { onBack(); return; }
      router.refresh();
      return;
    }
    saveProgress(0, Array(localQs.length).fill(null));
    setCurrent(0);
    setSelected(null);
    setAnswers(Array(localQs.length).fill(null));
    setPhase("quiz");
  }

  const score = answers.filter((a, i) => a === localQs[i]?.answer).length;

  if (phase === "result") {
    return (
      <div className="max-w-xl mx-auto text-center">
        {isLoggedIn && mode === "topic" && (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setManageMode(true)}
              className="text-sm px-4 py-1.5 rounded-lg border border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300 transition"
            >
              ✏️ 管理題目
            </button>
          </div>
        )}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-10">
          <div className="text-6xl mb-4">
            {score === localQs.length ? "🏆" : score >= localQs.length / 2 ? "👍" : "📚"}
          </div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">測驗完成！</h2>
          <p className="text-5xl font-bold text-blue-400 my-6">{score} / {localQs.length}</p>
          <p className="text-gray-400 mb-8">
            {score === localQs.length
              ? "全對！你已經完全掌握這個主題。"
              : score >= localQs.length / 2
              ? "不錯！繼續複習可以更熟練。"
              : "還需要加強，建議再看一遍筆記。"}
          </p>

          <div className="text-left space-y-3 mb-8">
            {localQs.map((q, i) => {
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
            {mode === "random" && onBack ? (
              <button
                onClick={onBack}
                className="border border-gray-700 hover:bg-gray-800 text-gray-300 font-semibold px-6 py-2.5 rounded-xl transition"
              >
                回選題
              </button>
            ) : (
              <Link
                href="/"
                className="border border-gray-700 hover:bg-gray-800 text-gray-300 font-semibold px-6 py-2.5 rounded-xl transition"
              >
                {mode === "random" ? "回首頁" : "選其他主題"}
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Manage button */}
      {isLoggedIn && mode === "topic" && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setManageMode(true)}
            className="text-sm px-4 py-1.5 rounded-lg border border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300 transition"
          >
            ✏️ 管理題目
          </button>
        </div>
      )}

      {/* Back button */}
      <div className="mb-8">
        {current === 0 ? (
          mode === "random" && onBack ? (
            <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-300 transition">
              ← 回選題
            </button>
          ) : (
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 transition">
              ← 回首頁
            </Link>
          )
        ) : (
          <button onClick={goFirst} className="text-sm text-gray-500 hover:text-gray-300 transition">
            ← 回第一題
          </button>
        )}
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>{meta.title}</span>
          <span>{current + 1} / {localQs.length}</span>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${((current + 1) / localQs.length) * 100}%` }}
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
          {q?.question}
        </h2>

        <div className="space-y-3">
          {q?.options.map((opt, idx) => {
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
            <p>{q?.explanation}</p>
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
              {current + 1 < localQs.length ? "下一題 →" : "查看結果"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
