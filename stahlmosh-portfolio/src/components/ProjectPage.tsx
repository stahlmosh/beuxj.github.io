import { useEffect, useRef } from 'react'
import type { Project } from '../data/site'
import { CartridgeArt } from './CartridgeArt'
import { accentStyle, CartridgeFace, DEFAULT_ACCENT } from './Cartridge'

const DEV = import.meta.env.DEV

function Media({ project, accent }: { project: Project; accent: string }) {
  const { mediaSrc, mediaType, posterSrc, title } = project
  const alt = project.mediaAlt ?? `${title} gameplay`
  if (mediaSrc && mediaType === 'video') {
    return (
      <video controls preload="none" playsInline poster={posterSrc} aria-label={alt}>
        <source src={mediaSrc} />
      </video>
    )
  }
  if (mediaSrc) return <img src={mediaSrc} alt={alt} decoding="async" />
  // No media supplied yet: show the drawn cartridge art large.
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
          <span className="btn-pop is-missing" aria-disabled="true" title="Shown in dev only. Set downloadUrl in src/data/site.ts.">
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
  const accent = project.accentColor ?? DEFAULT_ACCENT
  const tag = [project.type, project.genre].filter(Boolean).join(' · ')
  const facts = (
    [
      ['Engine', project.engine],
      ['Role', project.role],
      ['Timeline', project.duration],
      ['Team', project.teamSize],
    ] as [string, string | undefined][]
  ).filter((f): f is [string, string] => Boolean(f[1]))

  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true })
  }, [project.id])

  return (
    <article className="proj" style={accentStyle(project)} aria-labelledby="project-title">
      <a href="#/" className="back-link">
        <span aria-hidden="true">←</span> Back to games
      </a>

      <div className="proj-grid">
        <div className="proj-art">
          <div className="proj-frame">
            <div className="proj-frame-inner">
              <Media project={project} accent={accent} />
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

          {(project.challenge || project.solution) && (
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
            </div>
          )}

          <ProjectLinks project={project} />
          {DEV && project.placeholder && <p className="dev-note">Dev note: placeholder entry. Edit it in src/data/site.ts.</p>}
        </div>
      </div>
    </article>
  )
}
