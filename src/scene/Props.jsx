import { Box, Cyl, Sphere, C } from './parts'

function Plant({ position, scale = 1 }) {
  const leaves = [0, 1, 2, 3, 4, 5, 6]
  return (
    <group position={position} scale={scale}>
      <Cyl args={[0.24, 0.18, 0.42, 16]} position={[0, 0.21, 0]} color={C.pot} />
      <Cyl args={[0.22, 0.22, 0.02, 16]} position={[0, 0.41, 0]} color="#4a2e1c" />
      {leaves.map((i) => {
        const a = (i / leaves.length) * Math.PI * 2
        return (
          <mesh key={i} castShadow position={[Math.cos(a) * 0.18, 0.75 + (i % 2) * 0.15, Math.sin(a) * 0.18]} rotation={[Math.sin(a) * 0.6, a, Math.cos(a) * 0.6]}>
            <coneGeometry args={[0.12, 0.7, 4]} />
            <meshStandardMaterial color={i % 2 ? C.leaf : '#6aa35f'} roughness={0.8} flatShading />
          </mesh>
        )
      })}
    </group>
  )
}

function Fridge() {
  // the blue retro fridge from the Leblanc render
  return (
    <group position={[-4.55, 0, -3.5]}>
      <Box size={[0.8, 2.0, 0.75]} radius={0.08} position={[0, 1.0, 0]} color={C.teal} />
      <Box size={[0.82, 0.03, 0.77]} position={[0, 1.3, 0]} color="#3e6870" />
      <Box size={[0.04, 0.3, 0.05]} position={[0.42, 1.55, 0.2]} color={C.metal} mat={{ metalness: 0.6 }} />
      <Box size={[0.04, 0.3, 0.05]} position={[0.42, 1.0, 0.2]} color={C.metal} mat={{ metalness: 0.6 }} />
      <Cyl args={[0.16, 0.16, 0.2, 16]} position={[0, 2.1, 0]} color="#d9824a" />
    </group>
  )
}

export default function Props() {
  return (
    <group>
      <Fridge />
      <Plant position={[4.4, 0, 3.4]} scale={1.2} />
      <Plant position={[-0.2, 0, -3.5]} />
      {/* umbrella stand by the door */}
      <Cyl args={[0.14, 0.14, 0.5, 12]} position={[4.5, 0.25, -0.2]} color={C.woodDark} />
      <Box size={[0.03, 0.8, 0.03]} position={[4.48, 0.6, -0.2]} rotation-z={0.15} color="#5b8c95" />
      {/* doormat */}
      <Box size={[1.1, 0.02, 0.7]} position={[3.6, 0.01, 3.6]} color="#5d7a52" />
      {/* tiny cat on booth seat */}
      <group position={[1.35, 0.6, 2.25]} rotation-y={-0.6}>
        <Sphere r={0.14} scale={[1.3, 0.8, 1]} color="#222" />
        <Sphere r={0.09} position={[0.17, 0.08, 0]} color="#222" />
        <mesh position={[0.2, 0.17, 0.04]}><coneGeometry args={[0.03, 0.07, 4]} /><meshStandardMaterial color="#222" /></mesh>
        <mesh position={[0.2, 0.17, -0.04]}><coneGeometry args={[0.03, 0.07, 4]} /><meshStandardMaterial color="#222" /></mesh>
        <Box size={[0.24, 0.03, 0.03]} position={[-0.25, 0.02, 0.06]} rotation-y={0.5} color="#222" />
      </group>
    </group>
  )
}
