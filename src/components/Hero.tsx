import { useRef, type CSSProperties } from 'react'
import type { Project } from '../data/site'
import { usePointerTilt } from '../effects'
import { Rays, Sparkles } from './Decor'
import { site } from '../data/site'
import { accentStyle, CartridgeFace, DEFAULT_ACCENT } from './Cartridge'
import { ProjectMedia } from './ProjectPage'

interface Props {
  /** The featured project (marked "featured": true in its project.json). */
  project?: Project
  onPlay: (project: Project) => void
}

/** The hero shows the current / featured project instead of a name card. */
export function Hero({ project, onPlay }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const artRef = useRef<HTMLDivElement>(null)
  usePointerTilt(sectionRef, artRef, 5)
  if (!project) {
    return (
      <section id="hero" aria-labelledby="hero-title" className="hero">
        <Rays x="70%" y="50%" />
        <div className="hero-grid">
          <div className="hero-copy">
            <h1 id="hero-title" className="hero-title">
              {site.name}
            </h1>
            <p className="hero-summary">{site.descriptor}</p>
          </div>
          <div className="hero-art">
            <img className="hero-logo" src="/stahlmosh.webp" width="360" height="360" alt="" />
          </div>
        </div>
      </section>
    )
  }
  const accent = project.accentColor ?? DEFAULT_ACCENT
  return (
    <section id="hero" ref={sectionRef} aria-labelledby="hero-title" className="hero">
      <Rays x="70%" y="50%" />
      <Sparkles />
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="tag" style={accentStyle(project)}>
            Now playing
          </p>
          <h1 id="hero-title" className="hero-title">
            <span className="sr-only">{site.name}, current project: </span>
            {project.title.split(' ').map((w, i) => (
              <span key={i}>
                {i > 0 && ' '}
                <span className="w" style={{ '--i': i } as CSSProperties}>
                  {w}
                </span>
              </span>
            ))}
          </h1>
          <p className="hero-summary">{project.summary}</p>
          {!site.showOpenTo ? null : site.openTo ? (
            <p className="open-to">
              <span className="open-dot" aria-hidden="true" />
              <span>
                <strong>Open to work:</strong> {site.openTo}
              </span>
              <a href="#/contact">Get in touch</a>
            </p>
          ) : (
            import.meta.env.DEV && <p className="open-to is-missing">Dev note: set `openTo` in src/data/site.ts to show an “Open to work” line.</p>
          )}
          <div className="hero-actions">
            <button type="button" className="btn-pop" onClick={() => onPlay(project)}>
              <svg width="18" height="20" viewBox="0 0 20 22" aria-hidden="true">
                <path d="M3 2 L18 11 L3 20Z" fill="currentColor" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
              </svg>
              Play
            </button>
            {project.downloadUrl && (
              <a className="btn-pop alt" href={project.downloadUrl} target="_blank" rel="noopener noreferrer">
                Download <span aria-hidden="true">↓</span>
              </a>
            )}
          </div>
        </div>

        <div className="hero-art" ref={artRef}>
          <div className="proj-frame">
            <div className="proj-frame-inner">
              <ProjectMedia project={project} accent={accent} />
            </div>
            <div className="proj-cart" aria-hidden="true">
              <div className="cart" style={accentStyle(project)}>
                <CartridgeFace project={project} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
