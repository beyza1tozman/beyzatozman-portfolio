import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useCursor } from '@react-three/drei'
import { useStore } from '../store'
import { chalkboardTexture } from '../lib/canvasTextures'
import { lighting } from '../lib/timeOfDay'
import { Box, Sphere } from './parts'

const TEX_W = 512
const TEX_H = 700
const FACE_W = 1.32
const FACE_H = (FACE_W * TEX_H) / TEX_W
const FRAME = '#6e4226'
const LEG = 0.25 // posts reach below the board
const CAP = 0.12 // and stick up above it
const POST_H = LEG + FACE_H + CAP
const BOARD_Y = LEG + FACE_H / 2

// Layout in texture pixels: [x, y, width, height]
export const MENU_ITEMS = [
  { id: 'projects', label: 'Projects', price: '6 dishes', rect: [40, 150, 432, 82] },
  { id: 'about', label: 'About Me', price: 'a cup', rect: [40, 236, 432, 82] },
  { id: 'contact', label: 'Contact', price: 'say hi', rect: [40, 322, 432, 82] },
  { id: 'blog', label: 'Blog', price: 'fresh ↗', rect: [40, 408, 432, 82], href: 'https://beyzatozman.netlify.app' },
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
  const [x, y, w, h] = item.rect
  const width = (w / TEX_W) * FACE_W
  const height = (h / TEX_H) * FACE_H
  const cx = ((x + w / 2) / TEX_W) * FACE_W - FACE_W / 2
  return (
    <group position={[cx, toLocalY(y + h / 2), 0.006]}>
      <mesh
        ref={glow}
        onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation()
          if (!useStore.getState().dragMoved) chooseMenuItem(item)
        }}
      >
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color="#f2e6cc" transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}

// Wooden frame: two posts with round knobs, top and bottom rails around the board.
function Frame({ children }) {
  const px = FACE_W / 2 + 0.04
  const railY = FACE_H / 2 + 0.035
  return (
    <group>
      {[-px, px].map((x) => (
        <group key={x} position-x={x}>
          <Box size={[0.08, POST_H, 0.07]} position={[0, POST_H / 2, 0]} color={FRAME} />
          <Sphere r={0.05} position={[0, POST_H + 0.02, 0]} color={FRAME} />
        </group>
      ))}
      <group position-y={BOARD_Y}>
        <Box size={[FACE_W + 0.08, 0.07, 0.06]} position={[0, railY, 0]} color={FRAME} />
        <Box size={[FACE_W + 0.08, 0.07, 0.06]} position={[0, -railY, 0]} color={FRAME} />
        <Box size={[FACE_W, FACE_H, 0.03]} color="#1c221f" />
        {children}
      </group>
    </group>
  )
}

// Wooden A-frame sandwich board with a dark chalkboard menu.
export default function MenuBoard(props) {
  const tex = useMemo(() => chalkboardTexture(MENU_ITEMS, TEX_W, TEX_H), [])
  // After dark the board is lit like a shop sign so the menu stays readable.
  const face = useRef()
  const lamp = useRef()
  useFrame(() => {
    const l = lighting()
    face.current.emissiveIntensity = l.menuGlow
    lamp.current.intensity = l.menuLamp
  })
  // lean angle; z offset puts both post tops together at the hinge
  const lean = 0.2
  const z = Math.sin(lean) * POST_H
  return (
    <group {...props}>
      {/* back leg */}
      <group rotation-x={lean} position={[0, 0, -z]}>
        <Frame />
      </group>
      {/* front board, leaning back */}
      <group rotation-x={-lean} position={[0, 0, z]}>
        <Frame>
          <mesh position={[0, 0, 0.016]}>
            <planeGeometry args={[FACE_W, FACE_H]} />
            <meshStandardMaterial ref={face} map={tex} emissiveMap={tex} emissive="#ffffff" emissiveIntensity={0} roughness={0.95} />
          </mesh>
          <group position={[0, 0, 0.018]}>
            {MENU_ITEMS.map((item) => (
              <Hotspot key={item.id} item={item} />
            ))}
          </group>
        </Frame>
        <pointLight ref={lamp} position={[0, BOARD_Y + 0.5, 0.9]} intensity={0} distance={3} decay={1.6} color="#ffcf8a" />
      </group>
    </group>
  )
}
