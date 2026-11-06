import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { projects } from './data/site'
import type { Project } from './data/site'
import { useView } from './hooks'
import { projectHref, useRoute } from './router'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Console } from './components/Console'
import { Shelf } from './components/Shelf'
import { ClassicProjectList } from './components/ClassicProjectList'
import { ViewToggle } from './components/ViewToggle'
import { LoadingScreen } from './components/LoadingScreen'
import { ProjectPage } from './components/ProjectPage'
import { AboutPoster, AboutModal } from './components/AboutPoster'
import { ResumeManual } from './components/ResumeManual'
import { SystemsSection } from './components/SystemsSection'
import { Torn } from './components/Torn'
import { Footer } from './components/Footer'

export default function App() {
  const route = useRoute()
  const [view, setView] = useView()
  const [loadedId, setLoadedId] = useState(projects[0].id)
  const [ejecting, setEjecting] = useState<Project | null>(null)
  const [swapped, setSwapped] = useState(false)
  const [loading, setLoading] = useState<Project | null>(null)
  const [about, setAbout] = useState<{ rect: DOMRect } | null>(null)
  const ejectTimer = useRef<number>(0)
  const savedY = useRef(0)

  const project = route.name === 'project' ? projects.find((p) => p.id === route.id) : undefined
  const loaded = projects.find((p) => p.id === loadedId) ?? projects[0]

  // Remember where the home page was scrolled to, so "back" returns there.
  useEffect(() => {
    const onScroll = () => {
      if (!window.location.hash.startsWith('#/project')) savedY.current = window.scrollY
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => () => window.clearTimeout(ejectTimer.current), [])

  const projectId = project?.id
  const first = useRef(true)
  useLayoutEffect(() => {
    window.scrollTo({ top: projectId ? 0 : savedY.current, behavior: 'instant' })
    if (!projectId && !first.current) requestAnimationFrame(() => document.getElementById('play-button')?.focus({ preventScroll: true }))
    first.current = false
  }, [projectId])

  const insert = useCallback(
    (next: Project) => {
      if (next.id === loadedId) return
      setEjecting(projects.find((p) => p.id === loadedId) ?? null)
      setLoadedId(next.id)
      setSwapped(true)
      window.clearTimeout(ejectTimer.current)
      ejectTimer.current = window.setTimeout(() => setEjecting(null), 300)
      // Keyboard users land on Play, ready to start.
      requestAnimationFrame(() => document.getElementById('play-button')?.focus({ preventScroll: true }))
    },
    [loadedId],
  )

  const goToProject = useCallback((p: Project) => {
    window.location.hash = projectHref(p.id)
  }, [])

  const blocked = (loading !== null || about !== null) && !project

  return (
    <>
      {/* The page is inert while the loading screen or About dialog is open. */}
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

        {project ? (
          <div className="proj-wrap">
            <Header />
            <main id="main" tabIndex={-1}>
              <ProjectPage project={project} />
            </main>
            <Footer />
          </div>
        ) : (
          <>
            <div className="hero">
              <Header />
              <Hero />
            </div>

            <main id="main" tabIndex={-1}>
              <section id="games" aria-labelledby="games-title" className="arcade dark-zone">
                <Torn seed={11} className="torn-top text-night" />
                <div className="wrap">
                  <div className="row-between">
                    <h2 id="games-title" className="h-section">
                      Games
                    </h2>
                    <ViewToggle view={view} onChange={setView} />
                  </div>

                  {view === 'shelf' ? (
                    <>
                      <Console loaded={loaded} ejecting={ejecting} animateIn={swapped} onPlay={() => setLoading(loaded)} />
                      <Shelf projects={projects} loadedId={loaded.id} onInsert={insert} />
                    </>
                  ) : (
                    <ClassicProjectList projects={projects} />
                  )}
                </div>
              </section>

              <section aria-label="About and resume" className="studio">
                <Torn seed={29} className="torn-top text-paper" />
                <div className="wrap studio-row">
                  <AboutPoster onOpen={(rect) => setAbout({ rect })} />
                  <ResumeManual />
                </div>
              </section>

              <div className="paper-zone">
                <SystemsSection />
              </div>
            </main>
            <div className="footer-edge">
              <Torn seed={47} className="torn-top text-ink" />
              <Footer />
            </div>
          </>
        )}
      </div>

      {loading && <LoadingScreen project={loading} onNavigate={() => goToProject(loading)} onClose={() => setLoading(null)} />}
      {about && <AboutModal originRect={about.rect} onClose={() => setAbout(null)} />}
    </>
  )
}
