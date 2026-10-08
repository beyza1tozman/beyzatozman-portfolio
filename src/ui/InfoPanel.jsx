import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../store'

export const CONTACT = {
  email: 'tozmanbeyza@gmail.com',
  linkedin: 'https://www.linkedin.com/in/beyzatozman1/',
  github: 'https://github.com/beyza1tozman',
  blog: 'https://beyzatozman.netlify.app',
  cv: '/Beyza_Tozman_CV.pdf',
}

function About() {
  return (
    <>
      <h2 id="panel-title">About me</h2>
      <p className="dish">the house blend</p>
      <p>
        Hi, I’m Beyza, a software and AI engineer doing my M.Sc. in Computer Science at the University of Passau.
        I build end-to-end things where machine learning, computer vision and data visualization meet, from
        full-stack apps to interactive dashboards.
      </p>
      <p>
        I’m happiest where technology meets creative expression: creative coding with p5.js, generative
        systems, and visualizations you want to play with. Away from the keyboard you’ll find me drawing,
        doing embroidery, taking photos or writing on my blog.
      </p>
      <p>I’m currently looking for a Werkstudent position in AI and software engineering.</p>
      <h3>Usually brewing with</h3>
      <div className="chips">
        {['Python', 'PyTorch', 'JavaScript', 'D3.js', 'React', 'FastAPI', 'Spring Boot', 'ASP.NET', 'Docker', 'PostgreSQL'].map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <div className="link-row">
        <a className="chunky" href={CONTACT.cv} target="_blank" rel="noopener noreferrer">
          Résumé
        </a>
      </div>
    </>
  )
}

function Contact() {
  return (
    <>
      <h2 id="panel-title">Contact</h2>
      <p className="dish">leave a note on the counter</p>
      <p>Want to talk about a project, a Werkstudent role, or a good book? I’d love to hear from you.</p>
      <p>
        <a className="contact-email" href={`mailto:${CONTACT.email}`}>
          {CONTACT.email}
        </a>
      </p>
      <div className="link-row">
        <a className="chunky" href={`mailto:${CONTACT.email}`}>
          Email
        </a>
        <a className="chunky" href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <a className="chunky" href={CONTACT.github} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a className="chunky ghost" href={CONTACT.cv} target="_blank" rel="noopener noreferrer">
          Résumé
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
