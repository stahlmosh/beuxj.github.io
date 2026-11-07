import { useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import type { Project } from '../data/site'
import { CartridgeArt } from './CartridgeArt'

export const DEFAULT_ACCENT = '#ff7f6e'

export const accentStyle = (p: Project) => ({ '--accent': p.accentColor ?? DEFAULT_ACCENT }) as CSSProperties

/** The physical cartridge: cel-shaded shell, grip, label art, stripe, engine badge, pins, side face. */
export function CartridgeFace({ project, previewing = false }: { project: Project; previewing?: boolean }) {
  const accent = project.accentColor ?? DEFAULT_ACCENT
  const stripe = [project.type, project.genre].filter(Boolean).join(' · ')
  return (
    <span className="cart-3d">
      <span className="cart-front" data-variant={project.variant ?? (project.kind === 'asset' ? 'asset' : undefined)}>
        <span className="cart-grip" />
        <span className="cart-label">
          <span className="cart-stripe">{stripe}</span>
          <span className="cart-art">
            {project.coverImage ? (
              <img src={project.coverImage} alt="" loading="lazy" decoding="async" />
            ) : (
              <CartridgeArt kind={project.art ?? 'cube'} color={accent} />
            )}
            {previewing && project.mediaSrc && project.mediaType === 'video' && (
              <video className="cart-preview" src={project.mediaSrc} autoPlay muted loop playsInline aria-hidden="true" />
            )}
            {previewing && project.mediaSrc && project.mediaType === 'gif' && <img className="cart-preview" src={project.mediaSrc} alt="" />}
            {project.engine && <span className="cart-engine">{project.engine}</span>}
          </span>
          <span className="cart-title">{project.title}</span>
        </span>
        <span className="cart-pins" />
      </span>
      <span className="cart-side" />
    </span>
  )
}

/** Hover previews only on devices with a real pointer, not for reduced motion or data saver. */
function canPreview(p: Project) {
  if (!p.mediaSrc || (p.mediaType !== 'video' && p.mediaType !== 'gif')) return false
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  return !(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
}

/** Slight hand-placed lean per slot, so the rack doesn't look machine-aligned. */
const TILTS = [-1.8, 1.2, -0.7, 2]

interface Props {
  project: Project
  index: number
  /** True while this cartridge is in the reader; its rack slot stays empty. */
  loaded: boolean
  onInsert: (project: Project) => void
}

const readerEl = () => document.querySelector<HTMLElement>('.reader')
const overReader = (x: number, y: number) => {
  const r = readerEl()?.getBoundingClientRect()
  return !!r && x > r.left - 20 && x < r.right + 20 && y > r.top - 40 && y < r.bottom + 20
}
const setDrop = (state: 'ready' | 'hot' | null) => {
  const el = readerEl()
  if (!el) return
  if (state) el.setAttribute('data-drop', state)
  else el.removeAttribute('data-drop')
}

/** A library cartridge: press to slot it into the reader, or drag it there with a mouse. */
export function Cartridge({ project, index, loaded, onInsert }: Props) {
  const [previewing, setPreviewing] = useState(false)
  const [dragging, setDragging] = useState(false)
  const btn = useRef<HTMLButtonElement>(null)
  const drag = useRef<{ id: number; x: number; y: number; active: boolean } | null>(null)
  const justDragged = useRef(false)

  // Drag and drop (mouse and pen only; touch keeps tap and swipe). Click and keyboard still work.
  const onDown = (e: PointerEvent<HTMLButtonElement>) => {
    if (loaded || e.pointerType === 'touch' || e.button !== 0) return
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, active: false }
  }
  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    const el = btn.current
    const d = drag.current
    if (el && !d && e.pointerType === 'mouse' && !loaded) {
      // Hover tilt: the cartridge leans toward the cursor.
      const r = el.getBoundingClientRect()
      el.style.setProperty('--ry', `${(((e.clientX - r.left) / r.width - 0.5) * 14).toFixed(1)}deg`)
      el.style.setProperty('--rx', `${(-((e.clientY - r.top) / r.height - 0.5) * 12).toFixed(1)}deg`)
    }
    if (!el || !d || d.id !== e.pointerId) return
    const dx = e.clientX - d.x
    const dy = e.clientY - d.y
    if (!d.active) {
      if (Math.hypot(dx, dy) < 8) return
      d.active = true
      el.setPointerCapture(e.pointerId)
      el.style.transition = 'none'
      document.body.style.userSelect = 'none'
      setPreviewing(false)
      setDragging(true)
      setDrop('ready')
    }
    el.style.translate = `${dx}px ${dy}px`
    el.style.rotate = `${Math.max(-10, Math.min(10, dx / 30))}deg`
    setDrop(overReader(e.clientX, e.clientY) ? 'hot' : 'ready')
  }
  const onUp = (e: PointerEvent<HTMLButtonElement>, cancelled = false) => {
    const el = btn.current
    const d = drag.current
    drag.current = null
    if (!el || !d?.active) return
    document.body.style.userSelect = ''
    setDragging(false)
    setDrop(null)
    justDragged.current = true
    window.setTimeout(() => (justDragged.current = false), 60)
    const drop = !cancelled && overReader(e.clientX, e.clientY)
    if (drop) {
      el.style.translate = ''
      el.style.rotate = ''
      el.style.transition = ''
      onInsert(project)
    } else {
      // Spring back to its slot.
      el.style.transition = 'translate 0.3s cubic-bezier(0.2, 1.5, 0.4, 1), rotate 0.3s ease-out'
      el.style.translate = '0 0'
      el.style.rotate = '0deg'
      window.setTimeout(() => {
        el.style.transition = ''
        el.style.translate = ''
        el.style.rotate = ''
      }, 320)
    }
  }
  const start = () => !loaded && canPreview(project) && setPreviewing(true)
  const stop = () => setPreviewing(false)
  return (
    <li className="cart-slot">
      <button
        type="button"
        ref={btn}
        className="cart"
        data-dragging={dragging || undefined}
        draggable={false}
        style={{ ...accentStyle(project), '--tilt': `${TILTS[index % TILTS.length]}deg` } as CSSProperties}
        aria-describedby={`cart-hint-${project.id}`}
        aria-disabled={loaded || undefined}
        data-lifted={loaded || undefined}
        onClick={() => !loaded && !justDragged.current && onInsert(project)}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={(e) => onUp(e)}
        onPointerCancel={(e) => onUp(e, true)}
        onPointerEnter={start}
        onPointerLeave={(e) => {
          stop()
          if (!drag.current?.active) {
            e.currentTarget.style.removeProperty('--rx')
            e.currentTarget.style.removeProperty('--ry')
          }
        }}
        onFocus={start}
        onBlur={stop}
      >
        <span className="cart-shadow" aria-hidden="true" />
        <CartridgeFace project={project} previewing={previewing} />
      </button>
      <span id={`cart-hint-${project.id}`} className="sr-only">
        {loaded ? 'Currently in the reader' : 'Insert into reader'}
      </span>
    </li>
  )
}
