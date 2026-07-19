"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const LS_KEY = "focus_pending";

type Pending = { secondsDelta: number; leaveCountDelta: number };

function readPending(): Pending {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return { secondsDelta: 0, leaveCountDelta: 0 };
}

function writePending(p: Pending) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

function clearPending() {
  try {
    localStorage.removeItem(LS_KEY);
  } catch {
    /* ignore */
  }
}

function sendFocus(payload: Pending) {
  if (payload.secondsDelta <= 0 && payload.leaveCountDelta <= 0) return;
  const blob = new Blob([JSON.stringify(payload)], {
    type: "application/json",
  });
  navigator.sendBeacon("/api/focus", blob);
}

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  if (m < 60) return `${m} 分鐘`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem > 0 ? `${h}h ${rem}m` : `${h}h`;
}

export default function FocusTracker() {
  const { isSignedIn } = useAuth();

  const [todayBase, setTodayBase] = useState(0);
  const [sessionAcc, setSessionAcc] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Refs so event handlers always see latest values
  const isSignedInRef = useRef(false);
  const accRef = useRef(0);
  const syncedRef = useRef(0);
  const pendingLeavesRef = useRef(0);
  // null = currently visible; non-null = timestamp when we went hidden
  const hiddenAtRef = useRef<number | null>(null);
  const lsFlushTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const initDoneRef = useRef(false);

  // Keep isSignedIn ref in sync and trigger init once authed
  useEffect(() => {
    isSignedInRef.current = !!isSignedIn;
    if (isSignedIn && !initDoneRef.current) {
      initDoneRef.current = true;
      async function init() {
        const leftover = readPending();
        if (leftover.secondsDelta > 0 || leftover.leaveCountDelta > 0) {
          try {
            await fetch("/api/focus", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(leftover),
            });
            clearPending();
          } catch {
            /* keep for next visit */
          }
        }
        try {
          const d = (await fetch("/api/focus").then((r) => r.json())) as {
            seconds: number;
          };
          setTodayBase(d.seconds);
        } catch {
          /* ignore */
        }
      }
      init();
    }
  }, [isSignedIn]);

  // Set up timer + events ONCE on mount with empty deps.
  // All auth checks go through isSignedInRef to avoid stale closures.
  useEffect(() => {
    let blurTimerRef: ReturnType<typeof setTimeout> | null = null;

    function sync(leaveBonus = 0) {
      if (!isSignedInRef.current) return;
      const delta = accRef.current - syncedRef.current;
      const totalLeaves = pendingLeavesRef.current + leaveBonus;
      if (delta <= 0 && totalLeaves <= 0) return;
      sendFocus({ secondsDelta: delta, leaveCountDelta: totalLeaves });
      syncedRef.current = accRef.current;
      pendingLeavesRef.current = 0;
      clearPending();
    }

    function markHidden() {
      if (hiddenAtRef.current !== null) return; // already hidden, skip duplicate
      hiddenAtRef.current = Date.now();
      setIsPaused(true);
      sync(0);
    }

    function markVisible() {
      if (hiddenAtRef.current === null) return; // already visible, skip duplicate
      const away = Date.now() - hiddenAtRef.current;
      hiddenAtRef.current = null;
      setIsPaused(false);
      if (away > 60_000) pendingLeavesRef.current += 1;
    }

    // Primary: visibilitychange (tab switch, window minimize, switching apps)
    function onVisibilityChange() {
      if (document.visibilityState === "hidden") markHidden();
      else markVisible();
    }

    // Fallback: blur/focus handle the split-screen / two-window case where
    // document.visibilityState stays 'visible' but focus moves to another window.
    // 300ms grace period avoids false pauses when clicking the DevTools or address bar.
    function onBlur() {
      blurTimerRef = setTimeout(markHidden, 300);
    }

    function onFocus() {
      if (blurTimerRef !== null) {
        clearTimeout(blurTimerRef);
        blurTimerRef = null;
      }
      markVisible();
    }

    function onBeforeUnload() {
      sync(0);
    }

    // Tick: accumulate every second when page has focus
    const ticker = setInterval(() => {
      if (!isSignedInRef.current) return;
      if (document.visibilityState === "visible" && document.hasFocus()) {
        accRef.current += 1;
        setSessionAcc(accRef.current);
      }
    }, 1000);

    // LS crash buffer every 5 minutes
    lsFlushTimerRef.current = setInterval(() => {
      if (!isSignedInRef.current) return;
      const delta = accRef.current - syncedRef.current;
      if (delta > 0 || pendingLeavesRef.current > 0) {
        writePending({
          secondsDelta: delta,
          leaveCountDelta: pendingLeavesRef.current,
        });
      }
    }, 5 * 60 * 1000);

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      clearInterval(ticker);
      if (lsFlushTimerRef.current) clearInterval(lsFlushTimerRef.current);
      if (blurTimerRef !== null) clearTimeout(blurTimerRef);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, []); // empty deps — set up exactly once on mount

  const pathname = usePathname();

  if (!isSignedIn || pathname === "/") return null;

  const totalSeconds = todayBase + sessionAcc;
  const displayMinutes = Math.floor(totalSeconds / 60);

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm shadow-lg transition-all duration-300 select-none pointer-events-none ${
        isPaused
          ? "bg-gray-950/90 border-amber-900/60 text-amber-600"
          : "bg-gray-950/80 border-gray-700/50 text-gray-400"
      }`}
    >
      {isPaused ? (
        <>
          <span className="animate-pulse">⏸</span>
          <span>暫停中</span>
          <span className="text-gray-700 mx-1">·</span>
          <span className="text-gray-600">{formatTime(totalSeconds)}</span>
        </>
      ) : (
        <>
          <span>⏱</span>
          <span>{displayMinutes} 分鐘</span>
        </>
      )}
    </div>
  );
}
