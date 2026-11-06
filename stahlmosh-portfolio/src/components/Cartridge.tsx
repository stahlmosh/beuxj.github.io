import type { CSSProperties } from 'react'
import type { Project } from '../data/site'
import { CartridgeArt } from './CartridgeArt'

export const DEFAULT_ACCENT = '#ff7f6e'

export const accentStyle = (p: Project) => ({ '--accent': p.accentColor ?? DEFAULT_ACCENT }) as CSSProperties

/** The physical cartridge: cel-shaded shell, grip, label art, stripe, engine badge, pins, side face. */
export function CartridgeFace({ project }: { project: Project }) {
  const accent = project.accentColor ?? DEFAULT_ACCENT
  const stripe = [project.type, project.genre].filter(Boolean).join(' · ')
  return (
    <span className="cart-3d">
      <span className="cart-front">
        <span className="cart-grip" />
        <span className="cart-label">
          <span className="cart-stripe">{stripe}</span>
          <span className="cart-art">
            {project.coverImage ? (
              <img src={project.coverImage} alt="" loading="lazy" decoding="async" />
            ) : (
              <CartridgeArt kind={project.art ?? 'cube'} color={accent} />
            )}
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

/** Slight hand-placed lean per slot, so the rack doesn't look machine-aligned. */
const TILTS = [-1.8, 1.2, -0.7, 2]

interface Props {
  project: Project
  index: number
  /** True while this cartridge is in the reader; its rack slot stays empty. */
  loaded: boolean
  onInsert: (project: Project) => void
}

/** A library cartridge: press to slot it into the reader. */
export function Cartridge({ project, index, loaded, onInsert }: Props) {
  const label = [project.title, project.type, project.engine].filter(Boolean).join(', ')
  return (
    <li className="cart-slot">
      <button
        type="button"
        className="cart"
        style={{ ...accentStyle(project), '--tilt': `${TILTS[index % TILTS.length]}deg` } as CSSProperties}
        aria-label={loaded ? `${label}. Currently in the reader` : `${label}. Insert into reader`}
        aria-disabled={loaded || undefined}
        data-lifted={loaded || undefined}
        onClick={() => !loaded && onInsert(project)}
      >
        <span className="cart-shadow" aria-hidden="true" />
        <CartridgeFace project={project} />
      </button>
    </li>
  )
}
