import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useReveal } from './effects'
import { showAbout, site, type Project } from './data/site'
import { engine, featuredProject, findProject, mystery, projects } from './data/projects'
import { useView } from './hooks'
import { projectHref, scrollToSection, useRoute } from './router'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Console } from './components/Console'
import { Library } from './components/Library'
import { ClassicProjectList } from './components/ClassicProjectList'
import { ViewToggle } from './components/ViewToggle'
import { LoadingScreen } from './components/LoadingScreen'
import { ProjectPage } from './components/ProjectPage'
import { PhysicsSection } from './components/PhysicsSection'
import { AboutSection } from './components/AboutSection'
import { Contact } from './components/Contact'
import { Torn } from './components/Torn'
import { Footer } from './components/Footer'
import { TermsPage } from './components/TermsPage'
import { NotFound } from './components/NotFound'
import { ToyBox } from './components/ToyBox'

const library = mystery ? [...projects, mystery] : projects

export default function App() {
  const route = useRoute()
  const [view, setView] = useView()
  const [loadedId, setLoadedId] = useState(() => {
    const want = route.name === 'home' ? route.cart : undefined
    return library.some((p) => p.id === want) ? want : library[0]?.id
  })
  const [ejecting, setEjecting] = useState<Project | null>(null)
  const [swapped, setSwapped] = useState(false)
  const [loading, setLoading] = useState<Project | null>(null)
  const ejectTimer = useRef<number>(0)
  const savedY = useRef(0)
  const wasProject = useRef(false)
  const firstRender = useRef(true)

  const project = route.name === 'project' ? findProject(route.id) : undefined
  const section = route.name === 'home' ? route.section : undefined
  const isTerms = route.name === 'terms'
  const isMissing = route.name === 'project' && !project
  const cart = route.name === 'home' ? route.cart : undefined
  const loaded = library.find((p) => p.id === loadedId) ?? library[0]
  useReveal(project?.id, view, isTerms, isMissing)

  // Remember where the home page was scrolled to, so "back" returns there.
  useEffect(() => {
    const onScroll = () => {
      if (!/^#\/(project|terms)/.test(window.location.hash)) savedY.current = window.scrollY
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => () => window.clearTimeout(ejectTimer.current), [])

  // Scroll handling for route changes.
  const projectId = project?.id
  useLayoutEffect(() => {
    const instant = firstRender.current || wasProject.current
    if (projectId || isTerms || isMissing) window.scrollTo({ top: 0, behavior: 'instant' })
    else if (section) scrollToSection(section, instant)
    else {
      window.scrollTo({ top: savedY.current, behavior: 'instant' })
      if (!firstRender.current && wasProject.current)
        requestAnimationFrame(() => document.getElementById('play-button')?.focus({ preventScroll: true }))
    }
    wasProject.current = !!projectId || isTerms || isMissing
    firstRender.current = false
  }, [projectId, section, isTerms, isMissing])

  const insert = useCallback(
    (next: Project) => {
      if (next.id === loadedId) return
      setEjecting(library.find((p) => p.id === loadedId) ?? null)
      setLoadedId(next.id)
      setSwapped(true)
      window.clearTimeout(ejectTimer.current)
      ejectTimer.current = window.setTimeout(() => setEjecting(null), 300)
      // Keyboard users land on Play, ready to start.
      requestAnimationFrame(() => document.getElementById('play-button')?.focus({ preventScroll: true }))
    },
    [loadedId],
  )

  // A link like #/games/<id> loads that cartridge into the reader.
  useEffect(() => {
    const want = cart ? library.find((p) => p.id === cart) : undefined
    if (want && want.id !== loadedId) insert(want)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart])

  // The tab title follows the page.
  useEffect(() => {
    document.title = isMissing
      ? `Game not found — ${site.name}`
      : isTerms
        ? `Terms & Privacy — ${site.name}`
        : project
          ? `${project.title} — ${site.name}`
          : `${site.name} — ${site.descriptor}`
  }, [isMissing, isTerms, project])

  const goToProject = useCallback((p: Project) => {
    window.location.hash = projectHref(p.id)
  }, [])

  const blocked = loading !== null && !project

  return (
    <>
      {/* The page is inert while the loading screen is open. */}
      <div id="top" inert={blocked}>
        <a
          href="#main"
          className="sr-only-focusable"
          onClick={(e) => {
            e.preventDefault()
            document.getElementById('main')?.focus()
          }}
        >
          Skip to content
        </a>
        <Header home={!project && !isTerms && !isMissing} />

        {isMissing ? (
          <div className="proj-wrap">
            <main id="main" tabIndex={-1}>
              <NotFound />
            </main>
            <Footer />
          </div>
        ) : isTerms ? (
          <div className="proj-wrap">
            <main id="main" tabIndex={-1}>
              <TermsPage />
            </main>
            <Footer />
          </div>
        ) : project ? (
          <div className="proj-wrap">
            <main id="main" tabIndex={-1}>
              <ProjectPage project={project} />
            </main>
            <Footer />
          </div>
        ) : (
          <>
            <main id="main" tabIndex={-1}>
              <Hero project={featuredProject} onPlay={setLoading} />

              <section id="games" aria-labelledby="games-title" className="arcade dark-zone">
                <Torn seed={11} className="torn-top text-night" />
                <div className="wrap">
                  <div className="row-between">
                    <h2 id="games-title" className="h-section">
                      Games
                    </h2>
                    {projects.length > 6 && <ViewToggle view={view} onChange={setView} />}
                  </div>

                  {!loaded ? (
                    <p className="empty-note">
                      {import.meta.env.DEV ? 'No games yet. Run: npm run new-project -- "Game title"' : 'New games are on the way. Check back soon.'}
                    </p>
                  ) : !(view === 'classic' && projects.length > 6) ? (
                    <>
                      <Console loaded={loaded} ejecting={ejecting} animateIn={swapped} onPlay={() => setLoading(loaded)} />
                      <Library projects={library} loadedId={loaded.id} onInsert={insert} />
                    </>
                  ) : (
                    <ClassicProjectList projects={projects} />
                  )}
                  {loaded && <ToyBox projects={projects} onOpen={setLoading} />}
                </div>
              </section>

              {showAbout && <AboutSection />}
              <PhysicsSection engine={engine} onOpen={setLoading} />
              <Contact />
            </main>
            <div className="footer-edge">
              <Torn seed={101} className="torn-top text-ink" />
              <Footer />
            </div>
          </>
        )}
      </div>

      {loading && <LoadingScreen project={loading} onNavigate={() => goToProject(loading)} onClose={() => setLoading(null)} />}
    </>
  )
}
