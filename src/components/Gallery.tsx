import { useRef, useState, type KeyboardEvent } from 'react'

interface Props {
  title: string
  shots: string[]
  alts?: string[]
}

/** Screenshot thumbnails that open a lightbox (a native <dialog>: focus trap, Escape and focus return come built in). */
export function Gallery({ title, shots, alts }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [i, setI] = useState(0)
  const n = shots.length
  const alt = (k: number) => alts?.[k] ?? `${title} screenshot ${k + 1}`

  const open = (k: number) => {
    setI(k)
    dialog.current?.showModal()
  }
  const step = (d: number) => setI((c) => (c + d + n) % n)
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') step(1)
    else if (e.key === 'ArrowLeft') step(-1)
  }

  return (
    <section className="gallery" aria-labelledby="gallery-title">
      <h2 id="gallery-title" className="gallery-title">
        Screenshots
      </h2>
      <ul role="list" className="shots">
        {shots.map((src, k) => (
          <li key={src}>
            <button type="button" className="shot" onClick={() => open(k)} aria-label={`Open screenshot ${k + 1} of ${n}: ${alt(k)}`}>
              <img src={src} alt="" loading="lazy" decoding="async" />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        className="lightbox"
        aria-label={`${title} screenshots`}
        onKeyDown={onKey}
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
      >
        <div className="lb-body">
          <img src={shots[i]} alt={alt(i)} />
          <p className="lb-count" aria-live="polite">
            {i + 1} / {n}
          </p>
          <button type="button" className="lb-btn lb-close" onClick={() => dialog.current?.close()}>
            Close
          </button>
          {n > 1 && (
            <>
              <button type="button" className="lb-btn lb-prev" aria-label="Previous screenshot" onClick={() => step(-1)}>
                ←
              </button>
              <button type="button" className="lb-btn lb-next" aria-label="Next screenshot" onClick={() => step(1)}>
                →
              </button>
            </>
          )}
        </div>
      </dialog>
    </section>
  )
}
