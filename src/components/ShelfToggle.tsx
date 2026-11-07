export type Shelf = 'games' | 'assets'

interface Props {
  shelf: Shelf
  onChange: (s: Shelf) => void
  counts: Record<Shelf, number>
}

/** Switches the library between the Games shelf and the Assets shelf. Only shown when there are assets. */
export function ShelfToggle({ shelf, onChange, counts }: Props) {
  return (
    <div role="group" aria-label="Library shelf" className="seg shelf-toggle">
      {(['games', 'assets'] as const).map((s) => (
        <button key={s} type="button" aria-pressed={shelf === s} onClick={() => onChange(s)}>
          {s === 'games' ? 'Games' : 'Assets'} <span className="seg-count">{counts[s]}</span>
        </button>
      ))}
    </div>
  )
}
