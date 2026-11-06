import { useEffect, useLayoutEffect, type RefObject } from 'react'

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const REVEAL = [
  '.h-section',
  '.stage',
  '.library',
  '.classic',
  '.physics-brief',
  '.physics .chips',
  '.physics .hero-actions',
  '.physics-art',
  '.poster',
  '.about-bio',
  '.skills',
  '.contact-line',
  '.contact-mail',
  '.stickers > li',
].join(',')

let io: IntersectionObserver | undefined

/**
 * Scroll reveal: marks matching elements and fades them in as they enter the view.
 * Does nothing (everything stays visible) without IntersectionObserver or with reduced motion.
 */
export function useReveal(...deps: unknown[]) {
  useLayoutEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || prefersReduced()) return
    document.documentElement.classList.add('fx')
    io ??= new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.classList.add('in')
          io?.unobserve(e.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    const seen = new Map<Element, number>()
    document.querySelectorAll<HTMLElement>(REVEAL).forEach((el) => {
      if (el.hasAttribute('data-reveal')) return
      const n = seen.get(el.parentElement!) ?? 0
      seen.set(el.parentElement!, n + 1)
      el.setAttribute('data-reveal', '')
      el.style.setProperty('--d', `${Math.min(n, 5) * 90}ms`)
      io!.observe(el)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/** Gentle 3D lean of `target` toward the pointer while it is over `scope`. Fine pointers only. */
export function usePointerTilt(scope: RefObject<HTMLElement | null>, target: RefObject<HTMLElement | null>, max = 5) {
  useEffect(() => {
    const s = scope.current
    const t = target.current
    if (!s || !t || prefersReduced() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    let raf = 0
    const move = (e: PointerEvent) => {
      const r = s.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        t.style.setProperty('--ry', `${(x * max * 2).toFixed(2)}deg`)
        t.style.setProperty('--rx', `${(-y * max * 2).toFixed(2)}deg`)
      })
    }
    const leave = () => {
      cancelAnimationFrame(raf)
      t.style.setProperty('--ry', '0deg')
      t.style.setProperty('--rx', '0deg')
    }
    s.addEventListener('pointermove', move)
    s.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(raf)
      s.removeEventListener('pointermove', move)
      s.removeEventListener('pointerleave', leave)
    }
  }, [scope, target, max])
}
