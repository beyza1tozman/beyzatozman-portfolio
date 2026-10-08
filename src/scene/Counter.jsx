import { Box, Cyl, Sphere, C, glassMat } from './parts'

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

function Siphon({ position }) {
  return (
    <group position={position}>
      <Cyl args={[0.1, 0.12, 0.04, 16]} position={[0, 0.02, 0]} color="#333" mat={{ metalness: 0.6 }} />
      <Sphere r={0.11} position={[0, 0.16, 0]} color="#5b3a22" mat={{ transparent: true, opacity: 0.85 }} />
      <Cyl args={[0.06, 0.04, 0.24, 16]} position={[0, 0.38, 0]} mat={glassMat} />
      <Cyl args={[0.012, 0.012, 0.5, 6]} position={[0.14, 0.25, 0]} color="#888" mat={{ metalness: 0.7 }} />
    </group>
  )
}

function Cup({ position }) {
  return (
    <group position={position}>
      <Cyl args={[0.1, 0.1, 0.015, 20]} color="#fbf7ee" />
      <Cyl args={[0.055, 0.045, 0.08, 16]} position={[0, 0.05, 0]} color="#fbf7ee" />
      <Cyl args={[0.05, 0.05, 0.005, 16]} position={[0, 0.088, 0]} color="#4a2e1c" />
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
      {[-1.1, 0, 1.1].map((x) => (
        <group key={x} position={[x, 2.15, 0.16]}>
          <Box size={[1.0, 1.36, 0.04]} mat={glassMat} />
          {/* plates and jars on shelves */}
          <Box size={[0.9, 0.03, 0.3]} position={[0, -0.05, -0.15]} color={C.woodLight} />
          {[-0.3, 0, 0.3].map((dx) => (
            <Cyl key={dx} args={[0.09, 0.09, 0.22, 12]} position={[dx, 0.32, -0.15]} color={dx === 0 ? '#e9a6a0' : '#f4efe4'} />
          ))}
          {[-0.25, 0.05, 0.3].map((dx) => (
            <Cyl key={dx} args={[0.14, 0.14, 0.03, 16]} rotation-x={Math.PI / 2.4} position={[dx, -0.35, -0.12]} color="#fbf7ee" />
          ))}
        </group>
      ))}
    </group>
  )
}

export default function Counter() {
  return (
    <group>
      <BackCupboard />
      {/* bar counter */}
      <group position={[2.8, 0, -1.9]}>
        <Box size={[3.6, 1.0, 0.6]} position={[0, 0.5, 0]} color={C.wallRose} />
        <Box size={[3.64, 0.1, 0.62]} position={[0, 0.55, 0.32]} color={C.trim} />
        <Box size={[3.9, 0.08, 0.9]} radius={0.03} position={[0, 1.04, 0.05]} color={C.woodLight} />
        <Siphon position={[-1.2, 1.08, -0.05]} />
        <Siphon position={[-0.75, 1.08, -0.05]} />
        <Cup position={[0.2, 1.08, 0.2]} />
        <Cup position={[1.1, 1.08, 0.15]} />
        {/* register */}
        <Box size={[0.4, 0.3, 0.32]} radius={0.04} position={[1.55, 1.24, -0.1]} color="#e8d27a" />
      </group>
      {[1.6, 2.6, 3.6].map((x) => (
        <Stool key={x} position={[x, 0, -1.05]} />
      ))}
    </group>
  )
}
