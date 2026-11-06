import type { Project } from '../data/site'
import { projectHref } from '../router'
import { ProjectLinks } from './ProjectPage'

/** Conventional list of the same projects. Each row opens the same project page. */
export function ClassicProjectList({ projects }: { projects: Project[] }) {
  return (
    <ol role="list" className="classic">
      {projects.map((p) => {
        const meta = [p.type, p.genre, p.engine].filter(Boolean).join(' · ')
        return (
          <li key={p.id} className="classic-item" style={{ ['--accent' as string]: p.accentColor }}>
            <article>
              <p className="tag">{meta}</p>
              <h3>
                <a href={projectHref(p.id)}>{p.title}</a>
              </h3>
              <p className="classic-summary">{p.summary}</p>
              <div className="classic-actions">
                <a className="btn-pop" href={projectHref(p.id)}>
                  Open <span className="sr-only">{p.title}</span>
                </a>
                {p.downloadUrl && (
                  <a className="btn-pop alt" href={p.downloadUrl} target="_blank" rel="noopener noreferrer">
                    Download <span className="sr-only">{p.title}</span>
                  </a>
                )}
              </div>
            </article>
          </li>
        )
      })}
    </ol>
  )
}

export { ProjectLinks }
