import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useCursor } from '@react-three/drei'
import { useStore, prefersReducedMotion } from '../store'
import { projectCardTexture, priceTagTexture } from '../lib/canvasTextures'
import { FOOD_COMPONENTS } from './foods/Foods'

const CARD_W = 0.62
const CARD_H = 0.72

// A fake-food sample that flips like a card on hover, revealing a cardboard
// summary card on its back. Local front is +z.
export default function FoodItem({ project, position }) {
  const flip = useRef()
  const view = useStore((s) => s.view)
  const flipped = useStore((s) => s.hoveredId === project.id)
  const active = view === 'projects'
  useCursor(flipped)

  const cardTex = useMemo(() => projectCardTexture(project), [project])
  const tagTex = useMemo(() => priceTagTexture(project), [project])
  const Food = FOOD_COMPONENTS[project.food]

  useFrame((state, dt) => {
    if (!flip.current) return
    const target = flipped ? Math.PI : 0
    const k = prefersReducedMotion ? 1 : 1 - Math.exp(-dt * 7)
    flip.current.rotation.y += (target - flip.current.rotation.y) * k
    // tiny lift while flipped, like picking the card up
    const lift = flipped ? 0.05 : 0
    flip.current.position.y += (lift - flip.current.position.y) * k
  })

  const handlers = {
    onPointerOver: (e) => {
      if (!active) return
      e.stopPropagation()
      useStore.getState().setHovered(project.id)
    },
    onPointerOut: () => {
      const { hoveredId, setHovered } = useStore.getState()
      if (hoveredId === project.id) setHovered(null)
    },
    onClick: (e) => {
      e.stopPropagation()
      const { view, setView, hoveredId, setHovered, openProject, dragMoved } = useStore.getState()
      if (dragMoved) return
      if (view !== 'projects') return setView('projects')
      // on touch, first tap flips, second tap opens
      if (e.pointerType === 'touch' && hoveredId !== project.id) return setHovered(project.id)
      openProject(project.id)
    },
  }

  return (
    <group position={position}>
      {/* invisible hit box so the small food is easy to hover */}
      <mesh position={[0, CARD_H / 2, 0]} {...handlers}>
        <boxGeometry args={[CARD_W, CARD_H, 0.62]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <group ref={flip}>
        <group scale={1.25}>
          <Food />
        </group>
        {/* cardboard summary on the back */}
        <mesh position={[0, CARD_H / 2, -0.29]} rotation-y={Math.PI} castShadow>
          <boxGeometry args={[CARD_W, CARD_H, 0.015]} />
          <meshStandardMaterial attach="material-0" color="#b8915e" />
          <meshStandardMaterial attach="material-1" color="#b8915e" />
          <meshStandardMaterial attach="material-2" color="#b8915e" />
          <meshStandardMaterial attach="material-3" color="#b8915e" />
          <meshStandardMaterial attach="material-4" map={cardTex} roughness={0.9} />
          <meshStandardMaterial attach="material-5" color="#c9a26f" roughness={0.9} />
        </mesh>
      </group>

      {/* price tag on the shelf edge */}
      <mesh position={[0, 0.05, 0.36]} rotation-x={-0.35}>
        <planeGeometry args={[0.36, 0.135]} />
        <meshStandardMaterial map={tagTex} roughness={0.9} />
      </mesh>
    </group>
  )
}
