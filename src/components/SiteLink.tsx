import type { LinkItem } from '../data/site'

interface Props {
  link: LinkItem
  className?: string
}

/**
 * External link from config. If the URL is not set, it renders a dotted,
 * non-interactive placeholder (the caller only passes such links in dev).
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
    <span aria-disabled="true" title={`Add the ${link.label} URL in src/data/site.ts`} className={`${className} link-missing`}>
      {link.label}
    </span>
  )
}
