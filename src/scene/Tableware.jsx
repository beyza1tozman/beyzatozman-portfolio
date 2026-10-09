import * as THREE from 'three'
import { makeCanvasTexture } from '../lib/canvasTextures'

// Porcelain cup & saucer and the striped sugar jar, turned on a lathe
// from (radius, height) profiles so they read round instead of blocky.

const lathe = (points, segments = 20) =>
  new THREE.LatheGeometry(points.map(([x, y]) => new THREE.Vector2(x, y)), segments)

const porcelain = new THREE.MeshStandardMaterial({ color: '#fbf8f2', roughness: 0.25, side: THREE.DoubleSide })
const coffee = new THREE.MeshStandardMaterial({ color: '#2a1609', roughness: 0.15 })
const steel = new THREE.MeshStandardMaterial({ color: '#cfccc6', roughness: 0.3, metalness: 0.85, side: THREE.DoubleSide })

// outer wall, rolled lip, inner wall back down to a thick base
const cupGeo = lathe([
  [0, 0], [0.028, 0], [0.03, 0.006], [0.045, 0.018], [0.054, 0.04], [0.059, 0.068],
  [0.06, 0.071], [0.056, 0.071], [0.051, 0.044], [0.04, 0.022], [0, 0.014],
])
const saucerGeo = lathe([
  [0, 0], [0.05, 0], [0.053, 0.004], [0.082, 0.009], [0.102, 0.02], [0.106, 0.023],
  [0.101, 0.024], [0.08, 0.014], [0.064, 0.011], [0, 0.011],
])
const coffeeGeo = new THREE.CircleGeometry(0.0535, 28).rotateX(-Math.PI / 2)
// handle: a C-shaped ring standing on the cup's side
const handleGeo = new THREE.TorusGeometry(0.02, 0.0055, 10, 20, Math.PI * 1.25).rotateZ(-Math.PI * 0.625)
const spoonBowlGeo = new THREE.SphereGeometry(0.014, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2).scale(1, 0.35, 1.6)
const spoonStemGeo = new THREE.BoxGeometry(0.006, 0.003, 0.085)

export function CoffeeCup({ spoon = true, filled = true, ...props }) {
  return (
    <group {...props}>
      <mesh geometry={saucerGeo} material={porcelain} castShadow receiveShadow />
      <group position={[0, 0.011, 0]}>
        <mesh geometry={cupGeo} material={porcelain} castShadow receiveShadow />
        {filled && <mesh geometry={coffeeGeo} material={coffee} position={[0, 0.058, 0]} />}
        <mesh geometry={handleGeo} material={porcelain} position={[0.064, 0.04, 0]} />
      </group>
      {spoon && (
        <group position={[-0.03, 0.017, 0.07]} rotation-y={-1.1} rotation-z={0.05}>
          <mesh geometry={spoonBowlGeo} material={steel} rotation-x={Math.PI} />
          <mesh geometry={spoonStemGeo} material={steel} position={[0, 0.002, 0.06]} />
        </group>
      )}
    </group>
  )
}

const stripes = makeCanvasTexture(64, 4, (ctx, w, h) => {
  const n = 10
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = i % 2 ? '#f6f1ea' : '#a3182a'
    ctx.fillRect((i * w) / n, 0, w / n + 0.5, h)
  }
})
const jar = new THREE.MeshStandardMaterial({ map: stripes, roughness: 0.2 })
const jarGeo = lathe([[0, 0], [0.04, 0], [0.05, 0.02], [0.053, 0.05], [0.046, 0.085], [0.038, 0.09], [0, 0.09]], 24)
const lidGeo = lathe([[0, 0], [0.042, 0], [0.044, 0.006], [0.036, 0.016], [0.012, 0.024], [0.01, 0.034], [0, 0.036]])
const bailGeo = new THREE.TorusGeometry(0.05, 0.0025, 6, 24, Math.PI)

export function SugarJar(props) {
  return (
    <group {...props}>
      <mesh geometry={jarGeo} material={jar} castShadow receiveShadow />
      <mesh geometry={lidGeo} material={steel} position={[0, 0.088, 0]} />
      <mesh geometry={bailGeo} material={steel} position={[0, 0.085, 0]} />
    </group>
  )
}

// Pour-over station: a ceramic cone dripper with a paper filter resting on
// a glass carafe, and a copper gooseneck kettle beside it.

