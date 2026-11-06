/** Shown when a #/project/<id> link does not match any game. Reuses the Terms page styling. */
export function NotFound() {
  return (
    <article className="terms">
      <a className="back-link" href="#/games">
        <span aria-hidden="true">←</span> Back to games
      </a>
      <h1 className="terms-title">Game not found</h1>
      <p className="terms-updated">That link doesn&apos;t match any game here. It may have been renamed or removed.</p>
      <a className="btn-pop" href="#/games">
        See all games
      </a>
    </article>
  )
}
