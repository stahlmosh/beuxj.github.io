import type { Project } from '../data/site'
import { Modal } from './Modal'
import { CartridgeArt } from './CartridgeArt'
import { DEFAULT_ACCENT } from './Cartridge'

interface Props {
  project: Project
  originRect: DOMRect | null
  onClose: () => void
}

function Media({ project, accent }: { project: Project; accent: string }) {
  const { mediaSrc, mediaType, posterSrc, title } = project
  const alt = project.mediaAlt ?? `${title} gameplay`

  if (mediaSrc && mediaType === 'video') {
    return (
      <video
        controls
        preload="none"
        playsInline
        poster={posterSrc}
        aria-label={alt}
        className="aspect-video w-full bg-canvas object-contain"
      >
        <source src={mediaSrc} />
      </video>
    )
  }
  if (mediaSrc) {
    return <img src={mediaSrc} alt={alt} loading="lazy" decoding="async" className="aspect-video w-full bg-canvas object-contain" />
  }
  return (
    <div className="relative aspect-video w-full overflow-hidden bg-canvas">
      <CartridgeArt kind={project.art ?? 'circuit'} color={accent} className="absolute inset-0 h-full w-full" />
      <p className="micro absolute bottom-2 left-3 rounded bg-canvas/85 px-2 py-1 text-ink-soft">
        No gameplay media yet — set mediaSrc
      </p>
    </div>
  )
}

export function ProjectModal({ project, originRect, onClose }: Props) {
  const titleId = `project-title-${project.id}`
  const accent = project.accentColor ?? DEFAULT_ACCENT
  const facts: [string, string | undefined][] = [
    ['Engine', project.engine],
    ['Role', project.role],
    ['Timeline', project.duration],
    ['Team', project.teamSize],
  ]
  const shownFacts = facts.filter((f): f is [string, string] => Boolean(f[1]))
  const tags = [project.type, project.genre].filter(Boolean).join(' · ')

  return (
    <Modal labelledBy={titleId} originRect={originRect} accent={accent} onClose={onClose}>
      <Media project={project} accent={accent} />
      <div className="grid gap-6 p-5 sm:p-7">
        <header className="pr-12">
          <p className="micro" style={{ color: accent }}>
            {tags}
          </p>
          <h2 id={titleId} className="mt-1 font-display text-3xl font-bold leading-tight text-ink">
            {project.title}
          </h2>
          {project.placeholder && (
            <p className="mt-2 text-sm text-signal">Placeholder entry — edit it in src/data/site.ts.</p>
          )}
        </header>

        <p className="max-w-prose text-ink-soft">{project.summary}</p>

        {shownFacts.length > 0 && (
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-y border-edge py-4 sm:grid-cols-4">
            {shownFacts.map(([k, v]) => (
              <div key={k}>
                <dt className="micro">{k}</dt>
                <dd className="mt-0.5 font-semibold text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        )}

        {(project.challenge || project.solution) && (
          <div className="grid gap-5 sm:grid-cols-2">
            {project.challenge && (
              <section>
                <h3 className="micro mb-1">Challenge</h3>
                <p className="text-ink">{project.challenge}</p>
              </section>
            )}
            {project.solution && (
              <section>
                <h3 className="micro mb-1">Solution</h3>
                <p className="text-ink">{project.solution}</p>
              </section>
            )}
          </div>
        )}

        {(project.playUrl || project.sourceUrl || project.trailerUrl) && (
          <div className="flex flex-wrap gap-3">
            {project.playUrl && (
              <a className="btn btn-primary" href={project.playUrl} target="_blank" rel="noopener noreferrer">
                Play <span aria-hidden="true">↗</span>
              </a>
            )}
            {project.trailerUrl && (
              <a className="btn" href={project.trailerUrl} target="_blank" rel="noopener noreferrer">
                Trailer <span aria-hidden="true">↗</span>
              </a>
            )}
            {project.sourceUrl && (
              <a className="btn" href={project.sourceUrl} target="_blank" rel="noopener noreferrer">
                Source <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}
