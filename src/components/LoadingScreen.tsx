import { useEffect, useRef, useState } from 'react'
import type { Project } from '../data/site'
import { useMediaQuery } from '../hooks'
import { accentStyle, CartridgeFace } from './Cartridge'

interface Props {
  project: Project
  /** Called once the bar is full, to switch to the project page underneath the wipe. */
  onNavigate: () => void
  /** Called when the overlay is finished (or cancelled with Escape). */
  onClose: () => void
}

const LOAD_MS = 1850
const QUICK_MS = 800
const SEEN_KEY = 'stahlmosh:seen-loader'

/** First load in a session plays the full animation; later ones are shorter. */
function firstTime(): boolean {
  try {
    const seen = sessionStorage.getItem(SEEN_KEY) === '1'
    sessionStorage.setItem(SEEN_KEY, '1')
    return !seen
  } catch {
    return true
  }
}
const WIPE_MS = 420
const SEGMENTS = 10

/** Full-screen "cartridge loading" transition between the reader and a project page. */
export function LoadingScreen({ project, onNavigate, onClose }: Props) {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [exiting, setExiting] = useState(false)
  const [quick] = useState(() => !firstTime())
  const skipRef = useRef<() => void>(() => {})
  const rootRef = useRef<HTMLDivElement>(null)
  const nav = useRef(onNavigate)
  const done = useRef(onClose)
  nav.current = onNavigate
  done.current = onClose

  useEffect(() => {
    rootRef.current?.focus({ preventScroll: true })
    const load = reduced ? 250 : quick ? QUICK_MS : LOAD_MS
    const wipe = reduced ? 0 : WIPE_MS
    const t1 = window.setTimeout(() => {
      nav.current()
      if (wipe) setExiting(true)
    }, load)
    const t2 = window.setTimeout(() => done.current(), load + wipe + 20)
    let finished = false
    // Skip: go straight to the project, no wipe.
    skipRef.current = () => {
      if (finished) return
      finished = true
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      nav.current()
      done.current()
    }
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target === rootRef.current) {
        e.preventDefault()
        skipRef.current()
      } else if (e.key === 'Escape') {
        window.clearTimeout(t1)
        window.clearTimeout(t2)
        done.current()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      document.removeEventListener('keydown', onKey)
    }
  }, [reduced, quick])

  return (
    <div ref={rootRef} tabIndex={-1} role="status" data-kind={project.kind === 'asset' ? 'asset' : undefined} className={`loading dark-zone${exiting ? ' is-exiting' : ''}${quick ? ' is-quick' : ''}`}
      onClick={(e) => e.target === e.currentTarget && skipRef.current()}
    >
      <span className="sr-only">Loading {project.title}</span>
      <div className="loading-inner" aria-hidden="true">
        <div className="loading-slot">
          <div className="loading-cart">
            <div className="cart" style={accentStyle(project)}>
              <CartridgeFace project={project} />
            </div>
          </div>
          <div className="loading-lip" />
        </div>
        <p className="loading-title">{project.title}</p>
        <div className="loading-bar">
          {Array.from({ length: SEGMENTS }, (_, i) => (
            <span key={i} style={{ ['--i' as string]: i }} />
          ))}
        </div>
      </div>
      <button type="button" className="loading-skip" onClick={() => skipRef.current()}>
        Skip <span aria-hidden="true">»</span>
      </button>
    </div>
  )
}
