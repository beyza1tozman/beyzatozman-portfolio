import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../store'

const MAX_WAIT_MS = 5000

// Steaming cup of coffee while the scene and fonts get ready.
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
          <svg viewBox="0 -24 200 174" width="180" aria-hidden="true">
            <defs>
              <linearGradient id="loader-porcelain" x1="0" x2="1">
                <stop offset="0.3" stopColor="#f3e6cc" />
                <stop offset="1" stopColor="#cdb48e" />
              </linearGradient>
              <filter id="loader-blur" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4.5" />
              </filter>
            </defs>
            {/* saucer */}
            <ellipse cx="100" cy="122" rx="90" ry="22" fill="#e8d8b8" stroke="#3b2418" strokeWidth="2.5" />
            <ellipse cx="102" cy="124" rx="42" ry="9" fill="#d6c19c" stroke="#3b2418" strokeWidth="1.5" />
            {/* handle */}
            <path d="M56 66 C 22 58, 20 100, 70 102" fill="none" stroke="#3b2418" strokeWidth="13" strokeLinecap="round" />
            <path d="M56 66 C 22 58, 20 100, 70 102" fill="none" stroke="#efe0c2" strokeWidth="8" strokeLinecap="round" />
            {/* cup body and rim */}
            <path
              d="M48 52 C 50 94, 72 120, 88 122 L 120 122 C 136 120, 158 94, 160 52 A 56 14 0 0 1 48 52 Z"
              fill="url(#loader-porcelain)"
              stroke="#3b2418"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <ellipse cx="104" cy="52" rx="56" ry="14" fill="#f3e6cc" stroke="#3b2418" strokeWidth="2.5" />
            <ellipse cx="104" cy="54" rx="47" ry="9.5" fill="#3a140c" />
            <ellipse cx="96" cy="52" rx="20" ry="3" fill="#6b2a17" opacity="0.6" />
            {/* soft rising steam */}
            <g className="loader-steam" filter="url(#loader-blur)" fill="none" stroke="#f3e6cc" strokeWidth="11" strokeLinecap="round">
              <path d="M88 44 C 78 32, 100 24, 90 4" />
              <path d="M104 46 C 94 34, 116 26, 106 2" />
              <path d="M120 44 C 112 34, 128 26, 122 8" />
            </g>
          </svg>
          <p>brewing the kissaten…</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
