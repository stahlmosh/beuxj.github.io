import type { ArtKind } from '../data/site'

interface Props {
  kind: ArtKind
  /** Cartridge colour; the artwork palette is derived from it. */
  color: string
  className?: string
}

const INK = '#1b1310'
const PAPER = '#f3e5c6'
const YELLOW = '#ffc93a'

const mix = (c: string, pct: number, base = PAPER) => `color-mix(in srgb, ${c} ${pct}%, ${base})`
/** Thick comic outline shared by every shape. */
const line = { stroke: INK, strokeWidth: 2.6, strokeLinejoin: 'round', strokeLinecap: 'round' } as const

function Pine({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g {...line} transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-1.6 0 h3.2 v6 h-3.2z" fill="#6b3f26" />
      <path d="M0 -26 L9 -10 H-9z" fill="#3f9d78" />
      <path d="M0 -17 L12 2 H-12z" fill="#2f7f61" />
    </g>
  )
}

/** Original comic-style label art, used when a project has no coverImage. */
export function CartridgeArt({ kind, color, className }: Props) {
  return (
    <svg viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true" focusable="false">
      {kind === 'terrain' && (
        <>
          <rect width="160" height="100" fill={mix(color, 55)} />
          <g {...line}>
            <circle cx="122" cy="27" r="13" fill={YELLOW} />
            <path d="M-4 74 L26 38 L48 60 L80 24 L116 62 L164 40 V104 H-4Z" fill={mix(color, 85)} />
          </g>
          <path d="M26 38 L48 60 L34 62 L28 50Z M80 24 L116 62 L96 64 L88 44Z" fill={mix(color, 45, INK)} opacity="0.55" />
          <g stroke={INK} strokeWidth="1.6" strokeLinecap="round" opacity="0.7">
            <path d="M92 40 l5 8 M98 36 l6 9 M104 44 l4 6 M30 46 l3 5" />
          </g>
          <path {...line} d="M-4 88 Q32 68 76 84 T164 76 V104 H-4Z" fill={mix(color, 70, INK)} />
          <Pine x={22} y={86} s={0.9} />
          <Pine x={40} y={90} s={0.7} />
          <Pine x={132} y={88} s={1} />
        </>
      )}

      {kind === 'eye' && (
        <>
          <rect width="160" height="100" fill={mix(color, 38, INK)} />
          <g stroke={mix(color, 70, INK)} strokeWidth="7" strokeLinecap="round" opacity="0.5">
            {Array.from({ length: 14 }, (_, i) => {
              const a = (i / 14) * Math.PI * 2
              return <line key={i} x1={80 + Math.cos(a) * 40} y1={50 + Math.sin(a) * 40} x2={80 + Math.cos(a) * 130} y2={50 + Math.sin(a) * 130} />
            })}
          </g>
          <path {...line} d="M10 52 Q80 -2 150 52 Q80 102 10 52Z" fill={PAPER} />
          <path d="M22 50 Q80 8 138 50 Q80 30 22 50Z" fill={INK} opacity="0.22" />
          <circle {...line} cx="80" cy="52" r="21" fill={color} />
          <ellipse cx="80" cy="52" rx="5.5" ry="16" fill={INK} />
          <circle cx="88" cy="44" r="4.2" fill={PAPER} />
          <g {...line} strokeWidth="2.4">
            <path d="M34 34 l-6 -9 M56 22 l-3 -11 M104 22 l3 -11 M126 34 l6 -9" />
          </g>
          <g {...line} strokeWidth="2.2" fill={color}>
            <path d="M46 78 v9 a3.2 3.2 0 0 0 6.4 0 v-9" />
            <path d="M112 76 v13 a3.2 3.2 0 0 0 6.4 0 v-13" />
          </g>
        </>
      )}

      {kind === 'orbit' && (
        <>
          <rect width="160" height="100" fill={mix(color, 70)} />
          <g stroke={INK} strokeWidth="2.2" strokeLinecap="round">
            <path d="M18 18 v8 M14 22 h8 M142 76 v8 M138 80 h8 M34 76 v6 M31 79 h6" />
          </g>
          <g transform="rotate(-18 80 52)">
            <ellipse {...line} cx="80" cy="52" rx="46" ry="12" fill="none" />
          </g>
          <circle {...line} cx="80" cy="52" r="21" fill="#ff7f6e" />
          <path d="M62 44 q18 -8 36 2 M60 58 q20 8 40 -2" fill="none" stroke={INK} strokeWidth="2" opacity="0.45" strokeLinecap="round" />
          <path d="M64 40 q6 -9 16 -10" fill="none" stroke={PAPER} strokeWidth="3" strokeLinecap="round" />
          <g transform="rotate(-18 80 52)">
            <path {...line} d="M34 52 A46 12 0 0 0 126 52" fill="none" />
          </g>
          <circle {...line} cx="128" cy="24" r="8" fill={PAPER} />
          <path d="M10 92 q12 -30 24 0 q9 -18 18 0" fill="none" stroke={INK} strokeWidth="2.2" strokeDasharray="3 4" strokeLinecap="round" />
          <circle {...line} cx="56" cy="90" r="4.6" fill={YELLOW} />
        </>
      )}

      {kind === 'cube' && (
        <>
          <rect width="160" height="100" fill={mix(color, 55)} />
          <g stroke={INK} strokeWidth="2" strokeLinecap="round" opacity="0.55">
            <path d="M12 14 h8 M16 10 v8 M140 14 h8 M144 10 v8 M12 88 h8 M16 84 v8" />
          </g>
          <g {...line}>
            <polygon points="58,18 90,35 58,52 26,35" fill={PAPER} />
            <polygon points="26,35 58,52 58,88 26,70" fill={color} />
            <polygon points="58,52 90,35 90,70 58,88" fill={mix(color, 55, INK)} />
          </g>
          <path d="M58 52 v36" stroke={INK} strokeWidth="2.6" />
          <g transform="translate(124 58)">
            {Array.from({ length: 8 }, (_, i) => (
              <rect {...line} strokeWidth={2.2} key={i} x="-4" y="-21" width="8" height="9" fill={YELLOW} transform={`rotate(${i * 45})`} />
            ))}
            <circle {...line} r="15" fill={YELLOW} />
            <circle {...line} r="5.5" fill={mix(color, 55)} />
          </g>
          <path d="M94 48 q8 -6 14 -2" fill="none" stroke={INK} strokeWidth="2.4" strokeDasharray="3 4" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}
