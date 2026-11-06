import type { LinkItem } from '../data/site'

interface Props {
  link: LinkItem
  className?: string
}

/**
 * External link from config. If the URL has not been set yet, renders a clearly
 * marked, non-interactive placeholder instead of a dead or invented link.
 */
export function SiteLink({ link, className = '' }: Props) {
  if (link.url) {
    return (
      <a href={link.url} target="_blank" rel="noopener noreferrer" className={className}>
        {link.label}
        <span aria-hidden="true"> ↗</span>
      </a>
    )
  }
  return (
    <span
      role="link"
      aria-disabled="true"
      title={`Add the ${link.label} URL in src/data/site.ts`}
      className={`${className} link-missing`}
    >
      {link.label}
    </span>
  )
}
