import type { CSSProperties, ReactNode } from 'react'
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'

interface Props {
  /** id of the element inside `children` that titles the dialog. */
  labelledBy: string
  /** Where the dialog lifts out of (and returns to). */
  originRect?: DOMRect | null
  accent?: string
  onClose: () => void
  children: ReactNode
}

const EASE = 'cubic-bezier(0.2, 0.7, 0.2, 1)'

function offsetFrom(origin: DOMRect, panel: DOMRect): string {
  const dx = origin.left + origin.width / 2 - (panel.left + panel.width / 2)
  const dy = origin.top + origin.height / 2 - (panel.top + panel.height / 2)
  const s = Math.min(1, Math.max(0.18, origin.width / panel.width))
  return `translate(${dx}px, ${dy}px) scale(${s})`
}

/**
 * Centered dialog that lifts out of the element it was opened from.
 * Handles Escape, backdrop click, scroll lock, focus-in and focus-return.
 * The page behind is made `inert` by the parent while this is mounted.
 */
export function Modal({ labelledBy, originRect, accent, onClose, children }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const closing = useRef(false)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Enter: scroll lock, focus, lift animation. Cleanup: unlock, return focus.
  useLayoutEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    const root = document.documentElement
    const prevOverflow = root.style.overflow
    const prevPadding = document.body.style.paddingRight
    const scrollbar = window.innerWidth - root.clientWidth
    root.style.overflow = 'hidden'
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`

    const panel = panelRef.current
    const backdrop = backdropRef.current
    panel?.querySelector<HTMLElement>('[data-autofocus]')?.focus({ preventScroll: true })

    if (panel && backdrop) {
      if (reduced()) {
        backdrop.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 120 })
        panel.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 120 })
      } else {
        backdrop.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: 'ease-out' })
        const from = originRect
          ? offsetFrom(originRect, panel.getBoundingClientRect())
          : 'translateY(24px) scale(0.96)'
        panel.animate(
          [
            { transform: from, opacity: 0 },
            { opacity: 1, offset: 0.3 },
            { transform: 'none', opacity: 1 },
          ],
          { duration: 360, easing: EASE },
        )
      }
    }

    return () => {
      root.style.overflow = prevOverflow
      document.body.style.paddingRight = prevPadding
      // Wait a tick so the page behind is no longer inert.
      window.setTimeout(() => opener?.focus({ preventScroll: true }), 0)
    }
    // Runs once per mount by design; originRect is captured at open time.
  }, [])

  const requestClose = useCallback(() => {
    if (closing.current) return
    closing.current = true
    const panel = panelRef.current
    const backdrop = backdropRef.current
    if (!panel || !backdrop || reduced()) {
      onCloseRef.current()
      return
    }
    panel.getAnimations().forEach((a) => a.cancel())
    const to = originRect
      ? offsetFrom(originRect, panel.getBoundingClientRect())
      : 'translateY(24px) scale(0.96)'
    backdrop.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 240, fill: 'forwards' })
    const anim = panel.animate(
      [
        { transform: 'none', opacity: 1 },
        { opacity: 1, offset: 0.6 },
        { transform: to, opacity: 0 },
      ],
      { duration: 260, easing: 'cubic-bezier(0.5, 0, 0.8, 0.4)', fill: 'forwards' },
    )
    anim.onfinish = () => onCloseRef.current()
  }, [originRect])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        requestClose()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [requestClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6" style={{ '--accent': accent ?? '#ff7f6e' } as CSSProperties}>
      <div ref={backdropRef} className="absolute inset-0 bg-ink/80" onClick={requestClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="relative max-h-[calc(100dvh-1.5rem)] w-full max-w-3xl overflow-y-auto overscroll-contain rounded-[22px_14px_24px_12px] border-[5px] border-ink bg-paper text-ink shadow-[10px_10px_0_rgb(0_0_0/0.6)] sm:max-h-[calc(100dvh-3rem)]"
      >
        <div className="h-3 w-full border-b-4 border-ink" style={{ background: 'var(--accent)' }} aria-hidden="true" />
        <button
          type="button"
          data-autofocus
          onClick={requestClose}
          aria-label="Close"
          className="absolute right-3 top-5 z-10 grid h-11 w-11 place-items-center rounded-full border-[3px] border-ink bg-yellow text-ink transition-colors hover:bg-red hover:text-paper"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 4l10 10M14 4L4 14" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  )
}
