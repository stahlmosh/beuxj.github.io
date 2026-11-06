import { useEffect, useState } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const update = () => setMatches(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [query])
  return matches
}

export type View = 'shelf' | 'classic'
const VIEW_KEY = 'stahlmosh:view'

/** Shelf/classic preference, remembered per browser. Storage failures are ignored. */
export function useView(): [View, (v: View) => void] {
  const [view, setView] = useState<View>(() => {
    try {
      return localStorage.getItem(VIEW_KEY) === 'classic' ? 'classic' : 'shelf'
    } catch {
      return 'shelf'
    }
  })
  const update = (v: View) => {
    setView(v)
    try {
      localStorage.setItem(VIEW_KEY, v)
    } catch {
      /* private mode etc. */
    }
  }
  return [view, update]
}
