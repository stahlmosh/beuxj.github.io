import { bio, site, skillGroups } from '../data/site'
import { Torn } from './Torn'

/** About: the logo print, a short bio and skill groups, all inline (no popup). */
export function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-title" className="about">
      <Torn seed={47} className="torn-top text-paper" />
      <div className="wrap about-grid">
        <figure className="poster">
          <img
            src="/stahlmosh.webp"
            width="900"
            height="900"
            loading="lazy"
            decoding="async"
            alt="Stahlmosh logo: a faceless detective in a brown fedora and trench coat, a dripping question mark painted where the face should be."
          />
          <figcaption className="poster-label">{site.name}</figcaption>
        </figure>

        <div className="about-text">
          <h2 id="about-title" className="h-section">
            About
          </h2>
          <div className="about-bio">
            {bio.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="skills">
            {skillGroups.map((g) => (
              <section key={g.title}>
                <h3>{g.title}</h3>
                <ul role="list" className="chips">
                  {g.items.map((item) => (
                    <li key={item} className="chip">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
