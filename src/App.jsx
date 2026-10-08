import { lazy, Suspense } from 'react'
import Overlay from './ui/Overlay'
import ProjectModal from './ui/ProjectModal'
import InfoPanel from './ui/InfoPanel'
import Loader from './ui/Loader'
import { hasWebGL } from './store'

// three.js is the heavy part; load it after the HTML shell and loader are up.
const Scene = lazy(() => import('./scene/Scene'))

export default function App() {
  return (
    <>
      {hasWebGL && (
        <main style={{ position: 'fixed', inset: 0 }} aria-label="3D kissaten coffee shop">
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </main>
      )}
      <Overlay />
      <ProjectModal />
      <InfoPanel />
      {hasWebGL && <Loader />}
    </>
  )
}
