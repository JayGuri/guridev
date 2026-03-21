'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useRef, Suspense } from 'react';

function Monitor({ position, rotationY = 0, screenArgs, standHeight }) {
  return (
    <group position={position} rotation-y={rotationY}>
      {/* Screen */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={screenArgs} />
        <meshStandardMaterial color="#1A1A22" roughness={0.7} metalness={0.2} />
      </mesh>
      {/* Stand */}
      <mesh
        position={[0, -(screenArgs[1] / 2 + standHeight / 2), 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.08, standHeight, 0.08]} />
        <meshStandardMaterial color="#1A1A22" roughness={0.7} metalness={0.2} />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 6, 4]} intensity={0.9} castShadow />
      <pointLight position={[-4, 3, -2]} color="#7C6FF7" intensity={1.2} />
      <pointLight position={[4, 1, 3]} color="#E8935A" intensity={0.4} />

      <Environment preset="city" />

      {/* Desk */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.5, 0.08, 1.2]} />
        <meshStandardMaterial color="#2A2A30" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Monitor Left */}
      <Monitor
        position={[-1.2, 0.7, -0.2]}
        rotationY={0.25}
        screenArgs={[1.0, 0.65, 0.04]}
        standHeight={0.3}
      />

      {/* Monitor Center */}
      <Monitor
        position={[0, 0.8, -0.3]}
        rotationY={0}
        screenArgs={[1.2, 0.75, 0.04]}
        standHeight={0.35}
      />

      {/* Monitor Right */}
      <Monitor
        position={[1.2, 0.7, -0.2]}
        rotationY={-0.25}
        screenArgs={[1.0, 0.65, 0.04]}
        standHeight={0.3}
      />

      {/* Floor */}
      <mesh
        rotation-x={-Math.PI / 2}
        position={[0, -0.04, 0]}
        receiveShadow
      >
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#080809" />
      </mesh>

      {/* Camera controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.2}
        autoRotate
        autoRotateSpeed={0.4}
      />
    </>
  );
}

export default function RoomScene() {
  return (
    <Canvas
      camera={{ fov: 45, position: [0, 2.5, 9] }}
      shadows
      gl={{ antialias: true }}
      dpr={[1, 1.5]}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
