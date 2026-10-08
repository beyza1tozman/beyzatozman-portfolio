import { create } from 'zustand'

const VIEWS = ['home', 'projects', 'about', 'contact']
const viewFromHash = () => {
  const hash = typeof window !== 'undefined' ? window.location.hash.slice(1) : ''
  return VIEWS.includes(hash) ? hash : 'home'
}

export const useStore = create((set) => ({
  // 'home' | 'projects' | 'about' | 'contact'
  view: viewFromHash(),
  hoveredId: null,
  openProjectId: null,
  sceneReady: false,
  setView: (view) => {
    history.replaceState(null, '', view === 'home' ? location.pathname : `#${view}`)
    set({ view, hoveredId: null })
  },
  setHovered: (hoveredId) => set({ hoveredId }),
  openProject: (openProjectId) => set({ openProjectId }),
  closeProject: () => set({ openProjectId: null }),
  setSceneReady: () => set({ sceneReady: true }),
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
