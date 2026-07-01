"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { Question, TopicMeta } from "@/lib/topics";

interface Props {
  slug: string;
  meta: TopicMeta;
  questions: Question[];
}

type Phase = "answer" | "feedback" | "result";

interface FollowUpMessage {
  role: "user" | "model";
  content: string;
}

interface QuestionResult {
  question: string;
  userAnswer: string;
  feedback: string;
}

export default function QAClient({ slug, meta, questions }: Props) {
  const [current, setCurrent] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [phase, setPhase] = useState<Phase>("answer");
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [isError, setIsError] = useState(false);

  const [followUps, setFollowUps] = useState<FollowUpMessage[]>([]);
  const [followUpInput, setFollowUpInput] = useState("");
  const [isFollowUpLoading, setIsFollowUpLoading] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const followUpInputRef = useRef<HTMLInputElement>(null);

  const q = questions[current];

  useEffect(() => {
    fetch(`/api/progress?topic=${slug}&mode=qa`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;
        if (data.currentQuestion > 0) setCurrent(data.currentQuestion);
      })
      .catch(() => {});
  }, [slug]);

  function saveProgress(nextQuestion: number) {
    fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicSlug: slug, mode: "qa", currentQuestion: nextQuestion }),
    }).catch(() => {});
  }

  async function submitAnswer() {
    if (!userAnswer.trim()) return;
    setIsLoading(true);
    setIsError(false);
    setFeedback("");
    setPhase("feedback");

    const fixedFeedback = q.explanation;
    setFeedback(fixedFeedback);
    setResults((prev) => [
      ...prev,
      { question: q.question, userAnswer, feedback: fixedFeedback },
    ]);

    fetch("/api/user-answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: q.id, mode: "qa", answer: userAnswer }),
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
        content: `題目：${q.question}\n\n參考答案：${q.explanation}\n\n應試者的回答：${userAnswer}`,
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
    setUserAnswer("");
    setFeedback("");
    setIsError(false);
    setPhase("answer");
    setFollowUps([]);
    setFollowUpInput("");
    setStreamingResponse("");
    setResults((prev) => prev.slice(0, -1));
    setTimeout(() => textareaRef.current?.focus(), 100);
  }

  function goNext() {
    const nextIdx = current + 1;
    if (nextIdx < questions.length) {
      saveProgress(nextIdx);
      setCurrent(nextIdx);
      setUserAnswer("");
      setFeedback("");
      setIsError(false);
      setPhase("answer");
      setFollowUps([]);
      setFollowUpInput("");
      setTimeout(() => textareaRef.current?.focus(), 100);
    } else {
      saveProgress(0);
      setPhase("result");
    }
  }

  function restart() {
    saveProgress(0);
    setCurrent(0);
    setUserAnswer("");
    setFeedback("");
    setIsError(false);
    setResults([]);
    setPhase("answer");
    setFollowUps([]);
    setFollowUpInput("");
    setTimeout(() => textareaRef.current?.focus(), 100);
  }

  if (phase === "result") {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">全部回答完畢！</h2>
          <p className="text-gray-500 mb-8">共 {questions.length} 題，以下是你的作答紀錄</p>

          <div className="text-left space-y-4 mb-8">
            {results.map((r, i) => (
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
            <Link
              href="/"
              className="border border-gray-700 hover:bg-gray-800 text-gray-300 font-semibold px-6 py-2.5 rounded-xl transition"
            >
              回首頁
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>{meta.title} — 問答模式</span>
          <span>{current + 1} / {questions.length}</span>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-wide">
            第 {current + 1} 題
          </p>
        </div>
        <h2 className="text-lg font-semibold text-gray-100 mb-6 leading-relaxed whitespace-pre-wrap">
          {q.question}
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
          <button
            onClick={submitAnswer}
            disabled={!userAnswer.trim()}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:cursor-not-allowed text-white disabled:text-gray-600 font-semibold py-3 rounded-xl transition"
          >
            送出，查看參考答案
          </button>
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
                <button
                  onClick={goNext}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition"
                >
                  {current + 1 < questions.length ? "下一題 →" : "查看總結"}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
