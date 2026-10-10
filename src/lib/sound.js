import { useStore } from '../store'

// Rainy-night jazz in the background and a coffee pour when a dish is ordered.
// Browsers only allow sound after the visitor interacts with the page, so the
// music fades in slowly on their first click, tap or key press.
//   Music: "Jazz Rainy Night" by Alex Morgan (Pixabay Content License)
//   Pour: "CoffeePouringInCup" by kvgarlic on Freesound (CC0)

const MUSIC_VOLUME = 0.3
const POUR_VOLUME = 0.6
const FADE_IN_MS = 4000

let music = null
let pour = null
let unlocked = false // true once the browser has allowed audio
let starting = false
let fade = 0

// Timer-based rather than requestAnimationFrame, which stops in hidden tabs.
function fadeTo(audio, target, ms, done) {
  clearInterval(fade)
  const from = audio.volume
  const start = performance.now()
  fade = setInterval(() => {
    const t = Math.min(1, (performance.now() - start) / ms)
    audio.volume = from + (target - from) * t
    if (t === 1) {
      clearInterval(fade)
      done?.()
    }
  }, 30)
}

const wantsMusic = () => useStore.getState().soundOn && !document.hidden

function startMusic() {
  if (starting || !wantsMusic()) return
  if (!music) {
    music = new Audio('/audio/rainy-night-jazz.mp3')
    music.loop = true
  }
  if (music.paused) music.volume = 0
  starting = true
  music
    .play()
    .then(() => {
      unlocked = true
      // the visitor may have muted or left the tab while it was loading
      if (wantsMusic()) fadeTo(music, MUSIC_VOLUME, FADE_IN_MS)
      else stopMusic(true)
    })
    .catch(() => {})
    .finally(() => (starting = false))
}

function stopMusic(immediately = false) {
  if (!music || music.paused) return
  clearInterval(fade)
  if (immediately) music.pause()
  else fadeTo(music, 0, 600, () => music.pause())
}

function playPour() {
  if (!pour) pour = new Audio('/audio/coffee-pour.wav')
  pour.volume = POUR_VOLUME
  pour.currentTime = 0
  pour.play().catch(() => {})
}

if (typeof window !== 'undefined') {
  // Browsers differ in which event counts as the visitor "interacting", so try
  // on all of them until one is allowed. Capture phase, so nothing on the page
  // can stop the event before it gets here.
  const unlock = (e) => {
    if (!unlocked && e.isTrusted) startMusic()
  }
  for (const type of ['pointerdown', 'pointerup', 'click', 'touchend', 'keydown']) {
    window.addEventListener(type, unlock, { capture: true })
  }

  useStore.subscribe((state, prev) => {
    if (state.soundOn !== prev.soundOn) state.soundOn ? startMusic() : stopMusic()
    if (unlocked && state.soundOn && state.openProjectId && !prev.openProjectId) playPour()
  })

  // Silent while the visitor is on another tab; fades back in when they return.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopMusic(true)
    else if (unlocked) startMusic()
  })
}
