import { Box, Cyl, Sphere, glassMat } from '../parts'

// Each food sits on y=0 and fits roughly inside a 0.5 x 0.5 x 0.5 box.

function Plate({ r = 0.24 }) {
  return (
    <group>
      <Cyl args={[r, r * 0.8, 0.025, 32]} position={[0, 0.0125, 0]} color="#fbf7ee" />
      <Cyl args={[r * 0.98, r * 0.98, 0.004, 32]} position={[0, 0.027, 0]} color="#7aa6c2" />
      <Cyl args={[r * 0.9, r * 0.9, 0.006, 32]} position={[0, 0.03, 0]} color="#fbf7ee" />
    </group>
  )
}

// Triangle wedge built from a 3-sided cylinder.
function Wedge({ position, rotation, color, h = 0.04, r = 0.15 }) {
  return <Cyl args={[r, r, h, 3]} position={position} rotation={rotation} color={color} />
}

export function Sandwich() {
  const layers = [
    ['#e6ad5c', 0.04],
    ['#f2cf5b', 0.02],
    ['#e79aa0', 0.025],
    ['#e6ad5c', 0.04],
  ]
  const halves = [
    { pos: [-0.06, 0.035, 0.02], rot: 0.3 },
    { pos: [0.08, 0.035, -0.04], rot: 0.3 + Math.PI },
  ]
  return (
    <group>
      <Plate />
      {halves.map((half, i) => {
        let y = half.pos[1]
        return (
          <group key={i} position={[half.pos[0], 0, half.pos[2]]} rotation-y={half.rot}>
            {layers.map(([color, h], j) => {
              const el = <Wedge key={j} position={[0, y + h / 2, 0]} color={color} h={h} />
              y += h
              return el
            })}
            {/* powdered sugar */}
            <Wedge position={[0, y + 0.004, 0]} color="#f6ead4" h={0.008} r={0.13} />
          </group>
        )
      })}
      {/* jam ramekin */}
      <Cyl args={[0.05, 0.04, 0.04, 16]} position={[0.13, 0.055, 0.12]} color="#fbf7ee" />
      <Cyl args={[0.044, 0.044, 0.01, 16]} position={[0.13, 0.075, 0.12]} color="#b0232d" />
    </group>
  )
}

export function Parfait() {
  const layers = [
    ['#f4ead4', 0.05],
    ['#d8486a', 0.06],
    ['#f4ead4', 0.05],
    ['#6b3b22', 0.05],
    ['#9fd0a8', 0.05],
  ]
  let y = 0.11
  return (
    <group>
      {/* stem + foot */}
      <Cyl args={[0.08, 0.09, 0.015, 24]} position={[0, 0.008, 0]} mat={{ ...glassMat, opacity: 0.45 }} />
      <Cyl args={[0.015, 0.015, 0.1, 10]} position={[0, 0.06, 0]} mat={{ ...glassMat, opacity: 0.45 }} />
      {layers.map(([color, h], i) => {
        const r = 0.05 + (y - 0.11) * 0.22
        const el = <Cyl key={i} args={[r + h * 0.22, r, h, 20]} position={[0, y + h / 2, 0]} color={color} />
        y += h
        return el
      })}
      <Cyl args={[0.11, 0.05, 0.27, 24, 1, true]} position={[0, 0.11 + 0.135, 0]} mat={{ ...glassMat, side: 2 }} />
      {/* whipped cream swirls */}
      <Sphere r={0.08} scale={[1, 0.6, 1]} position={[0, 0.39, 0]} color="#f6ead4" />
      <Sphere r={0.05} scale={[1, 0.8, 1]} position={[0, 0.44, 0]} color="#f6ead4" />
      <Sphere r={0.028} position={[0.01, 0.5, 0]} color="#c41f2e" mat={{ roughness: 0.2 }} />
      {/* wafer + pocky */}
      <Box size={[0.03, 0.14, 0.07]} position={[-0.05, 0.47, 0.02]} rotation-z={0.25} color="#e2b26a" />
      <Cyl args={[0.008, 0.008, 0.2, 6]} position={[0.05, 0.48, -0.02]} rotation-z={-0.3} color="#4a2e1c" />
    </group>
  )
}

export function Pancakes() {
  return (
    <group>
      <Plate r={0.25} />
      {[0, 1, 2].map((i) => (
        <group key={i} position={[0, 0.06 + i * 0.055, 0]} rotation-y={i * 0.4}>
          <Cyl args={[0.17, 0.17, 0.05, 28]} color="#e9c17f" />
          <Cyl args={[0.168, 0.168, 0.006, 28]} position={[0, 0.026, 0]} color="#b87332" />
        </group>
      ))}
      {/* syrup drip + butter */}
      <Cyl args={[0.12, 0.13, 0.012, 24]} position={[0.01, 0.22, 0]} color="#7a3f12" mat={{ roughness: 0.15 }} />
      <Box size={[0.07, 0.04, 0.07]} radius={0.01} position={[0, 0.245, 0]} rotation-y={0.4} color="#f8e48a" />
      {/* a mini book bookmark, for the bookshop */}
      <Box size={[0.1, 0.02, 0.14]} position={[0.16, 0.05, 0.13]} rotation-y={-0.5} color="#5b8c95" />
      <Box size={[0.09, 0.022, 0.13]} position={[0.16, 0.05, 0.13]} rotation-y={-0.5} color="#fbf7ee" />
    </group>
  )
}

export function CreamSoda() {
  return (
    <group>
      {/* glass + soda */}
      <Cyl args={[0.08, 0.065, 0.3, 24]} position={[0, 0.16, 0]} color="#53c46a" mat={{ transparent: true, opacity: 0.85, emissive: '#2c8c3c', emissiveIntensity: 0.35, roughness: 0.1 }} />
      <Cyl args={[0.09, 0.075, 0.36, 24, 1, true]} position={[0, 0.18, 0]} mat={{ ...glassMat, side: 2 }} />
      <Cyl args={[0.075, 0.075, 0.015, 24]} position={[0, 0.008, 0]} mat={{ ...glassMat, opacity: 0.5 }} />
      {/* bubbles */}
      {[[0.03, 0.1], [-0.02, 0.18], [0.02, 0.25]].map(([x, y], i) => (
        <Sphere key={i} r={0.012} segments={8} position={[x, y, 0.05]} color="#e8ffe8" />
      ))}
      {/* vanilla ice cream + cherry */}
      <Sphere r={0.085} position={[0, 0.34, 0]} color="#fff6e0" />
      <Sphere r={0.03} position={[0.02, 0.43, 0.01]} color="#c41f2e" mat={{ roughness: 0.2 }} />
      <Cyl args={[0.003, 0.003, 0.06, 4]} position={[0.03, 0.47, 0.01]} rotation-z={-0.3} color="#3e5a1e" />
      {/* straw */}
      <Cyl args={[0.01, 0.01, 0.42, 8]} position={[-0.05, 0.32, 0.02]} rotation-z={0.18} color="#f2a7c3" />
    </group>
  )
}

export const FOOD_COMPONENTS = {
  sandwich: Sandwich,
  parfait: Parfait,
  pancakes: Pancakes,
  soda: CreamSoda,
}
