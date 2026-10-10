import * as THREE from 'three'
import { Box, Cyl, Sphere, C } from './parts'

// Dieffenbachia-style plant: a few tall canes with broad pointed leaves,
// pale along the midrib, arching out of a plain white pot.
function makeLeafGeometry() {
  const geo = new THREE.PlaneGeometry(1, 1, 4, 9)
  const pos = geo.attributes.position
  const colors = []
  const pale = new THREE.Color('#b9d98a')
  const dark = new THREE.Color('#3f7a35')
  const c = new THREE.Color()
  for (let i = 0; i < pos.count; i++) {
    const u = pos.getX(i) // -0.5..0.5 across
    const v = pos.getY(i) + 0.5 // 0 at the stalk, 1 at the tip
    const s = Math.max(0, (v - 0.15) / 0.85)
    const width = v < 0.15 ? 0.03 : 0.56 * Math.pow(Math.sin(Math.PI * Math.pow(s, 0.65)), 0.75) + 0.01
    const x = u * width
    pos.setXYZ(i, x, v, 0.35 * v * v + 0.25 * Math.abs(x))
    c.copy(dark).lerp(pale, Math.max(0, 1 - Math.abs(u) * 2.6) * (v > 0.15 ? 0.9 : 0))
    colors.push(c.r, c.g, c.b)
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  geo.computeVertexNormals()
  return geo
}

const leafGeo = makeLeafGeometry()
const leafMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.55, side: THREE.DoubleSide })
const potGeo = new THREE.LatheGeometry(
  [[0, 0], [0.17, 0], [0.19, 0.02], [0.21, 0.4], [0.225, 0.41], [0.225, 0.44], [0.2, 0.44], [0.19, 0.4], [0, 0.4]].map(
    ([x, y]) => new THREE.Vector2(x, y),
  ),
  24,
)
const potMat = new THREE.MeshStandardMaterial({ color: C.pot, roughness: 0.35 })

// canes: lean, height, and leaves as [height along cane 0..1, size]
const CANES = [
  { lean: [0.06, 0], h: 1.05, leaves: [[0.35, 0.5], [0.5, 0.56], [0.63, 0.58], [0.75, 0.55], [0.86, 0.5], [0.95, 0.45], [1, 0.4]] },
  { lean: [-0.12, 0.1], h: 0.8, leaves: [[0.3, 0.48], [0.5, 0.55], [0.68, 0.52], [0.85, 0.46], [1, 0.4]] },
  { lean: [0.1, -0.14], h: 0.6, leaves: [[0.2, 0.46], [0.45, 0.5], [0.7, 0.48], [1, 0.42]] },
]

function Plant({ position, scale = 1 }) {
  let n = 0
  return (
    <group position={position} scale={scale}>
      <mesh geometry={potGeo} material={potMat} castShadow receiveShadow />
      <Cyl args={[0.19, 0.19, 0.01, 24]} position={[0, 0.41, 0]} color="#3a2416" />
      {CANES.map((cane, ci) => (
        <group key={ci} position={[cane.lean[0] * 0.8, 0.4, cane.lean[1] * 0.8]} rotation={[cane.lean[1], 0, -cane.lean[0]]}>
          <Cyl args={[0.009, 0.014, cane.h, 8]} position={[0, cane.h / 2, 0]} color="#5d6b3a" />
          {cane.leaves.map(([t, size]) => {
            const yaw = n++ * 2.4 // golden angle so leaves spiral around
            return (
              <group key={t} position={[0, cane.h * t, 0]} rotation-y={yaw}>
                <mesh geometry={leafGeo} material={leafMat} rotation-x={0.55 + (1 - t) * 0.6} scale={size} castShadow />
              </group>
            )
          })}
        </group>
      ))}
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
    </group>
  )
}

export default function Props() {
  return (
    <group>
      <Fridge />
      <Plant position={[4.4, 0, 3.4]} scale={1.2} />
      <Plant position={[-0.2, 0, -3.5]} />
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
