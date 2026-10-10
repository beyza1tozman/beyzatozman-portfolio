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
  const soundOn = useStore((s) => s.soundOn)
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
        <button className="brand" onClick={() => setView('about')}>
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
          <button className="sound-btn" aria-pressed={soundOn} aria-label={soundOn ? 'Mute sound' : 'Turn sound on'} title={soundOn ? 'Mute sound' : 'Turn sound on'} onClick={useStore.getState().toggleSound}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
              {soundOn ? (
                <path d="M15.5 9.2a4 4 0 0 1 0 5.6M18 6.8a7.5 7.5 0 0 1 0 10.4" />
              ) : (
                <path d="M16 9.5l5 5M21 9.5l-5 5" />
              )}
            </svg>
          </button>
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
