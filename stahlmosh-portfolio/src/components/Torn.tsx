/** Deterministic ragged edge, like torn paper. Placed at the top of a section; colour comes from `currentColor`. */
function ragged(seed: number): string {
  let s = seed
  const next = () => (s = (s * 16807) % 2147483647) / 2147483647
  const pts = ['0,30']
  for (let x = 0; x <= 100; x += 2.5) pts.push(`${x},${(3 + next() * 15).toFixed(1)}`)
  pts.push('100,30')
  return pts.join(' ')
}

export function Torn({ seed, className = '' }: { seed: number; className?: string }) {
  return (
    <svg className={`torn ${className}`} viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <polygon points={ragged(seed)} fill="currentColor" />
    </svg>
  )
}
