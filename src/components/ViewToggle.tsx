import type { View } from '../hooks'

interface Props {
  view: View
  onChange: (v: View) => void
}

const OPTIONS: { value: View; label: string }[] = [
  { value: 'shelf', label: 'Reader' },
  { value: 'classic', label: 'List' },
]

export function ViewToggle({ view, onChange }: Props) {
  return (
    <div role="group" aria-label="Project view" className="seg">
      {OPTIONS.map((o) => (
        <button key={o.value} type="button" aria-pressed={view === o.value} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}
