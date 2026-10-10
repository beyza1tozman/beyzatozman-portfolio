import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../store'
import { projectById } from '../data/projects'

const FOOD_EMOJI = { sandwich: '🥪', parfait: '🍨', pancakes: '🥞', soda: '🍈' }

function Gallery({ project }) {
  const [index, setIndex] = useState(0)
  const images = project.images
  if (!images.length) {
    return (
      <div className="gallery-frame">
        <div className="gallery-empty">
          {FOOD_EMOJI[project.food]}
          <span>{project.dish}</span>
        </div>
      </div>
    )
  }
  const current = images[index]
  return (
    <div>
      <div className="gallery-frame has-image">
        <img src={current.src} alt={current.alt} />
      </div>
      {images.length > 1 && (
        <div className="thumbs">
          {images.map((img, i) => (
            <button key={img.src} aria-pressed={i === index} aria-label={`Show screenshot ${i + 1}`} onClick={() => setIndex(i)}>
              <img src={img.src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProjectModal() {
  const id = useStore((s) => s.openProjectId)
  const close = useStore((s) => s.closeProject)
  const project = id ? projectById[id] : null
  const dialog = useRef()

  useEffect(() => {
    if (!project) return
    const previous = document.activeElement
    dialog.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      // keep focus inside the dialog
      if (e.key === 'Tab' && dialog.current) {
        const focusables = dialog.current.querySelectorAll('a, button')
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) (e.preventDefault(), last.focus())
        else if (!e.shiftKey && document.activeElement === last) (e.preventDefault(), first.focus())
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      previous?.focus?.()
    }
  }, [project, close])

  return (
    <AnimatePresence>
      {project && (
        <motion.div className="backdrop" onClick={close} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.article
            ref={dialog}
            className="paper"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-title"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 40, rotate: -1.5, opacity: 0 }}
            animate={{ y: 0, rotate: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          >
            <div className="paper-body">
              <header className="menu-head">
                <p className="menu-kicker">MENU</p>
                <h2 id="project-title">{project.title}</h2>
                <p className="dish menu-line">
                  <span>{project.dish}</span>
                  <span className="leader" aria-hidden="true" />
                  <span className="no">No.{project.no}</span>
                </p>
              </header>
              <div className="modal-grid">
                <Gallery project={project} />
                <div>
                  <p>{project.description}</p>
                  <h3>On the plate</h3>
                  <ul>
                    {project.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                  <h3>Ingredients</h3>
                  <div className="chips">
                    {project.stack.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="actions">
                {project.links.demo && (
                  <a className="chunky" href={project.links.demo} target="_blank" rel="noopener noreferrer">
                    Live demo
                  </a>
                )}
                {project.links.repo && (
                  <a className="chunky" href={project.links.repo} target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                )}
                <button className="chunky ghost" onClick={close}>
                  Close
                </button>
              </div>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
