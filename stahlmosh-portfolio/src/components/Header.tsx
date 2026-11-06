import { headerLinks, site } from '../data/site'
import { SiteLink } from './SiteLink'

export function Header() {
  return (
    <header className="site-header">
      <a href="#/" className="brand">
        <img src="/favicon.png" width="48" height="48" alt="" className="brand-mark" />
        <span>
          <span className="brand-name">{site.name}</span>
          <span className="brand-sub">{site.descriptor}</span>
        </span>
      </a>
      <nav aria-label="Profiles and resume">
        <ul role="list" className="nav-list">
          {headerLinks.map((l) => (
            <li key={l.id}>
              <SiteLink link={l} className="nav-link" />
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
