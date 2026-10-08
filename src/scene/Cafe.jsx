import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Box, Cyl, Sphere, C } from './parts'
import { floorTexture } from '../lib/canvasTextures'

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
      <Box size={[10.4, 0.4, 8.4]} position={[-0.2, -0.2, -0.2]} color={C.base} />
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.001, 0]} receiveShadow>
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
      <Box size={[10.4, 1.3, 0.26]} position={[-0.2, 0.65, -4.08]} color={C.wallRose} />
      <Box size={[10.4, 0.1, 0.32]} position={[-0.2, 1.33, -4.06]} color={C.trim} />
      <Box size={[10.4, 0.18, 0.34]} position={[-0.2, 4.0, -4.06]} color={C.trim} />
      <Box size={[0.3, 4.2, 0.3]} position={[5.0, 2.1, -4.1]} color={C.trim} />
      <Window position={[-2.2, 2.45, -3.98]} />
      <Clock position={[0.1, 3.0, -3.95]} />
    </HideFromOutside>
  )
}

function LeftWall() {
  return (
    <HideFromOutside point={[-5.2, 0, 0]} normal={[1, 0, 0]}>
      <Box size={[0.2, 4, 8.2]} position={[-5.1, 2, 0]} color={C.wallCream} />
      <Box size={[0.26, 1.3, 8.2]} position={[-5.08, 0.65, 0]} color={C.wallRose} />
      <Box size={[0.32, 0.1, 8.2]} position={[-5.06, 1.33, 0]} color={C.trim} />
      <Box size={[0.34, 0.18, 8.2]} position={[-5.06, 4.0, 0]} color={C.trim} />
      <Box size={[0.3, 4.2, 0.3]} position={[-5.1, 2.1, 4.1]} color={C.trim} />
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

function Window({ position }) {
  return (
    <group position={position}>
      <Box size={[2.2, 1.6, 0.12]} color={C.woodDark} />
      <Box size={[2.0, 1.4, 0.05]} position={[0, 0, 0.05]} color="#fff6dc" mat={{ emissive: '#ffe9b0', emissiveIntensity: 0.9 }} />
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

function Clock({ position }) {
  const minute = useRef()
  useFrame((_, dt) => {
    if (minute.current) minute.current.rotation.z -= dt * 0.05
  })
  return (
    <group position={position}>
      <Cyl args={[0.36, 0.36, 0.08, 32]} rotation-x={Math.PI / 2} color={C.woodDark} />
      <Cyl args={[0.3, 0.3, 0.1, 32]} rotation-x={Math.PI / 2} color="#fbf3dc" />
      <Box size={[0.03, 0.2, 0.02]} position={[0, 0.08, 0.06]} color="#222" />
      <group ref={minute} position={[0, 0, 0.07]}>
        <Box size={[0.02, 0.26, 0.02]} position={[0, 0.11, 0]} color="#222" />
      </group>
      {/* pendulum case */}
      <Box size={[0.34, 0.6, 0.08]} position={[0, -0.62, 0]} color={C.woodDark} />
      <Cyl args={[0.08, 0.08, 0.04, 20]} rotation-x={Math.PI / 2} position={[0, -0.7, 0.05]} color="#d4a54a" mat={{ metalness: 0.6, roughness: 0.3 }} />
    </group>
  )
}

function PendantLamp({ position }) {
  const [x, y, z] = position
  return (
    <group position={[x, 0, z]}>
      <Cyl args={[0.01, 0.01, 4 - y, 6]} position={[0, (4 + y) / 2, 0]} color="#222" />
      {/* stained-glass shade */}
      <Cyl args={[0.08, 0.42, 0.34, 8, 1, true]} position={[0, y, 0]} color="#e6a23c" mat={{ emissive: '#d9822b', emissiveIntensity: 0.6, side: 2 }} />
      <Cyl args={[0.08, 0.08, 0.06, 8]} position={[0, y + 0.2, 0]} color="#3d2a1c" />
      <Sphere r={0.1} position={[0, y - 0.12, 0]} color="#fff3d0" mat={{ emissive: '#ffe2a0', emissiveIntensity: 2 }} />
      <pointLight position={[0, y - 0.3, 0]} intensity={4} distance={4.5} decay={1.6} color="#ffcf8a" />
    </group>
  )
}

function Poster({ position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      <Box size={[0.9, 1.15, 0.06]} color={C.woodDark} />
      <Box size={[0.76, 1.0, 0.03]} position={[0, 0, 0.03]} color="#e8c27a" />
      <Sphere r={0.18} position={[0, 0.1, 0.05]} color="#c8423b" />
      <Box size={[0.5, 0.06, 0.02]} position={[0, -0.28, 0.05]} color="#3d2a1c" />
    </group>
  )
}

export default function Cafe() {
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
