import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Box, Cyl, Sphere, C, glassMat } from './parts'
import { clockFaceTexture, floorTexture, kissatenPaintingTexture } from '../lib/canvasTextures'
import { lighting } from '../lib/timeOfDay'

// Room footprint: x -5..5, z -4..4. Back wall at z=-4, left wall at x=-5.
// A sidewalk strip in front (z 4..6.4) holds the menu board.

function Floor() {
  const tex = useMemo(() => {
    const t = floorTexture()
    t.repeat.set(10 / 0.7, 8 / 0.7)
    return t
  }, [])
  return (
    <group>
      {/* base slab */}
      <Box size={[10.4, 0.39, 8.4]} position={[-0.2, -0.205, -0.2]} color={C.base} />
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 8]} />
        <meshStandardMaterial map={tex} roughness={0.9} />
      </mesh>
      {/* sidewalk */}
      <Box size={[10.4, 0.3, 2.4]} position={[-0.2, -0.25, 5.4]} color="#8d8780" />
      <Box size={[10.4, 0.08, 0.2]} position={[-0.2, -0.06, 4.3]} color="#6f6a64" />
    </group>
  )
}

// Hides its contents while the camera is on the outside of a wall, so the
// room stays open like a dollhouse from every side.
function HideFromOutside({ point, normal, children }) {
  const ref = useRef()
  const p = useMemo(() => new THREE.Vector3(...point), [point])
  const n = useMemo(() => new THREE.Vector3(...normal), [normal])
  const toCamera = useMemo(() => new THREE.Vector3(), [])
  useFrame(({ camera }) => {
    if (ref.current) ref.current.visible = toCamera.subVectors(camera.position, p).dot(n) > 0
  })
  return <group ref={ref}>{children}</group>
}

function BackWall() {
  return (
    <HideFromOutside point={[0, 0, -4.2]} normal={[0, 0, 1]}>
      <Box size={[10.4, 4, 0.2]} position={[-0.2, 2, -4.1]} color={C.wallCream} />
      <Box size={[10.44, 1.3, 0.26]} position={[-0.2, 0.65, -4.08]} color={C.wallRose} />
      <Box size={[10.48, 0.1, 0.32]} position={[-0.2, 1.33, -4.06]} color={C.trim} />
      <Box size={[10.52, 0.18, 0.34]} position={[-0.2, 4.0, -4.06]} color={C.trim} />
      <Box size={[0.32, 4.2, 0.42]} position={[5.0, 2.1, -4.06]} color={C.trim} />
      <Box size={[0.5, 4.2, 0.46]} position={[-5.22, 2.1, -4.08]} color={C.trim} />
      <Window position={[-2.2, 2.45, -3.98]} />
      <Clock position={[0.1, 3.0, -3.95]} />
    </HideFromOutside>
  )
}

function LeftWall() {
  return (
    <HideFromOutside point={[-5.2, 0, 0]} normal={[1, 0, 0]}>
      <Box size={[0.2, 4, 8.2]} position={[-5.1, 2, 0]} color={C.wallCream} />
      <Box size={[0.26, 1.3, 8.16]} position={[-5.08, 0.65, 0]} color={C.wallRose} />
      <Box size={[0.32, 0.1, 8.12]} position={[-5.06, 1.33, 0]} color={C.trim} />
      <Box size={[0.34, 0.18, 8.08]} position={[-5.06, 4.0, 0]} color={C.trim} />
      <Box size={[0.42, 4.2, 0.32]} position={[-5.06, 2.1, 4.1]} color={C.trim} />
      <Poster position={[-4.95, 2.5, -1.6]} rotation={[0, Math.PI / 2, 0]} />
    </HideFromOutside>
  )
}

// Dark floor the cafe stands on; the fog fades it out into the background.
function Ground() {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -0.41, 1]} receiveShadow>
      <circleGeometry args={[60, 64]} />
      <meshStandardMaterial color="#2b231f" roughness={1} />
    </mesh>
  )
}

// Glowing materials that follow the time of day, shared by every window and lamp.
const windowGlass = new THREE.MeshStandardMaterial({ color: '#fff6dc', roughness: 0.75, emissive: '#ffe9b0', emissiveIntensity: 0.9 })
const lampShade = new THREE.MeshStandardMaterial({ color: '#e6a23c', roughness: 0.7, emissive: '#d9822b', emissiveIntensity: 0.6, side: 2 })
const lampBulb = new THREE.MeshStandardMaterial({ color: '#fff3d0', roughness: 0.6, emissive: '#ffe2a0', emissiveIntensity: 2 })

function Window({ position }) {
  return (
    <group position={position}>
      <Box size={[2.2, 1.6, 0.12]} color={C.woodDark} />
      <Box size={[2.0, 1.4, 0.05]} position={[0, 0, 0.05]} material={windowGlass} />
      <Box size={[0.06, 1.4, 0.08]} position={[0, 0, 0.08]} color={C.woodDark} />
      <Box size={[2.0, 0.06, 0.08]} position={[0, 0.2, 0.08]} color={C.woodDark} />
      {/* curtains */}
      <Box size={[0.55, 1.5, 0.08]} radius={0.03} position={[-0.85, 0.02, 0.14]} color="#fbf7ee" />
      <Box size={[0.55, 1.5, 0.08]} radius={0.03} position={[0.85, 0.02, 0.14]} color="#fbf7ee" />
      <Box size={[2.4, 0.2, 0.12]} radius={0.04} position={[0, 0.82, 0.14]} color="#fbf7ee" />
      {/* sill */}
      <Box size={[2.3, 0.08, 0.3]} position={[0, -0.84, 0.12]} color={C.woodLight} />
    </group>
  )
}

