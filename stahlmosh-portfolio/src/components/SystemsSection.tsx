import { experiments } from '../data/site'

const INK = '#1b1310'

/** Static vector figure: a tilted box touching the ground, with velocity and contact normal. */
function PhysicsFigure() {
  return (
    <svg viewBox="95 105 330 175" className="block w-full" role="img" aria-label="Diagram of a tilted box touching the ground at one corner, with a velocity vector and a contact normal.">
      <defs>
        <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0V24" fill="none" stroke="#f3e5c6" strokeOpacity="0.14" strokeWidth="1.5" />
        </pattern>
        <marker id="arr-v" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0L10 5L0 10z" fill="#ffc93a" />
        </marker>
        <marker id="arr-n" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0L10 5L0 10z" fill="#8fd6b4" />
        </marker>
      </defs>
      <rect x="0" y="0" width="480" height="300" fill="#261a16" />
      <rect x="0" y="0" width="480" height="300" fill="url(#grid)" />
      <path d="M30 257H455" stroke="#f3e5c6" strokeWidth="4" strokeLinecap="round" />
      <polygon points="198,200 283.5,172.6 302,229.6 216.5,257" fill="#ff7f6e" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <polygon points="198,200 283.5,172.6 288,186 202,213" fill="#fff" opacity="0.28" />
      <path d="M250 215 L345 187" stroke="#ffc93a" strokeWidth="5" strokeLinecap="round" markerEnd="url(#arr-v)" />
      <path d="M216.5 257 V186" stroke="#8fd6b4" strokeWidth="5" strokeLinecap="round" markerEnd="url(#arr-n)" />
      <circle cx="216.5" cy="257" r="8" fill="#e5392e" stroke="#f3e5c6" strokeWidth="3" />
    </svg>
  )
}

export function SystemsSection() {
  return (
    <section aria-labelledby="systems-title" className="systems">
      <div className="systems-grid">
        <div>
          <h2 id="systems-title" className="h-section">
            Experiments
          </h2>
          <ul role="list" className="exp-list">
            {experiments.map((e) => (
              <li key={e.id}>
                <h3>
                  {e.url ? (
                    <a href={e.url} target="_blank" rel="noopener noreferrer">
                      {e.title} <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    e.title
                  )}
                </h3>
                <p>{e.summary}</p>
              </li>
            ))}
          </ul>
        </div>
        <figure className="figure-card">
          <PhysicsFigure />
        </figure>
      </div>
    </section>
  )
}