const glass = new THREE.MeshStandardMaterial({
  color: '#eef6f6', transparent: true, opacity: 0.28, roughness: 0.05, metalness: 0.1,
  depthWrite: false, side: THREE.DoubleSide,
})
const paper = new THREE.MeshStandardMaterial({ color: '#efe5cf', roughness: 0.9, side: THREE.DoubleSide })
const grounds = new THREE.MeshStandardMaterial({ color: '#4a2e1c', roughness: 0.95 })
const copper = new THREE.MeshStandardMaterial({ color: '#c27a4a', roughness: 0.35, metalness: 0.8 })
const blackGrip = new THREE.MeshStandardMaterial({ color: '#2a2320', roughness: 0.6 })

const carafeGeo = lathe([
  [0, 0], [0.05, 0], [0.062, 0.025], [0.064, 0.055], [0.052, 0.1], [0.046, 0.118], [0.05, 0.13],
], 24)
const carafeCoffeeGeo = lathe([[0, 0.004], [0.049, 0.004], [0.059, 0.025], [0.06, 0.05], [0, 0.05]], 24)
const carafeHandleGeo = new THREE.TorusGeometry(0.03, 0.007, 8, 18, Math.PI * 1.2).rotateZ(-Math.PI * 0.6)

// cone with a flat foot ring that sits on the carafe mouth
const dripperGeo = lathe([
  [0.022, 0], [0.064, 0], [0.064, 0.008], [0.03, 0.01], [0.074, 0.085], [0.08, 0.088],
  [0.074, 0.09], [0.068, 0.086], [0.026, 0.014], [0.022, 0.014],
])
const filterGeo = lathe([[0.012, 0.016], [0.07, 0.096], [0.071, 0.102]], 24)
const groundsGeo = new THREE.CircleGeometry(0.055, 24).rotateX(-Math.PI / 2)
const dripperHandleGeo = new THREE.TorusGeometry(0.02, 0.006, 8, 14, Math.PI * 1.1).rotateZ(-Math.PI * 0.55)

export function PourOver(props) {
  return (
    <group {...props}>
      <mesh geometry={carafeCoffeeGeo} material={coffee} />
      <mesh geometry={carafeGeo} material={glass} />
      <mesh geometry={carafeHandleGeo} material={glass} position={[0.075, 0.07, 0]} />
      <group position={[0, 0.128, 0]}>
        <mesh geometry={dripperGeo} material={porcelain} castShadow receiveShadow />
        <mesh geometry={filterGeo} material={paper} />
        <mesh geometry={groundsGeo} material={grounds} position={[0, 0.07, 0]} />
        <mesh geometry={dripperHandleGeo} material={porcelain} position={[0.088, 0.05, 0]} />
      </group>
    </group>
  )
}

const kettleGeo = lathe([
  [0, 0], [0.068, 0], [0.074, 0.01], [0.075, 0.05], [0.066, 0.1], [0.045, 0.125], [0.04, 0.13], [0, 0.13],
], 24)
const kettleKnobGeo = new THREE.SphereGeometry(0.014, 12, 8)
// gooseneck: leaves the body low down, climbs, then curls over to pour
const spoutGeo = new THREE.TubeGeometry(
  new THREE.CatmullRomCurve3([
    [-0.06, 0.02, 0], [-0.1, 0.04, 0], [-0.13, 0.11, 0], [-0.15, 0.17, 0], [-0.175, 0.185, 0], [-0.195, 0.175, 0],
  ].map(([x, y, z]) => new THREE.Vector3(x, y, z))),
  20, 0.007, 6,
)
const kettleHandleGeo = new THREE.TorusGeometry(0.05, 0.009, 8, 20, Math.PI * 1.1).rotateZ(-Math.PI * 0.55)

export function GooseneckKettle(props) {
  return (
    <group {...props}>
      <mesh geometry={kettleGeo} material={copper} castShadow receiveShadow />
      <mesh geometry={kettleKnobGeo} material={blackGrip} position={[0, 0.138, 0]} />
      <mesh geometry={spoutGeo} material={copper} castShadow />
      <mesh geometry={kettleHandleGeo} material={blackGrip} position={[0.075, 0.075, 0]} />
    </group>
  )
}

// Shelf stock for the back cupboard: bean jars, a teapot and coffee tins.

