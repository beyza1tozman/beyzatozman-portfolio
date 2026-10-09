import { Box, Cyl, Sphere, C } from './parts'
import { CoffeeCup, SugarJar } from './Tableware'

// facing: +1 means the seat faces +z
function Bench({ position, facing = 1 }) {
  return (
    <group position={position} rotation-y={facing > 0 ? 0 : Math.PI}>
      <Box size={[1.7, 0.42, 0.62]} position={[0, 0.21, 0]} color={C.woodDark} />
      <Box size={[1.6, 0.18, 0.6]} radius={0.07} position={[0, 0.5, 0.02]} color={C.boothRed} />
      <Box size={[1.6, 0.8, 0.2]} radius={0.08} position={[0, 0.95, -0.24]} color={C.boothRed} />
      {/* tufting buttons */}
      {[-0.5, 0, 0.5].map((x) => (
        <Sphere key={x} r={0.025} segments={8} position={[x, 1.05, -0.13]} color="#8f2a24" />
      ))}
      <Box size={[1.7, 0.08, 0.26]} position={[0, 1.38, -0.26]} color={C.woodDark} />
    </group>
  )
}

function Table({ position }) {
  return (
    <group position={position}>
      <Cyl args={[0.32, 0.36, 0.05, 24]} position={[0, 0.025, 0]} color="#2f2622" />
      <Cyl args={[0.05, 0.05, 0.7, 10]} position={[0, 0.4, 0]} color="#2f2622" />
      <Box size={[1.3, 0.06, 0.75]} radius={0.025} position={[0, 0.76, 0]} color="#f7f1e5" />
      {/* cups & a sugar pot */}
      <CoffeeCup position={[-0.3, 0.79, 0.15]} rotation-y={0.3} />
      <CoffeeCup position={[0.32, 0.79, -0.12]} rotation-y={Math.PI + 0.3} />
      <SugarJar position={[0.05, 0.79, 0]} />
      {/* menu stand */}
      <Box size={[0.2, 0.26, 0.02]} position={[-0.05, 0.92, -0.25]} rotation-x={-0.2} color="#fbf3dc" />
    </group>
  )
}

function Booth({ position }) {
  return (
    <group position={position}>
      <Table position={[0, 0, 0]} />
      <Bench position={[0, 0, -0.85]} facing={1} />
      <Bench position={[0, 0, 0.85]} facing={-1} />
    </group>
  )
}

export default function Booths() {
  return (
    <group>
      <Booth position={[-1.6, 0, -1.0]} />
      <Booth position={[1.9, 0, 1.4]} />
    </group>
  )
}
