import { useEffect, useMemo, useState } from 'react'

/** Tiny hash router: "#/" is home, "#/project/<id>" is a project page. No dependency needed. */
export type Route = { name: 'home' } | { name: 'project'; id: string }

const parse = (hash: string): Route => {
  const m = /^#\/project\/([\w-]+)/.exec(hash)
  return m ? { name: 'project', id: m[1] } : { name: 'home' }
}

export const projectHref = (id: string) => `#/project/${id}`

export function useRoute(): Route {
  const [hash, setHash] = useState(() => window.location.hash)
  useEffect(() => {
    const on = () => setHash(window.location.hash)
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return useMemo(() => parse(hash), [hash])
}