const beans = new THREE.MeshStandardMaterial({ color: '#4a2a16', roughness: 0.75 })
const cork = new THREE.MeshStandardMaterial({ color: '#c49a6c', roughness: 0.9 })
const jarGlassGeo = lathe([[0, 0], [0.06, 0], [0.066, 0.012], [0.066, 0.17], [0.05, 0.19], [0.05, 0.2]], 24)
const jarCorkGeo = new THREE.CylinderGeometry(0.052, 0.046, 0.04, 20)

export function BeanJar({ fill = 0.7, ...props }) {
  const h = 0.17 * fill
  return (
    <group {...props}>
      <mesh material={beans} position={[0, 0.006 + h / 2, 0]}>
        <cylinderGeometry args={[0.06, 0.06, h, 16]} />
      </mesh>
      <mesh geometry={jarGlassGeo} material={glass} />
      <mesh geometry={jarCorkGeo} material={cork} position={[0, 0.21, 0]} />
    </group>
  )
}

const teapotGeo = lathe([[0, 0], [0.06, 0], [0.085, 0.03], [0.09, 0.06], [0.08, 0.1], [0.05, 0.125], [0.045, 0.13], [0, 0.13]], 24)
const teapotLidGeo = lathe([[0, 0], [0.048, 0], [0.04, 0.015], [0.012, 0.022], [0.016, 0.035], [0, 0.04]], 24)
const teapotSpoutGeo = new THREE.TubeGeometry(
  new THREE.CatmullRomCurve3([[-0.07, 0.04, 0], [-0.11, 0.07, 0], [-0.125, 0.11, 0], [-0.14, 0.13, 0]].map(([x, y, z]) => new THREE.Vector3(x, y, z))),
  12, 0.012, 6,
)
const teapotHandleGeo = new THREE.TorusGeometry(0.04, 0.01, 8, 18, Math.PI * 1.25).rotateZ(-Math.PI * 0.625)

export function Teapot(props) {
  return (
    <group {...props}>
      <mesh geometry={teapotGeo} material={porcelain} castShadow receiveShadow />
      <mesh geometry={teapotLidGeo} material={porcelain} position={[0, 0.128, 0]} />
      <mesh geometry={teapotSpoutGeo} material={porcelain} />
      <mesh geometry={teapotHandleGeo} material={porcelain} position={[0.088, 0.07, 0]} />
    </group>
  )
}

const tinLabel = (body, band) =>
  makeCanvasTexture(128, 64, (ctx, w, h) => {
    ctx.fillStyle = body
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = band
    ctx.fillRect(0, h * 0.3, w, h * 0.4)
    ctx.fillStyle = body
    ctx.font = '800 15px Fraunces'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    // the label wraps the tin twice so it reads from any angle
    ctx.fillText('COFFEE', w * 0.25, h / 2 + 1)
    ctx.fillText('COFFEE', w * 0.75, h / 2 + 1)
  })
const tinGeo = new THREE.CylinderGeometry(0.062, 0.062, 0.17, 20, 1, true)
const tinTopGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.03, 20)
const tinKnobGeo = new THREE.SphereGeometry(0.014, 10, 6)
const TINS = {
  cream: [new THREE.MeshStandardMaterial({ map: tinLabel('#f4e9d3', '#c8423b'), roughness: 0.35, metalness: 0.2 }), '#c8423b'],
  teal: [new THREE.MeshStandardMaterial({ map: tinLabel('#5b8c95', '#f4e9d3'), roughness: 0.35, metalness: 0.2 }), '#2f4f55'],
  mustard: [new THREE.MeshStandardMaterial({ map: tinLabel('#e3b04b', '#4a2e1c'), roughness: 0.35, metalness: 0.2 }), '#4a2e1c'],
}

export function CoffeeTin({ color = 'cream', ...props }) {
  const [body, lid] = TINS[color]
  return (
    <group {...props}>
      <mesh geometry={tinGeo} material={body} position={[0, 0.085, 0]} castShadow receiveShadow />
      <mesh geometry={tinTopGeo} position={[0, 0.18, 0]}>
        <meshStandardMaterial color={lid} roughness={0.35} metalness={0.3} />
      </mesh>
      <mesh geometry={tinKnobGeo} position={[0, 0.2, 0]}>
        <meshStandardMaterial color={lid} roughness={0.35} metalness={0.3} />
      </mesh>
    </group>
  )
}
