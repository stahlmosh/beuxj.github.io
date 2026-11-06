import { site, socials } from '../data/site'
import { SiteLink } from './SiteLink'

export function Footer() {
  return (
    <footer className="site-footer dark-zone">
      <div className="footer-row">
        <p className="footer-name">{site.name}</p>
        <ul role="list" className="nav-list">
          {socials.map((l) => (
            <li key={l.id}>
              <SiteLink link={l} className="nav-link" />
            </li>
          ))}
        </ul>
        <p className="footer-copy">© {new Date().getFullYear()}</p>
      </div>
    </footer>
  )
}
