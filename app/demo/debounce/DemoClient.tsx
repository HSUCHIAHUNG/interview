'use client'

import { useEffect, useRef, useState } from 'react'
import type { ReactNode, RefObject } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Func = (...args: any[]) => void

function debounceWithApply(func: Func, wait: number): Func {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  return function (this: unknown, ...args: any[]) {
    const context = this
    clearTimeout(timeoutId!)
    timeoutId = setTimeout(() => { func.apply(context, args) }, wait)
  }
}

function debounceNoApply(func: Func, wait: number): Func {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  return function (...args: any[]) {
    clearTimeout(timeoutId!)
    timeoutId = setTimeout(() => { func(...args) }, wait)
  }
}

type LogType = 'typed' | 'fired' | 'warn'
interface LogEntry { type: LogType; text: string }
interface CardState { typed: number; fired: number; ctxId: string; logs: LogEntry[] }
const INIT: CardState = { typed: 0, fired: 0, ctxId: '—', logs: [] }

export default function DebounceDemo() {
  const [good, setGood] = useState<CardState>(INIT)
  const [bad, setBad] = useState<CardState>(INIT)
  const inputGoodRef = useRef<HTMLInputElement>(null)
  const inputBadRef = useRef<HTMLInputElement>(null)
  const cntGood = useRef({ typed: 0, fired: 0 })
  const cntBad = useRef({ typed: 0, fired: 0 })

  useEffect(() => {
    const elGood = inputGoodRef.current
    const elBad = inputBadRef.current
    if (!elGood || !elBad) return

    function handleGoodFired(this: HTMLInputElement, event: Event) {
      cntGood.current.fired++
      const ctxId = this?.id ?? 'undefined'
      const value = (event.target as HTMLInputElement).value
      setGood(prev => ({
        ...prev,
        fired: cntGood.current.fired,
        ctxId,
        logs: [...prev.logs, {
          type: 'fired',
          text: `✅ 執行 #${cntGood.current.fired}　value="${value}"　this.id="${ctxId}"`,
        }],
      }))
    }

    function handleBadFired(this: unknown, event: Event) {
      cntBad.current.fired++
      const self = this as HTMLInputElement | undefined
      const ctxId = self?.id ?? 'undefined'
      const value = (event.target as HTMLInputElement).value
      const isWrong = !self?.id
      setBad(prev => ({
        ...prev,
        fired: cntBad.current.fired,
        ctxId,
        logs: [...prev.logs, {
          type: isWrong ? 'warn' : 'fired',
          text: `${isWrong ? '❌' : '✅'} 執行 #${cntBad.current.fired}　value="${value}"　this.id="${ctxId}"`,
        }],
      }))
    }

    const debouncedGood = debounceWithApply(handleGoodFired, 300)
    const debouncedBad = debounceNoApply(handleBadFired, 300)

    function onGoodInput(e: Event) {
      cntGood.current.typed++
      const value = (e.target as HTMLInputElement).value
      setGood(prev => ({
        ...prev,
        typed: cntGood.current.typed,
        logs: [...prev.logs, {
          type: 'typed',
          text: `⌨️ 鍵入 #${cntGood.current.typed}：「${value}」`,
        }],
      }))
      debouncedGood.call(e.currentTarget, e)
    }

    function onBadInput(e: Event) {
      cntBad.current.typed++
      const value = (e.target as HTMLInputElement).value
      setBad(prev => ({
        ...prev,
        typed: cntBad.current.typed,
        logs: [...prev.logs, {
          type: 'typed',
          text: `⌨️ 鍵入 #${cntBad.current.typed}：「${value}」`,
        }],
      }))
      debouncedBad(e)
    }

    elGood.addEventListener('input', onGoodInput)
    elBad.addEventListener('input', onBadInput)

    return () => {
      elGood.removeEventListener('input', onGoodInput)
      elBad.removeEventListener('input', onBadInput)
    }
  }, [])

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <DemoCard
        variant="good"
        title={<>使用 <code className="bg-emerald-50 text-emerald-700 px-1 rounded">func.apply(context, args)</code></>}
        badge="正確示範"
        inputId="input-good"
        inputRef={inputGoodRef}
        state={good}
        desc="使用 apply(context, args)，回呼函式內的 this 正確指向觸發事件的 <input> 元素。"
      />
      <DemoCard
        variant="bad"
        title={<>不使用 <code className="bg-red-50 text-red-700 px-1 rounded">apply</code></>}
        badge="問題示範"
        inputId="input-bad"
        inputRef={inputBadRef}
        state={bad}
        desc="沒有 apply，直接呼叫 func(...args)，this 在 strict mode 下變成 undefined。"
      />
    </div>
  )
}

interface DemoCardProps {
  variant: 'good' | 'bad'
  title: ReactNode
  badge: string
  inputId: string
  inputRef: RefObject<HTMLInputElement | null>
  state: CardState
  desc: string
}

function DemoCard({ variant, title, badge, inputId, inputRef, state, desc }: DemoCardProps) {
  const logRef = useRef<HTMLDivElement>(null)
  const isGood = variant === 'good'

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [state.logs.length])

  return (
    <div className={`flex-1 bg-white rounded-2xl border p-6 shadow-sm ${isGood ? 'border-emerald-200' : 'border-red-200'}`}>
      <h2 className={`text-base font-semibold mb-2 ${isGood ? 'text-emerald-700' : 'text-red-700'}`}>{title}</h2>
      <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-4 ${isGood ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
        {badge}
      </span>

      <label htmlFor={inputId} className="block text-sm text-gray-500 mb-1.5">
        搜尋輸入（300ms debounce）
      </label>
      <input
        id={inputId}
        ref={inputRef}
        type="text"
        placeholder="開始輸入…"
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400 transition"
      />

      <div className="flex gap-5 mt-3 text-xs text-gray-500">
        <span>鍵入：<b className="text-blue-600">{state.typed}</b></span>
        <span>執行：<b className={isGood ? 'text-emerald-600' : 'text-red-500'}>{state.fired}</b></span>
        <span>this.id：<b className={isGood ? 'text-emerald-600' : 'text-red-500'}>{state.ctxId}</b></span>
      </div>

      <div
        ref={logRef}
        className="mt-3 bg-gray-50 border border-gray-100 rounded-lg p-3 h-44 overflow-y-auto font-mono text-xs"
      >
        {state.logs.length === 0
          ? <p className="text-gray-300">輸入後會在這裡顯示記錄…</p>
          : state.logs.map((log, i) => (
            <p
              key={i}
              className={
                log.type === 'fired' ? 'text-emerald-600 font-semibold' :
                log.type === 'warn'  ? 'text-red-600 font-semibold' :
                'text-gray-400'
              }
            >
              {log.text}
            </p>
          ))
        }
      </div>

      <p className={`mt-3 text-xs leading-relaxed p-3 rounded-lg border-l-2 ${isGood ? 'bg-emerald-50 border-emerald-400 text-emerald-800' : 'bg-red-50 border-red-400 text-red-800'}`}>
        {desc}
      </p>
    </div>
  )
}
