import { useEffect, useMemo, useState } from 'react'

/**
 * Tiny hash router, no dependency needed.
 *   #/                 home
 *   #/games | physics | about | contact | top    home, scrolled to that section
 *   #/games/<id>       home, scrolled to the games, with that cartridge loaded in the reader
 *   #/project/<id>     a project page
 *   #/terms            terms and privacy
 */
export type Section = 'top' | 'games' | 'physics' | 'about' | 'contact'
export type Route = { name: 'home'; section?: Section; cart?: string } | { name: 'project'; id: string } | { name: 'terms' }

const SECTIONS: Section[] = ['top', 'games', 'physics', 'about', 'contact']

const safeDecode = (s: string) => {
  try {
    return decodeURIComponent(s)
  } catch {
    return s
  }
}

const parse = (hash: string): Route => {
  const project = /^#\/project\/([^/?#]+)/.exec(hash)
  if (project) return { name: 'project', id: safeDecode(project[1]) }
  const cart = /^#\/games\/([^/?#]+)/.exec(hash)
  if (cart) return { name: 'home', section: 'games', cart: safeDecode(cart[1]) }
  if (/^#\/terms\/?$/.test(hash)) return { name: 'terms' }
  const section = /^#\/(\w+)/.exec(hash)?.[1] as Section | undefined
  return section && SECTIONS.includes(section) ? { name: 'home', section } : { name: 'home' }
}

export const projectHref = (id: string) => `#/project/${encodeURIComponent(id)}`
export const sectionHref = (s: Section) => `#/${s}`

export function useRoute(): Route {
  const [hash, setHash] = useState(() => window.location.hash)
  useEffect(() => {
    const on = () => setHash(window.location.hash)
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return useMemo(() => parse(hash), [hash])
}

export function scrollToSection(s: Section, instant = false) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const behavior = instant || reduce ? 'instant' : 'smooth'
  if (s === 'top') window.scrollTo({ top: 0, behavior })
  else document.getElementById(s)?.scrollIntoView({ behavior })
}

/** Go to a section. Works even if the address already points at it (the hash would not change). */
export function goSection(s: Section) {
  if (window.location.hash !== sectionHref(s)) window.location.hash = sectionHref(s)
  scrollToSection(s)
}
