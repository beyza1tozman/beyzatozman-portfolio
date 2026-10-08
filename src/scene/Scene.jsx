import { Canvas } from '@react-three/fiber'
import { useStore } from '../store'
import Cafe from './Cafe'
import Counter from './Counter'
import Booths from './Booths'
import Props from './Props'
import Cabinet from './Cabinet'
import MenuBoard from './MenuBoard'
import CameraRig from './CameraRig'

export default function Scene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2.5]}
      camera={{ fov: 32, position: [10.5, 8.2, 13.5], near: 0.5, far: 80 }}
      onPointerMissed={() => useStore.getState().setHovered(null)}
      onCreated={() => document.fonts.ready.then(() => requestAnimationFrame(() => useStore.getState().setSceneReady()))}
    >
      <color attach="background" args={['#1c1715']} />
      <fog attach="fog" args={['#1c1715', 28, 48]} />

      <hemisphereLight args={['#fff1dc', '#3a2620', 0.9]} />
      <ambientLight intensity={0.25} color="#ffe8cc" />
      <directionalLight
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

      <Cafe />
      <Counter />
      <Booths />
      <Props />
      <Cabinet />
      <MenuBoard position={[2.5, -0.1, 5.2]} rotation-y={0.78} scale={1.3} />

      <CameraRig />
    </Canvas>
  )
}
