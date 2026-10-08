import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useStore, prefersReducedMotion } from '../store'

// Named viewpoints. `portrait` is used on tall/narrow screens.
const VIEWS = {
  home: {
    pos: [10.5, 8.2, 13.5],
    target: [0.6, 0.55, 1.4],
    portrait: { pos: [17, 13, 22], target: [0.2, 1.2, 1.4] },
  },
  projects: {
    pos: [0.4, 1.85, 2.0],
    target: [-4.5, 1.6, 2.0],
    portrait: { pos: [2.6, 2.0, 2.0], target: [-4.5, 1.7, 2.0] },
  },
}
VIEWS.about = VIEWS.home
VIEWS.contact = VIEWS.home

const DRAG_THRESHOLD_PX = 6
const RAD_PER_PX = 0.006
const FRICTION = 0.92 // momentum kept per 60fps frame after letting go
const MAX_SPIN = 0.08 // radians per frame, so a fast flick can't spin wildly
const offset = new THREE.Vector3()
const spherical = new THREE.Spherical()

// Drag / swipe turns around the cafe (with a little momentum), wheel and pinch zoom.
function useOrbitInput(dom) {
  useEffect(() => {
    const pointers = new Map()
    let startX = 0
    let startY = 0
    let lastPinch = 0
    let velocity = { yaw: 0, pitch: 0 }
    let momentum = 0
    let lastTime = 0
    let resetsAtRelease = 0
    const capped = (v) => Math.max(-MAX_SPIN, Math.min(MAX_SPIN, v))
    const active = () => {
      const { view, openProjectId } = useStore.getState()
      return view === 'home' && !openProjectId
    }
    const glide = (time) => {
      const store = useStore.getState()
      if (!active() || store.orbitResets !== resetsAtRelease) return
      const frames = lastTime ? Math.min((time - lastTime) / 16.7, 4) : 1
      lastTime = time
      const decay = FRICTION ** frames
      velocity.yaw *= decay
      velocity.pitch *= decay
      if (Math.abs(velocity.yaw) + Math.abs(velocity.pitch) < 0.0005) return
      store.turn(velocity.yaw * frames, velocity.pitch * frames)
      momentum = requestAnimationFrame(glide)
    }

    const onDown = (e) => {
      cancelAnimationFrame(momentum)
      velocity = { yaw: 0, pitch: 0 }
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
      startX = e.clientX
      startY = e.clientY
      lastPinch = 0
      useStore.getState().setDragMoved(false)
    }
    const onMove = (e) => {
      const prev = pointers.get(e.pointerId)
      if (!prev || !active()) return
      const store = useStore.getState()
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()]
        const dist = Math.hypot(a.x - b.x, a.y - b.y)
        if (lastPinch) store.zoomBy(lastPinch / dist)
        lastPinch = dist
        store.setDragMoved(true)
        return
      }
      if (!store.dragMoved && Math.hypot(e.clientX - startX, e.clientY - startY) < DRAG_THRESHOLD_PX) return
      store.setDragMoved(true)
      const dYaw = -(e.clientX - prev.x) * RAD_PER_PX
      const dPitch = -(e.clientY - prev.y) * RAD_PER_PX
      velocity = { yaw: capped(dYaw), pitch: capped(dPitch) }
      store.turn(dYaw, dPitch)
    }
    const onUp = (e) => {
      if (!pointers.delete(e.pointerId)) return
      if (pointers.size === 0 && useStore.getState().dragMoved && !prefersReducedMotion) {
        resetsAtRelease = useStore.getState().orbitResets
        lastTime = 0
        momentum = requestAnimationFrame(glide)
      }
    }
    const onWheel = (e) => {
      if (!active()) return
      e.preventDefault()
      const store = useStore.getState()
      // sideways trackpad scroll turns; vertical scroll and pinch (ctrlKey) zoom
      if (!e.ctrlKey && Math.abs(e.deltaX) > Math.abs(e.deltaY)) store.turn(e.deltaX * 0.003)
      else store.zoomBy(Math.exp(e.deltaY * (e.ctrlKey ? 0.01 : 0.0015)))
    }
    const onKey = (e) => {
      if (!active() || e.target.closest?.('input, textarea')) return
      const store = useStore.getState()
      if (e.key === 'ArrowLeft') store.turn(-0.2)
      else if (e.key === 'ArrowRight') store.turn(0.2)
      else if (e.key === 'ArrowUp') store.turn(0, -0.1)
      else if (e.key === 'ArrowDown') store.turn(0, 0.1)
      else if (e.key === '+' || e.key === '=') store.zoomBy(0.85)
      else if (e.key === '-') store.zoomBy(1 / 0.85)
    }

    dom.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    dom.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(momentum)
      dom.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      dom.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
    }
  }, [dom])
}

export default function CameraRig() {
  const view = useStore((s) => s.view)
  const { camera, size, gl } = useThree()
  const target = useRef(new THREE.Vector3(...VIEWS.home.target))
  const goalPos = useRef(new THREE.Vector3())
  const goalTarget = useRef(new THREE.Vector3())
  // orbit as currently shown; eases toward the store's values
  const shown = useRef({ yaw: 0, pitch: 0, zoom: 1 })
  const settled = useRef(false)
  useOrbitInput(gl.domElement)

  useEffect(() => {
    settled.current = false
  }, [view])

  useFrame((_, dt) => {
    const base = VIEWS[view] ?? VIEWS.home
    const v = size.width / size.height < 0.9 ? base.portrait : base
    goalTarget.current.set(...v.target)
    goalPos.current.set(...v.pos)

    if (base === VIEWS.home) {
      const { orbit } = useStore.getState()
      const s = shown.current
      const ease = prefersReducedMotion ? 1 : 1 - Math.exp(-dt * 8)
      s.yaw += (orbit.yaw - s.yaw) * ease
      s.pitch += (orbit.pitch - s.pitch) * ease
      s.zoom += (orbit.zoom - s.zoom) * ease
      offset.subVectors(goalPos.current, goalTarget.current)
      spherical.setFromVector3(offset)
      spherical.theta += s.yaw
      spherical.phi += s.pitch
      spherical.radius *= s.zoom
      goalPos.current.copy(goalTarget.current).add(offset.setFromSpherical(spherical))
    }

    if (settled.current && base === VIEWS.home) {
      // orbiting: follow the eased sphere exactly so the camera circles the cafe
      // instead of cutting a straight line through it
      camera.position.copy(goalPos.current)
      target.current.copy(goalTarget.current)
    } else {
      const k = prefersReducedMotion ? 1 : 1 - Math.exp(-dt * 2.2)
      camera.position.lerp(goalPos.current, k)
      target.current.lerp(goalTarget.current, k)
      if (camera.position.distanceTo(goalPos.current) < 0.05) settled.current = true
    }
    camera.lookAt(target.current)
  })
  return null
}
