import { useRef, type CSSProperties } from 'react'
import { usePointerTilt } from '../effects'
import type { Project } from '../data/site'
import { accentStyle, CartridgeFace, DEFAULT_ACCENT } from './Cartridge'
import { ProjectMedia } from './ProjectPage'
import { Torn } from './Torn'

interface Props {
  engine?: Project
  onOpen: (project: Project) => void
}

/** The physics engine: a short brief plus its own (dark, dev-style) cartridge that opens the full brief page. */
export function PhysicsSection({ engine, onOpen }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const artRef = useRef<HTMLDivElement>(null)
  usePointerTilt(sectionRef, artRef, 4)
  if (!engine) return null
  const accent = engine.accentColor ?? DEFAULT_ACCENT
  return (
    <section id="physics" ref={sectionRef} aria-labelledby="physics-title" className="physics">
      <Torn seed={29} className="torn-top text-mint" />
      <div className="wrap physics-grid">
        <div>
          <h2 id="physics-title" className="h-section">
            Physics Engine
          </h2>
          <p className="physics-brief">{engine.summary}</p>
          {engine.highlights && engine.highlights.length > 0 && (
            <ul role="list" className="chips">
              {engine.highlights.map((h) => (
                <li key={h} className="chip">
                  {h}
                </li>
              ))}
            </ul>
          )}
          <div className="hero-actions" style={{ marginTop: '1.75rem' }}>
            <button type="button" className="btn-pop" onClick={() => onOpen(engine)}>
              Open the brief <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <div className="physics-art" ref={artRef}>
          <div className="proj-frame">
            <div className="proj-frame-inner">
              <ProjectMedia project={engine} accent={accent} />
            </div>
            <button
              type="button"
              className="cart proj-cart engine-cart"
              style={accentStyle(engine) as CSSProperties}
              aria-describedby="engine-hint"
              onClick={() => onOpen(engine)}
            >
              <span className="cart-shadow" aria-hidden="true" />
              <CartridgeFace project={engine} />
            </button>
            <span id="engine-hint" className="sr-only">
              Open the full brief
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
