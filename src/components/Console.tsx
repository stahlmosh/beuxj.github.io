import { useState } from 'react'
import type { Project } from '../data/site'
import { accentStyle, CartridgeFace } from './Cartridge'
import { Burst } from './Decor'

interface Props {
  loaded: Project
  /** Cartridge that was just removed; plays the eject animation. */
  ejecting: Project | null
  /** Animate the loaded cartridge dropping in (false for the first paint). */
  animateIn: boolean
  onPlay: () => void
}

const INK = '#1b1310'
const PAPER = '#f3e5c6'
const PAPER_2 = '#e6d1a3'

/** Top-loading cartridge reader, drawn in layers: top face and slot, cartridge, front lip, control panel. */
export function Console({ loaded, ejecting, animateIn, onPlay }: Props) {
  const locked = loaded.variant === 'mystery'
  const modern = loaded.kind === 'asset'
  const meta = locked ? loaded.summary : [loaded.type, loaded.engine].filter(Boolean).join(' · ')
  const [shake, setShake] = useState(0)
  const press = () => {
    if (!locked) return onPlay()
    setShake((n) => n + 1)
  }

  return (
    <div className="stage">
      <div className="reader" data-kind={modern ? 'asset' : undefined}>
        <p className="drop-hint" aria-hidden="true">
          Drop to insert
        </p>
        <div className="reader-top" aria-hidden="true">
          {modern ? (
            <svg className="layer layer-back" viewBox="0 0 640 340">
              <polygon points="60,250 548,250 590,272 637.5,296 2.5,296" fill="#1c2a3d" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
              <g stroke="#3fc4a6" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
                <path d="M30 288 H70 L84 270 H118" />
                <path d="M520 270 H560 L576 286 H612" />
              </g>
              <rect x="560" y="262" width="30" height="16" rx="2" fill="#0d1520" stroke="#e8b84a" strokeWidth="2.5" />
              <polygon points="60,250 548,250 590,272 637.5,296 2.5,296" fill="#68baee" fillOpacity="0.62" />
              <polygon points="126,260 514,260 548,290 92,290" fill={INK} />
              <path d="M150 252 H470" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.55" />
              <polygon points="60,250 548,250 590,272 637.5,296 2.5,296" fill="none" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg className="layer layer-back" viewBox="0 0 640 340">
              <polygon points="60,250 580,250 637.5,296 2.5,296" fill={PAPER} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
              <polygon points="126,260 514,260 548,290 92,290" fill={INK} />
              <path d="M70 258 H570" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.55" />
              <path d="M26 284 H74 M34 273 H66 M566 284 H614 M574 273 H606" stroke={INK} strokeWidth="4" strokeLinecap="round" opacity="0.5" />
            </svg>
          )}

          {ejecting && (
            <div className="reader-cart is-out" key={`out-${ejecting.id}`}>
              <div className="cart" style={accentStyle(ejecting)}>
                <CartridgeFace project={ejecting} />
              </div>
            </div>
          )}
          <div className={`reader-cart${animateIn ? ' is-in' : ''}`} key={loaded.id}>
            <div className="cart" style={accentStyle(loaded)}>
              <CartridgeFace project={loaded} />
            </div>
          </div>

          {modern ? (
            <svg className="layer layer-front" viewBox="0 0 640 340">
              <rect x="2.5" y="296" width="635" height="46" fill="#1c2a3d" />
              <path d="M14 330 H60 L72 318 H150 M300 330 H400 L412 318 H470" stroke="#3fc4a6" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="470" y="310" width="44" height="22" rx="2" fill="#0d1520" stroke="#e8b84a" strokeWidth="2.5" />
              <rect x="2.5" y="296" width="635" height="46" fill="#68baee" fillOpacity="0.62" />
              <path d="M6 303 H634" stroke="#fff" strokeWidth="3" opacity="0.45" strokeLinecap="round" />
              <rect x="2.5" y="296" width="635" height="46" fill="none" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
              <rect className="led-slot" x="44" y="312" width="150" height="13" rx="6.5" fill="#d1457f" stroke={INK} strokeWidth="3" />
              <circle className="led" cx="598" cy="318" r="7.5" fill="#ffc93a" stroke={INK} strokeWidth="3" />
            </svg>
          ) : (
            <svg className="layer layer-front" viewBox="0 0 640 340">
              <rect x="2.5" y="296" width="635" height="46" fill={PAPER_2} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
              <rect className="led-slot" x="44" y="312" width="150" height="13" rx="6.5" fill="#c4261d" stroke={INK} strokeWidth="3" />
              <circle className="led" cx="598" cy="318" r="7.5" fill="#8fd6b4" stroke={INK} strokeWidth="3" />
            </svg>
          )}
          {animateIn && <Burst key={`burst-${loaded.id}`} />}
        </div>

        <div className="reader-panel">
          {modern && <span className="gb-dpad" aria-hidden="true" />}
          <div className="screen" aria-live="polite" aria-atomic="true">
            <div className="screen-title">{loaded.title}</div>
            <div className="screen-meta">{meta}</div>
          </div>
          <button
            id="play-button"
            key={shake}
            type="button"
            className={`play-btn${locked ? ' is-locked' : ''}${shake ? ' is-shaking' : ''}`}
            aria-haspopup={locked ? undefined : 'dialog'}
            aria-label={locked ? `Locked. ${loaded.summary}` : `${loaded.kind === 'asset' ? 'View' : 'Play'} ${loaded.title}`}
            onClick={press}
          >
            {locked ? (
              <svg width="20" height="22" viewBox="0 0 20 22" aria-hidden="true" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round">
                <rect x="3.5" y="10" width="13" height="9" rx="2" fill="currentColor" />
                <path d="M6.5 10 V7 a3.5 3.5 0 0 1 7 0 V10" />
              </svg>
            ) : (
              <svg width="20" height="22" viewBox="0 0 20 22" aria-hidden="true">
                <path d="M3 2 L18 11 L3 20Z" fill="currentColor" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
              </svg>
            )}
            {locked ? 'Locked' : loaded.kind === 'asset' ? 'View' : 'Play'}
          </button>
        </div>
      </div>
    </div>
  )
}
