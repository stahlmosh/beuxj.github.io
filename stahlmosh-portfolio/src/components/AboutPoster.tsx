import { bio, site, skillGroups } from '../data/site'
import { Modal } from './Modal'

/** Pinned print of the logo character. Opens the About dialog. */
export function AboutPoster({ onOpen }: { onOpen: (rect: DOMRect) => void }) {
  return (
    <button
      type="button"
      className="poster"
      aria-haspopup="dialog"
      aria-label={`About ${site.name}`}
      onClick={(e) => onOpen(e.currentTarget.getBoundingClientRect())}
    >
      <img src="/stahlmosh.webp" alt="" width="900" height="900" loading="lazy" decoding="async" />
      <span className="poster-label">About</span>
    </button>
  )
}

export function AboutModal({ originRect, onClose }: { originRect: DOMRect | null; onClose: () => void }) {
  return (
    <Modal labelledBy="about-title" originRect={originRect} onClose={onClose}>
      <div className="grid gap-6 p-5 sm:p-8">
        <header className="pr-12">
          <h2 id="about-title" className="font-display text-4xl uppercase leading-none">
            {site.name}
          </h2>
          <p className="mt-2 font-semibold text-[#5b4636]">{site.descriptor}</p>
        </header>

        <div className="grid max-w-prose gap-3">
          {bio.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <div className="grid gap-5 border-t-4 border-ink pt-6 sm:grid-cols-2">
          {skillGroups.map((g) => (
            <section key={g.title}>
              <h3 className="mb-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[#5b4636]">{g.title}</h3>
              <ul role="list" className="flex flex-wrap gap-2">
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
    </Modal>
  )
}
