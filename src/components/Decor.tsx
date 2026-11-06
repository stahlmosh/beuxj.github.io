import type { CSSProperties } from 'react'

/** Sun rays that slowly turn behind a section. The origin is where the rays fan out from. */
export function Rays({ x, y }: { x: string; y: string }) {
  return (
    <div className="rays" aria-hidden="true" style={{ '--ox': x, '--oy': y } as CSSProperties}>
      <i />
    </div>
  )
}

const SPOTS = [
  { x: '6%', y: '16%', s: 26, d: 0 },
  { x: '47%', y: '9%', s: 18, d: 0.8 },
  { x: '93%', y: '10%', s: 30, d: 1.4 },
  { x: '53%', y: '74%', s: 20, d: 0.4 },
  { x: '2%', y: '66%', s: 16, d: 1.1 },
]

/** A few twinkling comic stars. */
export function Sparkles() {
  return (
    <div className="sparkles" aria-hidden="true">
      {SPOTS.map((p, i) => (
        <svg key={i} viewBox="0 0 20 20" style={{ left: p.x, top: p.y, width: p.s, height: p.s, animationDelay: `${p.d}s` }}>
          <path d="M10 1 C11 7 13 9 19 10 C13 11 11 13 10 19 C9 13 7 11 1 10 C7 9 9 7 10 1Z" fill="#f3e5c6" stroke="#1b1310" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      ))}
    </div>
  )
}

/** Comic impact burst that pops when a cartridge lands in the reader. */
export function Burst() {
  const pts = Array.from({ length: 24 }, (_, i) => {
    const r = i % 2 ? 26 : 48
    const a = (i / 24) * Math.PI * 2
    return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`
  }).join(' ')
  return (
    <svg className="burst" viewBox="-50 -50 100 100" aria-hidden="true">
      <polygon points={pts} fill="#ffc93a" stroke="#1b1310" strokeWidth="4" strokeLinejoin="round" />
      <polygon points={pts} fill="#c4261d" transform="scale(.55)" />
    </svg>
  )
}
