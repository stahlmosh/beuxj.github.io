import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { engine } from '../data/projects'
import { showAbout, site } from '../data/site'
import { goSection, sectionHref } from '../router'
import type { Section } from '../router'

const NAV: { id: Exclude<Section, 'top'>; label: string }[] = [
  { id: 'games' as const, label: 'Games' },
  ...(showAbout ? [{ id: 'about' as const, label: 'About' }] : []),
  ...(engine ? [{ id: 'physics' as const, label: 'Physics' }] : []),
  { id: 'contact' as const, label: 'Contact' },
]

/** Highlights the nav item for the section in view (home page only). */
function useScrollSpy(enabled: boolean): string | null {
  const [active, setActive] = useState<string | null>(null)
  useEffect(() => {
    if (!enabled) {
      setActive(null)
      return
    }
    const els = ['hero', ...NAV.map((n) => n.id)].map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e)
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id === 'hero' ? null : e.target.id)
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [enabled])
  return active
}

export function Header({ home }: { home: boolean }) {
  const [open, setOpen] = useState(false)
  const menuBtn = useRef<HTMLButtonElement>(null)
  const active = useScrollSpy(home)
  const headRef = useRef<HTMLElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      barRef.current?.style.setProperty('transform', `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`)
      headRef.current?.toggleAttribute('data-scrolled', window.scrollY > 24)
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        menuBtn.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const onNav = (e: MouseEvent, id: Section) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    setOpen(false)
    goSection(id)
  }

  return (
    <header ref={headRef} className="site-header">
      <div className="nav-bar">
        <a href={sectionHref('top')} className="brand" onClick={(e) => onNav(e, 'top')}>
          <img src="/favicon.png" width="44" height="44" alt="" className="brand-mark" />
          <span>
            <span className="brand-name">{site.name}</span>
            <span className="brand-sub">{site.descriptor}</span>
          </span>
        </a>

        <button ref={menuBtn} type="button" className="menu-btn" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen((o) => !o)}>
          {open ? 'Close' : 'Menu'}
        </button>

        <nav id="site-nav" className="site-nav" aria-label="Main" data-open={open}>
          <ul role="list" className="nav-pills">
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={sectionHref(n.id)}
                  className={`pill${n.id === 'contact' ? ' pill-cta' : ''}`}
                  aria-current={active === n.id ? 'true' : undefined}
                  onClick={(e) => onNav(e, n.id)}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div ref={barRef} className="scroll-bar" aria-hidden="true" />
    </header>
  )
}
