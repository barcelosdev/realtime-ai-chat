import { useEffect, useRef, useState } from 'react'

export function useAutoScroll(dependencies: unknown[]) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    // Create intersection observer to detect if user is at bottom
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // If the bottom element is visible, user is at bottom
          setShouldAutoScroll(entry.isIntersecting)
        })
      },
      {
        threshold: 0.1,
      }
    )

    // Observe a sentinel element at the bottom
    const sentinel = document.createElement('div')
    sentinel.id = 'scroll-sentinel'
    element.appendChild(sentinel)
    observerRef.current.observe(sentinel)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      const sentinelEl = element.querySelector('#scroll-sentinel')
      if (sentinelEl) {
        sentinelEl.remove()
      }
    }
  }, [])

  useEffect(() => {
    if (shouldAutoScroll && scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, dependencies)

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      })
      setShouldAutoScroll(true)
    }
  }

  return { scrollRef, scrollToBottom }
}

