import { useRef, useState } from 'react'
import type { Project } from '../data/site'
import { useMediaQuery } from '../hooks'
import { Cartridge } from './Cartridge'

interface Props {
  projects: Project[]
  loadedId?: string
  onInsert: (project: Project) => void
}

function Arrow({ dir, disabled, onClick }: { dir: 'prev' | 'next'; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      className={`arrow arrow-${dir}`}
      aria-label={dir === 'prev' ? 'Previous cartridges' : 'Next cartridges'}
      aria-disabled={disabled || undefined}
      onClick={() => !disabled && onClick()}
    >
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        <path d={dir === 'prev' ? 'M16 4 L7 13 L16 22' : 'M10 4 L19 13 L10 22'} />
      </svg>
    </button>
  )
}

/**
 * The cartridge library: pages of cartridges with arrows, dots and swipe.
 * It grows with src/content/projects, so any number of games works.
 */
export function Library({ projects, loadedId, onInsert }: Props) {
  const wide = useMediaQuery('(min-width: 1100px)')
  const mid = useMediaQuery('(min-width: 760px)')
  const small = useMediaQuery('(min-width: 560px)')
  const perPage = wide ? 4 : mid ? 3 : small ? 2 : 1
  const pages = Math.max(1, Math.ceil(projects.length / perPage))

  const [state, setState] = useState<{ page: number; dir?: 'prev' | 'next' }>({ page: 0 })
  const page = Math.min(state.page, pages - 1)
  const start = page * perPage
  const visible = projects.slice(start, start + perPage)
  const touchX = useRef<number | null>(null)

  const go = (n: number) => {
    if (n < 0 || n >= pages || n === page) return
    setState({ page: n, dir: n > page ? 'next' : 'prev' })
  }

  return (
    <div className="library">
      <Arrow dir="prev" disabled={page === 0} onClick={() => go(page - 1)} />

      <div
        className="rack"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return
          const dx = e.changedTouches[0].clientX - touchX.current
          touchX.current = null
          if (Math.abs(dx) > 50) go(page + (dx < 0 ? 1 : -1))
        }}
      >
        <ul className="rack-row" role="list" key={page} data-dir={state.dir}>
          {visible.map((p, i) => (
            <Cartridge key={p.id} project={p} index={start + i} loaded={loadedId === p.id} onInsert={onInsert} />
          ))}
        </ul>
        <div className="rack-board" aria-hidden="true" />
      </div>

      <Arrow dir="next" disabled={page >= pages - 1} onClick={() => go(page + 1)} />

      <p className="sr-only" aria-live="polite">
        Showing cartridges {start + 1} to {start + visible.length} of {projects.length}
      </p>
      {pages > 1 && (
        <div className="dots" role="group" aria-label="Library pages">
          {Array.from({ length: pages }, (_, n) => (
            <button key={n} type="button" aria-label={`Page ${n + 1} of ${pages}`} aria-current={n === page ? 'true' : undefined} onClick={() => go(n)} />
          ))}
        </div>
      )}
    </div>
  )
}
