import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../store'

// TODO(beyza): replace with your own words, email and LinkedIn.
function About() {
  return (
    <>
      <h2 id="panel-title">About me</h2>
      <p className="dish">the house blend</p>
      <p>
        Hi, I’m Beyza — a Computer Science Master’s student at Universität Passau in Germany who loves the place where code meets
        storytelling. I build interactive data visualizations, small games and web experiences, and I like
        them to feel as warm and handmade as a corner coffee shop.
      </p>
      <h3>Usually brewing with</h3>
      <div className="chips">
        {['JavaScript', 'D3.js', 'React', 'Three.js', 'Python', 'FastAPI', 'Java', 'Astro'].map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
    </>
  )
}

function Contact() {
  return (
    <>
      <h2 id="panel-title">Contact</h2>
      <p className="dish">leave a note on the counter</p>
      <p>Want to talk about a project, a role, or a good book? I’d love to hear from you.</p>
      <div className="actions" style={{ justifyContent: 'flex-start' }}>
        <a className="chunky" href="https://github.com/beyza1tozman" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a className="chunky" href="https://beyzatozman.netlify.app" target="_blank" rel="noopener noreferrer">
          Blog
        </a>
      </div>
    </>
  )
}

export default function InfoPanel() {
  const view = useStore((s) => s.view)
  const setView = useStore((s) => s.setView)
  const open = view === 'about' || view === 'contact'

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setView('home')
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setView])

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="backdrop" onClick={() => setView('home')} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.section
            key={view}
            className="paper"
            style={{ width: 'min(620px, 100%)' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="panel-title"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 40, rotate: 1.5, opacity: 0 }}
            animate={{ y: 0, rotate: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          >
            {view === 'about' ? <About /> : <Contact />}
            <div className="actions">
              <span />
              <button className="chunky ghost" onClick={() => setView('home')} autoFocus>
                Close
              </button>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
