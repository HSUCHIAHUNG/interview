'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false, minimum: 0.15, speed: 300 })

function ProgressBarWatcher() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Complete progress bar when navigation finishes
  useEffect(() => {
    NProgress.done()
  }, [pathname, searchParams])

  // Start progress bar on link click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest('a') as HTMLAnchorElement | null
      if (
        anchor?.href &&
        !anchor.target &&
        !e.ctrlKey && !e.metaKey && !e.shiftKey &&
        new URL(anchor.href).origin === window.location.origin
      ) {
        NProgress.start()
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return null
}

export default function ProgressBarProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Suspense fallback={null}>
        <ProgressBarWatcher />
      </Suspense>
    </>
  )
}
