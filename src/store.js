import { create } from 'zustand'

const VIEWS = ['home', 'projects', 'about', 'contact']
const viewFromHash = () => {
  const hash = typeof window !== 'undefined' ? window.location.hash.slice(1) : ''
  return VIEWS.includes(hash) ? hash : 'home'
}

// Visitors can turn all the way around the cafe. Pitch (radians, added to the
// starting tilt) keeps the camera above the floor; zoom is a distance factor.
export const ORBIT_LIMITS = { pitchMin: -0.75, pitchMax: 0.3, zoomMin: 0.25, zoomMax: 2 }
const TAU = Math.PI * 2
const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

export const useStore = create((set) => ({
  // 'home' | 'projects' | 'about' | 'contact'
  view: viewFromHash(),
  hoveredId: null,
  openProjectId: null,
  sceneReady: false,
  orbit: { yaw: 0, pitch: 0, zoom: 1 },
  // bumped on reset so any leftover drag momentum stops
  orbitResets: 0,
  // true when the current pointer gesture was a drag, so it shouldn't count as a click
  dragMoved: false,
  setView: (view) => {
    history.replaceState(null, '', view === 'home' ? location.pathname : `#${view}`)
    set({ view, hoveredId: null })
  },
  setHovered: (hoveredId) => set({ hoveredId }),
  openProject: (openProjectId) => set({ openProjectId }),
  closeProject: () => set({ openProjectId: null }),
  setSceneReady: () => set({ sceneReady: true }),
  turn: (dYaw, dPitch = 0) =>
    set(({ orbit }) => ({
      orbit: {
        ...orbit,
        yaw: orbit.yaw + dYaw,
        pitch: clamp(orbit.pitch + dPitch, ORBIT_LIMITS.pitchMin, ORBIT_LIMITS.pitchMax),
      },
    })),
  zoomBy: (factor) =>
    set(({ orbit }) => ({ orbit: { ...orbit, zoom: clamp(orbit.zoom * factor, ORBIT_LIMITS.zoomMin, ORBIT_LIMITS.zoomMax) } })),
  // back to the start angle the short way round, not by unwinding every full turn
  resetOrbit: () =>
    set(({ orbit, orbitResets }) => ({
      orbit: { yaw: Math.round(orbit.yaw / TAU) * TAU, pitch: 0, zoom: 1 },
      orbitResets: orbitResets + 1,
    })),
  setDragMoved: (dragMoved) => set({ dragMoved }),
}))

if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', () => useStore.setState({ view: viewFromHash(), hoveredId: null }))
}

export const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const hasWebGL = (() => {
  if (typeof document === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
})()
