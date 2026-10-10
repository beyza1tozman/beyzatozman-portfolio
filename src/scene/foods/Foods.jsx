import { useMemo } from 'react'
import { Box, Cyl, Sphere, glassMat } from '../parts'
import { flagTexture } from '../../lib/canvasTextures'

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

// Half sphere sitting on its flat side; scale stretches it into mounds.
function Dome({ r, color, scale, position, roughness = 0.6 }) {
  return (
    <mesh position={position} scale={scale} castShadow receiveShadow>
      <sphereGeometry args={[r, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color={color} roughness={roughness} />
    </mesh>
  )
}

function Ring({ r, tube, color, position, rotation }) {
  return (
    <mesh position={position} rotation={rotation} castShadow>
      <torusGeometry args={[r, tube, 6, 18]} />
      <meshStandardMaterial color={color} roughness={0.6} />
    </mesh>
  )
}

const PLATE_TOP = 0.032

// Paper flag on a toothpick; the word reads correctly from both sides.
function Flag({ text, position }) {
  const tex = useMemo(() => flagTexture(text), [text])
  return (
    <group position={position} rotation-z={-0.12}>
      <Cyl args={[0.004, 0.004, 0.2, 5]} position={[0, 0.1, 0]} color="#e2c49a" />
      <mesh position={[0.082, 0.168, 0]} castShadow>
        <boxGeometry args={[0.162, 0.054, 0.003]} />
        <meshStandardMaterial attach="material-0" color="#fdfbf6" />
        <meshStandardMaterial attach="material-1" color="#fdfbf6" />
        <meshStandardMaterial attach="material-2" color="#fdfbf6" />
        <meshStandardMaterial attach="material-3" color="#fdfbf6" />
        <meshStandardMaterial attach="material-4" map={tex} roughness={0.9} />
        <meshStandardMaterial attach="material-5" map={tex} roughness={0.9} />
      </mesh>
    </group>
  )
}

// Steel fork, tines pointing along -z.
function Fork(props) {
  // only lightly metallic: the scene has no reflections, so real chrome reads as black
  const steel = { metalness: 0.35, roughness: 0.3 }
  return (
    <group {...props}>
      <Box size={[0.018, 0.005, 0.13]} position={[0, 0, 0.05]} color="#e6e4df" mat={steel} />
      <Box size={[0.012, 0.005, 0.03]} position={[0, 0, -0.03]} color="#e6e4df" mat={steel} />
      <Box size={[0.032, 0.005, 0.02]} position={[0, 0, -0.055]} color="#e6e4df" mat={steel} />
      {[-0.0135, -0.0045, 0.0045, 0.0135].map((x) => (
        <Box key={x} size={[0.005, 0.005, 0.045]} position={[x, 0, -0.0875]} color="#e6e4df" mat={steel} />
      ))}
    </group>
  )
}

export function Omurice() {
  // omelette: an egg-yellow dome, long along x
  const [rx, ry, rz] = [0.17, 0.085, 0.105]
  // angle from the top of the omelette, and the blob's [width, thickness, length]
  const ketchup = [
    { a: 0.1, size: [0.062, 0.022, 0.07] },
    { a: 0.75, size: [0.058, 0.02, 0.05] },
    { a: 1.25, size: [0.068, 0.02, 0.045] },
  ]
  return (
    <group>
      <Plate r={0.22} />
      <Dome r={1} scale={[rx, ry, rz]} position={[0, PLATE_TOP, 0]} color="#f5c94e" roughness={0.5} />
      {/* ketchup: rounded blobs lying on the curve, over the top and down the front */}
      {ketchup.map(({ a, size }, i) => (
        <Sphere key={i} r={1} scale={size} position={[0.01, PLATE_TOP + ry * Math.cos(a), rz * Math.sin(a)]} rotation-x={a} color="#c4231b" mat={{ roughness: 0.2 }} />
      ))}
      {/* a little pool where it reaches the plate */}
      <Sphere r={1} scale={[0.075, 0.012, 0.04]} position={[0.01, PLATE_TOP + 0.004, rz + 0.012]} color="#c4231b" mat={{ roughness: 0.2 }} />
      {/* parsley at one end */}
      {[[-0.19, 0.055, 0.02], [-0.2, 0.06, -0.03], [-0.17, 0.075, -0.005]].map((pos, i) => (
        <Sphere key={i} r={0.032} segments={10} position={pos} color={i === 2 ? '#4f9a3a' : '#3f8530'} />
      ))}
      {/* "itadakimasu", what you say before eating */}
      <Flag text="いただきます" position={[0.05, 0.07, -0.02]} />
    </group>
  )
}

export function Naporitan() {
  // where a topping lands on the spaghetti mound at (x, z)
  const [mr, mh] = [0.165, 0.09]
  const onTop = (x, z, lift = 0) => [x, PLATE_TOP + mh * Math.sqrt(Math.max(0, 1 - (x * x + z * z) / (mr * mr))) + lift, z]
  const strands = [
    [0.02, 0.03, 0.3], [-0.06, -0.02, 1.2], [0.07, -0.06, 2.1], [-0.04, 0.08, 0.8],
    [0.09, 0.06, 1.7], [-0.1, -0.07, 2.6], [0.0, -0.1, 0.4], [-0.11, 0.03, 1.5],
  ]
  return (
    <group>
      {/* steel oval plate */}
      <Cyl args={[0.23, 0.2, 0.025, 32]} scale={[1.1, 1, 0.92]} position={[0, 0.0125, 0]} color="#bfbcb6" mat={{ metalness: 0.6, roughness: 0.35 }} />
      <Dome r={1} scale={[mr, mh, mr]} position={[0, PLATE_TOP, 0]} color="#e2702e" />
      {/* loose spaghetti loops */}
      {strands.map(([x, z, rot], i) => (
        <Ring key={i} r={0.045} tube={0.007} color={i % 2 ? '#f08d3e' : '#e9803a'} position={onTop(x, z, -0.006)} rotation={[Math.PI / 2 - 0.3, 0, rot]} />
      ))}
      {/* sausage slices */}
      {[[0.05, -0.02], [-0.07, 0.05], [0.02, 0.09], [-0.03, -0.08], [0.11, 0.04]].map(([x, z], i) => (
        <Cyl key={i} args={[0.022, 0.022, 0.012, 14]} position={onTop(x, z, 0.004)} rotation={[0.4, i, 0.3]} color="#c9493a" />
      ))}
      {/* green pepper and onion */}
      {[[-0.02, 0.04], [0.08, -0.07], [-0.1, -0.02]].map(([x, z], i) => (
        <Ring key={i} r={0.022} tube={0.006} color="#4c9a3c" position={onTop(x, z, 0.004)} rotation={[Math.PI / 2 - 0.2, 0, i]} />
      ))}
      {[[0.04, 0.06], [-0.05, -0.05]].map(([x, z], i) => (
        <Ring key={i} r={0.03} tube={0.005} color="#f4e7cc" position={onTop(x, z, 0.002)} rotation={[Math.PI / 2 - 0.25, 0, i * 2]} />
      ))}
      {/* fork stuck into the spaghetti, handle tilted up towards the viewer */}
      <group position={[0.06, 0.17, 0.0]} rotation-y={-0.6}>
        <Fork rotation-x={-1.05} />
      </group>
    </group>
  )
}

export const FOOD_COMPONENTS = {
  sandwich: Sandwich,
  parfait: Parfait,
  pancakes: Pancakes,
  soda: CreamSoda,
  omurice: Omurice,
  naporitan: Naporitan,
}
