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
const YAW_PER_PX = 0.005
const offset = new THREE.Vector3()
const spherical = new THREE.Spherical()

// Visitors can turn around the cafe and zoom on the overview. Everything else
// stays the same, so the orbit is applied on top of the home viewpoint.
function useOrbitInput(dom) {
  useEffect(() => {
    const pointers = new Map()
    let startX = 0
    let lastPinch = 0
    const active = () => {
      const { view, openProjectId } = useStore.getState()
      return view === 'home' && !openProjectId
    }

    const onDown = (e) => {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
      startX = e.clientX
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
      if (!store.dragMoved && Math.abs(e.clientX - startX) < DRAG_THRESHOLD_PX) return
      store.setDragMoved(true)
      store.turn(-(e.clientX - prev.x) * YAW_PER_PX)
    }
    const onUp = (e) => pointers.delete(e.pointerId)
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
      if (e.key === 'ArrowLeft') store.turn(-0.15)
      else if (e.key === 'ArrowRight') store.turn(0.15)
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
  const orbit = useStore((s) => s.orbit)
  const { camera, size, gl } = useThree()
  const target = useRef(new THREE.Vector3(...VIEWS.home.target))
  const goalPos = useRef(new THREE.Vector3())
  const goalTarget = useRef(new THREE.Vector3())
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
      offset.subVectors(goalPos.current, goalTarget.current)
      spherical.setFromVector3(offset)
      spherical.theta += orbit.yaw
      spherical.radius *= orbit.zoom
      goalPos.current.copy(goalTarget.current).add(offset.setFromSpherical(spherical))
    }
    // slow, smooth flights between views; snappier response while orbiting
    const speed = settled.current ? 7 : 2.2
    const k = prefersReducedMotion ? 1 : 1 - Math.exp(-dt * speed)
    camera.position.lerp(goalPos.current, k)
    target.current.lerp(goalTarget.current, k)
    camera.lookAt(target.current)
    if (!settled.current && camera.position.distanceTo(goalPos.current) < 0.05) settled.current = true
  })
  return null
}
