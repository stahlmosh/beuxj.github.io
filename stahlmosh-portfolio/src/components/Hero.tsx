import { site } from '../data/site'

export function Hero() {
  const [first, ...rest] = [site.name.slice(0, 5), site.name.slice(5)]
  return (
    <section aria-labelledby="hero-title" className="hero-grid">
      <div className="hero-copy">
        <h1 id="hero-title" className="name" aria-label={site.name}>
          <span aria-hidden="true">{first}</span>
          <span aria-hidden="true">{rest}</span>
        </h1>
        <button type="button" className="btn-pop" onClick={() => document.getElementById('games')?.scrollIntoView()}>
          Pick a game <span aria-hidden="true">↓</span>
        </button>
      </div>
      <div className="print">
        <img src="/stahlmosh.webp" width="900" height="900" alt="Stahlmosh logo: a faceless detective in a brown fedora and trench coat, a dripping question mark painted where the face should be." />
      </div>
    </section>
  )
}
