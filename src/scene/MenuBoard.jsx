import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useCursor } from '@react-three/drei'
import { useStore } from '../store'
import { chalkboardTexture } from '../lib/canvasTextures'
import { Box, C } from './parts'

const TEX_W = 512
const TEX_H = 700
const FACE_W = 1.32
const FACE_H = (FACE_W * TEX_H) / TEX_W

export const MENU_ITEMS = [
  { id: 'projects', label: 'Projects', price: '4 dishes', y: 330 },
  { id: 'about', label: 'About Me', price: 'a cup', y: 410 },
  { id: 'contact', label: 'Contact', price: 'say hi', y: 490 },
  { id: 'blog', label: 'Blog', price: 'fresh ↗', y: 570, href: 'https://beyzatozman.netlify.app' },
]

export function chooseMenuItem(item) {
  if (item.href) window.open(item.href, '_blank', 'noopener')
  else useStore.getState().setView(item.id)
}

// texture y (px) -> local y on the board face
const toLocalY = (px) => FACE_H / 2 - (px / TEX_H) * FACE_H

function Hotspot({ item }) {
  const [hovered, setHovered] = useState(false)
  const glow = useRef()
  useCursor(hovered)
  useFrame((state) => {
    if (!glow.current) return
    glow.current.material.opacity = hovered ? 0.12 + Math.sin(state.clock.elapsedTime * 6) * 0.03 : 0
  })
  const y = toLocalY(item.y - 14)
  return (
    <group position={[0, y, 0.006]}>
      <mesh
        ref={glow}
        onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => (e.stopPropagation(), chooseMenuItem(item))}
      >
        <planeGeometry args={[FACE_W - 0.1, 0.16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0} depthWrite={false} />
      </mesh>
      {/* chalk underline */}
      <mesh position={[-0.3, -0.07, 0.001]} visible={hovered}>
        <planeGeometry args={[0.5, 0.012]} />
        <meshBasicMaterial color="#f3efe6" />
      </mesh>
    </group>
  )
}

// Wooden A-frame chalkboard standing on the sidewalk in front of the cafe.
export default function MenuBoard(props) {
  const tex = useMemo(() => chalkboardTexture(MENU_ITEMS, TEX_W, TEX_H), [])
  const frame = FACE_H + 0.16
  return (
    <group {...props}>
      {/* back leg */}
      <group rotation-x={0.2} position={[0, 0, -0.4]}>
        <Box size={[FACE_W + 0.16, frame, 0.05]} position={[0, frame / 2, -0.02]} color={C.wood} />
      </group>
      {/* front board, leaning back */}
      <group rotation-x={-0.2} position={[0, 0, 0.4]}>
        <group position={[0, frame / 2 + 0.02, 0]}>
          <Box size={[FACE_W + 0.16, frame, 0.06]} color={C.wood} />
          <mesh position={[0, 0, 0.031]}>
            <planeGeometry args={[FACE_W, FACE_H]} />
            <meshStandardMaterial map={tex} roughness={0.95} />
          </mesh>
          {/* chalk ledge */}
          <Box size={[FACE_W + 0.1, 0.04, 0.1]} position={[0, -FACE_H / 2 - 0.02, 0.06]} color={C.woodDark} />
          <Box size={[0.12, 0.025, 0.025]} position={[0.3, -FACE_H / 2 + 0.01, 0.08]} color="#f3efe6" />
          <group position={[0, 0, 0.032]}>
            {MENU_ITEMS.map((item) => (
              <Hotspot key={item.id} item={item} />
            ))}
          </group>
        </group>
      </group>
    </group>
  )
}
