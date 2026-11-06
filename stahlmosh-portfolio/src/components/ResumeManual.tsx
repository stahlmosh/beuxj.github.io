import { resume, site } from '../data/site'

/** Booklet-styled resume. Links to the configured PDF/URL, or shows a short setup note. */
export function ResumeManual() {
  const inner = (
    <span className="manual-inner">
      <span className="manual-name">{site.name}</span>
      <span className="manual-title">Resume</span>
      <svg viewBox="0 0 120 70" className="manual-art" aria-hidden="true" focusable="false">
        <rect x="30" y="6" width="60" height="50" rx="6" fill="#f3e5c6" stroke="#1b1310" strokeWidth="4" strokeLinejoin="round" />
        <rect x="40" y="16" width="40" height="22" rx="2" fill="#8fd6b4" stroke="#1b1310" strokeWidth="3" />
        <g fill="#ffc93a" stroke="#1b1310" strokeWidth="1.6">
          {[42, 49, 56, 63, 70].map((x) => (
            <rect key={x} x={x} y="43" width="4" height="8" />
          ))}
        </g>
      </svg>
      <span className="manual-note">{resume.url ? 'Open ↗' : 'Add your resume link'}</span>
    </span>
  )

  if (resume.url) {
    return (
      <a className="manual" href={resume.url} target="_blank" rel="noopener noreferrer" aria-label={`${site.name} resume`}>
        {inner}
      </a>
    )
  }
  return (
    <div className="manual" data-missing role="group" aria-label="Resume (link not set yet)">
      {inner}
    </div>
  )
}
