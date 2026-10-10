import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../store'
import { projects } from '../data/projects'
import { textSignTexture } from '../lib/canvasTextures'
import { lighting } from '../lib/timeOfDay'
import { Box, Cyl, C, glassMat } from './parts'
import FoodItem from './FoodItem'

const RED = '#b8382f'
const W = 2.8 // width along local x
const D = 0.95 // depth along local z (front is +z)
const BASE_H = 0.72
const SHELF_2 = 1.6
const TOP = 2.48

// Shokuhin-sampuru display case: each fake dish is a project.
export const CABINET_POSITION = [-4.5, 0, 2.0]

// three dishes per shelf, in reading order: Nos. 1-3 above, 4-6 below
const SLOTS = [SHELF_2 + 0.03, BASE_H + 0.05].flatMap((y) => [-0.9, 0, 0.9].map((x) => [x, y, 0]))

function Awning() {
  const scallops = 7
  const step = 3.0 / scallops
  return (
    <group position={[0, TOP + 0.62, D / 2 + 0.1]}>
      <Box size={[3.0, 0.05, 0.75]} rotation-x={0.55} color={C.teal} />
      {Array.from({ length: scallops }, (_, i) => (
        <Cyl
          key={i}
          args={[step / 2, step / 2, 0.05, 16, 1, false, -Math.PI / 2, Math.PI]}
          rotation-x={Math.PI / 2}
          position={[-1.5 + step / 2 + i * step, -0.19, 0.33]}
          color={C.teal}
        />
      ))}
    </group>
  )
}

export default function Cabinet() {
  const sign = useMemo(() => textSignTexture('MENU', { bg: '#1f2a2a', fg: '#f4e9d3', font: '72px "Single Day"' }), [])
  const setView = useStore((s) => s.setView)
  const lights = useRef([])
  useFrame(() => {
    // spread over three lights per shelf
    const intensity = lighting().cabinet * 0.4
    for (const light of lights.current) light.intensity = intensity
  })

  return (
    <group
      position={CABINET_POSITION}
      rotation-y={Math.PI / 2}
      onClick={(e) => {
        const { view, dragMoved } = useStore.getState()
        if (view === 'projects' || dragMoved) return
        e.stopPropagation()
        setView('projects')
      }}
    >
      {/* brick base */}
      <Box size={[W, BASE_H, D]} position={[0, BASE_H / 2, 0]} color="#4a3530" />
      {[0.18, 0.36, 0.54].map((y) => (
        <Box key={y} size={[W + 0.01, 0.015, D + 0.01]} position={[0, y, 0]} color="#2c1f1b" />
      ))}

      {/* back + shelves */}
      <Box size={[W, TOP - BASE_H, 0.04]} position={[0, (TOP + BASE_H) / 2, -D / 2 + 0.02]} color="#f3e3c3" />
      <Box size={[W - 0.08, 0.04, D - 0.04]} position={[0, SHELF_2, 0]} color={C.woodLight} />

      {/* red frame */}
      {[-W / 2, W / 2].map((x) =>
        [-D / 2, D / 2].map((z) => (
          <Box key={`${x}${z}`} size={[0.07, TOP - BASE_H, 0.07]} position={[x, (TOP + BASE_H) / 2, z]} color={RED} />
        ))
      )}
      <Box size={[W + 0.12, 0.08, D + 0.1]} position={[0, BASE_H, 0]} color={RED} />
      <Box size={[W + 0.2, 0.14, D + 0.14]} position={[0, TOP, 0]} color={RED} />

      {/* glass */}
      <mesh position={[0, (TOP + BASE_H) / 2, D / 2]} renderOrder={2}>
        <planeGeometry args={[W, TOP - BASE_H]} />
        <meshStandardMaterial {...glassMat} />
      </mesh>
      {[-W / 2, W / 2].map((x) => (
        <mesh key={x} position={[x, (TOP + BASE_H) / 2, 0]} rotation-y={Math.PI / 2} renderOrder={2}>
          <planeGeometry args={[D, TOP - BASE_H]} />
          <meshStandardMaterial {...glassMat} side={2} />
        </mesh>
      ))}

      {/* MENU sign + awning */}
      <Box size={[W, 0.42, 0.1]} position={[0, TOP + 0.28, D / 2 - 0.05]} color={RED} />
      <mesh position={[0, TOP + 0.28, D / 2 + 0.006]}>
        <planeGeometry args={[1.5, 0.3]} />
        <meshStandardMaterial map={sign} />
      </mesh>
      <Awning />

      {/* a small warm light above each dish, just outside the glass: far enough
          that the flipped card and the price tag are lit evenly, without glare */}
      {SLOTS.map(([x], i) => (
        <pointLight
          key={i}
          ref={(el) => (lights.current[i] = el)}
          position={[x, i < 3 ? TOP - 0.15 : SHELF_2 - 0.15, 0.95]}
          intensity={0.7}
          distance={2.2}
          decay={1.5}
          color="#ffe2b0"
        />
      ))}

      {projects.map((p, i) => (
        <FoodItem key={p.id} project={p} position={SLOTS[i]} />
      ))}
    </group>
  )
}
