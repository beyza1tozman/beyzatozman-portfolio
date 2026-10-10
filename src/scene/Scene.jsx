import { Canvas } from '@react-three/fiber'
import { useStore } from '../store'
import Cafe from './Cafe'
import Counter from './Counter'
import Booths from './Booths'
import Props from './Props'
import Cabinet from './Cabinet'
import MenuBoard from './MenuBoard'
import CameraRig from './CameraRig'
import Lights from './Lights'

export default function Scene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2.5]}
      camera={{ fov: 32, position: [10.5, 8.2, 13.5], near: 0.3, far: 140 }}
      onPointerMissed={() => useStore.getState().setHovered(null)}
      onCreated={() => document.fonts.ready.then(() => requestAnimationFrame(() => useStore.getState().setSceneReady()))}
    >
      <color attach="background" args={['#1c1715']} />
      <fog attach="fog" args={['#1c1715', 28, 48]} />

      <Lights />

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
