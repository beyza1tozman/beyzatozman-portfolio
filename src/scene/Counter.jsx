import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Cyl, C, glassMat } from './parts'
import { lighting } from '../lib/timeOfDay'
import { BeanJar, CoffeeCup, CoffeeTin, GooseneckKettle, PourOver, Teapot } from './Tableware'

function Stool({ position }) {
  return (
    <group position={position}>
      <Cyl args={[0.05, 0.05, 0.75, 10]} position={[0, 0.38, 0]} color={C.woodDark} />
      <Cyl args={[0.22, 0.26, 0.04, 20]} position={[0, 0.02, 0]} color={C.woodDark} />
      <Cyl args={[0.26, 0.24, 0.12, 24]} position={[0, 0.8, 0]} color={C.boothRed} />
      <Cyl args={[0.22, 0.22, 0.03, 20]} position={[0, 0.45, 0]} color={C.woodDark} />
    </group>
  )
}

function BackCupboard() {
  // glass-front cupboard against the back wall, like the Leblanc shelves
  return (
    <group position={[2.9, 0, -3.72]}>
      <Box size={[3.4, 1.0, 0.55]} position={[0, 0.5, 0]} color={C.wood} />
      <Box size={[3.5, 0.06, 0.6]} position={[0, 1.03, 0]} color={C.woodLight} />
      <Box size={[3.4, 1.5, 0.1]} position={[0, 2.15, -0.2]} color={C.woodDark} />
      <Box size={[3.5, 0.1, 0.5]} position={[0, 2.95, -0.02]} color={C.woodDark} />
      {[-1.7, -0.55, 0.55, 1.7].map((x) => (
        <Box key={x} size={[0.08, 1.5, 0.45]} position={[x, 2.15, -0.02]} color={C.woodDark} />
      ))}
      {[-1.1, 0, 1.1].map((x, i) => (
        <group key={x} position={[x, 2.15, 0.16]}>
          <Box size={[1.0, 1.36, 0.04]} mat={glassMat} />
          {/* shelf boards */}
          <Box size={[1.02, 0.03, 0.32]} position={[0, -0.66, -0.15]} color={C.woodLight} />
          <Box size={[1.02, 0.03, 0.32]} position={[0, 0.02, -0.15]} color={C.woodLight} />
          {/* upper shelf: bean jars, teapot & cups, coffee tins */}
          <group position={[0, 0.035, -0.15]}>
            {i === 0 && [[-0.3, 0.85], [0, 0.6], [0.3, 0.35]].map(([dx, fill]) => <BeanJar key={dx} position={[dx, 0, 0]} fill={fill} scale={1.6} />)}
            {i === 1 && (
              <>
                <Teapot position={[0, 0, -0.01]} rotation-y={1.0} scale={1.6} />
                <CoffeeCup position={[-0.34, 0, 0.02]} rotation-y={2.6} spoon={false} filled={false} scale={1.4} />
                <CoffeeCup position={[0.34, 0, 0.02]} rotation-y={-0.4} spoon={false} filled={false} scale={1.4} />
              </>
            )}
            {i === 2 && ['cream', 'teal', 'mustard'].map((c, j) => <CoffeeTin key={c} color={c} position={[(j - 1) * 0.3, 0, 0]} rotation-y={0.4 * j} scale={1.6} />)}
          </group>
          {/* plates leaning against the back on the bottom shelf */}
          {[-0.28, 0, 0.28].map((dx) => (
            <Cyl key={dx} args={[0.14, 0.14, 0.02, 24]} rotation-x={Math.PI / 2.4} position={[dx, -0.51, -0.2]} color="#fbf7ee" />
          ))}
        </group>
      ))}
    </group>
  )
}

export default function Counter() {
  const light = useRef()
  useFrame(() => {
    light.current.intensity = lighting().counter
  })
  return (
    <group>
      <BackCupboard />
      {/* warm light over the bar and the cupboard behind it */}
      <pointLight ref={light} position={[2.9, 2.6, -2.6]} intensity={1.2} distance={4.5} decay={1.5} color="#ffd29a" />
      {/* bar counter */}
      <group position={[2.8, 0, -1.9]}>
        <Box size={[3.6, 1.0, 0.6]} position={[0, 0.5, 0]} color={C.wallRose} />
        <Box size={[3.64, 0.1, 0.62]} position={[0, 0.55, 0.32]} color={C.trim} />
        <Box size={[3.9, 0.08, 0.9]} radius={0.03} position={[0, 1.04, 0.05]} color={C.woodLight} />
        <PourOver position={[-1.3, 1.08, -0.05]} rotation-y={0.5} />
        <PourOver position={[-0.95, 1.08, -0.1]} rotation-y={-0.3} />
        <GooseneckKettle position={[-0.5, 1.08, -0.05]} rotation-y={-0.4} />
        <CoffeeCup position={[0.2, 1.08, 0.2]} rotation-y={0.4} />
        <CoffeeCup position={[1.1, 1.08, 0.15]} rotation-y={-0.8} />
        {/* register */}
        <Box size={[0.4, 0.3, 0.32]} radius={0.04} position={[1.55, 1.24, -0.1]} color="#e8d27a" />
      </group>
      {[1.6, 2.6, 3.6].map((x) => (
        <Stool key={x} position={[x, 0, -1.05]} />
      ))}
    </group>
  )
}
