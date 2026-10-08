import { useEffect } from 'react'
import { useStore, hasWebGL } from '../store'
import { MENU_ITEMS, chooseMenuItem } from '../scene/MenuBoard'
import { projects } from '../data/projects'

const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches

const HINTS = {
  home: isTouch ? 'swipe to look around, tap the menu board' : 'drag to look around, pick something from the menu board',
  projects: isTouch ? 'tap a dish to flip it, tap again to order' : 'hover a dish to flip it, click to order',
}

// HTML layer over the canvas: brand, accessible nav, back button, hints.
export default function Overlay() {
  const view = useStore((s) => s.view)
  const setView = useStore((s) => s.setView)
  const modalOpen = useStore((s) => !!s.openProjectId)
  const orbit = useStore((s) => s.orbit)
  // any turn that isn't a whole number of full circles counts as moved
  const moved = Math.abs(Math.sin(orbit.yaw / 2)) > 0.01 || orbit.pitch !== 0 || orbit.zoom !== 1

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && view === 'projects' && !useStore.getState().openProjectId) setView('home')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [view, setView])

  return (
    <>
      <header className="topbar">
        <button className="brand" onClick={() => setView('home')}>
          Beyza Tozman
        </button>
        <nav className="topnav" aria-label="Main">
          {MENU_ITEMS.map((item) =>
            item.href ? (
              <a key={item.id} href={item.href} target="_blank" rel="noopener noreferrer">
                {item.label} ↗
              </a>
            ) : (
              <button key={item.id} aria-current={view === item.id ? 'page' : undefined} onClick={() => chooseMenuItem(item)}>
                {item.label}
              </button>
            )
          )}
        </nav>
      </header>

      {/* The dishes live in the canvas; this list makes them reachable by keyboard and
          screen readers, and is the whole menu when WebGL is unavailable. */}
      {(view === 'projects' || !hasWebGL) && (
        <nav className={hasWebGL ? 'sr-only' : 'dish-list'} aria-label="Projects">
          {!hasWebGL && <h1>Today's menu</h1>}
          {projects.map((p) => (
            <button key={p.id} className="chunky ghost" onClick={() => useStore.getState().openProject(p.id)}>
              No.{p.no} {p.title}
            </button>
          ))}
        </nav>
      )}

      {hasWebGL && view === 'projects' && !modalOpen && (
        <button className="chunky ghost back-btn" onClick={() => setView('home')}>
          ← Back
        </button>
      )}

      {hasWebGL && view === 'home' && moved && (
        <button className="chunky start-btn" onClick={() => useStore.getState().resetOrbit()}>
          Back to start
        </button>
      )}

      {hasWebGL && HINTS[view] && !modalOpen && (
        <p className="hint" aria-hidden="true">
          {HINTS[view]}
        </p>
      )}
    </>
  )
}
