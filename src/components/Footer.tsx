import { site, socials, visibleLinks } from '../data/site'
import { SiteLink } from './SiteLink'

export function Footer() {
  const links = visibleLinks(socials)
  return (
    <footer className="site-footer dark-zone">
      <div className="footer-row">
        <p className="footer-name">{site.name}</p>
        {links.length > 0 && (
          <ul role="list" className="nav-list">
            {links.map((l) => (
              <li key={l.id}>
                <SiteLink link={l} className="nav-link" />
              </li>
            ))}
          </ul>
        )}
        <p className="footer-copy">
          <a className="nav-link" href="#/terms">
            Terms &amp; Privacy
          </a>{' '}
          © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}
