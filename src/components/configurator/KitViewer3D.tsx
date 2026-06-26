'use client'

import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  OrbitControls,
  Environment,
  ContactShadows,
  PresentationControls,
  Float,
  useProgress,
  Html,
} from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { JerseyMesh } from './JerseyMesh'
import type { Team } from '@/types'
import { useConfiguratorStore } from '@/store/useConfiguratorStore'

interface KitViewer3DProps {
  team: Team | null
  className?: string
}

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin" />
        <p className="text-sm text-neutral-400">{Math.round(progress)}%</p>
      </div>
    </Html>
  )
}

function Scene({ primaryColor, secondaryColor }: { primaryColor: string; secondaryColor: string }) {
  const { personalization } = useConfiguratorStore()

  return (
    <>
      {/* Environment lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[3, 5, 3]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.1}
        shadow-camera-far={20}
      />
      <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#b0c4ff" />
      <pointLight position={[0, 4, 2]} intensity={0.3} color="#fff5e0" />

      {/* Soft studio environment */}
      <Environment preset="studio" />

      {/* Jersey with float animation */}
      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.15}>
        <JerseyMesh
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          personalization={personalization}
        />
      </Float>

      {/* Floor shadow */}
      <ContactShadows
        position={[0, -1.4, 0]}
        opacity={0.35}
        scale={4}
        blur={2}
        far={3}
        color="#000000"
      />
    </>
  )
}

export function KitViewer3D({ team, className }: KitViewer3DProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const primaryColor = team?.colors.primary ?? '#E8001C'
  const secondaryColor = team?.colors.secondary ?? '#000000'

  return (
    <div className={`relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-b from-neutral-100 to-neutral-200 ${className ?? ''}`}>
      <Canvas
        shadows
        camera={{ position: [0, 0, 3.5], fov: 42 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#f5f5f5']} />

        <Suspense fallback={<Loader />}>
          <Scene primaryColor={primaryColor} secondaryColor={secondaryColor} />

          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            enableZoom={true}
            minDistance={1.8}
            maxDistance={6}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI * 0.75}
            autoRotate={false}
            dampingFactor={0.05}
            enableDamping
          />
        </Suspense>
      </Canvas>

      {/* Interaction hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none">
        <p className="text-[10px] text-neutral-400 bg-white/70 backdrop-blur px-3 py-1 rounded-full">
          Arraste para girar · Scroll para zoom
        </p>
      </div>

      {/* View presets */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5">
        {(['front', 'back', 'side'] as const).map((view) => (
          <button
            key={view}
            onClick={() => {
              if (!controlsRef.current) return
              const controls = controlsRef.current
              if (view === 'front') {
                controls.setAzimuthalAngle(0)
                controls.setPolarAngle(Math.PI / 2)
              } else if (view === 'back') {
                controls.setAzimuthalAngle(Math.PI)
                controls.setPolarAngle(Math.PI / 2)
              } else {
                controls.setAzimuthalAngle(Math.PI / 2)
                controls.setPolarAngle(Math.PI / 2)
              }
            }}
            className="w-10 h-7 bg-white/80 backdrop-blur text-[10px] font-bold text-neutral-700 rounded-lg hover:bg-white transition-colors shadow-sm capitalize"
          >
            {view === 'front' ? 'Fr.' : view === 'back' ? 'Co.' : 'Lat.'}
          </button>
        ))}
      </div>
    </div>
  )
}