// Regulator wall clock: hands follow the visitor's real local time and the
// brass pendulum ticks once a second behind the glass.
function Clock({ position }) {
  const face = useMemo(() => clockFaceTexture(), [])
  const hour = useRef()
  const minute = useRef()
  const pendulum = useRef()
  useFrame(({ clock }) => {
    const now = new Date()
    const m = now.getMinutes() + now.getSeconds() / 60
    minute.current.rotation.z = -(m / 60) * Math.PI * 2
    hour.current.rotation.z = -(((now.getHours() % 12) + m / 60) / 12) * Math.PI * 2
    pendulum.current.rotation.z = Math.sin(clock.elapsedTime * Math.PI) * 0.12
  })
  return (
    <group position={position}>
      {/* round head */}
      <Cyl args={[0.34, 0.34, 0.1, 40]} rotation-x={Math.PI / 2} color={C.woodDark} />
      <mesh position={[0, 0, 0.052]}>
        <torusGeometry args={[0.285, 0.014, 10, 48]} />
        <meshStandardMaterial color="#d4a54a" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.051]}>
        <circleGeometry args={[0.28, 48]} />
        <meshStandardMaterial map={face} roughness={0.6} />
      </mesh>
      <group ref={hour} position={[0, 0, 0.058]}>
        <Box size={[0.026, 0.15, 0.008]} position={[0, 0.06, 0]} color="#2a211b" />
      </group>
      <group ref={minute} position={[0, 0, 0.064]}>
        <Box size={[0.016, 0.23, 0.008]} position={[0, 0.095, 0]} color="#2a211b" />
      </group>
      <Cyl args={[0.018, 0.018, 0.02, 12]} rotation-x={Math.PI / 2} position={[0, 0, 0.068]} color="#d4a54a" mat={{ metalness: 0.7, roughness: 0.3 }} />
      {/* pendulum case */}
      <Box size={[0.3, 0.62, 0.09]} radius={0.02} position={[0, -0.6, -0.01]} color={C.woodDark} />
      <Box size={[0.22, 0.5, 0.01]} position={[0, -0.61, 0.03]} color="#3a2416" />
      <group ref={pendulum} position={[0, -0.38, 0.042]}>
        <Box size={[0.012, 0.32, 0.006]} position={[0, -0.16, 0]} color="#d4a54a" mat={{ metalness: 0.7, roughness: 0.3 }} />
        <Cyl args={[0.055, 0.055, 0.012, 24]} rotation-x={Math.PI / 2} position={[0, -0.33, 0]} color="#d4a54a" mat={{ metalness: 0.75, roughness: 0.25 }} />
      </group>
      <Box size={[0.22, 0.5, 0.01]} position={[0, -0.61, 0.055]} mat={glassMat} />
      <Box size={[0.34, 0.05, 0.11]} position={[0, -0.93, 0]} color={C.woodDark} />
    </group>
  )
}

function PendantLamp({ position }) {
  const [x, y, z] = position
  const light = useRef()
  useFrame(() => {
    const l = lighting()
    light.current.intensity = l.lamp
    light.current.color.copy(l.lampColor)
  })
  return (
    <group position={[x, 0, z]}>
      <Cyl args={[0.01, 0.01, 4 - y, 6]} position={[0, (4 + y) / 2, 0]} color="#222" />
      {/* stained-glass shade */}
      <Cyl args={[0.08, 0.42, 0.34, 8, 1, true]} position={[0, y, 0]} material={lampShade} />
      <Cyl args={[0.08, 0.08, 0.06, 8]} position={[0, y + 0.2, 0]} color="#3d2a1c" />
      <Sphere r={0.1} position={[0, y - 0.12, 0]} material={lampBulb} />
      <pointLight ref={light} position={[0, y - 0.3, 0]} intensity={4} distance={5.5} decay={1.6} color="#ffcf8a" />
    </group>
  )
}

// Framed painting of a little kissaten storefront.
function Poster({ position, rotation }) {
  const painting = useMemo(() => kissatenPaintingTexture(), [])
  return (
    <group position={position} rotation={rotation}>
      <Box size={[0.92, 1.12, 0.07]} radius={0.015} color={C.woodDark} />
      <Box size={[0.8, 1.0, 0.02]} position={[0, 0, 0.035]} color="#f4e9d3" />
      <mesh position={[0, 0, 0.047]}>
        <planeGeometry args={[0.66, 0.836]} />
        <meshStandardMaterial map={painting} roughness={0.8} />
      </mesh>
    </group>
  )
}

export default function Cafe() {
  useFrame(() => {
    const l = lighting()
    windowGlass.color.copy(l.windowColor)
    windowGlass.emissive.copy(l.windowColor)
    windowGlass.emissiveIntensity = l.windowGlow
    lampShade.emissiveIntensity = 0.6 * l.lampGlow
    lampBulb.emissiveIntensity = 2 * l.lampGlow
  })
  return (
    <group>
      <Ground />
      <Floor />
      <BackWall />
      <LeftWall />
      <PendantLamp position={[-1.6, 2.7, -1.0]} />
      <PendantLamp position={[1.9, 2.7, 1.4]} />
    </group>
  )
}
