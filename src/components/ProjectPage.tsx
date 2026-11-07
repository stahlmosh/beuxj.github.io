import { useEffect, useRef, useState } from 'react'
import type { Project } from '../data/site'
import { CartridgeArt } from './CartridgeArt'
import { projects } from '../data/projects'
import { projectHref } from '../router'
import { accentStyle, CartridgeFace, DEFAULT_ACCENT } from './Cartridge'
import { Gallery } from './Gallery'

const DEV = import.meta.env.DEV

/** Gameplay media if supplied, otherwise the drawn cartridge art, large. */
export function ProjectMedia({ project, accent }: { project: Project; accent: string }) {
  const { mediaSrc, mediaType, posterSrc, title } = project
  const alt = project.mediaAlt ?? `${title} ${project.kind === 'asset' ? 'preview' : 'gameplay'}`
  if (mediaSrc && mediaType === 'video') {
    return (
      <video controls preload="none" playsInline poster={posterSrc} aria-label={alt}>
        <source src={mediaSrc} />
      </video>
    )
  }
  if (mediaSrc) return <img src={mediaSrc} alt={alt} decoding="async" />
  if (project.coverImage) return <img src={project.coverImage} alt={`${title} artwork`} decoding="async" />
  return <CartridgeArt kind={project.art ?? 'cube'} color={accent} />
}

/** Download / trailer / source buttons. Only links that exist are shown. */
export function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="actions">
      {project.downloadUrl ? (
        <a className="btn-pop" href={project.downloadUrl} target="_blank" rel="noopener noreferrer">
          Download <span aria-hidden="true">↓</span>
        </a>
      ) : (
        DEV && (
          <span className="btn-pop is-missing" aria-disabled="true" title="Shown in dev only. Add downloadUrl to this project's project.json.">
            Download link not set
          </span>
        )
      )}
      {project.trailerUrl && (
        <a className="btn-pop alt" href={project.trailerUrl} target="_blank" rel="noopener noreferrer">
          Trailer <span aria-hidden="true">↗</span>
        </a>
      )}
      {project.sourceUrl && (
        <a className="btn-pop alt" href={project.sourceUrl} target="_blank" rel="noopener noreferrer">
          Source <span aria-hidden="true">↗</span>
        </a>
      )}
    </div>
  )
}

/** The project's own page: art, details and download link. */
export function ProjectPage({ project }: { project: Project }) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [copied, setCopied] = useState(false)
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}${projectHref(project.id)}`)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard blocked: the address bar still has the link */
    }
  }
  const accent = project.accentColor ?? DEFAULT_ACCENT
  const isEngine = project.variant === 'engine'
  const tag = [project.type, project.genre].filter(Boolean).join(' · ')
  const facts = (
    [
      ['Engine', project.engine],
      ['Role', project.role],
      ['Timeline', project.duration],
      ['Team', project.teamSize],
    ] as [string, string | undefined][]
  ).filter((f): f is [string, string] => Boolean(f[1]))

  const sameShelf = projects.filter((p) => (p.kind === 'asset') === (project.kind === 'asset'))
  const idx = sameShelf.findIndex((p) => p.id === project.id)
  const next = !isEngine && sameShelf.length > 1 && idx >= 0 ? sameShelf[(idx + 1) % sameShelf.length] : undefined

  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true })
  }, [project.id])

  return (
    <article className="proj" style={accentStyle(project)} aria-labelledby="project-title">
      <a href={isEngine ? '#/physics' : project.kind === 'asset' ? `#/games/${encodeURIComponent(project.id)}` : '#/games'} className="back-link">
        <span aria-hidden="true">←</span> {isEngine ? 'Back to physics engine' : project.kind === 'asset' ? 'Back to assets' : 'Back to games'}
      </a>

      <div className="proj-grid">
        <div className="proj-art">
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

        <div className="proj-info">
          <p className="tag">{tag}</p>
          <h1 id="project-title" ref={titleRef} tabIndex={-1} className="proj-title">
            {project.title}
          </h1>
          <p className="proj-summary">{project.summary}</p>
          {project.details?.map((d) => (
            <p key={d} className="proj-detail">
              {d}
            </p>
          ))}

          {facts.length > 0 && (
            <dl className="facts">
              {facts.map(([k, v]) => (
                <div className="fact" key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          )}

          {project.highlights && project.highlights.length > 0 && (
            <ul role="list" className="chips proj-chips">
              {project.highlights.map((h) => (
                <li key={h} className="chip">
                  {h}
                </li>
              ))}
            </ul>
          )}

          {(project.challenge || project.solution || project.reflection) && (
            <div className="notes">
              {project.challenge && (
                <section className="note">
                  <h2>Challenge</h2>
                  <p>{project.challenge}</p>
                </section>
              )}
              {project.solution && (
                <section className="note">
                  <h2>Solution</h2>
                  <p>{project.solution}</p>
                </section>
              )}
              {project.reflection && (
                <section className="note">
                  <h2>What I&apos;d do differently</h2>
                  <p>{project.reflection}</p>
                </section>
              )}
            </div>
          )}

          <ProjectLinks project={project} />
          <div className="share-row">
            <button type="button" className="copy-btn" onClick={copyLink}>
              {copied ? 'Link copied ✓' : 'Copy link to this page'}
            </button>
            <span className="sr-only" role="status">
              {copied ? 'Link copied' : ''}
            </span>
          </div>
          {DEV && project.placeholder && <p className="dev-note">Dev note: placeholder entry. Edit its project.json in src/content.</p>}
        </div>
      </div>

      {project.shots && project.shots.length > 0 && <Gallery title={project.title} shots={project.shots} alts={project.shotAlts} />}

      {next && (
        <a className="next-up" href={projectHref(next.id)} style={accentStyle(next)}>
          <span className="next-text">
            <span className="next-label">Next project</span>
            <span className="next-title">
              {next.title} <span aria-hidden="true">→</span>
            </span>
          </span>
          <span className="next-cart" aria-hidden="true">
            <div className="cart">
              <CartridgeFace project={next} />
            </div>
          </span>
        </a>
      )}
    </article>
  )
}
