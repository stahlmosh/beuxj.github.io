import { useEffect, useRef } from 'react'
import type { Project } from '../data/site'
import { accentStyle, CartridgeFace } from './Cartridge'

interface Body {
  el: HTMLElement
  project: Project
  x: number
  y: number
  w: number
  h: number
  vx: number
  vy: number
  a: number
  rest: number
  held: boolean
}

const GRAVITY = 2400
const BOUNCE = 0.3

/** Tiny physics toy: the cartridges fall into a box. Grab one to throw it; click it to open the game. Decorative. */
export function ToyBox({ projects, onOpen }: { projects: Project[]; onOpen: (p: Project) => void }) {
  const box = useRef<HTMLDivElement>(null)
  const respawn = useRef<() => void>(() => {})
  const open = useRef(onOpen)
  open.current = onOpen
  const list = projects.slice(0, 8)
  const key = list.map((p) => p.id).join('|')

  useEffect(() => {
    const root = box.current
    if (!root) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const bodies: Body[] = Array.from(root.querySelectorAll<HTMLElement>('.toy-cart')).map((el, i) => ({
      el,
      project: list[i],
      x: 0,
      y: 0,
      w: el.offsetWidth,
      h: el.offsetHeight,
      vx: 0,
      vy: 0,
      a: 0,
      rest: (Math.random() - 0.5) * 6,
      held: false,
    }))
    let W = root.clientWidth
    let H = root.clientHeight
    let raf = 0
    let last = 0
    let calm = 0
    let visible = false

    const paint = (b: Body) => {
      b.el.style.transform = `translate(${b.x.toFixed(1)}px, ${b.y.toFixed(1)}px) rotate(${b.a.toFixed(2)}deg)`
    }
    const measure = () => {
      W = root.clientWidth
      H = root.clientHeight
      for (const b of bodies) {
        b.w = b.el.offsetWidth
        b.h = b.el.offsetHeight
        b.x = Math.min(Math.max(0, b.x), Math.max(0, W - b.w))
        b.y = Math.min(b.y, H - b.h)
      }
    }
    const layoutRow = () => {
      const gap = Math.max(8, (W - bodies.reduce((s, b) => s + b.w, 0)) / (bodies.length + 1))
      let x = gap
      for (const b of bodies) {
        b.x = x
        b.y = H - b.h
        b.a = b.rest
        x += b.w + gap
        paint(b)
      }
    }
    const spawn = () => {
      measure()
      if (reduced) return layoutRow()
      bodies.forEach((b, i) => {
        b.x = Math.random() * Math.max(1, W - b.w)
        b.y = -b.h - i * (b.h * 0.9)
        b.vx = (Math.random() - 0.5) * 300
        b.vy = 0
        b.a = (Math.random() - 0.5) * 24
        paint(b)
      })
      start()
    }

    const step = (dt: number) => {
      for (const b of bodies) {
        if (b.held) continue
        b.vy += GRAVITY * dt
        b.x += b.vx * dt
        b.y += b.vy * dt
        if (b.x < 0) ((b.x = 0), (b.vx = -b.vx * BOUNCE))
        if (b.x + b.w > W) ((b.x = W - b.w), (b.vx = -b.vx * BOUNCE))
        if (b.y + b.h > H) {
          b.y = H - b.h
          b.vy = b.vy > 90 ? -b.vy * BOUNCE : 0
          b.vx *= Math.exp(-dt * 7)
        }
      }
      // Box against box (no rotation in the maths, only in how they are drawn).
      for (let it = 0; it < 4; it++) {
        for (let i = 0; i < bodies.length; i++) {
          for (let j = i + 1; j < bodies.length; j++) {
            const p = bodies[i]
            const q = bodies[j]
            const ox = Math.min(p.x + p.w, q.x + q.w) - Math.max(p.x, q.x)
            const oy = Math.min(p.y + p.h, q.y + q.h) - Math.max(p.y, q.y)
            if (ox <= 0 || oy <= 0) continue
            const horizontal = ox < oy
            const dir = horizontal ? Math.sign(p.x + p.w / 2 - (q.x + q.w / 2)) || 1 : Math.sign(p.y + p.h / 2 - (q.y + q.h / 2)) || 1
            const depth = horizontal ? ox : oy
            const wp = p.held ? 0 : q.held ? 1 : 0.5
            const wq = q.held ? 0 : p.held ? 1 : 0.5
            if (horizontal) {
              p.x += dir * depth * wp
              q.x -= dir * depth * wq
            } else {
              p.y += dir * depth * wp
              q.y -= dir * depth * wq
            }
            const key = horizontal ? 'vx' : 'vy'
            const rel = (p[key] - q[key]) * dir
            if (rel < 0) {
              const e = -rel > 120 ? BOUNCE : 0
              const jimp = (-(1 + e) * rel) / (p.held || q.held ? 1 : 2)
              if (!p.held) p[key] += dir * jimp
              if (!q.held) q[key] -= dir * jimp
              // a little sideways friction when resting on something
              if (!horizontal) {
                if (!p.held) p.vx *= 0.9
                if (!q.held) q.vx *= 0.9
              }
            }
          }
        }
      }
      for (const b of bodies) {
        if (!b.held) {
          const target = Math.max(-16, Math.min(16, b.vx * 0.02)) + b.rest
          b.a += (target - b.a) * Math.min(1, dt * 9)
        }
        paint(b)
      }
    }

    const frame = (t: number) => {
      raf = 0
      const dt = Math.min(1 / 30, (t - last) / 1000 || 1 / 60)
      last = t
      step(dt)
      const moving = bodies.some((b) => b.held || Math.abs(b.vx) > 8 || Math.abs(b.vy) > 8)
      calm = moving ? 0 : calm + dt
      if (visible && calm < 0.6) raf = requestAnimationFrame(frame)
    }
    function start() {
      calm = 0
      if (!raf && visible && !reduced) {
        last = performance.now()
        raf = requestAnimationFrame(frame)
      }
    }
    respawn.current = spawn

    // Pointer: drag to throw, plain click opens the game.
    const cleanups: (() => void)[] = []
    bodies.forEach((b) => {
      let g: { id: number; ox: number; oy: number; sx: number; sy: number; moved: boolean; t: number; px: number; py: number } | null = null
      const down = (e: PointerEvent) => {
        if (e.button !== 0) return
        const r = root.getBoundingClientRect()
        g = { id: e.pointerId, ox: e.clientX - r.left - b.x, oy: e.clientY - r.top - b.y, sx: e.clientX, sy: e.clientY, moved: false, t: performance.now(), px: b.x, py: b.y }
        b.el.setPointerCapture(e.pointerId)
      }
      const move = (e: PointerEvent) => {
        if (!g || g.id !== e.pointerId) return
        if (!g.moved && Math.hypot(e.clientX - g.sx, e.clientY - g.sy) < 6) return
        if (reduced) return
        if (!g.moved) {
          g.moved = true
          b.held = true
          b.el.style.zIndex = '5'
          b.el.dataset.held = ''
        }
        const r = root.getBoundingClientRect()
        const nx = Math.min(Math.max(0, e.clientX - r.left - g.ox), W - b.w)
        const ny = Math.min(Math.max(-b.h, e.clientY - r.top - g.oy), H - b.h)
        const now = performance.now()
        const dt = Math.max(0.008, (now - g.t) / 1000)
        b.vx = b.vx * 0.5 + ((nx - g.px) / dt) * 0.5
        b.vy = b.vy * 0.5 + ((ny - g.py) / dt) * 0.5
        g.px = nx
        g.py = ny
        g.t = now
        b.x = nx
        b.y = ny
        b.a = Math.max(-14, Math.min(14, b.vx * 0.015))
        paint(b)
        start()
      }
      const up = (e: PointerEvent) => {
        if (!g || g.id !== e.pointerId) return
        const wasDrag = g.moved
        const idle = performance.now() - g.t > 90
        g = null
        b.held = false
        delete b.el.dataset.held
        b.el.style.zIndex = ''
        if (wasDrag) {
          // releasing after a pause means "set it down", not "throw it"
          b.vx = idle ? 0 : Math.max(-2200, Math.min(2200, b.vx))
          b.vy = idle ? 0 : Math.max(-2200, Math.min(2200, b.vy))
          start()
        } else {
          open.current(b.project)
        }
      }
      b.el.addEventListener('pointerdown', down)
      b.el.addEventListener('pointermove', move)
      b.el.addEventListener('pointerup', up)
      b.el.addEventListener('pointercancel', up)
      cleanups.push(() => {
        b.el.removeEventListener('pointerdown', down)
        b.el.removeEventListener('pointermove', move)
        b.el.removeEventListener('pointerup', up)
        b.el.removeEventListener('pointercancel', up)
      })
    })

    let spawned = false
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible && !spawned) {
          spawned = true
          spawn()
        } else if (visible) start()
      },
      { threshold: 0.35 },
    )
    io.observe(root)
    const ro = new ResizeObserver(() => {
      measure()
      if (reduced) layoutRow()
      else start()
    })
    ro.observe(root)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      cleanups.forEach((f) => f())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  if (list.length === 0) return null
  return (
    <section className="toy" aria-hidden="true">
      <div className="toy-head">
        <h2 className="toy-title">Toy box</h2>
        <p className="toy-hint">Just for fun. Grab a cartridge and throw it. Click one to open the game.</p>
        <button type="button" tabIndex={-1} className="toy-reset" onClick={() => respawn.current()}>
          Drop again
        </button>
      </div>
      <div className="toy-box" ref={box}>
        {list.map((p) => (
          <button type="button" tabIndex={-1} key={p.id} className="toy-cart" aria-label={`Open ${p.title}`}>
            <span className="cart" style={accentStyle(p)}>
              <CartridgeFace project={p} />
            </span>
          </button>
        ))}
        <div className="toy-floor" />
      </div>
    </section>
  )
}
