import { create } from 'zustand'

const VIEWS = ['home', 'projects', 'about', 'contact']
const viewFromHash = () => {
  const hash = typeof window !== 'undefined' ? window.location.hash.slice(1) : ''
  return VIEWS.includes(hash) ? hash : 'home'
}

// How far visitors can turn (radians) and zoom (distance factor) on the overview.
export const ORBIT_LIMITS = { yawMin: -0.55, yawMax: 0.65, zoomMin: 0.5, zoomMax: 1.3 }
const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

export const useStore = create((set) => ({
  // 'home' | 'projects' | 'about' | 'contact'
  view: viewFromHash(),
  hoveredId: null,
  openProjectId: null,
  sceneReady: false,
  orbit: { yaw: 0, zoom: 1 },
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
  turn: (dYaw) =>
    set(({ orbit }) => ({ orbit: { ...orbit, yaw: clamp(orbit.yaw + dYaw, ORBIT_LIMITS.yawMin, ORBIT_LIMITS.yawMax) } })),
  zoomBy: (factor) =>
    set(({ orbit }) => ({ orbit: { ...orbit, zoom: clamp(orbit.zoom * factor, ORBIT_LIMITS.zoomMin, ORBIT_LIMITS.zoomMax) } })),
  resetOrbit: () => set({ orbit: { yaw: 0, zoom: 1 } }),
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
