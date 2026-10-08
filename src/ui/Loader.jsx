import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../store'

const MAX_WAIT_MS = 5000

// Coffee cup that fills while the scene and fonts get ready.
export default function Loader() {
  const ready = useStore((s) => s.sceneReady)
  // never trap visitors behind the loader if a ready signal goes missing
  useEffect(() => {
    const id = setTimeout(() => useStore.getState().setSceneReady(), MAX_WAIT_MS)
    return () => clearTimeout(id)
  }, [])
  return (
    <AnimatePresence>
      {!ready && (
        <motion.div className="loader" role="status" exit={{ opacity: 0, pointerEvents: 'none' }} transition={{ duration: 0.6 }}>
          <svg viewBox="0 0 120 110" width="120" aria-hidden="true">
            <defs>
              <clipPath id="cup">
                <path d="M20 30 h64 l-6 52 a10 10 0 0 1 -10 9 h-32 a10 10 0 0 1 -10 -9 z" />
              </clipPath>
            </defs>
            <g clipPath="url(#cup)">
              <rect className="loader-coffee" x="10" y="30" width="90" height="70" fill="#6b3b22" />
            </g>
            <path d="M20 30 h64 l-6 52 a10 10 0 0 1 -10 9 h-32 a10 10 0 0 1 -10 -9 z" fill="none" stroke="#f4e9d3" strokeWidth="4" strokeLinejoin="round" />
            <path d="M84 42 a12 12 0 0 1 0 24 h-3" fill="none" stroke="#f4e9d3" strokeWidth="4" strokeLinecap="round" />
            <path d="M8 98 h104" stroke="#f4e9d3" strokeWidth="4" strokeLinecap="round" />
            <path className="loader-steam" d="M44 22 q-6 -8 0 -16 M60 22 q-6 -8 0 -16" fill="none" stroke="#c98f8f" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <p>brewing the kissaten…</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
