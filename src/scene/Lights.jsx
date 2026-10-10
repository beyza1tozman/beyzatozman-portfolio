import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { lighting } from '../lib/timeOfDay'

export default function Lights() {
  const sun = useRef()
  const moon = useRef()
  const hemi = useRef()
  const ambient = useRef()
  useFrame(() => {
    const l = lighting()
    sun.current.intensity = l.sun
    sun.current.color.copy(l.sunColor)
    sun.current.position.copy(l.sunPosition)
    moon.current.intensity = l.moon
    hemi.current.intensity = l.hemi
    hemi.current.color.copy(l.skyColor)
    hemi.current.groundColor.copy(l.groundColor)
    ambient.current.intensity = l.ambient
  })
  return (
    <>
      <hemisphereLight ref={hemi} args={['#fff1dc', '#3a2620', 0.9]} />
      <ambientLight ref={ambient} intensity={0.25} color="#ffe8cc" />
      <directionalLight
        ref={sun}
        position={[7, 11, 6]}
        intensity={1.7}
        color="#fff0d8"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.04}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
      />
      {/* cool moonlight, only noticeable once the sun is down */}
      <directionalLight ref={moon} position={[-4, 10, 8]} intensity={0} color="#9fb3e0" />
    </>
  )
}
