import type { Project } from '../data/site'
import { useMediaQuery } from '../hooks'
import { Cartridge } from './Cartridge'

interface Props {
  projects: Project[]
  loadedId: string
  onInsert: (project: Project) => void
}

/** Library rack: desktop one rack of four, tablet racks of two, mobile one scrollable rail. */
export function Shelf({ projects, loadedId, onInsert }: Props) {
  const wide = useMediaQuery('(min-width: 1100px)')
  const mid = useMediaQuery('(min-width: 680px)')
  const perRack = wide ? 4 : mid ? 2 : 0
  const rail = perRack === 0

  const racks: Project[][] = []
  if (rail) {
    racks.push(projects)
  } else {
    for (let i = 0; i < projects.length; i += perRack) racks.push(projects.slice(i, i + perRack))
  }

  let counter = 0
  return (
    <div className="racks">
      {racks.map((row, r) => (
        <div className="rack" key={r}>
          <ul className="rack-row" role="list" data-rail={rail || undefined}>
            {row.map((p) => (
              <Cartridge key={p.id} project={p} index={counter++} loaded={loadedId === p.id} onInsert={onInsert} />
            ))}
          </ul>
          <div className="rack-board" aria-hidden="true" />
        </div>
      ))}
    </div>
  )
}
