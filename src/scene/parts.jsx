import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'

// Small helpers so the low-poly scene reads like a list of shapes.
// Identical geometries and materials are shared: the scene has hundreds of
// shapes but only a few dozen distinct ones, which keeps startup cheap.

const geometries = new Map()
const materials = new Map()

function cached(map, key, create) {
  let value = map.get(key)
  if (!value) map.set(key, (value = create()))
  return value
}

const boxGeo = (size) => cached(geometries, `box${size}`, () => new THREE.BoxGeometry(...size))
const cylGeo = (args) => cached(geometries, `cyl${args}`, () => new THREE.CylinderGeometry(...args))
const sphereGeo = (r, w, h) => cached(geometries, `sph${r},${w},${h}`, () => new THREE.SphereGeometry(r, w, h))

const standard = (color, roughness, mat) =>
  cached(materials, `${color}|${roughness}|${JSON.stringify(mat ?? {})}`, () => new THREE.MeshStandardMaterial({ color, roughness, ...mat }))

export function Box({ size = [1, 1, 1], color = '#f4e9d3', radius = 0, mat, children, ...props }) {
  const material = standard(color, 0.75, mat)
  if (radius) {
    return (
      <RoundedBox args={size} radius={radius} smoothness={3} material={material} castShadow receiveShadow {...props}>
        {children}
      </RoundedBox>
    )
  }
  return (
    <mesh geometry={boxGeo(size)} material={material} castShadow receiveShadow {...props}>
      {children}
    </mesh>
  )
}

// args: [radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength]
export function Cyl({ args = [0.5, 0.5, 1, 24], color = '#f4e9d3', mat, ...props }) {
  return <mesh geometry={cylGeo(args)} material={standard(color, 0.7, mat)} castShadow receiveShadow {...props} />
}

export function Sphere({ r = 0.5, color = '#f4e9d3', mat, segments = 20, ...props }) {
  return (
    <mesh
      geometry={sphereGeo(r, segments, Math.round(segments * 0.75))}
      material={standard(color, 0.6, mat)}
      castShadow
      receiveShadow
      {...props}
    />
  )
}

export const glassMat = {
  color: '#e8f4f4',
  transparent: true,
  opacity: 0.22,
  roughness: 0.05,
  metalness: 0.1,
  depthWrite: false,
}

export const C = {
  wallCream: '#efe2c8',
  wallRose: '#b9787a',
  trim: '#9c5b5e',
  base: '#7d4b4f',
  wood: '#7a4e2d',
  woodLight: '#d9b98c',
  woodDark: '#4a2e1c',
  boothRed: '#c8423b',
  cream: '#f4e9d3',
  mint: '#8fbf9f',
  leaf: '#4f8a4b',
  pot: '#e9e2d6',
  metal: '#b8b2a8',
  teal: '#5b8c95',
}
