"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import MemoModal from "./MemoModal";
import WeekHistoryModal from "./WeekHistoryModal";
import GoalModal from "./GoalModal";
import TodoModal from "./TodoModal";

type Modal = "memo" | "history" | "goal" | "todo" | null;

export default function HeaderMenu({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState<Modal>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [menuOpen]);

  function openModal(m: Modal) {
    setMenuOpen(false);
    setModal(m);
  }

  const btnClass =
    "flex items-center gap-1 text-xs font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 px-2.5 py-1 rounded-lg transition";
  const menuItemClass =
    "flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 transition text-left";

  return (
    <>
      <div className="w-full flex justify-between items-center gap-2 mb-6">
        <div className="min-w-8 flex items-center">
          {isLoggedIn ? (
            <UserButton />
          ) : (
            <Link
              href="/sign-in"
              className="text-sm text-gray-400 hover:text-gray-200 border border-gray-700 hover:border-gray-500 px-4 py-1.5 rounded-lg transition"
            >
              登入
            </Link>
          )}
        </div>

        {isLoggedIn && (
          <>
            {/* Desktop: all buttons inline */}
            <div className=" hidden md:flex items-end gap-2">
              <button onClick={() => openModal("memo")} className={btnClass}>
                📝 筆記
              </button>
              <button onClick={() => openModal("todo")} className={btnClass}>
                ✅ 待辦
              </button>
              <button onClick={() => openModal("history")} className={btnClass}>
                📅 歷史
              </button>
              <button onClick={() => openModal("goal")} className={btnClass}>
                🎯 目標
              </button>
              <Link href="/starred" className={btnClass}>
                ⭐ 必考題
              </Link>
            </div>

            {/* Mobile: hamburger */}
            <div className="relative md:hidden" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="選單"
                className="flex flex-col justify-center items-center w-9 h-9 gap-1 rounded-lg border border-gray-700 bg-gray-800 hover:bg-gray-700 transition"
              >
                <span
                  className={`block w-4.5 h-0.5 bg-gray-300 rounded-full transition-all duration-200 origin-center ${
                    menuOpen ? "translate-y-1.5 rotate-45" : ""
                  }`}
                />
                <span
                  className={`block w-4.5 h-0.5 bg-gray-300 rounded-full transition-all duration-200 ${
                    menuOpen ? "opacity-0 scale-x-0" : ""
                  }`}
                />
                <span
                  className={`block w-4.5 h-0.5 bg-gray-300 rounded-full transition-all duration-200 origin-center ${
                    menuOpen ? "-translate-y-1.5 -rotate-45" : ""
                  }`}
                />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-11 w-36 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
                  <button
                    onClick={() => openModal("memo")}
                    className={menuItemClass}
                  >
                    📝 筆記
                  </button>
                  <button
                    onClick={() => openModal("todo")}
                    className={`${menuItemClass} border-t border-gray-800`}
                  >
                    ✅ 待辦
                  </button>
                  <button
                    onClick={() => openModal("history")}
                    className={`${menuItemClass} border-t border-gray-800`}
                  >
                    📅 歷史
                  </button>
                  <button
                    onClick={() => openModal("goal")}
                    className={`${menuItemClass} border-t border-gray-800`}
                  >
                    🎯 目標
                  </button>
                  <Link
                    href="/starred"
                    onClick={() => setMenuOpen(false)}
                    className={`${menuItemClass} border-t border-gray-800`}
                  >
                    ⭐ 必考題
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {modal === "memo" && <MemoModal onClose={() => setModal(null)} />}
      {modal === "history" && (
        <WeekHistoryModal onClose={() => setModal(null)} />
      )}
      {modal === "goal" && <GoalModal onClose={() => setModal(null)} />}
      {modal === "todo" && <TodoModal onClose={() => setModal(null)} />}
    </>
  );
}
