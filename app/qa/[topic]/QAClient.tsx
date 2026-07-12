"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import type { Question, TopicMeta } from "@/lib/topics";
import MilestonePopup from "@/app/components/MilestonePopup";
import type { MilestoneType } from "@/lib/db/queries";

interface Props {
  slug: string;
  meta: TopicMeta;
  questions: Question[];
  initialCurrent?: number;
  initialAnswers?: (string | null)[] | null;
  onBack?: () => void;
  isLoggedIn?: boolean;
  initialStarred?: number[];
}

type Phase = "answer" | "feedback" | "result";

interface FollowUpMessage {
  role: "user" | "model";
  content: string;
}

export default function QAClient({
  slug,
  meta,
  questions,
  initialCurrent = 0,
  initialAnswers = null,
  onBack,
  isLoggedIn,
  initialStarred = [],
}: Props) {
  const resolvedAnswers: (string | null)[] =
    initialAnswers ?? Array(questions.length).fill(null);

  const currentWasAnswered = resolvedAnswers[initialCurrent] !== null;

  // Local questions state for management
  const [localQs, setLocalQs] = useState<Question[]>(questions);

  const [current, setCurrent] = useState(initialCurrent);
  const [qaAnswers, setQaAnswers] = useState<(string | null)[]>(resolvedAnswers);
  const [userAnswer, setUserAnswer] = useState(resolvedAnswers[initialCurrent] ?? "");
  const [feedback, setFeedback] = useState(
    currentWasAnswered ? localQs[initialCurrent]?.explanation ?? "" : "",
  );
  const [phase, setPhase] = useState<Phase>(currentWasAnswered ? "feedback" : "answer");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [followUps, setFollowUps] = useState<FollowUpMessage[]>([]);
  const [followUpInput, setFollowUpInput] = useState("");
  const [isFollowUpLoading, setIsFollowUpLoading] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState("");

  // Management state
  const [manageMode, setManageMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editExplanation, setEditExplanation] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addQuestion, setAddQuestion] = useState("");
  const [addExplanation, setAddExplanation] = useState("");
  const [adding, setAdding] = useState(false);

  const [milestone, setMilestone] = useState<MilestoneType | null>(null);
  const [starred, setStarred] = useState<Set<number>>(() => new Set(initialStarred));

  async function toggleStar(questionId: number) {
    setStarred(prev => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId); else next.add(questionId);
      return next;
    });
    fetch('/api/starred', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId }),
    }).catch(() => {});
  }

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const followUpInputRef = useRef<HTMLInputElement>(null);

  const q = localQs[current];

  // ── Management functions ──────────────────────────────────────────────────
  function exitManage() {
    setManageMode(false);
    setEditingId(null);
    setShowAdd(false);
    setCurrent(0);
    setUserAnswer("");
    setFeedback("");
    setIsError(false);
    setPhase("answer");
    setFollowUps([]);
    setFollowUpInput("");
    setQaAnswers(Array(localQs.length).fill(null));
  }

  function startEditQA(q: Question) {
    setEditingId(q.id);
    setEditQuestion(q.question);
    setEditExplanation(q.explanation);
  }

  async function saveEditQA(q: Question) {
    if (!editQuestion.trim() || !editExplanation.trim()) return;
    setSaving(true);
    try {
      await fetch(`/api/topics/${slug}/questions/${q.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: editQuestion,
          options: q.options,
          answer: q.answer,
          explanation: editExplanation,
        }),
      });
      setLocalQs(prev => prev.map(item => item.id === q.id
        ? { ...item, question: editQuestion, explanation: editExplanation }
        : item
      ));
      setEditingId(null);
    } finally { setSaving(false); }
  }

  async function deleteQA(id: number) {
    setDeleting(id);
    try {
      await fetch(`/api/topics/${slug}/questions/${id}`, { method: "DELETE" });
      setLocalQs(prev => prev.filter(q => q.id !== id));
      setDeleteConfirm(null);
    } finally { setDeleting(null); }
  }

  async function addQA() {
    if (!addQuestion.trim() || !addExplanation.trim() || adding) return;
    setAdding(true);
    try {
      const res = await fetch(`/api/topics/${slug}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: addQuestion, options: [], answer: 0, explanation: addExplanation }),
      });
      const { id } = await res.json() as { id: number };
      setLocalQs(prev => [...prev, { id, question: addQuestion, options: [], answer: 0, explanation: addExplanation }]);
      setAddQuestion("");
      setAddExplanation("");
      setShowAdd(false);
    } finally { setAdding(false); }
  }

  // ── Management panel ──────────────────────────────────────────────────────
  if (manageMode) {
    return (
      <div className="max-w-2xl mx-auto">
        <button onClick={exitManage} className="text-sm text-gray-500 hover:text-gray-300 transition mb-6 block">
          ← 回到練習
        </button>
        <h2 className="text-lg font-semibold text-gray-100 mb-4">管理問答題（{localQs.length} 題）</h2>

        <div className="space-y-3">
          {localQs.map((q, idx) => (
            <div key={q.id} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              {editingId === q.id ? (
                <div className="space-y-3">
                  <textarea
                    value={editQuestion}
                    onChange={e => setEditQuestion(e.target.value)}
                    rows={3}
                    placeholder="問題"
                    className="w-full bg-gray-800 text-gray-100 text-sm rounded-lg border border-gray-700 focus:border-gray-500 focus:outline-none px-3 py-2 font-mono resize-y"
                  />
                  <textarea
                    value={editExplanation}
                    onChange={e => setEditExplanation(e.target.value)}
                    rows={5}
                    placeholder="參考答案 / 解析"
                    className="w-full bg-gray-800 text-gray-300 text-sm rounded-lg border border-gray-700 focus:border-gray-500 focus:outline-none px-3 py-2 font-mono resize-y"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => saveEditQA(q)} disabled={saving}
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
                    <p className="text-xs text-gray-600 mt-0.5 truncate">{q.explanation.slice(0, 50)}…</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => startEditQA(q)}
                      className="text-xs text-blue-400 hover:text-blue-300 border border-blue-800 hover:border-blue-600 px-2 py-1 rounded-lg transition">
                      編輯
                    </button>
                    {deleteConfirm === q.id ? (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-red-400">確定？</span>
                        <button onClick={() => deleteQA(q.id)} disabled={deleting === q.id}
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
              <h3 className="text-sm font-semibold text-gray-400">新增問答題</h3>
              <textarea
                value={addQuestion}
                onChange={e => setAddQuestion(e.target.value)}
                rows={3}
                placeholder="問題"
                className="w-full bg-gray-800 text-gray-100 text-sm rounded-lg border border-gray-700 focus:border-gray-500 focus:outline-none px-3 py-2 font-mono resize-y"
              />
              <textarea
                value={addExplanation}
                onChange={e => setAddExplanation(e.target.value)}
                rows={5}
                placeholder="參考答案 / 解析"
                className="w-full bg-gray-800 text-gray-300 text-sm rounded-lg border border-gray-700 focus:border-gray-500 focus:outline-none px-3 py-2 font-mono resize-y"
              />
              <div className="flex gap-2">
                <button onClick={addQA}
                  disabled={!addQuestion.trim() || !addExplanation.trim() || adding}
                  className="bg-violet-700 hover:bg-violet-600 disabled:opacity-40 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
                  {adding ? "新增中..." : "新增"}
                </button>
                <button onClick={() => { setShowAdd(false); setAddQuestion(""); setAddExplanation(""); }}
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

  // ── QA logic ──────────────────────────────────────────────────────────────
  function saveProgress(nextQuestion: number, answers: (string | null)[]) {
    fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topicSlug: slug,
        mode: "qa",
        currentQuestion: nextQuestion,
        qaAnswers: answers,
      }),
    }).catch(() => {});
  }

  function navigateTo(idx: number, answers: (string | null)[]) {
    saveProgress(idx, answers);
    setCurrent(idx);
    setIsError(false);
    setFollowUps([]);
    setFollowUpInput("");
    setStreamingResponse("");

    const savedAnswer = answers[idx];
    if (savedAnswer !== null) {
      setUserAnswer(savedAnswer);
      setFeedback(localQs[idx]?.explanation ?? "");
      setPhase("feedback");
    } else {
      setUserAnswer("");
      setFeedback("");
      setPhase("answer");
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }

  async function submitAnswer() {
    if (!userAnswer.trim()) return;
    setIsLoading(true);
    setIsError(false);
    setFeedback("");
    setPhase("feedback");

    const fixedFeedback = q?.explanation ?? "";
    setFeedback(fixedFeedback);

    const newQaAnswers = [...qaAnswers];
    newQaAnswers[current] = userAnswer;
    setQaAnswers(newQaAnswers);
    saveProgress(current, newQaAnswers);

    fetch("/api/user-answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: q?.id, mode: "qa", answer: userAnswer }),
    }).catch(() => {});


    setIsLoading(false);
    setTimeout(() => followUpInputRef.current?.focus(), 100);
  }

  async function sendFollowUp() {
    if (!followUpInput.trim() || isFollowUpLoading) return;

    const userMsg = followUpInput.trim();
    setFollowUpInput("");
    setIsFollowUpLoading(true);
    setStreamingResponse("");

    const historyBeforeThisMessage = followUps;
    setFollowUps((prev) => [...prev, { role: "user", content: userMsg }]);

    const history: FollowUpMessage[] = [
      {
        role: "user",
        content: `題目：${q?.question}\n\n參考答案：${q?.explanation}\n\n應試者的回答：${userAnswer}`,
      },
      { role: "model", content: feedback },
      ...historyBeforeThisMessage,
    ];

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history, message: userMsg }),
    });

    if (!res.ok || !res.body) {
      setFollowUps((prev) => [...prev, { role: "model", content: "回應失敗，請稍後再試。" }]);
      setIsFollowUpLoading(false);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      accumulated += decoder.decode(value, { stream: true });
      setStreamingResponse(accumulated);
    }

    setFollowUps((prev) => [...prev, { role: "model", content: accumulated }]);
    setStreamingResponse("");
    setIsFollowUpLoading(false);
  }

  function resetCurrent() {
    const newQaAnswers = [...qaAnswers];
    newQaAnswers[current] = null;
    setQaAnswers(newQaAnswers);
    saveProgress(current, newQaAnswers);

    setUserAnswer("");
    setFeedback("");
    setIsError(false);
    setPhase("answer");
    setFollowUps([]);
    setFollowUpInput("");
    setStreamingResponse("");
    setTimeout(() => textareaRef.current?.focus(), 100);
  }

  function goFirst() {
    navigateTo(0, qaAnswers);
  }

  function goPrev() {
    if (current === 0) return;
    navigateTo(current - 1, qaAnswers);
  }

  function goNext() {
    const nextIdx = current + 1;
    if (nextIdx < localQs.length) {
      navigateTo(nextIdx, qaAnswers);
    } else {
      saveProgress(0, qaAnswers);
      setPhase("result");
    }
  }

  function restart() {
    const empty = Array(localQs.length).fill(null) as (string | null)[];
    setQaAnswers(empty);
    saveProgress(0, empty);
    setCurrent(0);
    setUserAnswer("");
    setFeedback("");
    setIsError(false);
    setPhase("answer");
    setFollowUps([]);
    setFollowUpInput("");
    setTimeout(() => textareaRef.current?.focus(), 100);
  }

  const completedResults = localQs
    .map((q, i) =>
      qaAnswers[i] !== null
        ? { question: q.question, userAnswer: qaAnswers[i]!, feedback: q.explanation }
        : null,
    )
    .filter((r): r is { question: string; userAnswer: string; feedback: string } => r !== null);

  if (phase === "result") {
    return (
      <div className="max-w-2xl mx-auto">
        {milestone && <MilestonePopup milestone={milestone} onClose={() => setMilestone(null)} />}
        {isLoggedIn && !onBack && (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setManageMode(true)}
              className="text-sm px-4 py-1.5 rounded-lg border border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300 transition"
            >
              ✏️ 管理題目
            </button>
          </div>
        )}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">全部回答完畢！</h2>
          <p className="text-gray-500 mb-8">共 {localQs.length} 題，以下是你的作答紀錄</p>

          <div className="text-left space-y-4 mb-8">
            {completedResults.map((r, i) => (
              <details key={i} className="border border-gray-800 rounded-xl overflow-hidden">
                <summary className="px-4 py-3 cursor-pointer font-medium text-gray-300 hover:bg-gray-800">
                  Q{i + 1}. {r.question.slice(0, 50)}{r.question.length > 50 ? "..." : ""}
                </summary>
                <div className="px-4 pb-4 pt-2 space-y-3 border-t border-gray-800">
                  <div className="bg-blue-900/30 rounded-lg p-3">
                    <p className="text-xs font-semibold text-blue-400 mb-1">你的回答</p>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap">{r.userAnswer}</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <p className="text-xs font-semibold text-gray-500 mb-1">參考答案</p>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap">{r.feedback}</p>
                  </div>
                </div>
              </details>
            ))}
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={restart}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-xl transition"
            >
              再練一次
            </button>
            {onBack ? (
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
                回首頁
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {milestone && <MilestonePopup milestone={milestone} onClose={() => setMilestone(null)} />}

      {/* Manage button */}
      {isLoggedIn && !onBack && (
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
          onBack ? (
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
          <span>{meta.title} — 問答模式</span>
          <span>{current + 1} / {localQs.length}</span>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${((current + 1) / localQs.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-wide">
            第 {current + 1} 題
          </p>
          {isLoggedIn && q && (
            <button
              onClick={() => toggleStar(q.id)}
              title={starred.has(q.id) ? "取消必考題" : "加入必考題"}
              className={`text-xl transition ${starred.has(q.id) ? "text-yellow-400" : "text-gray-700 hover:text-yellow-400"}`}
            >
              {starred.has(q.id) ? "★" : "☆"}
            </button>
          )}
        </div>
        <h2 className="text-lg font-semibold text-gray-100 mb-6 leading-relaxed whitespace-pre-wrap">
          {q?.question}
        </h2>

        <textarea
          ref={textareaRef}
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && phase === "answer") {
              e.preventDefault();
              submitAnswer();
            }
          }}
          disabled={phase === "feedback"}
          placeholder="請用自己的話回答這個問題..."
          rows={5}
          className="w-full border border-gray-700 bg-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition disabled:bg-gray-900 disabled:text-gray-500"
        />

        {phase === "answer" && (
          <>
            <button
              onClick={submitAnswer}
              disabled={!userAnswer.trim()}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:cursor-not-allowed text-white disabled:text-gray-600 font-semibold py-3 rounded-xl transition"
            >
              送出，查看參考答案
            </button>
            <div className="flex justify-between mt-4 pt-4 border-t border-gray-800">
              <button
                onClick={goPrev}
                disabled={current === 0}
                className="text-sm text-gray-500 hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                ← 上一題
              </button>
            </div>
          </>
        )}

        {phase === "feedback" && (
          <div className="mt-6 border-t border-gray-800 pt-6">
            <p className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">回饋</p>
            {isLoading && !feedback && (
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <span className="animate-pulse">●</span>
                <span className="animate-pulse" style={{ animationDelay: "0.2s" }}>●</span>
                <span className="animate-pulse" style={{ animationDelay: "0.4s" }}>●</span>
                <span className="ml-1">評估中...</span>
              </div>
            )}
            {feedback && (
              <div className={`rounded-xl p-4 text-sm whitespace-pre-wrap leading-relaxed ${isError ? "bg-red-900/30 text-red-300" : "bg-gray-800 text-gray-300"}`}>
                {feedback}
              </div>
            )}
            {isError && !isLoading && (
              <button
                onClick={() => { setFeedback(""); setIsError(false); submitAnswer(); }}
                className="mt-3 w-full border border-gray-700 hover:bg-gray-800 text-gray-300 font-semibold py-2.5 rounded-xl transition"
              >
                重新評估
              </button>
            )}
            {!isLoading && feedback && !isError && (
              <button
                onClick={resetCurrent}
                className="mt-3 w-full border border-gray-700 hover:bg-gray-800 text-gray-500 text-sm py-2 rounded-xl transition"
              >
                重新作答這題
              </button>
            )}

            {/* Follow-up chat */}
            {!isLoading && feedback && (
              <>
                <div className="mt-6 border-t border-gray-800 pt-4">
                  <p className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">繼續提問</p>
                  {(followUps.length > 0 || streamingResponse || isFollowUpLoading) && (
                    <div className="space-y-3 mb-4">
                      {followUps.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300"}`}>
                            <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                          </div>
                        </div>
                      ))}
                      {streamingResponse && (
                        <div className="flex justify-start">
                          <div className="max-w-[85%] bg-gray-800 rounded-xl px-3 py-2 text-sm text-gray-300">
                            <p className="whitespace-pre-wrap leading-relaxed">{streamingResponse}</p>
                          </div>
                        </div>
                      )}
                      {isFollowUpLoading && !streamingResponse && (
                        <div className="flex justify-start">
                          <div className="bg-gray-800 rounded-xl px-3 py-2 text-sm text-gray-500 flex items-center gap-1">
                            <span className="animate-pulse">●</span>
                            <span className="animate-pulse" style={{ animationDelay: "0.2s" }}>●</span>
                            <span className="animate-pulse" style={{ animationDelay: "0.4s" }}>●</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      ref={followUpInputRef}
                      type="text"
                      value={followUpInput}
                      onChange={(e) => setFollowUpInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendFollowUp(); } }}
                      disabled={isFollowUpLoading}
                      placeholder="對這個評估有疑問嗎？繼續問..."
                      className="flex-1 border border-gray-700 bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition disabled:opacity-50"
                    />
                    <button
                      onClick={sendFollowUp}
                      disabled={!followUpInput.trim() || isFollowUpLoading}
                      className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:cursor-not-allowed text-white disabled:text-gray-600 font-semibold px-4 py-2.5 rounded-xl transition"
                    >
                      送出
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <button
                    onClick={goPrev}
                    disabled={current === 0}
                    className="text-sm text-gray-500 hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition shrink-0"
                  >
                    ← 上一題
                  </button>
                  <button
                    onClick={goNext}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition"
                  >
                    {current + 1 < localQs.length ? "下一題 →" : "查看總結"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
