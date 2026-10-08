import { useRef } from 'react'
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

export default function CameraRig() {
  const view = useStore((s) => s.view)
  const { camera, size } = useThree()
  const target = useRef(new THREE.Vector3(...VIEWS.home.target))
  const goalPos = useRef(new THREE.Vector3())
  const goalTarget = useRef(new THREE.Vector3())

  useFrame((_, dt) => {
    const base = VIEWS[view] ?? VIEWS.home
    const v = size.width / size.height < 0.9 ? base.portrait : base
    goalPos.current.set(...v.pos)
    goalTarget.current.set(...v.target)
    const k = prefersReducedMotion ? 1 : 1 - Math.exp(-dt * 2.2)
    camera.position.lerp(goalPos.current, k)
    target.current.lerp(goalTarget.current, k)
    camera.lookAt(target.current)
  })
  return null
}
